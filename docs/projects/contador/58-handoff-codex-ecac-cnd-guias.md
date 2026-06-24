# 58 — Handoff Codex: Build Frente e-CAC / Saúde Fiscal / Entrega de Guias

> **Autor:** Orion (Claude) · **Data:** 2026-06-24 · **Para:** Codex (motorista de execução)
> **Papel:** briefing executável da frente **saúde fiscal da carteira** (CND · situação fiscal · dívida ativa · FGTS/trabalhista · caixa postal) + **envio automatizado de guias** — prioridades do Renan (reunião 22/Jun). Mesmo papel do `53`/`57`.
> **Fontes de verdade:** `55-feature-research/08-ecac-cnd-guias-divida.md` (pesquisa, stories S1–S12) · `55-feature-research/12-sintese-reuniao-renan-hydra.md` (§1.B, §4) · `56-build-plan-paridade.md` (B-eCAC) · `00-context/CONTEXT.md` (§5, D9) · `20-arquitetura-core-v1.1.md`.
> **Divisão de trabalho (Art. VII):** Claude planeja/revisa; **Codex executa**.

---

## 0. Estado atual (não reconstruir)

- **Módulo sintético `apps/contador/app/ecac/`** (cockpit: caixa postal marcar-lida, CNDs preview, gerar lote, filtro) — casca competitiva, dados sintéticos. Selo "Integra Contador/SERPRO = Fase 7".
- **Falta o backend real** + a camada de entrega de guias.

## 1. Objetivo

Saúde fiscal da carteira **funcional, ≥ benchmark Veri** (veri.com.br): monitor diário de e-CAC/CND/dívida ativa, **renovação proativa de CND**, e **entrega de guia** ao cliente — tudo amarrado à trilha de boa-fé e ao health score cross-módulo. **Add-on premium (D9), produto/bolso separados do core.**

## 2. 🔴 PRÉ-REQUISITOS BLOQUEANTES (insumo do founder)

1. **Contrato SERPRO / Integra Contador** + **e-CNPJ** + faixa de consumo.
2. **Conta Infosimples pré-paga** (CNDs; franquia mín. ~R$100/mês, ~R$0,20–0,26/consulta).
3. **Procurações / Autorização de Acesso** homologadas por cliente (Renan/escritório).
4. **WhatsApp Business API** oficial (entrega Nível 1).
5. **Chaves API Conta Azul/Omie + decisão de política de canal** (entrega Nível 3 — §8.1 CONTEXT).
6. **Integração FGTS Digital + eSocial** (guia GRF-e).

## 3. Matriz factual da API (o que liga onde — doc 08 §B)

- ✅ **Integra Contador (SERPRO) expõe:** caixa postal (`CAIXAPOSTAL`), situação fiscal (`SITFIS`), eventos (`EVENTOSATUALIZACAO`), DAS/DARF/DCTFWeb (`PGDASD`/`SICALC`/`DCTFWEB`), parcelamentos (`PARCSN/MEI`), procuração (`AUTENTICAPROCURADOR`/`PROCURACOES`).
- ❌ **NÃO expõe → Infosimples:** CND federal-conjunta, CND estadual/municipal, CNDT trabalhista, CRF/FGTS.
- ❌ **Dívida ativa → PGFN/Regularize** (⚠️ **o FGTS migrou para a PGFN em 01/06/2026** — monitorar Regularize, não só Conectividade Social).
- ⚠️ **GPS / GPS por CEI** = fora da API oficial (decisão: robô próprio vs parceria vs descopo).

## 4. Stories (S1–S12, ordem de ataque)

### Épico A — Backend de saúde fiscal (🔒 SERPRO + Infosimples)
| Story | Tipo | Descrição | Gate |
|---|---|---|---|
| **S1** | [adapter] | Conector Integra Contador (auth e-CNPJ→JWT); caixa postal/SITFIS/eventos | contrato SERPRO |
| **S2** | [adapter] | Onboarding de Autorização de Acesso (fluxo "Recebidas" + alerta de aceite ≤30d) | procurações por cliente |
| **S3** | [build] | Monitor diário + **triagem de relevância** (msg "!" Receita, 3 níveis) + alerta de prazo em intimação | sobre S1 |
| **S4** | [adapter] | Conector Infosimples (CND fed-conjunta/estadual/municipal/CNDT/CRF-FGTS) | conta Infosimples |
| **S5** | [build] | **Renovação proativa de CND em lote** (scheduler por vencimento) + registro na trilha | S4 |
| **S6** | [adapter] | Monitor de dívida ativa (PGFN/Regularize) + alerta de exclusão automática (≤7d/≤75d) | SERPRO/Regularize |

### Épico B — Geração e entrega de guias
| Story | Tipo | Descrição | Gate |
|---|---|---|---|
| **S7** | [adapter] | Geração de guias-Receita (PGDASD/SICALC/DCTFWeb + DAS de parcela) | S1 |
| **S8** | [adapter] | Guia FGTS (GRF-e) via FGTS Digital (Pix/QR, cert SHA-384, depende do eSocial) | FGTS Digital + eSocial |
| **S9** | [build/decisão] | GPS / GPS por CEI (fora da API) — robô próprio vs parceria vs descopo inicial | decisão founder |
| **S10** | [adapter] | **Entrega Nível 1** (WhatsApp oficial + e-mail, com log de leitura data/hora/IP) | WhatsApp API |
| **S11** | [adapter] | **Entrega Nível 3** (push da guia para Contas a Pagar de Conta Azul/Omie), **contador como gatekeeper** | chaves ERP + política de canal |

### Épico C — Diferencial
| Story | Tipo | Descrição | Depende |
|---|---|---|---|
| **S12** | [build] | **Health score cross-módulo** (situação e-CAC/Infosimples × divergência cClassTrib do core) — só nós temos os 2 lados | Auditoria (core) ligada |

> **Caminho recomendado (doc 08 §H):** não tentar bater a Veri em cobertura. Bater em 3 pontos: (i) **health score cross-módulo** (S12), (ii) **renovação proativa amarrada à trilha** (S5), (iii) **entrega Nível 3 com gatekeeper** (S11). Sequência: backend (S1–S7) → entrega (S10–S11) → diferencial (S12). FGTS/GPS (S8–S9) depois.

## 5. Constraints (§5 CONTEXT)

- **Human-in-loop:** o sistema monitora e SUGERE; emitir/entregar guia é ação confirmada pelo contador. Nunca pagar/transmitir sem decisão humana.
- **G6:** "situação fiscal", "indício de pendência", "CND a vencer" — nunca "regularizado/garantido". Banlist = gate.
- **Bounded contexts (FF-1):** dialeto SERPRO/Infosimples isolado nos adapters; app consome contrato/`core_api_v1`.
- **Política de canal (§8.1):** entrega Nível 3 no ERP do cliente final é potente mas mexe na fronteira escritório↔cliente — **decisão estratégica obrigatória antes de S11**.
- **Add-on separado (D9):** e-CAC é produto/bolso à parte do core.

## 6. Portões — o que NÃO construir

- ❌ S11 antes da decisão de política de canal.
- ❌ Pagamento automático de guia (só geração + entrega; pagamento é do cliente).
- ❌ Tratar e-CAC como wedge/diferencial (é commodity lotada; o diferencial é S5/S11/S12).

## 7. Como o Codex deve trabalhar

Ler fontes do cabeçalho → atacar na ordem da §4 (backend → entrega → diferencial); [build] anda sem gate, [adapter] com fixture até a credencial. `typecheck`+`banlist:g6`+`build` verdes por story. Sem git push (founder/@devops). Claude revisa (qualidade + linguagem com clone Heleno).

---

*Pendências founder/Renan: contratos SERPRO/Infosimples/WhatsApp/ERP; procurações; decisão GPS; **decisão de política de canal (S11)**; validar unit economics (~R$1,50–3,50/CNPJ/mês — CONTEXT §8.4).*
