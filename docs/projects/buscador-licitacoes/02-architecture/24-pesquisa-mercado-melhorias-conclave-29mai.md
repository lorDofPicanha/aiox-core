# Mega Pesquisa (mercado/tech/produto/regulatório) + Melhorias + Conclave HYDRA — 29/Mai/2026

**Origem:** owner pediu tech research + mega pesquisa HYDRA sobre a área → analisar melhorias. Pesquisa via workflow de 5 agentes em **fontes web reais e citadas** (110 buscas/fetches; full em `tasks/wqjq3jw55`). Conclave via **HYDRA real** (`self-consultation.js`, Voice DNA congelado dos clones — não role-play genérico).

## 1. Mercado — achado central

Compras públicas BR ~**R$ 1 tri/2025**, >1M processos. Mercado **horizontalizado** (todos atendem "qualquer fornecedor"); Noyce é **vertical obras/raio** = a lacuna estrutural. Líderes (Effecti, ConLicitação) **escondem preço** (enterprise, ticket alto); entrantes IA jogam barato e transparente (EditalPro R$29,90; LicitaFree R$49,90; Quero R$99-159). **Vão de mercado** entre "barato genérico" e "enterprise opaco".

**🎯 Competidor a vigiar: LicitaGov** — único que já combina match por CNPJ + histórico de preço vencedor + dashboard de concorrente + dossiê de impugnação (3 pilares do Noyce). Effecti tem IA "Aimê" + robô de lance + monitor de chat. EditalPro tem score 0-100% + CAPAG do órgão. **Ninguém faz, para OBRAS: Raio-X comportamental do órgão (6m) + Recurso de mérito com RAG TCU + filtro de raio/mobilização.** Esse é o espaço aberto.

## 2. Top melhorias priorizadas (mapeadas ao schema real do app)

Esforço: S ≤2d · M ~1sem · L 2+sem/dep externa.

| # | Melhoria | Aba | Esforço | Impacto |
|---|----------|-----|---------|---------|
| 1 | Chat ao vivo do pregoeiro + banner "fique na sala" (palavras críticas, push) — **dor #1** | Acompanhar | L (conector/portal) | Crítico |
| 2 | Ranking ao vivo + assistente de teto/piso (modo disputa, empate ficto ME/EPP) usando `priceBand` | Acompanhar | M (live dep. #1) | Crítico |
| 3 | Notificação multicanal + SLA prazo (in-app/email/WhatsApp) — `deadline-watch` já existe em dry-run | Monitorar/Mesa | S | Alto |
| 4 | Score 0-100% + "por que entrou" + feedback 👍/👎 (recalibra) — `triage` já existe | Monitorar | S-M | Alto |
| 5 | **Classificação de objeto obras (CNAE 41/42/43) como núcleo** — PNCP não filtra por objeto; sem isso o Vai/Olha/Pula é ruído | Monitorar (motor) | M | Alto (gatekeeper) |
| 6 | **Raio-X do Órgão 6m** (pagamento/aditivos/deserto/deságio/quem habilita) — **moat, ninguém faz p/ obras** | Analisar | M-L (backfill) | Alto (moat) |
| 7 | Checklist anti-desclassificação engenharia + validade de certidões (CREA/ART/CAT/BDI) — schema pronto | Habilitar | M | Alto |
| 8 | **Relógio de preclusão (dias úteis) + montador impugnação/recurso (Lei 14.133 + RAG TCU)** — **moat** | Recorrer | L | Alto (moat) |
| 9 | Ingestão varredura modalidade×data×UF + cache incremental + flag de cobertura (API ≤365d, teto 10k) | motor | M | Alto (base de tudo) |
| 10 | Guardrail anti-alucinação: citação verbatim por entidade (CNPJ/valor/acórdão) — schema `grounding` já força | transversal | M | Alto (confiança=produto) |
| 11 | Cartão "Vai/Olha/Pula" com 6 fatos em 2min sem abrir o edital | Mesa | S | Médio-Alto |
| 12 | Thresholds datados por ano (dispensa obra 2026 = R$130.984,20) + teste de contrato na ingestão | Governança | S | Médio (anti-bug) |

**Ordem:** P0 fundação (#5, #9, #3) → P1 adoção (#4, #11) → P2 moat (#6, #10) → P3 pós-vitória/jurídico (#7, #8) → dor#1 (#1, #2) quando vault/ToS prontos. Sempre-on: #12.

## 3. Três apostas de MOAT (espaço aberto, vertical-defensável)
1. **Raio-X do Órgão 6m prescritivo para obras** — mercado para em CAPAG/preço-vencedor; ninguém faz perfil comportamental (aditivos/atraso/deserto/deságio/quem habilita).
2. **Recorrer com RAG TCU citado + recurso de mérito** (atestado/BDI/exequibilidade) — LicitaGov faz só impugnação pré-sessão; recurso de mérito fundamentado é terreno vazio. Moat = **confiança verificável** (citação verbatim + guardrail).
3. **Filtro geográfico de mobilização (raio→custo logístico) + verticalização obras** (CAT/BDI/SINAPI/CREA-ART) — inexistente; todos são nacionais e cegos a logística.

## 4. Conclave HYDRA real (Voice DNA congelado dos clones)

**Pergunta:** dor #1 (lances ao vivo, copiloto-de-sessão, dep. conector/vault/ToS + risco PL anti-robô) **vs.** moat prescritivo (Raio-X do Órgão + Recorrer RAG TCU) primeiro?

**⚖️ Marçal Justen Filho** (doutrina Lei 14.133 — princípios: vinculação ao edital, isonomia, *habilitação é teto*, *repressão ao formalismo vazio*, proporcionalidade):
- **Recurso/impugnação automatizado é legítimo** (direito do licitante), DESDE QUE produza *minuta para revisão humana* + disclaimer (não substitui parecer). Os argumentos fortes nascem dos princípios: vencedor que extrapola o **teto de habilitação**, atestado incompatível, exequibilidade/BDI — **não** "formalismo vazio" (que protege o vencedor TAMBÉM; atacar nitpick formal volta contra você).
- **Robô disparador de lances = risco de isonomia** e da natureza do certame. Caminho prudente: **copiloto** (monitora + recomenda preço) e orientar o robô **nativo** do portal. Disclaimer obrigatório.
- **Veredito: B** — o moat prescritivo + recurso de mérito é o exercício *lícito e defensável* de direitos; o robô de lance é o caminho juridicamente mais arriscado.

**🕷️ Pablo Hoffman** (eng. de scraping ético — princípios: legalidade vive no uso, *prefira a API oficial*, separe infra de extração, seja bom cidadão/ToS):
- **Dor #1 (feed de lances ao vivo) não tem API oficial** → exige monitorar **sessão autenticada por portal** (BLL/BNC/PCP/ComprasGov), o pedaço **frágil, ToS-sensível e que quebra** (a página muda). Caro, por-portal, vault.
- **O moat roda em API oficial** (PNCP público + dados abertos TCU) = estável, ético, barato. "Prefira a API oficial" aponta direto pro moat.
- **Veredito: B primeiro** — moat sobre APIs oficiais; dor#1 como fallback-scraping depois, por portal, começando pelo que tem robô nativo (ComprasGov), como copiloto.

**🤝 Síntese (consenso/dissenso/veredito):**
- **CONSENSO independente nos dois → B (moat) primeiro.** Justen: legalmente mais seguro. Pablo: roda em API estável e barata.
- **DISSENSO/tensão:** a dor #1 é a **venda emocional** (onde o cliente sente que perdeu dinheiro). Resolução: entregar dor#1 como **v1 barata** (alerta WhatsApp + deep-link + `deadline-watch` que já existe) — alivia a dor SEM o robô caro/arriscado — enquanto o moat (B) é o diferencial real.
- **BLIND SPOTS:** (a) cobertura furada em município pequeno (TCU 86% inconsistência; <20k hab só obrigatório abr/2027 — bate no raio da ENIAC) → medir cobertura honesta (kill-gate); (b) recurso só de **mérito**, nunca formalismo vazio (Justen); (c) guardrail anti-alucinação inegociável no RAG TCU (jurídico alucina 17-33%, Stanford 2025).
- **VEREDITO: B (moat) primeiro**, com dor#1 como copiloto-v1 barato (alerta+deep-link) em paralelo — não o robô de lances. Sequência: fundação (#5/#9/#3) → moat (#6 Raio-X, #8 Recorrer+RAG com #10 guardrail) → dor#1 copiloto-v2 (ComprasGov primeiro) quando vault/ToS prontos.

## 5. Riscos honestos
- **Não construir robô-disparador externo** (risco TCU/isonomia + PL anti-robô na Câmara). Copiloto + robô nativo do portal.
- **Cobertura estruturalmente furada** no raio (municípios pequenos) → indicador honesto de confiança por município; `coveragePct` já é o trust-gate.
- **"Vai/não-vai" sozinho não é moat** (Effecti/ConLicitação já fazem) — moat está na profundidade prescritiva + Recorrer.
- **Nunca regredir automação / UI lenta** na aba Acompanhar (queixa #1 documentada contra o líder).
- **Deps duras:** vault+ToS por portal (dor#1); backfill PNCP (moat); lista 6m da cliente (kill-gate cobertura); RAG só com guardrail.

---
*Pesquisa: workflow 5 agentes, fontes reais citadas (`tasks/wqjq3jw55`). Conclave: HYDRA real `self-consultation.js` (Justen Filho + Pablo Hoffman, Voice DNA congelado). Re-skin ENIAC (verde/creme/blueprint) aplicado no app real em paralelo (`docs 23` + `Downloads/noyce-eniac-reskin.png`).*
