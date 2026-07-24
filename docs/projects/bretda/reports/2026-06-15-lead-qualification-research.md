# Bretda — Pesquisa: Como aumentar a qualificação do lead

**Data:** 2026-06-15
**Autor:** Orion (aios-master) via deep-research harness
**Método:** 24 fontes → 107 claims → 25 verificadas adversarialmente (voto 3 agentes) → **12 confirmadas, 13 mortas**
**Confiança:** Média-alta (convergência forte; 1 fonte primária — Gong — resto consenso de praticante)
**Limitação:** Síntese automática e 8 verificações bateram no limite de sessão (reseta 12:50 SP). Dessas, 5 foram refutadas de fato; 8 ficaram "plausível, não confirmado".

---

## Pergunta
Como aumentar a proporção de leads **com orçamento real** para o ticket R$15-30k da Bretda (mesas de sinuca/bilhar conversíveis em jantar), em Meta + Google Ads, **sem secar o volume** a ponto de matar a operação. Problema central: hoje chega muito lead sem poder de compra (curioso, pesquisador de preço, comprador de commodity barata).

---

## 🎯 Achado central (atravessa tudo)
As 4 fontes mais fortes (voto 3-0) convergem no mesmo ponto, que é exatamente o diagnóstico da conta Google em 15/Jun:

> **Otimize para COMPRADOR, não para form-fill. A plataforma só aprende com o sinal que recebe — hoje a Bretda dá "alguém preencheu", não "alguém comprou".**

Valida o `Sale Closed (Offline OC)` (id `7612768697`, valor R$33.000) **ENABLED mas com ZERO uploads** há 6 meses. A pesquisa classifica isso como "a alavanca de maior impacto".

---

## Recomendações priorizadas (impacto × viabilidade)

| P | Ação | Alavanca | Evidência | Estado Bretda |
|---|---|---|---|---|
| **P1** | Alimentar venda real de volta — offline conversions Google (GCLID) + eventos qualificados via CAPI Meta | Medição | 🟢 4× (3-0) | 🔴 Google OC vazio; Meta otimiza só "Lead" |
| **P2** | Perguntas qualificadoras no form — faixa de investimento + timeline + tipo de imóvel, múltipla escolha, 1-2 customs | Captura | 🟢 3× (3-0) | 🟡 só campanha QUALIDADE tem |
| **P3** | Form "Higher Intent" da Meta (vs "More Volume") em todas as campanhas de lead | Captura | 🟢 (3-0) | 🟡 parcial |
| **P4** | Copy que exclui — enquadrar p/ pré-qualificar por preço/exclusividade | Captura | 🟢 (2-1) | ❌ não feito |
| **P5** | Ancorar investimento cedo no WhatsApp — falar faixa na 1ª conversa, depois de construir valor | Pós-lead | 🟢 (3-0, Gong) | ❌ sem script |
| **P6** | Lookalike de COMPRADOR real (não de todos os leads) + otimizar pro evento downstream | Targeting | 🟢 (3-0) | 🔴 depende do P1 |

### Detalhe acionável

**P1 — Sinal de comprador (motor).** Google: subir fechamentos reais no `Sale Closed (Offline OC)`. Meta: parar de otimizar pro evento "Lead" e mandar via CAPI o evento de qualificado/venda (ex.: "Agendou visita" / "Comprou"). **Métrica de verdade = custo por lead qualificado e ROAS sobre receita fechada, não CPL.** Travado no export de fechamentos (quais leads viraram venda + valor + data + GCLID).

**P2 — Pergunta qualificadora.** Uma pergunta de timeline ("Quando pretende ter a mesa?" → "até 3 meses / 3-6m / só pesquisando") separa comprador de curioso sem matar conversão. Adicionar **faixa de investimento** em múltipla escolha → quem não banca se auto-exclui. Pré-preencher nome/email, exigir só 1-2 respostas. Alavanca mais barata e rápida.

**P3 — Higher Intent.** Template "Higher Intent" da Meta captura lead de maior qualidade que "More Volume". Aplicar em CP1/CP2 (hoje provavelmente "More Volume").

**P4 — Copy exclusiva.** Enquadramento excludente pré-qualifica ("não serve pra X", "só pra quem Y"). Comunicar caráter premium/sob-medida no anúncio. ⚠️ Publicar preço no site tem lógica parecida mas NÃO foi verificada — tratar como teste.

**P5 — Ancoragem no atendimento.** Dado primário Gong: win-rate cai **32% → 15%** quando preço só aparece no 2º/3º contato. Top performers falam preço a ~3/4 da 1ª conversa, depois de construir valor. Script WhatsApp: ancorar faixa de investimento cedo, contra o valor da peça.

---

## ⛔ Mitos refutados (NÃO fazer)
- **Largar formulário e jogar tudo no WhatsApp** esperando lead melhor no luxo → refutado (0-3). Form com qualificador converte melhor que "rico não preenche form".
- **Números mágicos** ("Higher Intent = 20-40% menos lead", "entrada manual = +50% alcance") → refutados. Direção vale, números não.
- **Abrir a call com o preço** (under-anchoring) → refutado. É cedo-mas-depois-do-valor.
- Lookalike de melhores compradores + excluir audiências de desconto → voto 1-2 (refute fraco); a metade "lookalike de comprador" é corroborada por outra fonte 3-0.

## ⚠️ Plausível, não confirmado (8 claims — limite de sessão, re-rodar verificação após 12:50 SP)
Publicar preço/faixa no site; quiz funnel com budget/timeline; pricing em 3 tiers (Good-Better-Best) p/ auto-seleção; e-mail/SMS automático de triagem pós-form; qualificar BANT cedo na call; ancorar contra custo-de-inação antes de revelar preço; CAPI desloca otimização de form-fill p/ cliente pagante. São práticas padrão de mercado.

---

## Claims confirmadas (citadas)

1. Win-rate cai com preço tarde: 2ª call 32%, 3ª call 15% — falar preço cedo. (3-0) — gong.io/blog/data-reveals-the-best-time-to-talk-price-and-budget
2. Top reps introduzem preço a 38-46 min da 1ª call, depois de construir valor. (3-0) — gong.io
3. Métrica luxo = custo por enquiry qualificado e ROAS sobre receita fechada, não CPL. (3-0) — yourgrowthpartner.io/blog/meta-ads-for-luxury-brands
4. Uma pergunta de timeline no form Meta reduz lead ruim sem destruir completion. (2-1) — imediaal.com/blog/meta-ads-lead-quality-for-home-improvement-the-advantage-guide
5. Feedback de outcome qualificado (não form bruto) via CAPI é essencial p/ Advantage+ achar comprador. (3-0) — imediaal.com
6. Perguntas qualificadoras = "fricção suficiente p/ deter baixa-intenção". (2-1) — thedigitalexchange.co/blog/meta-ads-instant-forms
7. Template "Higher Intent" da Meta captura qualidade vs volume. (3-0) — edgedigital.net/optimising-conversion-rates
8. Perguntas qualificadoras filtram prospects inadequados. (3-0) — edgedigital.net
9. Otimizar p/ evento downstream ("Schedule"/"Purchase") via CAPI, não "Lead" genérico; Lookalike de pagantes. (3-0) — leadenforce.com/blog/how-to-qualify-leads-through-facebook-ads-without-adding-friction
10. Form: múltipla escolha > aberto; pré-preencher padrão, exigir 1-2 customs. (3-0) — leadenforce.com
11. Copy pode pré-qualificar com enquadramento excludente. (2-1) — leadenforce.com
12. Importar offline conversions no Google → Smart Bidding otimiza p/ receita real; alavanca de maior impacto. (3-0) — clicksgeek.com/how-to-increase-lead-quality

## Fontes BR adicionais (não no top-25 verificado, mas relevantes p/ targeting/WhatsApp BR)
- scoremedia.com.br/blog/segmentacao-adwords-facebook-mercado-luxo
- clinks.com.br/blog/segmentacao/segmentar-links-patrocinados-por-nivel-da-renda-familiar
- iagente.com.br/blog/como-qualificar-leads-pelo-whatsapp-guia-passo-a-passo
- lambdalabs.com.br/blog/article/qualificacao-leads-ia-whatsapp
- clint.digital/scripts-de-vendas/high-ticket

---

## Próximos passos
1. **P1 destrava tudo** (P6 depende): export de fechamentos (lead→venda, valor, data, GCLID) → montar upload offline Google + evento qualificado CAPI Meta.
2. Sem depender de dado: **(a)** redesenhar forms Meta com pergunta de faixa de investimento (P2/P3); **(b)** escrever script de qualificação + ancoragem p/ WhatsApp (P5).
3. Opcional: re-rodar verificação adversarial das 8 claims não-confirmadas após reset de sessão.
