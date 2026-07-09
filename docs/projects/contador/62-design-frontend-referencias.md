# 62 — Design do Front-end: Referências + Kit de Assets (v1.1 proposta)

> **Autor:** Orion (Claude) · **Data:** 2026-07-09 · **Para:** aval do founder → aplicação no front-end
> **Base:** `DESIGN.md` v1 (canônico, já aplicado no `globals.css` do app) + `50-design-research/01–04`.
> **Novidade desta rodada:** referências REAIS puxadas via Refero (design systems extraídos de produto vivo), inteligência de domínio (ui-ux-pro-max), kit de assets concreto (ícones/fontes) e o método do harness Claude Design (Alan Nicolas, KB 22/Jun).
> **Regra:** isto NÃO substitui o DESIGN.md — é a evolução v1.1 proposta por cima dele. Visual = decisão do founder.

---

## 1. Método (harness Claude Design — o que adotamos do processo)

Do harness do Alan (KB `design-lead/2026-06-22`), 4 práticas entram no nosso fluxo:

1. **Telas-chave de referência, não todas.** Desenhar a fundo só 3 telas-âncora (Painel · Laudo · Trilha) e derivar o resto modularmente — fazer 14 rotas "no capricho individual" é caro e gera deriva.
2. **Guardião do design system.** Antes de mexer em qualquer tela: carregar tokens do `globals.css`; nenhum hex/px fora de token. (Equivale à skill "design system guardian".)
3. **Anti-AI-slop.** Proibido: gradiente roxo, glassmorphism, sombra dramática, em-dash decorativo, ícone fofinho arredondado. O registro é "documento de fé pública", não "SaaS de hype".
4. **Auditoria via código, não screenshot.** Checks de contraste/quebra por script (contrast_check/tsx), não por print (print = caro e impreciso).

## 2. Referências novas (Refero — design systems extraídos)

### 2.1 ⭐ Duna (duna.com) — "compliance document" — A REFERÊNCIA-MÃE do laudo
Fintech de compliance/KYB. North star: *"editorial compliance document"* — exatamente o nosso registro.

**O que levamos:**
- **Elevação = borda hairline, não sombra.** O único "shadow" do sistema é `inset 0 0 0 1px rgba(0,0,0,.05)`. Cards separados por espaço + tinta de fundo. → **Adotar como filosofia de elevação v1.1** (o DESIGN.md diz "elevação contida"; isto crava a régua).
- **`font-feature-settings: "tnum","zero"`** nos números grandes — eles usam LITERALMENTE a nossa regra §5 do DESIGN.md. Validação externa da decisão.
- **Stat oversized com tracking apertado** (número 72px, weight 400, tracking −0.06em + caption 14px) → padrão pro KPI do Painel e a materialidade do Laudo.
- **99% acromático; 1 momento de cor.** No nosso caso o "momento" é semântica de status — nunca decoração.
- **Don't deles que adotamos:** "não usar biblioteca de ícones arredondada/amigável — linha fina geométrica" (ver §4.1).

**O que NÃO levamos:** canvas creme/warm (nosso neutro é frio-esverdeado de propósito — significa "verificado"), pill-everything (nosso raio é moderado), display 72px em telas densas.

### 2.2 Mercury (mercury.com) — disciplina do acento único
North star: *"alpine banking at blue hour"*. Dark (não é nosso caso — light-first), mas as REGRAS transferem:

- **1 cor cromática por página, só na ação primária.** "Never as decorative accent" → reforça a nossa regra de ouro §2.
- **Elevação por degrau de valor** (card 1 passo mais claro que canvas), zero sombra → composição com a hairline da Duna.
- **Peso intermediário como assinatura** (heading weight 480 — "asserts without shouting") → no Inter: títulos em 600 ficam, mas KPI/display descem de 700 → **650**, e o corpo NUNCA passa de 500. Autoridade calma ≠ negrito.
- **Don't deles que adotamos:** não empilhar 2 elementos de acento sem 32px de respiro.

### 2.3 Menções honrosas (das buscas, para repertório)
- **Privy** — *"restraint as authority"*: contenção como autoridade (confirma §8 do DESIGN.md).
- **Ditto/Duna/Vanta/Drata** — categoria compliance converge para: claro, editorial, acento único, prova visível.
- **Zed** — *"technical manual"*: página como capítulo de manual técnico bem impresso (bom pro Laudo exportado).

### 2.4 Inteligência de domínio (ui-ux-pro-max)
Dashboard financeiro/analytics: estilos recomendados = **Data-Dense + Minimalism + Accessible & Ethical** (bate com v1); alerta vermelho/verde SEMPRE acompanhado de ícone+label (já é regra §3). Glassmorphism/OLED descartados (registro errado pro contador conservador).

## 3. Evolução v1.1 (proposta ao founder — diffs sobre o DESIGN.md)

| # | Mudança | De → Para | Fonte |
|---|---------|----------|-------|
| E1 | **Elevação hairline** | `shadow.sm` em cards → `inset 0 0 0 1px` (token `--ring-hairline`) + degrau de superfície; sombra real SÓ em dropdown/modal/toast | Duna + Mercury |
| E2 | **Pesos** | KPI/H1 700 → **650**; corpo max 500 | Mercury |
| E3 | **Stat editorial** | KPI do Painel/Laudo: número grande (28–34px) tracking −0.02em, weight 650, `tnum zero`, caption 12px text-dim | Duna |
| E4 | **Ícones Lucide** | inline-SVG ad-hoc → `lucide-react` com mapa semântico fixo (§4.1) | Duna don't + auditoria |
| E5 | **Fonts via next/font** | `@import` Google Fonts no globals.css → `next/font` (Inter + IBM Plex Mono self-host, zero FOUT, sem request externo) | perf/privacidade |
| E6 | **Faixa de risco** | linha em risco: `inset 3px 0 0 var(--danger)` (já em v1) — estender a TODA linha/nó com estado crítico (consistência trilha/fila/tabela) | v1 §6.5 generalizado |

Sem mudança: paleta verde-petróleo, tipografia Inter/Plex Mono, light-first, mapa de status, cerimônia graduada, disclaimers-credencial. **A v1 está certa — a v1.1 afia.**

## 4. Kit de assets (decisões concretas)

### 4.1 Ícones — `lucide-react` (ISC, tree-shakeable, 1.600+)
Stroke 2px geométrico, sem "fofura"; par natural do registro. **Regras:** tamanho 16px em tabela/inline, 18–20px em nav/cards; stroke-width 1.75 em ≥20px; NUNCA ícone preenchido exceto selo de status. **Mapa semântico fixo** (proibido improvisar fora dele):

| Domínio | Ícone Lucide |
|---|---|
| captura / ingestão | `inbox` |
| apontamento / divergência | `triangle-alert` |
| decisão / revisão humana | `user-check` |
| aprovação (CRC) | `badge-check` |
| carimbo de tempo (ACT) | `stamp` |
| hash / integridade | `fingerprint` |
| trilha de boa-fé | `git-commit-vertical` (timeline) |
| laudo / documento | `file-check-2` |
| XML (prova 1ª classe ◆) | `file-code-2` |
| OCR (prova 2ª classe ◇) | `scan-line` |
| e-CAC / caixa postal | `mail` |
| CND / certidão | `file-badge` |
| dívida ativa | `landmark` + `triangle-alert` |
| guia (DAS/DARF) | `receipt-text` |
| norma / base legal | `scale` |
| confiança calibrada | `gauge` |

### 4.2 Tipografia — operacionalização
- `next/font/google`: `Inter` (400/500/600/650 variable) + `IBM_Plex_Mono` (400/500). Remove o `@import` do globals (E5).
- Classe utilitária `.num` obrigatória em TODO dígito fiscal: `font-variant-numeric: tabular-nums slashed-zero` (já existe; auditar cobertura nas 14 rotas).

### 4.3 Imagens/ilustração
**Nenhuma.** Produto data-dense; a "imagem" é o documento. Empty-states: ícone Lucide 24px + texto — sem ilustração de mascote (anti-slop).

## 5. Mapa de aplicação (ordem de ataque no front)

Método harness: 3 telas-âncora primeiro, resto herda.

1. **Painel** (porta de entrada) — stats editoriais E3, hairline E1, ícones §4.1.
2. **Laudo** (o produto) — registro "documento de fé pública": cabeçalho trust-center, faixa de status, disclaimer-credencial, número editorial.
3. **Trilha** (o moat) — timeline selada: nó com ator+CRC, badge ◆/◇, hash mono copiável, carimbo `stamp`.
4. Derivação modular: Fila/Aprovação/Carteira herdam tabela+chips; e-CAC/Parcelamentos/Recuperação herdam cards+alertas; Configurações herda forms.

## 6. Gates / próximos passos

- 🎨 **Founder:** aprovar E1–E6 (ou riscar itens) + reagir ao board visual (Artifact publicado nesta sessão).
- 🔨 Após aval: aplicar E1/E2/E3/E6 no `globals.css` (só tokens/classes — mudança pequena), `npm i lucide-react`, migrar fonts pra `next/font`, e redesenhar as 3 telas-âncora.
- 📛 Naming "Lastro" segue provisório (04-naming-candidates) — logo/marca fora deste escopo.
- ⚠️ Banlist G6 continua gate em toda cópia nova de UI.

---
*Fontes: Refero design-system extraction (duna.com, mercury.com + buscas "compliance/fintech light"), ui-ux-pro-max (products.csv: Financial Dashboard), harness Claude Design (Alan Nicolas, KB design-lead 22/Jun), DESIGN.md v1 + 50-design-research/01–04.*
