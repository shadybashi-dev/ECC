# Security model — claude-token-saver

This document describes the threat model and the controls in `cts`.
Short version: **zero dependencies, env-only secrets, deny-by-default
networking, private local storage, and GitHub-leak prevention.**

## Threat model

| Threat | Control |
|---|---|
| Supply-chain attack via npm packages | Zero runtime dependencies. Only Node.js built-ins (`fs`, `crypto`, `os`, `path`, `child_process` for git only). |
| API key theft via malicious `ANTHROPIC_BASE_URL` (CVE-2026-21852 class) | Env-provided base URLs are **ignored**. A custom `--base-url` requires `CTS_ALLOW_BASE_URL=1` AND an allowlisted https host (`CTS_ALLOWED_HOSTS`). |
| Key exposure in logs / errors / process list | Key is read only from `ANTHROPIC_API_KEY`. Never a CLI arg, never printed, never written to the usage log. API error bodies are truncated to 300 chars. |
| Secret leaks pushed to GitHub | `cts secrets` scanner (16 pattern families + `.env`/key-file detection), `cts redact`, and an installable pre-commit hook that blocks offending commits. |
| Prompt injection via invisible unicode | `stripInvisibleUnicode` removes zero-width, bidi, tag, and variation-selector code points from prompts before sending (same set ECC scans repos for). |
| SSRF / credential smuggling via base URL | `assertUrlAllowed`: https-only (http only for loopback), no userinfo, exact hostname allowlist match. |
| Oversized input / DoS | Prompt/file/stdin capped at `CTS_MAX_PROMPT_BYTES` (default 1 MiB, max 8 MiB). Scan cap 512 KiB/file. API timeout 120s default with abort. |
| Path traversal / symlink escape in scans | `resolveInside` containment checks; symlinks never followed; cache keys must match `^[0-9a-f]{64}$`. |
| World-readable cache on shared machines | Cache dir `0700`, entries and usage log `0600`. Atomic writes (tmp + rename). |
| Usage telemetry leaking prompt content | `usage.jsonl` stores counts and cost only — never prompts, systems, or responses. |
| Accidental secret in prompt sent to API | `warnIfSecrets` warns on stderr; `CTS_ABORT_ON_SECRET=1` turns it into a hard abort. |
| Command injection via model/base-url args | Model ids validated against `^claude-[A-Za-z0-9][A-Za-z0-9._-]{0,60}$`; optional `CTS_ALLOWED_MODELS` restriction. No shell execution anywhere (`execFileSync` with argv for git only). |

## What is NOT protected

- A compromised machine (rootkits, keyloggers) — no CLI can fix that.
- Secrets already committed to git history — rotate them, then use
  `cts hook install` to prevent recurrence.
- The Anthropic API itself — review Anthropic's data policies for your tier.
- Price accuracy — the bundled table is informational; verify billing in
  the Anthropic console.

## Reporting

Found a vulnerability in `cts`? Please open a private security advisory on
the GitHub repo instead of a public issue:
https://github.com/shadybashi-dev/ECC/security/advisories/new
