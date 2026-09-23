# Web Development Toolkit (`webdev` profile)

> **بالعربي:** ملف تثبيت جاهز يضم أحدث وأذكى أدوات ECC لبناء وتحسين موقع احترافي:
> التصميم، أنظمة التصميم، React/Next.js/Vite/Vue، الحركة (Motion)، إمكانية الوصول،
> تحسين محركات البحث (SEO)، اختبارات المتصفح E2E، مراجعة الأمان، قواعد البيانات، والنشر.

## Install

```bash
# Claude Code (global ~/.claude)
./install.sh --profile webdev --target claude

# Per-project (./.claude)
./install.sh --profile webdev --target claude-project

# Cursor / Codex / OpenCode / Zed ...
./install.sh --profile webdev --target cursor

# Preview what will be installed
./install.sh --profile webdev --target claude --dry-run
```

The hook runtime is **not** included by default. Opt in with
`--with baseline:hooks --enable-hooks`.

## What you get

| Area | Skills / agents |
| --- | --- |
| Design direction | `frontend-design-direction`, `design-system`, `make-interfaces-feel-better`, `loop-design-check` |
| Frameworks | `react-patterns`, `react-performance`, `react-testing`, `nextjs-turbopack`, `vite-patterns`, `vue-patterns`, `nuxt4-patterns`, `angular-developer`, `frontend-patterns` |
| Motion | `motion-ui`, `motion-foundations`, `motion-patterns`, `motion-advanced` |
| Accessibility | `accessibility`, `frontend-a11y`, agent `a11y-architect` |
| SEO & content | `seo`, `brand-discovery`, `brand-voice`, `content-engine`, agent `seo-specialist` |
| Quality | `browser-qa`, `e2e-testing`, `tdd-workflow`, `verification-loop`, agents `e2e-runner`, `code-reviewer`, `performance-optimizer` |
| Backend & data | `api-design`, `backend-patterns`, `postgres-patterns` and database skills |
| Security | `security-review`, `security-scan`, agent `security-reviewer` |
| Media | `ui-demo`, `fal-ai-media` and media-generation skills |
| Ship | `deployment-patterns`, `docker-patterns` and devops skills |

## Recommended MCP servers

Copy [`examples/webdev-mcp.json`](../examples/webdev-mcp.json) into your project's
`.mcp.json` (or merge the entries you want):

- **chrome-devtools** – live Lighthouse/performance traces, console & network inspection.
- **playwright** – drive a real browser for E2E and visual checks.
- **context7** – up-to-date docs for Next.js, React, Tailwind, etc.
- **magic** – Magic UI component generation.
- **vercel** – deploy and manage projects.

These are opt-in, per [MCP-CONNECTOR-POLICY.md](MCP-CONNECTOR-POLICY.md); keep
fewer than ~10 enabled to protect the context window.

## Suggested workflow

1. `brand-discovery` → `frontend-design-direction` → `design-system`
2. Build with `nextjs-turbopack` / `react-patterns` + `motion-ui`
3. Verify with `browser-qa`, `e2e-testing`, `frontend-a11y`, chrome-devtools Lighthouse
4. Optimize with `react-performance` and `seo`
5. `security-review`, then ship with `deployment-patterns`
