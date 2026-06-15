// Ad-hoc live search runner — uses the real Noyce PNCP public adapter (GET read-only).
import { createPncpPublicAdapter } from "../lib/sources/pncp-public-adapter.ts";

function ymd(d) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

const today = new Date();
const start = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000); // last 3 days

const adapter = createPncpPublicAdapter();

// modalidade configurável (default 8 = Dispensa, a que responde). tamanhoPagina deve ser >= 10.
const modalidade = Number(process.argv[2] ?? 8);
const query = {
  dataInicial: ymd(start),
  dataFinal: ymd(today),
  codigoModalidadeContratacao: modalidade,
  uf: "GO",
  pagina: 1,
  tamanhoPagina: 10,
};

console.log("[noyce] busca ao vivo PNCP — query:", JSON.stringify(query));
const t0 = Date.now();
const result = await adapter.run({
  capturedBy: "orion-adhoc",
  fetchImpl: globalThis.fetch,
  query,
});
const ms = Date.now() - t0;

console.log(`[noyce] ok=${result.ok}  candidatos=${result.candidates.length}  erros=${result.errors.length}  ${ms}ms`);
if (result.errors.length) console.log("[noyce] erros:", result.errors.slice(0, 5));
if (result.snapshot) {
  console.log(`[noyce] snapshot: ${result.snapshot.snapshotId}  ${result.snapshot.byteLength} bytes  url=${result.snapshot.originalUrl}`);
}
for (const c of result.candidates.slice(0, 8)) {
  const title = c.title ?? c.objeto ?? c.objetoCompra ?? "(sem título)";
  const org = c.buyerName ?? c.orgao ?? c.orgaoEntidade ?? "";
  const val = c.estimatedValue ?? c.valorEstimado ?? "";
  console.log(` • ${String(title).slice(0, 90)}  | ${String(org).slice(0, 40)}  | ${val}`);
}
