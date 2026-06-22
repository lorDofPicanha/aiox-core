/**
 * MockApiClient — implementação in-memory de ContadorApiClient para a Fase 1.
 *
 * - Dados 100% SINTÉTICOS e G6-safe (ver mock-data.ts).
 * - A trilha de boa-fé é um hash-chain REAL: usa appendEventoForTest do
 *   @synkra/contador-trilha-verifier, de modo que verificarCadeia() valida a cadeia
 *   produzida pelo mock (exatamente o que a F1.6 precisa).
 * - Estado isolado por instância: cada createApiClient({mode:"mock"}) tem seu próprio
 *   universo (sem singletons globais), evitando vazamento entre testes/renders.
 */

import { appendEventoForTest, type EventoBoaFeDump } from "@synkra/contador-trilha-verifier";
import type { ContadorApiClient } from "./client";
import { buildDefaultSeed, type SeedDataset } from "./mock-data";
import type {
  Apontamento,
  AprovarApontamentoArgs,
  BaseVersao,
  Cliente,
  CloseoutLote,
  Escritorio,
  EventoBoaFe,
  ListarApontamentosFiltro,
  ListarEventosFiltro,
  MotorVersao,
  Nota,
  NotaItem,
  RegistrarAnaliseArgs,
  RegistrarCloseoutArgs,
  RejeitarApontamentoArgs,
  SuperarApontamentoArgs,
  TipoEvento,
  Usuario,
} from "./types";

let CLOSEOUT_SEQ = 0;

export class MockApiClient implements ContadorApiClient {
  readonly mode = "mock" as const;

  private escritorio: Escritorio;
  private contador: Usuario;
  private clientes: Cliente[];
  private notas: Nota[];
  private itens: NotaItem[];
  private base: BaseVersao;
  private motor: MotorVersao;
  private apontamentos: Apontamento[];
  private eventos: EventoBoaFeDump[] = [];
  private closeouts: CloseoutLote[] = [];

  constructor(seed: SeedDataset = buildDefaultSeed()) {
    this.escritorio = seed.escritorio;
    this.contador = seed.contador;
    this.clientes = seed.clientes;
    this.notas = seed.notas;
    this.itens = seed.itens;
    this.base = seed.baseReferencia;
    this.motor = seed.motor;
    this.apontamentos = seed.apontamentos.map((a) => ({ ...a }));
    this.bootstrapTrilha();
  }

  // ---- bootstrap: trilha coerente com os apontamentos sintéticos (P17) ----
  private bootstrapTrilha(): void {
    for (const nota of this.notas) {
      this.appendEvento({
        tipoEvento: "nota_recebida",
        atorTipo: "sistema",
        referenteTipo: "nota",
        referenteId: nota.id,
        notaId: nota.id,
        payload: { origem: nota.origem, classe_insumo: nota.classeInsumo, base_sintetica: true },
      });
    }
    for (const ap of this.apontamentos) {
      this.appendEvento({
        tipoEvento: "analise_executada",
        atorTipo: "motor",
        atorId: this.motor.id,
        referenteTipo: "analise",
        referenteId: ap.id,
        apontamentoId: ap.id,
        payload: {
          motor_versao_id: ap.motorVersaoId,
          base_versao_id: ap.baseVersaoId,
          tipo_inferencia: ap.tipoInferencia,
          base_sintetica: true,
        },
      });
    }
  }

  private appendEvento(input: {
    tipoEvento: TipoEvento;
    atorTipo: EventoBoaFeDump["ator_tipo"];
    atorId?: string | null;
    referenteTipo?: EventoBoaFeDump["referente_tipo"];
    referenteId?: string | null;
    notaId?: string | null;
    apontamentoId?: string | null;
    payload: Record<string, unknown>;
  }): EventoBoaFeDump {
    const dump = appendEventoForTest(this.eventos, {
      id: this.eventos.length + 1,
      escritorio_id: this.escritorio.id,
      hash_ver: 1,
      tipo_evento: input.tipoEvento,
      ator_tipo: input.atorTipo,
      ator_id: input.atorId ?? null,
      referente_tipo: input.referenteTipo ?? null,
      referente_id: input.referenteId ?? null,
      nota_id: input.notaId ?? null,
      apontamento_id: input.apontamentoId ?? null,
      laudo_id: null,
      payload: input.payload,
      ocorrido_em: new Date(Date.UTC(2026, 0, 22, 12, 0, this.eventos.length)).toISOString(),
    });
    return dump;
  }

  private toEventoBoaFe(d: EventoBoaFeDump): EventoBoaFe {
    return {
      id: d.id ?? 0,
      escritorioId: d.escritorio_id,
      seqTenant: d.seq_tenant,
      hashVer: d.hash_ver,
      tipoEvento: d.tipo_evento as TipoEvento,
      atorTipo: d.ator_tipo as EventoBoaFe["atorTipo"],
      atorId: d.ator_id ?? null,
      referenteTipo: (d.referente_tipo ?? null) as EventoBoaFe["referenteTipo"],
      referenteId: d.referente_id ?? null,
      notaId: d.nota_id ?? null,
      apontamentoId: d.apontamento_id ?? null,
      laudoId: d.laudo_id ?? null,
      payload: d.payload,
      ocorridoEm: d.ocorrido_em,
      hashAnterior: d.hash_anterior,
      hashEvento: d.hash_evento,
    };
  }

  /** Exposto para a F1.6: dump cru consumível por verificarCadeia(). */
  dumpEventos(): EventoBoaFeDump[] {
    return this.eventos.map((e) => ({ ...e }));
  }

  // ------------------------------- Leitura -------------------------------

  async getEscritorio(escritorioId: string): Promise<Escritorio | null> {
    return this.escritorio.id === escritorioId ? { ...this.escritorio } : null;
  }

  async listarClientes(escritorioId: string): Promise<Cliente[]> {
    return this.clientes.filter((c) => c.escritorioId === escritorioId).map((c) => ({ ...c }));
  }

  async listarContadores(escritorioId: string): Promise<Usuario[]> {
    return this.contador.escritorioId === escritorioId && this.contador.papel === "contador"
      ? [{ ...this.contador }]
      : [];
  }

  async listarNotas(escritorioId: string, clienteId?: string): Promise<Nota[]> {
    return this.notas
      .filter((n) => n.escritorioId === escritorioId && (clienteId ? n.clienteId === clienteId : true))
      .map((n) => ({ ...n }));
  }

  async listarItens(notaId: string): Promise<NotaItem[]> {
    return this.itens.filter((i) => i.notaId === notaId).map((i) => ({ ...i }));
  }

  async listarBasesReferencia(escritorioId: string): Promise<BaseVersao[]> {
    return this.escritorio.id === escritorioId ? [{ ...this.base }] : [];
  }

  async listarMotores(escritorioId: string): Promise<MotorVersao[]> {
    return this.escritorio.id === escritorioId ? [{ ...this.motor }] : [];
  }

  async listarApontamentos(filtro: ListarApontamentosFiltro): Promise<Apontamento[]> {
    return this.apontamentos
      .filter(
        (a) =>
          a.escritorioId === filtro.escritorioId &&
          (filtro.clienteId ? a.clienteId === filtro.clienteId : true) &&
          (filtro.status ? a.status === filtro.status : true),
      )
      .map((a) => ({ ...a }));
  }

  async getApontamento(apontamentoId: string): Promise<Apontamento | null> {
    const found = this.apontamentos.find((a) => a.id === apontamentoId);
    return found ? { ...found } : null;
  }

  async listarEventos(filtro: ListarEventosFiltro): Promise<EventoBoaFe[]> {
    return this.eventos
      .filter(
        (e) =>
          e.escritorio_id === filtro.escritorioId &&
          (filtro.referenteTipo ? e.referente_tipo === filtro.referenteTipo : true) &&
          (filtro.referenteId ? e.referente_id === filtro.referenteId : true),
      )
      .map((e) => this.toEventoBoaFe(e));
  }

  async listarCloseouts(escritorioId: string): Promise<CloseoutLote[]> {
    return this.closeouts.filter((c) => c.escritorioId === escritorioId).map((c) => ({ ...c }));
  }

  // ------------------------------- Escrita -------------------------------

  async registrarAnalise(args: RegistrarAnaliseArgs): Promise<string> {
    const id = `00000000-0000-4000-8000-${String(900 + this.apontamentos.length).padStart(12, "0")}`;
    const novo: Apontamento = {
      id,
      escritorioId: args.escritorioId,
      clienteId: args.clienteId,
      itemId: args.itemId,
      baseVersaoId: args.baseVersaoId,
      motorVersaoId: args.motorVersaoId,
      analiseExecucaoId: null,
      tipoInferencia: args.tipoInferencia ?? "regra_deterministica",
      origem: "motor",
      tipoDivergencia: args.tipoDivergencia,
      cclasstribReferencia: args.cclasstribReferencia ?? null,
      descricao: args.descricao,
      valorEnvolvido: args.valorEnvolvido ?? null,
      confianca: args.confianca ?? null,
      bandaConfianca: bandaFromConfianca(args.confianca ?? null),
      fundamento: args.fundamento ?? [],
      status: "pendente",
      revisorId: null,
      revisadoEm: null,
      motivoCodigo: null,
      motivoTexto: null,
    };
    this.apontamentos.push(novo);
    this.appendEvento({
      tipoEvento: "analise_executada",
      atorTipo: "motor",
      atorId: args.motorVersaoId,
      referenteTipo: "analise",
      referenteId: id,
      apontamentoId: id,
      payload: {
        motor_versao_id: args.motorVersaoId,
        base_versao_id: args.baseVersaoId,
        tipo_inferencia: novo.tipoInferencia,
        base_sintetica: true,
      },
    });
    return id;
  }

  async aprovarApontamento(args: AprovarApontamentoArgs): Promise<string> {
    return this.decidir(args.apontamentoId, args.revisorId, "aprovado", "apontamento_aprovado", args.motivoCodigo ?? "aprovado", args.motivoTexto ?? null);
  }

  async rejeitarApontamento(args: RejeitarApontamentoArgs): Promise<string> {
    if (!args.motivoCodigo) {
      throw new Error("[ck_rejeicao_motivada] motivoCodigo é obrigatório para rejeitar.");
    }
    return this.decidir(args.apontamentoId, args.revisorId, "rejeitado", "apontamento_rejeitado", args.motivoCodigo, args.motivoTexto ?? null);
  }

  async superarApontamento(args: SuperarApontamentoArgs): Promise<string> {
    return this.decidir(
      args.apontamentoId,
      args.revisorId,
      "superado",
      "apontamento_superado",
      "superado",
      null,
      { conhecida_em: args.conhecidaEm, vigencia: args.vigencia },
    );
  }

  private decidir(
    apontamentoId: string,
    revisorId: string,
    novoStatus: Apontamento["status"],
    tipoEvento: TipoEvento,
    motivoCodigo: string,
    motivoTexto: string | null,
    extraPayload: Record<string, unknown> = {},
  ): string {
    const ap = this.apontamentos.find((a) => a.id === apontamentoId);
    if (!ap) {
      throw new Error(`apontamento não encontrado: ${apontamentoId}`);
    }
    if (novoStatus !== "superado" && ap.status !== "pendente") {
      throw new Error(`apontamento ${apontamentoId} não está pendente (status atual: ${ap.status}).`);
    }
    // [P17] ato privativo: contador ativo com CRC ativo no mesmo escritório.
    if (
      this.contador.id !== revisorId ||
      this.contador.papel !== "contador" ||
      this.contador.crc == null ||
      this.contador.crcSituacao !== "ativo" ||
      this.contador.escritorioId !== ap.escritorioId
    ) {
      throw new Error(`[P17] revisor ${revisorId} não é um contador com CRC ativo neste escritório.`);
    }

    this.appendEvento({
      tipoEvento,
      atorTipo: "usuario",
      atorId: revisorId,
      referenteTipo: "apontamento",
      referenteId: apontamentoId,
      notaId: this.notaIdDoItem(ap.itemId),
      apontamentoId,
      payload: {
        decisao_individualizada: true,
        motivo_codigo: motivoCodigo,
        motivo_texto: motivoTexto,
        revisor_snapshot: {
          usuario_id: this.contador.id,
          nome: this.contador.nome,
          crc: this.contador.crc,
          crc_uf: this.contador.crcUf,
          crc_situacao: this.contador.crcSituacao,
        },
        ...extraPayload,
      },
    });

    ap.status = novoStatus;
    ap.revisorId = revisorId;
    ap.revisadoEm = new Date(Date.UTC(2026, 0, 22, 13, 0, 0)).toISOString();
    ap.motivoCodigo = motivoCodigo;
    ap.motivoTexto = motivoTexto;
    return apontamentoId;
  }

  private notaIdDoItem(itemId: string): string | null {
    return this.itens.find((i) => i.id === itemId)?.notaId ?? null;
  }

  async registrarCloseout(args: RegistrarCloseoutArgs): Promise<string> {
    if ((args.carimboTempoProvider ?? "none") !== "none") {
      // Fase 1: carimbo de tempo formal (ACT/ICP-Brasil) é Fase 4 — placeholder honesto.
      throw new Error("Carimbo de tempo formal não disponível na Fase 1 (carimboTempoProvider deve ser 'none').");
    }
    CLOSEOUT_SEQ += 1;
    const id = `00000000-0000-4000-8000-${String(700 + CLOSEOUT_SEQ).padStart(12, "0")}`;
    this.closeouts.push({
      id,
      escritorioId: args.escritorioId,
      tipo: args.tipo,
      periodoInicio: args.periodoInicio,
      periodoFim: args.periodoFim,
      eventoCount: args.eventoCount,
      merkleRoot: args.merkleRoot,
      verifierVersion: args.verifierVersion,
      resultado: args.resultado,
      carimboTempoProvider: "none",
      executadoEm: new Date(Date.UTC(2026, 0, 22, 14, 0, 0)).toISOString(),
    });
    return id;
  }
}

function bandaFromConfianca(c: number | null): Apontamento["bandaConfianca"] {
  if (c == null) return "disputado";
  if (c >= 0.9) return "alta";
  if (c >= 0.75) return "media";
  return "baixa";
}
