# Evidência dos estados de cuidado (sem pôr a produção em risco)

> Pearl/Norman (Ciclo 2) pediram prova dos estados de crise vivos. Disparar frase de risco no pipeline de PROD acionaria o alerta real no Telegram do founder + contact-alerting — o guardrail bloqueou (corretamente) e NÃO contornei. Prova obtida por caminhos seguros:

## 1. Caminho feliz — REAL em produção ✅
- Smoke WS anterior com conta beta real: frase neutra → `assistant_message`, `riskLevel:"none"`, `crisisDetected:false`, `crisisColor:"green"`. Prova que **frase neutra NÃO escala pra crise** e que o streaming/resposta da IA funciona e2e em prod.

## 2. Níveis de crise — testes locais (função pura, sem tocar prod) ✅
- `npx vitest run` em `crisis-protocol-service.test.ts` + `safety/` + `crisis-response-fallback.test.ts` = **183 testes PASS, 0 FAIL.**
- Cobrem: classificação por nível (verde/amarelo/laranja/vermelho), protocolo de resposta por nível, resposta pré-validada de crise (bypass do LLM no vermelho), fallback, evasão unicode, psicose/mania/TA. (Parte dos 922 da suíte.)

## 3. Renderização no frontend — verificada no código pelo conclave ✅
- Norman/Pearl (Ciclo 2) confirmaram no código: `chat-store` dispara `crisisModal`/`crisisBanner` por cor; RED→`CrisisFullScreen` (sem dismiss leve), ORANGE→`CrisisAlert`+banner, YELLOW→banner; tijolo `#8f2c1b`, zero motion. Canal de crise (WS) é **arquiteturalmente separado** do `chat.error` (Pearl) → um soluço técnico NUNCA vira crise (erro usa voz neutra `--text-muted`, `role="status"`).

## Conclusão
Os 3 níveis de crise + a separação erro-técnico-vs-crise estão provados por: prod real (verde), testes (níveis), e código (render). O ÚNICO pedaço não-capturável com segurança é um screenshot do vermelho disparado AO VIVO — isso só deve acontecer (a) em ambiente de staging isolado, ou (b) durante o beta com pessoas reais e o plantão clínico ativo. Registrado como item do gate humano, não como lacuna de design.
