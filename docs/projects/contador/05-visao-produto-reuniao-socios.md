# Projeto Contador — Visão de Produto (Reunião de Sócios)

Data da reunião: 2026-06-04
Fonte: áudio `Projeto contador .m4a.mp4` (103 min) → transcrição limpa em `Downloads/Projeto-contador-transcricao.txt`
Status: síntese da visão dos sócios. Refina/expande `03-status-e-proximos-passos.md` e funde com o Motor Fiscal (`docs/research/contabilidade-automacao/`).

---

## Quem é quem (sociedade)

| Sócio | Papel | % | Notas |
|-------|-------|---|-------|
| **Investidor** | Recurso + estruturação | **40%** | "Eu vou ser o investidor", banca dev e futuro time. Inicialmente sem muita bala. |
| **Breno** | Dev / IA / produto | **30%** | "o problema do dev de IA hoje não é o código, é montar estrutura, roadmap, arquitetura" — abordagem AIOS. Tem sistema próprio de pesquisa/IA. |
| **Renan** | Comercial / carteira | **30%** | 900 clientes em 7 anos vendendo na CIEG (ferramenta IRIS/captura). Conhece o mercado a fundo. Hoje PJ na "Monetária". Abre portas nas contabilidades. Vendia ~R$600k/mês na CIEG. |

Acordo: produto modular, ir devagar enquanto desenvolve (2-3 meses pro core), investidor aloca recurso ~8 meses em dev + estruturação, depois monta **time de venda agressivo com cultura de venda**.

---

## A tese central

> **SaaS vendido PARA o escritório contábil**, que usa/revende **nos clientes dele (as empresas)**. O contador é o canal de distribuição. Não atacar o cliente final direto.

**Princípio anti-churn (repetido várias vezes):** não entregar "de mão beijada / mastigado demais". Se a IA arruma tudo e o contador cancela, perdeu. Tem que gerar **necessidade contínua** → **mensalidade recorrente é o jogo**; recuperação de crédito é bônus esporádico.

**Reposicionamento do valor (insight do Breno, ~57:00 e ~79:00):**
> Não é "dar dinheiro pro contador" — é **otimizar o tempo dele**. "Você tem 5 pessoas; vendo uma ferramenta que otimiza e você precisa de 3 → manda 2 embora." O ganho financeiro (recuperação) é o "a mais".

---

## O CORE do produto (cristalizado ~51:00)

> **Ciclo completo da nota fiscal: Emissão → Captura → Análise/Auditoria → Restituição.**
> Vender ESSE ciclo como o core. Todo o resto (ECAC, gestão, mobile) orbita o core como add-on. "Se começar a fazer tudo que a gente vê, fica bagunçado."

### Módulos (vendidos como escada — um leva ao outro)

| # | Módulo | Papel | Como funciona |
|---|--------|-------|---------------|
| 1 | **Captura de notas** | 🎣 Porta de entrada (fácil, barato) | Cadastra o **certificado da empresa** → varredura automática puxa NFE, CTE, nota compra/venda, CTE tomado/prestado. Sistema lê destinatário/emitente p/ classificar compra vs venda. **Agente local na máquina** captura e armazena sozinho (mata o trabalho repetitivo de entrar→escolher cliente→tipo→baixar, imagina 100 clientes). Web + agente local; export local possível. |
| 2 | **Armazenamento XML** | ➕ Plus | Guardar XML é **obrigatório por lei** (era 5 anos, **agora 15**) e quase ninguém faz. XML é leve (~7KB). Storage barato (Supabase ~$2 / 500GB). Vender em **pacotes de nota**. |
| 3 | **Análise / Auditoria da tributação** | ⭐ Diferencial real | Auditoria automática **ANTES do lançamento**: compara a tributação aplicada em cada produto vs **base de referência** do que deveria ser (NCM/cClassTrib correto). Aponta itens a corrigir (ex.: celular tributado como lápis). **Quanto mais SKU, melhor** (mais chance de imposto pago a mais). IA faz leitura/análise (forte dela). **Humano dá o OK sempre.** |
| 4 | **Restituição / Recuperação de crédito** | 💰 Bônus esporádico (NÃO fixo) | Linkado à auditoria: se acha imposto pago a mais hoje, os **últimos 5 anos** também foram → janela de recuperação. Vendido como **success fee ~30%**, dividido com o contador (recupera 100k → empresa 70k, vocês 15k, contador 15k — **não conta pro cliente final** que o contador ganha). **Análise prévia gratuita** pra entrar. IA com **especialistas por setor** (varejo/indústria/etc.). Foco: **farmácia, posto, mercado** (alto SKU, monofásico/bitributação). |
| 5 | **Emissor de nota** | 🧩 Add-on / gancho de margem | Emite já com código/tributação corretos → auto-auditoria na emissão → faz o lançamento. Resolve dor da **parametrização** (hoje feita junto ao contador; quebra quando troca funcionário). Humano confirma. **Modelo de revenda:** contador compra pacote de emissores e revende pros clientes dele (ex.: 5 emissores por R$250/mês, revende a R$50 cada = paga a própria mensalidade e lucra em cima). |
| 6 | **ECAC (gestão fiscal)** | 🔥 Possível mina (ver abaixo) | Add-on de altíssima dor. |
| 7 | **Gestão / Obrigações acessórias** | 🧩 Produto separado/posterior | Automatizar o fluxo burocrático do escritório (envio de guias, agenda de vencimentos, certidões). **Mobile = fase 2** (mais rápido de fazer, mas precisa lojas/contratos/pentest). |

---

## 🔥 Módulo ECAC — possível mina de ouro (descoberto ~44:00)

> "Esse é um negócio que dá dinheiro de forma absurda. Necessidade **surreal**." Renan vendia **R$8-15k/mês só disso** na CIEG.

**A dor:** contador com 100 clientes precisa entrar no ECAC **cliente por cliente** (procuração) pra ver caixa postal, situação fiscal, gerar CNDs, checar certidões (trabalhista, FGTS, estadual, federal, PGFN), ausência de declarações. Sai do usuário, entra de novo, repete 100×.

**A solução:** ferramenta que agrega **todas as empresas numa tela só** — caixa postal de todas, filtro tipo "quais clientes têm ausência de CND", geração de certidões em lote. "A gente pode colocar o ECAC numa colher tranquilamente." É **automatizável** e barato de fazer.

⚠️ Tecnicamente exige acesso **homologado pela Receita Federal** (pagar por acesso). Validar.

---

## ⚖️ Recuperação de crédito — mecânica jurídica (clarificada ~67:00)

Duas vias:
1. **PER/DCOMP (PERComp)** — administrativa (compensação). Você declara o crédito e usa pra abater imposto. **Risco:** se o governo depois glosa → **multa de até 150%**, e o "buffone" cai no cliente do contador.
2. **Judicial** — memória de cálculo, envolve advocacia.

**Comportamento de mercado (dado do contato de Renan):** de cada 10 clientes, só **3-4 querem PERComp** (compensar já); o resto **prefere esperar o dinheiro cair (PIX do governo)** = mais segurança. → **Estratégia: focar no recebimento em dinheiro (RT — Restituição Tributária)**, mais seguro pro cliente.

### 🚨 ALERTA CRÍTICO DE TIMING (levantado pelo Breno, ~63:00)
> **A partir do ano que vem o PIS/COFINS deixa de existir** (Reforma Tributária — confirmado: extinção em 1º/jan/2027). A recuperação de monofásico PIS/COFINS é um **play com prazo de validade**: funciona pelos próximos ~5 anos (janela retroativa) e morre. Renan: "daqui 5 anos não vou ter mais empresas de PIS/COFINS pra fazer isso."

➡️ Isso é **exatamente o M3 do Motor Fiscal** (`project_contabil_fiscal_motor_27mai`). É a janela/cunha. Tem que capturar valor AGORA enquanto a base retroativa existe.

---

## 💰 Pricing (exemplos reais, dos planos da CIEG que olharam ao vivo)

- **Entry** ~R$200-300/mês (contador pequeno, ~15 clientes que cobram micharia).
- Plano R$139 (base notas), R$189 (5 CNPJ emissores integrados), R$800 (emissão sem limite).
- "Flow": captura ~300k XML + análise + 10 CNPJ.
- Storage: 15 anos agora.
- Preço escala por **volume de nota** e nº de CNPJ/emissores.
- **Sem fidelidade anual** (Renan é contra lock-in) — usar **aviso prévio 30-60 dias**. Retenção por valor, não por contrato. **Implantação (fee) + mensalidade**; foco em mensalidade recorrente.
- Referência de escala: CIEG fazia ~R$500k/mês de mensalidade no pico; Renan trouxe ~R$600-700k de faturamento, ~R$300k/mês de mensalidade só dele.

---

## 🧩 Ativo herdado — ferramenta anterior (contexto ~83:00-91:00)

Já existe trabalho feito de uma tentativa anterior (que travou):
- Um sócio contador criou ferramenta interna "**Gestor + acessório**" pra obrigações acessórias: envio de guias, **agenda de vencimentos com regras** (antecipa se cai sábado/feriado, posterga conforme tipo), entrega de documento com **log de leitura/recebimento** (resolve o "não recebi o documento"), controle de alvará/certidões **por tipo de empresa** (MEI/Simples/Presumido/Real).
- Um dev ("**Pedro / o Japa**", padrinho do Ravinho) ia tornar mais tech/comercial. **Site pronto, MVP/mockup existia** (WordMap de funcionalidades, votação de prioridade, plano estratégico). Mas o dev estava ocupado em outro emprego, foi desligado, **pulou fora e hoje faz a própria ferramenta de captura de nota** — deixou o sócio de fora.
- ✅ **Vocês têm os artefatos** (site, mapa de funcionalidades, plano estratégico, MVC). Breno: "se eu jogar isso na minha coisa, coisa linda vai sair." A IA só precisa da estrutura/roadmap — que já existe. **→ Pegar esses artefatos antigos.** (Ver planilha `Comparativo Gestor.xlsx` → doc `06`.)

⚠️ Complexidade da gestão de docs: além do XML (padrão), há **NFS-e municipal, estadual, prefeitura — 10-15 layouts diferentes**, cada um com análise própria. Por isso a ferramenta antiga era complexa. (NOTA: NFS-e Nacional 2026 unifica isso — ver doc 07.)

---

## 🎯 Go-to-Market (execução, ~93:00-102:00)

- **SDR remoto** ligando ~5 contabilidades/dia (~80 ligações), agenda reuniões, com ferramenta que alimenta listas **por região**. Script comercial ("você tem 15 min?").
- **Começar pela carteira do Renan** (região do Vale: Lages, Chapecó) + próximos → criar demanda → expandir Floripa → **São Paulo** (15 mil contabilidades só na capital; SC tem ~5 mil).
- **Alvo: contabilidades pequenas/médias primeiro** (as grandes exigem muita vantagem/segurança pra trocar e temem entregar a empresa a "estranho"). Capitalizar e depois subir.
- **Piloto gratuito 1-2 meses** com clientes do Renan pra validar (feedback in-loop).
- **Marketing hoje é fácil/barato** (vs TV/rádio/jornal/boca-a-boca antigos); marketing digital atinge o público certo.
- **Evento Conta Azul, São Paulo, ~5 de agosto** — ir pra mapear mercado e concorrentes ao vivo (Renan estará trabalhando lá). Possível janela pra mostrar a ferramenta se pronta em agosto.
- **Meta inicial:** ~R$20 mil/mês com o primeiro vendedor.

### Concorrentes a estudar
- **Captura:** IRIS (CIEG), **GOB** (melhor sistema técnico, comercial fraco), VERI, **G-TAX**, Klaus.
- **Recuperação:** **C-TAX / CITAX** (ganham muito), SaaS bilionário tipo "Recupera Taxa" (com braço de educação, cases de centenas de milhões/bilhões).
- **Emissor robusto:** Conta Azul (comprada por ~R$1,7 bi — NÃO é o alvo; "não queremos emissor robusto igual Conta Azul").
- Estratégia: **não brigar com o gigante**, explorar o nicho (ferramenta melhor + mais barata + comercial agressivo, que é o gargalo dos players técnicos tipo GOB).

---

## ⏱️ Timeline & próximos passos sinalizados no áudio

- **2-3 meses** pra desenvolver o core.
- Renan vai **mandar perguntas de mercado** pro Breno responder/repassar aos contadores → captura de requisitos.
- Renan **visita mais contabilidades** agora (tem mais produto pra oferecer) e traz feedback.
- Investidor aloca recurso ~8 meses em dev + estruturação; depois monta time comercial.

## 🔮 Possível cross-sell futuro (tabelado)
Renan tem acesso a empresa de **redução de passivo via precatório** (reduz dívida ~60%; compra precatório, cliente paga ~50%). Complicado, deixado pra depois ("lá na frente dá pra fazer um chip").

---

## Como isso muda a documentação existente

1. **Refina o `03-status`:** o eixo do MVP migra de "Radar Fiscal + Operação do escritório" (checklists/kanban/portal) para o **ciclo da nota fiscal (emissão→captura→auditoria→restituição)** como CORE. Gestão/obrigações acessórias vira **módulo posterior**, não o coração. ECAC sobe de prioridade (possível mina).
2. **Funde com o Motor Fiscal** (`project_contabil_fiscal_motor_27mai`): a recuperação de monofásico É o M3, com o **alerta de sunset PIS/COFINS** explícito. M1 (classificação cClassTrib) = o módulo de Auditoria #3.
3. **Conecta com os 3 clones fiscais** já criados (heleno-taveira-torres, roberto-dias-duarte, anderson-hernandes) pra validar a estratégia jurídica e de precificação.

## Riscos / pontos a validar
- ⚖️ Acesso ECAC homologado Receita (custo por acesso) → resolvido via Integra Contador (doc 07).
- ⚖️ Risco de multa 150% no PERComp → priorizar restituição em dinheiro.
- 🚨 Janela monofásico (sunset Reforma) — capturar valor retroativo agora.
- 🤝 Conflito de canal: se o contador percebe que vocês vendem pros clientes dele, vira concorrente. Mitigação citada: focar Lucro Real / não-Simples; ou só análise prévia.
- 🧱 15 layouts de NFS-e municipal/estadual = complexidade técnica real → mitigado por NFS-e Nacional 2026 (doc 07).
