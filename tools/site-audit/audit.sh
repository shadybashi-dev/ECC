#!/usr/bin/env bash
# Site audit toolkit — one command, full report.
#   usage: ~/tools/audit.sh <base-url> [path ...]       e.g. audit.sh http://localhost:4173 / /menu /san-luis-obispo
#   optional: SITE_DIR=/path/to/static/files  (enables HTML validation + image weight report)
set -uo pipefail
T="$(cd "$(dirname "$0")" && pwd)"; source "$T/env.sh"
BASE="${1:?base url}"; shift
PATHS=("${@:-/}")
OUT="$HOME/audits/$(date +%Y%m%d-%H%M%S)"; mkdir -p "$OUT"
echo "Reports -> $OUT"

for p in "${PATHS[@]}"; do
  slug=$(echo "$p" | sed 's#^/##; s#/#_#g'); slug=${slug:-home}
  for ff in mobile desktop; do
    extra=(); [ $ff = desktop ] && extra=(--preset=desktop)
    timeout 170 lighthouse "$BASE$p" "${extra[@]}" --output=json --output=html \
      --output-path="$OUT/lh-$slug-$ff" --quiet >/dev/null 2>&1 || echo "lighthouse failed: $p $ff"
  done
  timeout 120 node "$T/axe-check.mjs" "$BASE$p" > "$OUT/axe-$slug.json" 2>/dev/null || echo "axe failed: $p"
done

echo "== Link check"; timeout 300 linkinator "$BASE" --recurse --skip "^(?!${BASE})" --format json > "$OUT/links.json" 2>/dev/null
if [ -n "${SITE_DIR:-}" ]; then
  echo "== HTML validation"; (cd "$SITE_DIR" && html-validate --formatter json $(find . -name '*.html' -not -path './node_modules/*') > "$OUT/html-validate.json" 2>/dev/null)
  echo "== Image weights"; node "$T/img-report.mjs" "$SITE_DIR" > "$OUT/images.json"
fi
node "$T/summarize.mjs" "$OUT" | tee "$OUT/SUMMARY.md"
