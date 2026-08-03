// Mede contraste chamando o HANDLER REAL do mcp-design-studio (contrast_check),
// carregado como módulo ES. Não é reimplementação: é o mesmo caminho de código
// que a tool MCP expõe. Mesmo método declarado na DIRECAO-ARTE.md Parte 0.2.
import { registerContrastTools } from "file:///D:/jarvis/mcp-design-studio/dist/providers/contrast-provider.js";

const handlers = {};
const fakeServer = {
  tool(name, _desc, _schema, fn) { handlers[name] = fn; },
};
registerContrastTools(fakeServer);

async function check(fg, bg) {
  const r = await handlers.contrast_check({ foreground: fg, background: bg });
  return JSON.parse(r.content[0].text);
}

// ---- composição de alfa sobre fundo (sem isso o número não significa nada) ----
function comp(fgHex8, bgHex) {
  const f = fgHex8.replace("#", "");
  const b = bgHex.replace("#", "");
  const a = f.length === 8 ? parseInt(f.slice(6, 8), 16) / 255 : 1;
  const [fr, fg_, fb] = [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16));
  const [br, bg_, bb] = [0, 2, 4].map((i) => parseInt(b.slice(i, i + 2), 16));
  const mix = (x, y) => Math.round(x * a + y * (1 - a));
  return "#" + [mix(fr, br), mix(fg_, bg_), mix(fb, bb)]
    .map((v) => v.toString(16).padStart(2, "0")).join("");
}

const T = {
  bg: "#0f0f0f", surf: "#141414", card: "#1a1a1a", cardHover: "#212121",
  border: "#262626", borderStrong: "#303030",
  ink: "#fafafa", ink2: "#fafafaa8", ink3: "#fafafa7d", ink4: "#fafafa5c",
  bronze: "#E9A23B", bronzeHover: "#df9320", bronze2: "#de9517", onBronze: "#190f00",
  bronzeWash: "#E9A23B0d", bronzeSoft: "#E9A23B1a", bronzeRing: "#E9A23B38",
  chip: "#ffffff08",            // fundo da pílula de eyebrow (gesto conicorn invertido)
};

// superfícies compostas que a gramática do conicorn INTRODUZ neste build
const S = {
  bg: T.bg, surf: T.surf, card: T.card, cardHover: T.cardHover,
  border: T.border, borderStrong: T.borderStrong,
  chipOnBg: comp(T.chip, T.bg),
  chipOnSurf: comp(T.chip, T.surf),
  washOnBg: comp(T.bronzeWash, T.bg),
  washOnSurf: comp(T.bronzeWash, T.surf),
  washOnCard: comp(T.bronzeWash, T.card),
  softOnCard: comp(T.bronzeSoft, T.card),
  softOnBg: comp(T.bronzeSoft, T.bg),
  ringOnCard: comp(T.bronzeRing, T.card),
};

// par: [rótulo, fg (pode ter alfa), superfície, uso, exigência]
const pares = [
  // --- tinta sobre as 4 superfícies do sistema
  ["ink / bg", T.ink, S.bg, "H1, H2 de seção, título de card", "AA texto"],
  ["ink / surf", T.ink, S.surf, "H2 em faixa alternada", "AA texto"],
  ["ink / card", T.ink, S.card, "título de card, pergunta do FAQ", "AA texto"],
  ["ink / card-hover", T.ink, S.cardHover, "título de card sob hover", "AA texto"],
  ["ink-2 / bg", T.ink2, S.bg, "subhead centrado da gramática conicorn", "AA texto"],
  ["ink-2 / surf", T.ink2, S.surf, "corpo em faixa alternada", "AA texto"],
  ["ink-2 / card", T.ink2, S.card, "corpo de card", "AA texto"],
  ["ink-2 / card-hover", T.ink2, S.cardHover, "corpo de card sob hover", "AA texto"],
  ["ink-2 / border", T.ink2, S.border, "célula da matriz §9 — pior caso", "AA texto"],
  ["ink-3 / bg", T.ink3, S.bg, "legenda, premissa da conta, meta", "AA texto"],
  ["ink-3 / surf", T.ink3, S.surf, "legenda em faixa alternada", "AA texto"],
  ["ink-3 / card", T.ink3, S.card, "rótulo de card, placeholder do textarea", "AA texto"],
  ["ink-3 / card-hover", T.ink3, S.cardHover, "rótulo sob hover", "AA texto"],
  ["ink-3 / border", T.ink3, S.border, "glifo 'não' da matriz — pior caso", "AA texto"],
  ["ink-4 / bg", T.ink4, S.bg, "SÓ decoração (marca de corte, filete)", "UI 3:1"],
  ["ink-3 / chip@bg", T.ink3, S.chipOnBg, "número 001..010 da pílula (gesto conicorn)", "AA texto"],
  ["ink-3 / chip@surf", T.ink3, S.chipOnSurf, "número da pílula em faixa alternada", "AA texto"],
  ["ink-4 / chip@bg", T.ink4, S.chipOnBg, "SÓ decoração dentro da pílula", "UI 3:1"],
  ["ink-4 / card", T.ink4, S.card, "número 01/02/03 do card da §3 (gesto conicorn) — decorativo", "UI 3:1"],
  ["ink-3 / softOnBg", T.ink3, S.softOnBg, "legenda sobre brilho radial", "AA texto"],
  // --- bronze sobre as superfícies
  ["bronze / bg", T.bronze, S.bg, "rótulo do eyebrow, número, CTA mono, foco", "AA texto"],
  ["bronze / surf", T.bronze, S.surf, "eyebrow em faixa alternada", "AA texto"],
  ["bronze / card", T.bronze, S.card, "CTA de card, ícone, carimbo da §3", "AA texto"],
  ["bronze / card-hover", T.bronze, S.cardHover, "CTA de card sob hover", "AA texto"],
  ["bronze / border", T.bronze, S.border, "marca 'sim' da matriz — pior caso", "AA texto"],
  ["bronze / chip@bg", T.bronze, S.chipOnBg, "rótulo + ponto da pílula (gesto conicorn)", "AA texto"],
  ["bronze / chip@surf", T.bronze, S.chipOnSurf, "pílula em faixa alternada", "AA texto"],
  ["bronze / wash@bg", T.bronze, S.washOnBg, "coluna 'comigo' da matriz sobre bg", "AA texto"],
  ["bronze / wash@surf", T.bronze, S.washOnSurf, "coluna 'comigo' da matriz sobre surf", "AA texto"],
  ["bronze / wash@card", T.bronze, S.washOnCard, "etapa automatizável do mapa §5", "AA texto"],
  ["bronze / soft@card", T.bronze, S.softOnCard, "ícone dentro do chip", "AA texto"],
  ["bronze-2 / bg", T.bronze2, S.bg, "base do gradiente do H1", "AA texto"],
  ["bronze-hover / bg", T.bronzeHover, S.bg, "link em hover", "AA texto"],
  ["ink-2 / wash@surf", T.ink2, S.washOnSurf, "corpo na coluna destacada da matriz", "AA texto"],
  ["ink-2 / wash@card", T.ink2, S.washOnCard, "texto da etapa automatizável §5", "AA texto"],
  // --- fill bronze (o único campo cromático da página)
  ["on-bronze / bronze", T.onBronze, T.bronze, "texto do botão primário", "AA texto"],
  ["on-bronze / bronze-hover", T.onBronze, T.bronzeHover, "botão primário em hover", "AA texto"],
  ["ink / bronze  🔴 PROIBIDO", T.ink, T.bronze, "branco sobre fill bronze — nunca usar", "AA texto"],
  // --- linha (o gesto stackgrid) — decorativa, mas medida
  ["border / bg", T.border, S.bg, "filete de seção, moldura de folha", "decorativa"],
  ["border-strong / bg", T.borderStrong, S.bg, "borda tracejada (gesto stackgrid)", "decorativa"],
  ["border-strong / surf", T.borderStrong, S.surf, "tracejado em faixa alternada", "decorativa"],
  ["border / card", T.border, S.card, "borda de card", "decorativa"],
  ["ring@card / card", S.ringOnCard, S.card, "borda de card ativo/hover", "decorativa"],
  // --- foco (WCAG 2.2 SC 1.4.11, piso 3:1)
  ["foco bronze / bg", T.bronze, S.bg, "outline 2px", "UI 3:1"],
  ["foco bronze / card", T.bronze, S.card, "outline 2px sobre card", "UI 3:1"],
  ["foco bronze / border", T.bronze, S.border, "outline 2px sobre borda", "UI 3:1"],
];

const linhas = [];
for (const [rot, fgRaw, bg, uso, exig] of pares) {
  const fg = fgRaw.length === 9 ? comp(fgRaw, bg) : fgRaw;
  const r = await check(fg, bg);
  const ratio = parseFloat(r.ratio);
  linhas.push({
    par: rot, fg: fgRaw, composto: fgRaw.length === 9 ? fg : "—", fundo: bg,
    ratio: r.ratio,
    aa: r.normal_text.aa, aaa: r.normal_text.aaa, ui: r.ui_components.aa,
    uso, exig,
    veredito:
      exig === "decorativa" ? "isenta (SC 1.4.11)"
      : exig === "UI 3:1" ? (r.ui_components.aa === "PASS" ? "OK" : "🔴 REPROVA")
      : (r.normal_text.aa === "PASS" ? (r.normal_text.aaa === "PASS" ? "AAA" : "AA") : "🔴 REPROVA AA"),
    n: ratio,
  });
}

console.log(JSON.stringify(linhas, null, 1));
console.error("\n--- MARKDOWN ---\n");
console.error("| par | fg | composto | fundo | ratio | AA | AAA | UI 3:1 | veredito | uso |");
console.error("|---|---|---|---|---|---|---|---|---|---|");
for (const l of linhas) {
  console.error(`| ${l.par} | \`${l.fg}\` | ${l.composto === "—" ? "—" : "`" + l.composto + "`"} | \`${l.fundo}\` | **${l.ratio}** | ${l.aa === "PASS" ? "✅" : "❌"} | ${l.aaa === "PASS" ? "✅" : "❌"} | ${l.ui === "PASS" ? "✅" : "❌"} | ${l.veredito} | ${l.uso} |`);
}
const reprova = linhas.filter((l) => l.veredito.startsWith("🔴") && !l.par.includes("PROIBIDO"));
console.error(`\nPares medidos: ${linhas.length} · reprovações não-intencionais: ${reprova.length}`);
reprova.forEach((l) => console.error("  🔴 " + l.par + " " + l.ratio + " — " + l.uso));
