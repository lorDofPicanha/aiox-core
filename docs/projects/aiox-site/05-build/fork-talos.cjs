// fork-talos.cjs — USA o template Conicorn de verdade: copia os arquivos capturados,
// traduz e edita. Não reconstrói, não "se inspira".
//
// Por que não uso o build-fork.cjs do site-prospector: ele apaga TODOS os <script> (foi feito
// para mockup estático de e-commerce). No Conicorn isso mataria GSAP + ScrollTrigger + SplitText
// + as interações do Webflow — justamente a parte que o founder exige. Aqui o JS fica, localizado.
//
// Uso: node fork-talos.cjs
const fs = require('fs');
const path = require('path');

const RAIZ = __dirname;
const REF = path.join(RAIZ, '..', '02-references', 'inputs', 'conicorn');
const OUT = path.join(RAIZ, 'talos-site');
const COPY = JSON.parse(fs.readFileSync(path.join(RAIZ, 'talos-copy.json'), 'utf8'));

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const rel = { copiados: 0, textoAplicado: [], textoPerdido: [], secoesRemovidas: [], imgPerdida: new Set() };

// ── esqueleto ────────────────────────────────────────────────────────────────
// no Windows a pasta trava se algum shell estiver dentro dela — limpa só o conteúdo, tolerante
try { fs.rmSync(OUT, { recursive: true, force: true }); }
catch {
  if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) {
    try { fs.rmSync(path.join(OUT, f), { recursive: true, force: true }); } catch {}
  }
}
for (const d of ['assets/img', 'assets/fonts', 'assets/js']) fs.mkdirSync(path.join(OUT, d), { recursive: true });

// CSS: o capturado referencia fontes como ../media/x.woff2 → aponta para a pasta local
let css = fs.readFileSync(path.join(REF, 'css-collected.css'), 'utf8');
css = css.replace(/url\((["']?)(?:\.\.\/)*media\/([^)"']+)\1\)/g, 'url("assets/fonts/$2")');
fs.writeFileSync(path.join(OUT, 'styles.css'), css);

for (const [sub, dir] of [['assets/fonts', 'fonts'], ['assets/img', 'img'], ['assets/js', 'js']]) {
  const src = path.join(REF, sub);
  if (!fs.existsSync(src)) continue;
  for (const f of fs.readdirSync(src)) { fs.copyFileSync(path.join(src, f), path.join(OUT, sub, f)); rel.copiados++; }
}
const imgsLocais = new Set(fs.readdirSync(path.join(OUT, 'assets/img')));
const jsLocais = new Set(fs.readdirSync(path.join(OUT, 'assets/js')));

// ── HTML ─────────────────────────────────────────────────────────────────────
let html = fs.readFileSync(path.join(REF, 'pages', 'home', 'page.html'), 'utf8');
const tamanhoOriginal = html.length;

// 1. remove uma <section id="X"> inteira, respeitando aninhamento
function removerSecao(h, id) {
  const marca = new RegExp(`<section[^>]*id="${esc(id)}"`, 'i');
  const m = h.match(marca);
  if (!m) return { h, ok: false };
  const ini = m.index;
  let i = ini, prof = 0;
  const tag = /<(\/?)section\b/gi;
  tag.lastIndex = ini;
  let t;
  while ((t = tag.exec(h))) {
    prof += t[1] ? -1 : 1;
    if (prof === 0) { i = t.index + h.slice(t.index).indexOf('>') + 1; break; }
  }
  return { h: h.slice(0, ini) + `\n<!-- seção "${id}" removida pelo fork-talos -->\n` + h.slice(i), ok: true };
}
// 1b. remove um bloco pela CLASSE (usado para prova fabricada solta dentro de seção que fica)
function removerPorClasse(h, classe) {
  let n = 0;
  const re = new RegExp(`<div[^>]*class="[^"]*\\b${esc(classe)}\\b[^"]*"`, 'g');
  let m;
  while ((m = re.exec(h))) {
    const ini = m.index;
    const abre = h.indexOf('>', ini);
    let prof = 1, fim = -1;
    const tag = /<(\/?)div\b/g;
    tag.lastIndex = abre + 1;
    let t;
    while ((t = tag.exec(h))) { prof += t[1] ? -1 : 1; if (prof === 0) { fim = t.index + 6; break; } }
    if (fim === -1) break;
    h = h.slice(0, ini) + `<!-- bloco .${classe} removido pelo fork-talos -->` + h.slice(fim);
    n++;
    re.lastIndex = 0;
  }
  return { h, n };
}
for (const [classe, motivo] of COPY.removerBlocos || []) {
  const r = removerPorClasse(html, classe);
  html = r.h;
  rel.secoesRemovidas.push({ id: `.${classe}`, ok: r.n > 0, motivo });
}
// embed de vídeo de terceiro (YouTube via embedly) — não é material do founder
html = html.replace(/<div[^>]*class="[^"]*w-richtext-figure-type-video[^"]*"[\s\S]*?<\/div><\/div>/g,
  '<!-- vídeo YouTube do template removido -->');
html = html.replace(/<script type="application\/json"[^>]*>[\s\S]*?embedly[\s\S]*?<\/script>/g, '');

for (const [id, motivo] of COPY.removerSecoes) {
  const r = removerSecao(html, id);
  html = r.h;
  rel.secoesRemovidas.push({ id, ok: r.ok, motivo });
  // some também com o link de menu que apontava para ela (senão vira âncora morta)
  html = html.replace(new RegExp(`<a\\b[^>]*href="#${esc(id)}"[^>]*>[\\s\\S]*?<\\/a>`, 'gi'), '');
}

// 2. CSS remoto → local. Guarda os <link> de fonte? Não: as fontes já estão em assets/fonts.
html = html.replace(/<link[^>]*rel="stylesheet"[^>]*>/gi, '')
           .replace(/<link[^>]*rel="preconnect"[^>]*>/gi, '')
           .replace(/<\/head>/i, '  <link rel="stylesheet" href="styles.css">\n</head>');

// 3. <script src> remoto → local. O turnstile da Cloudflare (captcha do form) sai de vez.
html = html.replace(/<script[^>]*src="([^"]+)"[^>]*><\/script>/gi, (full, src) => {
  if (/challenges\.cloudflare\.com/i.test(src)) return '<!-- turnstile removido: captcha do form do template -->';
  const nome = decodeURIComponent(src.split('?')[0].split('/').pop());
  if (jsLocais.has(nome)) return `<script src="assets/js/${nome}"></script>`;
  return full; // deixa remoto e reporta
});

// 4. imagens → locais
html = html.replace(/\ssrcset="[^"]*"/gi, '');
html = html.replace(/src="([^"]+)"/gi, (full, raw) => {
  if (/^(data:|assets\/)/i.test(raw)) return full;
  const base = decodeURIComponent(raw.split('?')[0]).split('/').pop();
  if (imgsLocais.has(base)) return `src="assets/img/${base}"`;
  const san = base.replace(/[^a-zA-Z0-9._-]/g, '_');
  if (imgsLocais.has(san)) return `src="assets/img/${san}"`;
  const hit = [...imgsLocais].find(f => f.endsWith('_' + base) || f.endsWith('_' + san));
  if (hit) return `src="assets/img/${hit}"`;
  rel.imgPerdida.add(base);
  return full;
});
html = html.replace(/(background-image:\s*url\()(["']?)(https?:\/\/[^)"']+)\2(\))/gi, (full, a, q, u, z) => {
  const base = decodeURIComponent(u.split('?')[0]).split('/').pop();
  const hit = imgsLocais.has(base) ? base : [...imgsLocais].find(f => f.endsWith('_' + base));
  return hit ? `${a}"assets/img/${hit}"${z}` : full;
});

// 5. links internos: só a licença sobreviveu à captura; o resto vira âncora inerte
html = html.replace(/href="\/license"/g, 'href="licenca.html"').replace(/href="\/"/g, 'href="index.html"');

// 5b. links externos do template (o botão do hero apontava para o marketplace do Webflow)
for (const [de, para] of COPY.hrefs || []) {
  html = html.replace(new RegExp(`href="${esc(de)}"`, 'g'), `href="${para}"`);
}

// 5c. RÓTULOS PRÉ-DIVIDIDOS PELO SPLITTEXT
// A captura veio do DOM já renderizado: o GSAP SplitText tinha quebrado cada rótulo de botão em
// <div class="gsap_split_letter"> com `transform: translate3d(0px, 2em, 0px)` — letras paradas FORA
// da tela, no meio da animação de entrada. Trocar só o texto deixaria o botão invisível (é o mesmo
// acidente que já apagou a §2 numa rodada anterior deste projeto).
// Solução: devolver o miolo a texto puro. O SplitText está carregado e redivide no runtime; e se
// não redividir, o pior caso é o rótulo aparecer sem animação — nunca sumir.
// Scanner de <div> balanceado: acha o elemento pelo aria-label e troca o miolo inteiro.
function trocarRotuloDividido(h, de, para) {
  let n = 0;
  const alvo = `aria-label="${de}"`;
  let at = 0;
  while ((at = h.indexOf(alvo, at)) !== -1) {
    const abre = h.lastIndexOf('<div', at);
    const fimAbertura = h.indexOf('>', at);
    if (abre === -1 || fimAbertura === -1) { at += alvo.length; continue; }
    // caminha contando <div>/</div> até fechar o elemento
    let i = fimAbertura + 1, prof = 1;
    const tag = /<(\/?)div\b/g;
    tag.lastIndex = i;
    let t, fim = -1;
    while ((t = tag.exec(h))) {
      prof += t[1] ? -1 : 1;
      if (prof === 0) { fim = t.index; break; }
    }
    if (fim === -1) { at += alvo.length; continue; }
    const miolo = h.slice(fimAbertura + 1, fim);
    if (!/gsap_split_/.test(miolo)) { at += alvo.length; continue; }
    const aberturaNova = h.slice(abre, fimAbertura + 1).replace(alvo, `aria-label="${para}"`);
    h = h.slice(0, abre) + aberturaNova + para + h.slice(fim);
    n++;
    at = abre + aberturaNova.length + para.length;
  }
  return { h, n };
}
let rotulos = 0;
for (const [de, para] of COPY.rotulosBotao || []) {
  const r = trocarRotuloDividido(html, de, para);
  html = r.h; rotulos += r.n;
  if (!r.n) rel.textoPerdido.push(`[rótulo dividido] ${de}`);
}

// 6. TEXTO — o coração do pedido: traduzir tudo
for (const [de, para] of COPY.texto) {
  const re = new RegExp(esc(de), 'g');
  const n = (html.match(re) || []).length;
  if (n) { html = html.replace(re, para); rel.textoAplicado.push([de.slice(0, 48), n]); }
  else rel.textoPerdido.push(de.slice(0, 60));
}

// 7. cabeça
html = html.replace(/<html([^>]*)\slang="[^"]*"/i, '<html$1 lang="pt-BR"')
           .replace(/<html(?![^>]*\slang=)/i, '<html lang="pt-BR"')
           .replace(/<title>[\s\S]*?<\/title>/i, '<title>Talos — automação de processos para quem toca a empresa</title>')
           .replace(/<meta content="[^"]*" name="description">/i,
             '<meta content="Construímos sistemas que eliminam trabalho manual, cortam custo e devolvem horas para a sua operação." name="description">');

// 7b. âncora interna não abre em aba nova
html = html.replace(/href="#contato" target="_blank"/g, 'href="#contato"');

// 7c. selo "Made in Webflow": é injetado pelo webflow.js em runtime, não está no HTML.
// Some por CSS. Não é burlar licença — o export oficial do Webflow também não traz o selo;
// ele existe para o domínio .webflow.io, e este site é auto-hospedado. O crédito do AUTOR do
// template (NinhStudio) continua no rodapé, que é o que de fato se deve manter.
html = html.replace(/<\/head>/i, `  <style>.w-webflow-badge{display:none!important}</style>\n</head>`);

fs.writeFileSync(path.join(OUT, 'index.html'), html);

// licença: mesma tradução, mesma localização de asset
let lic = fs.readFileSync(path.join(REF, 'pages', 'license', 'page.html'), 'utf8');
lic = lic.replace(/<link[^>]*rel="stylesheet"[^>]*>/gi, '').replace(/<link[^>]*rel="preconnect"[^>]*>/gi, '')
         .replace(/<\/head>/i, '  <link rel="stylesheet" href="styles.css">\n</head>')
         .replace(/<script[^>]*src="([^"]+)"[^>]*><\/script>/gi, (f, s) => {
           const n = decodeURIComponent(s.split('?')[0].split('/').pop());
           return jsLocais.has(n) ? `<script src="assets/js/${n}"></script>` : (/cloudflare/.test(s) ? '' : f);
         })
         .replace(/\ssrcset="[^"]*"/gi, '')
         .replace(/src="([^"]+)"/gi, (f, raw) => {
           if (/^(data:|assets\/)/i.test(raw)) return f;
           const b = decodeURIComponent(raw.split('?')[0]).split('/').pop();
           const hit = imgsLocais.has(b) ? b : [...imgsLocais].find(x => x.endsWith('_' + b));
           return hit ? `src="assets/img/${hit}"` : f;
         })
         .replace(/href="\/"/g, 'href="index.html"');
for (const [de, para] of COPY.texto) lic = lic.replace(new RegExp(esc(de), 'g'), para);
fs.writeFileSync(path.join(OUT, 'licenca.html'), lic);

// ── relatório ────────────────────────────────────────────────────────────────
const aplicadas = rel.textoAplicado.reduce((s, [, n]) => s + n, 0);
console.log(`arquivos copiados......... ${rel.copiados}`);
console.log(`html...................... ${Math.round(tamanhoOriginal / 1024)} KB → ${Math.round(html.length / 1024)} KB`);
console.log(`seções removidas.......... ${rel.secoesRemovidas.filter(s => s.ok).length}/${rel.secoesRemovidas.length}`);
for (const s of rel.secoesRemovidas) console.log(`   ${s.ok ? '✓' : '✗ NÃO ACHOU'} ${s.id}`);
console.log(`trocas de texto........... ${aplicadas} ocorrências, ${rel.textoAplicado.length}/${COPY.texto.length} pares casaram`);
if (rel.textoPerdido.length) { console.log(`⚠ pares que não casaram (${rel.textoPerdido.length}):`); rel.textoPerdido.forEach(t => console.log(`   · ${t}`)); }
if (rel.imgPerdida.size) console.log(`⚠ imagens não localizadas: ${[...rel.imgPerdida].slice(0, 6).join(', ')}`);
const ingles = (html.match(/\b(the|your|our|we|and|for|with|business|automation)\b/gi) || []).length;
console.log(`resíduo de inglês no html. ${ingles} ocorrências de palavras comuns (conferir na tela)`);
console.log(`\n→ ${OUT}`);
