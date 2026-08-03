// finalistas-demos.cjs — resolve o preview ao vivo do Webflow (clicando no botão) e captura os 4 a fundo.
// 5 alturas de scroll, não 3 — estes são os finalistas, merecem leitura completa.
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = path.join(__dirname, 'shots-finalistas');
const W = 1440, H = 900;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const WEBFLOW = [
  { id: 'wf-idesignerlite', url: 'https://webflow.com/templates/html/idesignerlite-portfolio-website-template' },
  { id: 'wf-conicorn', url: 'https://webflow.com/templates/html/conicorn-website-template' },
];
const FRAMER = [
  { id: 'fr-stackgrid', demo: 'https://stackgrid.framer.website/' },
  { id: 'fr-agenciy', demo: 'https://agenciy.framer.website/' },
];

async function acharPreviewWebflow(browser, alvo) {
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: W, height: H });
    await page.goto(alvo.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(5000);
    // o botão "Preview in browser" abre o site ao vivo; o href pode estar em <a> ou em data-*
    const href = await page.evaluate(() => {
      const alvos = [...document.querySelectorAll('a,button')];
      const btn = alvos.find(e => /preview in browser/i.test(e.textContent || ''));
      if (btn && btn.href) return btn.href;
      const qualquer = [...document.querySelectorAll('a[href*="webflow.io"]')];
      return qualquer.length ? qualquer[0].href : null;
    });
    return href;
  } finally { await page.close().catch(() => {}); }
}

async function capturar(browser, id, demo) {
  const page = await browser.newPage();
  try {
    page.setDefaultTimeout(20000);
    await page.setViewport({ width: W, height: H });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
    await page.goto(demo, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(9000); // finalista: espera longa, intro animada não pode cortar

    const altura = await page.evaluate(() => document.body.scrollHeight).catch(() => 0);
    const paradas = [0, 1, 2, 3, 4].map(i => Math.round(H * i * 1.5));
    for (const [i, y] of paradas.entries()) {
      if (y > 0) { try { await page.evaluate(v => window.scrollTo(0, v), y); } catch {} await sleep(1800); }
      await page.screenshot({ path: path.join(OUT, `${id}-live-${i}.png`) });
    }
    // sinal de forkabilidade: quanto de CSS é externo vs inline
    const css = await page.evaluate(() => {
      const ext = [...document.querySelectorAll('link[rel=stylesheet]')].length;
      const inline = [...document.querySelectorAll('style')].reduce((s, e) => s + e.textContent.length, 0);
      const libs = [...document.querySelectorAll('script[src]')].map(s => s.src.split('/').pop()).slice(0, 12);
      return { stylesheetsExternos: ext, cssInlineChars: inline, scripts: libs };
    }).catch(() => null);
    console.log(`✓ ${id.padEnd(18)} ${altura}px  css-inline:${css ? css.cssInlineChars : '?'}  ext:${css ? css.stylesheetsExternos : '?'}`);
    return { id, demo, ok: true, altura, css };
  } catch (e) {
    console.log(`✗ ${id.padEnd(18)} ${e.message.slice(0, 60)}`);
    return { id, demo, ok: false, why: e.message.slice(0, 120) };
  } finally { await page.close().catch(() => {}); }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  const res = [];
  for (const a of WEBFLOW) {
    const demo = await acharPreviewWebflow(browser, a);
    console.log(`  ${a.id} → preview: ${demo || 'NÃO ACHEI'}`);
    if (demo) res.push(await capturar(browser, a.id, demo));
    else res.push({ id: a.id, ok: false, why: 'preview não encontrado na página' });
  }
  for (const f of FRAMER) res.push(await capturar(browser, f.id, f.demo));

  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'finalistas-demos.json'), JSON.stringify(res, null, 2));
  console.log('\n→ finalistas-demos.json + shots-finalistas/');
})();
