/**
 * Read model das telas Carteira (semáforo) + Fila do dia (F1.3).
 *
 * NÃO toca em lib/api.ts (acesso único permanece lá). Aqui só JUNTAMOS os read
 * models já expostos pelo client (apontamento + item + cliente) numa linha
 * apresentável e derivamos o bucket de semáforo a partir da banda de confiança.
 *
 * G6 (linguagem segura): nada afirma "crédito garantido / apuração correta /
 * elimina multa / prova jurídica plena". Cada linha é um INDÍCIO pendente de
 * revisão humana (contador com CRC ativo). Base é SINTÉTICA (Fase 1).
 */
import type {
  Apontamento,
  Cliente,
  ContadorApiClient,
  NotaItem,
} from "@synkra/contador-api-client";
import { BANDA_CONFIANCA, type StatusView } from "@/lib/status";

/**
 * Bucket de semáforo (DESIGN §3, sempre redundante cor+ícone+label).
 * Deriva da banda de confiança do indício — nunca um selo binário "correto".
 */
export type SemaforoBucket = "defensavel" | "em_analise" | "requer_revisao" | "risco";

export interface SemaforoView extends StatusView {
  bucket: SemaforoBucket;
  /** Frase curta para o operador (o "por quê" do bucket). */
  hint: string;
}

/**
 * Mapa banda → bucket de semáforo. Mantém a semântica do DESIGN §3:
 *  - alta      → defensável (success)  : referência determinística firme.
 *  - media     → em análise (info)     : motor apontou, pende revisão humana.
 *  - disputado → requer revisão (warn) : régua em controvérsia, bloqueia auto-aprovação.
 *  - baixa     → risco (danger)        : confiança baixa, revisar antes de aprovar.
 */
const BANDA_TO_BUCKET: Record<Apontamento["bandaConfianca"], SemaforoView> = {
  alta: {
    bucket: "defensavel",
    variant: "success",
    glyph: "▲",
    label: "Defensável",
    hint: "Referência determinística firme — pronto para aprovação humana.",
  },
  media: {
    bucket: "em_analise",
    variant: "info",
    glyph: "◆",
    label: "Em análise",
    hint: "Motor apontou divergência — pende revisão do contador.",
  },
  disputado: {
    bucket: "requer_revisao",
    variant: "warning",
    glyph: "?",
    label: "Requer revisão",
    hint: "Régua em controvérsia — auto-aprovação bloqueada (DESIGN §6.3).",
  },
  baixa: {
    bucket: "risco",
    variant: "danger",
    glyph: "▼",
    label: "Risco",
    hint: "Confiança baixa — revisar antes de aprovar.",
  },
};

/** Ordem de severidade (pior primeiro) para ordenar/contar de forma estável. */
export const BUCKET_ORDER: SemaforoBucket[] = [
  "risco",
  "requer_revisao",
  "em_analise",
  "defensavel",
];

export function semaforoDe(apontamento: Apontamento): SemaforoView {
  return BANDA_TO_BUCKET[apontamento.bandaConfianca];
}

/** Uma linha da Fila do dia: indício + contexto do item + apresentação. */
export interface FilaLinha {
  id: string;
  clienteId: string;
  clienteNome: string;
  produto: string;
  ncm: string | null;
  /** cClassTrib que veio informado na nota (o que o contribuinte lançou). */
  cclasstribInformado: string | null;
  /** Referência sugerida pelo motor (null quando disputado: régua não fixa). */
  cclasstribReferencia: string | null;
  tipoDivergencia: Apontamento["tipoDivergencia"];
  /** Rótulo humano da natureza da divergência. */
  naturezaLabel: string;
  bandaView: StatusView;
  semaforo: SemaforoView;
  materialidade: number;
  /** true → destaque âmbar "revisar antes de aprovar". */
  bloqueiaAutoAprovacao: boolean;
  /** true → faixa esquerda de risco (DESIGN §6.5). */
  risco: boolean;
}

/** Natureza da divergência → rótulo legível (sem jargão de coluna SQL). */
const NATUREZA_LABEL: Record<Apontamento["tipoDivergencia"], string> = {
  cclasstrib_divergente: "cClassTrib divergente da referência",
  ncm_suspeito: "NCM suspeito / exige evidência",
  monofasico_tributado: "Possível regime monofásico",
  aliquota_divergente: "Alíquota divergente",
  cst_divergente: "CST divergente",
  credito_potencial: "Crédito potencial a apurar",
  outro: "Outra divergência",
};

export function naturezaLabel(tipo: Apontamento["tipoDivergencia"]): string {
  return NATUREZA_LABEL[tipo] ?? "Divergência";
}

/**
 * Monta as linhas da Fila do dia (apontamentos PENDENTES), já ordenadas por
 * materialidade desc. Junta item (produto/NCM/cClassTrib informado) e cliente.
 */
export async function carregarFilaPendente(
  api: ContadorApiClient,
  escritorioId: string,
): Promise<FilaLinha[]> {
  const [clientes, apontamentos, notas] = await Promise.all([
    api.listarClientes(escritorioId),
    api.listarApontamentos({ escritorioId, status: "pendente" }),
    api.listarNotas(escritorioId),
  ]);

  const cliById = new Map<string, Cliente>(clientes.map((c) => [c.id, c]));

  // Itens são acessados por nota; indexamos todos uma vez.
  const itensPorNota = await Promise.all(notas.map((n) => api.listarItens(n.id)));
  const itemById = new Map<string, NotaItem>();
  for (const lista of itensPorNota) {
    for (const it of lista) itemById.set(it.id, it);
  }

  const linhas = apontamentos.map((a): FilaLinha => {
    const item = itemById.get(a.itemId);
    const semaforo = semaforoDe(a);
    const bandaView = BANDA_CONFIANCA[a.bandaConfianca];
    return {
      id: a.id,
      clienteId: a.clienteId,
      clienteNome: cliById.get(a.clienteId)?.nome ?? "—",
      produto: item?.descricao ?? "(item não encontrado)",
      ncm: item?.ncm ?? null,
      cclasstribInformado: item?.cclasstribInformado ?? null,
      cclasstribReferencia: a.cclasstribReferencia,
      tipoDivergencia: a.tipoDivergencia,
      naturezaLabel: naturezaLabel(a.tipoDivergencia),
      bandaView,
      semaforo,
      materialidade: a.valorEnvolvido ?? 0,
      bloqueiaAutoAprovacao:
        a.bandaConfianca === "disputado" || a.bandaConfianca === "baixa",
      risco: a.bandaConfianca === "baixa",
    };
  });

  linhas.sort((a, b) => b.materialidade - a.materialidade);
  return linhas;
}

/** Linha do semáforo por cliente (contagem de indícios por bucket). */
export interface CarteiraLinha {
  clienteId: string;
  clienteNome: string;
  documento: string;
  total: number;
  porBucket: Record<SemaforoBucket, number>;
  /** Pior bucket presente (define o semáforo-resumo do cliente). */
  semaforoResumo: SemaforoView;
  materialidadeTotal: number;
}

/** Bucket "vazio" (cliente sem indícios pendentes) — defensável por ausência. */
const SEM_INDICIOS: SemaforoView = {
  bucket: "defensavel",
  variant: "success",
  glyph: "▲",
  label: "Sem indícios pendentes",
  hint: "Nenhuma divergência pendente de revisão neste cliente.",
};

/**
 * Consolida a Carteira (semáforo por cliente). Inclui clientes SEM indícios
 * pendentes (semáforo verde por ausência) para a visão ser completa.
 */
export async function carregarCarteira(
  api: ContadorApiClient,
  escritorioId: string,
): Promise<CarteiraLinha[]> {
  const [clientes, apontamentos] = await Promise.all([
    api.listarClientes(escritorioId),
    api.listarApontamentos({ escritorioId, status: "pendente" }),
  ]);

  const linhas = clientes.map((c): CarteiraLinha => {
    const doCliente = apontamentos.filter((a) => a.clienteId === c.id);
    const porBucket: Record<SemaforoBucket, number> = {
      risco: 0,
      requer_revisao: 0,
      em_analise: 0,
      defensavel: 0,
    };
    let materialidadeTotal = 0;
    for (const a of doCliente) {
      porBucket[semaforoDe(a).bucket] += 1;
      materialidadeTotal += a.valorEnvolvido ?? 0;
    }

    // Pior bucket presente define o semáforo-resumo.
    const pior = BUCKET_ORDER.find((b) => porBucket[b] > 0);
    const semaforoResumo = pior ? BANDA_TO_BUCKET_BY_BUCKET[pior] : SEM_INDICIOS;

    return {
      clienteId: c.id,
      clienteNome: c.nome,
      documento: c.documento,
      total: doCliente.length,
      porBucket,
      semaforoResumo,
      materialidadeTotal,
    };
  });

  // Clientes com algo pendente primeiro (pior semáforo no topo), depois alfabético.
  linhas.sort((a, b) => {
    const sa = BUCKET_ORDER.indexOf(a.semaforoResumo.bucket);
    const sb = BUCKET_ORDER.indexOf(b.semaforoResumo.bucket);
    if (a.total !== b.total && (a.total === 0 || b.total === 0)) {
      return b.total - a.total; // sem-indícios vão para o fim
    }
    if (sa !== sb) return sa - sb;
    return a.clienteNome.localeCompare(b.clienteNome, "pt-BR");
  });

  return linhas;
}

/** Acesso ao SemaforoView por bucket (para o resumo do cliente). */
const BANDA_TO_BUCKET_BY_BUCKET: Record<SemaforoBucket, SemaforoView> = {
  defensavel: BANDA_TO_BUCKET.alta,
  em_analise: BANDA_TO_BUCKET.media,
  requer_revisao: BANDA_TO_BUCKET.disputado,
  risco: BANDA_TO_BUCKET.baixa,
};

/** Rótulo humano de cada bucket (cabeçalho de contagem na Carteira). */
export const BUCKET_LABEL: Record<SemaforoBucket, string> = {
  risco: "Risco",
  requer_revisao: "Requer revisão",
  em_analise: "Em análise",
  defensavel: "Defensável",
};
