# Conclave Real de Validação + Feature Set — Projeto Contador

> Conclave **real** (HYDRA + 9 experts como agentes independentes com DNA real → rodada adversarial → síntese), não pipeline genérica. Antecedido por mineração HYDRA de fontes primárias fiscais (squad-contabil, 91 itens) + tech research de 4 clusters de mercado (`12-tech-research-mercado.md`).
> **Data:** 2026-06-10 · **Método:** `self-consultation.js` (DNA real) + agentes independentes + rodada adversarial (regra `feedback_conclave_must_be_deep`). Painel a dedo (não auto-select).
> **Painel (9):** heleno-taveira-torres, roberto-dias-duarte, anderson-hernandes, chip-huyen, werner-vogels, april-dunford, patrick-campbell, alex-hormozi, eric-ries.

---

## VEREDITO: GO — com a tese REFINADA pelo conclave

O produto se valida, mas o conclave **mudou o eixo** em 5 pontos decisivos. A maior descoberta: **9 experts, partindo de lentes diferentes (jurídica, ML, arquitetura, posicionamento, oferta, pricing), convergiram independentemente no mesmo moat — a "apuração defensável / trilha de boa-fé"**. Quando o tributarista, o engenheiro de ML, a posicionadora e o cara de oferta chegam sozinhos na mesma conclusão, isso não é opinião — é sinal.

> **A frase nova:** Não é "copiloto fiscal da Reforma". É **"a plataforma de apuração DEFENSÁVEL da Reforma"** — a única que prova, com trilha de boa-fé rastreável, que a tributação do cliente está certa ANTES da multa de IBS/CBS de agosto/2026. A recuperação é a isca de entrada; a defensabilidade é o que retém — e sobrevive ao sunset de 2027.

---

## SÍNTESE DO DEBATE

### ✓ CONSENSO (após rodada adversarial)

1. **O moat é a "apuração defensável" — auditoria cClassTrib/NCM com divergência detectada + TRILHA DE BOA-FÉ jurídica por documento.** Convergência unânime (Heleno legal + Chip confidence + April posicionamento + Hormozi oferta + Campbell add-on + Werner observável). A tabela cClassTrib é commodity pública; o **motor de classificação + a trilha de proveniência** é o IP.
2. **Captura = COMPRAR, não construir.** PlugNotas/Focus/SERPRO já resolveram NSU/backoff/idempotência/renovação de certificado. Capital de 8 meses vai pro motor, não pra reinventar encanamento commodity.
3. **Humano no loop é DESIGN, não fallback.** A IA sinaliza, o contador assina. Nunca "simula acesso humano" (a zona cinza do é-Simples que vira passivo).
4. **e-CAC via Integra Contador oficial** (não scraping) — mas e-CAC em lote é categoria LOTADA; não competir aí, usar como infraestrutura.
5. **Preço transparente + confiabilidade** = os dois fossos abertos de TODO o mercado.

### ⚔ DISSENSOS RESOLVIDOS (quem ganhou e a conciliação)

| Tensão | Resolução do conclave |
|--------|------------------------|
| **Recuperação: isca (Hormozi/Anderson) × litígio/extinção (Heleno/Roberto)** | **Ambos certos, papéis separados.** Recuperação = ISCA de aquisição risco-zero (captura a carteira do Renan com caixa imediato), NUNCA a categoria nem a fundação. **O contador/tributarista assina a PER/DCOMP, o software entrega o dossiê de evidências.** Linguagem "divergência potencial", nunca "crédito garantido". Success-fee 15-25%, linha separada. O recorrente que fica pós-2027 = apuração defensável + monitor e-CAC. |
| **Construir 5 módulos × Concierge MVP (Eric)** | **Eric ganhou — absorvido até por Hormozi e Werner.** Provar a Value Hypothesis ANTES de construir. 6 semanas, 5 escritórios do Renan, XML manual, laudo nos bastidores. Build só após pagamento real. |
| **Value metric: nota auditada (Campbell) × faixa CNPJ (Anderson)** | **Campbell ganhou; concedeu o ponto de WTP do Anderson.** Cobrar por nota fiscal auditada (alinha valor, gera expansão automática), NÃO por CNPJ (proxy preguiçoso que ancora na guerra de preço dos incumbentes). Recorrente entra barato + white-label (WTP baixa do dono pequeno). |
| **Agente local A1 (decisão atual) × comprar captura (Werner)** | **Werner ganhou. ⚠️ ISTO REVISA A ARQUITETURA (D2 do CONTEXT).** Agente local desarma LGPD mas cria 500 SPOFs não-observáveis (máquina desligada, antivírus mata .exe, A1 vence em silêncio) = resiliência 4/10. Melhor: comprar captura de provider com **DPA + cláusula de operador (Art. 39 LGPD)** — risco contratual transferível > risco operacional distribuído. |
| **Posicionamento "copiloto" × "apuração defensável" (April)** | **April ganhou.** Não posicionar a empresa num ativo com data de morte (recuperação 2027). Categoria = defensabilidade. Recuperação é wedge de aquisição, não anzol de categoria. |

### 🕳 BLIND SPOTS (riscos que o conclave deixou abertos — resolver antes de escalar)

1. **Golden-set não existe** (Chip) — sem conjunto rotulado por tributarista (não pela IA), "auditoria contra a referência da Reforma" é vibe check. Pré-requisito do motor.
2. **Onboarding de procuração em lote** (Roberto/Anderson) — validação cliente-a-cliente do fluxo 2025 "Autorizações de Acesso" em 50-500 CNPJs é onde o onboarding morre. É feature de aquisição crítica, não detalhe.
3. **Conflito de canal** (Anderson) — se o cliente final percebe "é uma ferramenta", desintermedia o contador. White-label obrigatório; o contador é o herói.
4. **Concept drift das Notas Técnicas** (Chip) — a relação item→cClassTrib MUDA a cada NT (2025.002, 2026.00x). Sem monitor de drift, o classificador apodrece em semanas.
5. **"Serviço em software é difícil"** (Roberto) — a recuperação é success-fee = serviço; a operação de entregar (dossiê, defesa do crédito) escala mal. Testar explicitamente no piloto.

---

## FEATURE SET PRIORIZADO (capturar · monitorar · analisar · recuperar)

Ordem = **valor defensável**, não engenharia. ⭐ = o moat.

### Fase Concierge (semanas 0-6) — ZERO build de infra
- **Motor de divergência cClassTrib/NCM↔operação** (manual nos bastidores: Breno + AIOS).
- ⭐ **LAUDO com TRILHA DE BOA-FÉ + confidence calibrada** ("onde NÃO sei") — o que faz o contador pagar.
- **Estimativa de crédito monofásico recuperável** (5 anos) + **classificação de risco jurídico do PER/DCOMP** (administrativo seguro vs judicial vs 75/150%).
- XMLs exportados à mão pelo contador. Sem agente local, sem e-CAC, sem emissor.

### Fase 1 (após validação paga) — construir o moat
1. ⭐ **Motor de auditoria cClassTrib/NCM** automatizado (regras + RAG sobre tabela pública + base Systax/Taxcel licenciada; NÃO fine-tune) + **golden-set + harness de evaluation** (precision/recall por cClassTrib, MAPE crédito).
2. ⭐ **Trilha de proveniência / boa-fé por documento e por PER/DCOMP** (log imutável: norma, NT, data, confiança) — o escudo no auto de infração.
3. **Confidence score + fila de revisão humana** (abaixo do threshold → contador decide).
4. **Monitor de Nota Técnica → impacto no cliente X** (transforma a enxurrada de NTs em razão de compra recorrente) + **drift monitor**.

### Fase 2 — comprar a captura
5. **Captura comprada** (PlugNotas/Focus): NF-e/NFC-e/NFS-e/CT-e/MDF-e + manifestação 4 eventos + saídas autXML + retroativo/bulk, com DPA. **Observabilidade como feature** (heartbeat por CNPJ, saúde do certificado, fila de retry visível) + **onboarding de procuração em lote** (digere o atrito do fluxo 2025).

### Fase 3 — recuperação industrializada + emissor
6. **Recuperação monofásica** (segregação 60 meses, geração de dossiê PER/DCOMP — contador assina) como **success-fee separado**.
7. **Emissor NFS-e Nacional** via API oficial gratuita (ADN/SEFIN) + Focus/PlugNotas fallback municipal. ❌ NÃO Nuvem Fiscal (morre 31/jul/2026).

### Add-ons premium (aplicações à parte, linhas de receita paralelas — não-core, D9)
- ⭐ **e-CAC em lote** via Integra Contador (caixa postal verde/amarelo/vermelho, SITFIS, CNDs/certidões em lote, alerta de procuração vencida). **~R$2.000/mês no mercado** (founder); Renan vendia R$8-15k/mês disso. Categoria lotada (não é diferencial), mas mina de receita de margem brutal. Vendido por cima, no próprio tempo.
- **Emissor (revenda)** e **camada Gestor** (Gestorize) como add-ons adicionais.

### ❌ NÃO perseguir agora
Fine-tune próprio · e-CAC em lote como diferencial (categoria lotada) · captura própria do DF-e · comunicação/WhatsApp (Acessórias domina) · agenda de obrigações (Fortes domina) · emissor robusto tipo Conta Azul · NFCom/NF3e (esperar NT estabilizar) · enterprise/Roit (fora do ICP).

---

## O QUE INTEGRAR DOS MELHORES (do `12-tech-research`)

| De quem | O que integrar | Onde entra |
|---------|----------------|-----------|
| **e-Auditoria** | Motor de regras de auditoria (CFOP/CST/base) + captura multicanal com OCR PDF→XML fallback | Fase 1 motor |
| **é-Simples / Recupera Simples** | Classificador NCM por descrição/barcode + segregação monofásico 60 meses + geração PER/DCOMP | Concierge + Fase 3 |
| **Domínio Kolossus** | Auditoria cruzada SPED×XML com plano de correção (com UX melhor + preço transparente) | Fase 1 |
| **Fortes** | Analisador que aponta o campo EXATO do erro + agenda com antecipação configurável | Fase 1 laudo |
| **Neo Controle** | e-CAC via API oficial SERPRO + alerta de procuração vencida | Fase 2 |
| **Systax / Taxcel** | Base de regras (licenciar, CaaS) + dupla apuração CBS/IBS + tabela cClassTrib×CST | Fase 1 base |
| **Acessórias / Questor** | (futuro) WhatsApp oficial + log de leitura auditável; robô de CND | Fase 3+ |
| **Infraestrutura oficial** | Integra Contador (e-CAC), API NFS-e Nacional (emissão grátis), Infosimples (gaps de CND), PlugNotas/Focus (captura+fallback) | Fases 2-3 |

---

## EXPERIMENTO DE VALIDAÇÃO (o próximo passo concreto)

**Concierge MVP — 6 semanas** (consenso Eric + absorvido por todos):
- Recrutar **5 escritórios da carteira do Renan** (5 profundos, não 50 rasos).
- XMLs exportados à mão; rodar auditoria cClassTrib + scan monofásico **manual** nos bastidores.
- Entregar **LAUDO** (divergências + crédito recuperável estimado + risco jurídico classificado + trilha de boa-fé + confidence "onde não sei"), white-label com a marca do escritório.
- **Critério PERSEVERE:** ≥3 dos 5 pagam recorrente real (R$300-500/mês) **OU** assinam 1 success-fee de recuperação. Pagamento, não carta de intenção.
- **Critério PIVOT:** abaixo disso.
- **Só após o verde** constrói-se: motor automatizado + golden-set, captura comprada + observável, e-CAC oficial, value metric por nota.

---

## REVISÕES QUE O CONCLAVE PROPÕE À ARQUITETURA/PRD (decisão do founder)

⚠️ O conclave **contradiz** dois pontos dos docs `10`/`11`/`CONTEXT`. Trazendo à tona pra você bater o martelo:

1. **Agente local (D2 do CONTEXT)** — escrevi "A1 no agente local desarma LGPD". O conclave (Werner, com Eric) recomenda **comprar captura de provider com DPA** em vez de construir agente local. Trade-off: LGPD vira cláusula contratual (operador) vs 500 SPOFs operacionais não-observáveis. **Recomendação do conclave: comprar.** (E nem decidir isso agora — captura só após validar.)
2. **Sequência "construir o core" (PRD Fase 0)** — o PRD assumia construir Captura primeiro. O conclave inverte: **Concierge MVP manual primeiro**, construir só após pagamento. Captura primeiro = vanity validation de uma commodity.

Se você concordar, eu atualizo os docs `10`/`11`/`CONTEXT` pra refletir (apuração defensável como core, captura comprada, concierge antes de build).

---

## Metodologia (transparência)
HYDRA real (`squad-contabil` criado, 91 itens minerados de Tecnospeed/Anderson Hernandes/Roberto Dias Duarte/JOTA — gpt-4o-mini) → tech research web de 4 clusters (agentes independentes, fontes primárias) → 9 experts como **agentes independentes** com DNA real (`self-consultation.js`, capado ~16KB) lendo data packet → **rodada adversarial** (6 confrontos diretos) → esta síntese. Sem channeling genérico (`feedback_no_hydra_style`), sem conclave meia-boca (`feedback_conclave_must_be_deep`).
