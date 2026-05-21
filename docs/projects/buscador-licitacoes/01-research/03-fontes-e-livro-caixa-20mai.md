# Pesquisa 20/Mai — Fontes Reais do Buscador + Sistemas de Livro Caixa

**Contexto:** Call real com a cliente revelou que as fontes do buscador são outras (não as assumidas em v3) e que o livro caixa é um módulo separado. Pesquisa para reconciliar.

**Fontes desta pesquisa:** WebSearch real (não clones). Links no fim de cada seção.

---

## PARTE 1 — As 5 fontes do buscador (perfil de integração)

A cliente busca editais em: **BLL, BNC, Portal de Compras Públicas, SISLOG, PNCP.**

### 1.1 PNCP — Portal Nacional de Contratações Públicas
- **O que é:** Agregador FEDERAL obrigatório por Lei 14.133/2021. Toda contratação pública precisa publicar aqui.
- **API:** REST pública e gratuita (`https://pncp.gov.br/pncp-api/v1`), sem autenticação para consulta. **Limitação: só polling, sem webhook.** Lag de indexação D+1 a D+2 vs. publicação no diário oficial.
- **Papel no produto:** **Base de descoberta (Stage 1).** Como SISLOG, BLL e BNC integram/enviam ao PNCP por obrigação legal, o PNCP funciona como denominador comum para *encontrar* editais de todas as fontes.

### 1.2 Portal de Compras Públicas (PCP)
- **O que é:** GovTech privada de licitações criada em 2016 (pregão eletrônico, concorrência, dispensa). É a plataforma que Águas Lindas-GO usa.
- **API:** **API pública documentada** em `apipcp.portaldecompraspublicas.com.br` — "Consulta pública de processos via API". Requer **chave de integração** via formulário (enviada em até 7 dias úteis). Há "Biblioteca de Dados" para parceiros.
- **Papel:** Melhor caminho de API entre as plataformas privadas. **Ação concreta: solicitar chave.**

### 1.3 BNC — Bolsa Nacional de Compras
- **O que é:** Bolsa privada de compras públicas; prefeituras, câmaras e órgãos. Centraliza editais e pregões.
- **API:** Oferece API para "integração com Sistemas de Gestão", relatórios automáticos, envio de atas/contratos ao PNCP e **notificação de editais por e-mail**. A API é orientada à integração de sistema de gestão/órgão — acesso de consulta ao licitante a confirmar.
- **Papel:** Feed de notificação por e-mail viável já. Busca por nº de processo, palavra-chave, órgão, modalidade, status.

### 1.4 BLL Compras — Bolsa de Licitações
- **O que é:** Maior bolsa privada do país (desde 2008, 3.000+ órgãos). 100% gratuita para o fornecedor.
- **API:** Integra 150+ sistemas de gestão + PNCP + TransfereGov. **Não há API aberta de consulta documentada.** A automação de lances é feita por **robôs-parceiros** — ex.: **Lance Fácil** (lances automáticos + monitoramento de chat).
- **Papel:** Editais descobríveis via PNCP. Monitoramento de sessão/lance = scraping próprio OU integração com robô.

### 1.5 SISLOG — ⚠️ é o sistema do ESTADO DE GOIÁS
- **O que é:** Sistema eletrônico de logística/compras do **Estado de Goiás** (`sislog.go.gov.br`), da SEAD/Superintendência Central de Compras. **Substitui o COMPRASNET.GO.** Modalidades: pregão, dispensa eletrônica, concorrência, leilão.
- **Integração:** Integrado a PNCP + AFT + SIOFI.net + SGC + SEI. **Sem API de desenvolvedor pública documentada.** Cadastro de fornecedor no portal.
- **Papel:** Editais fluem para o PNCP. Monitoramento de sessão = scraping autenticado.
- **🚨 Implicação:** SISLOG é GO estadual → a empresa-licitante opera no **Goiás estadual**, não só "Águas Lindas + DF". Escopo geográfico do projeto precisa ser reaberto.

### 1.6 Síntese — Discovery vs. Disputa

| Estágio | Cobertura | Dificuldade |
|---|---|---|
| **Stage 1 — Monitorar (descoberta de editais)** | PNCP API (cobre as 5 por integração legal) + PCP API própria + scraping leve para o lag D+0/D+1 | 🟢 Viável |
| **Stage 5 — Acompanhar/Lances (DOR #1 da cliente)** | Por-plataforma, tempo real. Nenhuma oferece webhook de "movimentação" ao licitante | 🔴 Difícil — scraping de sessão autenticada OU robô-parceiro (Lance Fácil) |

**Decisão de arquitetura levantada (D3):** o Stage 5 — que é a DOR #1 declarada no áudio ("perdi licitação por não acompanhar") — é a parte mais cara de integrar. Há competidor pronto (Lance Fácil) que já faz monitoramento de chat + lance automático em BLL/BNC. Avaliar **integrar/parcerizar vs. construir scraper próprio por plataforma**.

**Sources Parte 1:**
- [BLL Compras](https://bll.org.br/) · [Integração +Brasil BLL](https://bll.org.br/noticias/integracao-plataforma-brasil/) · [Lances Automáticos BLL — Lance Fácil](https://www.lancefacil.com/Lances-Automaticos-BLL-Compras)
- [Portal de Compras Públicas — API doc](https://apipcp.portaldecompraspublicas.com.br/comprador/apidoc/) · [PCP consulta via API (parceiros)](https://bibliotecapcp.zendesk.com/hc/pt-br/articles/4593549708570) · [API Compras Governamentais](https://api.compras.dados.gov.br/)
- [BNC — Bolsa Nacional de Compras](https://bnc.org.br/) · [BNC editais](https://bnc.org.br/editais/)
- [SISLOG Goiás](https://sislog.go.gov.br/) · [Seinfra 1º pregão pelo Sislog](https://goias.gov.br/seinfra/seinfra-realiza-primeiro-pregao-eletronico-do-estado-pelo-sislog/)

---

## PARTE 2 — Sistemas de Livro Caixa (OSS + mercado)

**Decisão da cliente:** livro caixa é **separado** do buscador. Pergunta do founder: existe algo open source que faça isso?

### 2.1 OSS GitHub (projetos pequenos) — ❌ não recomendados
fx-financas, web-budget, LivroCaixa (arteiroxyko/alexandrellemes), SYS-ADM-FC, Full Finanças, GF-Home. São projetos pessoais/educacionais em PHP/JS, **sem robustez fiscal nem suporte**. Servem de referência de código, não de produto.

### 2.2 OSS production-grade — ⚠️ sem localização fiscal BR
| Ferramenta | Pontos fortes | Limitação BR |
|---|---|---|
| **Akaunting** | Free, web, multi-empresa, invoicing + despesas + relatórios. Melhor "livro caixa OSS" para PME | Sem DRE/livro caixa fiscal BR nativo; precisa customização |
| **ERPNext** | ERP completo (contabilidade, CRM, estoque, RH), alternativa open-source ao SAP/Xero | Complexidade alta de implantação; localização BR via módulos terceiros |
| **InvoiceNinja** | Foco em faturamento/cobrança, time-tracking | Não é livro caixa; sem fiscal BR |

### 2.3 SaaS BR (já localizados) — ✅ melhor fit
| Ferramenta | O que entrega | Observação |
|---|---|---|
| **Granatum** | Plano único: fluxo de caixa + **DRE** + conciliação bancária + **import OFX** + integração bancária automática | Mais direto ao conceito "livro caixa" |
| **Conta Azul** | ERP: fluxo de caixa diário, categorias, contas a pagar/receber, centros de custo | Mais ERP/contábil |
| **Bling** | Conciliação bancária + import OFX + lançamentos automáticos + DRE | Forte em e-commerce/NF |
| Nibo, Omie, Tiny, eGestor, MarketUP | Variações de gestão financeira PME | Comparar preço/feature |

### 2.4 Recomendação
Para 3 empresas com necessidade fiscal brasileira, **adotar um SaaS BR (ex.: Granatum, ~R$50-150/mês)** em vez de construir. Motivos:
1. **É commodity resolvida** — OFX + categorização + DRE + conciliação já existem prontos e localizados.
2. **Construir do zero (plano v3: Pluggy + IA + auto-DRE)** era over-engineering para algo que não é o moat.
3. **O moat do produto é a licitação** (Stages 2/3/5/6), não o financeiro.
4. Se no futuro a integração backstage (livro caixa ↔ habilitação Stage 4, p/ Auto-BP/DRE em dossiê) virar diferencial real, reabre-se a decisão — mas só então.

**Sources Parte 2:**
- [Akaunting open-source accounting](https://akaunting.com/open-source-accounting-software) · [Open-source Xero alternatives](https://blog.octabyte.io/posts/open-source-xero-alternatives/)
- [github topic: gestao-financeira](https://github.com/topics/gestao-financeira) · [fx-financas](https://github.com/JoaoG23/fx-financas) · [web-budget](https://github.com/arthurgregorio/web-budget)
- [Granatum — Livro Caixa guia](https://www.granatum.com.br/blog/livro-caixa) · [Granatum — formato OFX](https://www.granatum.com.br/blog/formato-ofx)
- [9 melhores sistemas de fluxo de caixa 2026](https://www.infinitepay.io/blog/sistema-de-fluxo-de-caixa) · [Conta Azul fluxo de caixa](https://contaazul.com/funcionalidades/fluxo-caixa-diario/) · [Bling conciliação bancária](https://ajuda.bling.com.br/hc/pt-br/articles/360051642334)

---

## Próximos passos sugeridos (decisões D1-D5 no CONTEXT §10.6)
1. Confirmar UFs onde a empresa-licitante está cadastrada (define escopo real de fontes).
2. Priorizar P0/P1 entre as 5 plataformas (frequência real de uso).
3. Decidir Stage 5: integrar robô (Lance Fácil-like) vs. scraper próprio.
4. Decidir livro caixa: adotar Granatum/SaaS BR (recomendado) vs. build.
5. Mapear papéis dos 4 usuários do buscador.
