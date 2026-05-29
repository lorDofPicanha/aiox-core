# Contador Story 0.1: Definir ICP, Promessa e Piloto Manual (Discovery)

**Project:** Contador / Radar Fiscal + Operação do Escritório Contábil
**Story ID:** CONTADOR-S0
**Status:** Ready (PO-validated 29/Mai — GO)
**Created:** 2026-05-29
**Author:** River (@sm)
**Type:** Discovery / Definição — SEM código (precede o PRD)
**Executor:** @analyst (lead — research, entrevistas, matriz)
**Work Quality Gate:** @pm (revisa a síntese de discovery: ICP, oferta, recomendação) — Executor ≠ Quality gate ✔
**Story-Draft Gate:** @po (*validate-story-draft*) — gate de lifecycle (validado 29/Mai: GO)
**Decisão final GO/PIVOT/KILL:** founder ratifica (ref. `04-arquitetura-squads.md` §3 — Go/Kill é decisão humana; clones aconselham, não decidem)
**Quality Gate Tools:** auditoria de evidências (notas/transcrições de entrevista) + conferência contra Gate Metrics
**CodeRabbit Integration:** N/A — story de discovery sem código (nenhum artefato de código para revisar)
**References (fonte de verdade — Art. IV: não inventar):**
- `docs/projects/contador/01-conclave-agentes-mvp.md` (veredito, escopo, blind spots, Story 0.1 AC)
- `docs/projects/contador/03-status-e-proximos-passos.md` (escopo MVP, dentro/fora)
- `docs/projects/contador/04-arquitetura-squads.md` (squads, donos, clones, fases)
- `docs/projects/contador/00-mega-pesquisa-hydra.md` (mercado, dores, concorrentes)

---

## Goal

Validar a dor real e fixar a fundação de produto (ICP, promessa, oferta piloto, matriz de dores) por meio de **entrevistas reais com contadores** — fechando o blind spot #1 do conclave ("falta voz do cliente") — antes de qualquer PRD ou código.

## User Story

**As a** time de discovery do Contador (analyst + pm),
**I want** ICP, promessa, oferta piloto e matriz de dores validados com contadores reais,
**so that** o PRD v0.1 nasça de evidência de mercado e não de suposição, e possamos decidir GO / PIVOT / KILL no wedge "Radar Fiscal + Operação".

## Acceptance Criteria

- [ ] **AC-1 (ICP):** Documento de ICP final. **Given** os 3 cortes do conclave (5-40 colaboradores, 50-500 CNPJs, MEI+Simples), **when** confrontados com as entrevistas, **then** o ICP é confirmado, refinado ou pivotado com justificativa escrita.
- [ ] **AC-2 (Oferta piloto):** Oferta do piloto concierge documentada — o que o escritório recebe, o que é manual, preço/condição do piloto, e o que NÃO está incluído.
- [ ] **AC-3 (Roteiro):** Roteiro de entrevista com 10 perguntas (abertas, não-indutivas) cobrindo: rotina de obrigações, como cobram documentos hoje, maior dor de prazo/pendência, medo de CNPJ inapto, ansiedade com a Reforma, e disposição a pagar.
- [ ] **AC-4 (Matriz de dores):** Matriz de dores priorizada (frequência × gravidade × disposição a pagar) a partir de no mínimo **8 entrevistas reais realizadas** (meta 10).
- [ ] **AC-5 (Alvos do piloto):** Lista de 3 escritórios-alvo nomeados para o piloto manual, com canal de contato e razão da escolha.
- [ ] **AC-6 (Escopo):** Escopo MVP e fora-de-escopo reconfirmados ou ajustados contra as entrevistas (base: `03-status` "Dentro/Fora do MVP").
- [ ] **AC-7 (Gate de decisão):** Recomendação explícita **GO / PIVOT / KILL** sobre o wedge, com critério (ver Gate Metrics) — sem decisão silenciosa.
- [ ] **AC-8 (No-code guard):** Nenhum scaffold de app, schema ou automação é criado nesta story. Saída = somente artefatos de documento.

## Tasks

- [ ] **T1 (@analyst):** Escrever roteiro de 10 perguntas (AC-3) e validar com clone `teresa-torres` (discovery contínuo, não-indução).
- [ ] **T2 (@analyst):** Recrutar e realizar ≥8 entrevistas (meta 10) com contadores do perfil ICP.
- [ ] **T3 (@analyst):** Consolidar matriz de dores priorizada (AC-4).
- [ ] **T4 (@pm):** Documentar ICP final (AC-1) e reconfirmar escopo IN/OUT (AC-6).
- [ ] **T5 (@pm):** Desenhar oferta do piloto concierge (AC-2), com apoio do clone `anderson-hernandes` (precificação/realidade do escritório) e `lincoln-murphy` (formato concierge).
- [ ] **T6 (@analyst+@pm):** Selecionar 3 escritórios-alvo (AC-5).
- [ ] **T7 (@pm):** Escrever recomendação GO/PIVOT/KILL (AC-7) contra o Gate Metrics.
- [ ] **T8 (@po):** Validar a story draft + os artefatos (quality gate).

## Gate Metrics (GO / PIVOT / KILL)

| Sinal | GO | PIVOT/KILL |
|---|---|---|
| Entrevistas que confirmam a dor de pendências/prazos/docs como **top-3** | ≥ 60% | < 60% |
| Disposição a pagar por uma central operacional (não-zero) | ≥ 50% | < 50% |
| "Risco de CNPJ inapto / multa" citado espontaneamente como medo real | ≥ 40% | < 40% |
| Reforma Tributária gera ansiedade/urgência (gatilho comercial válido) | ≥ 50% | < 50% |

> Critério composto: ≥3 dos 4 sinais em GO → **GO** para PRD v0.1. 2 em GO → **PIVOT** (ajustar wedge). ≤1 → **KILL** ou revisão profunda do ICP.

## Scope

**IN:** entrevistas reais, ICP, oferta piloto, roteiro, matriz de dores, alvos do piloto, escopo IN/OUT, recomendação GO/PIVOT/KILL. Tudo como documento.

**OUT (explicitamente fora desta story):** PRD, épicos, código, schema, scaffold Next.js, matriz de obrigações por regime (vem depois, em B2), integração Integra Contador, qualquer automação. Apuração/escrituração/substituir Domínio-Alterdata seguem fora do produto (conclave).

## Data Handling (LGPD-mínimo)

As entrevistas coletam **dado pessoal** (nome/contato do contador, opiniões). Regras desta story (validadas por @po, ref. Trust C2 `patricia-peck`):
- Consentimento explícito de gravação/uso antes de cada entrevista.
- Minimização: coletar só o necessário para a matriz de dores; **não coletar dado de cliente-final do escritório** (CNPJs, dados fiscais de terceiros).
- Armazenar notas/transcrições em `docs/projects/contador/discovery/entrevistas/` com identificação reduzida (iniciais/código), não dossiê.
- Sem base legal nova ou tratamento sensível → se surgir, escala para C2 antes de prosseguir.

## Complexity

**M** — sem código, mas depende de execução humana real (recrutar e rodar entrevistas), que é o gargalo de calendário, não de esforço técnico.

## Dependencies

- **Bloqueia:** PRD v0.1 (@pm) — não inicia sem o gate GO desta story.
- **Depende de:** acesso a contadores reais para entrevista (risco de calendário — sinalizar a @pm cedo).
- **Squad ativo (fase Discovery, ref. `04-arquitetura-squads.md` §4):** A1 (Discovery) + A3 (CS, co-desenha piloto) + C2/C3 (escopo mínimo LGPD/risco). B e D em standby.

## Advisors (mind clones — aconselham, não decidem)

- `teresa-torres` — discovery contínuo, entrevista não-indutiva (T1).
- `marty-cagan` — riscos de valor/usabilidade/viabilidade/factibilidade na leitura das entrevistas.
- `anderson-hernandes` — voz do ICP / realidade e precificação do dono de escritório (T5). **Não substitui as entrevistas reais.**
- `lincoln-murphy` — formato do piloto concierge e sucesso (T5).
- `april-dunford` — leitura de posicionamento/categoria a partir da linguagem dos entrevistados.

## Discovery Agent Record

### Consultation
- _(a preencher na execução — router result + conclave id)_

### Gate Result
- _(a preencher após as entrevistas — preencher Gate Metrics e recomendação GO/PIVOT/KILL)_

### Verification
- _(a preencher — checklist de qualidade @po + completude dos 8 ACs)_

## File List

- `docs/stories/active/STORY-CONTADOR-S0-DISCOVERY.md`
- `docs/projects/contador/discovery/roteiro-entrevista-10q.md` _(saída T1)_
- `docs/projects/contador/discovery/entrevistas/` _(saída T2 — uma por entrevista)_
- `docs/projects/contador/discovery/matriz-dores.md` _(saída T3)_
- `docs/projects/contador/discovery/icp-final.md` _(saída T4)_
- `docs/projects/contador/discovery/oferta-piloto.md` _(saída T5)_
- `docs/projects/contador/discovery/alvos-piloto.md` _(saída T6)_
- `docs/projects/contador/discovery/gate-go-pivot-kill.md` _(saída T7)_
