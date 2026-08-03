// find-idesigner.cjs — o botão "Preview in browser" do Webflow abre por JS; o href não sai no DOM inicial.
const puppeteer = require('puppeteer-core');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'https://webflow.com/templates/html/idesignerlite-portfolio-website-template';

(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 6000));

  const links = await p.evaluate(() =>
    [...document.querySelectorAll('a[href]')]
      .map(a => ({ t: (a.innerText || '').trim().slice(0, 34), h: a.href }))
      .filter(x => /preview|webflow\.io/i.test(x.t + x.h))
      .slice(0, 20));
  console.log('LINKS:', JSON.stringify(links, null, 1));

  const iframes = await p.evaluate(() => [...document.querySelectorAll('iframe')].map(f => f.src).slice(0, 8));
  console.log('IFRAMES:', JSON.stringify(iframes, null, 1));

  // último recurso: clicar e ver que aba abre
  try {
    const alvo = await p.evaluateHandle(() =>
      [...document.querySelectorAll('a,button')].find(e => /preview in browser/i.test(e.textContent || '')));
    if (alvo) {
      const antes = (await b.pages()).length;
      await alvo.asElement()?.click();
      await new Promise(r => setTimeout(r, 5000));
      const pages = await b.pages();
      console.log('ABAS:', pages.length, 'antes:', antes);
      for (const pg of pages) console.log('  →', pg.url().slice(0, 120));
    }
  } catch (e) { console.log('clique falhou:', e.message.slice(0, 70)); }

  await b.close();
})();
