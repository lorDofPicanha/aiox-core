# Conclave R1 — Martin Fowler

> Núcleo financeiro multi-empresa ENIAC (3 cias, Open Finance + 4 agentes IA). Stack: Next 15 / Supabase Postgres / worker Railway / Claude.
> Lente: evolutionary design, refactoring, enterprise patterns (PoEAA), event sourcing, ledger/accounting patterns.

---

## Decision A

**Recomendação: partida dobrada append-only. Inequívoco. Isto NÃO é over-engineering — é o caso central onde o padrão se aplica.**

Vou ser claro porque há uma armadilha de raciocínio aqui. Meu princípio é "Match Complexity to Problem" — use Transaction Script quando ele basta, não tope o premium de CQRS/microservices sem justificativa. Um observador descuidado da minha obra concluiria "3 empresas é pequeno, logo livro-caixa simples". Está errado, e eis por quê: **a complexidade que justifica partida dobrada não é o volume de empresas — é a natureza do domínio.** O domínio aqui é dinheiro de múltiplas entidades que precisa conciliar contra Open Finance, consolidar entre coligadas, e sobreviver a auditoria fiscal na janela da Reforma. Esse domínio *já é* de partida dobrada, quer você modele explicitamente ou não. Livro-caixa simples não é "mais simples" — é o **mesmo problema com a estrutura escondida**, empurrando a complexidade pra dentro de cada query de conciliação e relatório.

Os argumentos, na minha ordem de peso:

1. **O custo de errar isto depois é assimétrico e brutal.** Esta é a aplicação mais pura do meu "First Make the Change Easy". Partida dobrada append-only é uma decisão de *fundação de dados* — está embaixo de todo o resto. Migrar livro-caixa→partida dobrada com 18 meses de transações ingeridas, categorizadas e consolidadas é uma cirurgia de coração aberto: você precisa *reinventar* a contrapartida de cada lançamento histórico (qual conta de resultado? com que data? com que taxa?) sem ter registrado a intenção na hora. É exatamente o tipo de mudança que não se faz em small steps — vira big-bang rewrite, que é o que eu mais condeno. Comprar o padrão certo agora é barato; ele não some quando você cresce. Livro-caixa simples é uma dívida técnica do quadrante *reckless/inadvertent* disfarçada de pragmatismo.

2. **Append-only com reverso = event sourcing aplicado corretamente, e aqui ele se paga.** Eu sou cauteloso com event sourcing — costumo dizer que as pessoas o adotam pelos motivos errados e pagam o preço da consulta. Mas a contabilidade é o **caso canônico onde o livro-razão imutável É o domínio**, não uma escolha de implementação. Não há "update de lançamento" no mundo real; há estorno. O modelo do arquiteto (`journal_entry.reverses_entry_id`, `CHECK Σdebit=Σcredit` em `journal_line`) é a tradução literal disso. Você ganha de graça: trilha de auditoria de 1ª classe, reprodutibilidade (`input_snapshot_hash`), e — crítico pra este produto — a capacidade de provar a um auditor *como* um número foi formado. Isso é fitness function de auditabilidade embutida no schema.

3. **A correção numérica do copiloto (o risco Sev-1 do projeto) depende disso.** O guardrail "LLM nunca inventa número; todo número vem de SQL sobre o ledger" só é confiável se houver um ledger com invariante de balanceamento garantido pelo banco. Caixa simples não tem o `Σdebit=Σcredit` — a integridade fica espalhada em lógica de aplicação, que o LLM e os 4 agentes podem corromper silenciosamente. **A partida dobrada é o que torna a correção *provável em vez de afirmada*** — exatamente a frase que o arquiteto usou, e ela está certa.

4. **Não confunda "partida dobrada" com "sistema contábil completo".** O *escopo* é onde você corta para não over-engineer: você precisa do invariante de dupla entrada, do append-only e do CoA por empresa com mapeamento consolidado. Você **não** precisa (ainda) de razões auxiliares, fechamento de período multi-moeda, depreciação, ou um plano de contas fiscal completo. Isso é "match complexity to problem" aplicado *dentro* da decisão, não contra ela. O núcleo é pequeno: ~5 tabelas e uma função de posting única (caminho único, validação única — bom design, elimina duplicação).

**Veredito A:** Partida dobrada append-only. É o padrão correto, não o ostentoso. A simplicidade que importa é a do *modelo de domínio*, e o livro-caixa só parece mais simples porque esconde a dívida.

---

## Decision C

**Recomendação: reimplementar partida dobrada direto no Supabase Postgres (single-stack). NÃO adotar Formance como microserviço agora. Discordo de tratar Formance como default.**

Esta é a decisão onde aplico meu teste mais famoso — **"You must be this tall to use microservices"** — e a ENIAC reprova na altura, de propósito e com razão.

1. **O premium de microserviço não está justificado, e Formance cobra o premium inteiro de cara.** Verifiquei: o uso em produção do Formance self-hosted é suportado *só* via o operator Kubernetes oficial. Isso significa que para usar Formance "de graça" (MIT) em produção você adiciona **um runtime Go + Kubernetes** a um time que escolheu Next/Supabase/Railway justamente para *não* operar Kubernetes. Isso é o microservices premium na veia: deploy independente, observabilidade própria, versionamento de contrato, e uma segunda fonte de verdade de dados que precisa ficar consistente com o Postgres da aplicação. Para 3 empresas, esse custo operacional e cognitivo é puro desperdício no quadrante errado.

2. **O acoplamento mais perigoso aqui é o *de consistência distribuída*, não o de código.** Se o dinheiro vive no Formance e tudo o mais (CoA, categorização, RLS por `company_id`, `of_transaction` cru, `correction_log`, embeddings, RLS LGPD) vive no Supabase, você criou uma fronteira de **dois sistemas que precisam concordar sobre a verdade**. Toda conciliação, toda consolidação, todo join entre "linha OF crua" e "lançamento" vira uma chamada cross-service ou uma sincronização eventualmente-consistente. Você troca um `JOIN` transacional por um problema de sistemas distribuídos — e sistemas distribuídos é onde a correção silenciosa vai morrer (e o projeto já tem a cicatriz do "miscount silencioso" do CRM Novo). Manter o ledger no **mesmo Postgres, na mesma transação ACID** que a ingestão e o RLS é o que torna a idempotência `(aggregator, external_id)` e o smoke test diário *realmente* garantidos.

3. **O padrão é maduro e copiável — não é território inexplorado.** Reimplementar dupla entrada em Postgres não é heroísmo arriscado; é um padrão bem documentado (o gist clássico do NYKevin, o "Books" imutável do Square, a série de ledger do Modern Treasury, e o ensaio do Paul Gross "Double-Entry Ledgers: the missing primitive"). O núcleo é: tabela `journal_entry`, `journal_line` com `CHECK Σdebit=Σcredit` validado por constraint/trigger, append-only, balanços derivados (view materializada ou tabela de saldo atualizada por trigger). Você consegue carregar os **invariantes do Numscript/TigerBeetle como um checklist de testes** — exatamente o que a síntese já propôs — sem importar o runtime deles. Isso é "comprar o padrão, construir a implementação simples".

4. **Caminho evolutivo — e é aqui que ganho o argumento de longo prazo.** A objeção legítima é "e se a ENIAC virar uma fintech de verdade, com milhões de postings/seg, multi-moeda, programabilidade Numscript?". Resposta: **a função de posting única é a sua costura (seam) de strangler fig.** Se você canaliza *toda* escrita no ledger por uma RPC (`post_entry`) — como o arquiteto já especificou —, então no dia em que Formance (ou TigerBeetle) se justificar, você reimplementa o *corpo* dessa função para escrever no novo ledger, com características de fitness function (latência, consistência) guiando a migração incremental, conta por conta. Você não fica preso. O Postgres-first **não fecha** a porta do Formance; ele só recusa pagar o pedágio antes de precisar. O inverso não é verdade: começar no Formance e querer voltar pro single-stack é o rewrite doloroso.

5. **Nuance honesta:** se a ENIAC já operasse Kubernetes, tivesse um time de plataforma, e o roadmap exigisse Numscript/multi-currency/altíssimo volume em 12 meses, eu reabriria isto — Formance é um software sério (Series A PayPal/Portage, jan/2025) e o Numscript é um DSL elegante para expressar postings atômicos. Mas "context determines correctness": *este* contexto (3 cias, stack serverless+Supabase, time enxuto, diferencial = consolidação + agentes IA, não infra de movimento de dinheiro) aponta firme para single-stack. Construa o moat (consolidação + 4 agentes); não construa nem opere a commodity de infra de ledger distribuído antes da hora.

**Veredito C:** Ledger de partida dobrada **dentro do Supabase Postgres**, atrás de uma RPC de posting única. Formance fica como *opção futura documentada no ADR*, destravada pela seam, não como dependência do dia 1.

---

## Top risk

**O maior risco da minha posição é o de correção do ledger-em-Postgres feito à mão: garantir o invariante `Σdebit = Σcredit` e a imutabilidade sob concorrência, replays de webhook e os 4 agentes escrevendo.** Formance teria esse invariante *battle-tested* embutido; ao reimplementar, a corretude da dupla entrada passa a ser responsabilidade do nosso código e dos nossos testes. Se a constraint vazar (ex.: validação só na aplicação e não no banco, ou uma race em saldo cacheado), o ledger desbalanceia silenciosamente — e um ledger que não bate é pior que não ter ledger.

**Mitigação (inegociável no ADR):** (1) o invariante de balanceamento mora em **constraint/trigger no Postgres**, nunca só na aplicação — a RPC `post_entry` é o *único* caminho de escrita e roda a validação dentro da transação; (2) saldos são derivados (view materializada / soma) ou, se cacheados, atualizados por trigger na mesma transação, nunca por código de aplicação; (3) uma **suíte de testes de propriedade** que afirma "soma de todo o ledger = 0" e "toda conta = soma das suas linhas" rodando em CI + no smoke test diário; (4) os invariantes do TigerBeetle/Numscript viram a checklist explícita desses testes. Com isso, eu *manufaturo* a confiança que o Formance entregaria pronta — e a mantenho no meu stack, na minha transação.

---

## Where I could be wrong

- **Decisão C, o cenário fintech:** se o conhecimento de negócio que eu não tenho disser que a ENIAC pretende virar movimentação de dinheiro programável (Pix em escala, contas internas multi-moeda, ledger como produto), então estou subdimensionando e o adversário tem razão em pedir Formance/TigerBeetle desde já — porque a seam de strangler fig tem um custo de migração que não é zero, e adiar pode ser mais caro que adotar. **Meu argumento depende de a infra de ledger NÃO ser o diferencial da ENIAC.** Se for, eu cedo.
- **Decisão C, custo de reimplementar > eu admito:** o adversário mais forte dirá que "padrão maduro e copiável" subestima o long tail — multi-moeda, fechamento de período, estornos parciais, intercompany netting correto na consolidação (e há a armadilha anti-conluio Lei 6.404 que a síntese levantou). Cada um desses é uma feature de ledger que o Formance/Numscript já modelou e que eu vou ter que escrever. Minha defesa é a seam + escopo mínimo no MVP, mas reconheço que a *cauda* da contabilidade é mais longa do que "5 tabelas" sugere, e que minha estimativa de esforço é otimista.
- **Decisão A — onde eu NÃO cedo:** se alguém argumentar "livro-caixa simples é suficiente pro MVP, dá pra evoluir depois", eu rebato com força: essa é precisamente a evolução que *não* se faz em small steps. É o único ponto da arquitetura onde eu pago o custo de fundação adiantado sem pestanejar. Aqui meu "evolutionary over revolutionary" se inverte: evoluir o modelo de dados financeiro depois É a revolução dolorosa que estou tentando evitar.

---

### Fontes
- [Formance Ledger — GitHub (produção via k8s operator)](https://github.com/formancehq/ledger)
- [Formance Ledger — Introduction (docs)](https://docs.formance.com/modules/ledger/introduction)
- [Formance — What is Numscript](https://www.formance.com/blog/engineering/numscript)
- [NYKevin — Basic double-entry bookkeeping for PostgreSQL (gist)](https://gist.github.com/NYKevin/9433376)
- [Square — Books, an immutable double-entry accounting database](https://developer.squareup.com/blog/books-an-immutable-double-entry-accounting-database-service/)
- [Modern Treasury — How to Scale a Ledger, Part V: Immutability and Double-Entry](https://www.moderntreasury.com/journal/how-to-scale-a-ledger-part-v)
- [Paul Gross — Double-Entry Ledgers: The Missing Primitive in Modern Software](https://www.pgrs.net/2025/06/17/double-entry-ledgers-missing-primitive-in-modern-software/)
