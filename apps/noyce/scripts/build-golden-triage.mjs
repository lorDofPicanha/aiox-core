// SEED (one-shot) do golden set de triagem. Seleciona ~25 editais REAIS do discovery-snapshot,
// balanceados por categoria, CONGELA os campos (independe do snapshot vivo, que oscila) e propõe
// um rótulo humano (vai/olha/pula) + porquê. TODOS saem com needsReview:true — o owner confirma/
// corrige os rótulos antes de o gate usar como juiz. asOf fixo torna os rótulos de prazo estáveis.
//
//   cd apps/noyce && node --experimental-strip-types scripts/build-golden-triage.mjs
//
// Roda UMA vez para semear lib/eval/golden-triage.json; depois o golden é a fonte da verdade
// (versionado, editado à mão). Re-rodar re-semeia do snapshot atual (perde edições manuais).

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const snap = JSON.parse(readFileSync(join(here, "../lib/data/discovery-snapshot.json"), "utf8"));

const ASOF = "2026-06-01T00:00:00Z"; // ref fixa do golden: deadlines < ASOF = encerrado.
const RAIO = 500;

// só 2026 com data parseável; dedupe por título.
const seen = new Set();
const items = (snap.items || []).filter((it) => {
  if (!it.proposalDeadline) return false;
  const d = new Date(it.proposalDeadline);
  if (isNaN(d) || d.getFullYear() !== 2026) return false;
  const k = String(it.title).slice(0, 60).toLowerCase();
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

const closed = (it) => new Date(it.proposalDeadline) < new Date(ASOF);
const T = (it) => String(it.title);
const RE = {
  engClinica: /engenharia\s+cl[ií]nic/i,
  infra: /esta[çc][ãa]o de tratamento|esgoto|saneamento|pavimenta|drenagem|asfalt|terraplan|rodovi|contorno/i,
  regprecosMat: /registro de pre.os.*(aquisi|fornec).*(revestiment|pr[ée]-?molda|concreto|granito|piso|material de constru|cimento)/i,
  aquisicao: /\b(aquisi[çc][ãa]o|merenda|uniforme|cal[çc]ado|mobili|combust|medicament|ve[íi]culo|ambul[âa]ncia|ecoponto|ra[çc][ãa]o|brinquedo|material (escolar|de ))/i,
  edificacao: /constru|reforma|edifica|amplia|creche|escola|ubs|quadra|pra[çc]a|recupera|cobertura|pavilh[ãa]o|galp[ãa]o/i,
};

// Classifica + propõe rótulo provisório (perfil ENIAC: edificação, raio 500km, valor 80k–8M).
// PROVISÓRIO — needsReview sempre true.
function classify(it) {
  const title = T(it);
  const dist = it.distanceKm;
  const val = it.estimatedValue;
  if (closed(it)) return { cat: "prazo_vencido", label: "pula", why: "Prazo encerrado relativo à data de referência." };
  if (dist > RAIO) return { cat: "fora_raio", label: "pula", why: `Fora do raio operacional (${dist} km > ${RAIO}).` };
  if (RE.engClinica.test(title)) return { cat: "eng_clinica", label: "pula", why: "Engenharia clínica = equipamento hospitalar, não obra civil (perfil ENIAC)." };
  if (RE.infra.test(title)) return { cat: "infra", label: "pula", why: "PROVISÓRIO: infra/saneamento fora do escopo edificação (CONFIRMAR — pode virar vai/olha se ENIAC fizer infra)." };
  if (RE.regprecosMat.test(title)) return { cat: "regprecos_mat", label: "pula", why: "PROVISÓRIO: registro de preços p/ FORNECIMENTO de material ≠ execução de obra (CONFIRMAR)." };
  if (RE.aquisicao.test(title)) return { cat: "aquisicao", label: "pula", why: "Aquisição de bens/insumos, fora do nicho de obras." };
  if (val && val > 8_000_000) return { cat: "valor_alto", label: "olha", why: "PROVISÓRIO: acima do teto solo (~R$ 8M) → exige consórcio/atenção (CONFIRMAR vai/olha/pula)." };
  if (RE.edificacao.test(title) && !RE.aquisicao.test(title)) {
    const inFaixa = val == null || (val >= 80_000 && val <= 8_000_000);
    if (dist <= 170 && inFaixa) return { cat: "edificacao", label: "vai", why: "Edificação no nicho, dentro do raio próximo e valor na faixa." };
    if (dist <= RAIO && inFaixa) return { cat: "edificacao_media", label: "olha", why: `Edificação no nicho mas a ${dist} km — verificar viabilidade operacional.` };
    return { cat: "edificacao", label: "olha", why: "Edificação no nicho, checar valor/condições." };
  }
  return { cat: "outro", label: "pula", why: "Não se enquadra no perfil de obras da ENIAC." };
}

// alvo de quantidade por categoria p/ balancear ~25.
const TARGET = {
  edificacao: 5, edificacao_media: 2, aquisicao: 4, valor_alto: 3,
  infra: 2, regprecos_mat: 3, eng_clinica: 1, prazo_vencido: 3, fora_raio: 1, outro: 2,
};
const picked = {};
const golden = [];
for (const it of items) {
  const c = classify(it);
  picked[c.cat] = picked[c.cat] || 0;
  if (picked[c.cat] >= (TARGET[c.cat] || 0)) continue;
  picked[c.cat]++;
  golden.push({
    id: it.id,
    title: it.title,
    buyer: it.buyer ?? null,
    city: it.city,
    uf: it.uf,
    distanceKm: it.distanceKm,
    estimatedValue: it.estimatedValue ?? null,
    proposalDeadline: it.proposalDeadline,
    modality: it.modality ?? null,
    category: c.cat,
    label: c.label, // PROPOSTO — revisar
    rationale: c.why,
    needsReview: true,
  });
}

const out = {
  _comment: "GOLDEN SET de triagem do Noyce. Rótulos PROPOSTOS (needsReview:true) — owner revisa/corrige 'label' (vai|olha|pula) e zera needsReview. O gate compara o LLM contra 'label'. asOf é a data de referência fixa (prazo).",
  asOf: ASOF,
  seededFrom: snap.generatedAt ?? null,
  count: golden.length,
  byCategory: picked,
  items: golden,
};
writeFileSync(join(here, "../lib/eval/golden-triage.json"), JSON.stringify(out, null, 2));
console.log(`golden semeado: ${golden.length} editais · asOf ${ASOF}`);
console.log("por categoria:", JSON.stringify(picked));
