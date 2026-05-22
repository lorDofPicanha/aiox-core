# #05 — Anonymizer/Sanitizer LGPD-Strict

**Tier:** A
**Status:** ⚪ pending (componente reutilizável dentro de #01, #03, #06)
**Case validador:** Lígia (TJ) — anonimização obrigatória pra processo em segredo de justiça

---

## DSPC

**D — Dor cara:**
Profissional que lida com dados sensíveis (advogado, médico, banco, RH) precisa enviar dados pra LLM/SaaS externo, mas LGPD impede. Anonimização manual = 5-10min por documento. Erro de anonimização = multa ANPD R$50M ou 2% do faturamento + processo civil + dano reputacional. Hoje o profissional ou:
(a) Não usa AI por medo (perde produtividade 5-10x)
(b) Usa AI sem anonimizar (risco LGPD bomba-relógio)
(c) Anonimiza na mão lento (esgotamento)

**Custo semanal visível:** escritório com 1.000 documentos/mês × 7min anonimização manual = 116h/mês = R$15-25k/mês em mão-de-obra OU risco multa milionária.

**S — Squad:**
- `agent-pii-detector` — NER PT-BR (CPF, CNPJ, RG, endereço, telefone, e-mail, nome próprio, número de processo)
- `agent-context-classifier` — classifica tipo de documento (petição, contrato, prontuário, etc.)
- `agent-sanitizer` — substitui PII por placeholders consistentes (ex: PESSOA_A, PESSOA_B mantidos ao longo do doc)
- `agent-redaction-mapper` — mantém mapa cifrado pra DEPOIS reverter no output final
- `agent-audit-trailer` — log auditável de tudo que foi anonimizado (compliance ANPD)
- `agent-lgpd-validator` — Patricia Peck clone valida que nada vazou
- `agent-local-mode` — opção 100% on-premises (cliente fornece máquina, nada sai)

**P — Pitch:**
> "Eu ajudo escritórios jurídicos, hospitais e bancos a usar IA sem risco LGPD usando squad anonimizador com audit trail e validação Patricia Peck para alcançar 90% redução de tempo + compliance ANPD documentada"

**C — Contrato:**
- Setup: R$20-50k (depende de volume de tipos de documento)
- Manutenção: R$5-10k/mês (atualizações de regras NER, novos tipos de PII)
- Continuidade: 24 meses

---

## Vertical inicial sugerido

**Recomendado: Escritórios jurídicos com segredo de justiça** (caso Lígia direto)

**Alternativas:**
- Hospitais (LGPD saúde é mais estrita)
- Bancos / fintechs (compliance integrada)
- RH corporativo (dados de funcionário)
- Educação (dados de menores — extra-sensível)

---

## Reuse de assets AIOS

| Asset | Função |
|---|---|
| `legal-chief` + Patricia Peck (clone) | Validation core |
| `bruce-schneier` (clone) | Adversarial review (red team) |
| `lucia-savage` (clone) | LGPD saúde se vertical for hospital |
| `ann-cavoukian` (clone) | Privacy by Design framework |
| `heather-meeker` (clone) | OSS dependency review (NER libs) |
| Anipis Art. 18 saga (já implementado!) | Pattern reusável de tombstone + audit events |
| Anipis ZDR enforcement (DEV-5/6) | Mesmo pattern fail-closed production |

---

## Stack técnico proposto

- **NER engine:** Presidio (Microsoft) PT-BR + spaCy + regras customizadas BR (CPF/CNPJ checksum)
- **Backend:** Next.js + Supabase (modo cloud) OU Docker on-premises (modo local)
- **Storage:** todos os mapas de redaction criptografados com AES-256, chave do cliente
- **Audit trail:** hash chain (mesmo pattern do Anipis Sprint 0)
- **Mode local:** Whisper local + Codex CLI local + zero envio externo

---

## Roadmap de execução

| Fase | Duração | Entregável |
|---|---|---|
| **Brainstorm DSPC + legal-chief** | 4h | DSPC validado + Patricia Peck approved |
| **Discovery** | 2-3 dias | Lígia (TJ) interesse parceria/case? |
| **PRD detalhado** | 1 dia | 7 agents + audit trail spec |
| **MVP backend NER** | 1 semana | Detect + sanitize + reverse mapping funcionando |
| **MVP audit trail** | 3 dias | Hash chain + ANPD-compliant log |
| **MVP modo local** | 1 semana | Docker on-premises |
| **Smoke test** | 1-2 semanas | Lígia ou advogado parceiro testa 100 docs reais |
| **Refinamento** | 1 semana | Ajustes pós-feedback |

**Tempo total até primeiro contrato:** ~5-7 semanas.

---

## Hipóteses críticas

1. ✅ Anipis Sprint 0/1 já validou padrão de hash chain + audit events + tombstone
2. ✅ Patricia Peck no roster como clone + bridge para ela real (via Anipis SCC)
3. ❓ Qualidade NER PT-BR (Presidio é EN-first) — precisa fine-tune ou alternativa
4. ❓ Cliente aceita modo cloud vs exige on-premises 100%?
5. ❓ Quem é primeiro cliente? Lígia se topa parceria?

---

## Riscos

- **Risk-1:** False negative em PII (deixar dado vazar) → mitigar: gate Patricia Peck + double-check Bruce Schneier red team
- **Risk-2:** Concorrência grande (Presidio + outras tools open source) → diferencial = nossa validation Patricia Peck + audit trail + pacote-serviço pronto
- **Risk-3:** ANPD muda regras → mitigar: legal-chief monitora + ajuste contínuo
- **Risk-4:** Modo local exige máquina cliente → mitigar: Docker + scripts de install testados

---

## Diferencial vs concorrência

- vs Presidio puro: nossa validação Patricia Peck + audit trail compliance-ready
- vs serviço LGPD humano: 50x mais barato + escala
- vs "vamos fingir que não tem LGPD": defesa jurídica documentada se houver fiscalização

---

## Próximas ações

- [ ] Brainstorm DSPC com legal-chief
- [ ] Spike: Presidio PT-BR — quão bom é out-of-the-box?
- [ ] Consultar Patricia Peck (real ou clone) sobre requisitos audit trail ANPD
- [ ] Tentar parceria com Lígia (case + cliente piloto)

Trigger: `kickoff anonymizer`
