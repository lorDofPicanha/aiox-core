"""Transcribe WhatsApp PTT audios locally via faster-whisper (CPU)."""
from faster_whisper import WhisperModel
from pathlib import Path
import sys

SRC_DIR = Path("C:/Users/kingp/Downloads")
OUT_DIR = Path("D:/AIOS/docs/projects/buscador-licitacoes/00-context/audios-18mai")
OUT_DIR.mkdir(parents=True, exist_ok=True)

TIMESTAMPS = ["10.57.56", "10.58.47", "10.58.59", "10.59.52", "11.01.03"]

print("Loading model 'small' (244MB, first run will download)...", flush=True)
model = WhisperModel("small", device="cpu", compute_type="int8")
print("Model loaded.", flush=True)

all_transcripts = []

for ts in TIMESTAMPS:
    src = SRC_DIR / f"WhatsApp Ptt 2026-05-18 at {ts}.ogg"
    out = OUT_DIR / f"audio-{ts}.txt"

    if not src.exists():
        print(f"[{ts}] MISSING: {src}", flush=True)
        continue

    print(f"[{ts}] transcribing {src.stat().st_size} bytes...", flush=True)
    segments, info = model.transcribe(str(src), language="pt", beam_size=5)

    text_parts = []
    for seg in segments:
        text_parts.append(seg.text.strip())

    full_text = " ".join(text_parts)
    out.write_text(full_text, encoding="utf-8")
    print(f"[{ts}] OK ({len(full_text)} chars, lang={info.language} conf={info.language_probability:.2f})", flush=True)
    all_transcripts.append((ts, full_text))

print("\n\n=== ALL TRANSCRIPTS ===\n", flush=True)
for ts, text in all_transcripts:
    print(f"--- audio-{ts} ---")
    print(text)
    print()
