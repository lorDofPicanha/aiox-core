const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "03-proposal-mockups", "_nacional-2026-07", "_clientes", "lote-04");
const headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" };

const sources = [
  {
    source: "15-wandacardoso-com",
    urls: [
      "https://wandacardoso.com/",
      "https://wandacardoso.com/produtos/doces-exclusivos/",
      "https://wandacardoso.com/produtos/doces-sofisticados/",
      "https://wandacardoso.com/produtos/cesta-de-chocolate/",
      "https://wandacardoso.com/produtos/doces-bombons-de-chocolate/",
      "https://wandacardoso.com/produtos/doces-caramelados/",
      "https://wandacardoso.com/produtos/doces-brigadeiros-gourmet/",
      "https://wandacardoso.com/produtos/doces-simples/",
      "https://wandacardoso.com/produtos/copinho-petit-verre-acrilico/",
      "https://wandacardoso.com/produtos/bolos-de-casamento/",
      "https://wandacardoso.com/produtos/bem-casados-nascidos-vividos/",
    ],
    allow: /clvaw-cdnwnd\.com/i,
    deny: /(?:logo|icon|favicon)/i,
    max: 40,
  },
  {
    source: "02-the-chayi",
    urls: ["https://linktr.ee/the.chayi"],
    allow: /(?:ugc\.production\.linktr\.ee|linktr\.ee\/og\/image)/i,
    deny: /(?:sticker|logo-assets|The-Chayi-Logo)/i,
    max: 30,
    transform: (url) => url.replace(/&size=[^&]+/i, ""),
  },
  {
    source: "13-psluthier",
    urls: [
      "https://catalogobandasdemusicape.wordpress.com/paulo-sergio-nunes-luthier/",
      "https://pe.agenciasebrae.com.br/cultura-empreendedora/o-unico-luthier-diplomado-em-pernambuco/",
    ],
    allow: /(?:catalogobandasdemusicape\.wordpress\.com\/wp-content\/uploads|pe\.agenciasebrae\.com\.br\/wp-content\/uploads)/i,
    deny: /(?:declarac|live|ensaio|aula|procrianca|crianc3|duelo|jc-oficina|futuro-no-recife|thumb_resized)/i,
    max: 45,
    transform: (url) => url.replace(/\?w=\d+.*$/i, ""),
  },
];

function decode(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&#038;", "&")
    .replaceAll("\\/", "/")
    .trim();
}

function collectUrls(html, base) {
  const values = [];
  for (const match of html.matchAll(/(?:src|data-src|srcset|data-srcset|content)=["']([^"']+)["']/gi)) {
    for (const candidate of decode(match[1]).split(",")) {
      const raw = candidate.trim().split(/\s+/)[0];
      if (!raw || raw.startsWith("data:")) continue;
      try { values.push(new URL(raw, base).href); } catch { /* malformed asset */ }
    }
  }
  for (const match of html.matchAll(/url\((?:["']?)(https?:[^)"']+)(?:["']?)\)/gi)) {
    values.push(decode(match[1]));
  }
  return [...new Set(values)];
}

function extension(contentType) {
  if (/png/i.test(contentType)) return "png";
  if (/webp/i.test(contentType)) return "webp";
  if (/gif/i.test(contentType)) return "gif";
  return "jpg";
}

async function harvest(config) {
  const candidates = [];
  for (const pageUrl of config.urls) {
    const response = await fetch(pageUrl, { headers });
    if (!response.ok) throw new Error(`${config.source}: HTTP ${response.status} em ${pageUrl}`);
    const html = await response.text();
    candidates.push(...collectUrls(html, pageUrl));
  }

  const urls = [...new Set(candidates
    .filter((url) => config.allow.test(url) && !config.deny.test(url))
    .map((url) => config.transform ? config.transform(url) : url))];
  const output = path.join(root, config.source, "fotos");
  fs.mkdirSync(output, { recursive: true });
  const seen = new Set();
  const report = [];

  for (const url of urls) {
    if (report.length >= config.max) break;
    try {
      const response = await fetch(url, { headers });
      const type = response.headers.get("content-type") || "";
      const bytes = Buffer.from(await response.arrayBuffer());
      const hash = crypto.createHash("sha256").update(bytes).digest("hex");
      if (!response.ok || !type.startsWith("image/") || bytes.length < 22000 || seen.has(hash)) continue;
      seen.add(hash);
      const file = `oficial-${String(report.length + 1).padStart(2, "0")}.${extension(type)}`;
      fs.writeFileSync(path.join(output, file), bytes);
      report.push({ file, url, bytes: bytes.length, contentType: type, sha256: hash });
    } catch { /* keep harvesting remaining first-party assets */ }
  }

  fs.writeFileSync(path.join(root, config.source, "official-assets.json"), JSON.stringify(report, null, 2));
  return { source: config.source, assets: report.length };
}

(async () => {
  const results = [];
  for (const source of sources) results.push(await harvest(source));
  process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
})().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
