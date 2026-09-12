#!/bin/sh
# One-line installer for claude-token-saver (cts) from GitHub.
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/shadybashi-dev/ECC/arena/01a09496-ecc/claude-token-saver/install.sh | bash
set -eu

REPO_URL="${CTS_REPO_URL:-https://github.com/shadybashi-dev/ECC.git}"
BRANCH="${CTS_BRANCH:-arena/01a09496-ecc}"
DEST="${CTS_DEST:-$HOME/ECC}"

if ! command -v node >/dev/null 2>&1; then
  echo "error: node >= 18 is required (https://nodejs.org)" >&2
  exit 1
fi
if ! command -v git >/dev/null 2>&1; then
  echo "error: git is required" >&2
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "error: npm is required" >&2
  exit 1
fi

if [ -d "$DEST/.git" ]; then
  echo "Updating existing checkout at $DEST ..."
  git -C "$DEST" fetch --depth 1 origin "$BRANCH" || true
  git -C "$DEST" checkout "$BRANCH" || true
else
  echo "Cloning $REPO_URL ($BRANCH) into $DEST ..."
  git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$DEST"
fi

echo "Installing cts globally (zero dependencies) ..."
npm install -g "$DEST/claude-token-saver"

echo ""
echo "Done. Next steps:"
echo "  cts --help"
echo "  cts prices"
echo "  export ANTHROPIC_API_KEY=\"....\"   # never commit this"
echo "  cts chat \"hello\" --stats"
