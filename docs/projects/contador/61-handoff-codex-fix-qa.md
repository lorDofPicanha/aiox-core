# 61 — Handoff Codex: Fixes do QA do Motor/Parser (60)

> **Autor:** Orion (Claude) · **Data:** 2026-06-26 · **Para:** Codex (motorista de execução)
> **Origem:** `60-qa-motor-parser-26jun.md` (gate 🟡 CONCERNS). O 🔴-A já foi corrigido por Claude (parar a perda de tributo é urgente); este handoff é o **restante**.
> **Divisão de trabalho (Constituição Art. VII):** Claude planeja/revisa; Codex executa.
> **Regra de ouro do projeto:** falso-positivo silencioso destrói a confiança do contador (`00-context/CONTEXT.md §5.3`). Tributo presente porém ilegível é **corrupção, não ausência** → `ParseError`, nunca `undefined`.

---

## ✅ JÁ FEITO por Claude (não refazer) — 🔴-A

**Perda silenciosa de tributo no parser NF-e/NFC-e.** `packages/contador-parser/src/parser.ts` `extrairPisCofins` usava `paraNumeroOpcional` (não-estrito) em vBC/pPIS-pCOFINS/vPIS-vCOFINS → valor ilegível virava `undefined` e o crédito (vPIS+vCOFINS) sumia no caminho da Recuperação monofásica.

- **Fix aplicado:** trocadas as 3 chamadas por `paraNumeroOpcionalEstrito(..., "PISCOFINS/...")` + ajuste de import. Mesma guarda já usada em `parser-nfse.ts`/`parser-cte.ts`.
- **Testes:** 2 guardas novos em `scripts/run-parser-tests.mjs` (vPIS `--` e vCOFINS `R$ 3.800,00`). **33/33 verdes + integração.**
- **Estado git:** working tree modificado, **NÃO commitado** (aguarda decisão founder/devops).

---

## 🟡 B — Guard `ibsIndeterminado` assimétrico (must-fix antes de NFS-e real)

**Onde:** `packages/contador-parser/src/parser-nfse.ts` (~linhas 363-380, bloco da guarda 🔴-2).
**Problema:** a guarda só cobre "CBS presente → IBS ausente". Faltam dois caminhos irmãos que passam **sem flag**, sob CST tributado:
- (A) **IBS presente mas CBS federal ausente** → CBS evapora silencioso.
- (B) **cClassTrib tributado, mas CBS e IBS ambos zerados** → reportado como tributação-zero sem sinalizar revisão.

**DoD:**
1. A guarda vira **coerente com o CST/cClassTrib**: se o CST indica tributação, ausência/zero de QUALQUER lado (CBS ou IBS) → marca indeterminado (`cbsIndeterminado`/`ibsIndeterminado`) para revisão humana, nunca reporta zero mudo.
2. Caminho simétrico ao 🔴-2: "X presente sem Y" → `yIndeterminado = true`, `valorY = undefined` (não inventar zero).
3. Testes-guarda espelhando os 🔴-2 existentes para os 2 casos (A) e (B). Build verde.

---

## 🟡 C / D — Lacunas de ICMS (não corrompem; priorizar conforme roadmap)

- **C — NF-e não extrai valor de ICMS.** `parser.ts extrairIcms` lê orig/CST/CSOSN mas **não** baseCalculo/aliquota/valor. Hoje o motor A2 (ICMS-ST) usa CEST/CST, então não quebra — mas vira lacuna quando a Auditoria precisar do ICMS efetivo. **DoD:** estender `extrairIcms` com `paraNumeroOpcionalEstrito` p/ vBC/pICMS/vICMS (mesmo padrão), preservando "ausência legítima". Teste com fixture ICMS00.
- **D — Mapper CT-e descarta o ICMS já extraído.** `paraItensFiscaisCTe` não propaga `doc.icms` para o `ItemFiscal`. **DoD:** levar cst/valor do ICMS do frete ao item (campo já existe no contrato? confirmar) + teste.

---

## 🟢 E — Precisão monetária (float) — dívida técnica, agendar

Valores monetários trafegam como `number` (float). Risco de drift de centavo em **somas** (ex.: agregação de crédito por período na Recuperação — `C2` do doc 56 já prevê SELIC). **DoD (quando tocar agregação financeira):** política única de arredondamento a jusante (centavos, banker's ou meio-acima conforme norma fiscal) — NÃO arredondar na extração (o parser deve preservar o bruto; ver README "Precisão monetária"). Documentar a decisão.

---

## 🧭 Resíduos do MOTOR (A1/A2/A3) — NÃO são bug de código → gate tributarista

Reiterados do gate de 24/Jun (31/31 testes verdes, lógica inalterada). Bloqueiam **acurácia real**, não a build:
1. **Over-match de NCM** no classificador (prefixo curto casa demais). Nota: o **A1 monofásico não tem o cap de prefixo curto que o A2 tem** — alinhar a heurística.
2. **Premissa estadual com UF ausente** (ST assume UF quando não informada).
3. **Banda recomputada divergente** em caso de fronteira.
→ Resolver com **golden-set real rotulado por tributarista** (gate founder, doc 46). Não inventar regra sem rótulo.

---

## ⚠️ Não verificado (honesto, fora do escopo deste handoff)

Conformidade dos layouts IBS/CBS contra o **XSD oficial da NFS-e Nacional** (pode haver layout válido não reconhecido) — exige tributarista + XSD oficial. Golden-set segue **sintético**: nenhum claim de acurácia fiscal real até o gate do tributarista.

---

## Ordem sugerida de execução (Codex)
1. **🟡-B** (must-fix antes de NFS-e real) — simétrico ao 🔴-2, baixo risco.
2. **🟡-C** (ICMS NF-e) se a Auditoria for consumir ICMS efetivo no próximo corte.
3. **🟡-D** (ICMS CT-e no mapper).
4. **🟢-E** quando tocar agregação financeira (Recuperação C2).
5. Motor: aguardar gate tributarista (não é build).
