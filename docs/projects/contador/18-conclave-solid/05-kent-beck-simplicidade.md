# Kent Beck — Simplicidade Radical, Testabilidade e a Conta que Ninguém Fez (S7)

> **Conclave SOLID — Rodada 1 (análise independente)** · 2026-06-12
> **Revisor:** Beck (kent-beck) — XP, TDD, Tidy First, YAGNI
> **Alvo:** `17-arquitetura-core-v1.md` (v1.0 FINAL) + `16-conclave-arquitetura/02-data-engineer-schema.md` + `00-context/CONTEXT.md`
> **Mandato:** S7 — o que ninguém questionou: o tamanho do dia-0, o monolith como premissa, 1 dev vs a superfície total.

---

Antes de cortar, deixe-me dizer o que está **certo** — porque tem coisa muito certa aqui, e cortar sem reconhecer o que é bom é só outra forma de preguiça:

- **A trilha nascer no C0, manual, no schema final** é tidy-first de livro. O contrato de dados nasce cedo, o comportamento vem depois. É exatamente como eu faria.
- **A banlist como teste de CI** é a melhor ideia do documento inteiro. Alguém transformou uma convenção jurídica em teste executável. Isso é testabilidade como design. Quero mais disso, não menos.
- **As migrations fase-gated da Dara** ("nenhuma tabela nasce antes da fase que a usa") são disciplina YAGNI genuína. O schema de 72KB é menos BDUF do que parece — volto nisso no §4.
- **Partições de `nota` desde o dia 0** — concordo sem reserva. Migrar tabela viva pra particionada é a migration mais cara que existe; isso é contrato de dados, nasce pronto.

Agora a parte implacável. *Software development is a learning process* — e o que esse documento revela é um processo que aprendeu a **somar** mas desaprendeu a **subtrair**.

---

## 1. O elefante: a conta de carga que ninguém fez

A pergunta socrática primeiro: **se cada uma das 28 condições é individualmente razoável, a soma delas é razoável?**

Minha resposta: não. Razoabilidade não é aditiva. E o §15 do doc 17 entrega o sintoma com uma precisão quase cômica: **"26 incorporadas · 2 adaptadas · 0 rejeitadas."** Um conclave que rejeita zero condições não está revisando — está acumulando. Cada revisor defendeu o SEU requisito (Heleno o jurídico, Roberto a operação, Anderson o comercial) e ninguém tinha o papel de defender o **calendário**. O calendário é o stakeholder que não foi convidado. É por isso que estou aqui.

### 1.1 A conta, semana por semana (1 dev, estimativas honestas com IA-assist)

8 meses ≈ **34-35 semanas**. Mas o C0 vem primeiro (rodar Concierge + ciclo de venda dos 5 escritórios ≈ 4-8 semanas de calendário) e o mesmo dev opera o Concierge, dá suporte ao piloto e roda os 7 spikes. F1 tem, realisticamente, **~24-28 semanas de teclado disponíveis**. Contra isso, o que a F1 especifica:

| Peça da F1 (doc 17 §2) | Semanas honestas | Nota |
|---|---|---|
| Setup Supabase + migrations 000/001 c/ M-1…M-15 | 2-3 | DDL pronto ajuda, mas RLS+testes de isolamento por tabela é trabalho real |
| Motor regras + **RAG** + confiança calibrada | 6-8 | RAG calibrado não é prompt — é eval, threshold, drift |
| Base referência bitemporal + camadas + reconciliação + monitor NT | 3-4 | Importador + diff humano + job |
| Golden-set harness + integração rotulagem | 2-3 | + dependência externa (tributarista) que não é teclado |
| Trilha automatizada (RPCs, reconciliação noturna) + fecho diário ACT | 3-4 | Integração ACT real + verificação de TST |
| **PAdES em lote** (assinatura embutida e-CPF) | 3-6 | ⚠️ Pântano clássico. Integração ICP-Brasil no browser é onde cronogramas vão morrer |
| Fila de revisão + materialidade + estados + SLA + escalonamento + telemetria de teatro | 3-4 | A UI mais usada do produto |
| Export ERP (layouts Domínio + Alterdata) | 1-2 | O doc diz "~1 semana"; com descoberta de layout (N-5) e protocolo de importação, 2 |
| Parser EFD blocos C/M | 2-3 | Layout público, mas fixture real + edge cases |
| Relatório de Valor (2 templates + banlist + job mensal) | 2-3 | |
| Metering + assinatura + franquia/excedente + job fechamento | 2-3 | "dia-0 da F1" segundo M-10 |
| Módulo de Implantação (checklist + import lote + enriquecimento CNPJ) | 2 | |
| White-label estrutural (theming por tenant) | 1-2 | |
| **Total F1 como especificada** | **32-45 semanas** | **contra 24-28 disponíveis** |

E isso **sem** o Demo Kit do C0 (2-4 semanas), **sem** o risco Spike 5 (+30-40% se o Gestorize vier ruim — sobre a F1 inteira!), **sem** F2/A, **sem** bugs, suporte a piloto, férias, e sem o fato de que "rodar 4 spikes em paralelo" (§16.4) para uma pessoa só se chama **fila**.

A conta não fecha. Não fecha nem no cenário otimista. E quando a conta não fecha, o que acontece na prática não é "atrasa" — é que **tudo fica 80% pronto e nada fica vendável**. Prefiro 6 peças 100% prontas a 14 peças 80% prontas, porque 80% pronto não assina laudo.

### 1.2 O que é F1 real vs medo disfarçado de arquitetura

A pergunta que separa: **"o que acontece se o primeiro cliente pagante usar o produto SEM esta peça?"**

- Sem motor, trilha, fila de revisão, laudo assinado, carimbo → **não existe produto**. F1 real.
- Sem export ERP → re-digitação, churn mês 3 (Roberto tem razão). F1 real — mas **um** layout, o do piloto.
- Sem billing automatizado, com 5 clientes → o Breno manda 5 boletos por e-mail e anota numa view. **Nada acontece.**
- Sem módulo de implantação, com 5 clientes → o Breno roda um script de import. **Nada acontece.**
- Sem theming engine → o laudo já sai com a marca do escritório (`escritorio.marca` jsonb, que existe desde o C0). **Nada acontece.**
- Sem telemetria de aprovação cega, com 3 escritórios → o Breno OLHA os dados. **Nada acontece.**

O princípio §1.9 ("Demo Kit, Implantação, Relatório de Valor e metering são componentes de arquitetura **com o mesmo status do motor**") é a frase onde o conclave anterior virou comitê. Não, não têm o mesmo status. O motor sem billing vende; o billing sem motor não vende nada. Metering, implantação e white-label automatizados em escala de 5 clientes são **medo de não vender disfarçado de arquitetura**. A resposta certa pro medo de não vender é o Concierge (D4) — que o próprio CONTEXT já prescreve.

---

## 2. A F1 mínima que mantém a promessa "apuração defensável" vendável

A promessa vendável é: *"suba seus XMLs; o motor encontra divergências com fundamento normativo; seu contador decide e assina; sai um laudo defensável, carimbado, reproduzível; os ajustes aprovados entram no seu Domínio."* Tudo que está fora desta frase é candidato a corte.

```
F1-MÍNIMA (16-20 semanas):
  upload XML (porta simples — ver §6 sobre Documentize)
    → MOTOR DETERMINÍSTICO (regras puras sobre base oficial bitemporal; SEM RAG ainda)
    → apontamentos c/ confiança + fundamento (schema M-2 COMPLETO desde já — colunas são baratas)
    → fila de revisão SIMPLES (aprova/rejeita c/ motivo dropdown; individual; sem lote, sem SLA-job)
    → trilha hash-chain automatizada + carimbo ACT POR LAUDO + fecho diário (é barato, e é jurídico — mantém)
    → laudo PDF; CONTADOR ASSINA NO ASSINADOR QUE JÁ USA (download → assina → re-upload, hash conferido)
    → export CSV: 1 layout (o ERP do piloto)
    → Relatório de Valor: 1 template (view sobre a trilha)
    → metering: UMA VIEW canônica (medição nasce; cobrança é manual)
```

### A tabela de cortes — cada um com o gatilho de re-adição

Corte sem critério de volta é amputação; corte com critério é opção. *You aren't gonna need it — until you are, and here's how you'll know:*

| # | Corte (sai da F1) | Por que pode esperar | Gatilho de RE-adição |
|---|---|---|---|
| K-1 | **RAG/embeddings no motor** | Regras determinísticas sobre base oficial resolvem o grosso; RAG adiciona não-determinismo ANTES de provarmos o determinístico (ver §5.2) | Golden-set mostra recall insuficiente nos casos descrição-dependentes (NCM ambíguo); ≥15-20% dos itens sem regra aplicável |
| K-2 | **PAdES embutido em lote** | Contador já assina DCTFWeb todo mês no assinador dele; download→assina→re-upload custa ~1 semana, embutir custa 3-6 | Escritório piloto passa de ~20 laudos/mês E reclama do fluxo; ou 10+ tenants |
| K-3 | **Parser EFD** | O Concierge JÁ cruza 1 EFD real **à mão** (doc 17 §7) — isso é o teste da hipótese do Roberto. Valide aprendendo, depois automatize | Pilotos confirmam que a divergência XML×declarado é o que sustenta o laudo; ou ativação da isca de recuperação (D6) |
| K-4 | **Billing/assinatura/franquia/excedente (jobs)** | A VIEW de medição nasce na F1 (contrato de dados, D7); os jobs e a tabela `assinatura` operacional, não | 10º cliente pagante; ou 1º excedente real de franquia |
| K-5 | **Módulo de Implantação** | Import de carteira = script rodado pelo dev no onboarding; checklist = doc | 10º cliente; ou onboarding passa de 1 dia útil de trabalho manual |
| K-6 | **White-label theming engine** | `marca` jsonb no laudo já existe desde C0; opacidade de preço = 1 RLS policy trivial (essa FICA) | Primeiro escritório que exige portal/e-mail com domínio próprio |
| K-7 | **Decisão em LOTE por materialidade (UI)** | N-1 está ABERTA — formato jurídico do lote não foi validado (Spike 6). Construir UI sobre tese jurídica pendente é retrabalho anunciado. Colunas M-2 ficam | Spike 6 valida o formato com o Heleno E volume real ultrapassa capacidade de decisão individual |
| K-8 | **SLA-jobs, escalonamento, view de inertes, telemetria de aprovação cega** | Campos `decidir_ate`/estados nascem no schema (contrato); os JOBS de alerta, com 3-5 tenants, são o founder olhando uma query | 5+ tenants ativos; ou 1º caso real de "aprovado inerte" observado |
| K-9 | **Monitor automatizado de NT** | Import manual mensal de `base_versao` com diff humano-aprovado (já desenhado) basta | 2+ atualizações de base/mês; ou 1ª NT perdida que envelheceu um laudo |
| K-10 | **2º layout de export ERP** | Um piloto, um ERP | 1º cliente pagante com o outro ERP |
| K-11 | **Relatório de Valor white-label (2ª ponta)** | Template "dono" prova o instituto; o repasse ao cliente final é decisão do escritório | 1º escritório que pede pra encaminhar ao cliente dele |

**O que eu NÃO corto** (e quero registrado, porque corte cego é tão ruim quanto inchaço):

- **Fecho diário ACT.** Olhei com vontade de cortar — e o argumento do Heleno me venceu: a disputa da denúncia espontânea é medida em **dias**, e o custo real é ~1 semana de dev + R$9-30/mês. Opção barata, valor jurídico alto. Fica.
- **Carimbo ACT por laudo.** É a âncora externa. Sem ela a trilha é o sistema atestando a si mesmo. Fica.
- **Bitemporalidade, fato_gerador_em, camadas de fonte, qualidade_insumo, estados estendidos** — tudo M-2/M-4/M-5. São COLUNAS. Custam nada agora e são impossíveis de retroceder (ver §3). Ficam todas.

---

## 3. Custo da opção vs custo de carregar — o critério explícito

O critério que proponho (e que o doc 02 da Dara já pratica intuitivamente, diga-se):

> **O que muda CONTRATO DE DADOS nasce no dia 0. O que é COMPORTAMENTO espera o gatilho.**

Porque contrato de dados não-capturado é **irrecuperável** — você não consegue reconstituir em 2027 "o que sabíamos em agosto de 2026" se não gravou na hora. Comportamento, por outro lado, é sempre adicionável sobre dados bem-capturados.

| Nasce no dia 0 (retrofit caro/impossível) | Espera o gatilho (opção barata de exercer) |
|---|---|
| Bitemporal na base de referência (`vigencia` + `conhecida_em`) — **concordo: nasce pronto**. Re-derivar "o que sabíamos quando" depois é impossível | Job de fecho ACT (carimbo não retro-ancora, mas por-laudo limita a janela) |
| Trilha append-only + hash-chain (é o produto; proveniência não se back-filla) | RAG (se a trilha grava `motor_versao`, o motor é plugável) |
| Partições de `nota` | pgmq/fila (F2, correto como está) |
| `fato_gerador_em`, `criterios_desempate`, `qualidade_insumo`, `camada`, estados M-2 | UIs de lote, SLA-jobs, telemetria |
| RLS default-deny + claim não-editável | Layouts extra de export, theming, billing-jobs |
| **Payload de `analise_executada` com versão COMPLETA do motor** — ver achado abaixo | Parser EFD (o dado bruto — o arquivo EFD — guarda-se no storage desde já; o parse é comportamento) |

### ⚠️ Achado de contrato de dados (furo real, dia-0 da F1)

O doc 17 §3.1 grava "versão do motor". **Não basta.** Quando o RAG entrar (K-1), reconstituir o laudo em 2031 exige: `motor_versao` + `modelo_id` + `prompt_hash` + `embedding_modelo/versao` + parâmetros. Isso é o S2 do brainstorm, e pela minha lente é **contrato de payload do evento `analise_executada`** — documenta-se AGORA (custa um parágrafo no doc 02 §risco-jsonb), mesmo que o RAG só exista depois.

E a consequência de design mais importante, que ninguém escreveu: **a defensabilidade NUNCA pode depender de re-executar um modelo.** API de LLM de terceiro não é re-executável em 2031 — o provedor descontinua o modelo. Logo: a camada defensável é (a) regras determinísticas re-executáveis contra `base_versao_id` + (b) o **registro** input/output da sugestão RAG + (c) a decisão humana assinada. O RAG é gravado como artefato, não como computação reproduzível. Isso reforça o K-1: o caminho determinístico é o moat; o RAG é assistente.

---

## 4. O schema de 72KB antes do primeiro cliente — BDUF ou não?

Fui preparado pra malhar e saí elogiando metade. Sejamos justos em duas direções:

**Em defesa da Dara:** o doc 02 §8 fase-gateia as migrations — o dia-0 real são ~12 tabelas, não 30+. DDL de fase futura escrito como texto custa quase nada e o EXCLUDE de vigência, o hash-chain por tenant com advisory lock e a idempotência por UNIQUE são decisões que EU mandaria nascer prontas. O schema não é o problema.

**O problema honesto:** especificação detalhada de fase futura cria **ancoragem**. O comitê passa a tratar `consumo_mensal`, `implantacao`, `ajuste_export` como decididos — e o doc 17 os promove a "dia-0 da F1" (M-10) e "mesmo status do motor" (§1.9). O texto barato virou compromisso caro. O Concierge exercita: `escritorio`, `usuario`, `cliente`, `nota`, `nota_item`, `apontamento`, `laudo`, `evento_boa_fe`, `audit_log`, `ref.*`, `gestao.documento`. **Onze entidades.** Tudo além disso, no C0, é especulação escrita em SQL — aceitável como rascunho, perigosa como contrato.

**Onde o conclave virou comitê (resposta direta à pergunta):** não foi no schema — foi na síntese. 28 condições, 0 rejeições, e cada uma com um padrinho que voltaria a cobrar. A contradição com D4 não é "especificou demais"; é que **D4 diz "valide antes de construir" e a v1.0 responde "validaremos enquanto especificamos tudo"**. Especificar não é grátis: cada M-item especificado é uma promessa que alguém vai cobrar na F1, e foi assim que a F1 chegou a 32-45 semanas. O Concierge existe exatamente para **invalidar** partes desta especificação — se nada dela morrer após 5 escritórios reais, o Concierge não ensinou nada e foi só ritual.

A pergunta que deixo pro conclave: **qual seção do doc 17 vocês esperam que o Concierge mate?** Se a resposta é "nenhuma", D4 virou teatro.

---

## 5. Testabilidade como design

### 5.1 O primeiro teste dá pra escrever HOJE? Dá. Hoje, antes de qualquer migration.

O motor é candidato perfeito a função pura: `(item, base) → apontamentos[]`. O golden-set não é só gate de eval — **é a fixture do primeiro teste**:

```js
test('item monofásico tributado com PIS/COFINS gera apontamento', () => {
  const base = baseFixture('receita-it-rt-2025.002', { vigencia: '2026' });
  const item = { ncm: '30049099', cclasstrib_aplicado: '000001',
                 cst_aplicado: { pis: '01' }, emitida_em: '2026-03-10' };
  const apts = classificar(item, base);
  expect(apts).toContainEqual(expect.objectContaining({
    tipo_divergencia: 'monofasico_tributado',
    fundamento: expect.arrayContaining([expect.objectContaining({ norma: expect.any(String) })])
  }));
});
```

Vermelho hoje. Zero Supabase, zero RAG, zero migration. Os 200-500 itens do Spike 2 viram 200-500 casos de teste — **o Spike 2 não precisa esperar a F1; ele É o início da F1**. Red, green, refactor.

### 5.2 O que na arquitetura IMPEDE test-first — e os consertos

1. **RAG no meio do caminho determinístico** (o S2 do brainstorm, confirmado). Como está desenhado ("regras + RAG" num motor só), todo teste do motor vira não-determinístico. Conserto estrutural: **duas camadas com contratos separados** — Camada 1 determinística (pura, testada por asserção, re-executável: é ela que sustenta o laudo) e Camada 2 sugestiva/RAG (avaliada estatisticamente por eval-harness com threshold, nunca por asserção caso-a-caso). A proveniência distinta que o §3.6 dá às classes de **insumo**, dê às classes de **inferência**. Isso resolve S2 e habilita K-1.
2. **Lógica viva no banco** (triggers de máquina de estados, hash-chain, RPCs). Não é errado — invariante no banco é defesa em profundidade — mas exige Postgres nos testes. Regra de higiene: **trigger IMPÕE invariante, nunca COMPUTA decisão de negócio**; decisão fica na camada pura. O desenho atual respeita isso quase sempre — manter como teste de revisão de PR.
3. **Acoplamento a Supabase**: mitigável com Postgres local/efêmero (supabase CLI) no CI. O que não pode: teste de RLS só em staging. O teste de isolamento por tabela que o doc 10 promete deve ser **o primeiro teste de integração escrito**, não o último.

### 5.3 A pirâmide concreta

| Camada | O quê | Ferramenta/forma | Quando roda |
|---|---|---|---|
| **Unit (pura, larga)** | Motor determinístico ×golden-fixtures · cálculo de materialidade · banlist sobre TODOS os templates · geração CSV export (snapshot) · parser EFD (fixtures C/M) · montagem de payload de evento | Vitest/Jest, zero I/O | Cada commit, <30s |
| **Integração (Postgres efêmero)** | Isolamento RLS por tabela (default-deny: tenant A não lê B) · transições da máquina de estados (legais passam, ilegais explodem) · **property-test do hash-chain** (insere N, verifica cadeia; adultera 1, verificação acusa; mata a tx no meio, estado+evento ou nada) · RPCs estado+prova atômicos | supabase local / testcontainers | Cada PR |
| **Eval (estatístico — NÃO é teste)** | precision/recall do motor vs golden-set por cClassTrib/setor; threshold como gate | Harness próprio; relatório, não assert | Cada mudança de base/motor; CI gate |
| **E2E (fino)** | 1 caminho feliz: upload→apontamento→aprovar→laudo→trilha íntegra→export | Playwright, 1-3 cenários | Pre-release |

Distinção inegociável: **eval ≠ teste**. Teste determinístico quebra o build caso-a-caso; eval é agregado com threshold. Misturar os dois (Q8!) gera CI flaky que todo mundo aprende a ignorar — e CI ignorado é pior que CI nenhum.

---

## 6. Tidy first: a ordem das fases — e o primeiro passo ERRADO

A ordem macro (C0 valida → F1 motor → F2 captura → F3 emissor) é boa: cada fase arruma o terreno da próxima, e a trilha manual do C0 é o melhor exemplo. **Mas o primeiro dominó está apontado pro lado errado.**

O Demo Kit do C0 é "UI sobre Documentize/Gestorize" — e o Spike 5 (Gestorize é deployável?) está **pendente**. O passo mais importante do plano (validar a hipótese de negócio, D4) depende da dependência mais incerta do projeto (legado não-auditado). Se o Spike 5 falhar, o C0 escorrega junto.

E aqui o achado que considero o mais acionável da minha revisão: **essa dependência é INVENTADA.** Olhe o fluxo do C0 (§6.1): *"contador exporta XMLs"*. XML de NF-e é **estruturado** — parse trivial, sem OCR, sem hash perceptual, sem extração por coordenadas. Tudo que o Documentize oferece (pipeline de PDF/imagem, dedup perceptual, feedback) serve à classe `documento_extraido` — que é preocupação de **F1**, não do C0. O Demo Kit precisa de: um form de upload, um parser XML (~50 linhas), os apontamentos manuais do Concierge renderizados, um PDF brandado. **Uma página standalone, 1-2 semanas, zero risco de legado.**

Proposta de re-ordenação:

1. **Demo Kit standalone** (sem Gestorize) — destrava o C0 já, mata o acoplamento ao Spike 5.
2. **Spike 5 deixa de ser bloqueador existencial** e vira o que sempre deveria ter sido: decisão de **reuso da camada Gestão** (F1+). O "+30-40% se falhar" para de pairar sobre a F1-mínima — porque a F1-mínima (§2) não depende do Gestorize em nada: motor, trilha, fila e laudo são código novo de qualquer forma. D1 ("estender o Gestorize") é decisão travada de NEGÓCIO sobre a camada Gestão; lida como decisão TÉCNICA sobre o shell do core, ela acorrenta o moat ao maior desconhecido do projeto. Sugiro ao conclave precisar o escopo de D1: *Gestorize é a camada Gestão; o core nasce limpo e se integra a ela.*
3. **Spike 2 (golden-set) começa no dia 1 do C0** — porque ele é a fixture do motor (§5.1) e a rotulagem do tributarista é o caminho crítico de calendário que não é teclado.

Demais observações tidy-first: a F1 deixa terreno arrumado pra F2 (ingestão única com `origem` como metadado = a captura entra sem refactor — bom); F3 e add-on A estão correta e honestamente fora do horizonte. Sem retrabalho estrutural entre fases — o problema não é a ORDEM, é o VOLUME dentro da F1 e o primeiro passo do C0.

---

## 7. Q1-Q8 pela minha lente

| Q | Resposta curta |
|---|---|
| **Q1 Auditabilidade** | Parcial. Bitemporal + ledger ✅; mas "versão do motor" sem modelo/prompt/embedding é furo de contrato (§3). E o princípio: defensabilidade jamais depende de re-rodar modelo de terceiro — regras re-executáveis + RAG gravado como artefato + decisão humana assinada. |
| **Q2 Troca de provider** | Adapter + XML bruto nosso ✅. Preocupação de F2; não carregar antes. |
| **Q3 NT na sexta** | Import manual com diff humano-aprovado cobre os primeiros meses (K-9). Automatizar no gatilho, não no medo. |
| **Q4 Pico dia 5** | Com upload manual e 3-5 tenants, pico não existe ainda. pgmq na F2 está certo. Não pré-otimizar — o índice parcial da fila já é o suficiente. |
| **Q5 Cross-tenant** | RLS default-deny + teste por tabela ✅ — desde que o teste seja o PRIMEIRO de integração escrito, com caso adversarial (tenant A tenta ler B), não só o caminho feliz. |
| **Q6 COGS runaway** | Guardrail de F2 (`captura_ativa` OFF + teto). Correto e corretamente adiado. |
| **Q7 Gestorize ruim** ⭐ | O plano B "+30-40%" é estimativa, não desenho — e a resposta certa não é desenhar o plano B: é **remover a dependência** (§6). Demo Kit standalone + F1-mínima sem Gestorize ⇒ Spike 5 falhar custa só a decisão de reuso da camada Gestão, não o projeto. Risco existencial dissolvido por subtração. |
| **Q8 Falso-positivo +2pp pós-embedding** ⭐ | Golden-set como gate ✅, com duas exigências: (a) eval estatístico SEPARADO dos testes determinísticos (§5.3) — senão vira CI flaky ignorado; (b) troca de embedding OBRIGATORIAMENTE incrementa a versão do motor gravada na trilha — senão laudos pré e pós-troca são indistinguíveis na perícia. |

---

## 8. Veredito

**1 dev entrega a v1.0 como escrita em 8 meses? NÃO.** A F1 especificada custa 32-45 semanas contra ~24-28 disponíveis, com o risco Spike 5 (+30-40%) pairando e os spikes em "paralelo" que são fila. O documento é arquiteturalmente bom e aritmeticamente impossível.

**Entrega COM CORTES? SIM.** F1-mínima (§2) ≈ 16-20 semanas + C0 standalone (1-2 semanas + operação) cabem com folga para F2 começar dentro do runway. Os 11 cortes K-1…K-11 têm gatilho de re-adição explícito — nada é perdido, tudo é adiado até a realidade pedir. O que muda contrato de dados (bitemporal, trilha, partições, colunas M-2, payload completo de `analise_executada`) nasce no dia 0; o que é comportamento espera.

Três frases para a rodada adversarial:

1. Para o Heleno: mantive tudo que é jurídico-estrutural (ACT por laudo + fecho diário, bitemporal, CRC, ciclo fechado no schema) — cortei automação, não prova.
2. Para o Roberto: a EFD entra à mão no Concierge ANTES do parser — é o seu próprio argumento de validação aplicado a você.
3. Para o Anderson: metering nasce como view e o D7 fica intacto — billing automatizado com 5 clientes é otimizar o que ainda não existe.

O Concierge é um experimento. Experimento que não pode falsificar nada não é experimento — é cerimônia. Definam o que o C0 pode matar no doc 17, cortem a F1 até a conta fechar, e escrevam o primeiro teste do motor **esta semana**: ele está pronto pra ficar vermelho hoje.

*Software development is a learning process. A v1.0 atual planeja aprender depois de construir; baby steps planejam construir depois de aprender.*

— Beck. Write the test first. Always. 🟢
