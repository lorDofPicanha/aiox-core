// reshoot.cjs — recaptura ids específicos com espera longa
// Motivo: template com animação de entrada demorada capturava em branco com os 4s do shoot-urls.
// Uso: node reshoot.cjs darkfolio villo rauten jorge
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = path.join(__dirname, 'shots');
const W = 1440, H = 900;
const ESPERA = 11000; // 4s não bastava para intro animada

const alvos = process.argv.slice(2);
const todos = JSON.parse(fs.readFileSync(path.join(__dirname, 'shots.json'), 'utf8'));
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-background-timer-throttling'],
  });

  for (const id of alvos) {
    const alvo = todos.find(t => t.id === id);
    if (!alvo) { console.log(`? ${id} não está em shots.json`); continue; }
    const page = await browser.newPage();
    try {
      page.setDefaultTimeout(20000);
      await page.setViewport({ width: W, height: H });
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
      await page.goto(alvo.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await sleep(ESPERA);

      const antes = fs.statSync(path.join(OUT, `${id}-0.png`)).size;
      for (const [i, y] of [0, Math.round(H * 1.6), Math.round(H * 3.2)].entries()) {
        if (y > 0) { try { await page.evaluate(v => window.scrollTo(0, v), y); } catch {} await sleep(1600); }
        await page.screenshot({ path: path.join(OUT, `${id}-${i}.png`) });
      }
      const depois = fs.statSync(path.join(OUT, `${id}-0.png`)).size;
      const d = Math.round((depois - antes) / 1024);
      console.log(`${depois > antes * 1.4 ? '✓ recuperado' : '= igual'} ${id.padEnd(16)} ${Math.round(antes/1024)}KB → ${Math.round(depois/1024)}KB (${d >= 0 ? '+' : ''}${d}KB)`);
    } catch (e) {
      console.log(`✗ ${id.padEnd(16)} ${e.message.slice(0, 50)}`);
    } finally { await page.close().catch(() => {}); }
  }
  await browser.close();
})();
