// Porte ME/EPP DERIVADO do balanço, nunca constante (conclave 12/Jun, Justen).
// LC 123/2006, art. 3º: ME = receita bruta anual ≤ R$ 360.000; EPP ≤ R$ 4.800.000.
// Risco real que motivou isto: receita ENIAC 2025 = R$ 314.963 = 87% do teto de ME.
// Declaração de enquadramento assinada após desenquadramento = declaração falsa
// (Lei 14.133, art. 155, VIII; LC 123, art. 3º, §9º) — sanção alcança a PESSOA que assina.
import type { CompanyCapabilityProfile, FinancialSnapshot } from "./noyce-model";

export const TETO_ME = 360_000;
export const TETO_EPP = 4_800_000;
/** Acima desta fração do teto, alertar desenquadramento iminente. */
export const FAIXA_ALERTA = 0.8;

export interface PorteDerivation {
  /** Porte calculado da receita do último exercício com receita conhecida. */
  porte: "ME" | "EPP" | "DEMAIS" | null;
  /** Porte declarado no cadastro (identity) — pode divergir do calculado. */
  porteDeclarado: "ME" | "EPP" | "DEMAIS" | null;
  receitaBase: number | null;
  exercicio: number | null;
  tetoAtual: number | null;
  /** receitaBase / tetoAtual (0..1+) quando calculável. */
  pctTeto: number | null;
  alerta: "desenquadrado_do_declarado" | "desenquadramento_iminente" | "sem_receita" | null;
  nota: string;
}

function latestWithReceita(financials: readonly FinancialSnapshot[]): FinancialSnapshot | null {
  return (
    [...financials]
      .filter((f) => f.receitaBruta !== null)
      .sort((a, b) => b.exercicio - a.exercicio)[0] ?? null
  );
}

function porteFromReceita(receita: number): "ME" | "EPP" | "DEMAIS" {
  if (receita <= TETO_ME) return "ME";
  if (receita <= TETO_EPP) return "EPP";
  return "DEMAIS";
}

export function derivePorte(ccp: CompanyCapabilityProfile): PorteDerivation {
  const declarado = ccp.identity.porte;
  const fin = latestWithReceita(ccp.financials);

  if (!fin || fin.receitaBruta === null) {
    return {
      porte: declarado,
      porteDeclarado: declarado,
      receitaBase: null,
      exercicio: null,
      tetoAtual: null,
      pctTeto: null,
      alerta: "sem_receita",
      nota: "Sem receita bruta no vault — porte usa o cadastro, NÃO confirmado por balanço. Anexar demonstrações antes de declarar enquadramento.",
    };
  }

  const porte = porteFromReceita(fin.receitaBruta);
  const tetoAtual = porte === "ME" ? TETO_ME : porte === "EPP" ? TETO_EPP : null;
  const pctTeto = tetoAtual ? fin.receitaBruta / tetoAtual : null;

  if (declarado !== null && porte !== declarado) {
    return {
      porte,
      porteDeclarado: declarado,
      receitaBase: fin.receitaBruta,
      exercicio: fin.exercicio,
      tetoAtual,
      pctTeto,
      alerta: "desenquadrado_do_declarado",
      nota: `Receita ${fin.exercicio} (R$ ${fin.receitaBruta.toLocaleString("pt-BR")}) classifica como ${porte}, mas o cadastro declara ${declarado}. NÃO assinar declaração de ${declarado} — declaração falsa (art. 155, VIII, Lei 14.133; LC 123 art. 3º §9º). Atualizar enquadramento antes.`,
    };
  }

  if (pctTeto !== null && pctTeto >= FAIXA_ALERTA) {
    return {
      porte,
      porteDeclarado: declarado,
      receitaBase: fin.receitaBruta,
      exercicio: fin.exercicio,
      tetoAtual,
      pctTeto,
      alerta: "desenquadramento_iminente",
      nota: `Receita ${fin.exercicio} = ${Math.round(pctTeto * 100)}% do teto de ${porte} (R$ ${tetoAtual?.toLocaleString("pt-BR")}). Empresa em crescimento: confirmar enquadramento vigente ANTES de cada declaração — ultrapassar o teto e seguir declarando ${porte} é declaração falsa.`,
    };
  }

  return {
    porte,
    porteDeclarado: declarado,
    receitaBase: fin.receitaBruta,
    exercicio: fin.exercicio,
    tetoAtual,
    pctTeto,
    alerta: null,
    nota: `Porte ${porte} confirmado pela receita ${fin.exercicio} (${pctTeto !== null ? Math.round(pctTeto * 100) : "?"}% do teto).`,
  };
}
