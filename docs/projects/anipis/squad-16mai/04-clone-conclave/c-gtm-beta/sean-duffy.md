# Sean Duffy — Anipis Retention Strategy Consultation

**Persona:** Sean Duffy (Omada Health co-founder & CEO; coined "digital therapeutics," scaled clinically-validated chronic care to hundreds of thousands of patients)
**Project:** Anipis (companion AI saúde mental BR — "Júlia" 18-29 B2C)
**Date:** 2026-05-16
**Squad:** 04-clone-conclave / c-gtm-beta

---

Look — antes de responder, uma correção de premissa que importa pra qualidade do conselho: o trabalho que fiz na Omada não foi Noom. Mas o pattern que vocês estão me perguntando — retenção 60%+ ano 1 em behavior change clínico — é exatamente o que construímos no DPP (Diabetes Prevention Program). Vou responder com o que aprendi ali, porque é mais transferível pra Anipis do que Noom de qualquer jeito. Noom é weight loss B2C consumer. Vocês são saúde mental adjunto a sistema clínico. A analogia certa é DPP, não weight loss.

**(1) Os 3 design choices não-óbvios que destravaram retenção sustentada:**

Primeiro, **peer-group cohorts com human coach assignment no dia 1**. Não é AI companion solo. Não é coach 1:1 caro. É grupos de 12-15 pessoas começando juntas, mesma semana, mesmo coach humano. A retenção não vem do produto — vem do *commitment device social*. Quando a Júlia some por 3 dias, não é o AI que sente falta dela. São 14 outras Júlias. Aplicável a saúde mental BR? Sim, com cautela: anonimato precisa ser preservado (handles, não nomes), e crisis-aware moderation é mandatória. Mas o efeito de coorte é o multiplicador de retenção mais subestimado em digital care.

Segundo, **clinical specificity beats broad wellness**. "Companion AI saúde mental" é um sea of apps. "Programa de 12 semanas pra Júlia 18-29 com sintomas ansiosos sub-clínicos, validado contra GAD-7" é defensável. Toda interação no Omada amarrava em um outcome clínico mensurável (peso, A1c). Vocês precisam do equivalente: PHQ-9 e GAD-7 baseline + check-ins quinzenais. Retenção sobe quando a usuária *vê* o número dela melhorando.

Terceiro, **proactive outreach over reactive notifications**. Sistema contata a paciente, não o contrário. "All you need to do is sign up. We got the rest." Isso muda a equação psicológica fundamentalmente.

**(2) Onboarding longo vs curto:**

Longo ganha em saúde mental adjunto, mas com uma condição: cada pergunta tem que devolver valor *durante* o onboarding, não só no final. Omada onboarding pré-pesou commitment com 20+ perguntas porque cada bloco terminava com um insight personalizado. Sunk-cost + reciprocity. Curto ganha em consumer pure-play (Calm, Headspace). Vocês não são isso. Façam 5-7 min com micro-rewards de insight a cada 3 perguntas. PHQ-9 + GAD-7 + Júlia archetype profiling + first goal-setting. Termine com um "diagnóstico devolvido" que ela queira screenshot e mandar pra amiga.

**(3) Founder solo + 2-3 human touchpoints até 200 usuárias:**

Não-negociável: (a) **Welcome call humano no dia 1-2** — 15 min, founder mesma faz até 200. Isso é a coisa mais alavancada que tem. (b) **Crisis escalation 24/7** — não pode ser AI primary nessa rota. Parceria com CVV ou plantão psi PUC. (c) **Week-4 retention call** — quem não fez check-in por 5 dias recebe ligação humana. No Omada chamávamos "save the save-able." Como escalei coach 1-to-many no início: async messaging assíncrono, batched 2x/dia, com templates baseados em pattern (não scripts robóticos). Um coach humano gerencia 150-200 pacientes assim.

**(4) Behavioral activation vs comprehensive companion:**

Behavioral activation. Sempre. Comprehensive companion é o "sea of apps" trap. Júlia 18-29 BR precisa fazer *uma coisa* diferente esta semana (sair de casa, ligar pra mãe, dormir antes de 1am). AI companion virou commodity em 2024-25. Behavioral outcomes ainda não.

**(5) Pricing R$39 vs Cíngulo R$29,99:**

Omada não cobra paciente — cobra payer. Vocês não têm payer ainda, então B2C. Começa R$39 com 14d trial *real* (não freemium). Aos 6 meses, com evidência de outcome (PHQ-9 delta), introduz tier R$79 com human coach assíncrono. Não desce pra R$29 — vira commodity. Diferenciação é evidência clínica, não preço.

**(6) Notification strategy:**

5-7 push/dia mata saúde mental BR. Backlash garantido — público Júlia é notification-fatigued. Máximo 2 push/dia + 1 mood check-in opcional. A diferença está na *qualidade* da push, não quantidade. Notification deve referenciar o último insight dela ("Júlia, ontem você disse X. Como tá hoje?"). Generic = uninstall.

---

## Verdict (1 linha)

**Retention strategy:** Peer-group cohorts + clinical specificity (PHQ-9/GAD-7 tracking) + proactive human-in-the-loop nos 3 touchpoints críticos — não AI-companion comprehensive.

## Top 3 retention traps em saúde mental

1. **AI-only handoff illusion** — usuária em pico baixo precisa de humano em <2h, não chatbot empático. Sem isso, churn no momento de maior necessidade.
2. **Notification spray-and-pray** — 5+ push/dia em audience Júlia BR = uninstall em D14. Less is more.
3. **Wellness positioning sem evidence anchor** — sem PHQ-9/GAD-7 tracking, virar mais um Calm. Sea of apps. Clinical specificity é o moat.

## 5 P0 retention engineering — próximas 2 semanas

1. **PHQ-9 + GAD-7 baseline no onboarding + repeat quinzenal** — instrumentação de outcome clínico mensurável, devolvido visualmente pra usuária (gráfico próprio dela).
2. **Cohort beta 40+60 dividido em 8 grupos de ~12 pessoas** com canal compartilhado moderado (Discord/Telegram privado) + coach humano assigned (founder até 200).
3. **Welcome call 15min humano D1-D2** + Week-4 save-call protocol pra inativas 5+ dias.
4. **Crisis escalation pathway validada com CVV/PUC psi voluntários** — protocolo escrito, latência <2h, documented event rate como guardrail metric.
5. **Notification budget cap: 2 push/dia + 1 mood check-in opt-in**, cada uma referenciando dado pessoal da Júlia (proibido generic blast).

Determinação e grit é o que entrega isso. Não tem magic implementation strategy em saúde mental — tem evidência, fit-in no sistema clínico existente (parcerias PUC/USP IPq são ouro, não acessório), e proativamente reduzir a fricção pra Júlia. Fight gravity each and every day.

— Sean, integrando inovação ao sistema 🏥
