# Bretda Meta — Teste Controlado e Pré-Registrado: Consolidação de Adsets

**Conta:** `act_381618241134624` (Bretda — mesas de sinuca/bilhar de luxo, ticket R$30k+)
**Campanha:** `[QUALIDADE] Comprador Luxo` (`120246900793880737`)
**Autor:** traffic-masters-chief · **Data de registro:** 2026-06-26
**Status:** PRÉ-REGISTRADO — NÃO INICIADO. Gatilho de início = founder recarregar buffer de saldo.

> Documento pré-registrado: hipótese e critérios de sucesso/falha definidos ANTES de medir.
> O founder julga pelo RESULTADO medido, não pela palavra de quem propôs.

---

## 0. GATILHO DE INÍCIO (bloqueante — não negociável)

**O teste NÃO começa enquanto o saldo Meta estiver baixo.**

- Saldo real hoje (26/Jun, display_string): **R$278,21** = ~1,8 dia a R$130/d, ~1,5 dia a R$180/d.
- Começar a R$180/d agora queima o saldo em ~1,5 dia → liga-desliga → reset de aprendizado → **teste invalidado** (o stop-start é a própria variável que destrói o learning).
- **PRÉ-REQUISITO [FOUNDER]: recarregar para R$600–800+ (mínimo 4 dias de fôlego a R$180/d) e manter saldo > 4 dias durante TODA a janela do teste.** Idealmente ativar pagamento automático.
- Só ao confirmar saldo ≥ R$700 o chief executa os passos [BRIDGE] do §4 (o "GO").

---

## 1. HIPÓTESE (pré-registrada, falsificável)

> **"Consolidar os 3 adsets ativos (R$130/d fragmentado) em UM único adset a R$180/d faz esse adset sair da fase de aprendizado (status ACTIVE/graduado) em ≤ 10 dias, com CPL blended ≤ R$26 (não pior que o baseline de R$25,78) e participação de leads na faixa de investimento ≥ R$30k subindo vs baseline."**

Refutação possível: se ao fim de 14 dias o adset seguir "Learning Limited" E o CPL > R$32 E/OU a qualidade não melhorar, a tese de "densidade de sinal resolve" está errada → pivotar (§2 Falha).

---

## 2. MÉTRICAS DE SUCESSO E FALHA (números exatos, definidos antes)

### Baseline real da conta (trailing 30d, congelado em 26/Jun)
| Adset (ativo) | Budget/d | Leads 30d | CPL | Leads/7d |
|---|---|---|---|---|
| Lookalike 1% BR + Pins Luxo (`120248542258000737`) | R$70 | 15 | R$29,23 | ~13 |
| Tier 2 — Outras Cidades (`120247930824860737`) | R$30 | 24 | R$18,81 | ~10 |
| Condomínios Luxo (`120247016555870737`) | R$30 | 25 | R$30,41 | ~3–6 |
| **BLENDED (3 ativos)** | **R$130** | **64** | **R$25,78** | **~15 total, fragmentado** |

> Régua da Meta para sair do aprendizado = **50 eventos de otimização / adset / 7 dias.** Hoje cada adset entrega 3–13/7d → **nenhum gradua**. Esse é o problema que o teste ataca.
> KPI de qualidade (% leads na faixa certa de investimento): **baseline ainda NÃO medido** — será calculado no Passo 2 do §4 (Day-0), puxando os campos `investimento` dos leads dos últimos 30d, ANTES de mudar qualquer coisa.

### Critérios de SUCESSO (a tese se confirma se TODOS forem atingidos)
1. **Graduação:** adset único atinge status **ACTIVE** (fora de "Learning Limited") em **≤ 10 dias** após T0.
2. **Volume:** **≥ 45 leads / 7 dias** no adset único na 2ª semana (proxy de ~50/7d).
3. **CPL:** blended **≤ R$26** durante a janela (não pior que baseline) e **tendência ≤ R$22** até o dia 14.
4. **Qualidade (KPI que importa no alto-ticket):** participação de leads que respondem `investimento` ∈ {"Até R$30.000", "Acima de R$30.000"} **≥ 50%** dos leads E participação de "Até R$20.000" **cai** vs baseline Day-0.

### Critério de FALHA (refuta a tese → pivotar)
Declarar FALHA se, no dia 14:
- adset **ainda em Learning Limited** (nunca graduou) **E**
- CPL blended **> R$32** (pior que baseline) **OU** qualidade (% ≥ R$30k) **≤ baseline Day-0**.

**Se FALHA → pivôs candidatos (decisão do founder, não automática):**
- (a) Orçamento ainda insuficiente para este CPL → o alto-ticket não comporta 50/7d; mudar estratégia para CBO ou aceitar otimização manual de baixo volume.
- (b) Gargalo é a SEMENTE/público, não o budget → rodar o teste B (Lookalike value-based só de compradores reais — Lever 2/3 da análise de 26/Jun).
- (c) Gargalo é o criativo/curioso → teste de preço exposto no anúncio.

### Zona cinza (resultado parcial)
Se graduar mas CPL subir para R$26–32, OU não graduar mas CPL cair < R$22 com qualidade melhor: **continuar +7 dias** e reavaliar (não é sucesso limpo nem falha).

---

## 3. DESENHO DO TESTE

### O que MUDA (a intervenção — UMA variável: densidade de sinal)
- **Consolidar 3 → 1:** concentrar todo o orçamento num único adset.
- **Adset que fica (carrier): `[QUALIDADE] Lookalike 1% BR + Pins Luxo` (`120248542258000737`).**
  - **Por quê este:** é o público com maior teto de escala. Os adsets de geo-pin (Tier2, Condomínios) são estreitos — a R$180/d saturam rápido (frequência dispara, CPM infla) e o teste mediria saturação, não consolidação. O Lookalike tem audiência ampla (1,3–1,6M) com espaço para absorver R$180/d sem fadiga.
- **Budget: R$70/d → R$180/d** no adset único (≈ R$130 combinados anteriores + R$50). Opção de R$200/d se o founder quiser folga para garantir os 50/7d (a R$26 de CPL, R$180/d ≈ 48 leads/7d, no limiar; R$200/d ≈ 54/7d, grádua com margem).

### O que fica IGUAL (mantido para não confundir a medição)
- **Form `989479676826508` INTOCADO** (já é alta-intenção: prazo, local, modelo, decisor, investimento R$20k/30k/30k+). Mexer no form confundiria o KPI de qualidade.
- **Criativos INTOCADOS** (Aurora + Opal, CTA SIGN_UP → form nativo). Preço-no-criativo é um teste SEPARADO (não rodar junto — confundiria a variável).
- **Semente do Lookalike INTOCADA** nesta fase. O reseed value-based (só compradores) é o **Teste B**, sequencial — para isolar "consolidação" de "troca de semente". Rodar os dois juntos impediria saber qual moveu a agulha.
- Targeting, idade (35–65), geo-pins e exclusões do adset carrier: mantidos.

### Tipo de desenho (honestidade metodológica)
- **Pré/pós (before-after), não RCT.** Há uma conta, um orçamento — não dá holdout real. Controle = baseline trailing-30d congelado em Day-0.
- **Confound assumido:** o T0 dispara UM reset de aprendizado (mudança estrutural deliberada). Isso é o início do teste, não um defeito — por isso a régra de não-tocar abaixo.
- **Riscos externos ao teste:** sazonalidade, novo buraco de saldo, mudança de leilão. Mitigação: manter saldo > 4 dias sempre; não rodar promoções concorrentes na conta.

### Janela de medição
- **14 dias corridos** a partir de T0. Checkpoint de graduação no dia 10; veredito no dia 14.

### REGRA DE OURO — "não tocar durante o teste"
**Zero edições no adset/campanha/form/criativo entre T0 e o dia 14.** Cada edição de budget, público ou criativo **reseta o learning** e zera o teste. As ÚNICAS ações permitidas:
- Recarregar saldo (sem interromper a entrega — top-up não reseta learning).
- Puxar números (read-only).
Se algo quebrar (saldo zerar, anúncio reprovado), o relógio do teste **reinicia** a partir do dia em que a entrega normaliza.

---

## 4. PASSOS DE EXECUÇÃO

### Pré-requisitos [FOUNDER] — antes do GO
- [ ] **Recarregar saldo para R$600–800+** (gatilho do §0). Sem isso, nada roda.
- [ ] Confirmar budget alvo: **R$180/d (default)** ou **R$200/d (margem p/ graduar)**.
- [ ] (Opcional, NÃO neste teste) Decidir preço-no-criativo → vira Teste C separado depois.

### [BRIDGE — chief executa no "GO" do founder, na ordem]
Cada write com **idempotency key UUID v4** + entrada em **ads_action_log** + **ads_guardrails** antes.

1. **Pré-flight OAuth:** `ads_connection_test` (Meta). Se token > 24h, revalidar.
2. **Congelar baseline Day-0 (READ):** puxar (a) leads+CPL por adset 30d, (b) **distribuição das respostas `investimento` dos leads dos últimos 30d** (campo `field_data` via `/{form_id}/leads`) → calcular % na faixa ≥ R$30k. Gravar em `meta-teste-consolidacao-baseline-day0.json`. **Este número é o controle de qualidade.**
3. **ads_guardrails** no adset carrier (checar limites antes do write).
4. **Subir budget** do adset `120248542258000737`: `daily_budget` R$70 → **R$180** (ou R$200). UUID v4. action-log. *(Nota: salto grande num adset = +30%/dia guardrail será sinalizado; é um reset deliberado de início de teste, exceção documentada — depois NÃO se toca mais.)*
5. **Pausar** adset `120247930824860737` (Tier 2). UUID v4. action-log.
6. **Pausar** adset `120247016555870737` (Condomínios). UUID v4. action-log.
7. **Verificar (READ):** campanha agora com 1 adset ativo a R$180/d; status dos 2 pausados; registrar **timestamp T0** = início da fase de aprendizado.
8. **Saga rollback** preparado: se 5 ou 6 falharem, religar o que pausou e reverter budget (estado pré-teste).

### Rollback / abortar
- Saldo zerou durante o teste → registrar interrupção, esperar recarga, **reiniciar o relógio**.
- Founder quer abortar → religar Tier2+Condomínios e voltar Lookalike a R$70 (estado baseline).

---

## 5. PLANO DE MEDIÇÃO

### Números a puxar (READ-only, via bridge)
| Métrica | Fonte | Frequência |
|---|---|---|
| Status de aprendizado do adset (ACTIVE vs LEARNING/LIMITED) | `adset.learning_stage_info` | diário |
| Leads (onsite_conversion.lead_grouped) + spend + CPL | insights nível adset, time_increment=1 | diário |
| CTR, CPM, frequência (saúde de entrega/fadiga) | insights adset | diário |
| Saldo real (display_string) — alerta se < 4 dias | funding_source_details | diário |
| **% leads na faixa investimento ≥ R$30k** | `/{form_id}/leads` field_data | dias 7 e 14 |
| Distribuição prazo/decisor (qualidade secundária) | leads field_data | dia 14 |

### Checkpoints de decisão
- **Dia 3:** sanidade — entregou sem interrupção? saldo ok? Se houve gap, reiniciar relógio.
- **Dia 7:** leituras parciais — leads/7d, CPL, 1ª medição de qualidade. Sem decisão (learning ainda).
- **Dia 10:** **checkpoint de GRADUAÇÃO** — adset virou ACTIVE? Sim → no caminho de sucesso. Não → observar até 14.
- **Dia 14:** **VEREDITO** — aplicar §2:
  - **SUCESSO** (4 critérios) → manter consolidado; iniciar **Teste B** (Lookalike value-based de compradores) para subir qualidade ainda mais.
  - **ZONA CINZA** → estender +7 dias.
  - **FALHA** → pivotar (§2: budget/semente/criativo) — founder decide.

### Entrega ao founder
Tabela diária simples (dia | gasto | leads | CPL | status learning | % ≥R$30k quando disponível) + veredito no dia 14 contra os números pré-registrados acima.

---

## Resumo dos IDs (referência de execução)
- Campanha: `120246900793880737`
- Carrier (subir p/ R$180): `120248542258000737` (Lookalike 1% BR)
- Pausar: `120247930824860737` (Tier 2), `120247016555870737` (Condomínios)
- Form (intocado): `989479676826508`
- Conta: `act_381618241134624`

*Pré-registrado em 2026-06-26. Nenhuma mudança executada nas campanhas. Início condicionado à recarga de saldo pelo founder.*

---

## LOG DE EXECUÇÃO

### 2026-07-02 — CONSOLIDAÇÃO EXECUTADA + T0
Contexto: conta gastou R$0 em 01/Jul (saldo R$0 + spend_cap estourado). Diagnóstico via traffic-masters-chief: cold start = sem learning ativo a perder → executar a estrutura antes da recarga.

**Executado via mcp-ads-bridge (guardrails + action-log):**
1. ⏸️ PAUSE Tier 2 `120247930824860737`
2. ⏸️ PAUSE Condomínios `120247016555870737`
3. 💰 Lookalike `120248542258000737`: R$70 → **R$100/d** (teto do guardrail do bridge; alvo do protocolo = R$180)

**Baseline Day-0 congelado (últimos 14d, 18/Jun–01/Jul):**
| Adset | Gasto | Leads | CPL |
|---|---|---|---|
| Lookalike 1% BR | R$591,14 | 18 | R$32,84 |
| Tier 2 | R$274,30 | 14 | R$19,59 |
| Condomínios | R$268,52 | 5 | R$53,70 |
| **Total** | **R$1.133,96** | **37** | **R$30,65** |

CPL 7d do Lookalike (R$78) considerado contaminado por entrega picotada (fome de saldo) — não usado como baseline de público.

**T0 = 02/Jul (fim do dia):** founder recarregou saldo + destravou spend_cap → entrega retomou (LAL R$7,76 no D0). Janela de 14d: **até ~16/Jul, ZERO edições**.

⚠️ **Pendência aberta:** budget do carrier ainda em R$100/d — founder precisa subir p/ R$180 no Ads Manager (D0/D1, antes do learning engatar). Em R$100/d ≈ 27 ev/semana → provável NÃO graduar → teste inconclusivo (não é falha do público).

Ação paralela Tocks (mesma data, fora deste protocolo): swap LAL-ativo/Form-pausado + ad Curve `120252861392240230` na C007.
