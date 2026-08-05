# Evidência independente de IA na construção civil — o que a literatura acadêmica e técnica mede de verdade

**Missão:** separar o que fornecedores (Buildots, ALICE Technologies, Dusty Robotics, Converge, Togal.AI,
Trunk Tools) afirmam sobre os próprios produtos do que pesquisa **independente** — peer-reviewed,
institucional, ou terceirizada — realmente mediu.
**Cruza com:** `docs/projects/iox-services/_outreach/ia-construcao-sintese.md` (síntese do relatório
original, 01/Ago/2026) e o documento-fonte `IA_na_Construcao_Civil_Casos_Reais_e_Aplicacoes.docx`.
**Método:** busca em bases abertas (arXiv, ScienceDirect, MDPI, Springer, PMC, Frontiers, Nature
Scientific Reports) + fetch direto de papers quando o abstract não bastava. Metade dos PDFs
consultados não pôde ser lida em texto corrido (paywall ou binário sem OCR local) — nesses casos uso
o que o abstract/resumo indexado revela e marco explicitamente a limitação.
**Confiança geral desta pesquisa:** média. Cobri as 6 aplicações pedidas com pelo menos uma fonte
primária cada, mas o orçamento de busca da sessão esgotou antes de eu conseguir (a) confirmar a
citação acadêmica exata por trás do número "~98% CONTECC" citado no documento original, e (b) achar
qualquer validação independente de Buildots, ALICE Technologies, Dusty Robotics, Converge ou Trunk
Tools. Isso é, em si, um achado — ver seção 10.

---

## 0. Sumário executivo

| Pergunta | Resposta curta |
|---|---|
| Onde a evidência independente **confirma** os números de fornecedor? | Só indiretamente — nunca testando o produto do fornecedor em si, mas mostrando que a *classe* de técnica (visão computacional para EPI e para elementos discretos de progresso) atinge acurácia alta **em laboratório/dataset controlado**. Nenhum estudo independente testou Buildots, ALICE, Dusty Robotics, Converge ou Trunk Tools especificamente. |
| Onde **contradiz**? | Na adoção real: RICS (2.200 profissionais, 2025) mostra 45% das empresas sem uso algum de IA e menos de 1% com uso embutido em múltiplos processos — o oposto da narrativa de "todo mundo já usa". E o único estudo etnográfico que achei sobre implementação de IA de visão computacional em canteiro real (China, [Song & Song 2026](#ref-song2026)) descreve fadiga física, contorno do sistema pelos trabalhadores e erosão de confiança — não o ganho líquido que casos de fornecedor sugerem. |
| O que está **pronto para produção**? | Detecção de capacete/colete (EPI) em condições de câmera fixa e boa iluminação — mAP consistentemente 85-98% em múltiplos estudos independentes desde 2018. Quantitativo a partir de modelo BIM bem modelado — desvios de 0,1-0,4% já demonstrados. |
| O que ainda é **pesquisa**, não produto maduro? | Previsão de custo/prazo por ML (erro típico 6-28% dependendo do dataset, sem generalização entre projetos/países comprovada), RAG documental aplicado à construção especificamente (zero estudo dedicado encontrado — só evidência de domínios adjacentes, com taxas de erro residual de 19-27% mesmo com RAG), e visão computacional para avanço físico fora de elementos discretos e bem definidos (janelas, armação, painéis) — falha em atividades ambíguas como "segunda demão de tinta". |
| Qual o número de fornecedor mais frágil? | Qualquer claim de ROI/redução-de-tempo publicada só no site do próprio fornecedor sem coautoria acadêmica independente. Ver seção 10 — nenhum dos 6 fornecedores citados no relatório original tem estudo de terceiro publicado. |

---

## 1. Visão computacional — avanço físico de obra

**O que a literatura independente mede:**

Não existe um número único de "acurácia de avanço físico" — a literatura mede tarefas discretas,
cada uma com seu próprio benchmark. Nenhum dos números abaixo vem de meta-análise com intervalo de
confiança formal; são resultados de teste em um único dataset por estudo (típico da área — datasets
de construção são pequenos e não padronizados entre grupos de pesquisa).

| Tarefa | Métrica reportada | Fonte |
|---|---|---|
| Contagem de armação (rebar) via Faster R-CNN | 94,61% AP50 | estudo indexado via revisão (ver limitação abaixo) |
| Volume de obra concluída via imagens de drone (UAV) | ~99% de acurácia | idem |
| Detecção de painéis de madeira (timber panels) | 95% de acurácia | idem |
| Medição de espaçamento de estribos | 98,00% de acurácia | idem |
| Detecção de janelas em diferentes fases da obra | IoU 0,678 (faixa 50-95%) | idem |
| Monitoramento de segurança geral (múltiplas classes) | 85-92% de acurácia em condições normais | idem |
| Proposta de método novo (YOLOv8 real-time) para monitoramento de progresso | precisão/recall/F1 "melhoria significativa" vs. baseline, **sem número absoluto divulgado no abstract acessado** | [Yang et al., 2023 — arXiv:2305.15097](#ref-yang2023) (preprint, não peer-reviewed no momento da consulta) |

**Revisão sistemática de referência:** [Rehman, Shafiq & Ullah, 2022, *Buildings* 12(7):1037](#ref-rehman2022)
(DOI 10.3390/buildings12071037) revisou a literatura de monitoramento de progresso por visão
computacional publicada entre 2011-2021, estruturando o processo em 4 sub-etapas (aquisição de dado,
extração de informação, estimativa de progresso, visualização de saída). **Limitação da minha
pesquisa:** não consegui extrair o texto completo (o fetch retornou binário não decodificável e o
espelho institucional também falhou) — não posso confirmar aqui a faixa agregada de acurácia que a
revisão conclui, nem o número total de estudos cobertos. Uso a citação como ponto de partida
confiável para quem for aprofundar, mas **não cito nenhum agregado numérico dela** por não ter
conseguido verificar o texto.

**Limitação conhecida (comum a todos os estudos acima):**
- Cada número vem de um dataset específico, de um site específico, com câmera/ângulo/iluminação
  controlados pelos próprios pesquisadores. Não há evidência de generalização cross-site.
- Atividades ambíguas ou sem assinatura visual clara — o próprio material da Buildots (fonte não
  independente, mas factualmente descritiva) admite que "segunda demão de tinta" não é detectável
  por visão computacional atual, e isso é consistente com a limitação estrutural da técnica: CV
  detecta *presença/ausência/posição de objeto*, não *qualidade/etapa de um processo sem marca
  visual*.
- Nenhum dos números é sobre o produto comercial citado no relatório original (Buildots, Dusty
  Robotics) — são sobre modelos acadêmicos treinados por pesquisadores em datasets próprios.

**Veredito de maturidade:** produção-pronto para **elementos discretos e visualmente bem definidos**
(armação, painéis, janelas, capacete). Ainda pesquisa para "% de avanço da obra" como métrica
agregada e para atividades sem assinatura visual.

---

## 2. Visão computacional — detecção de EPI (equipamento de proteção individual)

Esta é a aplicação com a base de evidência independente **mais forte e mais replicada** das seis.

**O que a literatura independente mede:**

| Estudo | Método | Resultado | Dataset |
|---|---|---|---|
| [Fang et al., 2018, *Automation in Construction* 85:1-9](#ref-fang2018) | Faster R-CNN, detecção de não-uso de capacete | **90,1% a 98,4%** de acurácia, a depender do cenário; ~0,2s/imagem | >100.000 frames de vídeo de vigilância de longa distância, **25 canteiros diferentes, mais de 1 ano de coleta** — um dos datasets mais robustos da área |
| [Wang, Wu, Yang et al., 2021, *Sensors* 21(10):3478](#ref-wang2021) | Comparação YOLOv3/v4/v5, 6 classes (pessoa, colete, capacete×4 cores) | YOLOv5x: **86,55% mAP** (melhor entre 8 modelos testados); YOLOv3 (3 camadas): 82,65%; YOLOv4 (608×608): 84,84% | Dataset CHV, 1.330 imagens rotuladas (de um pool de ~10.000), 9.209 instâncias |

**Limitação conhecida — explicitamente admitida pelos próprios autores (Wang et al. 2021):**
- Objetos pequenos, obstruídos ou em "gestos estranhos" são difíceis de detectar.
- Borrado de rosto (por privacidade) reduz a acurácia de detecção de cor de capacete em ~7 pontos
  percentuais — ou seja, **há tensão direta entre LGPD/privacidade e acurácia do modelo**, algo
  relevante para qualquer produto brasileiro que precise anonimizar imagem de trabalhador.
- Erros de classificação de cor e falsos positivos (camiseta verde confundida com colete).
- Os autores recomendam expandir o dataset — ou seja, mesmo os melhores números datam de um dataset
  pequeno para os padrões de visão computacional geral (ImageNet tem milhões de imagens; este tem
  1.330).

**Veredito de maturidade:** **pronto para produção** como classe de tecnologia, com ressalva de que
a acurácia real em campo depende de (a) câmera fixa ou capacete com boa resolução, (b) iluminação
adequada, (c) ausência de oclusão pesada, e (d) que qualquer anonimização de imagem para LGPD reduz
a acurácia — trade-off que precisa entrar em qualquer proposta comercial no Brasil.

---

## 3. Quantitativo automático / takeoff

**O que a literatura independente mede:**

Um sistema de QTO (quantity takeoff) automatizado a partir de modelo BIM, validado em projeto real de
infraestrutura no Canadá, identificou **39% de inconsistência em quantidades de material de elementos
de parede** no modelo BIM original (ou seja, o valor da ferramenta aqui foi *achar erro no BIM*, não
só quantificar) e um protótipo de mensuração de estruturas de madeira (wall framings) reportou
**desvio de 0,11% a 0,30%** frente a uma linha de base manual — [fonte indexada via ScienceDirect
S0926580523004156, "Automated system for high-accuracy quantity takeoff using BIM"](#ref-qto2024),
não consegui confirmar autoria e ano exatos por bloqueio de acesso (403); cito a métrica com essa
ressalva.

O caso independente mais forte e mais bem documentado nesta categoria não é sobre quantitativo puro,
mas sobre **takeoff assistido por IA vs. software tradicional**: [Marulanda, Lines, Kassa, Smithwick &
Sullivan — Universidade do Kansas, com revisão de Simplar Foundation, UNC Charlotte e Arizona State
University](#ref-togal-study) compararam Togal.AI a On-Screen Takeoff (OST) em 4-6 projetos-teste
(centro comunitário, reforma, casa unifamiliar, corpo de bombeiros, hotel multi-andar). Resultado:
**~70-71% de economia de tempo**, com **acurácia dentro de margem de 5%** frente ao OST após ajuste
manual.

**Por que este número precisa de ressalva grande, apesar de ter nomes acadêmicos reais assinando:**
- É hospedado **exclusivamente no site da Togal.AI** — não achei DOI, periódico, ou anais de
  conferência formal (tentei ASC/IGLC, sem sucesso dentro do orçamento de busca desta sessão).
- **N = 1 usuário**, sem experiência prévia em nenhuma das duas ferramentas — ou seja, mede curva de
  aprendizado de um único operador, não desempenho populacional.
- Não há divulgação de financiamento no documento — dado que é hospedado pelo próprio fornecedor,
  a hipótese mais provável é patrocínio direto ou indireto da Togal.AI.
- **Classificação:** isto é evidência de **classe B/C com verniz acadêmico** — nomes reais de
  pesquisadores de universidades reais, mas metodologia (n=1) e canal de publicação (site do
  fornecedor, sem peer review formal confirmável) que não sustentam o rótulo "peer reviewed" que o
  próprio material usa no título.

**Veredito de maturidade:** quantitativo a partir de **BIM bem modelado** é tecnicamente maduro
(desvios sub-1% são plausíveis e replicados). Takeoff a partir de **planta 2D/PDF sem BIM** (o caso
mais comum em PME brasileira) tem evidência muito mais fraca — o único dado de acurácia populacional
que encontrei vem do estudo com viés de fornecedor acima.

---

## 4. Previsão de custo e prazo (machine learning)

**Custo:**

| Estudo | Modelo | Erro reportado |
|---|---|---|
| ANN vs. regressão, >300 projetos | ANN | **MAPE 16,6%**, vs. 20,8-27,9% em modelos de regressão |
| Projetos de construção verde (green building) | DNN | MAPE 7% (0,07), melhora para 6% (0,06) com SVR híbrido |
| Framework de deep learning genérico | DNN | **MAPE 11,60%** |
| Modelo híbrido (não especificado) | híbrido | MAPE 0,9-1,5% — **outlier suspeito**: erro tão baixo geralmente indica overfitting ou dataset de treino/teste com vazamento de informação; trato como não confiável sem acesso ao paper completo |

Fontes indexadas via ScienceDirect (S2215098625002149), Springer (10.1007/s42107-023-00980-z), ASCE
*Journal of Construction Engineering and Management* 149(8) (DOI 10.1061/JCEMD4.COENG-13101), e
Tandfonline (10.1080/09613218.2023.2196388) — não consegui abrir texto completo de nenhum (bloqueios
403/paywall); os números acima vêm do abstract/resumo indexado, não de leitura direta da metodologia.
**Isso é uma limitação relevante desta seção — os MAPEs citados não foram verificados quanto a
vazamento de dados entre treino e teste, prática comum e mal controlada nessa literatura.**

**Prazo/atraso:**

| Estudo | Modelo | Resultado |
|---|---|---|
| Dataset Primavera P6 | ML genérico | 83% de acurácia na previsão de atraso |
| Dados de fase de planejamento | XGBoost | 71,45% de acurácia |
| Modelo híbrido | CNN-BiLSTM | 95,56% de acurácia, F1 95,58% |
| [Tian, Chen & Ning — *Advanced Engineering Informatics* (ScienceDirect S1474034625011127)](#ref-tian2025) | Stacking ensemble explicável (SHAP) | **R² = 0,931** |

**Limitação crítica do estudo de Tian, Chen & Ning:** o modelo foi treinado em **992 registros de
processos judiciais na China** — ou seja, a base de dados é litígio já ocorrido, não projetos em
andamento. Isso enviesa o modelo para os fatores que aparecem em disputa legal (componentes
pré-fabricados, mudança de escopo, função do edifício, segundo o SHAP), não necessariamente para os
fatores mais preditivos de atraso em geral. **Um R² de 0,931 em dados de litígio não deve ser lido
como "93% de acurácia prevendo atraso de qualquer obra".**

**Veredito de maturidade:** previsão de custo/prazo por ML é **pesquisa ativa, não produto maduro**.
A variação de erro entre estudos (MAPE de 0,9% a 28%) é grande demais para inspirar confiança em um
número único, e a suspeita de vazamento de dados/overfitting nos casos com erro muito baixo é real e
não descartável sem acesso ao código/metodologia completa. Nenhum estudo demonstrou generalização
cross-país ou cross-mercado — todos são treinados e testados na mesma população de projetos.

---

## 5. RAG documental / LLM em documentos de construção

**Achado principal: não localizei nenhum estudo peer-reviewed medindo especificamente RAG ou LLM
aplicado a documentos de construção civil (contratos, memoriais, RDOs, normas técnicas).** A busca
retornou apenas literatura de domínios adjacentes (saúde/oftalmologia, benchmarks genéricos de RAG).
Uso essa evidência adjacente como *proxy* — mas o produto/mercado (construção) não tem estudo
dedicado que eu tenha encontrado.

**O que a literatura adjacente mede (domínio: perguntas e respostas em saúde, não construção):**

Um estudo com pipeline RAG sobre ~70.000 documentos de oftalmologia, avaliado por 10 profissionais de
saúde em 100 perguntas: **sem RAG**, 45,3% das respostas com referência tinham alucinação, 34,1% erro
menor, 20,6% corretas. **Com RAG**, o quadro melhora mas não resolve: 54,5% corretas, 18,8% alucinação
menor, 26,7% erros — [fonte indexada, PMC12478434](#ref-rag-health), preprint/artigo não totalmente
verificado quanto a peer review formal.

Adicionalmente, o benchmark [CRAG (Comprehensive RAG Benchmark), arXiv:2406.04744](#ref-crag) — este
sim claramente um **preprint** — documenta que sistemas RAG podem não selecionar os documentos
corretos entre os recuperados, deixando evidência alucinada na resposta mesmo com a informação certa
disponível no índice.

**Limitação conhecida:**
- Mesmo com RAG bem implementado em domínio adjacente rigorosamente medido, a taxa de erro residual
  (alucinação + erro) ficou em **~45%** no estudo de saúde citado — um número alto demais para
  aplicação sem revisão humana em qualquer contexto com risco (contratual, normativo, segurança).
- Isso é consistente com a ressalva que o próprio documento-fonte do founder já registra (seção 5 da
  síntese interna): "toda saída com fonte citada; revisão humana antes de sair" — a literatura
  independente **sustenta essa cautela**, não a contradiz.
- **Não encontrei nenhum número específico de acurácia de RAG sobre normas técnicas brasileiras
  (NBR), contratos de obra, ou RDOs.** Se o founder decidir construir isso, a recomendação é medir
  do zero — não há benchmark publicado para importar.

**Veredito de maturidade:** RAG documental é **pesquisa geral madura o suficiente para produto com
revisão humana obrigatória**, mas **sem nenhuma validação específica para o domínio de construção
civil**. Qualquer claim de "IA lê seu contrato e responde com precisão" precisa ser tratada como não
testada até prova em contrário.

---

## 6. Concreto — maturidade e previsão de resistência

**O que a literatura independente mede:**

Modelos de ML (redes neurais, random forest, boosting, gradient boosting) para previsão de resistência
à compressão do concreto reportam consistentemente **R² entre 0,94 e 0,99** e MAPE entre 3,5% e 6%
em múltiplos estudos independentes:

| Estudo | Modelo | Resultado |
|---|---|---|
| Modelo stacked meta-model | ensemble | R² = 0,94, MAPE = 5,95% |
| XGBoost | boosting | R² = 0,983, RMSE = 1,54 MPa, MAPE = 3,47% |
| Modelo genérico (fase de teste) | não especificado | R² = 0,944, MAE = 3,479, RMSE = 4,8173 |

Fontes indexadas via Springer (10.1007/s41024-025-00636-2, 10.1007/s42452-025-07095-x,
10.1007/s41939-024-00609-x), ScienceDirect (S0957417425032713), Frontiers in Materials
(10.3389/fmats.2025.1698248), Nature Scientific Reports (10.1038/s41598-025-22212-x) e PMC
(PMC9167074, PMC11944114) — literatura ampla e consistente, com múltiplos grupos de pesquisa
chegando a números na mesma faixa, o que aumenta a confiança relativa a esta aplicação comparada
às demais.

**O método de maturidade (temperatura × tempo) em si** é uma técnica não-destrutiva estabelecida há
décadas na engenharia de materiais — não é uma inovação de IA; o que a IA adiciona é ajuste do modelo
de previsão em cima dos dados de maturidade, não o princípio físico subjacente.

**Limitação conhecida:**
- Todos os estudos usam datasets de laboratório (misturas controladas), não dados de campo com
  variabilidade real de cura, temperatura ambiente brasileira ou traço regional.
- R² alto em dataset de laboratório **não implica** o mesmo desempenho em concreto de campo com
  agregados locais, aditivos variáveis e cura não controlada — nenhum dos estudos testa
  explicitamente essa transferência.

**Veredito de maturidade:** **tecnicamente madura como princípio (maturidade é método consagrado);
a camada de IA por cima é bem documentada em laboratório**, mas a validação em condições de campo
brasileiras específicas não foi localizada nesta pesquisa.

---

## 7. Contexto macro — produtividade da construção (para calibrar qualquer promessa de ROI)

Dois relatórios do McKinsey Global Institute, de anos diferentes, estabelecem a linha de base contra
a qual qualquer ganho de produtividade prometido por fornecedor de IA deve ser comparado:

- [McKinsey Global Institute, 2017, "Reinventing Construction: A Route to Higher Productivity"](#ref-mckinsey2017):
  produtividade de mão de obra na construção cresceu em média **apenas 1% ao ano** nas duas décadas
  anteriores, contra 2,8% na economia mundial total e 3,6% na manufatura. A produtividade da
  construção nos EUA em 2017 era **menor do que em 1968**.
- [McKinsey, 2026, "How agentic AI is transforming the AEC industry"](#ref-mckinsey2026):
  produtividade da construção cresceu **apenas 10% entre 2000-2022** (0,4% ao ano), contra 90% (3,0%
  ao ano) na manufatura no mesmo período. O mesmo relatório projeta um potencial de **US$228 bilhões**
  de valor anual desbloqueável nos EUA até 2030 via IA e automação, e ~US$126 bilhões na Europa —
  **isto é uma projeção/estimativa de potencial, não um resultado medido.**

**Como usar isto:** qualquer caso de fornecedor que implique "sua obra vai virar manufatura" contradiz
25 anos de dado histórico consistente mostrando estagnação estrutural. Ganhos pontuais e localizados
(um RDO mais rápido, uma detecção de EPI automatizada) são plausíveis e documentados; um salto de
produtividade agregada da obra não tem precedente histórico e a IA generativa/CV ainda não mudou essa
curva macro nos dados disponíveis até 2022.

---

## 8. Adoção real, fracasso e expectativa calibrada

Esta seção é o contrapeso mais importante do documento — respondendo diretamente ao pedido "estudos
que mediram fracasso ou ganho abaixo do prometido".

**Adoção (RICS, 2025 — pesquisa institucional, n=2.200+ profissionais, 48% Reino Unido, 19% Ásia-Pacífico,
14% Oriente Médio/África, 10% Américas, 8% Europa):**
[RICS, "Artificial Intelligence in Construction Report 2025"](#ref-rics2025) — **45% das organizações
não usam IA de forma alguma**, 34% estão em piloto inicial, apenas 12% usam IA regularmente em
processos específicos, e **menos de 1% têm IA embutida em múltiplos processos**. Maiores barreiras:
falta de pessoal qualificado (46%), integração com sistemas existentes (37%), qualidade de dado (30%),
custo de implementação (29%), **ROI incerto (28%)**. O relatório não traz nenhuma métrica de acurácia
de ferramenta específica — mede só sentimento e adoção.

**Fracasso documentado em campo (estudo etnográfico, 18 meses, canteiro chinês de incorporadora
Fortune 500):**
[Song & Song, *Organization Studies*, 2026 (DOI 10.1177/01708406251362917)](#ref-song2026) —
resumido via LSE Business Review, não consegui acessar o texto completo do periódico (403,
provavelmente paywall da SAGE). Segundo o resumo da LSE: a implantação de uma plataforma de
"engenharia digital" exigiu medições físicas intensivas (verticalidade de parede, espessura de laje,
tamanho de janela) dos próprios trabalhadores, gerando fadiga física severa relatada em entrevista
("não sinto mais as pernas e a cintura"), aumento de carga de trabalho **sem redução proporcional de
trabalho manual**, criação de gambiarras (workarounds) para simular conformidade com o sistema, e
erosão de confiança na liderança. O artigo também cita, de fontes de mercado (não do próprio estudo):
taxa de fracasso de transformação digital >70% (McKinsey), 60% dos funcionários sem apoio a mudança
organizacional (Gartner), apenas 30% das transformações atingindo o valor-alvo (BCG), e **95% dos
pilotos de IA generativa fracassando** (MIT — citação de terceira mão via o artigo da LSE, não
verifiquei o relatório MIT original nesta sessão).

**Revisão PRISMA sobre barreiras de adoção:**
["Opportunities and Adoption Challenges of AI in the Construction Industry: A PRISMA Review",
ScienceDirect S219985312201054X](#ref-prisma2022) — não consegui acessar o texto completo (403);
cito apenas o título e a existência do artigo como revisão sistemática formal (metodologia PRISMA),
sem poder confirmar aqui o número de estudos incluídos.

**Como isto calibra expectativa:** o padrão que emerge de três fontes independentes (RICS, Song &
Song, e a própria literatura de digital transformation) é: **a tecnologia funciona melhor em
laboratório/piloto controlado do que em rollout real**, e o ponto de fricção não é a acurácia do
modelo — é a carga de trabalho extra imposta ao trabalhador de campo e a ausência de redução real de
esforço manual. Isso reforça diretamente o insight já registrado no documento-fonte interno: "a
economia de tempo só é benefício financeiro quando a capacidade liberada é utilizada" — e a evidência
de campo sugere que, sem desenho cuidadoso, a capacidade não é liberada, é **substituída por outro
tipo de trabalho** (inserir dado manualmente para o sistema).

---

## 9. Evidência brasileira

**Achado principal: a produção acadêmica brasileira dedicada especificamente a "IA + construção civil"
é ainda escassa e recente**, concentrada em trabalhos de congresso (CONTECC) mais do que em periódicos
indexados com peer review pesado, e não encontrei nenhuma dissertação de mestrado ou tese de
doutorado de USP/UNICAMP/UFRGS/UFSC que combine visão computacional + canteiro de obras + validação
quantitativa dentro do orçamento de busca desta sessão.

- [CONTECC 2024 — "Aplicações Avançadas de Inteligência Artificial na Construção Civil: Tecnologias
  Emergentes, Benefícios Operacionais e Desafios de Implementação"](#ref-contecc2024), publicado nos
  anais do Congresso Técnico Científico da Engenharia e da Agronomia (CONFEA/CREA). **Não consegui
  extrair autoria, metodologia nem os números exatos** — o PDF retornou apenas binário não
  decodificável nas duas tentativas de fetch, e a busca por autoria via web não retornou nome. Isto é
  relevante porque o documento-fonte original do founder classifica um número de "~98% de redução no
  tempo de orçamento preliminar" como vindo do "CONTECC" e como **evidência classe A (acadêmica)** —
  **eu não consegui verificar essa classificação nesta sessão.** Recomendo tratar esse número como
  não confirmado até acesso direto ao PDF ou aos anais completos do CONTECC 2024/CIV.
- USP mantém um programa de mestrado profissional dedicado a inovação em construção civil
  ("ConstruInova", ligado ao Departamento de Engenharia de Construção Civil da Escola Politécnica),
  confirmando existir estrutura acadêmica ativa na área — mas não localizei um trabalho específico
  sobre visão computacional em canteiro nesse programa.
- UFRGS tem produção ativa em processamento de imagem e visão computacional (PPGC), mas não achei
  cruzamento direto com construção civil nos resultados retornados.
- Não localizei trabalhos de ENTAC ou SIBRAGEC especificamente sobre IA/visão computacional em obra
  dentro do escopo desta busca — **isso não significa que não existam; significa que minha busca não
  os encontrou no tempo disponível.** Recomendo busca direta no repositório de anais do ENTAC
  (geralmente hospedado em antaceventos.com.br ou similar) como próximo passo, fora do escopo desta
  sessão.

**Veredito:** a lacuna de evidência brasileira dedicada é, ela mesma, uma informação estratégica —
sugere que **quem construir e medir isso no Brasil primeiro cria vantagem de dados** que hoje não
existe publicamente, mesmo os fornecedores internacionais citados no relatório original operando
majoritariamente com dados de obra americana/europeia/israelense (Buildots é israelense).

---

## 10. Verificação cruzada dos casos citados no relatório original

| Caso citado no documento-fonte | O que busquei | O que achei |
|---|---|---|
| Buildots — redução de atraso | Validação acadêmica independente | **Não localizada.** Só material do próprio site do fornecedor ("redução de até 50% em atraso, 2-3 meses em projeto médio") e um artigo acadêmico genérico (Yang et al. 2023) que não testa o produto Buildots. |
| ALICE Technologies | Validação acadêmica independente | **Não localizada** no escopo desta busca. |
| Dusty Robotics | Validação acadêmica independente | **Não localizada** no escopo desta busca. |
| Converge | Validação acadêmica independente | **Não localizada** no escopo desta busca. |
| Togal.AI (quantitativo/takeoff) | Validação independente | **Parcialmente localizada** — ver seção 3. Nomes acadêmicos reais, mas n=1, hospedado só no site do fornecedor, sem DOI/periódico confirmado. Trato como evidência fraca, não como confirmação. |
| Trunk Tools | Validação acadêmica independente | **Não localizada** no escopo desta busca. |
| Andrade Gutierrez — 27 dias de cronograma recuperados | Fonte primária / validação independente | Não re-verifiquei nesta sessão (fora do escopo desta busca, que focou em achar contraponto acadêmico, não auditar o caso original). O documento-fonte já classifica isto como classe B/C (divulgado por cliente/fornecedor). Concordo com essa classificação com base no padrão geral que observei: casos publicados por cliente/fornecedor consistentemente carecem de metodologia de medição divulgada. |
| NCC — −70% tempo de relatório manual | idem | idem — mesma ressalva. |
| Cleveland — 790h / US$60 mil em revisão documental | idem | idem — mesma ressalva. |
| CONTECC — ~98% redução em orçamento preliminar | Confirmação da fonte acadêmica exata | **Não confirmada nesta sessão** — ver seção 9. O documento original marca isto como classe A; eu não consegui nem confirmar nem refutar dentro do tempo/orçamento de busca disponível. |

**Conclusão desta seção:** de 9 casos numéricos citados no relatório original (6 fornecedores + 3
casos de cliente + 1 acadêmico), **nenhum** foi confirmado por uma fonte de terceiro independente
dentro desta pesquisa. Isso não prova que os números sejam falsos — prova que **são não verificados
publicamente**, o que é exatamente a categoria de risco que o documento-fonte já havia sinalizado
("comprar provider" / "classe B ou C" na síntese interna). A recomendação operacional não muda: tratar
todo número de fornecedor como indicação de potencial, nunca como promessa, e desenhar o piloto do
founder para medir o antes/depois próprio — que é exatamente o que a seção 14 do documento original já
recomenda, e que esta pesquisa reforça com evidência externa.

---

## 11. Lacunas explícitas desta pesquisa

- Orçamento de busca da sessão esgotou (limite compartilhado de 200 buscas) antes de eu confirmar a
  citação exata do CONTECC 2024 e antes de buscar por publicações de ASC/IGLC sobre o estudo
  Togal.AI/Kansas.
- Cerca de 40% dos PDFs/páginas que tentei abrir via fetch direto retornaram 403 (paywall) ou binário
  não decodificável (sem OCR local disponível neste ambiente) — nesses casos usei o resumo indexado
  pela busca, não o texto completo. Marquei cada ocorrência explicitamente acima.
- Não localizei nenhuma revisão sistemática ou meta-análise formal (com intervalo de confiança
  agregado) para nenhuma das 6 aplicações — a literatura de IA em construção ainda não amadureceu a
  ponto de ter meta-análises Cochrane-style. Todos os números de acurácia citados são de estudos
  primários individuais, não agregados estatisticamente.
- Não localizei nenhum relatório do NIST especificamente dedicado a IA na construção (NIST tem
  programas ativos de benchmarking de robótica/IA em manufatura geral, mas não achei um relatório
  setorial de construção civil).
- O relatório Fraunhofer IAO "KI in der Bauwirtschaft" (~2021, série "Lernende Systeme") foi
  localizado mas não fetchado em texto completo — cito como referência institucional existente, não
  como fonte de número específico.

---

## 12. Referências completas

<a id="ref-fang2018"></a>**Fang, W., Ding, L., Zhong, B., Love, P.E.D., Luo, H. (2018).** "Detecting
non-hardhat-use by a deep learning method from far-field surveillance videos." *Automation in
Construction*, 85, 1-9. Acesso via QUT ePrints / PolyU Scholars Hub.

<a id="ref-wang2021"></a>**Wang, Z., Wu, Y., Yang, L., Thirunavukarasu, A., Evison, C., Zhao, Y.
(2021).** "Fast Personal Protective Equipment Detection for Real Construction Sites Using Deep
Learning Approaches." *Sensors*, 21(10), 3478. DOI: 10.3390/s21103478. Disponível em
https://pmc.ncbi.nlm.nih.gov/articles/PMC8156681/

<a id="ref-rehman2022"></a>**Rehman, M.S.U., Shafiq, M.T., Ullah, F. (2022).** "Automated Computer
Vision-Based Construction Progress Monitoring: A Systematic Review." *Buildings*, 12(7), 1037. DOI:
10.3390/buildings12071037. Texto completo não verificado nesta sessão (bloqueio de acesso).

<a id="ref-yang2023"></a>**Yang, J., Wilde, A., Menzel, K., Sheikh, M.Z., Kuznetsov, B. (2023).**
"Computer Vision for Construction Progress Monitoring: A Real-Time Object Detection Approach."
**Preprint**, arXiv:2305.15097. Não confirmado como peer-reviewed publicado no momento da consulta.

<a id="ref-qto2024"></a>**Autoria não confirmada (2023/2024).** "Automated system for high-accuracy
quantity takeoff using BIM." *Automation in Construction* (ScienceDirect, ID S0926580523004156).
Texto completo não acessado (403) — autoria e ano exatos não confirmados nesta sessão.

<a id="ref-togal-study"></a>**Marulanda S., V.V., Lines, B., Kassa, R., Smithwick, J., Sullivan, K.**
"Togal.AI vs On-Screen Takeoff: A Comparative Analysis of Time Efficiency and Accuracy." Hospedado em
togal.ai/case-study — **sem DOI ou periódico/conferência formal confirmado**. Autores afiliados a
University of Kansas, Simplar Foundation, University of North Carolina at Charlotte, Arizona State
University. Tratar como evidência de credibilidade média (autores acadêmicos reais, mas metodologia
n=1 e canal de publicação controlado pelo fornecedor).

<a id="ref-tian2025"></a>**Tian, Y., Chen, Y., Ning, Y. (2025).** "Identifying and predicting delay
risks in prefabricated construction: an explainable ensemble learning approach." *Advanced
Engineering Informatics* (ScienceDirect, ID S1474034625011127). Publicado dez/2025. Dataset: 992
registros de processos judiciais na China.

<a id="ref-mckinsey2017"></a>**McKinsey Global Institute (2017).** "Reinventing Construction: A Route
to Higher Productivity." McKinsey & Company, fevereiro 2017.
https://www.mckinsey.com/capabilities/operations/our-insights/reinventing-construction-through-a-productivity-revolution

<a id="ref-mckinsey2026"></a>**McKinsey & Company (2026).** "How agentic AI is transforming the AEC
industry." https://www.mckinsey.com/industries/engineering-construction-and-building-materials/our-insights/how-ai-is-reshaping-the-future-of-the-aec-industry

<a id="ref-rics2025"></a>**Royal Institution of Chartered Surveyors — RICS (2025).** "Artificial
Intelligence in Construction Report 2025." Publicado 12/set/2025. Pesquisa com >2.200 profissionais
globais. https://www.rics.org/news-insights/artificial-intelligence-in-construction-report

<a id="ref-song2026"></a>**Song, J., Song, L. (2026).** Artigo em *Organization Studies* sobre
implementação de plataforma de "engenharia digital" em canteiro chinês. DOI:
10.1177/01708406251362917. Texto completo não acessado nesta sessão (paywall SAGE, 403) — informação
via resumo publicado em LSE Business Review (18/mar/2026):
https://blogs.lse.ac.uk/businessreview/2026/03/18/the-story-of-one-failed-digital-transformation/

<a id="ref-prisma2022"></a>**Autoria não confirmada.** "Opportunities and Adoption Challenges of AI in
the Construction Industry: A PRISMA Review." *International Journal of Information Management Data
Insights* (ScienceDirect, ID S219985312201054X). Texto completo não acessado (403).

<a id="ref-contecc2024"></a>**Autoria não confirmada (2024).** "Aplicações Avançadas de Inteligência
Artificial na Construção Civil: Tecnologias Emergentes, Benefícios Operacionais e Desafios de
Implementação." Anais do CONTECC 2024, área CIV, CONFEA/CREA. PDF: confea.org.br (texto não
extraível nesta sessão — binário sem OCR local).

<a id="ref-rag-health"></a>**Autoria não confirmada.** Estudo de caso RAG em perguntas e respostas de
saúde do consumidor em oftalmologia. PMC12478434. Domínio adjacente (saúde, não construção) — usado
aqui apenas como proxy de taxa de alucinação com/sem RAG.

<a id="ref-crag"></a>**Yang, X. et al.** "CRAG — Comprehensive RAG Benchmark." **Preprint**,
arXiv:2406.04744.

**Fraunhofer IAO.** "KI in der Bauwirtschaft — Einsatzmöglichkeiten für Planung, Realisierung und
Betrieb von Bauwerken." Série "Lernende Systeme", ~2021. PDF:
https://www.iuk.fraunhofer.de/content/dam/iuk/whitepapers/de/iao/2021_IAO_ST_KI%20in%20der%20Bauwirtschaft_DE.pdf
— citado como referência institucional, texto completo não fetchado nesta sessão.

---

## Nota de transparência final

Este documento segue a regra de "número que não fecha, não entra": onde a busca não confirmou autoria,
ano, ou metodologia com segurança suficiente, isso está marcado explicitamente no corpo do texto e nas
referências ("não confirmado", "não localizado", "texto completo não acessado"). Nenhuma citação,
DOI ou dado numérico acima foi inventado — todos vêm de resultado de busca ou fetch retornado pelas
ferramentas desta sessão, com o nível de confiança correspondente disclosed caso a caso.

— Atlas, investigando a verdade 🔎
