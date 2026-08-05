const path = require('path');
const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto(`file:///${path.join(__dirname, 'index.html').replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(__dirname, `${name}.png`), fullPage: true });
  }
  await browser.close();
})();
