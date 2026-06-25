// Fonte PNCP: baixa os documentos de um edital (Edital + anexos) via API pública e os
// transforma em fontes de texto p/ o parser multi-documento (mergeEditalSources).
//
// Aprendizado de campo: o download exige User-Agent de browser (senão volta 0 bytes); a
// `url` devolvida pela API às vezes vem com porta estranha (:58631) → montamos a URL
// canônica nós mesmos a partir de cnpj/ano/sequencial/sequencialDocumento.

import { extractEditalText, mergeEditalSources, type EditalExtract, type EditalSource } from "./extract-edital.ts";

const BASE = "https://pncp.gov.br/pncp-api/v1";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const TIMEOUT_MS = 60_000;

export interface PncpRef {
  cnpj: string;
  ano: string;
  sequencial: string; // sem zeros à esquerda
}

export interface EditalDocMeta {
  sequencialDocumento: number;
  tipo: string;
  titulo: string;
}

/** "12560864000147-1-000013/2026" → {cnpj, ano, sequencial:"13"}. */
export function parsePncpId(pncpId: string): PncpRef {
  const [left, ano] = pncpId.split("/");
  const parts = left.split("-"); // cnpj-1-seq
  const cnpj = parts[0];
  const seqRaw = parts[parts.length - 1];
  const sequencial = String(Number.parseInt(seqRaw, 10)); // remove zeros à esquerda
  if (!cnpj || !ano || !sequencial || sequencial === "NaN") {
    throw new Error(`parsePncpId: id inválido "${pncpId}"`);
  }
  return { cnpj, ano, sequencial };
}

async function getJson(url: string): Promise<unknown> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" }, signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} em ${url}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

/** Lista os documentos do edital (metadados). */
export async function listEditalDocs(ref: PncpRef): Promise<EditalDocMeta[]> {
  const url = `${BASE}/orgaos/${ref.cnpj}/compras/${ref.ano}/${ref.sequencial}/arquivos`;
  const data = await getJson(url);
  const arr = Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
  return arr.map((d) => ({
    sequencialDocumento: Number(d.sequencialDocumento),
    tipo: String(d.tipoDocumentoNome ?? ""),
    titulo: String(d.titulo ?? ""),
  }));
}

/** Baixa um documento (PDF). Retorna null se não for PDF (imagem/CAD/zip etc.). */
export async function downloadEditalDoc(ref: PncpRef, sequencialDocumento: number): Promise<Uint8Array | null> {
  const url = `${BASE}/orgaos/${ref.cnpj}/compras/${ref.ano}/${ref.sequencial}/arquivos/${sequencialDocumento}`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "*/*" }, signal: ctrl.signal });
    if (!res.ok) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    // magic %PDF (0x25 50 44 46)
    if (buf.length < 4 || buf[0] !== 0x25 || buf[1] !== 0x50 || buf[2] !== 0x44 || buf[3] !== 0x46) return null;
    return buf;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

// Tipos/títulos de documento RELEVANTES p/ habilitação + orçamento + objeto.
const RELEVANT = /edital|projeto\s*b[áa]sico|planilha|or[çc]ament|termo\s+de\s+refer|estudo\s+t[eé]cnico|\betp\b|anexo/i;
// Ruído a evitar (mídia/projeto gráfico que não vira texto útil).
const SKIP = /executivo|planta|prancha|\.dwg|imagem|foto|art\b|cronograma\s+f[íi]sico/i;

/** Baixa as fontes de texto relevantes de um edital (até maxDocs). */
export async function fetchEditalSources(pncpId: string, maxDocs = 6): Promise<EditalSource[]> {
  const ref = parsePncpId(pncpId);
  const docs = await listEditalDocs(ref);

  const picked = docs
    .filter((d) => RELEVANT.test(`${d.tipo} ${d.titulo}`) && !SKIP.test(`${d.tipo} ${d.titulo}`))
    .slice(0, maxDocs);

  const sources: EditalSource[] = [];
  for (const d of picked) {
    const buf = await downloadEditalDoc(ref, d.sequencialDocumento);
    if (!buf) continue;
    try {
      const text = await extractEditalText({ pdfBuffer: buf });
      if (text && text.trim().length > 100) sources.push({ label: d.tipo || d.titulo, text });
    } catch {
      // PDF ilegível (escaneado/protegido) — pula, não trava o pipeline.
    }
  }
  return sources;
}

/** Conveniência: baixa o edital inteiro (multi-doc) e devolve o extract mesclado + rótulos. */
export async function fetchAndExtractEdital(pncpId: string): Promise<EditalExtract & { docs: string[] }> {
  const sources = await fetchEditalSources(pncpId);
  if (sources.length === 0) throw new Error(`fetchAndExtractEdital: nenhum documento de texto obtido p/ ${pncpId}`);
  const extract = mergeEditalSources(sources);
  return { ...extract, docs: sources.map((s) => s.label) };
}
