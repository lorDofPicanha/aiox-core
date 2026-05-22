# Tocks T3 — LP `/arquitetos` + Spec Book PDF

**Data:** 12/Mai/2026
**Origem:** HYDRA Tocks tactic T3 (Specifier Program)
**Owner:** @ux-design-expert + @dev (LP) + @copy (Spec Book) + @design (PDF)
**Prazo:** D+5 (17/Mai)
**Fonte HYDRA:** #75 LareAmbiente Comissão Arquitetos 10% + #90 Líder Interiores Casacor + #142 Hormozi Value Equation

---

## Por que isto importa (Tocks-específico)

P1 persona high-ticket BR é **arquiteto/decorador** (canal mais barato + maior LTV — consensus 08-Mai HYDRA squad). Tocks tem catálogo multi-categoria (mesa jantar Monaco + sinuca Vértice/Elipse + futuro) → arquiteto projeta sala+jantar+lazer integrados, NÃO só sinuca.

Bretda também tem isso no plano mas LP form bloqueador. Tocks pode lançar PRIMEIRO porque já tem Sales AI deployed = handoff automático specifier → vendedor.

CAC arquiteto esperado: R$300-500. LTV via projeto fechado: R$15-30k (mesa + ambiente). LTV:CAC ≈ 30-100×.

---

## Landing Page `tocks.com.br/arquitetos`

### Estrutura (1 página, scroll vertical)

**Hero (above-the-fold)**
- Headline: *"Para Arquitetos e Decoradores: Tocks como specifier-friendly"*
- Subhead: *"Catálogo técnico, comissão 10%, suporte 1:1 durante o projeto. Heritage 26 anos Itajaí-SC."*
- CTA primário: `[Receber Spec Book + Acessar Programa]` → formulário
- Foto: bastidores atelier Itajaí (mãos artesão lixando madeira)

**Section 2 — O que é o Programa**
- 3 pilares (cards horizontal):
  1. **Comissão 10%** sobre venda fechada (padrão LareAmbiente BR)
  2. **Spec Book completo** — dimensões, materiais, blocos 3D Revit/SketchUp (futuro D+30)
  3. **Atendimento 1:1** — designer Tocks acompanha do projeto à entrega

**Section 3 — Catálogo (galeria)**
- 6 cards: Monaco (dual-purpose) / Vértice (sinuca angular) / Elipse (sinuca art-déco) / Tenro (jantar luxo) / Gabe (NE) / Custom
- Cada card: foto + preço from + "Pedir spec técnica"

**Section 4 — Trust**
- "26 anos Itajaí-SC" + "produção sob encomenda" + "5 anos garantia"
- Mapa BR mostrando entregas (sem nomes — privacidade clients)
- 1 testimonial arquiteto real (se houver — senão omit, NÃO inventar)

**Section 5 — Formulário (CTA único repetido)**
- Campos: Nome / CAU ou CRECI / Cidade / E-mail / WhatsApp / "Em qual projeto Tocks pode ajudar?"
- Submit → cria registro em Sales AI com tag `specifier-program` → e-mail automático com PDF + WhatsApp opt-in

### Tracking
- Pixel Meta `1382948639707224` PageView + Lead (form submit)
- Google Conversion Action `Lead Qualificado Tocks` (7550396040) — value R$13k default
- GA4 evento `specifier_signup`
- UTM convention obrigatória se vir de paid: `meta-c008-arquitetos` ou `google-search-arquitetos`

### Tech
- Stack: tocks-website Next.js existente (apps/tocks-website)
- Rota nova: `/arquitetos/page.tsx`
- Form action: `/api/specifier-signup` POST → Sales AI webhook + Klaviyo/RD list "Arquitetos"
- Mobile-first (P1 acessa de iPhone/iPad)

---

## Spec Book PDF (16 páginas, A4 paisagem)

### Estrutura editorial (modelo Hermès/Bottega editorial)

**Capa**
- Foto Casacor-vibe + tipografia Libre Caslon Text + "Tocks · Spec Book 2026"

**Página 2-3 — Manifesto 26 anos**
- História Itajaí-SC desde 1998 (verificável — NÃO inventar dados)
- Filosofia: "Móvel artesanal não é móvel decorado. É móvel projetado para virar herança."
- Foto atelier (real, não stock)

**Página 4-5 — Mesa Monaco (dual-purpose jantar+sinuca)**
- Render técnico + foto ambiente
- Dimensões + materiais + preço from R$13k
- "Quando especificar Monaco: ambiente integrado, cliente quer mesa de jantar premium que também serve para entretenimento"

**Página 6-7 — Mesa Vértice (sinuca angular, R$15.990)**
- Idem estrutura
- Diferencial: design statement / Donald Judd geometric reference

**Página 8-9 — Mesa Elipse (sinuca art-déco, R$19.900)**
- Idem
- Diferencial: heritage piece, base dourada, lã italiana

**Página 10-11 — Especificações técnicas (universal)**
- Madeiras: 4 opções (Nogueira americana / Ipê champagne / Cumaru / Custom)
- Lãs italianas: 15 cores Simonis/Mac Wool (paleta)
- Acabamentos: matte / satin / high-gloss
- Caçapas e bronzes: 3 acabamentos
- Garantia: 5 anos estrutura, 1 ano feltro (verificar dado no atelier antes!)

**Página 12 — Trade Program (Comissão Arquitetos)**
- Como funciona: cadastro → projeto → fechamento → comissão 10% líquida
- Pagamento: PIX em D+5 da entrega da mesa
- Critérios: CAU/CRECI ativo + 1 projeto fechado em 90d valida cadastro

**Página 13 — Processo de Produção**
- Timeline 60-90 dias sob encomenda (verificável)
- 4 etapas: design briefing → marcenaria → acabamento → entrega+instalação
- Foto cada etapa

**Página 14 — FAQ**
- Q1: Posso visitar o atelier? Sim, agendamento via WhatsApp
- Q2: Custo do frete? Incluso em SP/RJ/MG/ES/PR/SC/RS — orçamento custom outros
- Q3: Garantia cobre desgaste do feltro? Não, feltro tem 1 ano. Substituição custa R$1.5-3k em 5-8 anos típico.
- Q4: É possível customizar? Sim — materiais, dimensões. Não — fugir do design canônico.
- Q5: Comissão sobre venda total ou só mesa? Total (inclui frete e custom).

**Página 15 — Contato**
- WhatsApp dedicado specifier: `+55 47 9XXXX-XXXX` (criar nova linha se não tiver)
- E-mail: arquitetos@tocks.com.br
- Showroom Itajaí endereço + agendamento

**Página 16 — Verso editorial**
- Foto detalhe mesa (textura) + frase "Cada mesa Tocks começa em uma conversa."

### Tech PDF
- InDesign template (NÃO Canva)
- Fontes: Libre Caslon Text (titulos) + Poppins (corpo)
- Cores: paleta Tocks oficial (verificar brand book)
- Export: PDF/X-4 para print + PDF web optimized (<5MB)
- Print run: 100 cópias offset (~R$1.5k) para Casacor + outbound físico arquitetos
- Web: hosted em `tocks.com.br/spec-book.pdf` (link no LP form download)

---

## Distribuição

1. **Orgânica**: LP `/arquitetos` indexed Google + Instagram link bio
2. **Outbound físico**: 100 PDFs offset → 30 arquitetos top SP/RJ (Studio Guilherme Torres, Triplex, etc — pesquisar)
3. **Casacor SP 2026** (T4): 50 PDFs no stand (se Tocks conseguir patrocínio/comodato)
4. **Paid Meta C008** (próxima sem): adset arquitetos profissional R$30/d → LP

---

## Métricas D+30

- **LP `/arquitetos`**: 200+ signups
- **Spec Book downloads**: 150+
- **Specifier signups validados (CAU/CRECI ok)**: 50+
- **Specifier ativos (1 projeto em pipeline)**: 10+
- **Fechamento via specifier D+90**: 2-5 vendas (R$30-100k receita)

---

## Bloqueadores reais

- @dev disponibilidade tocks-website (apps/tocks-website status atual?)
- Brand book Tocks oficial (fontes/cores) — confirmar
- WhatsApp Business linha dedicada specifier (custo R$0-50/mês)
- 1 arquiteto real para testimonial (orgânico ou ofereçer comodato testar) — NÃO inventar
- Verificação dados antelier: garantia 5y, prazo 60-90d, materiais reais (NÃO assumir — HYDRA squad já tirou claims não-verificáveis na v1 C007)
