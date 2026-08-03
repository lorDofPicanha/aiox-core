// finalistas-chrome.cjs — o Webflow bloqueia fetch de node (bot). Chrome real resolve.
// Extrai preço + URL de preview das 4 páginas de marketplace e captura cada uma.
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = path.join(__dirname, 'shots-finalistas');
const sleep = ms => new Promise(r => setTimeout(r, ms));

const ALVOS = [
  { id: 'wf-idesignerlite', plataforma: 'webflow-html', url: 'https://webflow.com/templates/html/idesignerlite-portfolio-website-template' },
  { id: 'wf-conicorn',      plataforma: 'webflow-html', url: 'https://webflow.com/templates/html/conicorn-website-template' },
  { id: 'fr-stackgrid',     plataforma: 'framer',       url: 'https://www.framer.com/community/marketplace/templates/stackgrid/' },
  { id: 'fr-agenciy',       plataforma: 'framer',       url: 'https://www.framer.com/community/marketplace/templates/agenciy/' },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  for (const a of ALVOS) {
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto(a.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await sleep(5000);

      const info = await page.evaluate(() => {
        const txt = document.body.innerText;
        // preço: procura $NN ou "Free" perto do topo da página
        const precos = [...txt.matchAll(/\$\s?(\d{1,4})(?:\.\d{2})?/g)].map(m => m[0]);
        const temFree = /(^|\s)Free(\s|$)/m.test(txt.slice(0, 3000));
        const links = [...document.querySelectorAll('a[href]')].map(x => x.href);
        return {
          precos: [...new Set(precos)].slice(0, 6),
          temFree,
          preview: [...new Set(links.filter(h => /\.webflow\.io|\.framer\.website|\.framer\.ai/.test(h)))].slice(0, 4),
          // trechos que falam de entrega do arquivo
          entrega: (txt.match(/.{0,90}(HTML|\.zip|download|source file|static).{0,90}/gi) || []).slice(0, 4),
          titulo: document.title,
        };
      });

      await page.screenshot({ path: path.join(OUT, `${a.id}-marketplace.png`) });
      Object.assign(a, info);
      console.log(`✓ ${a.id.padEnd(18)} preços:${JSON.stringify(info.precos)} free:${info.temFree}`);
      console.log(`   preview: ${info.preview[0] || '—'}`);
    } catch (e) {
      a.erro = e.message.slice(0, 90);
      console.log(`✗ ${a.id}: ${a.erro}`);
    } finally { await page.close().catch(() => {}); }
  }

  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'finalistas.json'), JSON.stringify(ALVOS, null, 2));
  console.log('\n→ finalistas.json + shots-finalistas/');
})();
