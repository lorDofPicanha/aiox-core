# Plano de Pesquisa v1 — Auditoria integral do ENIAC Financeiro

## 1. Identificação

- **Solicitante:** Breno Cerqueira
- **Coordenador:** Orion (`@aios-master`)
- **Data:** 2026-06-30
- **Versão:** 1.0
- **Status:** aprovado por mandato explícito do solicitante — “revise todo o projeto e faça uma tech research com o comparativo de tudo”
- **Conclave:** `33efc498-f7e4-49a0-9f2c-2733ad3b9636`

## 2. Pergunta real

**Pergunta inicial:** Como está o projeto e qual é o comparativo de tudo?

**Pergunta real:** O ENIAC Financeiro, no estado atual, é tecnicamente reproduzível, seguro e adequado para um piloto real; quais decisões de arquitetura, fornecedores, controles e escopo devem ser mantidas, corrigidas, substituídas ou adiadas antes de produção e futura produtização?

### Refinamento em 5 Whys

1. Revisar tudo para não confundir quantidade de features com prontidão real.
2. Medir prontidão porque o app manipula dados financeiros e será usado por três empresas.
3. Comparar alternativas porque escolhas atuais criam custo, lock-in e risco regulatório.
4. Priorizar porque o founder opera muitos projetos e precisa de sequência executável.
5. Decidir porque um piloto mal preparado pode causar perda de dados, decisões financeiras erradas e retrabalho estrutural.

## 3. Decisão pendente

- **Decisão:** autorizar ou não um piloto; definir arquitetura-alvo e backlog bloqueante.
- **Decisor:** founder.
- **Reversibilidade:** média para stack; baixa para exposição de dados financeiros e confiança do cliente.
- **Custo de errar:** perda/corrupção de dados, vazamento, reconciliação incorreta, vendor lock-in e retrabalho.
- **Sucesso:** findings reproduzíveis, alternativas comparadas com critérios explícitos e roadmap que separa bloqueadores de melhorias.

## 4. Restrições não-negociáveis

- CLI First e Story-Driven Development.
- Next.js/TypeScript como preferência do ecossistema, salvo evidência forte em contrário.
- Postgres, isolamento multiempresa e números determinísticos.
- LGPD by design; nenhum segredo em cliente, Git ou relatório.
- Time pequeno/solo founder; baixo overhead operacional.
- Open Finance via participante/agregador autorizado, sem tentativa de virar participante regulado no MVP.
- IA nunca calcula nem inventa números; apenas chama ferramentas determinísticas.

## 5. Hipóteses iniciais

| ID  | Hipótese                                                                    | Confiança inicial | Evidência atual                                                             |
| --- | --------------------------------------------------------------------------- | ----------------: | --------------------------------------------------------------------------- |
| H1  | A stack Next.js + Supabase é adequada ao piloto.                            |               80% | Coerente com o monorepo e RLS planejada.                                    |
| H2  | O app tem features suficientes, mas não está operacionalmente pronto.       |               90% | Build local passa; testes e deploy não foram evidenciados.                  |
| H3  | O maior risco imediato é reprodutibilidade/versionamento do banco.          |               95% | Clientes Supabase e migrations estão ignorados pelo Git.                    |
| H4  | Pluggy é a escolha provável para o piloto.                                  |               60% | Implementação existente; decisão externa ainda precisa de comparação atual. |
| H5  | O copiloto com LLM deve permanecer fora do caminho crítico.                 |               85% | Valor secundário e risco de respostas financeiras incorretas.               |
| H6  | Partida simples atende o livro-caixa, mas não relatórios contábeis formais. |               95% | Escopo e conclave existentes já registram essa fronteira.                   |

## 6. Dimensões

- [x] **Técnico-arquitetural:** implementação, segurança, qualidade, operação e fornecedores.
- [x] **Regulatório-legal:** LGPD, Open Finance, dados bancários e limites contábeis.
- [x] **Mercado-negócio:** concorrência, build vs buy e potencial de produtização.
- [ ] **Científico-evidencial:** não há claim científico central.

## 7. Perguntas-mestre

### Técnica

1. O repositório reproduz o app e o banco em ambiente limpo?
2. RLS, autenticação e server actions mantêm isolamento e integridade multiempresa?
3. Quais bugs, vulnerabilidades e lacunas de teste bloqueiam piloto e produção?
4. Next.js + Supabase continuam sendo a melhor relação velocidade/controle para o caso?
5. Qual agregador Open Finance e qual estratégia de IA/deploy/observabilidade minimizam risco e custo?

### Regulatória

1. Qual é o papel do ENIAC Financeiro no tratamento de dados pessoais e bancários?
2. Quais requisitos de LGPD/Open Finance afetam consentimento, retenção, auditoria e incidentes?
3. Onde livro-caixa gerencial termina e atividade/relatório contábil regulado começa?

### Mercado

1. Quais produtos resolvem hoje o problema e com que profundidade/preço?
2. Construir sob medida é economicamente defensável frente a Conta Azul, Omie, Nibo, Granatum, Asaas e planilhas?
3. Qual diferencial pode sobreviver à cópia e justificar futura produtização?

## 8. Scoring de fontes

- **Técnico:** autoridade 15%, recência 35%, relevância 50%.
- **Regulatório:** autoridade 45%, recência 35%, relevância 20%.
- **Mercado:** autoridade 20%, recência 30%, relevância 50%.
- Fonte-âncora: score ≥ 4; background: ≥ 3; abaixo de 3: descartada.
- Claims decisórios exigem fonte primária e triangulação quando possível.

## 9. Critério de parada

Encerrar cada pergunta quando ocorrer primeiro: saturação semântica, pelo menos três fontes fortes independentes para a decisão estreita, ou timebox da execução. Incógnitas dependentes de dados reais serão convertidas em experimento, não preenchidas por opinião.

## 10. Entregável e gates

- **Formato:** Markdown versionado.
- **Audiência:** founder, arquitetura, dev, QA, segurança e produto.
- **Saída:** auditoria scoreada, matrizes comparativas, riscos, roadmap e bibliografia anotada.
- **Gate adversarial:** conclave + checklist formal de ataque às conclusões.
- **Arquivo final:** `research/06-auditoria-tech-research-comparativa.md`.

## 11. Riscos da própria research

| Risco                                                 | Mitigação                                                                |
| ----------------------------------------------------- | ------------------------------------------------------------------------ |
| Escopo “tudo” virar enumeração superficial            | Organizar pelas decisões que bloqueiam piloto/produção.                  |
| Pricing e funcionalidades mudarem                     | Usar páginas oficiais atuais e registrar data de validade.               |
| Confundir produto financeiro com contabilidade formal | Separar claramente gestão de caixa de escrituração/relatórios regulados. |
| Confirmation bias a favor da stack já construída      | Comparar alternativas e procurar failure modes deliberadamente.          |
| Inferir segurança por leitura estática                | Marcar o que exige teste real, ambiente limpo e pentest.                 |

## 12. Aprovação

- [x] Escopo aprovado pelo mandato explícito do solicitante em 2026-06-30.
- [x] Execução autorizada sem implementação de correções nesta story.
