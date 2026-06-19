# Protocolo de Rotulagem do Golden-Set (Spike 2)

> **Data:** 2026-06-15 · **Autor:** Orion · **Dono da execução:** founder/Renan (recrutar tributarista) + @data-engineer (harness)
> **Por quê:** Kent Beck (conclave R2) identificou que o golden-set depende de um **humano externo (tributarista)** que é o **caminho crítico real** do produto — e ninguém o tinha sequenciado. Sem ground-truth real, o motor de classificação não tem contra o que ser testado. Este doc desenha o protocolo para que o trabalho esteja pronto quando o humano aparecer.

---

## 1. O que é o golden-set

Um conjunto versionado de itens fiscais reais (produtos/serviços de notas) **rotulados por um tributarista habilitado** com a classificação correta na Reforma (`cClassTrib`) + os apontamentos esperados. É:
- O **ground-truth** contra o qual o motor determinístico (Entrega 2 do handoff) é testado.
- O **gate de CI** que falha o build se a acurácia do motor cair (fitness function de qualidade).
- A **3ª perna da reprodutibilidade** (base + motor + eval) — versionado/snapshot por `ref.golden_set_versao` (patch P23).

---

## 2. Amostra

- **Tamanho:** 200–500 itens (alinhado ao Spike 2 do doc 17).
- **Estratificação:** cobrir os casos que importam, não amostra aleatória:
  - itens de **alta frequência** na carteira dos escritórios do Concierge (Pareto do volume);
  - **casos ambíguos** da Reforma (onde o `cClassTrib` é disputável — é aqui que o motor erra e o valor jurídico aparece);
  - itens **monofásicos / com tratamento especial** (a isca de recuperação);
  - distribuídos pelos regimes do ICP (MEI/Simples).
- **Fonte:** os XMLs reais que o Concierge já processa à mão (não inventar itens).

---

## 3. Schema da rotulagem (o que o tributarista preenche por item)

| Campo | Descrição |
|-------|-----------|
| `item_descricao`, `ncm`, `cfop`, `valor` | dados do item (do XML) |
| `cclasstrib_correto` | a classificação correta na Reforma |
| `apontamentos_esperados[]` | divergências que o motor DEVERIA levantar (tipo + materialidade) |
| `confianca` | alta/média/baixa — sinaliza casos genuinamente ambíguos |
| `fundamentacao` | base legal + raciocínio (1-3 linhas) — vira a evidência da trilha |
| `base_versao` | versão da base legal vigente no fato gerador (bitemporal — P22) |
| `rotulador_crc` | CRC do tributarista (rastreabilidade do ground-truth) |

---

## 4. Protocolo anti-viés

- **Duplo-rótulo em amostra:** ≥20% dos itens rotulados por 2 tributaristas independentes → medir concordância (inter-rater). Divergência alta num item = item ambíguo (rotular como tal, não forçar consenso).
- **Cego ao motor:** o tributarista rotula SEM ver o output do motor (senão ancora no resultado da máquina — erro que o Cassie diagnosticou no Noyce: "ML rotula por exemplos lixo").
- **Casos ambíguos são features, não bugs:** um item onde 2 especialistas divergem é exatamente onde o produto agrega valor (a trilha de boa-fé). Marcar `confianca=baixa` e NÃO penalizar o motor por ele no gate.

---

## 5. Gate de qualidade (fitness function — espelha o kill-gate do Noyce)

O golden-set roda como teste de CI a cada release do motor:
- **Cobertura:** % de itens do golden-set que o motor consegue classificar (sem abstain). Meta inicial a calibrar.
- **Acurácia / hit-rate:** % de classificações corretas nos itens de `confianca` alta/média (os de baixa são excluídos do gate).
- **Falso-positivo:** apontamentos que o motor levanta e não deveria (custa confiança do contador).
- **MAPE** (se houver valor numérico de crédito/recuperação estimado).
- **Decisão:** PASS / CONCERNS / PIVOT-OR-KILL — mesma régua do Noyce. Threshold ratificado pelo founder antes do 1º cliente pago.

---

## 6. Versionamento (P23)

- Cada golden-set é um **snapshot imutável** com `ref.golden_set_versao` (id + data + rotuladores + hash do conteúdo).
- `ref.motor_versao.golden_set_versao_id` (FK) registra contra qual golden-set o motor foi avaliado.
- Adicionar casos ao longo do tempo (via `apontamento_rejeitado`) cria uma NOVA versão — a antiga não muda (senão "o golden-set que liberou o motor v3" deixa de existir).

---

## 7. Sequenciamento (o gargalo real)

1. **founder/Renan:** recrutar o tributarista rotulador (idealmente um dos escritórios do Concierge, ou Heleno como revisor). É o caminho crítico — começar AGORA, em paralelo ao código.
2. **@data-engineer:** construir o harness de fixtures (Entrega 2 do handoff) com casos SINTÉTICOS primeiro, formato pronto para receber os reais.
3. Quando os rótulos reais chegarem → substituir sintéticos → rodar o gate → calibrar thresholds com o founder.

> ⚠️ Até os rótulos reais chegarem, o motor roda contra sintéticos e **não tem ground-truth de produção**. Sinalizar isso em toda métrica de acurácia (não vender acurácia sintética como real).
