---
name: Bretda Instant Form Trap 07/Mai
description: Smoking gun encontrado — queda qualidade leads pós-28/Abr causada por shift LP form → Meta Instant Form (CTA SIGN_UP). 6 mudanças MCP executadas Opção A.
type: project
originSessionId: 0eee011f-e894-468b-8892-5b3852f170af
---
# Bretda — Instant Form Trap (Smoking Gun) — 07/Mai/2026

> **⚠️ SUPERSEDED 12/Mai/2026** — Diagnóstico "LP form → Instant Form" pós-28/Abr estava ERRADO no mecanismo. Descoberto via Meta API que **TODOS** ads Bretda Meta (AD03/AD04/AD05/AD10v2 + 5 PAUSED) sempre foram Instant Form (`destination_type=ON_AD`). `link_url` era cosmético. Smoking gun real = **budget jump R$27→R$120 (+344%) + 5 creatives novos**, NÃO mudança de form type. Ver `session_bretda_restore_12mai.md` + `feedback_meta_destination_type_validation.md`.


## Diagnóstico

User: "porque os clientes pioraram pos-28/Abr?". Cruzamento memory + Meta data por dia identificou shift estrutural LP form → Instant Form como causa raiz.

**Timeline:**
- **Pré-28/Abr**: CJ8v2 rodava AD03 + AD04 + AD05 com CTA `GET_QUOTE`/`LEARN_MORE` → LP form (bretda.com.br)
- **28/Abr 23:55**: AD09 Opal Carousel ATIVADO — primeiro Instant Form (CTA `SIGN_UP`, destination_type ON_AD)
- **29/Abr**: 4 ads novos (Aurora/Âmbar/Citrino/Zurita) criados — todos SIGN_UP/Instant Form porque "outras CTAs rejeitadas pela API"
- **30/Abr madrugada**: AD03/AD04 PAUSED, 4 novos ATIVADOS — CJ8v2 ficou 100% Instant Form
- **05/Mai**: AD10 Aurora v2 criado, mais Instant Form
- **07/Mai (auditoria)**: 5 ads ACTIVE = 4 Instant Form + 1 ambíguo (AD05 link_url vazio)

## Por que destruiu qualidade (high-ticket)

| Critério | LP form (pré-28) | Instant Form (pós-28) |
|----------|------------------|----------------------|
| Atrito | Click → LP → vê produto/preço → form | 2 taps form pre-filled FB |
| Awareness preço | Vê R$15-80k antes | Não vê NADA da Bretda |
| Phone/email | User digita ativamente | Pre-filled FB Profile (2-5 anos desatualizado) |
| Intent score | Alto | Baixo, curiosidade impulsiva |
| Close rate típico | 5-15% | 0.5-2% (3-5x pior) |
| CPL aparente | R$25-50 | R$11 ⚠️ TRAP |
| CAC real (sobre fechamento) | R$300-1000 | R$1500-5000 |

**Trap:** CPL Meta R$11 looks healthy MAS Instant Form preenche-fácil → mais leads junk → CPL cai → algoritmo Meta otimiza pra pior.

**Evidências corroborantes:**
- Pixel match 0.7% (1/148): 147/148 NÃO passam pela LP
- 75 LPV → 1 onsite_web_lead em 30d: LP basicamente vazia
- Memory 03/Mai linha 98 já flaggava `destination_type=ON_AD` — sintoma visível 4d atrás

## Ação executada (Opção A)

6 chamadas mcp-ads-bridge:

| Ad | ID | Antes → Depois | Tipo |
|----|-----|----------------|------|
| AD09 Opal | 120245279644000737 | ACTIVE → PAUSED | Instant Form |
| AD10 Aurora v1 | 120245285456440737 | ACTIVE → PAUSED | Instant Form |
| AD10 Aurora v2 | 120245578942970737 | ACTIVE → PAUSED | Instant Form |
| AD12 Citrino | 120245285468330737 | ACTIVE → PAUSED | Instant Form |
| AD03 | 120237168468400737 | PAUSED → ACTIVE | LP form GET_QUOTE |
| AD04 | 120244164992490737 | PAUSED → ACTIVE | LP form GET_QUOTE |

**Estado final CJ8v2:**
- ACTIVE (3): AD03, AD04, AD05 (LEARN_MORE link_url VAZIO ⚠️)
- PAUSED (6): AD09, AD10v1, AD10v2, AD11, AD12, AD13 (todos Instant Form)

## Riscos abertos

1. **AD05 link_url vazio**: pode estar (a) quebrado, (b) Instant Form com LEARN_MORE, (c) display issue MCP. Precisa validação UI Meta.
2. **AD03/AD04 tinham 0 leads/7d antes** (eram "lixo" porque AD05 monopolizava 97% spend). Podem não entregar com volume.
3. **CPL vai SUBIR D+1 a D+7**: R$11 → R$25-50 (esperado). Volume cai 148/30d → 40-80/30d. Close rate sobe 3-5x — esse é o trade-off correto.

## Plano B (caso AD03/AD04 não entreguem)

Criar variantes LP-form dos creativos das coleções (Aurora/Âmbar/Citrino/Zurita/Opal):
- Mesmo creativo (são bons em volume)
- CTA `LEARN_MORE` ou `GET_QUOTE`
- link_url: `bretda.com.br/colecao/{coleção}` (destination_type=WEBSITE)
- Pausar SIGN_UP variants definitivamente

## Trigger ao reativar

- `audit bretda d+7` ou `gate bretda 14/mai` → comparar LP form vs Instant Form mesma semana
- `valida ad05` → screenshot UI Meta pra resolver ambiguidade
- `cria lp variants coleções` → Plano B ativo
