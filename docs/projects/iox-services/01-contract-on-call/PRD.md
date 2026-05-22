# #01 — Contract-on-Call Generator

**Tier:** S
**Status:** 🟢 NEXT
**Case validador:** Rodrigo Lins (advocacia bancária litígio) → +60% receita YoY 2026 vs 2025

---

## DSPC

**D — Dor cara:**
Advogado fecha a call de venda mas leva 30-50 min pra mandar contrato. Nesse tempo, mãe/tia/esposa do lead sabota fechamento ("não fecha isso, é caro demais"). Esfriamento mata fechamentos. Cada hora atrasada = -10% probabilidade de assinatura.

**Custo semanal visível:** escritório com 5 advogados perdendo 2 fechamentos/sem × R$8k ticket = R$16k/sem perdido em vendas que esfriaram.

**S — Squad:**
- `agent-call-listener` — captura áudio/transcrição da call
- `agent-data-extractor` — extrai dados do lead (CPF, processo, valor da causa, dor específica) da conversa ou da petição inicial
- `agent-contract-templater` — preenche template do escritório com dados
- `agent-signature-orchestrator` — integra ZapSign / D4Sign / Clicksign API
- `agent-whatsapp-deliverer` — envia link de assinatura via WhatsApp em <30s
- `agent-followup-bot` — agenda follow-up automático se não assinar em 24h

**P — Pitch:**
> "Eu ajudo escritórios de advocacia bancária a reduzir 95% do tempo entre call e contrato assinado usando squad de contratualização automática para alcançar +60% de conversão sem perder leads no esfriamento"

**C — Contrato:**
- Setup: R$15k-25k (escritórios pequenos até 5 advogados) / R$40k-60k (15+ advogados)
- Manutenção: R$2.5k-5k/mês (ajustes em templates, novos serviços, integrações)
- Continuidade: 12 meses inicial, renovação tácita semestral

---

## Vertical inicial sugerido

**Recomendado: Advocacia bancária litígio** (caso Rodrigo Lins direto)
- Alta repetição de tipos de causa (revisão de juros, gestão de passivo, embargos)
- Templates de contrato já bem padronizados
- Ticket alto (R$5-30k por causa)
- Brasil tem milhares de escritórios desse nicho

**Alternativas:**
- Advocacia previdenciária (volume gigante INSS)
- Trabalhista (mais commodity, ticket menor — evitar)
- Tributário (alta margem, mas processos longos — esfriamento menos crítico)

---

## Reuse de assets AIOS

| Asset | Função |
|---|---|
| `@dev` | Implementação técnica |
| `@architect` | Design arquitetura webhook → IA → ZapSign |
| `@data-engineer` | Schema banco de leads + contratos |
| `legal-chief` + Patricia Peck | Compliance LGPD (contrato circula PII) |
| `@qa` | Test suite contratos gerados (precisão dos dados) |
| Mind clones consultados | Rodrigo Lins (case), `martin-fowler` (arquitetura), `patricia-peck` (legal) |
| Whisper local | Transcrição da call sem token-cost |
| Anonymizer (vai virar #05) | Cliente NÃO ver dados PII em logs |

---

## Stack técnico proposto

- **Backend:** Next.js 16 + Supabase (multi-tenant — cada escritório = tenant)
- **AI:** Codex 5.5 para extração (mais barato que Cloud Opus) + Cloud Opus só para revisão crítica
- **Assinatura:** ZapSign API (R$0,80/assinatura) — alternativas D4Sign, Clicksign
- **WhatsApp:** Twilio API OU Z-API (BR-friendly mais barato)
- **Hospedagem:** Vercel (preview cada cliente) + Supabase
- **Observability:** Heartbeat pattern do Polymarket + dead-man-switch externo (lição extraída)

---

## Roadmap de execução

| Fase | Duração | Entregável |
|---|---|---|
| **Brainstorm DSPC** | 2h | Confirma vertical, ICP, dor, pitch refinado |
| **Discovery cliente piloto** | 1-3 dias | Identificar 1 advogado disposto a ser case |
| **PRD detalhado** | 4-6h | Especificação por agent, fluxo end-to-end |
| **MVP técnico** | 3-5 dias | Squad rodando + extração + ZapSign + WhatsApp delivery |
| **Smoke test** | 1 dia | Cliente piloto fecha 3-5 contratos reais via squad |
| **Refinamento** | 1 semana | Ajustes pós-feedback piloto |
| **Lançamento case** | 1-2 dias | Vídeo demo + LP + slide deck para prospects (usa slide-creator #00) |

**Tempo total até primeiro cliente fechado:** ~3-4 semanas se houver banda mental.

---

## Hipóteses críticas a validar antes de codar

1. ✅ Caso Rodrigo Lins comprova demanda (+60% YoY)
2. ❓ Quanto escritórios pagam por ferramentas tipo CRM hoje? (precisamos saber pra ancorar 10x)
3. ❓ ZapSign API tem white-label / reseller? (afeta margem)
4. ❓ Há restrição OAB sobre IA gerando contratos? (legal-chief consultar)
5. ❓ Quem é o primeiro cliente? Sem isso, parar e prospectar antes de codar.

---

## Riscos

- **Risk-1:** OAB pode regulamentar IA em contratos → impacto: incluir disclaimer + revisão humana obrigatória no fluxo (Patricia Peck)
- **Risk-2:** ZapSign muda preço API → impacto: pluggable signature provider desde MVP
- **Risk-3:** Alucinação em dados extraídos → impacto: gate de validação determinístico (regex + checksum em CPF/valores) antes de gerar contrato

---

## Próximas ações

- [ ] Brainstorm DSPC formal (1 sessão)
- [ ] Discovery: identificar 1 advogado bancário próximo (network Tocks/Bretda? Rodrigo Lins direto?)
- [ ] Consultar Patricia Peck (legal-chief) sobre OAB e LGPD
- [ ] Tech research: ZapSign vs D4Sign vs Clicksign (HYDRA)
- [ ] Spike: extração de dados de petição via Codex (PDF → JSON estruturado)

Trigger: `kickoff contract-on-call`
