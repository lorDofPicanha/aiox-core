/**
 * S7 — Testes de GERAÇÃO DE GUIAS: model puro (validação + linha digitável sintética) + adapter
 * em MODO FIXTURE (human-in-loop, ZERO rede).
 *
 * Runner sem framework (espelha saude-fiscal-model.test.mjs): importa .ts DIRETO (Node ≥ 24).
 * Rodar:  node app/ecac/guias/guias-model.test.mjs   (a partir de apps/contador)
 *
 * G6: descreve a guia PREPARADA (sintética); não afirma "pago"/"quitado"/"regularizado".
 */
import {
  TIPO_GUIA,
  codigoBarrasSintetico,
  competenciaValida,
  linhaDigitavelSintetica,
  validarPedidoGuia,
} from "./guias-model.ts";
import { GUIA_SERVICO, GuiasAdapter } from "./guias-adapter.ts";

// ---------------------------------------------------------------------------
// Mini-harness
// ---------------------------------------------------------------------------
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
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    falhas += 1;
    console.error(`  FAIL  ${nome}\n        esperado: ${e}\n        obtido:   ${a}`);
  }
}

async function throwsAsync(fn, nome) {
  total += 1;
  try {
    await fn();
    falhas += 1;
    console.error(`  FAIL  ${nome} (esperava lançar, não lançou)`);
  } catch {
    /* esperado */
  }
}

const HOJE = "2026-07-09T12:00:00.000Z";

function pedido(over = {}) {
  return {
    tipo: "DAS-PGDASD",
    clienteId: "a1",
    clienteNome: "Farmácia Aurora",
    documento: "11222333000181",
    competencia: "06/2026",
    vencimentoIso: "2026-07-20T00:00:00.000Z",
    valor: 2340.75,
    ...over,
  };
}

// ===========================================================================
// S7 — competenciaValida
// ===========================================================================
console.log("── S7 · competenciaValida ──");
ok(competenciaValida("06/2026"), "06/2026 → válida");
ok(competenciaValida("12/2026"), "12/2026 → válida");
ok(!competenciaValida("13/2026"), "13/2026 → inválida (mês > 12)");
ok(!competenciaValida("00/2026"), "00/2026 → inválida (mês < 1)");
ok(!competenciaValida("6/2026"), "6/2026 → inválida (formato)");
ok(!competenciaValida("2026-06"), "2026-06 → inválida (formato)");

// ===========================================================================
// S7 — validarPedidoGuia
// ===========================================================================
console.log("── S7 · validarPedidoGuia ──");
eq(validarPedidoGuia(pedido()), [], "pedido são → sem problemas");
ok(validarPedidoGuia(pedido({ valor: 0 })).length > 0, "valor 0 → problema");
ok(validarPedidoGuia(pedido({ valor: -5 })).length > 0, "valor negativo → problema");
ok(validarPedidoGuia(pedido({ competencia: "13/2026" })).length > 0, "competência inválida → problema");
ok(validarPedidoGuia(pedido({ vencimentoIso: "xx" })).length > 0, "vencimento ilegível → problema");
ok(validarPedidoGuia(pedido({ documento: "" })).length > 0, "documento ausente → problema");

// ===========================================================================
// S7 — linha digitável / código de barras sintéticos (determinísticos)
// ===========================================================================
console.log("── S7 · sintéticos determinísticos ──");
{
  const barras1 = codigoBarrasSintetico(pedido());
  const barras2 = codigoBarrasSintetico(pedido());
  eq(barras1, barras2, "código de barras determinístico (mesma entrada → mesma saída)");
  eq(barras1.length, 44, "código de barras tem 44 dígitos");
  ok(/^\d{44}$/.test(barras1), "código de barras é só dígitos");

  const l1 = linhaDigitavelSintetica(pedido());
  ok(/^[\d.\s]+$/.test(l1), "linha digitável só tem dígitos/pontos/espaços");
  ok(l1 !== linhaDigitavelSintetica(pedido({ valor: 999 })), "valor diferente → linha diferente");
}

// ===========================================================================
// S7 — mapa de serviços cobre os 4 tipos
// ===========================================================================
console.log("── S7 · serviços Integra Contador ──");
for (const tipo of Object.keys(TIPO_GUIA)) {
  ok(Boolean(GUIA_SERVICO[tipo]), `GUIA_SERVICO cobre ${tipo}`);
  ok(Boolean(GUIA_SERVICO[tipo].idSistema && GUIA_SERVICO[tipo].idServico), `${tipo} tem idSistema+idServico`);
}

// ===========================================================================
// S7 — adapter em MODO FIXTURE (human-in-loop, sem rede)
// ===========================================================================
console.log("── S7 · GuiasAdapter (fixture) ──");
{
  // Sem env SERPRO → fixture mode (garantido no ambiente de teste).
  const adapter = new GuiasAdapter();
  ok(adapter.isFixtureMode(), "sem credencial → modo fixture");

  const guia = await adapter.gerarGuia(pedido(), HOJE);
  eq(guia.tipo, "DAS-PGDASD", "guia gerada: tipo preservado");
  eq(guia.competencia, "06/2026", "guia: competência do pedido");
  eq(guia.valor, 2340.75, "guia: valor do pedido");
  eq(guia.sintetica, true, "guia fixture: sintetica = true");
  eq(guia.origem, TIPO_GUIA["DAS-PGDASD"].servico, "guia: origem = serviço Integra");
  ok(/^\d{44}$/.test(guia.codigoBarras), "guia: código de barras 44 dígitos");
  ok(guia.geradaEmIso === HOJE, "guia: geradaEmIso = refIso (determinístico)");
  // G6: não afirma pago/quitado; deixa claro que é preparação.
  ok(!/pago|quitad|regulariz/i.test(guia.observacao), "guia: observação não afirma pago/quitado/regularizado");
  ok(/contador|cliente/i.test(guia.observacao), "guia: observação atribui a ação ao contador/cliente");
}

// Gera os 4 tipos de guia sem erro (todos os serviços Integra cobertos).
{
  const adapter = new GuiasAdapter();
  for (const tipo of Object.keys(TIPO_GUIA)) {
    const guia = await adapter.gerarGuia(pedido({ tipo }), HOJE);
    eq(guia.tipo, tipo, `gerarGuia cobre tipo ${tipo}`);
  }
}

// Pedido inválido → LANÇA (o contador vê o erro; nada é gerado).
{
  const adapter = new GuiasAdapter();
  await throwsAsync(() => adapter.gerarGuia(pedido({ valor: 0 }), HOJE), "pedido inválido → lança");
}

// ===========================================================================
// Resultado
// ---------------------------------------------------------------------------
console.log("");
if (falhas > 0) {
  console.error(`✗ guias-model: ${falhas}/${total} asserção(ões) FALHARAM.`);
  process.exit(1);
}
console.log(`✓ guias-model: ${total}/${total} asserções OK (S7 validação + sintéticos + adapter fixture).`);
process.exit(0);
