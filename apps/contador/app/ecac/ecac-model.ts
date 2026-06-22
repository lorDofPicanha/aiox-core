/**
 * Read model + dados SINTÉTICOS do módulo e-CAC ("a mina", D9 · CONTEXT §3).
 *
 * e-CAC é um ADD-ON premium, NÃO o core. A tela é um DIAGNÓSTICO READ-ONLY em lote
 * da SITUAÇÃO FISCAL DA CARTEIRA (não da nota): caixa postal, CNDs/certidões e
 * ausência de declarações de TODAS as empresas numa tela só. Resolve a dor de o
 * contador entrar no e-CAC cliente-por-cliente (procuração), 100×.
 *
 * Co-localizado em app/ecac/ de PROPÓSITO: este módulo é AUTO-CONTIDO. NÃO toca
 * lib/api.ts, packages/contador-api-client, components/* nem globals.css. Os dados
 * são sintéticos e vivem aqui — a consulta real (Integra Contador / SERPRO) só chega
 * na Fase 7 (exige contrato SERPRO + procurações eletrônicas homologadas).
 *
 * G6 (linguagem segura, doc 45): nada aqui afirma "crédito garantido", "apuração
 * correta", "elimina multa" nem "prova jurídica plena". e-CAC só MOSTRA a situação
 * fiscal extraída do portal; não promete resolver, regularizar nem zerar risco. É
 * leitura — a ação (parcelar, contestar, declarar) é ato do contador.
 */
import { BANDA_CONFIANCA, type StatusView } from "@/lib/status";

/** Situação de uma certidão (CND) ou obrigação no e-CAC — sempre redundante (cor+ícone+label). */
export type SituacaoCertidao = "regular" | "pendente" | "vencida";

/** Apresentação de cada situação (DESIGN §3: cor + glyph + label; nunca só matiz). */
export const SITUACAO_VIEW: Record<SituacaoCertidao, StatusView> = {
  regular: { variant: "success", glyph: "▲", label: "Regular" },
  pendente: { variant: "warning", glyph: "●", label: "Pendente" },
  vencida: { variant: "danger", glyph: "▼", label: "Vencida" },
};

/** Severidade (pior primeiro) para detectar "tem pendência" e contar KPIs. */
const SITUACAO_SEVERIDADE: Record<SituacaoCertidao, number> = {
  vencida: 0,
  pendente: 1,
  regular: 2,
};

/** Uma linha da carteira: a situação fiscal consolidada de UM cliente no e-CAC. */
export interface EcacLinha {
  clienteId: string;
  clienteNome: string;
  documento: string;
  /** Caixa postal e-CAC: nº de mensagens novas (não lidas). */
  mensagensNovas: number;
  /** CND Federal / PGFN (Receita + dívida ativa da União). */
  cndFederal: SituacaoCertidao;
  /** CND Estadual (ICMS/SEFAZ). */
  cndEstadual: SituacaoCertidao;
  /** CND Trabalhista (CNDT/TST). */
  cndTrabalhista: SituacaoCertidao;
  /** Regularidade FGTS (CRF/Caixa). */
  fgts: SituacaoCertidao;
  /** Ausência de declaração(ões) detectada(s) no e-CAC (omissão de DCTF/EFD/etc.). */
  ausenciaDeclaracao: boolean;
  /** Quando esta situação foi lida do portal (sintético — render). */
  consultadoEm: string;
}

/** Dados SINTÉTICOS da carteira (3 clientes demo — IDs/nomes exatos do brief). */
export const CARTEIRA_ECAC: EcacLinha[] = [
  {
    clienteId: "a1",
    clienteNome: "Farmácia Aurora",
    documento: "11222333000181",
    mensagensNovas: 2,
    cndFederal: "regular",
    cndEstadual: "regular",
    cndTrabalhista: "regular",
    fgts: "regular",
    ausenciaDeclaracao: false,
    consultadoEm: "2026-06-22T08:10:00-03:00",
  },
  {
    clienteId: "a2",
    clienteNome: "Posto Brasa Combustíveis ME",
    documento: "44555666000172",
    mensagensNovas: 5,
    cndFederal: "vencida",
    cndEstadual: "pendente",
    cndTrabalhista: "regular",
    fgts: "pendente",
    ausenciaDeclaracao: true,
    consultadoEm: "2026-06-22T08:10:00-03:00",
  },
  {
    clienteId: "a3",
    clienteNome: "Mercado Cedro Bebidas SA",
    documento: "77888999000163",
    mensagensNovas: 0,
    cndFederal: "regular",
    cndEstadual: "vencida",
    cndTrabalhista: "pendente",
    fgts: "regular",
    ausenciaDeclaracao: false,
    consultadoEm: "2026-06-22T08:10:00-03:00",
  },
];

/** As 4 certidões de uma linha, em ordem de exibição (para varrer pior situação). */
export function certidoesDe(l: EcacLinha): SituacaoCertidao[] {
  return [l.cndFederal, l.cndEstadual, l.cndTrabalhista, l.fgts];
}

/** Pior situação de certidão da linha (define o resumo do cliente). */
export function piorSituacao(l: EcacLinha): SituacaoCertidao {
  return certidoesDe(l).reduce((pior, s) =>
    SITUACAO_SEVERIDADE[s] < SITUACAO_SEVERIDADE[pior] ? s : pior,
  );
}

/**
 * Tem alguma pendência fiscal? (qualquer CND vencida/pendente, caixa postal não lida
 * ou ausência de declaração). É o filtro/destaque "quem tem pendência" do brief.
 */
export function temPendencia(l: EcacLinha): boolean {
  return (
    l.mensagensNovas > 0 ||
    l.ausenciaDeclaracao ||
    certidoesDe(l).some((s) => s !== "regular")
  );
}

/** Resumo da pendência da linha em frases curtas e G6-safe (o "por quê"). */
export function motivosPendencia(l: EcacLinha): string[] {
  const out: string[] = [];
  if (l.mensagensNovas > 0) {
    out.push(`${l.mensagensNovas} mensagem(ns) não lida(s) na caixa postal`);
  }
  const vencidas = certidoesDe(l).filter((s) => s === "vencida").length;
  const pendentes = certidoesDe(l).filter((s) => s === "pendente").length;
  if (vencidas > 0) out.push(`${vencidas} certidão(ões) vencida(s)`);
  if (pendentes > 0) out.push(`${pendentes} certidão(ões) pendente(s)`);
  if (l.ausenciaDeclaracao) out.push("ausência de declaração detectada");
  return out;
}

/** KPIs do topo: contagens da dor (caixa postal, CNDs, ausência de declaração). */
export interface EcacResumo {
  total: number;
  comCaixaNaoLida: number;
  comCndIrregular: number;
  comAusenciaDeclaracao: number;
}

export function resumoCarteira(linhas: EcacLinha[]): EcacResumo {
  return {
    total: linhas.length,
    comCaixaNaoLida: linhas.filter((l) => l.mensagensNovas > 0).length,
    comCndIrregular: linhas.filter((l) =>
      certidoesDe(l).some((s) => s !== "regular"),
    ).length,
    comAusenciaDeclaracao: linhas.filter((l) => l.ausenciaDeclaracao).length,
  };
}

/** Apresentação da caixa postal (badge redundante: nº + estado lido/não-lido). */
export function caixaView(mensagensNovas: number): StatusView {
  return mensagensNovas > 0
    ? { variant: "warning", glyph: "✉", label: `${mensagensNovas} nova(s)` }
    : { variant: "neutral", glyph: "✓", label: "Lida" };
}

/** Apresentação de ausência de declaração (badge redundante). */
export function ausenciaView(ausente: boolean): StatusView {
  return ausente
    ? { variant: "danger", glyph: "!", label: "Sim" }
    : { variant: "success", glyph: "▲", label: "Não" };
}

// Reexporta para a tela poder usar a paleta de bandas se precisar (mantém consistência
// visual com Carteira/Fila sem duplicar o mapa de status).
export { BANDA_CONFIANCA };
