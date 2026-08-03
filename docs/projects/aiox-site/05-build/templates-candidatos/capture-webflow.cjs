// capture-webflow.cjs — captura os 2 finalistas Webflow + mede sinal de forkabilidade
// URLs resolvidas: iDesigner Lite por busca (o botão do marketplace abre por JS, href não sai no DOM);
// Conicorn por padrão <slug>.webflow.io, confirmado com HTTP 200 + <title>.
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = path.join(__dirname, 'shots-finalistas');
const W = 1440, H = 900;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const ALVOS = [
  { id: 'wf-idesignerlite', demo: 'https://idesigner-lite-template.webflow.io/' },
  { id: 'wf-conicorn', demo: 'https://conicorn.webflow.io/' },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const res = [];

  for (const a of ALVOS) {
    const page = await browser.newPage();
    try {
      page.setDefaultTimeout(20000);
      await page.setViewport({ width: W, height: H });
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
      await page.goto(a.demo, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await sleep(9000);

      const altura = await page.evaluate(() => document.body.scrollHeight).catch(() => 0);
      for (const [i, y] of [0, 1, 2, 3, 4].map(n => Math.round(H * n * 1.5)).entries()) {
        if (y > 0) { try { await page.evaluate(v => window.scrollTo(0, v), y); } catch {} await sleep(1800); }
        await page.screenshot({ path: path.join(OUT, `${a.id}-live-${i}.png`) });
      }

      const css = await page.evaluate(() => {
        const ext = [...document.querySelectorAll('link[rel=stylesheet]')].map(l => l.href);
        const inline = [...document.querySelectorAll('style')].reduce((s, e) => s + e.textContent.length, 0);
        const scripts = [...document.querySelectorAll('script[src]')].map(s => s.src.split('/').pop());
        return { stylesheetsExternos: ext.length, urlsCss: ext.slice(0, 4), cssInlineChars: inline, scripts: scripts.slice(0, 14) };
      }).catch(() => null);

      // peso real do CSS externo — é o teste de forkabilidade do reference_forkability_test
      let cssBytes = 0;
      if (css) for (const u of css.urlsCss) {
        try { const r = await fetch(u); cssBytes += (await r.text()).length; } catch {}
      }

      console.log(`✓ ${a.id.padEnd(18)} ${altura}px  cssExterno:${Math.round(cssBytes / 1024)}KB (${css.stylesheetsExternos} arq)  inline:${css.cssInlineChars}`);
      console.log(`   scripts: ${css.scripts.join(', ').slice(0, 130)}`);
      res.push({ ...a, ok: true, altura, css, cssExternoKB: Math.round(cssBytes / 1024) });
    } catch (e) {
      console.log(`✗ ${a.id}: ${e.message.slice(0, 70)}`);
      res.push({ ...a, ok: false, why: e.message.slice(0, 120) });
    } finally { await page.close().catch(() => {}); }
  }

  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'finalistas-webflow.json'), JSON.stringify(res, null, 2));
  console.log('\n→ finalistas-webflow.json');
})();
