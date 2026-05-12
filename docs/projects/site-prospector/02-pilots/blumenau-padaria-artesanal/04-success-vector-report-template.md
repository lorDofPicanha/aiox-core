# Success Vector Report — Template

> **Lincoln Murphy (Squad #4):** "Mês 4 é o death valley do recurring SMB Brasileiro. Para sobreviver: dia 30/60/90 entrega Success Vector — não relatório mensal genérico."
>
> **Variável de maior leverage no LTV:** AVG TENURE. Cada mês adicional retido = +R$ 172/cliente (LTV math ADR-0001).
>
> 8h investidas neste template = vale 4-6 meses de pricing optimization.

**Versão:** 1.0 (locked)
**Periodicidade:** dia 30, dia 60, dia 90 pós go-live; mensal a partir dali
**Formato:** PDF visual (1-2 páginas), entrega por email + WhatsApp

---

## Princípios de design

1. **Visual, não tabular.** Padaria não lê planilha. Padaria lê GRÁFICO.
2. **3-4 números, não 30.** Cognitive load matters (Kat Holmes — Squad #2 Quality).
3. **Linguagem comum.** Sem "CTR", "impressions", "bounce rate". Use "pessoas viram", "pessoas clicaram", "pessoas ligaram".
4. **Comparação clara.** Mês a mês (Δ %). "Subiu 23%" é o que o dono lembra.
5. **Próximo passo concreto.** Não termina com "qualquer dúvida estamos à disposição" — termina com "no próximo mês vamos focar em X".
6. **Assinatura humana.** Breno assina (foto + nome), não logo automatizado. Murphy: "appropriate experience pós-venda evita churn mês 4".

---

## Estrutura visual

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│   📊 RELATÓRIO MENSAL — {Nome da Padaria}               │
│   Mês {N} • {Período: 01/MM a 30/MM}                    │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   👀 QUANTAS PESSOAS VIRAM SUA PADARIA NO GOOGLE        │
│                                                          │
│       Este mês:    {VIEWS}        Mês anterior: {X}      │
│       ▲ +{Δ%}     ░░░░░░░░░░                            │
│                                                          │
│   ─────────────────────────────────────────────────     │
│                                                          │
│   📞 QUANTAS LIGAÇÕES VOCÊ RECEBEU                      │
│                                                          │
│       Este mês:    {CALLS}        Mês anterior: {X}      │
│       ▲ +{Δ%}     ░░░░░░░░░░                            │
│                                                          │
│   ─────────────────────────────────────────────────     │
│                                                          │
│   💬 QUANTAS PESSOAS CLICARAM EM "FALAR NO WHATSAPP"    │
│                                                          │
│       Este mês:    {WA_CLICKS}    Mês anterior: {X}      │
│       ▲ +{Δ%}     ░░░░░░░░░░                            │
│                                                          │
│   ─────────────────────────────────────────────────     │
│                                                          │
│   🗺️ QUANTAS PESSOAS PEDIRAM DIREÇÃO ATÉ SUA PADARIA   │
│                                                          │
│       Este mês:    {DIRECTIONS}   Mês anterior: {X}      │
│       ▲ +{Δ%}     ░░░░░░░░░░                            │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   📈 O QUE ISSO SIGNIFICA NA PRÁTICA                    │
│                                                          │
│   {Comentário interpretativo curto, 2-3 frases.         │
│   Exemplo: "Você teve 23% mais ligações que mês          │
│   passado. Boa parte vindo de busca por 'cuca           │
│   artesanal' — sua palavra-âncora está pegando."}        │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   🎯 PRÓXIMO MÊS VAMOS FOCAR EM                         │
│                                                          │
│   • {Ação 1 concreta — ex: "Postar receita da torta     │
│      de chocolate pra Páscoa"}                          │
│   • {Ação 2 — ex: "Responder os 3 reviews novos do      │
│      Google"}                                           │
│   • {Ação 3 — ex: "Adicionar foto do café da manhã      │
│      no Insta highlight"}                               │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   GARANTIA PERFORMANCE BLUMENAU — Status                │
│                                                          │
│   ✓ {N} eventos de interesse atribuídos                 │
│      até hoje (de mínimo 1 em 60 dias)                  │
│   ✓ Dias restantes na janela: {X}                       │
│   ✓ Garantia: NÃO DISPARADA (objetivo atingido)         │
│                                                          │
│   ─ OU ─                                                │
│                                                          │
│   ⚠️ {N} eventos atribuídos até hoje                    │
│   ⏱ Dias restantes: {X}                                │
│   📋 Se 0 eventos no dia 60, garantia dispara: R$ 1.541 │
│      em concessões + você fica com tudo.                │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   {Foto Breno — selfie sorrindo}                         │
│                                                          │
│   Qualquer dúvida, me chama no WhatsApp:                │
│   {número}                                              │
│                                                          │
│   Abraço,                                               │
│   Breno                                                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Métricas (data sources)

| Métrica relatório | Fonte | Frequência coleta |
|---|---|---|
| Views Google (GBP) | GBP Insights API → `BUSINESS_IMPRESSIONS_DESKTOP_SEARCH + _MOBILE_SEARCH + _DESKTOP_MAPS + _MOBILE_MAPS` | Daily |
| Calls (GBP) | GBP Insights API → `CALL_CLICKS` | Daily |
| WhatsApp clicks | Vercel Analytics / Plausible custom event `attribution_click` type=whatsapp | Real-time |
| Direções | GBP Insights API → `BUSINESS_DIRECTION_REQUESTS` | Daily |

**Cálculo Δ%:**
```
Δ% = ((current_month - previous_month) / previous_month) × 100
```

Se previous_month == 0, mostrar "+ {current}" (sem percentage).

---

## Threshold de saúde por métrica (alerta interno Breno)

Não mostrar pro cliente. Usar pra disparar ações pró-ativas (Murphy "appropriate experience").

| Métrica | Verde | Amarelo | Vermelho |
|---|---|---|---|
| Δ% Views | +5%+ | -5% a +5% | <-5% |
| Δ% Calls | +10%+ | 0% a +10% | <0% |
| Δ% WA clicks | +15%+ | 0% a +15% | <0% |
| Garantia status dia 30 | ≥3 eventos | 1-2 eventos | 0 eventos |
| Garantia status dia 45 | ≥5 eventos | 2-4 eventos | 0-1 eventos |
| Garantia status dia 55 | ≥7 eventos | 3-6 eventos | 0-2 eventos |

**Se VERMELHO em qualquer métrica:** Breno liga proativo (não espera cliente reclamar). "Vi que esse mês caiu, vamos juntos olhar?"

**Se garantia VERMELHO dia 45:** intervenção pró-ativa — extra Insta posts grátis OR foto de produto novo OR campanha Stories Maps. Ainda dá tempo de salvar.

---

## Dia 30 — primeira entrega (CRÍTICA)

> Murphy: "Baseline mês 1 define se cliente acredita ou desiste."

**Especial dia 30:**
- Comparar com **baseline pré-go-live** (medições antes do site novo)
- Linguagem celebratory mas honesta: "Em 30 dias, isso aconteceu"
- **Entrega presencial** (Breno leva PDF impresso + visita) — não só email
- 30min de conversa: explica o painel, mostra como cliente acompanha sozinho

**Pre-baseline obrigatório:** capturar antes do go-live (medições semana ANTERIOR ao site novo subir):
- GBP Views: ?
- GBP Calls: ?
- Web (se tinha site): ?
- WhatsApp clicks (se tinha): ?
- Direções: ?

Sem baseline = sem narrativa de progresso = relatório fraco. **Patricia Peck: baseline deve constar no Documento de Transparência assinado pré-venda também (anti-disputa).**

---

## Dia 60 — momento da verdade da garantia

Mesmo formato + bloco especial no fim:

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│   🏁 RESULTADO FINAL — GARANTIA 60 DIAS                  │
│                                                          │
│   {STATUS}:                                              │
│                                                          │
│   [ ] ≥1 evento atribuído → garantia NÃO dispara         │
│       Você está dentro do esperado. Vamos pra fase 2.    │
│                                                          │
│   [ ] 0 eventos atribuídos → garantia DISPARA            │
│       Você recebe:                                       │
│       • 3 mensalidades Growth grátis (R$ 741)            │
│       • 1 sessão fotos sazonais extra (R$ 800)           │
│       • Mantém TUDO já entregue                          │
│       Total R$ 1.541 em concessões.                      │
│                                                          │
│   {se disparou} Próximos passos:                         │
│   1. Mensalidades 4, 5, 6 sem cobrança                  │
│   2. Sessão fotos sazonais agendada pra {data}          │
│   3. Vamos juntos analisar o que ajustar nos próximos    │
│      30 dias (Insta? Anúncio? Posicionamento?)          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Entrega:** SEMPRE presencial. Se disparou → posicionamento empático ("os números não vieram como esperávamos — vamos juntos arrumar"), NÃO defensivo.

---

## Dia 90 — Progress Milestone 1

> Murphy: "Expansion revenue só fires AFTER Progress Milestone 1 (revenue lift). Sem isso, expansion é begging."

Mesmo formato + bloco especial:

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│   🚀 PROGRESS MILESTONE 1 — 90 DIAS                      │
│                                                          │
│   Resultados consolidados (90 dias vs baseline):         │
│                                                          │
│   • Views Google: +{Δ%}                                  │
│   • Calls: +{Δ%}                                         │
│   • WhatsApp clicks: +{Δ%}                               │
│   • Direções: +{Δ%}                                      │
│                                                          │
│   {SE bom (>20% lift)}                                   │
│   ✨ Tem um caminho que abriu pra você agora — quer      │
│   conversar sobre escalar isso? Existem 3 opções:        │
│                                                          │
│   1. Tráfego pago básico (R$ 497/mês + ad spend)        │
│   2. Sessão fotos sazonais trimestral (R$ 800)           │
│   3. WhatsApp Catalog setup (R$ 497 one-time)            │
│                                                          │
│   Sem pressão. Vamos conversar pessoalmente {data}?      │
│                                                          │
│   {SE morno (5-20% lift)}                                │
│   📊 Estamos no caminho. Próximos 30 dias vamos focar    │
│   em {ações específicas}.                                │
│                                                          │
│   {SE ruim (<5% lift ou negativo)}                       │
│   ⚠️ Algo não tá funcionando como esperávamos. Vou       │
│   visitar você {data} pra conversar pessoalmente sobre   │
│   o que ajustar.                                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Critério expansion offer (Murphy):**
- **≥20% lift em 2 das 4 métricas** → expansion pitch (1 das 3 opções)
- **5-20% lift** → não pitch, foca otimização
- **<5% ou negativo** → intervenção rescue, NÃO pitch (cliente pode estar prestes a churn)

---

## Mês 4-12 — manutenção

Mesmo formato visual mais simples. Sem bloco garantia (já encerrou).

Foco: continuidade narrativa + 1 ação concreta/mês.

**Murphy alerta dia 120 (mês 4):**
> "Mês 4 é death valley. Cliente olha extrato, vê R$ 788 acumulado em 'site', e decide se vale."

Mitigação:
- Mês 3 dia 90: Progress Milestone 1 entregue presencial
- Mês 4 dia 120: relatório com **call presencial Breno** (não só email)
- Mês 4 inclui **valor recebido vs investido** explicitamente:
  ```
  Você investiu nos últimos 4 meses: R$ 3.497 + R$ 988 = R$ 4.485
  Você recebeu: {N} ligações + {N} cliques WhatsApp + {N} direções
  Custo por contato: R$ {X}
  Comparação: anúncio Facebook custaria R$ {Y} por contato similar.
  ```

---

## Comando para gerar (semi-automatizado)

```bash
# Skill futura (NÃO codar agora — só pós pilot SUCCESS)
rtk success-vector \
  --padaria-slug nome-padaria \
  --month 1 \
  --period 2026-06-01:2026-06-30 \
  --output offer-pack/dia-30-report.pdf

# Manual durante piloto:
# 1. Puxar dados da GBP API + Vercel Analytics
# 2. Preencher template Keynote/Figma
# 3. Exportar PDF
# 4. Breno revisa + assina + entrega
```

---

## Lock-in psicológico (Murphy "Customer Success Engagement Model")

Cada relatório reforça:
- ✓ **Outcome delivered** (números reais)
- ✓ **Founder presença** (foto Breno, não logo)
- ✓ **Próximo passo concreto** (não "estamos à disposição" → "vamos focar em X")
- ✓ **Comparação favorável** (alternativa custaria mais)
- ✓ **Garantia visível** (transparência cláusula X)

Sem isso, R$ 247/mês morre mês 4 — independente do pricing.
