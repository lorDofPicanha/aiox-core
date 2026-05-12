# Attribution Rules — Garantia Performance Local Blumenau

> **CDC-compliant per ADR-0002 (Patricia Peck consultation).**
> Define tecnicamente o que constitui "evento de interesse comercial atribuído" para fins da garantia 60 dias.

**Versão:** 1.0 (locked)
**Última atualização:** 2026-05-12
**Documento assinado pelo cliente PRÉ-VENDA** (anexo do contrato).

---

## 1. Por que este documento existe

A Garantia Performance Local Blumenau (cláusula X do contrato — ADR-0002) define:

> "Se em 60 dias 0 eventos de interesse atribuídos, a Contratante terá direito a R$ 1.541 em concessões."

Para que essa cláusula seja **auditável**, **objetiva** e **não interpretável contra a Contratada** (CDC art. 47), as métricas técnicas precisam ser definidas exata e antecipadamente. Este documento é o **referência técnica** para disputas e atribuições.

**Patricia Peck (ADR-0002, item 4):**
> "Toda ambiguidade na cláusula de garantia será resolvida contra Breno. Por isso o critério precisa ser numérico, datado, auditável, e a contagem precisa estar visível ao cliente em tempo real."

---

## 2. Eventos atribuídos (CONTAM)

Conforme cláusula X.3 do contrato:

### 2.1. Tipo A — Clique WhatsApp

**Definição técnica:**
- Clique único no elemento HTML com atributo `data-attribution="whatsapp"` (ou link `wa.me/*`)
- Originado de **visitante único** (definido por cookie `_sp_visitor` + IP normalizado, janela 24h)
- Registrado no painel de analytics fornecido pela Contratada
- Timestamp registrado em UTC-3 (BRT)

**Não conta:**
- Cliques duplicados do mesmo visitante na mesma sessão (definida como inatividade <30min)
- Cliques originados de IP da Contratante (lista de IPs declarada na cláusula de elegibilidade)
- Cliques originados de IP da Contratada (Breno, equipe, sub-contratados)
- Cliques originados de tráfego identificado como bot pelo provedor de analytics (regras de bot do Vercel Analytics ou Plausible)
- Cliques originados de campanhas pagas não contratadas (ex: padaria roda anúncio Meta sem contratar tier Scale)
- Cliques com fingerprint suspeito (referer impossível, user-agent malformado, geo absurdo)

### 2.2. Tipo B — Clique "Ligar" no Google Business Profile

**Definição técnica:**
- Evento "Phone calls" no Google Business Profile Insights API
- Origem identificada como **busca local** (Maps, Search local) **OR** call from listing
- Filtrado por geo: cliente origem dentro do município **Blumenau/SC** (CEP 89000-000 a 89090-999, raio aproximado 30km do centro)
- Registrado dentro da janela de 60 dias corridos a partir do go-live

**Não conta:**
- Calls com origem fora de Blumenau (turistas brasileiros de outras cidades não contam para a garantia, mas são clientes válidos — apenas não fazem parte do critério técnico)
- Calls de números na lista de exclusão (números da Contratante, da Contratada, de fornecedores conhecidos)
- Calls com duração <5 segundos (provável engano/desligado imediato)

### 2.3. Não previstos em garantia (mas valiosos)

Outros eventos que **NÃO contam** para a garantia mas serão reportados no Success Vector Report mensal:
- Cliques em "Direções" (Maps)
- Vistas do GBP (impressions)
- Buscas por nome próprio (brand search)
- Cliques em outros links do site (não-WhatsApp)
- Tempo médio no site
- Páginas mais visitadas

Esses são **úteis para o cliente** acompanhar mas **fora do critério técnico da garantia**. Documentado para evitar disputa "mas tive 50 direções pedidas, isso não conta?".

---

## 3. Tracking implementation (técnico)

### 3.1. Stack de mensuração

| Métrica | Tool | Frequência |
|---|---|---|
| Cliques WhatsApp | Vercel Analytics OR Plausible (privacy-first) | Real-time |
| GBP calls | Google Business Profile Performance API | Daily |
| Cookies/Consent | Google Consent Mode v2 (banner) | Per-session |
| Bot filtering | Vercel built-in OR Cloudflare bot management | Real-time |

### 3.2. Código de tracking (template)

```html
<!-- WhatsApp button — must have data-attribution -->
<a
  href="https://wa.me/5547999999999?text=Oi%2C%20vi%20o%20site%20da%20{padaria}"
  data-attribution="whatsapp"
  data-source="site-prospector-v1"
  rel="noopener noreferrer"
  onclick="trackAttribution('whatsapp')"
>
  Falar pelo WhatsApp
</a>

<script>
function trackAttribution(type) {
  if (typeof window.va !== 'undefined') {
    window.va('event', {
      name: 'attribution_click',
      data: { type: type, timestamp: Date.now() }
    });
  }
}
</script>
```

### 3.3. Painel de auditoria do cliente

Cliente recebe **acesso de leitura** ao painel desde o go-live (cláusula X.8 ADR-0002).

URL: `https://analytics.{site-prospector-domain}/{padaria-slug}`

Inclui:
- Contador real-time de Cliques WhatsApp atribuídos
- Gráfico diário/semanal
- Lista de cliques (timestamp + city anonymized)
- Status da garantia (dias restantes + N eventos)

---

## 4. Janela de mensuração

### 4.1. Início (go-live)

**Definição:** data e hora exatas em que:
1. Site está publicado em produção (domínio do cliente acessível)
2. Botão WhatsApp implementado e funcional
3. Google Business Profile está com NAP correto, fotos publicadas, **listado como "Aberto"**
4. Painel de analytics está coletando dados
5. **Confirmação por EMAIL do cliente** "site no ar, pode iniciar contagem"

**Sem o item 5, a garantia NÃO inicia.** Protege contra disputa "no ar mas eu não sabia".

### 4.2. Fim (60 dias corridos)

60 dias × 24h, sem desconto de fins de semana, feriados ou pausas.

**Pausa permitida (estende prazo):**
- Cliente solicita despublicação temporária do site (>24h) → janela pausa, retoma após republicação
- Bug crítico que tira site do ar >2h → janela pausa, retoma após fix
- Ambos requerem **registro escrito** (email) no momento.

### 4.3. Verificação final

No dia 60+1 (dia 61 BRT 09h00):
1. Snapshot do painel
2. Soma dos eventos Tipo A + Tipo B
3. Verificação das condições de elegibilidade (cláusula X.6 ADR-0002)
4. Resultado:
   - **≥1 evento + elegibilidade OK** → garantia NÃO disparada, recurring segue normal
   - **0 eventos + elegibilidade OK** → garantia disparada → crédito R$ 741 + sessão fotos sazonais
   - **Eventos OR elegibilidade falha** → analisar caso a caso (ver §6)

---

## 5. Condições de elegibilidade (cumulativas)

Cliente PERDE direito à garantia se qualquer uma falhar:

1. **Site no ar durante todo o período** (sem despublicação cliente-iniciada >24h)
2. **Botão WhatsApp, GBP e scripts de mensuração não alterados/removidos/desabilitados**
3. **WhatsApp respondendo em horário comercial** declarado no site (cliente é responsável por estar disponível — não responder ≠ falha de atribuição)
4. **Alterações no site fora do escopo** com comunicação prévia à Contratada
5. Pagamento do recurring em dia (no plano contratado)

Falha em qualquer uma + 0 eventos → **garantia não dispara** (cliente quebrou condição). Disputa registrada em pilot-log.

---

## 6. Casos de disputa (templates de resolução)

### 6.1. Cliente alega "veio cliente mas não trackeou"

**Resposta:**
> "A garantia mede critério técnico — clicks atribuídos no painel. Se houve cliente que veio por outro canal (boca a boca, viu seu Insta), isso é ótimo mas não conta para o gatilho técnico da garantia. O contrato (cláusula X) é específico nisso."

→ Não dispara garantia. Log no pilot-log.

### 6.2. Cliente acha que tracking "não está funcionando"

**Resposta:**
> "Vamos auditar juntos. Pode acessar o painel agora? Vou te mostrar o registro de eventos em tempo real, fazer um teste comigo aqui e validar."

→ Teste presencial: Breno clica do próprio celular (com 4G externo, fora do IP da Contratante) → evento aparece. Se sim, painel OK. Se não, bug → fix imediato + janela pausa.

### 6.3. Cliente dispara garantia mas elegibilidade falhou

**Resposta:**
> "Olha aqui — entre dia X e dia Y, o botão WhatsApp foi removido do site (provavelmente quando você editou alguma coisa). Isso violou a condição X.6 (b). A garantia não dispara nesse cenário. Mas posso reinstalar agora e estender a janela 30 dias se quiser."

→ Caso a caso. **Documentar disputa** em pilot-log + ofereça resolução amigável (Patricia: política "antes do PROCON" = R$ 1.541 < R$ 5.000-15.000 litígio).

### 6.4. Cliente alega "atribuição cheia de bot"

**Resposta:**
> "O painel já filtra bots automaticamente via [provedor]. Mas vamos olhar juntos os IPs e horários — se houver algo suspeito, refazemos a contagem."

→ Audit colaborativo. Geralmente o que cliente acha "bot" é apenas tráfego orgânico mobile real.

---

## 7. Política "antes do PROCON" (Patricia Peck recommendation)

Ao primeiro sinal de insatisfação **séria** (não cliente reclamando geral — cliente ameaçando ação):

1. **Não argumente.** Já perdeu.
2. **Oferta proativa de acionamento garantia**, mesmo sem mérito técnico.
3. Custo R$ 1.541 vs litígio R$ 5.000-15.000 = math fácil.
4. Documente acordo amigável.
5. Cliente segue como cliente OR sai com testimonial neutro (não negativo).

---

## 8. Documento assinado pelo cliente PRÉ-VENDA

Antes da assinatura do contrato, cliente recebe **versão simplificada** deste documento (1 página), em linguagem comum, e ASSINA confirmando que entendeu:

```
DOCUMENTO DE TRANSPARÊNCIA — GARANTIA PERFORMANCE LOCAL BLUMENAU

Eu, {Nome do Dono}, CPF {CPF}, representando {Nome da Padaria},
declaro que li e entendi as regras de medição da Garantia Performance:

✓ A garantia mede CLICKS no botão WhatsApp do meu site + LIGAÇÕES
  registradas no meu Google Business Profile a partir de buscas em
  Blumenau/SC.

✓ Outros tipos de cliente (boca a boca, Insta, indicação) são MUITO
  valiosos mas NÃO contam para esta garantia técnica específica.

✓ Tenho acesso a um painel onde posso ver os números em tempo real.

✓ Se em 60 dias zero clicks/ligações forem registrados, recebo:
  - 3 mensalidades grátis (R$ 741)
  - 1 sessão extra de fotos sazonais (R$ 800)
  - Total R$ 1.541
  - Mantenho o site, o Google Business e o Instagram já feitos.

✓ Se eu mexer no site, tirar o botão WhatsApp, ou pausar o site, posso
  perder direito a essa garantia técnica.

✓ Esta garantia é EXTRA — não substitui meus direitos como consumidor
  previstos no CDC (90 dias para vícios aparentes).

Assinado em {data}, presencialmente.

{Assinatura cliente}     {Assinatura Breno}
```

---

## 9. Versionamento

| Versão | Data | Mudanças | Autor |
|---|---|---|---|
| 1.0 | 2026-05-12 | Versão inicial pós Patricia Peck | Orion + Breno |

**Alterações nesta política APÓS contrato assinado com prospect = só com aditivo contratual assinado.** Não muda unilateralmente.
