# Dataset real — 11 editais da cliente (últimos meses) — 21/Mai/2026

**Origem:** PDFs entregues pela cliente (editais em que a empresa-licitante participou nos últimos meses).
**Extração:** `pdftotext -layout` → `01-research/editais-reais/*.txt` (texto bruto p/ análise).
**Por que importa:** primeiro dado REAL do projeto. **É uma amostra PEQUENA (11 editais) — sinal direcional, não base estatística.** Dá noção de geografia, plataformas e segmento (obras/engenharia) e vira corpus-semente para o kill-gate do Stage 2 e o parsing do Stage 4 — mas **não estreita escopo nem rebaixa fontes**.

> ⚠️ Os `.txt` extraídos têm acentuação mangled (Latin-1). Os fatos abaixo já estão normalizados/interpretados. PDFs originais permanecem em `C:\Users\kingp\Downloads\`.

---

## 1. Quadro consolidado

| # | Arquivo (.txt) | Órgão | Município/UF | Dist. de Águas Lindas | Modalidade | Objeto | Plataforma de disputa | Valor estimado | Sessão |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `edital-01-2026` | Prefeitura de Águas Lindas | Águas Lindas/GO | 0 km | Concorrência eletrônica (14.133) | Obra (def. no TR) | **PCP** | R$ 2.252.849,20 | 19/01/2026 |
| 2 | `edital-04052026` | Prefeitura de Águas Lindas | Águas Lindas/GO | 0 km | Concorrência eletrônica | Obra | **PCP** | R$ 174.823,04 | — |
| 3 | `edital-05-2026-republic` | Pref. Águas Lindas (Cultura) | Águas Lindas/GO | 0 km | Concorrência eletrônica | Obra (Cultura) — republicação | **PCP** | R$ 2.140.134,13 | — |
| 4 | `edital-ubs-ii` | Prefeitura de Águas Lindas | Águas Lindas/GO | 0 km | Concorrência eletrônica | UBS II — Jardim Santa Lúcia | **PCP** | R$ 2.831.789,56 | — |
| 5 | `edital-2` | Prefeitura de Novo Gama | Novo Gama/GO | ~30 km | Concorrência eletrônica | Praça c/ quadra (Pedregal) | **BLL** | a confirmar (planilha) | 16/04/2026 |
| 6 | `edital-3` | Prefeitura de Novo Gama | Novo Gama/GO | ~30 km | Concorrência eletrônica | Creche (Seção A3L) | **BLL** | a confirmar (planilha) | — |
| 7 | `edital-base` | Câmara Municipal de Abadiânia | Abadiânia/GO | ~90 km | Concorrência eletrônica | Reforma + ampliação da Câmara | **BNC** | R$ 670.864,32 | — |
| 8 | `edital-4` | Município de Pirenópolis | Pirenópolis/GO | ~100 km | Concorrência eletrônica | Conclusão de obra remanescente | **BNC** | R$ 1.035.758,22 | 19/03/2026 |
| 9 | `ce002-2026` | Prefeitura de Anápolis | Anápolis/GO | ~120 km | Concorrência eletrônica (CE 002/2026) | Obra | **ComprasGov** (comprasgovernamentais) | a confirmar (planilha) | 17/03/2026 |
| 10 | `edital-1` | CEASA/GO (estatal S/A) | Goiânia/GO | ~170 km | Pregão eletrônico (Lei 13.303) | Construção galpão 5.000 m² | **BLL** | a confirmar (planilha) | — |
| 11 | `sei-governadoria-59297613` | CEASA/GO (estatal S/A) | Goiânia/GO | ~170 km | Pregão eletrônico (Lei 13.303) | Reforma geral de prédio | **BLL** | a confirmar (planilha) | — |

*Distâncias são aproximações rodoviárias a refinar com geocode IBGE + haversine.*

---

## 2. Achados que mudam decisões

### 2.1 — D1 (geografia): RAIO DE ~500km MANTIDO; amostra recente concentrada em GO ≤170km
- **Decisão do owner (21/Mai): o raio de ~500km da sede permanece o escopo de arquitetura.** Os 11 editais são uma *amostra recente observada*, não um limite de escopo.
- **Na amostra:** 100% em Goiás, num cluster ≈170km: Águas Lindas (0) → Novo Gama (~30) → Abadiânia (~90) → Pirenópolis (~100) → Anápolis (~120) → Goiânia/CEASA (~170). Zero DF/MG/TO **nesta amostra** — mas isso reflete o período, não a capacidade da empresa.
- **Implicação:** o filtro geográfico continua **haversine ~500km configurável a partir da sede Águas Lindas** (CONTEXT §10.7 segue válido). A concentração observada em GO serve para **priorizar P0 de cobertura/fontes** (começar denso em GO + entorno DF) e para *seed* de testes — **não** para estreitar o raio. Cobertura nacional via PNCP filtrada por distância permanece a estratégia (não há "5-12 portais hiper-regional").

### 2.2 — D2 (plataformas): sinal direcional (amostra pequena — NÃO estatística)
> ⚠️ **11 editais = amostra pequena, não base de decisão.** Serve para ter noção do que dá pra fazer; não estreita o leque de fontes. Todas as 5 fontes do CONTEXT §10.2 **permanecem em escopo**.

| Plataforma | Nº na amostra | Órgãos | Leitura |
|---|---|---|---|
| **PCP** (Portal de Compras Públicas) | 4 | Águas Lindas (todos) | Forte na amostra; tem API pública documentada (solicitar chave) |
| **BLL** (Bolsa de Licitações) | 4 | Novo Gama (2) + CEASA/GO (2) | Forte na amostra; sem API de consulta aberta → sessão via scraping/robô |
| **BNC** (Bolsa Nacional de Compras) | 2 | Abadiânia, Pirenópolis | Presente; notificação por e-mail viável |
| **ComprasGov** (federal) | 1 | Anápolis | Presente; cobertura via PNCP/OCDS |
| **SISLOG** (GO estadual) | 0 | — | **MANTIDO em escopo** — só não apareceu *nesta amostra*. Fonte real de GO estadual; confirmar uso na call (D2) |

- **PCP + BLL aparecem forte** na amostra, mas isso é só sinal — **não rebaixa SISLOG nem nenhuma fonte**. A prioridade real (P0/P1) sai da call de discovery (frequência de uso da cliente), não destes 11.
- **PNCP segue como base de descoberta** (todos publicam lá por lei — confirmar recuperação no experimento do Stage 2).

### 2.3 — Segmento (NOVO — não estava no CONTEXT): OBRAS / ENGENHARIA CIVIL
- **100% obras/engenharia:** construção de galpão, praça com quadra, creche, UBS, reforma+ampliação de câmara, reforma de prédio, conclusão de obra remanescente.
- **Modalidade dominante = CONCORRÊNCIA ELETRÔNICA** (Lei 14.133 p/ obras municipais). **Não é pregão de bens.** Exceção: CEASA usa **Pregão Eletrônico sob Lei 13.303** (estatal).
- **Faixa de valor:** R$ 174k – R$ 2,83M (obras municipais de médio porte).
- **Implicação p/ filtros (Stage 1):** filtrar por **CNAE de construção civil (41/42/43)** + modalidade concorrência/pregão de obras + GO. NÃO é filtro genérico de palavra-chave de bens.

### 2.4 — Habilitação técnica (define o Stage 4)
Todos os 11 exigem **atestados de capacidade técnica**:
- **Atestado técnico-operacional** (experiência da *empresa*) + **atestado técnico-profissional** (do responsável técnico) — vide "item 11 do Termo de Referência".
- Acervo técnico **CAT/CREA-CAU**, responsável técnico, **garantia/caução** (~1% do valor estimado, art. 58), **planilha orçamentária + BDI**.
- **Implicação Stage 4:** o dossiê de habilitação tem de casar **atestados/CAT da cliente** contra as exigências do edital (não só CRF/CND/SICAF). É o coração do parsing — e os 11 editais viram o **corpus de teste real** do Docling.

---

## 3. Como isso destrava os gates

| Gate / Stage | Como o dataset ajuda |
|---|---|
| **Stage 2 (kill-gate / MOAT)** | Conjunto-semente: medir se PNCP/OCDS recuperam estes 11 editais + desfechos (vencedor, valor, datas). Se a cobertura falhar nos municípios pequenos (Abadiânia, Novo Gama), o moat de "histórico do órgão" está em risco — exatamente o que o eval offline precisa medir. |
| **Stage 1 (Monitorar)** | Define os filtros reais: CNAE obras + GO ≤170km + concorrência/pregão. Valida que PCP (API) + PNCP (polling) cobrem a descoberta. |
| **Stage 4 (Habilitar)** | 11 PDFs reais de obras → corpus para testar extração de requisitos de habilitação técnica (atestados/CAT/CREA/garantia/BDI). |
| **D3 (Stage 5 build-vs-integrate)** | Plataformas reais = PCP/BLL/BNC. BLL tem robôs-parceiros (Lance Fácil) — confirmar integração vs scraping. |

---

## 4. Próximos experimentos recomendados
1. **Coverage test (Stage 2):** para cada um dos 11, buscar no PNCP (API Consulta por UF=GO + data) e verificar se o registro + desfecho aparecem. Mede a completude real → kill-gate.
2. **Parsing test (Stage 4):** rodar Docling em 2-3 editais (1 PCP, 1 BLL, 1 BNC) e extrair: objeto, valor, modalidade, exigências de habilitação técnica. Mede viabilidade de extração estruturada.
3. **Confirmar valores faltantes** (CEASA, Anápolis, Novo Gama) nos anexos/planilhas orçamentárias.

---
*Análise por Orion (aios-master). Dataset real inaugural — primeira evidência empírica do projeto Noyce.*
