# AIOS Contribution Measurement Protocol

> **Operational protocol** para o critério pre-registered "AIOS contribution ≥ 60%" deixar de ser unfalsifiable.
> Sem este protocolo implementado, ZERO outreach prospect #1.

**Versão:** 1.0 (locked)
**Última atualização:** 2026-05-12
**Ownership:** Breno (operator) executa logging. Judge lê no review 2026-06-09.

---

## Por que isso existe

Kozyrkov (Squad #3 Process): "Sem protocolo de medição definido, o critério 'AIOS ≥60%' é não-falsificável. O piloto não pode ser honestamente avaliado."

Pricing squad blind spot #2: "AIOS contribution measurement is undefined. Without a measurement protocol (time-tracking, output-attribution log), this criterion is unfalsifiable and the pilot can't be honestly evaluated."

**Risco específico (História #3 pre-mortems):** AIOS contribution real pode ser 35-50%, NÃO 80% da tese. Sem dados, Breno cai em confirmation bias post-hoc ("ah, mas o AIOS me ajudou em quase tudo, deve ter sido 70%").

---

## Métrica primária — % output atribuível a AIOS

**Definição:** percentual de unidades discretas de output do site final que foram **geradas por agente AIOS (LLM/extractor/tooling)** vs **escritas/criadas/editadas manualmente pelo Breno**.

**Granularidade:** por categoria de output.

### Categorias e métricas

| Categoria | Unidade | AIOS counted como 100% se... | AIOS counted como 0% se... | Mid-cases |
|---|---|---|---|---|
| **Design tokens (cor/type/spacing)** | tokens | tokens.json gerado por design-md ou multi-ref synthesis manual via LLM, SEM edição posterior do Breno | Breno definiu tokens do zero | Breno editou N tokens manualmente → AIOS % = (total - edited) / total |
| **Copy do site** | palavras (ou H1/seção blocks) | seção gerada por LLM prompt e mantida sem edits | Breno escreveu do zero | Por seção: binary 0% ou 100% (não conta "ajuste de vírgula"). Final % = words_AI / total_words |
| **Código TSX/CSS** | linhas | LLM-generated e committed | Breno escreveu do zero | git blame proxy: AIOS lines = total - lines_manually_edited (use line-level diff vs initial AIOS output) |
| **Imagens** | assets count | fal.ai/Midjourney/LLM-gen + curadoria Breno = 100%; design-md extracted hero from ref = 100% | foto Breno tirou presencialmente | stock externa curada = 50% (asset pronto + curadoria humana) |
| **Pesquisa nicho refs** | sources count | tools/extractor sugeriu ref que foi USADA na synthesis final | Breno achou manualmente no Pinterest/Awwwards | binary per source |
| **Configurações técnicas** (Vercel/Tailwind/Next.js) | files | scaffold inicial AIOS (template/CLI) | Breno escreveu do zero | per-file binary |

### Fórmula composta por output

```
output_aios_pct = (AIOS_units_in_category) / (total_units_in_category) × 100
```

### Fórmula composta por prospect

Weighted average por categoria (pesos refletem effort proxy):

```
prospect_aios_pct =
    design_tokens_pct × 0.10 +
    copy_pct          × 0.25 +
    code_pct          × 0.30 +
    images_pct        × 0.15 +
    refs_research_pct × 0.10 +
    config_pct        × 0.10
```

Sum of weights = 1.00.

---

## Métrica secundária — % tempo Breno gasta em AIOS-assisted vs hand-edit

**Time-tracking obrigatório** durante TODO o build. Tool: Toggl (ou planilha simples). Cada bloco rotulado.

### Categorias time-tracking

| Category | Sempre humano | AIOS-assisted | Hand-edit |
|---|---|---|---|
| **Outreach** (presencial + Whats + email follow-up) | ✅ | | |
| **Cliente comms** (call/Whats pós-venda) | ✅ | | |
| **Fotos presenciais** (sessão 2h) | ✅ | | |
| **Build supervision** (revisar AIOS output, aprovar/rejeitar) | | ✅ | |
| **Design refinement** (ajustar tokens AIOS pra fitar brand) | | (parcial) | |
| **Copy hand-edit** (reescrever sections AIOS) | | | ✅ |
| **Code hand-edit** (fix bugs, ajustar layout) | | | ✅ |
| **QA manual** (rodar Lighthouse, axe, broken-links) | | ✅ (tools AIOS-augmented) | |
| **Deploy + config** (Vercel setup, env vars, DNS) | | parcial | parcial |
| **Setup jurídico** (contrato, LGPD docs) | | | ✅ |
| **Research nicho** (achar refs manualmente) | | parcial | parcial |

### Fórmula secundária

```
breno_hand_edit_ratio = hand_edit_hours / total_build_hours
breno_aios_assisted_ratio = 1 - hand_edit_ratio
```

Onde `total_build_hours` = todas horas de produção (exclui outreach, cliente comms, setup jurídico, fotos presenciais).

---

## Fórmula FINAL de AIOS contribution %

Pondera output (qualidade) + time (esforço):

```
AIOS_contribution_pct =
    (output_aios_pct × 0.7) +
    (breno_aios_assisted_ratio × 100 × 0.3)
```

Pesos:
- Output % (0.7) = o QUE foi entregue (resultado tangível ao cliente)
- Time % (0.3) = como o TEMPO foi gasto (efficiency proxy)

**Thresholds (do 00-pre-registered-criteria.md):**
- SUCCESS: ≥ 60%
- PERSEVERE WITH PIVOT: 40-60% (tier reprice OR scope narrow)
- KILL: < 40% (80% automation thesis morta)

---

## Captura operacional — passo a passo

### Durante o build (real-time)

**Toggl entries (ou planilha):**
- Start timer ao começar bloco de trabalho
- Rotular: `[prospect-id] [category] [aios-assisted | hand-edit]`
- Exemplo: `[P-001] [code] [aios-assisted]` ou `[P-001] [copy] [hand-edit]`
- Stop timer ao terminar

**Output logging (após cada bloco AIOS):**
- Salvar artefato original AIOS-generated (antes de qualquer edit) em `02-pilots/blumenau-padaria-artesanal/audit-data/P-{id}/aios-raw/`
- Após editar, salvar versão final em `audit-data/P-{id}/final/`
- Diff entre os 2 → conta edit %

### No final do build (post-deploy)

**Spreadsheet preenchida obrigatória** — modelo em `audit-data/template.xlsx` (a criar antes prospect #1):

```
| Category         | Output unit | AIOS units | Total units | AIOS % | Weight | Weighted |
|------------------|-------------|------------|-------------|--------|--------|----------|
| Design tokens    | tokens      | 47         | 52          | 90.4%  | 0.10   | 9.04%    |
| Copy             | words       | 1240       | 2480        | 50.0%  | 0.25   | 12.50%   |
| Code (TSX/CSS)   | lines       | 850        | 1200        | 70.8%  | 0.30   | 21.24%   |
| Images           | assets      | 18         | 24          | 75.0%  | 0.15   | 11.25%   |
| Refs research    | sources     | 3          | 5           | 60.0%  | 0.10   | 6.00%    |
| Config files     | files       | 12         | 14          | 85.7%  | 0.10   | 8.57%    |
|------------------|-------------|------------|-------------|--------|--------|----------|
| TOTAL Output AIOS%                                                          | 68.60%   |
```

```
| Time category           | Hours | aios-assisted | hand-edit |
|-------------------------|-------|---------------|-----------|
| Build supervision       | 2.0   | 2.0           | 0.0       |
| Design refinement       | 1.5   | 1.5           | 0.0       |
| Copy hand-edit          | 3.0   | 0.0           | 3.0       |
| Code hand-edit          | 4.0   | 0.0           | 4.0       |
| QA manual               | 2.0   | 2.0           | 0.0       |
| Deploy + config         | 1.5   | 1.0           | 0.5       |
| Research nicho          | 2.0   | 1.0           | 1.0       |
|-------------------------|-------|---------------|-----------|
| TOTAL                   | 16.0  | 7.5           | 8.5       |
| breno_aios_assisted_ratio = 7.5/16 = 46.9%                              |
```

```
AIOS_contribution_pct = (68.60% × 0.7) + (46.9% × 0.3)
                      = 48.02% + 14.07%
                      = 62.09%
```

→ Status: **SUCCESS threshold passed** (≥60%)

---

## Anti-padrões a evitar

1. **Confirmation bias post-hoc:** "ah mas o AIOS me ajudou em quase tudo" sem evidência. Anti: log REAL-TIME, não retrospectivo.
2. **Esquecer time tracking:** Toggl não está rodando → bloco invisível. Anti: timer ALWAYS ON quando trabalhando no projeto.
3. **Não salvar AIOS-raw output:** sem o baseline, não dá pra calcular edit %. Anti: SAVE-BEFORE-EDIT discipline.
4. **Inflar AIOS % por categoria irrelevante:** "AIOS gerou 100% dos config files" — config files são 14 linhas, copy é 2480 palavras. Pesos compostos protegem (config peso 0.10).
5. **Misturar outreach hours com build hours:** outreach é sempre humano e não conta — não pode entrar no denominador.
6. **Não medir até o final:** medir só "feeling" no dia 09/Jun review. Anti: medir POR PROSPECT no dia que shipped.

---

## Output esperado por prospect (artefato auditável)

`02-pilots/blumenau-padaria-artesanal/audit-data/P-{id}/contribution-audit.md`:

```markdown
# AIOS Contribution Audit — Prospect P-{id}

**Build start:** YYYY-MM-DD
**Build end:** YYYY-MM-DD
**Total build hours:** X.X
**Site shipped:** YES/NO

## Output AIOS % por categoria

[tabela acima]

## Time AIOS-assisted vs hand-edit

[tabela acima]

## Fórmula composta

AIOS_contribution_pct = X.XX%

## Verdict status

[SUCCESS / PERSEVERE / KILL] threshold per 00-pre-registered-criteria.md

## Notas

[free-form: onde AIOS shineou? onde quebrou? que category dominou hand-edit?]
```

---

## Setup checklist ANTES prospect #1

- [ ] Conta Toggl Free ativada (ou planilha Excel com timer manual)
- [ ] Folder `audit-data/` criada em `02-pilots/blumenau-padaria-artesanal/`
- [ ] Template `audit-data/template.xlsx` criada (estrutura tabelas acima)
- [ ] Toggl rules + categories pré-configuradas
- [ ] Save-before-edit habit estabelecido (mental + workflow)
- [ ] Folder `audit-data/P-{id}/aios-raw/` criada por prospect ao começar build
- [ ] Time-tracking iniciado no PRIMEIRO bloco de trabalho do prospect #1

---

## Quando reavaliar este protocolo

- **Após prospect #1 build:** se o protocolo estiver consumindo >30min de overhead vs build real, simplificar (reduzir granularity)
- **Após prospect #3:** se a fórmula composta estiver dando resultados contra-intuitivos (ex: 75% AIOS quando Breno sentiu que reescreveu tudo), revisar pesos
- **Pós-pilot SUCCESS:** se for codar skill que automatiza categoria X, o protocolo precisa medir antes/depois de cada skill nova (definir baseline)

---

## Disclaimer epistêmico

Este protocolo MEDE atribuição operacional, NÃO predição de skill ROI. AIOS contribution 60% num prospect manual ≠ "se codar audit-site, vai pra 80%". A relação skill-coding → AIOS-pct é não-linear e contextual. ADR-0004 (pós-pilot) precisará calibrar isso separadamente.
