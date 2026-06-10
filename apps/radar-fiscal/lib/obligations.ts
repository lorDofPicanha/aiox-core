// Matriz de obrigações — MEI + Simples Nacional (MVP).
// Fonte: prazos legais públicos. NÃO contém cálculo de valor (linha vermelha Trust C3).
// Extensível: novas obrigações (eSocial, DCTFWeb, FGTS Digital...) entram aqui.

import type { Obrigacao } from "./domain";

export const OBRIGACOES: Obrigacao[] = [
  {
    codigo: "DAS-MEI",
    nome: "DAS-MEI",
    regimes: ["MEI"],
    periodicidade: "mensal",
    diaVencimento: 20,
    offsetMeses: 1,
    descricao:
      "Documento de Arrecadação do Simples Nacional do MEI. Vence dia 20 do mês seguinte à competência.",
  },
  {
    codigo: "DASN-SIMEI",
    nome: "DASN-SIMEI (Declaração Anual)",
    regimes: ["MEI"],
    periodicidade: "anual",
    diaVencimento: 31,
    mesVencimento: 5, // 31 de maio
    descricao:
      "Declaração Anual do Simples Nacional para o MEI. Vence em 31 de maio, referente ao ano-calendário anterior.",
  },
  {
    codigo: "DAS-SN",
    nome: "DAS Simples Nacional",
    regimes: ["SIMPLES"],
    periodicidade: "mensal",
    diaVencimento: 20,
    offsetMeses: 1,
    descricao:
      "Documento de Arrecadação do Simples Nacional. Vence dia 20 do mês seguinte à competência.",
  },
  {
    codigo: "DEFIS",
    nome: "DEFIS (Declaração de Informações Socioeconômicas e Fiscais)",
    regimes: ["SIMPLES"],
    periodicidade: "anual",
    diaVencimento: 31,
    mesVencimento: 3, // 31 de março
    descricao:
      "Declaração de Informações Socioeconômicas e Fiscais. Vence em 31 de março, referente ao ano-calendário anterior.",
  },
];

export function getObrigacao(codigo: string): Obrigacao | undefined {
  return OBRIGACOES.find((o) => o.codigo === codigo);
}

export function obrigacoesDoRegime(regime: "MEI" | "SIMPLES"): Obrigacao[] {
  return OBRIGACOES.filter((o) => o.regimes.includes(regime));
}
