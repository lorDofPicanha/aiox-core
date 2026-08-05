# Por que o canteiro brasileiro é o menos digitalizado — e quem já tentou mudar isso

**Objetivo:** investigar se a nota 1/5 do Brasil em "maturidade digital de canteiro" (a mais baixa
de toda uma tabela de 10 países × 5 dimensões, citada no relatório interno do IOX-Services) é
oportunidade aberta ou aviso de barreira estrutural — testando quatro hipóteses sem assumir
nenhuma antecipadamente.

**Resposta curta, para quem só vai ler uma linha:** as duas leituras estão certas ao mesmo tempo,
mas para públicos diferentes. Para o canteiro pequeno/médio informal, é aviso — a barreira é
estrutural e nenhum produto resolve sozinho. Para a incorporadora média-grande com múltiplas
obras, é oportunidade real e comprovada — só que o "canteiro" que os dados internacionais mediram
provavelmente não é esse recorte. Detalhe na seção 8.

---

## 0. Ressalva sobre a origem do número

A nota "Brasil = 1 em canteiro, a mais baixa da tabela" vem de um documento interno
(`Relatorio_IA_Construcao_Civil_Panorama_Internacional.docx`, panorama de 10 países) que — até
onde esta pesquisa e a pesquisa irmã sobre evidência independente (`02-evidencia-independente.md`)
conseguiram apurar — não tem metodologia publicada, revisão por pares ou fonte auditável
independente. Não é um índice oficial (tipo o EU Digital Economy and Society Index, que existe e é
público). Trato o número como **hipótese de trabalho fornecida pelo cliente**, não como fato
verificado — e é exatamente por isso que esta pesquisa não parte dele, parte de dados brasileiros
primários (IBGE, CAGED, CBIC, academia) que existem independentemente de o "1" estar certo ou não.
Mesmo com essa ressalva, a direção geral (Brasil fraco em campo, mais forte em dados/comercial) é
consistente com tudo que as pesquisas anteriores da série já encontraram — então uso o número como
motivador da pergunta, não como evidência dela.

---

## 1. As quatro hipóteses — veredito

| # | Hipótese | Veredito | Evidência |
|---|---|---|---|
| 1 | Ninguém tentou → oportunidade aberta | ❌ **Refutada** | "Gestão e controle de obra" é a **maior categoria** do Mapa de Construtechs 2025 (12,7% de 1.068+ startups). Múltiplos produtos de RDO digital operam há mais de 10 anos. Empresas de visão computacional/controle de acesso de campo existem e faturam com clientes nomeados (seção 3). |
| 2 | Tentaram e falharam → descobrir por quê | 🟡 **Parcialmente confirmada, com nuance** | Não achei nenhuma construtech de campo brasileira nomeada que fechou (padrão de opacidade do mercado brasileiro sobre fracasso, já visto em `01-casos-brasil.md`). Mas achei o padrão mais revelador: **mercado fragmentado sem consolidação em 10+ anos**, mortalidade setorial caindo para 5,2% (elas não morrem, mas também não crescem a ponto de dominar), investimento em queda de 32% em 2023. Ninguém "morre" e ninguém "vence" — plateau, não colapso. |
| 3 | Existe e não é publicado → buscar mais fundo | 🟡 **Parcialmente confirmada** | Os produtos existem e SÃO publicados (sites, blogs, releases). O que não é publicado é a taxa real de adoção/penetração — nenhuma fonte diz "X% dos canteiros brasileiros usam RDO digital" ou "Y% usam controle de acesso biométrico". Essa métrica simplesmente não existe publicamente. |
| 4 | Barreira estrutural (conectividade, rotatividade, informalidade, terceirização em cascata, escolaridade) | ✅ **Confirmada como explicação central** | Ver seção 2 — cada barreira citada tem dado primário brasileiro, e a mais forte (rotatividade) é quase o dobro da média da economia. |

**A hipótese que mais importava (achado do enunciado): "se dezenas de apps de RDO existem e o
canteiro segue nota baixa, a barreira não é software."** Isso se confirma diretamente: um estudo
acadêmico da UFSCar (2020) comparou três softwares de diário de obra digital concorrentes e
concluiu que **todos atendem tecnicamente sua função** — a barreira que os próprios autores
apontam é que "grande parte da indústria da construção civil se manteve atrasada em relação aos
movimentos de modernização", não a qualidade dos produtos testados (seção 4). O software resolve o
problema técnico há pelo menos uma década; o que não resolve é adoção em campo.

---

## 2. Dados primários sobre o canteiro brasileiro

### 2.1 Rotatividade — a barreira mais forte, com dado mais forte

**A construção civil tem a maior rotatividade de mão de obra entre todos os setores da economia
brasileira: 65,66% nos 12 meses até agosto/2024**, contra 34,74% da média nacional — quase o
dobro. Segundo o mesmo levantamento: agropecuária (2º lugar) 50,57%, serviços domésticos 60%,
comércio 35,39%, serviços 32,05%, administração pública 17,4%. Três estados passam de 40%: Mato
Grosso, Goiás e Espírito Santo.
**Classe B** — análise da consultoria Tendências sobre dados oficiais do CAGED, divulgada pela
Habicamp em 23/out/2024, período de referência set/2023–ago/2024.
Fonte: [Habicamp](https://habicamp.com.br/construcao-civil-lidera-com-maior-rotatividade-de-mao-de-obra-no-brasil/)

**Por que isso quebra adoção de tecnologia especificamente:** qualquer ferramenta que dependa de
treinamento — mesmo treinamento leve — perde metade do investimento em menos de um ano, porque
metade da equipe já não está mais lá. Isso não é uma barreira "cultural" abstrata; é aritmética de
retorno sobre treinamento.

### 2.2 Informalidade — estagnada, não em queda

**68% dos trabalhadores da construção civil brasileira atuam sem carteira assinada** (2021),
7,5 milhões de trabalhadores no total, 3,8 milhões informais. Variação regional forte: Norte 80%,
Nordeste 77%, Centro-Oeste 70%, Sudeste 65%, Sul 50%. Distribuição por tipo de inserção
(4º tri/2021): 52% por conta própria, 44% empregados, 4% empregadores. **A formalidade avançou de
30,3% (2018) para apenas 31,4% (2021)** — praticamente estagnada em três anos.
**Classe A** — PNAD Contínua/IBGE, compilada e divulgada pela CBIC (maio/2022).
Fonte: [CBIC via Sinduscon-PA](https://www.sindusconpa.org.br/post/ibge-informalidade-no-setor-da-constru%C3%A7%C3%A3o-%C3%A9-maior-nas-regi%C3%B5es-norte-e-nordeste) — nota: `cbic.org.br` retornou erro 522 (Cloudflare) durante toda esta sessão de pesquisa; usei a republicação do conteúdo por um Sinduscon regional, que cita a mesma fonte primária IBGE/PNAD Contínua.

**Por que isso importa para produto:** mais da metade da força de trabalho de campo nunca aparece
em nenhum sistema formal (CAGED só capta os ~32% formais). Qualquer produto que dependa de
"integração com folha/RH" já exclui estruturalmente a maioria da mão de obra real do canteiro.

### 2.3 Escolaridade — baixa, e por um mecanismo que se autoperpetua

O trabalhador médio da construção civil brasileira tem **ensino fundamental incompleto**, ~41 anos,
homem (mulheres são 2,5% da amostra) — perfil de 2.000 profissionais pesquisados pela CBIC,
divulgado dez/2024. 61% ganham entre 1 e 2 salários mínimos. 60% têm mais de 10 anos no setor. 71%
declaram interesse em se qualificar.
**Classe A/B** (pesquisa própria CBIC, metodologia declarada, mas não é IBGE).
Fonte: [Sinduscon-RS republicando CBIC](https://sinduscon-rs.com.br/cbic-apresenta-perfil-do-trabalhador-da-construcao-civil-em-2024/)

O achado mais interessante não é o nível de escolaridade em si, é o **mecanismo que o mantém
baixo**: um estudo FGV coordenado por Marcelo Neri (2011) mostra que a escolaridade média dos
trabalhadores de 20-24 anos no setor **subiu** de 4,91 anos (1996) para 8,06 anos (2009) — mas essa
mesma melhoria fez a **participação de jovens (15-29 anos) no setor cair** de 36,49% para 29,24%
no mesmo período, porque trabalhador mais educado prefere ocupação "menos braçal e mais
qualificada" e sai do setor.
**Classe A** — estudo acadêmico FGV.
Fonte: [Exame, citando FGV/Neri](https://exame.com/brasil/fgv-escolaridade-afasta-jovem-da-construcao-civil/)

**Por que isso é mais grave do que parece:** não é um problema que "educação básica melhorando no
Brasil" resolve sozinho com o tempo — é uma seleção adversa que se autoperpetua: quem ganha
escolaridade, sai; quem fica, é sistematicamente quem tem menos alternativa. Isso significa que a
barreira de letramento digital no canteiro não é um estoque decrescente, é um fluxo permanente.

### 2.4 Terceirização em cascata — a barreira mais citada, com dado mais fraco

63,1% das empresas do setor **industrial** (não específico de construção) usam mão de obra
terceirizada, segundo dado CNI citado por fontes secundárias; outra fonte cita 63% das empresas de
construção civil usando terceirização **antes** da reforma trabalhista de 2017.
**Classe C** (números redondos coincidentes demais entre duas fontes secundárias sem link ao
estudo primário — tratar como indicativo, não como fato fechado).
Fontes: [SomaPay](https://somapay.com.br/terceirizacao-de-mao-de-obra-na-construcao/), [Trabalhista Digital](https://trabalhistadigital.adv.br/2020/11/17/repercussoes-do-direito-do-trabalho-na-construcao-civil-informalidade-terceirizacao-e-subempreitada/)

O que é mais sólido do que o número é o mecanismo jurídico: a **Lei 13.429/2017 e a reforma
trabalhista (Lei 13.467/2017) liberaram a terceirização irrestrita**, inclusive de atividade-fim —
antes disso já era estrutural na construção (subempreitada por etapa: fundação, estrutura,
alvenaria, acabamento, cada uma com equipe própria), depois disso passou a ser ainda mais
formalizável em cascata. Não encontrei um estudo que quantifique "quantos níveis de subcontratação
em média por obra brasileira" — é uma lacuna real desta pesquisa, não um número que não pude achar
por falta de esforço.

**Por que isso quebra tecnologia de campo especificamente:** quem executa a obra (o subempreiteiro
e sua equipe) frequentemente não é quem contrataria/pagaria por um software de gestão — é a
construtora contratante que teria esse interesse, mas ela não está fisicamente no canteiro todo
dia. Isso separa quem sente a dor (construtora, que quer dado) de quem produz o dado (equipe
terceirizada, que não tem incentivo de aprender ferramenta nova para um contrato de curto prazo).
Combinado com a rotatividade de 65,66%, o resultado é que a "força de trabalho estável e treinável"
que qualquer rollout de tecnologia pressupõe **não existe** na maior parte do canteiro brasileiro.

### 2.5 Conectividade e smartphone — o dado que mais surpreende

Ao contrário do que a hipótese "falta de conectividade" sugeria, **o smartphone com plano de dados
já é onipresente mesmo na base da pirâmide**: 86% dos domicílios brasileiros têm acesso à internet
(TIC Domicílios 2025), e **entre as classes D/E, 86-87% acessam a internet EXCLUSIVAMENTE via
smartphone/plano de dados móvel** — não têm Wi-Fi fixo em casa, mas têm celular com internet.
**Classe A** — pesquisa TIC Domicílios, CGI.br/Cetic.br (comitê gestor oficial da internet no
Brasil, referência do setor desde 2005).
Fontes: [Abranet — TIC Domicílios 2025](https://abranet.org.br/noticias/tic-domicilios-2025-aponta-reducao-da-lacuna-de-acesso-a-internet-entre-classes-sociais-mas-diferenca-persiste/), [Abranet — TIC Domicílios 2024](https://abranet.org.br/noticias/tic-domicilios-2024-60-usam-internet-exclusivamente-pelo-smartphone/), [Agência Brasil](https://agenciabrasil.ebc.com.br/geral/noticia/2025-12/acesso-internet-cresce-entre-classes-sociais-mas-ainda-e-desigual)

Isso **não é dado direto do canteiro** — é dado de domicílio, usado aqui como proxy pela renda da
mesma faixa de trabalhador (61% ganham 1-2 salários mínimos, seção 2.3). A limitação real que
encontrei é anedótica, não quantificada: uma empresa de captura por câmera solar (Timelapse Obras)
afirma, com base em "20+ anos de experiência", que **4G funciona melhor que Wi-Fi convencional em
canteiro** — o que sugere que Wi-Fi fixo é raramente viável em obra (faz sentido: obra é ambiente
temporário, sem infraestrutura de cabeamento), mas 4G/dados móveis é a solução já adotada por quem
já opera em campo.
**Classe C** (afirmação de fornecedor, sem estudo).
Fonte: [Timelapse Obras](https://blog.timelapseobras.com.br/post/visao-computacional-aplicacoes-construcao-civil)

**Conclusão desta subseção, que muda o produto:** a barreira de conectividade/dispositivo é **muito
mais fraca do que a intuição sugere**. O trabalhador de campo brasileiro, mesmo no perfil de baixa
renda do setor, já carrega no bolso o hardware e a conexão necessários (smartphone + 4G). Isso é
coerente com — e explica — por que toda a cadeia de pesquisas anteriores do IOX convergiu
independentemente para "WhatsApp como interface": não é só conveniência de produto, é que **o
WhatsApp é literalmente a única infraestrutura digital que já está garantidamente na mão de todo
trabalhador de canteiro**, formal ou informal, fixo ou terceirizado por uma semana.

**Lacuna explícita:** não encontrei nenhum estudo que meça diretamente "sinal de internet dentro do
perímetro físico de canteiros de obra brasileiros" (só achei dado de conectividade rural genérica —
>70% de propriedades rurais sem internet — que não é o mesmo universo de canteiro urbano). Se o
founder for decidir arquitetura de captura (app nativo vs. WhatsApp vs. SMS), vale um teste de
campo real antes de assumir sinal disponível.

---

## 3. Quem já tentou — mapeamento de players brasileiros de campo

### 3.1 RDO digital / gestão de obra — a categoria mais povoada, sem vencedor claro

"Gestão e controle de obra" é **a maior categoria isolada do Mapa de Construtechs e Proptechs
Brasil**, com 12,7% dos 1.068+ negócios mapeados em 2023 (Terracotta Ventures/Liga Ventures).
Produtos ativos identificados nesta pesquisa, todos operando publicamente há anos: **Field
Control**, **Sienge** (ERP com módulo de obra e API pública documentada — já mapeado nas pesquisas
anteriores do IOX), **Constructor**, **Kobe**, **Traact**, **GEMCO**, **ObraPrima** (foco em obra
pública), **Prumo**, **Brickup** (RDO digital gratuito), **Qualitab**, **AIRDO**, **RDO App**,
**diariodeobras.net**, e **Zé Obra** (WhatsApp, R$39-449/mês, já mapeado em pesquisa anterior do
IOX como prova de demanda pelo modelo conversacional).
**Classe B/C** (existência confirmada por site/blog próprio; nenhum tem métrica pública auditável
de número de clientes ou receita).

**O que essa lista revela, mais do que qualquer caso individual:** dez ou mais concorrentes diretos
competindo na mesma categoria há mais de uma década, **sem consolidação visível** (nenhuma
aquisição, fusão ou "vencedor" com posição dominante publicamente reconhecida) e **sem nenhum caso
nomeado de fechamento**. Isso não é "mercado saudável com muitos players felizes" — é o padrão
típico de **mercado de baixo ticket médio e baixa fricção de troca**: fácil entrar (motivo pelo qual
tanta gente tentou), fácil o cliente trocar ou não pagar (motivo pelo qual ninguém cresce o
suficiente para engolir os outros). Reforça a leitura já registrada na síntese anterior do IOX: RDO
puro tem "baixa barreira de entrada e baixa defensabilidade" — não é onde vale competir por preço
de prateleira.

### 3.2 Visão computacional e controle de acesso de campo — existe, funciona, mas só para grande

Ao contrário da hipótese "ninguém fez visão computacional/biometria de canteiro no Brasil", esta
pesquisa encontrou uma categoria ativa e específica: **OPTIKON/EXXATA** (identificação automática
de veículos e EPI), **Timelapse Obras** (câmeras solares 4G com IA para monitoramento), **Gryfo**
(biometria facial para controle de acesso, desde ao menos 2021), **Trielo** (controle de acesso em
nuvem, "100+ canteiros simultâneos"), **InMeta** (monitoramento 360° integrado a segurança/
qualidade), **Autodoc** (controle facial de acesso), **Teltex** (integração de controle de acesso).
**Classe B/C** (site/blog do próprio fornecedor; sem terceiro auditando os números).

**O dado mais importante desta subseção não é a existência dos produtos — é quem os compra.** Os
casos de cliente nomeado encontrados são **todos grandes incorporadoras/construtoras**: **Cyrela**
(via Teltex), **Brookfield** e "mais de 100 canteiros" via Trielo/Sinco Engenharia. Nenhum caso de
PME (10-200 funcionários, o ICP do IOX) foi encontrado usando qualquer uma dessas tecnologias de
campo. Isso é consistente com o padrão já visto nas pesquisas anteriores do IOX sobre China e
tecnologias de canteiro: tecnologia física de campo (câmera, biometria, sensor) tem custo mínimo de
adoção alto o suficiente para só fazer sentido econômico em operação de escala — múltiplas obras
simultâneas, orçamento de compliance/segurança dedicado. A PME simplesmente não é o comprador
natural dessa camada, mesmo onde a tecnologia funciona.

### 3.3 Mercado de construtechs em geral — crescendo em número, não em capital

- 2020: 702 startups ativas (+23% a/a, +180% desde 2017).
- 2023: 1.068+ startups mapeadas (+11,8% a/a), com **mortalidade caindo para 5,2%** — sinal de
  "maturação" segundo o próprio relatório, mas leitura alternativa igualmente válida: menos gente
  nova entrando e morrendo rápido, mais gente estagnada e sobrevivendo pequena.
- Dez/2025 (Liga Ventures): 37% das construtechs em estágio "estável", 30% "emergente", 22%
  "nascente", 11% "disruptiva" — a maioria não avançou para o estágio seguinte.
- **Investimento caiu 32% em 2023 vs. 2022** — capital ficando mais cauteloso mesmo com o número de
  empresas crescendo.
**Classe B** — todos os números vêm do próprio mapeador (Terracotta Ventures) ou de análise de
mercado (Liga Ventures/itforum), sem auditoria terceira, mas são a referência de mercado mais
citada do setor no Brasil e consistente ao longo de várias edições.
Fontes: [Revista PEGN 2023](https://revistapegn.globo.com/startups/noticia/2023/05/numero-de-construtechs-e-proptechs-cresce-118percent-no-brasil-e-ultrapassa-marca-de-mil-startups-diz-estudo.ghtml), [ITForum — queda 32%](https://itforum.com.br/noticias/construtechs-proptechs-32-queda-investimentos-2023/), [Revista Construa — Liga Ventures dez/2025](https://revistaconstrua.com.br/engenharia/construtechs-avancam-em-numero-mas-investimentos-seguem-cautelosos-no-ecossistema-da-construcao-civil/), [Terracotta Ventures — mapa 2025](https://www.terracotta.ventures/mapa-das-construtechs-proptechs-brasil-2025)

---

## 4. Por que RDO digital especificamente não escalou — evidência acadêmica

Um estudo da **UFSCar** (Lopes, Yamamoto e Serra, 2020, apresentado no ENTAC) comparou três
softwares concorrentes de diário de obra digital e concluiu que **"os programas analisados atendem
satisfatoriamente sua função de TIC"** — ou seja, tecnicamente resolvido — mas registra que "grande
parte da indústria da construção civil se manteve atrasada em relação aos movimentos de
modernização". **Classe A** (artigo acadêmico revisado por pares de evento nacional).
Fonte: [ENTAC/UFSCar](https://eventos.antac.org.br/index.php/entac/article/view/1170/)

Um segundo estudo (IMED, Zuchetto e Lanteme, 2020) sobre automação de controle de materiais no
canteiro usou Design Thinking centrado no usuário e concluiu que a barreira relevante envolve "não
apenas tecnologia, mas também experiência e aceitação dos usuários finais" — reforçando que o
problema técnico já está resolvido, o problema de produto está na camada de adoção humana.
**Classe A**.
Fonte: [ENTAC/IMED](https://eventos.antac.org.br/entac/article/view/1281)

A mesma lógica aparece na literatura sobre BIM (adjacente, mas mais estudada): múltiplos trabalhos
acadêmicos (USP, análise bibliométrica 2010-2021) documentam que a barreira de adoção **varia por
tamanho de empresa** — microempresas e PMEs ficam sistematicamente atrás de grandes empresas na
adoção, independente do país. **Classe A** (achado consistente entre estudos, mesmo sem ter
conseguido extrair a lista completa de barreiras do PDF de um dos estudos nesta sessão — lacuna
registrada abaixo).
Fonte: [USP — Gestão de Projetos](https://revistas.usp.br/gestaodeprojetos/article/download/189870/183144)

**Síntese desta seção:** a literatura acadêmica brasileira, de forma consistente e independente em
pelo menos três estudos, não aponta "o software não funciona" como causa de baixa digitalização de
campo. Aponta adoção, comportamento do usuário e porte da empresa. Isso bate exatamente com o
padrão já identificado nas pesquisas irmãs do IOX (Song & Song 2026 sobre etnografia de canteiro
chinês, e a França como o único mercado com adoção de massa comprovada em app de campo simples —
Eiffage, 23.500 usuários). O fio que atravessa todas as fontes internacionais e agora as brasileiras
é o mesmo: **o que exige mudança de comportamento do trabalhador de campo não escala; o que se
encaixa no que ele já faz, escala.**

---

## 5. O que isso implica sobre "software vs. estrutura"

Recapitulando a pergunta central do enunciado: **a barreira é software?** Não. Evidência
convergente:

1. Dez+ produtos de RDO digital tecnicamente funcionais competem há mais de uma década sem
   consolidação — não é falta de oferta de software.
2. Estudo acadêmico testou três softwares concorrentes e considerou todos tecnicamente adequados.
3. Visão computacional e biometria de campo **funcionam e são adotadas** — mas só onde a estrutura
   econômica do comprador permite (grande incorporadora com múltiplas obras), não onde a estrutura
   de mão de obra do canteiro impede (rotatividade 65,66%, informalidade 68%, terceirização em
   cascata).
4. O device/conectividade que a maioria dos produtos precisaria (smartphone + dados móveis) já está
   nas mãos de 86%+ da base de renda do setor.

**A barreira real é estrutural, e tem quatro componentes que se reforçam mutuamente:** rotatividade
extrema torna qualquer investimento em treinamento de curta duração; informalidade mantém metade da
força de trabalho fora de qualquer sistema de dados formal; terceirização em cascata separa quem
sentiria a dor do dado (a construtora) de quem produziria o dado (o subempreiteiro, com incentivo
de curto prazo); e escolaridade baixa persiste não por falta de melhoria educacional geral no
Brasil, mas porque quem melhora sai do setor. Nenhuma dessas quatro barreiras é resolvida por um
app melhor.

---

## 6. O que isso muda para uma decisão de produto (não é a única leitura possível)

Não é meu papel decidir a estratégia do IOX aqui — isso é dos documentos de produto já existentes no
projeto (`ia-construcao-sintese.md`, `produtos-construcao.md`, `00-SINTESE-CONSOLIDADA.md`). Mas
dois pontos desta pesquisa têm implicação direta que vale registrar:

- **O ICP real dos players brasileiros de tecnologia de campo comprovada (visão, biometria) é a
  grande incorporadora, não a PME.** Se o IOX mira PME 10-200 funcionários, a camada de hardware/
  visão computacional provavelmente não é o ponto de entrada certo — reforça o que a pesquisa de
  tecnologias de canteiro (`03-tecnologias-canteiro.md`) já havia concluído por outro caminho.
- **A fragmentação sem vencedor do mercado de RDO digital é, ao mesmo tempo, prova de demanda
  (todo mundo tentou porque a dor é real) e aviso de preço (nenhum ganhou porque o ticket médio que
  o mercado aceita pagar não sustenta crescimento).** Isso é o mesmo padrão já registrado sobre o
  Zé Obra: valida a demanda, mata o preço de R$15-30k se vendido como "mais um RDO". A saída
  continua sendo mudar quem é o comprador (quem deve o relatório a um terceiro — financiador,
  cliente institucional, seguradora), não competir em features de RDO.

---

## 7. Classificação de evidência — resumo

| Dado | Classe | Por quê |
|---|---|---|
| Rotatividade 65,66% (construção) vs. 34,74% (média nacional) | B | Consultoria sobre CAGED oficial, sem link à planilha bruta |
| Informalidade 68% (2021), estagnada desde 2018 | A | IBGE/PNAD Contínua, compilação CBIC |
| Perfil do trabalhador (escolaridade, idade, renda, satisfação) | A/B | Pesquisa própria CBIC, metodologia declarada, n=2.000 |
| Escolaridade e evasão de jovens do setor | A | Estudo acadêmico FGV/Neri |
| Terceirização 63% pré-reforma | C | Duas fontes secundárias com número coincidente, sem estudo primário linkado |
| TIC Domicílios — smartphone 86-87% em classe D/E | A | CGI.br/Cetic.br, pesquisa oficial anual |
| Conectividade específica de canteiro (4G > Wi-Fi) | C | Afirmação de um único fornecedor, sem estudo |
| Estudos ENTAC sobre RDO digital e barreiras de adoção | A | Artigos acadêmicos revisados, evento nacional |
| Mapa de construtechs (contagem, categorias, investimento) | B | Fonte única (Terracotta Ventures/Liga Ventures), sem auditoria terceira, mas referência consolidada do setor |
| Casos de cliente (Cyrela, Brookfield) em controle de acesso | C | Case do próprio fornecedor, sem métrica auditável |

Nenhum número classe C está na síntese final (seção 8) sem a ressalva de origem.

---

## 8. Vale construir para o canteiro brasileiro?

**Depende de qual "canteiro brasileiro".** Os dados desta pesquisa não sustentam uma resposta única
de sim/não — sustentam uma resposta **segmentada**, e essa segmentação é o achado mais acionável do
documento:

**Para o canteiro médio, PME, informal, de alta rotatividade — o "canteiro brasileiro" que a
maioria dos indicadores mede (68% informal, 65,66% de rotatividade, terceirizado em cascata) — a
resposta honesta é: aviso, não oportunidade limpa.** Nenhuma tecnologia de campo (RDO dedicado,
visão computacional, biometria) tem caso comprovado de adoção sustentada nesse segmento no Brasil.
A estrutura de incentivo está desalinhada (quem sentiria a dor não é quem produz o dado) e a
estrutura de mão de obra inviabiliza qualquer coisa que dependa de treinamento ou continuidade de
equipe. Construir um produto de campo "genérico" para esse segmento repete o padrão já visto em
dez concorrentes de RDO: entra fácil, não consolida, não define preço.

**Para a incorporadora média-grande com múltiplas obras simultâneas e orçamento de compliance/
segurança — um segmento mais estreito, mas real e com caso comprovado (Cyrela, Brookfield e
"100+ canteiros" via fornecedores nomeados) — a resposta é: oportunidade, mas já disputada.** Existe
mercado, existem compradores dispostos a pagar, e existem players brasileiros nele há anos. A
pergunta para esse segmento não é "vale construir", é "o que ainda não foi feito" — e essa pesquisa
não encontrou evidência de saturação total (nenhum estudo mediu % de mercado atendido), só
evidência de que **o jogo já está em andamento e o comprador já está definido: incorporadora
grande, não PME**.

**O achado que mais deveria pesar na decisão do IOX, dado que o ICP declarado do projeto é PME**: a
convergência entre esta pesquisa e todas as pesquisas irmãs da série (WhatsApp como interface,
captura declarada por áudio em vez de inferida por visão, RDO como ponto de entrada de baixa
complexidade) não é coincidência de metodologia — é a **única arquitetura de produto compatível com
as quatro barreiras estruturais medidas aqui**. Ela não exige treinamento continuado (rotatividade),
não exige que o trabalhador esteja no sistema formal (informalidade), não exige que o mesmo
subempreiteiro continue no canteiro (terceirização), e não exige letramento digital além do que
qualquer usuário de WhatsApp já tem (escolaridade). Não é a arquitetura mais sofisticada tecnicamente
— é a única que sobrevive ao canteiro real, não ao canteiro idealizado que a média internacional
provavelmente estava medindo.

**Se a pergunta for reformulada como "vale construir tecnologia de visão computacional/hardware de
campo para PME no Brasil hoje"**, a resposta desta pesquisa específica é **não, ou pelo menos não
ainda** — não há um caso comprovado de PME pagando por isso, e a estrutura de custo/adoção favorece
quem já opera em escala. Isso não invalida o produto de captura conversacional (RDO por WhatsApp),
que resolve um problema diferente (estruturar dado que já existe em forma de áudio/foto solta) sem
depender de nenhuma das quatro barreiras identificadas.

---

## 9. Lacunas explícitas desta pesquisa

1. 🔴 **Nenhuma medição direta de sinal/conectividade dentro do perímetro físico de canteiros
   brasileiros** — usei domicílio como proxy de renda, não medição de obra. Se a arquitetura de
   captura depender de upload de vídeo/imagem pesada, vale testar em campo antes de assumir.
2. 🔴 **Nenhum estudo quantificando níveis médios de subcontratação em cascata por obra
   brasileira** — o mecanismo jurídico (reforma trabalhista 2017) está confirmado, o número "quantos
   elos" não.
3. 🟡 **Número de terceirização (63%) é classe C** — duas fontes secundárias coincidentes, sem
   estudo primário localizado. Não usar como fato fechado em proposta comercial.
4. 🟡 **PDF acadêmico da USP sobre disparidade de adoção de BIM por porte de empresa** baixado mas
   não extraído nesta sessão (binário não conversível pela ferramenta disponível) — a lista
   detalhada de barreiras por porte ficou fora deste documento; o arquivo está salvo localmente se
   alguém quiser reabrir com OCR/parser de PDF.
5. 🟡 **Nenhum dado de penetração de mercado** para nenhuma categoria (RDO digital, controle de
   acesso, visão computacional) — sei que os produtos existem, não sei que fração do universo de
   canteiros brasileiros os usa.
6. 🟡 **`cbic.org.br` esteve fora do ar (erro 522) durante toda a sessão** — os dados da CBIC citados
   vêm de republicação por Sinduscons regionais que linkam à mesma fonte primária (IBGE/PNAD
   Contínua), não do site oficial diretamente. Vale reconfirmar direto na fonte quando o site
   voltar.
7. 🟡 **Orçamento de busca da sessão (WebSearch) esgotou-se cedo** — toda a pesquisa depois do
   primeiro bloco foi feita via WebFetch em buscadores (Bing, DuckDuckGo HTML) em vez de WebSearch
   nativo. Isso limitou a profundidade de alguns tópicos secundários (ex.: não cheguei a pesquisar
   diretamente "Katerra Brasil" ou fracassos de construtechs de campo especificamente por nome).

---

## Fontes citadas (consolidado)

- [Habicamp — rotatividade construção civil](https://habicamp.com.br/construcao-civil-lidera-com-maior-rotatividade-de-mao-de-obra-no-brasil/)
- [CBIC/Sinduscon-PA — informalidade PNAD Contínua](https://www.sindusconpa.org.br/post/ibge-informalidade-no-setor-da-constru%C3%A7%C3%A3o-%C3%A9-maior-nas-regi%C3%B5es-norte-e-nordeste)
- [CBIC/Sinduscon-RS — perfil do trabalhador 2024](https://sinduscon-rs.com.br/cbic-apresenta-perfil-do-trabalhador-da-construcao-civil-em-2024/)
- [Exame — FGV/Neri, escolaridade e evasão de jovens](https://exame.com/brasil/fgv-escolaridade-afasta-jovem-da-construcao-civil/)
- [SomaPay — terceirização, dado CNI](https://somapay.com.br/terceirizacao-de-mao-de-obra-na-construcao/)
- [Trabalhista Digital — terceirização pré-reforma](https://trabalhistadigital.adv.br/2020/11/17/repercussoes-do-direito-do-trabalho-na-construcao-civil-informalidade-terceirizacao-e-subempreitada/)
- [Abranet — TIC Domicílios 2025](https://abranet.org.br/noticias/tic-domicilios-2025-aponta-reducao-da-lacuna-de-acesso-a-internet-entre-classes-sociais-mas-diferenca-persiste/)
- [Abranet — TIC Domicílios 2024](https://abranet.org.br/noticias/tic-domicilios-2024-60-usam-internet-exclusivamente-pelo-smartphone/)
- [Agência Brasil — acesso à internet por classe](https://agenciabrasil.ebc.com.br/geral/noticia/2025-12/acesso-internet-cresce-entre-classes-sociais-mas-ainda-e-desigual)
- [Timelapse Obras — visão computacional em canteiro](https://blog.timelapseobras.com.br/post/visao-computacional-aplicacoes-construcao-civil)
- [ENTAC/UFSCar — três softwares de RDO comparados](https://eventos.antac.org.br/index.php/entac/article/view/1170/)
- [ENTAC/IMED — automação e Design Thinking em canteiro](https://eventos.antac.org.br/entac/article/view/1281)
- [USP — Gestão de Projetos, disparidade de adoção BIM por porte](https://revistas.usp.br/gestaodeprojetos/article/download/189870/183144)
- [Terracotta Ventures — Mapa de Construtechs 2025](https://www.terracotta.ventures/mapa-das-construtechs-proptechs-brasil-2025)
- [Revista PEGN — crescimento 11,8% construtechs 2023](https://revistapegn.globo.com/startups/noticia/2023/05/numero-de-construtechs-e-proptechs-cresce-118percent-no-brasil-e-ultrapassa-marca-de-mil-startups-diz-estudo.ghtml)
- [ITForum — queda de 32% em investimento 2023](https://itforum.com.br/noticias/construtechs-proptechs-32-queda-investimentos-2023/)
- [Revista Construa — Liga Ventures, estágios de maturidade dez/2025](https://revistaconstrua.com.br/engenharia/construtechs-avancam-em-numero-mas-investimentos-seguem-cautelosos-no-ecossistema-da-construcao-civil/)
- [ABCIC — Mapa Construtechs 2023](https://abcic.org.br/Noticia/Exibir/terracotta-ventures-divulga-mapa-das-construtechs-e-proptechs-brasil-2023)
- OPTIKON/EXXATA, Gryfo, Trielo, InMeta, Autodoc, Teltex — sites/blogs próprios (classe C, ver seção 3.2)

**Documentos-irmãos desta série (contexto do mesmo projeto):**
`00-SINTESE-CONSOLIDADA.md`, `01-casos-brasil.md`, `02-evidencia-independente.md`,
`03-tecnologias-canteiro.md`, `04-fornecedores-e-stack.md`, `05-casos-china.md`, `06-casos-eua.md`
— todos em `docs/projects/iox-services/_outreach/research/`.

— Atlas, investigando a verdade 🔎
