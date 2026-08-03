# CONTEXT — Site AIOX

> **Leia este arquivo PRIMEIRO** antes de propor ou implementar qualquer coisa neste projeto.
> Última atualização: 2026-07-26

---

## 1. O que é

Site de divulgação dos serviços do founder. Agência de IA que resolve dor de empresário:
automação de workflow, tráfego pago, arquitetura de sistemas multi-agente. Serviço de
entrada declarado pelo founder: **construção de site**.

## 2. Decisões travadas (26/Jul/2026)

| # | Decisão | Valor |
|---|---|---|
| D1 | Audiência | **Empresários** — donos de PME/indústria brasileira, não-técnicos |
| D2 | Função no funil | **Ambos, prioridade em credencial** — o site fecha a dúvida de quem já foi prospectado |
| D3 | Direção visual | **Produto tech moderno** — dark elegante, gradiente sutil, muito respiro, demos de interface animadas |
| D4 | Serviço de entrada | Construção de site (decisão do founder) |
| D5 | **Modelo de negócio** | **Site é a porta, automação de workflow é o negócio.** Foco declarado: construir e automatizar workflows. Entrada nas empresas via desenvolvimento do site delas (26/Jul) |

**Implicação de D5:** o produto de entrada e o demo são o **mesmo objeto**. Um site com automação
embutida *demonstra* automação de workflow enquanto *é* o produto de entrada. O site do cliente é o
exemplo; o site AIOX é o exemplo do exemplo.

## 3. Restrição declarada pelo founder

> "não quero falar de mim por agora, porque ainda não tenho resultado real"

**Consequência aceita:** o site não terá case com número de cliente, logo de cliente, nem
depoimento. **Regra inegociável derivada:** zero número inventado, zero logo de cliente que
não é cliente, zero depoimento fabricado. NN/g: uma violação de confiança destrói anos de
credibilidade acumulada.

**Saída encontrada (base em pesquisa):** *processo é prova*. O estudo da NN/g sobre sites de
serviço mostra que usuários querem ver **os trabalhadores em ação e todos os estágios**, não só
o resultado final. Logo: em vez de case com número, o site mostra **a máquina funcionando ao
vivo** — workflow rodando, agente qualificando lead, sistema respondendo. Demonstração
substitui case sem mentir.

**Segundo pilar:** se o serviço de entrada é construir site, **o próprio site é o portfólio**.
Produto e prova são a mesma coisa. É a leitura em que "impressionante visualmente" deixa de
ser vaidade e vira função de venda.

## 4. Tensões levantadas e ainda ABERTAS

| # | Tensão | Estado |
|---|---|---|
| T1 | "Prioridade em credencial" + "não falar de mim" é contraditório — credencial é justamente sobre você | Mitigado por demonstração (§3), **não resolvido** |
| T2 | 4 ofertas na porta de entrada lê como freelancer, não especialista | ✅ **RESOLVIDA 26/Jul** — foco = construir/automatizar workflows; porta = site |
| T3 | Construção de site é commodity brutal em 2026 | ✅ **RESOLVIDA 26/Jul** — site com automação embutida sai da categoria commodity |
| ~~T4~~ | ✅ **RESOLVIDA 26/Jul pelo founder:** (a) **nenhum preço no site** — quem decide é ele no momento da venda; (b) **site a R$750**, deliberadamente barato para ganhar os primeiros clientes. Ver `PRICING.md` §5 para os riscos registrados e a alternativa oferecida (reversão de risco no lugar de preço baixo). **Restrição de arquitetura derivada:** o wireframe NÃO tem seção de investimento; a CTA leva a conversa, não a tabela |
| ~~T4-original~~ | 🔴 **PREÇO.** As duas propostas reais da ENIAC declaram literalmente *"não cobro minhas horas de trabalho"*. Noyce = R$3.000 (recuperação de custo) + R$550/mês; Financeiro = R$2.500 + R$200/mês. Preço = sinal de qualidade; cobrar custo por software sob medida **destrói a autoridade que o site deveria construir**, e esvazia o modelo "site é a porta" (a porta leva a um cômodo sem receita) | 🔴 **ABERTA — bloqueia a seção de preço do site** |

## 5. Ativos reais que existem (contra a premissa "não tenho projeto pronto")

O founder afirmou não ter projeto pronto. Levantamento do repositório contradiz:

| Ativo | Estado verificado |
|---|---|
| **Noyce** | Produto completo p/ ENIAC — 6 estágios, app Next rodando, eval gate PASS 20/21, 120+ docs, decks entregues |
| **Anipis** | Closed beta em produção, 20 contas |
| **Contador** | 31 commits, `apps/contador` 16 módulos + 6 packages |
| **ENIAC Financeiro** | Next 16 + Supabase, fases 1–3 completas |
| **Bretda / Tocks** | Meses de operação de tráfego real, auditorias, diagnósticos |
| **AIOS / AIOX** | 25 squads, 253 mentes, 1.345 entidades no registry |

**Conclusão:** o que falta não é projeto, é **case empacotado** (~3-5 dias de trabalho).
Ver `docs/explainers/aios-infraestrutura-cadeia-comando.html` — já é prova de profundidade.

## 6. Regras herdadas que se aplicam aqui

- 🔴 **`.out-of-scope/luxury-redesign-without-benchmark.md`** — REGRA PERMANENTE (4ª falha confirmada):
  qualquer build premium **exige** Phase 0 de coleta de 3-5 referências visuais + comparação
  lado-a-lado ANTES de qualquer brief. Referência não é passo 4, é passo 0.
- 🔴 **`feedback_site_prospector_real_code_photo_gate`** — captura **persistida em `inputs/`**.
  Prosa sobre código é prompt; código é código.
- 🔴 **`feedback_tocks_use_design_tools`** — luxo visual não se coda na mão. Stitch +
  image-studio + 21st/Refero. Founder rejeitou mockup HTML artesanal 3×.
- 🟢 **`reference_forkability_test`** — CSS externo < 30 KB em site complexo = layout JS-driven,
  colapsa sem os bundles. Sondar SEMPRE antes de capturar.
- 🔴 **`feedback_no_hydra_style`** — pesquisa = fontes primárias, nunca agente genérico
  "canalizando clone por nome".

## 7. Estado do plano

| Fase | O quê | Estado |
|---|---|---|
| 0 | Oferta + inventário de prova | 🟡 parcial — D1/D2/D3/D4 travadas, T2/T3 abertas |
| 1a | Research UX/conversão (fontes primárias) | ✅ feito — `01-research/01-ux-conversao-fontes-primarias.md` |
| 1b | Benchmark visual capturado em disco | ✅ feito — 9 sondados, 5 capturados (39 MB) em `02-references/inputs/` |
| 2 | Nome + promessa + estrutura + wireframe | ✅ feito — `03-wireframe/WIREFRAME.md` |
| 3 | Tokens, assets, motion, bibliotecas | ✅ feito — `04-tokens/TOKENS.md` |
| 4 | Build + comparação A/B vs referência | ⚪ pendente |

**D6 (26/Jul):** o nome **AIOX não é usado** neste projeto. Candidatos em `03-wireframe/WIREFRAME.md`
Parte 1 — recomendação: **Contínuo**, alternativa **Turno**. Nome ainda **não fechado**; nenhuma
seção do wireframe depende dele.

⚠️ **A pasta deste projeto ainda se chama `aiox-site` por inércia.** Renomear quando o nome fechar.

## 8. Onde está o quê

```
docs/projects/aiox-site/
├── 00-context/CONTEXT.md          ← este arquivo
├── 01-research/                   ← pesquisa UX, fontes primárias
└── 02-references/
    ├── README.md                  ← log de sondagem + o que extrair de cada ref
    └── inputs/                    ← 39 MB de captura real (DOM + CSS + assets + fontes)
        ├── clerk/ resend/ trigger/ liveblocks/ railway/
```

Ferramenta de captura reusada (não criada): `docs/projects/site-prospector/tools/fork-pipeline/`
(`probe.cjs` → `capture-site.cjs` → `build-fork.cjs` → `shoot.cjs`).
