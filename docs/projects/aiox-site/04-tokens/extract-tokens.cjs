#!/usr/bin/env node
/**
 * extract-tokens.cjs — extrai o vocabulário visual COMUM às referências capturadas.
 *
 * Por que não reusar a skill `design-md`: ela faz URL → DESIGN.md de UM site, usando `claude -p`
 * como camada de cognição (pool metered, Constitution Art. VII). Aqui o objetivo é o cruzamento
 * de N capturas locais para achar o que o tier inteiro concorda — e custom properties CSS são
 * texto literal no arquivo, não precisam de LLM.
 *
 * Uso: node extract-tokens.cjs <dirDasCapturas> [ref1 ref2 ...]
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || '.';
const REFS = process.argv.slice(3).length
  ? process.argv.slice(3)
  : fs.readdirSync(ROOT).filter((d) => fs.existsSync(path.join(ROOT, d, 'css-collected.css')));

const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1);
const topN = (m, n = 20) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);

// ---------- normalização de cor ----------
const hex = (r, g, b) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
function normColor(raw) {
  const s = raw.trim().toLowerCase();
  let m = s.match(/^#([0-9a-f]{3})$/);
  if (m) return '#' + m[1].split('').map((c) => c + c).join('');
  m = s.match(/^#([0-9a-f]{6})$/);
  if (m) return s;
  m = s.match(/^#([0-9a-f]{8})$/);
  if (m) return '#' + m[1].slice(0, 6);
  m = s.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  if (m) return hex(+m[1], +m[2], +m[3]);
  return null; // oklch/hsl/var() ficam de fora da contagem de literais
}

// ---------- luminância p/ classificar claro/escuro ----------
function lum(h) {
  const c = [1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

const report = {};

for (const ref of REFS) {
  const cssPath = path.join(ROOT, ref, 'css-collected.css');
  if (!fs.existsSync(cssPath)) { console.error(`skip ${ref}: sem css-collected.css`); continue; }
  const css = fs.readFileSync(cssPath, 'utf8');

  const vars = new Map();      // --nome: valor
  const colors = new Map();    // literais de cor
  const fonts = new Map();     // font-family
  const sizes = new Map();     // font-size
  const radii = new Map();     // border-radius
  const spaces = new Map();    // padding/margin/gap
  const weights = new Map();   // font-weight
  const eases = new Map();     // timing function
  const durs = new Map();      // duration

  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;{}]{1,80})[;}]/gi)) {
    bump(vars, `${m[1].trim()}: ${m[2].trim()}`);
  }
  for (const m of css.matchAll(/#[0-9a-f]{3,8}\b|rgba?\([^)]{5,40}\)/gi)) {
    const c = normColor(m[0]);
    if (c) bump(colors, c);
  }
  for (const m of css.matchAll(/font-family\s*:\s*([^;{}]{3,120})[;}]/gi)) {
    bump(fonts, m[1].replace(/["']/g, '').trim().split(',')[0].trim());
  }
  for (const m of css.matchAll(/font-size\s*:\s*([\d.]+(?:px|rem|em))/gi)) bump(sizes, m[1]);
  for (const m of css.matchAll(/border-radius\s*:\s*([\d.]+(?:px|rem|%)|9999px|50%)/gi)) bump(radii, m[1]);
  for (const m of css.matchAll(/(?:padding|margin|gap)\s*:\s*([\d.]+(?:px|rem))\b/gi)) bump(spaces, m[1]);
  for (const m of css.matchAll(/font-weight\s*:\s*(\d{3})/gi)) bump(weights, m[1]);
  for (const m of css.matchAll(/(cubic-bezier\([^)]+\)|ease-in-out|ease-out|ease-in|linear)/gi)) bump(eases, m[1].toLowerCase());
  for (const m of css.matchAll(/(?:transition|animation)(?:-duration)?\s*:[^;{}]*?([\d.]+m?s)/gi)) bump(durs, m[1]);

  const dark = [...colors.entries()].filter(([c]) => lum(c) < 0.2).reduce((a, [, n]) => a + n, 0);
  const light = [...colors.entries()].filter(([c]) => lum(c) > 0.8).reduce((a, [, n]) => a + n, 0);

  report[ref] = {
    cssKB: Math.round(css.length / 1024),
    customProps: vars.size,
    tema: dark > light ? 'escuro' : 'claro',
    escuroVsClaro: `${dark} : ${light}`,
    fontes: topN(fonts, 6),
    pesos: topN(weights, 8),
    tamanhos: topN(sizes, 14),
    raios: topN(radii, 8),
    espacos: topN(spaces, 12),
    cores: topN(colors, 16),
    easing: topN(eases, 5),
    duracoes: topN(durs, 6),
    varsAmostra: topN(vars, 12),
  };
}

// ---------- cruzamento: o que o tier concorda ----------
const consenso = {};
for (const campo of ['fontes', 'pesos', 'tamanhos', 'raios', 'espacos', 'easing', 'duracoes']) {
  const acc = new Map();
  for (const ref of Object.keys(report)) {
    for (const [val] of report[ref][campo]) {
      if (!acc.has(val)) acc.set(val, new Set());
      acc.get(val).add(ref);
    }
  }
  consenso[campo] = [...acc.entries()]
    .map(([v, s]) => [v, s.size, [...s].join(',')])
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 14);
}

console.log(JSON.stringify({ refs: report, consenso }, null, 2));
