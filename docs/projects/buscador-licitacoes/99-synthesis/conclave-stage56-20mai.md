# Conclave — Stages 5 (Acompanhar/Lances) e 6 (Recorrer)

**Data:** 2026-05-20 · **Engine:** HYDRA real (`self-consultation.js`, consults reais)
**Painel:** Marçal Justen Filho (doutrina) + Joel de Menezes Niebuhr (prática operacional)
**Pergunta:** que micro-momentos da sessão de pregão e do recurso o sistema precisa rastrear, e que avisos dar, para a empresa não perder o direito? Como o software funciona na prática aqui?

> Posições ancoradas na DNA real de cada clone (princípios extraídos de fontes primárias — ver §sources nos arquivos `marcal-justen-filho.md` e `joel-de-menezes-niebuhr.md`).

---

## A linha do tempo do pregão (Niebuhr: "fase → momento → ato")

```
[1] FASE DE LANCES (disputa)              ← rastrear posição em tempo real
        ↓ encerramento da disputa
[2] CLASSIFICAÇÃO PROVISÓRIA              ← declara 1º classificado
        ↓ INVERSÃO DE FASES (Niebuhr)
[3] HABILITAÇÃO só do 1º classificado     ← só agora o dossiê importa
        ↓ resultado (habilitado/inabilitado)
[4] JANELA DE INTENÇÃO DE RECURSO         ← 🔴 PRECLUSÃO — ato NA sessão, minutos
        ↓ (intenção registrada, motivada)
[5] PRAZO DAS RAZÕES (3 dias úteis típ.)  ← drafting do recurso
        ↓ contrarrazões → decisão (sobe à autoridade superior)
```

---

## Posições

### 🏛️ Justen — a base doutrinária do que é contestável
- **Habilitação é teto, não piso** ⇒ no Stage 6, ao analisar o vencedor: ele cumpriu requisito legal? O edital exigiu **além** da lei (vício do próprio edital)? São dois fundamentos distintos de recurso/impugnação.
- **Repressão ao formalismo vazio** ⇒ defeito meramente formal **não** justifica afastamento. Recurso baseado só em formalidade tende a falhar.
- **Vinculação ao edital / julgamento objetivo** ⇒ o recurso se mede contra o edital + a lei, não contra "achismo".
- **Maior autonomia = maior responsabilidade** ⇒ a 14.133 formaliza contraditório e ampla defesa: o direito de recorrer é estruturado, e o sistema deve protegê-lo.

### ⚖️ Niebuhr — a mecânica operacional (o ouro para Stage 5/6)
- **Inversão de fases é a chave** ⇒ lance primeiro; habilitação só do 1º classificado, por último. O dossiê completo **só fica urgente quando você é o vencedor provisório** — antes disso, é lance.
- **O momento processual decide** ⇒ a **intenção de recorrer é ato NA sessão, no momento aberto pelo pregoeiro**. Perdeu o momento = **preclusão**. (É exatamente a dor #1 — e é em minutos.)
- **Intenção ≠ recurso** ⇒ dois atos distintos: (a) manifestar a intenção (na sessão, ato quase binário/motivado em síntese) e (b) apresentar as razões no prazo.
- **Recurso ≠ pedido de reconsideração** (citação literal, livro p.393) ⇒ o recurso sobe à **autoridade superior**; não é reconsideração ao pregoeiro. O sistema não pode rotular errado.
- **Poder-dever de diligência** ⇒ diante de dúvida sanável, o pregoeiro **tem o dever** de diligenciar antes de inabilitar. ⇒ se a empresa for inabilitada por defeito sanável, há fundamento de recurso (faltou diligência).
- **Empate ficto sobre a proposta vencedora regular** (faixa 5%, LC 123) ⇒ se a empresa é ME/EPP e está dentro de 5% do melhor lance não-ME/EPP, tem **direito de preferência** para cobrir.

---

## CONSENSO
- **O SLA de notificação é governado pela janela de preclusão** (Niebuhr) — o aviso da intenção de recurso é o evento mais crítico do sistema, em **segundos/minutos**. (Justen concorda: o direito de recorrer é estruturado e deve ser protegido.)
- **Dois artefatos distintos:** Alerta da **intenção** (na sessão, imediato) vs. apoio às **razões** (no prazo, dias). Nunca tratar como um só.
- **O recurso precisa ser enquadrado certo** (sobe à autoridade superior; não é reconsideração).
- **Inversão de fases** reordena o trabalho: dossiê de habilitação só vira urgente ao virar 1º classificado.

## DISSENSO / nuance crítica
- **Quando recomendar recurso analisando o vencedor.** Justen ("habilitação é teto") identifica falha **substantiva** de habilitação = recurso forte. Niebuhr ("formalismo moderado + poder-dever de diligência") alerta: muitos defeitos do vencedor são **sanáveis** → recurso baseado neles tende a **falhar** (e o pregoeiro deveria diligenciar). ⇒ O sistema **não pode mandar recorrer de qualquer defeito** — precisa **classificar**: falha substantiva (recurso forte) vs. formalidade sanável (recurso fraco / provável diligência). Protege a empresa de gastar o recurso e de receber conselho errado.

## PONTOS CEGOS
1. **Mecânica da intenção varia por plataforma.** O botão/momento de "manifestar intenção" muda entre BLL, BNC, SISLOG, PCP, PNCP-Compras. O monitor de sessão precisa conhecer cada UI/timing (dependência do adapter — ver Pablo Hoffman).
2. **Recurso protelatório tem custo** (credibilidade/possível penalização). Não auto-recomendar recurso em fundamento fraco.
3. **Inversão de fases evita desperdício de LLM:** não habilitar/parsear tudo antes do lance — só ao virar vencedor provisório.

## VEREDITO — requisitos do sistema para Stage 5/6
1. **Máquina de estados da sessão, por plataforma:** lances → encerramento → vencedor provisório → habilitação → janela de intenção → razões. O sistema sempre sabe em que estado está.
2. **🔴 Alerta A (preclusão, na sessão, segundos):** *"Janela de intenção de recurso ABERTA — manifeste AGORA (ato, não as razões)."* Push de prioridade máxima (WhatsApp + in-app). **Isto resolve a dor #1 do jeito certo.**
3. **Alerta B (razões, deadline):** countdown do prazo (3 dias úteis típ.) + apoio à redação.
4. **Gatilho vencedor-provisório (inversão de fases):** ao virar 1º classificado → surge o **dossiê de habilitação por-edital** na hora.
5. **Gatilho perdedor:** quando NÃO vence → varre a habilitação do vencedor e **classifica**: falha substantiva ("teto" → recurso forte) vs. formalidade sanável ("formalismo moderado" → fraco/diligência). Recomenda recurso **só** no substantivo; marca o sanável como baixa probabilidade.
6. **Enquadramento do recurso:** minuta endereçada à **autoridade superior** (não reconsideração ao pregoeiro).
7. **Alerta de empate ficto (se ME/EPP):** durante os lances, dentro de 5% → *"você tem preferência, pode cobrir."*
8. **Adapter de sessão por plataforma** conhece a mecânica de "manifestar intenção" de cada portal (dependência Pablo Hoffman).

---

*Conclave conduzido por aios-master. Justen + Niebuhr = doutrina + prática, fundamentados em fontes primárias reais.*
