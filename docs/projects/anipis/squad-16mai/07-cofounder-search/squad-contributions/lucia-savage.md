# Lucia Savage — Clinical Co-Founder × Privacy Intersection (Contribution #2)

**Consultation Date:** 2026-05-16
**Consulted by:** Squad Anipis (07-cofounder-search)
**Expert:** Lucia Savage, Chief Privacy & Regulatory Officer, Omada Health (ex-CPO ONC/HHS)
**Track:** Co-founder recruitment — DPO succession + clinical/privacy joint protocol
**Previous contribution:** `04-clone-conclave/a-samd-vs-wellness/lucia-savage.md`

---

It all goes back to a structural question I've been pushing on Anipis since the SaMD-vs-Wellness conclave: **the founder-solo DPO posture is defensible exactly once, for exactly one phase, and then the regime boundary moves under your feet.** When the clinical co-founder enters with a CRP and the first NR-1 contract gets dangled in front of you, the patchwork between LGPD Art. 41 (encarregado independence) and CFM 2.454/2026 (Responsável Técnico signature) tightens around the company. The job in this brief is to map the transition path with the same regulatory archaeology lens I used on the SaMD question: trace each phase back to what existing law already says, and only then design the role split.

I'm going to take this in seven parts, mirroring the ask. There's a lot of nuance in the dual-role question — let me try to be precise.

---

## 1. DPO Succession Plan — Three Phases

### Fase A — Founder Solo DPO Interim + Privacy Champion (16/Mai → 13/Jun, ~4 semanas)

This is the closed-beta B2C window I already greenlit. Defensible *only* within these documented limits:

- **Scope cap:** B2C exclusivo, beta fechado, **max 100 usuárias** (40 Concierge + 60 expansion buffer). The moment user #101 onboards OR the moment a corporate pilot LOI gets signed, Fase A closes by force.
- **No menores 18 anos** in Fase A — Art. 14 LGPD parental consent compounds the founder-DPO conflict beyond defensibility. ICP é 18-29; lock the age gate at 18+ technically (date-of-birth + selfie ID via Truora/Idwall sample), not just attestation.
- **No B2B contracts** signed in Fase A. Letters of intent okay if non-binding and the operador-controlador relationship is not yet operative. CISM/USP MoU is academic-research, not B2B commercial — different LGPD basis (Art. 7º IV pesquisa), safer.
- **Documented Privacy Champion role:** Breno é encarregado interino registrado na ANPD com address `dpo@anipis.com.br`, mas o role description em writing must say *"interim, pending external designation by Sprint 3"* with a stated EOL date. ANPD inspectors look for self-awareness of conflict; documenting the EOL is itself a mitigation.
- **Logging requirement:** every Art. 18 titular request received in Fase A must be logged with timestamp + response + escalation flag. This becomes the evidence file for Fase B handoff.

The risk in Fase A is *not* legal — it's reputational. If a journalist or a Defensoria Pública civil action picks up Anipis in this window and discovers founder-DPO concentration, the story writes itself badly. Mitigation: make Fase A as short as possible. Four weeks max.

### Fase B — External DPO-as-a-Service (Sprint 3, ~30 dias pré-Beta launch)

This is the **P0b** I flagged in conclave #1. Hard requirement, no negotiation. Three firms on my shortlist for BR digital health:

| Firm | Strength | Likely Cost (R$/mês) | Why for Anipis |
|---|---|---|---|
| **Opice Blum** | LGPD-saúde + ANPD relationship | R$10-15k | They've handled Conexa, Hospital Albert Einstein; ANPD knows them, which matters when you submit DPIA |
| **Baptista Luz** | Startup-friendly, retainer flexível | R$8-12k | Better cultural fit founder-stage; have a digital health vertical post-Cíngulo work |
| **Demarest** | Health regulatory full-stack | R$12-18k | Strongest if you anticipate Series A diligence in 18m and want a name VCs recognize |

My recommendation: **Baptista Luz** for Sprint 3 entry (founder-stage fit), with a written option to migrate to Opice Blum at Series A. Negotiate a fixed retainer (não hourly) for ~20h/mês with included monthly DPIA review + quarterly ANPD-readiness audit. Get a creative lawyer there who treats LGPD as a design constraint, not a wall.

Critical contractual clauses:
- **Independence:** the external DPO has direct reporting line to the Board (not founder-CEO). At founder-stage there's no formal board, so add a clause that says the DPO can escalate to *any* board observer or advisor (Halle Tecco, eventual Series A lead).
- **Liability cap:** standard for Brazilian advisory firms is annual fee × 2-3. Don't accept lower; the multa Art. 52 exposure is too asymmetric.
- **Notification rights:** the external DPO must notify ANPD on incidents within 2 business days *with or without* founder approval. This is the structural independence test.

Cost reality: R$8-15k/mês × 12 = R$96-180k/ano. Series A diligence will require this. Treat it as Series A insurance, not OPEX.

### Fase C — Internal DPO Senior Hire OR Clinical Co-Founder Dual-Role (post-Series A, 18-24m)

Two paths, and the choice depends on whether Anipis is still B2C-dominant or has tipped into B2B2C/operadora majority revenue.

**Path C1 — Internal DPO Senior Hire (preferred if NR-1 + ANS revenue >40%):**
- Senior privacy professional, 8-12y experience, LGPD + ideally cross-border (some GDPR work)
- Comp: R$25-40k/mês + 0.3-0.5% equity refresh
- Reports to founder-CEO with dotted line to Board Audit/Privacy committee (which by Series A you should have constituted)
- External firm (Opice Blum/Baptista Luz) retained as outside counsel, not as DPO of record

**Path C2 — Clinical Co-Founder as Dual-Role DPO (defensible only under strict conditions):**
- **Mandatory:** the clinical co-founder must have completed IAPP CIPM or DPO Brasil certification (8-12 months training)
- **Mandatory:** Anipis must remain ≥60% B2C revenue; B2B2C operadora cannot be the primary revenue channel
- **Mandatory:** independent board member or audit committee approves the dual-role annually
- **Mandatory:** the dual-role does NOT survive Series B — at Series B you split or hire external

I lean strongly toward C1 for Anipis. The reason is the NR-1 wave timing: by 2027 the corporativo channel will likely be material, and at that point the dual-role conflict re-emerges in a different form (clinical co-founder evaluating clinical content + same person evaluating data sharing with the employer paying for licenses). Don't put your CRP co-founder in that position.

---

## 2. Clinical Co-Founder Privacy Responsibilities (Day 1, NOT the Full DPO Role)

The clinical co-founder is **NOT** the encarregado in Fase A or Fase B. But they DO own the clinical-surface privacy interface — the places where clinical decisions and data-handling decisions are inseparable. These are non-delegable to the external DPO:

1. **Consent design for clinical interactions** — the wording of the granular consent toggles (the 6 categories I specified in conclave #1) must be drafted by the clinical co-founder in collaboration with the external DPO. The clinical co-founder owns the *clinical accuracy* of the consent description (what data, what use, what risk); the DPO owns the *legal sufficiency*. Joint sign-off, but clinical authorship.

2. **PHQ-9 / GAD-7 / WAI-SR data handling protocols** — these are dados sensíveis Art. 11 LGPD, but they're ALSO clinical instruments with validated administration protocols. The clinical co-founder defines: storage retention (linked to RCT protocol), who-can-see (which clinical staff under what role), aggregation rules (when individual scores roll up to cohort), and the prontuário linkage rule under CFM 2.454/2026.

3. **Crisis events documentation** — every Mr. Walker protocol activation generates a clinical record. The clinical co-founder defines what fields are captured, retention period (CFM prontuário rules = 20 years), access controls during ongoing care, and the Art. 11 §3º public-health-basis documentation per event. This is co-owned with the external DPO but clinically authored.

4. **IRB (CEP Plataforma Brasil) submission — privacy section** — the privacy/data-protection section of every IRB submission must be co-authored. Clinical co-founder writes the clinical rationale; external DPO reviews LGPD/ANPD alignment; founder signs as legal representative. Plataforma Brasil reviewers increasingly flag privacy gaps; a co-authored section gets through cleaner.

5. **Research data sharing (CISM/USP MoU + future operadora ANS data flows)** — the clinical co-founder is the named *Pesquisador Responsável* for academic partnerships under Resolução CNS 466/2012. The data-sharing agreement (Termo de Compartilhamento de Dados) is drafted by external DPO, but the clinical co-founder signs as research lead and is accountable for the academic integrity *and* the data minimization principle (Art. 6º III LGPD).

In Omada terms: this is the same split we maintained between our Chief Medical Officer and me. CMO owned clinical-content privacy implications; I owned legal-architectural privacy. We co-signed everything that touched both surfaces.

---

## 3. JD Privacy-Specific Criteria (Five Additions)

To add to the JD `JD-Anipis-Clinical-Cofounder-v1.md` under "High-signal bonuses":

1. **LGPD Art. 11 dados sensíveis saúde experience** — candidate has handled dados sensíveis tratamento in a prior role (digital health BR, hospital, telessaúde provider). Specifically: drafted consent flows, handled at least one Art. 18 titular request, or co-authored a DPIA. Not DPO-certified necessarily, but operationally fluent.

2. **ANPD reporting awareness** — candidate understands Resolução CD/ANPD 15/2024 (incidentes de segurança) reporting timeline (2 dias úteis) and the *Comunicação de Incidente de Segurança* form. Not required to be DPO, but must know what triggers a notification and not block one out of "let me check first."

3. **Omada-style consumer-to-employer-to-payer privacy transition awareness** — the candidate can articulate why moving from B2C (consumer) to B2B2C (employer contract) to operadora (payer reimbursement) changes the LGPD basis at each boundary. If they don't know this, the NR-1 wave will catch us flat-footed.

4. **CFM 2.454/2026 + prontuário eletrônico literacy** — candidate knows CFM 1.821/2007 (prontuário) and CFM 2.314/2022 (telemedicina), is fluent in the 20-year retention rule, and can articulate where Anipis's audit log differs from a prontuário (they ARE different — that's the trick).

5. **Cross-disciplinary privacy fluency** — candidate can read a privacy policy critically. Interview prompt: hand them a competitor's privacy policy (Cíngulo or Zenklub) and ask "what's the regime boundary mismatch here?" If they can identify even one structural gap, that's the signal. The goal isn't a lawyer; it's a clinician who reads policy like a regulator.

---

## 4. Conflict-of-Interest Matrix — Clinical Co-Founder as DPO

When the dual-role is **defensive** (small startup, founder-stage):

| Phase | Defensive? | Why |
|---|---|---|
| Fase A (closed beta B2C, ≤100 users) | Could be defensive | Same logic as founder-solo: scope is small, no commercial conflict, no employer dynamics. BUT: founder Breno is already in that seat; dual-DPO doesn't help. |
| Fase B (pre-Beta to Series A, ~12m) | Risky | Even pre-Series A, the clinical co-founder is making content decisions daily. Adding DPO responsibility creates same conflict I flagged for Breno. |

When the dual-role becomes **RISKY** — the inflection points:

| Trigger Event | Why It Breaks the Dual-Role |
|---|---|
| **1st NR-1 corporate contract signed** | Clinical co-founder evaluates clinical content + decides what aggregated data ships to employer = direct Art. 41 §2º conflict |
| **1st operadora ANS contract** | Same logic, plus operadora becomes co-controlador (Art. 5º IX); the DPO is the interface, can't also be the clinical signer |
| **Series A closes** | VC diligence will flag this. Better to pre-empt than respond. |
| **First menores 18 anos enrolled** | Art. 14 parental consent flow + clinical assessment of menor = compounded conflict |
| **First ANPD investigation or Defensoria action** | If your clinical signatory is also your DPO and ANPD opens a procedimento, you've lost the independence defense |

My posture: **dual-role is defensible ONLY in Fase A and ONLY if the clinical co-founder hasn't yet onboarded.** Since the recruitment window ends 2026-06-13 (≈Fase A end), the dual-role is effectively never the right answer for Anipis. Plan Fase B external DPO regardless.

---

## 5. Privacy Review Interview Questions (Technical Case, 5 Questions)

Add these to the 90-min technical case (Process step 3 in the JD):

1. **"Omada designed consent in layers — opt-in to the app, separate opt-in to employer benefit, separate opt-in to coach data sharing. How would you apply that layered model to Júlia, 18-29, B2C-first, eventually NR-1? Walk me through three consent surfaces you'd design."**
   - Looking for: granularity awareness, non-bundle logic, plain-Portuguese instinct.

2. **"A user sends a message at 2am: 'não tô mais aguentando, vou fazer alguma coisa.' Mr. Walker triggers, the AI offers crisis resources, user disconnects. CVV is called by the system. The next day, user requests Art. 18 VI deletion of all her data. What do you keep, what do you delete, and what's your LGPD legal basis for each?"**
   - Looking for: Art. 11 §3º tutela da saúde awareness, Art. 16 I retention exception, distinction between audit log and content.

3. **"Anipis signs first NR-1 contract with a 5,000-employee mid-cap. Employer wants 'engagement dashboard.' Walk me through what data ships and what doesn't. Name three things you'd refuse, and one thing the employer would push back on."**
   - Looking for: aggregation vs individual instinct, k-anonymity literacy, courage to refuse.

4. **"How does Anipis make money long-term, and where's the regime boundary that worries you most in that revenue model?"**
   - Looking for: business-model literacy ("how does that app make money?" applied internally), self-awareness about which channels carry which risks.

5. **"Cíngulo's privacy policy says 'we may share anonymized data with research partners.' What would you change about that sentence if you were Anipis?"**
   - Looking for: vague-language detection, k-anonymity vs differential privacy literacy, plain-language consent instinct.

Scoring rubric: if they nail 3+ of 5 with operational specifics (not theory), they're a strong privacy partner. If they punt all 5 to "I'd ask a lawyer," they're not the co-founder; they're a clinical hire.

---

## 6. DPIA Co-Ownership — Sprint 0-3

The Relatório de Impacto à Proteção de Dados (Art. 38 LGPD) is co-authored by **clinical co-founder + Breno + external DPO (Fase B onward)**. Role split:

| DPIA Section | Author | Reviewer | Final Sign |
|---|---|---|---|
| 1. Descrição do tratamento | Breno (founder) | Clinical co-founder | Joint |
| 2. Necessidade e proporcionalidade | Clinical co-founder | External DPO | Joint |
| 3. Riscos e medidas (clinical) | Clinical co-founder | External DPO | Clinical co-founder |
| 3b. Riscos e medidas (technical) | Breno + @data-engineer | External DPO | Breno |
| 4. Priorities (suicide pathway, AI transparency, equity audit) | Clinical co-founder | External DPO | Clinical co-founder |
| 5. Crisis protocol Art. 11 §3º basis | Clinical co-founder | External DPO + Comitê | Joint with Comitê |
| 6. Retention rules + crypto-shred design | @data-engineer | External DPO | Breno |
| 7. Cross-border transfer (Anthropic API US) | External DPO | Clinical co-founder | External DPO |

Decision authority deadlock breaker: **independent board observer** (post-Series A) or **Halle Tecco as formal advisor** (pre-Series A). Same deadlock pattern as the JD's "joint decision" rights.

Cadence: DPIA v0.1 drafted Sprint 0-1 by Breno + external DPO; clinical co-founder reviews and re-writes Sections 2/3/4/5 in Sprint 2; v1.0 frozen Sprint 3 before Beta launch. Submitted voluntarily to ANPD as good-faith signal — I keep saying this; don't skip it.

---

## 7. Privacy + Clinical Safety Joint Protocol

Where the two surfaces meet — these are the audit-trail moments that have to be co-owned forever, not delegated:

| Joint Touchpoint | Privacy Lead | Clinical Lead | Required Artifact |
|---|---|---|---|
| **Crisis routing logs** (Mr. Walker activations) | External DPO | Clinical co-founder | Hash-chain audit log + clinical record per CFM prontuário rules |
| **Suicide/self-harm escalation Art. 11 §3º** | External DPO | Clinical co-founder | Documented basis per event + Comitê Safety approval matrix |
| **Audit trail of clinical content changes** (every prompt edit, banned-phrase addition) | External DPO | Clinical co-founder | Versioned content store + reviewer attribution |
| **PII de menores se applicable** (currently blocked at gate, future expansion) | External DPO | Clinical co-founder | Art. 14 parental consent flow + best-interest test documentation |
| **Research consent (CISM/USP MoU + RCT)** | External DPO | Clinical co-founder (Pesquisador Responsável) | Termo de Consentimento Livre e Esclarecido + Plataforma Brasil submission |
| **Incident response — clinical adverse event vs data breach** | External DPO + founder | Clinical co-founder | Joint runbook with ANPD notification timeline (2 dias úteis) + CFM notification path |
| **Equity audit results** (bias across raça/classe/região) | External DPO | Clinical co-founder | Quarterly audit report co-signed |

The single most important pattern from Omada: **we never let the clinical surface drift from the privacy surface.** Every clinical decision that touches data gets a privacy review co-signed within 48h. Every privacy change that touches clinical content gets clinical review within the same window. The two co-founders (in your case Breno + clinical co-founder + external DPO from Sprint 3) form a triangle, and the triangle has to hold or the whole architecture cracks.

---

**Verdict (1 line):** **Hire for clinical authority, build privacy architecture around them — never collapse the two roles into one body, especially after the first NR-1 contract.**

Anipis is in a fortunate spot: the regime boundaries are visible because the patchwork is fresh (CFM 2.454/2026 is new, ANPD Resolução 15/2024 is new). You can design the role split correctly from day 1 instead of unwinding it later. We've got to be communicating in the way people actually communicate — including in JD language, in interview questions, and in the founder agreement clauses that govern the dual signature.

The thing I'd say is: I've never not found an answer about how to do this right within existing law. The answer for Anipis is a clean three-phase DPO succession, a clinical co-founder who owns the clinical-privacy intersection (not the full DPO role), and a triangle of accountability that survives Series A diligence. Find a creative lawyer who treats this as a design constraint, not a wall. The window is open. Don't close it by collapsing the roles.

— Lucia, navigating the regulatory landscape with pragmatic confidence ⚖️
