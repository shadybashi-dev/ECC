#!/usr/bin/env python3
"""Think-alongside bridge: let frontier models (OpenAI + Anthropic) review
this project with full context, and bring their answers back into the repo.

Paths, same context pack for everyone:

A) NO SETUP - paste into chatgpt.com or claude.ai (whatever your account has):
       python3 tools/copilot_bridge.py prep
   then copy reference/copilot-context.md into the chat, paste the reply into
   reference/copilot-review-1.md and commit. The editing agent integrates it.

B) API - keys stay on YOUR machine as env vars, never in chat or git:
       export OPENAI_API_KEY=...     # and/or ANTHROPIC_API_KEY=...
       python3 tools/copilot_bridge.py models            # what your keys really have
       python3 tools/copilot_bridge.py ask               # one provider (auto-pick)
       python3 tools/copilot_bridge.py ask --provider anthropic
       python3 tools/copilot_bridge.py council           # ALL keyed providers at once
       python3 tools/copilot_bridge.py reply             # continue a thread after
                                                         # reference/copilot-my-response.md

Model ids are never assumed to exist: defaults reflect the Sep-2026 self-serve
lineup (COPILOT_MODEL -> gpt-5, ANTHROPIC_MODEL -> claude-sonnet-5); run
`models` to list what YOUR key actually provides and override via env.
Dependency-free: stdlib only.
"""
import argparse, json, os, subprocess, sys, urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
SITE = HERE / "antonias"
REF = HERE / "reference"

PROVIDERS = {
    "openai": {
        "key_env": "OPENAI_API_KEY",
        "model_env": "COPILOT_MODEL",
        "default_model": "gpt-5",
        "chat_url": "https://api.openai.com/v1/chat/completions",
        "models_url": "https://api.openai.com/v1/models",
    },
    "anthropic": {
        "key_env": "ANTHROPIC_API_KEY",
        "model_env": "ANTHROPIC_MODEL",
        "default_model": "claude-sonnet-5",
        "chat_url": "https://api.anthropic.com/v1/messages",
        "models_url": "https://api.anthropic.com/v1/models",
    },
}
SYSTEM = ("You are a principal design engineer and conversion strategist "
          "reviewing a live project with a co-agent.")

def thread_path(provider):
    return HERE / (".copilot-thread-%s.json" % provider)

def keyed_providers():
    return [p for p in PROVIDERS if os.environ.get(PROVIDERS[p]["key_env"])]

def gather_context():
    handoff = (SITE / "HANDOFF.md").read_text(encoding="utf-8")
    log = subprocess.run(["git", "-C", str(HERE.parent), "log", "--oneline", "-25"],
                         capture_output=True, text=True).stdout
    audit = subprocess.run([sys.executable, str(HERE / "tools/_img_attr_audit.py")],
                           capture_output=True, text=True).stdout.strip()
    css_stats = f"{len((SITE/'css/style.css').read_text().splitlines())} lines"
    council_path = REF / "council-review.md"
    council = council_path.read_text(encoding="utf-8") if council_path.exists() \
        else "(no internal council review recorded yet)"
    return handoff, log, audit, css_stats, council

PACK_TEMPLATE = """# Copilot context pack - Antonia's Pizza site (second-brain briefing)

You are reviewing a real, deployed-in-progress restaurant website together
with another AI agent that edits the code. Be concrete, argue where you
disagree, and respect the immovable rules below. Other frontier models review
the same pack - your job is to find what they will miss.

## Immovable rules
- Vanilla HTML/CSS/JS. No framework, no build step, no CDN, no runtime fetch.
- The site is a marketing front end: every order CTA is a plain link to
  https://antoniaspizza.toast.site/ - no cart, no checkout, no forms.
- NO prices anywhere (owner's rule), and NO aggregateRating in schema
  (Google policy on self-serving reviews; documented in HANDOFF §10).
- Reveals are gated `html.js .reveal{opacity:0}`; overrides need (0,2,1)
  specificity + !important. Every querySelector in js/main.js stays null-safe
  (one script, four pages). Animate transform/opacity/filter only. Infinite
  animations must be registered in the motion-paused list AND reduced-motion.
- The 8 pie-wheel images stay distinct and label-true. Storefronts, patio and
  logo are real photographs - never regenerate them.

## Current state
@@CSS@@ of CSS, 4 pages + generated standalone.html.
Recent commits:
@@LOG@@
Image-attribute audit: @@AUDIT@@

## Internal ensemble review (in-repo council, latest)
@@COUNCIL@@

## The full handoff document (source of truth)
@@HANDOFF@@

## What I want from you
1. Top 10 findings that would move this site forward, ranked by impact per
   effort, each with file:line and a concrete patch (CSS/HTML/JS snippets).
2. Anything in the current design that reads "template" instead of "crafted",
   and the smallest change that fixes it.
3. Motion ideas within the rules above (transform/opacity/filter, pause +
   reduced-motion registered) that would add perceived quality.
4. Conversion-psychology checks on the order path, without inventing prices,
   scarcity or reviews.
5. Where you disagree with decisions already made - or with the internal
   council review above - argue, don't comply.

Answer in markdown, numbered, no filler.
"""

def prep():
    handoff, log, audit, css, council = gather_context()
    pack = (PACK_TEMPLATE
            .replace("@@CSS@@", css)
            .replace("@@LOG@@", log)
            .replace("@@AUDIT@@", audit)
            .replace("@@COUNCIL@@", council)
            .replace("@@HANDOFF@@", handoff))
    out = REF / "copilot-context.md"
    out.write_text(pack, encoding="utf-8")
    keyed = keyed_providers()
    hint = ("run: ask" if len(keyed) == 1 else
            "run: council (%s keyed)" % "+".join(keyed) if keyed else
            "paste into your chat, or export a provider key and run: ask")
    print("wrote", out, "(%d chars) - %s" % (len(pack), hint))

def http_json(url, payload=None, headers=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, headers=headers or {})
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.loads(r.read())

def provider_headers(p):
    cfg = PROVIDERS[p]
    key = os.environ.get(cfg["key_env"])
    if not key:
        sys.exit("%s not set. Use path A (prep + paste) or export it first." % cfg["key_env"])
    if p == "openai":
        return {"Content-Type": "application/json", "Authorization": "Bearer " + key}
    return {"Content-Type": "application/json", "x-api-key": key,
            "anthropic-version": "2023-06-01"}

def provider_model(p):
    cfg = PROVIDERS[p]
    return os.environ.get(cfg["model_env"], cfg["default_model"])

def send(p, messages):
    """messages: list of {role, content} (system included as first element for
    openai; extracted for anthropic). Returns (text, model)."""
    cfg = PROVIDERS[p]
    model = provider_model(p)
    if p == "openai":
        res = http_json(cfg["chat_url"],
                        {"model": model, "messages": messages, "temperature": 0.7},
                        provider_headers(p))
        return res["choices"][0]["message"]["content"], res.get("model", model)
    system = "\n".join(m["content"] for m in messages if m["role"] == "system")
    msgs = [m for m in messages if m["role"] != "system"]
    res = http_json(cfg["chat_url"],
                    {"model": model, "max_tokens": 8192, "system": system,
                     "messages": msgs},
                    provider_headers(p))
    text = "".join(b.get("text", "") for b in res.get("content", [])
                   if b.get("type") == "text")
    return text, res.get("model", model)

def review_number():
    return len(list(REF.glob("copilot-review-*.md"))) + 1

def resolve_provider(choice):
    keyed = keyed_providers()
    if choice != "auto":
        if not os.environ.get(PROVIDERS[choice]["key_env"]):
            sys.exit("%s not set." % PROVIDERS[choice]["key_env"])
        return choice
    if not keyed:
        sys.exit("No provider key set. Use path A (prep + paste into chat), or "
                 "export OPENAI_API_KEY and/or ANTHROPIC_API_KEY.")
    return keyed[0]

def run_thread(provider, messages, label=""):
    pack_needed = not (REF / "copilot-context.md").exists()
    if pack_needed:
        prep()
    text, model = send(provider, messages)
    n = review_number()
    suffix = "-%s" % provider if label == "council" else ""
    out = REF / ("copilot-review%s-%d.md" % (suffix, n))
    out.write_text(text, encoding="utf-8")
    thread = {"provider": provider, "model": model, "messages":
              messages + [{"role": "assistant", "content": text}]}
    thread_path(provider).write_text(json.dumps(thread, indent=1))
    print("[%s/%s] review saved: %s" % (provider, model, out))

def ask(provider):
    p = resolve_provider(provider)
    pack = (REF / "copilot-context.md").read_text(encoding="utf-8")
    run_thread(p, [{"role": "system", "content": SYSTEM},
                   {"role": "user", "content": pack}])

def council():
    keyed = keyed_providers()
    if not keyed:
        sys.exit("council needs at least one API key. Use path A (prep + paste "
                 "into chatgpt.com AND claude.ai manually) or export "
                 "OPENAI_API_KEY / ANTHROPIC_API_KEY.")
    if not (REF / "copilot-context.md").exists():
        prep()
    pack = (REF / "copilot-context.md").read_text(encoding="utf-8")
    for p in keyed:
        run_thread(p, [{"role": "system", "content": SYSTEM},
                       {"role": "user", "content": pack}], label="council")

def reply(provider):
    mine = REF / "copilot-my-response.md"
    if not mine.exists():
        sys.exit("write reference/copilot-my-response.md first (the editing "
                 "agent's answer), then re-run reply")
    if provider != "auto":
        cands = [provider]
    else:
        cands = [p for p in PROVIDERS if thread_path(p).exists()]
        if not cands:
            sys.exit("no thread found - run ask/council first")
    for p in cands:
        tp = thread_path(p)
        if not tp.exists():
            sys.exit("no %s thread found - run ask --provider %s first" % (p, p))
        thread = json.loads(tp.read_text())
        msgs = thread["messages"] + [{"role": "user",
                                      "content": mine.read_text(encoding="utf-8")}]
        run_thread(p, msgs)

def models(provider):
    targets = [provider] if provider != "auto" else list(PROVIDERS)
    for p in targets:
        cfg = PROVIDERS[p]
        if not os.environ.get(cfg["key_env"]):
            print("[%s] skipped - %s not set" % (p, cfg["key_env"]))
            continue
        try:
            res = http_json(cfg["models_url"], None, provider_headers(p))
            ids = sorted(m["id"] for m in res.get("data", []))
            print("[%s] %d models your key provides:" % (p, len(ids)))
            for i in ids:
                print("   ", i)
            print("    override with %s=<id>" % cfg["model_env"])
        except Exception as e:
            print("[%s] models list failed: %s" % (p, e))

if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("cmd", choices=["prep", "ask", "council", "reply", "models"])
    ap.add_argument("--provider", default="auto",
                    choices=["auto", "openai", "anthropic"])
    a = ap.parse_args()
    if a.cmd == "prep":
        prep()
    elif a.cmd == "ask":
        ask(a.provider)
    elif a.cmd == "council":
        council()
    elif a.cmd == "reply":
        reply(a.provider)
    elif a.cmd == "models":
        models(a.provider)
