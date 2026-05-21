---
name: Sessão 28/Abr — RTK Install + KR Meta Setup
description: Log da sessão 28/Abr/2026 (Orion). 2 entregas: RTK v0.37.2 instalado escopo D:\AIOS + KR Interiores conectada no MCP bridge via partnership Vorza. Aguardando restart Claude Code.
type: project
originSessionId: 52e441df-798a-4add-ab62-7b45a8a40970
---
# Sessão 28/Abr/2026 — RTK + KR Meta Setup

## Trabalho da sessão (em ordem cronológica)

### 1. Pesquisa RTK (Rust Token Killer)
- User perguntou se github.com/rtk-ai/rtk ajudaria
- Análise: proxy CLI em Rust, comprime output -60-90% antes de chegar no LLM
- Trade-offs honestos: degrada qualidade em forensics/audit (Polymarket-leak-like) mas ganho líquido em ops repetitivas (git/test/lint)
- Solução: profile forensics-safe (exclude commands cat/grep/diff/rg) + tee mode="always" (raw backup sempre)

### 2. RTK Install (escopo local D:\AIOS, NÃO global)
- Recomendação inicial WSL+curl rejeitada (WSL não instalado, 30min+reboot desproporcional)
- Pivot: binário Windows v0.37.2 em `C:\Users\kingp\.local\bin\rtk.exe`
- Config: `C:\Users\kingp\AppData\Roaming\rtk\config.toml` (forensics-safe profile)
- Hook script: `D:\AIOS\.rtk\rtk-rewrite.sh` (oficial RTK)
- Hook ativo em: `D:\AIOS\.claude\settings.local.json` (gitignored, escopo local)
- Backup: `.claude/settings.local.json.pre-rtk.bak`
- `.gitignore` atualizado: `.rtk/` adicionado (linha 85)
- Validação manual: `git status` → reescrito ✓, `cat README.md` → ignorado ✓

### 3. Pivot pra KR Interiores
- Memory carregado: KR Google Ads suspensa 17/Abr (evasão), plano migração Meta escrito
- Decisão original (17/Abr): Kell BM próprio, operador como Analyst
- User pivotou: separação pessoal↔profissional, usar BM Vorza como Partner do BM dela
- Modelo final: BM Kell mantém ownership, Vorza adicionado como Business Partner

### 4. KR conectada
- Business ID Vorza passado pra Kell: `2744791262542284`
- Ad Account ID KR: `act_210585430466029` ("Designer Kelline Rodrigues")
- Partnership aceito ambos lados (Kell + user no settings/requests do Vorza)
- `.env` atualizado em `D:/jarvis/mcp-ads-bridge/.env`:
  - `META_ADS_ACCOUNT_KR_ID=act_210585430466029`
  - `META_ADS_ACCOUNT_KR_TOKEN=<reusado do VORZA_TOKEN, partnership permite>`
- Backup `.env.pre-kr.bak`

## Ações pendentes (próxima sessão pós-restart)

1. **Validar KR no MCP bridge:**
   - `meta_ads_list_accounts` → confirmar 4 contas (bretda, tocks, vorza, kr)
   - Se não aparecer: investigar token (pode precisar System User KR-específico)

2. **Validar tracking:**
   - `meta_ads_pixel_check account=kr` → confirmar Pixel instalado + última fire em krinteriores.com.br
   - Se não tiver Pixel: cobrar Kell (estava no plano 17/Abr)
   - Confirmar CAPI server-side

3. **Baseline KR:**
   - `meta_ads_overview account=kr date_preset=lifetime`
   - Listar campanhas/adsets existentes (provavelmente vazio)
   - Verificar página FB + Instagram linkados

4. **Confirmar assets criativos:**
   - 10 fotos profissionais (sala, cozinha, quarto, banheiro, home)
   - 2 vídeos (walkthrough + reels)
   - Foto Kell trabalhando (branding pessoal)

5. **Montar 3 ad sets PAUSED** (plano 17/Abr):
   - "Precision High-Intent" R$15/dia
   - "Broad Lifestyle" R$20/dia
   - "Open Algorithm" R$15/dia
   - Total: R$50/dia

6. **Validar RTK:**
   - `rtk --version` → confirma 0.37.2
   - Hook funcionando (em sessão fresh, comandos git/test devem ser reescritos automaticamente)
   - `rtk gain` mostra economia acumulada

## Arquivos modificados nesta sessão

- `D:\AIOS\.gitignore` — adicionado `.rtk/` na linha 85
- `D:\AIOS\.claude\settings.local.json` — RTK hook adicionado
- `D:\AIOS\.claude\settings.local.json.pre-rtk.bak` — backup
- `D:\AIOS\CLAUDE.md` — criado pelo RTK init (gitignored)
- `D:\AIOS\.rtk\filters.toml` — criado pelo RTK init
- `D:\AIOS\.rtk\rtk-rewrite.sh` — hook script oficial
- `C:\Users\kingp\AppData\Roaming\rtk\config.toml` — config RTK
- `C:\Users\kingp\.local\bin\rtk.exe` — binário instalado
- `D:\jarvis\mcp-ads-bridge\.env` — KR adicionada
- `D:\jarvis\mcp-ads-bridge\.env.pre-kr.bak` — backup

## Memórias criadas/atualizadas

- `project_rtk_setup_28abr.md` (novo)
- `project_kr_meta_setup_28abr.md` (novo)
- `reference_vorza_business_ids.md` (novo, contém BM ID 2744791262542284)
- `session_28abr_rtk_kr_setup.md` (este arquivo)
- `MEMORY.md` (atualizado com 4 entradas novas)

## Decisões registradas

- **RTK escopo:** local D:\AIOS only (não global) — reduz blast radius pra teste 1 semana
- **RTK profile:** forensics-safe — preserva fidelidade em cat/grep/diff/rg
- **KR partnership:** BM Kell mantém ownership, Vorza vira Partner (não inverso) — preserva identity isolation Meta
- **KR token:** reusado do Vorza inicialmente — se permission falhar pós-restart, gerar System User KR-específico

## Checkpoint pra próxima sessão

Próxima sessão deve começar com:
1. `meta_ads_list_accounts` (validar KR aparece)
2. `meta_ads_pixel_check account=kr` (validar tracking)
3. `meta_ads_overview account=kr date_preset=lifetime` (baseline)
4. `rtk --version` + teste de hook (validar RTK funcionando)
