# DPA Site-Prospector — Memo de Decisões-Chave

**Documento:** memorando explicativo das escolhas estruturantes do DPA v1 (`dpa-site-prospector-v1-2026-05-15.md`)
**Data:** 2026-05-15
**Autor:** Legal Chief (Lawrence Lessig persona), com anchor @patricia-peck (LGPD/CDC/Digital Law BR) e consulta @heather-meeker (General Counsel review) + @richard-susskind (reusabilidade legal tech)
**Destinatário primário:** advogado(a) OAB-SC que revisará o Contrato Principal v1.1 + DPA antes da assinatura
**Destinatário secundário:** Breno (CONTRATADA / fundador Site-Prospector)

---

## 1. Resumo das decisões estruturantes (PECK-AUTO-DECISIONS)

Sete decisões foram tomadas autonomamente pelo Legal Chief sem consulta ao user, com base nos parâmetros do caso (Pequeno Agente ANPD, Anchor #1 padaria Blumenau, hard review 09/Jun, advogado OAB-SC contratado para v1.1). Cada decisão abaixo é reversível na revisão profissional.

| # | Decisão | Alternativa rejeitada | Por quê |
|---|---------|----------------------|---------|
| D1 | **DPA robusto, não simplificado** | "Versão Pequeno Agente" enxuta (3-4 páginas) | Resolução CD/ANPD 2/2022 simplifica ROPA/DPO/comunicações, mas NÃO simplifica obrigações contratuais do art. 39 LGPD. Robusto é defensável em audit ANPD e em mudança de porte da CONTRATANTE (Cláusula 8.4 contrato exige revisão em 60d se porte mudar) — economiza reescrita. |
| D2 | **Cláusulas-padrão ANPD (Res. 19/2024) + DPAs vendor incorporados por referência** como base da Transferência Internacional (art. 33, II) | (a) Consentimento Titular (art. 33, VIII) — fragmentado, revogável; (b) Adequação ANPD (art. 33, I) — não publicada lista; (c) Cláusulas específicas (art. 33, IV) — exigiria draft custom por vendor | Vercel/Google/Meta publicam DPAs SCC-equivalentes já aceitos por milhões. ANPD finalmente publicou template de cláusulas-padrão em out/2024 (Res. 19/2024). Caminho mais defensável em 2026 para operações de baixa criticidade. |
| D3 | **CONTRATANTE designa seu próprio Encarregado/contato responsável (Anexo B); CONTRATADA dá apoio operacional, não vira DPO da padaria** | CONTRATADA assumir papel de DPO temporário para padarias-clientes | Conflito de interesses estrutural: Operadora não pode ser Encarregado do Controlador (incentivo a esconder próprio incidente). Patricia Peck (consultoria 12/Mai) já flagou isso. Pequeno Agente está dispensado de designação formal (Res. 2/2022 art. 11) — basta contato responsável, ônus suportável pela padaria. |
| D4 | **Sub-operadores: pré-autorização + lista no Anexo A + notificação 30d para incluir novo** | (a) Anuência por sub-operador caso a caso — fricção operacional; (b) Anuência genérica sem lista — risk em fiscalização ANPD | Equilibra eficiência (não trava cada adição) com transparência (lista nominal + direito de objeção). Espelha o GDPR Art. 28(2)(d) "general written authorisation" — modelo robusto e auditável. |
| D5 | **Retenção calibrada por Fluxo: Tracking 14m (padrão GA4), Forms 12m, WhatsApp 24m, IP/logs 6m (Marco Civil)** | (a) Retenção uniforme 24m — overretention em formulário; (b) Retenção mínima 6m em todos — não viabiliza analytics ano-a-ano | Cada Fluxo tem propósito distinto, retenção segue finalidade (LGPD art. 6º, V). 14m alinha com expiração nativa cookie GA4, evita inconsistência operacional. 6m IP/logs cumpre Marco Civil art. 15 sem excesso. |
| D6 | **Não-cumulatividade explícita: CONTRATADA NÃO vira Encarregado da CONTRATANTE** | Cláusula silente | Reforça D3, fecha gap interpretativo. Anchor cliente (padaria) provavelmente vai pedir/precisar de DPO informal — explicitar a vedação evita pressão comercial posterior. |
| D7 | **Template canonizável (Susskind opinion): SIM, com 7 variáveis abstraídas para reuso na pipeline Site-Prospector** | DPA customizado por cliente | Stage 1 paid (pós-anchor) prevê N clientes. Custo legal de redraft completo por cliente mata economia unitária. Variáveis: (i) razão social/CNPJ CONTRATANTE, (ii) provedor analytics A3 (GA4/PostHog), (iii) provedor backend A5 (Resend+Supabase/Vercel KV), (iv) sub-operadores adicionais setoriais, (v) sobreescritas de retenção (setores regulados), (vi) contato Encarregado, (vii) data de assinatura. Demais cláusulas permanecem fixas. |

---

## 2. Base legal da Transferência Internacional — justificativa expandida

**Cenário:** Vercel (USA), Google LLC (USA), Meta Platforms (USA), provavelmente Resend (USA) e Supabase (USA region default, BR region disponível mediante upgrade pago) processarão Dados Pessoais decorrentes dos Fluxos (a)(b)(c).

**Alternativas analisadas (LGPD art. 33):**

| Inciso | Hipótese | Adoção neste DPA | Justificativa |
|---|---|---|---|
| I | Adequação ANPD do país receptor | NÃO | ANPD não publicou lista até 2026-05-15. EUA não adequado por padrão. |
| II | **Cláusulas-padrão contratuais (SCC) + cláusulas específicas** | **SIM (primária)** | Res. CD/ANPD 19/2024 publicou template oficial em out/2024. Vendors já operam com SCC GDPR equivalentes. Incorporação por referência aos DPAs públicos dos vendors é prática consolidada pós-Res. 19/2024. |
| III | Normas corporativas globais (BCR) | NÃO | Aplicável a grupos empresariais, não a fornecedor externo. |
| IV | Cláusulas específicas | Subsidiária | Apenas se Sub-Operador específico não tiver DPA público (ex.: fotógrafo terceirizado — usa termo de confidencialidade interno). |
| V | Cooperação jurídica internacional | N/A | Transferência operacional, não jurisdicional. |
| VI | Proteção da vida do Titular | N/A | |
| VII | Autoridade pública | N/A | |
| VIII | Consentimento específico | NÃO | Frágil: revogável pelo Titular individual quebra operação inteira do site. Não escalável. |
| IX | Cumprimento de obrigação legal | N/A | |
| X | Execução de contrato com o próprio Titular | Parcialmente aplicável ao Fluxo (b) Formulário | Citado supletivamente, não como base primária — analytics e tracking não decorrem de contrato com o Titular. |

**Resultado:** SCC + DPAs vendor incorporados (art. 33, II). Memorial de defesa em fiscalização: Res. 19/2024 + DPAs vendor arquivados + lista nominal de Sub-Operadores autorizados pela CONTRATANTE = compliance demonstrável.

**Plano B documentado na Cláusula 7.4:** se ANPD endurecer requisitos pós-2026, migração negociada em 90d. Caso extremo (vendor recusa nova SCC ANPD), troca por vendor BR ou serviço self-hosted.

---

## 3. Risk-flags pro advogado OAB-SC (top 5)

Lista de pontos do DPA que pedem segunda opinião profissional antes da assinatura. Cada flag aponta a cláusula e a discussão exigida.

### Risk-Flag #1 — Cláusula 7ª Transferência Internacional vs jurisprudência catarinense recente

**Status:** Adoção da Res. 19/2024 ANPD como base. Vendor SCCs incorporados por referência.
**Risco:** decisão judicial isolada pode entender que "incorporação por referência" não atende ao requisito de "instrumento contratual escrito" do art. 33 LGPD. TJ-SC ainda não consolidou posição.
**Pergunta ao advogado:** há decisão TJ-SC ou jurisprudência regional Sul confirmando suficiência de SCC + DPA vendor para Pequeno Agente? Se posição local for cética, vale anexar cópia física dos DPAs vendor ao Anexo A como "Anexo A-bis" para reforço probatório.

### Risk-Flag #2 — Cláusula 9.5 "prazo razoável" 3 dias úteis para comunicação à ANPD

**Status:** parâmetro interpretativo adotado pelas PARTES, dado o silêncio normativo do art. 48 LGPD.
**Risco:** Resolução CD/ANPD nº 15/2024 (se promulgada após 2026-05-15) pode fixar prazo distinto. Hoje (2026-05-15) o regulamento de incidentes ainda está em discussão pública.
**Pergunta ao advogado:** o prazo de 3 dias úteis é defensável contra eventual norma ANPD posterior? Vale fixar "no prazo mais célere entre 3 dias úteis e o prazo então vigente fixado pela ANPD"? (Sugerido — protege em ambos cenários.)

### Risk-Flag #3 — Cláusula 6ª Sub-Operadores: pré-autorização genérica vs. doutrina LGPD conservadora

**Status:** lista nominal no Anexo A + 30d de notificação para inclusão de novo Sub-Operador + direito de objeção fundamentada.
**Risco:** doutrina LGPD mais conservadora (Caitlin Mulholland, Patricia Peck em artigos pós-2023) defende anuência específica por sub-operador como padrão preferencial. Não é exigência legal, é melhor prática.
**Pergunta ao advogado:** TJ-SC tem precedente sobre suficiência de pré-autorização genérica em DPA? Caso advogado entenda conservador, alternativa é exigir consentimento expresso por e-mail para CADA novo Sub-Operador, em até 15d — mais fricção, mas defensável.

### Risk-Flag #4 — Cláusula 11.5 Não-cumulatividade Encarregado vs Operadora

**Status:** vedação explícita da CONTRATADA atuar como Encarregado da CONTRATANTE.
**Risco:** **inverso** ao da maioria das cláusulas — risco está em advogado(a) ou cliente quererem REMOVER essa vedação. Não remover.
**Pergunta ao advogado:** confirma que a vedação é higiene contratual razoável e protetiva da CONTRATADA contra responsabilização cruzada? (Posição da Legal Chief: SIM, manter.)

### Risk-Flag #5 — Cláusula 10.1 Retenção 14 meses Tracking

**Status:** alinhado a padrão GA4. PoP cliente do template 08-legal seção 4 fala em "12 meses (logs server)" e "24 meses (clicks)" — há **inconsistência aparente** com este DPA.
**Risco:** descompasso entre o que a PoP do cliente promete (12-24m) e o que o DPA estipula (14m clicks + 6m logs) gera ataque consumerista (CDC art. 31 informação clara).
**Pergunta ao advogado:** harmonizar para qual número? Recomendação Legal Chief: **revisar a PoP do cliente para refletir os números deste DPA (14m clicks, 6m IP/logs, 12m formulário, 24m WhatsApp)** após validação OAB-SC. Tarefa adicional pendente: atualizar `08-legal-templates-draft.md` seção 4 (PoP cliente) e seção 7 (PoP institucional Site-Prospector).

---

## 4. Diferenças que o advogado OAB-SC pode querer ajustar para TJ-SC-friendly

Ajustes de redação previstos como espaço de manobra do advogado sem comprometer a estrutura:

1. **Glossário (Cláusula 1ª):** advogado pode preferir reorganizar ordem alfabética em vez de ordem temática. Cosmético, sem impacto material.

2. **Cláusula 4.2 "Vedações expressas":** redação afirmativa "não poderá". Advogado pode preferir formato "obriga-se a não" para uniformidade com Cláusula 4.1. Cosmético.

3. **Cláusula 6.4 Solidariedade Sub-Operador:** redação atual diz "solidariamente responsável perante a CONTRATANTE". Doutrina civilista catarinense às vezes prefere "responsável objetivamente perante a CONTRATANTE pelos atos do Sub-Operador". Mesma proteção, redação mais conservadora. Advogado decide.

4. **Cláusula 9.4 Apoio operacional na comunicação ANPD:** redação atual mantém comunicação ANPD como ato da CONTRATANTE. Advogado pode propor inversão (CONTRATADA elabora minuta, CONTRATANTE assina) — Legal Chief recomenda manter como está, evita confusão sobre quem é responsável formal.

5. **Cláusula 12.1(d) Auditoria presencial só em caso de incidente "risco/dano relevante":** condição restritiva pode ser questionada pela CONTRATANTE. Advogado pode propor flexibilização para "incidente moderado a relevante" ou "circunstâncias excepcionais documentadas". Legal Chief aceita flexibilização — não compromete estrutura.

6. **Cláusula 13.6 Lei aplicável — citação à Res. CD/ANPD nº 15/2024:** se não vigente em 2026-05-15, manter referência condicional "se vigente". Advogado confirma status na data da assinatura.

7. **Anexo A — Sub-Operador A3 e A5 abertos:** advogado pode exigir fechamento antes da assinatura. Legal Chief recomenda fechar A3 (escolha GA4 vs PostHog) e A5 (Resend+Supabase vs Vercel KV) antes do go-live, atualizar Anexo A por troca de e-mail (Cláusula 13.2).

---

## 5. Cross-references com o Contrato Principal

Pontos onde o DPA depende de cláusula do Contrato Principal estar em forma final:

| DPA refere | Contrato Principal | Status |
|---|---|---|
| Considerandos (porte Pequeno Agente) | Cláusula 8.4 + Anexo IV (Parecer Pequeno Agente) | Anexo IV ainda **não existe** — risk-flag review v1 #4. Substituir por nota técnica interna 1-pager. |
| Cláusula 2.3 prevalência DPA em matéria de dados | Cláusula 8.3 + Cláusula 20.4 (anexos integrantes) | Compatível. Manter. |
| Cláusula 5.1(h) Direitos de imagem | Cláusula 1.5 do Contrato Principal (Faltante #3 do review) | **Cláusula 1.5 ainda não escrita.** Advogado deve incorporar v1.1 — review v1 já entregou proposta de redação. |
| Cláusula 6.3 Rescisão por objeção Sub-Operador | Cláusulas 7.3 e 12 Contrato Principal | Compatível. Manter. |
| Cláusula 9.1 Notificação 48h | Cláusula 8.5 Contrato Principal | Compatível (literalmente espelha). Manter. |
| Cláusula 11.7 Atendimento gratuito Titular | (não tem espelho — DPA-only) | OK. |
| Cláusula 12.2 Confidencialidade | Cláusula 9ª Contrato Principal | Compatível. Manter. |
| Cláusula 13.4 Solidariedade limitada art. 42 LGPD | Cláusula 13 Contrato Principal (Limitação responsabilidade) | **Atenção:** Cláusula 13 do Contrato Principal está sob risk-flag do review v1 (Crítica #5 — lucros cessantes). Quando reescrita, validar coerência com 13.4 deste DPA. |
| Cláusula 13.5 Foro | Cláusula 16ª Contrato Principal | Compatível. Manter. |

---

## 6. Próximos passos operacionais (caminho até v1.1 consolidar)

Pré-condições para que a CONTRATANTE possa assinar com DPA pronto:

1. **Imediato (Legal Chief / Breno):** levar este DPA + memo + revisão v1 ao advogado OAB-SC. Pedir parecer integrado v1.1 contrato + DPA. Estimativa esforço incremental advogado: 6-12 horas, ~R$ 1.200-3.000.

2. **Em 5 dias úteis (Breno):** decidir A3 (GA4 vs PostHog) e A5 (Resend+Supabase vs Vercel KV) — completar Anexo A.

3. **Em 5 dias úteis (Breno):** preparar nota técnica 1 página declarando enquadramento Pequeno Agente ANPD (substitui Anexo IV do Contrato Principal — review v1 Crítica #4).

4. **Em 10 dias úteis (Breno + advogado):** consolidar PoP cliente template + PoP institucional Site-Prospector (`08-legal-templates-draft.md` seções 4 e 7) com retenções harmonizadas a este DPA (Risk-Flag #5).

5. **Em 10 dias úteis (advogado):** devolver v1.1 do Contrato Principal absorvendo 5 críticas + 3 cláusulas faltantes + cross-references com este DPA.

6. **Em 15 dias úteis (Breno):** organizar pasta de arquivamento (DPAs vendor Vercel/Google/Meta em PDF, Anexo A consolidado, Anexo B preenchido, Termo Anchor Pilot para padaria #1).

7. **Antes da assinatura anchor (target ≤ 2026-06-09 conforme hard review):** validar com advogado que **todos os anexos do Contrato Principal (Cláusula 20.6) existem** — DPA assinado, Documento de Transparência impresso, Spec do plano Growth (1-pager), Nota técnica Pequeno Agente.

---

## 7. Anotação Heather Meeker (review estrutural)

@heather-meeker (General Counsel persona): estrutura sólida, 13 cláusulas + 2 anexos é proporcional ao caso (Pequeno Agente, baixo risco). Pontos de elogio: (i) separação clara controladora-operadora-sub-operadores; (ii) gestão explícita de Sub-Operadores via Anexo destacado; (iii) vedação à cumulatividade Encarregado/Operadora; (iv) plano de transição para Transferência Internacional. Único alerta estrutural: considerar adicionar **uma cláusula de "assistência sob requisição da ANPD"** explicitando que a CONTRATADA cooperará com solicitações específicas da ANPD dirigidas à CONTRATANTE — coberto implicitamente pela 4.1(e), mas explícito facilita resposta sob pressão de fiscalização. Sugestão de redação para advogado considerar:

> 4.1(e)-bis. Em caso de requisição formal da ANPD dirigida à CONTRATANTE relacionada aos Fluxos de Tratamento, a CONTRATADA disponibilizará as informações técnicas e operacionais sob seu controle necessárias à resposta, em prazo razoável definido pela CONTRATANTE em consonância com o prazo da requisição.

## 8. Anotação Richard Susskind (reusabilidade legal tech)

@richard-susskind (legal tech automation): este DPA é um **template canonizável de alto valor** para o pipeline Site-Prospector. Recomendação:

(a) versionar em repositório dedicado (`docs/legal/templates/dpa/`) com cada cliente firmado gerando uma **instância derivada** com diff mínimo;

(b) abstrair as 7 variáveis identificadas em D7 (Seção 1 deste memo) em frontmatter ou bloco substituível;

(c) montar **changelog público interno** das versões do DPA — quando ANPD publicar nova Resolução, atualização propaga a todos os clientes em ciclo programado de revisão (Cláusula 13.3 já suporta);

(d) ROI estimado: cada novo cliente Site-Prospector economiza ~R$ 800-1.500 em redraft jurídico vs. partir do zero. Em Stage 1 paid (12+ clientes/ano projetado), economia bruta ~R$ 10-18k/ano vs. custo de manutenção do template ~R$ 1.500-3.000/ano (1-2 revisões anuais por advogado OAB-SC). Margem positiva clara.

---

⚠️ **Disclaimer obrigatório.** Este memorando é orientativo e não substitui consulta com advogado(a) com OAB ativa. As posições jurisprudenciais e doutrinárias citadas devem ser confirmadas em pesquisa atualizada antes de qualquer ação juridicamente relevante. Os mind clones @patricia-peck, @heather-meeker e @richard-susskind utilizados nesta análise são simulações computacionais baseadas em obras publicadas pelos autores; opiniões aqui apresentadas devem ser validadas por profissional habilitado(a) antes da assinatura ou submissão a autoridades.
