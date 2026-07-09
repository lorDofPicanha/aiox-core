/**
 * S7 — Fixtures de PEDIDOS de guia (demo), em arquivo separado.
 *
 * Exemplos de PedidoGuia (um por tipo) que o contador poderia gerar a partir do cockpit — a
 * ENTRADA da ação human-in-loop `gerarGuia`. Datas relativas ao refIso (determinístico). Os
 * valores são ILUSTRATIVOS; a linha digitável resultante é SINTÉTICA (modo fixture).
 *
 * G6: a guia é PREPARADA; emitir/pagar/transmitir é ato do contador/cliente.
 */
import type { PedidoGuia } from "./guias-model";

/** Competência "MM/AAAA" `n` meses antes do refIso (UTC). */
function competenciaAnterior(refIso: string, mesesAtras: number): string {
  const d = new Date(refIso);
  d.setUTCMonth(d.getUTCMonth() - mesesAtras);
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${mm}/${d.getUTCFullYear()}`;
}

/** Vencimento ISO `n` dias após o refIso. */
function vencimentoRelativo(refIso: string, dias: number): string {
  const d = new Date(refIso);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString();
}

/** Pedidos de guia demo (um por tipo) relativos ao refIso. */
export function getPedidosGuiaDemo(refIso: string): PedidoGuia[] {
  return [
    {
      tipo: "DAS-PGDASD",
      clienteId: "a1",
      clienteNome: "Farmácia Aurora",
      documento: "11222333000181",
      competencia: competenciaAnterior(refIso, 1),
      vencimentoIso: vencimentoRelativo(refIso, 12),
      valor: 2340.75,
    },
    {
      tipo: "DARF-SICALC",
      clienteId: "a2",
      clienteNome: "Posto Brasa Combustíveis ME",
      documento: "22333444000172",
      competencia: competenciaAnterior(refIso, 2),
      vencimentoIso: vencimentoRelativo(refIso, 5),
      valor: 1180.4,
    },
    {
      tipo: "DARF-DCTFWEB",
      clienteId: "a3",
      clienteNome: "Mercado Cedro Bebidas SA",
      documento: "33444555000163",
      competencia: competenciaAnterior(refIso, 1),
      vencimentoIso: vencimentoRelativo(refIso, 9),
      valor: 4620.0,
    },
    {
      tipo: "DAS-parcela",
      clienteId: "a2",
      clienteNome: "Posto Brasa Combustíveis ME",
      documento: "22333444000172",
      competencia: competenciaAnterior(refIso, 0),
      vencimentoIso: vencimentoRelativo(refIso, 20),
      valor: 987.31,
    },
  ];
}
