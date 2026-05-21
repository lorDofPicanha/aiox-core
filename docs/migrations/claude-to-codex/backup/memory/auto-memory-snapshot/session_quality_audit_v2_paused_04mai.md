---
name: Sessão Quality Audit + v2 PAUSED Refinement (3 contas) 04/Mai
description: 04/Mai diagnóstico qualidade leads pós-28/Abr → padrão "refine via v2 PAUSED" aplicado em Bretda+Tocks+KR. Regra mestra criada (high-ticket = quality > quantity).
type: project
originSessionId: 05aa0be0-1622-41e8-8d4a-ea0b2fdc504e
---
# Sessão 04/Mai 2026 — Quality Audit Cross-Account + Refinement v2 PAUSED

## Pergunta original do user

> "no dia 28 os leads estavam muito bons, porém pioraram consideravelmente o porque isso está acontecendo"

E refinada:
> "no dia 28 estava vindo leads tanto da Bretda quanto da Tocks muito bons, depois disso eles aumentaram em volume porém a qualidade é péssima. Houve mudança na estratégia ou no funil de vendas para justificar esta queda de qualidade dos leads?"

## Diagnóstico do Traffic Chief (causa-raiz unificada)

**"Mudou o PROMETEDOR DO ANÚNCIO entre 28-30/Abr sem mudar o QUALIFICADOR DO FUNIL."**

Volume subiu porque promessa ficou aspiracional/atrativa, mas funil continuou aceitando qualquer um. Sintoma: **CPL/CPC anormalmente baixo em ticket high (R$15k+) é red flag de window-shopping/curiosidade**, não vitória de eficiência.

### Bretda — o que mudou
- 01/Mai: autopilot pausou AD05 vídeo qualificador "Solicite seu orçamento!" (winner CPL R$10,24 freq 1.48)
- AD10 Aurora single-image dominou 98-100% spend desde 02/Mai com copy poética sem CTA orçamento ("primeiro raio de luz... casas onde a luz tem hora marcada")
- Stories monopoliza 70% spend (vs benchmark BR 8-12%)
- Faixa 25-34 contaminou pool (R$74 / 22 leads / CPL R$3,3 — não deveria estar lá)

### Tocks — o que mudou
- 30/Abr 14h: C007 Premium V+E LIVE (Vértice R$15.990 + Elipse R$19.900) com `goal=CONVERSATIONS` + WhatsApp 1-tap
- VRT-CLS "Linhas" virou monopólio: 32 conversas/dia em 03/Mai com **CPC Conv R$1,18 num ticket R$15k = window-shopping**
- 16/16 ads em CONVERSATIONS+WhatsApp = anti-pattern estrutural

### KR — o que mudou
- V3 LIVE 03/Mai R$50/d com `creative.message` VAZIO (zero copy escrito) em 2 ads ACTIVE
- Stories 96% spend
- CPConv R$1,95-2,33 num ticket arquitetura R$50-200k = vanity puro
- Pixel `495385076720880` ainda não fired (Kell pendente PixelYourSite há 4 anos)

## Regra mestra criada

`feedback_high_ticket_quality_over_quantity.md` — em projetos high-ticket (Tocks/Bretda/KR), foco SEMPRE qualidade, NUNCA quantidade. Sobral ABC: qualificador no creative (A) + form (B) + atendimento (C). CPL/CPC anormalmente baixo em ticket R$15k+ é red flag.

## Padrão arquitetural validado: "Refinar via v2 PAUSED"

**Princípio:** editar creative_id de winner ATIVO força learning reset. Saldos críticos (Bretda R$220 / Tocks R$155) impedem reset. Solução: criar v2 PAUSED com copy qualificadora, esperar Meta review (~24h), ativar paralelo a v1, gate 48-72h compare CRM-quality, decidir kill v1.

**Aplicado consistentemente em 3 contas, 7 ads → 7 v2 PAUSED.**

## Execuções da sessão

### Bretda P0.1 — AD05 reativado (PAUSED → ACTIVE)
- Status: ACTIVE/IN_PROCESS
- Memória autopilot tinha pausado em 01/Mai por guardrail saldo ≤ R$50

### Bretda P0.2 — AD10-v2 Aurora Qualificada
- ad_id: `120245578942970737`
- creative_id: `1514278620068728`
- Copy qualificadora **sem inventar preço** (Bretda política "sob consulta"):
  > "Mesa de bilhar Aurora. Produção sob encomenda em 60 dias. Madeira nobre brasileira, base em aço inox, lã italiana — feita peça por peça no nosso atelier em Blumenau. 5 anos de garantia. Solicite proposta personalizada com nossa especialista em projetos sob medida."
- Image_hash reutilizado (visual idêntico)
- URL específica: `bretda.com.br/colecao/aurora-sinuca`
- **CHIEF DESCOBRIU ERROS FACTUAIS DA COPY V1:** lead time real 60d (não 90), base inox 5 acabamentos (não só "espelhado")
- **STATUS HOJE: ATIVADO** após user disse "pode liberar o ad10-v2"

### Tocks P0-1 — 4 v2 PAUSED com pre-qualifier WhatsApp
| v1 (mantido ACTIVE) | v2 PAUSED criado |
|---|---|
| [VRT-CLS] Linhas R$15.990 | `120248529325960230` |
| [ELP-CLS] Geracional R$19.900 | `120248529317040230` |
| [VRT-AMB] Design Statement | `120248529328210230` |
| [ELP-AMB] Top of Line | `120248529324060230` |

Pre-qualifier wa.me text:
> "Olá! Vi a Vértice (R$15.990). Quero entender prazos e personalização. Para quando preciso instalar: __ ; ambiente: pronto / em projeto."

### Tocks P1 — 7 zombies pausados
- 3 RTG zombies: Tocks Retargeting Ad / RTG Prova Social / RTG Urgencia Suave
- 4 Cidades zombies: Monaco-NE / Gabe-NE / 2× Tocks WhatsApp NE Capitais
- Mantidos ACTIVE deliberadamente: Objecao Preco (REFINE futuro), Monaco SS winner, Gabe SS (copy excelente), 4 v1 C007
- Conta enxugada: 16 → 9 ads ACTIVE

### KR P0-2 — 2 v2 PAUSED com copy escrito qualificador
- AD17-v2 (Eng IG 365D): `120247171032180268`
- AD12-v2 (RTG 90D): `120247171043030268`
- **DESCOBERTA:** nome correto é **Kell Rodrigues**, NÃO Kelline (memória corrigida)
- Localização específica: Águas Claras, Brasília-DF
- Phone: (61) 9 9872-0330, IG @designer.kellrodrigues
- Copy ancorada em fatos reais (sem inventar anos exp / nº projetos / prêmios)
- **MECANISMO ÚNICO:** qualifier via `page_welcome_message` autofill (não wa.me, não lead form) — porque link KR é genérico `api.whatsapp.com/send` sem número fixo
- Autofill novo: checklist tipo (residência/apto/comercial) + ambientes + prazo + cidade

## Estado final dos 3 funis

| Conta | v1 ACTIVE | v2 PAUSED (review ~24h) |
|---|---|---|
| Bretda CJ8v2 | AD05 + AD09 + AD10-v1 + AD12 + **AD10-v2 ATIVADO** | — |
| Tocks C007 Premium | 4 v1 (VRT-CLS, ELP-CLS, VRT-AMB, ELP-AMB) | 4 v2 |
| Tocks restante | C006 Objecao Preco + C005 SS Monaco/Gabe/Generica + C005 NE Generica | — |
| KR Eng IG 365D | AD17 v1 | AD17-v2 |
| KR RTG 90D | AD12 v1 | AD12-v2 |

## Saldos atuais (04/Mai noite)

- **Bretda:** R$218,04 / runway ~1,8d @ R$120/d (PIX em processamento)
- **Tocks:** R$155,15 / runway ~1,3d @ R$120/d (precisa PIX preventivo)
- **KR:** R$223,09 / runway ~4-5d @ R$50/d

## Feedback rules atualizadas/criadas

1. **`feedback_high_ticket_quality_over_quantity.md`** (NOVO) — regra mestra desta sessão
2. **`feedback_meta_prepaid_spend_cap.md`** (ATUALIZADO) — adicionada regra: spend_cap em prepago BR não é editável NEM via API NEM via UI; NUNCA alertar user sobre subir cap

## Triggers ativos pendentes

| Trigger | O que faz |
|---|---|
| `ativa v2 tocks` | Após Meta review (~24h), ativa 4 v2 paralelo a v1 |
| `ativa v2 kr` | Mesmo padrão, KR (2 ads) |
| `gate d2 bretda 06/Mai` | Checkpoint cloud Bretda v1 vs v2 (CRM compare) |
| `gate d2 tocks 06/Mai` | Checkpoint Tocks (após v2 ativado) |
| `gate d2 kr 06/Mai` | Checkpoint KR (Kell-side anotação manual, sem CRM estruturado) |
| `refine objecao preco v3` | Tocks RTG fadiga severa (freq 4.35) |
| `audita pixel kr` | Quando Kell instalar PixelYourSite |
| `mata ad10 v1` | Após gate D+2 Bretda confirmar v2 ganha em qualidade |
| `pix tocks R$X feito` | Confirmar re-injection Tocks |

## Insights estruturais

### 1. KR é a conta MAIS CEGA das 3 (estruturalmente vazio)
- Sem pixel + sem copy escrito + Stories 96% + CONVERSATIONS goal = **trinity da cegueira Sobral**
- Kell-side bloqueador #1: PixelYourSite + pixel `495385076720880` (4 anos pendente)
- Sem CRM estruturado, gate de qualidade depende de Kell anotar conversas qualificadas vs não

### 2. Tocks tem o pior anti-pattern estrutural
- 16/16 ads em CONVERSATIONS+WhatsApp em ticket R$15-30k = recipe pra window-shopping
- Solução longo prazo: trocar pra Lead Form Meta (igual Bretda) OU LP com pre-qualifier antes do WhatsApp
- Pre-qualifier wa.me é quick-win zero-custo aplicado nesta sessão

### 3. Bretda é a conta mais saudável estruturalmente
- Form 8 perguntas qualificadoras (5 CUSTOM) é a JOIA da Bretda — Sobral camada B impecável
- Problema real: placement Stories + advantage_audience undefined deixando algoritmo broad
- Não estragar form, refinar creative + placement
