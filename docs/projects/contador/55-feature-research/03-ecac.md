# Feature Research — e-CAC em lote + API Integra Contador (SERPRO)

> Pesquisa de **fontes primárias** (docs oficiais SERPRO/Receita Federal, sites/docs dos produtos) sobre (A) ferramentas de gestão fiscal em lote / e-CAC para escritórios contábeis e (B) o que a **API Integra Contador (SERPRO)** realmente expõe hoje. Objetivo: o conjunto MÍNIMO de funções que nosso módulo e-CAC (`apps/contador/app/ecac/`) precisa ter pra competir.
>
> **Autor:** Atlas (Analyst) · **Data:** 2026-06-22 · **Base:** `00-context/CONTEXT.md` (D9), `12-tech-research-mercado.md`, `15-como-o-mercado-vende-sieg.md` · **Método:** web real + docs oficiais. SEM channeling de clones (regra `feedback_no_hydra_style`).
>
> **Confiança:** ALTA no que a API expõe (doc oficial SERPRO lida diretamente) · MÉDIA-ALTA na matriz de concorrentes (sites/docs de produto, alguns sem detalhe granular) · MÉDIA nos preços por chamada (Faixa 1 confirmada na fonte oficial via reseller; faixas superiores em imagem não-legível — marcadas "não confirmado").

---

## TL;DR (a resposta direta)

1. **A categoria é table-stakes, não diferencial** (confirma D9 do CONTEXT). Todo player sério já faz e-CAC em lote via API oficial SERPRO. Não dá pra "ganhar" agregando — dá pra **não-existir** se faltar.
2. **TABLE STAKES (o mínimo pra sentar à mesa):** (a) **caixa postal monitorada com triagem de relevância** (a Receita marca msgs relevantes com "!"; Neo/Audire/Questor classificam por prioridade); (b) **CND/certidões em lote com renovação automática** (federal/PGFN, estadual, trabalhista, FGTS — vencimento + reemissão programada); (c) **situação fiscal em massa (SITFIS)**; (d) **alerta de procuração/autorização vencida** — agora crítico pela mudança de dez/2025; (e) **gestão da nova "Autorização de Acesso"** (confirmação em ≤30 dias pelo representante).
3. **A API Integra Contador permite automatizar:** caixa postal (consultar/detalhar/monitorar), situação fiscal massiva (SITFIS), DAS/DARF (gerar/emitir), DCTFWeb (transmitir/consultar/gerar guia), PGDAS-D, parcelamentos (Simples/MEI, ordinário e especial), pagamentos (PAGTOWEB), procurações (obter + AUTENTICAPROCURADOR), DTE, e-Processo (consulta). **NÃO expõe CND conjunta RFB/PGFN como serviço dedicado** — esse é o principal gap a cobrir com **Infosimples** (API por consulta). Custo da API: **~R$0,24–0,96 por emissão completa** (Faixa 1).
4. **Captcha jan/2026 mata scraping do portal, NÃO a API.** O captcha só dispara quando o portal detecta acesso robotizado (fonte: Receita Federal, jan/2026). A API Integra Contador é canal oficial autenticado por e-CNPJ → **imune ao captcha**. Isso transforma a API de "opção" em **único caminho viável** — vento de cauda pra quem já está na API e dor aguda pra quem ainda raspa.
5. **NOSSO e-CAC hoje (`app/ecac/`) é um cockpit READ-ONLY 100% sintético** — UX boa (carteira numa tela, caixa postal mark-as-read, 4 CNDs com preview, "só pendências", "CND em lote"), mas **zero integração real**. O gap não é de UX; é de **backend SERPRO + onboarding de procuração + renovação automática + monitor diário**.

---

## A) Concorrentes reais (nome + URL)

| # | Produto | URL | e-CAC em lote? | Via API oficial SERPRO? |
|---|---------|-----|----------------|--------------------------|
| 1 | **SIEG IriS** (+ HUB/Cofre) | https://portalsieg.kinsta.cloud/iris/ · KB: https://sieg.movidesk.com/kb | Sim — caixa postal, procurações, pendências, certidões, parcelamentos, PGDAS | Sim (também aceita A1) |
| 2 | **Neo Controle / e-CAC Premium** | https://www.neosolutions.com.br/ecac-premium | Sim — varre e-CAC de toda a carteira, baixa relatório situação fiscal, caixa postal diária, triagem 3-níveis | **Sim, API oficial SERPRO (Integra Contador)** — declarado explicitamente |
| 3 | **Infosimples** (API e-CAC) | https://infosimples.com/consultas/ecac-caixa-postal/ | API de consulta (caixa postal, CND federal/PGFN, CND estadual SEFAZ, DEC) | **Não** — automação por certificado PKCS12 (web service próprio), não Integra Contador |
| 4 | **Acessórias** | https://www.acessorias.com | Sim — monitoramento + CND em lote + Komunic (WhatsApp/log de leitura) | Sim (mix) |
| 5 | **Audire** (Contabilidade Digital) | https://audirecont.com.br/comunicacao-receita-federal-ecac | Sim — monitor e-CAC + DEC + procuração + situação fiscal; visão única, msgs classificadas por prioridade/assunto/status | Sim |
| 6 | **Questor** (Zen / Quiu / CND / Caixa Postal) | https://www.questor.com.br/caixa-postal/ · https://docs.questor.com.br | Sim — caixa postal (>175k msgs/mês), CND +2.000 órgãos, Quiu (robô DCTFWeb/PGDAS), monitor CND | Sim (Quiu) |
| 7 | **Jettax** (Módulo Prevenção) | https://www.jettax.com.br/modulos/prevencao/ | Sim — monitor diário e-CAC + DEC-SP/DUC-SP + Dívida Ativa + FGTS + CNDs + parcelamentos | Sim (só A1 na captura; Prevenção monitora portais) |
| 8 | **Arquivei / Qive** | https://qive.com.br | Captura DF-e forte; **e-CAC NÃO é foco** (virou contas a pagar) | Captura via A1/A3 |
| 9 | **Oobj** | https://www.oobj.com.br | Foco em documentos fiscais/SPED; e-CAC **não confirmado** como módulo dedicado | não confirmado |
| 10 | **e-Auditoria** (e-Monitor) | https://www.e-auditoria.com.br/solucoes/para-integrar/integracao-com-o-e-cac/ | Sim — captura automática e-CAC **via API oficial SERPRO** declarada; antecipa risco fiscal | **Sim, API oficial SERPRO** |
| — | **Outros achados** | Alterdata CND (https://www.alterdata.com.br/contabil/cnd); HubCount/HubAlertas+ (https://www.hubcount.com.br/alertas-contabilidade); MasterTax DEC-CND (https://www.mastertax.com.br); Confi; GClick | CND/caixa postal | mix |

> **+ a API oficial:** **Integra Contador (SERPRO)** — https://apicenter.estaleiro.serpro.gov.br/documentacao/api-integra-contador/ · loja: https://loja.serpro.gov.br/integra-contador

---

## B) Matriz de funções × concorrente

Funções do e-CAC real (o universo a cobrir). Legenda: ✅ tem · 🟡 parcial/indireto · ❌ não/não-encontrado · `?` não-confirmado.

| Função e-CAC | SIEG IriS | Neo | Infosimples | Acessórias | Audire | Questor | Jettax | e-Auditoria | **NÓS hoje** |
|---|---|---|---|---|---|---|---|---|---|
| **Monitorar caixa postal/intimações (c/ triagem relevância)** | ✅ | ✅ (3 níveis) | ✅ (consulta) | ✅ (+WhatsApp) | ✅ (prioridade) | ✅ (>175k/mês) | ✅ (diário) | ✅ | 🟡 sintético (mark-as-read, sem triagem "!") |
| **Alerta de PRAZO em intimação** | ✅ | ✅ | 🟡 | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **CND/certidões em lote (Fed/PGFN, Estadual, Trab, FGTS)** | ✅ | ✅ | ✅ (Fed+Est, consulta) | ✅ (lote) | 🟡 | ✅ (+2.000 órgãos) | ✅ | ✅ | 🟡 sintético ("CND em lote" demo) |
| **Renovação automática de certidão (por vencimento)** | ✅ | ✅ | 🟡 | ✅ | ? | ✅ | ✅ | ? | ❌ |
| **Situação fiscal (SITFIS) em massa** | ✅ | ✅ (relatório) | 🟡 | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 sintético (declarações/ausência) |
| **Parcelamentos (consulta/DAS)** | ✅ | ✅ | ? | 🟡 | ✅ | ✅ | ✅ | ✅ | ❌ |
| **DARF/guias (gerar)** | ✅ | 🟡 | ? | 🟡 | 🟡 | ✅ (Quiu) | 🟡 | ✅ | ❌ |
| **Ausência/omissão de declaração** | ✅ | ✅ | 🟡 | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 sintético (flag) |
| **IRPF / processos (e-Processo)** | 🟡 | ? | ? | ? | ? | 🟡 | ? | 🟡 | ❌ |
| **Gestão de procuração + alerta de vencida** | ✅ | ✅ (alerta) | n/a | ✅ | ✅ | 🟡 | ✅ | ✅ | ❌ |
| **Nova "Autorização de Acesso" (dez/2025, aceite ≤30d)** | ? atualizando | ? | n/a | ? | ? | ? | ? | ? | ❌ |
| **Onboarding gov.br Prata/Ouro / e-CNPJ** | ✅ | ✅ | A1/A3 | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |

> Leitura: a linha onde **todos** estão fortes (caixa postal + CND lote + situação fiscal) é table-stakes. A coluna onde **ninguém** cravou ainda na web pública é a **gestão da nova Autorização de Acesso de dez/2025** (todos os fluxos legados de procuração quebraram parcialmente) — **janela curta de diferenciação operacional**.

---

## C) TABLE STAKES vs DIFERENCIAIS

### TABLE STAKES (sem isto, o módulo não compete — é o "mínimo viável competitivo")
1. **Caixa postal monitorada diariamente, com triagem de relevância.** A Receita marca mensagens relevantes com "!"; o mercado classifica em 3 baldes (relevante-não-lida / ruído tipo aviso DCTF / tudo lido). Sem isso, nosso mark-as-read sintético é brinquedo. (Neo, Audire, Questor)
2. **CND/certidões em lote, 4 esferas, com vencimento + renovação automática.** Federal/PGFN (conjunta), Estadual (ICMS/SEFAZ), Trabalhista (CNDT), FGTS (CRF). O valor real não é "gerar uma" — é **reemitir antes de vencer, em lote, sem clique**. (Acessórias, Questor +2.000 órgãos, Alterdata, Jettax)
3. **Situação fiscal em massa (SITFIS).** Relatório de pendências da carteira inteira. (Neo "relatório situação fiscal", todos)
4. **Alerta de procuração/Autorização de Acesso vencida ou pendente de aceite.** Virou crítico em dez/2025 (ver §E). (Neo declara, SIEG IriS módulo Procurações)
5. **Via API oficial SERPRO** (não scraping). Captcha jan/2026 tornou scraping inviável.

### DIFERENCIAIS (onde dá pra ganhar — alinhado ao moat do projeto)
1. **Gestão nativa da nova "Autorização de Acesso" (dez/2025)** com fluxo guiado de aceite ≤30 dias (aba "Recebidas") — onboarding assistido que ninguém empacotou publicamente ainda. **Janela curta.**
2. **Cruzamento situação-fiscal × auditoria-da-Reforma** — health score "clientes em risco" que combina o status e-CAC real **com** a divergência cClassTrib/IBS-CBS do nosso core. **Só nós teríamos os dois lados** (o e-CAC isolado é commodity; cruzado com a Auditoria é defensabilidade — D9 + síntese do doc 12).
3. **Caixa postal + WhatsApp oficial nativo + log de leitura (data/hora/IP)** num produto só. Acessórias (Komunic) e GClick têm a comunicação; quase ninguém junta nativo com o e-CAC. (doc 12, whitespace P0)
4. **Preço transparente** — categoria opaca (7/11 não publicam, doc 15). Já é decisão D7 do projeto.
5. **Trilha de boa-fé** integrada: cada consulta/intimação vira evidência datada na trilha (reaproveita o moat do core).

> ⚠️ **NÃO posicionar e-CAC como wedge/diferencial primário** (beco-sem-saída do CONTEXT §7). É **add-on premium** (D9, ~R$2k/mês de mercado) e infraestrutura de retenção — não a categoria.

---

## D) O que a Integra Contador REALMENTE permite automatizar (serviços + custos)

**Fonte primária:** catálogo oficial https://apicenter.estaleiro.serpro.gov.br/documentacao/api-integra-contador/pt/catalogo_de_servicos/ (lido diretamente).

**Autenticação:** e-CNPJ (certificado digital ICP-Brasil) do escritório/contratante → emite token JWT. Acesso ao dado do cliente exige **procuração/Autorização de Acesso** outorgada (e o cliente é validado via `AUTENTICAPROCURADOR`, termo XML assinado). **Dispensa o A1 do cliente** (confirma D2/D9 do CONTEXT).

### Serviços expostos (catálogo oficial)

| Módulo | Serviço | O que automatiza |
|--------|---------|------------------|
| **Integra-CaixaPostal** | `CAIXAPOSTAL` | Consultar mensagens por contribuinte, obter detalhe de mensagem, **monitorar indicador de novas mensagens** |
| | `DTE` | Consultar situação do contribuinte quanto à adesão ao Domicílio Tributário Eletrônico |
| **Integra-SITFIS** | `SITFIS` | Solicitar protocolo (assíncrono) e **emitir relatório de situação fiscal** do contribuinte (PF/PJ) |
| **Integra-SN** | `PGDASD` | Entregar declaração mensal, **gerar DAS**, consultar declarações, obter recibo, status do DAS, DAS avulso |
| | `DEFIS` | Transmitir declaração socioeconômica/fiscal, consultar, recibo+PDF |
| | `REGIMEAPURACAO` | Optar regime (caixa/competência), consultar |
| **Integra-MEI** | `PGMEI` / `CCMEI` / `DASN-SIMEI` | DAS MEI (PDF/código de barras), dívida ativa, certidão de condição MEI, declaração anual |
| **Integra-DCTFWeb** | `DCTFWEB` | **Gerar guia, transmitir declaração, consultar recibo e declaração completa, obter XML** |
| | `MIT` | Encerrar apuração, consultar status/apuração por período |
| **Integra-Sicalc** | `SICALC` | **Gerar/consolidar DARF** (PDF ou código de barras), consulta de receitas, consolidar cálculo de débito |
| **Integra-Pagamento** | `PAGTOWEB` | Consultar pagamentos, **emitir comprovante de arrecadação**, contar documentos processados |
| **Integra-Parcelamentos** | `PARCSN`, `PARCSN-ESP`, `PERTSN`, `RELPSN`, `PARCMEI`, `PARCMEI-ESP`, `PERTMEI`, `RELPMEI` | **Consultar parcelamentos, emitir DAS de parcela, detalhes de pagamento** (ordinário + especial, Simples e MEI) |
| **Integra-Procurações** | `PROCURACOES` | **Obter procuração** do contribuinte |
| **Integra-Contador-Gerenciador** | `AUTENTICAPROCURADOR` | Enviar termo de autorização **assinado digitalmente** (a base do onboarding de procuração) |
| | `EVENTOSATUALIZACAO` | **Solicitar/obter eventos de atualização em LOTE** (PF e PJ), assíncrono — o motor de varredura de carteira |
| **Integra-Redesim** | `PNRCONTADOR` | Consultar vínculos, renúncias, emitir certidão de renúncia |
| **Integra-e-Processo** | `EPROCESSO` | Consultar processos por interessado (recuperação de docs/intimações: **planejado**) |

### Custos (por chamada — fonte: SERPRO via reseller Domínio)
- Modelo: **custo variável por chamada à API**. Uma "emissão completa" costuma exigir **3 chamadas** (entregar → emitir guia → consultar/recibo).
- **Faixa 1** (até ~100 emissões/mês), valores confirmados:
  - Emissão completa de **DAS**: **~R$0,96** (entregar declaração R$0,40 + emitir guia R$0,32 + consultar R$0,24)
  - Envio de **DCTFWeb**: **~R$0,75**
  - Consulta/relatório isolado: **~R$0,24**
- **Faixas superiores (volume):** existem (a tabela oficial tem faixas 2, 3…) mas os valores estão em **imagem não-legível** na fonte — **não confirmado**. Resellers de alto volume (ex.: Alterdata) repassam **preço menor** por estarem na faixa de maior consumo. → **validar com SERPRO no volume real** (pendência §8.4 do CONTEXT).

### O que a API NÃO expõe (os GAPS a cobrir por fora)
- ❌ **CND conjunta RFB/PGFN como serviço dedicado.** Há `SITFIS` (situação fiscal) e dívida ativa via PGMEI, mas **não** uma chamada "emitir CND federal". → **Infosimples** (`receita-federal-pgfn`) por consulta.
- ❌ **CND Estadual (ICMS/SEFAZ)** — fora do escopo federal. → **Infosimples** (`sefaz-certidao-debitos`, todas as SEFAZ) ou robôs estaduais.
- ❌ **CND Trabalhista (CNDT/TST)** e **CRF/FGTS (Caixa)** — fora da Receita. → APIs específicas (Infosimples / robôs próprios).
- ❌ **e-Processo completo** (download de docs/intimações) — **planejado**, ainda não pleno.
- ⚠️ **Caixa postal de SEFAZ estadual (DEC/DTE-SP)** — fora do federal; Infosimples cobre SP/DF.

> **Stack recomendado pro e-CAC real:** Integra Contador (federal: caixa postal, SITFIS, DAS/DARF/DCTFWeb, parcelamentos, procuração) **+ Infosimples** (gaps de CND federal-conjunta/estadual/trabalhista/FGTS). NÃO construir robô de scraping (captcha jan/2026).

---

## E) Mudança regulatória decisiva — "Autorizações de Acesso" (dez/2025)

**Fonte:** Receita Federal — https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2025/dezembro/esta-no-ar-a-nova-versao-do-sistema-de-procuracoes-eletronicas · serviço: https://www.gov.br/pt-br/servicos/cadastrar-ou-cancelar-procuracao-para-acesso-ao-e-cac

- A partir de **05/dez/2025**, o sistema de procurações eletrônicas virou **"Autorizações de Acesso"**.
- **Mudança estrutural que afeta o fluxo do escritório:** **quem RECEBE a autorização precisa CONFIRMAR o aceite** (e-CAC → "Minhas Autorizações de Acesso" → aba **"Recebidas"**) em **até 30 dias**, senão **não produz efeitos**.
- Alinhado à LGPD (registro de atividades dos usuários).
- **Implicação P0 pro produto:** isto cria um **gargalo de ativação por cliente** (e um risco silencioso: autorização outorgada mas nunca aceita = acesso quebrado). Quem desenhar um **onboarding assistido + alerta de "aceite pendente (faltam N dias)"** ganha uma vantagem operacional **agora**, enquanto o mercado ainda está atualizando fluxos legados. É a feature de diferenciação mais acionável e datada do conjunto.

**Captcha jan/2026** (fonte: Receita Federal — https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/janeiro/desafio-captcha-permitira-acesso-ao-e-cac... · Convergência Digital): captcha dispara **só** ao detectar acesso robotizado no **portal**; login humano normal é inalterado. **Confirma que a API é o único caminho de automação** e que quem ainda raspa o portal está com os dias contados.

---

## F) O que NOSSO e-CAC tem hoje vs o GAP

**Arquivos:** `apps/contador/app/ecac/` — `page.tsx` (server thin), `EcacCockpit.tsx` (client interativo), `ecac-model.ts` (read model + dados sintéticos), `ecac.module.css`.

### Temos hoje (100% sintético, auto-contido, G6-safe)
- Carteira de 3 clientes demo numa tela: caixa postal (nº de novas, **marcar como lida**), 4 CNDs (Federal/PGFN, Estadual, Trabalhista, FGTS) com **preview "baixar"** (certidão sintética com tipo Negativa/CPEN/Positiva), declarações/obrigações com situação, flag de **ausência de declaração**.
- KPIs do topo (caixa não-lida / CND irregular / ausência de declaração), filtro **"só pendências"**, drill-down por cliente, ação **"Gerar CND em lote"** (resultado sintético), disclaimers G6.
- **Pontos fortes reais:** a UX já é boa e honesta — carteira numa tela, redundância cor+glyph+label (acessível), linguagem G6 calibrada. **O front é competitivo.**

### O GAP (o que falta pra competir de verdade)
| Gap | Prioridade | Como fechar |
|-----|-----------|-------------|
| **Backend SERPRO real** (caixa postal, SITFIS, DAS/DARF) | **P0** | Integra Contador: `CAIXAPOSTAL`, `SITFIS`, `SICALC`, `PGDASD`, `DCTFWEB` + e-CNPJ/JWT |
| **Varredura em lote da carteira** (não 3 demos) | **P0** | `EVENTOSATUALIZACAO` (assíncrono em lote) + scheduler central |
| **Monitor diário + triagem de relevância** (msg "!" da Receita) | **P0** | Polling diário + classificação 3-níveis (paridade Neo/Audire/Questor) |
| **Alerta de PRAZO em intimação** | **P0** | Parsear msg → derivar prazo (reaproveita motor de prazo do Noyce, se aplicável) |
| **Onboarding de procuração + nova Autorização de Acesso (aceite ≤30d)** | **P0** | `AUTENTICAPROCURADOR` + `PROCURACOES` + fluxo guiado "Recebidas" + alerta de aceite pendente |
| **CND real 4 esferas + renovação automática por vencimento** | **P1** | Infosimples (federal-conjunta/estadual/trab/FGTS) + agendador de reemissão |
| **Parcelamentos / DARF reais** | **P1** | `PARCSN`/`PARCMEI` + `SICALC` |
| **Alerta de procuração vencida** | **P1** | `PROCURACOES` + monitor de vigência |
| **Cruzamento situação-fiscal × auditoria Reforma (health score)** | **P2 (diferencial)** | Junta status e-CAC + divergência cClassTrib do core |
| **WhatsApp oficial + log de leitura (data/hora/IP)** | **P2 (diferencial)** | Camada de comunicação (paridade Acessórias, mas nativo) |

> **Veredito do gap:** não é trabalho de UX — é **trabalho de integração + onboarding + agendamento**. A tela está pronta; falta o motor SERPRO + Infosimples por trás, o varredor em lote, o monitor diário e o fluxo de Autorização de Acesso. Isso é o que o CONTEXT chama de **Fase 7** (exige contrato SERPRO + procurações homologadas) e valida a pendência **§8.4** (unit economics da API no volume real: ~R$0,24–0,96/chamada × N CNPJs × frequência).

---

## Fontes (URLs)

**Oficiais SERPRO / Receita Federal (primárias):**
- Catálogo de Serviços Integra Contador — https://apicenter.estaleiro.serpro.gov.br/documentacao/api-integra-contador/pt/catalogo_de_servicos/
- Doc Integra Contador (visão geral / caixa postal) — https://apicenter.estaleiro.serpro.gov.br/documentacao/api-integra-contador/pt/solucoes/ · .../pt/sistemas/caixapostal/
- Loja SERPRO Integra Contador — https://loja.serpro.gov.br/integra-contador/product/integracontador
- SERPRO notícia (gestão fiscal / novas funcionalidades DCTFWeb+MIT 2025) — https://www.serpro.gov.br/menu/noticias/noticias-2025/integra-contador-novas-funcionalidades
- Receita Federal — Integra Contador unifica acesso — https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2022/agosto/integra-contador-unifica-acesso-a-informacoes-para-prestacao-de-servicos-contabeis
- Receita Federal — Nova versão Procurações Eletrônicas (Autorizações de Acesso, dez/2025) — https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2025/dezembro/esta-no-ar-a-nova-versao-do-sistema-de-procuracoes-eletronicas
- gov.br — Cadastrar Autorização de Acesso — https://www.gov.br/pt-br/servicos/cadastrar-ou-cancelar-procuracao-para-acesso-ao-e-cac
- Receita Federal — Captcha no e-CAC (jan/2026) — https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/janeiro/desafio-captcha-permitira-acesso-ao-e-cac-e-portal-de-servicos-da-receita-federal-pelos-usuarios-que-tem-sido-bloqueados-indevidamente
- Convergência Digital — captcha contra acesso robotizado — https://convergenciadigital.com.br/governo/receita-federal-adota-captcha-no-ecac-para-restringir-acesso-robotizado/

**Preço da API (reseller / secundárias):**
- Domínio Atendimento — Custos da API Integra Contador — https://suporte.dominioatendimento.com/central/faces/solucao.html?codigo=10776

**Concorrentes (sites/docs de produto):**
- SIEG IriS — https://portalsieg.kinsta.cloud/iris/ · KB Caixa Postal https://sieg.movidesk.com/kb/pt-br/article/356185/caixa-postal · KB Procurações https://sieg.movidesk.com/kb/pt-br/article/514972
- Neo Controle / e-CAC Premium — https://www.neosolutions.com.br/ecac-premium · https://www.neosolutions.com.br/relatorio-situacao-fiscal-e-cac-atualizacao-neo-controle-181
- Infosimples — ECAC Caixa Postal https://infosimples.com/consultas/ecac-caixa-postal/ · CND Fed/PGFN https://infosimples.com/consultas/receita-federal-pgfn/ · CND Estadual https://infosimples.com/consultas/sefaz-certidao-debitos/ · preços https://infosimples.com/consultas/precos/
- Audire — https://audirecont.com.br/comunicacao-receita-federal-ecac
- Questor — Caixa Postal https://www.questor.com.br/caixa-postal/ · CND https://www.questor.com.br/saiba-como-consultar-e-centralizar-cnd/ · docs https://docs.questor.com.br
- Jettax — Módulo Prevenção https://www.jettax.com.br/modulos/prevencao/ · monitorar e-CAC https://www.jettax.com.br/blog/como-monitorar-pendencias-do-e-cac-automaticamente-e-evitar-surpresas-fiscais/
- e-Auditoria — Integração e-CAC via API oficial SERPRO https://www.e-auditoria.com.br/solucoes/para-integrar/integracao-com-o-e-cac/
- Acessórias — https://www.acessorias.com · Alterdata CND https://www.alterdata.com.br/contabil/cnd · HubCount https://www.hubcount.com.br/alertas-contabilidade · MasterTax DEC-CND https://www.mastertax.com.br/sistema-controle-decertidoes-negativas/
