# 56 — Plano de Build por Área (paridade competitiva → handoff Codex)

> **Autor:** Orion (Claude) · **Data:** 2026-06-22 · **Para:** aprovação do founder → execução (Codex).
> **Base:** `55-feature-research/00-sintese-paridade.md` (+ `01`–`06`). **Regra:** cada ferramenta atinge ≥ o nível de funções dos concorrentes e fica realmente funcional.
> **Estado de partida:** app `apps/contador` com as 10 telas (casca competitiva, dados sintéticos) + core real (motor cClassTrib esqueleto, trilha hash-chain verificável, db migrations 001–006). Commits até `6c29b8f0`.
> **Princípio de execução:** comprar o commodity, construir só o moat (trilha + auto-auditoria + confiança + integração). Cada story marca **[build]** (construível já), **[adapter]** (constrói agora, liga no contrato) ou **🔒 [gate]** (depende de insumo externo do founder).

---

## 0. Sequenciamento (a cadeia de dependências)

```
FASE 0  Correções factuais (rápida, destrava confiança)
   │
FASE 2  Substrato: Supabase + auth + persistência  🔒 keys Supabase
   │     (pré-requisito de TUDO que é "persistido/real" — doc 53)
   ├──────────────┬───────────────┬────────────────┐
FASE A          FASE B          FASE C           FASE D
Motor+Trilha    Integrações     Recuperação      Gestão
(pedra angular) compradas       real             (paridade)
[build]         🔒 contratos    depende de A      herdar Gestorize
```
A Auditoria (Fase A) é a pedra angular: destrava a auto-auditoria do Emissor, a identificação da Recuperação e a tese "defensável". A persistência (Fase 2) precede qualquer "trilha persistida"/"ingestão real".

---

## FASE 0 — Correções factuais (½ dia, [build], sem gate)

| Story | O quê | DoD |
|---|---|---|
| **F0.1** | Trocar "cofre 15 anos" → **5 anos (CTN)** + "retenção estendida como serviço" | Corrigido em `app/captura/*`, `CONTEXT.md`, `DESIGN.md`, apresentação `54` |
| **F0.2** | Atualizar timing `CONTEXT §9`: cClassTrib Simples → jan/2027; multa suspensa início 2026; gatilho 01/09/2026 (Emissor Nacional); dead-ends com data (Nuvem Fiscal 31/07/2026, DANFSe gov 01/07/2026) | §9 reescrito + dead-ends datados |
| **F0.3** | Registrar que e-CAC exige **2 provedores** (SERPRO + Infosimples p/ CND) na arquitetura | Nota em `20-arquitetura` + `CONTEXT` glossário |
| **F0.4** | Marcar pendências de nomenclatura p/ o Renan: GOB, C-TAX/CITAX, Loara | Lista em `CONTEXT §8` |

---

## FASE 2 — Substrato real (doc 53 detalhado) — 🔒 keys Supabase

Pré-requisito de toda persistência. Stories já em `53-handoff-codex-build-f2.md` (F2.1–F2.5): provisionar Supabase + migrations 001–006 + seed; Supabase Auth + `app.current_*` (P18); `SupabaseApiClient` (troca o mock); FF no CI; teste cross-tenant (FF-3). **Bloqueio:** keys Supabase (founder).

---

## FASE A — Auditoria: o motor real + trilha persistida (PEDRA ANGULAR)

**Meta de paridade (6 table-stakes):** validação NCM×CST×CFOP, monofásico+ST, classificação cClassTrib, relatório com materialidade, 3 regimes, confidence+fila humana. **Hoje:** só cClassTrib determinístico; monofásico/ST no enum mas sem lógica; confiança fixa; golden-set sintético.

| Story | O quê | Tipo | DoD | Depende |
|---|---|---|---|---|
| **A1** | Implementar a lógica **monofásico** (NCM monofásico tributado como normal) no `contador-motor-fiscal` (o enum já prevê) | [build] | motor detecta caso monofásico em item sintético; testes verdes | — |
| **A2** | Implementar **ST / alíquota divergente** (CEST/MVA) | [build] | idem ST | A1 |
| **A3** | **Confiança calibrada** — substituir heurística fixa (0.95/0.82/0.6) por fatores explicáveis + "onde NÃO sei" (abstém e empurra pro humano) | [build] | confiança deriva de fatores; baixa confiança bloqueia auto-aprovação e grava na trilha | A1 |
| **A4** | Estrutura da **base de referência licenciada** (`ref.cclasstrib_regra` bitemporal: camada oficial + camada licenciada + job de reconciliação FF-9) | [adapter] | schema + ingestor; aceita carga de fornecedor | Fase 2 |
| **A5** | **Golden-set harness** + protocolo de rotulagem (doc 24) | [build] / 🔒 | harness roda; rotulagem real 🔒 tributarista | A1 |
| **A6** | **Trilha persistida ligada a todos os módulos** — todo evento (auditoria, emissão, recuperação, e-CAC) vira nó na `evento_boa_fe` real via `core_api_v1` | [build] | eventos dos 4 módulos aparecem na trilha real; verificador valida | Fase 2 |

**Bloqueios externos:** licença da base (Systax/e-Auditoria) · tributarista (golden-set real).

---

## FASE B — Integrações compradas (paridade funcional) — 🔒 contratos

### B-Captura (12 table-stakes; comprar provider)
| Story | O quê | Tipo | Gate |
|---|---|---|---|
| **BC1** | Adapter ACL do provider (Focus/PlugNotas) — dialeto isolado em `ingestao.*` (P9) | [adapter] | conta provider + DPA |
| **BC2** | Webhook + pgmq + idempotência + dedup (T5) | [adapter] | — |
| **BC3** | Captura seletiva (`captura_ativa` OFF default, teto/mês, FF-12) + alertas cancelada/denegada (T7) + gap de numeração (T8) | [build] | — |
| **BC4** | Manifestação do destinatário (T4) + canais alternativos: upload/e-mail/pasta (T12) | [adapter] | provider |

### B-eCAC (5 table-stakes; comprar Integra Contador + Infosimples)
| Story | O quê | Tipo | Gate |
|---|---|---|---|
| **BE1** | Cliente Integra Contador (SERPRO): caixa postal, SITFIS, DAS/DARF, DCTFWeb, parcelamentos | [adapter] | contrato SERPRO + e-CNPJ |
| **BE2** | Infosimples p/ **CND** (federal-conjunta/estadual/trabalhista/FGTS) — a Integra NÃO expõe | [adapter] | conta Infosimples |
| **BE3** | **Fluxo Autorização de Acesso** (procuração dez/2025): onboarding assistido + alerta de aceite ≤30d + validade | [build] | — |
| **BE4** | Varredura em lote da carteira (assíncrona) + **monitor diário com triagem de relevância** + **renovação de CND antes de vencer** | [build] | BE1/BE2 |

### B-Emissor (~7 table-stakes; comprar Focus NFe)
| Story | O quê | Tipo | Gate |
|---|---|---|---|
| **BM1** | Integração Focus NFe: emissão NFS-e Nacional + municipal, cancelamento/substituição, lote, webhook | [adapter] | conta gateway + credenciamento ADN |
| **BM2** | DANFSe próprio/delegado (API gov morre 01/07/2026) | [adapter] | gateway |
| **BM3** | Emissão com **cClassTrib real auto-auditado** (liga no motor da Fase A) + painel de revenda B2B2B operacional | [build] | Fase A |

---

## FASE C — Recuperação real (sobre o motor) — depende da Fase A

**Meta (6 table-stakes):** ingestão real, ID monofásico item-a-item, varredura 5 anos, cálculo com SELIC, laudo exportável, success-fee.

| Story | O quê | Tipo | DoD | Depende |
|---|---|---|---|---|
| **C1** | Ingestão (XML/SPED/PGDAS) → identificação monofásico item-a-item (reusa motor A1) | [build] | identifica casos reais em arquivo de teste | A1 |
| **C2** | Varredura retroativa 5 anos + **cálculo do crédito com correção SELIC** | [build] | valor por período confere | C1 |
| **C3** | **Trilha persistida** do pedido + **dossiê exportável** (PDF) — a defesa STF Tema 736 | [build] | dossiê gera; eventos na trilha real | C2, A6 |
| **C4** | Geração **PER/DCOMP assistida** + acompanhamento de status | [build] / 🔒 | rascunho gerado | estrutura jurídica + tributarista assina |

---

## FASE D — Gestão (paridade, não-moat; não sobre-investir)

**Meta (9 table-stakes):** decisão D1 = **herdar o Gestorize** (23 features maduras), não reconstruir no radar-fiscal.

| Story | O quê | Tipo | Gate |
|---|---|---|---|
| **D1** | Avaliar/portar o **Gestorize** (Spike 5) | [build] | 🔒 código-fonte deployável (Renan) |
| **D2** | Se não portar: motor de **prazo por tributo** (antecipa vs posterga) + feriado municipal + portal+log auditável + persistência | [build] | Fase 2 |
| **D3** | **Health score cross-módulo** (pendência operacional × situação fiscal e-CAC) — diferencial não-copiável | [build] | BE4 |

---

## Resumo executivo da sequência

1. **Fase 0** (½ dia) — corrige os fatos. Sem gate. **Começar já.**
2. **Fase 2** — substrato Supabase. 🔒 keys.
3. **Fase A** — motor real + trilha persistida (pedra angular). Parte [build] já; golden-set 🔒 tributarista.
4. **Fase B** — integrações compradas (adapters agora, ligam no contrato).
5. **Fase C** — recuperação real (sobre A).
6. **Fase D** — gestão (paridade).

**Caminho crítico humano (founder/Renan):** (a) keys Supabase, (b) tributarista p/ golden-set, (c) licença da base de regras, (d) contas/contratos provider+SERPRO+Infosimples+Focus NFe+ADN. **Nenhum código os substitui** — quanto antes engatilhados, antes a paridade vira real.

---

*Cada story aqui é granular o suficiente para virar um handoff de execução ao Codex. Aprovação do founder → gero o handoff detalhado da fase escolhida (modelo do doc 53).*
