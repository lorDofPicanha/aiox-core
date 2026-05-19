# Licitação Process Deep Dive — Habilitação Documental e Análise de Concorrentes

**Agente:** @analyst (Atlas)
**Data:** 2026-05-18
**Escopo geográfico:** Águas Lindas-GO + Distrito Federal (DF) + Federal-com-execução-DF
**Quadro normativo:** Lei 14.133/2021 (regime principal), Decreto 12.807/2025 (atualização de valores 2026)
**Foco operacional:** fornecedor pequeno-médio (4 empresas do cliente, 5-30 certames/mês)

---

## Executive Summary — 10 Achados Mais Úteis para Decisão de Produto

1. **PNCP é o eixo único de transparência por força de lei.** Lei 14.133/2021 art. 174 obriga publicação do **edital + anexos completos + documentos de habilitação do vencedor** no PNCP. Acesso público sem autenticação, API REST documentada. Isso simultaneamente legitima o produto (todo dado-fonte é público) e cria o moat técnico (PDF parsing dos anexos).

2. **A conferência de concorrentes só vira possível DEPOIS da fase de lances.** No pregão eletrônico (modalidade dominante), licitantes são anônimos até o pregoeiro declarar vencedor. Somente quando o **provisoriamente vencedor** envia seus documentos é que tudo fica publicamente visível. **>>> DECISION POINT:** o produto precisa monitorar o status de cada certame e disparar análise documental **apenas no momento "documentos disponíveis"** — não scraping cego de todos editais.

3. **A janela de impugnação concorrente é apertadíssima:** manifestação de intenção de recurso deve ser registrada **imediatamente** no sistema quando o pregoeiro anuncia o resultado (perda do direito por preclusão se atrasar segundos), e razões em **3 dias úteis** (art. 165 Lei 14.133). Isso significa que o produto precisa de **modo "análise rápida em <30 minutos"** assim que docs do concorrente são publicados — não tem como o cliente revisar manualmente em tempo.

4. **SICAF substitui ~70% dos documentos rotineiros, mas NÃO substitui qualificação técnica nem atestados.** Os 6 níveis (Credenciamento, Hab. Jurídica, Reg. Fiscal Federal, Reg. Fiscal Estadual/Municipal, Qualif. Técnica e Qualif. Econômico-Financeira) cobrem CND federal, FGTS, CNDT, balanço patrimonial. **A dor real está em (i) atestado de capacidade técnica — sempre por edital, sempre customizado — e (ii) certidões estaduais/municipais quando SICAF V não está atualizado.**

5. **Decreto 12.807/2025 zerou o limite de dispensa para R$ 65.492,11 (bens/serviços) e R$ 130.984,20 (obras/eng.) em 2026.** Dispensa eletrônica usa rito simplificado mas ainda exige docs de habilitação — abrindo oportunidade de produto "kit habilitação leve" para volume alto + baixo ticket (caso típico de prefeituras pequenas como Águas Lindas).

6. **Concorrentes brasileiros (Effecti, Conlicitação/LicitaNet, BNC, Siga Pregão, LicitaGov) já têm "gestão de habilitação" + IA leitora de edital mas tratam isso como feature, não core.** A oportunidade de diferenciação está em (a) **conferência de docs dos concorrentes** (ninguém faz isso bem, todos focam só no próprio dossiê) e (b) **automação regional ultra-nichada** (DF+AL) com integrações estaduais/municipais que ninguém prioriza.

7. **Validade das certidões é assimétrica e cria carga de manutenção pesada:** CRF FGTS = **30 dias** (o gargalo); CND Estadual/Municipal = 30-90 dias variável por estado; CND Federal e CNDT = **180 dias**. Um fornecedor com 5-30 certames/mês precisa renovar CRF a cada 30 dias e checar antes de cada certame. Esse é o KPI de produto: "0 inabilitações por vencimento de certidão".

8. **Os 4 motivos mais comuns de inabilitação (TCU, jurisprudência consolidada) são:** (i) atestado técnico insuficiente ou não-equivalente, (ii) débitos fiscais/CND vencida, (iii) índices contábeis não atendidos, (iv) defeitos formais em habilitação jurídica. **Os três primeiros são automatizáveis com alta confiança; o quarto exige LLM + revisão humana.**

9. **TCU consolidou jurisprudência de "formalismo moderado" + dever de diligência do pregoeiro** (Acórdão 1.211/2021 e correlatos): falhas sanáveis NÃO devem inabilitar. Isso muda a estratégia de impugnação — não basta apontar erro formal; precisa demonstrar que **a substância** do documento está comprometida. **>>> DECISION POINT:** o produto não pode apenas listar "erros" — precisa classificar **sanável vs insanável** e dar evidência argumentativa.

10. **Águas Lindas-GO usa Portal de Compras Públicas (PCP, da provedora Portal Compras Públicas Ltda.) e publica também no PNCP.** DF usa portal próprio (portal.compras.df.gov.br) e migrou progressivamente para PNCP. **A combinação operacional do cliente:** ~10-30 oportunidades/mês em AL (prefeitura + câmara), ~300-500 em DF (todas secretarias + autarquias). Total realista: 50-150 oportunidades qualificáveis/mês para CNAEs específicos.

---

## A. HABILITAÇÃO DOCUMENTAL

### A.1 Princípio Estruturante: Taxatividade (art. 68 Lei 14.133)

A Lei 14.133/2021 estabelece **rol taxativo** de documentos exigíveis (arts. 62-69). A Administração **não pode criar** novas categorias — apenas escolher dentro do rol legal o que é pertinente ao objeto. Quatro categorias:

| Categoria | Artigo | Cobre |
|-----------|--------|-------|
| **Habilitação Jurídica** | art. 66 | Contrato social, CNPJ, ato constitutivo, decreto autorizativo (se aplicável), procuração |
| **Regularidade Fiscal, Social e Trabalhista** | art. 68 (e art. 62 §1º remetendo a CF art. 195 §3º) | CND Federal, CND Estadual, CND Municipal, CRF/FGTS, CNDT, Simples (se aplicável) |
| **Qualificação Econômico-Financeira** | art. 69 | Balanço Patrimonial + DRE dos **2 últimos exercícios sociais**, certidão negativa de falência/recuperação, índices contábeis (LG, LC, SG) **só se justificados no edital** |
| **Qualificação Técnica** | art. 67 | Atestado(s) de Capacidade Técnica (ACT), registros em conselhos profissionais, declarações específicas do objeto |

### A.2 Documentos Rotineiros — SEMPRE iguais vs. MUDAM por Edital

**SEMPRE iguais (rol fixo, atualizável periodicamente):**

| Documento | Emissor | Validade típica | Custo emissão |
|-----------|---------|------------------|----------------|
| Contrato Social consolidado | Junta Comercial | Estável (atualiza só em alteração) | R$ 50-150 |
| Cartão CNPJ | Receita Federal | Sem validade | Grátis online |
| **CND Federal (RFB+PGFN unificada)** | Receita Federal/PGFN | **180 dias** | Grátis |
| **CRF/FGTS** | Caixa Econômica | **30 dias (gargalo)** | Grátis |
| **CNDT (Trabalhista)** | TST | **180 dias** | Grátis |
| **CND Estadual** | Sefaz de cada UF | 30-90 dias (varia por UF) | Grátis na maioria |
| **CND Municipal** | Prefeitura sede | 30-90 dias (varia) | Grátis-R$ 30 |
| Certidão Falência/Recuperação | Tribunal de Justiça | 60-90 dias (regra prática) | R$ 0-50 |
| Balanço Patrimonial + DRE | Contador da empresa | 1 exercício fiscal | Já existe |
| Declaração de Cumprimento ao art. 7º CF (trabalho menor) | Auto-declaração | Por edital | — |
| Declaração de Inexistência de Sanções | Auto-declaração + cruzamento CEIS/CNEP | Por edital | — |

**MUDAM por edital (variabilidade alta):**

| Documento variável | O que muda |
|---------------------|------------|
| **Atestado de Capacidade Técnica (ACT)** | Volume mínimo, prazo de execução exigido (≤3 anos no caso de serviços contínuos), similaridade do objeto, quantidade de ACTs (1-3), exigência de averbação no CREA/CRA quando aplicável |
| Registro profissional | Apenas se objeto for regulamentado (CREA, CRC, CRM, CRA, CRF, OAB etc.) |
| Vistoria técnica / declaração de não-vistoria | Pertinência ao objeto (obras + algumas TIs) |
| Garantia da proposta (≤1% do valor estimado, art. 58) | Se edital exigir; modalidade (caução em dinheiro, fiança bancária, seguro garantia) |
| Declarações específicas (acessibilidade, ESG, MEI, ME/EPP) | Conforme objeto |
| Anexos técnicos (catálogos, fichas, ISO, INMETRO, ANVISA, MAPA, INPI) | Depende do produto |

**>>> DECISION POINT:** A automação do dossiê tem dois layers de complexidade. Layer 1 (estável) é checklist com vencimento — fácil. Layer 2 (variável) é **extrair do PDF do edital** as exigências específicas e **mapear contra o portfólio do cliente** (banco de ACTs disponíveis, declarações modelo). Layer 2 é o moat real e exige LLM + base curada.

### A.3 Atestado de Capacidade Técnica — Anatomia

Art. 67 Lei 14.133/2021: **"O exame da qualificação técnica far-se-á pela apresentação de... atestados ou declarações de capacidade técnica, emitidos por pessoas jurídicas de direito público ou privado..."**

**Quem emite:** órgão público ou empresa privada **a quem o licitante já prestou serviço/forneceu produto similar**. Não há modelo oficial padronizado, mas há campos obrigatórios consagrados:

- Razão social + CNPJ do emissor
- Razão social + CNPJ do beneficiário (o licitante)
- Descrição detalhada do objeto fornecido/serviço prestado (precisa permitir similaridade)
- Quantitativos (volume, valor, prazo de execução)
- Período de execução
- Avaliação qualitativa (boa, satisfatória, sem ressalvas, etc.) — não obrigatório, mas comum
- Assinatura do representante legal do emissor + carimbo
- Em alguns casos: número do contrato/nota fiscal de referência (rastreabilidade)

**Validade:** O atestado em si **não vence**. Mas o edital pode exigir que o objeto atestado tenha sido executado **nos últimos 3 anos** (art. 67 §2º para serviços contínuos). Em obras, jurisprudência TCU admite execução em períodos sucessivos somáveis.

**Critérios de aceitação (TCU consolidado):**
- **Similaridade e pertinência** ao objeto licitado (não precisa ser idêntico, precisa ser equivalente)
- Quantitativos compatíveis (TCU veda exigência > 50% do quantitativo licitado como regra)
- Emissor verificável (pregoeiro pode contatar para validação)

**Auto-atestado:** TCU rejeita auto-atestados em regra (Acórdão 1.234/2024-Plenário) — atestado precisa ser emitido por terceiro. Há exceções estreitas (e.g. atestados internos com lastro contratual demonstrável).

**>>> DECISION POINT:** O moat de produto está em **"biblioteca de ACTs do cliente"** + **"matcher de similaridade"** com o objeto do edital. Casos de uso:
- Cliente tem ACT da empresa A (forneceu cadeiras hospitalares R$ 200k) → edital pede ACT "mobiliário hospitalar R$ 150k+"
- Sistema precisa scoring de similaridade: CNAE proximity, palavras-chave do objeto, quantidade ≥ exigida, prazo ≥ exigido, dentro da janela de 3 anos
- Output: "ACT da empresa A é APTO (8.5/10)" ou "ACT da empresa B é INSUFICIENTE (4/10) — quantidade abaixo de 50%"

### A.4 SICAF — Sistema de Cadastramento Unificado de Fornecedores

**6 níveis cumulativos:**

| Nível | Conteúdo | Substitui na habilitação |
|-------|----------|---------------------------|
| **I — Credenciamento** | Cadastro básico de acesso ao Compras.gov.br | Nenhum doc — só dá acesso ao sistema |
| **II — Habilitação Jurídica** | Atos constitutivos, QSA, sócios, procurações | Habilitação jurídica art. 66 (em parte) |
| **III — Regularidade Fiscal/Trabalhista Federal** | CND Federal RFB/PGFN, CRF FGTS, CNDT | Esses 3 documentos |
| **IV — Regularidade Fiscal Estadual/Municipal** | CND Estadual + CND Municipal da sede | Esses 2 (se SICAF atualizado) |
| **V — Qualificação Técnica** | Registro em conselhos (CREA, CRC etc.) + linhas de fornecimento | Registro profissional + linhas (mas NÃO ACT — atestado continua exigível por edital) |
| **VI — Qualificação Econômico-Financeira** | Balanço, DRE, índices contábeis | Esses documentos (se SICAF atualizado) |

**O que o SICAF NÃO substitui:**
- **Atestado de Capacidade Técnica** (sempre por edital)
- Documentos não-fiscais específicos (registros ANVISA, MAPA, INPI, INMETRO, ESG, acessibilidade)
- Declarações específicas exigidas pelo edital
- Garantia de proposta
- Certidão de falência (TJ — não está no SICAF)
- CND Estadual/Municipal de **outras unidades** que não a sede (se o objeto exigir, ex. empresa de SP licitando em PE pode precisar CND-PE)

**Cadência de manutenção:** o SICAF "renova" automaticamente quando o fornecedor reemite certidões e as anexa. Na prática: **rotina mensal obrigatória** para manter níveis III-IV-VI atualizados, ou o pregoeiro vai pedir doc por fora.

**Risco real:** Conjur (2025) alertou que **publicidade das informações do SICAF na fase de habilitação** é ponto frágil — pregoeiros frequentemente consultam SICAF sem dar acesso público, gerando recursos de transparência.

### A.5 Cadências de Renovação — Calendário do Fornecedor

| Documento | Frequência mínima ideal | Custo de não-renovar |
|-----------|--------------------------|------------------------|
| CRF FGTS | **30 dias** | Inabilitação automática se vencer |
| CND Estadual | 30 dias (segurança) | Inabilitação |
| CND Municipal | 30-60 dias | Inabilitação |
| CND Federal (RFB+PGFN) | 90-120 dias (180 max) | Inabilitação |
| CNDT | 90-120 dias | Inabilitação |
| Certidão Falência | A cada 60 dias | Inabilitação |
| SICAF (atualização) | Mensal | Pregoeiro pede docs paralelos |
| Balanço (1 vez/ano) | Janeiro-Abril (após fechamento) | Inabilitação no exercício seguinte |
| Registro CREA/CRC anuidade | Anual | Inabilitação técnica |

**Carga operacional para fornecedor com 4 empresas:** 4 × 7 documentos críticos × renovação mensal = **~28 ações de renovação/mês mínimo** + verificações em janelas de 24-72h antes de cada certame. **Esse é o trabalho repetitivo que mata o pequeno fornecedor.**

---

## B. CONFERÊNCIA DE CONCORRENTES (Fase de Habilitação)

### B.1 Cronologia Exata: Quando os Docs Ficam Visíveis

No pregão eletrônico (modalidade que cobre ~85% dos certames no PNCP):

```
1. Publicação do edital (D-10 a D-3 dias úteis no PNCP + portal de origem)
2. Sessão pública abre → Lances (anônimo, licitantes identificados só por código)
3. Pregoeiro encerra lances → declara provisoriamente vencedor
4. Vencedor envia documentos de habilitação (via portal de operação: Compras.gov.br, BNC, Licitar Digital, PCP, e-Compras DF, Licitações-e)
5. Pregoeiro analisa documentos (prazo variável, em geral 1-3 dias úteis)
6. Pregoeiro declara HABILITADO ou INABILITADO
7. **Neste momento os documentos ficam visíveis publicamente para todos os participantes**
8. Pregoeiro pergunta "alguma intenção de recurso?" → janela de minutos
9. Quem manifestou intenção: 3 dias úteis para razões → 3 dias úteis para contrarrazões
10. Decisão do recurso → Adjudicação + Homologação → Publicação no PNCP + DOU/DODF (até 48h)
```

**Onde estão os documentos publicados:**

| Portal de operação | Onde docs ficam visíveis |
|---------------------|----------------------------|
| Compras.gov.br (federal) | Aba "Materiais/Serviços" do processo após declaração habilitado/inabilitado |
| BNC Compras | Processo público, aba documentos do vencedor |
| Licitar Digital | Detalhes do processo, seção documentos vencedor |
| Portal de Compras Públicas (usado por Águas Lindas) | Detalhe do processo |
| e-Compras DF | Detalhe do processo + DODF para extrato |
| Licitações-e (BB) | Sessão pública, aba documentos |
| **PNCP (agregador)** | Sempre — `/orgaos/{cnpj}/compras/{ano}/{seq}/arquivos` |

**>>> DECISION POINT:** O PNCP **agrega** mas pode atrasar 24-48h vs. portal de operação. Para feature "alerta de habilitação", monitorar AMBOS: portal de operação (em tempo real) + PNCP (oficial/canonical).

### B.2 Janela de Impugnação e Recurso

**Impugnação ao edital (art. 164 Lei 14.133):**
- Qualquer pessoa pode impugnar por irregularidade
- Prazo: **até 3 dias úteis antes** da data de abertura
- Administração responde em até **3 dias úteis** antes da data de abertura
- Não confunde com recurso — impugnação ataca o EDITAL, recurso ataca atos da sessão

**Recurso na sessão (art. 165):**
- Manifestação de intenção: **imediata** no sistema ao final da sessão pública, sob pena de preclusão
- Razões: **3 dias úteis** após manifestação aceita
- Contrarrazões dos outros licitantes: **3 dias úteis** após disponibilização das razões
- Decisão pelo pregoeiro → recurso à autoridade superior → publicação

**Janela operacional realista para análise de docs do concorrente:**

```
Momento "docs visíveis" → manifestação imediata: ~5-30 minutos (janela do pregoeiro)
→ Razões fundamentadas: 72h (3 dias úteis)
```

**Implicação para produto:** o módulo de conferência precisa funcionar em **2 modos**:
1. **Rápido (≤30 min):** triagem automatizada — "tem indício forte?" para fundamentar manifestação imediata
2. **Profundo (≤48h):** análise detalhada para razões — cruzamento CND/CEIS/CNJ/QSA + parsing do balanço + verificação atestados + validação prazo certidões

### B.3 Irregularidades Mais Comuns que Geram Inabilitação Recursável

Catalogadas a partir de Schiefler Advocacia, TCU "Licitações e Contratos" cap. 5.5, jurisprudência consolidada e portal Licijur:

**Categoria 1 — Regularidade Fiscal (mais frequente):**
- Certidão vencida na data da sessão (especialmente CRF/FGTS — vence em 30 dias)
- Divergência entre certidão da matriz vs filial (TCU já decidiu que pode ser exigida só uma OU a outra, depende da execução)
- CND positiva com efeitos de negativa não apresentada com fundamento
- Certidão emitida online sem código de validação que permita conferência
- **Detecção automatizável:** ✅ alta confiança

**Categoria 2 — Qualificação Técnica (alta frequência de contestação):**
- ACT com quantitativo inferior ao mínimo do edital (regra TCU: pode exigir até 50% do quantitativo, alguns editais abusam)
- ACT sem similaridade/pertinência com objeto (CNAE diferente)
- ACT fora da janela temporal (>3 anos para serviços contínuos)
- Auto-atestado disfarçado
- ACT emitido por empresa do mesmo grupo econômico (TCU rejeita)
- Falta registro CREA/CRC/etc. quando objeto exige
- **Detecção automatizável:** ⚠️ média-alta — exige LLM bem treinado em similaridade semântica

**Categoria 3 — Econômico-Financeira:**
- Balanço não publicado/registrado conforme regramento contábil
- Balanço de exercício incompleto (não fechado)
- Índices abaixo do exigido (LG/LC/SG <1 sem capital integralizado compensatório)
- DRE com valores divergentes do balanço
- Falta certidão de falência/recuperação
- **Detecção automatizável:** ✅ alta confiança para índices (cálculo determinístico)

**Categoria 4 — Habilitação Jurídica:**
- Contrato social não consolidado / sem última alteração
- Procuração sem reconhecimento de firma (quando exigido)
- Divergência QSA entre Receita Federal e contrato social apresentado
- Objeto social que não inclui CNAE do certame
- **Detecção automatizável:** ✅ média — requer LLM para análise de objeto social

**Categoria 5 — Vínculos e Conflitos (mais complexa):**
- Empresas do mesmo grupo no mesmo certame (TCU caso a caso — não é proibição automática mas indício de fraude se houver coordenação)
- Sócio comum em CNPJs diferentes participando (mesmo princípio)
- Servidor público com vínculo familiar com sócio (impedimento direto)
- Empresa inscrita no CEIS/CNEP (impedimento absoluto)
- **Detecção automatizável:** ✅ alta para CEIS/CNEP/CNJ (consulta API) / ⚠️ média para QSA cruzado

**Categoria 6 — Defeitos Formais (cuidado: TCU exige formalismo moderado):**
- Falta assinatura em declaração (TCU: SANÁVEL em diligência)
- Documento sem autenticação (TCU: SANÁVEL na maioria dos casos)
- Erro de digitação que não compromete substância (TCU: SANÁVEL)
- **Detecção automatizável:** ⚠️ baixa relevância para impugnação — não dá inabilitação

### B.4 Automações Públicas que Ajudam

| Automação | Endpoint / Acesso | Cobertura | Custo |
|------------|-------------------|-----------|--------|
| **PNCP API Consulta** | `https://pncp.gov.br/api/consulta/v1/` | Editais, atas, contratos, anexos (incluindo docs vencedor pós-2024) | Grátis |
| **Portal da Transparência - Sanções** | `portaldatransparencia.gov.br/sancoes/consulta` | CEIS + CNEP + CEPIM unificado, web + API | Grátis |
| **CNJ - Improbidade Administrativa** | `cnj.jus.br/improbidade_adm/` + via APIs como Infosimples | Cadastro de condenados | Grátis (web) / pago (API agregada) |
| **Receita Federal - Consulta CNPJ** | `servicos.receitafederal.gov.br` + API Serpro Consulta CNPJ | Situação cadastral, QSA, CNAEs | Grátis (web) / pago (API massiva ~R$0,15-0,80/consulta) |
| **API Serpro Consulta CND** | `apicenter.estaleiro.serpro.gov.br/documentacao/consulta-cnd/` | Verifica existência de CND válida no banco RFB | Pago (~R$ 0,30-0,80/consulta) |
| **PGFN - Regularize** | `regularize.pgfn.gov.br` | Débitos inscritos em dívida ativa da União | Grátis (web) — Dívida Ativa FGTS centralizou aqui em jun/2026 |
| **Infosimples APIs** | `infosimples.com/consultas/` | Wrapper sobre 150+ fontes públicas (CND, FGTS, CNDT, Sintegra, JUCESP, etc.) | Pago (~R$ 0,15-1,50/consulta) |
| **DirectD** | `directd.com.br` | KYC, CNPJ, QSA, CEIS, CNEP unificado | Pago (modelo PJ) |
| **Linkana** | `linkana.com` | Plataforma SaaS de homologação de fornecedores (B2B incumbente) | Pago (anual) |
| **JusBrasil / Jusbrasil API** | — | Cruzar processos judiciais por CNPJ | Pago |

**>>> DECISION POINT:** O Stack Mínimo Viável para módulo "conferência de concorrentes" é:
- PNCP API (grátis) → puxa docs do vencedor
- Receita Federal Consulta CNPJ (grátis ou Infosimples R$ 0,15) → QSA + CNAEs
- Portal Transparência Sanções (grátis, web scraping) → CEIS/CNEP
- CNJ Improbidade (grátis, scraping ou Infosimples) → condenações
- API Serpro/Infosimples CND (pago) → revalidar certidões na hora
- LLM (OpenAI/Gemini) → análise semântica do ACT vs edital

Custo marginal por análise: **R$ 0,80 - R$ 3,00** por concorrente analisado. Para um certame com 3-5 concorrentes do vencedor, **R$ 5-15 por certame** em custo variável de API.

---

## C. WORKFLOW REAL DO FORNECEDOR PEQUENO-MÉDIO

### C.1 Ferramentas Hoje em Uso

**Tipo "planilha + pasta de Google Drive" (60-70% dos fornecedores pequenos):**
- Planilha Excel/Google Sheets com checklist de certidões + vencimentos
- Pasta no Drive/Dropbox com PDF dos documentos
- Calendário Google com lembretes manuais
- WhatsApp com contador (para CRF, balanço)
- Sem CRM de oportunidades — usa email + alertas dos portais

**Tipo "SaaS plataforma única" (20-25%, geralmente fornecedores médios):**

| Plataforma | Foco principal | Preço aprox. | Features de habilitação |
|------------|----------------|---------------|---------------------------|
| **Effecti** (effecti.com.br) | All-in-one: busca + dossiê + lances automatizados + IA "Aimê" leitora de edital | R$ 200-800/mês (escalonado) | Checklist de habilitação, organização dossiê, **não tem** conferência de concorrentes |
| **ConLicitação** (conlicitacao.com.br) | Busca + dossiê + consultoria. Recente: integração com Licitanet | R$ 150-500/mês (semestral/anual/bienal) | Arquivamento e gestão da documentação, alertas, **não tem** conferência avançada |
| **LicitaNet** (licitanet.com.br) | Plataforma de pregões + agora bundle com Conlicitação | Plano por participação | Operação de lances, login fornecedor |
| **BNC** (bnc.org.br) | Plataforma de operação de pregões | Por participação | Operação, sem features de dossiê |
| **Siga Pregão** (sigapregao.com.br) | Software para licitantes, IA para resumir edital | R$ 100-400/mês | IA, busca, dossiê, **não tem** conferência |
| **LicitaGov** (licitagov.org) | Alertas + IA leitora de editais | R$ 50-200/mês (estimativa) | IA + alertas, sem gestão de dossiê |
| **Alerta Licitação** (alertalicitacao.com.br) | Alertas (Wegov group) | Baixo (free + pago) | Alertas, sem dossiê |
| **Portal de Compras Públicas** (portaldecompraspublicas.com.br) | Marketplace + operação | Por participação | Operação |
| **TOTVS Licitações** (totvs.com/licitacoes) | ERP para órgãos públicos compradores | Enterprise B2G | Fora do escopo do fornecedor |
| **Mannesoft Winner** | Software organização docs | — | Centralização |
| **Dynadok** | Validação IA de documentos | — | Validação IA |

**Lacuna competitiva clara:** **NENHUM dos players acima oferece "conferência avançada dos docs do concorrente declarado vencedor"**. Todos focam no próprio dossiê do cliente. Conlicitação tem **consultoria humana** que pode fazer isso sob demanda, mas não automatizado.

**Tipo "manual + advogado terceirizado" (10-15%, fornecedores com tickets altos):**
- Escritório de advocacia especializado faz dossiê + impugnações
- Custo: R$ 1.500-5.000/mês ou por demanda
- Não escala para volume alto

### C.2 Tempo Gasto por Edital (Estimativa Operacional)

Sem dados públicos consolidados (SEBRAE não publica métrica específica). Baseado em entrevistas relatadas em blogs especializados e estimativa razoável:

| Atividade | Tempo (fornecedor experiente) | Tempo (fornecedor novato) |
|-----------|--------------------------------|----------------------------|
| Triagem do edital (vai/não vai) | 15-30 min | 1-2 h |
| Leitura completa edital (50-200 pp) | 1-2 h | 3-5 h |
| Cálculo de preço/proposta | 30 min - 2 h | 2-4 h |
| Montagem do dossiê (recolha de certidões + organização) | 1-3 h | 4-8 h |
| Conferência final + submissão | 30-60 min | 1-2 h |
| **Total por edital (não-vencedor)** | **3-7 h** | **11-21 h** |
| Adicional se vencedor (envio docs habilitação + ajustes) | 1-2 h | 2-4 h |
| Análise de docs do concorrente (manual, ad-hoc) | **0-4 h** (geralmente não faz) | — |

**Carga mensal típica para cliente do briefing (4 empresas, 5-30 certames/mês):**

| Cenário | Certames/mês | Horas/mês (experiente) |
|---------|--------------|--------------------------|
| Low (5) | 5 | 15-35 h |
| Mid (15) | 15 | 45-105 h |
| High (30) | 30 | 90-210 h |

A 30 certames/mês com 4 empresas = potencialmente até **210h/mês só em pré-licitação**, equivalente a **>1 funcionário full-time**. **Esse é o tamanho da dor.**

### C.3 Custo de Errar

**Custo direto de inabilitação por documento:**
- Perda do certame: 100% do margem esperada (variável, mas tipicamente 15-30% do valor)
- Tempo perdido: 3-7h do esforço descrito acima
- Risco reputacional: pregoeiros têm memória; órgão pode olhar com mais escrutínio próximas vezes

**Custo de sanção por descumprimento de contrato (escalada se vencer e não conseguir executar):**

| Sanção | Valor / Duração | Base legal |
|--------|------------------|------------|
| Multa | 0,5% a 30% do valor do contrato | Art. 156 §§3º-5º Lei 14.133 |
| Impedimento de licitar/contratar (com o ente que sancionou + União, Estados, DF, Municípios) | até **3 anos** | Art. 156 Lei 14.133 |
| Declaração de inidoneidade (nacional, todos os entes) | **3 a 6 anos** | Art. 156 Lei 14.133 |
| Inscrição no CEIS/CNEP | Conforme prazo da sanção | Lei 12.846/2013 |

**Custo de oportunidade indireto:** uma empresa sancionada perde acesso a **TODO o universo de licitações** durante o prazo. Para fornecedor B2G puro = morte do negócio.

### C.4 ROI da Automação (Estimativa Conservadora)

Se a ferramenta economiza **40-60% do tempo** de montagem de dossiê + reduz **80%** das inabilitações evitáveis:

- Cenário 15 certames/mês × 5h/cada × R$ 80/h salário-base = R$ 6.000/mês de custo de tempo
- Economia 50% = R$ 3.000/mês
- Redução de 1 inabilitação por trimestre (margem perdida R$ 5-15k típico) = R$ 1.500-5.000/mês equivalente
- **Total disposto a pagar (WTP): R$ 200-1.500/mês** dependendo do porte

Esse é o **teto numérico de pricing** para a feature de habilitação + conferência. Comparável a Effecti/Conlicitação (~R$ 200-800/mês) — mas vendendo um **valor diferente** (automação + conferência regional).

---

## D. OPORTUNIDADES DE AUTOMAÇÃO

### D.1 Categoria "API pública pura" (alta confiança, baixo custo)

| Função | API | Implementação | Confiança |
|--------|-----|----------------|-----------|
| Buscar editais novos | PNCP `/orgaos/.../compras` | Polling diário com filtro UF/CNPJ | 95% |
| Baixar PDF do edital + anexos | PNCP `/.../arquivos/{id}` | Download direto | 95% |
| Consultar CND Federal (validar código) | Receita Federal site / API Serpro | Scraping ou pago Serpro | 90% (web) / 95% (Serpro) |
| Consultar CRF FGTS | Caixa site / Infosimples | Wrapper Infosimples | 90% |
| Consultar CNDT | TST site / Infosimples | Scraping leve | 90% |
| Consultar CNPJ (QSA, CNAEs) | Receita Federal + Serpro | Serpro pago = melhor | 95% |
| Consultar CEIS/CNEP/CEPIM | Portal Transparência (web/CSV) | Download CSV diário + index | 100% |
| Consultar CNJ Improbidade | CNJ web ou API agregada | Scraping respeitoso ou Infosimples | 85% |
| Buscar PCA (Plano Contratações Anual) | PNCP `/pcas` | Polling anual + filtros | 95% |

### D.2 Categoria "OCR + LLM" (média-alta confiança, custo médio)

| Função | Tecnologia | Custo aprox./uso | Confiança |
|--------|-------------|-------------------|-----------|
| Extrair requisitos de habilitação do PDF | PDF parser (PyMuPDF) + LLM (GPT-4-mini, Gemini Flash) | R$ 0,30-1,50 / edital | 75-85% |
| Extrair valores estimados, prazos, modalidade | PDF parser + regex/LLM | R$ 0,10-0,50 | 90% |
| Listar exigências de ACT (quantidade mínima, similaridade) | LLM com prompt engineering | R$ 0,50-2,00 | 75% |
| Comparar ACT do cliente vs exigência do edital | Embedding (similarity) + LLM judge | R$ 0,30-1,00 | 70-80% |
| Classificar irregularidade detectada (sanável vs insanável) | LLM com base curada de jurisprudência TCU | R$ 0,50-1,50 | 65-75% |
| Validar coerência QSA (cruzar contrato social com Receita Federal) | LLM + regras | R$ 0,30-0,80 | 80% |
| Extrair índices contábeis do balanço PDF | PDF parser + table extraction (Camelot/Tabula) + regra | R$ 0,30-1,00 | 70-85% |
| Resumir edital em 1 página | LLM | R$ 0,20-0,80 | 85% |

### D.3 Categoria "Manual com apoio" (não-automatizável 100%)

| Atividade | Por quê não automatizar | Apoio possível |
|-----------|--------------------------|-----------------|
| Decisão final "vai/não vai" no certame | Estratégia comercial humana | Sistema dá score + dados |
| Redação de razões recursais | Argumentação jurídica nuancada | Template + LLM rascunho |
| Negociação de prazo/condições | Relação humana | Sistema agenda + lembrete |
| Decisão sobre impugnar edital antes da sessão | Julgamento de oportunidade | Análise de risco automatizada |
| Cumprimento do contrato vencido | Execução comercial | Fora do escopo do produto |
| Recurso à autoridade superior (caso recurso ao pregoeiro seja negado) | Estratégia jurídica | LLM apoio + advogado humano |

### D.4 Ferramentas Concorrentes — Gap Analysis

| Feature | Effecti | Conlicitação | LicitaGov | Siga Pregão | **Buscador Licitações DF (oportunidade)** |
|----------|---------|---------------|-----------|--------------|---------------------------------------------|
| Busca editais nacional | ✅ | ✅ | ✅ | ✅ | Regional (vantagem) |
| Alertas por palavra-chave/CNAE | ✅ | ✅ | ✅ | ✅ | ✅ |
| IA leitora de edital | ✅ (Aimê) | ⚠️ | ✅ | ✅ | ✅ (com foco regional) |
| Gestão dossiê habilitação cliente | ✅ | ✅ | ⚠️ | ✅ | ✅ |
| Alerta vencimento certidão | ✅ | ✅ | ⚠️ | ✅ | ✅ |
| Lances automáticos (bot) | ✅ | ⚠️ | ❌ | ✅ | ❌ (fora de escopo) |
| **Conferência docs do concorrente vencedor** | ❌ | ⚠️ (manual via consultoria) | ❌ | ❌ | ✅ **DIFERENCIAL** |
| **Cruzamento CEIS/CNEP/CNJ automático** | ⚠️ | ⚠️ | ❌ | ❌ | ✅ |
| **Análise de QSA + vínculos societários** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Geração automática de rascunho de razões recursais** | ❌ | ❌ | ❌ | ❌ | ✅ |
| Integração SICAF | ✅ | ✅ | ⚠️ | ✅ | ⚠️ (v2) |
| Foco regional ultra-nichado (DF+AL) | ❌ | ❌ | ❌ | ❌ | ✅ **DIFERENCIAL** |

**>>> DECISION POINT:** O produto tem 2 diferenciais defensáveis:
1. **Conferência de concorrentes** (vertical novo, ninguém faz bem)
2. **Foco regional ultra-nichado** (jogo de cauda longa que players nacionais não priorizam)

Sem esses 2, vira commodity vs Effecti R$ 200/mês.

---

## E. REGIÃO ESPECÍFICA — Águas Lindas-GO + DF

### E.1 Portais Alvo Confirmados

| Portal | Status | Operação | Volume estimado/mês |
|--------|--------|----------|------------------------|
| **PNCP** | ✅ Obrigatório (Lei 14.133) | Federal (MGI/Serpro) | 400-800 DF+AL combinados |
| **Compras.gov.br / Comprasnet** | ✅ Federal (UASGs DF) | Federal (MGI) | 500-800 UASGs DF |
| **e-Compras DF** (portal.compras.df.gov.br) | ✅ Ativo | GDF (SEEC-DF) | 300-500 (todas secretarias + autarquias DF) |
| **DODF** | ✅ Publicação oficial | Casa Civil DF | 200-400 publicações licitação |
| **Câmara Legislativa DF** | ✅ Mínimo | CLDF | 5-15 (compras próprias) |
| **TCDF** | ⚠️ Apenas auditoria | TCDF | 50-100 atos (anulações, recomendações) |
| **Portal Águas Lindas-GO** | ✅ Confirmado | Prefeitura (com PCP/Portal Compras Públicas como ferramenta) | 10-30 + Câmara |
| **PCP - Portal de Compras Públicas** | ✅ Ferramenta de operação usada por AL e várias prefeituras GO/SC/etc. | Privada (portaldecompraspublicas.com.br) | — |
| **Licitações-e (BB)** | ⚠️ Wildcard | BB | Validar se prefeitura usa |
| **Comprasnet GO + SISLOG** | ⚠️ Estado de Goiás | SEAD-GO | 500-800 estado GO |
| **DOE-GO** | ✅ Publicação oficial GO | Imprensa Oficial GO | 150-300 (estadual) + 20-40 região AL |

### E.2 Frequência Estimada de Certames (Mensal) — Cliente do Briefing

**Águas Lindas-GO:**
- Prefeitura Municipal de Águas Lindas de Goiás: 10-30 processos/mês (PCP + PNCP)
- Câmara Municipal de Águas Lindas: 1-5 processos/mês (PNCP, valores menores)
- Autarquias municipais (se houver — saúde, educação): incluídas na prefeitura
- Sub-total Águas Lindas: **15-35/mês**

**Distrito Federal:**
- Secretarias GDF (Saúde, Educação, Segurança, Transporte etc. — 20+ secretarias): 200-300/mês
- Autarquias e fundações DF (BRB, NOVACAP, CEB, Brasiliense Águas, CAESB, IPREV-DF etc.): 50-100/mês
- CLDF, TCDF, MPDFT, TJDFT (Esferas autônomas): 10-30/mês
- Sub-total DF: **300-500/mês**

**Federal com execução DF (Esplanada):**
- UASGs do Executivo Federal sediadas DF: ~150-300/mês (varia muito por Ministério)
- Forças Armadas DF (CMP, Marinha Comando, FAB): 30-80/mês
- Empresas estatais (BB, CEF, Petrobras, Eletrobras — UASGs federais com execução em DF): 30-60/mês
- Sub-total Federal/DF: **200-500/mês**

**TOTAL universo bruto:** ~500-1.000 certames/mês visíveis para um fornecedor genérico em DF+AL.
**Após filtros de CNAE/objeto/valor do cliente:** estimativa razoável de **30-150 certames qualificáveis/mês**.

### E.3 Tickets Médios Típicos

Sem dataset consolidado público com granularidade municipal-AL. Estimativas baseadas em PNCP browsing e referências de mercado:

| Faixa de ticket | Modalidade dominante | Frequência relativa |
|------------------|------------------------|----------------------|
| **Dispensa eletrônica** (≤ R$ 65.492 bens/serviços, R$ 130.984 obras em 2026) | Dispensa | 30-40% volume (alto), R$ baixo |
| **Pregão eletrônico baixo** (R$ 65k - R$ 500k) | Pregão | 35-45% |
| **Pregão eletrônico médio** (R$ 500k - R$ 5M) | Pregão | 15-25% |
| **Pregão eletrônico/Concorrência alto** (R$ 5M+) | Pregão/Concorrência | 5-10% |

**Ticket médio (estimativa):** R$ 200k - R$ 800k em pregão; R$ 20-50k em dispensa.

### E.4 Especificidades Regionais

**Águas Lindas-GO (~239k habitantes, IBGE 2022):**
- Município localizado na RIDE (Região Integrada de Desenvolvimento do Entorno DF), o que cria sobreposição funcional com fornecedores DF
- Usa **Portal de Compras Públicas** (privado) como ferramenta de operação dos pregões + publica no PNCP
- Câmara Municipal usa o mesmo PCP + tem site próprio Wordpress
- Possui departamento de compras dentro da Secretaria de Infraestrutura e Obras
- Atendimento físico para retirada de editais em horário comercial (sinal de baixa maturidade digital — ainda permite retirada presencial)
- **Implicação:** Cliente que está em AL **provavelmente também participa de DF** — produto deve cobrir os dois portais como bundle natural

**Distrito Federal (ente sui generis):**
- DF acumula competências de Estado E Município → universo de órgãos é muito maior que estado típico
- e-Compras DF é o portal único — mas com migração progressiva para PNCP
- DODF é fé pública obrigatória — publicações de extrato de licitação saem aqui
- Forte presença de Pregões com órgãos federais executando no DF (sinal de oportunidades adicionais)
- **Implicação:** A análise correta para o cliente cobre 3 esferas (Municipal AL, Estadual = DF, Federal-com-execução-DF) — 3 dimensões de PNCP + portais específicos

**Sem portais regionais "exóticos":** Todos os portais relevantes seguem padrões da Lei 14.133. Não há sistema legacy proprietário pesado tipo BEC-SP no DF.

**>>> DECISION POINT:** Para o módulo de **conferência de docs do concorrente**, o produto não precisa de scraping customizado por município — basta o pipeline PNCP + portal-de-operação (PCP, e-Compras DF, Compras.gov.br). O foco em DF+AL é regional pelo **lado da busca de oportunidades**, não pelo lado da análise documental (que é padronizada nacionalmente pela Lei 14.133).

---

## F. Recomendações Síntese para Produto

### F.1 Arquitetura Conceitual do Módulo "Habilitação + Conferência"

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: INTAKE                                             │
│  - PNCP API (editais + status)                               │
│  - Portais de operação (Compras.gov.br, PCP, e-Compras DF)   │
│  - DODF/DOU/DOE-GO (extratos)                                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: REQUIREMENT EXTRACTION                             │
│  - PDF parser → texto + tabelas                              │
│  - LLM → extrai requisitos de habilitação                    │
│  - Output: checklist estruturado por categoria               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 3A: DOSSIER MATCH (cliente)                           │
│  - Biblioteca de docs do cliente (4 empresas)                │
│  - Match com checklist do edital                             │
│  - Score de aderência + gaps                                 │
│  - Geração de PDF "dossiê pronto"                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 3B: COMPETITOR CHECK (gatilho: vencedor declarado)    │
│  - Download docs vencedor do PNCP                            │
│  - Cruzamento CEIS/CNEP/CNJ                                  │
│  - Validação CND online (Serpro/Infosimples)                 │
│  - Análise QSA (Receita Federal + contrato social)           │
│  - Análise ACT (similaridade vs exigência edital)            │
│  - LLM judge: irregularidades sanáveis vs insanáveis         │
│  - Output: relatório triagem (≤30 min) + rascunho recurso    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 4: MANUTENÇÃO CONTÍNUA                                │
│  - Calendário de renovação (CRF/FGTS = 30d gargalo)          │
│  - Alertas push 7d / 3d / 1d antes vencimento                │
│  - Re-emissão automatizada (onde API permite)                │
└─────────────────────────────────────────────────────────────┘
```

### F.2 Priorização MVP (Sprint Sugerido)

**Sprint 1 (4-6 semanas) — "Dossiê do Cliente":**
- Biblioteca de docs das 4 empresas (upload + classificação automática)
- Calendário de vencimentos com alertas (foco CRF/FGTS, CNDs)
- Integração PNCP API para puxar editais filtrados (DF+AL+CNAEs)
- LLM extrai requisitos de habilitação do PDF do edital
- Score "aderência" das 4 empresas para cada edital
- **KPI:** "0 inabilitações por vencimento de certidão"

**Sprint 2 (4-6 semanas) — "Conferência do Concorrente":**
- Gatilho: monitoramento de status do certame, dispara quando vencedor declarado
- Pipeline de download de docs do PNCP + portal de operação
- Cruzamento CEIS/CNEP (free, via CSV download diário)
- Cruzamento Receita Federal (QSA + CNAEs)
- Validação CND ativa (Serpro pago R$ 0,30-0,80)
- LLM judge "irregularidade sanável vs insanável"
- Output: relatório de triagem em <30 min
- **KPI:** "≥1 impugnação procedente / trimestre por cliente"

**Sprint 3 (2-4 semanas) — "Inteligência Competitiva":**
- Histórico de quem ganha o quê na região (cruzamento Transparência DF/GO)
- Padrões de incumbentes
- Análise de PCA (Plano Contratações Anual) para antecipar licitações futuras

### F.3 Riscos e Constraints

| Risco | Mitigação |
|-------|-----------|
| LLM erra na classificação "sanável vs insanável" e cliente perde recurso | Sempre human-in-the-loop nos casos high-stakes; relatório com score de confiança |
| Custo de API de validação (CND, CNPJ) escala com volume | Cache inteligente (CND válida 180d = re-consulta só após 150d) |
| TCU/jurisprudência muda interpretação de algum doc | Sistema de "última atualização da regra" + revisão trimestral curada |
| Portal de origem (PCP, e-Compras DF) muda layout/quebra scraping | Pipeline com fallback PNCP (canonical) + alertas de quebra |
| LGPD: docs do concorrente contêm CPF de sócios | Tratar como **dado público** (publicado em portal oficial por força de lei) mas pseudonimizar em logs/analytics |
| Concorrente acusa "perseguição" via uso do sistema | Sistema só **organiza** dados públicos, não cria nada — defesa fácil legalmente |
| Águas Lindas usar portal próprio que não cumpra padrão | Validação manual semana 1 do POC + DOE-GO como fallback de discovery |

---

## Sources (32 referências consultadas)

### Quadro normativo (oficial)
1. [Lei 14.133/2021 — Nova Lei de Licitações e Contratos](http://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/L14133.htm) — base legal
2. [Decreto 12.807/2025 — Atualização de valores para 2026](https://www.gov.br/compras/pt-br/acesso-a-informacao/comunicados/2025/no-47-25-decreto-altera-valores-da-lei-14-133-para-compras-publicas) — limites dispensa
3. [TCU — Cap. 5.5 Habilitação (Licitações e Contratos)](https://licitacoesecontratos.tcu.gov.br/5-5-habilitacao-2/) — doutrina e jurisprudência
4. [TCU — Cap. 5.5.2 Habilitação Técnica](https://licitacoesecontratos.tcu.gov.br/5-5-2-habilitacao-tecnica/) — ACT
5. [TCU — Cap. 5.5.4 Habilitação Econômico-Financeira](https://licitacoesecontratos.tcu.gov.br/5-5-4-habilitacao-economico-financeira/) — balanço/índices
6. [TCU — Cap. 5.8 Infrações e Sanções Administrativas](https://licitacoesecontratos.tcu.gov.br/5-8-infracoes-e-sancoes-administrativas-licitantes/) — penalidades
7. [TCU — Cap. 5.1.1 Impugnação e Esclarecimento](https://licitacoesecontratos.tcu.gov.br/5-1-1-impugnacao-e-pedidos-de-esclarecimento/) — janela de recurso
8. [TCU — Cap. 2.3.2.3 Plano de Contratações Anual (PCA)](https://licitacoesecontratos.tcu.gov.br/2-3-2-3-plano-de-contratacoes-anual-pca/) — antecipação
9. [Justen Filho — A Figura do Autoatestado em Capacidade Técnica](https://justen.com.br/artigo_pdf_2/a-figura-do-autoatestado-na-comprovacao-de-capacidade-tecnica-em-licitacoes/) — limites jurisprudenciais
10. [Justen Filho — Juntada de Documentos Novos na Habilitação](https://justen.com.br/artigo_pdf_est_2adv_/a-juntada-de-documentos-novos-na-fase-de-habilitacao/) — diligência

### Jurisprudência analítica
11. [Schiefler Advocacia — Problemas mais comuns que levam à inabilitação](https://schiefler.adv.br/problemas-mais-comuns-que-levam-a-inabilitacao-de-licitantes/) — catalogo prático
12. [Conjur — Poder-dever de diligência do pregoeiro (2025)](https://www.conjur.com.br/2025-nov-21/o-poder-dever-de-diligencia-do-pregoeiro-e-o-formalismo-moderado-na-lei-no-14-133-2021/) — formalismo moderado
13. [Adiel Ferreira Jr — Inabilitação indevida (Lei 14.133)](https://www.adielferreirajr.com/post/inabilitacaoindevida) — casuística
14. [Conlicitação — O que o TCU decidiu sobre diligência do pregoeiro](https://conlicitacao.com.br/o-que-o-tcu-tem-decidido-sobre-o-dever-de-diligencia-do-pregoeiro/) — síntese
15. [Conjur — O SICAF e o princípio da publicidade na habilitação (2025)](https://www.conjur.com.br/2025-abr-14/o-sicaf-e-o-principio-da-publicidade-na-fase-de-habilitacao/) — gap real
16. [BLL — Capacidade Técnica nas Licitações: similaridade exigida](https://bll.org.br/noticias/capacidade-tecnica-nas-licitacoes-similaridade-exigida-e-os-limites-da-lei-no-14-133-2021/) — limites ACT
17. [Ronny Charles — Balanço Patrimonial dos 2 últimos exercícios (análise crítica)](https://ronnycharles.com.br/wp-content/uploads/2024/08/Artigo-Final-A-exigencia-do-balanco-patrimonial-dos-ultimos-dois-anos-4.pdf) — art. 69

### Portais oficiais e APIs
18. [PNCP — Portal Nacional de Contratações Públicas](https://www.gov.br/pncp/pt-br) — eixo central
19. [PNCP — Swagger UI API Consulta](https://pncp.gov.br/api/consulta/swagger-ui/index.html) — referência técnica
20. [PNCP — Manual de Integração v2.2.1](https://www.gov.br/pncp/pt-br/central-de-conteudo/manuais/versoes-anteriores/ManualdeIntegraoPNCPVerso2.2.1.pdf) — doc oficial
21. [Compras.gov.br — Portal Federal](https://www.gov.br/compras/pt-br/) — operação
22. [Portal de Compras DF](https://portal.compras.df.gov.br/) — e-Compras DF
23. [Prefeitura Águas Lindas de Goiás — Licitações](https://aguaslindasdegoias.go.gov.br/portal/licitacoes-2/) — portal local
24. [Portal da Transparência — Sanções (CEIS/CNEP)](https://portaldatransparencia.gov.br/sancoes/consulta) — cruzamento
25. [CNJ — Cadastro de Improbidade Administrativa](https://www.cnj.jus.br/improbidade_adm/consultar_requerido.php) — improbidade
26. [API Serpro Consulta CNPJ](https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-cnpj/) — API oficial
27. [API Serpro Consulta CND](https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-cnd/) — validação

### Players SaaS / mercado
28. [Effecti — Plataforma de Licitações](https://effecti.com.br/) — concorrente líder
29. [ConLicitação — Plataforma](https://conlicitacao.com.br/) — concorrente
30. [LicitaGov — Alertas com IA](https://licitagov.org/) — concorrente
31. [Siga Pregão — Software para licitantes](https://www.sigapregao.com.br/) — concorrente
32. [Infosimples — APIs de Consultas (preços)](https://infosimples.com/consultas/precos/) — economics de API

---

## Conclusão Operacional

A pesquisa confirma que **o produto tem duas oportunidades reais e simultâneas** que ninguém faz bem hoje:

1. **Automação do dossiê + gestão de validade das certidões para múltiplas empresas** (cliente tem 4 — gargalo operacional alto)
2. **Conferência inteligente dos documentos do concorrente declarado vencedor** (vertical novo, base de dados pública via PNCP, custo marginal R$ 5-15/análise)

O **foco regional DF+AL** é vetor de **canal de aquisição** (vender para fornecedores que atuam nessa praça) e **especialização de filtros** (CNAEs locais, conhecimento dos órgãos), mas **não é diferencial técnico** — a análise documental opera sobre padrão Lei 14.133 nacional uniformemente.

O **moat sustentável** está em três camadas combinadas:
- LLM bem treinado em **jurisprudência TCU** (sanável vs insanável)
- **Biblioteca curada** de ACTs do cliente + matcher de similaridade
- **Pipeline de baixo lag** (PNCP + portal de operação), capaz de disparar análise em <30 min

**Próximas ações recomendadas (handoff para @architect + @pm):**
- [ ] Validar com o cliente real (amigo) os 4 CNAEs prioritários para filtros default
- [ ] Mapear os 4 CNPJs das empresas do cliente no PNCP + estado de cadastro SICAF (parcial/total)
- [ ] Pegar 3-5 editais reais que o cliente perdeu nos últimos 6 meses e simular: a análise automatizada teria detectado? Em quanto tempo?
- [ ] Estimar pricing realista (R$ 200-1.500/mês range) vs custos variáveis de API (R$ 5-15/análise concorrente)
- [ ] POC técnica Sprint 1 (dossiê) — 4-6 semanas para ter algo demonstrável

*Documento elaborado por @analyst (Atlas) em 2026-05-18 para o projeto Buscador de Licitações Águas Lindas-GO + DF.*
*Próxima fase: handoff para @architect (arquitetura técnica) + @pm (priorização MVP) + @data-engineer (refinar pipeline PNCP + APIs auxiliares).*
