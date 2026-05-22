# Experimento de Cobertura — Stage 2 (KILL-GATE do moat) — 21/Mai/2026

**Objetivo:** provar (ou refutar) que o **histórico do órgão** — base do moat "Analisar 6m" — é **recuperável a partir do PNCP/OCDS**, usando os **11 editais reais** (§11 CONTEXT) como conjunto-semente. Roda **ANTES** de escalar o build (gate-first).

**Spike de origem:** `04-spike-stage2-historico-cobertura-20mai.md`. **Tipo:** experimento de pesquisa executável (não código de produção).

## Critério de decisão (do spike 04)
| Métrica | PASSA | KILL/PIVOT |
|---|---|---|
| **Cobertura de descoberta** (editais achados no PNCP) | ≥ 50% | < 50% |
| **Hit-rate de desfecho** (vencedor recuperável) | ≥ 50% | < 50% |
| **MAPE de preço** (valor homologado vs estimado) | ≤ 15% | > 15% |

Falhar qualquer um → o moat de histórico não se sustenta nos dados reais → **KILL ou PIVOT** (ex.: comprar dado de terceiro, ou recuar o Stage 2/3).

## Inputs — 11 editais (CNPJ do órgão extraído dos PDFs)
| Edital | Órgão | Município/UF | CNPJ órgão | IBGE (verificar) | Plataforma | Data ref | Valor conhecido |
|---|---|---|---|---|---|---|---|
| `edital-01-2026` | Pref. Águas Lindas | Águas Lindas/GO | 01.616.520/0001-96 | 5200258 | PCP | 19/01/2026 | R$ 2.252.849,20 |
| `edital-04052026` | Pref. Águas Lindas | Águas Lindas/GO | (mesmo, confirmar) | 5200258 | PCP | — | R$ 174.823,04 |
| `edital-05-2026-republic` | Pref. Águas Lindas (Cultura) | Águas Lindas/GO | (mesmo, confirmar) | 5200258 | PCP | — | R$ 2.140.134,13 |
| `edital-ubs-ii` | Pref. Águas Lindas | Águas Lindas/GO | (mesmo, confirmar) | 5200258 | PCP | — | R$ 2.831.789,56 |
| `edital-2` | Pref. Novo Gama | Novo Gama/GO | 01.629.276/0001-04 | 5214887 | BLL | 16/04/2026 | a confirmar |
| `edital-3` | Pref. Novo Gama | Novo Gama/GO | 01.629.276/0001-04 | 5214887 | BLL | — | a confirmar |
| `edital-base` | Câmara de Abadiânia | Abadiânia/GO | **extrair do PDF** | 5200050 | BNC | — | R$ 670.864,32 |
| `edital-4` | Município de Pirenópolis | Pirenópolis/GO | 01.067.941/0001-05 | 5217302 | BNC | 19/03/2026 | R$ 1.035.758,22 |
| `ce002-2026` | Pref. Anápolis | Anápolis/GO | 01.067.479/0001-46 | 5201108 | ComprasGov | 17/03/2026 | a confirmar |
| `edital-1` | CEASA/GO (estatal) | Goiânia/GO | 01.098.797/0001-74 | 5208707 | BLL | — | a confirmar |
| `sei-governadoria-59297613` | CEASA/GO (estatal) | Goiânia/GO | 01.098.797/0001-74 | 5208707 | BLL | — | a confirmar |

> **Foco do kill-gate:** municípios pequenos (Abadiânia, Novo Gama) — é onde a completude de publicação no PNCP é mais arriscada.

## Endpoints PNCP (base `https://pncp.gov.br/api/consulta`) — confirmado no Swagger v3
- **Descoberta:** `GET /v1/contratacoes/publicacao` — `dataInicial`,`dataFinal` (formato **`AAAAMMDD`**), `codigoModalidadeContratacao` (**req**: Concorrência Eletrônica=`4`, Pregão Eletrônico=`6`), `uf`, **`codigoMunicipioIbge`** ✅, **`cnpj`** ✅ (**confirmados ao vivo 21/Mai** — filtram server-side; ver `09-pncp-ibge-deep`), `pagina`(≥1), `tamanhoPagina` (**max 50**).
- **Desfecho:** `GET /v1/contratos` — `dataInicial`,`dataFinal`, **`cnpjOrgao`** (filtra por órgão **server-side**), `pagina`, `tamanhoPagina` (**max 500**). Devolve fornecedor (CNPJ) + valor + município/UF; inclui municipais.
- Detalhe completo: `01-research/09-pncp-ibge-deep-21mai.md`. IBGE codes (col. acima) = `codigoMunicipioIbge`.

## Procedimento

### Passo 0 — Completar metadados
- Extrair CNPJ do órgão de `edital-base` (Abadiânia) do PDF.
- Confirmar valores faltantes (CEASA/Anápolis/Novo Gama) nas planilhas/anexos.

### Passo 1 — Recall de DESCOBERTA
Para cada edital, consultar por **município** (`codigoMunicipioIbge`) ou **órgão** (`cnpj`) — ambos confirmados ao vivo (21/Mai):
```bash
# Por município (Águas Lindas=5200258), Concorrência Eletrônica, jan/2026
curl -s "https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao?dataInicial=20260101&dataFinal=20260131&codigoModalidadeContratacao=4&codigoMunicipioIbge=5200258&pagina=1&tamanhoPagina=50" \
  | jq '.data[] | {objeto:.objetoCompra, valor:.valorTotalEstimado, data:.dataPublicacaoPncp, cnpj:.orgaoEntidade.cnpj}'
```
- Repetir por edital (ajustar município/órgão + mês + modalidade 4/6). **Métrica:** nº achados / 11 = **cobertura de descoberta**.
- 🟢 **Sinal preliminar (já observado no teste ao vivo):** `cnpj=01616520000196` em jan/2026 devolveu **4 concorrências** = exatamente os 4 editais de Águas Lindas do dataset → cobertura de descoberta promissora para municípios médios.

### Passo 2 — Recall de DESFECHO + preço
Para os achados, recuperar o contrato/resultado (vencedor + valor homologado) via `cnpjOrgao` (server-side):
```bash
curl -s "https://pncp.gov.br/api/consulta/v1/contratos?dataInicial=20260101&dataFinal=20260531&cnpjOrgao=01616520000196&pagina=1&tamanhoPagina=500" \
  | jq '.data[] | {fornecedor:.nomeRazaoSocialFornecedor, cnpj:.niFornecedor, valor:.valorGlobal, municipio:.unidadeOrgao.municipioNome}'
```
- **Métrica:** nº com vencedor recuperável / achados = **hit-rate de desfecho**.
- **MAPE preço:** média de |valor_homologado − valor_estimado| / valor_estimado nos casos com ambos.

### Passo 3 — Histórico do órgão (6m)
Não há dump de `/orgaos` nem endpoint "compras deste CNPJ" na Consulta. Usar **`/v1/contratos?cnpjOrgao={cnpj}`** (filtro server-side) na janela de 6 meses para cada órgão da amostra → medir densidade do histórico (nº contratações + desfechos recuperáveis). Para a fase de licitação, paginar `publicacao` por município/UF + modalidade. **Foco: municípios pequenos** (Abadiânia, Novo Gama).

## Saída do experimento
Planilha `outputs/stage2-coverage-resultado.csv` (1 linha/edital):
`edital, achado(s/n), modalidade_usada, vencedor(s/n), valor_homologado, mape, fonte`
+ resumo das 3 métricas vs thresholds → **decisão GO / PIVOT / KILL**.

## Resultado executado — Codex 21/Mai/2026

Comando:

```bash
rtk npm run noyce:gate:stage2 -- --timeout-ms 15000 --retries 2 --delay-ms 700
```

Arquivos gerados:
- `outputs/stage2-coverage-resultado.csv`
- `outputs/stage2-coverage-summary.json`

Resumo inicial:

| Métrica | Resultado | Gate |
|---|---:|---|
| Cobertura descoberta | 6/11 = 54,5% | PASS |
| Hit-rate desfecho | 6/6 = 100% | PASS |
| MAPE médio | 16,8% | FAIL |
| Metadados incompletos | 6/11 | risco |

**Leitura:** `PIVOT_OR_KILL` no script, mas o sinal prático é **PIVOT/validar mais uma passada**, não kill imediato. A descoberta PNCP passou no limite e o desfecho apareceu quando houve match, mas o MAPE falhou por pouco e ainda há metadados faltantes. Antes de construir app, completar CNPJ/valores faltantes e melhorar o matching de contrato por identificador PNCP em vez de apenas valor próximo.

Resumo refinado após completar metadados dos TXT e marcar match preliminar:

| Métrica | Resultado | Gate |
|---|---:|---|
| Cobertura descoberta | 7/11 = 63,6% | PASS |
| Hit-rate desfecho | 5/7 = 71,4% | PASS |
| MAPE médio | 14,9% | PASS |
| Metadados incompletos | 3/11 | risco |
| Linhas MAPE preliminar | 6 | risco |
| Joins exatos por `numeroControlePncpCompra` | 0 | risco |

**Leitura atualizada:** `PIVOT`. O gate quantitativo passou, mas ainda não é `GO`, porque o MAPE foi calculado em matches preliminares por aproximação de valor/CNPJ ou homologação na publicação. Auditoria em `outputs/stage2-preliminary-match-audit.md`: `/contratos` retornou linhas para os CNPJs, mas nenhuma referenciou as compras-alvo via `numeroControlePncpCompra`. O próximo passo é auditar as 6 linhas preliminares gravadas na última execução manualmente ou enriquecer o join por IDs do portal de origem antes de liberar Sprint 0 de produto.

## Notas de execução
- Data `AAAAMMDD`, modalidades 4/6 e filtros `cnpj`/`codigoMunicipioIbge`/`cnpjOrgao` **confirmados ao vivo (21/Mai)** — §10.2.1 superado.
- **Rate limit não documentado** → throttle defensivo (poucas req/s) + backoff exponencial em 429/5xx. Observado: alguns requests deram falha transitória (HTTP 000) → **retry** resolve. Lag de publicação D+1/D+2 → janela folgada.
- OCDS (`data.open-contracting.org/.../157`) só cobre federal — usar como cross-check do CEASA/Anápolis, não dos municípios.
- Alternativa de backfill: dumps Dados Abertos PNCP (lote diário) se a paginação ao vivo for pesada.

---
*Experimento por Orion (aios-master). É o kill-gate: se o histórico não se recupera nos municípios pequenos, o moat muda. Rodar antes de escalar.*
