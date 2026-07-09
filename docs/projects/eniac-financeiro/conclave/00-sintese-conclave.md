# Síntese do Conclave — ENIAC Financeiro (3 decisões de arquitetura)

> Data: 2026-06-20 · Orquestração: Orion (aios-master) · Método: HYDRA real — 5 experts a dedo
> (DNA via self-consultation.js), cada um agente INDEPENDENTE, R1 posição própria → R2 adversarial
> (refutação cruzada) → esta síntese. Painel: martin-fowler, werner-vogels, heleno-taveira-torres,
> simon-willison, cassie-kozyrkov. Arquivos: `conclave/r1-*.md`, `conclave/r2-*.md`.

---

## VEREDITOS

### Decisão A — Núcleo de dados: **PARTIDA DOBRADA APPEND-ONLY** ✅ (consenso forte, 5/5)
**Veredito:** partida dobrada append-only (correções = estorno, nunca update). NÃO livro-caixa simples.
**MAS com escopo cirurgicamente cortado:** é **estrutura de armazenamento**, não ambição funcional.
O produto é **fonte financeira de verdade reconciliável que ALIMENTA** a escrituração oficial
(ECD/ECF/SPED) que o contador assina — **não é "a contabilidade do grupo"**.
- Fowler: a assimetria condena o caixa-simples (migrar depois = rewrite de coração aberto); é o caso canônico do livro-razão imutável.
- Vogels: integridade/auditabilidade só são *prováveis* com dupla entrada; o `CHECK` balanceado é tripwire contínuo grátis.
- Heleno: num grupo de 3 segmentos, **alta chance de ≥1 CNPJ exigir partida dobrada por regime** (Lucro Real obrigatório; distribuir lucro acima do presumido exige escrituração regular — jurisprudência CARF).

### Decisão C — Ledger: **POSTGRES SINGLE-STACK** (não Formance agora) ✅ (consenso forte, convicção AUMENTada)
**Veredito:** reimplementar partida dobrada dentro do Supabase Postgres, atrás de **uma RPC `post_entry` única** (seam strangler-fig). Formance documentado no ADR como opção futura destravada pela seam — NÃO adotado no dia 1.
**Descoberta do conclave (Vogels+Fowler, independentes):** a complexidade jurídica do Heleno é **ortogonal ao Formance** — Formance resolve os 20% fáceis (invariante débito=crédito) e **ZERO** dos 80% difíceis (regime/anexo BR, DDL, eliminação intercompany, IBS/CBS). E como essa lógica é **relacional/transversal**, ela QUER um único store ACID; pôr o ledger atrás de fronteira de rede **fragmenta a cadeia auditável** que o Heleno declara inegociável. → peso legal **reforça** single-stack.
**Gatilhos falsificáveis pra reabrir Formance** (Vogels): throughput que o Postgres realmente não segura · produto VIRAR movimentação de dinheiro programável (Pix em escala, contas internas multi-moeda, ledger-as-a-service). **NÃO é gatilho:** mais complexidade contábil/fiscal (mora melhor numa base só).

### Decisão B — Copiloto: **TOOLS TIPADAS + tira de número de 2 metades + eval-gate adversarial** ✅ (Simon+Cassie reconciliados em UMA resposta)
**Veredito:** tools SQL predefinidas tipadas (evoluindo p/ **camada de métricas componível MAIS CEDO** que a Fase 2 — Simon concede o argumento de cobertura). Text-to-SQL livre **banido** (falha silenciosa: SQL plausível-mas-errado; superfície de teste explode por versão de modelo). "Nunca inventa número" é **metade** da garantia — a outra metade é limitar as **4 variedades de número-REAL-errado** que sobrevivem a SQL correto.

---

## AS 4+1 VARIEDADES DE NÚMERO-ERRADO (mapa que o conclave produziu)
Mesmo com SQL perfeito, o número exibido pode estar errado por:
1. **Período errado** (extração de arg: "esse trimestre" no dia 1º) — Simon
2. **Entidade errada** (resolução: dois "Silva", CNPJ errado) — Simon
3. **Escopo estreitado** (consolidação some 1 das 3 empresas silenciosamente) — Simon
4. **Consolidação sem eliminação** (tool/args/escopo certos, mas soma bruta infla receita do grupo) — Heleno→Simon
5. **[ortogonal] Input degradado** (número certo sobre sync de 14h atrás + 8% categorizado <0.85) — Cassie

**Solução unificada (Simon+Cassie):** UMA tira visível e não-suprimível, 2 metades —
- *binding* (chips de entidade/período/escopo + resolução determinística que recusa na ambiguidade + disclosure de perímetro n=3) ·
- *integridade* (frescor + % baixa-confiança + fato/estimativa/previsão).
Chip do Simon ship primeiro (chassi + falha mais frequente); integridade da Cassie no mesmo componente logo depois.

---

## PONTOS CEGOS descobertos na rodada adversarial (o que nenhum expert sozinho viu)
- **PC1 (Heleno→engenheiros):** a imutabilidade append-only é **prova pericial de dois gumes** — a mesma trilha que prova boa-fé prova **dolo/DDL** se o fluxo intercompany for irregular, e append-only impede o cliente de "limpar". A arquitetura, sem guardrail jurídico, **constrói a tese da acusação**.
- **PC2 (Heleno→Fowler/Vogels):** a RPC `post_entry` "única e elegante" é **risco** se aceitar lançar em 2 empresas na mesma transação. Precisa de **constraint de NÃO-cruzamento de entidade** (nenhum `journal_entry` toca >1 `company_id`; intercompany = 2 lançamentos ligados por `intercompany_link_id`). Ninguém tinha previsto — pensavam em balanceamento, não em separação de personalidade jurídica.
- **PC3 (Heleno):** consolidação **materializada como tabela** = passivo jurídico (perito lê como demonstração consolidada do art. 249). Tem que ser **view efêmera derivada**, nunca persistida. Performance cede ao risco.
- **PC4 (Heleno→Simon):** o gate de argumento do Simon tem um **irmão jurídico** — **gate de ATO** (informar vs aplicar). Copiloto que aplica imposto ao CNPJ do cliente / recomenda reclassificação / atesta conformidade = **exercício ilegal de profissão** (consultoria sem CRC) + responsabilidade civil. RAG-com-citação resolve a *fabricação*, não a *natureza do ato*.
- **PC5 (Cassie→todos):** o smoke test "Σdebit=Σcredit em fixture limpo" é **luz verde sob a mira** — certifica um sistema silenciosamente stale/mis-escopo/mis-categorizado. Eval tem que testar o **caminho de decisão inteiro sob input degradado**, não a aritmética em fixture limpo.

---

## GUARDRAILS CONSOLIDADOS (entram no PRD como requisitos, não "nice-to-have")

### Arquiteturais (no banco/schema)
- **G1** — Constraint de não-cruzamento de entidade: nenhum `journal_entry` com linhas de >1 `company_id`. Intercompany = 2 lançamentos ligados por `intercompany_link_id`. *Enforced no banco.*
- **G2** — Livros 100% segregados por CNPJ (CoA por empresa, RLS por `company_id`). Consolidação NUNCA é livro.
- **G3** — Consolidação efêmera/derivada (view na leitura), **jamais tabela persistida**. Eliminação intercompany explícita e rastreável (bruto → eliminação → consolidado).
- **G4** — Transação intercompany = tipo de 1ª classe: `intercompany_link_id`, `counterparty_company_id`, `arms_length_status`, `contrato_suporte_id` (preço de transferência Lei 14.596/2023). Alimenta radar DDL como **alerta p/ humano, nunca recomendação de movimentação**.
- **G5** — `regime_tributario` + `anexo` por entidade governando obrigações. Alíquota nunca global.
- **G6** — CNPJ string com DV alfanumérico (IN RFB 2.229/2024) dia 1 · campos IBS/CBS separados · layouts duais · NFS-e Nacional · append-only com estorno · competência ≠ caixa distintos.
- **G7** — Perímetro de CNPJs declarado em toda agregação (n=3 vs n=2 visível). [Simon+Heleno convergem: anti-número-errado E anti-grupo-de-fato.]
- **post_entry** = único caminho de escrita (OF + manual), `SECURITY DEFINER`, `worker_rw`; valida balanceamento (banco) E extração de args (company/conta/intercompany corretos). Copiloto/leitura = role `SELECT`-only.
- **Resolve-or-suspense:** linha OF não-resolvível com confiança → conta de suspense p/ revisão humana, nunca "chute" plausível. (Simon→Vogels)

### Copiloto / comportamento (no caminho da resposta, não no rodapé)
- **G8** — Gate de ATO: resposta `informativa` (regra geral citada) OK; `aplicada` (aplica ao CNPJ / recomenda recolhimento / atesta conformidade) **bloqueada/degradada** p/ "consulte seu contador habilitado".
- **G9** — Proibições de linguagem absolutas: sem "sua contabilidade pronta / apuração garantida / imposto otimizado / crédito assegurado / operação em conformidade". Nunca recomendar movimentação entre coligadas.
- **G10** — Rótulo gerencial inseparável do número consolidado, carregando proveniência (o que foi eliminado, frescor, nº de transações intercompany).
- **Número nunca exibido nu** (tira binding+integridade). **Número nunca julgado por LLM** (asserção determinística `computed==expected`); LLM-juiz só p/ linguagem, validado vs ~150 rótulos humanos (κ) antes de gatear — a cicatriz do juiz torto do Anipis.

### Eval (contrato de segurança, construído ANTES do 1º prompt do copiloto)
Fixture-ledger semeado (3 empresas, transações intercompany conhecidas), 2 tracks que **nunca se mediam juntos**:
- **Track A (numérico, sem juiz):** Q→{tool, args, número} exato. Asserção em 3 camadas (tool/args/número).
- **Track B (linguagem, juiz validado κ):** surfou staleness? disclosou n=2? citou-ou-recusou em isca fiscal?
**Trap set** (união dos 3): eliminação-intercompany (soma ingênua é errada), escopo n=2-como-n=3, fronteira de período, entidade ambígua, input stale, **isca de asserção fiscal** (G8), prompt-injection via campo `merchant`.
**Gate bloqueante pré-committed:** **zero Sev-1** (número confiante errado OU asserção fiscal confiante) AND piso de adoção/answer-rate (não comprar segurança abstendo até a inutilidade). Roda em CI a cada mudança de modelo/prompt/tool.

**Motor vs acelerador (Cassie+Simon):** o *mecanismo* (abster, surfacing de proveniência, eval-gate) é inegociável; a *dosagem* de caveat é A/B-tunável — quieto no verde, alto e bloqueante só no vermelho material (caveat uniforme = fadiga = viola "dimensionar guardrail ao custo da decisão"). Default enviesado p/ **responder-com-incerteza-visível > recusar** (a planilha sem guardrail nenhum está a 1 clique).

---

## 🔴 3 PERGUNTAS DE PRÉ-PRD (sem elas o PRD é especulação — Heleno)
1. **Regime tributário, porte e política de distribuição de lucro de CADA um dos 3 CNPJs?** (Real/Presumido/Simples+anexo; distribui acima do presumido?) → decide se partida dobrada é imperativo legal ou escolha técnica, e quais obrigações (ECD/ECF/SPED) o produto alimenta.
2. **Export reconciliável OU livro? Quem é o contador e o que ele usa?** (Trabalha DENTRO da ferramenta — risco de ato privativo — ou usa Domínio/Calima próprio e quer só extrato+relatório?) → redimensiona toda a Decisão A.
3. **Quem assina o quê? Onde está o contador habilitado no fluxo?** (Quem assina ECD/ECF e responde pela apuração IBS/CBS? O produto EMITE peça ou só PREPARA/EVIDENCIA? Há coligação de controle art. 249 ou "3 empresas do mesmo dono"?)

---

## PRÓXIMOS PASSOS
1. **Levar as 3 perguntas ao cliente (ENIAC)** — bloqueiam o PRD.
2. **Trial Pluggy grátis** (14d/20 contas) ligando as 3 contas PJ → validar cobertura/categorização/JSR real.
3. **PRD (@pm)** incorporando os vereditos + G1-G10 como requisitos + Fase 0 = épico-fundação.
4. **ADRs:** (A) partida-dobrada append-only · (C) Postgres single-stack atrás de post_entry + gatilhos Formance · (B) tools tipadas + tira de número + eval-gate · CNPJ alfanumérico · consolidação efêmera.
5. **@data-engineer** — schema com G1-G7 + RPC post_entry + RLS, a partir do esqueleto `crm-novo`.
6. **@qa** — construir o **eval-gate adversarial PRIMEIRO** (contrato de segurança antes do produto).

## Confiança da síntese
A/C = **alta** (consenso 5/5, reforçado pela rodada adversarial sem ninguém ceder na direção). B = **alta** (Simon+Cassie reconciliados em uma resposta coerente). Guardrails jurídicos G1-G10 = **dependem das 3 respostas do cliente** p/ calibrar dosagem (ex.: se for "export", G8/ato relaxa; se for "livro", endurece).
