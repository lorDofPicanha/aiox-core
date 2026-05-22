#!/usr/bin/env python3
"""Local transcription via faster-whisper."""
import sys
from pathlib import Path
from faster_whisper import WhisperModel

if len(sys.argv) < 2:
    print("Usage: whisper-local-19mai.py <audio_path> [model_size]")
    sys.exit(1)

audio = sys.argv[1]
size = sys.argv[2] if len(sys.argv) > 2 else "small"  # tiny | base | small | medium | large-v3

print(f"Loading model: {size}", file=sys.stderr)
model = WhisperModel(size, device="cpu", compute_type="int8")

print(f"Transcribing: {audio}", file=sys.stderr)
segments, info = model.transcribe(audio, language="pt", vad_filter=True)
print(f"Language: {info.language} ({info.language_probability:.2f}) | Duration: {info.duration:.1f}s", file=sys.stderr)
print("---TRANSCRIPT---", file=sys.stderr)

full = []
for seg in segments:
    line = f"[{seg.start:6.1f}s] {seg.text.strip()}"
    print(line)
    full.append(seg.text.strip())

# Save plain text
out = Path(audio).with_suffix(".txt")
out.write_text(" ".join(full), encoding="utf-8")
print(f"\nSaved plain text: {out}", file=sys.stderr)
