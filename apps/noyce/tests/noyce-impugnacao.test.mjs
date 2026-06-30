// Tier 3: sinais novos (vedação somatório, exige propriedade) + minuta de impugnação fundamentada.
import assert from "node:assert/strict";
import { test } from "node:test";

const { extractErm } = await import("../lib/edital/extract-erm.ts");
const { buildImpugnacaoMinuta } = await import("../lib/noyce-impugnacao-minuta.ts");

const EMPTY = { objeto: "", habilitacaoTecnica: "", habilitacaoEconomica: "", habilitacaoFiscal: "", orcamento: "", proposta: "", garantia: "", declaracoes: "", consorcio: "" };
const CCP = { identity: { razaoSocial: "ENIAC EMPREENDIMENTOS LTDA", cnpj: "36.819.268/0001-05" } };

test("extração: detecta VEDAÇÃO ao somatório de atestados (somatorio.permitido = false)", () => {
  const { erm } = extractErm({ ...EMPTY, habilitacaoTecnica: "Não será admitido o somatório de atestados para fins de qualificação técnica." });
  assert.equal(erm.tecnica.somatorio.permitido, false);
});

test("extração: detecta exigência de PROPRIEDADE de equipamento", () => {
  const { erm } = extractErm({ ...EMPTY, habilitacaoTecnica: "A licitante deverá comprovar a propriedade dos equipamentos e da frota própria necessários." });
  assert.equal(erm.tecnica.exigePropriedade, true);
});

test("extração: somatório permitido continua true; sem cláusula → null", () => {
  const a = extractErm({ ...EMPTY, habilitacaoTecnica: "É permitido o somatório de atestados." });
  assert.equal(a.erm.tecnica.somatorio.permitido, true);
  const b = extractErm({ ...EMPTY, habilitacaoTecnica: "Qualificação técnica conforme anexo." });
  assert.equal(b.erm.tecnica.somatorio.permitido, null);
});

const SIGNAL = (tipo) => ({
  tier: 1, tipo,
  evidenciaEdital: { numero: "9.5.1", texto: "exigência X", trecho: "comprovar propriedade dos equipamentos" },
  hookLegal: { artigo: "Lei 14.133/2021, art. 67 III; Sumula TCU 272", descricao: "só admite disponibilidade, não propriedade" },
  severidade: "alta", acao: "impugnar", proveniencia: "grounded",
});

test("minuta de impugnação: peça formal fundamentada, requer revisão humana", () => {
  const m = buildImpugnacaoMinuta({ signal: SIGNAL("EXIGE_PROPRIEDADE_EQUIP"), ccp: CCP, certame: { titulo: "Reforma de escola", orgao: "Município de X" }, dataLimite: "2026-07-05" });
  assert.equal(m.requerCorrecao, true);
  assert.match(m.texto, /IMPUGNAÇÃO ao/);
  assert.match(m.texto, /art\. 164/);
  assert.match(m.texto, /art\. 67, III/); // fundamento específico
  assert.match(m.texto, /Súmula TCU/);
  assert.match(m.texto, /9\.5\.1/); // cláusula
  assert.match(m.texto, /ENIAC EMPREENDIMENTOS/);
  assert.ok(m.avisos.some((a) => /advogado|revis/i.test(a)));
  assert.ok(m.avisos.some((a) => /2026-07-05/.test(a)));
});

test("minuta: cada tipo de sinal tem fundamento próprio (somatório)", () => {
  const m = buildImpugnacaoMinuta({ signal: SIGNAL("VEDACAO_SOMATORIO_SEM_MOTIVO"), ccp: CCP, certame: { titulo: "Obra", orgao: "Órgão Y" } });
  assert.match(m.texto, /1153\/2024/);
  assert.match(m.texto, /somat[óo]rio/i);
});
