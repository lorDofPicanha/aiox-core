# PRD — Core: Ciclo da Nota Fiscal (v0.1)

> **Produto:** Copiloto Fiscal da Reforma (nome de código). **Escopo deste PRD:** o CORE = Captura → Auditoria → e-CAC. Emissor (#4) e Recuperação (overlay) ficam fora deste PRD (PRDs próprios depois).
> **Autor:** Orion (AIOS Master) — normalmente trabalho de @pm; produzido aqui ancorado no conclave de 11 clones do dossiê.
> **Data:** 2026-06-10 · **Status:** Draft REVISADO pelo conclave · **Base:** `00-context/CONTEXT.md`, `09-dossie-estrategico.html`, `13-conclave-validacao-features.md`

> ⚠️ **REVISÃO 10/Jun (conclave, founder aprovou):** o eixo deste PRD mudou de "ciclo da nota fiscal" para **apuração DEFENSÁVEL** (auditoria + trilha de boa-fé é o moat; captura/recuperação orbitam). Sequência invertida: **Concierge MVP manual antes de construir** (ver `14`). Captura = **comprada de provider** (não agente local). Recuperação = isca, não fundação. Pricing por nota auditada. As seções abaixo refletem essas revisões.

---

## 1. Problema & oportunidade

O escritório contábil pequeno/médio (ICP: <10 pessoas, 50-500 CNPJs, R$<100k/mês — **56% do mercado**) não consegue escalar: o trabalho de **entrar cliente-por-cliente, baixar notas, conferir tributação e checar situação fiscal** é manual e repetitivo. A Reforma Tributária (2026-2033) adiciona reclassificação `cClassTrib` recorrente por 7 anos — **starving crowd com relógio**.

Ninguém no mercado junta **inteligência fiscal + gestão + comercial agressivo**. A cunha: ser o que falta no meio, com o comercial que os players técnicos (GOB, IRIS, VERI) não têm.

**A alternativa competitiva real não é outro SaaS — é o status quo** (contador manual + ferramentas soltas tipo Qive/Nibo desconectadas). Posicionamos contra a colcha de retalhos + trabalho manual.

## 2. Objetivo do core & hipótese a validar

**Hipótese central (Eric Ries):** *"O contador paga mensalidade recorrente pela captura + auditoria automáticas de notas."*

**Métrica de validação (Fase 0):** ≥1-2 escritórios-piloto do Renan usando a Captura por ≥30 dias e confirmando que substitui o trabalho manual de download. **North star de longo prazo:** retenção paga (MRR) — recorrente é o ativo, não a recuperação.

## 3. Não-objetivos (fora do core)

- ❌ Apuração/escrituração completa (não substituir Domínio/Alterdata/Fortes/Questor).
- ❌ Emissor robusto tipo Conta Azul.
- ❌ LTV construído na recuperação de crédito.
- ❌ Atacar o cliente final direto (o contador é o canal).
- ❌ Guardar certificado A1 na nuvem (ver arquitetura: agente local).
- ❌ Suportar 15 layouts NFS-e municipais (surfar a NFS-e Nacional 2026).

## 4. Usuários & papéis

| Papel | Quem | Necessidade primária |
|-------|------|----------------------|
| **Sócio/gestor do escritório** | dono/admin | Ver carteira inteira, risco, SLA; comprar/escalar plano |
| **Contador/analista** | colaborador | Revisar e aprovar auditorias (humano no loop); corrigir tributação |
| **Cliente final (empresa)** | indireto | Tem notas capturadas; recebe valor via contador (não usa direto no core) |

## 5. Escopo funcional (a escada — este PRD cobre os 3 primeiros degraus)

### Módulo 1 — Captura de notas `[FASE 2 · COMPRADA, não construída]`

- **Captura COMPRADA de provider** (PlugNotas/Focus) com **DPA + cláusula de operador (Art. 39 LGPD)** — não construir agente local nem custodiar A1 (conclave reverteu; ~500 SPOFs não-observáveis).
- O provider já resolve **NFeDistribuicaoDFe/SEFAZ (modelo NSU, bloqueio 1h), backoff, idempotência, manifestação 4 eventos, renovação de certificado, fallback municipal**. Puxa NF-e/NFC-e/NFS-e/CT-e/MDF-e; classifica compra vs venda por emitente/destinatário.
- **Observabilidade como feature** (heartbeat por CNPJ, saúde do certificado, fila de retry visível) — "suporte ruim" é a queixa nº1 do mercado.
- **Armazenamento XML** — obrigatório por lei (15 anos), quase ninguém faz. XML leve (~7KB).
- **Reaproveita o Documentize** (Gestorize) para o caminho de **upload manual** (Concierge/dia 0): extração, hash perceptual, dedup, identificação de tipo, `DocumentFeedback`.

**Critérios de aceite (Fase 0):**
- [ ] Escritório cadastra certificado no agente local; varredura puxa notas dos últimos N dias sem intervenção manual.
- [ ] Notas classificadas (compra/venda) e armazenadas (XML) com isolamento multi-tenant.
- [ ] Dedup ativo (não duplica nota já capturada — idempotência por chave de acesso).
- [ ] Falha de captura/SEFAZ não perde nota (fila + retry + idempotência).

### Módulo 2 — Auditoria de tributação `[FASE 1]`

- Auditoria automática **ANTES do lançamento**: compara tributação aplicada por item vs **base de referência cClassTrib/NCM**. Aponta itens a corrigir (ex.: celular tributado como lápis).
- **Quanto mais SKU, melhor** (mais chance de imposto pago a mais). Foco: farmácia, posto, mercado (alto SKU, monofásico).
- Motor = **regras + RAG sobre cClassTrib**, NÃO fine-tune (Chip Huyen: "simplicity must be earned").
- **Humano dá o OK sempre.** Golden-set + evaluation antes de escalar.

**Critérios de aceite (Fase 1):**
- [ ] Para uma nota, o motor lista itens com tributação divergente da referência + grau de confiança.
- [ ] Contador revisa, aprova ou rejeita cada apontamento (humano no loop registrado).
- [ ] Golden-set de validação com taxa de falso-positivo medida antes de liberar pra carteira real.
- [ ] Linguagem de saída: "indício", nunca "garantido/correto". Disclaimer presente.

### Add-on premium — Diagnóstico e-CAC em lote `[APLICAÇÃO ADICIONAL · não-core]`

> **NÃO é o core (D9).** É uma aplicação **vendida à parte**, por cima do core. Olha a **situação fiscal da carteira**, não a nota. Categoria lotada (não é diferencial), MAS **mina de receita: ~R$2.000/mês de mensalidade no mercado** (founder); Renan vendia R$8-15k/mês disso na CIEG. Entra como linha de receita premium, no seu próprio tempo — não bloqueia o core.

- Agrega **todas as empresas numa tela só**: caixa postal, situação fiscal, CNDs/certidões (trabalhista, FGTS, estadual, federal, PGFN), ausência de declarações. Filtro tipo "quais clientes têm ausência de CND"; geração em lote.
- Via **Integra Contador (SERPRO)** — homologado, centavos por consulta. Gaps de CND → Infosimples.

**Critérios de aceite:**
- [ ] Painel único mostra situação fiscal de toda a carteira via Integra Contador.
- [ ] Filtros operacionais (ex.: pendências de CND) + geração de certidões em lote.
- [ ] Custo por consulta medido — margem brutal (centavos/consulta vs ~R$2k/mês de preço).

## 6. Constraints não-negociáveis (do conclave — repetidos do CONTEXT)

1. Humano no loop em tudo que toca apuração.
2. LGPD/certificado by design (agente local custodia A1).
3. Evaluation antes de escalar a auditoria (golden-set + observabilidade).
4. Nunca prometer "crédito garantido"/"apuração correta".

## 7. Riscos do produto (ranqueados) & mitigação

| Sev | Risco | Mitigação |
|-----|-------|-----------|
| 🔴 ALTA | Certificado A1 = bomba LGPD | **Agente local custodia; nunca sobe pra nuvem** (decisão de arquitetura) |
| 🔴 ALTA | Consultoria tributária regulada | Disclaimer + responsável técnico habilitado + linguagem "indícios" |
| 🟡 MÉDIA | Conflito de canal (virar concorrente do contador) | Política de canal explícita (PENDENTE — resolver antes de escalar) |
| 🟡 MÉDIA | Falso-positivo da auditoria silencioso | Golden-set + evaluation + observabilidade do motor |
| 🟡 MÉDIA | Dependência do Renan (comercial) | Transformar comercial em processo replicável (fora do core, mas crítico) |

## 8. Sequência de entrega (REVISADA pelo conclave — Concierge primeiro)

| Fase | Entregável | Fundamento |
|------|-----------|------------|
| **Concierge** | 5 escritórios Renan, XML à mão, **LAUDO manual** (divergências cClassTrib + crédito + risco jurídico + trilha de boa-fé + confidence). Critério: ≥3/5 pagam → persevere. Ver `14`. | Eric (MVP) |
| **1** | Motor de auditoria cClassTrib/NCM (regras+RAG, **golden-set**, humano no loop) + **trilha de proveniência/boa-fé** ⭐ o moat | Chip + Heleno |
| **2** | **Comprar captura** (provider+DPA) + observabilidade + onboarding de procuração em lote | Werner + Roberto |
| **3** | Recuperação monofásica industrializada (success-fee separado) + Emissor NFS-e Nacional (API oficial grátis + Focus fallback) | Heleno + Campbell |
| **Add-ons** | **e-CAC em lote** (~R$2k/mês, aplicação à parte) · Emissor revenda · Gestor — vendidos por cima, no próprio tempo | — |

> Construir cada fase do core **só após o sinal verde** da anterior. Os add-ons (e-CAC etc.) são linhas de receita paralelas, não bloqueiam o core. Captura/e-CAC primeiro = vanity validation.

## 9. Pricing (REVISADO pelo conclave — value metric por nota)

- **Value metric = nota fiscal auditada/mês** (NÃO faixa de CNPJ — proxy preguiçoso que ancora na guerra de preço). Tiers por volume: Starter ≤10k notas, Pro ≤50k, Scale 50k+. White-label incluso.
- **Recorrente** entra barato (WTP baixa do dono pequeno) + **preço transparente na landing** (âncora no Pro) — transparência é cunha num mercado opaco.
- **Recuperação = success-fee 15-25% do crédito homologado, linha 100% separada**, nunca abatido do recorrente (empacotar destrói LTV 30%+).
- **Add-ons (linhas premium separadas):** **e-CAC em lote ~R$2.000/mês** (mercado; margem brutal — centavos/consulta de custo) · diagnóstico de choque IBS/CBS pré-ago/2026 (one-time) · emissor (revenda). Nunca descontar; sem fidelidade.

## 10. Métricas de sucesso

- **Fase 0:** ≥1-2 pilotos ativos 30 dias + confirmação qualitativa "substitui o download manual".
- **Geral:** MRR retido (north star), nº de notas capturadas/mês, taxa de aprovação da auditoria, falso-positivo <X% (definir no golden-set), custo Integra por consulta vs preço.

## 11. Pendências para fechar o PRD v1

1. Política de canal (impacta escopo de quem vê o quê).
2. Custo real Integra Contador (impacta pricing da Fase 2).
3. Confirmar código deployável do Gestorize (impacta reaproveitamento do Documentize).
4. Roteiro de entrevista com contadores (Renan traz feedback de campo).

## 12. Próximos passos (após validação deste PRD)

1. Arquitetura técnica do core → `11-arquitetura-core.md` (este pacote).
2. Quebrar Fase 0 em epics/stories via @pm/@sm.
3. Mapa LGPD/segurança v0 (@legal-chief/@patricia-peck + @cyber-chief).
4. Spike técnico: agente local + NFeDistribuicaoDFe (prova de captura).
