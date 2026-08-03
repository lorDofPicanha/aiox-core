// revive-talos.cjs — roda DEPOIS do fork-talos.cjs.
//
// Problema que ele resolve: a captura do Conicorn congelou o ESTADO FINAL das animações
// dentro do HTML como style inline (opacity, filter, transform, translate3d em %). As
// bibliotecas (GSAP + ScrollTrigger + SplitText + Webflow IX2) carregam normalmente, mas
// os elementos já estão parados no fim do movimento — o site vira um print bonito.
// Foi exatamente a queixa do founder em 02/Ago: "a home está estática e sem graça".
//
// Também: aponta os vídeos de fundo para os arquivos locais (o fork deixou src no CDN da
// Webflow do site original) e limpa o link de menu da seção removida.
//
// Uso: node fork-talos.cjs && node revive-talos.cjs

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ALVO = path.join(__dirname, 'talos-site', 'index.html');
let h = fs.readFileSync(ALVO, 'utf8');
const rel = { videos: 0, descongelados: 0, marquee: 0, navLimpo: 0, opacidadeZero: 0, baixados: [] };

// ── 0. baixar os vídeos de fundo ─────────────────────────────────────────────
// Precisa rodar AQUI e não à mão: o fork-talos.cjs recria talos-site/ do zero a cada
// execução e leva a pasta de vídeo junto. Já custou uma rodada — os <source> ficaram
// apontando para arquivo inexistente e o hero voltou a ser imagem parada.
const CDN = 'https://cdn.prod.website-files.com/69abbb96278770785e4b2dc1';
const DIRV = path.join(__dirname, 'talos-site', 'assets', 'video');
const DIRI = path.join(__dirname, 'talos-site', 'assets', 'img');

function baixar(dir, nome, url, minKB = 10) {
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, nome);
  if (fs.existsSync(dest) && fs.statSync(dest).size > minKB * 1024) return;
  try {
    execFileSync('curl', ['-sL', url, '-o', dest], { stdio: 'ignore' });
    const kb = Math.round(fs.statSync(dest).size / 1024);
    if (kb < minKB) throw new Error('arquivo pequeno demais — provável erro do CDN');
    rel.baixados.push(`${nome} (${kb} KB)`);
  } catch (e) {
    console.error(`  ⚠ falhou baixar ${nome}: ${e.message}`);
  }
}

for (const [nome, url] of [
  ['hero.mp4',    `${CDN}%2F69b2815e8cd44081a7e9719d_Hero%20Video_2_mp4.mp4`],
  ['hero.webm',   `${CDN}%2F69b2815e8cd44081a7e9719d_Hero%20Video_2_webm.webm`],
  ['footer.mp4',  `${CDN}%2F69b0d1d271397d4fd4227e2d_Footer%20Video_mp4.mp4`],
  ['footer.webm', `${CDN}%2F69b0d1d271397d4fd4227e2d_Footer%20Video_webm.webm`],
]) baixar(DIRV, nome, url);

// As ilustrações Cap1–Cap5 ficaram apontando para o CDN da Webflow no fork (a captura só
// trouxe as variantes -p-500). Baixa em tamanho real para o site não depender do site de
// origem — e porque três delas vão ser repintadas em PT-BR logo abaixo.
const CAPS = [
  ['69ad5041e18e0a6c61dd1a65_Cap1.png', 'Cap1.png'], ['69ad5041ea93e995c9064911_Cap2.png', 'Cap2.png'],
  ['69ad504197f79fd83b9978e2_Cap3.png', 'Cap3.png'], ['69ad5041e96214864aa8b126_Cap4.png', 'Cap4.png'],
  ['69ad5041cad745cd865620d1_Cap5.png', 'Cap5.png'],
];
for (const [arq, curto] of CAPS) baixar(DIRI, arq, `${CDN}/${arq.split('_')[0]}_${curto}`, 20);

// ── 1. vídeos: CDN remoto → arquivo local ────────────────────────────────────
const VIDEOS = [
  [/https:\/\/cdn\.prod\.website-files\.com\/[^"'&]*Hero%20Video_2_mp4\.mp4/g,   'assets/video/hero.mp4'],
  [/https:\/\/cdn\.prod\.website-files\.com\/[^"'&]*Hero%20Video_2_webm\.webm/g, 'assets/video/hero.webm'],
  [/https:\/\/cdn\.prod\.website-files\.com\/[^"'&]*Footer%20Video_mp4\.mp4/g,   'assets/video/footer.mp4'],
  [/https:\/\/cdn\.prod\.website-files\.com\/[^"'&]*Footer%20Video_webm\.webm/g, 'assets/video/footer.webm'],
];
for (const [re, local] of VIDEOS) {
  const n = (h.match(re) || []).length;
  if (n) { h = h.replace(re, local); rel.videos += n; }
}
// poster do vídeo também apontava para o CDN — usa o jpg que veio na captura
h = h.replace(/https:\/\/cdn\.prod\.website-files\.com\/[^"'&]*Hero%20Video_2_poster[^"'&]*\.jpg/g,
  'assets/img/69abbb96278770785e4b2dc1_2F69b2815e8cd44081a7e9719d_Hero_20Video_2_poster.0000000.jpg');
h = h.replace(/https:\/\/cdn\.prod\.website-files\.com\/[^"'&]*Footer%20Video_poster[^"'&]*\.jpg/g,
  'assets/img/69abbb96278770785e4b2dc1_2F69b0d1d271397d4fd4227e2d_Footer_20Video_poster.0000000.jpg');

// ── 1b. ilustrações Cap*: CDN → local ────────────────────────────────────────
for (const [arq] of CAPS) {
  const re = new RegExp(`https://cdn\\.prod\\.website-files\\.com/[^"']*${arq.split('_')[1].replace('.', '\\.')}`, 'g');
  const n = (h.match(re) || []).length;
  if (n) { h = h.replace(re, `assets/img/${arq}`); rel.capsLocais = (rel.capsLocais || 0) + n; }
}

// ── 1c. o play morto da seção "quem somos" ───────────────────────────────────
// O template abria um lightbox com vídeo do YouTube. O fork-talos removeu o embed (vídeo
// de terceiro não é material do founder) e deixou o botão de play órfão: clicar não fazia
// nada — foi a queixa "o vídeo não leva a lugar nenhum" (02/Ago).
// Além disso o fundo era foto de banco de imagem com PESSOAS EM REUNIÃO, logo abaixo do
// título "quem somos" — sugere equipe que não existe, e CONTEXT.md §3 proíbe prova
// fabricada. Troco os dois pelo vídeo abstrato do próprio template, servido local.
// 02/Ago, 2ª rodada: founder mandou TIRAR o vídeo, não substituir. Sai o bloco inteiro.
const antesVideo = h.length;
h = h.replace(/<div class="about-video-wrap">[\s\S]*?<div class="about-video-fiiter"><\/div><\/div>/, '');
rel.playMorto = h.length !== antesVideo;

// a foto de reunião ainda estava no CSS como background — sai também
const CSS = path.join(__dirname, 'talos-site', 'styles.css');
if (fs.existsSync(CSS)) {
  let c = fs.readFileSync(CSS, 'utf8');
  const nAntes = (c.match(/69b0c7277e29e402d77aa0b3_about\.png/g) || []).length;
  c = c.replace(/linear-gradient\(#0003, #0003\), url\("https:\/\/[^"]*about\.png"\)/g,
                'linear-gradient(#0003, #0003)');
  if (nAntes) fs.writeFileSync(CSS, c, 'utf8');
  rel.fotoStock = nAntes;
}

// ── 1d. seção de RESULTADO no slot que era "case studies" ────────────────────
// O founder pediu (02/Ago): "está com falta falar mais sobre o resultado".
// O template tinha aqui uma seção de cases com três números grandes por card
// ("+40% Demo Booking", "+25% Closing Rate") — fabricados, por isso removidos.
// O slot e o CSS continuam bons: entram os mesmos números, mas MEDIDOS por terceiro,
// com estudo, ano, amostra e link. Fontes: 01-research/EVIDENCIA-SETORES.md §1.3.
// 02/Ago, 3ª rodada: o founder trocou o recorte. Eu tinha organizado por TAREFA
// (atender, redigir, analisar) — que é como o trabalho é feito. Ele pediu por RESULTADO
// DE NEGÓCIO, que é o que o dono compra. Recorte dele, evidência minha.
// 02/Ago, 4ª rodada. Founder: "deveria ser uma explicação melhor no sentido de ação direta,
// tipo 'com a IA aplicada reduziu 20% do custo da operação'". Ele está certo — eu estava
// mostrando MÉTRICA TÉCNICA ("22,4% mais exato na previsão") onde tem que ter RESULTADO DE
// NEGÓCIO. Formato agora: número grande = o que mudou no negócio · a AÇÃO que produziu ·
// quem, onde e com que grau de evidência.
const EST = [
  {
    tema: 'Aumentar receita de forma previsível',
    linha: 'IA não inventa demanda. Ela encurta o ciclo, para o vazamento no meio do caminho e melhora a previsão de quanto vem.',
    nums: [
      { n: '30 → 15 dias', d: 'o ciclo de venda caiu pela metade',
        a: 'Consulta assistida por IA para o corretor achar condição, disponibilidade e crédito durante a conversa, em vez de retornar depois.',
        f: 'Eztec, incorporadora · divulgado pela própria empresa', u: '', g: 'B' },
      { n: '70%', d: 'das vendas passaram a envolver o assistente na entrada do funil',
        a: 'Assistente recebe, tira dúvida, organiza a informação do cliente e encaminha — ligado ao CRM, ao estoque de unidades e às regras de crédito.',
        f: 'MRV · divulgado pela empresa, reproduzido por ABECIP e imprensa', u: '', g: 'B' },
      { n: '22,4%', d: 'de erro a menos na previsão de venda que o melhor método estatístico',
        a: 'Previsão de demanda por aprendizado de máquina. Na prática: menos prateleira vazia e menos dinheiro parado em estoque.',
        f: 'Competição M5 · International Journal of Forecasting · 2022 · 42.840 séries de venda da Walmart, 5.507 equipes',
        u: 'https://www.sciencedirect.com/science/article/pii/S0169207021001874', g: 'A' },
    ],
  },
  {
    tema: 'Reduzir custo, tempo e dependência',
    linha: 'Hora economizada é o ganho fácil de medir. Dependência é o que muda a empresa — e é onde a evidência é mais consistente.',
    nums: [
      { n: '−15,8%', d: 'na conta de energia do prédio — US$ 42 mil por ano',
        a: 'IA no controle da climatização, antecipando clima e ocupação em vez de reagir ao termostato. Prédio de 32 andares, 11 meses medidos.',
        f: 'Edifício 45 Broadway, Manhattan · divulgado pelo operador, coberto pela revista TIME',
        u: 'https://time.com/7201501/ai-buildings-energy-efficiency/', g: 'B' },
      { n: '790 h', d: 'e US$ 60 mil economizados em quatro obras',
        a: 'IA lendo contrato e documentação técnica e respondendo com a fonte exata, no lugar de alguém procurar à mão.',
        f: 'Cleveland Construction · estudo de caso publicado pelo fornecedor', u: '', g: 'C' },
      { n: '+30%', d: 'de produtividade entre os funcionários MENOS experientes (média geral: +15%)',
        a: 'Assistente ao lado do atendente durante a conversa. O efeito maior nos iniciantes é o que tira a operação da dependência de uma pessoa só.',
        f: 'Brynjolfsson, Li &amp; Raymond · Quarterly Journal of Economics · mai/2025 · 5.172 atendentes',
        u: 'https://academic.oup.com/qje/article/140/2/889/7990658', g: 'A' },
    ],
  },
  {
    tema: 'Controle, previsibilidade e menos risco',
    linha: 'Prazo que estoura e retrabalho que aparece tarde custam mais que a mão de obra. Os dois se resolvem vendo o desvio cedo.',
    nums: [
      { n: '500 → 396 dias', d: 'de cronograma: −18% de prazo e −30% de custo no cenário analisado',
        a: 'Simulação de milhares de combinações de sequência, equipe e equipamento para achar o caminho mais curto — sem contratar mais gente.',
        f: 'AF Gruppen · estudo de caso publicado pelo fornecedor', u: '', g: 'C' },
      { n: '−4,3%', d: 'no custo de retrabalho por fábrica, e cerca de 4 semanas de atraso evitadas',
        a: 'Captura 360° da obra comparada ao projeto e ao cronograma, apontando o que saiu fora antes de ser fechado na parede.',
        f: 'Intel · estudo de caso publicado pelo fornecedor', u: '', g: 'C' },
      { n: '−19 p.p.', d: 'de acerto quando a IA é aplicada no processo errado',
        a: 'Este é o resultado de NÃO escolher onde aplicar. Fora da competência da IA ela não fica neutra: piora o que estava funcionando.',
        f: 'Dell’Acqua et al. · Organization Science · 2025 · 758 consultores',
        u: 'https://pubsonline.informs.org/doi/10.1287/orsc.2025.21838', g: 'A' },
    ],
  },
];

const grauTexto = { A: 'estudo revisado ou dado de governo', B: 'divulgado pela empresa que aplicou', C: 'case de quem vende a tecnologia' };

// usa as classes de título/descrição do próprio design system do template
// (.value-card-title = --font-size--title-s, line-height 1.1). Antes eu tinha chumbado
// 1.6rem na mão, que era o que fazia o título destoar do resto da página.
const cards = EST.map((e, i) => `
  <div class="value-card tl-card">
    <div class="tl-card-cab">
      <div class="eye-brow"><div class="eye-brow-number">0${i + 1}</div></div>
      <div class="value-card-title">${e.tema}</div>
    </div>
    <p class="value-card-desc tl-card-linha">${e.linha}</p>
    <div class="tl-nums">${e.nums.map(x => `
      <div class="casestudy-card-number-wrap tl-num">
        <div class="casestudy-card-number">${x.n}</div>
        <div class="casestudy-card-number-title">${x.d}</div>
        <p class="tl-acao"><span class="tl-acao-rot">o que foi feito</span>${x.a}</p>
      </div>`).join('')}
    </div>
  </div>`).join('');

const SECAO_RESULTADO = `
<section id="resultado-section" class="section">
  <div class="padding-global"><div class="container-medium">
    <div class="value-layout">
      <div class="heading-layout">
        <div class="eye-brow"><div class="eye-brow-number">005</div>
          <div class="eye-brow-text-wrap"><div class="eye-brow-dot"></div>
          <div class="eye-brow-text">resultado</div></div></div>
        <div class="heading-wrap">
          <h2 class="heading-style-h2">Três coisas que a sua empresa pode ganhar</h2>
          <p class="subheading-text">Resultados medidos em empresas reais, com a ação que produziu
          cada um.</p>
        </div>
      </div>
      <div class="tl-grid">${cards}</div>
      <div class="tl-fecho">
        <p><strong>Nenhum desses números é promessa.</strong> São ordens de grandeza medidas em outras
        empresas, com outra maturidade e outro processo. Servem para dimensionar um piloto — não para
        prever o seu resultado. Quem te promete percentual antes de olhar o seu processo está
        chutando.</p>
      </div>
    </div>
  </div></div>
</section>`;

const CSS_RESULTADO = `
<style id="tl-resultado">
  #resultado-section .tl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-top:2rem}
  #resultado-section .tl-card{display:flex;flex-direction:column;gap:1rem;padding:2.25rem 2rem}
  #resultado-section .tl-card-cab{display:flex;flex-direction:column;gap:.75rem;
    min-height:6.5rem}
  #resultado-section .value-card-title{text-wrap:balance}
  #resultado-section .tl-card-linha{line-height:1.55;color:var(--_color---grey--04);
    margin:0;padding-bottom:.75rem;text-wrap:pretty}
  #resultado-section .tl-nums{display:flex;flex-direction:column;gap:1.5rem;flex:1}
  /* o .casestudy-card-number-wrap do template tem white-space:nowrap — foi feito para
     rótulo de duas palavras ("Demo Booking"). Aqui embaixo mora a linha de fonte inteira,
     então tem que voltar a quebrar, senão o crédito do estudo sai cortado na direita. */
  #resultado-section .tl-num{border-top:1px solid var(--_color---grey--07);padding-top:1rem;
    gap:.35rem;white-space:normal;align-items:stretch;text-align:left}
  #resultado-section .casestudy-card-number-title{line-height:1.45;white-space:normal;
    font-weight:var(--font-weight--medium);color:var(--_color---grey--01)}
  #resultado-section .tl-card{text-align:left}
  #resultado-section .tl-acao{font-size:var(--font-size--body-s);line-height:1.55;
    color:var(--_color---grey--03);margin:.5rem 0 0}
  #resultado-section .tl-acao-rot{display:block;font-size:.72rem;letter-spacing:.08em;
    text-transform:uppercase;color:var(--_color---grey--05);margin-bottom:.15rem}
  #resultado-section .tl-fecho{margin-top:2.5rem;max-width:46rem}
  #resultado-section .tl-fecho p{font-size:var(--font-size--body-m);line-height:1.6;color:var(--_color---grey--03)}
  @media (max-width:991px){#resultado-section .tl-grid{grid-template-columns:1fr}
    #resultado-section .tl-fecho{grid-template-columns:1fr}}
</style>`;

// ── 1g. movimento ────────────────────────────────────────────────────────────
// Diagnóstico de 02/Ago, medido no Chrome real (não suposto):
//   · os dois vídeos de fundo carregam inteiros (readyState 4, muted, autoplay) e ficam
//     em paused:true com currentTime 0. Chamar play() na mão funciona sem erro — ou seja,
//     não é bloqueio do navegador, é o componente do Webflow que não dispara na captura.
//   · o hero fica em opacity 1 já aos 400ms, sem transform: a entrada nunca roda.
//   · a seção de resultado é HTML meu, sem data-w-id — o IX2 nem sabe que ela existe.
// Os reveals do IX2 funcionam (conferido rolando devagar), então NÃO mexo neles.
// Regra que não pode ser quebrada: o estado inicial é aplicado por gsap.from em tempo de
// execução. Nunca no HTML — senão a página fica invisível com o JS desligado, que já
// queimou este projeto antes.
const SCRIPT_MOV = `
<script id="tl-mov">
(function () {
  function tocarVideos() {
    document.querySelectorAll('video').forEach(function (v) {
      v.muted = true; v.playsInline = true;
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    });
  }
  tocarVideos();
  // rede de segurança: se a política de autoplay barrar, o 1º gesto do visitante resolve
  ['pointerdown', 'keydown', 'touchstart', 'scroll', 'mousemove'].forEach(function (ev) {
    window.addEventListener(ev, tocarVideos, { once: true, passive: true });
  });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) tocarVideos(); });
  document.querySelectorAll('video').forEach(function (v) {
    v.addEventListener('canplay', tocarVideos, { once: true });
    v.addEventListener('loadeddata', tocarVideos, { once: true });
  });

  // ── plano B para o fundo do hero ────────────────────────────────────────────
  // Medido no Chrome: o vídeo do hero roda em loop contínuo (6,2 s) e o fundo se mexe.
  // Mas se o navegador do visitante recusar o autoplay — política de mídia, economia de
  // energia, extensão — o que sobra é o poster parado, e a primeira dobra morre. Antes
  // essa falha era engolida por um .catch vazio. Agora, se em 2,5 s o vídeo não tiver
  // andado, o fundo ganha deriva própria em CSS: não é o ideal, mas nunca fica estático.
  setTimeout(function () {
    var v = document.querySelector('.hero-bg-video video');
    if (!v) return;
    var andou = !v.paused && v.currentTime > 0.3;
    if (andou) return;
    var alvo = document.querySelector('.hero-bg-video');
    if (!alvo) return;
    var st = document.createElement('style');
    st.textContent = '@keyframes tlDeriva{0%{transform:scale(1.02) rotate(0deg)}' +
      '50%{transform:scale(1.10) rotate(1.2deg)}100%{transform:scale(1.02) rotate(0deg)}}' +
      '.tl-deriva{animation:tlDeriva 24s ease-in-out infinite;will-change:transform}';
    document.head.appendChild(st);
    alvo.classList.add('tl-deriva');
    if (window.console) console.warn('[talos] o navegador barrou o autoplay do vídeo do hero — ativei a deriva de reserva no fundo.');
  }, 2500);

  function iniciar() {
    if (!window.gsap) return;
    var gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
    var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── abertura ────────────────────────────────────────────────────────────
    // O .preloader do template nasce com opacity:0 no CSS e depende de um GSAP que
    // não sobreviveu à captura: nunca aparece, e nada dispara a entrada do hero —
    // que é por isso que a primeira dobra parecia morta. Aqui a coreografia é
    // reconstruída: logo + Talos aparecem, saem, e só então o hero entra.
    // Sem JS o preloader continua invisível (opacity:0 do CSS) e a página funciona.
    var pre = document.querySelector('.preloader');
    var tl = gsap.timeline();

    // NÃO animo o hero por conta própria. Tentei, e criar um SplitText no mesmo <h1> que o
    // template já divide fazia as duas animações brigarem — a headline sumia da tela.
    // A coreografia do template está intacta; o que faltava era só acender o preloader.

    if (reduz) { if (pre) pre.style.display = 'none'; return; }

    if (pre) {
      // A coreografia de abertura do TEMPLATE funciona — as letras entram escalonadas pelo
      // SplitText dele. O que faltava era alguém acender o preloader: o CSS o deixa em
      // opacity:0 esperando um GSAP que a captura não trouxe. Então eu só acendo e deixo
      // a animação original rodar; animar por cima faria as duas brigarem pelo mesmo alvo.
      var logo = pre.querySelector('.preload-logo');
      if (logo) gsap.set(logo, { clearProps: 'transform', visibility: 'visible' });
      gsap.set(pre, { opacity: 1, pointerEvents: 'auto' });

      // saída própria, com folga para a entrada original terminar
      // A SAÍDA precisa ser minha: medido, o template acende e anima a entrada, mas nunca
      // tira o preloader da frente — deixado por conta dele a tela fica preta para sempre.
      // O atraso de 1,9s dá tempo da entrada original terminar antes de sair.
      tl.to(pre, { opacity: 0, duration: .6, ease: 'power2.inOut', delay: 1.9,
        onComplete: function () { pre.style.display = 'none'; } });
    }

    // a seção de resultado é HTML injetado: o IX2 não a conhece, então entra por aqui
    if (window.ScrollTrigger) {
      document.querySelectorAll('#resultado-section .tl-card').forEach(function (c, i) {
        gsap.from(c, { y: 40, opacity: 0, filter: 'blur(4px)', duration: .8, ease: 'power2.out',
          delay: i * .1, scrollTrigger: { trigger: c, start: 'top 88%' } });
      });
      var cab = document.querySelector('#resultado-section .heading-layout');
      if (cab) gsap.from(cab, { y: 28, opacity: 0, duration: .8, ease: 'power2.out',
        scrollTrigger: { trigger: cab, start: 'top 90%' } });
      document.querySelectorAll('#resultado-section .casestudy-card-number').forEach(function (n) {
        gsap.from(n, { scale: .92, opacity: 0, duration: .6, ease: 'back.out(1.6)',
          scrollTrigger: { trigger: n, start: 'top 92%' } });
      });
    }
  }

  if (document.readyState === 'complete') iniciar();
  else window.addEventListener('load', iniciar);
})();
</script>`;

const marcaProj = '<!-- seção "project-section" removida pelo fork-talos -->';
if (h.includes(marcaProj)) {
  h = h.replace(marcaProj, SECAO_RESULTADO);
  h = h.replace('</head>', CSS_RESULTADO + '</head>');
  rel.secaoResultado = true;
}
// o script de movimento entra no fim do body, depois de gsap/SplitText/ScrollTrigger
h = h.replace('</body>', SCRIPT_MOV + '</body>');
rel.movimento = h.includes('id="tl-mov"');

// ── 1d-bis. o preloader ainda soletrava CONICORN ─────────────────────────────
// A captura salvou a palavra já quebrada pelo SplitText: <div>C</div><div>o</div>...
// Por isso o par de texto "Conicorn"→"Talos" nunca casou — não existe a string
// "Conicorn" no arquivo, existem oito divs de uma letra. O aria-label virou "Talos"
// e a tela continuou mostrando Conicorn. Devolve o miolo a texto puro: o SplitText
// do runtime volta a dividir sozinho, que é como o template foi feito para funcionar.
{
  const antes = h;
  h = h.replace(/(<div class="preload-text"[^>]*>)[\s\S]*?(<\/div>)(?=<\/div>)/,
    '$1Talos$2');
  rel.preloader = antes !== h;
}

// ── 1e. FAQ: o template repetia a MESMA resposta nas 5 perguntas ─────────────
// As 5 respostas eram idênticas em inglês no template (placeholder), então a troca de
// texto global do fork carimbou a mesma tradução nas cinco. Aqui cada uma é substituída
// pela posição, na ordem em que aparecem.
const RESPOSTAS = [
  // 1 · Com que tipo de empresa vocês trabalham?
  'Indústria, comércio e serviço — de empresa com equipe pequena a operação com várias frentes. O que define não é o ramo nem o tamanho: é ter um processo que se repete, consome hora de gente cara e hoje depende de alguém lembrar de fazer.',
  // 2 · Quanto tempo leva para implantar?
  'O primeiro processo costuma ir ao ar entre 2 e 6 semanas, dependendo de quantos sistemas precisam conversar. Fluxo simples, ligado a uma ferramenta que você já usa, fica perto de 2 a 3 semanas. Integração entre várias plataformas, com regra de decisão sob medida e painel, vai para 4 a 6 semanas ou mais.',
  // 3 · Precisa ter alguém técnico na empresa?
  'Não. Quem precisa participar é quem conhece o processo — normalmente a pessoa que faz ele hoje. A parte técnica é minha. O que eu peço da sua equipe é tempo para eu entender como a coisa funciona de verdade, e não como está escrito no manual.',
  // 4 · A automação é segura?
  'As fontes que a IA consulta são definidas por você e ficam restritas ao que foi autorizado. Nada de decisão automática em coisa crítica: a máquina prepara, a pessoa responsável aprova antes de sair. O dado é seu, com exportação garantida, e isso entra por escrito antes de começar.',
  // 5 · Que retorno dá para esperar?
  'Eu não prometo percentual, e desconfie de quem promete antes de olhar o seu processo. O que eu faço é medir o tempo que ele consome hoje, implantar, e comparar depois. Se não melhorar, isso também vai no relatório. Os números que estão nesta página são de estudo de terceiro e servem para dimensionar o piloto, não para prever o seu resultado.',
];
{
  const re = /(<p class="faq-item-answer-text">)([\s\S]*?)(<\/p>)/g;
  let i = 0;
  h = h.replace(re, (todo, ini, _meio, fim) => (i < RESPOSTAS.length) ? ini + RESPOSTAS[i++] + fim : todo);
  rel.faq = i;
}

// ── 1f. remoções pedidas pelo founder (02/Ago) ───────────────────────────────
// redes sociais: os links do template apontam para linkedin.com / instagram.com genéricos.
const antesSocial = h.length;
h = h.replace(/<a[^>]*href="https?:\/\/(?:www\.)?(?:linkedin|instagram|facebook|twitter|x)\.com[^"]*"[\s\S]*?<\/a>/g, '');
rel.social = antesSocial !== h.length;

// fotos de pessoa de banco de imagem: aparecem no botão do hero e no card "não sabe por
// onde começar". Não são o founder nem clientes — sugerem gente que não existe.
const antesAvt = (h.match(/contact-avt/g) || []).length;
h = h.replace(/<div class="button-contact-avt[^"]*"[^>]*>[\s\S]*?<\/div>/g, '');
h = h.replace(/<img[^>]*contact-avt[^>]*>/g, '');
rel.avatares = antesAvt;

// o botão de enviar veio da captura travado em estado de carregando: disabled + a classe
// w-form-loading. Assim ele nunca envia nada.
h = h.replace(/(<input[^>]*type="submit"[^>]*)\sdisabled=""/g, '$1');
h = h.replace(/(<input[^>]*type="submit"[^>]*class="[^"]*?)\s*w-form-loading/g, '$1');

// ── 2. descongelar ───────────────────────────────────────────────────────────
// Só as propriedades que a animação controla. O resto do style inline fica intacto
// (background-image do vídeo, por exemplo, é layout e não pode sair).
const ANIMADAS = ['filter', 'opacity', 'transform', 'transform-style', 'translate', 'rotate', 'scale',
                  '-webkit-transform', 'will-change'];

function limparStyle(styleTxt) {
  const mantidas = [];
  let removeu = false;
  for (const decl of styleTxt.split(';')) {
    const d = decl.trim();
    if (!d) continue;
    const prop = d.split(':')[0].trim().toLowerCase();
    if (ANIMADAS.includes(prop)) { removeu = true; continue; }
    mantidas.push(d);
  }
  return { style: mantidas.join('; '), removeu };
}

// aplica em qualquer tag que carregue style inline com propriedade de animação
h = h.replace(/<([a-zA-Z][\w-]*)((?:\s+[^>\s]+(?:="[^"]*")?)*?)\s+style="([^"]*)"((?:\s+[^>\s]+(?:="[^"]*")?)*)\s*(\/?)>/g,
  (todo, tag, antes, style, depois, fecha) => {
    if (!/(?:^|;)\s*(?:filter|opacity|transform|translate|rotate|scale|will-change)\s*:/i.test(style)) return todo;
    const { style: novo, removeu } = limparStyle(style);
    if (!removeu) return todo;
    if (/opacity\s*:\s*0(?:\.0+)?\s*(?:;|$)/i.test(style)) rel.opacidadeZero++;
    rel.descongelados++;
    const attrStyle = novo ? ` style="${novo}"` : '';
    return `<${tag}${antes}${attrStyle}${depois}${fecha ? ' /' : ''}>`;
  });

rel.marquee = (h.match(/statics-marquee-list/g) || []).length;

// ── 3. link de menu da seção removida ────────────────────────────────────────
h = h.replace(/<a[^>]*href="#integrations-section"[^>]*>[\s\S]*?<\/a>/g, () => { rel.navLimpo++; return ''; });

fs.writeFileSync(ALVO, h, 'utf8');

// ── 4. texto em inglês cravado dentro das ilustrações ────────────────────────
try {
  const saida = execFileSync('python', [path.join(__dirname, 'traduzir-imagens.py')],
    { encoding: 'utf8', env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });
  rel.imagens = saida.trim();
} catch (e) {
  rel.imagens = `⚠ falhou traduzir imagens: ${e.message}`;
}

if (rel.baixados.length) console.log(`baixados...................... ${rel.baixados.join(', ')}`);
console.log(`vídeos apontados para local... ${rel.videos}`);
console.log(`ilustrações Cap* → local...... ${rel.capsLocais || 0}`);
console.log(`bloco de vídeo removido....... ${rel.playMorto ? 'sim' : 'NÃO ACHOU (conferir)'}`);
console.log(`seção de resultado injetada... ${rel.secaoResultado ? 'sim — 3 estudos, 9 números, fonte clicável' : 'NÃO (marca não encontrada)'}`);
console.log(`foto de reunião no CSS........ ${rel.fotoStock ? 'removida' : 'não achou'}`);
console.log(`texto dentro de imagem:\n${rel.imagens}`);
console.log(`elementos descongelados....... ${rel.descongelados}`);
console.log(`  destes, estavam em opacity:0. ${rel.opacidadeZero}  (ficariam invisíveis sem JS — agora aparecem)`);
console.log(`faixas de marquee soltas...... ${rel.marquee}`);
console.log(`links de menu órfãos removidos ${rel.navLimpo}`);
console.log(`\n→ ${ALVO}`);
