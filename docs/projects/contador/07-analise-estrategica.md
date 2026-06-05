# Projeto Contador — Análise Estratégica (com material parcial)

Data: 2026-06-04
Base: `05-visao-produto-reuniao-socios.md` (áudio) + `06-comparativo-gestor-concorrentes.md` (planilha)
Status: análise preliminar enquanto o restante do material não chega. Conclusões marcadas com nível de confiança.

---

## 1. A cunha (onde está o jogo)

O mercado tem **dois campos que não se sobrepõem**:

| Campo | Players | Força | Fraqueza |
|-------|---------|-------|----------|
| **Captura/Fiscal** | GOB, IRIS (CIEG), VERI, G-TAX, Klaus, CITAX | Tech fiscal forte (captura, auditoria, recuperação) | **Comercial fraco** (segundo Renan, GOB é o melhor produto e vende mal) |
| **Gestão/Obrigações** | Nibo, Tareffa, GClick, Confi, MakroSystem, Neo, TaskDo | Workflow/obrigações maduro | **Sem inteligência fiscal profunda** (e-CAC, captura, auditoria) |

**A cunha = ser o que ninguém é: os DOIS campos juntos + comercial agressivo.**
- Núcleo fiscal (captura→auditoria→restituição→ECAC→emissão) **+** camada de gestão (o Gestor herdado) **+** motor comercial do Renan (provado: **R$600k/mês na CIEG**).
- O moat **não é tech pura** — é tech-boa-o-bastante **+ distribuição + a "escada"** que cria custo de troca. Os gigantes (Conta Azul, R$1,7bi) jogam em emissor robusto; não é onde vocês entram.

**Confiança: ALTA.** A planilha confirma quantitativamente: Gestor cobre gestão, faltam exatamente os módulos fiscais — e nenhum concorrente único junta tudo.

---

## 2. O motor econômico — dois tipos de receita

| Tipo | Módulos | Papel | Característica |
|------|---------|-------|---------------|
| **Recorrente (mensalidade)** | Captura, Emissor, Gestão, ECAC | 🎯 **O negócio de verdade** | Churn baixo SE valor é contínuo (não "mastigado") |
| **Esporádico (success fee)** | Recuperação de crédito | 🪝 Gancho de aquisição / payback / abre porta | Spike de caixa, mas **com prazo de validade** |

**Reframe crítico (e o áudio já acerta isso):** a recuperação é o **gancho de venda** ("análise grátis, o sistema se paga"), mas **não pode ser a fundação de valor** — por dois motivos: é esporádica E está em sunset. O valor-âncora é **"otimizar o tempo do contador"** (mandar 2 de 5 funcionários embora). Construir o recorrente; usar a recuperação como **combustível de aquisição durante a janela de 5 anos**.

---

## 3. 🚨 O paradoxo da Reforma Tributária (o ponto mais importante)

> A morte de um play é o nascimento de outro.

- **Sunset:** PIS/COFINS acaba (~2027) → recuperação de monofásico é uma **janela retroativa de ~5 anos** que fecha. Colher agressivamente agora.
- **Tailwind:** a MESMA Reforma cria **trabalho recorrente novo** por **7 anos (2026-2033, sistema duplo)** — reclassificação de catálogo no `cClassTrib`, manutenção, dupla apuração. Isso é o **M2 do Motor Fiscal** (MRR), e é **anti-sunset**: dura a transição inteira.

➡️ **Decisão estratégica:** posicionar o produto como **"o copiloto da empresa na transição da Reforma"**. A recuperação (M3) financia a entrada agora; a manutenção/reclassificação (M2) sustenta o recorrente pela década. **Não tratar a Reforma como ameaça — é o maior vento de cauda disponível, com data de validade pra concorrência entrar.**

**Confiança: ALTA** na direção; **MÉDIA** nos detalhes (precisa validar cronograma exato com clone heleno-taveira-torres).

---

## 4. Registro de riscos (ranqueado)

| # | Risco | Severidade | Mitigação |
|---|-------|-----------|-----------|
| 1 | **Sunset PIS/COFINS** | 🔴 Alta (no play de recuperação) | Time-box o motor de recuperação; pivotar valor pro recorrente M2 (reclassificação Reforma) |
| 2 | **Multa 150% no PERComp** | 🔴 Alta (responsabilidade) | Default = restituição em **dinheiro (RT)**, não compensação; humano no loop; **parceiro tributarista** pra protocolar (clone heleno valida) |
| 3 | **Conflito de canal** (contador te vê como concorrente do cliente dele) | 🟠 Média-Alta | Política clara: focar **Lucro Real / não-Simples**, ou só **análise prévia**; deixar o contador no split (15%) pra alinhar incentivo |
| 4 | **ECAC homologado** (acesso pago Receita) | 🟠 Média | Validar mecanismo + custo ANTES de prometer a "mina"; clone roberto-dias (Fisco digital) |
| 5 | **15+ layouts NFS-e** (municipal/estadual) | 🟠 Média (matou a velocidade da ferramenta antiga) | Começar por **XML padrão (NF-e/NFC-e)** + top municípios; expandir layout incrementalmente |
| 6 | **Bus-factor / precedente "Japa"** | 🟡 Média | A ferramenta anterior morreu porque o dev solo se distraiu e debandou. Mitigado pelo modelo AIOS (estrutura/roadmap owned, não dependente de 1 cabeça) — **mas registrar como risco de processo** |

---

## 5. Recomendação de MVP / sequência de build

Dado: alvo 2-3 meses, Gestor herdado, modelo escada, e a necessidade de entrar barato no contador.

| Fase | Módulo | Por quê primeiro |
|------|--------|------------------|
| **0 — Cunha de entrada** | **Captura + Armazenamento XML** | Barato, fácil, abre a porta. Agente local + web. R$200-300 entry. É o que te coloca DENTRO da contabilidade. |
| **1 — Diferencial** | **Auditoria de tributação** (precisa da base de referência cClassTrib/NCM) | O "wow" que justifica o preço recorrente E habilita o gancho de recuperação. |
| **2 — A mina** | **Diagnóstico ECAC** (caixa postal em lote, CND/certidões) | Maior dor, vendedor provado (R$8-15k/mês). Gated em homologação. |
| **3 — Completar** | **Emissor NFS-e** + reativar **Gestor** (módulo gestão) | Eng mais pesada (multi-layout) e o ativo já-pronto entra como camada de gestão. |
| **Overlay** | **Recuperação** (success-fee) | Roda como serviço desde a Fase 1, time-boxed à janela PIS/COFINS. |

**Lógica:** cada fase é vendável sozinha, cada uma aumenta custo de troca, e front-load do mais-barato-de-construir/maior-puxada (captura) + maior-diferenciação (auditoria→recuperação) ANTES da eng pesada (emissor multi-layout, homologação ECAC).

**Confiança: MÉDIA-ALTA.** A ordem pode mudar se o material mostrar que o Gestor está deployável (aí Gestão sobe) ou se a base cClassTrib já existe (aí Auditoria acelera).

---

## 6. Avaliação de pricing

- Âncoras de concorrente (planos CIEG R$139/189/800; Nibo et al.) dão o **corredor**.
- Modelo **escada + por volume de nota + emissor-revenda** é sólido e bate com o mercado.
- **Sem fidelidade anual / aviso 30-60 dias:** aposta de retenção-por-valor. Coerente, mas **arriscado cedo** (CAC alto, precisa de caixa). Recomendo: **fee de implantação (cobre CAC) + mensalidade**, e um **incentivo anual leve (desconto, não lock-in)** pra suavizar caixa.
- Success-fee **30% (split 15/15 com contador)** = padrão de mercado (confirmado no áudio).

---

## 7. O que o material que está chegando precisa responder

1. **Estado real do Gestor** — é código deployável ou só mockup/site? (muda a Fase 3 → 0)
2. **Base tributária de referência** (cClassTrib/NCM) — têm, precisam construir ou licenciar?
3. **Mecanismo + custo do acesso ECAC** homologado.
4. **Contato "mina de ouro"** (1000+ clientes) — pipeline real ou aspiracional?
5. **Unit economics** — custo por CNPJ/volume XML, storage, taxas de homologação → define margem.
6. **Estrutura jurídica do success-fee** — quem protocola o PER/DCOMP? (eles, o contador, um tributarista parceiro?)
7. **Os 8 concorrentes da planilha** — preencher as 2 abas vazias (preço/layout/implantação + matriz funcional) via tech-research.

---

## 8. Veredito preliminar

**O negócio tem uma tese real e uma cunha defensável** (fiscal + gestão + comercial, num mercado fragmentado onde ninguém junta os três). Os **dois maiores ativos** são (a) o **motor comercial provado do Renan** e (b) o **timing da Reforma** (janela de recuperação + década de manutenção recorrente). Os **dois maiores riscos** são (a) tratar a recuperação como fundação (é gancho, não base) e (b) subestimar a eng dos layouts NFS-e + homologação ECAC.

**Caminho recomendado:** entrar com **Captura (barato) → Auditoria (diferencial) → ECAC (mina)**, com recuperação como overlay de aquisição time-boxed, e reposicionar a narrativa toda em cima da **transição da Reforma** (anti-sunset).

**Próximo passo de maior valor:** rodar um **conclave com os 3 clones fiscais** (heleno-taveira-torres = tributário/Reforma, roberto-dias-duarte = SPED/Fisco digital/ECAC, anderson-hernandes = gestão/precificação de escritório) pra estressar os riscos 1-4 antes de comprometer arquitetura.
