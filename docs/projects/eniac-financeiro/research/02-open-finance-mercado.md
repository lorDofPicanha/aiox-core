# Frente 2 — Open Finance (agregadores) + Mercado PJ

> Data: 2026-06-20 · aios-analyst (Atlas) · Fontes primárias: docs/pricing Pluggy & Belvo,
> blog Pluggy 2026, diretório Open Finance Brasil, Finsiders, comparativos setoriais.
> Minerado interno: docs/projects/contador/{12,06,11,00}.

## Veredito — 3 decisões

### A) Agregador, NÃO virar participante regulado
Fato regulatório duro: só IF/IP/instituições autorizadas BACEN são participantes Open Finance.
ENIAC (grupo industrial) NÃO pode ser receptora sem antes constituir/comprar uma IP autorizada
(**12+ meses**, custo alto, certificação FAPI/DCR). → **Usar agregador.** Confirma e fundamenta
o veredito já registrado no projeto contador ("integrar, não reconstruir Open Finance").

### B) Pluggy = provider primário · Belvo = fallback · camada agnóstica
- **Pluggy (primário):** categorização nativa de extratos + Pix automático/iniciação de pagamento
  + aposta forte na **jornada PJ 2026** (CIBA multi-sócio + JSR PJ a partir de 22/abr/2026) +
  **trial grátis 14d até 20 contas** (prova as 3 empresas sem custo). Basic "a partir de R$2.500/mês".
  TS-nativo (`pluggy-node`, quickstart Vercel, `pluggy-mcp` como tool p/ agentes).
- **Belvo (fallback):** engenharia ótima (webhooks, 12 meses de histórico automático, gestão de
  consentimento) MAS doc não confirma cobertura PJ/boletos/categorização. Floor ~US$1.000/mês.
  ⚠️ Repos OSS do Belvo ficaram **privados** (ver frente 1) → depender só da API/SDK comercial.
- **Klavi:** NÃO (otimizado p/ credit scoring, misfit).
- **Openi:** 2ª opção de avaliação SE o critério virar categorização contábil + conectores ERP
  (PJ explícito + 800+ instituições + categorização). Não publica preço.
- **Arquitetura:** camada de ingestão **AGNÓSTICA via adapter** — trocar provider = trocar adapter.

### C) Diferencial AI-native (whitespace)
- **Consolidação multi-empresa de grupo** (incumbentes são single-empresa empilhado).
- Forecast preditivo de fluxo de caixa.
- Copiloto conversacional.
- **JSR PJ** — pagar de dentro do copiloto.
- Mapa incumbentes: Conta Azul / Omie / Nibo (Conciliador OF forte, foco escritório contábil) /
  Granatum / Tiny — todos deixam **multi-empresa consolidado + IA real** em aberto.

## Contexto regulatório-chave 2026
Open Finance **PJ ainda imaturo** em jun/2026: 154M+ consentimentos ativos, mas **99% são CPFs**.
**JSR PJ + CIBA** (aprovação assíncrona multi-sócio) são o que viabiliza o caso 3-empresas —
critério de seleção nº1, NÃO cobertura bruta de bancos.

## Gaps a confirmar (call comercial / trial)
- Preço por consentimento/conexão real (Pluggy e Belvo só publicam floors: R$2.500 / US$1.000/mês).
- Cobertura PJ real + boletos/recebíveis no Belvo.
- Preços Klavi/Openi/Tecnospeed (nenhum publica).

## Reaproveitado do projeto contador
- Veredito consolidado "integrar Open Finance, não reconstruir".
- Mapa de incumbentes (Conta Azul/Omie/Nibo/Granatum).
- Blueprint "comprar commodity, construir moat" + LGPD-by-design / DPA-operador + fila/idempotência.
