/**
 * Harness de teste do parser (R1/R2/R3 + G1) sobre fixtures sintéticos.
 * Roda contra dist/ (pós-build). Falhas => exit 1.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
const { parseNFe, paraItensFiscais, ParseError } = require("../dist/index.js");

const scriptDir = dirname(fileURLToPath(import.meta.url));
const fixDir = resolve(scriptDir, "../src/__fixtures__");
const ler = (nome) => readFileSync(resolve(fixDir, nome), "utf8");

let passed = 0;
let failed = 0;

function teste(nome, fn) {
  try {
    fn();
    passed += 1;
    console.log(`PASS ${nome}`);
  } catch (erro) {
    failed += 1;
    console.error(`FAIL ${nome}: ${erro instanceof Error ? erro.message : erro}`);
  }
}

// --- R1: NF-e 55 normal ---------------------------------------------------
teste("R1 NF-e 55 parseia e extrai campos-chave (§2.2)", () => {
  const doc = parseNFe(ler("nfe-55-normal.xml"));
  assert.equal(doc.modelo, "55");
  assert.equal(doc.chaveAcesso.length, 44);
  assert.equal(doc.chaveAcesso, "35240612345678000199550010000001231000001230");
  assert.equal(doc.serie, "1");
  assert.equal(doc.numero, "123");
  assert.equal(doc.dataEmissao, "2024-06-12T10:30:00-03:00");
  assert.equal(doc.emitente.cnpj, "12345678000199");
  assert.equal(doc.destinatario.cnpj, "98765432000155");
  assert.equal(doc.valorTotal, 2300);
  assert.equal(doc.itens.length, 2);

  const i1 = doc.itens[0];
  assert.equal(i1.numeroItem, 1);
  assert.equal(i1.codigoProduto, "SKU-001");
  assert.equal(i1.descricao, "PARAFUSO SEXTAVADO ACO INOX M8");
  assert.equal(i1.ncm, "73181500");
  assert.equal(i1.cfop, "5102");
  assert.equal(i1.valorProduto, 1500);
  assert.equal(i1.icms.cst, "00");
  assert.equal(i1.icms.simplesNacional, false);
  assert.equal(i1.pis.cst, "01");
  assert.equal(i1.pis.aliquota, 1.65);
  assert.equal(i1.pis.valor, 24.75);
  assert.equal(i1.cofins.cst, "01");
  assert.equal(i1.cofins.valor, 114);
});

// --- R2: proveniência leve (assinatura) -----------------------------------
teste("R2 NF-e 55 detecta presenca de assinatura XMLDSig", () => {
  const doc = parseNFe(ler("nfe-55-normal.xml"));
  assert.equal(doc.temAssinatura, true);
});

teste("R2 NFC-e 65 sem assinatura => temAssinatura false", () => {
  const doc = parseNFe(ler("nfce-65-simples.xml"));
  assert.equal(doc.temAssinatura, false);
});

// --- R1: NFC-e 65 (Simples, CSOSN, dest por CPF) --------------------------
teste("R1 NFC-e 65 parseia Simples (CSOSN) e destinatario por CPF", () => {
  const doc = parseNFe(ler("nfce-65-simples.xml"));
  assert.equal(doc.modelo, "65");
  assert.equal(doc.destinatario.cpf, "00011122233");
  assert.equal(doc.destinatario.cnpj, undefined);
  const item = doc.itens[0];
  assert.equal(item.icms.cst, "102"); // CSOSN
  assert.equal(item.icms.simplesNacional, true);
  assert.equal(item.pis.cst, "07");
});

// --- R1: monofásico -------------------------------------------------------
teste("R1 monofasico parseia CST PIS/COFINS 04 e CEST", () => {
  const doc = parseNFe(ler("nfe-55-monofasico.xml"));
  const item = doc.itens[0];
  assert.equal(item.descricao, "GASOLINA COMUM");
  assert.equal(item.ncm, "27101259");
  assert.equal(item.cest, "0600100");
  assert.equal(item.pis.cst, "04");
  assert.equal(item.cofins.cst, "04");
  assert.equal(item.valorProduto, 50000);
});

// --- R3: mapper preserva PIS/COFINS e marca monofásico --------------------
teste("R3 mapper produz ItemFiscal compativel + extensao Recuperacao", () => {
  const doc = parseNFe(ler("nfe-55-monofasico.xml"));
  const itens = paraItensFiscais(doc);
  assert.equal(itens.length, 1);
  const item = itens[0];
  // contrato base do motor:
  assert.equal(item.id, "35240612345678000199550010000007891000007890-1");
  assert.equal(item.descricao, "GASOLINA COMUM");
  assert.equal(item.ncm, "27101259");
  assert.equal(item.cfop, "5656");
  assert.equal(typeof item.valor, "number");
  assert.equal(item.valor, 50000);
  // extensao Recuperacao:
  assert.equal(item.recuperacao.ehMonofasico, true);
  assert.equal(item.recuperacao.pis.cst, "04");
  // proveniencia:
  assert.equal(item.proveniencia.classeInsumo, "xml");
  assert.equal(item.proveniencia.assinado, true);
  assert.equal(item.proveniencia.chaveAcesso, doc.chaveAcesso);
});

teste("R3 item nao-monofasico => ehMonofasico false", () => {
  const doc = parseNFe(ler("nfe-55-normal.xml"));
  const itens = paraItensFiscais(doc);
  assert.equal(itens[0].recuperacao.ehMonofasico, false);
});

// --- R1/G1: XML válido com namespace prefixado (QA 🔴-1) -------------------
teste("R1 NF-e 55 com prefixo de namespace (nfe:) parseia (G1)", () => {
  const doc = parseNFe(ler("nfe-55-namespace.xml"));
  assert.equal(doc.modelo, "55");
  assert.equal(doc.chaveAcesso, "35240612345678000199550010000001231000001230");
  assert.equal(doc.emitente.cnpj, "12345678000199");
  assert.equal(doc.destinatario.cnpj, "98765432000155");
  assert.equal(doc.itens.length, 1);
  assert.equal(doc.itens[0].ncm, "73181500");
  assert.equal(doc.itens[0].pis.cst, "01");
  assert.equal(doc.valorTotal, 1500);
  assert.equal(doc.temAssinatura, true);
});

// --- G1: rejeição tipada --------------------------------------------------
teste("G1 chave de acesso ausente => ParseError tipado", () => {
  assert.throws(
    () => parseNFe(ler("nfe-invalido-sem-chave.xml")),
    (erro) => {
      assert.ok(erro instanceof ParseError, "deve ser ParseError");
      assert.equal(erro.codigo, "CAMPO_OBRIGATORIO_AUSENTE");
      assert.equal(erro.campo, "infNFe/@Id");
      return true;
    }
  );
});

teste("G1 XML malformado (aspas abertas) => ParseError XML_MALFORMADO", () => {
  assert.throws(
    () => parseNFe(ler("malformado.xml")),
    (erro) => erro instanceof ParseError && erro.codigo === "XML_MALFORMADO"
  );
});

teste("G1 XML vazio => ParseError XML_MALFORMADO", () => {
  assert.throws(
    () => parseNFe("   "),
    (erro) => erro instanceof ParseError && erro.codigo === "XML_MALFORMADO"
  );
});

teste("G1 XML sem NFe => ParseError ESTRUTURA_INVALIDA", () => {
  assert.throws(
    () => parseNFe("<root><foo>1</foo></root>"),
    (erro) => erro instanceof ParseError && erro.codigo === "ESTRUTURA_INVALIDA"
  );
});

// ---------------------------------------------------------------------------
console.log(`\n${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
}
