# Conclave de Arquitetura — Parecer: SPED, Fisco Digital & Captura

> **Expert:** Roberto Dias Duarte (mind clone) — Tecnologia Fiscal & Fisco Digital · Mega Squad B2
> **Data:** 2026-06-11 · **Insumos:** CONTEXT.md (D1-D9), PRD `10`, Arquitetura `11` v0.1, planilha Comparativo Gestor, **dado ao vivo** (fontes no rodapé)
> **Modo:** análise independente — não li os pareceres dos outros experts.
> ⚠️ Parecer de PRODUTO sobre tecnologia fiscal. Apuração, classificação e parecer formal exigem profissional habilitado.

---

Vou direto ao ponto, porque é assim que eu trabalho: eu não sou guru, sou mestre de obras. Entreguei o meu próprio SPED voluntariamente em 2008 — fui a 41ª empresa a entregar a ECD do país — e passei vinte anos vendo escritório contábil quebrar a cara com ferramenta bonita que não roda na segunda-feira de pico. Então a régua aqui é uma só: **isso roda num escritório de 5-40 pessoas com 50-500 CNPJs, no dia 5 do mês, com o analista afogado?**

E antes de tudo, o enquadramento: esse produto está tentando surfar a maior mudança estrutural desde o próprio SPED. A Reforma com cClassTrib é **infraestrutura, não acessório** — reconfigura o trabalho, o preço e a competição do escritório por sete anos. Quem ler isso como "mais uma obrigação" perde o timing, e timing perdido é fatal. Já vimos esse filme em 2007: muitos acharam o SPED exagero, e virou a tese central do setor. Então a tese do produto está certa. O problema está nos detalhes operacionais — e é neles que escritório morre.

---

## 1. Comprar a captura (D2): decisão certa — mas ninguém fez a conta do COGS

**A decisão de comprar está corretíssima.** O maior custo do mundo atual é o custo de oportunidade: gastar os 8 meses de runway reconstruindo NFeDistribuicaoDFe, NSU, backoff e manifestação de evento — coisa que Arquivei/Qive vendem a partir de R$39,90 — é gastar o tempo para fazer o que o outro já fez melhor que você. Crie só o 1% que é seu: o motor de auditoria e a trilha de boa-fé. O conclave acertou ao reverter o agente local; 500 daemons em máquina de escritório com antivírus matando .exe é exatamente o tipo de SPOF silencioso que destrói confiança — e confiança é o único ativo de um produto fiscal.

E o mercado acabou de dar uma aula ao vivo sobre risco de provider: a **Nuvem Fiscal anunciou desativação em 22/04/2026 e desliga em 31/07/2026 — noventa dias de aviso**. Quem dependia dela está migrando às pressas agora. Lição: o provider é alugado, o **adapter de ingestão é nosso e agnóstico**. XML + metadados entram por um contrato interno nosso; trocar de provider tem que ser troca de pneu, não troca de carro.

### Qual provider eu escolheria

**Focus NFe, e a razão é prosaica: preço público.** Hoje (jun/2026):

| Plano Focus | Mensal | Docs inclusos | Excedente | CNPJs |
|---|---|---|---|---|
| Solo | R$ 89,90 | 100 | R$ 0,10/doc | 1 |
| Start | R$ 113,90 | 100/CNPJ | R$ 0,10/doc | 3 (+R$37,90/ad.) |
| **Growth** | **R$ 548,00** | **4.000** | **R$ 0,12/doc** | **ilimitados** |
| Enterprise | sob consulta | — | — | ilimitados |

Recebimento (captura) de NF-e, CT-e e **NFS-e Nacional** incluso em todos; 3.000+ municípios integrados; integração de município novo por R$199 fixos em 15 dias úteis; sem fidelidade e sem setup. O **PlugNotas** (TecnoSpeed) é tecnicamente forte — já tem a **Consulta Distribuição DF-e da NFS-e Nacional**, exatamente a peça de captura do tomador no ambiente nacional — mas o preço é "solicite um orçamento", bilhetagem negociada. Para uma operação com 8 meses de caixa, custo previsível e contratável em 1 dia vale mais que feature marginal. Recomendação prática: **fechar Focus como primário, rodar o spike com PlugNotas em paralelo** (uma carteira de teste em cada), porque a cobertura real de captura — não a de folder — só aparece com CNPJ de verdade.

### O calo NFS-e municipal: melhorou MUITO, mas leia o que a adesão significa

O dado vivo: a NFS-e Nacional é **obrigatória desde 01/01/2026 (LC 214/2025)**, e **2.864 entes federados já aderiram ao ambiente nacional — cerca de 70% do volume de emissões do país** (lista RFB atualizada em 18/05/2026, crescendo toda semana). E o detalhe que importa: **São Paulo aderiu mantendo emissor próprio, mas compartilhando tudo no ADN**. Município que não adere perde transferência voluntária federal. A padronização que matou a ferramenta antiga do Renan (15 layouts) está sendo resolvida pelo Estado — surfar isso é a leitura certa.

**Mas atenção a três letras miúdas:**

1. **70% do volume ≠ 70% da carteira do ICP.** O cliente MEI/Simples de serviço do interior está exatamente na cauda dos 30% (município que ainda não compartilha no ADN). Para esses, captura de NFS-e do tomador continua sendo scraping de portal de prefeitura — e cobertura de **emissão** do provider (os "3.000 municípios") não é cobertura de **captura**. O spike de captura tem que medir uma coisa só: *% de NFS-e da carteira-piloto do Renan efetivamente capturada sem mão humana*. Esse número, por município real, decide se o Concierge vira produto.
2. **DANFSe:** a API nacional de geração do DANFSe **é descontinuada em 01/07/2026** — a visualização passa a ser responsabilidade dos sistemas. Se o produto exibe nota pro contador, precisamos renderizar nosso próprio DANFSe a partir do XML. Pequeno, mas é trabalho que ninguém orçou.
3. **A conta do COGS que falta no PRD.** Escritório típico do ICP: 200 CNPJs × ~50 docs/mês = **10.000 docs/mês**. No Focus Growth: R$548 + 6.000 × R$0,12 = **~R$1.270/mês ≈ R$0,13/doc ≈ R$6,35/CNPJ/mês só de captura**. O corredor de pricing do CONTEXT (§10) fala em "R$200–R$400+/mês". **Não fecha.** Para o escritório de 200 CNPJs, o custo do insumo já é 3x o teto do corredor. Ou o tier por nota auditada (D7) repassa isso de verdade (Starter ≤10k notas não pode custar R$400), ou a captura é **seletiva** — só os CNPJs de alto SKU onde a auditoria paga a conta (farmácia, posto, mercado), com o resto da carteira em upload manual/Documentize. Eu prefiro a segunda: captura não é o produto, é insumo do motor. Capturar nota de MEI de serviço com 3 notas/mês para auditar o quê? Unit economics da captura entra no pricing **agora**, não na Fase 2.

## 2. Integra Contador: a mina é real, mas o SERPRO cobra até o seu erro

Sou suspeito — passei anos dizendo que o Fisco digital veria tudo em tempo real, e o Integra Contador é a prova: o próprio Estado vendendo API do e-CAC. O que funciona DE VERDADE hoje (catálogo SERPRO, jun/2026):

- **Com procuração eletrônica obrigatória:** Caixa Postal (código 00006), **SITFIS/relatório de situação fiscal (00002)**, PGDAS-D/DEFIS (00146), DCTFWeb (00103), Pagamentos (00004), parcelamentos Simples/MEI (PARCSN, PERTSN, RELPSN, PARCMEI, RELPMEI), e-Processo (00051).
- **Sem procuração:** PGMEI, DASN-SIMEI, CCMEI, SICALC, DTE e — a chave do onboarding — **PROCURACOES** (consultar procurações existentes).

**Custo real:** pós-pago, 8 faixas regressivas em 3 categorias (Consultas/Emissão/Declaração). Estimativa de mercado (SCI): escritório de 50 clientes Simples ≈ **R$96/mês (R$1,92/CNPJ)**; 200 clientes ≈ **R$334/mês (R$1,67/CNPJ)**. Contra um add-on de ~R$2.000/mês, a margem é brutal mesmo — o founder está certo, e o Renan vendia R$8-15k/mês disso na CIEG porque a dor é visceral: **caixa postal não lida = intimação perdida = multa**. No mundo do Big Brother Fiscal, o escritório que não vê a caixa postal do cliente está dirigindo de olho fechado.

**Mas três realidades operacionais que o PRD ainda não encarou:**

1. **O SERPRO cobra retornos 200, 202 e 403.** Leu certo: **requisição negada por falta de procuração é cobrada**. Varredura burra em carteira com procurações vencidas/incompletas = pagar pelo próprio erro, em lote, todo mês. O produto PRECISA de um gate: antes de varrer qualquer CNPJ, consultar PROCURACOES (que não exige procuração) e só disparar consulta para quem tem outorga válida e com o serviço certo no escopo. Isso é regra de motor, não detalhe.
2. **Procuração em lote não existe — e não precisa existir.** Não há outorga em massa: cada cliente outorga individualmente no e-CAC (certificado digital próprio ou gov.br prata/ouro). Só que o medo dos "200 onboardings" está mal formulado: o escritório do ICP **já tem** procuração eletrônica da maioria da carteira — é pré-requisito operacional de DCTFWeb/PGDAS desde sempre. O onboarding real não é *criar* 200 procurações; é **auditar** 200: quais existem, quais vencem em 60 dias, quais não incluem Caixa Postal no escopo. A primeira tela do add-on deveria ser exatamente essa: "sua carteira tem 143 procurações válidas, 31 vencendo, 26 sem outorga — aqui está o kit para regularizar". Transformamos o gargalo em feature de onboarding. O gargalo residual verdadeiro: o cliente pequeno sem certificado e sem gov.br prata — esse precisa de roteiro assistido (e é o cliente que o contador mais demora a regularizar).
3. **CND não está no Integra Contador.** O catálogo não emite certidões — CND federal é produto à parte na Loja SERPRO, e estaduais/municipais/trabalhista nem existem lá. **O Infosimples continua necessário** para o painel de certidões completo, e isso não é "gap" pequeno como o PRD sugere: na cabeça do contador, "diagnóstico fiscal" = CNDs em dia. Metade do valor percebido do add-on mora numa API de terceiro com custo próprio. Orçar os dois desde o dia 1.

E o aviso de paridade: **isso aqui não é diferencial — é aposta de entrada**. O Nibo Radar e-CAC já entrega hoje caixa postal, DARFs, DAS, parcelamentos, situação fiscal e CND da carteira inteira, com criação automática de tarefa a partir da mensagem da caixa postal. A categoria está lotada (e-Auditoria, Acessórias, Jettax...). O D9 está certo: e-CAC é mina de receita e infra, não cunha. Quem achar que vai ganhar mercado com painel de e-CAC em 2026 está olhando pelo retrovisor.

## 3. Fluxo operacional: o Concierge é a decisão mais sábia do pacote — e o "humano no loop" é o ponto cego

O fluxo Concierge → motor → captura comprada → e-CAC add-on bate com a realidade? **Em essência, sim** — e o Concierge manual primeiro é a coisa mais pé-no-chão desse projeto inteiro. Laudo à mão para 5 escritórios valida a única hipótese que importa: o contador PAGA por apuração defensável. Tudo o mais é detalhe de engenharia.

Onde vai travar na implantação (falo de quem viu dezenas de implantações de sistema em escritório):

- **O analista não sabe julgar cClassTrib — ainda.** O "humano no loop" pressupõe alguém capaz de avaliar a divergência apontada. Em 2026, NINGUÉM no escritório de 5-40 pessoas domina cClassTrib; o assunto tem meses de vida prática. Se o produto cospe "item 47: divergência, confiança 0,82" sem explicar **por quê** (regra, fonte, fundamentação legal em linguagem de gente), o analista faz uma de duas coisas: aprova tudo no atacado (o loop vira teatro e a trilha de boa-fé vira ficção) ou trava e não aprova nada (o produto morre na gaveta). Cada apontamento precisa **ensinar enquanto pede julgamento**. Inteligência é automatizável; julgamento não é — mas julgamento sem formação também não existe. O produto que entender isso cria o contador 2.0 dentro do escritório do cliente; é o moat em cima do moat.
- **Calendário de pico.** A rotina fiscal vive entre os dias 1 e 12. Auditoria que aponta divergência DEPOIS do lançamento no Domínio é retrabalho — e retrabalho em pico é feature desligada. A captura+auditoria precisa rodar D+1 da emissão, com a fila de revisão pronta ANTES da janela de lançamento. Esse requisito de latência não está escrito em lugar nenhum do PRD.
- **Implantação assistida ou nada.** Escritório de 5-40 pessoas não faz self-service de integração — quem nunca implantou sistema nesse público acha que onboarding é um wizard. É call, é planilha de carteira, é WhatsApp do sócio às 19h. O plano de 8 meses não tem braço de CS; o Renan vai ser o CS nos pilotos (certo), mas a "pendência 3" do CONTEXT (dependência do Renan) fica ainda mais vermelha.
- **Suporte como feature.** O PRD acerta em cheio no "observabilidade como feature" — a queixa nº 1 contra todos os players dessa planilha é suporte. Heartbeat por CNPJ e fila de retry visível é o que faz o contador confiar. Manter isso inegociável.

## 4. Planilha: o que é dor de verdade e o que é enfeite de proposta comercial

Das 21 lacunas, aplico minha triagem de sempre — **infraestrutura ou acessório?** — pela ótica de quem está dentro do escritório:

**Top 5 dor real (em ordem):**

1. **Recálculo automático** — é O produto (a Auditoria). Os concorrentes que marcam esse checkbox fazem conferência de guia/valor; ninguém faz item-a-item contra base cClassTrib/NCM versionada com trilha. É a única linha da planilha que é infraestrutura pura.
2. **Diagnóstico fiscal automatizado (e-CAC)** — dor visceral e recorrente (multa por intimação não lida). Mas é paridade, não diferencial (Nibo Radar etc.). Entra como add-on D9, bem precificado.
3. **Robôs de leitura automática de documentos** — o fiscal vive de PDF lixo que o cliente manda por WhatsApp. O Documentize já cobre boa parte; estender é barato e o impacto no dia-a-dia é imediato.
4. **Integração oficial do WhatsApp** — não é checklist de vendas, é o canal onde o Brasil opera. Cobrança automática de movimento via WhatsApp é a diferença entre receber documento no dia 5 e no dia 25 — e documento atrasado é A causa-raiz da correria do fiscal. (Custo de API oficial Meta à parte; dá pra começar com link/gancho simples.)
5. **Controle de obrigações + monitoramento por colaborador** — o sócio compra sistema pra responder "quem está atrasado com o quê". O Gestorize já tem o esqueleto (agenda de tributações, dashboard operacional); fechar o gap é polimento, não construção.

**Checklist de vendas (ignorar sem dó):** app personalizado para clientes (ninguém baixa o app do contador — o cliente vive no WhatsApp, ver item 4); BPO financeiro e Conciliador Open Finance (é o negócio do Nibo, não o nosso — financeiro, não fiscal); fluxo de caixa e rateio de despesas (contabilidade gerencial, outro produto); "dashboard com desempenho da equipe" como categoria separada (variação do item 5).

**O e-Contínuo (Robô de Upload) muda alguma coisa?** Muda, e mais do que parece: é o **embrião da captura assistida**. Se já varre pasta e sobe documento com reconhecimento de padrão, o Concierge não precisa nem do contador mandando XML por e-mail — instala o e-Contínuo apontando pra pasta do movimento e o laudo manual ganha esteira no dia 0, antes de qualquer contrato com provider. Mas sem confundir as coisas: robô de upload de pasta é **acessório útil**; captura DFe por distribuição é outra natureza. Ele compra tempo, não substitui a Fase 2.

## 5. Reuso do Gestorize (D1): aposta certa, com uma condição suspensiva

Estender em vez de greenfield é a decisão que eu mesmo prego há anos: **não reinvente a roda que o mercado já validou — gaste o tempo no 1% que é seu**. Cadastros, permissões, agenda de obrigações, envio de guias, logs/auditoria e principalmente o Documentize (extração + hash + dedup + `DocumentFeedback`) são 60-70% do chão do app — e o `DocumentFeedback` encaixa de presente no requisito de golden-set/evaluation do motor. Greenfield disso em 8 meses com um dev é suicídio de runway.

**Três riscos, um deles suspensivo:**

1. 🔴 **O código deployável ainda não foi confirmado** (CONTEXT §8.5). A arquitetura inteira está apoiada num ativo que ninguém abriu. Isso não é risco, é **condição suspensiva**: o Spike Gestorize vem ANTES de qualquer story da Fase 1. Se o que existe são specs e fluxogramas, o D1 cai e o plano muda — melhor saber semana que vem do que no mês 4.
2. 🟡 **Dívida técnica desconhecida de tentativa anterior.** Orçar 2-4 semanas de auditoria técnica (dependências, segurança, multi-tenancy real) antes de prometer prazo em cima dele.
3. 🟡 **Gravidade do chassi.** O Gestorize é um gestor de obrigações — exatamente a categoria lotada da planilha. O risco sutil é o produto ser puxado pra "mais um Tareffa/Acessórias com auditoria de brinde". O Gestorize é o chassi; o carro é o motor de auditoria + trilha. Toda decisão de roadmap que priorizar feature de gestão sobre o motor é o retrovisor vencendo o para-brisa.

## 6. SPED/EFD: concordo com o não-objetivo — mas há um mínimo sem o qual o produto não cola

Não competir com Domínio/Alterdata/Fortes/Questor na escrituração: **100% correto**. Reconstruir EFD é custo de oportunidade puro e briga com gigante em terreno dele. Eu disse na live da SCI e repito: não refaça o sistema fiscal que já existe; crie o 1% que é seu diferencial.

**Porém** — e aqui sejo duro — produto fiscal que não fala a língua do fluxo do escritório vira "segunda tela", e segunda tela morre na gaveta. O mínimo inegociável, que NÃO é escriturar:

1. **Saída:** os apontamentos aprovados precisam virar **export no layout de importação do ERP contábil** (Domínio/Alterdata têm layouts de importação documentados há décadas). Se o analista revisa no nosso produto e depois **re-digita** o ajuste no Domínio, nós viramos custo, não solução. Um CSV bem-feito por ERP resolve; é semana de trabalho, não projeto.
2. **Entrada:** aceitar **EFD Contribuições / SPED Fiscal (txt) como INSUMO da auditoria**. O XML diz o que veio na nota; o SPED diz **o que o cliente efetivamente apurou** — a divergência defensável mora exatamente entre os dois. Parsear bloco C/M de um txt de layout público é trivial perto do que o motor já faz, e dobra o valor do laudo. Detalhe que conecta tudo: **a recuperação monofásica (o overlay/isca) tem a evidência DENTRO da EFD Contribuições** — ignorar SPED por completo contradiz a própria estratégia de recuperação do projeto.

Ler SPED como insumo e exportar ajuste não é "fazer escrituração" — é respeitar o fato de que, no escritório real, o ERP contábil é o centro de gravidade e nós somos o satélite inteligente. Satélite que não se comunica cai.

---

## Veredito operacional

**Essa arquitetura roda num escritório real? SIM, COM CONDIÇÕES.** A espinha (comprar captura, Concierge primeiro, motor como moat, e-CAC como add-on, estender Gestorize) está madura e pé no chão — é o desenho que eu faria. Mas três condições suspensivas antes de escrever a primeira story:

1. **Unit economics da captura no pricing JÁ** — R$0,12-0,14/doc × 10k docs/mês estoura o corredor R$200-400; captura seletiva por perfil de CNPJ ou tier que repasse de verdade.
2. **Gate de procuração + Infosimples orçado** — varredura só após auditoria de procurações via API PROCURACOES (o SERPRO cobra o 403); CND completa exige Infosimples desde o dia 1.
3. **Spike Gestorize como condição suspensiva do D1** + ponte mínima com o ERP contábil (export de ajustes + EFD como insumo) — sem isso o produto é segunda tela, e segunda tela morre na gaveta.

A janela é real e o relógio é a Reforma. Toda ameaça é só uma oportunidade que você deixou para depois — mas oportunidade com prazo: agosto de 2026 não espera roadmap.

— Roberto. A IA não substitui o contador; quem não usa IA é substituído por quem usa. 📡

---

### Fontes (dado ao vivo, consultado em 11/06/2026)

- NFS-e Nacional obrigatória 01/01/2026 (LC 214/2025), ADN, APIs Sefin/ADN, NT 004 v2.0: [Certifica](https://certifica.com.br/blog/mudancas-na-emissao-da-nfs-e-entram-em-vigor-em-2026/), [Tecnospeed](https://blog.tecnospeed.com.br/nfse-nacional-tudo/), [CNM](https://cnm.org.br/comunicacao/noticias/municipios-devem-fazer-adesao-obrigatoria-a-nfs-e-nacional-ou-perderao-recursos-em-2026), [Prefeitura SP](https://prefeitura.sp.gov.br/web/fazenda/w/nfs-e_orientacoes)
- Adesão: 2.864 entes ≈ 70% do volume (lista RFB 18/05/2026); SP no ADN com emissor próprio: [SERPRO](https://www.serpro.gov.br/menu/noticias/noticias-2026/sp-adere-nota-fiscal-de-servicos), [Actana](https://actana.com.br/blog/quais-municipios-ja-aderiram-a-nfs-e-nacional-veja-o-mapa-atualizado), [Webmania](https://webmania.com.br/blog/sao-paulo-adere-a-nfs-e-nacional-o-que-sua-empresa-precisa-saber/)
- DANFSe API nacional descontinuada 01/07/2026: [Contábeis](https://www.contabeis.com.br/noticias/76743/danfse-tera-novas-regras-a-partir-de-julho-de-2026/), [reformatributaria.com](https://www.reformatributaria.com/tecnologia/api-do-danfse-sera-descontinuada-em-julho-de-2026-e-emissao-passa-a-ser-feita-pelos-sistemas-das-empresas/)
- Focus NFe planos/preços, 3.000+ municípios, R$199 município novo: [focusnfe.com.br/precos](https://focusnfe.com.br/precos/), [focusnfe.com.br/guides](https://focusnfe.com.br/guides/nfse/municipios-integrados/municipios-da-nfse-nacional/)
- PlugNotas Consulta Distribuição DF-e NFS-e Nacional; preço sob orçamento/bilhetagem: [Tecnospeed atendimento](https://atendimento.tecnospeed.com.br/hc/pt-br/articles/24296936626711-NFS-e-Nacional-Consulta-Distribui%C3%A7%C3%A3o-DF-e), [blog](https://blog.tecnospeed.com.br/consulta-nfse-nacional-no-plugnotas/), [plugnotas.com.br](https://plugnotas.com.br/), [tabela de preço](https://atendimento.tecnospeed.com.br/hc/pt-br/articles/360019622493-Como-funciona-a-tabela-de-pre%C3%A7o)
- Nuvem Fiscal: comunicado 22/04/2026, desativação 31/07/2026: [nuvemfiscal.com.br/suporte](https://www.nuvemfiscal.com.br/suporte/), [fórum ACBr](https://www.projetoacbr.com.br/forum/topic/91922-comunicado-de-desativa%C3%A7%C3%A3o-do-servi%C3%A7o-nuvem-fiscal-22042026/)
- Integra Contador: cobrança 200/202/403, 8 faixas/3 categorias, serviços × procurações, contratação e-CNPJ: [FAQ SERPRO](https://apicenter.estaleiro.serpro.gov.br/documentacao/api-integra-contador/pt/faq/), [Serviços x Procurações](https://apicenter.estaleiro.serpro.gov.br/documentacao/api-integra-contador/pt/servicos_vs_procuracoes/), [Loja SERPRO](https://loja.serpro.gov.br/integra-contador/product/integracontador), [Calima](https://ajuda.calimaerp.com/pt/article/como-funciona-a-cobranca-do-serpro-pelo-integra-contador-wgj834/)
- Custo estimado por carteira (50 cli ≈ R$96/mês; 200 cli ≈ R$334/mês): [Blog SCI](https://www.blog.sci.com.br/post/an%C3%A1lise-de-custos-do-integra-contador-o-que-toda-empresa-cont%C3%A1bil-deve-saber)
- CND fora do catálogo Integra (contratação separada): [Calima CND](https://ajuda.calimaerp.com/pt/article/como-contratar-o-integra-contador-e-a-cnd-junto-ao-serpro-1ta6ja/), [Domínio](https://suporte.dominioatendimento.com/central/faces/solucao.html?codigo=10776)
- Nibo Radar e-CAC (caixa postal, DAS/DARF, parcelamentos, situação fiscal, CND, tarefas automáticas): [nibo.com.br/nibo-radar](https://www.nibo.com.br/nibo-radar), [ajuda Nibo](https://ajuda.nibo.com.br/pt-BR/articles/12590118-conheca-o-nibo-radar-e-cac)
- Tareffa/Ottimizza (gestão de obrigações/prazos, comunicação com cliente): [Ottimizza](https://materiais.ottimizza.com.br/gestao-de-tarefas), [docs](https://docs.ottimizza.com.br/docs-categoria/tareffa/)
