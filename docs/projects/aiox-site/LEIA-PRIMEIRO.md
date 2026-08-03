# Talos — site. Tudo que existe do projeto.

Pasta sincronizada do repositório local `D:/AIOS/docs/projects/aiox-site`.
Estado em 27/07/2026.

---

## Onde estão as coisas

### Decisões
| arquivo | o quê |
|---|---|
| `RETOMAR-AQUI.md` | **comece por aqui** — estado, o que foi feito, o que travou |
| `WORKFLOW-SITES.md` | o fluxo de produção com gates, e por que o processo anterior falhou |
| `00-context/CONTEXT.md` | decisões travadas, restrições, tensões abertas |
| `00-context/ROTA.md` | Rota A (WebGL autoral) vs Rota B (produção pesada) |
| `00-context/PRICING.md` | preço: mercado vs decisão do founder |

### Referências
| arquivo | o quê |
|---|---|
| `02-references/PREMIADOS-2026.md` | **os 100 sites mais premiados de 2026** — método, estatística, topo |
| `02-references/premiados-2026-tabela.md` | os 100 em tabela: site, prêmio, data, stack |
| `02-references/PROCESSO-NIVEL-PREMIADO.md` | **análise de código de 14 deles** — o que carregam, quem produz, qual processo |
| `02-references/REFERENCIAS-R2.md` | as 10 referências escolhidas na rodada 2 (7 aprovadas pelo founder) |
| `02-references/galeria.html` | folha de contato dos 100, com filtro por tecnologia |
| `02-references/shots-premiados/` | screenshot real de 95 dos 100 |
| `02-references/*.json` | dados brutos: raspagem, sondagem de forkabilidade, anatomia, créditos |

### Sistema visual
| arquivo | o quê |
|---|---|
| `04-tokens/DESIGN.md` | paleta Industrial Raw com contraste **calculado**, tipografia, o achado que mudou a direção |
| `04-tokens/tokens.json` | tokens em JSON, escala 50–950, CSS pronto |
| `04-tokens/TOKENS.md` | tokens da rodada 1 (extraídos do CSS das referências) |

### Estrutura e conteúdo
| arquivo | o quê |
|---|---|
| `03-wireframe/WIREFRAME.md` | nome, promessa, as 9 seções, wireframe seção a seção |
| `01-research/` | pesquisa UX de fontes primárias |
| `03-assets/` | fotos tratadas (webp, 2 tamanhos) + créditos |

### Mockups
| arquivo | estado |
|---|---|
| `05-build/mockup/hero-a.html` · `.png` | produto tech com foto de apoio |
| `05-build/mockup/hero-b.html` · `.png` | peça industrial, foto em tela cheia |
| `05-build/mockup/hero-c.html` | **grafo de processo animado — canvas 2D, funciona** |
| `05-build/mockup/hero-c-*.png` | as três fases: caos → organizando → fluindo |
| `05-build/mockup/hero-d.html` | WebGL com shader GLSL, 60k partículas — **com bug de posicionamento não resolvido** |

---

## O estado real, sem maquiar

**Aprovado pelo founder:** as 7 referências (oryzo, n8n, iventions, uncommon, minhpham, matvoyce, mesh) ·
a virada de bronze-luxo para laranja industrial.

**Rejeitado:** o site inteiro construído em `apps/talos` (11 seções, Next.js) · os mockups de hero
produzidos até agora.

**O que os dados dizem que falta** (`PROCESSO-NIVEL-PREMIADO.md`): a mediana dos premiados tem
**6 MB de matéria-prima** e **7 papéis creditados** por site. O que foi construído tinha 0,4 MB e
uma pessoa. A diferença medida não é biblioteca — é produção.

**Ferramentas quebradas neste ambiente:** `mcp-image-studio` retorna 401 (token Replicate inválido)
e o `status` da própria ferramenta **mente**, reportando `ready`. Stitch, nano-banana-2 e
@21st-dev/magic **não estão instalados**, apesar de a regra do projeto mandar usá-los.

**Funcionando:** `ui-ux-pro-max` (CLI Python) · `mcp-design-studio` (24 tools, Figma e Unsplash
configurados) · `refero` · `design-md` · fork-pipeline.
