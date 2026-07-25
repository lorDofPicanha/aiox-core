// crop-engel.cjs — tira as faixas de campanha queimadas ("Deixe sua mãe mais Engel" no topo,
// lockup "Dia das Mães / ENGEL JOIAS" embaixo) e mantém só a joia.
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const CHROME = 'C:/Users/kingp/AppData/Local/Temp/x'; // substituído abaixo
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const SRC = 'D:/AIOS/docs/projects/site-prospector/03-proposal-mockups/_batch/engeljoias/instagram';
const OUT = 'D:/AIOS/docs/projects/site-prospector/03-proposal-mockups/engeljoias/assets/clean';

// [arquivo, x0,y0,x1,y1] — recorte que elimina as duas faixas de texto
const JOBS = [
  ['post10-img1.jpg', 0.03, 0.17, 0.97, 0.75],
  ['post10-img2.jpg', 0.03, 0.18, 0.97, 0.76],
  ['post10-img4.jpg', 0.03, 0.17, 0.97, 0.75],
  ['post10-img5.jpg', 0.03, 0.17, 0.97, 0.74],
  ['post08-img1.jpg', 0.03, 0.16, 0.97, 0.76],
  ['post15-img1.jpg', 0.03, 0.14, 0.97, 0.80],
  ['post12-img1.jpg', 0.03, 0.14, 0.97, 0.82],
  ['post06-img1.jpg', 0.03, 0.16, 0.97, 0.76],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  for (const [file, x0, y0, x1, y1] of JOBS) {
    const src = path.join(SRC, file);
    if (!fs.existsSync(src)) { console.log('SKIP', file); continue; }
    const b64 = fs.readFileSync(src).toString('base64');
    const out = await page.evaluate(async (b64, x0, y0, x1, y1) => {
      const img = new Image(); img.src = 'data:image/jpeg;base64,' + b64;
      await img.decode();
      const W = img.naturalWidth, H = img.naturalHeight;
      const sx = Math.round(W * x0), sy = Math.round(H * y0);
      const sw = Math.round(W * (x1 - x0)), sh = Math.round(H * (y1 - y0));
      const c = document.createElement('canvas'); c.width = sw; c.height = sh;
      c.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      return { data: c.toDataURL('image/jpeg', 0.93).split(',')[1], W, H, sw, sh };
    }, b64, x0, y0, x1, y1);
    fs.writeFileSync(path.join(OUT, file), Buffer.from(out.data, 'base64'));
    console.log(`✓ ${file}  ${out.W}x${out.H} → ${out.sw}x${out.sh}`);
  }
  await browser.close();
})().catch(e => { console.error('FALHOU:', e.message); process.exit(1); });
