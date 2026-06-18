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
*Doc 32 — mantido por Orion (aios-master). Fundamentado na auditoria real-vs-mock de 18/Jun (2 agentes Explore sobre habilitar/entregar e acompanhar/recorrer/maestro). §10 adicionado por pedro-valerio (validação de processo, 18/Jun).*
