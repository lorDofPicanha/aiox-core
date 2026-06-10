# STORY-CONTADOR-S0-DISCOVERY — Definir ICP, promessa e piloto manual

**Projeto:** Contador / Radar Fiscal + Operação do Escritório Contábil
**Story:** 0.1 — Discovery (Fase 1)
**Orquestrador:** @aios-master (Orion) · **Squad ativo:** Lean Execution (A1 Discovery + A2 Oferta + Trust mínimo)
**Criada:** 2026-06-09 · **Status:** EM ANDAMENTO
**Base:** `03-status-e-proximos-passos.md`, `04-arquitetura-squads.md` (§6.2 Lean), `01-conclave-agentes-mvp.md`

> **Por que existe:** o conclave decidiu *concierge antes de automação* — a incerteza é de **mercado**, não de engenharia. Esta story fecha a base comercial e de evidência **antes** de qualquer código. Nenhum `@dev`/`@architect` pesado nesta fase.

---

## Contexto de canal (atualizado 2026-06-09)

O sócio do founder tem **900+ contatos de escritórios contábeis** (rede quente). Isso **resolve o gargalo de sourcing** (AC-5 deixa de ser "onde achar" e vira "como filtrar e abordar"). O gargalo real passa a ser: **filtro de ICP + oferta + script de abordagem** que converta a rede em (a) 10 entrevistas de discovery e (b) 3 pilotos concierge.

---

## Acceptance Criteria

| AC | Descrição | Entregável | Status |
|----|-----------|------------|--------|
| **AC-1** | ICP final documentado + filtro de seleção | `AC1-icp-final.md` | ✅ FEITO (v1, ratificar) |
| **AC-2** | Oferta piloto concierge documentada | `AC2-oferta-piloto.md` | ✅ FEITO (v1, ratificar pricing) |
| **AC-3** | Roteiro de entrevista (10 perguntas) | `roteiro-entrevista-10q.md` | ✅ FEITO (validado no E-00-MOCK) |
| **AC-4** | Matriz de dores priorizadas | `AC4-matriz-dores-v0.md` | 🟡 v0 HIPÓTESES — **fecha só com 10 entrevistas reais** |
| **AC-5** | Lista de 3 escritórios-alvo p/ piloto | `AC5-selecao-abordagem-rede.md` | 🟡 RUBRICA + SCRIPT prontos — **fecha quando sócio rankear os 900 + 3 aceitarem** |
| **AC-6** | Escopo MVP / fora de escopo | `03-status-e-proximos-passos.md` §Dentro/Fora | ✅ FEITO |

**Definition of Done da Story 0.1:** AC-1, 2, 3, 6 fechados (✅) **E** AC-4 com ≥10 entrevistas reais codificadas **E** AC-5 com 3 escritórios confirmados no piloto. Hoje: bloqueada em campo (AC-4/AC-5 dependem de execução do founder+sócio).

---

## Gate Metrics (kill-criteria do conclave)

Sinais coletados nas entrevistas (ver mapa pergunta→sinal no roteiro):

- **S1 — Dor top-3:** a falta de visibilidade de pendências/prazos aparece no top-3 de dores **sem indução** em ≥70% das entrevistas.
- **S2 — Disposição a pagar:** ≥50% já pagam por algo no problema hoje (sistema/pessoa/agência) **e** articulam um ganho (tempo/risco) que justifique pagar — ancorado em gasto real, nunca hipótese solta.
- **S3 — Medo de CNPJ inapto/multa:** presente, mas o mock indica que **não é universal** (varia por carteira). Não é kill se ausente; é dado.
- **S4 — Ansiedade Reforma:** alta como **gatilho de conversa**, sem que o produto prometa cálculo (linha vermelha C3).

**GO** para Fase 2 (PRD) se: S1 confirmado (≥70%) **E** S2 confirmado (≥50% com ganho articulado).
**PIVOT** se S1 forte mas S2 fraco (dor real, mas ninguém paga → repensar oferta/ICP).
**KILL/repensar** se S1 < 50% (a dor-núcleo não é prioritária → tese errada).

---

## Data Handling / LGPD (Trust C2 — escopo mínimo)

- Consentimento de gravação/uso **antes** de cada entrevista (já no roteiro).
- **NÃO coletar** dados de clientes-final do escritório (CNPJs/dados fiscais de terceiros). Só o contexto do escritório entrevistado.
- Identificar entrevistados por **código** (E-01, E-02…), não por nome em artefato versionado.
- Notas verbatim podem conter nome do entrevistado → manter fora do git (pasta local) ou anonimizar antes de commitar.

## Trust C3 — linhas vermelhas que valem JÁ no discovery

- Entrevistador **não** sugere "a gente calcula a Reforma pra você" (achado E-00-MOCK).
- Nenhum material de abordagem promete cálculo, crédito, enquadramento ou apuração.
- Vocabulário proibido: "garantimos apuração correta", "calculamos seu imposto", "assessoria tributária". Validação obrigatória de `@heleno-taveira-torres` antes de qualquer copy ir a campo.

---

## Donos (Lean Execution Squad §6.2)

| Frente | Dono | Clones núcleo |
|--------|------|---------------|
| Produto + Mercado | `@pm` (+`@analyst`/Atlas) | marty-cagan, teresa-torres, april-dunford |
| Oferta + Posicionamento | `@traffic-masters-chief` (+`@copy-chief`) | april-dunford, alex-hormozi, matt-dixon |
| Trust mínimo | `@legal-chief` (+`@cyber-chief`) | patricia-peck, heleno-taveira-torres |
| Economia + CS | `@analyst` | aswath-damodaran, anderson-hernandes, lincoln-murphy |

**Gates humanos (founder ratifica):** Go/Kill, pivot de ICP, **pricing final**, fechar contrato de piloto.

---

## Próximos passos (ordem)

1. **Founder + sócio:** aplicar o filtro de ICP (`AC5`) sobre os 900 → rankear → escolher 8-10 pra abordar (meta: 3 pilotos + 10 entrevistas).
2. Sócio dispara o **warm intro** (script em `AC5`) — passo 1 é *conversa de estudo*, NÃO venda.
3. Rodar entrevistas com o roteiro (AC-3) → codificar em `AC4` (mata/confirma hipóteses) → fechar Gate Metrics.
4. Para quem acende na dor → apresentar a **oferta concierge** (AC-2).
5. Com Gate GO → `@pm *create-doc prd` (PRD v0.1, Fase 2).

— Orion, orquestrando o sistema 🎯
