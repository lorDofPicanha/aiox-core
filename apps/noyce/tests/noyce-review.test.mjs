// Testes do fluxo Interesse → Dossiê → Revisão humana.
// Regra crítica (owner 12/Jun): valor corrigido pelo humano SEMPRE prevalece e trava o item.
import assert from "node:assert/strict";
import { test } from "node:test";

const { buildReviewDossier, mergeReview, reviewProgress } = await import("../lib/noyce-review.ts");

const CCP = {
  identity: {
    razaoSocial: "ENIAC EMPREENDIMENTOS LTDA",
    cnpj: "36.819.268/0001-05",
    creaEmpresa: "CREA-GO 39711",
    porte: "ME",
    regime: "Simples",
    sedeMunicipioIbge: "5200258",
  },
  rts: [],
  acervo: [],
  financials: [],
  regularity: [],
  derived: { capabilityByService: {} },
};

const OPPORTUNITY = {
  id: "opp-1",
  source: "pncp",
  title: "Execução de obra",
  buyer: "Prefeitura de Águas Lindas",
  city: "Águas Lindas de Goiás",
  uf: "GO",
  estimatedValue: 2831789.56,
  proposalDeadline: "2026-06-30T13:00:00Z",
  market: null,
  habilitationChecklist: [
    { label: "Fiscal e trabalhista", status: "missing", note: "Vault sem certidões." },
    { label: "Econômico-financeira", status: "ok", note: "Folga 3,2×." },
  ],
};

test("dossiê pré-preenche certame + 4 frentes + declarações com dados ENIAC + proposta", () => {
  const items = buildReviewDossier(OPPORTUNITY, CCP);
  const secoes = new Set(items.map((i) => i.secao));
  assert.ok(secoes.has("Dados do certame"));
  assert.ok(secoes.has("Habilitação — 4 frentes"));
  assert.ok(secoes.has("Declarações (pré-redigidas)"));
  assert.ok(secoes.has("Proposta"));
  const decl = items.find((i) => i.label.includes("fato impeditivo"));
  assert.match(decl.valorMotor, /ENIAC EMPREENDIMENTOS LTDA/);
  assert.match(decl.valorMotor, /36\.819\.268\/0001-05/);
  for (const item of items) assert.ok(item.proveniencia.length > 0, "todo item tem proveniência");
});

test("correção humana prevalece sobre o motor e fica registrada com o valor original", () => {
  const items = buildReviewDossier(OPPORTUNITY, CCP);
  const alvo = items[0];
  const reviewed = mergeReview(items, {
    [alvo.id]: { status: "corrigido", valorHumano: "Texto definido pelo humano", em: "2026-06-12T12:00:00Z" },
  });
  const item = reviewed.find((i) => i.id === alvo.id);
  assert.equal(item.status, "corrigido");
  assert.equal(item.valorFinal, "Texto definido pelo humano");
  assert.equal(item.valorMotor, alvo.valorMotor, "valor original do motor preservado como histórico");
});

test("re-rodar o motor NÃO sobrescreve correção humana (trava)", () => {
  const state = {};
  const v1 = buildReviewDossier(OPPORTUNITY, CCP);
  state[v1[1].id] = { status: "corrigido", valorHumano: "Valor humano fixo", em: "2026-06-12T12:00:00Z" };
  // motor re-roda (ex.: snapshot atualizado muda o valorMotor)
  const v2 = buildReviewDossier({ ...OPPORTUNITY, estimatedValue: 999999 }, CCP);
  const reviewed = mergeReview(v2, state);
  const item = reviewed.find((i) => i.id === v1[1].id);
  assert.equal(item.valorFinal, "Valor humano fixo", "humano prevalece mesmo com motor recalculado");
});

test("progresso: pendentes contam; 100% revisado = pronto", () => {
  const items = buildReviewDossier(OPPORTUNITY, CCP);
  const none = reviewProgress(mergeReview(items, {}));
  assert.equal(none.done, 0);
  assert.equal(none.ready, false);
  const all = {};
  for (const item of items) all[item.id] = { status: "aprovado", em: "2026-06-12T12:00:00Z" };
  const full = reviewProgress(mergeReview(items, all));
  assert.equal(full.done, full.total);
  assert.equal(full.ready, true);
});

// ── A3 (conclave 12/Jun, Niebuhr): placeholder assinado é bomba armada ──

test("A3: nenhuma declaração pré-redigida contém reticências/placeholder aprovável", () => {
  const items = buildReviewDossier(OPPORTUNITY, CCP);
  const declaracoes = items.filter((i) => i.secao.startsWith("Declarações"));
  assert.ok(declaracoes.length >= 4);
  for (const decl of declaracoes) {
    const temPlaceholder = /\.\.\.|\bTBD\b|\bXXX\b/i.test(decl.valorMotor);
    if (temPlaceholder) {
      assert.equal(decl.requerCorrecao, true, `"${decl.label}" tem placeholder e PRECISA estar travada`);
    }
  }
  // A declaração de elaboração independente especificamente não pode mais ter reticências
  const indep = declaracoes.find((i) => i.label.includes("independente"));
  assert.ok(!/\.\.\./.test(indep.valorMotor), "texto completo, sem reticências");
  assert.ok(indep.aviso, "aviso de que o modelo do edital prevalece");
});

// ── A4 (conclave 12/Jun, Justen): clamp de exequibilidade art. 59 §§4º-5º ──

test("A4: mediana abaixo de 75% do estimado é clampada no piso legal", () => {
  const opp = {
    ...OPPORTUNITY,
    estimatedValue: 1_000_000,
    market: { priceBand: { medianBRL: 600_000, p25BRL: 500_000, p75BRL: 700_000 } },
  };
  const item = buildReviewDossier(opp, CCP).find((i) => i.label === "Valor de abertura sugerido");
  assert.match(item.valorMotor, /ABAIXO do piso legal/);
  assert.match(item.valorMotor, /750\.000/); // sugerido = piso 75%
  assert.ok(item.aviso, "abaixo de 85% → aviso de garantia adicional (§5º)");
});

test("A4: sem histórico, a faixa legal aparece (piso 75% + teto estimado)", () => {
  const opp = { ...OPPORTUNITY, estimatedValue: 1_000_000, market: null };
  const item = buildReviewDossier(opp, CCP).find((i) => i.label === "Valor de abertura sugerido");
  assert.match(item.valorMotor, /750\.000/);
  assert.match(item.valorMotor, /art\. 59/);
});

// ── E4 (Norman, conclave 12/Jun): trilha de auditoria registra QUEM revisou ──

test("E4: decisão com `por` propaga revisadoPor; sem `por` fica anônima (retrocompatível)", () => {
  const items = buildReviewDossier(OPPORTUNITY, CCP);
  const [a, b, c] = items;
  const reviewed = mergeReview(items, {
    [a.id]: { status: "aprovado", em: "2026-07-02T12:00:00Z", por: "Alice" },
    [b.id]: { status: "corrigido", valorHumano: "Texto da Aline", em: "2026-07-02T12:05:00Z", por: "Aline" },
    [c.id]: { status: "aprovado", em: "2026-07-02T12:10:00Z" }, // decisão antiga, sem identidade
  });
  assert.equal(reviewed.find((i) => i.id === a.id).revisadoPor, "Alice");
  const corrigido = reviewed.find((i) => i.id === b.id);
  assert.equal(corrigido.revisadoPor, "Aline");
  assert.equal(corrigido.valorFinal, "Texto da Aline");
  assert.equal(reviewed.find((i) => i.id === c.id).revisadoPor, undefined, "estado antigo continua válido");
});

// ── Padrão-ouro do pacote vencedor (padrao-qualidade-documentos.md, P2 fechado 02/Jul) ──

const FIN_2025 = {
  exercicio: 2025,
  patrimonioLiquido: 500_000,
  capitalSocial: 100_000,
  ativoCirc: 400_000,
  passivoCirc: 100_000,
  ativoTotal: 900_000,
  realizavelLongoPrazo: 0,
  exigivelLongoPrazo: 100_000,
  receitaBruta: 314_963,
  resultado: 50_000,
  fonte: "Balanço 2025 (teste)",
};

test("padrão-ouro: TODAS as declarações template carregam 'sob as penas' (marcador 4)", async () => {
  const { DECLARACAO_TEMPLATES } = await import("../lib/noyce-declaracoes.ts");
  for (const tpl of DECLARACAO_TEMPLATES) {
    if (tpl.especial) continue; // ME/EPP vem da derivação de porte
    assert.match(tpl.texto("EMPRESA X (CNPJ 00.000.000/0001-00)"), /sob as penas/i, `"${tpl.label}" sem fórmula de responsabilidade`);
  }
});

test("padrão-ouro: habilitação jurídica (contrato social) SEMPRE presente no dossiê, travada p/ vault", () => {
  const items = buildReviewDossier(OPPORTUNITY, CCP);
  const juridica = items.find((i) => i.secao === "Habilitação Jurídica (anexar do vault)");
  assert.ok(juridica, "peça de habilitação jurídica presente");
  assert.match(juridica.valorMotor, /contrato social|ato constitutivo/i);
  assert.match(juridica.valorMotor, /art\. 66/);
  assert.equal(juridica.requerCorrecao, true, "não é assinável pelo motor — depende do vault");
});

/** ERM completo (formato do extractErm) — o motor de habilitação exige a forma cheia. */
function ermCompleto(indices) {
  return {
    meta: { orgao: "Município X", cnpjOrgao: null, municipioIbge: null, modalidade: 6, valorEstimado: 1_000_000, dataPublicacao: null, dataSessao: null, criterioJulgamento: "menor preço", regimeExecucao: null },
    economicoFinanceira: { exigePL: false, percentualPL: null, indices, justificativaPresente: null, garantiaPropostaPct: null, clausula: null },
    tecnica: { profissional: [], operacional: [], quadroTecnico: [], parcelasMaiorRelevancia: [], tetoQuantitativo: null, somatorio: { permitido: true }, aceitaAcervoConsorcio: null, restricaoTempoLocal: false, marcaSemSimilar: false, clausula: null },
    juridica: { declaracoes: [], clausula: null },
    fiscalTrabalhista: { CNDs: [], SICAF: null, clausula: null },
  };
}

test("padrão-ouro: Modelo J (capacidade financeira) sai como DECLARAÇÃO com PL + índices do balanço real", () => {
  const ccpComBalanco = { ...CCP, financials: [FIN_2025] };
  const items = buildReviewDossier(OPPORTUNITY, ccpComBalanco, ermCompleto({ LC: 1.0 }));
  const modeloJ = items.find((i) => i.id.endsWith("decl-capacidade-financeira"));
  assert.ok(modeloJ, "Modelo J presente quando há balanço");
  assert.equal(modeloJ.secao, "Declarações (pré-redigidas)", "envelopada como declaração (gera .docx)");
  assert.match(modeloJ.valorMotor, /sob as penas/i);
  assert.match(modeloJ.valorMotor, /2025/);
  assert.match(modeloJ.valorMotor, /Liquidez Corrente/);
  // LC real = 400k/100k = 4,00 ≥ exigido 1,0 → assinável (sem requerCorrecao)
  assert.notEqual(modeloJ.requerCorrecao, true, "índices atendem → declaração assinável");
});

test("padrão-ouro: Modelo J TRAVA quando índice do balanço fica abaixo do exigido (não assinar capacidade que não tem)", () => {
  const ccpComBalanco = { ...CCP, financials: [FIN_2025] };
  // exige LC ≥ 5; real = 400k/100k = 4 → reprova
  const items = buildReviewDossier(OPPORTUNITY, ccpComBalanco, ermCompleto({ LC: 5.0 }));
  const modeloJ = items.find((i) => i.id.endsWith("decl-capacidade-financeira"));
  assert.ok(modeloJ);
  assert.equal(modeloJ.requerCorrecao, true, "índice reprovado → aprovação bloqueada");
  assert.match(modeloJ.aviso, /NÃO assinar/i);
});
