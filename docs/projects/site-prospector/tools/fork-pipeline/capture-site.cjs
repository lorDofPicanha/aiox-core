#!/usr/bin/env node
/**
 * capture-site.cjs — captura um SITE INTEIRO (não só a home) para fork fiel.
 * Uso: node capture-site.cjs <origin> <outDir>
 * Descobre links internos a partir da home e captura cada página.
 * Assets (css/fontes/imagens) são compartilhados no nível do site; HTML e intel são por página.
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ORIGIN = process.argv[2];
const OUT = process.argv[3];
const MAX_PAGES = +(process.argv[4] || 12);
if (!ORIGIN || !OUT) { console.error('uso: node capture-site.cjs <origin> <outDir> [maxPages]'); process.exit(1); }

const slugOf = (p) => (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '__')) || 'home';
const safeName = (u) => {
  try {
    const x = new global.URL(u, ORIGIN);
    let n = (x.pathname.split('/').pop() || 'asset').split('?')[0];
    // /_next/image?url=%2Fimages%2Fcherry.webp → cherry.webp  (evita colisão de nome)
    const q = x.searchParams.get('url');
    if (q) n = decodeURIComponent(q).split('/').pop();
    return (n || 'asset').replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120);
  } catch { return 'asset_' + Math.random().toString(36).slice(2, 8); }
};

(async () => {
  fs.mkdirSync(path.join(OUT, 'assets/fonts'), { recursive: true });
  fs.mkdirSync(path.join(OUT, 'assets/img'), { recursive: true });
  fs.mkdirSync(path.join(OUT, 'pages'), { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox', '--disable-dev-shm-usage'],
    defaultViewport: { width: 1440, height: 900 },
  });
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
  await page.evaluateOnNewDocument(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));

  const cssSeen = new Set(), cssChunks = [];
  const manifest = { css: [], fonts: [], images: [] };
  const savedAssets = new Set();

  page.on('response', async (res) => {
    try {
      const url = res.url(); const ct = (res.headers()['content-type'] || '').toLowerCase();
      if (res.status() >= 400 || url.startsWith('data:')) return;
      if (ct.includes('text/css') || /\.css(\?|$)/.test(url)) {
        if (cssSeen.has(url)) return; cssSeen.add(url);
        const body = await res.text();
        cssChunks.push(`\n/* ===== ${url} (${body.length} bytes) ===== */\n${body}`);
        manifest.css.push({ url, bytes: body.length });
      } else if (ct.includes('font') || /\.(woff2?|ttf|otf)(\?|$)/i.test(url)) {
        const n = safeName(url); if (savedAssets.has('f' + n)) return; savedAssets.add('f' + n);
        const buf = await res.buffer();
        fs.writeFileSync(path.join(OUT, 'assets/fonts', n), buf);
        manifest.fonts.push({ url, file: `assets/fonts/${n}` });
      } else if (ct.startsWith('image/') || /\.(png|jpe?g|webp|avif|svg|gif)(\?|$)/i.test(url)) {
        const n = safeName(url); if (savedAssets.has('i' + n)) return; savedAssets.add('i' + n);
        const buf = await res.buffer();
        fs.writeFileSync(path.join(OUT, 'assets/img', n), buf);
        manifest.images.push({ url, file: `assets/img/${n}` });
      }
    } catch {}
  });

  const visit = async (p) => {
    const url = new global.URL(p, ORIGIN).href;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
    for (let i = 0; i < 20; i++) {
      if (!/checkpoint|just a moment|attention required/i.test(await page.title().catch(() => ''))) break;
      await new Promise(r => setTimeout(r, 3000));
    }
    // percorre p/ disparar lazy-load e ScrollTrigger
    await page.evaluate(async () => {
      const H = document.body.scrollHeight;
      for (let y = 0; y < H; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); }
      window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 700));
    });
    await new Promise(r => setTimeout(r, 2200));
    return page.content();
  };

  // 1) home + descoberta de links
  console.log('→ home');
  let html = await visit('/');
  const links = [...new Set([...html.matchAll(/href="(\/[^"#?]*)"/g)].map(m => m[1]))]
    .filter(u => !/^\/_next|\.(png|jpe?g|svg|ico|webp|css|js|xml|txt|pdf|webmanifest|zip|mp4|json)$/i.test(u))
    .filter(u => u !== '/');
  const paths = ['/', ...links].slice(0, MAX_PAGES);
  console.log('   páginas:', paths.join(' '));

  const index = [];
  for (const p of paths) {
    const slug = slugOf(p);
    const dir = path.join(OUT, 'pages', slug);
    fs.mkdirSync(dir, { recursive: true });
    if (p !== '/') { console.log('→', p); html = await visit(p); }

    fs.writeFileSync(path.join(dir, 'page.html'), html);

    const intel = await page.evaluate(() => {
      const cs = el => getComputedStyle(el);
      const sections = [];
      const walk = (el, d) => {
        for (const c of Array.from(el.children)) {
          if (c.offsetHeight < 120) continue;
          const tag = c.tagName.toLowerCase();
          if (['section', 'header', 'footer', 'main', 'nav', 'div'].includes(tag)) {
            sections.push({ depth: d, tag, class: (c.className || '').toString().slice(0, 200), h: Math.round(c.getBoundingClientRect().height), text: (c.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 90) });
            if (d < 2) walk(c, d + 1);
          }
        }
      };
      walk(document.body, 0);
      return {
        url: location.href, title: document.title,
        documentHeight: document.body.scrollHeight,
        bodyBg: cs(document.body).backgroundColor,
        sections,
        headings: Array.from(document.querySelectorAll('h1,h2,h3')).map(e => ({ tag: e.tagName, size: cs(e).fontSize, text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80) })),
        copy: Array.from(document.querySelectorAll('h1,h2,h3,p,button,a,li')).map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(t => t.length > 2).slice(0, 260),
        imgs: Array.from(document.querySelectorAll('img')).map(e => ({ src: e.currentSrc || e.src, alt: e.alt })),
      };
    });
    fs.writeFileSync(path.join(dir, 'intel.json'), JSON.stringify(intel, null, 2));

    // baseline de pixel: 3 frames desktop + 2 mobile por página
    fs.mkdirSync(path.join(dir, 'screens'), { recursive: true });
    for (const [w, h, label, n] of [[1440, 900, 'desktop', 3], [375, 812, 'mobile', 2]]) {
      await page.setViewport({ width: w, height: h });
      await new Promise(r => setTimeout(r, 800));
      for (let i = 0; i < n; i++) {
        await page.evaluate(y => window.scrollTo(0, y), i * h);
        await new Promise(r => setTimeout(r, 500));
        await page.screenshot({ path: path.join(dir, 'screens', `${label}-${i}.png`) });
      }
      await page.evaluate(() => window.scrollTo(0, 0));
    }
    await page.setViewport({ width: 1440, height: 900 });

    index.push({ path: p, slug, title: intel.title, height: intel.documentHeight, sections: intel.sections.length, imgs: intel.imgs.length, bytes: html.length });
    console.log(`   ✓ ${slug.padEnd(28)} ${String(intel.documentHeight).padStart(6)}px  ${String(intel.sections.length).padStart(3)} seções  ${String(intel.imgs.length).padStart(3)} imgs`);
  }

  fs.writeFileSync(path.join(OUT, 'css-collected.css'), cssChunks.join('\n'));
  fs.writeFileSync(path.join(OUT, 'asset-manifest.json'), JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(OUT, 'site-index.json'), JSON.stringify({ origin: ORIGIN, capturedAt: new Date().toISOString(), pages: index }, null, 2));

  await browser.close();
  console.log(`\n✅ ${index.length} páginas · css ${(cssChunks.join('').length / 1024).toFixed(0)}KB · ${manifest.images.length} imgs · ${manifest.fonts.length} fontes`);
})().catch(e => { console.error('FALHOU:', e.message); process.exit(1); });
