// rebrand.cjs v2 — troca PRODUTO e MARCA dentro do fork do código real de buckssauce.
// Roda DEPOIS de fork.cjs (que regenera index.html a partir da captura). Idempotente.
const fs = require('fs');
const path = require('path');

const FORK = 'D:/AIOS/docs/projects/site-prospector/03-proposal-mockups/chokolaten/mockup-A-fork';
const CHOKO = 'D:/AIOS/docs/projects/site-prospector/03-proposal-mockups/chokolaten/assets';
let html = fs.readFileSync(path.join(FORK, 'index.html'), 'utf8');

// ───────────────── 1. assets da Chokolaten ─────────────────
const copy = (from, to) => fs.copyFileSync(from, path.join(FORK, 'assets/img', to));
for (const f of fs.readdirSync(path.join(CHOKO, 'cutout'))) copy(path.join(CHOKO, 'cutout', f), 'ck-' + f);
for (const f of fs.readdirSync(path.join(CHOKO, 'instagram')).filter(f => /\.jpg$/i.test(f))) {
  copy(path.join(CHOKO, 'instagram', f), 'ck-life-' + f);
}

// ───────────────── 2. LOGO: mascote SVG → wordmark Chokolaten ─────────────────
let logos = 0;
html = html.replace(/<svg([^>]*viewBox="0 0 118 142"[^>]*)>[\s\S]*?<\/svg>/g, (m, attrs) => {
  logos++;
  const cls = (attrs.match(/class="([^"]*)"/) || [, ''])[1];
  return `<img src="assets/img/ck-logo-chokolaten-cream.png" alt="Chokolaten" class="${cls} object-contain">`;
});

// ───────────────── 3. IMAGENS ─────────────────
const IMG = {
  // hero e cards mostram UM produto (como a garrafa única da referência);
  // os conjuntos de 3 e 6 barras vão para os kits, onde fazem sentido.
  'aaclqVxvIZEnjSXh_Untitled-19-.png': 'ck-barra-35-ao-leite.png',
  'aacj-FxvIZEnjSWv_Untitled-18-.png': 'ck-barra-70-intenso.png',
  'aacoN1xvIZEnjSbS_Untitled-20-.png': 'ck-post14-img1.png',
  'aaWD9cFoBIGEg-r3_pineapple-front.png': 'ck-barra-35-ao-leite.png',
  'aaWDusFoBIGEg-rr_pineapple-back.png': 'ck-barra-27-branco-cookies.png',
  'aaWEjcFoBIGEg-sc_habanero-front.png': 'ck-barra-70-intenso.png',
  'aaWEl8FoBIGEg-sd_habanero-back.png': 'ck-barra-45-avelas.png',
  'aaWF1cFoBIGEg-ty_cherry-front.png': 'ck-post14-img1.png',
  'aaWF38FoBIGEg-tz_cherry-back.png': 'ck-post14-img1.png',
  'empty-bottle.webp': 'ck-barra-35-ao-leite.png',
  'pineapple.webp': 'ck-barra-27-branco-cookies.png',
  'pineapple-2.webp': 'ck-barra-35-ao-leite.png',
  'habanero.webp': 'ck-barra-45-avelas.png',
  'habanero-2.webp': 'ck-barra-70-intenso.png',
  'cherry.webp': 'ck-barra-35-ao-leite.png',
  'cherry-2.webp': 'ck-barra-27-branco-cookies.png',
  'garlic.webp': 'ck-barra-70-intenso.png',
  'tomato.webp': 'ck-barra-45-avelas.png',
  'onion.webp': 'ck-barra-27-branco-cookies.png',
  'chilli.webp': 'ck-barra-70-intenso.png',
  'abpyM7bci2UF6KxN_lottie-cool-pineapple.png': 'ck-barra-35-ao-leite.png',
  'afXJ7MBOoF08xjJZ_lottie-fire_breathing-habanero.png': 'ck-barra-70-intenso.png',
  'afS2rsBOoF08xihW_lottie-sassy-cherry.png': 'ck-barra-45-avelas.png',
  'lottie-sweating-onion.webp': 'ck-barra-27-branco-cookies.png',
  'lottie-grinning-garlic.webp': 'ck-barra-35-ao-leite.png',
  'abPHtVxvIZEnjpAs_Frame14.png': 'ck-barra-27-branco-cookies.png',
  'abPIEVxvIZEnjpA6_Frame16.png': 'ck-barra-45-avelas.png',
  'abPIYlxvIZEnjpA__Frame18.png': 'ck-barra-70-intenso.png',
  'aaY4kVxvIZEnjQSM_3-pack.png': 'ck-post06-img1.png',
  'aaY4j1xvIZEnjQSL_3-pack-3-.png': 'ck-post06-img1.png',
  'aaY4llxvIZEnjQSO_6-pack.png': 'ck-post10-img1.png',
  'aaY4k1xvIZEnjQSN_6-pack-1-.png': 'ck-post10-img1.png',
  'aacr6VxvIZEnjShb_hf_20260227_163946_335a9ad0-a5cb-46d4-aa4f-f10aa97e0510-1-.png': 'ck-life-post03-img1.jpg',
  'aanljFxvIZEnjYgF_hf_20260305_201155_801eb4ef-0d00-446c-a0c6-62eaf1bd33da.png': 'ck-life-post08-img1.jpg',
  'aaTdVsFoBIGEg9m9_hf_20260302_004034_de1a3843-d018-4f42-8cd5-32bfb3c5bb98.png': 'ck-life-post11-img1.jpg',
  'aacfW1xvIZEnjSU-_image70.png': 'ck-life-post05-img1.jpg',
  'afuBA8BOoF08xsTS_Wholesale-3.jpg': 'ck-life-post12-img1.jpg',
  'aacpQ1xvIZEnjSdL_PDP-food-porn-bottom-img.png': 'ck-life-post15-img1.jpg',
};
let swapped = 0; const missing = [];
for (const [from, to] of Object.entries(IMG)) {
  if (!fs.existsSync(path.join(FORK, 'assets/img', to))) { missing.push(to); continue; }
  const re = new RegExp('assets/img/' + from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  const n = (html.match(re) || []).length;
  if (n) { html = html.replace(re, 'assets/img/' + to); swapped += n; }
}

// ───────────────── 4. TÍTULOS split-text (line > [strong] > word > char) ─────────────────
const STRONG = (html.match(/<strong class="font-normal text-background \[-webkit-text-stroke:[^"]*"/) || [])[0] || '<strong class="font-normal"';
const chars = (w) => [...w].map(c =>
  `<div class="char" aria-hidden="true" style="position: relative; display: inline-block; transform: translate(0px, 0px); opacity: 1;">${c === ' ' ? '&nbsp;' : c}</div>`).join('');
const word = (w) => `<div class="word" aria-hidden="true" style="position: relative; display: inline-block;">${chars(w)}</div>`;
const line = (words, strongCount = 0) => {
  const a = words.slice(0, strongCount).map(word).join(' ');
  const b = words.slice(strongCount).map(word).join(' ');
  return `<div class="line" aria-hidden="true" style="position: relative; display: block; text-align: center;">` +
    (strongCount ? `${STRONG}>${a}</strong> ` : '') + b + `</div>`;
};
const splitTitle = (label, lines) => ({ label, body: lines.map(([w, s]) => line(w, s)).join(' ') });

const TITLES = [
  ['The BBQ sauce that makes other sauces insecure',
    splitTitle('O chocolate que faz os outros parecerem açúcar',
      [[['O', 'chocolate', 'que'], 3], [['faz', 'os', 'outros'], 0], [['parecerem', 'açúcar'], 0]])],
  ['Choose your', splitTitle('Escolha o seu', [[['Escolha', 'o', 'seu'], 0]])],
  ['weapon', splitTitle('chocolate', [[['chocolate'], 0]])],
];
let titlesDone = 0;
for (const [oldLabel, t] of TITLES) {
  const re = new RegExp('(aria-label="' + oldLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"[^>]*>)([\\s\\S]*?)(</(?:h1|h2|span)>)');
  const m = html.match(re);
  if (!m) continue;
  html = html.replace(re, (_f, open, _inner, close) =>
    open.replace(`aria-label="${oldLabel}"`, `aria-label="${t.label}"`) + t.body + close);
  titlesDone++;
}

// ───────────────── 5. TEXTO (casing da FONTE, não do renderizado) ─────────────────
// substitui a n-ésima ocorrência por valores distintos
const nth = (needle, values) => {
  let i = 0;
  const re = new RegExp('>' + needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '<', 'g');
  html = html.replace(re, () => '>' + (values[i++] ?? values[values.length - 1]) + '<');
};

const TXT = [
  // chrome
  ['get sauce', 'comprar'], ['Your bottle is...', 'Sua sacola está...'],
  ['Add some sauce', 'Escolher chocolate'], ['proceed to checkout', 'finalizar pedido'],
  ['Product n0.0', 'Produto n0.0'], ['Shop Now', 'Ver sabores'],
  ['Crushed Pineapple Sriracha', 'Barras 25g'],
  ['Crushed Habanero Garlic', 'Linha zero açúcar'],
  ['Crushed Cherry Garlic', 'Drágeas'],
  // trust
  ['no corn syrup', 'zero açúcar'],
  ['Sweet is fine. Sugar-lab sweet is not. So we left the high fructose corn syrup on the bottom shelf where it belongs.',
    'Doce é bom. Doce de laboratório não é. A linha zero tem 38%, 55% e 70% de cacau e nenhum açúcar adicionado.'],
  ['No seed oils', 'Sem gordura vegetal'],
  ['We skip the ultra-processed seed oils and use ingredients that actually belong in food. If it reads like a chemistry project, it’s not in this bottle.',
    'Nada de gordura hidrogenada fingindo ser cacau. Se a lista parece projeto de química, não entra na nossa barra.'],
  ['no additives', 'sem aditivos'],
  ['No preservatives. No artificial nonsense. No “what is that?” ingredients hiding behind words you can’t pronounce.',
    'Sem conservante, sem invenção artificial, sem aquele ingrediente que ninguém sabe pronunciar.'],
  ['Gluten Free', 'Sem glúten'],
  ['No gluten. No thickening tricks. No drama. Just sauce that plays nice with your diet and acts up on the grill.',
    'Sem glúten, com opções sem lactose. Chocolate que cabe na sua dieta sem virar drama.'],
  // descrições de produto
  ['Pineapple sweetness. Gentle heat.', 'Seis sabores, de 27% a 70% cacau.'],
  ['Perfect balance.', 'Barra de 25g.'],
  ['Habanero Fire. Clean Burn.', '38%, 55% e 70% cacau.'],
  ['No Apologies.', 'Zero açúcar adicionado.'],
  ['Sweet Depth. Savory Backbone.', 'Ao leite 45% e branco.'],
  ['Cherry with Grit.', 'Sabor capuccino, 100g.'],
  ['Add to cart', 'Pedir no Insta'], ['Adding', 'Enviando'], ['Added', 'Anotado'],
  ['View product', 'Ver produto'],
  // why
  ['Why Bucks Sauce', 'Por Chokolaten'],
  ['We make small-batch BBQ', 'Fazemos chocolate em'],
  ['sauce because big-batch', 'pequenos lotes porque'],
  ["tastes like sadness. We're", 'lote grande tem gosto'],
  ['ending boring BBQ.', 'de pressa.'],
  ['Small batches', 'Pequenos lotes'],
  ['Small runs. No conveyor belts, just', 'Lote pequeno, sem esteira. Dá'],
  ['slow simmering, constant taste', 'para conferir cor, brilho e ponto'],
  ['checks, and Doug hovering like it', 'de tempera barra por barra, uma'],
  ['owes him money.', 'a uma.'],
  ['Real Ingredients', 'Ingrediente de verdade'],
  ['Real fruit. Fresh peppers. No powders. No syrups. No shortcuts. Fruit gets chopped, peppers get sliced, spices get blended by hand.',
    'Cacau de 27% a 70%, sem substituto barato. Chocolate que tem gosto de chocolate, não de gordura com açúcar.'],
  ['Oh, This?', 'E isso aqui?'],
  ['Philly Hot Sauce Fest 2026 —', 'Pomerode, desde 1861 — a'],
  ['“Best Sauce on a Philly', 'cidade mais alemã do Brasil.'],
  ['Cheesesteak” (2nd Place). Not bad', 'O enxaimel do rótulo é o mesmo'],
  ['for our first event.', 'da rua aqui fora.'],
  // kit
  ['buy a pack', 'monte um kit'], ['Save some Bucks', 'Do seu jeito'],
  ['3 pack', 'kit 3'], ['6 pack', 'kit 6'], ['Buy Now', 'Pedir agora'],
  // marquee: depoimentos → sabores reais (não inventar review de cliente)
  ['Kyle Seip', '27% branco'], ['I just love the product.', 'Branco com cookies.'],
  ['You’re gonna see me use it a lot. (', 'Barra de 25g. ('], ['@castiron_kyle', '@chokolaten'],
  ['The HeatBros', '35% ao leite'], ['They have amazing bbq sauce!', 'O clássico da casa.'],
  ['It was absolutely delicious. (', 'Barra de 25g. ('], ['@theheatbrosco', '@chokolaten'],
  ['Captain Cooks', '45% com avelãs'],
  ['The best BBQ sauce I’ve had in a very long time.', 'Ao leite com avelã inteira.'],
  ['It’s how BBQ sauce should taste. (', 'Barra de 25g. ('], ['@captaincooksfood', '@chokolaten'],
  ['Trey M.', '70% intenso'],
  ['Best sauce I ever had...and it\'s not close.', 'Intenso e sem lactose.'],
  ['I put it on a Popeyes chicken sandwich which was trash. This made that sandwich amazing. Bucks Sauce for life!',
    'Cacau 70%, sem lactose. Também disponível na linha zero açúcar.'],
  ['Jeffrey R.', 'Linha zero'],
  ['We don’t talk about the old sauce anymore.', '38%, 55% e 70% sem açúcar.'],
  ['It’s still in the fridge. Nobody touches it. It knows what it did.', 'O mesmo chocolate, sem açúcar adicionado.'],
  ['Jason M.', 'Drágeas'],
  ['Yeah… this replaced every other sauce I had.', 'Ao leite 45% e branco.'],
  ['Not exaggerating — this is the first BBQ sauce I’ve had that actually tastes like real ingredients.',
    'Sabor capuccino, em pote de 100g.'],
  // rodapé
  ['Join the Bucks Club', 'Entre no clube Chokolaten'],
  ['New flavors. Restocks. Fire recipes. Merch drops.', 'Sabores novos, coleção de Páscoa e avisos de reposição.'],
  ['Bucks Sauce Co. All rights reserved.', 'Chokolaten · Pomerode/SC · mockup privado, não publicado.'],
  ['Website by', 'Proposta'], ['Buzzworthy', 'Site-Prospector'],
  ['Wholesale', 'Atacado'], ['Shop', 'Barras'], ['About', 'Sobre'], ['Faq', 'FAQ'], ['Contact', 'Contato'],
  ['cart(0)', 'sacola(0)'], ['Close menu', 'Fechar menu'], ['Close cart', 'Fechar sacola'],
  ['Reviews', 'Sabores'], ['REVIEWS', 'SABORES'], ['Your email...', 'Seu e-mail...'], ['Quote', 'Aspas'],
  // aria-label do manifesto (texto corrido com as palavras dos ícones no meio)
  ['Our BBQ sauces use real, natural stuff like it’s the 1800s. splash Slap it on anything you grill and act surprised when people think you can hat cook.',
    'Nosso chocolate leva ingrediente de verdade, como se ainda fosse 1861. Feito em pequenos lotes, em Pomerode.'],
  ['Bucks Sauce', 'Chokolaten'], ['Bucks', 'Chokolaten'],
];

let hits = 0; const cold = [];
for (const [from, to] of TXT) {
  const re = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  const n = (html.match(re) || []).length;
  if (n) { html = html.replace(re, to); hits += n; } else cold.push(from.slice(0, 48));
}

// títulos dos 3 cards: mesma palavra, valores diferentes → posicional
nth('Crushed', ['Barras', 'Linha', 'Drágeas']);
nth('Pineapple', ['25g']);
nth('Sriracha', ['artesanais']);
nth('Habanero', ['zero']);
nth('Cherry', ['capuccino']);
nth('Garlic', ['açúcar', '100g']);
nth('empty', ['vazia']);
nth('Weapon', ['Chocolate']);

// ── nav/rótulos char-split: regenerar os caracteres a partir do aria-label já traduzido ──
let navFixed = 0;
html = html.replace(
  /(<span data-(?:first|second)-text="true"[^>]*aria-label="([^"]+)"[^>]*>)([\s\S]*?)(<\/span>)/g,
  (full, open, label, inner, close) => {
    if (!/class="char"/.test(inner)) return full;
    navFixed++;
    const c = [...label].map(ch =>
      `<div class="char" aria-hidden="true" style="position: relative; display: inline-block;">${ch === ' ' ? '&nbsp;' : ch}</div>`).join('');
    return open + c + close;
  });

// ── regenera a primeira sequência de <div class="char"> após um aria-label ──
// (usado por títulos split que não seguem o padrão line>word>char do h1)
const recharAfterLabel = (label) => {
  const at = html.indexOf(`aria-label="${label}"`);
  if (at < 0) return false;
  const letters = [...label];
  // Cada <div> de letra carrega seu próprio transform (arco, stagger). Por isso REAPROVEITAMOS
  // os divs existentes em vez de recriá-los: as letras que sobram ficam vazias.
  const WIN = 9000;
  const head = html.slice(0, at);
  let win = html.slice(at, at + WIN);
  const rest = html.slice(at + WIN);
  const RUN = /((?:<div (?:class="char" )?aria-hidden="true"[^>]*>[^<]?<\/div>\s*)+)/;
  if (!RUN.test(win)) return false;
  let used = 0;
  win = win.replace(RUN, (run) => {
    let i = 0;
    return run.replace(/(<div (?:class="char" )?aria-hidden="true"[^>]*>)([^<]?)(<\/div>)/g,
      (m, o, _c, c2) => { const ch = letters[i++] ?? ''; used++; return o + (ch === ' ' ? '&nbsp;' : ch) + c2; });
  });
  if (!used) return false;
  html = head + win + rest;
  return used >= letters.length;
};
const recharOk = ['SABORES'].map(l => l + ':' + recharAfterLabel(l)).join(' ');

// título em ARCO: cada letra é um <span data-arc-letter> com x/y/rotação próprios.
// Reaproveitamos os spans (mantém o arco); sobra vira vazio.
let arcN = 0;
{
  // 13 slots (o arco não tem span para espaço — os vãos já estão nas posições x).
  // 3+5+5 cai nos mesmos vãos de "Why|Bucks|Sauce" → lê "POR CHOKO LATEN".
  const letters = [...'PorChokolaten'];
  let i = 0;
  html = html.replace(/(<span data-arc-letter="true"[^>]*>)([^<]?)(<\/span>)/g, (m, o, _c, c2) => {
    arcN++;
    const ch = letters[i++] ?? '';
    return o + (ch === ' ' ? '&nbsp;' : ch) + c2;
  });
}

// ── o display gigante é dimensionado p/ "weapon" (6 letras); "chocolate" tem 9 → encolher ──
html = html.replace(/(aria-label="chocolate"[^>]*style=")([^"]*)(")/,
  (m, a, style, b) => a + style + 'font-size:19vw;' + b);

// preço: a Chokolaten não tem preço público confirmado — não inventar
html = html.replace(/\$\d+\.\d{2}/g, '');

html = html.replace(/<title>[\s\S]*?<\/title>/i, '<title>Chokolaten — chocolate artesanal de Pomerode</title>');
html = html.replace(/<html([^>]*)lang="en"/i, '<html$1lang="pt-BR"');
// ───────────────── 6. religar a troca de estado do header ─────────────────
// O JS original foi removido (era bundle do Next). Estes data-attrs + 20 linhas
// reproduzem só o comportamento do header: topo = links; rolando = pílula + ícones.
// o próprio DOM já marca os dois estados: [data-global-nav] = pílula+ícones, [data-desktop-nav] = links
html = html.replace(/<\/head>/i, `<style>
  header[data-nav]{opacity:1!important;transform:none!important}
  [data-global-nav],[data-desktop-nav]{transition:opacity .3s}
  /* !important em tudo: o DOM capturado tem opacity inline congelada pelo GSAP */
  body:not(.scrolled) [data-global-nav]{opacity:0!important;pointer-events:none!important}
  body.scrolled [data-global-nav],body.scrolled [data-global-nav] *{opacity:1!important;visibility:visible!important;pointer-events:auto}
  body.scrolled [data-desktop-nav],body.scrolled [data-desktop-nav] *{opacity:0!important;pointer-events:none!important}
  @media(prefers-reduced-motion:reduce){[data-global-nav],[data-desktop-nav]{transition:none}}
</style></head>`);

html = html.replace(/<\/body>/i,
  `<div style="position:fixed;bottom:10px;left:10px;z-index:99999;background:#322c23;color:#f5e4c7;font:12px/1.2 system-ui;padding:6px 10px;border-radius:6px">MOCKUP PRIVADO · não publicado</div>
<script>
(function(){
  var on=function(){document.body.classList.toggle('scrolled',scrollY>150);};
  addEventListener('scroll',on,{passive:true});on();
})();
</script></body>`);

fs.writeFileSync(path.join(FORK, 'index.html'), html);
console.log(`logos: ${logos} | rechar ${recharOk} | arc-letters: ${arcN}`);
console.log(`títulos  : ${titlesDone}/3 split-text`);
console.log(`imagens  : ${swapped} referências`);
console.log(`textos   : ${hits} substituições`);
if (missing.length) console.log(`⚠ asset ausente: ${[...new Set(missing)].join(', ')}`);
if (cold.length) console.log(`⚠ não achou (${cold.length}): ${cold.join(' | ')}`);
