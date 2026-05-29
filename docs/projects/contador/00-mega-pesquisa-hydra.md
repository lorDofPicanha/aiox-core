# Projeto Contador - Mega Pesquisa HYDRA

Data: 2026-05-28
Modo: HYDRA local + pesquisa web verificada
Status: base para conclave de agentes

## HYDRA local

- HYDRA status: 4.438 URLs rastreadas, 3.209 originals, 40 runs, ultimo run em 2026-05-20.
- Corpus atual nao tinha material relevante para "contabilidade", "contador", "escritorio contabil" ou "accounting automation".
- `hydra test-source web` validou acesso a fontes como Serpro/Integra Contador, Receita Federal, Simples Nacional, Omie e Contabilizei.
- `hydra test-source rss https://www.reddit.com/r/ContabilidadeAtual/.rss` retornou 403; comunidade deve ser pesquisada por busca web ou outra fonte.

## Tese inicial

O projeto do contador deve ser tratado como uma plataforma operacional de compliance e relacionamento, nao como apenas dashboard financeiro. O maior valor esta em reduzir risco operacional, prazos perdidos, pendencias fiscais, trabalho manual em portais, troca de documentos com cliente e efeito da Reforma Tributaria 2026-2033.

## Mercado e timing

- Pequenos negocios sao 97% das empresas no Brasil e respondem por 26,5% do PIB, segundo Sebrae.
- Contabilizei declarou 100 mil clientes em dezembro de 2025, mostrando escala de demanda para contabilidade digital.
- Omie declara mais de 25 mil contadores parceiros e posiciona OneFlow como software contabil web/autonomo.
- A Receita identificou mais de 6 milhoes de contribuintes com pendencias de obrigacoes acessorias em janeiro de 2026; 1.531.822 poderiam ter CNPJ inapto se nao regularizassem.
- Em maio de 2026, cerca de 2,6 milhoes ainda permaneciam omissos; aproximadamente 434 mil optantes do Simples e cerca de 1 milhao MEIs.

## Regulacao e obrigacoes centrais

- Reforma Tributaria: IBS e CBS comecam a valer em 1 de janeiro de 2026; 2026 e ano de teste, mas exige destaque de CBS/IBS em documentos fiscais eletronicos.
- Documentos impactados incluem NF-e, NFC-e, CT-e, CT-e OS, NFS-e, NFCom, NF3e, BP-e e BP-e TM.
- SPED cobre programas/validadores como ECD, ECF, EFD-Contribuicoes e EFD ICMS IPI.
- Simples Nacional concentra servicos como PGMEI/DASMEI, consulta de optantes, DASN-SIMEI, DTE-SN/MEI e agenda.
- Integra Contador/Serpro e peca-chave: APIs para PGDAS-D/DAS, MEI/DAS/divida, DCTFWeb/DARF, SicalcWeb/DARF, pagamentos, caixa postal e procuracoes. Requer e-CNPJ e autorizacao por procuracao digital.

## Dores que viram produto

1. Controle de pendencias por cliente: situacao fiscal, caixa postal, omissoes, CNPJ inapto, debitos e comprovantes.
2. Calendario vivo de obrigacoes: PGDAS-D, DEFIS, DASN-SIMEI, DCTFWeb, ECF, ECD, EFD-Contribuicoes, EFD-Reinf/eSocial.
3. Coleta de documentos do cliente: notas, extratos, folha, contratos, certificado, procuração, comprovantes.
4. Automacao governamental legal: preferir APIs oficiais como Integra Contador; evitar scraping arriscado em e-CAC quando API existir.
5. Reforma Tributaria: checklist de adequacao por cliente, documentos fiscais com IBS/CBS, classificacoes, simulacoes de impacto, regime Simples vs regular.
6. Operacao interna do escritorio: filas, responsavel, SLA, status por cliente, auditoria, revisao, retrabalho, aprovacoes.
7. Atendimento ao cliente: WhatsApp/email, documentos pendentes, lembretes, explicacoes simples, historico.
8. BI consultivo: margem, fluxo de caixa, inadimplencia, impostos pagos, alertas de anomalia e recomendacoes.
9. Seguranca: certificados digitais A1, procurações, gov.br, dados fiscais, LGPD, trilha de auditoria.
10. Multi-tenant: escritorio contabil gerencia muitos CNPJs, usuarios internos, permissao por carteira e cliente.

## Concorrentes e sinais

- Omie/OneFlow: software contabil web, integracao com ERP, parceiro contador, promessa de rotinas autonomas.
- Contabilizei: contabilidade online B2C/SMB, escala de 100 mil clientes, foco em abertura/troca de contador e atendimento.
- Domínio/Thomson Reuters, Alterdata, Fortes, Questor, Nasajon, SCI, Sage/IOB: incumbentes de sistemas contabeis.
- Conta Azul/Nibo/Omie: camada ERP/financeiro com conexao contador-cliente.
- Opencon/Contya/Conube: digitalizacao/white label/contabilidade online.

## Hipoteses de MVP

MVP recomendado: "Radar Fiscal + Operacao do Escritorio".

Escopo inicial:
- Cadastro de clientes/CNPJs.
- Checklist mensal por regime tributario.
- Kanban operacional por obrigacao.
- Portal do cliente para documentos pendentes.
- Alertas de prazo e pendencias.
- Registro de procuracao/certificado sem armazenar segredo no MVP, apenas status/metadados.
- Prova manual/concierge antes de integrar APIs pagas.

Fora do MVP:
- Motor completo de apuracao tributaria.
- Substituir Domínio/Alterdata/Fortes.
- Scraping e-CAC em massa.
- Guardar certificado A1 sem desenho de seguranca/DPIA.
- Automacao de envio fiscal sem contador aprovando.

## Perguntas para o conclave

1. O cliente-alvo inicial e escritorio contabil pequeno/medio ou empreendedor final?
2. O wedge deve ser Reforma Tributaria, pendencias/CNPJ inapto, portal do cliente ou automacao Integra Contador?
3. Devemos vender como SaaS, servico operacional/concierge ou hibrido?
4. Qual integracao oficial entra primeiro: Integra Contador, Simples Nacional, SPED, NFS-e, WhatsApp?
5. Como tratar certificado digital, procuracao e LGPD sem criar risco desnecessario?
6. Quais agentes ficam donos de produto, arquitetura, legal, seguranca, UX, dados, QA e go-to-market?

## Clones sugeridos para o conclave

- @marty-cagan: produto e recorte de MVP.
- @april-dunford: posicionamento em mercado cheio.
- @martin-fowler: arquitetura evolutiva e limites de integracao.
- @bruce-schneier: seguranca, certificados, procuracoes e ameacas.
- @patricia-peck ou @ann-cavoukian: LGPD e dados fiscais.
- @aswath-damodaran: modelo economico/preco/ROI.
- @nick-mehta ou @lincoln-murphy: sucesso do cliente e operacao recorrente.
- @joel-de-menezes-niebuhr ou @marcal-justen-filho: criterio juridico-tributario brasileiro, se disponivel no contexto.

## Fontes verificadas

- Receita Federal - Integra Contador: https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2022/setembro/receita-federal-e-serpro-disponibilizam-nova-plataforma-de-prestacao-de-servicos-contabeis-e-fiscais
- Serpro - Integra Contador: https://loja.serpro.gov.br/integracontador
- Receita Federal - SPED: https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/download/sped
- Simples Nacional: https://www8.receita.fazenda.gov.br/SimplesNacional/
- Ministerio da Fazenda - Reforma Tributaria 2026: https://www.gov.br/fazenda/pt-br/assuntos/noticias/2025/dezembro/receita-federal-e-comite-gestor-do-ibs-orientam-sobre-entrada-em-vigor-do-novo-sistema-de-tributacao
- Receita Federal - omissoes e CNPJ inapto: https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/janeiro/receita-federal-convoca-pessoas-juridicas-que-deixaram-de-entregar-obrigacoes-acessorias-a-se-regularizarem-1
- Receita Federal - processamento de inaptidao em maio/2026: https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/maio/receita-federal-inicia-processamento-de-inaptidao-de-cnpj-por-omissao-de-obrigacoes-acessorias
- Sebrae - pequenos negocios: https://agenciasebrae.com.br/dados/confira-os-grandes-numeros-dos-pequenos-negocios-no-brasil/
- Omie Contadores: https://www.omie.com.br/contadores/
- Contabilizei 100 mil clientes: https://www.contabilizei.com.br/contabilidade-online/100-mil-clientes-contabilizei-um-marco-feito-de-vocacao-coragem-e-primeiros-passos/
