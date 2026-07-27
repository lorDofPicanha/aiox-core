# Pesquisa de demanda — 27/Jul/2026

Dados brutos e scripts da rodada de pesquisa que originou os planos de locação, aftermarket e canais.

## Método

**Google Autocomplete** (`suggestqueries.google.com/complete/search?client=chrome&hl=pt-BR&gl=br`) com *alphabet soup*: cada semente é expandida com sufixos a–z e modificadores comerciais.

`client=chrome` devolve `google:suggestrelevance` — um score de relevância por sugestão.

**Premissa:** o Google só autocompleta o que tem volume real de busca. Logo, a **amplitude da árvore de sugestões** (nº de sugestões distintas por semente) é um proxy de demanda relativa.

⚠️ **Isso é ranking relativo, não volume absoluto.** Não é "X buscas/mês". O Keyword Planner estava bloqueado (OAuth 401) e o Google Trends devolve 429 no endpoint de dados.

**Total:** ~2.180 consultas · ~5.800 queries únicas coletadas.

## Arquivos

| Script | Saída | O que mediu |
|---|---|---|
| `suggest-sinuca.js` | `suggest-out.json` | Acessórios: taco, bolas, pano, giz, sola, porta-taco (512 calls · 2.385 únicas) |
| `suggest-servicos.js` | `serv-out.json` | Locação, usado/seminovo, serviço, B2B (540 calls · 716 únicas) |
| `suggest-economica.js` | `econ-out.json` | Linha econômica + ângulo presente/Dia dos Pais (420 calls · 1.409 únicas) |
| `suggest-sc.js` | `sc-out.json` | Demanda de locação cidade a cidade em SC (286 calls) |
| `suggest-aftermarket.js` | `after-out.json` | Mesa usada, manutenção por geografia, acessórios (420 calls · 1.023 únicas) |
| — | `corp-out.json` | Locação corporativa: empresa, coworking, condomínio, hotel (~300 calls) |
| `trends-sinuca.js` | `trends-out.json` | ❌ **Falhou.** O `/api/explore` do Trends responde, mas `/api/widgetdata/*` devolve 429. Mantido como registro do que não funciona |

## Achados principais

- **Acessórios:** taco domina (1.031 variantes, ~2× bolas). `"bola de bilhar"` tem **20% de ruído escolar** (modelo atômico de Dalton) — usar `"bolas de sinuca"`, que tem só 3%.
- **Linha econômica:** `"mesa de sinuca pequena"` (351) tem **8× mais** demanda que `"barata"` (45). A dor é **espaço**, não preço. `mesa de sinuca com tampo de jantar` está no topo de relevância.
- **Dia dos Pais:** das 364 queries de presente, **apenas 1** cruza com jogos. Não comprar essas palavras-chave.
- **Locação:** 367 variantes, 15× maior que "acessórios". 30% com marcador local. Existe locação recorrente B2B (`aluguel de fliperama mensal / para bar`).
- **SC por cidade:** demanda confirmada em Florianópolis, Joinville, Chapecó, Jaraguá do Sul, Navegantes, Palhoça, Blumenau. Sem sinal em Balneário Camboriú e Itajaí. ⚠️ `"são josé"` devolve São José dos **Pinhais/PR** — falso positivo.
- **Corporativo:** **zero** queries combinando "aluguel" com empresa/coworking/condomínio/hotel. Não há inbound — é outbound puro.
- **Manutenção:** demanda em RJ(5), Goiânia(3), Londrina(2), Curitiba(2), SP(2), BH(2), Campo Grande, Brasília, Porto Alegre. **Zero em SC.**
- **Canal citado pelos próprios clientes:** OLX 44 · Mercado Livre 19 · Shopee 7 · FB Marketplace 2 · Amazon 2 · Magalu 2.

## Como reproduzir

```bash
node suggest-sinuca.js > suggest-out.json 2> err.log
```

Sem chave de API. Delay de 100–120ms entre chamadas para não tomar rate limit.
