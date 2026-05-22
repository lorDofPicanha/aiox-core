# Pesquisa — Docling (PDF parsing do Stage 4) — 21/Mai/2026

**Para:** parsing de edital denso (50-200p, planilhas orçamentárias, alguns escaneados). **Versão de referência:** Docling v2.95.0 (21/Mai/2026), projeto `docling-project` (ex-DS4SD/IBM, hoje LF AI & Data).

## TL;DR
✅ **Docling é a escolha certa por licença (MIT) e qualidade** (TableFormer p/ tabelas + OCR nativo + JSON estruturado). Roda CPU-only (lento) ou GPU (~6× mais rápido). Servir como **`docling-serve`** (REST/FastAPI, imagens Docker CUDA) ou worker Celery. Pré-bakear modelos na imagem.

## Licença
- Código **MIT** (`docling` e `docling-serve`). ⚠️ **Pesos dos modelos têm licença própria** (`huggingface.co/ds4sd/docling-models`) — historicamente permissiva, mas **verificar na versão fixada** antes de shipar. OCR engines têm licenças próprias (ver comparação).

## Runtime / instalação
- **Python 3.10+** (depende de PyTorch). macOS/Linux/Windows, x86_64 e arm64.
- `pip install docling` (extras: `docling[rapidocr,tesserocr,vlm]`; `docling-slim` ~50MB sem OCR).
- **Download de modelos no 1º run** (layout + TableFormer + OCR) do HuggingFace; ~0,5–1 GB (estimativa, docs não cravam). Air-gapped: `docling-tools models download` + `PdfPipelineOptions(artifacts_path=...)`.

## Uso mínimo
```python
from docling.document_converter import DocumentConverter
result = converter = DocumentConverter().convert("edital.pdf")  # path ou URL
doc = result.document
md   = doc.export_to_markdown()      # p/ LLM
doc.save_as_json("edital.json")       # JSON lossless (estrutura completa)
tags = doc.export_to_doctags()        # tokens estruturados p/ VLM/LLM
```

## Performance (relatório técnico arXiv 2408.09869)
| Cenário | CPU x86 | GPU L4 |
|---|---|---|
| Página nativa (sem OCR) | ~3,1 s/pág | ~0,48 s/pág |
| Tabela | 2–6 s cada | — |
| OCR (página escaneada) | ~13 s/pág | ~1,6 s/pág |

- **Edital nativo 150p:** ~7–8 min CPU / ~1–2 min GPU.
- **Edital escaneado 150p:** 20–30+ min CPU → **GPU recomendado** (ou concorrência/batch).
- **RAM:** não documentada — orçar **~4–8 GB/worker** e medir.

## Tabelas (planilhas orçamentárias) — TableFormer
```python
pipeline_options = PdfPipelineOptions(do_table_structure=True)
pipeline_options.table_structure_options.mode = TableFormerMode.ACCURATE
pipeline_options.table_structure_options.do_cell_matching = True
```
- `ACCURATE` (default) p/ tabelas densas; lida com células mescladas/headers multi-linha. **Validar extrações numéricas críticas** (BDI, valores) — pode errar em células muito irregulares.

## OCR (editais escaneados)
- Engines: EasyOCR (default), Tesseract, RapidOCR, OcrMac. Ativar:
```python
pipeline_options.do_ocr = True
pipeline_options.ocr_options.lang = ["pt", "en"]   # Português p/ editais
```

## Saídas / estrutura
- Markdown, HTML, **JSON lossless**, DocTags, WebVTT. `DoclingDocument` preserva headings, seções, ordem de leitura, listas, **tabelas como objetos estruturados**, figuras, bounding boxes/proveniência.

## Deploy como serviço
- **`docling-serve`** (FastAPI, MIT): `docker run -p 5001:5001 quay.io/docling-project/docling-serve` (variantes `-cu128`/`-cu130` p/ GPU). Endpoints sync e async; `/docs` OpenAPI + `/ui`.
- Worker conteinerizado: padrão FastAPI+Celery+Redis p/ batch. **Pré-bakear modelos** no Dockerfile (`docling-tools models download`) p/ evitar latência no 1º request.

## Comparação de licença (restrição: evitar GPL/AGPL)
| Tool | Licença | Veredito |
|---|---|---|
| **Docling** | **MIT** (pesos verificar) | ✅ usar |
| Unstructured | Apache-2.0 | ok (auditar deps); tabela < Docling |
| Marker | **GPL-3.0** + pesos não-comerciais | ❌ evitar |
| PyMuPDF4LLM | **AGPL-3.0** / comercial | ❌ evitar |

## Recomendação p/ Noyce
Docling em **`docling-serve` (imagem CUDA)** ou worker Celery; pré-bakear modelos; `lang=["pt"]`; `do_ocr=True` só em páginas escaneadas; `TableFormerMode.ACCURATE` p/ planilhas. **Testar com os 3 editais reais** (1 PCP/1 BLL/1 BNC) no experimento de parsing do Stage 4.

## Verificar
- Tamanho real do bundle de modelos + **licença dos pesos** (`ds4sd/docling-models`) na versão fixada.
- **RAM real** em editais 100-200p (não documentada) — benchmarkar.
- Tags exatas das imagens `docling-serve` (quay.io) antes de fixar.

**Fontes:** github.com/docling-project/docling · pypi.org/project/docling · docling-project.github.io/docling (installation/quickstart/advanced/gpu/faq) · arXiv 2408.09869 · github.com/docling-project/docling-serve · procycons.com PDF benchmark.
