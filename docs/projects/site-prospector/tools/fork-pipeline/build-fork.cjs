#!/usr/bin/env node
/**
 * build-fork.cjs — monta o fork MULTI-PÁGINA de um site de referência, já com a marca trocada.
 * Uso: node build-fork.cjs <brandConfig.json>
 *
 * Entrada:  <ref>/site/  (capturado por capture-site.cjs) + assets do prospect
 * Saída:    <out>/index.html, shop.html, about.html, ... + assets/ compartilhados
 * Idempotente: sempre reconstrói a partir da captura.
 */
const fs = require('fs');
const path = require('path');

const CFG = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const REF = CFG.referenceSite;
const OUT = CFG.out;

// ─────────────────────────── esqueleto ───────────────────────────
// no Windows a pasta trava se algum shell estiver dentro dela — limpar só o conteúdo, tolerante
try { fs.rmSync(OUT, { recursive: true, force: true }); }
catch { for (const f of fs.readdirSync(OUT)) { try { fs.rmSync(path.join(OUT, f), { recursive: true, force: true }); } catch {} } }
fs.mkdirSync(path.join(OUT, 'assets/img'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'assets/fonts'), { recursive: true });

// CSS do site (dedup dos blocos de rede)
let css = fs.readFileSync(path.join(REF, 'css-collected.css'), 'utf8');
css = css.replace(/url\((["']?)(?:\.\.\/)*media\/([^)"']+)\1\)/g, 'url("assets/fonts/$2")');
for (const kill of CFG.killCssUrls || []) {
  css = css.replace(new RegExp('url\\((["\']?)' + kill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\1\\)', 'g'), 'none');
}
fs.writeFileSync(path.join(OUT, 'styles.css'), css);

for (const f of fs.readdirSync(path.join(REF, 'assets/fonts'))) {
  fs.copyFileSync(path.join(REF, 'assets/fonts', f), path.join(OUT, 'assets/fonts', f));
}
for (const f of fs.readdirSync(path.join(REF, 'assets/img'))) {
  fs.copyFileSync(path.join(REF, 'assets/img', f), path.join(OUT, 'assets/img', f));
}
// assets do prospect (prefixo bk- = brand kit)
for (const dir of CFG.brandAssetDirs) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!/\.(png|jpe?g|webp|svg)$/i.test(f)) continue;
    fs.copyFileSync(path.join(dir, f), path.join(OUT, 'assets/img', 'bk-' + f));
  }
}

const site = JSON.parse(fs.readFileSync(path.join(REF, 'site-index.json'), 'utf8'));
// %XX no nome quebra o servidor estático (decodifica e some o arquivo) → vira '-'
const fileFor = (p) => (p === '/' ? 'index.html'
  : p.replace(/^\//, '').replace(/\//g, '__').replace(/%[0-9A-Fa-f]{2}/g, '-') + '.html');
const localImgs = new Set(fs.readdirSync(path.join(OUT, 'assets/img')));

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const report = { pages: [], missedText: new Set(), missedImg: new Set() };

// ─────────────────────────── por página ───────────────────────────
for (const pg of site.pages) {
  let html = fs.readFileSync(path.join(REF, 'pages', pg.slug, 'page.html'), 'utf8');
  const before = html.length;

  // 1. remove runtime remoto (hidratação, analytics, pixels)
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '')
             .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
             .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
             .replace(/<link[^>]*>/gi, '')
             .replace(/<\/head>/i, '<link rel="stylesheet" href="styles.css">\n</head>');

  // 2. imagens → locais
  html = html.replace(/\ssrcset="[^"]*"/gi, '');
  html = html.replace(/src="([^"]+)"/gi, (full, raw) => {
    if (/^data:/i.test(raw)) return full;
    const u = raw.replace(/&amp;/g, '&');
    const m = u.match(/[?&]url=([^&]+)/);
    const base = decodeURIComponent(m ? m[1] : u).split('/').pop().split('?')[0];
    if (localImgs.has(base)) return `src="assets/img/${base}"`;
    // a captura sanitiza o nome (1@1x.jpg → 1_1x.jpg); tentar a forma sanitizada
    const san = base.replace(/[^a-zA-Z0-9._-]/g, '_');
    if (localImgs.has(san)) return `src="assets/img/${san}"`;
    const hit = [...localImgs].find(f => f.endsWith('_' + base) || f.endsWith('_' + san));
    if (hit) return `src="assets/img/${hit}"`;
    report.missedImg.add(base);
    return full;
  });

  // 3. links internos → arquivos locais
  html = html.replace(/href="(\/[^"#?]*)"/g, (full, p) => {
    if (/^\/_next|\.(png|jpe?g|svg|ico|webp|css|js)$/i.test(p)) return full;
    const known = site.pages.find(x => x.path === p);
    return known ? `href="${fileFor(p)}"` : 'href="#"';
  });

  // 4. LOGO
  if (CFG.logo) {
    html = html.replace(new RegExp(`<svg([^>]*viewBox="${esc(CFG.logo.viewBox)}"[^>]*)>[\\s\\S]*?<\\/svg>`, 'g'),
      (m, attrs) => {
        const cls = (attrs.match(/class="([^"]*)"/) || [, ''])[1];
        return `<img src="assets/img/bk-${CFG.logo.file}" alt="${CFG.name}" class="${cls} object-contain">`;
      });
  }

  // 5. troca de imagens produto/ingrediente
  let swapped = 0;
  for (const [from, to] of Object.entries(CFG.images || {})) {
    if (!localImgs.has('bk-' + to)) continue;
    const re = new RegExp('assets/img/' + esc(from), 'g');
    const n = (html.match(re) || []).length;
    if (n) { html = html.replace(re, `assets/img/bk-${to}`); swapped += n; }
  }

  // 5b. imagens que NÃO têm equivalente no prospect (ex.: logos de imprensa da referência)
  //     viram pixel transparente — melhor apagar do que exibir imprensa de outra marca.
  for (const dead of CFG.blankImages || []) {
    html = html.replace(new RegExp('src="assets/img/' + esc(dead) + '"', 'g'),
      'src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-removido="sem equivalente no prospect"');
  }

  // 6. texto (casing da FONTE)
  let hits = 0;
  for (const [from, to] of CFG.text) {
    const re = new RegExp(esc(from), 'g');
    const n = (html.match(re) || []).length;
    if (n) { html = html.replace(re, to); hits += n; }
  }
  for (const [needle, values] of CFG.textNth || []) {
    let i = 0;
    html = html.replace(new RegExp('>' + esc(needle) + '<', 'g'),
      () => '>' + (values[i++] ?? values[values.length - 1]) + '<');
  }

  // 7. títulos split-text: regenera os <char>/<arc-letter> a partir do rótulo já traduzido
  for (const [label, letters] of CFG.arcTitles || []) {
    if (!html.includes(`aria-label="${label}"`)) continue;
    const L = [...letters]; let i = 0;
    html = html.replace(/(<span data-arc-letter="true"[^>]*>)([^<]?)(<\/span>)/g,
      (m, o, _c, c2) => o + (L[i++] ?? '') + c2);
  }
  for (const label of CFG.recharLabels || []) {
    const at = html.indexOf(`aria-label="${label}"`);
    if (at < 0) continue;
    const L = [...label]; let i = 0;
    const head = html.slice(0, at);
    let win = html.slice(at, at + 9000);
    const rest = html.slice(at + 9000);
    const RUN = /((?:<div (?:class="char" )?aria-hidden="true"[^>]*>[^<]?<\/div>\s*)+)/;
    if (RUN.test(win)) {
      win = win.replace(RUN, run => run.replace(/(<div (?:class="char" )?aria-hidden="true"[^>]*>)([^<]?)(<\/div>)/g,
        (m, o, _c, c2) => { const ch = L[i++] ?? ''; return o + (ch === ' ' ? '&nbsp;' : ch) + c2; }));
      html = head + win + rest;
    }
  }
  // nav/rótulos com dois spans de hover-swap
  html = html.replace(/(<span data-(?:first|second)-text="true"[^>]*aria-label="([^"]+)"[^>]*>)([\s\S]*?)(<\/span>)/g,
    (full, open, label, inner, close) => {
      if (!/class="char"/.test(inner)) return full;
      return open + [...label].map(ch =>
        `<div class="char" aria-hidden="true" style="position: relative; display: inline-block;">${ch === ' ' ? '&nbsp;' : ch}</div>`).join('') + close;
    });

  // 8. preço: nunca inventar
  // preço: nunca inventar. Pega prefixo de moeda (HK$, US$, R$, €, £) junto com o número.
  if (CFG.stripPrices !== false) html = html.replace(/(?:HK|US|NT|R|A|C|S)?[$€£¥]\s?\d[\d.,]*/g, '');

  // 9. head + chrome do mockup
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${CFG.name} — ${CFG.tagline}</title>`)
             .replace(/<html([^>]*)lang="[^"]*"/i, '<html$1lang="pt-BR"');
  html = html.replace(/<\/head>/i, `<style>
  /* consentimento de cookie: sem o JS que fecha, o modal trava a página. Some em qualquer fork. */
  #onetrust-consent-sdk,#onetrust-banner-sdk,.onetrust-pc-dark-filter,#CybotCookiebotDialog,
  #cookiescript_injected,.cookie-consent,.cc-window,[id*="cookie-banner"],[class*="CookieConsent"],
  [id^="coi-banner"],#usercentrics-root{display:none!important}
  header[data-nav]{opacity:1!important;transform:none!important}
  [data-global-nav],[data-desktop-nav]{transition:opacity .3s}
  body:not(.scrolled) [data-global-nav]{opacity:0!important;pointer-events:none!important}
  body.scrolled [data-global-nav],body.scrolled [data-global-nav] *{opacity:1!important;visibility:visible!important;pointer-events:auto}
  body.scrolled [data-desktop-nav],body.scrolled [data-desktop-nav] *{opacity:0!important;pointer-events:none!important}
</style></head>`);
  html = html.replace(/<\/body>/i, `<div style="position:fixed;bottom:10px;left:10px;z-index:99999;background:#322c23;color:#f5e4c7;font:12px/1.2 system-ui;padding:6px 10px;border-radius:6px">MOCKUP PRIVADO · ${CFG.name} · não publicado</div>
<script>(function(){var f=function(){document.body.classList.toggle('scrolled',scrollY>150)};addEventListener('scroll',f,{passive:true});f();})();</script></body>`);

  const outFile = fileFor(pg.path);
  fs.writeFileSync(path.join(OUT, outFile), html);
  report.pages.push({ file: outFile, kb: Math.round(html.length / 1024), textHits: hits, imgSwaps: swapped, fromKb: Math.round(before / 1024) });
}

// ─────────────────────────── relatório ───────────────────────────
const en = /\b(sauce|bucks|bbq|doug|philly|newtown|wholesale pricing|gluten-free bbq)\b/i;
for (const p of report.pages) {
  const h = fs.readFileSync(path.join(OUT, p.file), 'utf8');
  const leftovers = [...new Set([...h.matchAll(/>([^<>]{3,90})</g)].map(m => m[1].trim()).filter(t => en.test(t)))];
  p.leftovers = leftovers.length;
  leftovers.slice(0, 6).forEach(t => report.missedText.add(`${p.file}: ${t.slice(0, 60)}`));
}
console.log(`\n${CFG.name} → ${OUT}`);
console.log('página'.padEnd(34) + 'KB   texto  imgs  sobra-EN');
for (const p of report.pages) {
  console.log(p.file.padEnd(34) + String(p.kb).padStart(4) + String(p.textHits).padStart(7) + String(p.imgSwaps).padStart(6) + String(p.leftovers).padStart(9));
}
if (report.missedImg.size) console.log(`\n⚠ imagens sem local (${report.missedImg.size}): ${[...report.missedImg].slice(0, 8).join(', ')}`);
if (report.missedText.size) {
  console.log(`\n⚠ texto ainda em inglês (${report.missedText.size}):`);
  [...report.missedText].slice(0, 20).forEach(t => console.log('   ' + t));
}
fs.writeFileSync(path.join(OUT, '_build-report.json'), JSON.stringify(report, (k, v) => v instanceof Set ? [...v] : v, 2));
