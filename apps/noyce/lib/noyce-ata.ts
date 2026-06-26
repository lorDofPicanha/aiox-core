// Ingestão de ATA (desbloqueada do vault): o humano COLA o texto da ata/resultado da sessão e o
// Noyce pré-preenche o SessionResult (outcome + data + vencedor + motivo) por heurística
// determinística. NÃO decide nada — só adianta o preenchimento; o humano confirma. (Upload/parse
// de PDF + persistência no vault = quando 30.6 entrar; aqui é texto colado, sem dependência.)

import type { EniacOutcome } from "./agents/maestro-types";

export interface AtaParse {
  eniacOutcome: EniacOutcome;
  sessionAt: string | null; // ISO −03:00 quando achável
  winnerNome: string | null;
  motivo: string | null;
  confidence: "observed" | "inferred";
}

// dd/mm/aaaa [às] hh:mm → ISO −03:00 (fuso BR; não desliza o instante).
function parseDataHora(text: string): string | null {
  const m = /(\d{2})\/(\d{2})\/(\d{4})(?:[^\d]{1,6}(\d{1,2})[:h](\d{2}))?/.exec(text);
  if (!m) return null;
  const [, d, mo, y, hh, mm] = m;
  const h = (hh ?? "00").padStart(2, "0");
  const min = (mm ?? "00").padStart(2, "0");
  return `${y}-${mo}-${d}T${h}:${min}:00-03:00`;
}

// "ENIAC" pode aparecer como a recorrente; o vencedor é OUTRA empresa quando perdemos.
function parseWinner(text: string): string | null {
  const m =
    /(?:vencedora?|declarad[ao]\s+vencedora?|adjudicat[áa]ri[ao]|melhor\s+(?:proposta|lance))\s*(?:foi|:|\s+a\s+empresa|\s+a\s+licitante)?\s*([A-ZÀ-Ú][\w .&'-]{3,60}(?:LTDA|ME|EPP|EIRELI|S\.?A\.?|S\/A)?)/.exec(text);
  return m ? m[1].replace(/\s+/g, " ").trim() : null;
}

export function parseAtaResult(text: string): AtaParse {
  const t = text || "";
  const lower = t.toLowerCase();

  // ENIAC é a NOSSA empresa — quando o texto fala "ENIAC ... inabilitada", é desfecho nosso.
  let eniacOutcome: EniacOutcome = "indefinido";
  if (/\binabilitad/.test(lower)) eniacOutcome = "inabilitada";
  else if (/\bdesclassificad/.test(lower)) eniacOutcome = "desclassificada";
  else if (/empate\s+ficto|preferência\s+m[ei]\/?epp|direito\s+de\s+prefer/.test(lower)) eniacOutcome = "empate_ficto_meepp";
  else if (/eniac.*(vencedora?|habilitada\s+e\s+classificada|melhor\s+proposta)|adjudicad[ao]\s+(à|a)\s+eniac/.test(lower)) eniacOutcome = "vencedora";
  else if (/(vencedora?|adjudicat[áa]ri[ao]|melhor\s+proposta).*(?!eniac)/.test(lower) && /vencedora?/.test(lower)) eniacOutcome = "derrotada_julgamento";

  // Se citou explicitamente que a ENIAC venceu, prevalece.
  if (/eniac.{0,40}(vencedora?|declarada\s+vencedora?|adjudicad)/.test(lower)) eniacOutcome = "vencedora";

  const winnerNome = eniacOutcome === "vencedora" ? null : parseWinner(t);
  const sessionAt = parseDataHora(t);

  // motivo = trecho em torno de inabilitação/desclassificação (com fonte da ata).
  const motivoMatch = /(motiv[oa]|raz[ãa]o|porque|em\s+raz[ãa]o\s+de|por\s+n[ãa]o)[^.\n]{5,160}/i.exec(t);
  const motivo = motivoMatch ? motivoMatch[0].replace(/\s+/g, " ").trim().slice(0, 180) : null;

  return {
    eniacOutcome,
    sessionAt,
    winnerNome,
    motivo,
    confidence: eniacOutcome === "indefinido" ? "inferred" : "inferred", // colado = sempre conferir
  };
}
