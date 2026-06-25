/**
 * Parsers de extrato: OFX (SGML) e CSV. Saída normalizada para preview/import.
 * Tudo client-safe (sem dependências externas).
 */

import type { EntryType } from "@/lib/categories";

export interface ParsedTxn {
  date: string; // YYYY-MM-DD
  type: EntryType;
  amount: number; // sempre positivo
  description: string;
  externalRef: string | null;
}

function tag(block: string, name: string): string | null {
  const m = block.match(new RegExp(`<${name}>\\s*([^<\\r\\n]+)`, "i"));
  return m ? m[1].trim() : null;
}

function ofxDateToISO(raw: string | null): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 8) return null;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

function parseAmount(raw: string | null): number | null {
  if (!raw) return null;
  let s = raw.trim().replace(/\s/g, "");
  // pt-BR "1.234,56" → "1234.56"; "1234,56" → "1234.56"
  if (/,\d{1,2}$/.test(s)) s = s.replace(/\./g, "").replace(",", ".");
  else s = s.replace(/,/g, "");
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

export function parseOFX(text: string): ParsedTxn[] {
  const blocks = text.match(/<STMTTRN>[\s\S]*?(?=<STMTTRN>|<\/BANKTRANLIST>|<\/STMTTRN>[\s\S]*$|$)/gi);
  const source = blocks && blocks.length > 0 ? blocks : text.split(/<STMTTRN>/i).slice(1);

  const out: ParsedTxn[] = [];
  for (const raw of source) {
    const block = raw.replace(/<\/STMTTRN>/i, "");
    const date = ofxDateToISO(tag(block, "DTPOSTED"));
    const amt = parseAmount(tag(block, "TRNAMT"));
    if (!date || amt === null || amt === 0) continue;

    const description = (tag(block, "MEMO") || tag(block, "NAME") || "Lançamento importado").trim();
    const fitid = tag(block, "FITID");

    out.push({
      date,
      type: amt >= 0 ? "in" : "out",
      amount: Math.abs(amt),
      description,
      externalRef: fitid ? `ofx:${fitid}` : `ofx:${date}:${amt}:${description}`.slice(0, 180),
    });
  }
  return out;
}

function detectDelimiter(line: string): string {
  const semi = (line.match(/;/g) || []).length;
  const comma = (line.match(/,/g) || []).length;
  return semi >= comma ? ";" : ",";
}

function csvDateToISO(raw: string): string | null {
  const s = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const br = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (br) return `${br[3]}-${br[2]}-${br[1]}`;
  return null;
}

export function parseCSV(text: string): ParsedTxn[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  const delim = detectDelimiter(lines[0]);
  const header = lines[0].toLowerCase();
  const hasHeader = /(data|date)/.test(header) && /(valor|amount|montante)/.test(header);

  let idxDate = 0,
    idxDesc = 1,
    idxAmount = 2;

  if (hasHeader) {
    const cols = lines[0].split(delim).map((c) => c.trim().toLowerCase());
    cols.forEach((c, i) => {
      if (/data|date/.test(c)) idxDate = i;
      else if (/descri|hist|memo|name/.test(c)) idxDesc = i;
      else if (/valor|amount|montante/.test(c)) idxAmount = i;
    });
  }

  const rows = hasHeader ? lines.slice(1) : lines;
  const out: ParsedTxn[] = [];

  for (const line of rows) {
    const cols = line.split(delim);
    const date = csvDateToISO(cols[idxDate] ?? "");
    const amt = parseAmount(cols[idxAmount] ?? "");
    if (!date || amt === null || amt === 0) continue;
    const description = (cols[idxDesc] ?? "Lançamento importado").trim().replace(/^"|"$/g, "");

    out.push({
      date,
      type: amt >= 0 ? "in" : "out",
      amount: Math.abs(amt),
      description,
      externalRef: `csv:${date}:${amt}:${description}`.slice(0, 180),
    });
  }
  return out;
}

export function parseStatement(filename: string, text: string): ParsedTxn[] {
  return /\.ofx$/i.test(filename) || /<OFX>/i.test(text) ? parseOFX(text) : parseCSV(text);
}
