# Noyce - Fase 5 legal/process model

Data: 2026-05-28
Status: ready for app/domain implementation
Owner: `@joel-de-menezes-niebuhr`
Orchestration: `@aios-master`
Council:

- `@joel-de-menezes-niebuhr`
- `@richard-susskind`
- `@stephen-hahn`

Consultation:

- Conclave: `16332252-be48-430b-bcc4-a0079a149ef4`
- Consultations: `3533f82c-fbf4-4efc-a312-70506e829f21`, `0263fb97-ad77-40c9-90ae-05dacf93902d`, `6e513bca-1d34-462f-9484-e5862c595dc1`

Legal reference baseline checked on 2026-05-28:

- Lei 14.133/2021, texto oficial Planalto: `https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm`
- Decreto 10.024/2019, texto oficial Planalto: `https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2019/decreto/d10024.htm`

## Objective

Advance Noyce from score/data parity into legal-process modeling without external acts, real credentials, or automated legal filings.

Fase 5 must make the product useful for the licitante's operational reasoning:

- what must be prepared for habilitacao;
- what is happening in the live process;
- which deadlines can cause preclusao;
- what requires human review now;
- what is only draft/supporting material and not an external act.

Noyce remains a copilot. It must not bid, send messages, manifest intent to appeal, file reasons, sign, protocol, or access authenticated portals without explicit future gates.

## Council verdict

1. Decompose legal work before automating anything.

   Model small process objects and review gates first: requirement, document, session event, deadline, decision point, appeal intent, appeal reasons. Do not model "legal automation" as a single feature.

2. Treat procedural timing as a first-class risk.

   The highest operational risk is not only missing a document; it is missing the right moment in the platform/session. The model must represent windows, status, responsible human, and consequence.

3. Keep intent to appeal separate from appeal reasons.

   `recurso_intent` and `recurso_reasons` are distinct objects. Intent is a session-time decision marker; reasons are later drafted support material. Both require human approval and cannot be auto-submitted.

4. Use formalismo moderado as product language, not as legal conclusion.

   Noyce can flag possible saneamento/diligencia paths when the defect appears formal or curable. It cannot conclude that a competitor must be habilitated/inabilitated or that an authority must accept the argument.

5. Quality gate is evidence over confidence theater.

   Every legal/process alert needs source evidence, missing data, confidence, deadline, and human owner. If any critical input is absent, the UI must say "revisao obrigatoria" instead of producing a strong recommendation.

## Domain objects

### `habilitation_requirement`

Represents one edital requirement.

Minimum fields:

- `id`
- `opportunity_id`
- `category`: `juridica | fiscal | trabalhista | economico_financeira | tecnica | proposta | outro`
- `requirement_text`
- `source_evidence_id`
- `deadline_id`
- `criticality`: `blocker | high | medium | low`
- `status`: `not_started | needs_document | ready_for_review | approved_by_human | gap | not_applicable`
- `confidence_level`: existing Noyce confidence scale
- `human_owner`
- `notes`

Rules:

- A requirement without source evidence is a lacuna.
- `approved_by_human` means internal review only, not external submission.
- Technical certificates/atestados may be matched later against a vault, but Sprint 0/Fase 5 uses fixture/manual status only.

### `habilitation_document`

Represents a document that may satisfy one or more requirements.

Minimum fields:

- `id`
- `requirement_id`
- `document_label`
- `document_type`
- `status`: `missing | available | expired | needs_review | accepted_by_human`
- `valid_until`
- `source`: `manual_fixture | vault_pending | user_uploaded_future`
- `sensitive`: boolean
- `redaction_required`: boolean

Rules:

- No real document vault in this phase.
- No document content should be copied into docs/chat/git.
- Sensitive documents must be represented only by metadata until vault gates pass.

### `process_event`

Extends the current timeline into a legal/process event stream.

Minimum fields:

- `id`
- `opportunity_id`
- `stage`: existing workflow stage
- `event_type`: `publication | clarification | proposal_deadline | session_open | bid_round | habilitation_review | diligence | adjudication | homologation | appeal_intent_window | appeal_reasons_deadline | counterarguments_deadline | other`
- `event_time`
- `source_evidence_id`
- `status`: `observed | inferred | expected | missed | cancelled`
- `requires_human_action`: boolean
- `risk_level`: `none | watch | urgent | critical`
- `consequence_if_missed`

Rules:

- Inferred events must be visibly marked as inference.
- `missed` and `critical` require human review language.
- Authenticated platform events remain `pending_vault` unless entered manually or available from public evidence.

### `decision_point`

Represents a human decision that Noyce can prepare but not execute.

Minimum fields:

- `id`
- `opportunity_id`
- `process_event_id`
- `decision_type`: `prepare_documents | ask_clarification | continue_bid | stop_bid | request_diligence_review | manifest_appeal_intent | draft_appeal_reasons | submit_counterarguments | ignore`
- `recommended_action`: text
- `basis`: `fact | inference | missing_data | legal_review_needed`
- `confidence_score`
- `blocking_lacunas`
- `human_approval_required`: always true for external/legal acts
- `external_act_blocked`: boolean

Rules:

- Any act that touches a portal, third party, signature, protocol, bid, appeal, or message has `external_act_blocked=true`.
- The app may prepare a checklist or draft; it may not send.

### `recurso_intent`

Represents the decision window for manifesting intent to appeal.

Minimum fields:

- `id`
- `opportunity_id`
- `trigger_event_id`
- `window_status`: `not_open | open_manual_entry | closing_soon | closed | unknown`
- `deadline_id`
- `grounds_summary`
- `evidence_ids`
- `human_decision`: `undecided | intend_to_appeal | do_not_appeal | needs_lawyer_review`
- `submission_status`: `blocked_not_automated | manually_submitted_by_user | not_submitted | unknown`

Rules:

- Intent is not the appeal reasons.
- Noyce must never mark intent as submitted unless a human records it.
- If the window status is unknown, the action label is `revisao obrigatoria`.

### `recurso_reasons`

Represents later drafting support for appeal reasons.

Minimum fields:

- `id`
- `opportunity_id`
- `intent_id`
- `draft_status`: `not_started | outline | draft_for_review | approved_by_lawyer | discarded`
- `argument_topics`
- `evidence_ids`
- `deadline_id`
- `review_owner`
- `external_submission_status`: `blocked_not_automated | manually_submitted_by_user | not_submitted | unknown`

Rules:

- Drafting support is allowed.
- Final legal argument requires human/lawyer review.
- Submission remains blocked.

## Product language

Use direct operational labels:

- `revisao obrigatoria`
- `janela processual critica`
- `prazo desconhecido`
- `lacuna de evidencia`
- `ato externo bloqueado`
- `rascunho para revisao humana`
- `possivel saneamento/diligencia`

Avoid:

- "garantido"
- "automaticamente recorrer"
- "protocolo enviado"
- "vencedor provavel" as a legal conclusion
- any language implying Noyce is acting as lawyer or as an autonomous representative

## Gates

### Legal/process gate

PASS only if:

- intent to appeal and appeal reasons are distinct;
- every legal/process recommendation has evidence or explicit lacuna;
- every external act is blocked by default;
- every critical deadline has status, owner, and consequence;
- every "possible diligence/saneamento" statement is framed as review prompt, not conclusion.

### Security/compliance gate

PASS only if:

- no credential, token, cookie, certificate, login, or real document content is introduced;
- authenticated portal data remains `pending_vault` or manual fixture;
- no production database is touched;
- no raw sensitive payload is logged.

### QA gate

PASS only if:

- fixture scenarios cover at least one missing habilitation document;
- one critical process window;
- one appeal-intent/reasons separation case;
- one unknown deadline forcing `revisao obrigatoria`;
- one external act blocked by default.

## Immediate implementation slice

Recommended next story:

`NOYCE-LEGAL-01 - Legal/process fixture model`

Owner: `@dev`
Council: `@joel-de-menezes-niebuhr`, `@qa`, `@ux-design-expert`, `@cyber-chief`

Inputs:

- `apps/noyce/lib/noyce-model.ts`
- `apps/noyce/lib/noyce-data.ts`
- `apps/noyce/app/page.tsx`
- this document

Tasks:

- Add TypeScript domain types for requirements, documents, process events, decision points, appeal intent, and appeal reasons.
- Add fixture data only; no portal calls.
- Surface in UI as legal/process panel attached to an opportunity detail.
- Keep external acts visibly blocked.
- Add tests for appeal intent/reasons separation and external-act blocking.

Validation commands:

```bash
npm test
npm run typecheck
npm run build
```

Blockers:

- Do not access authenticated portals.
- Do not store credentials or real documents.
- Do not submit, send, sign, protocol, bid, manifest intent, or file reasons.
- Do not present legal conclusion as fact.

## Execution result - 2026-05-28

Agent execution:

- `@aios-master` selected Fase 5 because Fase 4 parity passed and ENIAC real outcomes remain unavailable.
- `@joel-de-menezes-niebuhr` owned legal/process modeling boundaries: habilitation, session windows, preclusion, appeal intent and appeal reasons.
- `@dev` implemented fixture-only domain types, fixture data, UI panel and tests in `apps/noyce`.
- `@qa` validated gates and residual risks.

Implemented files:

- `apps/noyce/lib/noyce-model.ts`
- `apps/noyce/lib/noyce-data.ts`
- `apps/noyce/app/page.tsx`
- `apps/noyce/app/globals.css`
- `apps/noyce/tests/noyce-model.test.mjs`

Implemented scope:

- `LegalProcess` domain model with habilitation requirements/documents, process events, decision points, appeal intent and appeal reasons.
- Fixture-only legal/process data attached to each opportunity.
- Operational UI panel: `Fase 5 juridico/processo`, with human owner, evidence, document status, critical windows and blocked external acts.
- Tests for external legal act blocking, unsafe external act detection, and appeal intent/reasons separation.

Validation:

- PASS: `node docs/projects/buscador-licitacoes/02-architecture/fixtures/validate-fixtures.mjs`
- PASS: `node docs/projects/buscador-licitacoes/02-architecture/scripts/sprint0-dry-run.mjs`
- PASS: `npm test` in `apps/noyce` with 8 tests.
- PASS: `npm run typecheck` in `apps/noyce`.
- PASS: `npm run build` in `apps/noyce`.
- PASS: Browser QA at `http://localhost:3100`, panel present, `ato externo bloqueado` visible, no console warnings/errors, no horizontal overflow at 390px.

Known non-blocking warnings:

- Node test runner warns that `.ts` ESM modules are reparsed because `package.json` has no `"type": "module"`. Existing warning; not changed in this slice.
- Next.js build warns that the Next ESLint plugin is not detected. Existing warning; production build passes.

QA residual risks:

- Legal/process fixtures are not legal advice and do not authorize action in a real certame.
- Real portal events, real documents and real submission states remain blocked until vault, ToS, consent, audit and human approval gates.
- Score calibration with ENIAC real outcomes remains future work.
