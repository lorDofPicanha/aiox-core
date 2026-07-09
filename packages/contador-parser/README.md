# Contador Parser — Motor A (XML fiscal determinístico)

Parser determinístico de **NF-e** (mod. 55), **NFC-e** (mod. 65), **CT-e** (mod. 57)
e **NFS-e Nacional** (leiaute CGNFS-e, NT 007/2026). Camada de ingestão do
reconhecimento (doc 59). Destrava Auditoria e Recuperação com dado REAL (sai do
seed sintético).

Cobre as stories:

- **R1** — `parseNFe(xml)` → `DocumentoFiscal`: extrai chave de acesso (44 díg),
  modelo, série/número, dhEmi, emitente/destinatário, vNF e, por item (`det`),
  NCM/CEST/CFOP/CST(ou CSOSN)/vProd + tributos PIS/COFINS (CST, vBC, alíquota,
  valor) e `cClassTrib` quando presente.
- **R2** — proveniência leve: `DocumentoFiscal.temAssinatura` detecta o bloco
  XMLDSig (`Signature`/`SignedInfo`). NÃO valida a cadeia ICP-Brasil (story futura).
- **R3** — `paraItensFiscais(doc)` → `ItemFiscalRecuperacao[]`: mapeia para o
  contrato do motor (`@synkra/contador-motor-fiscal` `ItemFiscal`) por subtipagem
  estrutural, preservando PIS/COFINS e marcando `recuperacao.ehMonofasico`
  (CST PIS/COFINS 04/05/06) para a Recuperação.
- **R4** — extensão do Motor A para os demais DF-e que nascem em XML:
  - `parseCTe(xml)` → `DocumentoTransporte` (CT-e mod. 57): chave (44 díg), série/
    número, dhEmi, emitente/tomador/remetente/destinatário, `vTPrest` (valor da
    prestação) e o **ICMS do documento** (CST/CSOSN, vBC, pICMS, vICMS). CT-e é
    frete → relevante para crédito.
  - `parseNFSeNacional(xml)` → `DocumentoServico` (CGNFS-e, NT 007/2026): chave
    (50 díg), prestador/tomador, valor do serviço, código de tributação
    nacional/municipal e os **grupos IBS/CBS** (`cClassTrib`, CST, base, CBS,
    IBS UF+Município) + **PIS/COFINS retido** (grupo `gPISCOFINS`, corrigido pela
    NT 007). É o diferencial tempestivo da Reforma (NFS-e Nacional obrigatória
    para o Simples em 01/09/2026).
  - `parseDocumentoFiscal(xml)` → roteador que detecta o tipo pela raiz do XML e
    despacha para o parser certo (NF-e/NFC-e · CT-e · NFS-e). Tipo não suportado →
    `ParseError("TIPO_NAO_SUPORTADO")`.
  - `paraItensFiscaisCTe(doc)` / `paraItensFiscaisNFSe(doc)` → mapeiam para o
    contrato do motor (`ItemFiscalRecuperacao`). Serviço/frete **não têm NCM**
    (campo ausente, não forçado); a NFS-e leva o `cClassTrib` do IBS/CBS para
    `cclasstribInformado` (base da Auditoria da Reforma).
- **G1** — validação de schema: XML malformado, sem campo obrigatório, ou de tipo/
  modelo não suportado é rejeitado com `ParseError` tipado (`codigo` + `campo`),
  nunca silenciosamente.

## Por que CT-e e NFS-e usam tipos próprios (não `DocumentoFiscal`)

Bounded context (FF-1): o parser entrega entidades tipadas fiéis à semântica de
cada documento — não força tudo num molde de NF-e.

- **CT-e** (`DocumentoTransporte`): não tem itens com NCM/CFOP por produto; tem UM
  serviço de transporte (`vTPrest`) e o ICMS no nível do documento. Forçá-lo em
  `DocumentoFiscal.itens[]` com NCM vazaria semântica falsa.
- **NFS-e** (`DocumentoServico`): serviço não tem NCM (usa código de tributação
  nacional/municipal); o tributo relevante é IBS/CBS + PIS/COFINS retido, não ICMS.

## Regras (constraints)

- TypeScript estrito. Pacote **PURO**: sem rede, sem filesystem em `src/`,
  sem `Date.now()` na lógica.
- XML parseado com `fast-xml-parser` (não regex).
- Bounded context (FF-1): entrega entidades tipadas; não vaza dialeto de
  fornecedor nem o XML cru; não exporta dado para fora.
- Fora de escopo (follow-up): MDF-e (mod. 58), Document AI/OCR (R5+),
  validação da cadeia ICP da assinatura.

## Comandos

```powershell
npm test --workspace @synkra/contador-parser
npm run typecheck --workspace @synkra/contador-parser
```

## Uso

```ts
import { parseNFe, paraItensFiscais } from "@synkra/contador-parser";
import { classificarLote } from "@synkra/contador-motor-fiscal";

const doc = parseNFe(xmlString);          // R1 + R2
const itens = paraItensFiscais(doc);      // R3 → ItemFiscal compatível
const apontamentos = classificarLote(itens, base, contexto); // alimenta Auditoria
```

Roteador (qualquer DF-e suportado):

```ts
import { parseDocumentoFiscal } from "@synkra/contador-parser";

const doc = parseDocumentoFiscal(xmlString); // NF-e/NFC-e | CT-e | NFS-e
// doc.tipo === "transporte" -> DocumentoTransporte (CT-e)
// doc.tipo === "servico"    -> DocumentoServico (NFS-e, grupos IBS/CBS)
// caso contrário            -> DocumentoFiscal (NF-e/NFC-e, doc.modelo "55"/"65")
```

Fixtures sintéticos em `src/__fixtures__/` (NF-e 55, NFC-e 65, item monofásico,
NF-e com namespace prefixado, inválido sem chave, malformado, **CT-e 57 normal**,
**CT-e modelo inválido**, **NFS-e Nacional com IBS/CBS**, **NFS-e chave inválida**).

## Gate QA do R4 (25/Jun) — CONCERNS, 🔴 aplicados

Revisão formal do parser R4 (CT-e + NFS-e IBS/CBS). Focos máximos APROVADOS:
extração IBS/CBS correta campo-a-campo no happy-path; refatoração de `helpers.ts`
sem regressão na NF-e/NFC-e. Os 2 🔴 foram **corrigidos** antes do commit:

- **🔴-1 (resolvido) — perda silenciosa de tributo:** valor de tributo *presente
  porém ilegível* (ex.: `<vCBS>ABC</vCBS>`, `<vICMS>--</vICMS>`) virava `undefined`
  e desaparecia, lido a jusante como "tributo zero". Novo helper
  `paraNumeroOpcionalEstrito` lança `ParseError` nesses casos; usado em todos os
  campos monetários/alíquota de NFS-e e CT-e. Guardas em testes.
- **🔴-2 (resolvido em código; gate externo pendente) — layout do IBS:** a extração
  lia IBS só do split `gIBSUF`/`gIBSMun`; um layout `gIBS` único (ou `vBC` deslocado)
  fazia o IBS evaporar. Agora há **fallback** para `gIBS` único e para `vBC` em
  `gCBS`/`gIBSUF`; e quando há CBS ativa mas nenhum IBS foi extraído de nenhum layout,
  o parser marca `ibsCbs.ibsIndeterminado = true` (revisão humana, não IBS-zero mudo).
  ⏳ **Gate externo:** validar os layouts aceitos contra o **XSD oficial da NFS-e
  Nacional (publicado 12/02/2026)** + fixtures por variante — depende do tributarista/founder.

Follow-ups 🟡 abertos do gate (backlog priorizado): tomador CT-e expedidor/recebedor
(`toma=1/2`) retorna `{}` silencioso (perde crédito de frete); chave provisória DPS sem
validação de formato; cobertura de fixtures (CT-e `toma4`/`ICMSSN`, NFS-e sem IBSCBS — esta
já coberta). Memória de QA: `.claude/agent-memory/aios-qa/project_contador_parser_review.md`.

## Gate QA de 26/Jun (doc 60 / handoff 61) — 🔴-A + 🟡-B/C/D aplicados

- **🔴-A (resolvido):** `extrairPisCofins` da NF-e/NFC-e ainda usava a variante
  não-estrita — `<vPIS>--</vPIS>` evaporava no caminho da Recuperação. Trocado por
  `paraNumeroOpcionalEstrito` + 2 guardas.
- **🟡-B (resolvido):** a guarda `ibsIndeterminado` era assimétrica (só CBS→IBS).
  Agora é **simétrica e coerente com o CST**: um lado presente sem o outro flaga o
  lado ausente (`cbsIndeterminado` novo); sob CST de tributação integral (`000`),
  lado ausente/zerado também vai para revisão — nunca zero mudo. A micro-tabela
  CST→expectativa cobre só `000`; a tabela completa é **gate do tributarista**
  (não inventar regra sem rótulo, doc 46).
- **🟡-C (resolvido):** `extrairIcms` da NF-e agora extrai `vBC`/`pICMS`/`vICMS`
  (estritos), espelhando o CT-e. Ausência de destaque segue legítima (`undefined`).
- **🟡-D (resolvido):** `ItemFiscalRecuperacao` ganhou o portador `icms?` — o ICMS
  do frete (CT-e) e do item (NF-e) sobrevivem ao mapper (crédito de ICMS-frete
  com trilha).
- **🟢-E (agendado):** precisão monetária float — decidir política de arredondamento
  a jusante quando a agregação financeira da Recuperação (C2, doc 56) for construída.
  O parser preserva o bruto (ver "Precisão monetária" acima).

## Limitações conhecidas / follow-ups (gate QA 24/Jun — doc 59)

- **🔴 Precisão monetária:** valores monetários são `number`. Para um campo isolado é
  fiel, mas **somatórios a jusante** (materialidade do laudo, total de crédito) sofrem
  erro de ponto flutuante. Antes de escalar a Recuperação: somar com arredondamento a
  2 casas (ou migrar campos monetários para centavos-inteiros/`string`).
- **🟡 Monofásico por quantidade:** o parser lê PIS/COFINS ad valorem (`pPIS`/`pCOFINS`).
  Combustível e afins usam alíquota **por quantidade** (`qBCProd`/`vAliqProd`) — ainda
  não extraídos. Necessário para calcular o crédito recuperável real desses itens.
- **🟡 Unicidade de `id`:** o `id` do item (`{chave}-{nItem}`) assume `nItem` único.
  Validar/garantir unicidade para preservar a rastreabilidade (G5).
- **🟡 Validação XSD oficial:** G1 hoje valida o schema-de-domínio (campos §2.2 + rejeição
  tipada), não o XSD oficial do Portal NF-e. Hardening em R4/produção.
- **type-fence:** o `ItemFiscal` é replicado estruturalmente (desacopla build). Adicionar
  um teste compile-time que atribua `ItemFiscalRecuperacao` ao `ItemFiscal` real para
  pegar divergência de contrato futura.
