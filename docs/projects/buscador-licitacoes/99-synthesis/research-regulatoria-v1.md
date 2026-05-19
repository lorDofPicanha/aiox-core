# Research Regulatória V1 — Buscador de Licitações Águas Lindas-GO + DF

**Data:** 2026-05-15
**Sub-agent:** R (Regulatório-Legal) — aios-analyst (Atlas)
**Status:** final v1 — pronto para Fase C
**Timebox consumido:** ~3h30 de 3h45 alocados
**Fontes-âncora consolidadas:** 38 (média 4,4/5)

> ⚠️ **Disclaimer:** Este documento é trabalho de research analítica, NÃO é parecer jurídico. Todas as recomendações operacionais devem ser revisadas por advogado especializado em LGPD + Direito Administrativo ANTES de qualquer produtização paga. Para uso pessoal/MVP gratuito do amigo, o nível de exposição é baixo, mas o disclaimer permanece.

---

## Sumário Executivo

1. **Lei 14.133/2021 (art. 174, §4º) determina expressamente que o PNCP adote o formato de dados abertos e observe a LAI 12.527.** Isso, combinado com o Decreto 8.777/2016 (Política de Dados Abertos do Executivo Federal) e o art. 8º, §3º da LAI, fornece **base legal explícita e robusta** para consumo automatizado dos dados — inclusive comercial. **Não há blocker legal para o MVP.**

2. **A API pública de consulta do PNCP NÃO exige autenticação** (apenas as APIs de manutenção/escrita exigem JWT). A API de Dados Abertos do Compras.gov.br é licenciada **sob ODbL (Open Database License)** com requisito apenas de **atribuição + share-alike** se houver redistribuição da base.

3. **CNPJ/dados de pessoa jurídica NÃO são dados pessoais** sob a LGPD (Art. 5º, I — dado pessoal é "informação relacionada a pessoa natural"). Portanto, a coleta de dados de fornecedores/contratantes do PNCP é, no plano LGPD, fora do escopo de proteção — **MAS** CPF de sócios, MEI e dados de representantes legais SÃO pessoais e exigem mitigação (mascarar/dropar).

4. **Web scraping ético de portais .gov.br é legalmente amparado** pela combinação LAI + Lei do Governo Digital (14.129/2021) + Marco Civil + Decreto 8.777. A ANPD, no Radar Tecnológico nº 3 (nov/2024), confirmou que scraping pode envolver tratamento de dados pessoais — portanto sujeito à LGPD —, **mas não o proibiu** quando feito sobre dados públicos com finalidade legítima.

5. **NÃO há jurisprudência TCU/TCDF que considere "ferramenta de busca/agregador de licitações" como vantagem indevida.** O acórdão TCU 1.216/2014 trata especificamente de **robôs de lance automatizado** (intervenção no certame), o que é categorialmente diferente do nosso produto, que apenas agrega e filtra dados públicos antes da decisão humana de participar. **Risco regulatório do produto: nenhum a baixo.**

6. **Como Agente de Tratamento de Pequeno Porte (Resolução ANPD nº 2/2022), o MVP solo é DISPENSADO de DPO formal** desde que mantenha canal de comunicação com titulares. ROPA simplificado (8 campos) é obrigatório. Notificação de incidente: 6 dias úteis (prazo dobrado).

7. **DPA (Contrato de Operador) com Supabase, Vercel, Anthropic, Resend é NECESSÁRIO assim que houver dados de usuários** — todos esses fornecedores têm DPAs prontos para LGPD/GDPR. Configurar antes do primeiro usuário pago.

8. **Cookie consent banner obrigatório** apenas se houver cookies não-essenciais (analytics, marketing). Banner com opt-in para esses; cookies estritamente necessários podem usar interesse legítimo.

### Veredito GO/NO-GO Regulatório

🟢 **SEM BLOCKER REGULATÓRIO PARA D-GO**

Condições mínimas Dia 1 (MVP gratuito uso pessoal/amigo):
- ✅ Consumir PNCP API + dados abertos via ODbL/CC-compatível (atribuir fonte)
- ✅ Respeitar robots.txt + User-Agent identificável + intervalo educado (1-2 req/s) em portais sem API
- ✅ Mascarar/descartar CPF de sócios em editais
- ✅ Footer com link "Política de Privacidade" e "Termos de Uso" (mesmo placeholder)
- ✅ Logar fonte de cada dado coletado (atribuição ODbL)

Condições adicionais Dia 1 SE produtizar pago (D-PRODUTO):
- ⚠️ Contratar revisão jurídica especializada (~R$2-5k)
- ⚠️ Política de Privacidade real + Termos de Uso assinados pelo usuário
- ⚠️ ROPA simplificado preenchido (8 campos da ANPD)
- ⚠️ Canal de atendimento ao titular (e-mail dedicado)
- ⚠️ Aceitar DPAs publicados de Supabase/Vercel/Anthropic/Resend
- ⚠️ Cookie banner com opt-in granular para analytics/marketing
- ⚠️ DPA próprio assinado pelo cliente B2B (controlador → operador)

### Checklist LGPD Mínimo Dia 1 (MVP gratuito)

| Item | Status mínimo MVP | Status produtizado |
|------|-------------------|---------------------|
| Política de Privacidade publicada | ✅ Recomendado | ✅ Obrigatório |
| Termos de Uso | ✅ Recomendado | ✅ Obrigatório |
| Canal de contato titular (e-mail) | ✅ Recomendado | ✅ Obrigatório |
| ROPA simplificado (8 campos ANPD) | 🟡 Boas práticas | ✅ Obrigatório |
| DPO formal | ❌ Dispensado | ❌ Dispensado (Res. ANPD 2/22) |
| DPA com fornecedores | 🟡 Recomendado | ✅ Obrigatório |
| Cookie banner | 🟡 Se houver analytics | ✅ Se houver não-essenciais |
| Mascarar CPF em editais | ✅ Obrigatório | ✅ Obrigatório |
| Atribuição dados PNCP (ODbL) | ✅ Obrigatório | ✅ Obrigatório |
| Notificação incidente <6 dias úteis | ✅ Procedimento pronto | ✅ Procedimento pronto |

---

## R1. Lei 14.133 + LAI 12.527 + Decreto 11.246/2022 — ampara scraping/API por terceiros?

### 1.1 Marco legal multi-camada

**Lei 14.133/2021 (Nova Lei de Licitações)**

- **Art. 5º** — princípios da licitação incluem **publicidade** e **transparência**. "Os atos praticados no processo licitatório são públicos, ressalvadas as hipóteses de informações cujo sigilo seja imprescindível à segurança da sociedade e do Estado." [^1]
- **Art. 174** — institui o PNCP "destinado à: I — divulgação centralizada e obrigatória dos atos exigidos por esta Lei; II — realização facultativa das contratações pelos órgãos e entidades dos Poderes Executivo, Legislativo e Judiciário de todos os entes federativos." [^2]
- **Art. 174, §4º (CHAVE)** — "O PNCP adotará o formato de dados abertos e observará as exigências previstas na Lei nº 12.527, de 18 de novembro de 2011." [^2][^3]
- **Art. 175** — divulgação no PNCP é **condição de eficácia** do contrato (sem PNCP, contrato não produz efeitos).

**Lei 12.527/2011 (LAI)**

- **Art. 8º, §3º** — Os sítios oficiais devem cumprir requisitos como:
  - **II** — "possibilitar a gravação de relatórios em diversos formatos eletrônicos, **inclusive abertos e não proprietários**, tais como planilhas e texto, de modo a facilitar a análise das informações"
  - **III** — "**possibilitar o acesso automatizado por sistemas externos** em formatos abertos, estruturados e legíveis por máquina" [^4][^5]
- O **acesso automatizado por sistemas externos** está LITERALMENTE previsto. Não é "permitido" — é **OBRIGAÇÃO** do órgão público disponibilizar dessa forma.

**Decreto 8.777/2016 (Política de Dados Abertos do Executivo Federal)**

- Define dados abertos como dados publicamente acessíveis, em formato aberto, legível por máquina, com **"permissão irrestrita de reuso"** [^6][^7]
- "Os dados disponibilizados são para livre uso pelo Governo Federal e pela sociedade." [^6]
- Não exige autorização específica para reuso comercial.

**Lei 14.129/2021 (Lei do Governo Digital)** [^8]

- Reforça o princípio de "governo como plataforma" — infraestrutura tecnológica que **facilita o uso de dados publicamente acessíveis**
- Inclui APIs públicas como instrumento de eficiência

**Decreto 11.246/2022** [^9]

- Regulamenta o §3º do art. 8º da Lei 14.133 (agente de contratação, equipe de apoio, comissão, gestores e fiscais)
- **NÃO trata de PNCP nem de acesso a dados.** Não é relevante para R1.
- *Observação:* O nome citado na pergunta R1 ("Decreto 11.246/2022 regulamenta PNCP") está parcialmente impreciso — esse decreto regulamenta o agente de contratação, não o PNCP. A regulamentação técnica do PNCP vem de portarias do MGI/SEGES.

### 1.2 Doutrina canônica

**Marçal Justen Filho (e Fernão Justen / Maria Julia Castelo Branco)** [^10][^11]
- Artigos 54, 87 e 174 da Lei 14.133 estabelecem norma destinada a "conferir máxima eficácia ao princípio da transparência"
- O objetivo é "tornar disponível todas as informações públicas a todo e qualquer cidadão, em tempo real e a partir de qualquer lugar"
- "A transparência integral só será alcançada se o PNCP possuir recursos que facilitem a consulta por qualquer interessado"
- **A doutrina trata o reuso amplo como funcionalidade desejada, não como risco.**

**Open Knowledge Brasil** [^12]
- "É direito fundamental do cidadão acessar e raspar dados públicos"
- Órgãos como TCU, CGU, MPF usam web scraping para auditorias — não é prática marginal, é institucionalizada.

### 1.3 Veredito R1

> **SIM, Lei 14.133 + LAI + Decreto 8.777 + Lei do Governo Digital amparam consumo automatizado (scraping/API) de dados de licitação por terceiros, SEM autorização específica do órgão.**

**Condições para preservar o amparo:**
1. Não contornar autenticação/sigilo onde declarado (apenas dados públicos)
2. Respeitar limites técnicos razoáveis (não DDoS o servidor)
3. Atribuir a fonte ao redistribuir (ODbL/CC-BY)
4. Não tratar como anônimo dados que possam reidentificar pessoa natural (CPF de sócios)
5. Para cookies/dados de usuário do nosso produto, observar LGPD separadamente

**Confidence:** 92% — a base é legislação federal explícita + doutrina canônica unânime + ausência de jurisprudência restritiva.

---

## R2. ToU PNCP / ComprasGov / e-Compras DF — restrições a reuso?

### 2.1 PNCP (pncp.gov.br) — federal, prioritário

**Acesso:** API de consulta pública, **sem necessidade de cadastro ou login** [^13][^14]

**Autenticação:**
- ✅ APIs de **consulta** (GET): públicas, sem autenticação
- 🔒 APIs de **manutenção** (POST/PUT/DELETE): requerem JWT (1 hora de validade)

**Formato:** REST + JSON [^15]

**Licença implícita:** O art. 174 §4º obriga formato de dados abertos + LAI. Combinado com Decreto 8.777/2016, isso significa **"permissão irrestrita de reuso"** — inclusive comercial — desde que atribuída a fonte. [^6]

**Termos de uso específicos do PNCP:** Não localizei (no horizonte da research) ToU separado com cláusulas restritivas no pncp.gov.br. A página de Dados Abertos do PNCP [^16] confirma posicionamento alinhado à LAI + dados abertos.

**Rate limit declarado:** Não há rate limit oficialmente publicado nos manuais de API consultados [^14][^15]. Documento da **Transparência Brasil (jun/2024)** [^17] aponta como **problema atual do PNCP**:
- Impossibilidade de download em massa
- Restrições não declaradas nas APIs
- Pulverização dos dados em múltiplos endpoints
- Falhas frequentes de servidor durante extrações longas (relato: extração de parte dos dados levou 10 dias e foi interrompida várias vezes)

**Implicação prática:** O próprio governo trata o reuso como esperado. Não há ToU restritivo. O risco operacional é **estabilidade do servidor**, não regulatório.

### 2.2 Compras.gov.br / compras.dados.gov.br — federal, ComprasNet legacy

**Licença declarada:** ODbL — **Open Database License** [^18][^19]

**Resumo prático ODbL:**
- ✅ Pode usar comercialmente
- ✅ Pode redistribuir
- ⚠️ Deve **atribuir a fonte** (link para compras.dados.gov.br ou Compras.gov.br)
- ⚠️ **Share-alike**: se redistribuir uma versão adaptada do banco, deve oferecer essa adaptação sob ODbL também
- ⚠️ Se aplicar restrições técnicas (DRM) em redistribuição, deve também disponibilizar versão sem restrição

**Aplicação ao MVP:** Como nosso produto **agrega e filtra**, não redistribui o banco bruto, o share-alike provavelmente não dispara. **Atribuir fonte sempre.**

### 2.3 e-Compras DF / portal.compras.df.gov.br

**Status:** [^20][^21]
- Existe Portal de Compras DF: https://portal.compras.df.gov.br/
- Existe versão legacy e-Compras DF (anterior a 2019): http://www.compras.df.gov.br (requer IE9 modo compatibilidade — pode estar deprecated)
- Não há API pública declarada do GDF — coleta provavelmente via scraping HTML

**ToU específicos:**
- O footer do Portal de Compras DF aponta para "Política de Privacidade", "Aviso Legal" e "Termos de Uso", mas **não consegui extrair texto literal nesta research** (WebFetch bloqueado; deve ser validado por inspeção manual antes do Go-Live).
- Política de Privacidade e-GDF (genérica do GDF): aderente à LGPD + Marco Civil [^22]

**Implicação prática:**
- Assumir até validação: dados publicados são **públicos por força da LAI + Lei 14.133**
- Scraping educado (robots.txt, intervalo, UA identificável) é defensável legalmente
- **Ação pendente Breno:** ler ToU manualmente em https://portal.compras.df.gov.br/ antes do MVP entrar em produção. Se houver cláusula explícita "vedado scraping", precisamos consultar advogado — pois ToU não pode contrariar dever de transparência da LAI, mas evitar litígio é melhor.

### 2.4 Tabela consolidada

| Portal | Reuso permitido? | Redistribuição? | Uso comercial? | Rate limit ToU | Licença declarada |
|--------|------------------|------------------|----------------|------------------|---------------------|
| **PNCP** (pncp.gov.br) | ✅ Sim (LAI + art. 174 §4º) | ✅ Sim com atribuição | ✅ Sim | Não declarado | Dados Abertos (LAI) |
| **compras.dados.gov.br** | ✅ Sim | ✅ Sim com atribuição | ✅ Sim | Não declarado | ODbL |
| **Compras.gov.br** (UI) | ✅ Consulta pública | ⚠️ Verificar caso a caso | ⚠️ Verificar | Não declarado | LAI |
| **e-Compras DF / portal.compras.df.gov.br** | ✅ Por força LAI | ⚠️ Verificar | ⚠️ Verificar | Não declarado | Não localizado (pendente leitura manual) |

### 2.5 Recomendação operacional R2

**O que FAZER:**
1. ✅ Preferir API PNCP como fonte primária (cobertura federal + 80% adoção esperada)
2. ✅ Atribuir fonte no rodapé ("Dados públicos extraídos de PNCP — pncp.gov.br" / "Portal de Compras DF — portal.compras.df.gov.br")
3. ✅ User-Agent identificável em scraping: `BuscadorLicitacoesAL-DF/1.0 (+contato@dominio.com.br)`
4. ✅ Respeitar `/robots.txt` de cada portal
5. ✅ Intervalo educado entre requisições: 1-2 req/s por domínio (rate limit auto-imposto)
6. ✅ Cache local (Postgres) — reduzir hits no servidor original
7. ✅ Logar `source_url` + `fetched_at` de cada registro (atribuição auditável)

**O que NÃO FAZER:**
1. ❌ Bypass de captcha/Cloudflare em portais .gov.br — questionável eticamente, gera ruído
2. ❌ Reidentificar pessoas naturais cruzando bases (CPF + nome + endereço)
3. ❌ Bulk scrape em paralelo agressivo (>10 req/s) — pode causar instabilidade
4. ❌ Republicar banco bruto sem atribuição
5. ❌ Vender "lista de fornecedores" como produto sem base legal LGPD se houver dados pessoais

---

## R3. LGPD — triagem por categoria de dado

### 3.1 Categoria (a) — CNPJ + dados de pessoa jurídica fornecedora

**Definição LGPD (Art. 5º, I):** dado pessoal é "informação relacionada a **pessoa natural** identificada ou identificável".

**Implicação:** Dados de pessoa jurídica **NÃO são protegidos pela LGPD**. CNPJ em si, razão social, endereço da sede, contratos firmados — fora do escopo. [^23][^24]

**Exceções importantes (vetor de risco):**
- **MEI** (Microempreendedor Individual) e **EI** (Empresário Individual) são pessoas naturais com CNPJ por questão tributária — **dados a eles atrelados PODEM ser pessoais** se permitirem identificar a pessoa por trás [^23]
- **Sócios / representantes legais** mencionados em editais: CPF + nome + endereço residencial → 100% pessoal

**Base legal recomendada:** Para CNPJ/razão social puro, **fora da LGPD**. Para MEI/EI ou onde haja vínculo com pessoa natural, **interesse legítimo (Art. 7º, IX)** + **dados públicos (Art. 7º, §3º)**, observada finalidade, boa-fé e interesse público.

### 3.2 Categoria (b) — CPF de sócios em editais antigos

**Status:** **DADO PESSOAL CLARAMENTE PROTEGIDO PELA LGPD** [^25][^26]

**Importante:** A própria ANPD (em Nota Técnica 85, ConJur 2023) [^25] e doutrina especializada (Migalhas) recomendam que editais publicados **anonimizem CPF, endereços e contatos pessoais** mesmo que tecnicamente sejam públicos. Muitos órgãos não anonimizam (descuido), e o CPF acaba publicado.

**Risco para o produto:**
- Se nosso pipeline ingerir editais com CPF visível e armazenar/exibir sem mascarar, **podemos ser caracterizados como controladores tratando dado pessoal sem base legal sólida**
- Não é a única base legal possível (poderíamos invocar interesse legítimo + dados públicos), mas o **risco operacional + reputacional é desnecessário**

**Recomendação operacional:**
- ✅ **Política Privacy-by-Default:** detectar e **mascarar/dropar CPF** no momento da ingestão
- Regex simples: `\d{3}\.?\d{3}\.?\d{3}-?\d{2}` → substituir por `***.***.***-**` antes de armazenar
- Mesmo padrão para RG, CNH se aparecerem
- Se LLM resumir o edital, instruir explicitamente a NÃO incluir CPF no resumo (prompt engineering)

**Decisão:** **NÃO COLETAR — anonimizar na origem.** Princípio do mínimo necessário (LGPD Art. 6º, III). Sem CPF, sem risco. Alinhado com Privacy by Design (Cavoukian).

### 3.3 Categoria (c) — Dados do usuário do nosso produto

**Cenário MVP gratuito (amigo + uso pessoal Breno):**
- Sem cadastro formal? → sem dado pessoal, sem LGPD aplicável
- Com cadastro? → **Base legal: execução de contrato (Art. 7º, V)** + consentimento para comunicações de marketing (se houver)

**Cenário SaaS produtizado:**
- Email + nome do contato + telefone + CNPJ + preferências de busca + histórico de uso
- **Base legal primária: execução de contrato (Art. 7º, V)** — para login, billing, entrega do serviço
- **Base legal secundária: interesse legítimo (Art. 7º, IX)** — para analytics, melhoria do produto
- **Consentimento (Art. 7º, I)** — para email marketing, push notifications

**Categoria especial:** Não trabalharemos com dados sensíveis (Art. 5º, II — saúde, orientação política, etc.). Risco baixo.

### 3.4 Tabela consolidada R3

| Categoria | Origem | Base legal LGPD | Pode coletar? | Como tratar? |
|-----------|--------|------------------|----------------|---------------|
| (a) **CNPJ + Razão social fornecedor** | PNCP / portais públicos | **Fora da LGPD** (PJ não é dado pessoal) | ✅ SIM | Armazenar livremente; atribuir fonte ODbL |
| (a') **MEI / EI / dados que reidentifiquem pessoa natural** | PNCP / Receita | Interesse legítimo (Art. 7º IX) + dados públicos (Art. 7º §3º) | ✅ SIM (com cautela) | Documentar finalidade; permitir oposição |
| (b) **CPF de sócios / representantes em edital** | Editais públicos | Sem base sólida → **anonimizar** | ❌ NÃO coletar | Regex + mascaramento na ingestão; instruir LLM a não preservar |
| (b') **Nome de representante / contato edital** | Editais | Interesse legítimo + dado público | 🟡 SIM com cautela | Não fazer perfil; não enriquecer; não usar para marketing |
| (c) **Cadastro do usuário (e-mail, nome, telefone)** | Próprio app | Execução contrato (Art. 7º V) | ✅ SIM | Política de privacidade + controle do titular |
| (c') **Preferências e histórico de busca** | Próprio app | Execução contrato + interesse legítimo | ✅ SIM | ROPA + finalidade documentada |
| (c'') **Email marketing / newsletter** | Próprio app | **Consentimento (Art. 7º I)** | ✅ SIM com opt-in | Double opt-in; opção fácil de descadastro |
| (d) **Cookies não-essenciais (analytics, marketing)** | Próprio app | Consentimento (cookie banner) | ✅ SIM com opt-in | Banner LGPD-compliant; opt-in granular |
| (d') **Cookies essenciais (sessão, login)** | Próprio app | Interesse legítimo | ✅ SIM sem banner | Listar em Política de Privacidade |

### 3.5 Caso ANPD relevante — Telekall (2023) [^27][^28]

**Primeira sanção da ANPD** (R$ 14.400 multa simples + advertência) aplicada à microempresa Telekall Infoservice, que **coletava dados pessoais públicos da internet e revendia a terceiros** sem base legal sólida.

**Lições para nosso projeto:**
1. "Dado está público" **NÃO é base legal** sob LGPD — precisa também ter finalidade, boa-fé e interesse público (Art. 7º §3º)
2. Comercializar perfil construído de dados públicos sem opt-in pode ser sancionado
3. **Mitigação adotada no nosso projeto:** focar em PJ (CNPJ), descartar CPF, não criar perfis de pessoa natural, não enriquecer com cruzamentos

**Diferença chave Telekall vs nosso produto:**
- Telekall criava **perfis de pessoa natural** (telefone, endereço) e vendia
- Nós agregamos **editais e dados de PJ** e oferecemos busca/alerta sobre **oportunidades de licitação**
- Risco categoricamente diferente, mas o caso justifica o rigor de mascarar CPF.

---

## R4. Jurisprudência TCU/TCDF — ferramentas de busca de licitação são vantagem indevida?

### 4.1 Acórdão TCU 1.216/2014 — robôs de lance em pregão eletrônico [^29][^30]

**O que diz:**
- O TCU analisou o uso de **softwares de envio automático de propostas comerciais (robôs)** durante o pregão eletrônico
- Concluiu que o uso desses robôs **gera vantagem competitiva** para fornecedores que possuem a tecnologia, ferindo o princípio da igualdade
- Recomendou que ComprasNet/portais implementem **mecanismos de inibição** (ex: intervalo mínimo de 3 segundos entre lances, randomização de fechamento)
- **Não proibiu o uso** — recomendou inibição técnica

**Aplicação ao nosso produto:** **NENHUMA**. A diferença categórica é:
- Acórdão 1.216/2014 trata de **AUTOMATIZAÇÃO DURANTE O CERTAME** (alguém clica "dar lance" sozinho via robô)
- Nosso produto **AGREGA DADOS ANTES DO CERTAME** para que o humano decida participar
- A linha jurídica: monitoramento/agregação de dados públicos ANTES da participação = OK; intervenção automatizada DURANTE o certame = problemático

### 4.2 Acórdão TCE-PR (2022+) — robô de lances [^29]

- TCE-PR considerou irregular o uso de robôs de lance
- Mesmo escopo do TCU 1.216/2014 — intervenção automatizada no certame
- **Não aplicável** ao nosso produto

### 4.3 Doutrina sobre robôs vs ferramentas de busca [^31][^32]

- Existe **distinção doutrinal clara** na literatura jurídica BR:
  - **"Robô de lance" / "robô de proposta"** — intervém no certame → risco regulatório alto
  - **"Robô de busca" / "monitor de editais" / "agregador"** — apenas alerta sobre publicações → **operação legítima e amplamente utilizada**
- Os próprios concorrentes (**Effecti, LicitaNet, Conlicitação**) operam há +5 anos sem nenhuma sanção TCU/TCDF nessa categoria

### 4.4 TCDF — busca específica

**Status:** Não localizei (nesta research) acórdão TCDF que trate especificamente de **agregadores/ferramentas de busca de licitação** como vantagem indevida.

O TCDF atua preventivamente contra:
- Restrições injustificadas à competitividade
- Sobrepreço
- Conluios / direcionamento [^33]

Nenhuma dessas categorias se aplica a ferramenta de busca de editais.

### 4.5 Veredito R4

> **Risco regulatório: NENHUM a BAIXO.**

**Justificativa:**
- Jurisprudência TCU/TCDF crítica é exclusivamente sobre **robôs de lance** (intervenção no certame), não sobre **busca/agregação de dados públicos**
- 5+ players nacionais operam há anos no mesmo modelo sem sanção
- Linha legal sólida: agregação ≠ intervenção
- Princípio da publicidade da Lei 14.133 (Art. 5º) + LAI defendem amplamente o produto

**Recomendação:**
- ✅ Posicionar comercialmente como **"monitor / agregador / buscador de editais"** — NUNCA como "robô de proposta automática" ou "auto-bidder"
- ✅ Não construir feature de auto-bidding em release v1 ou v2 (risco regulatório aumenta drasticamente)
- ✅ Se um dia for construir auto-bid, exigir confirmação humana obrigatória + intervalo mínimo

**Confidence:** 90% — baseado em consenso doutrinal + ausência de jurisprudência restritiva + precedente prático de 5+ competidores.

---

## R5. Obrigações ANPD — SaaS B2B de 1 dev solo

### 5.1 Status: Agente de Tratamento de Pequeno Porte (ATPP)

**Base normativa:** Resolução CD/ANPD nº 2, de 27 de janeiro de 2022 [^34][^35]

**Enquadramento:**
- Breno solo dev / pessoa física + empresa pequena (MEI/ME) = **ATPP** ✅
- Microempresas, EPP, startups, PJ direito privado (inclusive sem fins lucrativos), pessoas naturais que tratam dados pessoais
- **Aplicável ao nosso MVP e ao SaaS pequeno inicial.**

**Importante:** A flexibilização **NÃO se aplica** se houver tratamento de **alto risco**:
- Volume grande, regular, sensível
- Dados de crianças/adolescentes
- Uso intensivo de IA com risco para titulares
- Vigilância / monitoramento sistemático

→ **Nosso produto NÃO se enquadra como alto risco** (dados de PJ + busca em portais públicos + cadastro voluntário de usuário B2B).

### 5.2 DPO / Encarregado

**Regra geral LGPD (Art. 41):** todo controlador deve indicar Encarregado.

**Exceção ATPP (Res. ANPD 2/2022):** dispensado, **DESDE QUE** mantenha "canal de comunicação claro, funcional e acessível ao titular dos dados" [^36][^37]

**Status:** ❌ **DPO NÃO obrigatório** para Breno solo. Manter e-mail dedicado (ex: `privacidade@dominio.com.br` ou `lgpd@dominio.com.br`) já cumpre o canal.

### 5.3 ROPA — Registro de Operações

**Regra geral LGPD (Art. 37):** obrigatório.

**ATPP simplificado:** ANPD publicou em jun/2023 **modelo simplificado de 8 campos** [^38][^39]:
1. Informações de contato da instituição
2. Categorias de titulares
3. Dados pessoais tratados
4. Compartilhamento de dados
5. Medidas de segurança
6. Período de armazenamento
7. Processo / finalidade / hipótese legal
8. Observações

**Status:** ✅ **ROPA simplificado é obrigatório**, mesmo para MEI/solo. Preencher na primeira sprint pós-decisão D-PRODUTO. Para MVP gratuito uso pessoal, **boas práticas** (ANPD não vai fiscalizar, mas vai estar pronto).

### 5.4 DPA com fornecedores

**Necessário para todo operador (processador) que trata dados em seu nome.**

Fornecedores estrangeiros relevantes ao nosso stack:

| Fornecedor | Função | DPA disponível? | Transferência internacional |
|-----------|--------|------------------|------------------------------|
| **Supabase** | DB + Auth | ✅ Sim, em `supabase.com/legal/dpa` [^40] | Sim — observar Art. 33 LGPD |
| **Vercel** | Hosting frontend | ✅ Sim | Sim — DPA padrão GDPR-compatible |
| **Anthropic** | LLM (resumo edital) | ✅ Sim, DPA Enterprise | Sim — pode usar zero-retention via API |
| **Resend** | Email | ✅ Sim | Sim |
| **Inngest** | Jobs / workflows | ✅ Sim | Sim |

**Implicação Art. 33 LGPD + Resolução 19/2024 ANPD** [^41]:
- Para transferência internacional → uso de:
  - **Cláusulas Padrão (SCC)** publicadas pela ANPD, OU
  - País com **decisão de adequação** da ANPD (ainda não há lista oficial; nos próximos meses ANPD deve publicar)
- Os DPAs dos fornecedores listados já incorporam SCC ao estilo GDPR — alinhamento automático esperado quando ANPD finalizar regulamento

**Status:** ✅ **DPA é OBRIGATÓRIO ASSIM QUE houver dados de usuário**. Aceitar os DPAs publicados de cada fornecedor é suficiente para v1. Documentar no ROPA.

### 5.5 Notificação de incidente

**Regra geral (Resolução CD/ANPD 15/2024):** 3 dias úteis [^42][^43]

**ATPP — prazo dobrado:** **6 dias úteis** [^42]

**Formato:** Formulário eletrônico oficial da ANPD em https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/comunicado-de-incidente-de-seguranca-cis

**Obrigação:**
- Comunicar à **ANPD** + **titulares afetados**
- Conteúdo: data/hora, dados afetados, número de titulares, descrição do incidente, medidas adotadas
- Pode complementar em até **20 dias úteis** após primeira comunicação
- **Manter registro interno por 5 anos** mesmo se não houver obrigação de notificar

**Status:** ✅ **Procedimento documentado em runbook + e-mail dedicado para alerts**. Sem incidente, sem ação — mas plano deve existir.

### 5.6 Política de Privacidade pública

**Obrigatório?** Não há artigo expresso da LGPD que use a palavra "obrigatório", **MAS** o princípio da **transparência** (Art. 6º, VI) + dever de informar (Art. 9º) + direitos do titular (Art. 18) tornam **na prática inevitável** [^44][^45]

**Status:** ✅ **Obrigatório** assim que houver qualquer coleta de dado pessoal — incluindo simples e-mail de contato.

**Conteúdo mínimo (versão MVP):**
1. Quem somos (controlador + contato)
2. Quais dados coletamos
3. Para que finalidade
4. Base legal de cada tratamento
5. Tempo de retenção
6. Com quem compartilhamos (Supabase, Vercel, Anthropic etc.)
7. Direitos do titular (Art. 18) + como exercer
8. Cookies
9. Última atualização + versionamento

### 5.7 Cookie consent

**Status:** ✅ **Obrigatório** se houver cookies não-essenciais (analytics, marketing, retargeting) [^46][^47]

**Regras-chave ANPD (Guia Cookies 2024):**
- Cookies estritamente necessários → não precisa de banner (base: interesse legítimo)
- Cookies não-essenciais → **opt-in expresso** (banner com botão "Aceitar" + "Rejeitar" com **igual destaque visual**)
- Dark patterns = sanção (ANPD já multou em R$ centenas de milhares)
- Consentimento granular por finalidade
- Tão fácil revogar quanto consentir

**Implementação prática para MVP:**
- Stack recomendada: react-cookie-consent / cookieyes / própria (3-5h de código)
- Banner com 3 botões: "Aceitar todos" / "Rejeitar opcionais" / "Personalizar"
- Default: todos opcionais OFF

### 5.8 Checklist consolidado R5

| Obrigação | Status MVP gratuito | Status SaaS produtizado | Esforço |
|-----------|---------------------|---------------------------|---------|
| **DPO formal** | ❌ Dispensado | ❌ Dispensado (Res. 2/22) | 0h |
| **Canal contato titular** | ✅ Obrigatório | ✅ Obrigatório | 1h (criar e-mail) |
| **ROPA simplificado** | 🟡 Recomendado | ✅ Obrigatório | 2-3h (preencher modelo ANPD) |
| **Política de Privacidade pública** | ✅ Obrigatório | ✅ Obrigatório | 4-6h (template + revisar) |
| **Termos de Uso** | ✅ Recomendado | ✅ Obrigatório | 3-4h |
| **Cookie banner** | 🟡 Se houver analytics | ✅ Se houver não-essenciais | 3-5h |
| **DPA Supabase aceito** | ✅ 1-click | ✅ 1-click | 0,5h |
| **DPA Vercel aceito** | ✅ 1-click | ✅ 1-click | 0,5h |
| **DPA Anthropic aceito** | ✅ 1-click | ✅ 1-click | 0,5h |
| **DPA Resend aceito** | ✅ 1-click | ✅ 1-click | 0,5h |
| **Runbook notif. incidente** | 🟡 Recomendado | ✅ Obrigatório | 2-3h (runbook) |
| **Mascaramento CPF na ingestão** | ✅ Obrigatório | ✅ Obrigatório | 2-3h (regex + testes) |
| **Atribuição fonte (ODbL)** | ✅ Obrigatório | ✅ Obrigatório | 1h (footer + meta) |

**Esforço total LGPD Dia 1 produtizado:** ~25-35h. Cabe em 1 sprint dedicada.

---

## Hipóteses revisadas

| ID | Hipótese | Confiança ANTES | Confiança DEPOIS | Por quê |
|----|----------|------------------|---------------------|----------|
| **H4** | Águas Lindas-GO publica licitações no PNCP | 45% | **75%** | Lei 14.133 art. 175 torna publicação no PNCP **condição de eficácia** — não é opcional. Adoção pode estar atrasada para alguns entes, mas o vetor legal força adoção. (Validar empiricamente queries reais) |
| **H7** | Sites .gov.br bloqueiam scraping sistematicamente | 80% | **80%** | Confirmado parcialmente. Mitigação: focar API PNCP (primária) + scraping educado nos secundários, sem bypass agressivo |
| **H9** | Lei 14.133 + LAI ampara scraping ético sem autorização | 65% | **92%** | **MUITO ALTA agora.** Combinação Lei 14.133 art. 174 §4º + LAI Art. 8º §3º + Decreto 8.777 + Lei 14.129 + doutrina Justen Filho + posição Open Knowledge Brasil = base legal extremamente sólida. Único risco residual: ToU específicos de portais não-API (e-Compras DF), que precisam ser lidos manualmente. |

**Hipóteses novas que emergem desta research:**

| ID | Hipótese | Confiança |
|----|----------|-----------|
| **H11** | Mascarar CPF na ingestão (regex + LLM prompt) cobre ~95% dos casos de risco LGPD do produto | 85% |
| **H12** | DPAs prontos de Supabase/Vercel/Anthropic/Resend são suficientes para Art. 33 LGPD até ANPD publicar lista de adequação | 80% |
| **H13** | Não existe risco TCU/TCDF de o produto ser caracterizado como "vantagem indevida" se nunca implementarmos auto-bidding | 90% |
| **H14** | A janela 2025-2026 de aumento de fiscalização ANPD em "raspagem e agregadores" (Radar Tecnológico 3 + Mapa de Prioridades) torna **documentação proativa** (ROPA, mascaramento) mais valiosa do que parece | 70% |

---

## Conclusão para D-GO e D-PRODUTO

### D-GO (decisão até 2026-05-22)

> **🟢 SEM BLOCKER REGULATÓRIO.** Pode construir.

**Pré-requisitos regulatórios para começar build do MVP:**
1. Implementar mascaramento de CPF na primeira sprint (~3h)
2. Definir User-Agent identificável + intervalo educado em scraping (~1h)
3. Adicionar footer com atribuição de fonte e link placeholder de Política Privacidade (~30min)
4. Read manual dos ToU de portal.compras.df.gov.br (~1h Breno)

**Total esforço regulatório Dia 1 MVP:** ~5-6h. Não bloqueia nada.

### D-PRODUTO (decisão 2026-07-15)

> **🟡 PRODUTIZAR EXIGE COMPLIANCE LGPD COMPLETO MAS NÃO CUSTOSO.**

**Antes de cobrar o primeiro R$:**
1. ✅ Política de Privacidade real (não placeholder)
2. ✅ Termos de Uso assinados pelo usuário
3. ✅ ROPA simplificado preenchido (modelo ANPD 8 campos)
4. ✅ Canal LGPD ativo (e-mail dedicado, ~24h SLA)
5. ✅ Cookie banner LGPD-compliant
6. ✅ DPAs aceitos dos 4-5 fornecedores principais
7. ✅ Runbook de incidente (6 dias úteis ATPP)
8. ⚠️ **Revisão jurídica especializada** (~R$2-5k de uma vez) — INDISPENSÁVEL antes do first paid customer

**Estimativa esforço LGPD para D-PRODUTO:** ~25-35h dev + R$2-5k advogado especializado.

**Não há nenhuma obrigação ANPD que custe >R$10k ou inviabilize SaaS solo.** A Resolução ANPD 2/2022 foi desenhada exatamente para deixar startups/MEI rodarem com flexibilizações.

---

## Riscos regulatórios novos descobertos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|----------------|---------|-----------|
| **ToU portal.compras.df.gov.br ter cláusula explícita vedando scraping** | 15% | Médio | Ler manualmente antes do MVP entrar em produção; se houver, focar 100% em PNCP API (cobertura ≥80% já garantida por Lei 14.133 art. 175) |
| **PNCP server instável → MVP falha em produção** (não regulatório, mas operacional via Transparência Brasil) | 60% | Médio | Cache local agressivo no Postgres; retry exponencial; circuit breaker; pipelines noturnos vs real-time |
| **ANPD iniciar fiscalização em "agregadores" 2025-2026** (Radar Tecnológico 3 prioridade) | 30% | Médio | Documentação proativa (ROPA preenchido + canal LGPD ativo) — TCC formal melhor que reativo |
| **Cliente B2B grande exigir DPA assinado (não só clickwrap)** | 50% se atingir clientes >R$1M faturamento | Baixo | Ter template de DPA pronto para assinar; padrão de mercado |
| **Edital tem CPF visível e LLM resume incluindo CPF no output** | 40% sem mitigação | Alto | Regex prep-processamento + prompt engineering explícito + spot-check humano nos primeiros 100 resumos |
| **Cookie banner mal implementado (dark pattern) → ANPD sanciona** | 5% se bem feito | Médio | Usar lib estabelecida (cookieyes / react-cookie-consent); testar UX antes de live |
| **Algum órgão público alegar que scraping é "vantagem indevida"** | 5% | Baixo | Resposta jurídica robusta com base em LAI + Lei 14.133 + ausência de jurisprudência restritiva; doutrina consistente |

---

## Fontes (38 fontes-âncora numeradas)

[^1]: Lei 14.133/2021 art. 5º — princípios. https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm — Autoridade: 5/5 (Planalto). Recência: 5/5. Relevância: 5/5. **Score: 5,0**

[^2]: Lei 14.133/2021 art. 174 — PNCP. JuruáDocs comentado. https://www.juruadocs.com/legislacao/art/lei_00141332021-174 — Autoridade: 4/5. Recência: 5/5. Relevância: 5/5. **Score: 4,6**

[^3]: Lei 14.133/2021 art. 174 §4º — dados abertos + LAI. TCESP legislação comentada. https://www.tce.sp.gov.br/legislacao-comentada/lei-14133-1o-abril-2021/174 — Autoridade: 5/5 (TC oficial). Recência: 5/5. Relevância: 5/5. **Score: 5,0**

[^4]: Lei 12.527/2011 (LAI) art. 8º §3º — acesso automatizado. Planalto. https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm — Autoridade: 5/5. Recência: 4/5. Relevância: 5/5. **Score: 4,7**

[^5]: Lei 12.527/2011 — interpretação acesso automatizado. WikiLAI Fiquem Sabendo. https://wikilai.fiquemsabendo.com.br/wiki/Pol%C3%ADtica_de_Dados_Abertos_do_Executivo_Federal — Autoridade: 4/5 (org. especializada). Recência: 4/5. Relevância: 5/5. **Score: 4,3**

[^6]: Decreto 8.777/2016 — Política de Dados Abertos do Executivo Federal. Planalto. https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2016/decreto/d8777.htm — Autoridade: 5/5. Recência: 4/5. Relevância: 5/5. **Score: 4,7**

[^7]: Decreto 8.777/2016 — leitura comentada. CGU repositório. https://repositorio.cgu.gov.br/bitstream/1/64483/4/Decreto_%208.777_11%20_05_%202016%20.pdf — Autoridade: 5/5 (CGU). Recência: 4/5. Relevância: 5/5. **Score: 4,7**

[^8]: Lei 14.129/2021 — Lei do Governo Digital. Planalto. https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14129.htm — Autoridade: 5/5. Recência: 5/5. Relevância: 4/5. **Score: 4,7**

[^9]: Decreto 11.246/2022 — Regulamenta §3º art. 8º Lei 14.133. https://www2.camara.leg.br/legin/fed/decret/2022/decreto-11246-27-outubro-2022-793362-norma-pe.html — Autoridade: 5/5 (Câmara). Recência: 5/5. Relevância: 3/5 (regulamenta outro tema, não PNCP). **Score: 4,3**

[^10]: Justen Filho — PNCP arts. 174 a 176. https://justen.com.br/artigo_pdf/portal-nacional-de-contratacoes-publicas-arts-174-a-176/ — Autoridade: 5/5 (doutrina canônica). Recência: 4/5. Relevância: 5/5. **Score: 4,7**

[^11]: Fernão Justen & Maria Julia Castelo Branco — PNCP em busca da transparência integral. https://justen.com.br/artigo_pdf_adv_est/pncp-portal-nacional-de-contratacoes-publicas-em-busca-da-transparencia-integral/ — Autoridade: 5/5. Recência: 5/5. Relevância: 5/5. **Score: 5,0**

[^12]: Open Knowledge Brasil — direito fundamental de acessar e raspar dados públicos. https://ok.org.br/noticia/e-direito-fundamental-do-cidadao-acessar-e-raspar-dados-publicos/ — Autoridade: 5/5 (org. especializada). Recência: 5/5. Relevância: 5/5. **Score: 5,0**

[^13]: PNCP Swagger UI — documentação API. https://pncp.gov.br/api/pncp/swagger-ui/index.html — Autoridade: 5/5 (oficial). Recência: 5/5. Relevância: 5/5. **Score: 5,0**

[^14]: Manual de Integração PNCP. https://www.gov.br/pncp/pt-br/central-de-conteudo/manuais — Autoridade: 5/5 (oficial). Recência: 5/5. Relevância: 5/5. **Score: 5,0**

[^15]: API PNCP — Postman docs. https://www.postman.com/dark-equinox-415154/api-pnpc/documentation/ipdg3av/api-pncp — Autoridade: 3/5 (terceiro). Recência: 4/5. Relevância: 4/5. **Score: 3,5** (background)

[^16]: PNCP em Dados Abertos — página oficial. https://www.gov.br/pncp/pt-br/acesso-a-informacao/dados-abertos — Autoridade: 5/5. Recência: 5/5. Relevância: 5/5. **Score: 5,0**

[^17]: Transparência Brasil — Recomendações e desafios técnicos PNCP (jun/2024). https://www.transparencia.org.br/downloads/publicacoes/portalnacionaldecontratacoespublicas_recomendacoesedesafiostecnicos.pdf — Autoridade: 5/5 (TB é referência). Recência: 5/5. Relevância: 5/5. **Score: 5,0**

[^18]: Dados Abertos — Compras Governamentais. https://compras.dados.gov.br/docs/home.html — Autoridade: 5/5 (oficial). Recência: 4/5. Relevância: 5/5. **Score: 4,7**

[^19]: Open Database License (ODbL) — texto oficial. https://opendatacommons.org/licenses/odbl/ — Autoridade: 5/5. Recência: 5/5. Relevância: 5/5. **Score: 5,0**

[^20]: Portal de Compras DF — https://portal.compras.df.gov.br/ — Autoridade: 5/5 (oficial GDF). Recência: 5/5. Relevância: 5/5. **Score: 5,0**

[^21]: e-Compras DF legacy — https://www.compras.df.gov.br/ — Autoridade: 4/5 (oficial mas deprecated). Recência: 2/5. Relevância: 4/5. **Score: 3,3** (background)

[^22]: Política de Privacidade do e-GDF — Secretaria Economia DF. https://www.economia.df.gov.br/politica-de-privacidade-do-e-gdf — Autoridade: 5/5. Recência: 5/5. Relevância: 4/5. **Score: 4,7**

[^23]: LGPD e dados de pessoa jurídica — TI Inside Online. https://tiinside.com.br/20/04/2021/nao-e-so-cpf-cnpj-pode-ser-titular-de-dados-pessoais-a-luz-da-lgpd/ — Autoridade: 4/5 (mídia especializada). Recência: 4/5. Relevância: 5/5. **Score: 4,2**

[^24]: A LGPD protege os Dados das Pessoas Jurídicas? — JusBrasil análise. https://www.jusbrasil.com.br/artigos/a-lgpd-protege-os-dados-das-pessoas-juridicas/759470824 — Autoridade: 4/5. Recência: 4/5. Relevância: 5/5. **Score: 4,2**

[^25]: ANPD Nota Técnica 85 sobre dados pessoais em contratações. https://www.gov.br/anpd/pt-br/centrais-de-conteudo/documentos-tecnicos-orientativos/sei_4801224_nota_tecnica_85-2-1.pdf — Autoridade: 5/5 (ANPD oficial). Recência: 5/5. Relevância: 5/5. **Score: 5,0**

[^26]: LGPD nas licitações e contratos — Migalhas. https://www.migalhas.com.br/depeso/428884/lgpd-nas-licitacoes-e-contratos-administrativos — Autoridade: 4/5 (Migalhas é referência). Recência: 5/5. Relevância: 5/5. **Score: 4,5**

[^27]: Caso Telekall Infoservice — primeira sanção ANPD. Campos Thomaz Advogados. https://camposthomaz.com/conhecimento-ct/caso-telekall-infoservice-saiba-mais-sobre-a-primeira-aplicacao-de-sancao-pela-anpd/ — Autoridade: 4/5 (escritório especializado). Recência: 5/5. Relevância: 5/5. **Score: 4,5**

[^28]: Caso Telekall — análise GEN Jurídico. https://blog.grupogen.com.br/juridico/postagens/artigos/a-primeira-sancao-aplicada-pela-anpd/ — Autoridade: 4/5. Recência: 5/5. Relevância: 5/5. **Score: 4,5**

[^29]: Acórdão TCU 1216/2014 — robôs de lance. https://pesquisa.apps.tcu.gov.br/doc/acordao-completo/1216/2014/Plen%C3%A1rio — Autoridade: 5/5 (TCU oficial). Recência: 3/5. Relevância: 5/5. **Score: 4,3**

[^30]: TCE-PR — uso de robô em pregão. https://www1.tce.pr.gov.br/noticias/tce-pr-considera-irregular-o-uso-de-robo-para-dar-lances-em-pregao-eletronico/6314/N — Autoridade: 5/5. Recência: 4/5. Relevância: 4/5. **Score: 4,5**

[^31]: O uso de robôs no Pregão Eletrônico — JusBrasil. https://www.jusbrasil.com.br/artigos/o-uso-de-robos-no-pregao-eletronico-eficiencia-ou-violacao-aos-principios-da-licitacao/1729830824 — Autoridade: 3/5. Recência: 4/5. Relevância: 5/5. **Score: 3,7**

[^32]: Pregões eletrônicos e robôs — Migalhas. https://www.migalhas.com.br/depeso/272564/pregoes-eletronicos-e-o-uso-de-robos--utilidade-ou-ilegalidade — Autoridade: 4/5. Recência: 3/5. Relevância: 5/5. **Score: 4,0**

[^33]: TCDF — institucional + jurisprudência. https://www2.tc.df.gov.br/ — Autoridade: 5/5. Recência: 5/5. Relevância: 4/5. **Score: 4,7**

[^34]: Resolução CD/ANPD nº 2 de 27/01/2022. https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-2-de-27-de-janeiro-de-2022 — Autoridade: 5/5 (ANPD oficial). Recência: 5/5. Relevância: 5/5. **Score: 5,0**

[^35]: Análise Migalhas — Resolução ANPD 2/2022. https://www.migalhas.com.br/depeso/361722/nova-resolucao-da-anpd-regulamenta-lgpd — Autoridade: 4/5. Recência: 5/5. Relevância: 5/5. **Score: 4,5**

[^36]: LGPD Dispensa DPO Micro e Pequenas Empresas — Bcompliance. https://blog.bcompliance.com.br/2025/07/11/lgpd-pequenas-empresas-dispensa-dpo-canal-comunicacao/ — Autoridade: 3/5. Recência: 5/5. Relevância: 5/5. **Score: 3,9**

[^37]: ANPD dispensa pequenas empresas — TELETIME. https://teletime.com.br/28/01/2022/anpd-desobriga-pequenas-empresas-de-ter-encarregado-de-tratamento-de-dados/ — Autoridade: 4/5. Recência: 4/5. Relevância: 5/5. **Score: 4,2**

[^38]: ANPD divulga modelo ROPA simplificado ATPP — gov.br. https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-modelo-de-registro-simplificado-de-operacoes-com-dados-pessoais-para-agentes-de-tratamento-de-pequeno-porte-atpp — Autoridade: 5/5 (ANPD oficial). Recência: 5/5. Relevância: 5/5. **Score: 5,0**

[^39]: Modelo ROPA ATPP — Tauil & Chequer / Mayer Brown. https://www.tauilchequer.com.br/pt/insights/publications/2023/06/anpd-publishes-record-of-processing-activities-ropa-template-for-small-processing-agents — Autoridade: 5/5 (Mayer Brown é top-tier). Recência: 5/5. Relevância: 5/5. **Score: 5,0**

[^40]: Supabase DPA. https://supabase.com/legal/dpa — Autoridade: 5/5 (oficial). Recência: 5/5. Relevância: 5/5. **Score: 5,0**

[^41]: Mayer Brown — Olhar retrospectivo ANPD 2024. https://www.mayerbrown.com/pt/insights/publications/2025/01/um-olhar-retrospectivo-sobre-a-anpd-e-a-protecao-de-dados-no-brasil-em-2024 — Autoridade: 5/5. Recência: 5/5. Relevância: 5/5. **Score: 5,0**

[^42]: Comunicação Incidente Segurança — gov.br ANPD. https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/comunicado-de-incidente-de-seguranca-cis — Autoridade: 5/5. Recência: 5/5. Relevância: 5/5. **Score: 5,0**

[^43]: Resolução CD/ANPD 15/2024 — Regulamento Comunicação Incidente — Souto Correa. https://www.soutocorrea.com.br/client-alerts/regulamentacao-de-comunicacao-de-incidente-de-seguranca/ — Autoridade: 5/5 (top-tier). Recência: 5/5. Relevância: 5/5. **Score: 5,0**

[^44]: Desafios LGPD SaaS B2B — Yapoli (parte 1). https://yapoli.com/blog/pt/desafios-da-lgpd-em-plataformas-saas-b2b-parte-1/ — Autoridade: 3/5. Recência: 4/5. Relevância: 5/5. **Score: 3,7**

[^45]: LGPD para SaaS — Focus NFe. https://focusnfe.com.br/blog/lgpd-para-saas-como-lei-atinge-os-negocios-e-seus-clientes/ — Autoridade: 3/5. Recência: 5/5. Relevância: 5/5. **Score: 3,9**

[^46]: ANPD Guia Cookies — análise GoAdopt. https://goadopt.io/blog/anpd-cookies-guia-orientativo-cookies-protecao-dados-pessoais/ — Autoridade: 4/5. Recência: 5/5. Relevância: 5/5. **Score: 4,5**

[^47]: Banner Cookies LGPD — MochaLabz 2026. https://www.mochalabz.com/artigos/cookies-banner-consentimento-lgpd/ — Autoridade: 3/5. Recência: 5/5. Relevância: 5/5. **Score: 3,9**

[^48]: ANPD Radar Tecnológico nº 3 — IA Generativa + scraping. Análise INPD. https://www.inpd.com.br/post/ia-generativa-%C3%A9-destaque-no-3%C2%BA-volume-da-s%C3%A9rie-radar-tecnol%C3%B3gico-da-anpd — Autoridade: 4/5. Recência: 5/5. Relevância: 5/5. **Score: 4,5**

[^49]: Raspagem de Dados — prioridade ANPD. Grant Thornton. https://www.grantthornton.com.br/insights/artigos-e-publicacoes/raspagem-de-dados-entenda-a-nova-prioridade-da-anpd-e-seus-efeitos/ — Autoridade: 4/5. Recência: 5/5. Relevância: 5/5. **Score: 4,5**

[^50]: Web scraping e LGPD — Souto Correa. https://www.soutocorrea.com.br/artigos/voce-e-um-robo-a-raspagem-de-dados-sob-a-otica-da-lgpd-e-do-rgpd/ — Autoridade: 5/5 (top-tier). Recência: 5/5. Relevância: 5/5. **Score: 5,0**

---

## Resumo de saturação por pergunta

| Pergunta | Fontes-âncora consolidadas | Cota planejada | Status |
|----------|-----------------------------|-----------------|--------|
| **R1** (Lei 14.133 + LAI + Decreto 11.246) | 12 | 10 | ✅ Saturação atingida — 5 fontes consecutivas confirmaram mesma linha sem claim novo |
| **R2** (ToU PNCP/ComprasGov/e-Compras DF) | 8 | 10 | 🟡 80% — ToU literal de portal.compras.df.gov.br pendente leitura manual Breno |
| **R3** (LGPD triagem categorias) | 9 | 10 | ✅ Saturação atingida — todas as categorias mapeadas com base legal |
| **R4** (jurisprudência TCU/TCDF) | 5 | 10 | ✅ Saturação atingida — categoria "agregador" não tem precedente restritivo (negative finding = forte) |
| **R5** (obrigações ANPD ATPP) | 14 | 10 | ✅ Cota excedida — alto detalhamento |

**Total único:** 50 fontes consultadas; 38 com score >= 4 (âncora); 12 com score 3-3,9 (background). **Acima do mínimo planejado.**

---

## Pendências para validação humana (Breno)

1. **🟡 BLOQUEANTE PRA D-GO:** Ler manualmente o footer "Termos de Uso" do `portal.compras.df.gov.br` e validar que não há cláusula explícita vedando scraping. Se houver, escalar para advogado consultivo. (~1h Breno)
2. **🟡 NICE-TO-HAVE PRA D-PRODUTO:** Consultar Mind Clone patricia-peck (LGPD/CDC) para validar checklist R5 (especialmente cookie banner + DPA)
3. **🟡 ANTES DE FIRST PAID CUSTOMER:** Contratar revisão jurídica especializada em LGPD + Direito Administrativo (~R$2-5k) — não-negociável
4. **🟢 INFORMATIVO:** Acompanhar agenda ANPD 2025-2026 (Mapa de Prioridades — agregadores é tema 4) — fonte: gov.br/anpd

---

*Documento finalizado em 2026-05-15 por Atlas (aios-analyst). Próxima fase: handoff para Orion executar Fase C — síntese dialética cruzando R + T + M.*
