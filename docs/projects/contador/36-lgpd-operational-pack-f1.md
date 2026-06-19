# LGPD Operational Pack - F1 Foundation

> Data: 2026-06-16
> Status: v1 operacional - artefatos DPA/retencao/suboperadores prontos; requer revisao `@patricia-peck`/juridico antes de XML real.
> Escopo: controles minimos para demo, piloto controlado e preparacao contratual.

---

## 1. Decisao de gate

| Uso | Gate LGPD |
|---|---|
| Fixture sintetica/dev | PASS |
| Demo sem dados reais | PASS com disclaimer |
| XML real em piloto pago | CONCERNS ate revisao juridica dos artefatos `42`, `43`, `44`, incidente e aprovacao founder |
| RAG/LLM sobre XML real | FAIL ate DPIA especifica |
| Captura automatica/e-CAC | FAIL ate novo fluxo de operador/suboperador |

## 2. Papeis operacionais

| Parte | Papel assumido | Condicao |
|---|---|---|
| Escritorio contabil | Controlador | Define finalidade fiscal/defensiva junto ao cliente |
| Plataforma Contador | Operador | Trata dados conforme contrato/DPA |
| Cliente do escritorio | Titular ou fonte documental relacionada | Pode conter CPF, socio, consumidor ou dados fiscais pessoais |
| Provedor de hosting/storage | Suboperador | Exige contrato/DPA e localizacao revisada |
| Provedor de IA/RAG futuro | Suboperador de alto risco | Fora da F1 |

## 3. Checklist antes de dados reais

1. DPA assinado entre escritorio e plataforma. Minuta operacional: `42-dpa-operador-controlador-v1.md`.
2. Registro de operacoes por finalidade.
3. Matriz de retencao aprovada. Candidata: `44-retention-matrix-v1.md`.
4. Procedimento de incidente aprovado.
5. Controle de acesso por tenant, papel e usuario autenticado.
6. Logs de acesso e decisao humana preservados.
7. Proibicao de envio de XML real para LLM/RAG sem DPIA.
8. Lista de suboperadores revisada. Registro: `43-suboperadores-register-v1.md`.
9. Canal de atendimento a requisicoes de titulares definido.
10. Ambiente de dados reais separado de fixtures/dev.

## 4. Clausulas DPA minimas

O contrato/DPA deve cobrir:

- Papel de operador da plataforma.
- Instrucoes documentadas do escritorio controlador.
- Finalidades permitidas: auditoria fiscal, organizacao de evidencias, suporte a decisao profissional e geracao de laudo.
- Proibicao de uso para treinamento de modelo, venda de dados ou enriquecimento externo.
- Suboperadores autorizados e notificacao de mudancas.
- Medidas de seguranca: segregacao por tenant, controle de acesso, logs, criptografia em repouso/transito quando aplicavel.
- Retencao e eliminacao conforme matriz.
- Procedimento de incidente com prazo interno de comunicacao.
- Apoio a direitos de titulares quando legalmente aplicavel.
- Devolucao ou eliminacao ao fim do contrato, ressalvados deveres legais/probatorios.

## 5. Matriz de retencao candidata

| Categoria | Exemplo | Retencao candidata | Observacao |
|---|---|---:|---|
| Usuario profissional | Nome, email, CPF, CRC | Vigencia da conta + prazo probatorio | Validar com contrato e CRC |
| Documento fiscal | XML, hash, chave, emitente/destinatario | Prazo fiscal/probatorio aplicavel | Definir por tributarista/juridico |
| Item fiscal | NCM, CFOP, CST, cClassTrib, valores | Igual ao documento fiscal | Base do apontamento |
| Analise tecnica | Execucao, params, base/motor versao | Igual ao laudo ou periodo fiscal | Evitar `resposta_bruta` excessiva |
| Decisao humana | Motivo, revisor snapshot, evidencia hash | Prazo probatorio | Necessaria para defesa |
| Logs de acesso | Usuario, tenant, timestamp, acao | 6 a 24 meses candidato | Ajustar por risco |
| Fixture sintetica | Dados artificiais | Sem restricao LGPD material | Manter marcado como sintetico |

## 6. Procedimento de incidente

1. Identificar evento: acesso indevido, vazamento, tenant mismatch, perda de integridade ou envio indevido a terceiro.
2. Preservar logs e manifestos relacionados.
3. Conter: bloquear usuario/token, isolar tenant, suspender processamento.
4. Classificar impacto: dados pessoais, fiscais, volume, titulares, risco.
5. Notificar founder e responsavel juridico.
6. Decidir comunicacao ao controlador e, se aplicavel, ANPD/titulares.
7. Registrar causa raiz e medidas corretivas.
8. Reabrir processamento apenas apos gate security/legal.

SLA interno candidato: triagem inicial em ate 24h apos deteccao.

## 7. Regras de minimizacao

- Usar hash e referencias imutaveis em eventos sempre que bastar.
- Nao duplicar XML integral em payload de evento.
- Bloquear texto livre com dados sensiveis ou desnecessarios.
- Manter RAG/LLM fora do caminho de XML real ate DPIA.
- Separar dados de gestao/comercial de dados fiscais.
- Garantir que fixtures sinteticas nao sejam confundidas com base real.

## 8. Controles de acesso

| Controle | Status F1 |
|---|---|
| Tenant claim obrigatoria nas RPCs humanas | Implementado em F1.2 |
| Caller `sub` igual ao revisor | Implementado em F1.2 |
| Papel `contador` para decisao humana | Implementado em F1.2 |
| CRC ativo para decisao humana | Implementado |
| Audit trail de decisao | Implementado |
| Logs de leitura/exportacao | Politica tecnica v1 em `41-export-retention-policy-f1.md`; implementacao real pendente |
| Rotacao de segredo/credencial | Pendente pre-producao |

## 8-ter. DPA, suboperadores e retencao G4/G5

Artefatos v1 criados em 2026-06-18:

- `42-dpa-operador-controlador-v1.md`
- `43-suboperadores-register-v1.md`
- `44-retention-matrix-v1.md`

Esses documentos sao base de revisao. Nao equivalem a contrato assinado, parecer juridico ou liberacao de XML real.

## 8-bis. Closeout/export F1.3

O manifesto de closeout pode conter metadados fiscais, referencias de evento, hashes e payloads derivados de decisoes humanas. Mesmo quando nao contem XML integral, deve ser tratado como dado operacional sensivel do escritorio.

Regras antes de XML real:

- Export JSON de eventos e manifesto nao devem sair do ambiente controlado.
- Persistencia deve ocorrer via `core_api_v1.registrar_closeout`, nao por insert direto.
- `time_stamp_provider='none'` deve aparecer em qualquer demo; nao comunicar ICP-Brasil/PAdES.
- Retencao de manifestos deve seguir a mesma matriz probatoria aprovada para trilha/laudo.
- Qualquer envio a terceiro, advogado, contador externo ou provider de assinatura exige DPA/termo de operador ou base contratual revisada.
- RLS/export runtime foi validado em `005_rls_export_runtime_contract.sql`: usuario `authenticated` ve apenas eventos/closeouts do tenant da claim; claim ausente retorna zero linhas.
- Politica operacional detalhada: `41-export-retention-policy-f1.md`.

## 9. Perguntas para Patricia/juridico

1. Base legal final por finalidade: contrato, obrigacao legal, legitimo interesse ou combinacao.
2. Prazo de retencao defensavel para XML, laudo e trilha.
3. Necessidade de RIPD/DPIA antes de piloto pago com poucos escritorios.
4. Forma correta de comunicar o papel de operador ao escritorio.
5. Requisitos minimos para suboperadores de hosting/storage.
6. Limites de uso de dados fiscais para calibracao de golden-set.

## 10. Gate de saida

Para liberar XML real em piloto controlado:

- DPA v1 pronto.
- Matriz de retencao aprovada.
- Procedimento de incidente aprovado.
- Threat model F1 aprovado.
- Ambiente real separado de dev.
- Linguagem comercial revisada.
- Founder aceita explicitamente residual `CONCERNS`, se houver.
