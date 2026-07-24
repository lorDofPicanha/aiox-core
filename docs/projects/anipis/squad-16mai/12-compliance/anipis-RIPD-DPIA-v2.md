# RELATÓRIO DE IMPACTO À PROTEÇÃO DE DADOS PESSOAIS

## RIPD / DPIA — Data Protection Impact Assessment

**Lei nº 13.709/2018 (LGPD), arts. 5º, XVII, e 38**
**Projeto Anipis — Versão 2.0 — maio de 2026**

> **Changelog v2 (19/Mai/2026):** Revisão pós squad legal review (`DPIA-squad-legal-review.md`). Aplicadas correções **INC-1/2/3/4 caminho A** (alinhamento DPIA→realidade), **GAP-A/B/C** (documentação de operacionalização), **COS-1/3** (recontagem riscos + datas). **Pendente:** COS-2 (CNPJ + DPO + emails) aguarda providência founder até D-3 (27/Mai/2026).

---

## SUMÁRIO EXECUTIVO

**Objeto.** Este Relatório de Impacto à Proteção de Dados Pessoais (RIPD) descreve as operações de tratamento de dados pessoais realizadas pela Anipis ("Controladora"), identifica os riscos a direitos e liberdades fundamentais dos titulares, e apresenta as medidas, salvaguardas e mecanismos de mitigação adotados, em cumprimento ao disposto nos arts. 5º, XVII, e 38 da Lei nº 13.709/2018 (LGPD).

**Natureza do tratamento.** A Anipis oferece, em fase de Closed Beta, plataforma de companheira emocional baseada em inteligência artificial, voltada ao apoio em saúde mental. O tratamento envolve dados pessoais sensíveis (saúde mental), uso de tecnologias emergentes (modelos de linguagem de grande porte), transferência internacional a **5 operadores estrangeiros efetivamente ativos** (Supabase, OpenAI, Sentry, Langfuse, Upstash; Anthropic encontra-se em avaliação contratual diferida — `ANTHROPIC_API_KEY` removida do ambiente de produção, com reavaliação documentada para 25/Mai/2026 condicionada à formalização de DPA enterprise com cláusula ZDR explícita) e decisões automatizadas em contexto de vulnerabilidade dos titulares.

**Classificação de risco geral.** ALTO RISCO, nos termos do art. 4º da Resolução CD/ANPD nº 2/2022, conforme análise de enquadramento realizada em documento apartado.

**Conclusão preliminar.** O conjunto de medidas técnicas, administrativas e contratuais documentadas neste RIPD reduz os riscos identificados a níveis residuais compatíveis com a operação responsável da plataforma, condicionado à manutenção integral das salvaguardas listadas na Seção 8 e à revisão deste documento conforme cronograma da Seção 10.

---

## 1. IDENTIFICAÇÃO DOS AGENTES E DO TRATAMENTO

### 1.1. Controladora

| Campo | Valor |
|---|---|
| Razão Social | Anipis [Razão Social a definir] |
| CNPJ | [a ser informado por ocasião da constituição da PJ] |
| Encarregado (DPO) | [a indicar antes do início do Closed Beta] |
| E-mail do Encarregado | dpo@anipis.com.br (endereço a confirmar) |
| Canal do titular | privacidade@anipis.com.br + formulário in-app |

### 1.2. Operadoras

As Operadoras envolvidas no tratamento estão detalhadas na Seção 5 (Fluxos de Dados e Operadoras) e nas Cláusulas-Padrão Contratuais (SCCs) celebradas em instrumento apartado, conforme a Resolução CD/ANPD nº 19/2024.

### 1.3. Descrição do tratamento

A plataforma Anipis processa, armazena e analisa interações textuais entre usuárias e modelo de inteligência artificial conversacional, com finalidade de oferecer suporte emocional e companhia digital baseada em técnicas reconhecidas de bem-estar mental, incluindo, sem limitação: terapia cognitivo-comportamental (TCC), terapia de aceitação e compromisso (ACT), terapia dialética comportamental (DBT) e mindfulness.

A plataforma não realiza, nem se propõe a realizar, atos privativos de profissionais regulamentados pelos respectivos conselhos profissionais (Conselho Federal de Medicina, Conselho Federal de Psicologia). A Anipis posiciona-se expressamente como serviço de bem-estar e companhia emocional, não como tratamento psicoterapêutico ou médico.

---

## 2. FINALIDADES E BASES LEGAIS

Cada finalidade de tratamento está vinculada a uma base legal específica do art. 7º ou do art. 11 da LGPD, conforme detalhamento abaixo.

| Finalidade | Base Legal (LGPD) | Justificativa |
|---|---|---|
| Criação e gestão de conta de usuária | Art. 7º, V — execução de contrato | Necessário à prestação do serviço solicitado pela titular |
| Processamento de conversas com IA companheira | Art. 11, I — consentimento específico e destacado (dados sensíveis) | Trata-se de dado sensível (saúde mental), exigindo consentimento específico |
| Registro de humor (mood tracking) | Art. 11, I — consentimento específico | Dado sensível, idem |
| Diário emocional | Art. 11, I — consentimento específico | Dado sensível, idem |
| Identificação de marcadores de crise e encaminhamento a serviços de emergência | Art. 11, II, "f" — proteção da vida ou da incolumidade física do titular | Dispensa consentimento em situação de risco à vida (ideação suicida, autolesão) |
| Cobrança e antifraude (em fase paga) | Art. 7º, V — execução de contrato | Necessário à cobrança e prevenção de fraudes |
| Monitoramento técnico (observabilidade, métricas operacionais) | Art. 7º, IX — legítimo interesse (LIA documentada) | Necessário à segurança e disponibilidade da plataforma |
| Cumprimento de obrigação legal (tributária, ANPD, judicial) | Art. 7º, II — cumprimento de obrigação legal ou regulatória | Obrigação imposta por lei aplicável |

---

## 3. CATEGORIAS DE DADOS PESSOAIS TRATADOS

### 3.1. Dados pessoais comuns

(a) Dados de identificação: nome ou pseudônimo escolhido pela usuária, endereço de e-mail, identificador único interno (UUID);
(b) Dados de contato: telefone (opcional, para eventual notificação de crise);
(c) Dados técnicos: endereço IP (parcial ou em hash), versão do aplicativo, sistema operacional, tipo de dispositivo, timestamps de uso;
(d) **Data de nascimento (`birth_date`):** coletada exclusivamente no onboarding para fins de verificação de maioridade (Art. 14 LGPD), armazenada apenas após verificação bem-sucedida de idade ≥ 18 anos, conforme princípio de minimização (Art. 6º III LGPD). Registro associado: `age_verified_at` (timestamp de verificação) e `age_verification_method` (atualmente: `date_of_birth_self_declared`).

### 3.2. Dados pessoais sensíveis (art. 5º, II, LGPD)

(e) Conteúdo de mensagens trocadas com a IA companheira, incluindo relatos emocionais, descrições de eventos pessoais, expressões de sofrimento psicológico;
(f) Registros de humor (mood tracking), incluindo intensidade, frequência e padrões temporais;
(g) Entradas de diário emocional;
(h) Marcadores de crise detectados automaticamente pela plataforma (sinalizadores de ideação suicida, autolesão, episódios agudos);
(i) Registros de encaminhamento a serviços de emergência ou rede de apoio.

### 3.3. Categorias de titulares

Pessoas naturais **maiores de 18 anos**, residentes no Brasil ou no exterior, que se cadastrem voluntariamente na plataforma Anipis. Na fase de Closed Beta, universo inicial estimado em 20 (vinte) titulares pré-selecionadas pela Controladora.

**Vedação a menores — operacionalização técnica.** A plataforma Anipis não aceita, em nenhuma fase, cadastros de menores de 18 anos. A vedação é tecnicamente verificável pelos seguintes mecanismos implementados (referência migration `005_age_gate.sql`):

(i) **Coleta obrigatória de data de nascimento** no onboarding (componente `AgeGateStep`), com validação client-side de existência e plausibilidade (sem datas futuras, sem anos < 1900);
(ii) **Verificação server-side autoritativa** via endpoint dedicado (`/age-verification`), que recusa cadastros com idade calculada < 18 anos e registra a tentativa em log auditável (sem persistência de dado pessoal além de timestamp + IP em hash);
(iii) **Middleware `age-gate`** que bloqueia acesso a rotas sensíveis (chat, mood, journal) caso `age_verified_at` esteja vazio no perfil;
(iv) **Persistência mínima**: `birth_date` armazenado apenas após verificação bem-sucedida (princípio da minimização Art. 6º III LGPD), com índice condicional `WHERE age_verified_at IS NOT NULL`;
(v) **Defesa em profundidade** via `minor-indicators-detector` que analisa conteúdo conversacional buscando sinais textuais de minoridade (referências escolares, idade declarada, contexto familiar) e aciona protocolo de revisão e potencial bloqueio de conta.

O tratamento de dados pessoais de crianças e adolescentes em saúde mental envolve regime regulatório próprio (art. 14 LGPD + Estatuto da Criança e do Adolescente + Resolução CONANDA aplicável), cuja análise dedicada não está incorporada à presente versão deste RIPD por não estar dentro do escopo de público autorizado. Mecanismos adicionais de verificação (KYC leve, prova de vida) serão avaliados em fase de escala pública pós-Closed-Beta.

---

## 4. CICLO DE VIDA DOS DADOS

| Etapa | Descrição e medidas |
|---|---|
| Coleta | Direta da titular, por inserção manual no aplicativo, após apresentação de Política de Privacidade, Termos de Uso e prompt de consentimento granular específico para dados sensíveis (art. 11, I) e transferência internacional (art. 33, IV). Coleta de `birth_date` para verificação de maioridade (Art. 14 LGPD). |
| Uso | Processamento em tempo real para geração de respostas da IA. Inferência LLM realizada por operadora estrangeira ativa (OpenAI; Anthropic deferida — ver §5), com filtro de PII estruturada (`redactForObservability`) aplicado pelo software antes da transmissão. Coverage de filtragem validada por CI gate (`pii-leak-regression.test.ts`, 15 testes). |
| Armazenamento | Banco de dados PostgreSQL gerenciado por operadora (Supabase, AWS us-east-1), com criptografia em repouso (AES-256), em trânsito (TLS 1.2+) e Row Level Security ativa por tabela. |
| Compartilhamento | Transferência internacional a até 6 operadoras (vide Seção 5), regida por SCCs ANPD Módulo 2 (Resolução CD/ANPD nº 19/2024). Sem compartilhamento com terceiros não-operadores. Sem venda de dados. |
| Retenção | Enquanto durar a conta ativa, acrescido de 30 dias para processamento de pedido de exclusão. Backups PITR janela de 7 dias. Após exclusão de conta, hard delete em até 30 dias, com exceção específica detalhada em §4.1. |
| Eliminação | Exclusão definitiva mediante (i) pedido da titular (art. 18, VI), (ii) revogação de consentimento (art. 8º, §5º), ou (iii) cessação da finalidade. Pseudonimização irreversível em registros de crise para preservação de integridade probatória (ver §4.1). |

### 4.1. Tratamento específico de crisis_events na exclusão de conta

A pedido de exclusão de conta (Art. 18 VI LGPD), os registros de crisis_events recebem tratamento específico:

(a) **Pseudonimização imediata e irreversível**: `user_id` substituído por tombstone (UUID não-reversível) e remoção de `matchedKeywords` (referência: `account-deletion-service.ts:499-511`);
(b) **Preservação de hash chain do `audit_events`**: registros de auditoria mantidos por **5 (cinco) anos** para defesa em demanda judicial (fundamento: Art. 7º §3º CPC + Art. 16, II LGPD — preservação para defesa em processo);
(c) **Acesso restrito**: dados pseudonimizados de crisis_events e audit_events acessíveis apenas ao Encarregado e a auditor externo eventualmente designado pela ANPD, com log de cada acesso;
(d) **Comunicação ao titular**: aviso na interface de exclusão de conta informando expressamente que registros de crise são pseudonimizados (não eliminados imediatamente) para preservação da integridade da cadeia de auditoria, conforme Art. 16, II LGPD.

A pseudonimização irreversível, conforme entendimento doutrinário ANPD em formação, cumpre adequadamente o direito de eliminação previsto no Art. 18, VI LGPD para dados originalmente coletados sob base legal do Art. 11, II, "f" (proteção da vida).

---

## 5. FLUXOS DE DADOS E OPERADORAS

A arquitetura técnica da plataforma envolve as seguintes operadoras estrangeiras, cada uma com função, fluxo de dado e prazo de retenção específico:

| Operadora | Função | Dados transferidos | Jurisdição | Retenção | Status Closed Beta |
|---|---|---|---|---|---|
| Supabase | Banco de dados primário | Dados completos: identificação, mensagens, humor, crise, diário | EUA (AWS us-east-1) | Conta ativa + 30d + PITR 7d | **ATIVA** |
| OpenAI | Inferência LLM principal + embeddings | Texto com PII estruturada filtrada (sem identificadores diretos) | EUA (Azure) | **Sem ZDR no Closed Beta.** Retenção temporária de até 30 dias para monitoramento de abuso, conforme termos de API da OpenAI, com posterior eliminação; **dados não utilizados para treinamento de modelos**. Base/salvaguardas: **consentimento específico e destacado do titular (Art. 33, VIII)** + Termos de API/Usage Policies da OpenAI (vedação a treinamento, confidencialidade — Art. 39) + pseudonimização na origem. **DPA formal e ZDR adiados para pós-CNPJ** (conta Business da OpenAI ainda indisponível). Renúncia consciente ao ZDR registrada via flag `OPENAI_ZDR_WAIVED_ACK` (enforcement `env-zdr.ts`, fail-closed). | **ATIVA (sem ZDR/DPA)** |
| Anthropic | Inferência LLM fallback | Mensagens com PII estruturada filtrada (quando ativada) | EUA (AWS multi-região) | Zero Data Retention (ZDR) — **a contratar via DPA enterprise** | **NÃO ATIVA** — `ANTHROPIC_API_KEY` removida de produção; reavaliação documentada em 25/Mai/2026. Reativação condicionada à formalização de cláusula contratual ZDR em DPA, não apenas configuração de dashboard. |
| Sentry | Monitoramento de erros | Stack traces, UUID hash, metadados técnicos (sem conteúdo) | EUA | 30 dias (configurado; default 90d) | **ATIVA** com 6-layer PII hardening (`sentry-config.ts`, 25 testes) |
| Upstash Redis | Cache e rate-limiting | Tokens de sessão (hash), UUID interno | EUA (AWS us-east-1) | TTL ≤ 15 min | **ATIVA** — cutover regional (sa-east-1) avaliado e adiado pelo founder em 19/Mai (D16). Reavaliação pós-Beta. |
| Langfuse | Observabilidade de LLM | Prompts e completions com PII filtrada (`redactForObservability`) | União Europeia (Frankfurt) | 14 dias (configurado; default 60d) | **ATIVA** |

**Total operadoras estrangeiras efetivamente ativas no Closed Beta:** 5 (Supabase, OpenAI, Sentry, Langfuse, Upstash). Anthropic permanece NÃO ATIVA (deferida — D2 18/Mai).

Detalhamento da base contratual em Cláusulas-Padrão Contratuais Módulo 2 ANPD, conforme Resolução CD/ANPD nº 19/2024, em instrumento apartado deste RIPD.

---

## 6. ANÁLISE DE RISCOS A DIREITOS E LIBERDADES FUNDAMENTAIS

**Metodologia.** A análise de riscos adota matriz qualitativa de probabilidade × impacto, com escala de 3 níveis (baixo, médio, alto), e indica para cada risco identificado: (i) descrição; (ii) direitos fundamentais afetados; (iii) probabilidade inerente (sem mitigação); (iv) impacto inerente; (v) medidas mitigatórias adotadas; (vi) probabilidade residual; (vii) impacto residual.

### 6.1. Quadro consolidado de riscos

| # | Risco identificado | Direitos afetados | Risco inerente | Risco residual |
|---|---|---|---|---|
| R1 | Vazamento de banco de dados primário (Supabase) com exposição de mensagens e registros de saúde mental | Privacidade, intimidade, dignidade | Alto | Médio |
| R2 | Requisição governamental estrangeira (FISA §702, EO 12333, CLOUD Act) com gag order | Privacidade, livre manifestação | Médio | Baixo |
| R3 | Falha em protocolo de crise (falso negativo: ideação não detectada) com consequência grave à titular | Vida, integridade física | Alto | Médio |
| R4 | Falha em protocolo de crise (falso positivo: encaminhamento indevido a SAMU/CVV) com dano à dignidade | Dignidade, autonomia, privacidade | Médio | Baixo |
| R5 | Uso indevido de dados sensíveis para treinamento de modelo de IA por operadora estrangeira | Autodeterminação informativa, privacidade | Médio | Baixo |
| R6 | Alucinação da IA (hallucination) gerando conteúdo prejudicial, ofensivo ou clinicamente perigoso | Saúde mental, dignidade | Alto | Médio |
| R7 | Dependência emocional excessiva da titular em relação à plataforma (compulsividade, isolamento social) | Saúde mental, autonomia | Médio | Médio |
| R8 | Confusão sobre natureza do serviço (titular atribuir à IA papel de psicoterapeuta ou médico) | Saúde, informação adequada, dignidade | Alto | Médio |
| R9 | Prompt injection ou jailbreak por usuária mal-intencionada (ou por terceiro via canal vulnerável) | Segurança, integridade do serviço | Médio | Baixo |
| R10 | Re-identificação por inferência cruzada de dados pseudoanonimizados (especialmente em base reduzida) | Privacidade, intimidade | Médio | Médio |
| R11 | Incidente em operadora terceira (ex.: vazamento Supabase, OpenAI) com efeito cascata | Privacidade, intimidade, dignidade | Médio | Médio |
| R12 | Falha em atender requisição de direito do titular (acesso, exclusão, portabilidade) dentro do prazo legal | Autodeterminação informativa | Médio | Baixo |

---

## 7. DETALHAMENTO DOS RISCOS E MEDIDAS MITIGATÓRIAS

### R1 — Vazamento do banco de dados primário

**Descrição.** Acesso não autorizado, exfiltração ou exposição pública dos dados armazenados em Supabase, contendo o universo completo de dados pessoais comuns e sensíveis das titulares.

**Probabilidade inerente:** Média. Bases de dados em nuvem são alvos preferenciais; vendor de qualidade reduz, mas não elimina.

**Impacto inerente:** Crítico. Dano moral presumido em jurisprudência consolidada; reputação institucional; sanção ANPD; potencial dano material às titulares.

**Medidas mitigatórias:**
(a) criptografia AES-256 em repouso e TLS 1.2+ em trânsito;
(b) Row Level Security ativa em todas as tabelas com dados pessoais;
(c) autenticação multifator (2FA) obrigatória na conta administrativa;
(d) princípio de mínimo privilégio para service roles;
(e) auditoria de acessos via Postgres pg_audit + Supabase Logs;
(f) certificação SOC 2 Type II da operadora (validação anual);
(g) plano de resposta a incidentes com prazo de notificação à ANPD em até 3 dias úteis (Res. 15/2024);
(h) previsão contratual em SCC de notificação da Controladora em até 24 horas para dados sensíveis.

**Probabilidade residual:** Baixa-Média.
**Impacto residual:** Alto (a natureza dos dados não permite redução do impacto, apenas da probabilidade).

### R2 — Requisição governamental estrangeira

**Descrição.** Operadoras sediadas nos EUA podem receber requisições compulsórias de autoridades federais (FBI, NSA, CIA) sob legislação de inteligência (FISA §702, Executive Order 12333) ou comercial (CLOUD Act), eventualmente acompanhadas de gag order que impeça notificação à Controladora.

**Medidas mitigatórias:**
(a) cláusula contratual SCC exigindo notificação prompt à Controladora, salvo impedimento legal;
(b) cláusula exigindo contestação judicial da requisição pela Operadora pelos meios legais disponíveis (TRAP procedure, motion to quash);
(c) filtragem de PII estruturada antes da transmissão a operadoras de IA (OpenAI; Anthropic quando ativada), reduzindo o conteúdo identificável passível de requisição;
(d) compromisso contratual de divulgação semestral de transparency report agregado pela Operadora (número de requisições recebidas e atendidas), respaldado por cláusula 12(f) das SCCs;
(e) consideração de migração progressiva, por etapas tecnicamente viáveis, a vendors em jurisdição com regime equivalente (UE, Brasil). **Roadmap pós-Beta:** reavaliação de migração regional de Upstash para sa-east-1 (São Paulo) — avaliada e adiada pelo founder em 19/Mai/2026 (D16) por pragmatismo operacional.

**Risco residual:** Baixo-moderado. Na ausência de ZDR e de DPA formal durante o Closed Beta, o risco de exposição por requisição governamental estrangeira é mitigado por: (i) base legal de consentimento específico e destacado (Art. 33, VIII), suficiente por si só para a transferência; (ii) pseudonimização e filtragem de PII na origem (sem identificadores diretos transmitidos); (iii) Termos de API/Usage Policies da OpenAI, que vedam uso para finalidade própria e para treinamento de modelos; (iv) retenção temporária limitada (até 30 dias, exclusivamente para monitoramento de abuso) com posterior eliminação. A execução de DPA formal e a contratação de ZDR permanecem no roadmap pós-Beta, condicionadas à abertura do CNPJ/conta Business.

### R3 — Falha de protocolo de crise (falso negativo)

**Descrição.** A IA não identifica corretamente marcadores de ideação suicida, autolesão ou crise aguda em mensagem da titular, deixando de acionar protocolo de encaminhamento a serviços de emergência ou rede de apoio.

**Medidas mitigatórias:**
(a) classificador automatizado dedicado à detecção de marcadores de crise, executado em paralelo à inferência LLM principal e calibrado para alta sensibilidade (priorizando falso positivo sobre falso negativo);
(b) lista de palavras-chave e expressões revisada periodicamente, com consultoria de profissionais de saúde mental (a contratar);
(c) fluxo determinístico de encaminhamento que bypassa o LLM em situações de alta confiança de crise (acionamento direto, sem dependência de inferência);
(d) exibição persistente, na interface, do número do Centro de Valorização da Vida (CVV — 188) e do Serviço de Atendimento Móvel de Urgência (SAMU — 192);
(e) comunicação clara, na Política de Privacidade e Termos de Uso, dos limites do serviço e da inadequação a situações de emergência;
(f) treinamento ativo (system prompt) da IA para identificar e responder adequadamente a expressões de risco;
(g) hash chain de `audit_events` que registra cada detecção e resposta, preservada por 5 anos para defesa e auditoria, garantindo rastreabilidade do funcionamento do protocolo.

**Risco residual:** Médio. A natureza do problema (saúde mental) impede a redução do risco a níveis baixos; o serviço não substitui atendimento especializado.

### R4 — Falha de protocolo de crise (falso positivo)

**Descrição.** A IA identifica equivocadamente marcadores de crise em mensagem que não os contém, acionando encaminhamento desnecessário a serviços de emergência e causando constrangimento, perda de confiança e dano à dignidade da titular.

**Medidas mitigatórias:**
(a) calibração do classificador para minimizar falsos positivos em escala (mantendo sensibilidade alta para casos críticos);
(b) duas camadas de detecção (filtro de superfície + análise contextual) antes de acionamento;
(c) **preferência por encaminhamento informativo** ("se você está em crise, ligue 188") em vez de acionamento ativo;
(d) pedido de confirmação à titular antes de qualquer acionamento ativo de terceiros (sempre que tecnicamente possível);
(e) registro auditável de cada acionamento para revisão contínua do classificador.

**Risco residual:** Baixo.

### R5 — Uso indevido para treinamento de modelo

**Descrição.** Operadora de IA (OpenAI; Anthropic quando ativada) utiliza, em descumprimento contratual, prompts e completions transmitidos pela Controladora para treinamento ou fine-tuning de modelos próprios.

**Medidas mitigatórias:**
(a) cláusula contratual expressa de vedação ao uso para treinamento (cláusula 3.2 das SCCs);
(b) Termos e Usage Policies de API da OpenAI que estabelecem expressamente que dados enviados via API **não são utilizados para treinamento de modelos** (vigentes independentemente de DPA formal). No Closed Beta opera-se **sem ZDR e sem DPA formal** (ambos adiados ao pós-CNPJ) (renúncia consciente registrada via flag `OPENAI_ZDR_WAIVED_ACK`; o enforcement `env-zdr.ts` exige decisão explícita do controlador e falha o boot em produção na ausência de qualquer declaração — ZDR confirmado OU renúncia reconhecida). Contratação de ZDR em tier enterprise mantida no roadmap pós-Beta;
(c) auditoria contratual periódica (relatórios anuais SOC 2 Type II);
(d) filtragem de PII estruturada antes da transmissão (validada por CI gate `pii-leak-regression.test.ts`, 15 testes), reduzindo valor potencial dos dados para treinamento.

**Risco residual:** Baixo. O vetor de treinamento é endereçado primariamente pela vedação dos Termos/Usage Policies de API da OpenAI e pela filtragem de PII, independentemente de ZDR ou DPA formal. A retenção temporária (até 30 dias, monitoramento de abuso) não habilita uso para treinamento.

### R6 — Alucinação da IA

**Descrição.** A IA gera conteúdo factualmente incorreto, prejudicial, ofensivo ou clinicamente perigoso (ex.: indicação errônea de medicamento, validação inadequada de pensamento autodestrutivo, conselho médico equivocado).

**Medidas mitigatórias:**
(a) system prompt rigoroso com diretivas explícitas de não fornecer aconselhamento médico, psiquiátrico ou medicamentoso;
(b) filtros de saída (output moderation) com listas de bloqueio temáticas;
(c) uso de modelos com Constitutional AI / Reinforcement Learning from Human Feedback;
(d) monitoramento contínuo de qualidade via Langfuse com avaliação humana periódica de amostragem aleatória;
(e) canal de denúncia in-app para que titulares reportem respostas inadequadas;
(f) **encaminhamento informativo persistente** (banner + mensagem inline da IA) a recursos profissionais (CVV 188, SAMU 192) quando detectado conteúdo de alto risco, com registro auditável de cada acionamento no hash chain de `audit_events`. Mecanismo de circuit breaker programático (encerramento de sessão + modal bloqueante) está em avaliação como funcionalidade pós-Closed-Beta.

**Risco residual:** Médio. Limitação tecnológica inerente a LLMs atuais; mitigação importante, mas não eliminatória.

### R7 — Dependência emocional excessiva

**Descrição.** Titular desenvolve relação compulsiva ou substitutiva com a plataforma, afetando seu funcionamento social, ocupacional ou afetivo fora da aplicação.

**Medidas mitigatórias:**
(a) design intencional anti-compulsividade (ex.: ausência de notificações push agressivas, mensagens periódicas estimulando vínculos humanos);
(b) sugestões periódicas, no fluxo conversacional, de busca por suporte profissional e fortalecimento de rede social;
(c) limites diários opcionais de uso, ajustáveis pela titular;
(d) comunicação transparente, em Termos de Uso, sobre os limites do serviço e a recomendação de busca por psicólogo ou psiquiatra quando indicado.

**Risco residual:** Médio. Trata-se de risco estrutural de produtos digitais com vínculo afetivo; mitigação atenua mas não elimina.

### R8 — Confusão sobre a natureza do serviço

**Descrição.** Titular atribui à IA papel de psicoterapeuta ou médica, esperando do serviço atos privativos de profissionais regulamentados, o que (i) pode causar dano à titular pela ausência de tratamento real; (ii) pode caracterizar exercício ilegal da medicina ou da psicologia em desfavor da Anipis.

**Medidas mitigatórias:**
(a) comunicação clara e destacada, em todas as superfícies (onboarding, política de privacidade, termos de uso, footer permanente do app), de que a Anipis NÃO é serviço médico, psicológico ou psicoterapêutico;
(b) system prompt rigoroso com auto-identificação da IA como "companheira emocional digital" e não como profissional de saúde;
(c) recusa programática a executar atos como "diagnóstico", "prescrição", "sessão de terapia" ou "avaliação clínica";
(d) sugestão proativa de busca por profissional habilitado quando o tema da conversa exigir;
(e) verificação contínua de conformidade com Resolução CFM nº 2.314/2022 (telemedicina), **Resolução CFM nº 2.454/2026** (assistentes de IA em saúde, com previsão de vigência a partir de agosto/2026) e legislação correlata sobre exercício profissional, com revisão semestral de aderência e parecer jurídico especializado em mudanças regulatórias materiais;
(f) consultoria jurídica especializada sobre fronteira regulatória, documentada em parecer apartado.

**Risco residual:** Médio. A fronteira é movediça e depende de evolução regulatória; vigilância contínua é necessária.

### R9 — Prompt injection e jailbreak

**Descrição.** Usuária ou terceiro manipula a IA para que ela ignore suas diretivas de segurança, gerando conteúdo prejudicial ou expondo informações de outras usuárias.

**Medidas mitigatórias:**
(a) system prompt robusto, com defesas contra técnicas comuns de injection (ignore previous instructions, role-play attacks, etc.);
(b) modelos com guardrails de fábrica (Constitutional AI);
(c) ausência de cross-context entre sessões de usuárias diferentes (isolamento por session token);
(d) monitoramento em Langfuse de padrões anômalos para revisão humana;
(e) rate-limiting agressivo (Upstash) para inibir tentativas automatizadas em escala.

**Risco residual:** Baixo.

### R10 — Re-identificação por inferência cruzada

**Descrição.** Em base reduzida (20 titulares no Closed Beta), eventual incidente em operadora pode permitir re-identificação de titular individual por inferência sobre conteúdo único (relatos pessoais altamente específicos), mesmo com PII estruturada removida.

**Medidas mitigatórias:**
(a) retenção curta em Langfuse (14 dias);
(b) na OpenAI, retenção temporária limitada (até 30 dias, monitoramento de abuso) sob os Termos de API — sem ZDR nem DPA formal no Closed Beta (ambos no roadmap pós-CNPJ; renúncia ao ZDR registrada); Anthropic mantida desativada;
(c) uso de UUID hash em vez de identificadores claros;
(d) evolução do controle à medida em que o universo de titulares crescer (a re-identificação por inferência cruzada perde força com escala).

**Risco residual:** Médio na fase de Closed Beta; tende a baixo com escala.

### R11 — Incidente em operadora terceira

**Descrição.** Vazamento, comprometimento ou má-conduta em operadora estrangeira afeta dados de titulares Anipis, gerando responsabilidade solidária da Controladora perante titulares e ANPD.

**Medidas mitigatórias:**
(a) seleção criteriosa de operadoras com certificações de segurança (SOC 2 Type II, ISO 27001);
(b) SCCs robustas com cláusulas de notificação rápida, cooperação em incidentes e indenização;
(c) plano de resposta a incidentes envolvendo operadora, com comunicação à ANPD e às titulares;
(d) diversificação progressiva (não dependência absoluta de única operadora para função crítica).

**Risco residual:** Médio (risco sistêmico de cadeia, não mitigável em sua totalidade).

### R12 — Falha em atender direito do titular

**Descrição.** Não atendimento de requisição de direito do titular (acesso, exclusão, portabilidade) no prazo legal de 15 dias do art. 19, §3º, da LGPD.

**Medidas mitigatórias:**
(a) canal único e claro de contato (privacidade@anipis.com.br + formulário in-app);
(b) fluxo automatizado de exclusão de conta (botão "excluir minha conta" na interface, com efeito programático em até 30 dias) — implementado conforme `account-deletion-service.ts` cobrindo as 17 tabelas com dados pessoais;
(c) **fluxo de exportação de dados (data portability)**: na fase de Closed Beta, disponibilizada **mediante solicitação ao Encarregado** (`privacidade@anipis.com.br`), com geração de pacote JSON estruturado em até 15 dias por DPO via query SQL pre-aprovada. Endpoint self-service `GET /me/export` planejado para fase pós-Closed-Beta;
(d) playbook documentado para o Encarregado responder dentro do prazo;
(e) monitoramento de SLA de atendimento.

**Risco residual:** Baixo.

---

## 8. SALVAGUARDAS CONSOLIDADAS

As medidas de proteção adotadas integram-se em quatro camadas complementares:

### 8.1. Camada técnica

(a) criptografia em repouso (AES-256) e em trânsito (TLS 1.2+);
(b) filtragem de PII estruturada antes da transmissão a operadoras de IA, com cobertura validada por CI gate (`pii-leak-regression.test.ts`, 15 testes static-analysis);
(c) classificadores dedicados de crise com fluxo determinístico não-LLM;
(d) Row Level Security em todas as tabelas de dados pessoais;
(e) autenticação multifator obrigatória em contas administrativas;
(f) rate-limiting e mecanismos anti-abuso;
(g) isolamento de sessões por session token;
(h) logging auditável de acessos e operações, com hash chain de `audit_events` preservada por 5 anos.

### 8.2. Camada organizacional

(a) indicação de Encarregado pelo Tratamento de Dados Pessoais (DPO);
(b) manutenção de Registro das Operações de Tratamento (ROPA);
(c) Legitimate Interest Assessments (LIA) documentadas para cada base legal de legítimo interesse (Sentry, Langfuse);
(d) plano de resposta a incidentes com prazos e responsáveis;
(e) playbook para atendimento a direitos de titulares;
(f) revisão anual do presente RIPD, em 30 de maio (aniversário do Closed Beta) ou na data de aprovação efetiva, o que ocorrer primeiro;
(g) treinamento periódico da equipe operacional sobre LGPD e segurança.

### 8.3. Camada contratual

(a) Cláusulas-Padrão Contratuais Módulo 2 ANPD (Res. 19/2024) com todas as operadoras estrangeiras ativas;
(b) Data Processing Agreements (DPAs) vendor com todas as operadoras;
(c) no Closed Beta, operação **sem ZDR e sem DPA formal** com a operadora de IA ativa (OpenAI), apoiada em **consentimento (Art. 33, VIII)** + Termos de API/Usage Policies + pseudonimização, mediante renúncia consciente ao ZDR do controlador (`OPENAI_ZDR_WAIVED_ACK`, enforcement fail-closed em `env-zdr.ts`); execução de DPA formal e contratação de ZDR mantidas no roadmap pós-CNPJ;
(d) cláusulas expressas de vedação ao uso para treinamento de modelo;
(e) cláusulas de notificação rápida de incidente (24h para dados sensíveis);
(f) cláusulas de auditoria periódica e cooperação com ANPD;
(g) cláusula contratual de transparency report semestral agregado para requisições governamentais estrangeiras (SCC Cláusula 12(f)).

### 8.4. Camada comunicacional e ética

(a) Política de Privacidade clara, em linguagem acessível, com versão simplificada;
(b) Termos de Uso com posicionamento explícito sobre limites do serviço;
(c) mecanismo de consentimento granular com aceites separados para dados sensíveis, transferência internacional e processamento por IA, apresentado em prompt destacado conforme Art. 11, I LGPD, antes da primeira coleta de dado sensível;
(d) exibição persistente de canais de emergência (CVV 188, SAMU 192);
(e) comunicação transparente sobre uso de IA generativa;
(f) design anti-compulsividade da interface.

---

## 9. EXERCÍCIO DE DIREITOS DOS TITULARES

As titulares podem exercer, a qualquer tempo, os direitos previstos no art. 18 da LGPD, conforme detalhamento:

(I) **Confirmação de existência de tratamento** — atendida em até 15 dias, conforme art. 19, §3º, LGPD;
(II) **Acesso aos dados** — fornecimento em formato estruturado e legível por máquina;
(III) **Correção de dados** — disponível diretamente na interface de usuária;
(IV) **Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade**;
(V) **Portabilidade** — disponibilização de cópia completa dos dados em formato JSON estruturado mediante solicitação ao Encarregado, com prazo de atendimento de até 15 dias na fase de Closed Beta. Implementação de endpoint self-service `GET /me/export` planejada para fase pós-Closed-Beta;
(VI) **Eliminação dos dados tratados com consentimento** — fluxo automatizado de exclusão de conta, com exceção específica de pseudonimização de crisis_events e preservação de hash chain de audit_events por 5 anos para defesa em demanda judicial (Art. 7º §3 CPC + Art. 16 II LGPD), conforme §4.1;
(VII) **Informação sobre entidades com as quais houve compartilhamento** — disponível em Política de Privacidade e neste RIPD (§5);
(VIII) **Informação sobre possibilidade de não fornecer consentimento e consequências**;
(IX) **Revogação de consentimento** — atendida imediatamente, com efeitos prospectivos;
(X) **Oposição a tratamento realizado com fundamento em hipótese de dispensa de consentimento**, em caso de descumprimento da LGPD.

**Canal preferencial:** privacidade@anipis.com.br + formulário in-app dedicado
**Prazo de atendimento:** 15 (quinze) dias, prorrogáveis por 15 dias adicionais mediante justificativa, nos termos do art. 19, §3º, LGPD

---

## 10. REVISÃO E ATUALIZAÇÃO

Este Relatório de Impacto será revisado:

(a) **anualmente**, em 30 de maio (aniversário do Closed Beta) ou na data de aprovação efetiva, o que ocorrer primeiro;
(b) sempre que houver alteração material no modelo de negócio, na arquitetura técnica, no rol de operadoras, no volume de titulares ou no escopo de dados tratados;
(c) em resposta a determinação da ANPD em procedimento fiscalizatório;
(d) após qualquer incidente de segurança relevante, para incorporar lições aprendidas;
(e) diante de alterações legais ou regulamentares relevantes (novas resoluções ANPD, decisões judiciais paradigmáticas, etc.);
(f) **imediatamente após entrada em vigor da Resolução CFM nº 2.454/2026** (previsão agosto/2026), com reavaliação do posicionamento "bem-estar vs. saúde" da Plataforma e dos riscos R6/R8.

Histórico de versões mantido em quadro próprio ao final deste documento.

---

## 11. CONCLUSÃO

O tratamento de dados pessoais realizado pela Anipis configura, indiscutivelmente, atividade de alto risco aos direitos e liberdades fundamentais dos titulares, em razão da sensibilidade dos dados envolvidos (saúde mental), da centralidade da inteligência artificial generativa no fluxo, da transferência internacional a múltiplas operadoras e da potencialidade de impacto significativo às titulares em contexto de vulnerabilidade emocional.

O conjunto de medidas técnicas, organizacionais, contratuais e comunicacionais documentadas neste Relatório de Impacto à Proteção de Dados Pessoais reduz os **12 (doze) riscos identificados** a níveis residuais compatíveis com a operação responsável da plataforma. Dos 12 riscos, **7 (sete) permanecem com nível residual médio** (R1, R3, R6, R7, R8, R10, R11) e **5 (cinco) com nível residual baixo** (R2, R4, R5, R9, R12). Os riscos residuais médios decorrem de limitações estruturais inerentes ao estado da arte tecnológico, ao escopo do serviço ou à fase pré-operacional. Tais riscos residuais são monitorados, comunicados às titulares e endereçados por mecanismos de salvaguarda contínua.

Este Relatório constitui documento técnico-jurídico orientado pela cultura de accountability prevista no art. 6º, X, da LGPD, e estará disponível à Autoridade Nacional de Proteção de Dados em caso de fiscalização, bem como aos titulares em versão sintética e linguagem acessível.

Documento elaborado em maio de 2026, sujeito a revisão e aprofundamento por parecer jurídico formal a ser emitido por advogada especializada regularmente inscrita na Ordem dos Advogados do Brasil.

---

___________________________________________
**Encarregado pelo Tratamento de Dados Pessoais (DPO)**
[Nome] — [Identificação]
[Local], maio de 2026.

---

## Histórico de versões

| Versão | Data | Autoria | Notas |
|---|---|---|---|
| 1.0 | maio/2026 | [autoria a confirmar] | Versão inicial |
| 2.0 | 19/Mai/2026 | Squad legal AIOS (review) + correções caminho A | Aplicadas correções pós squad legal review: alinhamento Anthropic deferida, Upstash migração, circuit breaker → encaminhamento informativo, transparency report semestral, recontagem riscos residuais (7 médios), datas de revisão fixas, operacionalização técnica vedação a menores, Resolução CFM 2.454/2026, processo manual portabilidade pré-Beta. **Pendente:** preenchimento Tabela 1 (CNPJ + DPO + emails) até D-3 (27/Mai). |
