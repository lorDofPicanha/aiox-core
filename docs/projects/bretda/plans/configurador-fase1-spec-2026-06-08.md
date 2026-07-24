# Bretda — Fase 1: Configurador "Monte sua Mesa" + Captura de GCLID

> **Data:** 08/Jun/2026 · Parte da [estratégia Google Ads alto-ticket](google-ads-highticket-strategy-2026-06-08.md)
> **Princípio:** sem showroom físico, o **compromisso digital** (configurar + agendar) é o evento de conversão. O configurador filtra orçamento sozinho (sob-encomenda) e gera o sinal de venda que o Google precisa.

---

## 1. Objetivo da Fase 1

Substituir o funil "deixe seu contato" por uma **oferta de compromisso** que:
1. **Auto-seleciona** o comprador sério (fricção qualificadora) sem mostrar preço;
2. **Qualifica por FIT** (ambiente, personalização, prazo, decisor);
3. **Carimba o GCLID** do clique do anúncio até o WhatsApp, fechando o loop de medição (resolve a cegueira de 6 meses).

---

## 2. O configurador "Monte sua Mesa" (fluxo)

Modelo de referência: Billard Toulet (`configurateur.billard-toulet.com`). Etapas (estilo configurador Porsche, já mapeado pra Tocks):

| Etapa | Escolha | Função de qualificação |
|---|---|---|
| 1. **Modelo** | Sinuca · Jantar+Bilhar · Pebolim · Ping-pong · Multi | Intenção de produto |
| 2. **Madeira/acabamento** | Espécies nobres, cores, pano | Nível de personalização → ticket |
| 3. **Medida/ambiente** | m² disponíveis, cômodo (sala de jogos / gourmet / cobertura) | Proxy de imóvel alto padrão |
| 4. **Personalização extra** | Gravação, detalhes sob medida | Sinal de comprador premium |
| 5. **Prazo desejado** | "para agora" · "nos próximos meses" · "pesquisando" | Separa decisor de pesquisador |
| 6. **Quem decide** | Eu · casal · com arquiteto/designer | Projeto com arquiteto = ticket maior |
| → **Resultado** | "Receba seu projeto e orçamento" (e-mail/WhatsApp) + CTA "Agende a apresentação por vídeo" | **Evento de conversão** (configurou + agendou) |

**Regras:**
- **NÃO mostrar preço** em nenhuma etapa (decisão dos donos / posicionamento).
- A fricção das 6 etapas é **feature**: o curioso abandona, o sério completa.
- CTA final = compromisso ("agende a apresentação"), não "comprar".
- Visual de luxo de alta produção (ferramentas de design IA, não CSS na mão).

---

## 3. Estrutura da landing (auto-seleção do público)

```
[HERO] Mesa-statement de luxo sob encomenda — peça única pra sua sala de jogos
       (vídeo/imagem de alta produção; SEM preço)
[PROVA "PEOPLE LIKE US"] projetos reais em residências de alto padrão + depoimentos
       (a construir — equivalente às celebridades da BlackBall)
[PROCESSO ARTESANAL] making-of do ateliê, madeira nobre, "sob encomenda em X semanas"
       (exclusividade = filtro de orçamento implícito)
[CONFIGURADOR] "Monte sua mesa" (seção 2)
[CTA] Receba seu projeto + Agende a apresentação por vídeo
[BOTÃO WHATSAPP] (carimbado com GCLID — seção 4)
```

A página comunica exclusividade e sob-encomenda **antes** do formulário — quem não pode pagar se autoexclui ao ler "sob encomenda". Tribo "People Like Us Do Things Like This" (Seth Godin).

---

## 4. Captura de GCLID — o fluxo que fecha o loop (CRÍTICO)

Este é o passo que faltou por 6 meses. Sem ele, nenhuma das fases seguintes funciona.

### 4.1 Mecânica (do clique à venda)

```
1. Clique no anúncio → Google anexa ?gclid=XXXX à URL da landing
2. LANDING: JS lê window.location.search → grava gclid em cookie + localStorage
   (⚠️ GCLID é case-sensitive — preservar exato)
3. Se houver form: hidden field <input name="gclid_field"> populado pelo JS
4. BOTÃO WHATSAPP: ao clicar, GTM trigger "Click URL contains wa.me"
   → webhook envia {gclid, timestamp, telefone} pra Google Sheets/CRM ANTES do redirect
   (mais robusto que embutir no ?text= do wa.me)
5. CRM/PLANILHA: linha = GCLID | timestamp | telefone | estágio | valor
6. VENDEDOR marca o estágio conforme avança (qualificado→agendou→orçamento→venda)
7. UPLOAD via Data Manager (conexão Google Sheets) — NÃO API legada
   → Google casa GCLID com o clique → Smart Bidding enxerga a venda real
```

### 4.2 Por que NÃO usar Click-to-WhatsApp nativo do Google
O asset nativo manda direto pro `wa.me` e **perde o GCLID** (Pedro Sobral — gotcha BR nº1). Sempre: **anúncio → landing própria (captura GCLID) → botão WhatsApp (carimba) → CRM → upload.**

### 4.3 Enhanced Conversions for Leads (rede de segurança)
Além do GCLID, capturar **e-mail/telefone hasheados (SHA-256)** no form → se o GCLID se perder (cookie limpo, cross-device), o match por dados hasheados resgata a atribuição. É o formato nativo do Data Manager e já alinha com a migração de 15/Jun/2026.

### 4.4 Janela de 90 dias (ciclo longo)
GCLID expira em 90d. Como a venda de R$30k+ pode demorar mais, **reportar marcos de meio-funil dentro da janela** (configurou, agendou, orçamento) — não esperar só o "fechou". Upload **frequente** (diário/semanal), não em lote mensal.

### 4.5 CTM Smoke Test (gate antes de gastar)
Validar ponta a ponta: clicar num anúncio de teste → ir pra landing → clicar no WhatsApp → **confirmar que o GCLID chegou na planilha**. Só liberar budget depois que o smoke test passar.

---

## 5. Definições pré-comprometidas (Cassie — antes de criar as conversões)

Escrever ANTES de olhar dado (proteção contra viés):

- **Lead qualificado** = completou o configurador OU form profundo com FIT (ambiente de alto padrão + personalização + prazo concreto + decisor).
- **WhatsApp qualificado** = conversa real iniciada (não clique cego), com intenção declarada.
- **Agendou** = reservou horário de consultoria por vídeo.
- **Orçamento enviado** = proposta emitida para uma configuração específica. ← **candidato a PRIMARY** (frequente + dentro da janela).
- **Venda** = contrato fechado, valor real.

Só **1** desses alimenta o lance (PRIMARY); o resto é observação (SECONDARY).

---

## 6. Checklist de implementação da Fase 1

- [ ] Construir o configurador (6 etapas) — ferramentas de design IA
- [ ] Landing com prova "people like us" + processo artesanal + configurador
- [ ] Coletar/produzir prova social (clientes notáveis, projetos reais)
- [ ] GTM: trigger no botão WhatsApp + webhook → Google Sheets
- [ ] JS de captura de GCLID (cookie/localStorage + hidden field)
- [ ] Google tag p/ Enhanced Conversions (e-mail/telefone hasheado)
- [ ] Planilha-fonte (GCLID | hash | estágio | valor | data) + conexão Data Manager
- [ ] Escrever as definições pré-comprometidas (seção 5)
- [ ] Rodar CTM smoke test → confirmar GCLID na planilha
- [ ] **Gate:** só então liberar Fase 2 (Search) com budget

---

## 7. Dependências do founder (não-ad-tech)

1. **CRM/planilha** com disciplina de marcar estágios (sem isso, sem sinal).
2. **Lista de compradores** first-party (p/ lookalike de Demand Gen na Fase 3).
3. **Prova social** de clientes notáveis (ativo de marca a construir).
4. Decisão sobre **quem opera** o configurador → orçamento (vendedor responde via WhatsApp/vídeo).

---

*Spec gerada por Orion (aios-master). Próximo: após aprovação, executar Fase 0 (limpeza via API + setup de medição) e construir o configurador.*
