#!/usr/bin/env node
/**
 * capture.cjs — captura fiel de uma referência web (DOM renderizado + CSS + assets + geometria).
 * Uso: node capture.cjs <url> <outDir>
 * Produz a mesma família de artefatos que o pipeline design-md já gerou para Magnolia.
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = process.argv[2];
const OUT = process.argv[3];

if (!URL || !OUT) { console.error('uso: node capture.cjs <url> <outDir>'); process.exit(1); }

const dir = (...p) => { const d = path.join(OUT, ...p); fs.mkdirSync(d, { recursive: true }); return d; };
const write = (f, c) => fs.writeFileSync(path.join(OUT, f), c);
const J = (f, o) => write(f, JSON.stringify(o, null, 2));

const safeName = (u) => {
  try {
    const x = new global.URL(u);
    let n = (x.pathname.split('/').pop() || 'index').split('?')[0];
    if (!n) n = 'asset';
    return n.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120);
  } catch { return 'asset_' + Math.random().toString(36).slice(2, 8); }
};

(async () => {
  dir(); dir('assets'); dir('assets/fonts'); dir('assets/img'); dir('screens');

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1440,900',
    ],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  );
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  // ---- interceptar TODAS as respostas: css, fontes, imagens, js ----
  const cssChunks = [];
  const manifest = { css: [], fonts: [], images: [], scripts: [] };

  page.on('response', async (res) => {
    try {
      const url = res.url();
      const ct = (res.headers()['content-type'] || '').toLowerCase();
      const status = res.status();
      if (status >= 400 || url.startsWith('data:')) return;

      if (ct.includes('text/css') || /\.css(\?|$)/.test(url)) {
        const body = await res.text();
        cssChunks.push(`\n/* ===== ${url} (${body.length} bytes) ===== */\n${body}`);
        manifest.css.push({ url, bytes: body.length });
      } else if (ct.includes('font') || /\.(woff2?|ttf|otf|eot)(\?|$)/i.test(url)) {
        const buf = await res.buffer();
        const n = safeName(url);
        fs.writeFileSync(path.join(OUT, 'assets/fonts', n), buf);
        manifest.fonts.push({ url, file: `assets/fonts/${n}`, bytes: buf.length });
      } else if (ct.startsWith('image/') || /\.(png|jpe?g|webp|avif|svg|gif)(\?|$)/i.test(url)) {
        const buf = await res.buffer();
        const n = safeName(url);
        fs.writeFileSync(path.join(OUT, 'assets/img', n), buf);
        manifest.images.push({ url, file: `assets/img/${n}`, bytes: buf.length });
      } else if (ct.includes('javascript')) {
        manifest.scripts.push({ url, bytes: (await res.text()).length });
      }
    } catch { /* respostas já descartadas — ignora */ }
  });

  console.log('→ navegando…');
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 90000 });

  // ---- esperar o Vercel Security Checkpoint liberar ----
  for (let i = 0; i < 20; i++) {
    const t = await page.title().catch(() => '');
    if (!/checkpoint|just a moment|attention required/i.test(t)) break;
    console.log(`   checkpoint ativo ("${t}") — aguardando… ${i + 1}`);
    await new Promise((r) => setTimeout(r, 3000));
  }
  const finalTitle = await page.title();
  console.log('   título:', finalTitle);

  // ---- scroll completo p/ disparar lazy-load / ScrollTrigger ----
  console.log('→ percorrendo a página…');
  await page.evaluate(async () => {
    const H = document.body.scrollHeight;
    for (let y = 0; y < H; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 800));
  });
  await new Promise((r) => setTimeout(r, 2500));

  // ---- DOM renderizado ----
  const html = await page.content();
  write('page.html', html);
  console.log('   page.html', html.length, 'bytes');

  // ---- CSS via cssRules (same-origin/CORS) como complemento ----
  const inlineCss = await page.evaluate(() => {
    let out = '';
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        const rules = sheet.cssRules;
        if (!rules) continue;
        out += `\n/* ===== [cssRules] ${sheet.href || 'inline <style>'} ===== */\n`;
        for (const r of Array.from(rules)) out += r.cssText + '\n';
      } catch { out += `\n/* ===== [bloqueado CORS] ${sheet.href} ===== */\n`; }
    }
    return out;
  });
  write('css-collected.css', cssChunks.join('\n') + '\n' + inlineCss);

  // ---- geometria / tokens reais ----
  const intel = await page.evaluate(() => {
    const cs = (el) => getComputedStyle(el);
    const rect = (el) => { const r = el.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x) }; };

    // sequência de seções de topo
    const rootKids = Array.from(document.body.children).filter((e) => e.offsetHeight > 40);
    const sections = [];
    const walk = (el, depth) => {
      for (const c of Array.from(el.children)) {
        if (c.offsetHeight < 120) continue;
        const tag = c.tagName.toLowerCase();
        if (['section', 'header', 'footer', 'main', 'nav', 'div'].includes(tag)) {
          sections.push({
            depth, tag,
            class: (c.className || '').toString().slice(0, 240),
            id: c.id || null,
            ...rect(c),
            bg: cs(c).backgroundColor,
            text: (c.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 110),
          });
          if (depth < 2) walk(c, depth + 1);
        }
      }
    };
    walk(document.body, 0);

    // escala tipográfica real
    const type = Array.from(document.querySelectorAll('h1,h2,h3,h4,p,a,button,li,span'))
      .filter((e) => e.offsetHeight > 0 && (e.innerText || '').trim().length > 1)
      .slice(0, 400)
      .map((e) => {
        const s = cs(e);
        return {
          tag: e.tagName.toLowerCase(),
          class: (e.className || '').toString().slice(0, 120),
          fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight,
          lineHeight: s.lineHeight, letterSpacing: s.letterSpacing,
          textTransform: s.textTransform, color: s.color,
          text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 60),
        };
      });

    // agregados
    const tally = (arr) => Object.entries(arr.reduce((a, v) => (a[v] = (a[v] || 0) + 1, a), {})).sort((a, b) => b[1] - a[1]);
    const all = Array.from(document.querySelectorAll('*')).slice(0, 6000);
    const colors = tally(all.map((e) => cs(e).color));
    const bgs = tally(all.map((e) => cs(e).backgroundColor).filter((c) => c !== 'rgba(0, 0, 0, 0)'));
    const families = tally(all.map((e) => cs(e).fontFamily));
    const sizes = tally(all.map((e) => cs(e).fontSize));
    const radii = tally(all.map((e) => cs(e).borderRadius).filter((r) => r !== '0px'));

    // @font-face reais
    const fontFaces = [];
    for (const sheet of Array.from(document.styleSheets)) {
      try { for (const r of Array.from(sheet.cssRules || [])) if (r.constructor.name === 'CSSFontFaceRule') fontFaces.push(r.cssText); } catch {}
    }

    // container: maior bloco e seus limites
    const bodyW = document.body.getBoundingClientRect().width;
    const containers = Array.from(document.querySelectorAll('div,section,main'))
      .filter((e) => e.offsetHeight > 200)
      .map((e) => ({ class: (e.className || '').toString().slice(0, 120), w: Math.round(e.getBoundingClientRect().width), maxW: cs(e).maxWidth, padL: cs(e).paddingLeft, display: cs(e).display, gtc: cs(e).gridTemplateColumns, gap: cs(e).gap }))
      .filter((e) => e.w > 300);

    // motion / libs
    const libs = {
      gsap: !!window.gsap, ScrollTrigger: !!(window.ScrollTrigger || (window.gsap && window.gsap.plugins && window.gsap.plugins.ScrollTrigger)),
      lenis: !!window.Lenis, locomotive: !!window.LocomotiveScroll, three: !!window.THREE,
      swiper: !!window.Swiper, framer: !!window.Motion, alpine: !!window.Alpine,
      astro: !!document.querySelector('[data-astro-cid], astro-island'),
      tailwind: /(^|\s)(flex|grid|w-\[|h-dvh|text-\[|px-\d)/.test(document.body.className + ' ' + Array.from(document.querySelectorAll('div')).slice(0, 60).map((e) => e.className).join(' ')),
    };

    return {
      url: location.href, title: document.title,
      viewport: { w: innerWidth, h: innerHeight },
      documentHeight: document.body.scrollHeight,
      bodyWidth: Math.round(bodyW),
      bodyBg: cs(document.body).backgroundColor,
      sections, type, fontFaces, containers, libs,
      tallies: { colors: colors.slice(0, 25), backgrounds: bgs.slice(0, 25), families: families.slice(0, 15), sizes: sizes.slice(0, 30), radii: radii.slice(0, 15) },
      headings: Array.from(document.querySelectorAll('h1,h2,h3')).map((e) => ({ tag: e.tagName, size: cs(e).fontSize, family: cs(e).fontFamily, text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80) })),
      images: Array.from(document.querySelectorAll('img')).map((e) => ({ src: e.currentSrc || e.src, alt: e.alt, w: e.naturalWidth, h: e.naturalHeight, cls: (e.className || '').toString().slice(0, 100) })),
      copy: Array.from(document.querySelectorAll('h1,h2,h3,p,button,a')).map((e) => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter((t) => t.length > 2).slice(0, 200),
    };
  });

  J('component-properties.json', intel);
  J('container.json', { bodyWidth: intel.bodyWidth, bodyBg: intel.bodyBg, documentHeight: intel.documentHeight, containers: intel.containers.slice(0, 60) });
  J('font-faces.json', intel.fontFaces);
  J('stack.json', intel.libs);
  J('tokens-detected.json', intel.tallies);
  J('section-sequence.json', intel.sections);
  J('page-copy.json', intel.copy);

  // ---- screenshots por passo (baseline de pixel) ----
  const shoot = async (w, h, label) => {
    await page.setViewport({ width: w, height: h });
    await new Promise((r) => setTimeout(r, 1200));
    const H = await page.evaluate(() => document.body.scrollHeight);
    const steps = Math.min(14, Math.ceil(H / h));
    for (let i = 0; i < steps; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), i * h);
      await new Promise((r) => setTimeout(r, 700));
      await page.screenshot({ path: path.join(OUT, 'screens', `${label}-${String(i).padStart(2, '0')}.png`) });
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    return { label, viewport: `${w}x${h}`, documentHeight: H, steps };
  };

  console.log('→ screenshots 1440…');
  const s1440 = await shoot(1440, 900, 'desktop-1440');
  console.log('→ screenshots 375…');
  const s375 = await shoot(375, 812, 'mobile-375');
  J('screens/manifest.json', { s1440, s375 });

  // ---- breakpoints via media queries do CSS coletado ----
  const css = fs.readFileSync(path.join(OUT, 'css-collected.css'), 'utf8');
  const mq = [...css.matchAll(/@media[^{]*?\((?:min|max)-width:\s*([\d.]+)px\)/g)].map((m) => +m[1]);
  const bpTally = Object.entries(mq.reduce((a, v) => (a[v] = (a[v] || 0) + 1, a), {})).sort((a, b) => b[1] - a[1]).slice(0, 20);
  J('breakpoints.json', bpTally);

  J('asset-manifest.json', manifest);
  J('capture-meta.json', {
    url: URL, capturedAt: new Date().toISOString(), title: finalTitle,
    pageHtmlBytes: html.length, cssBytes: css.length,
    counts: { css: manifest.css.length, fonts: manifest.fonts.length, images: manifest.images.length, scripts: manifest.scripts.length },
    method: 'puppeteer-core + Chrome real (headless), DOM pós-scroll completo',
  });

  await browser.close();
  console.log('\n✅ capturado em', OUT);
  console.log('   css', manifest.css.length, '| fonts', manifest.fonts.length, '| imgs', manifest.images.length, '| altura', intel.documentHeight);
})().catch((e) => { console.error('FALHOU:', e.message); process.exit(1); });
