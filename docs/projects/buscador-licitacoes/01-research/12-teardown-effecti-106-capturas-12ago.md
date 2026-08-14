# Teardown do Effecti — 106 capturas do sistema real (12/Ago/2026)

**Origem:** owner conseguiu acesso ao ambiente do Effecti (conta de autodemonstração + conta operacional real com 128.566 avisos e 3.320 propostas cadastradas) e capturou 106 telas cobrindo todos os módulos.
**Método:** leitura das 106 capturas + auditoria do `apps/noyce` no estado de hoje (snapshot de descoberta gerado 12/Ago 20:50, 1.242 oportunidades, 447 municípios, raio 500 km, 100% PNCP).
**Fonte das capturas:** `C:\Users\kingp\OneDrive\Imagens\noyce\` (106 PNG, 05/Ago 19:36–19:52).

> ⚠️ Isto é análise de concorrente a partir de telas públicas do produto. Nada aqui é engenharia reversa de código, nem cópia de ativo protegido. O que se copia é **arquitetura de produto e modelo mental do usuário** — o que é legítimo e é o objetivo do exercício.

---

## 1. A descoberta que reordena o projeto

**O Effecti não é um buscador. É um sistema operacional do ciclo de licitação organizado em 5 verbos**, e a barra lateral inteira é isso:

| Verbo | Promessa literal na tela | Submenu |
|---|---|---|
| **Encontrar** | "Encontre as melhores oportunidades para o seu negócio." | Meus Avisos · Banco de Licitações · Dashboard · Anexos ComprasNet · Configurações |
| **Cadastrar** | "Reduza o tempo gasto em cadastro de licitações." | Dashboard · Minhas Propostas · Imprimir Proposta Atualizada · Meus Documentos · Meus Produtos |
| **Disputar** | "Automatize seus envios de lances e aumente seu ganho." | (robô de lance + dashboard de aproveitamento) |
| **Monitorar** | "Encontre em um só lugar as mensagens de suas licitações." | Minhas Licitações · Cadastro · Mensagens |
| **Visão de Dados** | "Gere relatórios e dashboards com informações importantes para decisões ágeis" | Análise de Mercado · Relatório Geral |

Nosso Noyce tem 6 estágios: **Monitorar → Analisar → Indicar → Habilitar → Acompanhar → Recorrer**.

O choque de mapas é este:

```
EFFECTI    Encontrar ──── Cadastrar ──── Disputar ──── Monitorar ──── Visão de Dados
NOYCE      Monitorar ──── Analisar ── Indicar ── Habilitar ── Acompanhar ── Recorrer
              │              └──────── (nosso moat) ────────┘        │          │
              │                                                       │          │
           mesma coisa                                    parcialmente igual    só nosso
```

- **Dois verbos deles não existem nem como conceito no nosso modelo: `Cadastrar` e `Disputar`.** São os dois únicos momentos em que o software **escreve** no portal em vez de só ler.
- **Três estágios nossos não existem no modelo deles: `Analisar`, `Habilitar`, `Recorrer`** (o `Aimê`, IA de leitura de edital, foi lançado só em 10/06/2025 e é um botão de leitura, não um workflow).

Isso não é detalhe de nomenclatura. É a definição de onde cada um decidiu que está o valor.

---

## 2. Inventário — o que existe de fato em cada módulo

### 2.1 Encontrar (o núcleo do produto deles)

**Escala de captura:** `Portais selecionado 1441 de 1441` · `Estados 27 de 27` · `Modalidades 12 de 12`. O marketing diz "mais de 1.400 portais"; a tela confirma 1.441. Busca livre em "medicamentos" retorna **48.492 licitações**; com filtro, 2.008.

**Motor de palavras-chave (a peça mais bem resolvida do sistema):**
- Três campos por linha: `Palavra-chave` · `Palavras complementares` (E) · `Palavras indesejadas` (NÃO).
- Normalização declarada na própria UI: *"Nossa busca é inteligente por padrão, otimizando os resultados, abrangendo **gênero, acentuação, singular e plural**."*
- Cada palavra-chave é uma linha com **ordem, toggle On/Off, editar, excluir e histórico próprio** (versionamento por termo).
- **Grupos de palavras-chave reutilizáveis** entre perfis: Grupo Padrão, Material de Limpeza, Eletrônicos, Serralheria, Gênero Alimentício, Transportes, Material de Construção, Publicidade. Com Exportar / Importar / Renomear (round-trip CSV).
- **`Testes de palavras-chave` — o recurso mais inteligente que vi.** Ao lado do editor, um painel mostra ao vivo quantas licitações aquele termo capturaria (ex.: `2.098 resultado(s)`) e a amostra real com o termo destacado no objeto. Você calibra o recall **antes** de salvar o perfil. Lançado 01/12/2025.

**Perfis de busca:** múltiplos perfis nomeados por vertical (Alimentos, Calibração, Construção Civil, Distribuidora, Engenharia ×3, Licitações 2026, Materiais…), cada um com anotações, data de atualização, histórico e exclusão. Wizard de 4 passos: Dados básicos → Configurações de busca → Configurações de envio → Resumo.

**Entrega:** e-mail, dias da semana (5 toggles) e 4 horários fixos (07h/10h/13h/16h), com aviso honesto *"o recebimento pode acontecer em até duas horas após o horário indicado"*. E uma regra de higiene: **"Os perfis que não interagirem com os e-mails enviados em 40 dias deixarão de recebê-los"**.

**Meus Avisos (a caixa de entrada):** 128.566 avisos. Abas `Todos os avisos` · `Favoritos` · `Órgãos favoritos` · `Lixeira`. Ações em massa (Favorito, Órgão favorito, Enviar para…, Remover), Modo lista, ordenação por Data de Envio/Data Final.

Cada aviso traz: Portal de captura · Licitação · UASG · Modalidade · Local · **Cadastrar (status: "Não enviado")** · ID Effecti · Data inicial/final/publicação · **Perfil de busca que capturou** · Objeto com o termo destacado · e uma **tabela item a item**: Grupo | Itens | Descrição | Exclusivo ME/EPP | Quantidade. Badge `Parcial ME/EPP` / `Exclusivo ME/EPP` no cabeçalho.

Botões por aviso: abrir portal · anexos · abrir em nova aba · favoritar · órgão favorito · encaminhar · e-mail · descartar · **Aimê** (IA de análise de edital) · e um menu "Decidiu participar?" → **Cadastrar** ou **Agenda**.

Filtro avançado com 17 campos, incluindo três que só existem porque o motor de busca é auditável: **Perfil de busca**, **Grupo de palavras-chave**, **Palavra-chave**.

### 2.2 Cadastrar (o verbo que não temos — parte 1)

3.320 propostas registradas na conta real. Portais suportados na amostra: Licitações-e, ComprasNet, Compras Santa Catarina, BNC, Licitanet, BLL.

Tela `Cadastrar Proposta`:
- Portal + **Versão do portal** (Portal Antigo / Novo) + Empresa + **`Status Portal: 🟢 Operante`** — monitor de saúde do portal alvo, exposto ao usuário.
- **`Tempo médio para envio ao portal: 3s`** — SLA declarado.
- Nº licitação → **`Carregar Itens`**: *"A plataforma busca automaticamente todos os dados dos itens no portal para você."*
- Grid de itens: Item | Descrição | Quantidade | Unitário | Total | Unidade | T.Diferenciado, com import/export, desfazer, imprimir, anexar, `Preencher Automaticamente` por lote e **autosave a cada 30 segundos**.
- `Cadastrar Anexos` → **`Salvar e Enviar`**: *"Sua proposta será enviada para análise e acompanhamento no portal."* — o robô posta a proposta no portal.
- Integração de terceiro embutida: **`Cotação Seguro Garantia`**.
- Lista `Minhas Propostas` com semáforo de status por linha (enviada ✔ / pendente ▬ / em processamento ⊕), `Progresso do envio`, Filtros, Exportar.

Promessa comercial na própria UI: *"economize até 80% do seu tempo"*.

### 2.3 Disputar (o verbo que não temos — parte 2)

Portais: Licitações-e, ComprasNet, BLL, BNC (+ **Dispensa eletrônica em BLL e BNC**, lançada 07/08/2025).

Tela de disputa ao vivo:
- Grid por item: Item | Tempo (countdown) | **Valor Limite** | **Lance Fechado** | Seu Último Lance | Melhor Lance | Descrição | Valor total | Situação | ▶ iniciar.
- **Telemetria de latência visível** (ícone de sinal com `0,146s`) — vendem velocidade como feature.
- Abas `Mensagens do chat` e **`Operações realizadas`** (log de auditoria do robô).
- Botões `Iniciar disputa` · `Ações da Disputa` · `Configurações` · pausar.

**Dashboard do Disputar:** `78% de sucesso` (itens vencidos com margem), R$ total vencido, nº de licitações e itens disputados, gráfico "Relação de Aproveitamento por Item" (barra + linha por mês), "Comparativo entre Órgãos" (sunburst: Total Vencido × Qtd Itens × Qtd Licitações) e tabela "Últimas Disputas".

### 2.4 Monitorar (onde eles resolvem a DOR #1 da ENIAC)

`Minhas Licitações` agrupadas por portal (ComprasNet, BLL, BNC…) e por modalidade (Pregão Eletrônico, Dispensa Eletrônica). Colunas: Empresa, Número, Órgão, Usuário, Observações, **Última verificação** (timestamp do polling, exposto), Ações.

Painel de **Mensagens**: log completo do chat da sessão, linha a linha, com etiqueta `PREGOEIRO` / `ALERTA`, data da mensagem e data da leitura. Cadastro manual de licitação a monitorar: Portal + Empresa + Código + `Buscar no Portal` + palavras-chave + observação.

Novidades recentes do módulo: **Diligência CN** (alertas de diligência do ComprasNet, 01/12/2025) e **Licitar Digital** como portal novo (29/07/2025).

Este módulo é literalmente a frase do áudio da cliente: *"seria legal se o aplicativo acompanhasse as licitações e notificasse sempre que tivesse movimentação — porque aconteceu de a gente não acompanhar e acabar perdendo a licitação."*

### 2.5 Visão de Dados → Análise de Mercado

**Aviso na própria tela: "Os dados apresentados nesta tela são obtidos diretamente do Portal Nacional de Contratações Públicas (PNCP)."**

Filtros: Termo para pesquisa* · Termos indesejados · Período* (Últimos 12 meses) · Fonte de captura* (`Selecionados 14 de 14`) · Esferas · Modalidade · Estado · Cidade · **`Buscar por concorrente` (toggle) → CNPJ ou nome da empresa**.

Saída (`Gerar Relatório`):
- 8 cartões: Valor Total (1,09 B) · Itens Vencidos (59.062.769,6) · **Média de valores (18,37 = "Valor Total ÷ Qtd de Itens Vencidos")** · Empresas vencedoras (1.288) · Maior valor (328 M) · Principal estado (CE, 340 M) · Principal órgão (Município de Sobral, 328 M).
- Gráfico de barras dos objetos que mais movimentam valor.
- **`Detalhamento dos itens vencidos`**: Item | Data | Órgão | Estado | Empresa | **CNPJ** | Valor unitário | Valor total | 🔗 link para a fonte. 3.315 registros, com filtro próprio (Item/Órgão/Estados/Empresa) e Exportar.
- **`Analisar com IA`** → painel com 5 seções fixas: *Visão geral do mercado* · *Leitura de concorrência* · *Estados e órgãos que mais compram* · *Como os itens estão sendo comprados* · ***O que você pode não ter percebido nesse mercado***.
- `Exportar para PDF`.

---

## 3. O placar honesto

### 3.1 Onde eles ganham de nós, sem discussão

| # | O que eles têm | O que temos | Tamanho do buraco |
|---|---|---|---|
| 1 | **1.441 portais de captura** | 1 fonte: PNCP (1.242 itens, 100% `source: "pncp"`) | Estrutural. Nosso kill-gate de cobertura deu **45% (reprova)** e os buracos foram exatamente **Abadiânia (BNC, município pequeno)** e **CEASA/GO (BLL, estatal)** — ou seja, o que falta é **captura direta de portal**, que é precisamente o que os 1.441 resolvem. |
| 2 | **Motor de palavras-chave com teste ao vivo** | filtro por CNAE/keyword hardcoded no script de descoberta | Grande, mas barato de fechar. |
| 3 | **Cadastrar** (postar proposta no portal) | inexistente | Verbo inteiro ausente. |
| 4 | **Disputar** (robô de lance + dashboard de aproveitamento) | inexistente | Verbo inteiro ausente. |
| 5 | **Chat do pregoeiro agregado + "última verificação"** | `MesaTab`/`AcompanharTab` sem coleta real; notificação desligada por design (`noyce-readiness.ts`) | **É a DOR #1 declarada da cliente.** Buraco mais caro em termos de valor percebido. |
| 6 | **Parsing item a item** (Grupo/Item/Descrição/Qtd/Unidade/ME-EPP) | `editalRequirements` vazio em 1.242/1.242 itens | Médio. |
| 7 | **Atribuição de captura** (qual perfil/palavra trouxe cada aviso) + filtro por isso | nenhum | Pequeno, mas é o que torna o motor auditável. |
| 8 | **Dashboard de aproveitamento próprio** (78% sucesso, por órgão, por mês) | nenhum | Médio — é o único lugar onde o cliente vê o software se pagar. |

### 3.2 Onde estamos empatados

- **Análise de mercado a partir do PNCP.** Eles declaram PNCP como fonte da tela; nós construímos `MarketStructure`/`Competitor`/`PriceBand` do mesmo PNCP (`market-snapshot.json`, HHI real: Águas Lindas 2054, Novo Gama 3018, Pirenópolis 2929, **Anápolis 4447 = concentrado**). A matéria-prima é a mesma. A diferença está em quem empacota melhor — e hoje eles empacotam melhor a apresentação, e nós empacotamos melhor a verdade (§3.3).
- **Busca por concorrente via CNPJ.** Eles têm o toggle; nós temos o ranking com CNPJ, share, R$ total e badge de incumbente.

### 3.3 Onde nós ganhamos deles (e é aqui que o produto vive)

1. **Proveniência por campo.** Nós marcamos cada número como `grounded` / `inferred` / `gap`, rastreamos `sourceContractIds`, exibimos trust-meter de cobertura e escondemos o painel quando `coveragePct < 0,5`. **O Effecti não mostra confiança em lugar nenhum.** E o preço disso aparece na cara: a métrica-estrela deles, `Média de valores = Valor Total ÷ Qtd de Itens Vencidos`, dá **R$ 18,37 para "medicamentos"** — ela divide reais por uma soma de quantidades em unidades incompatíveis (caixa, comprimido, frasco, serviço). É um número que não significa nada, exibido como KPI de topo.

2. **Geografia por raio.** Eles filtram por Estado e Cidade em listas. Nós filtramos por **haversine 500 km da sede** sobre 447 municípios IBGE, cruzando GO/DF/MG/TO/MT/BA/SP. Para uma construtora que atende num raio e não numa UF, "Estado = GO" descarta Unaí, Paracatu e Uberlândia, e inclui Goiás inteiro que ela não atende. **Nosso recorte é mais certo que o deles para este cliente.**

3. **Habilitação, prazo e recurso.** Temos `noyce-habilitation` (612 linhas), `noyce-checklist`, `noyce-deadline` (275 linhas, preclusão), `noyce-declaracoes`, `noyce-bdi`, `noyce-planilha`, `noyce-recurso-minuta`, `noyce-impugnacao-minuta`, `noyce-suspicion` (detector de direcionamento), `DocChat`, `ReviewDossier` (709 linhas de review). **O Effecti não tem nada disso.** O `Aimê` deles lê o edital; ele não monta dossiê, não casa atestado com exigência, não conta prazo, não redige recurso.

4. **A vertical de obras.** Todo o modelo de dados do Effecti é de **pregão de bens**: Grupo, Item, Descrição, Quantidade, Unidade, Valor unitário, `Carregar Itens`, `Meus Produtos`. Concorrência Eletrônica de obras — que é 100% do dataset real da ENIAC — não tem "itens" nesse formato: tem planilha orçamentária, BDI, atestado técnico-operacional/profissional, CAT/CREA, garantia de ~1%. **A arquitetura deles é estruturalmente errada para o nosso caso de uso**, e é caro para eles consertar porque o produto inteiro assume item.

---

## 4. O que copiar — 5 itens, em ordem de retorno

### C1. Motor de palavras-chave com teste ao vivo ⭐ prioridade máxima
Copiar quase literal, porque resolve nosso problema real (cobertura 45%) pelo lado da precisão e é barato:
- `palavra-chave` + `complementares (E)` + `indesejadas (NÃO)` por linha, com toggle On/Off e histórico.
- Normalização PT-BR: gênero, acentuação, singular/plural (nosso `bge-m3` já cobre semântica; falta o lexical barato).
- **Grupos reutilizáveis** — e para a ENIAC os grupos já se escrevem sozinhos: `Obras Civis`, `Pavimentação`, `Drenagem`, `Reforma Predial`, `Saneamento`, `Terraplenagem`.
- **Painel de teste ao vivo contra o `discovery-snapshot.json` que já temos em disco.** 1.242 itens locais = a prévia é instantânea e não custa chamada de API. Isto é uma tarde de trabalho e é a feature mais impressionante do produto deles.

### C2. Atribuição e auditabilidade da captura
Cada oportunidade guarda **qual perfil e qual palavra a trouxe**, e a UI filtra por isso. É o que transforma o buscador de caixa-preta em ferramenta ajustável — e é o que permite ao usuário confiar quando o volume cresce.

### C3. "Última verificação" exposta + agregação de mensagens do pregoeiro
A coluna `Última verificação` do Effecti é meia linha de UI e vale muito: prova que o robô está vivo. Combinada com o log de mensagens, é a resposta à DOR #1.
**Nossa versão deve ser melhor no ponto em que eles são fracos:** eles mostram a mensagem; nós devemos mostrar **a mensagem + o que fazer + o prazo + o dono**, usando `noyce-deadline` (preclusão) que já existe. "PREGOEIRO: solicito diligência" → *"Responder diligência até 13/08 17h — responsável: Camila — perder o prazo preclui a habilitação."*

### C4. Item/lote como entidade — mas na versão obras
Não copiar `Meus Produtos`. Copiar o **princípio**: a oportunidade tem filhos com valor e quantidade. Na nossa vertical os filhos são **lote → serviço → planilha/BDI**, e já temos `noyce-planilha` e `noyce-bdi` para isso. Isso destrava preço-alvo por lote em vez de por edital inteiro.

### C5. Dashboard de aproveitamento próprio
`% de sucesso`, R$ vencido, aproveitamento por órgão e por mês. É a tela que faz o cliente renovar o contrato, e é a única do sistema deles que fala de **você**, não do mercado. Nós temos vantagem estrutural aqui: com `noyce-review` e o histórico da própria ENIAC podemos mostrar **por que perdeu**, não só que perdeu — coisa que eles não conseguem, porque o PNCP só publica o vencedor.

---

## 5. O que NÃO copiar

1. **Os 1.441 portais.** É a economia deles, não a nossa. Um raspador nacional é um centro de custo permanente com quebra semanal. Nosso alvo é ~447 municípios num raio, e a lei obriga todos eles a publicar no PNCP. **A resposta certa ao gap de cobertura não é "1.441 portais", é "PNCP + os 3 portais onde a ENIAC realmente disputa" (BLL, BNC, PCP)** — que é exatamente onde o kill-gate falhou.

2. **`Média de valores` e KPIs sem denominador.** Nunca exibir uma média que soma unidades incompatíveis. Nosso P25/mediana/P75 com `sampleSize` e `grounding` é superior e deve continuar assim, mesmo parecendo menos "vendedor".

3. **Cadastrar/Disputar como automação autenticada — não agora, e não sem decisão explícita do owner.** Este é o ponto mais sério do teardown, e está no §6.

---

## 6. A decisão que as capturas forçam: automação autenticada

`Cadastrar` e `Disputar` são os dois módulos onde o Effecti **opera o portal com a credencial do cliente**: posta proposta, envia anexo, dá lance, lê chat. É de lá que vem "economize 80% do tempo" e "78% de sucesso".

Nosso `CONTEXT.md §12` diz, textualmente: *"Automação autenticada continua bloqueada até fechar consentimento, ToS, vault, logs e auditoria."* E o spike `08-fontes-disputa-stage5` já decidiu **D3 = BUILD** para o Stage 5.

As capturas mostram que **existe um concorrente estabelecido operando isso comercialmente há anos, com telemetria de latência e status de portal exposto ao usuário**. Isso não torna a questão jurídica menor, mas remove a dúvida sobre viabilidade técnica e sobre aceitação de mercado.

**Três caminhos, e o owner precisa escolher:**

| Caminho | O que entrega | Custo/risco |
|---|---|---|
| **A. Ler, nunca escrever** | Monitorar sessão + notificar movimentação (DOR #1) sem nunca postar nada | Menor risco de ToS; não entrega o "80% do tempo" |
| **B. Escrever com humano no gatilho** | Software monta a proposta/lance completo; **a pessoa clica enviar** no portal | Meio-termo honesto; preserva a regra "IA nunca auto-envia"; entrega ~70% da economia de tempo |
| **C. Escrever autônomo** | Paridade com Effecti | Exige vault + consentimento formal + auditoria + aceite de ToS de cada portal |

**Recomendação:** **B**. Ela é compatível com a regra permanente do projeto (a IA não dispara ato externo sozinha), entrega quase toda a economia de tempo, e mantém a assinatura humana em cada ato processual — o que num contexto de licitação pública não é fricção, é proteção.

---

## 7. Roadmap sequenciado

**Slice A — Motor de busca auditável — ✅ ENTREGUE (12/Ago)**
`palavra-chave + complementares + indesejadas` · grupos por vertical de obras · normalização PT-BR · **teste ao vivo contra o snapshot local** · atribuição perfil/palavra por oportunidade · filtro por perfil e palavra. → Fecha C1 + C2 e ataca cobertura pelo lado da precisão. Detalhe de execução em §9.

**Slice B — Fechar o kill-gate com adapters de portal (o bloqueio real)**
Os 45% reprovados foram BNC (Abadiânia) e BLL (CEASA). Adapters de leitura para **BLL + BNC + PCP** dentro do raio, feed multi-fonte no `discovery-snapshot`, `coveragePct` com denominador corrigido (contratações de obras, com cross-check nos Dados Abertos bulk). **Enquanto isso não passar de 50%, tudo à frente é construir sobre areia.**

**Slice C — Movimentação e prazo (a DOR #1)**
`Última verificação` exposta · agregação de mensagens por licitação · e o diferencial: cada mensagem vira **ação + dono + prazo + consequência** via `noyce-deadline`. Notificação (e-mail primeiro, WhatsApp depois) com a mesma disciplina de higiene do Effecti (perfil inativo para de receber).

**Slice D — Lote/planilha como entidade + preço-alvo por lote**
Liga `noyce-planilha` e `noyce-bdi` ao `PriceBand` já existente.

**Slice E — Dashboard de aproveitamento da ENIAC**
`% sucesso`, R$ vencido, por órgão, por mês — e "por que perdeu", que eles não têm.

**Slice F — Cadastrar/Disputar no modelo B**, só depois da decisão do §6 e do vault fechado.

---

## 8. Posicionamento resultante

O Effecti é **amplo e raso**: 1.441 portais, todo mundo, todo item, nenhuma opinião sobre o que fazer.

O caminho da ENIAC não é ser um Effecti menor — perderíamos em todas as dimensões que eles escolheram. É ser o oposto exato:

> **Fundo e estreito: obras/engenharia, num raio de 500 km, com dossiê de habilitação, prazo processual, recurso e — acima de tudo — cada número com sua procedência.**

Os três ativos que o Effecti não consegue copiar barato são: **a vertical de obras** (a arquitetura deles é de item de pregão), **o raio** (eles filtram por UF), e **a honestidade do dado** (o R$ 18,37 é a prova de que eles não têm nem o hábito).

---

---

## 9. Execução — Slice A entregue (12/Ago)

**Decisão do owner registrada:** automação autenticada segue o **caminho B** — o software monta a proposta/lance por inteiro, a pessoa clica enviar. Slices `Cadastrar`/`Disputar` (F) ficam para depois do vault; nada de ato externo autônomo.

### 9.1 O que foi construído

| Arquivo | Papel |
|---|---|
| `apps/noyce/lib/noyce-keywords.ts` | Motor puro: dobra PT-BR, casamento por token com offsets, avaliação de regra, atribuição, probe |
| `apps/noyce/lib/data/keyword-groups.json` | 5 grupos · 21 regras · 1 perfil (`Obras ENIAC`) — **semeados com termos reais do snapshot** |
| `apps/noyce/app/api/keywords/route.ts` | `GET` config+universo · `POST mode=rule` (recall de 1 regra) · `POST mode=profile` (cobertura+órfãos) |
| `apps/noyce/components/monitorar/KeywordStudio.tsx` | Editor de 3 campos + painel de teste ao vivo com destaque |
| `apps/noyce/components/monitorar/MonitorarTab.tsx` | Crédito de captura por card + filtro "Capturado por" + toggle do estúdio |
| `apps/noyce/tests/noyce-keywords.test.mjs` | 26 testes travando o contrato |

### 9.2 A dobra PT-BR

Cobre as 4 dimensões do padrão de mercado — acento, caixa, singular/plural, gênero — e **não funde raízes diferentes**, que é onde a coisa costuma quebrar:

- une: `obra/obras` · `ponte/pontes` · `material/materiais` · `nível/níveis` · `luz/luzes` · `homem/homens` · `asfáltico/ASFALTICAS` · `público/pública`
- separa: `escola` ≠ `escolar` — sem isso, "material escolar" entraria como obra
- casa por **token inteiro**: `obra` não casa dentro de `obraria`
- multi-palavra atravessa pontuação: `meio fio` casa `meio-fio`

### 9.3 A calibração — e o erro que ela encontrou no próprio seed

O painel de teste foi usado para calibrar antes de escrever o seed, e pegou dois erros meus:

1. **Veto amplo demais.** `construção NÃO aquisição` matava 37 editais, mas entre eles havia obra real. O veto correto é a expressão `"material de construção"` — cirúrgica, 29 descartes, todos compra de material. `equipamento` foi **rejeitado** como indesejada: derrubava "obras de engenharia civil para construção de três unidades operacionais".
2. **Refino restritivo demais.** A regra `engenharia + execução (E)` capturava 220 e deixava escapar **43 obras reais** — subestação elétrica, geotécnica, galeria pluvial, serviços comuns SINAPI. Virou `OU` sobre 8 verbos de obra → **340**. Esse era um furo de recall que existia e ninguém veria sem o painel.

### 9.4 Números reais (universo: 1.242 editais do radar, PNCP, raio 500 km)

```
perfil "Obras ENIAC"        925 capturados de 1.242  (74,5%)  ·  317 órfãos
  Obras civis                747        Infraestrutura viária        62
  Edificações públicas        61        Pavimentação/recapeamento    40
  Drenagem e saneamento       15
```

Dos 317 órfãos, só **27** ainda cheiram a obra — e inspecionados um a um são exclusões corretas (laboratório geotécnico, material de consumo, limpeza predial). O resto é ruído legítimo que o filtro geográfico trouxe: material de limpeza, refeição hospitalar, informática, transporte de carga.

### 9.5 Verificação

`npm test` **455/455** · `npm run typecheck` limpo · `npm run build` limpo · API exercitada ao vivo em servidor real (as 4 rotas, incluindo destaque com offsets no texto original e mensagem de veto legível).

⚠️ Nota de ambiente: no Git Bash o `curl -d` com acento corrompe o corpo e o probe volta 0. Com corpo UTF-8 em arquivo, `"pavimentação"` e `"pavimentacao"` retornam ambos **81** — a dobra de acento funciona de ponta a ponta. Não é bug do motor.

### 9.6 O que isto ainda NÃO faz

- A config vive em `localStorage` (sem banco). Os 4 usuários da ENIAC não compartilham perfil ainda.
- O motor roda **na exibição**, não na captura: o `build-discovery` continua trazendo tudo do raio e a palavra-chave classifica depois. É o certo por ora (permite recalibrar sem rebuild), mas quando a captura passar a filtrar, o mesmo módulo já serve — é puro e sem I/O.
- Histórico/versão por palavra-chave (o relógio do concorrente) não foi feito.
- Não resolve cobertura de fonte: o buraco de 45% do kill-gate é BLL/BNC e continua sendo o **Slice B**.

---

*Teardown por Orion (aios-master), 12/Ago/2026. 106 capturas lidas integralmente + auditoria do `apps/noyce` no commit corrente. Números do Noyce verificados ao vivo no `discovery-snapshot.json` gerado 12/Ago 20:50. §9 acrescentada após a entrega do Slice A na mesma sessão.*
