---
name: contador-s12-health-score
description: S12 Health Score cross-módulo — reconciliação de carteira tem CNPJ divergente entre os 2 seeds; tetos achatam exposição; banda verde com 1 lado só é enganosa.
metadata:
  type: project
---

S12 (`app/saude-carteira/`) é o diferencial nº1 do Contador: cruza auditoria do core (cClassTrib) com situação fiscal e-CAC num score 0–100 + banda. Gate QA = **CONCERNS** (aprovado, G6 exemplar).

**🔴 Armadilha de reconciliação (vai estourar no gate dos adapters reais):** os 2 seeds usam CNPJs DIFERENTES para as MESMAS empresas. Core ativo = `packages/contador-api-client/src/seed-from-motor.ts` (NÃO `mock-data.ts` — a app usa `createApiClientFromMotor`, ver `lib/api.ts`). Brasa: core `22333444000172` vs e-CAC `44555666000172`. Cedro: core `33444555000163` vs e-CAC `77888999000163`. O `MAPA_CLIENTE_ECAC_CORE` (health-score-data.ts) contorna keando por UUID→id-curto, mas o cabeçalho promete que em produção o join vira `core.documento === ecac.documento` — que FALHARIA em 2/3 clientes contra os seeds atuais.

**Why:** o mapa explícito existe justamente para não casar 0 cliente; o plano de produção (join por CNPJ) nasce quebrado se os seeds não forem alinhados antes.
**How to apply:** ao ligar adapters S1/S4 ou unificar identidade por CNPJ, primeiro alinhar os documentos sintéticos dos dois seeds (a2/a3). Senão o "só auditoria"/"só e-CAC" engole metade da carteira.

**🟡 Outros 2 que os 40 testes não pegam:** (1) tetos por fator achatam exposição — 3 vs 30 intimações no limite dão o MESMO score 60/Atenção; `rankearCarteira` desempata por nº-fatores+nome, não por exposição saturada, então pode rankear o de 3 acima do de 30. (2) Banda "Saudável" verde aparece mesmo com `semLadoEcac`/`semLadoCore` (score parcial, só 1 lado avaliado) — leitura-quase-garantia em G6; deveria ser banda "parcial".

Liga [[project_contador_verifier_slicing]] e [[project_contador_ecac_date_boundary]] (mesmo padrão: bug mascarado pelo seed, ativa no real).
