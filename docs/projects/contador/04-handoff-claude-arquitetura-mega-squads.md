# Projeto Contador - Handoff Claude: Arquitetura de Mega Squads

Data: 2026-05-29
Status: pronto para sessao Claude interativa
Chamador: @aios-master / Orion

## Objetivo

Montar a arquitetura de squads, agentes e mind clones que vao participar do Projeto Contador, com mega squads e especialistas de alto nivel em suas respectivas areas.

Este artefato existe para preservar o contexto antes da sessao Claude interativa. A resposta do Claude deve voltar para o AIOS e virar uma arquitetura versionada com squads, gates, donos e proximos artefatos.

## Contexto do projeto

Projeto: **Radar Fiscal + Operacao do Escritorio Contabil**

Produto:

- Central operacional para escritorios contabeis acompanharem clientes, documentos, obrigacoes, prazos, responsaveis e riscos.

ICP inicial:

- Escritorios contabeis pequenos e medios.
- 5 a 40 colaboradores.
- Carteira de 50 a 500 CNPJs.

Regime inicial:

- MEI.
- Simples Nacional.

Wedge:

- Obrigacoes.
- Pendencias.
- Documentos.
- SLA.
- Risco de CNPJ inapto.
- Reforma Tributaria como gatilho comercial.

Fora do MVP:

- Apuracao tributaria completa.
- Escrituracao completa.
- Substituir Dominio, Alterdata, Fortes, Questor ou similares.
- Armazenar certificado A1.
- Scraping e-CAC em massa.
- Envio fiscal automatico sem aprovacao humana.

## Prompt para Claude interativo

```text
Contexto: Projeto Contador / Radar Fiscal + Operacao do Escritorio Contabil no AIOS.

Objetivo: montar a arquitetura de squads/agentes/mind clones que vao participar do projeto, com "mega squads" e os melhores especialistas do mundo em suas respectivas areas.

Base do projeto:
- Produto: central operacional para escritorios contabeis acompanharem clientes, documentos, obrigacoes, prazos, responsaveis e riscos.
- ICP inicial: escritorios contabeis pequenos/medios, 5-40 colaboradores, 50-500 CNPJs.
- Regime inicial: MEI + Simples Nacional.
- Wedge: obrigacoes, pendencias, documentos, SLA, risco de CNPJ inapto e Reforma Tributaria como gatilho comercial.
- Fora do MVP: apuracao tributaria completa, escrituracao completa, substituir Dominio/Alterdata/Fortes, armazenar certificado A1, scraping e-CAC em massa, envio fiscal automatico.

Quero uma proposta de arquitetura organizacional com:
1. Squads principais e seus objetivos.
2. Chief/dono de cada squad.
3. Especialistas AIOS e mind clones recomendados para cada squad.
4. Responsabilidades, decisoes que cada squad pode tomar e decisoes que exigem council/human approval.
5. Ordem de ativacao dos squads nas fases: discovery, PRD, arquitetura, MVP concierge, MVP SaaS, go-to-market.
6. Riscos de ter squads demais e como manter governanca leve.
7. Uma versao "full mega squad" e uma versao "lean execution squad" para comecar agora.

Considere especialistas como:
- Produto/discovery: Marty Cagan, Teresa Torres, Steve Blank.
- Posicionamento/oferta: April Dunford, Alex Hormozi, Joanna Wiebe, Matt Dixon.
- Arquitetura/engenharia: Martin Fowler, Sam Newman, Werner Vogels, Kelsey Hightower.
- Seguranca: Bruce Schneier, Troy Hunt, Kevin Mitnick.
- Privacidade/LGPD: Patricia Peck, Ann Cavoukian.
- Dados/BI: Joe Reis, Chip Huyen, Edward Tufte, Cassie Kozyrkov.
- UX: Don Norman, Kat Holmes, Julie Zhuo.
- CS/onboarding: Lincoln Murphy, Nick Mehta.
- Financas/pricing: Aswath Damodaran, Patrick Campbell.
- Operacao/qualidade: Gene Kim, Nicole Forsgren, Jez Humble.
- AI/automation: Andrew Ng, Simon Willison, Lilian Weng.

Formato desejado: documento estruturado, objetivo e acionavel, em portugues.
```

## Resultado esperado ao voltar para o AIOS

Quando a resposta do Claude voltar:

1. Consolidar em `docs/projects/contador/05-arquitetura-mega-squads.md`.
2. Definir squads oficiais, chiefs, membros, gates e artefatos.
3. Atualizar `03-status-e-proximos-passos.md`.
4. Criar ou atualizar Story 0.1 em `docs/stories/`, se o founder aprovar iniciar o fluxo formal.
5. Quebrar proximos trabalhos em PRD, discovery, matriz de obrigacoes, LGPD/seguranca e arquitetura tecnica.

## Observacoes de governanca

- Push segue exclusivo via @devops.
- Codigo so depois de story aprovada.
- Decisoes materiais de arquitetura, seguranca, privacidade, precificacao e UX exigem consulta a mind clones antes de fechamento.
- Human approval obrigatorio para qualquer acao externa, gasto, deploy, envio a terceiros ou mudanca irreversivel.
