# Conclave de Melhorias Noyce — 12/Jun/2026 — FASE 1 (análises independentes)

Protocolo: 5 especialistas (mind clones), cada um como agente independente que leu o código/docs reais sozinho. Fase 2 = rodada adversarial. Fase 3 = síntese.

---

## ANÁLISE 1 — MARÇAL JUSTEN FILHO (jurídico 14.133)

### Acertos
Régua sanável×insanável (art. 64) com viés anti-falso-negativo correta; RT por declaração futura (TCU pacífico); parcela de maior relevância nunca inferida (art. 67 §1º); somatório admitido como regra com ATENDE_COM_RESSALVA no silente; consórcio art. 15 com citações corretas; prazos em dias ÚTEIS com feriados; trava de revisão humana adequada.

### Erros/riscos identificados
1. **Tabela do art. 55 CONTRA LEGEM** (`legal-constants.json` + `minimumPublicationDays`): contratação integrada = 60 d.u. (inciso IV) e semi-integrada = 35 d.u. (V), código usa 25; "técnica e preço" testado ANTES do regime (integrada por técnica-e-preço receberia 35 em vez de 60); não distingue obra comum (10 d.u.) de especial (25 d.u.). Detector de PRAZO_EXIGUO cego nos certames mais complexos.
2. **Citações imprecisas nas declarações pré-redigidas** (`noyce-review.ts`): art. 63, I é a declaração substitutiva, NÃO fato impeditivo (praxe herdada do art. 32 §2º da 8.666); "art. 63 §4º" sem conferência.
3. **§ errado do art. 15** no checklist: gap econômico-financeiro recomenda consórcio citando §2º (técnica); o pertinente é o §3º.
4. **Porte ME como constante + declaração automática = risco de declaração FALSA** (art. 155, VIII): receita 2025 da ENIAC (R$314.963) já está em 87% do teto de ME (R$360k, LC 123 art. 3º, I). Porte deve ser DERIVADO do FinancialSnapshot.
5. **"Emitir CAO via CREA" é tarefa juridicamente impossível**: CAT é exclusiva do profissional (Res. CONFEA 1.025/2009); capacidade operacional se prova por ATESTADO DO CONTRATANTE em nome da empresa (art. 67, caput e II).
6. **Aproveitamento integral de CAT "Corresponsável" fundamentado no art. 15 §2º é impróprio**: art. 15 rege consórcio no certame em curso, não acervo pretérito. Zona cinzenta achatada em ATENDE liso.
7. **Benefícios ME/EPP ausentes**: LC 123 arts. 42-43 (regularidade fiscal sanável PÓS-certame, 5 d.u. após vencedora — o app enrijece onde a lei flexibiliza); arts. 44-45 (empate ficto invisível); art. 48, I (exclusividade ME/EPP ≤R$80k não vira chip de triagem).
8. **Sugestão de valor sem filtro de exequibilidade**: P25 como "piso de disputa" pode estar sob os 75% do art. 59 §4º (proposta presumidamente inexequível).
9. **Art. 69, I refere últimos exercícios** — dossiê deve carregar 2024 E 2025, não só o mais recente.

### TOP 5 Justen
1. Reescrever tabela art. 55 (60/35/25/10 d.u. + regime antes do critério + campo objetoComum no ERM).
2. Módulo ME/EPP de primeira classe (porte calculado + alerta desenquadramento + regularidade sanável pós-certame + empate ficto + chip ≤R$80k).
3. Clamp de exequibilidade [0,75×orçado, estimado] na sugestão de proposta (art. 59 §§4º-5º).
4. Declarações vinculadas ao edital concreto (anexos-modelo extraídos), template genérico só como fallback sinalizado + corrigir citações.
5. 4 sinais novos no detector R3: qtdMin em acervo PROFISSIONAL (ilegal — hoje o motor OBEDECE em vez de denunciar), cumulatividade capital+PL+garantia, visita obrigatória sem justificativa, renomear tarefa CAO.

### Risco que ninguém vê (Justen)
Tese técnica da ENIAC = 3 premissas favoráveis empilhadas (somatório em corpus silente + maior CAT é privada/Corresponsável/SCB + RT por declaração futura) sem precificar correlação. Comissão recusa soma E glosa corresponsável → alvenaria cai de 3.235 p/ ~1.622 m². **Propõe MODO ADVERSARIAL: rodar matcher também no cenário conservador e exibir os 2 vereditos lado a lado** com defesa processual por degrau.

---

## ANÁLISE 2 — JOEL NIEBUHR (prática de habilitação)

### Onde a ENIAC seria inabilitada HOJE
1. **`acervoQuantities()` NÃO filtra por tipo de acervo**: soma CATs PROFISSIONAIS (da Alice/Rodrigo) como capacidade OPERACIONAL da empresa → exibe "3.235 m² disponíveis" que a ENIAC não tem. Zezito (1.613 m²) é obra da SCB Engenharia com Alice corresponsável — não prova execução da ENIAC. Comissão: "cadê o atestado em nome da ENIAC?" → inabilitação seca com quase-verde do app. ÚNICA lacuna insanável no dia da sessão que o app pinta de amarelo.
2. **Garantia de proposta (art. 58) não existe no motor** — todos os 11 editais exigem ~1%; emissão leva dias; R$28k no edital de R$2,83M.
3. **`evaluateRegularity()` nunca produz NAO_ATENDE** — tudo vira PARCIAL/SANAVEL. Mas só fiscal/trabalhista de ME é sanável por lei (LC 123 art. 43); jurídica/declarações não anexadas no envio = insanável.
4. **Declaração pré-redigida com reticências-placeholder** ("art. 63, §4º... conferir redação") VAI ASSINADA pro envelope se o revisor aprovar no dia corrido.
5. **Rodrigo é CREA-DF, obra em GO** — comissões do interior exigem visto do CREA-GO (ilegal mas inabilita na prática). App silente; deveria sinalizar impugnação preventiva.

### TOP 5 Niebuhr
1. Separar eixos do acervo no motor (filtrar CAO_OPERACIONAL p/ requisito operacional; corresponsável de contratante terceiro entra ZERADO; status correto hoje = NAO_ATENDE operacional + tarefa "obter atestados em nome da ENIAC junto à Pref. Águas Lindas").
2. Avaliador de garantia de proposta (alerta D-7) + visita técnica/declaração de pleno conhecimento.
3. Quebrar bloco jurídico em 2 regimes de sanabilidade (fiscal ME = sanável pós-certame citando LC 123 art. 43; jurídica/declarações = insanável se faltar no envio).
4. Detector de exigência ilegal: qtdMin em acervo profissional → não NO-GO, mas ATENDE_COM_RESSALVA + tarefa de impugnação (Súmula TCU 263 só admite quantitativo na operacional).
5. **Painel "Sessão D-0"** com 3 alarmes que precluem: janela de upload pós-convocação (PCP/BLL/BNC abrem janelas de HORAS), empate ficto ME (10% em concorrência, LC 123 art. 44 §1º — arma ofensiva), manifestação de intenção de recurso (preclui na sessão).

### Armadilha que o app ignora (Niebuhr)
**Inabilitação por intempestividade de upload**: habilitar não é TER documentos, é tê-los DENTRO da janela que a plataforma abre (às vezes 2h pós-convocação). Formato errado = não enviado. Diligência não ressuscita documento ausente. É onde ME morre de verdade. O app calcula dias até a sessão mas a sessão não é o último prazo.

---

## ANÁLISE 3 — DON NORMAN (human-in-the-loop UX)

### Acertos
Proveniência item a item (knowledge in the world); trava com histórico é signifier exemplar; sem botão "aprovar tudo" (constraint deliberada); ponte do gulf of execution no Analisar ("☆ Tenho interesse — gerar dossiê" em vez de tela vazia); triagem com razão; honestidade sobre limites no rodapé.

### Erros de design que VÃO causar erro humano
- **E1 — Assimetria de custo Aprovar(1 clique)/Corrigir(ler+digitar) fabrica o carimbador cego**: contador 12/12 = goal gradient que recompensa velocidade, não compreensão; fato grounded e inferência exigem o mesmo gesto.
- **E2 — "Reabrir" DELETA a correção humana** com 1 clique, sem confirmação, sem undo: o motor não pode sobrescrever o humano, mas um polegar pode.
- **E3 — A trava é signifier SEM constraint**: HabilitarTab nunca lê reviewProgress; "Revisão humana obrigatória" é string decorativa; rótulo que mente corrompe o modelo mental.
- **E4 — Supervisão sem supervisor**: ReviewDecision grava QUANDO mas não QUEM; localStorage = pessoa A aprova, pessoa B vê "pendente" (ou assume que outro revisou). 4 usuários, D5 (papéis) segue aberta.
- **E5 — Abas de detalhe sem o nome do objeto**: HabilitarTab nunca exibe opportunity.title; shell seleciona opportunities[0] silenciosamente → revisar documentos do certame ERRADO com confiança ("painel de dosagem sem o nome do paciente").
- **E6 — menores**: botão "Dry-run" morto (affordance falsa); "Fixtures: 80" = jargão de dev no system image; desmarcar interesse sem confirmação.

### TOP 5 Norman
1. Trava REAL: HabilitarTab lê reviewProgress; !ready → bloqueio explícito com deep-link (custa ~10 linhas, maior alavancagem).
2. Atribuição + estado compartilhado: campo `quem` no ReviewDecision (seletor entre os 4) + renderizar "aprovado por Fulana 12/Jun 14:32" + priorizar DB; resolver D5 e conectar papéis a donos por aba.
3. Proteção contra slip: reabrir item corrigido exige confirmação; valorHumano arquivado, nunca deletado; undo com graça.
4. **Fricção diferencial por confiança**: fato grounded = aprovar leve; inferência/lacuna/DECLARAÇÃO LEGAL = reconhecimento explícito (expandir texto integral antes de habilitar botão, checkbox "confirmei no edital"); incertos primeiro na ordenação.
5. Identidade do objeto em toda aba de detalhe (header persistente título+órgão+prazo); nunca selecionar [0] silencioso; matar/implementar Dry-run; traduzir status strip.

### Risco de automação que ninguém vê (Norman)
**O checkmark verde como instrumento da falha**: motor acerta 95% → semana 4, vigilância decai (automation complacency) → os 5% de erro atravessam o portão PROMOVIDOS a "fato verificado por humano" com selo 12/12. Agravante: a seção Declarações produz ATOS JURÍDICOS — declaração de porte errada carimbada às cegas = declaração falsa assinada por humano que "revisou". E a trilha de auditoria mora em localStorage (limpeza de navegador a evapora — registro de supervisão que pode sumir silenciosamente é pior que nenhum). Pergunta de design: não "o humano aprovou?" mas "**o que garante que o humano OLHOU?**". E: sentar ao lado das 4 pessoas e cronometrar o tempo entre cliques de Aprovar vs tempo de leitura.

---

## ANÁLISE 4 — MARTY CAGAN (produto)

### Tese central
**A dor nº1 declarada (perderam licitação por não acompanhar movimentação) está escrita NA TELA do app — e a aba Acompanhar é o componente mais magro (1.359 bytes, timeline estática)**. O time sabe a dor, escreveu, e construiu EM VOLTA dela. Todo item nasce `stage: 'monitorar'` hardcoded → o estado "apresentamos proposta" NÃO EXISTE no modelo. Sem esse estado, Stage 5 não é feature faltando — é CONCEITO faltando.

### Riscos (value/usability/feasibility/viability)
- VALUE: valor entregue onde o dado é fácil (PNCP), não onde a dor é maior. Racionalização de feasibility ("precisa vault/ToS") adiando problema de value — mas existe corte da dor #1 SEM vault/ToS.
- USABILITY: equipe de 4 num app single-browser (localStorage); dor #1 é de NOTIFICAÇÃO (cliente pediu e-mail/WhatsApp explicitamente) — aba não acorda ninguém.
- FEASIBILITY: snapshot de 29/Mai congelado (WAF), sem scheduler; raio GO ≤170km vs 500km prometidos. Gap demo→serviço.
- VIABILITY: R$2.800/mês precificado pro produto PROMETIDO (garantia de nunca perder movimentação + dossiê 30min); o produto EXISTENTE é buscador melhorado (mercado paga R$150-500). Cada semana nesse estado recalibra a âncora do piloto.

### TOP 5 Cagan
1. **"Radar de Participação"** — estado `participando` (nº processo+plataforma+fase) + diff-polling PNCP por contratação específica (republicação/julgamento/adjudicação/recurso — endpoints já validados no spike 09) → **WhatsApp/e-mail**. Sem vault, sem ToS. Outcome: zero movimentações perdidas. É A feature dos R$2.800.
2. **Dado vivo antes de dado profundo**: WAF resolvido + cron diário + carimbo "dados de X horas atrás" no topbar. Produto de monitoramento com dado estático é contradição nos termos.
3. **Persistência compartilhada mínima — 3 tabelas** (lifecycle/interesse, review_state, participacao) + auth simples p/ 4 usuários. O storage adapter já está separado por design.
4. **Entrada manual de certame + ingestão do e-mail da BNC** (manual-import-adapter já existe sem UI; BNC notifica por e-mail nativamente — integração de dias).
5. **Recibo de valor semanal** (WhatsApp de sexta: "vigiou N certames, X movimentações, Y dossiês") = argumento de renovação automático.

NÃO está no top 5 (de propósito): Docling/parsing profundo, RAG de recursos, sessão autenticada — apostas corretas PARA DEPOIS.

### A pergunta que o time não faz (Cagan)
"Se entregássemos SÓ o alerta de movimentação no WhatsApp — sem nenhuma das 7 abas — a Stéfani pagaria os R$2.800?" Suspeita: quase sim. A unidade de valor talvez seja UM CANAL, não um workspace. Versão operacional: quem registra "apresentamos proposta", em que tela? Hoje: ninguém, em nenhuma.

---

## ANÁLISE 5 — PABLO HOFFMAN (dados/coleta)

### Acertos
API-first (PNCP como espinha, portais privados como espelhos, PCP blocked no registry — caso de uso legal NO CÓDIGO como gate executável); separação boilerplate×regras de extração (desenho Scrapy); nada fabricado nem descartado em silêncio; guard anti-snapshot-vazio (aprendido do jeito caro); fetchImpl injetável.

### Fragilidades (arquivo/linha)
1. **O retry TREINA o WAF a manter o bloqueio**: 5 tentativas×13s sem jitter, sem circuit breaker; loop segue pelas 18 queries após a 1ª falhar = ~20min de assinatura de bot que RENOVA o bloqueio comportamental. Bloqueio não é falha transitória.
2. **2 User-Agents diferentes e sem contato** (`noyce-discovery/0.2` vs `noyce-sources/0.1`): UA deveria ser um, com mailto + CNPJ ENIAC. "Quando o ops do Serpro olha o log, ele decide entre bloquear e mandar e-mail. Hoje vocês só dão a opção um."
3. **Colisão silenciosa de candidateId**: fallback `${source}:${snapshotId}` com snapshotId igual pro run inteiro → 2 itens sem numeroControle = mesmo id = um sobrescreve o outro sem log.
4. **Guard não pega degradação PARCIAL**: 15/18 queries falham + 3 passam → snapshot de ~20 itens sobrescreve o de 150; failQueries vira número que ninguém lê. O modo de falha de 10/Jun ainda existe na versão sutil.
5. **Cadeia de evidência aponta pra raw que não é persistido** (sha256/byteLength sem arquivo em disco).
6. **Raio 500km**: desenho atual = 888+ queries sequenciais; dedupe O(n²) aguenta poucos milhares.

### TOP 5 Hoffman
1. **Collector agendado em egress estável** (Railway/GH Actions/VPS) + UA honesto + canary 1-request antes do run (pendurou → aborta TUDO e alerta) + circuit breaker. SEM proxy residencial/rotação — identificação, não evasão (esforço 0,5-1d).
2. **Delta sync por janela de atualização** (`/v1/contratacoes/atualizacao`) + store incremental keyed por numeroControlePNCP: -99% de carga, snapshot vira base, fundação do monitor (1-2d).
3. **Inverter o loop: query por UF + filtro de raio client-side** (444 municípios = dezenas de requests em vez de 888; distanceKm calculado de verdade via IBGE haversine) (1d).
4. **3 buracos de integridade**: candidateId com :index; guard de regressão de contagem (abortar se items < 0,5× anterior ou failQueries>0 sem --allow-partial); persistir raw em lib/data/raw/ (0,5d).
5. **Monitor Stage 5 em 2 faixas** (fast lane: carteira da ENIAC, poll 5min do delta + detalhe perto do prazo; slow lane: firehose 30-60min) + revisita adaptativa + notificação por diff de hash em ledger idempotente + e-mail BNC como push paralelo de custo zero. Sessão ao vivo (chat/lances) continua pós-vault, read-only, lance humano (2-3d).

### O erro que derruba em produção (Hoffman)
A COMBINAÇÃO: cron no IP do dev → WAF pendura → retry martela e renova bloqueio → algumas queries escapam → snapshot de 20 itens sobrescreve o de 150 → guard de 0 não dispara → app mostra 1/5 do mercado POR SEMANAS sem sintoma. "Se o spider retornar um quinto dos itens amanhã, vocês ficam sabendo? Hoje, não."
