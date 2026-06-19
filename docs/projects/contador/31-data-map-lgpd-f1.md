# Data Map LGPD - F1 Foundation

> Data: 2026-06-16
> Escopo: dados tratados pela F1 Foundation antes de piloto pago.
> Status: v1 operacional - DPA/retencao/suboperadores documentados; requer revisao juridica antes de dados reais.

---

## 1. Papeis LGPD assumidos

| Parte | Papel provavel | Observacao |
|---|---|---|
| Escritorio contabil | Controlador perante os clientes finais | Decide finalidade de apuracao/defesa/obrigacao fiscal |
| Plataforma Contador | Operador do escritorio | Processa dados conforme contrato/DPA |
| Cliente do escritorio | Titular/empresa relacionada aos dados fiscais | Pode conter dados pessoais em XML/documentos |
| Provider de captura futuro | Suboperador | Fora da F1; exigira DPA e clausula de operador |
| Hosting/banco/storage futuro | Suboperador | Registro inicial em `43-suboperadores-register-v1.md` |

Confirmar com juridico antes de contrato real.

## 2. Inventario inicial de dados

| Tabela/campo | Tipo de dado | Finalidade | Base legal candidata | Retencao candidata | Risco |
|---|---|---|---|---|---|
| `core.usuario.nome/email/cpf/crc/crc_uf/crc_situacao` | Identificacao profissional | Controle de acesso, decisao humana, prova de CRC | Execucao de contrato; obrigacao legal/regulatoria; legitimo interesse documentado | Enquanto usuario ativo + prazo prescricional fiscal/probatÃ³rio | Medio |
| `core.cliente.nome/documento` | Identificacao de cliente/CNPJ/CPF eventual | Associar documentos e apontamentos ao cliente | Execucao de contrato; obrigacao legal | Prazo fiscal aplicavel + contrato | Medio |
| `core.nota.emitente_cnpj/destinatario_doc/xml_storage_path/xml_hash` | Dado fiscal; pode conter dado pessoal em XML | Evidencia fiscal e auditoria | Obrigacao legal/regulatoria; execucao de contrato | Prazo fiscal/probatÃ³rio definido em matriz de retencao | Alto |
| `core.nota_item.descricao/ncm/cfop/cclasstrib_informado/valor_item` | Dado fiscal/comercial | Classificacao e apontamento | Obrigacao legal; execucao de contrato | Igual ao documento fiscal | Medio |
| `core.analise_execucao.resposta_bruta/retrieval_set/params` | Proveniencia tecnica; futuro RAG pode conter dado pessoal | Auditoria de decisao assistida | Legitimo interesse + execucao de contrato, com minimizacao | Reduzir ao minimo; versionar e expurgar quando possivel | Alto quando RAG entrar |
| `core.apontamento_auditoria.fundamento/motivo_texto` | Justificativa fiscal; pode conter dado pessoal se texto livre | Decisao profissional e trilha | Obrigacao legal; execucao de contrato | Prazo fiscal/probatÃ³rio | Alto por texto livre |
| `core.evento_boa_fe.payload.revisor_snapshot` | Snapshot profissional | Prova de sujeito habilitado | Obrigacao legal/regulatoria; legitimo interesse | Prazo probatorio da trilha | Medio |
| `core.evento_boa_fe.payload.evidencia_ref` | Referencias imutaveis de evidencia | Re-verificacao da decisao | Obrigacao legal; execucao de contrato | Prazo probatorio da trilha | Medio |

## 3. Controles obrigatorios antes de XML real

1. DPA escritorio-plataforma com papel de operador e suboperadores. Artefato v1: `42-dpa-operador-controlador-v1.md`.
2. Registro de operacoes de tratamento por finalidade.
3. Politica de retencao por tipo documental. Artefato v1: `44-retention-matrix-v1.md`.
4. Controle de acesso por tenant e papel, com trilha de auditoria.
5. Proibicao de dados sensiveis no texto livre de `motivo_texto` e `fundamento` sem necessidade demonstrada.
6. Procedimento de incidente e exportacao/eliminaÃ§Ã£o quando legalmente aplicavel.
7. Revisao dos campos de RAG antes de ativar qualquer IA que receba XML real.

## 4. MinimizaÃ§Ã£o

- Preferir hash + ID imutavel em eventos, nao duplicacao integral de XML ou texto fiscal.
- Manter `resposta_bruta` e `retrieval_set` nulos/vazios enquanto RAG estiver fora de escopo.
- Transformar textos livres em codigos controlados sempre que possivel.
- Separar evidencias fiscais de operacao de gestao; nada de FK `core -> gestao`.

## 5. Gate

| Uso | Decisao LGPD v0 |
|---|---|
| Fixture sintetica/dev | PASS |
| Demo sem dados reais | PASS com disclaimer |
| XML real de cliente em piloto pago | CONCERNS ate revisao juridica/fiscal dos artefatos `42`, `43`, `44` + aprovacao founder |
| RAG/LLM sobre XML real | FAIL ate DPIA especifica |
