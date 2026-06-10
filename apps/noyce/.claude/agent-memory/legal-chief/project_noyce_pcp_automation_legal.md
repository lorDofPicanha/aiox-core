---
name: noyce-pcp-automation-legal
description: Veredito jurídico sobre automação autônoma do Noyce no Portal de Compras Públicas (PCP/ECUSTOMIZE) — tem VEDAÇÃO EXPRESSA a scraping (≠ silêncio do BLL) mas oferece API oficial
metadata:
  type: project
---

Parecer Legal Chief 2026-06-09 sobre o Noyce (agente de licitações da ENIAC) atuar autonomamente no **Portal de Compras Públicas (PCP)** — operadora PRIVADA **ECUSTOMIZE Consultoria em Software S/A**. Relatório: `D:\AIOS\docs\projects\buscador-licitacoes\03-legal\pcp-tos-automacao-review.md`. Replica framework do [[noyce-bll-automation-legal]].

**🔴 DIFERENÇA DURA vs BLL:** o BLL era SILENTE sobre robô/scraping; o **PCP TEM VEDAÇÃO EXPRESSA** no Regulamento:
- **Item 5.3.1.1:** mau uso = "coletar informações de modo automatizado sem permissão expressa da ECUSTOMIZE".
- **Item 5.3.1.2:** proíbe "deep-link, page-scrape, robôs, spider ou outro dispositivo automático" para recuperar/copiar/monitorar/reproduzir a estrutura do portal.
- **Item 6.7.2.1:** bloqueio do acesso após notificação, sem responsabilização da ECUSTOMIZE.
- Automação externa lesiva = **ato ilícito civil** (CC arts. 186/187/927/944 — invocados pelo próprio regulamento → dever de reparar).

**MAS — vedação NÃO é absoluta:** salva-se em "sem permissão expressa". O PCP **aceita integração via API/webservices e bots de lance** (canal autorizado existe — confirmado via effecti). Item **5.2** = consulta pública de processos + download da íntegra do edital SEM login (igual BLL Art. 5/9). Senha pessoal/intransferível + responsabilidade integral do licitante = igual BLL.

**Veredito calibrado (política do cliente: máquina ~95%, humano dá o clique vinculante):**
- LER pontual / analisar / habilitação / RASCUNHAR proposta-declaração-recurso / alertar = PODE SOZINHO (allowedNow, não depende de vault).
- DESCOBERTA/MONITORAMENTO automatizado = PODE C/ MITIGAÇÃO FORTE — 🔴 trava nova: precisa de **API oficial OU permissão expressa ECUSTOMIZE OU coletar do PNCP (dado aberto) em vez de raspar o PCP**. Sem um dos três = ilícito contratual 5.3.1.2.
- Login autenticado leitura/download do certame ENIAC = PODE C/ MITIGAÇÃO (vault, API se houver).
- LANCE = semiautônomo, HUMANO CONFIRMA O CLIQUE (PCP admite bot de lance via integração; IN 67/73 + TCU Ac. 2071/2025).
- DECLARAR / PROPOR / RECORRER = máquina RASCUNHA, HUMANO ENVIA (clique vinculante humano).
- PROIBIDO POR DESIGN: scraping externo não autorizado (item 13) + raspagem de dado pessoal de terceiros (LGPD+5.3.1.2+CC, tripla exposição) + burla de intervalo de lance.

**Comparação BLL:** para SCRAPING/descoberta = PCP MAIS RESTRITIVO (ilícito expresso vs silêncio). Para LANCE via canal autorizado = PCP igual/ligeiramente MAIS permissivo (API/bot homologado existe). Síntese: PCP não fecha a porta, troca a fechadura — precisa da CHAVE (API/permissão) ou usa OUTRA PORTA (PNCP). Com gate resolvido, autonomia entregável = mesma dos dois portais.

**Gatilho blocked_until_vault → allowedNow:** PCP exige DOIS gates (vault técnico/LGPD + trilho de coleta autorizado contratual), não um. Recomendação de arquitetura limpa: **descoberta via PNCP/dado aberto (sem tocar o PCP); ação autenticada no PCP só no certame específico da ENIAC**.

**Why:** ENIAC quer "fazer tudo sozinho exceto atos vinculantes"; no PCP o método de COLETA virou variável jurídica de 1ª ordem (diferente do BLL).
**How to apply:** antes de ligar monitoramento automatizado do PCP, resolver o gate de coleta (contatar ECUSTOMIZE p/ API/permissão OU rotear descoberta pelo PNCP). Scraping externo do PCP = bloqueado por design. Conferir numeração exata das cláusulas no PDF oficial. Mind clones: marcal-justen-filho (vinculação ao edital, maior autonomia=maior responsabilidade), joel-de-menezes-niebuhr (lance mecânico vs recurso=peça jurídica).
