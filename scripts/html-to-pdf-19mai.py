#!/usr/bin/env python3
"""Convert HTML to PDF via WeasyPrint."""
import sys
from pathlib import Path
from weasyprint import HTML, CSS

if len(sys.argv) < 2:
    print("Usage: html-to-pdf-19mai.py <html_path> [output_pdf]")
    sys.exit(1)

html_path = Path(sys.argv[1])
out_path = Path(sys.argv[2]) if len(sys.argv) > 2 else html_path.with_suffix(".pdf")

print(f"Rendering {html_path.name} → {out_path.name}...")
HTML(filename=str(html_path)).write_pdf(str(out_path))
print(f"Saved: {out_path} ({out_path.stat().st_size // 1024} KB)")
