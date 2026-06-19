# Brainstorm — Superfícies de Ataque da Arquitetura v1.0 (prep do Conclave SOLID)

> **Data:** 2026-06-12 · **Autor:** Orion (aios-master), via skill `brainstorming` adaptada
> **Alvo:** `../17-arquitetura-core-v1.md` (+ schema `../16-conclave-arquitetura/02-data-engineer-schema.md`)
> **Pedido do founder:** conclave com especialistas da área que QUESTIONE TUDO + aplicar SOLID; pesquisar se há metodologia melhor.

---

## 1. Decisão metodológica (da pesquisa)

| Metodologia | O que é | Veredito para este conclave |
|-------------|---------|------------------------------|
| **SOLID** | 5 princípios OOP **nível de classe** (SRP/OCP/LSP/ISP/DIP) | ✅ Aplicar — mas elevado ao nível certo: nas FRONTEIRAS de módulo, não em classe (não há código ainda) |
| **Component Principles** (Uncle Bob, Clean Architecture) | O "SOLID de arquitetura": coesão REP/CCP/CRP + acoplamento ADP/SDP/SAP | ✅ **A lente principal** — é a forma correta de aplicar SOLID a um documento de arquitetura |
| **CUPID** (Dan North) | Contraponto ao SOLID: propriedades, não regras (Composable, Unix philosophy, Predictable, Idiomatic, Domain-based) | ✅ Lente adversarial — onde SOLID burocratiza, CUPID pergunta "isso é alegre de manter?" |
| **ATAM / Lightweight ATAM** (SEI) | Método formal de REVISÃO de arquitetura: cenários de qualidade → pontos de sensibilidade → trade-offs → riscos | ✅ **A "skill melhor" que o founder intuiu** — é a espinha do conclave (mini-ATAM: utility tree + cenários abaixo) |
| SAAM/ARID/PBAR/TARA | Alternativas scenario-based mais leves/antigas | ❌ Subconjuntos do que o mini-ATAM já cobre |

**Kit final: mini-ATAM como processo · Component Principles/SOLID como lente estrutural · CUPID como contraponto.**

## 2. Superfícies de ataque (divergente — tudo pode ser questionado)

### S1 — Fronteiras de módulo (SOLID/Component)
- **CCP/SRP:** "Gestorize estendido" mistura camada Gestão (23 features) com core fiscal no mesmo deploy? Mudança em obrigação/tarefa força redeploy do motor de auditoria?
- **ADP:** há ciclo Gestão↔Core? (Documentize cria atividades na Gestão; Gestão referencia notas do core.)
- **SDP/SAP:** a trilha de boa-fé (o módulo MAIS estável, o moat) depende de módulos voláteis (UI, billing, templates)?
- **DIP/OCP:** motor depende de `ref.base_referencia` concreta ou de port? Novo tipo de insumo (EFD, CT-e) entra sem modificar o pipeline?
- **ISP:** o "laudo" serve 4 consumidores (Demo Kit, Relatório de Valor, export ERP, PDF assinado) — contratos segregados ou um Deus-objeto?

### S2 — Determinismo vs RAG (CUPID-Predictable × o moat) ⭐ suspeita de furo grave
- Laudo DEFENSÁVEL exige reprodutibilidade. O motor é "regras + RAG" — RAG é não-determinístico. A trilha grava a versão da BASE, mas grava a versão do MOTOR/modelo/prompt/embeddings? Reconstituir o laudo em 2031 num auto de infração: dá?
- Camadas de inferência têm proveniência distinta (regra determinística ≠ sugestão RAG), como as "duas classes de insumo" têm?

### S3 — Postgres-only sob estresse (Kleppmann/Vogels)
- OLTP + fila (pgmq) + vetor (pgvector) + ledger append-only no MESMO banco: contenção no pico dia 1-12; backup/PITR vs hash-chain (restaurar backup quebra a cadeia?).
- **Dual-write:** apontamento (mutável) + trilha (append-only) na mesma transação? Sem outbox, webhook do provider pode gravar um sem o outro?
- Idempotência por `chave_acesso`: **NFS-e Nacional tem chave nos mesmos moldes da NF-e?** E recibo/PDF sem chave (Documentize)?

### S4 — Evolução e legado (Fowler)
- Estender Gestorize (React herdado, qualidade desconhecida — Spike 5 pendente) = strangler fig ou abraço de afogado? Plano B se o código for ruim está arquitetado ou é wishful thinking (+30-40% é estimativa, não desenho)?
- Fitness functions: golden-set é a única; existem para acoplamento/fronteiras (ex.: dependency-cruiser como CI)?

### S5 — Multi-tenancy e white-label (segurança estrutural)
- RLS como ÚNICA linha de defesa cross-tenant? White-label estrutural + opacidade de preço via RLS — um bug de policy vaza preço do escritório pro cliente final dele.

### S6 — Acoplamento a terceiros
- Provider (Focus), SERPRO, ACT, base licenciada: 4 dependências externas; adapters isolam mesmo (anti-corruption layer) ou o domínio fala o dialeto do provider?

### S7 — O que NINGUÉM questionou nos 2 conclaves anteriores
- O modular monolith em si (sempre foi premissa, nunca tese defendida).
- O tamanho do dia-0: Demo Kit já puxou UI pro C0 — scope creep do Concierge?
- Time de 1 dev vs superfície total (core + Gestão + add-on + billing + implantação).

## 3. Mini-ATAM — cenários de qualidade (utility tree)

| # | Atributo | Cenário concreto | Resposta esperada da arquitetura |
|---|----------|-------------------|----------------------------------|
| Q1 | **Auditabilidade** ⭐ | Fiscal questiona laudo de 2027 em 2031; reconstituir EXATAMENTE o estado de conhecimento | Bitemporal + ledger + versão de motor/modelo (?) |
| Q2 | Modificabilidade | Trocar Focus→outro provider em 30 dias (descontinuação tipo Nuvem Fiscal) | Adapter neutro; XML bruto nosso |
| Q3 | Modificabilidade | NT muda a tabela cClassTrib na 6ª-feira; segunda tem pico | Reconciliação + monitor de NT |
| Q4 | Performance | Dia 5, 95% dos laudos antes do 1º dia útil, 200 CNPJs × alto SKU | SLA D+1; fila; backpressure |
| Q5 | Segurança | Pen-test cross-tenant; cliente final tenta ver preço do escritório | RLS default-deny + teste |
| Q6 | Custo | Escritório liga captura pra carteira inteira por engano | Guardrail COGS + teto/tenant |
| Q7 | Evolvabilidade | Gestorize código-fonte vem ruim (Spike 5 falha) | Plano B arquitetado? |
| Q8 | Testabilidade | Falso-positivo sobe 2pp após troca de embedding | Golden-set como gate de CI |

## 4. Painel do conclave (especialistas da ÁREA — arquitetura de software)

| Expert | Lente | Por quê |
|--------|-------|---------|
| **uncle-bob-martin** | SOLID + Component Principles + Clean Architecture | Autor do SOLID — o founder pediu SOLID, ele É a fonte |
| **martin-fowler** | Evolutionary architecture, fronteiras, strangler fig, fitness functions | Decide S4 e arbitra monolito modular |
| **martin-kleppmann** | Data-intensive: ledger, dual-write, exactly-once, idempotência | S2/S3 — o moat é um problema de dados |
| **sam-newman** | Modular monolith → fronteiras de serviço, integração com terceiros, deploy | S1/S6 — e carrega o contraponto CUPID (escola Dan North) |
| **kent-beck** | Simplicidade radical, testabilidade, tidy-first, YAGNI | S7 — questiona se a v1.0 não é GRANDE demais pro time de 1 dev |

**Processo (regra do founder — conclave nunca meia-boca):** rodada 1 = 5 agentes Fable independentes c/ DNA + dado ao vivo → rodada 2 adversarial (refutam-se) → síntese com rastreabilidade.

## 5. Produto final

Relatório de findings + lista de patches v1.1 ao doc 17 — **founder ratifica antes de aplicar** (direito de decisão: arquitetura = humano, doc 04). NÃO reescrever o 17 direto.
