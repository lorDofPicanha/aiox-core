/**
 * Read model do LAUDO defensável (F1.6 · DESIGN §6.1).
 *
 * Co-localizado em app/laudos/ de PROPÓSITO: não toca lib/api.ts (acesso único
 * permanece lá) nem lib/ compartilhado — junta os read models já expostos pelo
 * client (apontamento + item + nota + cliente + contador) num "documento de fé
 * pública" por cliente. A trilha (hash-chain) e o verificador continuam vindo do
 * @synkra/contador-trilha-verifier, exatamente como na home e na /trilha.
 *
 * G6 (linguagem segura, doc 45): nada aqui afirma "crédito garantido", "apuração
 * correta", "elimina multa" nem "prova jurídica plena". Cada apontamento é um
 * INDÍCIO sujeito a revisão humana (contador com CRC ativo). Base SINTÉTICA (Fase 1);
 * o carimbo de tempo formal (ACT ICP-Brasil) é Fase 4 — mostrado como pendente.
 */
import type {
  Apontamento,
  Cliente,
  ContadorApiClient,
  EventoBoaFe,
  Nota,
  NotaItem,
  Usuario,
} from "@synkra/contador-api-client";
import { BANDA_CONFIANCA, type StatusView } from "@/lib/status";
import { naturezaLabel, semaforoDe, type SemaforoBucket, type SemaforoView } from "@/lib/fila-model";

/** Faixa de status do laudo no topo (DESIGN §6.1): defensável / requer revisão / risco. */
export type FaixaLaudo = "defensavel" | "requer_revisao" | "risco";

export interface FaixaView extends StatusView {
  faixa: FaixaLaudo;
  /** Frase curta e G6-safe para o operador (o "por quê" da faixa). */
  hint: string;
}

/**
 * Faixa do laudo a partir do PIOR indício pendente do cliente.
 *  - sem indícios pendentes → defensável por ausência (verde).
 *  - algum risco/baixa → risco (vermelho).
 *  - algum disputado → requer revisão (âmbar).
 *  - só alta/média → "em revisão" verde-teal: motor apontou, pende a revisão humana.
 *
 * NUNCA "apuração correta": a faixa verde só diz que NÃO há indício que bloqueie a
 * revisão — a defensabilidade nasce do ato humano (aprovação CRC), não do sistema.
 */
const FAIXA_DEFENSAVEL: FaixaView = {
  faixa: "defensavel",
  variant: "success",
  glyph: "▲",
  label: "Pronto para revisão",
  hint: "Sem indício que bloqueie a revisão. A defensabilidade nasce do ato humano (aprovação CRC), não do sistema.",
};
const FAIXA_REQUER_REVISAO: FaixaView = {
  faixa: "requer_revisao",
  variant: "warning",
  glyph: "?",
  label: "Requer revisão",
  hint: "Há indício disputado (régua em controvérsia) — auto-aprovação bloqueada (DESIGN §6.3).",
};
const FAIXA_RISCO: FaixaView = {
  faixa: "risco",
  variant: "danger",
  glyph: "▼",
  label: "Revisar antes de aprovar",
  hint: "Há indício de baixa confiança — revisão humana obrigatória antes de qualquer ação.",
};

function faixaDe(porBucket: Record<SemaforoBucket, number>): FaixaView {
  if (porBucket.risco > 0) return FAIXA_RISCO;
  if (porBucket.requer_revisao > 0) return FAIXA_REQUER_REVISAO;
  return FAIXA_DEFENSAVEL;
}

/** Uma divergência por item no corpo do laudo (DESIGN §6.1). */
export interface LaudoItem {
  id: string;
  produto: string;
  ncm: string | null;
  /** cClassTrib que veio informado na nota (o que o contribuinte lançou). */
  cclasstribInformado: string | null;
  /** Referência sugerida pelo motor (null quando disputado: régua não fixa — G6). */
  cclasstribReferencia: string | null;
  naturezaLabel: string;
  /** Confiança calibrada [0..1] — nunca selo binário "correto". null = disputado. */
  confianca: number | null;
  bandaView: StatusView;
  /** Base normativa citada (fundamento da régua). */
  fundamento: string[];
  materialidade: number;
  /** Classe de insumo de prova da nota de origem (◆ XML 1ª · ◇ OCR 2ª). */
  classeInsumo: "xml" | "ocr";
  /** true → indício disputado/baixa confiança que bloqueia auto-aprovação. */
  disputado: boolean;
  /** true → faixa esquerda de risco na tabela (DESIGN §6.5). */
  risco: boolean;
}

/** Cabeçalho "trust center" do laudo (DESIGN §6.1). */
export interface LaudoCabecalho {
  /** Versão da régua (rulesetVersao) contra a qual foi verificado. */
  reguaVersao: string;
  reguaSintetica: boolean;
  /** Classes de insumo presentes nas notas do cliente (◆ XML / ◇ OCR). */
  classesInsumo: ("xml" | "ocr")[];
  /** Nº de notas e itens cobertos. */
  notas: number;
  itens: number;
  /** Quando: momento da verificação (render). */
  verificadoEm: string;
  /** Por quem: contador habilitado + CRC (ato privativo). */
  contadorNome: string;
  contadorCrc: string | null;
  contadorCrcSituacao: string | null;
}

export interface LaudoResumo {
  total: number;
  porBucket: Record<SemaforoBucket, number>;
  materialidadeTotal: number;
  disputados: number;
}

/** O laudo completo de um cliente (read model agregado, G6-safe). */
export interface Laudo {
  cliente: Cliente;
  faixa: FaixaView;
  cabecalho: LaudoCabecalho;
  resumo: LaudoResumo;
  itens: LaudoItem[];
  /** Eventos da trilha do cliente (notas + apontamentos), para a trilha-resumo + verificador. */
  eventos: EventoBoaFe[];
}

/** Linha do índice de laudos (uma por cliente). */
export interface LaudoIndiceLinha {
  clienteId: string;
  clienteNome: string;
  documento: string;
  faixa: FaixaView;
  totalIndicios: number;
  disputados: number;
  materialidadeTotal: number;
  semaforoResumo: SemaforoView;
}

function bucketsVazios(): Record<SemaforoBucket, number> {
  return { risco: 0, requer_revisao: 0, em_analise: 0, defensavel: 0 };
}

/**
 * Índice de laudos por cliente. Cada cliente vira uma entrada com a faixa derivada
 * do pior indício pendente. Inclui clientes sem indícios (faixa "pronto para revisão").
 */
export async function carregarIndiceLaudos(
  api: ContadorApiClient,
  escritorioId: string,
): Promise<LaudoIndiceLinha[]> {
  const [clientes, apontamentos] = await Promise.all([
    api.listarClientes(escritorioId),
    api.listarApontamentos({ escritorioId, status: "pendente" }),
  ]);

  const linhas = clientes.map((c): LaudoIndiceLinha => {
    const doCliente = apontamentos.filter((a) => a.clienteId === c.id);
    const porBucket = bucketsVazios();
    let materialidadeTotal = 0;
    let piorSemaforo: SemaforoView | null = null;
    for (const a of doCliente) {
      const s = semaforoDe(a);
      porBucket[s.bucket] += 1;
      materialidadeTotal += a.valorEnvolvido ?? 0;
      // pior = mais severo (risco > requer_revisao > em_analise > defensavel)
      if (!piorSemaforo || severidade(s.bucket) < severidade(piorSemaforo.bucket)) {
        piorSemaforo = s;
      }
    }
    return {
      clienteId: c.id,
      clienteNome: c.nome,
      documento: c.documento,
      faixa: faixaDe(porBucket),
      totalIndicios: doCliente.length,
      disputados: porBucket.requer_revisao + porBucket.risco,
      materialidadeTotal,
      semaforoResumo: piorSemaforo ?? FAIXA_TO_SEMAFORO_VAZIO,
    };
  });

  // Pior faixa primeiro; depois materialidade desc; depois alfabético.
  linhas.sort((a, b) => {
    const fa = faixaSeveridade(a.faixa.faixa);
    const fb = faixaSeveridade(b.faixa.faixa);
    if (fa !== fb) return fa - fb;
    if (a.materialidadeTotal !== b.materialidadeTotal) {
      return b.materialidadeTotal - a.materialidadeTotal;
    }
    return a.clienteNome.localeCompare(b.clienteNome, "pt-BR");
  });

  return linhas;
}

const SEVERIDADE: Record<SemaforoBucket, number> = {
  risco: 0,
  requer_revisao: 1,
  em_analise: 2,
  defensavel: 3,
};
function severidade(b: SemaforoBucket): number {
  return SEVERIDADE[b];
}

const FAIXA_SEVERIDADE: Record<FaixaLaudo, number> = {
  risco: 0,
  requer_revisao: 1,
  defensavel: 2,
};
function faixaSeveridade(f: FaixaLaudo): number {
  return FAIXA_SEVERIDADE[f];
}

/** Semáforo neutro para cliente sem indícios pendentes (verde por ausência). */
const FAIXA_TO_SEMAFORO_VAZIO: SemaforoView = {
  bucket: "defensavel",
  variant: "success",
  glyph: "▲",
  label: "Sem indícios pendentes",
  hint: "Nenhuma divergência pendente de revisão neste cliente.",
};

/**
 * Carrega o LAUDO completo de UM cliente. Junta apontamentos pendentes + itens +
 * notas (classe de insumo) + contador habilitado + a régua (versão), e filtra a
 * trilha de eventos relacionados ao cliente para a trilha-resumo + verificador.
 *
 * @returns null se o cliente não existe no tenant.
 */
export async function carregarLaudo(
  api: ContadorApiClient,
  escritorioId: string,
  clienteId: string,
  reguaVersao: string,
): Promise<Laudo | null> {
  const [clientes, contadores, apontamentos, notas] = await Promise.all([
    api.listarClientes(escritorioId),
    api.listarContadores(escritorioId),
    api.listarApontamentos({ escritorioId, clienteId, status: "pendente" }),
    api.listarNotas(escritorioId, clienteId),
  ]);

  const cliente = clientes.find((c) => c.id === clienteId);
  if (!cliente) return null;

  // Itens do cliente, indexados por id (corpo do laudo) + classe de insumo por nota.
  const itensPorNota = await Promise.all(notas.map((n) => api.listarItens(n.id)));
  const itemById = new Map<string, NotaItem>();
  const notaById = new Map<string, Nota>(notas.map((n) => [n.id, n]));
  for (const lista of itensPorNota) {
    for (const it of lista) itemById.set(it.id, it);
  }

  // Contador habilitado (ato privativo — CRC ativo). Pega o primeiro com CRC ativo.
  const contador =
    contadores.find((u) => u.papel === "contador" && u.crcSituacao === "ativo") ??
    contadores[0] ??
    null;

  const itens: LaudoItem[] = apontamentos.map((a): LaudoItem => {
    const item = itemById.get(a.itemId);
    const nota = item ? notaById.get(item.notaId) : undefined;
    const disputado = a.bandaConfianca === "disputado" || a.bandaConfianca === "baixa";
    return {
      id: a.id,
      produto: item?.descricao ?? "(item não encontrado)",
      ncm: item?.ncm ?? null,
      cclasstribInformado: item?.cclasstribInformado ?? null,
      cclasstribReferencia: a.cclasstribReferencia,
      naturezaLabel: naturezaLabel(a.tipoDivergencia),
      confianca: a.confianca,
      bandaView: BANDA_CONFIANCA[a.bandaConfianca],
      fundamento: a.fundamento ?? [],
      materialidade: a.valorEnvolvido ?? 0,
      classeInsumo: nota?.classeInsumo ?? "xml",
      disputado,
      risco: a.bandaConfianca === "baixa",
    };
  });
  itens.sort((x, y) => y.materialidade - x.materialidade);

  const porBucket = bucketsVazios();
  let materialidadeTotal = 0;
  for (const a of apontamentos) {
    porBucket[semaforoDe(a).bucket] += 1;
    materialidadeTotal += a.valorEnvolvido ?? 0;
  }
  const disputados = porBucket.requer_revisao + porBucket.risco;

  const classesInsumo = Array.from(new Set(notas.map((n) => n.classeInsumo))).sort();
  // Sinaliza base sintética se QUALQUER nota tiver origem sintética (Fase 1: todas são).
  const reguaSintetica = true;

  const cabecalho: LaudoCabecalho = {
    reguaVersao,
    reguaSintetica,
    classesInsumo: classesInsumo.length > 0 ? classesInsumo : ["xml"],
    notas: notas.length,
    itens: itemById.size,
    verificadoEm: new Date().toISOString(),
    contadorNome: contador?.nome ?? "—",
    contadorCrc: contador?.crc
      ? `${contador.crc}${contador.crcUf ? `/${contador.crcUf}` : ""}`
      : null,
    contadorCrcSituacao: contador?.crcSituacao ?? null,
  };

  // Eventos da trilha relacionados a este cliente (notas + apontamentos do cliente).
  const eventos = await carregarEventosDoCliente(api, escritorioId, clienteId, notas, apontamentos);

  return {
    cliente,
    faixa: faixaDe(porBucket),
    cabecalho,
    resumo: { total: apontamentos.length, porBucket, materialidadeTotal, disputados },
    itens,
    eventos,
  };
}

/**
 * Filtra a trilha (append-only) para os eventos relevantes ao cliente: eventos cuja
 * nota ou apontamento pertença ao cliente. Mantém a ORDEM CANÔNICA (seq_tenant) para
 * o verificador — a cadeia inteira é íntegra; aqui só projetamos a fatia do cliente.
 */
async function carregarEventosDoCliente(
  api: ContadorApiClient,
  escritorioId: string,
  _clienteId: string,
  notas: Nota[],
  apontamentos: Apontamento[],
): Promise<EventoBoaFe[]> {
  const todos = await api.listarEventos({ escritorioId });
  const notaIds = new Set(notas.map((n) => n.id));
  const apontamentoIds = new Set(apontamentos.map((a) => a.id));
  return todos
    .filter(
      (e) =>
        (e.notaId && notaIds.has(e.notaId)) ||
        (e.apontamentoId && apontamentoIds.has(e.apontamentoId)),
    )
    .sort((a, b) => a.seqTenant - b.seqTenant);
}
