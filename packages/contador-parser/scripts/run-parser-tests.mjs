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
  // 🟡-C: ICMS destacado (base/alíquota/valor) extraído do ICMS00.
  assert.equal(i1.icms.baseCalculo, 1500);
  assert.equal(i1.icms.aliquota, 18);
  assert.equal(i1.icms.valor, 270);
  // item 2 sem destaque de valores → ausência legítima, sem invenção de zero.
  assert.equal(doc.itens[1].icms.valor, undefined);
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
  // 🟡-D: ICMS do item sobrevive ao mapper (portador p/ Auditoria futura).
  assert.equal(itens[0].icms.cst, "00");
  assert.equal(itens[0].icms.valor, 270);
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
  // 🟡-D: ICMS do frete sobrevive ao mapper (crédito de ICMS-frete na trilha).
  assert.equal(item.icms.baseCalculo, 1200);
  assert.equal(item.icms.aliquota, 12);
  assert.equal(item.icms.valor, 144);
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

// ===========================================================================
// R4 — QA fixes: 🔴-1 (perda silenciosa de tributo) + 🔴-2 (layout IBS)
// ===========================================================================

// 🔴-1: valor de tributo PRESENTE mas ilegível é corrupção, não ausência — deve
// lançar ParseError em vez de desaparecer (viraria "tributo zero" na auditoria).
teste("🔴-1 NFS-e: vCBS presente mas nao-numerico => ParseError (nao some)", () => {
  const corrompido = ler("nfse-nacional-ibscbs.xml").replace(
    "<vCBS>90.00</vCBS>",
    "<vCBS>ABC</vCBS>"
  );
  assert.throws(
    () => parseNFSeNacional(corrompido),
    (erro) => erro instanceof ParseError && erro.codigo === "ESTRUTURA_INVALIDA"
  );
});

teste("🔴-1 CT-e: vICMS presente mas nao-numerico => ParseError (nao some)", () => {
  const corrompido = ler("cte-57-normal.xml").replace(
    "<vICMS>144.00</vICMS>",
    "<vICMS>--</vICMS>"
  );
  assert.throws(
    () => parseCTe(corrompido),
    (erro) => erro instanceof ParseError && erro.codigo === "ESTRUTURA_INVALIDA"
  );
});

// 🔴-A (QA 26/Jun): a guarda estrita do 🔴-1 cobria NFS-e e CT-e mas NÃO o parser
// de maior volume (NF-e/NFC-e). vPIS/vCOFINS presentes porém ilegíveis viravam
// undefined e o crédito (vPIS+vCOFINS) evaporava silenciosamente no caminho da
// Recuperação monofásica. Estes dois testes travam a regressão.
teste("🔴-A NF-e: vPIS presente mas nao-numerico => ParseError (nao some)", () => {
  const corrompido = ler("nfe-55-normal.xml").replace("<vPIS>24.75</vPIS>", "<vPIS>--</vPIS>");
  assert.throws(
    () => parseNFe(corrompido),
    (erro) => erro instanceof ParseError && erro.codigo === "ESTRUTURA_INVALIDA"
  );
});

teste("🔴-A NF-e: vCOFINS com formatacao de ERP (R$/virgula) => ParseError", () => {
  // contra-exemplo real do QA: ERP exporta "R$ 3.800,00" em vez de número cru.
  const corrompido = ler("nfe-55-normal.xml").replace(
    "<vCOFINS>114.00</vCOFINS>",
    "<vCOFINS>R$ 3.800,00</vCOFINS>"
  );
  assert.throws(
    () => parseNFe(corrompido),
    (erro) => erro instanceof ParseError && erro.codigo === "ESTRUTURA_INVALIDA"
  );
});

// 🔴-2: layout alternativo (grupo gIBS único, sem split UF/Município) deve ser
// lido — o IBS não pode evaporar do documento.
teste("🔴-2 NFS-e: IBS em grupo gIBS unico (sem split UF/Mun) e extraido", () => {
  const single = ler("nfse-nacional-ibscbs.xml").replace(
    /<gIBSUF>[\s\S]*?<\/gIBSMun>/,
    "<gIBS><pIBS>0.15</pIBS><vIBS>15.00</vIBS></gIBS>"
  );
  const ibsCbs = parseNFSeNacional(single).itens[0].ibsCbs;
  assert.ok(ibsCbs, "deve ter grupo IBS/CBS");
  assert.equal(ibsCbs.valorIbs, 15);
  assert.ok(Math.abs(ibsCbs.aliquotaIbs - 0.15) < 1e-9, "aliquotaIbs ~ 0.15");
  assert.notEqual(ibsCbs.ibsIndeterminado, true); // IBS foi resolvido
});

// 🔴-2: CBS presente mas IBS ausente de qualquer layout => NÃO reportar IBS-zero
// silencioso; flagar ibsIndeterminado para revisão humana (trilha de boa-fé).
teste("🔴-2 NFS-e: CBS presente sem IBS => ibsIndeterminado (nao IBS-zero mudo)", () => {
  const semIbs = ler("nfse-nacional-ibscbs.xml").replace(/<gIBSUF>[\s\S]*?<\/gIBSMun>/, "");
  const ibsCbs = parseNFSeNacional(semIbs).itens[0].ibsCbs;
  assert.ok(ibsCbs, "grupo IBSCBS ainda presente (tem CBS)");
  assert.equal(ibsCbs.valorCbs, 90); // CBS intacto
  assert.equal(ibsCbs.valorIbs, undefined); // IBS não foi inventado como zero
  assert.equal(ibsCbs.ibsIndeterminado, true); // sinalizado p/ revisão
});

// 🟡-7 (guarda barata): NFS-e sem grupo IBSCBS (Simples pré-reforma) — ibsCbs
// ausente; ausência legítima do grupo ≠ falha de extração (sem flag).
teste("R4 NFS-e sem grupo IBSCBS => ibsCbs undefined", () => {
  const semGrupo = ler("nfse-nacional-ibscbs.xml").replace(/<IBSCBS>[\s\S]*?<\/IBSCBS>/, "");
  assert.equal(parseNFSeNacional(semGrupo).itens[0].ibsCbs, undefined);
});

// ===========================================================================
// QA 26/Jun (handoff 61) — 🟡-B guarda simétrica CBS/IBS + 🟡-C ICMS NF-e
// ===========================================================================

// 🟡-B caso A (espelho do 🔴-2): IBS presente mas CBS federal ausente => a CBS
// não pode evaporar silenciosa — flagar cbsIndeterminado, sem inventar zero.
teste("🟡-B NFS-e: IBS presente sem CBS => cbsIndeterminado (nao CBS-zero mudo)", () => {
  const semCbs = ler("nfse-nacional-ibscbs.xml").replace(/<gCBS>[\s\S]*?<\/gCBS>/, "");
  const ibsCbs = parseNFSeNacional(semCbs).itens[0].ibsCbs;
  assert.ok(ibsCbs, "grupo IBSCBS ainda presente (tem IBS)");
  assert.equal(ibsCbs.valorIbs, 15); // IBS intacto
  assert.equal(ibsCbs.valorCbs, undefined); // CBS não foi inventada como zero
  assert.equal(ibsCbs.cbsIndeterminado, true); // sinalizada p/ revisão
  assert.notEqual(ibsCbs.ibsIndeterminado, true); // IBS foi resolvido
});

// 🟡-B caso B: CST 000 (tributação integral) mas CBS e IBS ambos AUSENTES =>
// item "tributado" sem tributo nunca sai como zero mudo — ambos os lados flagados.
teste("🟡-B NFS-e: CST tributado com CBS e IBS ausentes => ambos indeterminados", () => {
  const semTributos = ler("nfse-nacional-ibscbs.xml")
    .replace(/<gCBS>[\s\S]*?<\/gCBS>/, "")
    .replace(/<gIBSUF>[\s\S]*?<\/gIBSMun>/, "");
  const ibsCbs = parseNFSeNacional(semTributos).itens[0].ibsCbs;
  assert.ok(ibsCbs, "grupo IBSCBS ainda presente (CST + cClassTrib + vBC)");
  assert.equal(ibsCbs.cst, "000");
  assert.equal(ibsCbs.valorCbs, undefined);
  assert.equal(ibsCbs.valorIbs, undefined);
  assert.equal(ibsCbs.cbsIndeterminado, true);
  assert.equal(ibsCbs.ibsIndeterminado, true);
});

// 🟡-B caso B (variante): CST 000 mas CBS e IBS explicitamente ZERADOS =>
// valores extraídos como 0 (preserva o bruto) porém flagados p/ revisão.
teste("🟡-B NFS-e: CST tributado com CBS e IBS zerados => ambos indeterminados", () => {
  const zerado = ler("nfse-nacional-ibscbs.xml")
    .replace("<pCBS>0.90</pCBS>", "<pCBS>0</pCBS>")
    .replace("<vCBS>90.00</vCBS>", "<vCBS>0.00</vCBS>")
    .replace("<pIBSUF>0.10</pIBSUF>", "<pIBSUF>0</pIBSUF>")
    .replace("<vIBSUF>10.00</vIBSUF>", "<vIBSUF>0.00</vIBSUF>")
    .replace("<pIBSMun>0.05</pIBSMun>", "<pIBSMun>0</pIBSMun>")
    .replace("<vIBSMun>5.00</vIBSMun>", "<vIBSMun>0.00</vIBSMun>");
  const ibsCbs = parseNFSeNacional(zerado).itens[0].ibsCbs;
  assert.equal(ibsCbs.valorCbs, 0); // bruto preservado (não é undefined)
  assert.equal(ibsCbs.valorIbs, 0);
  assert.equal(ibsCbs.cbsIndeterminado, true); // mas nunca zero MUDO sob CST 000
  assert.equal(ibsCbs.ibsIndeterminado, true);
});

// 🟡-B fronteira: CST FORA da micro-tabela de tributação integral (ex.: 200) com
// tributos ausentes => SEM flag pelo caminho do CST (não inventar regra sem
// rótulo — tabela completa é gate do tributarista, doc 46).
teste("🟡-B NFS-e: CST fora da micro-tabela sem tributos => sem flag (gate tributarista)", () => {
  const cstReduzido = ler("nfse-nacional-ibscbs.xml")
    .replace("<CST>000</CST>", "<CST>200</CST>")
    .replace(/<gCBS>[\s\S]*?<\/gCBS>/, "")
    .replace(/<gIBSUF>[\s\S]*?<\/gIBSMun>/, "");
  const ibsCbs = parseNFSeNacional(cstReduzido).itens[0].ibsCbs;
  assert.equal(ibsCbs.cst, "200");
  assert.notEqual(ibsCbs.cbsIndeterminado, true);
  assert.notEqual(ibsCbs.ibsIndeterminado, true);
});

// 🟡-C guarda estrita: vICMS presente porém ilegível na NF-e é corrupção (🔴-1),
// não ausência — mesmo padrão do CT-e.
teste("🟡-C NF-e: vICMS presente mas nao-numerico => ParseError (nao some)", () => {
  const corrompido = ler("nfe-55-normal.xml").replace(
    "<vICMS>270.00</vICMS>",
    "<vICMS>R$ 270,00</vICMS>"
  );
  assert.throws(
    () => parseNFe(corrompido),
    (erro) => erro instanceof ParseError && erro.codigo === "ESTRUTURA_INVALIDA"
  );
});

// ---------------------------------------------------------------------------
console.log(`\n${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
}
