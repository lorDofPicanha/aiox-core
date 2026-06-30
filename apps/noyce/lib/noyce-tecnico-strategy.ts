// Estratégia de habilitação técnica (Tier 2, 30/Jun) — ataca a causa #1 de inabilitação da ENIAC:
// o CAO técnico-OPERACIONAL (art. 67, II). Baseado em pesquisa verificada (Planalto/TCU):
//   • Somatório de atestados é a REGRA (TCU Ac. 1153/2024) — soma as CATs da ENIAC vs o exigido.
//   • Lacuna → CONSÓRCIO (art. 15: somatório de acervos; 100% ME/EPP isenta o acréscimo de 10-30%
//     na habilitação econômica, §2º) ou SUBCONTRATAÇÃO até 25% do objeto (art. 67 §9º, se o edital prever).
// 100% DETERMINÍSTICO. Não inventa quantitativo: o que não vem do edital fica "indeterminado".

import type { CompanyCapabilityProfile, EditalRequirementsModel } from "./noyce-model.ts";

export interface TecnicoGap {
  servico: string;
  exigido: number;
  disponivel: number;
  faltam: number;
  un: string;
}

export type TecnicoModo = "solo" | "consorcio" | "subcontratacao" | "indeterminado";

export interface TecnicoStrategy {
  /** true = ENIAC habilita tecnicamente sozinha; false = há lacuna; null = quantitativo não extraído. */
  habilitaSozinha: boolean | null;
  gaps: TecnicoGap[];
  modo: TecnicoModo;
  recomendacao: string;
  consorcioNota: string;
  fonte: string;
}

function norm(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[_\s]+/g, " ").trim();
}

/** Soma o quantitativo do acervo da ENIAC para um serviço (match por canônico ou sobreposição de palavras). */
function somaAcervo(ccp: Pick<CompanyCapabilityProfile, "acervo">, servico: string, un: string): number {
  const alvo = norm(servico);
  const alvoTokens = new Set(alvo.split(" ").filter((t) => t.length >= 4));
  let total = 0;
  for (const a of ccp.acervo) {
    for (const it of a.itens) {
      const cand = norm(it.servicoCanonico);
      const mesmaUn = !un || !it.unidade || norm(it.unidade) === norm(un);
      const exact = cand === alvo;
      const overlap = [...alvoTokens].some((t) => cand.includes(t));
      if ((exact || overlap) && mesmaUn) total += it.qtd;
    }
  }
  return total;
}

/**
 * Avalia a habilitação técnico-OPERACIONAL da ENIAC contra o ERM e recomenda o caminho legal
 * (solo / consórcio / subcontratação). Pura e testável.
 */
export function buildTecnicoStrategy(args: {
  erm: EditalRequirementsModel | null | undefined;
  ccp: Pick<CompanyCapabilityProfile, "acervo" | "identity">;
}): TecnicoStrategy {
  const { erm, ccp } = args;
  const operacional = erm?.tecnica.operacional ?? [];
  const fonte = "Lei 14.133 art. 67 II/§9º + art. 15; TCU Ac. 1153/2024 (somatório é regra)";
  const consorcioNota =
    "Consórcio: some os acervos das consorciadas (art. 15). PREFIRA outra ME/EPP — consórcio 100% ME/EPP é ISENTO do acréscimo de 10-30% na habilitação econômica (art. 15 §2º). Com empresa maior resolve o acervo, mas perde a isenção.";

  // Sem exigência operacional extraída → não dá p/ afirmar (geralmente está no Termo de Referência).
  const computaveis = operacional.filter((o) => typeof o.qtdMin === "number" && o.qtdMin! > 0);
  if (operacional.length === 0) {
    return {
      habilitaSozinha: null,
      gaps: [],
      modo: "indeterminado",
      recomendacao: "Edital sem exigência técnico-operacional quantitativa extraída — conferir o Termo de Referência (anexo) para confirmar o que a PJ precisa comprovar.",
      consorcioNota,
      fonte,
    };
  }
  if (computaveis.length === 0) {
    return {
      habilitaSozinha: null,
      gaps: [],
      modo: "indeterminado",
      recomendacao: "Exige atestado técnico-operacional, mas o QUANTITATIVO não veio no texto (remetido ao Termo de Referência). Confirmar o quantitativo para calcular a cobertura do acervo da ENIAC.",
      consorcioNota,
      fonte,
    };
  }

  const gaps: TecnicoGap[] = [];
  for (const req of computaveis) {
    const exigido = req.qtdMin as number;
    const disponivel = somaAcervo(ccp, req.servico, req.un ?? "");
    const faltam = Math.max(0, exigido - disponivel);
    if (faltam > 0) {
      gaps.push({ servico: req.servico, exigido, disponivel: Math.round(disponivel), faltam: Math.round(faltam), un: req.un ?? "" });
    }
  }

  if (gaps.length === 0) {
    return {
      habilitaSozinha: true,
      gaps: [],
      modo: "solo",
      recomendacao: "ENIAC habilita tecnicamente SOZINHA: o somatório dos atestados (CATs) cobre os quantitativos exigidos. Não precisa de consórcio para a parte técnica.",
      consorcioNota,
      fonte,
    };
  }

  const lista = gaps.map((g) => `${g.servico} (faltam ${g.faltam}${g.un ? " " + g.un : ""} de ${g.exigido})`).join("; ");
  return {
    habilitaSozinha: false,
    gaps,
    modo: "consorcio",
    recomendacao:
      `Lacuna técnico-operacional: ${lista}. Caminhos legais: (1) CONSÓRCIO — buscar parceiro com acervo do(s) serviço(s) em falta e somar (art. 15); ` +
      "(2) SUBCONTRATAÇÃO — se o edital invocar o art. 67 §9º, comprovar via atestado de potencial subcontratado, até 25% do objeto. Antes, verificar se a cláusula de quantitativo respeita o teto de 50% (art. 67 §2º) — acima disso é impugnável.",
    consorcioNota,
    fonte,
  };
}
