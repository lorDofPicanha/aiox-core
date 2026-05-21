---
name: Sessão Bretda Ads 28-29/Abr
description: Auditoria completa + 7 execuções autônomas (recovery CPL R$11, budget Meta 4.4x, 5 ads novos das coleções Opal/Aurora/Âmbar/Citrino/Zurita)
type: project
originSessionId: 190fd0f2-3cf9-4493-9fb1-9c2d17b22095
---
# Sessão Bretda Ads 28-29/Abr

## Estado de entrada (28/Abr noite)
- CPL Meta R$11 (recuperação confirmada pós-emergency 17/Abr R$43)
- Saldo Meta R$18,85 (crítico)
- CJ8v2 único adset ativo, AD05 monopolizando 96.9% spend
- CAPI nunca implementado (14d 100% Browser)
- Google Bretda agora cliente do MCC Tocks (login-customer-id `7943699417`)

## D1-D9: Decisões da auditoria 28/Abr

| ID | Decisão | Status final |
|----|---------|--------------|
| D1 | PIX R$1.500 Meta | 🟡 User fez **R$500** (resto pendente) |
| D2 | CAPI Meta | 🟢 Conclave 4 clones (Vogels/Majors/Fowler/Tal). Story `apps/bretda-lp/docs/stories/story-capi-1.1-meta-conversions-api.md` pronta. Próximo: user invoca `@aios-dev *develop-story` |
| D5a | Brand-Defensivo Google | 🟢 Ad group `Brand Bretda` (id `195850310832`) já existia ENABLED. Adicionei 4 keywords PHRASE: bretda mesas, bretda bilhar, bretda jantar, bretda blumenau |
| D5b | Bilhar-Luxo gates | 🟢 PASS 2/3. LP CR 23.7% (target 2%). Keyword cluster TOP5 = 27.000 buscas/mês HIGH "mesa sinuca jantar". **Gate 3 SQL pendente user confirmar lead R$11,48 virou SQL** |
| D6 | Google R$70→R$50 | 🟢 EXECUTADO 22:58 BRT |
| D7 | Meta CJ8v2 R$27→R$120 | 🟢 EXECUTADO 22h07 BRT (4.4x salto) |
| D8 | AD09 Opal carrossel | 🟢 ATIVADO 23:55 BRT (PAUSED→ACTIVE/IN_PROCESS) |
| D9 | Spend cap Meta | 🟡 **Recomendação Orion: +R$10k → R$40k (83d runway)**. Aguarda user decidir A/B/C |

## D14: 4 ads novos coleções (29/Abr)

User mandou criativos das 4 coleções restantes. Crops autônomos pra padronizar 4:5 (1080x1350) e 1:1 (1080x1080):

| Ad | Coleção | Format | Ad ID | Status |
|----|---------|--------|-------|--------|
| AD10 | Aurora | single 4:5 | `120245285456440737` | PAUSED |
| AD11 | Âmbar | carousel 4 cards 1:1 | `120245285464550737` | PAUSED |
| AD12 | Citrino | single 4:5 | `120245285468330737` | PAUSED |
| AD13 | Zurita | carousel 3 cards 4:5 | `120245285477490737` | PAUSED |

**Decisões autônomas no crop:**
- Citrino: usei só `citrino_b` (4:5 wide com branding) — A 1:1 sem branding ficaria fraca solo
- Zurita card 1: user mandou Aurora ao invés. Achei renders Zurita em `D:/Bretda_CustomGPT_Knowledge/04_Renders_Mesas/`, escolhi `Zurita_Ambiente_01.jpg` (mar + 3/4 ângulo dramático) como hero
- Zurita_03 tinha indicador "2/3" canto sup direito (Instagram source) — removido via crop topo 8%
- Padronizei Zurita carousel 3 cards pra 1080x1350 (4:5) com crop centralizado

## Estado final CJ8v2 (29/Abr)

**8 ads no adset** (acima best-practice Meta 3-5):
```
CJ8v2 R$120/d ACTIVE
├── AD03 ACTIVE — R$5 / 0 leads (2.2%) ← lixo
├── AD04 ACTIVE — R$1,5 / 0 leads (0.7%) ← lixo
├── AD05 ACTIVE — R$219 / 42 leads (97.1%) ← campeão CPL R$5,21
├── AD09 Opal ACTIVE
├── AD10 Aurora PAUSED
├── AD11 Âmbar PAUSED
├── AD12 Citrino PAUSED
└── AD13 Zurita PAUSED
```

**Descoberta crítica**: AD05 está MUITO melhor que audit inicial reportava — 42 leads em 7d, CPL R$5,21 (não R$11). CPL total CJ8v2 7d = **R$5,36**.

## Recomendação rotação Orion (D15 — pendente user)

**Onda em 3 etapas no CJ8v2:**
1. **Imediato (30/Abr manhã)**: pausar AD03 + AD04 (lixo confirmado, libera ~R$3-4/d)
2. **+24h**: ativar AD10 Aurora + AD11 Âmbar (testar single vs carousel paralelo)
3. **+48h**: SE CPL ≤R$15 → ativar AD12 + AD13. SE >R$20 → otimizar copy

Alternativa cara: criar CJ8v3 isolado (+R$420-560 em 7d) pra stress-test paralelo.

## Aprendizados técnicos

1. **Google Bretda agora é cliente MCC Tocks** — exige header `login-customer-id: 7943699417` em todas chamadas API
2. **Spend cap Meta é gate independente do saldo** — pode bater hard stop antes saldo zerar (R$876 gap atual = 7.3d com R$120/d)
3. **PIX BR → Meta** ETA típico 30min-2h, pode levar 24h em fila compliance
4. **CAPI**: arquitetura 3-layer Fowler ACL + HTTP fetch direto Graph API v21 (NÃO SDK — bundle 500KB+) + Upstash QStash retry queue + Pino structured logs + Test Events Tool em staging obrigatório
5. **Carousel Meta**: exige TODOS cards mesmo aspect ratio (Zurita 02/03 vieram com ratios diferentes — precisou crop centralizado)
6. **AD09 Opal**: lead form intra-Meta (`destination_type: ON_AD`) força CTA `SIGN_UP` — outras CTAs rejeitadas pela API

## Pendências do user

| Pendência | Impacto |
|-----------|---------|
| **D1 PIX restante R$1.000** | Sem isso, R$120/d trava em ~4d (saldo R$30 + R$500 PIX) |
| **D2 CAPI**: invocar `@aios-dev *develop-story story-capi-1.1` | Story pronta, ~2 dias trabalho |
| **D5b Gate 3 SQL** | Lead R$11,48 ("mesa bilhar jantar") virou SQL real? |
| **D9 Spend cap** | A (+R$10k = R$40k 83d) / B (+R$5k = 41d) / C (+R$3k = 25d). Recomendado A |
| **D15 Rotação 8 ads** | Onda 3 etapas (recomendado) vs CJ8v3 isolado |
| **AD09 Opal**: confirmar `effective_status: ACTIVE` | Estava IN_PROCESS — review automático Meta ~5-15min |

## Paths críticos

- Memória traffic-chief: `D:/AIOS/.claude/agent-memory/traffic-masters-chief/project_bretda_*.md` (6 arquivos sessão)
- Audit completo: `D:/AIOS/docs/projects/bretda-auditoria-2026-04-28/auditoria-completa.md`
- Story CAPI: `D:/AIOS/apps/bretda-lp/docs/stories/story-capi-1.1-meta-conversions-api.md`
- Creatives normalizados: `D:/AIOS/tmp/bretda-creatives-29abr/normalized/`
- Conclaves Jarvis: `D:/jarvis/bridge-data/conclaves/{fdc5745d-,7fb83ff3-}*`
- Scripts MCP execução: `D:/jarvis/mcp-ads-bridge/scripts/bretda-d{1-14}*.mjs`

## Sessões agentId (continuáveis)

| Sessão | agentId |
|--------|---------|
| Audit inicial 28/Abr | `a1b1ccefd5bc946cc` |
| D1-D6 execução | `a608afa1589870b95` |
| D2/D5a/D5b autônomo | `a6efdc30344dfdba6` |
| D3 Opal carousel | `aa37790efd78c7183` |
| D7 budget R$120 | `a79590bde15640a51` |
| D8 AD09 active | `a09628bab0bb25759` |
| D14 4 ads novos | `a468acfe102039cbf` |
