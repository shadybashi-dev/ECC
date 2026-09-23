# source this file: puts the audit CLIs on PATH and points every tool at the portable Chromium
_SA_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export CHROME_PATH="$_SA_DIR/chrome/chrome.sh"
export PUPPETEER_EXECUTABLE_PATH="$CHROME_PATH"
export PATH="$_SA_DIR/node_modules/.bin:$PATH"
