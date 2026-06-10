# State Matrix ENIAC - 29/Mai Consolidado

Status: 2026-06-08
Uso: evitar perguntas repetidas e orientar o piloto Noyce.

Nota de fonte: esta matriz consolida notas Gemini, onboarding, roadmap e artefatos de arquitetura. Nem todo item "confirmado" veio diretamente das notas Gemini.

## Confirmado

| Item | Estado | Evidencia | Acao |
|---|---|---|---|
| Empresa inicial | ENIAC, single-company | `ACCESS-ONBOARDING-ENIAC.md` | Nao perguntar de novo |
| CNPJ | `36.819.268/0001-05` | onboarding + acervo | Usar como identity seed |
| Usuarios | 4 operadores equivalentes | onboarding 2026-05-29 | Nomes/e-mails adiados |
| Admin/owner ToS | Stafani | onboarding 2026-05-29 | Nao perguntar de novo |
| Fontes usadas | PNCP, PCP, BLL, BNC, ComprasGov, SISLOG | onboarding | Tratar multi-fonte |
| Recorte inicial | BLL, BNC, PCP frequentes | onboarding | Priorizar manual import/vault |
| PNCP publico | autorizado para dry-run | roadmap/onboarding | Pode rodar sem login |
| CAT/CAO | centrais para viabilidade real | notas Gemini 16:10 | Nucleo do matcher |
| Consorcio | precisa ser suportado | notas Gemini 16:10 | Modelar modo solo/consorcio |
| IA em proposta/planilha | autorizada com revisao humana | notas Gemini 16:26 | Alice revisa |
| Recurso/analise juridica | IA prepara insight; humano decide | notas Gemini 16:26 | Atos externos bloqueados; responsavel juridico amplo a definir |
| Design V1 | aprovado com melhoria pontual | notas Gemini 16:10/16:26 | Melhorar logo/engrenagem sem mudar direcao |
| Valparaiso | caso real de teste citado | notas Gemini 16:10 | Usar como gate manual se arquivo existir |
| IA nao e 100% veridica | revisao humana e guardrail central | notas Gemini 16:26 / doc 25 | Nao entregar parecer final automatico |

## Inferido Com Baixa/Media Confianca

| Item | Inferencia | Risco | Tratamento |
|---|---|---|---|
| CAO operacional ainda ausente | lista recebida contem CATs, nao CAO explicito | pode existir em arquivo nao listado | Marcar lacuna; nao pedir de novo ate processar pacote |
| Alice como validadora tecnica ampla | notas falam revisao de propostas/planilhas | pode nao cobrir toda habilitacao/juridico | Usar como revisora de proposta/planilha; validacao juridica ampla a definir |
| Giovana como contato operacional | citada na nota 16:10, mas doc 25 indica outra empresa | risco de acionar pessoa errada | Nao usar/nao acionar para ENIAC sem confirmacao explicita |
| "Enak" | nota Gemini provavelmente quis dizer ENIAC | erro de transcricao | Corrigir internamente para ENIAC |
| 1 semana de preparacao | compromisso falado na reuniao | prazo historico ja passou | Usar como expectativa, nao como SLA atual |

## Pendente Real

| Lacuna | Bloqueia | Como resolver |
|---|---|---|
| PL 2024/2025 e indices financeiros | calculo economico-financeiro completo | parse estruturado/validacao humana dos balancos |
| CAO operacional | `ATENDE` duro tecnico-operacional | confirmar se existe; se nao, CAT proxy no maximo com ressalva forte/PENDENTE_DADO |
| Ground truth dos editais restantes | gate Tier 1 completo | curadoria manual das secoes de habilitacao |
| Valparaiso estruturado | demo/gate com caso vivo | localizar edital/PDF e anotar ERM |
| Arquivo Mega historico | calibracao com outcomes reais | receber link/arquivo sem credenciais em docs |
| Vault por portal | automacao autenticada | 1Password/Bitwarden/Vaultwarden com MFA |
| ToS por portal | automacao autenticada | revisao legal/security por fonte |
| Consentimento operacional | automacao autenticada | registrar escopo permitido por fonte |
| Chaves/unidades da taxonomia | matcher tecnico confiavel | alinhar PAISAGISMO/RESERVATORIO/PAVIMENTACAO antes de GO duro |

## Nao Pedir De Novo

- CNPJ.
- Nome ENIAC.
- Quantidade de usuarios.
- Stafani como admin/owner ToS.
- Lista geral de portais usados.
- URLs de BLL/BNC/PCP.
- Permissao para PNCP dry-run publico.
- Explicacao geral da operacao.
- Importancia de CAT/CAO.
- Necessidade de consorcio.
- Autorizacao generica para IA com revisao humana.
- Que Alice revisa proposta/planilha.

## Perguntas Futuras Permitidas

So perguntar quando for necessario para executar um passo concreto:

1. "Voce confirma que nao existe CAO operacional separado alem das CATs que recebemos?"
2. "Qual e o PL 2025 validado pelo contador, ou podemos usar o valor extraido do balanco apos revisao?"
3. "Este e o link/arquivo correto do Mega com historico de licitacoes?"
4. "Podemos registrar este portal no vault com este escopo de uso?"
5. "Alice valida tambem a leitura tecnica de habilitacao ou apenas propostas/planilhas?"
6. "Quem e o responsavel humano por validacao juridica de impugnacao/recurso antes de qualquer protocolo?"

## Proxima Fatia Recomendada

Executar piloto offline/manual:

1. deduplicar pacote documental;
2. estruturar `FinancialSnapshot` com campos financeiros `null` ate validacao;
3. revisar `eniac-ccp.json`, numeros das CATs e taxonomia/unidades;
4. curar 1 edital para demo;
5. apresentar GO / GO_COM_TAREFAS / PENDENTE_DADO / NO_GO com evidencias.

## Gate De Linguagem

- Permitido: "exigencia atipica", "risco de restricao competitiva", "avaliar esclarecimento/impugnacao".
- Bloqueado como fato: "fraude", "direcionamento", "influencia externa".
- Todo alerta precisa de clausula + trecho + hook legal + revisao humana.
- PNCP publico pode consultar/rankear; nao autoriza contato, protocolo, login, submissao ou mensagem.
