# Spike Técnico — Stage 1 (Monitorar) + Descoberta no raio de 500km

**Data:** 2026-05-20 · **Status:** SPIKE (de-risking)
**Origem:** pesquisa de acesso ao PNCP (CONTEXT §10.2.1, verificada ao vivo) + DNA Pablo Hoffman + levantamento de 444 municípios.
**Objetivo:** definir como descobrir editais relevantes no raio (multi-estado) de forma confiável e barata, dado que não há webhook.

---

## 1. Pergunta de de-risking
> Como capturar, perto do tempo real, os editais dentro do raio de 500km (DF+GO+oeste MG+sul TO+bordas), filtrando o firehose de ~450-600 contratações/dia até os ~poucos relevantes por dia da cliente — sem webhook e sem martelar as APIs?

## 2. Achados verificados ao vivo (20/Mai)
- **2 APIs públicas sem auth:** Consulta (firehose por data+modalidade+**UF**) e Integração (`/orgaos` dump ~45MB do registro de órgãos; `/orgaos/{cnpj}`; PDF do edital direto).
- **Filtro geo mais fino na API = UF.** Distância (raio) é **lógica nossa**, não da API.
- **Sem webhook em lugar nenhum** → polling adaptativo.
- **OCDS/Dados Abertos = lote** (bom p/ histórico, não p/ tempo real; e é só federal).
- **Gap D+0/D+1:** entre publicação no diário oficial e indexação no PNCP → cobrir com **Querido Diário** (raspagem de diários, okfn-brasil) nas fontes críticas.

## 3. Arquitetura proposta (filtrar-antes-de-parsear — Werner)

```
[A] CADASTRO DE ÓRGÃOS NO RAIO (1×/semana)
    dump /api/pncp/v1/orgaos (~45MB) → match CNPJ→município IBGE→haversine(≤500km)
    → tabela orgaos_no_raio (CNPJ + município + UF + esfera)   [feature D6]
        ↓ alimenta o filtro
[B] POLLING DE DESCOBERTA (adaptativo)
    Consulta /contratacoes/publicacao por UF (DF,GO,MG,TO,MT,BA,SP) + modalidade
    → FILTRO 1 (barato): órgão ∈ orgaos_no_raio?  (corta MG/TO/MT/BA/SP fora do raio)
    → FILTRO 2 (barato): CNAE/objeto/valor casam com perfil da cliente?
        ↓ só os que passam
[C] PARSING CARO (LLM/Docling) só nos matches  ←  controla custo
    baixa PDF via /orgaos/{cnpj}/compras/{ano}/{seq}/arquivos/{n}
        ↓
[D] PUSH <15min (WhatsApp/email) dos editais relevantes
[+] QUERIDO DIÁRIO em paralelo cobre o gap D+0 nas fontes críticas
```

**Por que filtrar em 2 camadas antes do LLM:** o firehose é grande, mas o filtro órgão-no-raio + CNAE corta >95% antes de qualquer parsing caro. O LLM só toca o que importa (Werner: custo de LLM é o vilão, não o volume).

## 4. Cadência de polling (sem webhook)
| Janela | Cadência | Racional |
|---|---|---|
| Horário comercial | a cada 5-10 min | publicação concentra-se de dia |
| Madrugada/fim de semana | a cada 30-60 min | baixa publicação |
| Querido Diário (fontes críticas) | 1×/dia (manhã) | diários saem cedo; cobre gap D+0 |
| Dump de órgãos | 1×/semana | registro muda devagar |

## 5. PoC (escopo mínimo)
**Hipótese:** conseguimos, num dia real, listar os editais do raio relevantes para a cliente com precisão útil e custo de LLM baixo.
1. Construir tabela `orgaos_no_raio` a partir do dump (reusar `scripts/radius-municipios.py` + match por CNPJ).
2. Poller da Consulta por UF + Filtro 1 (raio) + Filtro 2 (CNAE/keywords da cliente).
3. Parse de 1 edital real (Docling) só para os matches.
4. Medir: nº bruto/dia → nº pós-filtro → nº relevante; custo LLM/dia; lag médio.

**Sucesso:** recall dos relevantes ≥ 90% (vs. checagem manual da cliente num dia), custo LLM/dia < R$X (definir), lag < 24h (PNCP) e < 12h (Querido Diário nas críticas).
**Kill/pivot:** se pós-filtro ainda for grande demais p/ parsear barato → endurecer Filtro 2 (perfil mais estrito) antes de escalar.

## 6. Riscos
| Risco | Sev. | Mitigação |
|---|---|---|
| Gap D+0/D+1 perde edital de prazo curto (dispensa!) | 🔴 | Querido Diário nas fontes críticas; alerta de "prazo curto" |
| Custo de LLM explode no firehose | 🟡 | Filtrar-antes-de-parsear (2 camadas); só match → LLM |
| Match CNPJ→município incompleto (órgão sem município claro) | 🟡 | Fallback por UF + revisão manual da borda |
| Rate-limit/instabilidade do PNCP (visto ao vivo: HTTP 000 intermitente) | 🟡 | Backoff/jitter (Pablo AutoThrottle); cache; retries idempotentes |
| OCDS não cobre municipal/estadual | 🟢 | Usar OCDS só p/ histórico federal; descoberta via Consulta/Integração |

## 7. Dependências
- **D6** (raio fixo vs configurável) — afeta a tabela `orgaos_no_raio`.
- Perfil da cliente (CNAE/keywords/valor) para o Filtro 2 — discovery call.
- Lista de "fontes críticas" para Querido Diário (quais diários: DODF, DOE-GO, municipais).

## 8. Recomendação
**Construir:** [A] cadastro de órgãos no raio (reusa o script de haversine) + [B] poller com filtro 2-camadas + [C] parsing sob demanda. Tudo barato e nosso.
**Reusar:** OCDS/Dados Abertos para o histórico (Stage 2), não para descoberta.
**Validar com PoC** de 1 dia real antes de escalar o LLM.

---
*Spike conduzido por aios-master. Ancorado em verificação ao vivo das APIs PNCP + DNA Pablo Hoffman (filtrar-antes-de-parsear, AutoThrottle, breakage).*
