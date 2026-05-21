---
name: Meta Partnership exige compartilhar TODOS os assets separadamente
description: Aprendizado 29/Abr/2026 — partnership Meta tem assets segregados (ad account ≠ page ≠ pixel ≠ catalog). Compartilhar só ad account NÃO basta pra publicar ads.
type: feedback
originSessionId: 877b1996-ea12-4314-ba46-ebdb9d6fadcf
---
# Meta Partnership — Compartilhar TODOS os assets, não só ad account

**Regra:** Quando configurar partnership entre Business Managers (BM_A → BM_B), compartilhar EXPLICITAMENTE cada asset que será usado: ad account + page + pixel + catalog. Não assumir que a partnership da ad account "leva junto" os outros assets.

**Why:** Descoberto 29/Abr/2026 no setup KR (BM Kell ↔ BM Vorza). Setup 28/Abr compartilhou ad account `act_210585430466029` mas não a Página FB `543056628881459`. Resultado: campanha criou normalmente (PAUSED), mas os 3 adsets falharam com `error_subcode 1487202`: "Permissões da Página insuficientes". Demoramos uma sessão inteira pra descobrir o gargalo (criação dos adsets já estava pronta, schemas validados).

**How to apply:**
- ✅ Pre-flight checklist antes de criar qualquer ad set em conta com partnership:
  1. Ad Account compartilhada? → `meta_ads_list_accounts` mostra a conta
  2. Page compartilhada? → tentar `meta_ads_audience` num adset existente; se retornar `promoted_object.page_id`, a Page existe na BM. **Mas existir ≠ ter permission**: confirmar role assigned (Advertiser ou Admin).
  3. Pixel compartilhado? → `meta_ads_pixel_check` retorna lista; se vazio quando deveria ter, falta partnership do pixel
  4. Catalog (se aplicável)? → mesmo princípio
- ✅ Quando pedir cliente compartilhar BM como partnership, mandar lista literal dos assets:
  > "Em business.facebook.com → Configurações Empresariais:
  > 1. Contas → Contas de Anúncio → [conta] → Adicionar Parceiro → [BM ID]
  > 2. **Páginas** → [página] → Adicionar Parceiro → [BM ID]
  > 3. **Fontes de Dados** → Pixels → [pixel] → Adicionar Parceiro → [BM ID]
  > 4. (se aplicável) Catálogos → [catálogo] → Adicionar Parceiro → [BM ID]"
- ✅ Sempre role mínimo: **Advertiser** (não precisa ser Admin pra publicar ads)

**Anti-pattern:** Assumir que aceitar partnership "global" cobre tudo. Não cobre.

**Edge case útil:** `meta_ads_audience(adset_id)` em qualquer adset existente retorna `promoted_object.page_id` — atalho pra descobrir page_id de uma BM partner sem precisar do FB Business Settings UI.

---

## Atualização 29/Abr noite — System User assignment é a CAMADA 3

Partnership tem 3 camadas independentes que não cascateiam entre si:

| Camada | Quem compartilha | Onde verifica |
|---|---|---|
| 1. Ad Account → BM destino | BM origem | `meta_ads_list_accounts` mostra |
| 2. Page → BM destino | BM origem | Definições BM destino → Contas → Páginas (Page aparece) |
| 3. **System User → Page** (DENTRO do BM destino) | BM destino | Utilizadores do Sistema → System User → Ativos atribuídos |

**Caso real KR (29/Abr):**
- ✅ Ad Account compartilhada (28/Abr)
- ✅ Page compartilhada (29/Abr 19h após 2 tentativas — primeira foi Page → User pessoal, errado)
- ❌ System User do BM destino NÃO atribuído à Page → erro `1487202` PERSISTIU mesmo com Page visível no BM destino

**Sintoma característico da camada 3 faltando:** Page aparece em "Definições → Contas → Páginas" do BM destino, mas com texto "0 pessoas estão atribuídas a esta Página". API ainda dá `1487202`.

**Resolução camada 3:**
1. BM destino → Utilizadores → Utilizadores do Sistema
2. Selecionar System User cujo token a API usa
3. Adicionar Ativos → Páginas → [Page]
4. Permissão: **"Gerir Página"** (não só "Criar anúncios" — esse insuficiente em alguns casos)

**Pre-flight checklist atualizado:**
1. Ad Account compartilhada? → `meta_ads_list_accounts`
2. Page no BM destino? → `meta_ads_audience(adset_id_existente)` retorna page_id
3. **System User atribuído à Page com "Gerir Página"?** → única forma é olhar UI Business Settings do BM destino

**Anti-pattern adicional:** Atribuir Page a um **User humano** (mesmo que seja você admin) e achar que resolve API. Não resolve — API usa System User token, então só o System User precisa estar atribuído.
