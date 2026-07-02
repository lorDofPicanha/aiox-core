# Auditoria integral e tech research comparativa — ENIAC Financeiro

**Data:** 2026-06-30
**Responsável:** Orion (`@aios-master`)
**Escopo:** `apps/eniac-financeiro`, documentação, banco, integrações, operação e alternativas
**Validade:** 90 dias para versões, preços e fornecedores; requisitos legais devem ser revalidados antes do go-live
**Decisão avaliada:** autorizar piloto real, definir arquitetura-alvo e ordenar o backlog bloqueante

> Este relatório é uma avaliação técnica e de riscos. Não substitui parecer jurídico, contábil ou tributário.

---

## 1. Resumo executivo

### Veredito

**O aplicativo tem uma boa demonstração funcional, mas não está pronto para piloto com dados financeiros reais.** A base escolhida — Next.js, TypeScript, Postgres/Supabase e Vercel — continua adequada. O problema central não é a stack: são falhas de empacotamento, autorização, integridade, testes e operação.

**Nota de prontidão ponderada: 3,3/10.** A interface e a cobertura funcional estão à frente da engenharia de produção. O código compila, mas um clone limpo não reproduz o build porque arquivos essenciais do Supabase e todas as migrations estão ignorados pelo Git. Mais grave: o login cria usuários livremente e um trigger adiciona cada novo usuário às três empresas. Na prática, qualquer e-mail capaz de receber o magic link pode obter acesso financeiro integral.

### Decisão recomendada

**NÃO autorizar piloto real agora.** Autorizar somente após o gate P0:

1. versionar clientes Supabase e migrations; provar instalação em clone limpo;
2. fechar cadastro e remover o trigger de acesso global;
3. implementar autorização por empresa e papel, com testes negativos de RLS;
4. substituir lançamentos destrutivos por trilha de auditoria e tornar “marcar como pago” transacional/idempotente;
5. atualizar Next.js e zerar vulnerabilidades de produção conhecidas;
6. criar testes mínimos, backup/restore, observabilidade e runbook;
7. desativar Open Finance e IA no piloto até seus próprios gates serem concluídos.

### O que manter, corrigir, substituir e adiar

| Decisão                                 | Recomendação                                                                                 |  Confiança |
| --------------------------------------- | -------------------------------------------------------------------------------------------- | ---------: |
| Next.js + TypeScript                    | **Manter**                                                                                   |       alta |
| Supabase/Postgres/Auth                  | **Manter e endurecer**                                                                       |       alta |
| Vercel                                  | **Manter para o web app**                                                                    |       alta |
| Interface web mobile-first              | **Manter; corrigir acessibilidade e fluxos**                                                 | média-alta |
| Pluggy                                  | **Manter apenas como candidato ao POC**                                                      |      média |
| OpenAI                                  | **Manter por trás de adapter; fora do caminho crítico**                                      | média-alta |
| “Livro caixa” como contabilidade formal | **Rejeitar**                                                                                 |       alta |
| App customizado versus ERP pronto       | **Modelo híbrido**: app gerencial ENIAC + contabilidade oficial em sistema/processo validado |       alta |
| PWA/native                              | **Adiar** até haver demanda comprovada de offline/dispositivo                                |       alta |

### Economia real

A proposta comercial encontrada é de **R$ 2.500 de implantação + R$ 200/mês**, total nominal de **R$ 4.900 no primeiro ano** para o grupo. Isso é competitivo frente a SaaS maduros, mas não inclui explicitamente agregador bancário, observabilidade, suporte de incidentes, adequação legal, backup avançado nem custo real de evolução. O preço atual só é sustentável se o produto permanecer enxuto e específico para a ENIAC; não sustenta, por si só, uma tentativa de replicar um ERP completo.

---

## 2. Método e limites

### Evidência usada

- leitura de 56 arquivos TypeScript/TSX, migrations locais, configuração e documentação;
- comparação implementação × especificação × proposta comercial;
- `eslint`, `tsc --noEmit` e build de produção;
- `npm audit --omit=dev` e `npm outdated`;
- varredura estática de autenticação, RLS, deleções, importação, IA e Open Finance;
- pesquisa técnica, regulatória e de mercado, priorizando documentação oficial;
- conclave AIOS `33efc498-f7e4-49a0-9f2c-2733ad3b9636` e revisão adversarial interna.

### Limites

- não houve acesso a um ambiente de produção, logs reais, contrato com fornecedores, plano Supabase/Vercel ou contas bancárias de teste;
- não foi executado teste destrutivo contra o banco;
- o runtime do navegador integrado falhou no sandbox Windows; a avaliação visual ficou limitada à revisão estrutural dos componentes e ao build;
- não há suíte automatizada existente;
- preços sem página pública ou proposta comercial foram tratados como desconhecidos;
- relatos do Reclame Aqui são sinais autoselecionados, não amostras representativas.

### Qualidade das fontes

| Classe | Exemplo                                           | Uso                                       | Peso |
| ------ | ------------------------------------------------- | ----------------------------------------- | ---: |
| A      | código, migrations, BCB, ANPD, CFC, docs oficiais | decisões centrais                         |  5/5 |
| B      | páginas oficiais de produto/preço/status          | comparação comercial/operacional          |  4/5 |
| C      | reclamações individuais                           | levantar hipóteses de suporte/implantação |  2/5 |
| D      | inferência                                        | somente quando explicitamente marcada     |  1/5 |

---

## 3. Estado real do projeto

### Inventário

- aplicação Next.js 16 com App Router, React 19 e TypeScript;
- autenticação Supabase por magic link;
- três empresas seed: ENIAC, Stafeni e Noyce;
- lançamentos, recorrências, importação OFX/CSV, consolidação, relatórios;
- previsão, alertas, assistente OpenAI e integração Pluggy;
- 15 rotas geradas no build;
- um commit de implementação (`a8d22f0e`, 2026-06-25), sem evidência de merge em `main` ou deploy;
- nenhuma suíte de testes e nenhum script `test` no app.

### Gates executados

| Gate                     | Resultado  | Observação                                                   |
| ------------------------ | ---------- | ------------------------------------------------------------ |
| ESLint                   | PASS       | sem erros                                                    |
| TypeScript               | PASS       | `tsc --noEmit`                                               |
| Build Next.js            | PASS local | usa arquivos ignorados e `.env.local`; não prova clone limpo |
| Dependências de produção | FAIL       | 1 vulnerabilidade alta direta e 1 moderada transitiva        |
| Testes unitários         | AUSENTE    | zero arquivos/suíte                                          |
| Testes RLS               | AUSENTE    | nenhuma prova negativa por tenant                            |
| E2E                      | AUSENTE    | nenhum fluxo validado automaticamente                        |

### Divergência entre promessa e implementação

A proposta considerava Open Finance, IA, previsão e alertas como fases separadas do MVP, mas todas foram implementadas no mesmo salto. Ao mesmo tempo, itens básicos da V1 — edição de lançamento e filtro por categoria — não aparecem completos na interface. Houve **scope creep horizontal**: mais features, sem os controles necessários para operar as features centrais.

---

## 4. Bug hunter — findings priorizados

### P0 — bloqueadores de qualquer dado real

#### F-01 — Cadastro aberto concede acesso às três empresas

**Severidade:** crítica
**Evidência:** `src/app/login/actions.ts:34` usa `shouldCreateUser: true`; `supabase/migrations/0001_init.sql:127-143` cria `add_user_to_all_companies()` e o executa para todo novo usuário.
**Impacto:** qualquer pessoa com um e-mail válido pode criar conta e tornar-se membro das três empresas.
**Correção:** desabilitar criação pública; substituir por convite/admin; remover o trigger; conceder empresa e papel explicitamente; revogar usuários indevidos e auditar acessos.

#### F-02 — Clone limpo não contém backend nem migrations

**Severidade:** crítica
**Evidência:** `.gitignore:193` contém `supabase/`, que ignora tanto `src/lib/supabase/*.ts` quanto `supabase/migrations/*.sql`; `git ls-files` não retorna esses arquivos.
**Impacto:** clone limpo não compila e banco não pode ser recriado; o build local é um falso positivo de reprodutibilidade.
**Correção:** tornar a regra de ignore específica ao artefato desejado, versionar os quatro arquivos, criar `.env.example` completo e testar bootstrap do zero.

#### F-03 — Versão de Next.js vulnerável

**Severidade:** alta
**Evidência:** Next.js `16.2.4`; `npm audit --omit=dev` encontrou vulnerabilidade alta direta e moderada transitiva, com correção sem major disponível.
**Impacto:** exposição a falhas publicadas, incluindo classes de bypass/DoS/SSRF/cache conforme o advisory aplicável.
**Correção:** atualizar para o patch corrente compatível, repetir audit/build/testes e acompanhar [GitHub Security Advisories](https://github.com/advisories).

#### F-04 — Dados financeiros podem ser apagados sem histórico

**Severidade:** alta
**Evidência:** hard delete em `src/app/actions.ts:82` e `vencimentos/actions.ts:108`; papel de membro não restringe operação.
**Impacto:** perda não rastreável, fraude/erro sem autoria e impossibilidade de reconstruir fechamento.
**Correção:** `voided_at`, `voided_by`, motivo, event log append-only e política de retenção; separar `viewer`, `operator`, `approver`, `admin`.

#### F-05 — Baixa de vencimento não é atômica nem idempotente

**Severidade:** alta
**Evidência:** `markScheduledPaid` insere o lançamento e depois atualiza a recorrência em chamadas separadas.
**Impacto:** falha parcial ou clique concorrente pode gerar lançamento órfão ou duplicado.
**Correção:** função SQL/RPC transacional, chave idempotente única e teste de concorrência.

#### F-06 — Nenhum teste protege isolamento ou cálculos

**Severidade:** alta
**Impacto:** RLS, importação, recorrência e saldos podem regredir sem sinal.
**Correção:** pgTAP para RLS, Vitest para parsers/cálculos e Playwright para jornadas críticas. O Supabase recomenda testes de banco e RLS em seu [guia de testes](https://supabase.com/docs/guides/database/testing).

### P1 — antes de habilitar integrações ou operação assistida

#### F-07 — Integração Pluggy implementa somente o happy path

**Severidade:** alta
**Evidência:** primeira página de 500 transações (`pluggy.ts:82`), sem cursor; ausência de webhook, atualização explícita, tratamento de `deleted/updated`, `clientUserId` e idempotência de lote; “remover” conexão local não revoga o Item no provedor. Datas usam `slice(0,10)` sem conversão GMT-3.
**Impacto:** transações faltantes/duplicadas, consentimento persistente e datas erradas.
**Base externa:** a Pluggy documenta paginação, IDs mutáveis e timezone em [Transactions](https://docs.pluggy.ai/docs/transactions), lifecycle/webhooks em [Item](https://docs.pluggy.ai/docs/item) e exige `DELETE /items/{id}` para revogação em [Consent management](https://docs.pluggy.ai/docs/consent-management-delete-an-item).
**Correção:** manter feature flag desligada até POC por bancos reais da ENIAC e implementação integral do lifecycle.

#### F-08 — Assistente pode inventar números apesar do prompt

**Severidade:** alta
**Evidência:** saída final é texto livre do modelo; não há schema, verificador, citação de linhas, eval ou bloqueio de aconselhamento.
**Impacto:** decisão financeira baseada em valor não presente no banco.
**Correção:** números calculados somente pelo servidor; LLM recebe fatos estruturados, devolve JSON tipado com referências; verificador rejeita número desconhecido; suite de evals. IA deve permanecer fora de baixas, saldos e alertas críticos.

#### F-09 — CSV vulnerável a fórmula e parser incompleto

**Severidade:** alta/média
**Evidência:** descrição/categoria são exportadas sem neutralização; parser usa `split(delim)` e não entende aspas, delimitadores embutidos ou linhas múltiplas.
**Impacto:** arquivo aberto em planilha pode executar fórmula; importação válida pode ser corrompida.
**Base externa:** [OWASP CSV Injection](https://owasp.org/www-community/attacks/CSV_Injection).
**Correção:** biblioteca CSV madura, limite de tamanho, validação real de datas/centavos e neutralização segura na exportação.

#### F-10 — Callback aceita redirecionamento externo

**Severidade:** média-alta
**Evidência:** `auth/callback/route.ts:28` usa `new URL(next, url.origin)`; uma URL absoluta prevalece sobre a origem.
**Impacto:** phishing/open redirect após autenticação.
**Correção:** aceitar somente caminho relativo iniciado por `/` e rejeitar `//`, esquema e host externo.

#### F-11 — Sem rate limit, controles de custo e minimização de IA

**Severidade:** média-alta
**Impacto:** abuso autenticado, custo imprevisível e retenção internacional desnecessária.
**Base externa:** a API OpenAI não treina por padrão, mas logs de abuso podem ser retidos por até 30 dias; ZDR/MAM exige elegibilidade, conforme [Data controls](https://platform.openai.com/docs/guides/your-data).
**Correção:** quota por usuário/empresa, timeout, orçamento, redaction, `store:false`, DPA/SCC/TIA e processo para ZDR quando aplicável.

### P2 — qualidade, UX e operação

- dinheiro usa `number` em vez de centavos inteiros/decimal controlado; falta validação server-side de escala e limites;
- datas dependem do timezone da máquina/Vercel; usar `America/Sao_Paulo` explicitamente e datas civis para competência;
- deduplicação de importação pode eliminar dois pagamentos legítimos iguais no mesmo dia;
- deleção não pede confirmação; baixa usa “hoje” sem data real de pagamento;
- viewport define `maximumScale: 1`, prejudicando zoom; sheets não demonstram foco preso, Escape e semântica completa de diálogo;
- headers cobrem frame/content-type/referrer, mas faltam CSP e `Permissions-Policy`;
- health endpoint é apenas liveness, sem banco/provedor;
- mensagens de erro do Supabase podem vazar detalhes ao usuário;
- `getConnectToken` deveria exigir autenticação explicitamente;
- `.env.example` omite `PLUGGY_CLIENT_ID/SECRET` e inclui service role não usada;
- README/contexto estão defasados quanto a fases, Next.js e provedor de IA;
- múltiplos lockfiles geram warning de root; middleware está depreciado em favor de proxy no Next atual;
- faltam CI/CD, evidência de deploy, métricas, alertas, restore testado, runbook e inventário de subprocessadores.

### Pontos positivos do código

- TypeScript estrito e props tipadas; não foram encontrados `any`, `@ts-ignore`, `eval` ou secrets hardcoded;
- imports internos absolutos;
- RLS foi considerada no desenho inicial;
- valores financeiros são calculados no servidor antes da narrativa de IA;
- UI mobile-first cobre bem o fluxo de consulta e lançamento rápido;
- build estático e lint estão limpos no ambiente atual.

---

## 5. Scorecard de prontidão

| Dimensão                 |     Peso | Nota /10 | Evidência dominante                            |
| ------------------------ | -------: | -------: | ---------------------------------------------- |
| Escopo funcional         |      10% |      8,0 | muitas features concluídas                     |
| UX básica                |       8% |      6,0 | mobile-first, lacunas de edição/acessibilidade |
| Arquitetura              |      12% |      6,0 | stack adequada, acoplamentos operacionais      |
| Reprodutibilidade        |      10% |      1,0 | arquivos essenciais ignorados                  |
| Segurança/autorização    |      15% |      1,5 | signup global e papéis inativos                |
| Integridade/auditoria    |      15% |      2,5 | hard delete e baixa não atômica                |
| Testabilidade            |      10% |      1,0 | zero testes                                    |
| Integrações              |       7% |      3,0 | happy path incompleto                          |
| Operação/observabilidade |       8% |      1,5 | sem deploy/runbook/restore                     |
| Compliance evidence      |       5% |      2,0 | sem artefatos e contratos demonstrados         |
| **Total**                | **100%** |  **3,3** | **não pronto**                                 |

Thresholds propostos: demo ≥ 3; piloto sintético ≥ 5; piloto real ≥ 7 sem finding crítico; produção ≥ 8 sem P0/P1 aberto.

---

## 6. Comparativo técnico

### 6.1 Full-stack e banco

Critérios: integridade relacional 25%, isolamento 20%, esforço operacional 20%, DX 15%, custo 10%, portabilidade 10%.

| Opção                          |    Nota | Vantagens                                  | Desvantagens                                                | Veredito                                |
| ------------------------------ | ------: | ------------------------------------------ | ----------------------------------------------------------- | --------------------------------------- |
| Next.js + Supabase             | **8,4** | Postgres, Auth, RLS, migrations, baixo ops | exige disciplina RLS/backup; lock-in moderado em Auth       | **manter**                              |
| Next.js + Neon + Auth separado |     7,3 | Postgres serverless e branching            | montar Auth/RLS/Storage/ops eleva superfície                | não migrar agora                        |
| Next.js + Postgres Railway     |     6,8 | controle e portabilidade                   | mais operação, Auth e backup por conta própria              | só se houver requisito de servidor/jobs |
| Firebase/Firestore             |     5,4 | Auth e tempo real maduros                  | modelo documental pior para financeiro relacional/auditoria | descartar                               |

O Supabase permanece vencedor, condicionado a migrations versionadas, grants/RLS testados, MFA administrativo, backup e Security Advisor. Esses controles constam no [Production Checklist](https://supabase.com/docs/guides/deployment/going-into-prod) e no [Shared Responsibility Model](https://supabase.com/docs/guides/deployment/shared-responsibility-model). Neon e Railway continuam alternativas válidas, mas migrar agora troca riscos conhecidos por trabalho de plataforma sem resolver a autorização atual.

### 6.2 Hosting

| Critério                  | Vercel                              | Railway                         |
| ------------------------- | ----------------------------------- | ------------------------------- |
| Next.js/App Router        | integração nativa                   | container/Nixpacks              |
| Operação                  | menor                               | maior controle                  |
| Jobs longos/custom server | limitado pelos limites de Functions | melhor ajuste                   |
| Custo inicial público     | Hobby $0; Pro $20/mês               | Hobby $5; Pro $20 + uso         |
| Escolha                   | **web app atual**                   | workers futuros, se necessários |

Fontes: [Vercel Pricing](https://vercel.com/pricing), [Vercel Functions limits](https://vercel.com/docs/functions/limitations), [Railway Pricing](https://docs.railway.com/pricing). Não há motivo técnico para mover o frontend hoje.

### 6.3 Open Finance

Critérios: consentimento/regulação 20%, cobertura/confiabilidade 25%, DX 15%, lifecycle/webhooks 15%, suporte/SLA 15%, custo 10%. Custo e SLA permanecem parcialmente desconhecidos sem proposta.

| Provedor | Nota preliminar | Força                                            | Risco                                                   | Decisão                     |
| -------- | --------------: | ------------------------------------------------ | ------------------------------------------------------- | --------------------------- |
| Pluggy   |         **7,9** | código já iniciado, widget e docs claras         | integração atual incompleta; incidentes bancários reais | POC preferencial            |
| Belvo    |             7,6 | agregação Brasil, consentimento e portal maduros | migração/contrato enterprise                            | benchmark obrigatório       |
| Klavi    |             6,5 | participante regulado, crédito/inteligência      | menos transparência pública de DX/preço para este caso  | cotar se crédito virar foco |

A Pluggy só vence por custo de troca e fit atual; não por superioridade demonstrada. A Belvo documenta consentimento por Link e revogação em [Aggregation Brazil](https://developers.belvo.com/pt-br/products/aggregation_brazil/aggregation-brazil-introduction). A Klavi se posiciona como infraestrutura regulada em [klavi.ai](https://klavi.ai/). Antes de contratar: lista dos bancos ENIAC, sucesso de conexão, latência, dados históricos, SLA, LGPD/subprocessadores, suporte e preço total.

### 6.4 IA

| Opção                      | Fit                                         | Risco                                      | Recomendação                 |
| -------------------------- | ------------------------------------------- | ------------------------------------------ | ---------------------------- |
| Sem LLM no caminho crítico | máximo para integridade                     | menor diferenciação                        | **regra arquitetural**       |
| OpenAI via adapter         | implementação existente, bom custo/latência | retenção/transferência e hallucination     | manter opcional após eval    |
| Anthropic via adapter      | alternativa de qualidade e contrato         | migração e mesmos deveres de dados         | segundo fornecedor/benchmark |
| Modelo local               | controle de dados                           | operação e qualidade/custo no solo founder | não agora                    |

A decisão robusta não é “qual modelo”, mas **qual fronteira de autoridade**. O modelo pode explicar fatos, nunca produzir o ledger ou número oficial. OpenAI e Anthropic declaram retenção API padrão de até aproximadamente 30 dias, com ZDR mediante acordo/elegibilidade ([OpenAI](https://platform.openai.com/docs/guides/your-data), [Anthropic](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data)). Implementar um adapter torna troca de modelo barata; escolher o snapshot deve depender de eval financeiro próprio e custo vigente.

### 6.5 Estratégia de testes

| Camada              | Ferramenta                  | Cobertura mínima                                              |
| ------------------- | --------------------------- | ------------------------------------------------------------- |
| Funções puras       | Vitest                      | dinheiro, datas, forecast, CSV/OFX, dedupe                    |
| Banco e autorização | pgTAP/Supabase test helpers | RLS positiva e negativa, roles, transações, idempotência      |
| UI/jornadas         | Playwright                  | login, empresa A≠B, CRUD, recorrência, importação, exportação |
| Contratos externos  | mocks + sandbox/provider    | Pluggy e OpenAI, erro, retry, timeout, webhook                |
| Operação            | smoke + restore drill       | health/readiness, deploy, rollback, restore                   |

Playwright cobre navegadores e emulação mobile ([docs](https://playwright.dev/docs/browsers)); o guia oficial do Next lista opções de teste e E2E ([Testing](https://nextjs.org/docs/pages/guides/testing)). A combinação é deliberada: nenhuma ferramenta isolada prova cálculos, RLS e jornada.

### 6.6 Web, PWA ou nativo

| Alternativa         | Agora   | Gatilho para revisão                                                 |
| ------------------- | ------- | -------------------------------------------------------------------- |
| Web responsivo      | **sim** | —                                                                    |
| PWA                 | depois  | uso recorrente + necessidade comprovada de install/offline           |
| React Native/nativo | não     | câmera, biometria/offline profundo ou distribuição móvel estratégica |

---

## 7. Comparativo de mercado: construir, comprar ou combinar

### Referências públicas

| Produto        |               Preço público observado | Força principal                              | Limitação para ENIAC                          |
| -------------- | ------------------------------------: | -------------------------------------------- | --------------------------------------------- |
| Custom ENIAC   |                   R$2.500 + R$200/mês | UX/processo sob medida, três empresas        | engenharia/risco concentrados no fornecedor   |
| Conta Azul     |              desde R$159,90/mês anual | ecossistema ERP/contábil                     | planos/usuários e multi-CNPJ precisam cotação |
| Nibo           |                   R$166–383/mês anual | financeiro, conciliação, auditoria, contador | personalização limitada                       |
| Granatum       |                             R$396/mês | usuários/contas ilimitados, DRE e financeiro | custo maior, processo genérico                |
| Omie           |                          sob consulta | ERP amplo e conciliação                      | implantação/complexidade                      |
| Asaas/Base ERP | mensalidade zero; taxas transacionais | cobrança/pagamentos                          | não é substituto integral do ledger ENIAC     |

Fontes: [Conta Azul](https://contaazul.com/planos/), [Nibo](https://www.nibo.com.br/empresa/planos-e-precos), [Granatum](https://www.granatum.com.br/financeiro/precos-planos), [Omie](https://www.omie.com.br/funcionalidades/controle-financeiro-empresarial/), [Asaas](https://www.asaas.com/precos-e-taxas). Valores devem ser recotados e a licença multi-CNPJ confirmada.

### Síntese

- **Comprar** vence em controles genéricos, suporte, histórico de auditoria e integração contábil.
- **Construir** vence se a ENIAC tiver fluxo realmente próprio, uso móvel simples e integração futura com Noyce que os ERPs não atendam.
- **Combinar** domina: app customizado como cockpit gerencial específico; ERP/contador como sistema de escrituração e obrigações.

O custom do primeiro ano custa nominalmente R$4.900. Isso pode ficar abaixo de três licenças separadas de concorrentes, mas a comparação não é equivalente: preço de desenvolvimento subestima segurança, suporte e manutenção. O argumento de compra não deve ser “mais barato”, e sim “menor risco operacional”; o argumento de custom deve ser “workflow diferencial mensurável”, não paridade de features.

Sinais de reclamações públicas em Nibo, Conta Azul e Omie concentram-se em suporte, implantação, cobrança e aderência. São úteis para exigir SLA e piloto, mas não provam qualidade média dos produtos.

---

## 8. Contabilidade, Open Finance e LGPD

### Livro caixa gerencial ≠ escrituração contábil formal

O sistema atual registra entradas e saídas em regime simples. Ele não implementa plano de contas, partidas dobradas, débitos/créditos, documentos comprobatórios imutáveis, fechamento, Diário/Razão ou demonstrações. Portanto:

- pode ser chamado de **controle gerencial de caixa**;
- não deve prometer DRE/Balanço ou substituir escrituração sem projeto contábil próprio;
- exportações devem ser conciliadas e validadas pelo contador.

A ITG 1000 trata escrituração simplificada para entidades menores, mas ainda dentro de requisitos contábeis; o CFC descreve Livro Diário e escrituração em [ITG 1000](https://cfc.org.br/wp-content/uploads/2023/01/ITG-1000.pdf) e [Livro Diário](https://cfc.org.br/tecnica/perguntas-frequentes/livro-diario/). O regime exato de cada CNPJ precisa ser confirmado com o contador.

### Open Finance

O Banco Central exige consentimento livre, informado, prévio, inequívoco, revogável e ambiente seguro; participantes regulados podem operar com parceiros sob condições. Fontes: [BCB Open Finance](https://www.bcb.gov.br/en/financialstability/open_finance) e [consentimento do cliente](https://www.bcb.gov.br/estabilidadefinanceira/cliente-open-finance). Consequência prática: botão local “desconectar” não basta; revogação deve chegar ao provedor e ser comprovável.

### LGPD e operação

Dados financeiros, identificadores e autenticação exigem controles proporcionais. Antes do piloto:

- mapear controlador, operador, subprocessadores, finalidade e base legal;
- DPA com Supabase, Vercel, agregador e LLM; avaliar transferência internacional e cláusulas padrão;
- política de retenção/deleção e atendimento a titulares;
- ROPA simplificado, registro de decisões e canal de privacidade;
- plano de incidente. A ANPD estabelece comunicação em três dias úteis quando aplicável e manutenção de registros por cinco anos, conforme [Comunicação de Incidente](https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/comunicado-de-incidente-de-seguranca-cis);
- aplicar o [Guia de Segurança para Agentes de Pequeno Porte](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-publica-guia-de-seguranca-para-agentes-de-tratamento-de-pequeno-porte);
- avaliar transferências conforme a [Resolução CD/ANPD nº 19/2024](https://www.gov.br/anpd/pt-br/assuntos/assuntos-internacionais/transferencia-internacional-de-dados).

---

## 9. Arquitetura-alvo recomendada

```text
Usuário autenticado por convite
        │
        ▼
Next.js (Vercel) ── autorização explícita empresa + papel
        │
        ▼
Supabase/Postgres
  ├─ ledger gerencial append-only/void
  ├─ RLS testada por tenant
  ├─ RPCs transacionais e idempotentes
  ├─ audit_events
  └─ backups + restore drill

Pluggy worker/webhook ── staging ── revisão/dedup ── ledger
LLM adapter ── fatos estruturados/read-only ── verificador ── narrativa
Observabilidade ── logs sem PII + métricas + alertas + runbook
```

Princípios:

1. ledger é determinístico e não depende de LLM;
2. importações externas entram em staging antes de afetar saldo;
3. toda mutação crítica tem autoria, motivo e idempotência;
4. acesso nasce de convite e vínculo explícito, nunca de trigger global;
5. schema e infraestrutura são reproduzíveis por CLI;
6. UI não é fonte de autorização; o banco é a última barreira.

---

## 10. Roadmap e gates

### P0 — 2 a 4 dias: tornar o projeto reproduzível e não exposto

- [ ] corrigir `.gitignore`, versionar clientes Supabase e migrations;
- [ ] criar bootstrap de clone limpo e CI `lint + typecheck + test + build`;
- [ ] atualizar Next.js e dependências de patch; audit sem high/critical;
- [ ] fechar signup, remover trigger global, criar convite/admin;
- [ ] implementar roles e RLS; revogar/auditar usuários existentes;
- [ ] RPC transacional/idempotente para baixa;
- [ ] soft void + audit log;
- [ ] segredos/variáveis documentados sem valores.

**Gate:** clone limpo sobe; usuário sem vínculo não vê nenhuma empresa; membro A não lê/escreve B; nenhum P0 aberto.

### P1 — 3 a 5 dias: piloto controlado com dados manuais

- [ ] testes Vitest + pgTAP + Playwright para jornadas críticas;
- [ ] centavos/decimal e timezone explícitos;
- [ ] parser CSV maduro, proteção de exportação e import staging;
- [ ] edição, filtro por categoria, confirmação de exclusão e data de baixa;
- [ ] CSP, rate limits, error handling e accessibility pass;
- [ ] observabilidade, backup, restore test, rollback e runbook;
- [ ] artefatos LGPD e validação contábil do escopo.

**Gate:** score ≥ 7/10, restore provado, reconciliação manual fecha 100% em dataset de teste e 7 dias de piloto sintético sem incidente severo.

### P2 — 1 a 2 semanas: Open Finance em POC

- [ ] cotar Pluggy/Belvo/Klavi e testar todos os bancos necessários;
- [ ] lifecycle completo: cursor, webhook, refresh, delete/revoke, timezone, retry e idempotência;
- [ ] sandbox + staging + reconciliação humana;
- [ ] medir cobertura, atraso, duplicatas, falhas e tempo de suporte.

**Gate:** ≥99% de completude no dataset conhecido, zero duplicata efetiva, revogação comprovada e SLA/custo aprovados.

### P3 — depois do piloto: IA opcional e produto

- [ ] adapter multi-provider, facts schema, citations/verifier e evals;
- [ ] quota/custo, redaction, DPA/SCC/ZDR;
- [ ] discovery de workflow exclusivo ENIAC/Noyce;
- [ ] somente então avaliar PWA, multi-tenant SaaS, billing e suporte externo.

**Gate IA:** 100% dos números reproduzíveis do banco, zero ação de escrita e taxa de erro factual dentro do limite acordado.

---

## 11. Riscos residuais

| Risco                                  |             Prob. |    Impacto | Resposta                                  |
| -------------------------------------- | ----------------: | ---------: | ----------------------------------------- |
| integração bancária instável           |              alta |       alta | staging, webhook, reconciliação, SLA      |
| preço custom insuficiente para suporte |              alta |       alta | redefinir escopo/SLA e custo de terceiros |
| app virar ERP sem orçamento            |              alta |       alta | manter fronteira gerencial/contábil       |
| erro de tenant/RLS                     |             média |    crítica | testes negativos e revisão independente   |
| perda/corrupção                        |             média |    crítica | audit log, backup e restore drill         |
| hallucination de IA                    | alta sem controle |       alta | read-only, verifier e evals               |
| dependência do solo founder            |              alta | média-alta | runbook, CI, migrations e documentação    |

### Incertezas que ainda podem mudar a decisão

1. bancos e tipos de conta reais das três empresas;
2. regime tributário e processo contábil de cada CNPJ;
3. número de usuários, papéis e necessidade de aprovação;
4. volume mensal de transações/arquivos;
5. planos contratados, região e retenção de Supabase/Vercel/OpenAI;
6. propostas comerciais e SLA de Pluggy/Belvo/Klavi;
7. se Noyce exige integração específica que justifique produto custom.

---

## 12. Revisão adversarial

| Conclusão atacada                   | Contra-argumento mais forte                | Resultado                                                                                             |
| ----------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| manter Supabase                     | Auth/RLS atual causou o maior risco        | **sobrevive com refinamento**: implementação, não Postgres, é a causa; migrar não corrige autorização |
| manter app custom                   | SaaS maduro entrega mais controles         | **sobrevive com refinamento**: somente como cockpit específico, não ERP/contabilidade                 |
| Pluggy como preferido               | não há SLA/preço/POC comparável            | **sobrevive condicionalmente**: candidato, não decisão de compra                                      |
| manter OpenAI                       | modelo atual pode hallucinar e reter dados | **sobrevive com refinamento**: adapter read-only/eval; “LLM crítico” cai                              |
| liberar piloto após build verde     | build prova qualidade                      | **cai**: arquivos ignorados e falta de testes tornam o sinal insuficiente                             |
| preço atual é vantajoso             | não inclui custo total e suporte           | **cai como conclusão forte**; é apenas preço nominal competitivo                                      |
| livro caixa substitui contabilidade | features financeiras parecem suficientes   | **cai**: não há partidas dobradas, Diário/Razão ou fechamento formal                                  |

### Sensibilidade

- Se a ENIAC precisar apenas de controle manual simples, P0+P1 e sem Pluggy/IA é a opção dominante.
- Se conciliação automática for decisiva, a decisão de fornecedor fica aberta até POC e propostas.
- Se contabilidade formal entrar no escopo, estimativa, schema e responsabilidade mudam materialmente; deve nascer nova story/arquitetura.
- Se o produto for vendido a terceiros, score mínimo, tenancy, suporte, billing, LGPD e segurança exigem outro patamar; não é uma extensão trivial.

---

## 13. Bibliografia anotada essencial

### Arquitetura e segurança

- [Supabase Production Checklist](https://supabase.com/docs/guides/deployment/going-into-prod) — controles de produção, Auth, RLS e segurança.
- [Supabase Securing your API](https://supabase.com/docs/guides/api/securing-your-api) — grants e RLS.
- [Supabase Local Development](https://supabase.com/docs/guides/local-development/overview) — migrations versionadas e deploy por CLI.
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) — baseline de verificação de segurança.
- [Next.js 16.2](https://nextjs.org/blog/next-16-2) — contexto da versão atual; advisories devem ser verificados no upgrade.

### Open Finance, dados e regulação

- [BCB Open Finance](https://www.bcb.gov.br/en/financialstability/open_finance) — princípios oficiais de consentimento e ecossistema.
- [Pluggy Item](https://docs.pluggy.ai/docs/item) e [Transactions](https://docs.pluggy.ai/docs/transactions) — lifecycle, paginação, webhook e timezone.
- [Belvo Aggregation Brazil](https://developers.belvo.com/pt-br/products/aggregation_brazil/aggregation-brazil-introduction) — arquitetura de Links e consentimento.
- [ANPD Transferência Internacional](https://www.gov.br/anpd/pt-br/assuntos/assuntos-internacionais/transferencia-internacional-de-dados) — mecanismos vigentes.
- [CFC ITG 1000](https://cfc.org.br/wp-content/uploads/2023/01/ITG-1000.pdf) — referência contábil para entidades menores.

### Mercado e operação

- [Nibo Planos](https://www.nibo.com.br/empresa/planos-e-precos), [Conta Azul Planos](https://contaazul.com/planos/), [Granatum Planos](https://www.granatum.com.br/financeiro/precos-planos) — preços públicos observados.
- [Vercel Pricing](https://vercel.com/pricing), [Railway Pricing](https://docs.railway.com/pricing), [Neon Pricing](https://neon.com/pricing) — comparação de infraestrutura.

---

## 14. Registro de decisão

**ADR provisório:** preservar Next.js + Supabase + Vercel; separar ledger determinístico, integrações em staging e IA read-only; operar como controle gerencial customizado, não escrituração formal.
**Status:** recomendado, ainda não implementado.
**Próxima decisão humana:** autorizar a story P0 e redefinir escopo/preço/SLA antes de qualquer dado real.
**Triggers de revisão:** mudança de regime/escopo contábil, produto para terceiros, POC bancário ruim, custo de fornecedor > orçamento, requisito offline/nativo ou falha de restore.

---

## 15. Changelog

- **v1.0 — 2026-06-30:** auditoria integral, comparativos técnico/mercado/regulatório, revisão adversarial e roadmap P0–P3.
