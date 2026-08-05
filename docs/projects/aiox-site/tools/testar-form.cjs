/**
 * Preenche e envia o formulario, e mede o que REALMENTE acontece:
 * requisicoes disparadas, para onde vao, e qual painel o visitante ve.
 * Uso: node testar-form.cjs [url]   (sem url = sobe servidor local)
 */
const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const RAIZ = path.resolve('D:/AIOS/docs/projects/aiox-site/05-build/talos-site');
const PORTA = 8714;
const ALVO = process.argv[2];

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp4': 'video/mp4',
  '.webm': 'video/webm', '.ttf': 'font/ttf', '.ico': 'image/x-icon',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  let servidor, url = ALVO;
  if (!ALVO) {
    servidor = http.createServer((req, res) => {
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
    await new Promise((r) => servidor.listen(PORTA, r));
    url = `http://localhost:${PORTA}/index.html`;
  }

  const b = await puppeteer.launch({
    executablePath: CHROME, headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
  });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });

  const reqs = [];
  p.on('request', (r) => {
    const t = r.resourceType();
    if (t === 'xhr' || t === 'fetch') reqs.push(`-> ${r.method()} ${r.url().slice(0, 120)}`);
  });
  p.on('response', async (r) => {
    const t = r.request().resourceType();
    if (t === 'xhr' || t === 'fetch') {
      let corpo = '';
      try { corpo = (await r.text()).slice(0, 220); } catch (e) { corpo = '(sem corpo)'; }
      reqs.push(`<- ${r.status()} ${r.url().slice(0, 90)}  ${corpo}`);
    }
  });

  await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await sleep(9000);

  console.log('=== canais no HTML ===');
  console.log(JSON.stringify(await p.evaluate(() => ({
    linksWhatsApp: [...document.querySelectorAll('a[href*="wa.me"]')].map((a) => a.textContent.trim().slice(0, 40) || a.getAttribute('aria-label')),
    acaoForm: document.getElementById('email-form')?.getAttribute('action'),
    metodoForm: document.getElementById('email-form')?.method,
    restosWebflow: {
      wfPageId: !!document.getElementById('email-form')?.getAttribute('data-wf-page-id'),
      turnstile: !!document.querySelector('[data-turnstile-sitekey], [name="cf-turnstile-response"]'),
    },
  })), null, 2));

  reqs.length = 0;
  await p.evaluate(() => document.getElementById('email-form')?.scrollIntoView({ block: 'center' }));
  await sleep(1200);
  await p.type('#Name', 'Teste Automatizado', { delay: 10 });
  await p.type('#Company', 'Talos QA', { delay: 10 });
  await p.type('#Email', 'qa@example.com', { delay: 10 });
  await p.type('#Share-project-details', 'Envio de verificacao do formulario. Pode ignorar.', { delay: 3 });
  await p.click('input[type="submit"]');
  await sleep(11000);

  const depois = await p.evaluate(() => {
    const v = (s) => { const e = document.querySelector(s); if (!e) return 'inexistente'; const r = e.getBoundingClientRect(); return (r.width > 0 && r.height > 0) ? 'VISIVEL' : 'oculto'; };
    return {
      painelSucesso: v('.w-form-done'),
      painelErro: v('.w-form-fail'),
      formVisivel: v('#email-form'),
      textoErro: document.querySelector('.w-form-fail')?.innerText.trim().slice(0, 140),
      linkWhatsAppDeFallback: document.querySelector('a.tl-wa-fallback')?.href?.slice(0, 90) || '(nenhum)',
      botao: document.querySelector('input[type="submit"]')?.value,
    };
  });
  console.log('\n=== o que o visitante ve depois de enviar ===');
  console.log(JSON.stringify(depois, null, 2));
  console.log('\n=== requisicoes do envio ===');
  reqs.forEach((r) => console.log('  ', r));

  await p.screenshot({ path: path.join(RAIZ, '..', 'shots-talos-site', 'form-teste.png') }).catch(() => {});
  await b.close();
  if (servidor) servidor.close();
})().catch((e) => { console.error(e); process.exit(1); });
