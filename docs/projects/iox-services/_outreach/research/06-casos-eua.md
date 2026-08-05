# IA e automação na construção civil — Estados Unidos (mercado de referência)

**Data da pesquisa:** 01/Ago/2026. **Autor:** Atlas (Analyst). **Método:** apenas fontes primárias/imprensa
especializada via WebSearch/WebFetch, com data e URL em cada afirmação. Nenhum número foi inventado.

**Disciplina de evidência aplicada em todo o documento:**
- **A** = acadêmico, governo, imprensa independente (ENR, Construction Dive, ASCE, RICS, Swiss Re), associação
  setorial (AGC, ABC).
- **B** = imprensa de nicho/trade press sem apuração independente própria, ou dado agregado sem metodologia clara.
- **C** = divulgado pelo próprio fornecedor/cliente (press release, blog corporativo). **Case de fornecedor
  nunca é apresentado como fato — é apresentado como alegação do fornecedor.**

Este documento **não repete** o que já está mapeado: Buildots, ALICE (base), Dusty Robotics, Smartvid.io,
Trunk Tools (base), Field Materials, Togal.AI, Converge, 45 Broadway.

---

## 1. Plataformas dominantes — o que a IA entrega hoje, de verdade

A descoberta central desta seção: **nenhuma das cinco grandes plataformas construiu um produto de IA do
zero em 2025-2026.** Todas fizeram a mesma jogada — comprar uma startup de IA e embutir um "copiloto" de
chat/agentes por cima do sistema que já existia. E todas miram primeiro a **camada de papelada** (RFI,
submittal, documento, contrato), não o canteiro físico.

| Plataforma | O que lançou 2025-2026 | Classe | Fonte |
|---|---|---|---|
| **Procore** | "Procore AI" com Datagrid embutido. Digital Coworker Starter Pack: 5 agentes prontos (Deep Search, Submittal Review, RFI, Daily Log, Contract Review). "Procore Skills" (ensinar processo próprio ao agente) em preview. Aprovação humana obrigatória antes de qualquer ação. | B/C | [ENR](https://www.enr.com/articles/63042-procore-releases-new-ai-agients-after-datagrid-integration), [Engineering.com](https://www.engineering.com/procore-expands-ai-tools-with-construction-workflow-agents/), [Procore](https://www.procore.com/press/procore-introduces-digital-coworker-packages-expands-ai-agent-library-and-previews-skills-to-help-construction-teams-put-ai-to-work) |
| **Autodesk Construction Cloud** | Fundida ao Autodesk Forma. "Autodesk Assistant" (chatbot de busca em RFI/e-mail). "Autotags on Photos" (ML rotula foto automaticamente). Construction IQ prioriza risco (design/qualidade/segurança/PM). Próximo passo: assistentes de IA "geometria-aware" que interrogam BIM/CAD. | A/C | [ENR](https://www.enr.com/articles/61362-autodesk-folds-construction-cloud-into-forma-will-release-geometry-based-ai-assistants), [AEC Magazine](https://aecmag.com/features/autodesk-shows-its-ai-hand/) |
| **Oracle Aconex** | Mar/2026: GA do "Advisor for Safety" — IA preditiva de incidente treinada num modelo proprietário com dados equivalentes a **10.000+ project-years**, integrando Aconex + Primavera Unifier + Fusion ERP. Abr/2026: melhorias em revisão de documento/inspeção, expandindo IA para setores regulados. | C | [Oracle](https://www.oracle.com/news/announcement/oracle-transforms-construction-safety-management-with-ai-2026-03-05/) |
| **Trimble** | "AI at Trimble" (industrial + agentic). Tekla 2026 com serviço de desenhos de fabricação por IA. **Trimble Agent Studio** (2026) permite ao cliente criar agente próprio. Campo: IA identifica EPI/zona de risco e compara scan-vs-modelo. Adquiriu **Document Crunch** (IA de análise de risco contratual) em abr/2026. | A/C | [ENR](https://www.enr.com/articles/62035-trimble-lays-out-ai-strategy-connect-platform-at-conference), [Architosh](https://architosh.com/2026/04/trimble-set-to-acquire-ai-powered-document-crunch/) |
| **Bentley Systems** | SYNCHRO+ (4D com IA). **OpenSite+** — primeira aplicação de IA generativa para projeto de terraplenagem/sítio civil, "até 10x mais rápido", disponibilidade limitada. Bentley Copilot (anotação automática de desenho, GA nov/2025, mais produtos em 2026). | B/C | [Bentley](https://www.bentley.com/news/bentley-systems-advances-infrastructure-ai-with-new-applications-and-industry-collaboration/), [ENR](https://www.enr.com/articles/61673-bentley-unveils-platform-upgrades-redoubles-ai-investment) |

**Sinal de consolidação mais importante do setor em 2026:** em julho/2026 a **Procore comprou a DroneDeploy
por US$ 845 milhões em dinheiro** — a plataforma de reality capture usada em "mais de 3 milhões de canteiros"
no mundo. Classe **A** (ENR). [Fonte](https://www.enr.com/articles/63399-procore-acquires-reality-capture-platform-dronedeploy-for-845m).
Isso confirma que a estratégia de todo grande player em 2025-2026 é **comprar**, não construir — algo que o
próprio McKinsey afirma explicitamente (seção 4).

---

## 2. Visão computacional de progresso — comparação e o que falta comprovar

**Consolidação:** DroneDeploy comprou a StructionSite (nov/2022) → Procore comprou a DroneDeploy (jul/2026,
US$ 845M). Paralelamente, **OpenSpace comprou a Disperse** (out/2025) e lançou "OpenSpace Track". Classe A/B.
[AEC Magazine](https://aecmag.com/project-management/openspace-acquires-construction-progress-tracking-firm-disperse/).

| Player | Modelo técnico | Alegação | Classe |
|---|---|---|---|
| **OpenSpace** (+ Disperse) | Câmera 360° capacete + IA **com revisão humana no loop** — posicionamento explícito é "sobreviver ao escrutínio do dono da obra" | Relatórios objetivos de progresso para faturamento e coordenação de disciplina | C (site do fornecedor) |
| **Doxel** | Robôs/drones autônomos com lidar + câmera 360°, algoritmo proprietário comparando site real vs. BIM/cronograma, **sem revisão humana declarada** | "Até 11% abaixo do orçamento", "38% de aumento médio de produtividade" | **C — nenhuma auditoria independente encontrada** |
| **Buildots** | Câmera 360° capacete + IA, quebra por componente/sistema | Dashboard quase em tempo real | C |
| **EarthCam** | Câmeras fixas + "AI AnalyticsCam": EPI, quase-acidente, trabalhador em altura, identificação de caixa/entrega, "AI Schedule Intelligence" (progresso visual vs. planejado). Expandiu para varejo em mar/2026 | Redução de incidente / verificação de cronograma | B/C |

**O que não foi possível comprovar nesta pesquisa** (disclosure honesto, conforme pedido): não existe, nas
fontes acessadas, **nenhum benchmark independente e auditado comparando a acurácia real** de OpenSpace vs.
Doxel vs. Buildots em obra viva. A literatura acadêmica revisada por pares (Classe A) valida a *abordagem*
— ex.: contagem de vergalhão por visão computacional atinge 94,61% de acurácia (AP50) em Wang et al.
2023/2025, [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2666165925002327) — mas são
testes de tarefa estreita em ambiente controlado, **não** validação end-to-end de nenhuma plataforma
comercial citada acima. Toda alegação de ROI de Doxel/Buildots/OpenSpace deve ser tratada como Classe C.

---

## 3. Robótica de campo — status real de implantação

**Achado central:** robótica de canteiro que ataca **uma tarefa estreita e de alto volume** está saindo do
piloto; robótica generalista continua não escalando (ver seção 8, robôs humanoides/logística — que **não
são construção**, mas mostram o mesmo padrão de fracasso de capital).

| Empresa | O que faz | Status 2026 | Classe |
|---|---|---|---|
| **Built Robotics** | Kit retrofit "Exosystem" transforma escavadeira existente em robô autônomo (GPS + câmera 360° + visão computacional) | Mar/2026 adicionou máquinas que leem solo complexo sem intervenção humana. Alega 20% de economia vs. método tradicional. Modelo **RaaS** (robotics-as-a-service, pago por metro cúbico) está reduzindo a barreira de capital — cliente não precisa comprar equipamento de US$ 500 mil+ | B/C — [DataDrivenAEC](https://datadrivenaec.com/tools/built-robotics) |
| **Canvas** (robô de drywall) | Automatiza massa e lixamento de gesso acartonado | **Não é fracasso — foi adquirida pela JLG Industries (Oshkosh) em jan/2026**, após levantar US$ 24M em Series B (Menlo Ventures + Suffolk Construction como investidor estratégico). É o exemplo mais claro de **saída via aquisição por fabricante de equipamento**, não IPO nem escala solo | A (ENR) — [Fonte](https://www.enr.com/articles/62349-jlg-buys-san-francisco-drywall-robotics-automation-company-canvas) |
| **Toggle Robotics** | Pré-fabrica gaiolas de vergalhão fora do canteiro (planta no Brooklyn) e entrega pronto num raio de 300 milhas | Levantou US$ 15M+ total (seed $3M/2019, Série A $8M, +$3M). Alega 70-90% de economia de tempo de instalação em campo. 10-20+ clientes com pedido recorrente | B — [Alumni Ventures](https://www.av.vc/blog/toggle-robotics-for-the-construction-industry) |
| **Advanced Construction Robotics (TyBOT/IronBOT)** | ⚠️ **Empresa distinta de Toggle** — robô que amarra vergalhão **no próprio canteiro** (autônomo), não pré-fabricação. Caso publicado: substituição de ponte na Pensilvânia, redução de horas de pessoal e duração de obra | B — [For Construction Pros](https://www.forconstructionpros.com/concrete/equipment-products/rebar-reinforcement/article/21627048/) |
| **Hilti Jaibot** | Robô semi-autônomo de furação de teto guiado por BIM, lançado em 2019 | Alega ser "5 a 10x mais efetivo" que humano e reduzir 50% do tempo de layout/furação. **Em 2026, ainda descrito como "implantação comercial inicial"** — 6-7 anos após lançamento, com toda a rede de distribuição/serviço da Hilti por trás, isso é um dado relevante sobre a lentidão real da robótica mesmo com fabricante forte. Robôs MEP em geral: previsão setorial de piloto→produção em "2-3 anos" a partir de agora | C/B |
| **Boston Dynamics Spot + FieldAI** | Parceria anunciada em mar/2026: Spot + "Field Foundation Models" para inspeção/documentação autônoma de obra | Alega implantação em obras na Ásia, Europa e América do Norte nos últimos 2 anos (desde ~2024); clientes alegam redução de >90% no tempo de inspeção/documentação | C — [Boston Dynamics](https://bostondynamics.com/case-studies/field-ai-boston-dynamics-made-autonomy-practical-on-construction-sites/) |

**Nota sobre mercado:** a projeção de "US$ 18,16 bilhões até o fim de 2026, crescendo >9%/ano" para o
mercado de equipamento de construção autônomo aparece em fonte agregadora sem metodologia visível — Classe
**C**, tratar com ceticismo, não citar como fato para o cliente.

---

## 4. Planejamento e risco — nPlan, ALICE, Slate

- **nPlan**: modelo treinado em **750.000+ cronogramas históricos**, representando alegadamente US$ 2
  trilhões em gasto de construção. A alegação específica de "78,9% de acurácia vs. 41,3% do CPM
  convencional" aparece em conteúdo do próprio fornecedor/parceiro, não em paper acadêmico citável — Classe
  **B/C**. Ressalva do próprio material: a previsão só é confiável quando o cronograma de entrada é
  **bem estruturado e atualizado com regularidade** — a mesma barreira "garbage-in-garbage-out" já mapeada
  na pesquisa brasileira. [nplan.io](https://www.nplan.io/)
- **ALICE Technologies**: fundada em 2015 a partir de pesquisa em Stanford. Fez parceria com a **McKinsey**
  para IA generativa de cronograma — relevante porque a McKinsey normalmente não associa sua marca a um
  único fornecedor, o que sinaliza que a ALICE atingiu um patamar de credibilidade. [Construction Dive](https://www.constructiondive.com/news/mckinsey-alice-technologies-partner-generative-ai-schedule/817580/)
- **Slate Technologies**: **não encontrei evidência de aquisição ALICE↔Slate** — busquei diretamente e não
  há confirmação nas fontes acessadas; tratar essa hipótese do brief original como não confirmada. Slate
  atua em duas frentes: IA de pré-obra (documentação/orçamento/produtização de projeto) **e**, desde
  set/2024, uma ferramenta separada de **aquisição de terreno** ("Real Estate Intelligence"), alegando 94%
  de acurácia em previsão de tendência de mercado — Classe C, metodologia não verificada.

---

## 5. Grandes construtoras (GCs) americanas — programas internos

**Padrão comum a quase todas:** o cargo/time formal de "IA" só foi criado em **2025-2026** — mesmo nas GCs
mais sofisticadas dos EUA, a governança de IA institucionalizada tem, no máximo, 12-18 meses de idade.

| GC | Iniciativa | Classe/Fonte |
|---|---|---|
| **Turner** | "AI Innovation Challenge" interno gerou o **SafeT Coach** (consultor de segurança em linguagem natural sobre o framework EHS da Turner) — **disponibilizado grátis para todo o setor em mai/2026**. 10ª Innovation Summit em Nashville, 300+ participantes | A — [Construction Dive](https://www.constructiondive.com/news/turner-construction-ai-safety-tech-gpt/819069/) |
| **Skanska USA** | Nova "Digital Transformation and Solutions Team" (2026), liderada por SVP dedicado (Will Senner). Família de ferramentas próprias **construídas sobre GPT-4o** ("Sidekick": Operational Risk, Safety, geral) — 1.000+ funcionários, 500+ projetos usando | A — [Skanska](https://www.skanska.com/us/en/media/press-releases/2026/skanska-usa-building-establishes-digital-transformation-and-solutions-team-to-expand-the-use-of-ai-across-the-business) |
| **DPR Construction** | **ConstructivIQ** (IA de compras/procurement) escalado para 100+ projetos (abr/2026), integra com Autodesk Build/Oracle P6/Procore/MS Project. WND Ventures (CVC próprio da DPR desde 2015) + Skillit + Suffolk Technologies em infraestrutura de contratação por IA (jun/2026) | A/B — [Global Project Leader](https://www.globalprojectleader.co.uk/2026/04/dpr-construction-scales-ai-procurement-platform-across-100-projects/) |
| **Mortenson** | **BLUlabs** — centro de P&D físico de 40.000 pés² perto de Minneapolis (impressoras 3D, CNC, corte a plasma — ferramentas de ofício reais, não só software). Cargo dedicado "Director of AI" (Brian Nahas) | B — [ENR](https://www.enr.com/articles/61260-tech-roundup-mortenson-opens-blulabs-center-versatile-debuts-dashboard-for-steel-pms) |
| **Gilbane** | Time interno "AI Boost". Escolheu **Trunk Tools** como parceiro único de IA de canteiro, expandindo TrunkSubmittal/TrunkText/TrunkSOP para 200+ projetos em 2 anos (comprar, não construir) | A — [ENR](https://www.enr.com/articles/61435-gilbane-rolls-out-trunk-tools-ai-agents-across-its-jobsites) |
| **Clayco** | "IA" em Clayco é, em boa parte, **construir a infraestrutura física da IA**, não usá-la: 57 projetos de data center ativos, US$ 3,6bi de receita em DC em 2024 (metade do faturamento total), unidade Clayco Compute projetada em >US$ 4,5bi até 2026. Consórcio para 1º campus de data center nuclear dos EUA (Idaho, DOE). **Uso interno de IA por funcionário: 600+ assentos de ChatGPT** — número modesto para uma empresa desse porte, útil como piso de realidade | A/C — [PR Newswire](https://www.prnewswire.com/news-releases/clayco-supports-deep-atomic-consortium-with-department-of-energy-submissions-for-proposed-first-nuclear-powered-ai-data-center-campus-in-us-302685897.html) |
| **Suffolk Technologies** | Fundo de VC próprio de **US$ 110 milhões** (fechado 2023). Acelerador **BOOST**: 6 coortes, 38 graduados que já levantaram **US$ 700M+** juntos (inclui Trunk Tools, Kaya AI). Cohort 2026: pré-lançamento 8-10/set, Demo Day 18/nov, Boston | A — [Suffolk Tech](https://suffolktech.com/boost/) |
| **Bechtel** | Novo cargo **SVP de Transformação EPC** (John Platt, anunciado 11/fev/2026), mandato explícito de integrar "IA, automação e robótica" na entrega. Parceria com Nvidia para acelerar construção de data center. Usa IA da Detect Technologies para detecção de EPI em força de trabalho de 18.000 pessoas | A — [Construction Dive](https://www.constructiondive.com/news/bechtel-new-role-tech-project-delivery/811925/) |
| **Kiewit** | Usa **Fyld** (análise de vídeo curto de canteiro para risco de segurança/qualidade). Parte do consórcio Bechtel-Kiewit em projeto de US$ 33bi (Ohio) dentro de acordo maior de US$ 550bi EUA-Japão em infraestrutura de IA | A — [Construction Dive](https://www.constructiondive.com/news/bechtel-kiewit-japan-ohio-power-generation-ai/815768/) |
| **Whiting-Turner** | **Nenhuma iniciativa específica de IA foi encontrada** nas fontes acessadas apesar de ser top-10 GC — gap de evidência assumido explicitamente, não preenchido com suposição |  |

**Leitura crítica:** boa parte da "corrida de IA" das maiores GCs americanas está, na prática, **acoplada à
corrida de data center/hyperscaler** (Clayco, Bechtel, Kiewit, DPR, e — fora da nossa lista original —
Holder). Isso significa que parte relevante do "estado da arte americano" é artefato de **um segmento de
mercado específico** (megaprojeto de infraestrutura de IA financiado por Meta/Google/Microsoft/Amazon/Oracle,
que juntos comprometeram **mais de US$ 690 bilhões em capex 2026**), não do setor de construção como um
todo — ver síntese na seção final.

---

## 6. Seguradoras e IA — ângulo pouco explorado, e o que não dá para provar

- **Zurich** lançou o "**Data Center Project Guard**" (estreia nos EUA jan/2026, expandido em 2026 para
  Brasil, Alemanha, Itália, Nórdicos e Espanha) — seguro builders-risk combinando cobertura de propriedade +
  paramétrica de clima, desenhado especificamente para o risco de construção de data center orientada a IA.
  Zurich North America também está pilotando um programa de **telemática de vídeo** em que a construtora
  compartilha dados de vídeo de frota com a seguradora. Classe A/B. [Zurich](https://www.prnewswire.com/news-releases/zurich-north-america-advances-construction-safety-with-telematics-and-other-data-driven-risk-solutions-302761557.html)
- **Swiss Re** publicou em jul/2026 um relatório *sigma* específico sobre "segurar a IA: riscos de
  acumulação de valor em data center" — sinal de que o setor de resseguro está tratando a construção
  orientada a IA como **categoria de risco nova**, não apenas como oportunidade de usar IA para precificar.
  Classe A. [Swiss Re](https://www.swissre.com/institute/research/sigma-research/sigma-insights-07-2026-insuring-ai-data-centre-risks.html)
- **O que NÃO foi possível comprovar**: nenhuma fonte Classe A/B encontrada nesta pesquisa nomeia uma
  seguradora + um percentual de desconto de prêmio + um projeto/construtora específica ligados ao uso de
  câmera IA de canteiro. A reportagem mais próxima (MarketScale, jul/2026) confirma a tendência de
  "desconto de prêmio para quem usa monitoramento" mas **não nomeia seguradora, não dá percentual, não nomeia
  cliente**. O número de "20% de desconto com câmera IA" que aparece em buscas genéricas é de um fornecedor
  de câmera de segurança comercial (intellisee.com) e **não é específico de canteiro de obra** — não deve
  ser citado como fato do setor de construção.

---

## 7. Regulação e exigência do dono da obra

- **OSHA**: não há regulação federal específica sobre IA em segurança da construção até ago/2026.
  "A OSHA não reescreveu as regras em 2026", mas a fiscalização ficou mais orientada a dado, com inspeção
  visando atividade de alto risco e reincidentes. Classe B (trade press, sem doc. oficial primário
  localizado nesta rodada). [OHS Online](https://ohsonline.com/articles/2026/02/10/ai-is-transforming-construction-safety-but-implementation-may-be-the-biggest-risk.aspx)
- **GSA**: fontes de trade press (não documento de política primário verificado nesta pesquisa) afirmam que
  a GSA "exige fluxos de 'Single Source of Truth'" via seus padrões BIM mais recentes. **Marcar como
  pendente de verificação em fonte primária** antes de usar como fato definitivo em material de cliente.
- **USACE/VA**: a pesquisa não conseguiu aprofundar exigências específicas dessas agências nesta rodada
  (limite de busca atingido) — gap de evidência assumido, não preenchido.
- **O fator de força real mais bem evidenciado nesta pesquisa não é o governo — é o dono privado
  hyperscaler.** A combinação de capex hyperscaler recorde ($690bi+ 2026), produto de seguro
  específico da Zurich para data center, e o fato de Clayco/Bechtel/Kiewit/DPR estarem todos correndo atrás
  do mesmo segmento sugere fortemente que **projetos de data center de grande porte informalmente exigem
  relatório digital de ponta** (progress tracking, IA de segurança) como condição para ganhar/manter o
  contrato — mas isso é **síntese/inferência**, não um mandato documentado único que se possa citar
  diretamente. Apresentar dessa forma ao cliente, sem viés de certeza que a evidência não sustenta.

---

## 8. Dinheiro — investimento, e quem quebrou

### Capital de risco em contech

| Ano | Total investido | Deals | Observação |
|---|---|---|---|
| 2023 | US$ 3,0 bi | 236 | Contech = 1,06% de todo VC |
| 2024 | US$ 3,1 bi (+2% a/a) | 325 | Contech = 1,1% de todo VC (vs. 0,6% em 2019) |
| 2025 (até Q3) | US$ 3,7 bi | — | **Mais do que dobrou** o mesmo período de 2024; já superou o total anual de cada um dos 3 anos anteriores |

Fonte: [AEC Business](https://aec-business.com/what-startup-funding-reveals-about-the-future-of-construction-technology/), [Nymble Ventures Q3 2025](https://www.nymbleventures.com/post/q3-2025-contech-market-report). Classe A/B.

- **IA especificamente**: US$ 2,22 bi captados até a data da pesquisa em 2025 — cerca de **2/3 de todo o
  capital de contech** do ano foi para empresas de IA.
- **Maturidade do capital**: 80% do dinheiro de VC em 2025 foi para rodadas pós-Série A (vs. 60% em 2024,
  53% em 2023). **Leitura crítica**: o dinheiro está se concentrando em apostas já provadas (Trunk Tools,
  Kaya AI, OpenSpace, nPlan) e em consolidação via M&A das incumbentes (Procore, Trimble, Autodesk) — **não**
  está financiando uma onda nova de fornecedores seed-stage para a construtora média escolher. Isso é
  relevante para o Brasil: o "menu" de ferramentas de IA que a construtora americana média tem para escolher
  também não está crescendo tão rápido quanto o volume de manchete sugere.

### Falências e descontinuações — o que de fato quebrou

**Modular/pré-fabricado (o padrão de fracasso mais claro e mais comprovado):**

| Empresa | O que era | Fim | Causa | Classe |
|---|---|---|---|---|
| **Katerra** | Integração vertical total (projeto+manufatura+GC+PM), ~US$ 2bi captados | Ch.11 em 06/jun/2021 | Tentou modernizar **tudo ao mesmo tempo**; construiu obra antes de dominar manufatura em escala; desviou foco para software/IoT e queimou caixa | A — múltiplas fontes de imprensa de negócios |
| **Veev** | Construção modular residencial, US$ 600M captados, "unicórnio" em 2022 | Encerrou nov/2023 via cessão em benefício de credores (não Ch.11 formal) | Falha em nova captação em ambiente de queda de preço de imóvel/juros altos | A — TechCrunch, HousingWire, CB Insights |
| Nexii | Modular/pré-fab | Colapso 2024, >US$ 109M de dívida | Não corroborado por segunda fonte Classe A nesta rodada | **C — verificar antes de citar** |
| TopHat, Modulous, Ilke Homes | Modular (Reino Unido) | Fecharam 2023-2024 | Mesmo padrão do Katerra, mas **mercado britânico, não americano** — incluído só como evidência de padrão, não como caso dos EUA | B |

**Robótica — achado importante e contraintuitivo:** esta pesquisa **não encontrou** nenhum fracasso de alto
perfil de robótica *especificamente de canteiro de obra* nos EUA (excavação, vergalhão, drywall, furação
seguem operando ou tiveram saída via aquisição — Canvas→JLG é o exemplo). Os fracassos de robótica
localizados são de **categorias adjacentes, não de construção**: K-Scale Labs (robô humanoide, SF, encerrou
nov/2025 após entregar só 2 de 100 unidades pré-vendidas, ficou com ~US$ 400 mil em caixa), Dextrous
Robotics (descarregamento de veículo/logística, dissolvida jan/2024), RoboTire (automotivo, Ch.11 jan/2024).
**Não devem ser citados como "robô de construção que fracassou"** — seriam generalização incorreta. O fato
de não termos achado um fracasso robótico de construção pura não prova que não existe; prova que, nesta
rodada de pesquisa, o padrão de fracasso claro e documentado está em **modular/pré-fab** (aposta de
integração vertical tipo Katerra), não em robótica de tarefa estreita.

---

## 9. Como a construtora MÉDIA americana usa IA hoje (não a top 15)

Esta é a seção mais diretamente aplicável ao ICP brasileiro — e a mais bem evidenciada com dado de pesquisa
setorial (Classe A).

| Fonte | Achado | Data/Classe |
|---|---|---|
| **RICS** (global, 2.200+ profissionais, Américas = só 10% da amostra) | 45% **sem** nenhuma implementação de IA · 34% em piloto inicial · apenas 1,5% usa em múltiplos processos · <1% tem uso totalmente incorporado em toda a empresa | out/2025, A |
| **AGC + Sage** (EUA, associação setorial) | **61%** das empresas usam IA ou planejam aumentar investimento (**alta de 44%** no ano anterior). Uso por função: **45% administrativo/escritório**, 23% orçamento, 20% projeto/pré-obra | 2026, A |
| **Dodge Construction Network + CMiC** | **87%** acreditam que IA vai impactar o negócio de forma relevante, mas **só 19%** já adaptaram o fluxo de trabalho. Barreiras: qualidade de dado (57%), segurança (54%); só 26% avalia sua própria qualidade de dado como "alta" | dez/2025, A |
| Gap por porte (Dodge) | **69%** das empresas pequenas/médias acreditam que IA dá vantagem competitiva, vs. **86%** das grandes | 2025, A |
| **Agendamento/cronograma** especificamente | Só **16%** usam IA/automação para cronograma; **60% sem nenhum plano** de adotar | 2025-26, A/B |
| **ServiceTitan** (residencial, EUA) | **25%** dos contratantes residenciais usam IA de forma "significativa"; **quase 50%** relatam falta de confiança na ferramenta. 74% veem IA como chave de eficiência **no futuro** — gap claro entre aspiração e uso real | 2026, A |
| Bluebeam (via Construction Dive) | 27% dos profissionais de AEC usam IA hoje; dos que usam, 94% planejam aumentar uso em 2026 — **o crescimento vem de aprofundar o uso entre a minoria que já usa**, não de converter a maioria cética | 2026, B |

**Leitura consolidada:** mesmo no mercado mais maduro do mundo, em agosto de 2026, a construtora americana
**mediana** usa IA generativa para **tarefa administrativa e apoio a orçamento** — não robótica, não visão
computacional de progresso, não cronograma autônomo. Isso confirma, com dado de mercado americano
independente, exatamente a mesma hierarquia de complexidade já identificada na pesquisa brasileira (RDO/
documento = baixa complexidade e adoção mais fácil; previsão de prazo/custo = alta complexidade e adoção
ainda marginal mesmo nos EUA).

---

## 10. O que é replicável numa construtora brasileira de 10-200 funcionários — e o que depende de escala/capital que ela não tem

### Replicável hoje, sem robótica e sem grande capital

1. **Copiloto de documento/RFI/contrato construído sobre LLM de prateleira.** É exatamente o que
   Procore/DPR/Skanska/Turner fizeram — nenhum deles treinou modelo do zero, todos embutiram um agente de
   chat/busca por cima de dados já existentes. Não exige hardware, robô nem plataforma proprietária.
2. **IA de segurança sobre câmera que já existe** (celular do mestre, CFTV do canteiro) — detecção de EPI
   via modelo de visão computacional pré-treinado, no padrão do que EarthCam/Trunk Tools vendem em escala
   grande. A tecnologia-base (detecção de objeto) já é acessível fora da plataforma proprietária.
3. **Assistente de texto genérico para administrativo.** O dado mais desmistificador desta pesquisa: mesmo
   a Clayco — uma das 3 maiores construtoras de data center dos EUA, faturamento >US$ 10bi — descreve seu
   uso interno de IA em boa parte como "600+ usuários de ChatGPT." Isso é 100% replicável amanhã, custo
   quase zero, sem depender de nenhuma plataforma de construção.
4. **Entrar pela porta do documento/RFI, não pelo canteiro/robótica.** A sequência americana (todo grande
   player mirando papelada primeiro) confirma de forma independente o que a pesquisa brasileira já havia
   apontado: RDO/documento é o ponto de entrada de menor complexidade e maior demonstrabilidade.
5. **Modelo RaaS (robótica como serviço, pago por uso)** é, em tese, replicável — remove a barreira de
   capital de comprar equipamento de US$ 500 mil. Mas **a oferta não existe hoje no Brasil**: o modelo é
   copiável, o fornecedor precisaria ser criado/trazido primeiro.

### Depende de escala ou capital que a PME não tem

1. **Robótica de campo proprietária** (excavação Built Robotics, vergalhão Toggle/ACR, furação Hilti
   Jaibot) — exige comprar equipamento caro ou ter volume de obra recorrente suficiente para RaaS. PME de
   10-200 funcionários raramente tem uma única obra do porte de um data center hyperscaler que justifique.
2. **Fundo de venture corporativo** (Suffolk Technologies com US$ 110M, WND Ventures da DPR) — exige
   balanço de bilhões de dólares. É característica exclusiva de GC americana top-20, não replicável.
3. **Dataset proprietário de escala** (nPlan com 750 mil cronogramas / US$ 2 trilhões em obra; Oracle
   Aconex com 10.000+ project-years) — modelo preditivo de risco/cronograma exige histórico que só se
   acumula com portfólio grande e/ou décadas de operação. PME não constrói isso — no máximo aluga via SaaS
   de terceiro, se e quando existir versão acessível/localizada.
4. **Cargo dedicado de liderança de IA com equipe própria** (SVP em Skanska, Bechtel, DPR) — pressupõe
   massa crítica de projetos que justifique o cargo. Na PME, quem cuida disso é o sócio ou o gerente, em
   paralelo com o resto do trabalho.
5. **O segmento data center/hyperscaler como motor de receita e pressão de adoção.** Boa parte da "corrida
   de IA" das maiores GCs americanas está, na prática, financiada pela onda de capex de
   Meta/Google/Microsoft/Amazon/Oracle (US$ 690bi+ em 2026). Não existe fila de hyperscaler batendo na
   porta de uma construtora de 50 funcionários no interior do Brasil — e não deveria existir como
   expectativa. Parte relevante do "estado da arte americano" é artefato de **um segmento de mercado
   específico**, não do setor de construção como um todo.
6. **Seguro paramétrico/telemetria vinculado a desconto de prêmio** (Zurich Data Center Project Guard) —
   depende de mercado segurador com produto sofisticado o bastante para precificar isso e de escala de obra
   que justifique underwriting customizado. Não localizei produto equivalente no mercado segurador
   brasileiro de obra.

### A conclusão estratégica central

Mesmo nos Estados Unidos — o mercado mais maduro do mundo em adoção de IA na construção — a construtora
**mediana** está, em agosto de 2026, essencialmente usando IA generativa para documento/administrativo, com
câmera de segurança começando a virar padrão e com robótica de campo e cronograma autônomo ainda restritos a
menos de 20% das empresas, **mesmo entre as grandes**. A distância entre "o que a Turner ou a Skanska fazem"
e "o que a construtora americana mediana faz" é enorme — provavelmente maior do que a distância entre a
construtora americana mediana e uma PME brasileira bem equipada. **A referência estratégica correta para o
IOX-Services não é a Turner — é a construtora americana mediana**, que também está patinando na mesma
hierarquia de complexidade (administrativo → segurança → orçamento → cronograma/robótica) já mapeada para o
Brasil.

---

## Lacunas de evidência assumidas (não preenchidas com suposição)

- Iniciativa de IA específica da **Whiting-Turner** — não encontrada.
- Exigência de BIM/IA da **USACE** e da **VA** — não aprofundada (limite de busca atingido nesta sessão).
- Documento de política primário da **GSA** sobre "Single Source of Truth" — só localizado via trade press,
  não via fonte oficial primária.
- Percentual de desconto de prêmio de seguro ligado a IA de canteiro, com seguradora e projeto nomeados —
  não encontrado; a tendência é real e citada por Zurich/Swiss Re, mas sem case auditável específico de
  construção.
- Corroboração de segunda fonte Classe A para o colapso da Nexii (só uma fonte agregadora, Classe C).
- Auditoria independente das alegações de ROI de Doxel, OpenSpace ou Buildots — não encontrada; tratar
  todas como Classe C (fornecedor).
