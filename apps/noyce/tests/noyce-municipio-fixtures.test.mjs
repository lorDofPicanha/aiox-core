import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

/**
 * REGRESSÃO 13/Ago — o kill-gate reprovou por dois meses em parte porque o fixture usava
 * `5200050` rotulado como "Abadiânia". 5200050 é **Abadia de Goiás**, a 166 km; Abadiânia
 * é **5200100**, a 66 km. O mesmo par errado estava em `build-discovery-snapshot.mjs`.
 *
 * Um código IBGE errado não quebra nada: a consulta responde 200 com os editais do
 * município vizinho, e o edital procurado simplesmente "não aparece". Por isso precisa de
 * teste — é uma classe de bug que falha em silêncio e é lida como falta de cobertura.
 *
 * Este teste confere TODO par (código, nome) escrito à mão nos scripts contra a lista IBGE
 * de referência do raio de 500 km.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(here, "..", "..", "..");

const municipiosFile = JSON.parse(
  readFileSync(path.join(here, "..", "lib", "data", "municipios-raio-500km.json"), "utf8"),
);
const municipios = municipiosFile.municipios;
const byIbge = new Map(municipios.map((item) => [String(item.ibge), item]));

/** Remove acento e caixa para comparar "Águas Lindas de Goiás" com "Aguas Lindas". */
function fold(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function readScript(...parts) {
  return readFileSync(path.join(repoRoot, "scripts", "noyce", ...parts), "utf8");
}

test("a lista IBGE de referência tem os dois municípios que foram confundidos", () => {
  assert.equal(byIbge.get("5200100")?.nome, "Abadiânia");
  assert.equal(byIbge.get("5200050")?.nome, "Abadia de Goiás");
});

test("build-discovery-snapshot: todo par (ibge, nome) bate com a lista IBGE", () => {
  const source = readScript("build-discovery-snapshot.mjs");
  const pairs = [...source.matchAll(/\{\s*ibge:\s*'(\d{7})',\s*name:\s*'([^']+)'/g)];
  assert.ok(pairs.length > 0, "não encontrei a lista de municípios no script");

  for (const [, ibge, name] of pairs) {
    const official = byIbge.get(ibge);
    assert.ok(official, `IBGE ${ibge} ("${name}") não existe na lista do raio de 500 km`);
    assert.equal(
      fold(official.nome),
      fold(name),
      `IBGE ${ibge} é "${official.nome}", mas o script chama de "${name}"`,
    );
  }
});

test("kill-gate: todo codigoMunicipioIbge do fixture existe e a distância é plausível", () => {
  const source = readScript("run-stage2-coverage.js");
  const entries = [
    ...source.matchAll(/municipio:\s*'([^']+)',[\s\S]{0,400}?codigoMunicipioIbge:\s*'(\d{7})'/g),
  ];
  assert.ok(entries.length >= 6, `esperava ao menos 6 editais no fixture, achei ${entries.length}`);

  for (const [, municipio, ibge] of entries) {
    const official = byIbge.get(ibge);
    assert.ok(official, `IBGE ${ibge} (fixture "${municipio}") não existe na lista do raio`);
    // O fixture escreve nomes curtos ("Aguas Lindas/GO" para "Águas Lindas de Goiás"),
    // então exigir igualdade seria falso positivo. Um dos dois tem que ser prefixo do
    // outro — o que ainda reprova o caso que nos custou dois meses ("Abadiania" contra
    // "Abadia de Goiás" falha nos dois sentidos).
    const fixtureName = fold(municipio.split("/")[0]);
    const officialName = fold(official.nome);
    assert.ok(
      officialName.startsWith(fixtureName) || fixtureName.startsWith(officialName),
      `IBGE ${ibge} é "${official.nome}", mas o fixture diz "${municipio}"`,
    );
  }
});

test("Abadiânia especificamente: 5200100, dentro do raio, e não é Abadia de Goiás", () => {
  const abadiania = byIbge.get("5200100");
  assert.equal(abadiania.uf, "GO");
  assert.ok(abadiania.distanceKm < 100, "Abadiânia fica a ~66 km da sede");
  assert.ok(byIbge.get("5200050").distanceKm > 150, "Abadia de Goiás fica a ~166 km — não confundir");
});
