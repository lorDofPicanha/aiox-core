# Tech Research — Os Melhores Sistemas do Mercado (o que integrar no nosso)

> Pesquisa de fontes primárias (sites oficiais, docs SERPRO/Receita, páginas de planos, reviews) sobre os melhores sistemas contábeis/fiscais BR. Objetivo: **pegar o melhor de cada um e integrar no nosso**. 4 clusters pesquisados em paralelo por agentes independentes.
> **Data:** 2026-06-10 · **Base:** `00-context/CONTEXT.md`, `10-prd`, `11-arquitetura` · **Método:** web real, sem channeling de clones (regra `feedback_no_hydra_style`).

---

## TL;DR estratégico

1. **Captura é commodity.** Qive, Jettax, Fiscal.io, e-Auditoria fazem bem. A captura por certificado A1/A3 + distribuição DF-e + manifestação dos 4 eventos é table-stakes — sem ela não há produto, mas não é onde se vence.
2. **A brecha real (whitespace) é a auditoria contra a referência da Reforma** — comparar tributação aplicada vs **cClassTrib/IBS/CBS** e cobrir os **novos documentos (NFCom/NF3e/BP-e)**. Ninguém chegou lá. É exatamente o nosso M1.
3. **e-CAC em lote é categoria LOTADA** (e-Auditoria, Acessórias, Jettax, Audire, Questor, Alterdata, Infosimples). Diferencial não pode ser "agregar" — tem que ser UX + preço + o combo com captura/auditoria + o onboarding de procuração sem atrito.
4. **Integra Contador (SERPRO) é a única via oficial** — usar direto, não construir robô de scraping. **Procuração eletrônica dispensa o certificado do cliente** (reforça a decisão do agente local: e-CAC roda server-side).
5. **Dois fossos de GTM abertos no mercado inteiro:** **preço transparente** (quase todos são opacos) e **suporte/confiabilidade** (queixa nº1 em TODOS os concorrentes).

---

## 1. Cluster Captura / Fiscal

| Sistema | Mecanismo | Destaque | Fraqueza |
|---------|-----------|----------|----------|
| **Qive** (ex-Arquivei) | A1/A3 → SEFAZ, 1ª captura ~30s; saídas via import | Benchmark de escala (3,8bi docs), manifestação 4 eventos, integra SAP/TOTVS/Oracle | Virou contas-a-pagar; auditoria rasa; preço opaco |
| **Jettax** | Só A1; manifestação 24/7; saídas via autXML | **Mais perto da nossa tese** — captura+auditoria(DIFAL/ICMS-ST/ISS/PIS/COFINS)+e-CAC monitor (Prevention). NFS-e 2.000+ municípios | Só A1; auditoria por regras fixas, sem cClassTrib |
| **Fiscal.io** | A1, consulta SEFAZ de hora em hora; eventos de terceiros; retroativo/bulk | Cobertura DFe mais ampla (MDF-e, retroativos), **preço por documento transparente** | É "encanamento", não plataforma |
| **e-Auditoria** | **Multicanal:** A1/A3 + RPA municipal + e-mail dedicado + API ERP + **OCR PDF→XML** | **Benchmark de auditoria/recuperação** (16k análises, 5 anos, R$5,2bi crédito identificado) | Complexidade; sem motor cClassTrib da Reforma |
| **Klaus** | Robôs configuráveis + e-mail | Flexibilidade de canais + BI | Escala menor, auditoria limitada |
| **Domínio/Onvio** | Import manual + Busca NF-e + API Onvio | Incumbente (~35k escritórios), ecossistema | Captura fraca/manual = a brecha que os outros exploram |

**Não encontrados na web:** G-TAX, IRIS/CIEG, VERI (provável nome interno/regional — confirmar com Renan). GOB existe mas é monitoramento de obrigações, não captura.

**A integrar (rankeado):**
1. Captura A1/A3 + distribuição DF-e SEFAZ + manifestação automática 4 eventos + saídas via autXML *(table-stakes)*.
2. Cobertura ampla: NF-e, NFC-e/CF-e SAT, NFS-e (mirar 2.000+ municípios), CT-e, MDF-e — e **já nascer com NFCom/NF3e/BP-e** (diferencial: maioria é fraca aí).
3. Captura de **eventos de terceiros** + **download retroativo/bulk** (Fiscal.io) — base de status sempre atualizada.
4. **OCR/PDF→XML como fallback** (e-Auditoria/ANFe) — captura mesmo sem XML.

---

## 2. Cluster Gestão / Obrigações

| Sistema | Forte em | Pricing |
|---------|----------|---------|
| **Neo Controle** | **e-CAC via API OFICIAL SERPRO** (caixa postal verde/amarelo/vermelho, situação fiscal em massa, **alerta de procuração vencida**) | Transparente R$76–881/faixa CNPJ |
| **Domínio Kolossus** | **Auditoria SPED×NF-e com plano de correção** — único concorrente sério do nosso core | Opaco |
| **Fortes** | **Melhor agenda de obrigações** (antecipação sábado/feriado configurável); Analisador Fiscal aponta campo exato; protocolo via Integra Contador | Opaco |
| **Questor (Quiu/e-Doc/Tareffa)** | Ecossistema mais alinhado: download A1/A3, e-CAC, **CND +2.000 certidões**, app+WhatsApp+log de leitura | Opaco |
| **Acessórias** | **Líder em comunicação:** Komunic (WhatsApp+confirmação leitura+log auditável IP), GED com cobrança recorrente de doc faltante | Opaco |
| **Confi** | +400 tarefas com **atualização legal automática**; WhatsApp com IA nativa | **Transparente R$250/R$500** |
| **GClick** | Log de leitura mais explícito (comprovante de abertura + reenvio automático) | **Transparente R$100 / R$50-usuário** |
| **TaskDo** | **Kanban nativo + Painel Societário** (raro) | Opaco |
| **MakroSystem** | 100% web, +130 rotinas, plano **gratuito** | Transparente grátis/R$195/R$395 |
| **Conta Azul / Omie** | **Open Finance líder** (10 bancos BCB), conciliação automática | Transparente R$30–130 |

**A integrar (rankeado):**
- **P0:** Robô e-CAC via **API oficial SERPRO** (modelo Neo/Fortes, não varredura local) · Auditoria cruzada **SPED×XML com plano de correção** (modelo Kolossus, com UX melhor + preço transparente) · Baixa automática por leitura de recibo.
- **P0 whitespace:** Portal/app único com **WhatsApp oficial nativo + log de leitura** (prova data/hora/IP estilo Acessórias) — ninguém junta os dois nativos.
- **P1 paridade:** Agenda paramétrica por regime + antecipação sábado/feriado (Fortes) · +400 rotinas pré-programadas com atualização legal (Confi) · Kanban nativo + Painel Societário (TaskDo) · Cobrança automática de doc faltante (Acessórias).
- **P2 upsell:** Robô de **CND nativo** (Questor) · Dashboard "clientes em risco"/health score (cruza com status fiscal real do e-CAC — só nós teríamos) · Custeio por cliente/colaborador (Fortes).
- **Não construir:** Open Finance/conciliação — integrar (Conta Azul/Omie são líderes), não reconstruir.

---

## 3. Cluster Auditoria / Recuperação / cClassTrib

| Sistema | Forte em | Risco/nota |
|---------|----------|-----------|
| **e-Auditoria** | Suíte completa: lê SPED/EFD/XML 5 anos, 16k análises, recuperação multi-tese (Tema 69, DIFAL Parecer SEI 71/2025, monofásico), e-Recuperador | Disclaimer fraco |
| **é-Simples** | **Especialista monofásico Simples**: 60 meses, segregação receita, **IA valida NCM pela descrição**, integração PGDAS nativa | "Simula acesso humano" = **zona cinza, evitar** |
| **Recupera Simples** | Success-fee, classificador por barcode+descrição+NCM, **gera PER/DCOMP** | Zero disclaimer (risco a explorar como nosso diferencial) |
| **Roit** | IA enterprise (1,8 PB), auditoria linha-a-linha SPED, split payment, módulos Reforma | Mercado enterprise — não atende nosso ICP (whitespace pra nós) |
| **Systax** | **31M regras**, **dupla apuração CBS/IBS simultânea**, atualização 48h, parceria Vertex | **Possível parceiro de base de dados** (CaaS) em vez de concorrente |
| **Taxcel** | TaxSheets (retificação SPED no Excel) + **tabela cClassTrib×CST IBS/CBS** pública | Ferramenta sobre Excel |

**Achados regulatórios (whitespace jurídico):**
- STF declarou **inconstitucional a multa isolada de 50%** por compensação não homologada de boa-fé. Persistem 75% ("não declarada") e 150% (declaração falsa).
- **Nosso diferencial possível:** classificar o **risco jurídico de cada PER/DCOMP** (administrativo seguro vs judicial vs borderline) + **trilha de proveniência (boa-fé)** que afasta 75/150%. **Ninguém faz** — Recupera/é-Simples têm zero disclaimer.
- **cClassTrib é commodity pública** (Taxcel/Tecnospeed/Econet publicam a tabela). O valor não é tê-la — é **classificar o item no código certo + validar NCM↔cClassTrib↔operação + detectar divergência**.

**A integrar (rankeado):**
1. Auditoria de divergência por item: aplicado vs referência (NCM→cClassTrib→CST + monofásico/ST), lendo SPED/EFD/XML 5 anos.
2. **Classificador NCM/cClassTrib com IA** sobre descrição + barcode, validando NCM↔operação↔cClassTrib *(o motor é o moat, a tabela não)*.
3. Recuperação monofásico Simples: segregação 60 meses + geração PER/DCOMP *(receita imediata, success-fee)*.
4. **Classificador de risco jurídico + trilha de proveniência** *(whitespace, mata a fraqueza dos rivais)*.
5. Dupla apuração transição (atual + CBS/IBS) — Systax é benchmark; vento de cauda do sunset 2027.
6. Multi-tese federal além do monofásico (exclusão ICMS/ISS/DIFAL da base PIS/COFINS).

**Build vs buy da base tributária:** montar do zero compete com 31M regras (Systax) / 1,8PB (Roit) — inviável. **Licenciar conteúdo (Systax/Vertex) OU partir da tabela cClassTrib pública + regras monofásico** (mais estreito, suficiente pro nicho Simples).

---

## 4. Cluster Infra Oficial (e-CAC / Integra Contador / NFS-e Nacional / DFe)

### Integra Contador (SERPRO) — usar direto, não scraping
- Barramento oficial: CAIXAPOSTAL (+Monitorar), SITFIS (situação fiscal massiva PF/PJ), PROCURACOES, DCTFWEB, PGDASD (declarar/emitir DAS em lote), DEFIS, MIT, PAGTOWEB, SICALC.
- **Preço por chamada:** ~R$0,24–0,96 (DAS completo ~R$0,96; envio DCTFWeb R$0,75). Faixas por volume.
- Auth: e-CNPJ do escritório → JWT. **CND dedicada incerta** (existe SITFIS; CND conjunta RFB/PGFN talvez via robô/Infosimples — validar).

### Procuração eletrônica — dispensa o certificado do cliente
- Cliente outorga procuração no e-CAC (gov.br Prata/Ouro); contador autentica com o **próprio e-CNPJ** via AUTENTICAPROCURADOR (termo XML assinado). **Não precisa do A1 do cliente.**
- ⚠️ Mudança 2025: novo fluxo "Autorizações de Acesso" exige o representante **validar** na aba Recebidas → passo de onboarding por cliente (gargalo de ativação — desenhar UX assistida).

### NFS-e Nacional (ADN/SEFIN) — emissão oficial GRATUITA
- LC 214/2025; padrão nacional desde 01/jan/2026; **Simples obrigado a emitir pelo Emissor Nacional a partir de 01/set/2026** (janela de timing forte).
- APIs em produção (01/out/2025): NFS-e POST/GET, DPS, Eventos, DANFSe (PDF), DFe (distribuição), parâmetros municipais. Requer A1/A3 ICP-Brasil + mTLS.

### Emissores via API (buy candidates)
- **Focus NFe** — barato/transparente (Solo R$89,90, Growth R$548 CNPJs ilimitados; extra R$0,10–0,12; garante município novo R$199 em 15d).
- **PlugNotas (Tecnospeed)** — perfil revenda/white-label.
- ❌ **Nuvem Fiscal — descontinuada 31/jul/2026, NÃO usar.**

### NFeDistribuicaoDFe — captura de entradas (notas contra o CNPJ)
- Modelo NSU; **armadilha:** após "nenhum documento" (cStat 137) esperar 1h, senão rejeição 656 + **bloqueio do CNPJ por 1h**. → exige **polling central único com controle de NSU por CNPJ + backoff**, nunca consulta distribuída.

### Decisões de integração recomendadas
1. **e-CAC em lote → Integra Contador direto** (oficial, barato). Gaps de CND/certidões estaduais → **Infosimples** (API), não robô próprio.
2. **Procuração → desenhar onboarding em torno do AUTENTICAPROCURADOR** (fluxo guiado de coleta = diferencial defensável).
3. **Emissor → API NFS-e Nacional oficial (gratuita) + Focus/PlugNotas como fallback municipal** legado.
4. **Captura de entradas → NFeDistribuicaoDFe via provider** (PlugNotas/Focus já resolvem orquestração de NSU) OU serviço central próprio com scheduler.
5. **Stack:** SERPRO Integra Contador + Infosimples (gaps) + API NFS-e Nacional + PlugNotas/Focus (fallback + DFe entrada). IP nosso = orquestração de procurações + painel único + motor de tributação correta.

**Ventos de cauda regulatórios:** DTE/Caixa Postal vira canal oficial obrigatório em 2026 + NFS-e Nacional obrigatória (Simples) set/2026. Timing alinhado com obrigatoriedade — janela curta antes da categoria consolidar.

---

## Síntese: onde nós vencemos

> O mercado é **forte em captura (commodity)** e **forte em auditoria legada (e-Auditoria/Kolossus)**. Está **fraco** em: (1) auditoria contra a **referência da Reforma (cClassTrib/IBS/CBS)** e novos documentos (NFCom/NF3e); (2) **classificação de risco jurídico + proveniência** da recuperação; (3) **preço transparente**; (4) **suporte/confiabilidade**; (5) o **combo** captura+auditoria+e-CAC+comunicação num produto só com comercial agressivo (o gargalo dos players técnicos).

Integramos a captura como commodity (pra ter o dado), mas o produto vence no **motor de auditoria da Reforma + recuperação com risco classificado + o combo + comercial do Renan**.
