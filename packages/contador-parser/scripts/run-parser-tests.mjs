/**
 * Harness de teste do parser (R1/R2/R3 + R4 CT-e/NFS-e + G1) sobre fixtures
 * sintéticos. Roda contra dist/ (pós-build). Falhas => exit 1.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
const {
  parseNFe,
  parseCTe,
  parseNFSeNacional,
  parseDocumentoFiscal,
  detectarTipoInsumo,
  paraItensFiscais,
  paraItensFiscaisCTe,
  paraItensFiscaisNFSe,
  ParseError
} = require("../dist/index.js");

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

// ===========================================================================
// R4 — CT-e (modelo 57)
// ===========================================================================

teste("R4 CT-e 57 parseia e extrai campos-chave do frete", () => {
  const doc = parseCTe(ler("cte-57-normal.xml"));
  assert.equal(doc.tipo, "transporte");
  assert.equal(doc.modelo, "57");
  assert.equal(doc.chaveAcesso.length, 44);
  assert.equal(doc.chaveAcesso, "35240612345678000199570010000004561000004560");
  assert.equal(doc.serie, "1");
  assert.equal(doc.numero, "456");
  assert.equal(doc.dataEmissao, "2024-06-18T09:15:00-03:00");
  assert.equal(doc.emitente.cnpj, "22333444000155");
  assert.equal(doc.remetente.cnpj, "12345678000199");
  assert.equal(doc.destinatario.cnpj, "98765432000155");
  // toma3/toma=0 => tomador é o remetente
  assert.equal(doc.tomador.cnpj, "12345678000199");
  assert.equal(doc.valorTotalPrestacao, 1200);
  // ICMS no nível do documento:
  assert.equal(doc.icms.cst, "00");
  assert.equal(doc.icms.simplesNacional, false);
  assert.equal(doc.icms.baseCalculo, 1200);
  assert.equal(doc.icms.aliquota, 12);
  assert.equal(doc.icms.valor, 144);
});

teste("R2/R4 CT-e 57 detecta assinatura XMLDSig", () => {
  const doc = parseCTe(ler("cte-57-normal.xml"));
  assert.equal(doc.temAssinatura, true);
});

teste("R4 CT-e mapper produz ItemFiscal compativel (sem NCM)", () => {
  const doc = parseCTe(ler("cte-57-normal.xml"));
  const itens = paraItensFiscaisCTe(doc);
  assert.equal(itens.length, 1);
  const item = itens[0];
  assert.equal(item.id, "35240612345678000199570010000004561000004560-1");
  assert.equal(item.valor, 1200);
  assert.equal(item.cst, "00"); // CST do ICMS do frete
  assert.equal(item.ncm, undefined); // frete não tem NCM (semântica não forçada)
  assert.equal(item.recuperacao.ehMonofasico, false);
  assert.equal(item.proveniencia.classeInsumo, "xml");
  assert.equal(item.proveniencia.assinado, true);
  assert.equal(item.proveniencia.chaveAcesso, doc.chaveAcesso);
});

teste("G1/R4 CT-e modelo 58 (MDF-e) => ParseError MODELO_NAO_SUPORTADO", () => {
  assert.throws(
    () => parseCTe(ler("cte-57-invalido-modelo.xml")),
    (erro) => {
      assert.ok(erro instanceof ParseError, "deve ser ParseError");
      assert.equal(erro.codigo, "MODELO_NAO_SUPORTADO");
      assert.equal(erro.campo, "ide/mod");
      return true;
    }
  );
});

// ===========================================================================
// R4 — NFS-e Nacional (CGNFS-e, NT 007/2026, grupos IBS/CBS)
// ===========================================================================

teste("R4 NFS-e Nacional parseia campos-chave do servico", () => {
  const doc = parseNFSeNacional(ler("nfse-nacional-ibscbs.xml"));
  assert.equal(doc.tipo, "servico");
  assert.equal(doc.modelo, "NFSe");
  assert.equal(doc.chaveAcesso.length, 50);
  assert.equal(doc.chaveAcesso, "35240612345678000199000000000456000000045600000050");
  assert.equal(doc.numero, "456");
  assert.equal(doc.dataEmissao, "2026-09-10T14:22:00-03:00");
  assert.equal(doc.prestador.cnpj, "12345678000199");
  assert.equal(doc.tomador.cnpj, "98765432000155");
  assert.equal(doc.valorServico, 10000);
  assert.equal(doc.itens.length, 1);

  const item = doc.itens[0];
  assert.equal(item.descricao, "DESENVOLVIMENTO DE SOFTWARE SOB ENCOMENDA");
  assert.equal(item.codigoTributacaoNacional, "010701");
  assert.equal(item.codigoTributacaoMunicipal, "010701");
  assert.equal(item.valorServico, 10000);
  // PIS/COFINS retido (grupo gPISCOFINS, correção NT 007/2026):
  assert.equal(item.pis.cst, "01");
  assert.equal(item.pis.aliquota, 0.65);
  assert.equal(item.pis.valor, 65);
  assert.equal(item.cofins.cst, "01");
  assert.equal(item.cofins.valor, 300);
});

teste("R4 NFS-e Nacional extrai grupo IBS/CBS (Reforma)", () => {
  const doc = parseNFSeNacional(ler("nfse-nacional-ibscbs.xml"));
  const ibsCbs = doc.itens[0].ibsCbs;
  assert.ok(ibsCbs, "deve ter grupo IBS/CBS");
  assert.equal(ibsCbs.cClassTrib, "000001");
  assert.equal(ibsCbs.cst, "000");
  assert.equal(ibsCbs.baseCalculo, 10000);
  assert.equal(ibsCbs.aliquotaCbs, 0.9);
  assert.equal(ibsCbs.valorCbs, 90);
  // IBS = UF + Município somados. A alíquota é soma de floats (0.10 + 0.05);
  // o parser NÃO arredonda na extração (arredondamento é política a jusante —
  // ver "Precisão monetária" no README), então comparamos com tolerância.
  assert.ok(Math.abs(ibsCbs.aliquotaIbs - 0.15) < 1e-9, "aliquotaIbs ~ 0.15");
  assert.equal(ibsCbs.valorIbs, 15); // 10 + 5 (exato)
});

teste("R2/R4 NFS-e Nacional detecta assinatura XMLDSig", () => {
  const doc = parseNFSeNacional(ler("nfse-nacional-ibscbs.xml"));
  assert.equal(doc.temAssinatura, true);
});

teste("R4 NFS-e mapper leva cClassTrib do IBS/CBS p/ cclasstribInformado", () => {
  const doc = parseNFSeNacional(ler("nfse-nacional-ibscbs.xml"));
  const itens = paraItensFiscaisNFSe(doc);
  assert.equal(itens.length, 1);
  const item = itens[0];
  assert.equal(item.id, "35240612345678000199000000000456000000045600000050-1");
  assert.equal(item.descricao, "DESENVOLVIMENTO DE SOFTWARE SOB ENCOMENDA");
  assert.equal(item.valor, 10000);
  assert.equal(item.ncm, undefined); // serviço não tem NCM
  assert.equal(item.cclasstribInformado, "000001"); // base da Auditoria da Reforma
  assert.equal(item.cst, "000");
  // PIS/COFINS retido preservado p/ apuração; monofásico não se aplica a serviço:
  assert.equal(item.recuperacao.ehMonofasico, false);
  assert.equal(item.recuperacao.pis.cst, "01");
  assert.equal(item.proveniencia.classeInsumo, "xml");
});

teste("G1/R4 NFS-e Nacional chave de tamanho errado => CHAVE_ACESSO_INVALIDA", () => {
  assert.throws(
    () => parseNFSeNacional(ler("nfse-nacional-invalido-chave.xml")),
    (erro) => {
      assert.ok(erro instanceof ParseError, "deve ser ParseError");
      assert.equal(erro.codigo, "CHAVE_ACESSO_INVALIDA");
      return true;
    }
  );
});

// ===========================================================================
// R4 — Roteador (detecção de tipo + despacho)
// ===========================================================================

teste("R4 roteador detecta tipo de cada DF-e", () => {
  assert.equal(detectarTipoInsumo(ler("nfe-55-normal.xml")), "mercadoria");
  assert.equal(detectarTipoInsumo(ler("nfce-65-simples.xml")), "mercadoria");
  assert.equal(detectarTipoInsumo(ler("cte-57-normal.xml")), "transporte");
  assert.equal(detectarTipoInsumo(ler("nfse-nacional-ibscbs.xml")), "servico");
});

teste("R4 roteador despacha p/ o parser certo", () => {
  const nfe = parseDocumentoFiscal(ler("nfe-55-normal.xml"));
  assert.equal(nfe.modelo, "55");
  assert.equal(nfe.itens.length, 2);

  const cte = parseDocumentoFiscal(ler("cte-57-normal.xml"));
  assert.equal(cte.tipo, "transporte");
  assert.equal(cte.valorTotalPrestacao, 1200);

  const nfse = parseDocumentoFiscal(ler("nfse-nacional-ibscbs.xml"));
  assert.equal(nfse.tipo, "servico");
  assert.equal(nfse.itens[0].ibsCbs.cClassTrib, "000001");
});

teste("G1/R4 roteador rejeita tipo nao suportado => TIPO_NAO_SUPORTADO", () => {
  assert.throws(
    () => parseDocumentoFiscal("<root><foo>1</foo></root>"),
    (erro) => {
      assert.ok(erro instanceof ParseError, "deve ser ParseError");
      assert.equal(erro.codigo, "TIPO_NAO_SUPORTADO");
      return true;
    }
  );
});

teste("G1/R4 roteador rejeita XML vazio => XML_MALFORMADO", () => {
  assert.throws(
    () => parseDocumentoFiscal("   "),
    (erro) => erro instanceof ParseError && erro.codigo === "XML_MALFORMADO"
  );
});

// --- regressão: NF-e/NFC-e antigos não devem ser afetados pelo R4 -----------
teste("R4 regressao: parseNFe ainda rejeita modelo 57 (nao e parseNFe)", () => {
  // mod 57 num envelope NFe segue não suportado por parseNFe (use parseCTe).
  assert.throws(
    () =>
      parseNFe(
        '<NFe xmlns="http://www.portalfiscal.inf.br/nfe">' +
          '<infNFe Id="NFe35240612345678000199570010000001231000001230"><ide><mod>57</mod>' +
          "<serie>1</serie><nNF>1</nNF><dhEmi>2024-01-01T00:00:00-03:00</dhEmi></ide>" +
          "<emit><CNPJ>12345678000199</CNPJ></emit></infNFe></NFe>"
      ),
    (erro) => erro instanceof ParseError && erro.codigo === "MODELO_NAO_SUPORTADO"
  );
});

// ---------------------------------------------------------------------------
console.log(`\n${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
}
