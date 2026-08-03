# Briefing — 4 templates finalistas (site Talos)

**Data:** 31/Jul/2026 · **Decisão a tomar:** qual template vira a base do site.
**Tudo abaixo foi MEDIDO** (Chrome real, `capture-webflow.cjs` / `finalistas-demos.cjs`), não estimado.
Capturas em `shots-finalistas/<id>-live-0..4.png` — 5 alturas de scroll a 1440×900.

---

## 1. Os quatro, lado a lado

| | **wf-idesignerlite** | **wf-conicorn** | **fr-stackgrid** | **fr-agenciy** |
|---|---|---|---|---|
| plataforma | Webflow | Webflow | Framer | Framer |
| preço | grátis | grátis | US$ 0 | US$ 0 |
| autor | Rick Mummery | — | Krutik Maru | NFrame |
| demo | `idesigner-lite-template.webflow.io` | `conicorn.webflow.io` | `stackgrid.framer.website` | `agenciy.framer.website` |
| altura da home | 6.287 px | **13.962 px** | 8.227 px | 12.852 px |
| CSS externo | 90 KB (2 arq) | 128 KB (1 arq) | 0 | 0 |
| CSS inline | 576 chars | 4.187 chars | 334.643 chars | 231.672 chars |
| runtime | webfont.js, **jQuery 3.5.1**, webflow chunks | api.js, **jQuery 3.5.1**, conicorn chunks | runtime Framer | runtime Framer |
| tema | **escuro** | claro/cinza no hero | **CLARO** | **escuro** |
| nicho declarado | portfólio de designer | **automação com IA** | **agentes de IA / pipelines** | agência de marca |
| export de código | **sim** (exige plano pago Webflow) | **sim** (idem) | **NÃO EXISTE** | **NÃO EXISTE** |
| marca d'água no plano grátis | Made in Webflow | Made in Webflow | **Made in Framer** (visível na captura) | **Made in Framer** (visível na captura) |

**Régua de comparação:** `leanware.co` — 7.764 px, escuro `#0e0e10`, acento **verde-menta**,
CSS 100% inline, Astro estático. Capturas em `shots/00-REGUA-leanware-*.png`.

## 2. O que cada hero diz (lido na captura, não na descrição do vendedor)

- **wf-idesignerlite** — fundo preto, robô 3D preto brilhante centralizado, "iDESIGNER" em display
  branco atrás do robô. Nav: HOME · ABOUT · WORKS · CONTACT.
- **wf-conicorn** — fundo cinza-claro, blob 3D escuro, headline em **degradê multicolor**:
  *"Intelligent Automation for Modern Teams"* · sub: *"We build AI-powered automation systems that
  eliminate manual work, reduce costs, and multiply your business performance."*
- **fr-stackgrid** — fundo **branco**, serifada: *"The all new AI Era"* · sub: *"Make custom AI agents
  and secure data pipelines to eliminate your manual workflows."* · arte em ASCII. Nav: About ·
  Pricing · **Case Studies** · Contact.
- **fr-agenciy** — fundo escuro, "Create, *Impactful*" em sans + serifa itálica, blob cromado.
  "We do: Brand Identity / UI-UX Design / Development / Marketing". Nav inclui **Projects** e **Blog**.

## 3. Restrições do projeto que a escolha TEM que respeitar

Fonte: `00-context/CONTEXT.md` e `RETOMAR-AQUI.md`. Nenhuma é negociável por gosto visual.

- **D1 · Audiência:** donos de PME/indústria brasileira, **não-técnicos**. Não é público de dev.
- **D3 · Direção visual travada:** produto tech moderno, **escuro**.
- **D5 · Modelo de negócio:** automação de workflow **é o negócio**; construir o site do cliente é só
  a porta de entrada. O site precisa vender automação, não portfólio de design.
- 🔴 **Restrição declarada pelo founder:** *"não quero falar de mim por agora, porque ainda não tenho
  resultado real"*. Regra derivada, inegociável: **zero case com número, zero logo de cliente que não
  é cliente, zero depoimento fabricado.** Saída adotada: **processo é prova** — mostrar a máquina
  rodando ao vivo no lugar de case.
- **§3 é o coração do site:** `apps/talos/lib/mapear.ts` roda no navegador em ~2 ms, sem rede e sem
  chave. O visitante descreve o processo dele e recebe o mapa + horas devolvidas. É o único ativo que
  prova o negócio.
- **Preço não aparece no site.** A CTA leva a conversa, nunca a tabela.
- **PT-BR:** caixa alta portuguesa é **29% mais alta** que a inglesa (`Ã` 0,954em, `Ç` −0,216em).
  Template com display apertado em inglês quebra ao receber texto português.

## 4. A tensão que a avaliação precisa resolver

Dois dos quatro (**idesignerlite**, **agenciy**) têm **espinha de portfólio**: a navegação principal
é WORKS / PROJECTS, e a estrutura assume um acervo de trabalhos para exibir. **O founder não tem
nenhum.** Preencher com trabalho inventado viola a regra inegociável; deixar vazio expõe o vazio no
lugar mais nobre da página.

Dois dos quatro (**conicorn**, **stackgrid**) têm **espinha de agência de automação** — o discurso
do hero é quase literalmente o negócio do Talos. Mas **stackgrid é claro**, o que contraria D3, e
tem **Pricing** e **Case Studies** na nav — duas seções que o projeto proibiu.

## 5. O que se pede à avaliação

1. **Ranking dos 4**, com o critério explícito que decidiu cada posição.
2. **O custo de adaptação** de cada um: o que teria que ser removido/reconstruído para respeitar §3.
3. **Veredito sobre a espinha**: template com estrutura errada se conserta editando seção, ou é
   dívida que reaparece? (Precedente: 3 rodadas do Talos foram perdidas refinando sobre base errada.)
4. **Framer × Webflow**: o export de código do Webflow compensa o runtime jQuery 3.5.1?
   Lembrar que o §3 (`mapear.ts`) precisa rodar dentro do site escolhido.
5. **Riscos que eu não listei.**

Responda com posição, não com panorama. Discordar do briefing é bem-vindo — mas cite o número.
