# 12 — Síntese: Reunião Renan (22/Jun) + Tech Research (docs 07–11) + HYDRA fresco

> **Autor:** Orion (Claude) · **Data:** 2026-06-24 · **Base:** transcrição da reunião Breno×Renan (22/Jun/2026, 49 min) + 5 pesquisas de fontes primárias (`07`–`11`) + run HYDRA real (squad-contabil, 51 itens frescos minerados 22–24/Jun).
> **Pedido do founder:** "ter as melhores funcionalidades do mercado" nas frentes que a reunião elevou.
> **Como ler:** este doc consolida o que MUDA em relação ao `00-sintese-paridade.md` e ao plano `56`. Não repete o scorecard das 6 áreas originais; adiciona as frentes novas e os ajustes.

---

## 0. O que a reunião com o Renan adicionou ao escopo

A reunião não mudou a tese (apuração defensável + trilha de boa-fé continua o moat). Ela **especificou prioridades comerciais concretas** e revelou uma frente nova:

| Pedido do Renan | Já estava no plano? | Onde entra |
|---|---|---|
| **Parcelamento** ("dor crítica da contabilidade") | Não detalhado | **NOVO — doc 07** |
| Geração de CND, situação fiscal, caixa postal, dívida ativa, Caixa/FGTS/trabalhista | Parcial (e-CAC) | **Aprofundado — doc 08** |
| **Envio automatizado de guias** (integração com sistemas dos clientes) | Não | **NOVO — doc 08 (camada de entrega "Nível 3")** |
| Parser/reconhecimento de documentos (campos automáticos) | Implícito na Captura | **Detalhado — doc 09** |
| UX de comissionamento/repasse (valores absolutos) | Não | **NOVO — doc 10** |
| Aproveitar base do "contador empreendedor ~400 clientes" | Não | **Avaliado — doc 11** |
| MVP em ~8 dias + 10 contadores grátis | — | Decisão de escopo (§4) |

---

## 1. Os 5 achados que mudam decisões

### A. Parcelamento — o whitespace é o **risco de rescisão**, não o controle de parcela (doc 07)
Controle de parcela é table-stake maduro (ERPs fazem). A API Integra Contador SÓ cobre parcelamento **federal de Simples/MEI** (consulta + emissão de DAS da parcela; **sem adesão via API**); PGFN/transação são manuais. **O que ninguém faz e nós devemos fazer:** alertar que **o parcelamento vai ser rescindido** (3 parcelas em atraso cancelam o Simples e o cliente perde o desconto, janela de 30 dias). É o alerta mais acionável e casa com a defensabilidade. **Transação Tributária** entra como inteligência + gancho de honorário de êxito (modelo D6), não automação (não há API).

### B. e-CAC/saúde fiscal — o benchmark a bater tem nome: **Veri** (doc 08)
Veri (veri.com.br) monitora e-CAC + CND fed/est/mun + DCTFWeb + DAS + dívida ativa + parcelamentos via API oficial, **recalcula e gera guia atualizada na inadimplência e envia por WhatsApp**. O pedido do Renan tem 2 camadas: **monitoramento** (commodity lotada) + **entrega de guia "Nível 3"** (lançar a guia direto no Contas a Pagar do ERP do cliente — Conta Azul↔Domínio já fazem). A entrega é o pedaço defensável. **Integra Contador não basta** → soma com Infosimples (CNDs) + PGFN/Regularize (dívida ativa; **FGTS migrou para PGFN em 01/06/2026**) + FGTS Digital (GRF-e: só Pix, cert SHA-384).

### C. Parser — são **dois motores**, e a regra é "XML primeiro" (doc 09)
(1) XML fiscal = determinístico, 100% preciso, interno, custo zero (NF-e/NFC-e/CT-e/NFS-e nascem em XML). (2) OCR/Document AI só para o que **não tem XML** (DANFE escaneado, recibos, guias). **Decisão de provider:** **Azure AI Document Intelligence** (tem residência **Brazil South** — AWS Textract e Google Document AI não têm BR) = mitigação LGPD + argumento de venda; LLM-vision (Claude 97,6%) como fallback. O Documentize herdado já faz hash perceptual/dedup/identificação de tipo/HITL → reaproveitar.

### D. Comissionamento — Renan e Breno NÃO conflitam; e há **1 decisão bloqueante** (doc 10)
São 2 eixos: Renan = mão-de-obra (70/30, indicador 30% dos 30%); Breno = fee de plataforma (5–7%). Ambos cabem como camadas configuráveis. **Valores absolutos = decisão correta** (precedente GestãoClick). Fonte jurídica de ouro: **COSIT 107/2024** — receita do prestador é só o honorário; cada parte fatura sua fatia, a restituição vai direto ao cliente (nunca pela nossa NF). **🔴 BLOQUEANTE:** os R$7.000/R$2.000/R$900 da reunião só fecham se o "5–7%" incidir **sobre o success-fee, não sobre o recuperado**. Cravar a base com Renan/Breno antes de codar o engine.

### E. Suítes/parceria — comprar commodity das 3 espécies; parceria = operação+canal, não moat (doc 11)
Há 3 espécies de suíte (ERP-contábil / inteligência fiscal / gestão+emissão) e **nenhuma cobre o ciclo inteiro bem**. A fronteira onde estamos (captura→auditoria→e-CAC) **já é commodity** (e-Auditoria/SIEG/Jettax + Roit/FiscAI na auditoria-IA). **3 whitespaces:** trilha verificável por terceiro (STF Tema 736), confiança calibrada que se abstém, e ciclo integrado com cClassTrib auto-auditado + health score. Sobre o **contador empreendedor (~400 clientes):** aproveitar como acelerador da **camada operacional madura + distribuição** — a cobertura de prefeituras dele está em **depreciação acelerada pela NFS-e Nacional 2026**. Due diligence técnica obrigatória (é commodity ou operação difícil de replicar?).

---

## 2. Sinal HYDRA fresco (22–24/Jun, fontes: Contábeis/JOTA/Jornal Contábil)

- 🆕 **DeRE — Declaração de Regimes Específicos** (Ato Conjunto nº 3, Receita + Comitê IBS): **nova obrigação acessória da Reforma**, documentação técnica recém-oficializada. → Item de roadmap a monitorar: pode virar feature de obrigação acessória; "seu sistema está pronto?" é exatamente o gancho de venda.
- 🆕 **DeRE/CGIBS** reforça que 2026 tem obrigações acessórias novas saindo do forno — vantagem de quem suporta cedo.
- 🔴 **"+400 mil MEIs podem perder o CNPJ por dívida fiscal"** — reforça o wedge do **medo de CNPJ inapto** + parcelamento/regularização (doc 07/08). Gancho emocional real e atual.
- ⏰ **"Empresas têm até julho para adaptar notas fiscais"** (Reforma) — reforça o relógio da Captura/Emissor.
- ⚖️ **"Desafio da transação tributária é mudança de cultura"** (PGE-SP) + **"governo abre feirão de descontos, MEIs têm vantagens"** — confirmam a transação como tema quente (doc 07).
- 🛡️ **"SPED Fiscal: automação reduz risco de autuação"** — narrativa de defensabilidade validada pela imprensa.
- 📅 **Imposto Seletivo** pode virar MP em outubro; **STJ/STF** já têm as primeiras disputas da Reforma — o ambiente regulatório segue se movendo (manter o motor versionado e bitemporal, como já decidido).

---

## 3. Scorecard atualizado (frentes novas)

| Frente nova | Table-stakes | Cobrimos hoje | Estratégia | Whitespace nosso |
|---|---|---|---|---|
| **Parcelamentos** (doc 07) | controle de parcela + consulta/emissão DAS | ~0 | comprar consulta (Integra+Infosimples), construir controle/alerta | **alerta de rescisão iminente** |
| **Saúde fiscal + entrega de guia** (doc 08) | monitor e-CAC/CND/dívida ativa + guia | front ✅ / backend 0 | comprar provedores, construir orquestração+entrega Nível 3 | health score cross-módulo + entrega no ERP |
| **Parser/reconhecimento** (doc 09) | XML parse + OCR ~97% | Documentize ½ | construir XML; comprar Azure DocAI | confiança por campo + classe de insumo na trilha |
| **Comissionamento/repasse** (doc 10) | split + exibição | 0 (demo) | construir engine | split multi-parte transparente na trilha |

---

## 4. Impacto no plano de build (delta sobre o doc 56)

A reunião puxa **escopo de e-CAC/parcelamento para mais cedo** (é o que o Renan vende e o que tem gancho de medo agora), enquanto a auditoria cClassTrib (o long-pole do tributarista) ganha urgência só em 2027. Ajuste sugerido na **Fase B**:

- **B-eCAC sobe de prioridade** e ganha 2 stories novas: **parcelamento (controle + alerta de rescisão)** e **entrega de guia Nível 3** (ERP). Continua 🔒 contratos (SERPRO/Infosimples/Regularize/FGTS Digital/WhatsApp/chaves ERP).
- **Nova fase transversal "Parser" (R0–R8, doc 09)** — pré-requisito de toda automação; parte [build] (XML) começa já, OCR depende de conta Azure + golden-set de extração.
- **Comissionamento (doc 10)** vira módulo dentro da Fase C (Recuperação), com a **decisão de base do fee (C10.8) como gate bloqueante** antes de codar.
- **Monitorar DeRE** como candidato a obrigação acessória (Fase D / add-on).

### Caminho crítico humano (atualizado) — nada disso é código
1. 🔴 **Cravar a base do fee de plataforma** (5–7% sobre success-fee, não sobre recuperado) — Renan+Breno. *Desbloqueia o engine de repasse.*
2. **Perfil da carteira do Renan**: % Simples (onde a API ajuda) vs PJ/PGFN (mais manual). *Calibra a prioridade de parcelamento.*
3. **Política de canal** (escritório↔cliente na entrega de guia Nível 3 — §8.1 do doc 08).
4. **Due diligence técnica do contador empreendedor** (commodity B ou operação difícil? conflita/soma com Gestorize?).
5. Gates já conhecidos: keys Supabase, tributarista (golden-set), contas provider/SERPRO/Infosimples/Focus/Azure/contrato ADN.

---

## 5. Recomendação para os ~8 dias de MVP

Dado que (a) o MVP vai para 10 contadores grátis validarem **usabilidade**, (b) os gates externos (contratos/tributarista/Supabase) não fecham em 8 dias, e (c) a casca já está competitiva — o MVP honesto dos 8 dias é **a suíte navegável atual + 2 reforços de percepção de valor** que não dependem de gate:
1. **Alerta de rescisão de parcelamento** na carteira (mesmo com dado sintético, demonstra o whitespace #1 — barato, alto impacto na demo).
2. **UX de repasse com valores absolutos** (doc 10) — fecha a conversa comercial com o Renan e é puro front.
3. Feedback interno na plataforma (pedido da reunião) para coletar bugs dos 10 contadores.

Deixar claro aos contadores que captura/e-CAC reais ligam quando os contratos fecharem (selos de honestidade já existem no app). **Não prometer integração real no prazo de 8 dias.**

---

*Docs-fonte: `07-parcelamentos-transacao.md`, `08-ecac-cnd-guias-divida.md`, `09-doc-parser-ocr.md`, `10-comissionamento-repasse-ux.md`, `11-suite-benchmark-completo.md` (cada um com fontes primárias e URLs). HYDRA: `tools/hydra/hydra-data/originals/` (run squad-contabil 22–24/Jun).*
