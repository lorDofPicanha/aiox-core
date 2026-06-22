# Base de Referencia cClassTrib + Golden-Set Candidato (DRAFT)

> **Status:** DRAFT — pendente de validacao por tributarista humano habilitado (gate da Fase 3).
> **Nao usar em producao nem para acao fiscal sem revisao humana.**

## O que tem aqui

| Arquivo | Conteudo |
|---------|----------|
| `ruleset-cclasstrib-v0-draft.json` | Regua de classificacao cClassTrib/NCM/CST — 10 regras nos segmentos de alto SKU (farmacia, posto de combustivel, mercado/distribuidora de bebidas). |
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

## Limitacao conhecida do motor v0 (deterministico)

O motor v0 so casa por NCM e compara `cClassTrib`. Ele **nao sabe abster por baixa confianca** — a abstencao (NCM residual, regime disputado) precisa ser tratada pela camada de `banda_confianca`/UI (campo `banda_confianca` em `core.apontamento_auditoria`). O caso `case-farm-003-ncm-residual-abster` documenta essa limitacao de proposito.

## O que precisa do tributarista humano para virar "real" (gate Fase 3)

1. **Confirmar os literais de `cClassTrib`** contra a NT/tabela cClassTrib vigente no fato gerador. Varios estao como placeholder (`200001`, `200200`, `200900`) ou `DISPUTADO` — precisam do codigo exato.
2. **Resolver os `disputado`**: etanol (elo da cadeia), GLP (residencial vs industrial), refrigerante/cerveja (Imposto Seletivo — aliquota/incidencia), NCM residual 3004.90.99.
3. **Rotular itens reais** (substituir as fixtures ilustrativas por notas reais pseudonimizadas; `dpaApproved=true`; `rotuladorCrcHash` preenchido com CRC ativo) — gate G4/G5 + autorizacao founder.
4. **Double-label >=20%** (hoje 14%, 1/7) com 2 tributaristas independentes (protocolo doc 24).
5. **Calibrar thresholds** do gate de qualidade (cobertura/acuracia/falso-positivo) com o founder antes do 1o cliente pago.

Ate la: estes arquivos sao **DRAFT** e a acuracia e **sintetica** — nao vender como acuracia de producao.
