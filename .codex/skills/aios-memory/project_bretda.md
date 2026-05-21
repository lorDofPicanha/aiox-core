---
name: Bretda - Google Ads + Meta Ads + Instagram
description: Conta Google Ads da Bretda (SEPARADA de Tocks e KR). Mesas de bilhar/sinuca high-ticket R$33k. Auditoria e otimizacao abr/2026.
type: project
originSessionId: 97a5fc2c-9fb1-493b-ae42-58a0e729e8b3
---
## Bretda - Contas de Ads e Marketing

Conta Google Ads **independente** (SEPARADA de Tocks e KR Interiores).

### Contas
- **Google Ads Customer ID:** 816-763-6084 (MCC 794-369-9417)
- **MCP Bridge:** `D:/jarvis/mcp-ads-bridge/` — google-ads-api v23, .env com credenciais
- **OAuth App:** Project 506145955453, Client ID `506145955453-1ukpk8339i3bbuokhmaneg8kto97ug1t` (Web app, redirect localhost:3847)
- **OAuth Status:** Testing mode — refresh token expira em 7 dias. Privacy policy e Terms criados em `docs/bretda/legal/` mas ainda nao hospedados.
- **Meta Ads:** account `act_381618241134624` (Bretda Ads 01), token longa duracao

### Negocio
- **Produto:** Mesas de bilhar, sinuca e pebolim de LUXO escultural
- **Linhas:** Opal, Citrino, Aurora, Ambar, Espinela, Zurita
- **Ticket medio:** R$ 33.000,00 (high-ticket)
- **Foco:** Venda direta, design escultural, handmade no Brasil
- **Regiao alvo:** Sudeste (SP, RJ, MG, ES)
- **Site:** bretda.com.br (Hostinger/cPanel)

### Otimizacoes Executadas (2026-04-10)

**Google Ads:**
1. Rede de Display DESATIVADA
2. Search Partners DESATIVADO
3. 40 palavras negativas adicionadas
4. 5 ad groups tematicos criados: Bilhar Luxo, Sinuca Luxo, Bilhar+Tampo Jantar, Arquitetos B2B, Brand Bretda
5. 29 keywords distribuidas (Exact + Phrase match)
6. 6 RSA ads otimizados com copies de luxo/escultural
7. 6 callout extensions (Handmade, Fabricacao Propria, etc.)
8. Conversion tracking verificado: 3 acoes ativas (Contato, Lead bretda.com.br/obrigado, WhatsApp Click)

**Meta Ads:**
1. C005 WhatsApp reativada — R$20/dia
2. C006 Retargeting reativada — R$15/dia
3. CP2 Leads ajustada — R$35/dia (2 ad sets ativos: CJ6 + CJ1)
4. Total Meta: R$70/dia
5. Lookalike 1% Visitantes Site criada (ID: 120244118776670737)
6. Lookalike 1% Engajamento IG criada (ID: 120244118776810737)

### Otimizacoes Executadas (2026-04-11)

**Google Ads:**
1. 45 negative keywords adicionadas (BROAD): barata, usada, olx, aluguel, DIY, vendo, conserto, feltro, tacos, bola, giz, wikipedia, etc.
2. Bug fix no MCP bridge: `updateMask` FIELD_HAS_SUBFIELDS corrigido para todas bidding strategies
3. Analise de search terms: 100 termos, apenas 2 com conversao ("mesa que vira jantar")
4. Descoberta: apenas 1 campanha ativa (23251766617), 10 pausadas. Ad Group 1 absorve 100% budget.
5. 5 ad groups novos (Bilhar Luxo, Sinuca Luxo, Arquitetos B2B, Brand) com 0 impressoes — sufocados pelo Maximize Conversions

**MCP Bridge Bug Fix (commit ae91517 em D:/jarvis/mcp-ads-bridge):**
- Arquivo: `src/providers/google-ads.ts` linha 914-941
- Fix: `manual_cpc` → `manual_cpc.enhanced_cpc_enabled` no updateMask
- Fix: masks condicionais para maximize_conversions e maximize_conversion_value com targets
- Build OK, precisa restart do MCP server para aplicar

### Otimizacoes Executadas (2026-04-11 sessao 2)

**Google Ads:**
1. Bidding trocado de MAXIMIZE_CONVERSIONS → MANUAL_CPC via MCP
2. Conversion values configurados via API REST v20:
   - Contato (6918863652): R$100 ✅
   - WhatsApp - CLICK (7540863796): R$50 ✅
   - [AGD] Lead (7138711130): WEBPAGE_CODELESS, imutavel via API — R$0
3. Nova conversao criada: "Lead - Pagina Obrigado" (7571079256) tipo WEBPAGE, valor R$100
4. MCP Bridge: 2 novas tools adicionadas (google_ads_conversion_actions + google_ads_update_conversion_value)

**Meta Ads:**
1. CJ7/CJ8 antigos (sem promoted_object) deletados
2. CJ2/CJ3 reutilizados como CJ7v2 Luxury e CJ8v2 Arquitetos:
   - CJ7v2 (120237168442570737): Luxury interests, Sul/CO/NE, R$17.50/dia, 1 ad, ACTIVE
   - CJ8v2 (120237168468370737): Arquitetos, Sul/CO/NE, R$17.50/dia, 1 ad, ACTIVE
3. C005 WhatsApp pausada (0 adsets, gastando nada)
4. Campanha "Nova campanha de Leads" (vazia, criada para TOS) deletada

**Token Meta atualizado (11/Abr):** Long-lived 60 dias (expira ~10/Jun/2026). Permissoes: ads_management, ads_read, read_insights, pages_manage_ads, pages_show_list, pages_read_engagement, leads_retrieval. Leadgen TOS aceito na pagina bretda.com.br. Mesmo token usado para Bretda e Tocks.

**Pendente:**
- Configurar tag GTM para conversao "Lead - Pagina Obrigado" (7571079256) → depois pausar [AGD] Lead
- CJ7v2 e CJ8v2 agora tem 3 ads cada (AD02 original + AD04 + AD05 duplicados do CJ1)
- Melhorar QS keyword "mesa de bilhar com tampo de jantar" (QS=1)
- Hospedar privacy-policy.html e terms-of-service.html no Hostinger (public_html/legal/)
- Submeter app OAuth Google para verificacao
- Regenerar token Meta com pages_manage_ads (precisa App Review ou adicionar no app)

### Auditoria Abr/2026
- Score: 2.5/10 (CRITICO — atualizado 11/Abr com dados reais MCP)
- PDF: `outputs/audits/bretda-ads-audit-2026-04-10.pdf`
- Markdown: `outputs/audits/bretda-ads-audit-2026-04-10.md`
- Desperdicio estimado: R$432/mes em search terms sem conversao (>R$5 cada)
- Lifetime: R$8.872 gastos, 13.2K cliques, 4 conversoes = R$2.218/conversao
- QS keyword principal "mesa de bilhar com tampo de jantar": 1 (minimo possivel)
- Display Network ja estava OFF (confirmado via API campaign_details)
- Meta CPL: R$18,80 para 84 leads (aceitavel para high-ticket)

### Instagram Content
- Plano: `outputs/copy/bretda/instagram-content-plan-abril-2026.md`
- Posts prontos: `outputs/copy/bretda/posts-prontos/` (12 pastas, 42 imagens)
- Periodo: 14/04 a 09/05 (4 semanas, 3 posts/semana)
- Formatos: 5 carrosseis, 3 Reels, 3 statics, 1 Stories
- Renders usados: `docs/bretda/Produtos/Imagens dos produtos/Renders novos - Paulinho/001 - Prontos para uso no site e Redes Sociais/`

### Dados Offline
- Pasta: `D:/AIOS/docs/ads-data/bretda/`
- Analise anterior: `analise-completa-bretda-google-ads.pdf`

**Why:** Conta com potencial enorme (ROI 2200-4400%) mas operando com desperdicio de 65%. Otimizacoes de 10/04 devem reduzir para 20%.
**How to apply:** Monitorar QS em 7 dias (deve subir de 1 para 3-5). Re-auditar em 30 dias. Renovar refresh token antes de expirar.
