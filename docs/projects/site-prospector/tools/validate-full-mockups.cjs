const fs = require("fs");
const path = require("path");

const loteArg = process.argv.find((argument) => /^--lote-\d+$/.test(argument));
const lote = loteArg ? loteArg.replace("--lote-", "").padStart(2, "0") : "01";
const batchName = lote === "01" ? "batch-2026-07" : `batch-2026-07-lote-${lote}`;
const batchRoot = path.resolve(__dirname, "..", "03-proposal-mockups", batchName);
const expectedByLote = { "01": 11, "02": 7, "03": 3, "04": 3 };
const expectedBusinesses = expectedByLote[lote];
if (!expectedBusinesses) throw new Error(`No expected business count configured for lote ${lote}`);
const expectedPages = [
  "index.html",
  "catalogo.html",
  "categoria.html",
  "produto.html",
  "sobre.html",
  "guia.html",
  "contato.html",
  "carrinho.html",
];

const businesses = fs.readdirSync(batchRoot)
  .filter((name) => fs.existsSync(path.join(batchRoot, name, "site-v2", "manifest.json")));

const failures = [];
let htmlCount = 0;
let imageRefs = 0;

for (const business of businesses) {
  const siteRoot = path.join(batchRoot, business, "site-v2");
  for (const file of expectedPages) {
    const htmlPath = path.join(siteRoot, file);
    if (!fs.existsSync(htmlPath)) {
      failures.push(`${business}: missing ${file}`);
      continue;
    }
    htmlCount += 1;
    const html = fs.readFileSync(htmlPath, "utf8");
    if (!html.includes("Conceito visual não oficial")) {
      failures.push(`${business}/${file}: missing required label`);
    }
    if (!html.includes('meta name="robots" content="noindex,nofollow"')) {
      failures.push(`${business}/${file}: missing noindex`);
    }
    for (const expected of expectedPages) {
      if (!html.includes(`href="${expected}"`)) {
        failures.push(`${business}/${file}: navigation missing ${expected}`);
      }
    }
    for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      const value = match[1];
      if (/^(https?:|\/\/)/.test(value)) {
        failures.push(`${business}/${file}: external resource ${value}`);
      }
      if (value.endsWith(".jpg") || value.endsWith(".jpeg") || value.endsWith(".png") || value.endsWith(".webp")) {
        imageRefs += 1;
        const asset = path.resolve(siteRoot, value);
        if (!fs.existsSync(asset)) failures.push(`${business}/${file}: missing image ${value}`);
      }
      if (value.endsWith(".html") && !fs.existsSync(path.resolve(siteRoot, value))) {
        failures.push(`${business}/${file}: dead link ${value}`);
      }
    }
  }
  if (!fs.existsSync(path.join(siteRoot, "styles.css"))) failures.push(`${business}: missing styles.css`);
}

const result = {
  businesses: businesses.length,
  htmlPages: htmlCount,
  imageReferencesChecked: imageRefs,
  failures,
  pass: businesses.length === expectedBusinesses && htmlCount === expectedBusinesses * expectedPages.length && failures.length === 0,
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
process.exitCode = result.pass ? 0 : 1;
