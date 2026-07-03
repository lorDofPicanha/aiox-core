// Vigia da colheita de editais vencedores (02/Jul): o feed /contratos do PNCP cai com
// frequência (na 4ª passada caiu de vez — 0/102 órgãos). Este loop re-roda a colheita
// (idempotente) em intervalos, até o RAG bater o alvo ou esgotar as rodadas.
//
// Uso (detached, sobrevive à sessão):
//   node scripts/noyce/harvest-loop.mjs                (alvo 88 arquivos = 8 originais + 80 vencedores)
//   node scripts/noyce/harvest-loop.mjs 60 8           (alvo 60 arquivos, máx 8 rodadas)
//
// Log: scripts/noyce/harvest-loop.log (apêndice, com timestamp por rodada).

import { readdirSync, appendFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const KB_DIR = join(here, "..", "..", "lib", "data", "knowledge-base", "editais-ref");
const LOG = join(here, "harvest-loop.log");
const HARVEST = join(here, "build-editais-vencedores.mjs");

const args = process.argv.slice(2).filter((a) => /^\d+$/.test(a));
const TARGET_FILES = Number.parseInt(args[0] ?? "88", 10);
const MAX_ROUNDS = Number.parseInt(args[1] ?? "10", 10);
const SLEEP_MIN = 35;

const count = () => readdirSync(KB_DIR).filter((f) => f.endsWith(".md")).length;
const log = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  appendFileSync(LOG, line);
  process.stdout.write(line);
};

log(`vigia iniciado — RAG atual: ${count()} docs · alvo: ${TARGET_FILES} · máx ${MAX_ROUNDS} rodadas, ${SLEEP_MIN}min entre elas`);

for (let round = 1; round <= MAX_ROUNDS; round++) {
  const before = count();
  if (before >= TARGET_FILES) {
    log(`✅ alvo atingido (${before} ≥ ${TARGET_FILES}) — vigia encerrado`);
    process.exit(0);
  }
  log(`rodada ${round}/${MAX_ROUNDS} — colhendo (RAG: ${before})…`);
  const res = spawnSync(process.execPath, ["--experimental-strip-types", HARVEST, "80"], {
    encoding: "utf8",
    timeout: 45 * 60_000,
  });
  const tail = (res.stdout ?? "").split("\n").filter((l) => /Fase 1:|Vencedores no RAG:/.test(l)).join(" · ");
  log(`rodada ${round} fechou: ${tail || `exit ${res.status ?? "?"} ${String(res.stderr ?? "").slice(0, 120)}`} → RAG: ${count()}`);
  if (round < MAX_ROUNDS && count() < TARGET_FILES) {
    await new Promise((r) => setTimeout(r, SLEEP_MIN * 60_000));
  }
}
log(`vigia esgotou as ${MAX_ROUNDS} rodadas — RAG final: ${count()} docs (alvo era ${TARGET_FILES})`);
