import test from "node:test";
import assert from "node:assert/strict";

const { tokenize, stripDiacritics } = await import("../lib/knowledge/tokenize.ts");
const { chunkDoc, buildIndex, retrieve, loadKnowledgeDocs, getKnowledgeIndex, retrieveContext, DEFAULT_KB_DIR } =
  await import("../lib/knowledge/knowledge-base.ts");

// ── tokenizer ──
test("tokenize: strips diacritics so consórcio === consorcio", () => {
  assert.equal(stripDiacritics("consórcio"), "consorcio");
  assert.deepEqual(tokenize("Consórcio"), tokenize("consorcio"));
  assert.deepEqual(tokenize("habilitação técnica"), ["habilitacao", "tecnica"]);
});

test("tokenize: drops stopwords and tiny tokens", () => {
  assert.deepEqual(tokenize("o que é a proposta"), ["proposta"]);
});

// ── chunking ──
const SAMPLE = `Intro do documento.

## Certidões mensais
Municipal, falência e FGTS devem ser atualizadas todo mês.

## Consórcio
Para participar em consórcio é preciso o documental da empresa parceira.

### Toggle
O toggle com/sem consórcio vem antes da análise.`;

test("chunkDoc: splits by headings and keeps the breadcrumb", () => {
  const chunks = chunkDoc("kb-test", "Doc Teste", ["teste"], ["doc-29"], SAMPLE);
  const headings = chunks.map((c) => c.heading);
  assert.ok(headings.includes("Certidões mensais"));
  assert.ok(headings.includes("Consórcio"));
  assert.ok(headings.includes("Toggle"));
  const toggle = chunks.find((c) => c.heading === "Toggle");
  assert.deepEqual(toggle.headingPath, ["Consórcio", "Toggle"]);
  assert.equal(toggle.docId, "kb-test");
  assert.deepEqual(toggle.sourceRefs, ["doc-29"]);
});

// ── retrieval (BM25) ──
test("retrieve: ranks the right chunk for a domain query", () => {
  const chunks = chunkDoc("kb-test", "Doc Teste", ["certidao", "consorcio"], ["doc-29"], SAMPLE);
  const index = buildIndex(chunks);
  const res = retrieve(index, "quais certidões atualizo todo mês", 3);
  assert.equal(res.empty, false);
  assert.equal(res.results[0].chunk.heading, "Certidões mensais");

  const res2 = retrieve(index, "documental da empresa parceira em consórcio", 3);
  assert.equal(res2.results[0].chunk.heading, "Consórcio");
});

test("retrieve: flags empty on a no-match query (never silently empty)", () => {
  const index = buildIndex(chunkDoc("kb-test", "Doc Teste", [], [], SAMPLE));
  const res = retrieve(index, "blockchain quantico zumbi", 3);
  assert.equal(res.empty, true);
  assert.equal(res.results.length, 0);
});

test("retrieveContext via synthetic dir: no-match emits an honest notice, not silence", async () => {
  // empty/non-existent dir → index has no chunks → context must warn, not invent.
  const ctx = retrieveContext("qualquer coisa", { dir: "/__noyce_kb_does_not_exist__" });
  assert.match(ctx, /Nenhum trecho casou|NÃO invente/);
});

// ── integration with the real corpus (skips gracefully until authored) ──
test("corpus real: docs carregam e queries representativas retornam algo", () => {
  const docs = loadKnowledgeDocs(DEFAULT_KB_DIR);
  if (docs.length === 0) {
    console.log("ℹ corpus ainda não autorado em lib/data/knowledge-base — pulando integração");
    return;
  }
  const index = getKnowledgeIndex(DEFAULT_KB_DIR);
  assert.ok(index.chunks.length > 0, "índice deve ter chunks");
  for (const q of ["certidões habilitação", "consórcio", "lances plataforma humano", "raio busca"]) {
    const res = retrieve(index, q, 3);
    assert.equal(res.empty, false, `query "${q}" deveria casar com o corpus`);
  }
});
