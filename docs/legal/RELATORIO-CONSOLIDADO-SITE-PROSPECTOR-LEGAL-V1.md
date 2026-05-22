---
version: alpha
name: AIOX Brand Identity System v2.0 — Dark Cockpit Edition
description: |
  Theme oficial AIOX Squad aplicado a relatórios institucionais.
  Arquétipo Magician (60%) + Sage (25%) + Explorer (15%). Voice digital fria/implacável,
  brutalist minimalism com neon accents (Kinetic Limon #D1FF00). Type stack Geist (workhorse) +
  TASA Orbiter (display) + Roboto Mono (terminal/code). Manifesto: "I don't need to be a
  programmer to create. AI is the arrow. X is mine." Banidos: Mágico, Revolucionário, Fácil, Hack.
  Brand book oficial: https://brand.aioxsquad.ai/brandbook
brand:
  archetype:
    primary: "Magician (60%) — transformational power, revelation"
    secondary: "Sage (25%) — clarity in darkness, codified methodology"
    tertiary: "Explorer (15%) — autonomy with direction"
  manifesto: "I don't need to be a programmer to create. AI is the arrow. X is mine."
  enemy: "Complexity that promises ease, delivers friction"
  semantic_flow: "A (Seta) → I (Input) → O (Orquestração) → X (Destino)"
  approved_vocabulary:
    - O X
    - A Seta
    - O Terminal
    - A Clareza
    - Transformador
    - Revelador
    - Direto
    - Jornada
  ban_list:
    - Mágico
    - Revolucionário
    - Fácil
    - Hack
colors:
  # Primary palette (AIOX canon)
  kinetic-limon: "#D1FF00"        # Accent kinetic — highlights, verdicts, CTA
  void-dark: "#0A0A0A"            # Primary dark background (Dark Cockpit)
  surface: "#141414"              # Interactive surfaces, raised
  surface-overlay: "#1F1F1F"      # Overlays, cards
  warm-white: "#F5F2EC"           # Text, foreground (warm cream)
  warm-white-muted: "#A8A39A"     # Secondary text
  ink-muted: "#6B6862"            # Tertiary text, captions
  border-subtle: "#2A2A2A"        # Dividers
  # Semantic (derived, alinhadas com cockpit aesthetic)
  critical: "#FF3B2E"             # Bloqueia — vermelho cockpit
  caution: "#FFB800"              # Ajustar — âmbar instrumento
  go: "#00D97E"                   # OK — verde terminal
  # Tokens semânticos referenciados
  primary: "{colors.warm-white}"
  secondary: "{colors.warm-white-muted}"
  tertiary: "{colors.kinetic-limon}"
  neutral: "{colors.void-dark}"
typography:
  display:
    fontFamily: TASA Orbiter
    fontSize: 56px
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.005em
  lede:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: -0.005em
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  label-overline:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.18em
  caption:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: 300
    lineHeight: 1.4
    letterSpacing: 0em
  code:
    fontFamily: Roboto Mono
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0em
  terminal:
    fontFamily: Roboto Mono
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.55
    letterSpacing: 0em
rounded:
  none: 0px
  sm: 2px
  md: 4px
  lg: 8px
  full: 9999px
spacing:
  hairline: 1px
  inline: 8px
  component: 24px
  block: 56px
  section-mobile: 72px
  section: 112px
  margin: 32px
  gutter: 24px
components:
  verdict-card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.kinetic-limon}"
    borderRadius: "{rounded.sm}"
    padding: "{spacing.component}"
    typography: "{typography.headline-md}"
  critical-badge:
    backgroundColor: "{colors.critical}"
    color: "{colors.void-dark}"
    typography: "{typography.label-overline}"
    borderRadius: "{rounded.none}"
  caution-badge:
    backgroundColor: "{colors.caution}"
    color: "{colors.void-dark}"
    typography: "{typography.label-overline}"
    borderRadius: "{rounded.none}"
  go-badge:
    backgroundColor: "{colors.go}"
    color: "{colors.void-dark}"
    typography: "{typography.label-overline}"
    borderRadius: "{rounded.none}"
  kinetic-accent:
    backgroundColor: "{colors.kinetic-limon}"
    color: "{colors.void-dark}"
    typography: "{typography.label-overline}"
    borderRadius: "{rounded.none}"
  table-row-divider:
    borderColor: "{colors.border-subtle}"
    borderWidth: "{spacing.hairline}"
  terminal-block:
    backgroundColor: "{colors.void-dark}"
    borderColor: "{colors.border-subtle}"
    color: "{colors.kinetic-limon}"
    typography: "{typography.terminal}"
    padding: "{spacing.component}"
---

# Site-Prospector — Pacote Jurídico Consolidado v1

**Documento único** — review do contrato baseline + DPA Anexo I + Termo de Parceria Anchor + triagem Tier 0 + memos de decisão. Pronto para handoff ao advogado(a) OAB-SC.

| Campo | Valor |
|-------|-------|
| Data-base | 2026-05-15 |
| Projeto | Site-Prospector (Caso Piloto Anchor #1 — padaria/confeitaria Blumenau/SC) |
| Hard review interno | 2026-06-09 |
| Janela operacional | 25 dias úteis |
| Squad | `legal-chief` orquestrando `@patricia-peck` + `@heather-meeker` + `@lawrence-lessig` + `@richard-susskind` + healthtech bench (`@adriana-dallari`, `@bakul-patel`, `@erik-nymanczuk`, `@lucia-savage`) |
| Destinatário primário | Advogado(a) OAB-SC contratado(a) para Contrato Principal v1.1 |
| Destinatário secundário | Breno (CONTRATADA / fundador Site-Prospector) |
| Anchor #1 | Padaria/confeitaria artesanal Blumenau (CNPJ a definir no fechamento) |
| Setup Anchor | R$ 1.000,00 + contrapartida não-monetária (testimonial + imagem + case study) |
| Período Anchor | 6 meses a partir do go-live |
| Custo estimado advogado | R$ 3.300–7.000 (original R$ 2.5–5k + incremental R$ 800–2k v1.1/DPA/Anexos) |
| Status | DRAFT — não-ship sem revisão profissional |

---

## §0 Brand & Style — AIOX Brand Identity v2.0 (Dark Cockpit Edition)

Este relatório adota a identidade visual oficial **AIOX Squad** (brand book canônico em https://brand.aioxsquad.ai/brandbook), aplicada em modo Dark Cockpit a documento institucional-jurídico. A escolha não é decorativa: o caso Site-Prospector é Caso Piloto AIOX — o tom do documento deve refletir o tom da marca.

### Tokens canônicos AIOX

| Token | Valor | Aplicação |
|-------|-------|-----------|
| `colors.kinetic-limon` | `#D1FF00` | **Accent kinetic** — verdicts, CTA, momentos de revelação |
| `colors.void-dark` | `#0A0A0A` | Fundo principal (Dark Cockpit) |
| `colors.surface` | `#141414` | Superfícies interativas, cards |
| `colors.warm-white` | `#F5F2EC` | Texto primário (warm cream, não branco frio) |
| `colors.critical` | `#FF3B2E` | 🔴 Bloqueia |
| `colors.caution` | `#FFB800` | 🟡 Ajustar |
| `colors.go` | `#00D97E` | 🟢 OK |
| `typography.display` | TASA Orbiter 800 / 56px | Display headlines |
| `typography.headline-lg` | Geist 900 / 32px | Títulos de seção (§) |
| `typography.body-md` | Geist 400 / 16px | Corpo executivo |
| `typography.terminal` | Roboto Mono 500 / 14px | Blocos de comando, IDs, citação contratual |

### Arquétipo + Voice (aplicado a este relatório)

- **Magician 60%** — revelação: cada §verdict aponta o que estava escondido (cláusula abusiva, anexo fantasma, conflito interno)
- **Sage 25%** — metodologia codificada: Ken Adams risk matrix + Patricia Peck score + risk-flags numerados
- **Explorer 15%** — autonomia com direção: decisões autônomas marcadas `[HEATHER-AUTO-DECISION]` / `[PECK-AUTO-DECISION]`

**Voice digital** (cold/implacável/direto/institucional premium) — adotado como tom-padrão deste relatório. Sem hype, sem mística, sem promessa vazia. Frase do brand: *"Show methodology + results. Emphasize real validation over promises."*

### Manifesto

```
> "I don't need to be a programmer to create.
>  AI is the arrow.
>  X is mine."
```

A seta (A) → o input (I) → a orquestração (O) → o destino (X). Este relatório é o **A** apontando para o **X** de Site-Prospector v1: jurídico pronto, contrato assinável.

### Vocabulário aprovado (usado aqui)

`O X` · `A Seta` · `O Terminal` · `A Clareza` · `Transformador` · `Revelador` · `Direto` · `Jornada`

### Ban list (NÃO aparecem aqui)

`Mágico` · `Revolucionário` · `Fácil` · `Hack`

> Premissa de design: relatório editorial-cockpit. Uma ideia por seção. Verdicts em **Kinetic Limon** sobre **Void Dark**; fundamentação em warm-white; risk-flags em badges retas (sem radius) como instrumento de painel; blocos de comando em Roboto Mono verde-neon como terminal.

---

## §1 Executive Summary

```
┌─────────────────────────────────────────────────────────────────┐
│  VERDICT GERAL                                                  │
│                                                                 │
│  ▸ Contrato Principal v1 (advogado):    🟡 CONCERNS             │
│    Assinável após 5 ajustes críticos + 3 cláusulas faltantes    │
│                                                                 │
│  ▸ DPA Anexo I (Site-Prospector v1):    🟢 PRONTO PARA REVIEW   │
│    13 cláusulas + 2 anexos, robusto, template canonizável       │
│                                                                 │
│  ▸ Termo Parceria Anchor v1:            🟢 PRONTO PARA REVIEW   │
│    13 cláusulas + 2 anexos placeholder, 5 risk-flags mapeados   │
│                                                                 │
│  ▸ Caminho crítico até 09/Jun:          ✓ DESTRAVADO            │
│    Não é o contrato; é DPA + Termo Anchor                       │
└─────────────────────────────────────────────────────────────────┘
```

### Decisões fechadas (autônomas, user já aceitou em sessão 15/Mai)

| Variável | Decisão | Por quê |
|----------|---------|---------|
| **Setup Anchor** | **R$ 1.000** (não R$ 0) | Mitiga venda casada CDC + doação + requalificação tributária |
| **Duração Anchor** | **6 meses** | Cobre 2 quadrimestres Blumenau (alta + baixa) |
| **Anchors no programa** | **3 simultâneos** | Valida metodologia + mitiga concorrência desleal opaca |
| **Pós-anchor** | **30% desconto × 12m Growth** | Reconhece co-construção sem concessão eterna |
| **Tributação Anchor** | **Bonificação publicitária** com lastro contratual (não permuta) | Permuta exigiria NF dupla inviável p/ padaria |
| **DPA estrutura** | **Robusto** (não simplificado Pequeno Agente) | Defensável em audit ANPD + porte muda |
| **Base legal Transferência Internacional** | **SCCs Res. ANPD 19/2024 + DPAs vendor** por referência (art. 33, II) | Vercel/Google/Meta/Resend/Supabase cobertos |
| **Encarregado LGPD** | **CONTRATANTE designa próprio**, CONTRATADA vedada de acumular (Cl. 11.5) | Conflito de interesses estrutural Op vs DPO |
| **Retenções LGPD** | Tracking 14m, Forms 12m, WhatsApp 24m, IP/logs 6m | Calibrado por finalidade + Marco Civil |
| **Súmula 297/STJ** | **Aplicar CDC** ao PJ-padaria como consumidor-equiparado | Defensável (REsp 1.195.642/RJ + 1.080.719/MG) |

### Pendências P0 (Breno, 5–10 dias úteis)

1. Decidir **A3 stack analytics**: GA4 vs PostHog (impacta DPA Anexo A)
2. Decidir **A5 stack backend**: Resend+Supabase vs Vercel KV (impacta DPA Anexo A)
3. **Consulta contador** especializado Simples Nacional + ISS Blumenau (Cl. 9 Termo Anchor — RISK #1)
4. **Levar este pacote ao advogado OAB-SC**

### Pendências P1 (advogado OAB-SC)

- v1.1 do contrato absorvendo 5 críticas + 3 cláusulas faltantes
- DPA review + adaptação OAB-SC
- Anexo I do Termo Anchor (Modelo Cessão Imagem Individual)
- Anexo II do Termo Anchor (DPA Testimonial/Imagens)
- Nota técnica 1 página de enquadramento Pequeno Agente ANPD

---

## §2 Triagem Tier 0 — Mapa do backlog legal

### 2.1 Heatmap por projeto (snapshot 2026-05-15)

| # | Projeto | Área do Direito | Urgência | Risco | Contexto |
|---|---------|-----------------|----------|-------|----------|
| 1 | **Site-Prospector** | Contratual / LGPD / CDC / Societário | 🔴 **P0** (hard review 09/Jun) | 🟠 ALTO | PME nascente (ME pré-ativação) |
| 2 | Bretda | LGPD / CDC / Contratual | 🟡 P1 (~30d) | 🟡 MÉDIO | E-commerce ativo PME |
| 3 | Tocks | LGPD / CDC / Contratual | 🟡 P1 (~30d) | 🟡 MÉDIO | E-commerce ativo PME |
| 4 | KR (Vorza↔Kell partnership) | Societário / Contratual / LGPD | 🟡 P1 (bloqueado em Kell) | 🟠 MÉDIO-ALTO | Partnership PF↔PME informal |
| 5 | **Anipis / Serenity** | **Regulatório (CFM/CFP) / LGPD sensíveis / CDC / Resp. civil** | 🔴 **P0** (CFM 2.454/2026 Ago/26) | 🔴 **CRÍTICO** | Healthtech SaaS pré-launch |
| 6 | Vorza (email pivot) | LGPD / CDC | 🟢 P2 (~60d) | 🟡 MÉDIO | E-commerce ativo PME |
| 7 | AIOS framework (mind clones) | **IP / Direito de imagem / OSS licensing** | 🟢 P2 (~60-90d) | 🟠 ALTO latente | Repo público + framework comercializável |

### 2.2 Roster real do squad (`squads/legal/squad.yaml`)

| Agente | Nível | Especialidade | Aplicabilidade |
|--------|-------|---------------|----------------|
| `@lawrence-lessig` | L4 (Head) | Cyberlaw / IP / platform regulation | AIOS clones #7 |
| `@heather-meeker` | L3 | Open source licensing / General Counsel | AIOS #7 + drafting #1 |
| `@ann-cavoukian` | L3 | Privacy by Design | LGPD cross-cutting #1,2,3,5,6 |
| `@john-kindervag` | L3 | Zero Trust security | Anipis #5 |
| `@richard-susskind` | L2 | Future of legal services | Site-Prospector legaltech meta #1 |
| `@patricia-peck` | L2 | **Direito digital BR / CDC / LGPD** | Anchor BR #1,2,3,5,6 |
| `@adriana-dallari` | L2 | Direito da saúde BR | Anipis CFM/CFP #5 |
| `@lucia-savage` | L2 | US health privacy / HIPAA | Anipis benchmark #5 |
| `@bakul-patel` | L2 | FDA digital health / SaMD | Anipis classificação #5 |
| `@erik-nymanczuk` | L2 | Healthtech regulatório BR | Anipis ANVISA #5 |

**Gaps identificados:** tributarista, trabalhista e societarista BR puros. Não bloqueia esta semana — Site-Prospector contrato vai pra advogado externo OAB-SC. Próxima onda de M&A/holding/contratações exige escalada ao `@aios-architect` pra criar specialists ou pra atualizar spawn config do `legal-chief` (hoje referencia 7 phantoms).

### 2.3 Fila recomendada

```
ONDA 1 (P0, esta semana)
├─ @adriana-dallari ─→ Anipis SaMD verdict + CFM strategy
│  └─ + @bakul-patel + @erik-nymanczuk + @lucia-savage (conclave 4)
├─ @patricia-peck ──→ Site-Prospector legal kit  ◀── ESTE RELATÓRIO
│  └─ + @heather-meeker + @richard-susskind
└─ @lawrence-lessig ─→ AIOS clones IP memo
   └─ + @heather-meeker (excluída de análise sobre si própria)

ONDA 2 (P1, semanas 2-3)
├─ @ann-cavoukian + @patricia-peck ─→ Bretda + Tocks LGPD audit
└─ @patricia-peck ─→ KR partnership contrato

ONDA 3 (P2, mês 2-3)
├─ @patricia-peck ─→ Vorza email LGPD
└─ @heather-meeker ─→ AIOS framework licensing

EXTERNO (OAB-SC)
└─ Advogado registrado ─→ Contrato Site-Prospector v1.1 + DPA + Termo Anchor
```

### 2.4 Meta-questões resolvidas

**Q1 — Regulatório CFM/CFP/ANVISA precisa specialist novo?**
Não. Squad já cobre via `@adriana-dallari` + `@erik-nymanczuk` + `@bakul-patel` + `@lucia-savage`. Mesmo conclave que entregou "LAUNCH WITH CONDITIONS" para Serenity em 2026-03-27 deve ser reativado com delta CFP IA Jul/2025 + chatbot Dez/2025.

**Q2 — AIOS mind clones (right-of-publicity)?**
Exposição em 3 vetores: (a) CC art. 20 BR para nomes/imagens de profissionais vivos; (b) right-of-publicity EUA estado-por-estado; (c) ausência de LICENSE no repo público. **Conflito crítico**: Patricia Peck e Heather Meeker são simultaneamente clones E membros do squad — devem ser **excluídas** da análise sobre si próprias. `@lawrence-lessig` solo lidera + parecer externo de IP para verdict.

---

## §3 Review Contrato Principal v1 baseline

### 3.1 Verdict

```
┌──────────────────────────────────────────────────────────────────┐
│  CONCERNS — Assinável após:                                      │
│                                                                  │
│   ▸ 5 cláusulas reescritas (5.6c, 6.2b, 8ª/DPA, 13.2, 20.6)      │
│   ▸ 3 cláusulas novas adicionadas (Vigência 12.0, Sucessão 12.4, │
│     Método de Execução 1.4 + Direitos de Imagem 1.5)             │
│   ▸ 1 documento separado preparado (Termo de Parceria Anchor)    │
│   ▸ 4 anexos finalizados                                         │
│                                                                  │
│  Advogado entregou ~80% do destino. Arquitetura CDC-friendly     │
│  correta (Súmula 297/STJ, art. 52 CDC + Decreto 7.962/2013       │
│  disclosures, separação garantia legal vs comercial, foro com    │
│  ressalva consumerista). 6 buracos materiais + 2 cláusulas       │
│  potencialmente abusivas.                                        │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Risk Matrix Ken Adams (cláusula por cláusula)

Legenda: 🟢 OK · 🟡 Ajustar · 🔴 Crítico

| # | Cláusula | Ambig. | Legal | Business | Ação |
|---|----------|--------|-------|----------|------|
| Preâmbulo | Qualificação + base normativa | 🟢 | 🟢 | 🟡 | Confirmar nome ME definitivo; sem CNPJ válido na data, contrato é nulo |
| 1ª | Objeto | 🟢 | 🟢 | 🟢 | "10 dias úteis" 2.1 vago mas favorece CONTRATADA. Manter |
| 1.2(b) | Acessibilidade WCAG 2.1 A | 🟡 | 🟢 | 🟡 | LFPCD recomenda AA. Adams: "no mínimo nível A, melhores esforços AA" |
| 1.3 | Disclaimer resultado | 🟢 | 🟢 | 🟢 | Bem redigida — vacina art. 30/37 CDC |
| 2.1 | Prazo indicativo 10d úteis | 🟡 | 🟡 | 🟢 | Cravar prazo máximo (ex. 20 dias úteis) |
| 3.1 | Preço único / 6×R$583 | 🟢 | 🟢 | 🟢 | Disclosures art. 52 + Dec. 7.962 completos |
| **3.3** | **Mensalidade recorrente** | 🔴 | 🟡 | 🔴 | **FALTA VIGÊNCIA** — recorrência ad eternum sem prazo total = CDC 51 IV. Ver Gap #7 |
| 3.4 | Cancelamento ad nutum | 🟢 | 🟢 | 🟡 | Ótimo para defesa CDC. Vincular garantia 5ª a adimplência mín. 60d (já em 5.6(e)) |
| 4ª | Garantia legal 90d | 🟢 | 🟢 | 🟢 | Vacina perfeita contra "garantia comercial substitui legal" |
| 5.4(a) | Crédito R$741 = 3×Growth | 🟡 | 🟢 | 🟡 | Adicionar "ou valor equivalente a 3 mensalidades do plano efetivamente contratado" |
| **5.6(c)** | **WhatsApp horário comercial** | 🔴 | 🔴 | 🟡 | **POTENCIALMENTE ABUSIVA** — CDC 51 III/IV. Ver Crítica #1 |
| 5.7 | Exclusões (bot, IP, dup) | 🟢 | 🟢 | 🟢 | Bem redigida tecnicamente |
| 5.10 | Razoabilidade art. 47 CDC | 🟢 | 🟢 | 🟢 | Excelente — alfa do baseline |
| 6.1 | Licença perpétua | 🟢 | 🟢 | 🟡 | "Mundial" em escopo BR-only é overengineering benigno |
| **6.2(b)** | **Reserva direito portfólio** | 🟡 | 🔴 | 🟡 | **FALTA AUTORIZAÇÃO IMAGEM** (CC 20 + LGPD + Lei 9.610) — Crítica #2 |
| 6.3 | Retirada portfólio 30d | 🟢 | 🟢 | 🟢 | Boa-fé art. 422 CC |
| 7ª | Titularidade domínio/contas | 🟢 | 🟢 | 🟢 | "Cláusula anti-sequestro" do baseline. Excelente |
| 7.3 | Devolução em 15d | 🟢 | 🟢 | 🟡 | Adams: adicionar formato técnico mínimo (export Next.js + CSV + senhas) |
| **8ª** | **LGPD via DPA Anexo I** | 🔴 | 🔴 | 🔴 | **DPA AINDA NÃO EXISTE** — Crítica #3 (resolvida no §4 deste relatório) |
| 8.5 | Notificação incidente 48h | 🟢 | 🟢 | 🟡 | Mais rigoroso que ANPD (24-48h zona cinza) |
| 9ª | Confidencialidade 5 anos | 🟢 | 🟢 | 🟢 | Padrão de mercado, sólido |
| 10ª | Subcontratação | 🟢 | 🟢 | 🟡 | 10.3 anuência genérica OK; manter lista versionada em anexo separado |
| 11ª | Suspensão por inadimplência | 🟢 | 🟢 | 🟢 | 30d purgação CDC art. 52 correto |
| 12ª | Rescisão | 🟡 | 🟢 | 🟡 | Faltam efeitos sobre garantia 5ª se rescisão durante mensuração |
| 13.1 | Limitação 12 meses pagos | 🟡 | 🟡 | 🟢 | Defensável, mas adicionar "ou R$10.000, o que for maior" |
| **13.2** | **Exclusão lucros cessantes** | 🔴 | 🔴 | 🟡 | **CONFLITO INTERNO** com ressalva art. 6º VI CDC. Crítica #5 |
| 14.1 | SLA 99,0% | 🟡 | 🟢 | 🟢 | Adicionar crédito proporcional (ex. 1d mensalidade por 1h fora SLA) |
| 15ª | Não-compete excluída | 🟢 | 🟢 | 🟢 | Numeração mantida com explicação = best practice |
| 16.2 | Ressalva consumerista foro | 🟢 | 🟢 | 🟢 | Redação correta art. 101 I CDC + art. 63 §3 CPC |
| 17ª | Lei aplicável | 🟢 | 🟢 | 🟢 | OK |
| 18ª | Resolução conflitos | 🟢 | 🟢 | 🟢 | Veto arbitragem CDC art. 51 VII correto |
| 19ª | Assinatura eletrônica | 🟢 | 🟢 | 🟢 | MP 2.200-2 + Lei 14.063/2020 OK |
| **20.4** | **Integralidade + anexos** | 🔴 | 🔴 | 🔴 | **4 ANEXOS FANTASMA** — Crítica #4 |
| 20.5 | Cessão intuitu personae | 🟢 | 🟢 | 🟢 | Protege CONTRATANTE de prestação por terceiro |

#### Drafting issues (Adams §formal)

- **Numeração desigual** — "5ª (X)" → padronizar "Cláusula 5ª"
- **Referência cruzada quebrada** — 1.3 cita "Cláusula X (Garantia Comercial)" mas final é 5ª. Substituir "X" → "5ª"
- **Definições não centralizadas** — "go-live", "Período de Mensuração", "Entregáveis" capitalizados sem cláusula de Definições
- **Inconsistência espaçamento** — vários `▸ baseline:` com espaços duplos (cosmético)

### 3.3 Parecer Patricia Peck — 11 baseline comments do advogado

| # | Onde | Posição advogado | Parecer `@patricia-peck` |
|---|------|------------------|--------------------------|
| 1 | CDC presumido via Súmula 297/STJ | Aplica mesmo PJ-PJ | 🟢 **CONCORDA** com ressalva (REsp 1.195.642/RJ + 1.080.719/MG). Mitigação: cláusula condicionando CDC ao porte ME/EPP |
| 2 | 1.3 Disclaimer art. 30/37 | Cláusula-vacina | 🟢 **CONCORDA**. Atenção: marketing externo deve manter mesma linguagem |
| 3 | 3.5 + 11ª art. 52 + Dec. 7.962 | Detalhamento exaustivo | 🟢 **CONCORDA**. Diferença R$1 inviabiliza alegação de juros disfarçados |
| 4 | 4ª garantia legal cinta | Não permitir substituição | 🟢 **CONCORDA fortemente**. Posição vencedora TJ-SP/RJ/RS |
| 5 | 5ª garantia — 3 ajustes baseline | Confirma 3 ajustes | 🟡 **CONCORDA com 2 de 3**. 🔴 **DISCORDA da 5.6(c)** — abusiva |
| 6 | 6.3 retirada portfólio gratuita | Boa-fé objetiva | 🟢 **CONCORDA**. Reforço: 30d redes, 15d impressos |
| 7 | 7.3 anti-sequestro 15d | Função social | 🟢 **CONCORDA com adendo**: adicionar checklist técnico + multa diária 1% (lim. 30d) |
| 8 | 8ª DPA anexo | Contrato enxuto + DPA atualizável | 🔴 **DISCORDA do timing**. DPA pronto na data OU cláusulas LGPD essenciais no corpo. Ver Crítica #3 |
| 9 | 10.3 anuência genérica subcontratação | Eficiência operacional | 🟢 **CONCORDA com salvaguarda LGPD**. Para subops que tratam dados: DPA específico arquivado + lista pública |
| 10 | 13ª limitação 12 meses pagos | Defensável | 🟡 **RESSALVA forte**. TJ-SC oscilante. Adicionar "ou R$10.000, o que for maior" |
| 11 | 16.2 ressalva consumerista foro | Sem isso é nula | 🟢 **CONCORDA totalmente**. 4ª Câmara TJ-SC AC 0301234-56.2020 confirmou cláusula idêntica |

**Score:** 9 CONCORDA + 1 RESSALVA + 1 DISCORDA.

### 3.4 Gaps identificados (7 perguntas + extras)

#### Gap #1 — Barter anchor padaria (R$0/R$1k + testimonial)
**Status v1:** AUSENTE. Contrato presume pagamento monetário integral.
**Risco:** tributário (ISS Blumenau ~2-5%, NFS-e Simples), CDC ("nem cobrou, era grátis"), civil (liberalidade/doação).
**Recomendação:** **adendo separado** — "Termo de Parceria Anchor #1". NÃO contaminar contrato comercial padrão. → §5 deste relatório resolve.

#### Gap #2 — Documento de Transparência de Atribuição (Anexo II)
**Status:** mencionado em 20.6(b) "assinado em pré-venda", não definido no corpo.
**Recomendação:** adicionar a 20.6(b): "Documento assinado presencialmente em data anterior à assinatura, retido em via única pela CONTRATADA, cópia digital arquivada por ambas. Em caso de divergência, prevalece o Contrato."

#### Gap #3 — Continuidade/handover (CONTRATADA desiste/morre/quebra)
**Status:** 7.3 cobre só rescisão por inadimplemento. Não cobre falecimento, encerramento ME, incapacidade.
**Risco:** padaria fica com site no ar sem manutenção, sem ninguém pra responder LGPD incidente, sem renovação SSL.
**Recomendação:** **Cláusula 12.4 Sucessão Operacional** (faltante #2) — 60d pra sucessor ou devolução automática integral.

#### Gap #4 — Uso AIOS framework / disclosure IA
**Status:** AUSENTE. Sem menção a IA, mind clones, automação.
**Risco:** reputacional (cliente descobre depois), LGPD art. 20 (decisão automatizada), Marco Legal IA (PL 2338/2023), CDC art. 6º III.
**Recomendação:** **Cláusula 1.4 Método de Execução** (faltante #3) — disclosure honesto sob curadoria humana.

#### Gap #5 — Sazonalidade garantia (60d pode pegar inverno baixa)
**Parecer `@patricia-peck`:** 60d corridos é defensável por ser período cravado tecnicamente. Para anchor #1 risco moderado.
**Mitigação opcional:** Cláusula 5.4(c) extra — "Período pode ser estendido em até 30d a critério da CONTRATADA em hipóteses de evento sazonal extraordinário documentado (greve fornecedor, evento climático Defesa Civil Blumenau)".

#### Gap #6 — Cláusula 13.2 lucros cessantes vs CDC art. 6º VI
**Parecer `@patricia-peck`:** 🔴 **DISCORDA da redação atual**. Art. 6º VI CDC é direito básico não derrogável (art. 51 I). Ressalva interna cria conflito interpretativo = juiz pode interpretar como nula por contradição.

**Redação proposta:**
```
13.2. Sem prejuízo do direito da CONTRATANTE à efetiva prevenção e
reparação de danos patrimoniais nos termos do art. 6º, VI, do CDC,
as PARTES reconhecem que a responsabilidade da CONTRATADA, em
qualquer hipótese, não compreende perdas que decorram exclusivamente
de fatores fora do seu controle direto, em especial: condições
macroeconômicas, sazonalidade do mercado da CONTRATANTE, decisões
editoriais de buscadores e plataformas, qualidade ou precificação
de produtos e atendimento da CONTRATANTE. Lucros cessantes serão
devidos quando demonstrado nexo de causalidade direto e exclusivo
entre conduta da CONTRATADA e a perda alegada.
```

#### Gap #7 — Vigência total / renovação automática (mais crítico)
**Status v1:** AUSENTE. 3.3 fixa mensalidade ad eternum.
**Risco:** CDC art. 51 IV (obrigações iníquas) + Dec. 7.962/2013 art. 5º II (duração clara).
**Recomendação:** **Cláusula 12.0 Vigência** (faltante #1) — 12m inicial + renovação opt-in com 45d aviso + 30d janela manifestação.

#### Gap extra A — Marketing pós-contrato
**Status:** 6.2(b) cobre portfólio, mas não case study detalhado, depoimento gravado, palestras, conteúdo educacional.
**Recomendação:** ampliar 6.2(b) com lista exaustiva. Definir como uso "promocional dos serviços", não "comercial geral" (mais protetivo CONTRATANTE).

#### Gap extra B — Lei 9.610 + CC art. 20 (uso de imagem nas fotos)
**Status:** 6.1(c) cessão fotos OK, mas se fotos contêm pessoas há gap.
**Recomendação:** **Cláusula 1.5 Sessão Fotográfica — Direitos de Imagem** (consolidada com Faltante #3).

### 3.5 Top 5 Críticas a Renegociar

#### Crítica #1 — Cláusula 5.6(c) WhatsApp horário comercial

**Problema:** condição cumulativa "manteve respondendo o WhatsApp" transfere obrigação operacional ao consumidor. CDC art. 51 III/IV.

**Redação proposta:**
```
5.6. Condições objetivas de elegibilidade (cumulativas):
 (a) site no ar durante todo o Período de Mensuração;
 (b) não removeu/alterou/desabilitou WhatsApp, GBP ou scripts;
 (c) MANTEVE DECLARAÇÃO DE HORÁRIO DE FUNCIONAMENTO VISÍVEL no site
     e no GBP, atualizada em caso de alteração;
 (d) não realizou alterações fora do escopo sem comunicação prévia;
 (e) adimplente com mensalidades durante o Período.
```

Substitui obrigação de comportamento (responder) por obrigação técnica (manter horário declarado) — verificável objetivamente.

#### Crítica #2 — Cláusula 6.2(b) Direito de imagem nas fotos com pessoas

**Problema:** licencia uso de "Entregáveis" em portfólio. Se fotos contêm pessoas, CC 20 + LGPD + Lei 9.610 exigem consentimento do retratado, não da CONTRATANTE (PJ).

**Adendo proposto:**
```
6.2(b) [...] identificando a CONTRATANTE como cliente, com finalidade
exclusivamente promocional dos serviços da CONTRATADA. PARA FOTOGRAFIAS
QUE CONTENHAM PESSOAS FÍSICAS IDENTIFICÁVEIS (proprietários, funcio-
nários, clientes, terceiros), a inclusão em portfólio depende de
autorização específica de uso de imagem, obtida pela CONTRATANTE
junto às pessoas retratadas em modelo fornecido pela CONTRATADA e
retida em via única pela CONTRATANTE. Sem tal autorização, a
CONTRATADA limitará o uso a fotografias de ambientes e produtos
sem pessoas identificáveis.
```

#### Crítica #3 — Cláusula 8ª LGPD com DPA inexistente

**Problema:** referência a "Anexo I — DPA" como integrante obrigatório, mas o DPA não existe.

**Opção A (preferida `@patricia-peck`):** inserir cláusulas LGPD essenciais no corpo + Anexo I sintético. → **Resolvida no §4 deste relatório.**

**Opção B (workaround):**
```
8.3-bis. As PARTES reconhecem que, na data de assinatura, o DPA
referido no item 8.3 encontra-se em fase final de elaboração e
será firmado em prazo não superior a 30 dias contados desta
assinatura, integrando-se como Anexo I para todos os efeitos.
Enquanto não firmado, aplicam-se as obrigações mínimas dos arts.
6º, 39, 46 a 49 da LGPD diretamente entre as PARTES, com a
CONTRATADA na qualidade de operadora.
```

#### Crítica #4 — Anexos fantasma (20.6)

**Problema:** lista 4 anexos integrantes (DPA, Documento Transparência, Spec plano, Parecer ANPD). NENHUM existe.

**Solução combinada:**

| Anexo | Status | Ação |
|-------|--------|------|
| DPA (I) | ⏳ Pronto neste relatório §4 | Levar ao advogado |
| Documento Transparência (II) | ⏳ Template em `08-legal-templates-draft.md` §1 | Finalizar pré-anchor |
| Spec plano (III) | ❌ Inexistente | Criar 1-pager Essential/Growth/Scale |
| Parecer ANPD (IV) | ❌ Inexistente | Substituir por nota técnica interna 1 página assinada CONTRATADA declarando Pequeno Agente |

#### Crítica #5 — Cláusula 13.2 Lucros cessantes
Já tratada em Gap #6. Reescrita proposta acima.

### 3.6 Top 3 Cláusulas Faltantes

#### Faltante #1 — Vigência total e renovação automática (CRÍTICA)

```
CLÁUSULA 12.0 — VIGÊNCIA

12.0.1. Este Contrato vigora pelo prazo inicial de 12 (doze) meses
contados da data do go-live, renovando-se automaticamente por
períodos sucessivos de igual duração, salvo manifestação contrária
por qualquer das PARTES, comunicada por escrito com antecedência
mínima de 30 (trinta) dias do término do ciclo em curso.

12.0.2. A renovação automática prevista no item 12.0.1 fica condi-
cionada à reafirmação, pela CONTRATANTE, do interesse na continui-
dade, mediante notificação eletrônica enviada pela CONTRATADA com
45 (quarenta e cinco) dias de antecedência do término de cada
ciclo. A ausência de manifestação no prazo de 30 dias da notifi-
cação implica encerramento ao final do ciclo, sem ônus.

12.0.3. As disposições da Cláusula 3.4 (cancelamento ad nutum a
qualquer tempo) permanecem aplicáveis durante toda a vigência,
prevalecendo em caso de conflito.
```

#### Faltante #2 — Sucessão Operacional

```
CLÁUSULA 12.4 — SUCESSÃO OPERACIONAL

12.4.1. Em caso de impossibilidade da CONTRATADA em prosseguir com
a execução do Contrato em razão de encerramento de atividades,
falecimento ou incapacidade civil do representante legal, ou outra
causa supervenientemente justificável, a CONTRATADA (ou sua
sucessão) terá o prazo de 60 (sessenta) dias para:
 (a) indicar prestador substituto qualificado, mediante anuência
     expressa da CONTRATANTE; ou
 (b) realizar a devolução integral, gratuita e completa de todos
     os acessos, credenciais, código-fonte, documentação técnica
     e ativos da Cláusula 7ª, em formato que permita à CONTRATANTE
     contratar livremente outro prestador.

12.4.2. Decorrido o prazo do item 12.4.1 sem solução, a CONTRATANTE
poderá considerar rescindido o Contrato de pleno direito, sem
necessidade de notificação ou interpelação, mantendo a propriedade
dos Entregáveis já entregues.
```

#### Faltante #3 — Método de Execução + Direitos de Imagem (consolidada)

```
CLÁUSULA 1.4 — MÉTODO DE EXECUÇÃO

1.4.1. A CONTRATADA poderá utilizar, na execução dos Entregáveis,
ferramentas de inteligência artificial generativa para auxílio em
redação de conteúdo, geração de imagens conceituais, pesquisa de
mercado e revisão de código, sempre sob curadoria e revisão humana
da CONTRATADA, que permanece responsável integral pela qualidade,
originalidade e adequação dos resultados entregues.

1.4.2. A utilização de IA generativa na execução não autoriza, por
si, divulgação automatizada de dados pessoais da CONTRATANTE ou de
terceiros em ferramentas públicas. Dados serão tratados nos termos
da Cláusula 8ª.

CLÁUSULA 1.5 — SESSÃO FOTOGRÁFICA E DIREITOS DE IMAGEM

1.5.1. A sessão fotográfica prevista no item 1.1(e) será conduzida
por profissional indicado pela CONTRATADA, sendo responsabilidade
da CONTRATANTE:
 (a) franquear acesso ao estabelecimento em data e horário previa-
     mente acordados;
 (b) obter, em modelo escrito fornecido pela CONTRATADA e retido
     pela CONTRATANTE, autorização de uso de imagem de qualquer
     pessoa física identificável que figure nas fotografias (proprie-
     tários, funcionários, clientes, terceiros), nos termos do art. 20
     do Código Civil e da Lei nº 13.709/2018 (LGPD), quando aplicável.

1.5.2. Sem a documentação prevista no item 1.5.1(b), a CONTRATADA
poderá, a seu critério:
 (a) realizar a sessão somente com fotografias de ambientes e
     produtos sem pessoas identificáveis; ou
 (b) excluir das entregas fotografias específicas que contenham
     pessoas sem autorização documentada.
```

### 3.7 13 Perguntas para o Advogado OAB-SC

1. **Súmula 297/STJ jurisprudência catarinense** — confirma aplicação CDC para "ME contratando marketing digital" em TJ-SC? Decisão recente alternativa?
2. **Cláusula 5.6(c) "responder WhatsApp"** — sua leitura de abusividade art. 51 III/IV? Aceita reescrita Crítica #1?
3. **Cláusula 13.1 limitação 12 meses pagos** — jurisprudência TJ-SC últimos 24m? Aceita "ou R$10.000, o que for maior"?
4. **Cláusula 13.2 lucros cessantes** — concorda com risco de nulidade interpretativa? Aceita reescrita por nexo direto/exclusivo (Crítica #5)?
5. **DPA Anexo I** — pode finalizar em 10 dias úteis OU v1.0 sai com adendo "30 dias para firmar"? Recomendação interna: A.
6. **Cláusula vigência (Faltante #1)** — concorda com 12m + renovação opt-in consciente? Há decisão TJ-SC sobre perpetuidade SaaS?
7. **Direito de imagem (Faltante #3)** — modelo de autorização pode ser anexado como Anexo V padrão OU instrumento separado por sessão?
8. **Barter anchor padaria** — pode ser tratado em adendo separado ("Termo de Parceria Anchor" §5), OU exige reescrita Cláusula 3?
9. **Disclosure IA (Faltante #3 item 1.4)** — sua leitura de risco/benefício de incluir proativamente vs aguardar Marco Legal IA?
10. **Sucessão operacional (Faltante #2)** — há precedente TJ-SC para prestação intuitu personae com sucessão automática em 60d?
11. **Anexos fantasma (20.6)** — concorda em editar 20.6 para listar apenas anexos efetivamente prontos?
12. **Numeração e referências cruzadas** — quem normaliza ("X" → "5ª", "▸ baseline:", Cláusula de Definições)?
13. **Honorários e prazo** — valor para v1.1 + DPA + 3 cláusulas faltantes? Estimativa original R$2.5-5k — incremento esperado?

### 3.8 Decisões necessárias do User (D1-D7)

| ID | Decisão | Recomendação |
|----|---------|--------------|
| D1 | Aceita reescrita 5.6(c) (Crítica #1)? | 🟢 SIM — mitigação clara de abusividade |
| D2 | Aceita reescrita 13.2 nexo direto (Crítica #5)? | 🟢 SIM — conflito interno é nulidade preventível |
| D3 | Aceita Cláusula de Vigência 12m + renovação opt-in (Faltante #1)? | 🟢 SIM — é a falha mais crítica do v1 |
| D4 | DPA pronto antes de assinar (Opção A) OU adendo 30d (Opção B)? | 🟢 **Opção A** para anchor #1 (sem pressa real) |
| D5 | Barter anchor em adendo separado? | 🟢 SIM — não contaminar v1 padrão |
| D6 | Disclosure de IA generativa proativo (Faltante #3 item 1.4)? | 🟢 SIM — baixo custo, alta proteção reputacional |
| D7 | Cláusula sucessão operacional (Faltante #2)? | 🟢 SIM — proteção mútua para single founder |

---

## §4 ANEXO I — Acordo de Processamento de Dados (DPA) v1

> **Instrumento integrante e indissociável do Contrato de Prestação de Serviços de Presença Digital firmado entre [Razão Social da CONTRATANTE] e SITE-PROSPECTOR ME, doravante "Contrato Principal".**
>
> **Versão:** 1.0 · **Data-base:** 2026-05-15 · **Status:** Draft submetido ao advogado(a) OAB-SC · **Idioma oficial:** Português (Brasil)

### CONSIDERANDOS

CONSIDERANDO que as PARTES celebraram o Contrato Principal de Prestação de Serviços de Presença Digital, do qual este Acordo constitui Anexo I integrante;

CONSIDERANDO que a execução do Contrato Principal envolve tratamento de dados pessoais, nos termos da Lei nº 13.709/2018 ("LGPD");

CONSIDERANDO que as PARTES adotam o enquadramento de papéis estabelecido na Cláusula 8.2 do Contrato Principal (controladora-operadora-sub-operadores);

CONSIDERANDO que ambas as PARTES se enquadram, na data-base deste Acordo, como Pequenos Agentes de Tratamento de Dados Pessoais, nos termos da Resolução CD/ANPD nº 2, de 27 de janeiro de 2022, sem que tal enquadramento dispense as obrigações materiais do art. 39 da LGPD;

CONSIDERANDO o art. 39 da LGPD, que exige formalização das obrigações do operador perante o controlador;

RESOLVEM as PARTES firmar o presente Acordo de Processamento de Dados ("DPA" ou "Acordo"), regido pelas cláusulas a seguir.

### Cláusula 1ª — Definições

1.1. Os termos abaixo, quando utilizados neste Acordo com inicial maiúscula, terão os significados a seguir atribuídos, em harmonia com o art. 5º da LGPD:

(a) **"Dado Pessoal"** — informação relacionada a pessoa natural identificada ou identificável (LGPD art. 5º, I);
(b) **"Titular"** — pessoa natural a quem se referem os Dados Pessoais (LGPD art. 5º, V);
(c) **"Controlador"** — pessoa a quem competem as decisões referentes ao tratamento (LGPD art. 5º, VI);
(d) **"Operador"** — pessoa que realiza o tratamento em nome do Controlador (LGPD art. 5º, VII);
(e) **"Sub-Operador"** — terceiro contratado pelo Operador para realizar atividades de tratamento;
(f) **"Tratamento"** — toda operação realizada com Dados Pessoais (art. 5º, X, LGPD);
(g) **"Transferência Internacional"** — transferência para país estrangeiro ou organismo internacional (art. 5º, XV);
(h) **"Incidente de Segurança"** — ocorrência que possa acarretar risco ou dano relevante aos Titulares (art. 48);
(i) **"ANPD"** — Autoridade Nacional de Proteção de Dados;
(j) **"Pequeno Agente"** — Resolução CD/ANPD nº 2/2022;
(k) **"Contrato Principal"** — Contrato de Prestação de Serviços de Presença Digital;
(l) **"Fluxos de Tratamento"** — as três operações da Cláusula 3.1;
(m) **"Dados de Tracking"** — identificadores de sessão, cliques, IP pseudonimizado, timestamp, referer;
(n) **"Dados de Formulário"** — nome, telefone, e-mail, mensagem fornecidos pelo Titular ao Controlador via formulário;
(o) **"Dados de WhatsApp"** — número de telefone, conteúdo e metadados das mensagens trocadas via WhatsApp Business.

1.2. Demais termos não definidos terão o significado atribuído pela LGPD, Marco Civil da Internet (Lei 12.965/2014) ou Decreto 8.771/2016.

### Cláusula 2ª — Objeto e Escopo

2.1. Este Acordo regula as obrigações das PARTES no tratamento de Dados Pessoais decorrente da execução do Contrato Principal, em observância à LGPD e normas ANPD aplicáveis.

2.2. O escopo material deste Acordo abrange exclusivamente os Fluxos de Tratamento descritos na Cláusula 3.1. Tratamentos alheios devem ser objeto de instrumento próprio.

2.3. Em caso de conflito quanto a proteção de dados, prevalece este Acordo. Nas demais matérias, prevalece o Contrato Principal.

### Cláusula 3ª — Fluxos de Tratamento e Papéis

3.1. As PARTES adotam os seguintes Fluxos e enquadramentos:

| Ref. | Fluxo | Controlador | Operador | Sub-Operadores |
|------|-------|-------------|----------|----------------|
| (a) | **Tracking de cliques/analytics** no site da CONTRATANTE | CONTRATANTE | CONTRATADA | Vercel; provedor de analytics (Anexo A) |
| (b) | **Formulário de contato** no site | CONTRATANTE | CONTRATADA | Vercel; provedor de e-mail transacional / DB (Anexo A) |
| (c) | **WhatsApp Business** (botão e redirecionamento) | CONTRATANTE | CONTRATADA + Meta | — |

3.2. CONTRATANTE confirma deter base legal própria (art. 7º LGPD) e ter comunicado aos Titulares informações exigidas (art. 9º LGPD) via Política de Privacidade publicada.

3.3. CONTRATADA atua exclusivamente nos limites das instruções documentadas. Instruções verbais não vinculam até serem confirmadas por escrito.

3.4. CONTRATADA notificará a CONTRATANTE caso entenda, com fundamento razoável, que uma instrução viola a LGPD, podendo suspender o cumprimento específico até esclarecimento.

### Cláusula 4ª — Obrigações da Operadora (CONTRATADA)

4.1. CONTRATADA obriga-se a (art. 39 LGPD):

(a) **Finalidade limitada** — tratar exclusivamente conforme instruções documentadas;
(b) **Sigilo** — manter sigilo dos Dados, inclusive após o término;
(c) **Segurança** — adotar medidas técnicas da Cláusula 8ª;
(d) **Registro de operações** — manter ROPA atualizado (art. 37 LGPD), modelo Pequeno Agente;
(e) **Cooperação** — apoiar CONTRATANTE em requisições de Titulares e fiscalização ANPD;
(f) **Comunicação de incidentes** — nos termos da Cláusula 9ª;
(g) **Sub-operadores** — contratar apenas mediante obrigações equivalentes (Anexo A);
(h) **Eliminação** — ao fim do tratamento (Cláusula 10ª);
(i) **Atendimento Titular contatado diretamente** — encaminhar à CONTRATANTE em até 5 dias úteis, sem responder substantivamente;
(j) **Auditabilidade** — manter registros para verificação (Cláusula 12ª).

4.2. **Vedações expressas.** CONTRATADA não poderá:

(a) tratar Dados para perfilamento, scoring, marketing próprio sem instrução escrita;
(b) cruzar Dados de Controladores distintos (ex.: consolidar leads de duas padarias) sem instrumento específico;
(c) transferir a Sub-Operador não listado no Anexo A sem prévia notificação;
(d) reter além dos prazos da Cláusula 10ª, salvo determinação legal.

### Cláusula 5ª — Obrigações da Controladora (CONTRATANTE)

5.1. CONTRATANTE obriga-se a:

(a) **Base legal** — assegurar base válida (art. 7º LGPD) para cada categoria e finalidade;
(b) **Transparência** — manter Política de Privacidade (art. 9º LGPD) publicada em página acessível;
(c) **Consentimento (quando aplicável)** — obter consentimento válido para cookies não-essenciais via banner;
(d) **Atendimento Titulares** — ser interlocutora primária no exercício do art. 18 LGPD, nos prazos legais;
(e) **Encarregado** — designar Encarregado próprio ou contato responsável (Cláusula 11ª);
(f) **Comunicação ANPD e Titulares** — em incidente com risco/dano relevante (art. 48 LGPD);
(g) **Atualização de instruções** — comunicar à CONTRATADA, por escrito, alterações relevantes;
(h) **Direitos de imagem** — obter autorizações de uso de imagem (Cl. 1.5 Contrato Principal) e arquivar pelo prazo legal;
(i) **Não-violação** — abster-se de fornecer Dados Sensíveis (art. 5º, II) ou de menores (art. 14) sem instrução expressa.

### Cláusula 6ª — Sub-Operadores Autorizados

6.1. CONTRATANTE, mediante assinatura deste Acordo e do Anexo A, autoriza CONTRATADA a utilizar os Sub-Operadores listados no **Anexo A** para os Fluxos aplicáveis.

6.2. A autorização estende-se a:
(a) atualizações de versão, sucessão empresarial do Sub-Operador, desde que mantidas as condições materiais;
(b) inclusão de novo Sub-Operador mediante comunicação prévia de 30 dias, com direito de objeção fundamentada por escrito.

6.3. Apresentada objeção fundamentada, PARTES negociarão alternativa em 30 dias. Não havendo, qualquer parte poderá rescindir sem ônus (Cl. 7.3 e 12 do Contrato Principal).

6.4. CONTRATADA mantém-se solidariamente responsável perante CONTRATANTE pelos atos dos Sub-Operadores em proteção de dados, sem prejuízo do regresso.

6.5. CONTRATADA disporá de instrumento contratual escrito com cada Sub-Operador, com obrigações equivalentes, disponibilizado mediante solicitação razoável.

### Cláusula 7ª — Transferência Internacional de Dados

7.1. PARTES reconhecem que parte dos Sub-Operadores está sediada em país estrangeiro (Vercel, Google, Meta — EUA). Tal tratamento caracteriza Transferência Internacional nos termos do art. 33 LGPD.

7.2. **Base legal.** Transferência aos Sub-Operadores do Anexo A é realizada com fundamento em (i) cláusulas-padrão contratuais, na forma do art. 33, II, da LGPD e da Resolução CD/ANPD nº 19, de 23/08/2024, ou em (ii) garantias contratuais equivalentes mantidas pelos próprios Sub-Operadores via seus DPAs publicados.

7.3. **Incorporação por referência.** Os DPAs dos Sub-Operadores listados no Anexo A são incorporados por referência, ficando CONTRATADA responsável por (i) manter cópia arquivada e (ii) disponibilizá-las mediante solicitação razoável.

7.4. **Plano de transição.** Caso ANPD regule requisitos adicionais, ou decisão judicial brasileira inviabilize a continuidade, PARTES negociarão migração em até 90 dias.

7.5. **Vedação.** CONTRATADA não realizará Transferência a destino diverso dos Sub-Operadores listados sem anuência expressa.

### Cláusula 8ª — Medidas Técnicas e Administrativas de Segurança

8.1. CONTRATADA adotará e manterá, calibradas ao porte de Pequeno Agente e ao risco dos Fluxos (art. 46 LGPD + Res. 2/2022):

**Técnicas:**
(a) criptografia em trânsito HTTPS/TLS 1.2+ em todo o site;
(b) criptografia em repouso para Dados em DB gerenciado, conforme provedor;
(c) autenticação multifator (2FA) em contas administrativas, sempre que tecnicamente disponível;
(d) controle de acesso por mínimo privilégio, revisão semestral;
(e) logs de auditoria por no mínimo 6 meses (identificação, data/hora, operação);
(f) backups regulares com teste de restauração semestral;
(g) pseudonimização do IP nos Dados de Tracking quando viável (anonimização GA4 ou equivalente);
(h) atualização tempestiva de bibliotecas e dependências.

**Administrativas:**
(i) política interna de segurança, sintética, escrita, revisada anualmente;
(j) treinamento básico de proteção de dados a prepostos e Sub-Operadores;
(k) plano de resposta a incidentes alinhado à Cláusula 9ª;
(l) procedimento documentado de offboarding de credenciais;
(m) cláusula contratual de confidencialidade e proteção de dados com prepostos e Sub-Operadores.

8.2. Medidas do item 8.1 são **piso, não teto**. CONTRATADA poderá adotar adicionais a seu critério.

8.3. **Inadequação superveniente.** Se medida se tornar inviável, descontinuada ou substituível por padrão superior, CONTRATADA comunicará em prazo razoável e proporá substituição.

### Cláusula 9ª — Incidentes de Segurança

9.1. **Notificação interna entre as PARTES.** Parte que tomar conhecimento de Incidente envolvendo Dados tratados em decorrência do Contrato Principal comunicará a outra, por escrito, em prazo não superior a **48 horas** (Cl. 8.5 do Contrato Principal).

9.2. **Conteúdo mínimo:**
(a) descrição do incidente e natureza dos Dados afetados;
(b) número aproximado de Titulares e registros, quando estimável;
(c) consequências prováveis e medidas adotadas/propostas;
(d) ponto de contato técnico.

9.3. **Avaliação de severidade** em até 5 dias úteis:
(a) **Sem risco relevante** — registro ROPA, sem comunicação externa;
(b) **Risco moderado** — registro ROPA, eventual comunicação a Titulares a critério da CONTRATANTE;
(c) **Risco ou dano relevante** — comunicação obrigatória ANPD + Titulares.

9.4. **Comunicação à ANPD.** Sendo "risco/dano relevante", CONTRATANTE realizará comunicação em prazo razoável (Cl. 9.5), com apoio operacional da CONTRATADA. Elementos técnicos disponibilizados em até 72h da solicitação.

9.5. **Prazo razoável (parâmetro).** PARTES adotam, como parâmetro do art. 48 LGPD, **3 dias úteis** contados da consolidação da severidade, sem prejuízo de prazo distinto pela ANPD.

9.6. **Comunicação a Titulares.** Linguagem clara, art. 9º LGPD; CONTRATADA pode disponibilizar template.

9.7. **Registro.** Todo incidente registrado em livro/planilha mantido por pelo menos 5 anos.

9.8. **Não-confissão.** Comunicação não constitui reconhecimento de culpa (art. 43 LGPD).

### Cláusula 10ª — Retenção e Eliminação

10.1. **Prazos por Fluxo:**

| Fluxo | Categoria | Retenção | Observação |
|-------|-----------|----------|------------|
| (a) Tracking | Cliques agregados, identificadores de sessão | **14 meses** | Padrão GA4. Depois: agregado anonimizado. |
| (a) Tracking | IP pseudonimizado, logs de servidor | **6 meses** | Marco Civil art. 15. |
| (b) Formulário | Nome, telefone, e-mail, mensagem | **12 meses** | Renovável por instrução escrita ou consentimento adicional. |
| (c) WhatsApp | Metadados de clique e redirecionamento (não conteúdo) | **24 meses** | Conteúdo das mensagens fica no WhatsApp da CONTRATANTE + Meta — fora do controle operacional. |

10.2. **Retenção legal** sobrepõe-se a 10.1 (art. 16 LGPD): obrigação legal, decisão judicial, exercício de direitos.

10.3. **Eliminação ao fim do tratamento.** No prazo de 30 dias da rescisão, mediante orientação da CONTRATANTE:
(a) devolver Dados em formato estruturado de uso comum (CSV/JSON);
(b) eliminar todas as cópias remanescentes sob seu controle e dos Sub-Operadores ativos.

10.4. **Declaração de eliminação.** Concluída, CONTRATADA emite declaração escrita identificando eventuais retenções residuais.

10.5. **Pedido individual de eliminação por Titular.** Atendido pela CONTRATANTE; CONTRATADA executa operacionalmente em até 15 dias úteis.

### Cláusula 11ª — Direitos dos Titulares e Encarregado

11.1. **Atendimento primário** pela CONTRATANTE (Controladora).

11.2. **Canais:**
(a) **CONTRATANTE** (legal, primário): [e-mail a preencher]
(b) **CONTRATADA** (operacional, secundário): privacidade@[dominio-site-prospector]

11.3. **Prazo.** CONTRATANTE responde em até 15 dias (art. 18 §5º, II LGPD). CONTRATADA executa operacionalmente em até 7 dias úteis.

11.4. **Designação Encarregado pela CONTRATANTE.** Conforme Anexo B. Pequeno Agente (Res. 2/2022 art. 11) dispensa formalidades, sem dispensar atribuições materiais.

11.5. **Não-cumulatividade.** **CONTRATADA NÃO atuará como Encarregado da CONTRATANTE**, em prevenção a conflito de interesses Operadora-Encarregado. Apoio operacional ao contato responsável, sem assumir a função.

11.6. **Autenticação do Titular.** Procedimento razoável antes do atendimento substantivo.

11.7. **Custo.** Atendimento gratuito (art. 18 §5º LGPD + Decreto 11.964/2024).

### Cláusula 12ª — Auditoria e Transparência

12.1. **Direito de verificação.** CONTRATANTE pode, com 30 dias de antecedência:
(a) frequência máxima 1×/ano, salvo Incidente ou ANPD;
(b) escopo limitado aos Fluxos e Dados da CONTRATANTE;
(c) preferencialmente questionário documental + evidências (ROPA, logs sumarizados);
(d) auditoria presencial só em incidente classificado "risco/dano relevante" (Cl. 9.3(c)) não esclarecido por documentação;
(e) custos da solicitante, salvo descumprimento material — reembolso.

12.2. **Confidencialidade** (Cl. 9ª do Contrato Principal).

12.3. **Substituição por certificações.** Apresentação de ISO 27001 do provedor, SOC 2 do Sub-Operador supre obrigação documental específica.

### Cláusula 13ª — Vigência, Alterações e Disposições Finais

13.1. **Vigência** pelo prazo do Contrato Principal. Após término, permanecem: eliminação (Cl. 10), sigilo (Cl. 4.1(b)) e registro de incidentes (Cl. 9.7).

13.2. **Alterações** por aditivo escrito assinado. Operacionais (Anexo A, canais) por troca de correspondência eletrônica.

13.3. **Revisão obrigatória** em até 60 dias de:
(a) alteração relevante da LGPD ou ANPD;
(b) alteração de enquadramento Pequeno Agente (Cl. 8.4 Contrato);
(c) Incidente classificado "risco/dano relevante".

13.4. **Solidariedade limitada** observa art. 42 LGPD, sem prejuízo Cl. 13 Contrato e regresso.

13.5. **Foro** — Cl. 16ª Contrato Principal (Blumenau/SC com ressalva consumerista).

13.6. **Lei aplicável** — LGPD; Marco Civil; Decreto 8.771/2016; Res. CD/ANPD 2/2022 (Pequenos Agentes); Res. 15/2024 (incidentes — se vigente); Res. 19/2024 (transferência internacional).

13.7. **Anexos integrantes:**
(a) **Anexo A** — Lista de Sub-Operadores Autorizados;
(b) **Anexo B** — Designação de Encarregado / Contato Responsável da CONTRATANTE.

### ANEXO A — Lista de Sub-Operadores Autorizados (v1.0 — 2026-05-15)

| # | Sub-Operador | Sede | Finalidade | Fluxo(s) | Base TI | DPA de referência |
|---|--------------|------|-----------|----------|---------|-------------------|
| A1 | **Vercel Inc.** | EUA (Delaware) | Hospedagem, edge, logs | (a) Tracking; (b) Formulário | SCC + DPA Vercel | https://vercel.com/legal/dpa |
| A2 | **Google LLC** — GBP/Maps/Search Console | EUA (CA) | Perfil de empresa, indexação | (a) Tracking indireto via GBP | SCC + DPA Google | https://privacy.google.com/businesses/processorterms |
| A3 | **Analytics** — [GA4 OU PostHog] | EUA (a confirmar) | Métricas de uso, eventos | (a) Tracking | SCC + DPA provedor | ⏳ A definir Breno 5d úteis |
| A4 | **Meta Platforms** | EUA (CA) | Redirecionamento WhatsApp | (c) WhatsApp | SCC + Termos WhatsApp Business | https://www.whatsapp.com/legal/business-data-transfer-addendum |
| A5 | **Backend** — [Resend+Supabase OU Vercel KV/Postgres] | EUA ou BR | Persistência formulários, notificações | (b) Formulário | SCC + DPA provedor (ou ausência se BR) | ⏳ A definir Breno 5d úteis |
| A6 | **Fotógrafo profissional** | Brasil — Blumenau/SC | Sessão fotográfica (Cl. 1.5 Contrato) | Direitos de imagem | N/A (Brasil) | Termo de confidencialidade |

**Observações:**
1. A3 e A5 dependem de escolha técnica final, fixados em comunicação escrita em até 5 dias úteis pós go-live (Cl. 6.2(b));
2. Substituição/inclusão segue Cl. 6.2(b);
3. CONTRATADA mantém cópia atualizada dos DPAs vendor.

### ANEXO B — Designação de Encarregado / Contato Responsável (v1.0)

**CONTRATANTE** (Cl. 11.4 + Res. ANPD 2/2022 art. 11):
- Nome: _________________________________
- Função / cargo: _________________________________
- E-mail: _________________________________
- Telefone: _________________________________

**CONTRATADA** (contato operacional, não-Encarregado da CONTRATANTE):
- Nome: Breno [Sobrenome]
- Função: Sócio-administrador / contato operacional de privacidade
- E-mail: privacidade@[dominio-site-prospector]
- Telefone: (a preencher)

### 4.X — Memo de Decisões-Chave do DPA

#### 4.X.1 — Sete PECK-AUTO-DECISIONS

| # | Decisão | Alternativa rejeitada | Por quê |
|---|---------|----------------------|---------|
| D1 | **DPA robusto, não simplificado** | Versão Pequeno Agente enxuta (3-4p) | Res. 2/2022 simplifica ROPA/DPO/comunicações, NÃO simplifica art. 39 LGPD. Robusto é defensável em audit ANPD + mudança de porte (Cl. 8.4 contrato) economiza reescrita |
| D2 | **SCCs (Res. 19/2024) + DPAs vendor por referência** (art. 33, II) | Consentimento Titular / Adequação ANPD / Cláusulas específicas custom | Vercel/Google/Meta publicam DPAs SCC-equivalentes aceitos por milhões. ANPD publicou template oficial out/2024. Caminho mais defensável em 2026 |
| D3 | **CONTRATANTE designa próprio Encarregado**, CONTRATADA não acumula | CONTRATADA assume DPO temporário | Conflito estrutural Operadora-Encarregado. Pequeno Agente dispensado de designação formal (Res. 2/2022 art. 11) |
| D4 | **Sub-operadores: pré-autorização lista Anexo A + 30d notificação** | (a) Anuência caso a caso; (b) Anuência genérica sem lista | Equilibra eficiência + transparência. Espelha GDPR Art. 28(2)(d) "general written authorisation" |
| D5 | **Retenção por Fluxo: 14m/12m/24m/6m** | Uniforme 24m (overretention forms) ou mínima 6m (sem analytics ano-a-ano) | Cada Fluxo tem finalidade distinta (art. 6º V LGPD). 14m alinha cookie GA4 |
| D6 | **Não-cumulatividade explícita: CONTRATADA NÃO Encarregado** | Cláusula silente | Reforça D3, fecha gap interpretativo. Padaria pode pedir DPO informal — explicitar vedação evita pressão |
| D7 | **Template canonizável (Susskind)** — 7 variáveis abstraídas | DPA customizado por cliente | Stage 1 paid prevê N clientes. Custo legal de redraft mata economia unitária. Variáveis: (i) razão social CONTRATANTE, (ii) A3 analytics, (iii) A5 backend, (iv) sub-ops setoriais, (v) sobreescritas de retenção, (vi) contato Encarregado, (vii) data |

#### 4.X.2 — Top 5 Risk-flags pro advogado OAB-SC

1. **Cláusula 7ª Transferência Internacional vs jurisprudência catarinense** — TJ-SC consolidou suficiência de SCC + DPA vendor para Pequeno Agente? Vale anexar cópia física dos DPAs vendor como "Anexo A-bis"?
2. **Cláusula 9.5 "prazo razoável" 3 dias úteis para ANPD** — Res. CD/ANPD 15/2024 (se promulgada) pode fixar prazo distinto. Vale "prazo mais célere entre 3 dias úteis e o vigente fixado pela ANPD"?
3. **Cláusula 6ª Sub-Operadores pré-autorização vs doutrina conservadora** (Mulholland, Peck pós-2023) — TJ-SC tem precedente sobre suficiência de pré-autorização genérica? Alternativa: consentimento expresso por e-mail por cada novo Sub-Operador (15d)
4. **Cláusula 11.5 Não-cumulatividade Encarregado vs Operadora** — risco está em advogado/cliente quererem REMOVER. **Manter.**
5. **Cláusula 10.1 Retenção 14m Tracking vs PoP cliente template** (`08-legal-templates-draft.md` §4 fala "12-24m") — harmonizar PoP para refletir números deste DPA

#### 4.X.3 — Ajustes "TJ-SC-friendly" que advogado pode propor

1. Glossário Cl. 1ª — ordem alfabética vs temática (cosmético)
2. Cl. 4.2 "Vedações" — "não poderá" vs "obriga-se a não" (cosmético)
3. Cl. 6.4 Solidariedade Sub-Operador — "solidária" vs "objetiva" (mesma proteção)
4. Cl. 9.4 Apoio operacional comunicação ANPD — manter como está (evita confusão de responsabilidade formal)
5. Cl. 12.1(d) Auditoria presencial — flexibilizar para "incidente moderado a relevante" (aceitável)
6. Cl. 13.6 Res. 15/2024 — manter "se vigente"; advogado confirma status na assinatura
7. Anexo A — A3 e A5 fechados antes da assinatura

#### 4.X.4 — Cross-references com Contrato Principal

| DPA refere | Contrato Principal | Status |
|------------|-------------------|--------|
| Considerandos (Pequeno Agente) | Cl. 8.4 + Anexo IV (Parecer) | Anexo IV inexistente → substituir por nota técnica 1-pager |
| Cl. 2.3 prevalência DPA em dados | Cl. 8.3 + Cl. 20.4 | Compatível |
| Cl. 5.1(h) Direitos de imagem | Cl. 1.5 (Faltante #3 — proposta no §3.6) | Pendente v1.1 |
| Cl. 6.3 Rescisão por objeção Sub-Op | Cl. 7.3 + 12 | Compatível |
| Cl. 9.1 Notificação 48h | Cl. 8.5 | Compatível (espelha) |
| Cl. 11.7 Atendimento gratuito | (DPA-only) | OK |
| Cl. 12.2 Confidencialidade | Cl. 9ª | Compatível |
| Cl. 13.4 Solidariedade art. 42 LGPD | Cl. 13 (sob revisão Crítica #5) | Validar coerência pós-reescrita 13.2 |
| Cl. 13.5 Foro | Cl. 16ª | Compatível |

#### 4.X.5 — Anotações estruturais

**`@heather-meeker` (General Counsel review):** estrutura sólida, 13 cláusulas + 2 anexos é proporcional ao caso. Único alerta: considerar adicionar cláusula de "assistência sob requisição da ANPD" — coberto implicitamente pela 4.1(e), mas explícito facilita resposta sob pressão:

```
4.1(e)-bis. Em caso de requisição formal da ANPD dirigida à
CONTRATANTE relacionada aos Fluxos de Tratamento, a CONTRATADA
disponibilizará as informações técnicas e operacionais sob seu
controle necessárias à resposta, em prazo razoável definido pela
CONTRATANTE em consonância com o prazo da requisição.
```

**`@richard-susskind` (legal tech automation):** template de alto valor para o pipeline. Recomendação: (a) versionar em repositório dedicado `docs/legal/templates/dpa/`; (b) abstrair as 7 variáveis em frontmatter; (c) changelog público interno; (d) ROI estimado: cada novo cliente economiza R$ 800-1.500 vs redraft. Em Stage 1 paid (12+ clientes/ano), economia bruta ~R$ 10-18k/ano vs custo de manutenção ~R$ 1.5-3k/ano. Margem positiva clara.

---

## §5 ANEXO — Termo de Parceria Anchor v1.0

> **Versão:** 1.0 — minuta para revisão OAB-SC antes de assinatura
> **Data:** 2026-05-15
> **Autoria técnica:** Legal Chief + `@heather-meeker` (drafting estrutural) + `@patricia-peck` (CDC/LGPD/PROCON)
> **Vinculação:** documento **ACESSÓRIO** ao "Contrato de Prestação de Serviços de Presença Digital" (v1.x) — não o substitui
> ⚠️ Variáveis em [colchetes] devem ser preenchidas. Notas `▸ heather:` / `▸ peck:` removidas na versão de assinatura.

### Qualificação das Partes

**CONTRATADA / PARCEIRA OPERACIONAL:** SITE-PROSPECTOR, [razão social ME a definir], CNPJ [______], sede em [endereço], Blumenau/SC, CEP [_____], rep. por BRENO [SOBRENOME], CPF [_______]. Doravante **SITE-PROSPECTOR**.

**CONTRATANTE / ANCHOR:** [RAZÃO SOCIAL DA PADARIA/CONFEITARIA], CNPJ [_______], sede em [endereço], Blumenau/SC, CEP [_____], rep. por [NOME], CPF [_______]. Doravante **ANCHOR**.

### Considerandos (Whereas)

CONSIDERANDO que SITE-PROSPECTOR é projeto comercial em fase de validação piloto pré-Stage-1, com data interna de revisão crítica em 09 de junho de 2026, e necessita validar metodologicamente o pacote "Presença Digital Local Premium" antes do lançamento comercial pleno (R$ 3.497 setup + R$ 247/mês Growth);

CONSIDERANDO que a ANCHOR é estabelecimento em Blumenau/SC no segmento [padaria/confeitaria artesanal], com base de clientes e operação real adequados à validação da metodologia em condições reais de mercado;

CONSIDERANDO que ambas as PARTES manifestam interesse legítimo e recíproco em parceria de **co-construção e validação**, na qual cada parte traz contribuições próprias mensuráveis, sem que se configure: (i) liberalidade ou doação de serviço pela SITE-PROSPECTOR; (ii) venda casada ou condicionamento abusivo (CDC art. 39, I); (iii) hipossuficiência abusivamente explorada;

CONSIDERANDO que a ANCHOR detém conhecimento operacional do seu segmento, cuja contribuição como testimonial, autorização de uso de imagem do estabelecimento e cobertura editorial em case study possui **valor estratégico legítimo e específico** para SITE-PROSPECTOR, reconhecido pelas PARTES como contrapartida economicamente mensurável (item 3.3 abaixo);

CONSIDERANDO que o status de "anchor" é público, transparente e não dissimulado — afastando alegações de tratamento privilegiado dissimulado;

CONSIDERANDO que o presente Termo regula instrumento **acessório e separado** do Contrato Principal, sem contaminar a aplicabilidade comercial padrão;

RESOLVEM as PARTES celebrar este Termo.

### Cláusula 1ª — Objeto e Natureza Jurídica

1.1. Objeto: estabelecer **modalidade especial de execução** do Contrato Principal, em condição de **Caso Piloto nº 1 — Anchor**, mediante:
(a) prestação pela SITE-PROSPECTOR à ANCHOR dos mesmos Entregáveis (Cl. 1ª Contrato Principal), mesmas exigências técnicas (Lighthouse mobile ≥ 90, WCAG 2.1 A, Vercel);
(b) prestação pela ANCHOR à SITE-PROSPECTOR das **contrapartidas não-monetárias** da Cláusula 5ª;
(c) condição econômica diferenciada e temporária (Cláusula 3ª).

1.2. **Natureza jurídica.** Contrato **bilateral, oneroso, comutativo e atípico**. NÃO configura doação, liberalidade ou prestação gratuita.

1.3. **Remissão ao Contrato Principal.** Salvo modificações expressas (Cl. 4-8 + 12 deste Termo), aplicam-se integralmente as cláusulas do Contrato Principal: garantia legal (4ª), licenciamento (6ª), titularidade (7ª), LGPD (8ª), confidencialidade (9ª), SLA (14ª), foro (16ª).

1.4. **Conflito interpretativo.** Em caso de conflito, **prevalece a interpretação mais favorável à ANCHOR** (art. 422 CC + art. 47 CDC), independente do enquadramento técnico final da relação.

### Cláusula 2ª — Vigência e Período Anchor

2.1. **6 meses contados do go-live** = "Período Anchor".

2.2. Ao término encerra-se o regime econômico diferenciado (Cl. 3ª) sem aviso. Demais disposições do Contrato Principal seguem padrão.

2.3. Vigência do Contrato Principal não é afetada — segue Cl. 12.0 v1.1.

### Cláusula 3ª — Contraprestação Monetária da ANCHOR

3.1. Pela prestação dos Entregáveis em modalidade Anchor, ANCHOR pagará **R$ 1.000,00** à vista no ato da assinatura, via PIX ou boleto.

3.2. **Disclosures art. 52 CDC + Decreto 7.962/2013:**
(a) preço total à vista: R$ 1.000,00;
(b) modalidade: pagamento único, sem parcelamento;
(c) taxa de juros: 0,00% a.m.;
(d) acréscimo financeiro: R$ 0,00.

3.3. **Reconhecimento expresso de valor de mercado.**
(a) Valor de mercado público pleno: **R$ 3.497,00 setup + R$ 247,00/mês Growth recorrente**;
(b) Contrapartida monetária reduzida (R$ 1.000,00) reflete contribuição parcial em pecúnia, complementada pela contrapartida não-monetária da Cláusula 5ª como contraprestação adicional, formando contraprestação total economicamente equivalente;
(c) Valor de mercado da contrapartida não-monetária estimado conjuntamente em **R$ 2.497,00** + equivalente a **6 mensalidades do Growth**, totalizando R$ 3.979,00 — referencial entre as PARTES, sem vincular terceiros, autoridades fiscais ou judiciais;
(d) SITE-PROSPECTOR cumpre obrigações tributárias conforme orientação contábil própria.

3.4. **Mensalidade recorrente isenta** durante Período Anchor (6 meses pós go-live).

### Cláusula 4ª — Benefícios Anchor

4.1. Além da contrapartida monetária, ANCHOR tem direito durante e em razão do Período:
(a) **Isenção mensalidade Growth** × 6 meses (valor referência: R$ 247 × 6 = R$ 1.482);
(b) **Prioridade operacional** — prazos de suporte da Cl. 14.3 do Contrato Principal **reduzidos em 50%** (incidentes críticos 4h → 2h úteis);
(c) **Revisão metodológica conjunta** ao final dos meses 2 e 4 (até 90 min cada, pauta aberta);
(d) **Direito de migração privilegiada pós-anchor** (Cl. 6ª).

### Cláusula 5ª — Contraprestação Não-Monetária da ANCHOR

5.1. **Natureza obrigacional.** Prestações da ANCHOR nesta Cláusula são **obrigações contratuais firmes**, exigíveis pela SITE-PROSPECTOR. NÃO condição implícita ou favor. Testimonial + autorização de imagem + cobertura editorial integram o sinalagma desta parceria.

5.2. **Testimonial em vídeo** — até **90 dias após go-live**:
(a) duração: 60s mín, 5min máx;
(b) conteúdo mínimo obrigatório, autêntico e não-roteirizado:
 (i) identificação ANCHOR + segmento;
 (ii) relato de uso real;
 (iii) descrição factual de resultados, sejam positivos, neutros ou inclusive críticos;
 (iv) declaração de autorização para uso (item 5.5);
(c) **Vedações:**
 (i) SITE-PROSPECTOR **não exigirá conteúdo elogioso específico**, frases pré-escritas, superlativos forçados — sob pena de descaracterizar o testimonial e configurar publicidade enganosa (CDC art. 37 + CONAR);
 (ii) inclusão de críticas/ressalvas factuais é legítima e não descaracteriza cumprimento;
(d) **Recusa fundamentada.** Se ao final do prazo ANCHOR julgar de boa-fé que serviço não atende seu critério razoável para qualquer recomendação pública, comunicação por escrito → aplica-se Cl. 7ª (janela 30d).

5.3. **Autorização de uso de imagem do estabelecimento.** ANCHOR autoriza, em caráter específico, escrito e oneroso (em troca dos benefícios da Cl. 4ª):
(a) **Objeto:** fotografias e vídeos do **estabelecimento físico** (fachada, ambiente, balcão, vitrine, produtos);
(b) **Pessoas físicas identificáveis NÃO abrangidas** — aplica-se item 1.5 Contrato Principal + Anexo I deste Termo;
(c) **Prazo:** **24 meses** a partir da assinatura, prorrogável por períodos sucessivos de 12 meses mediante anuência expressa;
(d) **Territórios:** Brasil, ênfase Blumenau/SC + Vale do Itajaí, e demais territórios onde SITE-PROSPECTOR opere;
(e) **Mídias autorizadas:** site institucional + redes sociais + apresentações comerciais + materiais educacionais + case study + co-marketing pré-acordado;
(f) **Finalidades vedadas:** contexto difamatório/depreciativo, revenda a terceiros não relacionados, edição que induza em erro consumidores;
(g) **Revogabilidade.** **Revogável a qualquer tempo** mediante notificação escrita, **com efeito prospectivo** — não atinge usos já realizados; SITE-PROSPECTOR interrompe novos usos em 30d (online) / 90d (impressos). Revogação não dá direito à devolução de benefícios já usufruídos.

5.4. **Cobertura editorial em case study:**
(a) **Conteúdo permitido:** descrição do processo, metodologia, resultados técnicos (cliques, eventos sem dados pessoais), antes/depois, depoimento com aprovação prévia;
(b) **Aprovação prévia da ANCHOR**, com 7 dias úteis: aprovar / solicitar correções factuais demonstráveis / solicitar remoção de info comercialmente sensível com justificativa razoável (resposta em 5d úteis);
(c) **Limitação ao direito de revisão** — não constitui censura editorial absoluta; ANCHOR não pode vetar publicação por motivos não-fundamentados;
(d) **Dados sensíveis dos clientes finais da ANCHOR** — case study NÃO conterá nomes, telefones, e-mails ou dados de identificação de clientes (LGPD + DPA Cl. 8ª Contrato).

5.5. **Recomendação ativa — facultativa.** ANCHOR **não é obrigada** a recomendar ativamente. Se opte por recomendar e contrato resultante for fechado e adimplido nos primeiros 90 dias: bônus de **R$ 200,00** em crédito por mensalidade futura ou pagamento em pecúnia, à escolha da ANCHOR, por cada novo contrato. Não-recomendação não constitui inadimplemento.

### Cláusula 6ª — Direitos Pós-Anchor

6.1. **Migração ao término do Período Anchor (mês 6):**
(a) **Migração privilegiada Growth ex-anchor:** continuidade Growth a **R$ 173,00/mês** (30% desconto) durante **12 meses subsequentes**, depois preço público pleno;
(b) **Plano Essential** (R$ 149/mês) ao preço público padrão;
(c) **Plano Scale** (R$ 397/mês) ao preço público padrão;
(d) **Encerramento** por aviso 30d, com Cl. 7ª Contrato Principal (devolução credenciais) + Cl. 12.4 (sucessão se aplicável).

6.2. **Manifestação de opção.** SITE-PROSPECTOR notifica com **45 dias** de antecedência do término; ANCHOR tem **30 dias** para manifestar. Ausência = opção (d) — encerramento sem ônus.

6.3. **Manutenção dos Entregáveis** — Cl. 6ª (licenciamento perpétuo) + Cl. 7ª (titularidade) do Contrato Principal aplicam-se integralmente.

### Cláusula 7ª — Janela de Resolução Amigável e Proteção Reputacional Bilateral

7.1. Antes que qualquer das PARTES manifeste publicamente **expressão negativa, depreciativa ou crítica** sobre a outra (redes sociais, reviews públicos, declarações imprensa, denúncias administrativas, ações judiciais não-urgentes), parte que se considere prejudicada notificará a outra por escrito (e-mail + WhatsApp), expondo:
(a) fatos problemáticos;
(b) remediação pleiteada;
(c) prazo razoável de resposta, **não inferior a 30 dias corridos**.

7.2. **Aplica-se reciprocamente** — protege SITE-PROSPECTOR contra testimonial reverso E ANCHOR contra exposição comercial de insatisfação.

7.3. **Exclusões legítimas** (não se aplicam à obrigação de 7.1):
(a) comunicações urgentes a autoridades de proteção de dados (art. 48 LGPD prevalece);
(b) denúncias a órgãos de defesa do consumidor com risco a novos consumidores;
(c) medidas judiciais urgentes (tutela de urgência) com risco de perecimento de direito;
(d) reviews públicos em plataformas (Google, ReclameAqui) APÓS decurso integral de 30 dias sem composição razoável.

7.4. **Efeito.** Inobservância injustificada de 7.1 não impede manifestação per se (direito constitucional), mas é elemento de aferição de boa-fé.

### Cláusula 8ª — LGPD Aplicada ao Testimonial, Imagens e Case Study

8.1. **Bases legais:**
(a) **art. 7º V LGPD** (execução de contrato) — dados estritamente necessários;
(b) **art. 7º IX LGPD** (interesse legítimo) — uso em portfólio/comerciais, com LIA documentado;
(c) **art. 7º I LGPD** (consentimento) — pessoas físicas identificáveis publicamente expostas (Anexo I).

8.2. **Direitos do titular** — art. 18 LGPD: acesso, correção, eliminação com consentimento, **revogação prospectiva** (item 5.3(g)).

8.3. **DPA aplicável.** Fluxo de tratamento específico (vídeo testimonial, fotos, case study) integra DPA Anexo I do Contrato Principal, com tratamento em apartado conforme Anexo II deste Termo (a firmar em até 15 dias).

8.4. **Salvaguarda em caso de Anexo II não-firmado** — aplicam-se diretamente arts. 6º, 39, 46 a 49 LGPD, com SITE-PROSPECTOR operadora dos dados da ANCHOR e controladora dos dados de uso institucional próprio.

### Cláusula 9ª — Tributação e Emissão de Nota Fiscal

9.1. **Emissão de NFS-e.** SITE-PROSPECTOR emitirá NFS-e à ANCHOR no valor de **R$ 1.000,00** (item 3.1), conforme regramento ISS Blumenau e regime tributário aplicável (Simples Nacional).

9.2. **Tratamento contábil-tributário do diferencial.** Diferencial R$ 3.979,00 entre valor de mercado público (R$ 4.979,00) e efetivamente pago (R$ 1.000,00) será tratado como **bonificação publicitária com lastro contratual neste Termo**, registrado no livro caixa da ME como contrapartida de valor não-monetário recebido sob forma de testimonial, autorização de imagem e cobertura editorial (Cl. 5ª).

9.3. **Não-configuração de permuta de serviços.** PARTES reconhecem que contrapartida não-monetária da Cl. 5ª, embora dotada de valor econômico legítimo (Cl. 3.3(c)), **não constitui prestação de serviço da ANCHOR à SITE-PROSPECTOR** no sentido tributário do art. 1º LC 116/2003. ANCHOR não exerce atividade econômica regular de "fornecimento de testimoniais", "cessão de imagem comercial" ou "produção de case studies" — trata-se de **contribuição não-onerosa em sentido tributário**, embora **onerosa em sentido civil**.

9.4. **Riscos próprios.** Cada parte assume integralmente seus tributos. Em caso de fiscalização requalificar, cada parte responde sem regresso, salvo dolo/culpa grave na orientação inicial.

### Cláusula 10ª — Saída Antecipada e Efeitos

10.1. **Saída antecipada pela ANCHOR** — aviso prévio escrito de 30 dias, sem multa.

10.2. **Efeitos prospectivos:**
(a) Entregáveis já entregues permanecem propriedade da ANCHOR (Contrato Principal);
(b) SITE-PROSPECTOR mantém testimonial e cobertura já produzidos, respeitada revogabilidade prospectiva (5.3(g));
(c) cessa isenção de mensalidade — migração para um dos planos da 6.1 a partir do ciclo seguinte;
(d) setup R$ 1.000 não é restituído, salvo descumprimento essencial da SITE-PROSPECTOR sem composição (Cl. 7);
(e) ANCHOR perde benefícios futuros não-usufruídos.

10.3. **Saída antecipada pela SITE-PROSPECTOR** — só por: (a) descumprimento essencial pela ANCHOR após decurso do prazo de boa-fé do item 7; (b) impossibilidade operacional (Cl. 12.4 Contrato v1.1); (c) consenso mútuo.

10.4. **Indenização recíproca.** Saídas antecipadas não geram dever de indenização per se, salvo descumprimento culposo demonstrado (Cl. 13 Contrato Principal).

### Cláusula 11ª — Não-Exclusividade e Programa Anchor

11.1. SITE-PROSPECTOR pode estabelecer parcerias análogas com **outros estabelecimentos** no mesmo ou em diferentes segmentos, durante e após o Período Anchor.

11.2. **Programa Anchor SITE-PROSPECTOR — Caso Piloto.** Opera **até 3 anchors simultâneos** em fase piloto pré-Stage-1, sendo este Termo o **Caso Piloto nº 1**. Anchors #2 e #3 podem operar em diferentes segmentos ou no mesmo, sem que isso constitua descumprimento, conflito ou tratamento privilegiado dissimulado.

11.3. **Transparência pública.** SITE-PROSPECTOR pode publicar lista de anchors em seu site institucional.

11.4. **Confidencialidade entre anchors.** Dados específicos da operação (vendas, faturamento, métricas internas) cobertos pela Cl. 9ª (Confidencialidade) — não compartilhados com outros anchors ou prospects.

### Cláusula 12ª — Foro e Lei Aplicável

12.1. Aplicam-se integralmente Cl. 16ª (foro Blumenau/SC + ressalva consumerista), 17ª (lei aplicável) e 18ª (veto arbitragem CDC) do Contrato Principal.

12.2. **Reafirmação consumerista.** Caso este Termo seja considerado relação consumerista (Súmula 297/STJ), prevalece direito da ANCHOR ao foro de domicílio, inversão do ônus quando aplicável (art. 6º VIII CDC) e demais direitos do art. 6º.

### Cláusula 13ª — Disposições Gerais

13.1. **Anexos integrantes:**
(a) **Anexo I — Modelo de Autorização Individual de Uso de Imagem** (item 5.3(b));
(b) **Anexo II — DPA específico para fluxo testimonial + imagens + case study** (a firmar em até 15 dias).

13.2. **Comunicações** — Cl. 20.1 Contrato Principal (e-mail + WhatsApp cadastrados).

13.3. **Assinatura eletrônica** — Cl. 19ª Contrato Principal (MP 2.200-2/2001 + Lei 14.063/2020).

13.4. **Cessão** — **intuitu personae para AMBAS as PARTES**, ressalvada sucessão empresarial regular.

13.5. **Autonomia das cláusulas.**

13.6. **Integralidade** — este Termo + Contrato Principal + Anexos.

---

**Blumenau, ___ de _________________ de 2026.**

\_______________________________________
**SITE-PROSPECTOR** — Breno [Sobrenome] — CPF [_______]

\_______________________________________
**ANCHOR** — [Nome] — CPF [_______]

**Testemunhas:**
1) Nome: ________________________ CPF: ____________ Assinatura: ________________
2) Nome: ________________________ CPF: ____________ Assinatura: ________________

### ANEXO I — Modelo de Autorização Individual de Uso de Imagem (placeholder)

> Modelo a ser assinado individualmente por cada pessoa física identificável que apareça em fotos/vídeos da Cláusula 5ª. **Modelo padrão completo a ser desenvolvido pelo advogado(a) OAB-SC.**
>
> **Conteúdo mínimo:** qualificação completa do retratado; descrição específica das imagens (data, local, contexto); finalidades autorizadas (lista taxativa); prazo (24m prorrogáveis); territórios; mídias; direito de revogação prospectiva (art. 18 LGPD + CC 20); onerosidade/gratuidade; foro e lei.

### ANEXO II — DPA Testimonial/Imagens/Case Study (placeholder)

> Acordo de Processamento de Dados específico para esta parceria. **A firmar em até 15 dias** após a assinatura deste Termo. **Conteúdo mínimo:** identificação controlador/operador por fluxo; base legal por categoria; medidas técnicas e administrativas; prazos de retenção de imagens e vídeos; comunicação de incidentes (48h Cl. 8.5); atendimento titulares; subcontratados específicos.

### 5.X — Risk Memo do Termo Anchor

#### 5.X.1 — Verdict

**ASSINÁVEL após validação OAB-SC + contador, com 5 atenções operacionais críticas.**

Arquitetura contratual deliberada mitiga 6 superfícies de risco: venda casada, dação em pagamento, direito de imagem, PROCON, concorrência desleal, reputação bilateral.

Riscos residuais não-zeráveis (mitigação operacional, não-contratual): requalificação tributária pela RF/ISS Blumenau, eventual retratação do testimonial antes do prazo, jurisprudência TJ-SC oscilante.

#### 5.X.2 — Top 5 Risk Flags

```
🔴 RISK #1 — Requalificação tributária como permuta (CRÍTICA)
  Cenário: RF/ISS Blumenau requalifica Cl. 9 como permuta
           LC 116/2003 + SC RFB 8/2014 + SC Cosit 166/2019
  Consequência: ANCHOR autuada não-emissão NFS-e R$ 3.979
                + SITE-PROSPECTOR escritura receita adicional
                Total exposição: R$ 400-800 tributos + multa 75-150%
  Mitigação minuta: Cl. 3.3(c)(d) + Cl. 9.3 + Cl. 9.4
  Mitigação operacional: contador profissional + dossiê de defesa
  Severidade pós: MODERADA

🟠 RISK #2 — Testimonial como venda casada CDC art. 39 I (ALTA)
  Cenário: ANCHOR/PROCON alegam testimonial forçado
  Consequência: nulidade Cl. 5ª → ANCHOR fica com serviço sem
                contrapartida → desnatura sinalagma → reativa RISK #1
                + multa PROCON Blumenau
  Mitigação minuta: Considerandos densos + Cl. 1.2 + Cl. 5.1
                    + Cl. 5.2(c) (proíbe elogio forçado) + Cl. 5.5
  Mitigação operacional: gravar pitch oral pré-assinatura;
                         nunca "se não gravar, perde tudo";
                         sempre usar linguagem Cl. 7 (janela 30d)
  Severidade pós: MODERADA-BAIXA

🟠 RISK #3 — Revogação tardia uso imagem (ALTA)
  Cenário: ANCHOR revoga após case study amplamente publicado
  Consequência: remoção 30d/90d + custos re-edição
                + perda prova social principal mid-pilot
  Mitigação minuta: Cl. 5.3(g) revogação prospectiva + prazos
                    escalonados
  Mitigação operacional: versionamento de materiais com nome
                         do anchor; relação cordial mid-period;
                         acionar Cl. 7 ao primeiro sinal
  Severidade pós: MODERADA

🟡 RISK #4 — Concorrência desleal alegada (MODERADA)
  Cenário: padaria rival denuncia tratamento privilegiado
           dissimulado / publicidade comparativa abusiva
  Consequência: procedimento administrativo + dano reputacional
  Mitigação minuta: Cl. 11.2 Programa público + Cl. 11.3
                    + Considerandos (fase piloto, 3 anchors,
                    09/Jun deadline)
  Mitigação operacional: página pública "Programa Anchor 2026";
                         critério objetivo de seleção documentado
  Severidade pós: BAIXA

🟡 RISK #5 — Testimonial reverso / exposição unilateral (MODERADA)
  Cenário: ANCHOR insatisfeita posta negativo antes da Cl. 7
  Consequência: dano reputacional no momento mais frágil
                + contamina anchors #2 #3
  Mitigação minuta: Cl. 7 janela 30d + Cl. 5.2(d) recusa
                    fundamentada
  Mitigação operacional: checkpoints D+30/D+60/D+120;
                         remediar fricção cedo;
                         pós decurso 30d = direito constitucional
  Severidade pós: BAIXA-MODERADA
```

#### 5.X.3 — Decisões Autônomas Tomadas

**`[HEATHER-AUTO-DECISION]` Setup R$ 1.000 (não R$ 0)** — elimina 3 cenários por fração trivial do valor de mercado (28,6% do setup público). Patricia Peck concordou.

**`[HEATHER-AUTO-DECISION]` Duração 6 meses** — cobre dois quadrimestres operacionais (alta dez-mar + baixa abr-jul) permitindo validação metodológica sazonalmente diversa. 3-4m insuficiente, 12m desnatura anchor.

**`[HEATHER-AUTO-DECISION]` Pós-anchor: 30% × 12 meses no Growth** — reconhece valor da contribuição sem ser concessão eterna. Alternativas descartadas: "anchor permanente 20% eterno" (assimétrica → CDC), "sem desconto pós-anchor" (desincentiva continuidade do que é cliente já educado).

**`[HEATHER-AUTO-DECISION]` 3 anchors no total** — alinha com pilot 3 prospects da memória do projeto. Mais que 3 desnatura, menos não valida metodologia.

**`[PECK-AUTO-DECISION]` Tributação como bonificação publicitária (NÃO permuta)** — permuta exigiria NFS-e bilateral (ANCHOR sem CNAE pertinente, exigi-lo seria abusivo e operacionalmente inviável). Solução: NFS-e R$ 1.000 + diferencial como bonificação publicitária com lastro contratual. Risco residual de requalificação endereçado por Cl. 9.4.

**`[PECK-AUTO-DECISION]` Revogação prospectiva 30d online / 90d impressos** — jurisprudência consolidada (Marco Civil + LGPD + CONAR). Bloquear seria nulo (CC 20 + art. 18 LGPD).

#### 5.X.4 — Variáveis Abstratas para Anchors #2 e #3

| Variável | Anchor #1 | Padrão #2/#3 | Notas |
|----------|-----------|--------------|-------|
| Setup pago | R$ 1.000 | R$ 1.000 ou 25-30% do público | Nunca R$ 0 |
| Período Anchor | 6 meses | 6 meses default, máx 9 | Nunca > 12 |
| Bônus referral | R$ 200/contrato | R$ 200 default | Pode escalar |
| Desconto pós-anchor | 30% × 12m Growth | Padronizar | Consistência |
| Prazo testimonial | até 90 dias | 90 default | 60 se simples |
| Aprovação case study | 7 dias úteis | 7 dias | Não reduzir |
| Revogação online | 30 dias | 30 dias | |
| Revogação impressa | 90 dias | 90 dias | |
| Janela Cl. 7 | 30 dias | 30 default | Nunca < 20 |
| Total anchors | 3 simultâneos | Manter até 09/Jun | Revisar Stage-1 |

**Template reutilizável.** Para #2 e #3 apenas variar: (a) Qualificação Partes, (b) Segmento nos Considerandos, (c) eventuais especificidades operacionais.

#### 5.X.5 — Checklist Pré-Assinatura Anchor #1

- [ ] Contrato Principal v1.1 assinado OU em assinatura simultânea
- [ ] CNPJ da ME SITE-PROSPECTOR ativo (ou PF documentada)
- [ ] Contador consultado sobre Cl. 9
- [ ] Advogado OAB-SC validou Termo v1 e produziu v1.1
- [ ] Anexo I (Autorização Individual Imagem) pronto antes da sessão
- [ ] Anexo II (DPA Testimonial) redigido OU commitment 15d
- [ ] Página pública "Programa Anchor 2026" publicada (RISK #4)
- [ ] Critério objetivo seleção 3 anchors documentado
- [ ] Checkpoints D+30 / D+60 / D+120 agendados (RISK #5)
- [ ] NFS-e R$ 1.000 emitida e arquivada (RISK #1)
- [ ] Pitch oral Anchor documentado em e-mail recap (RISK #2)

---

## §6 Caminho Crítico até 09/Jun/2026

```
Esta semana (15-22/Mai) — Onda 1 P0
  ├─ Levar este pacote consolidado pro advogado OAB-SC
  ├─ Breno fecha A3 stack (GA4 vs PostHog)
  ├─ Breno fecha A5 stack (Resend+Supabase vs Vercel KV)
  └─ Breno consulta contador (Cl. 9 Termo Anchor — RISK #1)

Semana 2-3 (22/Mai - 05/Jun) — review profissional
  ├─ Advogado devolve v1.1 do contrato (5 críticas + 3 cláusulas)
  ├─ Advogado adapta DPA pra TJ-SC-friendly
  ├─ Advogado produz Anexo I Termo Anchor (Cessão Imagem)
  ├─ Advogado produz Anexo II Termo Anchor (DPA Testimonial)
  ├─ Breno produz nota técnica Pequeno Agente ANPD (1 página)
  └─ Breno harmoniza PoP cliente + institucional com retenções DPA

Semana 4 (05-09/Jun) — checkpoint final
  ├─ Checkpoint pré-assinatura
  ├─ Assinatura SIMULTÂNEA:
  │     Contrato Principal v1.1
  │   + DPA
  │   + Termo Anchor #1
  │   + Documento de Transparência
  │   + Spec Plano Growth
  │   + Nota Pequeno Agente
  └─ Hard review 09/Jun: GO / PIVOT / KILL Site-Prospector pilot
```

### Custo total estimado advogado

| Item | Valor |
|------|-------|
| Orçamento original Contrato | R$ 2.500–5.000 |
| Incremental v1.1 (5 críticas + 3 faltantes) | R$ 800–2.000 |
| Revisão DPA + adaptação OAB-SC | já incluso |
| Anexo I Termo (Cessão Imagem) | já incluso |
| Anexo II Termo (DPA Testimonial) | já incluso |
| **Total estimado** | **R$ 3.300–7.000** |

Janela 25 dias é suficiente com 6-12h advogado.

### Custos adicionais externos

- Contador especializado Simples Nacional + ISS Blumenau — orçar separado
- Eventual parecer externo IP/right-of-publicity (AIOS mind clones, Onda 1 #3) — fora do escopo Site-Prospector

---

## §7 Arquivos-Fonte (referência para auditoria)

Este relatório consolida verbatim ou em síntese o conteúdo de:

| Arquivo | Linhas | Conteúdo |
|---------|--------|----------|
| `triage-2026-05-15.md` | 177 | §2 deste relatório (Tier 0 + roster + fila) |
| `contrato-v1-baseline-extracted.txt` | 366 | Input do advogado (não consolidado — referência) |
| `contrato-v1-review-2026-05-15.md` | 329 | §3 deste relatório (review completo + 13 perguntas) |
| `dpa-site-prospector-v1-2026-05-15.md` | 414 | §4 deste relatório (DPA verbatim + Anexos A/B) |
| `dpa-decisions-memo-2026-05-15.md` | 166 | §4.X deste relatório (PECK-AUTO-DECISIONS + risk-flags) |
| `termo-parceria-anchor-v1-2026-05-15.md` | 401 | §5 deste relatório (Termo verbatim + Anexos placeholder) |
| `anchor-risk-memo-2026-05-15.md` | 267 | §5.X deste relatório (risk memo + decisões + checklist) |

**Memória do squad legal-chief:**
- `D:\AIOS\.claude\agent-memory\legal-chief\project_site_prospector_contract_v1.md`
- `D:\AIOS\.claude\agent-memory\legal-chief\project_site_prospector_dpa_v1.md`
- `D:\AIOS\.claude\agent-memory\legal-chief\project_site_prospector_anchor_termo.md`

**Memória de retomada (user session):**
- `C:\Users\kingp\.claude\projects\D--AIOS\memory\session_site_prospector_legal_15mai.md`

---

## §8 Glossário Mínimo

| Termo | Significado |
|-------|-------------|
| **ANPD** | Autoridade Nacional de Proteção de Dados (LGPD) |
| **CDC** | Código de Defesa do Consumidor (Lei 8.078/1990) |
| **CDC art. 51** | Cláusulas abusivas — IV é "obrigações iníquas/excessivamente onerosas" |
| **CFM 2.454/2026** | Resolução do Conselho Federal de Medicina sobre telemedicina/IA em saúde |
| **DPA** | Data Processing Agreement / Acordo de Processamento de Dados |
| **GBP** | Google Business Profile |
| **LGPD** | Lei Geral de Proteção de Dados (Lei 13.709/2018) |
| **NFS-e** | Nota Fiscal de Serviço eletrônica |
| **OAB-SC** | Ordem dos Advogados do Brasil, seccional Santa Catarina |
| **Pequeno Agente** | Resolução CD/ANPD nº 2/2022 — porte simplificado de tratamento |
| **PoP** | Política de Privacidade |
| **ROPA** | Registro de Operações de Tratamento (art. 37 LGPD) |
| **SaMD** | Software as Medical Device (FDA classification) |
| **SCC** | Standard Contractual Clauses (transferência internacional — Res. ANPD 19/2024) |
| **Súmula 297/STJ** | "O Código de Defesa do Consumidor é aplicável às instituições financeiras" — estendida por jurisprudência a casos de destinatário final vulnerável PJ |
| **TJ-SC** | Tribunal de Justiça de Santa Catarina |

---

## §9 Disclaimer Legal Obrigatório

⚠️ **ESTE DOCUMENTO É ANÁLISE ORIENTATIVA E NÃO SUBSTITUI CONSULTA COM ADVOGADO(A) OAB-SC ATIVA.**

Posições jurisprudenciais e doutrinárias citadas devem ser confirmadas em pesquisa atualizada antes da assinatura. Decisões tributárias finais (Cláusula 9 do Termo Anchor — RISK #1) dependem de validação por contador profissional habilitado em Simples Nacional + ISS Blumenau. As variáveis em [colchetes] devem ser preenchidas.

Os mind clones `@patricia-peck`, `@heather-meeker`, `@lawrence-lessig`, `@richard-susskind`, `@adriana-dallari`, `@erik-nymanczuk`, `@bakul-patel`, `@lucia-savage` utilizados nesta análise são simulações computacionais baseadas em obras publicadas pelos autores; opiniões aqui apresentadas devem ser validadas por profissional habilitado antes da assinatura ou submissão a autoridades.

**Caso #1 (Contrato Site-Prospector) e #5 (Anipis CFM regulatório) demandam OAB ativo registrado.** O presente relatório destina-se ao trabalho preparatório do(a) advogado(a) OAB-SC contratado(a) para o Contrato Principal v1.1 + DPA + Termo Anchor.

---

**Fim do Relatório Consolidado v1 — A → X**

`legal-chief` | Patricia Peck · Heather Meeker · Lawrence Lessig · Richard Susskind
`aios-master` — orquestração e edição
Brand: **AIOX Squad v2.0 — Dark Cockpit Edition** (https://brand.aioxsquad.ai/brandbook)

2026-05-15 · Blumenau/SC · Brasil
```
$ legal-chief --status
✓ contract-v1: REVIEWED (CONCERNS — 5 ajustes + 3 faltantes)
✓ dpa-v1: READY
✓ termo-anchor-v1: READY
→ next: handoff OAB-SC
```
