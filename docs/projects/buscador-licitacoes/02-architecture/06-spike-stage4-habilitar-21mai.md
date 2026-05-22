# Spike — Stage 4: Habilitar (dossiê por-edital + radar de impugnação) — 21/Mai/2026

**Prioridade:** P1 · **Advisors:** justen-filho, niebuhr · **Depende de:** X3 (vault de docs da cliente)

## Job
Extrair os **requisitos de habilitação DO edital**, conferir contra os **documentos da cliente** (atestados/CAT/CRF/CND/SICAF) e gerar um **dossiê em <30min**. Inclui **radar de impugnação**: detectar exigência acima da lei.

## Evidência real (dataset 21/Mai — §11 CONTEXT)
Os 11 editais são **100% obras/engenharia** → o perfil de habilitação é de obra, não de bens:
- **Habilitação técnica:** atestado **técnico-operacional** (experiência da empresa) + **técnico-profissional** (do RT) — "item 11 do Termo de Referência".
- **CAT/CREA-CAU**, responsável técnico, **garantia/caução ~1%** (art. 58), **planilha orçamentária + BDI**.
- **Habilitação fiscal/jurídica:** CRF/FGTS, CND federal/estadual/municipal, contrato social, SICAF.
→ Os 11 PDFs são o **corpus de teste real** do parser.

## Desconhecido técnico
1. **Parse de PDF denso** (50-200p, tabelas) — extração confiável com **Docling (MIT)**.
2. **Extração estruturada de requisitos** — transformar texto em schema {jurídica, fiscal, técnica, econ-financeira} com **citação de cláusula**.
3. **Matching** — casar requisito × documento da cliente (ex.: "atestado de 5.000m² de galpão" × acervo CAT da cliente).
4. **Radar de impugnação** — comparar exigência vs baseline legal (Lei 14.133 arts. 62-70) → flag "acima da lei" (ex.: atestado com quantitativo > limite jurisprudencial TCU).

## Abordagem proposta
- **Docling → markdown estruturado** (preserva tabelas/seções). Fallback OCR p/ PDF imagem.
- **Extração LLM** (Claude Sonnet 4.x) com schema fixo + obrigatoriedade de citar a cláusula de origem (anti-alucinação).
- **Matcher** contra o vault de docs da cliente (X3): regra + embedding (Legal-BERTimbau) p/ similaridade de atestados.
- **Radar:** ruleset sobre exigências comuns × exóticas × ilegais (RAG jurisprudência TCU).
- **Output:** dossiê = checklist (tenho/não tenho) + lista de impugnação sugerida.

## Experimento (antes de build)
- Parsear **3 editais reais** (1 PCP / 1 BLL / 1 BNC), extrair requisitos de habilitação técnica + fiscal.
- Comparar com **leitura manual** (ground truth) → medir precisão/recall por categoria.

## Gate
- ✅ **PASSA** se recall de requisitos críticos **≥90%** (não pode perder exigência que desclassifica) e precisão **≥80%**.
- ❌ Falso-negativo em exigência crítica = **bloqueador** (revisar parsing/extração).

## Decisões pendentes
- [ ] D-S4.1 — Docling roda onde (worker Inngest Python? serviço separado)?
- [ ] D-S4.2 — Vault de docs da cliente (X3) — formato e ingestão dos atestados/CAT.
- [ ] D-S4.3 — Radar de impugnação no MVP ou v2 (precisa de base TCU)?

---
*Spike por Orion (aios-master). Stage 4 = coração do moat de backstage. Corpus real de obras já disponível.*
