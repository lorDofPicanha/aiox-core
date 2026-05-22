# Dimensão Regulatório-Legal

Quando aplicar: sempre que o domínio for regulado (saúde, finanças, dados pessoais, infantil, alimentos, transporte, telecom, energia, defesa, educação formal), houver expansão geográfica (cada jurisdição muda regras), ou houver claim sujeito a verificação por autoridade (publicidade, etiquetas, certificações).

## Princípio: regulatório é dimensão técnica, não obstáculo

Regulação não é "obstáculo a ser contornado" — é parametrização de design. Tratada cedo, ela informa arquitetura, GTM, pricing, retenção de dados, fluxos de consentimento. Tratada tarde, vira retrabalho ou risco existencial.

A descoberta de que um produto cai em categoria regulatória inesperada (dispositivo médico, instituição financeira, operador de telecom) tipicamente força redesign completo. Por isso a dimensão regulatória, quando aplicável, **tem prioridade máxima** e deve ser resolvida cedo na coleta.

## Pergunta binária fundadora

Toda research regulatória começa com uma pergunta de enquadramento:

**O produto/serviço/processo na forma planejada cai sob qual jurisdição e qual classificação regulatória?**

Variantes típicas:
- É dispositivo médico (e de que classe)?
- É instituição financeira (e de que tipo)?
- Trata dados sensíveis (e sob qual base legal)?
- Faz claim terapêutico/médico/financeiro que exige certificação?
- Atende público protegido (menores, idosos, vulneráveis)?
- Cruza fronteiras (e portanto múltiplas jurisdições)?

A resposta binária a essas perguntas tem consequências cascateantes. Resolvê-las primeiro evita que toda a research downstream seja baseada em premissa errada.

## Estrutura de pesquisa regulatória

### Fontes primárias (obrigatórias)

- **Textos normativos originais:** leis, decretos, regulamentos, normas técnicas. Não confie em resumos secundários para a base.
- **Reguladores nacionais relevantes:** ANVISA, BACEN, CVM, ANATEL, ANEEL, ANP, CADE, INPI, ANPD (Brasil); FDA, SEC, FTC, FCC (EUA); EMA, ESMA, EDPB (UE); etc.
- **Conselhos profissionais:** CFM, CFP, OAB, CRC, CREA — limitam o que pode ser feito sem profissional habilitado
- **Bases de jurisprudência:** STF, STJ, tribunais regionais; precedentes definem como a norma é aplicada na prática

### Fontes secundárias (úteis para mapeamento)

- Publicações de escritórios de advocacia especializados (com cuidado: muitos são vagos por proteção)
- Artigos de revistas jurídicas
- Cursos e materiais de associações setoriais
- Casos públicos de autuação/multa/processo

### Fontes a evitar
- Resumos genéricos de portais não-especializados
- LinkedIn posts sem fonte primária
- Material desatualizado (regulação muda; cheque data sempre)

## Sub-perguntas canônicas

Para qualquer claim de adequação regulatória, responda:

1. **Enquadramento:** o produto cai sob qual categoria regulatória? Sob quais condições cai/escapa?
2. **Base legal:** qual hipótese legal sustenta o tratamento dos dados/atividade? (Consentimento, contrato, obrigação legal, interesse legítimo, etc.)
3. **Obrigações decorrentes:** o que tem que ser feito (DPO, RIPD, certificação, registro, supervisão, relatórios)?
4. **Direitos do usuário/consumidor:** o que o sujeito pode exigir? (Acesso, portabilidade, exclusão, explicação, oposição)
5. **Implicações arquiteturais:** o que muda no design técnico? (Retenção, descarte, criptografia, logs, auditabilidade)
6. **Implicações operacionais:** o que muda em processo? (Treinamento, governança, resposta a incidente, comunicação a autoridade)
7. **Implicações contratuais:** o que muda em termos de uso, política de privacidade, contratos com terceiros?
8. **Sanções e enforcement:** o que acontece em caso de descumprimento? Qual o histórico de aplicação? Há precedentes próximos ao caso?
9. **Trajetória:** a regulação está em mudança? Há minutas, consultas públicas, projetos de lei em discussão que mudam o cenário em 12–24 meses?

## Multi-jurisdição

Se o produto opera em mais de um país, cada jurisdição é uma sub-research separada. Não assuma equivalência:
- LGPD (Brasil) ≠ GDPR (UE) ≠ CCPA (Califórnia) — princípios próximos, detalhes muito diferentes
- Categoria de dispositivo médico varia por país (Brasil ANVISA, EUA FDA, UE MDR)
- Direitos do consumidor variam (CDC no Brasil, FTC nos EUA, ECC na UE)

Identifique a jurisdição **mais restritiva** que se aplica. Compliance com a mais restritiva costuma cobrir as demais, mas valide caso a caso.

## Análise de risco regulatório

Para cada não-conformidade potencial, mapear:

- **Probabilidade de detecção:** alguns regimes fiscalizam reativamente (mediante reclamação); outros proativamente. Probabilidade muda o cálculo.
- **Severidade da sanção:** multa pecuniária, suspensão de atividade, responsabilização criminal, perda de licença
- **Reputacional:** mesmo sem sanção formal, exposição pode destruir confiança
- **Reversibilidade:** alguns descumprimentos são corrigíveis com ajuste; outros disparam responsabilização retroativa

Risco regulatório alto + irreversível = bloqueante.
Risco baixo + reversível = aceitar como dívida regulatória com prazo de correção.

## Quando consultar especialista (não pulável)

Pesquisa documental tem limite. Em situações abaixo, especialista jurídico do campo é parte obrigatória da research:

- Enquadramento ambíguo entre duas categorias regulatórias
- Multi-jurisdição com conflito entre normas
- Norma nova sem jurisprudência consolidada
- Atividade na fronteira (que pode ou não exigir licença)
- Sanção potencial alta + irreversível

Documento de research aponta os pontos onde consulta especializada é necessária. Não tente resolver no documento o que precisa de parecer formal.

## Anti-padrões específicos desta dimensão

- **Wishful interpretation:** ler a norma do jeito que favorece o produto. Norma é interpretada por regulador e juiz, não por você.
- **Cherry-picking de jurisprudência:** citar caso favorável e ignorar contrário. Em direito, contexto factual importa.
- **Compliance teatral:** processos formalmente em ordem mas operação real divergente. Detectado em fiscalização.
- **Achar que enforcement fraco = liberdade:** regulador pode mudar postura; produtos crescem e viram alvo.
- **Genericalizar regulação:** "é igual a GDPR" raramente é verdade no detalhe.
- **Confundir norma técnica com norma jurídica:** norma ABNT/ISO é obrigatória só quando referenciada por norma jurídica.

## Output esperado desta dimensão

Para cada pergunta-mestre regulatória:

1. Enquadramento explícito do produto/atividade
2. Base legal aplicável citada com referência primária
3. Lista de obrigações decorrentes mapeadas
4. Implicações concretas para arquitetura, operação, contratos
5. Análise de risco por não-conformidade
6. Identificação de pontos que exigem consulta especializada
7. Gatilhos de reavaliação (mudança normativa em discussão, precedentes em formação)
