---
name: Tocks Custom - E-commerce + Ads
description: Tocks Custom - mesas de bilhar/sinuca artesanais. E-commerce tockscustom.com.br. Ticket medio R$13k. Ads Google+Meta. SEPARADA da Bretda (R$33k) e KR Interiores.
type: project
---

## Tocks Custom

Empresa do usuario. Mesas de bilhar/sinuca artesanais, fabricacao em Itajai-SC.
- **Site:** https://www.tockscustom.com.br/ (Tray Commerce)
- **Ticket medio:** R$13k (range R$10.990 a R$19.900)
- **Produtos:** 6 mesas de bilhar (Tenro Luxo, Gabe, Ark, Vertice, Curve, Elipse) + 2 pebolins (Nobus, Rustic)
- **Diferencial:** Fabricacao artesanal, personalizacao, madeira macica
- **Contato:** WhatsApp 47 3041-9811, contato@tockscustom.com.br
- **CNPJ:** 60.996.216/0001-80

### REGRA CRITICA: Contas Separadas
- **Tocks** (R$13k), **Bretda** (R$33k) e **KR Interiores** sao contas SEPARADAS
- NUNCA misturar dados ou analises entre contas
- Cada conta tem sua propria pasta em `docs/ads-data/{nome-conta}/`

### Conta Google Ads

### REGRA CRITICA: Contas Separadas
- **Tocks** e **KR Interiores** sao contas Google Ads SEPARADAS
- NUNCA misturar dados ou analises entre as duas contas
- Cada conta tem sua propria pasta em `docs/ads-data/{nome-conta}/`
- Ao criar conta nova, SEMPRE criar pasta dedicada

### Contas Google Ads
- **MCC ID:** 794-369-9417
- **Customer ID (Tocks - conta principal):** 814-667-5397
- **Customer ID antigo (teste?):** 1258354880

### MCP Ads Bridge
- **Localizacao:** `D:/jarvis/mcp-ads-bridge/`
- **Status:** Codigo completo, build ok, MCP registrado e habilitado
- **API Version:** v20 (testada e funcionando)
- **OAuth2:** Funcionando (access token obtido com sucesso)

### API Status (2026-03-25)
- **Google Ads Developer Token:** APROVADO — API funcionando em producao
- **Meta Ads App:** Modo LIVE — criacao de ads via API funcionando
- **Ambas APIs operacionais** para leitura e escrita

### Gestao de Trafego
- **Gestor externo DISPENSADO** em 25/Mar/2026 — gestao agora e feita internamente via AIOS + MCP Bridge
- Motivo: reports sem metricas, erros de targeting (cidades EUA), falta de transparencia

### Campanhas Ativas (27/Mar/2026 — atualizado via API)

**Google Ads:**
- [00-CLICK] [PMAX] (ID: 23652946232) — **R$45/dia** (reduzida de R$90), Maximize Conversions
  - Auto-tagging: ATIVO
  - Conversao offline "Lead Qualificado Tocks" criada (UPLOAD_CLICKS, valor R$13k)
- **TOCKS_Search_Alta-Intencao** (ID: 23703520246) — **R$45/dia, NOVA, ATIVA desde 27/Mar**
  - 4 Ad Groups: Compra Direta (AG 197860071827), Premium Artesanal (AG 197861050547), Marca Tocks (AG 194892667676), Mesa Jantar 2em1 (AG 195505567875)
  - 84 keywords (Phrase + Exact), 41 negativas, 4 RSAs (15 headlines + 4 desc cada)
  - Bidding: Maximize Conversions, CPC max R$2-4
  - Display DESATIVADO, Search Partners DESATIVADO

**Meta Ads:**
- C004 Formularios (ID: 120244756251080230)
  - Ad Set 01 Cidades Selecionadas: ATIVO (CPL R$10,13)
  - Ad Set 00 Nordeste: ATIVO (CPL R$19,63)
  - Ad Set 02 Arquitetura: **PAUSADO** em 27/Mar (CPL R$23)
- C005 WhatsApp (ID: 120245795233250230) — **R$55/dia** (escalada)
  - Ad Set 01 Cidades CORRIGIDO: ATIVO (R$35/dia)
  - Ad Set 02 Nordeste CORRIGIDO v2: ATIVO (R$20/dia)
- C006 Retargeting (ID: 120245795709980230) — R$15/dia, ATIVO

**Budget efetivo atual:** ~R$180/dia (Google R$90 + Meta R$90)

### CRM Google Sheets (criado 26/Mar)
- **URL:** https://docs.google.com/spreadsheets/d/1Ba4nGDhmHfQZ3mD1pe1MSS5nYqZY51IVAupOSeLj3XQ/edit
- **Colunas:** Data, Nome, Telefone, Email, Origem, Campanha, GCLID_FBCLID, UTM_Source, UTM_Medium, UTM_Campaign, Status, Motivo_Perda, Valor_Venda, Produto, Data_Venda, Observacoes

### MCP Bridge — Bug Fix (27/Mar — RESOLVIDO)
- Campo `containsEuPoliticalAdvertising` corrigido para `DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING`
- Arquivo: `D:\jarvis\mcp-ads-bridge\src\providers\google-ads.ts` linha 521
- Build feito, campanhas criadas com sucesso

### CRM Automatico (criado 27/Mar — aguardando token)
- Script: `D:\jarvis\mcp-ads-bridge\scripts\sync-meta-leads.cjs`
- Bat: `D:\jarvis\mcp-ads-bridge\scripts\sync-all-leads.bat`
- Puxa leads Meta Forms → Google Sheets automaticamente
- **BLOQUEADO:** token Meta precisa permissao `leads_retrieval` + `pages_read_engagement`
- Gerar em: https://developers.facebook.com/tools/explorer/

### Relatorios Marketing Team (27/Mar)
- `docs/ads-data/tocks/auditoria-marketing-team-2026-03-27.md` (Traffic Masters, nota 2.6/10)
- `docs/ads-data/tocks/copy-strategy-marketing-team-2026-03-27.md` (Copy Chief, framework completo)
- `docs/ads-data/tocks/analise-financeira-marketing-team-2026-03-27.md` (Data Chief, unit economics)

### Meta Ads — ATENCAO
- Default do bridge e **BRETDA** (act_381618241134624)
- Tocks: act_1221671265457624 — SEMPRE passar `account: "tocks"` em chamadas Meta

### Dados Offline (Tocks)
- Pasta: `D:/AIOS/docs/ads-data/tocks/`
- Periodo: 12/dez/2025 a 11/mar/2026
- Arquivos:
  - `google-campanhas.csv`, `google-keywords.csv`, `google-termos-pesquisa.csv`
  - `google-keywords-negativas-importar.csv`
  - `meta-campanhas.csv`, `meta-adsets.csv`

### KR Interiores
- Conta SEPARADA, sem dados disponíveis ainda
- Quando houver dados, criar pasta `docs/ads-data/kr-interiores/`

### Configuracoes
- `.mcp.json`: MCP registrado
- `.claude/settings.local.json`: `mcp-ads-bridge` habilitado
- Meta Ads: Sem credenciais configuradas no `.env`
