// Trunfos de ME/EPP (Tier 1, 30/Jun) — vitórias "de graça" via lei que o Noyce não usava.
// Baseado em pesquisa verificada (deep-research, fontes primárias Planalto/TCU; ver
// docs/projects/buscador-licitacoes/estrategia-vitoria-14133-research.md):
//   • Empate ficto — LC 123/2006 arts. 44-45 (recepcionada pela Lei 14.133, art. 4º): ME até 10%
//     (concorrência/obras) ou 5% (pregão) acima do menor lance pode COBRIR e ser adjudicada.
//   • Exclusividade ME até R$80k — LC 123 art. 48, I.
//   • Regularização fiscal/trabalhista tardia — LC 123 art. 43 §1º: 5 dias úteis pós-vitória.
// 100% DETERMINÍSTICO. Não inventa preço; usa o histórico real (price band) como referência.

import type { CompanyCapabilityProfile, MarketStructure } from "./noyce-model.ts";

export type MeAdvKind = "empate_ficto" | "exclusividade" | "regularizacao_tardia";

export interface MeAdvantage {
  kind: MeAdvKind;
  titulo: string;
  detalhe: string;
  /** Ação operacional concreta (o que fazer na sessão / antes). */
  acao: string;
  fonte: string;
  impacto: "alto" | "medio";
}

const LIMITE_EXCLUSIVIDADE = 80_000; // LC 123 art. 48, I

function fmtBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

/** É ME ou EPP? Só esses têm os trunfos. */
export function isMeEpp(ccp: Pick<CompanyCapabilityProfile, "identity">): boolean {
  return ccp.identity.porte === "ME" || ccp.identity.porte === "EPP";
}

/** Faixa do empate ficto pela modalidade: 5% no pregão, 10% nas demais (concorrência/obras). */
export function empateFictoPct(modalidade: string | number | null | undefined): number {
  if (typeof modalidade === "string" && /preg[ãa]o/i.test(modalidade)) return 5;
  // Códigos PNCP: 6 = Pregão. Demais (concorrência etc.) → 10%.
  if (modalidade === 6 || modalidade === "6") return 5;
  return 10;
}

export interface MeAdvInput {
  ccp: Pick<CompanyCapabilityProfile, "identity">;
  estimatedValue: number | null;
  modalidade: string | number | null | undefined;
  /** Estrutura de mercado do órgão (price band) — referência do "provável líder". */
  market?: MarketStructure | null;
}

/**
 * Lista os trunfos de ME/EPP aplicáveis a este certame. Vazio se a empresa não é ME/EPP.
 * Cada trunfo traz a AÇÃO concreta (o direito de licitação só vale se exercido no prazo).
 */
export function buildMeAdvantages(input: MeAdvInput): MeAdvantage[] {
  if (!isMeEpp(input.ccp)) return [];
  const out: MeAdvantage[] = [];
  const pct = empateFictoPct(input.modalidade);

  // 1. Empate ficto — sempre aplicável a ME/EPP. Calcula a janela sobre o preço de referência.
  const ref = input.market?.priceBand?.medianBRL ?? null;
  const janela = ref !== null ? ref * (1 + pct / 100) : null;
  out.push({
    kind: "empate_ficto",
    titulo: `Empate ficto de ${pct}% — direito de cobrir e vencer`,
    detalhe:
      `Como ME/EPP, se na sessão sua proposta ficar até ${pct}% acima do menor lance (L), você tem o direito de apresentar proposta inferior e ser adjudicada — preferência aplicada ANTES dos demais critérios de desempate.` +
      (janela !== null
        ? ` Referência: vencedores deste órgão ~${fmtBRL(ref!)} (mediana); sua janela de empate ficto vai até ~${fmtBRL(janela)}.`
        : ""),
    acao:
      `Na sessão, fique logado: ao ver o menor lance L, cubra-o (proposta < L) dentro do prazo — ${pct === 5 ? "5 minutos no pregão eletrônico" : "no prazo da concorrência"}. Não exercer no prazo PRECLUI o direito; passa à próxima ME/EPP da faixa.`,
    fonte: "LC 123/2006 arts. 44-45 (recepcionada pela Lei 14.133, art. 4º) — TCU 5.4.2",
    impacto: "alto",
  });

  // 2. Exclusividade ME até R$80k — concorrência restrita.
  if (input.estimatedValue !== null && input.estimatedValue <= LIMITE_EXCLUSIVIDADE) {
    out.push({
      kind: "exclusividade",
      titulo: "Janela de exclusividade ME/EPP (≤ R$ 80 mil)",
      detalhe:
        `Valor estimado ${fmtBRL(input.estimatedValue)} ≤ R$ 80.000 — a contratação deve ser destinada EXCLUSIVAMENTE a ME/EPP, eliminando rivais de maior porte. Menos concorrência, mais chance.`,
      acao: "Priorize este certame: o universo de concorrentes é só ME/EPP. Confirme no edital se a exclusividade foi aplicada (exceção do art. 49: menos de 3 ME/EPP locais afasta).",
      fonte: "LC 123/2006 art. 48, I (exceção art. 49)",
      impacto: "alto",
    });
  }

  // 3. Regularização fiscal/trabalhista tardia — reduz o medo de inabilitação por CND.
  out.push({
    kind: "regularizacao_tardia",
    titulo: "Pendência fiscal/trabalhista não inabilita na hora",
    detalhe:
      "Como ME/EPP, eventual restrição em certidão (CND Federal/Estadual/Municipal, FGTS, CNDT) NÃO te inabilita na fase de habilitação: você tem 5 dias úteis (prorrogáveis por igual período) contados da DECLARAÇÃO de vencedora para sanar.",
    acao: "Não desista por uma certidão vencível: participe, e se for declarada vencedora, regularize dentro dos 5 dias úteis. Só decai do direito se não sanar no prazo.",
    fonte: "LC 123/2006 art. 43 §1º",
    impacto: "medio",
  });

  return out;
}
