/**
 * Testes da CAMADA DE RECONCILIAÇÃO do Health Score (S12) — agregarSinalCore + montarEntradas.
 *
 * Estes são puros (recebem fila/mapa/rótulos por parâmetro), extraídos para health-score-reconcile.ts
 * justamente para serem testáveis sem tocar api/provider. Runner .mjs → .ts (type-stripping Node 24),
 * espelha health-score-model.test.mjs.
 *
 * Cobre o GAP do gate @qa (🔴-2): a reconciliação não tinha nenhuma asserção. Aqui travamos:
 *  - agregação por cliente (contagens, materialidade, baixa confiança, divergência cClassTrib);
 *  - join core×e-CAC via mapa explícito;
 *  - core sem contraparte e-CAC → ecac null (semLadoEcac a jusante);
 *  - cliente só-e-CAC → entra com core null e id `ecac:<id>`, rotulado;
 *  - cliente core fora do mapa → ecac null (não casa por acidente).
 *
 * Rodar:  node app/saude-carteira/health-score-reconcile.test.mjs
 */
import { agregarSinalCore, montarEntradas } from "./health-score-reconcile.ts";

let falhas = 0;
let total = 0;
function ok(cond, nome) {
  total += 1;
  if (!cond) {
    falhas += 1;
    console.error(`  FAIL  ${nome}`);
  }
}
function eq(actual, expected, nome) {
  total += 1;
  if (actual !== expected) {
    falhas += 1;
    console.error(`  FAIL  ${nome} — esperado ${JSON.stringify(expected)}, veio ${JSON.stringify(actual)}`);
  }
}

/** FilaLinha mínima (os campos que agregarSinalCore lê). */
function linha(over) {
  return {
    clienteId: "cli-1",
    tipoDivergencia: "monofasico_nao_aproveitado",
    materialidade: 1000,
    bloqueiaAutoAprovacao: false,
    ...over,
  };
}

console.log("── S12 · agregarSinalCore ──");

// Agrega múltiplas linhas do MESMO cliente: contagens, soma de materialidade, flags.
{
  const m = agregarSinalCore([
    linha({ clienteId: "c1", materialidade: 1000, bloqueiaAutoAprovacao: true, tipoDivergencia: "cclasstrib_divergente" }),
    linha({ clienteId: "c1", materialidade: 2500, bloqueiaAutoAprovacao: false, tipoDivergencia: "monofasico_nao_aproveitado" }),
    linha({ clienteId: "c2", materialidade: 500, bloqueiaAutoAprovacao: true, tipoDivergencia: "cclasstrib_divergente" }),
  ]);
  const c1 = m.get("c1");
  eq(c1.indiciosAbertos, 2, "c1: 2 indícios abertos");
  eq(c1.indiciosBaixaConfianca, 1, "c1: 1 indício de baixa confiança (bloqueia)");
  eq(c1.materialidadeEmDisputa, 3500, "c1: materialidade somada (1000+2500)");
  eq(c1.divergenciasCclasstrib, 1, "c1: 1 divergência cClassTrib");
  const c2 = m.get("c2");
  eq(c2.indiciosAbertos, 1, "c2: 1 indício");
  eq(c2.divergenciasCclasstrib, 1, "c2: 1 divergência cClassTrib");
}

// Fila vazia → mapa vazio.
eq(agregarSinalCore([]).size, 0, "fila vazia → 0 clientes");

console.log("── S12 · montarEntradas (reconciliação) ──");

const sinalEcac = (over) => ({
  prazosNoLimite: 0,
  prazosUrgentes: 0,
  cndsVencidas: 0,
  cndsAVencer: 0,
  mensagensCriticasNaoLidas: 0,
  ...over,
});

// Cenário base: 2 clientes core (A reconciliado, B fora do mapa) + 1 só-e-CAC (Z).
const fila = [
  linha({ clienteId: "core-A", materialidade: 5000, tipoDivergencia: "cclasstrib_divergente" }),
  linha({ clienteId: "core-B", materialidade: 800 }),
];
const nomesCore = new Map([
  ["core-A", { nome: "Empresa A", documento: "11111111000111" }],
  ["core-B", { nome: "Empresa B", documento: "22222222000122" }],
]);
const ecacPorId = new Map([
  ["e-A", sinalEcac({ cndsVencidas: 2 })],
  ["e-Z", sinalEcac({ prazosNoLimite: 1 })],
]);
const mapa = { "core-A": "e-A" }; // só A reconcilia; B não está no mapa
const rotulosEcac = new Map([["e-Z", { nome: "Empresa Z (só e-CAC)", documento: "99999999000199" }]]);

const entradas = montarEntradas(fila, nomesCore, ecacPorId, mapa, rotulosEcac);
const byId = new Map(entradas.map((e) => [e.clienteId, e]));

// A: reconciliado → tem os dois lados.
{
  const a = byId.get("core-A");
  ok(a.core !== null, "A: lado core presente");
  ok(a.ecac !== null, "A: lado e-CAC presente (reconciliado via mapa)");
  eq(a.ecac.cndsVencidas, 2, "A: sinal e-CAC veio do id mapeado (e-A)");
  eq(a.documento, "11111111000111", "A: rotulado pelo core");
}

// B: core sem entrada no mapa → ecac null (não casa por acidente).
{
  const b = byId.get("core-B");
  ok(b.core !== null, "B: lado core presente");
  eq(b.ecac, null, "B: sem reconciliação → ecac null (semLadoEcac a jusante)");
}

// Z: só e-CAC → entra com core null, id prefixado, rotulado.
{
  const z = byId.get("ecac:e-Z");
  ok(z !== undefined, "Z: cliente só-e-CAC aparece (carteira completa)");
  eq(z.core, null, "Z: sem lado core");
  eq(z.ecac.prazosNoLimite, 1, "Z: sinal e-CAC preservado");
  eq(z.clienteNome, "Empresa Z (só e-CAC)", "Z: rotulado por rotulosEcac");
}

// e-A foi CONSUMIDO por A → não deve reaparecer como cliente só-e-CAC.
eq(entradas.filter((e) => e.clienteId === "ecac:e-A").length, 0, "e-A consumido por A não duplica");
eq(entradas.length, 3, "total = 2 core + 1 só-e-CAC (sem duplicar o reconciliado)");

// Mapa apontando para id e-CAC inexistente → ecac null (robusto, sem throw).
{
  const e2 = montarEntradas(
    [linha({ clienteId: "core-A" })],
    new Map([["core-A", { nome: "A", documento: "1" }]]),
    new Map(),
    { "core-A": "e-inexistente" },
    new Map(),
  );
  eq(e2[0].ecac, null, "mapa → id e-CAC inexistente → ecac null (sem quebrar)");
}

// ---------------------------------------------------------------------------
console.log("");
if (falhas > 0) {
  console.error(`✗ health-score-reconcile: ${falhas}/${total} asserção(ões) FALHARAM.`);
  process.exit(1);
}
console.log(`✓ health-score-reconcile: ${total}/${total} asserções OK (agregação + reconciliação).`);
process.exit(0);
