---
name: contador-par7-transacao-g6-gaps
description: PAR-7 Radar de Transação — 2 furos reais que os 43 testes não pegam (idade null + banlist-g6 não cobre a frente legal de transação)
metadata:
  type: project
---

PAR-7 (`app/transacao/`) é frente juridicamente sensível: transação tributária (Lei 13.988/2020) = INTELIGÊNCIA + gancho de honorário (D6), nunca automação/promessa. Engine puro, 43 testes verdes, typecheck/banlist PASS. Revisão @qa achou furos que os testes NÃO pegam:

**Furo 1 — idade da inscrição `null` pula as guardas.** Em `classificarElegibilidade` (transacao-model.ts ~L337-342), se `inscritoDividaAtiva:true` + `valorDividaAtiva ≥ piso` + `inscricaoMaisAntigaIso:null`, `idadeDias=null` → a Regra 2 (recente→requer_analise) e o rebaixamento de maturidade são pulados (ambos guardados por `idadeDias !== null`). Resultado: nível **forte** com gancho estimável SEM nenhuma evidência de maturidade da dívida. O seed nunca produz esse caso, então os 43 testes não cobrem. Numa frente legal, classificar "forte" sem idade é otimista demais — deveria cair em requer_analise.
**Why:** o adapter S6 real (Infosimples/PGFN) pode devolver DA inscrita sem data de inscrição parseável → ativa o caminho null em produção.
**How to apply:** ao revisar o adapter S6, exigir que data ausente force requer_analise; cobrir com teste.

**Furo 2 — banlist-g6 NÃO cobre a frente de transação.** `scripts/banlist-g6.mjs` PROIBIDOS só tem termos de crédito/apuração/multa/prova (doc 45 §5). Zero termo de transação: "desconto garantido", "redução da dívida", "adesão garantida", "transação aprovada", "economia garantida", "dívida quitada". O gate passa por VACUIDADE nesta frente — dá falsa sensação de cobertura. A linguagem manual da UI (page.tsx/TransacaoExplorer.tsx) está impecável e co-localizada, mas nada impede regressão futura.
**Why:** moat do produto = trilha de boa-fé; um número lido como promessa de resultado é risco jurídico real.
**How to apply:** estender PROIBIDOS com termos de transação antes da Fase 2 (CI gate).

**O que ESTÁ correto (verificado):** fronteiras de porte (5000=pequeno, 1M=medio, 2M=grande) e idade (90d→condicional, 540d→forte) exatas; grande+recente→requer_analise sem gancho; CAPAG desconhecida→requer_analise; valor negativo→nao_elegivel; `gancho.meio` NUNCA renderizado (só ranking/resumo) — UI só mostra faixa min–max; sem join silencioso com outros módulos (cli-* reusado, unificação por CNPJ é follow-up explícito). Liga [[project_contador_radar_fiscal]].
