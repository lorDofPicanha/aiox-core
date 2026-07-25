// probe.cjs — sonda barata de forkabilidade: mede CSS externo vs inline antes de investir em captura.
// Regra (reference_forkability_test): CSS externo grande = layout CSS-driven = forka.
//                                     CSS externo minúsculo em site complexo = posicionado por JS = não forka.
const puppeteer = require('puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const URLS = process.argv.slice(2);

(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'] });
  console.log('site'.padEnd(34) + 'CSS ext  inline   nós  imgs  altura   veredito');
  for (const url of URLS) {
    const pg = await b.newPage();
    await pg.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
    await pg.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
    let cssBytes = 0;
    pg.on('response', async (r) => {
      try {
        const ct = (r.headers()['content-type'] || '').toLowerCase();
        if (r.status() < 400 && (ct.includes('text/css') || /\.css(\?|$)/.test(r.url()))) cssBytes += (await r.text()).length;
      } catch {}
    });
    try {
      await pg.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise(r => setTimeout(r, 2500));
      const m = await pg.evaluate(() => ({
        inline: [...document.querySelectorAll('style')].reduce((a, s) => a + s.textContent.length, 0),
        nodes: document.querySelectorAll('*').length,
        imgs: document.querySelectorAll('img').length,
        h: document.body.scrollHeight,
      }));
      const kb = (n) => (n / 1024).toFixed(0) + 'KB';
      const verd = cssBytes > 100000 ? '✅ forka'
        : cssBytes > 30000 ? '🟡 provável, testar'
        : '❌ JS-driven, não forka';
      console.log(url.replace(/^https?:\/\/(www\.)?/, '').slice(0, 33).padEnd(34)
        + kb(cssBytes).padStart(7) + kb(m.inline).padStart(8) + String(m.nodes).padStart(6)
        + String(m.imgs).padStart(6) + String(m.h).padStart(8) + '   ' + verd);
    } catch (e) {
      console.log(url.replace(/^https?:\/\/(www\.)?/, '').slice(0, 33).padEnd(34) + '   ERRO ' + e.message.slice(0, 40));
    }
    await pg.close();
  }
  await b.close();
})();
