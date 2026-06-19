import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const payloadPath = resolve(scriptDir, "../tests/cli-payload.synthetic.json");
const cliPath = resolve(scriptDir, "../dist/cli.js");

const result = spawnSync(process.execPath, [cliPath, payloadPath], {
  encoding: "utf8"
});

if (result.status !== 0) {
  console.error(result.stderr);
  process.exit(result.status ?? 1);
}

const parsed = JSON.parse(result.stdout);
if (!Array.isArray(parsed) || parsed.length !== 1 || parsed[0].tipoInferencia !== "regra_deterministica") {
  console.error("FAIL CLI did not return expected deterministic candidate");
  console.error(result.stdout);
  process.exit(1);
}

console.log("PASS motor CLI JSON contract");
