# Inventário do Frontend Atual (as-is) — referência de reconstrução

> Gerado por agente Explore em 11/Jun/2026. Resumo executivo abaixo; contratos que NÃO podem quebrar em destaque.

## Rotas (29)

- **Públicas:** `/` (landing v3), `/invite/[code]`, `/privacidade`, `/termos`, `/manifesto`, `/transferencia-internacional`
- **(auth):** `/signup`, `/login`, `/callback` + route handler `/auth/callback`
- **(app)** (layout: BottomNav + BetaTesterOverlay): `/chat`, `/mood`, `/dashboard`, `/exercises` (+ phq9/gad7/breathing/thought-record), `/breathing` (placeholder vazio), `/settings` (+ emergency-contacts, link-professional), `/beta-guide`
- **(professional):** `/painel` (role professional|admin)
- **Internal:** `/internal/dashboard` (key por query param)
- **Onboarding:** `/onboarding` (7 passos)

## Onboarding as-is (7 passos, Zustand)

1. WelcomeStep (disclaimer LGPD/CVV) → 2. PersonalContextStep (displayName obrigatório + motivo opcional 6 emojis) → 3. AgeGateStep (dd/mm/yyyy, <18 = AgeBlockedScreen com CVV/SAMU/CAPS, conta suspensa) → 4. ConsentStep (4 checkboxes Art.11) → 5. ConsentFlow granular (4 categorias) → 6. InternationalTransferConsent (Art.33, scroll-gate, aceitar OU modo limitado sem IA) → 7. CompletionStep.
Finaliza com 3 POSTs em sequência: `/consent` + `/consents` + `/consents/international-transfer`, depois `/onboarding` → `{conversationId}`.

## Chat as-is

- WS `${API_WS}/chat/ws`: client manda `{type:'auth',token}` e `{type:'message',content,conversationId}`.
- Server manda: `auth_ok`, `chunk` (streaming token), `done`, `crisis_response` (crisisColor red|orange|yellow + resources), `assistant_message`, `error`, `acknowledgment`.
- Crise: RED = CrisisFullScreen (sem dismiss leve, botão "Está tudo bem?"); ORANGE = CrisisAlert modal + banner; YELLOW = banner dismissível. Fallback hardcoded CVV 188 / SAMU 192.
- Fallback HTTP POST `/chat/message` se WS cair (3 retries, backoff).
- Store zustand chat-store (conversations, messages, appendToken/finalizeStreaming, crisisModal/crisisBanner, connectionState).
- Componentes: ChatWindow (orquestrador), MessageList (aria-live), ChatBubble, ChatInput (auto-expand, max 2000), ConversationSidebar (drawer mobile), TypingIndicator, DisclaimerBanner ("não substitui acompanhamento profissional").

## Endpoints REST (contratos intocáveis)

`/api/invite/validate` · `/api/invite/consume` · `/auth/sync` · `/consent` · `/consents` · `/consents/international-transfer` · `/onboarding` · `/chat/conversations` (+`/{id}/messages`) · `/chat/message` · `/mood` + `/mood/history?days=` + `/mood/latest` · `/exercises/catalog|history|stats` + POST `/exercises` + `/exercises/{id}/complete` · `/assessments/{type}/history` · `/emergency-contacts` CRUD + `/primary` · api-client injeta Bearer e trata 401→/login.

## Conteúdo legal (preservar conteúdo, reapresentar)

- `data/onboarding-texts.ts`, `data/consent-flow-texts.ts`, `data/legal-data.ts` (DPO/controller/versions), páginas server `/privacidade` v2.0 (17 seções) e `/termos` v2.0.
- Consents Art.11: healthDataProcessing, aiProviderDisclosure, privacyPolicyAccepted, ageConfirmed — todos obrigatórios.
- Art.33: scroll-gate anti-dark-pattern, opções simétricas, recusa = modo limitado.

## Navegação as-is

BottomNav mobile 4 abas (Chat, Exercícios, Resumo, Config); desktop sem nav dedicada além de sidebar do chat. `/breathing` é placeholder morto. Página `/dashboard` com bugs conhecidos (vars não usadas).

## Estado

Zustand: user-store, chat-store, onboarding-store. Sem Context API.

> Mapa completo (tabelas por componente) no transcript do agente; este resumo cobre o que o rebuild precisa respeitar.
