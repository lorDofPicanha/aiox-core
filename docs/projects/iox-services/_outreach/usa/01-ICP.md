# ICP — quem entra na lista (EUA)

> Criado 2026-08-08. Depende de `00-CONTEXT.md`.

---

## 1. Nicho + cidade — recomendação

**Nicho: specialty trade contractors** (roofing, HVAC, remodeling, pool, landscaping) com **escritório**
e faturamento estimado **US$ 1–10M**.
**Cidade: Tampa, FL.** Alternativa: Phoenix, AZ.

### Por que este nicho

| Critério | Trade contractors | Med spa / dental |
|---|---|---|
| Foto usável abundante | ✅ foto de obra em todo GBP | ✅ feed de IG forte |
| Dor de automação quantificável | ✅ **ligação perdida = job de US$ 8–15k** | 🟡 no-show, menos óbvio |
| Orçamento | ✅ | ✅ |
| **Camada regulatória** | ✅ **nenhuma** | 🔴 **HIPAA** — automação toca PHI, exige BAA |
| Dono lê e-mail | 🟡 dono não, **office manager sim** | ✅ |

🔴 **Med spa e dental são tentadores e foram descartados por HIPAA.** Qualquer automação que
encoste em agendamento, intake ou histórico toca *protected health information* — exige Business
Associate Agreement e infra compatível. É negócio, mas não é o primeiro.

### Por que Tampa

1. 🔑 **Fuso: EDT = UTC-4, uma hora de diferença do Brasil.** As respostas caem no horário de
   trabalho dele. Phoenix (UTC-7) são 4 horas — resposta chega quando ele já parou.
2. Mercado de contractor enorme e permanente: furacão + telhado + ar-condicionado o ano inteiro
3. Menos saturado por agência que Austin ou Miami
4. Crescimento populacional alto = negócio novo entrando o tempo todo

⚠️ Uma cidade + um nicho por vez. Lista larga com copy rasa é o erro que matou os 4 extratos
antigos do pipeline brasileiro.

---

## 2. Filtros — entra na lista

**Os 5 obrigatórios (todos, sem exceção):**

1. **Tem foto usável** — Google Business Profile ou feed de IG com foto de obra/equipe/fachada em
   resolução decente. 🔴 **Sem foto, não entra.** É o gate que separa hero real de mockup genérico de IA.
2. **Site ruim ou inexistente**, em negócio que depende de ser achado — não "sem site" puro.
   Quem não tem site em 2026 normalmente **decidiu** que não precisa. O alvo é site que existe e
   converte mal: sem mobile, sem formulário, template de 2015, sem foto do próprio trabalho.
3. **Prova de que é achado** — 15+ reviews no Google. Sem review, o negócio não vive de busca e o
   pitch inteiro morre.
4. **Decisor alcançável** — dono ou office manager com nome e e-mail **corporativo** (`@dominio.com`).
5. **Sinal de vida** — postou, respondeu review ou atualizou horário nos últimos 90 dias.

**Exclui:**
- Franquia de rede nacional (decisão não é local)
- Já tem agência óbvia (site recente e bom, pixel de agência, rodapé "site by…")
- Só e-mail pessoal (`@gmail`, `@yahoo`) — base legal mais fraca e caixa que não é lida como canal
  de negócio. Vale o achado brasileiro de 03/Ago: **empresa maior tem domínio próprio**
- Sem foto (repetido de propósito — é o filtro que mais gente pula)

---

## 3. Fonte de dados

🔴 **`extrair-pncp.py` e `extrair-receita-local.py` NÃO servem** — são API brasileira.

| Etapa | Fonte | Traz |
|---|---|---|
| 1. Lista bruta | **Google Places API** (Text Search + Place Details) | nome, endereço, telefone, site, rating, review count, **fotos** |
| 2. Reforço | **Apify** (token em `D:/jarvis/apify.env`, REST direto) | scraper de Google Maps e de IG, quando Places não dá foto |
| 3. Qualificação do site | fetch + análise | tem mobile? formulário? foto própria? ano do template? |
| 4. E-mail do decisor | scrape da página de contato/about do próprio site | e-mail corporativo, nome do dono |
| 5. Enriquecimento | Hunter.io ou Apollo (**só se 4 falhar**) | padrão de e-mail do domínio |

🔑 **Ordem importa.** O e-mail do próprio site do prospect é mais confiável e mais barato que
ferramenta de enriquecimento — e mais defensável juridicamente (é publicado pela própria empresa
como canal de negócio).

⚠️ **Google Places cobra por request.** Rodar com cache em disco e checkpoint por página — vale o
padrão que salvou a coleta do PNCP em 03/Ago: `os.replace` atômico, retomada por lote, **primeiro
plano**. 🔴 *Tarefa longa em segundo plano é morta neste ambiente, sem aviso.*

---

## 4. Score — ordem de ataque

| Sinal | Peso |
|---|---|
| Foto excelente (obra própria, boa luz) | +3 |
| Site claramente ruim mas negócio claramente bom (50+ reviews, 4.5+) | +3 |
| Sem formulário de contato no site | +2 |
| Site não responsivo no mobile | +2 |
| E-mail corporativo do dono (não `info@`) | +2 |
| Respondeu review nos últimos 30 dias (= presta atenção) | +1 |
| Só `info@` ou formulário | −1 |
| Site recente e bom | −3 |

**Corta em 6+.** Atacar de cima pra baixo, ~20/semana personalizados à mão.

---

## 5. Meta e métrica

**20 e-mails/semana**, personalizados à mão. Nunca contar artefato — contar isto:

| Semana | Enviados | Bounce | Respostas | Conversas | Vendas |
|---|---|---|---|---|---|
| | | | | | |

Resposta esperada em B2B frio bem feito: **5–12%** → 1–2 conversas/semana.
🔴 **0 resposta em 60 e-mails = problema de lista ou assunto, não de copy.** Não reescrever a copy antes disso.
