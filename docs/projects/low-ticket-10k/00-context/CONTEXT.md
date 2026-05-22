# CONTEXT.md — Vorza M3C (Low-Ticket 10K)

**Read FIRST when working on Vorza / low-ticket-10k.** Domain glossary + active state.
Last updated: 2026-05-06 (pós cherry-pick recovery — sequência Y/X/W completa)

---

## ✅ RECOVERY COMPLETO 06/Mai — TODO o trabalho M3C foi recuperado

**Diagnóstico inicial estava parcialmente errado.** O autopilot 05/Mai NÃO operou em "drift de oferta" — operou em **drift de branch**. O trabalho M3C completo (54 arquivos, 8355 linhas) vivia isolado em `feat/low-ticket-lp-pre-launch-v2` e nunca chegou ao branch principal. O autopilot rodou em `feat/redesign-foundation-tokens` cego pra esse trabalho.

**Sequência de recovery (concluída 06/Mai):**
- ✅ **Y** — CONTEXT.md sincronizado com plano Jarvis Black Box
- ✅ **X** — Achei 54 arquivos em branch isolado (META-ADS-CAMPAIGN-PLAN 1258 linhas, 20 PNGs criativos finais, 4 RECOVERY runbooks, 4 REVIEW docs, LP completa HTML/CSS/img)
- ✅ **W** — Cherry-pick 29a436c8 → branch atual (commit `3189ee93`, zero conflitos)

---

## 1. One-line Identity (canônica)

**Vorza M3C** = Método 3C: 147 Prompts de IA para Advogados — produto low-ticket R$37 + bump R$17 (M3C plan) ou R$27 (Jarvis plan, mais recente — **resolver discrepância**) + upsell R$197. Stack: Netlify (LP) + Kiwify (checkout) + Meta Ads (ABO 1-4-2 Lucas Visky + BPM Depesh Mandalia). Público: 1.4M advogados OAB.

**Faz parte de plano maior (5 produtos):** Método 3C é Produto #1 do PLANO-IMPLEMENTACAO-LOW-TICKET (Jarvis 23/Mar), seguido de Conta de Luz, Cão Calmo, Intestino Feliz, Primeiro Investimento.

---

## 2. Domain Glossary

| Term | Meaning | Notes |
|------|---------|-------|
| `Método 3C` / `M3C` | **C**opie, **C**ole, **C**obre — mecanismo do produto | 147 prompts, 11 áreas, público advogados OAB |
| `Vorza` | Marca/branding da LP | Hero "Copie. Cole. Cobre." é EXATAMENTE o mecanismo |
| `Lucas Visky` | Outlier Tiago Finch (R$100k+/mês low-ticket) | Framework canônico — `D:/jarvis/.../low-ticket-10k-strategy.md` (613 linhas) |
| `BPM Method` | @depesh-mandalia | Aplicado nas 3 campanhas Meta |
| `Black Box` | Curso Tiago Finch | Knowledge canônico em `D:/jarvis/mega brain/knowledge/black-box/` |
| `Conclave 23/Mar` | Hormozi+Godin+Galloway+Campbell+Fishkin | Ranqueou 5 produtos. M3C #1 (score 9.4) |
| `Conclave 05/Mai` | Hormozi+Brunson+Godin (autopilot) | DESNECESSÁRIO — re-descobriu o que já estava decidido |
| `R$37 mágico` | Preço front-end Lucas Visky | Pix da confiança |
| `8 dobras` | Estrutura LP Lucas Visky | Sobrancelha→Headline→Depoimentos→Método→Entregáveis→Empilhamento+Ancoragem→Garantia 7d→Sobre+FAQ |
| `1-4-2 ABO` | Estrutura campanha teste | 1 camp, 4 conjuntos, 2 ads, R$37/conjunto = R$148/dia, 24h |
| `TSL` | Text Sales Letter | Sem VSL até R$10k+/mês |
| `Pixel híbrido LGPD` | Auto-fire PageView gated por consent | LIVE (vanilla-cookieconsent v3.0.1, Art. 7 IX) |
| `Drift de branch` | Bug raiz autopilot 05/Mai | Trabalho M3C vivia em branch isolado, autopilot operou cego |

---

## 3. Stack ATUAL (recovered)

| Layer | Tech | Status |
|-------|------|--------|
| Landing page | Netlify (LP M3C completa) | ✅ LIVE — view rate 71% pós-redesign |
| Checkout | Kiwify | ⬜ Atracado (Pixel chegando) — confirmar setup completo |
| Tracking | Meta Pixel `26458851600417959` + Pixel Kiwify | ✅ LIVE LGPD híbrido |
| Tráfego | Meta Ads ABO 1-4-2 | 🔴 **PAUSED 05/Mai** (camp `6986644457499`) |
| Domínio | (vorza.com.br ainda não registrado) | ⬜ Email atual: suportevorza@gmail.com |
| Copy IA | ChatGPT/Claude | ✅ Disponível |
| Vídeo | CapCut | ✅ Disponível |

**Repo paths (recovered):**
- LP: `docs/projects/low-ticket-10k/landing-page/` — index.html + privacidade.html + termos.html + styles.css + img/
- Plano: `docs/projects/low-ticket-10k/META-ADS-CAMPAIGN-PLAN.md` (1258 linhas)
- Criativos doc: `docs/projects/low-ticket-10k/CRIATIVOS-META-ADS-12.md` (503 linhas)
- 20 PNGs: `docs/projects/low-ticket-10k/criativos-finais/ad01..ad12*.png`
- 5 cards C1/C3: `docs/projects/low-ticket-10k/C1-A/C1-B/C3-A/C3-B*.png`
- 4 runbooks: `docs/projects/low-ticket-10k/RECOVERY-RUNBOOK-FASE{1,2,3,4}*.md`
- 4 reviews: `docs/projects/low-ticket-10k/landing-page/{CONCLAVE-LP-REVIEW,REVIEW-COPY-SALES,REVIEW-DESIGN-UX,REVIEW-MARKETING-TRAFFIC}.md`

---

## 4. Os 5 Produtos do Plano (Conclave 23/Mar) — Status

| # | Produto | Score | Front | Bump | Upsell | Status M3C |
|---|---------|-------|-------|------|--------|------------|
| **1** | **Método 3C — 147 Prompts Advogados** | 9.4 | R$37 | R$17→R$27* | R$197 | ✅ LP+criativos+plano prontos. Ads PAUSED 05/Mai |
| 2 | Conta de Luz pela Metade | 8.8 | R$37 | R$27 | R$97 | ⬜ Não iniciado |
| 3 | Cão Calmo em 21 Dias | 9.0 | R$37 | R$27 | R$147 | ⬜ Não iniciado |
| 4 | Intestino Feliz em 14 Dias | 9.0 | R$37 | R$27 | R$97 | ⬜ Não iniciado |
| 5 | Primeiro Investimento R$20/mês | 7.8 | R$37 | R$27 | R$97 | ⬜ Não iniciado |

*Discrepância bump M3C: META-ADS-CAMPAIGN-PLAN diz R$17, plano Jarvis (memory: "ajustado R$47→R$27") diz R$27. **Resolver: usar R$27** (versão mais recente).

---

## 5. Active People & Roles

| Person | Role | Notes |
|--------|------|-------|
| Breno | Owner | — |

---

## 6. Tracking / Pixels / IDs

| System | ID | Status |
|--------|----|----|
| Meta Pixel Vorza | **`26458851600417959`** | LIVE híbrido LGPD |
| Meta Ad Account | **`act_1444169067353681`** | Conta separada Vorza (não Bretda/Tocks/KR) |
| Meta Camp PAUSED | `6986644457499` | C1 TOPO Frio, 7d R$233 / 0 purchases / 1 IC |
| Meta Adsets PAUSED | `6986644517499` (C1), `6986644533099` (C3) | + 6 ads (4 C1, 2 C3) |
| Pixel Kiwify | atracado | InitiateCheckout chegando |

**Observação 0 purchases / 1 IC em 7d:** Antes de assumir "oferta perdedora", verificar:
1. Pixel Meta atribuindo eventos corretamente?
2. CAPI Kiwify configurado? (RECOVERY-RUNBOOK-FASE2 cobre isso)
3. Criativos rodando = ad01-ad12 (20 PNGs)? Ou outros?
4. Connect Rate >75%? Hook Rate >30%? CTR >2.5%? (benchmarks Lucas Visky)
5. ICR >15%? (se sim, oferta OK; se não, oferta precisa ajuste)

---

## 7. Constraints & Non-Negotiables

- ✅ **NUNCA misturar conta Vorza com Bretda/Tocks/KR**
- ✅ **Pixel híbrido LGPD** — base legal Art. 7 IX legítimo interesse
- ✅ **Geo-targeting Brazil + PRESENCE**
- ✅ **R$37 = preço mágico** Lucas Visky
- ✅ **TSL não VSL** até R$10k+/mês
- ✅ **8 dobras** estrutura LP
- ✅ **1-4-2 ABO** estrutura campanha
- ✅ **Black Box é fonte canônica** — consultar antes de inventar
- ✅ **Sempre verificar branches** — `git branch -a` antes de assumir "trabalho não existe"

---

## 8. Known Dead Ends

- ❌ **Autopilot email-pivot 05/Mai** — DRIFT por branch errado. 17 docs em `email-marketing-pivot/`. **A SER ARQUIVADO** (não deletado — tem aprendizados sobre Resend/Supabase úteis para outros projetos).
- ❌ **1ª rodada criativos AI** (29/Abr) — "criativo barato" rejeitado pelo user. Substituído por 20 PNGs criativos-finais ad01-ad12.
- ❌ **Criar+ativar muitos objetos paralelo em ad account fresh** — Meta API blocked code 200 (anti-spam).
- ❌ **Conclaves redundantes** — sempre checar plano antes de novo conclave.
- ❌ **Operar sem `git branch -a`** — bug raiz do autopilot 05/Mai.

---

## 9. Current State Snapshot (06/Mai pós-recovery)

### O que está LIVE
- ✅ LP M3C Netlify (Vorza, view rate 71%, 8 dobras Lucas Visky aplicadas)
- ✅ Pixel Meta `26458851600417959` híbrido LGPD
- ✅ Pixel Kiwify atracado
- 🔴 Meta camp `6986644457499` PAUSED 05/Mai
- ✅ 53 arquivos M3C agora no branch atual (cherry-pick 3189ee93)

### Próximas decisões pendentes
1. **Despausar Meta Ads** (RECOVERY-RUNBOOK-FASE4 tem comandos prontos)
2. **Pré-despause** (RECOVERY-CHECKLIST-FASE3): validar Pixel + CAPI + tracking
3. **Resolver bump R$17 vs R$27** (atualizar campaign plan ou Jarvis plan)
4. **Decidir destino email-marketing-pivot/** (arquivar / deletar / manter como exploration)
5. **Confirmar deploy Netlify usa o branch correto** (provavelmente sim, mas validar)
6. **Conta Kiwify configurada?** (atracou Pixel mas está completa?)

### Próximo trigger sugerido
`status meta vorza despause` → eu leio RECOVERY-RUNBOOKS, valido pré-condições, te mostro o que falta antes de despausar.

OU `vai com produto 2 vorza` → começar Conta de Luz (Produto #2 do plano Jarvis).

---

## 10. Cross-References

### Local (AIOS) — recovered 06/Mai
- LP: `docs/projects/low-ticket-10k/landing-page/`
- Campaign plan: `docs/projects/low-ticket-10k/META-ADS-CAMPAIGN-PLAN.md`
- Criativos: `docs/projects/low-ticket-10k/CRIATIVOS-META-ADS-12.md` + 20 PNGs em `criativos-finais/`
- 4 runbooks: `docs/projects/low-ticket-10k/RECOVERY-*`
- 4 reviews: `docs/projects/low-ticket-10k/landing-page/REVIEW-*`
- Email pivot (a arquivar): `docs/projects/low-ticket-10k/email-marketing-pivot/`
- MEMORY keys: `project_vorza_*`, `session_low_ticket_*`, `reminder_low_ticket_*`
- Related: Bretda (mesmo dono, contas separadas), Tocks (mesmo dono)

### Branches relevantes
- `feat/redesign-foundation-tokens` — branch atual (com M3C cherry-picked)
- `feat/low-ticket-lp-pre-launch-v2` — branch original do trabalho M3C (pode ser deletado pós-merge)
- `main` — não tem M3C (precisa merge eventual)
- `wip/2026-04-17-full-state` — WIP snapshot 17/Abr

### Jarvis (canônico — SEMPRE CONSULTAR)
- **Plano 5 produtos**: `D:/jarvis/mega brain/knowledge/black-box/PLANO-IMPLEMENTACAO-LOW-TICKET.md`
- **Framework Lucas Visky**: `D:/jarvis/mega brain/knowledge/black-box/low-ticket-10k-strategy.md`
- **Posicionamento Carol Pedrini**: `D:/jarvis/mega brain/knowledge/black-box/posicionamento.md`
- **Demais Black Box** (~167KB curados): `D:/jarvis/mega brain/knowledge/black-box/`
- **Aulas raw** (~1MB transcripts): `D:/jarvis/mega brain/inbox/aulas black box/`

### Conclave references
- **23/Mar/2026** (canônico): Hormozi + Godin + Galloway + Campbell + Fishkin
- **05/Mai/2026** (redundante): Hormozi + Brunson + Godin
