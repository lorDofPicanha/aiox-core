---
name: contador-g6-d6-linguagem
description: Constraints G6 (linguagem de boa-fé) e D6 (success-fee) que travam a copy de toda frente jurídica do app Contador — revisão de linguagem
metadata:
  type: project
---

Constraints juridicamente travadas do app Contador (`apps/contador`), fonte: `docs/projects/contador/00-context/CONTEXT.md` §5/D6 e `docs/projects/contador/57-handoff-codex-parcelamento.md` §5/§6.

**G6 (linguagem de boa-fé):** o software SINALIZA risco/oportunidade e SUGERE; nunca adere, regulariza nem promete resultado. Banlist FF-10 é gate (`npm run banlist:g6`). PROIBIDO na UI: "garante/evita cancelamento", "garante o desconto", "reduz a dívida", "regulariza", "economia garantida". Vocabulário permitido: "indício", "potencialmente", "em tese", "sugerimos revisar", "depende de análise".

**D6 (modelo de honorário):** recuperação/transação = isca de aquisição. Contador/tributarista ASSINA; software entrega dossiê. Success-fee 15-25% em LINHA SEPARADA, nunca empacotado no recorrente. Honorário nasce do contrato cliente↔profissional, não da tela.

**D8:** humano no loop é DESIGN. IA sinaliza, profissional assina/adere. Nunca simular acesso humano.

**Transação tributária especificamente:** matéria jurídica reservada, NÃO há API de adesão (PGFN/Regularize manual). Adesão = ato privativo do advogado/tributarista. Software para na triagem.

**Why:** sem isso o produto vira promessa de resultado fiscal (responsabilidade) ou parecer/consultoria não autorizada (ato privativo OAB). Toca a tese de defensabilidade que é o moat do produto.

**How to apply:** ao revisar qualquer copy das frentes `app/transacao`, `app/recuperacao`, `app/parcelamentos` — caçar (a) verbo de conclusão jurídica ("é elegível" → trocar por "tem indício"); (b) número de desconto/economia justaposto ao cliente (ancorar no edital, não no caso); (c) honorário sem origem contratual. Revisão PAR-7 (2026-06-25) achou esses 3 padrões como 🔴/🟡. Persona de revisão: clone Heleno Taveira Torres (`.aios-core/development/agents/heleno-taveira-torres.md`) — fronteira informar-direito-posto vs aconselhar-caso-concreto.
