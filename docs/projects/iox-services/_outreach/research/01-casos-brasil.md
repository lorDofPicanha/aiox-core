# IA na construção civil — casos reais no Brasil e América Latina

**Objetivo:** ampliar a base de casos citáveis para abordagem comercial de construtoras PME
(10-200 funcionários), com honestidade sobre o nível de evidência de cada número.

**Já mapeado antes (não repetido aqui):** Andrade Gutierrez/ALICE Technologies, Reta Engenharia,
Grupo Kallas (fotogrametria/QR), MRV (assistente **Mia**), Direcional, Eztec (Tec.IA), Tenda
(exceto o dado novo de SLA pós-obra, citado em nota), estudo CONTECC 2025 de orçamento
paramétrico. Ver `docs/projects/iox-services/_outreach/ia-construcao-sintese.md`.

**Método:** busca em fonte primária sempre que possível (portal oficial do órgão, site da
empresa) + jornalismo de negócios independente para contexto e checagem cruzada. Toda leitura
de número passou por uma segunda busca/fetch para tentar confirmar a fonte original — quando
não confirmei, digo explicitamente.

---

## Disciplina de evidência

- **A** = estudo acadêmico, relatório técnico/institucional independente (governo, associação
  setorial, consultoria com metodologia declarada), ou veículo jornalístico com apuração própria.
- **B** = a própria empresa/cliente divulgou o resultado (release, entrevista, notícia
  corporativa), replicado por imprensa sem auditoria independente do número.
- **C** = estudo de caso publicado pelo fornecedor da tecnologia sobre seu próprio cliente, ou
  comunicado institucional sem número verificável.

Nenhum número classe C é apresentado como fato consumado — sempre com a ressalva de quem o
divulgou.

---

## Tabela de casos

| # | Empresa | Porte | Contexto | Aplicação de IA | Resultado divulgado | Evidência | Ano | Fonte |
|---|---|---|---|---|---|---|---|---|
| 1 | **Tecnisa** (Brasil, SP) | Grande incorporadora, capital aberto | Venda de imóveis via WhatsApp | **Isa** — assistente de IA proprietária que conduz a negociação completa (dúvidas, fotos, condições, fechamento) | Negociação de imóvel de R$1mi+ concluída em 26 dias (vs. média de 180 dias no processo digital tradicional); venda de R$1,8mi fechada em 16 dias; maior venda até o momento: R$2,7mi (Reserva Figueiras) | B | 2025-2026 | [Exame](https://exame.com/mercado-imobiliario/inteligencia-artificial-da-tecnisa-fecha-venda-de-imovel-de-r-18-milhao/), [Tecnisa](https://www.tecnisa.com.br/noticias/isa-vende-seu-primeiro-imovel) |
| 2 | **Emccamp Residencial** (Brasil, MG/SP/RJ) | Médio-grande (47 anos, não é uma das 5 maiores) | Incorporadora regional mineira em expansão | Assistente virtual **Emy**, Microsoft Copilot (TI/Marketing/RH), IA em campanhas Google/Meta, bots internos de obra | +30% na geração de leads, +20% nas vendas (período de referência não especificado na fonte) | B | mai/2024 | [Diário do Comércio](https://diariodocomercio.com.br/tecnologia/emccamp-residencial-aumenta-20-vendas-ia/) |
| 3 | **Linha 6-Laranja, Metrô de São Paulo** (concessionária Linha Uni / Acciona) | Megaprojeto de infraestrutura, PPP estadual (contrato R$19 bi) | Obra em construção, 12 mil profissionais, 500+ empresas ativas no canteiro | Centro de Gestão Digital de Segurança e Saúde Ocupacional: IA + análise de dados + monitoramento em tempo real para antecipar acidentes | -55% em acidentes com afastamento em menos de 1 ano (9 ocorrências vs. 20 no ano anterior); quase 5 milhões de horas trabalhadas a mais que 2024 | B | 2026 | [Revista O Empreiteiro](https://revistaoe.com.br/linha-6-reduz-acidentes-com-uso-de-ia/) (prêmio InovaInfra 2026) |
| 4 | **CGU — ALICE** (Analisador de Licitações, Contratos e Editais) | Órgão federal de controle (não é construtora — fiscaliza obras e compras públicas) | Fiscalização nacional de licitações e contratos, incluindo obras públicas | IA cruza preços e critérios técnicos de editais/contratos em 3 etapas (coleta → cruzamento → alerta) | **2024** (fonte primária, gov.br): 161 mil processos analisados, R$1,25 bi em benefícios financeiros, 212 auditorias cobrindo R$30,57 bi em compras. **2023**: +190 mil processos, +R$2,08 bi em compras canceladas/suspensas. Caso específico citado pela imprensa: obra da **BR-319** (Manaus–Porto Velho), indícios de superfaturamento de até R$12 milhões | A (números agregados, fonte oficial) / B (caso BR-319, via imprensa) | 2023-2026 | [gov.br/CGU](https://www.gov.br/cgu/pt-br/assuntos/auditoria-e-fiscalizacao/alice), [AM Post](https://ampost.com.br/amazonas/inteligencia-artificial-da-cgu-ajuda-a-identificar-indicios-de-superfaturamento-em-obra-da-br-319/) |
| 5 | **Setor da construção civil brasileiro** (pesquisa consolidada) | Agregado — 120 executivos (35% CEOs/donos/diretores) | Termômetro da Construção 2025, pesquisa nacional Falconi + Ecossistema Sienge | Diagnóstico de adoção de IA, BIM, CRM e Lean Construction no setor | Uso de ferramentas baseadas em IA saltou de **15% (2023) para 37-38% (2025)**. Principais obstáculos do setor: mão de obra (71%), juros altos (48%), custo de insumos (37%) | A | 2025 (pesquisa jun-jul/2025) | [Falconi](https://falconi.com/insight/construcao-civil-investe-em-ia-para-potencializar-seus-resultados/), [CBIC](https://cbic.org.br/setor-da-construcao-civil-reage-a-falta-de-mao-de-obra-com-apoio-da-ia-e-da-gestao-mostra-pesquisa-da-falconi/) |
| 6 | **Thá Engenharia** (Curitiba, PR) | Médio, construtora regional | Assistência técnica pós-obra residencial | Plataforma de terceiro (FastBuilt) para gestão de chamados pós-entrega | SLA caiu de 20-30 dias para 5-10 dias (**-66%**); volume total de chamados caiu 20% | C (dado do fornecedor sobre seu cliente) | 2026 | [FastBuilt](https://www.fastbuilt.com.br/post/intelig%C3%AAncia-artificial-no-p%C3%B3s-obra-como-construtoras-brasileiras-est%C3%A3o-reescrevendo-a-experi%C3%AAncia) |
| 7 | **BP8 Engenharia** (Brasil) | Não informado, provável porte médio | Vistoria de entrega de unidades | Fluxo digital de vistoria com apoio de IA (mesma plataforma FastBuilt) | 90% de aprovação na primeira vistoria (sem número de "antes" divulgado) | C | não especificado | [FastBuilt](https://www.fastbuilt.com.br/post/intelig%C3%AAncia-artificial-no-p%C3%B3s-obra-como-construtoras-brasileiras-est%C3%A3o-reescrevendo-a-experi%C3%AAncia) |
| 8 | **GetHome** (Brasil, interior de SP) | Startup (lançada mar/2026) | Construção de casas sob encomenda, preço fixo | IA para identificação de terrenos, simulação de implantação/fundação, orçamento em tempo real, monitoramento de obra | **Nenhum número medido** foi encontrado — apenas promessa de prazo de 12 meses (metade do "modelo tradicional", segundo a própria startup) e meta de 30 casas em construção até o fim do ano | C (claim de produto, não resultado comprovado) | 2026 | [Business Moment](https://businessmoment.com.br/gethome-casas-ia-construcao-civil/), [GetHome](https://www.gethome.com.br/ai-first) |
| 9 | **CEMEX México** — M.A.R.I.A. | Multinacional, líder de cimento na América Latina | Monitoramento de 15 plantas de cimento no México (30 fornos, 50 moinhos) | IA capta temperatura/oxigênio/pressão/vibração em tempo real, envia alertas via WhatsApp aos operadores | ~5 mil alertas mensais gerados; "resultados positivos" no primeiro ano — sem número de redução de parada ou custo | B | 2024-2025 | [Milenio](https://www.milenio.com/negocios/m-a-r-i-a-la-nueva-inteligencia-artificial-que-ayuda-a-cemex) |
| 10 | **CEMEX México** — Technical Xpert | Multinacional | Suporte técnico-comercial à força de vendas | Copiloto de IA (Microsoft Azure OpenAI GPT-4) integrado ao Teams | Nenhum número de produtividade ou vendas divulgado — só descrição qualitativa | C | abr/2024 | [Expansión](https://expansion.mx/tecnologia/2024/04/03/technical-xpert-el-copiloto-de-cemex-que-impulsa-su-transformacion-digital) |
| 11 | **Echeverría Izquierdo** + startup **Andeslab** (Chile) | Grande construtora/imobiliária chilena, capital aberto | Otimização de obra grossa (estrutura) de edifícios | Machine learning para planejamento estrutural; controle de avanço com câmeras + modelo BIM para decisão sobre uso de ferro/fôrma/concreto | Nenhum número duro — apenas descrição qualitativa ("otimiza e impacta a produtividade... com indicadores em tempo real") | B | set/2024 | [La Tercera / Pulso](https://www.latercera.com/pulso/noticia/cuatro-grandes-empresas-revelan-como-estan-aplicando-la-inteligencia-artificial-en-sus-procesos/55WBWZYNVBDRHMFPCBBRLTWZY4/) |
| 12 | **Edilizia** (Rosario, Argentina) | Médio (100+ profissionais) | Construtora regional, BIM em nuvem | IA gera múltiplas alternativas de projeto/distribuição de obra em minutos | Redução qualitativa de "semanas/meses" para "minutos" na geração de alternativas — sem número exato nem baseline auditável | B (entrevista direta ao CEO, sem métrica quantificada) | jul/2023 | [La Capital (Rosario)](https://www.lacapital.com.ar/negocios/la-constructora-vanguardia-que-usainteligencia-artificialen-sus-obras-n10074040.html) |
| 13 | **Grupo Casais** + **TopBIM** + robô SPOT (Boston Dynamics) — Portugal | Grande grupo de construção português | Obras diversas em Portugal (piloto, obras não identificadas) | Robô autônomo faz levantamento 360°, laser scan, monitoramento de avanço e apoio à segurança; integração com IA generativa para análise de dados | Nenhum número — fase piloto, apenas benefícios teóricos declarados (produtividade, segurança, retrabalho) | C (comunicado institucional replicado sem verificação) | jul/2026 | [Executive Digest](https://executivedigest.sapo.pt/grupo-casais-poe-robo-da-boston-dynamics-a-trabalhar-nas-obras-em-portugal/) |
| 14 | **Litehaus** (Portugal, também Espanha/Estônia/EUA/EAU) | Startup (rodada de €1,46 milhões) | Construção residencial sustentável de baixo custo (impressão 3D) | Agente de IA para todo o funil: orçamento, licenciamento, financiamento, seleção de empreiteiro | Feature "orçamento em 2 minutos" gerou 640 orçamentos = **€125 milhões em projetos potenciais** (pipeline de interesse, **não** obra vendida/construída); parceria com 10 bancos portugueses via ComparaJá | B | ago/2025 | [TechEnet](https://www.techenet.com/2025/08/litehaus-lanca-ia-para-construcao/), [Diário Imobiliário](https://diarioimobiliario.pt/Litehaus-lanca-primeiro-agente-de-IA-portugues-para-a-construcao-residencial) |
| 15 | **Construflow / ProjetaBIM** (Brasil, RS) | Startup B2B (fundada 2014, spinoff 2016) | Compatibilização de projetos BIM colaborativa, atende "grandes construtoras brasileiras" (não nomeadas publicamente) | Plataforma com IA aplicada a questões técnicas, modelos federados BIM, gestão de incompatibilidades entre disciplinas | "Centenas de milhares de registros de incompatibilidades" na base agregada da plataforma — **não** é resultado de um cliente específico; nenhuma métrica de retrabalho evitado ou tempo economizado | C (case do próprio fornecedor, sem cliente nomeado nem antes/depois) | não especificado | [Construflow](https://construflow.com.br/case-projetabim/) |
| 16 | **MRV** — chatbot **Sofia** (parceria Microsoft) — *aprofunda caso já mapeado (Mia)* | Maior incorporadora do Brasil em unidades | Atendimento comercial e conversão de leads | Chatbot de IA generativa (Azure OpenAI) integrado à jornada de vendas | Conversão de leads dobrou: **20% → 40%** segundo Microsoft/MRV; cobertura posterior (TI Inside) cita salto para **70%** com atendimento a 130 mil clientes/mês. **As duas fontes divergem entre si e não há reconciliação pública** | C (case de parceria comercial, divulgado pelos dois lados interessados; divergência entre fontes é sinal de alerta) | 2025-2026 | [Microsoft News Center Brasil](https://news.microsoft.com/pt-br/mrv-dobra-a-conversao-de-seus-leads-com-a-sofia-um-chatbot-de-ia-generativa-com-tecnologia-microsoft/), [TI Inside](https://tiinside.com.br/15/01/2026/ia-eleva-conversao-de-leads-da-mrv-de-20-para-70-e-atende-130-mil-clientes-por-mes/) |

**16 casos** — acima do mínimo de 15 pedido. A distribuição de evidência é: **1 caso A puro**
(pesquisa Falconi/Sienge), **1 caso misto A/B** (CGU/ALICE), **8 casos B**, **6 casos C**.
Nenhum caso C é citável como fato em conversa comercial sem a ressalva de origem.

---

## Análise

### O que se repete

1. **Atendimento comercial via WhatsApp/chatbot é a aplicação com números mais divulgados**
   (Tecnisa, Emccamp, MRV/Sofia) — mas em todos os três casos o número vem do lado interessado
   (empresa ou fornecedor de tecnologia), nunca de auditoria independente. O caso MRV/Sofia é o
   mais revelador: duas fontes ligadas à própria parceria (Microsoft e a imprensa que replicou o
   release) divergem em 30 pontos percentuais (40% vs. 70%) sobre o mesmo indicador — isso é
   material para explicar ao founder por que "número redondo sem origem" não deve ser prometido.

2. **A fiscalização pública é onde a evidência é mais forte (classe A)** — porque o Estado tem
   obrigação de publicar metodologia e resultado. O ALICE da CGU é o único item desta lista com
   número oficial, auditável, com série histórica (2023→2024). Isso é útil como argumento
   indireto: "se o próprio governo já usa IA para pegar irregularidade em edital, documentar
   direito deixou de ser opcional."

3. **Segurança do trabalho com IA (câmeras, EPI, centros de controle) tem os números mais fortes
   fora do setor público** (Linha 6, -55% em acidentes), mas ainda concentrada em megaprojetos
   com contrato bilionário — nenhum caso de porte médio com esse nível de rigor foi encontrado.

4. **Nenhum caso robusto de quantitativo/orçamento automático por IA em construtora média
   brasileira nomeada** foi encontrado além do estudo acadêmico CONTECC já mapeado — essa
   continua sendo a lacuna mais visível de evidência para o ICP do IOX.

5. **Internacionalmente (Chile, Argentina, Portugal, México), os casos são qualitativamente
   parecidos com os brasileiros e não mais maduros** — nenhum mercado latino-americano está à
   frente do Brasil em evidência publicada. Mesmo Portugal, dentro da Europa, reporta que apenas
   3% das construtoras "utilizam plenamente" IA segundo os próprios CEOs do setor (fonte:
   Jornal de Negócios, achada na pesquisa mas não incluída na tabela por não ter link de estudo
   primário).

### O que só grande empresa consegue

- **Megaprojeto de infraestrutura constrói um centro de controle dedicado** (Linha 6, R$19 bi de
  contrato) — porte que nenhuma construtora de 10-200 funcionários vai replicar.
- **Multinacional roda IA em 15 plantas com equipe própria de ciência de dados** (Cemex/M.A.R.I.A.)
  — exige escala industrial contínua, não obra por obra.
- **Volume de leads que justifica treinar um chatbot proprietário**: MRV atende 130 mil
  clientes/mês segundo a fonte mais otimista — nenhuma construtora média tem esse volume para
  amortizar o investimento em IA proprietária de vendas.
- **Startups como Litehaus e GetHome dependem de rodada de investimento** (€1,46 milhões e aporte
  não divulgado, respectivamente) para bancar o "agente de IA" antes de ter clientes pagantes em
  escala — não é um investimento que uma construtora PME faria com capital próprio.

### O que uma PME conseguiria (o argumento mais importante para o IOX)

- **Emccamp é a prova de que porte médio-grande (não big 5) já roda IA em vendas com resultado
  divulgado** (+30% leads, +20% vendas) usando ferramenta de prateleira (Microsoft Copilot) mais
  curadoria de campanha — não é P&D proprietário.
- **Thá Engenharia e BP8 (classe C, mas coerentes com a tese)** mostram que o ponto de entrada
  realista para porte médio é **pós-obra/assistência técnica via plataforma de terceiro**, não
  IA construída do zero. Isso confirma a leitura já registrada em `ia-construcao-sintese.md`:
  o produto #1 recomendado (RDO/relatório via WhatsApp) mora exatamente nessa faixa de
  complexidade — comprável, não construível do zero por cliente novo.
- **Chatbot comercial via WhatsApp é replicável em porte médio** porque, ao contrário do que a
  MRV sugere, não depende de 130 mil leads/mês — Emccamp (3 estados, 47 anos, não é big 5) já é
  prova de conceito nesse porte.

---

## Lacunas

O que procurei e **não encontrei** publicado (ou encontrei só parcialmente):

1. **Nenhum caso de fracasso nomeado de IA em construção civil brasileira.** O padrão do mercado
   (empresas não divulgam fracasso) se confirma. O único dado quantitativo de abandono de IA
   disponível é setorial geral, **não específico de construção**: 42% das empresas brasileiras
   abandonaram a maioria de suas iniciativas de IA em 2025 (vs. 17% em 2024), segundo **451
   Research/S&P Global** — reportado por Quero Bolsa sem desagregação setorial nem link ao
   relatório original. Tratar como contexto de mercado, não como dado do setor de construção.
2. **Não encontrado**: caso de quantitativo/orçamento automático por IA em construtora média
   brasileira **nomeada**, com metodologia e número auditável — só o estudo acadêmico CONTECC
   (já mapeado antes) trata o tema com rigor.
3. **Não encontrado**: caso de compatibilização de projetos BIM+IA com cliente nomeado e métrica
   de retrabalho evitado. A Construflow tem a tecnologia e "centenas de milhares de registros"
   agregados, mas nenhum case público com nome de cliente + número de antes/depois.
4. **Não encontrado**: caso de obra **industrial** (usina, planta fabril — não residencial, não
   infraestrutura de transporte) com IA no Brasil. A única referência industrial forte da
   pesquisa é a Cemex mexicana.
5. **Não encontrado**: relatório setorial chileno ou argentino equivalente ao Falconi/CONTECC
   brasileiro. Os dois casos latino-americanos localizados (Echeverría Izquierdo, Edilizia) vêm
   de jornalismo de negócios sem métrica auditada — o Chile, segundo a própria Universidade do
   Chile, está em "primeiros passos" de adoção.
6. **Contraponto relevante, sem IA**: o TCE-PR apontou R$14,8 milhões em indícios de
   superfaturamento na obra da Ponte de Guaratuba (jun/2026) usando **auditoria tradicional**,
   sem menção a ferramenta de IA. Isso importa para o pitch: controladores já pegam desvio
   grande sem IA — qualquer proposta de "IA de fiscalização/compliance" precisa mostrar valor
   incremental sobre o método tradicional, não presumir que a alternativa é "não pegar nada".
7. **Não confirmado**: a estatística de "89% de acurácia do TCU na detecção de superfaturamento"
   apareceu em uma única fonte secundária (newsletter/substack), sem link a estudo ou paper
   original. Não usar em conversa comercial até localizar a fonte primária.
8. **Não encontrado**: caso de construtora ou incorporadora **mexicana de porte médio** — todo o
   material sobre México encontrado se refere à Cemex, multinacional gigante, não comparável ao
   ICP do IOX.
9. **Parcialmente encontrado**: o "caso Zillow" (EUA) é o fracasso de IA mais citado
   internacionalmente no mercado imobiliário (Forbes Brasil, jul/2026), mas está **fora do
   escopo geográfico** desta pesquisa (Brasil/América Latina) — citado aqui só para registrar
   que ele existe e não foi ignorado, não para uso na abordagem comercial.
