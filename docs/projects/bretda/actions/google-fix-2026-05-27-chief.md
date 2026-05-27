# Bretda Google Ads — FIX EXECUTADO — Chefe de Tráfego — 2026-05-27

**Conta:** `8167636084` (Bretda) · MCC `7943699417` · OAuth VERDE
**Disparado por:** Breno — "analise o google ads da bretda, além de não estar rodando ele está todo em inglês"
**Doutrina:** Molly Pittman (Tier 0 diag) + Kasim Aslam (Tier 1 Google)
**Modo:** WRITE (consent via AskUserQuestion: P0 + Fix tracking + Rename PT-BR)

---

## Diagnóstico LIVE (14d, 27/Mai)

- Spend R$147,55 · 107 impr · 11 cliques · **0 conv** · CPC R$13,41 · ROAS 0
- Conta ENABLED e gastando, mas **entrega quase nada** → parece "morta"
- Gastando só ~17% do budget disponível (R$10,5/d real vs R$60/d) → **constraint é supply de impressão (QS), não budget**

### Causas-raiz "não está rodando"
1. **Quality Score 0/3** na maioria das 100 keywords → Google não ranqueia
2. **🚨 RTG rodando `mesa` BROAD** consumindo 61/107 impr (57%) — lixo, 0 conv
3. **Demanda de marca ≈ 0** — "bretda" teve 1 impr/14d
4. **LP genérica** (root + /colecao) → post-click QS baixo (círculo vicioso)

### Causa "todo em inglês"
- Nomes de campanha/ad group em inglês (Brand-Defense, Generic-HighIntent, RTG-SiteVisitors). **Conteúdo dos anúncios já estava em PT.**
- Possível 2ª camada: idioma da interface do Google Ads (setting por-usuário, não via API).

### Achados de tracking
- **F6 zumbi `[AGD] Lead 7138711130`** ainda vivo (WEBPAGE_CODELESS, R$100, always_use) — read-only via API
- **Empilhamento:** 6 ações ENABLED, 4 do tipo Lead Form (2 duplicadas R$1.500)
- ✅ **`Bretda Sale Closed (Offline OC)` 7612768697 existe** — close-sale offline (era o que faltava)

### Mapa estrutural (descoberta importante)
Ad groups-zumbi QS0 estão TODOS dentro da campanha legada PAUSADA `08/11` (23251766617) → **não servem, não gastam**. As 4 campanhas ENABLED têm estrutura limpa. **Não foi preciso pausá-los.**

---

## Writes executados ✅

| # | Ação | Tool | Resultado |
|---|---|---|---|
| 1 | Pausar ad group RTG (`mesa` broad) `197138288398` | `update_ad_group_status` | ✅ PAUSED — sangramento parado |
| 2 | Demover soft conv pra SECONDARY: `Contato` + `WhatsApp-CLICK` + zumbi `[AGD] Lead` | `set_conversion_priority` (primary=false) | ✅ CONTACT~WEBSITE + SUBMIT_LEAD_FORM~WEBSITE → SECONDARY |
| 3 | **Corrigir efeito colateral:** restaurar `SUBMIT_LEAD_FORM~WEBSITE` → PRIMARY | `set_conversion_priority` (primary=true) | ✅ leads reais voltaram a ser biddáveis |
| 4 | Renomear 4 campanhas + 7 ad groups EN→PT | script `bretda-rename-ptbr-27mai.cjs` (`google-ads-api` v23) | ✅ confirmado live |

### Falhas honestas
- ❌ Zerar valor do zumbi `[AGD] Lead` → `MUTATE_NOT_ALLOWED` (codeless = read-only). Mitigado via SECONDARY; remoção total exige **deletar na UI**.
- ⚠️ Conversion goals são por **categoria~origem**, não por ação individual → não dá pra isolar o zumbi do lead real via API enquanto ambos forem `SUBMIT_LEAD_FORM~WEBSITE`.
- ❌ Toggle do offline `7612768697` (origem UPLOAD) → `RESOURCE_NOT_FOUND` (não tem goal-toggle padrão).

### Rename aplicado
- `[BR][PESQUISA] Defesa de Marca` (23821730141)
- `[BR][PESQUISA] Mesa de Bilhar — Alta Intenção` (23816403561)
- `[BR][PESQUISA] Mesa de Jantar — Alta Intenção` (23821730147)
- `[BR][PESQUISA] Remarketing — Visitantes 90d` (23821730339)
- Ad groups: Marca / Mesa Bilhar — Luxo·Madeira Maciça·Sob Medida / Mesa Jantar — 12 Lugares·Madeira Maciça / Remarketing — Visitantes 90d

---

## Pendências (founder / próximo passo)

| Pri | Item | Owner |
|---|---|---|
| 🔴 P0 | **Deletar zumbi `[AGD] Lead`** na UI (Google Ads → Metas/Conversões → excluir codeless) | Breno (UI) |
| 🔴 P0 | **Idioma do painel** se ainda em inglês: ⚙️ Configurações → Preferências → Idioma → Português (Brasil) | Breno (UI) |
| 🟡 P1 | **Dedup lead forms** — checar se `Lead - Pagina Obrigado` (7571079256) E `Bretda Lead Form Submit Web` (7612732481) disparam no mesmo submit (= dupla contagem) | Breno/GTM |
| 🟡 P1 | **LP específicas** por tema (sinuca-jantar / 12-lugares / bilhar-luxo) em vez de root+/colecao | @dev |
| 🟡 P1 | **Smoke test** do disparo da conversão em bretda.com.br/obrigado (gtag) | Breno |
| 🟢 P2 | Reconstruir RTG com keywords de alta intenção + audience layer (não broad "mesa") | chefe tráfego |
| 🟢 P2 | Checar saldo/PIX antes de subir budget (cap ~R$318 visto em 15/Mai) | Breno |

**Verdict:** destravado o que dava por write (waste + tracking + idioma). O "rodar de verdade" depende de LP + demanda de marca + tempo de QS — não é um botão.

---

## 🚨 UPDATE — CAUSA-RAIZ REAL de "não está rodando" (probe `bretda-why-stopped-27mai.cjs`)

Founder: "faz uma semana e o valor continua o mesmo". Curva de gasto confirma:
- 30d R$635 · 14d R$147 · **7d R$0 · ontem R$0 · hoje R$0**
- Gasto diário: 13/Mai R$1,30 · 15/Mai R$96,73 · **16/Mai R$49,52 → depois ZERO**. Morta há ~11 dias.

**Diagnóstico via API (read-only):**
| Check | Valor | Leitura |
|---|---|---|
| customer.status | 2 (ENABLED) | não suspensa |
| campaign.primary_status (4 camp) | 2 (ELIGIBLE), reasons vazio | elegíveis |
| billing_setup.status | 4 (APPROVED) | pagamento ok |
| **account_budget** | **servido R$26.769,71 / teto R$26.900 (99,5%)**, endType FOREVER | 🔴 **TETO ESTOURADO** |

**CAUSA-RAIZ:** a conta roda num **budget order com teto R$26.900**; bateu o teto em 16/Mai → Google parou de servir tudo. NÃO é config de campanha. Os writes feitos hoje ficam dormentes até liberar orçamento.

**FIX (founder, UI billing):** Google Ads → Faturamento → **Orçamentos da conta** → aumentar limite de R$26.900 OU criar novo orçamento (pode exigir confirmar pagamento; conta sob MCC `7943699417`). Não fazível/recomendável via API.

**Pós-liberação:** conta volta a rodar e agora melhor (sem broad "mesa", PT, conversões limpas). Considerar reduzir budgets diários (R$60/d somados) pra esticar saldo.
