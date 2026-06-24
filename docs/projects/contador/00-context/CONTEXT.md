# Projeto Contador — CONTEXT (carregar PRIMEIRO)

> Glossário, IDs, sócios, constraints e becos-sem-saída do projeto. Ler antes de propor/implementar qualquer coisa. Reduz re-explicação e evita drift de nomenclatura entre sessões.

**Última atualização:** 2026-06-12
**Fonte de verdade estratégica:** `09-dossie-estrategico.html` (dossiê consolidado) + `05-visao-produto-reuniao-socios.md` (reunião 103 min)
**Fonte de verdade técnica:** `17-arquitetura-core-v1.md` (arquitetura v1.0 FINAL — conclave Fable 2 rodadas, 12/Jun; supersede o doc 11)

---

## 1. A tese em uma frase

SaaS vendido **PARA o escritório contábil** (o canal), que o usa/revende **nos clientes dele**. Núcleo = **apuração DEFENSÁVEL da Reforma** (auditoria cClassTrib/NCM + **trilha de boa-fé** rastreável que protege o escritório da multa de IBS/CBS de ago/2026). O ciclo da nota fiscal (capturar→monitorar→analisar→recuperar) é o meio; o **moat é a defensabilidade**. O contador é distribuição, não o usuário final atacado direto.

> **Posicionamento (revisado pelo conclave 10/Jun):** NÃO "copiloto fiscal da Reforma" (categoria lotada, morre com a recuperação em 2027). É **"a plataforma de apuração defensável da Reforma"** — prova com trilha de boa-fé que a apuração do cliente está certa antes da multa de ago/2026. Recuperação = isca de aquisição, não a categoria. Ver `13-conclave-validacao-features.md`.

## 2. Sociedade

| Sócio | Papel | % | Nota |
|-------|-------|---|------|
| **Investidor** | Recurso + estruturação | 40% | Banca dev ~8 meses, depois monta time comercial |
| **Breno** (founder/usuário desta sessão) | Dev / IA / produto (via AIOS) | 30% | "o problema do dev de IA não é o código, é montar estrutura/roadmap/arquitetura" |
| **Renan** | Comercial / carteira | 30% | 900 clientes em 7 anos na CIEG (ferramenta IRIS). Vendia ~R$600k/mês. Abre portas nas contabilidades. **É o moat de distribuição.** |

## 3. Glossário canônico (usar SEMPRE estes nomes)

| Termo | Definição |
|-------|-----------|
| **Core** | Ciclo da nota fiscal: Captura → Auditoria → e-CAC (Emissão e Restituição orbitam) |
| **Gestorize React Web** (ou "Gestor") | App **real e deployável** herdado da tentativa anterior. NÃO é mockup. Camada de **gestão/obrigações** (degrau #6). Tem 23 features maduras. |
| **Documentize** | Módulo DENTRO do Gestorize que já faz upload de PDFs/imagens + extração de texto/coordenadas + hash perceptual + dedup + identificação de tipo + cria atividades automáticas + ciclo de feedback (`DocumentFeedback`). **É o esqueleto da Captura.** |
| **Captura (#1)** | Varredura automática de notas via **provider de captura** (A1 custodiado pelo provider, D2). Porta de entrada barata. **Seletiva por design**: `captura_ativa` default OFF por CNPJ (COGS ~R$6,35/CNPJ se indiscriminada — conclave 12/Jun). |
| **Auditoria (#2)** | Compara tributação aplicada vs base de referência cClassTrib/NCM. O diferencial. |
| **e-CAC / a mina** | Diagnóstico fiscal em lote via Integra Contador (SERPRO): caixa postal, situação fiscal, CNDs/certidões de toda a carteira. Renan vendia R$8-15k/mês só disso. **É APLICAÇÃO ADICIONAL vendida à parte (add-on), NÃO o core** (D9). Olha a situação fiscal da carteira, não a nota. |
| **Emissor (#4)** | NFS-e Nacional já com tributação correta. Modelo de revenda (contador compra pacote, revende). |
| **Recuperação / Restituição (overlay)** | Monofásico PIS/COFINS retroativo 5 anos. Success-fee. **Gancho, não fundação.** Time-boxed (sunset 2027). |
| **cClassTrib** | Código de Classificação Tributária da Reforma (CBS/IBS). Base de referência da Auditoria. Mesmo NCM pode ter cClassTrib diferente. |
| **Integra Contador** | API oficial SERPRO (homologada, paga por consulta) para acesso e-CAC programático. |
| **Agente local** | `[OBSOLETO — D2 revertida 10/Jun; captura comprada de provider]` Daemon na máquina do escritório que custodiaria o A1. NÃO será construído. |
| **radar-fiscal** | App Next.js em `apps/radar-fiscal` — o módulo OPERACIONAL que construí em 09/Jun. É periferia (camada Gestor), NÃO o core. Ver §6. |

## 4. IDs e caminhos

- **Docs do projeto:** `docs/projects/contador/`
- **App operacional existente:** `apps/radar-fiscal/` (Next 15, seed local, :3007)
- **Mind clones fiscais (criados deste projeto):** `heleno-taveira-torres` (tributário/Reforma), `roberto-dias-duarte` (SPED/Fisco digital), `anderson-hernandes` (gestão/precificação/ICP)
- **Motor Fiscal (projeto irmão):** `docs/research/contabilidade-automacao/` — a Recuperação monofásico é o "M3" de lá
- **Material do Renan recebido (05/Jun):** 2 fluxogramas Gestorize (Operacional + Documentize) + `Comparativo Gestor.xlsx` (23 features Gestor × concorrentes) → sintetizado no doc `06`

## 5. Constraints NÃO-NEGOCIÁVEIS (do conclave)

1. **Humano no loop** em tudo que toca apuração (Roberto/Heleno). IA sugere, contador aprova.
2. **LGPD/certificado by design** desde o schema (Peck/Werner). Decisão-chave: **NÃO custodiamos A1** — captura comprada de provider com DPA + cláusula de operador (D2).
3. **Evaluation antes de escalar** a auditoria (Chip Huyen). Golden-set + observabilidade. Falso-positivo silencioso destrói a confiança do contador.
4. **Nunca prometer** "crédito garantido" nem "apuração correta" (Heleno). Linguagem: *"identifica indícios de crédito potencialmente recuperável"* + disclaimer + parceiro tributarista habilitado.
5. **Recorrente é o ativo**; recuperação é gancho esporádico. Não construir LTV em cima da recuperação.
6. **Nunca descontar** (Campbell: -30% LTV). Entrada barata via valor empacotado, não preço cortado.

## 6. Decisões travadas

- **D1 — Core ≠ greenfield.** O core estende o **Gestorize React Web**, reaproveitando o pipeline Documentize como base do processamento de documento. NÃO começar app novo do zero. (10/Jun)
- **D2 — ~~Certificado no agente local~~ → REVERTIDA pelo conclave (10/Jun, founder aprovou):** captura é **COMPRADA de provider** (PlugNotas/Focus) com **DPA + cláusula de operador (Art. 39 LGPD)** — NÃO construir agente local com A1. Motivo: agente local desarma LGPD mas cria ~500 SPOFs operacionais não-observáveis (resiliência 4/10, Werner). LGPD vira risco contratual transferível. e-CAC usa procuração eletrônica server-side (não precisa do A1 do cliente).
- **D3 — Ponto de partida = PRD + arquitetura ANTES de codar.** (founder, 10/Jun)
- **D4 — Sequência REVISADA pelo conclave (10/Jun, founder aprovou):** **Concierge MVP manual ANTES de construir** (5 escritórios Renan, XML à mão, laudo nos bastidores) → construir o moat (motor + golden-set + trilha) só após pagamento real → comprar captura + monitor e-CAC → recuperação industrializada + emissor. Captura primeiro = vanity validation de commodity. Ver `13` e `14`.
- **D5 — Restituição em dinheiro (RT)** como default, não compensação (PERComp tem risco de multa 150%).
- **D6 — Recuperação = ISCA de aquisição risco-zero, NÃO a fundação.** Contador/tributarista assina a PER/DCOMP; software entrega o dossiê de evidências. Success-fee 15-25% em linha separada, nunca empacotado no recorrente. (conclave 10/Jun)
- **D7 — Value metric = nota fiscal auditada, NÃO faixa de CNPJ.** Tiers por volume; preço transparente na landing. (Campbell, conclave 10/Jun)
- **D8 — Humano no loop é DESIGN.** IA sinaliza, contador assina. Nunca "simular acesso humano" (zona cinza do é-Simples). Golden-set + confidence calibrada ("onde NÃO sei") antes de escalar o motor. (Chip/Heleno, conclave 10/Jun)
- **D9 — e-CAC = APLICAÇÃO ADICIONAL (add-on premium), não o core.** Vendido à parte por cima do core. Diagnóstico em lote da carteira (caixa postal/situação fiscal/CNDs) via Integra Contador. Olha a situação fiscal da carteira, não a nota → produto e bolso separados do core. Categoria lotada (não é diferencial), mas **mina de receita: ~R$2.000/mês de mensalidade no mercado** (dado do founder, 10/Jun) — Renan vendia R$8-15k/mês disso na CIEG. (founder 10/Jun)

## 7. Becos-sem-saída / dead-ends (NÃO revisitar sem gatilho)

- ❌ **Atacar o cliente final direto** — quebra o canal (contador vira inimigo). Conflito de canal é risco MÉDIO aberto (§8).
- ❌ **Construir LTV na recuperação** — esporádica + em sunset (PIS/COFINS morre 2027).
- ❌ **Emissor robusto tipo Conta Azul** — explicitamente fora ("não queremos brigar com gigante de R$1,7bi").
- ❌ **MVP = os 5 módulos** — Ries: começar com o menor experimento (Captura + 1 piloto Renan).
- ❌ **Guardar certificado A1 na nuvem** — bomba LGPD. Resolvido por D2: nem guardamos nem custodiamos; captura comprada de provider.
- ❌ **Agente local com A1** — desarma LGPD mas cria ~500 SPOFs não-observáveis (conclave reverteu, D2). Comprar captura.
- ❌ **Construir captura/core antes de validar pagamento** — vanity validation de commodity (Eric). Concierge MVP primeiro (D4).
- ❌ **Posicionar como "copiloto da Reforma"** — categoria lotada, morre com a recuperação em 2027 (April). É "apuração defensável".
- ❌ **Recuperação como fundação/categoria** — esporádica + sunset 2027. É isca de aquisição (D6).
- ❌ **Cobrar por faixa de CNPJ** — ancora na guerra de preço dos incumbentes (Campbell). Por nota auditada (D7).
- ❌ **Fine-tune próprio pro classificador** — regras+RAG sobre cClassTrib público + base licenciada bastam (Chip). Fine-tune só se saturar o golden-set.
- ❌ **e-CAC em lote como diferencial** — categoria lotada (e-Auditoria/Acessórias/Jettax/Audire/Questor/Alterdata/Infosimples). Usar como infra, não como wedge.
- ❌ **Nuvem Fiscal como provider** — descontinuada 31/jul/2026.
- ❌ **15 layouts NFS-e municipal** — matou a ferramenta antiga; resolvido pela NFS-e Nacional 2026 (surfar a padronização).
- ⚠️ **radar-fiscal como core** — construído como módulo operacional antes do reframe. Rebaixado a camada Gestor; não é o coração.

## 8. Pendências abertas (resolver ANTES de escalar)

1. **Política de canal** — como não virar concorrente do contador (focar Lucro Real/não-Simples? só análise prévia? contador no split?).
2. **Estrutura jurídica da recuperação** — quem protocola o PER/DCOMP; contrato de associação contador+tributarista.
3. **Dependência do Renan** — transformar o comercial em processo replicável (SDR, script, playbook). Ponto único de falha.
4. **Custo Integra Contador no volume real** — validar unit economics da "mina" e-CAC.
5. **Estado deployável do Gestorize** — temos os fluxos e a matriz de features; falta confirmar acesso ao código-fonte deployável (vs só artefatos/specs).

## 9. Janela temporal (a Reforma é o relógio) — RECALIBRADA 22/Jun (pesquisa doc 55)

> ⚠️ O "relógio de agosto/2026" é mais FRACO do que assumíamos para o nicho Simples: cClassTrib/CST do Simples foi **adiado para jan/2027** e a **multa por ausência de IBS/CBS está suspensa no início de 2026**. Os gatilhos REAIS de 2026 são o Emissor (set/2026) e a recuperação monofásico (isca).

- **2026** — CBS 0,9% / IBS 0,1% destacados; **multa IBS/CBS suspensa no início do ano**; Real/Presumido informam cClassTrib (Simples adiado → 2027). NFS-e Nacional obrigatória (LC 214/2025).
- **01/07/2026** — 🪦 API gov de geração de DANFSe descontinuada (NT 008/2026) → DANFSe via gateway.
- **31/07/2026** — 🪦 Nuvem Fiscal desativada (comunicado oficial) → provider = PlugNotas/Focus.
- **01/09/2026** — 🎯 **Simples obrigado a emitir pela NFS-e Nacional** (Res. CGSN 189/2026) = **gatilho de venda do Emissor** (o wedge tempestivo de 2026).
- **jan/2027** — cClassTrib/CST entra para o Simples → a **auto-auditoria cClassTrib ganha urgência** (após Real/Presumido).
- **2027** — 🔴 sunset PIS/COFINS. Fim de geração nova de crédito monofásico; só janela retroativa (a isca).
- **2029–2032** — transição ICMS/ISS → IBS (reclassificação contínua = trabalho recorrente).
- **2033** — IBS pleno, fim da transição.

## 10. Pricing (corredor definido)

- Core empacotado (Captura+Auditoria+e-CAC): **R$200–R$400+/mês**, escala por volume de nota / nº CNPJ.
- Âncoras de mercado: Arquivei/Qive desde R$39,90 (só captura); Nibo R$58–216; Conta Azul R$89,90–249,90.
- Implantação (fee, cobre CAC) + mensalidade (o ativo). Emissor revendido paga a própria assinatura.
- Sem fidelidade (aviso prévio 30-60d). Recuperação: success-fee 1-20% (mercado), dividido com contador.
