import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { classificar } = require("../dist/index.js");

const scriptDir = dirname(fileURLToPath(import.meta.url));
const fixturePath = resolve(scriptDir, "../tests/golden-set.synthetic.json");
const fixture = JSON.parse(readFileSync(fixturePath, "utf8"));

if (!fixture.notice.includes("Synthetic")) {
  throw new Error("golden-set fixture must declare synthetic status");
}

let failures = 0;

for (const testCase of fixture.cases) {
  const result = classificar(testCase.item, fixture.base, fixture.contexto);
  const countMatches = result.length === testCase.expectedCount;

  if (!countMatches) {
    failures += 1;
    console.error(`FAIL ${testCase.name}: expected ${testCase.expectedCount}, got ${result.length}`);
    continue;
  }

  if (testCase.expectedFirst && result[0]) {
    const expected = testCase.expectedFirst;
    const actual = result[0];
    const firstMatches =
      actual.tipoDivergencia === expected.tipoDivergencia &&
      actual.cclasstribReferencia === expected.cclasstribReferencia &&
      actual.criteriosDesempate.criterio === expected.criterio &&
      actual.tipoInferencia === "regra_deterministica";

    if (!firstMatches) {
      failures += 1;
      console.error(`FAIL ${testCase.name}: first apontamento mismatch`);
      console.error(JSON.stringify(actual, null, 2));
      continue;
    }
  }

  console.log(`PASS ${testCase.name}`);
}

if (failures > 0) {
  console.error(`${failures} synthetic golden-set case(s) failed.`);
  process.exit(1);
}

console.log("PASS synthetic golden-set harness (not a real fiscal accuracy metric)");
