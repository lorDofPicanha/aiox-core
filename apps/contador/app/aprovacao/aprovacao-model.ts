/**
 * Read model da tela de Aprovação CRC (F1.4 — cerimônia graduada, DESIGN §6.4).
 *
 * NÃO toca em lib/api.ts (acesso único permanece lá). Aqui só JUNTAMOS os read
 * models já expostos pelo client (apontamento + item + cliente + nota + base +
 * motor + contador) num detalhe apresentável de UM indício, e derivamos a
 * apresentação de confiança/banda + proveniência (base normativa) + materialidade.
 *
 * G6 (linguagem segura): nada afirma "crédito garantido / apuração correta /
 * elimina multa / prova jurídica plena". O apontamento é um INDÍCIO sujeito a
 * revisão humana (contador com CRC ativo). Base é SINTÉTICA (Fase 1).
 */
import type {
  Apontamento,
  BaseVersao,
  Cliente,
  ContadorApiClient,
  MotorVersao,
  Nota,
  NotaItem,
  Usuario,
} from "@synkra/contador-api-client";
import { BANDA_CONFIANCA, STATUS_APONTAMENTO, type StatusView } from "@/lib/status";
import { naturezaLabel, semaforoDe, type SemaforoView } from "@/lib/fila-model";

export type { StatusView } from "@/lib/status";

/** Carimbo do revisor (quem · CRC · habilitação · quando) — DESIGN §6.4. */
export interface CarimboRevisor {
  nome: string;
  crc: string;
  crcUf: string | null;
  crcSituacao: string;
  /** Habilitação legível (papel + situação do CRC). */
  habilitacao: string;
  /** ISO do ato de revisão (quando o apontamento foi decidido). */
  revisadoEm: string | null;
}

/** Contador habilitado (CRC ativo) que pode exercer o ato privativo. */
export interface ContadorHabilitado {
  id: string;
  nome: string;
  crc: string;
  crcUf: string | null;
  crcSituacao: string;
  /** Frase de habilitação para o carimbo da cerimônia. */
  habilitacao: string;
}

/** Detalhe completo de um apontamento para a tela de aprovação. */
export interface AprovacaoDetalhe {
  id: string;
  clienteNome: string;
  clienteDocumento: string;
  /** Dados do item (produto · NCM · cClassTrib informado). */
  produto: string;
  ncm: string | null;
  cclasstribInformado: string | null;
  /** Referência sugerida pelo motor (null quando disputado: régua não fixa). */
  cclasstribReferencia: string | null;
  /** Nota de origem + classe do insumo de prova (◆ XML / ◇ OCR). */
  notaNumero: string | null;
  classeInsumo: "xml" | "ocr";
  competencia: string;
  /** Natureza + descrição honesta do indício. */
  naturezaLabel: string;
  descricao: string;
  tipoDivergencia: Apontamento["tipoDivergencia"];
  /** Confiança calibrada [0..1] (nunca selo binário). */
  confianca: number | null;
  bandaView: StatusView;
  semaforo: SemaforoView;
  /** Base normativa / proveniência (fundamento + versão da base + motor). */
  fundamento: string[];
  baseRotulo: string;
  baseFonte: string;
  baseVigenteDesde: string;
  baseSintetica: boolean;
  motorRotulo: string;
  motorVersao: string;
  /** Materialidade (R$). */
  materialidade: number;
  /** true → bloqueia auto-aprovação (disputado/baixa) — DESIGN §6.3. */
  bloqueiaAutoAprovacao: boolean;
  /** Estado do indício. */
  status: Apontamento["status"];
  statusView: StatusView;
  /** true → ainda pode ser aprovado/rejeitado (pendente). */
  decidivel: boolean;
  /** Carimbo do revisor (presente quando já decidido). */
  carimbo: CarimboRevisor | null;
  /** Motivo registrado na decisão (quando rejeitado/decidido). */
  motivoCodigo: string | null;
  motivoTexto: string | null;
  /** Contador habilitado (CRC ativo) que assina o ato. */
  contador: ContadorHabilitado | null;
}

function habilitacaoDe(u: Pick<Usuario, "papel" | "crcSituacao">): string {
  const sit = u.crcSituacao ?? "sem registro";
  return `Contador habilitado · CRC ${sit}`;
}

/**
 * Monta o detalhe de UM apontamento para a tela de aprovação.
 * Retorna null quando o apontamento não existe / não pertence ao escritório.
 */
export async function carregarAprovacao(
  api: ContadorApiClient,
  escritorioId: string,
  apontamentoId: string,
): Promise<AprovacaoDetalhe | null> {
  const ap = await api.getApontamento(apontamentoId);
  if (!ap || ap.escritorioId !== escritorioId) return null;

  const [clientes, notas, bases, motores, contadores] = await Promise.all([
    api.listarClientes(escritorioId),
    api.listarNotas(escritorioId),
    api.listarBasesReferencia(escritorioId),
    api.listarMotores(escritorioId),
    api.listarContadores(escritorioId),
  ]);

  const cliente = clientes.find((c: Cliente) => c.id === ap.clienteId);

  // Resolve item percorrendo as notas (mesma estratégia do fila-model).
  const itensPorNota = await Promise.all(notas.map((n: Nota) => api.listarItens(n.id)));
  let item: NotaItem | undefined;
  let notaDoItem: Nota | undefined;
  for (let i = 0; i < notas.length; i++) {
    const achado = itensPorNota[i].find((it: NotaItem) => it.id === ap.itemId);
    if (achado) {
      item = achado;
      notaDoItem = notas[i];
      break;
    }
  }

  const base = bases.find((b: BaseVersao) => b.id === ap.baseVersaoId) ?? bases[0] ?? null;
  const motor = motores.find((m: MotorVersao) => m.id === ap.motorVersaoId) ?? motores[0] ?? null;

  const semaforo = semaforoDe(ap);
  const bandaView = BANDA_CONFIANCA[ap.bandaConfianca];
  const statusView = STATUS_APONTAMENTO[ap.status];

  const bloqueiaAutoAprovacao =
    ap.bandaConfianca === "disputado" || ap.bandaConfianca === "baixa";

  // Contador habilitado (CRC ativo) que assina o ato privativo.
  const contadorAtivo = contadores.find(
    (u: Usuario) => u.crc != null && u.crcSituacao === "ativo",
  );
  const contador: ContadorHabilitado | null = contadorAtivo
    ? {
        id: contadorAtivo.id,
        nome: contadorAtivo.nome,
        crc: contadorAtivo.crc!,
        crcUf: contadorAtivo.crcUf,
        crcSituacao: contadorAtivo.crcSituacao ?? "ativo",
        habilitacao: habilitacaoDe(contadorAtivo),
      }
    : null;

  // Carimbo (quando já decidido): resolve o revisor pelo snapshot atual.
  let carimbo: CarimboRevisor | null = null;
  if (ap.revisorId) {
    const revisor = contadores.find((u: Usuario) => u.id === ap.revisorId);
    if (revisor) {
      carimbo = {
        nome: revisor.nome,
        crc: revisor.crc ?? "—",
        crcUf: revisor.crcUf,
        crcSituacao: revisor.crcSituacao ?? "—",
        habilitacao: habilitacaoDe(revisor),
        revisadoEm: ap.revisadoEm,
      };
    }
  }

  return {
    id: ap.id,
    clienteNome: cliente?.nome ?? "—",
    clienteDocumento: cliente?.documento ?? "",
    produto: item?.descricao ?? "(item não encontrado)",
    ncm: item?.ncm ?? null,
    cclasstribInformado: item?.cclasstribInformado ?? null,
    cclasstribReferencia: ap.cclasstribReferencia,
    notaNumero: notaDoItem?.numero ?? null,
    classeInsumo: notaDoItem?.classeInsumo ?? "xml",
    competencia: item?.competencia ?? "",
    naturezaLabel: naturezaLabel(ap.tipoDivergencia),
    descricao: ap.descricao,
    tipoDivergencia: ap.tipoDivergencia,
    confianca: ap.confianca,
    bandaView,
    semaforo,
    fundamento: ap.fundamento,
    baseRotulo: base?.rotulo ?? "—",
    baseFonte: base?.fonte ?? "—",
    baseVigenteDesde: base?.vigenteDesde ?? "—",
    baseSintetica: base?.sintetica ?? true,
    motorRotulo: motor?.rotulo ?? "—",
    motorVersao: motor?.codigoVersao ?? "—",
    materialidade: ap.valorEnvolvido ?? 0,
    bloqueiaAutoAprovacao,
    status: ap.status,
    statusView,
    decidivel: ap.status === "pendente",
    carimbo,
    motivoCodigo: ap.motivoCodigo,
    motivoTexto: ap.motivoTexto,
    contador,
  };
}

/** Linha do índice de pendentes (links para cada [id]). */
export interface AprovacaoPendente {
  id: string;
  clienteNome: string;
  produto: string;
  naturezaLabel: string;
  bandaView: StatusView;
  materialidade: number;
  bloqueiaAutoAprovacao: boolean;
}

/** Lista apontamentos PENDENTES (índice → detalhe), ordenados por materialidade. */
export async function carregarPendentesAprovacao(
  api: ContadorApiClient,
  escritorioId: string,
): Promise<AprovacaoPendente[]> {
  const [clientes, apontamentos, notas] = await Promise.all([
    api.listarClientes(escritorioId),
    api.listarApontamentos({ escritorioId, status: "pendente" }),
    api.listarNotas(escritorioId),
  ]);

  const cliById = new Map<string, Cliente>(clientes.map((c: Cliente) => [c.id, c]));
  const itensPorNota = await Promise.all(notas.map((n: Nota) => api.listarItens(n.id)));
  const itemById = new Map<string, NotaItem>();
  for (const lista of itensPorNota) {
    for (const it of lista) itemById.set(it.id, it);
  }

  const linhas = apontamentos.map((a: Apontamento): AprovacaoPendente => ({
    id: a.id,
    clienteNome: cliById.get(a.clienteId)?.nome ?? "—",
    produto: itemById.get(a.itemId)?.descricao ?? "(item não encontrado)",
    naturezaLabel: naturezaLabel(a.tipoDivergencia),
    bandaView: BANDA_CONFIANCA[a.bandaConfianca],
    materialidade: a.valorEnvolvido ?? 0,
    bloqueiaAutoAprovacao:
      a.bandaConfianca === "disputado" || a.bandaConfianca === "baixa",
  }));

  linhas.sort((a, b) => b.materialidade - a.materialidade);
  return linhas;
}
