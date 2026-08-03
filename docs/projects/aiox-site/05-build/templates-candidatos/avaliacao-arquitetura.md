# Avaliação de arquitetura — os 4 finalistas do site Talos

**Lente:** stack, lock-in, viabilidade técnica. **Data:** 31/Jul/2026 · **Autor:** Aria (architect)
**Escopo:** decisão de PLATAFORMA. Não avalio gosto visual — isso é da direção de arte.

> **Regra deste documento:** tudo que é afirmado foi medido nesta sessão ou tem fonte citada.
> O que não pude confirmar está marcado **`[NÃO VERIFICADO]`** com o caminho exato de verificação.
> Nada foi presumido a partir do briefing.

---

## 0. Veredito em uma linha

**Nenhum dos quatro como plataforma. `wf-conicorn` como referência visual, sobre a base Next.js que já
existe em disco.** O motivo não é preferência: `mapear.ts` compilado e minificado dá **12.010
caracteres**, e o limite de embed do Webflow é **10.000**. O ativo não cabe na caixa.

---

## 1. A pergunta que o briefing não fez

O briefing compara quatro templates entre si. Falta o quinto candidato, que já está em disco e passou
por build limpo:

| | os 4 finalistas | `apps/talos` (existente) |
|---|---|---|
| estado | template de terceiro, vazio | 18 componentes, 11 seções, ~10.771 px |
| §3 (`mapear.ts`) | precisa ser portado | **rodando, com teste** (`mapear.test.mts`, 15,6 KB) |
| 3D / movimento | o que o template trouxer | three + @react-three/fiber + drei, gsap + ScrollTrigger, motion, lenis |
| build | — | `tsc --noEmit` 0 erros · `next build` 0 erros |
| sem JS | — | 4.962 chars visíveis, 0 elementos escondidos |
| custo mensal | US$ 10–15/mês (ver §6) | US$ 0 (Vercel/Cloudflare free tier) |
| dono do código | Webflow / Framer | ele |

O founder rejeitou o site em 27/Jul com *"nada funcionou"*. Isso é um veredito sobre o **resultado
visual**, não sobre a stack — e a diferença importa muito, porque **trocar de plataforma não conserta
direção de arte**. Se o problema é que o site parece genérico, adotar um template resolve o visual e,
de brinde, destrói o motor, o teste, o WebGL e o histórico de git. É o remédio certo para a doença
errada.

Registro isso na abertura porque é o erro de arquitetura mais provável desta decisão: **usar uma
troca de plataforma para pagar uma dívida de design.**

---

## 2. `mapear.ts` roda em qual deles, e a que custo?

### 2.1 O que o arquivo é, medido

```
838 linhas · 34,6 KB de fonte
imports externos: ZERO   (grep '^import|require(' → vazio)
compilado ESM, não-minificado:   20.290 caracteres
compilado IIFE, minificado:      12.010 caracteres
gzipado:                          4.909 bytes
```

Dependências de runtime: apenas globais do navegador — `performance.now()`, `String.normalize`,
`RegExp` com `\p{Diacritic}/u` e **lookbehind**. Nenhum pacote npm. Isso é a melhor notícia do
documento: o motor é o ativo mais portátil do projeto inteiro. Ele roda em qualquer lugar que
execute JavaScript.

### 2.2 Webflow — atrito ALTO, e há um número que fecha a porta

Webflow tem limite documentado de **10.000 caracteres por elemento Embed** e **20.000 caracteres de
custom code por site** ([Webflow Help Center, via busca](https://help.webflow.com/hc/en-us/articles/33961332238611-Custom-code-embed)).

**12.010 > 10.000.** O motor minificado não cabe num embed. E isso é antes de escrever **uma linha**
da interface — `Demo.tsx` tem 377 linhas de React com estado, contador animado, painel de trace,
avisos e selos, que teriam de virar JavaScript de manipulação de DOM.

Somam-se dois bloqueios anteriores a esse:

1. **Embed e custom code exigem Site plan pago (Basic ou acima).** No plano Starter grátis o elemento
   Embed aparece no painel mas responde *"Upgrade required"*, e a aba de Custom Code existe com o
   salvar desabilitado. Ou seja: no cenário "template grátis", **a §3 simplesmente não existe**.
2. **Os dois templates são categoria `html` (sem CMS)** — o que é bom para export, e irrelevante aqui.

Saídas possíveis, com o custo real de cada uma:

| caminho | cabe? | o que custa de verdade |
|---|---|---|
| um Embed com o motor inline | **não** (12.010 > 10.000) | — |
| dois Embeds fatiados | tecnicamente talvez | consome ~60% do orçamento de custom code do site e deixa o motor cortado ao meio em dois campos de textarea de um editor visual, fora do git. Inviável de manter. |
| `<script src="https://.../mapear.js">` | sim (≈100 chars) | **você acabou de criar um segundo deploy.** O JS mora em Vercel/Netlify/Pages; agora são duas contas, duas origens, CORS e CSP para configurar, e dois lugares onde o site quebra. E o argumento "no-code" morreu no primeiro dia. |
| exportar o código e sair do Webflow | sim | então o Webflow foi um editor de layout, não uma plataforma — ver §5 |

**Custo estimado do caminho realista (script externo):** 2–3 dias. 1 dia para portar a UI de React
para DOM vanilla contra as classes que o Designer gerou, 1 dia para o pipeline do script externo, e
meio dia de CSP/CORS. E o resultado perde: tipagem, o teste `mapear.test.mts` cobrindo a UI, e a
revisão por diff.

### 2.3 Framer — atrito BAIXO para o motor, MÉDIO para a interface

Framer roda componentes React em ES Modules escritos em TypeScript no editor de código
([Framer Developers FAQ](https://www.framer.com/developers/faq)). `mapear.ts` tem **zero imports**,
então a limitação mais citada do Framer — importar pacotes npm é experimental e a maioria não funciona
sem adaptação — **não se aplica**. O arquivo entra praticamente como está.

A interface é o trabalho:

| item de `Demo.tsx` | no Framer |
|---|---|
| React + hooks | nativo |
| `motion/react` (Motion v12) | Framer traz framer-motion; API muito próxima, ajuste pequeno |
| `lucide-react` (2 ícones: `ArrowRight`, `Cpu`) | trocar por SVG inline — 10 minutos |
| `SectionHead` (componente local) | vira outro code file |
| Tailwind / tokens do projeto | **não existe** — reescrever estilo no vocabulário do Framer |

**Custo estimado:** 1–2 dias. É o menor atrito técnico dos dois. Mas o preço não está no atrito:
o motor passa a morar **dentro do editor do Framer**, e não no git. Some o diff, some a revisão, some
o `mapear.test.mts` rodando em CI, e some o histórico de um arquivo que já sobreviveu a quatro
correções documentadas de método (sub-segmentação, truncamento silencioso, acerto aparente, alternância
de 1ª pessoa em verbos -ir). Esse histórico é o valor do arquivo — mais que o código.

`[NÃO VERIFICADO]` Se o plano **grátis** do Framer permite publicar code components. A documentação
que consultei não é explícita. **Como verificar:** criar projeto grátis, adicionar um code component
trivial, publicar em `*.framer.website` e abrir. 15 minutos, custo zero.

### 2.4 Resposta direta

**Roda melhor no Framer.** E é exatamente por isso que a decisão não pode ser tomada por essa
pergunta: o Framer aceita o motor com facilidade e depois não devolve nem o motor nem o resto (§3).

---

## 3. Lock-in: o custo de sair, em 12 meses

Medi a saída em vez de opinar sobre ela. O teste é o mesmo `reference_forkability_test` que o projeto
já usa: dá para agarrar a estrutura de fora?

| medida (fetch direto, 31/Jul) | fr-stackgrid | fr-agenciy | wf-idesignerlite | wf-conicorn |
|---|---|---|---|---|
| HTML servido | 658 KB | **896 KB** | 26 KB | 195 KB |
| texto no HTML (sem JS) | 9.736 chars | 11.172 chars | 1.743 chars | 10.248 chars |
| **bytes de HTML por char de texto** | **69:1** | **82:1** | 15:1 | 20:1 |
| classes únicas | 463 | 587 | 128 | 354 |
| classes `framer-<hash>` | **453 (98%)** | **578 (98%)** | 0 | 0 |
| `data-framer` | 1.018 | 2.102 | 0 | 0 |
| `data-w-id` (interações IX2) | 0 | 0 | 29 | 39 |
| amostra de nomes | `framer-1uuh4hs`, `hidden-1xn8rl8`, `ssr-variant` | `framer-16i1bdl`, `hidden-4xuzsk` | `navbar`, `nav-link`, `logo-link-wrapper` | `page-wrapper`, `navbar-container`, `preloader` |

### 3.1 Framer — custo de saída: RECONSTRUÇÃO TOTAL

98% das classes são hash sem significado. O HTML pesa 69–82 bytes para cada caractere de texto porque
o Framer renderiza **todas as variantes de breakpoint** e esconde as erradas (`ssr-variant`,
`hidden-1xn8rl8`). Salvar essa página e "hospedar em outro lugar" produz um artefato que **ninguém
consegue editar** — nem quem o gerou.

Existem ferramentas de terceiros (`unframer`, serviços de "export em 45 segundos"). Nenhuma é
contratual; todas quebram com uma atualização do Framer. **Isso não é plano de saída, é gambiarra com
data de validade.** Custo real de sair em 12 meses ≈ custo de construir o site do zero, **sem crédito
nenhum** pelo que foi feito lá dentro, mais os 12 meses de trabalho investidos no canvas.

Nota lateral, mas relevante: 896 KB de HTML **antes de qualquer imagem** é payload real para dono de
PME em 4G. Um site que vende automação e velocidade não deveria abrir com quase 1 MB de marcação
gerada.

### 3.2 Webflow — custo de saída: MÉDIO, e pago adiantado

O export entrega um pacote estático e as classes são **semânticas e humanas** — dá para ler `navbar`,
`page-wrapper`, `nav-link` e saber o que é. Os 29/39 `data-w-id` confirmam que as interações IX2 são
atributos no HTML lidos pelo `webflow.js`, ou seja, exportáveis. Isso é genuinamente melhor que o
Framer.

Duas ressalvas que baixam a nota:

1. **Você paga o resgate antes de conhecer o refém.** Export exige Workspace pago (Core, ~US$16–19/mês)
   ([Webflow pricing 2026](https://emergent.sh/learn/webflow-pricing)). Não dá para exportar e decidir
   depois — só dá para pagar e decidir depois.
2. **O que sai é uma múmia.** HTML gerado, sem componentes, sem build, sem tipos, sem props. Editar
   depois é editar HTML na mão. Serve para congelar; não serve para evoluir. E ao exportar você perde
   o suporte do autor do template — está na própria licença.

### 3.3 Next.js próprio — custo de saída ≈ 0 (no eixo que importa)

Não existe lock-in de plataforma: o mesmo build roda em Vercel, Netlify, Cloudflare, Railway ou VPS,
e a troca leva horas. Existe lock-in de **framework** (Next 16 + React 19) — migrar para Astro/Remix
custaria 2–4 semanas. A diferença categórica: esse lock-in é técnico e previsível, não comercial.
**Ninguém revoga o Next.js por mudança de política de preço.**

E `mapear.ts`, com zero dependências, é portátil para qualquer um dos três cenários — inclusive para
dentro do Framer depois, se ele quiser.

### 3.4 A assimetria que decide

**O motor é portátil. A plataforma não é.** Escolher a plataforma primeiro e encaixar o motor dentro
é subordinar o ativo durável ao ativo alugado. A ordem correta é a inversa.

---

## 4. jQuery 3.5.1 em 2026

**Nem impeditivo, nem irrelevante. É um sinal — mas não sobre o template.**

### 4.1 O que NÃO quebra (seja específico, pediu o briefing)

- **Segurança:** CVE-2020-11022 e CVE-2020-11023 (XSS no `htmlPrefilter`) afetam versões **anteriores
  à 3.5.0**. A 3.5.1 é posterior e as carrega corrigidas. CVE-2019-11358 (prototype pollution no
  `$.extend`) afeta `< 3.4.0`. **Não localizei CVE em aberto contra a 3.5.1.**
- **Superfície de ataque real do Talos:** a §3 processa texto que o próprio visitante digitou e o
  renderiza no navegador dele. Não há input de terceiro, nem persistência, nem sessão. Mesmo que
  houvesse CVE, o vetor não existe aqui.
- **Convivência:** JS próprio convive com jQuery sem conflito. Não quebra nada funcional.

### 4.2 O que custa mesmo

- **Peso:** ~89 KB min / ~30 KB gzip de jQuery + `webfont.js` + 3 chunks do Webflow, carregados em
  todo pageview, num site cujo discurso é eficiência.
- **Falso positivo em auditoria:** scanner de segurança de cliente industrial classifica por **versão**,
  não por CVE. "jQuery desatualizado" vai aparecer no relatório. Para quem vende automação para
  indústria, é uma conversa chata que dá para não ter.

### 4.3 O sinal — e a correção ao briefing

O briefing usa jQuery como possível critério de desempate entre os templates. **Não serve para isso.**
Medido nos dois JSONs: os dois carregam
`jquery-3.5.1.min.dc5e7f18c8.js?site=<id>` — **o mesmo hash de arquivo**, só o `site` muda. Não é
escolha do Rick Mummery nem do N!nh Studio: é a versão que a **plataforma Webflow** serve para todo
mundo. Usar isso para escolher entre idesignerlite e conicorn é ruído.

O sinal verdadeiro é sobre a plataforma. Com **jQuery 4.0.0 lançado em janeiro de 2026**, o runtime do
Webflow segue pinado numa versão de **maio de 2020** — seis anos. Isso é informação sobre a taxa de
evolução da base sobre a qual você construiria, e é exatamente o tipo de coisa que você não controla
quando aluga.

---

## 5. Export do Webflow: o que sai e o que se perde

### 5.1 O que sai (fontes convergentes, não fonte primária)

ZIP com: um `.html` por página · pasta `css/` (`normalize.css`, `webflow.css`,
`<site>.webflow.css`) · pasta `js/` com `webflow.js` · pasta de imagens. Breakpoints, media queries e
o grid/flex do Webflow preservados. **As interações IX2 continuam funcionando** — o que bate com o que
eu medi diretamente (29 e 39 `data-w-id` no HTML servido; o `webflow.js` lê esses atributos).

### 5.2 O que NÃO sai / quebra

CMS · Ecommerce · **formulários nativos** (o endpoint de submissão é do Webflow; depois do export o
form precisa de Formspree, Netlify Forms ou rota própria) · site search · User Accounts · Logic ·
páginas protegidas por senha · redirects 301 do painel · o Editor.

**Para o Talos, especificamente:** os dois templates são categoria `html` — sem CMS, então essa perda
é zero. A perda de formulário seria relevante (a §9 é o contato), **mas** hoje a §9 abre o WhatsApp
com a mensagem montada e não posta em servidor nenhum. Também não dói. **Nenhuma das perdas
documentadas atinge este projeto.** Esse é um ponto a favor do Webflow, e eu registro contra a minha
própria recomendação.

### 5.3 O que eu NÃO sei — e como verificar

`[NÃO VERIFICADO]` **(a)** Se o pacote exportado referencia o jQuery da CDN do Webflow ou traz cópia
local. Importa: no primeiro caso o site "exportado" continua dependendo de um domínio do Webflow em
runtime, e o export não é uma saída de verdade.
`[NÃO VERIFICADO]` **(b)** Se `gsap.min.js`, `SplitText.min.js` e `ScrollTrigger.min.js` — que o
conicorn carrega e que são scripts de terceiros — saem no ZIP ou ficam para trás com o custom code.
`[NÃO VERIFICADO]` **(c)** O limite exato de 20.000 chars: se é do Site Settings (head+body) ou
somatório com os Embeds.

**Como verificar, em ordem de custo:**
1. `help.webflow.com` devolveu **HTTP 403** para fetch automatizado nas duas tentativas desta sessão.
   Abrir **no navegador**: `help.webflow.com/hc/en-us/articles/33961246380947-Code-export` e
   `.../33961332238611-Custom-code-embed`.
2. Definitivo: assinar **1 mês** de Workspace Core (~US$19–29), clonar o conicorn, exportar, abrir o
   ZIP e conferir (a), (b) e (c) com os próprios olhos.

**Regra:** ou paga o mês e mede, ou não afirma. Não há terceira opção honesta aqui.

### 5.4 Achado de licença — não é engenharia, é negócio

Templates grátis do Webflow são **Single-Use License**: uso em **uma** aplicação, sua ou de **um**
cliente. E é proibido *"redistribuir, revender, licenciar, sublicenciar ou oferecer templates grátis
as-is a terceiros"*
([Webflow template licenses](https://webflow.com/templates/template-licenses)).

Para o site **dele**, tudo certo. Para o produto de **R$750 aplicado a N clientes**, não: cada cliente
exige licença própria, e entregar o template as-is é literalmente o caso vedado. Se o plano era
padronizar o negócio em cima de um template grátis, o plano não existe.

---

## 6. O founder vende construção de site. Qual plataforma trabalha a favor?

Isto é análise de negócio ancorada em fatos técnicos verificáveis, não gosto.

### 6.1 `view-source` é público, e a plataforma se denuncia

| plataforma | o que qualquer pessoa vê em 5 segundos |
|---|---|
| Framer grátis | badge **"Made in Framer"** no canto (visível na captura do briefing), domínio `*.framer.website`, e 98% das classes `framer-*` no HTML |
| Framer pago (US$10/mês) | badge e domínio somem; **os 578 `framer-*` continuam lá** |
| Webflow | sem badge, mas `cdn.prod.website-files.com` no `<link>` do CSS entrega igual |
| Next próprio | nada — o HTML é o que ele escreveu |

Vender **construção de site** com badge de builder alheio no rodapé é o marceneiro entregando o
orçamento numa mesa da Tok&Stok com a etiqueta ainda pendurada. Não é vergonha de ferramenta: é que
o produto vendido **é** o serviço de construir, e o próprio site é a amostra.

### 6.2 A conta que fecha o argumento

Ele vende site a **R$750**.

| | mensal | 12 meses | vs. o preço do produto |
|---|---|---|---|
| Framer Basic (tira badge + domínio) | ~US$10 ≈ R$55 | **≈ R$660** | consome 88% do preço do site |
| Webflow Basic Site plan | ~US$14–15 ≈ R$80 | **≈ R$960** | **maior que o preço do site inteiro** |
| Webflow Workspace Core (para exportar) | ~US$16–19 ≈ R$95 | ≈ R$1.140 | idem, e é *além* do Site plan |
| Next em Vercel/Cloudflare free tier | US$ 0 | **R$ 0** | — |

*(Preços de fontes secundárias de 2026 — [Webflow](https://www.appsrow.com/blog/webflow-pricing-2026-complete-guide-to-plans-costs-and-comparisons) ·
[Framer](https://framerwebsites.com/blog/framer-pricing-explained). Confirmar no site oficial antes de
fechar. A ordem de grandeza é o argumento, não o centavo.)*

O site dele é o **protótipo do processo que ele vende**. Se o dele roda em Webflow, o do cliente roda
em Webflow — e ele acabou de embutir custo recorrente em **dólar** dentro de um produto de **R$750 em
real**, com a margem exposta ao câmbio. Isso não é estética; é a unit economics do produto de entrada.

### 6.3 O contra-argumento honesto, e por que ele não sobrevive

*"Ele pode usar plataforma no site dele e Next nos clientes."* Pode — e aí o site dele deixa de ser
demonstração do que ele entrega. O projeto decidiu, por escrito e por falta de case, que **processo é
prova** (§3 existe só por isso). Um site que não é feito do jeito que ele vende é o oposto de prova.

### 6.4 O ativo

`mapear.ts` rodando ao vivo é o único diferencial que **nenhum** dos quatro templates tem, e que
nenhum concorrente de R$750 tem. Colocar esse diferencial dentro de uma caixa que cobra pedágio para
deixá-lo sair (Webflow) ou que não o deixa sair de jeito nenhum (Framer) é subordinar o ativo à
embalagem.

**Veredito da §6:** Framer trabalha **contra**. Webflow trabalha **contra**, com atenuante. Next
próprio trabalha **a favor** — e é o único que o faz de forma verificável por qualquer prospect que
aperte Ctrl+U.

---

## 7. Recomendação única

> ### Manter `apps/talos` (Next 16) como base. Usar **`wf-conicorn`** como **referência visual**, não como plataforma.

Três razões, cada uma medida:

1. **Espinha certa.** O hero do conicorn é literalmente o negócio do Talos — *"Intelligent Automation
   for Modern Teams"*. Resolve a tensão da §4 do briefing sem obrigar ninguém a inventar case. Os
   outros dois candidatos escuros (idesignerlite, agenciy) têm nav **WORKS / PROJECTS** e assumem
   acervo que não existe — e reformar espinha de portfólio é a dívida que o próprio briefing diz ter
   custado 3 rodadas.
2. **É forkável de verdade.** 128 KB de CSS **externo**, 354 classes **semânticas**, **zero hash**.
   Passa o `reference_forkability_test` do projeto com folga. Os dois Framer reprovam por 98% de
   classe com hash — e o teste "CSS inline = forkável" que funcionou no leanware **não transfere**:
   lá o inline era autoral (Astro estático), aqui é gerado por runtime React. Mesma métrica,
   significados opostos.
3. **A técnica transfere direto.** O conicorn usa **gsap + ScrollTrigger + SplitText** — exatamente as
   bibliotecas que `apps/talos` já tem instaladas. Ler o CSS dele vira código no repositório no mesmo
   dia, sem intermediário.

**Ressalvas medidas, para a direção de arte não copiar errado:** o conicorn tem **13.962 px** (2,2× o
Talos atual de ~10.771 px) e hero **claro** com headline em degradê multicolor — contra **D3**
(escuro) e contra o bronze `#E9A23B` aprovado. **Forkar a estrutura e o sistema de movimento. Não a
paleta, não a altura.**

### 7.1 A condição que torna esta recomendação errada

**Se o founder disser que o objetivo é parar de manter código** — entregar sites que ele nunca mais
toca, num editor visual, e que a **§3 pode deixar de ser requisito** (virar vídeo, GIF ou sumir) —
então a recomendação **inverte** e a resposta passa a ser **Framer + `fr-agenciy`**: é escuro (atende
D3), tem a melhor experiência de edição dos quatro, e aceita `mapear.ts` com o menor atrito técnico
caso ele mude de ideia. Nesse cenário o lock-in total deixa de ser defeito e vira preço consciente de
não ter mais engenharia no caminho.

**O gatilho é literal e único: a §3 deixar de ser requisito.** Enquanto `mapear.ts` for a única prova
do negócio, ele manda na escolha de stack — não o contrário.

**Condição secundária:** se a verificação da §5.3 mostrar que o export do Webflow entrega um pacote
genuinamente mantível (jQuery local, scripts de terceiros inclusos), o Webflow sobe de "referência
visual" para **plataforma aceitável nos sites de CLIENTE de R$750** — respeitada a licença single-use
da §5.4, que exige uma licença por cliente. Nunca para o site dele.

---

## 8. Riscos que o briefing não listou

**R1 — `mapear.ts` usa lookbehind, e Safari antigo morre no parse. É o risco mais alto deste
documento e é independente de plataforma.**
O arquivo usa `(?<![a-z0-9])`, `(?<=\S)` e `(?<=[.;!?])`. Safari só ganhou lookbehind na **16.4
(mar/2023)**. Em iOS/Safari anterior, o módulo inteiro estoura `SyntaxError` **no parse** — não é
degradação, é a §3 sumindo da página. A única prova do negócio, ausente, num dispositivo que o
visitante brasileiro de PME usa. **Vale hoje, em `apps/talos`, agora.** Testar em iOS real ou colocar
fallback sem lookbehind.

**R2 — a régua de PT-BR está no eixo errado.** O briefing mede altura de caixa alta (29%). O problema
operacional é **comprimento de string**: os heros dos quatro são frases inglesas curtas ("The all new
AI Era" = 18 chars). O equivalente português tem ~3× isso. Medir caracteres, não altura de glifo.

**R3 — `finalistas-webflow.json` / `finalistas.json` estão errados sobre preço.** O JSON diz
`temFree: false` e `precos: []` para os dois Webflow. As capturas
`shots-finalistas/wf-conicorn-marketplace.png` e `wf-idesignerlite-marketplace.png` mostram, em texto
legível, o selo **"Free template"** e o botão **"Use for free"** nos dois. **O briefing acertou; o JSON
mente.** Corrigir o JSON — senão o próximo agente decide com dado falso e ninguém percebe.

**R4 — licença single-use bloqueia o modelo de negócio.** Ver §5.4. Não é sobre este site; é sobre o
produto de R$750.

**R5 — nenhum dos quatro tem seção que aceite a §3.** Os quatro assumem hero → serviços → cases → CTA.
A §3 é uma aplicação interativa de tela cheia: textarea livre, painel de trace com tempos reais,
contador animado, avisos de leitura falha. Encaixar isso não é "editar seção", é abrir buraco no meio
da estrutura — o precedente exato que o briefing cita como já tendo custado 3 rodadas.

**R6 — o custo de recontratação não está na conta.** Adotar template descarta `apps/talos` (18
componentes), `DIRECAO-ARTE.md` (1.305 linhas, 51 pares de contraste medidos), `ARQUITETURA-SECOES.md`
e 2,1 MB de matéria-prima licenciada. Sunk cost **não decide** — mas é orçamento a recontratar, e
precisa estar explícito na comparação, não implícito.

**R7 — plataforma visual desarma o gate F4 do projeto.** `WORKFLOW-SITES.md` proíbe tocar `.tsx` antes
de mockup aprovado. Migrar para Framer/Webflow não cumpre o gate: troca `.tsx` por canvas, onde não
existe diff, nem revisão, nem histórico. O gate perde o mecanismo que o torna fiscalizável.

**R8 — payload.** 896 KB de HTML (agenciy) e 658 KB (stackgrid) **antes de qualquer imagem**, para 11,2
KB e 9,7 KB de texto. Um site que vende eficiência abrindo com quase 1 MB de marcação gerada é uma
contradição que o prospect não verbaliza mas sente no 4G.

---

## 9. Correções aos artefatos existentes

| arquivo | o que está errado | correção |
|---|---|---|
| `finalistas.json` | `temFree: false` nos dois Webflow | são **grátis** — capturas do marketplace provam |
| `finalistas.json` | `precos: []` lido como "não tem preço" | array vazio = scraper não achou, não é evidência |
| `BRIEFING-FINALISTAS.md` §5, item 4 | usa jQuery para comparar templates | jQuery é da **plataforma** (hash de arquivo idêntico nos dois) — não desempata nada |
| `RETOMAR-AQUI.md` | não registra que os 4 finalistas competem com `apps/talos` | a comparação de 4 é na verdade de 5 |

---

## 10. Nota de método

Consulta a mind clones executada conforme `.claude/rules/mind-clone-auto-consult.md`:
`self-consultation.js batch --experts "martin-fowler,werner-vogels"` (consultationId
`345397cf-8969-488f-9922-a121525a9acb`). **Registro honesto:** o comando devolveu o **pacote de
conhecimento** dos clones (frameworks, princípios, `fullContext`), não uma resposta sintetizada — o que
bate com o que `RETOMAR-AQUI.md` já registrava sobre a ferramenta. Os frameworks aplicados neste
documento (quadrante de dívida técnica, arquitetura evolutiva, custo-de-saída como métrica de projeto)
vêm daí; **as conclusões são minhas, não citação de clone.**

Medições próprias desta sessão: `fetch` direto nos 4 demos (HTML, classes, texto sem JS, atributos),
`esbuild` sobre `mapear.ts` (bundle e minificado), leitura das capturas de marketplace, e busca web
para Webflow/Framer (limites, export, licença, preços). `help.webflow.com` recusou fetch automatizado
(**HTTP 403**, duas tentativas) — o que está marcado `[NÃO VERIFICADO]` está assim porque a fonte
primária não abriu, não porque eu não tentei.
