// Fonte PNCP: baixa os documentos de um edital (Edital + anexos) via API pública e os
// transforma em fontes de texto p/ o parser multi-documento (mergeEditalSources).
//
// Aprendizado de campo: o download exige User-Agent de browser (senão volta 0 bytes); a
// `url` devolvida pela API às vezes vem com porta estranha (:58631) → montamos a URL
// canônica nós mesmos a partir de cnpj/ano/sequencial/sequencialDocumento.
//
// Aprendizado de campo (2): MUITOS órgãos publicam um único arquivo "Edital e Anexos.zip"
// (magic PK) em vez de PDFs soltos. Sem descompactar, o parser via 0 documento e o pipeline
// inteiro abortava. Agora expandimos ZIP → PDFs de dentro (jszip, import lazy), aplicando o
// filtro de ruído (SKIP) nos nomes internos.

import { extractEditalText, mergeEditalSources, type EditalExtract, type EditalSource } from "./extract-edital.ts";

const BASE = "https://pncp.gov.br/pncp-api/v1";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const TIMEOUT_MS = 60_000;

export const PNCP_LIMITS = Object.freeze({
  maxDownloadBytes: 30 * 1024 * 1024,
  maxZipEntries: 200,
  maxZipPdfs: 20,
  maxZipPdfBytes: 15 * 1024 * 1024,
  maxZipExpandedBytes: 50 * 1024 * 1024,
  maxSourceDocs: 10,
});

export function isZipExpansionWithinLimits(entryCount: number, pdfSizes: readonly number[]): boolean {
  if (!Number.isSafeInteger(entryCount) || entryCount < 0 || entryCount > PNCP_LIMITS.maxZipEntries) return false;
  if (pdfSizes.length > PNCP_LIMITS.maxZipPdfs) return false;
  let total = 0;
  for (const size of pdfSizes) {
    if (!Number.isSafeInteger(size) || size < 0 || size > PNCP_LIMITS.maxZipPdfBytes) return false;
    total += size;
    if (total > PNCP_LIMITS.maxZipExpandedBytes) return false;
  }
  return true;
}

export async function readBoundedResponseBytes(
  response: Response,
  maxBytes = PNCP_LIMITS.maxDownloadBytes,
): Promise<Uint8Array> {
  const lengthHeader = response.headers.get("content-length");
  if (lengthHeader) {
    const declared = Number(lengthHeader);
    if (!Number.isSafeInteger(declared) || declared < 0 || declared > maxBytes) {
      throw new Error("PNCP response exceeds download limit");
    }
  }
  if (!response.body) return new Uint8Array();

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw new Error("PNCP response exceeds download limit");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const result = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return result;
}

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

function isPdf(buf: Uint8Array): boolean {
  // magic %PDF (0x25 50 44 46)
  return buf.length >= 4 && buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46;
}

function isZip(buf: Uint8Array): boolean {
  // magic PK\x03\x04 (arquivo local) ou PK\x05\x06 (zip vazio)
  return buf.length >= 4 && buf[0] === 0x50 && buf[1] === 0x4b && (buf[2] === 0x03 || buf[2] === 0x05);
}

/** Baixa os bytes crus de um documento do PNCP (qualquer tipo). Null se não-OK.
 *  Exportado p/ o colhedor de anexos pós-sessão (proposta vencedora/ata podem vir em ZIP). */
export async function fetchDocBytes(ref: PncpRef, sequencialDocumento: number): Promise<Uint8Array | null> {
  const url = `${BASE}/orgaos/${ref.cnpj}/compras/${ref.ano}/${ref.sequencial}/arquivos/${sequencialDocumento}`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "*/*" }, signal: ctrl.signal });
    if (!res.ok) return null;
    return await readBoundedResponseBytes(res);
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

/** Baixa um documento (PDF). Retorna null se não for PDF (imagem/CAD/zip etc.). */
export async function downloadEditalDoc(ref: PncpRef, sequencialDocumento: number): Promise<Uint8Array | null> {
  const buf = await fetchDocBytes(ref, sequencialDocumento);
  if (!buf || !isPdf(buf)) return null;
  return buf;
}

/** Expande bytes de um documento em PDFs prontos p/ extração: passthrough se já é PDF,
 *  descompacta se for ZIP (pega os .pdf de dentro, pula ruído via SKIP). */
export async function expandToPdfs(buf: Uint8Array, label: string): Promise<{ label: string; buf: Uint8Array }[]> {
  if (isPdf(buf)) return [{ label, buf }];
  if (!isZip(buf)) return [];
  try {
    const JSZip = (await import("jszip")).default;
    const zip = await JSZip.loadAsync(buf);
    const out: { label: string; buf: Uint8Array }[] = [];
    const names = Object.keys(zip.files).sort();
    if (!isZipExpansionWithinLimits(names.length, [])) return [];
    let expandedBytes = 0;
    let pdfCount = 0;
    const pdfSizes: number[] = [];
    for (const name of names) {
      const entry = zip.files[name];
      if (entry.dir) continue;
      if (!/\.pdf$/i.test(name)) continue; // só PDFs (ignora .dwg/.jpg/.docx internos)
      if (SKIP.test(name)) continue; // pula projeto executivo/plantas/imagens
      pdfCount += 1;
      if (pdfCount > PNCP_LIMITS.maxZipPdfs) return [];
      const metadata = entry as unknown as { _data?: { uncompressedSize?: number } };
      const declaredSize = metadata._data?.uncompressedSize;
      if (
        declaredSize === undefined
        || !Number.isSafeInteger(declaredSize)
      ) return [];
      pdfSizes.push(declaredSize);
      if (!isZipExpansionWithinLimits(names.length, pdfSizes)) return [];
      expandedBytes += declaredSize;
      if (expandedBytes > PNCP_LIMITS.maxZipExpandedBytes) return [];
      const inner = await entry.async("uint8array");
      if (inner.byteLength !== declaredSize || inner.byteLength > PNCP_LIMITS.maxZipPdfBytes) return [];
      if (isPdf(inner)) out.push({ label: `${label} › ${name.split("/").pop()}`, buf: inner });
    }
    return out;
  } catch {
    return []; // ZIP corrompido/protegido — não trava o pipeline
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
  const requestedMaxDocs = Number.isFinite(maxDocs) ? Math.floor(maxDocs) : 1;
  const boundedMaxDocs = Math.max(1, Math.min(requestedMaxDocs, PNCP_LIMITS.maxSourceDocs));

  const picked = docs
    .filter((d) => RELEVANT.test(`${d.tipo} ${d.titulo}`) && !SKIP.test(`${d.tipo} ${d.titulo}`))
    .slice(0, boundedMaxDocs);

  const sources: EditalSource[] = [];
  for (const d of picked) {
    const bytes = await fetchDocBytes(ref, d.sequencialDocumento);
    if (!bytes) continue;
    const pdfs = await expandToPdfs(bytes, d.tipo || d.titulo); // 1 PDF, ou N de dentro de um ZIP
    for (const pdf of pdfs) {
      try {
        const text = await extractEditalText({ pdfBuffer: pdf.buf });
        if (text && text.trim().length > 100) sources.push({ label: pdf.label, text });
      } catch {
        // PDF ilegível (escaneado/protegido) — pula, não trava o pipeline.
      }
      if (sources.length >= boundedMaxDocs) break; // cap: evita estourar tokens com ZIP gigante
    }
    if (sources.length >= boundedMaxDocs) break;
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
