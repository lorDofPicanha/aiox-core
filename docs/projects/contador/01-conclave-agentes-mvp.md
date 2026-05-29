# Projeto Contador - Conclave de Agentes

Data: 2026-05-28
Chamador: @aios-master / Orion
Base: `docs/projects/contador/00-mega-pesquisa-hydra.md`

## Painel consultado

Batch manual correto:

- @marty-cagan - produto, MVP, riscos de valor/usabilidade/viabilidade/factibilidade.
- @april-dunford - posicionamento e categoria.
- @martin-fowler - arquitetura evolutiva e integracoes.
- @bruce-schneier - seguranca, certificados, procuracoes e ameacas.
- @patricia-peck - LGPD e dados fiscais.
- @aswath-damodaran - modelo economico, preco e ROI.
- @lincoln-murphy - customer success, onboarding e retencao.

IDs de consulta:

- marty-cagan: `6a1af000-7e81-4702-83ee-5a2d118b5c88`
- april-dunford: `606af28c-05f6-4565-9765-3ea5ac3f26ac`
- aswath-damodaran: consulta retornada no batch
- lincoln-murphy: `0260c8d8-c119-4a03-9518-0cc26124e23a`

Observacao: o auto-conclave inicial escolheu alguns clones de saude por associacao ruim de "compliance/LGPD". Essa selecao foi descartada para decisao de produto, exceto o aprendizado de que compliance precisa de escopo minimo documentado.

## Consenso

1. O MVP nao deve tentar substituir sistemas contabeis incumbentes.

O produto deve entrar por uma dor operacional transversal: pendencias, prazos, documentos, status por cliente, risco de CNPJ inapto e Reforma Tributaria. A tese e "sistema nervoso operacional do escritorio", nao "novo Domínio/Alterdata".

2. Comecar com escritorio contabil pequeno/medio, nao empreendedor final.

O escritorio tem muitos CNPJs, dor recorrente, alto custo de retrabalho e valor claro em padronizacao. O empreendedor final tem dor, mas exige suporte educacional e CAC maior.

3. O wedge recomendado e "Radar Fiscal + Operacao do Escritorio".

Primeira promessa: "nenhuma obrigacao importante fica invisivel; nenhum documento pendente fica perdido; nenhum cliente fica sem dono".

4. Concierge MVP antes de automacao pesada.

Validar com 3 a 5 escritorios, operando parcialmente manual, antes de comprar/integrar APIs oficiais ou construir automacao fiscal profunda.

5. Seguranca e LGPD entram no MVP, mas com escopo minimo.

No MVP: metadados de certificado/procuracao, trilha de auditoria, permissoes por cliente, data map e termos. Fora do MVP: armazenar certificado A1, automacao e-CAC por scraping, envio fiscal automatico sem aprovacao humana.

## Dissenso

1. Categoria de mercado.

- April Dunford tenderia a criar subcategoria: "Central de Operacao Fiscal para Escritorios Contabeis".
- Cagan/Damodaran preferem comecar mais pragmatico: vender resultado e ROI, nao categoria.

Decisao: usar categoria simples no pitch inicial: "Radar fiscal e operacional para escritorios contabeis". Categoria pode evoluir depois.

2. Reforma Tributaria como wedge principal.

- Pro: timing forte, urgencia 2026, alta ansiedade.
- Contra: risco de parecer consultoria tributaria ou motor fiscal incompleto.

Decisao: usar Reforma Tributaria como gatilho comercial e checklist, nao como promessa de apuracao tributaria.

3. Integrar Integra Contador agora ou depois.

- Pro: cria moat operacional e fonte oficial.
- Contra: exige e-CNPJ/procuracao, custo, seguranca e desenho juridico.

Decisao: MVP registra status e fluxo de procuracao/certificado, mas opera manual/concierge. Integra Contador entra na fase 2 apos prova de demanda.

## Blind spots

1. Falta entrevista real com contadores.

Nao temos ainda voz do cliente. Precisamos de 10 entrevistas e 3 pilotos manuais.

2. Falta mapa preciso de obrigacoes por regime.

Simples, MEI, Lucro Presumido e Lucro Real exigem matrizes diferentes. MVP deve limitar regime inicial.

3. Falta definicao de unidade economica.

Precisa calcular preco por escritorio, por CNPJ ativo, por usuario interno, e custo operacional do concierge.

4. Falta validacao juridico-tributaria local.

Patricia Peck cobre LGPD/digital, mas precisamos de especialista tributario brasileiro para validar linguagem e limites de responsabilidade.

5. Falta decisao de stack e fronteiras de dados.

Certificados, procuracoes, documentos fiscais e dados de clientes exigem arquitetura de permissao e auditoria desde o inicio.

## Veredito

Construir o projeto como:

**Radar Fiscal + Operacao do Escritorio Contabil**

ICP inicial:

- Escritorios contabeis de 5 a 40 colaboradores.
- Carteira de 50 a 500 CNPJs.
- Dor forte em cobranca de documentos, controle de tarefas mensais, pendencias fiscais e comunicacao com clientes.
- Regime inicial recomendado: Simples Nacional + MEI, com extensao posterior para Lucro Presumido.

Primeira proposta de valor:

> "Uma central para o escritorio enxergar obrigacoes, pendencias e documentos por cliente antes que virem multa, retrabalho ou CNPJ inapto."

Escopo MVP:

- Cadastro de escritorio, usuarios e clientes/CNPJs.
- Carteira por responsavel interno.
- Checklist mensal por tipo de cliente.
- Kanban de obrigacoes e pendencias.
- Portal/link do cliente para envio de documentos.
- Alertas por email/WhatsApp manual ou semi-automatizado.
- Trilha de auditoria simples.
- Matriz de status: ok, pendente cliente, pendente contador, em revisao, entregue, risco.
- Dashboard operacional: clientes em risco, pendencias vencidas, documentos faltantes, SLA por responsavel.

Fora do MVP:

- Apuracao tributaria completa.
- Escrituracao completa.
- Substituir sistema contabil.
- Armazenar certificado A1.
- Scraping e-CAC.
- Envio fiscal automatico.

## Divisao de responsabilidade entre agentes

- @aios-master: orquestracao geral, gates, conclaves, alinhamento entre agentes.
- @analyst: entrevistas com contadores, mapa de dores, concorrentes, fontes e jobs-to-be-done.
- @pm: PRD, ICP, MVP, metricas de sucesso, backlog inicial.
- @architect: arquitetura multi-tenant, modelo de dados, integracoes, fronteiras de seguranca.
- @dev: implementacao das stories aprovadas.
- @qa: criterios de aceite, testes, cenarios de risco fiscal/operacional.
- @ux-design-expert: fluxo do escritorio, portal do cliente, usabilidade operacional densa.
- @data-engineer: matriz de obrigacoes, normalizacao de eventos fiscais, dashboards.
- @cyber-chief + @bruce-schneier: threat model, certificado/procuracao, controle de acesso.
- @legal-chief + @patricia-peck: LGPD, termos, DPA, mapa de dados, limites de responsabilidade.
- @traffic-masters-chief + @april-dunford: posicionamento, oferta piloto, script comercial.
- @devops: deploy, secrets, observabilidade, push quando chegar a hora.

## Clones extras recomendados

Prioridade alta:

- @teresa-torres: discovery continuo com contadores.
- @nick-mehta: operacao de onboarding e sucesso em escala.
- @alex-hormozi: oferta piloto high-ticket/hibrida, se decidir vender concierge.
- @joel-de-menezes-niebuhr ou @marcal-justen-filho: juridico/tributario brasileiro para linguagem e risco fiscal.
- @kelsey-hightower ou @werner-vogels: revisao de arquitetura operacional se integrar APIs governamentais.

Prioridade media:

- @ann-handley: copy clara para contador e cliente final.
- @matt-dixon: vendas consultivas B2B para escritorio conservador.
- @bj-fogg: desenho de habitos para uso mensal recorrente.

## Plano de execucao imediato

1. Criar PRD v0.1 com escopo "Radar Fiscal + Operacao do Escritorio".
2. Criar roteiro de 10 entrevistas com contadores.
3. Definir piloto manual com 3 escritorios.
4. Montar matriz inicial de obrigacoes para MEI + Simples Nacional.
5. Criar mapa de dados/LGPD v0 antes de qualquer implementacao.
6. Criar threat model v0 antes de qualquer fluxo de certificado/procuracao.
7. Transformar o MVP em epicos/stories via @pm/@sm.

## Primeira story sugerida

Antes de codigo:

**Story 0.1 - Definir ICP, promessa e piloto manual do Projeto Contador**

Acceptance criteria:

- ICP documentado.
- Oferta piloto documentada.
- Roteiro de entrevista com 10 perguntas.
- Matriz de dores priorizadas.
- Lista de 3 escritórios-alvo para piloto.
- Decisao explicita de escopo MVP e fora de escopo.
