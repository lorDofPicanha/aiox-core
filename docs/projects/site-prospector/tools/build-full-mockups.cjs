const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const mockupRoot = path.join(projectRoot, "03-proposal-mockups");
const loteArg = process.argv.find((argument) => /^--lote-\d+$/.test(argument));
const lote = loteArg ? loteArg.replace("--lote-", "").padStart(2, "0") : "01";
const batchName = lote === "01" ? "batch-2026-07" : `batch-2026-07-lote-${lote}`;
const batchRoot = path.join(mockupRoot, batchName);
const sourceRoot = path.join(mockupRoot, "_nacional-2026-07", "_clientes", `lote-${lote}`);

const pages = [
  ["index.html", "Início"],
  ["catalogo.html", "Catálogo"],
  ["categoria.html", "Coleção"],
  ["produto.html", "Produto"],
  ["sobre.html", "Sobre"],
  ["guia.html", "Guia"],
  ["contato.html", "Atendimento"],
  ["carrinho.html", "Carrinho"],
];

const defaultBusinesses = [
  {
    slug: "plus-store-bh", source: "05-plusstorebh", name: "Plus Store BH",
    handle: "@plusstorebh", niche: "fashion", layout: 0,
    colors: ["#f4efe7", "#171717", "#8f1d2c", "#d8c2aa", "#fff9f0"],
    fonts: ["Didot, 'Bodoni 72', serif", "'Gill Sans', 'Trebuchet MS', sans-serif"],
    hero: "Moda que ocupa espaço.", deck: "Uma loja inteira para descobrir, combinar e escolher.",
    categories: ["Novidades", "Vestidos", "Conjuntos", "Essenciais"],
    media: ["post03.jpg", "post04.jpg", "post06.jpg", "post08.jpg", "post11.jpg", "post02.jpg"],
    guide: "Guia de medidas",
  },
  {
    slug: "flavia-nogueira-confeitaria", source: "09-flavia-nogueira-confeitaria",
    name: "Flavia Nogueira Confeitaria", handle: "@flavianogueiraconfeitaria",
    niche: "food", layout: 1,
    colors: ["#fff6ef", "#421b22", "#ee6b76", "#f5c8a7", "#fffdf8"],
    fonts: ["'Palatino Linotype', Palatino, serif", "'Trebuchet MS', sans-serif"],
    hero: "Doces para ficar na memória.", deck: "O catálogo começa pelo olhar e termina na celebração.",
    categories: ["Celebrações", "Presentes", "Seleção", "Ocasiões"],
    media: ["post13.jpg", "post13-img2.jpg", "post12.jpg", "post15.jpg", "post19.jpg"],
    guide: "Sabores e conservação",
  },
  {
    slug: "bicudos-acessorios", source: "12-bicudos-acessorios", name: "Bicudos Acessórios",
    handle: "@bicudos.acessorios", niche: "jewelry", layout: 2,
    colors: ["#11100f", "#f5efe3", "#b78a45", "#292521", "#d8c6a8"],
    fonts: ["'Baskerville', 'Times New Roman', serif", "'Bahnschrift', sans-serif"],
    hero: "Matéria, peso e presença.", deck: "Peças vistas de perto, escolhidas sem pressa.",
    categories: ["Pulseiras", "Correntes", "Colares", "Seleção"],
    media: ["post04.jpg", "post09.jpg", "post08.jpg", "post03.jpg"],
    guide: "Materiais e cuidados",
  },
  {
    slug: "center-panos-santo-andre", source: "13-center-panos-santo-andre",
    name: "Center Panos Santo André", handle: "@centerpanossantoandre",
    niche: "home", layout: 3,
    colors: ["#f1ead9", "#142d27", "#d84f36", "#e9bb38", "#f8f3e8"],
    fonts: ["'Rockwell', 'Roboto Slab', serif", "'Century Gothic', sans-serif"],
    hero: "Matéria para quem faz.", deck: "Tecidos, texturas e ideias organizados como um acervo vivo.",
    categories: ["Tecidos", "Estampas", "Artesanato", "Inspiração"],
    media: ["post10.jpg", "post13.jpg", "post03.jpg"], guide: "Materiais e medidas",
  },
  {
    slug: "immerse-earth-aroma", source: "14-immerse-earth-aroma",
    name: "Immerse Earth Aroma", handle: "@earth.aroma", niche: "aroma", layout: 4,
    colors: ["#ded8ff", "#213b38", "#ff6b4a", "#a7d9c7", "#f8f2e8"],
    fonts: ["'Book Antiqua', Palatino, serif", "'Avenir Next', 'Trebuchet MS', sans-serif"],
    hero: "Objetos para sentir o espaço.", deck: "Cor, gesto e atmosfera em uma coleção sensorial.",
    categories: ["Aromas", "Objetos", "Rituais", "Presentes"],
    media: ["post26.jpg", "post01-img5.jpg", "post06.jpg"], guide: "Notas e ritual",
  },
  {
    slug: "codigo-g-moda-plus-size", source: "15-codigo-g-moda-plus-size",
    name: "Código G Moda Plus Size", handle: "@codigogmodaplussize",
    niche: "fashion", layout: 5,
    colors: ["#f5f2e9", "#161616", "#e63946", "#f4d35e", "#ffffff"],
    fonts: ["'Cooper Black', 'Rockwell', serif", "'Franklin Gothic Medium', sans-serif"],
    hero: "Vista o tamanho da sua presença.", deck: "Uma vitrine de moda inteira, sem pedir licença.",
    categories: ["Novidades", "Vestidos", "Conjuntos", "Noite"],
    media: ["post10.jpg", "post01.jpg", "post13.jpg", "post17.jpg"],
    guide: "Guia de medidas",
  },
  {
    slug: "vhal-moda-praia", source: "16-vhal-moda-praia", name: "Vhal Moda Praia",
    handle: "@vhal_modapraia", niche: "fashion", layout: 6,
    colors: ["#c9f5ec", "#173b35", "#f15a3c", "#d7f452", "#fff6df"],
    fonts: ["'Bodoni 72', Didot, serif", "'Avenir Next', sans-serif"],
    hero: "Verão em movimento.", deck: "Uma coleção para navegar entre cor, textura e água.",
    categories: ["Biquínis", "Maiôs", "Saídas", "Acessórios"],
    media: ["post11.jpg", "post03.jpg", "post12.jpg", "post16.jpg"],
    guide: "Guia de medidas",
  },
  {
    slug: "julia-plus-rio", source: "17-julia-plus-rio", name: "Julia Plus Rio",
    handle: "@juliaplus.rio", niche: "fashion", layout: 7,
    colors: ["#f8e9f1", "#37203b", "#ff5b79", "#6ed6d1", "#fffafc"],
    fonts: ["'Century Schoolbook', Georgia, serif", "'Gill Sans', sans-serif"],
    hero: "Rio, curva e cor.", deck: "Moda plus size com noite, leveza e cotidiano na mesma coleção.",
    categories: ["Noite", "Brancos", "Essenciais", "Novidades"],
    media: ["post01.jpg", "post05.jpg", "post10.jpg", "post15.jpg"],
    guide: "Guia de medidas",
  },
  {
    slug: "queijaria-sapori-italiani", source: "18-queijaria-sapori-italiani",
    name: "Queijaria Sapori Italiani", handle: "@queijariasaporiitaliani",
    niche: "food", layout: 8,
    colors: ["#f5edd9", "#4a2118", "#b52a26", "#d6a329", "#fffaf0"],
    fonts: ["'Baskerville', Georgia, serif", "'Gill Sans', sans-serif"],
    hero: "Sabores com história à mesa.", deck: "Uma seleção artesanal organizada por origem, ocasião e descoberta.",
    categories: ["Queijos", "Experiências", "Presentes", "Seleção"],
    media: ["post02.jpg", "post07.jpg", "post08.jpg", "post12.jpg", "post16.jpg"],
    guide: "Sabores e conservação",
  },
  {
    slug: "atelie-ruby", source: "19-atelie-ruby", name: "Ateliê Ruby",
    handle: "@ruby_noivas", niche: "fashion", layout: 9,
    colors: ["#f4eadf", "#3b1726", "#8d294c", "#b9a0d8", "#fffaf4"],
    fonts: ["'Bodoni 72', Didot, serif", "'Optima', 'Trebuchet MS', sans-serif"],
    hero: "Vestidos para entrar na cena.", deck: "Noivas, festa e cerimônia em uma experiência de ateliê.",
    categories: ["Noivas", "Festa", "Madrinhas", "Ateliê"],
    media: ["post01.jpg", "post06.jpg", "post08.jpg", "post21.jpg"],
    guide: "Prova e medidas",
  },
  {
    slug: "mary-jayne", source: "20-mary-jayne", name: "Mary Jayne",
    handle: "@amaryjayne", niche: "fashion", layout: 10,
    colors: ["#ebe5dc", "#161716", "#66754d", "#d9a79c", "#f9f6ef"],
    fonts: ["'Garamond', 'Palatino Linotype', serif", "'Arial Narrow', 'Bahnschrift', sans-serif"],
    hero: "Roupa para viver do seu jeito.", deck: "Peças, movimento e estilo pessoal sem a pressa do marketplace.",
    categories: ["Essenciais", "Movimento", "Noite", "Novidades"],
    media: ["post01.jpg", "post05.jpg", "post10.jpg", "post15.jpg"],
    guide: "Guia de medidas",
  },
];
const businesses = lote === "01" ? defaultBusinesses : require(`./full-mockups-lote-${lote}.cjs`);

function relMedia(business, filename) {
  const absolute = path.join(sourceRoot, business.source, "fotos", filename);
  return path.relative(path.join(batchRoot, business.slug, "site-v2"), absolute).replaceAll("\\", "/");
}

function image(business, index, className = "") {
  const filename = business.media[index % business.media.length];
  return `<img class="${className}" src="${relMedia(business, filename)}" alt="Imagem first-party do acervo visual de ${business.name}">`;
}

function header(business, active) {
  const nav = pages.slice(0, 6).map(([file, label]) =>
    `<a ${file === active ? 'aria-current="page"' : ""} href="${file}">${label}</a>`
  ).join("");
  return `<div class="concept">Conceito visual não oficial · estudo privado</div>
  <header class="site-header">
    <a class="brand" href="index.html">${business.name}</a>
    <nav>${nav}</nav>
    <a class="bag" href="carrinho.html">Carrinho <span>0</span></a>
  </header>`;
}

function footer(business) {
  return `<footer>
    <div><strong>${business.name}</strong><p>${business.handle}</p></div>
    <div class="footer-links"><a href="catalogo.html">Catálogo</a><a href="sobre.html">Sobre</a><a href="contato.html">Atendimento</a></div>
    <p>Conceito visual não oficial<br>Informações comerciais a confirmar.</p>
  </footer>`;
}

function productCards(business, count = 8) {
  return Array.from({ length: count }, (_, index) => `<article class="product-card">
    <a href="produto.html">${image(business, index)}</a>
    <div><span>${business.categories[index % business.categories.length]}</span><h3>Seleção ${String(index + 1).padStart(2, "0")}</h3><p>Detalhes e disponibilidade a confirmar</p></div>
  </article>`).join("");
}

function pageShell(business, active, title, eyebrow, content) {
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>${title} — ${business.name}</title>
<link rel="stylesheet" href="styles.css"></head>
<body data-layout="${business.layout}" data-niche="${business.niche}">
${header(business, active)}
<main><section class="page-intro"><p>${eyebrow}</p><h1>${title}</h1></section>${content}</main>
${footer(business)}</body></html>`;
}

function home(business) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow"><title>${business.name} — conceito completo</title><link rel="stylesheet" href="styles.css"></head>
  <body data-layout="${business.layout}" data-niche="${business.niche}">${header(business, "index.html")}<main>
  <section class="hero">${image(business, 0, "hero-image")}<div class="hero-copy"><p>${business.categories[0]} · ${business.handle}</p><h1>${business.hero}</h1><p>${business.deck}</p><a class="button" href="catalogo.html">Explorar produtos</a></div></section>
  <section class="category-rail">${business.categories.map((item, i) => `<a href="categoria.html"><span>0${i + 1}</span>${item}</a>`).join("")}</section>
  <section class="featured"><div class="section-heading"><p>Seleção em foco</p><h2>Produto primeiro.<br>História em cada detalhe.</h2><a href="catalogo.html">Ver catálogo completo</a></div><div class="product-grid">${productCards(business, 4)}</div></section>
  <section class="story-split">${image(business, 2)}<div><p>O universo da marca</p><h2>${business.deck}</h2><a class="text-link" href="sobre.html">Conhecer a história</a></div></section>
  <section class="service-strip"><span>Catálogo completo</span><span>Atendimento a confirmar</span><span>Informações sem invenção</span><span>Estudo privado</span></section>
  </main>${footer(business)}</body></html>`;
}

function catalog(business) {
  return pageShell(business, "catalogo.html", "Catálogo", "Todos os produtos", `
  <section class="catalog-tools"><div>${business.categories.map((x, i) => `<a href="categoria.html">${x} <sup>${i + 2}</sup></a>`).join("")}</div><button>Filtrar +</button></section>
  <section class="product-grid catalog-grid">${productCards(business, 12)}</section>`);
}

function category(business) {
  return pageShell(business, "categoria.html", business.categories[0], "Coleção em foco", `
  <section class="collection-hero">${image(business, 1)}<div><p>Coleção 01</p><h2>${business.hero}</h2><p>${business.deck}</p></div></section>
  <section class="catalog-tools"><div>${business.categories.map((x) => `<a href="categoria.html">${x}</a>`).join("")}</div><button>Ordenar +</button></section>
  <section class="product-grid">${productCards(business, 8)}</section>`);
}

function product(business) {
  return pageShell(business, "produto.html", "Seleção 01", business.categories[0], `
  <section class="product-detail"><div class="gallery">${image(business, 0)}${image(business, 1)}${image(business, 2)}</div>
  <aside><p>${business.categories[0]}</p><h2>Seleção 01</h2><p class="status">Preço e disponibilidade a confirmar</p>
  <p>Estrutura completa de produto com descrição, variações, medidas e conservação. O conteúdo comercial final depende da validação da marca.</p>
  <fieldset><legend>Escolha uma opção</legend><button>Opção 01</button><button>Opção 02</button><button>Opção 03</button></fieldset>
  <a class="button wide" href="carrinho.html">Adicionar ao conceito</a>
  <details open><summary>Detalhes</summary><p>Informações do produto a confirmar com a marca.</p></details>
  <details><summary>Medidas e materiais</summary><p>Conteúdo final não inventado.</p></details>
  <details><summary>Entrega e atendimento</summary><p>Política comercial a confirmar.</p></details></aside></section>
  <section class="related"><h2>Continue descobrindo</h2><div class="product-grid">${productCards(business, 4)}</div></section>`);
}

function about(business) {
  return pageShell(business, "sobre.html", "Sobre", "A marca", `
  <section class="manifesto"><h2>${business.hero}</h2><p>${business.deck}</p></section>
  <section class="about-gallery">${image(business, 0)}${image(business, 2)}<div><p>Um espaço editorial para registrar origem, processo e visão sem fabricar alegações.</p><p>A narrativa final será construída apenas com fatos confirmados pela marca.</p></div></section>
  <section class="principles">${["Produto no centro", "Identidade própria", "Escolha com clareza"].map((x, i) => `<article><span>0${i + 1}</span><h3>${x}</h3><p>Estrutura de conteúdo pronta para receber informações verificadas.</p></article>`).join("")}</section>`);
}

function guide(business) {
  const topics = business.niche === "fashion" ? ["Como medir", "Caimento", "Prova e troca"] :
    business.niche === "jewelry" ? ["Uso diário", "Limpeza", "Armazenamento"] :
    business.niche === "food" ? ["Descoberta", "Conservação", "Serviço"] :
    business.niche === "home" ? ["Medidas", "Composição", "Cuidados"] :
    business.niche === "craft" ? ["Diagnóstico", "Construção", "Manutenção"] :
    ["Notas", "Ritual", "Conservação"];
  return pageShell(business, "guia.html", business.guide, "Guia do produto", `
  <section class="guide-hero">${image(business, 1)}<div><h2>Escolher melhor começa por entender.</h2><p>Guia visual completo, com conteúdo final sujeito à validação da marca.</p></div></section>
  <section class="guide-steps">${topics.map((x, i) => `<article><span>0${i + 1}</span><h3>${x}</h3><p>Espaço para orientação específica, clara e verificável.</p></article>`).join("")}</section>
  <section class="faq"><h2>Perguntas frequentes</h2>${topics.map(x => `<details><summary>${x}</summary><p>Resposta comercial e técnica a confirmar.</p></details>`).join("")}</section>`);
}

function contact(business) {
  return pageShell(business, "contato.html", "Atendimento", "Fale com a marca", `
  <section class="contact-layout"><div><h2>Uma conversa antes da escolha.</h2><p>Os canais oficiais, horários e endereço permanecem a confirmar.</p>
  <dl><dt>Instagram verificado no dossiê</dt><dd>${business.handle}</dd><dt>Demais canais</dt><dd>A confirmar</dd></dl></div>
  <form><label>Nome<input type="text" placeholder="Seu nome"></label><label>E-mail<input type="email" placeholder="voce@exemplo.com"></label>
  <label>Assunto<select><option>Produto</option><option>Medidas e detalhes</option><option>Atendimento</option></select></label>
  <label>Mensagem<textarea placeholder="Conte como podemos ajudar"></textarea></label><button type="button" class="button">Enviar — demonstração</button></form></section>`);
}

function cart(business) {
  return pageShell(business, "carrinho.html", "Carrinho", "Revisar seleção", `
  <section class="cart-layout"><div class="cart-item">${image(business, 0)}<div><p>${business.categories[0]}</p><h2>Seleção 01</h2><p>Opção a confirmar</p><button>Remover</button></div><strong>R$ —</strong></div>
  <aside><h2>Resumo</h2><p><span>Subtotal</span><strong>A confirmar</strong></p><p><span>Entrega</span><strong>A confirmar</strong></p>
  <a class="button wide" href="contato.html">Continuar no atendimento</a><small>Conceito sem transação, integração ou envio real.</small></aside></section>
  <section class="related"><h2>Você também pode gostar</h2><div class="product-grid">${productCards(business, 4)}</div></section>`);
}

function styles(business) {
  const [bg, ink, accent, alt, paper] = business.colors;
  const [display, body] = business.fonts;
  return `:root{--bg:${bg};--ink:${ink};--accent:${accent};--alt:${alt};--paper:${paper};--display:${display};--body:${body};--pad:clamp(20px,4vw,64px)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--body);font-size:17px;line-height:1.5}a{color:inherit;text-decoration:none}img{display:block;width:100%;object-fit:cover}button,input,select,textarea{font:inherit;color:inherit}.concept{padding:8px var(--pad);background:var(--ink);color:var(--paper);font-size:11px;text-transform:uppercase;letter-spacing:.18em;text-align:center}.site-header{height:92px;padding:0 var(--pad);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;border-bottom:1px solid color-mix(in srgb,var(--ink) 22%,transparent);position:relative;z-index:5}.brand{font-family:var(--display);font-size:clamp(20px,2.3vw,38px);font-weight:700;line-height:.9;max-width:360px}.site-header nav{display:flex;gap:24px;font-size:12px;text-transform:uppercase;letter-spacing:.12em}.site-header nav a[aria-current=page]{border-bottom:2px solid var(--accent)}.bag{justify-self:end;font-size:12px;text-transform:uppercase}.bag span{display:inline-grid;place-items:center;width:24px;height:24px;border:1px solid;border-radius:50%}
main{min-height:70vh}.hero{min-height:calc(100vh - 120px);display:grid;grid-template-columns:1.25fr .75fr;position:relative;overflow:hidden}.hero-image{height:100%;min-height:700px}.hero-copy{padding:var(--pad);display:flex;flex-direction:column;justify-content:center;background:var(--paper)}.hero-copy>p:first-child,.page-intro p,.section-heading>p,.collection-hero p:first-child,.product-detail aside>p:first-child{font-size:11px;text-transform:uppercase;letter-spacing:.2em}.hero h1,.page-intro h1,.manifesto h2{font-family:var(--display);font-size:clamp(64px,8vw,144px);line-height:.82;letter-spacing:-.055em;margin:24px 0}.hero-copy>p{max-width:44ch}.button{display:inline-flex;width:max-content;align-items:center;justify-content:center;padding:16px 24px;background:var(--accent);color:var(--paper);text-transform:uppercase;font-size:12px;letter-spacing:.12em;margin-top:24px;border:0}.wide{width:100%}.category-rail{display:grid;grid-template-columns:repeat(4,1fr);border-block:1px solid}.category-rail a{padding:30px var(--pad);border-right:1px solid;font-family:var(--display);font-size:clamp(22px,3vw,48px)}.category-rail span{display:block;font:11px var(--body);margin-bottom:25px}.featured,.related{padding:clamp(72px,10vw,160px) var(--pad)}.section-heading{display:grid;grid-template-columns:1fr 2fr 1fr;gap:30px;align-items:end;margin-bottom:60px}.section-heading h2,.story-split h2,.collection-hero h2,.guide-hero h2,.contact-layout h2,.related h2{font:clamp(40px,5vw,84px)/.95 var(--display);margin:0}.section-heading a{text-align:right;text-decoration:underline}.product-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}.product-card img{aspect-ratio:3/4;background:var(--alt)}.product-card div{padding:15px 0}.product-card span,.product-card p{font-size:11px;text-transform:uppercase;letter-spacing:.08em}.product-card h3{font:26px var(--display);margin:5px 0}.product-card p{opacity:.65}.story-split{display:grid;grid-template-columns:1fr 1fr;min-height:760px;background:var(--ink);color:var(--paper)}.story-split img{height:100%}.story-split div{padding:var(--pad);display:flex;flex-direction:column;justify-content:center}.text-link{text-decoration:underline;margin-top:30px}.service-strip{padding:20px var(--pad);display:flex;justify-content:space-between;gap:20px;text-transform:uppercase;font-size:10px;letter-spacing:.14em;background:var(--accent);color:var(--paper)}footer{padding:70px var(--pad);display:grid;grid-template-columns:2fr 1fr 1fr;gap:40px;border-top:1px solid}footer strong{font:clamp(28px,4vw,60px)/1 var(--display)}.footer-links{display:flex;flex-direction:column;gap:10px}
.page-intro{padding:clamp(80px,10vw,160px) var(--pad);border-bottom:1px solid}.page-intro h1{margin-bottom:0}.catalog-tools{padding:25px var(--pad);display:flex;justify-content:space-between;border-bottom:1px solid}.catalog-tools div{display:flex;gap:25px;flex-wrap:wrap}.catalog-tools button{background:none;border:1px solid;padding:8px 15px}.catalog-grid,.catalog-tools+.product-grid{padding:40px var(--pad) 140px}.collection-hero{display:grid;grid-template-columns:1.2fr .8fr;min-height:680px}.collection-hero img{height:100%}.collection-hero div{padding:var(--pad);display:flex;flex-direction:column;justify-content:center;background:var(--alt)}.product-detail{display:grid;grid-template-columns:1.35fr .65fr;gap:var(--pad);padding:50px var(--pad) 140px}.gallery{display:grid;grid-template-columns:1fr 1fr;gap:12px}.gallery img{aspect-ratio:3/4}.gallery img:first-child{grid-column:1/-1;aspect-ratio:4/3}.product-detail aside{position:sticky;top:20px;height:max-content}.product-detail aside h2{font:clamp(48px,5vw,82px)/.9 var(--display);margin:10px 0}.status{padding-block:15px;border-block:1px solid}.product-detail fieldset{border:0;padding:20px 0}.product-detail fieldset button{background:transparent;border:1px solid;padding:10px;margin:8px 5px 0 0}.product-detail details,.faq details{border-top:1px solid;padding:18px 0}.related{border-top:1px solid}.related h2{margin-bottom:50px}.manifesto{padding:80px var(--pad) 140px}.manifesto p{font-size:24px;max-width:45ch}.about-gallery{display:grid;grid-template-columns:1fr 1fr}.about-gallery img{height:650px}.about-gallery div{grid-column:1/-1;padding:60px var(--pad);display:grid;grid-template-columns:1fr 1fr;gap:40px;font:clamp(24px,3vw,48px)/1.2 var(--display)}.principles,.guide-steps{display:grid;grid-template-columns:repeat(3,1fr);padding:100px var(--pad);gap:30px;background:var(--ink);color:var(--paper)}.principles article,.guide-steps article{border-top:1px solid;padding-top:25px}.principles h3,.guide-steps h3{font:36px var(--display)}.guide-hero{display:grid;grid-template-columns:1fr 1fr;min-height:650px}.guide-hero img{height:100%}.guide-hero div{padding:var(--pad);display:flex;flex-direction:column;justify-content:center;background:var(--alt)}.faq{padding:100px var(--pad);max-width:1000px;margin:auto}.faq h2{font:60px var(--display)}.contact-layout{display:grid;grid-template-columns:1fr 1fr;gap:var(--pad);padding:70px var(--pad) 140px}.contact-layout dl{margin-top:60px}.contact-layout dt{font-size:11px;text-transform:uppercase}.contact-layout dd{font:32px var(--display);margin:5px 0 30px}.contact-layout form{display:grid;gap:20px;background:var(--paper);padding:var(--pad)}label{display:grid;gap:8px;font-size:12px;text-transform:uppercase;letter-spacing:.1em}input,select,textarea{width:100%;border:0;border-bottom:1px solid;background:transparent;padding:12px 0}textarea{min-height:120px}.cart-layout{padding:60px var(--pad) 140px;display:grid;grid-template-columns:1.5fr .5fr;gap:var(--pad)}.cart-item{display:grid;grid-template-columns:180px 1fr auto;gap:25px;align-items:start;border-block:1px solid;padding:25px 0}.cart-item img{aspect-ratio:3/4}.cart-item h2{font:40px var(--display)}.cart-layout aside{background:var(--paper);padding:35px}.cart-layout aside>p{display:flex;justify-content:space-between}.cart-layout small{display:block;margin-top:20px}
body[data-layout="1"] .hero,body[data-layout="8"] .hero{grid-template-columns:.75fr 1.25fr}body[data-layout="1"] .hero-image,body[data-layout="8"] .hero-image{order:2}body[data-layout="2"] .hero{background:var(--ink);color:var(--paper)}body[data-layout="2"] .hero-copy{background:transparent}body[data-layout="3"] .hero-image{clip-path:polygon(0 0,85% 0,100% 100%,0 100%)}body[data-layout="4"] .hero-image{border-radius:0 0 45% 0}body[data-layout="5"] .hero h1{text-transform:uppercase}body[data-layout="5"] .product-card img{border:3px solid var(--ink)}body[data-layout="6"] .hero{grid-template-columns:1fr 1fr;background:linear-gradient(130deg,var(--bg),var(--alt))}body[data-layout="6"] .hero-image{border-radius:48% 48% 8px 8px;margin:40px;width:calc(100% - 80px);height:calc(100% - 80px)}body[data-layout="7"] .hero-copy{background:var(--accent);color:var(--paper)}body[data-layout="9"] .hero-image{filter:saturate(.75);clip-path:inset(4% round 50% 50% 0 0)}body[data-layout="10"] .hero{grid-template-columns:.85fr 1.15fr}body[data-layout="10"] .hero-image{order:2;filter:grayscale(.25)}
body[data-layout="11"] .hero{grid-template-columns:1fr}body[data-layout="11"] .hero-copy{position:absolute;left:var(--pad);bottom:var(--pad);max-width:min(680px,80vw);background:var(--paper);border:1px solid var(--ink)}body[data-layout="11"] .product-card img{border-radius:50% 50% 8px 8px}body[data-layout="12"] .hero{grid-template-columns:.8fr 1.2fr}body[data-layout="12"] .hero-image{order:2;margin:5vw 5vw 5vw 0;height:calc(100% - 10vw);min-height:620px}body[data-layout="12"] .hero-copy{background:var(--alt)}body[data-layout="12"] .category-rail a:nth-child(even){background:var(--paper)}body[data-layout="13"]{background:var(--bg);color:var(--ink)}body[data-layout="13"] .hero{grid-template-columns:1.35fr .65fr}body[data-layout="13"] .hero-copy{background:var(--bg)}body[data-layout="13"] .story-split{background:var(--alt);color:var(--paper)}body[data-layout="13"] .product-card img{filter:saturate(.78);border:1px solid var(--alt)}body[data-layout="13"] .page-intro,body[data-layout="13"] .catalog-tools,body[data-layout="13"] .related{border-color:var(--alt)}body[data-layout="14"] .hero{grid-template-columns:1fr 1fr;padding:35px;gap:35px}body[data-layout="14"] .hero-image{border-radius:180px 180px 24px 24px;min-height:630px}body[data-layout="14"] .hero-copy{background:transparent}body[data-layout="14"] .button{border-radius:100px}body[data-layout="14"] .product-card img{border-radius:18px}body[data-layout="15"] .hero{grid-template-columns:.9fr 1.1fr;background:linear-gradient(145deg,var(--alt),var(--bg))}body[data-layout="15"] .hero-image{order:2;clip-path:ellipse(74% 68% at 60% 48%)}body[data-layout="15"] .hero-copy{background:transparent}body[data-layout="15"] .product-card:nth-child(odd){transform:translateY(36px)}body[data-layout="16"] .hero{grid-template-columns:1fr 1fr}body[data-layout="16"] .hero-copy{background:var(--ink);color:var(--paper)}body[data-layout="16"] .hero h1{text-transform:uppercase;font-size:clamp(58px,7vw,126px)}body[data-layout="16"] .product-grid{gap:2px}body[data-layout="16"] .product-card div{padding:18px}body[data-layout="17"]{background:var(--bg);color:var(--ink)}body[data-layout="17"] .hero{grid-template-columns:.7fr 1.3fr}body[data-layout="17"] .hero-image{order:2;filter:contrast(1.08) saturate(.72)}body[data-layout="17"] .hero-copy{background:var(--bg);border-right:1px solid var(--alt)}body[data-layout="17"] .story-split{background:var(--alt);color:var(--paper)}body[data-layout="17"] .product-card img{aspect-ratio:1/1;border-radius:50%}body[data-layout="17"] .page-intro,body[data-layout="17"] .catalog-tools,body[data-layout="17"] .related{border-color:var(--alt)}
body[data-layout="18"]{background:var(--bg);color:var(--ink)}body[data-layout="18"] .hero{grid-template-columns:1.2fr .8fr;background:var(--ink);color:var(--paper);padding:34px;gap:34px}body[data-layout="18"] .hero-image{clip-path:polygon(5% 0,100% 4%,94% 100%,0 91%);filter:contrast(1.08) saturate(1.18)}body[data-layout="18"] .hero-copy{background:var(--accent);color:var(--ink);transform:rotate(-1.5deg);margin:42px 20px}body[data-layout="18"] .hero h1{text-transform:uppercase;text-shadow:4px 4px 0 var(--paper)}body[data-layout="18"] .button{background:var(--ink);color:var(--paper)}body[data-layout="18"] .category-rail a:nth-child(odd){background:var(--accent)}body[data-layout="18"] .product-card:nth-child(even){transform:rotate(1deg)}body[data-layout="18"] .product-card img{border:4px solid var(--ink)}
body[data-layout="19"] .hero{grid-template-columns:.72fr 1.28fr;background:var(--alt)}body[data-layout="19"] .hero-image{order:2;clip-path:polygon(7% 0,100% 0,100% 92%,0 100%)}body[data-layout="19"] .hero-copy{background:transparent}body[data-layout="19"] .hero h1{text-transform:uppercase;font-size:clamp(58px,7.3vw,132px)}body[data-layout="19"] .category-rail a:nth-child(2),body[data-layout="19"] .category-rail a:nth-child(4){background:var(--accent);color:var(--paper)}body[data-layout="19"] .product-grid{gap:14px}body[data-layout="19"] .product-card div{background:var(--paper);padding:18px}body[data-layout="19"] .button{box-shadow:7px 7px 0 var(--ink)}
body[data-layout="20"] .hero{grid-template-columns:1fr 1fr;padding:clamp(26px,5vw,72px);gap:clamp(30px,6vw,90px);background:var(--ink);color:var(--paper)}body[data-layout="20"] .hero-image{order:2;object-fit:contain;background:var(--paper);border-radius:50% 50% 4px 4px;padding:6vw}body[data-layout="20"] .hero-copy{background:transparent}body[data-layout="20"] .hero h1{font-size:clamp(56px,7vw,126px)}body[data-layout="20"] .category-rail{background:var(--alt)}body[data-layout="20"] .product-card img{object-fit:contain;background:var(--paper);padding:26px}body[data-layout="20"] .story-split{background:var(--ink);color:var(--paper)}body[data-layout="20"] .button{border-radius:100px}
body[data-layout="21"]{background:var(--paper);color:var(--ink)}body[data-layout="21"] .site-header{border-bottom:1px solid color-mix(in srgb,var(--ink) 24%,transparent)}body[data-layout="21"] .hero{grid-template-columns:1.25fr .75fr;min-height:86vh;background:var(--bg);padding:24px}body[data-layout="21"] .hero-image{height:calc(86vh - 48px);filter:saturate(.78) contrast(1.03);border-radius:52% 52% 4px 4px}body[data-layout="21"] .hero-copy{margin:7vh 2vw 7vh -7vw;z-index:2;background:color-mix(in srgb,var(--paper) 94%,transparent);border:1px solid var(--alt);box-shadow:0 30px 90px color-mix(in srgb,var(--ink) 14%,transparent);padding:clamp(34px,5vw,78px)}body[data-layout="21"] .hero h1{font-style:italic;font-weight:400;letter-spacing:-.055em}body[data-layout="21"] .button{border-radius:0;background:var(--accent);letter-spacing:.08em;text-transform:uppercase}body[data-layout="21"] .category-rail{border-block:1px solid var(--alt)}body[data-layout="21"] .category-rail a{font-family:var(--display);font-style:italic;font-size:clamp(23px,2.3vw,40px)}body[data-layout="21"] .product-card img{aspect-ratio:4/5;border-radius:48% 48% 0 0;filter:saturate(.9)}body[data-layout="21"] .story-split{background:var(--ink);color:var(--paper)}
body[data-layout="22"]{background:var(--paper);color:var(--ink)}body[data-layout="22"] .site-header{background:var(--ink);color:var(--paper);border:0}body[data-layout="22"] .hero{grid-template-columns:.85fr 1.15fr;background:var(--accent);padding:clamp(20px,4vw,58px);gap:clamp(24px,5vw,76px);overflow:hidden}body[data-layout="22"] .hero-image{order:2;object-fit:contain;background:var(--paper);padding:clamp(26px,5vw,80px);border-radius:50%;outline:18px solid color-mix(in srgb,var(--alt) 65%,transparent);outline-offset:-18px}body[data-layout="22"] .hero-copy{background:transparent;color:var(--paper);padding-inline:0}body[data-layout="22"] .hero h1{font-size:clamp(56px,7vw,126px);line-height:.82;text-shadow:5px 5px 0 var(--ink)}body[data-layout="22"] .button{background:var(--paper);color:var(--ink);border-radius:100px;box-shadow:6px 6px 0 var(--ink)}body[data-layout="22"] .category-rail{background:var(--bg);gap:10px;padding:10px}body[data-layout="22"] .category-rail a{border:2px solid var(--ink);border-radius:100px;background:var(--paper)}body[data-layout="22"] .category-rail a:nth-child(even){background:var(--alt)}body[data-layout="22"] .product-grid{gap:12px}body[data-layout="22"] .product-card{background:var(--bg);border:2px solid var(--ink);padding:12px}body[data-layout="22"] .product-card img{object-fit:contain;background:var(--paper);padding:20px}body[data-layout="22"] .story-split{background:var(--ink);color:var(--paper)}
body[data-layout="23"]{background:var(--bg);color:var(--ink)}body[data-layout="23"] .site-header{background:var(--ink);color:var(--paper);border-bottom:1px solid var(--accent)}body[data-layout="23"] .hero{grid-template-columns:.72fr 1.28fr;background:var(--ink);color:var(--paper);padding:clamp(20px,4vw,58px);gap:clamp(28px,5vw,74px)}body[data-layout="23"] .hero-image{order:2;height:76vh;filter:sepia(.18) saturate(.78) contrast(1.12);border:1px solid var(--accent)}body[data-layout="23"] .hero-copy{background:transparent;border-left:8px solid var(--accent);padding-left:clamp(26px,4vw,58px)}body[data-layout="23"] .hero h1{text-transform:uppercase;font-size:clamp(48px,5.6vw,102px);line-height:.86}body[data-layout="23"] .button{background:var(--accent);color:var(--paper);border-radius:0;text-transform:uppercase;letter-spacing:.08em}body[data-layout="23"] .category-rail{background:var(--ink);color:var(--paper);border-top:1px solid var(--accent)}body[data-layout="23"] .category-rail a{min-width:0;padding-inline:clamp(18px,2.2vw,32px);border-right:1px solid var(--accent);font-family:var(--display);font-size:clamp(18px,1.8vw,28px);overflow-wrap:anywhere;text-transform:uppercase}body[data-layout="23"] .product-card{border-top:4px solid var(--accent);padding-top:10px}body[data-layout="23"] .product-card img{filter:sepia(.1) saturate(.85);border-radius:0}body[data-layout="23"] .story-split{background:var(--accent);color:var(--paper)}body[data-layout="23"] .page-intro{background:var(--ink);color:var(--paper)}
@media(max-width:900px){body{font-size:16px}.site-header{height:auto;min-height:86px;grid-template-columns:1fr auto;padding-block:16px}.site-header nav{grid-column:1/-1;overflow:auto;gap:18px;padding-top:18px}.bag{grid-column:2}.hero,.collection-hero,.story-split,.guide-hero,.contact-layout,.product-detail,.cart-layout{grid-template-columns:1fr!important}.hero-image,.collection-hero img,.story-split img,.guide-hero img{order:0!important;min-height:0;height:58vh!important;margin:0!important;width:100%!important;border-radius:0!important;clip-path:none!important}.hero-copy{min-height:60vh}.hero h1,.page-intro h1,.manifesto h2{font-size:clamp(54px,18vw,92px)}.category-rail{grid-template-columns:1fr 1fr}.section-heading{grid-template-columns:1fr}.section-heading a{text-align:left}.product-grid{grid-template-columns:1fr 1fr;gap:12px}.product-card h3{font-size:20px}.story-split{min-height:0}.story-split div{min-height:60vh}.service-strip{overflow:auto;justify-content:flex-start}.page-intro{padding-block:80px}.catalog-tools{align-items:flex-start;gap:20px}.catalog-tools div{display:grid;gap:8px}.catalog-grid,.catalog-tools+.product-grid{padding-inline:16px}.product-detail{padding-inline:16px}.product-detail aside{position:static}.gallery{gap:6px}.gallery img:first-child{aspect-ratio:3/4}.about-gallery{grid-template-columns:1fr}.about-gallery img{height:56vh}.about-gallery div{grid-template-columns:1fr}.principles,.guide-steps{grid-template-columns:1fr}.contact-layout{padding-inline:20px}.cart-item{grid-template-columns:100px 1fr}.cart-item strong{grid-column:2}.cart-layout{padding-inline:20px}footer{grid-template-columns:1fr}.related,.featured{padding-inline:16px}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}`;
}

function writeBusiness(business) {
  const output = path.join(batchRoot, business.slug, "site-v2");
  fs.mkdirSync(output, { recursive: true });
  const renderers = {
    "index.html": home,
    "catalogo.html": catalog,
    "categoria.html": category,
    "produto.html": product,
    "sobre.html": about,
    "guia.html": guide,
    "contato.html": contact,
    "carrinho.html": cart,
  };
  for (const [file] of pages) {
    fs.writeFileSync(path.join(output, file), renderers[file](business), "utf8");
  }
  fs.writeFileSync(path.join(output, "styles.css"), styles(business), "utf8");
  fs.writeFileSync(path.join(output, "manifest.json"), JSON.stringify({
    business: business.name,
    niche: business.niche,
    pages: pages.map(([file, label]) => ({ file, label })),
    references: path.relative(output, path.join(projectRoot, "research", lote === "01" ? "2026-07-29-full-site-reference-matrix.md" : `2026-07-29-full-site-reference-matrix-lote-${lote}.md`)).replaceAll("\\", "/"),
    mediaSource: path.relative(output, path.join(sourceRoot, business.source)).replaceAll("\\", "/"),
    label: "Conceito visual não oficial",
    private: true,
  }, null, 2));
}

for (const business of businesses) writeBusiness(business);

const summary = {
  generatedAt: new Date().toISOString(),
  businesses: businesses.length,
  pagesPerBusiness: pages.length,
  totalPages: businesses.length * pages.length,
  outputs: businesses.map((business) => `${business.slug}/site-v2`),
};
fs.writeFileSync(path.join(batchRoot, "site-v2-summary.json"), JSON.stringify(summary, null, 2));
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
