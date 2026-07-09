// Testes de CONTRATO do SupabaseApiClient sobre um transport FAKE in-memory.
// Rede real é PROIBIDA nesta fase — o fake registra chamadas de RPC/leitura e
// devolve respostas simuladas. Roda sobre o dist compilado (npm test = build && node).
//
// Cobre TODOS os métodos da interface ContadorApiClient:
//   (a) mapeamento arg TS → parâmetro SQL (nomes snake_case EXATOS das migrations)
//   (b) mapeamento linha SQL (snake_case) → tipo TS (camelCase) dos read models
//   (c) propagação de erro (error do transport → throw com contexto)
//   (d) factory (mode supabase exige transport; mock permanece default)
//   (e) shape do createFetchTransport (sem tocar a rede)

import { createApiClient, SupabaseApiClient, createFetchTransport } from "../dist/index.js";

let failures = 0;
function check(name, cond) {
  if (cond) {
    console.log(`  ok  ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${name}`);
  }
}
async function throwsAsync(fn) {
  try {
    await fn();
    return null;
  } catch (e) {
    return e;
  }
}
function keysPresent(obj, keys) {
  return keys.every((k) => Object.prototype.hasOwnProperty.call(obj, k));
}
function noCamelLeak(obj) {
  // Nenhum parâmetro deve vazar em camelCase (tudo é snake_case do SQL).
  return Object.keys(obj).every((k) => k.startsWith("p_") && !/[A-Z]/.test(k));
}

// --------------------------------------------------------------------------
// Transport FAKE
// --------------------------------------------------------------------------
function makeFakeTransport() {
  const rpcCalls = [];
  const readCalls = [];
  const readFixtures = new Map();
  let failMessage = null;

  const transport = {
    __rpcCalls: rpcCalls,
    __readCalls: readCalls,
    setReadFixture(schema, table, rows) {
      readFixtures.set(`${schema}.${table}`, rows);
    },
    failNext(message) {
      failMessage = message;
    },
    lastRpc() {
      return rpcCalls[rpcCalls.length - 1];
    },
    lastRead() {
      return readCalls[readCalls.length - 1];
    },
    schema(name) {
      return {
        rpc(fn, args) {
          rpcCalls.push({ schema: name, fn, args });
          if (failMessage) {
            const m = failMessage;
            failMessage = null;
            return Promise.resolve({ data: null, error: { message: m } });
          }
          // Funções core_api_v1.* retornam o id (uuid) — devolve id sintético.
          return Promise.resolve({ data: `rpc-return-${fn}`, error: null });
        },
        from(table) {
          const filters = [];
          let columns = "*";
          const builder = {
            select(cols) {
              if (cols) columns = cols;
              return builder;
            },
            eq(col, val) {
              filters.push([col, val]);
              return builder;
            },
            then(onFulfilled, onRejected) {
              readCalls.push({ schema: name, table, columns, filters });
              let result;
              if (failMessage) {
                const m = failMessage;
                failMessage = null;
                result = { data: null, error: { message: m } };
              } else {
                result = { data: readFixtures.get(`${name}.${table}`) ?? [], error: null };
              }
              return Promise.resolve(result).then(onFulfilled, onRejected);
            },
          };
          return builder;
        },
      };
    },
  };
  return transport;
}

// --------------------------------------------------------------------------
// (d) Factory
// --------------------------------------------------------------------------
console.log("── factory ──");
{
  const mock = createApiClient({ mode: "mock" });
  check("mode:'mock' continua sendo o default (mock intocado)", mock.mode === "mock");

  const semTransport = await throwsAsync(async () => createApiClient({ mode: "supabase" }));
  check(
    "mode:'supabase' sem transport lança erro honesto (cita transport)",
    semTransport instanceof Error && /transport/i.test(semTransport.message),
  );

  const transport = makeFakeTransport();
  const sb = createApiClient({ mode: "supabase", transport });
  check("mode:'supabase' + transport → SupabaseApiClient", sb instanceof SupabaseApiClient && sb.mode === "supabase");

  const badTransport = await throwsAsync(async () => new SupabaseApiClient(null));
  check("SupabaseApiClient(null) lança (transport inválido)", badTransport instanceof Error);
}

// --------------------------------------------------------------------------
// (a) Escrita: arg TS → parâmetro SQL (nomes snake_case EXATOS)
// --------------------------------------------------------------------------
console.log("\n── escrita: mapeamento arg → parâmetro SQL ──");
{
  const t = makeFakeTransport();
  const api = new SupabaseApiClient(t);

  // registrar_analise (001, linhas 633-652)
  const idAnalise = await api.registrarAnalise({
    escritorioId: "esc-1",
    clienteId: "cli-1",
    itemId: "item-1",
    motorVersaoId: "motor-1",
    baseVersaoId: "base-1",
    tipoDivergencia: "cclasstrib_divergente",
    descricao: "Indício de teste.",
    confianca: 0.7,
    fundamento: ["ref-1"],
    cclasstribReferencia: "200003",
    valorEnvolvido: 1000,
    tipoInferencia: "regra_deterministica",
  });
  let call = t.lastRpc();
  check("registrar_analise → schema core_api_v1", call.schema === "core_api_v1");
  check("registrar_analise → fn correto", call.fn === "registrar_analise");
  check(
    "registrar_analise → params obrigatórios snake_case",
    keysPresent(call.args, [
      "p_escritorio_id",
      "p_cliente_id",
      "p_item_id",
      "p_motor_versao_id",
      "p_base_versao_id",
      "p_tipo_divergencia",
      "p_descricao",
    ]),
  );
  check(
    "registrar_analise → opcionais snake_case (confianca/fundamento/cclasstrib_referencia/valor_envolvido/tipo_inferencia)",
    keysPresent(call.args, [
      "p_confianca",
      "p_fundamento",
      "p_cclasstrib_referencia",
      "p_valor_envolvido",
      "p_tipo_inferencia",
    ]),
  );
  check("registrar_analise → valores repassados fielmente", call.args.p_escritorio_id === "esc-1" && call.args.p_descricao === "Indício de teste." && call.args.p_confianca === 0.7);
  check("registrar_analise → nenhum vazamento camelCase", noCamelLeak(call.args));
  check("registrar_analise → retorna o id (string) da RPC", idAnalise === "rpc-return-registrar_analise");

  // registrar_analise: opcional omitido NÃO é enviado (SQL aplica default)
  await api.registrarAnalise({
    escritorioId: "esc-1",
    clienteId: "cli-1",
    itemId: "item-1",
    motorVersaoId: "motor-1",
    baseVersaoId: "base-1",
    tipoDivergencia: "outro",
    descricao: "Sem opcionais.",
  });
  call = t.lastRpc();
  check(
    "registrar_analise → opcionais omitidos não são enviados (deixa o default SQL)",
    !("p_confianca" in call.args) && !("p_tipo_inferencia" in call.args) && !("p_valor_envolvido" in call.args),
  );

  // aprovar_apontamento (003)
  await api.aprovarApontamento({ apontamentoId: "ap-1", revisorId: "rev-1", motivoTexto: "Revisado." });
  call = t.lastRpc();
  check(
    "aprovar_apontamento → fn + params (p_apontamento_id/p_revisor_id/p_motivo_texto)",
    call.fn === "aprovar_apontamento" && keysPresent(call.args, ["p_apontamento_id", "p_revisor_id", "p_motivo_texto"]) && noCamelLeak(call.args),
  );

  // rejeitar_apontamento (003) — motivoCodigo obrigatório
  await api.rejeitarApontamento({ apontamentoId: "ap-1", revisorId: "rev-1", motivoCodigo: "sem_fundamento", motivoTexto: null });
  call = t.lastRpc();
  check(
    "rejeitar_apontamento → fn + p_motivo_codigo obrigatório presente",
    call.fn === "rejeitar_apontamento" && keysPresent(call.args, ["p_apontamento_id", "p_revisor_id", "p_motivo_codigo"]) && noCamelLeak(call.args),
  );
  const semMotivo = await throwsAsync(async () => api.rejeitarApontamento({ apontamentoId: "ap-1", revisorId: "rev-1", motivoCodigo: "" }));
  check("rejeitar sem motivoCodigo lança (ck_rejeicao_motivada)", semMotivo instanceof Error && /motivoCodigo/.test(semMotivo.message));

  // superar_apontamento (003)
  await api.superarApontamento({ apontamentoId: "ap-1", revisorId: "rev-1", conhecidaEm: "2026-02-01T00:00:00Z", vigencia: "[2026-01-01,2026-12-31)" });
  call = t.lastRpc();
  check(
    "superar_apontamento → fn + p_conhecida_em/p_vigencia (bitemporal)",
    call.fn === "superar_apontamento" && call.args.p_conhecida_em === "2026-02-01T00:00:00Z" && call.args.p_vigencia === "[2026-01-01,2026-12-31)" && noCamelLeak(call.args),
  );

  // registrar_closeout (004) — subset explícito + derivados do manifesto do verificador
  const idClose = await api.registrarCloseout({
    escritorioId: "esc-1",
    tipo: "diario",
    periodoInicio: "2026-01-22T00:00:00.000Z",
    periodoFim: "2026-01-23T00:00:00.000Z",
    eventoCount: 3,
    merkleRoot: "abcd1234",
    verifierVersion: "0.1.0",
    resultado: "pass",
    manifesto: {
      evento_primeiro_seq: 1,
      evento_ultimo_seq: 3,
      evento_primeiro_id: 10,
      evento_ultimo_id: 12,
      hash_ver: 1,
      hash_primeiro: "aa11",
      hash_ultimo: "bb22",
      manifesto_hash: "cc33",
      time_stamp_token_ref: null,
    },
    carimboTempoProvider: "none",
  });
  call = t.lastRpc();
  check(
    "registrar_closeout → fn + params explícitos snake_case",
    call.fn === "registrar_closeout" &&
      keysPresent(call.args, [
        "p_escritorio_id",
        "p_tipo",
        "p_periodo_inicio",
        "p_periodo_fim",
        "p_evento_count",
        "p_merkle_root",
        "p_verifier_version",
        "p_resultado",
        "p_manifesto",
      ]),
  );
  check(
    "registrar_closeout → deriva params exigidos pela DDL a partir do manifesto",
    keysPresent(call.args, [
      "p_evento_primeiro_seq",
      "p_evento_ultimo_seq",
      "p_evento_primeiro_id",
      "p_evento_ultimo_id",
      "p_hash_ver",
      "p_hash_primeiro",
      "p_hash_ultimo",
      "p_manifesto_hash",
    ]),
  );
  check(
    "registrar_closeout → bytea em literal \\x (merkle_root/hash_primeiro/manifesto_hash)",
    call.args.p_merkle_root === "\\xabcd1234" && call.args.p_hash_primeiro === "\\xaa11" && call.args.p_manifesto_hash === "\\xcc33",
  );
  check("registrar_closeout → carimbo repassado (p_time_stamp_provider)", call.args.p_time_stamp_provider === "none");
  check("registrar_closeout → nenhum vazamento camelCase", noCamelLeak(call.args));
  check("registrar_closeout → retorna o id da RPC", idClose === "rpc-return-registrar_closeout");
}

// --------------------------------------------------------------------------
// (b) Leitura: linha SQL (snake) → tipo TS (camel) + schema/tabela/filtros corretos
// --------------------------------------------------------------------------
console.log("\n── leitura: mapeamento linha SQL → tipo TS ──");
{
  const t = makeFakeTransport();
  const api = new SupabaseApiClient(t);

  // getEscritorio
  t.setReadFixture("core", "escritorio", [{ id: "esc-1", nome: "Escritório X", plano: "pro", created_at: "2026-01-02T09:00:00Z" }]);
  const esc = await api.getEscritorio("esc-1");
  let r = t.lastRead();
  check("getEscritorio → schema core / tabela escritorio", r.schema === "core" && r.table === "escritorio");
  check("getEscritorio → filtro id (snake)", r.filters.some(([c, v]) => c === "id" && v === "esc-1"));
  check("getEscritorio → mapeia created_at → createdAt", esc && esc.createdAt === "2026-01-02T09:00:00Z" && esc.plano === "pro");
  t.setReadFixture("core", "escritorio", []);
  const escNull = await api.getEscritorio("nao-existe");
  check("getEscritorio → null quando vazio", escNull === null);

  // listarClientes
  t.setReadFixture("core", "cliente", [{ id: "cli-1", escritorio_id: "esc-1", nome: "Aurora", documento: "11222333000181" }]);
  const clientes = await api.listarClientes("esc-1");
  r = t.lastRead();
  check("listarClientes → filtro escritorio_id (snake)", r.filters.some(([c]) => c === "escritorio_id"));
  check("listarClientes → mapeia escritorio_id → escritorioId", clientes[0].escritorioId === "esc-1" && clientes[0].documento === "11222333000181");

  // listarContadores
  t.setReadFixture("core", "usuario", [
    { id: "u-1", escritorio_id: "esc-1", nome: "Marina", email: "m@x", papel: "contador", cpf: "12345678901", crc: "1SP-099999/O-0", crc_uf: "SP", crc_situacao: "ativo", ativo: true },
  ]);
  const contadores = await api.listarContadores("esc-1");
  r = t.lastRead();
  check("listarContadores → filtra papel='contador' (snake)", r.filters.some(([c, v]) => c === "papel" && v === "contador"));
  check("listarContadores → mapeia crc_situacao/crc_uf → crcSituacao/crcUf", contadores[0].crcSituacao === "ativo" && contadores[0].crcUf === "SP" && contadores[0].ativo === true);

  // listarNotas — classeInsumo derivada da origem
  t.setReadFixture("core", "nota", [
    { id: "n-1", escritorio_id: "esc-1", cliente_id: "cli-1", competencia: "2026-01-01", tipo: "nfe", direcao: "venda", numero: "1001", serie: "1", emitida_em: "2026-01-08", emitente_cnpj: "11222333000181", destinatario_doc: "99888777000166", valor_total: 4200, origem: "upload", status_auditoria: "analisada" },
    { id: "n-2", escritorio_id: "esc-1", cliente_id: "cli-2", competencia: "2026-01-01", tipo: "nfe", direcao: "venda", numero: "2050", serie: "1", emitida_em: "2026-01-11", emitente_cnpj: "22333444000172", destinatario_doc: null, valor_total: 15600, origem: "provider_ocr", status_auditoria: "analisada" },
  ]);
  const notas = await api.listarNotas("esc-1");
  check("listarNotas → valor_total → valorTotal (number)", notas[0].valorTotal === 4200 && typeof notas[0].valorTotal === "number");
  check("listarNotas → classeInsumo derivada (upload=xml, provider_ocr=ocr)", notas[0].classeInsumo === "xml" && notas[1].classeInsumo === "ocr");
  check("listarNotas → emitida_em/emitente_cnpj/destinatario_doc mapeados", notas[0].emitidaEm === "2026-01-08" && notas[0].emitenteCnpj === "11222333000181" && notas[1].destinatarioDoc === null);
  const notasCli = await api.listarNotas("esc-1", "cli-1");
  r = t.lastRead();
  check("listarNotas(clienteId) → adiciona filtro cliente_id", r.filters.some(([c, v]) => c === "cliente_id" && v === "cli-1"));
  void notasCli;

  // listarItens
  t.setReadFixture("core", "nota_item", [
    { id: "it-1", escritorio_id: "esc-1", nota_id: "n-1", competencia: "2026-01-01", numero_item: 1, descricao: "Refrigerante", ncm: "22021000", cfop: "5102", cst: "00", cclasstrib_informado: "000001", quantidade: 1, valor_item: 2200 },
  ]);
  const itens = await api.listarItens("n-1");
  r = t.lastRead();
  check("listarItens → filtro nota_id (snake)", r.filters.some(([c, v]) => c === "nota_id" && v === "n-1"));
  check("listarItens → numero_item/cclasstrib_informado/valor_item mapeados", itens[0].numeroItem === 1 && itens[0].cclasstribInformado === "000001" && itens[0].valorItem === 2200);

  // listarBasesReferencia — schema ref + sintetica derivada de fonte
  t.setReadFixture("ref", "base_versao", [
    { id: "b-1", rotulo: "base-demo (sintética)", fonte: "sintetica", vigente_desde: "2026-01-01" },
    { id: "b-2", rotulo: "base oficial", fonte: "oficial", vigente_desde: "2026-01-01" },
  ]);
  const bases = await api.listarBasesReferencia("esc-1");
  r = t.lastRead();
  check("listarBasesReferencia → schema ref / tabela base_versao", r.schema === "ref" && r.table === "base_versao");
  check("listarBasesReferencia → sintetica derivada da fonte", bases[0].sintetica === true && bases[1].sintetica === false && bases[0].vigenteDesde === "2026-01-01");

  // listarMotores — schema ref
  t.setReadFixture("ref", "motor_versao", [
    { id: "m-1", rotulo: "motor-f1", codigo_versao: "0.1.0", tipo_inferencia: "regra_deterministica", status: "vigente" },
  ]);
  const motores = await api.listarMotores("esc-1");
  r = t.lastRead();
  check("listarMotores → schema ref / tabela motor_versao", r.schema === "ref" && r.table === "motor_versao");
  check("listarMotores → codigo_versao/tipo_inferencia mapeados", motores[0].codigoVersao === "0.1.0" && motores[0].tipoInferencia === "regra_deterministica");

  // listarApontamentos
  t.setReadFixture("core", "apontamento_auditoria", [
    { id: "ap-1", escritorio_id: "esc-1", cliente_id: "cli-1", item_id: "it-1", base_versao_id: "b-1", motor_versao_id: "m-1", analise_execucao_id: null, tipo_inferencia: "regra_deterministica", origem: "motor", tipo_divergencia: "monofasico_tributado", cclasstrib_referencia: "200002", descricao: "Indício.", valor_envolvido: 2200, confianca: 0.82, banda_confianca: "media", fundamento: ["ref sintética"], status: "pendente", revisor_id: null, revisado_em: null, motivo_codigo: null, motivo_texto: null },
  ]);
  const aps = await api.listarApontamentos({ escritorioId: "esc-1", status: "pendente" });
  r = t.lastRead();
  check("listarApontamentos → filtros escritorio_id + status (snake)", r.filters.some(([c]) => c === "escritorio_id") && r.filters.some(([c, v]) => c === "status" && v === "pendente"));
  check("listarApontamentos → base_versao_id/motor_versao_id/valor_envolvido/banda_confianca mapeados", aps[0].baseVersaoId === "b-1" && aps[0].motorVersaoId === "m-1" && aps[0].valorEnvolvido === 2200 && aps[0].bandaConfianca === "media");
  check("listarApontamentos → confianca (number) + fundamento (array) preservados", aps[0].confianca === 0.82 && Array.isArray(aps[0].fundamento) && aps[0].fundamento[0] === "ref sintética");

  // getApontamento
  const apOne = await api.getApontamento("ap-1");
  check("getApontamento → mapeia tipo_divergencia → tipoDivergencia", apOne && apOne.tipoDivergencia === "monofasico_tributado" && apOne.cclasstribReferencia === "200002");
  t.setReadFixture("core", "apontamento_auditoria", []);
  const apNone = await api.getApontamento("nao-existe");
  check("getApontamento → null quando vazio", apNone === null);

  // listarEventos
  t.setReadFixture("core", "evento_boa_fe", [
    { id: 5, escritorio_id: "esc-1", seq_tenant: 5, hash_ver: 1, tipo_evento: "apontamento_aprovado", ator_tipo: "usuario", ator_id: "u-1", referente_tipo: "apontamento", referente_id: "ap-1", nota_id: "n-1", apontamento_id: "ap-1", laudo_id: null, payload: { motivo_codigo: "aprovado" }, ocorrido_em: "2026-01-22T13:00:00Z", hash_anterior: "aa", hash_evento: "bb" },
  ]);
  const eventos = await api.listarEventos({ escritorioId: "esc-1", referenteTipo: "apontamento", referenteId: "ap-1" });
  r = t.lastRead();
  check("listarEventos → filtros referente_tipo + referente_id (snake)", r.filters.some(([c, v]) => c === "referente_tipo" && v === "apontamento") && r.filters.some(([c, v]) => c === "referente_id" && v === "ap-1"));
  check("listarEventos → seq_tenant/hash_ver/tipo_evento/ator_tipo mapeados", eventos[0].seqTenant === 5 && eventos[0].hashVer === 1 && eventos[0].tipoEvento === "apontamento_aprovado" && eventos[0].atorTipo === "usuario");
  check("listarEventos → payload/hash_anterior/hash_evento preservados", eventos[0].payload.motivo_codigo === "aprovado" && eventos[0].hashAnterior === "aa" && eventos[0].hashEvento === "bb");

  // listarCloseouts
  t.setReadFixture("core", "closeout_lote", [
    { id: "co-1", escritorio_id: "esc-1", tipo: "diario", periodo_inicio: "2026-01-22T00:00:00Z", periodo_fim: "2026-01-23T00:00:00Z", evento_count: 3, merkle_root: "\\xdeadbeef", verifier_version: "0.1.0", resultado: "pass", time_stamp_provider: "none", executado_em: "2026-01-23T00:00:00Z" },
  ]);
  const closeouts = await api.listarCloseouts("esc-1");
  r = t.lastRead();
  check("listarCloseouts → filtro escritorio_id (snake)", r.filters.some(([c]) => c === "escritorio_id"));
  check("listarCloseouts → time_stamp_provider → carimboTempoProvider; evento_count → eventoCount", closeouts[0].carimboTempoProvider === "none" && closeouts[0].eventoCount === 3 && closeouts[0].verifierVersion === "0.1.0");
}

// --------------------------------------------------------------------------
// (c) Propagação de erro (error do transport → throw com contexto)
// --------------------------------------------------------------------------
console.log("\n── erros honestos ──");
{
  const t = makeFakeTransport();
  const api = new SupabaseApiClient(t);

  t.failNext("permission denied for schema core_api_v1");
  const wErr = await throwsAsync(async () => api.aprovarApontamento({ apontamentoId: "ap-1", revisorId: "rev-1" }));
  check("RPC com error → throw citando a RPC e a mensagem", wErr instanceof Error && /aprovar_apontamento/.test(wErr.message) && /permission denied/.test(wErr.message));

  t.failNext("RLS: nenhuma linha visível para o tenant");
  const rErr = await throwsAsync(async () => api.listarClientes("esc-1"));
  check("Leitura com error → throw citando schema.tabela e a mensagem", rErr instanceof Error && /core\.cliente/.test(rErr.message) && /RLS/.test(rErr.message));
}

// --------------------------------------------------------------------------
// (e) createFetchTransport — shape (sem tocar a rede)
// --------------------------------------------------------------------------
console.log("\n── createFetchTransport (shape, sem rede) ──");
{
  const ft = createFetchTransport({ url: "https://exemplo.supabase.co/", apiKey: "anon-key" });
  check("createFetchTransport → expõe schema()", typeof ft.schema === "function");
  const scoped = ft.schema("core_api_v1");
  check("schema() → expõe rpc() e from()", typeof scoped.rpc === "function" && typeof scoped.from === "function");
  const rb = scoped.from("nota").select("*");
  check("from().select() → builder encadeável e thenable", typeof rb.eq === "function" && typeof rb.then === "function");
  // Atribuível a SupabaseApiClient (contrato de transport) sem tocar a rede.
  const apiFt = new SupabaseApiClient(ft);
  check("SupabaseApiClient aceita o fetch transport", apiFt.mode === "supabase");
}

if (failures > 0) {
  console.error(`\n${failures} verificação(ões) de contrato falharam.`);
  process.exit(1);
}
console.log("\nSupabase contract test: todas as verificações passaram.");
