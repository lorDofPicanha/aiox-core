---
name: project-contador-painel-cockpit
description: Painel/cockpit do Contador — read-only ok, mas 2 vieses de "top item": auditoria gateia por materialidade-vs-bloqueio e some; transação expõe gancho.meio único (PAR-7 proíbe).
metadata:
  type: project
---

Painel do escritório (`apps/contador/app/painel/page.tsx`) — composição read-only que agrega o sinal-manchete de 6 frentes. Gate QA: CONCERNS.

**O que está certo (não re-litigar):** zero write-path (só listar/carregar/resumir/verificarCadeia); nenhum join fake (a única reconciliação é o MAPA_CLIENTE_ECAC_CORE explícito DENTRO de health-score-data, não no painel); manchetes reproduzem fielmente os números das fontes (pendentes.length, resumoHealth.criticos, ganchoPotencialTotal=soma meio igual à KPI da página transação); refIso injetado via new Date().toISOString() repassado aos engines; empty-degrada limpo (scoreMedio ?? "—", verificarCadeia([]) ok); Nav /painel 1º + Carteira `/` exact-match intacto.

**Why (os 2 achados que rebaixaram p/ CONCERNS):**
1. Auditoria "O que revisar primeiro" usa `fila[0]` (fila é ordenada por MATERIALIDADE desc) e só mostra `if topFila.bloqueiaAutoAprovacao`. No seed: fila[0]=Pneu R$32.100 banda ALTA (não bloqueia) → guard falha → frente auditoria SOME do urgente, mas existe Óleo R$15.600 banda BAIXA que BLOQUEIA e fica escondido. Deveria fazer `fila.find(l => l.bloqueiaAutoAprovacao)`, não gatear o `[0]`.
2. A linha de transação no "revisar primeiro" exibe `brl(topTransacao.gancho.meio)` — gancho.meio como número ÚNICO. PAR-7/G6 proíbe: o módulo transação SEMPRE mostra faixa `min – max`; meio é ranking-only (JSDoc do GanchoHonorario: "nunca exibido como valor certo"). Fix: exibir `brl(min) – brl(max)`.

**How to apply:** ao revisar telas-agregadoras deste app, o risco real não é o número da manchete (esses batem) — é (a) o "top item" que gateia/filtra a fonte e cria omissão silenciosa, e (b) qualquer ponto-médio exibido per-item na frente transação. Liga [[project_contador_par7_transacao]] e [[project_contador_s12_health_score]].
