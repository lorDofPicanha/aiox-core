#!/usr/bin/env node
// Query the Noyce knowledge base (RAG) from the terminal.
//   node --experimental-strip-types scripts/noyce/kb-query.mjs "quais certidões atualizo todo mês"
//   node --experimental-strip-types scripts/noyce/kb-query.mjs --top 6 "consórcio art 15"
//   node --experimental-strip-types scripts/noyce/kb-query.mjs --raw "prazo vencido"   # JSON results
import { getKnowledgeIndex, retrieve, retrieveContext } from "../../apps/noyce/lib/knowledge/knowledge-base.ts";

const argv = process.argv.slice(2);
let topK = 4;
let raw = false;
const terms = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--top") topK = Number(argv[++i]);
  else if (argv[i] === "--raw") raw = true;
  else terms.push(argv[i]);
}
const query = terms.join(" ").trim();
if (!query) {
  console.error('Uso: kb-query.mjs [--top N] [--raw] "sua pergunta"');
  process.exit(1);
}

if (raw) {
  const index = getKnowledgeIndex();
  const res = retrieve(index, query, topK);
  console.log(JSON.stringify(
    { query, empty: res.empty, results: res.results.map((r) => ({ id: r.chunk.id, score: Number(r.score.toFixed(3)), heading: r.chunk.heading, sourceRefs: r.chunk.sourceRefs })) },
    null, 2,
  ));
} else {
  console.log(retrieveContext(query, { topK }));
}
