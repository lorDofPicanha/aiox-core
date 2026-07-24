# Conclave Profundo — Google Ads Bretda (09/Jun/2026)

> **Método:** conclave HYDRA real (modo pesado) — 5 especialistas como **agentes independentes**, cada um puxando **dado vivo** da conta `8167636084`, analisando sozinho; depois **rodada adversarial** (refutam-se); depois síntese. 10 agentes, ~600k tokens.
> **Painel:** Larry Kim (PPC/QS) · BLITZ/Kasim Aslam (estrutura/ROAS) · Cassie Kozyrkov (decision intelligence) · Neil Patel (growth/SEO) · Pedro Sobral (tráfego BR/WhatsApp).
> **Contexto:** mesas de jogos de luxo sob encomenda, ticket **R$33.000**, conversão cega há 6 meses, Search no ar, funil fecha no WhatsApp sem registro.

---

## 💣 A descoberta crítica (Cassie, confirmada pelos 5 na rodada adversarial)
As ações de conversão estão com **`default_value = R$1.500` hardcoded** (`always_use_default_value=true`) — **não o ticket real de R$33.000. Erro de 22×.** Mesmo consertando a medição, o Smart Bidding aprenderia a caçar cliente de R$1,5k (perfil "madeira maciça 6 lugares" = o lixo que já entra), não o comprador de R$33k. **Pré-requisito do pré-requisito.** Ações afetadas: Sale-Closed-OC (`7612768697`), Lead-Pagina-Obrigado (`7571079256`), Bretda Lead Form Submit (`7612732481`). Zumbi `[AGD] Lead` (`7138711130`) = R$100 codeless.

## 📊 Dado vivo levantado pelos agentes
- **R$292 gastos / 33 cliques / ZERO conversões em 30 dias.**
- **Search Impression Share travado em 9,99%** → perde ~90% dos leilões; CPC real **R$12-18** vs teto R$6 → praticamente invisível.
- **"mesa de sinuca e jantar"** = 29 impr, **CTR 17-19%** = o termo de maior intenção e CTR do acervo (o unicórnio). **"mesa de sinuca de luxo" = ZERO impressão.**
- Vazamento commodity não pego pelos 47 negativos: "conjunto 6 lugares", "varanda apartamento", "rústica", "demolição", "vidro", "cozinha 4 cadeiras".
- Keywords zumbi ainda ENABLED nos grupos antigos (arquitetos, MESAS, Grupo de anúncios 1) — QS 0, poluindo histórico.

## ✅ Consenso (5/5)
1. Consertar o loop de conversão **ANTES** de subir lance/budget.
2. **NÃO subir CPC R$6→R$15 com conversão cega** = maior erro unânime ("escalar a cegueira").
3. Corrigir o valor R$1.500→R$33k.
4. **Search = melhor canal de QUALIDADE, mas é COLHEITA, não geração.** Demanda estruturalmente rasa → precisa de Demand Gen pra gerar volume. (Todos: "sim-com-ressalva".)

## ⚔️ Dissensos reais
**1. Termos dupla-função (Larry × BLITZ/Pedro):** BLITZ queria mover "mesa de sinuca e jantar / madeira maciça" pra balde commodity. **Larry refutou e venceu:** *"a mesa-que-vira-sinuca É o produto de R$33k — a dupla função É o luxo."* É o único termo com CTR de unicórnio. Negativar "conjunto/lugares/maciça" amplo mataria o único cluster que converte. **Corte certo:** negativar cozinha/4-cadeiras/varanda/vidro/rústica/demolição; **NÃO** jantar/sinuca/madeira-maciça.

**2. Multi-RSA (Larry × Cassie+BLITZ+Neil+Pedro, 4×1):** Larry queria 2-3 RSAs/grupo pra achar unicórnio por CTR. Os 4 refutaram: com 97-172 impr/mês é **impossível** ter significância; fragmentar volume microscópico atrasa o aprendizado; CTR já é 17% (não é o gargalo). **Veredito: 1 RSA forte basta por ora.**

## 🕳️ Pontos cegos (cada um achou o seu)
- **Larry:** é problema de MEDIÇÃO ou de OFERTA/landing? Talvez o configurador→WhatsApp esteja **vazando** (sem prova social, sem posicionamento, despeja em chat frio). **Percorrer o funil como comprador antes de instrumentar.**
- **BLITZ:** a raiz pode ser **conversão do SITE (UX)**. R$33k precisa de 5-10 toques; o funil tem **1 passo**. A alavanca de ROAS pode estar em **adicionar micro-conversão no site antes do WhatsApp** (mata cegueira + sobe conversão + cria audiência remarketing).
- **Cassie (demolidora):** **conta de amostra:** Smart Bidding precisa 15-30 conv/mês; ticket R$33k + ciclo longo + demanda rasa = 1-3 vendas/mês → **6-18 meses** pra alimentar lance automático. **O loop offline é obrigatório pra um HUMANO decidir, mas NUNCA vai alimentar Smart Bidding aqui** (problema de poucas-decisões = estatística/julgamento, não ML). Otimizar por proxy de alta frequência a montante (configurador-completo + WhatsApp-qualificado), pré-registrado.
- **Neil:** (a) **reconciliação RETROATIVA** — 6 meses de vendas no WhatsApp + Google retém clique ~90d → cruzar e subir seed de vendas HOJE. (b) **message-match:** busca é "prática/dupla-função", landing é "luxo aspiracional" → descasamento pode causar 0 conversão.
- **Pedro:** (a) **Enhanced Conversions for Leads NÃO serve** (exige form no site; Bretda pula direto pro wa.me) → tem que ser **Offline Conversion Import via GCLID puro**. (b) GCLID no texto do wa.me o cliente apaga → captura **server-side na landing, match por telefone normalizado** (+55, DDD com/sem 9). (c) **Janela de conversão:** ciclo 45-90d → se não esticar ao máximo (90d), upload **silenciosamente rejeitado** (gclid velho).

## 👑 Veredito — plano revisado (ordem corrigida)
1. **[P0]** Corrigir valor R$1.500→R$33k na Sale-Closed-OC + demover conversões-lead falsas. *(API)*
2. **[P0]** Auditar a EXPERIÊNCIA do funil (percorrer anúncio→configurador→WhatsApp como comprador). *(site)*
3. **[P0]** Medição via **OCI-GCLID puro** (não ECL), captura server-side, telefone normalizado, **janela 90d** + **seed retroativo** das vendas dos últimos 90d. *(site+planilha)*
4. **[P1]** Negativos cirúrgicos: cozinha/varanda/rústica/demolição/vidro/4-cadeiras/conjunto — **sem tocar jantar/sinuca/madeira maciça**. *(API)*
5. **[P1]** Promover "mesa de sinuca e jantar" (dupla função) ao centro; RSA/landing liderando narrativa **2-em-1**, não luxo aspiracional.
6. **NÃO** subir CPC nem ligar Smart Bidding até loop + auditoria de funil. Decisão por **julgamento humano** sobre vendas reais.

## 🚨 Erro a evitar (unânime)
Subir CPC/ligar lance automático com conversão cega e valor errado de R$1.500. E o mais sutil: **instrumentar perfeitamente um funil furado no degrau da landing.**

---
*Conclave gerado por Orion (aios-master) — modo pesado (agentes independentes + adversarial), conforme regra [[feedback_conclave_must_be_deep]]. Run wf_7ef3c5a2-315.*
