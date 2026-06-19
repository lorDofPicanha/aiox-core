# Concierge MVP — Experimento de Validação (6 semanas)

> O próximo passo eleito pelo conclave (`13`). Provar a **Value Hypothesis** ANTES de construir qualquer infra. Wizard of Oz: o cliente vê um produto; nos bastidores é Breno + AIOS rodando à mão.
> **Data:** 2026-06-10 · **Dono:** Breno (operação) + Renan (recrutamento) · **Base:** `13-conclave-validacao-features.md`, `00-context/CONTEXT.md`

---

## 1. A hipótese sendo testada (uma frase)

> **"O dono de escritório contábil paga — recorrente ou success-fee — por um LAUDO que aponta divergências de tributação (cClassTrib/NCM) + crédito recuperável, com trilha de boa-fé que o protege da multa."**

Não estamos testando se conseguimos capturar nota (commodity, sabemos que sim). Estamos testando **disposição a pagar pelo veredito defensável**. Tudo que não serve a essa pergunta fica fora.

## 2. Por que Concierge (e não construir)

- Captura, e-CAC, agente local, golden-set automatizado = **infra que só se constrói depois de saber que alguém paga** (Eric, consenso do conclave).
- O risco fatal é a **sequência**: queimar 8 meses de runway automatizando uma commodity antes de validar o moat.
- Nas 6 semanas, o "motor" e o "golden-set" **somos nós** rodando manual. O laudo é real; a automação é fingida.

## 3. Escopo do experimento

**DENTRO:**
- 5 escritórios da carteira do Renan (profundos, não 50 rasos).
- Para cada: 2-5 clientes-alvo de **alto SKU** (farmácia, posto, mercado — onde monofásico/divergência é mais provável).
- XMLs **exportados à mão** pelo próprio contador (do e-CAC/sistema dele) e entregues a nós.
- Análise **manual** (Breno + AIOS) nos bastidores.
- Entrega do **LAUDO** (ver §4), white-label com a marca do escritório.
- **Cobrança real** (ver §6).

**FORA (não construir):** agente local, captura automática, integração e-CAC, emissor, app, portal, dashboard, golden-set automatizado, value-metric billing. Nada disso.

## 4. O LAUDO (o artefato que vende)

O laudo é o produto. Nasce já com os elementos que o conclave disse serem o que faz pagar:

1. **Divergências de tributação por item** — produto, NCM aplicado, cClassTrib/CST aplicado vs referência, natureza da divergência (ex.: "monofásico tributado como tributação normal"). Aponta **o campo exato** a corrigir (estilo Analisador Fortes).
2. ⭐ **Confidence calibrada / "onde NÃO sei"** — cada apontamento com grau de certeza; divergência sobre regime cClassTrib disputado é marcada como tal, não afirmada (Chip + Heleno). Um laudo que finge certeza absoluta é o que vira prova de indução.
3. **Estimativa de crédito monofásico recuperável** (5 anos retroativos) — em linguagem "oportunidade de revisão / R$X em divergência potencial", **nunca** "crédito garantido".
4. ⭐ **Classificação de risco jurídico do PER/DCOMP** — administrativo seguro vs judicial vs borderline (75%/150%), com a base normativa de cada crédito.
5. ⭐ **Trilha de boa-fé** — proveniência de cada apontamento (norma, Nota Técnica, data, fonte). É o escudo do escritório no auto de infração — o moat.
6. **Resumo executivo** legível pro contador **revendê-lo ao cliente final** (ele é o herói; resolve o conflito de canal).

**Disclaimer obrigatório (Heleno):** o laudo informa indícios; o parecer e a PER/DCOMP são do contador/tributarista responsável habilitado. O software não protocola nada.

## 5. Roteiro operacional (6 semanas)

| Semana | Atividade |
|--------|-----------|
| **0** | Renan recruta 5 escritórios; alinhar expectativa (piloto pago de diagnóstico, não software pronto). Coletar 1º lote de XMLs. |
| **1-2** | Rodar análise manual dos 5; produzir os primeiros laudos; iterar o formato com 1-2 contadores (o laudo está legível? acionável? ele revenderia?). |
| **3-4** | Entregar laudos completos; **apresentar a cobrança** (ver §6); registrar objeções reais. |
| **5** | Fechar os pagamentos / success-fees; medir. |
| **6** | Decisão persevere/pivot + retro: tempo real de operação por escritório (testa o "serviço em software é difícil" do Roberto). |

## 6. O teste de pagamento (o único actionable metric)

Carta de intenção **NÃO conta**. Dinheiro trocando de mão, ou contrato de success-fee assinado, conta.

Duas portas (o contador escolhe):
- **Recorrente:** piloto pago R$300-500/mês pelo laudo recorrente de monitoramento de divergência.
- **Success-fee:** contrato de 15-25% sobre crédito recuperado de pelo menos 1 cliente (o tributarista parceiro/contador assina a PER/DCOMP).

## 7. Critério de decisão (definido ANTES — sem mover a trave)

- **PERSEVERE:** **≥3 dos 5** escritórios pagam (recorrente real **ou** 1 success-fee assinado). → libera construir Fase 1 (motor + golden-set + trilha).
- **PIVOT:** 1-2 pagam → reformular oferta/segmento/laudo e repetir com outros 5.
- **KILL/repensar:** 0 pagam → a Value Hypothesis falhou; a dor não é paga (revisitar a tese, não automatizar).

## 8. Métricas

**Actionable (decidem):** nº de escritórios que pagam; valor de crédito **recuperado** (não "identificado"); tempo real de operação por escritório (custo da operação manual).
**Vanity (ignorar):** nº de NFs processadas, NCMs analisados, "interesse", reuniões agendadas.

## 9. Riscos do experimento & mitigação

| Risco | Mitigação |
|-------|-----------|
| Análise manual erra (falso-positivo) → queima cliente do Renan | Confidence conservadora; marcar disputado como disputado; tributarista revisa antes de entregar |
| Contador adora mas não paga (WTP baixa em mensalidade) | A porta success-fee captura quem não paga mensalidade; mede o bolso certo |
| Operação manual não escala (Roberto) | É justamente o que medimos na semana 6 — se 1 laudo custa 3 dias, a Fase 1 precisa atacar isso |
| Renan não recruta 5 | Começar com 2-3; ajustar; o gargalo do comercial é dado, não bug |

## 10. O que isto desbloqueia

Sinal verde aqui → construir **Fase 1** (`13` §Feature Set): motor de auditoria cClassTrib/NCM (regras+RAG, golden-set, confidence) + trilha de proveniência/boa-fé. **Nada de captura/e-CAC/emissor antes disso.**
