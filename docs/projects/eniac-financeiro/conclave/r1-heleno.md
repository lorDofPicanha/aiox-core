# Conclave R1 — Heleno Taveira Torres (Direito Constitucional Tributário e Financeiro)

> Voto independente sobre as decisões A (partida dobrada/consolidação) e o eixo Reforma Tributária do produto **ENIAC Financeiro** (grupo de 3 CNPJs, gestão financeira + Open Finance + agentes IA).
> Premissa de papel: informo o **direito posto** e os **riscos de linguagem/modelagem**; não emito parecer fiscal nem orquestro apuração de tributo concreto. O produto **informa**, não **aconselha**.

---

## Decision A (fiscal)

**Veredito: partida dobrada append-only, sim — mas separe com rigor o que é exigência legal do que é conveniência de produto. O contador NÃO vai "exigir" que a sua ferramenta faça partida dobrada; ele vai exigir que ela não atrapalhe a escrituração que ELE é obrigado a fazer e que ela produza um lastro auditável que ele possa reconciliar.**

Três proposições, em ordem de firmeza constitucional/legal:

1. **Caixa simples NÃO é, por si, suficiente para o grupo — mas não pela razão que o arquiteto imagina.** A insuficiência não nasce da sua ferramenta; nasce do regime tributário de cada CNPJ. Há um espectro:
   - **Lucro Real** → escrituração contábil completa por partida dobrada é **obrigatória** (Lei 6.404/1976 art. 177; RIR/2018; SPED **ECD** e **ECF**). Aqui o livro-caixa é juridicamente insuficiente, ponto final.
   - **Lucro Presumido** → a lei admite **Livro-Caixa** com **toda a movimentação financeira e bancária** (RIR/2018) **como piso**. Mas há um gatilho decisivo: se a empresa quiser **distribuir lucros isentos acima do percentual de presunção**, isso só é lícito **com escrituração contábil regular** que comprove o lucro líquido contábil (jurisprudência consolidada do CARF). Para um **grupo familiar/coligado** — que é exatamente o caso ENIAC — distribuição de lucros é a norma, não a exceção. Logo, na prática, o Presumido do grupo **tende a precisar de contabilidade completa**.
   - **Simples Nacional** → **não** há obrigatoriedade de ECD (salvo exceções, p.ex. aporte de investidor-anjo); a LC 123/2006 (art. 26) admite escrituração simplificada/livro-caixa. **Porém** a NBC ITG 1000 (escrituração contábil simplificada) e o mesmo gatilho de distribuição de lucros acima do presumido reintroduzem a partida dobrada por via oblíqua.

   **Conclusão jurídica:** num grupo de 3 empresas de segmentos distintos, a probabilidade de que **pelo menos uma** esteja em regime que exige partida dobrada — ou que **todas** precisem dela para distribuir lucro com segurança — é altíssima. Construir só caixa simples seria modelar para o piso legal mais frágil e perder o grupo no primeiro encontro com o contador.

2. **A partida dobrada append-only é a decisão tecnicamente correta E juridicamente prudente — desde que o produto NÃO se anuncie como "a contabilidade" do grupo.** Aqui está o limite que defendo com veemência: o seu ledger é a **fonte financeira de verdade** (espelho fiel da movimentação, conciliada com Open Finance, append-only, auditável). Ele **alimenta** e **reconcilia** a escrituração oficial (ECD/ECF/SPED) que o contador habilitado produz e assina. Ele **não é** a escrituração oficial, **não substitui** o Livro Diário/Razão registrados, **não é** assinado por contador com CRC ativo. Vender o ledger como "sua contabilidade pronta" cria responsabilidade profissional indevida (CFC/CRC, monopólio do contabilista) e exposição fiscal. **Append-only é, inclusive, o que dá segurança jurídica**: imutabilidade + trilha de auditoria são a tradução técnica do princípio de que escrituração não se rasura — corrige-se por lançamento de estorno, nunca por sobre-escrita.

3. **O que o modelo de dados DEVE garantir (não-negociável para conformidade BR):**
   - **Regime/anexo por entidade**, nunca alíquota global. Cada CNPJ carrega `regime_tributario` (Real/Presumido/Simples) e, no Simples, `anexo` por CNAE. Isto governa qual obrigação acessória se aplica — é a chave de tudo.
   - **Segregação de livros por CNPJ desde o lançamento.** Plano de contas (CoA) **por empresa**; nenhum lançamento "do grupo" sem `company_id`. A consolidação é uma **view**, jamais um livro.
   - **Estorno por lançamento, não edição.** Append-only com `reversal_of` — espelha a regra de retificação contábil.
   - **Lastro do documento fiscal preservado e linkado** ao lançamento (NF-e/NFS-e crua + IDs), com os **campos de IBS/CBS** capturados separadamente (ver §Reforma).
   - **Data de competência ≠ data de caixa** modeladas como campos distintos — o contador trabalha por competência; o caixa é o seu Open Finance. Confundir as duas quebra reconciliação.
   - **Capacidade de exportar em formato reconciliável** (idealmente um layout que converse com SPED/ECD do contador), não um relatório fechado.

---

## Consolidacao 3 CNPJs

**Veredito: ofereça consolidação como camada GERENCIAL explícita e rotulada — nunca como demonstração contábil/fiscal consolidada. A separação dos livros é a linha vermelha legal; cruzá-la cria os três riscos abaixo.**

1. **A consolidação societária do art. 249 da Lei 6.404/1976 (e regras CVM) é instituto regulado, com perímetro, eliminações e responsabilidade próprios.** Ela se aplica a sociedades **controladoras** sobre **controladas** — não automaticamente a "3 empresas do mesmo dono". Se a ENIAC não for um grupo de controle nos termos da lei, uma "demonstração consolidada" emitida pela sua ferramenta seria **uma peça que se apresenta como algo que juridicamente não é**. Por isso o rótulo importa: chame-a de **"visão consolidada de gestão"** ou **"posição agregada do grupo"**, com disclaimer de que **não constitui demonstração contábil consolidada na acepção da Lei 6.404, nem peça fiscal**. Esse rótulo não é cosmético — é o que separa informação de afirmação fiscal/societária.

2. **Coligação/controle são gatilhos de regras anti-abuso — e o produto deve ser instrumento de transparência, nunca de planejamento agressivo.** Três focos:
   - **Distribuição disfarçada de lucros (DDL)** — RIR/2018 (arts. 528 e ss., na linha do antigo art. 60 do DL 1.598/77): negócios entre pessoas ligadas em **condições não-equânimes** (venda de bem por valor inferior ao de mercado, mútuo sem juros, etc.) são presumidos como distribuição disfarçada, com efeitos tributários. Um sistema que mostra **fluxos intercompany** lado a lado é exatamente onde a DDL fica visível — o que é **bom para compliance** e **perigoso se o produto sugerir "otimizar" esses fluxos**. O agente IA **não pode** recomendar movimentação entre as coligadas; pode, no máximo, **sinalizar** transações intercompany para revisão do contador.
   - **Preços de transferência entre partes relacionadas** — a Lei 14.596/2023 alinhou o Brasil ao padrão **arm's length** da OCDE. Embora o foco seja o transfronteiriço, a **lógica de equivalência econômica entre partes ligadas** (que é a mesma da DDL no doméstico) deve guiar o desenho: o produto **registra e evidencia** transações intercompany como classe própria; **não as mascara** em rateios opacos.
   - **Conluio / confusão patrimonial** — misturar caixa, contas e lançamentos das 3 empresas numa contabilidade única é o caminho mais curto para **desconsideração da personalidade jurídica** (CTN art. 50 do Código Civil; e responsabilidade solidária por interesse comum, CTN art. 124, I) e para autuação por grupo econômico de fato. **A arquitetura de livros separados com `company_id` é a sua melhor defesa jurídica** — ela prova segregação patrimonial.

3. **Como a ferramenta mantém os livros SEPARADOS e ainda entrega consolidação útil:**
   - **Escrituração**: 100% por CNPJ, isolada (RLS por `company_id`, CoA por empresa). Nenhum lançamento atravessa entidades.
   - **Consolidação**: apenas em camada de **leitura/relatório**, computada sobre os livros segregados, com **eliminação explícita e rastreável** de saldos e transações intercompany (mostrar o "antes e depois da eliminação"), e **rótulo gerencial** com disclaimer. Eliminação intercompany não é opcional — sem ela, a soma infla receita/despesa do grupo e vira número enganoso.
   - **Marcação intercompany**: toda transação entre os 3 CNPJs recebe flag `intercompany` + contraparte, para (a) eliminar na consolidação e (b) alimentar o radar de DDL/preço-de-transferência como **alerta para humano**, nunca como recomendação de movimentação.

---

## Reforma constraints

Verifiquei as datas. Os marcos abaixo são **direito posto/regulamentado**, não promessa — e impõem restrições duras a uma ferramenta que ingere documento fiscal.

1. **Destaque de IBS/CBS nos documentos fiscais eletrônicos a partir de 1º/ago/2026 (regulamentos de IBS/CBS publicados em abr/2026).** 2026 é **fase de teste assistida** (alíquota simbólica de ~1%, sem recolhimento financeiro obrigatório), mas:
   - A **carência de multa encerra em 31/jul/2026**; a partir de 1º/ago, **não-optantes do Simples** já ficam sujeitos a penalidade por falta de informação.
   - A partir de **03/ago**, documento emitido **sem os campos de IBS/CBS é rejeitado pelo autorizador** — trava emissão e operação.
   - **Constraint para o produto:** ingerir **layouts duais** (pré e pós-Reforma) em 2026; **capturar e armazenar os campos de IBS/CBS separadamente** (não jogar tudo num "valor de imposto" agregado). O produto **não pode prometer "crédito garantido"** — a não-cumulatividade plena é regra constitucional, mas o **regime de apropriação do crédito está em disputa** (crédito vinculado ao contribuinte; tese de condicioná-lo ao pagamento do elo anterior). O agente IA pode **registrar** o destaque informado na nota; **não pode afirmar** que o crédito está assegurado.

2. **NFS-e Nacional obrigatória para optantes do Simples a partir de set/2026 (e nova Nota Técnica adequando NFS-e a IBS/CBS e ao novo CNPJ).** Constraint: a lógica de **captura de receita/recebíveis** precisa falar o padrão **NFS-e Nacional** (API nacional), não só os emissores municipais legados.

3. **CNPJ alfanumérico — início em jul/2026 (IN RFB 2.229/2024).** Confirmado: a partir de jul/2026, **apenas novas inscrições** podem receber formato alfanumérico (atribuição aleatória — uma nova inscrição ainda pode sair numérica); **CNPJs existentes não mudam**; obrigatoriedade plena projetada para **2027**.
   - **Constraint inegociável de schema:** o campo CNPJ **NÃO pode** ser `numeric`/validado só por dígitos. Tratar como **string** com validação do **novo dígito verificador alfanumérico** desde o dia 1. As 3 empresas atuais provavelmente são numéricas, mas qualquer nova entidade do grupo (ou cliente futuro) quebra um schema numérico. Isto é mudança **estrutural**, não cosmética — barata agora, cara depois.

4. **O que o produto NÃO pode errar (linguagem):** nada de "apuração correta garantida", "imposto otimizado", "crédito assegurado", "sua contabilidade pronta". O produto **informa o direito posto** (o que diz a EC 132/2023, a LC 214/2025, o cClassTrib, o destaque obrigatório) e **evidencia** dados; quem **apura e assina** é o contador. Recomendo um **disclaimer tributário** padrão em toda superfície que toque tributo, e um **gate de linguagem fiscal** no copiloto (RAG com **citação obrigatória** da fonte normativa, nunca geração livre de afirmação fiscal).

---

## Maior risco

**O maior risco legal/fiscal para a ENIAC é o produto se posicionar (na fala de marketing, no copiloto ou no rótulo dos relatórios) como "a contabilidade/apuração consolidada do grupo" — e com isso (a) invadir o ato privativo do contador, (b) emitir uma "consolidação" que se apresenta como peça societária/fiscal que juridicamente não é, e (c) tornar visível e aparentemente "endossar" fluxos intercompany que disparam DDL / responsabilidade solidária de grupo econômico (CTN art. 124, I) / desconsideração da personalidade jurídica.**

A mitigação é arquitetural e textual, não jurídica-reativa: **livros segregados por CNPJ** (defesa de segregação patrimonial) + **consolidação rotulada como gerencial, com eliminação intercompany rastreável e disclaimer** + **copiloto que informa e cita, nunca aconselha apuração ou movimentação entre coligadas**. Esses três controles transformam o maior risco em maior diferencial de confiança.

---

## Where I could be wrong

1. **O contador da ENIAC pode preferir trabalhar fora da ferramenta.** Muito contador de grupo familiar tem ERP/software contábil próprio (Domínio/Sage, Calima, etc.) e vai querer que a ENIAC seja apenas **fonte de extrato conciliado + relatório**, não um pseudo-livro. Se for esse o caso, a partida dobrada interna do produto vira **infraestrutura invisível de reconciliação** (ótima), e qualquer ambição de "ser a contabilidade" é desperdício de escopo. **Pergunta a fazer ao cliente antes do PRD:** o contador quer um **export reconciliável** ou um **livro**? A resposta redimensiona a Decision A.

2. **Subestimei talvez a hipótese de as 3 empresas serem todas Simples de pequeno porte sem distribuição de lucro acima do presumido.** Nesse cenário estreito, o **livro-caixa seria de fato suficiente em lei** e a partida dobrada seria escolha de engenharia (conciliação/auditoria), não imperativo legal — meu "caixa simples não basta" enfraquece. Ainda recomendaria partida dobrada **pelo valor técnico**, mas a justificativa **jurídica** cairia. Confirmar regime/porte/política de distribuição de cada CNPJ é pré-condição.

3. **A linha entre "consolidação gerencial" e "demonstração consolidada" pode ser mais permissiva do que a tracei**, se a ENIAC efetivamente configurar grupo de controle (art. 249) e quiser usar a peça internamente. Mesmo assim, **emitir** algo que se pareça com demonstração consolidada sem contador responsável é risco que eu não correria — então erro, se houver, é **para o lado conservador**, e assumo isso conscientemente.

---

## Contrarguments que vou enfrentar (e minha réplica)

- **"Partida dobrada é over-engineering para um livro-caixa."** Réplica: não é, porque (i) pelo menos um dos 3 CNPJs quase certamente a exige por regime, (ii) distribuição de lucro acima do presumido a torna obrigatória mesmo no Presumido/Simples, e (iii) append-only/imutabilidade é a tradução técnica da segurança jurídica da escrituração. O custo é de schema; o benefício é defensabilidade.
- **"Consolidar 3 CNPJs é só somar."** Réplica: somar sem **eliminação intercompany** produz número fiscalmente enganoso e expõe a DDL; e apresentar a soma como "demonstração consolidada" invade instituto regulado (art. 249) e o ato do contador. Consolidar é eliminar + rotular + ressalvar.

## Fontes verificadas
- [Reforma Tributária: obrigatoriedade de IBS/CBS nas notas a partir de Ago/2026 (TecnoSpeed)](https://blog.tecnospeed.com.br/reforma-tributaria-obrigatoriedade-de-ibs-e-cbs/)
- [Reforma Tributária: 2026 traz novas obrigações e penalidades (Contábeis)](https://www.contabeis.com.br/noticias/77386/reforma-tributaria-2026-traz-novas-obrigacoes-e-penalidades/)
- [Reforma Tributária: marco de 1º de agosto de 2026 detalhado (Contábeis)](https://www.contabeis.com.br/artigos/76490/reforma-tributaria-marco-de-1o-de-agosto-de-2026-detalhado/)
- [CNPJ Alfanumérico — Receita Federal](https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/cnpj-alfanumerico)
- [CNPJ alfanumérico começa em julho de 2026 (Contábeis)](https://www.contabeis.com.br/noticias/75609/cnpj-alfanumerico-deve-comecar-em-julho-de-2026-focado-apenas-em-grandes-empresas/)
- [Escrituração contábil de optantes do Simples Nacional / distribuição de lucros (ConJur — Direto do Carf)](https://www.conjur.com.br/2023-ago-30/direto-carf-escrituracao-contabil-empresas-optantes-simples-nacional/)
