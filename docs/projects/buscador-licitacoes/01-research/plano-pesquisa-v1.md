# Plano de Pesquisa v1 — Buscador de Licitações Águas Lindas-GO + DF

> Documento gerado na **Fase A** do método `/tech-research`. Output desta fase é o "contrato" que governa as fases B-F. **Gate A**: precisa de aprovação do solicitante (Breno) antes de prosseguir.

---

## 1. Identificação

- **Solicitante:** Breno (uso pessoal + amigo fornecedor)
- **Coordenador da research:** Orion (@aios-master)
- **Data:** 2026-05-14
- **Versão:** 1.0 (post-orgânico)
- **Status:** 🟢 GATE A APROVADO 2026-05-15 — Fase B em execução
- **Contexto:** research orgânica já feita (HYDRA + curated, 150 fontes). Este plano formaliza retroativamente + corrige rigor.

---

## 2. Pergunta real (5 Whys)

**Pergunta inicial:** "Buscador de licitações para Águas Lindas-GO + DF, para uso pessoal + amigo, talvez produto futuro."

**5 Whys:**
- **Why 1** — Por que quer um buscador de licitações? meu amigo tem uma empreteira que presta serviços para o governo 
- **Why 2** — Por que precisa de ferramenta melhor? ele não precisa eu que existi no projeto 
- **Why 3** — Por que cauda longa regional importa? pensei nisso por conta que ele atua nesta região, mas esta ferramenta terá mais vontagem por ser mais regionalizada
- **Why 4** — Por que virou problema agora? ele so me pediu para fazer algo no nicho dele 
- **Why 5** — Por que construir vs comprar (Effecti)? **(a) Effecti não atende uso pessoal/microempresa (~R$0 dispostos a pagar); (b) Amigo quer features que Effecti não tem (alerta WhatsApp regional, foco DF); (c) Breno extrai valor mesmo se virar produto-gaveta — domínio aprendido + projeto cívico.** c 

### Pergunta real

> **"É tecnicamente e economicamente exequível construir, em 8 semanas solo-dev, um buscador hiper-regional (Águas Lindas-GO + DF) de licitações públicas que (a) cubra ≥80% do volume real desses geos via PNCP API + scraping leve, (b) entregue valor mensurável superior ao PNCP oficial em UX + Effecti em preço para um fornecedor microempresário específico, e (c) custe $0-40/mês operacional na fase pessoal, mantendo opção de produtizar regionalmente se a tese se confirmar em 60-90 dias de uso real?"** simn

---

## 3. Decisão pendente

- **Qual decisão será tomada?**
  **3 sub-decisões aninhadas:**
  - **D-GO:** Construir o MVP (sim, com Fase 1 PNCP+digest) OU não construir (manter como ideia) apos eu aprovar a arquitetura eu construa o mvp 
  - **D-STACK:** Confirmar stack Next.js+Supabase+Inngest OU pivotar (ex: PocketBase, Astro+SQLite) pergunte para o dev 
  - **D-PRODUTO:** Decisão pós-60 dias — produtizar regionalmente OU manter pessoal-only OU descontinuar
- **Quem decide?** Breno (proprietário; amigo só sinaliza fit) 
- **Quando precisa estar tomada?**
  - D-GO: até 2026-05-22 (1 semana)
  - D-STACK: junto com D-GO
  - D-PRODUTO: 2026-07-15 (60 dias pós-MVP funcional)
- **Reversibilidade:**
  - D-GO/D-STACK: **alta** (8 semanas solo, custo afundado < $50; pivot/descontinuar barato)
  - D-PRODUTO: **média** (se anunciar como produto e descontinuar, dano reputacional pequeno)
- **Custo de errar:**
  - D-GO sim mas devia ser não: **40-60h de Breno desviadas de Tocks/Bretda** (oportunidade perdida pode chegar R$5-15k/mês de receita não-otimizada se Tocks/Bretda estagnar)
  - D-GO não mas devia ser sim: amigo continua com ferramenta ruim, perde 2-5 licitações boas em 6 meses, oportunidade de produto regional fechada por terceiro
- **Critério de sucesso da decisão:**
  - Sucesso D-GO: amigo USA diário por ≥30 dias e reporta ≥3 oportunidades "que eu teria perdido"
  - Sucesso D-STACK: stack escolhido suporta MVP em 8 semanas SEM debugging existencial
  - Sucesso D-PRODUTO: 5+ fornecedores DF demonstram willingness-to-pay ≥R$30/mês

---

## 4. Restrições não-negociáveis

### Técnicas
- **Solo-dev** (Breno, ~10-20h/sem; sem time auxiliar disponível)
- Stack deve ter **alta produtividade** (Next.js conhecido > NestJS desconhecido)
- **Free tier obrigatório** na fase pessoal (Supabase 500MB, Vercel free, Inngest free)
- LLM com **multi-provider** (Anthropic 529 frequente — fallback OpenAI obrigatório)
- Sem dependências de Python complexas (lxml/Crawl4AI falharam em Python 3.14)

### Regulatórias
- **LGPD desde dia 1** — dados de fornecedores PJ (CNPJ) ok por interesse legítimo + LAI; CPF de sócios = NÃO COLETAR
- **LAI ampara** scraping de portais .gov.br para dados publicados (não scraping de dados restritos)
- **Termo de uso** redigido com disclaimer "não é consultoria jurídica"
- **Política de privacidade + cookie consent** vanilla LGPD-friendly

### Financeiras
- **Fase pessoal:** budget operacional máximo $40/mês (LLM + Supabase upgrade quando estourar 500MB)
- **Build cost:** $0 hard cap (tudo free tier ou licença AIOS)
- **NÃO consumir caixa Tocks/Bretda**

### Temporais
- **8 semanas para MVP funcional** (PNCP ingest + email digest + UI básica + 1 perfil amigo)
- **60-90 dias pra decisão D-PRODUTO**
- Não bloquear nenhum gate Tocks/Bretda

### Éticas/culturais
- **Free tier honesto** (princípio cívico Pahlka) — não é isca, é produto real
- **NÃO coletar mais dado do que precisa** (Privacy by Default — Cavoukian)
- Tom de voz: pragmático, não-juridiquês, sem "revolucionário disruptivo"

### Recursos
- Breno solo (10-20h/sem); amigo como product validator + 1º usuário
- AIOS framework + AIOS skills + Jarvis Mind Clones disponíveis
- Mind Clones consultáveis: Pahlka (govtech), Kleppmann (data systems), Justen Filho (licitação BR), Pablo Hoffman (scraping)

---

## 5. Hipóteses iniciais (testar deliberadamente)

| ID | Hipótese | Confiança inicial | Evidência atual | Status |
|---|----------|-------------------|------------------|--------|
| **H1** | PNCP API REST oficial cobre ≥80% do volume real de licitações DF+Águas Lindas (federal + estadual + municipal) | 60% | Lei 14.133 art. 174 torna PNCP obrigatório; ComprasGov se integra; mas adoção municipal pode estar atrasada | A validar Fase B (regulatório+técnico) |
| **H2** | Amigo fornecedor pagaria R$30-100/mês por solução superior, mas player nacional R$300-500 está fora do orçamento dele | 55% | Effecti pricing ~R$400/mês indicativo; gap entre free PNCP e R$300+ existe | A validar Fase B (mercado) + entrevista direta com amigo |
| **H3** | Stack Next.js 15 + Supabase + Inngest + Resend entrega MVP em 8 semanas solo, custo $0-40/mês | 70% | Breno tem proficiência Next.js; arquitetura V1 já feita; outros AIOS projetos validaram stack | A validar Fase B (técnico) + POC PNCP API |
| **H4** | Águas Lindas-GO publica licitações no PNCP (federal padronização) mais que no portal municipal | 45% | Lei 14.133 art. 174 obriga, mas adoção real é variável | A validar Fase B (regulatório) + checagem empírica PNCP query |
| **H5** | Free tier robusto + email digest é diferenciador competitivo defensável vs Effecti/LicitaNet | 50% | Nenhum competidor tem free tier de verdade; mas free tier pode comoditizar mercado para mim quando virar produto | A validar Fase B (mercado) + síntese dialética |
| **H6** | LLM Haiku 4.5 + embeddings small produz resumo executivo de edital com qualidade suficiente, custo ≤$0.005/edital | 75% | Haiku é proficient em PT-BR; tamanho edital típico 5-20k tokens | A validar Fase B (técnico) + POC com 5 editais reais |
| **H7** | Sites .gov.br oficiais brasileiros bloqueiam scraping sistematicamente (anti-bot Cloudflare) — vou precisar contornar isso para fontes secundárias | 80% | HYDRA run #1 mostrou: Planalto, Águas Lindas, e-Compras DF, Sinj-DF, TCDF → 403/fetch failed | **PARCIALMENTE CONFIRMADA** (run #1) |
| **H8** | Mercado de buscadores de licitação no Brasil tem ≥5 players nacionais maduros mas ZERO foco regional declarado | 70% | Conhecimento de domínio + run #1 (Effecti, LicitaNet, Conlicitação, Sollicita, Licitar Digital, BLL, Bidding, Edital365) | A validar Fase B (mercado) — confirmação de nicho regional vago |
| **H9** | Lei 14.133 + LAI ampara scraping ético de dados públicos sem necessidade de autorização específica do órgão | 65% | LAI dá direito a info pública; mas portais podem ter ToU específicos restritivos | A validar Fase B (regulatório) — checar ToU PNCP+ComprasGov |
| **H10** | Tocks/Bretda em estado atual NÃO podem perder 10h/semana do Breno para buscador licitações com segurança | 65% | Tocks pré-PIX, Bretda em restore híbrido pós-Instant Form trap; mas se virarem auto-pilot estabilizado, sim | A validar Fase F (timeboxing) + check com gates Tocks/Bretda |

---

## 6. Dimensões aplicáveis

- [x] **Técnico-arquitetural** — Justificativa: implementação envolvida; escolha de stack + viabilidade de scraping + LLM cost
- [ ] **Científico-evidencial** — N/A (não há claim de eficácia clínica/educacional/etc; é produto cívico-comercial)
- [x] **Regulatório-legal** — Justificativa: domínio ALTAMENTE regulado (Lei 14.133, LAI, LGPD, jurisprudência TCU/TCDF), produto vai consumir dados públicos governamentais
- [x] **Mercado-negócio** — Justificativa: decisão de entrada/não-entrada de mercado com competição estabelecida (5+ players), pricing, GTM regional, potencial produtização

**3 de 4 dimensões.** Esperado para produto B2B cívico.

---

## 7. Perguntas-mestre

### 7.1 Dimensão Técnica (T)

1. **T1.** A API PNCP de consulta tem rate limits, autenticação obrigatória, ou paginação que comprometa um cliente solo? (resposta: numérica/binária)
2. **T2.** Para parsing de editais PDF típicos (50-200p, com tabelas), qual o trade-off LlamaParse free tier vs Unstructured.io self-hosted vs Adobe Extract em precisão e custo? (resposta: comparativa)
3. **T3.** Postgres FTS + pgvector no Supabase é suficiente para search híbrida (BM25+semântico) até quantos docs antes de precisar Meilisearch/Typesense? (resposta: numérica — N docs/MB)
4. **T4.** Inngest free tier suporta o volume estimado de pipelines (~6 cron schedules + ~3000 events/mês) sem upgrade? (resposta: binária)
5. **T5.** Claude Haiku 4.5 produz resumo executivo de edital PT-BR jurídico denso com qualidade aceitável e custo ≤$0.005/edital? (resposta: numérica + qualitativa)
6. **T6.** Quais técnicas de scraping ético respeitam termos de uso de portais .gov.br e ainda assim contornam blocks comuns (Cloudflare, captcha simples)? (resposta: comparativa/mapeamento)

### 7.2 Dimensão Regulatória (R)

1. **R1.** Lei 14.133/2021 + Decreto 11.246/2022 + LAI 12.527 amparam consumo automatizado (scraping/API) de dados de licitação por terceiros sem autorização específica? (resposta: binária + condições)
2. **R2.** Quais cláusulas de termos de uso do PNCP, ComprasGov, e-Compras DF restringem reuso/redistribuição de dados? (resposta: mapeamento)
3. **R3.** LGPD bases legais aplicáveis: (a) dados de CNPJ públicos por LAI, (b) CPF de sócios em editais antigos, (c) dados do usuário do nosso produto? (resposta: triagem por categoria)
4. **R4.** Jurisprudência TCU/TCDF sobre fornecedores que usam ferramentas de busca: existe risco de algum órgão considerar isso "vantagem indevida"? (resposta: binária + casos documentados)
5. **R5.** Quais obrigações ANPD recaem sobre SaaS B2B de 1 dev solo? (DPO, ROPA, DPA com fornecedores, notif incidente)

### 7.3 Dimensão Mercado (M)

1. **M1.** Players nacionais BR (Effecti, LicitaNet, Conlicitação, Sollicita, Licitar Digital) — pricing real (com 3 fontes triangulares: landing + review G2/Capterra + reclame aqui)? (resposta: tabela)
2. **M2.** Existe player com foco regional explícito (DF, Centro-Oeste) que eu desconheço? (resposta: binária + mapeamento)
3. **M3.** Fornecedores microempresários DF (ME/EPP) — quantos? Qual % usa hoje ferramenta paga vs manual vs grupos WhatsApp? (resposta: numérica — SEBRAE-DF deve ter)
4. **M4.** TAM/SAM/SOM regional: quantos fornecedores potencialmente pagariam R$50-200/mês pelo produto em DF? (resposta: numérica estimada)
5. **M5.** GTM regional DF — quais canais funcionam (SEBRAE, FIBRA, LinkedIn, indicação) e qual CAC esperado? (resposta: comparativa)
6. **M6.** Modelo de monetização: SaaS flat vs créditos vs híbrido — qual ARPU típico em SaaS B2B microempresa BR? (resposta: numérica)

**Total:** 17 perguntas-mestre — adequado para 3 dimensões, decisão de média reversibilidade.

---

## 8. Calibração do scoring de fontes

| Dimensão | Autoridade | Recência | Relevância | Justificativa |
|----------|-----------|----------|-----------|---------------|
| **Técnica** | 15% | 35% | 50% | Stack evolui rápido; oficial docs + GitHub trending importam |
| **Regulatória** | 45% | 35% | 20% | Apenas oficial (.gov.br, AGU) e doutrina canônica (Marçal, Niebuhr) servem |
| **Mercado** | 20% | 30% | 50% | Sites players + reviews verificadas + reports BR |

**Score mínimo fonte-âncora:** ≥ 4 de 5
**Score mínimo background:** ≥ 3 de 5
**Abaixo de 3:** descartar

---

## 9. Critério de parada por sub-pergunta

| Sub-pergunta | Cota fontes-âncora | Timebox |
|--------------|---------------------|---------|
| Perguntas T1-T6 (técnico) | 8 cada | 30min cada |
| Perguntas R1-R5 (regulatório) | 10 cada (mais rigor) | 45min cada |
| Perguntas M1-M6 (mercado) | 8 cada | 30min cada |

**Saturação semântica:** 5 fontes consecutivas sem claim novo → encerrar.
**Total timebox Fase B:** ~12-15h (manageable em 2-3 sessões).

---

## 10. Sequenciamento e gates

| Fase | Responsável | Entrada | Saída | Gate |
|------|-------------|---------|-------|------|
| A — Estruturação | Orion | Pergunta inicial | **Este plano** | **🟡 Aprovação Breno** |
| B — Coleta paralela | Sub-agents (1/dimensão) | Plano aprovado | Coleta scoreada por dimensão | Cota atingida |
| C — Síntese dialética | Orion | Coleta consolidada | Tese/antítese/síntese por D-decision | Dialética completa |
| D — Adversarial review | Mind Clone (Pedro Valerio "Process Absolutist") OU outro agente | Síntese | Conclusões filtradas | Conclusões sobreviventes |
| E — Entregável final | Orion | Conclusões aprovadas | Deliverable.md | Revisão Breno |
| F — Roteamento | Orion | Deliverable | Atualizar CONTEXT.md, MASTER-REPORT, decisões | — |

---

## 11. Timebox

- **Fase A:** 1h (já em curso)
- **Fase B (paralela 3 dimensões):** 12-15h totais (4-5h por dimensão)
- **Fase C:** 3h
- **Fase D:** 2h
- **Fase E:** 2h
- **Fase F:** 1h
- **Total:** ~22h research + revisão

**Distribuído em:** 3-5 sessões de trabalho. Não bloqueia gates Tocks/Bretda.

---

## 12. Entregável esperado

- **Formato:** Markdown denso + tabelas em `99-synthesis/`
- **Audiência primária:** Breno (decisão D-GO, D-STACK)
- **Audiência secundária:** Amigo fornecedor (validação de premissas)
- **Roteamento downstream:**
  - Atualizar `CONTEXT.md` com glossário refinado
  - Atualizar `02-architecture/01-architecture-v1.md` com escolhas justificadas
  - Atualizar `03-squad/01-squad-final.md` se research mudar referências
  - Criar `04-decisions/decision-log.md` com D-GO/D-STACK/D-PRODUTO
- **Onde fica arquivado:** `docs/projects/buscador-licitacoes/99-synthesis/tech-research-v1.md`

---

## 13. Riscos da própria research

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| Sites .gov.br oficiais continuam bloqueando scraping → research técnica empobrece | Alta (já confirmada parcialmente) | Usar WebFetch direto (Claude tem fetcher próprio que pode contornar alguns blocks) + pedir prints/HTML específicos ao Breno |
| Documentação API PNCP fragmentada/desatualizada | Média | Validar empiricamente com 3-5 queries reais; cruzar com posts de devs no Medium/Dev.to BR |
| Mercado regional DF — dados específicos podem não existir publicamente | Média | Substituir por triangulação: SEBRAE-DF + IPEA + entrevistas com amigo + 2-3 fornecedores DF via amigo |
| Conflito Anthropic 529 → tasks pipeline travam | Alta | Multi-provider OpenAI/DeepSeek fallback + retry 529 já patchado em HYDRA |
| Hipótese H10 (Tocks/Bretda não absorvem 10h/sem) falsa → research desvia de prioridade | Média | Checkpoint semanal; se Tocks/Bretda demandar emergência, pause |
| Adversarial review (Fase D) detecta confirmation bias massivo → muito trabalho perdido | Baixa-Média | Antídoto: nesta Fase A já fui adversarial comigo mesmo (H10 testa decisão de fazer a research) |

---

## 14. Aprovação (Gate A)

- [x] Solicitante (Breno) revisou e aprovou
- [x] Data de aprovação: **2026-05-15**
- [ ] Alterações solicitadas: _nenhuma — aprovado como está_

---

## 🎯 Próxima ação esperada de Breno (Gate A)

Revisar os 14 itens acima e responder uma das 3:

1. **🟢 Aprovado como está** → Orion dispara Fase B (3 sub-agentes paralelos coletando T/R/M)
2. **🟡 Aprovado com ajustes** → especificar mudanças (ex: "tira H6, adiciona H11 sobre X", "reduz timebox Fase B pra 8h", "adiciona dimensão científica para Y")
3. **🔴 Reescrever** → o que está fundamentalmente errado (ex: "pergunta real está errada, é outra")

**Trigger pra responder:** `gate A aprovado` · `gate A ajusta {x}` · `gate A reescreve`
