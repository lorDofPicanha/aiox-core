# Spike — X1: Adapters de Fonte (PCP/BLL/BNC/ComprasGov/SISLOG) — 21/Mai/2026

**Prioridade:** P1 · **Advisor:** pablo-hoffman (scraping) · **Liga em:** Stage 1 (descoberta) + Stage 5 (sessão)

## Job
Descobrir/raspar as fontes onde o **PNCP não basta** (gap D+0, campos próprios, sessão autenticada). As **5 fontes do CONTEXT §10.2 permanecem em escopo** (SISLOG incluído).

## Mapa de acesso por fonte (consolida §10.2 + dataset §11)
| Fonte | API? | Estratégia de adapter |
|---|---|---|
| **PNCP** | ✅ API pública (Consulta + Integração) | Base de descoberta — polling por UF/data. Caminho mais fácil |
| **PCP** | ✅ API pública (`publicKey` query-param; chave ~7 dias) | Adapter via API, **MAS sem filtro server-side por órgão/UF/modalidade** → paginar janela de data+status e **filtrar client-side**. Detalhes: `01-research/05-pcp-api-21mai.md` |
| **BLL** | ❌ sem API de consulta aberta | Scraping resiliente; sessão/lance via robô-parceiro (D3) |
| **BNC** | ⚠️ notificação por e-mail + API a confirmar | Feed de e-mail viável já; scraping de detalhe |
| **ComprasGov** | ✅ via PNCP/OCDS | Cobertura indireta pelo PNCP |
| **SISLOG** (GO estadual) | ❌ sem API dev pública | Editais fluem ao PNCP; sessão = scraping. **Mantido em escopo** |

## Desconhecido técnico
- **Resiliência por plataforma** (Pablo: "scraper é bomba-relógio de manutenção"). Mudança de DOM/fluxo quebra silenciosamente.
- **Detecção de quebra** antes do usuário perceber (perder edital = perder negócio).

## Abordagem proposta
- **Interface `Adapter` comum:** `discover()`, `fetchDetail(id)`, `health()`. Cada fonte implementa.
- **2 caminhos de referência no spike:**
  1. **PCP via API** (caminho fácil, valida a interface) — adapter API-based.
  2. **1 scraper** (BLL ou SISLOG) — valida o caminho difícil (Playwright em worker Inngest).
- **Health monitoring:** cron compara volume esperado × recebido por fonte → alerta se fonte X sem novidades > limiar.
- **Fallback manual:** quando quebra, sinaliza e permite ingestão manual sem derrubar o pipeline.

## Experimento (antes de build)
- Implementar adapter **PCP (API)** + **1 scraper** e medir: cobertura vs PNCP (quantos editais únicos cada fonte traz que o PNCP não tem) + tempo de fetch.

## Gate
- ✅ **PASSA** se a interface comum suportar 1 API-source + 1 scraper-source com health() funcional.
- ⚠️ Cada scraper exige **teste de contrato** + alerta de quebra antes de ir a produção.

## Decisões pendentes
- [ ] D-X1.1 — Qual scraper de referência (BLL — mais usado na amostra — ou SISLOG — lacuna estadual)?
- [ ] D-X1.2 — Solicitar chave da API PCP agora (lead time ~7 dias úteis)?
- [ ] D-X1.3 — BNC: feed de e-mail no MVP ou esperar API?

---
*Spike por Orion (aios-master). Interface comum + health-first. PNCP/PCP API primeiro; scraping é o risco de manutenção.*
