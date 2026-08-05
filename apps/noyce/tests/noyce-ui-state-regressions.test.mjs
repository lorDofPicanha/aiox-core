import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

function source(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

test("Monitorar recalcula listas, cidades, contadores e filtros após refresh de opportunities", () => {
  const code = source("../components/monitorar/MonitorarTab.tsx");
  assert.match(code, /\[interested, opportunities\]/);
  assert.ok((code.match(/\[opportunities\]/g) ?? []).length >= 2);
  assert.match(code, /\[cityFilter, sortMode, verdict, consorcio, opportunities\]/);
});

test("ERM e Win-Intel cancelam requests e descartam gerações tardias", () => {
  for (const file of [
    "../components/shell/useEditalErm.ts",
    "../components/analisar/useWinIntel.ts",
  ]) {
    const code = source(file);
    assert.match(code, /new AbortController\(\)/, file);
    assert.match(code, /signal: controller\.signal/, file);
    assert.match(code, /requestGeneration\.current === generation/, file);
    assert.match(code, /activeRequest\.current\?\.abort\(\)/, file);
  }
});

test("Win-Intel diferencia execução sem ERM da reexecução quando o ERM chega", () => {
  const code = source("../components/analisar/useWinIntel.ts");
  assert.match(code, /erm \? "with-erm" : "without-erm"/);
  assert.match(code, /\[opportunity\.id, deterministic\]/);
});

test("Recorrer limpa todo estado transitório ao trocar edital", () => {
  const code = source("../components/recorrer/RecorrerTab.tsx");
  const opportunityReset = code.match(/useEffect\(\(\) => \{[\s\S]*?\}, \[opportunity\.id\]\);/)?.[0] ?? "";
  for (const reset of [
    'setOutcome("inabilitada")',
    'setSessionAt("")',
    'setMotivo("")',
    'setAtaText("")',
    'setFundamentos("")',
    "setMinuta(null)",
  ]) {
    assert.ok(opportunityReset.includes(reset), `reset ausente: ${reset}`);
  }
});
