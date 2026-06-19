# Preflight Codex Build F1 Foundation

> Data: 2026-06-15
> Escopo: preflight tecnico do handoff `21-handoff-codex-build-f1.md`.
> Status: PREFLIGHT TECNICO RESOLVIDO; BUILD AGUARDA VALIDACAO PO/FOUNDER + CHECKPOINT.

---

## 1. Fontes revisadas

1. `00-context/CONTEXT.md`
2. `14-concierge-mvp-spec.md`
3. `18-conclave-solid/99-sintese-conclave-solid.md`
4. `16-conclave-arquitetura/02-data-engineer-schema-v1.1.md`
5. `20-arquitetura-core-v1.1.md`
6. `21-handoff-codex-build-f1.md`
7. `24-golden-set-protocolo-rotulagem.md`
8. `package.json`, `apps/`, `packages/`, `docs/stories/`

---

## 2. Veredito

O handoff esta correto como direcao de engenharia, mas ainda nao esta pronto para execucao cega.

O corte de escopo esta bom: construir somente Fundacao F1-D0 (schema, motor puro, verificador e fitness functions), sem captura, UI, RAG, Gestorize ou add-ons. O problema esta em inconsistencias de contrato entre handoff, schema v1.1 e arquitetura v1.1.

Build deve aguardar resolucao dos bloqueios B1-B5.

---

## 2-bis. Metodo de construcao: SOLID aplicado

A construcao da Fundacao F1-D0 deve seguir SOLID como metodo de desenho e revisao, nao como pretexto para criar abstracoes cedo demais.

Aplicacao concreta no build:

1. **S - Single Responsibility:** cada pacote tem uma razao para mudar. Motor puro classifica; verifier verifica cadeia; DB package guarda migrations/tests SQL; RPC materializa estado+evento. Nenhum pacote deve acumular captura, UI, billing ou RAG.
2. **O - Open/Closed:** novas regras fiscais entram como dados/versionamentos (`base_versao`, `motor_versao`, `golden_set_versao`, `transicao_permitida`) antes de virar branching espalhado em codigo.
3. **L - Liskov:** adapters futuros (provider, RAG, motor Python) so podem substituir implementacoes se preservarem o contrato publicado: fila in, candidatos out, RPC como unica materializacao.
4. **I - Interface Segregation:** contratos pequenos e explicitos. O motor nao conhece Supabase; o verifier nao conhece app/UI; billing consome view publicada; `core_api_v1` expoe apenas RPCs necessarias.
5. **D - Dependency Inversion:** dominio/contratos estaveis comandam detalhes. `apps/radar-fiscal`, Gestorize, provider de captura e RAG dependem do core publicado, nao o contrario.

Gates de revisao SOLID:

- Toda decisao de B1-B5 deve declarar qual principio SOLID protege.
- Toda fitness function D0 deve proteger uma fronteira real, nao apenas estilo.
- Abstracao nova so entra se remover dependencia indevida ou tornar contrato verificavel.
- Se uma solucao criar pacote generico amplo ou duplicar regra de dominio, ela falha o corte do Kent Beck e volta para dado/pgTAP/RPC.

---

## 3. Bloqueios antes de codar

### B1 - P10 / `nota_item` contraditorio

**Conflito:**

- O handoff manda particionar `nota_item` por competencia no D0.
- O schema v1.1 diz que `nota` ja e particionada, `nota_item` carrega `competencia` para FK composta, e particionar `nota_item` em si e decisao operacional nao bloqueante D0.

**Risco:** implementar particionamento extra agora pode divergir do DDL canonico e aumentar a complexidade da migration sem consenso.

**Resolucao recomendada:** tratar `02-data-engineer-schema-v1.1.md` como canonico. D0 cria `nota` particionada; `nota_item` fica como no DDL v1.1, com `competencia` para integridade/FK composta. Se o founder quiser particionar `nota_item` no D0, atualizar primeiro o schema v1.1 e o handoff com a mesma decisao.

**Dono sugerido:** `@data-engineer` + `@architect`.

### B2 - Numeracao da migration inconsistente

**Conflito:**

- Handoff: "Migration 001".
- Schema v1.1: bloco SQL rotulado como "MIGRATION 000 - fundacao".

**Risco:** migrations duplicadas, ordem errada ou rollback confuso.

**Resolucao recomendada:** escolher uma convencao antes do build. Para um pacote greenfield isolado, usar `000_foundation.sql` ou `001_foundation.sql` e refletir isso em todos os docs. Minha recomendacao operacional: `001_foundation.sql`, porque o handoff e a linguagem de entrega ja usam Migration 001.

**Dono sugerido:** `@data-engineer`.

### B3 - Story-driven gate ausente

**Achado:** nao encontrei story do Contador/F1 em `docs/stories/`.

**Risco:** viola o fluxo AIOS de trabalhar a partir de story com acceptance criteria, checklist e file list.

**Resolucao recomendada:** antes de implementar, criar story `CONTADOR-F1-FOUNDATION` com acceptance criteria derivados do handoff:

- migration aplica limpa em Postgres vazio;
- rollback definido;
- pgTAP ou runner SQL cobrindo constraints-chave;
- motor puro com golden-set sintetico;
- verificador detecta adulteracao e hash_ver;
- FF-1/2/3/6 executaveis e com teste-do-teste.

**Dono sugerido:** `@sm` ou `@pm`. Codex pode implementar depois que a story existir.

### B4 - Contrato concreto de `core.api_v1` ainda esta ambiguo

**Conflito/ambiguidade:**

- Arquitetura fala em namespace logico `core.api_v1`.
- Handoff cita RPC `core.registrar_analise(...)`.
- Postgres nao tem namespace de duas camadas dentro do schema `core` no formato `core.api_v1.funcao`; isso precisa virar convencao concreta.

**Risco:** implementar RPCs com nomes que nao batem com o contrato de CI ou com consumo futuro.

**Resolucao recomendada:** escolher uma forma concreta:

1. Schema separado `core_api_v1` com funcoes `registrar_analise`, `aprovar_apontamento`, etc.; ou
2. Schema `core` com nomes versionados, por exemplo `api_v1_registrar_analise`.

Minha recomendacao: `core_api_v1.registrar_analise(...)`, porque torna a published language testavel por introspeccao de schema e evita nomes longos.

**Dono sugerido:** `@data-engineer` + `@architect`.

### B5 - Layout de codigo ainda nao esta decidido

**Achado:**

- Root `package.json` tem workspaces apenas em `packages/*`.
- Nao existe `packages/contador-*`.
- Existe `apps/radar-fiscal`, mas o handoff diz explicitamente para nao construir o core em cima dele.

**Risco:** colocar motor/verificador em local errado cria acoplamento acidental ou CI quebrado.

**Resolucao recomendada:** usar pacotes isolados em `packages/`:

- `packages/contador-motor-fiscal` para motor puro e golden-set harness;
- `packages/contador-trilha-verifier` para CLI de verificacao;
- `packages/contador-db` ou `packages/contador-foundation` para migrations/tests SQL, se o projeto quiser manter DB separado do app.

**Dono sugerido:** `@architect` para confirmar naming; Codex implementa depois.

---

## 4. Alertas nao bloqueantes

### A1 - `pgmq` vs `pg-boss`

O handoff e a arquitetura v1.1 escolhem `pgmq`. O schema v1.1 ainda menciona `pgmq/pg-boss` no cabecalho. Como fila real nao e requisito imediato do preflight de D0, isso nao bloqueia, mas o doc deve ser limpo para evitar regressao de decisao.

### A2 - Golden-set sintetico nao mede acuracia real

O protocolo `24-golden-set-protocolo-rotulagem.md` e claro: ate haver rotulador tributario externo, o harness sintetico e somente teste de contrato/execucao, nao prova de acuracia fiscal.

Toda metrica de motor no D0 deve ser marcada como sintetica.

### A3 - Clones fiscais nao sao necessarios para este preflight

As inconsistencias acima sao de contrato tecnico, nao de nova substancia tributaria. Chamar Heleno/Roberto so passa a ser necessario quando a implementacao detalhar:

- evento juridico de decisao individualizada;
- regras cClassTrib reais;
- formato de evidencia fiscal/SPED;
- promessa comercial/juridica do laudo.

### A4 - Worktree esta sujo

`git status` mostra muitas alteracoes e arquivos untracked fora do escopo. Antes de qualquer build, isolar branch e commitar/checkpointar os docs do Contador ou confirmar explicitamente o que fica fora.

Push continua exclusivo de `@devops`.

---

## 5. Ordem recomendada depois do preflight

1. `@data-engineer` resolve B1, B2 e B4 no contrato de DDL/RPC.
2. `@architect` confirma B5 e a fronteira dos pacotes.
3. `@sm` ou `@pm` cria story `CONTADOR-F1-FOUNDATION`.
4. Founder ratifica qualquer mudanca que contrarie o handoff original, principalmente P10.
5. Codex executa o build em branch isolada.

---

## 6. Criterio de liberacao para build

Marcar todos antes de implementar:

- [x] P10 resolvido sem divergencia entre handoff e schema v1.1.
- [x] Nome/ordem da migration definida.
- [x] Story `CONTADOR-F1-FOUNDATION` criada em `docs/stories/`.
- [x] Convencao concreta de RPC `core.api_v1` definida.
- [x] Pacotes/pastas de motor, verifier e migrations definidos.
- [x] Decisoes B1-B5 revisadas contra SOLID, sem abstracao prematura.
- [ ] Docs do Contador checkpointados ou escopo de worktree sujo explicitamente isolado.
- [ ] Story F1 validada por PO/founder antes do build.

---

## 7. Decisao operacional deste preflight

Nao iniciar codigo ainda.

O handoff esta forte, mas o build so deve comecar depois de resolver os contratos que seriam caros de desfazer: schema, migration order, RPC versioning e layout de pacotes.

---

## 8. Resolucao de preflight aplicada

> Resolucao tecnica feita por Codex sob lente `@data-engineer`/`@architect`.
> Consulta local registrada via `self-consultation.js` em 2026-06-15:
> `conclaveId=c710947f-94a8-4800-bc5d-ff9dc4f9ac7c`.
> Observacao: a CLI local retornou prompts/IDs de consulta, nao uma sintese automatica de respostas. Portanto, a resolucao abaixo nao finge consenso dos clones; ela segue a fonte canonica dos docs e os principios SOLID/Kent Beck.

### R1 - P10 / `nota_item`

**Decisao:** seguir o schema v1.1 como canonico para D0.

- `core.nota` fica particionada por `competencia`.
- `core.nota_item` nao sera particionada fisicamente no D0.
- `nota_item` deve carregar `competencia` para preservar FK composta/integridade com `nota`.
- Particionar `nota_item` vira gatilho operacional posterior, nao requisito da Fundacao F1-D0.

**SOLID protegido:** Single Responsibility e Open/Closed. O D0 protege o contrato minimo irreversivel sem acoplar operacao/performance prematura ao schema.

**Impacto:** o handoff original continua historico, mas a execucao deve usar esta resolucao salvo ratificacao explicita contraria do founder.

### R2 - Nome/ordem da migration

**Decisao:** usar `001_foundation.sql` para a migration de build.

Racional:

- O handoff e a entrega falam "Migration 001".
- `000` fica reservado para bootstrap eventual de extensoes/schemas caso o pacote precise separar bootstrap de dominio.
- A story e os testes devem referenciar `001_foundation.sql`.

**SOLID protegido:** Dependency Inversion e reversibilidade operacional. A ordem explicita deixa o build depender de contrato versionado, nao de comentario solto no doc.

### R3 - Contrato concreto de `core.api_v1`

**Decisao:** concretizar a API publicada como schema Postgres separado: `core_api_v1`.

Formato recomendado:

- `core_api_v1.registrar_analise(...)`
- `core_api_v1.aprovar_apontamento(...)`
- `core_api_v1.rejeitar_apontamento(...)`
- `core_api_v1.superar_apontamento(...)`

Racional:

- Postgres nao suporta `core.api_v1.funcao` como namespace em duas camadas.
- Um schema dedicado torna contract test simples via `pg_catalog`.
- Evita poluir `core` com nomes longos.
- Mantem `core` como storage/invariantes e `core_api_v1` como published language.

**SOLID protegido:** Interface Segregation e Dependency Inversion. Consumidores dependem de uma interface pequena e versionada, nao de tabelas internas.

### R4 - Layout dos pacotes

**Decisao:** criar componentes F1 em `packages/`, sem acoplar a `apps/radar-fiscal`.

Layout recomendado para o build:

- `packages/contador-db`
  - migrations SQL;
  - rollback;
  - testes SQL/pgTAP ou runner equivalente;
  - fitness functions FF-2/FF-3/FF-6.
- `packages/contador-motor-fiscal`
  - motor puro;
  - tipos TS;
  - golden-set harness sintetico.
- `packages/contador-trilha-verifier`
  - CLI standalone;
  - fixtures de cadeia;
  - golden hashes/hash_ver.
- `packages/contador-fitness`
  - FF-1 dependency-cruiser/import boundary;
  - wrappers CI para FFs quando compartilhados.

`apps/radar-fiscal` permanece periferia operacional e nao e dependencia do core F1-D0.

**SOLID protegido:** Single Responsibility e Dependency Inversion. Pacotes ficam orientados a contratos estaveis, nao a app/UI.

### R5 - Story-driven gate

**Decisao:** criar story `docs/stories/active/STORY-CONTADOR-F1-FOUNDATION.md` antes de qualquer codigo.

**SOLID protegido:** o metodo vira acceptance criteria verificavel, nao preferencia subjetiva.

**Nota de versionamento:** `.gitignore` ignora `docs/stories/`. A story foi criada no workspace para cumprir o gate local, mas nao entrara em commit sem `git add -f` ou decisao de governanca sobre onde versionar stories ativas.
