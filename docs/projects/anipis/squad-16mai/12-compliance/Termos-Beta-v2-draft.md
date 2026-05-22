# Termos de Uso — Programa Closed Beta Anipis

**Versão 2.0 (draft) — 19 de maio de 2026**
**Status:** ⚠️ Rascunho para revisão Patricia Peck Advocacia · não publicar antes de sign-off
**Cross-doc:** alinhado a `Privacy-Policy-v2-draft.md` + `anipis-RIPD-DPIA-v2.md`

---

## 1. Aceitação dos Termos

Estes Termos de Uso (doravante **"Termos"**) regem sua participação no **Programa Closed Beta** da plataforma **Anipis** (companheira emocional digital baseada em inteligência artificial), oferecido por **Anipis [Razão Social a definir]** (doravante **"Anipis"** ou **"Controladora"**), inscrita no CNPJ [a ser informado].

Ao criar uma conta e aceitar estes Termos durante o onboarding, **você (doravante "Participante")** declara ter lido, compreendido e concordado integralmente com seu conteúdo. Caso não concorde, **não prossiga com o cadastro**.

Estes Termos aplicam-se exclusivamente ao **Programa Closed Beta**, com início em **30 de maio de 2026** e duração inicial de **14 (catorze) dias**. Após o encerramento do Beta, novos Termos serão apresentados para a fase pública da plataforma.

---

## 2. Descrição do Serviço

### 2.1. O que é o Anipis

O Anipis é uma plataforma digital de **companhia emocional baseada em inteligência artificial generativa**, voltada a apoiar pessoas adultas em momentos de sofrimento psicológico cotidiano, ansiedade, solidão, autorreflexão e bem-estar mental, utilizando técnicas reconhecidas de:

- Terapia Cognitivo-Comportamental (TCC);
- Terapia de Aceitação e Compromisso (ACT);
- Terapia Dialética Comportamental (DBT);
- Mindfulness e práticas correlatas de regulação emocional.

### 2.2. O que o Anipis NÃO é

**Esta seção é a mais importante destes Termos. Por favor, leia com atenção:**

(a) O Anipis **NÃO é um serviço médico, psicológico ou psiquiátrico**. Não substitui consulta com profissional de saúde habilitado.

(b) O Anipis **NÃO realiza diagnóstico, prescrição, sessão de terapia, avaliação clínica ou qualquer outro ato privativo de médicos, psicólogos ou demais profissionais da saúde regulamentados pelos respectivos conselhos** (Conselho Federal de Medicina — CFM, Conselho Federal de Psicologia — CFP).

(c) O Anipis **NÃO é serviço de emergência**. Em situação de crise grave, ideação suicida aguda, risco iminente à vida ou autolesão, **procure imediatamente atendimento especializado**:

- **CVV (Centro de Valorização da Vida): 188** — 24h, gratuito
- **SAMU (Serviço de Atendimento Móvel de Urgência): 192**
- **Hospital ou UPA mais próxima**

(d) O Anipis **utiliza inteligência artificial generativa**, que pode produzir respostas factualmente incorretas, inadequadas ou contextualmente inapropriadas (fenômeno conhecido como "alucinação"). Você deve avaliar criticamente o conteúdo gerado e **nunca tomar decisões médicas, jurídicas, financeiras ou de saúde com base exclusiva nele**.

---

## 3. Elegibilidade e Cadastro

### 3.1. Idade mínima — 18 anos

A participação no Programa Closed Beta é restrita a pessoas naturais **maiores de 18 anos** completos. A Anipis bloqueia programaticamente cadastros de menores via verificação de data de nascimento no onboarding.

Caso você declare idade inferior a 18 anos, o cadastro será automaticamente recusado e seus dados serão imediatamente descartados (mantendo apenas timestamp + IP em hash para fins de auditoria, sem outras informações pessoais).

### 3.2. Convite

O Programa Closed Beta opera por convite. Você foi convidado(a) diretamente pela Controladora, com base em pré-seleção da rede pessoal/profissional do founder. **Não é possível cadastrar-se sem convite válido** durante esta fase.

### 3.3. Veracidade

Você se compromete a fornecer informações verdadeiras e atualizadas, e a manter seu cadastro atualizado, especialmente em caso de mudança de contato emergencial.

### 3.4. Conta individual e intransferível

Sua conta é **individual e intransferível**. O compartilhamento de credenciais com terceiros viola estes Termos e pode resultar em suspensão imediata.

---

## 4. Uso Adequado

### 4.1. Você concorda em NÃO:

(a) Utilizar a plataforma para finalidades ilícitas, fraudulentas ou que violem direitos de terceiros;
(b) Tentar contornar mecanismos de segurança, autenticação ou rate-limiting;
(c) Realizar engenharia reversa, descompilação ou tentativa de extração do prompt do sistema da IA (prompt injection / jailbreak);
(d) Carregar conteúdo que viole direitos autorais, marca registrada ou direitos da personalidade de terceiros;
(e) Utilizar a plataforma para assediar, ameaçar, difamar ou prejudicar terceiros;
(f) Compartilhar conteúdo gerado pela IA em contextos que possam induzir terceiros à erro sobre a natureza médica/psicológica do serviço;
(g) Tentar acionar o protocolo de alerta de contato de emergência sem necessidade real (a Anipis aplica per-event dedup 7d e per-user daily cap 3/24h como anti-abuso, mas comportamento abusivo pode resultar em suspensão).

### 4.2. Conteúdo gerado pela IA

O conteúdo gerado pela IA é fornecido "como está" (`as is`), sem garantia de exatidão, completude, atualidade ou adequação a finalidade específica. A Anipis monitora continuamente a qualidade das respostas via Langfuse e adota filtros de saída (output moderation), mas **a responsabilidade final pelo uso do conteúdo é sua**.

---

## 5. Protocolo de Detecção de Crise

### 5.1. Como funciona

A Anipis utiliza classificadores automatizados dedicados à detecção de marcadores de crise (ideação suicida, autolesão, episódios agudos). Quando detectados:

(a) **Encaminhamento informativo persistente** — exibimos banner + mensagem inline da IA com os números do CVV (188) e SAMU (192);
(b) **Registro auditável** em hash chain de `audit_events`, preservado por 5 anos para defesa em demanda judicial;
(c) **Acionamento opcional do contato de emergência** que você cadastrou — somente mediante confirmação sua na interface, exceto em situação de risco imediato à vida (Art. 11, II "f" LGPD).

### 5.2. Limitações do protocolo

Você reconhece e aceita que:

(a) O classificador automatizado pode produzir **falsos negativos** (não detectar uma crise real) ou **falsos positivos** (acionar protocolo em mensagem sem risco real);
(b) A Anipis prioriza **alta sensibilidade** do classificador (falso positivo é preferível a falso negativo em saúde mental);
(c) O protocolo **não substitui** procura ativa por atendimento profissional em caso de crise;
(d) Em **situação de emergência real**, ligue 188 ou 192 imediatamente, **mesmo se estiver dentro da conversa com a Anipis**.

---

## 6. Programa Closed Beta — Disposições Específicas

### 6.1. Gratuidade

A participação no Programa Closed Beta é **gratuita**. Não há cobrança, trial, cartão de crédito ou cobrança postergada.

### 6.2. Sem garantia de continuidade

A Anipis se reserva o direito de:

(a) Encerrar o Programa Closed Beta antes do prazo previsto, mediante aviso com antecedência mínima de 48h;
(b) Modificar funcionalidades, interface ou disponibilidade durante o Beta;
(c) **Não migrar automaticamente** Participantes do Beta para a versão paga; você poderá optar livremente pela continuidade após o encerramento.

### 6.3. Feedback voluntário

A Anipis poderá convidar você para uma conversa de aproximadamente 20 minutos ao final do Beta para coletar feedback. A participação é **voluntária**; sua recusa não afeta seu acesso à plataforma durante o Beta nem qualquer relacionamento futuro com a Anipis.

### 6.4. Confidencialidade durante o Beta

Durante o Programa Closed Beta, pedimos (sem caráter contratual de NDA) que você evite divulgar capturas de tela, prints de conversa ou descrições detalhadas das funcionalidades em redes sociais públicas. Nossa intenção é processar feedback consolidado antes da abertura pública.

---

## 7. Privacidade e Proteção de Dados

O tratamento de seus dados pessoais é regido pela [Política de Privacidade](https://anipis.com.br/privacidade), que faz parte integrante destes Termos.

**Em síntese:**

(a) Tratamos dados pessoais comuns e sensíveis necessários ao funcionamento do serviço;
(b) Utilizamos operadoras tecnológicas brasileiras e estrangeiras sob Cláusulas-Padrão Contratuais ANPD;
(c) Você consente especificamente à transferência internacional em prompt destacado durante o onboarding;
(d) Você pode revogar consentimentos e exercer direitos do Art. 18 LGPD a qualquer momento em Configurações » Privacidade ou via `privacidade@anipis.com.br`.

---

## 8. Propriedade Intelectual

(a) A marca **Anipis**, o software, o design da interface, o sistema de classificação de crise, o system prompt da IA, a documentação e todo conteúdo originado pela Anipis são de propriedade exclusiva da Controladora.
(b) **Suas mensagens** (conteúdo conversacional gerado por você) permanecem de sua propriedade. A Anipis recebe licença não-exclusiva para processá-las exclusivamente para a prestação do serviço, sem direito de uso para treinamento de modelos próprios ou de terceiros.
(c) **Respostas geradas pela IA** podem ser livremente utilizadas por você para fins pessoais.

---

## 9. Limitação de Responsabilidade

### 9.1. Saúde e bem-estar

A Anipis **não se responsabiliza por decisões de saúde mental ou física** tomadas por você com base em conversas com a plataforma, especialmente diante das limitações inerentes a IA generativa (Seção 2.2).

### 9.2. Disponibilidade

A Anipis empregará esforços razoáveis para manter o serviço disponível, mas **não garante disponibilidade ininterrupta**. Manutenções programadas serão comunicadas com antecedência sempre que possível.

### 9.3. Incidentes em operadoras terceiras

Em caso de incidente de segurança em operadora terceira (Supabase, OpenAI, Sentry, Upstash, Langfuse), a Anipis acionará imediatamente o plano de resposta a incidentes e notificará a ANPD e os Participantes afetados conforme Art. 48 LGPD. A responsabilidade solidária regula-se pelo Art. 42 LGPD.

### 9.4. Conduta de terceiros

A Anipis não se responsabiliza por conduta de terceiros que eventualmente obtenham acesso indevido à sua conta por compartilhamento de credenciais, ou por ações de autoridades governamentais estrangeiras nos termos da Cláusula 12 das SCC.

---

## 10. Suspensão e Encerramento

### 10.1. Por você

Você pode encerrar sua conta a qualquer momento em Configurações » Conta » Excluir conta, sem necessidade de justificativa. O efeito é imediato (Art. 18 VI LGPD), com hard delete em até 30 dias e exceção específica para registros de crise (pseudonimização irreversível + audit_events 5y — ver Política de Privacidade Seção 8).

### 10.2. Pela Anipis

A Anipis pode suspender ou encerrar sua conta, com aviso prévio razoável (salvo em casos de violação grave que justifiquem ação imediata), nas hipóteses de:

(a) Violação destes Termos ou da Política de Privacidade;
(b) Conduta abusiva, fraudulenta ou que coloque em risco outros Participantes ou a integridade do serviço;
(c) Necessidade de cumprimento de obrigação legal ou ordem judicial;
(d) Encerramento do Programa Closed Beta (Seção 6.2).

---

## 11. Modificações dos Termos

Estes Termos podem ser modificados mediante:

(a) **Aviso prévio mínimo de 15 dias** por e-mail para mudanças materiais;
(b) **Renovação de aceite afirmativo** quando a mudança afetar o consentimento (especialmente Art. 11 LGPD para dados sensíveis);
(c) Uso continuado da plataforma após o prazo de notificação implica aceite tácito das mudanças não-materiais.

---

## 12. Disposições Gerais

### 12.1. Comunicações

Comunicações da Anipis serão enviadas para o e-mail cadastrado. Você é responsável por mantê-lo atualizado.

### 12.2. Foro

Fica eleito o foro da Comarca de **[Capital do Estado da sede da Anipis]** para dirimir eventuais controvérsias decorrentes destes Termos, sem prejuízo do foro do consumidor em ações fundadas em relação de consumo (Art. 101, I CDC).

### 12.3. Independência das cláusulas

Se qualquer disposição destes Termos for considerada inválida, ilegal ou inexequível, as demais permanecerão em pleno vigor.

### 12.4. Lei aplicável

Estes Termos regem-se exclusivamente pela legislação brasileira (Lei nº 13.709/2018 — LGPD, Lei nº 12.965/2014 — Marco Civil da Internet, Lei nº 10.406/2002 — Código Civil, Lei nº 8.078/1990 — Código de Defesa do Consumidor, Resoluções ANPD aplicáveis e Resoluções CFM nº 2.314/2022 e nº 2.454/2026).

---

## 13. Canal de Atendimento

| Assunto | Canal |
|---|---|
| Dúvidas e suporte | suporte@anipis.com.br |
| Privacidade e LGPD | privacidade@anipis.com.br |
| Encarregado (DPO) | dpo@anipis.com.br |
| Incidentes de segurança | security@anipis.com.br |
| Emergência (NÃO é a Anipis) | CVV 188 / SAMU 192 |

---

## 14. Glossário

| Termo | Definição |
|---|---|
| Anipis | A plataforma e a pessoa jurídica que a opera (Controladora) |
| Participante | Pessoa natural maior de 18 anos cadastrada no Programa Closed Beta |
| Closed Beta | Fase fechada do programa, 30/Mai/2026 a 13/Jun/2026 |
| IA generativa | Modelos de linguagem de grande porte (LLM) utilizados pela Anipis |
| Protocolo de crise | Mecanismo automatizado de detecção e encaminhamento informativo |
| LGPD | Lei nº 13.709/2018 — Lei Geral de Proteção de Dados |
| ANPD | Autoridade Nacional de Proteção de Dados |
| SCC | Cláusulas-Padrão Contratuais (Resolução CD/ANPD nº 19/2024) |
| ZDR/ZRT | Zero Data Retention — modalidade contratual de operadora de IA |
| Hash chain | Cadeia criptográfica de eventos de auditoria, imutável |

---

**Estes Termos foram elaborados em maio de 2026 e estão sujeitos a revisão e aprofundamento por parecer jurídico formal a ser emitido por advogada especializada regularmente inscrita na Ordem dos Advogados do Brasil.**

---

## Histórico de versões

| Versão | Data | Notas |
|---|---|---|
| 1.0 | 26/Mar/2026 | Versão placeholder inicial publicada para Sprint 0 |
| 2.0 | 19/Mai/2026 | Reescrita completa pós DPIA v2 + SCC v2. Disposições específicas Closed Beta (Seção 6), protocolo de crise alinhado com R6 caminho A do DPIA, Resolução CFM 2.454/2026 mencionada, anti-abuso crisis-alert mencionado, vedação operacional menores. **Pendente:** preenchimento §1 (CNPJ + Razão Social + endereço) + §12.2 (foro) + revisão Patricia Peck |
