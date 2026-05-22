# Tocks T2 — Dual-Purpose Hero Carrossel (anchor sequence)

**Data:** 12/Mai/2026
**Origem:** HYDRA Tocks tactic T2
**Owner:** @copy + @creative + @traffic-chief
**Prazo:** D+3 (15/Mai)
**Fontes HYDRA:** #600/#603/#606 FasterCapital Anchoring/Decoy/Premium Pricing + #142 Hormozi Value Equation

---

## Hipótese

Bretda só tem mesa sinuca pura (R$13-50k). Tocks tem catálogo dual:
- **Monaco** R$13k = decoy de baixo (mesa-jantar-converte-em-sinuca)
- **Vértice** R$15.990 = anchor primário (sinuca pura, design statement)
- **Elipse** R$19.900 = anchor superior (sinuca pura art-déco)

Sequência psicológica:
1. **Monaco** "mesa de jantar que converte em sinuca em 30s" → ancora cliente em "preço razoável"
2. **Vértice** "ou se quiser sinuca pura, R$2k a mais e tem design statement" → upgrade fácil
3. **Elipse** "ou o estado-da-arte, R$4k a mais que Vértice" → upgrade superior

Cliente que clica em Monaco frequentemente fecha em Vértice (anchor decoy). HYDRA #606 Premium Pricing 2025 confirma uplift 30-50% AOV em luxo físico quando há decoy explícito.

---

## Estrutura do Carrossel (3 cards horizontal)

### Card 1 — Monaco (decoy de baixo)
**Hero image:** Monaco em sala estar (configuração mesa-jantar, sem caçapas visíveis)
**Title:** *Mesa de jantar que vira sinuca em 30s.*
**Body:**
*"Monaco. Dual-purpose. Para casas que recebem.*
*Conversa hoje, jogo amanhã. Mesma mesa.*
*From R$13.000 · 60-90 dias produção"*

### Card 2 — Vértice (anchor primário)
**Hero image:** Vértice ambiente angular (V1 ou V3 do P0-D)
**Title:** *Ou se você quer sinuca pura: Vértice.*
**Body:**
*"Design statement. Base trapezoidal monolítica.*
*Nogueira americana + caçapa bronze + lã italiana preta.*
*From R$15.990 · sob encomenda"*

### Card 3 — Elipse (anchor superior)
**Hero image:** Elipse cobertura (E1 do P0-D)
**Title:** *Ou o estado da arte: Elipse.*
**Body:**
*"Ipê champagne + bronze + lã creme italiana.*
*Produção limitada · 12 unidades/ano.*
*From R$19.900 · investimento geracional"*

### CTA universal (todos cards)
`Send Message` → WhatsApp `wa.me/554730419811` com pre-msg "Vim do carrossel Tocks IG/FB"

---

## Configuração técnica

**Tipo:** Carousel Ad (3 cards) Meta — placements feed + stories + reels
**Adset:** novo `C007-CARROSSEL-DUAL` R$30/d PARALELO a C007-V2 (R$60/d) e C007-V3-STEALTH (R$30/d)
**Total C007:** R$120/d post-PIX (sobe de R$60 atual)
**Geo:** Sudeste+Sul 7 estados (igual C007)
**Audience:** mesma cirúrgica (Art Collecting + Architecture + Bens Luxo, 30-65, iOS)

### Pre-msg WhatsApp por card
Idealmente cada card tem pre-msg específica (Meta suporta `whatsapp_message_template` por card):
- Card 1 Monaco → "Vim ver Monaco dual-purpose"
- Card 2 Vértice → "Vim ver Vértice"
- Card 3 Elipse → "Vim ver Elipse"

Sales AI usa pre-msg pra rotear conversa + UTM `tocks-meta-carrossel-{card}` segrega analytics.

---

## Tracking IDs (post-creation)

```
adset_id_carrossel: <TBD>
ad_id_carrossel: <TBD>
card_image_hashes:
  monaco: <usar hash atual ou novo Monaco real>
  vertice: <V1 ou V3 do P0-D>
  elipse: <E1 do P0-D>
```

Salvar em `D:/jarvis/mcp-ads-bridge/data/tocks-c007-carrossel.json`

---

## Métricas A/B (14d, gate D+14)

| Métrica | C007-V2 (controle) | C007-V3-Stealth | C007-CARROSSEL-DUAL |
|---|---|---|---|
| Spend | R$60/d | R$30/d | R$30/d |
| Esperado CTR | 2,3% | 1,5-2% | **2,8-3,5%** (carousel >static) |
| Esperado CPL/msg | R$6 | R$8-12 | **R$5-7** |
| Esperado Qualified rate | 10% | 25-40% | 15-25% |
| **Métrica vencedora** | baseline | qualidade | volume+intent |

### Decisão D+14
- Se CTR carrossel ≥ 3% E CPL/msg ≤ R$7: migrar 50% C007-V2 budget para carrossel
- Se carrossel pega audience curioso (Qualified rate <8%): kill, manter só V2 + V3
- Se Monaco card dominar 80%+ cliques: criar adset isolado Monaco-only (sinal de demanda dual-purpose forte)

---

## Riscos

1. **Carrossel pode confundir** se cards não têm fluxo claro (Monaco → Vértice → Elipse é progressão de preço, NÃO de feature)
2. **Mesa Monaco real existe?** Verificar inventory Tocks — se "Monaco" foi só nome de campanha sem produto separado, **pause T2 até validar**. Memória 28-29/Abr menciona "Monaco 2em1 SS" como ad, não modelo distinto. **Risco crítico — checar com user antes de produzir creative.**
3. **Preço explícito** vai contra T5 Stealth. Aceitar trade-off: T2 mira volume+intent, T5 mira qualidade extrema. Não são mutuamente exclusivas — coexistem em adsets diferentes.

---

## Bloqueador inegociável

⚠️ **Validar com user se Monaco é modelo real Tocks ou só nome de campanha v2.** Se for só campanha, T2 cai — não dá pra vender produto inexistente. Provavelmente é nome de creative copy ("Monaco 2em1") referente a Vértice em modo dual-purpose. Nesse caso:

**Alternativa T2-bis:** Carrossel SEM Monaco, com:
- Card 1: Vértice ambiente
- Card 2: Vértice close detalhe
- Card 3: Elipse ambiente

Vira variação A/B dentro V+E (sem decoy). Menos punch, mas executável.

**Decisão user obrigatória antes de produção:** "Monaco existe?" Resposta seleciona T2 ou T2-bis.
