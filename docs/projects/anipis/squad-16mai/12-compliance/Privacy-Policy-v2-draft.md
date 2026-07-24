# Política de Privacidade — Anipis

**Versão 2.0 (draft) — 19 de maio de 2026**
**Status:** ⚠️ Rascunho para revisão Patricia Peck Advocacia · não publicar antes de sign-off jurídico
**Cross-doc:** alinhado a `anipis-RIPD-DPIA-v2.md` + `SCCs-ANPD-19-2024-draft-v1-PatriciaPeck.md` + `SCCs-v2-proposed-edits.md`

---

## 1. Introdução

A Anipis [Razão Social a definir], pessoa jurídica de direito privado, inscrita no CNPJ sob o nº [a ser informado por ocasião da constituição da PJ], com sede em [endereço completo] (doravante **"Anipis"** ou **"Controladora"**), tem o compromisso de proteger os dados pessoais das pessoas que utilizam sua plataforma de companhia emocional digital baseada em inteligência artificial (doravante **"você"** ou **"titular"**).

Esta Política de Privacidade descreve, em conformidade com a **Lei nº 13.709/2018 (LGPD)**, como coletamos, usamos, armazenamos, compartilhamos e protegemos seus dados pessoais.

A Anipis posiciona-se expressamente como **serviço de bem-estar e companhia emocional**, e NÃO como serviço médico, psicológico, psicoterapêutico ou de telemedicina, nos termos da Resolução CFM nº 2.314/2022 e (a partir de agosto de 2026) Resolução CFM nº 2.454/2026.

---

## 2. Controladora e Encarregado (DPO)

| Campo | Valor |
|---|---|
| Razão Social | Anipis [Razão Social a definir] |
| CNPJ | [a ser informado por ocasião da constituição da PJ] |
| Endereço | [Endereço completo da sede] |
| Encarregado (DPO) | [Nome a indicar antes do início do Closed Beta] |
| E-mail do DPO | dpo@anipis.com.br |
| Canal do titular | privacidade@anipis.com.br + formulário in-app |

> **Hard gate pré-Beta:** os campos placeholder acima devem ser preenchidos antes da assinatura da Política e da abertura do Closed Beta em 30 de maio de 2026.

---

## 3. Dados Pessoais Coletados

### 3.1. Dados pessoais comuns

(a) **Identificação:** nome ou pseudônimo escolhido por você, endereço de e-mail, identificador único interno (UUID);
(b) **Contato:** telefone (opcional, para eventual notificação de crise);
(c) **Dados técnicos:** endereço IP (parcial ou em hash), versão do aplicativo, sistema operacional, tipo de dispositivo, timestamps de uso;
(d) **Data de nascimento (`birth_date`):** coletada exclusivamente para verificação de maioridade (Art. 14 LGPD), armazenada apenas após verificação bem-sucedida de idade ≥ 18 anos.

### 3.2. Dados pessoais sensíveis (Art. 5º, II, LGPD)

(e) Conteúdo de mensagens trocadas com a IA companheira, incluindo relatos emocionais, descrições de eventos pessoais, expressões de sofrimento psicológico;
(f) Registros de humor (mood tracking), incluindo intensidade, frequência e padrões temporais;
(g) Entradas de diário emocional;
(h) Marcadores de crise detectados automaticamente (sinalizadores de ideação suicida, autolesão, episódios agudos);
(i) Registros de encaminhamento a serviços de emergência ou rede de apoio.

### 3.3. Categorias de titulares

Pessoas naturais **maiores de 18 anos**, residentes no Brasil ou no exterior, que se cadastrem voluntariamente. Na fase de Closed Beta (30/Mai/2026), universo inicial estimado em 20 (vinte) titulares pré-selecionadas pela Controladora.

**Vedação operacional a menores:** o cadastro de menores de 18 anos é bloqueado programaticamente pelo Anipis através de (i) coleta obrigatória de data de nascimento no onboarding, (ii) verificação server-side autoritativa, (iii) middleware de bloqueio a rotas sensíveis, (iv) detector textual de sinais de minoridade como defesa em profundidade.

---

## 4. Base Legal para Tratamento

Cada finalidade é vinculada a uma base legal específica do Art. 7º ou do Art. 11 da LGPD:

| Finalidade | Base Legal LGPD |
|---|---|
| Criação e gestão de conta | Art. 7º, V — execução de contrato |
| Processamento de conversas com IA | Art. 11, I — consentimento específico e destacado (dados sensíveis) |
| Registro de humor (mood) | Art. 11, I — consentimento específico |
| Diário emocional | Art. 11, I — consentimento específico |
| Identificação e encaminhamento de crise | Art. 11, II "f" — proteção da vida ou da incolumidade física |
| Cobrança e antifraude (fase paga) | Art. 7º, V — execução de contrato |
| Observabilidade técnica | Art. 7º, IX — legítimo interesse (LIA documentada) |
| Obrigação legal (tributária, ANPD, judicial) | Art. 7º, II — cumprimento de obrigação legal |

---

## 5. Finalidades do Tratamento

Tratamos seus dados pessoais exclusivamente para:

(a) **Oferecer o serviço de companhia emocional digital** — gerar respostas da IA, manter histórico de conversa, sugerir exercícios baseados em TCC/ACT/DBT/mindfulness;
(b) **Monitorar humor e bem-estar** — apresentar insights pessoais ao longo do tempo;
(c) **Detectar sinais de crise** — acionar protocolos de encaminhamento a serviços de emergência (CVV 188, SAMU 192);
(d) **Manter segurança e disponibilidade da plataforma** — observabilidade técnica, rate-limiting, detecção de abuso;
(e) **Cumprir obrigações legais** — atender requisições da ANPD, do Judiciário e demais autoridades competentes;
(f) **Cobrança** — quando aplicável (a Anipis não cobra na fase de Closed Beta).

A Anipis **não vende dados pessoais**. A Anipis **não utiliza seus dados para fins de marketing comportamental** sem consentimento separado e específico.

---

## 6. Compartilhamento de Dados

Compartilhamos dados pessoais exclusivamente com:

(a) **Operadoras tecnológicas** estritamente necessárias para a prestação do serviço, sob regime de operação delegada (Art. 5º, VII LGPD) e Contratos de Processamento de Dados (DPA);
(b) **Autoridades competentes** mediante ordem judicial ou administrativa válida;
(c) **Serviços de emergência** (CVV, SAMU) quando o protocolo de crise for acionado, **exclusivamente com seu consentimento prévio explícito ou em situação de risco à vida** (Art. 11, II "f" LGPD).

Detalhamento das operadoras na Seção 7.

---

## 7. Transferência Internacional

A Anipis transfere dados a operadoras estrangeiras sob **Cláusulas-Padrão Contratuais (SCC) da Resolução CD/ANPD nº 19/2024 — Módulo 2**, celebradas em instrumentos contratuais separados.

**Operadoras estrangeiras (atualizado em 19/Mai/2026):**

| Operadora | Jurisdição | Finalidade | Status Closed Beta |
|---|---|---|---|
| Supabase | EUA (AWS us-east-1) | Banco de dados primário | ATIVA |
| OpenAI | EUA (Azure) | Modelo LLM principal + embeddings | ATIVA (com ZRT enterprise) |
| Sentry | EUA | Monitoramento de erros | ATIVA |
| Langfuse | UE (Frankfurt) | Observabilidade interna | ATIVA |
| Upstash Redis | EUA (AWS us-east-1) | Cache e rate-limiting | ATIVA |
| Anthropic | EUA | Modelo LLM fallback | **NÃO ATIVA** (reavaliação 25/Mai/2026) |

Você consente à transferência internacional de seus dados pessoais sensíveis de forma específica e destacada durante o onboarding, em prompt separado dos demais consentimentos (Art. 33, IV LGPD). Pode revogar a qualquer momento em Configurações » Privacidade. **Sua recusa não te exclui da Plataforma — você passa a usar Anipis em modo limitado (mood, diário, exercícios, sem chat IA)**, conforme Art. 6º IX LGPD (não-discriminação).

Detalhamento completo em [/transferencia-internacional](https://anipis.com.br/transferencia-internacional).

---

## 8. Retenção e Exclusão

Mantemos seus dados pessoais enquanto sua conta estiver ativa, acrescido de:

(a) **30 dias** para processamento de pedido de exclusão;
(b) **Backups Point-in-Time Recovery (PITR)** com janela de 7 dias;
(c) **Hard delete** em até 30 dias após pedido de exclusão de conta.

### Exceção: dados de crise (`crisis_events`)

Os registros de crise recebem tratamento específico após pedido de exclusão de conta:

(a) **Pseudonimização imediata e irreversível** do `user_id` para tombstone;
(b) **Preservação de hash chain do `audit_events` por 5 anos** para defesa em demanda judicial (Art. 7º §3º CPC + Art. 16, II LGPD);
(c) **Acesso restrito** ao Encarregado e a auditor externo eventualmente designado pela ANPD.

A pseudonimização irreversível, conforme entendimento doutrinário ANPD em formação, cumpre o direito de eliminação previsto no Art. 18, VI LGPD para dados originalmente coletados sob base legal do Art. 11, II "f".

---

## 9. Direitos do Titular

Você pode exercer, a qualquer tempo, os direitos previstos no Art. 18 da LGPD:

(I) **Confirmação** da existência de tratamento;
(II) **Acesso** aos dados em formato estruturado e legível por máquina;
(III) **Correção** de dados incompletos, inexatos ou desatualizados;
(IV) **Anonimização, bloqueio ou eliminação** de dados desnecessários, excessivos ou tratados em desconformidade;
(V) **Portabilidade** — disponibilização de cópia completa em formato JSON estruturado, mediante solicitação ao Encarregado (na fase de Closed Beta, em até 15 dias por processo manual; pós-Beta, endpoint self-service `GET /me/export`);
(VI) **Eliminação dos dados tratados com consentimento** — fluxo automatizado de exclusão de conta, com exceção específica de pseudonimização de crisis_events (ver Seção 8);
(VII) **Informação sobre compartilhamento** com terceiros — disponível neste documento e em /transferencia-internacional;
(VIII) **Informação sobre as consequências de não fornecer consentimento**;
(IX) **Revogação do consentimento** — atendida imediatamente, com efeitos prospectivos;
(X) **Oposição** a tratamento realizado em desconformidade com a LGPD.

**Canal preferencial:** `privacidade@anipis.com.br` + formulário in-app dedicado em Configurações » Privacidade.
**Prazo de atendimento:** 15 dias, prorrogáveis por 15 dias adicionais mediante justificativa.

---

## 10. Segurança dos Dados

Adotamos medidas técnicas e organizacionais alinhadas a padrões internacionais:

(a) **Criptografia AES-256** em repouso e **TLS 1.2+** em trânsito;
(b) **Filtragem estruturada de PII** antes de transmissão a operadoras de IA, validada por CI gate de regressão (15 testes static-analysis);
(c) **Row Level Security (RLS)** ativa em todas as tabelas de dados pessoais;
(d) **Autenticação multifator (2FA)** obrigatória em contas administrativas;
(e) **Rate-limiting** e mecanismos anti-abuso (Upstash Redis + per-route limits);
(f) **Isolamento de sessões** por session token;
(g) **Logging auditável** de acessos e operações, com hash chain de `audit_events` preservada por 5 anos;
(h) **Consentimento (Art. 33, VIII), Termos de API da OpenAI e pseudonimização** (vendor LLM ativo): dados enviados via API **não são utilizados para treinamento** e são retidos por até 30 dias apenas para monitoramento de abuso, com posterior eliminação. No Closed Beta opera-se sem Zero Data Retention (ZDR) e sem DPA formal; ambos no roadmap pós-CNPJ;
(i) **Pseudonimização irreversível** de marcadores de crise pós-exclusão de conta;
(j) **Plano de Resposta a Incidentes** com prazo de notificação à ANPD em até 3 dias úteis (Res. 15/2024) e notificação contratual de operadoras em até 24h para dados sensíveis (Cláusula 10.3 SCC).

---

## 11. Incidentes de Segurança

Em caso de incidente de segurança que envolva risco ou dano relevante aos titulares:

(a) Notificaremos a **ANPD em até 3 dias úteis** (prazo do Art. 48 LGPD + Resolução ANPD nº 15/2024);
(b) Notificaremos **diretamente os titulares afetados** em prazo razoável, conforme a gravidade;
(c) Adotaremos medidas de mitigação e remediação técnica imediatas;
(d) Documentaremos a ocorrência para incorporação no próximo ciclo de revisão do RIPD/DPIA.

Você pode reportar suspeita de incidente em `security@anipis.com.br`.

---

## 12. Cookies

A Anipis utiliza cookies estritamente necessários (sessão, autenticação, preferências) e cookies analíticos primários (sem fingerprinting ou tracking publicitário comportamental). Detalhamento e gestão em Configurações » Cookies.

---

## 13. Menores de 18 Anos

A Anipis **não aceita cadastros de menores de 18 anos**, conforme detalhado em §3.3. O tratamento de dados pessoais de crianças e adolescentes em saúde mental envolve regime regulatório próprio (Art. 14 LGPD + Estatuto da Criança e do Adolescente + Resolução CONANDA aplicável), que não está incorporado a esta Política. Caso identifique cadastro de menor, comunique imediatamente em `privacidade@anipis.com.br` para bloqueio e remediação.

---

## 14. Decisão Automatizada

A IA do Anipis processa suas mensagens e gera respostas automaticamente, sem revisão humana prévia. Você tem direito a:

(a) Solicitar **explicação** sobre como uma resposta foi gerada (Art. 20 LGPD);
(b) Solicitar **revisão humana** de decisões automatizadas que afetem seus interesses;
(c) **Recusar consentimento à transferência internacional** (que habilita as funcionalidades de IA) e continuar usando Anipis em modo limitado.

O Anipis **não realiza decisões automatizadas com efeitos jurídicos** ou impactos significativos comparáveis (e.g., score de crédito, decisões de elegibilidade médica), apenas geração de conteúdo conversacional.

---

## 15. Alterações desta Política

Revisaremos esta Política:

(a) **Anualmente**, em 30 de maio (aniversário do Closed Beta);
(b) **Sempre que houver alteração material** no modelo de negócio, na arquitetura técnica ou no rol de operadoras;
(c) **Em resposta a determinação da ANPD**;
(d) **Após incidente de segurança relevante**;
(e) **Diante de alterações legais/regulamentares** (incluindo Resolução CFM nº 2.454/2026 prevista para agosto/2026).

Mudanças materiais serão notificadas por e-mail com **antecedência mínima de 15 dias**, e o uso continuado da plataforma constitui aceite tácito; mudanças que afetem o consentimento exigirão renovação afirmativa.

---

## 16. Lei Aplicável e Foro

Esta Política e o tratamento de dados pessoais regem-se pela legislação brasileira (LGPD, Marco Civil da Internet, Resoluções ANPD). Fica eleito o foro da Comarca de **[Capital do Estado da sede]** para dirimir eventuais controvérsias, sem prejuízo do foro do consumidor em ações fundadas em relação de consumo.

---

## 17. Contato

| Canal | Endereço |
|---|---|
| Atendimento ao titular | privacidade@anipis.com.br |
| Encarregado pelo Tratamento (DPO) | dpo@anipis.com.br |
| Incidentes de segurança | security@anipis.com.br |
| Formulário in-app | Configurações » Privacidade » Falar com o DPO |
| Autoridade Nacional de Proteção de Dados (ANPD) | https://www.gov.br/anpd |

---

**Documento elaborado em maio de 2026, sujeito a revisão e aprofundamento por parecer jurídico formal a ser emitido por advogada especializada regularmente inscrita na Ordem dos Advogados do Brasil.**

---

## Histórico de versões

| Versão | Data | Notas |
|---|---|---|
| 1.0 | 26/Mar/2026 | Versão placeholder inicial publicada para Sprint 0 |
| 2.0 | 19/Mai/2026 | Reescrita completa pós DPIA v2 + SCC v2. Atualização operadoras (Anthropic deferida, Upstash migrando), Resolução CFM 2.454/2026 mencionada, processo manual portabilidade documentado, hash chain audit_events 5y, vedação operacional menores. **Pendente:** preenchimento Tabela §2 (CNPJ, DPO, endereço, emails) + revisão Patricia Peck |
