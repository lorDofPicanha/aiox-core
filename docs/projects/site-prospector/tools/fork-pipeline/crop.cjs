// crop.cjs — recorta o miolo da imagem (tira logo/tarja/selo queimados do post de IG)
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const SRC = 'D:/AIOS/docs/projects/site-prospector/03-proposal-mockups/chokolaten/assets/instagram';
const OUT = 'D:/AIOS/docs/projects/site-prospector/03-proposal-mockups/chokolaten/assets/cropped';

// [arquivo, x0, y0, x1, y1] em fração
const JOBS = [
  ['post10-img1.jpg', 0.15, 0.22, 0.85, 0.78],  // 6 barras
  ['post06-img1.jpg', 0.10, 0.152, 0.88, 0.80],  // linha zero (3 barras)
  ['post14-img1.jpg', 0.11, 0.26, 0.68, 0.73],  // drágeas (embalagem isolada)
  ['post10-img1.jpg', 0.655, 0.055, 0.955, 0.155, 'logo-chokolaten'],  // wordmark + vagem de cacau
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const page = await browser.newPage();

  for (const [file, x0, y0, x1, y1, rename] of JOBS) {
    const src = path.join(SRC, file);
    if (!fs.existsSync(src)) { console.log('SKIP (não existe):', file); continue; }
    const b64 = fs.readFileSync(src).toString('base64');

    const out = await page.evaluate(async (b64, x0, y0, x1, y1) => {
      const img = new Image();
      img.src = 'data:image/jpeg;base64,' + b64;
      await img.decode();
      const W = img.naturalWidth, H = img.naturalHeight;
      const sx = Math.round(W * x0), sy = Math.round(H * y0);
      const sw = Math.round(W * (x1 - x0)), sh = Math.round(H * (y1 - y0));
      const c = document.createElement('canvas');
      c.width = sw; c.height = sh;
      c.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      return { data: c.toDataURL('image/png').split(',')[1], W, H, sw, sh };
    }, b64, x0, y0, x1, y1);

    const dest = path.join(OUT, (rename || file.replace(/\.jpe?g$/i, '')) + '.png');
    fs.writeFileSync(dest, Buffer.from(out.data, 'base64'));
    console.log(`✓ ${file}  ${out.W}x${out.H} → ${out.sw}x${out.sh}  ${dest}`);
  }
  await browser.close();
})().catch(e => { console.error('FALHOU:', e.message); process.exit(1); });
