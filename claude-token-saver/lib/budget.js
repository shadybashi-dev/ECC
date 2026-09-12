'use strict';

/**
 * Context-budget auditor: measures Claude Code context overhead across
 * agents, skills, rules, MCP servers, and CLAUDE.md files, then recommends
 * the highest-leverage token savings.
 *
 * Automates the ECC `context-budget` skill as a deterministic Node script.
 */

const fs = require('fs');
const path = require('path');
const { estimateTokens, countWords } = require('./estimator');

const MCP_TOKENS_PER_TOOL = 500;
const CLI_REPLACEABLE = new Set(['gh', 'git', 'npm', 'node', 'supabase', 'vercel', 'docker', 'kubectl']);
const HEAVY_AGENT_LINES = 200;
const HEAVY_SKILL_LINES = 400;
const HEAVY_RULE_LINES = 100;
const BLOATED_DESC_WORDS = 30;

function readText(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

function countLines(text) {
  if (!text) return 0;
  return text.split('\n').length;
}

/** Extract YAML frontmatter description (first ~40 lines, naive parse). */
function frontmatterDescription(text) {
  if (!text || !text.startsWith('---')) return '';
  const end = text.indexOf('\n---', 3);
  if (end === -1) return '';
  const fm = text.slice(0, end);
  const m = fm.match(/^description:\s*(.+)$/m);
  return m ? m[1].replace(/^[>"|+-]+\s*/, '').trim() : '';
}

function scanMarkdownFiles(root, subdir, recursive) {
  const dir = path.join(root, subdir);
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        if (recursive) walk(full);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        out.push(full);
      }
    }
  };
  walk(dir);
  return out.sort();
}

function scanSkills(root) {
  const dir = path.join(root, 'skills');
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillMd = path.join(dir, entry.name, 'SKILL.md');
    if (fs.existsSync(skillMd)) out.push(skillMd);
  }
  return out.sort();
}

function scanMcp(root) {
  const candidates = ['.mcp.json', 'mcp-config.json', '.claude/mcp.json'];
  for (const c of candidates) {
    const p = path.join(root, c);
    const text = readText(p);
    if (!text) continue;
    try {
      const json = JSON.parse(text);
      const servers = json.mcpServers || json.servers || {};
      const rows = [];
      for (const [name, cfg] of Object.entries(servers)) {
        const tools = Array.isArray(cfg.tools) ? cfg.tools.length
          : typeof cfg.toolCount === 'number' ? cfg.toolCount
            : 10; // unknown: conservative placeholder
        const cmd = String(cfg.command || cfg.cmd || '').split(' ')[0].split('/').pop();
        rows.push({ name, tools, command: cmd, configFile: c });
      }
      return { configFile: c, servers: rows };
    } catch {
      return { configFile: c, servers: [], parseError: true };
    }
  }
  return { configFile: null, servers: [] };
}

function fileStats(root, full) {
  const text = readText(full) || '';
  const tokens = estimateTokens(text).tokens;
  return {
    file: path.relative(root, full).split(path.sep).join('/'),
    lines: countLines(text),
    tokens,
    descWords: countWords(frontmatterDescription(text)),
  };
}

/**
 * Audit a repo/project root. Returns a structured report object.
 */
function audit(root, options = {}) {
  const abs = path.resolve(root || '.');
  const verbose = !!options.verbose;

  const agents = scanMarkdownFiles(abs, 'agents', false).map((f) => fileStats(abs, f));
  const skills = scanSkills(abs).map((f) => fileStats(abs, f));
  const rules = scanMarkdownFiles(abs, 'rules', true).map((f) => fileStats(abs, f));

  const claudeFiles = ['CLAUDE.md', '.claude/CLAUDE.md']
    .map((c) => path.join(abs, c))
    .filter((p) => fs.existsSync(p))
    .map((f) => fileStats(abs, f));

  const mcp = scanMcp(abs);
  const mcpTools = mcp.servers.reduce((n, s) => n + s.tools, 0);
  const mcpTokens = mcpTools * MCP_TOKENS_PER_TOOL;

  const sum = (rows) => rows.reduce((n, r) => n + r.tokens, 0);
  const totals = {
    agents: { count: agents.length, tokens: sum(agents) },
    skills: { count: skills.length, tokens: sum(skills) },
    rules: { count: rules.length, tokens: sum(rules) },
    mcp: { servers: mcp.servers.length, tools: mcpTools, tokens: mcpTokens, configFile: mcp.configFile },
    claudeMd: { count: claudeFiles.length, tokens: sum(claudeFiles) },
  };
  totals.all = totals.agents.tokens + totals.skills.tokens + totals.rules.tokens
    + totals.mcp.tokens + totals.claudeMd.tokens;

  const issues = [];
  const push = (sev, title, detail, savings) => issues.push({ severity: sev, title, detail, savings: savings || 0 });

  const heavyAgents = agents.filter((a) => a.lines > HEAVY_AGENT_LINES);
  for (const a of heavyAgents) {
    push('warn', 'Heavy agent', `${a.file} is ${a.lines} lines (~${a.tokens} tokens). Agents load on every Task spawn — trim or split it.`, Math.round(a.tokens * 0.4));
  }
  const bloated = agents.filter((a) => a.descWords > BLOATED_DESC_WORDS);
  for (const a of bloated) {
    push('warn', 'Bloated agent description', `${a.file} description is ${a.descWords} words. Descriptions load into every Task call — keep under ${BLOATED_DESC_WORDS} words.`, 60);
  }
  const heavySkills = skills.filter((s) => s.lines > HEAVY_SKILL_LINES);
  for (const s of heavySkills) {
    push('warn', 'Heavy skill', `${s.file} is ${s.lines} lines. Consider splitting reference material out.`, Math.round(s.tokens * 0.3));
  }
  const heavyRules = rules.filter((r) => r.lines > HEAVY_RULE_LINES);
  for (const r of heavyRules) {
    push('info', 'Long rule file', `${r.file} is ${r.lines} lines. Rules are always-on context.`, Math.round(r.tokens * 0.3));
  }
  const claudeLines = claudeFiles.reduce((n, f) => n + f.lines, 0);
  if (claudeLines > 300) {
    push('warn', 'CLAUDE.md bloat', `Combined CLAUDE.md is ${claudeLines} lines. Move details into skills/rules.`, Math.round(totals.claudeMd.tokens * 0.4));
  }
  if (mcp.servers.length > 10) {
    push('warn', 'MCP over-subscription', `${mcp.servers.length} MCP servers configured. Each tool schema costs ~${MCP_TOKENS_PER_TOOL} tokens.`, Math.round(mcpTokens * 0.3));
  }
  for (const s of mcp.servers) {
    if (s.tools > 20) {
      push('warn', 'Tool-heavy MCP server', `"${s.name}" exposes ${s.tools} tools (~${s.tools * MCP_TOKENS_PER_TOOL} tokens). Disable unused tools.`, Math.round(s.tools * MCP_TOKENS_PER_TOOL * 0.4));
    }
    if (s.command && CLI_REPLACEABLE.has(s.command)) {
      push('info', 'CLI-replaceable MCP server', `"${s.name}" wraps the \`${s.command}\` CLI. Calling the CLI directly costs ~0 tokens.`, s.tools * MCP_TOKENS_PER_TOOL);
    }
  }
  if (mcp.parseError) {
    push('error', 'Unparseable MCP config', `${mcp.configFile} is not valid JSON.`, 0);
  }

  issues.sort((a, b) => b.savings - a.savings);
  const potentialSavings = issues.reduce((n, i) => n + i.savings, 0);

  const report = {
    root: abs,
    totals,
    issues,
    potentialSavings,
    topOptimizations: issues.slice(0, 3),
  };
  if (verbose) {
    report.files = { agents, skills, rules, claudeMd: claudeFiles, mcpServers: mcp.servers };
  }
  return report;
}

module.exports = {
  MCP_TOKENS_PER_TOOL,
  audit,
};
