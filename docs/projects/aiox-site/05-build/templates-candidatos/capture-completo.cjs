// capture-completo.cjs — captura os 4 finalistas do topo ao rodapé, sem buraco.
// Motivo: a captura anterior fazia 5 paradas fixas (~6.000px) e deixava 54,9% do conicorn
// (13.962px) nunca observado. Julgar template por metade da página é o mesmo erro de julgar
// por captura prematura. Aqui o passo é 1 viewport e vai até o fim real da página.
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = path.join(__dirname, 'shots-completo');
const W = 1440, H = 900;
const MAX_FRAMES = 20;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const ALVOS = [
  { id: 'wf-conicorn', demo: 'https://conicorn.webflow.io/' },
  { id: 'fr-agenciy', demo: 'https://agenciy.framer.website/' },
  { id: 'fr-stackgrid', demo: 'https://stackgrid.framer.website/' },
  { id: 'wf-idesignerlite', demo: 'https://idesigner-lite-template.webflow.io/' },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const meta = [];

  for (const a of ALVOS) {
    const page = await browser.newPage();
    try {
      page.setDefaultTimeout(25000);
      await page.setViewport({ width: W, height: H });
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
      await page.goto(a.demo, { waitUntil: 'domcontentloaded', timeout: 35000 });
      await sleep(9000);

      // rola até o fim uma vez para disparar lazy-load, depois volta e captura em passos
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90)); }
      }).catch(() => {});
      await sleep(2500);
      const altura = await page.evaluate(() => { window.scrollTo(0, 0); return document.body.scrollHeight; });
      await sleep(1500);

      const frames = Math.min(MAX_FRAMES, Math.ceil(altura / H));
      // amostra de cor do fundo a cada parada — responde "o corpo é claro ou escuro?"
      const fundos = [];
      for (let i = 0; i < frames; i++) {
        try { await page.evaluate(y => window.scrollTo(0, y), i * H); } catch {}
        await sleep(1300);
        await page.screenshot({ path: path.join(OUT, `${a.id}-${String(i).padStart(2, '0')}.png`) });
        const bg = await page.evaluate(() => {
          const el = document.elementFromPoint(20, 450) || document.body;
          let n = el, c = '';
          while (n && n !== document.documentElement) {
            const v = getComputedStyle(n).backgroundColor;
            if (v && !/rgba?\(0, 0, 0, 0\)|transparent/.test(v)) { c = v; break; }
            n = n.parentElement;
          }
          return c || getComputedStyle(document.body).backgroundColor;
        }).catch(() => '?');
        fundos.push(bg);
      }

      // luminância média das amostras → claro ou escuro, medido e não olhado
      const lum = fundos.map(c => { const m = (c || '').match(/(\d+),\s*(\d+),\s*(\d+)/); if (!m) return null;
        return (0.2126 * +m[1] + 0.7152 * +m[2] + 0.0722 * +m[3]) / 255; }).filter(x => x !== null);
      const media = lum.length ? lum.reduce((s, x) => s + x, 0) / lum.length : null;
      const claros = lum.filter(x => x > 0.5).length;

      console.log(`✓ ${a.id.padEnd(18)} ${altura}px · ${frames} frames · lum média ${media !== null ? media.toFixed(2) : '?'} · ${claros}/${lum.length} paradas CLARAS`);
      meta.push({ ...a, altura, frames, luminanciaMedia: media, paradasClaras: claros, paradasTotal: lum.length, fundos });
    } catch (e) {
      console.log(`✗ ${a.id}: ${e.message.slice(0, 70)}`);
      meta.push({ ...a, erro: e.message.slice(0, 120) });
    } finally { await page.close().catch(() => {}); }
  }

  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'cobertura-completa.json'), JSON.stringify(meta, null, 2));
  console.log('\n→ cobertura-completa.json + shots-completo/');
})();
