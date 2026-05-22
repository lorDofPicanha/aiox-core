# Pesquisa — Embeddings PT-BR (Legal-BERTimbau vs bge-m3) — 21/Mai/2026

**Para:** busca semântica/RAG sobre editais (Stage 3/4) com pgvector. **Conclusão:** **NÃO ancorar no Legal-BERTimbau**; recomendado **`BAAI/bge-m3` (`vector(1024)`)** como primário. Esquema pgvector idêntico → dá pra A/B testar sem mudar schema.

## 🔧 Correção de stack (vs CONTEXT §10)
O CONTEXT listava `rufimelo/Legal-BERTimbau-large-v2` como embedding. **Esse modelo é um masked-LM (fill-mask), NÃO serve para embeddings.** Para embeddings é preciso uma variante **`-sts-`** (sentence-transformers). E, comparado a retrievers modernos, ele perde por: cap de **512 tokens**, pouca data de fine-tuning e falta de benchmark de retrieval.

## Recomendação (ordem)
| Modelo | Dim | Máx tokens | Licença | Por quê |
|---|---|---|---|---|
| **`BAAI/bge-m3`** ✅ primário | **1024** | **8192** | MIT | Contexto longo (editais densos → menos chunking/truncamento), multilíngue/PT forte, dense+sparse (híbrido futuro) |
| `intfloat/multilingual-e5-large` | 1024 | 512 | MIT | Leve, PT sólido; exige prefixos `query:`/`passage:` |
| `rufimelo/Legal-BERTimbau-sts-large-ma-v3` | 1024 | 512 | MIT (verificar card) | Só se quiser vocabulário jurídico PT-BR e A/B testar |

**Todos são 1024-dim → `vector(1024)` no Postgres serve para os três.** Permite trocar/comparar sem migração de schema.

## pgvector setup
- Coluna `embedding vector(1024)`.
- `normalize_embeddings=True` → usar **cosine (`<=>`)** ou inner product (`<#>`).
- Índice **HNSW** (melhor recall/latência que ivfflat p/ esse volume).

## Snippet (sentence-transformers)
```python
# pip install sentence-transformers
from sentence_transformers import SentenceTransformer
model = SentenceTransformer("BAAI/bge-m3")          # primário
# (se Legal-BERTimbau: SentenceTransformer("rufimelo/Legal-BERTimbau-sts-large-ma-v3"); model.max_seq_length = 512)
emb = model.encode(chunks, normalize_embeddings=True, batch_size=16)  # (n, 1024)
```

## Notas de chunking
- bge-m3 (8192) cobre quase todo edital sem fatiar; mesmo assim, chunk por seção (objeto, habilitação, planilha) melhora o retrieval.
- Legal-BERTimbau/e5 (512) → chunks ~300-400 tokens com overlap (trunca silenciosamente além do limite).

## Legal-BERTimbau — fatos (caso se opte por ele)
- IDs de embedding: usar **`-sts-`** (ex.: `Legal-BERTimbau-sts-large-ma-v3`, melhor STS 0.819). Os `-large`/`-large-v2` são MLM (não usar p/ embedding).
- **1024-dim**, **512 tokens** (a v1 às vezes vem com 128 — setar `model.max_seq_length=512` após carregar).
- Licença: **MIT** (lineage BERTimbau/neuralmind MIT) — confirmar no card da variante antes de produção.
- Tamanho ~1,3 GB fp32; roda em worker Python (CPU ok p/ query; GPU/fp16 p/ indexação em lote). Sem ONNX oficial.

## Serving
- bge-m3 e e5 também são `sentence-transformers` → mesmo padrão de worker. GPU acelera indexação em lote; query online roda em CPU.
- Decisão final de modelo = **benchmark nos próprios editais** (3 modelos, mesma coluna `vector(1024)`).

## Confiança & lacunas
- **Alta:** dimensões (todos 1024), licenças MIT, bge-m3 contexto 8192, Legal-BERTimbau-large é MLM.
- **Verificar:** card de licença do `-sts-large-ma-v3`; `max_seq_length` real ao carregar.

**Fontes:** huggingface.co/BAAI/bge-m3 · intfloat/multilingual-e5-large · rufimelo/Legal-BERTimbau-sts-large-ma-v3 (+ large/large-v2) · neuralmind/bert-large-portuguese-cased · arXiv 2407.19527 (Serafim).
