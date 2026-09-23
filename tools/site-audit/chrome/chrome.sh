#!/usr/bin/env bash
# Portable headless Chromium (@sparticuz/chromium) for Lighthouse / Puppeteer / axe / pa11y.
# Re-extracts into /tmp automatically if the sandbox was restarted.
D="$(cd "$(dirname "$0")" && pwd)"
BIN=/tmp/chromium
[ -x "$BIN" ] && [ -f /tmp/al2023/lib/libnss3.so -o -f /tmp/al/lib/libnss3.so ] || BIN="$(cd "$D/.." && node chrome/ensure.mjs)"
[ -f /tmp/al/lib/libnss3.so ] || [ -f /tmp/al2023/lib/libnss3.so ] || (mkdir -p /tmp/al && node -e 'const z=require("zlib"),f=require("fs");f.writeFileSync("/tmp/al.tar",z.brotliDecompressSync(f.readFileSync(process.argv[1])))' "$D/../node_modules/@sparticuz/chromium/bin/al2023.tar.br" && tar -xf /tmp/al.tar -C /tmp/al)
export LD_LIBRARY_PATH="/tmp/al/lib:/tmp/al2023/lib:/tmp:$LD_LIBRARY_PATH"
args=()
for a in "$@"; do case "$a" in --headless*) ;; *) args+=("$a");; esac; done
exec "$BIN" --ash-no-nudges --disable-domain-reliability --disable-print-preview \
  --disk-cache-size=33554432 --no-default-browser-check --no-pings ${CHROME_SINGLE_PROCESS:+--single-process} \
  --font-render-hinting=none --disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process \
  --enable-features=SharedArrayBuffer --ignore-gpu-blocklist --in-process-gpu --use-gl=angle \
  --use-angle=swiftshader --enable-unsafe-swiftshader --disable-setuid-sandbox \
  --disable-site-isolation-trials --headless=shell --no-sandbox --no-zygote "${args[@]}"
