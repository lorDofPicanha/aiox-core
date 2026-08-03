/**
 * build.mjs — gerador do mockup-v2 (gate F4)
 *
 * ESPINHA  ← wf-conicorn  (sequência numerada de argumento de agência de automação:
 *                          pílula `NNN ● RÓTULO` → H2 centrado → subhead centrado → bloco)
 * GESTO    ← fr-stackgrid (sistema de LINHA: moldura de folha, filete, marca de corte,
 *                          chip sólido, borda tracejada, linha-guia com etiqueta)
 * TOKENS   ← 05-build/squad/DIRECAO-ARTE.md (bronze #E9A23B sobre escuro)
 * COPY     ← 05-build/squad/COPY-V2.md (PT-BR, zero lorem)
 * ORDEM    ← 05-build/squad/ARQUITETURA-SECOES.md §2.1
 *
 * 🔴 PELE DO CONICORN QUE NÃO VEIO: iridescência policromática (6 buckets de matiz),
 *    superfície branca, ícones 3D vidrados, logo de cliente, número de vitrine, vídeo de stock.
 *
 * Saída: index.html (navegável) + secoes/NN-*.html (aprovação uma de cada vez) + css/ + js/
 */
import { mkdirSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const out = (...p) => join(DIR, ...p);
for (const d of ["css", "js", "fonts", "secoes"]) mkdirSync(out(d), { recursive: true });

/* ══════════════════════════════════════════════════════════════════════════
   1 · SISTEMA VISUAL
   ══════════════════════════════════════════════════════════════════════════ */

const CSS = String.raw`
/* ─────────────────────────────────────────────────────────────────────────
   TOKENS — todos de 05-build/squad/DIRECAO-ARTE.md. Nenhum inventado aqui.
   Contraste de todo par em uso: NOTAS.md §4 (medido, não estimado).
   ───────────────────────────────────────────────────────────────────────── */
:root{
  /* superfície — matiz 0°, saturação 0%. Bronze é o ÚNICO elemento cromático. */
  --bg:#0f0f0f; --surf:#141414; --card:#1a1a1a; --card-hover:#212121;
  --border:#262626; --border-strong:#303030;
  /* tinta */
  --ink:#fafafa; --ink-2:#fafafaa8; --ink-3:#fafafa7d; --ink-4:#fafafa5c;
  /* bronze */
  --bronze:#E9A23B; --bronze-hover:#df9320; --bronze-2:#de9517; --on-bronze:#190f00;
  --bronze-wash:#E9A23B0d; --bronze-soft:#E9A23B1a; --bronze-ring:#E9A23B38; --bronze-glow:#E9A23B66;
  /* pílula do eyebrow — gesto conicorn invertido (lá é preto 7% sobre branco) */
  --chip:#ffffff08;
  /* forma */
  --r-sm:6px; --r-btn:10px; --r-card:16px; --r-panel:20px; --r-pill:999px;
  /* tipo */
  --font-sans:"Inter var","Inter",system-ui,-apple-system,"Segoe UI",sans-serif;
  --font-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,monospace;
  --t-display:62px; --t-h2:44px; --t-h3:32px; --t-h4:21px; --t-h5:18px;
  --t-body-lg:17px; --t-body:15px; --t-body-sm:14px; --t-caption:13px;
  --t-label:11px; --t-micro:10px;
  /* movimento */
  --ease:cubic-bezier(.16,1,.3,1);
  /* moldura de folha (gesto stackgrid) */
  --frame:1280px; --content:1080px; --wide:1200px;
}

/* ── FONTES SELF-HOSTED (zero CDN). SIL OFL 1.1 — redistribuição permitida. */
@font-face{font-family:"Inter var";src:url("../fonts/InterVariable.woff2") format("woff2");
  font-weight:100 900;font-style:normal;font-display:swap;}
@font-face{font-family:"JetBrains Mono";src:url("../fonts/JetBrainsMono.woff2") format("woff2");
  font-weight:100 800;font-style:normal;font-display:swap;}

*,*::before,*::after{box-sizing:border-box}
html{
  /* o eixo óptico que a referência ignora — 0 KB, o eixo já está no arquivo */
  font-optical-sizing:auto;
  -webkit-text-size-adjust:100%;
}
body{
  margin:0;background:var(--bg);color:var(--ink);
  font-family:var(--font-sans);font-size:var(--t-body);line-height:1.7;
  font-synthesis-weight:none;-webkit-font-smoothing:antialiased;
}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
button,input,textarea,select{font:inherit;color:inherit}
:focus-visible{outline:2px solid var(--bronze);outline-offset:2px;border-radius:2px}
::selection{background:var(--bronze-ring);color:var(--ink)}

/* ═════ MOLDURA DE FOLHA — gesto nº 1 do stackgrid ═════
   Dois filetes verticais fixos emoldurando a página como folha sobre a mesa.
   Achromático. É a estrutura desenhada com LINHA, não com bloco de cor. */
.folha{position:fixed;inset:0;pointer-events:none;z-index:3}
.folha i{position:absolute;top:0;bottom:0;width:1px;background:var(--border)}
.folha i:first-child{left:calc(50% - var(--frame)/2)}
.folha i:last-child{right:calc(50% - var(--frame)/2)}
@media (max-width:1360px){.folha{display:none}}

/* ═════ SHELL DE SEÇÃO ═════ */
.sec{
  position:relative;border-top:1px solid var(--border);
  padding:128px max(24px,5%);
  scroll-margin-top:96px;
}
.sec--surf{background:var(--surf)}
.sec--tira{border-bottom:1px solid var(--border);padding-block:96px}
.wrap{max-width:var(--content);margin-inline:auto}
.wrap--wide{max-width:var(--wide)}
@media (max-width:1100px){.sec{padding:96px max(20px,5%)}}
@media (max-width:640px){.sec{padding:80px 20px}}

/* ═════ CABEÇALHO DE SEÇÃO — a espinha do conicorn ═════
   pílula numerada centrada → H2 centrado → subhead centrado.
   No conicorn: .eye-brow > .eye-brow-number + .eye-brow-dot + .eye-brow-text,
   padding:.6em 1em, border-radius:round, text-transform:uppercase. */
.sec-head{text-align:center;position:relative}
.pill{
  display:inline-flex;align-items:center;gap:.6em;
  padding:.6em 1em;border-radius:var(--r-pill);
  background:var(--chip);border:1px solid var(--border);
  font-family:var(--font-mono);font-size:var(--t-label);font-weight:700;
  /* 🔴 PT-BR: 1.152em é o vão medido de Ã(+0.9424em) a Ç(−0.2095em) na Inter real.
     1.2 do token deixava 0,5px de folga. 1.45 dá 3,3px. Medição em NOTAS.md §5. */
  line-height:1.45;letter-spacing:.16em;text-transform:uppercase;
}
.pill-n{color:var(--ink-3);font-weight:500}
.pill-t{display:inline-flex;align-items:center;gap:.45em;color:var(--bronze)}
.pill-dot{width:.55em;height:.55em;border-radius:50%;background:var(--bronze);flex:none}
.sec-head h2{
  margin:24px 0 0;font-size:var(--t-h2);font-weight:800;
  /* PT-BR: 1.06 do token dava 4,4px de folga sobre o vão de caixa baixa acentuada
     (0.9604em, medido). 1.10 dá 6,2px — acomoda "ã/ç/ê" sem colisão. */
  line-height:1.10;letter-spacing:-.035em;text-wrap:balance;
}
.sec-head .lead{
  margin:20px auto 0;max-width:62ch;color:var(--ink-2);
  font-size:var(--t-body-lg);line-height:1.65;text-wrap:pretty;
}
.sec-body{margin-top:56px}

/* ═════ MARCA DE CORTE — gesto nº 2 do stackgrid ═════
   Duas hairlines cruzadas ladeando a pílula. Puro filete, some na inversão? Não: sobrevive. */
.crop{position:relative;display:inline-block}
.crop::before,.crop::after{
  content:"";position:absolute;top:50%;width:9px;height:9px;
  background:
    linear-gradient(var(--border-strong),var(--border-strong)) center/9px 1px no-repeat,
    linear-gradient(var(--border-strong),var(--border-strong)) center/1px 9px no-repeat;
  transform:translateY(-50%);
}
.crop::before{left:-26px}
.crop::after{right:-26px}
@media (max-width:640px){.crop::before,.crop::after{display:none}}

/* ═════ CHIP SÓLIDO — gesto nº 3 do stackgrid ═════
   Lá é retângulo preto com texto branco sobre folha branca.
   Aqui inverte: retângulo --card com filete e texto mono. Nunca campo bronze. */
.chip{
  display:inline-flex;align-items:center;gap:6px;
  padding:5px 9px;border-radius:var(--r-sm);
  background:var(--card);border:1px solid var(--border-strong);
  font-family:var(--font-mono);font-size:var(--t-micro);font-weight:700;
  line-height:1.45;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-3);
}
.chip--on{color:var(--bronze);border-color:var(--bronze-ring);background:var(--bronze-soft)}

/* ═════ LINHA-GUIA COM ETIQUETA — gesto nº 4 do stackgrid ═════ */
.guia{display:flex;align-items:center;gap:0}
.guia .traco{height:1px;background:var(--border-strong);flex:1;min-width:24px}
.guia .traco--bronze{background:var(--bronze-ring)}

/* ═════ TIPOGRAFIA ═════ */
.mono{font-family:var(--font-mono)}
.tabular{font-feature-settings:"tnum" 1} /* aplicar na Inter, onde a feature EXISTE */
.t-micro{
  font-family:var(--font-mono);font-size:var(--t-micro);font-weight:600;
  line-height:1.45;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-3);
}
.t-label{
  font-family:var(--font-mono);font-size:var(--t-label);font-weight:700;
  line-height:1.45;letter-spacing:.16em;text-transform:uppercase;
}
.t-h3{font-size:var(--t-h3);font-weight:800;line-height:1.14;letter-spacing:-.02em;margin:0}
.t-h5{font-size:var(--t-h5);font-weight:700;line-height:1.40;letter-spacing:-.01em;margin:0}
.t-body{font-size:var(--t-body);line-height:1.7;margin:0}
.t-body-sm{font-size:var(--t-body-sm);line-height:1.6;margin:0;color:var(--ink-2)}
.t-cap{font-size:var(--t-caption);line-height:1.5;color:var(--ink-3);margin:0}
.ink2{color:var(--ink-2)} .ink3{color:var(--ink-3)} .bronze{color:var(--bronze)}

/* ═════ BOTÃO ═════ */
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  height:48px;padding:0 22px;border-radius:var(--r-btn);
  font-size:var(--t-body);font-weight:700;line-height:1.2;
  border:1px solid transparent;cursor:pointer;text-align:center;
  transition:background .2s var(--ease),border-color .2s var(--ease),transform .12s var(--ease);
}
.btn-1{background:var(--bronze);color:var(--on-bronze);box-shadow:0 8px 24px -6px var(--bronze-glow)}
.btn-1:hover{background:var(--bronze-hover)}
.btn-1:active{transform:scale(.98)}
.btn-2{background:transparent;color:var(--ink);border-color:var(--border-strong);font-weight:600}
.btn-2:hover{background:#ffffff0f}
.btn-sm{height:40px;padding:0 16px;font-size:var(--t-body-sm)}
@media (max-width:640px){.btn{padding:0 18px}}
.cta-mono{
  display:inline-flex;align-items:center;gap:7px;background:none;border:0;padding:0;cursor:pointer;
  font-family:var(--font-mono);font-size:var(--t-label);font-weight:700;
  line-height:1.45;letter-spacing:.08em;text-transform:uppercase;color:var(--bronze);
}
.cta-mono svg{transition:transform .22s var(--ease)}
.cta-mono:hover svg{transform:translateX(3px)}

/* ═════ CARD ═════ */
.card{
  background:var(--card);border:1px solid var(--border);border-radius:var(--r-card);
  padding:24px;display:flex;flex-direction:column;gap:18px;
  transition:background .2s var(--ease),border-color .2s var(--ease);
}
.card--link:hover{background:var(--card-hover);border-color:var(--bronze-ring)}
/* borda tracejada — gesto nº 5 do stackgrid: marca o que ainda NÃO existe */
.card--tracejado{background:transparent;border-style:dashed;border-color:var(--border-strong)}
.painel{background:var(--card);border:1px solid var(--border);border-radius:var(--r-panel)}

/* ═════ TEXTURA — herdada inteira, verde→bronze. 0 KB, sem request, sem JS. ═════ */
.dots{position:absolute;inset:0;pointer-events:none;z-index:0}
.dots--24{
  background-image:radial-gradient(circle,#ffffff0a 1px,transparent 1px);background-size:24px 24px;
  -webkit-mask-image:linear-gradient(180deg,#000000e6,transparent 80%);
          mask-image:linear-gradient(180deg,#000000e6,transparent 80%);
}
.dots--32{
  background-image:radial-gradient(circle,#ffffff08 1px,transparent 1px);background-size:32px 32px;
  -webkit-mask-image:radial-gradient(ellipse at 50% 30%,#000000cc,transparent 75%);
          mask-image:radial-gradient(ellipse at 50% 30%,#000000cc,transparent 75%);
}
.brilho{position:absolute;inset:0;pointer-events:none;z-index:0}
.brilho--hero{background:radial-gradient(ellipse 720px 460px at 92% -8%,#E9A23B0a 0%,#E9A23B05 50%,transparent 78%)}
.brilho--topo{background:radial-gradient(circle at 50% 0%,var(--bronze-soft) 0%,transparent 45%);opacity:.7}
.brilho--centro{background:radial-gradient(ellipse 700px 400px at 50% 50%,var(--bronze-soft) 0%,transparent 65%)}
.sec > .wrap{position:relative;z-index:1}

/* ═════ NAV ═════ */
.nav{
  position:sticky;top:0;z-index:50;background:#0f0f0fb8;
  -webkit-backdrop-filter:saturate(160%) blur(16px);backdrop-filter:saturate(160%) blur(16px);
  border-bottom:1px solid var(--border);
}
.nav-in{max-width:var(--frame);margin-inline:auto;padding:14px max(24px,5%);
  display:flex;align-items:center;gap:24px}
.marca{display:inline-flex;align-items:center;gap:10px;font-weight:800;letter-spacing:-.02em;font-size:17px}
.marca svg{color:var(--ink);transition:color .2s var(--ease)}
.marca:hover svg{color:var(--bronze)}
.nav-links{display:flex;gap:26px;margin-inline:auto}
.nav-links a{color:var(--ink-2);font-size:var(--t-body);transition:color .2s var(--ease)}
.nav-links a:hover{color:var(--ink)}
.nav .btn{height:42px;padding:0 18px;font-size:var(--t-body-sm)}
.nav-burger{display:none;background:none;border:1px solid var(--border-strong);border-radius:var(--r-btn);
  width:42px;height:42px;align-items:center;justify-content:center;cursor:pointer}
@media (max-width:900px){
  .nav-links{display:none}
  .nav-burger{display:inline-flex}
  .nav-in .btn{margin-left:auto}
}

/* ═════ §1 HERO ═════ */
.hero{
  position:relative;overflow:hidden;
  padding:96px max(24px,5%) 120px;border-top:0;
}
.hero-in{max-width:var(--frame);margin-inline:auto;position:relative;z-index:1;
  display:grid;grid-template-columns:minmax(0,1fr) 560px;gap:56px;align-items:center}
.hero-foto{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.hero-foto img{width:100%;height:100%;object-fit:cover;opacity:.06;
  -webkit-mask-image:linear-gradient(180deg,#000 0%,transparent 70%);
          mask-image:linear-gradient(180deg,#000 0%,transparent 70%)}
.hero h1{
  margin:24px 0 0;font-size:var(--t-display);font-weight:800;
  /* PT-BR: vão de caixa baixa acentuada = 0.9604em (medido). 1.08 → 7,4px de folga. OK. */
  line-height:1.08;letter-spacing:-.035em;
  display:flex;flex-direction:column;gap:4px;text-wrap:balance;
}
.hero h1 .grad{
  background:linear-gradient(180deg,var(--bronze) 0%,var(--bronze-2) 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent;
  /* fallback quando background-clip:text não existe */
  -webkit-text-fill-color:transparent;
}
@supports not ((-webkit-background-clip:text) or (background-clip:text)){
  .hero h1 .grad{color:var(--bronze);-webkit-text-fill-color:var(--bronze)}
}
.hero .sub{margin:28px 0 0;max-width:560px;font-size:18px;line-height:1.55;font-weight:500;color:var(--ink-2)}
.hero-ctas{display:flex;gap:14px;margin-top:36px;flex-wrap:wrap}
.honestidade{margin-top:36px;display:flex;flex-direction:column;gap:8px}
.honestidade .frase{display:flex;align-items:center;gap:12px;font-size:var(--t-body-sm);color:var(--ink)}
.honestidade .frase::before{content:"";width:18px;height:1px;background:var(--bronze);flex:none}
.honestidade .selos{font-family:var(--font-mono);font-size:10.5px;font-weight:600;
  line-height:1.45;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3);padding-left:30px}
/* 1366x768 e o notebook de escritorio comum: sem isto a coluna de texto cai para 614px,
   o H1 vira 4 linhas e a linha de honestidade sai da dobra. Medido, nao estimado. */
@media (max-width:1439px){.hero-in{grid-template-columns:minmax(0,1fr) 500px;gap:44px}}
@media (max-width:1100px){
  .hero{padding:80px max(20px,5%) 96px}
  .hero-in{grid-template-columns:1fr;gap:48px}
  .hero h1{font-size:48px}
}
@media (max-width:640px){
  .hero{padding:56px 20px 80px}
  .hero h1{font-size:40px}
  .hero-ctas .btn{flex:1 1 auto}
}

/* ═════ CARD DE MAPA (hero preview + §5) ═════ */
.mapa{background:var(--card);border:1px solid var(--border);border-radius:var(--r-panel);overflow:hidden}
.mapa-top{display:flex;align-items:center;justify-content:space-between;gap:12px;
  padding:14px 18px;border-bottom:1px solid var(--border);background:var(--surf)}
.mapa-corpo{padding:18px;display:flex;flex-direction:column;gap:10px}
.etapa{
  display:grid;grid-template-columns:26px 1fr auto;align-items:start;gap:12px;
  padding:12px 14px;border-radius:var(--r-sm);background:var(--card);
  border-left:2px solid var(--border);
}
.etapa--auto{border-left-color:var(--bronze);background:var(--bronze-wash)}
.etapa--parcial{border-left-color:var(--border-strong);background:var(--card)}
.etapa--humana{border-left-color:var(--border);background:var(--card)}
.etapa--naoli{border:1px dashed var(--border-strong);border-left:1px dashed var(--border-strong);background:transparent}
.etapa-n{font-family:var(--font-mono);font-size:var(--t-micro);color:var(--ink-3);padding-top:3px}
.etapa-txt{font-size:var(--t-body-sm);line-height:1.5;color:var(--ink)}
.etapa-motivo{display:block;font-size:var(--t-caption);line-height:1.45;color:var(--ink-3);margin-top:4px}
.etapa-sinal{display:inline-flex;align-items:center;gap:6px;white-space:nowrap;
  font-family:var(--font-mono);font-size:var(--t-micro);font-weight:700;
  line-height:1.45;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-3);padding-top:2px}
.etapa--auto .etapa-sinal{color:var(--bronze)}
.etapa--parcial .etapa-sinal{color:var(--ink-2)}
.mapa-pe{padding:14px 18px;border-top:1px solid var(--border);background:var(--surf)}

/* ═════ §2 FAIXA DE VERBOS ═════ */
.faixa{position:relative;overflow:hidden;border-block:1px solid var(--border);padding:4px 0;margin-top:32px}
.faixa::before,.faixa::after{content:"";position:absolute;top:0;bottom:0;width:120px;z-index:2;pointer-events:none}
.faixa::before{left:0;background:linear-gradient(90deg,var(--bg),transparent)}
.faixa::after{right:0;background:linear-gradient(270deg,var(--bg),transparent)}
.faixa-track{display:flex;width:max-content;animation:desliza var(--dur,44s) linear infinite}
.faixa:hover .faixa-track{animation-play-state:paused}
.verbo{display:inline-flex;align-items:center;gap:12px;padding:24px 0;margin-right:56px;
  font-family:var(--font-mono);font-size:var(--t-label);font-weight:700;
  line-height:1.45;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-3)}
.verbo:hover{color:var(--ink)}
.verbo .selo{width:22px;height:22px;border-radius:var(--r-sm);border:1px solid var(--border);
  display:inline-flex;align-items:center;justify-content:center;flex:none;
  transition:border-color .2s var(--ease)}
.verbo .selo i{width:5px;height:5px;border-radius:50%;background:var(--ink-4);transition:all .2s var(--ease)}
.verbo:hover .selo{border-color:var(--bronze-ring)}
.verbo:hover .selo i{background:var(--bronze);box-shadow:0 0 0 4px var(--bronze-soft)}
@keyframes desliza{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* ═════ GRADES ═════ */
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.g2{display:grid;grid-template-columns:repeat(2,1fr);gap:24px}
@media (max-width:1000px){.g3,.g4{grid-template-columns:repeat(2,1fr)}}
@media (max-width:680px){.g3,.g4,.g2{grid-template-columns:1fr}}

/* ═════ §3 O PROBLEMA — carimbo (o gesto do card numerado do conicorn, invertido) ═════ */
.carimbo-linha{display:flex;align-items:baseline;justify-content:space-between;gap:12px;
  border-bottom:1px solid var(--border);padding-bottom:10px}
.carimbo{
  font-family:var(--font-mono);font-size:var(--t-micro);font-weight:700;
  line-height:1.45;letter-spacing:.06em;text-transform:uppercase;color:var(--bronze);
}
.card-n{font-family:var(--font-mono);font-size:var(--t-label);font-weight:500;
  line-height:1.45;letter-spacing:.12em;color:var(--ink-4)}
.ponte{margin:56px auto 0;max-width:720px;text-align:center;font-size:var(--t-body-lg);
  line-height:1.6;color:var(--ink);text-wrap:balance}

/* ═════ §4 ABAS ═════ */
.abas{display:flex;gap:28px;flex-wrap:wrap;justify-content:center;
  border-bottom:1px solid var(--border);margin-bottom:40px}
.aba{background:none;border:0;padding:0 0 14px;cursor:pointer;position:relative;
  font-family:var(--font-mono);font-size:var(--t-label);font-weight:700;
  line-height:1.45;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-3)}
.aba[aria-selected="true"]{color:var(--ink)}
.aba[aria-selected="true"]::after{content:"";position:absolute;left:0;right:0;bottom:-1px;
  height:2px;background:var(--bronze)}
.aba-linha{text-align:center;margin:0 0 32px}
.processo{display:flex;flex-direction:column;gap:14px}
.processo .etiq{align-self:flex-start}
.processo p{flex:1}

/* ═════ §5 A PROVA ═════ */
.prova-grid{display:grid;grid-template-columns:minmax(0,420px) minmax(0,1fr);gap:24px;align-items:start}
@media (min-width:901px){.entrada{position:sticky;top:88px}}
@media (max-width:900px){.prova-grid{grid-template-columns:1fr}}
.campo{display:flex;flex-direction:column;gap:8px}
.campo label{font-family:var(--font-mono);font-size:var(--t-micro);font-weight:600;
  line-height:1.45;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-3)}
textarea,input[type=text],input[type=number],select{
  background:var(--card);border:1px solid var(--border);border-radius:var(--r-btn);
  padding:12px 14px;font-size:var(--t-body);line-height:1.7;width:100%;
}
textarea::placeholder,input::placeholder{color:var(--ink-3)}
textarea{resize:vertical;min-height:150px}
input[type=text],input[type=number]{height:48px;padding-block:0}
/* 🔴 CONTAINER DIMENSIONADO PARA O MAPA QUE O mapear.ts DEVOLVE.
   Medido em 7 textos reais em PT-BR: 2..6 etapas, mediana 4, máximo 6.
   Linha renderizada = 72px + 10px de gap. Reserva para 6 = 6*72 + 5*10 = 482px.
   Sem isto o painel salta de altura entre um processo curto e um longo — e o salto
   acontece exatamente no clique que carrega a única prova do site.
   Acima de 6 etapas o painel CRESCE; nunca rola dentro de si. */
.etapas-lista{min-height:482px;display:flex;flex-direction:column;gap:10px}
.total{display:flex;align-items:baseline;gap:10px;margin-top:4px}
.total b{font-family:var(--font-mono);font-size:44px;font-weight:600;letter-spacing:-.03em;color:var(--bronze)}
.total span{font-size:20px;font-weight:500;color:var(--ink-3)}
.trace{background:var(--surf);border:1px solid var(--border);border-radius:var(--r-sm);padding:14px 16px}
.trace-l{display:flex;justify-content:space-between;gap:16px;
  font-family:var(--font-mono);font-size:var(--t-micro);line-height:1.9;color:var(--ink-3)}
.trace-l b{color:var(--ink-2);font-weight:600}
.ponte-dinheiro{margin-top:20px;padding-left:14px;border-left:2px solid var(--bronze);
  font-size:var(--t-body-lg);line-height:1.55;color:var(--ink)}
.assinatura{margin-top:18px;padding-top:14px;border-top:1px solid var(--border)}

/* ═════ §6 COMO FUNCIONA — trilho vertical (o gesto 004 PROCESS do conicorn) ═════ */
.trilho{position:relative;display:flex;flex-direction:column;gap:0}
.trilho::before{content:"";position:absolute;left:50%;top:80px;bottom:80px;width:1px;background:var(--border)}
.passo{position:relative;display:grid;grid-template-columns:1fr 96px 1fr;align-items:center;
  gap:0;padding:32px 0}
.passo-txt{padding:0 8px}
.passo:nth-child(odd) .passo-txt{grid-column:3;text-align:left;padding-left:32px}
.passo:nth-child(odd) .passo-mid{grid-column:1;justify-self:end}
.passo:nth-child(even) .passo-txt{grid-column:1;text-align:right;padding-right:32px}
.passo:nth-child(even) .passo-mid{grid-column:3;justify-self:start}
.passo-mid{display:flex;align-items:center;gap:14px;position:relative}
.passo-foto{width:190px;aspect-ratio:3/2;border-radius:var(--r-card);overflow:hidden;
  border:1px solid var(--border);background:var(--surf);flex:none}
.passo-foto img{width:100%;height:100%;object-fit:cover;
  /* grade de mockup: matiz ao quente, sat contida, teto de luminancia. Ver NOTAS.md §7. */
  filter:sepia(.34) saturate(.72) contrast(1.06) brightness(.82)}
.passo-n{font-family:var(--font-mono);font-size:var(--t-label);font-weight:700;line-height:1.45;
  letter-spacing:.12em;color:var(--ink-3);
  width:38px;height:38px;border-radius:50%;border:1px solid var(--border);background:var(--card);
  display:flex;align-items:center;justify-content:center;flex:none}
/* nó no trilho + linha-guia até o texto — o gesto stackgrid encaixado no conicorn */
.passo::after{content:"";position:absolute;left:50%;top:50%;width:11px;height:11px;
  border-radius:50%;background:var(--bg);border:1px solid var(--border-strong);
  transform:translate(-50%,-50%);z-index:1}
.passo--ativo::after{border-color:var(--bronze);background:var(--bronze);box-shadow:0 0 0 4px var(--bronze-soft)}
@media (max-width:820px){
  .trilho::before{left:19px}
  .passo{grid-template-columns:38px 1fr;padding:24px 0;gap:20px}
  .passo:nth-child(odd) .passo-txt,.passo:nth-child(even) .passo-txt{
    grid-column:2;text-align:left;padding:0}
  .passo:nth-child(odd) .passo-mid,.passo:nth-child(even) .passo-mid{
    grid-column:1;grid-row:1;justify-self:start;flex-direction:column}
  .passo::after{left:19px}
  .passo-foto{display:none}
}

/* ═════ §7 QUEM FAZ ═════ */
.quem{display:grid;grid-template-columns:minmax(0,1fr) 420px;gap:56px;align-items:start}
@media (max-width:900px){.quem{grid-template-columns:1fr}}
.construi{list-style:none;margin:24px 0 0;padding:0 0 0 16px;border-left:1px solid var(--border);
  display:flex;flex-direction:column;gap:12px}
.construi li{font-family:var(--font-mono);font-size:var(--t-caption);line-height:1.6;color:var(--ink-2)}
.bloqueio{border:1px dashed var(--border-strong);border-radius:var(--r-card);padding:20px;
  display:flex;flex-direction:column;gap:8px;background:transparent}

/* ═════ §8 POR ONDE COMEÇA ═════ */
.lista{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px}
.lista li{display:grid;grid-template-columns:18px 1fr;gap:12px;align-items:start;
  font-size:var(--t-body-sm);line-height:1.6;color:var(--ink-2)}
.lista svg{margin-top:3px;flex:none}

/* ═════ §9 MATRIZ ═════ */
.scroller{margin-top:8px;border:1px solid var(--border);border-radius:var(--r-panel);
  background:var(--surf);overflow-x:auto;scrollbar-width:thin}
.scroller::-webkit-scrollbar{height:8px}
.scroller::-webkit-scrollbar-thumb{background:var(--border-strong);border-radius:3px}
.matriz{display:grid;grid-template-columns:minmax(230px,1.7fr) repeat(5,minmax(132px,1fr));min-width:820px}
.mz-h{padding:16px 14px;background:var(--card);border-bottom:1px solid var(--border);
  border-left:1px solid var(--border);
  font-family:var(--font-mono);font-size:var(--t-micro);font-weight:700;
  line-height:1.45;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-2)}
.mz-h:first-child{border-left:0}
.mz-c{padding:16px 14px;border-top:1px solid var(--border);border-left:1px solid var(--border);
  font-size:var(--t-body-sm);line-height:1.5;color:var(--ink-2);display:flex;align-items:center;gap:8px}
.mz-q{position:sticky;left:0;z-index:1;background:var(--surf);border-left:0;color:var(--ink);font-weight:500}
.mz-eu{background:var(--bronze-wash);border-left:2px solid var(--bronze-ring)}
.mz-h.mz-eu{color:var(--bronze)}
.marca-sn{width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;
  justify-content:center;flex:none;border:1px solid var(--border)}
.sn-sim{background:var(--bronze-soft);border-color:var(--bronze-ring);color:var(--bronze)}
.sn-nao{background:var(--border);border-color:var(--border);color:var(--ink-3)}
.sn-meio{background:transparent;border-style:dashed;border-color:var(--border-strong);color:var(--ink-3)}
.sn-rot{font-family:var(--font-mono);font-size:var(--t-micro);line-height:1.45;
  letter-spacing:.05em;text-transform:uppercase;color:var(--ink-3)}
.mz-eu .sn-rot{color:var(--bronze)}

/* ═════ §10 COMPROMISSOS ═════ */
.tira{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--border);
  border-radius:var(--r-panel);background:var(--surf);overflow:hidden}
.tira-c{padding:32px 28px;border-left:1px solid var(--border);position:relative;
  display:flex;flex-direction:column;gap:12px}
.tira-c:first-child{border-left:0}
.tira-c:first-child::before{content:"";position:absolute;left:0;top:24px;bottom:24px;width:2px;background:var(--bronze)}
.tira-leg{display:inline-flex;align-items:center;gap:8px;
  font-family:var(--font-mono);font-size:var(--t-micro);font-weight:700;
  line-height:1.45;letter-spacing:.14em;text-transform:uppercase;color:var(--bronze)}
.pulso{width:6px;height:6px;border-radius:50%;background:var(--bronze);
  box-shadow:0 0 0 3px var(--bronze-soft);animation:pulsa 2s var(--ease) infinite}
@keyframes pulsa{0%,100%{opacity:1}50%{opacity:.45}}
@media (max-width:820px){.tira{grid-template-columns:1fr}
  .tira-c{border-left:0;border-top:1px solid var(--border)}
  .tira-c:first-child{border-top:0}}

/* ═════ §11 FAQ ═════ */
.faq{max-width:860px;margin-inline:auto;display:flex;flex-direction:column;gap:12px}
.faq-item{border:1px solid var(--border);background:var(--card);border-radius:14px;
  transition:border-color .2s var(--ease),background .2s var(--ease)}
.faq-item:hover{border-color:var(--border-strong);background:var(--card-hover)}
.faq-item[open]{border-color:var(--bronze-ring)}
.faq-item summary{list-style:none;cursor:pointer;padding:22px 24px;
  display:flex;align-items:center;gap:16px;justify-content:space-between}
.faq-item summary::-webkit-details-marker{display:none}
.faq-q{font-size:17px;font-weight:600;line-height:1.45;color:var(--ink)}
.faq-n{font-family:var(--font-mono);font-size:var(--t-micro);color:var(--ink-3);flex:none;
  line-height:1.45;letter-spacing:.1em}
.faq-ic{width:22px;height:22px;border-radius:var(--r-sm);border:1px solid var(--border);
  background:var(--border);color:var(--ink-2);flex:none;
  display:inline-flex;align-items:center;justify-content:center;transition:transform .2s var(--ease)}
.faq-item[open] .faq-ic{transform:rotate(45deg)}
.faq-a{margin:0;padding:0 24px 24px;font-size:var(--t-body);line-height:1.7;color:var(--ink-2);max-width:72ch}

/* ═════ §12 CONTATO ═════ */
.contato{max-width:560px;margin-inline:auto;display:flex;flex-direction:column;gap:14px;text-align:left}
.anexo{background:var(--surf);border:1px solid var(--border);border-left:2px solid var(--bronze);
  border-radius:var(--r-sm);padding:14px 16px;display:flex;flex-direction:column;gap:6px}
.aviso{border-left:2px solid var(--border-strong);padding:12px 0 12px 14px;color:var(--ink-2);
  font-size:var(--t-body-sm);line-height:1.6}

/* ═════ §13 RODAPÉ ═════ */
.rodape{position:relative;isolation:isolate;overflow:hidden;padding:0 max(24px,5%) 28px;
  border-top:1px solid var(--border)}
.rodape-topo{max-width:var(--frame);margin-inline:auto;display:flex;justify-content:space-between;
  align-items:center;gap:16px;padding:20px 0;border-bottom:1px solid var(--border);
  font-family:var(--font-mono);font-size:var(--t-micro);font-weight:600;
  line-height:1.45;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-3)}
.rodape-cols{max-width:var(--frame);margin-inline:auto;padding:48px 0 36px;
  display:grid;grid-template-columns:1.6fr repeat(3,1fr);gap:32px}
.rodape-cols h3{margin:0 0 14px;font-family:var(--font-mono);font-size:var(--t-micro);font-weight:700;
  line-height:1.45;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3)}
.rodape-cols ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.rodape-cols a{color:var(--ink-2);font-size:var(--t-body-sm)}
.rodape-cols a:hover{color:var(--ink)}
.rodape-fim{max-width:var(--frame);margin-inline:auto;padding-top:20px;border-top:1px solid var(--border);
  display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;
  font-family:var(--font-mono);font-size:var(--t-micro);line-height:1.45;letter-spacing:.1em;
  text-transform:uppercase;color:var(--ink-3)}
@media (max-width:820px){.rodape-cols{grid-template-columns:1fr 1fr}}

/* ═════ APROVAÇÃO — barra que só existe nos arquivos de secoes/ ═════ */
.gate{position:sticky;top:0;z-index:60;background:var(--surf);border-bottom:1px solid var(--border-strong);
  padding:12px max(24px,5%);display:flex;align-items:center;gap:16px;flex-wrap:wrap;
  font-family:var(--font-mono);font-size:var(--t-micro);font-weight:600;
  line-height:1.45;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3)}
.gate b{color:var(--bronze)}
.gate a{color:var(--ink-2);border-bottom:1px solid var(--border-strong)}
.gate .sep{color:var(--ink-4)}

/* ═════ REDUÇÃO DE MOVIMENTO — herdado sem discussão ═════ */
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;
    transition-duration:.01ms!important;scroll-behavior:auto!important}
  .faixa-track{animation:none;transform:none}
}
@media (scripting:none){html{scroll-behavior:smooth}}
`;

/* ══════════════════════════════════════════════════════════════════════════
   2 · ÍCONES — SVG SEMPRE. Nenhuma seta/estrela/check como caractere de texto:
   U+2192 U+2605 U+2713 não existem no subset da Inter nem da JetBrains Mono
   (auditado com fontTools; defeito nº 3 da DIRECAO-ARTE Parte 1.2).
   ══════════════════════════════════════════════════════════════════════════ */
const ic = {
  seta: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  setaCima: `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 12.5v-9M4.5 7 8 3.5 11.5 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  externo: `<svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3h7v7M13 3 6.5 9.5M11 10.5V13H3V5h2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  check: `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  meio: `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.4"/><path d="M8 2.5a5.5 5.5 0 0 1 0 11z" fill="currentColor"/></svg>`,
  mao: `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.4"/></svg>`,
  x: `<svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4.5 4.5 7 7m0-7-7 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  mais: `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 3.5v9M3.5 8h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  hamburger: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 4.5h12M2 8h12M2 11.5h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  // marca: a cabeça/engrenagem do autômato de bronze. currentColor, vira bronze no hover.
  marca: `<svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true"><rect x="4.5" y="6.5" width="19" height="15" rx="4.5" stroke="currentColor" stroke-width="1.6"/><path d="M14 2.5v4M9.5 21.5v4M18.5 21.5v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="10.5" cy="13.5" r="1.7" fill="currentColor"/><circle cx="17.5" cy="13.5" r="1.7" fill="currentColor"/><path d="M11 17.5h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
};

/* ══════════════════════════════════════════════════════════════════════════
   3 · DADOS REAIS DO MOTOR
   Saída literal de `lib/mapear.ts` (cópia .js em js/mapear.js) sobre dois textos
   em PT-BR no registro do público. Números NÃO redigitados à mão: colados da
   execução real, reproduzível com `node build.mjs --motor`.
   ══════════════════════════════════════════════════════════════════════════ */
const TEXTO_HERO = "O cliente me chama no WhatsApp pedindo orçamento. Eu paro o que tô fazendo pra responder. Depois eu passo pro financeiro.";
const TEXTO_DEMO = "O cliente me chama no zap pedindo orçamento. Eu confiro o preço na tabela e monto a proposta. Depois eu registro na planilha de vendas. Aí eu aviso o vendedor. Na sexta eu fecho o relatório da semana na mão.";

const { mapear } = await import("./js/mapear.js");
const R_HERO = mapear(TEXTO_HERO, 5);
const R_DEMO = mapear(TEXTO_DEMO, 5);
if (process.argv.includes("--motor")) {
  console.log(JSON.stringify({ hero: R_HERO, demo: R_DEMO }, null, 1));
}

const SINAL = {
  automatizavel: { cls: "auto", rot: "sai da sua mão", ic: ic.check },
  parcial: { cls: "parcial", rot: "fica pela metade", ic: ic.meio },
  humana: { cls: "humana", rot: "fica com você", ic: ic.mao },
  nao_lida: { cls: "naoli", rot: "não li", ic: ic.x },
};

const etapaHTML = (e, comMotivo = true) => {
  const s = SINAL[e.vereditoReal];
  return `<div class="etapa etapa--${s.cls}">
      <span class="etapa-n">${String(e.n).padStart(2, "0")}</span>
      <span><span class="etapa-txt">${e.texto}</span>${comMotivo ? `<span class="etapa-motivo">${e.motivo}</span>` : ""}</span>
      <span class="etapa-sinal">${s.ic}${s.rot}</span>
    </div>`;
};

/* ══════════════════════════════════════════════════════════════════════════
   4 · BLOCOS DE SEÇÃO
   `de:` = de qual seção do conicorn veio · `gesto:` = o que o stackgrid emprestou
   ══════════════════════════════════════════════════════════════════════════ */

const head = (n, rotulo, titulo, lead) => `
    <div class="sec-head">
      <span class="crop"><span class="pill">${n ? `<span class="pill-n">${n}</span>` : ""}<span class="pill-t"><i class="pill-dot"></i>${rotulo}</span></span></span>
      <h2>${titulo}</h2>
      ${lead ? `<p class="lead">${lead}</p>` : ""}
    </div>`;

const SECOES = [];
const S = (o) => { SECOES.push(o); return o; };

/* ─────────────────────── §0 NAV ─────────────────────── */
S({
  id: "nav", arq: "00-nav", nome: "§0 · Nav",
  de: "pílula flutuante `☰ Menu` + `Get this Template` do conicorn — REFEITA",
  html: `
<header class="nav">
  <div class="nav-in">
    <a class="marca" href="#topo">${ic.marca}<span>Talos</span></a>
    <nav class="nav-links" aria-label="Seções">
      <a href="#problema">o problema</a>
      <a href="#como">como funciona</a>
      <a href="#quem">quem faz</a>
      <a href="#comeco">por onde começa</a>
    </nav>
    <button class="nav-burger" aria-label="Abrir menu">${ic.hamburger}</button>
    <a class="btn btn-2" href="#contato">falar comigo</a>
  </div>
</header>`,
});

/* ─────────────────────── §1 HERO ─────────────────────── */
S({
  id: "topo", arq: "01-hero", nome: "§1 · Hero",
  de: "`section.hero` do conicorn — recomposto de CENTRADO para 2 colunas",
  html: `
<section class="hero" id="topo">
  <div class="hero-foto"><img src="{BASE}03-assets/fotos/textura-metal-1920.webp" alt="" role="presentation" fetchpriority="high"></div>
  <div class="brilho brilho--hero"></div>
  <div class="dots dots--24"></div>
  <div class="hero-in">
    <div>
      <span class="pill"><span class="pill-t"><i class="pill-dot"></i>sites e máquinas que atendem quem chega</span></span>
      <h1>
        <span>Quem responde o seu cliente</span>
        <span class="grad">quando você não pode?</span>
      </h1>
      <p class="sub">No WhatsApp, quem responde primeiro leva. Eu construo a máquina que responde por você — e o lugar dela é o seu site.</p>
      <div class="hero-ctas">
        <a class="btn btn-1" href="#prova">ver quanto tempo isso me custa</a>
        <a class="btn btn-2" href="#comeco">o que está incluso</a>
      </div>
      <div class="honestidade">
        <p class="frase">Sem case ainda. E eu não vou inventar um.</p>
        <p class="selos">roda no seu navegador · sem cadastro · resultado em milissegundos</p>
      </div>
    </div>

    <div class="mapa" role="img" aria-label="Exemplo de mapa de processo com três passos classificados: dois saem da sua mão, um fica pela metade.">
      <div class="mapa-top">
        <span class="t-micro">exemplo · um processo de verdade</span>
        <span class="chip chip--on">dá pra tirar da sua mão</span>
      </div>
      <div class="mapa-corpo">
        ${R_HERO.etapas.map((e) => etapaHTML(e, false)).join("\n        ")}
      </div>
      <div class="mapa-pe">
        <p class="t-cap"><b class="bronze mono">${R_HERO.automatizaveis} de ${R_HERO.etapasDetectadas} passos saem da sua mão</b> · ${R_HERO.parciais} fica pela metade</p>
        <p class="t-cap" style="margin-top:6px">Mais abaixo você escreve o seu, do seu jeito, e recebe isso na hora.</p>
      </div>
    </div>
  </div>
</section>`,
});

/* ─────────────────────── §2 001 FAIXA DE VERBOS ─────────────────────── */
const VERBOS = ["responde", "registra", "confere", "calcula", "avisa", "lembra", "organiza", "cobra", "agenda", "emite"];
const verbo = (v) => `<span class="verbo"><span class="selo"><i></i></span>${v}</span>`;
S({
  id: "verbos", arq: "02-faixa-de-verbos", nome: "§2 · 001 Faixa de verbos",
  de: "faixa de stat `50 / X FASTER` + vídeo de equipe do conicorn — CONTEÚDO TROCADO",
  html: `
<section class="sec" id="verbos">
  <div class="wrap wrap--wide">
    ${head("001", "o que a máquina faz", "Dez coisas, em português.", "Nenhuma delas é prova social. Todas as dez você confere aqui embaixo, no seu próprio processo.")}
    <div class="sec-body" style="margin-top:32px">
      <div class="faixa" aria-hidden="true">
        <div class="faixa-track">
          ${VERBOS.map(verbo).join("")}${VERBOS.map(verbo).join("")}
        </div>
      </div>
      <p class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">${VERBOS.join(", ")}.</p>
    </div>
  </div>
</section>`,
});

/* ─────────────────────── §3 002 O PROBLEMA ─────────────────────── */
const CENAS = [
  { c: "22:14", t: "Chega orçamento fora do horário", p: "O cliente pede o preço à noite. Você vê às oito da manhã. Às vezes ele já fechou com outro." },
  { c: "20ª vez essa semana", t: "A mesma pergunta, de novo", p: "Preço, prazo, se tem no estoque. Você já respondeu isso vinte vezes essa semana — e vai responder de novo agora." },
  { c: "só você sabe", t: "O sistema é você", p: "A planilha está certa, o caderno está certo, o preço tá na sua cabeça. Funciona — enquanto você estiver lá." },
];
S({
  id: "problema", arq: "03-o-problema", nome: "§3 · 002 O problema",
  de: "`002 ● VALUES` / “Why Choose Us?” — 3 cards numerados, geometria idêntica",
  html: `
<section class="sec sec--surf" id="problema">
  <div class="wrap wrap--wide">
    ${head("002", "o problema", "Você reconhece algum desses?", null)}
    <div class="sec-body">
      <div class="g3">
        ${CENAS.map((c, i) => `<article class="card">
          <p class="carimbo">${c.c}</p>
          <h3 class="t-h5">${c.t}</h3>
          <p class="t-body-sm">${c.p}</p>
          <span class="t-micro" style="margin-top:auto">0${i + 1}</span>
        </article>`).join("\n        ")}
      </div>
      <p class="ponte">Nenhum desses é problema de tecnologia. É trabalho que ainda depende da sua mão — e não precisa depender.</p>
    </div>
  </div>
</section>`,
});

/* ─────────────────────── §4 003 CASOS DE USO ─────────────────────── */
const RAMOS = [
  {
    id: "industria", nome: "Indústria", linha: "metalúrgica, moveleira, alimentos, plástico",
    p: [
      ["O pedido chega por WhatsApp e eu passo pro sistema na mão", "processo interno"],
      ["Ordem de produção montada à mão a partir da carteira", "processo interno"],
      ["Follow-up de entrega que depende de alguém lembrar", "atendimento"],
      ["A pessoa que sabe fazer isso é uma só — e quando ela falta, para", "sistema sob medida"],
    ],
  },
  {
    id: "comercio", nome: "Comércio", linha: "loja física, distribuidora, e-commerce",
    p: [
      ["Orçamento pedido no WhatsApp fora do horário e respondido no dia seguinte", "atendimento"],
      ["Estoque conferido em dois sistemas que não conversam", "processo interno"],
      ["Cliente que comprou uma vez e nunca mais foi contatado", "atendimento"],
      ["Nota emitida manualmente a cada venda", "processo interno"],
    ],
  },
  {
    id: "servicos", nome: "Serviços", linha: "clínica, escritório, consultoria",
    p: [
      ["Agendamento por telefone que ocupa a recepção o dia inteiro", "atendimento"],
      ["Confirmação de consulta feita uma a uma na véspera", "atendimento"],
      ["Documento montado a partir de um modelo e preenchido na mão", "processo interno"],
      ["Cobrança que depende de alguém olhar a planilha de vencimentos", "processo interno"],
    ],
  },
  {
    id: "obra", nome: "Projeto e obra", linha: "construtora, arquitetura, instalação",
    p: [
      ["Medição de campo que vira planilha, que vira relatório, que vira e-mail", "processo interno"],
      ["Fornecedor cotado por três canais diferentes sem histórico", "sistema sob medida"],
      ["Cronograma atualizado à mão quando algo atrasa", "processo interno"],
      ["Foto de obra que alguém precisa baixar, renomear e arquivar", "processo interno"],
    ],
  },
];
S({
  id: "casos", arq: "04-casos-de-uso", nome: "§4 · 003 Casos de uso por ramo",
  de: "`003 ● CAPABILITIES` / “Our AI-Driven Services” — 3 cards grandes viram 4 abas × 4 processos",
  html: `
<section class="sec" id="casos">
  <div class="dots dots--32"></div>
  <div class="wrap wrap--wide">
    ${head("003", "casos de uso", "Escolhe o seu ramo. Vê se reconhece.",
      "Nenhum destes é case de cliente — são processos que existem em quase toda empresa desse porte. Se você leu algum e pensou <i>“é exatamente isso aqui”</i>, é por aí que começa.")}
    <div class="sec-body">
      <div class="abas" role="tablist" aria-label="Ramos">
        ${RAMOS.map((r, i) => `<button class="aba" role="tab" id="aba-${r.id}" aria-controls="pnl-${r.id}" aria-selected="${i === 0}" data-aba="${r.id}">${r.nome}</button>`).join("\n        ")}
      </div>
      ${RAMOS.map((r, i) => `
      <div class="painel-ramo" role="tabpanel" id="pnl-${r.id}" aria-labelledby="aba-${r.id}"${i === 0 ? "" : " hidden"}>
        <p class="aba-linha t-micro">${r.nome} · ${r.linha}</p>
        <div class="g4">
          ${r.p.map(([txt, etq]) => `<article class="card card--link processo">
            <span class="chip etiq">${etq}</span>
            <p class="t-body-sm" style="color:var(--ink)">${txt}</p>
            <span class="chip chip--on">dá pra tirar da sua mão</span>
            <button class="cta-mono" data-exemplo="${txt.replace(/"/g, "&quot;")}">esse é o meu ${ic.seta}</button>
          </article>`).join("\n          ")}
        </div>
      </div>`).join("")}
      <p class="t-body-sm" style="text-align:center;margin-top:36px">Não achou o seu? Escreve ele aqui embaixo com as suas palavras.</p>
    </div>
  </div>
</section>`,
});

/* ─────────────────────── §5 004 A PROVA ─────────────────────── */
S({
  id: "prova", arq: "05-o-mapa-ao-vivo", nome: "§5 · 004 O mapa ao vivo",
  de: "`005 ● CASE STUDIES` / “What We’ve Built” — container largo mídia+copy. O case sai, o motor entra.",
  html: `
<section class="sec sec--surf" id="prova">
  <div class="dots dots--32"></div>
  <div class="wrap wrap--wide">
    ${head("004", "a prova", "Não vou te contar. Olha acontecendo.",
      "Descreve aí, com as suas palavras, um processo que se repete na sua empresa. O que aparece em seguida é o mesmo diagnóstico que eu faço no primeiro dia de um projeto — só que agora, e de graça.")}
    <div class="sec-body">
      <div class="prova-grid">

        <div class="painel entrada" style="padding:24px;display:flex;flex-direction:column;gap:18px">
          <div class="campo">
            <label for="proc">você escreve</label>
            <textarea id="proc" rows="7" placeholder="Ex.: o cliente me chama no zap pedindo orçamento, eu confiro o preço na tabela e mando pro vendedor...">${TEXTO_DEMO}</textarea>
          </div>
          <div class="campo">
            <label for="freq">isso acontece</label>
            <div style="display:flex;gap:10px">
              <input id="freq" type="number" min="1" value="5" style="width:92px" aria-label="quantidade">
              <select id="periodo" aria-label="período" style="flex:1;height:48px;border-radius:var(--r-btn);border:1px solid var(--border);background:var(--card);padding:0 12px">
                <option value="semana">vezes por semana</option>
                <option value="mes">vezes por mês</option>
              </select>
            </div>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn-1" id="btn-ver" style="flex:1 1 auto">ver o meu</button>
            <button class="btn btn-2 btn-sm" id="btn-ex">usar um exemplo pronto</button>
          </div>
          <p class="t-cap">Roda no seu navegador. Nada sai daqui, nada é gravado, não tem cadastro.</p>
        </div>

        <div class="painel" style="padding:24px;display:flex;flex-direction:column;gap:20px" id="saida">
          <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center">
            <span class="chip">o que eu li</span>
            <span class="guia" style="flex:1"><span class="traco traco--bronze"></span></span>
            <span class="t-micro" id="resumo">${R_DEMO.automatizaveis} saem da sua mão · ${R_DEMO.parciais} pela metade · ${R_DEMO.humanas} ficam com você${R_DEMO.naoLidas ? ` · ${R_DEMO.naoLidas} não li` : ""}</span>
          </div>

          <div class="etapas-lista" id="etapas">
            ${R_DEMO.etapas.map((e) => etapaHTML(e)).join("\n            ")}
          </div>

          <div style="border-top:1px solid var(--border);padding-top:20px">
            <p class="t-micro">passos que saem da sua mão, por mês, de volta pra você</p>
            <p class="total"><b class="tabular" id="horas">${String(R_DEMO.horasMes).replace(".", ",")}</b><span>horas por mês</span></p>
            <p class="t-cap" id="premissa" style="margin-top:8px;max-width:56ch">
              A conta: ${Math.round(R_DEMO.minutosSemana / R_DEMO.vezesPorSemana)} minutos por execução × ${R_DEMO.vezesPorSemana} vezes por semana × 4,33 semanas no mês.
              Etapa que eu não li vale zero — somar seria chute. Parcial entra pela metade, porque a máquina redige e você confere.
            </p>
            <p class="ponte-dinheiro">Quanto vale essa hora na sua empresa, você sabe melhor do que eu.</p>
          </div>

          <div class="trace" id="trace">
            <p class="t-micro" style="margin-bottom:8px">a máquina por dentro</p>
            ${R_DEMO.trace.map((t) => `<div class="trace-l"><span>${t.op} — ${t.detalhe}</span><b>${String(t.ms).replace(".", ",")} ms</b></div>`).join("\n            ")}
            <div class="trace-l" style="border-top:1px solid var(--border);margin-top:8px;padding-top:6px"><span>total</span><b id="totalms">${String(R_DEMO.totalMs).replace(".", ",")} ms</b></div>
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center">
            <a class="btn btn-1" href="#contato">quero isso rodando na minha empresa</a>
          </div>
          <p class="assinatura t-cap"><a href="#quem" class="cta-mono">quem escreveu essa máquina ${ic.seta}</a></p>
        </div>

      </div>
    </div>
  </div>
</section>`,
});

/* ─────────────────────── §6 005 COMO FUNCIONA ─────────────────────── */
const PASSOS = [
  { n: "01", t: "Eu olho a sua operação", p: "Uma conversa e um olhar no que já existe. Sai daí o que dá pra tirar da sua mão, e o que é melhor continuar com gente.", foto: "placa-metal", alt: "Chapa de metal marcada e riscada sobre bancada" },
  { n: "02", t: "Eu construo a máquina", p: "Escopo e prazo fechados antes de começar. Você vê funcionando antes de aprovar — não depois de pagar.", foto: "ferreiro", alt: "Bigorna e martelo numa forja acesa" },
  { n: "03", t: "Roda sem você e eu cuido", p: "Manutenção mensal já está no combinado. Você recebe o que ela fez, não o que ela é.", foto: "esmerilhadeira", alt: "Esmerilhadeira em uso, faíscas contra o escuro" },
];
S({
  id: "como", arq: "06-como-funciona", nome: "§6 · 005 Como funciona",
  de: "`004 ● PROCESS` / “How We Work” — trilho vertical com nós alternando lado. 5 passos → 3.",
  html: `
<section class="sec" id="como">
  <div class="wrap wrap--wide">
    ${head("005", "como funciona", "Três passos. Sem mistério.",
      "O que você não vai ter é aquele projeto que nunca termina.")}
    <div class="sec-body">
      <div class="trilho">
        ${PASSOS.map((s, i) => `
        <div class="passo${i === 0 ? " passo--ativo" : ""}">
          <div class="passo-mid">
            <span class="passo-n">${s.n}</span>
            <span class="passo-foto"><img src="{BASE}03-assets/fotos/${s.foto}-960.webp" srcset="{BASE}03-assets/fotos/${s.foto}-960.webp 960w, {BASE}03-assets/fotos/${s.foto}-1920.webp 1920w" sizes="190px" alt="${s.alt}" loading="lazy" width="960" height="640"></span>
          </div>
          <div class="passo-txt">
            <h3 class="t-h5">${s.t}</h3>
            <p class="t-body-sm" style="margin-top:8px">${s.p}</p>
          </div>
        </div>`).join("")}
      </div>
      <p class="t-cap" style="text-align:center;margin-top:40px">
        As fotos são metáfora de marca — forja, bancada, faísca. Não são oficina minha, nem de cliente, nem projeto entregue.
      </p>
    </div>
  </div>
</section>`,
});

/* ─────────────────────── §7 006 QUEM FAZ ─────────────────────── */
S({
  id: "quem", arq: "07-quem-faz", nome: "§7 · 006 Quem faz",
  de: "`009 ● TEAM` / “Meet the Conicorn’s Minds” — grade de 4 rostos vira UMA pessoa",
  html: `
<section class="sec sec--surf" id="quem">
  <div class="wrap wrap--wide">
    ${head("006", "quem faz", "Uma pessoa. Essa aqui.",
      "Não existe equipe atrás disso, e é melhor você saber agora do que descobrir depois.")}
    <div class="sec-body">
      <div class="quem">
        <div>
          <h3 class="t-h3" data-slot="nome">[PREENCHER: nome]</h3>
          <p class="t-body" style="margin-top:16px;color:var(--ink-2);max-width:60ch" data-slot="bio">
            Eu construo software. Já construí <span data-slot="sistema-a">[PREENCHER: sistema A — o que ele faz, no presente]</span>
            e <span data-slot="sistema-b">[PREENCHER: sistema B — idem]</span>. Aqui eu faço a mesma coisa para empresa que
            não tem time de TI — e o primeiro pedaço, quase sempre, é o site.
          </p>
          <ul class="construi">
            <li>Um sistema que lê edital de licitação e diz se a empresa pode participar.</li>
            <li>Um livro-caixa que puxa extrato de banco e fecha o mês.</li>
            <li><span class="ink3">[gate do founder: quais outros podem aparecer publicamente?]</span></li>
          </ul>
          <div style="display:flex;gap:12px;margin-top:28px;flex-wrap:wrap">
            <a class="btn btn-2 btn-sm" href="#" target="_blank" rel="noopener">LinkedIn ${ic.externo}</a>
            <a class="btn btn-2 btn-sm" href="#" target="_blank" rel="noopener">GitHub ${ic.externo}</a>
          </div>
          <p class="t-cap" style="margin-top:12px">Campo vazio não vira botão: link para perfil vazio pontua pior que link nenhum.</p>
        </div>

        <div class="bloqueio">
          <span class="chip">bloqueio real</span>
          <p class="t-body-sm" style="color:var(--ink)">O retrato entra aqui, 4:5, com filete de 1px.</p>
          <p class="t-cap">
            Sem foto, esta coluna <b>não renderiza</b> e o texto ocupa a largura toda. Nunca placeholder cinza com
            silhueta — dá exatamente o sinal de “não estabelecido” que a seção existe para desmentir.
            <br><br>
            <span class="bronze mono">lib/perfil.ts está com <b>PREENCHER: nome</b>.</span>
            Nenhuma decisão de arte destrava isso.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>`,
});

/* ─────────────────────── §8 007 POR ONDE COMEÇA ─────────────────────── */
const INCLUSO = [
  "site completo, escrito e montado do zero",
  "funciona no celular — que é onde o seu cliente está",
  "o Google acha ele",
  "formulário que chega em você de verdade, não some",
  "manutenção mensal — o site não envelhece sozinho",
  "ligado no seu WhatsApp, que é onde a venda acontece",
];
const DEPOIS = [
  "alguém que responde primeiro, 24 h por dia, e te passa só o que precisa de você",
  "fazer os seus sistemas conversarem entre si",
  "o caminho do pedido, do começo ao fim, sem passar pela sua mão",
  "sistema sob medida, quando nada de prateleira serve",
];
S({
  id: "comeco", arq: "08-por-onde-comeca", nome: "§8 · 007 Por onde começa",
  de: "geometria de `002 VALUES` / `003 CAPABILITIES` — vira 2 colunas de PESO IGUAL",
  html: `
<section class="sec" id="comeco">
  <div class="dots dots--32"></div>
  <div class="wrap wrap--wide">
    ${head("007", "por onde começa", "Começa pelo seu site.",
      "Porque é onde o cliente entra — e a primeira coisa que consome o seu dia é atender quem chega. Resolvido isso, o resto da operação fica visível.")}
    <div class="sec-body">
      <div class="g2">
        <article class="card" style="padding:28px">
          <span class="chip chip--on">o que está incluso</span>
          <ul class="lista">
            ${INCLUSO.map((i) => `<li><span class="bronze">${ic.check}</span>${i}</li>`).join("\n            ")}
          </ul>
        </article>
        <article class="card card--tracejado" style="padding:28px">
          <span class="chip">o que vem depois</span>
          <ul class="lista">
            ${DEPOIS.map((i) => `<li><span class="ink3">${ic.mais}</span>${i}</li>`).join("\n            ")}
          </ul>
          <p class="t-cap" style="margin-top:auto">A borda tracejada é literal: isto ainda não existe no seu contrato.</p>
        </article>
      </div>
      <p class="t-body-sm" style="text-align:center;margin-top:32px">Nada disso é obrigatório e nada disso entra sem você pedir.</p>
      <p style="text-align:center;margin-top:28px"><a class="btn btn-1" href="#contato">quero começar por aqui</a></p>
    </div>
  </div>
</section>`,
});

/* ─────────────────────── §9 008 COMO SE COMPARA ─────────────────────── */
const COLS = ["agência", "freelancer", "eu mesmo no Wix", "deixar como está", "comigo"];
const SIM = `<span class="marca-sn sn-sim">${ic.check}</span><span class="sn-rot">sim</span>`;
const NAO = `<span class="marca-sn sn-nao">${ic.x}</span><span class="sn-rot">não</span>`;
const MEIO = `<span class="marca-sn sn-meio">${ic.meio}</span><span class="sn-rot">às vezes</span>`;
const NA = `<span class="sn-rot">não se aplica</span>`;
const TXT = (t) => `<span class="sn-rot">${t}</span>`;
const LINHAS = [
  ["quem conversou com você é quem constrói?", [NAO, SIM, SIM, NA, SIM]],
  ["você sabe o que vai receber e quando, por escrito, antes de pagar?", [MEIO, NAO, NA, NA, SIM]],
  ["já nasce ligado ao seu WhatsApp?", [MEIO, NAO, NAO, NAO, SIM]],
  ["manutenção está no combinado ou é venda depois?", [TXT("venda depois"), TXT("venda depois"), TXT("é com você"), NA, TXT("no combinado")]],
  ["dá pra ver funcionando antes de aprovar?", [NAO, MEIO, SIM, NA, SIM]],
  ["sai mais barato na entrada?", [NAO, SIM, TXT("bem mais"), TXT("de graça"), NAO]],
  ["tem equipe pra tocar várias frentes ao mesmo tempo?", [TXT("bem maior"), NAO, NA, NA, NAO]],
];
S({
  id: "compara", arq: "09-como-se-compara", nome: "§9 · 008 Como se compara",
  de: "NÃO EXISTE NO CONICORN — construída do zero na gramática dele (pílula + H2 centrado)",
  html: `
<section class="sec sec--surf" id="compara">
  <div class="wrap wrap--wide">
    ${head("008", "como se compara", "As suas quatro opções, escritas do jeito que elas são.",
      "Você não está escolhendo entre mim e ninguém. Está escolhendo entre quatro caminhos, e três deles são legítimos. Aqui está a diferença sem enfeite — inclusive onde eu perco.")}
    <div class="sec-body">
      <div class="scroller">
        <div class="matriz" role="table" aria-label="Comparação de quatro caminhos">
          <div class="mz-h mz-q" role="columnheader">a pergunta</div>
          ${COLS.map((c) => `<div class="mz-h${c === "comigo" ? " mz-eu" : ""}" role="columnheader">${c}</div>`).join("\n          ")}
          ${LINHAS.map(([q, cel]) => `
          <div class="mz-c mz-q" role="rowheader">${q}</div>
          ${cel.map((v, i) => `<div class="mz-c${i === 4 ? " mz-eu" : ""}" role="cell">${v}</div>`).join("\n          ")}`).join("")}
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-top:20px;align-items:center">
        <p class="t-cap" style="max-width:52ch">As duas últimas linhas eu perco de propósito. Tabela em que o dono ganha tudo lê como propaganda — e uma quebra de confiança não volta.</p>
        <button class="btn btn-2 btn-sm">mandar isso pro meu sócio</button>
      </div>
    </div>
  </div>
</section>`,
});

/* ─────────────────────── §10 009 COMPROMISSOS ─────────────────────── */
const COMPROMISSOS = [
  { l: "01 · antes de começar", t: "Escopo e prazo fechados.", p: "Você sabe o que vai receber e quando, por escrito, antes de qualquer coisa começar. Sem “projeto em andamento” por seis meses." },
  { l: "02 · durante", t: "O preço não muda no meio.", p: "O que a gente combinar no começo é o que você paga no fim. Se o escopo mudar, quem decide é você, antes." },
  { l: "03 · depois", t: "Manutenção mensal já está no combinado.", p: "Não é venda separada depois. Sistema que conversa com outro sistema quebra quando um deles muda — isso é rotina, não acidente, e está previsto." },
];
S({
  id: "combinado", arq: "10-compromissos", nome: "§10 · 009 O que fica combinado",
  de: "grade `Your Data. Protected. Always.` do conicorn — 4 células viram 3 (teto Baymard)",
  html: `
<section class="sec sec--tira" id="combinado">
  <div class="brilho brilho--topo"></div>
  <div class="wrap wrap--wide">
    ${head("009", "o que fica combinado", "Três coisas que entram por escrito antes de você pagar qualquer coisa.", null)}
    <div class="sec-body" style="margin-top:48px">
      <div class="tira">
        ${COMPROMISSOS.map((c) => `<div class="tira-c">
          <span class="tira-leg"><i class="pulso"></i>${c.l}</span>
          <h3 class="t-h5">${c.t}</h3>
          <p class="t-body-sm">${c.p}</p>
        </div>`).join("\n        ")}
      </div>
      <p class="t-cap" style="text-align:center;margin-top:24px">Três. Um quarto item não soma — substitui.</p>
    </div>
  </div>
</section>`,
});

/* ─────────────────────── §11 010 FAQ ─────────────────────── */
const FAQS = [
  ["Quanto tempo leva?", "O site fica pronto em semanas, não meses — e o prazo entra por escrito antes de começar. Tirar um processo da mão depende do tamanho: o primeiro olhar sai em dias, a construção varia conforme quantos sistemas precisam conversar. Você sabe o número antes de aprovar, não depois."],
  ["Preciso trocar os sistemas que já uso?", "Não. Na maioria das vezes o problema não é o sistema, é o vão entre um sistema e outro — e é esse vão que eu fecho. Se em algum ponto trocar for mesmo melhor, eu digo, com o motivo; mas trocar ERP não é o serviço."],
  ["E se eu não souber por onde começar?", "É o caso mais comum, e é para isso que serve o mapa aqui em cima. Você descreve o que consome tempo, com as suas palavras, e o diagnóstico aponta o que sai da sua mão. Não precisa chegar com o problema pronto."],
  ["Isso vai substituir a minha equipe?", "A intenção é tirar da sua equipe o trabalho que ninguém queria fazer — responder a mesma pergunta pela vigésima vez, conferir se o pedido entrou, avisar o setor do lado. O que exige julgamento continua com gente, e o mapa marca essas etapas como “fica com você” justamente porque automatizar decisão seria terceirizar critério."],
  ["Quanto custa?", "Depende do tamanho, e eu prefiro dizer isso a colocar um número na página que não vale para o seu caso. O que dá para adiantar: o escopo é fechado antes de começar, o preço não muda no meio, e a conversa de orçamento não custa nada."],
  ["E se parar de funcionar depois de pronto?", "Manutenção mensal faz parte do combinado desde o começo, não é venda separada depois. Sistema que integra outros sistemas quebra quando um deles muda — isso não é acidente, é rotina, e está previsto."],
  ["Você trabalha com empresa do meu tamanho?", "Meu público é justamente quem não tem time de TI: PME e indústria pequena e média. Empresa com departamento de tecnologia próprio normalmente não precisa de mim — precisa de gente que trabalhe dentro do time que já existe."],
  ["E se eu já tentei com outro e não deu certo?", "É comum, e quase nunca a culpa é sua. As três coisas que mais quebram são: prometeram o que o produto não fazia, o preço mudou no caminho, ou sumiram na hora de instalar. É por isso que as três coisas que eu ponho por escrito antes de começar são exatamente essas."],
];
S({
  id: "faq", arq: "11-faq", nome: "§11 · 010 Perguntas",
  de: "`010 ● FAQS` / “Common Questions” — acordeão numerado. Mantida a numeração dele.",
  html: `
<section class="sec" id="faq">
  <div class="wrap wrap--wide">
    ${head("010", "perguntas", "O que costumam me perguntar antes de fechar.",
      "Se a sua dúvida não estiver aqui, é só mandar — respondo eu.")}
    <div class="sec-body">
      <div class="faq">
        ${FAQS.map(([q, a], i) => `<details class="faq-item"${i === 0 ? " open" : ""}>
          <summary>
            <span class="faq-n">${String(i + 1).padStart(2, "0")}</span>
            <span class="faq-q" style="flex:1">${q}</span>
            <span class="faq-ic">${ic.mais}</span>
          </summary>
          <p class="faq-a">${a}</p>
        </details>`).join("\n        ")}
      </div>
      <p style="text-align:center;margin-top:32px"><a class="cta-mono" href="#contato">minha dúvida não tá aqui ${ic.seta}</a></p>
    </div>
  </div>
</section>`,
});

/* ─────────────────────── §12 CONTATO ─────────────────────── */
S({
  id: "contato", arq: "12-contato", nome: "§12 · Contato",
  de: "bloco de CTA do rodapé do conicorn (“Your Competitors Are Automating. Are you?”) — sem número, como lá",
  html: `
<section class="sec" id="contato" style="padding-block:160px">
  <div class="brilho brilho--centro"></div>
  <div class="dots dots--24"></div>
  <div class="wrap">
    ${head(null, "contato", "Me conta o que mais come o seu dia.",
      "Não precisa saber o que quer construir. Descreve o que te consome tempo — o resto é comigo. Respondo eu, não um formulário.")}
    <div class="sec-body">
      <form class="contato" onsubmit="return false">
        <div class="anexo" id="anexo">
          <span class="t-micro bronze">o seu mapa já vai junto</span>
          <p class="t-cap">Aquele que você fez ali em cima — os passos, as horas, a conta inteira. Você não precisa copiar nada.
            <a href="#prova" style="border-bottom:1px solid var(--border-strong)">editar</a></p>
        </div>
        <div class="campo"><label for="nome">seu nome</label><input id="nome" type="text" placeholder="como te chamam"></div>
        <div class="campo"><label for="zap">whatsapp</label><input id="zap" type="text" placeholder="com DDD"></div>
        <div class="campo"><label for="dor">o que mais consome tempo hoje?</label>
          <textarea id="dor" rows="4" placeholder="pode escrever do seu jeito"></textarea></div>
        <button class="btn btn-1" type="submit">mandar pro seu WhatsApp</button>
        <p class="aviso">Sem número configurado, este botão avisa em vez de fingir que enviou.
          <b style="color:var(--ink)">PERFIL.whatsapp está vazio</b> — bloqueio de publicação, não de arte.</p>
        <p class="t-cap" style="text-align:center">Ou chama direto no WhatsApp.</p>
      </form>
    </div>
  </div>
</section>`,
});

/* ─────────────────────── §13 RODAPÉ ─────────────────────── */
S({
  id: "rodape", arq: "13-rodape", nome: "§13 · Rodapé",
  de: "`footer` do conicorn — colunas de link + carimbo",
  html: `
<footer class="rodape" id="rodape">
  <div class="brilho" style="background:radial-gradient(ellipse 1200px 360px at 50% 0%,var(--bronze-soft),transparent 70%);opacity:.55;z-index:-2"></div>
  <div class="dots dots--24" style="z-index:-1"></div>
  <div class="rodape-topo">
    <span style="display:inline-flex;align-items:center;gap:8px"><i class="pulso"></i>Florianópolis · GMT-3</span>
    <a href="#topo" style="display:inline-flex;align-items:center;gap:7px">voltar ao topo ${ic.setaCima}</a>
  </div>
  <div class="rodape-cols">
    <div>
      <a class="marca" href="#topo">${ic.marca}<span>Talos</span></a>
      <p class="t-body-sm" style="margin-top:14px;max-width:34ch">Máquinas que atendem, registram e avisam — pra isso não depender de você.</p>
    </div>
    <div><h3>a página</h3><ul>
      <li><a href="#problema">o problema</a></li>
      <li><a href="#prova">ver rodando</a></li>
      <li><a href="#quem">quem faz</a></li>
      <li><a href="#comeco">por onde começa</a></li>
    </ul></div>
    <div><h3>decidir</h3><ul>
      <li><a href="#compara">como se compara</a></li>
      <li><a href="#combinado">o que fica combinado</a></li>
      <li><a href="#faq">perguntas</a></li>
    </ul></div>
    <div><h3>falar</h3><ul>
      <li><a href="#contato">mandar mensagem</a></li>
      <li><a href="#contato">whatsapp</a></li>
    </ul></div>
  </div>
  <div class="rodape-fim">
    <span>mockup de aprovação · gate F4 · não publicado</span>
    <span>nenhum case · nenhum logo de cliente · nenhum depoimento · nenhum preço</span>
  </div>
</footer>`,
});

/* ══════════════════════════════════════════════════════════════════════════
   5 · JS — só o demo precisa. O conteúdo funciona sem JS.
   ══════════════════════════════════════════════════════════════════════════ */
const JS = String.raw`
import { mapear } from "./mapear.js";

const SINAL = {
  automatizavel:{cls:"auto",rot:"sai da sua mão",ic:'${ic.check.replace(/'/g, "\\'")}'},
  parcial:{cls:"parcial",rot:"fica pela metade",ic:'${ic.meio.replace(/'/g, "\\'")}'},
  humana:{cls:"humana",rot:"fica com você",ic:'${ic.mao.replace(/'/g, "\\'")}'},
  nao_lida:{cls:"naoli",rot:"não li",ic:'${ic.x.replace(/'/g, "\\'")}'}
};
const q = (s,r=document)=>r.querySelector(s);
const esc = (s)=>String(s).replace(/[&<>"]/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const vg = (n)=>String(n).replace(".",",");

/* ── §4 abas ── */
document.querySelectorAll("[data-aba]").forEach((b)=>{
  b.addEventListener("click",()=>{
    document.querySelectorAll("[data-aba]").forEach((o)=>o.setAttribute("aria-selected",String(o===b)));
    document.querySelectorAll(".painel-ramo").forEach((p)=>{p.hidden = p.id !== "pnl-"+b.dataset.aba;});
  });
});
/* ── §4 → §5: "esse é o meu" pré-preenche e rola ── */
document.querySelectorAll("[data-exemplo]").forEach((b)=>{
  b.addEventListener("click",()=>{
    const t = q("#proc"); if(!t) return;
    t.value = b.dataset.exemplo;
    rodar();
    q("#prova")?.scrollIntoView({behavior:"smooth",block:"start"});
    t.focus({preventScroll:true});
  });
});

/* ── §5 demo. Zero delay artificial, zero spinner: o tempo mostrado é o real. ── */
function rodar(){
  const t = q("#proc"); if(!t) return;
  const qtd = Math.max(1, parseInt(q("#freq")?.value || "5", 10));
  const porSemana = q("#periodo")?.value === "mes" ? qtd/4.33 : qtd;
  const r = mapear(t.value, porSemana);

  q("#etapas").innerHTML = r.etapas.map((e)=>{
    const s = SINAL[e.vereditoReal];
    return '<div class="etapa etapa--'+s.cls+'">'+
      '<span class="etapa-n">'+String(e.n).padStart(2,"0")+'</span>'+
      '<span><span class="etapa-txt">'+esc(e.texto)+'</span><span class="etapa-motivo">'+esc(e.motivo)+'</span></span>'+
      '<span class="etapa-sinal">'+s.ic+s.rot+'</span></div>';
  }).join("");

  q("#resumo").textContent =
    r.automatizaveis+" saem da sua mão · "+r.parciais+" pela metade · "+r.humanas+" ficam com você"+
    (r.naoLidas ? " · "+r.naoLidas+" não li" : "");
  q("#horas").textContent = vg(r.horasMes);
  const minExec = r.vezesPorSemana ? Math.round(r.minutosSemana / r.vezesPorSemana) : 0;
  q("#premissa").innerHTML =
    "A conta: "+minExec+" minutos por execução × "+vg(Math.round(r.vezesPorSemana*10)/10)+" vezes por semana × 4,33 semanas no mês. "+
    "Etapa que eu não li vale zero — somar seria chute. Parcial entra pela metade, porque a máquina redige e você confere.";
  q("#trace").innerHTML =
    '<p class="t-micro" style="margin-bottom:8px">a máquina por dentro</p>'+
    r.trace.map((x)=>'<div class="trace-l"><span>'+esc(x.op)+" — "+esc(x.detalhe)+'</span><b>'+vg(x.ms)+' ms</b></div>').join("")+
    '<div class="trace-l" style="border-top:1px solid var(--border);margin-top:8px;padding-top:6px"><span>total</span><b>'+vg(r.totalMs)+' ms</b></div>';

  /* furo de conversão nº 1: o mapa PERSISTE até a §12 e o card mostra que já foi anexado */
  try{ sessionStorage.setItem("talos-mapa", JSON.stringify({texto:t.value, horas:r.horasMes, passos:r.etapasDetectadas, auto:r.automatizaveis})); }catch(_){}
  pintarAnexo();
}
function pintarAnexo(){
  const el = q("#anexo"); if(!el) return;
  let m = null; try{ m = JSON.parse(sessionStorage.getItem("talos-mapa")||"null"); }catch(_){}
  if(!m){ el.hidden = true; return; }   /* sem mapa, o card não renderiza. Nunca pedir cópia manual. */
  el.hidden = false;
  el.querySelector("p").innerHTML =
    "Aquele que você fez ali em cima — <b>"+m.passos+" passos</b>, <b>"+m.auto+" saem da sua mão</b>, <b>"+vg(m.horas)+" h por mês</b>. "+
    'Você não precisa copiar nada. <a href="#prova" style="border-bottom:1px solid var(--border-strong)">editar</a>';
}
q("#btn-ver")?.addEventListener("click",rodar);
q("#btn-ex")?.addEventListener("click",()=>{
  q("#proc").value = ${JSON.stringify(TEXTO_DEMO)};
  rodar();
});
q("#periodo")?.addEventListener("change",rodar);
pintarAnexo();

/* ── §2: duração da faixa = largura da track ÷ 40 px/s. Nunca copiar a duração da referência. ── */
const track = q(".faixa-track");
if(track){
  requestAnimationFrame(()=>{
    const d = Math.round(track.scrollWidth / 2 / 40);
    track.style.setProperty("--dur", d+"s");
  });
}

/* ── §6: o nó ativo do trilho acompanha o scroll (gesto conicorn 004 PROCESS) ── */
const passos = [...document.querySelectorAll(".passo")];
if(passos.length && "IntersectionObserver" in window){
  const io = new IntersectionObserver((es)=>{
    es.forEach((e)=>{ if(e.isIntersecting){ passos.forEach((p)=>p.classList.remove("passo--ativo")); e.target.classList.add("passo--ativo"); } });
  },{rootMargin:"-45% 0px -45% 0px"});
  passos.forEach((p)=>io.observe(p));
}
`;

/* ══════════════════════════════════════════════════════════════════════════
   6 · EMISSÃO
   ══════════════════════════════════════════════════════════════════════════ */

const doc = (title, body, { base, gate, css = "css/mockup.css", js = "js/mockup.js" }) => `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28'%3E%3Crect width='28' height='28' fill='%230f0f0f'/%3E%3Crect x='5' y='7' width='18' height='14' rx='4' fill='none' stroke='%23E9A23B' stroke-width='2'/%3E%3C/svg%3E">
<title>${title}</title>
<link rel="preload" href="${base}fonts/InterVariable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${base}fonts/JetBrainsMono.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${css}">
</head>
<body>
<div class="folha" aria-hidden="true"><i></i><i></i></div>
${gate || ""}
${body}
<script type="module" src="${js}"></script>
</body>
</html>`;

const resolveBase = (html, base) => html.replaceAll("{BASE}", base);

// --- index.html: página inteira, navegável
const CORPO = SECOES.map((s) => resolveBase(s.html, "../")).join("\n");
writeFileSync(out("index.html"), doc("Talos — mockup v2 (gate F4)", CORPO, { base: "" }));

// --- secoes/*.html: uma por vez, para aprovar/reprovar individualmente
SECOES.forEach((s, i) => {
  const prev = SECOES[i - 1], next = SECOES[i + 1];
  const gate = `
<div class="gate">
  <span><b>${s.nome}</b></span>
  <span class="sep">·</span>
  <span>de: ${s.de}</span>
  <span class="sep">|</span>
  ${prev ? `<a href="${prev.arq}.html">← ${prev.nome}</a>` : `<span class="sep">← início</span>`}
  ${next ? `<a href="${next.arq}.html">${next.nome} →</a>` : `<span class="sep">fim →</span>`}
  <a href="index.html">todas</a>
  <a href="../index.html">página inteira</a>
</div>`;
  const corpo = resolveBase(s.html, "../../");
  writeFileSync(
    out("secoes", s.arq + ".html"),
    doc(`${s.nome} — mockup v2`, corpo, { base: "../", gate, css: "../css/mockup.css", js: "../js/mockup.js" })
  );
});

// --- secoes/index.html: painel de aprovação
const painel = `
<section class="sec" style="border-top:0">
  <div class="wrap">
    <div class="sec-head">
      <span class="crop"><span class="pill"><span class="pill-n">F4</span><span class="pill-t"><i class="pill-dot"></i>aprovação seção a seção</span></span></span>
      <h2>Uma de cada vez.</h2>
      <p class="lead">Cada linha abre a seção isolada, no sistema real, sem o resto da página em volta.
      Aprovar ou reprovar uma não trava as outras.</p>
    </div>
    <div class="sec-body">
      <div class="painel" style="overflow:hidden">
        ${SECOES.map((s, i) => `<a href="${s.arq}.html" style="display:grid;grid-template-columns:44px 1fr auto;gap:16px;align-items:center;padding:18px 22px;${i ? "border-top:1px solid var(--border)" : ""}">
          <span class="t-micro">${String(i).padStart(2, "0")}</span>
          <span><span class="t-h5" style="display:block">${s.nome}</span><span class="t-cap" style="display:block;margin-top:4px">de: ${s.de}</span></span>
          <span class="bronze">${ic.seta}</span>
        </a>`).join("\n        ")}
      </div>
      <p style="text-align:center;margin-top:32px"><a class="btn btn-1" href="../index.html">ver a página inteira</a></p>
    </div>
  </div>
</section>`;
writeFileSync(out("secoes", "index.html"), doc("Aprovação seção a seção — mockup v2", painel, { base: "../", css: "../css/mockup.css", js: "../js/mockup.js" }));

writeFileSync(out("css", "mockup.css"), CSS.trim() + "\n");
writeFileSync(out("js", "mockup.js"), JS.trim() + "\n");

// --- fontes self-hosted (SIL OFL 1.1), sem CDN
for (const f of ["InterVariable.woff2", "JetBrainsMono.woff2"]) {
  const src = join(DIR, "..", "mockup", "fonts", f);
  if (existsSync(src) && !existsSync(out("fonts", f))) copyFileSync(src, out("fonts", f));
}

console.log(`ok — ${SECOES.length} seções · index.html + secoes/*.html`);
console.log(`   hero: ${R_HERO.etapasDetectadas} passos · demo: ${R_DEMO.etapasDetectadas} passos, ${R_DEMO.horasMes} h/mês, ${R_DEMO.totalMs} ms`);
