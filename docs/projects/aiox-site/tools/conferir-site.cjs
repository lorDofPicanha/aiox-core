/**
 * Confere o talos-site num Chrome de verdade: erros de console, requisicoes que falham,
 * selo da Webflow, e capturas por viewport (nunca fullPage — lenis/ScrollTrigger mentem).
 */
const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const RAIZ = 'D:/AIOS/docs/projects/aiox-site/05-build/talos-site';
const OUT = process.argv[2] || 'C:/Users/kingp/AppData/Local/Temp/claude/D--AIOS/a58e9b3c-a664-440a-8e3f-c713f47fa1fb/scratchpad/shots';
const PORTA = 8712;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};

const servidor = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.resolve(RAIZ, '.' + p);
  if (!f.startsWith(path.resolve(RAIZ)) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    res.writeHead(404); return res.end('404');
  }
  // no-store obrigatorio: servidor com cache ja fez reprovar coisa corrigida em disco
  res.writeHead(200, {
    'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  fs.createReadStream(f).pipe(res);
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await new Promise((r) => servidor.listen(PORTA, r));
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'],
  });

  const relatorio = {};

  for (const [nome, url, vp] of [
    ['desktop', `http://localhost:${PORTA}/index.html`, { width: 1440, height: 900 }],
    ['mobile', `http://localhost:${PORTA}/index.html`, { width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 }],
    ['licenca', `http://localhost:${PORTA}/licenca.html`, { width: 1440, height: 900 }],
  ]) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    const erros = [], falhas = [];
    page.on('console', (m) => { if (m.type() === 'error') erros.push(m.text().slice(0, 200)); });
    page.on('pageerror', (e) => erros.push('PAGEERROR: ' + String(e).slice(0, 200)));
    page.on('requestfailed', (r) => falhas.push(`${r.failure()?.errorText} ${r.url().slice(0, 120)}`));
    page.on('response', (r) => { if (r.status() >= 400) falhas.push(`HTTP ${r.status()} ${r.url().slice(0, 120)}`); });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await sleep(9000); // intro animada: 4s nao basta

    const diag = await page.evaluate(() => {
      const vis = (el) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && +s.opacity > 0.01;
      };
      return {
        titulo: document.title,
        selo_webflow: document.querySelectorAll('.w-webflow-badge').length,
        texto_visivel: document.body.innerText.replace(/\s+/g, ' ').trim().length,
        altura: document.documentElement.scrollHeight,
        h1: [...document.querySelectorAll('h1')].map((e) => [e.innerText.trim().slice(0, 70), vis(e)]),
        secoes: [...document.querySelectorAll('section[id]')].map((e) => [e.id, vis(e)]),
        invisiveis: [...document.querySelectorAll('h1,h2,h3')].filter((e) => e.innerText.trim() && !vis(e)).map((e) => e.innerText.trim().slice(0, 50)),
        videos: [...document.querySelectorAll('video')].map((v) => ({ src: (v.currentSrc || '').split('/').pop(), pronto: v.readyState })),
        form_acao: (() => { const f = document.querySelector('form'); return f ? { action: f.getAttribute('action'), method: f.method, wf: f.getAttribute('data-wf-page-id') } : null; })(),
      };
    });

    // capturas por viewport
    const alt = diag.altura;
    const passos = Math.min(8, Math.ceil(alt / vp.height));
    for (let i = 0; i < passos; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), i * vp.height);
      await sleep(1400);
      await page.screenshot({ path: path.join(OUT, `${nome}-${String(i).padStart(2, '0')}.png`) });
    }
    relatorio[nome] = { diag, erros: [...new Set(erros)], falhas: [...new Set(falhas)] };
    await page.close();
  }

  await browser.close();
  servidor.close();
  fs.writeFileSync(path.join(OUT, 'relatorio.json'), JSON.stringify(relatorio, null, 2));

  for (const [k, v] of Object.entries(relatorio)) {
    console.log(`\n##### ${k}`);
    console.log(`  titulo: ${v.diag.titulo}`);
    console.log(`  SELO WEBFLOW: ${v.diag.selo_webflow}`);
    console.log(`  texto visivel: ${v.diag.texto_visivel} chars | altura: ${v.diag.altura}px`);
    console.log(`  h1: ${JSON.stringify(v.diag.h1)}`);
    console.log(`  secoes visiveis: ${v.diag.secoes.filter((s) => s[1]).length}/${v.diag.secoes.length}`);
    const esc = v.diag.secoes.filter((s) => !s[1]);
    if (esc.length) console.log(`  SECOES INVISIVEIS: ${JSON.stringify(esc)}`);
    if (v.diag.invisiveis.length) console.log(`  TITULOS INVISIVEIS: ${JSON.stringify(v.diag.invisiveis)}`);
    console.log(`  videos: ${JSON.stringify(v.diag.videos)}`);
    console.log(`  form: ${JSON.stringify(v.diag.form_acao)}`);
    console.log(`  erros console: ${v.erros.length}`); v.erros.forEach((e) => console.log(`     ${e}`));
    console.log(`  requisicoes falhas: ${v.falhas.length}`); v.falhas.forEach((e) => console.log(`     ${e}`));
  }
  console.log(`\ncapturas em ${OUT}`);
})().catch((e) => { console.error('ERRO', e); process.exit(1); });
