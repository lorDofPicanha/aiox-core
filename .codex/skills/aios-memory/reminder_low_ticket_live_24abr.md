---
name: Low Ticket 10k — Aguarda restart CC pra despausar (30/Abr 11h)
description: LP redesignada + 9 objetos Meta PAUSED prontos. Token Vorza foi resolvido pelo user, mas MCP precisa de restart Claude Code pra recarregar. Pós-restart: validar token + despausar 9 objetos.
type: project
originSessionId: bb9160a3-dc9c-41a7-a24c-e78fa5d58550
---
# Low Ticket 10k — STATUS: AGUARDA RESTART CC (30/Abr/2026 11h)

## 🔴 BLOQUEIO ATUAL: restart Claude Code

**O que aconteceu:**
- 30/Abr ~10h45: tentei despausar 9 objetos via MCP → todos retornaram `API access blocked` code 200
- Bretda funcionava normal (R$1.318 spent 30d, 107 leads) — específico do token Vorza
- Causa provável: ad account fresh + criação rápida de muitos objetos + tentativa de ativação simultânea + **domain verification do `vorza-metodo3c.netlify.app` ainda pendente no BM Vorza**
- 30/Abr ~11h: user disse "resolvi o token mais preciso reiniciar o claude"

**Pós-restart imediato:**
1. `meta_ads_list_accounts` — confirmar que vorza ainda aponta pra act_1444169067353681
2. `meta_ads_overview account=vorza` — confirmar token funcionando (deve retornar campaign_count=1)
3. Se OK → executar **despause sequencial** dos 9 objetos:
   ```
   meta_ads_update_status object_id=6986644457499 status=ACTIVE  # campaign
   meta_ads_update_status object_id=6986644517499 status=ACTIVE  # adset C1
   meta_ads_update_status object_id=6986644533099 status=ACTIVE  # adset C3
   meta_ads_update_status object_id=6986644696299 status=ACTIVE  # AD01 Dor do Tempo (C1)
   meta_ads_update_status object_id=6986644720499 status=ACTIVE  # AD02 FOMO (C1)
   meta_ads_update_status object_id=6986644744299 status=ACTIVE  # AD03 R$37 (C3)
   meta_ads_update_status object_id=6986644756099 status=ACTIVE  # AD04 Mãe (C3)
   meta_ads_update_status object_id=6986644775899 status=ACTIVE  # AD05 Pai (C3)
   meta_ads_update_status object_id=6986644801499 status=ACTIVE  # AD06 Solo café (C3)
   ```
   **IMPORTANTE:** ativar SEQUENCIAL (não paralelo) — paralelo foi o que disparou o bloqueio na primeira tentativa
4. Reportar resumo: spend R$74/dia ON, kill rules vigentes, primeiro Purchase signal esperado em 24-48h

## ✅ Estado da LP — LIVE (https://vorza-metodo3c.netlify.app)

### Mudanças do dia (3 deploys):
1. **4 Quick fixes pré-launch:** typo "Faça", footer CNPJ removido, email mantido `suportevorza@gmail.com` (domínio vorza.com.br não registrado), banner LGPD vanilla-cookieconsent v3 + Pixel block
2. **Hero redesign completo:**
   - Headline serif Fraunces 600: **"Copie. Cole. Cobre."**
   - Sub: "O método de 18 minutos por petição que advogados solo já usam para protocolar o triplo."
   - Layout 2 colunas grid (58/42 desktop, stack mobile)
   - **Demo papel ANTES (3h)/DEPOIS (18min)** substituiu mockup iPad
   - Removido: background documento decorativo, mockup, 3 badges flutuantes, trust badges
   - Paleta: navy + off-white + verde único
   - Container responsive 1120/1280/1360px
3. **Pain section:** foto AI cafona substituída por **`vorza-pain-real.webp`** (C1-A do user, advogado 23h escritório real, Kodak Portra documental)
4. **Solution section:** foto AI cafona substituída por **`vorza-solution-real.webp`** (foco.png do user, advogado ThinkPad + Vade Mecum + post-its + OAB framed). Container max-width aumentado pra 800/960px desktop.

### Arquivos modificados (todos no Netlify production):
- `index.html` — hero refeito + pain/solution images trocadas
- `styles.css` — hero CSS reescrito + container responsive + method-result__wrap maior
- `privacidade.html`, `termos.html` — email reverted
- `img/vorza-pain-real.webp` (60KB)
- `img/vorza-solution-real.webp` (111KB)

## 📊 Estrutura Meta Ads (act_1444169067353681)

### Campanha (PAUSED, aguarda despause)
- **ID:** `6986644457499`
- **Nome:** `[ABO] M3C — TOPO Frio v2`
- **Objective:** OUTCOME_SALES
- **Budget:** ABO (budget no adset)

### Adsets (PAUSED)
| Nome | ID | Budget | Targeting |
|---|---|---|---|
| C1 — INT Advocacia + OAB | `6986644517499` | R$37/d | BR home+recent, age 25-60, superior, interesses Direito + Branches of law + Ensino jurídico + Direito tributário |
| C3 — BROAD Superior 25-55 | `6986644533099` | R$37/d | BR home+recent, age 25-55, superior |

Ambos: OFFSITE_CONVERSIONS, billing IMPRESSIONS, bid LOWEST_COST_WITHOUT_CAP, pixel `26458851600417959` PURCHASE, Advantage+ Audience OFF

### 6 Ads (PAUSED)
| # | Ad ID | Adset | Headline | Image |
|---|---|---|---|---|
| 1 | `6986644696299` | C1 | De 3h para 18min por peticao | C1-A Dor do Tempo |
| 2 | `6986644720499` | C1 | Seus concorrentes ja usam IA | C1-B FOMO |
| 3 | `6986644744299` | C3 | R$37 = sua advocacia 3x mais rapida | C3-A R$37 still-life |
| 4 | `6986644756099` | C3 | Quanto vale 2 horas com a familia? | C3-B Mãe |
| 5 | `6986644775899` | C3 | Quanto vale 2 horas com seus filhos? | C3-B Pai |
| 6 | `6986644801499` | C3 | Quanto vale 2 horas livres no seu dia? | Café solo |

- LP: https://vorza-metodo3c.netlify.app
- CTA: Learn More
- Page: "Metodo 3c" (`1064235853441529`)

## 🔥 Kill rules (vigentes pós-despause)
1. R$100 gasto sem 1 Purchase → pause ad
2. CPA > R$24 → pause ad
3. Não mexer 72-120h após primeiro Purchase signal real (T0 = despause real)

## 📌 Pendências secundárias

### URGENTES
- **Token Netlify** `nfp_Tvfi1dv9ipFh1FydAUPP2BLfhWXFqF6ja62f` ainda válido — user precisa REVOGAR em https://app.netlify.com/user/applications#personal-access-tokens (foi usado 4x deploy nesta sessão)
- **Domain verification do `vorza-metodo3c.netlify.app`** no BM Vorza — provável causa do API blocked. Resolver: BM → Settings → Brand Safety → Domains → adicionar vorza-metodo3c.netlify.app + pegar `<meta name="facebook-domain-verification">` code → adicionar na LP

### NÃO-URGENTES
- Sticky CTA mobile ainda diz "ECONOMIZAR 3H POR PETIÇÃO" — desalinhado do novo "COMEÇAR — R$37". Edição 1 linha index.html
- 3 mind clones via brain-bridge MCP ainda pending: Joanna Wiebe (`0e6bfd22-7836-4463-8e9a-f8a1d9fde8fc`), Oli Gardner (`b056af67-0785-4ca2-b25d-2f0672538c0f`), Erik Spiekermann (`27796ab7-fdc7-4642-8f72-1d34b128b79a`) — quando responderem, pegar feedback e validar contra hero atual
- LGPD cookie banner LIVE mas precisa testar real consent flow (Reject → 0 requests `facebook.com/tr`; Accept → PageView dispara)
- Site `vorza-metodo3c.netlify.app` continua sem domain verification BM Vorza (afeta iOS 14.5+ tracking)

## 🚀 Commit + push do dia
- Branch: `feat/low-ticket-lp-pre-launch-v2`
- Commit base: `29a436c8` (53 files, 8355 insertions) — pushed pra fork lorDofPicanha (origin SynkraAI 403 bloqueado por padrão estabelecido)
- **Mudanças do hero redesign + pain/solution images NÃO COMMITADAS ainda** — só foram pra Netlify direto. Próxima sessão: @devops faz commit incremental dessas mudanças.

## 💡 Quando user mandar "voltei" / "go" / "despausa"
Trigger: user volta da restart, qualquer sinal de retomada
Ação: ler este arquivo + executar checklist do "Pós-restart imediato" acima

**Why:** sessão complexa entrelaçando LP redesign + image swap + Meta API issues. Sem este save, próxima sessão eu re-investigo do zero por 30+ min.
**How to apply:** quando user mandar sinal de volta, validar MCP primeiro (overview vorza), depois executar 9 update_status SEQUENCIAIS (não paralelo).
