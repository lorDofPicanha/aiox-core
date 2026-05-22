# Dimensão Científico-Evidencial

Quando aplicar: sempre que houver claim de eficácia, performance medida com pretensão científica, ou base de pesquisa acadêmica relevante. Tipicamente: saúde, educação, nutrição, performance esportiva/cognitiva, intervenções comportamentais, finanças quantitativas, ciências aplicadas.

## Hierarquia de evidência

Não toda evidência tem o mesmo peso. A pirâmide canônica (adaptada do Oxford CEBM):

1. **Meta-análises e revisões sistemáticas** de estudos controlados (peso máximo)
2. **Ensaios controlados randomizados (RCTs)** individuais bem desenhados
3. **Estudos de coorte prospectivos**
4. **Estudos caso-controle e transversais**
5. **Séries de casos**
6. **Opinião de especialista, mecanismo teórico, raciocínio fisiopatológico** (peso mínimo)

Adapte por campo:
- **Medicina/saúde:** seguir a hierarquia direta. Cochrane Library é referência para meta-análises.
- **Educação:** acrescentar What Works Clearinghouse, EEF (UK); RCTs educacionais são caros e menos comuns.
- **Psicologia/comportamento:** atentar para crise de replicabilidade. Estudos pré-registrados pesam mais que retrospectivos.
- **Economia/finanças:** atentar para look-ahead bias, survivorship bias, p-hacking em backtests.
- **Ciências aplicadas:** publicações de revistas top com fator de impacto + replicação independente.

## Fontes primárias por campo

### Saúde/medicina
- PubMed (MEDLINE) — busca primária
- Cochrane Library — meta-análises
- ClinicalTrials.gov — estudos em andamento
- BMJ, NEJM, JAMA, Lancet — revistas top
- UpToDate (acesso pago, mas referência clínica)

### Psicologia/saúde mental
- PsycINFO, PubMed
- JMIR Mental Health (digital interventions)
- Clinical Psychology Review
- Journal of Consulting and Clinical Psychology
- Pré-registros em OSF (Open Science Framework)

### Educação
- ERIC (Education Resources Information Center)
- What Works Clearinghouse
- EEF Toolkit (Education Endowment Foundation)
- AERA journals

### Computação/IA
- arXiv (cs.LG, cs.CL, cs.CV, etc.)
- Proceedings de NeurIPS, ICML, ICLR, ACL, EMNLP, CVPR
- ACL Anthology (NLP especificamente)
- Papers With Code (acompanha SOTA por benchmark)

### Economia/finanças
- NBER Working Papers
- SSRN (Social Science Research Network)
- AER, JF, RFS, JFE (revistas top)
- Federal Reserve Economic Data (FRED)

### Outras ciências
- Web of Science, Scopus — bases agregadas
- Google Scholar — útil como busca inicial, mas resultados precisam de validação manual

## Sinais de qualidade em papers

### Sinais positivos
- Peer-review em venue de fator de impacto relevante para o campo
- Pré-registro do estudo (especialmente em psicologia/saúde)
- Dados e código disponíveis (reprodutibilidade)
- Tamanho amostral adequado, com poder estatístico declarado
- Análise estatística pré-especificada, não pescada
- Conflitos de interesse declarados explicitamente
- Citações ajustadas por ano (citações/ano alto sustenta relevância)
- Replicações independentes existem e confirmam

### Bandeiras vermelhas
- **Venue predatório.** Cheque Beall's List, ou verifique se a revista exige peer-review real.
- **p = 0.04* discreto.** Cluster de p-values logo abaixo de 0.05 sugere p-hacking.
- **Tamanho amostral pequeno** para o efeito reportado. Efeitos grandes com n=30 são frequentemente irreplicáveis.
- **Conflito de interesse não declarado** mas detectável (financiamento da indústria interessada no resultado).
- **Análise post-hoc disfarçada de a priori.** Comum em estudos negativos transformados em positivos por subgrupo.
- **Citação zero ou em queda** anos após publicação em campo ativo.
- **Autor isolado** sem trabalho subsequente no tema.

## Princípio crítico: não misturar evidências de domínios distintos

Esta é a falha mais comum em research evidencial.

**Exemplo:**
- Evidência forte: "CBT digital guiado por terapeuta humano tem eficácia comparável a CBT presencial em depressão moderada"
- Tentação inválida: extrapolar para "CBT digital autônoma por chatbot tem eficácia comparável a CBT presencial"

São corpos de evidência **diferentes**. O segundo é literatura emergente, com muito menos peso, muitas vezes com resultados modestos. Somá-los infla artificialmente a base.

**Regra:** ao consolidar evidência para uma claim, todas as fontes devem ter sido geradas no mesmo formato/contexto que você pretende aplicar. Quando houver salto de domínio, **declare explicitamente** e desconte o peso da evidência.

## Crise de replicabilidade

Em psicologia, ciências sociais, partes da medicina e biomedicina, estimativas conservadoras sugerem que 40–60% dos achados publicados não replicam. Isso significa:

- Um RCT isolado é provisório até replicação independente
- Estudos em camundongos raramente transferem para humanos
- Efeitos pequenos em amostras pequenas merecem ceticismo
- Resultados "surpreendentes" merecem mais ceticismo, não menos
- Pré-registros são muito mais confiáveis que análises retrospectivas

Quando consolidar evidência, distinguir explicitamente:
- **Bem estabelecido:** múltiplas meta-análises convergentes ao longo de 10+ anos
- **Provável:** RCTs grandes recentes com replicação parcial
- **Provisório:** RCT isolado ou estudos pequenos
- **Especulativo:** apenas estudos observacionais, mecanismos teóricos, ou opinião

Não trate "especulativo" como base de decisão importante.

## Tradução de evidência para recomendação

Evidência em paper raramente é diretamente acionável. Faça a ponte:

1. **População do estudo vs sua população real:** características que diferem podem invalidar a transferência
2. **Contexto do estudo vs contexto de uso:** ambiente clínico vs uso doméstico, supervisão vs autonomia
3. **Duração do estudo vs duração de uso real:** efeitos de 8 semanas podem não sustentar em 12 meses
4. **Aderência do estudo vs aderência esperada:** estudos selecionam aderentes; produto real pega todo mundo
5. **Outcome do estudo vs outcome que importa para você:** redução de sintoma ≠ qualidade de vida ≠ retenção em produto

A recomendação final tem que internalizar essas pontes ou registrar explicitamente onde elas são frouxas.

## Output esperado desta dimensão

Para cada pergunta-mestre científica:

1. Estado da evidência classificado pela hierarquia (qual nível sustenta cada claim)
2. Distinção explícita entre bem estabelecido, provável, provisório, especulativo
3. Limitações da transferência da evidência para o contexto de uso
4. Recomendação calibrada pelo peso real da evidência
5. Riscos científicos identificados (claims sem suporte adequado)
6. Lista de unknowns que precisam de validação empírica própria
