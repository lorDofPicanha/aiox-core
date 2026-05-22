# Lucia Savage — Anipis Privacy & Regulatory Strategy Assessment

**Consultation Date:** 2026-05-16
**Consulted by:** Squad Anipis (16/Mai)
**Expert:** Lucia Savage, Chief Privacy & Regulatory Officer, Omada Health (ex-CPO ONC/HHS)
**Track:** A — SaMD vs Wellness

---

It all goes back to a fundamental question I always ask when a digital health company comes to me before launch: **how does this app make money, and where does the consumer's data live?** Anipis sits on a regime boundary — B2C mental health companion (consumer app, outside the traditional healthcare system) pivoting toward B2B2C corporativo (NR-1) and eventually operadora ANS (RN-627). Each of those crossings is a regime boundary, and that's where the most dangerous vulnerabilities live. Let me take your five questions in order.

**(1) DPO founder solo interim.** Under LGPD Art. 41, the encarregado (DPO) doesn't have to be a separate person, but ANPD's *Guia Orientativo Encarregado* (2022) is explicit: there must be no conflito de interesse. A founder who simultaneously makes growth decisions, controls treatment of dados sensíveis (Art. 5º II), and is the channel for titular requests has a structural conflict the moment the company processes data from a minor or a corporate client. **Defensible up to closed beta (40-100 Júlias, B2C-only).** The moment you sign your first NR-1 contract or touch an operadora, you need an external DPO-as-a-Service or a designated employee with documented independence. Hard stop: before the first corporate pilot.

**(2) Consent granular Art. 11 LGPD.** Saúde mental is dados sensíveis (Art. 5º II) which triggers Art. 11 — consentimento *específico e destacado*. Bundled consent is the single most common enforcement trigger I see. The non-bundle-able categories for Anipis: **(a)** tratamento clínico-AI da conversa em si (finalidade principal — Art. 11 I); **(b)** retenção de transcripts para fine-tuning/melhoria do modelo (separate — this is monetizing the data architecture even if you don't sell it); **(c)** compartilhamento com empregador no fluxo NR-1 (separate, with the explicit caveat that aggregated/anonymized only — never individual); **(d)** compartilhamento com operadora ANS para gestão de cuidado (separate, Art. 11 §4º); **(e)** crisis protocol — share with emergency contact / serviço público de saúde (separate, but note Art. 11 §3º permits without consent for tutela da saúde when authorized professional); **(f)** menores 18-17 (Art. 14 — consent of at least one parent, *melhor interesse* test). Each must be a discrete toggle, refusable independently, with a plain-Portuguese explanation. "We've got to be communicating in the way people actually communicate."

**(3) Audit log immutable 5y vs direito ao esquecimento.** This is a false conflict — LGPD Art. 16 already provides the answer. Eliminação does *not* apply when retention is required for cumprimento de obrigação legal/regulatória (Art. 16 I) or estudos por órgão de pesquisa anonimizados (Art. 16 II). The technical pattern: **(a)** hash-chain audit log keeps the integrity proof (your @data-engineer is right); **(b)** the *content* of clinical interactions lives in a separate pii_vault keyed by pseudonym; **(c)** on Art. 18 VI request, you crypto-shred the pseudonym→identity mapping. The audit log remains intact (proves who-did-what-when), but no human can re-identify. CFM 2.454/2026 prontuário retention rules apply to the clinical record, not to anonymized telemetry. Document this in your DPIA explicitly.

**(4) Multi-tenancy operadora ANS.** ANPD hasn't issued a binding ruling on schema-per-tenant vs RLS, but Resolução CD/ANPD 4/2023 (segurança) and the *Guia de Segurança da Informação* both demand "medidas técnicas proporcionais ao risco." For dados sensíveis de saúde mental cruzando regime boundary (operadora is controlador conjunto under Art. 5º IX), **schema-per-tenant is the defensible posture**. RLS soft-tenancy is acceptable for B2C and corporativo, but the moment ANS RN-627 §3º (compartilhamento de dados de beneficiário) kicks in, you want physical separation as evidence of proportionality. Omada solved this with logical isolation + KMS keys-per-customer; same pattern works here.

**(5) DPIA priorities for jovens BR.** The three I'd insist on: **(a) Suicide/self-harm escalation pathway** — what triggers human handoff, who is "the human," and what's the §3º public-health basis when consent isn't operable? **(b) AI transparency to adolescents** — honesty is non-negotiable; Júlia must know she's talking to an AI on first contact and at every session boundary. **(c) Equity audit of model behavior** — AI creates a new domain in which we have to be thoughtful about bias. Test response quality across raça, classe, região (NE vs SE Brasil), LGBTQIA+. This isn't optional; ANPD enforcement is increasingly equity-aware.

**On Omada parallel:** We're consumer-first (DPP coaching app, free trial → covered employer benefit → health plan reimbursement). The pattern we used: (i) clear regime mapping at each boundary — consumer territory until employer signs BAA-equivalent (contrato operador-controlador); (ii) one privacy policy, layered disclosures per surface; (iii) crisis pathway documented with clinical advisory board approval *before* first user, not after; (iv) external DPO from day one of B2B2C. Anipis should mirror this.

---

**Verdict (1 line):** **Defensible for closed beta B2C, risky beyond — five P0 actions in the next 14 days unlock the corporativo/ANS expansion safely.**

**Top 3 LGPD/CFM risks if ignored:**
1. **Bundled consent + ausência de DPO independente** at first NR-1 contract → ANPD multa Art. 52 (up to 2% revenue) + civil class action by Defensoria Pública (Art. 22 LGPD); high probability within 12 months of B2B2C launch.
2. **CFM 2.454/2026 telemedicina compliance gap** — if Anipis crosses from wellness into clínico-AI without a Responsável Técnico médico registered + clinical safety committee, CFM can refer for criminal exercício ilegal da medicina. Once it's out there, it's pretty hard to get it back.
3. **Crisis pathway undocumented** — first suicídio em usuária with no Art. 11 §3º basis + no documented protocol = civil liability + ANPD enforcement + media event that kills the brand. This is the patient/consumer-lens risk that trumps everything else.

**5 ações P0 jurídicas (próximas 2 semanas):**
1. **Contratar DPO-as-a-Service externo** (BR firms: Opice Blum, Baptista Luz, Demarest) — R$8-15k/mês, defensible independence; founder stays on as Privacy Champion but not encarregado.
2. **Designar Responsável Técnico médico (CFM-registered)** + constituir Comitê de Segurança Clínica (3 membros: 1 psiquiatra, 1 psicóloga clínica, 1 pesquisador ética). CFM 2.454/2026 Art. 5º.
3. **Drafting DPIA (Relatório de Impacto à Proteção de Dados)** — Art. 38 LGPD — with the three priorities above as Seção 4. Submit voluntarily to ANPD as good-faith signal before NR-1 launch.
4. **Rewrite consent flow** — 6 toggles destacados, plain-Portuguese, 7ª-série reading level, screenshot-able for ANPD audit. Get a creative lawyer to review — find one who treats LGPD as a design constraint, not a wall.
5. **Crisis protocol document signed by Comitê** — escalation matrix, 24/7 human-on-call SLA, Art. 11 §3º legal basis for sharing with CVV/SAMU, retention rules, parent-notification logic for menores. This is the document that protects the company *and* the consumer.

I'd be cautious about one more thing: the operadora ANS revenue model (R$2,50-4,50/vida-mês) is structurally cleaner than the corporativo NR-1 model from a privacy standpoint, because the operadora is already a controlador with its own LGPD/ANS obligations. Counterintuitively, going *deeper* into the regulated regime is safer than staying in the patchwork B2B corporativo middle. Think about sequencing — Omada learned this the hard way; you don't have to.

— Lucia, navigating the regulatory landscape with pragmatic confidence ⚖️
