# 04 â€” Newman R2: As Fronteiras Sob Fogo Cruzado (Rodada 2 Adversarial)

> **Autor:** Sam Newman (mind clone) Â· **Conclave SOLID â€” Rodada 2 (adversarial)** Â· **Data:** 2026-06-13
> **Insumo:** minha R1 (`04-newman-fronteiras-cupid.md`) + as 4 anÃ¡lises de R1 (Uncle Bob `01`, Fowler `02`, Kleppmann `03`, Beck `05`) + alvo (`17`, `16/02`).
> **Lente:** fronteiras de mÃ³dulo, information hiding, ACL/anti-corruption, CUPID (Dan North â€” propriedades, nÃ£o princÃ­pios).
> **Modo:** refutar de verdade, citar pelo nome, ceder onde devo ceder, e fechar com um patch v1.1 que eu defendo num auto de infraÃ§Ã£o â€” nÃ£o num quadro branco.

---

## 0. Onde a sala estÃ¡ alinhada â€” e por que isso me preocupa

Cinco revisores independentes, sem se ver, convergiram em **trÃªs** achados idÃªnticos: (1) o ciclo `coreâ†”gestao` materializado em FK na migration 001; (2) o motor versionado como string em jsonb em vez de entidade; (3) o dialeto do provider vazando para dentro de `core.nota`. Quando cinco pessoas que nÃ£o combinaram apontam o mesmo buraco, o buraco Ã© real â€” isso Ã© tranquilizador.

O que me preocupa Ã© o **oposto**: a convergÃªncia estÃ¡ a esconder uma divergÃªncia de *prescriÃ§Ã£o* que ninguÃ©m nomeou. Uncle Bob quer um pacote de domÃ­nio TypeScript (`@contador/dominio`) com mÃ¡quina de estados, ato privativo e semÃ¢ntica de cadeia â€” domÃ­nio puro, framework como detalhe. Beck quer cortar metade da F1 e escrever o primeiro teste hoje. Eu quero o mÃ­nimo de fronteiras *enforced* e nada de cerimÃ´nia. **Essas trÃªs receitas nÃ£o somam â€” elas competem por um runway de um dev.** Concordar no diagnÃ³stico e empilhar as trÃªs curas Ã© exatamente como a v1.0 chegou a "26 incorporadas, 0 rejeitadas" â€” o erro que o Beck (com razÃ£o) chama de comitÃª. EntÃ£o minha R2 nÃ£o vai sÃ³ somar N-W14, N-W15. Vai dizer **onde a cura do colega Ã© cara demais** e o que fica no lugar.

---

## 1. REFUTAÃ‡Ã•ES â€” citando quem

### 1.1 Contra Uncle Bob: o pacote `@contador/dominio` Ã© a abstraÃ§Ã£o especulativa que ele mesmo proÃ­be (CUPID > Clean Architecture aqui)

Uncle Bob (P-UB6) quer um pacote TS de domÃ­nio com zero dependÃªncia de framework: mÃ¡quina de estados, materialidade, `podeAprovar(usuario, apontamento)`, semÃ¢ntica de evento, funÃ§Ã£o pura `hashEvento(...)`, lookup de vigÃªncia â€” e as RPCs/triggers viram "cascas finas" conferidas contra o domÃ­nio por teste de equivalÃªncia. Ele chama isso de defense-in-depth: duas cÃ³pias do invariante, a do domÃ­nio e a do banco.

**Duas cÃ³pias do invariante Ã© dual-write de lÃ³gica.** Bob passou a R1 inteira (com razÃ£o) caÃ§ando dual-write de *dados* â€” e a cura dele para o domÃ­nio Ã‰ um dual-write de *comportamento*: a transiÃ§Ã£o de estado existe no trigger plpgsql E no pacote TS, e um teste de CI tem que provar que as duas concordam para sempre. Em um time de 50, com um time de plataforma cuidando do teste de equivalÃªncia, talvez. Em **um dev**, isso Ã© duas implementaÃ§Ãµes da mesma regra para manter sincronizadas sob pressÃ£o de entrega â€” e a segunda sexta-feira apertada, uma das duas sai de sincronia e o teste de equivalÃªncia ou vira flaky-ignorado ou vira o gargalo que ninguÃ©m roda. Bob escreveu na prÃ³pria R1 (Â§4-OCP, que ele endossa por mim): "para 1 dev, modificar o pipeline Ã© barato; a abstraÃ§Ã£o Ã© cara e especulativa". O pacote de domÃ­nio dele Ã© o mesmo erro num lugar mais nobre.

A distinÃ§Ã£o CUPID que ele nÃ£o fez: **information hiding â‰  portar a lÃ³gica para fora do banco.** A regra "estado nÃ£o muda sem evento" jÃ¡ estÃ¡ escondida atrÃ¡s de UMA interface â€” a RPC `security definer`. Essa Ã© a fronteira. O que falta NÃƒO Ã© uma segunda cÃ³pia em TS; Ã© **proibir o bypass da RPC** (a porta lateral do PostgREST que o Kleppmann achou â€” K-1). Esconda a mecÃ¢nica atrÃ¡s da RPC e *force todo mundo a passar por ela*, e vocÃª tem information hiding real com UMA cÃ³pia da verdade. Onde eu **concedo** a Bob: o **verificador da cadeia** (P-UB7) tem que ser standalone, fora do Supabase, dia 0 â€” esse nÃ£o Ã© dual-write, Ã© o artefato pericial e a spec executÃ¡vel do hash, e o Kleppmann (K-4, golden hashes) chega no mesmo lugar por outra porta. O verificador, sim. O pacote de domÃ­nio inteiro, nÃ£o â€” Ã© DIP onde sÃ³ hÃ¡ SQL nosso, a cerimÃ´nia que eu nomeei no Â§4 da minha R1.

### 1.2 Contra Beck: cortar o RAG e o EFD NÃƒO resolve o vazamento de dialeto â€” sÃ³ muda QUEM vaza, e adia a fronteira para quando ela Ã© cara

Beck (K-1, K-3 dele) corta RAG e parser EFD da F1-mÃ­nima com gatilho de re-adiÃ§Ã£o. Concordo com o calendÃ¡rio â€” a conta dele de 32-45 semanas contra 24-28 estÃ¡ certa e Ã© o achado mais corajoso da R1 inteira. **Mas cortar nÃ£o Ã© uma resposta Ã s fronteiras de terceiros, e ele vende como se fosse (Q2/Q7 da tabela dele).**

Veja o que sobra na F1-mÃ­nima de Beck: upload XML â†’ motor determinÃ­stico â†’ laudo. Ele acha que matou a dependÃªncia de terceiro. NÃ£o matou â€” **transferiu**. O EFD cortado volta na F1.5 e, quando voltar, o parser EFD vai despejar os blocos C/M em `core.apuracao_declarada` â€” e se a fronteira do ACL nÃ£o estiver escrita ANTES, o layout do SPED (a lÃ­ngua da Receita) vaza para dentro do schema de apuraÃ§Ã£o exatamente como o NSU do provider jÃ¡ vazou para `core.nota`. Beck adiou a peÃ§a; nÃ£o desenhou a porta por onde ela entra. Ã‰ o meu N-W3 (Documentize Ã© origem, nÃ£o estÃ¡gio) generalizado: **toda origem futura precisa do ponto de entrada definido hoje, justamente porque vai ser construÃ­da amanhÃ£, sob pressÃ£o, por um dev que esqueceu esta conversa.**

Pior: o vazamento mais perigoso que Beck deixa intacto Ã© o do **SERPRO** (meu N-W5). O add-on e-CAC roda em paralelo (`[A]`), fora da F1 que ele cortou â€” ou seja, o corte do Beck nÃ£o toca o M-8, que batiza `procuracao_eletronica` com os cÃ³digos `00006/00002` do SERPRO. Beck cortou volume e deixou o pior acoplamento de fornecedor de pÃ© porque ele estava fora da lista de cortes. Cortar resolve calendÃ¡rio. **NÃ£o resolve fronteira.** SÃ£o eixos ortogonais, e a sala precisa parar de tratar "menos features" como se fosse "menos acoplamento".

### 1.3 Contra Kleppmann (parcialmente): `analise_execucao` UNIQUE Ã© a fronteira do motor que eu pedi â€” mas ele a desenhou no schema, nÃ£o no contrato, e isso recria o acoplamento que estou combatendo

Kleppmann (K-7) propÃµe `core.analise_execucao (nota_id, competencia, base_versao_id, motor_versao) UNIQUE` como unidade idempotente da anÃ¡lise, e `UNIQUE (item_id, tipo_divergencia, base_versao_id, motor_versao)` no apontamento. Tecnicamente impecÃ¡vel â€” resolve os gÃªmeos do motor nÃ£o-determinÃ­stico, e eu assino embaixo do problema.

**Mas onde ele pÃµe a soluÃ§Ã£o recria o acoplamento.** Se `analise_execucao` Ã© uma tabela em `core` que o motor escreve direto, entÃ£o o motor â€” a peÃ§a que o prÃ³prio doc 17 (A8) planeja extrair para Python â€” estÃ¡ fazendo INSERT em `core.*`. Isso Ã© precisamente o que eu ataquei no meu N-W13: "se o motor for funÃ§Ãµes fazendo INSERT direto, a fronteira limpa via fila Ã© aspiraÃ§Ã£o, e a extraÃ§Ã£o Ã© cirurgia". A `UNIQUE` do Kleppmann Ã© correta; o *escritor* dela tem que ser a RPC, nÃ£o o motor. Casamos os dois achados: **o motor devolve candidatos por contrato (meu N-W13); a RPC materializa em `analise_execucao` com a `UNIQUE` do K-7 e grava o evento na mesma transaÃ§Ã£o (K-1 dele).** Sem isso, ele endurece a idempotÃªncia e, no mesmo movimento, solda o motor ao schema do core â€” ganha corretude de dados e perde a fronteira de extraÃ§Ã£o. Kleppmann otimiza o dado; eu cuido de quem tem permissÃ£o de tocÃ¡-lo. As duas coisas tÃªm que entrar juntas ou a dele vira uma Ã¢ncora.

### 1.4 Contra mim mesmo via Fowler: "componentes nÃ£o sÃ£o contextos" â€” estamos dizendo a mesma coisa, mas a divergÃªncia fina importa e Ã© a favor dele

Fowler (Â§2 dele) diz: contÃªiner Ã© unidade de deploy, bounded context Ã© unidade de *linguagem*; a arquitetura tem caixas e nÃ£o tem mapa de onde uma lÃ­ngua termina. Eu disse (R1 Â§1.1): schema Postgres Ã© namespace, nÃ£o fronteira; information hiding Ã© porta com fechadura.

**Estamos no mesmo alvo por Ã¢ngulos diferentes â€” e a diferenÃ§a fina Ã© que ele estÃ¡ mais certo do que eu na prescriÃ§Ã£o.** Eu prescrevi uma *regra mecÃ¢nica* (N-W1: mÃ³dulo sÃ³ escreve nas prÃ³prias tabelas, cruzou = view/RPC, fitness function no CI). Fowler prescreveu um *mapa de relaÃ§Ãµes nomeadas* (ACL aqui, Conformist ali, Customer-Supplier acolÃ¡). A minha regra sem o mapa dele Ã© cega: ela me diz que `gestao` nÃ£o pode escrever em `core`, mas nÃ£o me diz *que tipo* de fronteira Ã© `ApuraÃ§Ã£oâ†’GestÃ£o` (customer-supplier, GestÃ£o consome eventos) vs `IngestÃ£oâ†’Provider` (ACL, traduz e descarta dialeto) vs `ApuraÃ§Ã£oâ†’Trilha` (kernel transacional, evoluem *juntos* â€” exceÃ§Ã£o deliberada Ã  minha prÃ³pria regra!).

A divergÃªncia fina e perigosa: **minha regra N-W1, levada ao pÃ© da letra, PROIBIRIA o kernel transacional ApuraÃ§Ã£o+Trilha** que tanto eu quanto o Fowler quanto o Kleppmann concordamos ser o coraÃ§Ã£o do moat â€” porque a RPC `aprovar_apontamento` escreve estado E evento, "cruzando" da mÃ¡quina de estados para o ledger na mesma transaÃ§Ã£o. Sem o mapa do Fowler nomeando isso como *shared kernel deliberado*, um dev futuro aplica minha fitness function, vÃª a "violaÃ§Ã£o", e quebra o moat para "respeitar a fronteira". **A regra precisa do mapa para saber onde ela NÃƒO se aplica.** Cedo a ele: o patch tem que ser o mapa de contextos com padrÃµes DDD nomeados (o dele), e a minha fitness function (N-W1) passa a *implementar* esse mapa â€” com a whitelist explÃ­cita do kernel transacional â€” nÃ£o a substituÃ­-lo.

---

## 2. BLIND SPOTS â€” o que NINGUÃ‰M viu nas 5 anÃ¡lises de R1

### 2.1 ðŸ”´ O blind spot mais grave: o schema `gestao` Ã© territÃ³rio de um terceiro (Gestorize) e ninguÃ©m aplicou ACL a ele

Toda a sala tratou os "terceiros" como APIs externas: provider de captura, SERPRO, ACT, base licenciada. Eu mesmo, na R1 Â§2, listei quatro e analisei a traduÃ§Ã£o de cada um. **Todos nÃ³s ignoramos o maior terceiro do projeto: o Gestorize.**

O schema `gestao.*` nÃ£o Ã© cÃ³digo nosso â€” Ã© o modelo de dados de um codebase herdado de terceiros, de qualidade desconhecida (Spike 5 pendente), que Fowler corretamente diz que NÃƒO Ã© strangler fig. E o que a arquitetura fez? Deu a ele uma **FK direta para dentro do core**: `gestao.documento.nota_id â†’ core.nota`, `gestao.alvara_certidao.ecac_consulta_id â†’ core.ecac_consulta`, e o ciclo via `core.usuario.departamento_id â†’ gestao.departamento`. Em termos de DDD/Fowler, isso devia ser uma fronteira **Anti-Corruption Layer** â€” porque do outro lado hÃ¡ um modelo de dados que nÃ³s nÃ£o controlamos, desenhado por gente que nÃ£o estÃ¡ mais aqui, sob premissas de 2024. Mas a arquitetura modelou como **shared kernel** (FK direta, mesmo banco, mesma transaÃ§Ã£o implÃ­cita).

A consequÃªncia que ninguÃ©m nomeou: **quando o Spike 5 falhar (e Fowler/Beck mostram que o cenÃ¡rio "cÃ³digo medÃ­ocre porÃ©m recuperÃ¡vel" Ã© o mais provÃ¡vel), a F1 nÃ£o vai "crescer 30-40%" â€” ela vai herdar o modelo de dados do Gestorize via essas FKs.** Se o Gestorize nasceu single-tenant (Fowler G2.1), o retrofit de `escritorio_id`+RLS no schema `gestao` Ã© a migraÃ§Ã£o mais cara que existe (Fowler diz isso), E `core.usuario` participa dela por causa do `departamento_id`. O ciclo que eu achei (N-W2) nÃ£o Ã© sÃ³ feio em diagrama â€” Ã© o **canal pelo qual a dÃ­vida do terceiro Gestorize contamina a tabela de identidade do moat.** A cura do meu N-W2 (mover `departamento` para `gestao.usuario_departamento`) ganha um segundo motivo, decisivo: Ã© o ACL contra o Gestorize. NÃ£o estou movendo uma coluna por elegÃ¢ncia de grafo; estou cortando o tentÃ¡culo pelo qual um terceiro nÃ£o-inspecionado alcanÃ§a o coraÃ§Ã£o do sistema.

### 2.2 ðŸŸ  Blind spot operacional: a `view canÃ´nica de mediÃ§Ã£o` do billing Ã© uma fronteira de ACL invertida â€” e ela vaza ao contrÃ¡rio

Todos elogiaram a "view canÃ´nica de mediÃ§Ã£o" (M-10) como interface publicada â€” eu inclusive (R1 Â§1.4). NinguÃ©m viu o vazamento *reverso*: o billing precisa contar "notas auditadas", e a definiÃ§Ã£o de "auditada" vive em `core.apontamento_auditoria.status` + na mÃ¡quina de estados. Quando o ciclo de Heleno adicionar `regularizado` e `superado` (K-7 do Kleppmann adiciona `superado`!), **a semÃ¢ntica de "o que conta para faturar" muda â€” e o billing, que deveria ser downstream conformist, estÃ¡ acoplado Ã  mÃ¡quina de estados do moat pela definiÃ§Ã£o da mÃ©trica.** Trocar a regra de cobranÃ§a (Anderson muda pricing a cada experimento â€” Uncle Bob notou a volatilidade, mas sÃ³ do lado do schema) forÃ§a a tocar a view que lÃª o estado fiscal. Ã‰ CRP violado na direÃ§Ã£o que ninguÃ©m olhou: nÃ£o Ã© o billing poluindo o core, Ã© o core ditando a granularidade do billing. A view precisa de um **contrato de versÃ£o prÃ³prio** ("nota_auditada_para_billing" como conceito versionado, estÃ¡vel mesmo quando a mÃ¡quina de estados cresce), senÃ£o cada estado novo do Heleno Ã© um suor frio no fechamento do Anderson.

### 2.3 ðŸŸ¡ Blind spot CUPID-Predictable: o `motor_versao='manual-c0'` do Beck cria uma geraÃ§Ã£o-zero de proveniÃªncia que NENHUM contrato cobre

Beck (Â§5.1) e Fowler (Â§5.1) acertam que o C0 manual grava `motor_versao: 'manual-c0'`. Uncle Bob e Kleppmann projetaram `ref.motor_versao` como entidade com anatomia (LLM, prompt, embedding). **Mas a geraÃ§Ã£o-zero â€” a decisÃ£o humana do Concierge â€” nÃ£o tem anatomia nenhuma, e o contrato de `motor_versao` desenhado pelos dois NÃƒO a acomoda.** O que Ã© "modelo_llm" de uma anÃ¡lise feita pelo Breno Ã  mÃ£o em julho/2026? NULL? E o `prompt_hash`? O laudo de 2027 que um perito examina em 2031 pode ter eventos C0 (humano puro), F1-determinÃ­stico (regras), e F1-RAG (sugestÃ£o) na MESMA cadeia do mesmo tenant. A `ref.motor_versao` tem que ter, desde a primeira linha, um discriminador `tipo_inferencia in ('humano_concierge','regra_deterministica','rag')` â€” senÃ£o a anatomia do motor que Bob/Kleppmann pedem Ã© uma tabela com 80% NULL para a geraÃ§Ã£o que mais importa juridicamente (a primeira, a que provou a tese). Isso conecta meu N-W12 (proveniÃªncia por mÃ©todo) ao C0 do Beck: o mÃ©todo tem TRÃŠS valores, nÃ£o dois, e o primeiro Ã© "humano".

---

## 3. ONDE EU CONCORDO â€” e reforÃ§o

- **Ciclo `coreâ†”gestao` (N-W2 meu = V3 do Uncle Bob = Â§2.2 do Fowler = SDP/ADP de todos):** quatro de cinco bateram nisso independentemente. Kleppmann nÃ£o atacou (estava na lente de dados) mas nÃ£o o defendeu â€” silÃªncio que conta como nÃ£o-objeÃ§Ã£o. **ReforÃ§o com o blind spot 2.1:** nÃ£o Ã© sÃ³ um ciclo, Ã© o canal de contaminaÃ§Ã£o do terceiro Gestorize. Prioridade mÃ¡xima, migration 001, custo de 10 minutos.
- **Motor como entidade versionada com anatomia (N-W11 meu = P-UB1 = F-10 = K-8):** unÃ¢nime e sobredeterminado. A Ãºnica briga Ã© se a anatomia mora numa string, num jsonb ou numa tabela `ref.motor_versao` â€” e Bob/Kleppmann/eu concordamos: tabela, com FK. ReforÃ§o: + discriminador de geraÃ§Ã£o (blind spot 2.3).
- **Re-verificaÃ§Ã£o â‰  re-execuÃ§Ã£o (meu R1 Â§4-Predictable = Bob Â§4 = Kleppmann Â§5.2 = Beck Â§3):** os quatro chegamos, sozinhos, Ã  mesma verdade desconfortÃ¡vel â€” um LLM nÃ£o reproduz 2027 em 2031, e a defensabilidade Ã© a trilha da decisÃ£o humana, nÃ£o o determinismo da mÃ¡quina. Quando quatro lentes diferentes (fronteiras, clean arch, dados, simplicidade) convergem numa frase jurÃ­dica, essa frase TEM que entrar no Â§3.3 do doc 17, validada pelo Heleno. Ã‰ o achado mais importante do conclave inteiro e estÃ¡ fora do schema â€” Ã© uma frase de honestidade que evita uma perÃ­cia constrangedora.
- **Provider dialeto fora do core (N-W4 meu = F-3 do Fowler = Â§3.3 LSP do Bob):** `provider_meta`, `ultimo_nsu`, CHECK enum de provider â€” todos concordam que saem de `core` para `ingestao`/staging. ReforÃ§o a sub-correÃ§Ã£o que sÃ³ eu fiz: o enum `origem` nÃ£o pode conter `'documentize'` (Fowler pegou isso tambÃ©m, Â§2.1) â€” nome de marca de terceiro fossilizado em payload imutÃ¡vel da trilha Ã© veneno de proveniÃªncia.

---

## 4. O PATCH v1.1 QUE EU DEFENDO (especÃ­fico, e priorizado contra o runway)

NÃ£o vou empilhar 14 itens novos â€” isso seria o comitÃª que o Beck condenou. Vou defender **um** patch estrutural que subsume as convergÃªncias e resolve a divergÃªncia de prescriÃ§Ã£o do Â§0, ordenado por "custa horas hoje, custa meses depois":

> **PATCH v1.1 â€” N-W14: "Mapa de Fronteiras ExecutÃ¡vel" como seÃ§Ã£o nova do doc 17 (Â§2-bis), substituindo o pacote de domÃ­nio do Uncle Bob e absorvendo o mapa do Fowler.**

Componentes concretos, todos antes da migration 001 exceto onde marcado:

1. **Mapa de contextos com padrÃ£o DDD nomeado por fronteira** (adoto o diagrama do Fowler Â§2.2 *as-is* â€” nÃ£o reinvento), com UMA adiÃ§Ã£o minha: o schema `gestao` Ã© marcado **ACL contra terceiro (Gestorize)**, nÃ£o shared kernel â€” FK direta de `gestaoâ†’core` permitida (gestao Ã© downstream), FK de `coreâ†’gestao` PROIBIDA (mata o ciclo, blind spot 2.1).

2. **Fitness function de fronteira (N-W1) implementa o mapa, com whitelist do kernel transacional.** Script SQL sobre `pg_constraint`/`pg_depend`: falha se `core.*` referencia `gestao|billing|ecac|ingestao`; whitelist explÃ­cita e comentada para o kernel ApuraÃ§Ã£o+Trilha (a RPC que cruza estadoâ†’evento Ã© fronteira nomeada, nÃ£o violaÃ§Ã£o â€” resolve a divergÃªncia fina Â§1.4 com o Fowler). Dependency-cruiser quando houver Node. **Este Ã© o "colega de review" de um time de 1 dev.**

3. **Contrato do motor escrito (N-W13), e o motor NUNCA escreve em `core` â€” sÃ³ a RPC.** A `UNIQUE analise_execucao` do Kleppmann (K-7) e a idempotÃªncia dele entram, mas materializadas pela RPC `core.registrar_analise(...)` que grava `analise_execucao` + apontamento + evento na mesma transaÃ§Ã£o. Motor in = `{item_ids, base_versao_id, motor_versao_id}` via fila; motor out = candidatos com proveniÃªncia; INSERT direto = proibido por grant. Isto torna o motor extraÃ­vel para Python (A8) por troca de runtime, nÃ£o por cirurgia â€” e dÃ¡ o golden-set executÃ¡vel contra o motor isolado (Q8) de graÃ§a.

4. **`ref.motor_versao` com anatomia (N-W11) + discriminador `tipo_inferencia in ('humano_concierge','regra_deterministica','rag')`** (absorve N-W12 + blind spot 2.3 + o `manual-c0` de Beck/Fowler). FK em todo `analise_executada`.

5. **Provider/SERPRO dialeto fora do domÃ­nio (N-W4 + N-W5):** `provider_meta`/`ultimo_nsu`/`provider_conexao` â†’ schema `ingestao`; enum `origem` neutro (sem `documentize`); `procuracao_eletronica.servico` em taxonomia interna + `ref.ecac_servico_map` traduzindo SERPRO na borda. Schemas `ecac` e `billing` prÃ³prios (N-W10), com a view de mediÃ§Ã£o como **contrato versionado** (blind spot 2.2).

**O que eu explicitamente NÃƒO incluo** (e por que, para a sÃ­ntese nÃ£o empilhar): o pacote `@contador/dominio` do Uncle Bob (Â§1.1 â€” dual-write de lÃ³gica para 1 dev; a RPC jÃ¡ Ã© a fronteira). **O que eu condiciono ao corte do Beck:** se a F1-mÃ­nima cortar RAG/EFD, o item 3 e 4 ainda valem â€” o contrato do motor e a anatomia de versÃ£o sÃ£o contrato de DADOS (Beck Â§3), nascem dia 0 mesmo que o comportamento espere.

Custo somado do N-W14: dias, nÃ£o semanas. Nenhuma infra nova. Tudo 10-100Ã— mais caro depois da migration 001. Ã‰ a diferenÃ§a entre um monolith modular e um monolith com schemas decorativos â€” e a diferenÃ§a, neste projeto, entre uma fronteira que Ã© uma linha num documento e uma que vira uma linha num auto de infraÃ§Ã£o.

---

## 5. Veredito R2

A R1 da sala estava certa no diagnÃ³stico e fragmentada na cura. Minha R2 sustenta os trÃªs achados convergentes, refuta a cerimÃ´nia do Uncle Bob (pacote de domÃ­nio = dual-write de lÃ³gica para um dev), nega ao Beck que cortar features resolva fronteiras (o dialeto do SERPRO sobrevive ao corte dele), e casa a idempotÃªncia do Kleppmann com a fronteira de extraÃ§Ã£o que ela ameaÃ§ava recriar. Cedi ao Fowler que minha regra mecÃ¢nica precisa do mapa de contextos dele para saber onde NÃƒO se aplicar â€” senÃ£o ela prÃ³pria quebraria o kernel transacional do moat.

E trouxe o blind spot que os cinco perdemos: **o Gestorize Ã© o maior terceiro do projeto, e a arquitetura lhe deu uma FK para o coraÃ§Ã£o do core em vez de um ACL.** Model around business domains, not technical boundaries â€” e Gestorize nÃ£o Ã© um domÃ­nio nosso. Ã‰ territÃ³rio alugado. Trate-o como tal.

â€” Newman. If you don't enforce the boundary, you don't have a boundary. You have a suggestion. ðŸ—
