// shoot.cjs — screenshots do build local, mesmo protocolo da captura da referência
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const FILE = process.argv[2];
const OUT = process.argv[3];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const page = await browser.newPage();
  // headless reporta reduced-motion por padrão → força o caminho COM movimento
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  const errs = [];
  page.on('pageerror', e => errs.push('JS: ' + e.message));
  page.on('requestfailed', r => errs.push('404: ' + r.url().split('/').pop()));

  await page.goto('file:///' + FILE.replace(/\\/g, '/'), { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));

  for (const [w, h, label] of [[1440, 900, 'build-1440'], [375, 812, 'build-375']]) {
    await page.setViewport({ width: w, height: h });
    await new Promise(r => setTimeout(r, 900));
    const H = await page.evaluate(() => document.body.scrollHeight);
    const steps = Math.min(14, Math.ceil(H / h));
    for (let i = 0; i < steps; i++) {
      await page.evaluate(y => window.scrollTo(0, y), i * h);
      await new Promise(r => setTimeout(r, 550));
      await page.screenshot({ path: path.join(OUT, `${label}-${String(i).padStart(2, '0')}.png`) });
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    console.log(`${label}: altura ${H}px, ${steps} frames`);
  }
  console.log(errs.length ? '⚠ ' + [...new Set(errs)].join('\n⚠ ') : '✓ sem erros de JS/asset');
  await browser.close();
})().catch(e => { console.error('FALHOU:', e.message); process.exit(1); });
