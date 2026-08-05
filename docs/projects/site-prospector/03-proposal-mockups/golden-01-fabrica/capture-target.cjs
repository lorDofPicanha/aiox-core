const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const out = path.join(__dirname, 'target');
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: ['--no-sandbox'] });
  for (const [name, width, height] of [['mockup-1440.png', 1440, 900], ['mockup-375.png', 375, 812]]) {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto(`file://${path.join(__dirname, 'index.html').replace(/\\/g, '/')}`, { waitUntil: 'load' });
    await page.screenshot({ path: path.join(out, name), fullPage: true });
    await page.close();
  }
  await browser.close();
  console.log('Target desktop and mobile captures saved.');
})().catch(error => { console.error(error); process.exit(1); });
