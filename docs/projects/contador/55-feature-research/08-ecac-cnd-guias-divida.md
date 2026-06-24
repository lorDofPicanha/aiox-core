# Feature Research — Saúde Fiscal da Carteira: CND · Dívida Ativa · FGTS/Trabalhista · ENVIO AUTOMATIZADO DE GUIAS

> Aprofundamento de fontes **primárias** sobre as integrações que o **Renan pediu como prioritárias na reunião de 22/Jun/2026**: geração de CND, situação fiscal, caixa postal, dívida ativa, dados da Caixa, FGTS/trabalhista, parcelamentos e **envio automatizado de guias** (integração com sistemas dos clientes).
>
> **Autor:** Atlas (Analyst) · **Data:** 2026-06-24 · **Base:** `00-context/CONTEXT.md` (D9), `55-feature-research/03-ecac.md` (NÃO repetir — APROFUNDAR) · **Método:** web real + docs/portais oficiais (SERPRO, Receita, PGFN/Regularize, Caixa, TST, MTE) + sites de produto. SEM channeling de clones (regra `feedback_no_hydra_style`).
>
> **Confiança:** ALTA em portais/APIs oficiais (PGFN Regularize, FGTS Digital, catálogo SERPRO, Infosimples docs) · MÉDIA-ALTA em features de concorrentes (Veri, OneFlow, Conta Azul/Domínio — sites de produto) · MÉDIA em preços de concorrentes (Infosimples confirmado em fonte oficial; demais por reseller/blog).

---

## TL;DR (a resposta direta pro Renan)

1. **O que ele pediu se divide em DUAS camadas com naturezas diferentes:**
   - **(A) Saúde fiscal / monitoramento** (CND, situação fiscal, caixa postal, dívida ativa, FGTS, trabalhista, parcelamentos) = é o **e-CAC em lote** do doc 03, com escopo ampliado para **4 esferas + 4 fontes não-Receita**. Categoria **table-stakes lotada** (Veri, Questor, Jettax, Acessórias, e-Auditoria, SIEG, Neo já fazem).
   - **(B) Envio automatizado de guias com integração ao sistema do cliente** = uma **camada de ENTREGA** distinta. O estado-da-arte NÃO é "mandar PDF no WhatsApp" — é **lançar a guia direto no Contas a Pagar do ERP do cliente** (Conta Azul/Omie/Domínio). Isso é o que o Renan está realmente pedindo e é o pedaço mais defensável da lista.
2. **A Integra Contador (SERPRO) NÃO resolve sozinha.** Ela cobre o federal-Receita (caixa postal, SITFIS, DAS/DARF/DCTFWeb, parcelamentos). **NÃO expõe CND-conjunta, CND estadual/municipal, CNDT trabalhista, CRF/FGTS, nem GPS por CEI.** Esses 5 gaps exigem **Infosimples** (R$0,20–0,26/consulta) + leitura do **Regularize/PGFN** (dívida ativa) e do **FGTS Digital** (guia GRF-e via Pix).
3. **Sinais regulatórios FRESCOS de 2026 que mudam o desenho:**
   - **01/06/2026:** dívida ativa do FGTS migrou da Caixa para a **PGFN/Regularize** — quem monitorar FGTS precisa olhar Regularize, não só Conectividade Social. (fonte PGFN/MTE)
   - **2026:** FGTS Digital passou a aceitar **só Pix** na GRF-e (boleto/GRF tradicional descontinuado) + rejeita certificado SHA-1/SHA-256 (exige SHA-384). (Manual FGTS Digital v1.60)
   - **05/05/2026:** Manual FGTS Digital v1.60 + recolhimento de FGTS de processos trabalhistas via FGTS Digital a partir de **01/05/2026**.
   - Combina com os de 2025/26 já no doc 03: **Autorização de Acesso (dez/2025, aceite ≤30d)** + **captcha no e-CAC (jan/2026)** que mata scraping.
4. **Concorrente que mais se encaixa NO PEDIDO DO RENAN: a Veri** (veri.com.br). Ela já faz o pacote quase inteiro: monitora e-CAC + CND fed/est/mun + DCTFWeb + DAS + dívida ativa + parcelamentos, via **API oficial SERPRO**, **recalcula e gera guia atualizada automaticamente** quando acha inadimplência, e **envia por WhatsApp**. É o benchmark a bater nesta frente.
5. **Nosso e-CAC hoje é cockpit 100% sintético** (doc 03). Para o pedido do Renan, o gap NÃO é UX — é: (a) backend SERPRO real, (b) Infosimples para os 5 gaps de certidão, (c) **monitor diário com renovação proativa de CND** e (d) **conector de entrega de guia no ERP do cliente** (a peça que quase ninguém empacotou bem). E o **único diferencial defensável** é o **health score cross-módulo** (situação e-CAC × divergência cClassTrib da Auditoria) — porque só nós temos os dois lados.

---

## A) Tabela mestre — Table-stakes × cobrimos hoje × gap × buy-vs-build

Legenda: ✅ pronto · 🟡 parcial/sintético · ❌ não temos.

| # | Capacidade (o que o Renan pediu) | É table-stake? | NÓS hoje | Gap | Buy vs Build (provedor) |
|---|----------------------------------|----------------|----------|-----|--------------------------|
| 1 | **Caixa postal monitorada + triagem de relevância** | Sim (todos têm) | 🟡 sintético (mark-as-read) | Monitor diário + classificar "!" da Receita | **BUY** dado: Integra Contador `CAIXAPOSTAL`. **BUILD** triagem/scheduler |
| 2 | **Situação fiscal em massa (SITFIS)** | Sim | 🟡 sintético | Relatório real da carteira | **BUY**: Integra Contador `SITFIS` (assíncrono) |
| 3 | **CND federal-conjunta (RFB/PGFN)** | Sim | 🟡 sintético | Emissão real + validade | **BUY**: **Infosimples** `receita-federal-pgfn` (a API NÃO expõe) |
| 4 | **CND estadual (ICMS/SEFAZ, 27 UFs)** | Sim | 🟡 sintético | Emissão real por UF | **BUY**: **Infosimples** `sefaz-certidao-debitos` (unifica 27 SEFAZ) |
| 5 | **CND municipal (ISS)** | Parcial (poucos cobrem bem) | ❌ | Emissão por município | **BUY**: **Infosimples** (APIs por prefeitura) — cobertura parcial |
| 6 | **CND trabalhista (CNDT/TST)** | Sim | 🟡 sintético | Emissão + validação | **BUY**: **Infosimples** `tst-cndt` (+ `validacao-cndt`) |
| 7 | **CRF / Regularidade FGTS (Caixa)** | Sim | 🟡 sintético | Situação + validade 30d | **BUY**: **Infosimples** `caixa-regularidade` |
| 8 | **Renovação AUTOMÁTICA de CND por vencimento** | Sim (o valor real) | ❌ | Reemissão programada em lote | **BUILD** (scheduler) sobre os providers acima |
| 9 | **Dívida ativa da União (PGFN)** | Sim | ❌ | Consulta + monitor + alerta | **BUY** dado via Regularize/Infosimples; **BUILD** monitor |
| 10 | **Parcelamentos (consulta + DAS da parcela)** | Sim | ❌ | Consultar + emitir DAS de parcela | **BUY**: Integra Contador `PARCSN`/`PARCMEI` (+ especiais) |
| 11 | **Gerar guia DAS (Simples)** | Sim | ❌ | Geração real | **BUY**: Integra Contador `PGDASD` |
| 12 | **Gerar guia DARF** | Sim | ❌ | Geração real | **BUY**: Integra Contador `SICALC` |
| 13 | **Gerar/transmitir DCTFWeb + guia** | Sim | ❌ | Geração real | **BUY**: Integra Contador `DCTFWEB` |
| 14 | **Gerar GPS / GPS por CEI** | Parcial (Inloco é raro) | ❌ | Geração | **GAP DURO** — Integra Contador NÃO cobre GPS/CEI; robô específico (Inloco faz) |
| 15 | **Guia FGTS (GRF-e via FGTS Digital, Pix)** | Emergente 2026 | ❌ | Gerar GRF-e | **BUILD/integrar** FGTS Digital (Pix-only desde 2026; vem do eSocial) |
| 16 | **ENVIO de guia ao cliente (WhatsApp/email/portal)** | Sim | ❌ | Entrega + log de leitura | **BUILD** comunicação (WhatsApp oficial) — paridade Beeia/Acessórias/Veri |
| 17 | **ENTREGA de guia DENTRO do ERP do cliente (Contas a Pagar)** | **Diferenciador** | ❌ | Conector Conta Azul/Omie | **BUILD conector** (o estado-da-arte real — OneFlow/Domínio fazem) |
| 18 | **Health score situação-fiscal × auditoria Reforma** | **SÓ NÓS** | ❌ | Cruzar e-CAC + cClassTrib | **BUILD** (moat — ninguém tem os dois lados) |

> **Leitura:** itens 1–13 = comprar dado (SERPRO + Infosimples) e construir orquestração. Item **14 (GPS/CEI)** é gap duro que nem a API oficial cobre. Itens **15–17 são a "camada de entrega" que o Renan enfatizou** — e o **17 é onde está o dinheiro defensável**. Item **18 é o único moat verdadeiro** (vem do core).

---

## B) Matriz — o que a Integra Contador EXPÕE vs o que precisa de Infosimples/outro

**Fonte primária:** catálogo oficial SERPRO (lido no doc 03) + confirmação 2026: a plataforma anuncia **87 serviços** disponíveis (SERPRO, 2025).

| Necessidade do Renan | Integra Contador (SERPRO)? | Evidência | Cobre o gap com… |
|----------------------|----------------------------|-----------|-------------------|
| Caixa postal / DTE | ✅ `CAIXAPOSTAL`, `DTE` | catálogo oficial | — |
| Situação fiscal | ✅ `SITFIS` (relatório, assíncrono) | catálogo oficial | — |
| DAS (Simples) | ✅ `PGDASD` | catálogo oficial | — |
| DARF | ✅ `SICALC` | catálogo oficial | — |
| DCTFWeb + guia | ✅ `DCTFWEB` + `MIT` | catálogo oficial | — |
| Parcelamentos (federal) | ✅ `PARCSN/MEI` + especiais | catálogo oficial | — |
| Comprovante de pagamento | ✅ `PAGTOWEB` | catálogo oficial | — |
| Procuração / Autorização de Acesso | ✅ `PROCURACOES` + `AUTENTICAPROCURADOR` | catálogo oficial | — |
| Varredura em lote da carteira | ✅ `EVENTOSATUALIZACAO` (lote assíncrono) | catálogo oficial | — |
| **CND federal-conjunta (RFB/PGFN)** | ❌ **NÃO há serviço dedicado** | catálogo não lista "emitir CND"; só SITFIS | **Infosimples** `receita-federal-pgfn` |
| **CND estadual (SEFAZ)** | ❌ fora do escopo federal | — | **Infosimples** `sefaz-certidao-debitos` (27 UFs) |
| **CND municipal (ISS)** | ❌ fora do escopo federal | — | **Infosimples** (por prefeitura, parcial) |
| **CND trabalhista (CNDT)** | ❌ é do TST, não Receita | — | **Infosimples** `tst-cndt` |
| **CRF / FGTS (Caixa)** | ❌ é da Caixa | — | **Infosimples** `caixa-regularidade` |
| **GPS / GPS por CEI** | ❌ não coberto | Inloco lista como diferencial raro | robô específico (Inloco) |
| **Dívida ativa União (negociação)** | 🟡 parcial (atualização de débito Simples) | SERPRO cita "consulta de dívida ativa" no Simples | **PGFN/Regularize** (consulta/negociação completa fora da API) |
| **Guia FGTS (GRF-e)** | ❌ é do FGTS Digital | Manual FGTS Digital | **FGTS Digital** (Pix; vem do eSocial) |

> **Conclusão da matriz:** a Integra Contador resolve **o federal-Receita e a geração das guias-Receita**. Os **5 gaps de certidão** (federal-conjunta, estadual, municipal, trabalhista, FGTS) + **GPS/CEI** + **guia FGTS** ficam fora. **Stack confirmado: Integra Contador + Infosimples + leitura PGFN/Regularize + FGTS Digital.** NÃO construir scraping (captcha jan/2026, doc 03).

---

## C) Benchmark nominal — quem faz o quê (com URL)

| Player | Monitora diário? | Renova CND antes de vencer? | Triagem caixa postal? | **Gera guia auto?** | **Envia guia ao cliente?** | **Entrega no ERP do cliente?** | Via API oficial SERPRO? |
|--------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Veri** (veri.com.br) | ✅ +30 portais | ✅ | ✅ | ✅ **recalcula e gera guia atualizada** | ✅ WhatsApp | 🟡 não-confirmado | ✅ "homologado RF/Serpro" |
| **e-Auditoria** (e-Monitor) | ✅ | ✅ | ✅ | 🟡 | 🟡 | ❌ | ✅ |
| **Questor** (Quiu/CND/Caixa Postal) | ✅ | ✅ monitor CND | ✅ (>175k msg/mês) | ✅ Quiu (DCTFWeb/PGDAS) | 🟡 | 🟡 (ERP Questor) | ✅ |
| **Jettax** (Prevenção) | ✅ diário | ✅ | ✅ | 🟡 | 🟡 | ❌ | ✅ |
| **Acessórias** (Komunic / e-Contínuo) | ✅ | ✅ lote | ✅ +WhatsApp/log | 🟡 (robô coleta guia do sistema) | ✅ WhatsApp/email | 🟡 portal | mix |
| **SIEG IriS** | ✅ | ✅ | ✅ | 🟡 | 🟡 | 🟡 | ✅ (+A1) |
| **Neo** (e-CAC Premium) | ✅ | ✅ | ✅ 3 níveis | 🟡 | 🟡 | ❌ | ✅ |
| **Infosimples** (infra, não produto) | — (API on-demand) | n/a (provê o dado) | ✅ consulta | n/a | n/a | n/a | ❌ (web service próprio) |
| **OneFlow** (módulo Fiscal) | 🟡 | 🟡 | 🟡 | ✅ gera guia pós-apuração | ✅ email/portal | 🟡 portal do cliente | mix |
| **Conta Azul ↔ Domínio** (integração) | n/a | n/a | n/a | ✅ (Domínio gera) | ✅ | ✅ **DAS+federais no Contas a Pagar da Conta Azul** | n/a (integração ERP↔ERP) |
| **Beeia** (R$258–589/mês) | n/a | n/a | n/a | n/a (só entrega) | ✅ WhatsApp oficial | ❌ | n/a |
| **NÓS hoje** | 🟡 sintético | ❌ | 🟡 sintético | ❌ | ❌ | ❌ | ❌ |

**Quem monitora diariamente:** Veri, e-Auditoria, Jettax, Questor, SIEG, Neo (todos).
**Quem renova CND antes de vencer:** Veri, Questor (monitor CND), Acessórias (lote), e-Auditoria, SIEG, Jettax.
**Quem faz triagem de relevância da caixa postal:** Neo (3 níveis), Questor, Audire (por prioridade), Acessórias (+log de leitura), Veri.
**Quem RECALCULA+GERA guia atualizada na inadimplência:** **Veri** (declara explicitamente) — é o destaque.
**Quem ENTREGA a guia dentro do ERP do cliente:** o padrão de mercado é **Conta Azul ↔ Domínio** (DAS e federais caem no Contas a Pagar) e **OneFlow** (guias pós-apuração via portal/email). É aqui que "integração com o sistema do cliente" realmente acontece.

---

## D) A camada que o Renan está pedindo de verdade: ENVIO/ENTREGA DE GUIAS

O Renan disse "envio automatizado de guias, integração com sistemas dos clientes". Existem **3 níveis de maturidade** — e o mercado já está no nível 3:

1. **Nível 1 — Anexo manual/semi-auto** (e-mail com PDF). Commodity. Beeia/ZapContábil fazem isso por WhatsApp (R$258–589/mês).
2. **Nível 2 — Portal do cliente** (Onvio, OneFlow): guia publicada num portal + notificação por e-mail/SMS. O cliente entra e baixa. É o "Onvio Portal do Cliente".
3. **Nível 3 — Entrega DENTRO do ERP do cliente** (o estado-da-arte): a guia (DAS, federais, honorários) é **lançada automaticamente no Contas a Pagar** do ERP que o cliente usa. Evidências:
   - **Conta Azul ↔ Domínio:** "Tanto o DAS, como os demais impostos de natureza federal são enviados para o contas a pagar da Conta Azul." (Conta Azul/Domínio)
   - **OneFlow Fiscal:** "gera e envia automaticamente as guias de recolhimento, recibos e memórias de cálculo ao cliente via e-mail ou portal."
   - **Omie:** "lança automaticamente todos os pagamentos no contas a pagar do financeiro da empresa."

**Implicação pro produto:** se quisermos honrar o pedido do Renan com diferencial, a meta é **Nível 3** — um **conector de saída** que empurra a guia gerada (via Integra Contador) para o Contas a Pagar de Conta Azul/Omie (e WhatsApp oficial como fallback Nível 1). **Atenção de canal (CONTEXT §8.1):** entregar no ERP do cliente final do contador é exatamente o tipo de feature que **pode borrar a fronteira escritório↔cliente** — manter o contador como dono do gatilho ("revisar e enviar"), nunca disparo silencioso direto ao cliente sem o aval do escritório.

---

## E) Sinais regulatórios FRESCOS (2026) — relógios desta frente

| Data | Evento | Fonte | Impacto no produto |
|------|--------|-------|--------------------|
| **05/dez/2025** | Procurações → "Autorizações de Acesso"; aceite ≤30d (aba Recebidas) | Receita Federal | Gargalo de ativação por cliente (já no doc 03) — onboarding assistido = diferencial janela curta |
| **jan/2026** | Captcha no e-CAC contra acesso robotizado | Receita Federal | Mata scraping; **API é o único caminho** (já no doc 03) |
| **2026** | FGTS Digital: **GRF-e só por Pix**; boleto descontinuado | Manual FGTS Digital v1.60 (05/05/2026) | Geração de guia FGTS muda de formato — integrar Pix/QR |
| **2026** | FGTS Digital rejeita certificado SHA-1/SHA-256 (exige **SHA-384**) | Manual FGTS Digital | Validar certificado do escritório/provider |
| **01/05/2026** | FGTS de processos trabalhistas via FGTS Digital | MTE | Amplia escopo trabalhista do monitor |
| **01/06/2026** | **Dívida ativa do FGTS migra Caixa → PGFN/Regularize** | PGFN/MTE | Monitor de FGTS-em-atraso precisa olhar **Regularize**, não só Conectividade Social |
| 2024→ | FGTS Digital alimentado pelo **eSocial** (guia gerada pós-fechamento de folha) | MTE | A guia FGTS depende do eSocial — não é "puxável" isolada |

> **PGFN/Regularize** (regularize.pgfn.gov.br) virou hub: emite DARF/DAS/DAE de dívida ativa (União **e FGTS**), gerencia negociações no novo **SISPAR** (portfólio de propostas, 1 clique), e faz **exclusão automática** de pendência em ≤7 dias (Tesouro) / ≤75 dias (FGTS) após pagamento/negociação. Horário do portal: seg–sex, 7h–22h (Brasília) — relevante para o agendador.

---

## F) Nosso diferencial (o que NÃO é commodity nesta lista)

A frente "saúde fiscal" é **table-stakes** (CONTEXT §7: "e-CAC em lote NÃO é diferencial"). Onde ganhamos:

1. **Health score cross-módulo (situação fiscal e-CAC × divergência cClassTrib da Auditoria).** Só nós teríamos os **dois lados**: o status fiscal real da carteira (e-CAC/Infosimples) **e** o risco de apuração da Reforma (core). "Cliente em risco" deixa de ser "tem CND vencida" e vira "tem CND vencida **E** apuração IBS/CBS divergente" — é a defensabilidade do projeto aplicada à carteira. **Moat real.**
2. **Renovação PROATIVA de CND** (não reativa): reemitir antes de vencer, em lote, com a **trilha de boa-fé** registrando cada emissão datada. Veri/Questor renovam; ninguém amarra à trilha de evidências.
3. **Conector Nível 3 de entrega de guia** (Contas a Pagar do ERP do cliente) **com o contador como gatekeeper** — entrega no fluxo do cliente sem quebrar o canal.
4. **Triagem de relevância da caixa postal calibrada** (confidence "onde NÃO sei" — D8) em vez de classificação opaca.
5. **Preço transparente** (D7) numa categoria opaca.

> ⚠️ Posicionar como **add-on premium** (D9, ~R$2k/mês de mercado; Renan vendia R$8–15k/mês disso na CIEG), **não** como wedge. O wedge é a Auditoria/Emissor; a saúde fiscal é retenção + receita recorrente + a ponte para o health score.

---

## G) Stories de build + gates externos

> Tudo aqui é **Fase 7** do roadmap (depende de contratos externos). Antes disso, **Concierge MVP manual** (D4): rodar e-CAC/CND à mão para 5 escritórios do Renan e validar disposição a pagar.

### Épico — Backend de saúde fiscal (depende de SERPRO + Infosimples)
- **S1 — Conector Integra Contador (auth e-CNPJ→JWT).** Gate: **contrato SERPRO** + e-CNPJ do escritório + faixa de consumo. Serviços: `CAIXAPOSTAL`, `SITFIS`, `EVENTOSATUALIZACAO`.
- **S2 — Onboarding de Autorização de Acesso** (`AUTENTICAPROCURADOR` + `PROCURACOES`) com fluxo "Recebidas" e alerta de aceite pendente (≤30d). Gate: procurações homologadas por cliente.
- **S3 — Monitor diário + triagem de relevância** (msg "!" da Receita, 3 níveis) + alerta de prazo em intimação. Build sobre S1.
- **S4 — Conector Infosimples** (CND federal-conjunta, estadual, municipal, CNDT, CRF/FGTS). Gate: **conta Infosimples pré-paga** (franquia mín. R$100/mês; R$0,20–0,26/consulta).
- **S5 — Renovação proativa de CND em lote** (scheduler por vencimento) + registro na trilha de boa-fé.
- **S6 — Monitor de dívida ativa** (PGFN/Regularize + atualização Simples via API) com alerta de exclusão automática (≤7d/≤75d).

### Épico — Geração e entrega de guias
- **S7 — Geração de guias-Receita** (`PGDASD`/`SICALC`/`DCTFWEB` + `PARCSN/MEI` para parcelas). Gate: S1.
- **S8 — Guia FGTS (GRF-e)** via FGTS Digital (Pix/QR; depende do eSocial fechado; certificado SHA-384). Gate: integração FGTS Digital + eSocial.
- **S9 — GPS / GPS por CEI** (gap duro — fora da API oficial). Decisão: robô próprio vs parceria (ex.: Inloco) vs descopo inicial.
- **S10 — Entrega Nível 1** (WhatsApp oficial + e-mail, com log de leitura data/hora/IP). Gate: WhatsApp Business API.
- **S11 — Conector Nível 3** (push da guia para Contas a Pagar de Conta Azul/Omie), **com contador como gatekeeper**. Gate: chaves de API dos ERPs + decisão de **política de canal** (CONTEXT §8.1).

### Épico — Diferencial
- **S12 — Health score cross-módulo** (e-CAC/Infosimples × cClassTrib do core). Depende do core (Auditoria) estar ligado.

### Gates externos (resumo)
| Gate | Bloqueia | Quem provê |
|------|----------|------------|
| Contrato SERPRO Integra Contador (e-CNPJ + faixa) | S1, S2, S3, S6, S7 | escritório/founder |
| Conta Infosimples pré-paga | S4, S5 | founder |
| Procurações/Autorização de Acesso homologadas | S2 (por cliente) | escritório (Renan) |
| WhatsApp Business API oficial | S10 | founder/@devops |
| Chaves API Conta Azul/Omie + política de canal | S11 | founder + decisão estratégica (§8.1) |
| Integração FGTS Digital + eSocial | S8 | escritório |
| Decisão GPS/CEI (robô vs parceria) | S9 | founder |

### Unit economics (validar — pendência CONTEXT §8.4)
- **Integra Contador:** ~R$0,06–0,40/requisição (Inloco/reseller); "emissão completa" ~R$0,24–0,96 (3 chamadas, Faixa 1 — doc 03).
- **Infosimples:** R$0,20/consulta (1–500/mês) caindo a R$0,05 (>100k); **CND tem adicional R$0,04–0,06/consulta**; franquia mínima R$100/mês; saldo expira em 12 meses.
- **Estimativa de custo por CNPJ/mês (saúde fiscal completa):** caixa postal + SITFIS + 4 CNDs + dívida ativa + FGTS ≈ **R$1,50–3,50/CNPJ/mês** em consultas — relevante no volume da carteira do Renan (centenas de CNPJs). **Confirmar faixas SERPRO no volume real.**

---

## H) Recomendação

1. **Honrar o pedido do Renan = 2 frentes:** (A) saúde fiscal em lote (table-stake; comprar SERPRO+Infosimples) e (B) **entrega de guia Nível 3 no ERP do cliente** (o pedaço que ele mais valoriza e o mais diferenciável).
2. **Não tentar bater a Veri em cobertura** — ela já faz a saúde fiscal quase inteira. **Bater em 3 pontos:** (i) health score cross-módulo (só nós), (ii) renovação proativa amarrada à trilha de boa-fé, (iii) entrega Nível 3 com o contador como gatekeeper.
3. **Sequência:** Concierge MVP manual (D4) → backend SERPRO/Infosimples (S1–S7) → entrega (S10–S11) → diferencial (S12). FGTS/GPS (S8–S9) são complexos e podem entrar depois.
4. **Decisão estratégica pendente antes de S11:** política de canal — entregar guia direto no ERP do cliente final é potente mas mexe com a fronteira escritório↔cliente (§8.1).

---

## Fontes (URLs)

**Oficiais (primárias):**
- Catálogo de Serviços Integra Contador (SERPRO) — https://apicenter.estaleiro.serpro.gov.br/documentacao/api-integra-contador/pt/catalogo_de_servicos/
- Loja SERPRO Integra Contador — https://loja.serpro.gov.br/integracontador
- SERPRO — novas funcionalidades DCTFWeb/MIT 2025 — https://www.serpro.gov.br/menu/noticias/noticias-2025/integra-contador-novas-funcionalidades
- SERPRO — Integra Contador simplifica gestão fiscal (87 serviços) — https://www.serpro.gov.br/menu/noticias/noticias-2023/integra-contador-facilita-gestao-fiscal-setor-contabil
- PGFN Regularize — https://www.regularize.pgfn.gov.br/
- PGFN — regularizar pendências dívida ativa (SISPAR) — https://www.gov.br/pgfn/pt-br/servicos/arquivos-imagens/como-regularizar-as-pendencias-de-divida-ativa-perante-a-pgfn-senatram
- Agência Gov — novo app PGFN compara propostas de quitação (SISPAR) — https://agenciagov.ebc.com.br/noticias/202503/agora-ficou-mais-facil-para-o-contribuinte-negociar-suas-dividas-com-a-uniao
- FGTS Digital (MTE) — https://www.gov.br/trabalho-e-emprego/pt-br/servicos/empregador/fgtsdigital
- Manual FGTS Digital v1.60 (05/05/2026) — https://www.gov.br/trabalho-e-emprego/pt-br/servicos/empregador/fgtsdigital/manual-e-documentacao-tecnica/manual-de-orientacao-do-fgts-digital-versao-1-60-05-05-2026.pdf
- FGTS de processos trabalhistas via FGTS Digital (maio/2026) — https://www.gov.br/trabalho-e-emprego/pt-br/servicos/empregador/fgtsdigital/comunicados/recolhimentos-de-fgts-em-processos-trabalhistas-serao-efetuados-via-fgts-digital-a-partir-de-maio-2026
- Emissão de guia FGTS Digital — https://www.gov.br/pt-br/servicos/emissao-de-guia-para-recolhimento-do-fgts-atraves-do-fgts-digital
- Caixa — Conectividade Social ICP V2 — https://www.caixa.gov.br/empresa/conectividade-social/Paginas/default.aspx
- TST — CNDT (emissão) — https://cndt-certidao.tst.jus.br/ · https://www.tst.jus.br/en/certidao1
- Receita Federal — certidões (CND federal-conjunta) — https://servicos.receitafederal.gov.br/servico/certidoes/

**Infosimples (provedor — docs/preços):**
- Preços (R$0,20→0,05; franquia R$100; CND adicional R$0,04–0,06) — https://infosimples.com/consultas/precos/
- CND federal/PGFN — https://infosimples.com/consultas/receita-federal-pgfn/
- CND estadual (SEFAZ) — https://infosimples.com/consultas/sefaz-certidao-debitos/
- CNDT trabalhista (TST) — https://infosimples.com/consultas/tst-cndt/ · validação https://infosimples.com/consultas/tribunal-tst-validacao-cndt/
- CRF/FGTS (Caixa) — https://infosimples.com/consultas/caixa-regularidade/
- ECAC caixa postal — https://infosimples.com/consultas/ecac-caixa-postal/

**Concorrentes / mercado (sites de produto):**
- Veri (gestão fiscal; recalcula e gera guia; +30 portais) — https://veri.com.br/ · e-CAC: https://lp.veri.com.br/ecac/
- Inloco — comparativo ferramentas e-CAC (GPS por CEI; preços) — https://inloco.app.br/blog/ferramentas-consulta-automatica-ecac
- OneFlow — módulo Fiscal (gera+envia guias) — https://oneflow.com.br/fiscal
- Conta Azul ↔ Domínio (DAS/federais no Contas a Pagar) — https://contaazul.com/contadores/dominio/ · https://www.dominiosistemas.com.br/blog/parceria-conta-azul-e-solucoes-dominio/
- Omie — painel do contador (lança no contas a pagar) — https://www.omie.com.br/funcionalidades/painel-do-contador/
- Beeia — automação WhatsApp (R$258–589/mês) — https://www.beeia.com.br/automacao-de-whatsapp-para-contabilidade/
- Acessórias — e-Contínuo / Komunic — https://acessorias.com/sysajuda.php?p=216&ctg=1
- Questor — Caixa Postal / CND — https://www.questor.com.br/caixa-postal/
- Jettax — Módulo Prevenção — https://www.jettax.com.br/modulos/prevencao/
- e-Auditoria — integração e-CAC — https://www.e-auditoria.com.br/solucoes/para-integrar/integracao-com-o-e-cac/
</content>
</invoke>
