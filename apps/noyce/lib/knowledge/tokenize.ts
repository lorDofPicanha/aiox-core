// Portuguese-aware tokenizer for the knowledge base. Dependency-free and deterministic:
// lowercase, strip diacritics, split on non-alphanumerics, drop stopwords + tiny tokens.
// Kept lexical on purpose — no embeddings/API so retrieval never "returns empty" due to a
// flaky model or missing key (a known pain point); embeddings can layer on later.

// Common pt-BR stopwords + a few licitação-domain fillers that add no retrieval signal.
const STOPWORDS = new Set([
  "a", "o", "as", "os", "um", "uma", "uns", "umas", "de", "do", "da", "dos", "das",
  "e", "ou", "que", "se", "no", "na", "nos", "nas", "em", "para", "pra", "por", "com",
  "sem", "ao", "aos", "the", "of", "to", "is", "ser", "esta", "estao",
  "como", "qual", "quais", "quando", "onde", "isso", "este", "esta", "esse", "essa",
  "seu", "sua", "seus", "suas", "ele", "ela", "eles", "elas", "mais", "menos", "ja",
  "nao", "sim", "tambem", "entre", "sobre", "ate", "foi", "sao",
]);

// Diacritic stripping via NFD decomposition (á -> a). ̀-ͯ = combining marks.
// Also map ç -> c so "consórcio"/"consorcio" tokenize the same.
export function stripDiacritics(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "C");
}

export function tokenize(text: string): string[] {
  const normalized = stripDiacritics(String(text).toLowerCase());
  const raw = normalized.split(/[^a-z0-9]+/g);
  const out: string[] = [];
  for (const t of raw) {
    if (t.length < 2) continue;
    if (STOPWORDS.has(t)) continue;
    out.push(t);
  }
  return out;
}

export function termFrequencies(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  return tf;
}
