# Arquitetura — Core: Ciclo da Nota Fiscal (v0.1)

> ⚠️ **SUPERSEDED (12/Jun/2026):** esta v0.1 foi substituída por **`17-arquitetura-core-v1.md`** (conclave Fable 2 rodadas — ver `16-conclave-arquitetura/09-sintese-conclave.md`). Mantida por histórico. Contém resquícios da decisão de agente local revertida pela D2.

> Arquitetura técnica do core (Captura → Auditoria → e-CAC), com **LGPD/certificado by design**. Normalmente trabalho de @architect + @data-engineer; produzido por Orion ancorado no conclave (Werner Vogels, Chip Huyen, Patrícia Peck) do dossiê.
> **Data:** 2026-06-10 · **Status:** Draft para validação · **Base:** `10-prd-core-ciclo-nota-fiscal.md`, `00-context/CONTEXT.md`

---

## 1. Princípio arquitetural #1 — Comprar a captura, construir o moat (REVISADO pelo conclave 10/Jun)

> ⚠️ **Esta seção foi revertida pelo conclave (Werner, founder aprovou).** A versão anterior punha o A1 num **agente local**. Isso desarma o LGPD mas cria ~500 SPOFs operacionais não-observáveis (máquina desligada, antivírus mata o .exe, A1 vence em silêncio) = resiliência 4/10, num produto de 8 meses de runway sem braço de suporte. **Decisão nova: NÃO custodiar certificado; comprar a captura.**

A regra que define a arquitetura: **gastar os 8 meses no que é irrepetível (o motor de auditoria + a trilha de boa-fé), alugar o que é commodity resolvida (a captura).**

```
┌──────────────────────────────┐      ┌──────────────────────────────┐
│  PROVIDER (PlugNotas/Focus)  │ XML  │  NOSSA NUVEM (multi-tenant)  │
│  • custodia A1 (DPA, operador)│─────▶│  API ingestão → fila         │
│  • NFeDistribuicaoDFe (NSU)  │ +meta│  ⭐ Motor Auditoria (regras+RAG)│
│  • backoff/idempotência      │      │  ⭐ Trilha de boa-fé (imutável)│
│  • manifestação, renovação   │      │  Storage XML (15 anos)       │
└──────────────────────────────┘      │  Confidence + fila humana    │
┌──────────────────────────────┐      │  Observabilidade (heartbeat) │
│  SERPRO Integra Contador     │─────▶│  Gestorize estendido (UI)    │
│  e-CAC via procuração eletr. │      └──────────────────────────────┘
│  (NÃO precisa do A1 do cliente)│
└──────────────────────────────┘
```

- **Captura comprada** com **DPA + cláusula de operador (Art. 39 LGPD)** — o LGPD vira risco contratual transferível (endereçável) em vez de risco operacional distribuído por 500 máquinas que não observamos.
- O provider já resolveu a armadilha NSU do NFeDistribuicaoDFe (bloqueio de 1h do CNPJ), backoff, idempotência, manifestação dos 4 eventos, renovação de certificado e fallback de NFS-e municipal.
- **e-CAC via Integra Contador (SERPRO)** usa **procuração eletrônica** server-side — não precisa do A1 do cliente.
- **Dia 0 (Concierge):** captura = ZERO; XML entra à mão / via upload (Documentize). A captura só vira decisão de build/buy **após** validar que o contador paga pelo laudo (D4). Quando virar, a resposta já é: **alugar**.

## 2. Visão de componentes

| Componente | Responsabilidade | Stack sugerida |
|-----------|------------------|----------------|
| **Captura (provider)** | Custódia A1, varredura SEFAZ/NFS-e, NSU/backoff, manifestação, renovação — **alugada** | PlugNotas/Focus via API + DPA (NÃO construir) |
| **API de ingestão** | Recebe XML+meta do provider, valida schema, idempotência, enfileira | Next.js API routes / serviço Node; fila (ver §5) |
| **Storage XML** | Guardar XML 15 anos, isolado por tenant | Supabase Storage / S3; particionado por escritório→CNPJ→competência |
| **Motor de Auditoria** | Regras + RAG sobre cClassTrib/NCM; gera apontamentos com confiança | Serviço de regras + vetor (RAG); golden-set; sem fine-tune |
| **Conector e-CAC** | Diagnóstico em lote via Integra Contador | Serviço server-side; procuração eletrônica; cache de consultas |
| **Web app (Gestorize estendido)** | UI: carteira, revisão/aprovação de auditoria, painel e-CAC | React/Next (reaproveita Gestorize + Documentize) |
| **Observabilidade** | Métricas de captura, falhas, falso-positivo da auditoria | Logs estruturados + dashboard (Werner: "observe everything") |

## 3. Reaproveitamento do Gestorize / Documentize

O core **estende** o Gestorize React Web (decisão D1). Mapeamento:

| Capacidade do core | Já existe no Gestorize? | Ação |
|--------------------|--------------------------|------|
| Cadastro escritório/clientes/permissões | ✅ (Cadastros) | Reusar |
| Upload + processamento de documento | ✅ (Documentize: extração, hash perceptual, dedup, tipo, feedback) | **Reusar como base da Captura** (modo upload manual) |
| Varredura **ativa** por certificado | ❌ | **Construir** (agente local) |
| Recálculo/auditoria tributária | ❌ | **Construir** (Motor de Auditoria) |
| Diagnóstico e-CAC | ❌ | **Construir** (Integra Contador) |
| Gestão de obrigações/atividades | ✅ (Fluxo Operacional) | Reusar como camada Gestor (Fase 3) |

> O Documentize já tem `DocumentFeedback` (ciclo de feedback melhorando o modelo) — encaixa direto no requisito de **evaluation/golden-set** do Motor de Auditoria. Reusar o loop de feedback existente em vez de criar outro.

## 4. Modelo de dados (esboço multi-tenant)

Isolamento por **escritório** (tenant raiz). RLS em tudo.

```
escritorio (tenant)
  └─ usuario (papel: admin|analista)
  └─ cliente (CNPJ, regime: MEI|Simples|Presumido|Real, perfil setor)
       └─ nota (chave_acesso UNIQUE, tipo: NFe|NFSe|CTe, direcao: compra|venda,
                 competencia, xml_ref, capturada_em, origem: agente|upload)
            └─ item (ncm, cclasstrib_aplicado, tributacao_aplicada)
                 └─ apontamento_auditoria (cclasstrib_referencia, divergencia,
                        confianca, status: pendente|aprovado|rejeitado, revisor, revisado_em)
  └─ certificado_ref (SÓ ponteiro/fingerprint — A1 vive no agente local, nunca aqui)
  └─ ecac_consulta (cnpj, tipo, resultado, custo, consultado_em)
  └─ audit_log (quem, o quê, quando — trilha LGPD)
```

**Regras-chave:**
- `nota.chave_acesso` UNIQUE por tenant → idempotência (nunca duplica).
- `certificado_ref` guarda **fingerprint/validade**, jamais a chave. A presença do A1 é verificada via handshake com o agente local.
- Retenção XML = 15 anos (legal). Tensão com direito de exclusão LGPD (Peck): documentar base legal = **obrigação legal de guarda fiscal** (prevalece sobre exclusão durante o prazo).

## 5. Confiabilidade — "everything fails" (Werner Vogels)

- **Captura/SEFAZ/Integra vão falhar** → toda ingestão passa por **fila com retry e idempotência** (chave de acesso como dedup key). Nota nunca se perde por falha transitória.
- **Backpressure**: 100 clientes × varredura simultânea → rate-limit por tenant + agendamento escalonado.
- **Idempotência ponta-a-ponta**: reenvio do mesmo XML é no-op (UNIQUE + upsert).
- **e-CAC**: cache de consultas (situação fiscal muda devagar) → reduz custo Integra.

## 6. Motor de Auditoria — design (Chip Huyen)

- **Regras + RAG sobre cClassTrib**, não fine-tune. Base de referência (NCM↔cClassTrib) é o **moat** — versionada por competência (mesmo NCM muda de cClassTrib ao longo da transição 2026-2033).
- **Golden-set** de notas rotuladas → mede falso-positivo ANTES de liberar pra carteira real.
- **Confiança por apontamento** + **humano no loop obrigatório** (status pendente→aprovado/rejeitado). A rejeição alimenta o `DocumentFeedback`.
- **Observabilidade**: auditoria que erra em silêncio é o risco — todo apontamento e decisão humana logados; dashboard de taxa de acerto por setor.

## 7. Segurança & LGPD by design (Peck/Schneier)

- A1 fora da nossa nuvem (§1) — custodiado pelo **provider de captura sob DPA/operador**; nunca tocamos a chave.
- TLS provider↔API; tokens de tenant escopados.
- RLS multi-tenant em todas as tabelas; isolamento de storage por tenant.
- Trilha de auditoria (`audit_log`) de todo acesso a dado de cliente.
- DPA com o escritório (somos operador; o escritório é controlador dos dados dos clientes dele).
- Criptografia em repouso (XML) e em trânsito.
- Base legal de retenção (15 anos) documentada; PII minimizada (XML fiscal já é o necessário).

## 8. Decisões em aberto (precisam de validação)

| # | Decisão | Opções | Recomendação |
|---|---------|--------|--------------|
| A1 | Linguagem do agente local | Go (binário único, sem runtime) vs Node/pkg | **Go** se quisermos zero-dependência na máquina do contador; Node se quiser reuso de código com o backend |
| A2 | Fila | Supabase queue / pg-boss vs Redis (Upstash) vs SQS | pg-boss/Supabase no início (menos infra); migrar se escalar |
| A3 | Reuso real do Gestorize | Fork do código vs reescrever Documentize | Depende de §8.3 do CONTEXT (código deployável?) — **bloqueador a confirmar** |
| A4 | RAG store | pgvector (Supabase) vs dedicado | pgvector — fica perto do dado, KISS |

## 9. Riscos técnicos & mitigação

| Risco | Mitigação |
|-------|-----------|
| Fricção de instalar agente local | Instalador um-clique + implantação assistida; fallback upload manual (Documentize) no dia 0 |
| Custo Integra Contador imprevisível | Cache + medir no piloto antes de precificar Fase 2 |
| Base cClassTrib desatualizada | Versionar por competência; fonte (Tecnospeed/Receita) + processo de atualização |
| Falso-positivo destrói confiança | Golden-set + evaluation gate antes de escalar (não-negociável) |

## 10. Spikes recomendados (antes de comprometer a Fase 0)

1. **Concierge MVP (prioridade absoluta)** — 5 escritórios Renan, XML à mão, laudo manual. Valida que o contador PAGA antes de qualquer build. Ver `14`.
2. **Spike Motor de Auditoria** — classificador cClassTrib/NCM (regras+RAG) + montar o **golden-set** inicial rotulado por tributarista. Valida a viabilidade do moat.
3. **Spike Provider de Captura** — testar PlugNotas/Focus (uma carteira de teste) + medir custo/nota + termos de DPA. (Só após sinal verde do Concierge.)
4. **Spike Integra Contador** — uma consulta de situação fiscal real + custo medido.
5. **Spike Gestorize** — confirmar acesso ao código deployável e medir reuso do Documentize.

## 11. Próximos passos

1. Validar este desenho com os sócios (especialmente o agente local — é a aposta de design).
2. Quebrar Fase 0 em stories (@pm/@sm) a partir dos critérios de aceite do PRD §5.
3. Mapa LGPD/segurança v0 formal (@legal-chief/@cyber-chief).
4. Rodar os 3 spikes (§10) — o Spike Captura é o que valida a hipótese técnica do core.
