# Síntese do Conclave de Arquitetura — Core v1.0 (Fable, 2 rodadas)

> **Data:** 2026-06-12 · **Orquestração:** Orion (aios-master) · **Modelo dos agentes:** Claude Fable 5 (`claude-fable-5`)
> **Produto final:** `../17-arquitetura-core-v1.md` (supersede `../11-arquitetura-core.md` v0.1)
> **Insumo novo desta rodada:** planilha `Comparativo Gestor (1).xlsx` do Renan (dump em `00-planilha-comparativo-dump.txt`) — 23 features ✓ do Gestorize vs 21 lacunas só em concorrentes, incorporada como Mapa de Cobertura (doc 17 §4).

---

## 1. Formato e participantes

Conclave **profundo** (regra do founder: cada expert = agente independente com dado ao vivo; rodada adversarial; síntese — nunca um passe só).

| Rodada | Agente | Papel | Artefato | Dado ao vivo puxado |
|--------|--------|-------|----------|---------------------|
| 1 | Aria (@architect) | Draft v1.0 + 16 inconsistências D2 detectadas + mapa da planilha | `01` | Integra Contador R$0,24-0,40/consulta; PlugNotas NSU; NFS-e Nacional 01/jan/2026 |
| 1 | Dara (@data-engineer) | Schema DDL multi-tenant completo (RLS, append-only, bitemporal) | `02` | — |
| 1 | heleno-taveira-torres | Parecer tributário/probatório | `03` | Regulamentos 30/abr/2026; marco 1º/ago/2026; tabela cClassTrib v1.40; LC 227/2026; Súmula CARF 161; matriz Serviços×Procurações SERPRO |
| 1 | roberto-dias-duarte | Parecer operacional SPED/captura/e-CAC | `04` | Adesão NFS-e Nacional 2.864 entes (~70% volume); Focus/PlugNotas preços; Nuvem Fiscal morre 31/jul/2026; custo Integra por carteira; DANFSe API morre 01/jul/2026 |
| 1 | anderson-hernandes | Parecer comercial/ICP + **Matriz Geral da planilha PREENCHIDA** (8 concorrentes com preço ao vivo) | `05` | Confi R$250/500; MakroSystem R$195-595; GClick desde R$100; Nibo/Acessórias/Tareffa/Neo/TaskDo sob consulta |
| 2 | heleno (réplica) | 10 condições C1-C10 | `06` | — |
| 2 | roberto (réplica) | 10 requisitos R1-R10 (4 bloqueantes 🔴) | `07` | — |
| 2 | anderson (réplica) | 8 requisitos R1-R8 (3 bloqueantes 🔴) + unit economics de bolso | `08` | — |
| 3 | Aria (@architect, síntese) | Arquitetura v1.0 FINAL + rastreabilidade 28 condições | `../17` | — |

## 2. CONSENSO (decisão fechada — os 3 revisores convergiram)

1. **Carimbo de tempo ACT ICP-Brasil entra no MVP** (A5 do draft REVERTIDA por 3×): no laudo emitido + fecho diário da cadeia em F1 (mensal no C0). Nunca por evento. Custo R$9-30/mês — cabe.
2. **Assinatura qualificada custa zero atrito**: PAdES com o e-CPF que o contador JÁ TEM (sem ele nem procuração e-CAC existe), em lote. Papel `contador` com CRC no schema; analista tria, não pratica o ato.
3. **Ciclo fechado indício→decisão→ação→protocolo COM limiar de materialidade**: acima do limiar = tratamento individual com SLA; abaixo = decisão em lote documentada na trilha. Mata o "pendente eterno" E o "aprovado inerte". Status `regularizado` com protocolo.
4. **Captura SELETIVA por design** (`captura_ativa` default OFF por CNPJ) + franquia de notas auditadas ≥2-3× o custo variável + guardrail de COGS. Cada nota capturada = unidade de ciência que cria ônus jurídico E custo.
5. **Ponte ERP (export de ajustes Domínio/Alterdata) + EFD como insumo** — sem registrar a AÇÃO no ERP, a trilha vira prova de ciência sem conduta (= prova CONTRA o cliente) e a "segunda tela" morre na gaveta.
6. **Demo Kit como critério de aceite do Concierge** — UI mínima sobre o Documentize existente (upload → divergências com R$ → laudo brandado → painel semáforo). C0 sem demo = consultoria invendável.
7. **Relatório de Valor mensal white-label como instituto** (anti-churn) + **banlist de linguagem como teste de CI** ("garantiu", "evita a multa", "crédito garantido" quebram o build).
8. **Matriz de retenção parametrizada** no lugar do "15 anos" sem lastro (regra fiscal = 5 anos CTN; guarda longa seletiva, ex.: créditos da transição 240 meses).
9. **Base cClassTrib bitemporal com vigência pelo FATO GERADOR** + hierarquia de fontes (oficial Portal NF-e = fundamento; licenciada = sugestão com proveniência separada).
10. **Procuração e-CAC como entidade first-class** (FK obrigatória, escopo por serviço, expiração, gate de onboarding — zero 403 cobrado).

## 3. DISSENSOS RESOLVIDOS (7 — com a decisão da síntese)

| # | Conflito | Posições | Resolução (doc 17) |
|---|----------|----------|--------------------|
| 1 | Âncora temporal | Heleno: carimbo forte, janela de 30 dias é fabricável · Anderson: só mensal barato · Roberto: diário é trivial server-side | Carimbo ACT no laudo + **fecho DIÁRIO em F1** (mensal só no C0). §3.2 |
| 2 | Assinatura ICP no MVP | Draft adiava (A5) · Heleno exigia · Anderson temia atrito/custo | **A5 revertida**: e-CPF existente + lote (Roberto R10) = atrito fictício. §3.4 |
| 3 | Ciclo individual vs escala | Heleno C3: justificativa por indício · Roberto: em 200 CNPJs alto-SKU = teatro de aprovação no atacado | **Limiar de materialidade** (R$ × confiança). Formato jurídico do lote a validar no Spike 6 (N-1). §3.5 |
| 4 | Justificativa de rejeição | Heleno: fundamentada · Anderson: texto obrigatório no dia 5 = trilha-ficção | **Dropdown curado (6-8 motivos) + texto opcional** — tabulável > dissertação. §12 |
| 5 | COGS da captura vs pricing | Anderson r1: "R$3/CNPJ fecha com folga" · Roberto: COGS real ~R$6,35/CNPJ = margem NEGATIVA no corredor flat | Captura seletiva **E** repasse: entrada R$249-299 sem captura + tiers com franquia (~R$849-999 típico) = margem variável 45-50%. §9 |
| 6 | WhatsApp vs sigilo fiscal | Anderson: feature que ganha deal · Heleno C8: conteúdo vinculável a CNPJ no corpo = vazamento | **Resumo agregado não-identificável no corpo + magic link** de sessão curta. §8.4 |
| 7 | "Zero infra nova" no C0 | Arquiteto/D4: nada antes do sinal verde · Anderson: PDF+planilha é invendável · Heleno C9: "análise do nosso time" = exercício ilegal | **Demo Kit = UI mínima sobre o que já existe** (não é infra de F1); dossiê = insumo; **contador do escritório assina** (CRC+PAdES). §6.1/§8.1 |

Dissenso menor: provider — draft sinalizava PlugNotas; Roberto mostrou bilhetagem opaca → **Focus como hipótese primária** (previsibilidade de COGS para precificar franquia), matriz no Spike 3 (A7 aberta).

## 4. BLIND SPOTS — o que SÓ a rodada adversarial pegou

1. **"Aprovado inerte"** (Heleno vs schema): aprovar sem retificar fabrica ciência assinada + inação — pior que o pendente eterno. Virou status `regularizado` + view de inertes + SLA (M-2/M-3).
2. **Schema contradizia o próprio D8** (Heleno vs Dara): `usuario.papel` sem `'contador'` e RLS deixando analista aprovar = humano-no-loop como teatro escrito em DDL (M-1).
3. **COGS de captura R$6,35/CNPJ** (Roberto): a descoberta econômica do conclave — captura indiscriminada quebrava o corredor R$200-400 inteiro. "O jurídico encarece 2%; a captura indiscriminada encarecia 100%" (Anderson).
4. **A "multa de ago/2026" foi mal nomeada** (Heleno+Roberto): o marco real (1º/08/2026) é a **perda da dispensa do recolhimento de 1%** + acessórias — comercialmente até melhor (1% calculável dos XMLs do próprio lead, ao vivo na demo). Calendário normativo virou dado versionado, nunca constante.
5. **Sem ponte ERP, a v1.0 fabricava prova CONTRA o cliente** (Roberto): trilha registrava ciência mas não conduta. R1/R2 bloqueantes.
6. **pg-boss quebra no pooler do Supabase** (Dara, endossado por Roberto) → pgmq (A2).
7. **e-mail à parte interessada não é âncora de terceiro** (Heleno vs draft): "quem guarda o relógio é o relojoeiro".

## 5. VEREDITO CONSOLIDADO

| Revisor | Veredito | Condições |
|---------|----------|-----------|
| heleno-taveira-torres | APROVO COM CONDIÇÕES | C1-C10 |
| roberto-dias-duarte | APROVO COM CONDIÇÕES | R1-R10 (🔴 R1, R2, R3, R5) |
| anderson-hernandes | APROVO COM CONDIÇÕES | R1-R8 (🔴 R1, R2, R6) |

**Resultado: ARQUITETURA v1.0 APROVADA** — as 28 condições processadas na síntese: **26 incorporadas · 2 adaptadas (com motivo registrado) · 0 rejeitadas** (rastreabilidade completa no doc 17 §15). Pendências de **validação** (não de incorporação): N-1 formato do lote (Spike 6), N-2 cotação ACT, N-3 matriz de retenção (@legal-chief).

## 6. Patches a docs de terceiros

**PRD (`10-prd-core-ciclo-nota-fiscal.md`) — dono @pm, P-1…P-9:**

| # | Local | Patch |
|---|-------|-------|
| P-1 | §2 hipótese central | Hipótese revisada: *"o contador paga pelo LAUDO defensável (divergências + trilha de boa-fé)"*; métrica = ≥3/5 escritórios pagam no Concierge (não "captura 30 dias") |
| P-2 | §3 não-objetivos | "ver arquitetura: agente local" → "captura comprada; A1 custodiado pelo provider sob DPA/operador" |
| P-3 | §5 Módulo 1, critério 1 | "cadastra certificado no agente local" → "ativa a captura no provider (A1 direto ao provider, sob DPA)" |
| P-4 | §5 Módulo 1, rótulo | Critérios "(Fase 0)" → Fase 2; Fase 0 agora é o Concierge (doc 14) |
| P-5 | §6 constraint 2 | "agente local custodia A1" → "não custodiamos A1; provider é operador sob DPA (Art. 39 LGPD)" |
| P-6 | §7 risco 1 | Mitigação → "A1 direto ao provider sob DPA; risco contratual transferível" |
| P-7 | §12 passo 4 | "Spike agente local" → "Spike provider de captura (pós-Concierge)" |
| P-8 | §5 Módulo 1 | "Armazenamento XML obrigatório por lei (**15 anos**)" → matriz de retenção fundamentada (5 anos CTN como regra; guarda longa seletiva) |
| P-9 | §5/§10 | Critério de aceite do Concierge inclui **Demo Kit demonstrável**; pricing explicita metering por nota auditada + franquia ≥2-3× custo variável + captura seletiva |

**CONTEXT (`00-context/CONTEXT.md`) — ✅ APLICADOS por Orion em 12/Jun:** C-1 glossário "Agente local" marcado OBSOLETO · C-2 constraint §5.2 corrigida (não custodiamos A1) · C-3 glossário "Captura" via provider + seletiva · pointer pro doc 17 adicionado.

**Schema (`02-data-engineer-schema.md`) — dono @data-engineer:** aplicar M-1…M-15 (lista no doc 17 §5) antes das migrations 000/001.

## 7. Próximos passos

Ver doc 17 §16. Ordem: @po valida → @pm patcheia PRD → spikes em paralelo (Concierge+Demo Kit · Trilha+ACT · Gestorize · EFD) → F1 só após ≥3/5 pagarem.

— Orion, orquestrando o sistema 🎯
