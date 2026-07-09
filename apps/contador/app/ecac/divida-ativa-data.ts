/**
 * S6 — Dados SINTÉTICOS de DÍVIDA ATIVA (PGFN/Regularize) — demo navegável do cockpit.
 *
 * Auto-contido em app/ecac/: NÃO importa do core nem de lib/api.ts. Reaproveita os 3 clientes da
 * carteira (mesmos documentos do e-CAC) e cobre o espectro do monitor: exclusão iminente (≤7d),
 * janela aberta (≤75d), monitorado (parcelamento em dia), inscrição sem parcelamento, e uma
 * inscrição de DÍVIDA ATIVA DO FGTS (natureza migrada Caixa→PGFN em 01/06/2026).
 *
 * Datas derivadas de refIso (determinístico). G6: cada item é um INDÍCIO; nada aqui afirma
 * "regularizado"/"quitado". Valores ILUSTRATIVOS.
 */
import type { DividaAtivaBruta } from "./divida-ativa-model";

/** Soma `n` dias a um ISO e devolve ISO (helper sintético determinístico). */
function maisDias(refIso: string, n: number): string {
  const d = new Date(refIso);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString();
}

interface DividaSpec {
  id: string;
  clienteId: string;
  clienteNome: string;
  documento: string;
  inscricao: string;
  natureza: DividaAtivaBruta["natureza"];
  situacao: DividaAtivaBruta["situacao"];
  valorConsolidado: number;
  inscritaHaDias: number;
  parcelamento: {
    numero: string;
    programa: string;
    inadimplente: boolean;
    /** Offset (dias a partir do refIso) do prazo de exclusão; null = sem countdown. */
    prazoExclusaoDias: number | null;
  } | null;
}

const DIVIDA_SPECS: DividaSpec[] = [
  // Posto Brasa (a2): inscrição União com exclusão IMINENTE (≤7d) — pior caso.
  {
    id: "da-a2-uniao-1",
    clienteId: "a2",
    clienteNome: "Posto Brasa Combustíveis ME",
    documento: "22333444000172",
    inscricao: "70.6.26.000123-45",
    natureza: "uniao",
    situacao: "parcelada",
    valorConsolidado: 148230.55,
    inscritaHaDias: 400,
    parcelamento: {
      numero: "SISPAR-2026-0001",
      programa: "Negociação PGFN (SISPAR)",
      inadimplente: true,
      prazoExclusaoDias: 5, // crítico (≤7)
    },
  },
  // Posto Brasa (a2): dívida ativa do FGTS (natureza migrada) com janela ABERTA (≤75d).
  {
    id: "da-a2-fgts-1",
    clienteId: "a2",
    clienteNome: "Posto Brasa Combustíveis ME",
    documento: "22333444000172",
    inscricao: "FG.6.26.000987-00",
    natureza: "fgts",
    situacao: "parcelada",
    valorConsolidado: 32760.1,
    inscritaHaDias: 120,
    parcelamento: {
      numero: "SISPAR-2026-0002",
      programa: "Parcelamento FGTS (PGFN/Regularize)",
      inadimplente: true,
      prazoExclusaoDias: 40, // aviso (≤75)
    },
  },
  // Mercado Cedro (a3): inscrição União PARCELADA e em dia → monitorado.
  {
    id: "da-a3-uniao-1",
    clienteId: "a3",
    clienteNome: "Mercado Cedro Bebidas SA",
    documento: "33444555000163",
    inscricao: "70.6.25.000555-10",
    natureza: "uniao",
    situacao: "parcelada",
    valorConsolidado: 58900.0,
    inscritaHaDias: 220,
    parcelamento: {
      numero: "SISPAR-2025-0777",
      programa: "Parcelamento convencional",
      inadimplente: false,
      prazoExclusaoDias: null, // monitorado (sem countdown)
    },
  },
  // Mercado Cedro (a3): inscrição não tributária SEM parcelamento vinculado.
  {
    id: "da-a3-nt-1",
    clienteId: "a3",
    clienteNome: "Mercado Cedro Bebidas SA",
    documento: "33444555000163",
    inscricao: "NT.6.24.000012-99",
    natureza: "nao_tributaria",
    situacao: "ativa",
    valorConsolidado: 4210.75,
    inscritaHaDias: 640,
    parcelamento: null, // sem_parcelamento
  },
];

/** Monta as inscrições SINTÉTICAS de dívida ativa a partir de uma data de referência. */
export function getDividasAtivasSinteticas(refIso: string): DividaAtivaBruta[] {
  return DIVIDA_SPECS.map((s) => ({
    id: s.id,
    clienteId: s.clienteId,
    clienteNome: s.clienteNome,
    documento: s.documento,
    inscricao: s.inscricao,
    natureza: s.natureza,
    situacao: s.situacao,
    valorConsolidado: s.valorConsolidado,
    dataInscricaoIso: maisDias(refIso, -s.inscritaHaDias),
    parcelamentoVinculado: s.parcelamento
      ? {
          numero: s.parcelamento.numero,
          programa: s.parcelamento.programa,
          inadimplente: s.parcelamento.inadimplente,
          prazoExclusaoIso:
            s.parcelamento.prazoExclusaoDias == null
              ? null
              : maisDias(refIso, s.parcelamento.prazoExclusaoDias),
        }
      : null,
  }));
}
