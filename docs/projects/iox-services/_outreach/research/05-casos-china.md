# IA e automação na construção civil na China — o que é rotina, o que é hype

**Data:** 01/Ago/2026 · **Autor:** Atlas (@analyst) · **Escopo:** construção civil na China — regulação, robótica, modular/pré-fabricação, impressão 3D, estatais, visão computacional, BIM, e o efeito da crise imobiliária.

## Disciplina de evidência usada neste documento

Cada afirmação relevante é marcada:

- **A** — fonte acadêmica, governamental primária, ou imprensa independente com apuração própria (Reuters, Caixin, SCMP, NPR, artigo peer-reviewed, documento oficial `.gov.cn`).
- **B** — divulgado pela empresa-cliente (a incorporadora/construtora que usou a tecnologia) ou por órgão público repassando case de terceiro sem auditoria independente.
- **C** — divulgado pelo próprio fornecedor da tecnologia (site institucional, LinkedIn, imprensa setorial que reproduz release).

Números de fonte estatal chinesa ou de empresa listada em bolsa chinesa entram com ceticismo explícito — não porque sejam necessariamente falsos, mas porque não há auditoria independente acessível daqui. Quando um número não fecha ou não pude confirmar, digo isso abertamente em vez de arredondar.

---

## 1. 智慧工地 (canteiro inteligente) vs. 智能建造 (construção inteligente) — são duas coisas diferentes, e isso muda a leitura

A pesquisa partiu da hipótese de que existe *um* programa regulatório chinês obrigando "canteiro inteligente". Na prática são **dois programas com naturezas distintas**, e misturá-los é o erro mais fácil de cometer:

### 1.1 O que é genuinamente obrigatório nacionalmente (não depende de piloto)

**Registro nominal (实名制) de trabalhador da construção.** Portaria conjunta MOHURD + Ministério de Recursos Humanos, nº 建市〔2019〕18号, de fevereiro de 2019: todo trabalhador de obra habitacional ou de infraestrutura municipal no país tem que ser cadastrado nominalmente, com contrato de trabalho assinado, e a obra precisa manter conta de salário segregada (conta-escrow) vinculada a esse cadastro. O sistema está amarrado à emissão do alvará de obra — sem cadastro, sem liberação. Isso é **[A]**, texto oficial: [gov.cn — 建市〔2019〕18号](https://www.gov.cn/zhengce/zhengceku/2019-09/29/content_5434579.htm). A OIT documenta que, nos 8 meses seguintes à regulação de pagamento de salário de 2019, o número de trabalhadores cadastrados no sistema quase dobrou — **[A]**: [ILO — guaranteed wage payments](https://www.ilo.org/media/376116/download).

Isso é o item mais forte de "rotina lá, impensável aqui": no Brasil o eSocial rastreia vínculo formal, mas não existe um sistema nacional que amarre **liberação de alvará de obra** a **cadastro biométrico do trabalhador + conta de salário segregada**. É controle de fraude trabalhista feito na infraestrutura de licenciamento, não em fiscalização a posteriori.

**Monitoramento de guindaste-torre ("caixa-preta").** Norma nacional GB/T 37366-2019 padroniza o sistema de monitoramento e transmissão de dados de guindastes-torre — **[A]**: [padrão nacional, std.samr.gov.cn](https://std.samr.gov.cn/gb/search/gbDetailed?id=71F772D77AACD3A7E05397BE0A0AB82A). A aplicação prática é reforçada província a província: Guangdong, por exemplo, proíbe explicitamente que guindaste-torre sem esse sistema instalado entre em canteiro habitacional ou municipal — **[A]**: [aviso oficial da Secretaria de Habitação de Guangdong](http://zfcxjst.gd.gov.cn/xxgk/wjtz/content/post_4459604.html). Isso é mais próximo de "table stake" de segurança do que de "IA" — é telemetria com alarme automático de sobrecarga/colisão — mas é exatamente o tipo de coisa que no Brasil ainda é opcional e vendido como diferencial premium.

**Controle de poeira/emissão em obra.** O art. 69 da Lei de Prevenção e Controle da Poluição do Ar exige plano de controle de poeira aprovado antes do início da obra, mas **não achei confirmação independente de que sensor de PM2,5 em tempo real seja obrigatório nacionalmente** — a legislação central fala em plano e responsabilização, a fiscalização por sensor parece ser prática municipal/de licitação, não lei federal. Marco isso como incerto — não vou apresentar como fato nacional obrigatório.

### 1.2 O que é piloto guiado, não mandato nacional

O programa de **24 cidades-piloto de construção inteligente (智能建造试点城市)**, lançado pelo MOHURD, é um piloto de 3 anos (2022–2024) com incentivo de política pública — pesquisa, financiamento, formação de mão de obra — e **não impõe obrigatoriedade regulatória formal**; ele orienta as cidades a "promover efetivamente tarefas piloto" — **[A]**: [comunicado oficial MOHURD sobre desempenho 2023](https://www.gov.cn/zhengce/zhengceku/202406/content_6958371.htm), [lista das 24 cidades](https://www.planning.org.cn/law/view_news?id=13267). No relatório de 2023, 8 das 24 cidades (Shenzhen, Suzhou, Wuhan, Hefei, Guangzhou, Changsha, Wenzhou, Taizhou) tiveram desempenho destacado; as outras 16 "cumpriram satisfatoriamente" — linguagem de avaliação de piloto, não de conformidade legal.

**Conclusão para quem está desenhando produto no Brasil:** o que é de fato "lei" na China é infraestrutura de conformidade trabalhista e de segurança de equipamento pesado (cadastro + telemetria de guindaste), não "canteiro cheio de câmera de IA". A parte de câmera/visão computacional (seção 6) é mercado de fornecedor comprando pacote comercial — cresceu muito, mas por adoção de mercado dentro de um piloto incentivado, não por lei federal genérica de "canteiro inteligente".

Custo de um pacote comercial de 智慧工地 (câmera + reconhecimento facial + monitoramento ambiental + monitoramento de guindaste, tudo junto): projetos pequenos ficam na casa de ¥100.000–200.000 (~R$78 mil–156 mil), projetos grandes passam de ¥500.000 (~R$390 mil) — **[C]**, blogs de integrador/fornecedor, tratar como faixa indicativa, não preço de tabela: [CSDN](https://blog.csdn.net/bjmdkj/article/details/126581023), [Sohu](https://m.sohu.com/a/864075560_121166875/?pvid=000115_3w_a), [Safeway](https://www.safewaynt.com/news/20220921153513234.html). Componente isolado de reconhecimento facial de acesso: a partir de ¥1.000 (~R$780) o equipamento; câmera de monitoramento em vídeo completa: ¥50.000–200.000 (~R$39 mil–156 mil).

---

## 2. Robótica de construção — Bright Dream Robotics / Country Garden (博智林 / 碧桂园)

Este é o caso mais citado no Ocidente e o que mais precisa de ceticismo, porque a empresa-mãe (Country Garden) é o epicentro da crise imobiliária chinesa.

**Histórico verificável de números divulgados pela própria empresa (série temporal, todos [B]/[C]):**

| Momento | Número declarado | Fonte |
|---|---|---|
| Set/2020 | Primeiro lote: 43 robôs, 9 tipos, entregues | [C] press chinesa da época |
| Meados 2022 | 26 tipos comercializados, >500 projetos, 28 províncias, >1.100 unidades entregues, >10 milhões m² de área construída | [B] [21jingji](https://www.21jingji.com/article/20230621/herald/3421abaef276b31d3264897ef1ca3a61.html), [chnfund](https://www.chnfund.com/article/AR2022033110595968804867) |
| Jan/2023 | 33 tipos comercializados | [C] press setorial |
| Data não confirmada (provavelmente 2024–2025, página institucional sem data clara) | >5.200 unidades entregues cumulativas, >900 projetos, expansão para Hong Kong, Macau, Malásia e Cingapura, 28 tipos comercializados + ~50 em desenvolvimento | [C] [Baidu Baike EN](https://baike.baidu.com/en/item/Bright%20Dream%20Robotics/67543) — **atenção: essa página mistura "28 tipos comercializados" com a série de 2022, que já dizia 26; a consistência interna dos números da própria empresa é fraca** |

Não encontrei nenhuma reportagem de imprensa independente (Reuters, Bloomberg, SCMP, Caixin) auditando in loco a taxa de utilização real desses robôs — ou seja, quantos das 5.200+ unidades "entregues" estão de fato em operação frequente versus paradas. Essa é uma lacuna real da pesquisa, não uma afirmação minha.

**Sinal indireto e mais confiável de contração:** dado de headcount agregado (via scraping de LinkedIn/SignalHire, portanto **[C]**, tratar como indicativo) mostra o quadro de funcionários da Bright Dream Robotics caindo de ~38 (dez/2021) para 25 (abr/2024) — [Crustdata](https://profiles.crustdata.com/company/guangdong-bright-dream-robotics). É pouca gente para uma empresa que alega ter entregado mais de 5.000 robôs; ou o quadro de produção está em outra entidade jurídica do grupo, ou o headcount reportado está incompleto — não dá para concluir com o dado disponível.

**Caso com número mais crível, por vir de fonte governamental terciária, não da própria Country Garden:** projeto Nanjing Financial City Fase II implantou 20 robôs de construção e reduziu o cronograma em 2,5 meses — **[B]**, reproduzido pela Secretaria de Habitação de Guangdong como case exemplar do programa-piloto: [zfcxjst.gd.gov.cn](https://zfcxjst.gd.gov.cn/jsgl/dtxx/content/post_4362774.html). A mesma página cita outro número — "~5% de redução de custo, ~8% de redução de mão de obra, ~10% de redução de material" em um "projeto global" sem nome — **esse número específico eu não uso como fato, porque não há projeto identificável nem fonte auditável por trás dele**.

**A crise imobiliária bateu na empresa-mãe, e isso é fato duro, não especulação [A]:** Country Garden entrou em crise de dívida severa em 2023–2024; a Reuters visitou canteiros da Country Garden em Tianjin e encontrou obras parcial ou totalmente paradas (reportagem replicada via [Malay Mail](https://www.malaymail.com/news/money/2023/08/23/unpaid-workers-silent-sites-chinas-property-woes-hit-country-garden/86697)). O sinal mais concreto de mudança de estratégia: a Country Garden Services (braço de administração predial, listado separadamente, menos exposto à dívida da incorporadora) lançou em out/2025 uma **nova** divisão de robótica — não é mais a Bright Dream Robotics de construção, é robôs de limpeza pós-obra — com 130 unidades operando em grandes cidades chinesas e meta de 1.000 até o fim de 2025 — **[A]**, jornalismo financeiro independente: [Caixin, 22/out/2025](https://www.caixinglobal.com/2025-10-22/country-garden-services-rolls-out-cleaning-robots-to-tackle-rising-labor-costs-102374498.html). Ler isso como: o capital recuou do robô de canteiro (CAPEX alto, ligado à obra nova, que sumiu) para robô de manutenção recorrente (ligado à receita de condomínio, que continua existindo mesmo com a incorporadora em concordata).

**Contexto de bolha no setor de robótica chinês como um todo [A]**, útil para calibrar ceticismo: a Caixin e o SCMP relatam boom de investimento em robótica (US$4,2 bilhões só em 2026) sem lucratividade correspondente; a NDRC (Comissão Nacional de Desenvolvimento e Reforma) alertou publicamente sobre "excesso de hype" com mais de 150 empresas fazendo robôs quase idênticos — [Caixin, 30/jul/2025](https://www.caixinglobal.com/2025-07-30/commentary-chinas-humanoid-hype-faces-a-reality-check-102346941.html), [SCMP](https://www.scmp.com/tech/big-tech/article/3351817/hype-or-real-cash-flow-chinas-robot-boom-faces-reality-check-commercialisation-lags), [Caixin, 02/mar/2026](https://www.caixinglobal.com/2026-03-02/opinion-chinas-robot-sector-needs-cool-heads-not-hype-102418547.html). **Ressalva importante:** essa cobertura é majoritariamente sobre robôs humanoides de uso geral, uma categoria diferente dos robôs de tarefa única da Bright Dream (ladrilhador, pintor, rebocador). Não dá para transportar a conclusão de "bolha" 1:1 para robótica de construção especificamente — mas o clima de ceticismo institucional (inclusive do próprio governo chinês) sobre a distância entre anúncio e caixa é real e relevante.

---

## 3. Construção modular / pré-fabricação — Broad Group

**A fonte mais confiável encontrada não é chinesa nem é a própria empresa — é a análise técnica independente de Brian Potter (Construction Physics), engenheiro que auditou números do Broad Group cruzando fontes primárias [A-equivalente, blog técnico com apuração própria]:** [construction-physics.com — Broad Group Part II](https://www.construction-physics.com/p/broad-group-part-ii).

Pontos que essa análise estabelece, e que quebram o mito de "a China ergue prédio em dias, rotina":

- A **Broad Sustainable Building** (a divisão famosa pelos vídeos de "hotel de 30 andares em 15 dias") tinha, até a data da análise, **menos de 40 edifícios construídos** usando seus sistemas de montagem rápida — a maioria são edifícios de teste no próprio campus da empresa, não obras comerciais vendidas a terceiros.
- A Broad Sustainable Building **nunca deu lucro em nenhum projeto**, segundo a apuração do autor.
- Os preços divulgados pela empresa (~US$86/pé² para o sistema B9-24) provavelmente subestimam custo de transporte — o autor recalcula para ~US$115–130/pé² incluindo frete até Shanghai/Los Angeles, e chama as taxas de transporte divulgadas de "extremamente otimistas".
- Veredito do autor: a Broad "provavelmente não vai transformar a indústria da construção", apesar de vantagens estruturais reais do sistema.

**O que é diferente e de fato lucrativo dentro do mesmo grupo:** a **Broad Homes**, divisão irmã (concreto pré-moldado convencional, não o sistema modular-container espetacular), tem margem acima de 30%, é a maior fabricante de pré-moldado de concreto da China (13% de market share), com 15 fábricas próprias grandes + 85 joint-ventures + 16 plantas internacionais adicionais — **[B]**, dados repassados pela mesma análise citando fontes da empresa. **A lição aqui é metodológica:** a parte "viral" (containers dobráveis, 30 andares em 15 dias) não é a parte que dá dinheiro; a parte chata (pré-moldado convencional em escala industrial) é.

**Projetos internacionais recentes, mais verificáveis por terem cliente estrangeiro nomeado:**
- Jindu Residential Tower, 26 andares, concluída em 5 dias, jan/2024 — **[B/C]**, cobertura de associação setorial de modular ([modular.org](https://www.modular.org/2024/01/24/26-stories-in-5-days-broad-group-jindu-tower/)), sem apuração independente de terceiros visitando o canteiro.
- Earth Tower, Abu Dhabi, 16 andares: 259 módulos fabricados em 30 dias, içados e instalados em 96 horas — parceiro é a Eagle Hills, incorporadora real de Abu Dhabi ligada à Vision 2031 dos Emirados — **[B]**, mais crível por ter contraparte internacional identificável e verificável: [Built Offsite](https://builtoffsite.com.au/news/broad-group-completes-modular-earth-tower-in-abu-dhabi/).

---

## 4. Impressão 3D de concreto — WinSun e sucessores

**Achado central: a WinSun nunca foi, no sentido estrito, "impressão 3D no canteiro".** As paredes/painéis são impressos em fábrica (planta em Suzhou, impressora de ~150 m de comprimento) e depois **montados** no local, como um sistema de pré-fabricação — vários pesquisadores argumentam explicitamente que isso não deveria ser chamado de impressão 3D de fato — **[A]**, discussão acadêmica citada por múltiplas fontes técnicas.

**Acusação de propriedade intelectual [A], relevante para credibilidade da empresa:** Behrokh Khoshnevis, professor da USC creditado como criador da técnica "Contour Crafting" (a base acadêmica da impressão 3D de concreto), acusou publicamente a WinSun de ter copiado sua técnica patenteada — reportagem investigativa: [3DPrint.com — "Faking" Their 3D Printed Homes](https://3dprint.com/57764/winsun-3d-print-fake/). A empresa também não permite inspeção externa de sua máquina/processo, o que dificulta verificação.

**O marco de 2014 ("10 casas em 24 horas")** que virou viral no Ocidente segue exatamente o padrão acima: painéis pré-fabricados montados rapidamente, não impressão contínua no terreno.

**Status atual (2024–2025):** a empresa relançou operação nos EUA sob a marca "Gaudi Tech" em março de 2024, perseguindo projetos residenciais americanos — **[C]**, cobertura setorial: [3DPrint.com](https://3dprint.com/308092/winsun-is-back-as-gaudi-tech-and-its-3d-printing-houses-in-the-u-s/). Fez um edifício de escritório impresso em Dubai em 2023. **Não encontrei nenhuma evidência de que a impressão 3D de concreto tenha virado produção industrial recorrente dentro da China** — permanece tecnologia de demonstração/exportação, não rotina de canteiro chinês. Isso é um contraste importante com a robótica de tarefa (seção 2): a China industrializou robô de rebocar parede, mas não industrializou impressão 3D estrutural — mesmo tendo sido pioneira em divulgação.

---

## 5. Estatais gigantes — CSCEC, China Railway, CCCC

**CSCEC (China State Construction Engineering Corporation)** é a maior construtora do mundo por receita (Fortune Global 500, top ~50). Um único departamento (CSCEC 3ª Bureau) aplicou a metodologia DPTA (Design-Pré-fabricação-Transporte-Montagem, sigla em inglês) em mais de 200 projetos, com 60+ patentes associadas — **[B]**, fonte corporativa/imprensa setorial: [ResearchGate — CSCEC BIM case](https://www.researchgate.net/publication/375800175_Building_Tomorrow_CSCEC_BIM's_Symphony_of_Success_in_Digital_Transformation), [Umbrex](https://umbrex.com/resources/strategy-of-the-fortune-500/strategy-of-china-state-construction-engineering/). Um único departamento da CSCEC (8ª Bureau) emprega cerca de 3.000 engenheiros de BIM — escala que nenhuma construtora brasileira de médio porte tem como replicar; é força-tarefa de estatal, não ferramenta de escritório pequeno.

**Caso-bandeira: Estação Ferroviária de Xiong'an.** A estação, considerada a maior da Ásia (~5,1 milhões de pés², telhado com 452.000 pés² de painel solar gerando ~5,8 milhões de kWh/ano), foi construída em cerca de 2 anos e inaugurada em **dezembro de 2020** — a CSCEC usou robôs automáticos de solda na estrutura metálica para padronizar o processo de soldagem — **[B]**, cobertura setorial da época: [Xinhua/okdiario reprint](https://okdiario.com/techy/en/china-built-asias-largest-rail-station-in-two-years-with-5-1-million-ft-%C2%B2-and-welding-robots-setting-the-pace/5164/).

**⚠️ Nota de higiene de evidência, relevante para quem for reusar este material:** essa mesma história de Xiong'an (evento de 2018–2020) está sendo republicada como se fosse notícia nova por uma rede de sites de conteúdo de baixa qualidade em 2026 (okdiario, ecoticias, vozpopuli, clickpetroleoegas — todos com o mesmo texto reescrito por IA, aparecendo em buscas recentes). É um exemplo prático do próprio risco que este documento tenta evitar: número real, mas datado, ressuscitado sem contexto temporal para parecer atual. Trato o fato (robô de solda em Xiong'an) como real, mas a "novidade" como falsa.

**China Railway / CRCC — tuneladoras (TBM).** Em mar/2026 saiu de linha em Nantong a "Fenji" (奋进号), tuneladora de diâmetro ultra-grande (14m classe), controlável remotamente, com monitoramento em tempo real de componentes-chave, para o túnel do Rio Yangtze da ferrovia de alta velocidade Yancheng-Yixing — **[A]**, fonte oficial SASAC (órgão de supervisão de estatais): [en.sasac.gov.cn](http://en.sasac.gov.cn/2026/04/16/c_20651.htm). Universidade de Hunan, em parceria com a China Railway Construction Heavy Industry, desenvolveu sistema operacional inteligente para TBM ("cérebro inteligente") — colaboração acadêmica-industrial real — **[A]**: [CGTN](https://news.cgtn.com/news/2026-01-25/China-develops-smart-brain-for-tunnel-boring-machines-1KdRPSSDeXm/p.html). A China hoje fabrica cerca de 70% das tuneladoras do mundo — **[B]**, número de fonte oficial/setorial chinesa, plausível dado o tamanho do mercado doméstico de infraestrutura, mas sem contraverificação por analista de mercado independente: [People's Daily](https://en.people.cn/n3/2024/0510/c90000-20167966.html).

**CCCC (China Communications Construction Company)** opera quase 200 embarcações de dragagem, capacidade anual acima de 800 milhões de m³, incluindo a draga "Tian Kun Hao" com alta automação — **[B]**, fonte corporativa/enciclopédia. O dado mais verificável por ter contraparte comercial estrangeira nomeada: a CCCC Dragagem fechou contrato de RM 3,5 bilhões (~R$4 bilhões) com a incorporadora malaia Tanco Holdings para construir o "primeiro porto container com IA" da Malásia, em Port Dickson — **[A]**, imprensa de negócios independente: [The Edge Malaysia](https://theedgemalaysia.com/node/785258), [TechNode Global](https://technode.global/2024/06/07/tanco-cccc-dredging-group-join-hands-to-develop-malaysias-first-smart-ai-container-port/). Isso confirma que a CCCC está **exportando** know-how de porto automatizado como produto comercial, não só usando internamente.

---

## 6. Visão computacional em canteiro — o que é escala industrial e o que não pude confirmar

A pesquisa acadêmica com origem chinesa sobre detecção de EPI por visão computacional é volumosa e de qualidade — isso é real e mensurável em produção científica (Frontiers, Springer, arXiv) — **[A]**: [Frontiers 2020](https://www.frontiersin.org/journals/built-environment/articles/10.3389/fbuil.2020.00136/full), [Springer 2024 — revisão sistemática](https://link.springer.com/article/10.1007/s10462-024-10978-x). Isso mostra que o **P&D** está em escala industrial.

O que eu **não** consegui confirmar com fonte independente: qual a fração real de canteiros chineses que roda detecção de IA em tempo real (alarme automático de "sem capacete") versus canteiros que só têm câmera gravando para revisão humana posterior. Toda fonte que cita número de "cobertura nacional" de IA de segurança é fornecedor de software vendendo o pacote — **[C]** — e portanto não uso número de penetração nacional aqui. O que dá para afirmar com confiança: o **hardware de captura** (câmera + catraca de reconhecimento facial) já é uma commodity de mercado chinesa, com preço de equipamento avulso a partir de ¥1.000 e pacote completo de canteiro na casa de ¥100 mil–500 mil (seção 1.2) — a parte cara não é a câmera, é a integração e a análise.

---

## 7. BIM obrigatório e plataformas domésticas — Glodon e o ecossistema doméstico

**Correção ao pressuposto da pesquisa: não existe uma lei nacional única obrigando BIM.** O que existe é (a) exigência crescente em projetos de investimento governamental, e (b) mandato cidade a cidade/província a província, avançando rápido mas de forma fragmentada:

- Shenzhen faz auditoria de qualidade de modelo BIM em novas construções na fase de alvará desde 2024 — **[A]**, comunicado oficial: [Secretaria de Habitação de Shenzhen](https://zjj.sz.gov.cn/gkmlpt/content/11/11962/post_11962319.html).
- Wenzhou iniciou piloto de revisão conjunta 2D/3D (BIM) de projeto de edificação civil em 2023, com expansão para toda a cidade a partir de 2024 — **[A]**: [Secretaria de Habitação de Wenzhou](https://zjj.wenzhou.gov.cn/art/2023/8/24/art_1229206191_4191896.html).
- Guangdong, Jiangsu e Hubei publicaram normas próprias de revisão inteligente de BIM.

Mas a literatura acadêmica é clara: a adoção de BIM na construção chinesa como um todo é **"notadamente lenta"**, com barreira de custo de hardware/software/treinamento pesando mais sobre pequenas e médias construtoras — **[A]**: [MDPI, comparativo China-Japão](https://www.mdpi.com/2075-5309/15/13/2234), [HRMARS — barreiras de BIM na China](https://hrmars.com/papers_submitted/21702/the-application-barriers-and-development-prospects-of-building-information-technology-bim-in-chinas-construction-industry.pdf). **Ou seja: a China tem plataforma doméstica gigante e mandato em cidades-piloto, mas não "todo mundo usa BIM" — o padrão de adoção desigual entre grande estatal e PME é parecido com o do Brasil, só que a régua de cima é mais alta.**

**Glodon (广联达)** é o gigante que quase ninguém conhece fora da China: listada na bolsa de Shenzhen desde 2010, primeira empresa do setor de software de engenharia chinesa a listar, receita reportada de US$4,99 bi (histórica) / US$851 milhões nos últimos 12 meses até set/2025, mais de 100 produtos "nuvem + big data" cobrindo todo o ciclo de vida da obra (orçamento, gestão de obra, BIM), presença em mais de 200 cidades globalmente via 60+ subsidiárias — **[B/C]**, números de fonte financeira agregadora e institucional da própria empresa, não conferidos contra balanço auditado nesta pesquisa: [Glodon institucional](https://www.glodon.com/en/company), [ZoomInfo](https://www.zoominfo.com/c/glodon-software-company-ltd/346788700).

**构力科技 (Beijing Gaolu Technology / marca PKPM)**, spin-off do Instituto de Pesquisa em Construção Civil da China (China Academy of Building Research), é o outro pilar — e é estrategicamente mais interessante que a Glodon: construiu um **kernel de BIM proprietário nacional (plataforma "BIMBase")**, ou seja, a China está deliberadamente reduzindo dependência do Autodesk Revit em nível de infraestrutura de software, não só de aplicativo. A alegação de que "95% da indústria de projeto usa PKPM-BIM" vem de matéria adjacente a marketing (Engineering.com) — **[C]**, tratar com ceticismo — mas o fato de haver política industrial explícita de soberania de software BIM é, em si, real e bem documentado: [Engineering.com](https://www.engineering.com/bim-for-buildings-on-fast-track-in-china/), [BIMBase Cloud](https://cloud.pkpm.cn/).

---

## 8. Fracassos — o efeito da crise imobiliária (Evergrande, Country Garden)

**A crise é real e de escala macro, não incidente pontual [A]:** a Evergrande faliu em dívida de mais de US$300 bilhões e recebeu ordem de liquidação em janeiro de 2024; a crise se espalhou por dezenas de outras incorporadoras — [Wikipedia com fontes primárias agregadas](https://en.wikipedia.org/wiki/Chinese_property_sector_crisis_(2020%E2%80%93present)), [CNBC](https://www.cnbc.com/2025/08/25/evergrandes-rise-and-fall-leaves-scars-on-chinas-property-sector.html), [NPR](https://www.npr.org/2024/01/30/1227554424/evergrande-china-real-estate-economy-property-collapse), [CFR](https://www.cfr.org/in-brief/does-evergrandes-collapse-threaten-chinas-economy).

**A Country Garden — a própria dona da Bright Dream Robotics — é um dos casos mais graves da crise.** A Reuters visitou canteiros da empresa em Tianjin em 2023 e encontrou obra parcial ou totalmente parada por falta de caixa — [via Malay Mail](https://www.malaymail.com/news/money/2023/08/23/unpaid-workers-silent-sites-chinas-property-woes-hit-country-garden/86697). Isso importa diretamente para a leitura da seção 2: **o maior showcase mundial de robótica de construção pertence à incorporadora mais visivelmente quebrada do setor.** Não achei nenhuma fonte que confirme diretamente "a Bright Dream Robotics foi descontinuada" — a empresa continua existindo e divulgando números —, mas o sinal de headcount reduzido (seção 2) e o pivô da Country Garden Services para robô de limpeza (capex baixo, ligado a receita recorrente de condomínio, não a obra nova) são consistentes com retração do braço de robótica de canteiro especificamente.

**O que a crise não parece ter derrubado:** o programa de cidades-piloto de construção inteligente (智能建造试点城市) continuou e foi renovado durante 2023–2024, dentro da própria janela da crise — o MOHURD seguiu publicando relatórios de progresso normalmente (seção 1.2). Minha leitura (interpretação, não fato apurado): o governo central trata "construção inteligente" como parte da narrativa de "desenvolvimento de alta qualidade" que substitui o antigo modelo de crescimento por volume de incorporação — ou seja, o programa sobrevive à crise porque é politicamente funcional *por causa* da crise, não apesar dela. Isso é minha inferência, sinalizo como tal.

---

## O que dá para trazer para o Brasil

**Já é rotina obrigatória lá e no Brasil nem se discute:**
1. Cadastro nominal de trabalhador de obra amarrado à liberação de alvará + conta de salário segregada (seção 1.1) — não existe equivalente brasileiro que amarre isso ao ato de liberar a obra, só fiscalização a posteriori via eSocial/auditoria trabalhista.
2. Telemetria obrigatória de guindaste-torre com alarme automático (seção 1.1) — no Brasil isso é vendido como diferencial de segurança premium, não é pré-condição de licenciamento em nenhuma cidade que eu tenha encontrado evidência.
3. Pacote comercial "canteiro inteligente" (câmera + reconhecimento facial + ambiental + guindaste) como produto de prateleira padronizado e relativamente barato (¥100 mil–500 mil / ~R$78 mil–390 mil) — na China isso é mercado maduro de integrador; no Brasil ainda é feito sob medida e caro.

**Replicável por uma construtora brasileira de médio porte, sem depender de escala estatal:**
1. Reconhecimento facial de acesso + registro de ponto biométrico em obra — hardware é commodity de baixo custo hoje (a partir de ¥1.000/unidade na China; equivalente já existe fornecido por integradoras nacionais e importadoras).
2. Robô de tarefa única de baixo custo (rebocador de parede, pintor, ladrilhador) como serviço terceirizado/alugado em vez de propriedade — o próprio mercado chinês fora da Bright Dream já vende essas máquinas a partir de US$15 mil (seção 2), o que é uma faixa de investimento discutível para obra grande brasileira, especialmente alugado por empreitada.
3. Detecção de EPI por visão computacional como produto — **atenção**: isso é exatamente o item que o catálogo interno do IOX-Services já sinalizou como "adiar" por risco de LGPD (vigilância de trabalhador exige base legal e transparência antes de virar produto). A pesquisa chinesa confirma que o **P&D** está maduro (seção 6), mas não confirma que a "adoção nacional" seja alta o suficiente para vender como "todo mundo já faz isso lá" — o discurso de venda correto é "a tecnologia existe e funciona", não "é padrão de mercado".
4. Ferramenta de orçamento/quantitativo tipo BIM leve (o produto central da Glodon) — replicável em software, sem depender de hardware, e já é o tipo de produto que o catálogo de IA-na-construção do fundador já mapeou como alto impacto/baixa complexidade (ver `ia-construcao-sintese.md`).

**Só existe em escala de estatal/incorporadora gigante, não é objetivo de curto prazo para PME:**
1. Frota própria de dezenas de tipos de robô de construção (Bright Dream) — exige capital de P&D e um incorporador-âncora que seja ao mesmo tempo fabricante e cliente cativo; nenhuma construtora brasileira de médio porte tem esse perfil.
2. Torre modular erguida em dias (Broad Group) — exige fábrica de módulo dedicada com capital afundado alto, e a própria análise independente mostra que a divisão mais espetacular **nunca deu lucro** — não é modelo de negócio comprovado, é showcase.
3. Tuneladora com "cérebro" de IA e P&D de universidade + estatal (China Railway) — infraestrutura de megaprojeto, sem equivalente de mercado para obra civil comum.
4. Kernel de software BIM soberano (PKPM/BIMBase) — projeto de política industrial nacional, não algo que uma empresa constrói sozinha.

**A lição mais transferível não é tecnológica — é de sequenciamento regulatório.** A China não esperou a tecnologia amadurecer para exigir infraestrutura de dados básica (cadastro nominal + telemetria de equipamento pesado); exigiu a infraestrutura de dados primeiro, e a camada de IA (visão computacional, BIM, robótica) cresceu em cima dela porque já havia canal de captura padronizado. No Brasil a ordem tende a ser invertida — vende-se "IA" para um canteiro que ainda não tem coleta de dado nenhuma — e é exatamente esse é o argumento que já está registrado em `ia-construcao-sintese.md` sobre "captura antes do produto".
