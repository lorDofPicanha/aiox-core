#!/usr/bin/env node
/**
 * shoot-local.cjs — screenshot de um servidor local para comparação A/B contra o baseline
 * das referências capturadas. Complementa shoot.cjs (que dispara em cima de arquivo estático).
 *
 * Uso: node shoot-local.cjs <url> <outDir> <prefixo>
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const URL = process.argv[2] || 'http://localhost:3000';
const OUT = process.argv[3] || './shots';
const PREFIX = process.argv[4] || 'local';

(async () => {
  const b = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
    defaultViewport: { width: 1440, height: 900 },
  });
  const p = await b.newPage();

  let ok = false;
  for (let i = 0; i < 15 && !ok; i++) {
    try {
      await p.goto(URL, { waitUntil: 'networkidle2', timeout: 15000 });
      ok = true;
    } catch {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  if (!ok) {
    console.error('servidor não respondeu em', URL);
    await b.close();
    process.exit(1);
  }

  await new Promise((r) => setTimeout(r, 2500)); // fontes + layout assentarem
  fs.mkdirSync(OUT, { recursive: true });

  await p.screenshot({ path: `${OUT}/${PREFIX}-fold-1440.png` });
  await p.screenshot({ path: `${OUT}/${PREFIX}-full-1440.png`, fullPage: true });

  const h = await p.evaluate(() => document.body.scrollHeight);
  const h1 = await p.evaluate(() => {
    const el = document.querySelector('h1');
    return el ? getComputedStyle(el).fontSize : null;
  });
  const bg = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);

  await p.setViewport({ width: 390, height: 844 });
  await new Promise((r) => setTimeout(r, 1000));
  await p.screenshot({ path: `${OUT}/${PREFIX}-fold-390.png` });

  console.log(JSON.stringify({ url: URL, altura: h, h1, bg }, null, 2));
  await b.close();
})();
