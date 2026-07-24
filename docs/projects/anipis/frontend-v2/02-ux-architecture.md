# UX Architecture v2 — Anipis

> Síntese de: inventário as-is (research/00), benchmarks de onboarding (research/02), benchmarks de chat (research/01). Mandato: tudo novo, só cores ficam, contratos API/legais intocáveis.

## 1. Modelo mental do produto

**"Um caderno, uma companheira, você."** O app é um LUGAR (diário privado) habitado por uma PRESENÇA (Anipis). Não é um app de produtividade com chat acoplado; o chat É a página do caderno de hoje. Decisões derivadas:

- A tela central não se chama "Chat" — chama-se **Hoje** (a conversa do dia / a página aberta).
- Histórico de conversas não é "sidebar de threads" estilo SaaS — é o **Diário** (linha do tempo das páginas passadas, com humor do dia).
- Tudo que é "sistema" (conta, dados, crise, export, delete) mora num único lugar: **Você**.

## 2. Navegação (IA)

Tab bar inferior fixa, **3 destinos** (consenso Material/HIG, dossiê 02 §17), presente apenas pós-onboarding:

| Aba | Rota | Conteúdo |
|---|---|---|
| **Hoje** (central, default) | `/hoje` (nova; `/chat` redireciona) | Conversa corrente + mood do dia integrado |
| **Diário** | `/diario` | Linha do tempo: conversas passadas + check-ins + exercícios feitos |
| **Você** | `/voce` | Nome, consents (gerenciar), exportar dados, apagar conta, contatos de emergência, recursos de crise, sair |

- Desktop: mesma IA, tab vira rail lateral esquerdo estreito (ícone+rótulo), conteúdo centrado max-w prosa.
- **Exercícios** (respiração, PHQ-9, GAD-7, registro de pensamento): não ganham aba — são **convites em contexto** (a Anipis oferece no chat; o Diário lista os feitos; "Você" tem o catálogo discreto). Mata o "hub abarrotado" (anti-padrão Stoic).
- `/dashboard` morre como tela de usuário (vira seção "seu caminhar" dentro do Diário). `/breathing` placeholder morre. `/painel` (profissional) e `/internal` ficam fora do redesign (telas operacionais).

## 3. Fluxo de entrada (6 passos — dossiê 02)

1. **Login** — sem cadastro (beta fechado, credenciais pré-criadas). Tela mínima: wordmark, e-mail, senha, CTA verde fixo. "Que bom te ver."
2. **Boas-vindas** (1-2 telas) — valor e tom ANTES de qualquer pedido. Uma frase por tela, muito respiro. "A Anipis é um espaço só seu — um diário privado e uma companheira para conversar, quando você quiser."
3. **Consent LGPD em camadas** — OBRIGATÓRIO antes do chat. Camada 1: resumo humano com 3 ícones (o que guarda · privacidade · seu controle) + antecipação de export/delete como sinal de confiança. Ações afirmativas explícitas (4 consents Art.11 + granulares + Art.33 com scroll-gate), sem pré-marcação, botões de peso igual, "Ler texto completo" preserva o jurídico integral. **Os 3 POSTs e o conteúdo legal as-is permanecem** — muda a apresentação (de 3 passos burocráticos para 1 sequência em camadas com substeps).
4. **Nome** — "Como você gostaria que a Anipis te chamasse?" (estilo Finch: significado, não formulário). Age-gate (dd/mm/aaaa) entra aqui como substep discreto (obrigação legal; <18 → tela de bloqueio com CVV/SAMU/CAPS preservada).
5. **Primeiro check-in** — emoji+palavra, 5 níveis ([😟 Difícil] [😕 Pra baixo] [😐 Neutra] [🙂 Bem] [😀 Ótima]), "porquê" opcional em texto livre. Primeira amostra do produto-diário.
6. **Primeira conversa** — cai no Hoje; a Anipis fala primeiro, acolhendo pelo nome. Tab bar aparece pela primeira vez. "Oi, {nome}. Estou aqui com você. Pode começar por onde quiser — ou só desabafar."

Mapeamento técnico: passos 2-5 = `/onboarding` reconstruído (mesmo POST /onboarding ao final + 3 POSTs de consent no passo 3). Barra de progresso fina no topo (Finch). Voltar sempre possível; nada skipável que seja legal.

## 4. Tela Hoje (chat) — spec (dossiê 01: Pi/ustwo, ChatGPT/Claude, Wysa)

**Modelo "página, não mensageiro"** (padrão Pi confirmado em teardown):
- **Anipis: texto serif full-width SEM bolha e SEM avatar** — assenta direto no creme, tom editorial/carta.
- **Pessoa: bolha discreta** (surface-recess, radius generoso), alinhada à direita mas larga (texto de diário, não SMS).
- **Zero timestamps visíveis** (fonte: teardown Pi — "no date or time stamps"); data só como separador de dia no Diário.
- Largura de leitura ~65ch centrada; espaçamento entre turnos generoso (respiro > densidade).

**Conversa:**
- A Anipis fala primeiro, sempre — empty state = saudação calorosa com pergunta aberta, nunca menu de capacidades.
- Streaming token-a-token (WS `chunk`) com layout estável (sem pulos); `acknowledgment` → presença imediata; indicador de digitação com personalidade serena (não 3 bolinhas genéricas; cursor pulsante na cor da marca).
- **Botão parar** durante geração (padrão ChatGPT/Claude).
- NÃO copiar do Pi: travar scroll durante geração (deixar a pessoa rolar livre).

**Composer:**
- Textarea auto-expansível, placeholder serif itálico ("Escreva o que estiver aí dentro…"), máx 2000.
- Desktop: Enter envia, Shift+Enter quebra. **Mobile: Enter QUEBRA linha, envio só no botão** (diário = texto longo; dossiê 01).
- Disclaimer sutil sob o composer ("A Anipis acompanha, não substitui acompanhamento profissional").

**Crise (protocolo Wysa: reconhecer→avaliar→agir + contratos as-is):**
- RED = tela cheia sem motion · ORANGE = modal + banner · YELLOW = banner. Tijolo #8f2c1b, mesma voz calma (sem alarme vermelho).
- Entrada de ajuda persistente e discreta no header do Hoje (CVV 188 a um toque) + seção em Você.
- Mood do dia integrado no topo da página (chip emotion), não tela separada obrigatória.

## 5. Diário

- Linha do tempo vertical (mais recente no topo): cada dia = card com humor (chip emotion), primeira linha da conversa, exercícios do dia.
- Tocar abre a conversa daquele dia em modo leitura (continua = volta pro Hoje com aquela conversa ativa — mapeia conversations as-is).
- Seção "seu caminhar" (antigo dashboard): tendência de humor 14d, PHQ-9/GAD-7 se houver — visual calmo, sem gamificação, sem streaks.

## 6. Você

Lista única, calma: Nome/como a Anipis te chama · Consentimentos (gerenciar granulares as-is) · Contatos de emergência (CRUD as-is) · Exportar meus dados (Art.18) · Apagar minha conta (Art.18, confirmação séria) · Recursos de crise (CVV/SAMU/CAPS sempre visíveis) · Profissional vinculado (link as-is) · Tema (claro/escuro/auto) · Sair. Beta: link discreto pro guia + feedback.

## 7. Telas fora do app (públicas)

Landing, login e legais seguem o mesmo sistema novo (login é o passo 1 do flow). Landing: reescrita mínima coerente com o sistema (não é foco do 10/10 do app, mas não pode destoar).

## 8. Sistema visual (fundação — detalhe na fase Stitch)

- **Cores: invariantes** (01-paleta-invariante.md).
- Tipografia: serif de leitura como voz do produto (títulos e voz da Anipis) + sans humanista pra UI — PÁGINA EM BRANCO, decidir na fase de direção visual com base no dossiê 01 (Pi usa serif no corpo).
- Espaçamento: escala generosa (página de caderno, não dashboard).
- Motion: entrada suave única por tela, transições de página tipo "virar página" sutil; ZERO motion em crise; prefers-reduced-motion total.
- Componentes: reconstruídos do zero sobre os mesmos contratos (átomos novos).

## 9. O que explicitamente morre

Landing v3 atual, auth atual, onboarding 7-passos burocrático, ChatWindow/sidebar SaaS, BottomNav 4 abas, dashboard como tela, /breathing placeholder, arte botânica de 11/Jun, todos os componentes visuais atuais.
