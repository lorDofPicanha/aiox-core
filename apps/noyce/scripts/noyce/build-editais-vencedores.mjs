// Colheita de EDITAIS VENCEDORES (founder, 02/Jul): certames de obra JÁ DECIDIDOS, com o
// lance ganhador conhecido — o padrão de qualidade real do mercado/nicho para o RAG.
//
// O PNCP não publica os DOCUMENTOS do vencedor (proposta/habilitação submetida — verificado
// na pesquisa padrao-qualidade-documentos.md); publica o que ensina o padrão: o EDITAL que
// o vencedor atendeu + QUEM venceu + POR QUANTO (feed /contratos). Cada doc do RAG junta:
// seções de habilitação do edital + bloco "Resultado — quem venceu" com o valor contratado.
//
// Pipeline: órgãos do raio 500km (CNPJs dos snapshots de discovery + concorrência) →
// /contratos?cnpjOrgao (12 meses, com retry — endpoint instável) → filtra OBRA → dedupe por
// compra → estratifica órgão×valor → baixa o edital (fetchAndExtractEdital) → grava no RAG.
//
// Uso:
//   node --experimental-strip-types scripts/noyce/build-editais-vencedores.mjs           (alvo 80)
//   node --experimental-strip-types scripts/noyce/build-editais-vencedores.mjs 40
//   node --experimental-strip-types scripts/noyce/build-editais-vencedores.mjs 80 --dry   (só fase 1 + seleção)
//
// Fonte legal: PNCP API pública oficial (Lei 14.133, art. 174) — read-only, UA identificado,
// delay educado (o PNCP rate-limita bursts e o /contratos cai com "Erro na comunicação").

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { fetchAndExtractEdital, listEditalDocs, parsePncpId, fetchDocBytes, expandToPdfs } from "../../lib/edital/pncp-source.ts";
import { extractEditalText } from "../../lib/edital/extract-edital.ts";

const here = dirname(fileURLToPath(import.meta.url));
const DATA = join(here, "..", "..", "lib", "data");
const KB_DIR = join(DATA, "knowledge-base", "editais-ref");

const args = process.argv.slice(2);
const TARGET = Number.parseInt(args.find((a) => /^\d+$/.test(a)) ?? "80", 10);
const DRY = args.includes("--dry");

const FEED = "https://pncp.gov.br/api/consulta/v1/contratos";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const PAGE_SIZE = 50;
const MAX_PAGES_PER_ORGAO = 6; // 300 contratos/órgão (janela de 24 meses)
const DELAY_MS = 900;
const EDITAL_DELAY_MS = 2500;
// Fase 1 é uma VARREDURA: órgão que falha 2x é pulado (perder 1 órgão instável é barato;
// esperar 60s de backoff por órgão custava ~2h no total). Fase 2 mantém retry padrão.
const RETRIES = 2;
const BACKOFF = [2500, 6000];
const ORGAO_CONCURRENCY = 4; // 4 órgãos em paralelo — moderado, com delay por página
const SECTION_CAP = 7000;

// "obra" NÃO pode casar dentro de "mão de obra" (terceirização) nem "obras públicas" em nome
// de evento — o lookbehind exclui "mão de"; NOT_OBRA_RE mata evento/apoio/terceirização.
const OBRA_RE = /(?<!m[ãa]o\s+de\s+)\bobras?\b|engenharia|reforma|constru[çc]|pavimenta|edifica|amplia[çc]|drenagem|terraplan|cal[çc]ament|quadra|gin[áa]sio|ponte|muro|pra[çc]a|creche|escola|ubs\b|recapeament|meio[- ]fio|sinaliza[çc][ãa]o\s+vi[áa]ria/i;
const NOT_OBRA_RE = /m[ãa]o\s+de\s+obra|semin[áa]rio|congresso|evento|curso|capacita[çc][ãa]o|treinamento|apoiar\s+a\s+execu[çc]|funda[çc][ãa]o\s+de\s+apoio|dedica[çc][ãa]o\s+exclusiva|posto[s]?\s+de\s+(?:trabalho|servi[çc]o)|vigil[âa]ncia|portaria\b|recep[çc]ionista|registro\s+de\s+pre[çc]o\s+de\s+n/i;
const ACQUISITION_RE = /aquisi[çc][ãa]o|compra\s+de|fornecimento\s+de|loca[çc][ãa]o\s+de\s+(?:im[óo]vel|ve[íi]culo|equipamento|software)|licen[çc]a\s+de\s+uso|medicament|merenda|g[êe]neros\s+aliment|material\s+(?:de\s+)?(?:expediente|escolar|limpeza)|servi[çc]os\s+gr[áa]ficos|ades[ãa]o\s+a\s+ata|limpeza,?\s+asseio|processo\s+de\s+empenho/i;

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

// Rota 1 (02/Jul): anexos PÓS-SESSÃO do certame vencido — quando o órgão sobe a proposta
// vencedora / ata de julgamento / termo de homologação no PNCP, isso é o mais perto do
// "documento do vencedor" que existe público. Cobertura varia por órgão; scan oportunista.
const POST_SESSION_RE = /proposta\s+(?:vencedora|readequada|ajustada|final)|ata\s+(?:da\s+sess|de\s+julgamento|de\s+abertura)|julgamento|homologa|adjudica|resultado|habilita[çc][ãa]o\s+(?:do\s+vencedor|da\s+empresa)/i;
const MAX_POST_DOCS = 3;
const POST_SECTION_CAP = 9000;

async function fetchPostSessionDocs(pncpId) {
  const ref = parsePncpId(pncpId);
  const docs = await listEditalDocs(ref);
  const picked = docs.filter((d) => POST_SESSION_RE.test(`${d.tipo} ${d.titulo}`)).slice(0, MAX_POST_DOCS);
  const out = [];
  for (const d of picked) {
    const bytes = await fetchDocBytes(ref, d.sequencialDocumento);
    if (!bytes) continue;
    const pdfs = await expandToPdfs(bytes, d.titulo || d.tipo);
    for (const pdf of pdfs.slice(0, 2)) {
      try {
        const text = await extractEditalText({ pdfBuffer: pdf.buf });
        if (text && text.trim().length > 150) out.push({ label: d.titulo || d.tipo, text: text.trim() });
      } catch { /* PDF escaneado/protegido — pula */ }
    }
    if (out.length >= MAX_POST_DOCS) break;
  }
  return out;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const fmtBRL = (v) => (typeof v === "number" && Number.isFinite(v) ? `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "não informado");

function valueBand(v) {
  if (v === null || v === undefined || !Number.isFinite(v)) return "valor-nd";
  if (v < 500_000) return "ate-500k";
  if (v < 2_000_000) return "500k-2m";
  return "acima-2m";
}

function cap(text) {
  const t = text.replace(/\s+\n/g, "\n").trim();
  return t.length > SECTION_CAP ? `${t.slice(0, SECTION_CAP)}\n\n> …(seção truncada em ${SECTION_CAP} caracteres — íntegra no PNCP)` : t;
}

async function fetchJson(url) {
  for (let i = 0; i < RETRIES; i++) {
    try {
      const res = await fetch(url, { headers: { accept: "application/json", "user-agent": UA } });
      if (res.status === 204) return { data: [], totalPaginas: 0 };
      const txt = await res.text();
      if (!res.ok || txt.startsWith("Erro")) throw new Error(`HTTP ${res.status} / feed instável`);
      return JSON.parse(txt);
    } catch (e) {
      if (i === RETRIES - 1) throw e;
      await sleep(BACKOFF[Math.min(i, BACKOFF.length - 1)]);
    }
  }
}

function yyyymmdd(d) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

// ── Pool de órgãos do raio (CNPJs reais dos snapshots) ──
const snapA = JSON.parse(readFileSync(join(DATA, "discovery-snapshot.json"), "utf8"));
let snapFull = { items: [] };
try { snapFull = JSON.parse(readFileSync(join(DATA, "discovery-snapshot.full.json"), "utf8")); } catch {}
const comp = JSON.parse(readFileSync(join(DATA, "competitor-500km-research.json"), "utf8"));
const geo = JSON.parse(readFileSync(join(DATA, "municipios-raio-500km.json"), "utf8"));
const ibgeNoRaio = new Set(geo.municipios.map((m) => String(m.ibge)));

const orgaos = new Map(); // cnpj → label
for (const it of [...snapA.items, ...(snapFull.items ?? [])]) {
  if (it.buyerCnpj) orgaos.set(it.buyerCnpj, it.buyer);
}
for (const o of comp.orgaos) orgaos.set(o.orgaoCnpj, o.orgaoName);

const existing = new Set(readdirSync(KB_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")));

console.log(`Órgãos do raio: ${orgaos.size} · alvo: ${TARGET} editais vencedores · já no RAG: ${existing.size} docs`);

// ── Fase 1: contratos de obra homologados (12 meses) por órgão ──
const hoje = new Date();
const dataFinal = yyyymmdd(hoje);
// 24 meses (era 12): o feed /contratos cai p/ a maioria dos órgãos a cada varredura —
// janela maior extrai mais certames dos órgãos que RESPONDEM, sem depender de sorte.
const dataInicial = yyyymmdd(new Date(hoje.getTime() - 730 * 86_400_000));
const byCompra = new Map(); // numeroControlePncpCompra → contrato mais rico
let orgaosOk = 0, orgaosFail = 0, brutos = 0;

async function sweepOrgao(cnpj, label) {
  let page = 1, totalPaginas = 1;
  do {
    const url = `${FEED}?dataInicial=${dataInicial}&dataFinal=${dataFinal}&cnpjOrgao=${cnpj}&pagina=${page}&tamanhoPagina=${PAGE_SIZE}`;
    const j = await fetchJson(url);
    totalPaginas = j.totalPaginas ?? 0;
    for (const c of j.data ?? []) {
      brutos++;
      const objeto = String(c.objetoContrato ?? "");
      if (!OBRA_RE.test(objeto) || NOT_OBRA_RE.test(objeto) || ACQUISITION_RE.test(objeto)) continue;
      const compra = c.numeroControlePncpCompra;
      if (!compra) continue;
      const ibge = String(c.unidadeOrgao?.codigoIbge ?? "");
      if (ibge && !ibgeNoRaio.has(ibge)) continue; // DNIT etc.: só unidades dentro do raio
      const atual = byCompra.get(compra);
      const registro = {
        compra,
        objeto: objeto.replace(/\s+/g, " ").trim(),
        vencedor: c.nomeRazaoSocialFornecedor ?? c.fornecedorRazaoSocial ?? "não informado",
        vencedorNi: c.niFornecedor ?? null,
        valor: typeof c.valorInicial === "number" ? c.valorInicial : null,
        assinatura: c.dataAssinatura ?? null,
        orgao: c.orgaoEntidade?.razaoSocial ?? label,
        municipio: c.unidadeOrgao?.municipioNome ?? null,
        uf: c.unidadeOrgao?.ufSigla ?? null,
      };
      // por compra, guarda o contrato de MAIOR valor (contrato principal do certame)
      if (!atual || (registro.valor ?? 0) > (atual.valor ?? 0)) byCompra.set(compra, registro);
    }
    await sleep(DELAY_MS);
    page++;
  } while (page <= totalPaginas && page <= MAX_PAGES_PER_ORGAO);
}

// Pool de ORGAO_CONCURRENCY varreduras simultâneas (o gargalo era esperar backoff em série).
const fila = [...orgaos.entries()];
async function worker() {
  for (;;) {
    const next = fila.shift();
    if (!next) return;
    try {
      await sweepOrgao(next[0], next[1]);
      orgaosOk++;
    } catch {
      orgaosFail++; // instabilidade conhecida do /contratos — órgão pulado, segue o baile
    }
    process.stdout.write(`\r  órgãos: ${orgaosOk} ok · ${orgaosFail} falha · certames de obra vencidos: ${byCompra.size}   `);
  }
}
await Promise.all(Array.from({ length: ORGAO_CONCURRENCY }, worker));
console.log(`\nFase 1: ${byCompra.size} certames vencidos de obra no raio (de ${brutos} contratos varridos).`);

// ── Seleção estratificada (órgão × banda de valor) ──
const candidatos = [...byCompra.values()].filter((c) => !existing.has(`edital-vencedor-${slug(c.compra)}`));
const strata = new Map();
for (const c of candidatos) {
  const key = `${slug(c.orgao).slice(0, 30)}|${valueBand(c.valor)}`;
  if (!strata.has(key)) strata.set(key, []);
  strata.get(key).push(c);
}
for (const list of strata.values()) list.sort((a, b) => (b.valor ?? 0) - (a.valor ?? 0));

const selected = [];
const keys = [...strata.keys()].sort();
for (let round = 0; selected.length < TARGET; round++) {
  let picked = false;
  for (const key of keys) {
    const list = strata.get(key);
    if (round < list.length && selected.length < TARGET) {
      selected.push(list[round]);
      picked = true;
    }
  }
  if (!picked) break;
}
console.log(`Selecionados: ${selected.length} (de ${candidatos.length} candidatos, ${strata.size} estratos órgão×valor).`);
if (DRY) {
  for (const c of selected.slice(0, 30)) console.log(`  ${c.compra} · ${fmtBRL(c.valor)} · ${c.vencedor.slice(0, 40)} · ${(c.municipio ?? "?")}/${c.uf ?? "?"} · ${c.objeto.slice(0, 60)}`);
  process.exit(0);
}

// ── Fase 2: baixa o edital de cada certame vencido e grava no RAG ──
mkdirSync(KB_DIR, { recursive: true });
let ok = 0, fail = 0, vazio = 0, postTotal = 0;
for (const [i, c] of selected.entries()) {
  const docId = `edital-vencedor-${slug(c.compra)}`;
  process.stdout.write(`[${i + 1}/${selected.length}] ${c.compra} … `);
  try {
    const ex = await fetchAndExtractEdital(c.compra);
    const sections = Object.entries(SECTION_LABELS)
      .map(([key, labelSec]) => ({ label: labelSec, text: (ex.sections[key] ?? "").trim() }))
      .filter((s) => s.text.length >= 80);
    if (sections.length === 0) {
      vazio++;
      console.log("vazio (PDF sem texto extraível) — pulado");
      await sleep(EDITAL_DELAY_MS);
      continue;
    }
    // Rota 1: anexos pós-sessão (proposta vencedora / ata / homologação) — quando existem.
    let postDocs = [];
    try { postDocs = await fetchPostSessionDocs(c.compra); } catch { /* opcional — segue sem */ }
    // Deságio recomputado EM CÓDIGO (nunca inventado): só quando o edital traz o estimado.
    const estimado = ex.valorEstimadoHint;
    const desagio =
      estimado && c.valor && estimado > 0
        ? `${(((estimado - c.valor) / estimado) * 100).toFixed(1)}% abaixo do estimado (${fmtBRL(estimado)})`
        : "estimado não extraído do edital — deságio não calculável";
    const md = `---
title: "Edital VENCEDOR — ${c.objeto.replace(/"/g, "'").slice(0, 100)}"
docId: ${docId}
tags: [edital, vencedor, lance-ganhador, referencia, pncp, ${slug(c.uf ?? "uf-nd")}, ${valueBand(c.valor)}]
audience: agents
sourceRefs: ["pncp:${c.compra}", "pncp:/contratos ${dataInicial}-${dataFinal}"]
---

> CERTAME VENCIDO — padrão de qualidade real do mercado. Edital + resultado colhidos do PNCP
> (API pública, Lei 14.133 art. 174) em ${new Date().toISOString().slice(0, 10)}.
> Órgão: ${c.orgao} · ${c.municipio ?? "?"}/${c.uf ?? "?"}.

## Resultado — quem venceu e por quanto

- **Vencedor:** ${c.vencedor}${c.vencedorNi ? ` (CNPJ ${c.vencedorNi})` : ""}
- **Lance ganhador (valor contratado):** ${fmtBRL(c.valor)}
- **Deságio:** ${desagio}
- **Assinatura do contrato:** ${c.assinatura ?? "não informada"}
- **Leitura:** este é o pacote que a comissão ACEITOU — as exigências abaixo são as que o vencedor atendeu na prática.

${sections.map((s) => `## ${s.label}\n\n${cap(s.text)}`).join("\n\n")}
${postDocs.length ? `\n${postDocs.map((p) => `## Anexo pós-sessão — ${p.label.slice(0, 80)}\n\n> Documento do CERTAME DECIDIDO publicado pelo órgão (o mais próximo do pacote do vencedor que existe público).\n\n${p.text.length > POST_SECTION_CAP ? `${p.text.slice(0, POST_SECTION_CAP)}\n\n> …(truncado — íntegra no PNCP)` : p.text}`).join("\n\n")}\n` : ""}`;
    writeFileSync(join(KB_DIR, `${docId}.md`), md, "utf8");
    ok++;
    if (postDocs.length) postTotal += postDocs.length;
    console.log(`✓ ${fmtBRL(c.valor)} · ${c.vencedor.slice(0, 30)} · ${sections.length} seções${postDocs.length ? ` · 📎 ${postDocs.length} anexo(s) pós-sessão` : ""}`);
  } catch (e) {
    fail++;
    console.log(`✗ ${e?.message ?? e}`);
  }
  await sleep(EDITAL_DELAY_MS);
}

console.log(`\n✅ Vencedores no RAG: ${ok} gravados (📎 ${postTotal} anexos pós-sessão) · ${vazio} sem texto · ${fail} falhas · editais-ref total: ${existing.size + ok} docs.`);
