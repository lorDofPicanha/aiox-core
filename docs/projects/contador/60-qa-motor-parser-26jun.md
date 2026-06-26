# QA Adversarial — Motor Fiscal + Parser (R4) — Correção/Defensabilidade

**Projeto:** Contador / Apuração Defensável da Reforma
**Agente:** Quinn (Guardian) — `@qa`
**Data:** 2026-06-26
**Escopo:** `packages/contador-motor-fiscal/` (A1/A2/A3) + `packages/contador-parser/` (NF-e/NFC-e R1–R3 + CT-e/NFS-e R4)
**Pista quente investigada:** commits `5970acb9` (parser R4 [QA PENDENTE]) + `ce6ccb35` (fix gate R4: 🔴-1 perda silenciosa + 🔴-2 layout IBS)
**Hierarquia de risco (do prompt):** (1) perda silenciosa de tributo, (2) confiança mal calibrada, (3) extração errada/precisão, (4) cobertura enganosa.

---

## GATE DECISION: 🟡 **CONCERNS**

**Com 1 finding 🔴 confirmado por contra-exemplo que é MUST-FIX antes de qualquer NF-e/NFC-e real.**

- **PASS** para uso sintético/dev/demo (estado atual: golden-set 🔒, XML real já bloqueado pelo gate F1 doc 40).
- **CONCERNS / não liberar dado real** enquanto o 🔴-A não for corrigido: a classe nº 1 de risco (perda silenciosa de tributo) que o commit `ce6ccb35` afirma ter fechado **continua presente no caminho mais comum** (parser NF-e/NFC-e). O fix foi aplicado a CT-e e NFS-e, mas **não** ao parser de mercadoria — onde a maior parte do volume entra.

Justificativa do CONCERNS (não FAIL): a arquitetura está sólida, o helper estrito já existe (`paraNumeroOpcionalEstrito`), e a correção é trivial e isolada (trocar 3 chamadas). Não é PASS porque o risco nº 1 está **confirmado** no caminho principal.

---

## Findings

### 🔴-A — Perda silenciosa de tributo no parser NF-e/NFC-e (CONFIRMADO por contra-exemplo) — CASO IRMÃO do 🔴-1, NÃO corrigido

**Arquivo:** `packages/contador-parser/src/parser.ts:228-231` (`extrairPisCofins`)

```ts
const baseCalculo = paraNumeroOpcional(asString(grupo.vBC));
const aliquota = paraNumeroOpcional(asString(grupo.pPIS) ?? asString(grupo.pCOFINS));
const valor = paraNumeroOpcional(asString(grupo.vPIS) ?? asString(grupo.vCOFINS));
```

O commit `ce6ccb35` criou `paraNumeroOpcionalEstrito` (lança `ParseError` quando o valor está **presente mas ilegível**) e o aplicou em `parser-nfse.ts` (IBS/CBS + PIS/COFINS retido) e `parser-cte.ts` (ICMS). **Mas o parser de NF-e/NFC-e — o documento de maior volume — continua usando a variante NÃO-estrita `paraNumeroOpcional`** nos campos monetários/alíquota de PIS/COFINS. É exatamente o "caso irmão da mesma classe" que o prompt pediu para caçar.

**Por que é risco fiscal (classe nº 1):** num DF-e, um valor de tributo presente porém não-numérico é **corrupção**, não ausência. O próprio doc do helper (`helpers.ts:108-114`) diz isso. Com `paraNumeroOpcional`, `<vPIS>--</vPIS>` ou `<vCOFINS>R$ 3.800,00</vCOFINS>` viram `undefined` e somem; a jusante são lidos como "tributo zero / não informado". No caso de uso central da Recuperação monofásica, o crédito recuperável = PIS/COFINS pago indevidamente = `vPIS + vCOFINS` — exatamente os campos que evaporam. Viola §5.3 (falso-positivo silencioso) e §5.4 (apuração defensável). É a falha mais grave que um laudo de boa-fé pode ter.

**Contra-exemplo executado** (NF-e revenda combustível, `dist/parser.js` + `dist/mapper.js`):
- entrada `<vPIS>--</vPIS>` → `recuperacao.pis.valor` = **undefined** (sumiu, sem erro)
- entrada `<vCOFINS>R$ 3.800,00</vCOFINS>` (formatação BR realista de ERP) → `recuperacao.cofins.valor` = **undefined** (sumiu, sem erro)
- `pPIS`/`vBC` válidos foram lidos; **só o valor do tributo desapareceu** → quadro pior que zero explícito: parece consistente mas o imposto pago não está lá.

**Lacuna de teste que escondeu:** existem testes-guarda "🔴-1 NFS-e: vCBS presente mas não-numérico" e "🔴-1 CT-e: vICMS presente mas não-numérico" — **mas nenhum** "🔴-1 NF-e: vPIS/vCOFINS presente mas não-numérico". A ausência do teste no caminho principal mascarou o caso irmão (finding tipo 4 da hierarquia).

**Correção sugerida:** trocar as 3 chamadas em `extrairPisCofins` por `paraNumeroOpcionalEstrito(..., "PIS/vBC" | "PIS/pPIS" | "PIS/vPIS")` (e correlatos COFINS), espelhando parser-nfse/parser-cte. Adicionar 2 testes-guarda NF-e (vPIS e vCOFINS corrompidos → `ParseError ESTRUTURA_INVALIDA`). Custo: ~5 linhas + 2 testes.

---

### 🟡-B — Guard `ibsIndeterminado` é assimétrico: CBS federal pode evaporar sem flag (CONFIRMADO por contra-exemplo) — 🔴-2 incompleto

**Arquivo:** `packages/contador-parser/src/parser-nfse.ts:369-370`

```ts
const temCbs = valorCbs !== undefined || aliquotaCbs !== undefined;
const ibsIndeterminado = temCbs && aliquotaIbs === undefined && valorIbs === undefined;
```

O fix 🔴-2 protege **apenas** a direção "CBS presente → IBS ausente". As direções inversa e bilateral não disparam flag:

**Contra-exemplos executados** (NFS-e, CST=00 = tributada integral, cClassTrib=000001):
- **CASO A** — IBS presente (UF+Mun = R$1.050) mas **CBS ausente** → `ibsCbs` sem `ibsIndeterminado`, **CBS federal sumiu silencioso**. Sob CST 00 a CBS deveria existir.
- **CASO B** — cClassTrib de tributação + CST 00, mas **CBS e IBS ambos ausentes/zero** → `{cClassTrib, cst, baseCalculo}` sem nenhum valor de tributo e **sem flag**. Item "tributado" com tributo zero mudo.
- **CASO C** (controle) — CBS presente, IBS ausente → `ibsIndeterminado:true` ✓ (funciona).

**Por que é risco fiscal:** CBS é o tributo **federal** central da Reforma; sua ausência silenciosa sob um CST de tributação integral é a mesma classe nº 1 de perda silenciosa, só que na direção que o guard não cobre. Em regime integral CBS e IBS são co-presentes; "CST tributado + tributo ausente" deveria ir para revisão humana, não virar zero mudo.

**Correção sugerida:** tornar o guard **coerente com o CST/cClassTrib** em vez de unilateral. Heurística mínima: se o CST/cClassTrib indica tributação (não é imune/isento/alíq-zero) e **qualquer** dos pares (CBS, IBS) está ausente → `ibsIndeterminado=true`. Isto exige uma micro-tabela de CST→"espera tributo", que de todo modo é gate do tributarista (validação contra o XSD oficial 12/02/2026 já está marcada como pendência). Mínimo viável imediato: `ibsIndeterminado = (temCbs !== temIbs)` (XOR — um lado presente e o outro não) **OU** `(temTributacaoEsperada && !temCbs && !temIbs)`.

---

### 🟡-C — Parser NF-e não extrai base/alíquota/valor de ICMS (lacuna de cobertura, não corrupção)

**Arquivo:** `packages/contador-parser/src/parser.ts:196-214` (`extrairIcms`) + `types.ts:42-49` (`TributoIcms`)

O `extrairIcms` da NF-e extrai apenas `origem`/`cst`/`simplesNacional`. **Não lê vBC/pICMS/vICMS** (o tipo `TributoIcms` da mercadoria nem tem esses campos — só `TributoIcmsTransporte` do CT-e tem). Não é corrupção silenciosa (o campo não existe, não há valor sendo zerado), mas é **lacuna**: o ICMS efetivamente destacado na NF-e de mercadoria não chega ao core.

**Por que importa:** o motor A2 (ICMS-ST) hoje detecta divergência por CEST/NCM/CST — não pelo valor — então a lacuna **não quebra A2 hoje**. Mas qualquer cálculo futuro de crédito de ICMS na mercadoria (e a conferência valor-declarado vs valor-esperado) fica sem insumo. Registrar como dívida técnica consciente, não bug.

**Correção sugerida:** quando a Recuperação/Auditoria de ICMS de mercadoria entrar no roadmap, estender `TributoIcms` com base/alíquota/valor (via `paraNumeroOpcionalEstrito`) espelhando o CT-e. Sem urgência enquanto A2 for só CEST/CST.

---

### 🟡-D — Mapper do CT-e descarta o ICMS extraído (lacuna semântica)

**Arquivo:** `packages/contador-parser/src/mapper.ts:125-147` (`paraItensFiscaisCTe`)

O `parser-cte.ts` extrai corretamente `icms.{baseCalculo,aliquota,valor}` do frete, mas `paraItensFiscaisCTe` mapeia só `cst` e `valor: doc.valorTotalPrestacao` para `ItemFiscalRecuperacao` — **o valor/base/alíquota de ICMS do frete são descartados** na conversão ao contrato do motor (o tipo `ItemFiscalRecuperacao` não tem campo de ICMS). O crédito de ICMS de frete (um crédito real) fica sem trilha quando se consome a via mapper. O dado existe em `DocumentoTransporte.icms` (quem consumir o documento direto tem acesso); só não sobrevive ao mapper.

**Correção sugerida:** decisão de produto — se o crédito de ICMS-frete entrar no escopo, o contrato do motor precisa de um portador para ICMS de transporte. Hoje aceitável como limitação documentada (consistente com FF-1: não forçar molde). Nota, não bug.

---

### 🟢-E — Precisão monetária em ponto flutuante (centavos)

**Arquivo:** `helpers.ts:86-131` (`paraNumero*` usam `Number()`); `parser-nfse.ts:390-402` (`somarOpcional` faz `(na ?? 0) + (nb ?? 0)`).

Valores monetários são `number` (float IEEE-754), não inteiros de centavos. A soma IBS UF+Mun (`somarOpcional`) e qualquer agregação a jusante pode acumular drift de centavo (ex.: `0.1+0.2`). Nos contra-exemplos os valores 2-casas somaram exato, mas em lote real o drift aparece em apuração/dossiê. Para um produto cujo moat é defensabilidade, recomenda-se padronizar centavos como inteiro ou arredondar explicitamente a 2 casas nas somas/totais.

**Correção sugerida:** arredondar a 2 casas nas operações de soma monetária (ou inteiros de centavos no contrato). 🟢 menor; não urgente, mas registrar.

---

## Motor fiscal (A1/A2/A3) — reverificado, sem regressão nesta janela

O motor (`index.ts`) está **inalterado** desde o gate anterior (commits `fd607ae7` A1/A3, `ba6c4621` A2; nada novo). 31/31 testes do motor + 31/31 do parser verdes em 2026-06-26. Os 3 resíduos do gate A2 de 24/Jun **permanecem válidos e não-corrigidos** (são gate tributarista, não bug de código):

1. 🔴(tributarista) **Over-match NCM** em listas extensas (materiais-construção 3917/3925; autopeças 8708) — mitigado pelo rebaixamento de banda, mas precisa poda por UF.
2. 🔴(tributarista) **Premissa estadual ausente**: ST e parte da monofasia são por UF e o motor não tem UF do fato gerador. `st-combustiveis` segue `confiancaBase: alta` apesar da LC 192/2022 (monofasia ad rem). Rebaixar combustível ou não auto-aprovar.
3. 🟡 **Banda recomputada em 2 lugares** com cortes divergentes (motor `derivarBanda` 0.7/0.85 vs consumidor `mock-client` 0.75/0.9) — consumidor deve PROPAGAR `bandaConfianca`/`bloqueiaAutoAprovacao`, não recomputar.

**Confiança calibrada (A3) — avaliação adversarial:** os fatores são explícitos e auditáveis (não é heurística fixa disfarçada). O ponto a vigiar: `base` por especificidade (ncm_exato 0.8 / ncm_prefixo 0.62 / sem_ncm 0.4) + `cstCoerente` 0.12 quando o CST incoerente É o indício. Isso pode levar um match por **prefixo curto** de NCM (over-match) a 0.62+0.12+materialidade → ≥0.74 = banda média/não-bloqueia. O cap A2 de NCM-só em ≤0.62 mitiga ST, mas o A1 monofásico **não tem cap equivalente para prefixo curto** → um prefixo NCM de 2 dígitos com CST incoerente pode escapar do bloqueio. Recomendo (já apontado em 24/Jun) cap análogo ao A2 para match de prefixo curto no A1. Não é novo nesta janela; reitero.

---

## O que NÃO deu para verificar (honestidade)

- **Conformidade com o XSD oficial** da NFS-e Nacional (12/02/2026) e do MOC CT-e: os layouts aceitos (`gIBSCBS` aninhado vs `IBSCBS` direto, fallback `gIBS` único, posição de `vBC`) são **heurísticas plausíveis**, não validadas contra o schema oficial. O próprio commit marca isso como gate do tributarista. Suspeita a confirmar: pode haver layout válido não reconhecido (evaporação de IBS/CBS por estrutura) **ou** layout inválido aceito.
- **Golden-set real** continua 🔒 (sintético). Nenhum claim de acurácia fiscal real é sustentável (consistente com o gate F1 doc 40).
- **Comportamento sobre XML real de produção** (encoding Latin-1 vs UTF-8, namespaces exóticos, assinaturas reais): só fixtures sintéticas foram exercitadas.

---

## Recomendação de próximo passo (ordem)

1. **MUST-FIX 🔴-A** antes de qualquer NF-e/NFC-e real: trocar `extrairPisCofins` (parser.ts) para `paraNumeroOpcionalEstrito` + 2 testes-guarda. ~5 linhas. Handoff ao Codex.
2. **🟡-B**: tornar `ibsIndeterminado` coerente com CST (XOR mínimo agora; tabela CST→tributação no gate tributarista).
3. Reiterar ao founder os **3 resíduos do motor** (over-match NCM, premissa UF, banda divergente) + cap A1 para prefixo curto — são gate tributarista, não código.
4. 🟡-C/🟡-D/🟢-E: registrar como dívida técnica consciente; sem urgência no estágio atual.

— Quinn, guardião da qualidade 🛡️
