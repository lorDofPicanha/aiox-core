// Parser de edital — o elo que faltava p/ alimentar o workflow (Faro→Prisma→Forja→Escriba)
// com o edital REAL em vez de um trecho sintetizado.
//
// Duas camadas, ambas DETERMINÍSTICAS (sem LLM, sem custo):
//   1. extractEditalText  — PDF→texto (pdf-parse, lazy import) ou texto direto.
//   2. extractEditalSections — fatia o texto nas seções típicas de edital BR (objeto,
//      habilitação técnica/econômica/fiscal, orçamento, proposta/prazos, garantia,
//      declarações, consórcio) por âncoras de cabeçalho.
// buildEditalExcerpt monta um trecho FOCADO (só as seções relevantes) p/ não despejar
// 100 páginas no LLM. Nada é inventado: se não achar uma seção, ela fica vazia.

export interface EditalSections {
  objeto: string;
  habilitacaoTecnica: string;
  habilitacaoEconomica: string;
  habilitacaoFiscal: string;
  orcamento: string;
  proposta: string;
  garantia: string;
  declaracoes: string;
  consorcio: string;
}

export interface EditalExtract {
  sections: EditalSections;
  valorEstimadoHint: number | null; // 1º "R$ x" perto de valor estimado/máximo — só dica
  excerpt: string; // trecho focado p/ os agentes
  encontradas: string[]; // seções efetivamente achadas (telemetria/qualidade)
}

const SECTION_KEYS: (keyof EditalSections)[] = [
  "objeto",
  "habilitacaoTecnica",
  "habilitacaoEconomica",
  "habilitacaoFiscal",
  "orcamento",
  "proposta",
  "garantia",
  "declaracoes",
  "consorcio",
];

// Âncoras de CABEÇALHO (início de linha, numeração opcional tipo "7.2" / "DO "), acento-
// tolerantes — evita casar a keyword no meio de uma frase (ex.: "...10% do valor estimado"
// dentro da habilitação econômica, antes do cabeçalho real do orçamento). Primeira ocorrência
// marca o início da seção; o fim é a próxima âncora (qualquer tipo) ou +MAX chars.
const hdr = (core: string): RegExp =>
  new RegExp(`(?:^|\\n)[ \\t]*(?:\\d+(?:\\.\\d+)*[.)\\-]?[ \\t]*)?(?:d[oa]\\s+|da\\s+)?(?:${core})`, "im");

const ANCHORS: { name: keyof EditalSections; re: RegExp }[] = [
  { name: "objeto", re: hdr("objeto") },
  { name: "habilitacaoTecnica", re: hdr("qualifica[çc][aã]o\\s+t[eé]cnica|capacidade\\s+t[eé]cnica") },
  { name: "habilitacaoEconomica", re: hdr("qualifica[çc][aã]o\\s+econ[oô]mic|econ[oô]mico[\\- ]financeir|balan[çc]o\\s+patrimonial") },
  { name: "habilitacaoFiscal", re: hdr("regularidade\\s+fiscal|habilita[çc][aã]o\\s+fiscal") },
  { name: "orcamento", re: hdr("or[çc]amento|valor\\s+(?:total\\s+)?(?:estimad|m[aá]xim)|pre[çc]o\\s+m[aá]ximo|planilha\\s+or[çc]ament") },
  { name: "proposta", re: hdr("da\\s+proposta|proposta\\s+de\\s+pre[çc]os|prazo\\s+de\\s+execu") },
  { name: "garantia", re: hdr("garantia") },
  { name: "declaracoes", re: hdr("declara[çc][oõ]es|declara[çc][aã]o|anexo\\s+[ivx0-9]") },
  { name: "consorcio", re: hdr("cons[oó]rcio") },
];

const MAX_SECTION_CHARS = 4000;

/** PDF→texto (lazy pdf-parse) ou texto direto. Sem dep instalada, falha com instrução clara. */
export async function extractEditalText(input: { pdfBuffer?: Uint8Array; text?: string }): Promise<string> {
  if (input.text && input.text.trim()) return input.text;
  if (!input.pdfBuffer) throw new Error("extractEditalText: forneça `text` ou `pdfBuffer`.");

  // pdf-parse v2 expõe a classe PDFParse (não mais uma função). Lazy import p/ não
  // exigir a dep quando a entrada já é texto.
  const mod = await import("pdf-parse").catch(() => {
    throw new Error("extractEditalText: instale pdf-parse (npm i pdf-parse) para ler PDF, ou passe `text`.");
  });
  const PDFParse = (mod as {
    PDFParse?: new (opts: { data: Uint8Array }) => {
      getText: () => Promise<{ text: string }>;
      destroy?: () => Promise<void> | void;
    };
  }).PDFParse;
  if (!PDFParse) {
    throw new Error("extractEditalText: API do pdf-parse não reconhecida (esperava export PDFParse).");
  }
  const parser = new PDFParse({ data: input.pdfBuffer });
  try {
    const out = await parser.getText();
    return out.text ?? "";
  } finally {
    await parser.destroy?.();
  }
}

/** Acha a 1ª ocorrência de cada âncora e fatia o texto entre âncoras consecutivas. */
export function extractEditalSections(text: string): EditalSections {
  const hits: { name: keyof EditalSections; pos: number }[] = [];
  for (const a of ANCHORS) {
    const m = a.re.exec(text);
    if (m && m.index >= 0) hits.push({ name: a.name, pos: m.index });
  }
  hits.sort((x, y) => x.pos - y.pos);

  const sections = SECTION_KEYS.reduce((acc, k) => {
    acc[k] = "";
    return acc;
  }, {} as EditalSections);

  for (let i = 0; i < hits.length; i++) {
    const start = hits[i].pos;
    const end = i + 1 < hits.length ? hits[i + 1].pos : text.length;
    const slice = text.slice(start, Math.min(end, start + MAX_SECTION_CHARS)).trim();
    // primeira ocorrência vence; se já tem conteúdo, não sobrescreve.
    if (!sections[hits[i].name]) sections[hits[i].name] = slice;
  }
  return sections;
}

/** Dica de valor estimado: 1º "R$ ..." dentro do orçamento (ou no texto todo). NÃO é autoritativo. */
export function extractValorEstimadoHint(sections: EditalSections, fullText: string): number | null {
  const scope = sections.orcamento || fullText;
  const m = /R\$\s*([\d.]+,\d{2}|\d[\d.]*)/.exec(scope);
  if (!m) return null;
  const raw = m[1].replace(/\./g, "").replace(",", ".");
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Monta o trecho FOCADO p/ os agentes — só as seções achadas, rotuladas. */
export function buildEditalExcerpt(sections: EditalSections): string {
  const labels: Record<keyof EditalSections, string> = {
    objeto: "OBJETO",
    habilitacaoTecnica: "HABILITAÇÃO TÉCNICA",
    habilitacaoEconomica: "HABILITAÇÃO ECONÔMICO-FINANCEIRA",
    habilitacaoFiscal: "HABILITAÇÃO FISCAL",
    orcamento: "ORÇAMENTO / VALOR ESTIMADO",
    proposta: "PROPOSTA / PRAZOS",
    garantia: "GARANTIA",
    declaracoes: "DECLARAÇÕES EXIGIDAS",
    consorcio: "CONSÓRCIO",
  };
  return SECTION_KEYS.filter((k) => sections[k])
    .map((k) => `### ${labels[k]}\n${sections[k]}`)
    .join("\n\n");
}

/** Pipeline completo determinístico: (PDF|texto) → seções → excerpt + dica de valor. */
export async function extractEdital(input: { pdfBuffer?: Uint8Array; text?: string }): Promise<EditalExtract> {
  const text = await extractEditalText(input);
  const sections = extractEditalSections(text);
  const encontradas = SECTION_KEYS.filter((k) => sections[k]);
  return {
    sections,
    valorEstimadoHint: extractValorEstimadoHint(sections, text),
    excerpt: buildEditalExcerpt(sections),
    encontradas,
  };
}

// ── Multi-documento ──────────────────────────────────────────────────────────
// Um edital PNCP é multi-doc: Edital + Projeto Básico + Planilha Orçamentária + ETP.
// A habilitação técnica detalhada e o orçamento analítico costumam ficar nos ANEXOS,
// não no Edital. Aqui extraímos as seções de CADA fonte e MESCLAMOS: por seção, vence
// o conteúdo mais rico (mais longo) — assim o orçamento da Planilha supera a menção
// breve no Edital, e a habilitação do PB supera a referência no Edital.

export interface EditalSource {
  label: string; // ex.: "Edital", "Projeto Básico", "Planilha Orçamentária"
  text: string;
}

/** Mescla seções de várias fontes (a mais rica por seção vence). */
export function mergeEditalSources(sources: EditalSource[]): EditalExtract {
  const merged = SECTION_KEYS.reduce((acc, k) => {
    acc[k] = "";
    return acc;
  }, {} as EditalSections);

  for (const src of sources) {
    const s = extractEditalSections(src.text);
    for (const k of SECTION_KEYS) {
      if (s[k] && s[k].length > merged[k].length) merged[k] = s[k];
    }
  }

  const fullText = sources.map((s) => s.text).join("\n");
  return {
    sections: merged,
    valorEstimadoHint: extractValorEstimadoHint(merged, fullText),
    excerpt: buildEditalExcerpt(merged),
    encontradas: SECTION_KEYS.filter((k) => merged[k]),
  };
}
