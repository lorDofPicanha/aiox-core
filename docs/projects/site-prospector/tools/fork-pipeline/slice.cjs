// slice.cjs — fatia barras individuais do recorte de 6 barras (mantém alpha) p/ usar como objetos flutuantes
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const SRC = 'D:/AIOS/docs/projects/site-prospector/03-proposal-mockups/chokolaten/assets/cutout/post10-img1.png';
const OUT = 'D:/AIOS/docs/projects/site-prospector/03-proposal-mockups/chokolaten/assets/cutout';

// barras dos 4 cantos — cada uma tem 2 bordas externas limpas
const SLICES = [
  ['barra-27-branco-cookies', 0.010, 0.005, 0.300, 0.600],
  ['barra-35-ao-leite',       0.575, 0.000, 0.935, 0.635],
  ['barra-45-avelas',         0.100, 0.375, 0.425, 0.995],
  ['barra-70-intenso',        0.685, 0.380, 1.000, 1.000],
];

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const b64 = fs.readFileSync(SRC).toString('base64');

  for (const [name, x0, y0, x1, y1] of SLICES) {
    const res = await page.evaluate(async (b64, x0, y0, x1, y1) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + b64;
      await img.decode();
      const W = img.naturalWidth, H = img.naturalHeight;
      const sx = Math.round(W * x0), sy = Math.round(H * y0);
      const sw = Math.round(W * (x1 - x0)), sh = Math.round(H * (y1 - y0));
      const c = document.createElement('canvas');
      c.width = sw; c.height = sh;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

      // aperta bbox no alpha
      const d = ctx.getImageData(0, 0, sw, sh).data;
      let mnX = sw, mnY = sh, mxX = 0, mxY = 0;
      for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
        if (d[(y * sw + x) * 4 + 3] > 20) { if (x < mnX) mnX = x; if (x > mxX) mxX = x; if (y < mnY) mnY = y; if (y > mxY) mxY = y; }
      }
      const cw = mxX - mnX + 1, ch = mxY - mnY + 1;
      const c2 = document.createElement('canvas');
      c2.width = cw; c2.height = ch;
      c2.getContext('2d').drawImage(c, mnX, mnY, cw, ch, 0, 0, cw, ch);
      return { data: c2.toDataURL('image/png').split(',')[1], cw, ch };
    }, b64, x0, y0, x1, y1);

    fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(res.data, 'base64'));
    console.log(`✓ ${name}.png  ${res.cw}x${res.ch}`);
  }
  await browser.close();
})().catch(e => { console.error('FALHOU:', e.message); process.exit(1); });
