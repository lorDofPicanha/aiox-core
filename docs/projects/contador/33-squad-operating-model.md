# Squad Operating Model - Programa dos Contadores

> Data: 2026-06-16
> Orquestrador: `@aios-master` / Orion
> Modo: YOLO operacional com gates.
> Fonte de responsabilidade: `21-handoff-codex-build-f1.md` Â§10 + estado F1/F1.1 em `27-32`.

---

## 1. Regra de operaÃ§Ã£o

Cada squad tem:

- **Agente dono:** implementa, integra e mantÃ©m os artefatos.
- **Clones autores/revisores:** produzem substÃ¢ncia de domÃ­nio e validam fidelidade.
- **Gate:** condiÃ§Ã£o objetiva de PASS/CONCERNS/FAIL.
- **Limite:** o squad nÃ£o invade escopo de outro squad sem roteamento por Orion.

YOLO aqui significa executar sem pedir confirmaÃ§Ã£o para trabalho reversÃ­vel de docs/cÃ³digo/testes locais. Continua exigindo aprovaÃ§Ã£o humana para push, deploy, envio externo, contrataÃ§Ã£o, uso de dados reais ou gasto.

## 2. Squads ativos

### Squad 0 - OrquestraÃ§Ã£o e Founder Gate

| Campo | DefiniÃ§Ã£o |
|---|---|
| Dono | `@aios-master` |
| Agentes | `@pm`, `@po`, `@sm`, `@devops` |
| Clones | Anderson Hernandes para decisÃ£o comercial; Kent Beck para corte de escopo |
| MissÃ£o | Manter sequÃªncia, escopo e decisÃµes ratificadas |
| EntregÃ¡veis | Operating model, execution board, checkpoint tÃ©cnico, lista de decisÃµes founder |
| Gate | Nada irreversÃ­vel sem Founder; push sÃ³ via `@devops` |

### Squad 1 - Data Core e Ledger

| Campo | DefiniÃ§Ã£o |
|---|---|
| Dono | `@data-engineer` |
| Agentes | `@architect`, `@dev`, `db-sage` |
| Clones | Heleno, Roberto, Kleppmann, Newman, Uncle Bob |
| MissÃ£o | Schema, migrations, RLS, RPCs, ledger, evidÃªncia e fronteiras |
| EntregÃ¡veis | `001_foundation.sql`, `002_decision_evidence.sql`, contratos SQL, smoke Postgres |
| Gate | `smoke:psql` PASS em Postgres 15+; RLS/grants sem porta lateral |

### Squad 2 - Motor Fiscal DeterminÃ­stico

| Campo | DefiniÃ§Ã£o |
|---|---|
| Dono | `@dev` |
| Agentes | `@data-engineer`, `@qa` |
| Clones | Roberto e Heleno autoram regra fiscal; Kent Beck revisa simplicidade/TDD |
| MissÃ£o | FunÃ§Ã£o pura de classificaÃ§Ã£o e harness do golden-set |
| EntregÃ¡veis | `packages/contador-motor-fiscal`, fixtures sintÃ©ticas, CLI JSON |
| Gate | Zero I/O; golden-set sintÃ©tico PASS; sem claim de acurÃ¡cia real |

### Squad 3 - Trilha, Verificador e Prova TÃ©cnica

| Campo | DefiniÃ§Ã£o |
|---|---|
| Dono | `@dev` |
| Agentes | `@architect`, `@qa`, `@devops` |
| Clones | Kleppmann, Uncle Bob, Heleno |
| MissÃ£o | Verificador standalone da cadeia e prova tÃ©cnica de integridade |
| EntregÃ¡veis | `packages/contador-trilha-verifier`, fixture Postgres, tamper detection |
| Gate | Verifier passa contra hash-chain produzida pelo trigger real |

### Squad 4 - QA, Fitness e Release Gate

| Campo | DefiniÃ§Ã£o |
|---|---|
| Dono | `@qa` |
| Agentes | `@devops`, `@architect` |
| Clones | Fowler, Newman, Gene Kim, Cassie |
| MissÃ£o | Gates, FF-1/2/3/6, evidÃªncia de testes e decisÃ£o de qualidade |
| EntregÃ¡veis | `29-qa-final-f1-foundation.md`, fitness functions, test evidence |
| Gate | PASS/CONCERNS/FAIL documentado; CodeRabbit se ambiente permitir |

### Squad 5 - Fiscal/JurÃ­dico e Defensabilidade

| Campo | DefiniÃ§Ã£o |
|---|---|
| Dono | `@legal-chief` |
| Agentes | `@data-engineer`, `@pm`, `@qa` |
| Clones | Heleno, Patricia Peck, Roberto |
| MissÃ£o | Defensabilidade da boa-fÃ©, decisÃ£o individualizada, linguagem permitida, LGPD |
| EntregÃ¡veis | `30-signoff-fiscal-juridico-f1.md`, `31-data-map-lgpd-f1.md` |
| Gate | Sem XML real/piloto pago atÃ© LGPD + fiscal/jurÃ­dico PASS |

### Squad 6 - Golden-set e Rotulagem

| Campo | DefiniÃ§Ã£o |
|---|---|
| Dono | `@data-engineer` |
| Agentes | `@pm`, `@qa` |
| Clones | Heleno, Roberto, Cassie |
| MissÃ£o | Transformar rÃ³tulos humanos em snapshot versionado e gate do motor |
| EntregÃ¡veis | `32-tributarista-labeling-brief.md`, formato de fixtures reais, thresholds |
| Gate | 50 itens iniciais rotulados; 20% duplo rÃ³tulo; sem vender acurÃ¡cia sintÃ©tica |

### Squad 7 - Produto, ICP e Concierge

| Campo | DefiniÃ§Ã£o |
|---|---|
| Dono | `@pm` |
| Agentes | `@analyst`, `@po`, `@sm` |
| Clones | Anderson Hernandes, April Dunford, Eric Ries |
| MissÃ£o | Concierge MVP, promessa datada, recrutamento de escritÃ³rios e tributarista |
| EntregÃ¡veis | oferta piloto, script Renan, lista de escritÃ³rios, critÃ©rios de pagamento real |
| Gate | Sem build de UI/captura/RAG atÃ© validaÃ§Ã£o do Concierge |

### Squad 8 - SeguranÃ§a e OperaÃ§Ã£o

| Campo | DefiniÃ§Ã£o |
|---|---|
| Dono | `@cyber-chief` |
| Agentes | `@devops`, `@data-engineer`, `@qa` |
| Clones | Bruce Schneier, Troy Hunt, Werner Vogels |
| MissÃ£o | Threat model, segredos, isolamento tenant, runbook de incidentes |
| EntregÃ¡veis | threat model F1, incident response, checklist de acesso |
| Gate | ObrigatÃ³rio antes de dados reais |

## 3. Consulta de clones

Consulta de clone entra em dois momentos:

1. **Antes da substÃ¢ncia virar contrato:** regra fiscal, promessa jurÃ­dica, payload de evidÃªncia, LGPD, pricing.
2. **Depois da implementaÃ§Ã£o:** revisÃ£o de fidelidade contra o que o clone defendeu.

Consultas abertas nesta rodada:

| Clone | ID | Uso |
|---|---|---|
| Heleno | `17dd90dd-8835-447c-ab5b-07c5487af3cd` | defensabilidade, decisÃ£o humana, linguagem proibida |
| Roberto | `17cd221d-6f40-44fa-9a6a-fc5570f9403f` | dado fiscal, SPED/Fisco digital |
| Patricia Peck | `91f0ff0a-2761-43c1-a6d4-852922572d75` | LGPD, minimizaÃ§Ã£o, retenÃ§Ã£o, papÃ©is controlador/operador |

Pareceres internos por agente nesta rodada:

| Agente | Veredito | Resultado incorporado |
|---|---|---|
| `@pm` | operating model/backlog | squads, ordem de execuÃ§Ã£o e prÃ³ximos 10 itens consolidados |
| `@legal-chief` | CONCERNS | demo sintÃ©tica PASS; piloto pago CONCERNS; produÃ§Ã£o FAIL atÃ© fecho/LGPD/golden-set |
| `@data-engineer` | CONCERNS | P0 de impersonaÃ§Ã£o e tenant claim corrigidos em F1.2 |
| `@qa` | CONCERNS | risco de microsegundos corrigido no verifier |

## 4. PortÃµes que continuam fechados

- Sem UI, captura provider, RAG, e-CAC, emissor ou Gestorize atÃ© novo gate.
- Sem XML real atÃ© LGPD + seguranÃ§a PASS.
- Sem piloto pago atÃ© fiscal/jurÃ­dico + LGPD + operaÃ§Ã£o PASS.
- Sem claim de acurÃ¡cia atÃ© golden-set real.
- Sem promessa de â€œapuraÃ§Ã£o corretaâ€, â€œcrÃ©dito garantidoâ€ ou â€œsem multaâ€.

## 5. Como executar

1. Orion roteia por squad.
2. Agente dono produz ou revisa o artefato.
3. Clone autor/revisor Ã© consultado quando hÃ¡ substÃ¢ncia de domÃ­nio.
4. `@qa` roda gate.
5. `@devops` sÃ³ entra para checkpoint/commit/push quando autorizado.
