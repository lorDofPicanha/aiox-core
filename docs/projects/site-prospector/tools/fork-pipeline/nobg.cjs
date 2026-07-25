// nobg.cjs — recorte de fundo chapado por flood-fill a partir das bordas.
// Melhor que matte de IA para fundo uniforme: preserva embalagem clara (creme) no interior,
// porque só remove pixels CONECTADOS à borda. Sombras viram alpha parcial (ramp).
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const DIR = 'D:/AIOS/docs/projects/site-prospector/03-proposal-mockups/chokolaten/assets/cropped';
const OUT = 'D:/AIOS/docs/projects/site-prospector/03-proposal-mockups/chokolaten/assets/cutout';

const TIGHT = 26;   // <= dist: fundo puro  → alpha 0
const LOOSE = 95;   // >= dist: objeto      → alpha 255

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  for (const file of fs.readdirSync(DIR).filter(f => /\.png$/i.test(f))) {
    const b64 = fs.readFileSync(path.join(DIR, file)).toString('base64');

    const res = await page.evaluate(async (b64, TIGHT, LOOSE) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + b64;
      await img.decode();
      const W = img.naturalWidth, H = img.naturalHeight;
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const im = ctx.getImageData(0, 0, W, H);
      const d = im.data;

      // cor de fundo = mediana da moldura
      const samples = [];
      for (let x = 0; x < W; x += 4) { samples.push([x, 0], [x, H - 1]); }
      for (let y = 0; y < H; y += 4) { samples.push([0, y], [W - 1, y]); }
      const med = (arr) => arr.sort((a, b) => a - b)[arr.length >> 1];
      const bg = [0, 1, 2].map(ch => med(samples.map(([x, y]) => d[(y * W + x) * 4 + ch])));

      const dist = (i) => Math.hypot(d[i] - bg[0], d[i + 1] - bg[1], d[i + 2] - bg[2]);

      // flood fill a partir da borda
      const outside = new Uint8Array(W * H);
      const stack = [];
      const push = (x, y) => {
        if (x < 0 || y < 0 || x >= W || y >= H) return;
        const p = y * W + x;
        if (outside[p]) return;
        if (dist(p * 4) >= LOOSE) return;
        outside[p] = 1; stack.push(p);
      };
      for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
      for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
      while (stack.length) {
        const p = stack.pop();
        const x = p % W, y = (p / W) | 0;
        push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
      }

      // aplica alpha
      let cleared = 0;
      for (let p = 0; p < W * H; p++) {
        if (!outside[p]) continue;
        const i = p * 4;
        const dd = dist(i);
        let a = dd <= TIGHT ? 0 : dd >= LOOSE ? 255 : Math.round(((dd - TIGHT) / (LOOSE - TIGHT)) * 255);
        d[i + 3] = Math.min(d[i + 3], a);
        if (a === 0) cleared++;
      }
      ctx.putImageData(im, 0, 0);

      // recorta a bounding box do que sobrou (aperta a moldura)
      let minX = W, minY = H, maxX = 0, maxY = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (d[(y * W + x) * 4 + 3] > 12) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
      }
      const pad = 8;
      minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
      maxX = Math.min(W - 1, maxX + pad); maxY = Math.min(H - 1, maxY + pad);
      const cw = maxX - minX + 1, ch = maxY - minY + 1;
      const c2 = document.createElement('canvas');
      c2.width = cw; c2.height = ch;
      c2.getContext('2d').drawImage(c, minX, minY, cw, ch, 0, 0, cw, ch);

      return { data: c2.toDataURL('image/png').split(',')[1], W, H, cw, ch, bg, pct: Math.round(cleared / (W * H) * 100) };
    }, b64, TIGHT, LOOSE);

    const dest = path.join(OUT, file);
    fs.writeFileSync(dest, Buffer.from(res.data, 'base64'));
    console.log(`✓ ${file}  bg=rgb(${res.bg})  ${res.W}x${res.H} → ${res.cw}x${res.ch}  fundo removido ${res.pct}%`);
  }
  await browser.close();
})().catch(e => { console.error('FALHOU:', e.message); process.exit(1); });
