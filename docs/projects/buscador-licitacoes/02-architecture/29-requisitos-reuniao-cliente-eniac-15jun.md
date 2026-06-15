# 29 — Requisitos da reunião com a cliente ENIAC (15/Jun/2026)

> Fonte: áudio WhatsApp `reuniao-stefani-aline-15jun` (~20 min). Demo do Noyce ao vivo
> pra equipe da ENIAC. Transcrição: `Downloads/reuniao-stefani-aline-15jun.transcript.txt`.
> Participantes: o desenvolvedor (founder) + equipe ENIAC. Nomes citados como operadoras:
> **Aline** (admin), **Alice** (proposta/planilha + análise final), **Giovanna** (busca +
> monta documentação). "O velho / o pai / o gordinho" = decisor a quem se apresentará depois.

## TL;DR — o que muda no build

1. **Consórcio vira feature de 1ª classe** (NOVO) — flag na busca + toggle antes da análise.
2. **Matching semântico de atestados** é o GAP técnico crítico (mesmo serviço, nomenclaturas diferentes).
3. **Extração de documentos em dois modos**: dossiê consolidado **E** documento individual por categoria.
4. **Raio de busca vai expandir** além dos 170 km atuais (já planejado pelo founder).
5. **4 logins** (Aline admin + 3), workspace **compartilhado** (não sessões individuais), papéis por pessoa.
6. **Status real**: hoje só **buscador + análise**; workflow completo (gerar planilha/proposta) depende do banco de dados. **ETA 2-3 dias** pra ir ao ar.

---

## 1. Escopo confirmado: o que o Noyce faz × o que é humano

**Noyce faz (autônomo):**
- Puxa todas as licitações (PNCP, BLL, Portal de Compras Públicas).
- Análise técnica do edital: fonte, raio de cobertura, evidência, **score determinístico**, pendências, lacunas a preencher.
- Monta proposta, planilha, declarações e todo o processo documental.
- Gera **dossiê final** (PDF, HTML, planilha) — equipe só revisa/aprova/corrige (loop de correção).

**Humano faz (Noyce NÃO consegue — confirma `HUMAN_REQUIRED_ACTS`):**
- **Dar lances** — IA não consegue, plataforma bloqueia.
- **Qualquer ação dentro das plataformas** (BLL, Portal de Compras) — bloqueado. Noyce só **puxa** informação, não atua dentro do portal.
- Aprovar/corrigir os documentos gerados.

> Confirma a postura legal do `noyce-source-registry.ts`: descoberta via leitura pública,
> atos vinculantes (lance/declaração/proposta/recurso) sempre com clique humano.

## 2. Fluxo de proposta (regra de negócio confirmada)

- O **modelo de proposta normalmente vem no próprio edital** — às vezes o edital pede um modelo específico, então a ENIAC **adapta**, mas sempre no **papel timbrado** deles.
- **Proposta inicial = valor cheio** da lista. Só **depois da etapa de lance** se manda a **proposta readequada** com o desconto dado nos lances.
- Dado que a ENIAC preenche de fato = **só dados da empresa** (CNPJ, endereço — constantes). O resto do dado vem do certame; Noyce adapta.

## 3. Documentos de habilitação (alimentar o banco de dados)

| Categoria | Documentos | Validade |
|-----------|-----------|----------|
| **Fiscal/trabalhista** | Certidões trabalhista, municipal, estadual, federal, FGTS | Municipal, falência e **FGTS = atualizar todo mês** |
| **Econômico-financeira** | Certidão negativa de falência + **balanços patrimoniais** | **Anual** |
| **Qualificação técnica** | **Atestados / CATs** (reforma → atestado de reforma; construção → de construção) | Conforme acervo |
| **Empresa** | CNPJ, endereço | Constante |

- **GAP declarado pela cliente**: a parte de **qualificação técnica (atestados)** é onde falta dado/cobertura.
- Atestados devem ficar **dentro do sistema** pra alimentar as declarações que o edital pedir.

## 4. Matching semântico de atestados (GAP técnico crítico — NOVO)

- **Problema real**: instituições usam **nomenclaturas diferentes** pro **mesmo serviço** no atestado.
- A cliente perguntou se o sistema consegue **identificar "o mesmo serviço"** mesmo com nome diferente.
- Founder respondeu que **consegue / tem um sistema** pra isso; se a IA não casar direto, há fallback ("emitir um alerta").
- **Implicação Noyce**: o motor de matching de qualificação técnica precisa de **normalização semântica de objeto/serviço** (não match literal de string). Liga ao Service Taxonomy / Motor de Matching do doc 26.

## 5. Extração de documentos — dois modos (NOVO/refinamento)

- A equipe precisa **tudo de uma vez** (no cadastro da proposta manda tudo junto) **E também separado** (às vezes o portal **devolve** um documento e precisa reenviar só aquele).
- **Entrega esperada**:
  - **Dossiê final consolidado**: PDF + HTML + planilha (junta fiscal/trabalhista, qualidade técnica, econômico-financeiro, garantia de proposta, visita técnica, proposta e planilha).
  - **Documentos individuais por categoria**: salvos por licitação específica, baixáveis um a um.

## 6. Descoberta / abas (confirmação + ajustes)

- **Raio atual = 170 km** (founder limitou de propósito pra fechar outras coisas) → **vai expandir** "um pouquinho". Confirma o follow-up de raio 500km do doc de discovery.
- **Mesa** = escala de prioridade: o que tem **mais chance de ganhar** + **mais parecido** com a ENIAC.
- **Monitorar** = todas as outras além das principais.
- Triagem **Vai / Olha / Pula**:
  - **Olha** = identificou problema/mismatch (ex.: **prazo curto**, 26 dias) — categoria de prazo criada com base nas fontes puxadas.
  - **Pula** = mercado **muito concentrado** (concorrente que ganhou mais de uma vez). Puxa **últimos 6 meses** de licitações + empresas vencedoras + dados (ex.: empresa ganhou 2 licitações somando R$30M — uma de R$9M, outra R$5M, outra R$2M), filtrando por **mesmo objeto**. É recomendação; equipe decide se bate o concorrente.
- Licitações exibidas são **reais, abertas, vão acontecer**.

## 7. Consórcio (FEATURE NOVA priorizada pela cliente)

- A ENIAC participa de algumas licitações **em consórcio**.
- Pra consórcio: precisa de **declarações da outra empresa** → adicionar os **dados da empresa parceira** pra já gerar as declarações.
- **Solução do founder (aceita)**: **toggle "com / sem consórcio" antes de abrir a análise**. Com consórcio → sistema entende que há mais uma pessoa envolvida e pede o documental dela.
- **Pedido explícito da cliente**: já na **busca da licitação**, informar **se permite consórcio ou não**.
  - Benefício: olhar direto a **habilitação técnica**; se não dá pra ir sozinho mas permite consórcio, já procurar **empresa parceira**.
  - Founder: "hoje não, mas dá pra colocar essa funcionalidade. Seria interessante." → **backlog NOVO** no discovery: campo `permiteConsorcio`.
- Também: emitir os documentos de consórcio **de uma vez E separados** (item 5).

## 8. Usuários / acesso

- **4 logins / 4 pessoas.** Workspace **compartilhado** (todos veem o trabalho uns dos outros — confirmaram que **não** querem sessões individuais).
- **Aline** = acesso **administrador**. Os outros 3 = login normal.
- **Papéis** (founder quer otimizar a UI por pessoa):
  - **Alice** → proposta + planilhas + análise do **processo final**.
  - **Giovanna** → **busca** + monta as documentações.
- Backlog: views/atalhos otimizados por papel.

## 9. Status real e timeline (dito à cliente)

- Sistema **quase todo pronto**. **Hoje funciona só como buscador** (busca + análise + gera o documento de análise final com frequências de habilitação e dependência de revisão humana).
- **Ainda NÃO gera o workflow completo** (planilha/proposta) — está puxando infos **pré-alimentadas** de **um edital específico**, não conectado ao banco de dados.
- **Pendência única do founder**: montar o **banco de dados** + tornar operacional (conectar) → "aí faz tudo perfeitamente".
- **ETA: máx. 2-3 dias** pra estar no ar com o workflow completo.

## 10. Próximos passos combinados

1. Founder monta o **banco de dados** e conecta (desbloqueia o workflow completo).
2. **Teste real** — rodar numa licitação real pra pegar os primeiros erros/bugs **antes** de apresentar ao decisor.
3. Apresentar ao **"velho/pai"** (decisor) — mas só **depois** do teste, porque ele "vai ter perguntas/objeções mesmo que a equipe não tenha".
4. (Possível) o founder grava/mostra vídeo de funcionamento.

## Backlog NOVO derivado desta reunião

- [ ] **`permiteConsorcio`** no discovery (flag por licitação na busca) + sugestão de parceiro quando não dá solo.
- [ ] **Toggle "com/sem consórcio"** antes da análise → puxa documental da empresa parceira.
- [ ] **Matching semântico de atestados** (mesmo serviço × nomenclatura diferente) + fallback de alerta.
- [ ] **Export de documentos**: modo **consolidado** (PDF/HTML/planilha) **e** modo **individual por categoria** (re-envio pontual).
- [ ] **Expandir raio** além de 170 km (→ 500 km via IBGE haversine).
- [ ] **Banco de dados de habilitação** (vault): certidões com validade mensal/anual, balanços, atestados/CATs, modelos de proposta em papel timbrado, dados de empresas parceiras de consórcio.
- [ ] **4 logins** + perfil **admin (Aline)** + workspace compartilhado + views por papel (Alice/Giovanna).

> ⚠️ Nota: o final do áudio (após ~18min) tem conversa não relacionada (montagem de tampo/mesa)
> — ruído, ignorar. Não é requisito do Noyce.
