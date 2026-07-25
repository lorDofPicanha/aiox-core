// fork.cjs — monta um fork LOCAL executável a partir da captura de buckssauce.
// Passo 1 (baseline): página roda offline, ainda com marca original → prova que o fork funciona.
const fs = require('fs');
const path = require('path');

const IN = 'D:/AIOS/docs/projects/site-prospector/03-proposal-mockups/_reference-contracts/food/buckssauce/inputs';
const OUT = 'D:/AIOS/docs/projects/site-prospector/03-proposal-mockups/chokolaten/mockup-A-fork';

fs.mkdirSync(path.join(OUT, 'assets/img'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'assets/fonts'), { recursive: true });

// ---------- 1. CSS: só o bloco de rede (o [cssRules] é duplicata) ----------
const cssAll = fs.readFileSync(path.join(IN, 'css-collected.css'), 'utf8');
const marker = '/* ===== [cssRules]';
let css = cssAll.slice(0, cssAll.indexOf(marker));
// as fontes vivem em ../media/ no original → apontar p/ assets/fonts/
css = css.replace(/url\((["']?)(?:\.\.\/)*media\/([^)"']+)\1\)/g, 'url("assets/fonts/$2")');
// textura de galhada = marca da referência → não vai para o mockup da Chokolaten
css = css.replace(/url\((["']?)\/images\/antler-pattern\.webp\1\)/g, 'none');
fs.writeFileSync(path.join(OUT, 'styles.css'), css);

// ---------- 2. fontes ----------
const fontsSrc = path.join(IN, 'assets/fonts');
let nf = 0;
for (const f of fs.readdirSync(fontsSrc)) { fs.copyFileSync(path.join(fontsSrc, f), path.join(OUT, 'assets/fonts', f)); nf++; }

// ---------- 3. imagens já capturadas ----------
const imgSrc = path.join(IN, 'assets/img');
let ni = 0;
for (const f of fs.readdirSync(imgSrc)) { fs.copyFileSync(path.join(imgSrc, f), path.join(OUT, 'assets/img', f)); ni++; }

// ---------- 4. HTML ----------
let html = fs.readFileSync(path.join(IN, 'page.html'), 'utf8');
const before = html.length;

// remove TODO script (hidratação Next, Google Analytics, Meta Pixel, iframes de tracking)
html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
html = html.replace(/<noscript[\s\S]*?<\/noscript>/gi, '');
html = html.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
// remove links de rede (css remoto, preload, dns-prefetch, manifest…)
html = html.replace(/<link[^>]*>/gi, '');
// injeta o css local
html = html.replace(/<\/head>/i, '<link rel="stylesheet" href="styles.css">\n</head>');

// mapa: url remota → arquivo local
const manifest = JSON.parse(fs.readFileSync(path.join(IN, 'asset-manifest.json'), 'utf8'));
const byBase = new Map();
for (const im of manifest.images) {
  const base = decodeURIComponent(im.url).split('/').pop().split('?')[0];
  byBase.set(base, path.basename(im.file));
}

// reescreve src/srcset de imagem para local
const localFiles = new Set(fs.readdirSync(path.join(OUT, 'assets/img')));
const misses = new Set();
const resolveLocal = (raw) => {
  const u = raw.replace(/&amp;/g, '&');
  // /_next/image?url=%2Fimages%2Fcherry.webp&w=... → cherry.webp
  const m = u.match(/[?&]url=([^&]+)/);
  const base = decodeURIComponent(m ? m[1] : u).split('/').pop().split('?')[0];
  if (localFiles.has(base)) return 'assets/img/' + base;
  if (byBase.has(base) && localFiles.has(byBase.get(base))) return 'assets/img/' + byBase.get(base);
  const hit = [...localFiles].find(f => f.endsWith('_' + base) || f === base);
  if (hit) return 'assets/img/' + hit;
  misses.add(base);
  return null;
};

html = html.replace(/\ssrcset="[^"]*"/gi, '');           // srcset aponta tudo pro otimizador remoto
html = html.replace(/src="([^"]+)"/gi, (full, raw) => {
  if (/^data:/i.test(raw)) return full;
  const loc = resolveLocal(raw);
  return loc ? `src="${loc}"` : full;
});

fs.writeFileSync(path.join(OUT, 'index.html'), html);

console.log(`css      ${(css.length / 1024).toFixed(0)} KB`);
console.log(`fontes   ${nf}`);
console.log(`imagens  ${ni}`);
console.log(`html     ${(before / 1024 / 1024).toFixed(2)} MB → ${(html.length / 1024).toFixed(0)} KB (scripts removidos)`);
if (misses.size) console.log(`\n⚠ imagens SEM arquivo local (${misses.size}):\n  ` + [...misses].join('\n  '));
