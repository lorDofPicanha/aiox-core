# Deck Workflow Cliente — Buscador de Licitações

**Versão:** v1 · 2026-05-19
**Formato:** 16:9 · 10 slides · HTML standalone (Inter Tight + Inter + IBM Plex Mono)
**Tema:** AIOX dark observatory · lime accent (sync com `04-deck-diagnostico-amigo/`)

## Para que serve

Deck focado em **apresentar o workflow + explicar cada passo** para o cliente. Diferente do `04-deck-diagnostico-amigo/` (que é problema → workflow → valor → CTA, 13 slides), este aqui é só workflow puro.

## Estrutura

| Slide | Conteúdo | Seção |
|-------|----------|-------|
| 01 | Capa · o sistema em 1 frase | CAPA |
| 02 | **Mapa do workflow completo** (6 estágios + 1 base em 1 tela) | VISÃO |
| 03 | Estágio 1 · Monitorar (como funciona em 5 passos) | RADAR |
| 04 | Estágio 2 · Analisar 6 meses (como funciona em 5 passos) | MOAT |
| 05 | Estágio 3 · Indicar Diferencial (como funciona em 4 passos) | MOAT |
| 06 | Estágio 4 · Habilitar (como funciona em 5 passos) | EXECUÇÃO |
| 07 | Estágio 5 · Acompanhar sessão (como funciona em 5 passos) | EXECUÇÃO |
| 08 | Estágio 6 · Recorrer (como funciona em 5 passos) | EXECUÇÃO |
| 09 | Base · Livro Caixa 3 empresas (como funciona em 5 passos) | FUNDAÇÃO |
| 10 | Recap · workflow inteiro em 1 tabela + CTA Sprint 0 | FECHO |

## Padrão de slide de estágio

Cada slide dos estágios (3–9) segue layout consistente:

- **Header:** HUD AIOX · número · nome do estágio
- **Title:** 1 frase forte com palavra-chave em lime
- **Left col:** "O que faz" (parágrafo) + bullets de capabilities
- **Right col:** "Como funciona — passo a passo" (5 steps numerados) + exemplo ou KPIs
- **Footer:** SLA / tagline do estágio

## Formatos entregues

| Arquivo | Tamanho | Quando usar |
|---------|---------|-------------|
| `deck.html` | ~55KB | Apresentar no notebook/tablet em landscape · tem animações · precisa internet pra fonts custom |
| `deck.pdf` | ~735KB | Mandar via WhatsApp/email · abre em qualquer dispositivo offline · fonts embutidas · sem animações |

## Como usar

```bash
# Abrir no navegador local
start deck.html       # Windows
open deck.html        # Mac
xdg-open deck.html    # Linux

# Re-gerar PDF (Chrome headless) — usar caso edite o HTML
"C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --headless=new --disable-gpu ^
  --no-pdf-header-footer --no-margins ^
  --virtual-time-budget=15000 ^
  --print-to-pdf=deck.pdf ^
  file:///D:/AIOS/docs/projects/buscador-licitacoes/06-deck-workflow-cliente/deck.html
```

## Fix do bug "PDF fica branco onde não tem texto"

Por padrão, Chrome/Firefox não imprimem backgrounds em PDF (economia de tinta). Isso foi resolvido no CSS via:

```css
html, body {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  color-adjust: exact;
}

@media print {
  *, *::before, *::after {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  html, body { background: #050505 !important; }
  .slide { background: #0E0E0E !important; }
  /* + reforço explícito de cada panel */
}
```

Resultado: PDF mantém o tema AIOX dark observatory com lime accent, mesmo no print.

## Decisões de design

- **Densidade média** — cada slide tem ~50-70 palavras visíveis (limit briefing v3: 45 default, 65 para slide com tabela)
- **Sem hero numbers** — este deck não é sobre vender ROI (isso está no `04-deck-diagnostico-amigo/`); foca em didática operacional
- **2 KPIs por estágio** quando faz sentido (slides 06 e 08) — não em todos os 6 estágios para evitar repetição
- **Recap final** substitui CTA bombástico — cliente sai com o caminho inteiro fixado mentalmente
