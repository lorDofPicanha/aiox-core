const path = require('path');
const puppeteer = require('puppeteer-core');

const root = __dirname;
const url = `file:///${path.join(root, 'index.html').replace(/\\/g, '/')}`;
const browserPath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: browserPath, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  for (const [name, width, height] of [['desktop-capture', 1440, 900], ['mobile-capture', 390, 844]]) {
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(root, `${name}.png`), fullPage: true });
  }
  await browser.close();
})();
