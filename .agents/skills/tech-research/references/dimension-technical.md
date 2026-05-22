# Dimensão Técnico-Arquitetural

Quando aplicar: sempre que houver implementação técnica envolvida. Escolhas de stack, ferramentas, frameworks, build vs buy, viabilidade técnica, decisões arquiteturais.

## Sub-camadas de investigação

### Fundamentos teóricos

Quais são os papers seminais ou conceitos fundacionais que originaram a tecnologia? Quais são os trade-offs matemáticos/algorítmicos inerentes (não escolhas de implementação)?

**Por quê importa:** trade-offs fundacionais não desaparecem com versão nova. Se a tecnologia tem um limite teórico, qualquer otimização vai esbarrar nele eventualmente.

**Fontes típicas:** papers acadêmicos (arXiv, ACM, IEEE), livros canônicos do campo, talks de conferência fundacionais, RFCs originais.

### State of the art atual

O que mudou nos últimos 12–18 meses? Em tech, especialmente em IA, essa janela é crítica — técnicas de 2 anos atrás podem ser irrelevantes hoje.

**Fontes típicas:**
- arXiv com filtro de citações ajustado pela data
- Proceedings recentes de conferências top do campo (NeurIPS/ICML/ACL para IA; OSDI/SOSP para sistemas; CHI para HCI; etc.)
- Blogs técnicos de labs sérios (Anthropic, OpenAI, DeepMind, Meta AI, Google Research, FAIR)
- Newsletters técnicas curadas (não newsletters de marketing)
- Talks recentes de conferências industriais (Strange Loop, QCon, SREcon, KubeCon, conferências específicas do campo)

### Implementações práticas

Quem já construiu isso em produção? Como? Quais foram os resultados reportados publicamente?

**Sinais de qualidade em repos GitHub:**
- Stars são vanity. Foque em forks ativos (uso real).
- Commits nos últimos 90 dias
- Issues respondidas em < 7 dias mediana
- PRs mergeados nos últimos 60 dias com revisão real
- Mais de 5 contributors únicos no último ano (não one-man-show)
- CI verde consistente
- Testes presentes e abrangentes
- Licença compatível com o uso pretendido
- Dependências sustentáveis (não 200 deps de manutenção morta)
- Documentação que não é só README de marketing
- Releases versionadas com changelog

**Sinais de bandeira vermelha:**
- Último commit > 6 meses
- Issues abertas crescendo monotonicamente
- Único maintainer respondendo
- "Looking for new maintainer" no README
- Documentação contradiz comportamento real
- Stars cresceram em pico curto (provável astroturfing)

### Benchmarks e métricas

Como medir performance? Sem benchmarks, comparação é opinião.

Categorias típicas:
- **Latência:** mediana, p95, p99, cauda. Distribuição importa tanto quanto média.
- **Throughput:** requisições/seg, dados/seg, sustentado e em pico
- **Custo:** por requisição, por GB, por usuário, por hora de operação
- **Qualidade:** métricas específicas do domínio (BLEU, ROUGE para NLP; F1 para classificação; SLO para serviços; etc.)
- **Robustez:** comportamento sob carga, em edge cases, com inputs adversariais
- **Operacionalidade:** tempo de deploy, complexidade de debugging, footprint operacional

**Cuidados com benchmarks:**
- Benchmarks de fabricante são sempre otimizados; busque benchmarks independentes
- Verifique se o workload do benchmark é representativo do seu uso real
- Benchmarks em laboratório raramente refletem produção
- Compare em hardware/condições comparáveis ou normalize explicitamente

### Failure modes conhecidos

Como isso quebra? Quais são os anti-padrões documentados?

**Fontes ouro:**
- Postmortems públicos (Stripe, Shopify, Discord, Cloudflare, GitLab, Datadog — vários têm cultura de publicar)
- HackerNews threads sobre incidentes específicos
- Engenharia blogs com "lessons learned"
- Issues GitHub etiquetadas como bugs reincidentes
- Twitter de SREs e engenheiros sêniores
- r/sre, r/devops, r/programming threads de horror

Engenheiros sêniores adoram compartilhar onde se machucaram. Isso é mais valioso que documentação oficial.

### Roadmap e direção

Para onde a tecnologia está indo? Você não quer apostar em algo cuja mainline está moribunda.

**Sinais de saúde:**
- Cadência regular de releases
- RFCs/proposals ativos com discussão de qualidade
- Comunidade ativa em canais oficiais (Discord/Slack/fóruns)
- Presença em conferências relevantes do campo
- Roadmap público com itens entregues

**Sinais de declínio:**
- Releases esporádicas
- Discussões de futuro paradas
- Fundadores/maintainers principais migraram
- Empresa proprietária mudou de prioridade
- Comunidade migrando para alternativas

## Anti-padrões específicos desta dimensão

- **Hype bias:** confundir frequência de menção com qualidade. Tecnologia popular em Twitter não é necessariamente tecnologia certa.
- **Cargo culting:** copiar stack de empresa famosa (Netflix, Uber) sem considerar que sua escala não justifica a complexidade.
- **Resume-driven development:** escolher por currículo, não por adequação ao problema.
- **NIH (Not Invented Here):** rejeitar soluções existentes para reconstruir tudo. Caro.
- **NIH inverso:** adotar tudo de terceiros sem avaliar viabilidade de manutenção/migração. Lock-in caro.
- **Benchmark hacking:** acreditar em benchmark sem reproduzir ou sem entender as condições.

## Output esperado desta dimensão

Para cada pergunta-mestre técnica, entregar:

1. Estado da arte resumido (2–3 parágrafos)
2. Lista rankeada de alternativas com critérios explícitos
3. Benchmarks comparativos quando disponíveis
4. Failure modes mapeados para cada alternativa
5. Recomendação técnica com condições de validade
6. Riscos técnicos identificados
7. Lista de unknowns que só validação empírica resolve (POC necessário)
