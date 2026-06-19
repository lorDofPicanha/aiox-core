# DPA Operador-Controlador v1 - Minuta Operacional

**Projeto:** Contador / Apuracao Defensavel
**Status:** v1 revisavel - nao assinar sem juridico
**Data:** 2026-06-18
**Gate:** G4 artefato pronto; XML real segue bloqueado ate revisao juridica e aprovacao do founder.

---

## 1. Base Usada

- ANPD: [Guia Orientativo para Definicoes dos Agentes de Tratamento de Dados Pessoais e do Encarregado](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-publica-guia-orientativo-sobre-agentes-de-tratamento-e-encarregado). O guia explica que controlador e operador devem ser definidos por operacao de tratamento e que o controlador toma as decisoes essenciais de finalidade e tratamento.
- ANPD: [Comunicacao de Incidente de Seguranca](https://www.gov.br/anpd/pt-br/assuntos/comunicacao-de-incidentes-de-seguranca-cis). A pagina informa que a comunicacao formal a ANPD e titulares e obrigacao do controlador quando houver risco ou dano relevante, e que o operador deve informar o controlador sem demora injustificada.

## 2. Partes e Papeis

| Parte | Papel | Responsabilidade operacional |
|---|---|---|
| Escritorio contabil | Controlador | Define finalidade, clientes, base legal, prazo de retencao e uso do resultado |
| Plataforma Contador | Operador | Processa dados conforme instrucoes documentadas do escritorio |
| Provedores aprovados | Suboperadores | Tratam dados apenas nas funcoes contratadas e aprovadas |
| Cliente do escritorio / pessoa natural relacionada | Titular ou fonte documental | Pode aparecer em XML, documento fiscal, cadastro, socio, consumidor ou responsavel |

Se a plataforma passar a definir finalidade propria, treinar modelo com dados reais, vender benchmark ou reutilizar dados entre escritorios, o papel deve ser reavaliado antes de qualquer uso.

## 3. Finalidades Permitidas

- Receber, armazenar e organizar documentos fiscais autorizados pelo escritorio.
- Executar validacoes fiscais deterministicas e gerar apontamentos.
- Registrar decisoes humanas do contador.
- Manter trilha de boa-fe, hashes, manifestos e laudos tecnicos.
- Dar suporte operacional ao escritorio, limitado ao tenant e ao contrato.

## 4. Proibicoes

- Usar XML, eventos, manifestos ou laudos para treinamento de IA/modelos.
- Enriquecer base externa, vender dados, criar benchmark entre escritorios ou fazer prospeccao.
- Enviar dados reais a LLM/RAG, email pessoal, WhatsApp, drive pessoal ou terceiro sem base contratual.
- Processar e-CAC/captura automatica sem novo gate de operador/suboperador.
- Prometer prova juridica plena, ICP-Brasil/PAdES ou acuracia fiscal real fora do escopo implementado.

## 5. Instrucoes Documentadas do Controlador

O escritorio deve registrar antes do piloto:

- Quais clientes e periodos podem ser processados.
- Quais tipos de documento entram no piloto.
- Quem pode acessar, revisar, exportar e aprovar closeout.
- Qual finalidade fiscal/defensiva se aplica.
- Qual prazo de retencao sera usado por categoria.
- Se ha restricao por setor, cliente sensivel ou segredo comercial.

## 6. Medidas de Seguranca Minimas

- Segregacao por tenant com RLS validado em smoke.
- Acesso por usuario autenticado, papel e tenant.
- INSERT/UPDATE/DELETE direto em tabelas sensiveis revogado para app roles.
- Criptografia em transito; criptografia em repouso no storage real.
- Logs de acesso/export para dados reais.
- Exports temporarios descartados apos persistencia/validacao.
- Ambiente real separado de dev/fixtures.
- Segredos fora do repositorio.

## 7. Suboperadores

O escritorio deve aprovar a lista de suboperadores antes de XML real. Mudancas devem ser notificadas com antecedencia razoavel e registradas no `43-suboperadores-register-v1.md`.

Suboperador minimo esperado:

- Hosting/banco/storage.
- Observabilidade/logs, se receber dado pessoal.
- Assinatura/carimbo, se entrar no escopo futuro.
- IA/RAG: fora da F1 e exige DPIA especifica.

## 8. Incidentes

O operador deve informar o controlador sem demora injustificada quando houver suspeita ou confirmacao de:

- Acesso cross-tenant.
- Vazamento/export indevido.
- Perda, roubo, indisponibilidade ou alteracao de dados pessoais.
- Envio de XML real a ferramenta nao aprovada.
- Quebra de integridade da trilha/hash.

SLA operacional interno: triagem em ate 24h e aviso inicial ao controlador no mesmo dia util apos confirmacao razoavel. A comunicacao formal a ANPD/titulares cabe ao controlador quando aplicavel; o DPA deve prever cooperacao do operador com informacoes tecnicas.

## 9. Retorno e Eliminacao

Ao encerrar contrato ou piloto:

- Devolver exports/manifestos/laudos quando solicitado e permitido.
- Eliminar dados que nao precisem ser preservados por obrigacao legal/probatoria.
- Preservar apenas hashes, logs e evidencias necessarias conforme matriz aprovada.
- Registrar eliminacao quando houver dados reais.

## 10. Pendencias de Assinatura

- Revisao juridica da minuta.
- Identificacao final do controlador contratante.
- Nomeacao/canal do encarregado ou responsavel privacy.
- Lista final de suboperadores.
- Matriz de retencao aprovada.
- Plano de incidente aprovado.
