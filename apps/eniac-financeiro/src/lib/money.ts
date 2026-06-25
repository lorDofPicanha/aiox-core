/**
 * Helpers de dinheiro (BRL). Valores são guardados em reais (numeric 15,2)
 * e manipulados como `number` no app. A UI de lançamento trabalha em
 * centavos (digitando dígitos) para evitar ambiguidade de vírgula/ponto.
 */

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const BRL_PLAIN = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 12480.5 → "R$ 12.480,50" */
export function formatBRL(value: number): string {
  return BRL.format(value);
}

/** 12480.5 → "12.480,50" (sem o símbolo, para inputs) */
export function formatBRLPlain(value: number): string {
  return BRL_PLAIN.format(value);
}

/** Converte uma string só de dígitos (centavos) em reais. "12345" → 123.45 */
export function centsStringToReais(digits: string): number {
  const onlyDigits = digits.replace(/\D/g, "");
  if (!onlyDigits) return 0;
  return Number.parseInt(onlyDigits, 10) / 100;
}

/** Formata enquanto digita: "12345" → "123,45" */
export function formatCentsInput(digits: string): string {
  return formatBRLPlain(centsStringToReais(digits));
}
