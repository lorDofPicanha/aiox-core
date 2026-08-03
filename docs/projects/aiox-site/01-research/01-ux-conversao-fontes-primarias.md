# Fase 1a — Research UX/conversão para site de serviço B2B

**Data:** 2026-07-26 · **Método:** fontes primárias (NN/g, Baymard). Sem clone canalizado por nome.
**Pergunta que a pesquisa responde:** o que faz um dono de empresa confiar em um prestador de
serviço que ele acabou de descobrir — e o que faz ele fechar a aba.

---

## 1. A janela é de 10 segundos (e é medida, não opinião)

NN/g analisou **205.000 páginas** com 10.000+ visitas cada, totalizando **mais de 2 bilhões de
durações de visita**, modeladas com distribuição Weibull.

| Janela | O que acontece |
|---|---|
| 0–10 s | Triagem impiedosa. Taxa de abandono altíssima. É aqui que se decide |
| 10–30 s | Avaliação secundária. Ainda muito provável sair |
| 30 s+ | A curva **achata**. Quem passou disso costuma ficar 2+ minutos |

Homepage média retém **~30 segundos**; site inteiro, menos de 2 minutos antes do abandono.

> Recomendação literal do estudo: *"para ganhar vários minutos de atenção do usuário, você precisa
> comunicar sua proposta de valor em 10 segundos."*

**Implicação de projeto:** o hero não é decoração — é o produto inteiro comprimido. Se a animação
do hero leva 3 s para revelar a headline, você queimou 30% da janela.

---

## 2. Os 4 fatores de credibilidade

Jakob Nielsen formulou em 1999; NN/g revalidou em estudo com usuários de **EUA, Reino Unido e
Singapura**. Achado: *"os fatores básicos usados para avaliar confiabilidade foram os mesmos,
independentemente de local e cultura"*. 17 anos de estabilidade.

### 2.1 Design quality
- Navegação clara demonstra entendimento da necessidade do usuário. Nome de categoria ambíguo → abandono.
- Cor comunica categoria: participantes em Singapura foram atraídos por empresas de limpeza que
  usavam verde e muito branco — coerência com a expectativa de "limpo".
- **Typo, link quebrado e erro degradam credibilidade imediatamente.**

### 2.2 Upfront disclosure
- Contato, faixa de preço, escopo, taxas — visíveis, não escondidos atrás de formulário.
- Um participante rejeitou uma empresa **em 35 segundos**: *"eu definitivamente não usaria a
  HomeCleanz porque eles não informam a taxa."*
- Formulário longo de orçamento gera atrito. **Faixa com itens de linha visíveis funciona melhor.**
- Conteúdo atrás de login gera impressão negativa mesmo quando é tecnicamente necessário.

### 2.3 Conteúdo completo, correto e atual
- **O achado mais importante para este projeto:** para serviços, as fotos devem mostrar **todos os
  estágios**, não só o resultado. Em serviço de limpeza, os usuários queriam ver os **trabalhadores
  em ação** — não só o quarto impecável.
- Cobertura estreita afasta: empresa de mudança que parecia priorizar corporativo espantou o
  cliente residencial; empresa que só mostrava imóvel de alto padrão espantou quem tem casa menor.

### 2.4 Conexão com o resto da web
- *"As pessoas confiam mais em depoimentos de sites externos do que nos listados no próprio site."*
- **Todos os participantes** afirmaram que leriam reviews antes de contratar.
- Site isolado de redes sociais, sites de review ou cobertura de imprensa parece **não-estabelecido
  ou suspeito**.

---

## 3. Trust signals têm ponto ótimo — empilhar destrói

Baymard, sobre densidade de sinais de confiança:

| Sinais na página | Efeito na conversão |
|---|---|
| 0 | baseline |
| **1–3 tipos** | **+23%** vs. nenhum |
| 7+ tipos | **−8%** vs. 1–3 tipos |

Selo demais lê como insegurança. Escolha 2–3 e faça bem.

---

## 4. B2B decide em grupo — projete para dois públicos

Relatório B2B da NN/g: **419 páginas, 188 guidelines, 293 sites B2B testados** em EUA, Reino Unido
e Singapura (usability testing + focus group + site visit + diary study + heurística).

Achados estruturais:
- Projete para o **usuário** e para o **decisor** — não são a mesma pessoa.
- O site precisa dar ao seu contato **o material para justificar a contratação internamente**.
- Tarefas centrais do comprador B2B: comparar, compartilhar opções com o time, montar shortlist,
  pedir informação.
- Complexidade do serviço não justifica experiência difícil.

---

## 5. Quebra de confiança é assimétrica

NN/g: *"uma única violação de confiança pode destruir anos de credibilidade lentamente acumulada."*
Comportamento medido após falha técnica: 29% voltam depois · 52% dividem lealdade · **19% abandonam
permanentemente**.

Typo e navegação ruim comunicam desprezo pelo usuário. Prática enganosa deixa marca duradoura.

---

## 6. Motion — o que a evidência realmente sustenta

⚠️ **Aviso de qualidade de fonte.** A busca sobre motion/animação retornou majoritariamente content
marketing de agências de motion design vendendo motion design. O número que circula ("motion
aumenta conversão em até 80%") vem de **blog de agência, não de estudo revisado**. Não está sendo
tratado como evidência neste documento.

O que se sustenta:
- Animação precisa ter **função**: ajudar a entender o produto ou guiar ao próximo passo. Se não
  tem, remova — animação bonita distrai do objetivo de conversão.
- Há sinal consistente de que público B2B anda **cético com conteúdo polido demais**; autenticidade
  com motion proposital bate produção alta e vazia.
- Consistência visual e funcional entre páginas é requisito de confiança; inconsistência gera
  desconfiança.

**Postura adotada para este projeto:** motion serve à demonstração (mostrar a máquina funcionando),
nunca à ornamentação. Toda animação precisa passar no teste "isso explica algo ou move alguém?".

---

## 7. Tradução direta para o site AIOX

| Achado | Decisão de projeto |
|---|---|
| 10 s decidem | Headline + prova visual acima da dobra, sem delay de animação |
| Fotos de todos os estágios | Demo do processo rodando > case escrito. Resolve o "não tenho resultado real" |
| Rejeição em 35 s por falta de preço | Faixa de investimento visível, com itens de linha. Nada de "consulte" |
| Depoimento externo > interno | Sem depoimento fabricado. Quando houver cliente, apontar para fonte externa |
| 1–3 trust signals, não 7+ | Escolher 2–3 provas fortes e não empilhar selo |
| Dois públicos (usuário + decisor) | Uma seção que o contato possa mandar pro sócio/diretor justificar |
| Site isolado = suspeito | Presença externa mínima antes do lançamento (LinkedIn/GitHub ativos linkados) |
| Typo mata credibilidade | Revisão de copy é gate, não etapa opcional |

---

## Fontes

- [NN/g — How Long Do Users Stay on Web Pages?](https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/) — 205k páginas, 2bi visitas, Weibull
- [NN/g — Trustworthiness in Web Design: 4 Credibility Factors](https://www.nngroup.com/articles/trustworthy-design/) — estudo US/UK/Singapura
- [NN/g — Trust or Bust: Communicating Trustworthiness in Web Design](https://www.nngroup.com/articles/communicating-trustworthiness/)
- [NN/g — B2B Website Usability Report](https://www.nngroup.com/reports/b2b-websites-usability/) — 419pp, 188 guidelines, 293 sites
- [Baymard Institute](https://baymard.com/) — densidade de trust signals
