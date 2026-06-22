/** Formatadores fiscais (tabular-nums no CSS; aqui só a string). */

export function brl(value: number | null | undefined): string {
  if (value == null) return "—";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function pct(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${Math.round(value * 100)}%`;
}

export function cnpjMasked(doc: string): string {
  const d = doc.replace(/\D/g, "");
  if (d.length !== 14) return doc;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

export function shortHash(hash: string): string {
  const h = hash.replace(/^\\x/, "").replace(/^0x/, "");
  return h.length > 16 ? `${h.slice(0, 8)}…${h.slice(-6)}` : h;
}

export function dataHora(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
