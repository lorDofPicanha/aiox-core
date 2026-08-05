const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const out = path.join(__dirname, 'reference');
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: ['--no-sandbox'] });
  for (const [name, width, height] of [['reference-1440.png', 1440, 900], ['reference-375.png', 375, 812]]) {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto('https://buttersand.com/en/', { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 1800));
    await page.screenshot({ path: path.join(out, name), fullPage: true });
    await page.close();
  }
  await browser.close();
  console.log('Reference desktop and mobile captures saved.');
})().catch(error => { console.error(error); process.exit(1); });
