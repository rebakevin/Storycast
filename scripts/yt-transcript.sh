#!/usr/bin/env bash
# Download a YouTube video's English transcript as a .vtt file.
# Usage: scripts/yt-transcript.sh <youtube-url> [output-name] [lang]
# Output: media/<output-name>.vtt (default name: the video id)
set -euo pipefail

url="${1:?Usage: $0 <youtube-url> [output-name] [lang]}"
name="${2:-%(id)s}"
lang="${3:-en}"

command -v yt-dlp >/dev/null || { echo "yt-dlp not found. Install it: brew install yt-dlp" >&2; exit 1; }

# If YouTube answers 429 (Too Many Requests), set BROWSER to reuse that browser's login:
#   BROWSER=chrome scripts/yt-transcript.sh <url>
cookies=()
[ -n "${BROWSER:-}" ] && cookies=(--cookies-from-browser "$BROWSER")

# Prefers manual captions, falls back to auto-generated ones.
yt-dlp ${cookies[@]+"${cookies[@]}"} \
  --skip-download \
  --write-subs --write-auto-subs \
  --sub-langs "$lang" \
  --sub-format vtt \
  --output "media/$name" \
  "$url"

echo "Captions saved in media/ (look for *.$lang.vtt)"
