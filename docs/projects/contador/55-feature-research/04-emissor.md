# 04 — Emissor de NFS-e/NF-e: pesquisa de mercado (table-stakes vs gap)

> Pesquisa de **fontes primárias reais** (docs de API dos gateways, páginas de preço, portal gov NFS-e Nacional, comunicados oficiais) sobre **emissores de NFS-e/NF-e e gateways fiscais** no Brasil, com foco na **NFS-e Nacional (LC 214/2025 · ADN/SEFIN)**.
> **Objetivo:** o conjunto MÍNIMO de funções que nosso Emissor (módulo #4) precisa ter pra competir — lembrando que **Emissor = add-on de REVENDA, NÃO um emissor robusto tipo Conta Azul** (CONTEXT §7 dead-ends).
> **Data:** 2026-06-22 · **Autor:** Atlas (analyst) · **Método:** web real, sem channeling de clones (regra `feedback_no_hydra_style`). "não encontrado" quando a fonte não cobre.
> **Confiança:** ALTA nas datas/obrigatoriedade e nos planos Focus NFe/eNotas (páginas oficiais); MÉDIA nos números de municípios PlugNotas/Tecnospeed (variam por página e mês); MÉDIA-BAIXA no detalhe técnico fino do credenciamento ADN (PDF gov não renderizou; triangulado por Tecnospeed + portal gov).

---

## TL;DR estratégico (leia isto)

1. **A janela é o relógio.** Simples Nacional vira **obrigado a emitir NFS-e pelo Emissor Nacional a partir de 01/09/2026** (Resolução CGSN nº 189/2026). MEI já é obrigado desde 01/09/2023. Isso joga **milhões de prestadores de serviço Simples** para a NFS-e Nacional em ~2 meses — exatamente o ICP do contador. **Esse é o gatilho de venda do Emissor.**
2. **Emissão de NFS-e Nacional virou commodity de gateway.** Focus, PlugNotas/Tecnospeed, eNotas, Notaas e (até 31/07/2026) Nuvem Fiscal entregam a emissão por API com preço transparente baixo (~R$0,10–0,75/nota). **Não competimos construindo emitter** — D2/D3 do CONTEXT já mandam **comprar de provider**. Competimos no **wrapper**: tributação auto-auditada + modelo de revenda pro contador.
3. **Dois movimentos do mercado que mudam o tabuleiro em 2026:**
   - **Nuvem Fiscal será DESATIVADA em 31/07/2026** (comunicado oficial 22/04/2026, prazo 90d). Confirma o dead-end do CONTEXT — **não usar como provider.**
   - **A API oficial gov de DANFSe será descontinuada em 01/07/2026** (NT nº 008/2026): a **geração do PDF do DANFSe passa a ser responsabilidade do sistema emissor**. Quem revende emissão precisa gerar DANFSe com layout padronizado nacional (A4, QR Code, IBS/CBS) por conta própria — **mais um motivo pra comprar gateway que já resolve isso** (PlugNotas/Focus geram o PDF).
4. **Nosso ângulo único = não é "emitir", é "emitir com a tributação certa auto-auditada + margem de revenda pro contador".** Nenhum gateway pesquisado oferece auto-auditoria do `cClassTrib`/IBS/CBS na emissão nem um painel de revenda B2B2B desenhado pro escritório. Esse é o whitespace.
5. **Nosso emissor atual (`apps/contador/app/emissor/`) é uma DEMO sintética client-side** — o diferencial (auto-auditoria + revenda) já está prototipado e narrado de forma honesta (G6); falta toda a camada de emissão real (credenciamento + gateway + DANFSe). Gap detalhado na §5.

> ⚠️ **Coerência com o doc `02-auditoria.md` (mesmo dia):** distinguir DUAS obrigatoriedades diferentes que não devem ser confundidas:
> - **Emitir a NFS-e pelo Emissor Nacional** (Res. CGSN 189/2026) → **01/09/2026 para o Simples** — confirmado em página oficial gov. É o gatilho comercial do **Emissor**.
> - **Preencher o `cClassTrib`/CST IBS/CBS na nota** → para Simples/MEI há indício de **adiamento para jan/2027** (ver `02-auditoria.md`); Lucro Real/Presumido já informam em 2026.
> Ou seja: o Simples será **obrigado a emitir pelo Emissor Nacional em set/2026 mesmo que o preenchimento do cClassTrib só aperte em 2027.** Isso reforça o Emissor como wedge de aquisição barato e tempestivo — e a auto-auditoria do cClassTrib como upsell que ganha urgência em 2027.

---

## 1. Concorrentes / gateways reais (nome + URL)

### 1.1 Infra oficial (gov) — a base, gratuita

| Recurso | URL (primária) | Papel |
|---------|----------------|-------|
| **Portal NFS-e Nacional (gov)** | https://www.gov.br/nfse/ | Hub oficial. Emissor Público Nacional (web/mobile/API), documentação técnica, biblioteca de manuais |
| **Ambiente de Dados Nacional (ADN)** | https://www.gov.br/nfse/pt-br/municipios/produtos-disponiveis/ambiente-de-dados-nacional-adn | Repositório nacional de DF-e (NFS-e + eventos + créditos/débitos/apuração). Municípios e SEFIN compartilham documentos; valida consistência antes de armazenar |
| **Manual API Emissor Público (contribuintes) v1.2 out/2025** | https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual/manual-contribuintes-emissor-publico-api-sistema-nacional-nfs-e-v1-2-out2025.pdf | Guia oficial de uso das APIs do Sistema Nacional para o contribuinte |
| **Implementação NFS-e / ADN (municípios)** | https://www.gov.br/nfse/pt-br/municipios/como-implementar-a-nfs-e-1/implementacao-da-nfs-e-adn | Fluxo de adesão municipal ao ADN |

> A emissão pelo **Emissor Público Nacional (SEFIN) é GRATUITA**. O valor de um gateway pago é orquestração multi-município, abstração de instabilidade, webhook, DANFSe pronto e os outros documentos (NF-e/NFC-e), que o emissor público não cobre.

### 1.2 Gateways / emissores via API (os concorrentes-buy)

| Gateway | URL | Dono / nota |
|---------|-----|-------------|
| **Focus NFe** | https://focusnfe.com.br/precos/ · https://focusnfe.com.br/produtos/nfse-nacional/ | Independente. **Preço 100% transparente** (raro no setor) |
| **PlugNotas** | https://plugnotas.com.br/nfse/ · https://docs.plugnotas.com.br/ | **É da TecnoSpeed** (confirmado). Perfil revenda/white-label/software house |
| **TecnoSpeed PlugDFe** | https://tecnospeed.com.br/plugdfe/nfse/ · https://tecnospeed.com.br/plugdfe/nfe/ | Produto "componente" (DLL) + API da própria TecnoSpeed, voltado a software house. PlugNotas é o irmão SaaS/API |
| **eNotas** | https://enotass.com.br/notas | Forte no nicho "PJ digital"/infoprodutos (integra Hotmart/Kiwify/Monetizze) |
| **Notaas** | https://www.notaas.com.br/ · https://notagateway.com.br/ | Player novo, freemium (50 notas/mês grátis), pitch dev-first |
| **Nuvem Fiscal** | https://www.nuvemfiscal.com.br/ | 🔴 **DESATIVADA em 31/07/2026** (comunicado 22/04/2026). NÃO usar |
| **Oobj** | https://oobj.com.br/ | **Agora é Avalara.** Enterprise (emissão+recepção+guarda DF-e). Fora do nosso ICP |
| **NFE.io** | https://nfe.io/ | Emissor por API, mais antigo. Não detalhado nesta rodada |
| **Conta Azul** | (referência, NÃO alvo — CONTEXT §7) | Emissor robusto dentro de ERP de R$1,7bi. Benchmark, não concorrente do nosso add-on |

---

## 2. Matriz funções × concorrente

> Legenda: ✅ tem · ⚠️ parcial/condicional · ❌ não · ❔ não encontrado na fonte primária. Preços e municípios conforme páginas oficiais consultadas em jun/2026 (sujeitos a mudança).

| Função | Focus NFe | PlugNotas (TecnoSpeed) | eNotas | Notaas | Nuvem Fiscal | NFS-e Nacional gov |
|--------|-----------|------------------------|--------|--------|--------------|--------------------|
| **Emissão NFS-e municipal** | ✅ | ✅ | ✅ | ✅ | ✅ (até 31/07) | ✅ (só padrão nacional) |
| **Emissão NFS-e Nacional (ADN/SEFIN)** | ✅ (API dedicada NFS-e Nacional) | ✅ (layout padrão nacional) | ⚠️ ❔ (foca municipal/PJ digital) | ⚠️ ❔ | ✅ (até 31/07) | ✅ (é o ambiente) |
| **NF-e (mod. 55)** | ✅ | ✅ | ⚠️ (só Plus/Pro) | ✅ | ✅ | ❌ |
| **NFC-e** | ✅ | ✅ | ⚠️ (casos Plus/Pro) | ✅ | ✅ | ❌ |
| **CT-e / MDF-e / NFCom / DC-e** | ✅ (todos) | ⚠️ (NF-e/NFC-e/CT-e/MDF-e) | ❌ | ❔ | ⚠️ | ❌ |
| **Multi-município** | **3.000+** municípios | **~1.600–2.000+** (página NFS-e cita "1.600"; blog cita "2.000+") | **500+** municípios | "todos" (alega) | ❔ | nacional (municípios aderentes ao ADN) |
| **Garantia de município novo** | ✅ **R$199 fixo em até 15 dias úteis** (único do mercado que garante) | ❔ | ❌ | ❌ | ❌ | n/a |
| **DANFSe (PDF)** | ✅ (gera PDF) | ✅ (PDF white-label "idêntico ao portal") | ✅ (XML+PDF) | ❔ | ✅ | ⚠️ **API gov de DANFSe descontinuada 01/07/2026 → emissor gera** |
| **API REST / JSON** | ✅ | ✅ | ⚠️ (REST só Plus/Pro) | ✅ | ✅ | ✅ |
| **Webhook (status/autorização/cancelamento)** | ✅ | ✅ (push, "sem rotina de consulta") | ❔ | ✅ (desde plano grátis) | ✅ | ⚠️ (distribuição DFe por NSU, não webhook) |
| **Cancelamento / substituição** | ✅ | ✅ (autorização/distribuição) | ✅ | ❔ | ✅ | ✅ (eventos) |
| **Cálculo de tributo na emissão** | ⚠️ (preenche o que você manda; valida campos) | ⚠️ (idem; "validação tributária" no PlugDFe) | ⚠️ | ❌ | ⚠️ | ⚠️ (valida consistência, não classifica `cClassTrib` pra você) |
| **Lote / emissão em massa** | ✅ | ✅ | ⚠️ | ❔ | ✅ | ✅ (DPS em lote) |
| **Certificado A1/A3 (mTLS ICP-Brasil)** | ✅ (custodia A1) | ✅ (custodia A1) | ✅ | ✅ | ✅ | exige A1/A3 + mTLS |
| **Credenciamento ADN abstraído** | ✅ (resolve por você) | ✅ | ⚠️ | ❔ | ✅ | n/a (é o destino) |
| **White-label** | ⚠️ (PDF) | ✅ **(DANFSe white-label + perfil software house)** | ⚠️ (painel) | ✅ (painel white-label) | ❔ | n/a |
| **Modelo revenda / software house** | ⚠️ (CNPJs ilimitados no Growth, mas não é "revenda" explícita) | ✅ **(perfil software house — `ConfigurarSoftwareHouse`, token TecnoAccount)** | ❌ (1 plano = 1 CNPJ) | ⚠️ (painel white-label) | ❔ | n/a |
| **Preço — modelo** | **por nota + por CNPJ** (transparente) | sob consulta (não publica) | **por nota + 1 CNPJ/plano** (transparente) | freemium + por nota | (encerrando) | **gratuito** |

### Preços confirmados (fontes oficiais)

**Focus NFe** (https://focusnfe.com.br/precos/) — emissão **e recepção** inclui NFS-e Nacional:
- **Solo** R$89,90/mês · 1 CNPJ · 100 notas · extra R$0,10 · emite NF-e/NFS-e/NFC-e/CT-e/MDF-e/NFCom/DC-e + recebe NF-e/CT-e/**NFS-e Nacional**
- **Start** R$113,90/mês · 3 CNPJs (R$37,90 por CNPJ extra) · 100 notas/CNPJ · extra R$0,10
- **Growth** R$548,00/mês · **CNPJs ilimitados** · 4.000 notas · extra R$0,12
- **Enterprise** sob consulta · CNPJs ilimitados
- **Retail** (NFC-e) R$59,90 · 500 NFC-e + 100 NF-e · extra R$0,05/NFC-e
- Sem taxa de setup, sem fidelidade. **3.000+ municípios**; município novo R$199 em 15 dias úteis.

**eNotas** (https://enotass.com.br/notas):
- **Básico** R$137/mês · até 50 notas (~R$2,74/nota) · só NFS-e
- **Plus** R$247/mês · até 500 notas (~R$0,49/nota) · + NF-e mod.55, API REST, notas de entrada
- **Pro** R$347/mês · ilimitado · + gerente dedicado
- 500+ municípios. **Não suporta multi-CNPJ num plano** (1 CNPJ por assinatura) → **ruim pra revenda**. Anual dá 15–20% off.

**PlugNotas / TecnoSpeed:** preço **não publicado** (sob consulta) — padrão do segmento revenda/enterprise. ~1.600–2.000+ municípios; DANFSe white-label; perfil software house nativo.

**Nuvem Fiscal:** encerrando, preço irrelevante.

> **Insight de preço:** o mercado é **opaco** (PlugNotas/Tecnospeed/Oobj não publicam) exceto Focus e eNotas. **Preço transparente é fosso de GTM** (já anotado no doc 12). Para o **nosso** Emissor de revenda, a economia é simples: comprar do gateway a ~R$0,10–0,12/nota (Focus Growth, CNPJs ilimitados) e a revenda do contador é sobre **assinatura mensal por CNPJ**, não por nota.

---

## 3. TABLE STAKES vs DIFERENCIAIS

### 3.1 TABLE STAKES (sem isto, não é um emissor — mas não é onde se vence)

1. **Emitir NFS-e no padrão Nacional (ADN/SEFIN)** — obrigatório pro Simples a partir de 01/09/2026.
2. **Emitir NFS-e municipal** nos municípios que ainda usam sistema próprio (coexistência segue válida).
3. **Cobertura ampla de municípios** (referência de mercado: 1.600–3.000+). Para revenda pro contador, mirar onde estão os clientes dele.
4. **Gerar DANFSe (PDF)** no novo layout padrão nacional (A4, QR Code, IBS/CBS) — **crítico**: a API gov de DANFSe morre em 01/07/2026, a responsabilidade vira do emissor.
5. **Cancelamento e substituição** via eventos.
6. **API REST + webhook** de status (autorização/cancelamento/rejeição).
7. **Certificado A1/A3 ICP-Brasil + mTLS** — gerenciado pelo gateway (não custodiamos A1, D2 do CONTEXT).
8. **Emissão em lote** (DPS em lote).
9. **NF-e/NFC-e** se o cliente do contador também vende produto (nice-to-have pro nosso ICP de serviço, mas table-stakes pra ser "emissor completo").

> **Decisão coerente com CONTEXT:** todas as table-stakes acima são **COMPRADAS do gateway** (Focus como candidato barato/transparente; PlugNotas/TecnoSpeed se quiser white-label/revenda nativos). Não construímos nada disso — replicaria commodity e brigaria com gigante (dead-end §7).

### 3.2 DIFERENCIAIS (nosso ângulo — o que NENHUM gateway faz)

1. **🟢 Emissão com tributação auto-auditada (`cClassTrib`/IBS/CBS).** Os gateways **preenchem o que você manda** e validam consistência de campo — **nenhum classifica o serviço no `cClassTrib` certo nem audita a tributação antes de emitir.** Nosso motor sugere + auto-audita (✓ confere / ⚠ revisar) com fundamento citado, e o **contador confirma (ato humano, G6)**. Isto liga o Emissor ao **moat da Auditoria da Reforma** — o emissor vira a "ponta de emissão" do mesmo motor de defensabilidade.
2. **🟢 Modelo de REVENDA B2B2B pro contador.** Contador compra pacote, revende ao cliente dele, fica com a margem. Painel de revenda + calculadora de margem (já prototipado). eNotas é **1 CNPJ/plano** (anti-revenda); Focus tem CNPJs ilimitados mas **sem painel de revenda**; só PlugNotas/TecnoSpeed tem perfil software house — e ainda assim **sem a camada de tributação correta**. Combinar **revenda + tributação auto-auditada** é o whitespace.
3. **🟡 Trilha de boa-fé na emissão.** Registrar que a tributação foi sugerida-pelo-motor-e-confirmada-pelo-contador (proveniência) — coerente com o moat de defensabilidade do core. Diferencial fraco hoje, forte conforme a Reforma aperta a fiscalização IBS/CBS.
4. **🟡 Preço transparente + UX simples** — fosso de GTM (a maioria é opaca).

> **Posicionamento do Emissor (1 frase):** *"O contador emite a NFS-e Nacional do cliente já com a tributação da Reforma auto-auditada — e revende isso com a margem dele."* Não é "mais um emissor"; é a **ponta de emissão do motor de apuração defensável.**

---

## 4. Como funciona o credenciamento ADN / NFS-e Nacional (na prática)

> Triangulado do portal gov + manual de contribuintes v1.2 (out/2025) + explainer TecnoSpeed. Detalhe técnico fino é MÉDIA confiança (o PDF gov de endpoints não renderizou nesta sessão; recomenda-se ler o manual completo antes de implementar).

### 4.1 O modelo (quem é quem)
- **ADN (Ambiente de Dados Nacional):** repositório nacional de DF-e (NFS-e nacional + eventos + créditos/débitos/apuração). Recebe documentos dos **sistemas autorizadores municipais** e da **SEFIN Nacional**, valida consistência e armazena. Permite consulta por SEFIN e pelo contribuinte (distribuição DFe).
- **SEFIN / Emissor Público Nacional:** o emissor oficial gratuito (web/mobile/API). Hoje **~70% do volume de NFS-e do país já passa pela NFS-e Nacional** (dado TecnoSpeed). Municípios podem **coexistir** com sistema próprio.
- **DPS (Declaração de Prestação de Serviços):** o documento que o emissor **envia**; após processamento vira **NFS-e**. (No fluxo legado municipal era RPS → NFS-e; no nacional é **DPS → NFS-e**.)

### 4.2 Passos reais (prestador/contribuinte que vai emitir por API)
1. **Ter certificado digital ICP-Brasil A1 (arquivo) ou A3.** A comunicação com a API nacional é **mTLS** (TLS mútuo) — o certificado autentica a conexão.
2. **Credenciamento no ambiente nacional** — o prestador faz o credenciamento online para acesso/consumo do Web Service. Em municípios aderentes ao ADN, o credenciamento de emissão por webservice é exigido (pelo portal da Prefeitura ou pelo emissor nacional, conforme o caso).
3. **Homologação:** testar no **ambiente de homologação** antes de produção (a API tem produção + homologação).
4. **Emitir:** enviar a **DPS** (avulsa ou em **lote**) → o ambiente processa → retorna a **NFS-e** (chave + XML). Eventos (cancelamento/substituição) por chamadas próprias.
5. **DANFSe:** gerar o PDF auxiliar. ⚠️ **A partir de 01/07/2026 a API gov de DANFSe é descontinuada** — o **sistema emissor** gera o PDF no layout padrão nacional (A4 mín., QR Code de validação, todos os campos do XML inclusive **IBS/CBS**), conforme **NT nº 008/2026**.
6. **Distribuição DFe:** consumir os documentos destinados ao CNPJ via **NSU** (controle de número sequencial), com backoff — modelo análogo ao NFeDistribuicaoDFe (doc 12 alerta: polling central, nunca distribuído, pra não tomar bloqueio).

### 4.3 O atalho pragmático (o que recomendo)
**Não fazer o credenciamento/mTLS/DANFSe na mão.** Comprar o gateway (Focus ou PlugNotas/TecnoSpeed) que **já abstrai credenciamento + certificado + multi-município + DANFSe + eventos** numa API JSON. Nosso código só monta o payload (já com `cClassTrib` auto-auditado) e chama o gateway. Coerente com D2/D3.

---

## 5. O que NOSSO Emissor tem hoje vs o GAP

**Onde está:** `apps/contador/app/emissor/` (EmissorApp / EmissorFluxo / RevendaCalculadora / emissor-model.ts / page.tsx).
**Natureza atual (autodeclarada no código):** **demo navegável 100% client-side, base SINTÉTICA, sem emissão real.** Não toca `lib/api.ts`, `packages/*`. A emissão real (credenciamento ADN / NFS-e Nacional) está marcada como **"Fase 7"**. Toda a linguagem é **G6-safe** (sugere, não afirma "tributação correta").

### O que JÁ TEM (e está alinhado ao diferencial)
| Capacidade | Status hoje |
|------------|-------------|
| Fluxo guiado de emissão (cliente → serviço → sugestão → confirmação humana → "rascunho DANFSe") | ✅ demo |
| **Motor de sugestão de `cClassTrib`/tributos** (heurística determinística por regime + palavras-chave) | ✅ demo sintético (`sugerirTributacao`) |
| **Auto-auditoria item a item** (✓ confere / ⚠ revisar + porquê: descrição, cClassTrib×ramo, materialidade do valor, município) | ✅ demo — **é o diferencial** |
| **Confirmação humana (ato privativo do contador, CRC)** — espelha cerimônia do core | ✅ demo (G6/D8) |
| Catálogo de serviços (LC 116) + pré-preenchimento | ✅ demo |
| Quebra de tributos por componente (CBS/IBS/ISS transição/DAS) + DANFSe preview | ✅ demo (rascunho sintético, "não transmite ao fisco") |
| **Painel/calculadora de REVENDA** (pacote, margem, custo escalonado por nº emissores) | ✅ demo — **é o diferencial** |
| Fundamento normativo citado (LC 214/2025, LC 116, LC 123) | ✅ demo |

> **Veredito:** o protótipo **já encena os dois diferenciais certos** (auto-auditoria + revenda) e com a honestidade G6 correta. A arquitetura está alinhada à tese: o emissor é a ponta de emissão do motor, não um ERP.

### O GAP (o que falta pra ser real — "Fase 7")
| Gap | Severidade | Nota |
|-----|-----------|------|
| **Integração com gateway real** (Focus ou PlugNotas/TecnoSpeed) — emitir DPS de verdade no ADN | 🔴 P0 | Comprar, não construir. Define unit economics da revenda |
| **`cClassTrib` real do motor fiscal + golden-set** (hoje é heurística sintética) | 🔴 P0 | Depende do **motor de auditoria** (moat) — é o que diferencia de gateway. Sem isso, viramos "mais um emissor" |
| **Geração própria de DANFSe** no layout NT 008/2026 (A4/QR/IBS/CBS) — ou delegar ao gateway | 🟡 P1 | API gov morre 01/07/2026. Se gateway gera, OK; se não, é nosso |
| **Certificado/credenciamento** (A1/A3 + mTLS + credenciamento ADN) | 🟡 P1 | **Abstrair via gateway** (D2: não custodiar A1). Onboarding de credenciamento por cliente = ponto de atrito a desenhar |
| **Persistência real** (notas, eventos, status) — hoje é estado de sessão | 🟡 P1 | Liga ao schema do core |
| **Painel de revenda operacional** (provisionar CNPJ do cliente do contador, billing, split de margem) | 🟡 P1 | Hoje é calculadora ilustrativa. É o motor comercial do add-on |
| **Eventos** (cancelamento/substituição) e **distribuição DFe** (NSU/backoff) | 🟢 P2 | Gateway resolve a maior parte |
| **NF-e/NFC-e** se o ICP precisar emitir produto | 🟢 P2 | Só se aparecer demanda; foco é serviço |

---

## 6. Recomendação (table-stakes + nosso gap, em uma tela)

- **Comprar a emissão**, não construir. Candidato primário **Focus NFe** (preço transparente, NFS-e Nacional dedicada, 3.000+ municípios, garantia de município novo R$199/15d, CNPJs ilimitados no Growth a R$0,12/nota). Candidato para **white-label/revenda nativa**: **PlugNotas/TecnoSpeed** (perfil software house) — pedir cotação, pois preço é opaco. **Nunca Nuvem Fiscal** (morre 31/07/2026).
- **Table-stakes** (todas via gateway): NFS-e Nacional + municipal, DANFSe (novo layout pós-01/07/2026), cancelamento/substituição, API+webhook, A1/A3+mTLS, lote, multi-município.
- **Onde NÓS vencemos (construir só isto):** (1) **payload de emissão já com `cClassTrib` auto-auditado** pelo motor da Reforma (liga ao moat); (2) **painel de revenda B2B2B** real pro contador (provisionar/billing/margem); (3) **trilha de boa-fé** na emissão. Ninguém junta os três.
- **Gatilho comercial:** **01/09/2026 — Simples obrigado ao Emissor Nacional** (Res. CGSN 189/2026). É a deixa pra o Renan vender o Emissor de revenda à carteira de escritórios. Não perder essa janela.
- **Risco de timing:** **API gov de DANFSe descontinuada 01/07/2026** — confirmar com o gateway escolhido que ele já gera o DANFSe no novo padrão antes de prometer ao cliente.

---

## 7. Fontes (URLs primárias)

**Gov / oficial (NFS-e Nacional, ADN, obrigatoriedade):**
- Portal NFS-e Nacional — https://www.gov.br/nfse/
- ADN (Ambiente de Dados Nacional) — https://www.gov.br/nfse/pt-br/municipios/produtos-disponiveis/ambiente-de-dados-nacional-adn
- Implementação NFS-e / ADN — https://www.gov.br/nfse/pt-br/municipios/como-implementar-a-nfs-e-1/implementacao-da-nfs-e-adn
- Manual API Emissor Público (contribuintes) v1.2 out/2025 — https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual/manual-contribuintes-emissor-publico-api-sistema-nacional-nfs-e-v1-2-out2025.pdf
- Receita Federal — NFS-e padrão nacional obrigatória p/ Simples (Res. CGSN 189/2026, 01/09/2026) — https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/abril/nfs-e-de-padrao-nacional-sera-obrigatoria-para-optantes-do-simples-nacional
- Portal NFS-e — obrigatoriedade Simples via Emissor Nacional — https://www.gov.br/nfse/pt-br/noticias/nfs-e-e-simples-nacional-obrigatoriedade-de-emissao-atraves-do-emissor-nacional

**Descontinuações (timing 2026):**
- DANFSe — API oficial descontinuada 01/07/2026 (NT 008/2026) — https://www.reformatributaria.com/tecnologia/api-do-danfse-sera-descontinuada-em-julho-de-2026-e-emissao-passa-a-ser-feita-pelos-sistemas-das-empresas/
- FENACON — DANFSe novo padrão + API descontinuada — https://fenacon.org.br/reforma-tributaria/danfse-tera-novo-padrao-nacional-e-api-oficial-sera-descontinuada-em-julho/
- Nuvem Fiscal — comunicado de desativação 31/07/2026 — https://www.nuvemfiscal.com.br/suporte/
- Nuvem Fiscal — desativação (Projeto ACBr) — https://www.projetoacbr.com.br/forum/topic/91922-comunicado-de-desativa%C3%A7%C3%A3o-do-servi%C3%A7o-nuvem-fiscal-22042026/

**Gateways (páginas/docs primárias):**
- Focus NFe — preços — https://focusnfe.com.br/precos/
- Focus NFe — NFS-e Nacional — https://focusnfe.com.br/produtos/nfse-nacional/
- PlugNotas — NFS-e — https://plugnotas.com.br/nfse/
- PlugNotas — docs API — https://docs.plugnotas.com.br/
- PlugNotas — NF-e — https://plugnotas.com.br/nfe/
- TecnoSpeed PlugDFe — NFS-e — https://tecnospeed.com.br/plugdfe/nfse/
- TecnoSpeed PlugDFe — NF-e — https://tecnospeed.com.br/plugdfe/nfe/
- TecnoSpeed — ADN explainer — https://blog.tecnospeed.com.br/ambiente-de-dados-nacional-da-nfs-e/
- TecnoSpeed — NFS-e Nacional (prazos) — https://blog.tecnospeed.com.br/nfse-nacional-tudo/
- eNotas — planos/preços — https://enotass.com.br/notas
- Notaas — comparativos e API — https://www.notaas.com.br/
- Oobj (Avalara) — https://oobj.com.br/tecnologia/api-para-emissao/
- NFE.io — https://nfe.io/

**Confiança:** datas/obrigatoriedade e preços Focus/eNotas = ALTA (páginas oficiais). Municípios PlugNotas/TecnoSpeed = MÉDIA (números variam entre páginas). Detalhe técnico do credenciamento ADN/endpoints = MÉDIA (PDF gov não renderizado nesta sessão; ler manual v1.2 antes de implementar).
