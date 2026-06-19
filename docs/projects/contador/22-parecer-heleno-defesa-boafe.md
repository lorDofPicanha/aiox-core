# Parecer Heleno Taveira Torres — A Trilha de Boa-Fé como Defesa (S-N1)

> **Consulente:** Conclave de arquitetura do produto "Contador" (apuração defensável da Reforma)
> **Questão (S-N1):** A defesa jurídica do moat pode migrar de "a máquina reproduz o resultado" para "o contador, com CRC, decidiu de boa-fé sobre evidência íntegra, rastreável e carimbada no tempo"? A distinção **re-verificação ≠ re-execução** (consenso C2 / patch P3 do conclave SOLID) sustenta num auto de infração / contencioso CARF?
> **Natureza deste documento:** análise doutrinária de apoio à decisão de PRODUTO. NÃO é parecer fiscal sobre apuração de contribuinte concreto, nem substitui advogado/contador habilitado no caso. O clone informa o direito posto e os riscos de linguagem.
> **Data:** 2026-06-15

---

## 0. Veredito em uma frase

**SIM, COM CONDIÇÕES.** A defesa de boa-fé fundada em evidência íntegra, rastreável e carimbada no tempo é **doutrinariamente sólida e processualmente útil** — mas ela **mitiga, não imuniza**: afasta com força a *qualificação* da multa (o dobro, 150%/100%) e municia a interpretação *in dubio pro contribuinte* do art. 112 do CTN; **não** afasta, por si só, o tributo devido nem a multa de ofício básica quando o erro material existir. O moat é real desde que o produto **jamais prometa o resultado fiscal** e mantenha o **humano no loop** como ato decisório registrado, não como carimbo cosmético.

---

## 1. A defesa de boa-fé sustenta no CARF? Sob que condições?

Parto do princípio, como é meu método, antes de descer à regra. A relação Fisco-contribuinte é, hoje, lida também pela **boa-fé objetiva** — o CARF já tratou conduta contraditória da Administração como violação à boa-fé e à lealdade que devem reger a relação tributária (a figura do *venire contra factum proprium*: o Fisco que abre prazo para o contribuinte corrigir e depois usa a própria correção como fundamento de multa). A boa-fé, portanto, **é categoria viva no contencioso**, não retórica.

Mas é preciso distinguir três planos, porque o produto não pode vendê-los como um só:

**(a) O tributo em si (obrigação principal).** A boa-fé **não extingue** o crédito tributário. Se a apuração estiver materialmente errada — cClassTrib incorreto, base a menor — o tributo é devido com juros, independentemente da pureza da intenção. *Aqui a trilha não salva o cliente do principal; ela protege o cliente e o escritório da escalada punitiva.*

**(b) A multa de ofício básica (art. 44, I, Lei 9.430/96 — 75%).** Esta acompanha o lançamento de ofício quase automaticamente. A boa-fé documentada **mitiga**, e em erro escusável pode afastar, mas não há garantia. É o terreno onde o art. 112 do CTN faz seu trabalho: *a lei que comina penalidade interpreta-se da maneira mais favorável ao acusado em caso de dúvida* quanto à natureza, circunstâncias materiais e graduação da penalidade. **Atenção à linha vermelha da própria norma:** o art. 112 só opera **havendo dúvida** — é mortal para o produto sugerir que ele transforma erro inequívoco em dúvida.

**(c) A multa qualificada (o dobro — 150%, hoje até 100% no novo regime).** É **aqui que a trilha de boa-fé tem seu maior poder.** A qualificação exige **dolo, fraude, simulação ou conluio comprovados** — e o ônus dessa prova é do Fisco. O CARF e a CSRF reiteradamente afastam a multa qualificada quando ausente prova de intuito fraudulento; planejamento tido por abusivo, sem dolo provado, não basta para qualificar. Uma trilha que demonstra **decisão humana fundamentada, sobre evidência íntegra, na base legal vigente ao tempo do fato gerador**, é exatamente o que **destrói a alegação de dolo**. Converte um possível auto qualificado em, no máximo, divergência interpretativa de boa-fé.

**Conclusão do plano 1:** a defesa sustenta-se sobretudo como **escudo contra a qualificação** e como **munição do art. 112** — não como apólice contra o tributo. O produto deve posicionar o moat exatamente nessa medida: *protege contra a multa que dobra e contra a presunção de má-fé*, não "garante que não haverá glosa".

---

## 2. O que a trilha PRECISA conter (vira requisito de schema)

Para que a evidência seja **oponível ao Fisco** e sobreviva a um perito em 2031, a trilha tem de ser auto-suficiente: deve provar *quem decidiu, sobre o quê, quando, com base em qual norma e em qual evidência, e que a decisão foi humana*. Requisitos, em linguagem de schema:

1. **Identidade do ato decisório + CRC do contador.** O `ator` do evento que materializa o apontamento/laudo deve ser o contador pessoa física **com CRC ativo**, não "o sistema". Ato privativo de profissional habilitado (Decreto-Lei 9.295/46) — sem isso, a defesa de "decisão profissional de boa-fé" não tem sujeito. *(Casa com P1/P17: discriminador `tipo_inferencia` e `ator`=contador-CRC nos atos privativos.)*

2. **Integridade por hash encadeado, versionado.** Cada evento carrega `hash` sobre **campos canônicos nomeados** (não `payload::text`) + `hash_ver` desde o gênese. A cadeia (`trilha_cabeca`) prova **não-adulteração posterior** — pré-requisito de qualquer valor probatório. *(P4/P5.)*

3. **Carimbo de tempo confiável.** Idealmente carimbo qualificado **ICP-Brasil / PAdES** (MP 2.200-2/2001 dá presunção de autenticidade aos documentos ICP-Brasil) sobre a raiz da cadeia. O carimbo prova **anterioridade** — que a decisão existia *antes* da fiscalização, e não foi fabricada para o auto. Sem prova de anterioridade, a trilha vira documento unilateral pós-fato, de baixíssimo peso. *(Casa com P14: Merkle-por-tenant, sem vazar a existência de outros tenants.)*

4. **Versão da base legal vigente no fato gerador.** O evento deve fixar **qual versão do cClassTrib/NCM/norma** estava vigente *na competência do fato gerador* — não a de hoje. A defesa de boa-fé é "decidi corretamente *conforme a regra que valia então*". Isso exige **bitemporalidade na própria decisão** (`vigencia` + `conhecida_em`), não só na base. *(Exatamente o B10/P22 do conclave — é juridicamente indispensável, não refinamento.)*

5. **A evidência que fundamentou a decisão.** O documento fiscal/NF que embasou o apontamento, congelado e referenciado por hash. Boa-fé exige base fática; "decidi no escuro" não é boa-fé.

6. **Registro de que foi decisão humana, não automática.** O discriminador `tipo_inferencia ∈ {humano_concierge, regra_deterministica, rag}` e o registro do **aceite/aprovação humana** do output da IA. Decisão automática de matéria fiscal por máquina é, ela própria, um risco (item 5 abaixo). A trilha tem de mostrar que a IA **sugeriu** e o contador **decidiu**.

7. **Versão do motor que produziu o insumo** (`ref.motor_versao`: regras-hash, modelo, prompt, golden-set). Não para "re-executar", mas para **declarar honestamente** o que a máquina era ao tempo da decisão — transparência é o que sustenta a boa-fé.

---

## 3. Re-verificação ≠ re-execução: o Fisco aceita? Onde está o risco real

Esta é a distinção mais delicada, e o conclave acertou em elegê-la como o achado central (C2). Minha leitura, com honestidade:

**O Fisco/CARF, em regra, NÃO exige que o contribuinte reproduza o algoritmo.** O que o auditor exige é: **(i)** que o documento apresentado seja **íntegro e anterior** (não adulterado, não fabricado pós-auto) e **(ii)** que a conclusão seja **verificável contra a norma e os fatos** — isto é, que um terceiro consiga *conferir* que, dada aquela evidência e aquela base legal, a decisão é defensável. Isso é **re-verificação**, e é exatamente o que o processo administrativo fiscal já faz com qualquer laudo, parecer ou perícia: ninguém manda o perito "rodar de novo o cérebro do contador de 2026"; confere-se o raciocínio documentado contra a prova.

**Onde está o risco real — e ele é concreto:**

- **A camada determinística (regras sobre cClassTrib/NCM) PODE e DEVE ser re-executável.** Se o produto a apresenta como "verificável" mas ela **não reproduz** o mesmo resultado por *drift* de base não-versionada, a credibilidade da trilha inteira desaba. Por isso o **verificador standalone (P16)** e a base versionada são inegociáveis: a parte que *promete* reprodutibilidade tem de **entregá-la de fato**.
- **A camada de IA/RAG NÃO pode ser apresentada como reproduzível.** Prometer re-execução de um LLM que estará morto em 2031 é prometer o que não se cumpre — e *prometer e não cumprir é o que quebra a defesa*, porque o Fisco then dirá: "vocês alegaram reprodutibilidade; reproduzam". A solução correta é **gravar o output da IA como artefato/evidência** (o que a IA sugeriu, com hash e carimbo) e sustentar que **a decisão foi do humano sobre aquele artefato** — não que a máquina se reproduz.
- **O risco-mestre:** confundir os dois níveis na *comunicação*. Se o material comercial diz "laudo re-executável" sem qualificar, cria-se uma promessa que a camada de IA não honra → expõe o produto e o cliente. **P3 está correto e é urgente:** corrigir a frase do §3.3.

Em suma: re-verificação é aceita **porque é o que o contencioso sempre fez com prova documental e laudo técnico**. O risco não está na tese; está em **prometer determinismo na camada onde ele não existe**.

---

## 4. Marco ago/2026: como muda a urgência e a natureza da defesa

A janela de 2026 é o relógio, e é mais sutil do que "obrigatoriedade começa". Sejamos precisos:

- A Receita sinalizou **2026 como ano de aprendizado assistido**: auto lavrado *exclusivamente* por descumprimento de obrigação acessória de IBS/CBS gera **intimação para sanar em até 60 dias**, e o atendimento **extingue a penalidade sem multa**. Há, portanto, uma **dispensa de multa em 2026** — porém **condicionada**.
- **A condição é a linha decisiva (art. 348, §1º, LC 214/2025):** *apenas o contribuinte que cumprir integralmente as obrigações acessórias* fica dispensado do recolhimento de IBS/CBS em 2026. Ou seja, **destacar correto na NFS-e Nacional é o que compra a dispensa.** Quem não cumpre/destaca errado **perde a dispensa** e cai no recolhimento + regime de penalidades (UPF de R$200; multas percentuais que escalam a 33/66/100% do tributo de referência em situações sensíveis).

**Tradução para a urgência e a natureza da defesa:**
1. **A urgência é de mitigação proativa, não de litígio reativo.** O valor do produto em 2026 não é "te defendo no auto"; é **"te mantenho no regime de dispensa"** — cumprindo a acessória corretamente *antes* do problema. A trilha de boa-fé é o registro de que o cumprimento ocorreu.
2. **A natureza da defesa em 2026 é cooperativa.** O sistema premia quem corrige no prazo de intimação. A trilha que prova "decidimos de boa-fé e corrigimos ao ser intimados" é exatamente o que extingue a penalidade — alinhada ao espírito do art. 112 e ao desenho de aprendizado assistido.
3. **Pós-2026 a defesa muda de figura:** acabada a dispensa, a trilha passa a operar no plano clássico — escudo contra qualificação e munição do art. 112. **O produto deve datar a sua promessa:** o que vale em 2026 (manter dispensa) não é o que vale em 2027+ (defender no contencioso).

Isto reforça o posicionamento já travado no contexto (D-§9): a Reforma é o relógio, e a defesa **muda de natureza ao longo da transição** — não prometer uma defesa única e atemporal.

---

## 5. Riscos / linhas vermelhas

**Onde a tese pode quebrar:**

- **Prometer resultado fiscal.** "Garantimos apuração correta", "crédito garantido", "sem risco de multa" — vocabulário proibido. Promessa de resultado **(i)** é falsa (o tributo independe de boa-fé), **(ii)** atrai responsabilidade civil contratual e **(iii)** desconfigura a própria boa-fé (quem garante o impossível não age de boa-fé). A formulação correta é informativa: *"organiza a evidência e registra a decisão profissional para sustentar a apuração perante o Fisco"*.
- **Apresentar a trilha como reprodutibilidade da IA** (item 3).
- **A IA "decidir" matéria fiscal.** Esta é a linha vermelha mais dura. Apuração e classificação tributária com efeito jurídico são **ato decisório que pressupõe responsável habilitado**. Se a arquitetura permitir que a máquina *decida e registre como decisão* sem aprovação humana individualizada, então: **(i)** a defesa de boa-fé perde o sujeito (não há profissional que tenha decidido); **(ii)** abre-se flanco de **exercício de atividade privativa por não habilitado** e de o produto **figurar como consultoria/parecer fiscal não autorizado**. **Human-in-the-loop não é recomendação de UX — é requisito de defensabilidade jurídica.** Sem decisão humana registrada, não há boa-fé do contador a invocar; há um software que apurou — e software não tem CRC.
- **Carimbo cosmético.** Se o "aceite humano" for um clique em massa, em lote, sem análise — o Fisco desqualifica como aprovação meramente formal. A trilha precisa registrar **decisão individualizada por apontamento sensível**, sob pena de o humano-no-loop ser tido por ficção.
- **Sugerir que a trilha imuniza contra glosa do principal.** Não imuniza. Vender isso é o caminho mais curto para frustrar o cliente e gerar litígio contra o próprio produto.

**O que NÃO prometer:** re-execução da IA; apuração correta garantida; crédito garantido; ausência de multa; imunidade ao tributo; decisão fiscal automática. O produto **informa o direito e organiza a prova** — não apura, não garante, não decide no lugar do profissional.

---

## 6. Veredito e condições inegociáveis

**A defesa de boa-fé fundada em re-verificação é DEFENSÁVEL — SIM, COM CONDIÇÕES.** É um moat real porque ataca o ponto mais caro do contencioso (a qualificação da multa e a presunção de dolo) com a prova que o Fisco efetivamente confere (evidência íntegra + anterior + decisão profissional fundamentada). Mas é mitigação, não imunidade, e quebra se mal comunicada.

**Condições inegociáveis (cada uma é requisito de schema/produto):**

1. **Ato decisório com sujeito habilitado:** `ator` = contador pessoa física com **CRC ativo** nos atos privativos; nunca "o sistema".
2. **Human-in-the-loop como decisão individualizada registrada** (não clique em lote) — é requisito jurídico, não de UX.
3. **Integridade por hash encadeado versionado** + **carimbo de tempo ICP-Brasil/PAdES** sobre a raiz (prova de anterioridade).
4. **Base legal versionada na competência do fato gerador** + **bitemporalidade na decisão** (`vigencia` + `conhecida_em`) — B10/P22.
5. **Discriminador `tipo_inferencia`** e **gravação do output da IA como artefato** (não como decisão), com a aprovação humana atrelada.
6. **Camada determinística genuinamente re-executável** (verificador standalone P16 + base versionada); **camada IA NUNCA apresentada como reproduzível** (corrigir §3.3 — P3, com sign-off meu).
7. **Vocabulário proibido banido** do produto e do material comercial: nada de "apuração correta/crédito garantido/sem multa". Linguagem informativa + disclaimer + parceiro tributarista habilitado para o caso concreto.
8. **Datar a promessa:** em 2026 a defesa é *manter a dispensa cumprindo a acessória* (art. 348, §1º); pós-2026 é *escudo contra qualificação e munição do art. 112*. Não vender defesa única e atemporal.

> A litigiosidade é inerente ao direito — não se esconde a controvérsia para vender certeza. O produto deve dizer, com todas as letras, o que protege e o que não protege. É essa honestidade que, no fim, *é* a boa-fé que se quer documentar.

— Heleno. A doutrina e os profissionais devem identificar os pontos que merecem ajuste; a segurança jurídica é o fim. 🏛️

---

### Fontes consultadas (verificação de dispositivos atuais — 2026-06-15)
- CTN art. 112 (interpretação mais favorável em caso de dúvida) e art. 44 Lei 9.430/96 (multa de ofício 75% / qualificada): [Jusbrasil – art. 112 CTN](https://www.jusbrasil.com.br/topicos/10576388/artigo-112-da-lei-n-5172-de-25-de-outubro-de-1966); [ConJur – Súmula 161 CARF e erro de classificação](https://www.conjur.com.br/2022-out-10/analice-castor-mattos-ilegalidade-sumula-161-carf/)
- Boa-fé objetiva no CARF / *venire contra factum proprium* e afastamento da multa qualificada (exige dolo/fraude provados): [APET – CSRF livra contribuintes de multa de 150%](https://apet.org.br/noticia/camara-superior-do-carf-livra-contribuintes-de-multa-de-150/); [Coimbra, Chaves & Batista – CSRF afasta 150% em planejamento abusivo](https://coimbrachaves.com.br/camara-superior-do-carf-afasta-multa-de-150-em-caso-de-planejamento-tributario-considerado-abusivo/); [JOTA – CARF afasta multa qualificada (ágio)](https://www.jota.info/tributos-e-empresas/tributario/carf-afasta-multa-qualificada-em-caso-de-agio-interno-09022022)
- Marco 2026 — dispensa condicionada e regime de penalidades IBS/CBS (LC 214/2025, art. 348 §1º; UPF/art. 341-C): [ConJur – peso do descumprimento das acessórias em 2026](https://www.conjur.com.br/2025-out-08/peso-do-descumprimento-das-obrigacoes-acessorias-da-reforma-tributaria-em-2026/); [Migalhas – multas por descumprimento das acessórias do IBS/CBS](https://www.migalhas.com.br/depeso/456715/multas-por-descumprimento-das-obrigacoes-acessorias-do-ibs-e-da-cbs); [Contábeis – penalidades de quem não destacar IBS/CBS em 2026](https://www.contabeis.com.br/noticias/74387/as-penalidades-que-vao-pesar-no-bolso-de-quem-nao-destacar-ibs-e-cbs-em-2026/)
- Carimbo de tempo / presunção de autenticidade ICP-Brasil: MP 2.200-2/2001 (referência normativa).
