# #02 — NF Emitter Multi-Município

**Tier:** S
**Status:** ⚪ pending (paralelizar com #01 se houver banda)
**Case validador:** Lucas Morais (fisioterapeuta zero programação) → R$25k setup + R$3.8k MRR + pipeline R$180k+

---

## DSPC

**D — Dor cara:**
Contador de e-commerce / dropshipping / curso online atende cliente que vende em 10+ plataformas (Hotmart, Greenn, Shopify, Eduzz, Kiwify). Cada venda exige nota fiscal. Município muda regras a cada 6 meses. Cliente esquece e perde prazo → multa R$500-3.000 por NF atrasada. Contador faz na mão 200-500 NFs/mês × 8min cada = 26-66h/mês só emitindo NF. Hora-contador R$80-150 = **R$2k-10k/mês em mão-de-obra repetitiva por cliente.**

**Custo semanal visível:** escritório com 30 clientes × 8h/sem emissão = 240h/sem. Time de 5 pessoas. Custo R$30-50k/sem.

**S — Squad:**
- `agent-webhook-receiver` — captura eventos de compra (Hotmart/Greenn/Shopify/Eduzz/etc.)
- `agent-municipio-router` — identifica município do tomador, pega regras certas (API 5.775 municípios)
- `agent-nf-templater` — preenche dados conforme padrão municipal
- `agent-cert-digital-handler` — assina com certificado A1/A3 do cliente
- `agent-prefeitura-submitter` — submete na API municipal (cada município é uma integração distinta)
- `agent-status-tracker` — confirma recibo, gera PDF, anexa ao webhook origem
- `agent-erro-recoverer` — retry queue se prefeitura cair (filas comuns na BR)

**P — Pitch:**
> "Eu ajudo escritórios de contabilidade que atendem e-commerce a reduzir 90% do tempo de emissão de notas usando squad de NF multi-município para alcançar zero multas por atraso e capacidade de atender 3x mais clientes com a mesma equipe"

**C — Contrato:**
- Setup: R$25k-40k (até 50 clientes do contador) / R$60k-120k (200+ clientes)
- Manutenção: R$5k-15k/mês (novos municípios, atualizações tributárias, novas plataformas e-commerce)
- Continuidade: 24 meses (pra justificar setup de integrações)

---

## Vertical inicial sugerido

**Recomendado: Contabilidade especializada em e-commerce/info-produto**
- Volume alto e crescente
- Cliente final (lojista) paga MRR pro contador, contador paga MRR pra nós — alinhamento
- Lucas já validou: contadores aceitam pagar pelo serviço

**Alternativas:**
- Contabilidade de saúde/clínicas (Lucas case secundário)
- Contabilidade de startup SaaS (mais simples, menos volume — evitar)
- Contabilidade tradicional indústria (resistente a IA, ticket menor)

---

## Reuse de assets AIOS

| Asset | Função |
|---|---|
| `@architect` | Design da arquitetura plug-in por município |
| `@data-engineer` | Schema multi-tenant + filas Inngest |
| `@dev` | Integrações Hotmart/Greenn/Shopify (já temos experiência com Bretda + Tocks) |
| `legal-chief` + Patricia Peck | Compliance LGPD (NF tem PII tomador) |
| `@qa` | Test suite municipal (regras mudam) |
| HYDRA pipeline | Research municipal automation (5.775 municípios é trabalhão de descobrir APIs) |
| Lucas Morais (case real) | Possível parceria — ele já fez engenharia inicial |

---

## Stack técnico proposto

- **Backend:** Next.js + Supabase + Inngest (filas) + Upstash Redis
- **AI:** Codex 5.5 só pra extração contextual quando regra é ambígua; resto é determinístico (script)
- **Certificado digital:** integração ICP-Brasil A1 (cliente fornece P12) ou A3 (HSM cloud)
- **APIs municipais:** SOAP/REST conforme prefeitura — começar pelas top-100 cidades (cobre 90% das vendas BR)
- **Plataformas e-commerce:** Hotmart, Greenn, Eduzz, Kiwify, Shopify, WooCommerce, Tray, Nuvemshop, Yampi, GoHighLevel
- **Hospedagem:** Vercel + Supabase + Inngest cloud

---

## Roadmap de execução

| Fase | Duração | Entregável |
|---|---|---|
| **Brainstorm DSPC** | 2h | Confirmar contador-ICP, dor concreta com números |
| **Discovery** | 3-5 dias | Identificar contador piloto disposto a testar com 1 cliente |
| **PRD detalhado** | 1 dia | Spec dos 7 agents, fluxo end-to-end |
| **MVP — 5 municípios** | 1 semana | São Paulo, Rio, Belo Horizonte, Curitiba, Floripa (covering 30% do BR vendas) |
| **MVP — 5 plataformas** | 1 semana | Hotmart, Greenn, Eduzz, Shopify, GoHighLevel |
| **Smoke test piloto** | 1-2 semanas | 1 cliente real do contador, 50-200 NFs reais emitidas |
| **Expansão** | contínua | Adicionar municípios sob demanda (60-80% do faturamento vem de 100 cidades) |

**Tempo total até primeiro contador fechado:** ~5-7 semanas.

---

## Parceria estratégica com Lucas

Lucas já tem:
- Engenharia inicial feita (Cloud Code + AIOS)
- Marketplace mundial GHL em construção
- Primeiro cliente (escritório contábil) fechado

Opções:
1. **Reseller:** Lucas vende nosso squad como parceiro, fica com 30%
2. **Whitelabel:** ele entrega como dele, nós entregamos infra, 50/50
3. **Concorrer respeitosamente:** atacamos verticais que ele não está mirando (contabilidade EUA startup vs Lucas BR e-commerce)

Trigger: `decisão parceria lucas-nf`

---

## Hipóteses críticas

1. ✅ Lucas validou demanda + receita
2. ❓ Há startup já dominante no nicho? (Contabilizei.com, Conta Azul?) → research necessário
3. ❓ APIs municipais SOAP/REST sem padronização → custo de integração varia 1-50x por cidade
4. ❓ Certificado digital tem complexidade legal (A1 cliente fornece vs A3 cloud)
5. ❓ Quem é o primeiro contador piloto?

---

## Riscos

- **Risk-1:** Receita Federal muda padrão NF (já mudou várias vezes) → impacto: arquitetura plug-in OBRIGATÓRIA
- **Risk-2:** Lucas tem head-start → mitigar: vertical diferente OU parceria
- **Risk-3:** Multa fiscal se squad errar uma NF crítica → mitigar: gate humano + insurance contratual com cliente
- **Risk-4:** API prefeitura caindo direto (especialmente cidades pequenas) → mitigar: retry queue robusto + alerts proativo (heartbeat pattern do Polymarket)

---

## Próximas ações

- [ ] Decidir relação com Lucas (parceria vs paralelo)
- [ ] Tech research APIs municipais top-100 BR (HYDRA)
- [ ] Tech research concorrência: Contabilizei, Conta Azul, eNotas (e outras "nfe.io"-style)
- [ ] Identificar contador piloto (network Tocks tem alguém em e-commerce?)
- [ ] Spike: emissão NF prefeitura São Paulo (caso mais comum)

Trigger: `kickoff nf-emitter`
