# ADR-0002 — CDC/LGPD Compliance & Garantia Performance Local Blumenau

**Status:** ACCEPTED (2026-05-12, consultation Patricia Peck delivered)
**Decisor:** Breno + Orion (orchestrator) + @patricia-peck consultation
**Supersedes:** N/A
**Superseded by:** N/A
**Related:** ADR-0001 (Pipeline Architecture)
**Blocks:** outreach formal prospect #1 (não bloqueia prospect search & dossiê de dor)

---

## Contexto

ADR-0001 lockou Architecture B (R$ 3.497 + R$ 247/mo Growth + Garantia non-cash R$ 1.541 valor / R$ 591 custo real). Pricing squad flagou risco CDC/PROCON da garantia "1 cliente novo em 60 dias" sem critério verificável + LGPD do tracking. Consulta @patricia-peck (mind clone Direito Digital) rodada antes de gerar contrato v1.

---

## Parecer

> "A oferta é boa, o preço é coerente, a garantia é vendável. **Mas o texto atual tem três falhas que, do meu lado da mesa, eu derrubaria em 15 minutos no juizado.** Reescreva a garantia com critério técnico em vez de 'cliente'; troque 'vende' por 'recebe pedidos'; e antes do prospect #1, monte o kit jurídico." — Patricia Peck

---

## Decisão — 3 correções show-stopper

### 1. Reescrita do termo "VENDE" → "RECEBE PEDIDOS"

**ATUAL (red flag art. 37 CDC):** "Site que vende às 22h quando você dorme"

**CORRIGIDO:** "Site profissional que recebe e direciona pedidos 24/7 via WhatsApp e telefone, mesmo fora do horário comercial"

**Razão:** "Vender" pressupõe transação econômica completa. Serviço entrega vitrine + canal, não transação. PROCON entende como promessa não cumprida.

### 2. Reescrita "0 CLIENTE NOVO" → "0 EVENTOS DE INTERESSE ATRIBUÍDOS"

**ATUAL (red flag art. 47 CDC — interpretação contra fornecedor):** "0 cliente novo atribuível"

**CORRIGIDO:** "0 eventos de interesse atribuídos, definidos tecnicamente como: (a) clique único de visitante único no botão WhatsApp do site; (b) clique 'Ligar' no Google Business Profile com origem identificada na busca local Blumenau/SC"

**Razão:** "Cliente" é conceito jurídico-comercial, não métrica auditável. "Evento" é técnico, auditável, definido por painel.

### 3. Cláusula completa "Garantia Performance Local Blumenau" (CDC-compliant)

Substitui versão simplificada do ADR-0001. **Esta é a redação a usar no contrato v1:**

> **CLÁUSULA [X] — GARANTIA COMERCIAL "PERFORMANCE LOCAL BLUMENAU"**
>
> **X.1.** A Contratada oferece, em adição à garantia legal prevista no art. 26, II, do CDC, garantia comercial complementar denominada "Performance Local Blumenau", nos termos abaixo.
>
> **X.2. Período de mensuração:** 60 (sessenta) dias corridos, contados a partir da data de publicação do site (go-live) confirmada por email pela Contratante.
>
> **X.3. Métricas objetivas auditadas:** considera-se "evento de interesse comercial atribuído" o registro técnico, no painel de analytics fornecido pela Contratada, de qualquer dos seguintes:
> - (a) clique único, originado de visitante único, no botão "Falar pelo WhatsApp" do site;
> - (b) clique em "Ligar" no perfil Google Business Profile administrado pela Contratada, com origem identificada na busca local de Blumenau/SC.
>
> **X.4. Condição de acionamento:** se, ao término dos 60 dias, o painel registrar **zero** eventos de interesse atribuídos conforme cláusula X.3, a Contratante terá direito a:
> - (a) crédito de 3 (três) mensalidades subsequentes do plano Growth, no valor total de R$ 741,00, aplicadas automaticamente nas faturas seguintes;
> - (b) 1 (uma) sessão de fotografia sazonal adicional, sem custo, com escopo equivalente ao previsto no plano contratado, no valor de mercado de R$ 800,00.
>
> **X.5. Manutenção dos entregáveis:** o acionamento da garantia **não afeta** a propriedade da Contratante sobre os entregáveis já entregues (site, perfil Google Business Profile, ajustes de Instagram, fotografias entregues), nos termos da cláusula de licenciamento [Y].
>
> **X.6. Condições objetivas de elegibilidade** (cumulativas):
> - (a) a Contratante manteve o site no ar durante todo o período, sem solicitar despublicação;
> - (b) a Contratante não removeu, alterou ou desabilitou o botão WhatsApp, o perfil GBP ou os scripts de mensuração;
> - (c) a Contratante manteve respondendo o WhatsApp em horário comercial declarado no site;
> - (d) a Contratante não realizou alterações no site, fora do escopo do plano, sem comunicação prévia à Contratada.
>
> **X.7.** **Não constituem evento atribuído**, para fins desta garantia: cliques duplicados do mesmo visitante na mesma sessão; cliques originados de IP da Contratante ou da Contratada; cliques originados de tráfego identificado como bot pelo provedor de analytics; cliques originados de campanhas pagas não contratadas via este instrumento.
>
> **X.8. Auditoria e transparência:** a Contratada disponibiliza à Contratante, durante todo o período, acesso de leitura ao painel de mensuração e envia relatório mensal em PDF, em linguagem comum, com captura de tela das métricas, assinado pela Contratada.
>
> **X.9. Esta garantia não se confunde** com promessa de venda, faturamento ou aumento de clientela. A Contratada não controla a decisão de compra do consumidor final, fatores macroeconômicos, sazonalidade, qualidade dos produtos da Contratante ou seu atendimento.

---

## Contrato v1 — 20 cláusulas mandatórias

Lista para advogado(a) com OAB-SC ativa redigir:

1. Qualificação completa das partes (CNPJ padaria, CPF/CNPJ Breno)
2. Objeto detalhado (5 entregáveis: site / GBP / Insta tune-up / SEO local / fotos 2h)
3. Prazo de execução por entregável + go-live
4. Preço, forma e condições de pagamento (art. 52 CDC + Decreto 7.962/2013) — disclosures obrigatórios:
   - Preço à vista total: R$ 3.497
   - Total a prazo: R$ 3.498 (6× sem juros)
   - Valor de cada prestação: R$ 583
   - Número de prestações: 6
   - IOF cartão se houver
5. Garantia Performance Local Blumenau (cláusula X reescrita acima)
6. Garantia legal art. 26 CDC preservada expressamente: "Esta garantia comercial é adicional à garantia legal de 90 dias prevista no art. 26, II, do CDC, não a substituindo nem reduzindo"
7. **Licenciamento dos entregáveis** — licença perpétua, irrevogável e gratuita à Contratante após pagamento integral, com reserva de direitos morais sobre código autoral + uso em portfólio à Contratada
8. **Cessão de domínio e contas** — domínio em nome da Contratante; GBP propriedade da Contratante (Breno é gestor); contas Google/Meta da Contratante
9. **Tratamento de dados (LGPD)** — cláusula remetendo a DPA anexo
10. Confidencialidade mútua (5 anos pós-término)
11. ~~Não-compete bairro~~ — **NÃO USAR na v1** (Patricia: adiciona complexidade, dificulta venda; use só em planos premium futuros)
12. Suspensão por inadimplência — após notificação por escrito + prazo 30 dias para purgar mora (CDC art. 52)
13. Rescisão — aviso prévio 30 dias; antecipada por descumprimento com notificação 15 dias
14. **Limitação de responsabilidade** — danos diretos limitados ao valor pago nos 12 meses anteriores; exclusão de danos indiretos e lucros cessantes (art. 6º, VI, CDC). NÃO limitação absoluta (nula art. 51 CDC)
15. Manutenção e SLA — disponibilidade do site, prazo de resposta a chamados
16. Sub-contratação — Breno pode subcontratar (Vercel, fotógrafo) mantendo responsabilidade
17. Foro de eleição — Comarca de Blumenau/SC, **com ressalva**: cláusula contra consumidor é nula se prejudicar acesso à justiça (CDC art. 51, XV; CPC art. 63, §3º). Consumidor pode optar foro do seu domicílio
18. Lei aplicável — legislação brasileira
19. **Resolução de conflitos** — conciliação amigável 30d → mediação opcional (CEJUSC/câmara privada). **Arbitragem NÃO recomendada** para consumidor (art. 51, VII, CDC)
20. Assinatura eletrônica — DocuSign/ZapSign com timestamp e trilha auditável (MP 2.200-2/2001 + Lei 14.063/2020)

---

## LGPD — Compliance obrigatório

### Papéis (controlador/operador)

| Fluxo | Controlador | Operador |
|---|---|---|
| Outreach a padarias (dados padaria/dono) | Breno | — |
| Tracking de clicks WhatsApp/GBP no site da padaria | **Padaria** | **Breno** |
| Formulário de contato no site da padaria | **Padaria** | **Breno** |
| Integração WhatsApp Business | Padaria | Breno + Meta |
| Dashboard interno Breno (multi-padarias) | Breno (se consolidar) | — |

**REGRA CRÍTICA:** **NÃO consolide dados de clientes finais entre padarias na v1.** Cada cliente da padaria fica isolado na infra dela. Economiza 80% da complexidade LGPD.

### Bases legais

| Fluxo | Base legal LGPD |
|---|---|
| Outreach B2B com dados públicos (CNPJ, telefone comercial) | Legítimo interesse (art. 7º, IX) + LIA arquivado |
| Tracking site cliente (clicks WhatsApp, analytics agregados) | Execução de contrato (art. 7º, V) + Legítimo interesse (art. 7º, IX) |
| Cookies não-essenciais (GA, Meta Pixel) | **Consentimento granular** (art. 7º, I) via banner |
| Formulário contato | Execução contrato OR consentimento conforme finalidade |

### Documentos obrigatórios antes do prospect #1

- [ ] **Contrato v1.0** (20 cláusulas) — revisado por advogado(a) OAB-SC
- [ ] **DPA (Data Processing Agreement)** entre Breno e cada padaria — anexo do contrato
- [ ] **Template Política de Privacidade** site cliente (preenchível com dados padaria)
- [ ] **Template Termos de Uso** site cliente
- [ ] **Política Cookies + banner consentimento granular** (Google Consent Mode v2)
- [ ] **Política Privacidade própria** Site-Prospector (site institucional + outreach)
- [ ] **Aviso Privacidade Outreach** + LIA arquivado
- [ ] **ROPA (Registro Operações Tratamento)** — planilha (art. 37 LGPD)
- [ ] **DPAs aceitos** Vercel + Google + Meta — PDFs arquivados com data
- [ ] **Canal privacidade** público: privacidade@[dominio]
- [ ] **Disclosure atribuição** — 1 página assinado pré-venda
- [ ] **Painel auditoria** acesso leitura cliente desde go-live
- [ ] **Template relatório mensal PDF** humano-legível (Success Vector Report)
- [ ] **Disclaimers** na landing Site-Prospector + proposta comercial
- [ ] **CNPJ ME ativo** (NÃO MEI — R$ 81k/ano insuficiente)
- [ ] **Conta PJ separada** para faturamento
- [ ] **Plano resposta incidente dados** (24h notificar ANPD — art. 48 LGPD)
- [ ] **Cotação seguro RC Profissional** (compra sugerida a partir 3º cliente)

### DPO/Encarregado

Padaria e Site-Prospector enquadram-se como Pequeno Agente de Tratamento (Resolução CD/ANPD 2/2022). **DPO formal não obrigatório**, mas:
- Padaria deve indicar canal de comunicação com titular (email simples)
- Site-Prospector precisa canal público: `privacidade@[dominio]`

### Pixel/Tracking pré-consentimento

**Meta Pixel, GA4, demais trackers NÃO podem disparar antes do consentimento** quando coletam dados pessoais (IP, fingerprint). Implementação correta = Google Consent Mode v2 condicionado a banner.

### Transferência internacional (Vercel/Google/Meta EUA)

LGPD art. 33. EUA-Brasil sem decisão de adequação ainda. Base válida: cláusulas-padrão dos DPAs dos provedores. **Aceitar e arquivar evidência (PDFs com data).**

---

## Disclaimers obrigatórios (proposta + landing + materiais)

1. **Sobre resultado:** "Os resultados de marketing digital dependem de múltiplos fatores fora do controle da agência, incluindo qualidade do produto, atendimento, sazonalidade e concorrência. A Garantia Performance Local Blumenau cobre exclusivamente os critérios técnicos descritos no contrato (cláusula X) e não é promessa de aumento de faturamento."

2. **Sobre Google/Meta:** "Site-Prospector não tem vínculo de exclusividade, parceria ou representação com Google LLC ou Meta Platforms Inc. As plataformas mantêm autonomia sobre indexação, ranking e exibição. Não garantimos posição específica nas buscas."

3. **Sobre preço:** "Preço à vista R$ 3.497,00. À prazo em 6× de R$ 583,00 no cartão de crédito (sem juros), total a prazo R$ 3.498,00. Mensalidade recorrente Growth: R$ 247,00."

4. **Sobre dados:** "Coletamos e tratamos dados pessoais nos termos da Lei 13.709/2018 (LGPD). Consulte nossa Política de Privacidade em [URL]. Em caso de dúvida sobre tratamento de dados, contate privacidade@[dominio]."

5. **Sobre comparação "agência tradicional cobraria R$ 7.500":** **NÃO usar comparação numérica direta** sem fonte verificável. Reescrita:

> **EVITAR:** "Agência tradicional cobraria R$ 7.500-9.000"
>
> **USAR:** "Pacote equivalente em modelos tradicionais de agência costuma envolver investimento substancialmente superior, segundo levantamentos públicos de mercado [SEBRAE/ABRADi]"

---

## Sobre "Sua loja achável no Google"

**ATUAL (red flag art. 37 — promessa genérica):** "Sua loja achável no Google"

**CORRIGIDO:** "Otimização de Google Business Profile e SEO local para que sua padaria apareça nas buscas geolocalizadas no município de Blumenau/SC, com previsão razoável de indexação em 30–60 dias, **sem garantia de posição específica (Google é independente)**"

---

## Exposição financeira estimada

**Com os ajustes implementados:**
- Probabilidade queixa formal por deal: **5-10%**
- Probabilidade ação judicial por deal: **1-3%**

**Sem os ajustes (atual):**
- Probabilidade queixa formal: **15-25%**
- Probabilidade ação judicial: **5-10%**

| Cenário | Custo estimado |
|---|---|
| Reclamação PROCON sem judicial | R$ 2.000-8.000 por incidente |
| Ação individual JEC (R$ 3.497 + danos morais R$ 3-10k) | R$ 5.000-15.000 por ação |
| Ação coletiva PROCON/MP | Improvável até 50+ clientes |

**Mitigation:**
- **Seguro RC Profissional** (Liberty/AIG/Tokio Marine/Chubb): R$ 1.500-4.000/ano para cobertura R$ 100-300k. **Comprar a partir do 3º cliente pago.**
- **Reserva contingência:** 5% faturamento bruto em conta separada, mín 6 meses
- **Documentação preventiva:** todo entregável com aceite escrito + prints métricas mensais + contratos assinados eletronicamente
- **Política "antes do PROCON":** ao primeiro sinal de insatisfação séria, oferta proativa de acionamento garantia. Resolução amigável = R$ 1.541 vs litígio = 10× mais.

---

## Validações humanas subsequentes (não substituíveis por mind clone)

1. **Revisão contrato v1.0 por advogado(a) OAB-SC ativa** — particularidades catarinenses, foro local
2. **Validação tributária com contador local** — enquadramento ME/Simples, ISS Blumenau (2-5% serviços TI), retenções, emissão NFS-e
3. **Registro marca "Site-Prospector" no INPI** antes do outreach — R$ 142-355/classe, sem registro = vulnerável
4. **Acordos com fornecedores diretos** — fotógrafo (cessão direitos autorais, art. 49 Lei 9.610/98)
5. **Modelo fotográfico tripartite** — Breno + padaria + fotógrafo (cessão patrimoniais à padaria, morais ao fotógrafo)
6. **Liberação imagem pessoas** — se funcionários/clientes nas fotos (CC art. 20)
7. **Direito autoral código** — validar licenças (MIT/Apache/comerciais) de templates
8. **Cláusula IA generativa** — site usando IA pra textos/imagens declarar (área cinzenta BR)
9. **Adequação PL 2338/2023 (Marco Legal IA)** quando aprovado — monitorar 2026/2027
10. **Revisão anual compliance** — LGPD, ANPD, jurisprudência consumerista evoluem rápido

---

## Decisões derivadas

1. **Outreach informal "tester" / Stage 1 verbal** pode rodar antes de contrato v1 final pronto — desde que NÃO seja assinado nada formal nem dinheiro mude de mãos
2. **Stage 1 paid (≥R$ 1.500 1ª parcela)** SÓ pode rodar com contrato v1.0 assinado (CDC + 20 cláusulas + DPA anexo + disclaimers)
3. **Stage 2 build** depende de contrato v1 + DPA assinado + Política Privacidade template pronta
4. **Pre-registered criteria** atualizado: linguagem "evento de interesse atribuído" (Patricia) substitui "cliente novo" (informal)
5. **Pricing copy** corrigido: "recebe e direciona pedidos 24/7" substitui "vende às 22h"
6. **Anchor copy** corrigido: "modelos tradicionais investem substancialmente mais (SEBRAE)" substitui "R$ 7.500-9.000 agência"
7. **Não-compete bairro descartado** da v1
8. **Arbitragem descartada** — só conciliação + mediação CEJUSC

---

## Próximo passo

1. **Contratar advogado(a) OAB-SC** pra redigir contrato v1.0 baseado nas 20 cláusulas — estimado R$ 2.500-5.000
2. **Configurar kit jurídico digital** — templates PoP/ToU/Cookies + canal privacidade + ROPA — ~20h founder
3. **Aceitar DPAs Vercel/Google/Meta** + arquivar PDFs
4. **Abrir ME (não MEI)** + CNPJ ativo + conta PJ
5. **Atualizar offer-pack-template.md** com copy CDC-compliant (Patricia rewrites)
6. **Atualizar attribution-rules.md** com definição técnica precisa (evento de interesse atribuído + exclusões)

---

## Referência fontes

- Patricia Peck consultation rodada 2026-05-12, output completo em thread context (162s execution)
- Perfil mind clone: `.claude/commands/AIOS/agents/patricia-peck.md`
- Disclaimer: análise diagnóstica baseada em direito digital aplicado — **não substitui parecer advogado(a) OAB-SC ativa**
