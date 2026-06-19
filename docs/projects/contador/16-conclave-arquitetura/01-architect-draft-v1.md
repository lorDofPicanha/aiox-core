# Arquitetura Técnica — Core: Apuração Defensável (v1.0 DRAFT)

> Evolução do `11-arquitetura-core.md` (v0.1), incorporando: (a) a reversão da D2 (captura COMPRADA, fim do agente local) propagada a TODAS as seções; (b) o mapa de cobertura da planilha `Comparativo Gestor.xlsx`; (c) a trilha de boa-fé promovida a **cidadã de primeira classe** da arquitetura; (d) o fase-gating explícito Concierge → F1 → F2 → add-ons (D4).
>
> **Autor:** Aria (@architect) · **Data:** 2026-06-11 · **Status:** DRAFT para conclave (pasta `16-conclave-arquitetura/`)
> **Base:** `00-context/CONTEXT.md` (D1–D9), `10-prd-core-ciclo-nota-fiscal.md`, `11-arquitetura-core.md`, `13-conclave-validacao-features.md`, `14-concierge-mvp-spec.md`, `06-comparativo-gestor-concorrentes.md`, `_tmp-comparativo-dump.txt`, `05-visao-produto-reuniao-socios.md`
> **Decisões travadas respeitadas (não relitigadas):** D1 (estende Gestorize), D2 revertida (captura comprada), D4 (Concierge antes de build), D7 (value metric = nota auditada), D8 (humano no loop é design), D9 (e-CAC = add-on).

---

## 0. O que mudou vs v0.1 (changelog)

| # | Mudança | Motivo |
|---|---------|--------|
| 1 | **Resíduos do "agente local" eliminados** de §componentes, §dados, §decisões, §riscos (lista completa em §1) | D2 foi revertida mas o doc 11 só corrigiu o §1; o resto contradiz |
| 2 | **Trilha de boa-fé virou componente próprio** (ledger append-only + base cClassTrib bitemporal + assinatura do contador), não uma linha numa caixa | É O MOAT (conclave: convergência unânime de 9 experts). v0.1 a tratava como atributo do motor |
| 3 | **Pipeline único de ingestão**: upload manual (Documentize) e provider (F2) convergem no mesmo pipeline; a origem é metadado | Evita construir 2× e garante que o que validamos no Concierge é o que escala |
| 4 | **Fase-gating explícito por contêiner** — cada caixa do C4 marcada `[C0] [F1] [F2] [A]`; dia-0 = zero infra nova | D4: Concierge primeiro. v0.1 descrevia o estado final sem dizer o que nasce quando |
| 5 | **Mapa de cobertura Gestorize × Core × Concorrentes** (nova §5) — 23 features ✓ e 21 lacunas da planilha mapeadas a componentes | Planilha do Renan não estava amarrada à arquitetura |
| 6 | **Modelo de dados revisado**: `certificado_ref` → `captura_config` (provider); novas entidades `base_referencia`, `trilha_evento`, `aprovacao`, `laudo` | Coerência com D2 + trilha first-class |
| 7 | **Dados externos validados com fontes** (PlugNotas NSU automático, Focus A1-only, Integra Contador R$0,24–0,40/consulta, NFS-e Nacional obrigatória 01/jan/2026) | §14 |
| 8 | **Decisão órfã A1 (linguagem do agente local) removida**; novas decisões abertas A5–A7 (assinatura da trilha, versionamento da base, escolha do provider) | — |

---

## 1. Inconsistências detectadas (Tarefa A) — e como a v1.0 corrige

A reversão da D2 (10/Jun) foi aplicada apenas no §1 do doc 11 e no cabeçalho do PRD. O corpo dos dois docs (e o próprio CONTEXT) ainda carrega o agente local. **Lista completa:**

### 1.1 No doc `11-arquitetura-core.md` (corrigidas NESTA v1.0)

| # | Local v0.1 | Texto inconsistente | Correção aplicada aqui |
|---|-----------|---------------------|------------------------|
| I-1 | §3 tabela de reaproveitamento | "Varredura ativa por certificado → ❌ → **Construir (agente local)**" | "Comprar (provider PlugNotas/Focus, Fase 2)" — §5.1 desta v1.0 |
| I-2 | §4 modelo de dados | `certificado_ref (SÓ ponteiro/fingerprint — A1 vive no agente local, nunca aqui)` | Entidade substituída por `captura_config` (referência de ativação no provider + saúde do certificado reportada pelo provider) — §6 |
| I-3 | §4 regras-chave | "A presença do A1 é verificada via **handshake com o agente local**" | Saúde/validade do certificado vem da **API do provider** (heartbeat por CNPJ) — §6/§10 |
| I-4 | §8 decisão A1 | "Linguagem do **agente local**: Go vs Node" | Decisão órfã — REMOVIDA. Substituída por A7 (escolha do provider) — §11 |
| I-5 | §9 riscos | "Fricção de **instalar agente local** → instalador um-clique" | Risco real agora é outro: **atrito de ativação no provider + autorização (autXML/manifestação) em lote** — §12 |
| I-6 | §11 próximos passos | "Validar este desenho com os sócios (**especialmente o agente local — é a aposta de design**)" | A aposta de design agora é a **trilha de boa-fé** (§4). Próximos passos reescritos — §15 |

### 1.2 No PRD `10-prd-core-ciclo-nota-fiscal.md` (patches recomendados — dono: @pm/Orion)

| # | Local | Texto inconsistente | Patch recomendado |
|---|-------|---------------------|-------------------|
| P-1 | §2 hipótese central | "O contador paga mensalidade pela **captura + auditoria automáticas**" + métrica "pilotos usando a **Captura** por 30 dias" | Contradiz D4/doc 14. Hipótese revisada: *"o contador paga pelo LAUDO defensável (divergências + trilha de boa-fé)"*. Métrica = ≥3/5 escritórios pagam no Concierge |
| P-2 | §3 não-objetivos | "Guardar A1 na nuvem (**ver arquitetura: agente local**)" | "(captura comprada; A1 custodiado pelo provider sob DPA/operador)" |
| P-3 | §5 Módulo 1, critério 1 | "Escritório cadastra certificado **no agente local**; varredura puxa notas..." | "Escritório ativa a captura no provider (A1 enviado direto ao provider, sob DPA); varredura puxa notas..." |
| P-4 | §5 Módulo 1, rótulo | Cabeçalho diz `[FASE 2 · COMPRADA]` mas os critérios de aceite dizem "**(Fase 0)**" | Renumerar critérios para Fase 2. Fase 0 agora é o Concierge (doc 14) |
| P-5 | §6 constraint 2 | "LGPD/certificado by design (**agente local custodia A1**)" | "(não custodiamos A1; provider é operador sob DPA — Art. 39 LGPD)" |
| P-6 | §7 risco 1 mitigação | "**Agente local custodia; nunca sobe pra nuvem**" | "Não custodiamos: A1 vai direto ao provider sob DPA + cláusula de operador; risco vira contratual transferível" |
| P-7 | §12 próximo passo 4 | "Spike técnico: **agente local** + NFeDistribuicaoDFe" | "Spike provider de captura (PlugNotas/Focus) — só após sinal verde do Concierge" |

### 1.3 No `00-context/CONTEXT.md` (patches recomendados — dono: Orion)

| # | Local | Texto inconsistente | Patch recomendado |
|---|-------|---------------------|-------------------|
| C-1 | §3 glossário "Agente local" | Definição viva, sem marca de obsoleto — contradiz a própria D2 do §6 | Marcar `[OBSOLETO — D2 revertida 10/Jun; captura comprada de provider]` |
| C-2 | §5 constraint 2 | "Decisão-chave: certificado A1 fica no **agente local**, nunca na nuvem" | "Decisão-chave: NÃO custodiamos A1 — captura comprada de provider com DPA + cláusula de operador (D2)" |
| C-3 | §3 glossário "Captura (#1)" | "Varredura automática de notas **via certificado**" (neutro, mas ambíguo) | "...via provider de captura (A1 custodiado pelo provider)" |

> O doc `05` é ata de reunião (registro histórico) — **não corrigir**; o agente local ali documenta o que foi dito em 04/Jun.

---

## 2. Princípios arquiteturais (v1.0)

1. **Comprar a commodity, construir o moat.** Os 8 meses de runway vão para o motor de auditoria + trilha de boa-fé (irrepetíveis). Captura (PlugNotas/Focus), e-CAC (Integra Contador) e emissão (API NFS-e Nacional) são alugados/oficiais. *(D2, conclave)*
2. **A trilha de boa-fé é cidadã de primeira classe.** Não é log: é um **ledger imutável** com proveniência normativa, versionamento bitemporal da base cClassTrib e assinatura do contador humano. Todo componente que toca apuração ESCREVE nela; nenhum componente a edita. *(moat — §4)*
3. **Humano no loop é design, não fallback (D8).** O fluxo de aprovação não é um "if": é o passo que **gera o artefato de valor** (a assinatura do contador entra na trilha). Sem aprovação humana, não existe laudo.
4. **Pipeline único de ingestão.** XML que entra por upload manual (Documentize, dia-0) e XML que entra pelo provider (F2) passam pelo MESMO pipeline (validação → dedup → classificação → fila do motor). Origem é metadado (`nota.origem`), não bifurcação de arquitetura.
5. **Fase-gating: nada nasce antes do sinal verde (D4).** Cada contêiner tem etiqueta de fase. Dia-0 = **zero infra nova**. O Concierge valida; só pagamento real libera build.
6. **Postgres-only no início.** Supabase (Postgres + RLS + Storage + pgvector) + pg-boss como fila. Uma peça de infra, multi-tenant por RLS, padrão já validado em projeto irmão (CRM): menos superfícies de falha com time de 1 dev. *(trade-off em §11/A2)*
7. **Linguagem jurídica defensiva em todo output.** "Indício/divergência potencial", nunca "garantido/correto" — hard-coded nos templates de laudo, não convenção. *(Heleno, constraint 4)*

---

## 3. Visão de componentes — C4 nível contêiner (Tarefa C)

Etiquetas de fase: `[C0]` Concierge (dia-0, zero infra nova) · `[F1]` após Concierge pago · `[F2]` após F1 validada · `[F3]` recuperação/emissor · `[A]` add-on (linha paralela, não bloqueia o core).

```
                    ESCRITÓRIO CONTÁBIL (tenant)                CLIENTE FINAL (indireto)
                    sócio/gestor · contador/analista            portal white-label [F3+]
                          │ HTTPS                                      │
┌─────────────────────────▼──────────────────────────────────────────▼───────────────┐
│  WEB APP — Gestorize React estendido [C0 parcial/F1]                                │
│  carteira · fila de revisão/aprovação (assinatura) · laudos · painéis · admin       │
└───────┬───────────────────────────┬─────────────────────────────────┬───────────────┘
        │                           │                                 │
┌───────▼────────────┐   ┌──────────▼──────────────┐   ┌──────────────▼──────────────┐
│ INGESTÃO [F1]      │   │ ⭐ MOTOR DE AUDITORIA   │   │ ⭐ TRILHA DE BOA-FÉ [F1]    │
│ • upload manual    │   │    [F1]                 │   │   (ledger append-only)      │
│   (Documentize:    │   │ regras + RAG cClassTrib │   │ • proveniência por aponta-  │
│   parse, hash,     │──▶│ confidence calibrada    │──▶│   mento (norma/NT/data/     │
│   dedup, tipo,     │   │ golden-set / evaluation │   │   versão da base/confiança) │
│   DocumentFeedback)│   │ drift monitor de NT     │   │ • aprovações assinadas      │
│ • webhook provider │   │                         │   │ • hash-encadeado, imutável  │
│   [F2]             │   └──────────┬──────────────┘   └──────────────┬──────────────┘
└───────┬────────────┘              │                                 │
        │              ┌────────────▼─────────────┐    ┌──────────────▼──────────────┐
┌───────▼────────────┐ │ BASE DE REFERÊNCIA [F1]  │    │ GERADOR DE LAUDO/DOSSIÊ     │
│ FILA pg-boss [F1]  │ │ cClassTrib×NCM×CST       │    │ [C0 manual → F1]            │
│ retry · idempotên- │ │ bitemporal (vigência +   │    │ white-label · disclaimer    │
│ cia · backpressure │ │ data de conhecimento/NT) │    │ resumo executivo revenda    │
└────────────────────┘ │ fonte pública + licen-   │    │ dossiê PER/DCOMP [F3]       │
                       │ ciada (Systax/Taxcel)    │    └─────────────────────────────┘
┌────────────────────┐ └──────────────────────────┘    ┌─────────────────────────────┐
│ STORAGE XML [F1]   │                                 │ OBSERVABILIDADE [F1→F2]     │
│ 15 anos · partição │     POSTGRES multi-tenant       │ heartbeat/CNPJ · saúde cert │
│ tenant→CNPJ→compet.│     (RLS em tudo) [F1]          │ métricas motor · custo e-CAC│
└────────────────────┘                                 └─────────────────────────────┘
═══════════════════════════ fronteira da nossa nuvem ═══════════════════════════════════
        ▲ XML+meta (webhook)          ▲ consultas (cache)            ▲ emissão [F3]
┌───────┴──────────────┐   ┌──────────┴───────────────┐   ┌──────────┴──────────────┐
│ PROVIDER CAPTURA [F2]│   │ SERPRO INTEGRA CONTADOR  │   │ ADN/SEFIN NFS-e         │
│ PlugNotas/Focus      │   │ [A · add-on e-CAC]       │   │ NACIONAL [F3]           │
│ • custodia A1 (DPA + │   │ • procuração eletrônica  │   │ • emissor API oficial   │
│   operador Art.39)   │   │   server-side (e-CAC)    │   │   gratuito              │
│ • NSU/backoff/manif. │   │ • R$0,24–0,40/consulta   │   │ • Focus/PlugNotas como  │
│ • renovação de cert. │   │ • caixa postal/SITFIS/CND│   │   fallback municipal    │
└──────────────────────┘   └──────────────────────────┘   └─────────────────────────┘
```

**O que é dia-0 (Concierge) vs o que só nasce depois:**

| Fase | O que existe | Infra nova |
|------|--------------|-----------|
| **C0 Concierge** | Recepção de XML à mão (Documentize se o Gestorize estiver deployável — Spike 5; senão pasta compartilhada/e-mail), análise manual (Breno+AIOS), **laudo white-label** com trilha de boa-fé PREENCHIDA MANUALMENTE no mesmo formato/schema da F1 (planilha-ledger: apontamento → norma → NT → data → confiança) | **ZERO** |
| **F1** | Motor (regras+RAG), base de referência versionada, golden-set/evaluation, trilha automatizada, fila de revisão, gerador de laudo | Supabase + pg-boss + pgvector |
| **F2** | Captura comprada (provider+DPA), webhook de ingestão, observabilidade de captura, onboarding de autorização em lote | Conta no provider + webhook |
| **F3** | Recuperação industrializada (dossiê PER/DCOMP) + emissor NFS-e Nacional | API ADN/SEFIN |
| **A (paralelo)** | Conector e-CAC (Integra Contador) + painel de carteira | Contrato SERPRO |

> **Ponto crítico do C0:** a trilha de boa-fé NASCE no Concierge, manual, **já no schema final** (§6 `trilha_evento`). Assim o Concierge não é só teste de pagamento — é a validação do formato do moat com contadores reais, e os laudos manuais migram para o ledger na F1 sem perda.

---

## 4. ⭐ Trilha de Boa-fé — o moat como componente (Tarefa C / restrição central)

Três propriedades não-negociáveis, cada uma com mecanismo concreto:

### 4.1 Proveniência imutável (append-only)

- Tabela `trilha_evento` **append-only**: sem UPDATE/DELETE (revogar = novo evento de revogação). Enforçado por (a) permissões de banco — role da aplicação só tem INSERT/SELECT — e (b) trigger que rejeita UPDATE/DELETE.
- **Hash-encadeado por tenant**: `hash = SHA-256(hash_anterior ∥ payload_canônico)`. Qualquer adulteração quebra a cadeia a partir do ponto alterado. Âncora externa periódica (publicar o hash-de-fechamento mensal em local independente — ex.: e-mail assinado ao escritório junto com o laudo) dá verificabilidade de terceiro sem blockchain.
- Cada apontamento do motor grava: **norma + Nota Técnica + data de vigência + versão da base de referência usada + input (item/NCM/cClassTrib aplicado) + output (divergência) + confiança + versão do motor**. É a resposta à pergunta do auto de infração: *"com base em quê, sabendo o quê, em que data, vocês apuraram assim?"*

### 4.2 Versionamento da base cClassTrib por competência (bitemporal)

A relação NCM↔cClassTrib **muda a cada NT** (blind spot #4 do conclave: concept drift). Uma dimensão temporal não basta — precisamos de duas:

- **`vigente_de / vigente_ate`** — quando a regra valia no mundo (competência fiscal).
- **`conhecida_em`** — quando NÓS passamos a saber (publicação da NT / atualização da base licenciada).

Por quê bitemporal: se a NT 2026.00x de novembro muda retroativamente a classificação de um item desde agosto, a trilha precisa provar que **na data da apuração agimos com a melhor informação disponível** (boa-fé = estado de conhecimento, não correção absoluta). Apuração de ago consultou `versão conhecida_em ≤ ago` — e isso fica gravado. Sem `conhecida_em`, uma reanálise retroativa sobrescreve a evidência de boa-fé.

- Toda execução do motor referencia `base_versao_id` explícito → **reprodutibilidade**: qualquer laudo pode ser re-executado contra a mesma versão e dar o mesmo resultado.
- O **monitor de NT** (F1, item 4 do feature set) é o produtor de novas versões da base + gatilho de reanálise de impacto ("a NT X muda o cliente Y") — vira razão de compra recorrente.

### 4.3 Assinatura do contador humano (D8)

- Apontamento nasce `pendente`. Transição para `aprovado`/`rejeitado` exige usuário com papel `contador` e grava `aprovacao` na trilha: quem, quando, o quê, hash do contexto visto na tela (snapshot do apontamento + versão da base).
- O **laudo** só compila apontamentos com decisão humana registrada; carrega `hash_laudo` + lista dos eventos de trilha que o sustentam. Laudo é versão fechada: alterou → novo laudo, novo hash.
- Rejeições alimentam o `DocumentFeedback`/golden-set (loop de melhoria já existente no Documentize — reuso, não reinvenção).
- Assinatura digital qualificada (ICP-Brasil) do PDF do laudo: **decisão aberta A5** (§11) — recomendo adiar; hash + autenticação forte + trilha já dão integridade probatória; ICP agrega força jurídica mas adiciona atrito/custo no MVP.

---

## 5. Mapa de cobertura — Gestorize vs Core vs Concorrentes (Tarefa B)

Fonte: `Comparativo Gestor.xlsx` (aba "Comparativo Funcional": 23 ✓ Gestor + 21 só-concorrentes) + doc `06`.

### 5.1 As 23 features ✓ do Gestor → onde a arquitetura as reusa (camada Gestão)

| # | Feature ✓ do Gestor | Componente da arquitetura que reusa | Papel no core |
|---|---------------------|--------------------------------------|---------------|
| 1 | Cadastro de Clientes | **Identidade & Tenancy** (Web App) | Vira a tabela `cliente` do multi-tenant — base do core |
| 2 | Cadastro de Colaboradores | Identidade & Tenancy | `usuario` (papel analista) |
| 3 | Cadastro de Usuários e Permissões | Identidade & Tenancy | RBAC — pré-requisito da assinatura do contador (D8: papel `contador` aprova) |
| 4 | Configurações Pessoais e Segurança | Identidade & Tenancy | MFA/sessão — sustenta a confiabilidade da assinatura na trilha |
| 5 | Modelos de Configuração Tributária | **Motor de Auditoria** (insumo) | Perfil tributário do cliente (regime/setor) parametriza as regras |
| 6 | Reconhecimento de Documentos e Mapeamento de Padrões | **Documentize → Ingestão** | Identificação de tipo de documento no upload manual (C0/F1) |
| 7 | Ferramenta e-Contínuo (Robô de Upload) | Documentize → Ingestão | Caminho de entrada em lote do dia-0 |
| 8 | Tratamento de Documentos Reenviados | Documentize → Ingestão | Dedup (hash perceptual) — complementa idempotência por chave de acesso |
| 9 | Logs e Auditoria | **Observabilidade / audit_log** | Embrião do `audit_log` LGPD. ⚠️ NÃO confundir com a trilha de boa-fé (§4) — esta é componente novo, append-only, hash-encadeado |
| 10 | Agenda de Tributações (Obrigações e Guias) | **Camada Gestão** (add-on) | Reuso integral, fase add-on |
| 11 | Parâmetros de Competência e Antecipação de Pagamento | Camada Gestão | Regras de calendário (antecipa sábado/feriado) — maduras, reusar |
| 12 | Parâmetros de Entrega de Obrigações | Camada Gestão | Reuso integral |
| 13 | Configuração de Departamentos e Obrigações | Camada Gestão | Reuso integral |
| 14 | Gerenciamento de Tarefas e Rotinas Mensais | Camada Gestão | Reuso; o radar-fiscal (kanban) orbita aqui |
| 15 | Envio de Guias e Documentos | **Entrega/Comunicação** | Canal de entrega do LAUDO ao cliente final (log de leitura = recibo) |
| 16 | Personalização de E-mails de Entrega | Entrega/Comunicação | White-label do laudo (contador é o herói — conflito de canal) |
| 17 | Controle de Alvarás e Certidões | Camada Gestão ↔ **add-on e-CAC** | Cadastro manual hoje; o conector e-CAC o alimenta automaticamente (CNDs) — sinergia direta |
| 18 | Tags para Clientes | Web App (segmentação) | Seleção de alvos de auditoria (ex.: tag "alto SKU": farmácia/posto/mercado) |
| 19 | Painel de Indicadores e Dashboard Gerencial | **Camada de apresentação** | Shell dos novos painéis fiscais do core |
| 20 | Dashboard Operacional por Colaborador e Departamento | Camada de apresentação | Reuso (gestão da equipe do escritório) |
| 21 | Consulta e Relatórios | Camada de apresentação | Infra de relatórios reusada pelo laudo |
| 22 | Relatórios de Obrigações e Pendências | Camada de apresentação / Gestão | Reuso integral |
| 23 | Área VIP e Aplicativo | **Portal do cliente final** (F3+) | Base do app white-label futuro |

> **Condição de tudo isso:** Spike 5 (Gestorize deployável — pendência §8.5 do CONTEXT). Se o código não for recuperável, o reuso vira **reuso de spec** (fluxogramas + features como requisitos), e o esforço da F1 cresce ~30-40% (estimativa minha; revisar no spike).

### 5.2 As 21 lacunas (só concorrentes têm) → resolvida pelo core, add-on ou FORA

**✅ Resolvidas por componentes do CORE (8):**

| Lacuna | Componente que resolve | Fase |
|--------|------------------------|------|
| Robôs de Leitura Automática de Documentos | Documentize + pipeline de Ingestão (parse XML/PDF→estrutura) | C0/F1 |
| Reconhecimento Automático de Recibos (PDF/XML) | Documentize (extração + identificação de tipo) — OCR PDF→XML fallback (padrão e-Auditoria) | F1 |
| **Recálculo Automático** | **= Motor de Auditoria** (compara aplicado vs referência cClassTrib/NCM e recalcula). É a MESMA feature com nome de concorrente | F1 ⭐ |
| Agente de Varredura e Controle de Obrigações | **= Captura comprada** (provider faz a varredura DF-e; nós orquestramos e observamos) | F2 |
| Recebimento de Documentos | Ingestão (upload manual C0 → captura automática F2) | C0→F2 |
| Painéis Fiscal, Contábil, Societário | Camada de apresentação do core (painel fiscal = saída do motor; societário = dados cadastrais + e-CAC) | F1/A |
| Protocolo Automático de Envio | Entrega/Comunicação estendida (protocolo + log de leitura já existem no Gestor para guias; estender ao laudo/dossiê) | F1 |
| Conciliação Inteligente (na acepção FISCAL: XML×escrituração) | Motor de Auditoria — auditoria cruzada SPED×XML (padrão Domínio Kolossus), roadmap F1+ | F1+ |

**🟨 Resolvidas como ADD-ON (linhas paralelas, D9 — não bloqueiam o core):**

| Lacuna | Add-on | Nota |
|--------|--------|------|
| Diagnóstico Fiscal Automatizado (e-CAC) | **Conector e-CAC** via Integra Contador (procuração eletrônica server-side) | Mina de receita ~R$2k/mês; categoria lotada → infra, não wedge. Alimenta o Controle de Certidões do Gestor |
| Emissão Automatizada de NFS-e e Boletos | **Emissor** via API NFS-e Nacional (gratuita) + Focus/PlugNotas fallback municipal | F3; modelo revenda. ❌ Nuvem Fiscal (morre 31/jul/2026) |
| Integração Oficial do WhatsApp | Add-on Comunicação (WhatsApp Cloud API oficial) | Acessórias domina — não competir agora; entra como canal de entrega do laudo depois |
| App Personalizado para Clientes | Evolução da "Área VIP e Aplicativo" do Gestor (white-label) | F3+; mobile exige lojas/pentest (doc 05) |

**🟨 Lacunas APARENTES — o Gestor já cobre parcial (4):** Controle de Obrigações Contábeis, Controle e Gestão de Tarefas, Monitoramento por depto/colaborador/cliente, Dashboards Gerenciais / Desempenho da Equipe. A planilha as marca como lacuna por **nomenclatura de concorrente**, mas batem ~1:1 com features ✓ do Gestor (#10-14, #19-20). Ação: gap-analysis fina no Spike 5, não build novo. *(Não inflar escopo por sinônimo.)*

**❌ FORA do escopo (5) — território Nibo/financeiro, não brigar:**

| Lacuna | Por que fica fora |
|--------|-------------------|
| Fluxo de Caixa | Financeiro/BPO — outro produto, outro comprador. Diluiria os 8 meses |
| Rateio de Despesas e Receitas | Idem |
| Nibo BPO Financeiro | Feature-marca da Nibo; replicar = guerra com incumbente capitalizado |
| Nibo Conciliador Open Finance | Idem + dependência regulatória Open Finance fora da nossa tese |
| Conciliação Inteligente (acepção FINANCEIRA: extrato×lançamento) | A acepção fiscal entra no motor (acima); a bancária fica fora |

> **Leitura estratégica (inalterada do doc 06, agora amarrada):** as lacunas do Gestor são quase exatamente o core fiscal que vamos construir/alugar. O Gestor entra como **camada de Gestão pronta** (23 features) + **esqueleto de ingestão** (Documentize); o diferencial (motor+trilha) é 100% novo — e é onde os concorrentes de gestão (Nibo etc.) também não estão.

---

## 6. Modelo de dados multi-tenant (ESBOÇO — @data-engineer detalha)

Isolamento por **escritório** (tenant raiz), RLS em todas as tabelas, storage particionado por tenant.

```
escritorio (tenant)
 ├─ usuario (papel: admin | contador | analista)            ← RBAC sustenta D8
 ├─ cliente (cnpj, regime: MEI|Simples|Presumido|Real, setor, tags[])
 │    └─ nota (chave_acesso UNIQUE por tenant, tipo: NFe|NFCe|NFSe|CTe|MDFe,
 │             direcao: compra|venda, competencia, xml_ref → storage,
 │             origem: upload|provider, capturada_em, recebida_em)
 │         └─ item (n_item, descricao, ncm, cclasstrib_aplicado, cst, tributacao_aplicada)
 │              └─ apontamento (base_versao_id FK, divergencia, campo_exato,
 │                     confianca, status: pendente|aprovado|rejeitado,
 │                     versao_motor, criado_em)
 │                   └─ aprovacao (usuario_id [papel contador], decidido_em,
 │                          snapshot_hash, justificativa?)
 ├─ captura_config (provider: plugnotas|focus, ativacao_ref, status,
 │       cert_validade, cert_saude, ultima_sync, dpa_ref)        ← substitui certificado_ref (I-2)
 ├─ laudo (competencia, versao, hash_laudo, base_versao_id, assinado_por,
 │       emitido_em, trilha_eventos[] refs, white_label_config)
 ├─ ecac_consulta (cnpj, tipo: caixa_postal|sitfis|cnd, resultado_ref,
 │       custo_centavos, consultado_em, cache_expira_em)          ← add-on
 ├─ trilha_evento (APPEND-ONLY: seq, tipo: apontamento|aprovacao|laudo|
 │       revogacao|base_update, payload JSONB canônico,
 │       hash_anterior, hash, criado_em)                          ← ⭐ ledger §4.1
 └─ audit_log (quem, o quê, quando — acesso a dados; LGPD)        ← ≠ trilha (operacional)

GLOBAL (sem tenant — compartilhada):
 └─ base_referencia (ncm, cclasstrib_ref, cst_ref, regra_jsonb,
        vigente_de, vigente_ate, conhecida_em, fonte: publica|systax|taxcel,
        nt_origem, base_versao_id)                                ← ⭐ bitemporal §4.2
```

**Regras-chave:**
- `nota.chave_acesso` UNIQUE por tenant → idempotência (upsert no-op).
- `base_referencia` é **global** (a norma é a mesma para todos) mas **toda leitura é por `base_versao_id`** — nunca "a versão atual" implícita.
- `trilha_evento`: role da aplicação sem UPDATE/DELETE + trigger de rejeição (§4.1).
- Retenção XML 15 anos (obrigação legal de guarda prevalece sobre direito de exclusão LGPD durante o prazo — documentar base legal; mantido da v0.1).
- ❌ Removido: `certificado_ref`/handshake com agente local (inconsistências I-2/I-3).

---

## 7. Fluxos principais

### 7.1 `[C0]` Concierge dia-0 — zero infra nova

```
Contador exporta XMLs à mão ──▶ Upload (Documentize, se Gestorize deployável;
                                 fallback: pasta compartilhada)
        ──▶ Análise MANUAL (Breno + AIOS): divergências cClassTrib/NCM + scan monofásico
        ──▶ Trilha preenchida À MÃO no schema final (planilha-ledger §3)
        ──▶ LAUDO white-label (divergências + campo exato + confidence "onde NÃO sei"
             + crédito estimado + risco jurídico + trilha + resumo executivo + disclaimer)
        ──▶ Cobrança real (R$300-500/mês OU success-fee) → critério ≥3/5 (doc 14)
```

### 7.2 `[F1]` Motor + trilha (só após sinal verde pago)

```
XML (upload) ─▶ Ingestão (valida schema, dedup chave_acesso) ─▶ fila pg-boss
  ─▶ Motor: regras + RAG sobre base_referencia@versão ─▶ apontamentos + confiança
       ├─ confiança ≥ threshold ─▶ fila de revisão (contador aprova/rejeita = assinatura)
       └─ confiança < threshold ─▶ fila de revisão marcado "incerto" (decisão 100% humana)
  ─▶ cada apontamento + cada decisão ─▶ trilha_evento (hash-encadeado)
  ─▶ Gerador de Laudo compila SÓ decididos ─▶ hash_laudo ─▶ entrega white-label
Paralelo: Monitor de NT ─▶ nova base_versao ─▶ reanálise de impacto ─▶ alerta "NT X afeta cliente Y"
Gate de qualidade: golden-set (rotulado por tributarista) + harness precision/recall ANTES da carteira real
```

### 7.3 `[F2]` Captura comprada

```
Onboarding: escritório ativa CNPJ no provider (A1 → provider, DPA/operador)
            + autorização/manifestação em lote (o atrito real — blind spot #2)
Provider (NSU automático, backoff, manifestação, renovação) ─▶ webhook XML+meta
  ─▶ MESMA Ingestão da F1 (origem='provider') ─▶ mesmo pipeline ─▶ mesmo motor
Observabilidade: heartbeat por CNPJ · validade do cert (via API provider) · fila de retry visível
```

### 7.4 `[A]` Add-on e-CAC (linha paralela)

```
Procuração eletrônica e-CAC (outorga ao nosso e-CNPJ) ─▶ agendador por carteira
  ─▶ Integra Contador (caixa postal / SITFIS / CNDs) ─▶ cache (TTL por tipo de consulta)
  ─▶ painel único da carteira + alertas (CND vencendo, procuração vencida, caixa postal vermelha)
  ─▶ alimenta Controle de Certidões do Gestor (§5.1 #17)
Unit economics: custo R$0,24–0,40/consulta vs ~R$2k/mês de preço — medir no spike (§13)
```

---

## 8. Confiabilidade — "everything fails" (mantido e estendido da v0.1)

- **Toda ingestão passa pela fila** (pg-boss): retry exponencial, dead-letter visível na UI (observabilidade como feature — queixa nº1 do mercado é suporte ruim).
- **Idempotência ponta-a-ponta**: chave de acesso como dedup key (UNIQUE + upsert); reentrega de webhook do provider = no-op; hash perceptual do Documentize cobre o caso PDF/reenvio.
- **Backpressure**: rate-limit por tenant + agendamento escalonado de carteiras (100 clientes × sync simultânea não derruba o motor).
- **Webhook do provider**: aceitar-rápido-processar-depois (202 + fila) — nunca processar inline; provider com timeout reenvia e a idempotência absorve.
- **e-CAC**: cache por tipo de consulta (situação fiscal muda devagar) → corta custo Integra; circuit breaker se o SERPRO degradar.
- **Reprodutibilidade como resiliência**: qualquer laudo re-executável contra `base_versao_id` — recuperação de desastre do motor é re-rodar, não restaurar estado opaco.

## 9. Segurança & LGPD by design

- **A1 nunca passa por nós** (nem em trânsito): ativação no provider é direta escritório→provider (link de ativação), nós só recebemos a referência. Elimina até a custódia transitória.
- **Cadeia de papéis LGPD documentada**: escritório = controlador (dos dados dos clientes dele) → nós = **operador** (DPA com o escritório) → provider de captura = **suboperador** (DPA + cláusula de operador Art. 39, com aprovação do controlador prevista em contrato).
- RLS multi-tenant em todas as tabelas; storage isolado por tenant; tokens escopados por tenant.
- Criptografia em trânsito (TLS) e em repouso (XML no storage).
- `audit_log` de todo acesso a dado de cliente (≠ trilha de boa-fé; ver §5.1 #9).
- Retenção 15 anos com base legal documentada (obrigação de guarda fiscal); minimização: XML fiscal já é o dado mínimo necessário.
- e-CAC: procuração eletrônica é **outorga formal no portal** — fluxo de onboarding guarda o comprovante da outorga (escopo de serviços × procuração, exigência do Integra Contador).
- Segredos (token provider, credenciais SERPRO) em vault/secret manager, nunca em tabela.

## 10. Observabilidade

| Camada | O que medir | Por quê |
|--------|-------------|---------|
| Captura (F2) | Heartbeat por CNPJ, lag de sync, validade do certificado (API provider), fila de retry, taxa de erro do webhook | "Suporte ruim" é a queixa nº1; certificado vencendo em silêncio era O risco do agente local — continua existindo no provider, só que agora observável |
| Motor (F1) | Precision/recall vs golden-set por cClassTrib/setor, distribuição de confiança, taxa de aprovação humana, MAPE da estimativa de crédito | Falso-positivo silencioso destrói a confiança (constraint 3); aprovação humana caindo = drift |
| **Drift de NT** | Idade da base_referencia vs última NT publicada; % de apontamentos afetados por NT nova | Blind spot #4 — classificador apodrece em semanas sem isso |
| Trilha | Integridade da cadeia de hash (verificação periódica), eventos/dia | O moat precisa provar a própria integridade |
| e-CAC (A) | Custo por consulta acumulado por tenant, hit-rate do cache | Unit economics da mina (pendência §8.4 do CONTEXT) |
| Concierge (C0) | **Horas de operação manual por laudo** | Mede o "serviço em software é difícil" (Roberto) e dimensiona o que a F1 precisa automatizar primeiro |

## 11. Decisões em aberto (com recomendação)

| # | Decisão | Opções | Recomendação Aria | Trade-off |
|---|---------|--------|--------------------|-----------|
| A2 | Fila | pg-boss (Postgres) vs Redis/Upstash vs SQS | **pg-boss** — uma infra só, transacional com o dado, padrão já validado em projeto irmão | Menos throughput que SQS; irrelevante no nosso volume por anos |
| A3 | Reuso do Gestorize | Fork do código vs reuso de spec | **Condicionado ao Spike 5** (bloqueador). Se deployável: fork+extensão. Senão: reuso de spec (fluxos+features como requisitos) e F1 cresce ~30-40% | Fork herda débito técnico desconhecido; spec-reuse perde as 23 features prontas |
| A4 | RAG store | pgvector vs vetor dedicado | **pgvector** — perto do dado, RLS de graça, KISS | Escala de embeddings limitada; suficiente p/ tabela cClassTrib |
| A5 | Assinatura do laudo | Hash+auth forte (trilha) vs ICP-Brasil no PDF | **Hash+auth no MVP; ICP-Brasil como evolução** (gancho no schema: `laudo.hash_laudo` já existe) | ICP dá força probatória máxima mas custo/atrito por contador no MVP |
| A6 | Fonte da base de referência | Só pública (Receita/NTs) vs licenciada (Systax/Taxcel) por cima | **Híbrida**: pública como espinha + licenciada onde a pública é ambígua (CaaS); decidir corte no spike do golden-set | Licença = custo fixo cedo; só-pública = mais "onde NÃO sei" no laudo (o que não é de todo ruim — honestidade vende) |
| A7 | Provider de captura | PlugNotas (Tecnospeed) vs Focus NFe | **Avaliar no Spike 3 com matriz**: cobertura DF-e (NF-e/NFS-e Nacional/CT-e), NSU automático (PlugNotas confirma), termos de DPA/suboperação, custo/nota, webhook SLA. Sinal atual levemente pró-PlugNotas (Consulta Distribuição DF-e da NFS-e Nacional já ativa, NSU gerenciado) | Lock-in de provider — mitigar com a camada de Ingestão neutra (pipeline único: trocar provider = trocar webhook adapter) |
| A8 | Stack do motor | Tudo Node (reuso com web) vs serviço Python (ecossistema ML) | **Node no F1** (regras+RAG não exigem Python; um runtime só) | Se evaluation exigir tooling ML pesado, extrair serviço Python depois — fronteira limpa via fila |

## 12. Riscos técnicos & mitigação (revisados)

| Risco | Mitigação |
|-------|-----------|
| ~~Fricção de instalar agente local~~ (I-5: obsoleto) → **Atrito de ativação no provider + autorização/manifestação em lote (50-500 CNPJs)** | Onboarding guiado como FEATURE (blind spot #2): wizard de ativação em lote, tracking de status por CNPJ, playbook de outorga |
| Gestorize não-deployável (bloqueador A3) | Spike 5 PRIMEIRO; plano B = reuso de spec, re-estimar F1 |
| Base cClassTrib desatualizada / drift de NT | Bitemporal + monitor de NT + alerta de idade da base (§4.2/§10) |
| Falso-positivo silencioso | Golden-set rotulado por tributarista + gate de evaluation antes da carteira real (não-negociável) |
| Custo Integra Contador imprevisível em volume | Cache + medir no spike antes de precificar o add-on (R$0,24–0,40/consulta validado — §14) |
| Lock-in do provider de captura | Ingestão neutra (adapter por provider); XML bruto sempre nosso no storage |
| Trilha refutada juridicamente (hash interno "fabricável") | Âncora externa periódica do hash (§4.1) + parecer do tributarista parceiro sobre o formato ANTES da F1 (validar com heleno-taveira-torres) |
| Operação manual do Concierge não escala | Medir horas/laudo (§10) — define a ordem de automação da F1 |

## 13. Spikes (revisados — ordem importa)

1. **Concierge MVP** *(prioridade absoluta — não é spike técnico, é o experimento; doc 14)*. Inclui validar o FORMATO da trilha manual com 1-2 contadores.
2. **Spike Golden-set + Motor** — classificar 200-500 itens reais (XMLs do Concierge) contra a base pública; rotular com tributarista; medir precision/recall. Decide A6 (precisa de base licenciada?).
3. **Spike Provider de Captura** — sandbox PlugNotas E Focus: matriz da A7 + minuta de DPA/suboperação. *(Só após sinal verde do Concierge — D4.)*
4. **Spike Integra Contador** — contratar 1 faixa mínima na Loja SERPRO, 1 procuração eletrônica real, medir custo e atrito da outorga. *(Independe do core — add-on, pode rodar em paralelo se houver folga.)*
5. **Spike Gestorize deployável** — confirmar acesso ao código, subir local, medir reuso real do Documentize. **Desbloqueia A3 e o §5.1 inteiro.**
6. **Spike Trilha** *(novo)* — protótipo do ledger hash-encadeado (1 dia) + revisão do formato com tributarista parceiro: "isto te defende num auto de infração?". Barato e de-riska o moat.

## 14. Dados externos validados (Tarefa D — fontes)

| Afirmação usada na arquitetura | Fonte |
|--------------------------------|-------|
| PlugNotas gerencia o NSU automaticamente (desde NSU 0) na Consulta Distribuição DF-e, inclusive p/ NFS-e Nacional; ativação por empresa com A1, via painel ou API | [Tecnospeed/PlugNotas — NFS-e Nacional: Consulta Distribuição DF-e](https://atendimento.tecnospeed.com.br/hc/pt-br/articles/24296936626711-NFS-e-Nacional-Consulta-Distribui%C3%A7%C3%A3o-DF-e) · [Rota Consultar Distribuição DFe NF-e](https://atendimento.tecnospeed.com.br/hc/pt-br/articles/360009557213-Rota-da-API-Consultar-Distribui%C3%A7%C3%A3o-DFe-NF-e) |
| Focus NFe aceita apenas certificado A1 (e-CNPJ/e-CPF); oferece consulta de NFS-e recebidas | [Focus NFe](https://focusnfe.com.br/) · [Postman — Consulta de NFSe Recebidas](https://www.postman.com/focusnfe/focus-nfe/folder/938kn2d/consulta-de-nfse-recebidas) |
| Integra Contador: contratação via Loja SERPRO com e-CNPJ; procuração eletrônica e-CAC exigida quando o autor ≠ contribuinte; preços por consulta na casa de centavos (ex.: R$0,40 entrega de declaração, R$0,32 emissão de guia, R$0,24 consulta/extrato) | [SERPRO — doc oficial Integra Contador](https://apicenter.estaleiro.serpro.gov.br/documentacao/api-integra-contador/) · [Serviços × Procurações](https://apicenter.estaleiro.serpro.gov.br/documentacao/api-integra-contador/pt/servicos_vs_procuracoes/) · [Loja SERPRO](https://loja.serpro.gov.br/integra-contador/product/integracontador) · [FAQ custos (Domínio)](https://suporte.dominioatendimento.com/central/faces/solucao.html?codigo=10776) |
| NFS-e padrão nacional obrigatória a partir de 01/jan/2026 (LC 214/2025, art. 62); ADN como repositório central; emissão via emissor web OU API; transição até 2032 | [Ministério da Fazenda](https://www.gov.br/fazenda/pt-br/assuntos/noticias/2025/agosto/a-partir-de-janeiro-de-2026-a-nota-fiscal-de-servico-eletronica-nfs-e-sera-obrigatoria-a-fim-de-simplificar-cotidiano-das-empresas) · [Simtax — LC 214/2025](https://simtax.com.br/reforma/nfs-e-padrao-nacional-2026-como-se-preparar-para-a-lc-214-2025/) |

> Confirma duas premissas de pricing/arquitetura: (a) a "mina" e-CAC tem margem brutal real (centavos de custo vs ~R$2k/mês de preço de mercado); (b) o provider já resolve a armadilha NSU — comprar a captura é tecnicamente validado, não só estrategicamente.

## 15. Próximos passos

1. **Conclave de revisão deste draft** (pasta `16-`): mínimo heleno-taveira-torres (formato jurídico da trilha, §4), roberto-dias-duarte (fluxo e-CAC/procuração), werner-vogels ou martin-fowler (ledger + bitemporal + pipeline único). *Decisões estruturais deste draft já estão ancoradas no conclave de 10/Jun (doc 13); o que é NOVO e pede validação: §4 (mecânica da trilha), A5–A8.*
2. **Aplicar patches P-1..P-7 no PRD e C-1..C-3 no CONTEXT** (donos: @pm/Orion) — fechar a propagação da D2.
3. **@data-engineer detalha o §6** (DDL, RLS policies, particionamento do storage, política de retenção).
4. **Rodar Concierge (spike 1) + Spike 6 (trilha) + Spike 5 (Gestorize)** — os três podem andar em paralelo; nenhum constrói infra de F1.
5. Após sinal verde do Concierge: quebrar F1 em stories (@pm/@sm) a partir de §3/§7.2.

---

*Draft produzido por Aria (@architect) em modo autônomo. Decisões marcadas `[AUTO-DECISION]` implícitas: A2/A4/A8 recomendadas sem nova consulta a clones porque o conclave de 10/Jun (9 experts, rodada adversarial) já cobriu o terreno estrutural; A5–A7 e o §4 são contribuições novas desta v1.0 e estão explicitamente endereçadas ao conclave revisor (passo 1).*
