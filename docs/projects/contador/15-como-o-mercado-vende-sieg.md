# Como o Mercado Vende (SIEG/"CIEG") + Estrutura de Oferta Recomendada

> Pesquisa de fontes primárias sobre como os maiores players empacotam, precificam e vendem — partindo do CIEG (referência do Renan, R$600k/mês). Objetivo: modelar nossa estrutura de oferta.
> **Data:** 2026-06-10 · **Base:** `12-tech-research-mercado.md`, `13-conclave`, `00-context/CONTEXT.md`

---

## 🔑 Descoberta nº1: "CIEG" é quase certamente **SIEG**

Na 1ª pesquisa o "CIEG" não existia na web. Caçando com força, o encaixe é forte demais pra ser coincidência:

| Pista do Renan | SIEG confirmado |
|----------------|-----------------|
| Ferramenta de captura | **SIEG HUB** (captura NF-e/NFC-e/NFS-e/CT-e/MDF-e de +1.200 prefeituras) + **Cofre SIEG** (15 anos) |
| Chamava-se **IRIS** | Produto literal **SIEG IriS** (e-CAC, pendências fiscais, procurações, PGDAS) |
| e-CAC | IriS monitora e-CAC, caixa postal, parcelamentos, CADIN, dívida ativa |
| ~7 anos | SIEG fundada **2014** |
| Player grande, venda agressiva por SDR | **+20.000 escritórios, +200.000 empresas**; time comercial robusto (SDRs, dezenas de vagas) |

> **C-I-E-G ≈ S-I-E-G** — transcrição fonética. Confirmar com o Renan pedindo pra soletrar, mas a hipótese é forte. **Se for SIEG, o Renan vendia o MAIOR player de captura de XML do país.** Isso é ouro: ele conhece por dentro o líder de mercado que vamos enfrentar/complementar.

A SIEG é também a **camada de dados** que alimenta a recuperação de terceiros (o Cofre SIEG integra com e-Auditoria etc.) — ela captura e guarda; outros recuperam.

---

## Descoberta nº2: como o mercado EMPACOTA (o padrão)

| Player | Produto-âncora | Add-ons | Unidade de preço | Faixa pública (R$/mês) | e-CAC lote | Recuperação |
|--------|----------------|---------|------------------|------------------------|-----------|-------------|
| **SIEG** | Captura (HUB)+Cofre | IriS (e-CAC), Emissor, IRPF, Folha | Flat/escritório por faixa CNPJ | **R$223 / R$470 / R$800** | Sim (IriS) | Alimenta terceiros |
| **e-Auditoria** | Auditoria / Motor do Simples | e-Recuperador, **e-Monitor (e-CAC)**, Regras Fiscais | Faixa CNPJ + módulos | oculto | Sim (na mensalidade) | Sim (escritório cobra êxito) |
| **Qive** | Captura → Contas a Pagar | Contas a pagar, integrações | Por CNPJ + volume DFes | **R$39,90–426** | Não | Não |
| **Domínio/Onvio** | Domínio One (3 módulos) | Busca NF-e, BOX-e, Reforma, Honorários | Plano×usuário×módulo | ~R$240–1.300 | Não | Não |
| **Questor** | ERP Cloud | **Quiu (e-CAC), CND (+2.500 órgãos), Caixa Postal**, Tareffa | Usuário/recurso | oculto | Sim (granular) | Não |
| **Nibo** | Gestão Financeira / Obrigações | **Radar e-CAC**, Conciliador, Emissor, MeuApp | Por empresa + tarifa boleto | **R$166–479** +R$2,99/boleto | Sim (Radar) | Não |
| **Conta Azul** | ERP Pro | Automação Contábil (R$29,90), BPO (R$129,90) | Plano + usuário | **R$159,90–719,90** | Não | Não |
| **é-Simples** | é-Simples Auditor | 12 módulos (recuperação, NCM IA) | CNPJ + módulos | oculto | Não | Sim (mensalidade; êxito no contador) |

### 4 padrões que o mercado revela
1. **Preço oculto é a NORMA** — 7 de 11 não publicam (todos de auditoria/recuperação). Os transparentes são os de captura/financeiro com unidade simples. → Temos cobertura pra vender o core "sob medida por CNPJ + módulos" sem tabela pública.
2. **Unidade dominante p/ auditoria/captura = faixa de CNPJ.** (e-Auditoria, é-Simples, SIEG, Recupera). ⚠️ Isso **tensiona com a decisão D7 do conclave** (cobrar por nota auditada). Ver §"Tensão" abaixo.
3. **e-CAC em lote é SEMPRE embutido na mensalidade, nunca por consulta avulsa** (e-Auditoria e-Monitor, Questor Quiu/CND/Caixa Postal, Nibo Radar). É módulo de **retenção/recorrência**, não produto de êxito.
4. **Success-fee NUNCA é cobrado pelo software.** É sempre o **escritório que cobra do cliente final (1-20%)**. A jogada da e-Auditoria: vende mensalidade + entrega a "máquina de êxito" pronta + ensina a precificar. ← exatamente o modelo de dois andares que já planejamos (split 70/15/15).

---

## Descoberta nº3: a matemática do R$600k/mês (decomposta)

> Inferência calculada sobre números reais de mercado. R$600k/mês ≈ R$7,2mi/ano. 900 clientes em 7 anos.

| Camada | R$/mês | Natureza |
|--------|--------|----------|
| **A — Recorrência** (900 × ~R$300: captura+e-CAC+acesso ao motor) | ~270.000 | Previsível (MRR) |
| **B — Success-fee** (~40 casos/mês × R$5.750 @ 25% de R$23k médio) | ~230.000 | Cíclico/variável |
| **C — Add-ons** (emissor, certificado, setup; ~700 × R$140) | ~100.000 | Semi-recorrente |
| **TOTAL** | **~600.000** | |

**Leitura honesta:** os R$600k provavelmente são **pico** (meses com êxito concentrado), não MRR liso. A base sólida que paga as contas é **A+C ≈ R$370k**; o êxito (B) é a alavanca. Crédito médio real: **farmácia recupera ~R$23k** (corrigido SELIC, em ~60 dias, via processo **administrativo** — sem advogado, objeção de venda baixíssima). Nichos com mais crédito: farmácia, autopeças, cosméticos, pneus, supermercado, pet shop. **Confirmar o número e o split com o Renan.**

---

## Descoberta nº4: a máquina de venda (o que gera o volume)

O padrão das "fábricas de venda" (e-Auditoria, Recupera Simples, é-Simples):
1. **Produto-isca que prova valor sozinho** — "suba o XML / me dê a procuração → vejo quanto você tem a recuperar ANTES de pagar nada". O lead se auto-convence; encurta o ciclo. (é-Simples: trial 3 CNPJs.)
2. **SDR qualifica + closer fecha** (inside sales remoto). SDR ~R$2,4k fixo + variável; closer ~6%.
3. **Contador como canal de revenda** — comissão recorrente mensal enquanto o cliente fica ativo. Multiplica alcance sem CAC.
4. **Demo, não preço público** — venda consultiva, ticket por perfil.
5. **CS/treino pra reter** a mensalidade (o LTV mora aí).

---

## ⚖️ Tensão a resolver: faixa de CNPJ × nota auditada

O conclave (D7, Campbell) cravou **cobrar por nota auditada**. Mas o mercado inteiro (SIEG, e-Auditoria, é-Simples) cobra por **faixa de CNPJ**. Reconciliação:
- **Por dentro**, o value metric pode ser nota auditada (alinha valor, expansão automática).
- **Na embalagem comercial**, o contador entende e compara por **faixa de CNPJ** (é o que ele já conhece). Vender "Plano até 50 CNPJs" com um teto de notas embutido por trás dá o melhor dos dois: a familiaridade do mercado + a expansão por volume. Campbell concederia isso (a unidade percebida ≠ a métrica interna).

---

## ✅ O que PODEMOS fazer (estrutura de oferta recomendada)

Copiar o **esqueleto comercial do SIEG/e-Auditoria** (que o Renan já domina), mas com o **moat que eles não têm**: a apuração defensável da Reforma + trilha de boa-fé.

### A oferta em 3 camadas (espelha o R$600k)
1. **Recorrência pegajosa** (entrada barata, faixa de CNPJ): **auditoria da Reforma (cClassTrib) + captura + monitor de Nota Técnica**. R$200-400 entrada. É o "aluguel" que segura o cliente. White-label.
2. **Success-fee da recuperação** (20-25%, só no êxito): a isca de aquisição risco-zero. O **contador assina**, nós instrumentamos. Onde mora o ticket alto.
3. **Add-ons premium**: **e-CAC em lote (~R$2k/mês)**, emissor (revenda), Gestor.

### A máquina de venda (replicável já)
- **Isca:** "suba o XML do seu cliente → mostramos onde está errado + quanto dá pra recuperar, de graça". (No Concierge MVP é manual — `14`.)
- **Renan ataca a carteira quente dos 900 primeiro** (leads com relacionamento + dados fiscais já acessíveis = conversão alta).
- **Depois:** 1-2 SDRs alimentam o Renan (ele só fecha) + canal de contadores com comissão recorrente.

### Sequência (casada com o Concierge MVP)
1. **Mês 1-2:** isca de recuperação contra os 900 → fila de êxitos quentes → caixa imediato (e valida a Value Hypothesis).
2. **Mês 2-4:** converter os mesmos clientes pra recorrência (auditoria + captura).
3. **Mês 3+:** canal de contadores + add-on e-CAC sobre a base.

### O diferencial que SIEG/e-Auditoria NÃO têm
- SIEG captura e guarda; e-Auditoria audita o legado. **Nenhum ancora na auditoria da Reforma (cClassTrib/IBS/CBS) com trilha de boa-fé.** É o nosso moat (D9 + conclave). Entramos na mesma máquina comercial do Renan, mas vendendo a **defensabilidade** que o relógio de agosto/2026 torna obrigatória.

---

## Riscos / a confirmar com o Renan
1. **Confirmar SIEG vs CIEG** (pedir pra soletrar) — e se ele vendia a assinatura SIEG ou um produto de recuperação à parte.
2. **Confirmar a composição do R$600k** (quanto era recorrência × êxito × add-on) — define a projeção real.
3. **Preço real do e-CAC (IriS)** — calibrar o ~R$2k/mês contra a régua da SIEG.
4. **Crédito da base esgota** (5 anos retroativos) — o boom inicial cai pro fluxo anual; a recorrência + entrada de novos CNPJs (canal) é o que sustenta pós-pico.

### Fontes principais
SIEG (contabeis.com.br/noticias SIEG IriS+HUB, linkedin/siegsolucoesoficial, cnpj.biz/20947407000138, carreirasieg) · e-Auditoria (/solucoes, carreiras.e-auditoria.com.br) · Qive (/planos) · Sieg (/precos) · Nibo (/planos-e-precos) · Conta Azul (/planos) · é-Simples (/precos, /recuperar-pis-e-cofins-monofasico) · farmácia ~R$23k (jusbrasil) · honorário 1-20% (clickfiscal).
