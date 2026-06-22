// Seed sintético end-to-end (F1.2): liga MOTOR REAL → régua → registrarAnalise → trilha.
// Lê a régua autorada pelos clones, roda o motor sobre itens sintéticos, popula o
// MockApiClient via RPC, e valida a trilha (hash-chain real) com verificarCadeia().
// Roda sobre o dist compilado (npm run seed = build && node este script).

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createApiClientFromMotor } from "../dist/index.js";
import { verificarCadeia } from "@synkra/contador-trilha-verifier";

const ESC = "00000000-0000-4000-8000-000000000001";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const rulesetPath = resolve(
  scriptDir,
  "../../contador-motor-fiscal/data/ruleset-cclasstrib-v0-draft.json",
);

const doc = JSON.parse(readFileSync(rulesetPath, "utf8"));
if (doc.status !== "draft") {
  throw new Error("régua deve estar marcada como DRAFT (pendente validação tributarista).");
}

const { api, stats } = await createApiClientFromMotor(doc);

let failures = 0;
function check(name, cond, extra) {
  if (cond) {
    console.log(`  ok  ${name}${extra ? ` — ${extra}` : ""}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${name}${extra ? ` — ${extra}` : ""}`);
  }
}

console.log("Seed F1.2 (motor → régua → registrarAnalise → trilha)");
console.log(
  `  régua: ${doc.rulesetVersao} | status: ${doc.status} | regras: ${doc.regras.length}`,
);
console.log(
  `  stats: clientes=${stats.clientes} notas=${stats.notas} itens=${stats.itens} ` +
    `apontamentos=${stats.apontamentos} (motor=${stats.porMotorDivergencia}, disputados=${stats.disputados})`,
);

const clientes = await api.listarClientes(ESC);
check("3 clientes de alto SKU (farmácia/posto/mercado)", clientes.length === 3);

const pendentes = await api.listarApontamentos({ escritorioId: ESC, status: "pendente" });
check(
  "apontamentos pendentes produzidos pelo motor/seed",
  pendentes.length === stats.apontamentos && pendentes.length > 0,
  `${pendentes.length} na fila`,
);

const disputados = pendentes.filter((a) => a.bandaConfianca === "disputado");
check(
  ">=1 caso disputado/baixa-confiança marcado para revisão",
  disputados.length >= 1,
  `${disputados.length} disputado(s)`,
);

// Indícios disputados NÃO afirmam referência (G6: sem certeza onde a régua diz DISPUTADO).
const disputadoSemReferencia = disputados.every((a) => a.cclasstribReferencia === null);
check("disputados não fixam cClassTrib (G6: sem certeza)", disputadoSemReferencia);

// Apontamentos do motor carimbam a VERSÃO da régua na trilha.
const eventosAnalise = await api.listarEventos({ escritorioId: ESC });
const temAnalise = eventosAnalise.some((e) => e.tipoEvento === "analise_executada");
check("trilha tem eventos analise_executada (ator motor)", temAnalise);

// A trilha é um hash-chain real — verificarCadeia valida.
const dump = api.dumpEventos();
const verif = verificarCadeia(dump);
check(
  "verificarCadeia() valida a trilha gerada (hashes batem)",
  verif.ok === true && verif.checked === dump.length && verif.failures.length === 0,
  `${verif.checked} eventos, head ${verif.headHash?.slice(0, 12)}…`,
);

// Controle de falso-positivo: item já correto (AMOXICILINA, 2ª nota) não gera apontamento.
const notaJaCorretoId = "00000000-0000-4000-8000-0000000000f2";
const itensFarm = await api.listarItens(notaJaCorretoId);
check("nota do item 'já correto' existe no seed", itensFarm.length === 1);
const itemJaCorreto = itensFarm[0];
const apsDoItem = pendentes.filter((a) => a.itemId === itemJaCorreto.id);
check("item 'já correto' NÃO gera apontamento (controle de falso-positivo)", apsDoItem.length === 0);

if (failures > 0) {
  console.error(`\n${failures} verificação(ões) falharam.`);
  process.exit(1);
}
console.log(
  "\nSeed F1.2: todas as verificações passaram (base sintética / DRAFT pendente validação tributarista).",
);
