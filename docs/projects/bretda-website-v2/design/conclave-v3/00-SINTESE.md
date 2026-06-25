# Conclave v3 — Prontidão p/ Compra Internacional + Seleção de Idioma

**4 vozes independentes** (DNA real via self-consultation.js, cada uma leu as 4 telas Stitch v1 ao vivo). Lente NOVA vs v1 (que foi luxo/ancoragem): **comprador estrangeiro EUA/Europa fechando mesa US$8–24k de um atelier brasileiro + como deve funcionar a troca de idioma/moeda.** Orquestração: Orion. Data 2026-06-25.
Base usada (não refeita): dossiê `research/00-DOSSIE-CONSOLIDADO.md` (catálogo fundido Bretda+Tocks, 28 SKUs) + export memo + conclave v1.

## Notas (prontidão p/ compra internacional)
| Voz | Lente | Nota |
|-----|-------|-----:|
| Peep Laja | CRO cross-border | 3,5 |
| Don Norman | usabilidade/i18n | 4,0 |
| Daniel Kahneman | arquitetura de escolha | 5,5 |
| Tobias van Schneider | atelier internacional | 6,5 |

**Leitura:** ~4,9. A tela vende o **OBJETO** lindamente e a **TRANSAÇÃO INTERNACIONAL** quase nada. "O design vende a mesa brilhantemente e a compra cross-border de jeito nenhum" (Laja). Você está certo: pra compra internacional, está errado na raiz.

## CONSENSO (os 4, independente → alta confiança → implementar)
1. 🔴 **Bug de moeda no PDP é O assassino.** "From R$24,500" num site export em inglês. Pior: olho americano lê "R$24,500" como "$24,500" → ou alarmante-barato (suspeito p/ luxo) ou erro. Header diz USD, corpo diz R$ = contradição na tela mais decisiva. → moeda geo-correta **$/€ em tudo**, header = corpo. **Maior alavanca isolada.**
2. 🔴 **Falta a camada de logística/confiança cross-border no ponto de decisão.** As 4 perguntas reais do estrangeiro ("chega inteira? em quanto tempo? quem paga o imposto? e se quebrar?") não têm resposta em lugar nenhum. → faixa de confiança no PDP+home: *frete white-glove segurado mundial · ~8–10 sem feito sob encomenda · taxas/DDP tratadas · garantia de chegada*. (Laja: é a alavanca #1, maior que estética.)
3. 🔴 **CTA com relação errada.** "Inquire / Request a Quote" sinaliza negociar-por-email/preço-escondido/fornecedor-estrangeiro. Como o preço é exposto por mandato, liderar com **"Reserve / Begin your commission"** e deixar concierge humano como rede secundária.
4. **Camada de legitimidade ("isso é real?") ausente** — nome da empresa, anos de atelier, instalações reais/depoimentos, imprensa, humano de contato. Confiança trava a inquiry antes de começar.
5. **Origem-como-luxo não enquadrada** — "Brazil" é legenda, não mundo. Vira o flanco: objeção-de-origem → flex-de-origem. "Atelier · Brazil · shipped worldwide". (Tobias+Laja)

## IDIOMA + MOEDA — spec unânime (responde o pedido do founder)
- **Default: geo-detect (IP + Accept-Language) seta idioma + moeda no primeiro paint. SEM modal/splash.** US→EN/$, EU→EN/€, desconhecido→EN/$. **Nunca** mostrar R$/PT a estrangeiro.
- **Override manual SEMPRE visível** (honra "deixe escolher") — persistente, top-right, 1 clique, instantâneo (sem reload, sem perder o lugar no PDP), persistido (cookie) → escolha explícita de retorno vence o geo.
- **DESACOPLAR moeda de idioma** — 2 controles independentes (alemão pode querer conteúdo EN + preço €; americano expat em Paris quer EN + $). Não amarrar num toggle só.
- **TEXTO, nunca bandeiras** (bandeira = país, não idioma/moeda → ambíguo). Tratamento "maker's mark": `EN · $ ▾` hairline champanhe gravado, abre painel de 2 linhas (Language / Currency), endônimo na própria língua (English · Deutsch · Français).
- **Idiomas que movem receita (EUA+Europa):** **EN** = base (70–80% do endereçável: US/UK/NL/Escandinávia + lingua franca do luxo). **DE** = o #2 valioso (DACH = bolso mais fundo de móvel de luxo na Europa; alemão converte melhor em alemão em compra considerada). FR/IT só quando analytics justificar. ES pular. **PT NÃO é idioma do site** (sinaliza marca doméstica brasileira) — usar português só como sabor de proveniência.
- **Troca couture (Tobias):** cross-dissolve 280–360ms, dígitos da moeda rolam ($8,200→€7,600), sublinhado champanhe desenha. **Alemão = teste de estresse tipográfico** (palavras +30%: nav flexível, escala de tipo por-locale, cobertura de acento no Bodoni).

## Rodada adversarial — colapsada (justificada)
Os 4 pareceres são **independentes e convergiram** nos 5 pontos de consenso + na spec de idioma — não houve dissenso material a refutar. A única tensão real (logística "barateia" o luxo?) já foi pré-resolvida pelos próprios: Norman — *"para um estranho transferindo $15k pelo oceano, a logística É o luxo; certeza é o produto"*; Tobias — fazer a faixa **hairline/gravada**, não banner de e-commerce. Mantida UMA decisão aberta p/ o founder (escopo de idioma no launch).

## DECISÃO ABERTA (founder) — escopo de idioma no launch
Founder quer "escolher o idioma e trocar" → implica multi-idioma vivo. Mas Norman+Laja: *página de luxo meia-traduzida é PIOR que inglês confiante ("grita operação pequena")*. Opções:
- **A (recomendada):** construir o **switcher agora**, launch **EN + DE** (1 segundo idioma 100% traduzido por humano), arquitetado p/ FR/IT depois. Honra "deixe escolher" com escolha REAL, sem tradução fake.
- **B:** switcher na UI agora, **EN-only** no launch (idiomas entram conforme tradução fica pronta).
- **C:** multi-idioma completo (EN/ES/DE/FR) já — aceita custo/risco de tradução.

## Próximo passo
Com a decisão A/B/C → **regenerar as 4 telas Stitch** com: moeda $/€ corrigida, seletor `EN · $`, faixa de confiança cross-border, CTA "Reserve", linha de origem. (Stitch project `15559409943526920722`.)
