# Registro de Suboperadores v1

**Projeto:** Contador / Apuracao Defensavel
**Status:** v1 revisavel - nenhum suboperador aprovado para XML real ainda
**Data:** 2026-06-18
**Gate:** G4 artefato pronto; aprovacao juridica/founder obrigatoria antes de dado real.

---

## 1. Regra de Aprovacao

Um suboperador so pode receber dado real se houver:

- Finalidade documentada.
- DPA/termos de tratamento ou clausulas equivalentes.
- Regiao/localizacao avaliada.
- Medidas de seguranca compativeis com dado fiscal.
- Plano de saida/eliminacao.
- Aprovacao do founder e, quando aplicavel, do escritorio controlador.

## 2. Registro Atual

| Categoria | Suboperador | Dados potenciais | Status | Gate |
|---|---|---|---|---|
| Hosting/API | A definir | Metadados, payloads fiscais, eventos | Nao aprovado para real | Escolher provider + DPA |
| Banco/storage | A definir | XML, hashes, eventos, manifestos, laudos | Nao aprovado para real | Criptografia, RLS, backups, DPA |
| Observabilidade | A definir | Logs tecnicos; risco de PII acidental | Nao aprovado para real | Redacao de payloads + DPA |
| Email/transacional | A definir | Convites, avisos, possivel metadado | Nao aprovado para real | Minimizar conteudo + DPA |
| Assinatura/carimbo | Fora da F1 | Manifestos/laudos futuros | Fora do escopo | Review ICP/PAdES/ACT |
| IA/RAG/LLM | Fora da F1 | XML/texto fiscal se ativado | FAIL | DPIA especifica |
| Captura/e-CAC/provider fiscal | Fora da F1 | Credenciais/procuracoes/XML | FAIL | Novo fluxo operador/suboperador |

## 3. Criterios de Recusa

Recusar ou escalar se o fornecedor:

- Usa dados para treinar modelos ou melhorar produto sem opt-out contratual forte.
- Nao oferece DPA ou termos de operador/suboperador.
- Nao permite exclusao/devolucao ao fim do contrato.
- Nao documenta localizacao ou controles de seguranca.
- Exige envio manual por canais pessoais.
- Mistura dados entre clientes/tenants sem segregacao clara.

## 4. Mudanca de Suboperador

Qualquer mudanca deve registrar:

- Data proposta.
- Categoria e finalidade.
- Dados afetados.
- Risco e mitigacao.
- Evidencia contratual.
- Plano de reversao.
- Decisao do founder/controlador.

## 5. Pendencias

- Escolher stack real de hosting/banco/storage.
- Coletar DPAs/termos.
- Definir regiao de armazenamento.
- Confirmar logs e redacao de payloads.
- Atualizar DPA com lista aprovada.
