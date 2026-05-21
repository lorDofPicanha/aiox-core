# Spike Técnico — Stage 2 (Analisar 6 meses) + Cobertura de Dados

**Data:** 2026-05-20 · **Status:** SPIKE / KILL-GATE
**Origem:** roadmap de spikes (`00-spikes-roadmap`) — Stage 2 é o **moat** e o **kill-gate** do projeto.
**Objetivo:** validar se conseguimos reconstruir o histórico de 6 meses de um órgão (quem venceu, por quanto, com que recorrência) para os órgãos do raio — e medir a **cobertura real** dos dados (federal vs municipal/estadual), porque o moat morre se os dados tiverem buracos.

---

## 1. Pergunta de de-risking
> Para os órgãos dentro do raio de 500km (maioria municipal/estadual), conseguimos o **desfecho** das licitações dos últimos 6 meses — fornecedor vencedor, valor, recorrência — com cobertura suficiente para uma síntese prescritiva (Stage 3) confiável? Se não, **mata-se ou pivota o projeto** aqui (barato).

## 2. Achados verificados AO VIVO (20/Mai)

### ✅ O desfecho EXISTE — e inclui municipal/estadual
O endpoint **`/api/consulta/v1/contratos`** retorna o resultado real de cada contrato. Campos confirmados num registro real:
- `nomeRazaoSocialFornecedor` + `niFornecedor` (CNPJ do **vencedor**)
- `valorGlobal` / `valorInicial` (**preço**)
- `orgaoEntidade` + `unidadeOrgao.ufSigla` + **`unidadeOrgao.municipioNome`** (geo!)
- `objetoContrato`, `dataAssinatura`, `categoriaProcesso`
- `numeroControlePncpCompra` → **liga o contrato de volta à compra/licitação de origem** (dá pra juntar "órgão rodou pregão X → fornecedor Y venceu a R$ Z")

Exemplo real retornado: *"MUNICIPIO DE CAMPO ALEGRE / SC — GAMA PNEUS (CNPJ 55623647000161) — R$ 5.606 — Pneus, Lei 14.133"*. ⇒ **dados de município pequeno estão lá.** Isso **derruba o medo anterior** ("OCDS só federal" → o `/contratos` do PNCP é mais amplo que o OCDS).

### ⚠️ Mas há 2 limitações duras (verificadas)
1. **Sem filtro geo no servidor.** `uf=GO` e `codigoMunicipioIbge=...` foram **ignorados** — `totalRegistros` continuou **177.714 (fev/2026 nacional)**, amostra SC. ⇒ pra pegar o raio, é **paginar nacional + filtrar por `municipioNome`/UF do nosso lado**, OU usar os **dumps de Dados Abertos** (melhor pra backfill).
2. **Volume:** ~**177 mil contratos/mês** nacional ⇒ ~1M+ em 6 meses. É **job de lote**, não chamada interativa.

## 3. A questão REAL de cobertura (o que medir)
O desfecho existe na estrutura — a dúvida que decide o moat é **completude de publicação**: *que % das licitações dos órgãos do raio realmente tem contrato publicado no PNCP nos últimos 6 meses?*
- Publicar no PNCP é obrigatório (Lei 14.133), mas a adesão **rampou de 2021 a 2023** e **municípios pequenos podem subnotificar**.
- Buracos típicos: licitação homologada mas contrato ainda não assinado/publicado; órgão que publica edital (`/contratacoes`) mas não o contrato (`/contratos`); atraso entre homologação e publicação do contrato.

### Experimento de cobertura (concreto)
1. **Bulk-load** 6 meses de `/contratos` (paginando ou via Dados Abertos) → filtrar por `municipioNome ∈ 444 municípios do raio` (reusar a lista do `radius-municipios.py`).
2. Para os mesmos órgãos, puxar `/contratacoes/publicacao` (editais) no período.
3. Calcular **razão de completude por órgão** = contratos publicados ÷ licitações publicadas. Mapear onde cai (município pequeno? esfera? modalidade dispensa?).
4. **Spot-check com a cliente:** pegar as licitações reais que ELA participou nos últimos 6 meses e verificar se o desfecho aparece no PNCP (ground truth real).

**Saída:** um número honesto de cobertura por faixa (federal / estadual GO / municipal grande / municipal pequeno) → decide se o moat se sustenta no raio dela.

## 4. Arquitetura proposta
```
[A] BULK HISTÓRICO (1×, depois incremental)
    Dados Abertos / paginação /contratos (6m) → filtro municipioNome ∈ raio
    + /contratacoes (editais) + /atas (registro de preços)
        ↓
[B] STORE "HISTÓRICO DO ÓRGÃO" (Postgres)
    join contrato ⇄ compra (numeroControlePncpCompra)
    → por órgão: vencedores, distribuição de preço, recorrência,
      fornecedores repetidos, frequência de compra, sazonalidade
        ↓
[C] VIEWS DE ANÁLISE (alimentam Stage 3)
    "neste órgão, objeto X: preço mediano R$, vencedor recorrente Y,
     N concorrentes típicos, janela de recompra ~Z meses"
        ↓
[D] EVAL OFFLINE (KILL-GATE) ← roda contra 6m reais da cliente
```

## 5. Eval offline = o KILL-GATE (Cassie-style)
Rodar Stage 2+3 retroativamente contra os últimos 6 meses **reais** da cliente:
- **MAPE de preço > 15%** (a previsão de preço-alvo erra muito) → **KILL/PIVOT**
- **hit-rate de vencedor < 50%** (não acerta quem tende a ganhar) → **KILL/PIVOT**
- **cobertura < 50%** dos órgãos-alvo dela com histórico utilizável → **PIVOT** (mudar escopo de fontes/raio)

> Este eval é **pré-Sprint 4** e **barato** — roda sobre dados já públicos, sem construir o produto inteiro. É o melhor dinheiro de de-risking do projeto.

## 6. Riscos
| Risco | Sev. | Mitigação |
|---|---|---|
| **Completude baixa em município pequeno** | 🔴 (mata moat no raio) | Medir antes (experimento §3); se baixa, focar órgãos de maior completude (estadual/grandes) |
| Contrato publica com atraso vs homologação | 🟡 | Cruzar com `/contratacoes` + atas; aceitar defasagem no histórico (não é tempo real) |
| Sem filtro geo → paginar 1M+ registros | 🟡 | Usar dumps Dados Abertos; job de lote noturno; cache; incremental por `dataAtualizacao` |
| Dedup compra⇄contrato⇄ata | 🟡 | Chave `numeroControlePncpCompra`; idempotência (Kleppmann/Werner) |
| OCDS (alternativa) é só federal | 🟢 | Não usar OCDS pro raio; usar `/contratos` + Dados Abertos PNCP (incluem municipal) |

## 7. Dependências
- **Lista dos órgãos-alvo reais da cliente** (pra spot-check de ground truth) — discovery call.
- Lista dos **444 municípios** do raio (já temos — `radius-municipios.py`).
- **D1** (UFs cadastradas) afina o universo.

## 8. Recomendação
1. **Rodar o experimento de cobertura (§3) PRIMEIRO** — antes de qualquer outro spike de build. É barato (dados públicos) e responde a pergunta que decide o projeto.
2. Se cobertura ≥ ~50-60% nos órgãos dela → construir [A]→[D] e seguir o roadmap.
3. Se cobertura ruim → **pivotar** (focar fontes/esferas com bom dado, ou repensar o moat de "análise histórica" para outro diferencial — ex.: habilitação/recurso, que não dependem tanto de histórico).
4. **Não construir Stage 3 (síntese) antes do eval offline passar.**

---
**Verificações ao vivo (20/Mai):**
- `/api/consulta/v1/contratos` — devolve fornecedor+CNPJ+valor+município/UF+link à compra; 177.714 contratos só em fev/2026; **sem filtro geo no servidor** (uf/município ignorados).
- Confronto com `/contratacoes/publicacao` (editais) e `/atas` para a razão de completude.

*Spike por aios-master. Ancorado em sondagem real da API PNCP + metodologia de kill-gate (eval offline retroativo).*
