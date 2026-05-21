---
name: session-highticket-hydra-study-15mai
description: High-ticket marketing study via HYDRA pipeline parcial + Bretda 90d perf — 2 HARD-BLOCKERS descobertos (Google OC API EOL + posicionamento categórico)
metadata: 
  node_type: memory
  type: project
  status: completed-with-caveats
  baseline: study-15mai (Atlas working-knowledge)
  output: study-15mai-hydra (HYDRA parcial OpenAI-fallback)
  originSessionId: 15f7ca39-36a4-4e78-950c-75e0a8836181
---

# High-Ticket Study HYDRA — 15/Mai/2026

## Contexto

User pediu estudo high-ticket usando estrutura Bretda Meta Ads como case empírico. Primeiro pass via aios-analyst (Atlas) saiu working-knowledge sem brain-bridge consultation real. User redirecionou: "faça com o sistema hydra e o agente". Segundo pass via HYDRA pipeline + analyst.

## O que rodou de verdade

**HYDRA Pipeline:**
- Run prior 22:47: 5030 fetched, 63 ingested antes Anthropic credit exhaust
- Run mid-session squad-highticket: 139 fetched, 41 ingested, zero erros (OpenAI fallback)
- KB total relevante: 358 base + 41 frescos
- **17 evidências Tier S/A** com URLs + citações ipsis litteris extraídas

**Volume vs regra memory `feedback_research_minimum_volume.md`:** FAR BELOW 4000+ items. Não é "HYDRA real cheio", é HYDRA parcial OpenAI-fallback. Disclosure obrigatório.

**Brain-bridge clones:** Ainda "anticipated synthesis" (5 clones via doutrina pública), não consulta real. Mesmo gap que Atlas hit.

**Feeds escritos (PENDING distribute):**
- 5 feeds em `D:/AIOS/docs/projects/highticket/study-15mai-hydra/_feeds-to-distribute/`
- alex-hormozi (10.3KB) / april-dunford (8.7KB) / kasim-aslam (8.0KB) / molly-pittman (7.6KB) / nicholas-kusmich (7.4KB)
- Bash a `D:/jarvis/` foi denied permission — user copia manual ou re-runa com auth

## Diagnóstico pipeline HYDRA

**Root cause alerts 15/Mai (zero_ingestion + 919% error rate):** Anthropic API credit exhausted partway pelo run 22:47. Mitigation: `.env` rotacionado para OPENAI_API_KEY + HYDRA_MODEL=gpt-4o-mini. Provider detection em `extractor.js` faz fallback correto. Pipeline volta a rodar.

## 🔴 2 SURPRESAS CRÍTICAS

**1. Google OC API EOL 15/Jun/2026** — Bretda Google Ads CAPI deploy vira HARD-BLOCKER 30d. Ver [[reminder_google_oc_api_eol_15jun]].

**2. Posicionamento categórico promoted MED-LOW (50%) → HIGH 88% HARD-BLOCKER.** 3 evidências convergem (Seth Godin tribo + Lemkin SaaS positioning + Databricks Industry Imperatives): Bretda+Tocks precisam categoria nomeada própria ("The Heirloom Pool Table" / "Editorial Furniture") em 30d, senão mid-market (Mobly+Tok&Stok R$1.6bi combined) satura interest stack em 12-18m.

## Diffs Atlas → HYDRA

| Elemento | Atlas | HYDRA |
|---|---|---|
| Interest Stack | HIGH 90% | MED-HI 80% (E1 Smart Marketer: broad targeting default 2026) |
| CAPI deploy | P0 | **HARD-BLOCKER 30d** (E16 Google OC EOL) |
| D-04 Posicionamento | MED-LOW 50% | **HIGH 88% HARD-BLOCKER** |
| NEW Element 11 | — | **1P Data Value Exchange** (E10 Tier S 4.9) |

Agreement Atlas vs clones anticipated: ~80% médio. 3 dissents:
- D1: Mix 8 ads vs consolidar 3-4 (4/5 clones consolidate) → refine Element 7
- D2: CAPI + broad targeting sequencing (Pittman vs Aslam split)
- D3: Tier-stratify vs single-anchor pricing (2-1 split)

## Bretda evidência empírica (90d)

- CP1: R$1,840 / 111 leads / CPL R$16.58
- CP2: R$4,960 / 333 leads / CPL R$14.90
- CP3 (paused): R$1,087 / 59 leads / CPL R$18.43
- **Total 90d: R$7,887 / 503 leads / CPL médio R$15.68**

Lead 100% `offsite_complete_registration_add_meta_leads` (Meta Instant Form). CTR 2.36-2.46% / CPC R$1.16-1.71 / CPM R$27-40.

## Entregáveis

`D:/AIOS/docs/projects/highticket/study-15mai-hydra/` (110KB / 2153 linhas):
- 00-METHODOLOGY.md (10KB) — pipeline diagnostic + reproducibility
- 01-hydra-evidence-base.md (24KB) — 17 evidências Tier S/A com URLs
- 02-thesis-hydra-validated.md (14KB)
- 03-decomposition-validated.md (12.7KB) — 10 elementos + NEW Element 11
- 04-clone-synthesis.md (16KB) — 5 clones anticipated + dissents
- 05-applications-validated.md (12KB) — Bretda/Tocks/Vorza/Synkra/KR
- 06-gaps-still-open.md (11KB)
- 99-EXECUTIVE-SUMMARY-HYDRA.md (9.5KB)
- _feeds-to-distribute/ (42KB / 5 arquivos PENDING)

`study-15mai/` (Atlas baseline, 6 docs working-knowledge) preservado p/ comparação.

## 2 perguntas P0 atualizadas pro user

**Q1 HARD-BLOCKER 30d:** Deploy CAPI Caminho B Bretda Google Ads antes 15/Jun? PR CODE READY na memory. Sem isso, atribuição Google quebra ~30d.

**Q2 HARD-BLOCKER 30d:** Brand sprint D-04 (posicionamento categórico Tocks+Bretda) nesses 30d? Cost = só tempo. Adiar D-02 decoy pricing decision até pós-D-04 (sem categoria, decoy atrai comparison shoppers).

## Triggers

- `deploy capi google bretda` → @devops + Kasim Aslam
- `brand sprint d04 tocks bretda` → spawn squad copy+brand
- `distribute hydra feeds highticket` → cp 5 feeds para `D:/jarvis/mega brain/knowledge-feed/{clone}/`
- `re-run hydra highticket full` → kick novo run via OpenAI
- `audit highticket study` → status check

## Related

[[reminder_google_oc_api_eol_15jun]] — HARD-BLOCKER P0
[[session_highticket_squad_08mai]] — research base prévia (não materializada em disco)
[[session_bretda_full_day_15mai]] — case empírico fonte
[[feedback_research_minimum_volume]] — regra 4000+ items (violada nesta run)
[[feedback_high_ticket_quality_over_quantity]] — non-negotiable
[[feedback_use_mind_clones]] — brain-bridge ainda failed
