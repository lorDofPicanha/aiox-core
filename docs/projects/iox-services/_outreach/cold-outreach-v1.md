# Outreach v1 — Agência de integração de IA

**Criado:** 2026-08-01 · **Envio:** 100% humano (Breno). Nenhum disparo automático.
**Restrição de copy (definida pelo founder):** não afirmar resultado entregue a cliente. Permitido: o que foi construído/é operado + economia potencial da IA.

---

## 1. O que pode e o que não pode ser dito

### ❌ Proibido (não temos)
- "Aumentei X% do faturamento do cliente Y"
- "Reduzi 80% do tempo de triagem" — sem cliente, sem medição
- Cases do Alan (Rodrigo Lins, Lucas fisio, Lígia TJ, Rodrigo Feldman) — **são da comunidade dele, não nossos**
- CPL R$6,02 do Bretda — número real, mas de campanha que gerou zero venda. Cherry-picking.

### ✅ Verdadeiro e utilizável
| Ativo | Frase honesta |
|---|---|
| Bretda + Tocks | "Opero duas indústrias de móveis. As contas de mídia rodam por API, com auditoria automatizada." |
| — | ⚠️ **Não identificar cidade de origem em nenhuma peça.** Decisão do founder, 01/Ago. Vale para e-mail, WhatsApp, assinatura e proposta. |
| Noyce / ENIAC | "Construí um sistema que lê edital do PNCP e cruza com os atestados da empresa — triagem de licitação que era manual." |
| Confit Haus | "Montei CRM com WhatsApp oficial pra uma operação de alimentação." |
| Contador (Renan) | "Estou construindo a plataforma de apuração da Reforma pra um escritório com 900 clientes." |
| AIOS | "Tenho uma infraestrutura própria de agentes que é o que me deixa entregar em semana o que agência entrega em mês." |

**Regra:** falar de **capacidade construída**, nunca de **resultado prometido**. É mais honesto e, para empresário cético, é mais forte.

---

## 2. O ângulo

Todo mundo que bate na porta dele promete resultado. A diferenciação é a inversão:

> **"Não vou te prometer resultado. Vou te mostrar o seu número."**

Vende-se o **diagnóstico**, não a integração. O diagnóstico produz a evidência que justifica o projeto (Regra dos 10x exige isso). Sem o número, não há base pra cobrar.

Sequência: **Dor → Ensino → Revelação** (nunca revelar a oferta no primeiro toque).

---

## 3. E-mail 1 — abertura fria

**Assunto:** `uma conta que quase ninguém faz aí na {empresa}`
*(alternativas: `{primeiro_nome}, uma pergunta sobre o {processo}` · `o custo escondido do {processo} manual`)*

```
{primeiro_nome}, tudo bem?

Sou o Breno. Opero duas indústrias de móveis e construo sistemas de IA
pra dentro de operação — não sou consultor de slide.

Vi que a {empresa} {observação_específica_real}. Isso normalmente vem
junto de um processo que ninguém mede: {processo_suspeito}.

A conta que quase ninguém faz: pega quantas horas/mês a equipe gasta
nisso, multiplica pelo custo/hora carregado. Na maioria das operações
que abro, dá entre R$ 8k e R$ 40k por mês em trabalho que hoje é
repetitivo o bastante pra sair da mão de gente.

Não vou te prometer número — eu não conheço a sua operação ainda.
Mas se quiser, eu te mando em 3 linhas como eu levantaria esse
cálculo aí dentro. Sem compromisso e sem apresentação.

Faz sentido?

Breno de Cerqueira
{telefone} · {site}
```

**Por que funciona:** dor quantificada sem alegar resultado · prova de operador na 2ª linha · pedido minúsculo (não é reunião, é permissão pra mandar 3 linhas) · faixa R$8-40k é honesta porque é declarada como *faixa observada*, não promessa.

> ⚠️ Preencher `{observação_específica_real}` **na mão, por prospect**. Se for genérico, vira spam e o e-mail morre. Sem observação real → não envia.

---

## 4. E-mail 2 — follow-up (D+4, só se não respondeu)

**Assunto:** `Re: {assunto anterior}`

```
{primeiro_nome}, subindo esse aqui uma vez só.

O cálculo que eu mencionei, resumido:

1. Liste os 3 processos onde alguém repete a mesma decisão toda semana
2. Horas/mês × custo-hora carregado (salário × 1,7 com encargos)
3. Quanto disso é decisão de verdade e quanto é só transporte de dado

O item 3 é onde mora o dinheiro. Costuma ser 60-80% do tempo — e é
exatamente a parte que IA faz bem hoje, com humano aprovando no fim.

Faço isso como trabalho pago e fechado: entro na operação por duas
semanas, saio com o mapa e o número. Se o número não justificar
projeto nenhum, eu te falo isso e a gente encerra.

Quer que eu te mande como funciona?

Breno
```

**Por que funciona:** entrega valor real mesmo se ele nunca comprar (o método é utilizável sozinho) · "se não justificar, eu te falo" é reversão de risco sem custo · "humano aprovando no fim" mata o medo #1.

---

## 5. E-mail 3 — encerramento (D+10)

**Assunto:** `Re: {assunto anterior}`

```
{primeiro_nome}, encerro aqui pra não virar chateação.

Se em algum momento a {empresa} olhar pra um processo e pensar
"isso aqui não devia consumir tanta gente", me chama. Guardo teu
contato e não te escrevo de novo.

Abraço,
Breno
```

**Por que funciona:** encerramento honesto tem a maior taxa de resposta da sequência. E cumprir o "não te escrevo de novo" é o que protege a reputação do domínio.

---

## 6. WhatsApp — só como segundo toque

> **Nunca como primeiro contato.** Cloud API exige opt-in para mensagem iniciada pela empresa; disparo frio derruba o número. Usar só se: (a) ele respondeu e-mail, (b) ele te deu o número, ou (c) é indicação de alguém.

```
{primeiro_nome}, aqui é o Breno — {quem_conectou / do e-mail sobre {processo}}.

Mandei o raciocínio por e-mail, mas resumo em uma linha: quero
entender quanto tempo a {empresa} gasta em {processo} hoje.

Se tiver 15 min essa semana eu te mostro como levanto esse número.
Se não fizer sentido, sem problema nenhum.
```

Curto, sem link no primeiro envio (link em WhatsApp frio pesa contra), uma pergunta só.

---

## 7. Infra de envio (antes do primeiro disparo)

| Item | Por quê |
|---|---|
| **Domínio separado** (ex: `iox-corp.com.br`) | Não queimar o domínio principal se algo der errado |
| **SPF + DKIM + DMARC** | Sem isso vai direto pra spam. Não negociável. |
| **Aquecimento 2-3 semanas** | Domínio novo disparando em volume = bloqueio imediato |
| **Teto 20-30/dia por caixa** | Acima disso o provedor marca como bulk |
| **Opt-out em toda mensagem** | LGPD: base de legítimo interesse B2B exige descadastro fácil |
| **Registro da origem do dado** | LGPD art. 7º/IX — precisa saber de onde veio cada contato |

**LGPD, resumo:** contato **profissional** (e-mail corporativo, empresa) com oferta **pertinente à atividade** dele se sustenta em legítimo interesse. O que derruba é: dado pessoal, oferta irrelevante, ausência de opt-out, insistência após "não". A sequência acima respeita os quatro.

---

## 8. ICP — quem entra na lista

**Inclui (os 4):**
1. 10-200 funcionários (menor não tem orçamento; maior tem TI interno e comitê)
2. Processo documental/repetitivo no core (nota, contrato, laudo, edital, pedido, cadastro)
3. Decisor alcançável — dono, sócio ou diretor com nome público
4. Sinal de vida digital (site atualizado, LinkedIn ativo, vaga aberta)

**Exclui:** já tem squad de dados/IA interno · agência/consultoria (vende o mesmo) · faturamento que não sustenta R$15k de setup.

**Verticais por cicatriz** (onde o Breno tem direito de jogo real):
1. **Contabilidade** — canal do Renan, dor regulatória datada (ago/2026)
2. **Marcenaria / móveis sob medida / indústria moveleira** — Vale do Itajaí é polo; ele opera duas
3. **Empresas que vendem para o poder público** — Noyce/ENIAC já resolve triagem de edital

---

## 9. Métrica (a única que importa)

Não contar artefatos. Contar:

| Semana | E-mails enviados | Respostas | Conversas | Diagnósticos vendidos |
|---|---|---|---|---|
| | | | | |

Meta inicial: **20 e-mails/semana, personalizados na mão.** Taxa de resposta esperada em B2B frio bem feito: 5-12%. Isso é 1-2 conversas por semana. Se em 3 semanas der 0 resposta em 60 e-mails, o problema é a lista ou o assunto — não a copy.
