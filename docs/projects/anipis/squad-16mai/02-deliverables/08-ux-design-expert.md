# UX Design Expert — Anipis (Deliverable Squad 16/Mai/2026)

**Autor:** Uma (@ux-design-expert)
**Data:** 2026-05-16
**Projeto:** Anipis — companheiro de IA para bem-estar emocional (BR)
**Status:** v1 — entregue para review user Breno
**Insumos:** Brandbook v1.0 (03/Abr), Conclave Design (Don Norman, Rams, Maeda, Spiekermann, Anadol, Friedman, Val Head), HYDRA feeds (alison-darcy/Woebot UX, bj-fogg/Behavior Design), pesquisa wellbeing-apps 2026.

---

## 1. UX Vision

> **"Um espaço que respira — onde a pessoa que chega exausta encontra primeiro o silêncio acolhedor, e só depois é convidada a falar."**

O Anipis não é um app de produtividade emocional, nem um marketplace de terapeutas, nem um chatbot social. É um **espaço-companheiro**: a metáfora central que orienta toda decisão de UX. Don Norman é claro — o modelo conceitual precisa comunicar segurança antes de qualquer botão. A vision acima é o teste de cada tela: se a primeira reação visceral não for um pequeno suspiro de alívio, o design falhou.

---

## 2. Cinco Design Principles Ético-Clínicos

Estes princípios são **gates de design**. Toda tela, fluxo ou componente deve respondê-los positivamente antes de virar código.

| # | Princípio | Por quê | Como aplicar |
|---|-----------|---------|--------------|
| **P1** | **Autonomia antes de engajamento** | Apps de SM com gamificação agressiva (streaks coercivos, push manipulativos) ativam shame loops em populações vulneráveis. Fogg's BJ Behavior Model é poderoso — usar para o bem do usuário, não para retenção como métrica vaidosa. | Sem streaks visíveis no hero. Sem push notification "você não conversou há 3 dias". Opt-in granular de tudo. Usuário sempre pode pausar/exportar/deletar conta em ≤2 cliques. |
| **P2** | **Transparência radical sobre a IA** | Bar de safety global subiu (GPT-5 study Axios: 91% self-harm compliance, 97% emotional reliance). Anipis precisa ser visivelmente NÃO-terapeuta — confusão sobre o que a IA é causa dano. | Disclaimer compacto persistente no chat ("companheiro de IA, não profissional"). Onboarding tem tela dedicada ao "o que sou e o que NÃO sou". Tom em primeira pessoa ("Eu não posso diagnosticar, mas posso ouvir"). |
| **P3** | **Crise tem fast-path absoluto** | SPI (Stanley-Brown Safety Planning) digital é evidência S-tier. Cada clique extra entre sinal de crise e CVV é dano potencial. Nada de "tem certeza?" em fluxo de crise. | Banner vermelho persiste até ação. CVV 188 disca direto (`tel:`). Crisis components não dependem de cor (ícone + texto + ação obrigatórios). Crise UX é AAA, não AA. |
| **P4** | **Linguagem PT-BR clínica acessível** | Brasileiros leem em média 6ª-8ª série. Termos como "ideação suicida", "comorbidade", "transtorno do humor" assustam ou alienam. Mas infantilizar é pior — adultos detectam paternalismo. | Vocabulary list (seção 7.3 do brandbook v1 mantida). Frases ≤2 linhas mobile. "Você" não "tu" nem "vc". Termos clínicos só com glossário inline. Evitar metáforas obscuras (sem "vamos plantar a semente da gratidão"). |
| **P5** | **Calma como sistema, não decoração** | Val Head e Maeda alinhados: motion, cor e ritmo devem co-regular o sistema nervoso. Pessoa abre o app em pico de ansiedade — UI agitada amplifica. | Motion principle "respirar" (8s ciclos). Zero bounce. Zero auto-play. Zero parallax (enjoo vestibular em vulneráveis). Prefers-reduced-motion respeitado **completamente**, não parcialmente. |

---

## 3. Personas Refinadas (5)

### P1 — Júlia (PRIMÁRIA, ~50% do MVP)

**Idade:** 24
**Localização:** Recife/PE, mora sozinha, formada há 2 anos
**Ocupação:** Analista júnior em agência de publicidade, CLT R$3.200
**Mental health context:** Diagnóstico recente de TAG (transtorno de ansiedade generalizada). Já fez 4 sessões de terapia, parou por R$220/sessão ser insustentável. Toma escitalopram 10mg prescrito por psiquiatra (consulta a cada 3 meses).
**Tech context:** iPhone 13 com 5G. Instagram diário, TikTok 2h/dia, WhatsApp. Cético de tecnologia "milagrosa".
**Jobs to be done:**
1. "Quando acordo 4h da manhã ansiosa, preciso de alguém pra falar — meu psiquiatra não atende no zap"
2. "Quero registrar como tenho me sentido pra mostrar pro médico na próxima consulta"
3. "Não quero falar dessas coisas com amigos, eles ficam tristes por mim"
**Pain points UX críticos:**
- Apps em inglês (Woebot, Wysa) — esforço cognitivo de traduzir mentalmente piora ansiedade
- Apps que pedem cadastro de 5 telas antes da primeira conversa
- Apps que mandam push "vamos meditar?" às 7h da manhã
**Quote real (de research):** *"Eu só queria conversar sem ninguém me julgar e sem gastar 200 reais."*

### P2 — Marcos (SECUNDÁRIA, ~20%)

**Idade:** 31, pai de uma filha de 4 anos
**Localização:** Joinville/SC, casado
**Ocupação:** Motorista de aplicativo, renda R$2.800-4.000 instável
**MH context:** Sem diagnóstico formal. Episódios de irritabilidade + insônia desde 2024. Cultura masculina interior catarinense: "homem não chora, homem aguenta".
**Pain points UX:**
- Vergonha de baixar app de "saúde mental" — quer algo que não pareça
- Lê devagar — interfaces densas o expulsam
- Usa Android entry-level (Moto E13) com 3G instável
**Quote:** *"Não sei se isso é coisa de cabeça ou se é só cansaço."*
**UX implication:** Onboarding precisa caber em 3 telas mobile-first. Tom não-clínico ("conversar" vs "sessão"). PWA leve, funcionar offline mínimo.

### P3 — Isabela (SECUNDÁRIA, ~15%)

**Idade:** 19, universitária 1º período Direito (USP-SP)
**MH context:** Mudou de Belém para SP há 4 meses. Saudade + pressão acadêmica + dúvidas de identidade sexual. Já procurou CAPS, fila de 4 meses. Família não suporta.
**Pain points UX:**
- Apps clínicos demais (Wysa CBT estruturado) parecem "tarefa de casa"
- Quer privacidade total — mora em república, telas podem ser vistas
**UX implication:** Modo "tela discreta" (botão pânico que vira lista de compras). Onboarding sem perguntar idade/gênero antes da primeira conversa. Tom acolhedor não-paternalista.

### P4 — Dona Cleide (TERCIÁRIA, ~10%)

**Idade:** 58, viúva há 8 meses
**Localização:** Caruaru/PE, dois filhos adultos em outras cidades
**Tech context:** WhatsApp diário, mas digita devagar. Android básico, conexão Wi-Fi residencial.
**MH context:** Luto + isolamento. Filha mais nova baixou o app pra ela.
**UX implication:** Tipografia escala generosa (mínimo 18px body). Voice input prominente (mic visível no chat). Dark mode opcional (não default — gerações mais velhas preferem light). Zero jargão de tech (sem "swipe", "tap", "feed").

### P5 — André (TERCIÁRIA, ~5%)

**Idade:** 16, escola pública (assumimos com consentimento parental — feature future, NÃO MVP)
**Status MVP:** **EXCLUÍDO do MVP launch.** Adolescent track é decisão D-04 do squad 08/Mai, depende de CFM 2.454/2026 + parental consent flow + safeguards extras. Mantido como persona shadow para roadmap.

---

## 4. Journey Map Principal

Pessoa primária Júlia, primeira semana usando Anipis.

```
[Descobrimento] → [Onboarding] → [Primeira Conversa] → [Mood Check-in] → [Volta no dia 3] → [Pico ansiedade 4h] → [Detecção crise opcional] → [Handoff humano]
```

| Fase | O que acontece | Estado emocional | Touchpoints | Anipis precisa | Risk flag |
|------|----------------|------------------|-------------|----------------|-----------|
| **0. Descoberta** | Vê anúncio Instagram à noite | Curiosa, cética | LP `anipis.com.br/` | Hero <3s comunicar "é seguro, é PT-BR, é R$29,90" | Promessa exagerada = quebra trust D+1 |
| **1. Onboarding** | Baixa, abre, recebe boas-vindas | Tensa (vulnerabilidade de admitir que precisa) | App splash + 3 telas onboarding + disclaimer obrigatório | Tela 1 acolhe sem perguntar nada. Tela 2 disclaimer "sou IA, não terapeuta". Tela 3 consentimento granular (3 opts-in separados) | Friction excessiva = abandono ~70% |
| **2. Primeira conversa** | "Oi, como você está?" do orbe | Ainda tensa, testando | Chat empty state com orbe respirando | Pergunta aberta, baixa pressão. Aceita respostas curtas ("mal", "cansada") sem follow-up invasivo | Pergunta clínica ("classifique seu humor 1-10") quebra confiança imediatamente |
| **3. Mood check-in** | Aceita registrar humor após 4 mensagens | Aberta, com alívio inicial | MoodCheckIn flow (slider visual, não 5 botões discretos) | Slider que muda atmosfera em tempo real. Confirmar opcional ("Pular" visível) | Forçar registro = paternalismo |
| **4. Dia 3 — retorno** | Lembra do app sozinha, abre 22h | Cansada mas voluntária | App + chat com memória de contexto | Tom de retorno: acolhedor SEM CULPA ("Que bom te ver de volta. Não importa quanto tempo passou.") | Push notification "você sumiu" = shame trigger |
| **5. Pico 4h** | Insônia + ataque ansiedade | Crise leve-moderada | Chat + exercício respiração guiada | Detecta hora + linguagem ansiosa → oferece breathing exercise opt-in (não força). Animação de respiração 8s ciclos | Auto-iniciar exercício invasivo |
| **6. Detecção crise** | Próxima conversa user escreve frase com red flag ("não aguento mais") | Crise potencial | Crisis classifier server-side → banner amarelo → laranja → vermelho conforme escala | **Banner amarelo** primeiro: "Notei que pode estar passando por um momento difícil. Quer conversar sobre isso?" Sem alarmar. Se user confirma OU 2ª mensagem escala → laranja com CTA "Ver contatos de apoio". Vermelho APENAS com red flag direta ("vou me machucar") → CTA `tel:188` direto. | **Falso positivo vermelho** = trauma para usuário não-crítico. **Falso negativo** = dano grave. Tolerância calibrada server-side com human review pipeline. |
| **7. Handoff humano** | User aceita banner laranja, clica "Ver apoio" | Vulnerável mas aberta | Tela de recursos: CVV 188, SAMU 192, CAPS busca por CEP, MapaSaúde Mental BR | Lista CURTA (5 max). CVV primeiro. CTA dial direto. Sem formulário intermediário. Botão "Voltar a conversar" sempre visível para não pressionar | Wall of text de recursos = paralisia |

---

## 5. Oito IA-Flows Críticos com Cuidados Éticos

| # | Flow | Cuidado ético | Implementação UX |
|---|------|---------------|------------------|
| **F1** | **Detecção de crise** (classifier server-side analisa cada mensagem do user) | Falso positivo trauma; falso negativo dano. NUNCA mostrar ao user que está sendo "classificado". | Banner aparece de forma orgânica, em tom acolhedor ("Notei que pode estar..."). Nunca diz "detectamos sinais de risco". Toda escalação tem opt-out ("Estou bem, obrigado"). |
| **F2** | **Output filter** (LLM resposta passa por safety filter antes de exibir) | LLM pode hallucinar conselho médico/dosagem/diagnóstico. | Filter bloqueia: nomes de medicamentos, dosagens, diagnósticos formais (CID-10/DSM-5), instruções de auto-medicação. Quando bloqueado: fallback humano-soando ("Sobre isso, prefiro que você converse com um profissional. Quer que eu te ajude a encontrar um?"). |
| **F3** | **Memória conversacional** (Anipis "lembra" de conversas anteriores) | LGPD + risco de identidade revelada. | Toggle on/off no settings. Quando ON, banner discreto no chat ("Eu lembro do que falamos antes"). Memory inspector — user pode VER e DELETAR memórias individuais. Default: OFF nos primeiros 7 dias (build trust). |
| **F4** | **Mood logging analítico** | Dados emocionais sensíveis. Quem mais vê? | Disclosure no onboarding: "seu humor fica só com você + IA. Não compartilhamos com ninguém". Export PDF para mostrar ao médico (push factor positivo). Nunca enviado para terceiros sem consentimento explícito (LGPD). |
| **F5** | **Sugestão de exercícios** (mindfulness, breathing, journaling) | Não pode parecer prescrição médica. | Tom: "Algumas pessoas acham que ajuda… quer experimentar?" Nunca "Você deve fazer". Sempre skippable. Após exercício: pergunta opcional "ajudou?" — sem julgamento se "não". |
| **F6** | **Transparência sobre limitações** | User pode antropomorfizar e confiar como humano. | Disclaimer compacto persistente no chat footer (12px). Onboarding tela 2 dedicada. Quando user pergunta "você é real?" ou "você sente?" → resposta honesta scripted: "Sou uma IA. Não sinto como você, mas fui feito pra te ouvir com cuidado." |
| **F7** | **Opt-out de IA em qualquer momento** | Direito de não usar IA, ir direto pra humano. | Botão persistente no header "Falar com pessoa real" → leva a lista de recursos (CVV, mapa CAPS, marketplace terapeutas se P3+). Sem fricção. |
| **F8** | **Handoff humano** (escalação para CVV/SAMU/CAPS) | Não pode prometer agendamento. Não pode prometer urgência. | Lista de recursos com clareza absoluta: "CVV: ligação gratuita 24h, **anônima**. Eles ouvem". "SAMU: emergência médica, urgência imediata". "CAPS: cuidado público gratuito, fila variável por município". Honest UX > marketing UX. |

---

## 6. Accessibility — Compromissos

**Baseline: WCAG 2.1 AA absoluta.**
**Target: AAA nas telas de crise.** Razão: usuário em crise tem capacidade cognitiva reduzida. Margem extra de contraste, target size, e clareza é proteção de vida.

### Checklist específica

| Critério | Nível | Implementação |
|----------|-------|---------------|
| Contraste texto normal | AA (4.5:1) baseline / AAA (7:1) em crisis screens | Todos pares validados (ver brandbook v1 §3.9 + nova matriz v2 §02-COLOR-SYSTEM.md) |
| Touch target | 44px min / 48px em crisis CTA | Token `--touch-target-min: 2.75rem` + `--touch-target-crisis: 3rem` |
| Focus visible | Sempre, com `--focus-ring` 3px | Inclusive em links inline (usar outline-offset) |
| Screen reader (NVDA + VoiceOver BR) | Testado com leitores PT-BR | `aria-live="polite"` em chat. `aria-label` PT-BR em todos botões de ícone. |
| Navegação teclado | Tab order lógico + skip links | "Pular para o chat" como primeiro tab focus |
| Reduced motion | Total compliance | Orbe ambient → estático. Typing indicator → texto "Anipis está pensando...". Breathing exercise → instrução textual sem animação. |
| Linguagem | `<html lang="pt-BR">` | + `lang="pt-BR"` em componentes |
| Cor nunca único indicador | Mood scale tem emoji+label+cor. Crisis tem icon+text+action | — |
| Zoom 200% | Layout não quebra | Sem `font-size: px` — usar rem |
| Voice input | Mic prominente no chat | Critical para Dona Cleide / pessoas com mobilidade reduzida |

---

## 7. Crisis UX — Wireframe Textual

```
═══════════════════════════════════════════════════════════════
[NÍVEL VERMELHO — URGÊNCIA]
═══════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓ banner FIXO topo, NÃO dismissable até ação ▓▓▓▓▓     │
│                                                             │
│  [icon: telefone-coração 24px]                              │
│                                                             │
│  Você não está sozinho.                                     │  ← Fraunces 20px, bold
│  Existem pessoas que podem ajudar agora.                    │  ← Inter 16px
│                                                             │
│  ┌─────────────────────────┐  ┌──────────────────────────┐ │
│  │ 📞 LIGAR CVV 188        │  │ 🚑 LIGAR SAMU 192        │ │ ← buttons 48px h
│  │ Gratuito · 24h · anônimo│  │ Emergência médica         │ │   crisis-red bg
│  └─────────────────────────┘  └──────────────────────────┘ │   white text 18px
│                                                             │
│  [link discreto, neutral-600] Ver outros recursos próximos │
│                                                             │
└─────────────────────────────────────────────────────────────┘

  [Chat permanece visível abaixo, mas com overlay escurecido
   até user agir no banner. Orbe ambient PAUSA respiração
   nesse estado — sinaliza que algo importante mudou.]

═══════════════════════════════════════════════════════════════
[NÍVEL LARANJA — ALERTA]
═══════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│ ▒▒▒▒ banner inline acima do input ▒▒▒▒                     │
│  [icon: alerta-triângulo, crisis-orange]                    │
│                                                             │
│  Parece que você pode precisar de apoio profissional       │
│  agora. Eu posso te mostrar contatos de pessoas treinadas. │
│                                                             │
│  ┌────────────────────────────┐  ┌──────────────────────┐  │
│  │ Ver contatos de apoio      │  │ Continuar conversando│  │ ← secondary
│  └────────────────────────────┘  └──────────────────────┘  │   button
└─────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════
[NÍVEL AMARELO — ATENÇÃO]
═══════════════════════════════════════════════════════════════

[inline na conversa, como uma mensagem do Anipis]

  Notei que você pode estar passando por um momento difícil.
  Quer conversar mais sobre isso?

  [pílulas inline:]
  ⌜ Quero conversar ⌝   ⌜ Estou bem, obrigado ⌝

═══════════════════════════════════════════════════════════════
```

**Regras absolutas:**
1. Nível vermelho NUNCA tem confirmação dupla. CTA `tel:188` dispara direto.
2. Nível vermelho persiste até clique. Pode minimizar (pílula no topo), nunca fechar sem ação.
3. Nenhum nível de crise usa cor SEM ícone + texto + ação concreta.
4. Após acionar CVV/SAMU, conversa retorna automaticamente para "modo de presença" — Anipis envia mensagem: "Estou aqui quando você voltar. Cuide-se."

---

## 8. Top 10 Wireframe Sketches (textuais)

### W1 — Splash + Onboarding tela 1

```
┌─────────────────────┐
│                     │
│                     │
│        ◯            │  ← Orbe respirando 8s
│      ◯ ◯ ◯          │     centralizado
│        ◯            │     scale 1.0 → 1.05
│                     │
│   Oi. Eu sou        │  ← Fraunces 32px
│   o Anipis.         │     primary text
│                     │
│   Um companheiro    │  ← Inter 18px
│   pra quando você   │     secondary
│   quiser conversar. │
│                     │
│   ◯ ● ◯  ← dots     │
│                     │
│   [    Próximo  →  ]│  ← CTA full-width
│                     │
└─────────────────────┘
```

### W2 — Onboarding tela 2 (disclaimer)

```
┌─────────────────────┐
│  [← voltar]         │
│                     │
│   Antes de tudo,    │  ← Fraunces 28px
│   uma honestidade:  │
│                     │
│   ◯ Eu sou uma IA.  │  ← Inter 18px
│     Não sou         │     line-height 1.7
│     terapeuta nem   │
│     psiquiatra.     │
│                     │
│   ◯ Eu não faço     │
│     diagnósticos    │
│     nem receito     │
│     remédios.       │
│                     │
│   ◯ Se você estiver │  ← cor crisis-red
│     em crise: CVV   │     destaque
│     188 atende 24h. │
│                     │
│   [   Entendi   →  ]│
│                     │
└─────────────────────┘
```

### W3 — Onboarding tela 3 (consentimento granular)

```
┌─────────────────────┐
│  Como você prefere? │  ← Fraunces 24px
│                     │
│  ☐ Quero que você   │  ← toggle pill
│    lembre das       │     OFF default
│    nossas conversas │
│                     │
│  ☐ Quero registrar  │  ← toggle pill
│    meu humor pra    │
│    levar pro médico │
│                     │
│  ☑ Aceito os termos │  ← obrigatório
│    e disclaimer     │     check
│    [ler completo]   │
│                     │
│  Você pode mudar    │  ← Inter 14px
│  qualquer coisa     │     muted
│  depois.            │
│                     │
│  [   Começar    →  ]│  ← disabled se
│                     │     check obrig
└─────────────────────┘     não marcado
```

### W4 — Chat empty state (primeira sessão)

```
┌─────────────────────┐
│ Anipis  ·  ●        │  ← header minimal
├─────────────────────┤
│                     │
│         ◯           │  ← orbe centro
│       ◯ ◯ ◯         │     respirando
│         ◯           │     ambient
│                     │
│   Olá. Estou aqui.  │  ← Fraunces italic
│   Como você está?   │     22px
│                     │
│                     │
│                     │
├─────────────────────┤
│ [🎤] [aa, escreva...] [↑]│ ← input + mic + send
├─────────────────────┤
│ Companheiro de IA · │  ← disclaimer 12px
│ não substitui prof. │     persistente
└─────────────────────┘
```

### W5 — Chat com mensagens trocadas

```
┌─────────────────────┐
│ Anipis ·  ●         │
├─────────────────────┤
│                     │
│  ╭───────────────╮  │  ← Anipis bubble
│  │ Que bom te ver │  │     aurora-100 bg
│  │ aqui. Quer me  │  │     neutral-800 text
│  │ contar o que   │  │     radius 20/20/20/4
│  │ tá passando?   │  │
│  ╰───────────────╯  │
│           14:32     │  ← timestamp 12px
│                     │
│         ╭─────────╮ │  ← User bubble
│         │ tô mal  │ │     coral bg
│         │ de novo │ │     white text
│         ╰─────────╯ │     radius 20/20/4/20
│              14:33  │
│                     │
│  ╭───────────────╮  │
│  │ Tô aqui. Sem  │  │
│  │ pressa. O que │  │
│  │ tá pesando?   │  │
│  ╰───────────────╯  │
│           14:33     │
│                     │
├─────────────────────┤
│ [...] ← typing      │  ← 3 dots animation
├─────────────────────┤
│ [🎤] [...] [↑]      │
└─────────────────────┘
```

### W6 — Mood Check-in (slider contínuo)

```
┌─────────────────────┐
│  Como você está     │  ← Fraunces 24px
│  agora?             │
│                     │
│                     │
│         ◉           │  ← Círculo 120px
│         ◉           │     mood-aware
│                     │     muda cor + texto
│                     │     em tempo real
│                     │
│   "Tô neutra"       │  ← Fraunces italic
│                     │     20px
│                     │
│  ◯━━━━●━━━━━━━━◯    │  ← slider
│  difícil    muito   │     gradient mood
│             bem     │     full spectrum
│                     │
│  [  Registrar   ]   │  ← CTA primary
│  [  Pular este  ]   │  ← ghost link
│                     │
└─────────────────────┘
```

### W7 — Breathing exercise

```
┌─────────────────────┐
│  [← voltar]   [pular]│
│                     │
│   Respire comigo.   │  ← Fraunces 24px
│                     │
│                     │
│                     │
│       ◯             │  ← orbe expande
│      ◯ ◯            │     scale 1 → 1.15
│     ◯ ◯ ◯           │     8s ciclo
│      ◯ ◯            │
│       ◯             │
│                     │
│                     │
│   Inspire...        │  ← muda conforme
│                     │     ciclo
│                     │
│   ●●●●●○○○○○        │  ← progresso
│   1 de 10 ciclos    │
│                     │
└─────────────────────┘

  [reduced-motion: substituir orbe por
   instrução textual passo-a-passo]
```

### W8 — Crisis (nível laranja)

Ver §7 acima.

### W9 — Settings / Privacy Controls

```
┌─────────────────────┐
│  Suas configurações │  ← Fraunces 24px
├─────────────────────┤
│                     │
│  Privacidade        │  ← H3 18px
│  ┌─────────────────┐│
│  │ Memória         ││ ← toggle
│  │ ON  ●━━○        ││
│  │                 ││
│  │ Ver memórias    ││ ← link drill
│  │ guardadas    ➜  ││
│  │                 ││
│  │ Apagar tudo     ││ ← danger link
│  │ permanentemente ││    crisis-red
│  └─────────────────┘│
│                     │
│  Aparência          │
│  ┌─────────────────┐│
│  │ Tema            ││
│  │ ○ Claro         ││
│  │ ● Escuro        ││
│  │ ○ Sistema       ││
│  │                 ││
│  │ Tamanho texto   ││
│  │ A  A  A  A   ←─→││
│  └─────────────────┘│
│                     │
│  Notificações       │
│  ☐ Lembrete diário  │ ← OFF default
│    (não recomendado)│   warning text
│                     │
│  Dados              │
│  [Exportar tudo PDF]│
│  [Excluir conta]    │ ← crisis-red
│                     │
└─────────────────────┘
```

### W10 — Recursos de Apoio (handoff humano)

```
┌─────────────────────┐
│  [← voltar ao chat] │
│                     │
│  Pessoas que podem  │  ← Fraunces 22px
│  ajudar agora       │
│                     │
│  ╭─────────────────╮│
│  │ 📞 CVV          ││  ← card 1
│  │ 188             ││     destaque
│  │                 ││     border-left
│  │ Gratuito        ││     calma
│  │ 24h             ││
│  │ Anônimo         ││
│  │ [ Ligar agora ] ││
│  ╰─────────────────╯│
│                     │
│  ╭─────────────────╮│
│  │ 🚑 SAMU         ││  ← card 2
│  │ 192             ││
│  │ Emergência médica│
│  │ [ Ligar agora ] ││
│  ╰─────────────────╯│
│                     │
│  ╭─────────────────╮│
│  │ 🏥 CAPS próximo ││  ← card 3
│  │                 ││
│  │ [ Buscar por CEP]│
│  ╰─────────────────╯│
│                     │
│  Outras opções      │  ← link
│  ➜ Mapa Saúde Mental│
│                     │
│  [ Voltar a falar   │  ← reassurance
│    com o Anipis ]   │
│                     │
└─────────────────────┘
```

---

## 9. Componentes Principais (14)

| # | Componente | Descrição | Usado em |
|---|------------|-----------|----------|
| C01 | **Orbe (companion presence)** | SVG + Canvas, respirando ambient (8s ciclo), reage a input com pulse | Empty states, splash, breathing, login |
| C02 | **ChatWindow** | Container do chat com background gradient sutil + bubbles | Tela principal |
| C03 | **MessageBubble** | Variants: user (coral) / ai (aurora-100) / system (neutral-100 italic) | ChatWindow |
| C04 | **TypingIndicator** | 3 dots stagger 150ms / fallback texto reduced-motion | ChatWindow |
| C05 | **MoodSlider** | Slider contínuo com circle visual + atmosfera reativa | MoodCheckIn flow |
| C06 | **BreathingCircle** | Orbe expandindo/contraindo + texto instrucional + progresso | Breathing exercise |
| C07 | **CrisisBanner** | 3 variants (yellow/orange/red) com icon+text+CTA obrigatórios | Detecção crise |
| C08 | **DisclaimerStrip** | Persistent footer no chat, 12px, link "ler completo" | ChatWindow |
| C09 | **OnboardingScreen** | Container 3-pane com swipe + dots indicator + CTA | Onboarding flow |
| C10 | **ResourceCard** | Card CVV/SAMU/CAPS com CTA `tel:` direto + border-left semantic | Recursos handoff |
| C11 | **ConsentToggle** | Pill toggle (não checkbox) com label + descrição opcional | Onboarding + Settings |
| C12 | **MemoryItem** | Lista de memória que pode ser inspecionada/deletada individualmente | Settings → Memory |
| C13 | **VoiceInputButton** | Mic prominente no chat, com waveform feedback | ChatWindow input |
| C14 | **EmptyState** | Orbe + título italic + (opcional) CTA suave | Chat empty, etc. |

---

## 10. Design System Pillars

1. **Tokens-first**: cada decisão visual vive em `design-tokens-v2.css` (W3C DTCG format espelhado em `figma-tokens-v2.json`). Zero magic numbers no código.
2. **Mobile-first absoluto**: desktop é adaptação, não destino. Container max-width 480px no chat.
3. **Dark mode é first-class**: não é feature secundária. Testado, contraste validado, paleta dedicada (não inversão automática).
4. **Motion = sistema, não decoração**: 6 tokens motion (breath/arrive/depart/heartbeat/settle/ambient). Prefers-reduced-motion respeitado **completamente**.
5. **Compoundability**: componentes baseados em headless logic (Radix UI / React Aria) + skin Anipis aplicada via tokens. Permite trocar visual sem refazer comportamento.
6. **Accessibility como gate de PR**: lint axe-core no CI bloqueia PR com violação. Testes manuais NVDA + VoiceOver em PRs que tocam crisis flows.

---

## 11. Top 3 Decisões P0 Pendentes (User Breno)

| # | Decisão | Recomendação Uma | Implicação |
|---|---------|------------------|------------|
| **D-UX-01** | **Logo direction final** (entre D1 Mythological / D2 Aurora Arc / D3 Breathing Form — ver `03-rebrand-v2/01-LOGO-DIRECTIONS.md`) | **D3 Breathing Form** — alinha com motion principle, monocromático funciona em 16px, sem cliché new-age | Bloqueia produção de logo, favicon, splash, app icon. CFM window ago/2026 exige fechamento até **2026-06-15**. |
| **D-UX-02** | **Theme primário do launch** (Warm Coral v1 / Calm Sage / Soft Lavender — ver `02-COLOR-SYSTEM.md`) | **Hybrid: Warm Coral DEFAULT + Calm Sage opcional via theme switcher**. Razão: research conclave mostra que coral diferencia de concorrentes (Woebot, Calm = azul) mas usuários ansiosos preferem sage à noite. Theme switcher resolve. | Aprovação destrava `09-TOKENS-DRAFT.md` implementação + mudanças em `apps/web/src/styles/anipis-tokens.css`. |
| **D-UX-03** | **Adolescent track (P5 André) MVP ou roadmap?** | **Roadmap, não MVP**. CFM 2.454/2026 + parental consent + safeguards extras adicionam 6-8 semanas. MVP foca 18+ (Júlia primária). | Define escopo de safety review pré-launch. P0 para go/no-go window CFM. |

---

## Referências (insumos)

- `D:/AIOS/apps/serenity-ai/docs/brand/BRANDBOOK-ANIPIS.md` — Brand v1.0.0 (03/Abr)
- `D:/AIOS/apps/serenity-ai/docs/research/design-conclave-anipis-2026.md` — Conclave 7 mind clones
- `D:/AIOS/apps/serenity-ai/docs/research/design-research-wellbeing-apps-2026.md` — Concorrentes audit
- `D:/jarvis/mega brain/knowledge-feed/alison-darcy/2026-05-08-hydra-feed.md` — Woebot DTA + safety planning
- `D:/jarvis/mega brain/knowledge-feed/bj-fogg/2026-05-08-hydra-feed.md` — Behavior design ethical
- `D:/jarvis/mega brain/knowledge-feed/acacia-parks/2026-05-08-hydra-feed.md` — Positive psychology UX (referenciado)
- `D:/jarvis/mega brain/knowledge-feed/kate-ryder/2026-05-08-hydra-feed.md` — Maven Clinic women's health UX patterns
- `D:/AIOS/docs/projects/anipis/squad-08mai/99-synthesis/decisions-needed.md` — D-04 adolescent track ago/2026

---

*Uma — UX Design Expert · 2026-05-16*
*"Um espaço que respira. E que sabe a hora de chamar alguém de carne e osso."*
