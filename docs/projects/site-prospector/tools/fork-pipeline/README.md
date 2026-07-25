# Fork Pipeline — mockup fiel a partir do código real de uma referência premiada

Constrói um site de proposta para um prospect **forkando o código real** de um site de referência
(capturado, não imitado) e trocando marca, produto e copy dentro dele.

Estado em 2026-07-25: **Chokolaten** (9 páginas, ref. buckssauce) e **Engel Joias** (7 páginas, ref. emphasis).

---

## Por que existe

Builds anteriores saíram genéricos ("parece feito com prompt no ChatGPT") porque eram construídos a partir de
**screenshot + resumo de tokens**. A correção não é "olhar melhor a referência" — é **persistir o código dela
em disco e forkar**. Prosa sobre código é um prompt; código é código.

---

## Fluxo

```
1. probe        → vale a pena? (mede CSS; descarta site JS-driven e holding page)
2. resolve-refs → domínio vivo a partir da página do Awwwards
3. capture-site → captura o SITE INTEIRO em inputs/ (DOM + CSS + assets + screenshots)
4. photo-gate   → as fotos do prospect servem? (+ confirmação VISUAL obrigatória)
5. crop/nobg    → limpa as fotos (tira texto queimado; recorta fundo chapado)
6. build-fork   → monta o fork multi-página a partir de um JSON de marca
7. shoot        → screenshots do resultado p/ comparar com o baseline da referência
```

### 1. `probe.cjs` — sonda de forkabilidade (30 s, faça SEMPRE antes)

```bash
node probe.cjs https://exemplo.com/ [outra...]
```
Mede CSS externo · inline · nós · imagens · altura.

| CSS externo | veredito |
|---|---|
| > 100 KB | ✅ forka (layout CSS-driven) |
| 30–100 KB | 🟡 testar |
| < 30 KB num site complexo | ❌ **não forka** — posicionado por JS, colapsa sem os bundles |

Também pega **site-fantasma**: CSS enorme + página curta (ex.: 2 MB de CSS em 971px) = holding page,
o prêmio é de uma versão que saiu do ar.

### 2. `resolve-refs.cjs` — domínio vivo

```bash
node resolve-refs.cjs nueno-digital-fashion-brand emphasis-jewellery-brand-site
```
Awwwards só publica a página do prêmio. curl leva bloqueio; isso abre no browser e extrai o link.

### 3. `capture-site.cjs` — captura o site inteiro

```bash
node capture-site.cjs https://exemplo.com/ <outDir> [maxPaginas]
```
Descobre os links internos a partir da home e captura **cada página**: `pages/<slug>/page.html`
(DOM renderizado pós-scroll), `intel.json`, `screens/`. Assets e CSS ficam no nível do site.
Usa Chrome real (puppeteer-core) — passa por Vercel Security Checkpoint, que devolve 429 para curl.

### 4. `photo-gate.cjs` — as fotos do prospect servem?

```bash
node photo-gate.cjs <dirComPastasDeProspect>
```
Mede fundo chapado, texto queimado nos cantos, tamanho do sujeito e assinatura de imagem gerada por IA
(1024² é saída de gerador; foto real de IG é 1080×1080 ou 1080×1350).

> ⚠️ **O gate erra sozinho — confirme no olho.** Moldura de design chapada (polaroid, slide de carrossel)
> passa no teste de "fundo removível". Já deu falso-positivo em Delicaten e Cataia.

> ⚠️ **O gate mede recorte, que só importa para o arquétipo certo.** Layout editorial usa foto de
> **ambiente**, não recorte — foi assim que a Engel Joias saiu de "0 de 29 aprovadas" para site pronto.
> Antes de reprovar um prospect, verifique se o par referência↔foto está certo.

### 5. `build-fork.cjs` — o fork

```bash
node build-fork.cjs brands/<prospect>.json
```
Por página: remove runtime remoto (hidratação, analytics, pixels) · aponta imagens e links para local ·
troca logo, imagens e texto · regenera títulos split-text · remove preço · injeta o chrome do mockup.
Idempotente: sempre reconstrói a partir da captura.

---

## O JSON de marca

```jsonc
{
  "name": "Engel Joias", "tagline": "...",
  "referenceSite": ".../jewelry/emphasis/site",   // saída do capture-site
  "out": ".../engeljoias/site-fork",
  "brandAssetDirs": [".../assets/clean"],          // vira assets/img/bk-*
  "logo": { "viewBox": "0 0 118 142", "file": "logo-cream.png" },
  "images":      { "arquivo-da-ref.jpg": "foto-do-prospect.jpg" },
  "blankImages": ["logo-de-imprensa.svg"],         // sem equivalente → pixel transparente
  "killCssUrls": ["/images/textura-da-marca.webp"],
  "text":     [["string de ORIGEM", "tradução"]],  // ordem importa: longa antes da curta
  "textNth":  [["Crushed", ["Barras","Linha","Drágeas"]]],
  "arcTitles":    [["rótulo", "LetrasDoArco"]],
  "recharLabels": ["SABORES"]
}
```

---

## Armadilhas já pagas

| sintoma | causa | conserto |
|---|---|---|
| Substituição de texto não pega | O DOM escreve **minúsculo** e o CSS faz `uppercase`. Você mapeou o texto renderizado | Extraia as strings de **origem** do `page.html` |
| Título vira lixo (`ONDEA PRATAENCNOTRAO`) | Título é **split-text** (char a char, ou arco com x/y por letra) | Regenere os `<char>`/`<span data-arc-letter>`, não faça `replace` |
| `FEATURED LINHAS` | Mapa mais curto disparou antes do mais longo | Longa **antes** da curta no array |
| Página sem estilo no screenshot | Headless reporta `prefers-reduced-motion: reduce` **por padrão** | `emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}])` |
| `window.gsap === false` mas há animação | GSAP empacotado não vai pro `window` | Procure `.pin-spacer` no DOM |
| Imagem não resolve | A captura sanitiza o nome (`1@1x.jpg` → `1_1x.jpg`) | `build-fork` já tenta a forma sanitizada |
| Todas as imagens viram o mesmo arquivo | `/_next/image?url=...` colapsa no mesmo basename | `capture-site` extrai o parâmetro `url=` |
| Modal de cookie trava a página | O JS que fecha foi removido | `build-fork` já esconde OneTrust/Cookiebot/etc. |
| Página 404 no servidor local | `%XX` no nome de arquivo | `build-fork` já converte para `-` |
| `EPERM` ao rebuildar (Windows) | Algum shell está **dentro** da pasta de saída | `build-fork` já cai para limpar só o conteúdo |
| Hero com foto errada | Escolher foto por **tamanho de arquivo** pega frame de reel | Ranqueie pelo `corner` do photo-gate |

---

## Referências com forkabilidade testada

| nicho | referência | prêmio | domínio | |
|---|---|---|---|---|
| alimento CPG | buckssauce | — | `buckssauce.com` | ✅ 9 páginas |
| joias | emphasis | 🔎 HM | `emphasis.com/en/` | ✅ 7 páginas |
| decoração | espacio home design | 🔎 HM | `espaciohdg.com/en` | ✅ sondado |
| moda | anna clothing | 🔎 HM | `shopatanna.com` | ✅ sondado |
| móveis | format | 🔎 HM | `format.furniture` | ✅ testado |
| moda editorial | nueno | 🏆 SOTD | `nuenofashion.com` | ❌ JS-driven |
| moda infantil | district clothing | 🔎 HM | `districtclothing.com` | ❌ holding page |
| calçados | volta footwear | 🏆 SOTD | `voltafootwear.com` | ⚠️ 1 imagem, é landing |

---

## Regras que não se negocia

- **Não inventar.** Sem preço, sem depoimento de cliente, sem história de fundador que não existe.
  O que faltar vira `[A CONFIRMAR: ...]` **visível na página**.
- **Imprensa/prêmio da referência não vira imprensa do prospect.** Use `blankImages`.
- **Mockup privado.** Todo build sai com a faixa "MOCKUP PRIVADO · não publicado" e `noindex`.
- A fonte proprietária da referência (ex.: PeperoncinoSans) renderiza no pitch, mas **precisa ser
  licenciada ou trocada** antes de qualquer uso além disso.

## O que NÃO entra no git

Capturas, raspagens de Instagram e os forks montados somam centenas de MB e são **reproduzíveis**
por estes scripts. Ficam no `.gitignore`. O que se versiona é a ferramenta e os JSON de marca.
