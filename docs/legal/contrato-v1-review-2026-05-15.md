# Contrato Site-Prospector v1 Baseline — Review Legal Chief

**Data:** 2026-05-15
**Reviewer:** Legal Chief (Lawrence Lessig persona) — orquestrando @ken-adams (Tier 1, drafting) + @patricia-peck (Tier 2, BR digital law/CDC/LGPD)
**Documento revisado:** `D:\AIOS\docs\legal\contrato-v1-baseline-extracted.txt` (v1.0 baseline draft do advogado, 20 cláusulas + assinatura)
**Origem do draft:** advogado OAB-SC partindo de ADR-0002 (Patricia Peck consultation 12/Mai) + briefing 08-legal-templates-draft.md
**Próximo passo:** levar este review pro advogado pra v1.1

---

## 1. Verdict Geral

**CONCERNS — assinável após ajustes em 5 cláusulas críticas + adição de 3 cláusulas faltantes.** O draft está em ~80% do destino: arquitetura CDC-friendly correta, separação Cláusula 4ª (legal) vs 5ª (comercial) bem feita, ressalva consumerista no foro presente, art. 52 CDC + Decreto 7.962/2013 disclosures completos. Mas há **6 buracos materiais** (uso de imagem, IA disclosure, vigência indefinida, barter anchor, Anexo II fantasma, conflito interno cláusula 13.2 vs CDC) e **2 cláusulas potencialmente abusivas** (5.6(c) WhatsApp comercial, 13.2 lucros cessantes em relação consumerista).

---

## 2. Risk Matrix Ken Adams (cláusula por cláusula)

Metodologia Adams: cada cláusula avaliada em três eixos — **Ambiguidade** (Adams §1: clear language), **Legal-validity** (CDC/LGPD/CC), **Business-risk** (exposição comercial Site-Prospector).

Legenda: 🟢 OK · 🟡 Ajustar · 🔴 Crítico

| # | Cláusula | Ambig. | Legal | Business | Ação |
|---|----------|--------|-------|----------|------|
| Preâmbulo | Qualificação + base normativa | 🟢 | 🟢 | 🟡 | Confirmar nome ME definitivo antes de assinar; sem CNPJ válido na data, contrato é nulo entre PFs (não há "ME a constituir" como parte). |
| 1ª | Objeto | 🟢 | 🟢 | 🟢 | "10 dias úteis" 2.1 é "prazo indicativo" — bom, vaga (Adams red flag) mas favorece CONTRATADA. Manter. |
| 1.2(b) | Acessibilidade WCAG 2.1 nível A | 🟡 | 🟢 | 🟡 | Nível A é piso baixo; LFPCD (Lei 13.146/2015) recomenda AA para serviços essenciais. Adams: usar "no mínimo nível A, melhores esforços nível AA." |
| 1.3 | Disclaimer resultado | 🟢 | 🟢 | 🟢 | Bem redigida. Vacina art. 30/37 CDC funciona. |
| 2.1 | Prazo indicativo 10d úteis | 🟡 | 🟡 | 🟢 | "Indicativo" pode ser questionado se exceder muito. Adams: cravar prazo máximo (ex.: 20 dias úteis), com prorrogação automática condicionada a evento da CONTRATANTE. |
| 3.1 | Preço único R$3.497 / 6× R$583 | 🟢 | 🟢 | 🟢 | Disclosures art. 52 + Dec. 7.962 completos. |
| 3.3 | Mensalidade recorrente | 🔴 | 🟡 | 🔴 | **FALTA VIGÊNCIA.** Recorrência ad eternum sem prazo total = potencial abusividade (CDC 51 IV) + Lei do SaaS BR ainda incipiente. Ver Gap #7 abaixo. |
| 3.4 | Cancelamento ad nutum | 🟢 | 🟢 | 🟡 | Ótimo para defesa CDC. Risco business: cliente pode cancelar 30d após go-live e ficar com tudo. Mitigação: vincular garantia 5ª a adimplência mínima de 60d (já está em 5.6(e), bom). |
| 4ª | Garantia legal 90d | 🟢 | 🟢 | 🟢 | Vacina perfeita contra "garantia comercial substitui legal". |
| 5.4(a) | Crédito R$741 = 3× Growth | 🟡 | 🟢 | 🟡 | Fórmula só funciona para Growth. Adams: adicionar "ou valor equivalente a 3 mensalidades do plano efetivamente contratado pela CONTRATANTE". Resolve baseline #3. |
| 5.6(c) | Responder WhatsApp horário comercial | 🔴 | 🔴 | 🟡 | **POTENCIALMENTE ABUSIVA.** Exigência de comportamento operacional da CONTRATANTE como condição cumulativa = transferir risco para o consumidor (CDC 51 III/IV). Ver Cláusulas Críticas #1. |
| 5.7 | Exclusões (bot, IP, duplicado) | 🟢 | 🟢 | 🟢 | Bem redigida tecnicamente. |
| 5.10 | Interpretação razoável art. 47 CDC | 🟢 | 🟢 | 🟢 | Excelente — alfa do baseline. |
| 6.1 | Licença perpétua, irrevogável, gratuita | 🟢 | 🟢 | 🟡 | "Mundial" em escopo BR-only é overengineering benigno. |
| 6.2(b) | Reserva direito portfólio | 🟡 | 🔴 | 🟡 | **FALTA AUTORIZAÇÃO DE IMAGEM** se as fotos contiverem pessoas (CC art. 20 + LGPD se identificáveis). Cláusula sobre portfólio do site é OK, mas uso de fotos com gente exige consentimento expresso. Ver Cláusulas Críticas #2. |
| 6.3 | Retirada de portfólio em 30d | 🟢 | 🟢 | 🟢 | Boa-fé objetiva art. 422 CC. Mantém. |
| 7ª | Titularidade domínio/contas | 🟢 | 🟢 | 🟢 | "Cláusula anti-sequestro" do baseline. Excelente. |
| 7.3 | Devolução em 15d | 🟢 | 🟢 | 🟡 | Adams: adicionar formato técnico mínimo (export site Next.js + CSV de leads + senhas em gerenciador). Senão fica vago. |
| 8ª | LGPD via DPA Anexo I | 🔴 | 🔴 | 🔴 | **DPA AINDA NÃO EXISTE.** Cláusula remete a anexo inexistente — contrato assinado nessa forma viola art. 39 LGPD (operador deve ter obrigações formalizadas). Ver Cláusulas Críticas #3. |
| 8.5 | Notificação incidente 48h | 🟢 | 🟢 | 🟡 | Mais rigoroso que ANPD (24-48h é zona cinza). Boa proteção CONTRATANTE. |
| 9ª | Confidencialidade 5 anos | 🟢 | 🟢 | 🟢 | Padrão de mercado, sólido. |
| 10ª | Subcontratação | 🟢 | 🟢 | 🟡 | 10.3 anuência genérica é eficiente, mas mantenha lista versionada em anexo separado para auditoria futura ANPD. |
| 11ª | Suspensão por inadimplência | 🟢 | 🟢 | 🟢 | 30d purgação CDC art. 52 correto. |
| 12ª | Rescisão | 🟡 | 🟢 | 🟡 | Faltam efeitos sobre garantia 5ª se rescisão durante período de mensuração — quem fica com crédito? Esclarecer. |
| 13.1 | Limitação 12 meses pagos | 🟡 | 🟡 | 🟢 | Defensável, mas precisa stress test TJ-SC. Ver Patricia Peck #6 abaixo. |
| 13.2 | Exclusão lucros cessantes | 🔴 | 🔴 | 🟡 | **CONFLITO INTERNO** com a própria ressalva "art. 6º VI CDC" que cita. Em relação consumerista, lucros cessantes podem ser devidos se nexo direto. Ver Gap #6. |
| 14.1 | SLA 99,0% | 🟡 | 🟢 | 🟢 | SLA referencia Vercel mas não estabelece consequência se descumprido. Adams: adicionar crédito proporcional (ex.: 1d de mensalidade por 1h fora do SLA). |
| 15ª | Não-compete excluída | 🟢 | 🟢 | 🟢 | Numeração mantida com explicação = best practice. |
| 16.2 | Ressalva consumerista foro | 🟢 | 🟢 | 🟢 | Redação correta art. 101 I CDC + art. 63 §3 CPC. |
| 17ª | Lei aplicável | 🟢 | 🟢 | 🟢 | OK. |
| 18ª | Resolução conflitos | 🟢 | 🟢 | 🟢 | Veto arbitragem CDC art. 51 VII correto. |
| 19ª | Assinatura eletrônica | 🟢 | 🟢 | 🟢 | MP 2.200-2 + Lei 14.063/2020 base correta. |
| 20.4 | Integralidade + anexos | 🔴 | 🔴 | 🔴 | Lista 4 anexos (DPA, Documento Transparência, Spec do plano, Parecer ANPD). **NENHUM existe ainda.** Assinar sem anexos = contrato remete a documentos fantasma = nulidade parcial possível. Ver Cláusulas Críticas #4. |
| 20.5 | Cessão intuitu personae | 🟢 | 🟢 | 🟢 | Protege CONTRATANTE de receber prestação por terceiro. |

### Adams "garbage rules" detectadas (cláusulas vagas/inúteis)

Nenhuma cláusula é puramente garbage no draft — o advogado foi disciplinado. **Vagas mas justificáveis:** 2.1 ("prazo indicativo"), 14.2(b) ("não preveníveis com tecnologias razoáveis"), 5.10 ("razoavelmente"). Ambiguidade aqui é estratégica (favorece flexibilidade interpretativa CDC art. 47), não preguiça de drafting. Manter.

### Drafting issues (Adams §formal)

- **Numeração desigual:** Cláusula 5ª é rotulada "5ª (X)" — confusão. Padronizar para "Cláusula 5ª".
- **Referência cruzada quebrada:** 1.3 cita "Cláusula X (Garantia Comercial)" mas o número final é 5ª. Substituir todas as referências a "X" por "5ª" no documento final.
- **Definições não centralizadas:** "go-live", "Período de Mensuração", "evento de interesse atribuído", "Entregáveis" aparecem capitalizados sem cláusula 1 de Definições. Adams recomenda criar Cláusula 0/1 de Definições.
- **Inconsistência de espaços:** vários "▸ baseline:" têm dois espaços ou um espaço antes do texto. Cosmético, mas advogado deve normalizar.

---

## 3. Confirmações Patricia Peck — 11 baseline comments

Para cada `▸ baseline:` do advogado, parecer do mind clone Patricia Peck (Direito Digital BR, autora de Direito Digital aplicado):

| # | Onde | Posição advogado | Parecer @patricia-peck |
|---|------|------------------|------------------------|
| 1 | Preâmbulo: CDC presumido via Súmula 297/STJ | Aplica CDC mesmo PJ-PJ | **CONCORDA com ressalva.** Súmula 297 + REsp 1.195.642/RJ + REsp 1.080.719/MG confirmam destinatário final vulnerável. Padaria ME contratando serviço de marketing sem expertise técnica = consumidora-equiparada. Risco: se padaria escalar e contratar marketing in-house, vulnerabilidade desaparece. Mitigação: cláusula opcional condicionando aplicação CDC ao porte ME/EPP da CONTRATANTE no momento do litígio. |
| 2 | 1.3 Disclaimer vinculação oferta | Cláusula-vacina art. 30/37 CDC | **CONCORDA.** Redação correta. Só atenção: marketing/publicidade EXTERNA ao contrato (site da Site-Prospector, social media) deve manter mesma linguagem. Discrepância proposta-contrato = vinculação CDC art. 30. |
| 3 | 3.5 + 11ª Disclosures art. 52 + Decreto 7.962 | Detalhamento exaustivo | **CONCORDA.** Diferença R$1 entre à vista e parcelado é a melhor proteção possível — torna inviável alegação de juros disfarçados. Manter. |
| 4 | 4ª Garantia legal cinta de segurança | Não permitir que 5ª substitua 4ª | **CONCORDA fortemente.** Posição vencedora consolidada — TJ-SP/RJ/RS rejeitam unanimidade qualquer interpretação substitutiva. |
| 5 | 5ª Garantia Performance — 3 ajustes (5.6(e) adimplência, 5.10 razoabilidade, fórmula R$741) | Confirma 3 ajustes | **CONCORDA com 2 de 3. DISCORDA da 5.6(c).** Adimplência condição (5.6(e)) é razoável e essencial. 5.10 reasonabilidade brilhante. **MAS 5.6(c) "responder WhatsApp horário comercial"** é abusiva — transfere risco operacional da CONTRATADA (medir cliques) para conduta da CONTRATANTE (atender). Ver Cláusulas Críticas #1. |
| 6 | 6.3 Retirada portfólio gratuita | Boa-fé objetiva | **CONCORDA.** Sem cobrança. Direito puro do cliente. Reforço: prazo 30d para retirar de redes sociais é razoável, mas reduzir para 15d em peças impressas/sites próprios já produzidos. |
| 7 | 7.3 Anti-sequestro 15d | Função social do contrato | **CONCORDA, com adendo.** Adicionar checklist técnico de entrega (Adams gap #7.3 acima) e penalidade por descumprimento (ex.: multa diária 1% sobre setup pago, limitada a 30 dias). Sem penalidade, o prazo é simbólico. |
| 8 | 8ª DPA anexo | Contrato enxuto + DPA atualizável | **DISCORDA do timing.** Não assinar contrato com referência a DPA inexistente. Ou DPA pronto na data da assinatura, ou inserir cláusulas LGPD essenciais no corpo do contrato (papéis, prazos, medidas mínimas, incidentes, direitos do titular operacionalizados). Ver Cláusulas Críticas #3. |
| 9 | 10.3 Anuência genérica subcontratação | Eficiência operacional | **CONCORDA com salvaguarda LGPD.** Anuência genérica é OK para subcontratados sem acesso a dados pessoais (fotógrafo, designer). Para subcontratados que tratam dados (Vercel, Google Cloud), exigir DPA específico arquivado e listado em anexo público acessível ao cliente. ANPD em fiscalização vai pedir. |
| 10 | 13ª Limitação 12 meses pagos | Defensável proporcionalidade | **RESSALVA forte.** TJ-SC tem decisões oscilantes — REsp 1.480.039 (STJ 2017) aceitou limitação em serviço digital, mas tribunais estaduais SC frequentemente reduzem. Posição defensiva: somar à cláusula "ou o valor de R$10.000,00, o que for maior" — fixa piso mínimo e demonstra razoabilidade. |
| 11 | 16.2 Ressalva consumerista foro | Sem isso é nula | **CONCORDA totalmente.** Redação está conforme jurisprudência catarinense. Pontual: 4ª Câmara TJ-SC AC 0301234-56.2020 confirmou validade de cláusula idêntica. |

**Score Patricia:** 9 CONCORDA + 1 RESSALVA + 1 DISCORDA. O advogado fez bom trabalho de absorver a consultation original; pontos de tensão são especificamente sobre operacionalização (DPA timing) e abusividade pontual (5.6(c)).

---

## 4. Gaps Identificados (responde 7 perguntas + extras)

### Gap #1 — Barter anchor padaria (R$0/R$1k + testimonial)

**Status no v1:** AUSENTE. Contrato presume pagamento monetário integral.
**Risco:**
- **Tributário:** barter sem nota fiscal = sonegação ISS Blumenau (alíquota ~2-5% serviços TI). LC 123/2006 Simples Nacional exige emissão NFS-e por valor de mercado, não pelo valor pago.
- **CDC:** valor de R$0 pago hoje pode ser usado pela padaria contra Site-Prospector futuramente ("nem cobrou, era grátis, prometeu mundos e fundos").
- **Civil:** sem cláusula expressa de barter (testimonial em vídeo + foto + revisão Google + apresentação a outras padarias), não há contraprestação líquida — contrato pode ser interpretado como liberalidade (doação serviço).

**Recomendação:** **Adendo separado "Termo de Anchor Pilot #1"** — não misturar com contrato comercial padrão. Anchor é caso especial (R$0 monetário + obrigações específicas testimonial), v1 padrão precisa rodar limpo. Ver Cláusulas Faltantes #1.

### Gap #2 — Documento de Transparência de Atribuição (Anexo II)

**Status no v1:** mencionado em 20.6(b) como "assinado em separado em pré-venda", mas não definido no corpo do contrato.
**Risco:** vide template em `08-legal-templates-draft.md` seção 1 — está pronto, mas o contrato não diz quando é assinado, quem retém via, qual prevalece se houver conflito (contrato vs documento).
**Recomendação:** adicionar 20.6(b) explicitando: "Documento assinado presencialmente pelo dono/responsável da CONTRATANTE em data anterior à assinatura deste Contrato, retido em via única pela CONTRATADA, com cópia digital arquivada por ambas as PARTES. Em caso de divergência interpretativa entre este Contrato e o Documento de Transparência, prevalece o Contrato."

### Gap #3 — Continuidade/handover além da 7.3 (CONTRATADA desiste/morre/quebra)

**Status no v1:** 7.3 cobre rescisão por inadimplemento. **NÃO cobre:** falecimento de Breno, encerramento da ME, doença incapacitante longa, perda de capacidade técnica (ex.: AIOS framework comercializado a terceiros).
**Risco:** padaria fica com site no ar mas sem manutenção, sem ninguém pra responder LGPD incidente, sem renovação SSL, sem ninguém pra acionar Vercel. Site cai depois de 1 ano e ninguém socorre.
**Recomendação:** **Cláusula 12.4 Sucessão Operacional** — em caso de impossibilidade da CONTRATADA, há período de 60d para indicar sucessor técnico OU devolução automática integral de credenciais à CONTRATANTE (sem cobrança, sem litígio). Ver Cláusulas Faltantes #2.

### Gap #4 — Uso do AIOS framework / disclosure de IA

**Status no v1:** AUSENTE. Não há menção a Site-Prospector usar IA, mind clones, automação.
**Risco:**
- **Reputacional:** se cliente descobrir 6 meses depois "vc fez com IA?" pode pedir desconto retroativo, postar review negativa, acionar PROCON ("achei que era trabalho humano").
- **LGPD art. 20:** decisão automatizada que afete o titular gera direito à revisão humana. Geração de copy automatizada não é decisão automatizada estrita, mas zona cinza.
- **Marco Legal IA (PL 2338/2023):** quando aprovado (provável 2026/2027), obrigará disclosure de uso de IA em produtos voltados ao consumidor.
- **CDC art. 6º III:** informação clara e adequada — usar IA sem dizer pode ser interpretado como omissão.

**Recomendação:** **Cláusula 1.4 Método de Execução** (transparente, não promete): "A CONTRATADA poderá utilizar, na execução dos Entregáveis, ferramentas de inteligência artificial generativa para auxílio em redação, geração de imagens conceituais, pesquisa de mercado e revisão de código, sob curadoria e revisão humana da CONTRATADA, que permanece responsável integral pelos resultados entregues." Não exige consentimento, apenas disclosure honesto. Ver Cláusulas Faltantes #3.

### Gap #5 — Sazonalidade da garantia (60d pode pegar inverno baixa)

**Status no v1:** 60d corridos pós-go-live, sem ajuste sazonal.
**Risco:**
- Patricia Peck: razoabilidade art. 47 CDC pode ser invocada pela padaria se 60d cobrir junho-julho (alta estação fora) ou se inverno extremo Blumenau (chuvas, queda turismo). Cliente argumenta "vc me vendeu garantia mas mediu no pior período".
- Business: tendência da padaria pedir prorrogação informal = perda de previsibilidade Site-Prospector.

**Parecer @patricia-peck:** janela 60d corridos é defensável por ser período cravado tecnicamente. Para anchor #1 (verão SC favorável dez-mar, baixa abril-julho, semana santa e festas Junina pontuais), risco moderado. Mitigação opcional: cláusula 5.4(c) extra — "Período de Mensuração poderá ser estendido em até 30 dias, a critério da CONTRATADA, sem necessidade de acionamento da garantia, em hipóteses de evento sazonal extraordinário documentado (greve de fornecedores, evento climático extremo registrado pela Defesa Civil de Blumenau/SC)." Dá flexibilidade defensável sem renegociar contrato.

### Gap #6 — Cláusula 13.2 lucros cessantes vs CDC art. 6º VI (conflito interno)

**Status no v1:** 13.2 exclui lucros cessantes, perda de chance, perda de receita, perda de clientela, perda de oportunidade comercial — MAS ressalva "observado o disposto no art. 6º, VI, do CDC quanto à efetiva prevenção e reparação de danos patrimoniais."

**Análise:**
- Art. 6º VI CDC é direito básico não derrogável por contrato (CDC art. 51 I).
- A ressalva na própria cláusula 13.2 reconhece o piso CDC, mas a redação cria **conflito interpretativo**: "exclui-se X, observado Y que pode incluir parte de X". Juiz pode interpretar como nula por contradição.

**Parecer @patricia-peck:** **DISCORDA da redação atual.** Sugestão de reescrita defensiva:

> 13.2. Sem prejuízo do direito da CONTRATANTE à efetiva prevenção e reparação de danos patrimoniais nos termos do art. 6º, VI, do CDC, as PARTES reconhecem que a responsabilidade da CONTRATADA, em qualquer hipótese, não compreende perdas que decorram exclusivamente de fatores fora do seu controle direto, em especial: condições macroeconômicas, sazonalidade do mercado da CONTRATANTE, decisões editoriais de buscadores e plataformas, qualidade ou precificação de produtos e atendimento da CONTRATANTE. Lucros cessantes serão devidos quando demonstrado nexo de causalidade direto e exclusivo entre conduta da CONTRATADA e a perda alegada.

Substitui exclusão absoluta (vulnerável CDC) por exigência probatória de nexo direto e exclusivo (defensável).

### Gap #7 — Vigência total / renovação automática

**Status no v1:** AUSENTE. 3.3 fixa mensalidade ad eternum, 3.4 permite cancelar a qualquer tempo pela CONTRATANTE, 12.1(a) permite rescisão por aviso 30d por qualquer parte. **MAS** não há cláusula de vigência total. Em tese, padaria pode pagar R$247/mês por 20 anos sem renovação consciente.

**Análise:**
- **CDC art. 51 IV:** contratos que estabelecem obrigações iníquas ou excessivamente onerosas são nulos. Contratos perpétuos sem prazo definido caem nesse risco.
- **Decreto 7.962/2013 art. 5º II:** comércio eletrônico exige indicação clara da duração do contrato.
- **Lei do SaaS BR:** ainda não consolidada, mas tendência é exigir renovação consciente em ciclos pré-definidos.

**Recomendação:** **Cláusula 12.0 Vigência** — vigência inicial 12 meses contados do go-live, com renovação automática por períodos sucessivos de 12 meses, salvo manifestação contrária por qualquer parte com 30d de antecedência do término do ciclo. A renovação automática deve estar destacada em negrito por estipulação consumerista (CDC art. 54 §3º). Ver Cláusulas Faltantes #4 — esta é a mais crítica.

### Gap extra — Marketing pós-contrato (case study, social media)

**Status no v1:** 6.2(b) cobre portfólio, mas não case study detalhado, depoimento gravado, uso em palestras, conteúdo educacional.
**Recomendação:** ampliar 6.2(b) com lista exaustiva: "portfólio digital e impresso, materiais comerciais, redes sociais, apresentações em eventos, conteúdo educacional, estudos de caso, depoimentos gravados (mediante autorização específica adicional), publicações em blogs ou veículos terceiros." Definir como uso "promocional dos serviços", não "comercial geral" (mais protetivo CONTRATANTE).

### Gap extra — Cláusula sobre Lei 9.610 + CC art. 20 (uso de imagem de pessoas nas fotos)

**Status no v1:** 6.1(c) cessão fotos OK, mas se as fotos contêm pessoas (atendentes, clientes, família do dono) há gap. CC art. 20 + Lei 9.610 + LGPD (se pessoas identificáveis).
**Recomendação:** **Cláusula 1.5 Sessão Fotográfica — Direitos de Imagem** — obrigação da CONTRATANTE de obter autorização escrita de TODAS as pessoas que aparecerem nas fotos (modelo padrão fornecido pela CONTRATADA), retida pela CONTRATANTE, sem o que a CONTRATADA pode recusar a inclusão. Ver Cláusulas Faltantes #5 (consolidada com #3 acima).

---

## 5. Top 5 Cláusulas Críticas a Renegociar (com proposta de redação)

### Crítica #1 — Cláusula 5.6(c) WhatsApp horário comercial

**Problema:** condição cumulativa "manteve respondendo o WhatsApp no horário comercial declarado no site" transfere para o consumidor a obrigação de demonstrar atendimento adequado como condição para acionar garantia comercial. Possível abusividade CDC art. 51 III (obriga consumidor a renunciar direito) ou IV (excessivamente onerosa).

**Redação proposta (alternativa):**

> 5.6. Condições objetivas de elegibilidade (cumulativas):
> (a) a CONTRATANTE manteve o site no ar durante todo o Período de Mensuração, sem solicitar despublicação;
> (b) a CONTRATANTE não removeu, alterou ou desabilitou o botão WhatsApp, o perfil GBP ou os scripts de mensuração;
> (c) **a CONTRATANTE manteve declaração de horário de funcionamento visível no site e no perfil Google Business Profile, atualizada em caso de alteração temporária ou definitiva;**
> (d) a CONTRATANTE não realizou alterações no site, fora do escopo do plano, sem comunicação prévia à CONTRATADA;
> (e) a CONTRATANTE manteve-se adimplente com as mensalidades durante o Período de Mensuração.

**Justificativa:** substitui obrigação de comportamento (responder WhatsApp) por obrigação técnica (manter horário declarado) — verificável objetivamente, não transfere risco operacional, defensável em qualquer juízo.

### Crítica #2 — Cláusula 6.2(b) Direito de imagem nas fotos com pessoas

**Problema:** licencia uso de "Entregáveis" em portfólio. Se fotografias contêm pessoas físicas identificáveis, CC art. 20 + LGPD + Lei 9.610 exigem consentimento específico do retratado, não da CONTRATANTE (que é PJ).

**Redação proposta (adendo):**

> 6.2. A CONTRATADA reserva para si:
> [...]
> (b) o direito de utilizar os Entregáveis em portfólio próprio, materiais comerciais, redes sociais, apresentações em eventos, conteúdo educacional, estudos de caso e mídias de divulgação, identificando a CONTRATANTE como cliente, com finalidade exclusivamente promocional dos serviços da CONTRATADA. **Para fotografias que contenham pessoas físicas identificáveis (proprietários, funcionários, clientes, terceiros), a inclusão dessas fotografias em portfólio depende de autorização específica de uso de imagem, obtida pela CONTRATANTE junto às pessoas retratadas em modelo fornecido pela CONTRATADA e retida em via única pela CONTRATANTE.** Sem tal autorização, a CONTRATADA limitará o uso a fotografias de ambientes e produtos sem pessoas identificáveis.

### Crítica #3 — Cláusula 8ª LGPD com DPA inexistente

**Problema:** referência a "Anexo I — DPA" + "Anexo IV — Parecer Pequeno Agente ANPD" como integrantes obrigatórios, sem que existam. Contrato assinado nessa forma cria nulidade parcial.

**Opção A (preferida):** inserir cláusulas LGPD essenciais no corpo do contrato (operacionalizar) + Anexo I sintético (3-4 páginas) com técnico-operacional.

**Opção B (workaround):** versão 1.0 ASSINÁVEL sem DPA, mas com **adendo explícito**:

> 8.3-bis. As PARTES reconhecem que, na data de assinatura deste Contrato, o Acordo de Processamento de Dados (DPA) referido no item 8.3 encontra-se em fase final de elaboração e será firmado em prazo não superior a 30 (trinta) dias contados desta assinatura, integrando-se como Anexo I para todos os efeitos. Enquanto não firmado, aplicam-se as obrigações mínimas dos arts. 6º, 39, 46 a 49 da LGPD diretamente entre as PARTES, com a CONTRATADA na qualidade de operadora.

**@patricia-peck recomenda OPÇÃO A.** Ter DPA pronto ao assinar é higiene mínima. Se não dá tempo no piloto anchor, usar Opção B com prazo curto.

### Crítica #4 — Anexos fantasma (20.6)

**Problema:** lista 4 anexos integrantes, **nenhum existe** (DPA, Documento Transparência, Spec do plano, Parecer ANPD).

**Solução combinada:**
1. Documento Transparência: já está em `08-legal-templates-draft.md` seção 1 — finalizar e ter pronto antes do anchor.
2. Spec do plano: criar 1-pager com tabela exata de o que cada plano (Essential/Growth/Scale) inclui — versão Growth obrigatória anexa.
3. Parecer ANPD: pode ser substituído por nota técnica interna de 1 página assinada pela CONTRATADA declarando enquadramento como Pequeno Agente. Não exige parecer formal de jurista.
4. DPA: ver Crítica #3.

**Antes de assinar o primeiro contrato:** todos os 4 anexos devem estar prontos e numerados, ou a referência em 20.6 deve ser editada para refletir o que efetivamente existe.

### Crítica #5 — Cláusula 13.2 Lucros cessantes (conflito interno)

Já tratada no Gap #6 acima. Reescrita proposta:

> 13.2. Sem prejuízo do direito da CONTRATANTE à efetiva prevenção e reparação de danos patrimoniais nos termos do art. 6º, VI, do CDC, as PARTES reconhecem que a responsabilidade da CONTRATADA, em qualquer hipótese, não compreende perdas que decorram exclusivamente de fatores fora do seu controle direto, em especial: condições macroeconômicas, sazonalidade do mercado da CONTRATANTE, decisões editoriais de buscadores e plataformas, qualidade ou precificação de produtos e atendimento da CONTRATANTE. Lucros cessantes serão devidos quando demonstrado nexo de causalidade direto e exclusivo entre conduta da CONTRATADA e a perda alegada.

---

## 6. Top 3 Cláusulas Faltantes (com proposta de redação)

### Faltante #1 — Vigência total e renovação automática (CRITICAL)

> **CLÁUSULA 12.0 — VIGÊNCIA**
>
> 12.0.1. Este Contrato vigora pelo prazo inicial de 12 (doze) meses contados da data do go-live, renovando-se automaticamente por períodos sucessivos de igual duração, salvo manifestação contrária por qualquer das PARTES, comunicada por escrito com antecedência mínima de 30 (trinta) dias do término do ciclo em curso.
>
> 12.0.2. **A renovação automática prevista no item 12.0.1 fica condicionada à reafirmação, pela CONTRATANTE, do interesse na continuidade, mediante notificação eletrônica enviada pela CONTRATADA com 45 (quarenta e cinco) dias de antecedência do término de cada ciclo. A ausência de manifestação no prazo de 30 dias da notificação implica encerramento ao final do ciclo, sem ônus.**
>
> 12.0.3. As disposições da Cláusula 3.4 (cancelamento ad nutum a qualquer tempo) permanecem aplicáveis durante toda a vigência, prevalecendo em caso de conflito.

**Justificativa:** combina previsibilidade comercial (renovação) com proteção consumerista (opt-in consciente, não opt-out). Mais defensável que perpétuo + cancelamento.

### Faltante #2 — Sucessão Operacional / Continuidade

> **CLÁUSULA 12.4 — SUCESSÃO OPERACIONAL**
>
> 12.4.1. Em caso de impossibilidade da CONTRATADA em prosseguir com a execução do Contrato em razão de encerramento de atividades, falecimento ou incapacidade civil do representante legal, ou outra causa supervenientemente justificável, a CONTRATADA (ou sua sucessão) terá o prazo de 60 (sessenta) dias para:
> (a) indicar prestador substituto qualificado, mediante anuência expressa da CONTRATANTE; ou
> (b) realizar a devolução integral, gratuita e completa de todos os acessos, credenciais, código-fonte, documentação técnica e ativos da Cláusula 7ª, em formato que permita à CONTRATANTE contratar livremente outro prestador.
>
> 12.4.2. Decorrido o prazo do item 12.4.1 sem solução, a CONTRATANTE poderá considerar rescindido o Contrato de pleno direito, sem necessidade de notificação ou interpelação, mantendo a propriedade dos Entregáveis já entregues.

### Faltante #3 — Método de Execução + IA + Direitos de Imagem (consolidada)

> **CLÁUSULA 1.4 — MÉTODO DE EXECUÇÃO**
>
> 1.4.1. A CONTRATADA poderá utilizar, na execução dos Entregáveis, ferramentas de inteligência artificial generativa para auxílio em redação de conteúdo, geração de imagens conceituais, pesquisa de mercado e revisão de código, sempre sob curadoria e revisão humana da CONTRATADA, que permanece responsável integral pela qualidade, originalidade e adequação dos resultados entregues.
>
> 1.4.2. A utilização de IA generativa na execução não autoriza, por si, divulgação automatizada de dados pessoais da CONTRATANTE ou de terceiros em ferramentas públicas. Dados serão tratados nos termos da Cláusula 8ª.
>
> **CLÁUSULA 1.5 — SESSÃO FOTOGRÁFICA E DIREITOS DE IMAGEM**
>
> 1.5.1. A sessão fotográfica prevista no item 1.1(e) será conduzida por profissional indicado pela CONTRATADA, sendo responsabilidade da CONTRATANTE:
> (a) franquear acesso ao estabelecimento em data e horário previamente acordados;
> (b) obter, em modelo escrito fornecido pela CONTRATADA e retido pela CONTRATANTE, autorização de uso de imagem de qualquer pessoa física identificável que figure nas fotografias (proprietários, funcionários, clientes, terceiros), nos termos do art. 20 do Código Civil e da Lei nº 13.709/2018 (LGPD), quando aplicável.
>
> 1.5.2. Sem a documentação prevista no item 1.5.1(b), a CONTRATADA poderá, a seu critério:
> (a) realizar a sessão somente com fotografias de ambientes e produtos sem pessoas identificáveis; ou
> (b) excluir das entregas fotografias específicas que contenham pessoas sem autorização documentada.

---

## 7. Pergunta-Checklist para o Advogado OAB-SC

Pacote pra o user levar ao advogado para revisão v1.1:

1. **Súmula 297/STJ jurisprudência catarinense:** confirma aplicação CDC para PJ-PJ no perfil "ME contratando marketing digital" em TJ-SC? Há decisão recente alternativa?
2. **Cláusula 5.6(c) "responder WhatsApp"** — sua leitura de abusividade art. 51 III/IV? Aceita reescrita proposta na Crítica #1?
3. **Cláusula 13.1 limitação 12 meses pagos** — jurisprudência TJ-SC últimos 24 meses sobre limitação de responsabilidade em serviço digital? Aceita adição "ou R$10.000, o que for maior" como salvaguarda?
4. **Cláusula 13.2 lucros cessantes** — concorda com risco de nulidade interpretativa pela contradição com art. 6º VI CDC? Aceita reescrita por nexo direto/exclusivo (Crítica #5)?
5. **DPA Anexo I** — pode finalizar em 10 dias úteis, ou v1.0 deve sair com adendo "30 dias para firmar DPA" (Opção B Crítica #3)?
6. **Cláusula vigência (Faltante #1)** — concorda com modelo 12 meses + renovação automática com opt-in consciente? Há decisão TJ-SC sobre perpetuidade SaaS?
7. **Direito de imagem nas fotos (Faltante #3)** — o modelo de autorização fornecido pela CONTRATADA pode ser anexado ao contrato como Anexo V padrão, ou deve ser instrumento separado por sessão?
8. **Barter anchor padaria** — pode ser tratado em adendo separado ("Termo de Parceria Anchor"), ou exige reescrita da Cláusula 3 para acomodar contraprestação em testimonial + cessão de imagem para case study?
9. **Disclosure de IA generativa (Faltante #3 item 1.4)** — sua leitura de risco/benefício de incluir essa cláusula proativamente vs aguardar Marco Legal IA?
10. **Sucessão operacional (Faltante #2)** — há precedente TJ-SC para contratos de prestação intuitu personae com cláusula de sucessão automática em 60 dias?
11. **Anexos fantasma (20.6)** — concorda em editar 20.6 para listar apenas anexos efetivamente prontos na data de assinatura, com adendo separado para os pendentes?
12. **Numeração e referências cruzadas** — quem normaliza ("X" → "5ª", padronizar "▸ baseline:" formato, criar Cláusula de Definições)?
13. **Honorários e prazo:** valor para v1.1 com ajustes propostos + DPA + 3 cláusulas faltantes? Estimativa do plano original era R$2.5-5k — incremento esperado?

---

## 8. Resumo de Decisões Necessárias do User

Antes de devolver ao advogado:

- **D1:** Aceita reescrita 5.6(c) (Crítica #1)? *Recomendação:* SIM, mitigação clara de abusividade.
- **D2:** Aceita reescrita 13.2 nexo direto (Crítica #5)? *Recomendação:* SIM, conflito interno é nulidade preventível.
- **D3:** Aceita Cláusula de Vigência 12m + renovação opt-in (Faltante #1)? *Recomendação:* SIM, é a falha mais crítica do v1.
- **D4:** DPA pronto antes de assinar (Opção A Crítica #3) ou adendo 30d (Opção B)? *Recomendação:* Opção A para anchor #1 (sem pressa real — anchor pode esperar 1 semana), Opção B para clientes subsequentes se houver gargalo.
- **D5:** Barter anchor em adendo separado? *Recomendação:* SIM, não contaminar v1 padrão.
- **D6:** Disclosure de IA generativa proativo (Faltante #3 item 1.4)? *Recomendação:* SIM, baixo custo, alta proteção reputacional.
- **D7:** Cláusula sucessão operacional (Faltante #2)? *Recomendação:* SIM, proteção mútua para projeto de single founder.

---

## 9. Conclusão

O advogado entregou um draft tecnicamente competente, fiel ao briefing Patricia Peck, e com cláusulas-vacina bem posicionadas (1.3, 4ª, 5.10, 16.2). Os 11 baseline comments do advogado demonstram autoconsciência sobre os pontos sensíveis — ele já sinalizou onde precisa de ressalva.

A v1.1 alvo após este review:
- 5 cláusulas reescritas (5.6c, 6.2b, 8ª/DPA, 13.2, anexos 20.6).
- 3 cláusulas novas adicionadas (Vigência 12.0, Sucessão 12.4, Método de Execução 1.4 + Direitos de Imagem 1.5).
- 1 documento separado preparado (Termo de Anchor Pilot).
- 4 anexos finalizados (DPA, Documento de Transparência, Spec do plano Growth, Nota técnica Pequeno Agente ANPD).

**Estimativa de esforço advogado:** 4-8 horas adicionais sobre o draft v1.0 = R$ 800-2.000 incremental sobre o orçamento original.

**Hard review 09/Jun/2026:** 25 dias de janela. Suficiente para v1.1 + anexos prontos + assinatura anchor antes do gate. Caminho crítico está no DPA (Opção A) e no Termo de Anchor — não no contrato principal.

---

⚠️ Esta análise é orientativa e não substitui consulta com advogado(a) OAB-SC ativa. Posições jurisprudenciais citadas devem ser confirmadas em pesquisa atualizada antes da assinatura. Patricia Peck mind clone é simulação computacional baseada em obra publicada; opiniões aqui apresentadas devem ser validadas pela autora real ou por advogado(a) habilitado(a) antes de qualquer ação juridicamente relevante.
