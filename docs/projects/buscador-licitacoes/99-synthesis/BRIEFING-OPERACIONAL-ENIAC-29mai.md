# Briefing Operacional ENIAC - Reuniao 29/Mai/2026

Status: consolidado em 2026-06-08 por `@aios-master`
Projeto: Noyce / buscador-licitacoes
Fontes principais:
- Notas Gemini da reuniao de 2026-05-29 16:10 (CAT/CAO, consorcio, detector, Valparaiso, VoC).
- Notas Gemini da reuniao de 2026-05-29 16:26 (IA com revisao humana, declaracoes, certidoes, balancetes, Mega).
- Pacote documental enviado pelo founder: balancos 2024/2025, CATs, termos contabeis e 11+ editais.
- `00-context/ACCESS-ONBOARDING-ENIAC.md`.
- `02-architecture/17-execution-roadmap-agent-ownership-23mai.md`.
- `02-architecture/25-requisitos-reuniao-cliente-eniac-29mai.md`.
- `02-architecture/26-modelo-habilitacao-motor-viabilidade-acervo-real-04jun.md`.
- `02-architecture/27-detector-licitacao-suspeita-direcionamento-r3-04jun.md`.
- `02-architecture/28-codex-handoff-tier1-detector-nucleo-habilitacao-04jun.md`.

## 1. Decisao de Corte

Nao abrir nova discovery ampla com a Stafani agora.

O material recebido ja e suficiente para consolidar um piloto offline/manual do Noyce focado em:

1. triagem e priorizacao de oportunidades publicas;
2. motor de habilitacao ENIAC com CAT/acervo e balanco;
3. detector Tier 1 de exigencias atipicas/possivelmente impugnativeis;
4. apoio a proposta, planilhas, declaracoes e recurso com revisao humana obrigatoria;
5. governanca de acesso a portais, mantendo automacao autenticada bloqueada ate vault + ToS + consentimento.

## 2. O Que Ja Esta Confirmado

### Empresa e usuarios

- O tenant inicial e single-company.
- Empresa licitante: ENIAC.
- CNPJ informado e alinhado ao acervo real: `36.819.268/0001-05`.
- Modelo operacional: 4 usuarios com acesso operacional equivalente.
- Stafani fica como perfil master/admin e owner humano de aceite/risco ToS.
- Demais usuarios podem operar, mas nomes/e-mails ficam adiados e nao bloqueiam o piloto publico/manual.

### Fontes e acessos

- ENIAC usa PNCP, PCP, BLL, BNC, ComprasGov e SISLOG.
- Portais mais frequentes no recorte inicial: BLL, BNC e Portal de Compras Publicas.
- URLs de BLL, BNC e PCP ja estao registradas em `ACCESS-ONBOARDING-ENIAC.md`.
- PNCP publico esta autorizado para dry-run sem login.
- Automacao autenticada em portais segue bloqueada ate vault, ToS por portal, consentimento, logs/auditoria e feature flag.

### Produto e workflow

- O Noyce nao e apenas buscador PNCP; e workflow operacional de licitacoes.
- Fluxo validado: Monitorar -> Analisar -> Indicar -> Habilitar -> Acompanhar -> Recorrer.
- A interface V1 foi aprovada em direcao visual, com pedido de melhoria pontual para dar mais vida/autenticidade ao elemento visual/logo.
- O app deve centralizar oportunidades, propostas, planilhas, documentos, timeline, prazos e janelas da licitacao.

### Habilitacao e probabilidade real

- A Stafani explicitou que a probabilidade real de vitoria depende de CATs e CAOs, nao apenas de filtros gerais.
- O sistema deve integrar Certidoes de Acervo Tecnico (CAT) e Certidoes de Acervo Operacional (CAO) para refinar viabilidade.
- O sistema precisa suportar dois modos:
  - operacao independente, usando o acervo proprio;
  - consorcio, com duas empresas por contrato, uma lider e soma/uso de acervo conforme regras aplicaveis.
- A revisao humana permanece obrigatoria para propostas, planilhas e decisoes externas.

### Inteligencia competitiva e detector

- A lideranca da ENIAC tem interesse em identificar se vitorias recorrentes de concorrentes tem fundamento tecnico ou indicios de influencia externa.
- O detector deve comparar exigencias do edital atual com padroes anteriores e sinalizar discrepancias relevantes.
- Linguagem deve ser de alerta tecnico, nunca de acusacao de fraude, direcionamento ou influencia externa como fato.
- Saidas aceitas: "exigencia atipica", "risco de restricao competitiva", "avaliar esclarecimento/impugnacao".
- O detector Tier 1 deve priorizar sinais objetivos e grounded em clausula + hook legal.

### IA e revisao humana

- Uso de IA foi autorizado para apoio a propostas, planilhas, analise documental e insights juridicos, desde que haja correcao/revisao humana.
- A dor/guardrail explicitado na reuniao: as entregas da IA nao sao 100% veridicas.
- Alice foi indicada como revisora/corretora humana de propostas e planilhas geradas por automacao.
- Responsavel humano por validacao juridica ampla, impugnacao, recurso e protocolo ainda deve ser definido quando esse fluxo sair do piloto offline.
- A equipe humana permanece responsavel pela decisao final e por qualquer recurso, impugnacao, protocolo, lance ou mensagem externa.

### Caso de teste

- Valparaiso foi citado como exemplo real de licitacao para testar a capacidade de analise.
- O gate Tier 1 ja trata Valparaiso como pendencia de anotacao humana, nao como inferencia automatica.

## 3. Material Documental Recebido

### Contabil/economico-financeiro

- `BALANCO PATRIMONIAL 2024.pdf`.
- `BALANCO PATRIMONIAL 2025.pdf`.
- `TERMO_DE_ABERTURA_-_2024_assinado.pdf` e duplicata `(1)`.
- `TERMO_DE_ENCERRAMENTO_-_2024_assinado.pdf` e duplicata `(1)`.

Uso no Noyce:
- alimentar `FinancialSnapshot`;
- calcular capacidade economico-financeira por exercicio;
- destravar PL, capital social, indices LC/LG/SG e teto solo.

Lacuna atual:
- o parse limpo do PL 2024/2025 permanece pendente (`D-26.1`). O historico do projeto ja registra que extracao textual comum embaralha o balanco. Nao inferir numeros sem parse confiavel ou validacao humana.

### Acervo tecnico

- `CAT 1020250004388 - REFORMA CEO.pdf` e duplicata `(1)`.
- `CAT 1020260001207 - MESTRE ZEZITO.pdf` e duplicata `(1)`.
- `CAT Escola Ednalda Guedes.pdf`.
- `CAT- PRACA 1020250002836.pdf`.
- `CAT TOPOGRAFIA RODRIGO.pdf`.

Uso no Noyce:
- alimentar `CompanyCapabilityProfile`;
- calcular capacidade por servico canonico;
- distinguir tecnico-profissional e tecnico-operacional;
- modelar ressalva quando CAO operacional nao estiver formalmente anexado.

Lacuna atual:
- CAO operacional separado nao apareceu confirmado na lista.
- Se o edital exigir CAO/atestado operacional em nome da pessoa juridica, CAT profissional so pode operar como proxy com ressalva forte.
- Sem CAO/atestado operacional formal, nunca retornar `ATENDE` duro. Usar no maximo `PENDENTE_DADO` ou `GO_COM_TAREFAS` com tarefa "validar/anexar CAO ou atestado operacional" quando o fato tecnico ja existir e puder ser comprovado no prazo.

### Editais reais

- `CE 002-2026 - Edital (1).pdf`.
- `EDITAL (5).pdf`.
- `EDITAL (6).pdf`.
- `EDITAL (7).pdf`.
- `EDITAL (8).pdf`.
- `EDITAL (9).pdf`.
- `EDITAL 01-2026_Assinado (1).pdf`.
- `EDITAL 5-2026 - Republicacao _Assinado (1).pdf`.
- `Edital Concorrencia 03-2026_Assinado (1).pdf`.
- `edital_04052026104831 (1).pdf`.
- `EDITAL_Assinado UBS II (1).pdf`.
- `SEI_GOVERNADORIA - 59297613 - Edital (1).pdf`.

Uso no Noyce:
- curar ERMs de edital;
- montar ground truth do detector Tier 1;
- testar habilitacao ENIAC contra requisitos reais;
- alimentar taxonomia e baseline futura.

Lacuna atual:
- ground truth manual ainda pendente para 10 editais + Valparaiso em `apps/noyce/lib/data/tier1-ground-truth.json`.

### Historico Mega

- Stafani concordou em fornecer acesso a arquivo no Mega com historico de licitacoes participadas.

Uso no Noyce:
- base de conhecimento para IA;
- calibracao futura de proposta/planilhas;
- aprendizado de resultados reais da ENIAC.

Lacuna atual:
- arquivo/link Mega ainda nao esta registrado no workspace e deve entrar por canal apropriado, sem credenciais em docs.

## 3.1 Manifesto Documental

Foi criado `apps/noyce/lib/data/eniac-document-inventory.json` como manifesto inicial deduplicado por SHA-256.

Uso:
- fonte de verdade para o pacote recebido;
- evita processar duplicatas;
- registra tipo documental, campos esperados e necessidade de validacao humana;
- mantem campos extraidos vazios ate parse estruturado.

Guardrail:
- o manifesto nao guarda senha, token, cookie, certificado, chave privada ou codigo 2FA;
- campos financeiros permanecem nulos ate extracao estruturada e validacao humana;
- duplicatas nao devem ser parseadas duas vezes.

## 4. Nao Pedir De Novo

Nao pedir novamente:

- CNPJ da ENIAC.
- Confirmacao de que e single-company.
- Confirmacao de que Stafani e master/admin.
- Confirmacao de que sao 4 usuarios operacionais.
- Confirmacao de uso de PNCP, PCP, BLL, BNC, ComprasGov e SISLOG.
- URLs de BLL, BNC e PCP.
- Permissao para dry-run publico PNCP.
- Explicacao geral do processo de licitacao.
- Confirmacao de que CAT/CAO sao centrais para probabilidade real.
- Confirmacao de que consorcio precisa ser suportado.
- Confirmacao de que IA pode apoiar proposta/planilha/recurso com revisao humana.
- Confirmacao de que Alice revisa propostas/planilhas.
- Pedido generico de "mais documentos"; o pacote documental inicial ja existe.

## 5. Lacunas Reais

### Bloqueiam calculo/analise completa, mas nao bloqueiam piloto offline

1. Parse confiavel do PL 2024/2025 e demais campos de balanco.
2. Confirmacao/documento de CAO operacional, se existir.
3. Curadoria manual do ground truth dos editais restantes e Valparaiso.
4. Link/arquivo Mega com historico de licitacoes participadas.
5. Correcao de chaves/unidades na taxonomia/acervo antes de matcher duro:
   - `PAISAGISMO` vs `PAISAGISMO_URBANO`;
   - `RESERVATORIO_ACO` vs `RESERVATORIO`;
   - `PAVIMENTACAO_CONCRETO` em `m` no acervo vs `m2` na taxonomia.

### Bloqueiam automacao autenticada

1. Vault configurado por portal.
2. Credenciais dentro do vault, nunca em chat/docs/git/log.
3. Tipo de 2FA/certificado por portal.
4. Consentimento operacional da ENIAC para uso de cada portal.
5. Revisao ToS por portal.
6. Feature flag e auditoria/redaction antes de qualquer login automatico.

### Bloqueiam producao controlada

1. QA/security/devops/founder go/no-go.
2. Observabilidade e rollback.
3. Politica de suporte/incidente.
4. Validacao de RLS/isolamento se houver banco real.

## 6. Proximos 3 Passos Executaveis

### Passo 1 - Consolidar pacote documental em estrutura do app

Owner: `@data-engineer`
Council: `@qa`, `@aios-master`, `@joel-de-menezes-niebuhr`

Entregaveis:
- inventario deduplicado de PDFs;
- status por documento: contabil, CAT/acervo, edital, termo, historico;
- campos esperados por documento;
- lacunas por documento;
- sem copiar segredo para repo.

Gate:
- duplicatas identificadas por nome/tamanho/hash;
- nenhum CPF/senha/token/certificado em JSON publico;
- campos financeiros incertos ficam `null` + lacuna, nao inferidos.

### Passo 2 - Gerar piloto offline de habilitacao ENIAC

Owner: `@dev`
Council: `@data-engineer`, `@qa`, `@joel-de-menezes-niebuhr`

Entregaveis:
- `eniac-ccp.json` com seed revisado;
- CAO ausente tratado como ressalva, nao como atende duro;
- CAO expressamente exigida no edital tratado como `PENDENTE_DADO` ate comprovacao operacional;
- matcher GO / GO_COM_TAREFAS / PENDENTE_DADO / NO_GO;
- Valparaiso ou edital curado como demo manual.

Gate:
- `npm test`;
- `npm run typecheck`;
- falso NO-GO por lacuna sanavel bloqueado;
- ato externo continua bloqueado.

### Passo 3 - Curar ground truth Tier 1 e linguagem do detector

Owner: `@qa`
Council: `@joel-de-menezes-niebuhr`, `@aios-master`, `@ann-cavoukian`/seguranca quando envolver dados sensiveis

Entregaveis:
- matriz de flags esperadas por edital;
- lista de campos `null` que devem silenciar regra;
- frase padrao do alerta tecnico;
- disclaimer fixo.

Gate:
- 0 falso-positivo significa 0 falso-positivo nos editais manualmente anotados, nao promessa geral de producao;
- todo sinal com clausula + trecho + pagina quando possivel + hook legal + campo ERM confiavel;
- campo `null` silencia regra;
- nenhuma frase acusa fraude, direcionamento ou influencia como fato;
- revisao humana obrigatoria antes de impugnacao/recurso.

## 7. Guardrails

- Noyce e copiloto operacional, nao agente autonomo.
- Nenhum lance, protocolo, recurso, intencao de recurso, assinatura ou mensagem externa e automatico.
- IA pode preparar insight, minuta, checklist ou proposta, mas Alice/equipe humana revisa e decide.
- Alice esta confirmada como revisora de propostas/planilhas; validacao juridica ampla exige responsavel humano definido e, idealmente, advogado habilitado.
- Credenciais nunca entram em Markdown, JSON, CSV, print, PDF, commit, log ou chat.
- Portais autenticados ficam `blocked_until_vault`.
- O detector fala "indicio", "exigencia atipica", "avaliar impugnacao", nao "fraude".
- Consulta PNCP publica/dry-run nao equivale a consentimento para agir em nome da ENIAC.
- Score de oportunidade e confidence score permanecem separados.
- Campo incerto vira lacuna explicita; nao vira chute.

## 8. Mensagem Interna de Estado

O Noyce ja tem insumo suficiente para piloto offline/manual com dados reais da ENIAC. O gargalo deixou de ser discovery e passou a ser curadoria/extração: estruturar balanco, CAT/CAO, ERM dos editais e ground truth. O unico contato novo com Stafani deve ser pontual, quando houver uma lacuna concreta que nao possa ser resolvida com o pacote recebido.
