/**
 * ContadorApiClient — interface TIPADA sobre core_api_v1 (a published write API
 * do core, schema `core_api_v1` nas migrations) + read models que o app consome.
 *
 * Implementações:
 *  - createApiClient({ mode: "mock" })     → MockApiClient (in-memory, sintético, G6-safe) — Fase 1
 *  - createApiClient({ mode: "supabase" }) → reservado para a Fase 2 (lança até ser implementado)
 *
 * Mapa RPC SQL → método:
 *  core_api_v1.registrar_analise     → registrarAnalise
 *  core_api_v1.aprovar_apontamento   → aprovarApontamento
 *  core_api_v1.rejeitar_apontamento  → rejeitarApontamento
 *  core_api_v1.superar_apontamento   → superarApontamento
 *  core_api_v1.registrar_closeout    → registrarCloseout
 */

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
  Usuario,
} from "./types";

export interface ContadorApiClient {
  /** Identifica a implementação ("mock" na Fase 1). */
  readonly mode: "mock" | "supabase";

  // ---- Leitura (read models do contexto APURAÇÃO) ----
  getEscritorio(escritorioId: string): Promise<Escritorio | null>;
  listarClientes(escritorioId: string): Promise<Cliente[]>;
  listarContadores(escritorioId: string): Promise<Usuario[]>;
  listarNotas(escritorioId: string, clienteId?: string): Promise<Nota[]>;
  listarItens(notaId: string): Promise<NotaItem[]>;
  listarBasesReferencia(escritorioId: string): Promise<BaseVersao[]>;
  listarMotores(escritorioId: string): Promise<MotorVersao[]>;
  listarApontamentos(filtro: ListarApontamentosFiltro): Promise<Apontamento[]>;
  getApontamento(apontamentoId: string): Promise<Apontamento | null>;
  listarEventos(filtro: ListarEventosFiltro): Promise<EventoBoaFe[]>;
  listarCloseouts(escritorioId: string): Promise<CloseoutLote[]>;

  // ---- Escrita (RPCs core_api_v1) ----
  /** core_api_v1.registrar_analise → cria análise + apontamento (indício) + evento. Retorna apontamentoId. */
  registrarAnalise(args: RegistrarAnaliseArgs): Promise<string>;
  /** core_api_v1.aprovar_apontamento → ato privativo do contador (CRC ativo). Retorna apontamentoId. */
  aprovarApontamento(args: AprovarApontamentoArgs): Promise<string>;
  /** core_api_v1.rejeitar_apontamento → rejeição motivada (CRC ativo). Retorna apontamentoId. */
  rejeitarApontamento(args: RejeitarApontamentoArgs): Promise<string>;
  /** core_api_v1.superar_apontamento → supersessão bitemporal (CRC ativo). Retorna apontamentoId. */
  superarApontamento(args: SuperarApontamentoArgs): Promise<string>;
  /** core_api_v1.registrar_closeout → manifesto técnico de fecho (carimbo formal = Fase 4). Retorna closeoutId. */
  registrarCloseout(args: RegistrarCloseoutArgs): Promise<string>;
}

export interface CreateApiClientOptions {
  mode?: "mock" | "supabase";
  /** Semente determinística para o mock (default: dataset sintético padrão da Fase 1). */
  seed?: import("./mock-data").SeedDataset;
}
