/**
 * MOTOR DE PALAVRAS-CHAVE — Slice A do teardown Effecti (12/Ago/2026).
 *
 * Três campos por regra, que é o padrão consolidado do mercado:
 *   palavra-chave  (obrigatória)         → o termo que define a captura
 *   complementares (E / OU, explícito)   → refina; "todas" por padrão
 *   indesejadas    (NÃO)                 → descarta o falso positivo
 *
 * A busca é insensível a acento, caixa, número (singular/plural) e gênero — as mesmas
 * 4 dimensões que o mercado cobre. A diferença é que aqui cada decisão é AUDITÁVEL:
 * toda captura devolve QUAL regra, QUAL termo e EM QUE POSIÇÃO do objeto casou, e todo
 * descarte devolve QUAL palavra indesejada barrou. Nada de caixa-preta.
 *
 * Módulo puro: sem I/O, sem React, sem data. Serve tanto o painel de teste ao vivo
 * (app-side, contra o snapshot local) quanto a filtragem na captura (build script).
 */

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

/** Como as palavras complementares se combinam. Explícito de propósito: "complementar" é ambíguo. */
export type ComplementarMode = "todas" | "qualquer";

export interface KeywordRule {
  id: string;
  /** Termo principal. Pode ter mais de uma palavra ("meio fio"). Obrigatório. */
  term: string;
  /** Refinamento. Combinadas por `complementarMode`. */
  complementares: string[];
  /** Qualquer uma que apareça descarta o edital. */
  indesejadas: string[];
  complementarMode: ComplementarMode;
  enabled: boolean;
  note?: string;
}

export interface KeywordGroup {
  id: string;
  name: string;
  note?: string;
  rules: KeywordRule[];
}

export interface SearchProfile {
  id: string;
  name: string;
  note?: string;
  /** Grupos que este perfil usa, na ordem de precedência da atribuição. */
  groupIds: string[];
  enabled: boolean;
}

export interface KeywordConfig {
  groups: KeywordGroup[];
  profiles: SearchProfile[];
}

/** Trecho do texto original que casou — permite destacar sem re-buscar no cliente. */
export interface CaptureHit {
  start: number;
  end: number;
  /** Termo da regra que produziu o trecho (como o usuário escreveu). */
  term: string;
  role: "principal" | "complementar";
}

/** Por que uma regra casou (ou não). Sempre legível por humano. */
export interface RuleVerdict {
  matched: boolean;
  hits: CaptureHit[];
  /** Palavra indesejada que barrou. Só preenchido quando o principal casou mas a regra foi vetada. */
  blockedBy: string | null;
  /** Complementares exigidas que não apareceram (modo "todas"). */
  missingComplementares: string[];
  reason: string;
}

/** A quem creditar a captura de um edital — o equivalente auditável do "Perfil de busca". */
export interface CaptureAttribution {
  profileId: string;
  profileName: string;
  groupId: string;
  groupName: string;
  ruleId: string;
  term: string;
  hits: CaptureHit[];
}

export interface CaptureResult {
  /** Primeira regra que casou, na ordem perfil → grupo → regra. Null = não capturado. */
  primary: CaptureAttribution | null;
  /** Todas as regras que casaram (um edital pode ser pego por vários grupos). */
  matches: CaptureAttribution[];
  /** Regras cujo termo principal casou mas foram vetadas por palavra indesejada. */
  blocked: Array<{ ruleId: string; term: string; blockedBy: string }>;
}

// ---------------------------------------------------------------------------
// Normalização PT-BR
// ---------------------------------------------------------------------------

const DIACRITICS = /[\u0300-\u036f]/g;
const NON_ALNUM = /[^a-z0-9]/g;

/**
 * Reduz o token à raiz comparável: acento → nada, caixa → minúscula, plural → singular,
 * gênero → neutro. Ambos os lados da comparação passam por aqui, então o que importa é a
 * CONSISTÊNCIA da dobra, não ela produzir uma palavra bonita ("pavimentação" → "pavimentaca").
 */
export function foldToken(raw: string): string {
  const base = raw.normalize("NFD").replace(DIACRITICS, "").toLowerCase().replace(NON_ALNUM, "");
  if (!base) return "";
  return stripGender(stripPlural(base));
}

/** Plural PT-BR pelas terminações regulares. Aplicado antes do gênero. */
function stripPlural(t: string): string {
  if (t.length < 4) return t;
  if (t.endsWith("oes") || t.endsWith("aes")) return `${t.slice(0, -3)}ao`; // ações → ação
  if (t.endsWith("aos")) return t.slice(0, -1); // irmãos → irmão
  if (t.endsWith("ais")) return `${t.slice(0, -3)}al`; // materiais → material
  if (t.endsWith("eis")) return `${t.slice(0, -3)}el`; // níveis → nível
  if (t.endsWith("ois")) return `${t.slice(0, -3)}ol`; // lençóis → lençol
  if (t.endsWith("uis")) return `${t.slice(0, -3)}ul`; // paúis → paul
  if (t.endsWith("ns")) return `${t.slice(0, -2)}m`; // homens → homem
  // "-es" só cai inteiro quando o singular termina em consoante que o exige (luzes→luz,
  // escolares→escolar, cores→cor). Singular terminado em vogal faz plural só com -s, e
  // derrubar "es" ali quebraria o par (pontes→pont ≠ ponte).
  if (t.endsWith("es") && t.length >= 5 && "rzsln".includes(t[t.length - 3])) return t.slice(0, -2);
  if (t.endsWith("s")) return t.slice(0, -1); // obras → obra, pontes → ponte
  return t;
}

/** Gênero: derruba a vogal temática final (-a/-o), unindo pública/público, asfáltica/asfáltico. */
function stripGender(t: string): string {
  if (t.length < 4) return t;
  const last = t[t.length - 1];
  if (last !== "a" && last !== "o") return t;
  const stem = t.slice(0, -1);
  return stem.length >= 3 ? stem : t;
}

// ---------------------------------------------------------------------------
// Texto dobrado, com offsets preservados
// ---------------------------------------------------------------------------

export interface FoldedToken {
  fold: string;
  /** Posição no texto ORIGINAL — é o que permite destacar sem reprocessar. */
  start: number;
  end: number;
}

export interface FoldedText {
  tokens: FoldedToken[];
}

const TOKEN_PATTERN = /[\p{L}\p{N}]+/gu;

/** Tokeniza mantendo o offset original de cada token, e dobra cada um. */
export function foldText(text: string): FoldedText {
  const tokens: FoldedToken[] = [];
  for (const match of text.matchAll(TOKEN_PATTERN)) {
    const fold = foldToken(match[0]);
    if (!fold) continue;
    const start = match.index ?? 0;
    tokens.push({ fold, start, end: start + match[0].length });
  }
  return { tokens };
}

/** Dobra um termo (possivelmente multi-palavra) na sequência de tokens que ele exige. */
export function foldTerm(term: string): string[] {
  return term
    .split(/[\s,;]+/)
    .map(foldToken)
    .filter(Boolean);
}

/**
 * Todas as ocorrências do termo no texto dobrado, com span no texto original.
 * Casamento é por token inteiro — "obra" não casa dentro de "obrado".
 */
export function findTermSpans(folded: FoldedText, term: string): Array<{ start: number; end: number }> {
  const needle = foldTerm(term);
  if (needle.length === 0) return [];
  const spans: Array<{ start: number; end: number }> = [];
  const { tokens } = folded;
  for (let i = 0; i + needle.length <= tokens.length; i++) {
    let hit = true;
    for (let k = 0; k < needle.length; k++) {
      if (tokens[i + k].fold !== needle[k]) {
        hit = false;
        break;
      }
    }
    if (hit) spans.push({ start: tokens[i].start, end: tokens[i + needle.length - 1].end });
  }
  return spans;
}

const hasTerm = (folded: FoldedText, term: string) => findTermSpans(folded, term).length > 0;

// ---------------------------------------------------------------------------
// Avaliação de regra
// ---------------------------------------------------------------------------

/**
 * Ordem de avaliação, e ela importa para a explicação:
 *   1. principal ausente        → não é candidato (não conta como descarte)
 *   2. indesejada presente      → VETO explícito, com o nome de quem vetou
 *   3. complementares faltando  → não casou, com a lista do que faltou
 */
export function evaluateRule(rule: KeywordRule, folded: FoldedText): RuleVerdict {
  const principalSpans = findTermSpans(folded, rule.term);
  if (principalSpans.length === 0) {
    return {
      matched: false,
      hits: [],
      blockedBy: null,
      missingComplementares: [],
      reason: `"${rule.term}" não aparece no objeto.`,
    };
  }

  const blocker = rule.indesejadas.find((word) => hasTerm(folded, word)) ?? null;
  if (blocker) {
    return {
      matched: false,
      hits: [],
      blockedBy: blocker,
      missingComplementares: [],
      reason: `Descartado: contém a palavra indesejada "${blocker}".`,
    };
  }

  const hits: CaptureHit[] = principalSpans.map((span) => ({ ...span, term: rule.term, role: "principal" }));
  const complementares = rule.complementares.filter((word) => word.trim().length > 0);

  if (complementares.length > 0) {
    const present = complementares.filter((word) => hasTerm(folded, word));
    const missing = complementares.filter((word) => !present.includes(word));

    if (rule.complementarMode === "todas" && missing.length > 0) {
      return {
        matched: false,
        hits: [],
        blockedBy: null,
        missingComplementares: missing,
        reason: `"${rule.term}" apareceu, mas falta: ${missing.join(", ")}.`,
      };
    }
    if (rule.complementarMode === "qualquer" && present.length === 0) {
      return {
        matched: false,
        hits: [],
        blockedBy: null,
        missingComplementares: complementares,
        reason: `"${rule.term}" apareceu, mas nenhuma complementar bateu (${complementares.join(", ")}).`,
      };
    }
    for (const word of present) {
      for (const span of findTermSpans(folded, word)) {
        hits.push({ ...span, term: word, role: "complementar" });
      }
    }
  }

  hits.sort((a, b) => a.start - b.start);
  const complementarNote = complementares.length > 0 ? ` + ${rule.complementarMode === "todas" ? "todas as" : "alguma"} complementar(es)` : "";
  return {
    matched: true,
    hits,
    blockedBy: null,
    missingComplementares: [],
    reason: `Capturado por "${rule.term}"${complementarNote}.`,
  };
}

// ---------------------------------------------------------------------------
// Atribuição — quem capturou este edital
// ---------------------------------------------------------------------------

/**
 * Roda os perfis habilitados sobre o texto e credita a captura.
 * Ordem determinística: perfil → grupo (na ordem de `groupIds`) → regra.
 */
export function captureText(text: string, config: KeywordConfig): CaptureResult {
  const folded = foldText(text);
  const groupById = new Map(config.groups.map((group) => [group.id, group]));
  const matches: CaptureAttribution[] = [];
  const blocked: CaptureResult["blocked"] = [];

  for (const profile of config.profiles) {
    if (!profile.enabled) continue;
    for (const groupId of profile.groupIds) {
      const group = groupById.get(groupId);
      if (!group) continue;
      for (const rule of group.rules) {
        if (!rule.enabled) continue;
        const verdict = evaluateRule(rule, folded);
        if (verdict.matched) {
          matches.push({
            profileId: profile.id,
            profileName: profile.name,
            groupId: group.id,
            groupName: group.name,
            ruleId: rule.id,
            term: rule.term,
            hits: verdict.hits,
          });
        } else if (verdict.blockedBy) {
          blocked.push({ ruleId: rule.id, term: rule.term, blockedBy: verdict.blockedBy });
        }
      }
    }
  }

  return { primary: matches[0] ?? null, matches, blocked };
}

// ---------------------------------------------------------------------------
// Painel de teste ao vivo — o recall ANTES de salvar o perfil
// ---------------------------------------------------------------------------

export interface ProbeTarget {
  id: string;
  /** O texto pesquisável — objeto do edital. */
  text: string;
  /** Rótulos livres para a amostra (órgão, cidade, prazo…). Não participam do casamento. */
  meta?: Record<string, string | number | null>;
}

export interface ProbeSampleRow {
  id: string;
  text: string;
  hits: CaptureHit[];
  meta: Record<string, string | number | null>;
}

export interface ProbeResult {
  /** Quantos editais a regra capturaria no universo testado. */
  total: number;
  /** Quantos tinham o termo principal mas foram vetados por palavra indesejada. */
  blocked: number;
  /** Quantos têm o principal mas falham nas complementares. */
  missedByComplementar: number;
  /** Tamanho do universo testado — o denominador honesto. */
  universe: number;
  sample: ProbeSampleRow[];
  /** Motivo do primeiro descarte encontrado, para explicar o zero. */
  firstBlockReason: string | null;
}

/**
 * Testa UMA regra contra um universo de editais e devolve o recall com amostra destacada.
 * É a peça que transforma "adivinhar palavra-chave" em "calibrar palavra-chave".
 */
export function probeRule(rule: KeywordRule, targets: readonly ProbeTarget[], sampleSize = 12): ProbeResult {
  let total = 0;
  let blocked = 0;
  let missedByComplementar = 0;
  let firstBlockReason: string | null = null;
  const sample: ProbeSampleRow[] = [];

  for (const target of targets) {
    const verdict = evaluateRule(rule, foldText(target.text));
    if (verdict.matched) {
      total++;
      if (sample.length < sampleSize) {
        sample.push({ id: target.id, text: target.text, hits: verdict.hits, meta: target.meta ?? {} });
      }
      continue;
    }
    if (verdict.blockedBy) {
      blocked++;
      firstBlockReason ??= verdict.reason;
    } else if (verdict.missingComplementares.length > 0) {
      missedByComplementar++;
      firstBlockReason ??= verdict.reason;
    }
  }

  return { total, blocked, missedByComplementar, universe: targets.length, sample, firstBlockReason };
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

/** Quebra o texto em segmentos marcados/não-marcados, pronto para render. Spans podem se sobrepor. */
export function segmentByHits(
  text: string,
  hits: readonly CaptureHit[],
): Array<{ text: string; hit: CaptureHit | null }> {
  if (hits.length === 0) return [{ text, hit: null }];
  const ordered = [...hits].sort((a, b) => a.start - b.start || b.end - a.end);
  const segments: Array<{ text: string; hit: CaptureHit | null }> = [];
  let cursor = 0;
  for (const hit of ordered) {
    if (hit.start < cursor) continue; // sobreposição: o primeiro (mais longo) vence
    if (hit.start > cursor) segments.push({ text: text.slice(cursor, hit.start), hit: null });
    segments.push({ text: text.slice(hit.start, hit.end), hit });
    cursor = hit.end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), hit: null });
  return segments;
}

/** Regra vazia para o editor, com o modo explícito já definido. */
export function emptyRule(id: string): KeywordRule {
  return { id, term: "", complementares: [], indesejadas: [], complementarMode: "todas", enabled: true };
}

/** Valida antes de salvar — mensagens em PT-BR, prontas para a UI. */
export function validateRule(rule: KeywordRule): string[] {
  const errors: string[] = [];
  if (foldTerm(rule.term).length === 0) errors.push("A palavra-chave principal é obrigatória.");
  const overlap = rule.indesejadas.filter((word) => foldTerm(word).join(" ") === foldTerm(rule.term).join(" "));
  if (overlap.length > 0) errors.push(`"${overlap[0]}" está como indesejada e como principal — a regra nunca capturaria nada.`);
  const dupes = rule.complementares.filter((word) =>
    rule.indesejadas.some((bad) => foldTerm(bad).join(" ") === foldTerm(word).join(" ")),
  );
  if (dupes.length > 0) errors.push(`"${dupes[0]}" está em complementares e em indesejadas ao mesmo tempo.`);
  return errors;
}
