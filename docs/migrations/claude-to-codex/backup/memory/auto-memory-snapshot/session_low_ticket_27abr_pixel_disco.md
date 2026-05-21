---
name: Sessão Low Ticket 27/Abr - Diagnóstico Pixel + 2 Ad Accounts Descobertas
description: Log completo da sessão noturna 27/Abr Orion+squads. Diagnóstico da campanha que nunca rodou, erro de interpretação de Pixel vs Ad Account ID, descoberta de 2 ad accounts vorza, plano para retomada 28/Abr.
type: project
originSessionId: 675d4b8a-59cc-4739-8079-16f268c3d827
---
# Sessão Low Ticket — 27/Abr noite (Orion + squads)

## Timeline da sessão

### Fase 1 — Diagnóstico inicial (gate D+3)
1. User: "como esta meu projeto low ticket"
2. Orion puxa via MCP `meta_ads_overview/insights/adsets/creatives` da conta vorza
3. Descoberta: spend last_30d = R$0, 4 ads PAUSED apesar de adsets+campanha ACTIVE
4. `meta_ads_pixel_check` retorna `has_pixel: false`
5. WebFetch da LP confirma snippet Pixel `26458851600417959` instalado e disparando PageView
6. Hipótese inicial: Pixel existe na LP mas não está atribuído à ad account `act_793656664671388`

### Fase 2 — User esclarece BM novo
1. User: "1. e um bm novo. 2 não sei quem fez foram voces"
2. Orion confirma cenário e propõe 3 opções de fix
3. User escolhe Opção 3 (delegar ao traffic-masters-chief)

### Fase 3 — traffic-masters-chief orquestra plano
1. Chief executa em background (~8 min)
2. Entrega 4 docs de RECOVERY em `docs/projects/low-ticket-10k/`:
   - RECOVERY-RUNBOOK-FASE1-PIXEL-ATTACH.md
   - RECOVERY-RUNBOOK-FASE2-CAPI-KIWIFY.md (Kiwify nativo, ZERO código)
   - RECOVERY-CHECKLIST-FASE3-PRE-DESPAUSE.md (10 itens)
   - RECOVERY-FASE4-DESPAUSE-COMMANDS.md
3. Memory atualizada por chief

### Fase 4 — User executa Fase 1 manual
1. User abre BM Vorza
2. Reporta "no conjunto de anuncios apareceu pixel não associado"
3. Reporta "aparceu conectado com esta aqui, 1444169067353681"
4. Reporta "descobrir que este pixel e de onde esta a pagina da vorza"
5. **ERRO ORION:** Interpretei `1444169067353681` como Pixel ID (era Ad Account ID)

### Fase 5 — Redeploy errado da LP
1. Orion delega aios-dev pra trocar pixel da LP de `26458851600417959` → `1444169067353681`
2. aios-dev restaura LP do commit `541921eb`, edita HTML, redeploy Netlify
3. Build success: `69eff879eb552c85811786f1`
4. Validação confirma novo ID `1444169067353681` no live

### Fase 6 — User pega o erro
1. User: "no pixel" (não há pixel listado em algumas telas)
2. User envia print do BM mostrando Pixel `26458851600417959` ATRIBUÍDO a "vorza"
3. Orion percebe erro de interpretação: `1444169067353681` é Ad Account, não Pixel
4. **LP foi quebrada** — snippet `fbq('init', '1444169067353681')` é inválido (Ad Account ID, não Pixel ID)

### Fase 7 — Reversão da LP
1. Orion delega aios-dev pra reverter
2. aios-dev troca LP de volta `1444169067353681` → `26458851600417959`
3. Build success: `69effb45326f638e68033ed5`
4. Validação curl confirma pixel correto disparando

### Fase 8 — User testa adset → erro #1815045
1. User edita adset C1 com pixel `26458851600417959`
2. Meta retorna erro `#1815045 — A conta 793656664671388 não tem acesso ao píxel`
3. User também reporta: "criativos estão uma merda, tudo errado e tudo em ingles"

### Fase 9 — User envia print do seletor de ad accounts
1. Print revela DUAS ad accounts:
   - `1444169067353681` (vorza) DENTRO do BM Vorza (Portfólio de Negócios)
   - `793656664671388` em "Outros ativos" (FORA do BM)
2. **Diagnóstico final:** campanha foi criada na ad account ERRADA (793). Pixel está na ad account CERTA (1444). Por isso o erro #1815045.

### Fase 10 — Encerramento
1. Orion apresenta 3 caminhos (B/C/A) para resolver
2. User: "salva tudo amanha sequimos"
3. Orion salva memory + reminder atualizado

## Aprendizados técnicos da sessão

1. **IDs de Pixel, Ad Account, Page, Catalog têm formato similar (15-17 dígitos numéricos)** — não dá pra distinguir só pelo número. Sempre confirmar tipo de asset antes de qualquer ação.

2. **MCP `meta_ads_pixel_check` pode retornar `has_pixel: false` mesmo com pixel atribuído** — provavelmente lag de cache ou diferença de modelo (Meta migrou de "Pixel" pro novo "Dataset"). Print do BM é fonte da verdade superior ao MCP nesse aspecto.

3. **MCP `meta_ads_list_accounts` mostra apenas ad accounts acessíveis ao token OAuth** — pode haver outras ad accounts no portfólio do user que o MCP não enxerga (especialmente as fora do BM linked).

4. **Erro #1815045** = Pixel access denied. Solução: Pixel precisa estar atribuído à ad account E ad account precisa estar no mesmo BM (ou Pixel compartilhado entre BMs).

5. **Reverter deploy via Netlify CLI funcionou** com PAT antigo `nfp_Ueo839mMgWje53AquDGqn6k9oScVXTQE461f` (confirmado válido).

6. **Squad delegation funcionou bem 2 vezes** (chief + 2x aios-dev), em paralelo com user fazendo ações no BM.

## Estado dos arquivos (working tree, não-committed)

```
?? docs/projects/low-ticket-10k/landing-page/index.html
A  docs/projects/low-ticket-10k/landing-page/{20 arquivos restaurados de 541921eb}
A  docs/projects/low-ticket-10k/RECOVERY-RUNBOOK-FASE1-PIXEL-ATTACH.md
A  docs/projects/low-ticket-10k/RECOVERY-RUNBOOK-FASE2-CAPI-KIWIFY.md
A  docs/projects/low-ticket-10k/RECOVERY-CHECKLIST-FASE3-PRE-DESPAUSE.md
A  docs/projects/low-ticket-10k/RECOVERY-FASE4-DESPAUSE-COMMANDS.md
```

Decisão: NÃO commitado. devops decide pós-recovery se commita ou descarta.

## Pendência ABSOLUTA pra retomar amanhã

**User precisa enviar SCREENSHOTS DOS 4 ADS** (Ads Manager > expandir cada adset > preview de cada ad mostrando PNG + título + body):
- C1-A `120244099410470621` "Cronômetro"
- C1-B `120244099412870621` "Autoridade OAB"
- C3-A `120244099414140621` "Matemática Cruel"
- C3-B `120244099414750621` "Pergunta Provocativa"

Orion analisa visualmente e decide:
- PNGs OK → Caminho B (compartilhar pixel, 5 min, mantém ads)
- PNGs ruins/em inglês → Caminho C (recriar tudo na ad account 1444, 40-60 min)

## Background tasks ainda válidos

Nenhum. Todos os squads finalizaram (chief + 2x aios-dev).

**Why:** Sessão longa com diagnóstico iterativo, 1 erro de Orion (interpretação de ID), reversão completa, e descoberta arquitetural importante (2 ad accounts diferentes). Importante registrar pra não repetir o mesmo erro.
**How to apply:** Próxima sessão começar com: "olhe `reminder_low_ticket_live_24abr.md` + `session_low_ticket_27abr_pixel_disco.md`, peça screenshots dos 4 ads ao user, decida B vs C, execute."
