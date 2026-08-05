// Colheita de editais REAIS do PNCP para o RAG (knowledge-base/editais-ref/).
// Motivo (founder, 02/Jul): 8 editais de referência é amostra, não base — alvo ≥80.
//
// Estratégia: NÃO guardar o texto integral (8 atuais têm 12k+ linhas cada — 80 assim
// inviabilizariam o índice BM25). Guardamos as SEÇÕES que os agentes consultam
// (objeto, habilitação técnica/econômica/fiscal, declarações, garantia, proposta,
// consórcio, orçamento), cada uma capada, com frontmatter de proveniência PNCP.
//
// Seleção DIVERSIFICADA: estratifica o snapshot por UF × modalidade × banda de valor
// e faz round-robin entre os estratos — 80 editais parecidos ensinam menos que 80 variados.
//
// Uso:
//   node --experimental-strip-types scripts/noyce/build-editais-ref.mjs           (alvo 80)
//   node --experimental-strip-types scripts/noyce/build-editais-ref.mjs 40        (alvo 40)
//   node --experimental-strip-types scripts/noyce/build-editais-ref.mjs 80 --dry  (só lista a seleção)
//
// Fonte legal: PNCP API pública oficial (Lei 14.133, art. 174) — read-only, UA identificado,
// delay educado entre downloads (o PNCP rate-limita bursts).

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { fetchAndExtractEdital } from "../../lib/edital/pncp-source.ts";

const here = dirname(fileURLToPath(import.meta.url));
const KB_DIR = join(here, "..", "..", "lib", "data", "knowledge-base", "editais-ref");
const SNAPSHOT = join(here, "..", "..", "lib", "data", "discovery-snapshot.json");

const args = process.argv.slice(2);
const TARGET = Number.parseInt(args.find((a) => /^\d+$/.test(a)) ?? "80", 10);
const DRY = args.includes("--dry");
const DELAY_MS = 2500; // educado com o PNCP
const SECTION_CAP = 7000; // chars por seção — chunk BM25 saudável, sem inchar o repo

const SECTION_LABELS = {
  objeto: "Objeto",
  habilitacaoTecnica: "Habilitação técnica",
  habilitacaoEconomica: "Habilitação econômico-financeira",
  habilitacaoFiscal: "Habilitação fiscal e trabalhista",
  declaracoes: "Declarações exigidas",
  garantia: "Garantia",
  proposta: "Proposta e julgamento",
  consorcio: "Consórcio",
  orcamento: "Orçamento e planilhas",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function slug(s) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function valueBand(v) {
  if (v === null || !Number.isFinite(v)) return "valor-nd";
  if (v < 500_000) return "ate-500k";
  if (v < 2_000_000) return "500k-2m";
  return "acima-2m";
}

function cap(text) {
  const t = text.replace(/\s+\n/g, "\n").trim();
  return t.length > SECTION_CAP ? `${t.slice(0, SECTION_CAP)}\n\n> …(seção truncada em ${SECTION_CAP} caracteres — íntegra no PNCP)` : t;
}

// ── 1. Seleção estratificada ──
const snapshot = JSON.parse(readFileSync(SNAPSHOT, "utf8"));
const existing = new Set(
  readdirSync(KB_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, "")),
);

const candidates = snapshot.items.filter((it) => it.id && !existing.has(`edital-pncp-${slug(it.id)}`));

// Prioridade OBRA: o RAG ensina habilitação de OBRA de engenharia — edital de aquisição
// (medicamento, software, ambulância…) só entra se faltar obra p/ fechar o alvo.
const OBRA_TITLE_RE = /\bobras?\b|engenharia|reforma|constru[çc]|pavimenta|edifica|amplia[çc]|drenagem|terraplan|recupera[çc][ãa]o\s+(?:de\s+)?(?:estrutural|pr[ée]dio|via|estrada)|cal[çc]ament|quadra|gin[áa]sio|ponte|muro|pra[çc]a|creche|escola|ubs\b/i;
const ACQUISITION_RE = /aquisi[çc][ãa]o|compra\s+de|fornecimento\s+de\s+(?!m[ãa]o\s+de\s+obra)|loca[çc][ãa]o\s+de\s+(?:im[óo]vel|ve[íi]culo|equipamento|software)|licen[çc]a|medicament|merenda|g[êe]neros\s+aliment|material\s+(?:de\s+)?(?:expediente|escolar|limpeza)|servi[çc]os\s+gr[áa]ficos|ades[ãa]o\s+a\s+ata/i;
const obras = candidates.filter((it) => OBRA_TITLE_RE.test(it.title) && !ACQUISITION_RE.test(it.title));
const outros = candidates.filter((it) => !obras.includes(it));

function stratify(pool) {
  const strata = new Map();
  for (const it of pool) {
    const key = `${it.uf}|${slug(it.modality ?? "nd")}|${valueBand(it.estimatedValue)}`;
    if (!strata.has(key)) strata.set(key, []);
    strata.get(key).push(it);
  }
  // dentro de cada estrato, mais perto primeiro (nicho ENIAC)
  for (const list of strata.values()) list.sort((a, b) => a.distanceKm - b.distanceKm);
  return strata;
}

function roundRobin(strata, limit, into) {
  const keys = [...strata.keys()].sort();
  for (let round = 0; into.length < limit; round++) {
    let picked = false;
    for (const key of keys) {
      const list = strata.get(key);
      if (round < list.length && into.length < limit) {
        into.push(list[round]);
        picked = true;
      }
    }
    if (!picked) break; // estratos esgotados
  }
}

const selected = [];
const obraStrata = stratify(obras);
const otherStrata = stratify(outros);
roundRobin(obraStrata, TARGET, selected);
const soObras = selected.length;
if (selected.length < TARGET) roundRobin(otherStrata, TARGET, selected); // completa se faltar obra
console.log(`Pool: ${obras.length} obras + ${outros.length} outros · selecionados ${soObras} de obra + ${selected.length - soObras} de aquisição/serviço`);

console.log(`Snapshot: ${snapshot.items.length} editais · já no RAG: ${existing.size} · candidatos: ${candidates.length}`);
console.log(`Alvo: ${TARGET} novos · selecionados: ${selected.length} de ${obraStrata.size + otherStrata.size} estratos (UF×modalidade×valor)`);
if (DRY) {
  for (const it of selected) console.log(`  ${it.id} · ${it.uf} · ${it.modality} · ${valueBand(it.estimatedValue)} · ${it.distanceKm}km · ${it.title.slice(0, 70)}`);
  process.exit(0);
}

// ── 2. Colheita ──
mkdirSync(KB_DIR, { recursive: true });
let ok = 0, fail = 0, vazio = 0;
for (const [i, it] of selected.entries()) {
  const docId = `edital-pncp-${slug(it.id)}`;
  process.stdout.write(`[${i + 1}/${selected.length}] ${it.id} … `);
  try {
    const ex = await fetchAndExtractEdital(it.id);
    const sections = Object.entries(SECTION_LABELS)
      .map(([key, label]) => ({ label, text: (ex.sections[key] ?? "").trim() }))
      .filter((s) => s.text.length >= 80); // seção quase-vazia não ensina nada
    if (sections.length === 0) {
      vazio++;
      console.log("vazio (PDF sem texto extraível) — pulado");
      await sleep(DELAY_MS);
      continue;
    }
    const valor = it.estimatedValue !== null ? `R$ ${it.estimatedValue.toLocaleString("pt-BR")}` : "não informado";
    const md = `---
title: "Edital PNCP — ${it.title.replace(/"/g, "'").slice(0, 110)}"
docId: ${docId}
tags: [edital, referencia, pncp, ${slug(it.uf)}, ${slug(it.modality ?? "modalidade-nd")}, ${valueBand(it.estimatedValue)}]
audience: agents
sourceRefs: ["pncp:${it.id}"]
---

> Edital real colhido do PNCP (API pública, Lei 14.133 art. 174) em ${new Date().toISOString().slice(0, 10)}.
> Órgão: ${it.buyer} · ${it.city}/${it.uf} (${it.distanceKm} km da sede) · Valor estimado: ${valor} · Modalidade: ${it.modality ?? "n/d"}.
> Seções extraídas do(s) PDF(s) oficial(is): ${ex.docs.join("; ").slice(0, 200)}. Íntegra no PNCP (${it.id}).

${sections.map((s) => `## ${s.label}\n\n${cap(s.text)}`).join("\n\n")}
`;
    writeFileSync(join(KB_DIR, `${docId}.md`), md, "utf8");
    ok++;
    console.log(`✓ ${sections.length} seções (${sections.map((s) => s.label.split(" ")[0]).join(", ")})`);
  } catch (e) {
    fail++;
    console.log(`✗ ${e?.message ?? e}`);
  }
  await sleep(DELAY_MS);
}

console.log(`\n✅ Colheita: ${ok} gravados · ${vazio} sem texto (pulados) · ${fail} falhas · RAG editais-ref agora tem ${existing.size + ok} editais.`);
