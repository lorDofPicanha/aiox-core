// Validação do piso de preço com SINAPI/BDI (TCU 2622/2013 + art. 59).
import assert from "node:assert/strict";
import { test } from "node:test";

const { buildPriceFloorAnalysis, classifyObra, TCU_BDI_2622 } = await import("../lib/noyce-bdi.ts");

test("classifyObra: roteia pelo objeto (rodovia/saneamento/energia/default edifícios)", () => {
  assert.equal(classifyObra("Pavimentação asfáltica de via"), "rodovias");
  assert.equal(classifyObra("Ampliação de rede de esgoto"), "saneamento");
  assert.equal(classifyObra("Construção de subestação de energia"), "energia");
  assert.equal(classifyObra("Reforma de escola municipal"), "edificios");
  assert.equal(classifyObra(null), "edificios");
});

test("tabela TCU 2622: edifícios 20,34/22,12/25,00", () => {
  assert.deepEqual(TCU_BDI_2622.edificios, { p25: 20.34, medio: 22.12, p75: 25.0 });
});

test("sem custo direto: estima custo por BDI mediano e calcula a zona exequível", () => {
  const a = buildPriceFloorAnalysis({ valorEstimado: 1000000, objeto: "Reforma de escola" });
  assert.ok(a);
  assert.equal(a.tipo, "edificios");
  assert.equal(a.pisoLegal, 750000); // 75%
  assert.equal(a.faixaGarantia, 850000); // 85%
  // custo direto ≈ 1.000.000 / 1,2212 = 818.864
  assert.ok(Math.abs(a.custoDiretoEstimado - 818864) < 2000, `custo ${a.custoDiretoEstimado}`);
  // piso 750k / custo 818k = 0,916 < 1 → abaixo do custo → alerta
  assert.ok(a.pisoSobreCusto < 1);
  assert.ok(a.alertas.some((x) => /ABAIXO do custo/i.test(x)));
  assert.ok(a.alertas.some((x) => /orçamento analítico.*não extraído|anexe a planilha/i.test(x)));
});

test("lance seguro = max(break-even ENIAC, piso legal); nunca abaixo do custo", () => {
  const a = buildPriceFloorAnalysis({ valorEstimado: 1000000, objeto: "Reforma" });
  // break-even = custo × (1 + 20,34%) = 818.864 × 1,2034 ≈ 985.413  > piso 750k → lanceSeguro = break-even
  assert.ok(a.lanceSeguro >= a.breakEvenEniac);
  assert.ok(a.lanceSeguro > a.pisoLegal, "break-even acima do piso legal → lance seguro é o break-even");
});

test("com custo direto: calcula BDI implícito e flag de orçamento gordo (> 3º quartil)", () => {
  // custo 700k, orçamento 1.000.000 → BDI implícito = 42,9% >> teto 25% (edifícios)
  const a = buildPriceFloorAnalysis({ valorEstimado: 1000000, objeto: "Reforma", custoDireto: 700000 });
  assert.ok(a.bdiEditalPct > 42 && a.bdiEditalPct < 43, `bdi ${a.bdiEditalPct}`);
  assert.equal(a.bdiAcimaParadigma, true);
  assert.ok(a.alertas.some((x) => /ACIMA do teto do paradigma TCU/i.test(x)));
});

test("BDI dentro do paradigma não dispara alerta de orçamento gordo", () => {
  // custo 820k, orçamento 1.000.000 → BDI ≈ 22% (dentro de edifícios 20-25)
  const a = buildPriceFloorAnalysis({ valorEstimado: 1000000, objeto: "Reforma", custoDireto: 819000 });
  assert.equal(a.bdiAcimaParadigma, false);
});

test("sem valor estimado → null (não inventa)", () => {
  assert.equal(buildPriceFloorAnalysis({ valorEstimado: null, objeto: "x" }), null);
});
