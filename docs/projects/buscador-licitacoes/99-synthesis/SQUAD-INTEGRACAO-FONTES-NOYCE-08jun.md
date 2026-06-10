# Noyce - Integracao de Fontes sem Vault Validado

Data: 2026-06-08
Projeto: Buscador-Licitacoes / Noyce
Squad: @aios-master, @architect, @data-engineer, @qa, @cyber-chief, @legal-chief

## Veredito Consolidado

Podemos avancar sem Bitwarden/1Password validado, mas somente em dois modos:

1. PNCP automatico publico, somente leitura.
2. BLL, BNC, PCP, ComprasGov autenticado e SISLOG por importacao manual de arquivo baixado por humano autorizado.

Tudo que exige login fica bloqueado ate vault validado, ToS revisado e autorizacao humana formal.

## Permitido Agora

- Ler PNCP por API publica/dados abertos, somente com GET.
- Ler Compras.gov.br por API publica/dados abertos quando houver endpoint oficial aplicavel.
- Importar CSV, HTML salvo, PDF, JSON, XLSX ou TXT trazido manualmente de BLL/BNC/PCP/ComprasGov/SISLOG.
- Calcular SHA-256 do arquivo bruto.
- Normalizar oportunidade para schema canonico.
- Fazer dedupe por hash e chave canonica.
- Rodar triagem, habilitacao e analise ENIAC.
- Registrar proveniencia de campo.
- Processar documentos enviados pela ENIAC, sem inferir PL/indices quando nao extraidos.

## Bloqueado Agora

- Login automatico em qualquer portal.
- Uso de senha, token, cookie, certificado ou 2FA.
- Reuso de sessionStorage/localStorage/cookies.
- Scraping autenticado.
- Bypass de captcha, WAF, 2FA, paywall ou restricao tecnica.
- Download autenticado automatizado.
- Envio de proposta, lance, recurso, impugnacao, declaracao ou mensagem.
- Armazenar segredo em chat, log, `.env`, JSON, fixture ou git.
- Afirmar fraude/direcionamento/ilegalidade como fato; usar apenas sinal de risco para revisao humana.

## Arquitetura Recomendada

Criar `apps/noyce/lib/sources/` com:

- `noyce-source-adapter.ts`: contrato comum das fontes.
- `pncp-public-adapter.ts`: adapter PNCP publico, somente GET.
- `manual-import-adapter.ts`: importador local para BLL/BNC/PCP/ComprasGov/SISLOG.
- `authenticated-source-guard.ts`: bloqueio explicito para fontes autenticadas sem vault/ToS.
- `source-normalizer.ts`: transforma raw/parsed em oportunidade canonica.
- `source-dedupe.ts`: dedupe exato, semantico e possivel duplicidade.

Manter `apps/noyce/lib/noyce-source-registry.ts` como registro operacional de permissao por fonte.

## Pipeline de Dados

Camadas:

1. `raw`: snapshot imutavel da fonte.
2. `parsed`: campos extraidos pelo parser especifico.
3. `canonical`: candidato normalizado unico.
4. `scored`: triagem, habilitacao, suspeicao e pendencias.
5. `decision`: `GO`, `GO_COM_TAREFAS`, `PENDENTE_DADO`, `NO_GO`.

Pastas sugeridas:

```text
apps/noyce/lib/data/sources/
  pncp/
    snapshots/
    parsed/
  manual/
    incoming/
      bll/
      bnc/
      pcp/
      comprasgov/
      sislog/
    snapshots/
    parsed/

apps/noyce/lib/data/candidates/
  canonical/
  rejected/
  duplicates/

apps/noyce/lib/data/quality/
  import-errors/
  field-evidence/
  dedupe-reports/
```

## Campos Obrigatorios de Snapshot

- `snapshotId`
- `source`
- `accessMode`
- `capturedAt`
- `capturedBy`
- `originalFileName`
- `originalUrl`, quando existir
- `contentType`
- `sha256`
- `byteLength`
- `parserVersion`
- `status`

Todo arquivo importado deve ter caminho sanitizado, por exemplo `Downloads/<arquivo>`, nunca `C:\Users\...`.

## Evidencia e Dedupe

Todo campo relevante precisa de evidencia:

- PNCP JSON: `jsonPointer`.
- CSV: coluna.
- HTML: seletor/trecho.
- PDF: pagina e trecho.

Hashing:

- `contentHash`: SHA-256 bruto.
- `normalizedHash`: conteudo limpo.
- `dedupeKey`: `cnpjOrgao|numeroEdital|numeroProcesso|dataAbertura|valorEstimado`.

Fallback de dedupe:

```text
orgao_normalizado|objeto_fingerprint|municipio|uf|dataAbertura
```

Status de duplicidade:

- `exact_duplicate`
- `semantic_duplicate`
- `possible_duplicate`
- `unique`

## Testes Recomendados

Criar:

- `apps/noyce/tests/noyce-pncp-public-readonly.test.mjs`
- `apps/noyce/tests/noyce-auth-source-blocking.test.mjs`
- `apps/noyce/tests/noyce-manual-import.test.mjs`
- `apps/noyce/tests/noyce-source-failure-resilience.test.mjs`
- `apps/noyce/tests/noyce-candidate-dedupe.test.mjs`
- `apps/noyce/tests/noyce-field-evidence.test.mjs`

Gates:

- PNCP so usa chamadas publicas somente leitura.
- Fontes autenticadas retornam `blocked_until_vault`.
- Import manual normaliza sem depender de login.
- Falha de uma fonte nao derruba pipeline.
- Segredos sao bloqueados/redigidos.
- Campo critico sem evidencia vira `PENDENTE_DADO`.

## Texto para Pedir a ENIAC

Pedir para Stafani/Alice exportarem ou salvarem manualmente uma oportunidade de cada portal usado:

- BLL: CSV, HTML salvo ou PDF da oportunidade.
- BNC: CSV, HTML salvo ou PDF.
- PCP: CSV, HTML salvo ou PDF.
- ComprasGov/SISLOG: exportacao ou pagina salva, se usarem.

Nao enviar senha, token, cookie, certificado ou codigo 2FA. Print pode ajudar como evidencia auxiliar, mas nao deve ser fonte principal.

## Proxima Execucao

1. Implementar `sources/*`.
2. Implementar PNCP publico primeiro.
3. Implementar importador manual unico parametrizado por fonte.
4. Implementar dedupe e evidencia de campo.
5. Rodar `npm test`, `npm run typecheck`, `npm run build`.

