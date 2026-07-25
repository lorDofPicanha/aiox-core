// fetch-assets.cjs — baixa assets que colidiram no capturador, usando a sessão do browser (passa o checkpoint)
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = 'D:/AIOS/docs/projects/site-prospector/03-proposal-mockups/chokolaten/mockup-A-fork/assets';

const IMGS = ['empty-bottle', 'pineapple', 'pineapple-2', 'habanero', 'habanero-2', 'cherry', 'cherry-2',
  'garlic', 'tomato', 'onion', 'chilli', 'lottie-sweating-onion', 'lottie-grinning-garlic'];

(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
  const pg = await b.newPage();
  await pg.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
  await pg.goto('https://buckssauce.com/', { waitUntil: 'networkidle2', timeout: 90000 });
  for (let i = 0; i < 15; i++) {
    if (!/checkpoint|just a moment/i.test(await pg.title())) break;
    await new Promise(r => setTimeout(r, 3000));
  }
  console.log('sessão ok:', (await pg.title()).slice(0, 44));

  // ---- imagens: pedir ao otimizador em largura alta ----
  for (const name of IMGS) {
    // 1º o arquivo ORIGINAL (sem otimizador); 2º o otimizador com q=75 (o que a página usa)
    const candidates = [`/images/${name}.webp`, `/_next/image?url=%2Fimages%2F${name}.webp&w=3840&q=75`];
    const r = await pg.evaluate(async (urls) => {
      for (const u of urls) {
        try {
          const res = await fetch(u);
          if (!res.ok) continue;
          const buf = new Uint8Array(await res.arrayBuffer());
          let s = ''; for (const b of buf) s += String.fromCharCode(b);
          return { data: btoa(s), type: res.headers.get('content-type'), from: u };
        } catch {}
      }
      return { err: 'todas falharam' };
    }, candidates);
    if (r.err) { console.log(`✗ ${name}: HTTP ${r.err}`); continue; }
    const ext = (r.type || '').includes('webp') ? 'webp' : (r.type || '').includes('png') ? 'png' : 'jpg';
    const buf = Buffer.from(r.data, 'base64');
    fs.writeFileSync(path.join(OUT, 'img', `${name}.${ext}`), buf);
    console.log(`✓ ${name}.${ext}  ${(buf.length / 1024).toFixed(0)} KB`);
  }

  // ---- fontes referenciadas no CSS ----
  const css = fs.readFileSync(path.join(OUT, '..', 'styles.css'), 'utf8');
  const want = [...new Set([...css.matchAll(/url\("assets\/fonts\/([^"]+)"\)/g)].map(m => m[1]))];
  for (const f of want) {
    if (fs.existsSync(path.join(OUT, 'fonts', f))) continue;
    const r = await pg.evaluate(async (u) => {
      const res = await fetch(u);
      if (!res.ok) return { err: res.status };
      const buf = new Uint8Array(await res.arrayBuffer());
      let s = ''; for (const b of buf) s += String.fromCharCode(b);
      return { data: btoa(s) };
    }, '/_next/static/media/' + f);
    if (r.err) { console.log(`✗ fonte ${f}: HTTP ${r.err}`); continue; }
    fs.writeFileSync(path.join(OUT, 'fonts', f), Buffer.from(r.data, 'base64'));
    console.log(`✓ fonte ${f}`);
  }
  await b.close();
})().catch(e => { console.error('FALHOU:', e.message); process.exit(1); });
