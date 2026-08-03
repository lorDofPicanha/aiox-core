const puppeteer = require('puppeteer-core');
const CHROME = 'C:\Program Files\Google\Chrome\Application\chrome.exe';
(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  const vistos = new Set();
  p.on('response', r => { const u = r.url(); if (/webflow\.io/.test(u)) vistos.add(new URL(u).origin); });
  await p.goto('https://webflow.com/templates/html/idesignerlite-portfolio-website-template', { waitUntil: 'networkidle2', timeout: 60000 }).catch(()=>{});
  await new Promise(r => setTimeout(r, 12000));
  console.log('IFRAME SRC:', JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('iframe')].map(f => f.src))));
  console.log('ORIGENS webflow.io vistas na rede:', [...vistos]);
  await b.close();
})();
