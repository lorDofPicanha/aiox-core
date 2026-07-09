/**
 * SupabaseApiClient — implementação de `ContadorApiClient` sobre a published API
 * `core_api_v1` (RPCs) + read models (`core.*` / `ref.*`) num Postgres Supabase real.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TRANSPORT INJETÁVEL (sem dependência de @supabase/supabase-js)
 * ─────────────────────────────────────────────────────────────────────────────
 * Este client NÃO importa `@supabase/supabase-js`. Ele depende de uma interface
 * estrutural mínima — `SupabaseTransportLike` — que expõe só o subconjunto usado:
 *
 *   transport.schema(name).rpc(fn, args)          → { data, error }
 *   transport.schema(name).from(table).select().eq(col, val) → { data, error }
 *
 * Essa forma é um SUBCONJUNTO ESTRUTURAL do client real do supabase-js. Quando as
 * chaves chegarem (F2.1/F2.2) e o pacote adicionar `@supabase/supabase-js`, o
 * client criado por `createClient(url, anonKey)` é ATRIBUÍVEL a `SupabaseTransportLike`
 * sem cast, porque `SupabaseClient` já expõe `.schema(name)` retornando um
 * `PostgrestClient` com `.rpc` e `.from(...).select().eq(...)` — todos compatíveis
 * (métodos são bivariantes em TS; `SupabaseTransportResult` é um subconjunto de
 * `PostgrestResponse`). Ou seja:
 *
 *   import { createClient } from "@supabase/supabase-js";
 *   const transport: SupabaseTransportLike = createClient(url, anonKey); // ok
 *   const api = new SupabaseApiClient(transport);
 *
 * Para o caminho de produção sem supabase-js, use `createFetchTransport({url,apiKey})`
 * (implementação PostgREST zero-dependência, abaixo). Nos testes de contrato usamos
 * um transport FAKE in-memory — rede real é proibida nesta fase.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ERROS HONESTOS
 * ─────────────────────────────────────────────────────────────────────────────
 * Todo `error` não-nulo do transport vira `throw new Error(...)` com contexto
 * (nome da RPC / tabela + mensagem). Nunca engole erro, nunca devolve default
 * silencioso — o app precisa saber quando o backend recusou.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HUMAN-IN-LOOP (§4 do handoff)
 * ─────────────────────────────────────────────────────────────────────────────
 * As RPCs de decisão (`aprovar/rejeitar/superar_apontamento`) exigem ator=contador
 * com CRC ativo + evidência individualizada — isso é imposto pelo SQL (migr. 002/003).
 * Este client só REPASSA os argumentos; não afrouxa nada, não decide em lote.
 */

import type { ContadorApiClient } from "./client";
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

// ---------------------------------------------------------------------------
// Transport estrutural (subconjunto compatível com @supabase/supabase-js)
// ---------------------------------------------------------------------------

/** Erro do transport — subconjunto estrutural de `PostgrestError` do supabase-js. */
export interface SupabaseTransportError {
  message: string;
  code?: string;
  details?: string | null;
  hint?: string | null;
}

/** Envelope de resposta — subconjunto de `PostgrestResponse` (`{ data, error, ... }`). */
export interface SupabaseTransportResult<T> {
  data: T | null;
  error: SupabaseTransportError | null;
}

/**
 * Builder de leitura encadeável e "thenable" (await-ável).
 * Subconjunto estrutural do `PostgrestFilterBuilder` do supabase-js.
 */
export interface SupabaseReadBuilderLike<Row>
  extends PromiseLike<SupabaseTransportResult<Row[]>> {
  select(columns?: string): SupabaseReadBuilderLike<Row>;
  eq(column: string, value: unknown): SupabaseReadBuilderLike<Row>;
}

/** Builder retornado por `from(table)` — expõe só `.select(...)`. */
export interface SupabaseQueryBuilderLike<Row> {
  select(columns?: string): SupabaseReadBuilderLike<Row>;
}

/** Client escopado a um schema — subconjunto do `PostgrestClient` do supabase-js. */
export interface SupabaseSchemaLike {
  rpc(
    fn: string,
    args?: Record<string, unknown>,
  ): PromiseLike<SupabaseTransportResult<unknown>>;
  from(table: string): SupabaseQueryBuilderLike<Record<string, unknown>>;
}

/**
 * Transport-raiz. Subconjunto estrutural do `SupabaseClient` (retorno de
 * `createClient(url, key)`), que expõe `.schema(name)` para acessar cada schema
 * exposto pelo PostgREST (`core_api_v1` p/ RPCs, `core`/`ref` p/ leitura).
 */
export interface SupabaseTransportLike {
  schema(name: string): SupabaseSchemaLike;
}

// Schemas expostos pelo PostgREST (ver migrations 001–004).
const SCHEMA_API = "core_api_v1"; // published write API (RPCs)
const SCHEMA_CORE = "core"; // read models do contexto APURAÇÃO
const SCHEMA_REF = "ref"; // bases/motores de referência

type Row = Record<string, unknown>;

// ---------------------------------------------------------------------------
// SupabaseApiClient
// ---------------------------------------------------------------------------

export class SupabaseApiClient implements ContadorApiClient {
  readonly mode = "supabase" as const;

  constructor(private readonly transport: SupabaseTransportLike) {
    if (!transport || typeof transport.schema !== "function") {
      throw new Error(
        "[SupabaseApiClient] transport inválido: esperado um objeto com `schema(name)` " +
          "(client @supabase/supabase-js ou createFetchTransport({url, apiKey})).",
      );
    }
  }

  // ------------------------------- Leitura -------------------------------

  async getEscritorio(escritorioId: string): Promise<Escritorio | null> {
    const rows = await this.selectRows(SCHEMA_CORE, "escritorio", [["id", escritorioId]]);
    return rows.length > 0 ? mapEscritorio(rows[0]) : null;
  }

  async listarClientes(escritorioId: string): Promise<Cliente[]> {
    const rows = await this.selectRows(SCHEMA_CORE, "cliente", [["escritorio_id", escritorioId]]);
    return rows.map(mapCliente);
  }

  async listarContadores(escritorioId: string): Promise<Usuario[]> {
    const rows = await this.selectRows(SCHEMA_CORE, "usuario", [
      ["escritorio_id", escritorioId],
      ["papel", "contador"],
    ]);
    return rows.map(mapUsuario);
  }

  async listarNotas(escritorioId: string, clienteId?: string): Promise<Nota[]> {
    const filters: Array<[string, unknown]> = [["escritorio_id", escritorioId]];
    if (clienteId) filters.push(["cliente_id", clienteId]);
    const rows = await this.selectRows(SCHEMA_CORE, "nota", filters);
    return rows.map(mapNota);
  }

  async listarItens(notaId: string): Promise<NotaItem[]> {
    const rows = await this.selectRows(SCHEMA_CORE, "nota_item", [["nota_id", notaId]]);
    return rows.map(mapNotaItem);
  }

  async listarBasesReferencia(escritorioId: string): Promise<BaseVersao[]> {
    // ref.base_versao é uma referência GLOBAL (sem escritorio_id na DDL). O escopo
    // por tenant seria via core.base_adocao — refinamento pendente (F2.1). Por ora,
    // reflete a semântica do mock: lista as versões de base disponíveis.
    void escritorioId;
    const rows = await this.selectRows(SCHEMA_REF, "base_versao", []);
    return rows.map(mapBaseVersao);
  }

  async listarMotores(escritorioId: string): Promise<MotorVersao[]> {
    // ref.motor_versao também é global (sem escritorio_id). Ver nota em listarBasesReferencia.
    void escritorioId;
    const rows = await this.selectRows(SCHEMA_REF, "motor_versao", []);
    return rows.map(mapMotorVersao);
  }

  async listarApontamentos(filtro: ListarApontamentosFiltro): Promise<Apontamento[]> {
    const filters: Array<[string, unknown]> = [["escritorio_id", filtro.escritorioId]];
    if (filtro.clienteId) filters.push(["cliente_id", filtro.clienteId]);
    if (filtro.status) filters.push(["status", filtro.status]);
    const rows = await this.selectRows(SCHEMA_CORE, "apontamento_auditoria", filters);
    return rows.map(mapApontamento);
  }

  async getApontamento(apontamentoId: string): Promise<Apontamento | null> {
    const rows = await this.selectRows(SCHEMA_CORE, "apontamento_auditoria", [["id", apontamentoId]]);
    return rows.length > 0 ? mapApontamento(rows[0]) : null;
  }

  async listarEventos(filtro: ListarEventosFiltro): Promise<EventoBoaFe[]> {
    const filters: Array<[string, unknown]> = [["escritorio_id", filtro.escritorioId]];
    if (filtro.referenteTipo) filters.push(["referente_tipo", filtro.referenteTipo]);
    if (filtro.referenteId) filters.push(["referente_id", filtro.referenteId]);
    const rows = await this.selectRows(SCHEMA_CORE, "evento_boa_fe", filters);
    return rows.map(mapEventoBoaFe);
  }

  async listarCloseouts(escritorioId: string): Promise<CloseoutLote[]> {
    const rows = await this.selectRows(SCHEMA_CORE, "closeout_lote", [["escritorio_id", escritorioId]]);
    return rows.map(mapCloseoutLote);
  }

  // ------------------------------- Escrita (RPCs) -------------------------------

  async registrarAnalise(args: RegistrarAnaliseArgs): Promise<string> {
    const params: Record<string, unknown> = {
      p_escritorio_id: args.escritorioId,
      p_cliente_id: args.clienteId,
      p_item_id: args.itemId,
      p_motor_versao_id: args.motorVersaoId,
      p_base_versao_id: args.baseVersaoId,
      p_tipo_divergencia: args.tipoDivergencia,
      p_descricao: args.descricao,
    };
    // Opcionais: só enviamos quando definidos, para o SQL aplicar seus defaults.
    if (args.confianca !== undefined) params.p_confianca = args.confianca;
    if (args.fundamento !== undefined) params.p_fundamento = args.fundamento;
    if (args.cclasstribReferencia !== undefined) params.p_cclasstrib_referencia = args.cclasstribReferencia;
    if (args.valorEnvolvido !== undefined) params.p_valor_envolvido = args.valorEnvolvido;
    if (args.regraId !== undefined) params.p_regra_id = args.regraId;
    if (args.tipoInferencia !== undefined) params.p_tipo_inferencia = args.tipoInferencia;
    return this.callRpc("registrar_analise", params);
  }

  async aprovarApontamento(args: AprovarApontamentoArgs): Promise<string> {
    const params: Record<string, unknown> = {
      p_apontamento_id: args.apontamentoId,
      p_revisor_id: args.revisorId,
    };
    if (args.motivoCodigo !== undefined) params.p_motivo_codigo = args.motivoCodigo;
    if (args.motivoTexto !== undefined) params.p_motivo_texto = args.motivoTexto;
    return this.callRpc("aprovar_apontamento", params);
  }

  async rejeitarApontamento(args: RejeitarApontamentoArgs): Promise<string> {
    if (!args.motivoCodigo) {
      // Espelha ck_rejeicao_motivada (001): rejeição sem motivo é recusada.
      throw new Error("[ck_rejeicao_motivada] motivoCodigo é obrigatório para rejeitar.");
    }
    const params: Record<string, unknown> = {
      p_apontamento_id: args.apontamentoId,
      p_revisor_id: args.revisorId,
      p_motivo_codigo: args.motivoCodigo,
    };
    if (args.motivoTexto !== undefined) params.p_motivo_texto = args.motivoTexto;
    return this.callRpc("rejeitar_apontamento", params);
  }

  async superarApontamento(args: SuperarApontamentoArgs): Promise<string> {
    const params: Record<string, unknown> = {
      p_apontamento_id: args.apontamentoId,
      p_revisor_id: args.revisorId,
      p_conhecida_em: args.conhecidaEm,
      p_vigencia: args.vigencia,
    };
    return this.callRpc("superar_apontamento", params);
  }

  async registrarCloseout(args: RegistrarCloseoutArgs): Promise<string> {
    // O `manifesto` é o CloseoutManifest do @synkra/contador-trilha-verifier: ele
    // carrega, em snake_case EXATO, os campos que a DDL de registrar_closeout (004)
    // exige mas que RegistrarCloseoutArgs (subset da Fase 1) não expõe diretamente.
    const manifesto = (args.manifesto ?? {}) as Record<string, unknown>;
    const params: Record<string, unknown> = {
      p_escritorio_id: args.escritorioId,
      p_tipo: args.tipo,
      p_periodo_inicio: args.periodoInicio,
      p_periodo_fim: args.periodoFim,
      p_evento_count: args.eventoCount,
      p_merkle_root: toByteaParam(args.merkleRoot),
      p_verifier_version: args.verifierVersion,
      p_resultado: args.resultado,
      p_manifesto: manifesto,
    };
    // Campos exigidos pela DDL, derivados do manifesto do verificador quando presentes.
    setIfDefined(params, "p_evento_primeiro_seq", manifesto.evento_primeiro_seq);
    setIfDefined(params, "p_evento_ultimo_seq", manifesto.evento_ultimo_seq);
    setIfDefined(params, "p_evento_primeiro_id", manifesto.evento_primeiro_id);
    setIfDefined(params, "p_evento_ultimo_id", manifesto.evento_ultimo_id);
    setIfDefined(params, "p_hash_ver", manifesto.hash_ver);
    setIfDefined(params, "p_hash_primeiro", toByteaParam(manifesto.hash_primeiro));
    setIfDefined(params, "p_hash_ultimo", toByteaParam(manifesto.hash_ultimo));
    setIfDefined(params, "p_manifesto_hash", toByteaParam(manifesto.manifesto_hash));
    if (args.executadoPor !== undefined) params.p_executado_por = args.executadoPor;
    if (args.carimboTempoProvider !== undefined) params.p_time_stamp_provider = args.carimboTempoProvider;
    if (manifesto.time_stamp_token_ref != null) params.p_time_stamp_token_ref = manifesto.time_stamp_token_ref;
    return this.callRpc("registrar_closeout", params);
  }

  // ------------------------------- Internals -------------------------------

  private async selectRows(
    schema: string,
    table: string,
    filters: Array<[string, unknown]>,
  ): Promise<Row[]> {
    let builder = this.transport.schema(schema).from(table).select("*");
    for (const [column, value] of filters) {
      builder = builder.eq(column, value);
    }
    const result = await builder;
    if (result.error) {
      throw new Error(
        `[SupabaseApiClient] leitura ${schema}.${table} falhou: ${result.error.message}`,
      );
    }
    return (result.data ?? []) as Row[];
  }

  private async callRpc(fn: string, params: Record<string, unknown>): Promise<string> {
    const result = await this.transport.schema(SCHEMA_API).rpc(fn, params);
    if (result.error) {
      throw new Error(`[SupabaseApiClient] RPC ${SCHEMA_API}.${fn} falhou: ${result.error.message}`);
    }
    if (result.data == null) {
      throw new Error(`[SupabaseApiClient] RPC ${SCHEMA_API}.${fn} não retornou id.`);
    }
    return String(result.data);
  }
}

// ---------------------------------------------------------------------------
// createFetchTransport — PostgREST zero-dependência (caminho de produção)
// ---------------------------------------------------------------------------

export interface FetchTransportOptions {
  /** Base do projeto Supabase, ex.: https://xyz.supabase.co */
  url: string;
  /** Chave usada em `apikey` e `Authorization: Bearer` (anon key + JWT via RLS). */
  apiKey: string;
  /** Schema default para RPC quando `.schema()` não é chamado (default: core_api_v1). */
  schema?: string;
  /** Injeção do fetch (default: globalThis.fetch). Permite futuro teste sem rede. */
  fetch?: typeof fetch;
}

/**
 * Implementação do protocolo PostgREST sem dependências:
 *   - RPC:     POST {url}/rest/v1/rpc/{fn}  (Content-Profile + Accept-Profile = schema)
 *   - Leitura: GET  {url}/rest/v1/{table}?select=...&col=eq.val  (Accept-Profile = schema)
 *
 * Headers: `apikey` + `Authorization: Bearer {apiKey}`.
 *
 * NÃO é usado nos testes (rede real proibida nesta fase) — é o caminho ligado quando
 * as chaves do Supabase chegarem (F2.1/F2.2). O retorno é atribuível a
 * `SupabaseTransportLike`, então `new SupabaseApiClient(createFetchTransport(...))` funciona.
 */
export function createFetchTransport(options: FetchTransportOptions): SupabaseTransportLike {
  const baseUrl = options.url.replace(/\/+$/, "");
  const apiKey = options.apiKey;
  const defaultSchema = options.schema ?? SCHEMA_API;
  const doFetch = options.fetch ?? globalThis.fetch;

  if (typeof doFetch !== "function") {
    throw new Error(
      "[createFetchTransport] fetch indisponível: rode em Node >=18 (fetch global) ou injete `fetch`.",
    );
  }

  const commonHeaders = (): Record<string, string> => ({
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
  });

  const toResult = async (
    res: Response,
  ): Promise<SupabaseTransportResult<unknown>> => {
    const text = await res.text();
    let body: unknown = null;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }
    if (!res.ok) {
      const err = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
      return {
        data: null,
        error: {
          message: typeof err.message === "string" ? err.message : text || `HTTP ${res.status}`,
          code: typeof err.code === "string" ? err.code : String(res.status),
          details: typeof err.details === "string" ? err.details : null,
          hint: typeof err.hint === "string" ? err.hint : null,
        },
      };
    }
    return { data: body, error: null };
  };

  const execRpc = async (
    schema: string,
    fn: string,
    args?: Record<string, unknown>,
  ): Promise<SupabaseTransportResult<unknown>> => {
    const res = await doFetch(`${baseUrl}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: {
        ...commonHeaders(),
        "Content-Type": "application/json",
        Accept: "application/json",
        "Content-Profile": schema,
        "Accept-Profile": schema,
      },
      body: JSON.stringify(args ?? {}),
    });
    return toResult(res);
  };

  const execRead = async (
    schema: string,
    table: string,
    columns: string,
    filters: Array<[string, unknown]>,
  ): Promise<SupabaseTransportResult<unknown[]>> => {
    const params = new URLSearchParams();
    params.set("select", columns);
    for (const [column, value] of filters) {
      params.append(column, `eq.${String(value)}`);
    }
    const res = await doFetch(`${baseUrl}/rest/v1/${table}?${params.toString()}`, {
      method: "GET",
      headers: {
        ...commonHeaders(),
        Accept: "application/json",
        "Accept-Profile": schema,
      },
    });
    const result = await toResult(res);
    // Leitura sempre devolve array; normaliza escalar/nulo defensivamente.
    const data = Array.isArray(result.data) ? result.data : result.data == null ? [] : [result.data];
    return { data: result.error ? null : data, error: result.error };
  };

  const makeReadBuilder = (
    schema: string,
    table: string,
    initialColumns: string,
  ): SupabaseReadBuilderLike<Row> => {
    let columns = initialColumns;
    const filters: Array<[string, unknown]> = [];
    const builder = {
      select(cols?: string) {
        if (cols) columns = cols;
        return builder;
      },
      eq(column: string, value: unknown) {
        filters.push([column, value]);
        return builder;
      },
      then<TResult1 = SupabaseTransportResult<Row[]>, TResult2 = never>(
        onfulfilled?:
          | ((value: SupabaseTransportResult<Row[]>) => TResult1 | PromiseLike<TResult1>)
          | null,
        onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
      ): PromiseLike<TResult1 | TResult2> {
        return execRead(schema, table, columns, filters).then(
          (r) => ({ data: r.data as Row[] | null, error: r.error }),
          undefined,
        ).then(onfulfilled, onrejected);
      },
    };
    return builder as SupabaseReadBuilderLike<Row>;
  };

  const schemaScoped = (name: string): SupabaseSchemaLike => ({
    rpc(fn: string, args?: Record<string, unknown>) {
      return execRpc(name, fn, args);
    },
    from(table: string): SupabaseQueryBuilderLike<Row> {
      return {
        select(cols?: string) {
          return makeReadBuilder(name, table, cols ?? "*");
        },
      };
    },
  });

  return {
    schema(name: string): SupabaseSchemaLike {
      return schemaScoped(name || defaultSchema);
    },
  };
}

// ---------------------------------------------------------------------------
// Helpers de mapeamento (linha SQL snake_case → tipo TS camelCase)
// ---------------------------------------------------------------------------

function asString(value: unknown): string {
  return value == null ? "" : String(value);
}

function asStringOrNull(value: unknown): string | null {
  return value == null ? null : String(value);
}

function asNumber(value: unknown): number {
  return typeof value === "number" ? value : Number(value);
}

function asNumberOrNull(value: unknown): number | null {
  return value == null ? null : typeof value === "number" ? value : Number(value);
}

function asBool(value: unknown): boolean {
  return value === true || value === "true" || value === "t";
}

/** Converte um hex "puro" em literal bytea do Postgres (\x…) para args de RPC PostgREST. */
function toByteaParam(value: unknown): string | null {
  if (value == null) return null;
  const s = String(value);
  if (s === "") return null;
  return s.startsWith("\\x") ? s : `\\x${s}`;
}

function setIfDefined(target: Record<string, unknown>, key: string, value: unknown): void {
  if (value !== undefined && value !== null) target[key] = value;
}

function mapEscritorio(row: Row): Escritorio {
  return {
    id: asString(row.id),
    nome: asString(row.nome),
    plano: asStringOrNull(row.plano),
    createdAt: asString(row.created_at),
  };
}

function mapCliente(row: Row): Cliente {
  return {
    id: asString(row.id),
    escritorioId: asString(row.escritorio_id),
    nome: asString(row.nome),
    documento: asString(row.documento),
  };
}

function mapUsuario(row: Row): Usuario {
  return {
    id: asString(row.id),
    escritorioId: asString(row.escritorio_id),
    nome: asString(row.nome),
    email: asString(row.email),
    papel: row.papel as Usuario["papel"],
    cpf: asStringOrNull(row.cpf),
    crc: asStringOrNull(row.crc),
    crcUf: asStringOrNull(row.crc_uf),
    crcSituacao: (row.crc_situacao ?? null) as Usuario["crcSituacao"],
    ativo: asBool(row.ativo),
  };
}

/** classe_insumo não existe na DDL — é derivada da origem (provider_ocr = ocr, senão xml). */
function classeInsumoDe(origem: unknown): Nota["classeInsumo"] {
  return origem === "provider_ocr" ? "ocr" : "xml";
}

function mapNota(row: Row): Nota {
  return {
    id: asString(row.id),
    escritorioId: asString(row.escritorio_id),
    clienteId: asString(row.cliente_id),
    competencia: asString(row.competencia),
    tipo: row.tipo as Nota["tipo"],
    direcao: row.direcao as Nota["direcao"],
    numero: asStringOrNull(row.numero),
    serie: asStringOrNull(row.serie),
    emitidaEm: asString(row.emitida_em),
    emitenteCnpj: asString(row.emitente_cnpj),
    destinatarioDoc: asStringOrNull(row.destinatario_doc),
    valorTotal: asNumber(row.valor_total),
    origem: row.origem as Nota["origem"],
    classeInsumo: classeInsumoDe(row.origem),
    statusAuditoria: row.status_auditoria as Nota["statusAuditoria"],
  };
}

function mapNotaItem(row: Row): NotaItem {
  return {
    id: asString(row.id),
    escritorioId: asString(row.escritorio_id),
    notaId: asString(row.nota_id),
    competencia: asString(row.competencia),
    numeroItem: asNumber(row.numero_item),
    descricao: asString(row.descricao),
    ncm: asStringOrNull(row.ncm),
    cfop: asStringOrNull(row.cfop),
    cst: asStringOrNull(row.cst),
    cclasstribInformado: asStringOrNull(row.cclasstrib_informado),
    quantidade: asNumberOrNull(row.quantidade),
    valorItem: asNumber(row.valor_item),
  };
}

/** sintetica não existe na DDL — inferida da fonte (fonte='sintetica' ⇒ base de demonstração). */
function mapBaseVersao(row: Row): BaseVersao {
  return {
    id: asString(row.id),
    rotulo: asString(row.rotulo),
    fonte: asString(row.fonte),
    vigenteDesde: asString(row.vigente_desde),
    sintetica: row.fonte === "sintetica",
  };
}

function mapMotorVersao(row: Row): MotorVersao {
  return {
    id: asString(row.id),
    rotulo: asString(row.rotulo),
    codigoVersao: asString(row.codigo_versao),
    tipoInferencia: row.tipo_inferencia as MotorVersao["tipoInferencia"],
    status: row.status as MotorVersao["status"],
  };
}

function mapApontamento(row: Row): Apontamento {
  return {
    id: asString(row.id),
    escritorioId: asString(row.escritorio_id),
    clienteId: asString(row.cliente_id),
    itemId: asString(row.item_id),
    baseVersaoId: asString(row.base_versao_id),
    motorVersaoId: asString(row.motor_versao_id),
    analiseExecucaoId: asStringOrNull(row.analise_execucao_id),
    tipoInferencia: row.tipo_inferencia as Apontamento["tipoInferencia"],
    origem: row.origem as Apontamento["origem"],
    tipoDivergencia: row.tipo_divergencia as Apontamento["tipoDivergencia"],
    cclasstribReferencia: asStringOrNull(row.cclasstrib_referencia),
    descricao: asString(row.descricao),
    valorEnvolvido: asNumberOrNull(row.valor_envolvido),
    confianca: asNumberOrNull(row.confianca),
    bandaConfianca: row.banda_confianca as Apontamento["bandaConfianca"],
    fundamento: Array.isArray(row.fundamento) ? (row.fundamento as string[]) : [],
    status: row.status as Apontamento["status"],
    revisorId: asStringOrNull(row.revisor_id),
    revisadoEm: asStringOrNull(row.revisado_em),
    motivoCodigo: asStringOrNull(row.motivo_codigo),
    motivoTexto: asStringOrNull(row.motivo_texto),
  };
}

function mapEventoBoaFe(row: Row): EventoBoaFe {
  return {
    id: asNumber(row.id),
    escritorioId: asString(row.escritorio_id),
    seqTenant: asNumber(row.seq_tenant),
    hashVer: asNumber(row.hash_ver),
    tipoEvento: row.tipo_evento as EventoBoaFe["tipoEvento"],
    atorTipo: row.ator_tipo as EventoBoaFe["atorTipo"],
    atorId: asStringOrNull(row.ator_id),
    referenteTipo: (row.referente_tipo ?? null) as EventoBoaFe["referenteTipo"],
    referenteId: asStringOrNull(row.referente_id),
    notaId: asStringOrNull(row.nota_id),
    apontamentoId: asStringOrNull(row.apontamento_id),
    laudoId: asStringOrNull(row.laudo_id),
    payload: (row.payload ?? {}) as Record<string, unknown>,
    ocorridoEm: asString(row.ocorrido_em),
    hashAnterior: asString(row.hash_anterior),
    hashEvento: asString(row.hash_evento),
  };
}

function mapCloseoutLote(row: Row): CloseoutLote {
  return {
    id: asString(row.id),
    escritorioId: asString(row.escritorio_id),
    tipo: row.tipo as CloseoutLote["tipo"],
    periodoInicio: asString(row.periodo_inicio),
    periodoFim: asString(row.periodo_fim),
    eventoCount: asNumber(row.evento_count),
    merkleRoot: asStringOrNull(row.merkle_root),
    verifierVersion: asString(row.verifier_version),
    resultado: row.resultado as CloseoutLote["resultado"],
    carimboTempoProvider: row.time_stamp_provider as CloseoutLote["carimboTempoProvider"],
    executadoEm: asString(row.executado_em),
  };
}
