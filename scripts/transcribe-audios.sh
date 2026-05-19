#!/bin/bash
# Transcribe WhatsApp PTT audios via OpenAI Whisper API
set -e

OUT_DIR="docs/projects/buscador-licitacoes/00-context/audios-18mai"
SRC_DIR="C:/Users/kingp/Downloads"

# Load .env
set -a
source D:/AIOS/.env
set +a

if [ -z "$OPENAI_API_KEY" ]; then
  echo "ERROR: OPENAI_API_KEY not set" >&2
  exit 1
fi

echo "Transcribing 5 audios..."

for ts in "10.57.56" "10.58.47" "10.58.59" "10.59.52" "11.01.03"; do
  SRC="$SRC_DIR/WhatsApp Ptt 2026-05-18 at $ts.ogg"
  OUT="$OUT_DIR/audio-$ts.txt"

  if [ ! -f "$SRC" ]; then
    echo "MISSING: $SRC"
    continue
  fi

  echo "[$ts] sending to Whisper..."
  curl -sf https://api.openai.com/v1/audio/transcriptions \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: multipart/form-data" \
    -F "file=@$SRC" \
    -F "model=whisper-1" \
    -F "language=pt" \
    -F "response_format=text" \
    -o "$OUT"

  if [ -s "$OUT" ]; then
    echo "[$ts] OK ($(wc -c < "$OUT") bytes)"
  else
    echo "[$ts] FAILED (empty output)"
  fi
done

echo ""
echo "=== ALL TRANSCRIPTS ==="
for f in "$OUT_DIR"/audio-*.txt; do
  echo ""
  echo "--- $(basename $f) ---"
  cat "$f"
done
