// shoot-urls.cjs v2 — captura cada template candidato em 3 alturas de scroll (1440x900)
//
// Duas correções sobre a v1, que travou:
//   1. `networkidle2` NUNCA estabiliza em site do Framer (analytics/streaming ficam abertos).
//      Trocado por `domcontentloaded` + espera fixa.
//   2. Timeout rígido por site via Promise.race — um site travado não pode segurar a fila inteira.
// Protocolo mantido: viewport, nunca fullPage (fullPage mente em site com smooth-scroll).
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = path.join(__dirname, 'shots');
const LOG = path.join(__dirname, 'progresso.log');
const W = 1440, H = 900;
const TETO_POR_SITE = 40000; // ms — depois disso o site é abandonado, não trava a fila

const log = m => { process.stdout.write(m + '\n'); fs.appendFileSync(LOG, m + '\n'); };
const sleep = ms => new Promise(r => setTimeout(r, ms));

const urls = JSON.parse(fs.readFileSync(path.join(__dirname, 'urls.json'), 'utf8'))
  .filter(u => u.ok)
  .map(u => ({ id: u.slug, url: u.demo, kind: 'framer' }));

// régua + candidatos de código, para comparar lado a lado
urls.unshift({ id: '00-REGUA-leanware', url: 'https://leanware.co/', kind: 'referencia' });
urls.push(
  { id: 'code-screwfast', url: 'https://screwfast.uk/', kind: 'codigo' },
  { id: 'code-magicui-startup', url: 'https://startup-template-sage.vercel.app/', kind: 'codigo' },
);

async function capturar(browser, { id, url }) {
  const page = await browser.newPage();
  try {
    page.setDefaultTimeout(15000);
    await page.setViewport({ width: W, height: H });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await sleep(4000); // entrada/hero terminam de animar

    let altura = 0;
    try { altura = await page.evaluate(() => document.body.scrollHeight); } catch {}

    for (const [i, y] of [0, Math.round(H * 1.6), Math.round(H * 3.2)].entries()) {
      if (y > 0) {
        try { await page.evaluate(v => window.scrollTo(0, v), y); } catch {}
        await sleep(1400); // scroll-reveal precisa de tempo para disparar
      }
      await page.screenshot({ path: path.join(OUT, `${id}-${i}.png`) });
    }
    return { id, url, ok: true, altura };
  } finally {
    await page.close().catch(() => {});
  }
}

async function comTeto(browser, alvo) {
  let t;
  const estouro = new Promise((_, rej) => { t = setTimeout(() => rej(new Error(`teto de ${TETO_POR_SITE / 1000}s`)), TETO_POR_SITE); });
  try {
    const r = await Promise.race([capturar(browser, alvo), estouro]);
    log(`✓ ${alvo.id.padEnd(24)} ${r.altura}px`);
    return r;
  } catch (e) {
    log(`✗ ${alvo.id.padEnd(24)} ${e.message.slice(0, 60)}`);
    return { id: alvo.id, url: alvo.url, ok: false, why: e.message.slice(0, 120) };
  } finally { clearTimeout(t); }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(LOG, `captura iniciada ${new Date().toLocaleString('pt-BR')}\n`);
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-background-timer-throttling'],
  });

  const results = [];
  const POOL = 2; // 3 saturava a máquina e a thread principal engasgava
  for (let i = 0; i < urls.length; i += POOL) {
    results.push(...await Promise.all(urls.slice(i, i + POOL).map(u => comTeto(browser, u))));
    fs.writeFileSync(path.join(__dirname, 'shots.json'),
      JSON.stringify(urls.map(u => ({ ...u, ...results.find(r => r.id === u.id) })), null, 2));
  }

  await browser.close();
  log(`\n${results.filter(r => r.ok).length}/${urls.length} capturados → shots/`);
})().catch(e => { log('FALHOU: ' + e.message); process.exit(1); });
