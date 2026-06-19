# Revisão Kleppmann — O Moat como Problema de Dados (Rodada 1, independente)

> **Revisor:** martin-kleppmann (Director of Distributed Data Systems) · **Data:** 2026-06-12
> **Alvo:** `17-arquitetura-core-v1.md` (v1.0 FINAL) + `16-conclave-arquitetura/02-data-engineer-schema.md` (DDL canônico) · **Pauta:** `00-brainstorm-superficies-ataque.md` (S2/S3 primárias; Q1–Q8)
> **Mandato:** questionar tudo. Análise solo, sem ver os outros revisores.
> **Fontes ao vivo consultadas nesta sessão:** layout oficial da chave de acesso da NFS-e Nacional (50 posições) e semântica de entrega da pgmq — citadas inline e listadas no §11.

---

## 0. Posição de partida

Let me make the trade-offs explicit. A arquitetura acerta o fundamental: **o log é a abstração certa para o moat**. Um ledger append-only hash-encadeado, com estado derivado em tabelas relacionais e a prova na trilha, é exatamente o desenho que eu recomendaria — event-sourcing leve, não full, com a trilha como *prova* e não como fonte de verdade operacional. O schema do doc `02` é um artefato acima da média: imutabilidade tripla, advisory lock por tenant, `seq_tenant` denunciando gaps, estado+evento na mesma transação via RPC.

Mas um sistema de prova de 7 anos não é julgado pelo happy path. É julgado pelos failure modes: **restore de backup, retry de webhook, reprocessamento, migração de schema, modelo de IA descontinuado, expurgo legal**. E é aí que encontrei furos — quatro deles capazes de corromper a trilha *em silêncio* ou, pior, de transformar a própria âncora externa em prova de adulteração. Networks are unreliable, clocks are approximate, processes crash — e bancos são restaurados.

Nomeio cada cenário de falha e dou a correção concreta. Numeração: **K-1…K-12** (consolidadas no §10).

---

## 1. Dual-write: estado mutável × trilha append-only

### 1.1 O que está certo

O padrão `core.aprovar_apontamento(...)` (doc 02 §3.5) grava estado e evento **na mesma transação** — dentro de um único Postgres, isso elimina o problema clássico de dual-write entre dois sistemas. É a maior vantagem do Postgres-only, e o desenho a explora corretamente *nesse caminho*.

### 1.2 🔴 Cenário nomeado: **"A porta lateral do PostgREST"** (K-1)

O doc 02 declara: *"app nunca escreve estado sem evento"*. Mas o **Padrão 3 de RLS do próprio doc 02 §6 contradiz isso**:

```sql
create policy p_upd_revisao on core.apontamento_auditoria for update to authenticated
  using (escritorio_id = app.current_escritorio_id()
         and app.current_papel() in ('admin','gestor','analista')) ...
```

Existe uma policy de **UPDATE direto** em `apontamento_auditoria` para `authenticated`. Qualquer cliente PostgREST (ou um bug de frontend) pode executar `PATCH /apontamento_auditoria?id=eq...` mudando `status` de `pendente` para `aprovado` — o trigger de transição valida a *legalidade* da transição e o `revisor_id`, mas **não insere o evento na trilha**. Resultado: estado aprovado, trilha muda. A reconciliação noturna detecta — **detecção a posteriori não é prevenção**, e o "conserto" é impossível de fazer honestamente: inserir o evento no dia seguinte grava `ocorrido_em` errado ou documenta o furo. Num auto de infração de 2031, "o sistema tinha um caminho de escrita que não gerava prova, e o job noturno o flagrava às vezes" desmonta o moat inteiro.

**Correção (K-1):** remover a policy de UPDATE direto. *Toda* transição de estado de `apontamento_auditoria`, `laudo` e qualquer tabela cuja mutação deva ser provada passa **exclusivamente por RPC `security definer`** (estado+evento atômicos). A RLS de `authenticated` nessas tabelas é SELECT-only. O trigger de transição vira segunda linha de defesa, e ganha uma cláusula extra: rejeitar UPDATE cujo `xact` não tenha inserido evento correspondente (implementável com variável de sessão setada pela RPC — `set_config('app.evento_gravado', ...)` — verificada num constraint trigger `DEFERRABLE INITIALLY DEFERRED`). Cinto e suspensório: o banco passa a *impedir* estado sem prova, não só detectá-lo.

### 1.3 🟡 Webhook → ingestão → trilha: inbox ok, falta selar o consumo (K-2)

O caminho de entrada tem **inbox pattern** correto: `core.ingestao_evento` com `unique (escritorio_id, provider, dedup_key)` absorve o retry do webhook (at-least-once do provider) de forma idempotente, antes de tocar `core.nota`. Bom.

O furo está no **consumo da fila**. A [pgmq garante exactly-once apenas *dentro do visibility timeout*](https://pgmq.github.io/pgmq/latest/); expirado o VT (worker lento, crash pós-processamento e pré-delete), a mensagem **reaparece e é re-entregue** — at-least-once efetivo. E `pop()` é at-most-once (perde mensagem se o worker morre). O doc 17 §6.3 desenha `webhook → staging → pgmq → ingestão` mas **não manda o consumo ser transacional**. Se o worker (a) processa, (b) commita `nota`+`evento_boa_fe` e (c) deleta a mensagem em transações separadas, um crash entre (b) e (c) re-entrega a mensagem → a nota dedupa via `ON CONFLICT DO NOTHING`, **mas o evento `nota_recebida` não tem chave de idempotência e entra DUPLICADO na trilha**. A cadeia de hash permanece íntegra — o hash-chain encadeia alegremente qualquer coisa — mas a trilha agora atesta que a mesma nota foi recebida duas vezes. Na primeira perícia, cada anomalia inexplicada da trilha é munição.

**Correção (K-2):** mandamento de arquitetura, escrito no doc 17: **ler, efetivar e ackar na MESMA transação**. Como pgmq é SQL no mesmo banco, isso é trivial e é o superpoder do Postgres-only: `pgmq.read()` → `INSERT nota ON CONFLICT` → `INSERT eventos` → `UPDATE staging` → `pgmq.delete()` — um único `BEGIN/COMMIT`. Crash em qualquer ponto = rollback total = re-entrega limpa. Complementar com **idempotência na própria trilha** (K-6, §4.2): a defesa em profundidade exige que mesmo um consumo mal-escrito não consiga duplicar evento.

---

## 2. Hash-chain × operação real: restore, PITR, ALTER

Esta é a seção mais grave. O hash-chain como desenhado é internamente consistente — e é exatamente por isso que o failure mode é traiçoeiro.

### 2.1 🔴 Cenário nomeado: **"O fork ancorado"** (K-3)

Sequência realista:

1. Dia D, 23h: job de fecho diário carimba na ACT o hash do evento `seq_tenant=180.412` do tenant X. O TST (recibo do carimbo) atesta perante terceiro que essa cadeia existia com essa cabeça.
2. Dia D+1, 14h: incidente (corrupção, erro humano, bug de migration). Equipe restaura o banco via PITR para D+1 10h.
3. Entre 10h e 14h, o tenant X tinha gravado 300 eventos (aprovações do contador, laudo emitido e **enviado ao cliente**). Esses eventos **deixam de existir**. O sistema retoma e grava eventos novos a partir de `seq_tenant=180.501` — números reutilizados, hashes diferentes.
4. 2031: o perito verifica. O TST de D atesta um hash que **não existe na cadeia apresentada** (se o restore engoliu o fecho) — ou existe, mas os TSTs de D+1 em diante atestam uma cadeia divergente da que os artefatos externos (o PDF do laudo entregue ao cliente, com hash carimbado) referenciam.

Respondendo à pergunta exata do brainstorm (S3): **o restore não "quebra a cadeia" — a cadeia restaurada é internamente íntegra até o ponto de restore. O que o restore quebra é a reconciliação com a âncora externa.** E isso é *pior* que quebrar a cadeia: a MP 2.200-2 dá presunção justamente ao carimbo externo; uma âncora externa que diverge do banco é **prova independente e juridicamente qualificada de que o histórico apresentado não é o histórico carimbado**. O mecanismo desenhado para provar boa-fé vira o instrumento que prova adulteração. Indistinguível, para o perito, de fraude.

O doc 17 não desenha isso. A palavra "restore"/"PITR"/"backup" não aparece nem no 17 nem no 02 em conexão com a trilha. **Isto está assumido, não desenhado.**

**Correção (K-3) — protocolo de restore como cidadão de primeira classe da arquitetura:**

1. **TSTs e laudos PDF vivem FORA do banco** em storage com versionamento/WORM (object lock) — e cópia do TST do fecho vai ao tenant (anexo do Relatório de Valor mensal: "recibo de integridade da sua trilha"). O conjunto de TSTs é a *fonte de verdade da integridade*; o banco é restaurável, os TSTs não podem ser.
2. **Evento `restauracao_sistema`** (novo `tipo_evento`): primeira escrita obrigatória pós-restore, registrando: ponto de restore, último TST conhecido, declaração da janela perdida, hash da cabeça pré-incidente (lido do TST externo). A cadeia não esconde o fork — ela o **documenta e o re-ancora imediatamente** (carimbo ACT extraordinário sobre o evento de restauração). Honestidade verificável > continuidade fabricada.
3. **`seq_tenant` nunca é reutilizado:** pós-restore, o evento de restauração salta a sequência para além da última atestada externamente (lida do TST). Gap declarado > colisão silenciosa.
4. **Replay da janela perdida:** `ingestao_evento`/provider re-entregam notas (idempotente, K-2). Decisões humanas perdidas **não são re-fabricáveis** — o contador re-decide, e o evento novo referencia o laudo externo sobrevivente. O runbook disto é o entregável do Spike 6, junto com o carimbo real.
5. **RPO explícito como requisito:** a janela máxima de perda aceitável para a trilha é um parâmetro de negócio (sugiro ≤ minutos — PITR contínuo), não um acidente do plano do Supabase contratado.

### 2.2 🔴 Cenário nomeado: **"O hash que mudou de fórmula"** (K-4)

A verificabilidade de 7 anos depende de **recomputar o hash de 2027 em 2031 com a fórmula de 2027**. A fórmula vive implícita no corpo do trigger `tg_evento_boa_fe_chain`. Problemas concretos:

- **ALTER TABLE no ledger:** M-3 já adiciona `tipo_evento`s (inofensivo — CHECK). Mas qualquer migration futura que adicione coluna *participante do hash*, mude tipo de coluna, ou "melhore" o trigger, silenciosamente torna os eventos antigos **não-verificáveis pela fórmula corrente**. Sete anos é tempo de sobra para três devs diferentes "refatorarem" esse trigger.
- **Canonicalização frágil:** o hash concatena `payload::text`. A serialização textual de `jsonb` é determinística para um dado valor binário (chaves ordenadas, deduplicadas), mas confiar nisso por 7 anos atravessando major versions de Postgres, dump/restore e mudanças de locale é apostar a prova num detalhe de implementação não-contratual. Além disso a concatenação é **sem delimitadores** (`ator_tipo || coalesce(ator_id::text,'')...`) — campos de comprimento fixo (uuid) mitigam, mas é higiene criptográfica ruim: fronteiras ambíguas entre campos são a receita clássica de colisão por concatenação.

**Correção (K-4):**

1. Coluna **`hash_ver smallint not null default 1`** em `evento_boa_fe`. A fórmula v1 é **congelada**: função `core.verificar_evento_v1(...)` imutável por contrato (nunca editada; mudou a fórmula, nasce v2 e os eventos novos a usam).
2. **Canonicalização explícita com delimitadores** (separador `\x1f` entre campos, campos null codificados distintamente de vazio) — definir agora, antes do primeiro evento de produção, porque depois não dá para mudar sem v2.
3. **Suite de vetores de teste ("golden hashes") no CI:** N eventos sintéticos com hashes esperados hard-coded. Qualquer mudança de trigger, upgrade de Postgres ou migration que altere o resultado **quebra o build**. É a fitness function da verificabilidade — barata e permanente.
4. Migrations sobre `evento_boa_fe`: política escrita de **additive-only** (nunca ALTER de coluna existente, nunca rewrite de tabela), verificada por teste de migration.

---

## 3. Idempotência: a chave de acesso sob escrutínio (com dado ao vivo)

### 3.1 O fato verificado

A pergunta do brainstorm (S3) era se a NFS-e Nacional tem chave nos moldes da NF-e. **Não tem — e a diferença importa.** Confirmado em fontes vivas:

- **NF-e/CT-e:** 44 dígitos, com `cUF(2) + AAMM(4) + CNPJ(14) + modelo(2) + série(3) + número(9) + tpEmis(1) + código(8) + DV(1)` — AAMM da emissão nas **posições 3–6**.
- **NFS-e Nacional:** **50 dígitos**, layout próprio: `Código do Município IBGE (7) + Ambiente Gerador (1) + Tipo de Inscrição Federal (1) + Inscrição Federal (14, CPF com zeros à esquerda) + nNFSe (13) + AnoMes da emissão (4) + Código Numérico (9) + DV (1)` — AAMM nas **posições 37–40**. Fontes: [estrutura da chave NFS-e Nacional](https://blog.espiaonfe.com.br/chave-de-acesso-da-nfs-e-nacional-estrutura-e-funcionamento/), [nota técnica TOTVS sobre entrada de NFS-e com chave de 50 posições](https://centraldeatendimento.totvs.com/hc/pt-br/articles/32274337090199-Cross-Segmentos-Linha-Datasul-MRE-Entrada-de-NFS-e-Nacional-com-chave-de-acesso-50-posi%C3%A7%C3%B5es) (Resolução CGSN nº 169/2022 no contexto MEI).

O CHECK `length between 40 and 54` do schema acomoda ambas. Sem colisão entre tipos (comprimentos distintos; NF-e×NFC-e distinguem-se pelo campo modelo 55/65 embutido). Até aqui, bem.

### 3.2 🔴 Cenário nomeado: **"A nota bicompetente"** (K-5)

O schema justifica incluir `competencia` no UNIQUE de dedup assim (doc 02 §3.2): *"é DERIVÁVEL da chave de acesso (posições AAMM) → dedup continua determinístico"*. Duas rachaduras:

1. **"Posições AAMM" no plural esconde que são posições DIFERENTES por tipo de documento** (3–6 na NF-e, 37–40 na NFS-e) — o parser de derivação precisa ser por-tipo, e isso precisa estar escrito, senão o primeiro dev implementa o offset da NF-e para tudo.
2. Mais grave: **AAMM é o ano/mês da EMISSÃO; "competência" fiscal não é**. Serviço prestado em agosto, NFS-e emitida em 01/setembro: AnoMes = `2609`, competência de apuração = `2026-08`. Se *qualquer* caminho de ingestão gravar `competencia` = competência fiscal (e a tentação existe — é o eixo de apuração!) enquanto outro caminho deriva da chave, **a mesma `chave_acesso` entra duas vezes com competências distintas e o UNIQUE `(escritorio_id, chave_acesso, competencia)` deixa passar**. O dedup, fundação da idempotência de ingestão, fura exatamente na fronteira upload-manual × provider — os dois caminhos que o pipeline único promete unificar.

**Correção (K-5):** decisão de invariante, escrita no schema: **`nota.competencia` ≜ AAMM extraído da chave (emissão), sempre, por função `core.competencia_da_chave(chave, tipo)` no banco** — nunca pelo app, nunca pelo provider. A competência de *apuração* vira coluna própria (`competencia_fiscal`), fora do UNIQUE. Reforço estrutural: tabela-registro magra e **não particionada** `core.nota_chave (escritorio_id, chave_acesso) UNIQUE` mantida na mesma transação do INSERT da nota — o UNIQUE global que o particionamento da `nota` não consegue expressar. ~50 bytes/linha; em 360M de notas, ainda trivial.

### 3.3 🔴 Cenário nomeado: **"A nota fantasma do recibo"** (K-6a) + o limite do hash perceptual

O doc 17 §3.6 promete `apontamento.qualidade_insumo = 'documento_extraido'` (recibo PDF, cupom fotografado). Mas siga o grafo de FKs: `apontamento_auditoria.item_id → nota_item → nota`, e **`core.nota.chave_acesso` é NOT NULL com CHECK de 40–54 dígitos**. Um recibo não tem chave de acesso. Logo, no schema como está, **documento extraído não pode gerar apontamento** — a classe de insumo prometida pela arquitetura é irrepresentável no DDL canônico. Furo de consistência entre doc 17 e doc 02 que ninguém pegou.

E a pergunta do brainstorm — *hash perceptual basta como chave de idempotência?* — a resposta é **não, por construção**: hash perceptual é projetado para **colidir** sob similaridade (é essa a função dele). Dois cupons distintos do mesmo template de PDV, duas fotos do mesmo recibo com enquadramento diferente — vizinhos no espaço perceptual. Usá-lo como chave de dedup *funde documentos distintos* (perda silenciosa de nota = furo na ciência) ou *separa o mesmo documento* (duplicata). Chave de idempotência exige igualdade exata e estável; perceptual hash entrega semelhança aproximada e instável.

**Correção (K-6a):** (1) `chave_acesso` vira **nullable**; nasce `chave_dedup text NOT NULL` **gerada**: a chave oficial quando existe, senão `doc:` + sha256 hex do binário — e o UNIQUE de dedup migra para `(escritorio_id, chave_dedup, competencia)`. (2) Dedup exato de documento = **sha256 do arquivo** (o `gestao.documento` já faz, por tenant — correto). (3) Hash perceptual rebaixado, por contrato escrito, a **gerador de candidatos para revisão humana** ("este recibo parece o #4412 — é reenvio?"), jamais decisor automático. (4) `tipo` da nota ganha valor para documento não-fiscal-estruturado, e a trilha grava a classe — como o §3.6 já manda.

---

## 4. Exactly-once da ingestão e o motor não-determinístico

### 4.1 🔴 Cenário nomeado: **"Os gêmeos de confiança divergente"** (K-7)

A pergunta do brainstorm é cirúrgica: retry do webhook + retry da pgmq + reprocessamento manual + **motor não-determinístico** (RAG/LLM) = a mesma nota analisada duas vezes produz apontamentos com confianças diferentes. O que o schema faz hoje? `apontamento_auditoria` **não tem nenhuma constraint de unicidade de negócio** — nada impede dois apontamentos `pendente` para o mesmo `item_id` + mesmo `tipo_divergencia`, um com confiança 0,87 e outro com 0,79. Consequências em cascata:

- O contador aprova um gêmeo; o outro fica `pendente` eterno → **o sistema fabrica sozinho o "aprovado + pendente" no mesmo item** — precisamente o dossiê de acusação que o §3.5 do doc 17 (achado do Heleno) considera o pior cenário jurídico. A arquitetura construiu um gerador automático do seu próprio pesadelo.
- A trilha registra ambos (`apontamento_gerado` ×2, confianças divergentes, mesma base, mesmo motor?) → perito pergunta por que o "estado de conhecimento" oscilou sem fato novo.
- O metering D7 (nota auditada) conta o quê?

**Correção (K-7), em três camadas:**

1. **Análise como unidade idempotente:** `core.analise_execucao (nota_id, competencia, base_versao_id, motor_versao, status) UNIQUE` — re-entregar a mesma nota para o mesmo (base, motor) é **no-op por construção**, não por sorte. O evento `analise_executada` referencia essa linha.
2. **Chave natural no apontamento:** `UNIQUE (item_id, tipo_divergencia, base_versao_id, motor_versao)` com `ON CONFLICT DO NOTHING`. Mesmo insumo + mesmas versões = mesmo apontamento, sempre. O não-determinismo residual do LLM fica confinado: a *primeira* materialização vence e é a registrada — defensável, porque o que se prova é o que se *afirmou*, não a distribuição de amostragem do modelo.
3. **Versões novas não geram gêmeos, geram sucessão:** quando `base_versao` ou `motor_versao` muda e a reanálise produz apontamento novo para item já apontado, o antigo `pendente` transiciona para novo estado **`superado`** (transição hoje inexistente na máquina de estados — adicionar), com evento ligando antigo→novo. O laudo e a fila do dia só veem a geração corrente; a trilha conta a história completa. Sem isso, cada NT nova (cenário Q3!) duplica a fila de revisão inteira.

### 4.2 Idempotência da própria trilha (K-6b)

Defesa em profundidade: eventos com referente natural ganham unicidade parcial — `UNIQUE (tipo_evento, nota_id) WHERE tipo_evento='nota_recebida'`, `UNIQUE (tipo_evento, apontamento_id) WHERE tipo_evento IN ('apontamento_aprovado','apontamento_rejeitado')`, etc. Append-only não significa "aceita duplicata"; significa "não reescreve". Um ledger que admite o mesmo fato duas vezes não é um log de fatos, é um log de tentativas.

---

## 5. Determinismo e proveniência computacional (S2/Q1 — o furo que o brainstorm suspeitava)

A suspeita do S2 procede, com uma correção de enquadramento que muda a solução inteira.

### 5.1 O que a trilha grava hoje × o que falta

Hoje (doc 17 §3.1 + payload de `analise_executada`): versão da base ✓, camada da fonte ✓, regra ✓, critérios de desempate ✓, confiança ✓, "versão do motor" (campo solto, sem definição) ~. **Faltam:** modelo de embedding e sua versão, build do índice vetorial, template e hash do prompt, parâmetros de amostragem, **conjunto recuperado** (quais regras o RAG trouxe, com scores), resposta bruta do modelo, e a versão do golden-set que aprovou aquela versão de motor. Sem isso, "reconstituir o estado de conhecimento de 2027" é impossível: a base estava versionada, mas *o que o sistema fez com ela* não.

### 5.2 A correção de enquadramento: re-verificação, não re-execução

Aqui está a distinção que o documento precisa fazer e não faz. **Prometer re-EXECUÇÃO bit-a-bit do pipeline RAG em 2031 é promessa falsa** — o modelo de 2027 estará descontinuado, o provedor terá mudado, e LLMs não são determinísticos nem dentro da mesma versão. Qualquer arquiteto que prometa "replay do motor" está vendendo o que não pode entregar, e a primeira perícia competente expõe isso.

O que É entregável — e juridicamente suficiente, pois boa-fé é sobre o estado de conhecimento *na data da decisão* — é a **re-VERIFICAÇÃO**: demonstrar integralmente *o que o sistema sabia* (base@versão, regras@versão, índice@build), *o que perguntou* (prompt+params), *o que recuperou* (retrieval set), *o que o modelo respondeu* (resposta bruta, hasheada e armazenada) e *o que o humano decidiu*. Com uma exceção deliberada: a **camada de regras determinísticas DEVE ser re-executável** — regras versionadas como dado (não como código solto), replay exato garantido. As duas camadas de inferência têm classes de proveniência distintas, espelhando as duas classes de insumo do §3.6 — a simetria que o brainstorm intuiu.

### 5.3 Registro mínimo de proveniência computacional (K-8)

Contrato do payload de `analise_executada` (e colunas em `analise_execucao` de K-7):

```
motor_versao          git SHA + semver do serviço
regras_pacote_hash    sha256 do bundle de regras determinísticas (regras = dado versionado)
base_versao_id        (já existe)
modelo_llm            {provedor, id exato do modelo, snapshot/data}
embedding_modelo      {nome, versão, dimensão}
indice_build_hash     sha256 do conjunto de embeddings/parâmetros do build HNSW
prompt_template_id    + prompt_hash (sha256 do template renderizável)
params                {temperature, seed, top_p, top_k}
retrieval_set         [{regra_id, score}] — o que o RAG efetivamente recuperou
resposta_bruta_ref    ponteiro storage + sha256 (a resposta íntegra do modelo)
golden_set_versao     a versão do eval que liberou este motor_versao para produção
```

Custo: ~1 KB/análise + storage da resposta bruta. Irrisório contra o que compra: o laudo de 2027 deixa de depender da existência do modelo em 2031. **Data outlives code — e aqui, data precisa sobreviver ao modelo.** Bônus direto para Q8: quando o falso-positivo subir 2pp após troca de embedding, a causa é consultável, não arqueológica.

---

## 6. Postgres-only sob carga (S3/Q4): a aritmética, e onde quebra primeiro

### 6.1 🟡 Primeiro: a volumetria do doc canônico está errada em 12× (K-9)

Doc 02 §11: *"1 escritório 500 CNPJs × 2k notas/mês × 30 itens ≈ 30M itens/ano"*. Refaça a conta: 500 × 2.000 × 30 = **30M itens/MÊS = 360M/ano** — uma ordem de grandeza (12×) acima do que o documento afirma, na linha exata em que conclui "Postgres dá conta com folga". Talvez a intenção fosse o tier típico (40 CNPJs capturados → 2,4M itens/mês ≈ 29M/ano), mas o texto diz 500. Um doc de schema cuja conclusão de capacidade repousa numa multiplicação errada precisa ser corrigido antes de virar migration.

### 6.2 O cenário do brainstorm, dimensionado

200 CNPJs alto-SKU, captura ativa, ~1.500–2.000 notas/mês/CNPJ (compra+venda, farmácia/mercado), 30 itens/nota:

| Grandeza | Mês | Pico (dias 1–12) |
|---|---|---|
| Notas | 300–400 mil | ~30 mil/dia |
| Itens (`nota_item`) | **9–12 milhões** | ~1M/dia |
| Apontamentos (5–10% dos itens) | 0,5–1,2 milhão | concentrados |
| Eventos `evento_boa_fe` (recebida + análise + gerado + decisões/lote) | **~2–4 milhões** | rajadas no fechamento |

Isso é **UM tenant**. Média de escrita é tranquila (~dezenas/s); o problema de sistemas de dados nunca é a média, é a rajada e a interferência.

### 6.3 Onde quebra primeiro — ranking (K-10)

1. **🔴 A serialização da trilha por tenant — e o cenário Q3 ("tempestade de reanálise").** O trigger da cadeia faz, por evento: advisory lock do tenant + `SELECT ... ORDER BY seq_tenant DESC LIMIT 1` + digest. Single-writer por tenant, ~0,5–1ms/evento na melhor hipótese → **teto de ~1.000–2.000 eventos/s por tenant**, com o lock retido até o COMMIT da transação envolvente (RPCs longas alargam a seção crítica). No fluxo normal, cabe. Mas quando a NT muda a tabela na sexta (Q3) e a reanálise de impacto reprocessa a carteira: 12M de itens → milhões de eventos **serializados numa única fila lógica**, competindo com o OLTP da "fila do dia" na segunda de pico. Horas de fila, no pior dia do mês.
   *Correções:* (a) **materializar a cabeça da cadeia** em `core.trilha_cabeca (escritorio_id PK, seq, hash)` atualizada na mesma transação — troca o `SELECT ORDER BY DESC` por um row-lock natural de UPDATE (o lock da linha JÁ serializa; o advisory lock e a busca por índice saem do caminho); (b) **evento de lote com Merkle root**: reanálise grava 1 evento por lote de N análises carregando a raiz de Merkle dos registros individuais (que vivem em `analise_execucao`) — N avanços de cadeia viram 1, sem perder verificabilidade item a item; (c) reanálise roda em **fila separada de baixa prioridade com backpressure**, nunca no pool do OLTP.
2. **🔴 `nota_item` NÃO é particionada.** Só `nota` é. 144M linhas/ano de um tenant grande numa heap única: índices de centenas de GB, autovacuum/freeze (wraparound em tabela insert-only exige vacuum agressivo desde PG13) competindo com o pico, impossibilidade de expurgo barato (o `DROP PARTITION` da nota órfã os itens... aliás, o expurgo via DROP PARTITION da `nota` **quebra a FK composta de `nota_item`** — ou falha, ou exige DELETE de milhões de linhas, exatamente o que o particionamento prometia evitar). *Correção:* particionar `nota_item` por `competencia` espelhando a mãe, desde a migration 001 — o mesmo argumento S5 ("migrar tabela viva é a migration mais cara que existe") aplicado com coerência.
3. **🟡 Churn da pgmq no mesmo buffer pool.** Cada `read` (update de `vt`) e `delete` gera dead tuple; no pico, a tabela de fila vira um hotspot de vacuum dentro da mesma instância que serve a tela do contador. Administrável em F2 (vacuum agressivo nas tabelas `pgmq.q_*`, filas curtas); é o segundo candidato a sair da instância quando doer.
4. **🟢 pgvector NÃO é onde quebra** — afirmo contra a suspeita do brainstorm: a base é `ref` global, 10³–10⁴ regras × transição; o índice HNSW inteiro cabe em dezenas de MB de RAM. Sem RLS, sem tenant. O motor consulta pouco e cacheia. Dimensionalmente irrelevante por anos. (Os custos reais do RAG estão no §5, não em RAM de índice.)

### 6.4 Veredito S3/Q4: Postgres-only aguenta F1–F2? **SIM, com as correções — e com gatilho de saída declarado**

There is no universally optimal solution, mas para F1 (upload manual, dezenas de tenants) e F2 inicial (captura seletiva ~40 CNPJs/tenant) a instância única **aguenta com folga**, desde que K-10a/b/c e o particionamento de `nota_item` entrem antes da carga, não depois. A transacionalidade fila+dado+trilha num único banco é uma propriedade de correção que Redis/SQS destruiriam — vale defender o Postgres-only *por correção*, não só por KISS.

**Até quando:** o desenho corrigido sustenta na ordem de ~30–50 escritórios típicos OU o primeiro tenant full-capture de 200 CNPJs alto-SKU — o que vier primeiro. Gatilhos objetivos de evolução (escrever no doc 17 §13): p95 do fecho de fila > SLA D+1 em 2 picos consecutivos; vacuum não acompanha (idade de relfrozenxid crescendo); trilha > 50M eventos/tenant. Rota de saída sem reescrita: réplica de leitura para painéis/Relatório de Valor → pgmq em instância própria → particionar `evento_boa_fe` por tenant-hash. Nenhuma dessas muda o modelo lógico — é por isso que dá para começar simples.

---

## 7. Retenção e expurgo sobre um ledger imutável (item 7 + Q1 de cauda longa)

A pergunta do brainstorm — *expurgar viola a cadeia?* — tem resposta limpa no desenho atual, com dois furos na borda.

**O que já está certo:** a trilha não guarda PII de pessoa natural (payloads referenciam ids/hashes); o expurgo apaga XML no storage e dá `DROP PARTITION` na `nota`, e **a cadeia não referencia fisicamente as linhas expurgadas** (`nota_id` sem FK no ledger — escolha correta e deliberada); o expurgo em si é evento (`xml_expurgado`) — tombstone explícito. "Esquecer" está desenhado como **remoção do dado + permanência da prova de que o dado existiu e foi removido**. É o padrão certo.

**Furos (K-11):**

1. **PII em payload é promessa, não invariante.** Basta um dev gravar `destinatario_doc` (CPF de NFC-e) num payload de evento e o ledger imutável passa a reter PII inexpurgável — violação LGPD estrutural, sem remédio. *Correção dupla:* (a) **teste de CI anti-PII** sobre os contratos de payload por `tipo_evento` (o doc 02 §11 já pede contratos; o teste é a enforcement); (b) **crypto-shredding como válvula de escape desenhada agora**: qualquer campo de payload que precise de dado pessoal entra cifrado com chave por titular, mantida FORA da cadeia (`core.titular_chave`); o hash do evento cobre o *ciphertext* — destruir a chave = esquecer, com a cadeia intacta e verificável. Custa uma convenção hoje; é impossível de retrofitar em ledger vivo.
2. **🟡 Cenário nomeado: "o laudo órfão de evidência".** A matriz de retenção (M-6) é por tipo de documento. Mas um laudo emitido em 2027, defensável até ~2032+, referencia notas cuja retenção-base (5 anos de 2021–22, na janela da recuperação retroativa) pode expirar **antes** do horizonte de defesa do laudo. Expurgo correto pela matriz → laudo cuja evidência primária sumiu → re-verificação impossível por desenho próprio. *Correção:* regra na matriz: **a emissão de laudo estende a retenção dos seus insumos** (notas/EFD referenciadas) até o fim do horizonte de defesa do laudo — implementável porque `apontamento → item → nota` dá o grafo exato do que segurar. O job de expurgo consulta esse grafo antes de dropar.

---

## 8. Q1–Q8 pela lente de dados (respostas diretas)

| Q | Resposta curta |
|---|---|
| **Q1 Auditabilidade 2027→2031** | **Hoje: NÃO.** Falta proveniência computacional (K-8), fórmula de hash congelada/versionada (K-4) e protocolo de restore (K-3). Com K-3/K-4/K-8: **SIM**, sob o enquadramento honesto de re-verificação (não re-execução de LLM) + replay exato da camada de regras. |
| **Q2 Trocar provider em 30d** | Ingestão neutra ajuda, mas o doc 02 permite `dedup_key = "chave_acesso (ou id do evento do provider)"`. Id do provider como dedup = troca de provider re-ingere a carteira como "nova". **Fix de 1 linha: `dedup_key` ≜ chave de acesso canônica, sempre** (e `chave_dedup` de K-6a para docs sem chave). |
| **Q3 NT na sexta, pico na segunda** | É o cenário que detona o teto da trilha (K-10.1) e o gerador de gêmeos (K-7.3). Reanálise = fila separada, baixa prioridade, eventos em lote/Merkle, apontamentos sucedidos via `superado` — nunca duplicados na fila do dia. |
| **Q4 Pico dia 1–12, 200 CNPJs** | §6: aguenta F1–F2 com K-9/K-10 aplicadas; gatilhos de saída declarados. `nota_item` particionada é pré-condição, não otimização. |
| **Q5 Cross-tenant** | RLS default-deny é boa, mas K-1 mostra que policy de escrita direta é vetor *dentro* do tenant também: escrita só por RPC reduz a superfície das duas ameaças de uma vez. Nota menor: `hashtext()` (int4) admite colisão de advisory lock entre tenants — só falsa serialização (perf), não corretude; some com K-10a. Verificação da cadeia executável PELO tenant = transparência que vira argumento de venda. |
| **Q6 Custo runaway de captura** | O inbox idempotente (K-2) é também guardrail de COGS: webhook em loop não re-dispara motor. Teto/tenant no adapter ✓. Acrescentar: idempotência de análise (K-7.1) impede que reprocessamento manual vire reanálise paga em dobro. |
| **Q7 Gestorize ruim (Spike 5 falha)** | Fora da minha lente primária; do lado dos dados: `gestao.*` como alvo de migração está bem traçado. O risco de dados real é a **qualidade da extração** do Documentize alimentando a classe `documento_extraido` — o golden-set precisa cobrir essa classe separadamente. |
| **Q8 Falso-positivo +2pp pós-troca de embedding** | Sem K-8, a regressão é detectável (golden-set) mas **inatribuível** (qual mudança causou?). Com proveniência computacional + `golden_set_versao` por release de motor, o diff de causa é uma query. O gate de CI deve fixar embedding_modelo/índice por versão avaliada. |

---

## 9. O que eu NÃO ataco (para a rodada 2 não gastar pólvora)

- **Event-sourcing leve (estado relacional + trilha como prova), não full:** correto. Replay como fonte de verdade operacional seria complexidade não-earned para 1 dev — concordo com a decisão e com o racional.
- **Hash-chain por tenant (não global):** correto. Verificação independente por escritório é o entregável jurídico; ordem entre tenants é juridicamente irrelevante.
- **pgmq sobre pg-boss/Redis:** correto, e pelo motivo certo (transacionalidade com o dado > throughput que ninguém precisa). O gotcha do pooler é real.
- **Carimbo ACT diário, nunca por evento:** correto. Frequência de âncora é trade-off custo×janela-de-fabricação; diário fecha a janela da denúncia espontânea (argumento do Heleno) a custo desprezível. Só exijo o TST fora do banco (K-3.1).
- **pgvector:** dimensionado corretamente para o problema (contra a suspeita do brainstorm — §6.3.4).
- **Partição anual da `nota` desde o dia 0:** correto e raro de ver alguém acertar tão cedo. Só falta a filha (`nota_item`) acompanhar a mãe.

---

## 10. Consolidação — correções K-1…K-12 (insumo para os patches v1.1)

| # | Sev | Correção | Onde |
|---|-----|----------|------|
| K-1 | 🔴 | Matar a policy de UPDATE direto em apontamento/laudo; escrita SÓ via RPC; constraint trigger "estado sem evento na mesma xact = abort" | doc 02 §6 Padrão 3 |
| K-2 | 🔴 | Consumo pgmq: ler+efetivar+ackar na MESMA transação (mandamento escrito) | doc 17 §6.3 |
| K-3 | 🔴 | Protocolo de restore: TST/laudos em WORM fora do banco + cópia ao tenant; evento `restauracao_sistema`; salto de `seq_tenant`; re-âncora imediata; RPO como requisito; runbook no Spike 6 | doc 17 §3.2/§13 (novo) |
| K-4 | 🔴 | `hash_ver` + fórmula congelada por versão + canonicalização com delimitadores + golden hashes no CI + política additive-only no ledger | doc 02 §3.5 |
| K-5 | 🔴 | `competencia` ≜ derivada da chave por função no banco (parser por tipo: NF-e pos 3–6, NFS-e pos 37–40); `competencia_fiscal` separada; registro `nota_chave` UNIQUE global | doc 02 §3.2 |
| K-6 | 🔴 | (a) `chave_acesso` nullable + `chave_dedup` gerada (`doc:`+sha256 p/ sem-chave); perceptual hash só candidato p/ humano; (b) unicidade parcial de eventos por referente na trilha | doc 02 §3.2/§3.5 |
| K-7 | 🔴 | `analise_execucao` UNIQUE (nota, base, motor); UNIQUE natural no apontamento; estado `superado` + fluxo de sucessão entre versões | doc 02 §3.3 + M-2 |
| K-8 | 🔴 | Registro mínimo de proveniência computacional (§5.3); enquadramento re-verificação ≠ re-execução; regras determinísticas re-executáveis como dado versionado | doc 17 §3.1/§3.3 |
| K-9 | 🟡 | Corrigir a volumetria 12× errada do doc 02 §11 e refazer a conclusão de capacidade | doc 02 §11 |
| K-10 | 🔴 | `trilha_cabeca` materializada; eventos de lote c/ Merkle root p/ reanálise; fila de reanálise separada c/ backpressure; **particionar `nota_item`** (e resolver FK composta × DROP PARTITION) | doc 02 §3.2/§3.5/§9 |
| K-11 | 🟡 | Teste CI anti-PII em payload + crypto-shredding desenhado agora; regra "laudo estende retenção dos insumos" na matriz M-6 | doc 17 §10, M-6 |
| K-12 | 🟡 | `dedup_key` da ingestão ≜ chave canônica (nunca id do provider) — portabilidade Q2 | doc 02 §3.8 |

---

## 11. Veredito

**A trilha como desenhada é tecnicamente verificável ao longo de 7 anos? — COM CORREÇÕES.**

O esqueleto está certo — o log como abstração, a âncora externa, a bitemporalidade, estado+prova transacionais. Mas verificabilidade de 7 anos não é uma propriedade do happy path, e hoje existem quatro caminhos pelos quais a trilha se corrompe em silêncio ou se desmoraliza perante o perito: a porta lateral de escrita sem evento (K-1), o fork ancorado pós-restore (K-3) — o mais grave, porque transforma a âncora em testemunha de acusação —, a fórmula de hash não-congelada (K-4) e os gêmeos do motor não-determinístico (K-7). Nenhum exige mudança de paradigma; todos exigem que o que está *assumido* vire *desenhado*, antes da migration 001. O custo somado é de dias, não meses — e é a diferença entre um ledger que parece prova e um ledger que sobrevive a uma perícia hostil em 2031.

Data outlives code — e aqui o dado precisa sobreviver ao código, ao modelo, ao provider e ao próprio banco que o hospeda hoje. Make the trade-offs explicit.

**Fontes ao vivo:**
- [Chave de Acesso da NFS-e Nacional: Estrutura e Funcionamento (Espião NFe)](https://blog.espiaonfe.com.br/chave-de-acesso-da-nfs-e-nacional-estrutura-e-funcionamento/) — layout 50 posições: CodMun(7)+Amb(1)+TipoInsc(1)+InscFed(14)+nNFSe(13)+**AnoMes(4)**+CodNum(9)+DV(1)
- [TOTVS — Entrada de NFS-e Nacional com chave de acesso 50 posições](https://centraldeatendimento.totvs.com/hc/pt-br/articles/32274337090199-Cross-Segmentos-Linha-Datasul-MRE-Entrada-de-NFS-e-Nacional-com-chave-de-acesso-50-posi%C3%A7%C3%B5es) — Resolução CGSN nº 169/2022 (contexto MEI)
- [pgmq — documentação oficial](https://pgmq.github.io/pgmq/latest/) e [repositório](https://github.com/pgmq/pgmq) — exactly-once **apenas dentro do visibility timeout**; `pop()` = at-most-once; [Supabase Queues/pgmq](https://supabase.com/docs/guides/queues/pgmq)

-- Kleppmann. Data outlives code. Make the trade-offs explicit. 📊
