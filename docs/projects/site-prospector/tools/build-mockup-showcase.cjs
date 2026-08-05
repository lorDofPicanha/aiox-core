const fs = require("fs");
const path = require("path");

const loteArg = process.argv.find((argument) => /^--lote-\d+$/.test(argument));
const lote = loteArg ? loteArg.replace("--lote-", "").padStart(2, "0") : "01";
const batchName = lote === "01" ? "batch-2026-07" : `batch-2026-07-lote-${lote}`;
const batchRoot = path.resolve(__dirname, "..", "03-proposal-mockups", batchName);
const businesses = fs.readdirSync(batchRoot)
  .filter((name) => fs.existsSync(path.join(batchRoot, name, "site-v2", "manifest.json")))
  .map((slug) => ({
    slug,
    manifest: JSON.parse(fs.readFileSync(path.join(batchRoot, slug, "site-v2", "manifest.json"), "utf8")),
  }));

const cards = businesses.map(({ slug, manifest }, index) => {
  const links = manifest.pages
    .map(({ file, label }) => `<a href="${slug}/site-v2/${file}">${label}</a>`)
    .join("");
  return `<article class="card" style="--i:${index}">
    <a class="preview" href="${slug}/site-v2/index.html">
      <img src="${slug}/site-v2/screens/index-desktop.jpg" alt="Página inicial do conceito ${manifest.business}">
      <span>Abrir site completo ↗</span>
    </a>
    <div class="meta"><p>${String(index + 1).padStart(2, "0")} · ${manifest.niche}</p><h2>${manifest.business}</h2>
      <div class="links">${links}</div>
    </div>
  </article>`;
}).join("");

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Site Prospector · lote ${lote}</title>
<style>
:root{--paper:#eee9df;--ink:#131313;--acid:#d8ff46}*{box-sizing:border-box}body{margin:0;background:var(--ink);color:var(--paper);font-family:Arial,sans-serif}
header{min-height:62vh;padding:clamp(30px,6vw,90px);display:grid;align-content:space-between;border-bottom:1px solid #4b4b4b;background:radial-gradient(circle at 85% 15%,#384114 0,transparent 30%)}
.eyebrow,.meta p{font-size:11px;letter-spacing:.18em;text-transform:uppercase}h1{font:clamp(64px,11vw,180px)/.78 Georgia,serif;letter-spacing:-.07em;margin:70px 0 30px;max-width:1100px}
.intro{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:end}.intro p{max-width:55ch;font-size:20px}.count{justify-self:end;font:80px Georgia,serif;color:var(--acid)}
main{padding:clamp(30px,5vw,80px);display:grid;gap:100px}.card{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(280px,.5fr);gap:35px;align-items:start}
.card:nth-child(even){grid-template-columns:minmax(280px,.5fr) minmax(0,1.5fr)}.card:nth-child(even) .preview{order:2}.preview{position:relative;display:block;overflow:hidden;border:1px solid #4b4b4b;background:#222}
.preview img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;object-position:top;transition:transform .5s ease}.preview:hover img{transform:scale(1.015)}
.preview span{position:absolute;right:16px;bottom:16px;background:var(--acid);color:var(--ink);padding:12px 16px;font-size:12px;text-transform:uppercase;letter-spacing:.08em}
.meta{position:sticky;top:20px;padding-top:15px;border-top:1px solid #777}.meta h2{font:clamp(38px,5vw,76px)/.9 Georgia,serif;letter-spacing:-.045em;margin:20px 0 35px}.links{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid #4b4b4b}
.links a{color:inherit;text-decoration:none;padding:13px 5px;border-bottom:1px solid #4b4b4b;font-size:12px;text-transform:uppercase}.links a:hover{color:var(--acid)}
footer{padding:50px clamp(30px,5vw,80px);border-top:1px solid #4b4b4b;font-size:12px;text-transform:uppercase;letter-spacing:.12em}
@media(max-width:850px){header{min-height:70vh}.intro,.card,.card:nth-child(even){grid-template-columns:1fr}.count{justify-self:start}.card:nth-child(even) .preview{order:0}.meta{position:static}.preview img{aspect-ratio:9/13}main{gap:70px;padding-inline:16px}}
</style></head><body>
<header><p class="eyebrow">Site Prospector · revisão privada · conceito não oficial</p><h1>Próximas marcas.<br>Sites inteiros.</h1>
<div class="intro"><p>${businesses.length} direções visuais próprias, com oito páginas por empresa e catálogo no centro da experiência.</p><strong class="count">${businesses.length}×8</strong></div></header>
<main>${cards}</main><footer>Conteúdo privado · sem publicação · preços e informações comerciais a confirmar</footer>
</body></html>`;

fs.writeFileSync(path.join(batchRoot, "showcase.html"), html, "utf8");
process.stdout.write(`${path.join(batchRoot, "showcase.html")}\n`);
