# 55 — Feature Research · MOTOR DE RECONHECIMENTO / PARSER de documentos fiscais

> Pesquisa de **fontes primárias** (esquemas oficiais SEFAZ/Receita/CGNFS-e, docs de API dos provedores de Document AI, central de ajuda dos players BR) para especificar o **motor que lê o arquivo e identifica campos/dados automaticamente** — a dependência crítica das automações que o founder destacou na reunião com o Renan (22/Jun/2026).
> **Data:** 2026-06-24 · **Autor:** Atlas (analyst) · **Base:** `00-context/CONTEXT.md`, `01-captura.md` (complementar), `20-arquitetura-core-v1.1.md` (§3.6 duas classes de insumo).
> **Método:** web real, fontes primárias, sem channeling de clones (`feedback_no_hydra_style`). Onde não confirmei na fonte → **"não encontrado"**. Cada afirmação relevante tem URL (ver §8).
> **Escopo:** o MOTOR DE RECONHECIMENTO — parsing de XML fiscal (determinístico) + OCR/Document AI/LLM para PDFs/imagens não-estruturados + identificação de tipo + dedup + validação de schema. Distinto do doc `01-captura` (que cobre *como o arquivo chega*: NSU, manifestação, providers). Este doc cobre *o que acontece depois que o arquivo chegou*.

---

## 0. TL;DR (leia isto)

1. **São dois motores, não um.** O reconhecimento fiscal se divide em (a) **parsing determinístico de XML** — onde a precisão é 100% porque o layout é oficial e validável por XSD, e (b) **extração probabilística de PDF/imagem** — onde a precisão é ~94-98% e exige confiança calibrada. **Misturar os dois numa caixa-preta única é o erro de arquitetura.** A própria arquitetura v1.1 (§3.6) já antecipa isso com "duas classes de qualidade de insumo".

2. **Para nota fiscal eletrônica, OCR é o caminho ERRADO.** A NF-e/NFC-e/CT-e/NFS-e nascem em XML estruturado e validável contra esquema oficial (XSD). Para esses, o motor é um **parser de XML + validação de schema** — barato, determinístico, auditável. OCR só entra para documentos que **não têm XML**: DANFE escaneado de fornecedor que não mandou o XML, recibos, guias (DARF/DAS/GPS), contratos. Não confundir os mundos.

3. **A NFS-e Nacional 2026 transforma o problema mais difícil de parsing em problema fácil.** O inferno dos ~15 layouts municipais (que matou a ferramenta antiga — CONTEXT §7) está sendo **padronizado num XSD único nacional** (NT 007/2026, XSD publicado 12/02/2026; NT 008/2026 padroniza o DANFSe). A janela é **nascer já parseando o leiaute nacional** com os novos grupos IBS/CBS — em vez de manter 15 parsers municipais frágeis.

4. **A decisão LGPD mais importante deste doc:** **Amazon Textract NÃO está disponível em sa-east-1 (São Paulo)** e o **Google Document AI não oferece residência de dados no Brasil** (só US/EU). O **Azure AI Document Intelligence TEM residência single-region no Brazil South (São Paulo)**. Para um produto que processa documento fiscal de terceiros vendido a contador, **manter o processamento dentro do Brasil é argumento de venda e mitigação LGPD** (CONTEXT §5.2). → **Azure Document Intelligence é o provider de Document AI recomendado por residência**, com LLM-vision multimodal como fallback/segunda passada (preferencialmente via endpoint regional BR).

5. **O motor já existe pela metade.** O **Documentize** (módulo do Gestorize herdado) já faz upload + extração de texto/coordenadas + **hash perceptual** + dedup + identificação de tipo + ciclo de feedback (`DocumentFeedback`). Isso é o **andaime do motor de PDF**. O gap NÃO é "começar do zero" — é (a) ligar o parser de XML determinístico (que pode nem existir ainda como motor de produção), (b) trocar a extração genérica do Documentize por um Document AI com **confiança por campo**, e (c) ligar a saída do reconhecimento à **trilha de boa-fé** (o moat).

6. **Nosso diferencial não é "reconhecer melhor" (commodity ~97%).** É **reconhecer com confiança calibrada por campo, com a classe do insumo (XML vs extraído) gravada na trilha**, de modo que o laudo de auditoria declara *com que qualidade de evidência* cada apontamento foi sustentado. Ninguém no mercado liga extração → defensabilidade. Esse é o elo que falta.

---

## 1. Os dois motores (a distinção que organiza tudo)

| | **Motor A — Parser de XML fiscal** | **Motor B — Extração de PDF/imagem (Document AI)** |
|---|---|---|
| **Entra** | XML de NF-e, NFC-e, CT-e, MDF-e, NFS-e Nacional, eventos | DANFE/DANFSe escaneado, recibo, DARF/DAS/GPS, contrato, planilha |
| **Natureza** | **Determinística** — layout oficial, validável por XSD | **Probabilística** — modelo de ML/visão extrai campos |
| **Precisão** | 100% (se o XML é válido) | ~94-98% (estado da arte 2026) — exige revisão |
| **Confiança** | Binária (válido/inválido contra XSD) | **Calibrada por campo** (score 0-1 por campo) |
| **Custo** | ~zero (CPU, sem API externa) | ~R$0,05-0,10/página (Document AI) ou tokens (LLM) |
| **LGPD** | 100% interno, dado não sai | **Risco** — dado pode sair do Brasil dependendo do provider |
| **Quando usar** | Sempre que houver XML (preferir) | Só quando NÃO há XML (fallback) |
| **Já temos?** | 🟡 parcial (modelo de domínio sim; motor de produção a confirmar) | 🟡 Documentize faz extração genérica + hash + dedup |

> **Regra de ouro do motor:** *XML primeiro, sempre.* Se a nota tem XML, nunca passar por OCR. OCR é a segunda classe de insumo (§3.6 da arquitetura) — entra só para preencher a lacuna do que não veio estruturado. Isso minimiza custo, maximiza precisão e reduz superfície LGPD.

---

## 2. Motor A — Parsing de XML fiscal (determinístico)

### 2.1 Onde estão os esquemas oficiais (fontes primárias)

Os esquemas (XSD) e os Manuais de Orientação ao Contribuinte (MOC) são públicos e versionados. **O motor parseia contra esses XSD — não contra "achismo".**

| Documento | Schema/Manual oficial | Onde baixar |
|---|---|---|
| **NF-e (mod. 55) / NFC-e (mod. 65)** | MOC v7.0 + Esquemas XML (pacote de release) | Portal NF-e: `nfe.fazenda.gov.br` → Esquemas XML; espelho SVRS `dfe-portal.svrs.rs.gov.br/NFe/Documentos` |
| **CT-e (mod. 57) / CT-e OS** | MOC CT-e + XSD | Portal CT-e / SVRS `dfe-portal.svrs.rs.gov.br` |
| **MDF-e (mod. 58)** | MOC MDF-e + XSD | SVRS |
| **NFCom (mod. 62)** | MOC NFCom 1.00a — Anexo I Leiaute e Regras de Validação | SVRS `dfe-portal.svrs.rs.gov.br/Nfcom/Documentos` |
| **NF3e (mod. 66, energia)** | MOC NF3e + XSD | SVRS `dfe-portal.svrs.rs.gov.br/Nf3e/Documentos` |
| **NFS-e Nacional** | Leiaute + Esquemas XSD (NT 007/2026 publicado 12/02/2026) | Portal CGNFS-e: `gov.br/nfse` → Biblioteca → Documentação Técnica |

### 2.2 Campos-chave que o parser PRECISA extrair (para auditoria e recuperação)

O motor não é "ler o XML inteiro" — é **mapear os campos que alimentam a Auditoria (cClassTrib/NCM) e a Recuperação (PIS/COFINS monofásico)**. Por item (`det`):

| Campo XML | Tag (NF-e) | Para quê |
|---|---|---|
| **NCM** | `prod/NCM` | Base da classificação; chave do monofásico e do cClassTrib |
| **CFOP** | `prod/CFOP` | Natureza da operação (entrada/saída, dentro/fora UF) |
| **CST / CSOSN** | `imposto/ICMS//CST` ou `CSOSN` | Regime tributário do item (Simples usa CSOSN) |
| **CST PIS / COFINS** | `imposto/PIS//CST`, `COFINS//CST` | **Identifica monofásico** (CST 04/05/06 etc.) → gancho da Recuperação |
| **Valores PIS/COFINS** | `vPIS`, `vCOFINS`, `vBC`, `pPIS`, `pCOFINS` | Cálculo do crédito recuperável |
| **cClassTrib** | grupo IBS/CBS (novos leiautes 2026) | **Base da Auditoria da Reforma** (o diferencial) |
| **Chave de acesso** | `infNFe Id` (44 dígitos) | Identidade única; dedup; trilha |
| **vProd / vNF** | `total/ICMSTot` | Materialidade do apontamento |
| **emit/dest CNPJ** | `emit/CNPJ`, `dest/CNPJ` | Classificação compra/venda (papel do tenant) |

> **Por que isso é dependência crítica das automações (a fala do founder):** a Auditoria compara `cClassTrib`/NCM aplicado vs base de referência; a Recuperação identifica itens com CST PIS/COFINS monofásico. **Nenhuma das duas automações roda se o parser não tiver extraído esses campos de forma confiável e estruturada.** O reconhecimento é o pré-processador de todo o resto.

### 2.3 Validação de schema (o passo que separa parser de "regex frágil")

- **Validar o XML contra o XSD oficial** antes de extrair → rejeita arquivo corrompido/adulterado e dá garantia determinística.
- **Verificar assinatura digital** do XML (XMLDSig) → o documento é autêntico e íntegro (ICP-Brasil). Isso já vira **proveniência para a trilha de boa-fé**.
- **Conferir cStat / status de evento** → não escriturar nota cancelada/denegada (liga ao T7 da captura).
- A NFS-e Nacional agora tem **chave de acesso própria** e XSD nacional → validável como os demais DF-e (antes, cada município era um inferno à parte).

### 2.4 A mudança da NFS-e Nacional (NT 007 e 008/2026) — o que muda no parser

- **NT 007/2026** (XSD publicado 12/02/2026): inclui os **grupos IBS/CBS** (grupo `IBSCBS`) alinhados à LC 214/2025 e **corrige a declaração de PIS/COFINS retido** (antes misturado em `vPis`/`vCofins`, causando redução indevida da base IBS/CBS). → **O parser de NFS-e precisa ler os novos grupos**, senão a Auditoria da Reforma fica cega em serviços.
- **NT 008/2026**: novo padrão técnico do **DANFSe** + **descontinua a API gov de geração do DANFSe em 01/07/2026** (CONTEXT §9). → impacto no Emissor (doc 04), não no parser de entrada, mas confirma o churn de infra oficial.
- **Implicação estratégica:** o que matou a ferramenta antiga (15 layouts municipais) **vira table-stake fácil** — um XSD nacional. **Nascer parseando o leiaute nacional** = surfar a padronização (CONTEXT §7, dead-end resolvido).

---

## 3. Motor B — Extração de PDF/imagem (Document AI / OCR / LLM-vision)

### 3.1 Estado da arte 2026 (fontes primárias)

Para o que **não tem XML** (DANFE escaneado, recibo, guia, contrato), as opções:

| Opção | Tipo | Precisão (campo, invoice) | Custo | Residência BR? |
|---|---|---|---|---|
| **AWS Textract** (Analyze Expense) | OCR + extração estruturada | ~94,2% | **US$0,01/pág** (1ª milhão) | 🔴 **NÃO — indisponível em sa-east-1** |
| **Google Document AI** (Invoice Parser) | Document AI | ~95,8% | ~US$0,01/pág (US$0,10/10pg) | 🔴 **NÃO — residência só US/EU** |
| **Azure AI Document Intelligence** | Document AI (prebuilt + custom) | forte em layout/tabela/line-item | ~tier R$/mês por volume; commit 1M pág US$530/mês | 🟢 **SIM — Brazil South (São Paulo), single-region** |
| **LLM-vision (Claude / GPT-4o)** | Multimodal → JSON | **97,6% (Claude) / 95,2% (GPT-4o)** | por token (mais caro/doc) | 🟡 depende do endpoint (preferir regional/DPA BR) |
| **Open: LayoutLMv3 / Donut** | self-hosted, fine-tune | LayoutLMv3 fine-tuned ~92%; Donut competitivo | infra própria (sem custo/pág) | 🟢 100% interno se self-hosted |

### 3.2 Trade-offs (custo × precisão × LGPD)

- **Precisão:** LLM-vision multimodal (Claude/GPT-4o) **lidera em extração estruturada de campo** (~97-98%) e é mais robusto a layouts variáveis que OCR clássico. Document AI dedicado (Azure/Google) é forte e mais barato por página em volume. OCR puro (Textract raw) exige construir a lógica de extração por cima.
- **Custo:** Document AI ~R$0,05-0,10/página em volume; LLM-vision custa mais por documento (tokens), mas elimina o trabalho de mapeamento de campo. Para baixo volume e documentos heterogêneos (recibos, contratos), **LLM-vision com saída JSON estruturada** é pragmático. Para alto volume de um mesmo tipo (DANFE), **Document AI dedicado** ganha em custo.
- **LGPD (o fator decisivo):** documento fiscal de terceiros contém dado pessoal (CPF/CNPJ, valores, partes). CONTEXT §5.2: **LGPD by design**. Enviar isso para um provider que processa fora do Brasil é transferência internacional — exige base legal e amplia o risco contratual. **Textract (sem sa-east-1) e Google Document AI (sem residência BR) ficam em desvantagem.** **Azure Document Intelligence com Brazil South** mantém o processamento no país. **Self-hosted (LayoutLMv3/Donut)** elimina o problema, ao custo de operar infra de ML.

### 3.3 Recomendação do Motor B

1. **Provider primário: Azure AI Document Intelligence (região Brazil South)** — residência BR + força em line-item/tabela (DANFE tem tabela de itens). Resolve LGPD por design.
2. **Segunda passada / fallback: LLM-vision (Claude via endpoint com DPA, ou Azure OpenAI Brazil South)** para documentos heterogêneos (recibos, contratos) onde o Document AI dedicado não tem prebuilt. Saída sempre **JSON estruturado com score de confiança por campo**.
3. **Não construir self-hosted (LayoutLMv3/Donut) na v1** — é o componente de maior custo operacional (treino, GPU, MLOps) e CONTEXT §7 já marca "fine-tune próprio" como dead-end até saturar o golden-set. Reavaliar só se COGS do provider matar a margem em escala.
4. **Reaproveitar o Documentize** como camada de ingestão/coordenadas/dedup/hash perceptual por cima do provider escolhido (§5).

---

## 4. Como os MELHORES fazem reconhecimento (players BR — fonte primária)

| Player | O que faz no reconhecimento | URL (fonte) |
|---|---|---|
| **Qive (ex-Arquivei)** | **OCR para padronização de NFS-e** (converte DANFSe/PDF municipal em dado padronizado); educa mercado sobre OCR | `ajuda.qive.com.br/.../ocr-para-padronizacao-de-nfses`; `qive.com.br/blog/ocr` |
| **e-Auditoria** | **OCR PDF→XML** dentro da captura multicanal (A1/A3 + RPA + e-mail + OCR); "captura mesmo sem XML" | `e-auditoria.com.br/blog/captura-de-nfe-...` (doc 01) |
| **Oobj** | Documenta uso de **OCR + IA para NFS-e** explicitamente | `oobj.com.br/bc/ocr-inteligencia-artificial-nfse/` |
| **IDP Document / Nota Gateway / Homine** | Soluções IDP (Intelligent Document Processing) — OCR + LLM, precisão declarada >97% | `idpdoc.com`, `notagateway.com.br`, `homine.tech` |
| **SIEG / Tecnospeed / PlugNotas** | Captura/parsing de XML como infra (providers); foco no XML estruturado, não OCR | doc 01 |
| **Nuvem Fiscal** | 🪦 **descontinuada 31/07/2026** — não usar (CONTEXT §9) | `nuvemfiscal.com.br/suporte/` |
| **Documentize / Gestorize** (nosso herdado) | Upload PDF/imagem + **extração de texto/coordenadas + hash perceptual + dedup + identificação de tipo + `DocumentFeedback`** | herdado (CONTEXT §3) |

**Leitura:** o padrão de mercado é **OCR/IDP para o que não tem XML** (especialmente NFS-e municipal antiga) e **parsing de XML para o resto**. **Ninguém liga o reconhecimento à defensabilidade jurídica** — todos param em "extraí o dado". É exatamente o nosso whitespace (§6).

---

## 5. TABLE-STAKES do motor × o que o Documentize já faz × gap × buy-vs-build

| # | Capacidade do motor | Mercado (table-stake?) | Documentize já faz? | Gap | Buy vs Build |
|---|---|:--:|:--:|---|---|
| **M1** | **Parser de XML NF-e/NFC-e válido contra XSD** | ✅ inegociável | 🟡 modelo de domínio sim; motor de produção a confirmar | Ligar parser determinístico + validação XSD | **BUILD** (determinístico, barato, é o nosso core) |
| **M2** | **Parser CT-e / MDF-e** | ✅ | ❌ | Adicionar XSD CT-e/MDF-e | **BUILD** |
| **M3** | **Parser NFS-e Nacional (leiaute nacional + grupos IBS/CBS)** | ✅ (a partir de 2026) | ❌ | Implementar XSD nacional NT 007 | **BUILD** (surfar padronização; barato vs 15 municipais) |
| **M4** | **Validação de schema + assinatura digital (XMLDSig)** | ✅ | ❌ | Validar XSD + verificar assinatura ICP | **BUILD** (vira proveniência da trilha) |
| **M5** | **Identificação automática de tipo de documento** | ✅ | ✅ (Documentize identifica tipo) | Estender p/ novos tipos | **REUSE Documentize** |
| **M6** | **OCR/extração de PDF/imagem (sem XML)** | ✅ (e-Auditoria/Qive/Oobj) | 🟡 extração genérica de texto+coordenadas | Trocar por Document AI c/ confiança por campo | **BUY** (Azure Doc Intelligence BR South) |
| **M7** | **Extração estruturada de campos com confiança por campo** | 🟡 (poucos têm calibrada) | ❌ (extração sem score calibrado) | Score 0-1 por campo + threshold de revisão | **BUY motor + BUILD calibração** |
| **M8** | **Dedup (não reprocessar o mesmo doc)** | ✅ | ✅ (**hash perceptual** + dedup) | — | **REUSE Documentize** |
| **M9** | **Hash de proveniência (1º elo da trilha)** | ❌ ninguém | 🟡 hash perceptual existe; falta ligar à trilha | Ligar hash → trilha de boa-fé | **BUILD** (nosso moat) |
| **M10** | **Ciclo de feedback / correção humana (HITL)** | 🟡 | ✅ (`DocumentFeedback`) | Ligar feedback ao golden-set/calibração | **REUSE + estender** |
| **M11** | **Classe de qualidade de insumo gravada (XML vs extraído)** | ❌ ninguém | ❌ | Implementar (arquitetura §3.6 já prevê) | **BUILD** (diferencial) |
| **M12** | **Mapeamento de campos → modelo de auditoria (NCM/CST/cClassTrib)** | ✅ (quem audita) | ❌ | Mapper XML→entidades de apuração | **BUILD** (cola entre motor e automações) |

**Resumo buy-vs-build:**
- **BUILD (nosso core):** parsers determinísticos de XML (M1-M4), calibração de confiança (M7), classe de insumo (M11), mapeamento p/ auditoria (M12), hash→trilha (M9). É barato, determinístico e é onde mora o moat.
- **BUY (commodity):** o Document AI de PDF (M6) — **Azure Document Intelligence Brazil South** por residência LGPD. Não reinventar OCR.
- **REUSE (Documentize):** identificação de tipo (M5), dedup+hash perceptual (M8), feedback HITL (M10). O andaime já está de pé.

---

## 6. Recomendação de arquitetura do parser

```
                          ┌─────────────────────────────────────┐
   arquivo chega ───────▶ │  ROTEADOR DE INSUMO (Documentize)    │
   (provider/upload/email)│  identifica tipo + hash perceptual + │
                          │  dedup → decide a rota               │
                          └───────────┬──────────────┬──────────┘
                                      │ tem XML?      │ só PDF/imagem?
                                      ▼               ▼
                    ┌─────────────────────────┐  ┌──────────────────────────────┐
                    │ MOTOR A — Parser XML     │  │ MOTOR B — Document AI         │
                    │ • valida contra XSD       │  │ • Azure Doc Intelligence      │
                    │ • verifica assinatura     │  │   (Brazil South — residência) │
                    │ • extrai NCM/CST/CFOP/    │  │ • fallback LLM-vision JSON     │
                    │   cClassTrib/PIS/COFINS   │  │ • SCORE de confiança POR CAMPO │
                    │ • confiança = 100%        │  │ • <threshold → fila de revisão │
                    └────────────┬──────────────┘  └────────────┬─────────────────┘
                                 │                               │
                                 ▼                               ▼
                    ┌────────────────────────────────────────────────────────┐
                    │ NORMALIZADOR → entidades de apuração (item, imposto)     │
                    │ + classe_insumo ('xml' | 'documento_extraido')          │  (§3.6)
                    │ + confianca_por_campo                                    │
                    └───────────────────────┬─────────────────────────────────┘
                                            ▼
                    ┌────────────────────────────────────────────────────────┐
                    │ TRILHA DE BOA-FÉ (1º elo): hash + proveniência +        │  ← MOAT
                    │ classe de insumo + confiança → ledger imutável          │
                    └───────────────────────┬─────────────────────────────────┘
                                            ▼
                          AUTOMAÇÕES (Auditoria cClassTrib · Recuperação monofásico)
```

**Princípios:**
1. **XML primeiro, OCR só como fallback** — minimiza custo, maximiza precisão, reduz superfície LGPD.
2. **Confiança por campo é cidadã de primeira classe** — todo campo extraído por Motor B carrega score 0-1; abaixo do threshold vai para fila de revisão humana (HITL, CONTEXT §5.1 e D8). Nunca alimentar a automação com extração de baixa confiança sem revisão.
3. **Nota LGPD (CONTEXT §5.2):** preferir o caminho que **não exporta dado sensível**. Parser de XML = 100% interno. Document AI = **Azure Brazil South** (residência no país) ou LLM-vision via endpoint com DPA/região BR. **Evitar Textract (sem sa-east-1) e Google Document AI (sem residência BR)** para dado fiscal de terceiros, salvo base legal robusta de transferência internacional.
4. **Classe de insumo gravada na trilha** (§3.6) — o laudo declara se cada apontamento foi sustentado por XML (evidência forte) ou por documento extraído (evidência com materialidade limitada).

---

## 7. Nosso diferencial + Stories de build + Gates

### 7.1 Diferencial (o que liga reconhecimento ao moat)

O mercado para em "extraí o dado com ~97% de precisão" (commodity). Nós ligamos a **extração à defensabilidade**:

- **D-1 — Confiança calibrada por campo, não por documento.** Não dizemos "extração 97% confiável"; dizemos "este NCM: 0,99 · este valor de PIS: 0,71 (revisar)". Calibração validada contra golden-set (CONTEXT §5.3, Chip Huyen). Saber "onde NÃO sei" é o que protege o contador.
- **D-2 — Classe de insumo na trilha de boa-fé.** Cada apontamento de auditoria carrega se a evidência foi XML (forte) ou documento extraído (limitada). O laudo é honesto sobre a qualidade da evidência → defensabilidade real (Heleno, CONTEXT §5.4).
- **D-3 — Hash de proveniência desde o reconhecimento.** O hash perceptual do Documentize vira o **1º elo da trilha** — prova de qual arquivo gerou qual apontamento. Ninguém no mercado faz isso.
- **D-4 — HITL costurado ao golden-set.** O `DocumentFeedback` que já existe vira o loop de calibração: correção humana realimenta o threshold e o golden-set (não vira fine-tune até saturar — CONTEXT §7).

### 7.2 Stories de build (ordem sugerida)

| Story | Entrega | Depende de |
|---|---|---|
| **R0** | Demo Kit: roteador de insumo sobre o Documentize (identifica tipo + dedup + hash já existem) | — (D4: nada de infra nova antes do sinal) |
| **R1** | **Motor A — parser NF-e/NFC-e** contra XSD oficial + extração dos campos §2.2 + validação de schema | XSD do Portal NF-e |
| **R2** | Verificação de assinatura digital (XMLDSig/ICP) → proveniência | R1 |
| **R3** | Mapper XML → entidades de apuração (NCM/CST/CFOP/cClassTrib/PIS/COFINS) | R1 |
| **R4** | Parser CT-e/MDF-e + **NFS-e Nacional (grupos IBS/CBS, NT 007)** | XSD CGNFS-e |
| **R5** | **Motor B — integração Azure Doc Intelligence (Brazil South)** + score de confiança por campo | conta Azure BR |
| **R6** | Fila de revisão HITL (threshold) ligada ao `DocumentFeedback` | R5 |
| **R7** | **Classe de insumo + confiança gravadas na trilha** (§3.6) | R3, R5, trilha |
| **R8** | Calibração de confiança contra golden-set + observabilidade | R5, R6 |

### 7.3 Gates (não escalar sem)

- **G1 — Validação determinística:** 100% dos XML válidos parseados sem perda dos campos §2.2; XML inválido rejeitado com erro claro. (bloqueia R1)
- **G2 — Golden-set de extração:** Motor B avaliado contra golden-set rotulado **antes de escalar** (CONTEXT §5.3). Métrica = precisão por campo + ECE (calibração). Falso-positivo silencioso destrói a confiança do contador. (bloqueia R5/R8)
- **G3 — Confiança calibrada:** score de confiança correlaciona com acerto real (não confiança inflada). Threshold de revisão definido por campo crítico (NCM, CST PIS/COFINS, cClassTrib). (bloqueia R7)
- **G4 — LGPD:** nenhum dado fiscal de terceiro sai do Brasil sem base legal; Document AI roda em região BR; DPA com o provider. (bloqueia R5)
- **G5 — Trilha:** todo apontamento rastreável até o arquivo (hash) e à classe de insumo. (bloqueia integração com Auditoria/Recuperação)

---

## 8. Fontes (URLs primárias)

**Esquemas oficiais — XML fiscal:**
- Portal NF-e — Esquemas XML: https://www.nfe.fazenda.gov.br/portal/listaConteudo.aspx?tipoConteudo=BMPFMBoln3w%3D
- Portal NF-e — MOC (Manual de Orientação ao Contribuinte): https://www.nfe.fazenda.gov.br/portal/listaConteudo.aspx?tipoConteudo=ndIjl+iEFdE%3D
- SVRS — Documentos NF-e: https://dfe-portal.svrs.rs.gov.br/NFe/Documentos
- SVRS — Documentos NFC-e: https://dfe-portal.svrs.rs.gov.br/Nfce/Documentos
- SVRS — MOC NFCom (Anexo I Leiaute/Regras): https://dfe-portal.svrs.rs.gov.br/Nfcom/Documentos
- SVRS — MOC NF3e: https://dfe-portal.svrs.rs.gov.br/Nf3e/Documentos
- MOC NF-e/NFC-e v6 (SP, espelho): https://portal.fazenda.sp.gov.br/servicos/nfce/Downloads/Manual_de_Orientacao_Contribuinte_v_6.pdf
- O que é o MOC (Focus NFe): https://focusnfe.com.br/blog/o-que-e-manual-de-orientacao-do-contribuinte-moc/

**NFS-e Nacional — leiaute/XSD/NT (Reforma):**
- Portal CGNFS-e (Biblioteca/Documentação Técnica): https://www.gov.br/nfse/
- NFS-e Nacional — leiaute/esquemas antigos: https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/leiaute-e-esquemas-antigos
- NT 006 — leiaute NFS-e Via (PDF CGNFS-e): https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/rtc/nt-006-se-cgnfse-leiaute-nfse-via.pdf
- TOTVS — XSD da NT 007/2026 publicado: https://www.totvs.com/blog/fiscal-clientes/nfs-e-nacional-publicado-o-xsd-da-nota-tecnica-no-007-2026/
- TOTVS — NT 007/2026 (PIS/COFINS, retenções, códigos de operação): https://www.totvs.com/blog/fiscal-clientes/nfs-e-nacional-nota-tecnica-no-007-2026-esclarece-pis-cofins-retencoes-e-atualiza-codigos-de-operacao/
- Focus NFe — NT 007 (IBS, CBS e layout): https://focusnfe.com.br/blog/nt-007-nfse-nacional/
- Tecnospeed — NT 008/2026 (novo padrão DANFSe): https://blog.tecnospeed.com.br/nt-008-2026-novo-padrao-tecnico-do-danfse/
- Tecnospeed — Documentação Técnica Padrão NFS-e Nacional: https://atendimento.tecnospeed.com.br/hc/pt-br/articles/38360053945367
- Espião NFe — chave de acesso da NFS-e Nacional (estrutura): https://espiaonfe.com.br/blog/chave-de-acesso-da-nfs-e-nacional-estrutura-e-funcionamento

**Document AI / OCR — providers (preço, precisão, residência):**
- AWS Textract — pricing: https://aws.amazon.com/textract/pricing/
- AWS Textract — disponibilidade por região (NÃO inclui sa-east-1): https://www.aws-services.info/textract.html · https://awsfundamentals.com/regions/service/amazon-textract · https://docs.aws.amazon.com/general/latest/gr/textract.html
- AWS Brazil Data Privacy / LGPD: https://aws.amazon.com/compliance/brazil-data-privacy/
- Google Document AI — regiões/residência (US/EU): https://cloud.google.com/document-ai/docs/regions · https://docs.cloud.google.com/document-ai/docs/security
- Azure — residência de dados (Brazil South single-region): https://azure.microsoft.com/en-us/explore/global-infrastructure/data-residency
- Azure AI Document Intelligence — disponibilidade/replicação: https://learn.microsoft.com/en-us/answers/questions/2156548/availability-and-replication-info-on-azure-documen
- Benchmark Textract vs Google vs Azure (precisão/preço): https://invoicedataextraction.com/blog/aws-textract-vs-google-document-ai-vs-azure-document-intelligence
- Invoice OCR API benchmarks 2026: https://invoicedataextraction.com/blog/invoice-ocr-api-benchmarks
- Benchmark LLM (Claude/GPT-4o) invoice extraction: https://www.koncile.ai/en/ressources/claude-gpt-or-gemini-which-is-the-best-llm-for-invoice-extraction · https://tokenmix.ai/blog/best-ai-for-document-processing
- LLM OCR vs OCR tradicional (LayoutLMv3/Donut baseline): https://parsli.co/blog/llm-ocr-vs-traditional-ocr · https://intuitionlabs.ai/articles/ai-ocr-models-pdf-structured-text-comparison

**Players BR — reconhecimento/OCR (fonte primária):**
- Qive — OCR para padronização de NFS-e: https://ajuda.qive.com.br/pt-BR/articles/7903465-ocr-para-padronizacao-de-nfses-na-qive-arquivei
- Qive — OCR (conceito): https://qive.com.br/blog/ocr
- e-Auditoria — captura/OCR PDF→XML: https://www.e-auditoria.com.br/blog/captura-de-nfe-por-que-o-seu-sistema-precisa-disso-agora/
- Oobj — OCR + IA para NFS-e: https://oobj.com.br/bc/ocr-inteligencia-artificial-nfse/
- IDP Document — OCR para notas fiscais: https://idpdoc.com/conteudos/ocr-notas-fiscais-automatizar/
- Nota Gateway — OCR em notas fiscais (guia): https://notagateway.com.br/blog/ocr-em-notas-fiscais-guia-aprofundado-para-otimizar-processos-e-acertar-na-escolha-da-solucao/
- Nuvem Fiscal — 🪦 descontinuação 31/07/2026: https://www.nuvemfiscal.com.br/suporte/

**Limites/mecanismo (ver doc 01 para NSU/manifestação):** `55-feature-research/01-captura.md`

---

> **Nota de honestidade (CONTEXT §5):** o estado-da-arte de extração (~97%) é commodity acessível por API. O que não é commodity — e onde devemos gastar engenharia — é **(a) o parser determinístico de XML ligado ao modelo de apuração** (M1-M4, M12), **(b) a confiança calibrada por campo** (M7, G2-G3) e **(c) o elo extração→trilha de boa-fé** (M9, M11). O reconhecimento "puro" compramos/reusamos; a **defensabilidade do reconhecimento** construímos. Esse é o motor que destrava as automações que o founder citou — e o único pedaço dele que vira moat.
