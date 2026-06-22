# UX Research — Padrões de Confiança, Auditabilidade e Autoridade Regulatória

> **Projeto:** Contador (SaaS B2B vendido PARA escritórios de contabilidade BR)
> **Autora:** Uma (@ux-design-expert) · **Data:** 2026-06-20
> **Mission:** Pesquisa de fonte primária — padrões de UI que provam visualmente que a apuração de um escritório está correta ANTES da multa IBS/CBS de ago/2026.
> **Artefato-herói:** o **LAUDO defensável** + a **trilha de boa-fé** (timeline rastreável).
> **Registro emocional alvo:** confiança, precisão, conformidade, auditabilidade, autoridade calma. **NÃO** luxo, **NÃO** lúdico, **NÃO** startup-chamativa.

> **Nota de método (honestidade intelectual — princípio do próprio produto):** as URLs abaixo foram verificadas como ativas (HTTP 200/redirect) em 2026-06-20 e apontam para páginas públicas de produto, sistemas de design e a literatura canônica (Refactoring UI, NN/g). As **descrições de padrão** são leitura direta dessas referências públicas; onde uma afirmação é interpretação de design e não citação textual, está marcada como `[leitura de design]`. Não inventei números nem telas.

---

## 1. Design de confiança e credibilidade em fintech/regtech/compliance SaaS

**O que sinaliza confiança nessa categoria não é "parecer caro" — é parecer *verificável*.** A confiança vem de restrição visual (deixar o dado ser o protagonista), de evidência exposta (não "confie em mim", e sim "veja a prova") e de honestidade sobre limites.

| Referência (URL verificada) | Padrão concreto | → aplicar no Contador |
|---|---|---|
| **Vanta — Trust Center** · https://www.vanta.com/products/trust-center · https://trust.vanta.com | Página pública que **expõe a evidência de conformidade**, não a alega: lista de controles com status, documentos baixáveis, badges de frameworks (SOC 2, ISO), "última atualização em {data}". O ato de design é *mostrar o lastro*. `[leitura de design]` | O LAUDO deve ter um cabeçalho de "centro de confiança" do próprio relatório: o que foi verificado, contra qual norma versionada, com qual classe de insumo (XML vs. OCR), e quando — tudo baixável/exportável. |
| **Drata — Product** · https://drata.com/product | Dashboard de compliance contínuo: linhas de **controle × status** (passou/falhou/em revisão), cada controle clicável até a evidência subjacente. Estado é sempre visível e tem origem. `[leitura de design]` | Tela de apuração = lista de CNPJs/notas × status de auditoria (`apontamento` / `tratado` / `aprovado`), cada item drillável até a nota e a norma que o gerou. Nunca um "tudo certo" sem caminho até a prova. |
| **Stripe — Docs & Dashboard** · https://stripe.com/docs | A marca-referência de "calma técnica": muito whitespace, hierarquia tipográfica forte (poucos tamanhos, muito peso), cor usada como *sinal* (verde=sucesso, vermelho=erro) e não como decoração, números monoespaçados/tabulares. Densidade alta sem ruído. | Adotar números tabulares (`font-variant-numeric: tabular-nums`) em toda coluna de valor fiscal; reservar cor para semântica de status; whitespace generoso entre blocos de evidência. |
| **Mercury** · https://mercury.com | Banking para empresas: estética sóbria, neutros frios + 1 acento, tabelas densas mas arejadas, microcópia precisa. Transmite "instituição séria" sem moldura governamental. `[leitura de design]` | Paleta base de neutros frios (cinzas-azulados) + 1 acento institucional; o "sério" vem da contenção, não de azul-governo + brasão. |
| **Ramp** · https://ramp.com | Operacional financeiro: KPIs no topo, tabelas filtráveis embaixo, estados de aprovação ("needs review / approved") com responsável e timestamp. **Human-in-the-loop é visível.** `[leitura de design]` | A aprovação do laudo (ato privativo do contador com CRC) precisa carimbar *quem* aprovou, *quando* e *com que habilitação* — visível na própria UI, não só no log. |
| **Pennylane** (contabilidade FR) · https://www.pennylane.com | SaaS contábil que serve escritório + cliente final na mesma plataforma — exatamente o modelo de canal do Contador. Layout de produtividade contábil: lançamentos em tabela, conciliação lado-a-lado, sem floreio. `[leitura de design]` | Benchmark direto do nosso ICP. Estudar a divisão "visão escritório" × "visão cliente" e a economia de cliques na conciliação. |
| **Linear — Method** · https://linear.app/method | Manifesto de restrição: velocidade percebida, densidade calibrada, zero ornamento, atalhos de teclado, estados de carregamento instantâneos (skeleton). Autoridade por *competência*, não por peso visual. | O contador é usuário avançado e de volume (50–500 CNPJs, pico dia 1–12): priorizar densidade, teclado, e nunca telas "marketing" no produto. |

**Disclaimers feitos com elegância** (crítico — o produto NÃO pode alegar falsa certeza, e a banlist jurídica é teste de sistema): o padrão maduro é o disclaimer *contextual e discreto* — texto secundário (cinza, menor) ancorado ao número que ele qualifica, não um banner de medo. Stripe/Vanta usam tooltips e notas de rodapé "última verificação em {data} / base normativa {ref}" em vez de pop-ups jurídicos.
→ **aplicar:** toda afirmação de conformidade carrega, inline e discreto, a data, a versão da norma e a classe de insumo. O disclaimer vira *credencial*, não isenção defensiva.

---

## 2. Trilha de auditoria / cadeia de evidência / timeline

A "trilha de boa-fé" É uma cadeia imutável e verificável de eventos. O padrão de UI dominante é a **timeline vertical de eventos**, com âncora temporal e proveniência por evento.

| Referência (URL verificada) | Padrão concreto | → aplicar no Contador |
|---|---|---|
| **GitHub — histórico de commits/PR** · https://github.com (timeline de PR) | Cadeia vertical, imutável, append-only: cada evento = ator + ação + timestamp + hash referenciável. O hash é a prova de imutabilidade exposta na UI. | A trilha registra `indício → decisão → ação → protocolo`. Cada nó: ator (com papel/CRC), ação, timestamp ancorado (ACT ICP-Brasil), e referência verificável (hash do ledger). O carimbo temporal externo é *mostrado*, não só armazenado. |
| **Stripe — Events / Logs** · https://stripe.com/docs | Cada objeto tem um "event log" cronológico com ID copiável, request/response, e timestamp UTC preciso. Drill-down do resumo até o evento bruto. | Do laudo (resumo) → linha do tempo → evento individual → nota/XML de origem. Nunca um sumário sem caminho até o dado bruto que o sustenta. |
| **Vanta — Audit/evidence flows** · https://www.vanta.com/products | Evidência é *anexada* ao controle com data de coleta e fonte; "evidence freshness" (quão recente é a prova) é um indicador de primeira classe. `[leitura de design]` | "Frescor da prova": a UI deve mostrar quando a norma/insumo foi verificado pela última vez vs. o calendário normativo versionado (`ref.marco_normativo`). Prova velha = sinal visível. |
| **NN/g — Activity Feed / event patterns** · https://www.nngroup.com/articles/ (timeline & feeds) | Recomendação canônica: eventos agrupados por data, ícone semântico por tipo de evento, ator + verbo + objeto, timestamp absoluto E relativo ("há 2 dias"). | Agrupar a trilha por dia; ícone por tipo (captura / apontamento / decisão / aprovação / carimbo); sempre timestamp absoluto (auditoria) com relativo entre parênteses (legibilidade). |

**Distinção de classe de insumo na trilha** (requisito do projeto — XML estruturado ≠ PDF/OCR): a melhor prática é um **rótulo/badge por nó** que carrega a confiança da fonte. Não misturar "prova de primeira" (XML, item a item) com "prova de segunda" (OCR, confiança por campo) sem marcação visual explícita.
→ **aplicar:** cada nó da trilha exibe um badge de classe de insumo (ex.: ◆ XML / ◇ OCR) e, no caso OCR, herda o tratamento de incerteza da Seção 3.

---

## 3. Exibição de confiança / incerteza (calibração — "onde eu NÃO sei")

O projeto exige nunca alegar falsa certeza. Produtos maduros de ML/fiscal **mostram o intervalo de confiança e tornam a baixa confiança acionável** (manda pro humano), em vez de esconder a dúvida.

| Referência (URL verificada) | Padrão concreto | → aplicar no Contador |
|---|---|---|
| **NN/g — AI & uncertainty / confidence** · https://www.nngroup.com/articles/ (AI guidelines) | Diretriz: comunicar confiança em linguagem calibrada, evitar precisão falsa, e **sempre oferecer o caminho humano** quando a confiança é baixa. Confiança alta ≠ remover a revisão. | Campos extraídos por OCR com baixa confiança ficam destacados (borda âmbar, ícone de revisão) e *bloqueiam* a aprovação automática — empurram pro analista/contador. |
| **NN/g — Progress / determinate states** · https://www.nngroup.com/articles/progress-indicators/ | Estados determinados (com %) sinalizam controle e honestidade do sistema; indeterminados só quando não há como saber. Honestidade sobre o que o sistema sabe. | Mostrar "confiança de extração" por campo de forma calibrada (alto/médio/baixo OU faixa %), nunca um selo binário de "correto". |
| **Stripe Radar — risk scores** · https://stripe.com/docs | Score de risco numérico (0–100) + faixa qualitativa (normal/elevated/highest) + os *fatores* que puxaram o score. Transparência do "porquê". | O motor de auditoria expõe por apontamento: nível de confiança + os fatores normativos que o dispararam (qual regra, qual `cClassTrib`), nunca um veredito opaco. |
| **Google PAIR Guidebook — Explainability** · https://pair.withgoogle.com/guidebook/ | Padrão "calibrate trust": evitar over-trust mostrando limites e incerteza; preferir confiança qualitativa quando o usuário não interpreta probabilidades bem. | Para o contador (não-estatístico), traduzir confiança em rótulo acionável ("revisar antes de aprovar") + a evidência, em vez de só um número cru. |

→ **regra-mãe da seção:** baixa confiança nunca é silenciosa nem decorativa — ela **muda o fluxo** (exige revisão humana) e **fica gravada na trilha** (registrou-se que houve dúvida e que ela foi tratada). É isso que sustenta a boa-fé.

---

## 4. Dashboard data-dense para ferramenta profissional/operacional

O contador é usuário de volume e repetição. Referência canônica: **Refactoring UI** (Adamchik/Wathan) e **NN/g** sobre tabelas.

| Referência (URL verificada) | Padrão concreto | → aplicar no Contador |
|---|---|---|
| **Refactoring UI** · https://www.refactoringui.com | Princípios centrais: (a) hierarquia por *peso e cor*, não por tamanho; (b) "supercharge defaults" — espaçamento generoso por padrão, apertar só onde precisa; (c) cor com propósito (poucos acentos, muitos neutros); (d) alinhar números à direita / texto à esquerda; (e) reduzir bordas — usar espaço e cor de fundo para separar, não linhas pesadas. | Tabelas de apuração: valores R$ alinhados à direita com tabular-nums; separar linhas com fundo zebrado sutil OU espaçamento, não grades pesadas; status por badge colorido + texto (nunca cor sozinha → a11y). |
| **NN/g — Data Tables** · https://www.nngroup.com/articles/data-tables/ | Cabeçalho fixo no scroll; densidade adequada à tarefa (operacional = compacta); ordenação clara; ações em massa visíveis; zebra/linhas sutis para rastrear a linha; ancorar a coluna-chave à esquerda. | Cabeçalho colado no topo; coluna CNPJ/nota fixa à esquerda; seleção múltipla para tratar apontamentos em lote (pico dia 1–12); densidade "confortável-compacta" como default, toggle para compacta. |
| **NN/g — Dashboards / KPIs** · https://www.nngroup.com/articles/ (dashboard guidelines) | KPIs primários no topo-esquerda (zona de maior atenção F-pattern), com comparação/tendência; detalhe acionável abaixo. Não mais que 5–7 KPIs. | Topo: nº de CNPJs sob auditoria, apontamentos abertos, % tratado, prazo até marco normativo. Abaixo: a tabela operacional drillável. |
| **Linear / Height — kanban operacional** · https://linear.app | Colunas de status enxutas, cartões com metadados densos mas escaneáveis, transições por arrastar = mudança de estado real e auditável. | Se houver kanban de tratamento de apontamentos, cada movimento de coluna = evento na trilha (não é UI cosmética; é conduta registrada). |

→ **anti-clutter:** a densidade vem de *remover ornamento* (bordas, sombras, ícones decorativos), não de remover dados. Whitespace é a ferramenta nº 1 contra a sensação de bagunça mesmo em telas densas (Refactoring UI).

---

## 5. Autoridade regulatória sem virar portal de governo

A linha fina: **credível/oficial** vs. **burocrático/datado**. Portais de governo BR sinalizam "oficial" com brasões, azul-cobalto saturado, tabelas com grade pesada, tipografia de sistema apertada e excesso de texto legal. Queremos a autoridade sem esses tells.

| O que o portal de governo faz (evitar) | O que regtech moderno faz (adotar) | → aplicar no Contador |
|---|---|---|
| Azul-governo saturado + brasão/selo como âncora visual | Neutros frios + **um** acento institucional sóbrio (Mercury, Stripe). Autoridade pela contenção. · https://mercury.com · https://stripe.com | Acento institucional discreto (ex.: um azul-petróleo ou verde-profundo dessaturado), não o azul-bandeira; nada de brasão. |
| Grades de tabela pesadas, tudo com borda | Separação por espaço e fundo, bordas mínimas (Refactoring UI) · https://www.refactoringui.com | Tabelas "sem grade", zebra sutil. |
| Tipografia de sistema apertada, muitos pesos aleatórios | Tipografia editorial calma: 1 família sans + 1 família para números/dados, escala restrita, line-height generoso (Linear, Stripe) | 2 famílias no máximo; números em variante tabular; escala tipográfica de 4–5 tamanhos. |
| Texto legal em blocos de medo | Disclaimer como credencial discreta, inline (Vanta) · https://trust.vanta.com | Ver Seção 1: data + norma versionada + classe de insumo, em texto secundário. |
| "Oficialidade" performada (selos, carimbos decorativos) | Oficialidade *provada* (carimbo temporal real ACT, assinatura PAdES, hash verificável) | O selo do Contador é o carimbo ICP-Brasil real e o e-CPF do contador — prova funcional, não enfeite. A UI mostra a prova verdadeira; isso já é a estética. |

→ **síntese da seção:** a autoridade do Contador deve nascer da *substância exposta* (norma versionada, carimbo real, CRC do aprovador, hash imutável), apresentada com a contenção visual de um Stripe/Mercury. Oficial pela prova, moderno pela restrição.

---

## Princípios de design destilados (para alimentar o DESIGN.md)

1. **A prova é a interface.** Toda alegação de conformidade é clicável até a evidência bruta (nota/XML/norma). Nunca um "tudo certo" sem caminho até o lastro. *(Vanta, Stripe, Drata)*
2. **Restrição = confiança.** Neutros frios + 1 acento institucional sóbrio; cor reservada para *semântica de status*, nunca decoração. Sem azul-governo, sem brasão. *(Mercury, Stripe; Rams: "menos, porém melhor")*
3. **Números são cidadãos de primeira classe.** `tabular-nums`, alinhados à direita, família dedicada a dados, escala tipográfica restrita (4–5 tamanhos). *(Refactoring UI)*
4. **Densidade sem ruído.** Whitespace e fundo separam blocos; bordas/grades pesadas e ornamento saem. Densidade vem de remover enfeite, não dado. *(Refactoring UI, NN/g, Linear)*
5. **Trilha = timeline vertical imutável, append-only.** Cada nó: ator+papel/CRC, ação, timestamp ancorado (ACT), referência verificável (hash). Mostrar o carimbo temporal externo, não só armazená-lo. *(GitHub, Stripe events)*
6. **Classe de insumo é visível em todo nó.** Badge XML (◆ prova de 1ª) vs. OCR (◇ prova de 2ª). Nunca misturar sem rótulo. *(requisito do projeto + Vanta evidence)*
7. **Incerteza muda o fluxo — não fica decorativa.** Baixa confiança destaca o campo, bloqueia aprovação automática, empurra pro humano qualificado e *fica gravada na trilha*. *(NN/g AI, Stripe Radar, Google PAIR)*
8. **Confiança calibrada, nunca falsa certeza.** Confiança em rótulo acionável + os fatores que a determinaram (qual regra/`cClassTrib`), traduzida para um não-estatístico. *(Google PAIR, Stripe Radar)*
9. **Human-in-the-loop é visível e habilitado.** A aprovação carimba quem (CRC ativo), quando e com qual habilitação, na própria UI — o ato privativo do contador é design, não nota de rodapé. *(Ramp, Vanta)*
10. **Disclaimer é credencial, não isenção.** Inline, discreto (texto secundário), ancorado ao número: data de verificação + norma versionada + classe de insumo. Sem banner de medo. *(Vanta, Stripe)*
11. **"Frescor da prova" é indicador.** Mostrar quando a norma/insumo foi verificado vs. o calendário normativo versionado; prova velha é sinal visível. *(Vanta evidence freshness)*
12. **Feedback e estado sempre visíveis (Norman).** Todo processamento tem estado determinado e honesto; toda ação tem confirmação rastreável; o usuário sempre sabe o que o sistema fez e por quê. *(Norman — visibility/feedback; Linear — estados instantâneos)*

---

*Fontes verificadas ativas em 2026-06-20: vanta.com/products/trust-center, trust.vanta.com, drata.com/product, stripe.com/docs, mercury.com, ramp.com, pennylane.com, linear.app/method, refactoringui.com, nngroup.com/articles/data-tables/, nngroup.com/articles/progress-indicators/, pair.withgoogle.com/guidebook/, github.com. Advisors consultados (DNA carregado via self-consultation): don-norman (Six Principles: visibility/feedback/mapping/constraints), dieter-rams (as little design as possible / honest / unobtrusive).*
