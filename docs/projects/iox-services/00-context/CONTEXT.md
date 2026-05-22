# IOX-Services — Contexto Compartilhado

**Origem:** Análise da live de 4h29min de Alan (founder IOEX/LX/Academia Lendária) em 18/Mai/2026 + 4 cases reais validados pela comunidade dele.

**Princípio-mestre:** Construímos **squads que entregam serviço**, não SaaS. Cada "ferramenta" listada é, na verdade, um squad operacional que vendemos como serviço premium + recorrência de manutenção/melhorias.

---

## Por que NÃO-SaaS (decisão founder 18/Mai)

Argumentos do Alan na live, reforçados pela decisão:

1. **Empresas não querem mais um login.** Já têm 30 SaaS. Pagam pra alguém **resolver e ficar responsável**.
2. **80% dos projetos AI internos das SP500 falharam** (Stanford). O mercado aceita pagar premium pra alguém externo confiável.
3. **SaaS exige distribuição massiva.** Volume → competição com Amazon/Casas Bahia. Mata margem.
4. **Serviço high-ticket tem margem 10x.** O cliente paga pra não pensar mais no problema, não pela ferramenta em si.
5. **Service-as-Software (SaaS Invertido)** — vendemos serviço, mas TEMOS software por trás que potencializa entrega. Cliente final NÃO acessa o software; ele acessa o resultado.
6. **AIOS é nossa máquina interna.** Cada squad construído aqui = capacidade de entregar projeto premium em fração do tempo do mercado.

**Implicação operacional:**
- Não vamos hospedar SaaS B2B com onboarding self-service
- Não vamos cobrar mensalidade tipo Stripe Billing
- Vamos cobrar **setup + manutenção mensal/trimestral** de cada implementação
- Toda "tool" desta pasta é entregue como **squad rodando no AIOS do cliente OU no nosso ambiente acessado pelo cliente via dashboard read-only**

---

## DSPC — Framework de venda (Alan)

Toda proposta passa por 4 checkpoints:

### D — Dor cara
- Custo semanal **visível** (ex: R$20k/sem em mão-de-obra de documentação)
- Frequência alta, métrica explícita, risco se não resolver
- Empresário precisa enxergar a sangria antes de comprar a estanca

### S — Squad
- Entrega mínima usando agents em squad (não funcionário humano)
- Squad é o asset reutilizável; cada cliente recebe um squad customizado
- Padrão: 3-7 agents especializados em ciclo workflow

### P — Pitch (1 frase, fórmula fixa)
> "Eu ajudo **[ICP específico]** a reduzir **[métrica X concreta]** usando **[squad/método Y]** para alcançar **[resultado Z mensurável]**"

Exemplo: "Eu ajudo escritórios de advocacia bancária a reduzir 80% do tempo de triagem usando squad de análise jurídica para alcançar 3x mais leads convertidos por mês"

### C — Contrato (piloto premium)
- Escopo definido (não escopo aberto)
- Preço fixo setup + recorrência mensal de manutenção
- Continuidade explícita (3, 6 ou 12 meses)
- Cláusula de revisão trimestral

---

## Regra dos 10x (precificação)

> Cobre **10% do valor que o cliente economiza ou ganha em 12 meses**.

Exemplo:
- Workflow X economiza R$50k/mês = R$600k/ano da empresa do cliente
- Cobramos: R$60k setup OU R$5k/mês setup parcelado + R$1-3k/mês manutenção
- Cliente paga em ~30 dias com o que economiza no primeiro mês

**Pré-requisito:** ter pesquisa que comprove os R$50k/mês economizados. Sem isso, não há base pra cobrar 10x.

---

## Vale da morte = preço médio

- **Barato (R$50-500):** commodity, compete com qualquer freelancer no Workana
- **Médio (R$1k-10k):** vale-da-morte, não diferencia, precisa volume pra fazer caixa
- **Premium (R$10k-100k+):** margem grande, espaço pra erro, autoridade, recorrência

**Diretriz:** todo squad/serviço desta pasta deve ser precificado acima de R$15k setup como piso. Abaixo disso, refazer DSPC porque a dor não está cara o suficiente.

---

## Tangibilização antes da call (caso Rodrigo Feldman R$180k)

Não chegue com PDF de proposta. Chegue com:

1. **Mockup funcional** do dashboard/skill que vai entregar
2. **Slide deck personalizado** com o NOME do cliente nas aspas dele
3. **Vídeo demo de 60s** "como será trabalhar com a gente"
4. **PDF executivo** pra sponsor enviar internamente

Custo de produção: 2-4h usando squad **#06 Tangibilização Engine** (ver tool 06).

ROI declarado pelo Rodrigo: veio cobrar R$20k, fechou R$180k porque "foi o único que mostrou tudo funcionando já".

---

## Empilhar verticais, não horizontais

**Caso Alan:** ele está pegando "contabilidade EUA atendendo startups". Não "automação genérica".

**Lições para nós:**
- Cada squad/serviço deve nascer pra um **vertical específico** (jurídico bancário, contabilidade de e-commerce, fisioterapia high-ticket, etc.)
- Reutilizar agents internamente (LX agnostic), mas vender posicionado por dor de nicho
- Nossos 162 mind clones permitem squads ultra-verticais (ex: squad jurídico com Patricia Peck + Lucia Savage + Bruce Schneier)

---

## Stack base reutilizada em todos os 11 projetos

| Componente | Onde está | Função |
|---|---|---|
| AIOS core | `.aios-core/` | Orchestration, memory, agents |
| 162 mind clones | `.aios-core/development/agents/` + `D:/jarvis/mega brain/` | Especialistas com Voice DNA |
| HYDRA pipeline | `tools/hydra/` | Research distribution → feeds |
| brain-bridge MCP | `D:/jarvis/bridge-data/` | Consultation engine |
| Squad agents | squad-chief, copy-chief, design-chief, legal-chief, traffic-masters-chief, db-sage, ux-design-expert, etc. | Orchestrators verticais |
| Slide-Creator skill | `.claude/skills/slide-creator/` | Apresentações HTML animadas (tool #00 done) |
| Whisper local | `scripts/transcribe-audios.py` + `.tmp/transcribe-videoplayback.py` | Transcrição zero-token |
| Pedro Valério | `.aios-core/development/agents/pedro-valerio.md` | Process audit (workflow gates) |
| Patricia Peck | legal-chief tier 2 | LGPD/ANPD compliance |

**Princípio LLM-agnostic:** todo squad deve funcionar em Cloud Code + Codex + Manus + Antigravity. Convenção `.agents/` + `agents.md` é o padrão portátil que adotamos (Alan demonstrou na live).

---

## Cases de validação (referência cruzada)

| Tool # | Case validador | Receita comprovada |
|---|---|---|
| 00 (done) | Alan distribui slides | (ferramental — não cobra direto, retém alunos cohort) |
| 01 Contract-on-Call | Rodrigo Lins (advogado) | +60% receita YoY |
| 02 NF Multi-Município | Lucas (fisio) | R$25k setup + R$3.8k MRR + pipeline R$180k+ |
| 03 Workflow Mapper | Lígia (TJ) gravou tela + áudio | R$30k/mentoria juízes |
| 04 Research Dashboard | Alan próprio (10 pesquisas/dia) | (ferramental para fechar outros contratos) |
| 05 Anonymizer | Lígia (sigilo TJ) | Componente de squad jurídico |
| 06 Tangibilização | Rodrigo Feldman | R$20k brief virou R$180k contrato |
| 07-11 | Sem case direto na live | Inferidos como adjacências de alta-margem |

---

## Triggers do projeto

- `vai com tool {N}` — começa entrega do squad N
- `audit tool {N}` — revisa progresso
- `kill tool {N}` — descontinua se inviável
- `pivot tool {N} para {X}` — muda vertical do squad
- `cliente {nome} interessado em tool {N}` — abre pasta cliente + customiza squad

---

*Documento criado em 2026-05-18 após análise da live Alan T5 Fundamentals. Atualizar quando princípios evoluírem.*
