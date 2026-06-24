# Base de Referencia cClassTrib + Golden-Set Candidato (DRAFT)

> **Status:** DRAFT — pendente de validacao por tributarista humano habilitado (gate da Fase 3).
> **Nao usar em producao nem para acao fiscal sem revisao humana.**

## O que tem aqui

| Arquivo | Conteudo |
|---------|----------|
| `ruleset-cclasstrib-v0-draft.json` | Regua de classificacao cClassTrib/NCM/CST — 10 regras nos segmentos de alto SKU (farmacia, posto de combustivel, mercado/distribuidora de bebidas). |
| `monofasico-ncm-v0-draft.json` | **(A1)** Lista de referencia das FAMILIAS NCM de regime monofasico de PIS/COFINS (combustiveis, bebidas frias, farmaceuticos, cosmeticos/higiene, autopecas, pneus). Alimenta `detectarMonofasico` do motor. Mesmo padrao de gate DRAFT da ruleset: indicio, nao certeza. |
| `st-cest-v0-draft.json` | **(A2)** Lista de referencia dos SEGMENTOS de Substituicao Tributaria de ICMS por prefixo de CEST e/ou NCM (combustiveis, bebidas frias, autopecas, medicamentos, materiais de construcao, cosmeticos/higiene). Alimenta `detectarSubstituicaoTributaria` do motor. Mesmo padrao de gate DRAFT: indicio, nao certeza. Convenio ICMS 142/2018. |
| `golden-set-candidato-v0-draft.json` | Golden-set candidato — 7 fixtures rotulados (item de entrada -> classificacao esperada), seguindo o contrato `docs/projects/contador/47-golden-set-real-fixture-contract-v1.md`. Inclui casos `apontar`, `nao_apontar` e `abster` (disputado/baixa confianca). |

## Origem (quem autorou)

Conteudo autorado pelos **clones de dominio reais** do projeto, engajados via `self-consultation.js` (DNA real dos clones; o agente @data-engineer redige na persona, conforme regra anti-HYDRA do projeto):

- **`heleno-taveira-torres`** — tributario / Reforma (EC 132/2023, LC 214/2025): base normativa, cClassTrib, monofasico, fronteira informacao vs. consultoria, defesa de boa-fe. (consultationId `c70982da-ae92-4798-9d49-e015f7d4dc4a`)
- **`roberto-dias-duarte`** — SPED / Fisco digital: mecanica EFD-Contribuicoes, CST/CSOSN/CFOP, cruzamento de obrigacoes.

Comando usado:
```bash
node .aios-core/core/jarvis/self-consultation.js batch \
  --experts "heleno-taveira-torres,roberto-dias-duarte" \
  --question "<emitir regras concretas cClassTrib/NCM/CST por segmento>" \
  --project contador --agent data-engineer
```
Sem fallback — os dois clones resolveram e carregaram DNA + feed HYDRA ao vivo (ver abaixo).

## Como encaixa no motor

- O bloco `regras` do ruleset e o bloco `motorHarness.base.regras` do golden-set seguem o shape `RegraClassificacao` de `../src/index.ts` (`ncmPrefixo`/`ncmExato`, `cclasstribEsperado`, `tipoDivergencia`, `materialidadeMinima`, `fundamento`).
- As regras sao carregaveis em `ref.cclasstrib_regra` (`packages/contador-db/migrations/001_foundation.sql`): `cclasstrib`, `ncm`, `descricao`, `vigencia` (daterange — usar a `base_versao` vigente no fato gerador), `fundamento` (jsonb).
- **Validado:** o golden-set roda contra o motor compilado (`dist/index.js`) — 7/7 casos coerentes (`apontar` gera apontamento; `nao_apontar`/`abster` ficam silenciosos).

## Proveniencia e linguagem segura (G6)

- Cada regra carrega `fundamento` com base normativa real (lei/IN/NT + data) — alimenta a trilha de boa-fe.
- Onde o clone nao tem base firme, o regime esta marcado `disputado` e a confianca `baixa-disputado` (etanol, GLP, refrigerante, cerveja/Imposto Seletivo, NCM residual 3004.90.99).
- Nenhum texto afirma "credito garantido", "apuracao correta" ou "elimina multa". O conteudo e **indicio/trilha verificavel** sujeito a **revisao humana**.

### Grounding ao vivo (feed HYDRA injetado na consulta, 2026-06-10)
- EFD-Contribuicoes: atualizada a Tabela 4.3.10 (codigos 150-153) para o setor quimico/petroquimico — reforca que as tabelas de CST/codigo sao versionadas e mudam (cuidado com literais).
- Reforma Tributaria: penalidades comecam **2026-08-01** (periodo educativo ate la) — reforca a bitemporalidade do regime na transicao.

## A1 — Deteccao de monofasico (`detectarMonofasico`)

O motor agora detecta o caso monofasico item-a-item: um item cujo NCM e de **familia monofasica** (`monofasico-ncm-v0-draft.json`) mas que foi tributado com **CST PIS/COFINS de regime NORMAL (01/02)** em vez de monofasico (04/05/06) -> indicio de **`credito_potencial`** (PIS/COFINS pago indevidamente na revenda). O inverso (monofasico CORRETAMENTE tributado com CST 04/05/06) **NAO gera apontamento** (sem falso-positivo).

- `detectarMonofasico(item, refMonofasico, contexto)` consome os campos de tributo que o parser ja produz (`recuperacao.pis.cst` / `recuperacao.cofins.cst` + NCM em `ItemFiscalRecuperacao`) — nao inventa entrada nova; aceita o item do parser por subtipagem estrutural.
- A lista monofasico e **DRAFT** (indicio, nao verdade fiscal): familias por prefixo NCM, nao exaustiva, sem fixar cClassTrib literal. NCM residual / familia disputada -> `confiancaBase` baixa -> a confianca calibrada bloqueia auto-aprovacao.

## A2 — Deteccao de ICMS-ST com aliquota/CST divergente (`detectarSubstituicaoTributaria`)

O motor detecta o caso de **Substituicao Tributaria (ST) de ICMS** item-a-item: um item de **segmento ST** (sinalizado pelo **CEST** — `st-cest-v0-draft.json`) mas tributado com **CST/CSOSN de ICMS de regime NORMAL (sem ST)** em vez de ST -> indicio de **`aliquota_divergente`** (ICMS possivelmente recolhido em duplicidade, alem da ST ja retida no elo anterior). O inverso (ST CORRETAMENTE tributada) **NAO gera apontamento**.

- `detectarSubstituicaoTributaria(item, refST, contexto)` consome os campos que o parser **ja produz** — `cst` (mapeado de `item.icms.cst` = **CST OU CSOSN de ICMS**) e `cest` (top-level) em `ItemFiscalRecuperacao`. **Nao foi preciso tocar o parser**: o tipo `ItemComIcms` do motor herda de `ItemFiscal` (que ja tem `cst`/`cfop`) e so adiciona `cest?` opcional (subtipagem estrutural) — o item do parser e atribuivel sem adaptacao.
- **CEST = sinal FORTE de elegibilidade a ST** (o CEST so existe em produto sujeito a ST, Convenio 142/2018). O match por **NCM** e sinal mais fraco (so quando o CEST falta) e **rebaixa a confianca** (`bandaConfianca="baixa"`, `bloqueiaAutoAprovacao=true`) -> empurra para revisao humana.

### Mapa de CST/CSOSN de ICMS usado pela A2

| Codigo | Significado | Efeito na A2 |
|--------|-------------|--------------|
| CST 00/20/40/41/50/90 | Regime NORMAL (sem ST) | **indicio** quando o item e ST |
| CSOSN 101/102/103/400 | Simples sem ST | **indicio** quando o item e ST |
| CST 10/30/60/70 | ST presente / ICMS cobrado por ST | **sem apontamento** (ST resolvida) |
| CSOSN 201/202/203/500/900 | Simples com ST / antecipacao / outros | **sem apontamento** (conservador) |
| CST 51 (diferimento), vazio, fora de tabela | tratamento proprio / desconhecido | **sem apontamento** ("onde NAO sei abstem", §5.3) |

### Guard anti-falso-positivo (substituto na origem — analogo ao F1 do monofasico)

O **substituto tributario na ORIGEM** (industria/importador que **retem** a ST na saida, ou producao propria) e o **ELO CONCENTRADOR**: usa CST 10/30/70 + **CFOP de ST/producao** (`5401/6401`, `5402/6402`, `5403/6403`, `5409/6409`, `5101/6101/7101`, `5109/6109`) **legitimamente**. Esses CFOPs sao **excluidos** (`CFOP_SUBSTITUTO_ORIGEM`) para nao gerar falso-positivo — mesmo que o CST caia por erro num codigo de regime normal, a operacao do substituto **nao** e "ICMS pago em duplicidade na revenda" (e o inicio da cadeia). **CFOP ausente NAO exclui** (o indicio segue, com revisao humana).

### Premissa documentada (limite estadual da ST)

A ST de ICMS e **estadual**: a obrigatoriedade, o MVA e o protocolo/convenio variam por **UF** e por **operacao** (interna vs interestadual). O motor v0 levanta o **indicio** a partir do CEST/NCM + CST, mas **nao confirma** a ST devida no estado concreto (nao temos a UF nem o protocolo do fato gerador no item). Por isso segmentos com forte variacao por UF (ex.: medicamentos) entram como `baixa-disputado` -> a confianca calibrada **bloqueia auto-aprovacao**. O JULGAMENTO fica com o contador humano (CRC).

## A3 — Confianca calibrada (`calcularConfiancaCalibrada`)

A heuristica fixa antiga (0.95/0.82/0.6 por tipo de match) foi substituida por **fatores explicitos combinados**, expostos em `apontamento.fatoresConfianca` (explicabilidade — o numero deriva e fica auditavel na trilha de boa-fe):

| Fator | Efeito |
|-------|--------|
| **especificidade do match** | base maior para `ncm_exato`, menor para `ncm_prefixo`, minima `sem_ncm` |
| **coerencia do CST** | CST incoerente com o regime (= o indicio) reforca a certeza da divergencia |
| **status da regra/lista** | `draft`/`disputado` **penaliza** (sustenta o "onde NAO sei") |
| **materialidade** | item materialmente relevante reforca; irrisorio nao |

**Abstencao "onde NAO sei" (human-in-loop, §5.1/§5.3):** abaixo do `thresholdAutoAprovacao` (default 0.7), o apontamento recebe `bloqueiaAutoAprovacao=true` e `bandaConfianca="baixa"` — ele **NAO some**: vira fila de revisao humana (CRC). A IA nunca decide materia fiscal; sinaliza e o contador assina.

## Limitacao conhecida do motor v0 (deterministico)

O motor v0 casa por NCM (cClassTrib) e por familia monofasica (A1). A confianca calibrada (A3) ja sabe **abster por baixa confianca** (bloqueia auto-aprovacao), mas os literais de cClassTrib e a lista monofasico seguem **DRAFT** — pendem de validacao do tributarista (gate Fase A/A5). O caso `case-farm-003-ncm-residual-abster` (NCM residual) e o caso sintetico `item-mono-005` (familia disputada + valor baixo) documentam a abstencao de proposito.

## O que precisa do tributarista humano para virar "real" (gate Fase 3)

1. **Confirmar os literais de `cClassTrib`** contra a NT/tabela cClassTrib vigente no fato gerador. Varios estao como placeholder (`200001`, `200200`, `200900`) ou `DISPUTADO` — precisam do codigo exato.
2. **Resolver os `disputado`**: etanol (elo da cadeia), GLP (residencial vs industrial), refrigerante/cerveja (Imposto Seletivo — aliquota/incidencia), NCM residual 3004.90.99.
3. **Rotular itens reais** (substituir as fixtures ilustrativas por notas reais pseudonimizadas; `dpaApproved=true`; `rotuladorCrcHash` preenchido com CRC ativo) — gate G4/G5 + autorizacao founder.
4. **Double-label >=20%** (hoje 14%, 1/7) com 2 tributaristas independentes (protocolo doc 24).
5. **Calibrar thresholds** do gate de qualidade (cobertura/acuracia/falso-positivo) com o founder antes do 1o cliente pago.
6. **Validar os segmentos ST (A2) por UF**: confirmar o CEST/segmento contra o Convenio ICMS 142/2018 vigente e os **protocolos/MVAs por UF** do fato gerador (a lista DRAFT levanta indicio nacional; a ST e estadual). Resolver os `disputado` (medicamentos).

Ate la: estes arquivos sao **DRAFT** e a acuracia e **sintetica** — nao vender como acuracia de producao.

## Follow-ups do gate QA (24/Jun) — A1/A3

- **F1 (CORRIGIDO):** a deteccao monofasico agora exclui CFOP de **producao propria/industrializacao** (`CFOP_PRODUCAO_PROPRIA` no `index.ts`) — so a **revenda** gera credito; o elo concentrador (industrial/importador) com CST 01 nao e mais falso-positivo. CFOP ausente nao exclui (indicio segue, com revisao humana). Testes `item-mono-006` (producao, 0 apontamentos) e `item-mono-007` (revenda, aponta).
- **F2 (follow-up tributarista):** prefixos largos da lista DRAFT com risco de over-match — `2207` (etanol: combustivel vs farma/nao-combustivel; herda confianca alta indevida), `3401` (sabao industrial nem sempre monofasico), `8482`/`8483` (rolamentos so sao autopeca quando destinados a autopropulsado), e duplicata `4011`/`4013` entre autopecas e pneus. Rebaixar/separar na validacao do tributarista (gate Fase 3).
- **F3 (follow-up arquitetura):** a banda de confianca e derivada em 2 lugares com cortes diferentes (motor `derivarBanda` <0.7/≥0.85 vs `contador-api-client/mock-client` <0.75/≥0.9). Propagar `bandaConfianca`/`bloqueiaAutoAprovacao` do motor em vez de recomputar no consumidor.
- **Lacunas de teste (follow-up):** PIS≠COFINS (erro parcial de CST), CSTs 73/98/99 (comportamento conservador).
