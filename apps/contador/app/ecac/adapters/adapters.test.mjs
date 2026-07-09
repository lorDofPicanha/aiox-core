/**
 * S1 + S4 — Testes dos ADAPTERS em MODO FIXTURE (Integra Contador + Infosimples + composição).
 *
 * Runner sem framework (espelha saude-fiscal-model.test.mjs): importa os adapters .ts DIRETO
 * (Node ≥ 24 type-stripping). SEM env de credencial → modo fixture → ZERO rede (os testes
 * NUNCA batem no Fisco). Cobre a TRADUÇÃO dialeto SERPRO/Infosimples → contratos brutos (FF-1).
 *
 * Rodar:  node app/ecac/adapters/adapters.test.mjs   (a partir de apps/contador)
 *
 * G6: as descrições traduzidas usam "indício"; não afirmam "regularizado".
 */

// Garante MODO FIXTURE independentemente do ambiente (defensivo).
delete process.env.SERPRO_CONSUMER_KEY;
delete process.env.SERPRO_CONSUMER_SECRET;
delete process.env.SERPRO_BASE_URL;
delete process.env.INFOSIMPLES_TOKEN;

import {
  IntegraContadorAdapter,
  isSerproFixtureMode,
  serproParaMensagemBruta,
} from "./integra-contador-adapter.ts";
import {
  InfosimplesAdapter,
  isInfosimplesFixtureMode,
  mapearSituacaoInfosimples,
} from "./infosimples-adapter.ts";
import {
  ComposedSaudeFiscalProvider,
  temCredenciaisSaudeFiscal,
} from "./composed-saude-fiscal-provider.ts";

// ---------------------------------------------------------------------------
// Mini-harness
// ---------------------------------------------------------------------------
let falhas = 0;
let total = 0;

function ok(cond, nome) {
  total += 1;
  if (!cond) {
    falhas += 1;
    console.error(`  FAIL  ${nome}`);
  }
}

function eq(actual, expected, nome) {
  total += 1;
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    falhas += 1;
    console.error(`  FAIL  ${nome}\n        esperado: ${e}\n        obtido:   ${a}`);
  }
}

const HOJE = "2026-07-09T12:00:00.000Z";
const ESC = "escritorio-demo";

// ===========================================================================
// Modo fixture (gate) — sem env → fixture, sem rede
// ===========================================================================
console.log("── modo fixture (gate) ──");
ok(isSerproFixtureMode({}), "SERPRO sem env → fixture");
ok(!isSerproFixtureMode({ SERPRO_CONSUMER_KEY: "k", SERPRO_CONSUMER_SECRET: "s", SERPRO_BASE_URL: "u" }), "SERPRO com env → real");
ok(isInfosimplesFixtureMode({}), "Infosimples sem token → fixture");
ok(!isInfosimplesFixtureMode({ INFOSIMPLES_TOKEN: "t" }), "Infosimples com token → real");
ok(!temCredenciaisSaudeFiscal({}), "sem env → sem credenciais (default = mock)");
ok(temCredenciaisSaudeFiscal({ INFOSIMPLES_TOKEN: "t" }), "Infosimples token → tem credenciais");
ok(
  temCredenciaisSaudeFiscal({ SERPRO_CONSUMER_KEY: "k", SERPRO_CONSUMER_SECRET: "s", SERPRO_BASE_URL: "u" }),
  "SERPRO env → tem credenciais",
);

// ===========================================================================
// S1 — Integra Contador (CAIXAPOSTAL / SITFIS / EVENTOSATUALIZACAO)
// ===========================================================================
console.log("── S1 · Integra Contador (fixture) ──");
{
  const integra = new IntegraContadorAdapter();
  ok(integra.isFixtureMode(), "sem credencial → modo fixture");

  const mensagens = await integra.listarMensagens(ESC, HOJE);
  eq(mensagens.length, 7, "caixa postal: 7 mensagens traduzidas");

  const omissao = mensagens.find((m) => m.id === "msg-brasa-intima-omissao");
  ok(Boolean(omissao), "encontra msg-brasa-intima-omissao");
  eq(omissao.intimacao, true, "categoria INTIMACAO → intimacao true");
  eq(omissao.marcaReceita, true, "indicadorRelevancia S → marcaReceita true");
  eq(omissao.lida, false, "indicadorLida N → lida false");
  ok(omissao.prazoLimiteIso !== null, "dataLimiteResposta presente → prazoLimiteIso set");
  eq(omissao.clienteId, "a2", "ni → clienteId a2 (carteira)");
  eq(omissao.clienteNome, "Posto Brasa Combustíveis ME", "ni → clienteNome mapeado");

  const exigencia = mensagens.find((m) => m.id === "msg-brasa-intima-divida");
  eq(exigencia.intimacao, true, "categoria EXIGENCIA → intimacao true");

  const aviso = mensagens.find((m) => m.id === "msg-brasa-aviso-cnd");
  eq(aviso.intimacao, false, "categoria COMUNICADO → intimacao false");
  eq(aviso.marcaReceita, true, "comunicado com marca ! → marcaReceita true");
  eq(aviso.prazoLimiteIso, null, "comunicado sem prazo → prazoLimiteIso null (não inventa)");

  const recibo = mensagens.find((m) => m.id === "msg-cedro-recibo-efd");
  eq(recibo.intimacao, false, "RECIBO → intimacao false");
  eq(recibo.marcaReceita, false, "RECIBO sem marca → marcaReceita false");
  eq(recibo.lida, true, "indicadorLida S → lida true");

  // SITFIS → SituacaoFiscalBruta.
  const situacoes = await integra.obterSituacaoFiscal(ESC, HOJE);
  eq(situacoes.length, 3, "SITFIS: 3 situações traduzidas");
  const brasa = situacoes.find((s) => s.clienteId === "a2");
  eq(brasa.pendencias.length, 2, "SITFIS a2: 2 pendências");
  ok(brasa.protocolo.length > 0, "SITFIS: protocolo presente");
  ok(brasa.pendencias.every((p) => p.descricao.toLowerCase().includes("indício")), "SITFIS: pendências usam 'indício' (G6)");
  const aurora = situacoes.find((s) => s.clienteId === "a1");
  eq(aurora.pendencias.length, 0, "SITFIS a1: sem pendência");

  // EVENTOSATUALIZACAO → eventos.
  const eventos = await integra.detectarEventos(ESC, HOJE);
  eq(eventos.length, 2, "eventos: 2 traduzidos");
  ok(eventos.some((e) => e.tipo === "CAIXAPOSTAL"), "eventos: inclui CAIXAPOSTAL");
}

// Tradutor direto: ni desconhecido → cai no próprio ni (fail-safe).
{
  const m = serproParaMensagemBruta(
    {
      isn: "x1",
      assunto: "Assunto",
      origem: "RFB",
      dataEnvio: HOJE,
      indicadorLida: "N",
      indicadorRelevancia: "N",
      categoria: "RECIBO",
    },
    "99999999999999",
    {},
  );
  eq(m.clienteId, "99999999999999", "ni desconhecido → clienteId = ni (fail-safe)");
  eq(m.intimacao, false, "categoria RECIBO → intimacao false");
}

// ===========================================================================
// S4 — Infosimples (CNDs — 4 casos)
// ===========================================================================
console.log("── S4 · Infosimples (fixture) ──");
{
  // Mapeamento de situação (texto → SituacaoCertidao).
  eq(mapearSituacaoInfosimples("Negativa"), "regular", "Negativa → regular");
  eq(mapearSituacaoInfosimples("Positiva com efeito de negativa"), "pendente", "CPEN → pendente");
  eq(mapearSituacaoInfosimples("Positiva"), "vencida", "Positiva → vencida");
  eq(mapearSituacaoInfosimples("Nada consta"), "regular", "Nada consta → regular");

  const infosimples = new InfosimplesAdapter();
  ok(infosimples.isFixtureMode(), "sem token → modo fixture");

  const cnds = await infosimples.listarCnds(ESC, HOJE);
  eq(cnds.length, 6, "Infosimples: 6 CNDs traduzidas");

  const federalA1 = cnds.find((c) => c.id === "cnd-a1-federal");
  eq(federalA1.situacao, "regular", "a1 federal (Negativa) → regular");
  ok(federalA1.validadeIso !== null && !Number.isNaN(new Date(federalA1.validadeIso).getTime()), "a1 federal: validade ISO válida");

  const fgtsA1 = cnds.find((c) => c.id === "cnd-a1-fgts");
  eq(fgtsA1.situacao, "regular", "a1 fgts (Negativa dd/mm/aaaa) → regular");
  ok(fgtsA1.validadeIso !== null, "a1 fgts: validade dd/mm/aaaa parseada → ISO");

  const federalA2 = cnds.find((c) => c.id === "cnd-a2-federal");
  eq(federalA2.situacao, "vencida", "a2 federal (Positiva) → vencida");
  ok(new Date(federalA2.validadeIso).getTime() < new Date(HOJE).getTime(), "a2 federal: validade no passado");

  const estadualA2 = cnds.find((c) => c.id === "cnd-a2-estadual");
  eq(estadualA2.situacao, "pendente", "a2 estadual (CPEN) → pendente");

  // Cobertura das 3 situações no conjunto.
  const situacoes = cnds.map((c) => c.situacao);
  ok(situacoes.includes("regular"), "conjunto cobre 'regular'");
  ok(situacoes.includes("pendente"), "conjunto cobre 'pendente'");
  ok(situacoes.includes("vencida"), "conjunto cobre 'vencida'");
}

// ===========================================================================
// Composição — ComposedSaudeFiscalProvider (S1 + S4)
// ===========================================================================
console.log("── composição (S1 + S4) ──");
{
  const provider = new ComposedSaudeFiscalProvider();
  const leitura = await provider.listarSaudeFiscal(ESC, HOJE);
  eq(leitura.refIso, HOJE, "composição: refIso preservado");
  eq(leitura.mensagens.length, 7, "composição: 7 mensagens (Integra)");
  eq(leitura.cnds.length, 6, "composição: 6 CNDs (Infosimples)");
  eq(leitura.situacoesFiscais.length, 3, "composição: 3 situações fiscais (SITFIS)");
  eq(leitura.eventos.length, 2, "composição: 2 eventos");
  // Contrato: a leitura tem a MESMA forma que a page S3/S5 consome.
  ok(Array.isArray(leitura.mensagens) && Array.isArray(leitura.cnds), "composição: forma do contrato LeituraSaudeFiscal");
}

// ---------------------------------------------------------------------------
// Resultado
// ---------------------------------------------------------------------------
console.log("");
if (falhas > 0) {
  console.error(`✗ adapters: ${falhas}/${total} asserção(ões) FALHARAM.`);
  process.exit(1);
}
console.log(`✓ adapters: ${total}/${total} asserções OK (S1 Integra + S4 Infosimples + composição, modo fixture).`);
process.exit(0);
