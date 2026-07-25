// resolve-refs.cjs — descobre o domínio VIVO de cada referência a partir da página do Awwwards
const puppeteer = require('puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const SLUGS = process.argv.slice(2);

(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'] });
  const pg = await b.newPage();
  await pg.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
  for (const s of SLUGS) {
    try {
      await pg.goto(`https://www.awwwards.com/sites/${s}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await new Promise(r => setTimeout(r, 2500));
      const found = await pg.evaluate(() => {
        const out = new Set();
        for (const a of document.querySelectorAll('a[href]')) {
          const h = a.href;
          if (!/^https?:/.test(h)) continue;
          if (/awwwards|google|facebook|twitter|x\.com|instagram|linkedin|youtube|pinterest|behance|dribbble|vimeo|apple|adobe/i.test(h)) continue;
          const txt = (a.textContent || '').trim().toLowerCase();
          const rel = (a.getAttribute('rel') || '');
          if (/visit|website|site/i.test(txt) || /nofollow|noopener/.test(rel)) out.add(h.split('?')[0]);
        }
        return [...out].slice(0, 6);
      });
      console.log(s.padEnd(30), found.join('  ') || '(nada)');
    } catch (e) { console.log(s.padEnd(30), 'ERRO ' + e.message.slice(0, 50)); }
  }
  await b.close();
})();
