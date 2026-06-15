---
title: Vencedores reais de obras públicas no raio 500km — dado primário PNCP
docId: vencedores-reais-pncp-500km
tags: [construtoras, vencedores, pncp, dnit, goias, df, concorrencia, hhi, faixa-preco, raio-500km, modelo, dado-primario]
audience: agents
sourceRefs: [PNCP /contratos, scripts/noyce/build-competitor-snapshot.js --radius500, apps/noyce/lib/data/competitor-500km-research.json]
---

> Dado PRIMÁRIO extraído do PNCP `/contratos` (read-only) em 15/Jun/2026, janela 12 meses,
> via `build-competitor-snapshot.js --radius500`. Fecha a lacuna que a pesquisa web marcou
> como confiança MÉDIA (vencedores GDF/GO sem fonte consolidada). Complementa
> [modelo-construtoras-grandes]. Use para conhecer quem realmente ganha obras no raio da ENIAC.

## Cobertura e honestidade do dado

A extração cobriu **3 de 11 órgãos** com dado real. Os outros 8 (municípios de Águas Lindas,
Novo Gama, Pirenópolis, Anápolis, CEASA/GO, Estado de Goiás, Saneamento Águas Lindas, Consórcio
Brasil Central) retornaram **HTTP 500 em todas as janelas** — é a instabilidade conhecida do
endpoint `/contratos?cnpjOrgao` do PNCP, NÃO ausência de contratos. Esses órgãos devem ser
re-extraídos quando o PNCP estabilizar (rodar de novo o `--radius500`).

- **Com dado:** DNIT (federal, rico), Secretaria de Estado de Obras/Infraestrutura (DF), Secretaria Municipal de Administração (Goiânia).
- **Gap (re-pull pendente):** todos os municipais do cluster GO + Estado de Goiás.

> Fonte: log da extração + `competitor-500km-research.json` (queryStats por órgão).

## DNIT — as maiores construtoras de infraestrutura do raio

O DNIT é a fonte mais rica: **339 contratos de obras / 918 totais, 218 vencedores distintos,
HHI 518 (mercado pulverizado)**. São as grandes construtoras de **rodovia/infraestrutura
pesada** que operam em GO/DF. Top 10 por valor ganho (12 meses):

| # | Construtora | CNPJ | Ganho (R$) | Share | Contratos | Ticket médio | Última vitória |
|---|---|---|---|---|---|---|---|
| 1 | CONSTRUTORA LUIZ COSTA LTDA | 00.779.059/0001-20 | R$2,05 bi | 15,9% | 8 | R$256,3 mi | 30/12/2025 |
| 2 | V. F. GOMES CONSTRUTORA LTDA | 13.495.966/0001-99 | R$1,46 bi | 11,4% | 15 | R$97,6 mi | 17/04/2026 |
| 3 | LCM CONSTRUÇÃO E COMÉRCIO S.A | 19.758.842/0001-35 | R$674,3 mi | 5,2% | 12 | R$56,2 mi | 30/04/2026 |
| 4 | TOP ENGENHARIA LTDA | 14.448.260/0001-39 | R$455,5 mi | 3,5% | 3 | R$151,9 mi | 10/03/2026 |
| 5 | F. P. CONSTRUTORA LTDA | 41.160.680/0001-98 | R$447,5 mi | 3,5% | 3 | R$149,2 mi | 06/02/2026 |
| 6 | M. S. M. INDUSTRIAL LTDA | 05.394.853/0001-79 | R$367,2 mi | 2,9% | 2 | R$183,6 mi | 01/09/2025 |
| 7 | CONSTRUTORA SOMA LTDA | 01.088.713/0001-11 | R$366,3 mi | 2,8% | 2 | R$183,1 mi | 10/04/2026 |
| 8 | E M T CONSTRUTORA LTDA | 05.036.194/0001-07 | R$365,5 mi | 2,8% | 2 | R$182,8 mi | 08/05/2026 |
| 9 | SISCON ENGENHARIA E CONSULTORIA LTDA | 42.565.325/0001-61 | R$336,7 mi | 2,6% | 1 | R$336,7 mi | 16/07/2025 |
| 10 | PROGEN PROJETOS GER. E ENGENHARIA S.A. | 57.748.204/0001-22 | R$316,6 mi | 2,5% | 1 | R$316,6 mi | 18/08/2025 |

> Fonte: PNCP /contratos cnpjOrgao=04892707000100 (DNIT), 12 meses até 15/Jun/2026.

### Faixa de preço dos contratos DNIT (referência de ticket)

Sobre 339 contratos de obras: **P25 = R$ 958 mil · mediana = R$ 6,81 mi · P75 = R$ 45,2 mi**.
Leitura: metade dos contratos DNIT fica acima de ~R$ 6,8 mi — ticket alto, fora do porte solo
da ENIAC (teto solo ~R$ 9,19 mi, ver [eniac-perfil]). O DNIT é mercado de obra grande.

> Fonte: priceBand DNIT (grounded, sampleSize=339).

## Secretaria de Estado de Obras e Infraestrutura (DF)

Poucos contratos de obras no recorte, **mercado concentrado (HHI 7968)**:

| # | Empresa | CNPJ | Ganho | Share |
|---|---|---|---|---|
| 1 | STARK CONSTRUÇÕES E SERVIÇOS LTDA | 26.483.321/0001-88 | R$34,7 mi | 88,5% |
| 2 | GVA CONNECTION FACILITIES LTDA | 26.473.058/0001-46 | R$4,5 mi | 11,5% |
| 3 | JC SOLUÇÕES FACILITADORA DE NEGÓCIOS | 57.390.381/0001-80 | ~R$0 | 0% |

> Concentração alta = incumbente dominante (STARK). Para a triagem: órgão com 1 vencedor
> levando ~90% é candidato a "Pula" salvo diferencial técnico claro.
> Fonte: PNCP /contratos cnpjOrgao=00394742000149.

## Leitura estratégica para a ENIAC

1. **As maiores ≠ o nicho da ENIAC.** Os líderes por R$ (Luiz Costa, V.F. Gomes, LCM) são de
   **rodovia/infra pesada** (DNIT), ticket mediano R$ 6,8 mi. A ENIAC faz **edificações,
   reformas, praças** (ver acervo/CATs) — não tente competir nesse nicho de rodovia.
2. **O mercado de obra do raio é pulverizado** (DNIT HHI 518): 218 vencedores, ninguém passa de
   16%. Pulverizado = espaço para entrar — o oposto de órgão concentrado (DF Obras HHI 7968).
3. **Consórcio é o caminho para subir de faixa.** Para acessar contratos acima do teto solo
   (R$ 9,19 mi), a ENIAC precisa somar acervo/capital via consórcio (art. 15) — confirmado pela
   pesquisa web como alavanca nº 1. Ver [consorcio].
4. **Use estes CNPJs na análise de concorrência.** Quando um desses nomes aparecer como
   participante/vencedor recorrente num edital, a aba Analisar deve sinalizar incumbência e
   calibrar a chance real.
5. **Re-extrair os municipais.** O dado mais relevante para a ENIAC (prefeituras do cluster GO,
   onde ela realmente disputa) ficou em gap por instabilidade do PNCP — re-rodar `--radius500`
   quando estável para mapear os vencedores locais (porte compatível com a ENIAC).

> Fonte: síntese sobre o dado PNCP 15/Jun + [modelo-construtoras-grandes].
