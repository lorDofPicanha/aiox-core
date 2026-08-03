# RETOMAR AQUI — projeto TALOS

**Última sessão:** 2026-08-02 · **Leia isto primeiro, depois `00-context/CONTEXT.md`.**

---

## 🔴 O site é `05-build/talos-site/`. Não é o `mockup-v2/`.

O `mockup-v2/` foi uma **releitura à mão** do template — o `NOTAS.md` dele se gaba de
*"não levei um pixel da pele dele"*. Era exatamente o que o founder **não** queria, e ele
reprovou. O que vale é o **fork de verdade**: `05-build/talos-site/`, com o CSS original de
128 KB, GSAP, ScrollTrigger e o IX2 do Webflow vivos.

```bash
# reconstruir do zero (idempotente)
cd docs/projects/aiox-site/05-build
node fork-talos.cjs && node revive-talos.cjs

# servir para revisão — SEM CACHE (obrigatório, ver §Armadilhas)
python servir.py            # → http://127.0.0.1:3021/talos-site/index.html
```

| arquivo | o que faz |
|---|---|
| `fork-talos.cjs` | copia o Conicorn capturado, traduz por pares e remove seções fabricadas |
| `talos-copy.json` | o mapa `[de, para]` da tradução — **edite o lado direito e rode o fork de novo** |
| `revive-talos.cjs` | tudo que o fork não resolve: animação, vídeos, FAQ, seção de resultado, remoções |
| `traduzir-imagens.py` | repinta o inglês cravado em pixel nas ilustrações e refaz o logo do rodapé |
| `servir.py` | servidor local com `no-store` |

---

## 🔵 02/Ago — POSICIONAMENTO NOVO, dado pelo founder

> *"Criar soluções para empresários, como uma **software house**, só que com IA aplicada em
> **todos os processos**. Construção é apenas uma coisa em meio a várias. **Não venda um
> produto, venda o que a IA pode fazer no negócio e o resultado disso.**"*

E: *"não quero vender um atendente"* · base **mundial, não brasileira** · a linha
*"Sem case ainda"* **saiu** do hero.

🔴 **Isso matou o eixo antigo:** hero de atendente de WhatsApp, público "PME não-técnica",
porta de entrada "site a R$750". Nada disso vale mais.

⚠️ **Não confundir com `docs/projects/iox-services/_outreach/DECISAO-PRODUTO-v1.md`** (RDO
Conversacional para construtora com 4+ obras, R$18k de setup, fechada no mesmo dia): aquilo
é **vertical/produto**, não é o posicionamento do TALOS. Perguntei e o founder corrigiu.

---

## A pesquisa — `01-research/`

Dois dossiês, tudo verificado **na fonte primária**, com o esquema A/B/C dos relatórios do
próprio founder (A = independente · B = divulgado pela empresa · C = case do fornecedor).

- `EVIDENCIA-RESULTADO.md` — a camada transversal
- `EVIDENCIA-SETORES.md` — indústria, comércio e serviços + categoria nova **"número órfão"**
  (percentual de blog atribuído a consultoria sem link — foi a MAIORIA do que a busca
  genérica devolveu; descartado)

🔴 **Três números que "todo mundo sabe" e estão errados:**
| circula como | correto |
|---|---|
| Brynjolfsson +14% | **+15%** (14% é o working paper do NBER, não o QJE publicado) |
| BCG "40% do grupo produziu melhor" | **+40% de qualidade** (a Forbes reportou errado) |
| Sebrae "44% das MPEs usam IA" | **não existe na fonte** — é da CNN. Descartado |

🔑 **A tese, com duas fontes de primeira linha convergindo sozinhas:** o **Census Bureau dos
EUA** (BTOS, nov/25–jan/26) acha correlação positiva robusta entre desempenho comercial e a
**amplitude** da aplicação de IA — e 57% das empresas param em três funções. A **McKinsey**
acha que **redesenhar o fluxo é o maior efeito no EBIT entre 25 atributos testados**. Ou seja,
"IA em todos os processos" é a variável associada a desempenho, não slogan.

🔑 **O melhor número para "previsível"** é a competição **M5** (*International Journal of
Forecasting*, 2022): 42.840 séries de venda da Walmart, 5.507 equipes; o vencedor bateu o
melhor método estatístico em **22,4%**, e *todos* os 50 melhores bateram em **mais de 14%** —
esse segundo número vale mais, mostra que não foi sorte de um.

🟡 **Pendências da pesquisa:** indústria continua o elo fraco (quase tudo é número órfão) ·
tempo de resposta a lead (MIT/InsideSales 21×, HBR 42h) **não verificado**, paywall — não usar.

---

## Estado do build

| item | estado |
|---|---|
| Abertura | preloader com símbolo + **Talos** → fade → hero com vídeo em loop |
| §005 Resultado | 3 temas de negócio, formato **ação → resultado**, com `01/02/03` nos cards |
| Rodapé | símbolo original + **Talos**, mesma tipografia e rampa de opacidade |
| FAQ | 5 respostas distintas (o template repetia a mesma nas cinco) |
| Formulário | botão em PT e destravado (vinha `disabled` da captura) |
| Removidos | integrações · redes sociais · fotos de banco de imagem · case falso · depoimentos · preço · time fictício |

🔴 **`apps/talos/` (o Next.js) está INTOCADO.** Tudo vive como HTML estático. O port para
`.tsx` só depois do aval — e leva junto dois bugs em espera lá: `lib/mapear.ts` usa
lookbehind (quebra no Safari < 16.4) e `lib/perfil.ts` está com os campos `PREENCHER`.

---

## 🔴 O único bloqueio real: dado do founder

Nome · foto · WhatsApp · LinkedIn, para a seção "quem faz". Sem isso não publica.
⚠️ Os dois relatórios de construção estão assinados *"Preparado para Breno Pinheiro"* —
**não preencher a partir disso.** Nome em site é dado do dono, não dedução.

---

## ⚠️ Armadilhas que já custaram rodadas inteiras

Detalhe completo em `[[reference_fork_webflow_animacao_morta]]` na memória. As três piores:

1. **Servidor com cache faz revisar o passado.** O founder reprovou três coisas já
   corrigidas em disco porque o navegador servia a versão velha — os arquivos mantêm o mesmo
   nome a cada build. **Use `servir.py`**, que manda `no-store` e descarta `ETag`.
2. **Não animar o que o template já anima.** Criar um `SplitText` no mesmo `<h1>` que o
   template divide faz as duas brigarem e **a headline some da tela**. O preloader do
   template só precisava ser aceso (`opacity: 0` no CSS esperando um GSAP que a captura não
   trouxe) — a saída, essa sim, tem que ser dirigida por nós.
3. **Chrome headless mente:** reporta `prefers-reduced-motion: reduce` e bloqueia autoplay.
   Deu diagnóstico errado de "site parado" três vezes. Sempre emular
   `prefers-reduced-motion: no-preference` + `--autoplay-policy=no-user-gesture-required`.
   E medir animação por **diferença de pixel entre quadros**, não por `getComputedStyle`.

---

## O que NÃO está no git

`02-references/` (289 MB de capturas de sites de terceiros) e as pastas de screenshot
(`shots*/`, `templates-candidatos/shots*/`) ficam fora por peso — ver `.gitignore`.
Consequência: **quem clonar o repo não consegue rodar `fork-talos.cjs`**, porque falta
`02-references/inputs/conicorn/`. Por isso o `talos-site/` construído **vai versionado**.
