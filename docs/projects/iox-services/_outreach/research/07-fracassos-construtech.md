# Fracassos e lições negativas em construction tech

**Data:** 02/Ago/2026 · **Método:** WebFetch em fontes primárias (WebSearch esgotado; DuckDuckGo
como substituto — Google e Reddit bloqueiam scraping).
**Disciplina:** A = imprensa independente/acadêmico/documento judicial · B = empresa admitiu · C = fornecedor.
Para fracasso, **classe A é essencial** — empresa não admite fracasso espontaneamente.

---

## 1. Katerra — a causa real não é a que se conta

Fundada em 2015 (Michael Marks, ex-Flextronics). SoftBank Vision Fund: US$835M em jan/2018,
+US$200M em mai/2020, **mais de US$2bi no total**. Valuation chegou a US$4bi.

**A causa imediata foi contágio financeiro externo, não "ficou sem dinheiro" (classe A).**
A Greensill Capital securitizava os recebíveis da Katerra. Esses recebíveis começaram a dar
default em 2020 e, quando a Greensill colapsou em março/2021, as notas ligadas à Katerra somavam
**US$440 milhões**. Isso cortou o capital de giro e disparou o Chapter 11 em junho/2021.
Virou litígio: Credit Suisse processou o SoftBank e **perdeu** (English High Court, 2023).

**Causas estruturais (classe B, fatos corroborados):**
- **4 CEOs em 6 anos.** Citação de ex-funcionário: *"nunca soubemos qual Katerra éramos de um trimestre para o outro."*
- **Construiu fábrica antes de provar demanda.** Planta de CLT em Spokane Valley, 270 mil pés²,
  anunciada como a maior da América do Norte, abriu em 2019 e **fechou em junho/2021** após ~18
  meses operando em fração da capacidade. Vendida por US$50M à Mercer International.
- Tentou reinventar software + manufatura + montagem simultaneamente.
- Capital abundante substituiu disciplina de unit economics.

> **Lição citável:** comprove economia unitária — entregue lucrativamente **um**, depois dez,
> depois cem — antes de escalar fábrica ou capital.

---

## 2. Outras quebras confirmadas (classe A)

| Empresa | O que era | Levantou | Desfecho |
|---|---|---|---|
| **Nexii** (CA) | Painéis sustentáveis | US$250M+, avaliada em ~US$2bi (2022) | CCAA jan/2024; vendida por **US$500 mil** + US$22M de passivo assumido |
| **Veev** (EUA) | Modular residencial | **US$647M** | Fechou nov/2023 — rodada cancelada por juros altos; ativos comprados pela Lennar |
| **Modulous** (UK) | Modular/MMC | — | Liquidação jan/2024. Dívida £6,2M, incluindo **£1,6M de empréstimo público** (Innovate UK) |
| **Torre B2, Atlantic Yards** (EUA) | "Maior torre modular do mundo", 32 andares | parte de projeto de US$4,9bi | Empilhamento de módulos e infiltração estouraram custo; Skanska e Forest City Ratner se processaram |
| Mighty Buildings (EUA) | Impressão 3D de casas | — | ⚠️ Demissões + reestruturação confirmadas. **Fechamento NÃO confirmado** — classe B |

**Descartados por falta de evidência** (registrado para não repetir boato): **Blu Homes** não faliu
— foi adquirida pela Dvele em 2020. **Cover** (ADU, LA) segue operando em 2025.

---

## 3. Robótica: o padrão não é colapso, é estagnação

**SAM100** (robô pedreiro, Construction Robotics): comercial **desde 2015** — quase uma década — e
**nenhuma fonte publica número de unidades vendidas ou receita.** A economia só fecha em paredes
longas e retas; em geometria complexa o setup pode levar 1,5 dia, e obra de menos de duas semanas
pode ter retorno negativo. Aluguel ~US$20 mil/mês.

**Hadrian X** (FBR, Austrália): promete desde ~2018. Em 2024 completou **9 casas** certificadas na
Flórida — prova regulatória, não escala. Barreira central: código de obra varia por município,
aprovação num estado não vale em outro. Ação perto da máxima de 52 semanas — **não é colapso**, é
"quase uma década de demo antes de tração".

**Correção de hipótese:** eu suspeitava que a ICON/Wolf Ranch (100 casas impressas, Texas) estivesse
travada. A evidência (CNBC 03/2025, Reuters 08/2024) mostra que **abriu e está majoritariamente
vendida**. Demorou mais que o hype, mas entregou. Nem toda promessa ambiciosa quebra.

> 🚩 **Red flag reutilizável:** quando fornecedor de hardware nunca publica volume entregue — só
> "capacidade teórica" e vídeo de demo — a economia unitária não fechou, mesmo que a empresa viva.

---

## 4. A premissa da pergunta estava errada

Eu procurava "construtora comprou software caro e abandonou". O dado não sustenta isso. Sustenta
algo diferente e mais importante:

- Construção gasta **~1% do faturamento** em tecnologia, contra **3,5%** de média intersetorial
  e 7,2% em serviços financeiros (JBKnowledge ConTech Report, 10ª ed.)
- "71-85% ainda usam Excel para orçamento" aparece muito, mas **toda fonte é blog de fornecedor
  vendendo a alternativa** — classe C, viés óbvio. Uso direcional, não como número duro.

> **A maioria das construtoras médias e pequenas americanas nunca adotou software dedicado.
> Não chegou a abandonar.** Procore, PlanGrid e Fieldwire capturam a minoria sofisticada, não a média.

---

## 5. Sidewalk Labs — governança de dado mata o piloto

Não é construtech, mas é o caso mais bem documentado do padrão. Waterfront Toronto/Alphabet,
US$50M comprometidos, plano mestre após consulta a 21 mil moradores. **Cancelado em 07/mai/2020.**
Motivo oficial: pandemia. Motivo documentado **antes** do cancelamento: disputa de governança de
dados — a Sidewalk propôs um "civic data trust" independente em out/2018 e recuou em nov/2019.

Ecoa um padrão qualitativo relatado por quem conduziu dezenas de pilotos de IA em construtora
grande: **o fracasso não acontece durante o piloto — acontece na transição para escala**, quando
questões de propriedade de dado que ninguém levantou no piloto viram assunto de comitê.

> **Transferível direto:** decidir por escrito de quem é o dado (foto, áudio, RDO) **antes** do
> piloto começar. Não depois.

---

## 6. Padrão dos fracassos

1. **Ativo físico caro antes de unit economics provada** — Katerra (fábrica), Nexii, Modulous
2. **Capital abundante substitui disciplina** — efeito SoftBank; também Veev e Nexii
3. **Dependência de elo externo frágil** — Katerra/Greensill, Veev/rodada, Hadrian X/código de obra
4. **Ausência de número de volume publicado é ela mesma o sinal**
5. **Governança de dado resolvida tarde demais**

## 7. Sinais de alerta antes de construir

- Fornecedor divulga "capacidade" e "potencial de redução de X%", nunca "N clientes pagantes"
- Modelo exige construir/comprar ativo físico antes de contrato recorrente assinado
- Financiamento ou operação depende de **um** parceiro concentrado sem alternativa
- Ninguém decidiu por escrito de quem é o dado antes do piloto
- O pitch de escala nunca menciona o cliente médio — só o caso mais sofisticado do setor

## 8. Implicação para o IOX

O modelo do `00-context/CONTEXT.md` (setup fixo + recorrência, serviço e não plataforma) **já evita
o erro nº1** — não há fábrica nem hardware caro antes da venda. Mas os erros **nº3 e nº4 são
plenamente replicáveis**:

- **Dependência concentrada:** WhatsApp Business API, provedor de OCR, ERP do cliente. Checar se
  há alternativa **antes** de vender o squad como resolvido.
- **Prometer percentual sem piloto do próprio cliente:** o que a construtora média já viu é
  fornecedor prometendo e não entregando volume comprovado. **Essa cicatriz vai estar do outro
  lado da mesa** — e é exatamente por isso que "eu meço o seu antes e o seu depois" converte
  melhor que qualquer número de terceiro.

---

## Lacunas explícitas (não preenchidas com invenção)

- Revisão acadêmica ScienceDirect sobre adoção 1999-2023 — **403, paywall**
- Dados numéricos do AGC/Sage survey e Dodge SmartMarket ROI — atrás de captura de e-mail
- ⚠️ **"78% dos pilotos de IA de construção nunca passam de POC"** e "94% explorando vs 1,5% com
  implantação ativa" — **fonte primária NÃO confirmada. Tratar como rumor, não citar ao cliente.**
- Threads do r/ConstructionManagers sobre abandono — Reddit bloqueia (403)
- "Pilot purgatory" 70-80% — é dado de IA corporativa genérica, **não específico de construção**

## Fontes

[Katerra (Wikipedia)](https://en.wikipedia.org/wiki/Katerra) ·
[Credit Suisse × SoftBank/Greensill (GTR)](https://www.gtreview.com/news/europe/credit-suisse-loses-softbank-case-over-us440mn-greensill-losses/) ·
[Why Katerra Failed (Tactyqal)](https://tactyqal.com/blog/why-katerra-failed-lessons-from-construction-unicorns-collapse/) ·
[Veev shutting down (The Real Deal, 27/11/2023)](https://therealdeal.com/national/2023/11/27/modular-building-startup-veev-is-shutting-down/) ·
[SAM100 / bricklaying robots (Robot Today)](https://robottoday.com/article/construction-robotics-masonry-and-bricklaying-robots-the-poster-child-that-still-has-walls-to-climb) ·
[Sidewalk Toronto (Wikipedia)](https://en.wikipedia.org/wiki/Sidewalk_Toronto) ·
[Reinventing Construction (McKinsey, 2017)](https://www.mckinsey.com/capabilities/operations/our-insights/reinventing-construction-through-a-productivity-revolution) ·
[JBKnowledge ConTech Report](https://jbknowledge.com/contech-report/) ·
[Wolf Ranch 3D (CNBC, 12/03/2025)](https://www.cnbc.com/2025/03/12/inside-the-worlds-largest-3d-printed-housing-development.html) ·
[Wolf Ranch (Reuters, 08/08/2024)](https://www.reuters.com/world/us/worlds-largest-3d-printed-neighborhood-nears-completion-texas-2024-08-08/)
