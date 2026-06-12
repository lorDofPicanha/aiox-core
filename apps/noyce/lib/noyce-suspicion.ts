import type {
  ClauseReference,
  EditalRequirementsModel,
  LegalHook,
  SuspicionSignal,
  SuspicionSeverity,
  SuspicionType,
} from "./noyce-model";

export interface PublicationMinimumRule {
  id: string;
  objeto: string;
  criterios: string[];
  regimes: string[];
  minBusinessDays: number;
  legalHook: LegalHook;
}

export interface LegalConstants {
  publicationMinimumsStatus: string;
  publicationMinimums: PublicationMinimumRule[];
  proposalGuaranteeMaxPct: {
    valuePct: number;
    legalHook: LegalHook;
  };
  technicalQuantityCeilingPct: {
    value: number;
    legalHook: LegalHook;
  };
  impugnationWindowBusinessDays: {
    value: number;
    legalHook: LegalHook;
  };
}

export interface HolidayCalendar {
  holidays: Array<{
    date: string;
    name: string;
    kind: string;
  }>;
}

interface MinimumPublicationMatch {
  minBusinessDays: number;
  hookLegal: LegalHook;
}

const HOOK_TECNICA_OPERACIONAL = {
  artigo: "Lei 14.133/2021, art. 67 §1º",
  descricao: "Exigencias tecnico-operacionais devem se limitar as parcelas de maior relevancia e valor significativo.",
} satisfies LegalHook;

const HOOK_MARCA = {
  artigo: "Lei 14.133/2021, art. 41",
  descricao: "Indicacao de marca deve preservar justificativa tecnica e possibilidade de padrao equivalente quando cabivel.",
} satisfies LegalHook;

const HOOK_INDICES = {
  artigo: "Lei 14.133/2021, art. 69",
  descricao: "Indices economico-financeiros exigem justificativa e leitura humana do edital.",
} satisfies LegalHook;

export function buildSuspicionSignals(
  erm: EditalRequirementsModel,
  constants: LegalConstants,
  holidayCalendar: HolidayCalendar,
): SuspicionSignal[] {
  const signals: SuspicionSignal[] = [];
  const impugnationAction = buildImpugnationAction(erm.meta.dataSessao, constants, holidayCalendar);

  const publicationMinimum = minimumPublicationDays(erm, constants);
  if (publicationMinimum) {
    const businessDays = businessDaysBetween(erm.meta.dataPublicacao, erm.meta.dataSessao, holidayCalendar);
    if (businessDays !== null && businessDays < publicationMinimum.minBusinessDays) {
      signals.push(
        signal(
          "PRAZO_EXIGUO",
          buildDateEvidence(erm.meta.dataPublicacao, erm.meta.dataSessao),
          publicationMinimum.hookLegal,
          "media",
          `verificar prazo; ${impugnationAction}`,
        ),
      );
    }
  }

  const economicClause = validClause(erm.economicoFinanceira.clausula);
  const guaranteePct = normalizePercentPoints(erm.economicoFinanceira.garantiaPropostaPct);
  if (economicClause && guaranteePct !== null && guaranteePct > constants.proposalGuaranteeMaxPct.valuePct) {
    signals.push(
      signal(
        "GARANTIA_PROPOSTA_ACIMA_LIMITE",
        economicClause,
        constants.proposalGuaranteeMaxPct.legalHook,
        "alta",
        impugnationAction,
      ),
    );
  }

  const technicalClause = validClause(erm.tecnica.clausula);
  const hasOperationalQuantity = erm.tecnica.operacional.some((item) => isPositiveNumber(item.qtdMin));
  if (
    technicalClause &&
    hasOperationalQuantity &&
    Array.isArray(erm.tecnica.parcelasMaiorRelevancia) &&
    erm.tecnica.parcelasMaiorRelevancia.length === 0
  ) {
    signals.push(
      signal(
        "QUANTITATIVO_ATESTADO_SEM_PARCELA",
        technicalClause,
        HOOK_TECNICA_OPERACIONAL,
        "alta",
        impugnationAction,
      ),
    );
  }

  if (technicalClause && hasOperationalQuantity && erm.tecnica.parcelasMaiorRelevancia === null) {
    signals.push(
      signal(
        "QUANTITATIVO_ATESTADO_SEM_PARCELA",
        technicalClause,
        HOOK_TECNICA_OPERACIONAL,
        "alta",
        impugnationAction,
      ),
    );
  }

  if (technicalClause) {
    for (const item of erm.tecnica.operacional) {
      if (
        isPositiveNumber(item.qtdMin) &&
        isPositiveNumber(item.qtdObjeto) &&
        item.qtdMin > constants.technicalQuantityCeilingPct.value * item.qtdObjeto
      ) {
        signals.push(
          signal(
            "QUANTITATIVO_ACIMA_TETO",
            withTrecho(
              technicalClause,
              `${item.servico}: exigido ${item.qtdMin} ${item.un ?? ""} sobre objeto ${item.qtdObjeto} ${item.un ?? ""}`.trim(),
            ),
            constants.technicalQuantityCeilingPct.legalHook,
            "media",
            impugnationAction,
          ),
        );
      }
    }
  }

  if (technicalClause && erm.tecnica.restricaoTempoLocal === true) {
    signals.push(signal("RESTRICAO_TEMPO_LOCAL", technicalClause, HOOK_TECNICA_OPERACIONAL, "media", impugnationAction));
  }

  if (technicalClause && erm.tecnica.marcaSemSimilar === true) {
    signals.push(signal("MARCA_SEM_SIMILAR", technicalClause, HOOK_MARCA, "media", impugnationAction));
  }

  const requiresEconomicIndex = erm.economicoFinanceira.exigePL === true || hasRequiredIndex(erm.economicoFinanceira.indices);
  if (economicClause && requiresEconomicIndex && erm.economicoFinanceira.justificativaPresente === false) {
    signals.push(
      signal(
        "INDICE_ECON_FIN_SEM_JUSTIFICATIVA",
        economicClause,
        HOOK_INDICES,
        "revisao",
        "revisar manualmente",
      ),
    );
  }

  return signals;
}

export function dataLimiteImpugnacao(
  dataSessao: string | null,
  constants: LegalConstants,
  holidayCalendar: HolidayCalendar,
): string | null {
  const sessionDate = parseDateOnly(dataSessao);
  if (!sessionDate) return null;

  const holidays = holidaySet(holidayCalendar);
  const deadline = new Date(sessionDate);
  let remaining = constants.impugnationWindowBusinessDays.value;

  while (remaining > 0) {
    deadline.setUTCDate(deadline.getUTCDate() - 1);
    if (isBusinessDay(deadline, holidays)) remaining -= 1;
  }

  return toDateOnly(deadline);
}

export function businessDaysBetween(
  startIso: string | null,
  endIso: string | null,
  holidayCalendar: HolidayCalendar,
): number | null {
  const start = parseDateOnly(startIso);
  const end = parseDateOnly(endIso);
  if (!start || !end) return null;
  if (end.getTime() <= start.getTime()) return 0;

  const holidays = holidaySet(holidayCalendar);
  const cursor = new Date(start);
  let days = 0;

  while (cursor.getTime() < end.getTime()) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    if (isBusinessDay(cursor, holidays)) days += 1;
  }

  return days;
}

function minimumPublicationDays(
  erm: EditalRequirementsModel,
  constants: LegalConstants,
): MinimumPublicationMatch | null {
  const criterio = normalizeText(erm.meta.criterioJulgamento);
  const regime = normalizeText(erm.meta.regimeExecucao);
  if (!criterio || !regime) return null;

  // Art. 55, IV e V (conclave 12/Jun, Justen): o REGIME prevalece sobre o critério —
  // contratação integrada por técnica-e-preço exige 60 d.u., não 35. Semi-integrada antes
  // de integrada no teste de substring ("semi integrada" contém "integrada").
  if (hasAny(regime, ["semi integrada", "semi-integrada"])) {
    return findMinimum(constants, "contratacao_semi_integrada");
  }
  if (hasAny(regime, ["contratacao integrada", "integrada"])) {
    return findMinimum(constants, "contratacao_integrada");
  }

  // Art. 55, III: técnica e preço / melhor técnica / maior retorno econômico = 35 d.u.
  if (hasAny(criterio, ["tecnica e preco", "tecnica preco", "melhor tecnica", "maior retorno economico"])) {
    return findMinimum(constants, "tecnica_preco_melhor_tecnica");
  }

  // Art. 55, II, a/b: menor preço/maior desconto em obra COMUM (10 d.u.) × ESPECIAL (25 d.u.).
  // objetoComum não extraído → não chuta (sem sinal de prazo; melhor silêncio que falso alarme/falsa calma).
  if (
    hasAny(criterio, ["menor preco", "maior desconto"]) &&
    hasAny(regime, ["empreitada unitaria", "empreitada global", "empreitada tarefa", "tarefa"])
  ) {
    if (erm.meta.objetoComum === true) return findMinimum(constants, "engenharia_comum_menor_preco");
    if (erm.meta.objetoComum === false) return findMinimum(constants, "engenharia_especial_menor_preco");
    return null;
  }

  return null;
}

function findMinimum(constants: LegalConstants, id: string): MinimumPublicationMatch | null {
  const rule = constants.publicationMinimums.find((item) => item.id === id);
  if (!rule) return null;
  return {
    minBusinessDays: rule.minBusinessDays,
    hookLegal: rule.legalHook,
  };
}

function buildImpugnationAction(
  dataSessao: string | null,
  constants: LegalConstants,
  holidayCalendar: HolidayCalendar,
): string {
  const deadline = dataLimiteImpugnacao(dataSessao, constants, holidayCalendar);
  return deadline ? `avaliar impugnação até ${deadline}` : "avaliar impugnação conforme art. 164";
}

function signal(
  tipo: SuspicionType,
  evidenciaEdital: ClauseReference,
  hookLegal: LegalHook,
  severidade: SuspicionSeverity,
  acao: string,
): SuspicionSignal {
  return {
    tier: 1,
    tipo,
    evidenciaEdital,
    hookLegal,
    severidade,
    acao,
    proveniencia: "grounded",
  };
}

function validClause(clause: ClauseReference | null): ClauseReference | null {
  if (!clause) return null;
  if (!clause.numero.trim() || !clause.texto.trim()) return null;
  return clause;
}

function buildDateEvidence(dataPublicacao: string | null, dataSessao: string | null): ClauseReference {
  return {
    numero: "datas-publicacao-sessao",
    texto: `Publicação ${dataPublicacao ?? "ausente"}; sessão ${dataSessao ?? "ausente"}.`,
  };
}

function withTrecho(clause: ClauseReference, trecho: string): ClauseReference {
  return {
    ...clause,
    trecho: clause.trecho ?? trecho,
  };
}

function hasRequiredIndex(indices: EditalRequirementsModel["economicoFinanceira"]["indices"]): boolean {
  return Object.values(indices).some((value) => typeof value === "number" && Number.isFinite(value));
}

function isPositiveNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function normalizePercentPoints(value: number | null): number | null {
  if (value === null || !Number.isFinite(value)) return null;
  return value <= 0.2 ? value * 100 : value;
}

function parseDateOnly(value: string | null): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return date;
}

function isBusinessDay(date: Date, holidays: ReadonlySet<string>): boolean {
  const day = date.getUTCDay();
  return day !== 0 && day !== 6 && !holidays.has(toDateOnly(date));
}

function holidaySet(calendar: HolidayCalendar): ReadonlySet<string> {
  return new Set(calendar.holidays.map((holiday) => holiday.date));
}

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function normalizeText(value: string | null): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function hasAny(value: string, candidates: readonly string[]): boolean {
  return candidates.some((candidate) => value.includes(candidate));
}
