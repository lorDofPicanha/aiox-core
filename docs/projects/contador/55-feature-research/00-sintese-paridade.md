# 00 — Síntese: Mapa-Mestre de Paridade (6 áreas)

> **Autor:** Orion (Claude) · **Data:** 2026-06-22 · **Base:** pesquisa de mercado real (fontes primárias com URL) nas 6 frentes deste diretório (`01-captura` … `06-gestao`).
> **Objetivo (pedido do founder):** cada ferramenta nossa precisa ter, no mínimo, o nível de funções dos concorrentes — e ser realmente funcional. Este doc cruza: table-stakes do mercado × o que já temos × o gap × buy-vs-build × nosso diferencial.

---

## 1. Scorecard de paridade

| Área | Table-stakes | Cobrimos hoje | Natureza do gap | Estratégia | Nosso diferencial (branco no mercado) |
|---|---|---|---|---|---|
| **Captura** | 12 | ~2 | motor real (NFeDistribuicaoDFe, manifestação, alertas) | **COMPRAR** provider | captura seletiva + trilha |
| **Auditoria** ⭐ | 6 | motor = esqueleto | monofásico/ST não implementados, confiança fixa, golden-set sintético | **CONSTRUIR core + LICENCIAR base de regras** | defensabilidade como categoria + trilha verificável |
| **e-CAC** | 5 | front ✅ / backend ❌ | integração SERPRO+Infosimples, varredura em lote, monitor diário | **COMPRAR** (Integra Contador + Infosimples) | onboarding da Autorização de Acesso + health score |
| **Emissor** | ~7 | demo ✅ | gateway real + cClassTrib real do motor | **COMPRAR** gateway (Focus NFe) | auto-auditoria cClassTrib + revenda B2B2B + trilha |
| **Recuperação** | 6 | apresentação ✅ / fundação ❌ | ingestão, ID monofásico, cálculo SELIC, trilha persistida | **CONSTRUIR** sobre o motor | trilha = defesa STF Tema 736 + risco classificado |
| **Gestão** | 9 | 2 | motor de prazo por tributo, portal+log, persistência | **herdar Gestorize** (não reconstruir) | health score (gestão × e-CAC) |

---

## 2. As 4 conclusões que atravessam TODAS as áreas

### A. O moat se confirmou — e é o mesmo em todas as frentes: **defensabilidade / trilha de boa-fé**
Cada pesquisa, independente, chegou ao mesmo lugar: os concorrentes têm os table-stakes, mas **nenhum** tem (1) trilha criptograficamente verificável por terceiro, (2) risco jurídico classificado por pedido, (3) confiança calibrada "onde NÃO sei". E o achado da Recuperação dá base jurídica concreta: **STF Tema 736 / ADI 4905 — a defesa contra a multa É a proveniência de boa-fé.** A nossa trilha não é enfeite; é o ativo que segura a multa. **Não brigar por feature de commodity; vencer na defensabilidade + na integração entre módulos.**

### B. Comprar o commodity, construir só o moat
- **Comprar:** Captura (provider) · Emissor (Focus NFe) · e-CAC (Integra Contador + Infosimples) · base de regras da Auditoria (licenciar Systax/e-Auditoria, 31M–143M regras — inviável reconstruir).
- **Construir:** a camada de auto-auditoria + confiança calibrada, a **trilha persistida**, a ligação entre módulos, o modelo de revenda. Coerente com a decisão D2.

### C. A Auditoria é a pedra angular — quase tudo depende dela
O motor de auditoria real (monofásico/ST + golden-set + confiança calibrada) **destrava** a auto-auditoria do Emissor, a identificação da Recuperação e a própria tese "defensável". Hoje ele é esqueleto. **É o item de maior alavancagem** — e o que mais depende de insumo externo (tributarista rotulando o golden-set).

### D. A casca está competitiva; o gap é o backend/fundação — em todas as áreas
Construímos a apresentação com honestidade (G6, human-in-loop, trilha na UI). O que falta, área por área, é o **motor real + as integrações** — parte construível agora (motor, trilha), parte travada por contrato externo (provider, SERPRO, ADN, jurídico).

---

## 3. Recalibração de timing (corrige o CONTEXT §9)

Os "relógios" reais, verificados em fontes oficiais:
- **01/09/2026** — Simples obrigado a emitir pela NFS-e Nacional (Res. CGSN 189/2026) → **gatilho de venda do Emissor** (o wedge tempestivo de 2026).
- **cClassTrib / CST para Simples adiado para jan/2027** + multa de IBS/CBS **suspensa no início de 2026** → o "relógio de agosto/2026" para o nicho Simples é **mais fraco** do que assumimos.
- **2027** — sunset PIS/COFINS → recuperação monofásico é a **isca** de maior valor imediato.
- **Dead-ends com data:** Nuvem Fiscal desativada **31/07/2026**; API gov de DANFSe descontinuada **01/07/2026**.

**Implicação:** o wedge de 2026 é **Emissor (set/2026) + Recuperação (isca)**; a auto-auditoria cClassTrib ganha urgência em **2027** (Lucro Real/Presumido primeiro).

---

## 4. Correções factuais a aplicar no nosso material

1. 🔴 **"Cofre 15 anos" está errado** — obrigação da empresa é **5 anos** (CTN); os 11 anos (SINIEF 02/2025) são só para o Fisco. Corrigir em: código `app/captura/`, `CONTEXT.md`, apresentação `54`.
2. 🔴 **Integra Contador NÃO expõe CND** (federal-conjunta/estadual/trabalhista/FGTS) → arquitetura do e-CAC precisa de **2 provedores** (SERPRO + Infosimples).
3. 🟡 **Timing** do CONTEXT §9 conforme §3 acima.
4. ❓ Confirmar com o Renan nomes não achados na web: **GOB** (captura), **C-TAX/CITAX** e **Loara** (recuperação).

---

## 5. Prioridade de build sugerida (para chegar à paridade real)

| Pri | Item | Tipo | Destrava | Bloqueio externo |
|---|---|---|---|---|
| **P0** | Motor de auditoria real (monofásico/ST + base licenciada + confiança calibrada) | construir + licenciar | Emissor, Recuperação, tese defensável | tributarista (golden-set) + licença base |
| **P0** | Trilha persistida ligada a todos os módulos | construir (já existe nos packages) | o moat em todas as telas | nenhum (buildável já) |
| **P1** | Integrações compradas: Integra Contador+Infosimples (e-CAC), Focus NFe (Emissor), provider (Captura) | comprar/integrar | paridade funcional real | contratos (SERPRO/gateway/provider+DPA) |
| **P1** | Recuperação: ingestão + ID monofásico + SELIC sobre o motor | construir | a isca de aquisição | depende do motor (P0) |
| **P2** | Gestão (herdar Gestorize) + health score cross-módulo | herdar + construir | paridade de gestão (não-moat) | código-fonte Gestorize |

> **Tensão com D4:** o P0 (motor) depende do tributarista — o long-pole. Enquanto ele não chega, o caminho honesto é: Concierge manual (validar pagamento) + comprar as integrações que destravam paridade sem o golden-set (Emissor/e-CAC), deixando a auto-auditoria cClassTrib para quando o golden-set existir.

---

*Fontes: ver `01-captura.md` … `06-gestao.md` (cada um com URLs primárias). Confiança: ALTA nas APIs oficiais (SERPRO, portais gov) e datas regulatórias; MÉDIA nos preços de concorrentes opacos.*
