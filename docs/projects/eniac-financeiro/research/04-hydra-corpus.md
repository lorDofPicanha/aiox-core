# Frente 4 — Mineração do corpus curado HYDRA

> Data: 2026-06-20 · aios-analyst · Minerado: contabil/fiscal/gestao/negocios/legal/product/ai-ml
> (~26 arquivos lidos). ⚠️ Artigos são RESUMOS curados (título+tags+1-6 quotes), não corpo full.
> Viés: maioria do sinal regulatório vem de UMA família de fontes (TecnoSpeed/jornalcontabil) —
> tratar como lente de vendor de ERP, não triangulação independente. Verificar antes de travar.

## Sinais regulatórios BR (load-bearing pro produto)
- **Reforma Tributária — deadline duro 01/ago/2026 p/ IBS/CBS.** Regulamentos publicados 30/abr/2026.
- **Destaque de IBS/CBS obrigatório em documentos fiscais eletrônicos a partir de ago/2026** — falha gera multas; agosto define início de penalidades.
- **2026 = fase de testes da Reforma** — software deve lidar com layouts duais/transição em 2026.
- **NFS-e Nacional obrigatória p/ optantes do Simples a partir de set/2026** (autônomos+Simples desde ago/2026). Afeta captura de receita/recebíveis.
- **🔴 CNPJ ALFANUMÉRICO** (nova Nota Técnica NFS-e + campos IBS/CBS): CNPJ não pode mais ser assumido numérico → **mudança estrutural de modelo de dados**.
- **Teto Simples pode saltar R$4,8M → R$12M (PLP 140/2026)**; ME R$360k→R$1,2M; 5 anos de carência. ⚠️ AINDA no Congresso (proposta, não lei).
- **Teto MEI planejado R$100k (2027)→R$120k (2028)**; contribuição pode virar % do faturamento.
- **DASN-SIMEI em atraso é severo e automatizável como alerta:** multa mín. R$50, mas bloqueia boleto DAS, bloqueia emissão NF-e, omissão repetida → inaptidão CNPJ. → feature "radar de prazos de compliance".
- **CSLL = risco de caixa:** não-pagamento bloqueia CND (Certidão Negativa de Débitos), exigida p/ crédito bancário acessível. Rastrear CND status das 3 empresas = value-add concreto.
- **IOF subiu (STF 2025):** operações de crédito Simples 0,88%→1,95%/ano. Encarece qualquer antecipação/empréstimo que o tool modele/recomende.
- **CNAE define anexo/alíquota do Simples** — as 3 empresas ENIAC (segmentos diferentes) provavelmente em **anexos diferentes** → modelar anexo POR empresa, não alíquota global.

## Open Finance / fintech (real mas raso, vendor-skewed)
- Open Finance e Reforma Tributária "caminham juntos" — vendors acoplam integração bancária + compliance fiscal.
- **"API de Extrato" Open Finance = primitivo nomeado p/ software de gestão PME** (agregação extrato → auto-categorização → crédito). Exatamente o que o livro-caixa ENIAC precisa.
- Existe um **"Open Finance para ERPs — Checklist de Implementação" (TecnoSpeed)** mas o arquivo curado não tem corpo → re-fetch da URL original (doc mais on-point do corpus).
- Conciliação bancária bundleada com Split de Pagamento + TEF como tríade de automação financeira ERP.
- **Lição LatAm (CEO LaFinteca):** "se não integra aos meios locais, você não existe"; regulação é função central, não detalhe; confiança é local. → Pix/boleto/banco local = table-stakes; LGPD/Open Finance = arquitetura core.
- **Validação global da tese "IA + agregação bancária":** OpenAI ligando ChatGPT a contas via **Plaid** (12k instituições); **200M pessoas/mês já perguntam finanças ao ChatGPT**. Tailwind forte + ameaça competitiva futura.
- **Não achado:** Pluggy/Belvo por nome, consent flows, scopes, certificação, Pix/boleto mechanics → web research.

## Padrões de IA-em-finanças (princípios de alta qualidade, zero exemplo BR)
- **RAG + expertise de domínio + citação completa** é o padrão provado p/ IA em domínios tributários regulados (Blue J/GPT-4.1, confiável em US/CA/UK). → agente "posso deduzir X?/qual anexo?" deve ser RAG-grounded em fontes fiscais BR e **citar**, nunca gerar livre.
- **Explicabilidade determinística e inline** p/ decisões financeiras: modelo neuro-simbólico dá explicação determinística legível em 0,9ms (vs SHAP 30ms estocástico). → flags de anomalia/conciliação devem ser rule-grounded, determinísticas, auditáveis ("o porquê").
- **Forecasting: retrieve + ensemble multi-stage > LLM single-pass** (ForecastBench/Cassi; LLMs a 0,017 Brier de superforecasters). → fluxo de caixa: recuperar padrões históricos + ensemble, não um prompt só.
- **Produto: não lançar "Clippy".** PostHog matou seu 1º assistente IA — opt-in e útil > proativo e chato. → agente financeiro convocável e task-scoped, não chatbot que interrompe.

## Intel competitiva
- **Conta Azul = incumbente referência** PME gestão financeira+contabilidade (blog canônico). Marca de comparação.
- **Consolidação tributária acontecendo:** Grupo Visma comprou Dootax + Pag Útil = "1ª plataforma de automação tributária integrada do Brasil". Corrida armamentista de players melhor capitalizados.
- **TecnoSpeed / PlugNotas = camada de infra de documento fiscal + cálculo IBS/CBS** (Calculadora RTC + API oficial). → **buy-not-build** provável p/ cálculo de imposto e emissão NF-e/NFS-e, não competidor.
- **Simulador da Reforma Tributária = feature esperada emergente** — diferenciador embutível (valioso com 3 entidades em anexos diferentes).
- **Blue J = precedente internacional** de tax-research AI-native venture-scale; sem equivalente BR no corpus → possível whitespace.

## Confiança
- Timeline/fatos regulatórios BR: MÉDIA-ALTA (específicos/datados mas fonte única; verificar deadline ago/2026 IBS/CBS e status PLP 140 independentemente; PLP 140 ainda NÃO é lei).
- Open Finance/fintech: BAIXA-MÉDIA (direção confirmada, implementação ausente).
- Padrões IA-em-finanças: MÉDIA (princípios fortes, zero exemplo BR).
- Intel competitiva: MÉDIA.

## ⚠️ Cross-reference importante
Memória anterior `D:\AIOS\.claude\agent-memory\aios-analyst\buscador_livro_caixa_research_18may.md`
já cobre: **preços Pluggy (R$8-32)**, landscape ERP (Conta Azul R$160, Omie, Nibo, Granatum R$396,
Tiny R$99 multiempresa), **anti-conluio coligadas (Lei 6.404)** — relevante p/ consolidar 3 CNPJs.
Mesclar com este brief.
