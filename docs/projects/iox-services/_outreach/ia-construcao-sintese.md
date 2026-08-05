# IA na construção — síntese e desenvolvimento de ideias

**Fonte primária:** `IA_na_Construcao_Civil_Casos_Reais_e_Aplicacoes.docx` (01/Ago/2026, preparado
para o founder) — 15 seções, 22 tabelas, 24 referências.
**Cruzado com:** `aiox-site/01-research/02-dores-pme-brasileira.md` (pesquisa própria, 28/Jul) ·
lotes 01/02 de prospects · `iox-services/00-context/CONTEXT.md`.

---

## 1. O que o documento estabelece bem

**Catálogo de produto pronto (tabela 16).** Copiloto de obra · RDO inteligente por WhatsApp ·
Agente de compras · Assistente de contratos · Atendimento para incorporadoras · Painel executivo.
Cada um com entrega, comprador e indicadores. Isso poupa a etapa de inventar produto.

**Matriz de sequenciamento (tabela 15).** Impacto × complexidade × dependências:

| Solução | Impacto | Complexidade | Depende de |
|---|---|---|---|
| **RDO e atas automáticas** | **Alto** | **Baixa** | Fluxo de aprovação e modelo padrão |
| Assistente de documentos | Alto | Baixa a média | Documentos organizados e permissões |
| Automação de cotações | Alto | Média | Cadastro de fornecedores + ERP |
| Quantitativos por IA | Alto | Média | Plantas padronizadas |
| Previsão de prazo e custo | Alto | **Alta** | Histórico e dados consistentes |

**Discurso de venda (tabela 17)** — bate com o que a pesquisa de PME já tinha indicado:
não dizer "temos uma plataforma de IA", dizer "reduzimos o tempo de localizar informação".
Não dizer "vai gerar muita economia", dizer "o piloto mede o antes e o depois".

**A ressalva de ROI mais honesta do documento (seção 14):**
> "A economia de tempo só é um benefício financeiro **quando a capacidade liberada é utilizada**."

Isso protege contra a promessa que quase todo vendedor de IA faz e não entrega. Horas economizadas
que viram ócio não são economia — viram nada.

---

## 2. A convergência que decide o primeiro produto

Três fontes independentes apontam para o mesmo lugar:

| Fonte | Achado |
|---|---|
| Docx, tabela 15 | RDO/atas automáticas = **alto impacto, baixa complexidade** |
| Docx, tabela 16 | "RDO inteligente por WhatsApp" — comprador: **construtoras pequenas e médias** |
| Pesquisa PME (28/Jul) | **82%** dos negócios operam por WhatsApp · **3,9 h/dia** de atendimento · site próprio só 10% |

**WhatsApp não é conveniência de entrega — é a única interface que exige zero mudança de
comportamento no canteiro.** Mestre de obras não abre software novo. Ele já manda foto no
WhatsApp hoje; a diferença é que hoje essa foto morre no grupo.

---

## 3. A ideia que o documento não tem (e que junta tudo)

O documento trata **RDO diário** e **relatório mensal** como coisas separadas. Não são:
o relatório mensal é doloroso **exatamente porque ninguém coleta durante o mês**. No dia 30
alguém garimpa foto em grupo de WhatsApp, tenta lembrar o que aconteceu na semana 2 e monta
tudo às pressas.

> **Produto: coleta diária de 30 segundos via WhatsApp → o relatório mensal se monta sozinho.**

O mestre manda foto e áudio no fim do dia, como já faz. O sistema classifica por frente de
serviço, cruza com clima e cronograma, gera o RDO do dia e **acumula**. No fim do mês o
relatório de apresentação já existe — é agregação, não montagem.

**Por que isso é melhor que vender "automação do relatório mensal":**

| | Automatizar o relatório mensal | Coleta diária que vira relatório |
|---|---|---|
| Insumo | Material caótico de 30 dias atrás | Material fresco, com data e contexto |
| Qualidade da legenda | Adivinhar o que a foto mostra | O mestre acabou de dizer no áudio |
| Valor percebido | 1 entrega por mês | Valor visível todo dia |
| Barreira de saída | Baixa | **Alta** — vira rotina do canteiro |
| Posição | Fornecedor de relatório | **Dentro do fluxo de dados da obra** |

A última linha é a estratégica: quem tem a foto, o áudio e o avanço diário de todas as obras
tem a matéria-prima dos produtos seguintes — medição, previsão de custo, qualidade. **O RDO
não é o produto; é a tomada de dados que habilita o resto.**

---

## 4. Sequência de produto recomendada

| # | Produto | Por quê agora | Integração exigida |
|---|---|---|---|
| **1** | **RDO/relatório por WhatsApp** | Alto impacto + baixa complexidade + canal já usado + demonstrável | **Nenhuma** |
| 2 | Copiloto de documentos | Alto impacto, baixa-média complexidade; usa o acervo que ele já tem | Pasta/Drive |
| 3 | Assistente de contratos | Mesma base do #2, recorte de maior valor | — |
| 4 | Agente de compras | Alto valor, mas exige cadastro de fornecedor + ERP | ERP |
| 5 | Quantitativos / orçamento | Depende de planta padronizada — muitas PMEs não têm | — |
| ❌ | Visão computacional de EPI | **Adiar** — ver risco abaixo | Câmeras |
| ❌ | Previsão de custo / painel executivo | Complexidade alta, exige histórico consistente que a PME não tem | ERP + histórico |

**Critério que usei e que o documento não usa:** ele foi escrito para uma construtora *decidir
o que adotar*. Vocês são o *fornecedor*. Então pesa mais uma variável — **o que dá pra entregar
a um cliente novo sem tocar no sistema dele.** Integração com ERP alonga ciclo de venda,
cria dependência de TI do cliente e trava o piloto. O #1 não tem nenhuma.

---

## 5. Riscos que precisam entrar na proposta (tabela 13)

| Risco | O que fazer |
|---|---|
| **Responsabilidade técnica** | A IA sugere e alerta; **não** assina dimensionamento. Deixar escrito em contrato. |
| **Alucinação** | Resposta plausível e errada. Toda saída com fonte citada; revisão humana antes de sair. |
| **Documento desatualizado** | Resposta certa sobre revisão antiga ainda é erro. Controle de versão é parte do produto. |
| **LGPD / vigilância** | 🔴 Detecção de EPI por câmera **é monitoramento de trabalhador** — exige transparência, base legal e provavelmente sindicato. Motivo forte para não ser o produto #1. |
| **Dependência do fornecedor** | O cliente vai perguntar. Ter resposta sobre portabilidade de dado e modelo antes de ser perguntado. |

---

## 6. Como usar os números — e como não usar

O documento traz números fortes: 27 dias de cronograma recuperados (Andrade Gutierrez),
−70% de relatório manual (NCC), 790 horas e US$60 mil em revisão documental (Cleveland),
~98% de redução no tempo de orçamento preliminar (CONTECC).

**Quase todos são classe B ou C** — divulgados pelo cliente ou pelo próprio fornecedor da
tecnologia. Só o CONTECC é classe A (acadêmico), e o próprio documento ressalva que serve
para viabilidade, **não substitui orçamento executivo**.

Como isso entra na abordagem, dado que você não pode prometer resultado:

> ✅ "A NCC reportou queda de 70% no tempo de relatório manual — é caso publicado pelo
> fornecedor da plataforma, então trato como indicação de potencial, não como promessa.
> O que eu proponho é medir o seu antes e o seu depois."

> ❌ "Nossos clientes reduzem 70% do tempo de relatório." — não são seus clientes, e você
> não mediu nada.

Citar caso alheio **com a fonte e o nível de evidência** é honesto e, com empresário cético,
soa mais competente do que número redondo sem origem.

---

## 7. Piloto de 90 dias — o que aproveitar

A tabela 18 traz um plano em 5 blocos (diagnóstico → preparação → piloto → medição → escala).
Ele resolve o problema de precificação: **os dias 1–15 são exatamente o diagnóstico pago**
já desenhado — mapa do processo, linha de base e escopo. Vender esse bloco isolado é o
"me manda o material de um mês" com estrutura e nome.

E a regra do piloto (tabela 19) descarta escolha ruim de processo: **frequente, com volume
suficiente, e cujo antes seja mensurável.** Processo sem linha de base não vira piloto,
vira opinião no fim.

---

## 8. O que ainda não sabemos

1. Se as construtoras SC dos lotes 01/02 fazem RDO hoje — e em quê (papel, WhatsApp, Sienge, Mobuss).
2. Se o relatório mensal é exigido por contrato/financiador. Define se há prazo real.
3. Onde as fotos moram hoje. Se é só o celular do mestre, a ingestão **é** o projeto.
4. Se já compraram alguma plataforma e se frustraram — a pesquisa de PME registra que a falha
   que eles contam não é técnica, é **promessa quebrada e preço que muda**.

O item 4 é o mais perigoso e o mais explorável: se ele já se queimou, o diferencial não é
tecnologia, é **escopo fechado e preço que não muda** — que já está no formato de contrato
do `CONTEXT.md`.
