# DESIGN.md — Sistema de Design do Projeto Contador

> **Produto:** plataforma de **apuração defensável da Reforma** vendida PARA escritórios contábeis BR (o canal).
> **Artefato-herói:** o **LAUDO defensável** + a **trilha de boa-fé** (timeline rastreável).
> **Registro emocional:** confiança, precisão, conformidade, auditabilidade, **autoridade calma**. NÃO luxo, NÃO lúdico, NÃO startup-chamativa.
> **Status:** v1 — síntese de pesquisa massiva (HYDRA squad-design + 4 frentes de fonte primária, 2026-06-20). Fonte de pesquisa: `docs/projects/contador/50-design-research/`.
> **Nome de marca:** provisório (`Lastro`, codinome de trabalho) — shortlist em `50-design-research/04-naming-candidates.md`, a validar com os sócios.

---

## 1. Princípio-mãe: **a prova é a interface**

A confiança nesta categoria não vem de "parecer caro" — vem de **parecer verificável**. Todo o sistema de design existe para tornar a *defensabilidade* visível. Estética = a estética da prova, não a do hype.

### Os 12 princípios (alimentam toda decisão de UI)

1. **A prova é a interface.** Toda alegação de conformidade é clicável até a evidência bruta (nota/XML/norma). Nunca um "tudo certo" sem caminho até o lastro.
2. **Restrição = confiança.** Neutros + **1 acento institucional sóbrio**; cor reservada para *semântica de status*, nunca decoração. Sem azul-governo, sem brasão.
3. **Números são cidadãos de primeira classe.** `tabular-nums` + `slashed-zero`, alinhados à direita, escala tipográfica restrita.
4. **Densidade sem ruído.** Whitespace e fundo separam blocos; bordas/grades pesadas e ornamento saem. Densidade vem de remover enfeite, não dado.
5. **Trilha = timeline vertical imutável, append-only.** Cada nó: ator + papel/CRC, ação, timestamp ancorado (ACT), referência verificável (hash). Mostrar o carimbo, não só armazená-lo.
6. **Classe de insumo é visível em todo nó.** Badge XML (◆ prova de 1ª) vs. OCR (◇ prova de 2ª). Nunca misturar sem rótulo.
7. **Incerteza muda o fluxo — não fica decorativa.** Baixa confiança destaca o campo, bloqueia a aprovação automática, empurra pro humano qualificado e **fica gravada na trilha**.
8. **Confiança calibrada, nunca falsa certeza.** Rótulo acionável + os fatores que a determinaram (qual regra / `cClassTrib`), traduzido para um não-estatístico.
9. **Human-in-the-loop é visível e habilitado.** A aprovação carimba *quem* (CRC ativo), *quando* e *com qual habilitação* na própria UI — ato privativo do contador é design, não rodapé.
10. **Disclaimer é credencial, não isenção.** Inline, discreto, ancorado ao número: data de verificação + norma versionada + classe de insumo.
11. **"Frescor da prova" é indicador.** Mostrar quando a norma/insumo foi verificado vs. o calendário normativo; prova velha é sinal visível.
12. **Feedback e estado sempre visíveis (Norman).** Todo processamento tem estado determinado e honesto; toda ação tem confirmação rastreável.

### 2 princípios de mecânica de confiança (de "The hidden UX of payments", HYDRA)

13. **Cerimônia graduada.** O peso da confirmação = o tamanho do estrago (blast radius). Aprovar a apuração de um cliente = cerimônia pesada (confirmação explícita, tipo "digitar para confirmar" do GitHub). Ações cosméticas fluem sem atrito. *Friction escolhida pelo usuário, no momento da consequência, vira agência — não custo.*
14. **Ilusão de trabalho / transparência operacional.** Mostrar o trabalho sendo feito gera confiança (TurboTax "checando cada dedução"). A trilha de boa-fé e os estados de processamento da auditoria são a evidência visível do trabalho — nunca esconder o esforço atrás de um resultado instantâneo.

---

## 2. Direção visual

**Canônica: "Verde-Petróleo Defensável".** Teal-petróleo dessaturado e escuro como cor de marca — diferencia do azul-clichê dos incumbentes (Domínio/Conta Azul/TR) e **significa** verificado/aprovado/conforme = o moat. Neutro estrutural = grafite-azulado (autoridade jurídica). Fundo claro (light-first; o contador trabalha horas em tabela densa).

**Alternativa conservadora documentada: "Azul Confiança Institucional"** (§4.B) — menor risco de adoção com público contábil conservador; decisão a validar com os sócios.

Regra de ouro: **o acento NÃO é a cor dominante.** Domina o neutro (papel + grafite). Acento = ação primária, link, item ativo, selo de conformidade. É isso que faz parecer "control surface" séria e não dashboard genérico colorido.

---

## 3. Tokens canônicos (Verde-Petróleo Defensável)

```json
{
  "color": {
    "primary":        "#0b5757",
    "primary-hover":  "#094545",
    "primary-active": "#073a3a",
    "primary-soft":   "#e3f4f3",
    "primary-border": "#a9dedc",

    "bg":          "#f4f7f7",
    "surface":     "#ffffff",
    "surface-2":   "#eef3f3",
    "border":      "#dde7e6",
    "border-strong":"#c6d4d3",

    "text":        "#13262a",
    "text-dim":    "#4c5d61",
    "text-faint":  "#86979a",

    "success":      "#0f5132",
    "success-soft": "#e7f4ec",
    "warning":      "#92560a",
    "warning-soft": "#fdf3e3",
    "danger":       "#b42318",
    "danger-soft":  "#fef2f1",
    "info":         "#0b5757",
    "info-soft":    "#e3f4f3"
  },
  "radius": { "sm": "6px", "md": "8px", "lg": "10px", "xl": "14px", "full": "999px" },
  "space":  { "0":"0px","0.5":"2px","1":"4px","1.5":"6px","2":"8px","2.5":"10px","3":"12px","4":"16px","5":"20px","6":"24px","8":"32px","10":"40px","12":"48px","16":"64px" },
  "shadow": {
    "xs": "0 1px 2px rgba(16,24,40,0.04)",
    "sm": "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
    "md": "0 2px 4px rgba(16,24,40,0.05), 0 4px 8px rgba(16,24,40,0.06)",
    "lg": "0 4px 8px rgba(16,24,40,0.06), 0 12px 24px rgba(16,24,40,0.08)",
    "focus-ring": "0 0 0 3px rgba(11,87,87,0.30)"
  }
}
```

> `primary` ancorado em **`#0b5757`** (não `#0e6b6b`) para folga AAA: branco-sobre-primary ≈ 7.5:1. `success` mantido em **verde-floresta `#0f5132`** distinto do teal de marca — para "entregue/aprovado" não se confundir com o acento. Contrastes validados via `contrast_check` (WCAG 2.1): text 15.5:1, text-dim 6.6:1, todos os semânticos PASS AA (maioria AAA).

### Mapa de status (semântica do domínio → token)

| Status operacional | Token | Uso |
|---|---|---|
| `a_fazer` | text-dim (neutro) | triagem inicial |
| `pendente_cliente` | warning | aguardando insumo do cliente |
| `pendente_contador` | info / primary | aguardando ação do escritório |
| `em_revisao` | info | em análise humana |
| `apontamento` | warning | divergência detectada |
| `tratado` | primary-soft + primary | divergência endereçada |
| `aprovado` / `entregue` | success | ato humano concluído (CRC) |
| `risco` / `atraso` | danger | prazo/multa em risco |

**Status sempre redundante:** cor + ícone + label. Nunca só matiz (a11y + uma trilha de boa-fé não pode ser ambígua em P&B/daltônico).

---

## 4. Direção alternativa (para validação com sócios)

### B. Azul Confiança Institucional (conservadora, refina a base radar-fiscal)

```json
{ "primary": "#1a45bc", "primary-soft": "#eaf1ff", "bg": "#f5f7fb",
  "surface": "#ffffff", "border": "#e3e8f0", "text": "#16233a",
  "text-dim": "#52607a", "success": "#0f5132", "warning": "#92560a", "danger": "#b42318" }
```
primary 8.01:1 (AAA). Vocabulário visual que o mercado fiscal BR já lê como "sistema sério" (Receita/banco). Menor risco, sem ruptura com o radar-fiscal atual.

> A terceira direção pesquisada (Grafite + Âmbar, "instrumento de precisão") está documentada em `50-design-research/03` como opção premium/ousada — não recomendada sem teste com contadores reais.

---

## 5. Tipografia

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root {
  --font-ui:   'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono: 'IBM Plex Mono', 'SFMono-Regular', ui-monospace, monospace;
}
body { font-family: var(--font-ui); font-feature-settings: 'cv01','ss01'; }
.num, td.num, .mono-fiscal { font-variant-numeric: tabular-nums slashed-zero; letter-spacing: -0.005em; }
```

- **Inter** — UI / dados / tabelas (400/500/600/700). Base 14px (data-density).
- **IBM Plex Mono** — XML de NF-e, hashes de carimbo, payloads.
- **tabular-nums + slashed-zero obrigatórios** em TODO dígito fiscal (R$, CNPJ, NCM, alíquota, data, % de risco, ID de nota). Colunas numéricas alinham à direita.

### Escala (1.200, base 14px)

| Token | px | line-height | uso |
|---|---:|---:|---|
| xs | 11 | 1.4 | rótulos uppercase, hints |
| sm | 12 | 1.45 | badges, meta |
| base | 14 | 1.5 | corpo / célula (default) |
| md | 16 | 1.5 | inputs, ênfase |
| lg | 18 | 1.4 | subtítulo de painel |
| xl | 22 | 1.3 | título de página |
| 2xl | 28 | 1.25 | KPI grande |
| 3xl | 34 | 1.2 | hero / cabeçalho de laudo |

Pesos: corpo 400, label 500, título/ênfase 600, KPI/H1 700. Tracking negativo só em ≥18px.

---

## 6. Especificação dos componentes-herói

### 6.1 LAUDO defensável (o produto)
Layout de "documento de fé pública" + control surface. Cabeçalho tipo *trust center*: **o que foi verificado · contra qual norma versionada · com qual classe de insumo · quando · por quem (CRC)** — tudo exportável. Corpo = divergências por item (tabela). Rodapé = disclaimer-credencial (G6) + selo de carimbo de tempo real.
- Cada apontamento: produto · NCM · cClassTrib/CST aplicado vs. referência · natureza da divergência · **confiança calibrada** · base normativa citada.
- Estado visual do laudo: faixa de status no topo (verde "defensável" / âmbar "requer revisão" / vermelho "risco").

### 6.2 Trilha de boa-fé (timeline vertical append-only)
- Eixo vertical, agrupado por dia; ícone semântico por tipo (`captura · apontamento · decisão · aprovação · carimbo`).
- Cada nó: **ator + papel/CRC**, ação, timestamp **absoluto** (auditoria) com relativo entre parênteses, **badge de classe de insumo** (◆ XML / ◇ OCR), e **hash verificável** (mono, copiável) com o carimbo ACT mostrado.
- Imutável: visualmente "selada" — sem botões de editar/excluir; só "adicionar evento corretivo versionado".

### 6.3 Confiança / abstenção
- Por campo/apontamento: rótulo acionável (`alta` / `média` / `revisar antes de aprovar`) + os fatores normativos que dispararam. Nunca selo binário "correto".
- Baixa confiança: borda âmbar + ícone de revisão; **bloqueia aprovação automática**; o bloqueio é registrado na trilha.

### 6.4 Aprovação humana (cerimônia graduada)
- Ato privativo do contador: confirmação pesada (revisão explícita item-a-item OU "digitar para confirmar"), **nunca aprovação em lote silenciosa**.
- Carimba na UI: nome, CRC ativo, habilitação, timestamp → vira nó na trilha.

### 6.5 Tabela de apuração (data-dense)
- Cabeçalho fixo no scroll; coluna CNPJ/nota ancorada à esquerda; zebra sutil OU espaçamento (sem grade pesada); valores à direita com tabular-nums.
- Seleção em lote para tratar apontamentos (pico dia 1–12). Linha em risco: faixa `inset 3px 0 0 var(--danger)`, nunca só texto vermelho.
- Densidade "confortável-compacta" default + toggle compacta.

### 6.6 Disclaimer-credencial
Texto secundário, inline, ancorado ao número: *"indício · base {norma vX} · insumo {XML/OCR} · verificado {data}"*. Sem banner de medo. Linguagem travada por `45-safe-fiscal-language-claims-v1.md` (G6): indício/evidência/trilha verificável/revisão humana — **nunca** "crédito garantido", "apuração correta", "elimina multa", "prova jurídica plena".

---

## 7. Padrões transversais
- **Light-first** (dark mode = v2; tokens preparados para inverter).
- **Foco visível obrigatório:** `outline: 2px solid var(--primary); outline-offset: 2px` ou `shadow.focus-ring`. Nunca remover sem substituto.
- **Elevação contida:** `shadow.sm` em cards; `md`/`lg` só em dropdown/modal. Autoridade = pouca sombra.
- **Raio moderado** (não pill-everything); `full` só em status/contadores/avatar.
- **2 famílias no máximo.** Acento parcimonioso. Bordas mínimas.

---

## 8. O que EVITAR (tells de "datado/burocrático")
Azul-governo saturado + brasão · grades de tabela pesadas · tipografia de sistema apertada com pesos aleatórios · texto legal em blocos de medo · "oficialidade" performada (selos/carimbos decorativos). A autoridade do Contador nasce da **substância exposta** (norma versionada, carimbo ACT real, CRC do aprovador, hash imutável) com a contenção visual de um Stripe/Mercury. **Oficial pela prova, moderno pela restrição.**

---

*Pesquisa-base: `50-design-research/01-ux-trust-patterns.md` (12 princípios, fontes Vanta/Drata/Stripe/Mercury/Ramp/Pennylane/Linear/NN-g/PAIR), `02-competitive-visual-audit.md` (11 produtos BR+global), `03-tokens-palette-type.md` (3 direções WCAG-validadas), HYDRA squad-design digest 2026-06-20 ("The hidden UX of payments" → cerimônia graduada + ilusão de trabalho). Advisors: don-norman, dieter-rams.*
