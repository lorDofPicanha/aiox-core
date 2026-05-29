# Diagnóstico dos 3 eixos + Roadmap da Concorrência Profunda — 29/Mai/2026

**Origem:** owner pediu para trabalhar no buscador (Noyce/ENIAC). Queixa concreta: *"a análise de concorrentes só fala se é alta ou baixa; quero uma análise mais aprofundada para extrair algo que me ajude"*, + sensação de que faltam **funcionalidades**, **separação** e **mais explicação do que fazer**.

**Método:** auditoria real do app `apps/noyce` (não dos docs) por 5 lentes + verificação adversarial de grounding, com **sondagem ao vivo da API pública PNCP** (29/Mai) para separar o que é dado real do que é chute. Scripts de prova: `scripts/pncp-competitor-probe{,2,3,4,5}.mjs`.

**Veredicto-título:** o `apps/noyce` hoje é um **visualizador de fixtures**, não uma ferramenta de caça-licitação. Nenhum dos 6 estágios chega a IMPLEMENTED. Os 2 pilares do MOAT (Analisar-6M, Indicar-Diferencial) estão **MISSING**. A "análise de concorrentes" é **placeholder fabricado** (`Concorrente Alfa/Beta` derivado do próprio score). A boa notícia: o dado real para fazer de verdade **existe e foi confirmado ao vivo** — com 1 disciplina de engenharia (janelas mensais + retry) e 1 gate de cobertura.

---

## PARTE 1 — Achados PNCP ao vivo (29/Mai, read-only, sem credencial)

| Achado | Status | Implicação |
|---|---|---|
| `/contratos` expõe vencedor real: `nomeRazaoSocialFornecedor`, `niFornecedor` (CNPJ), `valorInicial`/`valorGlobal`, `objetoContrato`, `orgaoEntidade.cnpj/razaoSocial`, `unidadeOrgao.municipioNome/codigoIbge`, `dataAssinatura`, `dataVigenciaFim`, `categoriaProcesso.nome`, `numeroControlePncpCompra` (liga contrato→licitação) | ✅ CONFIRMADO (ex. real: "N B FALCE CIA LTDA / 82643131000151 / R$ 572.629 / obra / Balneário Camboriú-SC") | Dá pra montar ranking de vencedores, share, incumbente, faixa de preço real |
| `/contratacoes/publicacao?codigoMunicipioIbge=&codigoModalidadeContratacao=&tamanhoPagina≥10` é **estável** e o filtro geo **funciona aqui** | ✅ CONFIRMADO (Águas Lindas: 20 concorrências/6m, órgão `01616520000196`, ~100% obras) | É a **perna estável** do pipeline: enumerar órgãos do raio |
| `/contratos?cnpjOrgao=X` **funciona mas é instável**: HTTP 500 "Erro na comunicação com o banco" mesmo em janelas de 30d; 204 = mês vazio. Em teste robusto, **5 de 6 janelas falharam** | ⚠️ CONFIRMADO (instável) | Histórico = **janelas mensais + retry/backoff** e/ou **Dados Abertos bulk**; NUNCA in-request |
| Filtro geo (uf/município) é **ignorado no `/contratos`**; nacional ~178k contratos/30d (~1,06M/6m) | ⚠️ CONFIRMADO | Inviável paginar nacional e filtrar do nosso lado ao vivo → enumerar órgãos e puxar por CNPJ, ou bulk |
| `/contratos` só mostra o **vencedor**, não os perdedores; não há `/propostas` confirmado | ⚠️ CONFIRMADO (gap) | Histórico de **derrota** da ENIAC NÃO sai do PNCP — só dos registros dela |

**Conclusão de dados:** *bulk (Dados Abertos) é a fonte da verdade; live é o patch em cima.* Tudo que deriva de "quem ganhou, por quanto, quando" é SÓLIDO. O que precisa de 2º registro ou janela longa (desconto, recorrência, derrota-ENIAC) é NEEDS-WORK. O único desconhecido que **decide o projeto** é **cobertura em municípios pequenos** — AT-RISK, precisa ser medido (kill-gate).

---

## PARTE 2 — Diagnóstico por eixo

### Eixo A — Faltam funcionalidades (6 estágios prometidos vs. entregues)

| Estágio | Veredito | Evidência (file:line) |
|---|---|---|
| 1 Monitorar | **PLACEHOLDER** | 4 linhas estáticas + botão "Dry-run" sem handler (`page.tsx:121`); fetcher real órfão em `docs/.../pncp-public-dry-run.mjs` (não importado); sem scheduler/notificação |
| 2 Analisar-6M (MOAT) | **MISSING** | sem histórico de órgão; concorrentes fabricados (`noyce-data.ts:133-136`); preço = `estimatedValue*0.86/1.14` (`noyce-data.ts:137-141`) |
| 3 Indicar-Diferencial (MOAT) | **MISSING** | sumiu da nav (`page.tsx:13-19`); só existe como membro de enum (`noyce-model.ts:13`); nenhuma oportunidade usa `stage:'indicar'` |
| 4 Habilitar | **PLACEHOLDER** | checklist e requisitos hardcoded (`noyce-data.ts:142-218`); sem upload, sem parsing PDF/Docling, sem matcher ACT/CAT |
| 5 Acompanhar (DOR #1) | **PLACEHOLDER** | timeline estática (`page.tsx:395`); notificações desligadas por design (`noyce-readiness.ts:239-246`); é a dor #1 do cliente (`CONTEXT.md:200`) |
| 6 Recorrer | **PLACEHOLDER** | ótima gov. de segurança (ato externo bloqueado, `noyce-model.ts:350`) mas conteúdo do recurso é string canned (`noyce-data.ts:284-291`); sem gerador/RAG |

**Top 5 funcionalidades faltantes (por alavancagem):**
1. Descoberta PNCP ao vivo + filtro geo/CNAE no app (o fetcher já existe, só não é plugado).
2. Notificação de movimentação (Stage 5 = dor #1 do cliente).
3. Ingestão de edital PDF + extração de habilitação (Stage 4).
4. Histórico de 6m do órgão + faixa de preço real (Stage 2 = MOAT).
5. **Persistência das decisões humanas** (hoje tudo é `useState` sobre constantes — `approved_by_human`/`intend_to_appeal` são inalcançáveis; equipe de 4 não colabora nem retoma).

### Eixo B — Falta separação

- **Financeiro/livro-caixa:** ✅ corretamente FORA do buscador (zero vazamento; alinhado a `CONTEXT §10.4/10.5`). **Não mexer.**
- **6 estágios:** ❌ NÃO são telas/módulos — são **âncoras de scroll** numa página só; `activeStage` só troca classe CSS, não roteia. `indicar` sumiu porque nada força sua existência.
- **Jurídico Fase 5:** domínio bem isolado (tipos + `buildLegalProcess` + funções puras); **UI** soterrada inline no god-component.
- **`page.tsx` = god-component de 592 linhas, `"use client"`** inteiro, com regra de negócio dentro da UI (`operationalState`/`operationalBlockers`/`daysUntil`... `page.tsx:537-591`), recalculada no render sem memo. Sub-componentes triviais extraídos; os blocos pesados não.
- **Dívida:** rota duplicada byte-a-byte (`app/analysis-runs.json/route.ts` == `app/api/analysis-runs/route.ts`); `path.resolve(".")` frágil dependente de cwd.

**Ordem de separação recomendada:** (1) mover regra de negócio `page.tsx`→`lib/noyce-operational.ts`; (2) extrair `LegalProcessPanel` + `PilotReadiness` (mais autônomos/sensíveis); (3) extrair `OpportunityInbox` + `OpportunityDecisionPanel` (donos do estado); (4) camada de dados `useOpportunities()`/`noyce-source.ts` antes do cutover fixtures→PNCP; (5) consolidar rotas duplicadas; (6) [produto, depois] rotas por estágio.

### Eixo C — Falta "explicação do que fazer" (actionability)

Raiz: o motor tem ótima máquina de estados, mas a UI **renderiza o rótulo e para ali**. A `ActionLabel` (`noyce-model.ts:26-31`) é literalmente uma lista de adjetivos passivos ("priorizar agora", "revisão obrigatória"). 13 superfícies auditadas → **12 são dead-end**. O caso-prova: `page.tsx:387` tinha `decision.recommendedAction` na mão e renderizou `legalReviewLabel(decision)` (a tag) no lugar.

**Solução estrutural (1 mudança resolve a maioria):** uma camada `buildNextAction(surface, item) → {verb, object, owner, deadline, why}` e cada superfície renderiza essa struct, não a tag. **Nenhum dado novo é necessário** — `missingData`, `proposalDeadline`, `humanOwner`, `criticality`, `consequenceIfMissed`, `requiresHumanAction` já existem; estão sendo jogados fora na borda do render.

Top fixes: (#1) decision-points legais imprimem a AÇÃO + dono + prazo, não a tag; (#2) cards/decision-summary com ação parametrizada por `missingData`/prazo; (#3) lacunas viram tarefa (verbo+dono+fonte+impacto) em vez de chaves cruas (`visita_tecnica`); (#4) preço vira recomendação de lance; (#5) concorrência diz o que fazer com cada rival.

---

## PARTE 3 — Módulo de Concorrência Profunda (o centro)

Substitui `competitors[]` `{name, level, note}` e `priceReferences[]` (×0.86/×1.14) por uma `MarketStructure` reconstruída de dado real, com **rótulo de proveniência** (`grounded`/`inferred`/`gap`) em todo campo e **gate de cobertura**.

**Regra anti-regressão (CRÍTICA):** nenhum campo pode derivar de `opportunityScore`/`confidenceScore` (isso é exatamente o fake atual). Todo campo `grounded` rastreia um `numeroControlePncpCompra` em `sourceContractIds`; o resto carrega `grounding` visível na UI.

### Métricas (com proveniência corrigida pela verificação adversarial)

**SÓLIDAS (dado real, determinístico):** ranking de vencedores (#1 CNPJ+nome, #2 nº vitórias, #3 R$ total, #11 ranking), #5 incumbente, #6 ticket médio, #13 nº fornecedores distintos, #14 faixa P25/mediana/P75 (substitui o ×0.86 fake), #17 mix de modalidade (vem do `/contratacoes`, a perna estável), pipeline de enumeração + pull por CNPJ.

**INFERÊNCIA (precisa rótulo na UI):**
- #4 % share e #12 HHI: o *número* é grounded; o **rótulo categórico** (pulverizado/moderado/concentrado) é convenção nossa **e** é enviesado pra cima sob baixa cobertura → renderizar como inference + mostrar `coveragePct` ao lado.
- #7 **desconto médio**: foi over-claimed como grounded. `valorTotalEstimado` NÃO é campo do `/contratos` (vem do join com `/contratacoes`), é frequentemente sigiloso, e obras usam BDI. **É exatamente a métrica do kill-gate (MAPE>15%=KILL)** → tratar como inference até o eval passar.
- #8 afinidade de objeto, #10 "como vencer", #15 recorrência, #16 sazonalidade, #18 taxa de outsider: inferência (texto livre / janela curta).

**UNGROUNDED (cortar ou marcar "fora do escopo PNCP"):**
- #9 **head-to-head ENIAC / "perdi pra X por Y%"**: PNCP só mostra o vencedor. Só reconstituível dos registros da própria ENIAC. NÃO fabricar.
- Stage-3 **"Diferencial"**: precisa de perfil de capacidade da ENIAC (acervo, CNAEs) que não existe/não está modelado.
- Stage-3 **"Risco"** e metade "sessão/impugnação" do **"Timing"**: dependem de extração de cláusula do edital (Stage 4), que não foi sondado.

### Tipos novos (substituem o fake)
```ts
export type Grounding = "grounded" | "inferred" | "gap";
export type MarketConcentration = "pulverizado" | "moderado" | "concentrado";

export interface Competitor {
  cnpj: string; name: string;            // GROUNDED
  winCount: number; totalWonBRL: number; // GROUNDED
  sharePct: number;                      // número GROUNDED; ler com coverage
  avgTicketBRL: number;                  // GROUNDED
  avgDiscountPct: number | null;         // INFERENCE (join /contratacoes; null se sigiloso)
  isIncumbent: boolean; lastWinDate: string | null; // GROUNDED
  objectAffinity: "alta" | "media" | "baixa";       // INFERENCE
  vsEniac: { encounters: number; eniacWins: number; lostByPct: number | null; grounding: Grounding }; // ~sempre gap
  howToBeat: string;                     // INFERENCE (regra)
  grounding: Grounding; sourceContractIds: string[];
}
export interface PriceBand { p25BRL: number|null; medianBRL: number|null; p75BRL: number|null; sampleSize: number; grounding: Grounding; sourceContractIds: string[]; }
export interface MarketStructure {
  orgaoCnpj: string; orgaoName: string; objetoClass: string;
  distinctWinners: number; hhi: number; concentration: MarketConcentration; // band = inference
  modalityMix: Record<string, number>;
  recurrenceMonths: number | null; outsiderWinRatePct: number | null; // inference, null até backfill
  coveragePct: number;       // GATE — measured-with-confidence, não bare grounded
  windowMonths: number;
  competitors: Competitor[]; priceBand: PriceBand;
}
// Opportunity: trocar priceReferences[]+competitors[] por:  market: MarketStructure | null;  // null → UI "dados insuficientes" quando coveragePct < 0.5
```

### Stage-3 — 5 frases acionáveis (schema-locked, cada frase com fonte citável)
`preco_alvo` (←PriceBand, GROUNDED se n≥N_MIN) · `concorrente_provavel` (←incumbente+ranking, GROUNDED) · `diferencial` (UNGROUNDED hoje) · `risco` (UNGROUNDED, precisa edital) · `timing` (MISTO). Disclaimer Justen obrigatório: *"Sugestão baseada em dados públicos — não substitui análise jurídica/contábil."*

---

## PARTE 4 — ROADMAP (sequenciado, gate-first)

**Princípio:** entregar a dor concreta (concorrência profunda) primeiro, com dado real via snapshot batch (não live-in-request), honesto sobre o que é grounded. Não construir a síntese Stage-3 antes do kill-gate.

### Slice 0 — Refactor de fundação (baixo risco, destrava o resto)
- Mover regra de negócio `page.tsx`→`lib/noyce-operational.ts` (+ testes).
- Camada `buildNextAction()` (actionability) — resolve o Eixo C estruturalmente.
- Extrair `LegalProcessPanel`, `OpportunityDecisionPanel`, `OpportunityInbox`, `PilotReadiness`.
- Consolidar rota duplicada + isolar resolução de paths.

### Slice 1 — Ingestão PNCP real (batch) → snapshot
- Script robusto: enumerar órgãos do raio (`/contratacoes`) → puxar `/contratos` por `cnpjOrgao` em **janelas mensais + retry/backoff**, tratar 204 = vazio, dedup por `numeroControlePncpCompra`; fallback Dados Abertos bulk.
- Saída: snapshot JSON real (vencedores/preços/órgãos) versionado em `02-architecture/outputs/`.
- `coveragePct` calculado e honesto (cross-check bulk×live).

### Slice 2 — Módulo de Concorrência Profunda (a dor do owner)
- Novos tipos (`MarketStructure`/`Competitor`/`PriceBand`) substituindo o fake.
- `buildMarketStructure()` computando as métricas SÓLIDAS do snapshot real, com `grounding` por campo e gate de cobertura (`market=null` se <50%).
- UI: reescrever painéis Concorrência + Preço (`page.tsx:252-294`) → ranking com CNPJ, share, R$, badge incumbente, `howToBeat`, chip de proveniência, trust-meter de cobertura.
- Regra anti-regressão aplicada (zero derivação de score).

### Slice 3 — KILL-GATE (antes de Stage-3)
- Rodar eval nos 11 editais reais + histórico 6m do cliente, estratificado por tier de município.
- Thresholds: cobertura ≥50%, hit-rate vencedor ≥50%, MAPE preço ≤15%. Falhou → pivota (foca tiers com bom dado, ou desloca moat p/ habilitação/recurso).

### Slice 4 — Stage-3 (só se gate passar) + Stage-3 honesto
- Frases grounded primeiro (preço-alvo, concorrente provável); diferencial/risco/timing marcados "fora do escopo PNCP / precisa Stage 4" até edital-parsing existir.

### Depois (eixo features): Stage 1 live no app, Stage 5 (notificação = dor #1), Stage 4 (Docling), persistência (DB) para a equipe de 4.

---

## PARTE 5 — STATUS DE EXECUÇÃO (29/Mai, mesma sessão)

✅ **Slice 1 — Ingestão PNCP real (FEITA).** `scripts/noyce/build-competitor-snapshot.js`: enumera órgãos do raio, puxa `/contratos` por `cnpjOrgao` em janelas mensais + retry/backoff, filtra obras (CNAE/keywords), cacheia raw (`apps/noyce/lib/data/.cache/`, gitignored), dedup por `numeroControlePNCP`. Saída versionada: `apps/noyce/lib/data/market-snapshot.json`. Dado real obras 12m: Águas Lindas HHI 2054 (moderado, 20 conc.), Novo Gama 3018, Pirenópolis 2929, **Anápolis 4447 (CONCENTRADO)**, CEASA 0 (buraco sigiloso).

✅ **Slice 2 — Módulo de concorrência profunda (FEITO).** Tipos `MarketStructure/Competitor/PriceBand` em `noyce-model.ts` substituíram `competitors[]`/`priceReferences[]` fake. `noyce-market.ts` (loader). `noyce-data.ts` liga `market` por `orgaoCnpj` (Águas Lindas+Anápolis reais; Formosa/Luziânia → null honesto). `MarketSection` em `page.tsx`: ranking real (CNPJ, share, R$, incumbente ★), badge de concentração, HHI, trust-meter de cobertura, faixa P25/mediana/P75, `howToBeat`, chip de proveniência (grounded/inferred/gap), e estado "dados insuficientes". CSS adicionado. **Anti-regressão travado** por `tests/noyce-market.test.mjs`. **Build limpo + typecheck limpo + 16/16 testes.**

✅ **Slice 3 — Kill-gate (RODADO).** `scripts/noyce/run-stage2-coverage.js` nos 11 editais reais → cobertura descoberta **45% (REPROVA <50%)**, hit-rate vencedor **100%**, MAPE **13,7%** (7/11 preliminares) → veredito **PIVOT_OR_KILL**. Vencedor real recuperado em **73% (8/11)**. Buracos: Abadiânia (BNC município pequeno) + CEASA/GO (BLL estatal sigiloso). Output: `outputs/stage2-coverage-{resultado.csv,summary.json}`.

🟡 **Pendências / refinamentos honestos:**
- `coveragePct` do snapshot é ruidoso (denominador = todas as contratações vs contratos obras-filtrados) → mostrado como provisório `*`. Refinar: denominador = contratações de obras + cross-check Dados Abertos bulk.
- Incumbente em mercado pulverizado é sinal fraco (só data mais recente).
- Kill-gate borderline (45%) → antes de escalar/prometer Stage-3, fechar cobertura com bulk dumps e a lista 6m real da cliente, estratificado por tier de município.

⬜ **Próximo:** Slice 0 (camada `buildNextAction` → resolve Eixo C actionability; quebrar god-component) · Slice 4 (Stage-3 5-frases, só se gate passar) · features (Stage 1 live, Stage 5 notificação = dor #1, Stage 4 Docling, persistência DB).

---

*Diagnóstico por Orion (aios-master). 5 auditorias paralelas sobre código real + verificação adversarial de grounding + sondagem ao vivo do PNCP (probes 1-5). overallSafe=true com 3 correções aplicadas no design acima (desconto/cobertura/HHI rebaixados; kill-gate como precondição; 3 outputs ungrounded marcados).*
