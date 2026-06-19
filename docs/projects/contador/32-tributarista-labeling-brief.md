# Brief do Tributarista Rotulador - Golden-set F1

> Data: 2026-06-16
> Donos: Founder/Renan recrutam; `@data-engineer` integra formato; `@qa` calibra gate.
> Status: pronto para recrutamento quando founder autorizar gasto/coleta. Plano G8 consolidado em `46-golden-set-real-plan-v1.md`.

---

## 1. Objetivo

Contratar ou alocar um tributarista/contador habilitado para rotular o golden-set real do motor fiscal da Reforma.

O trabalho nao e "validar a IA". O trabalho e criar o ground-truth humano contra o qual o motor deterministico sera testado.

## 2. Escopo inicial

- 200 a 500 itens fiscais reais extraidos dos XMLs do Concierge.
- Cobertura de itens frequentes, ambiguos e materialmente relevantes.
- Primeiro lote minimo para calibracao: 50 itens.
- Duplo rotulo em pelo menos 20% dos itens.

## 3. O que o rotulador entrega por item

| Campo | Obrigatorio | Observacao |
|---|---|---|
| `item_descricao` | Sim | Do XML, sem reescrever livremente |
| `ncm` | Sim quando existir | Do XML |
| `cfop` | Sim quando existir | Do XML |
| `valor` | Sim | Para materialidade |
| `cclasstrib_correto` | Sim | Classificacao defendida |
| `apontamentos_esperados[]` | Sim | Tipo + motivo |
| `confianca` | Sim | `alta`, `media`, `baixa` |
| `fundamentacao` | Sim | 1-3 linhas com base legal/raciocinio |
| `base_versao` | Sim | Versao da base vigente no fato gerador |
| `rotulador_crc` | Sim | Rastreabilidade profissional |

## 4. Regras do processo

1. O rotulador nao ve a resposta do motor antes de rotular.
2. Casos ambiguos nao devem ser forcados para consenso artificial.
3. Itens `confianca=baixa` entram no aprendizado, mas nao no gate duro de acuracia.
4. Toda divergencia entre dois rotuladores vira item de revisao, nao erro automatico.
5. Nao prometer acuracia fiscal enquanto so houver golden-set sintetico.

## 5. Perguntas de recrutamento

1. Voce tem experiencia pratica com classificacao fiscal/NCM/cClassTrib/Reforma?
2. Voce aceita registrar CRC/identificacao profissional no protocolo de rotulagem?
3. Voce consegue rotular 50 itens em ate 7 dias para calibracao?
4. Voce aceita trabalhar cego ao output do motor?
5. Voce aceita marcar ambiguidade e fundamentar quando nao houver certeza?

## 6. Criterio de aceite do primeiro lote

- 50 itens rotulados.
- 10 itens com duplo rotulo.
- Todos com `confianca` e `fundamentacao`.
- Nenhum item real exposto fora do ambiente autorizado.
- Snapshot versionado em formato compatÃ­vel com `ref.golden_set_versao`.

## 7. Gate

Sem esse lote, o motor pode continuar como contrato tecnico, mas nao pode sustentar claim de acuracia real nem liberar piloto pago com promessa fiscal.

## 8. Handoff G8

- Plano: `46-golden-set-real-plan-v1.md`
- Contrato de formato: `47-golden-set-real-fixture-contract-v1.md`
- Antes de contato/coleta: founder aprova gasto, DPA/storage/retencao aprovados e canal seguro definido.
