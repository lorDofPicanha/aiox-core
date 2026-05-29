# Projeto Contador - Status e Proximos Passos

Data: 2026-05-28
Status: estrategia inicial salva, pronta para Story 0.1

## O que ja foi salvo

1. `00-mega-pesquisa-hydra.md`
   - Pesquisa HYDRA + web sobre mercado contábil, dores, obrigações fiscais, concorrentes e fontes.

2. `01-conclave-agentes-mvp.md`
   - Decisões do conclave: MVP, escopo, agentes, clones, riscos e plano inicial.

3. `02-relatorio-aiox-adicionados.html`
   - Relatório visual AIOX consolidando pesquisa, conclave, funcionamento do produto e próximos passos.

4. `03-status-e-proximos-passos.md`
   - Este arquivo, com o estado atual e o que falta fazer.

## Como o produto vai funcionar

O produto será uma central operacional para escritórios contábeis acompanharem clientes, documentos, obrigações, prazos, responsáveis e riscos.

Fluxo inicial:

1. Escritório cadastra usuários internos, clientes e CNPJs.
2. Cada cliente recebe um perfil operacional: MEI, Simples Nacional e depois Lucro Presumido.
3. O sistema gera checklists mensais por tipo de cliente.
4. Obrigações, documentos e pendências viram tarefas com responsável, prazo e status.
5. O time acompanha tudo em dashboard e kanban.
6. O cliente recebe link ou portal para enviar documentos.
7. O gestor vê vencidos, gargalos, clientes em risco e SLA por responsável.

## Decisão de MVP

Nome operacional:

**Radar Fiscal + Operação do Escritório Contábil**

Promessa:

> Uma central para o escritório enxergar obrigações, pendências e documentos por cliente antes que virem multa, retrabalho ou CNPJ inapto.

ICP inicial:

- Escritórios contábeis pequenos e médios.
- 5 a 40 colaboradores.
- Carteira de 50 a 500 CNPJs.
- Primeiro foco: MEI + Simples Nacional.

## Dentro do MVP

- Cadastro de escritório, usuários e clientes/CNPJs.
- Carteira por responsável interno.
- Checklist mensal por tipo de cliente.
- Kanban de obrigações e pendências.
- Portal/link do cliente para envio de documentos.
- Alertas manuais ou semi-automatizados por email/WhatsApp.
- Trilha de auditoria simples.
- Matriz de status: ok, pendente cliente, pendente contador, em revisão, entregue, risco.
- Dashboard operacional: clientes em risco, pendências vencidas, documentos faltantes e SLA.

## Fora do MVP

- Apuração tributária completa.
- Escrituração completa.
- Substituir Domínio, Alterdata, Fortes, Questor ou similares.
- Armazenar certificado A1.
- Scraping e-CAC em massa.
- Envio fiscal automático sem aprovação humana.
- Integra Contador na fase 1.

## Decisões principais do conclave

1. Começar por escritório contábil, não por empreendedor final.
2. Não substituir sistemas contábeis incumbentes.
3. Entrar pela dor operacional: documentos, prazos, pendências e responsáveis.
4. Usar Reforma Tributária como gatilho comercial, não como promessa de cálculo tributário completo.
5. Deixar Integra Contador para fase 2, depois de validar demanda.
6. Tratar LGPD e segurança desde o início.
7. Criar Story 0.1 antes de código.

## O que falta agora

1. Definir ICP final.
2. Criar oferta piloto.
3. Montar roteiro de entrevista com 10 perguntas para contadores.
4. Escolher 3 escritórios-alvo para piloto manual.
5. Criar matriz inicial de obrigações para MEI + Simples Nacional.
6. Criar mapa LGPD/segurança v0.
7. Criar PRD v0.1.
8. Quebrar em epics/stories via @pm/@sm.

## Story recomendada

**Story 0.1 - Definir ICP, promessa e piloto manual do Projeto Contador**

Acceptance criteria:

- ICP documentado.
- Oferta piloto documentada.
- Roteiro de entrevista com 10 perguntas.
- Matriz de dores priorizadas.
- Lista de 3 escritórios-alvo para piloto.
- Escopo MVP e fora de escopo definidos.

## Agentes donos

- @aios-master: orquestração.
- @analyst: pesquisa e entrevistas.
- @pm: PRD, ICP, MVP e backlog.
- @architect: arquitetura e dados.
- @ux-design-expert: fluxo do escritório e portal do cliente.
- @data-engineer: matriz de obrigações e dashboards.
- @cyber-chief + @bruce-schneier: segurança.
- @legal-chief + @patricia-peck: LGPD.
- @traffic-masters-chief + @april-dunford: posicionamento e oferta.
- @dev + @qa: implementação e validação quando houver stories aprovadas.
