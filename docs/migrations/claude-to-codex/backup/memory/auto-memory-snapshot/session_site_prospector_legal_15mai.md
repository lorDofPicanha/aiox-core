---
name: site-prospector-legal-15mai
description: Site-Prospector legal package v1 entregue 15/Mai (review contrato + DPA Anexo I + Termo Parceria Anchor). Pronto pra handoff advogado OAB-SC até v1.1. Deadline hard review 09/Jun/2026.
metadata: 
  node_type: memory
  type: project
  originSessionId: 5853e4ed-3471-469f-a20c-72acb54a218a
---

# Site-Prospector Legal Package v1 — 2026-05-15

Squad jurídico (legal-chief + Patricia Peck + Heather Meeker + Richard Susskind) entregou pacote completo pra desbloquear handoff advogado OAB-SC. Caminho crítico até hard review [[session_site_prospector_12mai]] em 09/Jun/2026 está destravado.

**Why:** Contrato v1 baseline veio do advogado com 11 baseline notes pedindo confirmação. Patricia Peck flagged DPA Anexo I e Termo Anchor como caminho crítico real (não o contrato principal). Triagem Tier 0 do squad confirmou.

**How to apply:** Quando user mencionar "advogado", "contrato Site-Prospector", "Padaria #1 anchor", "v1.1", "DPA" — ler primeiro os 6 arquivos abaixo antes de propor qualquer alteração. NÃO recriar do zero. NÃO duplicar decisões.

## Deliverables produzidos

### Relatório consolidado (FINAL — usar este pacote pro advogado)

| Arquivo | Conteúdo | Quando usar |
|---------|----------|-------------|
| `D:\AIOS\docs\legal\RELATORIO-CONSOLIDADO-SITE-PROSPECTOR-LEGAL-V1.pdf` (1.5 MB) | Pacote completo light-mode otimizado impressão | **Enviar ao advogado OAB-SC** |
| `D:\AIOS\docs\legal\RELATORIO-CONSOLIDADO-SITE-PROSPECTOR-LEGAL-V1.docx` (827 KB) | Word editável light-mode | **Advogado faz redline/comentários** |
| `D:\AIOS\docs\legal\RELATORIO-CONSOLIDADO-SITE-PROSPECTOR-LEGAL-V1.html` (112 KB) | Dark Cockpit AIOX brand ativo | **Leitura tela** (Chrome/Edge) |
| `D:\AIOS\docs\legal\RELATORIO-CONSOLIDADO-SITE-PROSPECTOR-LEGAL-V1.md` (94 KB, 1494 linhas) | Fonte editável com frontmatter AIOX | **Regenerar HTML/PDF/DOCX** |
| `D:\AIOS\docs\legal\.build-report.js` | Script Node: .md → .html + .pdf via Chrome headless | `node .build-report.js` |
| `D:\AIOS\docs\legal\.build-docx.js` | Script Node: .html → .docx via html-to-docx | `node .build-docx.js` |

### Fontes individuais (auditoria — não usar isoladamente)

| Arquivo | Conteúdo |
|---------|----------|
| `D:\AIOS\docs\legal\contrato-v1-baseline-extracted.txt` | Contrato v1 do advogado, 20 cláusulas (input) |
| `D:\AIOS\docs\legal\contrato-v1-review-2026-05-15.md` | Review ~7k palavras (§3 do consolidado) |
| `D:\AIOS\docs\legal\dpa-site-prospector-v1-2026-05-15.md` | DPA Anexo I completo (§4 do consolidado) |
| `D:\AIOS\docs\legal\dpa-decisions-memo-2026-05-15.md` | PECK-AUTO-DECISIONS + risk flags DPA (§4.X) |
| `D:\AIOS\docs\legal\termo-parceria-anchor-v1-2026-05-15.md` | Termo Anchor v1 (§5 do consolidado) |
| `D:\AIOS\docs\legal\anchor-risk-memo-2026-05-15.md` | Risk memo Anchor (§5.X do consolidado) |
| `D:\AIOS\docs\legal\triage-2026-05-15.md` | Triagem Tier 0 (§2 do consolidado) |

### Brand identity aplicada

- **AIOX Brand v2.0 — Dark Cockpit Edition** (https://brand.aioxsquad.ai/brandbook)
- Accent: Kinetic Limon `#D1FF00` · BG: Void Dark `#0A0A0A` · Type: Geist + Roboto Mono
- Arquétipo: Magician 60% + Sage 25% + Explorer 15%
- HTML preserva dark cockpit; PDF/DOCX exportam light-mode pra impressão/edição

## Decisões fechadas (autônomas — user aceitou)

- **Setup Anchor R$1.000** (não R$0) — mitiga venda casada CDC + doação de serviço + req tributária
- **Anchor 6 meses** sem mensalidade — cobre 2 quadrimestres Blumenau
- **3 anchors** total (não 1) — valida metodologia + mitiga concorrência desleal
- **Pós-anchor: 30% desconto × 12m Growth** — reconhece co-construção sem concessão eterna
- **Tributação Anchor: bonificação publicitária com lastro contratual** (NÃO permuta) — Cl. 9.4
- **DPA robusto** (não simplificado Pequeno Agente) — defensável em audit ANPD
- **Base legal transferência internacional**: SCCs Res. ANPD 19/2024 + DPAs vendor por referência
- **CONTRATANTE designa próprio Encarregado** — vedação CONTRATADA acumular
- **Retenções**: tracking 14m, forms 12m, WhatsApp 24m, IP/logs 6m
- **Súmula 297/STJ** premissa do advogado VALIDADA — padaria PJ tratada como consumidor-equiparada

## Pendências P0 (Breno, 5-10d úteis)

1. Decidir A3 stack analytics: GA4 vs PostHog (impacta DPA Anexo A)
2. Decidir A5 stack backend: Resend+Supabase vs Vercel KV (impacta DPA Anexo A)
3. Consulta contador especializado Simples Nacional + ISS Blumenau — Cl. 9 Termo Anchor (risco #1)
4. Levar pacote consolidado pro advogado OAB-SC

## Pendências P1 (advogado OAB-SC)

- v1.1 contrato absorvendo 5 críticas + 3 cláusulas faltantes
- DPA review + adaptação OAB-SC
- Anexo I Termo Anchor (Modelo Cessão Imagem Individual)
- Anexo II Termo Anchor (DPA Testimonial/Imagens)
- Nota técnica 1 página enquadramento Pequeno Agente ANPD

## Custos estimados consolidados

- Original orçamento: R$2.500-5.000
- Incremental v1.1+DPA+Anexos: R$800-2.000
- **Total: R$3.300-7.000** — dentro do plano original

## Gap roster legal-chief flagged

Spawn config do legal-chief em `.claude/agents/legal-chief.md` referencia phantoms: `@ken-adams`, `@brad-feld`, `@tributarista`, `@trabalhista`, `@societarista`, `@pierpaolo-bottini`, `@lgpd-specialist` — **nenhum existe** no roster real. Real roster (`squads/legal/squad.yaml`): apenas heather-meeker, richard-susskind, lawrence-lessig, patricia-peck (4 agentes). Cobertura faltante: tributário, trabalhista, societarista BR puros + criminal empresarial. **Não bloqueia esta semana**, mas precisa correção antes da próxima onda (M&A/holding/contratações). Ação: aios-architect criar specialists OU atualizar spawn config pra refletir real.

## Memória do squad legal-chief

- `D:\AIOS\.claude\agent-memory\legal-chief\project_site_prospector_contract_v1.md`
- `D:\AIOS\.claude\agent-memory\legal-chief\project_site_prospector_dpa_v1.md`
- `D:\AIOS\.claude\agent-memory\legal-chief\project_site_prospector_anchor_termo.md`

## Triggers de retomada

- `pacote advogado site-prospector` → consolidar 6 docs num bundle
- `audit site-prospector pilot week N` → tracking 4 semanas
- `verdict site-prospector` → 09/Jun checkpoint go/pivot/kill
- `memo IP aios mind clones` → 3º P0 da triage (Lessig solo, ainda pendente)
- `corrige roster legal-chief` → fix phantom agents

## Status onda 1 da triage

- ✅ #2 Site-Prospector legal (este pacote)
- ⏳ #1 Anipis conclave SaMD-vs-Wellness — pendente
- ⏳ #3 AIOS mind clone IP memo (Lessig) — pendente
