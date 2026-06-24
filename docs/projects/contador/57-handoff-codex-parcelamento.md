# 57 — Handoff Codex: Build Frente Parcelamento (consulta + monitor de rescisão + entrega de guia)

> **Autor:** Orion (Claude) · **Data:** 2026-06-24 · **Para:** Codex (motorista de execução)
> **Papel:** briefing executável da frente **Parcelamento** — a "dor crítica da contabilidade" (Renan, reunião 22/Jun) + o whitespace #1 (alerta de rescisão iminente). Mesmo papel do `53-handoff-codex-build-f2.md` para a Fase 2.
> **Fontes de verdade:** `55-feature-research/07-parcelamentos-transacao.md` (pesquisa) · `56-build-plan-paridade.md` (B-eCAC) · `55-feature-research/12-sintese-reuniao-renan-hydra.md` (§1.A, §4) · `00-context/CONTEXT.md` (§5 constraints, D6) · `20-arquitetura-core-v1.1.md` (técnica).
> **Divisão de trabalho (Constituição Art. VII):** Claude planeja/revisa; **Codex executa o build**.

---

## 0. Estado atual (o que JÁ existe — não reconstruir)

- **Módulo sintético `apps/contador/app/parcelamentos/`** (commit `d5ae1804`, 24/Jun) — já entrega a CAMADA DE VALOR com dados sintéticos:
  - `parcelamentos-model.ts` — lógica PURA da **regra de rescisão do Simples** (3 parcelas em atraso = cancela; falta 1 = iminente; 1..limite-2 = atenção; 0 = em dia), `parcelasAteRescisao`, janela de salvamento ~30d, `classificarCarteira`, `resumirCarteira`. PGFN/estadual caem em `manual`.
  - `parcelamentos-data.ts` — seed de 7 clientes cobrindo o espectro de risco.
  - `page.tsx` + `ParcelamentosExplorer.tsx` + `.module.css` — tela com KPIs, faixa "risco de rescisão — revisar primeiro", drill por parcela, ação human-in-loop "sugerir revisão" (só sinaliza).
- **O que falta = o BACKEND real:** trocar o seed sintético por dados reais via adapter, persistir, e fechar o ciclo monitor→alerta→guia.

> **Princípio:** a camada que vale (classificação de risco, alerta de rescisão, monitor, health score) **já está construída e é pura**. O Codex liga as bordas (consulta real + persistência + entrega), NÃO reescreve o `parcelamentos-model.ts` — reusa a função pura.

## 1. Objetivo desta frente

Transformar o módulo sintético em **feature funcional de paridade ≥ mercado** (benchmark: Veri): consulta real de parcelamentos federais de Simples/MEI via Integra Contador, **monitor diário** que reclassifica risco, **alerta proativo de rescisão iminente** (o diferencial) e **emissão da guia (DAS) da parcela**, com tudo registrado na trilha de boa-fé.

## 2. 🔴 PRÉ-REQUISITOS BLOQUEANTES (insumo do founder — sem isto, só [build] anda)

1. **Contrato SERPRO / Integra Contador** + **e-CNPJ** do escritório (auth da API; dispensa A1 do cliente via procuração eletrônica/Autorização de Acesso).
2. **Procuração/Autorização de Acesso** por cliente (a API só consulta quem autorizou).
3. **Fase 2 (Supabase)** para a parte PERSISTIDA (monitor histórico, trilha real). Enquanto não houver, o [build] roda sobre o mock/seed.
4. **(Opcional) Infosimples** — só se for cobrir parcelamento estadual/PGFN por scraping; federal Simples/MEI sai do Integra.
5. **(Entrega de guia Nível 3)** chaves/API do ERP do cliente + **decisão de política de canal** (escritório↔cliente).

## 3. Limites factuais da API (NÃO prometer o que não existe — doc 07)

- ✅ A Integra Contador (SERPRO) cobre parcelamento **federal de Simples/MEI** (sistemas PARCSN/-ESP, PERTSN, RELPSN + 4 MEI): **consulta de parcelas + emissão de DAS da parcela**.
- ❌ **NÃO há adesão/pedido de parcelamento via API** — a adesão segue manual no e-CAC. O sistema orienta, não adere.
- ❌ **PGFN / Transação Tributária / parcelamento PJ Lucro Real-Presumido = SEM API de adesão.** Tratar como **inteligência + gancho de honorário** (modelo D6 da Recuperação), nunca como automação.

## 4. Stories (ordem de ataque)

| Ordem | Story | Tipo | Descrição | DoD |
|---|---|---|---|---|
| **PAR-1** | Contrato de dados do domínio | [build] | Formalizar os tipos do `parcelamentos-model.ts` como contrato estável (entrada/saída do adapter) — o que um provedor precisa devolver para alimentar a classificação de risco | Tipos exportados; o model pura consome do contrato, não do seed |
| **PAR-2** | Adapter ACL Integra-Parcelamento | [adapter] | Cliente para os serviços de parcelamento Simples/MEI (consulta de parcelas/situação). Dialeto SERPRO isolado em `ingestao.*`/adapter (P9); mapeia resposta → contrato PAR-1 | Adapter devolve o contrato; testado contra fixture de resposta SERPRO; 🔒 liga no contrato real quando houver credencial |
| **PAR-3** | Monitor diário + reclassificação | [build] | Job que reconsulta (ou relê o último snapshot) e roda `classificarCarteira`; detecta transições de risco (ex.: entrou em "iminente") | Job idempotente; transição de risco gera evento; sem efeito colateral fora do registrado |
| **PAR-4** | Alerta de rescisão iminente (o diferencial) | [build] | Notificação proativa quando faltam N parcelas para o limite de cancelamento + desconto sob risco + janela de salvamento; entra na Fila do dia do contador | Alerta aparece na fila; linguagem G6 (indício/sugestão, nunca "evita cancelamento") |
| **PAR-5** | Emissão da guia (DAS da parcela) | [adapter] | Gerar o DAS da parcela via Integra; disponibilizar para o contador | DAS gerado a partir do adapter; 🔒 credencial |
| **PAR-6** | Persistência + trilha | [build] | Snapshots de parcelamento e eventos de risco viram nós na trilha de boa-fé real (`core_api_v1`); histórico consultável | Eventos na trilha; verificador valida; depende de Fase 2 |
| **PAR-7** | Radar de transação tributária | [build] | Inteligência (não automação): sinaliza clientes elegíveis a editais de transação/feirão de descontos (ex.: dívida ativa + perfil) como **gancho de honorário** | Lista de oportunidades + disclaimer "tributarista conduz a adesão"; sem prometer resultado |
| **PAR-8** | (Opcional) Estadual/PGFN via Infosimples | [adapter] | Consulta de parcelamento estadual/PGFN onde a Integra não cobre | 🔒 conta Infosimples; marcado "monitoramento" |
| **PAR-9** | (Nível 3) Entrega da guia no ERP do cliente | [adapter] | Lançar a guia no Contas a Pagar do ERP (benchmark Conta Azul↔Domínio) | 🔒 chave ERP + política de canal |

> **Caminho mínimo funcional sem todos os gates:** PAR-1 + PAR-3 + PAR-4 já entregam o diferencial (monitor + alerta) rodando sobre o adapter mockado — demonstrável no MVP. PAR-2/PAR-5 ligam o real quando a credencial SERPRO existir.

## 5. Constraints que NÃO mudam (§5 CONTEXT)

- **Human-in-loop:** o sistema SINALIZA risco e SUGERE revisão; **nunca adere, regulariza ou promete** evitar o cancelamento. A ação é do contador.
- **Linguagem de boa-fé (G6):** "indício de risco de rescisão", "sugerimos revisar", "desconto potencialmente em risco". Banlist (FF-10) é gate. Proibido "evita cancelamento/garante o desconto".
- **Bounded contexts (FF-1):** dialeto do provedor isolado no adapter; o app consome só o contrato/`core_api_v1`. Não vazar payload SERPRO para a UI.
- **Re-verificação ≠ re-execução (P3):** a trilha registra os snapshots e a decisão humana; o verificador checa integridade, não replay.
- **Transação = gancho, não automação** (não há API; risco jurídico se prometer adesão automática).

## 6. Portões — o que NÃO construir aqui

- ❌ **Adesão a parcelamento via API** — não existe; só orientação + DAS da parcela já aderida.
- ❌ **Automatizar transação tributária** — manual no Regularize; tratar como inteligência/honorário.
- ❌ **Reescrever o `parcelamentos-model.ts`** — reusar a função pura já validada.
- ❌ Captura/Auditoria/Emissor reais (frentes próprias, gates próprios).

## 7. Como o Codex deve trabalhar

1. Ler as fontes de verdade do cabeçalho + o `parcelamentos-model.ts` atual.
2. Atacar na ordem da §4; cada story com teste. [build] primeiro (anda sem gate), [adapter] com fixture até a credencial chegar.
3. `npm run typecheck` + `npm run banlist:g6` + `npm run build` verdes a cada story.
4. NÃO fazer git push (founder/@devops). Claude revisa o resultado (gate de qualidade + revisão legal da linguagem com o clone Heleno).

---

*Pendências que travam o real (founder/Renan): contrato SERPRO + e-CNPJ; perfil da carteira (% Simples onde a API ajuda vs PJ/PGFN manual); política de canal para a entrega de guia. Nada disso bloqueia PAR-1/3/4 (o diferencial demonstrável).*
