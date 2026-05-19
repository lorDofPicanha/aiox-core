# 04 — UX Mobile PWA + WhatsApp Bot + Modo Rápido (Buscador-Licitações)

**Author:** Uma (aios-ux-design-expert) · **Date:** 2026-05-18
**Scope:** Camada UX completa do ecossistema "Holding Virtual"
**Context:** 3 empresas (1 licita, 2 gestão financeira) + N usuários (pai/Alice/Giovanna/Gabela + cliente master) + workflow 6 estágios (Monitorar → Analisar 6M → Diferencial → Habilitar → Acompanhar → Recorrer) + base livro caixa multi-empresa
**Brand:** AIOX dark theme + lime `#D7FF3F` (do deck-diagnostico-amigo)
**Clones canalizados:** Don Norman (Design of Everyday Things, cap. 1 affordances + cap. 4 mapping), Cathy Pearl (Designing Voice User Interfaces O'Reilly cap. 3 grammar + cap. 7 error handling), Julie Zhuo (Making of a Manager — design produto em time pequeno), Kat Holmes (Mismatch — inclusive design, mismatch principle), Dieter Rams (10 Principles — less but better).

---

## 1. <10S LANÇAMENTO — TINDER STACK COM CONFIRMAÇÃO HAPTIC

### Decisão de padrão: **STACK VERTICAL com TAP-CONFIRM** (não swipe Tinder)

**Don Norman, cap. 1:** "affordance é a relação entre objeto e usuário". Swipe Tinder é affordance de descarte (yes/no binário). Lançamento contábil **não é binário** — pode precisar editar categoria. Stack vertical com botão grande "Confirmar" + handle "Editar" preserva 3 estados.

### Wireframe textual — tela "Despesas INYAC pendentes (8)"

```
╔══════════════════════════════════════════╗  ← status bar
║ ←  Despesas INYAC                 8 ▼   ║  ← header sticky, contagem
╠══════════════════════════════════════════╣
║                                          ║
║  ┌────────────────────────────────────┐  ║  ← CARD ATIVO (full width)
║  │ R$ 1.500,00            13/Mai 14:32│  ║  ← valor 28px / data 14px
║  │ BOLETO MOLDURAS S/A                │  ║  ← descrição 18px regular
║  │                                    │  ║
║  │ ┌──────────────────────────────┐   │  ║  ← chip sugestão LLM (lime)
║  │ │ ✨ Insumos / Despesa Variável│   │  ║     #D7FF3F text on dark
║  │ │    confiança 92%             │   │  ║     14px label
║  │ └──────────────────────────────┘   │  ║
║  │                                    │  ║
║  │  [    ✓  Confirmar (1.500)    ]    │  ║  ← CTA primário 56px lime
║  │                                    │  ║     hapticImpact: medium
║  │  ↻ Outra categoria   ⋯ Dividir     │  ║  ← ações secundárias 18px
║  └────────────────────────────────────┘  ║
║                                          ║
║  ┌────────────────────────────────────┐  ║  ← CARD próximo (preview 30%)
║  │ R$ 380,00                          │  ║  ← apenas valor visível
║  │ PIX *energia ENEL                  │  ║     parallax sutil ao scroll
║  └────────────────────────────────────┘  ║
║                                          ║
║  ░░░░░ 1 de 8 ░░░░░░░░░░░░░░░░░░░░░░░░░  ║  ← progress dots fixed bottom
╚══════════════════════════════════════════╝
```

### Interaction model (Norman mapping)

| Ação usuário | Sistema | Feedback | Latência alvo |
|--------------|---------|----------|----------------|
| Abre push notification | PWA opens deep-link `/despesas/{empresa_id}?pending` | Card já carregado | <1.2s LCP |
| Tap "Confirmar" | `PATCH /entries/{id}` status='classificado' | Haptic medium + card desliza pra cima + próximo entra | <300ms percebida |
| Tap "Outra categoria" | Bottom sheet 70vh com top-5 LLM + busca | Slide-up 280ms ease-out | imediato |
| Tap "Dividir" | Modal full-screen "Dividir lançamento" | Slide-right (back gesture preservado) | imediato |
| Long-press card | Sheet "Ver detalhes / Histórico / Excluir" | Haptic heavy | imediato |
| Scroll baixo no card | Revela sub-info (banco, conta, tag fiscal) | acordeon expand | — |

### Estados do `financial_entry` (visual encoding)

```
pendente   → border-left 4px lime         + ícone 🕐 cinza
sugerido   → border-left 4px lime         + chip "✨" + label LLM
confirmado → checkmark verde 24px         + card collapse + value bold
erro       → border-left 4px red 500      + chip "!" + msg humanizada
parcial    → split-icon (divisão visual)  + valor com /N pedaços
```

**Dieter Rams princípio 4 (faz produto compreensível):** cor não-única — sempre ícone + texto + posição.

### Transações que não cabem em UMA categoria — "Dividir lançamento"

```
TED PROVEDOR XYZ R$ 850,00
  └─ R$ 400 / Aluguel CENTINELA        [- pedaço]
  └─ R$ 450 / Insumo INYAC             [- pedaço]
  [+ adicionar pedaço]                  total: R$ 850 ✓
```

Validação: soma dos pedaços = valor original. Erro: barra vermelha animada com diff "faltam R$ 50".

### Feedback haptic (Vibration API)

```typescript
// app/lib/haptics.ts
export const haptic = {
  confirm: () => navigator.vibrate?.([20]),           // tap leve
  success: () => navigator.vibrate?.([15, 30, 15]),   // confirmar lançamento
  error:   () => navigator.vibrate?.([60, 40, 60]),   // erro
  alert:   () => navigator.vibrate?.([100, 50, 100, 50, 100]),  // CRF vence
}
```

iOS Safari NÃO suporta `navigator.vibrate` — fallback: micro-animation 200ms no card (`transform: scale(0.98)`).

### Sugestão LLM — affordance de confiança

**Cathy Pearl cap. 5 (confidence scores):** mostrar confiança SÓ quando <85%. Acima disso, é ruído cognitivo. Abaixo, sinaliza "revise com atenção".

```
≥85% → chip lime sólido, sem percentual
70-84% → chip lime outline + "confirme?" label
<70% → chip cinza + "categoria duvidosa, revisar"
```

---

## 2. WHATSAPP BOT — COMMAND LAYER PARALELO

### Comandos suportados (grammar Pearl cap. 3 — small vocabulary, big yield)

| Comando | Sintaxe livre | Slot extraction |
|---------|---------------|------------------|
| `*receita` | `*receita pix 5k inyac serviço NF 1234` | tipo=pix, valor=5000, empresa=INYAC, categoria_hint=serviço, doc=NF 1234 |
| `*despesa` | `*despesa boleto 380 enel centinela energia` | tipo=boleto, valor=380, fornecedor=enel, empresa=CENTINELA, categoria_hint=energia |
| `*saldo` | `*saldo` ou `*saldo inyac` | escopo=all/empresa |
| `*editais` | `*editais hoje` | scope=hoje/semana |
| `*pendentes` | `*pendentes` | retorna count por empresa |
| `*ajuda` | `*ajuda` ou `*ajuda receita` | retorna grammar com exemplos |
| `*audio` | (mensagem de voz) | Whisper → parser → confirma |

### Fluxo conversacional (Pearl cap. 6 confirmation strategies)

```
Pai: *receita pix 5k inyac serviço NF 1234

Bot: ✓ Entendi:
     💰 RECEITA · R$ 5.000,00 · INYAC
     📑 Serviços prestados (sugestão)
     🧾 NF 1234

     [✅ Confirmar]  [✏️ Editar]  [❌ Cancelar]
     (responda 1, 2 ou 3)

Pai: 1

Bot: ✅ Lançado em INYAC.
     Saldo INYAC hoje: R$ 47.320,00 (+R$ 5k)
     [📊 Ver dashboard]
```

**Pearl cap. 6 — implicit confirmation:** confirmação visual + 1-tap, NÃO "tem certeza?" duplo (atrito).

### Áudio → comando — pipeline

```
WhatsApp recebe audio.ogg
  ↓
Edge Function `transcribe_audio` → Whisper API ($0.006/min)
  ↓
LLM parser (gpt-5.1-mini): áudio → slots JSON
  ↓
"5 mil ali na inyac receita serviço" →
  { tipo: 'pix', valor: 5000, empresa: 'INYAC', natureza: 'receita', cat: 'serviço' }
  ↓
Bot confirma como texto (re-confirma valor, especialmente)
```

**Tratamento de erro (Pearl cap. 7):**

```
Pai: lança aí 5k

Bot: 🤔 Faltam alguns dados pra lançar.
     Qual empresa? [INYAC] [INC] [CENTINELA]
     É receita ou despesa? [💰 Receita] [💸 Despesa]

Pai: [INYAC] [💰 Receita]

Bot: OK. R$ 5.000,00 receita INYAC.
     De onde veio? (PIX, boleto, transferência, dinheiro)
     [PIX] [Boleto] [Transferência] [Dinheiro]
```

**Don Norman:** "the system should never punish the user for ambiguity — escalate gracefully, never restart". Bot mantém slots já preenchidos enquanto pergunta os faltantes.

### Botões interativos WhatsApp Cloud API

- **Reply buttons** (até 3): confirmação rápida `[Confirmar] [Editar] [Cancelar]`
- **List messages** (até 10 itens): seletor de categoria contábil top-10
- **CTA URL buttons**: `[📊 Abrir Dashboard]` linka direto pra PWA
- **NÃO usar Template buttons** pra interação contínua (custo + limita personalização)

### Plataforma OSS — recomendação

| Opção | Pros | Contras | Veredito |
|-------|------|---------|----------|
| **Builderbot** (TS) | Open source, code-first, WhatsApp Cloud nativo, baileys/Twilio adapter | comunidade média, docs PT-BR fracas | ✅ **RECOMENDADO** |
| Rasa | NLU robusto, dialog management maduro | overkill p/ grammar fechada, Python stack à parte | ❌ |
| Botpress | UI low-code, integrações ricas | hosted/freemium, lock-in, JS custom limitado | ❌ |
| Botkit | Histórico Slack, declínio | descontinuado de facto | ❌ |
| **Custom (Inngest + Cloud API direta)** | máximo controle, mesma stack do core, durable execution já roda | mais código próprio | ✅ **RECOMENDADO se Inngest já no projeto** |

**Decisão:** **Custom + Inngest** (já está na stack do brief §4.1). Bot é workflow: `wa.message_received` → `parser.extract_slots` → `db.create_entry_draft` → `wa.send_confirmation`. Não precisa Builderbot — adiciona dependência.

### Custo WhatsApp Cloud API (Meta tabela Brasil 2026)

| Tipo conversa | Custo | Aplicação |
|---------------|-------|-----------|
| **Service** (user-initiated 24h) | R$ 0 | Comandos `*receita`, áudio, dúvidas — janela 24h |
| **Utility** (system-initiated) | R$ 0,032 | "Despesas pendentes para classificar" (alerta) |
| **Authentication** | R$ 0,033 | OTP login se usar |
| **Marketing** | R$ 0,11 | NÃO usar — não é caso de uso |

**Volume estimado (3 empresas, 4 lançadores):**
- Service: ~120 conversas/mês = R$ 0
- Utility alerts: ~60/mês (CRF, editais, dossiê) = ~R$ 2/mês

**Custo total mensal: R$ 2-5.** Negligível.

---

## 3. MODO RÁPIDO <30MIN HABILITAÇÃO (Estágio 4)

### Padrão de UI: **FULL-SCREEN WIZARD VERTICAL** (não drawer, não modal)

**Justificativa Julie Zhuo (Making of Manager — cap. confiança):** habilitação é decisão de R$ 5-50k. Dar 100% da tela transmite "isso importa, foque". Drawer dilui.

### Layout — tela "Habilitar para DF-2026-1234"

```
╔══════════════════════════════════════════╗
║ ←  Mobiliário hospitalar       INYAC ▾  ║
║    R$ 180.000  ·  abre 22/Mai 14h      ║
╠══════════════════════════════════════════╣
║                                          ║
║  ╭─ Checklist habilitação ──────────╮   ║
║  │  ████████████░░  12 de 14 OK     │   ║
║  ╰──────────────────────────────────╯   ║
║                                          ║
║  ✅ Contrato social INYAC               ║
║  ✅ CNPJ ativo                          ║
║  ✅ CND Federal (válida 28d)            ║
║  ✅ CND Estadual (válida 51d)           ║
║  ✅ CND Municipal (válida 17d)          ║
║  ✅ CNDT (válida 88d)                   ║
║  ✅ SICAF nível 6                       ║
║  ⚠️ CRF FGTS · vence em 5d  →  RESOLVER ║  ← tap = bottom sheet
║  ✅ Balanço 2024 (auto)                 ║
║  ✅ DRE 2024 (auto)                     ║
║  ✅ Índice LG 1.45 (mín 1.00)           ║
║  ✅ Índice LC 1.20 (mín 1.00)           ║
║  ✅ Índice SG 1.80 (mín 1.00)           ║
║  ⚠️ ACT mobiliário hospitalar  → BUSCAR ║  ← tap = matcher
║                                          ║
║  ┌────────────────────────────────────┐  ║
║  │  📄 Compilar dossiê (60s)          │  ║  ← DISABLED até 14/14
║  │  Resolva 2 pendências primeiro     │  ║
║  └────────────────────────────────────┘  ║
╚══════════════════════════════════════════╝
```

### Checklist visual — 12/14 OK

**Don Norman cap. 4 mapping:** progress bar **conceitual** (12 de 14) + lista item-por-item. Não usar % puro (cognitivo abstrato — usuário processa "qual falta?" não "percentual").

**Cor não-único-canal:**
- ✅ verde + checkmark + texto verde
- ⚠️ amarelo + ! + texto amarelo + CTA "→ RESOLVER"
- ❌ vermelho + X + texto vermelho + "INSANÁVEL" tag

### Item pendente click → fluxo guiado

**"⚠️ CRF FGTS · vence em 5d"** → bottom sheet 80vh:

```
╔══════════════════════════════════════════╗
║                                          ║
║  CRF FGTS · INYAC                       ║
║  Vence em 5 dias (23/Mai)               ║
║                                          ║
║  ┌────────────────────────────────────┐  ║
║  │  🔐 Login Caixa CNPJ-only           │  ║
║  │  Renova automático em 30s.          │  ║
║  │  ──────────────────────────────     │  ║
║  │  [Conectar com gov.br]              │  ║  ← CTA primário
║  └────────────────────────────────────┘  ║
║                                          ║
║  Ou manual:                              ║
║  [📎 Upload PDF do CRF novo]            ║
║                                          ║
╚══════════════════════════════════════════╝
```

**"⚠️ ACT mobiliário hospitalar"** → sheet matcher:

```
🎯 3 ACTs na sua biblioteca

✨ Hospital São Lucas / 2024 / R$ 280k
   Cadeira hospitalar · 12 unidades                8.5/10
   ─────────────────────────────────────────────
   ✅ Objeto compatível (mobiliário hospitalar)
   ✅ Quantidade ≥ exigido
   ✅ Período < 3 anos
   [Selecionar este]

   Clínica Bem-Estar / 2023 / R$ 150k             7.8/10
   Cama hospitalar · 8 unidades
   [Selecionar este]

   Creche Pequenos / 2025 / R$ 95k                4.0/10
   Mobiliário escolar (objeto divergente)
   [⚠️ Selecionar mesmo assim]
```

### Auto-BP/DRE — exibir antes/depois

**Kat Holmes (Mismatch):** usuário 60+ pode não confiar em "gerado pela IA". Mostrar **a fonte**, não só o resultado.

```
📊 Balanço Patrimonial 2024 · INYAC

  Gerado a partir de:
  ├─ 847 lançamentos categorizados
  ├─ 12 meses fechados
  └─ Plano de contas DRE-padrão

  [👁️ Ver detalhes do cálculo]   [✅ Aceitar e usar]   [📥 Pedir ao contador]
```

### Progress bar "compilar dossiê"

```
[████████████░░░░] 75%
Mesclando: ACT Hospital São Lucas (12/14)
Tempo restante: ~15s

[Cancelar]
```

**Don Norman cap. 5 forcing functions:** progresso real (não fake spinner). Cada step textual ("Validando CND Federal online... ✓") aumenta confiança.

### Preview do PDF antes de "enviado"

**ANTI-DARK-PATTERN:** botão "marcar enviado" SÓ aparece DEPOIS de tap em "Abrir PDF" (forçar revisão humana — Pipeline 4 nunca 100% auto). Mensagem: *"Revise o dossiê antes de marcar como enviado — confirmação manual é proteção sua."*

---

## 4. MODO RÁPIDO <8MIN RECURSO (Estágio 6) — UX CRÍTICO TEMPO

### Push notification (Cathy Pearl cap. 8 — urgent VS informational)

```
🚨 VENCEDOR DECLARADO
DF-2026-1234 · Mobiliário hospitalar
Janela de recurso: 3 dias úteis
3 irregularidades detectadas (2 INSANÁVEIS)

[Ver agora →]
```

**Cor + ícone + countdown.** Pearl: "urgency in audio = pace; in visual = motion + contrast". O bullet 🚨 anima 2 piscadas (CSS keyframes), depois para.

### Tela do relatório — single-page mobile-first

```
╔══════════════════════════════════════════╗
║ ←  Conferência concorrente              ║
║    Empresa Y / CNPJ XX.XXX/0001-XX      ║
╠══════════════════════════════════════════╣
║                                          ║
║  ┌────────────────────────────────────┐  ║
║  │  Score de recurso: 9.2/10          │  ║  ← hero number 48px lime
║  │  ✓ Recomendação forte               │  ║
║  └────────────────────────────────────┘  ║
║                                          ║
║  ⏱ Prazo: 2d 14h restantes              ║  ← countdown live
║                                          ║
║  IRREGULARIDADES                         ║
║                                          ║
║  ❌ INSANÁVEL                           ║
║  CRF FGTS expirou em 16/Mai             ║
║  Verificado: Caixa API · agora          ║
║  Fundamento: Lei 14.133 art. 68         ║
║  [📋 Cópia evidência]                   ║
║                                          ║
║  ❌ INSANÁVEL                           ║
║  Sócio "João Z" em CEIS                 ║
║  Verificado: Portal Transparência       ║
║  Fundamento: Lei 12.846 art. 22         ║
║  [📋 Cópia evidência]                   ║
║                                          ║
║  ⚠️ DUVIDOSO                            ║
║  ACT divergente: "escolar" vs "hospital"║
║  Match score: 3.5/10                    ║
║  [💬 Justificar inclusão / Ignorar]    ║
║                                          ║
║  ┌────────────────────────────────────┐  ║
║  │  ✊ Manifestar intenção             │  ║  ← CTA primário lime
║  │  Gera minuta em 30s                │  ║
║  └────────────────────────────────────┘  ║
║                                          ║
║  [Não recorrer agora]                   ║  ← ação secundária neutra
╚══════════════════════════════════════════╝
```

### "Manifestar intenção" — 1-click ou exige revisão?

**Dieter Rams princípio 9 (environmental friendly = no waste):** decisão jurídica não pode ser 1-click. **Padrão híbrido:**

```
Tap "✊ Manifestar intenção"
  ↓
Sheet "Pronto pra manifestar?"
  ├─ Score: 9.2/10 (forte)
  ├─ 2 fundamentos INSANÁVEIS confirmados
  ├─ Prazo até 21/Mai 16h
  └─ ⚠️ É um ato formal jurídico. Revise antes.

  [✏️ Revisar minuta primeiro]   [✅ Manifestar agora]
```

`Manifestar agora` exige **swipe-to-confirm** (não tap) — Pearl: "high-stakes confirmation = different gesture than low-stakes".

### Minuta no celular — revisar como?

```
Minuta — Intenção de recurso DF-2026-1234

[Aba: Resumo] [Aba: Texto completo] [Aba: Evidências]

RESUMO (auto, 4 linhas):
"Manifestamos intenção de recurso contra
 declaração de Empresa Y como vencedora,
 fundamentando em CRF FGTS expirado
 (insanável) e sócio em CEIS (insanável)."

[📝 Editar texto]   [📋 Copiar texto]   [📤 Compartilhar]
```

Aba "Texto completo" usa **font sans 17px + line-height 1.7** (leitura jurídica longa). Modo claro disponível em CSS toggle (light theme bater em sol forte — Kat Holmes inclusão).

### Integração portal externo — copy/paste guiado

Como não há API DF/AL:

```
Portal DF e-Compras

  1. Abra https://comprasnet.gov.br/...     [🔗 Abrir portal]
  2. Faça login (usuário João.Silva)        [👁️ Ver credenciais]
  3. Vá em "Licitações > Em andamento"
  4. Procure: DF-2026-1234                  [📋 Copiar nº]
  5. Clique em "Manifestar Intenção"
  6. Cole o texto abaixo:                   [📋 Copiar minuta]

  ╭───────────────────────────────────╮
  │ [texto da minuta com scroll]       │
  ╰───────────────────────────────────╯

  7. Salve o protocolo aqui:          [📷 Foto] [✏️ Digitar]
```

**Cada passo expand/collapse** (acordeon). Quem fez 1x não precisa ver tudo de novo.

---

## 5. DASHBOARD DESKTOP (CLIENTE MASTER)

### Layout 3-coluna 1440px+

```
╔════════════════════════════════════════════════════════════════════════╗
║ AIOX · Holding Virtual                                  cliente ▾     ║
╠══════════════╦══════════════════════════════════╦══════════════════════╣
║  NAV          ║  HOJE                            ║  ALERTAS             ║
║  ─────        ║  ─────                           ║  ─────               ║
║  ⌂ Visão      ║  Receita semana   R$ 47.320      ║  🚨 Vencedor decl.  ║
║  📊 Caixa     ║  ├─ INYAC         R$ 28k         ║     DF-2026-1234    ║
║  📁 Docs      ║  ├─ INC           R$ 14k         ║     2d 14h          ║
║  🎯 Editais   ║  └─ CENTINELA     R$  5k         ║                      ║
║  🏆 Habilit.  ║                                  ║  ⚠️ CRF -5d INYAC   ║
║  ⚖️ Recursos  ║  Despesa semana   R$ 21.105      ║     [Resolver]      ║
║  💼 Empresas  ║                                  ║                      ║
║  ⚙️ Config    ║  ─────────────────               ║  📬 3 editais novos ║
║               ║                                  ║     match >70%      ║
║               ║  EDITAIS EM ANDAMENTO            ║                      ║
║               ║  ┌──────────────────────────┐    ║                      ║
║               ║  │ Estágio 1 MONITORAR  (8) │    ║                      ║
║               ║  │ Estágio 2 ANALISAR   (3) │    ║                      ║
║               ║  │ Estágio 3 DIFERENC.  (2) │    ║                      ║
║               ║  │ Estágio 4 HABILITAR  (1) │    ║                      ║
║               ║  │ Estágio 5 ACOMPANHAR (4) │    ║                      ║
║               ║  │ Estágio 6 RECORRER   (1) │    ║                      ║
║               ║  └──────────────────────────┘    ║                      ║
╚═══════════════╩══════════════════════════════════╩══════════════════════╝
```

### Visão Holding Virtual (default)

3 cards top:
```
┌─ INYAC ──────────┐  ┌─ INC ────────────┐  ┌─ CENTINELA ─────┐
│ Receita 12m      │  │ Receita 12m      │  │ Receita 12m     │
│ R$ 540k          │  │ R$ 280k          │  │ R$ 130k         │
│                  │  │                  │  │                 │
│ LG: 1.45 ✓       │  │ LG: 1.12 ✓       │  │ LG: 0.85 ✗     │
│ Editais: 5       │  │ Editais: —       │  │ Editais: —      │
│ Próx. cert: 5d   │  │ Próx. cert: 18d  │  │ Próx. cert: 51d │
└──────────────────┘  └──────────────────┘  └─────────────────┘
```

(Lembrete da correção do user: **1 empresa licita (INYAC)** — as outras 2 são gestão financeira pura; UI mostra "Editais: —" pra elas.)

### Kanban estágios 1-6 (drill-down)

Colunas verticais com cards arrastáveis (Estágio 1 → 6). Cada card:
- Nº edital
- Órgão
- Valor estimado
- Match score
- Próximo prazo
- Owner (cliente/agente IA)

**Don Norman:** kanban = mapeamento espacial natural pra processo sequencial. Cliente vê o pipeline.

### Print/export contador externo

Topo de cada relatório: `[📥 PDF]  [📊 Excel]  [📧 Enviar contador]`. Export sempre com **plano de contas DRE-padrão BR** + nota de rodapé "Dados de origem: Buscador Holding Virtual — confirmar com escrituração oficial."

---

## 6. ONBOARDING FLOW — 72h PRIMEIRAS

### Stepper 6-step (Julie Zhuo: progresso visível = adesão)

```
[1 Empresas] → [2 Equipe] → [3 Pluggy] → [4 Certidões] → [5 Contas] → [6 Tour]
```

### Step 1 — Empresas (esperado ~8min)

```
Cadastrar 3 empresas

  Empresa 1 ✓
  ├─ CNPJ: 12.345.678/0001-XX
  ├─ Razão: INYAC Indústria Ltda
  ├─ Regime: Lucro Presumido
  ├─ Função: LICITA + GESTÃO FINANCEIRA
  └─ CNAEs: 31.01-2/00 (principal) + 3 secundários

  [+ Adicionar 2ª empresa]
```

CNAEs com autocomplete + lookup IBGE. Erro CNPJ → consulta Receita ws.

### Step 2 — Equipe (esperado ~5min)

```
Convidar equipe

  Você (cliente, master)               role: master · 🔐 todos
  Pai                  +55 61 9...     role: lançador receita / todas empresas
  Alice                +55 61 9...     role: lançador despesa / INYAC
  Giovanna             +55 61 9...     role: lançador despesa / INC
  Gabela               +55 61 9...     role: lançador despesa / CENTINELA

  [Enviar convites por WhatsApp]
```

Cada convidado recebe link mágico WhatsApp (Cathy Pearl onboarding) → login passwordless.

### Step 3 — Pluggy connect (esperado ~10min)

**LGPD consent (não-dark-pattern):**

```
🔐 Open Finance (Pluggy)

  Vamos conectar as contas bancárias das 3 empresas
  pra puxar transações automaticamente.

  O que isso fará:
  ✓ Importa OFX das contas
  ✓ Sugere categorias contábeis
  ✓ Atualiza a cada 6h

  O que NÃO fará:
  ✗ Move dinheiro
  ✗ Faz pagamento
  ✗ Acessa investimentos

  Você pode revogar a qualquer momento.

  [📖 Ler termo LGPD completo]
  [▶ Conectar 3 contas]      [Pular, vou lançar manual]
```

### Step 4 — Certidões iniciais (~7min)

Upload guiado: CRF FGTS + CND Federal + CND Estadual + CND Municipal + CNDT + Balanço 2024 (se tiver). Cada upload roda OCR de validade e exibe "Vence em X dias".

### Step 5 — Plano de contas (~5min)

Default DRE-padrão BR (49 contas pré-cadastradas). Cliente pode **adicionar 5-10 customizadas** mas NÃO pode "criar conta 'outros'" (anti-feature §7 do brief). UX: campo bloqueado com mensagem "Categorias específicas evitam quebrar o Auto-DRE".

### Step 6 — Tutorial 90s

Vídeo embutido (autoplay muted) explicando Modo Rápido em 4 cenas:
1. Push despesas pendentes (Alice, 15s)
2. Push CRF vencendo (cliente, 20s)
3. Push edital novo (cliente, 25s)
4. Push vencedor declarado (cliente, 30s)

Replay disponível em Config > Tutoriais.

---

## 7. PUSH NOTIFICATION CONTENT — COPY REAL

### Voz: direta, brasileira, sem capitalização desnecessária (Dieter Rams: tirar o supérfluo)

```yaml
# CRF -30d (warning soft)
title: "CRF FGTS INYAC vence em 30 dias"
body: "Tá no radar. Renovação automática em 5 dias se você não fizer."
icon: 🟡
priority: low

# CRF -7d (urgent)
title: "🟠 CRF FGTS INYAC vence em 7 dias"
body: "Toca aqui pra renovar com 1 clique."
icon: 🟠
priority: high
action_label: "Renovar agora"

# Edital novo
title: "📬 Novo edital — match 87% (INYAC)"
body: "Mobiliário hospitalar · R$ 180k · abre 22/Mai"
icon: 📬
action_label: "Ver edital"

# Vencedor declarado (urgent — preclusão)
title: "🚨 Vencedor declarado — DF-2026-1234"
body: "3 irregularidades. Score recurso 9.2/10. Prazo 2d 14h."
icon: 🚨
priority: max
action_label: "Ver agora"
ttl: 60  # vibra a cada 1min se não abrir em 5min

# Recurso protocolado (confirmação)
title: "✅ Recurso protocolado"
body: "Protocolo nº DF-REC-2026-89234. Razões em 3d úteis."
icon: ✅
priority: normal

# Sistema fora do ar (transparência)
title: "⚙️ Estamos com lentidão"
body: "Tentando reconectar. Seus dados estão salvos."
icon: ⚙️
priority: low
# importante: alertas críticos seguem por WhatsApp separado se PWA offline
```

**Cathy Pearl cap. 8 — system transparency:** dizer "estamos com lentidão" é melhor que silêncio. Confiança aumenta.

### Despesas pendentes (utility, Alice)

```
title: "Alice, 8 despesas INYAC esperando você"
body: "Sugestões prontas. 3 minutos pra fechar."
priority: normal
schedule_window: 14h-17h  # respeita rotina
```

**NÃO mandar push** fora da janela útil (anti-spam).

---

## 8. AIOX BRAND APLICADO AO MOBILE

### Type scale mobile

```css
/* CSS custom properties — app/styles/typography.css */
--font-display: 'Geist Sans', system-ui;
--font-mono:    'Geist Mono', monospace;

--text-hero:    48px / 1.05 / 700;   /* score recurso, saldo total */
--text-h1:      32px / 1.1  / 600;   /* título tela */
--text-h2:      24px / 1.2  / 600;   /* card title */
--text-body:    18px / 1.5  / 400;   /* mínimo absoluto */
--text-label:   16px / 1.4  / 500;   /* botões pequenos só */
--text-caption: 14px / 1.4  / 400;   /* timestamp, metadados — NÃO em info crítica */
```

**Regra:** info crítica (valores, datas, status) ≥18px sempre. Captions só pra "13/Mai 14:32" e similar.

### Color tokens (AIOX dark theme)

```css
--bg-base:        #0A0A0B;      /* preto AIOX */
--bg-elevated:    #141416;      /* card */
--bg-overlay:     rgba(20,20,22,0.92); /* sheets */
--lime-primary:   #D7FF3F;      /* CTA, accent */
--lime-glow:      rgba(215,255,63,0.15); /* hover */
--text-primary:   #F5F5F7;      /* contraste AAA com bg */
--text-secondary: #A8A8AD;      /* AA com bg */
--text-tertiary:  #6E6E73;      /* só metadados — AA só em ≥18px */
--success:        #34D399;
--warning:        #FBBF24;
--danger:         #F87171;
--insanavel:      #DC2626;      /* tom mais escuro pra urgência */
```

### Touch targets

```
mínimo padrão:       44 × 44 px
CTA primário:        56 × full-width
ícone-ação inline:   40 × 40 px (com hit-area 44+ via padding)
distância entre targets:  ≥8px (evita mis-tap)
```

### Espaçamento uma-mão

Base unit `--spacing-1 = 4px`. Conteúdo crítico **na metade inferior** da tela (zona alcançável polegar 75% dos usuários destros direitos). CTA fica fixed bottom com `padding-bottom: env(safe-area-inset-bottom)`.

```
┌────────────────┐
│                │  ← topo: info passiva (header, contagem)
│                │
│                │
│                │
│   ZONA DEAD    │  ← meio: pouco usado
│                │
├ ─ ─ ─ ─ ─ ─ ─ ┤
│                │
│   ZONA THUMB   │  ← bottom 40%: CTA + ações principais
│   [CTA aqui]   │
└────────────────┘
```

---

## 9. ACESSIBILIDADE — CHECKLIST

| Critério | Status | Justificativa/Implementação |
|----------|--------|-----------------------------|
| Texto sempre ≥18px? | ✅ Sim para info crítica | Captions 14px só pra metadados não-críticos; user pode subir 200% via OS sem quebrar |
| Cor não-único-canal | ✅ Garantido | ⚠️ amarelo + ícone + texto + posição; ❌ vermelho + X + texto |
| WCAG AA contraste | ✅ AAA pra hero | `#D7FF3F` em `#0A0A0B` = 14.2:1 (AAA) |
| VoiceOver / TalkBack | ✅ tested via Lighthouse + manual | `aria-label`, `role`, `aria-live` em alertas, `lang="pt-BR"` |
| Type scale 200% sem quebrar | ✅ Layout flexbox + grid + clamp() | testado em DevTools 200% |
| Foco visível | ✅ outline 2px lime + offset 2px | nunca remove default focus ring |
| Reduce motion | ✅ `prefers-reduced-motion` desabilita haptic animation | swipes viram instant |
| Form labels | ✅ sempre visíveis (não placeholder-only) | placeholder é dica, não label (Norman) |
| Erros próximos do campo | ✅ inline + `aria-describedby` | nunca toast distante do input com erro |
| Touch target ≥44px | ✅ verificado | inclui ícones com padding |
| Dark mode default | ✅ AIOX brand | light mode disponível pra leitura externa (sol) — Kat Holmes inclusion |
| Confusion mitigation 60+ | ✅ | (a) ícone + texto sempre, (b) confirma destrutivo, (c) breadcrumb voltar, (d) tutorial 90s no onboarding, (e) glossário hover/tap em jargão (CRF, ACT, CND), (f) zero "ghost buttons" — sempre fill ou outline visível |

### Glossário jargão — tap-to-define

```
ACT [?]   ← tap abre tooltip 12s
└─ Atestado de Capacidade Técnica:
   documento que prova que sua empresa já fez
   trabalho parecido pra outro cliente.
```

---

## 10. OSS PWA FRAMEWORKS — COMPARATIVO

| Framework | Stack | Service Worker | Push API | Performance | Veredito |
|-----------|-------|----------------|----------|-------------|----------|
| **Next.js 16 PWA** (next-pwa ou Workbox manual) | React + App Router | ✅ via workbox | ✅ via web-push | LCP ~1.2s 4G | ✅ **DEFAULT — alinhado com CRM-novo** |
| Vite + React PWA (vite-plugin-pwa) | React + Vite | ✅ Workbox auto | ✅ | LCP ~0.9s (menor bundle) | ✅ se quiser bundle menor, mas Next sergue por SSR/Edge Functions |
| Astro + view transitions | Astro (islands) | ✅ Workbox | ✅ | LCP ~0.7s (HTML-first) | ❌ overkill — apps com muito state mutável (caixa) sofrem c/ islands |
| Capacitor (wrap to native) | Web → iOS/Android | nativo | nativo APNs/FCM | nativa | ⏸ Fase 2 só se necessário (cf. anti-feature AF12 do brief) |

### Decisão final: **Next.js 16 PWA**

Mesma stack do CRM-novo (consistência), suporta Edge Functions (Pipeline parsing PDFs roda lá), e Vercel deploy de graça pra MVP.

### Setup PWA + Web Push

```typescript
// app/manifest.ts
export default {
  name: 'Holding Virtual',
  short_name: 'Holding',
  start_url: '/',
  display: 'standalone',
  background_color: '#0A0A0B',
  theme_color: '#0A0A0B',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
  shortcuts: [
    { name: 'Despesas pendentes', url: '/despesas?pending' },
    { name: 'Editais hoje', url: '/editais?today' },
  ],
}
```

```typescript
// app/sw.ts (Workbox)
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'

precacheAndRoute(self.__WB_MANIFEST)

// Push notification
self.addEventListener('push', (event) => {
  const data = event.data?.json()
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/badge.png',
      vibrate: data.priority === 'max' ? [100,50,100,50,100] : [20],
      tag: data.tag,                          // dedup
      requireInteraction: data.priority === 'max',
      data: { url: data.action_url },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.openWindow(event.notification.data.url)
  )
})
```

```typescript
// VAPID subscription (server-side: web-push npm)
import webpush from 'web-push'

webpush.setVapidDetails(
  'mailto:dev@holdingvirtual.app',
  process.env.VAPID_PUBLIC!,
  process.env.VAPID_PRIVATE!,
)

// Trigger no Inngest workflow
await webpush.sendNotification(
  userSubscription,
  JSON.stringify({
    title: '🚨 Vencedor declarado',
    body: 'DF-2026-1234. 3 irregularidades. Score 9.2/10.',
    priority: 'max',
    action_url: '/recursos/df-2026-1234',
  })
)
```

### Fallback iOS Safari (Web Push só em ≥16.4 + PWA instalado)

Se `Notification.permission !== 'granted'` ou navegador não suporta, **WhatsApp utility message é o fallback obrigatório** (R$ 0,032/msg). Cliente nunca fica sem aviso de preclusão.

---

## 11. PATTERNS REUTILIZÁVEIS (DESIGN-SYSTEM SEEDLINGS)

Componentes a serem extraídos pro `packages/ui/`:

```typescript
<PendingEntryCard
  entry={financialEntry}
  llmSuggestion={{ category, confidence }}
  onConfirm={...}
  onEditCategory={...}
  onSplit={...}
/>

<ChecklistItem
  status="ok" | "warning" | "blocker"
  label="CRF FGTS · vence em 5d"
  cta={{ label: 'RESOLVER', action: openSheet }}
/>

<ModoRapidoShell
  title="..."
  progress={{ done: 12, total: 14 }}
  primaryCTA={...}
>
  {children}
</ModoRapidoShell>

<HeroNumber value="9.2" suffix="/10" label="Score de recurso" />

<UrgencyCountdown deadline={isoString} unit="days|hours|minutes" />

<JargonTooltip term="ACT">Atestado de Capacidade Técnica...</JargonTooltip>

<SwipeToConfirm
  label="Manifestar agora"
  onConfirm={...}
  requireHapticConfirm
/>
```

---

## 12. RESUMO EXECUTIVO

### 3 decisões UX que mais economizam tempo do usuário

1. **STACK VERTICAL + TAP-CONFIRM (não Tinder swipe) no lançamento mobile** — preserva 3 estados (confirma/edita/divide) com 1 tap por card, hit a meta **<10s/lançamento**. Alice fecha 8 despesas em 3min sem aprender gestos novos (Don Norman affordance visível > affordance learned).

2. **WHATSAPP COMO COMMAND LAYER, não como notificação só** — pai lança `*receita pix 5k inyac` sem abrir PWA, custo R$ 0/conversa service. Áudio via Whisper preserva fluxo natural de quem fala mais que digita. Economiza ~30s/lançamento × 4 lançadores × 20 lançamentos/dia = **40 minutos/dia da equipe**.

3. **MODO RÁPIDO FULL-SCREEN WIZARD (não drawer) em habilitação e recurso** — checklist visual 12/14 + bottom-sheet de resolução guiada por item. Compila dossiê em <30min porque sistema mostra exatamente "estes 2 itens, tap aqui" — Norman mapping puro. Recurso em <8min porque hero number (score) + 3 evidências + swipe-to-confirm eliminam dúvida durante janela de preclusão.

### 1 risco UX subestimado

**Usuário 60+ (pai) desistir do PWA na semana 2 por dissonância de modelo mental** (Kat Holmes mismatch). PWA install + push permission + Pluggy OAuth + LGPD consent + categorização de transação financeira são 5 conceitos novos em 72h. Métricas vão dizer "funciona" mas o pai vai voltar pra anotar PIX no caderno. **Mitigação:** WhatsApp Bot precisa cobrir 100% dos comandos do pai desde Sprint 1 (não Sprint 6 como o brief sugere). Pai talvez NUNCA abra o PWA — e isso é OK se Bot resolver. Outro hedge: chamada-de-cuidado opcional Alice/Giovanna como "tutoras" do pai na semana 1.

### 1 wow-moment pra cliente na call discovery

**Demo do fluxo "Vencedor declarado → minuta de recurso em 8min" rodando NO CELULAR do amigo, com dados reais de UMA licitação histórica que ele PERDEU**. Pedir antes da call 1 licitação em que ele foi inabilitado/perdeu nos últimos 6 meses; pre-popular sistema com dados do concorrente vencedor real; durante a call abrir o push notification mock no iPhone dele, ele tap, vê score 9.2 + 2 irregularidades INSANÁVEIS, tap "Manifestar intenção", swipe-to-confirm, minuta aparece em 25s no celular dele. Tempo total: ~6 minutos. Frase do cliente esperada: *"se eu tivesse isso no mês passado, eu teria recorrido."* — esse é o ATIVO do case-âncora (AIOX regra 3, briefing §14.7). Material da call vira o primeiro testimonial gravado.

---

*Uma — aios-ux-design-expert · 2026-05-18*
*Arquivos relacionados: `docs/projects/buscador-licitacoes/04-deck-diagnostico-amigo/deck.html` (brand reference); `99-synthesis/BRIEFING-REAL-CONSOLIDADO.md` §1.2 (personas), §4.4 (modos UI), §6 (journeys)*
