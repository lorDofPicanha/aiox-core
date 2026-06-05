import sys, os
from faster_whisper import WhisperModel

AUDIO = r"C:\Users\kingp\Downloads\Projeto contador .m4a.mp4"
OUT = r"C:\Users\kingp\Downloads\Projeto-contador-transcricao.txt"

# medium balances speed/quality on CPU; pt language forced
model = WhisperModel("medium", device="cpu", compute_type="int8")

segments, info = model.transcribe(AUDIO, language="pt", vad_filter=True,
                                  vad_parameters=dict(min_silence_duration_ms=500))

print(f"[info] duration={info.duration:.1f}s lang={info.language} prob={info.language_probability:.2f}", flush=True)

lines = []
with open(OUT, "w", encoding="utf-8") as f:
    for seg in segments:
        ts = f"[{int(seg.start//60):02d}:{int(seg.start%60):02d}]"
        line = f"{ts} {seg.text.strip()}"
        print(line, flush=True)
        f.write(line + "\n")
        lines.append(line)

print(f"\n[done] wrote {len(lines)} segments to {OUT}", flush=True)
