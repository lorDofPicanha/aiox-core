# Rodada 2 de referências — 10 sites capturados

**Data:** 2026-07-27 · **Pedido do founder:** "acho que ainda está faltando elementos, faça uma
procura de 10 sites para usarmos como referências nestes nichos"

**Nichos escolhidos por ele:** agências de automação/IA · sites premiados com WebGL/3D · móveis e
lazer de luxo.
**Buracos que ele apontou no Talos:** craft visual e movimento · seções que não existem ·
identidade visual própria.

> A rodada 1 (`inputs/clerk|resend|trigger|liveblocks|railway`) tinha um viés que só ficou óbvio
> agora: **são cinco dev-tools SaaS.** Nenhuma vende serviço, nenhuma tem portfólio, nenhuma
> precisa resolver "não tenho case". O Talos é agência. Estávamos forkando o vizinho errado.

---

## Método — o que foi medido, não achado

Cada candidato passou por `probe.cjs` antes de qualquer captura
([[reference_forkability_test]]: CSS externo minúsculo em site complexo = layout posicionado por
JS, colapsa sem os bundles). Só depois de passar é que virou captura persistida em `inputs/`
([[feedback_site_prospector_real_code_photo_gate]]: código em disco, não prosa sobre código).

**Reprovados na sondagem** — ficam registrados para ninguém tentar de novo:

| Site | Por quê |
|---|---|
| `yinger.dev` | 18KB CSS · 406 nós · altura 600px — tudo montado por JS |
| `sleep-well-creatives.com` | 4KB CSS externo, 28.504px de página — JS-driven |
| `vitra.com` · `rimowa.com` | 0KB CSS externo, 7–46 nós — shell vazio, conteúdo por hidratação |
| `hubtown.co.in` · `by-kin.com` · `ohzi.io` | CSS ok, mas altura travada em 600px (preloader) |
| `explore.ownprimland.com` | 153KB CSS mas 241 nós e altura 0 — só o preloader responde |
| `merci-michel.com` | 63KB · 221 nós · 600px |

---

## As 10 capturadas

### A. Agência / automação — o nicho que faltava no benchmark

**1. ORYZO AI** — `oryzo.ai` · 303KB CSS · **56.691px numa única página** · 5 seções
Awwwards Site of the Month (abr/2026) + Developer Award. É do estúdio **Lusion**.

O achado não é visual, é estratégico: **é um site inteiro vendendo um produto que não existe.**
Um porta-copos. O fecho da página diz, com todas as letras:

> *"WE CAUGHT YOUR ATTENTION WITH A NON-EXISTENT PRODUCT. IF WE CAN SELL A COASTER, IMAGINE WHAT
> WE CAN DO FOR YOUR BRAND."*

É exatamente o problema do Talos — "não tenho case real, não quero falar de mim" — resolvido por
demonstração em vez de portfólio. O mesmo movimento do demo da §3, com muito mais ambição.

Paleta (extraída): `#100904` walnut · `#ffedd7` cream · `#382416` bark · `#dc5000` ember.
Regra do sistema: **nunca `#fff`, nunca `#000`** — a temperatura é a assinatura.
Tipografia: `15vw` (= 216px em 1440). Seções de `100vh` cada. Literata + DM Mono.

**2. n8n** — `n8n.io` · 239KB · 6 páginas · home 7.989px · **20 a 32 seções por página**
Automação de workflow. É o concorrente conceitual mais direto que existe.

Estrutura que o Talos não tem: *casos de uso comuns · biblioteca de templates · por que n8n ·
integrações · case studies · segurança & observabilidade · governança*. Páginas dedicadas por
tema (`/ai`, `/ai-agents`, `/features`, `/integrations`), cada uma 7–12k px.

Regra explícita do sistema deles, que vale citar: *"nunca usar cinza escuro neutro — todas as
superfícies têm o undertone violeta que diferencia o dark do n8n do dark genérico."*

**3. Iventions** — `iventions.com` · 166KB · 6 páginas · **home 16.484px, 38 seções**
CSSDA Website of the Month + Awwwards SOTD + Developer Award. Three.js + GSAP.
**Agência de serviços** — o modelo estrutural mais próximo do que o Talos precisa ser.

Padrão de página de serviço (`/service/congresses`, `/events`, `/exhibits` — 9.700 a 11.400px
cada, 28–30 seções): H1 de **120px** → promessa → **três passos** (*We define · We shape · We
deliver*) → grade de trabalho → **"Get a quote"** como seção própria → **"Experts Answers" (FAQ)**.

**4. Uncommon Studio** — `uncommonstudio.com.au` · 111KB · 4 páginas · H1 120px
Awwwards SOTD + Developer Award + FWA. GSAP, transições em grid.
⚠️ As páginas de detalhe de projeto vieram vazias na captura (montadas por JS) — serve para
estrutura e CSS, não para forkar o case study.

### B. WebGL / 3D premiado

**5. Minh Pham** — `minhpham.design` · 148KB · 9.777px · 8 seções · **three + lenis + webgl**
A paleta mais próxima do que o Talos quer ser: `#0d0d0d` · `#b7ab98` (taupe quente) ·
`#c59b64` (bronze) · `#eb5939`. Headline 116px em marquee horizontal (*3D 3D 3D · VISUAL VISUAL
VISUAL · MOTION MOTION MOTION*). **`clip-path` 44 vezes** — reveal por máscara é a técnica-assinatura.

**6. Mat Voyce** — `matvoyce.tv` · 99KB · 4 páginas · **headline de 412px** · three + lenis
Awwwards SOTD, nomeado GSAP Site of the Year. Tipografia cinética levada ao limite.
Se o buraco é "identidade própria", este é o extremo do espectro: a tipografia **é** a marca.

**7. Mesh** — `clay.earth` · **662KB CSS** · 5 páginas · home 7.980px, 12 seções · three + canvas
*"Bronze ink on midnight paper."* Acento `#f2b98b` sobre `#0f0f10`, com uma regra que contradiz
diretamente o Talos hoje: **o bronze nunca é preenchimento — só contorno, sublinhado e filete.**
O botão cheio é branco-osso. Gradiente âmbar como lavagem atmosférica sangrando de baixo.
Tipografia: Chronicle (serifada) + Verlag Condensed 900 — duas famílias com papéis separados.

### C. Luxo e material

**8. Scout Motors** — `scoutmotors.com` · **home 17.890px, 16 seções** · **H2 de 270px** ·
three + lenis
E-commerce of the Year 2025. Configurador 3D dentro de um caminho de compra claro — é a referência
para o configurador estilo Porsche que está parado no [[project_tocks_store_v4_28mai]].
Depois do Mat Voyce e do ORYZO, é a maior escala tipográfica das dez: os títulos de seção
("An Icon From Day One", "For The Scout In All Of Us.") saem a 270px, com o resto da página a 72px.

⚠️ Captura parcial: o `css-collected.css` não foi gravado (632 assets e o HTML vieram normalmente).
O CSS **está recuperável** — são 123 KB em três blocos `<style>` dentro de
`pages/home/page.html`. Também gerou uma pasta-fantasma com nome de arquivo `.woff2`, porque o
descobridor de links tratou uma fonte como página. Ambos são bugs do `capture-site.cjs`, não do site.

**9. Minotti** — `minotti.com` · 316KB · 6 páginas · 8.162px · **27 seções** · `perspective`×84
Móveis de luxo italianos. Vale pela **estrutura de catálogo** — 27 seções apresentando uma coleção
inteira sem um número sequer — e pela fotografia.

⚠️ Ressalva honesta: por dentro é **Arial + Raleway + Roboto**. A escala declarada no CSS chega a
200px, mas **a home inteira renderiza tudo em 60px** — a escala grande está lá e não é usada.
Como referência de *identidade tipográfica* é fraca; como referência de *como marca de luxo
organiza catálogo longo*, é a melhor das dez. Não copie tipografia daqui.

**10. Assembly Coffee** — `assemblycoffee.co.uk` · **1.156KB CSS** (a maior das dez) · 5 páginas ·
home 7.675px, 17 seções · **gsap + ScrollTrigger + webgl**
*"Brasas numa torrefação escura."* Produto quente sobre fundo quase-preto, serifada itálica como
voz da marca, e uma decisão radical: **nenhum botão preenchido no nível primário** — as CTAs são
links em serifada itálica. Prova que dark + material quente não precisa de tema tech.
É também a única das dez com GSAP + ScrollTrigger declarados no HTML — mesma stack de scroll que o
Talos acabou de adotar.

---

## Os três buracos, respondidos com o que foi medido

### 1. Identidade visual própria — este é o achado que mais muda o resultado

O Talos usa bronze `#e9a23b` de acento sobre uma escala de neutros **fria**: `--bg: #0c0d10` tem
undertone azul, `--text: #f2f3f5` é branco frio. Todas as referências quentes fazem o oposto —
puxam a **escala inteira** para o quente:

| | fundo | texto | acento |
|---|---|---|---|
| **Talos hoje** | `#0c0d10` (azulado) | `#f2f3f5` (branco frio) | `#e9a23b` |
| ORYZO | `#100904` walnut | `#ffedd7` cream | `#dc5000` |
| Minh Pham | `#0d0d0d` | `#b7ab98` taupe | `#c59b64` |
| Mesh | `#0f0f10` | — | `#f2b98b` |
| n8n *(pelo avesso)* | `#0e0918` violeta | `#d1cece` | `#fd8925` |

Bronze sobre cinza-azulado lê como **acento aplicado a um tema dark padrão**. Bronze sobre nogueira
lê como **sistema**. É por isso que o site "parece qualquer empresa tech" — não é o bronze que está
errado, é tudo em volta dele que é neutro de fábrica.

O n8n prova a regra pelo avesso: eles escolheram violeta como undertone e **proibiram** cinza
neutro no design system, exatamente para não cair no dark genérico.

### 2. Escala tipográfica — o Talos está uma categoria abaixo

| | maior heading | como é declarado |
|---|---|---|
| Minotti | 60px | escala vai a 200px no CSS e **não é usada** |
| **Talos** | **66px** | `clamp(38px, 5.2vw, 66px)` |
| Minh Pham | 116px | `.926vw` |
| Iventions · Uncommon | 120px | fixo |
| Assembly Coffee | 188px | `clamp(3.5rem, 10vw, 11.75rem)` |
| ORYZO | 216px | `15vw`, **sem teto** |
| Scout Motors | 270px | fixo |
| Mat Voyce | 412px | `40vw` e `clamp(15rem, 28.6vw, 55rem)` — teto de 880px |

Tirando a Minotti, nenhuma referência tem teto perto de 66px. O Talos usa escala de **produto
SaaS**; as referências usam escala de **display**. Isso sozinho explica boa parte do "parece
genérico".

### 3. Seções — há dois modelos válidos, e o Talos não escolheu nenhum

| | páginas | altura da home | seções |
|---|---|---|---|
| ORYZO | 1 | 56.691px | **5** — uma ideia por tela, seções de 100vh |
| Scout Motors | 5 | 17.890px | 16 |
| Iventions | 6 | 16.484px | **38** — denso, prova empilhada |
| Minotti | 6 | 8.162px | 27 |
| n8n | 6 | 7.989px | **20–32** |
| **Talos** | **1** | **7.345px** | **9** |

Os dois extremos funcionam. O Talos está no meio: nem o mergulho cinematográfico do ORYZO, nem a
densidade de prova do n8n.

**Seções concretas que existem em todas as referências de serviço e não existem no Talos:**
- **FAQ** — "Experts Answers" no Iventions, em toda página de serviço. É padrão em venda consultiva.
- **Páginas dedicadas por serviço** — o Talos empilha tudo numa página só.
- **Casos de uso / templates** — o n8n dedica seções inteiras a "isto é o que dá para fazer".
- **"Peça um orçamento" como seção própria**, não só como CTA no fim.

### 4. Técnicas que as referências usam e o Talos não

Contagem de ocorrências no CSS capturado de cada uma:

| técnica | Talos | referências |
|---|---|---|
| `@keyframes` | **1** | **clay 207** · assembly 114 · minotti 81 · oryzo 35 |
| `filter:` | 0 | **clay 148** · assembly 49 · n8n 50 · oryzo 22 |
| `mask-image` | 4 | **assembly 61** · clay 55 · matvoyce 10 · n8n 10 |
| `backdrop-filter` | 0 no CSS | **clay 68** · n8n 34 · assembly 13 · uncommon 10 |
| `mix-blend-mode` | **0** | **clay 32** · n8n 11 · uncommon 10 · oryzo 6 |
| `clip-path` | **0** | **minhpham 44** · assembly 11 · iventions 9 |
| `perspective` | 0 | **minotti 84** · assembly 13 · n8n 4 |
| `text-stroke` | 0 | clay 5 · matvoyce 2 |
| smooth scroll (lenis) | não usa | minhpham · matvoyce · scout |
| marquee de texto | não tem | minhpham (assinatura da página) |

O número que mais salta: **`@keyframes` — 1 no Talos, 207 no clay.earth.** Não é para copiar 207
animações; é o tamanho do vocabulário de movimento que essas páginas carregam por baixo do que se vê.

---

## O que eu recomendo puxar — e em que ordem

1. **Re-temperar o sistema de cor inteiro** (ORYZO + Minh Pham). É a mudança de maior impacto por
   linha alterada: cinco tokens em `globals.css`. Sem isso, qualquer coisa que se acrescente ainda
   vai parecer tema padrão com um acento laranja.
2. **Subir a escala de display** para a faixa de 110–140px em 1440, com `vw` de teto alto.
3. **Decidir o modelo de página**: mergulho (ORYZO, seções de 100vh) ou densidade (n8n/Iventions).
   Minha recomendação é **densidade** — o Talos precisa vencer objeção de empresário, e objeção se
   vence com prova empilhada, não com atmosfera.
4. **Acrescentar FAQ e "casos de uso"** — as duas seções que todo site de serviço tem e o Talos não.
5. **`clip-path` para reveal e `mix-blend-mode` no bronze** (Minh Pham), e lenis para o scroll.

Decisão 3 é do founder. As outras quatro eu executo assim que houver aval.

---

## Onde está tudo

**231 MB de código real** em `docs/projects/aiox-site/02-references/inputs/`, somados aos 37 MB da
rodada 1 — 268 MB, 15 sites, 2.283 arquivos.

| | MB | pág | | | MB | pág |
|---|---|---|---|---|---|---|
| iventions | 52,1 | 6 | | clay | 13,1 | 5 |
| scout | 50,5 | 3 | | oryzo | 12,6 | 1 |
| matvoyce | 30,4 | 4 | | uncommon | 7,4 | 4 |
| assembly | 25,3 | 5 | | minhpham | 1,3 | 1 |
| n8n | 19,3 | 6 | | *(rodada 1)* | 37,1 | 5 sites |
| minotti | 18,1 | 6 | | | | |

Cada pasta: `css-collected.css` · `asset-manifest.json` · `site-index.json` ·
`pages/<slug>/{page.html, intel.json, screens/}` · `assets/{fonts,img}/`.

⚠️ Duas capturas vieram parciais e não servem para forkar layout, só CSS e estrutura:
**uncommon** (páginas de detalhe montadas por JS) e **minhpham** (1 página, 1,3 MB).

DESIGN.md completos (cores, dos/don'ts) já extraídos via refero para **ORYZO, Mesh, n8n e
Assembly Coffee** — dá para pedir os outros com `refero_design_md`.
