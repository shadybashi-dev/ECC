'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { audit } = require('../lib/budget');

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-budget-'));
  fs.mkdirSync(path.join(root, 'agents'));
  const longDesc = Array.from({ length: 40 }, (_, i) => 'word' + i).join(' ');
  const agent = `---\nname: big\ndescription: ${longDesc}\n---\n\n` + 'body line\n'.repeat(250);
  fs.writeFileSync(path.join(root, 'agents', 'big.md'), agent);
  fs.mkdirSync(path.join(root, 'skills', 's1'), { recursive: true });
  fs.writeFileSync(path.join(root, 'skills', 's1', 'SKILL.md'), '# s1\n\n' + 'text here\n'.repeat(10));
  fs.mkdirSync(path.join(root, 'rules'));
  fs.writeFileSync(path.join(root, 'rules', 'r.md'), 'rule\n'.repeat(150));
  fs.writeFileSync(path.join(root, 'CLAUDE.md'), 'note\n'.repeat(350));
  fs.writeFileSync(path.join(root, '.mcp.json'), JSON.stringify({
    mcpServers: {
      heavy: { command: 'mcp-server', tools: new Array(30).fill('t') },
      ghwrap: { command: 'gh', tools: new Array(5).fill('t') },
    },
  }));
  return root;
}

test('audit totals and flags', () => {
  const root = fixture();
  try {
    const r = audit(root);
    assert.equal(r.totals.agents.count, 1);
    assert.equal(r.totals.skills.count, 1);
    assert.equal(r.totals.rules.count, 1);
    assert.equal(r.totals.mcp.servers, 2);
    assert.equal(r.totals.mcp.tools, 35);
    assert.equal(r.totals.mcp.tokens, 35 * 500);
    const titles = r.issues.map((i) => i.title);
    assert.ok(titles.includes('Heavy agent'));
    assert.ok(titles.includes('Bloated agent description'));
    assert.ok(titles.includes('Long rule file'));
    assert.ok(titles.includes('CLAUDE.md bloat'));
    assert.ok(titles.includes('Tool-heavy MCP server'));
    assert.ok(titles.includes('CLI-replaceable MCP server'));
    assert.ok(r.potentialSavings > 0);
    assert.ok(r.topOptimizations.length <= 3);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('audit on empty dir is clean', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-budget-'));
  try {
    const r = audit(root);
    assert.equal(r.totals.all, 0);
    assert.equal(r.issues.length, 0);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('audit reports unparseable mcp config', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-budget-'));
  try {
    fs.writeFileSync(path.join(root, '.mcp.json'), '{oops');
    const r = audit(root);
    assert.ok(r.issues.some((i) => i.title === 'Unparseable MCP config'));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
