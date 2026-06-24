/**
 * Constantes determinísticas do overlay Recuperação (demo navegável — Fase atual).
 *
 * O que ANTES vivia aqui (3 clientes com crédito monofásico HARD-CODED) foi substituído
 * pelo MOTOR REAL: o indício de crédito é agora COMPUTADO por `recuperacao-engine.ts`
 * (`detectarMonofasicoLote` sobre as notas-amostra em `seeds/`). A identidade dos
 * clientes e as notas-amostra moram em `recuperacao-seeds.ts`. Este arquivo guarda
 * apenas o que continua sendo uma constante de apresentação determinística: o ano-base.
 *
 * G6 (CONTEXT §5 #4): nada de crédito garantido — cada indício é computado pelo motor a
 * partir de uma nota-amostra e fica sujeito a análise e revisão do tributarista habilitado.
 */

/**
 * Ano-base do drill-down. Fixo (não usa Date.now()) para que a quebra ano a ano
 * ILUSTRATIVA seja determinística e reproduzível — cobre os 5 anos retroativos
 * terminando em ANO_BASE (2025–2021). A extrapolação retroativa é ILUSTRATIVA; o
 * número-base de cada indício vem do motor real (recuperacao-engine.ts).
 */
export const ANO_BASE = 2025;
