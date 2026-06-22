/**
 * Base SINTÉTICA do módulo Captura (Fase 1) — co-localizada de propósito.
 *
 * Espelha os IDs/nomes do seed do core (seed-from-motor.ts) para manter consistência
 * entre as telas — Farmácia Aurora (…a1), Posto Brasa (…a2), Mercado Cedro (…a3) —
 * mas NÃO importa o core: a Captura é uma demonstração navegável (a varredura real via
 * provider é Fase 5). O status por cliente é DERIVADO das notas (uma fonte só).
 *
 * Esta base é a SEMENTE de sessão: o módulo interativo (CapturaModulo, client) carrega
 * CLIENTES_SEED/NOTAS_SEED no useState e a partir daí tudo (subir nota, toggle, filtros,
 * drill-down, KPIs) acontece em memória — sem I/O, sem persistência, sem core.
 *
 * G6: nada aqui afirma crédito/apuração/multa/prova; só coleta+armazena o insumo.
 */
import {
  type CapturaClienteLinha,
  type ClasseInsumo,
  type ModoCaptura,
  type NotaCapturadaLinha,
} from "./captura-model";

/** IDs do seed (consistência com seed-from-motor.ts). */
export const CLI_FARM = "00000000-0000-4000-8000-0000000000a1";
export const CLI_POSTO = "00000000-0000-4000-8000-0000000000a2";
export const CLI_MERC = "00000000-0000-4000-8000-0000000000a3";

export interface ClienteMeta {
  id: string;
  nome: string;
  documento: string;
  modo: ModoCaptura;
  /** Toggle de captura automática; default OFF é a decisão D2 (captura seletiva). */
  capturaAtiva: boolean;
}

/**
 * Metadados dos 3 clientes demo. A Farmácia captura por upload/XML (◆ 1ª classe);
 * o Posto vem de provider/OCR (◇ 2ª classe, captura_ativa ON na demo); o Mercado
 * está com captura_ativa OFF (default D2) — varredura ainda não iniciada.
 *
 * Exportado como SEMENTE: o módulo interativo copia para o estado de sessão.
 */
export const CLIENTES_SEED: ClienteMeta[] = [
  { id: CLI_FARM, nome: "Farmácia Aurora Ltda (demo)", documento: "11222333000181", modo: "upload", capturaAtiva: true },
  { id: CLI_POSTO, nome: "Posto Brasa Combustíveis ME (demo)", documento: "22333444000172", modo: "provider", capturaAtiva: true },
  { id: CLI_MERC, nome: "Mercado Cedro — Bebidas SA (demo)", documento: "33444555000163", modo: "upload", capturaAtiva: false },
];

const nomeById = new Map(CLIENTES_SEED.map((c) => [c.id, c.nome]));

/** Tipo da nota-semente (sem clienteNome — derivado na hora). */
export type NotaSeed = Omit<NotaCapturadaLinha, "clienteNome">;

/**
 * Notas sintéticas capturadas (NF-e + CT-e). Natureza derivada do papel do cliente
 * na nota (compra = entrada de insumo; venda = saída). Classe de insumo conforme o
 * modo de captura do cliente (upload→XML 1ª; provider→OCR 2ª). Datas em junho/2026.
 *
 * Exportado como SEMENTE: o módulo interativo copia para o estado de sessão.
 */
export const NOTAS_SEED: NotaSeed[] = [
  // Farmácia Aurora — alto SKU, monofásico (upload/XML, ◆ 1ª classe).
  { id: "cap-001", clienteId: CLI_FARM, tipo: "nfe", natureza: "compra", numeroSerie: "184321 / 1", valor: 48230.55, dataIso: "2026-06-19T09:12:00-03:00", classeInsumo: "xml", estagio: "processada" },
  { id: "cap-002", clienteId: CLI_FARM, tipo: "nfe", natureza: "venda", numeroSerie: "009877 / 2", valor: 1290.4, dataIso: "2026-06-19T08:40:00-03:00", classeInsumo: "xml", estagio: "processada" },
  { id: "cap-003", clienteId: CLI_FARM, tipo: "cte", natureza: "compra", numeroSerie: "552130 / 1", valor: 880.0, dataIso: "2026-06-18T16:05:00-03:00", classeInsumo: "xml", estagio: "processada" },
  { id: "cap-004", clienteId: CLI_FARM, tipo: "nfe", natureza: "compra", numeroSerie: "184498 / 1", valor: 22760.9, dataIso: "2026-06-18T11:33:00-03:00", classeInsumo: "xml", estagio: "capturada" },
  { id: "cap-005", clienteId: CLI_FARM, tipo: "nfe", natureza: "venda", numeroSerie: "009902 / 2", valor: 743.18, dataIso: "2026-06-17T14:20:00-03:00", classeInsumo: "xml", estagio: "processada" },

  // Posto Brasa — combustível, bitributação (provider/OCR, ◇ 2ª classe).
  { id: "cap-006", clienteId: CLI_POSTO, tipo: "nfe", natureza: "compra", numeroSerie: "770145 / 5", valor: 156400.0, dataIso: "2026-06-19T07:55:00-03:00", classeInsumo: "ocr", estagio: "processada" },
  { id: "cap-007", clienteId: CLI_POSTO, tipo: "cte", natureza: "compra", numeroSerie: "330920 / 3", valor: 4120.75, dataIso: "2026-06-18T19:48:00-03:00", classeInsumo: "ocr", estagio: "capturada" },
  { id: "cap-008", clienteId: CLI_POSTO, tipo: "nfe", natureza: "venda", numeroSerie: "445012 / 1", valor: 318.9, dataIso: "2026-06-18T18:02:00-03:00", classeInsumo: "ocr", estagio: "processada" },
  { id: "cap-009", clienteId: CLI_POSTO, tipo: "nfe", natureza: "compra", numeroSerie: "770233 / 5", valor: 98215.3, dataIso: "2026-06-17T10:11:00-03:00", classeInsumo: "ocr", estagio: "processada" },
  { id: "cap-010", clienteId: CLI_POSTO, tipo: "cte", natureza: "venda", numeroSerie: "331004 / 3", valor: 2675.0, dataIso: "2026-06-16T15:39:00-03:00", classeInsumo: "ocr", estagio: "capturada" },

  // Mercado Cedro — bebidas, alto SKU (upload/XML, ◆ 1ª classe). Captura recém-ativada
  // em demonstração: poucas notas, ainda chegando.
  { id: "cap-011", clienteId: CLI_MERC, tipo: "nfe", natureza: "compra", numeroSerie: "612880 / 4", valor: 73120.45, dataIso: "2026-06-19T13:27:00-03:00", classeInsumo: "xml", estagio: "processada" },
  { id: "cap-012", clienteId: CLI_MERC, tipo: "nfe", natureza: "venda", numeroSerie: "021455 / 7", valor: 5410.0, dataIso: "2026-06-18T12:14:00-03:00", classeInsumo: "xml", estagio: "capturada" },
  { id: "cap-013", clienteId: CLI_MERC, tipo: "cte", natureza: "compra", numeroSerie: "489210 / 2", valor: 1340.6, dataIso: "2026-06-17T17:50:00-03:00", classeInsumo: "xml", estagio: "processada" },
];

/** Nome do cliente pelo id, a partir da semente (fallback "—"). */
export function nomeClientePorId(clienteId: string): string {
  return nomeById.get(clienteId) ?? "—";
}

/**
 * Hidrata + ordena uma lista de notas-semente: injeta clienteNome (de uma lista de
 * clientes qualquer, para refletir nomes do estado de sessão) e ordena por data desc.
 * Pura — opera sobre o argumento, sem tocar nas sementes. É o que o módulo interativo
 * usa a cada render para montar a tabela a partir do estado atual.
 */
export function hidratarNotas(
  notas: NotaSeed[],
  clientes: ClienteMeta[] = CLIENTES_SEED,
): NotaCapturadaLinha[] {
  const nomes = new Map(clientes.map((c) => [c.id, c.nome]));
  return notas
    .map((n) => ({ ...n, clienteNome: nomes.get(n.clienteId) ?? nomeById.get(n.clienteId) ?? "—" }))
    .sort((a, b) => new Date(b.dataIso).getTime() - new Date(a.dataIso).getTime());
}

/** Lista de notas capturadas da SEMENTE, hidratada e ordenada (compat / SSR estático). */
export function listarNotasCapturadas(): NotaCapturadaLinha[] {
  return hidratarNotas(NOTAS_SEED);
}

/** Classe de insumo predominante (mais frequente) das notas de um cliente. */
export function classePredominante(clienteId: string, notas: NotaSeed[]): ClasseInsumo {
  let xml = 0;
  let ocr = 0;
  for (const n of notas) {
    if (n.clienteId !== clienteId) continue;
    if (n.classeInsumo === "xml") xml += 1;
    else ocr += 1;
  }
  return ocr > xml ? "ocr" : "xml";
}

/** Data da última captura de um cliente (ISO) — null se não há nota. */
export function ultimaCaptura(clienteId: string, notas: NotaSeed[]): string | null {
  const datas = notas
    .filter((n) => n.clienteId === clienteId)
    .map((n) => new Date(n.dataIso).getTime());
  if (datas.length === 0) return null;
  return new Date(Math.max(...datas)).toISOString();
}

/**
 * Status de captura POR CLIENTE — DERIVADO das notas e dos clientes passados (uma fonte
 * só). Pura: recebe o estado de sessão (clientes + notas) e devolve a visão da tabela,
 * com contadores, última captura e classe predominante recalculados na hora.
 */
export function derivarStatusClientes(
  clientes: ClienteMeta[],
  notas: NotaSeed[],
): CapturaClienteLinha[] {
  return clientes.map((c): CapturaClienteLinha => ({
    clienteId: c.id,
    clienteNome: c.nome,
    documento: c.documento,
    modo: c.modo,
    capturaAtiva: c.capturaAtiva,
    notasCapturadas: notas.filter((n) => n.clienteId === c.id).length,
    ultimaCapturaIso: ultimaCaptura(c.id, notas),
    classePredominante: classePredominante(c.id, notas),
  }));
}

/** Status por cliente a partir da SEMENTE (compat / SSR estático). */
export function statusCapturaPorCliente(): CapturaClienteLinha[] {
  return derivarStatusClientes(CLIENTES_SEED, NOTAS_SEED);
}

/** Gera um id sintético de nota único na sessão (não persiste — só p/ React key). */
export function novoIdNota(existentes: NotaSeed[]): string {
  let max = 0;
  for (const n of existentes) {
    const m = /^cap-(\d+)$/.exec(n.id);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return `cap-${String(max + 1).padStart(3, "0")}`;
}
