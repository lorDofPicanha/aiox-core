# 32 — Arquitetura de Orquestração da Esteira Completa + Plano Faseado (Noyce)

> **Data:** 2026-06-18 · **Autor:** Orion (aios-master) · **Status:** Mapa + plano para aprovação
> **Origem:** Founder pediu o sistema em "pleno funcionamento" — realmente buscar as documentações, fazer tudo para **ganhar** uma licitação e, **se não ganhar, analisar por que perdeu e recorrer**. Exigência explícita: _"tem de ser muito bem orquestrado; as tasks e workflows muito bem feitos; erro nisso causa estrago enorme."_
> **Supersede parcialmente:** doc 31 (camada de agentes LLM) — aqui a costura/orquestração e a metade de trás (acompanhar→recorrer) que o 31 não cobriu.

---

## 0. Por que este documento existe (a aposta de risco)

Licitação pública não perdoa erro de processo. Os modos de falha catastrófica:

- **Preclusão:** perder a janela de intenção de recurso (em pregão, manifestação **na própria sessão**; depois, prazos de 3 dias úteis) = o direito de recorrer **morre**. Um erro de fuso/data aqui é irrecuperável.
- **Ato vinculante errado:** enviar proposta/declaração/recurso com número ou afirmação falsa = inabilitação, sanção, e responsabilidade **criminal** (Lei 14.133 art. 155; BLL art. 13§3/27/32).
- **Habilitação mal-calculada:** dizer "ATENDE" quando não atende → ENIAC monta proposta, gasta tempo, e é inabilitada na sessão. Ou o contrário: dizer "NÃO ATENDE" e descartar um edital ganhável.
- **Alucinação jurídica:** um recurso fundamentado em jurisprudência inventada destrói credibilidade e perde o mérito.

Portanto: **a orquestração é uma máquina de estados com gates humanos obrigatórios e invariantes inegociáveis**, não um "encadeie os agentes". Este doc define essa máquina **antes** de qualquer build.

---

## 1. Mapa real da esteira — estado em 18/Jun (auditado, não aspiracional)

Legenda: ✅ real/funcional · ⚙️ determinístico real (sem LLM) · 🧩 LLM-ready mas **nunca chamado** · 🔴 só `.md` (sem runtime) · ⚠️ depende de dado curado à mão/fixture.

| Estágio | Agente | Realidade no código (com evidência) |
|---|---|---|
| **Monitorar** | Faro | ✅ Descoberta **PNCP ao vivo** (`lib/sources/pncp-public-adapter.ts`), snapshot horário (`scripts/noyce/build-discovery-snapshot.mjs` + `discovery-scheduler.mjs`, guarda anti-vazio). Triagem Vai/Olha/Pula ⚙️ (`buildTriage` em `noyce-operational.ts`). Agente LLM 🧩 (`triage-agent.ts` existe, **não é chamado**). |
| **Analisar** | Prisma | ⚙️ Score por componentes real (`buildAnalysisRun`). 🧩 `analysis-agent.ts` existe, **não é chamado**. |
| **Habilitar** | Forja | ⚙️ Motor CCP×ERM **real e bom** (`noyce-habilitation.ts` — técnico prof./operacional, econ-fin, regularidade). ⚠️ Requisitos do edital (ERM) **curados à mão** — só 2 editais (`lib/data/erms/*.json`, `status: curado_manual_piloto`), **sem parse de PDF**. ⚠️ CCP semi-real (`eniac-ccp.json`: CNPJ/CREA/CATs/balanço reais via PyMuPDF) mas **certidões vazias**. 🧩 `habilitation-agent.ts` (matching semântico) **não é chamado**. |
| **Entregar** | Escriba | ✅ Dossiê HTML (`buildDossierHtml`) + declarações `.docx` (`noyce-docgen.ts`) reais, com portão humano. ⚙️ Cálculo de planilha (`computePlanilha`). ⚠️ `buildProposalCsv` = **esqueleto vazio** (faixa legal, sem itens de custo). 🧩 `document-agent.ts` **não é chamado**. |
| **Acompanhar** | Sentinela | ⚙️ Só utilitárias de prazo (`daysUntil`, `isDeadlinePassed`, `buildNextStep`). 🔴 **Sem runtime** (`lib/agents/monitor-agent.ts` não existe). **Não detecta resultado da sessão.** Eventos são fixture estático (`noyce-data.ts`). |
| **Recorrer** | Tribuno | 🔴 **Só `.md` + tipos vazios** (`AppealIntent`/`AppealReasons` em `noyce-model.ts` são enums). **Zero** análise de derrota, **zero** avaliação de fundamento, **zero** minuta. `recourse-agent.ts` não existe. |
| **(transversal)** | Maestro | 🔴 **Não existe** (`orchestrator.ts` ausente). Cada agente roda isolado; nada costura a esteira nem aplica gates. |
| **(transversal)** | Lastro | 🔴 Governança/proveniência: só `.md`. |

**Duas travas de fundo:**
1. 🧠 **Cérebro desligado:** `claude-client.ts` é real, mas `@anthropic-ai/sdk` não está instalado e não há `ANTHROPIC_API_KEY`. Hoje o app é **100% determinístico**. _Decisão tomada: construir LLM-ready, ligar depois (custo controlado pelo founder)._
2. 🏁 **Metade de trás inexistente:** ingestão de resultado da sessão → Sentinela → Tribuno → recurso. É exatamente o "se não ganhar, recorrer".

---

## 2. Os 5 níveis de "funcional" (para alinhar a palavra)

Quando o founder diz "pleno funcionamento", precisamos de um vocabulário comum:

- **N0 — Demo/fixture:** roda com dados de mentira. _(parte da UI hoje)_
- **N1 — Determinístico real:** lógica correta sobre dado estruturado real, sem LLM. _(Forja/Escriba/triagem hoje)_
- **N2 — LLM-ready:** cliente real + **fallback determinístico** + testes com cliente falso. Ligar = 1 interruptor. _(alvo da construção sem chave)_
- **N3 — LLM ligado:** SDK instalado + chave; agentes pensam de verdade. _(decisão de custo do founder)_
- **N4 — Validado ponta-a-ponta:** 1 edital real percorre tudo e produz o pacote de vitória; 1 derrota real/simulada produz a análise + minuta de recurso. **É aqui que "pleno funcionamento" se prova.**

Meta deste plano: levar **toda a esteira a N2**, com N3/N4 como flips controlados.

---

## 3. O modelo de orquestração (Maestro) — o coração do sistema

Maestro = **máquina de estados por edital**, não um loop de agentes. Cada edital (`Opportunity`) tem um `stage` e só transita sob condições explícitas, com **gates humanos obrigatórios** antes de qualquer ato vinculante.

### 3.1 Estados e transições

```
[descoberto] --Faro--> Pula? --> [arquivado]
                      \-Vai/Olha-> [analisar]
[analisar]   --Prisma--> score<piso? --> GATE("revisar viabilidade") --> humano decide
                       \-score>=piso-> [habilitar]
[habilitar]  --Forja--> NO_GO insanável? --> [arquivado c/ motivo]
                       \-GO / GO_COM_TAREFAS / CONSORCIO -> [entregar]
[entregar]   --Escriba--> monta proposta/planilha/declarações --> ⛔GATE HUMANO OBRIGATÓRIO⛔
                       --humano aprova--> [pronto-para-protocolo] (humano protocola no portal)
[acompanhar] --Sentinela--> vigia sessão+prazos --> ingestão de RESULTADO
                       --ganhou--> [vencido] 🎉
                       --perdeu/inabilitada--> [avaliar-recurso]
[avaliar-recurso] --Tribuno--> tem fundamento? --> não --> [encerrado s/ recurso] (registrado)
                       \-sim--> minuta --> ⛔GATE ADVOGADO OBRIGATÓRIO⛔ --> humano protocola
```

### 3.2 Contrato de cada transição (a tabela que o `orchestrator.ts` implementa)

| De | Agente | Produz | Gate antes de avançar | Veto (não pode avançar se…) |
|---|---|---|---|---|
| descoberto→analisar | Faro | veredicto + `permiteConsorcio` | — (auto) | prazo encerrado; fora do raio; objeto≠obras |
| analisar→habilitar | Prisma | `AnalysisRun` + sinais de suspeição | gate se score<piso ou suspeição alta | sem evidência mínima (confiança<X) → `PENDENTE_DADO` |
| habilitar→entregar | Forja | `HabilitationResult` | gate sempre que houver lacuna sanável | lacuna **insanável** → arquiva, não avança |
| entregar→pronto | Escriba | dossiê+planilha+declarações | **GATE HUMANO duro** (revisão item-a-item) | qualquer item `pendente`/sem fonte → marca d'água "NÃO ASSINAR", bloqueia geração final |
| pronto→protocolado | — | — | **só humano clica no portal** | ato vinculante: Noyce **nunca** protocola |
| acompanhar→avaliar-recurso | Sentinela | `SessionResult` | — (auto ao detectar derrota) | sem `SessionResult` ingerido → fica em "aguardando resultado" |
| avaliar-recurso→protocolo recurso | Tribuno | parecer de fundamento + minuta | **GATE ADVOGADO duro** | sem fundamento → recomenda **não recorrer** (honesto), não minuta forçada |

### 3.3 Princípios de orquestração (inegociáveis)

1. **Fluxo unidirecional com retornos explícitos** — só se volta de estado por evento nomeado (ex.: "edital re-publicado", "diligência reabre prazo"). Nunca por re-execução acidental.
2. **Nenhum salto de estado** — habilitar não roda sem análise; entregar não roda sem habilitação GO.
3. **Todo ato vinculante atrás de gate humano** — lance, declaração, proposta, recurso. O Maestro **roteia e prepara**; o humano **decide e protocola**.
4. **Estado é durável e idempotente** — reprocessar o mesmo edital **não** apaga decisão/revisão humana já feita (ver I6).
5. **Cada transição é auditada** (Lastro) — quem/quando/com base em quê (proveniência).

---

## 4. Invariantes de segurança — onde mora o "estrago enorme"

| # | Invariante | Modo de falha se violado | Mitigação no design |
|---|---|---|---|
| **I1** | Atos vinculantes = **humano** | recurso/proposta protocolado errado → sanção/crime | Maestro nunca tem ação de "submit"; só "preparar". `HUMAN_REQUIRED_ACTS` já no registry. |
| **I2** | **Número fora da LLM** | valor/quantitativo alucinado na proposta | LLM emite estrutura/texto; código (`computePlanilha`, motor de habilitação) calcula todo número; recompute ignora totais da LLM. |
| **I3** | **Proveniência obrigatória** | afirmação factual sem fonte → defesa indefensável | guardrails já exigem `fonte` por item; sem fonte → `PENDENTE_DADO`. |
| **I4** | **Prazo preclusivo = matemática determinística** | perder janela de recurso = direito morre | cálculo de prazo **nunca** pela LLM; fuso explícito (America/Sao_Paulo; ⚠️ ENIAC opera em GO/Brasília — fixar fuso, lição do Bretda); alerta com margem (T-3, T-1, T-0); "sem falha silenciosa". |
| **I5** | **Sem falha silenciosa** | snapshot velho/erro engolido → decisão sobre dado morto | já há guarda anti-vazio + log no scheduler; estender a todos os ingests (ata, certidão). |
| **I6** | **Idempotência** | re-rodar pipeline apaga revisão humana | estado humano (aprovações, correções, decisão de recurso) é camada separada e imutável pelo re-processamento; merge, nunca overwrite. |
| **I7** | **Isolamento por org (RLS)** | vazar dados da ENIAC p/ outro cliente | RLS por `org_id` (Story 30.6) antes de multiusuário. |
| **I8** | **Arquivos sensíveis só no vault** | certidão/balanço em git/log | Supabase Storage privado + signed URL TTL (Story 30.6); nunca em doc/JSON/print. |

> Estes 8 são o **gabarito de revisão** de toda a construção. Nenhuma PR entra se violar um.

---

## 5. Complexidade — onde está o risco real (ranqueado)

1. **🔴🔴 Tribuno / minuta de recurso** — peça jurídica de alto risco. Alucinação de jurisprudência = recurso perdido. Exige: RAG de jurisprudência real (TCU/Lei 14.133), modelo forte (Fable 5), e **gate advogado duro**. _Honestidade obrigatória: se não há fundamento, dizer que não há._
2. **🔴🔴 Edital→ERM (parse automático)** — hoje 2 editais à mão. Extrair requisitos de habilitação de um PDF jurídico heterogêneo, sem errar quantitativo/cláusula, é NLP difícil. Erro aqui = habilitação errada. Exige validação humana antes de virar dado vinculante.
3. **🔴 Ingestão de resultado da sessão (ata)** — formato varia por portal (PNCP/ComprasGov/BLL/BNC/PCP). Detectar "ENIAC ganhou/perdeu e por quê" de uma ata é parsing frágil. Começar por **upload manual + extração assistida**, não scraping autônomo.
4. **🔴 Prazo/fuso preclusivo** — ver I4. Já mordeu noutro projeto (Fortaleza×SP). Tratar como código crítico com testes de fronteira.
5. **🟡 Custo LLM** — pós-15/Jun, chamada programática cai no pool metered. Tiering (Haiku no volume, Opus no raciocínio, Fable no jurídico) + cache + N2-fallback mitigam.
6. **🟡 Costura/estado (Maestro)** — médio: bem especificado, mas precisa de estado durável + idempotência corretos.

---

## 6. Plano faseado (seguro-primeiro)

Ordem escolhida para **estabelecer a espinha de orquestração e segurança antes de ligar inteligência ou escalar dados** — porque é onde o erro custa mais.

| Fase | Entregável | Nível alvo | Gate de saída | Precisa de você |
|---|---|---|---|---|
| **A — Orquestração + contrato de estado** | `orchestrator.ts` (Maestro): máquina de estados §3, com gates e invariantes §4 codificados como guardas. Costura os agentes que já existem (determinístico). `SessionResult` + `MaestroState` no modelo. Testes de transição (incl. caminhos proibidos). | N2 | Toda transição testada; **nenhum caminho errado** passa (validar com pedro-valerio) | nada |
| **B — Espinha perder→recorrer** | Ingestão de `SessionResult` (upload de ata + extração assistida), Sentinela detecta derrota + dispara, Tribuno (`recourse-agent.ts`) analisa motivo + avalia fundamento + estrutura minuta. Tudo N2 (LLM-ready, fallback determinístico, gate advogado). | N2 | Derrota simulada → parecer honesto + minuta-rascunho atrás de gate | 1 ata real (depois, p/ validar) |
| **C — Ligar o cérebro** | `npm i @anthropic-ai/sdk` + chave; ativar Prisma/Forja/Escriba/Tribuno no pipeline já costurado; A/B/testes confirmam que o fallback continua valendo. | N3 | Run real de 1 edital com LLM; custo medido | **ANTHROPIC_API_KEY** (via vault) + ok ao custo |
| **D — Edital→ERM (escala)** | Pipeline PDF→requisitos (Docling/extração) + **validação humana** antes de virar ERM. Tira o gargalo dos 2 editais. | N2→N3 | 5 editais reais parseados e conferidos por humano | PDFs reais variados |
| **E — Dados reais (vault)** | Story 30.6 (Supabase: certidões/CCP/parceiras) + planilha de preços real (itens de custo). Habilitação passa a ler dado vivo. | N3 | Habilitação roda sobre vault real | infra Supabase (gate 30.6) |
| **F — Validação ponta-a-ponta** | 1 edital real ganhável percorre tudo → pacote de vitória pronto p/ humano protocolar. 1 derrota → análise + minuta. | **N4** | Founder assina o "isso funciona" | revisar o resultado |

**Dependências:** A→(B,C). C precisa de chave. D/E escalam dados. F fecha. B pode andar em paralelo a C/D após A.

---

## 7. O que precisa de você, e quando

- **Fase C:** `ANTHROPIC_API_KEY` (via vault/`.env.local`, nunca no git) + sinal verde ao custo de API.
- **Fase D:** alguns **PDFs de editais reais** variados (além dos 2 de Novo Gama) para treinar/validar o parser.
- **Fase B/F:** **1 ata real de uma sessão** (idealmente uma que a ENIAC perdeu) para validar a detecção de derrota + a minuta.
- **Fase E:** provisionar **Supabase** (Story 30.6) para certidões/CCP/parceiras reais.
- **Decisão de negócio (transversal):** até onde automatizar vs. parar no gate humano. Recomendação: **gates duros em entregar e recorrer permanentes** — não automatizar ato vinculante, nunca.

---

## 8. Como provamos que funciona (critério de aceite)

- **Por fase:** cada uma tem um gate de saída objetivo (coluna na tabela §6) + testes verdes + os 8 invariantes §4 não violados.
- **Teste ponta-a-ponta (N4, Fase F):**
  1. Pegar 1 edital real GO obras (via PNCP ao vivo).
  2. Faro→Prisma→Forja: sistema diz se a ENIAC pode ganhar e o que falta.
  3. Escriba: dossiê + planilha + declarações geradas, marca d'água até revisão humana.
  4. Gate humano aprova → "pronto p/ protocolo" (humano protocola).
  5. Ingerir ata simulada de **derrota** → Sentinela dispara → Tribuno produz parecer honesto + minuta atrás do gate advogado.
  - **Sucesso = o operador da ENIAC consegue, com o Noyce, montar uma proposta submissível E, perdendo, um recurso fundamentado — sem o sistema nunca ter praticado um ato vinculante sozinho nem inventado um número/jurisprudência.**

---

## 9. Próximo passo imediato

Validar o **modelo de orquestração (§3) e os invariantes (§4)** com o **pedro-valerio** (absolutista de processo — caça caminhos errados, condições de veto faltantes, cobertura de checkpoint) **antes** de escrever `orchestrator.ts`. Só depois de "zero caminhos errados" aprovado, começa a Fase A.

---

## 10. Validação de processo (pedro-valerio)

> **Data:** 2026-06-18 · **Auditor:** pedro-valerio (Process Absolutist)
> **Veredito:** ❌ **REPROVADO PARA BUILD.** A máquina de estados §3 NÃO está pronta para virar `orchestrator.ts`. 7 achados BLOQUEANTES, 9 ALTA, 6 MÉDIA. Princípio: _se o executor (ou o reprocessamento horário) CONSEGUE fazer errado, o processo está errado._
> **Escopo:** este doc define a máquina, mas a máquina como desenhada deixa prazos preclusivos passarem em silêncio, permite saltos de estado, e não tem o estado mais perigoso da licitação ("ganhei mas me impugnaram"). Corrigir no papel antes de codar.

### 10.0 Achado de fundação (lê primeiro)

**F0 — BLOQUEANTE — o tipo de estado nem existe e o que existe é incompatível.**
O §3.1/§3.2 fala em estados `analisar`, `habilitar`, `entregar`, `pronto-para-protocolo`, `acompanhar`, `avaliar-recurso`, `vencido`, `arquivado`. Mas em `noyce-model.ts` o único enum de estado é `WorkflowStage = monitorar | analisar | indicar | habilitar | acompanhar | recorrer`. **Não existe `entregar`, `pronto-para-protocolo`, `avaliar-recurso`, `vencido`, `arquivado`, `protocolado`, nem `MaestroState`, nem `SessionResult` (grep confirmou: zero ocorrências em código).** Consequência: o `orchestrator.ts` seria escrito contra um modelo de estado inventado na hora, divergente do que o resto do app usa — `Opportunity.stage` continuaria num enum, o Maestro noutro, e nada garante que os dois concordam. **Correção:** antes da Fase A, definir UM tipo `MaestroStage` canônico (string-literal union) + `SessionResult` + `MaestroState{ stage, humanLayer, history[] }` no modelo, e um mapeamento explícito `MaestroStage ↔ WorkflowStage`. Sem isso, nada abaixo é testável. **Este é o pré-requisito de todos os outros.**

---

### 10.1 Transições inválidas / saltos de estado

**B1 — BLOQUEANTE — `acompanhar` é um estado órfão: não há transição que CHEGUE nele.**
No §3.1, o bloco `[entregar] --aprova--> [pronto-para-protocolo]` termina ali. A linha seguinte `[acompanhar] --Sentinela-->` começa do nada. **Não existe aresta `pronto-para-protocolo → acompanhar`.** Como o sistema entra em vigilância de sessão? Hoje: por nenhum caminho nomeado. Consequência real: o operador aprova o dossiê, protocola no portal, e o edital **some do radar do Sentinela** — ninguém vigia a data da sessão nem a janela de recurso. Isso é exatamente a "DOR #1" reaparecendo dentro do próprio desenho. **Correção:** aresta explícita `pronto-para-protocolo --(humano confirma protocolo, com data/hora + nº processo)--> acompanhar`. O gate "humano protocolou" precisa de um evento de confirmação que ARMA o relógio do Sentinela.

**B2 — BLOQUEANTE — `[avaliar-recurso]` também é alcançável só por um ramo; o ramo "inabilitada" pula a sessão.**
§3.1 diz `--perdeu/inabilitada--> [avaliar-recurso]`. Mas inabilitação acontece **na fase de habilitação da sessão, ANTES do julgamento de propostas** — e gera sua própria janela de recurso (art. 165, I, "a", Lei 14.133), distinta da janela de recurso contra o julgamento. O desenho funde "perdeu o preço" e "fui inabilitado" num único estado, com um único relógio. São dois prazos preclusivos diferentes, podendo ocorrer em momentos diferentes da mesma sessão. **Correção:** separar `inabilitada` e `derrotada_no_julgamento` como sub-resultados do `SessionResult`, cada um com sua janela e seu gate de intenção de recurso.

**A1 — ALTA — `habilitar → entregar` pode saltar sob `GO_COM_TAREFAS` sem fechar as tarefas.**
§3.2 linha `habilitar→entregar`: veto só dispara em lacuna **insanável**. Mas `GO_COM_TAREFAS` (verdict real em `noyce-model.ts`) significa "habilita SE fechar tarefas X, Y". O desenho deixa avançar para `entregar` com tarefas em aberto, e o gate humano do Escriba é sobre o DOSSIÊ, não sobre as tarefas de habilitação (visita técnica, CND vencida, atestado faltante). Consequência: ENIAC monta proposta e é inabilitada na sessão por uma CND que o sistema sabia estar vencida. **Correção:** transição `entregar` deve ter guarda: nenhuma `HabilitationGap` com `sanabilidade=SANAVEL` pode estar em estado não-resolvido E bloqueante quando o prazo de protocolo chegar; tarefas pendentes viram alertas do Sentinela com dono+prazo, não somem.

**A2 — ALTA — `PENDENTE_DADO` não tem destino de estado.**
O verdict `PENDENTE_DADO` existe no modelo e o §3.2 cita "confiança<X → PENDENTE_DADO", mas a máquina de estados §3.1 não tem um estado/loop para ele. Para onde vai um edital `PENDENTE_DADO`? Não pode arquivar (não é NO_GO), não pode avançar (falta dado). **Correção:** estado explícito `aguardando-dado` com dono+lacuna, que NÃO conta como descartado e que o Sentinela vigia contra o prazo (um edital ganhável não pode morrer esperando um dado enquanto o relógio corre).

---

### 10.2 Condições de veto faltantes

**B3 — BLOQUEANTE — não há estado nem gate para "ENIAC venceu mas foi IMPUGNADA por outro licitante".**
O §3.1 trata `--ganhou--> [vencido] 🎉` como terminal feliz. **Errado e perigoso.** Após a ENIAC ser declarada vencedora, abre-se a janela de **intenção de recurso dos OUTROS licitantes**; se um recorre, a ENIAC tem prazo para **contrarrazões** (art. 165, §3). Perder o prazo de contrarrazões = a ENIAC, já vencedora, perde por revelia administrativa. O modelo até tem o tipo (`counterarguments_deadline`, `submit_counterarguments`) mas a máquina de estados **não usa**. Este é o caminho errado mais caro do sistema: ganhar e depois perder por inércia. **Correção:** `vencido` NÃO é terminal — é `vencedora-provisoria` → vigia janela de recurso de terceiros → se houver recurso, estado `defendendo-vitoria` com gate de contrarrazões (advogado) e relógio preclusivo próprio. Só vira `vencido` (terminal) após homologação/adjudicação sem recurso pendente.

**B4 — BLOQUEANTE — diligência/saneamento (art. 64) reabre prazo e o desenho não tem a guarda.**
O §3.3 menciona "diligência reabre prazo" como exemplo de retorno, mas §3.2 não tem nenhuma linha que trate o evento `diligence` (que JÁ existe em `LegalEventType` e no `DecisionType.request_diligence_review`). Se o pregoeiro abre diligência, surge um novo prazo curto e um pedido de documento — sem gate, isso passa em silêncio. **Correção:** evento `diligence` → transição de retorno nomeada para um estado `em-diligencia` com prazo próprio (Sentinela arma) + gate humano sobre o que responder.

**B5 — BLOQUEANTE — edital re-publicado / suspenso / revogado / sessão remarcada não tem guarda; o estado fica obsoleto silenciosamente.**
§3.3 cita "edital re-publicado" como retorno possível, mas não há linha de §3.2 nem veto. Quando um edital é re-publicado, os **requisitos de habilitação podem mudar** (a ERM curada à mão fica inválida) e o **prazo reinicia**. Sem guarda, o Maestro segue operando sobre a versão velha — habilita contra requisito que não existe mais, ou vigia uma data de sessão que foi cancelada. **Correção:** veto em TODAS as transições: "se houver evento `republicacao|suspensao|revogacao|remarcacao` não-reconciliado → CONGELA a esteira nesse edital e exige re-triagem humana antes de qualquer avanço". Marcar a ERM/HabilitationResult como `stale` quando o edital muda.

**A3 — ALTA — empate / desempate ME-EPP e direito de preferência não estão modelados como ponto de decisão na sessão.**
`ConsortiumEvaluation.vantagemMeEpp` existe, mas a máquina de estados não tem o momento "empate ficto ME/EPP (LC 123 art. 44/45) → ENIAC tem janela curta para cobrir o lance". Isso é um prazo dentro da sessão. **Correção:** se a ENIAC é ME/EPP, `SessionResult` precisa do sub-estado "empate-ficto-aberto" com alerta de janela imediata (ato humano: cobrir lance).

**A4 — ALTA — o veto de `descoberto→analisar` ("prazo encerrado") usa data, mas não cobre "prazo encerra DURANTE a esteira".**
A guarda só roda na entrada. Um edital entra com 20 dias, mas o operador demora; nada re-verifica o prazo nas transições internas. **Correção:** `isDeadlinePassed` deve ser guarda RE-AVALIADA em toda transição que custe tempo (analisar, habilitar, entregar), não só na triagem. Se venceu no meio → estado `prazo-perdido` (registrado, não silenciosamente "arquivado").

**A5 — ALTA — consórcio que muda a habilitação não tem ponto de re-entrada na habilitação.**
`needsConsorcioPartner` sinaliza que um parceiro destravaria a análise, mas a máquina não tem "humano cadastrou parceiro → re-roda Forja com o acervo somado". Sem isso, a recomendação de consórcio é um beco sem saída. **Correção:** evento `parceiro-cadastrado` → retorno nomeado a `habilitar` (re-roda com `ConsortiumEvaluation.enabled=true`), preservando a camada humana.

---

### 10.3 Estados ausentes (resumo)

**B6 — BLOQUEANTE — falta o estado "impugnação ao EDITAL antes da sessão".**
Diferente de recurso pós-resultado. Se a ERM/Prisma detecta cláusula restritiva/direcionamento (os `SuspicionSignal` já existem no modelo!), há uma janela legal para **impugnar o edital** (art. 164) ANTES da proposta — prazo preclusivo próprio. O sistema detecta o vício (Prisma/detector de direcionamento) mas **não tem para onde levar essa detecção** na máquina de estados. Um vício detectado e não impugnado no prazo = a ENIAC compete num edital viciado e perde o direito de questionar. **Correção:** dos achados de suspeição alta → ponto de decisão `impugnar-edital` com janela própria (Sentinela arma) + gate advogado. Reusa o Tribuno (não é só recurso pós-derrota; é também impugnação prévia).

Demais estados ausentes (ALTA/MÉDIA, derivam dos achados acima):
- `em-diligencia` (B4) · `defendendo-vitoria`/`vencedora-provisoria` (B3) · `aguardando-dado` (A2) · `prazo-perdido` (A4) · `congelado-edital-mudou` (B5) · `impugnacao-edital` (B6) · `empate-ficto` (A3) · `encerrado s/ recurso` JÁ está no §3.1 (ok).

---

### 10.4 Cobertura de checkpoint / preclusão

**B7 — BLOQUEANTE — três prazos preclusivos NÃO têm gate de alerta no desenho da máquina.**
Auditando cada janela preclusiva contra §3:

| Prazo preclusivo | Coberto por gate na máquina §3? | Risco |
|---|---|---|
| Proposta (prazo de entrega) | ⚠️ parcial — Faro filtra na entrada, mas A4 mostra que não re-verifica no meio | ALTA |
| **Impugnação ao edital** (art. 164) | ❌ NÃO existe (B6) | **BLOQUEANTE** |
| Intenção de recurso **na própria sessão** (imediata) | ⚠️ depende de `SessionResult` ingerido a tempo — mas a ingestão é "upload manual de ata" (§5), que pode chegar DEPOIS da janela | **BLOQUEANTE** |
| Razões de recurso (3 d.u.) | 🟡 tipo existe (`appeal_reasons_deadline`), mas só arma se a intenção foi capturada | ALTA |
| **Contrarrazões** (recurso de terceiro) | ❌ NÃO existe (B3) | **BLOQUEANTE** |
| Diligência (prazo do pregoeiro) | ❌ NÃO existe (B4) | BLOQUEANTE |
| Empate ME/EPP (janela na sessão) | ❌ NÃO existe (A3) | ALTA |

**O ponto silencioso mais grave:** a **intenção de recurso é manifestada NA SESSÃO, em minutos**. O desenho depende de "ingestão de `SessionResult` via upload manual de ata" (§5.3). A ata só existe **depois** da sessão. Logo, no fluxo desenhado, o sistema **só descobre que perdeu quando a janela de intenção já fechou**. Isso é uma falha silenciosa estrutural — o gate existe no papel mas dispara tarde demais. **Correção:** separar dois sinais — (1) um alerta PROATIVO pré-sessão ("sessão da ENIAC é amanhã às 9h; SE perder, a intenção de recurso é IMEDIATA, na própria sessão — humano precisa estar logado e pronto") armado pelo Sentinela contra a `dataSessao`; e (2) a ingestão de ata pós-fato apenas para razões/contrarrazões. Nunca confiar só na ata para um prazo que vence na sessão.

---

### 10.5 Idempotência (I6) e reentrância

**A6 — ALTA — corrida entre o scheduler horário e a camada humana não tem mecanismo de exclusão definido.**
O §4 I6 diz "merge, nunca overwrite", mas não define COMO. O scheduler (`discovery-scheduler.mjs`, de hora em hora) re-roda Faro/Prisma sobre snapshot fresco. Se, no instante em que o humano marcou `intend_to_appeal` ou aprovou o dossiê, o scheduler re-processa o mesmo edital, qual vence? "Merge" não é um algoritmo. Consequência: re-triagem horária pode mover um edital que o humano colocou em `avaliar-recurso` de volta para `analisar`, ou reabrir um dossiê aprovado. **Correção:** (a) a camada humana (`MaestroState.humanLayer`) é **append-only e imutável** pelo pipeline determinístico; (b) o scheduler só pode AVANÇAR/ANOTAR estados que estão em ramo determinístico — qualquer edital cujo estado atual tem decisão/aprovação humana entra em modo **read-only para o scheduler** (só pode adicionar alertas, nunca mudar `stage` nem sobrescrever artefato). Tornar isso uma guarda explícita e testável, não um princípio.

**A7 — ALTA — falta chave de idempotência por versão de edital.**
Se o edital é re-publicado (B5), o ID PNCP pode ser o mesmo mas o conteúdo muda. Reprocessar sobre o mesmo ID "merge" dados de duas versões diferentes. **Correção:** idempotência ancorada em `(opportunityId, editalVersionHash)`; mudança de hash = evento `republicacao` (B5), não merge.

**M1 — MÉDIA — re-execução parcial (um agente falha no meio) não tem ponto de retomada definido.**
§ "degradação graciosa" (maestro.md) diz usa fallback determinístico, mas não diz se o estado avança ou trava. Definir: falha de agente → estado permanece, marca `step_failed`, Sentinela alerta; NUNCA avança com saída de fallback para um ato vinculante.

---

### 10.6 Invariantes §4 — auditoria item a item

| Inv | Status | Problema / reforço |
|---|---|---|
| **I1** Atos vinculantes = humano | 🟡 forte mas incompleto | Cobre lance/proposta/declaração/recurso. **FALTA:** contrarrazões (B3), impugnação ao edital (B6), resposta a diligência (B4) — também são atos vinculantes e precisam estar em `HUMAN_REQUIRED_ACTS`. **Verificar:** grep mostrou que `HUMAN_REQUIRED_ACTS` está em `noyce-source-registry.ts` — auditar se a lista cobre os 3 novos. |
| **I2** Número fora da LLM | 🟢 bom e verificável | "recompute ignora totais da LLM" é testável. Manter teste que injeta total alucinado e prova que o renderer o descarta. |
| **I3** Proveniência obrigatória | 🟢 bom | Já há `Grounding` + `PENDENTE_DADO`. Reforço: prazo/data TAMBÉM é afirmação factual — toda data preclusiva precisa de `source` + `confidence`; data `inferred` NÃO pode armar um alerta como se fosse `confirmed` (ver M2). |
| **I4** Prazo = matemática determinística | 🟡 **AMBÍGUO no ponto que mais importa** | "fuso explícito America/Sao_Paulo; ENIAC opera em GO/Brasília". **GO é fuso de Brasília (UTC-3) = mesmo de SP — então por que a ressalva?** Ou a ENIAC tem operação em fuso diferente, ou a nota está errada. **Pior:** o cálculo em dias (`daysUntil` usa `86_400_000` ms e `Math.ceil`) é por **dias corridos**, mas prazos de recurso são em **dias ÚTEIS** (3 d.u.) e há **horário de corte** (sessão às 9h, não meia-noite). `daysUntil` NÃO sabe de dias úteis nem de hora-cheia. Isto é um defeito de cálculo preclusivo. **Correção:** I4 precisa de uma função de dias úteis (com calendário de feriados nacionais + municipais do órgão) e de prazo em hora-cheia, não em dias corridos. Tratar como código crítico com testes de fronteira (sexta + feriado segunda; sessão às 9h vs alerta T-0). |
| **I5** Sem falha silenciosa | 🟡 declarado, não garantido | Existe anti-vazio no scheduler. Mas B7 mostra a maior falha silenciosa do sistema (intenção de recurso descoberta tarde). I5 só é real quando CADA ingest (ata, certidão, resultado) tem timeout + alerta "não recebi o dado esperado dentro da janela". **Falta:** invariante explícito "ausência de dado dentro de janela preclusiva = alerta CRÍTICO, nunca silêncio". |
| **I6** Idempotência | 🔴 fraco (ver A6/A7) | "merge, nunca overwrite" não é verificável como está. Exige: camada humana append-only imutável + scheduler read-only sobre estados com decisão humana + chave `(id, versionHash)`. |
| **I7** RLS por org | 🟢 ok (depende Story 30.6) | Sem objeção de processo. |
| **I8** Arquivos sensíveis só no vault | 🟢 ok (depende Story 30.6) | Sem objeção de processo. |

**Invariantes AUSENTES (precisam ser criados):**
- **I9 — Preclusão nunca depende de um único sinal.** Todo prazo preclusivo é armado por dado PROATIVO (data do edital/sessão), não só pela ingestão reativa (ata). Cobre B7. _Verificável:_ teste que prova que o alerta de intenção de recurso dispara a partir da `dataSessao`, mesmo sem ata.
- **I10 — Nenhum estado terminal sem janela de terceiros esgotada.** "Vencido" só é terminal após esgotada a janela de recurso de outros licitantes + homologação. Cobre B3.
- **I11 — Mudança de edital invalida derivados.** Re-publicação/suspensão marca ERM, HabilitationResult e datas como `stale` e CONGELA a esteira. Cobre B5/A7.
- **I12 — Toda transição re-avalia o relógio.** `isDeadlinePassed`/janela é guarda de TODA transição que consome tempo, não só da entrada. Cobre A4.

**M2 — MÉDIA — alerta de prazo pode disparar sobre data `inferred`/`expected` como se fosse `observed`.** `LegalProcessEvent.status` tem `inferred|expected|observed`. Um alerta preclusivo sobre data inferida pode dar falsa segurança (ou falso pânico). Regra: prazo preclusivo só ARMA gate duro sobre data `observed`/`confirmed`; data inferida gera alerta "CONFIRMAR DATA" com dono, nunca o gate final.

**M3 — MÉDIA — gate "GATE ADVOGADO" e "GATE HUMANO" não têm regra de fechamento.** (Padrão recorrente das minhas auditorias.) Quem ratifica? O que conta como "aprovado"? Se o advogado pede correção, volta para qual estado? Sem isso o gate trava ou vira informal. **Correção:** cada gate define: aprovador (papel), ação que fecha (aprovar/corrigir/rejeitar), e o estado-destino de cada ação. "Corrigir" volta ao agente; "rejeitar" encerra com motivo; só "aprovar" libera o ato humano.

---

### 10.7 Resumo dos BLOQUEANTES (gate de saída da Fase A)

Nenhuma linha de `orchestrator.ts` deve ser escrita antes de F0 (tipos de estado canônicos). Nenhum build da Fase A passa o gate de saída ("nenhum caminho errado") enquanto B1–B7 não forem corrigidos no desenho E cobertos por teste de transição (incluindo os caminhos PROIBIDOS):

- **F0** — tipo de estado canônico (`MaestroStage`/`MaestroState`/`SessionResult`) não existe; modelo atual incompatível. **Pré-requisito de tudo.**
- **B1** — `acompanhar` é estado órfão: aprovar dossiê não arma a vigilância da sessão. DOR #1 reaparece no próprio desenho.
- **B2** — inabilitação e derrota de julgamento fundidas num estado/relógio só; são dois prazos distintos.
- **B3** — não há estado "venci mas fui impugnado" → perde-se por revelia o prazo de contrarrazões. Caminho errado mais caro do sistema.
- **B4** — diligência (art. 64) reabre prazo sem guarda.
- **B5** — edital re-publicado/suspenso/revogado opera sobre dado obsoleto sem congelar a esteira.
- **B6** — impugnação ao edital (art. 164) detectada (suspeição existe) mas sem destino na máquina; vício não impugnado no prazo.
- **B7** — intenção de recurso vence NA SESSÃO, mas o desenho só descobre a derrota pela ata pós-fato → falha silenciosa preclusiva estrutural.

**Cada teste de transição da Fase A deve incluir o caso negativo correspondente** (ex.: "tentar ir de `entregar` a `acompanhar` sem confirmação de protocolo → REJEITADO"; "scheduler tenta mover edital com `intend_to_appeal` → REJEITADO"; "alerta de intenção de recurso dispara sem ata ingerida → PASSA").

---

## 11. Máquina de estados v2 — corrigida pós-validação (Orion, 18/Jun)

> Resolve F0 + B1–B7 + ALTA (A1–A7) + invariantes (I4/I6 + novos I9–I12) + médias baratas (M1–M3). Mantém a **IA integrada**: cada estado mostra qual agente LLM atua, sempre **LLM-ready** (núcleo determinístico decide o número/prazo/transição; LLM agrega raciocínio textual; fallback determinístico se LLM off/falha — nunca avança ato vinculante com saída de fallback, M1).

### 11.0 Fundação (resolve F0) — tipos canônicos ANTES de qualquer código

```ts
// MaestroStage: estado canônico ÚNICO. Substitui o uso ambíguo de WorkflowStage como estado.
export type MaestroStage =
  | "descoberto" | "triado" | "analisado" | "impugnacao-edital"   // pré-proposta
  | "aguardando-dado" | "habilitado" | "entregando" | "pronto-protocolo"
  | "protocolada" | "em-sessao" | "em-diligencia" | "aguardando-resultado"  // sessão
  | "vencedora-provisoria" | "defendendo-vitoria"                 // ganhou (não-terminal!)
  | "avaliar-recurso-inabilitacao" | "avaliar-recurso-julgamento" // perdeu
  | "recurso-protocolado"
  // terminais:
  | "vencido" | "arquivado" | "arquivado-motivo" | "prazo-perdido" | "encerrado-sem-recurso"
  | "congelado-edital-mudou";   // pseudo-terminal: exige re-triagem humana

export interface MaestroState {
  stage: MaestroStage;
  editalVersionHash: string;          // I11/A7 — idempotência por VERSÃO do edital
  humanLayer: HumanDecision[];        // I6 — APPEND-ONLY, imutável pelo pipeline
  history: StageTransition[];         // auditoria (Lastro)
  clocks: PreclusiveClock[];          // I4/I9 — relógios preclusivos ativos
}
```
Mapeamento explícito `MaestroStage → WorkflowStage` (o enum grosso de 6 fases continua para a UI/abas; o Maestro opera no fino). `SessionResult` (abaixo) também passa a existir no modelo. **Sem estes tipos, nada da Fase A é testável.**

### 11.1 Máquina de estados v2 (diagrama)

```
descoberto --Faro--> triado
  triado --Pula--> arquivado
  triado --Vai/Olha--> analisado            [I12: re-checa prazo em TODA transição abaixo]
analisado --Prisma-->
  suspeição alta --> impugnacao-edital  (B6, janela art.164, GATE ADVOGADO; reusa Tribuno)
  confiança < piso --> aguardando-dado  (A2; Sentinela vigia prazo; NÃO é descarte)
  ok --> habilitado
habilitado --Forja-->
  NO_GO insanável --> arquivado-motivo
  GO_COM_TAREFAS --> entregando  [A1: tarefas sanáveis viram alertas Sentinela c/ dono+prazo; não somem]
  CONSORCIO --> aguardando-dado (parceiro)  --parceiro-cadastrado--> habilitado (re-roda Forja, A5)
  GO --> entregando
entregando --Escriba--> dossiê+planilha+declarações
  ⛔GATE HUMANO (revisão item-a-item + tarefas de habilitação abertas, A1)⛔
  aprova --> pronto-protocolo
pronto-protocolo --(humano confirma protocolo: data/hora + nº processo)--> protocolada   [B1: ARMA Sentinela]
protocolada --Sentinela arma relógio pela dataSessao--> em-sessao
  [B7/I9: ALERTA PROATIVO pré-sessão "se perder, intenção de recurso é IMEDIATA, esteja logado"]
em-sessao --eventos da sessão (SessionResult)-->
  empate-ficto ME/EPP (A3) --> [janela imediata: humano cobre lance]
  inabilitada --> avaliar-recurso-inabilitacao   (B2, relógio próprio art.165 I-a)
  derrotada-julgamento --> avaliar-recurso-julgamento  (B2, relógio próprio)
  vencedora --> vencedora-provisoria              (B3/I10 — NÃO é terminal)
  pregoeiro abre diligência --> em-diligencia     (B4, relógio próprio, GATE HUMANO)
em-diligencia --responde (ato humano)--> volta ao estado anterior
vencedora-provisoria --vigia janela de recurso de TERCEIROS-->
  ninguém recorre + homologação --> vencido 🎉 (TERMINAL — I10)
  terceiro recorre --> defendendo-vitoria  (contrarrazões art.165§3, GATE ADVOGADO, relógio próprio)
avaliar-recurso-* --Tribuno-->
  sem fundamento --> encerrado-sem-recurso (honesto, registrado)
  com fundamento --> minuta --> ⛔GATE ADVOGADO⛔ --> recurso-protocolado (humano protocola)
[qualquer estado] --evento republicacao|suspensao|revogacao|remarcacao (B5/I11)--> congelado-edital-mudou
[qualquer transição que custa tempo] --prazo vence (A4/I12)--> prazo-perdido (registrado, não silencioso)
```

### 11.2 Agentes LLM por estado (IA integrada, LLM-ready)

| Estado | Agente | Núcleo determinístico (decide) | Camada LLM (agrega, opcional) | Gate |
|---|---|---|---|---|
| triado | Faro | `buildTriage` (Vai/Olha/Pula, prazo, raio) | triage-agent: nuance de objeto/consórcio | — |
| analisado | Prisma | `buildAnalysisRun` (score/confiança) | analysis-agent: leitura competitiva, pontos de impugnação | gate se score<piso |
| impugnacao-edital | Tribuno | detecção `SuspicionSignal` + relógio art.164 | minuta de impugnação | **advogado** |
| habilitado | Forja | `buildHabilitationResult` (CCP×ERM, números) | habilitation-agent: matching semântico de atestados | gate se lacuna sanável |
| entregando | Escriba | `computePlanilha` (todos os números) | document-agent: texto de proposta/declarações | **humano duro** |
| em-sessao / aguardando-resultado | Sentinela | relógios preclusivos (dias úteis) | — (vigilância é determinística) | alerta proativo |
| avaliar-recurso-* / defendendo-vitoria | Tribuno | relógio + detecção de motivo (do SessionResult) | parecer de fundamento + minuta (Fable 5 + RAG jurisprudência) | **advogado** |
| (todos) | Lastro | registro append-only de proveniência | — | — |

### 11.3 `SessionResult` + os relógios preclusivos (resolve B2/B3/B7/I4/I9)

```ts
export interface SessionResult {
  editalId: string; editalVersionHash: string;
  sessionAt: string;                          // ISO datetime hora-cheia (I4)
  eniacOutcome: "vencedora" | "inabilitada" | "derrotada_julgamento"
              | "empate_ficto_meepp" | "desclassificada" | "indefinido";
  motivo?: string;                            // por que (com fonte — I3)
  winner?: { cnpj: string; nome: string; preco: number } | null;
  thirdPartyAppealWindow?: PreclusiveClock;   // B3 — janela de terceiros
  source: "ata_upload" | "portal" | "manual"; confidence: "observed" | "inferred";  // M2
}

export interface PreclusiveClock {
  kind: "impugnacao_edital" | "intencao_recurso" | "razoes_recurso"
      | "contrarrazoes" | "diligencia" | "empate_ficto" | "proposta";
  basis: "corridos" | "uteis_horacheia";      // I4 — recurso = dias úteis + hora-cheia
  dueAt: string;                              // ISO datetime
  armedBy: "dataSessao" | "ata" | "evento_portal";  // I9 — proativo, não só reativo
  status: "armado" | "alertado" | "vencido" | "cumprido";
}
```
**Motor de prazo (I4):** função `businessDaysDeadline(from, dias, { feriadosNacionais, feriadosMunicipais })` + corte hora-cheia. `daysUntil` corrido **não** serve para recurso. Testes de fronteira obrigatórios (sexta+feriado; sessão 9h vs alerta T-0). Fuso: **America/Sao_Paulo** (GO=UTC-3=SP; a ressalva do §4 estava errada — corrigida).

### 11.4 Idempotência (resolve I6/A6/A7)

- `MaestroState.humanLayer` = **append-only, imutável pelo pipeline determinístico**.
- **Regra de exclusão testável:** se o `humanLayer` do edital tem qualquer decisão (aprovação de dossiê, `intend_to_appeal`, etc.), o scheduler horário entra em **read-only** para aquele edital — só pode **adicionar alerta**, nunca mudar `stage` nem sobrescrever artefato.
- Chave de idempotência = `(opportunityId, editalVersionHash)`. Hash mudou = evento `republicacao` (B5/I11), **não** merge.
- Falha de agente no meio (M1): estado **permanece**, marca `step_failed`, Sentinela alerta; nunca avança ato vinculante com fallback.

### 11.5 Gates — regra de fechamento (resolve M3)

Todo gate define: **aprovador** (papel), e o destino de cada ação:
- `aprovar` → libera a transição/ato humano;
- `corrigir` → volta ao agente que produziu (re-roda preservando humanLayer);
- `rejeitar` → encerra com motivo registrado.

`HUMAN_REQUIRED_ACTS` ampliado (I1): + `contrarrazoes`, `impugnacao_edital`, `resposta_diligencia` (além de lance/declaração/proposta/recurso).

### 11.6 Invariantes adotados (I9–I12) + reforços

I9 (preclusão nunca de sinal único — alerta proativo pela `dataSessao`) · I10 (terminal só após janela de terceiros + homologação) · I11 (mudança de edital invalida derivados e congela) · I12 (toda transição re-avalia o relógio). Reforços: I3 estende a datas (data preclusiva precisa de `source`+`confidence`; `inferred` só gera "CONFIRMAR DATA", nunca gate duro — M2); I5 vira "ausência de dado dentro de janela preclusiva = alerta CRÍTICO".

### 11.7 Mapa de resolução (rastreabilidade)

| Achado §10 | Resolvido em v2 por |
|---|---|
| F0 | §11.0 `MaestroStage`/`MaestroState`/`SessionResult` canônicos |
| B1 | aresta `pronto-protocolo →(confirma protocolo)→ protocolada` que arma Sentinela |
| B2 | estados separados `avaliar-recurso-inabilitacao` vs `-julgamento`, relógios próprios |
| B3 | `vencedora-provisoria`/`defendendo-vitoria` + relógio de contrarrazões; `vencido` só terminal pós-homologação (I10) |
| B4 | estado `em-diligencia` + relógio + gate |
| B5 | `congelado-edital-mudou` + `editalVersionHash` (I11) |
| B6 | estado `impugnacao-edital` ligado aos `SuspicionSignal`, gate advogado |
| B7 | alerta proativo pela `dataSessao` (I9); ata só para razões/contrarrazões |
| A1 | guarda de tarefas sanáveis abertas em `GO_COM_TAREFAS` antes de `entregar` |
| A2 | estado `aguardando-dado` (não-descarte) |
| A3 | sub-resultado `empate_ficto_meepp` + janela imediata |
| A4 | `prazo-perdido` + I12 (re-avalia relógio em toda transição) |
| A5 | evento `parceiro-cadastrado` → re-entra em `habilitado` |
| A6/A7 | §11.4 idempotência append-only + chave por versão |
| I4 | §11.3 motor de dias úteis hora-cheia |
| M1/M2/M3 | §11.4 step_failed · §11.6 data inferida · §11.5 fechamento de gate |

### 11.8 Próximo passo

Re-validar a v2 com pedro-valerio (gate "zero caminhos errados"). Aprovada → **Fase A** começa por F0 (tipos canônicos + testes de transição incluindo os caminhos PROIBIDOS do §10.7), tudo determinístico/LLM-ready, sem ligar o cérebro.

---

## 12. Re-validação da v2 (pedro-valerio)

> **Data:** 2026-06-18 · **Auditor:** pedro-valerio (Process Absolutist)
> **Veredito:** 🟡 **APROVADO PARA FASE A COM 4 CORREÇÕES OBRIGATÓRIAS DE DESENHO (C1–C4) ANTES DE CODAR O `orchestrator.ts`.** A v2 resolve a maioria dos achados §10 de forma real (não cosmética) — em particular F0, B1, B2, B3, B4, B5, B6, B7 estão estruturalmente cobertos. Porém a própria v2 **introduziu arestas novas com caminhos errados** que a v1 não tinha: um ramo de transição (`CONSORCIO`) que não existe no motor real, uma transição não-determinística ("volta ao estado anterior") sem campo que a torne determinística, dois pseudo-terminais sem saída nomeada (`congelado-edital-mudou`, `prazo-perdido`), e uma colisão de origem entre `aguardando-dado`(A2) e `aguardando-dado(parceiro)`(A5). Tabela §11.7 contestada item a item abaixo.
> **Princípio:** _se o executor CONSEGUE codar errado, o desenho está errado._ As C1–C4 são baratas (todas resolvíveis no papel/tipo) e não reabrem nenhum BLOQUEANTE da v1.

### 12.1 Rastreabilidade contestada — cada achado §10 vs. v2

| Achado | v2 afirma resolver por | Verificado contra código/desenho | Status |
|---|---|---|---|
| **F0** | §11.0 tipos canônicos `MaestroStage`/`MaestroState`/`SessionResult` | Grep confirma: zero ocorrências em código → continuam sendo só proposta no doc (correto: é o 1º item da Fase A). Tipos são string-literal union + interface com `editalVersionHash`, `humanLayer[]`, `history[]`, `clocks[]`. Mapeamento `MaestroStage→WorkflowStage` declarado. | ✅ RESOLVIDO (no desenho; codar é a Fase A) |
| **B1** | aresta `pronto-protocolo →(confirma protocolo)→ protocolada` arma Sentinela | Aresta existe no §11.1 com payload nomeado (data/hora + nº processo). Sentinela arma relógio. Fecha o estado órfão. | ✅ RESOLVIDO |
| **B2** | `avaliar-recurso-inabilitacao` vs `-julgamento`, relógios próprios | Dois estados separados + `eniacOutcome` com `inabilitada`/`derrotada_julgamento` distintos + `PreclusiveClock` por tipo. | ✅ RESOLVIDO |
| **B3** | `vencedora-provisoria`/`defendendo-vitoria` + relógio contrarrazões; `vencido` só pós-homologação (I10) | `vencido` deixou de ser terminal-feliz imediato; passa por `vencedora-provisoria`→vigia janela de terceiros. `thirdPartyAppealWindow` no `SessionResult`. **Ver C-NOVO-3 (saída do mérito perdido).** | 🟡 PARCIAL |
| **B4** | `em-diligencia` + relógio + gate | Estado e relógio existem. **Mas a transição de SAÍDA "volta ao estado anterior" não é determinística — ver C2.** | 🟡 PARCIAL |
| **B5** | `congelado-edital-mudou` + `editalVersionHash` (I11) | Evento `[qualquer estado]→congelado-edital-mudou` existe; hash de versão modelado. **Mas `congelado-edital-mudou` não tem aresta de SAÍDA — ver C1.** | 🟡 PARCIAL |
| **B6** | `impugnacao-edital` ligado a `SuspicionSignal`, gate advogado | `SuspicionSignal` é real no código (`noyce-suspicion.ts`, `dataLimiteImpugnacao` já calcula a janela art.164 com dias úteis+feriados). Estado novo se liga a ele. Forte. | ✅ RESOLVIDO |
| **B7** | alerta proativo pela `dataSessao` (I9); ata só p/ razões/contrarrazões | `PreclusiveClock.armedBy: "dataSessao"` + alerta proativo pré-sessão no diagrama. Separação proativo/reativo explícita. I9 adotado e declarado testável. | ✅ RESOLVIDO |
| **A1** | guarda de tarefas sanáveis abertas em `GO_COM_TAREFAS` antes de `entregar` | Guarda nomeada no diagrama (tarefas sanáveis viram alertas Sentinela c/ dono+prazo). `HabilitationGap.sanabilidade` é real. **Mas a guarda diz "viram alertas" e mesmo assim avança para `entregando` — o veto real de protocolo (gap sanável bloqueante não-resolvido) precisa estar no gate `pronto-protocolo`, não só virar alerta. Ver C4.** | 🟡 PARCIAL |
| **A2** | estado `aguardando-dado` (não-descarte) | Estado existe, Sentinela vigia prazo, não conta como descarte. | ✅ RESOLVIDO |
| **A3** | sub-resultado `empate_ficto_meepp` + janela imediata | `eniacOutcome: "empate_ficto_meepp"` + `PreclusiveClock kind:"empate_ficto"`. **Mas no diagrama o ramo empate-ficto é um beco: `--> [janela imediata: humano cobre lance]` não nomeia o estado-destino após cobrir/não cobrir. Ver C-NOVO-4.** | 🟡 PARCIAL |
| **A4** | `prazo-perdido` + I12 (re-avalia relógio em toda transição) | I12 declarado; `[qualquer transição que custa tempo]→prazo-perdido`. **`prazo-perdido` não tem saída — é terminal? registrado e encerra? Ver C1.** | 🟡 PARCIAL |
| **A5** | evento `parceiro-cadastrado` → re-entra em `habilitado` | Evento e retorno existem. **Mas colide com A2: o mesmo estado `aguardando-dado` é usado para "falta dado de análise" (A2) E "falta parceiro de consórcio" (A5), com eventos de saída diferentes (`dado-recebido` vs `parceiro-cadastrado`). Sem discriminador, o executor não sabe qual evento aplica. Ver C3.** | 🟡 PARCIAL |
| **A6/A7** | §11.4 idempotência append-only + chave por versão | `humanLayer` append-only + scheduler read-only sobre estado com decisão humana + chave `(opportunityId, editalVersionHash)`. Regra de exclusão declarada testável. | ✅ RESOLVIDO (ver 12.3 sobre testabilidade) |
| **I4** | §11.3 motor dias úteis hora-cheia | `businessDaysBetween` JÁ existe no código (com feriados nacionais) mas é **dateOnly, sem hora-cheia** (verificado: usa `parseDateOnly`/`setUTCDate`). v2 reconhece e especifica `businessDaysDeadline(...)` + corte hora-cheia + `basis: "uteis_horacheia"`. Fuso corrigido (GO=SP=UTC-3, ressalva v1 retirada — correto). | ✅ RESOLVIDO (no desenho; é código crítico da Fase A) |
| **I6** | §11.4 | idem A6/A7. | ✅ RESOLVIDO |
| **I9** | alerta proativo pela `dataSessao` | `armedBy: "dataSessao"`; teste prescrito. | ✅ RESOLVIDO |
| **I10** | `vencido` só pós janela de terceiros + homologação | Declarado e refletido no diagrama. | ✅ RESOLVIDO |
| **I11** | mudança de edital invalida derivados + congela | `editalVersionHash` + `congelado-edital-mudou` + marcar ERM/HabilitationResult `stale`. **Falta: o diagrama não mostra a aresta que TIRA do congelamento (re-triagem). Ver C1.** | 🟡 PARCIAL |
| **I12** | toda transição re-avalia o relógio | Declarado `[I12: re-checa prazo em TODA transição]`. | ✅ RESOLVIDO (vira guarda compartilhada testável) |
| **M1** | §11.4 `step_failed`, estado permanece | Regra explícita: falha de agente → estado permanece, marca `step_failed`, nunca avança ato vinculante com fallback. | ✅ RESOLVIDO |
| **M2** | §11.6 data inferida só "CONFIRMAR DATA" | `SessionResult.confidence: observed\|inferred` + regra "inferred não arma gate duro". `PreclusiveClock` precisa carregar esse `confidence` também — ver nota C-NOVO-5 (menor). | 🟡 PARCIAL |
| **M3** | §11.5 fechamento de gate | aprovar/corrigir/rejeitar com destino de cada um. "corrigir → volta ao agente que produziu". Resolve o padrão recorrente. | ✅ RESOLVIDO |

**Placar:** ✅ 14 · 🟡 8 · ❌ 0. Nenhum achado da v1 ficou NÃO RESOLVIDO. Os 8 PARCIAIS concentram-se em arestas novas, condensados em C1–C4 + notas.

### 12.2 BLOQUEANTES NOVOS introduzidos pela v2 (arestas que a v1 não tinha)

**C1 — BLOQUEANTE — três estados novos são becos sem saída nomeada: `congelado-edital-mudou`, `prazo-perdido` e (parcialmente) o pseudo-terminal.**
O §11.0 classifica `congelado-edital-mudou` como "pseudo-terminal: exige re-triagem humana", mas **nenhuma aresta no §11.1 sai dele**. A v1 exigia (regra de auditoria): _todo estado tem entrada E saída nomeadas._ Como o operador tira um edital do congelamento? Por re-triagem — mas isso não está desenhado. Idem `prazo-perdido`: o §11.1 só tem a entrada (`[qualquer transição]→prazo-perdido`); não diz se é terminal absoluto (registrado e encerra) ou se admite retorno quando o prazo perdido era de uma etapa não-fatal (ex.: perdeu janela de uma diligência mas o certame segue). **Sem isso, o executor codará `prazo-perdido` como terminal de tudo, matando editais que ainda eram salváveis — ou como não-terminal, deixando o edital vagar.**
**Correção C1:** (a) `congelado-edital-mudou --(humano re-tria a versão nova do edital)--> triado` (re-entra no início, com `editalVersionHash` novo; o `humanLayer` antigo é preservado mas marcado como referente à versão anterior). (b) Decidir e desenhar: `prazo-perdido` é **terminal por prazo** (registrado, com `clock.kind` que venceu anotado) — e prazos NÃO-fatais (diligência respondível ainda, etapa interna) NÃO devem cair em `prazo-perdido`, mas gerar `step_failed` + alerta (M1) mantendo o estado. Listar explicitamente QUAIS `PreclusiveClock.kind` levam a `prazo-perdido` (proposta, intencao_recurso, razoes_recurso, contrarrazoes, impugnacao_edital — os preclusivos de verdade) e quais não (diligencia interna → alerta, não morte).

**C2 — BLOQUEANTE — `em-diligencia --responde--> volta ao estado anterior` NÃO é determinístico: `MaestroState` não tem `previousStage`.**
O founder apontou exatamente isto. A interface `MaestroState` (§11.0) tem `stage`, `editalVersionHash`, `humanLayer`, `history[]`, `clocks[]` — **nenhum campo guarda de qual estado a diligência foi aberta.** "Volta ao estado anterior" obriga o executor a inferir o anterior lendo `history[]`, e o último item do history pode não ser o estado de origem (pode ter havido um alerta, um re-check de relógio I12, um `step_failed`). Inferência de destino a partir de histórico = caminho errado garantido (volta para o estado errado). Além disso, diligência pode abrir de DOIS pontos diferentes: na **habilitação da sessão** (origem `em-sessao`) e o art. 64 também admite diligência na fase de habilitação **antes** do julgamento — origens distintas com retornos distintos.
**Correção C2:** adicionar `returnTo: MaestroStage` ao `MaestroState` (ou um campo `diligence: { openedFrom: MaestroStage; clock: PreclusiveClock }`). A aresta vira `em-diligencia --responde--> {returnTo}` determinística. Teste obrigatório: abrir diligência de `em-sessao` retorna a `em-sessao`; abrir de `habilitado` retorna a `habilitado`. Sem campo de retorno explícito, REPROVA.

**C3 — BLOQUEANTE — `aguardando-dado` é sobrecarregado por DUAS origens com eventos de saída diferentes (A2 vs A5) sem discriminador.**
O §11.1 usa `aguardando-dado` para: (i) `confiança < piso` (A2, sai por dado recebido) e (ii) `CONSORCIO --> aguardando-dado (parceiro)` (A5, sai por `parceiro-cadastrado`). São duas espera-de-coisa-diferente no MESMO estado. O executor que receber um evento `dado-recebido` num edital que na verdade esperava `parceiro` vai roteá-lo errado (re-roda Prisma quando devia re-rodar Forja com consórcio). Sobrecarga de estado sem discriminador = ambiguidade de transição = caminho errado.
**Correção C3:** ou (a) `aguardando-dado` carrega um campo `waitingFor: "analise" | "parceiro_consorcio" | "certidao" | ...` que seleciona deterministicamente o evento de saída e o agente a re-rodar; ou (b) separar em dois estados (`aguardando-dado` e `aguardando-parceiro`). Preferência: (a) com enum fechado, porque o conjunto de "dados que faltam" vai crescer (certidão, balanço, atestado) e cada um re-entra num ponto diferente. Teste: edital em `aguardando-dado(parceiro)` que recebe evento `dado-recebido` (não-parceiro) → REJEITADO/no-op, não avança.

**C4 — BLOQUEANTE — `CONSORCIO` é um ramo de transição que NÃO existe no motor real; `GO_COM_TAREFAS` avança para `entregando` apesar de A1.**
Dois defeitos na transição `habilitado --Forja-->`:
- (i) O diagrama §11.1 ramifica em `NO_GO insanável / GO_COM_TAREFAS / CONSORCIO / GO`. Mas `HabilitationVerdict` real (verificado em `noyce-model.ts`) é **exatamente `{ GO, GO_COM_TAREFAS, PENDENTE_DADO, NO_GO }` — `CONSORCIO` NÃO é um verdict.** Consórcio é uma `ConsortiumEvaluation`/recomendação dentro de `tarefas` ("avaliar modo consorcio"), e o verdict solo nesses casos é `NO_GO`/`PENDENTE_DADO`. Se o executor implementar um ramo `case "CONSORCIO"` no switch do verdict, ele nunca dispara (dead branch) e o caminho real (NO_GO solo + recomendação de consórcio) cai no ramo `arquivado-motivo`, **matando o edital que era ganhável via consórcio**. Este é um caminho errado NOVO, criado pela v2.
- (ii) `GO_COM_TAREFAS` avança para `entregando` e a v2 (A1) diz que tarefas viram alertas. Mas o veto preclusivo real precisa estar no **gate de saída `pronto-protocolo`**: se uma tarefa de habilitação SANÁVEL e BLOQUEANTE (ex.: CND vencida) ainda estiver aberta quando o humano for confirmar protocolo, o gate tem de BLOQUEAR. "Virar alerta do Sentinela" não impede o avanço; impede o esquecimento. São coisas diferentes.
**Correção C4:** (i) a transição `habilitado→` deve ramificar pelos 4 verdicts REAIS. O destino de consórcio é derivado de `NO_GO/PENDENTE_DADO solo + ConsortiumEvaluation.aceitaPeloEdital + needsConsorcioPartner`, levando a `aguardando-dado(waitingFor: parceiro_consorcio)` (C3), NÃO de um verdict `CONSORCIO` inexistente. `PENDENTE_DADO` → `aguardando-dado` (já é o A2). (ii) o gate `pronto-protocolo` recebe veto explícito: "nenhuma `HabilitationGap` `sanabilidade=SANAVEL` marcada bloqueante pode estar não-resolvida". Teste do caminho proibido: `entregando` com gap sanável bloqueante aberto → confirmar protocolo é REJEITADO.

### 12.3 Arestas novas menores (ALTA/MÉDIA — não bloqueiam Fase A, mas entram nos testes)

- **C-NOVO-3 (ALTA) — `defendendo-vitoria`: para onde vai se a ENIAC PERDE o mérito do recurso de terceiro?** (Pergunta do founder.) O §11.1 leva `terceiro recorre → defendendo-vitoria (contrarrazões)`, mas não nomeia a saída. Dois desfechos: (a) recurso de terceiro NEGADO → segue para `vencido` (homologação); (b) recurso de terceiro PROVIDO → a ENIAC **deixou de ser vencedora**: pode ter sido desclassificada/inabilitada por decisão superior, abrindo p/ ELA uma nova janela (recurso hierárquico / pedido de reconsideração, conforme o caso). Não pode cair em `vencido` nem sumir. **Correção:** `defendendo-vitoria --recurso de 3º negado + homologação--> vencido`; `--recurso de 3º provido (ENIAC perde a posição)--> avaliar-recurso-julgamento` (reusa o estado de avaliação de fundamento, com relógio próprio do novo ato). Sem isso, ganhar-e-depois-perder-no-recurso-de-terceiro vira beco.
- **C-NOVO-4 (ALTA) — `empate-ficto ME/EPP` não nomeia estado-destino.** §11.1: `empate-ficto --> [janela imediata: humano cobre lance]` — colchete é ação, não estado. Após cobrir o lance, o resultado da sessão ainda é `vencedora`/`derrotada`; após NÃO cobrir, é `derrotada`. **Correção:** empate-ficto é um sub-evento DENTRO de `em-sessao` (clock `empate_ficto`), não um estado paralelo; resolvido o lance, permanece em `em-sessao` aguardando o `SessionResult` final. Deixar isso explícito evita que o executor crie um estado `empate-ficto` órfão.
- **C-NOVO-5 (MÉDIA) — `PreclusiveClock` precisa carregar `confidence` (M2).** A regra M2 (data `inferred` não arma gate duro) vive no `SessionResult.confidence`, mas o `PreclusiveClock` (que é quem efetivamente ARMA o alerta/gate) não tem campo de confiança. Um clock armado a partir de data inferida precisa carregar isso para o gate decidir entre "CONFIRMAR DATA" e gate duro. **Correção:** adicionar `dateConfidence: "observed" | "inferred"` ao `PreclusiveClock`; gate duro só sobre `observed`.
- **C-NOVO-6 (MÉDIA) — `HUMAN_REQUIRED_ACTS` ainda não foi ampliado no código.** §11.5 diz "+contrarrazoes, impugnacao_edital, resposta_diligencia", mas a constante real em `noyce-source-registry.ts` segue `["lance","declaracao","proposta","recurso"]`. É trabalho da Fase A — apenas registrar que a ampliação é parte do gate de saída (I1), com teste que prova que os 3 novos atos são bloqueados como `externalActBlocked`.

### 12.4 Cobertura final (checklist absolutista)

- **Todo estado tem entrada E saída nomeadas?** ❌ ainda não: `congelado-edital-mudou` e `prazo-perdido` sem saída (C1); diligência com saída não-determinística (C2). Após C1+C2 → ✅.
- **Todo prazo preclusivo continua coberto?** ✅ — proposta, impugnação(art.164), intenção de recurso (proativo, B7/I9), razões, contrarrazões (B3), diligência (B4), empate ME/EPP (A3). O conjunto de `PreclusiveClock.kind` cobre todos. Reforço: amarrar quais levam a `prazo-perdido` (C1).
- **A regra de idempotência §11.4 é testável?** ✅ — sim, e melhor que a v1: "humanLayer não-vazio ⇒ scheduler read-only para aquele edital" é uma asserção binária verificável (teste: scheduler tenta mudar `stage` de edital com `intend_to_appeal` → REJEITADO; só adiciona alerta → PASSA). Chave `(opportunityId, editalVersionHash)` testável por hash. A única peça a não deixar implícita: "adicionar alerta" deve ser a ÚNICA mutação permitida ao scheduler em estado human-locked — enumerar a allowlist no teste.
- **Executor consegue pular etapas?** Não em saltos da v1 (B-series fechados). Os riscos remanescentes são de roteamento ambíguo (C3) e ramo morto/morte indevida (C4), não de salto — e C3/C4 os fecham.

### 12.5 Veredito

🟡 **APROVADO PARA FASE A condicionado a C1–C4 corrigidos no DESENHO (§11) antes da 1ª linha de `orchestrator.ts`.** São correções de tipo/aresta, baratas, sem reabrir nenhum BLOQUEANTE v1. C-NOVO-3 e C-NOVO-4 (ALTA) devem entrar como casos de teste de transição da Fase A (incluindo os caminhos PROIBIDOS); C-NOVO-5/6 (MÉDIA) são itens de implementação da Fase A. Recomendação: Orion aplica C1–C4 num patch §11 (ou §11.9 "ajustes pós-re-validação") e os 4 testes negativos correspondentes entram no gate de saída da Fase A junto aos do §10.7.

---

## 13. Patch de desenho pós-re-validação — C1–C4 + C-NOVO (Orion, 18/Jun)

> Aplica as correções condicionantes da §12. Emenda a §11. Depois disto o desenho está **travado para a Fase A**.

**C1 — becos sem saída.**
- `congelado-edital-mudou --(humano re-tria a versão nova; `humanLayer` antigo preservado e marcado como da versão anterior)--> triado`, com **novo `editalVersionHash`** (I11). Único caminho de volta; nada sai automático.
- `prazo-perdido` = **terminal com `missedClock`** (anota qual venceu). Discriminação no clock: **`PreclusiveClock.fatalOnMiss: boolean`**. Fatais (`proposta`, `impugnacao_edital`, `intencao_recurso`, `razoes_recurso`, `contrarrazoes`, `empate_ficto`) → miss = `prazo-perdido` (ou o terminal do ramo, p.ex. recurso = `encerrado-sem-recurso`). Não-fatais (ex.: diligência interna ainda respondível) → **`step_failed` + alerta CRÍTICO** (M1/I5), estado **permanece**. Nunca matar edital salvável.

**C2 — retorno determinístico da diligência.** `MaestroState` ganha **`returnTo: MaestroStage | null`** (ou `diligence:{ openedFrom, clock }`), setado na ENTRADA. `em-diligencia --responde--> {returnTo}`. Nunca inferir de `history[]`. Teste: abriu de `em-sessao`→volta a `em-sessao`; abriu de `habilitado`→volta a `habilitado`.

**C3 — `aguardando-dado` desambiguado.** Ganha **`waitingFor: "analise" | "parceiro_consorcio" | "certidao" | "balanco" | "atestado"`** (enum fechado, extensível). Seleciona deterministicamente o evento de saída e o agente a re-rodar + usa `returnTo`. Teste: edital em `aguardando-dado(parceiro_consorcio)` que recebe `dado-recebido` (não-parceiro) → no-op, não avança.

**C4 — `CONSORCIO` é dead branch; ramificar pelos 4 verdicts reais.** `HabilitationVerdict = {GO, GO_COM_TAREFAS, PENDENTE_DADO, NO_GO}` (`noyce-model.ts:477` — sem `CONSORCIO`). Fluxo correto de `habilitado`:
```
GO              --> entregando
GO_COM_TAREFAS  --> entregando
PENDENTE_DADO   --> aguardando-dado(waitingFor="analise")
NO_GO + ConsortiumEvaluation.aceitaPeloEdital + needsConsorcioPartner --> aguardando-dado(waitingFor="parceiro_consorcio")   ← NÃO arquiva
NO_GO (sem rota de consórcio) --> arquivado-motivo
```
E o gate **`pronto-protocolo` ganha veto explícito**: nenhuma `HabilitationGap` `sanabilidade=SANAVEL` **bloqueante** pode estar não-resolvida ao confirmar protocolo (A1). Alerta ≠ veto: alerta impede esquecer, veto impede avançar.

**C-NOVO-3 (ALTA) — saída de `defendendo-vitoria`.** recurso de 3º **negado** + homologação → `vencido`; recurso de 3º **provido** (ENIAC perde a posição) → **`avaliar-recurso-julgamento`** (relógio próprio do novo ato). Nunca `vencido` nem limbo.

**C-NOVO-4 (ALTA) — empate-ficto é sub-evento, não estado.** Vive DENTRO de `em-sessao` (clock `empate_ficto`, `fatalOnMiss=true`). Coberto o lance ou não, permanece em `em-sessao` aguardando o `SessionResult` final. Não criar nó `empate-ficto` órfão.

**C-NOVO-5 (MÉDIA) — `PreclusiveClock.dateConfidence: "observed" | "inferred"`.** O clock arma o gate, então carrega a confiança (M2): gate duro só sobre `observed`; `inferred` → "CONFIRMAR DATA" com dono.

**C-NOVO-6 (MÉDIA) — `HUMAN_REQUIRED_ACTS`** ampliar p/ `+contrarrazoes, impugnacao_edital, resposta_diligencia` é tarefa da Fase A (hoje `[lance,declaracao,proposta,recurso]` em `noyce-source-registry.ts`); teste prova que os 3 novos saem como `externalActBlocked` (I1).

### 13.1 Gate de saída da Fase A — testes negativos obrigatórios (somam aos do §10.7)
1. `em-diligencia` sem `returnTo` → REJEITADO (C2).
2. `aguardando-dado` sem `waitingFor` → REJEITADO (C3); `parceiro_consorcio` recebendo `dado-recebido` → no-op.
3. `NO_GO + needsConsorcioPartner` indo a `arquivado-motivo` → REJEITADO; deve ir a `aguardando-dado(parceiro_consorcio)` (C4).
4. `pronto-protocolo` com gap SANÁVEL bloqueante aberto → REJEITADO (C4).
5. `defendendo-vitoria` com recurso de 3º provido indo a `vencido` → REJEITADO; deve ir a `avaliar-recurso-julgamento` (C-NOVO-3).
6. `congelado-edital-mudou` avançando sem re-triagem humana → REJEITADO (C1).
7. clock `fatalOnMiss=false` vencido levando a `prazo-perdido` → REJEITADO; deve gerar alerta e manter estado (C1).

**Estado do desenho:** ✅ **TRAVADO PARA A FASE A.** Tipos canônicos (F0) + §11 + este patch definem o contrato; nenhum BLOQUEANTE v1 reaberto; arestas novas da v2 fechadas. Próximo: codar F0 (tipos + testes de transição com os caminhos PROIBIDOS) → `orchestrator.ts` determinístico/LLM-ready.

---
*Doc 32 — mantido por Orion (aios-master). Fundamentado na auditoria real-vs-mock de 18/Jun (2 agentes Explore). §10 = validação pedro-valerio (v1); §11 = máquina de estados v2 (Orion); §12 = re-validação pedro-valerio (v2); §13 = patch C1–C4 + C-NOVO (Orion). **Desenho travado para Fase A.***
