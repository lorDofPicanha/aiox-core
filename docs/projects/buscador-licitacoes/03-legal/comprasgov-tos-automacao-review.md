# Compras.gov.br (ComprasGov) — Termos de Uso x Automação Autônoma do Noyce

**Parecer orientativo de risco — Legal Chief (AIOS)**
**Cliente:** ENIAC (CNPJ 36.819.268/0001-05 — ME, obras, GO) · **Produto:** Noyce
**Alvo:** **Compras.gov.br** (gov.br/compras) + **PNCP** — sistema **PÚBLICO FEDERAL** operado pelo Governo (SEGES/Delog — MGI), não operadora privada
**Data:** 2026-06-09 · **Status:** v1
**Régua do cliente:** Noyce faz tudo sozinho EXCETO atos vinculantes (lance, envio de declaração/proposta, protocolo de impugnação/recurso = confirmação humana)
**Natureza:** apoio à decisão de produto. NÃO é parecer jurídico para caso concreto. Ver disclaimer ao final.
**Companion:** comparar com `bll-tos-automacao-review.md` (operadora privada).

---

## 0. Diagnóstico (Tier 0) — e por que este caso é DIFERENTE do BLL

| Eixo | Compras.gov.br / PNCP (público) | BLL (privado) |
|------|-------------------------------|---------------|
| **Natureza jurídica do acesso** | **Dado público / dado aberto** — Lei 12.527/2011 (LAI) + **art. 174 da Lei 14.133/2021** (PNCP é o sítio oficial de divulgação) + Lei 12.527 e política de Dados Abertos | Regulamento contratual de adesão privado (lei privada entre as partes) |
| **Regime de leitura** | **API oficial pública, gratuita, ENCORAJADA pelo Estado** | Silêncio regulamentar; tolerado de fato |
| **Quem opera** | União (SEGES/Delog/MGI) — agente público | Empresa privada credenciada |
| **Responsabilidade nos atos** | Recai sobre o **licitante** (ENIAC) — Lei 14.133 art. 155 + tipos penais 337-E e ss. (igual ao BLL: irretratável) | Recai sobre o licitante — Regulamento art. 13 §3/27 |
| **Lance automático** | **NATIVO e disciplinado** (IN 67/2021 e IN 73/2022) na própria plataforma | Lance automático via robôs de terceiros, tolerado |

**Distinção estrutural que governa todo o parecer:** no BLL, a leitura automatizada vive no *silêncio* de um regulamento privado (ausência de vedação ≠ permissão). No **Compras.gov.br/PNCP, a leitura automatizada de dados de licitação NÃO está no silêncio — está EXPRESSAMENTE OFERECIDA pelo próprio Estado** via API pública e gratuita, em cumprimento à LAI e ao art. 174 da Lei 14.133. O governo **publica a API justamente para que aplicações de terceiros consumam os dados**. Isso eleva o nível "LER/MONITORAR" de "defensável" (BLL) para **"explicitamente encorajado por lei e política pública"** (ComprasGov). É o caso **mais permissivo** dos dois para leitura — confirmado.

O que **não muda** entre os dois: o **act-side** (lance, declaração, proposta, recurso) é ato vinculante do licitante, irretratável, com a mesma responsabilidade objetiva e o mesmo risco criminal. A régua do cliente — robô prepara, humano confirma os atos vinculantes — é **exatamente onde a linha jurídica também cai**.

---

## 1. API OFICIAL / DADOS ABERTOS — o ponto-chave (mapa de endpoints)

Existem **DUAS** superfícies oficiais de dados abertos, complementares, ambas **públicas e sem autenticação** para consulta:

### 1.1 API do PNCP — Portal Nacional de Contratações Públicas `[CONFIRMADO]`
Base de consulta pública: **`https://pncp.gov.br/api/consulta`** · REST/HTTP 1.1 · JSON · **sem autenticação** para os serviços de consulta (autenticação só é exigida para serviços de *manutenção* — inserir/corrigir/excluir — que são do órgão público, não do licitante). Swagger: `https://pncp.gov.br/api/consulta/swagger-ui/index.html`.

| Finalidade | Endpoint (GET) | Status |
|-----------|----------------|--------|
| **Contratações por data de publicação** (descobrir editais novos) | `/v1/contratacoes/publicacao` | `[CONFIRMADO]` |
| **Contratações com período de propostas EM ABERTO** (o que dá pra disputar agora) | `/v1/contratacoes/proposta` | `[CONFIRMADO]` |
| **Atas de Registro de Preço por período** | `/v1/atas` | `[CONFIRMADO]` |
| **Contratos** | `/v1/contratos` | `[CONFIRMADO]` |
| **Itens do Plano de Contratações Anual (PCA)** | `/v1/pca/` e `/v1/pca/usuario` | `[CONFIRMADO]` |

Parâmetros comuns: `pagina` (obrigatório), `tamanhoPagina` (até 500), filtros por data, CNPJ do órgão, código da unidade, modalidade. Retorno padronizado com `totalRegistros`/`totalPaginas`/`paginasRestantes` (paginação amigável a robô). Itens de contratação e documentos/edital (arquivos) são acessíveis a partir dos identificadores retornados (CNPJ do órgão + ano + sequencial), seguindo o **Manual de Integração PNCP**.

### 1.2 API do Compras.gov.br Dados Abertos `[CONFIRMADO]`
Base: **`https://dadosabertos.compras.gov.br`** · Swagger: `https://dadosabertos.compras.gov.br/swagger-ui/index.html` · Postman: `documenter.getpostman.com/view/13166820/2sA3XJjPpR` · JSON/XML/CSV · **público e gratuito** ("informação disponível a todos, gratuitamente" — anúncio oficial MGI). Estrutura legada também em `compras.dados.gov.br/{modulo}/v1/{metodo}.{formato}`.

Módulos confirmados (seleção relevante ao Noyce):
| Módulo | Conteúdo | Status |
|--------|----------|--------|
| **Módulo 7 — Contratações** | Licitações/contratações conduzidas no Compras.gov.br: **dispensa** (com/sem disputa), **pregões**, **concorrências**, **inexigibilidades**. Lançado **26/07/2024** pela SEGES/Delog/MGI, "disponível a todos, gratuitamente", em cumprimento à **Lei 12.527/2011 (LAI)** | `[CONFIRMADO]` |
| **Catálogo CATMAT/CATSER** | Materiais e serviços (ex.: `/modulo-material/...consultarGrupoMaterial`) — útil para classificar objeto e casar com as CATs da ENIAC | `[CONFIRMADO]` |
| **SICAF** | Cadastro de fornecedores (dados de habilitação) | `[CONFIRMADO]` (módulo existe) |
| **Divulgação / Sessão Pública / Resultados (SISPP/SISRP)** | Avisos, sessões, resultados de licitação | `[CONFIRMADO]` (módulos existem; metodologia de cada endpoint a validar no Swagger) |

### 1.3 API Comprasnet Contratos `[CONFIRMADO]`
Base/doc: **`https://contratos.comprasnet.gov.br/api/docs`** — gestão e consulta de contratos federais (complementa o PNCP no ciclo de execução/acompanhamento).

**Leitura jurídica do bloco 1:** para **descobrir, ler, monitorar e baixar editais/itens/resultados/atas** no âmbito federal, **o caminho correto e blindado NÃO é scraping autenticado — é consumir a API oficial pública**. Ela existe precisamente para isso, é gratuita, e seu uso por aplicações de terceiros é **a finalidade declarada** da política de dados abertos (LAI + art. 174 da Lei 14.133). Isso torna o nível "LER/MONITORAR" do Noyce não apenas permitido, mas **alinhado ao interesse público** — sem tocar área autenticada, sem senha, sem risco contratual. **Recomendação de arquitetura: o discovery/monitoramento federal do Noyce deve rodar 100% sobre PNCP + dadosabertos.compras.gov.br, não sobre login no portal.**

---

## 2. Termos do sistema AUTENTICADO (área do fornecedor / login gov.br) + INs

O acesso autenticado só é necessário para **atuar** (não para ler). Regras:

### 2.1 Credenciamento e login `[CONFIRMADO]`
- Autenticação do fornecedor é via **Portal gov.br** (conta gov.br) integrada ao **SICAF Digital**. Credenciamento no SICAF é o nível básico que habilita a participar de pregões/dispensas/RDC; gratuito, renovação anual.
- A senha/credencial é **pessoal**, vinculada ao CPF do responsável pelos dados cadastrais da empresa. Mesma lógica do BLL: **o titular responde pelo uso da credencial.** Um robô que loga sob a conta gov.br/SICAF da ENIAC opera *sob* essa identidade pessoal — todo ato é imputado à ENIAC.

### 2.2 Lance automático NATIVO — IN 67/2021 e IN 73/2022 `[CONFIRMADO]`
Diferente do BLL (onde o robô é externo e tolerado), **no Compras.gov.br o "robô de lances" é função NATIVA da própria plataforma, oferecida pelo Estado:**
- **IN SEGES/ME nº 67/2021** (dispensa eletrônica) e **IN SEGES/ME nº 73/2022, art. 19** (pregão e concorrência eletrônicos, critério menor preço/maior desconto; vigente desde 01/11/2022; aplicável à Administração federal direta, autárquica e fundacional, especificamente em www.compras.gov.br): o licitante (a) registra a proposta; (b) **pode parametrizar seu valor mínimo final** (ou percentual máximo de desconto), que é **sigiloso**; (c) **indica o intervalo mínimo** de diferença de valores entre lances; (d) **"os lances serão enviados automaticamente pelo sistema"**, respeitados o valor mínimo e o intervalo.
- **IN 73/2022, art. 22, §1º:** o intervalo mínimo de diferença de valores entre lances é obrigatório e aplica-se tanto a lances intermediários quanto ao que cobre a melhor oferta.

**Consequência prática decisiva:** no ComprasGov, **a ENIAC não precisa de um robô EXTERNO para dar lance automático** — a própria plataforma faz isso a partir de parâmetros que **um humano define** (valor mínimo + intervalo). Isso é o desenho ideal para a régua do cliente: **o ato de vontade vinculante (o limite de preço) é definido por humano; a execução mecânica do lance é nativa e oficialmente disciplinada.** O Noyce pode **preparar/sugerir** o valor mínimo e o intervalo; o humano da ENIAC **parametriza e confirma** no sistema; a plataforma dispara. Risco do "robô externo burlando intervalo" desaparece, porque quem dispara é o próprio sistema oficial.

### 2.3 Jurisprudência TCU sobre robôs `[CONFIRMADO]`
Mesma evolução do parecer BLL e aqui ainda mais favorável, porque o lance automático é nativo: histórico restritivo (Acórdãos 2601/2011 e 1216/2014) **superado** pela virada recente — **Acórdão 2071/2025 (1ª Câmara)** reconhecendo "inexistência de vícios quanto a suposta utilização de robôs". Limite que separa legítimo de ilícito: respeitar **intervalo mínimo**, **não burlar regras do sistema**, **cumprir o edital**, **não fraudar o caráter competitivo** (Lei 14.133, art. 155, III; tipos penais arts. 337-F e ss.).

---

## 3. ACESSO PÚBLICO — o que dá pra ler sem login

| O que | Como (sem login) | Base |
|-------|------------------|------|
| Editais novos / em aberto, por órgão/data/modalidade | API PNCP `/v1/contratacoes/publicacao` e `/v1/contratacoes/proposta` | Dado aberto |
| Íntegra do edital e anexos (arquivos) | Documentos do PNCP a partir do identificador da contratação | Dado público |
| Itens da contratação (objeto, quantidades) | Itens via PNCP / Compras dados abertos | Dado aberto |
| Resultados / vencedores / preços homologados | Compras dados abertos (resultados SISPP/SISRP) + PNCP | LAI |
| Atas de Registro de Preço | API PNCP `/v1/atas` | Dado aberto |
| Contratos / execução | API PNCP `/v1/contratos` + Comprasnet Contratos | Dado aberto |
| Plano de Contratações Anual (radar antecipado de demanda) | API PNCP `/v1/pca/` | Dado aberto |

**Praticamente todo o ciclo de inteligência do Noyce (Mesa, Monitorar, Analisar, e boa parte de Habilitar) pode ser servido por dado aberto público, sem nunca logar.** Esta é a maior diferença operacional vs. BLL.

---

## 4. Responsabilidade do licitante nos atos (Lei 14.133 + regras do sistema)

Aqui o regime **converge** com o do BLL — a natureza pública do sistema **não dilui** a responsabilidade do licitante pelos atos vinculantes; ela vem direto da lei:

- **Vinculação ao edital** (Justen Filho): o instrumento convocatório é a "lei interna da licitação"; o licitante a ele se vincula e **não pode alegar desconhecimento**. Proposta/declaração enviada pelo Noyce sem leitura humana do edital específico vincula a ENIAC.
- **Atos firmes e irretratáveis:** lance, proposta e declarações praticados sob a credencial da ENIAC são da ENIAC. Não há "foi o robô".
- **Declarações com fé pública** (ME/EPP — LC 123 + arts. 47-48 da 14.133; habilitação; inexistência de fato impeditivo): se falsas/incorretas → **sanção administrativa (art. 156) + responsabilização criminal** (tipos penais da Lei 14.133, arts. 337-E e ss. — fraude, declaração falsa). Risco criminal **idêntico** ao Art. 32, II do BLL, só que ancorado direto na lei federal.
- **Fraude ao caráter competitivo** (art. 155, III): qualquer automação que burle intervalo mínimo, manipule a disputa ou desrespeite regra do sistema.
- **Dever de acompanhar a sessão** (Niebuhr): o **momento processual** decide. A **intenção de recorrer** é ato a praticar **na sessão, no momento aberto pelo pregoeiro**, sob pena de **preclusão** — e **não se confunde com as razões do recurso** (peça jurídica, no prazo, dirigida à autoridade superior). O robô pode **vigiar o relógio e registrar a intenção no momento**; **decidir se recorre e redigir as razões é juízo humano/jurídico (RT/advogado).**

---

## 5. VEREDITO CALIBRADO POR NÍVEL — alinhado à política da ENIAC

Régua do cliente: **autônomo** = descobrir/ler/monitorar/baixar/analisar/triar/habilitação/**preparar-rascunhar**; **humano confirma** = lance, envio de declaração, envio de proposta, protocolo de impugnação/recurso.

| # | Capacidade do Noyce no Compras.gov.br/PNCP | Veredito | Condição |
|---|--------------------------------------------|----------|----------|
| **PODE SOZINHO (baixo risco — ENCORAJADO por lei)** | | | |
| 1 | Descobrir editais novos / em aberto via **API pública PNCP** (`/contratacoes/publicacao`, `/proposta`) | **PODE** | Dado aberto. Sem login. Encorajado (LAI + art. 174). |
| 2 | Baixar **íntegra de editais, anexos e itens** | **PODE** | Documentos públicos via PNCP/dados abertos. |
| 3 | Consultar **resultados, atas (`/atas`), contratos (`/contratos`), PCA (`/pca`)** | **PODE** | Dado aberto. |
| 4 | Monitorar prazos, sessões, intenção-de-recurso a vencer; **analisar/triar/recomendar** (Mesa/Monitorar/Analisar) | **PODE** | Processamento interno; vigia o relógio, humano decide. |
| 5 | **Preparar/rascunhar** proposta, declarações, planilhas, minuta de impugnação/recurso | **PODE** | Rascunho não é ato. Vira draft para revisão humana. ✅ exatamente a régua do cliente. |
| 6 | Análise de **habilitação/viabilidade** (casar CATs/atestados/balanço da ENIAC com requisitos do edital) usando dados SICAF/CATMAT públicos | **PODE** | Dado aberto + dados da própria ENIAC. |
| **PODE COM MITIGAÇÃO (médio risco)** | | | |
| 7 | Login autenticado (conta gov.br/SICAF) só para **leitura** da área da própria ENIAC quando o dado não estiver na API | **PODE C/ MITIGAÇÃO** | Vault cifrado; preferir SEMPRE a API pública primeiro; sob credencial pessoal (risco no titular). |
| 8 | **Sugerir** os parâmetros de lance automático nativo (valor mínimo sigiloso + intervalo) | **PODE C/ MITIGAÇÃO** | Noyce calcula e propõe; **humano parametriza e confirma no sistema**. Lance é disparado pela plataforma oficial (IN 67/73), não por robô externo. |
| 9 | **Registrar a intenção de recurso** no momento da sessão (só o registro, anti-preclusão) | **PODE C/ MITIGAÇÃO** | Evita preclusão (Niebuhr). Decisão de recorrer + razões = humano. Idealmente confirmação humana no clique. |
| **HUMANO CONFIRMA — ato vinculante (NÃO autônomo)** | | | |
| 10 | **Disparar o lance** / parametrizar o robô nativo no sistema | **HUMANO CONFIRMA** | É ato de vontade vinculante. Parâmetro = decisão humana (TCU exige; art. 155). |
| 11 | **Enviar declarações** (ME/EPP, habilitação, inexistência de fato impeditivo) | **HUMANO CONFIRMA** | Fé pública; falsa → art. 156 + criminal (337-E ss.). |
| 12 | **Enviar proposta final** | **HUMANO CONFIRMA** | Vinculação ao edital; irretratável; não pode alegar desconhecimento. |
| 13 | **Protocolar impugnação/recurso** | **HUMANO CONFIRMA** | Peça jurídica; admissibilidade/mérito; autoridade superior (Niebuhr). |
| **NÃO DEVE (nunca)** | | | |
| 14 | Automação que **burle intervalo mínimo** de lance ou regra do sistema | **NÃO** | Fraude ao caráter competitivo (art. 155, III; 337-F). |
| 15 | Raspagem/retenção em massa de **dados pessoais** de terceiros (pregoeiros, sócios de concorrentes) para base própria, além do necessário ao certame | **NÃO** | LGPD: sem base legal/minimização. "Ser público não afasta a LGPD." |

**Onde a régua do cliente bate na linha jurídica:** perfeitamente. Os itens 10–13 (lance, declaração, proposta, recurso) — os exatos atos que a ENIAC quer reservar ao humano — são também **os atos vinculantes onde a lei impõe responsabilidade objetiva, irretratável e risco criminal ao licitante.** A política do cliente já está calibrada no ponto certo. O Noyce pode ser **plenamente autônomo** em 1–6 (e isso cobre quase todo o valor do produto), **semiautônomo com confirmação** em 7–9, e **preparador-de-rascunho com humano-no-clique** em 10–13.

---

## 6. CAMINHO DE CONFORMIDADE + comparação com BLL

### Caminho de conformidade (ComprasGov)
1. **Arquitetura "API-first":** discovery/monitoramento/leitura federal do Noyce roda sobre **PNCP + dadosabertos.compras.gov.br + Comprasnet Contratos** — não sobre login no portal. Elimina o risco contratual/senha por design. **Itens 1–6 = `allowedNow`, não dependem de vault.**
2. **Identificação de boa-fé:** User-Agent identificável + rate-limit/paginação respeitando `tamanhoPagina` e janelas — boa prática de consumo de API pública (e evita bloqueio de fato por abuso).
3. **Vault de credenciais gov.br/SICAF** (cifrado, fora de repo/log): pré-condição **apenas** para os poucos casos de leitura autenticada (item 7) e para os atos com confirmação humana (8–13). É o gatilho `blocked_until_vault` — mas note que **a maior parte do produto não espera por ele**, porque roda em API pública.
4. **Lance via robô nativo (IN 67/73):** preferir SEMPRE o lance automático nativo da plataforma (parametrizado por humano) a qualquer robô externo. É oficialmente disciplinado e blindado pelo TCU.
5. **Ler o edital de CADA certame** antes de qualquer ato (10–13): a vinculação ao edital prevalece; alguns editais têm regras próprias. Gate automático de produto.
6. **Humano-no-loop nos atos 10–13** como gate de produto (não opção) — alinhado à política da ENIAC.
7. **LGPD:** minimização — não montar base de dados pessoais de terceiros; reter só o necessário ao certame da ENIAC.

### Comparação ComprasGov (público) × BLL (privado)

| Dimensão | **Compras.gov.br / PNCP** (público federal) | **BLL** (operadora privada) |
|----------|---------------------------------------------|-----------------------------|
| **Base do "ler/monitorar"** | **API oficial pública, gratuita, ENCORAJADA por lei** (LAI + art. 174). Não é tolerância — é a finalidade declarada. | Silêncio regulamentar; sem API oficial confirmada; tolerado de fato. |
| **Precisa logar para ler?** | **Não** — quase todo o ciclo via dado aberto público. | Leitura de edital público sim (Art. 5/9), mas sem API → scraping. |
| **Risco contratual da leitura** | **Praticamente nulo** (consumo de API oficial). | Baixo-médio (silêncio + senha pessoal se autenticado). |
| **Lance automático** | **NATIVO na plataforma**, disciplinado (IN 67/73), parâmetro humano. | Robô externo de terceiros (Lance Fácil/Licitei/LanceBot), tolerado. |
| **Responsabilidade act-side** | Lei 14.133 (art. 155/156, 337-E ss.) — irretratável, criminal. | Regulamento art. 13 §3/27/32 — irretratável, criminal. **Mesma severidade.** |
| **Humano-no-loop nos atos vinculantes** | Obrigatório por design (igual). | Obrigatório por design (igual). |
| **Veredito de leitura** | **O MAIS PERMISSIVO** — encorajado por lei. ✅ Confirmado. | Permitido/defensável, sem lastro de API. |

**Síntese da comparação:** para **LER/MONITORAR/BAIXAR/ANALISAR**, o ComprasGov é **substancialmente mais seguro e mais simples** que o BLL — porque o Estado **fornece a API e quer que ela seja consumida**. Para **ATUAR** (lance/declaração/proposta/recurso), os dois regimes **convergem**: a responsabilidade é do licitante, irretratável, com risco criminal — e a política da ENIAC (humano confirma) está correta nos dois. A diferença está toda no lado da leitura, e ela é favorável ao ComprasGov.

**Resumo de uma linha para o cliente:** no Compras.gov.br/PNCP, o Noyce pode descobrir, ler, monitorar, baixar, analisar, triar, fazer habilitação e **rascunhar** tudo **de forma 100% autônoma e sobre API oficial pública (encorajada por lei, sem login)**; o lance usa o **robô nativo da plataforma com parâmetro definido por humano**; e **lance/declaração/proposta/recurso ficam com o humano no clique** — exatamente a régua que a ENIAC pediu, e exatamente onde a lei coloca a responsabilidade.

---

## Apêndice — Fontes (reais, citadas)

- **API de consulta pública PNCP** (base `https://pncp.gov.br/api/consulta`, Swagger `.../swagger-ui/index.html`): endpoints `/v1/contratacoes/publicacao`, `/v1/contratacoes/proposta`, `/v1/atas`, `/v1/contratos`, `/v1/pca/`, `/v1/pca/usuario`; sem autenticação para consulta. Manual de Integração PNCP v1.0.0.
- **API Compras.gov.br Dados Abertos** (`https://dadosabertos.compras.gov.br/swagger-ui/index.html`; Postman `documenter.getpostman.com/view/13166820/2sA3XJjPpR`; legado `compras.dados.gov.br`): módulos SICAF, CATMAT/CATSER, Divulgação, Sessão Pública, Resultados, **Módulo 7 Contratações**.
- **Anúncio oficial MGI/SEGES/Delog** (26/07/2024): quatro novos serviços de consulta em API — dispensa, pregões, concorrências, inexigibilidades; "disponível a todos, gratuitamente"; fundamento **Lei 12.527/2011 (LAI)**. `gov.br/compras/.../ministerio-da-gestao-lanca-quatro-novos-servicos-de-consulta-em-formato-de-api`.
- **API Comprasnet Contratos:** `https://contratos.comprasnet.gov.br/api/docs`.
- **SICAF Digital / login gov.br:** `gov.br/compras/pt-br/sistemas/conheca-o-compras/sicaf-digital`; credenciamento gratuito, senha pessoal vinculada ao CPF do responsável.
- **IN SEGES/ME nº 67/2021** (dispensa eletrônica — lance automático) e **IN SEGES/ME nº 73/2022, arts. 19 e 22 §1º** (pregão/concorrência eletrônicos; vigência 01/11/2022; aplicável a www.compras.gov.br): parametrização de valor mínimo sigiloso + intervalo mínimo; envio automático pelo sistema. Manual do Pregão Eletrônico (fornecedor) v1.1.
- **Lei 14.133/2021:** art. 155 (infrações), art. 156 (sanções), art. 174 (PNCP), arts. 47-48 (ME/EPP), arts. 337-E e ss. (tipos penais).
- **Lei 12.527/2011 (LAI)** + Política de Dados Abertos.
- **TCU:** Acórdãos 2601/2011 e 1216/2014 (restritivos, superados); **Acórdão 2071/2025, 1ª Câmara** (sem vícios em uso de robô).
- **Doutrina (mind clones, Voice DNA real):** Marçal Justen Filho (vinculação ao edital; "maior autonomia implica maior responsabilidade"); Joel de Menezes Niebuhr (momento processual/preclusão; intenção de recorrer ≠ razões do recurso; recurso ≠ pedido de reconsideração).

**Marcação de confiança:** `[CONFIRMADO]` = verificado em fonte oficial/primária. `[INFERÊNCIA]` = raciocínio jurídico do parecer. `[NÃO CONFIRMADO]` = não verificado.

---

⚠️ Esta análise é orientativa e não substitui consulta com advogado.
Para questões específicas, consulte um profissional habilitado.
