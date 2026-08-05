# IA na construção — síntese consolidada de 5 fontes

**Data:** 02/Ago/2026

| # | Fonte | Natureza | Status |
|---|---|---|---|
| 1 | `IA_na_Construcao_Civil_Casos_Reais.docx` | Relatório executivo, 24 refs | ✅ lido |
| 2 | `02-evidencia-independente.md` | Agente — peer-review e institucional | ✅ |
| 3 | `03-tecnologias-canteiro.md` | Agente — hardware/software de campo | ✅ |
| 4 | `05-casos-china.md` | Agente — China, com desmonte de narrativa | ✅ |
| 5 | Pesquisa França (link ChatGPT do founder) | 34 seções, país-específico | ✅ |
| 6 | `Relatorio_IA_Construcao_Civil_Panorama_Internacional.docx` | **10 países**, 428 parágrafos, 66 tabelas | ✅ |
| — | Casos Brasil · EUA · fornecedores/stack | Agentes | ❌ falharam por limite de sessão — **fontes 5 e 6 cobrem Brasil e EUA** |

> Os dois links do ChatGPT enviados têm conteúdo **idêntico** (50.332 chars, diferindo só na
> própria URL): ambos são o panorama da França. A pesquisa multi-país é a **fonte 6**.

---

## 0. O achado que define o mercado (fonte 6)

Tabela de maturidade comparada, escala 1–5, por dimensão:

| País | Dados | Projeto | **Canteiro** | Indústria | Operação |
|---|---|---|---|---|---|
| **Brasil** | 3 | 2 | **1** | 2 | 2 |
| China | 5 | 4 | 5 | 5 | 4 |
| Japão | 5 | 4 | 5 | 4 | 5 |
| EUA | 4 | 5 | 4 | 3 | 5 |
| Reino Unido | 5 | 4 | 4 | 4 | 5 |
| Alemanha | 4 | 4 | 3 | 5 | 5 |

**O canteiro brasileiro tem nota 1 — a menor célula da tabela inteira, entre 10 países e 5
dimensões.** E o perfil do Brasil na mesma fonte: força em "jornada comercial e CRM"
(caso emblemático MRV Mia/Marco), desafio declarado = **"expandir para campo e documentos"**.

Isso admite duas leituras honestas e vocês precisam escolher com dados, não com otimismo:
- **Oportunidade:** ninguém atende o canteiro brasileiro.
- **Aviso:** se fosse fácil e valioso, alguém já estaria lá.

O que inclina para oportunidade: os casos brasileiros existentes (MRV, Direcional, Eztec, Tenda)
são **todos** comerciais ou documentais. Nenhum de campo, em nenhuma das 6 fontes.

---

## 1. O padrão que atravessa TODAS as fontes

Cruzando as cinco, uma única regra explica o que chega a produção e o que não chega:

> **O que exige mudança de comportamento do trabalhador de campo não escala.
> O que se encaixa no que ele já faz, escala.**

Evidência convergente, de origens independentes:

| Fonte | Como aparece |
|---|---|
| Song & Song 2026 (*Organization Studies*) | Etnografia de rollout real: fadiga e contornos criados pelos trabalhadores. **O fracasso mora na adoção de campo, não na acurácia do modelo.** |
| França — maturidade (seção 31) | Comercial: BIM, drone de inspeção, app de segurança, prefab. **Só piloto: canteiro sem trabalhador, guindaste autônomo, robô generalista.** |
| China | Robôs da Bright Dream: números inconsistentes, equipe caiu de ~38 para 25. O que é obrigatório e funciona é **cadastro de trabalhador**, não robô. |
| Docx, tabela 15 | RDO/atas = **alto impacto, baixa complexidade**. Previsão de custo = alto impacto, **complexidade alta**. |
| Zé Obra (mercado BR) | Produto em produção usando **WhatsApp** — zero instalação, zero treinamento. |

**Consequência de produto:** a interface decide mais que o modelo. Foi a razão certa pela
razão errada — eu tinha escolhido WhatsApp por conveniência; a literatura diz que é a variável
que determina sucesso ou fracasso.

---

## 2. Correções nas fontes anteriores

### O relatório do founder é mais fraco do que o rótulo sugere
- Referência [24], "*peer-reviewed study*" da Togal.AI: **n=1**, hospedada **só no site do fornecedor**.
- **Nenhum** dos 6 fornecedores citados tem validação de terceiro publicada.
- Os "98% de redução no tempo de orçamento" (CONTECC) — único classe A do relatório — **não foi
  possível confirmar a autoria**. Tratar como não verificado.

### China: a narrativa popular não se sustenta
- **Não existe "lei nacional de canteiro inteligente".** Existem duas coisas: infraestrutura de
  dados obrigatória desde 2019 (cadastro nominal de trabalhador amarrado ao alvará + conta de
  salário segregada; telemetria de guindaste) e um programa de **24 cidades-piloto** — incentivo,
  não mandato.
- Broad Group: **menos de 40 edifícios**, divisão viral nunca deu lucro.
- WinSun: nunca imprimiu no canteiro — painéis em fábrica, montados no local.
- Caso Xiong'an (2020) sendo republicado por fazendas de conteúdo **em 2026 como novidade**.

---

## 3. O que tem base sólida vs. o que é promessa

| Aplicação | Evidência independente | Veredito |
|---|---|---|
| **Detecção de EPI** | Fang et al. 2018 (*Automation in Construction*): 90,1–98,4% em **25 canteiros / 1 ano** | ✅ Melhor base — **mas** anonimizar rosto derruba ~7pp, o que colide com LGPD |
| **Maturidade do concreto** | R² 0,94–0,99, replicado entre grupos | ✅ Sólido — só laboratório, sem validação de campo BR |
| Quantitativo a partir de **BIM bem modelado** | Maduro | ✅ Depende de BIM que a PME não tem |
| CV para elementos discretos | Armação 94,6% AP50 · painéis 95% · janelas IoU 0,68 | 🟡 Funciona por elemento |
| **CV para "% de avanço agregado"** | **Ainda pesquisa** | 🔴 **Não prometer** — é o miolo do relatório mensal |
| **RAG documental em construção** | **Nenhum estudo dedicado.** Proxy (saúde): ~45% de erro residual | 🔴 Sem respaldo publicado |
| Previsão de custo/prazo | MAPE de 0,9% a 28% entre estudos | 🔴 Dispersão inviabiliza promessa |

**Contexto de adoção:** RICS 2025 (n=2.200+) — **45% das construtoras não usam IA alguma.**

---

## 4. O que a França acrescenta

A França é o caso mais próximo do que vocês querem vender: **integração de dados e engenharia,
não robô.** O documento classifica honestamente que os indicadores têm níveis diferentes de evidência.

| Caso | Número | Por que interessa |
|---|---|---|
| **Eiffage — apps de segurança** | **23.500 usuários** · 600+ visitas de segurança/mês | 🔴 **O dado mais importante das 5 fontes.** É métrica de **adoção**, não de acurácia. Prova que app de campo simples é adotado em massa. |
| **EDF–Mistral** | Parceria de 5 anos, copiloto para nuclear | Valida "copiloto técnico" como categoria séria |
| BDNB | Base nacional de **32 milhões de edifícios** | Ideia de infraestrutura de dados predial |
| Bouygues / HP SitePrint | 4× mais rápido, precisão <3 mm | Alternativa ao Dusty na marcação robotizada |
| VINCI Caméléon | Pré-análise automática de imagem de inspeção | Inspeção de estrutura |
| XtreeE | 25+ instalações industriais | Impressão 3D como componente, não casa inteira |

**Maturidade na França** — o mapa mais útil do documento:
- **Comercial hoje:** BIM · base predial · drone de inspeção · manutenção preditiva ferroviária ·
  gestão energética · **app de segurança** · prefab · digital twin industrial · impressão 3D de componente
- **Em expansão:** copilotos técnicos · marcação robotizada · **visão computacional no canteiro** ·
  agentes de engenharia · reutilização de material
- **Só piloto:** veículo autônomo · guindaste autônomo · canteiro sem trabalhador · robô generalista ·
  edifício inteiro impresso · IA decidindo estrutura

E a própria fonte posiciona o Brasil assim: força em **"atendimento, vendas, documentos e adoção
inicial na obra"** — o que bate com o docx, onde os casos brasileiros (MRV, Direcional, Eztec,
Tenda) são todos comerciais/documentais, nenhum de campo.

---

## 5. Concorrência já existente no Brasil

**Zé Obra** (`zeobra.com.br`) — **R$ 39 a R$ 449/mês**. Recebe foto e áudio por WhatsApp, lê nota
fiscal, monta diário com foto datada, **entrega relatório mensal em PDF pelo WhatsApp**. Verificado
na fonte.

| | Zé Obra | Brecha |
|---|---|---|
| Foco | **Financeiro** — nota, pagamento, gasto por fornecedor | Avanço físico e prestação de contas |
| Comprador | Arquiteto/empreiteiro, 3-10 obras | Construtora média com relatório contratual |
| Cruzamento com cronograma/medição | Não | Sim |
| Integração ERP | Não localizada | **Só Sienge e Mobuss têm API pública** |

**Isso valida a tese e mata o preço simultaneamente.** Valida porque prova demanda e prova que
WhatsApp funciona. Mata porque cria âncora de R$89/mês contra proposta de R$15-30k. A saída é
outro comprador (quem **deve** relatório a um terceiro), não outra feature.

---

## 6. Restrição regulatória nova

**ICA 100-40 (DECEA), em vigor 1º/jul/2026:** acabou a isenção de SARPAS para drone abaixo de
250g. **Todo voo exige autorização prévia.** Qualquer produto com captura recorrente por drone
ganhou fricção — reforça captura por celular.

---

## 7. Desenho de produto que sobrevive a tudo isso

Só passa o que atende às quatro condições simultaneamente:
zero mudança de comportamento no campo · sem depender de acurácia não comprovada ·
sem colisão com LGPD · sem exigir integração para o primeiro valor.

| Produto | Passa? | Razão |
|---|---|---|
| **Captura estruturada por WhatsApp → relatório** | ✅ | Interface validada; avanço vem de **apontamento humano**, não de inferência visual |
| **App de visita de segurança** (modelo Eiffage) | ✅ | 23.500 usuários provam adoção; sem câmera = sem problema de LGPD |
| Copiloto de documentos | 🟡 | Categoria validada (EDF–Mistral), mas RAG em construção não tem estudo. Exige citar fonte em toda resposta. |
| Avanço físico automático por visão | ❌ | Agregado ainda é pesquisa |
| Detecção de EPI por câmera | ❌ | Melhor acurácia, pior encaixe legal — monitoramento de trabalhador |
| Previsão de custo/prazo | ❌ | MAPE de 0,9% a 28% |

**A mudança na especificação:** o relatório mensal continua sendo o produto, mas o avanço físico
é **declarado pelo mestre no áudio** e apenas estruturado pela IA. Não inferido de foto. A foto
serve como evidência e ilustração — que é como a França usa (Caméléon pré-analisa, humano decide).

---

## 7b. Quarta confirmação independente do RDO (fonte 6)

O panorama internacional traz um portfólio de 10 soluções com cliente, valor e complexidade.
**RDO automático é a única classificada como complexidade "Baixa" pura** — e a única cujo
cliente típico é "**obras de qualquer porte**":

| Solução | Cliente típico | Complexidade |
|---|---|---|
| **RDO automático** | **Obras de qualquer porte** | **Baixa** |
| Copiloto técnico | Construtoras, incorporadoras, engenharias | Baixa–média |
| Copiloto do corretor | Incorporadoras e imobiliárias | Baixa–média |
| Agente de compras | Construtoras e instaladoras | Média |
| Visão de segurança | Terraplenagem, infraestrutura, indústria | Média |
| **Progresso por imagens** | **Grandes obras** | Média |
| Risco de cronograma | Portfólios e obras longas | Média–alta |
| Operação energética | Redes de loja, hotel, hospital, shopping | Média–alta |

Duas leituras diretas:
1. **RDO é o ponto de entrada** — quarta fonte independente dizendo isso (docx original tabela 15,
   pesquisa de PME via WhatsApp, Zé Obra existindo, e agora esta).
2. **"Progresso por imagens" é explicitamente para GRANDES obras.** Confirma a decisão de não
   vender avanço automático por visão para PME — junta com a evidência de que o agregado ainda é pesquisa.

**Horizonte 0–6 meses da mesma fonte:** copilotos documentais · **RDO** · CRM comercial · resumo
de reuniões → "economia de horas administrativas". Captura de progresso e visão de segurança só
aparecem no horizonte 6–18 meses; robótica e digital twin, em 18–36.

### Riscos que a fonte 6 acrescenta ao contrato

Além dos já mapeados, dois que faltavam e são vendáveis como diferencial:

| Risco | Controle |
|---|---|
| **Baixa adoção pelos usuários** → ferramenta não utilizada | Co-design, treinamento, integração e **benefício visível** |
| **Métrica enganosa** → expansão sem retorno real | Linha de base, grupo de controle, período suficiente, auditoria |

E o alerta metodológico do sumário executivo, que vale citar em proposta:
> "Aumento de produtividade pode refletir simultaneamente tecnologia, treinamento, mudança de
> processo e seleção de equipes."

Ou seja: nem o próprio cliente saberá isolar o efeito da IA se a linha de base não for medida
antes. Vender a medição junto com o produto é honestidade **e** é trava contra questionamento
de resultado depois.

---

## 8. Lacunas — o que ainda não temos

1. 🔴 **Casos brasileiros além dos 8 do docx** — agente falhou
2. 🔴 **EUA em profundidade** — agente falhou. Incluía Katerra e outros fracassos, além de GCs médias
3. 🔴 **Fornecedores/stack BR** — agente falhou. Era o que definiria: WhatsApp Cloud API vs BSP,
   custo por conversa, Whisper em áudio de canteiro, e quais ERPs valem integrar
4. 🟡 CONTECC — confirmar autoria e o número de 98%
5. 🟡 Nenhuma validação de campo brasileira para sensor de concreto
6. 🟡 Preço fechado de sensor, telemetria e wearable — vendidos por relação comercial, não publicados

Os três agentes que falharam podem ser retomados quando o limite resetar.
