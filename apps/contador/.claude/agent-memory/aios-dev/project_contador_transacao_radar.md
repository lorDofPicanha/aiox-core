---
name: contador-transacao-radar
description: PAR-7 Radar de Transação Tributária (app/transacao/) — engine puro de elegibilidade + gancho de honorário D6, frente juridicamente sensível
metadata:
  type: project
---

PAR-7 (frente Parcelamento) é o "radar de transação tributária" em `apps/contador/app/transacao/` — INTELIGÊNCIA + GANCHO DE HONORÁRIO, NÃO automação. Espelha o gabarito `app/parcelamentos/` mas é engine NOVO/complementar (portão handoff 57 §6: NÃO reescrever parcelamentos-model.ts).

**Estrutura (fatia [build], adapter S6 dívida ativa = gate do founder):**
- `transacao-model.ts` — engine PURO `classificarElegibilidade` (4 níveis: forte/condicional/requer_analise/nao_elegivel) + `calcularGancho` (success-fee D6 sobre valor da DA, % por porte) + `classificarCarteiraTransacao` (ranking por gancho.meio DESC) + `resumirTransacao`. Parâmetros NOMEADOS exportados: `FAIXA_VALOR_DA` (piso 5k / tetoPequeno 1M / tetoMedio 2M), `IDADE_DA_CONSOLIDADA_DIAS`=540, `IDADE_DA_MINIMA_DIAS`=90, `DESCONTO_PERMITIDO_EM_TESE`, `HONORARIO_SOBRE_DA`. "Hoje" por parâmetro (refIso); zero Date.now/rede/FS.
- `transacao-data.ts` — seed ~8 perfis (`PerfilFiscalSeed`), idade da inscrição ancorada em refIso. clienteId reusa esquema `cli-*` do parcelamentos (alguns coincidem de propósito p/ cruzamento futuro).
- `transacao-provider.ts` — `MockTransacaoProvider` + contrato `PerfilFiscalBruto`/`TransacaoProvider`. Dialeto Infosimples/PGFN-Regularize isolado no adapter S6 futuro (FF-1).
- `page.tsx` (force-dynamic) + `TransacaoExplorer.tsx` (tabela ranking + drill-down do breakdown explicável + caveats) + `transacao.module.css`.
- `transacao-model.test.mjs` — 43 asserções, runner `.mjs`→`.ts` (Node24 type-stripping). Script `test:transacao` no package.json.

**G6 EXTRA-RIGOROSO (frente legal) — a regra-chave:** o banlist-g6 só pega uma LISTA FIXA de regex (garante crédito/elimina multa/etc.). Para esta frente, os termos perigosos ("garante desconto", "reduz a dívida", "regulariza", "quita", "economia garantida", "adesão automática") NÃO estão no regex → tem que ler à mão. Todos aparecem na UI SÓ negados ("não regulariza", "não quita", "sem economia garantida"). Vocabulário seguro obrigatório: "potencialmente elegível", "edital/modalidade aplicável EM TESE", "faixa de desconto PERMITIDA pelo edital em tese (teto legal, não concedida)", "gancho de honorário", "o tributarista conduz a adesão", "sem promessa de resultado". Ação human-in-loop = "encaminhar ao tributarista" (sinaliza, em memória), nunca adere.

**Follow-ups pro founder:** (1) adapter S6 dívida ativa real (Infosimples/PGFN-Regularize); (2) recalibração dos pesos/faixas com tributarista (HONORARIO_SOBRE_DA e DESCONTO_PERMITIDO_EM_TESE são ilustrativos); (3) unificação de id por CNPJ entre core(UUID)/e-CAC(curto)/parcelamento+transacao(cli-*). Ver [[contador-ecac-saude-fiscal]], [[contador-module-pattern]], [[contador-g6-language]].
