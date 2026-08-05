/**
 * Gera o og:image do talos-site a partir do proprio hero (1200x630),
 * no lugar da arte "Conicorn / Webflow Template" que veio do template.
 */
const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const RAIZ = path.resolve('D:/AIOS/docs/projects/aiox-site/05-build/talos-site');
const DESTINO = path.join(RAIZ, 'assets/img/og-talos.png');
const PORTA = 8713;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};

const servidor = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.resolve(RAIZ, '.' + p);
  if (!f.startsWith(RAIZ) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    res.writeHead(404); return res.end('404');
  }
  res.writeHead(200, {
    'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  fs.createReadStream(f).pipe(res);
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  await new Promise((r) => servidor.listen(PORTA, r));
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
  await page.goto(`http://localhost:${PORTA}/index.html`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await sleep(10000); // intro animada precisa terminar

  // some com a navbar: em card de link ela vira ruido
  await page.evaluate(() => {
    document.querySelectorAll('.navbar, .navbar-wraper, [class*="navbar"]').forEach((e) => {
      if (getComputedStyle(e).position === 'fixed') e.style.display = 'none';
    });
    window.scrollTo(0, 0);
  });
  await sleep(1200);
  await page.screenshot({ path: DESTINO });
  await browser.close();
  servidor.close();
  const kb = (fs.statSync(DESTINO).size / 1024).toFixed(0);
  console.log(`og gerado: ${DESTINO} (${kb} KB, 2400x1260 fisico / 1200x630 logico)`);
})().catch((e) => { console.error('ERRO', e); process.exit(1); });
