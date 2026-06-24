# 59 — Handoff Codex: Build Motor de Reconhecimento / Parser de documentos

> **Autor:** Orion (Claude) · **Data:** 2026-06-24 · **Para:** Codex (motorista de execução)
> **Papel:** briefing executável do **motor de reconhecimento/parsing** — a "dependência crítica" que o founder levantou na reunião (22/Jun): "concluir o reconhecimento/parsificação de arquivos para o sistema identificar campos/dados automaticamente". É pré-requisito das automações (auditoria, recuperação, e-CAC). Mesmo papel do `53`/`57`/`58`.
> **Fontes de verdade:** `55-feature-research/09-doc-parser-ocr.md` (pesquisa, stories R0–R8, gates G1–G5) · `55-feature-research/12-sintese-reuniao-renan-hydra.md` (§1.C) · `00-context/CONTEXT.md` (Documentize §3, §5.3 evaluation, §7 LGPD) · `20-arquitetura-core-v1.1.md` (§3.6 duas classes de insumo).
> **Divisão de trabalho (Art. VII):** Claude planeja/revisa; **Codex executa**.

---

## 0. Estado atual (não reconstruir — REUSAR)

- **Documentize (herdado, dentro do Gestorize)** já faz: upload PDF/img, extração de texto/coordenadas, **hash perceptual**, dedup, identificação de tipo de documento, ciclo `DocumentFeedback` (HITL). → **reaproveitar como base**, não recomeçar.
- **Módulo sintético `apps/contador/app/captura/`** existe (casca). O motor real de reconhecimento é o que falta.

## 1. Objetivo

Motor de reconhecimento que **alimenta as automações** com dados confiáveis e **rastreáveis até o moat**. Princípio organizador: **são DOIS motores**, com regra "XML primeiro, sempre".

- **Motor A (determinístico):** parse de XML fiscal (NF-e/NFC-e/CT-e/MDF-e/NFS-e). 100% preciso, validável contra XSD, custo ~zero, 100% interno (LGPD ok). Para documento que nasce em XML, **OCR é o caminho errado**.
- **Motor B (probabilístico):** OCR/Document AI/LLM-vision só para o que **não tem XML** (DANFE escaneado, recibos, guias, contratos). ~94–98%.

## 2. 🔴 PRÉ-REQUISITOS / GATES (insumo do founder)

1. **Conta Azure AI Document Intelligence (região Brazil South)** + DPA — o único Document AI com residência no Brasil (AWS Textract e Google Doc AI não têm BR). É mitigação LGPD + argumento de venda. (bloqueia Motor B / R5)
2. **Golden-set de extração rotulado** — para avaliar o Motor B **antes de escalar** (§5.3). (bloqueia R5/R8)
3. **Base legal LGPD** — nenhum dado fiscal de terceiro sai do Brasil sem base legal. (bloqueia R5)

> **Motor A (R0–R4) é 100% [build] — não depende de nenhum gate externo. Começar por ele.**

## 3. Stories (R0–R8, ordem de ataque — doc 09 §7.2)

| Story | Tipo | Entrega | Depende |
|---|---|---|---|
| **R0** | [build] | Roteador de insumo sobre o Documentize (tipo + dedup + hash já existem) — classifica XML vs PDF/img | — |
| **R1** | [build] | **Motor A — parser NF-e/NFC-e** contra XSD oficial (Portal NF-e) + extração dos campos-chave + validação de schema | XSD NF-e |
| **R2** | [build] | Verificação de assinatura digital (XMLDSig/ICP) → proveniência | R1 |
| **R3** | [build] | **Mapper XML → entidades de apuração** (NCM/CST/CFOP/cClassTrib/PIS/COFINS) — o elo que alimenta Auditoria/Recuperação | R1 |
| **R4** | [build] | Parser CT-e/MDF-e + **NFS-e Nacional** (grupos IBS/CBS, NT 007/2026, XSD CGNFS-e publicado 12/02/2026) | XSD CGNFS-e |
| **R5** | [adapter] | **Motor B — Azure Doc Intelligence (Brazil South)** + score de confiança por campo | 🔒 conta Azure BR |
| **R6** | [build] | Fila de revisão HITL (threshold) ligada ao `DocumentFeedback` | R5 |
| **R7** | [build] | **Classe de insumo + confiança gravadas na trilha** (XML=evidência forte; extraído=limitada — §3.6) | R3, R5, trilha |
| **R8** | [build]/🔒 | Calibração de confiança contra golden-set + observabilidade | R5, R6, golden-set |

## 4. Gates de qualidade (não escalar sem — doc 09 §7.3)

- **G1 — Validação determinística:** 100% dos XML válidos parseados sem perda dos campos-chave; XML inválido rejeitado com erro claro. (bloqueia R1)
- **G2 — Golden-set de extração:** Motor B avaliado contra golden-set rotulado antes de escalar (§5.3). Métrica = precisão por campo + ECE (calibração). (bloqueia R5/R8)
- **G3 — Confiança calibrada:** score correlaciona com acerto real (não inflado); threshold de revisão por campo crítico (NCM, CST PIS/COFINS, cClassTrib). (bloqueia R7)
- **G4 — LGPD:** nenhum dado fiscal sai do Brasil sem base legal; Document AI em região BR; DPA com o provider. (bloqueia R5)
- **G5 — Trilha:** todo apontamento rastreável até o arquivo (hash) e à classe de insumo. (bloqueia integração com Auditoria/Recuperação)

## 5. Diferencial (o que liga reconhecimento ao moat — §7.1)

O mercado para em "extraí ~97%" (commodity). Ninguém liga reconhecimento à defensabilidade. Nós: **confiança calibrada por campo** ("onde NÃO sei" → empurra pro humano) + **classe de insumo gravada na trilha de boa-fé** → o laudo declara **com que qualidade de evidência** cada apontamento foi sustentado (XML assinado = forte; PDF extraído = limitada).

## 6. Constraints (§5 CONTEXT)

- **XML primeiro, sempre** — não usar OCR em documento que nasce estruturado.
- **LGPD by design** — processamento dentro do Brasil (Azure BR); preferir não exportar dado sensível.
- **Evaluation antes de escalar (§5.3)** — golden-set + observabilidade; falso-positivo silencioso destrói a confiança do contador.
- **Reusar Documentize** — hash/dedup/tipo/HITL já existem.
- **G6/bounded contexts** — parser entrega entidades tipadas ao core via contrato; não vaza dialeto de fornecedor.

## 7. Portões — o que NÃO construir

- ❌ OCR para NF-e/NFC-e/CT-e/NFS-e (têm XML — usar Motor A).
- ❌ Document AI fora do Brasil (viola G4/LGPD).
- ❌ Escalar Motor B sem golden-set avaliado (viola G2).
- ❌ Fine-tune de modelo próprio (CONTEXT §7 — regras+RAG bastam; só se saturar).

## 8. Como o Codex deve trabalhar

Ler fontes do cabeçalho + entender o Documentize. Atacar **R0–R4 primeiro** (Motor A, sem gate, alto valor — destrava auditoria/recuperação). R5+ quando a conta Azure + golden-set existirem. `typecheck`+`banlist:g6`+`build` verdes por story; testes contra fixtures de XML real. Sem git push (founder/@devops). Claude revisa.

---

*Pendências founder: conta Azure Doc Intelligence (BR) + DPA; golden-set de extração rotulado; base legal LGPD. Nada disso bloqueia R0–R4 (Motor A determinístico), que é o pedaço de maior alavancagem imediata.*
