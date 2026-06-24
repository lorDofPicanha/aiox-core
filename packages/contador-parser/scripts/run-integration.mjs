/**
 * Integração ponta-a-ponta: parser -> mapper -> classificarLote do motor real
 * (@synkra/contador-motor-fiscal). Prova que ItemFiscalRecuperacao é aceito
 * pelo contrato do motor (subtipagem estrutural) sem adaptação.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
const { parseNFe, paraItensFiscais } = require("../dist/index.js");

// Resolve o motor via workspace (node_modules) com fallback ao caminho do repo.
let motor;
try {
  motor = require("@synkra/contador-motor-fiscal");
} catch {
  motor = require(resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../../contador-motor-fiscal/dist/index.js"
  ));
}
const { classificarLote, detectarMonofasico } = motor;

const scriptDir = dirname(fileURLToPath(import.meta.url));
const fixDir = resolve(scriptDir, "../src/__fixtures__");

// Base de referência sintética: gasolina (NCM 2710) deveria estar com um
// cClassTrib esperado; o item informa nenhum cClassTrib -> divergência.
const base = {
  baseVersaoId: "base-sintetica-integracao-v0",
  regras: [
    {
      id: "regra-combustivel-monofasico",
      ncmPrefixo: "2710",
      cclasstribEsperado: "000002",
      descricao: "Combustivel sujeito a regime monofasico de PIS/COFINS",
      tipoDivergencia: "monofasico_tributado",
      fundamento: ["sintetico: NCM 2710 monofasico"]
    }
  ]
};
const contexto = { motorVersaoId: "motor-integracao-test-v0" };

const doc = parseNFe(readFileSync(resolve(fixDir, "nfe-55-monofasico.xml"), "utf8"));
const itens = paraItensFiscais(doc);

// Passa os itens estendidos DIRETO ao motor (sem adaptar) — prova de contrato.
const apontamentos = classificarLote(itens, base, contexto);

assert.equal(apontamentos.length, 1, "esperava 1 apontamento de divergencia");
const ap = apontamentos[0];
assert.equal(ap.itemId, itens[0].id);
assert.equal(ap.tipoDivergencia, "monofasico_tributado");
assert.equal(ap.cclasstribReferencia, "000002");
assert.equal(ap.valorEnvolvido, 50000);
assert.equal(ap.tipoInferencia, "regra_deterministica");

console.log("PASS integracao parser -> mapper -> classificarLote");
console.log(
  JSON.stringify(
    {
      item: { id: itens[0].id, ncm: itens[0].ncm, valor: itens[0].valor, monofasico: itens[0].recuperacao.ehMonofasico },
      apontamento: { tipo: ap.tipoDivergencia, cclasstribRef: ap.cclasstribReferencia, valor: ap.valorEnvolvido, confianca: ap.confianca }
    },
    null,
    2
  )
);

// ---------------------------------------------------------------------------
// A1 — integracao: ItemFiscalRecuperacao do parser -> detectarMonofasico.
// Fixture: gasolina (NCM 27101259, familia monofasica) tributada por engano
// com CST PIS/COFINS 01 (regime normal) -> indicio de credito_potencial.
// ---------------------------------------------------------------------------
const refMonofasico = {
  listaVersao: "monofasico-integracao-v0",
  familias: [
    {
      id: "mono-combustiveis",
      familia: "Combustiveis e lubrificantes",
      ncmPrefixos: ["2710", "2711"],
      cstEsperadoRevenda: ["04", "05", "06"],
      confiancaBase: "alta",
      materialidadeMinima: 100,
      fundamento: ["sintetico: Lei 9.718/1998 monofasico combustiveis"]
    }
  ]
};

const docMono = parseNFe(
  readFileSync(resolve(fixDir, "nfe-55-monofasico-tributado-normal.xml"), "utf8")
);
const itensMono = paraItensFiscais(docMono);

// O ItemFiscalRecuperacao do parser e passado DIRETO a detectarMonofasico
// (subtipagem estrutural — consome ncm + recuperacao.pis/cofins.cst).
const apontamentosMono = detectarMonofasico(itensMono[0], refMonofasico, contexto);

assert.equal(apontamentosMono.length, 1, "esperava 1 apontamento de credito potencial");
const apMono = apontamentosMono[0];
assert.equal(apMono.tipoDivergencia, "credito_potencial");
assert.equal(apMono.cclasstribReferencia, "mono-combustiveis");
assert.equal(apMono.valorEnvolvido, 50000);
assert.ok(apMono.fatoresConfianca && typeof apMono.fatoresConfianca.score === "number");
assert.ok(["alta", "media", "baixa"].includes(apMono.bandaConfianca));

// Caso inverso: o mesmo NCM monofasico CORRETAMENTE tributado (fixture CST 04)
// NAO deve gerar apontamento (prova de que o motor nao gera falso-positivo).
const docCorreto = parseNFe(readFileSync(resolve(fixDir, "nfe-55-monofasico.xml"), "utf8"));
const itensCorreto = paraItensFiscais(docCorreto);
const apontamentosCorreto = detectarMonofasico(itensCorreto[0], refMonofasico, contexto);
assert.equal(
  apontamentosCorreto.length,
  0,
  "monofasico corretamente tributado (CST 04) NAO deve gerar apontamento"
);

console.log("PASS integracao parser -> detectarMonofasico (A1)");
console.log(
  JSON.stringify(
    {
      item: {
        id: itensMono[0].id,
        ncm: itensMono[0].ncm,
        valor: itensMono[0].valor,
        cstPis: itensMono[0].recuperacao.pis.cst,
        cstCofins: itensMono[0].recuperacao.cofins.cst,
        parserMarcouMonofasico: itensMono[0].recuperacao.ehMonofasico
      },
      apontamento: {
        tipo: apMono.tipoDivergencia,
        familia: apMono.cclasstribReferencia,
        valor: apMono.valorEnvolvido,
        confianca: apMono.confianca,
        banda: apMono.bandaConfianca,
        bloqueiaAutoAprovacao: apMono.bloqueiaAutoAprovacao,
        fatores: apMono.fatoresConfianca.contribuicoes
      }
    },
    null,
    2
  )
);
