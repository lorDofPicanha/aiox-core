# Anchor Risk Memo — Termo de Parceria Anchor v1.0

**Data:** 2026-05-15
**Documento de referência:** `D:\AIOS\docs\legal\termo-parceria-anchor-v1-2026-05-15.md`
**Autoria:** Legal Chief + @heather-meeker (drafting estrutural) + @patricia-peck (CDC/LGPD/risco PROCON/tributação)
**Deadline operacional:** assinatura anchor #1 ~2026-05-25 a 2026-05-30
**Hard review interno do projeto:** 2026-06-09

---

## 1. Verdict do Risk Memo

**ASSINÁVEL após validação OAB-SC + contador, com 5 atenções operacionais críticas.**

A minuta v1.0 do Termo de Parceria Anchor mitiga as 6 superfícies de risco principais (venda casada, dação em pagamento, direito de imagem, PROCON, concorrência desleal, reputação bilateral) por arquitetura contratual deliberada:

- contraprestação monetária mínima inequívoca (R$ 1.000, NÃO R$ 0) que descaracteriza permuta pura e doação;
- declaração expressa de natureza bilateral-onerosa-comutativa (Cl. 1.2);
- contrapartida não-monetária definida como obrigação contratual firme (Cl. 5.1);
- tratamento tributário como bonificação publicitária com lastro contratual (Cl. 9), NÃO permuta;
- janela bilateral de resolução amigável de 30d antes de qualquer manifestação pública negativa (Cl. 7);
- transparência pública do programa anchor (Cl. 11.3) para neutralizar concorrência desleal por opacidade.

**Riscos residuais não-zeráveis** (precisam de mitigação operacional, não-contratual): requalificação tributária pela Receita Federal/ISS Blumenau, eventual retratação do testimonial pela ANCHOR antes do prazo de 90d, jurisprudência TJ-SC oscilante sobre limitação de responsabilidade em casos não-consumeristas.

---

## 2. Top 5 Risk Flags Ordenados por Severidade

### 🔴 RISK #1 — Requalificação tributária como permuta de serviços (severidade CRÍTICA)

**Cenário:** Receita Federal ou Fiscalização ISS Blumenau, em auditoria futura, requalifica o tratamento da Cláusula 9 (bonificação publicitária) como **permuta de serviços** nos termos da LC 116/2003 + Solução de Consulta RFB nº 8/2014 + SC Cosit nº 166/2019.

**Consequência:**
- ANCHOR teria de ser autuada por **não-emissão de NFS-e** de serviço de "cessão de testimonial / cessão de imagem / contribuição publicitária" no valor estimado de R$ 3.979,00, com ISS (~2-5%) + Simples Nacional incidente;
- SITE-PROSPECTOR teria de **escriturar receita adicional** no mesmo valor, com IRPJ/CSLL/PIS/Cofins/ISS incidentes (no regime Simples, ~6-15% conforme anexo);
- Total exposição agregada estimada: R$ 400 a R$ 800 em tributos por anchor + multas (75% a 150% do tributo se considerada autuação fiscal).

**Mitigação aplicada na minuta:**
- Cláusula 3.3(c)+(d) reconhece valor estimado mas reserva expressamente "não vincula terceiros, autoridades fiscais ou judiciais";
- Cláusula 9.3 declara expressamente não-configuração de prestação de serviço tributário pela ANCHOR (justificativa: ausência de atividade econômica regular de testimonial; ausência de CNAE pertinente; descaracterização operacional);
- Cláusula 9.4 prevê que cada parte responde por seus próprios tributos sem direito de regresso (estabiliza riscos cruzados).

**Mitigação operacional adicional REQUERIDA:**
- SITE-PROSPECTOR DEVE consultar **contador profissional** antes de emitir a primeira NFS-e (preferencialmente especialista em Simples Nacional + serviços TI Blumenau);
- manter **dossiê de defesa** com este Termo + documentos do Programa Anchor (anchors #2 e #3 quando existirem) + materiais comprovando que ANCHOR não exerce atividade regular de cessão de imagem;
- considerar consulta tributária formal à Secretaria de Finanças de Blumenau antes do anchor #3 (consolida posição).

**Severidade após mitigação:** MODERADA (probabilidade baixa, impacto contido).

---

### 🟠 RISK #2 — Cláusula de testimonial como venda casada (CDC art. 39, I) (severidade ALTA)

**Cenário:** ANCHOR (ou PROCON Blumenau) alega no futuro que SITE-PROSPECTOR condicionou prestação do serviço a contrapartida de testimonial, configurando venda casada vedada pelo art. 39, I, do CDC. Argumento: "fui forçada a gravar testimonial elogioso para receber o serviço".

**Consequência:**
- nulidade da Cláusula 5ª (contrapartida testimonial);
- ANCHOR mantém o serviço sem qualquer contrapartida → desnatura sinalagma → caracteriza doação → traz de volta o RISK #1 com força total;
- multa administrativa PROCON Blumenau (até 6% do faturamento do exercício anterior, mínimo de R$ 200 e máximo de cerca de R$ 9 milhões — para SITE-PROSPECTOR ME, a base é baixa, mas multa mínima ainda é dor de cabeça);
- publicidade negativa.

**Mitigação aplicada na minuta:**
- Considerandos densos explicitam interesse legítimo recíproco, ausência de hipossuficiência abusivamente explorada, status anchor público e transparente;
- Cláusula 1.2 declara natureza bilateral-onerosa-comutativa;
- Cláusula 5.1 caracteriza testimonial como obrigação contratual firme com valor reconhecido (mitigação clássica de venda casada: o que era "condição implícita" é explicitado como prestação contratual);
- Cláusula 5.2(c) **proíbe** SITE-PROSPECTOR de exigir testimonial elogioso, frases pré-escritas, conteúdo forçado — testimonial deve ser autêntico, pode incluir críticas, pode até ser recusado em boa-fé (5.2(d));
- Cláusula 5.5 confirma que recomendação ativa é facultativa.

**Mitigação operacional adicional:**
- SITE-PROSPECTOR NÃO deve aceitar "compensação por mais elogios" off-the-record;
- gravar o pitch oral feito à ANCHOR antes da assinatura para comprovar transparência da troca;
- nunca usar linguagem "se você não gravar o vídeo, perde tudo" — usar sempre "se você não cumprir a Cláusula 5, abre janela de 30d resolução amigável conforme Cláusula 7".

**Severidade após mitigação:** MODERADA-BAIXA.

---

### 🟠 RISK #3 — Revogação tardia do uso de imagem após case study publicado (severidade ALTA)

**Cenário:** ANCHOR exerce direito de revogação prospectiva (Cl. 5.3(g) + LGPD art. 18 V + CC art. 20) 12 meses após go-live, quando case study já circulou amplamente, fotos estão em capa de site, vídeo testimonial integrou pitch deck enviado a 200 prospects.

**Consequência:**
- obrigação operacional de remover materiais online em 30 dias e impressos em 90 dias;
- custos de re-edição de materiais comerciais;
- perda de prova social principal mid-pilot;
- risco de a ANCHOR exigir indenização adicional se houver dano reputacional concreto.

**Mitigação aplicada na minuta:**
- Cláusula 5.3(g) limita revogação a efeito prospectivo (usos anteriores não são desfeitos);
- prazo escalonado (30d online / 90d impressos) reconhecido como razoável em jurisprudência;
- distinção clara entre revogação prospectiva (sempre permitida) e devolução de benefícios já usufruídos (não permitida).

**Mitigação operacional adicional:**
- SITE-PROSPECTOR deve manter **versionamento dos materiais** com o nome do anchor para conseguir remover seletivamente;
- relação ativa de cordialidade durante o Período Anchor reduz drasticamente probabilidade de revogação intempestiva;
- ao primeiro sinal de insatisfação, acionar Cláusula 7 (janela 30d) ANTES de a ANCHOR pensar em revogar imagem.

**Severidade após mitigação:** MODERADA.

---

### 🟡 RISK #4 — Concorrência desleal alegada por padarias rivais (severidade MODERADA)

**Cenário:** outra padaria de Blumenau, ao tomar conhecimento de que ANCHOR #1 paga apenas R$ 1.000 enquanto preço público é R$ 3.497, denuncia ao PROCON ou CADE alegando tratamento privilegiado dissimulado / publicidade comparativa abusiva.

**Consequência:**
- abertura de procedimento administrativo, custo de defesa;
- possível obrigação de oferecer mesmas condições anchor a todos que solicitarem (pior cenário: anchor vira preço de tabela);
- dano reputacional.

**Mitigação aplicada na minuta:**
- Cláusula 11.2 declara existência do **Programa Anchor** como modalidade comercial transparente e pública;
- Cláusula 11.3 permite SITE-PROSPECTOR publicar lista de anchors no site;
- Considerandos explicitam fase piloto pré-Stage-1 com 09/Jun/2026 como data de revisão (= modalidade tem prazo certo, não é regime permanente);
- Cláusula 1.2 reconhece sinalagma: anchor paga menos em pecúnia MAS entrega contrapartida não-monetária — não é desconto puro.

**Mitigação operacional adicional:**
- publicar **página pública "Programa Anchor 2026"** explicando criterios, fase piloto, número limitado, contrapartidas exigidas;
- ao encerrar fase piloto (pós-09/Jun/2026), suspender o programa formalmente OU manter critérios públicos para futuras edições;
- manter critério objetivo de seleção dos 3 anchors (segmento, geografia, perfil) — documentado.

**Severidade após mitigação:** BAIXA.

---

### 🟡 RISK #5 — Testimonial reverso e exposição pública unilateral (severidade MODERADA)

**Cenário:** ANCHOR fica insatisfeita com o serviço, recusa-se a gravar testimonial, e posta em redes sociais "contratei a Site-Prospector, foi ruim, não recomendo" antes de qualquer tentativa de composição.

**Consequência:**
- dano reputacional para SITE-PROSPECTOR no momento mais frágil (pré-Stage-1);
- pode contaminar capacidade de fechar anchors #2 e #3;
- perda do investimento de tempo no anchor #1.

**Mitigação aplicada na minuta:**
- Cláusula 7 estabelece janela bilateral de 30d para resolução amigável antes de manifestação pública negativa;
- exclusões legítimas (item 7.3) não permitem mordaça inconstitucional, mas obriga passagem pela negociação;
- Cláusula 5.2(d) permite à ANCHOR comunicar insatisfação por escrito como hipótese de não-cumprimento que aciona Cláusula 7 ANTES de inadimplemento.

**Mitigação operacional adicional:**
- agendar checkpoints proativos (sugestão: D+30, D+60, D+120) para captar insatisfação cedo;
- ao primeiro sinal de fricção, oferecer remediação concreta (sessão fotográfica extra, sprint de ajustes técnicos, revisão de SEO local) ANTES da ANCHOR pensar em retratação;
- se a ANCHOR insistir em postar negativo após decurso da janela 30d sem composição razoável, isso é direito constitucional dela (item 7.3(d)) — não tente impedir, apenas documente o processo de boa-fé do SITE-PROSPECTOR para defesa eventual.

**Severidade após mitigação:** BAIXA-MODERADA.

---

## 3. Decisões Autônomas Tomadas

### `[HEATHER-AUTO-DECISION]` — Setup R$ 1.000,00 (NÃO R$ 0,00)

**Razão:** cobrar R$ 0,00 maximizaria três riscos cumulativos: (a) configurar doação de serviço (= problema tributário pleno + perda de bilateralidade), (b) reforçar argumento de venda casada (= toda contraprestação seria forçosamente o testimonial = núcleo CDC art. 39 I), (c) abrir flanco para ANCHOR alegar "nem cobrou, era grátis, prometeu mundos e fundos" se houver insatisfação. Cobrar R$ 1.000 elimina esses três cenários por uma fração trivial do valor de mercado (28,6% do setup público). Patricia Peck concordou. Trade-off aceitável: SITE-PROSPECTOR recebe R$ 1.000 vs. exposure substancial.

### `[HEATHER-AUTO-DECISION]` — Duração 6 meses

**Razão:** janela cobre dois quadrimestres operacionais em Blumenau (alta verão dez-mar + baixa abr-jul) permitindo validação metodológica sazonalmente diversa. Curto suficiente para anchor não capturar valor desproporcional; longo suficiente para gerar case study com dados consolidados. Mais curto (3-4 meses) seria insuficiente para resultados materiais; mais longo (12 meses) desnaturaria anchor (parece "cliente prata permanente").

### `[HEATHER-AUTO-DECISION]` — Pós-anchor: 30% desconto por 12 meses no Growth

**Razão:** reconhece valor da contribuição anchor à co-construção da metodologia sem ser concessão eterna. Após 12 meses (= mês 18 desde go-live), volta ao preço público pleno. Alternativas consideradas: (a) "anchor permanente com 20% desconto eterno" — descartada por assimetria que pode virar caso CDC; (b) "sem desconto pós-anchor" — descartada por desincentivar continuidade do que é cliente já educado e gerador de prova social passiva.

### `[HEATHER-AUTO-DECISION]` — 3 anchors no total

**Razão:** alinhado com pilot 3 prospects da memória do projeto (session_site_prospector_12mai.md). Diversificação amostral validação metodológica (não-vício de amostra única) sem hiperinflação que descaracterize o programa. Critério razoável para defesa concorrencial.

### `[PECK-AUTO-DECISION]` — Tributação como bonificação publicitária com lastro contratual, NÃO como permuta

**Razão técnica:**
- Permuta exigiria dupla emissão de NFS-e (SITE-PROSPECTOR + ANCHOR) com bases de cálculo bilaterais. ANCHOR (padaria) não tem CNAE para cessão de testimonial/imagem; forçar emissão pela ANCHOR seria operacionalmente inviável e abusivo;
- LC 116/2003 + SC Cosit 166/2019 tratam permuta de serviços como hipótese plena de incidência ISS — ANCHOR teria responsabilidade tributária inesperada;
- Solução adotada: SITE-PROSPECTOR emite NFS-e de R$ 1.000 (valor pago) + registra diferencial como **bonificação publicitária recebida em forma de testemunho voluntário e cessão de imagem**, comparável tributariamente a depoimento espontâneo de cliente (jurisprudencialmente não-tributável quando não há atividade econômica regular do depoente);
- Risco residual de requalificação pela RF/ISS Blumenau é endereçado pela Cláusula 9.4 (cada parte responde por seus tributos, sem regresso).

**Limite:** SITE-PROSPECTOR DEVE consultar contador profissional antes de assinar o anchor #1. Este memorando não substitui parecer contábil.

### `[PECK-AUTO-DECISION]` — Janela de revogação prospectiva 30d (online) / 90d (impressos)

**Razão:** prazos suportados por jurisprudência consolidada de remoção de conteúdo digital (Marco Civil da Internet + LGPD + CONAR) e razoabilidade comercial. Bloquear revogação seria nulo (CC art. 20 + LGPD art. 18). Permitir revogação instantânea seria comercialmente inviável.

---

## 4. Variáveis Abstratas para Reutilização em Anchors #2 e #3

A minuta v1.0 foi escrita pensando em **reuso para anchors #2 e #3** com variações mínimas. Variáveis a parametrizar para cada novo anchor:

| Variável | Anchor #1 (padaria Blumenau) | Padrão recomendado para #2 e #3 | Notas |
|---|---|---|---|
| Setup pago | R$ 1.000,00 | Manter R$ 1.000 ou ajustar para 25-30% do preço público | Nunca R$ 0 |
| Duração Período Anchor | 6 meses | 6 meses default, máximo 9 | Nunca > 12 meses |
| Bônus referral | R$ 200 por contrato | R$ 200 default | Pode escalar conforme caso |
| Desconto pós-anchor | 30% por 12 meses no Growth | Padronizar 30% × 12m | Manter consistência entre anchors |
| Prazo testimonial | até 90 dias pós go-live | 90 dias default | Pode ser 60 se segmento simples |
| Prazo case study aprovação | 7 dias úteis | 7 dias default | Não reduzir |
| Janela revogação imagem online | 30 dias | 30 dias default | |
| Janela revogação imagem impressa | 90 dias | 90 dias default | |
| Janela resolução amigável Cl. 7 | 30 dias | 30 dias default | Nunca < 20 dias |
| Número total de anchors no programa | até 3 simultâneos | manter 3 até pós-09/Jun/2026 | Após Stage-1 revisar |

**Template macro reutilizável:** o Termo serve como template estrutural. Para anchors #2 e #3 apenas variar (a) Qualificação das Partes, (b) Segmento na Cl. de Considerandos, (c) eventuais especificidades operacionais de cada estabelecimento.

---

## 5. Diferenças Que o Advogado OAB-SC Vai Querer Ajustar

Pacote para revisão pelo advogado OAB-SC (mesmo profissional do Contrato Principal):

1. **Cláusula 9 (tributação)** — confirmação com contador especializado em ISS Blumenau e Simples Nacional. Risco potencial: contador pode insistir em tratamento de permuta (mais ortodoxo, mas operacionalmente inviável para a ANCHOR). Manter posição na minuta e formalizar a divergência por escrito antes de assinar.

2. **Cláusula 1.4 ("interpretação mais favorável à ANCHOR")** — advogado pode considerar reforço excessivo. Posição defendida: manter como cinto + suspensório. Trade-off mínimo, proteção máxima.

3. **Cláusula 5.2(d) ("recusa fundamentada")** — advogado pode preferir versão mais incisiva ("não cumprimento = inadimplemento sem boa-fé") para fortalecer execução. Posição: a Cláusula 7 (resolução 30d) já fornece esse caminho com proteção bilateral; reforçar contra a ANCHOR aumentaria exposure CDC.

4. **Anexo I (Modelo de Autorização Individual de Uso de Imagem)** — não foi redigido neste pacote. Advogado deve produzir modelo padrão antes da sessão fotográfica do anchor #1.

5. **Anexo II (DPA específico)** — não foi redigido neste pacote. Pode ser DPA aditivo ao DPA do Contrato Principal v1.1 quando este estiver pronto.

6. **Compatibilidade com Contrato Principal v1.1** — Termo de Parceria Anchor remete a cláusulas do Contrato Principal **na redação v1.1** (especialmente Cl. 12.0 Vigência e Cl. 12.4 Sucessão Operacional). Verificar que numeração e conteúdo do Contrato Principal v1.1 estão alinhados com remissões deste Termo. **Caso o Contrato Principal v1.1 ainda não esteja assinado**, considerar assinatura simultânea (mesma data) para evitar lacuna documental.

7. **Numeração e padronização** — eliminar todas as notas `▸ heather:` e `▸ peck:` antes da versão de assinatura. Padronizar formatação. Confirmar que Anexos I e II estão referenciados consistentemente.

8. **Cláusula 11.2 (3 anchors simultâneos)** — quantidade pode ser ajustada conforme estratégia comercial do user. Se decidir por apenas 1 anchor, modificar para "Caso Piloto único". Se decidir por 5, ampliar — mas justificar publicamente o programa.

9. **Cláusula 5.5 (bônus referral R$ 200)** — advogado pode preferir suprimir (simplifica) ou manter (incentivo legítimo). Posição: manter — custo controlado, upside comercial real.

10. **Sucessão operacional para a ANCHOR** — atualmente este Termo trata sucessão apenas via remissão à Cl. 12.4 do Contrato Principal v1.1 (que cobre apenas SITE-PROSPECTOR). Se a ANCHOR fechar suas portas durante o Período Anchor (cenário possível em padaria de pequeno porte), o Termo aplica saída antecipada Cl. 10. Caso advogado considere risco material, adicionar cláusula específica.

---

## 6. Checklist Pré-Assinatura Anchor #1

Antes de assinar com a padaria #1, validar:

- [ ] **Contrato Principal v1.1** assinado ou em vias de assinatura simultânea
- [ ] **CNPJ da ME SITE-PROSPECTOR** ativo (ou alternativa pessoa física documentada)
- [ ] **Contador consultado** sobre tratamento tributário Cl. 9
- [ ] **Advogado OAB-SC validou** Termo de Parceria Anchor v1.0 e produziu eventual v1.1
- [ ] **Anexo I (Autorização Individual de Uso de Imagem)** pronto antes da sessão fotográfica
- [ ] **Anexo II (DPA Testimonial/Imagens)** redigido ou commitment formal de firmar em 15 dias
- [ ] **Página pública "Programa Anchor 2026"** publicada (mitigação RISK #4)
- [ ] **Critério objetivo de seleção dos 3 anchors** documentado internamente
- [ ] **Checkpoint operacional D+30 / D+60 / D+120** agendado (mitigação RISK #5)
- [ ] **NFS-e R$ 1.000 emitida e arquivada** após pagamento (mitigação RISK #1)
- [ ] **Pitch oral da modalidade Anchor** documentado em e-mail recap pré-assinatura (mitigação RISK #2)

---

## 7. Estimativa de Esforço Adicional do Advogado OAB-SC

**Sobre o orçamento original (R$ 2.5 a R$ 5k para Contrato Principal v1.1):**

- Revisão do Termo de Parceria Anchor: 2-4 horas
- Produção do Anexo I (Modelo Autorização Individual Imagem): 1-2 horas
- Produção/aprovação do Anexo II (DPA Testimonial): 2-4 horas
- Compatibilização com Contrato Principal v1.1: 1 hora
- Validação com contador (opcional para SITE-PROSPECTOR contratar): à parte

**Incremento estimado:** R$ 800 a R$ 2.000 adicionais sobre o orçamento do Contrato Principal v1.1.

**Janela operacional:** 25 dias até hard review 09/Jun/2026 é suficiente para revisão + produção dos anexos + checkpoint final antes de assinatura anchor #1 (estimada 25-30 de maio).

---

⚠️ **DISCLAIMER LEGAL**

Esta análise é orientativa, baseada em mind clones simulados (@heather-meeker e @patricia-peck) e na configuração atual do programa SITE-PROSPECTOR. **NÃO substitui consulta com advogado(a) OAB-SC ativa nem com contador especializado.** Posições jurisprudenciais e tributárias devem ser confirmadas em pesquisa atualizada antes da assinatura. Decisões finais sobre tratamento tributário (Cláusula 9 e RISK #1) dependem de validação por contador profissional.
