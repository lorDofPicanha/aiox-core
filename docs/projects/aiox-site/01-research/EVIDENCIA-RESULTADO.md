# Evidência de resultado — números e estudos reais

**Data:** 2026-08-02 · **Para:** site TALOS, virada de argumento pedida pelo founder
**Pedido literal:** *"a ideia é vender o resultado, como a IA melhora negócios e como ela ajuda em
todos os tipos de negócio, a ideia é basear em números e estudos de casos reais"*

---

## Regra desta pesquisa

Cada número abaixo foi **aberto na fonte** — não veio da minha memória nem de agregador. Onde a
fonte primária não abriu (paywall), está marcado 🟡 **NÃO VERIFICADO** e **não pode ir para o site**.

Três números que eu "sabia" e estavam **errados**:

| eu tinha | correto | por quê |
|---|---|---|
| Brynjolfsson: +14% | **+15%** | 14% é o working paper NBER de 2023; a versão publicada no QJE (2025) diz 15% |
| BCG: "40% do grupo produziu melhor" | **+40% de qualidade** | a Forbes reportou errado; HBS e o paper dizem "human-rated performance by over 40%" |
| Sebrae: "44% das MPEs usam IA" | **não está na fonte** | circula na CNN Brasil; não aparece no material do Sebrae. **Descartado.** |

Isso é a razão de a regra existir. Um site que vende automação não sobrevive a um número errado.

---

## 1. O buraco — Brasil, dado primário

**Fonte:** Sebrae + FGV IBRE + Google · ~5.000 empresas · setembro/2025
🔗 https://agenciasebrae.com.br/dados/pequenos-negocios-abracam-a-inteligencia-artificial-para-otimizar-o-tempo-e-inovar/

| dado | valor |
|---|---|
| Familiaridade com IA generativa — MEI | 87% |
| Familiaridade com IA generativa — **MPE** | **96%** |
| Familiaridade com IA generativa — médias e grandes | 99% |
| Principal uso — MEI | marketing e divulgação (74%) |
| Principal uso — **MPE** | **marketing e divulgação (59%)** |
| Principal uso — **médias e grandes** | **análise de dados (67%)** |
| Resultado mais lembrado pela MPE | **economia de tempo (34%)** |

🔑 **A leitura que vira copy:** não é falta de acesso — 96% das MPEs já conhecem. É **destino de uso**.
A empresa pequena aponta a IA para *divulgação*; a grande aponta para *operação*. O ganho de operação
é o que ninguém do porte do cliente está pegando.

---

## 2. O que separa quem lucra de quem só usa

**Fonte:** McKinsey, *The State of AI* (pesquisa global recorrente)
🔗 https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai

- **~6% dos respondentes** são "AI high performers" — atribuem **5% ou mais do EBIT** ao uso de IA
  e relatam valor significativo.
- 🔑 **O redesenho de fluxos de trabalho tem o maior efeito** sobre a capacidade de a organização
  ver impacto no EBIT — **entre 25 atributos organizacionais testados.**
- High performers são **~3× mais propensos** a dizer que redesenharam fundamentalmente fluxos
  individuais de trabalho.

🔑 **Esta é a tese do site inteiro.** O que produz resultado não é a ferramenta — é **refazer o
fluxo**. É literalmente o serviço do Talos, e quem afirma isso é a McKinsey com amostra global,
não eu com opinião.

🟡 **NÃO VERIFICADO:** o "21% redesenharam ao menos algum fluxo" e o "~80% empilham IA sobre o
processo existente" apareceram em agregadores, não na página da McKinsey. Não usar no site.

---

## 3. O tamanho do ganho, quando é bem feito

### 3.1 Atendimento — o estudo mais forte que existe

**Brynjolfsson, Li & Raymond — "Generative AI at Work"**
*The Quarterly Journal of Economics*, vol. 140, nº 2, maio/2025 · **n = 5.172 agentes de suporte**
🔗 https://academic.oup.com/qje/article/140/2/889/7990658 · 🔗 https://www.nber.org/papers/w31161

- **+15%** em chamados resolvidos por hora, na média
- **+30%** para os agentes **menos experientes e menos qualificados**
- Os mais experientes: ganho pequeno em velocidade e **pequena queda de qualidade**
- Também: melhora o sentimento do cliente e **aumenta a retenção do funcionário**

### 3.2 Trabalho de análise e proposta

**Dell'Acqua, McFowland III, Mollick, Lifshitz-Assaf, Kellogg, Rajendran, Krayer, Candelon, Lakhani
— "Navigating the Jagged Technological Frontier"**
*Organization Science*, 2025 · Harvard Business School + BCG · **n = 758 consultores** (~7% da força
de consultores individuais da BCG) · 18 tarefas realistas
🔗 https://pubsonline.informs.org/doi/10.1287/orsc.2025.21838 · 🔗 https://aiinstitute.hbs.edu/navigating-the-jagged-technological-frontier/

- **+12%** de tarefas concluídas
- **+25%** de velocidade
- **+40%** de qualidade avaliada por humanos
- Abaixo da média de desempenho: **+43%** · acima da média: **+17%**

### 3.3 Redigir — o que toda PME faz o dia inteiro

**Noy & Zhang — "Experimental evidence on the productivity effects of generative AI"**
*Science*, 2023 · doi 10.1126/science.adh2586 · **n = 453 profissionais com formação superior**
· experimento pré-registrado, tarefas de escrita específicas da ocupação
🔗 https://www.science.org/doi/10.1126/science.adh2586

- **−40% no tempo** · **+18% na qualidade**
- **Comprimiu a distribuição de produtividade** — beneficiou mais quem tinha menor habilidade
- Reestruturou a tarefa: mais geração de ideia e edição, menos rascunho

### 3.4 Programação *(contexto — provavelmente fora do site, público errado)*

**Peng, Kalliamvakou, Cihon & Demirer** — arXiv 2302.06590, fev/2023 · GitHub Copilot
🔗 https://arxiv.org/abs/2302.06590

- **55,8% mais rápido** · **sem efeito** sobre concluir ou não a tarefa · maior ganho para
  desenvolvedores menos experientes

---

## 4. 🔑 O padrão que atravessa os quatro estudos

Quatro experimentos independentes, quatro tarefas diferentes, times diferentes, anos diferentes —
**a mesma direção**:

| estudo | tarefa | ganho médio | quem ganha mais |
|---|---|---|---|
| Brynjolfsson (QJE, n=5.172) | atender cliente | +15% | menos experientes: **+30%** |
| Dell'Acqua (Org. Science, n=758) | analisar e propor | +25% velocidade | abaixo da média: **+43%** |
| Noy & Zhang (Science, n=453) | redigir | −40% tempo | menor habilidade — distribuição comprimida |
| Peng (arXiv, GitHub) | programar | +55,8% | menos experientes |

🔑 **Tradução para o dono de PME:** a máquina não substitui o seu melhor funcionário — ela **puxa o
resto do time para perto dele**. É o argumento mais forte disponível para quem tem equipe pequena e
desigual, e é exatamente a empresa do cliente. Nenhum concorrente está usando isso.

---

## 5. O risco — e por que ele **vende** o serviço

**Mesmo estudo Dell'Acqua (BCG/Harvard):** para uma tarefa deliberadamente escolhida **fora da
fronteira** de competência da IA, os consultores que usaram IA foram
**19 pontos percentuais menos propensos a produzir a solução correta** do que os que não usaram.

🔑 A IA não só deixou de ajudar — **piorou o resultado**. É o achado que dá nome ao paper
("fronteira serrilhada"): a competência da IA é irregular, e de fora não dá para ver onde ela acaba.

🔑 **É o melhor argumento comercial do site, e é honesto:** o trabalho não é "colocar IA". É saber
**onde ela entra e onde ela não entra**. Um dono de PME que tenta sozinho está apostando em qual
lado da fronteira ele caiu. Isso também justifica, sem preço, por que existe alguém para contratar.

---

## 6. Tempo de resposta 🟡 — o argumento atual do hero

O hero do mockup-v2 diz *"No WhatsApp, quem responde primeiro leva"*. Os números clássicos:

- **MIT / InsideSales (Oldroyd, 2007)** — responder em 5 min vs 30 min: **21× mais chance de
  qualificar**, 100× mais chance de contato. Base: 6 empresas, 15.000+ leads, 100.000+ ligações.
- **HBR 2011, "The Short Life of Online Sales Leads"** (Oldroyd, McElheran, Elkington) — auditoria
  de **2.241 empresas**: resposta média de **42 horas**; **23% nunca responderam**.

🟡 **NÃO VERIFICADO NA FONTE.** O corpo do artigo da HBR está atrás de paywall e o
`hbr.org/2011/03/the-short-life-of-online-sales-leads` devolveu só cabeçalho. Os agregadores
divergem entre si (um atribui "2.241 empresas" e outro "2,24 milhões de leads" ao mesmo estudo —
sinal claro de telefone-sem-fio). **Decisão: não colocar número de tempo de resposta no site até
abrir o PDF.** O argumento qualitativo ("quem responde primeiro leva") não depende do número.

---

## 7. 🔴 O achado que muda a seção de casos de uso

**Procurei estudo de caso real por ramo (indústria · comércio · serviços · projeto e obra).
A evidência é fraca e não passa no critério deste projeto.**

O que se encontra:
- Números como *"IA reduz retrabalho em até 30% na construção"* circulam em blog de fornecedor,
  atribuídos genericamente à McKinsey, **sem link para o estudo**. "Até X%" não é resultado medido.
- Fonte brasileira do setor (WC MAC) é explícita: casos de manutenção preditiva com resultado real
  no Brasil são **"pontos fora da curva, restritos a empresas com altíssimo grau de maturidade
  digital"** — ou seja, **não é o público do Talos**. Prometer isso para PME seria vender fumaça.
- Os casos com nome que existem são de **Embraer, Siemens, Amazon**. Para um dono de PME brasileira,
  case de Embraer não é prova — é a confirmação de que "isso é coisa de empresa grande".

### A saída, que é melhor que o pedido original

**Organizar por TAREFA, não por ramo.** Motivo triplo:

1. **É o que a evidência rigorosa realmente mede.** Os quatro estudos da §3 mediram *atender*,
   *analisar*, *redigir*, *programar* — não mediram "varejo" ou "indústria".
2. **Responde melhor a pergunta do founder** (*"como ela ajuda em todos os tipos de negócio"*):
   a resposta honesta é que ela não ajuda por ramo — ajuda por tarefa, e **toda empresa tem essas
   tarefas**. Indústria, loja, escritório e obra todos atendem cliente, montam proposta, redigem
   documento e fecham relatório.
3. **É o que o demo da §5 já faz.** O motor do `mapear.ts` classifica **etapas**, não setores. Casos
   por tarefa e demo por tarefa passam a contar a mesma história.

O ramo continua existindo na página — mas como **exemplo da mesma tarefa em contextos diferentes**
("montar proposta" na indústria = orçamento de peça; no escritório = escopo; na obra = medição),
não como categoria com número próprio inventado.

---

## 8. Como cada número entra no site

| onde | o quê | fonte |
|---|---|---|
| Hero | promessa de resultado, **sem número** (o número vem logo abaixo, com fonte) | — |
| § O buraco | 96% conhecem · MPE usa para divulgação (59%) · grande usa para operação (67%) | Sebrae/FGV IBRE/Google |
| § A tese | redesenho de fluxo = maior efeito no EBIT entre 25 atributos · ~6% high performers | McKinsey |
| § O ganho medido | +15% (n=5.172) · −40% tempo (n=453) · +25%/+40% (n=758) | QJE · Science · Org. Science |
| § Quem ganha mais | +30% · +43% · compressão da distribuição | os mesmos três |
| § O risco | −19 pontos percentuais fora da fronteira | Dell'Acqua |
| § Casos | por **tarefa**, com o ramo como exemplo | §7 acima |
| Rodapé | lista de fontes com link, aberta | todas |

**Regra de renderização:** todo número na tela carrega **fonte + ano + tamanho da amostra** visível,
e o link vai para o estudo — não para uma matéria sobre o estudo. É o oposto do site de agência que
escreve "aumente suas vendas em 300%" sem rodapé. **A citação é o diferencial visual, não um
detalhe legal.**

---

## 9. O que continua valendo do CONTEXT.md §3

Nada aqui viola *"zero número inventado, zero logo de cliente que não é cliente, zero depoimento
fabricado"*. **Nenhum número deste documento é do founder** — todos são de terceiros, públicos e
citados. A linha do hero *"Sem case ainda. E eu não vou inventar um."* **fica**, e passa a trabalhar
a favor: é ela que autoriza o leitor a acreditar nos números de terceiro que vêm em seguida.

O site passa a ter dois pilares em vez de um:
- **A categoria entrega resultado** — provado por estudo de terceiro, citado.
- **O operador sabe operar** — provado pela máquina rodando ao vivo na §5.
