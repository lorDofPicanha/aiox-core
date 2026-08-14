/**
 * LEITURA RESILIENTE DO PNCP — Slice B (13/Ago/2026).
 *
 * Motivação medida, não suposta: em 13/Ago uma única chamada a
 * `/contratacoes/publicacao?cnpj=…` levou **62,6 s e devolveu HTTP 500**. O kill-gate de
 * cobertura rodava com timeout de 12 s e 3 tentativas — ou seja, abortava antes de a API
 * ter chance de responder, e registrava o edital como "não achado".
 *
 * O erro conceitual que isto corrige é mais grave que o timeout: **"não encontrei" e "não
 * consegui perguntar" foram tratados como a mesma coisa.** O primeiro é um fato sobre o
 * mundo; o segundo é um fato sobre a nossa infraestrutura. Misturar os dois faz a métrica
 * de cobertura medir a nossa rede em vez de medir o PNCP.
 *
 * Por isso toda leitura devolve TELEMETRIA e o chamador é obrigado a decidir o que fazer
 * com uma consulta que falhou — nunca contá-la silenciosamente como ausência.
 *
 * Módulo puro e injetável (`fetchImpl`, `sleep`): os testes cobrem a máquina de estados
 * inteira sem tocar a rede.
 */

export type PncpFailureKind = "timeout" | "server_error" | "html_body" | "client_error" | "network";

export interface PncpFetchTelemetry {
  url: string;
  attempts: number;
  totalMs: number;
  /** `ok` = veio dado · `empty` = a API respondeu "não há" · `failed` = nunca obtivemos resposta. */
  outcome: "ok" | "empty" | "failed";
  failureKind: PncpFailureKind | null;
  lastStatus: number | null;
  detail: string | null;
}

export interface PncpPage {
  data: unknown[];
  totalPaginas: number;
  telemetry: PncpFetchTelemetry;
}

export interface PncpFetchOptions {
  fetchImpl?: typeof globalThis.fetch;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
  /** Tentativas totais. Default 6 — o PNCP 500 em rajada e volta. */
  retries?: number;
  /** Timeout por tentativa. Default 75 s: medimos resposta legítima em 62,6 s. */
  timeoutMs?: number;
  /** Base do backoff exponencial. */
  backoffMs?: number;
  /** Teto do backoff, para não esperar minutos entre tentativas. */
  maxBackoffMs?: number;
  userAgent?: string;
}

export const PNCP_DEFAULTS = {
  retries: 6,
  timeoutMs: 75_000,
  backoffMs: 1_200,
  maxBackoffMs: 20_000,
  userAgent: "noyce-discovery/1.0 (+contato via ENIAC; leitura pública Lei 14.133 art. 174)",
} as const;

type Attempt =
  | { kind: "ok"; data: unknown[]; totalPaginas: number }
  | { kind: "empty" }
  | { kind: "retryable"; failure: PncpFailureKind; status: number | null; detail: string }
  | { kind: "fatal"; failure: PncpFailureKind; status: number; detail: string };

/**
 * Classificação de resposta. O caso que mais nos custou:
 * **HTTP 200 com corpo HTML** — o WAF/gateway do PNCP devolve página de erro com status 200,
 * e um `JSON.parse` ingênuo estoura e vira "não achado". Isso é retentável, não fatal.
 */
export function classifyResponse(status: number, body: string): Attempt {
  if (status === 204) return { kind: "empty" };

  if (status >= 200 && status < 300) {
    const trimmed = body.trim();
    if (trimmed === "") return { kind: "empty" };
    if (trimmed.startsWith("<")) {
      return { kind: "retryable", failure: "html_body", status, detail: "corpo HTML em resposta 2xx (WAF/gateway)" };
    }
    try {
      const parsed = JSON.parse(trimmed) as { data?: unknown[]; totalPaginas?: number };
      const data = Array.isArray(parsed.data) ? parsed.data : [];
      return { kind: "ok", data, totalPaginas: Number(parsed.totalPaginas ?? (data.length ? 1 : 0)) || 0 };
    } catch {
      return { kind: "retryable", failure: "html_body", status, detail: "corpo 2xx ilegível como JSON" };
    }
  }

  if (status === 408 || status === 429 || status >= 500) {
    return { kind: "retryable", failure: "server_error", status, detail: `HTTP ${status}` };
  }
  // 4xx restantes descrevem a NOSSA query (422 = parâmetro inválido). Repetir não conserta.
  return { kind: "fatal", failure: "client_error", status, detail: `HTTP ${status}` };
}

/** Backoff exponencial com jitter determinístico por tentativa (sem Math.random: testável). */
export function backoffFor(attempt: number, base: number, max: number): number {
  const exponential = base * 2 ** (attempt - 1);
  const jitter = (attempt * 137) % 400; // espalha rajadas sem depender de aleatoriedade
  return Math.min(exponential + jitter, max);
}

/**
 * Busca uma página do PNCP com retry, backoff e telemetria completa.
 * NUNCA lança por falha de rede/servidor: devolve `outcome: "failed"` para o chamador
 * decidir — que é o ponto do módulo.
 */
export async function fetchPncpPage(url: string, options: PncpFetchOptions = {}): Promise<PncpPage> {
  const {
    fetchImpl = globalThis.fetch,
    sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)),
    now = () => Date.now(),
    retries = PNCP_DEFAULTS.retries,
    timeoutMs = PNCP_DEFAULTS.timeoutMs,
    backoffMs = PNCP_DEFAULTS.backoffMs,
    maxBackoffMs = PNCP_DEFAULTS.maxBackoffMs,
    userAgent = PNCP_DEFAULTS.userAgent,
  } = options;

  const started = now();
  let attempts = 0;
  let lastFailure: PncpFailureKind | null = null;
  let lastStatus: number | null = null;
  let lastDetail: string | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    attempts = attempt;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(url, {
        signal: controller.signal,
        headers: { accept: "application/json", "user-agent": userAgent },
      });
      clearTimeout(timer);
      const body = await response.text();
      const verdict = classifyResponse(response.status, body);

      if (verdict.kind === "ok") {
        return {
          data: verdict.data,
          totalPaginas: verdict.totalPaginas,
          telemetry: { url, attempts, totalMs: now() - started, outcome: "ok", failureKind: null, lastStatus: response.status, detail: null },
        };
      }
      if (verdict.kind === "empty") {
        return {
          data: [],
          totalPaginas: 0,
          telemetry: { url, attempts, totalMs: now() - started, outcome: "empty", failureKind: null, lastStatus: response.status, detail: null },
        };
      }
      lastFailure = verdict.failure;
      lastStatus = verdict.status;
      lastDetail = verdict.detail;
      if (verdict.kind === "fatal") break;
    } catch (error) {
      clearTimeout(timer);
      const isAbort = error instanceof Error && (error.name === "AbortError" || /abort/i.test(error.message));
      lastFailure = isAbort ? "timeout" : "network";
      lastStatus = null;
      lastDetail = isAbort ? `timeout após ${timeoutMs}ms` : String(error instanceof Error ? error.message : error);
    }

    if (attempt < retries) await sleep(backoffFor(attempt, backoffMs, maxBackoffMs));
  }

  return {
    data: [],
    totalPaginas: 0,
    telemetry: { url, attempts, totalMs: now() - started, outcome: "failed", failureKind: lastFailure, lastStatus, detail: lastDetail },
  };
}

/**
 * Percorre todas as páginas. Se QUALQUER página falhar, o resultado inteiro é marcado
 * `complete: false` — meia coleta apresentada como completa é pior que coleta nenhuma,
 * porque contamina a cobertura com ausência falsa.
 */
export async function fetchPncpAllPages(
  buildUrl: (pagina: number) => string,
  options: PncpFetchOptions & { maxPages?: number } = {},
): Promise<{ data: unknown[]; complete: boolean; telemetry: PncpFetchTelemetry[] }> {
  const maxPages = options.maxPages ?? 20;
  const telemetry: PncpFetchTelemetry[] = [];
  const data: unknown[] = [];
  let pagina = 1;
  let totalPaginas = 1;

  while (pagina <= totalPaginas && pagina <= maxPages) {
    const page = await fetchPncpPage(buildUrl(pagina), options);
    telemetry.push(page.telemetry);
    if (page.telemetry.outcome === "failed") return { data, complete: false, telemetry };
    data.push(...page.data);
    totalPaginas = Math.max(page.totalPaginas, 1);
    pagina++;
  }

  return { data, complete: true, telemetry };
}

/**
 * O julgamento que o gate de cobertura precisa fazer e não fazia.
 * `not_published` só pode ser afirmado quando a consulta VOLTOU — se falhou, a resposta
 * honesta é `unknown`, e o edital sai do denominador em vez de contar como ausência.
 */
export type CoverageVerdict = "found" | "not_published" | "unknown";

export function judgeCoverage(found: boolean, telemetry: readonly PncpFetchTelemetry[]): CoverageVerdict {
  if (found) return "found";
  if (telemetry.length === 0) return "unknown";
  // CORREÇÃO 13/Ago (medida em produção): a versão anterior devolvia `not_published`
  // quando ALGUMA consulta respondia, mesmo que outra tivesse falhado. Isso está errado —
  // a rota que falhou pode ser exatamente a que tinha a resposta.
  //
  // Prova real: `edital-01-2026` foi julgado `not_published` numa rodada com 22 tentativas
  // e 2 falhas; na rodada seguinte, com a API saudável, foi ACHADO em 3 tentativas. A
  // ausência era falsa e derrubou a cobertura do gate inteiro.
  //
  // Afirmar ausência exige que TODAS as rotas tenham respondido.
  const allAnswered = telemetry.every((entry) => entry.outcome === "ok" || entry.outcome === "empty");
  return allAnswered ? "not_published" : "unknown";
}
