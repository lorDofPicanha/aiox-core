# CONTEXT — Cold outreach EUA (site + automação embutida)

> **Leia PRIMEIRO.** Criado 2026-08-08. Extensão internacional do `_outreach/` brasileiro.
> Envio **100% humano**. Nenhum disparo automático, em nenhuma etapa. Ver `feedback_ai_never_autosend`.

---

## 1. Decisões travadas pelo founder (08/Ago/2026)

| # | Decisão | Valor |
|---|---|---|
| U1 | Mercado | **EUA apenas.** Único país onde cold e-mail B2B é inequivocamente legal |
| U2 | Oferta | **Combinada** — site *com automação embutida*, uma coisa só. Não é "faço sites" nem "faço IA" |
| U3 | Canal | **E-mail** como canal primário (revisão da recomendação de 04/Ago — ver §5) |
| U4 | Remetente | **`@gmail.com`** — decidido pelo founder 08/Ago, ciente do trade-off do §4 |
| U5 | Volume | **20/semana ≈ 4/dia**, enviados **à mão**, um a um. Sem mail-merge |

**U2 é a decisão que sustenta o preço.** Site sozinho é commodity ($500–5.000 atacado, corrida pro fundo).
Site que *atende* sai da categoria. Vale o D5 de `docs/projects/aiox-site/00-context/CONTEXT.md`:
*"site é a porta, automação de workflow é o negócio"* — aqui a porta e o negócio viajam juntos no mesmo pitch.

---

## 2. 🔴 CAN-SPAM — o que é obrigatório

Cold B2B nos EUA é legal **sem consentimento prévio**, mas com quatro obrigações. Violação = **até
US$ 53.088 por e-mail** (valor corrigido; conferir o teto vigente antes do primeiro disparo).

| Obrigação | O que significa na prática |
|---|---|
| **Header e remetente verdadeiros** | `From`, `Reply-To` e domínio reais. Nada de disfarce |
| **Assunto não enganoso** | O assunto tem que descrever o conteúdo |
| **Endereço postal físico válido** | 🔴 Ver §3 — conflita com regra do founder |
| **Opt-out funcional, honrado em 10 dias** | Link ou frase clara. Uma vez pedido, nunca mais escrever |

Extra que não é lei mas derruba entrega: identificar-se como mensagem comercial e **nunca** insistir
depois de um "não".

---

## 3. 🔴 Conflito: endereço postal × "não identificar cidade de origem"

Decisão do founder de **01/Ago**: *"não identificar cidade de origem em nenhuma peça — vale para
e-mail, WhatsApp, assinatura e proposta."*

CAN-SPAM **exige endereço postal físico válido** em toda mensagem comercial. Os dois não convivem.

**Saída recomendada:** contratar **virtual mailbox nos EUA** (Anytime Mailbox, PostScan Mail,
iPostal1 — faixa US$ 10–25/mês). Resolve os dois problemas de uma vez:
1. Cumpre CAN-SPAM com endereço real e verificável
2. **Some com a origem brasileira** — que era o objetivo da regra de 01/Ago
3. Bônus: endereço americano sobe a credibilidade no mercado que ele está atacando

⚠️ Endereço postal **não** é o mesmo que presença fiscal. Não cria obrigação tributária nos EUA por
si só — mas **confirmar com contador** antes de contratar, não deduzir daqui.

---

## 4. Infra de envio — decisão U4 (`@gmail.com`)

### Por que funciona neste volume

O alerta de "Gmail não serve pra cold e-mail" é **verdadeiro para disparo em volume** (50+/dia por
ferramenta, SMTP relay, mail-merge). **Não se aplica a 4/dia enviado à mão**, que é volume de e-mail
humano normal.

| Item | Com domínio próprio | **Com `@gmail.com` a 4/dia** |
|---|---|---|
| SPF/DKIM/DMARC | você publica | ✅ **o Google já assina** |
| Aquecimento | 30 dias, piso | ✅ **nenhum — começa hoje** |
| Reputação do remetente | zero (domínio novo) | ✅ **decadas de `gmail.com`** |
| Custo | domínio + mailbox | ✅ **zero** |
| Credibilidade da oferta | ✅ | 🔴 **ver abaixo** |

🔑 **Domínio novo tem reputação ZERO.** Para *entrega pura*, `gmail.com` é mais forte que um domínio
registrado semana passada. O trade-off real não é entrega — é credibilidade.

### 🔴 Os dois custos que sobram

1. **Credibilidade, e é específica desta oferta.** Você vende **site e presença digital** para
   empresa americana. Chegar de `@gmail.com` entrega a objeção mais óbvia que existe:
   *"you build websites but you don't have your own email?"* É um negativo suave, não fatal —
   solo operator com Gmail é comum nos EUA — mas nesta oferta ele bate mais forte que na média.
2. **Risco de suspensão.** As Program Policies do Gmail proíbem "unsolicited commercial messages".
   A 4/dia, personalizado, com opt-out honrado, o risco é baixo — a fiscalização é movida por
   denúncia. Mas não é zero.
   → 🔴 **Usar uma conta Gmail SEPARADA, nunca a principal.** Se suspender, não leva junto o e-mail
   pessoal/de trabalho.

### Regras de operação

| Regra | Motivo |
|---|---|
| **Conta Gmail dedicada** (não a pessoal, não a do TALOS) | isola o risco de suspensão |
| **Enviar pela interface do Gmail, um a um** | mail-merge a 4/dia é risco sem ganho |
| ❌ **Nenhuma extensão de mail-merge / SMTP relay** | é o que dispara o classificador de bulk |
| Teto **10/dia**, mesmo que dê vontade | mantém o padrão indistinguível de e-mail humano |
| Opt-out honrado **no mesmo dia** | §2 — e é o que mantém a denúncia em zero |
| Bounce < 2% | lista suja é o que queima conta, mais que volume |

### Checklist antes do primeiro disparo

- [ ] Conta Gmail dedicada criada
- [ ] Nome de exibição profissional (não apelido)
- [ ] Assinatura com `{seu_nome}` + `{telefone}` + endereço postal US (§3)
- [ ] Lista de supressão criada
- [ ] Virtual mailbox contratado

### Quando migrar pra domínio

Gatilho: **passar de ~10/dia**, ou primeira venda fechada. Aí o domínio se paga sozinho e a
credibilidade vira gargalo. Nada da sequência muda — só o remetente.

---

## 5. Por que e-mail, se em 04/Ago a pesquisa disse DM/telefone

A pesquisa de 04/Ago concluiu que, **para site de $650**, o canal certo era IG DM ou telefone — porque
o hero mockup é *imagem* e chega inteiro, sem filtro de spam, sem link.

**O que mudou:** a oferta agora é **combinada** (U2). Isso desloca três coisas:

| | Site $650 (04/Ago) | Site + automação (08/Ago) |
|---|---|---|
| Ticket | baixo | **maior** — suporta ciclo mais longo |
| Decisor | dono, no celular | dono/gerente, **na caixa de entrada** |
| Prova | imagem do hero | **hero + demonstração funcionando** |

Um link para preview ao vivo em `*.vercel.app` (grátis, já usado em `talos-site-neon` e
`bretda-export`) entrega mais que a imagem: ele *clica e usa*. Isso o DM não faz bem.

⚠️ **Expectativa a calibrar:** cold e-mail bem feito responde 5–12%; LinkedIn DM dá 10,3%. E-mail
não é o canal de maior taxa — é o de maior **volume auditável e escalável**. Se em 3 semanas der 0
resposta em 60 e-mails, o problema é a **lista ou o assunto**, não a copy.

---

## 6. Regras herdadas que valem aqui inteiras

- 🔴 `feedback_ai_never_autosend` — IA rascunha, **humano envia**. Sem exceção.
- 🔴 **Hero mockup antes do contato, site completo só após 50% adiantado.** A 5% de conversão,
  construir antes do contato dá **$4/h**; só o hero dá **$36/h**.
- 🔴 **Filtro de matéria-prima:** sem **foto usável** (Google Business Profile, feed do IG), o
  prospect **não entra na lista**. Sem foto → mockup genérico de IA → é exatamente o que não vende.
- 🔴 **Não forkar site vivo de terceiro** = infração de copyright, e é o tipo que é descoberto.
  Usar **3–5 templates próprios por nicho**.
- 🔴 `{seu_nome}` e `{telefone}` ficam **em branco** nos rascunhos — não preencher por dedução.
- 🔴 `{observação_específica_real}` preenchido **à mão, por prospect**. Genérico = spam = e-mail morre.

---

## 7. Pendências

~~Confirmar domínio~~ → ✅ **resolvido por U4: `@gmail.com`. Não há mais bloqueio de 30 dias.**

1. ⬜ Criar **conta Gmail dedicada** (§4)
2. ⬜ Contratar virtual mailbox (§3) — **único item que ainda gasta dinheiro e leva dias**
3. ⬜ Founder escolher **nicho + cidade** (recomendação em `01-ICP.md` §1)
4. ⬜ Construir **3 templates próprios** do nicho
5. ⬜ Rodar sourcing da primeira lista de 20
6. ⬜ Construir os 20 heroes (0,5h cada)
7. ⬜ **Cronometrar um build ponta a ponta** — herdado de 04/Ago, ainda é o dado que decide se o
   preço fecha ($400 ÷ 8h = R$256/h · ÷ 40h = R$51/h, pior que CLT)

## 8. Arquivos

```
_outreach/usa/
├── 00-CONTEXT.md      ← este arquivo
├── 01-ICP.md          ← quem entra na lista + fonte de dados + gate de foto
└── 02-SEQUENCE-EN.md  ← sequência de 3 e-mails em inglês
```

Herda de: `_outreach/cold-outreach-v1.md` (estrutura da sequência, métrica, infra) ·
`_outreach/tools/enriquecer-email.py` · `_outreach/tools/gerar-dossies.py`
❌ **Não** herda: `extrair-pncp.py` e `extrair-receita-local.py` são Brasil puro.
