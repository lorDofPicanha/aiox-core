# 11 — Benchmark Consolidado de Suítes "Tudo-em-Um" (visão de SUÍTE)

> **Autor:** Atlas (Claude) · **Data:** 2026-06-24 · **Base:** fontes primárias (páginas de produto/preço/changelog) + síntese dos docs `01-captura` … `06-gestao` deste diretório.
> **Gatilho (reunião 22/Jun/2026):** o founder quer "as melhores funcionalidades do mercado". Renan propôs envolver um **contador empreendedor com ferramenta madura (~400 clientes), integrações a prefeituras, automações, ferramenta anterior já vendida** — possível sócio/aceleração. Esta análise define o **teto de funcionalidades** das suítes líderes e onde construir vs. comprar vs. acelerar via parceria.
> **Escopo deliberado:** isto **NÃO repete** as 6 áreas (já feitas a fundo nos docs 01–06). Consolida em **visão de plataforma**: quem cobre quanto do ciclo, onde está o teto, e o que muda na decisão build/buy/partner.

---

## 0. TL;DR para a mesa de sócios

1. **O mercado tem 3 "espécies" de suíte, e nenhuma cobre o ciclo inteiro bem.** ERP-contábil tradicional (Domínio, Alterdata, Contmatic, Questor, Calima, Prosoft, Sage) domina escrituração+folha+obrigações; plataformas de inteligência fiscal (e-Auditoria, SIEG, Jettax, Audire, Arquivei/Qive) dominam captura+e-CAC+auditoria; gestão financeira/emissão (Conta Azul, Nibo, Omie) domina o lado do cliente final. **Ninguém é forte nos três eixos ao mesmo tempo.**
2. **A "fronteira competitiva" mais quente é exatamente onde estamos:** captura → auditoria cClassTrib → e-CAC em lote. e-Auditoria + SIEG + Jettax + Audire já transformaram e-CAC-em-lote e captura em **commodity**. A auditoria com IA + score + revisão humana **já foi ocupada** (e-Auditoria/Roit/FiscAI — ver doc 02). Lutar por feature aqui é perder.
3. **O teto que precisamos atingir é estreito e claro:** paridade funcional de captura+e-CAC+emissor (tudo comprável de provider) + **um diferencial que ninguém tem: defensabilidade verificável (trilha de boa-fé)**. Confirmado, independentemente, nos 6 docs.
4. **A base do "contador empreendedor" do Renan acelera o que é mais caro de construir sozinho: cobertura de prefeituras + relacionamento + obrigações maduras.** Mas a NFS-e Nacional 2026 está **comoditizando exatamente a cobertura de prefeituras** (o ativo histórico dele) — janela curta. A parceria vale pela **distribuição e maturidade operacional**, não pela tecnologia de integração municipal, que vira commodity.

---

## 1. As 3 espécies de suíte no mercado contábil/fiscal BR

| Espécie | Players | O que dominam | Onde são fracos |
|---|---|---|---|
| **A. ERP-contábil tradicional** (escrituração de dentro) | Domínio (Thomson Reuters), Alterdata, Contmatic, Questor, Calima, Prosoft, Sage | Contabilidade + Escrita Fiscal + Folha + obrigações acessórias (SPED/ECD/ECF/DCTF/PGDAS) + portais cliente/empregado | Inteligência fiscal moderna (IA/score), recuperação como produto, UX, e-CAC em lote nativo (terceirizam p/ SIEG/Jettax) |
| **B. Inteligência fiscal & automação** (do XML para fora) | e-Auditoria, SIEG (Hub/IriS/Cofre/Emissor), Jettax, Audire, Arquivei/Qive, Acessórias | Captura de DF-e, cofre, e-CAC em lote, auditoria de SPED, recuperação, monitor de procuração/certidões, gestão de obrigações | Escrituração/folha (não fazem), gestão financeira do cliente final, contabilidade |
| **C. Gestão financeira & emissão** (lado do cliente) | Conta Azul, Nibo, Omie | Financeiro PME, emissão NF-e/NFS-e, conciliação Open Finance, conexão com contador | Auditoria fiscal profunda, recuperação, e-CAC em lote (Nibo tem Radar; CA/Omie não), escrituração |

**Implicação estratégica nº1:** nosso ciclo (captura→auditoria→e-CAC→emissor→recuperação+gestão) **atravessa as 3 espécies**. Ninguém faz isso integrado. Mas atravessar tudo é caro — por isso a tese correta (docs 00/02) é: **comprar o commodity das espécies A/B/C, construir só o moat (defensabilidade) que nenhuma das três tem.**

---

## 2. Tabela-mestra de features × concorrentes

**Legenda:** ✅ forte/nativo · 🟦 parcial/via add-on ou parceiro · ⬜ não cobre · ❓ não confirmado em fonte
**Colunas "nós":** H = nós-hoje (estado real, conforme docs 01–06) · A = nosso-alvo (paridade + moat)

### 2.1 Eixo CAPTURA / DOCUMENTOS FISCAIS

| Feature | Domínio | Alterdata | Contmatic | e-Auditoria | SIEG | Jettax | Audire | Arquivei/Qive | Acessórias | Conta Azul | Nibo | Omie | **H** | **A** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Captura automática DF-e (NFe/CTe/NFCe/MDFe) | 🟦 | 🟦 | 🟦 | ✅ | ✅ | ✅ | ✅ | ✅ | 🟦 | ⬜ | 🟦 | 🟦 | 🟦 demo | ✅ (provider) |
| Captura NFS-e | 🟦 | 🟦 | 🟦 | ✅ | ✅ | ✅ | 🟦 | ✅ | 🟦 | ⬜ | ✅ | 🟦 | 🟦 | ✅ |
| Cofre/armazenamento XML em nuvem | 🟦 | 🟦 | 🟦 | ✅ | ✅ (Cofre) | ✅ | ✅ | ✅ | ✅ | ⬜ | ✅ | 🟦 | 🟦 | ✅ |
| Manifestação do destinatário | 🟦 | 🟦 | 🟦 | ✅ | ✅ | ✅ | ❓ | ✅ | 🟦 | ⬜ | ❓ | 🟦 | ⬜ | ✅ |
| Dedup / hash perceptual | ❓ | ❓ | ❓ | 🟦 | 🟦 | ❓ | ❓ | 🟦 | ❓ | ⬜ | ❓ | ❓ | ✅ (Documentize) | ✅ |
| Alerta de gap/nota faltante | 🟦 | 🟦 | 🟦 | ✅ | ✅ | ✅ | ❓ | ✅ | 🟦 | ⬜ | 🟦 | 🟦 | ⬜ | ✅ |
| **Captura SELETIVA por CNPJ (custo-consciente)** | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 🟦 (design) | ✅ **whitespace** |

### 2.2 Eixo AUDITORIA / cClassTrib

| Feature | Domínio | Alterdata | Contmatic | e-Auditoria | SIEG | Jettax | Audire | Arquivei/Qive | Roit/FiscAI | **H** | **A** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Auditoria de SPED / inconsistências | 🟦 | 🟦 | 🟦 | ✅ | 🟦 | ✅ | 🟦 | ⬜ | ✅ | 🟦 | ✅ |
| Classificação cClassTrib (Reforma) | 🟦 | 🟦 | ❓ | ✅ | ❓ | 🟦 | ❓ | ⬜ | ✅ (IA+score) | 🟦 esqueleto | ✅ |
| Score/confiança de classificação | ⬜ | ⬜ | ⬜ | 🟦 | ⬜ | ⬜ | ⬜ | ⬜ | ✅ (0–100) | 🟦 (fixa) | ✅ calibrada |
| Revisão humana no loop (human-in-loop) | 🟦 | 🟦 | ⬜ | 🟦 | ⬜ | ⬜ | ⬜ | ⬜ | ✅ (<85%) | ✅ design | ✅ |
| Simulação impacto Reforma 2026–2033 | 🟦 | 🟦 | 🟦 | ✅ | ⬜ | 🟦 | ⬜ | ⬜ | ✅ | ⬜ | 🟦 |
| **Trilha criptograficamente verificável por 3º** | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 🟦 (imutável, não verificável externo) | 🟦 (hash-chain) | 🟦 | ✅ **whitespace** |
| **Confiança "onde NÃO sei" (abstém)** | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 🟦 | ✅ **whitespace** |

> ⚠️ **Achado crítico (doc 02):** Roit/FiscAI **já ocupou** o whitespace "IA + score + revisão <85% + trilha". Confidence+human-in-loop **virou table-stake**, não mais diferencial. O moat real migrou para **vender a defensabilidade jurídica** (boa-fé vs. multa) com trilha verificável por terceiro + risco PER/DCOMP classificado — onde ninguém é forte ainda.

### 2.3 Eixo e-CAC EM LOTE

| Feature | Domínio | Alterdata | e-Auditoria | SIEG (IriS) | Jettax | Audire | Acessórias | Nibo (Radar) | **H** | **A** |
|---|---|---|---|---|---|---|---|---|---|---|
| Acesso e-CAC via Integra Contador (API SERPRO) | 🟦 | 🟦 | ✅ | ✅ | ✅ | ✅ | 🟦 | ✅ | 🟦 front | ✅ |
| Monitor caixa postal / intimações em lote | 🟦 | 🟦 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟦 | ✅ |
| Situação fiscal / pendências da carteira | 🟦 | 🟦 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟦 | ✅ |
| CND federal/estadual/trab/FGTS (Infosimples) | 🟦 | 🟦 | ✅ | 🟦 | ✅ | ✅ | ✅ | 🟦 | ⬜ | ✅ (2º provider) |
| Mapa de procuração eletrônica (vencimento) | ⬜ | ⬜ | 🟦 | 🟦 | 🟦 | ✅ | 🟦 | 🟦 | ⬜ | ✅ |
| DAS/PGDAS/DARF em lote | ✅ | ✅ | 🟦 | 🟦 | ✅ | 🟦 | 🟦 | ✅ | ⬜ | 🟦 |
| **Onboarding "Autorização de Acesso" (nova, dez/2025)** | ❓ | ❓ | 🟦 | 🟦 | 🟦 | 🟦 | ❓ | 🟦 | ⬜ | ✅ **diferencial janela curta** |

> ⚠️ **e-CAC em lote é categoria LOTADA** (doc 03). Não é wedge — é infraestrutura comprada (Integra Contador + Infosimples). Diferencial só no **onboarding da nova Autorização de Acesso** (aceite ≤30d) + **health score cross-módulo** (gestão × situação fiscal). Captcha jan/2026 matou scraping → quem usa API (todos os líderes) está imune; quem ainda raspava morre.

### 2.4 Eixo EMISSOR (NFS-e Nacional)

| Feature | SIEG Emissor | Conta Azul | Nibo | Omie | Focus NFe | PlugNotas/Tecnospeed | **H** | **A** |
|---|---|---|---|---|---|---|---|---|
| Emissão NFS-e Nacional (ADN/SEFIN) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟦 demo client-side | ✅ (gateway) |
| Cobertura ampla de municípios | ✅ | ✅ | ✅ (2.000+) | ✅ | ✅ | ✅ (2.218+) | ⬜ | ✅ (via Nacional) |
| Emissão NF-e/NFC-e | ✅ | ✅ | 🟦 | ✅ | ✅ | ✅ | ⬜ | 🟦 |
| Revenda B2B2B (contador revende ao cliente) | 🟦 | ⬜ | 🟦 | ⬜ | 🟦 (CNPJs ilimitados) | 🟦 (white-label) | 🟦 painel | ✅ **diferencial** |
| **Emissão já com cClassTrib auto-auditado** | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ✅ **whitespace** |
| Preço transparente público | ⬜ | ✅ | 🟦 | ⬜ | ✅ (Growth R$548 ilimitado) | ⬜ | — | ✅ |

> ⚠️ **Doc 04:** NFS-e Nacional 2026 **padroniza** a emissão → cobertura de municípios deixa de ser moat (era o ativo da ferramenta antiga do Renan, que morreu pelos "15 layouts"). Focus NFe (transparente) > PlugNotas/Tecnospeed (white-label opaco) como gateway. Whitespace só nosso: **emitir já com cClassTrib auto-auditado + trilha de boa-fé**.

### 2.5 Eixo RECUPERAÇÃO (monofásico PIS/COFINS)

| Feature | e-Auditoria (e-Recuperador) | é-Simples | Recupera Simples | Sittax | Roit | Taxcel | **H** | **A** |
|---|---|---|---|---|---|---|---|---|
| Ingestão XML/SPED/PGDAS | ✅ | ✅ | ✅ | ✅ | ✅ | 🟦 | ⬜ | ✅ |
| Identificação item monofásico | ✅ | ✅ | ✅ | ✅ | ✅ | 🟦 | 🟦 | ✅ |
| Cálculo crédito + SELIC | ✅ | ✅ | ✅ | ✅ | ✅ | 🟦 | ⬜ | ✅ |
| Geração PER/DCOMP / dossiê | ✅ | ✅ | ✅ | 🟦 | ✅ | ❓ | ⬜ | ✅ |
| **Trilha persistida = defesa STF Tema 736** | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 🟦 | ✅ **whitespace** |
| **Risco jurídico classificado por pedido** | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ✅ **whitespace** |

> ⚠️ **Doc 05:** os table-stakes (ingestão+ID+cálculo) NÃO temos de verdade; os diferenciais (trilha persistida + risco classificado + confiança calibrada) estão **brancos no mercado**. Mecanismo confirmado: monofásico no Simples = **restituição via PER/DCOMP** (D5). STF Tema 736: multa de 50% inconstitucional, mas 150% persiste em fraude → **defesa = trilha de boa-fé**.

### 2.6 Eixo GESTÃO / OBRIGAÇÕES / FOLHA

| Feature | Domínio | Alterdata | Contmatic | Questor | Calima | Prosoft | Sage | Acessórias | Nibo | **H** | **A** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Escrituração contábil (ECD/ECF) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | ⬜ | ⬜ | ⬜ (fora) |
| Escrita fiscal (SPED/EFD/apuração) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | ⬜ | ⬜ | ⬜ (fora) |
| Folha de pagamento / eSocial | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | ⬜ | ⬜ | ⬜ (fora) |
| Gestão de obrigações/prazos (calendário) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟦 | ✅ (Gestorize) |
| Portal do cliente / empregado | ✅ | ✅ (eContador) | ✅ | 🟦 | 🟦 | 🟦 | 🟦 | ✅ (VIP) | ✅ (app branded) | 🟦 | ✅ |
| Multi-empresa / multi-tenant (carteira) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟦 | ✅ |
| Conciliação bancária / Open Finance | ✅ | ✅ | ✅ | 🟦 | 🟦 | 🟦 | ✅ | 🟦 | ✅ | ⬜ | 🟦 |
| **Health score (gestão × situação fiscal e-CAC)** | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 🟦 | 🟦 | ✅ **diferencial** |

> ⚠️ **Decisão D1/doc 06:** escrituração/folha estão **fora de escopo** (não vamos brigar com Domínio/Alterdata no que eles fazem há 30 anos). Herdamos o Gestorize na camada de gestão/obrigações; o diferencial é o **health score cross-módulo**, que liga gestão à situação fiscal do e-CAC — ninguém faz.

---

## 3. Os 3 whitespaces (onde NINGUÉM é forte) — onde construir o moat

### 🥇 Whitespace #1 — Defensabilidade verificável por terceiro (trilha de boa-fé)
**Status no mercado:** Roit/FiscAI têm trilha "imutável" interna (hash-chain); **ninguém** oferece trilha **verificável por um terceiro** (auditor, fisco, advogado) com prova criptográfica (Merkle/hash-chain auditável externamente) ligada à **defesa jurídica concreta** (STF Tema 736 / ADI 4905 — a proveniência de boa-fé é o que segura a multa). Atravessa auditoria, emissor e recuperação. **É a categoria, não a feature.**

### 🥈 Whitespace #2 — Confiança calibrada que se abstém ("onde NÃO sei")
**Status no mercado:** todos os classificadores cClassTrib (incl. Roit) **devolvem sempre uma resposta**. Nenhum **se recusa a classificar** quando a confiança é baixa, em vez de gerar um falso-positivo silencioso. Para o nicho (escritório que assina pela apuração), **o falso-positivo silencioso destrói a confiança** (constraint nº3). Abster-se com honestidade é diferencial defensável e barato de construir (é design + golden-set + threshold), difícil de copiar culturalmente.

### 🥉 Whitespace #3 — Integração entre módulos (o ciclo como produto único)
**Status no mercado:** ninguém faz captura→auditoria→e-CAC→emissor→recuperação **no mesmo dado, na mesma trilha**. e-Auditoria chega perto (cadastra empresa 1×, alimenta todos os módulos) mas **não tem emissor com cClassTrib auto-auditado** nem health score gestão×fisco. O **emissor que já nasce auto-auditado** (emite a nota já sabendo se o cClassTrib está certo) e o **health score cross-módulo** são integrações que só existem se o ciclo for um produto único.

> **Nota de honestidade (decisores):** os três whitespaces dependem do **motor de auditoria real** (hoje esqueleto — doc 00). Sem golden-set rotulado por tributarista, os três viram apresentação sem fundação. **O motor é o long-pole de tudo.**

---

## 4. Table-stakes INEGOCIÁVEIS (onde TODOS fazem — entrar sem isso = não existir)

1. **Captura automática de DF-e + cofre em nuvem** — todos da espécie B fazem; comprar de provider (Focus/PlugNotas). Sem isso não há porta de entrada.
2. **e-CAC em lote via Integra Contador** (caixa postal + situação fiscal + CNDs via Infosimples) — e-Auditoria/SIEG/Jettax/Audire/Nibo já têm. É infra, não diferencial.
3. **Emissão NFS-e Nacional com cobertura de municípios** — comoditizada pela NFS-e Nacional 2026; comprar gateway.
4. **Classificação cClassTrib com IA + score + revisão humana** — Roit/FiscAI/e-Auditoria já têm; **virou table-stake** (não é mais diferencial).
5. **Multi-empresa / gestão de carteira / portal do cliente** — todo ERP-contábil e toda plataforma B/C tem. Sem multi-tenant não atende escritório.
6. **Recuperação: ingestão + identificação monofásico + cálculo SELIC + dossiê PER/DCOMP** — e-Auditoria/é-Simples/Recupera Simples/Sittax/Roit já têm. Sem isso a "isca" não funciona.

---

## 5. O que torna uma suíte "madura" para um escritório de ~400 clientes (requisitos não-óbvios)

O perfil que o Renan trouxe (~400 clientes, integrações a prefeituras, automações, ferramenta anterior vendida) sinaliza maturidade operacional. Os requisitos **não-óbvios** que separam um MVP de uma suíte de produção para esse porte:

1. **Operação em lote real, não item-a-item.** SPED/DAS/CND/e-CAC para 400 CNPJs exige fila, rate-limit consciente (e-CAC: ~20 consultas/h, cStat 137→1h, rej 656 bloqueia 1h — doc 01/03), retry idempotente e observabilidade. É onde MVPs quebram.
2. **Gestão de procuração eletrônica em escala** (mapa de vencimento ≤30d — Audire faz). Sem isso, o acesso à carteira "apaga" silenciosamente e o cliente descobre na multa.
3. **Onboarding da carteira inteira de uma vez** (importar 400 empresas, certificados, autorizações). A nova "Autorização de Acesso" (dez/2025, aceite ≤30d) é fricção de massa — quem resolve isso bem ganha o escritório.
4. **Multi-tenant com segregação de dados + LGPD by design + DPA com provider** (constraint nº2/D2). Para 400 clientes, vazamento = fim do negócio.
5. **Reconciliação de "o que faltou"** — gap de notas, obrigações não entregues, certidões a vencer — em **painel único consolidado da carteira** (Audire: "todos os clientes numa tela"). Não basta processar; é preciso mostrar o que está pendente, classificado por risco.
6. **Integração com o ERP-contábil que o escritório já usa** (Domínio/Contmatic/Acessórias) — Jettax integra nativamente. Um escritório de 400 clientes **não troca de Domínio**; ele acopla ferramentas ao redor. Somos um satélite, não o sol.
7. **Suporte e SLA** — escritório com 400 clientes tem prazos legais; downtime na véspera de obrigação custa o cliente. Maturidade = suporte responsivo + uptime.

> **Conclusão do item 5:** o "contador empreendedor" já resolveu **2, 3, 5, 6, 7 e parte do 1** na prática (é o que sobrevive com 400 clientes pagantes). Esse é o valor real da parceria — **não a tecnologia, mas a maturidade operacional comprovada + a distribuição.**

---

## 6. Recomendação: BUILD vs. COMPRAR vs. PARCERIA

### 6.1 Matriz de decisão por bloco

| Bloco | Decisão | Por quê |
|---|---|---|
| **Captura DF-e + cofre** | **COMPRAR** (Focus/PlugNotas, DPA) | Commodity; reconstruir = vaidade. Provider absorve LGPD e 500 SPOFs (D2). |
| **e-CAC em lote + CNDs** | **COMPRAR** (Integra Contador SERPRO + Infosimples) | Categoria lotada; é infra. Construir só o onboarding da Autorização de Acesso + health score. |
| **Emissor NFS-e Nacional** | **COMPRAR gateway** (Focus, transparente) | NFS-e Nacional comoditiza cobertura; construir só o "emitir já com cClassTrib auto-auditado". |
| **Base de regras cClassTrib/NCM** | **LICENCIAR** (Systax/e-Auditoria, 31M–143M regras) | Inviável reconstruir; ver doc 00/02. |
| **Motor de auditoria (score+confiança calibrada)** | **CONSTRUIR** | É o moat. Mas Roit já fez a versão básica → construir a versão **que se abstém + risco jurídico classificado**. Long-pole: golden-set por tributarista. |
| **Trilha de boa-fé verificável por 3º** | **CONSTRUIR** | Whitespace #1. Já existe nos packages; ligar a todos os módulos. Buildável já, sem dependência externa. |
| **Recuperação (ingestão+ID+SELIC+dossiê)** | **CONSTRUIR sobre o motor** | Table-stakes não temos; diferencial (trilha+risco) é branco. Depende do motor (P0). |
| **Gestão/obrigações/carteira** | **HERDAR Gestorize** | 23 features maduras já existem (D1). Não reconstruir. Adicionar health score cross-módulo. |
| **Escrituração/folha** | **NÃO FAZER** | Fora de escopo; Domínio/Alterdata dominam há 30 anos. Integrar, não competir. |

### 6.2 Onde a PARCERIA com o "contador empreendedor" acelera (produto/tech, sem decisão societária)

**Prós (o que ele acelera de verdade):**
- **Distribuição validada:** 400 clientes pagantes = prova de mercado + canal vivo (reforça o moat de distribuição já representado pelo Renan).
- **Maturidade operacional comprovada** nos requisitos não-óbvios do item 5 (procuração em escala, onboarding de carteira, painel consolidado, operação em lote estável, suporte). Isso leva **anos** para construir e ele já tem.
- **Integração com prefeituras / automações** — um acervo de engenharia de borda que economiza meses, **mesmo que a NFS-e Nacional comoditize a maior parte** (a transição 2026 não é instantânea; municípios mantêm sistemas próprios integrando ao ADN — há cauda longa).
- **"Ferramenta anterior vendida"** = ele sabe construir, operar e **sair** de um produto contábil. Conhecimento de go-to-market raro.

**Contras / riscos a vigiar:**
- **Risco de absorver a categoria errada:** se a base dele é "mais uma plataforma de captura/e-CAC/obrigações" (espécie B), ela é **commodity** — herdar isso não nos dá moat, e podemos diluir o posicionamento "apuração defensável" virando mais um genérico.
- **A cobertura de prefeituras (o ativo histórico) está em depreciação acelerada** pela NFS-e Nacional 2026 — pagar caro por esse ativo específico é comprar gelo no inverno. Valorizar a **operação/distribuição**, não a tecnologia municipal.
- **Dívida técnica e acoplamento:** ferramenta madura de ~400 clientes carrega legado. Integrar pode ser mais lento que parece; exige due diligence técnica antes de comprometer.
- **Sobreposição com o Gestorize (D1):** já temos a camada de gestão herdada. A base dele pode **conflitar** com o Gestorize em vez de somar — decidir qual é a fundação antes de combinar.

**Recomendação de produto/tech (não societária):**
> **Aproveitar a base do contador empreendedor como ACELERADOR da camada operacional/distribuição (item 5), NÃO como a fundação do moat.** O moat (motor de auditoria que se abstém + trilha verificável + ciclo integrado) continua sendo **construído por nós**. A parceria entra para: (a) destravar paridade operacional madura para o porte de 400 clientes sem reinventar; (b) abrir o canal; (c) trazer cobertura de prefeituras como ponte na transição 2026. **Due diligence técnica obrigatória** antes de qualquer integração de código — verificar se a base é commodity (espécie B) ou se traz operação genuinamente difícil de replicar.

### 6.3 Sequência sugerida (coerente com D4)

1. **Concierge MVP manual** (validar pagamento com 5 escritórios do Renan) — antes de integrar qualquer base.
2. **Due diligence técnica** da ferramenta do contador empreendedor (commodity vs. operação difícil; conflito vs. soma com Gestorize).
3. **Comprar** integrações que destravam paridade sem golden-set: Emissor (set/2026, wedge tempestivo) + e-CAC.
4. **Construir** motor + trilha (P0) quando o golden-set do tributarista existir.
5. **Recuperação** industrializada (isca) sobre o motor.

---

## 7. Síntese visual — o teto e o nosso lugar

```
                    ESCRITURAÇÃO/FOLHA          INTELIGÊNCIA FISCAL          GESTÃO/EMISSÃO CLIENTE
                    (Domínio/Alterdata/...)     (e-Auditoria/SIEG/Jettax)    (Conta Azul/Nibo/Omie)
ciclo da nota:
  captura            🟦 terceiriza               ✅ commodity                  🟦/⬜
  auditoria cClass   🟦                          ✅ (Roit table-stake)         ⬜
  e-CAC lote         🟦 terceiriza               ✅ commodity                  🟦 (só Nibo)
  emissor            ✅ (próprio cliente)        🟦 (SIEG)                     ✅ comoditizado 2026
  recuperação        ⬜                          ✅ commodity                  ⬜
  gestão/obrigações  ✅ maduro                   ✅                            🟦

  >>> WHITESPACE (NINGUÉM): trilha verificável por 3º · confiança que se abstém · ciclo integrado c/ cClassTrib auto-auditado
      ^ É AQUI que construímos. Tudo o resto se compra ou se herda.
```

---

## 8. Fontes (URLs primárias)

**ERP-contábil tradicional**
- Domínio / Thomson Reuters — https://www.dominiosistemas.com.br/ · https://www.dominiosistemas.com.br/solucoes/dominio-one/ · https://www.dominiosistemas.com.br/solucoes/dominio-empresarial/
- Domínio (análise módulos) — https://andersonhernandes.com.br/sistema-dominio-como-funciona/
- Alterdata Contábil — https://www.alterdata.com.br/contabil · https://www.alterdata.com.br/contabil/alterdata-contabil · https://www.alterdata.com.br/contabil/econtador
- Alterdata (análise) — https://andersonhernandes.com.br/alterdata-o-que-e-como-funciona/
- Contmatic Phoenix — https://www.contmatic.com.br/ · https://www.contmatic.com.br/sistema-contabil-contabil-phoenix
- Comparativos de sistemas — https://www.contabeis.com.br/noticias/68315/os-05-melhores-sistemas-contabeis-do-brasil/ · https://netcpa.com.br/colunas/top-5-sistemas-contabeis-para-contadores-no-brasil/24130 · https://www.ledware.com.br/2026/05/05/contaazul-omie-sage-ledcontabil-comparativo-sistemas-cloud-escritorios-2026/

**Inteligência fiscal & automação**
- e-Auditoria — https://www.e-auditoria.com.br/ · https://www.e-auditoria.com.br/planos-e-auditoria/ · https://www.e-auditoria.com.br/blog/solucoes-da-plataforma-e-auditoria/
- e-Auditoria e-CAC — https://www.e-auditoria.com.br/blog/e-cac-o-que-e/
- SIEG HüB/Cofre/Emissor — https://sieg.movidesk.com/kb/article/356120/sieg-hub · https://sieg.movidesk.com/kb/article/358328/aplicativo-nfe-utilitarios-hub-cofre · https://sieg.movidesk.com/kb/pt-br/article/359633/passo-a-passo-sieg-emissor-video · https://sieg.sleekplan.app/changelog?type=feature
- Jettax — https://www.jettax.com.br/ · https://www.jettax.com.br/blog/como-monitorar-pendencias-do-e-cac-automaticamente-e-evitar-surpresas-fiscais/ · https://www.jettax.com.br/blog/cnd-automatica-como-escritorios-estao-eliminando-o-trabalho-manual/ · https://www.jettax.com.br/blog/das-e-pgdas-automatizados-como-calcular-o-simples-nacional-sem-erro-e-em-lote/
- Audire — https://audirecont.com.br/comunicacao-receita-federal-ecac
- Arquivei/Qive — https://qive.com.br/ · https://qive.com.br/funcionalidades/captura-de-documentos-fiscais-automatica · https://qive.com.br/funcionalidades/importacao-e-download-de-xml · https://qive.com.br/escritorios-contabeis/
- Acessórias — https://acessorias.com/site/ · https://app.acessorias.com/ · https://acessorias.com/site/software-contabil/

**Gestão financeira & emissão**
- Conta Azul (planos) — https://contaazul.com/planos/
- Nibo (contador) — https://www.nibo.com.br/contador · https://www.nibo.com.br/empresa/planos-e-precos · https://www.nibo.com.br/
- Omie — https://www.omie.com.br/

**Emissor / NFS-e Nacional / prefeituras**
- Focus NFe (municípios NFS-e Nacional) — https://focusnfe.com.br/guides/nfse/municipios-integrados/municipios-da-nfse-nacional/
- Tecnospeed/PlugNotas (NFS-e Nacional + Reforma) — https://tecnospeed.com.br/plugdfe/nfse/ · https://atendimento.tecnospeed.com.br/hc/pt-br/articles/33081195342871-FAQ-Complementar-NFS-e-NFS-e-Padr%C3%A3o-Nacional-e-a-Reforma-Tribut%C3%A1ria · https://atendimento.tecnospeed.com.br/hc/pt-br/articles/36880757317655-Reforma-Tribut%C3%A1ria-RTC-na-NFS-e-Roadmap-de-adequa%C3%A7%C3%A3o-dos-padr%C3%B5es-IBS-CBS
- Comparativo APIs NFS-e 2026 — https://www.notaas.com.br/blog/post/api-nfse-nacional-melhor-provedor-emissao-nota-fiscal-de-servico-eletronica-nacional

**Recuperação tributária**
- Recupera Simples — https://recuperasimples.com.br/ · https://recuperasimples.com.br/como-recuperar-pis-e-cofins-monofasico-simples-nacional/
- é-Simples — https://www.esimplesauditoria.com/ · https://www.esimplesauditoria.com/lp-recuperacao-do-simples-nacional · https://www.esimplesauditoria.com/pis-e-cofins-monofasicos
- Sittax — https://sittax.com.br/
- e-Auditoria (monofásico) — https://www.e-auditoria.com.br/blog/tributacao-do-pis-e-cofins-monofasico-no-simples-nacional/

---

## 9. Notas de confiança

- **ALTA:** datas regulatórias e APIs oficiais (NFS-e Nacional 5.568/5.570 municípios, Integra Contador, captcha e-CAC jan/2026, NFS-e Nacional 2026); cobertura de módulos das suítes ERP (páginas de produto).
- **MÉDIA:** preços (a maioria opaca — só Conta Azul R$159,90–719,90, Nibo "desde R$99", Focus Growth R$548 são públicos; e-Auditoria/SIEG/Jettax/Audire/Domínio/Alterdata/Contmatic exigem demo). Marcações 🟦/✅ de inteligência fiscal baseadas em descrições de produto, não em teste hands-on.
- **A confirmar com o Renan:** perfil exato da ferramenta do contador empreendedor (é espécie B commodity ou traz operação difícil de replicar?); nomes não achados na web (GOB captura; C-TAX/CITAX/Loara recuperação — doc 00 §4).
- **❓ no quadro** = feature não confirmada em fonte primária; não assumir ausência, apenas não-verificada.
```

*Fonte de verdade cruzada: docs 00–06 deste diretório + CONTEXT.md §9 (timing recalibrado).*
