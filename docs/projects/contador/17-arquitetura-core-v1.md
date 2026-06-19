# Arquitetura Core v1.0 FINAL — Apuração Defensável (Contador)

> ⚠️ **Este documento SUPERSEDE o `11-arquitetura-core.md` (v0.1)**, que fica mantido apenas por histórico.
>
> **Autor:** Aria (@architect), como síntese do **conclave de arquitetura Fable (2 rodadas)** — ver `16-conclave-arquitetura/09-sintese-conclave.md`.
> **Data:** 2026-06-12 · **Status:** v1.0 FINAL — aprovada com as 28 condições dos revisores incorporadas/adaptadas (rastreabilidade no §15; zero condições rejeitadas).
> **Participantes do conclave:** Aria/@architect (draft `01`), Dara/@data-engineer (schema `02`), heleno-taveira-torres (tributário, `03`+`06`), roberto-dias-duarte (SPED/operação, `04`+`07`), anderson-hernandes (gestão/ICP/pricing, `05`+`08`).
> **Base:** `00-context/CONTEXT.md` (D1–D9, não relitigados), `10-prd-core-ciclo-nota-fiscal.md`, `13-conclave-validacao-features.md`, `14-concierge-mvp-spec.md`, `06-comparativo-gestor-concorrentes.md`.
> **Modelo de dados:** `16-conclave-arquitetura/02-data-engineer-schema.md` é a referência canônica de DDL; o §5 deste doc lista APENAS as correções obrigatórias sobre ele (M-1…M-15).

---

## 0. O que mudou vs o draft (`16-conclave-arquitetura/01-architect-draft-v1.md`)

A espinha do draft sobreviveu à rodada adversarial intacta — comprar a commodity, construir o moat, trilha first-class, fase-gating, pipeline único. O que o conclave corrigiu foi de três naturezas:

| Eixo | O que faltava no draft | Quem pegou | Onde está agora |
|------|------------------------|------------|-----------------|
| **Prova** | Âncora "mensal por e-mail" era fabricável e autorreferente; assinatura ICP adiada por um atrito que não existe; aprovação sem habilitação profissional no DDL; trilha que prova ciência sem cobrar conduta ("**aprovado inerte**") | Heleno (C1–C3) | §3.2, §3.4, §3.5, §5 M-1/M-2 |
| **Operação** | Sem saída pro ERP contábil (re-digitação = churn mês 3); sem EFD como insumo; COGS da captura fora do desenho (R$6,35/CNPJ quebra o corredor flat); pico do dia 1-12 ignorado | Roberto (R1–R3, R5–R6) | §7, §3.5, §9, §5 M-9/M-12/M-13 |
| **Negócio** | C0 invendável (sem tela, Renan venderia consultoria); sem metering (D7 era slide); sem implantação; sem Relatório de Valor; white-label como adjetivo | Anderson (R1–R5) | §8, §6.1, §5 M-10/M-11/M-14 |

Decisões do draft revisadas: **A2** (pg-boss → **pgmq**), **A5** (REVERTIDA — carimbo ACT + assinatura PAdES entram no MVP, na "versão barata"), **A6** (fechada com hierarquia de fontes), **A7** (sinal pró-PlugNotas → **Focus como hipótese primária**, por previsibilidade de COGS). Detalhe em §12.

---

## 1. Princípios arquiteturais (v1.0 FINAL)

1. **Comprar a commodity, construir o moat.** Runway de 8 meses vai para motor de auditoria + trilha de boa-fé. Captura (provider), e-CAC (Integra Contador) e emissão (NFS-e Nacional) são alugados/oficiais. *(D2)*
2. **A trilha de boa-fé é cidadã de primeira classe — e fecha o ciclo.** Não é log: é ledger imutável com proveniência normativa, âncora temporal externa (ACT ICP-Brasil) e assinatura qualificada. E ela só protege se registrar **conduta**, não só ciência: o ciclo indício→decisão→ação→protocolo é parte da trilha, não feature à parte. *(moat — §3; Heleno C1/C3)*
3. **Humano no loop é design — e o humano é QUALIFICADO.** O ato que sustenta o laudo é privativo de contabilista: papel `contador` com CRC ativo no schema; analista tria e prepara, não pratica o ato. O laudo sai assinado (PAdES, e-CPF que o contador já tem) em nome dele, nunca da plataforma. *(D8; Heleno C2/C9)*
4. **Pipeline único de ingestão, com DUAS classes de qualidade de insumo.** Upload manual, e-Contínuo e provider convergem no mesmo pipeline; origem é metadado. Mas XML (estruturado, auditável item a item) ≠ documento extraído (PDF/OCR, confiança por campo) — a classe de insumo que sustentou cada apontamento fica gravada na trilha. Prova de primeira não se mistura com prova de segunda sem rótulo. *(Roberto 1.1b)*
5. **Fase-gating: nada nasce antes do sinal verde (D4).** Dia-0 = zero infra nova de backend — mas **com Demo Kit** (UI mínima sobre o que já existe): o C0 valida "contador paga por SaaS de apuração defensável", não "contador paga pelo Breno analisar". *(Anderson R1)*
6. **Captura é SELETIVA por design — gestão de margem E de risco.** `captura_ativa` default OFF por CNPJ; liga por decisão explícita do escritório em alvo de auditoria (alto SKU). Cada nota capturada é uma unidade de ciência que cria ônus de tratar — capturar indiscriminadamente fabrica passivo jurídico e margem negativa ao mesmo tempo. Franquia ≥2-3× o custo variável; teto de docs/mês por tenant. *(Roberto R3 + Heleno 1.3 + Anderson R6)*
7. **Postgres-only no início.** Supabase (Postgres + RLS + Storage + pgvector) + **pgmq** como fila (A2 revisada — gotcha do pooler). Uma peça de infra, multi-tenant por RLS.
8. **Linguagem jurídica defensiva é TESTE DE SISTEMA, não convenção.** Banlist executável ("garantimos", "garantiu conformidade", "evita a multa", "crédito garantido", "apuração correta") rodando como teste automatizado sobre todo template — laudo, Relatório de Valor, e-mail, WhatsApp, telas. Nenhuma data-marco hard-coded: calendário normativo é dado versionado (`ref.marco_normativo`). *(Heleno C8/C10)*
9. **O produto que apura não basta: vende, implanta, prova valor e fatura.** Demo Kit, módulo de Implantação, Relatório de Valor mensal nas duas pontas e metering de nota auditada são componentes de arquitetura com o mesmo status do motor. *(Anderson R1–R5)*

---

## 2. Visão de componentes — C4 nível contêiner, com fase-gating

Etiquetas: `[C0]` Concierge (dia-0) · `[F1]` após Concierge pago · `[F2]` após F1 validada · `[F3]` recuperação/emissor · `[A]` add-on e-CAC (linha paralela).

```
                ESCRITÓRIO CONTÁBIL (tenant)                      CLIENTE FINAL (indireto)
                sócio/gestor · CONTADOR (CRC) · analista          NUNCA é usuário; recebe
                      │ HTTPS                                     Relatório de Valor white-label
┌─────────────────────▼────────────────────────────────────────────────────────────────────┐
│  WEB APP — Gestorize React estendido                                                      │
│  [C0: DEMO KIT — upload→divergências c/ R$→laudo brandado→painel semáforo]                │
│  [F1: fila de revisão c/ materialidade ("fila do dia") · assinatura em lote · laudos      │
│       · IMPLANTAÇÃO (import carteira em lote + checklist) · admin/billing (admin-only)]   │
└───────┬──────────────────────┬──────────────────────────────┬─────────────────────────────┘
        │                      │                              │
┌───────▼───────────┐ ┌────────▼───────────────┐ ┌────────────▼───────────────────────┐
│ INGESTÃO [C0/F1]  │ │ ⭐ MOTOR DE AUDITORIA  │ │ ⭐ TRILHA DE BOA-FÉ [C0 manual/F1] │
│ • upload/Documen- │ │    [F1]                │ │ ledger append-only hash-encadeado  │
│   tize (XML, PDF  │ │ regras + RAG cClass-   │ │ • proveniência por apontamento     │
│   extraído — 2    │─▶ Trib (fato gerador!)  │─▶ • aprovações assinadas (CRC)       │
│   classes insumo) │ │ confidence calibrada   │ │ • ciclo decisão→ação→protocolo     │
│ • PARSER EFD [F1] │ │ golden-set/eval        │ │ • ÂNCORA ACT ICP-Brasil            │
│ • webhook provider│ │ drift monitor de NT    │ │   (laudo + fecho diário em F1)     │
│   [F2]            │ └────────┬───────────────┘ └────────────┬───────────────────────┘
└───────┬───────────┘          │                              │
        │             ┌────────▼────────────────┐ ┌───────────▼───────────────────────┐
┌───────▼───────────┐ │ BASE DE REFERÊNCIA [F1] │ │ SAÍDAS [C0 manual → F1]           │
│ FILA pgmq [F2]    │ │ cClassTrib×NCM×CST      │ │ • Gerador de Laudo (PAdES e-CPF   │
│ retry · idempot.  │ │ bitemporal + vigência   │ │   do contador + carimbo ACT)      │
│ backpressure      │ │ pelo FATO GERADOR       │ │ • RELATÓRIO DE VALOR mensal       │
└───────────────────┘ │ camadas: oficial (fund.)│ │   (dono + white-label) [F1]       │
                      │ licenciada (sugestão)   │ │ • EXPORT DE AJUSTES → ERP         │
┌───────────────────┐ │ + ref.marco_normativo   │ │   Domínio/Alterdata (CSV) [F1]    │
│ STORAGE XML       │ │ + ref.politica_retencao │ │   gate: só a jusante de aprovação │
│ matriz de retenção│ └─────────────────────────┘ │   qualificada; evento na trilha   │
│ tenant→CNPJ→comp. │                             └───────────────────────────────────┘
└───────────────────┘  POSTGRES multi-tenant      ┌───────────────────────────────────┐
                       (RLS em tudo) [C0/F1]      │ METERING & BILLING [F1 dia-0]     │
┌───────────────────┐                             │ consumo_mensal · assinatura       │
│ OBSERVABILIDADE   │                             │ franquia/excedente (D7)           │
│ [F1→F2] heartbeat │                             └───────────────────────────────────┘
│ custo e-CAC ·     │
│ aprovação cega ·  │
│ SLA pendências    │
└───────────────────┘
═══════════════════════════ fronteira da nossa nuvem ══════════════════════════════════════
   ▲ XML+meta (webhook)        ▲ consultas (cache+gate)        ▲ emissão [F3]   ▲ carimbo
┌──┴─────────────────┐ ┌───────┴──────────────────┐ ┌──────────┴──────────┐ ┌───┴────────┐
│ PROVIDER CAPTURA   │ │ SERPRO INTEGRA CONTADOR  │ │ ADN/SEFIN NFS-e     │ │ ACT ICP-   │
│ [F2] Focus (hipót. │ │ [A] gate PROCURACOES     │ │ NACIONAL [F3]       │ │ Brasil     │
│ primária)/PlugNotas│ │ antes de chamada cobrada │ │ (DANFSe próprio —   │ │ (carimbo   │
│ • custodia A1 (DPA)│ │ • toda consulta ref. a   │ │ API nacional morre  │ │ do tempo)  │
│ • seletivo, teto   │ │   procuração que autoriza│ │ 01/07/2026)         │ │ [C0/F1]    │
│   docs/mês/tenant  │ │ • R$0,24–0,40/consulta   │ └─────────────────────┘ └────────────┘
└────────────────────┘ └──────────────────────────┘
```

**O que existe em cada fase:**

| Fase | O que existe | Infra nova |
|------|--------------|-----------|
| **C0 Concierge** | **Demo Kit** (tela de upload via Documentize → divergências com R$ e confiança → laudo PDF brandado → painel semáforo); análise manual nos bastidores (Breno+AIOS) produz **dossiê de evidências = insumo interno do escritório**; o **contador do escritório revisa, decide e assina** o laudo (nome + CRC + PAdES); trilha preenchida manualmente JÁ no schema final; **carimbo ACT manual avulso sobre o hash de cada laudo** | **ZERO backend novo** — Demo Kit é UI sobre Documentize/Gestorize |
| **F1** | Motor (regras+RAG), base de referência bitemporal em camadas, golden-set/eval, trilha automatizada + fecho diário carimbado, fila de revisão com materialidade, gerador de laudo (PAdES em lote), **Export ERP**, **parser EFD**, **Relatório de Valor**, **Metering/assinatura**, **Implantação** | Supabase + pgvector (+ migrations 001/002) |
| **F2** | Captura comprada SELETIVA (provider+DPA, `captura_ativa` por CNPJ, teto/tenant), webhook, pgmq, observabilidade de captura | Conta no provider + webhook + pgmq |
| **F3** | Recuperação industrializada (dossiê PER/DCOMP referenciando linha de EFD) + emissor NFS-e Nacional (renderização própria de DANFSe) | API ADN/SEFIN |
| **A (paralelo)** | Conector e-CAC com gate de procuração first-class; tela 1 do add-on = auditoria de procurações da carteira ("143 válidas, 31 vencendo, 26 sem outorga") | Contrato SERPRO |

> **Ponto crítico do C0 (inalterado e reforçado):** a trilha NASCE no Concierge, manual, no schema final. O Demo Kit não viola o "zero infra": é a tela que faz o C0 validar a hipótese certa. E o desenho jurídico do C0 é fixo: **nós produzimos dossiê; o contador do escritório assina o laudo** — canal, não fachada (Heleno C9).

---

## 3. ⭐ Trilha de Boa-fé — mecânica FECHADA (o moat)

Cinco propriedades, cada uma com mecanismo concreto. As três primeiras vinham do draft; as duas últimas são o que a rodada adversarial acrescentou — e são as que transformam "registro interno com hash" em prova.

### 3.1 Proveniência imutável (ledger append-only hash-encadeado)

- `core.evento_boa_fe` append-only: imutabilidade tripla (REVOKE UPDATE/DELETE até para service_role + trigger bloqueante + hash-chain). Hash-chain **por tenant** com advisory lock (verificação independente por escritório; `seq_tenant` denuncia gaps). Mecânica completa no doc `02` §3.5.
- Cada apontamento grava: norma + NT + **fato gerador** + versão da base + camada da fonte + **critérios de desempate** do NCM→cClassTrib (finalidade/operação/regime) + **classe de insumo** (xml | documento_extraído) + input/output + confiança + versão do motor.
- Estado e prova na MESMA transação (RPCs `core.aprovar_apontamento` etc.); job noturno de reconciliação (estado sem evento = alerta).

### 3.2 Âncora temporal externa — carimbo do tempo ACT ICP-Brasil (MVP, não evolução)

A verificação interna da cadeia é autorreferente — o sistema atestando a si mesmo. A presunção legal vem da MP 2.200-2/2001 (art. 10, §1º): **carimbo do tempo de ACT credenciada**.

- **Sempre:** carimbo ACT sobre o `hash_laudo` de **cada laudo emitido**. No C0: carimbo manual avulso (serviço de ACT avulso, centavos).
- **F1:** job server-side de **fecho DIÁRIO** da cadeia de hashes, carimbado por ACT. Zero ação do usuário, custo ~R$9–30/mês.
- **NUNCA por evento** (milhares/mês: mataria margem e acoplaria o moat a fornecedor externo no caminho crítico — Anderson 1.1).
- Novo `tipo_evento='ancora_temporal'` no ledger; o recibo do carimbo (TST) fica no storage e é referenciado no evento.

> **Dissenso resolvido (registro):** Anderson propôs fecho mensal; Heleno exigiu por laudo + no mínimo diário em F1; Roberto endossou diário. **Decisão: diário em F1.** O argumento decisivo é o do Heleno: a disputa da denúncia espontânea (CTN art. 138) é de DIAS — "a retificação foi antes ou depois do termo de início da fiscalização?" — e fecho mensal abre janela de 30 dias em que a cadeia é fabricável. O custo do diário cabe no envelope do próprio Anderson (R$15–60/mês). No C0, sem job, vale o carimbo por laudo.

### 3.3 Bitemporalidade + vigência pelo FATO GERADOR + hierarquia de fontes

- **Dois eixos temporais** (mantidos do draft, concessão formal do Heleno): `vigencia` (quando a regra valia no mundo) e `conhecida_em`/`importada_em` (quando NÓS soubemos). Boa-fé = estado de conhecimento na data da decisão; NT retroativa de novembro não desfaz a diligência de agosto.
- **Correção do conclave (Heleno C4):** o lookup canônico resolve a vigência pela **data do fato gerador** (`vigencia @> nota.emitida_em`), não pela competência — abstração mensal não decide o ato que muda regra em 15/04. O apontamento grava `fato_gerador_em` + `criterios_desempate`.
- **Hierarquia de fontes (Heleno C5):** `ref.base_versao.camada in ('oficial','licenciada','curadoria')`. A tabela oficial do Portal Nacional da NF-e (IT RT 2025.002, fundamento legal por linha) é a referência primária — **fundamento normativo não se terceiriza**. Apontamento fundado em camada licenciada/curadoria DEVE também citar a linha oficial no `fundamento` (constraint de aplicação, testável). Job de reconciliação oficial×licenciada a cada importação; regra divergente fica bloqueada até curadoria.
- Reprodutibilidade: qualquer laudo re-executável contra `base_versao_id` exato.

### 3.4 Assinatura qualificada — papel `contador`, CRC, PAdES em lote

- `core.usuario` ganha `cpf`, `crc`, `crc_uf`, `crc_situacao`; papel `contador` entra no CHECK. A transição `pendente→aprovado/rejeitado` **que sustenta laudo** exige `papel='contador'` com CRC ativo (na RPC e na RLS policy). Analista **tria e prepara**; não pratica o ato (DL 9.295/46; responsabilidade técnica é pessoal — CC art. 1.177).
- O PDF do laudo sai **assinado PAdES com o e-CPF do contador** — certificado que ele JÁ tem e usa todo mês (DCTFWeb, procuração e-CAC). Atrito zero, custo zero pra nós, e "laudo assinado pelo SEU contador com carimbo ICP-Brasil" é frase de proposta comercial.
- **Formato operacional (Roberto):** assinatura **em lote** no fechamento da competência ("assinar 12 laudos" = um ato), nunca cerimônia por laudo.
- `laudo.emitido_por` só aceita usuário com CRC; o laudo sai em nome do contador (CRC), nunca da plataforma.

### 3.5 Ciclo fechado indício→decisão→ação→protocolo, COM limiar de materialidade

O achado mais valioso do conclave (Heleno 1.2): **trilha que prova ciência sem cobrar conduta é prova CONTRA o cliente**. Aprovação assinada + inação = dossiê de acusação perfeito ("aprovado inerte" — pior que o pendente eterno). O ciclo fecha assim:

- **Máquina de estados estendida:** `pendente → aprovado|rejeitado → regularizado` (novo estado terminal de verdade), com `acao_tipo` (retificação | recolhimento | denúncia_espontânea | justificativa_mantida) e `acao_protocolo` **obrigatório** em `retificado`/`regularizado`. Retificação sem protocolo é alegação; com protocolo, é fato.
- **SLA e escalonamento:** `decidir_ate` no apontamento; evento `apontamento_escalado` na trilha; view "passivo de pendências e aprovados inertes" no painel do gestor; aprovado sem ação após N dias = alerta escalonado, registrado.
- **Limiar de materialidade configurável (R$ envolvido × banda de confiança)** — a dosagem do Roberto que faz o rigor caber no dia 5:
  - **Acima do limiar:** ciclo completo, individual, com SLA e escalonamento.
  - **Abaixo:** **decisão em lote com regra documentada NA trilha** (evento `decisao_lote`: "itens < R$X com confiança > Y acatados conforme política Z do escritório, assinada pelo responsável técnico"). Decisão em lote documentada também é conduta — e é a única que cabe numa carteira de 200 CNPJs no pico.
- **Telemetria de teatro:** lote aprovado < N segundos/item dispara alerta de "aprovação cega" (Roberto R7).
- **Rejeição motivada, formato ergonômico (dissenso resolvido):** dropdown de 6-8 motivos **curados juridicamente** + texto opcional — motivo estruturado é tabulável (dado de divergência interpretativa) e não vira dissertação que ninguém escreve no dia 5 (Anderson 1.1a). A exigência do Heleno (documentar a divergência de boa-fé) fica; o formato muda.
- **Enquadramento comercial (Anderson 1.1b):** a UI chama isso de **"fila do dia"** — hábito diário de uso, anti-churn. Nunca "passivo jurídico visível".
- **Captura seletiva como contenção do ciclo:** só entra ciência que o escritório DECIDIU monitorar (§1 princípio 6). A cobertura parcial é **declarada por CNPJ** na interface e no Relatório de Valor — nunca "sua carteira está monitorada" quando são 40 de 200 (Heleno 1.3b).

### 3.6 Duas classes de qualidade de insumo

XML estruturado ≠ PDF extraído por OCR (recibo de WhatsApp, cupom fotografado). O pipeline é único, mas:
- `apontamento.qualidade_insumo in ('xml','documento_extraido')` — gravado na trilha;
- apontamento de classe `documento_extraido` carrega confiança por campo e materialidade limitada;
- o laudo declara qual classe sustentou cada apontamento. Prova de primeira e de segunda, cada uma com seu rótulo — senão a primeira perícia desmonta o conjunto (Roberto 1.1b).

---

## 4. Mapa de cobertura — Gestorize × Core × Concorrentes

Fonte: `Comparativo Gestor.xlsx` (23 ✓ Gestor + 21 só-concorrentes) + doc `06`. Condição de tudo: **Spike 5** (Gestorize deployável — CONTEXT §8.5). Se o código não for recuperável, vira reuso de spec e F1 cresce ~30-40%.

### 4.1 As 23 features ✓ do Gestor → onde a arquitetura as reusa

| # | Feature ✓ | Componente que reusa | Papel no core |
|---|-----------|----------------------|---------------|
| 1-4 | Cadastros (Clientes, Colaboradores, Usuários/Permissões, Config. Pessoais/Segurança) | Identidade & Tenancy | `cliente`/`usuario`/RBAC — pré-requisito da assinatura qualificada (§3.4: papel `contador`+CRC) |
| 5 | Modelos de Configuração Tributária | Motor (insumo) | Perfil tributário parametriza regras |
| 6-8 | Reconhecimento de Docs/Padrões · e-Contínuo · Docs Reenviados | Documentize → Ingestão | Entrada dia-0 + dedup (hash perceptual) |
| 9 | Logs e Auditoria | `audit_log` LGPD | ⚠️ ≠ trilha de boa-fé (§3) — esta é acesso a dados |
| 10-14 | Agenda de Tributações · Parâmetros competência/antecipação/entrega · Departamentos · Tarefas/Rotinas | Camada Gestão (schema `gestao`) | Reuso integral; `gestao.tarefa(origem='auditoria')` absorve o SLA de caixa postal (mensagem → tarefa) |
| 15-16 | Envio de Guias · Personalização de E-mails | Entrega/Comunicação | Canal do laudo e do Relatório de Valor (white-label, remetente do escritório) |
| 17 | Controle de Alvarás e Certidões | Gestão ↔ add-on e-CAC | Conector e-CAC alimenta CNDs automaticamente |
| 18 | Tags | Web App | Seleção de alvos de auditoria/captura seletiva (alto SKU) |
| 19-22 | Painéis gerencial/operacional · Consulta e Relatórios · Relatórios de Obrigações | Camada de apresentação | Shell dos painéis fiscais + infra do laudo |
| 23 | Área VIP e Aplicativo | Portal cliente final (F3+) | Base do app white-label futuro — cliente final NUNCA vira usuário (§8.5) |

### 4.2 As 21 lacunas (só concorrentes) → core (8), add-on (4), aparentes (4), fora (5)

**✅ CORE (8):** Robôs de leitura de documentos (Documentize+Ingestão, C0/F1) · Reconhecimento de recibos PDF/XML (F1, classe `documento_extraido` §3.6) · **Recálculo Automático = o Motor de Auditoria** (F1 ⭐) · Agente de varredura = **captura comprada seletiva** (F2) · Recebimento de documentos (C0→F2) · Painéis fiscal/contábil/societário (F1/A) · Protocolo automático de envio (estendido ao laudo, F1) · Conciliação inteligente na acepção FISCAL — XML×escrituração, agora com a **EFD como insumo** (`apuracao_declarada`, §7 — F1, não "F1+").

**🟨 ADD-ON (4):** Diagnóstico e-CAC (Integra Contador, gate de procuração §6.4) · Emissão NFS-e/boletos (F3, NFS-e Nacional + fallback; ❌ Nuvem Fiscal, morre 31/jul/2026; **DANFSe renderizado por nós** — API nacional morre 01/07/2026) · WhatsApp oficial (canal de entrega, formato §8.4) · App personalizado (F3+, evolução da Área VIP).

**🟨 APARENTES (4):** Controle de Obrigações Contábeis · Controle/Gestão de Tarefas · Monitoramento por depto/colaborador/cliente · Dashboards de Desempenho — batem ~1:1 com features ✓ #10-14/#19-20 (nomenclatura de concorrente). Ação: gap-analysis no Spike 5, não build. *(Não inflar escopo por sinônimo.)*

**❌ FORA (5):** Fluxo de Caixa · Rateio de Despesas/Receitas · Nibo BPO Financeiro · Conciliador Open Finance · Conciliação inteligente na acepção FINANCEIRA — território Nibo/financeiro, outro comprador; diluiria os 8 meses.

---

## 5. Modelo de dados — resumo executivo + correções obrigatórias

**A referência canônica de DDL é o doc `02-data-engineer-schema.md`** (4 schemas `core/gestao/ref/app`; partição de `nota` por competência desde o dia 0; RLS default-deny; trilha com imutabilidade tripla; storage por prefixo de tenant; enums via CHECK; jsonb tributário versionado contra a referência). O conclave o aprovou como "o melhor artefato técnico do projeto" — com as correções abaixo, **obrigatórias antes da migration 001 ir a produção**:

| # | Correção | Origem | Detalhe |
|---|----------|--------|---------|
| M-1 | `core.usuario`: + `cpf`, `crc`, `crc_uf`, `crc_situacao`; CHECK de `papel` inclui `'contador'`; policy Padrão 3 + RPC `aprovar_apontamento` exigem `papel='contador'` com CRC ativo para o ato que sustenta laudo | Heleno C2 | Analista tria; contador assina. `laudo.emitido_por` só com CRC |
| M-2 | `apontamento_auditoria`: + status `regularizado`; + `acao_tipo`, `acao_protocolo` (obrig. em retificado/regularizado); + `decidir_ate` (SLA); + `fato_gerador_em`; + `criterios_desempate jsonb`; + `status_controversia` (pacífico/controvertido/judicializado — eixo jurídico AO LADO da confiança estatística); + `qualidade_insumo`; `motivo_revisao` → `motivo_codigo` (dropdown curado) + `motivo_texto` opcional | Heleno C3/C4, Roberto R5/R7, Anderson 1.1a | Máquina de estados e trigger atualizados |
| M-3 | `evento_boa_fe`: novos `tipo_evento`: `ancora_temporal`, `apontamento_escalado`, `apontamento_regularizado`, `decisao_lote`, `ajuste_exportado` | Heleno C1/C3/C10, Roberto R1 | Recibo TST do carimbo referenciado no payload |
| M-4 | `ref.base_versao`: + `camada ('oficial','licenciada','curadoria')`; job de reconciliação oficial×licenciada; constraint de aplicação: apontamento de camada não-oficial cita a linha oficial no `fundamento` (teste automatizado) | Heleno C5 | Fundamento normativo não se terceiriza |
| M-5 | Lookup canônico de `ref.cclasstrib_regra`: `vigencia @> nota.emitida_em` (**fato gerador**), não competência | Heleno C4 | Competência continua sendo a partition key da nota; só o lookup muda |
| M-6 | **`ref.politica_retencao`** (tipo_documento × fundamento legal × prazo × base LGPD art. 7º) substitui o "15 anos": regra geral 5 anos (CTN 173/174/195 §ún.), extensões seletivas (créditos em aproveitamento até 240 meses LC 214; litígios art. 7º VI), política B2C própria (CPF de NFC-e). Job de expurgo consome a matriz | Heleno C6 (Dara já parametrizara) | Reter demais também é passivo LGPD. Validar matriz com @legal-chief |
| M-7 | **`ref.marco_normativo`** (ato, publicação, início de efeitos, fonte) — consumido por motor, copy e painéis; nenhuma data-marco hard-coded | Heleno C10 | A transição 2026-2033 produzirá dezenas de marcos |
| M-8 | `core.procuracao_eletronica` remodelada **por serviço** (código SERPRO: 00006, 00002…), sem o `unique(escritorio_id, cliente_id)`; `core.ecac_consulta.procuracao_id FK NOT NULL` para serviços que exigem outorga; revogação/expiração = evento que suspende consultas | Heleno C7 + Roberto R4 | Consulta pós-revogação = CTN 198 E 403 cobrado pelo SERPRO — direito e COGS na mesma coluna |
| M-9 | `core.cliente.captura_ativa boolean default false` + registro da decisão explícita de ativação; teto de docs/mês por tenant no adapter do provider (guardrail) | Roberto R3 + Anderson R6 | Nenhum CNPJ capturado sem decisão do escritório |
| M-10 | **`core.consumo_mensal`** (tenant × competência × notas auditadas × franquia × excedente) + **`core.assinatura`** (plano, franquia, excedente, status) + job de fechamento mensal — **na migration dia-0 da F1** | Anderson R2 | D7 sem fonte de medição = slide; billing não nasce arqueologia |
| M-11 | **`core.implantacao`** (checklist: carteira importada → procurações auditadas → 1ª captura → 1º laudo) + importação de carteira em lote (CSV + enriquecimento por CNPJ) | Anderson R3 + Roberto R8 | Fee de implantação vira produto com margem; 200 CNPJs em < 1 dia útil |
| M-12 | **`core.apuracao_declarada`** (cliente × competência × tributo) alimentada por parser EFD Contribuições/SPED Fiscal (blocos C/M) via Documentize | Roberto R2 | A evidência do monofásico (isca D6) mora NA EFD; motor compara XML × referência × **apurado** |
| M-13 | **`core.ajuste_export`** (lote de export: layout Domínio/Alterdata, arquivo, linhas → apontamentos aprovados, protocolo de importação) + evento `ajuste_exportado` | Roberto R1 + Heleno C10 | Cada linha referencia o apontamento aprovado que a originou; gate: só a jusante de M-1 |
| M-14 | **White-label estrutural:** theming por tenant; e-mail com remetente do escritório; preço/fatura visível só a `papel='admin'` (RLS); NENHUMA superfície de cliente final com nossa marca/preço; cliente final jamais vira usuário | Anderson R5 | Proteção de canal no schema, não no contrato |
| M-15 | `core.laudo`: + `assinatura_pades_ref`, `carimbo_tempo_ref` (TST); `ck_emissao` estendido | Heleno C1/C2 | Laudo emitido = assinado + carimbado |

---

## 6. Fluxos principais

### 6.1 `[C0]` Concierge dia-0 — Demo Kit + dossiê + assinatura do contador

```
Contador exporta XMLs ──▶ DEMO KIT: tela de upload (Documentize) ──▶ lista de divergências
                          com R$ + confiança + "onde NÃO sei" (análise MANUAL nos bastidores,
                          copy honesta: "análise assistida pelo nosso time nesta fase")
  ──▶ DOSSIÊ DE EVIDÊNCIAS (insumo interno do escritório) + trilha à mão no schema final
  ──▶ CONTADOR DO ESCRITÓRIO revisa, decide e ASSINA o laudo (nome + CRC + PAdES e-CPF)
  ──▶ carimbo ACT manual avulso sobre o hash_laudo
  ──▶ laudo white-label no TEMPLATE do Relatório de Valor + painel semáforo da carteira
  ──▶ conta de padaria na demo: "se sua carteira perder a dispensa do 1% (CBS 0,9%+IBS 0,1%),
      são R$ {Σ faturamento × 1%}/mês — calculado das SUAS notas, agora" (nunca "evita multa")
  ──▶ cobrança real → critério ≥3/5 escritórios pagam (doc 14)
```

### 6.2 `[F1]` Motor + trilha + saídas (só após sinal verde pago)

```
XML/PDF (upload) + EFD (txt) ─▶ Ingestão (valida, dedup, classe de insumo) ─▶ motor
  Motor: regras + RAG sobre base@versão, vigência pelo FATO GERADOR, desempate gravado
  ─▶ apontamentos (confiança + status_controversia + decidir_ate)
       ├─ acima do limiar de materialidade ─▶ "fila do dia": contador decide individualmente
       │    (aprova/rejeita c/ motivo dropdown) ─▶ ação ─▶ protocolo ─▶ regularizado
       └─ abaixo ─▶ decisão em LOTE conforme política assinada (evento decisao_lote)
  ─▶ cada passo ─▶ trilha_evento (hash-encadeado) · fecho DIÁRIO carimbado ACT
  ─▶ Laudo compila SÓ decididos ─▶ assinatura PAdES EM LOTE no fechamento ─▶ carimbo ACT
  ─▶ EXPORT DE AJUSTES (CSV Domínio/Alterdata; cada linha ← apontamento aprovado; evento)
  ─▶ RELATÓRIO DE VALOR mensal (dono + white-label) ─▶ METERING fecha consumo do mês
Paralelo: Monitor de NT ─▶ nova base_versao ─▶ reanálise de impacto ─▶ "NT X afeta cliente Y"
Gate de qualidade: golden-set rotulado por tributarista + harness precision/recall ANTES da carteira real
SLA de pico (R6): captura+auditoria D+1 da emissão; 95% dos apontamentos da competência
prontos ANTES do 1º dia útil do mês seguinte (janela de lançamento dias 1-12)
```

### 6.3 `[F2]` Captura comprada — seletiva

```
Onboarding: escritório DECIDE quais CNPJs capturar (alto SKU/alvo de auditoria;
            default OFF) ─▶ ativação no provider (A1 direto escritório→provider, DPA/operador)
            + autorização/manifestação em lote (wizard, tracking por CNPJ)
Provider ─▶ webhook XML+meta ─▶ staging ingestao_evento (202, idempotente) ─▶ pgmq
  ─▶ MESMA ingestão da F1 (origem='provider') ─▶ mesmo motor
Guardrails: teto docs/mês por tenant + alerta · cobertura parcial DECLARADA por CNPJ na UI
Observabilidade: heartbeat/CNPJ · validade cert (API provider) · fila de retry visível
```

### 6.4 `[A]` Add-on e-CAC — procuração first-class

```
Passo 1 do onboarding: consulta PROCURACOES (não exige outorga) ─▶ TELA "auditoria de
  procurações da carteira" (143 válidas / 31 vencendo / 26 sem outorga) — a demo que vende
Toda chamada cobrada: gate de escopo (mapa chamada↔código de procuração, matriz SERPRO)
  ─▶ consulta referencia procuracao_id que a autorizou ─▶ cache TTL por tipo ─▶ painel
Mensagem de caixa postal relevante ─▶ gestao.tarefa (origem='auditoria') c/ responsável,
  prazo e escalonamento — SLA absorvido pela rotina que o escritório já tem (Nibo-style)
Revogação/expiração ─▶ evento ─▶ suspende consultas do cliente
Critério: ZERO chamadas 403 cobradas em produção
```

---

## 7. Ponte ERP + EFD — as duas fronteiras onde o produto vive ou morre

O centro de gravidade do escritório é o Domínio/Alterdata/Fortes. Sem entrada e saída, somos segunda tela com re-digitação = churn no mês 3 (Roberto; Anderson elevou a inegociável acima do WhatsApp).

- **Saída — Export de Ajustes `[F1]`:** apontamento aprovado vira arquivo no layout de importação do Domínio/Alterdata (CSV, layouts documentados há décadas; ~1 semana de dev). **Gate jurídico (Heleno 1.3a):** o export só existe a jusante da aprovação qualificada (M-1); cada linha referencia o apontamento aprovado que a originou; a geração é evento da trilha (`ajuste_exportado`). Com o gate, o satélite comunica; sem ele, pilota.
- **Entrada — EFD como insumo `[F1]`:** parser EFD Contribuições/SPED Fiscal (blocos C/M, layout público) via Documentize → `core.apuracao_declarada`. A divergência defensável mora entre a nota e **o que o cliente efetivamente apurou**; e a evidência do monofásico (a isca D6) está DENTRO da EFD — o dossiê de recuperação referencia a linha da EFD que o comprova. Critério de aceite: o laudo do Concierge piloto já cruza 1 EFD real.
- **Bônus do D+1 (Roberto/Heleno em concessão mútua):** corrigir ANTES de escriturar é mais limpo que retificar depois — a latência D+1 serve à denúncia espontânea.

---

## 8. O produto que vende, implanta, prova valor e fatura (camada Anderson)

### 8.1 Demo Kit `[C0]` — critério de aceite do Concierge
Upload → divergências com R$ → laudo PDF brandado com a marca do lead → painel semáforo. UI sobre Documentize (zero backend novo). Sem isso, o dia 30 valida a hipótese errada ("pagam pelo Breno", não "pagam por SaaS").

### 8.2 Módulo de Implantação `[F1]`
`core.implantacao` (checklist por tenant) + importação de carteira em lote + tela de auditoria de procurações como passo 1 do add-on. O fee de implantação (CONTEXT §10) vira produto com margem; carteira de 200 CNPJs cadastrada em < 1 dia útil.

### 8.3 Relatório de Valor mensal `[F1]` — instituto, nas duas pontas
View sobre a trilha, template duplo: **dono** (o que a plataforma fez pela carteira) e **white-label** (o que o contador fez pelo cliente dele). Juridicamente: a **materialização periódica da conduta diligente** (CTN art. 112) — peça de defesa E de retenção. **Vocabulário controlado por teste automatizado** (banlist §1.8): *"sua contabilidade analisou X notas neste mês; Y pontos de atenção foram identificados e tratados pelo seu contador"* — nunca "garantiu sua conformidade". Cobertura parcial da captura declarada por CNPJ. Sai todo mês mesmo sem login (anti-churn). O laudo do Concierge JÁ usa este template.

### 8.4 Canais — WhatsApp/e-mail (formato resolvido)
Corpo da mensagem: **resumo agregado não-identificável** ("3 divergências encontradas na carteira em maio") + **link autenticado de sessão curta** para a área logada. Conteúdo fiscal vinculável a CNPJ específico NUNCA no corpo (sigilo fiscal, CTN 198) — mas o link não pode cair em tela de login fria (mata conversão). Banlist aplica em todos os canais.

### 8.5 White-label estrutural + opacidade de preço
Theming por tenant; remetente do escritório; preço/fatura só `papel='admin'` (RLS); nenhuma superfície de cliente final com nossa marca/preço; **cliente final jamais vira usuário** (é registro). Converte a pendência nº1 do CONTEXT (conflito de canal) em argumento de venda — e elimina por arquitetura a relação direta plataforma-consumidor (risco CDC).

### 8.6 Metering & Billing `[F1 dia-0]`
`core.consumo_mensal` + `core.assinatura` + job de fechamento. Habilita D7 (nota auditada como value metric), franquia/excedente e a conversa de upgrade ("8.400 de 10.000"). View canônica de medição definida ANTES do primeiro tier cobrado.

---

## 9. Unit economics e guardrails de COGS

A descoberta do conclave (Roberto, confirmada por Anderson): **captura indiscriminada é o assassino de margem — não o rigor jurídico.** 200 CNPJs full-capture ≈ R$1.270/mês ≈ R$6,35/CNPJ de insumo contra corredor flat R$200-400 = margem variável NEGATIVA. O rigor do Heleno custa R$15-60/mês ("o jurídico encareceu 2%; o provider encarecia 100%").

**Estrutura de pricing resultante (D7 operacionalizada):**

| Tier | Conteúdo | Preço | Custo variável | Margem |
|------|----------|-------|----------------|--------|
| **Entrada** | Upload manual, captura OFF, até ~500 notas | **R$249-299/mês** | ~R$25-75 | ~75-90% |
| **Típico** | Captura seletiva ~40 CNPJs alto-SKU, ~3.000 notas auditadas (franquia) | **~R$849-999/mês** | ~R$450-510 (provider R$360-390 + motor R$30-60 + ACT R$15-60) | ~45-50% |
| **Excedente** | R$0,25-0,30/nota vs custo R$0,14-0,15 | — | — | ~50% marginal |
| **Add-on e-CAC** | Diagnóstico carteira | ~R$1.500-2.000/mês (mercado) | SERPRO ~R$334 (200 CNPJs) + CNDs | ~70-80% |

**Regras (guardrails):**
1. Franquia precificada **≥2-3× o custo variável**; corredor R$200-400 do CONTEXT = piso de ENTRADA (sem captura), não teto do produto.
2. `captura_ativa` default OFF; teto de docs/mês por tenant no adapter; excedente repassado.
3. Planilha de pricing carrega coluna "custo de captura por perfil de CNPJ" preenchida ANTES do primeiro tier.
4. Carimbo ACT nunca por evento; custos de ACT/Infosimples são estimativas **a cotar** (decisão aberta N-2).
5. Régua de venda: R$4-5/CNPJ-mês vs honorário R$300-600/CNPJ vs R$5k/mês de dispensa do 1% perdida num cliente médio. Elasticidade do tier típico = hipótese forte a confirmar nas mesas do Renan.

---

## 10. Segurança & LGPD by design

- **A1 nunca passa por nós** (nem em trânsito): ativação direta escritório→provider; só recebemos referência/metadados de saúde. Não existe coluna capaz de receber um PFX (S7 do doc 02).
- **Cadeia de papéis documentada:** escritório = controlador → nós = operador (DPA) → provider = suboperador (DPA + Art. 39, aprovação do controlador prevista em contrato).
- RLS multi-tenant default-deny (6 padrões do doc 02 §6) + claim `app_metadata` não-editável + partições sem grant direto + storage por prefixo + **teste automatizado de isolamento por tabela no CI**.
- **Retenção pela matriz fundamentada** (`ref.politica_retencao`, M-6) — não mais "15 anos": 5 anos regra geral, extensões seletivas fundamentadas, expurgo auditável (evento `xml_expurgado`); reter demais também é violação LGPD. Copy comercial: "guarda fundamentada pelo prazo legal de cada documento".
- Trilha sem PII de pessoa natural (sobrevive ao expurgo sem quebrar a cadeia); CPF de NFC-e minimizado/mascarado, acesso logado.
- e-CAC: outorga formal com comprovante; **toda consulta vinculada à procuração que a autorizou** (M-8); sigilo fiscal nos canais (§8.4).
- `audit_log` de todo acesso a dado de cliente (≠ trilha); segredos em vault; DSRs registradas.

## 11. Observabilidade

| Camada | O que medir | Por quê |
|--------|-------------|---------|
| Captura (F2) | Heartbeat/CNPJ, lag, validade do cert (API provider), fila de retry, **docs/mês vs teto por tenant** | Suporte é a queixa nº1; guardrail de COGS |
| Motor (F1) | Precision/recall vs golden-set por cClassTrib/setor, distribuição de confiança, taxa de aprovação humana, MAPE do crédito estimado | Falso-positivo silencioso destrói confiança; aprovação caindo = drift |
| Drift de NT | Idade da base vs última NT; % apontamentos afetados por NT nova | Classificador apodrece em semanas |
| **Ciclo/SLA** | Pendências > `decidir_ate`; **aprovados inertes** (aprovação→ação); **telemetria de aprovação cega** (< Ns/item) | A trilha só protege se cobrar conduta; teatro detectado, não presumido |
| Trilha | Integridade da cadeia (verificação periódica) + **confirmação dos carimbos ACT** (TST válido) | O moat prova a própria integridade — agora com âncora externa |
| e-CAC (A) | Custo/consulta por tenant, hit-rate do cache, **403 cobrados (meta: zero)** | Unit economics da mina + gate de procuração |
| Billing (F1) | `consumo_mensal` vs franquia; alertas de upgrade | D7 |
| Concierge (C0) | Horas de operação manual por laudo | Dimensiona o que a F1 automatiza primeiro |

---

## 12. Decisões — fechadas vs abertas

### Fechadas pelo conclave (não relitigar sem gatilho)

| # | Decisão | Resolução |
|---|---------|-----------|
| A2 | Fila | **pgmq** (Supabase Queues) — pg-boss exige session-mode que o pooler do Supabase quebra (Dara, endossada por Roberto). Dia-0 sem fila; pgmq na F2 |
| A4 | RAG store | **pgvector**, embeddings em `ref` (globais) — confirmada |
| A5 | Assinatura/âncora | **REVERTIDA** (3 revisores contra o draft): carimbo ACT no laudo + fecho diário F1 (mensal só no C0) + assinatura PAdES do contador em lote. Nunca por evento. O atrito era fictício: o contador já vive de certificado |
| A6 | Fonte da base | **Híbrida com hierarquia obrigatória** (M-4): oficial = fundamento; licenciada = sugestão com proveniência separada; reconciliação a cada importação |
| A8 | Stack do motor | Node no F1 (regras+RAG); extrair Python depois se o eval exigir — fronteira limpa via fila |
| — | Rejeição motivada | Dropdown curado (6-8 motivos) + texto opcional — tabulável > dissertação |
| — | Materialidade no ciclo | Limiar configurável (R$ × confiança); acima = individual com SLA; abaixo = lote documentado na trilha |
| — | WhatsApp | Resumo agregado não-identificável no corpo + magic link de sessão curta |

### Abertas (com dono e gatilho)

| # | Decisão | Recomendação | Gatilho |
|---|---------|--------------|---------|
| A3 | Reuso Gestorize: fork vs spec | Condicionada ao **Spike 5** (bloqueador do §4 inteiro) | Spike 5 |
| A7 | Provider de captura | **Focus como hipótese primária** — não pelo preço, mas pela **previsibilidade de COGS** para precificar franquia (PlugNotas em bilhetagem negociada = tier no escuro). Matriz completa no Spike 3: cobertura DF-e, NSU, DPA/suboperação, custo/nota, SLA de webhook. Lock-in mitigado pela ingestão neutra | Spike 3 (pós-Concierge) |
| N-1 | Formato da decisão em lote (materialidade) sustenta juridicamente? | Validar o formato com Heleno no Spike 6 ("isto te defende num auto?") | Spike 6 |
| N-2 | Cotação real de ACT (pacotes) e Infosimples | Estimativas R$0,30-1,00/carimbo a confirmar antes de fechar pricing | Antes do 1º tier |
| N-3 | Matriz de retenção — validação jurídica | `ref.politica_retencao` desenhada; @legal-chief (Patrícia Peck) confirma prazos | Antes da F1 |
| N-4 | DANFSe próprio (renderização) | API nacional morre 01/07/2026; orçar renderer no F2/F3 | Planning F2 |
| N-5 | Layouts exatos de importação Domínio/Alterdata (versões) | Levantar com 1 escritório piloto no Concierge | C0 |
| N-6 | Elasticidade do ticket R$849-999 | Hipótese forte do Anderson; confirmar nas mesas do Renan | Concierge |

---

## 13. Riscos técnicos & mitigação

| Risco | Mitigação |
|-------|-----------|
| **Aprovado inerte / pendente eterno** (trilha vira prova contra o cliente) | Ciclo fechado M-2/M-3 + SLA + escalonamento + view de passivo + "fila do dia" (§3.5) |
| **Aprovação no atacado vira teatro** | Materialidade + dropdown + telemetria de aprovação cega + apontamento que ensina (R7) |
| **COGS de captura quebra a margem** | Captura seletiva default-OFF + franquia ≥2-3× + teto/tenant + coluna de custo por perfil no pricing (§9) |
| **Trilha refutada juridicamente** (hash autorreferente) | Carimbo ACT por laudo + fecho diário F1 + Spike 6 com tributarista ("isto defende?") |
| **Exercício ilegal da contabilidade no C0** | Dossiê = insumo; contador do escritório assina (CRC+PAdES); copy calibrada (C9) |
| Atrito de ativação no provider + autorização em lote (50-500 CNPJs) | Onboarding como FEATURE: wizard de lote, tracking por CNPJ, playbook de outorga |
| Gestorize não-deployável (A3) | Spike 5 primeiro; plano B = reuso de spec, F1 +30-40% |
| Base cClassTrib errada/desatualizada (drift de NT) | Bitemporal + camadas + reconciliação + monitor de NT + alerta de idade |
| Falso-positivo silencioso | Golden-set rotulado por tributarista + gate de eval antes da carteira real (não-negociável) |
| Procuração vencida → 403 cobrado / CTN 198 | Gate PROCURACOES + FK obrigatória + suspensão por evento (M-8) |
| Lock-in do provider | Ingestão neutra (adapter); XML bruto sempre nosso |
| Expectativa de vigilância fabricada (cobertura parcial) | Cobertura declarada por CNPJ na UI e no Relatório de Valor |
| Operação manual do C0 não escala | Medir horas/laudo — define a ordem de automação da F1 |
| Copy promete resultado ("garantiu", "evita multa") | Banlist como teste de CI sobre TODOS os templates; conta do 1% no lugar da "multa" |

## 14. Spikes (revisados — ordem importa)

1. **Concierge MVP + Demo Kit** *(prioridade absoluta; doc 14 + §8.1)* — inclui validar o formato da trilha manual e o template do Relatório de Valor com 1-2 contadores, e levantar layouts ERP (N-5).
2. **Spike Golden-set + Motor** — 200-500 itens reais contra a base pública em camadas; rotular com tributarista; precision/recall; decide o corte da camada licenciada (A6).
3. **Spike Provider de Captura** — sandbox Focus E PlugNotas: matriz A7 + minuta DPA/suboperação + **simulação de COGS por perfil de carteira**. *(Só após sinal verde do Concierge.)*
4. **Spike Integra Contador** — 1 faixa mínima na Loja SERPRO + 1 procuração real + consulta PROCURACOES da carteira piloto; medir custo e atrito. *(Paralelo.)*
5. **Spike Gestorize deployável** — desbloqueia A3 e o §4.
6. **Spike Trilha + Prova** — protótipo do ledger + **1 carimbo ACT real sobre 1 laudo** + revisão do formato (incluindo a decisão em lote N-1) com o tributarista: "isto te defende num auto de infração?". Barato e de-riska o moat.
7. **Spike EFD** *(novo)* — parser dos blocos C/M de 1 EFD real do piloto; provar o cruzamento XML × declarado e localizar a evidência do monofásico. Alimenta o R2 antes da F1.

---

## 15. TABELA DE RASTREABILIDADE — as 28 condições do conclave

Legenda: ✅ incorporada · 🔄 adaptada (com motivo) · ❌ rejeitada (nenhuma).

### Heleno (réplica `06`, C1-C10)

| # | Condição | Seção que atende | Status |
|---|----------|------------------|--------|
| C1 | Carimbo ACT no laudo + fecho mínimo diário F1; C0 manual avulso; A5 revertida | §3.2, §12-A5, M-3/M-15 | ✅ |
| C2 | Papel `contador` + CPF/CRC/situação; ato privativo; PAdES e-CPF | §3.4, M-1, M-15 | ✅ (com lote do Roberto R10) |
| C3 | Ciclo fechado: `regularizado` + acao/protocolo + SLA + escalonamento + view de inertes | §3.5, M-2/M-3 | ✅ (modulado por materialidade R5 — formato do lote a validar, N-1) |
| C4 | Vigência pelo fato gerador + `fato_gerador_em` + `criterios_desempate` (mantido `conhecida_em`) | §3.3, M-2/M-5 | ✅ |
| C5 | Hierarquia de fontes (`camada`) + citação da linha oficial + reconciliação | §3.3, M-4 | ✅ |
| C6 | Matriz de retenção fundamentada no lugar dos 15 anos | §10, M-6 | ✅ (validação @legal-chief pendente, N-3) |
| C7 | Procuração first-class por serviço + FK NOT NULL + gate + suspensão | §6.4, M-8 | ✅ |
| C8 | Banlist como teste + `status_controversia` + sigilo nos canais | §1.8, §8.3/§8.4, M-2 | 🔄 *(formato WhatsApp: resumo agregado NÃO-identificável permitido no corpo + magic link — adaptação Anderson 1.1c; conteúdo vinculável a CNPJ segue proibido no corpo)* |
| C9 | Concierge sem exercício ilegal: dossiê = insumo; contador assina (CRC+PAdES) | §2 (C0), §6.1 | ✅ |
| C10 | `ref.marco_normativo` versionado + export ERP só a jusante de C2, linha→apontamento, evento | §7, M-7/M-13 | ✅ |

### Roberto (réplica `07`, R1-R10)

| # | Requisito | Seção que atende | Status |
|---|-----------|------------------|--------|
| R1 🔴 | Ponte ERP — Export de Ajustes F1 + evento | §7, M-13 | ✅ |
| R2 🔴 | EFD como insumo (`apuracao_declarada`; monofásico referencia linha EFD) | §7, M-12, Spike 7 | ✅ |
| R3 🔴 | Captura seletiva por cliente + COGS por perfil no pricing | §1.6, §9, M-9 | ✅ |
| R4 | Gate de procuração (PROCURACOES, mapa, zero 403) | §6.4, M-8 | ✅ |
| R5 🔴 | Ciclo fechado COM materialidade (lote documentado) | §3.5, M-2 | ✅ |
| R6 | SLA D+1 / calendário de pico (95% antes do 1º dia útil) | §6.2 | ✅ |
| R7 | Apontamento que ensina (2 eixos: confiança × controvérsia; telemetria de teatro) | §3.5, §11, M-2 | ✅ |
| R8 | Módulo de implantação + import em lote | §8.2, M-11 | ✅ |
| R9 | Relatório de Valor mensal (requisito F1) | §8.3 | ✅ |
| R10 | Carimbo ACT fecho diário + assinatura ICP em lote; A5 revisada | §3.2/§3.4, §12-A5 | ✅ |

### Anderson (réplica `08`, R1-R8)

| # | Requisito | Seção que atende | Status |
|---|-----------|------------------|--------|
| R1 🔴 | Demo Kit = critério de aceite do C0 | §2 (C0), §8.1, §6.1 | ✅ |
| R2 🔴 | Metering + assinatura/franquia dia-0 do F1 | §8.6, M-10 | ✅ |
| R3 | Módulo de Implantação + lote + tela de procurações | §8.2, §6.4, M-11 | ✅ |
| R4 | Relatório de Valor nas duas pontas (F1, junto do motor) | §8.3 | ✅ |
| R5 | White-label estrutural + opacidade de preço (RLS) | §8.5, M-14 | ✅ |
| R6 🔴 | Captura seletiva + guardrail de COGS + franquia ≥2-3× | §1.6, §9, M-9 | ✅ |
| R7 | Rigor Heleno na versão barata (laudo + fecho, nunca por evento; dropdown; "fila do dia") | §3.2/§3.4/§3.5 | 🔄 *(fecho carimbado é DIÁRIO em F1, não mensal — upgrade exigido por Heleno C1/Roberto R10; custo R$9-30/mês cabe no envelope R$15-60 do próprio Anderson. Resto integral)* |
| R8 | Ponte ERP mínima + EFD insumo | §7, M-12/M-13 | ✅ |

**Saldo: 26 incorporadas · 2 adaptadas · 0 rejeitadas.** Pendências de validação (não de incorporação): N-1 (formato do lote com Heleno), N-2 (cotação ACT), N-3 (matriz de retenção com @legal-chief).

---

## 16. Próximos passos

1. **@po valida esta v1.0** + a síntese (`16-conclave-arquitetura/09-sintese-conclave.md`).
2. **@pm aplica os patches P-1…P-9 no PRD** (lista na síntese §6) — propagação da D2 + remoção do "15 anos" + métrica do Demo Kit. *(C-1/C-2/C-3 do CONTEXT aplicados em 12/Jun por Orion, fechando o conclave.)*
3. **@data-engineer aplica M-1…M-15 no doc 02** e fecha as migrations 000/001 (dia-0) com as correções.
4. **Rodar em paralelo:** Concierge+Demo Kit (spike 1) · Spike 6 (trilha+ACT+formato do lote) · Spike 5 (Gestorize) · Spike 7 (EFD). Nenhum constrói infra de F1.
5. Após sinal verde do Concierge (≥3/5 pagam): @pm/@sm quebram F1 em stories a partir dos §2/§6.2/§8, respeitando os bloqueantes 🔴 da rastreabilidade.

---

*Síntese produzida por Aria (@architect) em 12/Jun/2026, fechando o conclave Fable de 2 rodadas. Onde os três revisores convergiram, a decisão está fechada; os 7 dissensos resolvidos e a justificativa de cada um estão registrados na síntese (`09-sintese-conclave.md` §3).*
