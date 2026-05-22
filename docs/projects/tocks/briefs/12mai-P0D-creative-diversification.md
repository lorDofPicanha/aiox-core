# Tocks Creative Diversification Brief — P0-D

**Data:** 12/Mai/2026
**Origem:** Squad HYDRA Tocks 12/Mai — bloqueador estrutural P0-D
**Owner:** @creative-lab + nano-banana
**Prazo:** D+2 (14/Mai)
**Status:** Briefing — execução pendente

---

## Problema

Os 9 ads `[COPY-v2]` Tocks (C005 + C006 + C007) usam **a mesma `image_url`**. Quando saldo voltar e C007 escalar de R$60/d → R$200-300/d, mesma imagem aparece 4-5× na mesma pessoa → creative fatigue em 7-10 dias.

HYDRA #103 (E-Com Brasil Chat Commerce 2025, 782M msgs) confirma: WhatsApp converte 6× mais que e-commerce, MAS pressupõe que o ad **pare o scroll**. Copy qualificadora está forte; **imagem é o gargalo**.

---

## Output esperado (6 image hashes novos)

### Vértice (3 hashes — angular/brutalist-modern, feltro preto, R$15.990)

**V1 — Apartamento Sudeste alto-padrão (perspectiva angular)**
- Mesa Vértice em sala estar integrada, sofá Saccaro/Líder vibe (mas não branded — referência apenas)
- Pé direito alto, janelão, vista cidade SP/RJ noite
- Mesa como peça escultórica central, não funcional pura
- Luz quente baixa, drink na mesinha lateral
- Ratio: 4:5 (1080×1350)

**V2 — Home office luxury (dual-purpose como mesa de jantar)**
- Mesa Vértice servindo como **mesa de reunião/jantar** (sem caçapas visíveis no enquadramento)
- Cadeiras Eames-vibe ao redor, ambiente office residencial
- Laptop fechado, taça de vinho — momento "off"
- Mostra que Vértice é **mais que sinuca** — é peça habitável
- Ratio: 4:5

**V3 — Residência Casacor vibe (specifier-friendly)**
- Mesa Vértice em ambiente integrado com plantas + arte contemporânea parede
- Estilo "minha próxima Casacor" — pronto pra fotografar para revista
- Curador implícito: arquiteta apresentando ambiente
- Foco em **textura madeira nogueira** + base trapezoidal monolítica
- Ratio: 4:5

### Elipse (3 hashes — art-déco/clássico-luxo, feltro creme, R$19.900)

**E1 — Cobertura SP (clima editorial Vogue Living)**
- Mesa Elipse em sala estar penthouse, vista panorâmica noturna
- Detalhe **cap bronze superior + base dourada** em close (parcial)
- Madeira ipê champagne + lã italiana creme reflective
- Atmosfera "estado de arte" — peça única, não móvel
- Ratio: 4:5

**E2 — Casa de campo high-end (atmosfera "fim de tarde")**
- Mesa Elipse em sala estar casa praia/serra Sudeste
- Lareira ao fundo desfocada, taça de whisky na lateral
- Madeira clara + bronze envelhecido em diálogo
- "Investimento geracional" tone — para herdar, não trocar
- Ratio: 4:5

**E3 — Detalhe macro (zero ambiente — só material)**
- Close-up extremo: feltro creme + caçapa bronze + base dourada
- Sem mesa inteira no quadro — só **textura, material, craft**
- Estilo Hermès / Bottega Veneta editorial — vende heritage
- Mãos artesão acabando feltro (opcional, se conseguir captura real Itajaí)
- Ratio: 4:5 ou 1:1

---

## Regras críticas (não-negociáveis)

❌ **NÃO alterar a mesa real.** IA gera o AMBIENTE ao redor, nunca o produto.
  - Mesa Vértice precisa ter base trapezoidal monolítica exata
  - Mesa Elipse precisa ter 2 pedestais cilíndricos com ripas verticais
  - Cores/materiais conforme spec (memory `feedback_bretda_mesas_reais.md`)

❌ **Sem texto sobreposto.** Nem preço, nem CTA, nem logo. Tocks WhatsApp CTM já tem CTA no card Meta — imagem é pura cinematic.

❌ **Sem badges "OFERTA!", contadores, urgência.** Quiet luxury vence loud luxury 2025-2026 (HYDRA #73 Stealth Luxury).

✅ **Anti-AI tells:** preferir foto real Itajaí-SC sempre que possível. IA só pra ambientação. Se IA, **película kodak portra** + phenotype real BR + objetos brasileiros nas referências (memory `feedback_ai_image_anti_tells.md`).

✅ **Editorial > comercial.** Pense Casacor, AD Magazine, Vogue Living — não Marketplace.

---

## Fontes de assets reais

- Renders Vértice/Elipse em `D:/Bretda_CustomGPT_Knowledge/04_Renders_Mesas/` — **CHECAR se há Tocks também**
- WhatsApp 28 renders dropados 06/Mai pelo user em `docs/projects/tocks/assets/`
- HEIC convert 246 files (pendente em memory `session_tocks_master_assets_06mai.md`)
- Fontes oficiais: Libre Caslon Text + Poppins

---

## Onde upload

Após gerar, upload via MCP `mcp__mcp-ads-bridge__meta_ads_upload_image` na conta `tocks` (act_1221671265457624). Salvar mapping em:

```
D:/jarvis/mcp-ads-bridge/data/tocks-image-hashes-12mai.json
{
  "V1_apartamento_sudeste": "<hash>",
  "V2_home_office_dual": "<hash>",
  "V3_casacor_vibe": "<hash>",
  "E1_cobertura_sp": "<hash>",
  "E2_casa_campo": "<hash>",
  "E3_detalhe_macro": "<hash>"
}
```

---

## Próximo passo após gerar

Criar 6 novos `[CJ-AURORA-ISO]`-style ads em adset DEDICADO `CJ-CREATIVE-TEST` R$10/d para A/B contra image_hash original. NÃO substituir hashes existentes em C005/C006/C007 — testar paralelo 14d.

Gate D+14 (26/Mai): hash vencedor (CTR ≥ baseline + CPL/msg ≤ R$8) substitui original em C007.
