# Golden-Set Real Fixture Contract v1

**Projeto:** Contador / Apuracao Defensavel
**Status:** contrato de formato - sem dados reais
**Data:** 2026-06-18
**Gate:** Usar somente quando G4/G5 e autorizacao founder estiverem resolvidos.

---

## 1. Regra de Armazenamento

Este contrato descreve o formato. O arquivo real nao deve ser commitado no repositorio enquanto contiver dados de cliente. O storage real deve ser segregado, criptografado e auditado.

## 2. Envelope

```json
{
  "notice": "Real fiscal golden-set. Restricted data. Do not commit.",
  "goldenSetVersion": "gs-real-YYYY-MM-DD-v1",
  "dataClass": "restricted-fiscal",
  "source": {
    "tenantPseudonym": "tenant_hash",
    "collectionBatch": "batch_id",
    "dpaApproved": true,
    "retentionPolicy": "44-retention-matrix-v1"
  },
  "labelingProtocol": {
    "blindToMotor": true,
    "doubleLabelRateTarget": 0.2,
    "baseVersaoId": "uuid-or-version",
    "labelers": []
  },
  "cases": []
}
```

## 3. Caso

```json
{
  "caseId": "case_pseudonym",
  "item": {
    "itemIdPseudonym": "item_hash",
    "descricao": "texto do item redigido/minimizado quando possivel",
    "ncm": "00000000",
    "cfop": "0000",
    "cst": "00",
    "cclasstribInformado": "000000",
    "valor": 0,
    "fatoGeradorEm": "YYYY-MM-DD",
    "segmento": "segmento_controlado"
  },
  "expected": {
    "decision": "apontar|nao_apontar|abster",
    "cclasstribCorreto": "000000",
    "apontamentosEsperados": [
      {
        "tipoDivergencia": "cclasstrib_divergente",
        "materialidade": "alta|media|baixa",
        "motivoCodigo": "codigo_controlado"
      }
    ]
  },
  "label": {
    "confianca": "alta|media|baixa",
    "ambiguidade": false,
    "fundamentacao": "1-3 linhas sem excesso de dado pessoal",
    "referencias": ["base_versao_id", "norma_ref"],
    "rotuladorId": "labeler_pseudonym",
    "rotuladorCrcHash": "sha256",
    "rotuladoEm": "YYYY-MM-DDTHH:mm:ssZ"
  },
  "secondLabel": null
}
```

## 4. Validacoes Obrigatorias

- `notice` deve conter "Restricted data".
- `blindToMotor` deve ser `true`.
- `dpaApproved` deve ser `true` para qualquer arquivo real.
- `cases[].label.confianca` deve existir.
- `cases[].expected.decision` deve permitir `abster`.
- `secondLabel` deve existir em pelo menos 20% dos casos em F2+.
- Nenhum campo deve conter CPF, CNPJ de cliente, nome de cliente ou chave de acesso sem pseudonimizacao quando nao for estritamente necessario.

## 5. Metricas Derivadas

- Calcular metricas apenas sobre itens `confianca=alta|media`, salvo relatorio separado.
- Reportar itens ambiguos separadamente.
- Reportar falso positivo material separadamente.
- Nao publicar media global sem denominador e escopo.
