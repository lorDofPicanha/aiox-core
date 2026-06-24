/**
 * Dados SINTÉTICOS do módulo PARCELAMENTOS (demo navegável — Fase 1).
 *
 * Auto-contido em app/parcelamentos/: NÃO importa do mock real (lib/api.ts) para deixar
 * óbvio que é base sintética e não tocar o acesso único. ~7 clientes com parcelamentos
 * cobrindo o espectro de risco de rescisão (em dia, atenção, iminente, limite atingido)
 * + esferas PGFN/estadual marcadas como "monitoramento manual" (doc 55 §A, §E).
 *
 * Os vencimentos são derivados de uma DATA DE REFERÊNCIA (passada pela page) para que o
 * spread de risco seja determinístico e estável no tempo — a demo sempre mostra um
 * iminente, um com limite atingido, alguns em atenção e em dia. Tudo ILUSTRATIVO.
 *
 * G6 (CONTEXT §5 #4): nada aqui promete evitar cancelamento nem garantir desconto —
 * cada parcelamento carrega um INDÍCIO de risco; a ação é decisão do contador.
 */
import type { EsferaParcelamento, Parcela, ParcelamentoSeed } from "./parcelamentos-model";

/** Subtrai `n` dias de um ISO e devolve ISO (helper sintético determinístico). */
function menosDias(refIso: string, n: number): string {
  const d = new Date(refIso);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString();
}

/** Soma `n` dias a um ISO e devolve ISO. */
function maisDias(refIso: string, n: number): string {
  return menosDias(refIso, -n);
}

/**
 * Gera o histórico de parcelas de um parcelamento sintético.
 *
 * @param refIso   data de referência (hoje, passada pela page).
 * @param total    total de parcelas contratadas.
 * @param valor    valor de cada parcela.
 * @param pagas    quantas parcelas iniciais estão pagas (em dia).
 * @param atrasos  array de OFFSETS (em meses, contados a partir da 1ª não-paga) que estão
 *                 em atraso; cada offset vira uma parcela atrasada com vencimento no passado.
 * @param janelaIdx índices (0-based no array `atrasos`) que devem cair DENTRO da janela de
 *                 salvamento (≤30d de atraso) — vencimento recente. Os demais = atraso antigo.
 */
function gerarParcelas(args: {
  refIso: string;
  total: number;
  valor: number;
  pagas: number;
  atrasos: number;
  janela: number; // quantas das atrasadas ficam dentro da janela (vencimento recente)
}): Parcela[] {
  const { refIso, total, valor, pagas, atrasos, janela } = args;
  const parcelas: Parcela[] = [];
  // Cadência mensal (~30 dias) ancorada para frente a partir do passado.
  for (let i = 0; i < total; i++) {
    const numero = i + 1;
    if (i < pagas) {
      // Parcela paga: venceu no passado, paga em dia.
      const venc = menosDias(refIso, (pagas - i + atrasos) * 30 + 5);
      parcelas.push({
        numero,
        vencimentoIso: venc,
        valor,
        situacao: "paga",
        pagaEmIso: maisDias(venc, 2),
      });
    } else if (i < pagas + atrasos) {
      // Parcela atrasada. A última `janela` das atrasadas vence recentemente (≤30d).
      const ordemAtraso = i - pagas; // 0..atrasos-1
      const dentroJanela = ordemAtraso >= atrasos - janela;
      const diasAtraso = dentroJanela
        ? 8 + ordemAtraso * 3 // recente: poucos dias de atraso
        : 45 + (atrasos - 1 - ordemAtraso) * 30; // antiga: muito atrasada
      parcelas.push({
        numero,
        vencimentoIso: menosDias(refIso, diasAtraso),
        valor,
        situacao: "atrasada",
        pagaEmIso: null,
      });
    } else {
      // Parcela futura: a vencer.
      const ordemFutura = i - (pagas + atrasos);
      parcelas.push({
        numero,
        vencimentoIso: maisDias(refIso, 5 + ordemFutura * 30),
        valor,
        situacao: "a_vencer",
        pagaEmIso: null,
      });
    }
  }
  return parcelas;
}

interface SeedSpec {
  id: string;
  clienteId: string;
  clienteNome: string;
  segmento: string;
  esfera: EsferaParcelamento;
  programa: string;
  total: number;
  valor: number;
  pagas: number;
  atrasos: number;
  janela: number;
  descontoEmRisco: number;
}

/**
 * Especificações dos parcelamentos sintéticos (~7 clientes). O spread cobre todos os
 * níveis de risco. IDs estáveis. Valores ILUSTRATIVOS.
 */
const SPECS: SeedSpec[] = [
  // LIMITE ATINGIDO (3 em atraso) — Simples Nacional. Programa especial → desconto a perder.
  {
    id: "parc-aurora-pertsn",
    clienteId: "cli-aurora-a1",
    clienteNome: "Farmácia Aurora",
    segmento: "Farmácia · Simples Nacional",
    esfera: "federal_sn",
    programa: "PERT-SN (especial, com desconto)",
    total: 60,
    valor: 1_240,
    pagas: 14,
    atrasos: 3,
    janela: 1, // 1 das 3 ainda na janela
    descontoEmRisco: 38_700,
  },
  // IMINENTE (2 em atraso → falta 1) — Simples Nacional ordinário.
  {
    id: "parc-brasa-parcsn",
    clienteId: "cli-brasa-a2",
    clienteNome: "Posto Brasa",
    segmento: "Posto de combustíveis · Simples Nacional",
    esfera: "federal_sn",
    programa: "PARCSN (ordinário)",
    total: 60,
    valor: 2_180,
    pagas: 22,
    atrasos: 2,
    janela: 1, // 1 das 2 ainda na janela de salvamento
    descontoEmRisco: 0, // ordinário não tem desconto
  },
  // IMINENTE com programa especial (RELP) — 2 em atraso, MEI. Desconto significativo a perder.
  {
    id: "parc-cedro-relpmei",
    clienteId: "cli-cedro-a3",
    clienteNome: "Mercado Cedro",
    segmento: "Mercado/varejo · MEI",
    esfera: "federal_mei",
    programa: "RELP-MEI (especial, com desconto)",
    total: 60,
    valor: 320,
    pagas: 9,
    atrasos: 2,
    janela: 0, // ambas fora da janela → atraso consolidado
    descontoEmRisco: 4_950,
  },
  // ATENÇÃO (1 em atraso, dentro da janela) — Simples Nacional.
  {
    id: "parc-douro-parcsn",
    clienteId: "cli-douro-a4",
    clienteNome: "Padaria Douro",
    segmento: "Padaria · Simples Nacional",
    esfera: "federal_sn",
    programa: "PARCSN (ordinário)",
    total: 36,
    valor: 760,
    pagas: 11,
    atrasos: 1,
    janela: 1, // a única atrasada está na janela de salvamento
    descontoEmRisco: 0,
  },
  // EM DIA — Simples Nacional, programa especial (sem atraso, mas com desconto a preservar).
  {
    id: "parc-evora-pertsn",
    clienteId: "cli-evora-a5",
    clienteNome: "Ótica Évora",
    segmento: "Comércio · Simples Nacional",
    esfera: "federal_sn",
    programa: "PERT-SN (especial, com desconto)",
    total: 48,
    valor: 540,
    pagas: 20,
    atrasos: 0,
    janela: 0,
    descontoEmRisco: 12_300,
  },
  // PGFN — monitoramento manual (sem inferência de rescisão; doc 55 §A, §E).
  {
    id: "parc-faro-pgfn",
    clienteId: "cli-faro-a6",
    clienteNome: "Transportes Faro",
    segmento: "Logística · Lucro Presumido",
    esfera: "pgfn",
    programa: "Parcelamento de dívida ativa (PGFN)",
    total: 84,
    valor: 3_410,
    pagas: 16,
    atrasos: 1, // tem atraso, mas NÃO inferimos rescisão (esfera não modelável)
    janela: 0,
    descontoEmRisco: 0,
  },
  // ESTADUAL — monitoramento manual (SEFAZ; doc 55 §E).
  {
    id: "parc-gerez-sefaz",
    clienteId: "cli-gerez-a7",
    clienteNome: "Metalúrgica Gerês",
    segmento: "Indústria · Lucro Real",
    esfera: "estadual",
    programa: "Parcelamento de ICMS (SEFAZ)",
    total: 60,
    valor: 5_900,
    pagas: 31,
    atrasos: 0,
    janela: 0,
    descontoEmRisco: 0,
  },
];

/**
 * Monta a lista de parcelamentos SINTÉTICOS a partir de uma data de referência. Chamada
 * pela page (Server Component) com a data atual — o spread de risco fica estável no tempo.
 */
export function getParcelamentosSinteticos(refIso: string): ParcelamentoSeed[] {
  return SPECS.map((s) => ({
    id: s.id,
    clienteId: s.clienteId,
    clienteNome: s.clienteNome,
    segmento: s.segmento,
    esfera: s.esfera,
    programa: s.programa,
    totalParcelas: s.total,
    valorParcela: s.valor,
    // Próximo vencimento: a 1ª parcela ainda não paga/atrasada (≈ a vencer).
    proximoVencimentoIso: maisDias(refIso, 5),
    descontoEmRisco: s.descontoEmRisco,
    parcelas: gerarParcelas({
      refIso,
      total: s.total,
      valor: s.valor,
      pagas: s.pagas,
      atrasos: s.atrasos,
      janela: s.janela,
    }),
  }));
}
