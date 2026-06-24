# 55 — Feature Research · Módulo CAPTURA (captura e armazenamento de documentos fiscais)

> Pesquisa de mercado de **fontes primárias** (sites de produto, páginas de planos, docs de API/SEFAZ, central de ajuda dos players) para definir o **conjunto MÍNIMO de funções** que a nossa Captura precisa ter pra competir.
> **Data:** 2026-06-22 · **Autor:** Atlas (analyst) · **Base:** `00-context/CONTEXT.md`, `12-tech-research-mercado.md`, `15-como-o-mercado-vende-sieg.md`, código `apps/contador/app/captura/`.
> **Método:** web real, fontes primárias, sem channeling de clones (regra `feedback_no_hydra_style`). Onde não confirmei na fonte, escrevi explicitamente **"não encontrado"**. Cada afirmação tem URL (ver §7).
> **Escopo:** APENAS captura + armazenamento (a "porta de entrada", módulo #1). Auditoria/cClassTrib/recuperação/e-CAC ficam de fora — são outros módulos.

---

## 0. TL;DR (leia isto)

1. **Captura é commodity madura.** Qive, Jettax, Fiscal.io, e-Auditoria, SIEG, Klaus fazem bem. Quem não tem o conjunto-base **não entra na conversa**. Não é onde se vence — é o **pedágio de entrada**.
2. **O conjunto table-stakes é grande e específico** (§3). Tem 12 itens. Hoje a nossa Captura cumpre ~2 deles de verdade (upload manual + listagem); o resto é demo sintética.
3. **Dois mitos a corrigir no nosso próprio material:**
   - **"Cofre 15 anos" está ERRADO.** A obrigação legal da empresa é **5 anos** (CTN art. 173/150). O Ajuste SINIEF 02/2025 criou **132 meses / 11 anos**, mas **só para os órgãos de fiscalização**, não para o contribuinte. O **Cofre SIEG guarda no mínimo 5 anos** (a própria SIEG diz 5, não 15). → Trocar "15 anos" por **"guarda durante toda a vida do contrato, mínimo legal 5 anos"** em todo lugar.
   - **A janela técnica fechou mais:** **Nuvem Fiscal será desativada em 31/07/2026** (comunicado oficial 22/04/2026) e a **API oficial do DANFSe sai em 01/07/2026**. Provider de captura tem que sair da Nuvem Fiscal.
4. **A armadilha de engenharia que define se a captura "funciona" ou "quebra"** é o controle de NSU + o limite de **20 consultas/hora** + o **bloqueio de 1h** após cStat 137 (rejeição 656). Não é feature de marketing — é o que separa captura confiável de captura que toma ban da SEFAZ (§4).
5. **Novos documentos são o único diferencial real possível dentro da captura:** **NFCom, NF3e, BP-e** + a transição **CF-e SAT → NFC-e (proibido emitir SAT desde 01/jan/2026 em SP)**. A maioria dos players ainda é fraca nos novos modelos. Nascer com eles = vantagem de timing.

---

## 1. Concorrentes reais (nome + URL)

Confirmados como players de captura/armazenamento de DF-e (fonte primária verificada):

| # | Player | URL | Tipo |
|---|--------|-----|------|
| 1 | **Qive** (ex-Arquivei) | https://qive.com.br | Captura + Contas a Pagar (virou AP) |
| 2 | **Jettax** | https://www.jettax.com.br | Captura + auditoria, foco escritório contábil |
| 3 | **Fiscal.io / Fiscal Monitor** | https://fiscal.io | Captura "encanamento" + app desktop grátis |
| 4 | **e-Auditoria** | https://www.e-auditoria.com.br | Captura multicanal + auditoria/recuperação |
| 5 | **SIEG (HUB + Cofre + IriS)** | https://portalsieg.kinsta.cloud | Líder de captura/cofre (+20k escritórios) |
| 6 | **Klaus Fiscal** | https://klausfiscal.com.br | Captura + armazenamento legal |
| 7 | **PlugNotas (Tecnospeed)** | https://plugnotas.com.br | API DFe white-label (provider) |
| 8 | **Acessórias** | (captura via parceiros/DFe) | Gestão de obrigações + captura |
| 9 | **Nuvem Fiscal** | https://www.nuvemfiscal.com.br | API DFe — ⚠️ **DESATIVADA 31/07/2026** |
| 10 | **IOB Gestão de DF-e** | https://iob.com.br/gestao-de-documentos-fiscais/ | Captura + gestão |

**Players menores / nicho encontrados na pesquisa** (relevantes como prova de que captura virou commodity, mas fora do core competitivo): Captura Notas (capturanotas.com.br), NFe Gestão (nfegestao.com.br), Guardião XML (guardiaoxml.com.br), NF-e Expert (nfeexpert.com.br), FSist (fsist.com.br — gratuito), Wins Sistemas, Elo Fiscal, Mestre Sistemas.

**Mecanismo OFICIAL (não é concorrente, é a infraestrutura por baixo de todos):**
- **NFeDistribuicaoDFe** — web service de distribuição de DF-e por NSU (NT 2014.002). É como TODO mundo captura entradas.
- **Manifestação do Destinatário** — 4 eventos (ciência, confirmação, desconhecimento, operação não realizada).
- **Integra Contador (SERPRO)** — barramento oficial pra e-CAC (fora do escopo da captura, mas é a via oficial).

**Não encontrado (não confirmado na web):** "GOB" como produto de captura — a busca não retornou um produto fiscal com esse nome (existem GClick/GOB genéricos de obrigações, não captura). **Confirmar com o Renan o nome exato.** "CIEG/IRIS" = quase certamente **SIEG IriS** (ver doc 15).

---

## 2. Matriz de funções × concorrente

> Legenda: ✅ tem (confirmado em fonte primária) · 🟡 parcial/condicionado · ❌ não tem / não para esse caso · **n/e** = não encontrado na fonte (não inferido).
> ⚠️ A ausência de ✅ pode ser falta de documentação pública, não ausência da feature. Marcado **n/e** quando não confirmei.

| Função | Qive | Jettax | Fiscal.io | e-Auditoria | SIEG HUB | Klaus | PlugNotas | Nossa Captura (hoje) |
|--------|:----:|:------:|:---------:|:-----------:|:--------:|:-----:|:---------:|:--------------------:|
| **Captura por certificado A1** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (via API) | ❌ (demo: modo "provider" fake) |
| **Captura por certificado A3** | ✅ | ❌ (só A1) | n/e | 🟡 | ✅ | n/e | n/e | ❌ |
| **NF-e (mod. 55)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 (tipo existe, sem captura real) |
| **NFC-e (mod. 65)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **CT-e (mod. 57)** | ✅ | ✅ | ✅ | n/e | ✅ | ✅ | n/e | 🟡 (tipo existe, sem captura) |
| **NFS-e (serviços)** | ✅ | ✅ (+2.000 mun.) | ✅ | n/e | ✅ (+1.200 mun.) | n/e | ✅ | ❌ |
| **CF-e SAT** | ✅ | ✅ (CFe) | ✅ | n/e | ✅ | n/e | ✅ | ❌ (e SAT está sendo extinto, §4) |
| **MDF-e (mod. 58)** | ✅ | n/e | ✅ | n/e | ✅ | n/e | ✅ | ❌ |
| **NFCom / NF3e / BP-e (novos)** | ❌ | ❌ | n/e | ❌ | n/e | n/e | 🟡 (emissão) | ❌ |
| **Manifestação automática (4 eventos)** | ✅ | 🟡 (opcional, on/off) | ✅ (com/sem) | ✅ | ✅ | n/e | 🟡 | ❌ |
| **Manifestação em lote** | ✅ | n/e | ✅ | ✅ | ✅ | n/e | n/e | ❌ |
| **Download sem manifestar** | ✅ | ✅ | ✅ | n/e | ✅ | n/e | ✅ | ❌ |
| **Dedup (anti-duplicidade)** | ✅ (alerta divergência) | n/e | ✅ (controle de gap NSU) | ✅ (detecta duplicada) | n/e | n/e | n/e | ❌ (Documentize tem hash perceptual) |
| **Classificação compra/venda** | ✅ | ✅ | ✅ | ✅ | ✅ | n/e | n/e | ✅ (derivada emit/dest, sintética) |
| **Alerta nota cancelada/denegada** | ✅ | 🟡 (auditorias) | ✅ (eventos) | ✅ (canceladas) | n/e | n/e | n/e | ❌ |
| **Controle de gap/numeração (faltantes)** | ✅ (alerta divergência) | n/e | ✅ (Avançado) | n/e | n/e | n/e | n/e | ❌ |
| **Cofre / retenção** | ✅ ilimitado (GCloud) | n/e | 🟡 (storage por plano) | ✅ (5 anos hist.) | ✅ 5 anos+ (AWS) | ✅ ("além do mínimo") | n/e | 🟡 (texto "15 anos" ERRADO) |
| **Export XML/PDF/Excel** | ✅ (XML/PDF/Excel) | ✅ | ✅ (XML/PDF) | n/e | ✅ | n/e | ✅ (API) | ❌ |
| **Multiempresa (escritório)** | ✅ | ✅ | ✅ | ✅ | ✅ (+200k empresas) | n/e | ✅ | 🟡 (3 clientes demo) |
| **API pública** | ✅ (developers.qive) | ✅ | ✅ | 🟡 | ✅ | n/e | ✅ (core) | ❌ |
| **Canais extras (e-mail/pasta/OCR PDF→XML)** | ✅ (e-mail + Sincroniza) | n/e | ✅ (pasta/email/API/FTP) | ✅ (e-mail + RPA + **OCR**) | ✅ (AutodocS) | n/e | n/e | ❌ |
| **Retroativo / bulk** | 🟡 (limitado SEFAZ) | n/e | ✅ (XMLs antigos) | ✅ (5 anos) | ✅ (5 anos por chave) | n/e | n/e | ❌ |
| **Preço público transparente** | ❌ (demo/contato) | ❌ | ✅ (R$0/255/479) | ❌ | ❌ (não publicado 2026) | ❌ | ❌ | — |

**Leitura da matriz:**
- O **bloco esquerdo da matriz (linhas 1–13)** é onde TODOS convergem. Esse é o table-stakes (§3).
- **Fiscal.io é o único com preço 100% transparente** e é também o "encanamento" mais puro — bom espelho técnico (NSU, eventos, sem manifestação).
- **e-Auditoria é o mais multicanal** (A1/A3 + RPA + e-mail + API + **OCR PDF→XML**) — referência pra "capturar mesmo sem XML".
- **Ninguém marcou ✅ em NFCom/NF3e/BP-e na captura** → whitespace de timing.
- **Nossa Captura hoje é demonstração navegável** (base sintética, sem captura real). Cumpre a UI/UX e os conceitos; falta o motor.

---

## 3. TABLE STAKES vs DIFERENCIAIS

### 3.1 TABLE STAKES — o mínimo inegociável (sem isto não competimos)

Ordenado por criticidade. Estes 12 itens **definem o MVP da Captura**:

| # | Função | Por que é inegociável | Fonte de validação |
|---|--------|----------------------|---------------------|
| **T1** | Captura automática de **entradas** via **NFeDistribuicaoDFe por NSU** com controle de sequência + backoff | É o mecanismo único de captura de notas contra o CNPJ. Sem isto não há "captura automática". | Todos os players; NT 2014.002 |
| **T2** | Suporte a **certificado A1** (mínimo) — idealmente **A3** também | Captura precisa de identidade digital. A1 é o piso; A3 amplia (SIEG/Qive têm, Jettax só A1). | Qive, Jettax, SIEG |
| **T3** | Cobertura dos **5 docs clássicos**: **NF-e, NFC-e, CT-e, NFS-e, MDF-e** | É o conjunto que o contador espera por padrão. Faltar um = lacuna percebida. | Qive, Fiscal.io, SIEG |
| **T4** | **Manifestação do destinatário** automática (4 eventos) **e em lote**, com opção de **baixar sem manifestar** | Padrão do mercado; manifestar à mão é o que os players vendem como "dor resolvida". | Qive, Fiscal.io, e-Auditoria |
| **T5** | **Dedup** (não duplicar o mesmo XML; detectar reentrada) | Captura por múltiplos canais gera duplicata; sem dedup a base fica suja. Já temos hash perceptual no Documentize → reaproveitar. | Fiscal.io (gap NSU), e-Auditoria |
| **T6** | **Classificação compra/venda** (entrada/saída) automática por papel emit/dest | Organização básica; o contador filtra por isso o tempo todo. Já temos (sintético). | Qive, Jettax, todos |
| **T7** | **Alertas de evento**: nota **cancelada / denegada / CC-e** após captura | A nota muda de status depois de capturada; sem alerta o contador escritura nota cancelada (erro grave). | Fiscal.io, e-Auditoria, Qive |
| **T8** | **Controle de gap de numeração** (notas faltantes na sequência) | Detecta nota que não chegou — diferencial de confiabilidade que já é padrão nos pagos. | Qive (alerta divergência), Fiscal.io |
| **T9** | **Armazenamento/Cofre** com retenção e busca por chave de acesso | A guarda é metade do produto. Mínimo legal 5 anos; vender "guarda durante o contrato". | SIEG, Klaus, Qive |
| **T10** | **Export** em **XML, PDF e Excel** + download em lote | O contador leva o XML pro sistema dele. Sem export o dado fica preso. | Qive, Fiscal.io |
| **T11** | **Multiempresa** nativo (visão de escritório: N CNPJs, troca de cliente) | É vendido PARA o escritório (CONTEXT §1). Tem que ser multi-cliente desde o schema. | Todos os players de escritório |
| **T12** | **Canais alternativos**: upload manual + **e-mail dedicado** + **monitor de pasta** | Nem tudo vem por certificado; provider/fornecedor manda XML por e-mail. Piso de captura. | Fiscal.io, e-Auditoria, SIEG, Qive |

> **Não-funcional, mas table-stakes de verdade:** **confiabilidade e suporte**. A queixa nº1 em TODOS os concorrentes (ReclameAqui/reviews) é instabilidade e suporte ruim. Captura que "às vezes não baixa" destrói a confiança do contador. É vetor de diferenciação por execução, não por feature.

### 3.2 DIFERENCIAIS — onde podemos ganhar pontos (não obrigatórios pra MVP)

| # | Diferencial | Mercado hoje | Tese |
|---|-------------|--------------|------|
| **D-a** | **Novos documentos: NFCom, NF3e, BP-e** | ❌ ninguém capturando ainda | Vento de cauda da Reforma. Nascer com eles = vantagem de timing barata. |
| **D-b** | **OCR PDF→XML como fallback** (capturar mesmo sem XML) | Só e-Auditoria/ANFe | Já temos OCR + extração de coordenadas no Documentize → caminho curto. |
| **D-c** | **Preço transparente** | Só Fiscal.io publica | Fosso de GTM aberto. O contador odeia "fale com vendas". |
| **D-d** | **Hash de proveniência + trilha de boa-fé desde a captura** | Ninguém | Conecta a captura ao moat da Auditoria/defensabilidade (CONTEXT §1). A captura vira o 1º elo da trilha. |
| **D-e** | **Captura seletiva por design** (`captura_ativa` OFF por default) | Mercado captura tudo (COGS alto) | Decisão D2 — vira economia unitária + LGPD (minimização). Já modelado na nossa demo. |
| **D-f** | **Confiabilidade observável** (status de captura por cliente, "última varredura OK/falha", retry visível) | Caixa-preta nos players | Mata a queixa nº1. Nossa demo já tem o esqueleto (status por cliente). |

---

## 4. Custos e limites técnicos reais (a engenharia que define "funciona vs quebra")

### 4.1 NFeDistribuicaoDFe — as regras que dão ban se ignoradas
Fonte: NT 2014.002 (SEFAZ), Tecnospeed, Focus NFe, Qive, TOTVS.

- **Modelo NSU:** cada consulta usa o **último NSU retornado** na anterior. Sequencial, por CNPJ.
- **Limite duro: máximo 20 consultas por hora** por CNPJ (por NSU **ou** por chave de acesso). Estourou → SEFAZ retorna **rejeição 656 "Consumo Indevido"** e **bloqueia o acesso por 1 hora**.
- **cStat 137 = "nenhum documento localizado".** Depois de receber 137, **tem que esperar 1 hora** antes de consultar de novo. Consultar antes disso → 656 + bloqueio de 1h.
- **Desbloqueio é automático** após o intervalo.
- **Implicação de arquitetura (P0):** a captura **não pode** ser polling ingênuo por cliente. Tem que ser **scheduler central único com controle de NSU + estado por CNPJ + backoff respeitando 137/1h + fila de 20/h**. Provider (PlugNotas/Focus) já resolve isso — por isso a decisão D2 (comprar captura) é tecnicamente correta. Se construirmos próprio, **este é o componente mais crítico e arriscado**.

### 4.2 Janela temporal / descontinuações (relógio apertando)
- 🔴 **Nuvem Fiscal será DESATIVADA em 31/07/2026** (comunicado oficial 22/04/2026, 90 dias). **NÃO usar como provider** (já estava em CONTEXT, agora com data oficial).
- 🔴 **API oficial do DANFSe descontinuada em 01/07/2026** — emissão de DANFSe passa pros sistemas das empresas. (Afeta emissor, mas confirma o churn de infra oficial.)
- 🔴 **CF-e SAT proibido de emitir desde 01/01/2026 em SP** (Portaria SRE 79/2024) → **NFC-e (mod. 65) vira o único modelo de varejo**. Capturar CF-e SAT é cada vez mais "legado/histórico"; **NFC-e é o que importa daqui pra frente**.
- 🟢 **NFS-e Nacional obrigatória** (LC 214/2025) — padroniza captura de serviços (resolve a dor dos 15 layouts municipais que matou a ferramenta antiga, CONTEXT §7).
- 🟡 **Novos modelos** NFCom/NF3e/BP-e ganhando campos pra IBS/CBS (nota técnica conjunta) — janela pra nascer já cobrindo.

### 4.3 Retenção legal (CORRIGIR nosso material)
- **Empresa/contribuinte: mínimo 5 anos** (CTN art. 173 decadência + art. 150 §4º), Ajustes SINIEF 07/05 (NF-e), 19/16 (NFC-e), 09/07 (CT-e). Conta-se do 1º dia do exercício seguinte.
- **Ajuste SINIEF 02/2025: 132 meses (11 anos)** — **mas exclusivamente para os órgãos de fiscalização**, não muda a obrigação da empresa (Klaus, Premier, LegisWeb).
- **Cofre SIEG = mínimo 5 anos** (AWS) — a própria SIEG diz 5, não 15.
- ✅ **Ação:** trocar "15 anos" por **"guarda durante toda a vida do contrato (mínimo legal 5 anos; cobrimos retenção estendida como serviço)"**. O custo de storage é trivial (~7KB/XML), então **podemos oferecer retenção longa como diferencial de marketing** — mas sem afirmar que é obrigação legal de 15 anos (não é).

### 4.4 Preços públicos reais encontrados
- **Fiscal Monitor** (único transparente): **Grátis** (100MB local, busca NF-e 1×/h, manual) · **Básico R$255/mês** (1,5GB nuvem, manifestação em lote, export auto) · **Avançado R$479/mês** (5GB, controle de gap de numeração, relatórios por item, auditor SPED) · **Enterprise sob consulta**.
- **SIEG:** preços **não publicados em 2026** (a tabela R$223/470/800 do doc 15 não foi reconfirmada nesta rodada — **tratar como histórico não-verificado**).
- **Qive / Jettax / e-Auditoria / Klaus / PlugNotas:** **preço oculto** ("fale com vendas") — confirma o fosso de transparência.
- **Storage:** ~7KB por XML; custo de armazenamento é desprezível (ordem de US$2 / 500GB). A retenção longa **não é gargalo de custo** — o gargalo de COGS é a **chamada de captura por CNPJ** (D2: ~R$6,35/CNPJ se indiscriminada).

---

## 5. O que a NOSSA Captura tem hoje vs o GAP

### 5.1 O que existe (em `apps/contador/app/captura/`)
**É uma DEMONSTRAÇÃO navegável com base sintética em memória** — explicitamente não conectada ao core (`captura-model.ts` linha 1–15). O que está implementado:
- ✅ **UI/UX completa**: KPIs, status por cliente, lançamento manual de nota, filtros, busca, drill-down.
- ✅ **Modelo de domínio sólido**: tipos `TipoDocumento` (nfe/cte), `NaturezaNota` (compra/venda derivada), `ClasseInsumo` (◆ XML 1ª / ◇ OCR 2ª), `EstagioCaptura` (capturada/processada), `ModoCaptura` (upload/provider).
- ✅ **Classificação compra/venda** (derivada de emitente/destinatário) — conceito certo.
- ✅ **Captura seletiva por design** (`capturaAtiva` default OFF — decisão D2 já refletida na UI).
- ✅ **Multiempresa conceitual** (3 clientes demo) + status por cliente derivado.
- ✅ **Linguagem segura G6** (não promete crédito/apuração) — maduro.
- 🟡 **Conceito de Cofre** presente, **mas com o número errado ("15 anos")**.

### 5.2 O GAP (o que falta pra competir — mapeado contra §3.1)

| Table-stake | Status hoje | Gap |
|-------------|-------------|-----|
| **T1** NFeDistribuicaoDFe/NSU | ❌ | **Maior gap.** Zero captura real. Precisa do provider (D2) ou scheduler NSU próprio. |
| **T2** A1/A3 | ❌ | Modo "provider" é fake. Captura real = Fase 5. |
| **T3** 5 docs | 🟡 só NF-e/CT-e como tipo | Faltam **NFC-e, NFS-e, MDF-e**. |
| **T4** Manifestação | ❌ | Inexistente. |
| **T5** Dedup | ❌ na Captura | **Existe no Documentize** (hash perceptual) — reaproveitar. |
| **T6** Compra/venda | ✅ | OK (sintético, mas correto). |
| **T7** Alerta cancelada/denegada | ❌ | Inexistente. Importante (escriturar nota cancelada é erro grave). |
| **T8** Gap de numeração | ❌ | Inexistente. |
| **T9** Cofre/retenção | 🟡 | Existe conceito; **corrigir "15 anos"→5**; sem persistência real. |
| **T10** Export XML/PDF/Excel | ❌ | Inexistente. |
| **T11** Multiempresa | 🟡 | Demo 3 clientes; falta escala/schema real. |
| **T12** Canais (e-mail/pasta) | ❌ | Só upload. **OCR existe no Documentize** (D-b). |

**Resumo do gap:** temos **a casca certa (UI + modelo + posicionamento)** e **dois ativos reaproveitáveis no Documentize** (dedup por hash + OCR/extração). Falta **todo o motor de captura real** — e a decisão D4 já diz pra **não construí-lo antes de validar pagamento** (Concierge MVP primeiro). Ou seja: o gap é **intencional nesta fase**. Quando construir, o caminho mais barato e seguro é **comprar a captura de provider** (D2: PlugNotas/Focus, **nunca Nuvem Fiscal**) e investir o nosso esforço em T5/T7/T8/T9 (dedup + alertas + cofre + observabilidade), que é onde diferenciamos por execução (D-f).

---

## 6. Recomendação (síntese p/ o produto)

1. **MVP da Captura = os 12 table-stakes**, comprando T1/T2 do provider (D2). Nosso código próprio foca em **T5+T7+T8+T9+T11+T12** (a camada de valor sobre o dado bruto do provider).
2. **Corrigir já** o "15 anos" no app e nos docs → "guarda durante o contrato, mínimo legal 5 anos; retenção estendida como serviço opcional".
3. **Provider:** PlugNotas (Tecnospeed) ou Focus — **excluir Nuvem Fiscal** (morre 31/07/2026). Validar **preço por documento/CNPJ** com cada um (oculto na web; pedir cotação).
4. **Diferenciar por:** (a) **observabilidade da captura** — mata a queixa nº1 do mercado; (b) **novos docs** NFCom/NF3e/BP-e; (c) **trilha de boa-fé desde a captura** (liga ao moat); (d) **preço transparente**.
5. **Não construir** o scheduler NSU próprio na v1 (é o componente mais arriscado — 20/h + bloqueio 1h). Comprar. Reavaliar só se o COGS do provider matar a margem.

---

## 7. Fontes (URLs primárias)

**Qive (ex-Arquivei):**
- https://qive.com.br/solucoes/por-documento/nfe — A1/A3, manifestação, alerta de divergências, doc types
- https://qive.com.br/funcionalidades/importacao-e-download-de-xml — canais (e-mail, Sincroniza Notas, pasta 15min), export XML/PDF/Excel, upload 20 arquivos/50MB
- https://developers.qive.com.br/docs/post/v2/dfe/nfe — API
- https://qive.com.br/blog/consumo-indevido-consulta-nfe — rejeição 656
- https://qive.com.br/blog/quanto-tempo-guardar-xml-notas-fiscais — prazo de guarda

**Jettax:**
- https://www.jettax.com.br/modulos/federal/ — captura A1, NFe/CTe/CFe/NFC-e 24/7
- https://www.jettax.com.br/modulos/servicos/ — NFS-e +2.000 municípios
- https://www.jettax.com.br/blog/baixar-xml-de-nf-e-automaticamente-guia-completo-para-escritorios-contabeis-2/ — manifestação opcional

**Fiscal.io / Fiscal Monitor:**
- https://fiscal.io/monitor/funcionalidades — docs (NFe/NFSe/CTe/MDFe/NFCe/CFeSAT + eventos), download sem manifestação
- https://fiscal.io/monitor/download-de-xml — NSU gap reprocess, completude
- https://fiscal.io/monitor/planos — **preços R$0 / R$255 / R$479 + Enterprise** (transparente)
- https://conteudo.fiscal.io/como-baixar-nfe-e-cte-certificado-contabilidade-procuracao-eletronica/ — certificado/procuração

**e-Auditoria:**
- https://www.e-auditoria.com.br/blog/captura-de-nfe-por-que-o-seu-sistema-precisa-disso-agora/ — A1/A3 + RPA + e-mail + API + **OCR PDF→XML**, manifestação, detecta cancelada/duplicada
- https://www.e-auditoria.com.br/blog/captura-automatica-de-df-e-com-ia-guia-completo-para-contadores/ — monitor de pasta, query SEFAZ, integração SIEG 5 anos

**SIEG (HUB/Cofre/IriS):**
- https://portalsieg.kinsta.cloud/hub/ — captura NF-e/NFC-e/NFS-e/CT-e/CF-e/MDF-e, AutodocS, +1.200 municípios, 5 anos por chave
- https://portalsieg.kinsta.cloud/blog/cofre-sieg-entenda-o-que-e-e-quais-as-suas-funcionalidades/ — **Cofre = mínimo 5 anos, AWS**
- https://www.contabeis.com.br/noticias/53959/sieg-hub-a-ferramenta-mais-poderosa-para-gestao-de-documentos-fiscais/

**Klaus Fiscal:**
- https://klausfiscal.com.br/blog/novo-prazo-de-guarda-de-xml-entenda-o-que-muda-e-o-que-nao-muda-com-o-ajuste-sinief-no-2-2025 — **SINIEF 02/2025 = 132 meses só p/ fisco; empresa = 5 anos**

**PlugNotas (Tecnospeed):**
- https://plugnotas.com.br/nfe/ — API DFe, white-label
- https://atendimento.tecnospeed.com.br/hc/pt-br/articles/360009557213 — consulta Distribuição DFe (origem=2)
- https://docs.plugnotas.com.br/ — documentação API

**Mecanismo oficial / limites técnicos:**
- https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=wLVBlKchUb4%3D — **NT 2014.002 NFeDistribuicaoDFe**
- https://focusnfe.com.br/blog/rejeicao-656/ — **20 consultas/h, bloqueio 1h, cStat 137**
- https://atendimento.tecnospeed.com.br/hc/pt-br/articles/16489514203415 — **656: aguardar 1h após 137**
- https://tributos.io/blog/documentos-fiscais/nfedistribuicaodfe-consulta-df-e-por-nsu-e-fim-do-nfeconsultadest — NSU, fim do NfeConsultaDest

**Descontinuações / janela 2026:**
- https://www.nuvemfiscal.com.br/suporte/ — **Nuvem Fiscal desativada 31/07/2026** (comunicado 22/04/2026)
- https://www.reformatributaria.com/tecnologia/api-do-danfse-sera-descontinuada-em-julho-de-2026-... — **DANFSe API sai 01/07/2026**
- https://sindilojas-sp.org.br/sat-fiscal-sera-substituido-pela-nfc-e-a-partir-de-janeiro-2026/ — **CF-e SAT proibido 01/01/2026 (SP), NFC-e único**
- https://www.gov.br/fazenda/.../nfs-e-sera-obrigatoria — **NFS-e Nacional obrigatória 2026**

**Retenção legal:**
- https://www.legisweb.com.br/noticia/?id=30563 — novo prazo guarda DF-e
- https://www.serasaexperian.com.br/conteudos/prazo-para-guardar-documentos-fiscais/ — 5 anos
- https://www.premiercontabil.com.br/post/novo-prazo-para-guarda-de-documentos-fiscais — SINIEF 02/2025

**Reforma / novos docs:**
- https://blog.tecnospeed.com.br/sat-nfce/ — fim SAT/MFe → NFC-e
- https://www.reformatributaria.com/tecnologia/nota-tecnica-atualiza-documentos-fiscais-eletronicos-com-novos-campos-... — NFCom/NF3e/BP-e
