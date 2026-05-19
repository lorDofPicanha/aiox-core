# Google Sheets Schema — Week 0 Tracking (paralelo ao HTML)

**Planilha:** `CRM Week 0 — Tracking [seu nome]`
**Drive folder:** `Tocks / CRM Novo / Week 0`
**Compartilhamento:** Só você + Conclave AI (read-only) se quiser feedback

---

## 5 Abas

### Aba 1: `cronograma`

| Day | Data | Tasks | Status | Notes |
|-----|------|-------|--------|-------|
| 1 | 2026-05-19 | Convite Cristiane + Rudson, Auto-entrevista agendar | done | |
| 2 | 2026-05-20 | Entrevista Cristiane (10h), Auto-entrevista Breno (15h) | active | |
| 3 | 2026-05-21 | Entrevista Rudson (11h), Bridge deploy | pending | |
| 4 | 2026-05-22 | Processar entrevistas | pending | |
| 5 | 2026-05-23 | Dogfooding 1 dia | pending | |
| 6 | 2026-05-24 | Reserva (recovery) | pending | |
| 7 | 2026-05-25 | Gate 0 review 90min | pending | |

**Dropdown status:** `pending / active / done / blocked / skipped`
**Conditional formatting:** done → verde, active → amarelo, blocked → vermelho

---

### Aba 2: `entrevistas`

| Entrevistado | Tipo | Data | Hora | Status | Score CN (0-10) | WTP R$/mês | Atribuição quebrada? | Volta 2sem? | Top 3 dores | Veredito | Notes |
|--------------|------|------|------|--------|-----------------|------------|---------------------|-------------|-------------|----------|-------|
| Cristiane | core | 2026-05-20 | 10:00 | scheduled | | | | | | | |
| Rudson | core | 2026-05-21 | 11:00 | scheduled | | | | | | | |
| Breno (self) | core | 2026-05-20 | 15:00 | scheduled | | | | | | | |
| Externo 1 | opcional | — | — | not-scheduled | | | | | | | |
| Externo 2 | opcional | — | — | not-scheduled | | | | | | | |

**Dropdowns:**
- Status: `not-scheduled / scheduled / done / no-show / cancelled`
- Atribuição quebrada?: `sim / não / parcial`
- Volta 2sem?: `sim / talvez / não`
- Veredito: `BUILDER / WATCHER / KILL`

**Formulas auto-calculadas (cell separada, talvez aba `gate-0`):**
```
=AVERAGEIF(entrevistas!B2:B6,"core",entrevistas!F2:F6)  → Customer Need médio core
=COUNTIFS(entrevistas!B2:B6,"core",entrevistas!G2:G6,">=300")  → Pagariam R$300+ core
=COUNTIFS(entrevistas!B2:B6,"core",entrevistas!H2:H6,"sim")  → Atribuição quebrada core
=COUNTIFS(entrevistas!B2:B6,"core",entrevistas!I2:I6,"sim")  → Volta 2sem core
```

---

### Aba 3: `bridge`

| # | Verificação | Esperado | Atual | Status | Notes |
|---|-------------|----------|-------|--------|-------|
| 1 | Inngest function deployed staging | 200 OK ping | | pending | |
| 2 | Meta CAPI test event Lead | 200 + visible Events Manager | | pending | |
| 3 | Meta CAPI test event Purchase | 200 + visible | | pending | |
| 4 | Google OC upload Lead Qualificado | 200 + visible Ads Manager | | pending | |
| 5 | Idempotency: 2x fire mesmo event_id | 1 row Supabase, não 2 | | pending | |
| 6 | Dead letter: fire com env errado | DLQ row criada | | pending | |
| 7 | Audit log: row por fire | 1 row /fire em audit_log | | pending | |
| 8 | E2E: 1 lead real Tocks → both fires | confirma Meta + Google | | pending | |

**Dropdown status:** `pending / passing / failing / blocked / skipped`

---

### Aba 4: `dogfooding`

#### Sub-table 4a: Volume (durante o dia)

| Horário | Tipo | Lead/Deal | Valor | Status | Tempo intake (min) | Notes |
|---------|------|-----------|-------|--------|---------------------|-------|
| 09:42 | lead | João Silva +5511... | R$ 18k | novo | 1.5 | meta carrossel v3 |
| 10:15 | lead | Maria Costa +5561... | R$ 12k | novo | 2.0 | google pmax |
| ... | | | | | | |

#### Sub-table 4b: Resumo do dia

| Métrica | Valor | Target | Status |
|---------|-------|--------|--------|
| Leads novos | | — | |
| Leads qualified | | — | |
| Deals won | | — | |
| Receita potencial | R$ | — | |
| Receita won | R$ | — | |
| Tempo total operando (h) | | — | |
| Tempo médio intake/lead (min) | | ≥ 2 = atrito | |
| Tab switches contados | | ≥ 20 = atrito | |
| Tempo total atualizando planilha (min) | | ≥ 30 = atrito | |
| Follow-ups perdidos | | ≥ 1 = atrito | |
| Lead Qualified events disparados | | — | |
| Bridge success rate | % | ≥ 80% | |
| Discrepância Meta vs Google | % | ≤ 5% | |
| **Atritos identificados (count)** | | **≥ 5 = sinal forte build** | |

---

### Aba 5: `gate-0`

#### Tabela de decisão final

| Critério | Threshold N=3 verde | Threshold N=3 kill | Atual N=3 | Status |
|----------|--------------------|--------------------|-----------|--------|
| Customer Need médio | ≥ 7 | ≤ 4 | =entrevistas!fórmula | |
| Pagariam R$ 300+/mês | 3/3 (100%) | ≤ 1/3 | =entrevistas!count | |
| Atribuição quebrada citada | 3/3 | ≤ 1/3 | =entrevistas!count | |
| "Volta em 2 sem?" sim | 3/3 | ≤ 1/3 | =entrevistas!count | |
| Dogfooding: atrito + bridge | atrito ≥ 5 E bridge ≥ 80% | bridge < 50% | =dogfooding!resumo | |

**Conditional formatting:**
- Verde quando atinge threshold verde
- Vermelho quando atinge threshold kill
- Amarelo quando intermediário

#### Verdict box

| Verdict | Sinal | Próxima ação |
|---------|-------|--------------|
| 🟢 Verde | 4/5 critérios verde | Kickoff Sprint 1 Alpha · segunda Week 1 |
| 🟡 Amarelo N=3 | 2-3 critérios verdes, resto misto | Estender N=5 com 2 externos · re-avaliar |
| 🟡 Amarelo N=5 | 2-3 critérios verdes | Re-Conclave Blank/Campbell/Dunford |
| 🔴 Vermelho | 3+ critérios kill | PIVOT Bridge-only · move escopo `40-pivot-bridge-only/` |
| ⚫ Preto | Tudo kill + dogfooding tranquilo | KILL · reabsorve Tocks/Bretda |

**Veredito final (texto livre, escrito Day 7):**

```
Verdict: ___________
Justificativa: _____________________________
Próxima ação concreta: _____________________
Sign-off Breno: _______________________ / 2026-05-25
```

---

## Setup rápido (10min)

1. Cria planilha vazia no Google Drive: `CRM Week 0 — Tracking 2026-05-19`
2. Renomeia 5 abas: cronograma · entrevistas · bridge · dogfooding · gate-0
3. Copia headers de cada aba acima
4. Aplica dropdowns + conditional formatting nas colunas status
5. Pin o link da planilha no celular (atalho home screen) — vai usar 10x/dia Week 0

---

## Como combina com o HTML dashboard

| Quando | Use |
|--------|-----|
| Durante o dia, mobile, rápido | **Google Sheets** (atualiza online em qualquer dispositivo) |
| Pra ver progresso visual no notebook (final de dia / Day 7) | **HTML dashboard** (atualiza manual edit) |
| Mandar pra Cristiane/Rudson ver progresso pós-Gate 0 | **HTML dashboard** (exporta PDF) |
| Compartilhar com Conclave externo se reabrir | Ambos |

**Princípio:** Sheets = working copy (vivo, mobile). HTML = snapshot visual (apresentação, leitura limpa).

---

*Schema desenhado pra não exigir Apps Script — tudo via formulas nativas + conditional formatting. Setup 10min. Uso diário <5min/dia.*
