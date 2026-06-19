# 23 — Pesquisa de Custo Real: Carimbo do Tempo (ACT ICP-Brasil)

**Projeto:** Contador (plataforma fiscal BR)
**Data:** 2026-06-15
**Autor:** Atlas (AIOS Analyst)
**Decisão de arquitetura informada:** Merkle-por-tenant → 1 carimbo ACT por tenant por dia
**Confiança geral:** MÉDIA-ALTA. Um preço público âncora robusto (Prodesp R$ 0,06/carimbo) + confirmação técnica (RFC 4998) + base jurídica sólida (MP 2.200-2 + STJ). Faixa superior fica **sob cotação** (maioria das ACTs não publica tabela).

---

## 1. ACTs credenciadas ICP-Brasil (lista do ITI) que vendem carimbo RFC 3161 via API

Entidades credenciadas como Autoridade de Carimbo do Tempo (ACT) pela AC-Raiz / ITI, todas operando em conformidade com **RFC 3161** (TSQ/TSR) e o perfil ETSI TS 101 861:

| ACT | Credenciamento | Vende via API/programático? | Tabela de preço pública? |
|-----|----------------|-----------------------------|--------------------------|
| **ACT CAIXA** | 24/01/2013 | Sim (institucional) | Não |
| **ACT SERPRO** | 15/10/2013 | **Sim** — API REST documentada (`doc-apitimestamp.estaleiro.serpro.gov.br`), até 200 req/s por SCT, 4 SCTs | Não (sob contrato; "Quero Contratar sou ente privado") |
| **ACT CERTISIGN** | 29/01/2014 | Sim | Não |
| **ACT VALID** | 14/04/2014 | Sim | Não |
| **ACT BRY** | 15/09/2014 | **Sim** — API REST / Bry Cloud, modelo de **créditos** pré-pagos | Não (sob cotação) |
| **ACT QUICKSOFT** | 15/10/2014 | Sim | Não |
| **ACT PRODESP / Imprensa Oficial SP** | (credenciada) | **Sim** — API | **SIM → R$ 0,06 por carimbo/mês** (tabela pública) |
| **ACT ONR** | (credenciada) | Sim | Não |

Revendedores/integradores que embarcam ACT credenciada (não são ACT, mas vendem o carimbo): **Clicksign** (planos Automação/Integração e Advanced, cobrança adicional variável por quantidade/mês), **QualiSign**, **Certclick**.

Fontes: [ITI — Autoridades de Carimbo do Tempo](https://www.gov.br/iti/pt-br/assuntos/icp-brasil/autoridades-de-carimbo-do-tempo) · [PCT SERPRO](https://repositorio.serpro.gov.br/docs/pcactserpro.pdf) · [API Carimbo do Tempo SERPRO](https://doc-apitimestamp.estaleiro.serpro.gov.br/) · [Bry — PSS de ACT](https://www.bry.com.br/bry-pss-de-act) · [Prodesp — Carimbo do Tempo](https://solucoes.prodesp.sp.gov.br/carimbo-do-tempo/)

---

## 2. Modelo de preço

Há três modelos no mercado, e **o preço é por CARIMBO emitido**, não por documento/evento coberto:

1. **Por carimbo / consumo (créditos pré-pagos):** Bry (Bry Cloud, créditos), Serpro (chaves de acesso + contrato). Quanto maior o volume contratado, menor o unitário (desconto por volume é a norma, mas não publicado).
2. **Tarifa unitária pública:** Prodesp = **R$ 0,06 por carimbo/mês** (único preço público encontrado, sem lote mínimo declarado).
3. **Adicional sobre plano SaaS:** Clicksign — carimbo cobrado à parte, "variável por quantidade utilizada por mês", só em planos pagos superiores.

### Faixa de preço por carimbo (triangulação)

- **Piso âncora público:** **R$ 0,06/carimbo** (Prodesp — fonte primária).
- **Faixa de mercado provável (avulso/baixo volume):** R$ 0,30 a R$ 2,00/carimbo nos integradores SaaS (Clicksign etc.), que embutem markup.
- **Atacado / API direta (Serpro, Bry, alto volume):** tende a convergir para **centavos** (R$ 0,05–R$ 0,30) sob contrato de volume — **valor exato fica sob cotação**.

> **Não inventar:** os unitários de Serpro, Bry, Certisign e Valid **não são públicos**. Só a Prodesp publica (R$ 0,06). Os demais exigem cotação.

---

## 3. Validação do design Merkle: custo é por CARIMBO, não por evento

**CONFIRMADO.** O padrão **RFC 4998 (Evidence Record Syntax / ERS)** especifica explicitamente que um grupo de objetos de dado pode ser endereçado por uma **árvore de hash (Merkle)**, e que **o carimbo do tempo é solicitado apenas para o hash da raiz** ("a timestamp is requested only for the root hash of the hash tree"). Cada folha (evento do tenant) mantém **prova de inclusão** individual contra a raiz, sem precisar de carimbo próprio.

Implicação direta para o Contador:
- 1 tenant gera N eventos/dia (lançamentos, classificações, decisões da "trilha de boa-fé").
- Monta-se 1 árvore de Merkle por tenant/dia → **1 único TSQ (carimbo) sobre a raiz**.
- A ACT cobra **1 carimbo**, independentemente de N ser 5 ou 5.000.
- Cada evento fica provado pela `inclusion proof` (caminho de hashes até a raiz carimbada).

**A economia do Merkle é real e estruturalmente correta.** O fator de economia é exatamente N (nº de eventos/dia/tenant).

Fontes: [RFC 4998 — Evidence Record Syntax (IETF)](https://datatracker.ietf.org/doc/html/rfc4998) · base conceitual Merkle aplicada a timestamping notarial ([arXiv 2110.02103](https://arxiv.org/pdf/2110.02103)).

---

## 4. Cálculo de COGS por tenant (carimbo do tempo)

Premissa de design: **1 carimbo/tenant/dia útil** (raiz de Merkle diária). ~22 dias úteis/mês.

| Cenário (R$/carimbo) | Fonte/uso | Carimbos/mês | **COGS mensal/tenant** | COGS/ano/tenant |
|----------------------|-----------|--------------|------------------------|-----------------|
| **R$ 0,06** | Prodesp (público) | 22 | **R$ 1,32** | R$ 15,84 |
| R$ 0,15 | atacado provável API | 22 | R$ 3,30 | R$ 39,60 |
| R$ 0,30 | piso integrador SaaS | 22 | R$ 6,60 | R$ 79,20 |
| R$ 1,00 | avulso/baixo volume | 22 | R$ 22,00 | R$ 264,00 |
| R$ 2,00 | teto avulso SaaS | 22 | R$ 44,00 | R$ 528,00 |

**Leitura para pricing:** no cenário-base (Prodesp R$ 0,06 ou atacado de centavos), o carimbo do tempo é **custo desprezível** na COGS por-tenant — entre **R$ 1,32 e R$ 6,60/mês**. Mesmo no pior caso avulso (R$ 2,00), são R$ 44/mês — e esse cenário é justamente o que o Merkle-por-dia evita (não escala com volume de eventos).

> **Sensibilidade crítica:** o que mata o custo NÃO é o preço unitário, é a **granularidade**. Carimbar por evento (em vez de por raiz diária) multiplicaria a COGS por N (centenas a milhares). O design Merkle-por-tenant/dia é o que mantém a COGS plana e previsível — confirma a decisão de arquitetura. Liga ao aprendizado do Noyce (captura SELETIVA por causa de COGS R$6,35/CNPJ quebrar pricing flat): mesma lição de "granularidade define COGS".

---

## 5. Validade jurídica (valor probatório)

**CONFIRMADO.** O carimbo do tempo emitido por ACT credenciada ICP-Brasil, em conformidade com RFC 3161, tem **valor probatório pleno** no Brasil:

- **MP 2.200-2/2001** instituiu a ICP-Brasil e confere validade jurídica/presunção de autenticidade e integridade a documentos eletrônicos no âmbito da infraestrutura — fundamento legal do carimbo do tempo qualificado.
- **Jurisprudência STJ — REsp 1.495.920/DF** valida hash + carimbo do tempo como prova robusta em disputas (data e integridade).
- Efeito prático: o carimbo prova que o conteúdo **existia naquela data/hora** e que **não foi alterado depois** (qualquer modificação quebra o hash registrado). Isso torna irrelevante a discussão sobre a data — exatamente o que a "trilha de boa-fé" do tenant precisa demonstrar perante fisco/judiciário.

Fontes: [Bry — MP 2.200-2/2001](https://www.bry.com.br/blog/medida-provisoria-2-200-2-2001/) · [Bry — o que o carimbo prova](https://www.bry.com.br/blog/carimbo-do-tempo-o-que-prova) · [PCT Prodesp (ACT)](https://certificadodigital.imprensaoficial.com.br/media/files/act_prodesp_pct.pdf)

---

## 6. ACTs recomendadas para cotar + o que ficou sob cotação

**Cotar (em ordem de prioridade para o caso Contador):**

1. **Serpro** — API REST madura e documentada, capacidade alta (200 req/s × 4 SCTs), contrato ente privado direto, credibilidade governo. Cotar volume baixo (1 carimbo/tenant/dia) e descontos por faixa. **Preço sob cotação.**
2. **Bry** — API/Bry Cloud, modelo de créditos pré-pagos flexível para SaaS multi-tenant, foco em desenvolvedor. **Preço sob cotação.**
3. **Prodesp** — único com preço público (**R$ 0,06/carimbo/mês**) — usar como âncora de negociação com os demais; confirmar se há lote mínimo e SLA de API.
4. **Valid / Certisign** — alternativas ICP-Brasil consolidadas; cotar como benchmark.

**O que ficou explicitamente SOB COTAÇÃO (não público):**
- Unitário de Serpro, Bry, Valid, Certisign, Quicksoft.
- Descontos por volume / faixas de lote.
- Eventual taxa de adesão/mensalidade mínima por integrador.
- Limites de throughput contratuais por tier.

**Recomendação:** ancorar a COGS de planejamento em **R$ 0,06–R$ 0,30/carimbo** (centavos), pedir cotação formal a Serpro e Bry com o perfil "1 carimbo/tenant/dia útil × Y tenants", e travar o número antes do primeiro cliente pago.

---

## Fontes

- [ITI — Autoridades de Carimbo do Tempo (lista oficial)](https://www.gov.br/iti/pt-br/assuntos/icp-brasil/autoridades-de-carimbo-do-tempo)
- [ITI — Resolução 61 (ACTs ICP-Brasil)](https://repositorio.iti.gov.br/resolucoes/Resolucao61_revogada.htm)
- [Prodesp — Carimbo do Tempo (preço R$ 0,06)](https://solucoes.prodesp.sp.gov.br/carimbo-do-tempo/)
- [PCT Prodesp (ACT) — política](https://certificadodigital.imprensaoficial.com.br/media/files/act_prodesp_pct.pdf)
- [SERPRO — API Carimbo do Tempo (doc)](https://doc-apitimestamp.estaleiro.serpro.gov.br/)
- [PCT SERPRO](https://repositorio.serpro.gov.br/docs/pcactserpro.pdf)
- [Bry — PSS de ACT](https://www.bry.com.br/bry-pss-de-act)
- [Bry — integrar carimbo do tempo (API)](https://www.bry.com.br/blog/integrar-carimbo-do-tempo/)
- [Clicksign — carimbo do tempo (contratação/cobrança)](https://ajuda.clicksign.com/article/1019-carimbo-do-tempo)
- [RFC 4998 — Evidence Record Syntax (Merkle root timestamping)](https://datatracker.ietf.org/doc/html/rfc4998)
- [Bry — MP 2.200-2/2001](https://www.bry.com.br/blog/medida-provisoria-2-200-2-2001/)
- [Bry — o que o carimbo do tempo prova](https://www.bry.com.br/blog/carimbo-do-tempo-o-que-prova)
</content>
</invoke>
