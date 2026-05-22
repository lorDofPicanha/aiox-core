# Scoring detalhado por tipo de fonte

O scoring genérico (autoridade × recência × relevância) é o ponto de partida. Cada tipo de fonte tem sinais de qualidade específicos que afinam a avaliação.

## Papers acadêmicos

### Sinais positivos
- Peer-review em venue com fator de impacto relevante para o campo (não cruze campos — Nature vs venue de nicho não comparam)
- Citações/ano (ajustado pela idade do paper) acima da mediana do campo
- Pré-registro do estudo em OSF, AsPredicted, ou registro clínico (especialmente em psicologia/saúde)
- Dados e código abertos, com replicação ou link para repositório funcional
- Tamanho amostral adequado, com poder estatístico declarado e justificado
- Análise estatística pré-especificada
- Múltiplos autores estabelecidos no campo (não single-author de pessoa desconhecida)
- Conflitos de interesse declarados explicitamente
- Múltiplas replicações independentes existem e convergem

### Sinais negativos
- Venue predatório (cheque Beall's List ou DOAJ para verificar)
- Cluster de p-values logo abaixo de 0.05 (p-hacking)
- Tamanho amostral pequeno para efeito reportado
- Análise post-hoc disfarçada de pré-especificada
- Financiamento por parte interessada no resultado, sem declaração ou com declaração mas sem mitigação metodológica
- Autor isolado, sem trabalho subsequente publicado no tema
- Citação zero ou em queda anos após publicação em campo ativo
- Resultados extraordinários sem replicação

### Score sugerido
- Meta-análise Cochrane recente: 5/5 em autoridade
- RCT grande peer-reviewed em top venue, com replicação: 5/5
- RCT isolado em venue mediano: 3/5
- Estudo observacional grande, peer-reviewed: 3/5
- Preprint (arXiv, bioRxiv) sem peer-review ainda: 2/5 (mas considere recência alta em campos rápidos)
- Paper em venue predatório: 0/5 (descartar)

## Repositórios GitHub

### Sinais positivos
- Forks ativos com commits (mais relevante que stars)
- Commits regulares nos últimos 90 dias
- Issues respondidas em mediana < 7 dias
- PRs mergeados nos últimos 60 dias, com revisão visível
- Mais de 5 contributors únicos no último ano
- CI verde consistente em commits recentes
- Cobertura de testes presente
- Releases versionadas com changelog significativo
- Documentação que reflete o estado real do código
- Licença compatível com seu uso pretendido
- Ausência de "looking for maintainer" no README

### Sinais negativos
- Último commit > 6 meses (morto ou estagnado)
- Issues abertas crescendo monotonicamente sem resposta
- Um único maintainer respondendo, com sinais de burnout em comentários
- Stars cresceram em pico curto (provável astroturfing — Reddit/HN viral)
- Documentação contradiz comportamento observado em código
- Sem testes ou CI
- Dependências obsoletas/quebradas
- Histórico de quebras incompatíveis sem migração

### Score sugerido
- Projeto OSS maduro com governança (Apache, Linux Foundation, CNCF): 5/5
- Projeto vendor-backed estável (lançado por empresa grande, mantido): 4–5/5
- Projeto comunitário ativo com múltiplos maintainers: 4/5
- Projeto promissor mas one-man-show: 2–3/5
- Projeto estagnado ou abandonado: 0–1/5

## Blogs técnicos e posts

### Sinais positivos
- Autor com track record verificável (papers, talks, código em produção, role sênior demonstrável)
- Benchmarks reproduzíveis com código publicado
- Discussão honesta de limitações e edge cases
- Comentários técnicos de qualidade na thread (sinal de leitura por pares competentes)
- Atualizações posteriores quando o autor descobre erro próprio (transparência)
- Não é claramente marketing disfarçado de educacional

### Sinais negativos
- Autor sem background verificável
- "Best of" sem critério de comparação
- Benchmarks sem código ou condições de execução
- Apenas elogios para uma tecnologia (revisão honesta sempre identifica limitações)
- Padrão claro de marketing (chamada para ação no fim, vendor mencionado constantemente)
- Datado e nunca atualizado em campo que mudou

### Score sugerido
- Post de engenheiro reconhecido com benchmark reproduzível: 4/5
- Post de blog corporativo de empresa engenheirística séria (Stripe, Cloudflare, Discord, etc.): 3–4/5
- Post de pessoa desconhecida com argumentação sólida: 2–3/5
- Post claramente promocional: 0–1/5

## Relatórios de mercado

### Sinais positivos
- Metodologia disclosed (amostra, método de coleta, período, geografia)
- Período de coleta recente
- Conflito de interesse declarado (especialmente se patrocinado)
- Escopo geográfico explícito
- Definições operacionais claras (o que conta como "usuário ativo", "vendido", etc.)
- Casa de pesquisa reconhecida (Gartner, IDC, Forrester, Frost & Sullivan, McKinsey, BCG)

### Sinais negativos
- Sem metodologia disclosed
- Patrocinado por vendor que aparece bem no relatório, sem mitigação metodológica
- Definições vagas ou ausentes
- Datas ausentes ou periodicidade pouco clara
- "Relatório" que é peça de venda de assinatura

### Score sugerido
- Cochrane Review, relatório regulatório oficial, dados de banco central: 5/5
- Relatório Gartner/IDC com metodologia: 4/5
- Relatório setorial de consultoria média, com metodologia: 3/5
- Relatório patrocinado mas com metodologia: 2/5
- "Estado de X" patrocinado sem metodologia: 0–1/5

## Reviews de usuário

Para análise competitiva, reviews são minas de Voice of Customer.

### Como ler
- **Distribuição da nota** — curva em U (muitos 5★ e muitos 1★) é mais honesta que tudo 5★ ou tudo 3★. Tudo 5★ é suspeito de manipulação.
- **Volume** — produto novo com 50 reviews é diferente de produto maduro com 5.000
- **Recência** — reviews dos últimos 6 meses pesam mais (produto pode ter mudado)
- **Linguagem** — reviews 5★ idênticas em estrutura sugerem manipulação
- **Reviews 1–2★** — onde a dor real está. Leia todas se forem menos de 50; amostra ampla se for mais.
- **Padrões reincidentes** — mesma reclamação aparecendo dezenas de vezes é sinal forte

### Plataformas por contexto
- B2C consumer apps: App Store, Google Play
- B2B SaaS: G2, Capterra, TrustRadius
- Serviços: Trustpilot, Reclame Aqui (BR)
- E-commerce: review da página + sites de reclamação
- Geral: Reddit (busca específica do produto), Twitter/X

### Score sugerido
- Dataset grande, recente, com distribuição U-shape e padrões claros: 4/5 como evidência de Voice of Customer
- Dataset pequeno ou enviesado: 2/5
- Reviews claramente manipuladas: 0/5

## Vídeos, podcasts, entrevistas

### Sinais positivos
- Entrevistado é figura-chave (founder, CTO, autor relevante)
- Entrevistador competente que faz perguntas difíceis
- Conteúdo substantivo, não promocional
- Datado e contextualizado

### Sinais negativos
- Entrevista que vira pitch sem oposição
- Entrevistado é pessoa de marketing, não quem efetivamente fez o trabalho
- Conteúdo muito antigo em campo que mudou

### Como usar
Vídeos/podcasts são mais úteis para **contexto e narrativa** do que para evidência decisória. Extraia citações, datas, sequência de eventos. Não baseie decisão em uma fala sem confirmar com fonte escrita.

### Score sugerido
- Entrevista substantiva com figura-chave: 3/5
- Talk em conferência técnica com revisão por pares: 4/5
- Podcast promocional: 1/5

## Documentação oficial

### Sinais positivos
- Atualizada com a versão atual do produto
- Cobre edge cases e limitações
- Versão histórica acessível
- Exemplos funcionais
- Cross-references coerentes

### Sinais negativos
- Documentação contradiz comportamento real (testar quando possível)
- Apenas happy path documentado
- Sem changelog ou versionamento
- Vaga em tópicos sensíveis (performance, limites, custos)

### Score sugerido
- Documentação oficial completa e atualizada: 5/5 para perguntas sobre uso pretendido
- Documentação oficial mas vaga em pontos críticos: 3/5 (suplementar com código-fonte ou benchmarks externos)

## Princípios universais

### Independência
Três blogs citando o mesmo paper original = uma fonte, não três. Para triangulação verdadeira, exigir cadeias de evidência independentes.

### Recência por campo
- Tech/IA: < 12 meses é fresco; > 24 meses pode estar obsoleto
- Ciência básica: > 5 anos ainda pode ser válido
- Regulatório: depende da norma; cheque se há atualizações
- Mercado: < 6 meses para sizing/competição; > 12 meses arriscado

### Conflito de interesse
Sempre considerar. Não desqualifica automaticamente — pesquisa patrocinada pode ser excelente — mas exige escrutínio metodológico maior.

### Verificação de fonte primária
Quando uma claim importante aparece, rastreie até a fonte original. Quantas vezes você verá um número repetido em 20 lugares que rastreia a um único estudo de 2014 com n=30.
