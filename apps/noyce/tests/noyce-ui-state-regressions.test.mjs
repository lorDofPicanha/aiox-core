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

  // O memo `filtered` precisa depender de TODO filtro que ele lê — senão a lista congela
  // com um recorte velho. Verifica por pertinência, não pela literal do array: acrescentar
  // um filtro novo deve exigir acrescentá-lo aqui, mas não deve quebrar por reordenação.
  const filteredDeps = code.match(/const filtered = useMemo\([\s\S]*?\}, \[([^\]]*)\]\);/)?.[1];
  assert.ok(filteredDeps, "não achei o array de dependências do memo `filtered`");
  const deps = filteredDeps.split(",").map((dep) => dep.trim());
  for (const required of ["cityFilter", "sortMode", "verdict", "consorcio", "opportunities", "captureFilter", "captureById"]) {
    assert.ok(deps.includes(required), `dependência ausente no memo \`filtered\`: ${required}`);
  }
});

test("Monitorar deriva a atribuição de captura da config viva, sem persistir crédito", () => {
  const code = source("../components/monitorar/MonitorarTab.tsx");
  // A atribuição tem que recalcular quando o usuário edita palavra-chave — se `keywordConfig`
  // sair das deps, a fila continua creditada pela config antiga e o filtro mente.
  const captureDeps = code.match(/const captureById = useMemo\([\s\S]*?\}, \[([^\]]*)\]\);/)?.[1];
  assert.ok(captureDeps, "não achei o array de dependências do memo `captureById`");
  for (const required of ["opportunities", "keywordConfig"]) {
    assert.ok(captureDeps.includes(required), `dependência ausente no memo \`captureById\`: ${required}`);
  }
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
