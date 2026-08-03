# Seção de resultado — o que a IA entrega nas empresas

**Data:** 02/Ago/2026 (rev. 3 — foco exclusivo em resultado de mercado, decisão do founder)
**Dados:** `iox-services/_outreach/research/` (7 fontes, 6 agentes)
**Status:** conteúdo. Construção segue `DIRECAO-ARTE.md` e o gate F4.

---

## 1. A tese da seção

> **A IA dentro de uma empresa faz três coisas: devolve tempo, aumenta margem e aumenta venda.
> Está medido.**

A seção fala **do mercado** — o que a tecnologia já entregou em empresas que a implantaram.
Cada número traz a empresa e a origem da informação.

---

## 2. O selo de origem

Cada número aparece com o rótulo de onde veio:

| Selo | Significado |
|---|---|
| ⬤ **Independente** | Instituto, universidade, governo, imprensa |
| ◐ **A empresa divulgou** | O próprio cliente publicou |
| ○ **O fornecedor divulgou** | Publicado por quem vendeu a tecnologia |

**Por que rotular:** quem mostra a origem do número está dizendo que leu a fonte. Site que exibe
"+300% de produtividade" sem origem é o padrão do mercado — e é exatamente o que faz o dono de
empresa desconfiar. O selo converte o número de alegação em informação.

---

## 3. RESULTADO 1 — Devolve tempo

**Frase da seção:** *"A primeira coisa que a IA tira da empresa é o trabalho que só consome hora."*

| Número | Empresa · o que foi automatizado | Selo |
|---|---|---|
| **+10.000 horas** liberadas por mês | Direcional — qualificação de leads | ◐ |
| **790 horas** e **US$ 60 mil** em 4 projetos | Cleveland Construction — revisão de documentos e contratos | ○ |
| **−70%** no tempo de relatório manual | NCC — controle de progresso de obra | ○ |
| **≈ 4.200 horas** em acompanhamento e consolidação | Mace — ampliação aeroportuária | ○ |

**Contexto do problema (⬤):** o empreendedor brasileiro gasta **3,9 h por dia** com atendimento ao
cliente — a maior fatia de uma jornada de 9,3 h *(Sebrae, Tempo do Empreendedor)*.

---

## 4. RESULTADO 2 — Aumenta a margem

**Frase da seção:** *"O que come a margem não é o preço. É retrabalho, atraso e processo que ninguém mede."*

| Número | Empresa · o que foi automatizado | Selo |
|---|---|---|
| **−75%** de retrabalho · layout **50% mais rápido** | Skanska — marcação de layout | ○ |
| **−4,3%** no custo de retrabalho por fábrica | Intel — controle de progresso | ○ |
| Processamento de nota **reduzido à metade** | JCP Construction — conferência de medição e nota | ○ |
| **−15,8%** de consumo em climatização · **US$ 42 mil/ano** | Edifício 45 Broadway, Nova York | ⬤ |
| **27 dias** de cronograma recuperados · prazo **−16%** | Andrade Gutierrez — infraestrutura | ○ |

---

## 5. RESULTADO 3 — Aumenta a venda

**Frase da seção:** *"Quem responde primeiro leva. E quase ninguém responde primeiro."*

| Número | Empresa · o que foi automatizado | Selo |
|---|---|---|
| **+30%** em leads · **+20%** em vendas | Emccamp — construtora de porte médio, 3 estados | ◐ |
| Ciclo de conversão de **~30 para 15 dias** | Eztec — consulta inteligente para corretores | ◐ |
| **−25%** no tempo médio de qualificação | Direcional | ◐ |

> **Destacar a Emccamp visualmente.** É construtora de porte médio, três estados, usando ferramenta
> de prateleira — não é big 5 nem P&D proprietário. É a prova de que o resultado não depende de ser
> gigante, que é a objeção nº1 do público do site.

---

## 6. Fechamento da seção

Curto, no registro do site — sem bloco explicativo longo:

> **Esses números não são meus. São de quem já mediu.**
> Cada um está com a empresa e com a origem. O seu ainda não existe — é o que a gente mede junto,
> antes e depois.

---

## 7. Regras de uso — não negociáveis

1. **Nenhum número sem empresa e sem selo.** Se não couber no layout, não entra na página.
2. **Nunca escrever "nossos clientes"**, "já entregamos" ou qualquer construção de autoria.
3. **Máximo 4-5 números por resultado.** Acima disso vira parede de estatística.
4. ❌ **Proibidos — fonte primária não confirmada:**
   - "78% dos pilotos de IA em construção nunca passam de POC"
   - "98% de redução no tempo de orçamento" (CONTECC — autoria não confirmada)
   - **MRV: "a assistente participou de 70% das vendas"** — duas fontes da mesma parceria dizem
     40% e 70%. Número contestado, não usar.

---

## 8. Posição no site

Entre `03-o-problema` e `04-casos-de-uso`.

O problema faz o dono se reconhecer · **o resultado mostra que existe saída** · os casos de uso
mostram como fica no ramo dele. Sem esta seção, o site vai da dor direto ao método e o leitor
nunca vê o motivo de agir.

---

## 9. Tratamento visual dos selos — **zero token novo**

A escada de alfa do `--ink` já codifica hierarquia. Mapeei força da evidência nela, sem criar
nada. Contrastes são os medidos em `DIRECAO-ARTE.md`.

| Selo | Fundo | Borda | Texto | Contraste |
|---|---|---|---|---|
| ⬤ **Independente** | `--bronze-soft` (10%) | `--bronze-ring` (22%) | `--ink-2` | **7,14:1** · AAA |
| ◐ **A empresa divulgou** | — | `--border` | `--ink-3` | **4,62:1** · AA |
| ○ **O fornecedor divulgou** | — | — | `--ink-3` | **4,62:1** · AA |

**O glifo** (⬤ ◐ ○) usa `--ink-4` — 3,15:1, acima do mínimo de 3:1 para elemento de interface.
O doc marca `--ink-4` como **"nunca texto"**, e a regra é respeitada: o glifo é marca de UI, o
rótulo ao lado é que carrega a informação e usa `--ink-3`.

**Por que só o ⬤ recebe bronze:** o bronze é o acento do site (eyebrow, CTA, número). Reservá-lo
à evidência independente faz o olho hierarquizar sozinho — o número mais confiável é o único que
brilha. Os outros dois se distinguem por presença ou ausência de borda, não por cor nova.

> ⚠️ **Não usar borda tracejada nos selos.** Ela já tem significado próprio no site — na §008,
> `"a borda tracejada é literal: isto ainda não existe no seu contrato"`. Reusar para nível de
> evidência embaralharia os dois sentidos.

---

## 10. Pendências (founder)

1. Confirmar a posição da seção (proposta: entre `03-o-problema` e `04-casos-de-uso`)
2. Entra como `03b-resultado.html` no mockup-v2 — **só depois do gate F4 abrir**
3. **Decisão pendente:** as três linhas do mockup atual que declaram ausência de case
   (hero, §001, §003) saem também, ou ficam?
4. A segunda linha do fechamento (§6) encosta no tema — cortar ou manter?
