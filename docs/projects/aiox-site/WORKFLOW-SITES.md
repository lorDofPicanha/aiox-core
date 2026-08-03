# Workflow de produção de sites — v1

**Criado:** 2026-07-27, depois de o founder rejeitar o site do Talos por inteiro.
**Escopo:** só produção de site. Não serve para outra coisa.

> *"o que mais me irrita em todo o processo que você faz é: você não usa as skills de design,
> me entrega um produto genérico mesmo tendo ferramentas e referências"*

Este documento existe para tornar isso **mecanicamente impossível**, não para prometer que não
acontece de novo.

---

## Parte 1 — Por que falhou (causa, não desculpa)

Cinco causas, todas verificadas nesta sessão:

**1. Não existe gate entre referência e código.** Nada me impedia de ir de "capturei 10
referências" para "escrevi `globals.css`". A regra [[feedback_tocks_use_design_tools]] existe na
memória desde a Tocks, mas memória é lembrete passivo — não bloqueia nada.

**2. A regra do projeto lista ferramentas que não existem.**
`.claude/rules/mcp-usage.md` manda usar **Stitch**, **nano-banana-2** e **@21st-dev/magic**.
Nenhum dos três está instalado — não aparecem no `.mcp.json` nem na busca de ferramentas.
Regra que aponta para ferramenta ausente ensina a ignorar a regra.

**3. O status das ferramentas mente.** `mcp-image-studio` reporta
`{"status":"ready","api_key_configured":true}` — e falha com **401** ao gerar.
O token do Replicate no `.mcp.json` está inválido (confirmado com `curl`: HTTP 401).
Confiar no status leva a falha silenciosa no meio do trabalho.

**4. Escrever CSS é o caminho de menor resistência.** Produz algo imediatamente, compila, e o
resultado me *parece* aceitável. Só quem tem olho treinado vê que é genérico — ou seja, o erro só
aparece na sua frente, tarde demais.

**5. Não havia artefato intermediário obrigatório.** Fui de wireframe em texto direto para
componente React. Nunca produzi paleta, escala tipográfica justificada, mockup visual ou spec de
componente. **É exatamente esse vão que o workflow abaixo fecha.**

---

## Parte 2 — Inventário real das ferramentas (testado hoje, não copiado da doc)

### ✅ Funciona — verificado com execução real

| ferramenta | como se chama | o que entrega |
|---|---|---|
| **ui-ux-pro-max** | `python search.py "<query>" --all` em `.claude/skills/ui-ux-pro-max/.claude/skills/design/scripts/cip/` | 67 estilos com paleta, tipografia, materiais, "best for"/"avoid for" · 161 regras |
| **mcp-design-studio** | MCP, 24 tools | paleta 50-950, harmonia, contraste WCAG, Google Fonts, Iconify, Unsplash, tokens, **Figma** |
| **refero** | MCP | busca semântica em catálogo de sites + `DESIGN.md` pronto com dos/don'ts |
| **design-md** | skill | extrai DESIGN.md de qualquer URL por análise de CSS |
| **fork-pipeline** | `probe.cjs` → `capture-site.cjs` → `shoot-local.cjs` | sondagem de forkabilidade + captura real + A/B |
| **agents de design** | `@design-lead` `@ui-designer` `@ux-design-expert` `@design-systems-engineer` | 5 agents locais |

### ❌ Quebrado ou ausente — não colocar no caminho crítico

| ferramenta | estado real |
|---|---|
| **mcp-image-studio** | **401** — token Replicate inválido. `studio_status` mente |
| **Stitch** | não instalado |
| **nano-banana-2** | não instalado |
| **@21st-dev/magic** | não instalado |

**Gate de credencial:** antes de qualquer fase que dependa de geração de imagem, rodar o teste real
(uma geração pequena), não o `status`.

---

## Parte 3 — Ferramentas novas que resolvem o gargalo

A análise dos 100 premiados (`02-references/PROCESSO-NIVEL-PREMIADO.md`) mostrou que a barreira
não era biblioteca — era **matéria-prima** e **shader**. Estas mudam a conta:

### Shader sem escrever GLSL

| | o que é | por que importa aqui |
|---|---|---|
| **Unicorn Studio** | ferramenta visual de WebGL/shader, **zero código**, exporta para web | Derruba a barreira que eu tinha dado como intransponível. Era "aprenda GLSL"; agora é "desenhe o efeito" |
| **TSL** (Three Shading Language) | shader escrito em **JavaScript**, compila para WGSL e GLSL | Shader sem sair da linguagem. WebGPU com fallback WebGL 2 automático |
| **NodeToy** | editor de shader por nós | alternativa visual |
| **Spline** | 3D interativo sem código, exporta para web | cena 3D sem modelar na mão |

### Matéria-prima 3D por IA

**Meshy 6** (mais completo: text/image-to-3D, PBR, controle de topologia, export amplo) ·
**Tripo** (rápido, retopologia quad em segundos) · **Rodin** (topologia limpa, pronto para engine) ·
**TRELLIS 2** (open-source, Gaussian Splatting, melhor qualidade visual entre os livres).

### Motion e build

- **GSAP é 100% gratuito desde a v3.13**, incluindo **SplitText, MorphSVG, DrawSVG, ScrollTrigger**
  (patrocínio Webflow). O `splitting` que apareceu em **10 dos 14** premiados agora não custa nada.
- **Theatre.js** — editor visual de motion com studio UI: anima Three.js e DOM no olho, não no palpite.
- **Motion** (ex-Framer Motion) — absorveu o Motion One; é o padrão para UI em React.
- **v0** — gera React/Next production-ready, integra GitHub e deploy Vercel.

---

## Parte 4 — O fluxo

Seis fases. **Cada uma produz um arquivo. Sem o arquivo, a fase seguinte não começa.**

### F0 · Rota
**Artefato:** `00-context/ROTA.md`
Decide entre **Rota A** (WebGL autoral: 1,8–6 MB, shader) e **Rota B** (produção pesada: 16–28 MB,
fotografia/vídeo). Define orçamento e quem precisa ser contratado.
**Gate:** o arquivo existe e nomeia a rota. *Decisão do founder, não minha.*

### F1 · Referência
**Artefato:** `02-references/inputs/<n>/` com captura real + `REFERENCIAS.md`
**Ferramentas:** `probe.cjs` (sondar antes de capturar) → `capture-site.cjs` → `refero` → `design-md`
**Gate:** ≥5 referências capturadas em disco e aprovadas pelo founder. Prosa sobre site não conta —
[[feedback_site_prospector_real_code_photo_gate]].

### F2 · Sistema visual
**Artefato:** `04-tokens/DESIGN.md` + `tokens.json`
**Ferramentas:** `ui-ux-pro-max search` (estilo, paleta, tipografia) → `design-studio`
(`color_palette`, `color_harmony`, `contrast_check`, `fonts_search`, `tokens_validate`)
**Gate:** todo par de cor com contraste **calculado** e registrado. Escala tipográfica com teto
justificado contra a amostra de premiados. **Nenhum token inventado por mim sem passar por
ferramenta.**

### F3 · Matéria-prima 🔴 *a fase que eu pulei*
**Artefato:** `03-assets/` com os arquivos reais
- Rota A: cena 3D (Spline/Meshy/Tripo) + shader (Unicorn Studio/TSL)
- Rota B: fotografia/vídeo/ilustração tratados
**Pipeline obrigatório:** imagem → `.webp`/`.avif` · fonte → `.woff2` self-hosted · vídeo →
`.webm` · 3D → Draco/KTX2
**Gate:** `03-assets/` pesa **≥1,5 MB**. A mediana dos premiados é 6 MB; o Talos tinha 0,4 MB e
zero asset. **Site sem matéria-prima não passa daqui.**

### F4 · Mockup visual 🔴 *o gate que não existia*
**Artefato:** `05-build/mockup/` — imagem ou HTML estático de **cada seção**, aprovado pelo founder
**Ferramentas:** `@design-lead` / `@ui-designer`, Figma via design-studio, v0
**Gate:** **aprovação explícita do founder, seção por seção, ANTES de qualquer `.tsx`.**
Foi aqui que as três rodadas do Talos se perderam: eu construí 11 seções sem nunca ter mostrado
uma tela para aprovar.

### F5 · Build
**Ferramentas:** GSAP (+SplitText grátis) · Lenis · Motion · Three/TSL · Theatre.js
**Gate:** typecheck e build limpos · console sem erro · **funciona com JS desligado** ·
contraste conferido no render, não no token.

### F6 · A/B contra a referência
**Artefato:** `05-build/shots/` lado a lado com as referências da F1
**Gate:** comparação explícita. Se não aguenta ficar ao lado, volta para F4 — **não para F5**.
Refinar código não conserta direção errada; foi o erro das três rodadas.

---

## Parte 5 — O gate é executável

`node docs/projects/aiox-site/tools/gate.cjs <fase>` verifica os artefatos em disco e **falha com
exit 1** se faltar algo. Não é honra — é comando.

Regra de uso: **rodar o gate da fase anterior antes de começar a próxima.** Se falhar, a fase
anterior não terminou.

---

## Parte 6 — As três regras que eu quebrei e não posso quebrar de novo

1. **Nenhum `.tsx` de seção antes de mockup aprovado** (F4). Nem "só para testar o layout".
2. **Nenhum token de cor ou tipografia inventado por mim** — sai de `ui-ux-pro-max` ou
   `design-studio`, com contraste calculado (F2).
3. **Nenhum site sem matéria-prima** (F3). CSS bonito sobre nada continua sendo nada — foi
   literalmente o diagnóstico do Talos: 0,4 MB contra mediana de 6 MB.

E uma que vale para as ferramentas: **testar credencial com uma chamada real, nunca com `status`.**
