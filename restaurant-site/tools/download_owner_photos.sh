#!/usr/bin/env bash
# Download the owner's FULL-RESOLUTION photos from the live sites into
# antonias/assets/img/owner/, then enhance + slot them with:
#   python3 tools/place_owner_photos.py
#
# WHY THIS SCRIPT EXISTS: the editing sandbox cannot reach antoniaspizza.com,
# antoniaspizza.toast.site, pluto-images.toastcdn.com or toastcdn.com (all
# measured 000 / TLS-cut). The URLs below were harvested from the live pages
# with a server-side reader on 2026-09-14, with each photo's own alt text.
# Run this on any normal machine (or in CI) - not in the sandbox.
set -euo pipefail
DEST="$(dirname "$0")/../antonias/assets/img/owner"
mkdir -p "$DEST"
get() { curl -fsSL -A 'Mozilla/5.0' "$1" -o "$DEST/$2" && echo "  $2"; }

# --- antoniaspizza.com home -------------------------------------------------
get 'https://antoniaspizza.com/pluto-images/2d273cc4-ddbb-49ae-a0c4-56108f6a7e86?w=1920&h=1080&fit=cover' ajarski-four-versions.jpg
get 'https://antoniaspizza.com/pluto-images/33d91b05-a35c-406f-af29-5630df3e800f?w=1920&h=1080&fit=cover' pies-hero.jpg
get 'https://antoniaspizza.com/pluto-images/e387718f-b419-46c0-b1c3-0d7bd4e49653?w=1920&h=1080&fit=cover' deals.jpg
get 'https://antoniaspizza.com/pluto-images/5eda752e-64dd-43c6-90b3-8aee3bd082f4?w=960&h=960&format=auto&fit=cover' chef-red-apron.jpg
get 'https://antoniaspizza.com/pluto-images/962cf92a-cbad-4425-bea5-24a23c132eca?w=960&h=960&format=auto&fit=cover' cheese-slice-board.jpg
get 'https://antoniaspizza.com/pluto-images/bc063f34-fec1-40d2-9166-5f570a84f713?w=960&h=960&format=auto&fit=cover' rustic-table.jpg
get 'https://antoniaspizza.com/pluto-images/ece063b4-c86d-4761-a860-ca7ff99b250b?w=960&h=960&format=auto&fit=cover' grilled-steak.jpg
get 'https://antoniaspizza.com/pluto-images/b3222d38-5746-48f4-9452-ccb85a3e5e19?w=960&h=960&format=auto&fit=cover' deli-latte.jpg
get 'https://antoniaspizza.com/pluto-images/acec08fb-fe6a-4514-b615-7608578090af?w=960&h=960&format=auto&fit=cover' johnnys-counter.jpg
get 'https://antoniaspizza.com/pluto-images/083bec4a-2d1d-4287-b901-c2a14f90c689?w=1920&h=1080&fit=cover' gallery-spread.jpg
# --- /page/ajarski ----------------------------------------------------------
get 'https://antoniaspizza.com/pluto-images/a40ea15c-28bc-47de-848b-095fd1e6e01d?w=1920&h=1080&fit=cover' ajarski-hero.jpg
get 'https://antoniaspizza.com/pluto-images/9d2ed301-d3e3-4da5-b65a-91cf3c28b5dc?w=1920&h=1080&fit=cover' ajarski-higuera.jpg
get 'https://antoniaspizza.com/pluto-images/235db9ef-0586-451e-b008-76142db1885d?w=960&h=960&format=auto&fit=cover' lamb-shank-plate.jpg
get 'https://antoniaspizza.com/pluto-images/f3455223-d638-445f-8611-4473945efb9d?w=960&h=960&format=auto&fit=cover' cheese-slice-soda.jpg
get 'https://antoniaspizza.com/pluto-images/3269e926-7ede-4bdb-a0eb-b1971059a988?w=960&h=960&format=auto&fit=cover' ramen-bowl.jpg
echo "done -> $DEST"
