/**
 * Motor A (R4) — parser determinístico da NFS-e Nacional (leiaute CGNFS-e,
 * NT 007/2026; XSD nacional publicado 12/02/2026).
 *
 * Diferencial tempestivo (Reforma): substitui o inferno dos ~15 layouts
 * municipais por UM leiaute nacional e introduz os grupos IBS/CBS (grupo
 * `IBSCBS`) + corrige a declaração de PIS/COFINS retido. Sem ler esses grupos,
 * a Auditoria da Reforma fica cega em serviços.
 *
 * Entrega `DocumentoServico` (tipo próprio): serviço não tem itens com NCM; o
 * tributo relevante é IBS/CBS + PIS/COFINS retido, não ICMS (FF-1).
 *
 * Estrutura: a NFS-e processada é `NFSe/infNFSe`, que embute a DPS de origem
 * (`DPS/infDPS`). Também aceitamos uma DPS isolada (`DPS/infDPS`). Reusa helpers.
 */
import {
  asString,
  asStringObrigatorio,
  criarXmlParser,
  detectarAssinatura,
  extrairParte,
  obj,
  parseXmlBruto,
  paraNumero,
  paraNumeroOpcional,
  paraNumeroOpcionalEstrito
} from "./helpers";
import {
  DocumentoServico,
  ItemServico,
  ParseError,
  TributoIbsCbs,
  TributoPisCofins
} from "./types";

const parser = criarXmlParser(new Set());

/**
 * Parseia uma NFS-e Nacional (leiaute CGNFS-e) e retorna o documento de serviço.
 * @throws {ParseError} para XML malformado, estrutura inválida, campo obrigatório
 *         ausente ou chave de acesso inválida.
 */
export function parseNFSeNacional(xml: string): DocumentoServico {
  const raiz = parseXmlBruto(parser, xml);

  const { infNFSe, infDPS } = localizarNfse(raiz);

  const chaveAcesso = extrairChaveAcessoNfse(infNFSe, infDPS);
  const numero = extrairNumero(infNFSe, infDPS);
  const dataEmissao = extrairDataEmissao(infNFSe, infDPS);

  const prestador = extrairPrestador(infNFSe, infDPS);
  const tomador = extrairParteOpcional(localizarBloco(infNFSe, infDPS, "toma"), "toma");

  const item = extrairItemServico(infNFSe, infDPS);
  const valorServico = item.valorServico;

  const temAssinatura = detectarAssinatura([
    raiz.NFSe as Record<string, unknown> | undefined,
    infNFSe,
    infDPS,
    raiz
  ]);

  return {
    tipo: "servico",
    chaveAcesso,
    modelo: "NFSe",
    numero,
    dataEmissao,
    prestador,
    tomador,
    valorServico,
    itens: [item],
    temAssinatura
  };
}

// ---------------------------------------------------------------------------
// Localização de nós
// ---------------------------------------------------------------------------

interface NosNfse {
  /** infNFSe (nota processada) — pode ser undefined se só veio a DPS. */
  infNFSe?: Record<string, unknown>;
  /** infDPS (declaração de origem) — pode ser undefined se só veio a infNFSe. */
  infDPS?: Record<string, unknown>;
}

/**
 * Localiza infNFSe e/ou infDPS. Aceita:
 *  - NFSe/infNFSe (com DPS/infDPS embutida) — formato da nota emitida;
 *  - DPS/infDPS isolada — declaração antes do processamento.
 * Exige ao menos um dos dois.
 */
function localizarNfse(raiz: Record<string, unknown>): NosNfse {
  const nfseContainer = raiz.NFSe as Record<string, unknown> | undefined;
  const infNFSe = (nfseContainer?.infNFSe ?? raiz.infNFSe) as
    | Record<string, unknown>
    | undefined;

  // DPS embutida na infNFSe, ou DPS isolada na raiz.
  const dpsContainer = (infNFSe?.DPS ?? raiz.DPS) as Record<string, unknown> | undefined;
  const infDPS = (dpsContainer?.infDPS ?? raiz.infDPS) as
    | Record<string, unknown>
    | undefined;

  if (!infNFSe && !infDPS) {
    throw new ParseError(
      "ESTRUTURA_INVALIDA",
      "Documento NFS-e Nacional invalido (esperado NFSe/infNFSe ou DPS/infDPS).",
      "infNFSe"
    );
  }
  return {
    ...(infNFSe ? { infNFSe } : {}),
    ...(infDPS ? { infDPS } : {})
  };
}

/** Resolve um bloco preferindo a infNFSe e caindo para a infDPS. */
function localizarBloco(
  infNFSe: Record<string, unknown> | undefined,
  infDPS: Record<string, unknown> | undefined,
  nome: string
): unknown {
  return infNFSe?.[nome] ?? infDPS?.[nome];
}

/**
 * Chave de acesso da NFS-e Nacional: `infNFSe/@Id` (ou `chNFSe`), 50 dígitos.
 * Se só houver a DPS, ainda não há chave (a chave nasce no processamento) —
 * usa o Id da DPS como identificador rastreável (validado por presença).
 */
function extrairChaveAcessoNfse(
  infNFSe: Record<string, unknown> | undefined,
  infDPS: Record<string, unknown> | undefined
): string {
  if (infNFSe) {
    const id =
      asString(infNFSe["@_Id"]) ?? asString(infNFSe.chNFSe) ?? asString(infNFSe.nNFSe);
    const chave = (id ?? "").replace(/^NFS?e/i, "").replace(/\D/g, "");
    if (!chave) {
      throw new ParseError(
        "CAMPO_OBRIGATORIO_AUSENTE",
        "infNFSe sem @Id/chNFSe (chave de acesso da NFS-e).",
        "infNFSe/@Id"
      );
    }
    if (chave.length !== 50) {
      throw new ParseError(
        "CHAVE_ACESSO_INVALIDA",
        `Chave de acesso da NFS-e Nacional deve ter 50 digitos, encontrado ${chave.length}.`,
        "infNFSe/@Id"
      );
    }
    return chave;
  }
  // Só DPS: identificador da declaração (não há chNFSe ainda).
  const idDps = asString(infDPS?.["@_Id"]);
  if (!idDps) {
    throw new ParseError(
      "CAMPO_OBRIGATORIO_AUSENTE",
      "infDPS sem @Id (identificador da declaracao).",
      "infDPS/@Id"
    );
  }
  return idDps.replace(/^DPS/i, "");
}

function extrairNumero(
  infNFSe: Record<string, unknown> | undefined,
  infDPS: Record<string, unknown> | undefined
): string {
  const numero = asString(infNFSe?.nNFSe) ?? asString(infDPS?.nDPS);
  if (numero === undefined) {
    throw new ParseError(
      "CAMPO_OBRIGATORIO_AUSENTE",
      "Numero da NFS-e ausente (nNFSe / nDPS).",
      "nNFSe"
    );
  }
  return numero;
}

function extrairDataEmissao(
  infNFSe: Record<string, unknown> | undefined,
  infDPS: Record<string, unknown> | undefined
): string {
  const data =
    asString(infNFSe?.dhProc) ?? asString(infDPS?.dhEmi) ?? asString(infNFSe?.dhEmi);
  if (data === undefined) {
    throw new ParseError(
      "CAMPO_OBRIGATORIO_AUSENTE",
      "Data de emissao/processamento ausente (dhProc / dhEmi).",
      "dhProc"
    );
  }
  return data;
}

/**
 * Prestador: na infNFSe é `emit`; na DPS é `prest`. Obrigatório (precisa de
 * CNPJ/CPF para classificar o papel do tenant).
 */
function extrairPrestador(
  infNFSe: Record<string, unknown> | undefined,
  infDPS: Record<string, unknown> | undefined
): ReturnType<typeof extrairParte> {
  const no = infNFSe?.emit ?? infDPS?.prest;
  return extrairParte(no, "emit/prest", true);
}

function extrairParteOpcional(
  no: unknown,
  caminho: string
): ReturnType<typeof extrairParte> {
  return extrairParte(no, caminho, false);
}

// ---------------------------------------------------------------------------
// Item de serviço + tributos
// ---------------------------------------------------------------------------

/**
 * Extrai o (único) serviço. Descrição em `serv/cServ/xDescServ`; valor em
 * `valores/vServPrest/vServ` (ou `serv/vServ`). Anexa PIS/COFINS retido e o
 * grupo IBS/CBS da Reforma.
 */
function extrairItemServico(
  infNFSe: Record<string, unknown> | undefined,
  infDPS: Record<string, unknown> | undefined
): ItemServico {
  const serv = obj(localizarBloco(infNFSe, infDPS, "serv"), "serv");
  const cServ = serv.cServ as Record<string, unknown> | undefined;

  const descricao = asStringObrigatorio(
    asString(cServ?.xDescServ) ?? asString(serv.xDescServ),
    "serv/cServ/xDescServ"
  );
  const codigoTributacaoNacional = asString(cServ?.cTribNac) ?? asString(serv.cServ);
  const codigoTributacaoMunicipal = asString(cServ?.cTribMun);

  const valorServico = extrairValorServico(infNFSe, infDPS, serv);

  // PIS/COFINS retido: corrigido pela NT 007/2026 — passa a ser declarado em
  // grupo próprio (gPISCOFINS), não mais misturado em vPis/vCofins.
  const trib = obtemTrib(infNFSe, infDPS);
  const pisCofins = trib?.gPISCOFINS as Record<string, unknown> | undefined;
  const pis = extrairRetencao(pisCofins, "PIS");
  const cofins = extrairRetencao(pisCofins, "COFINS");

  const ibsCbs = extrairIbsCbs(trib);

  return {
    descricao,
    ...(codigoTributacaoNacional ? { codigoTributacaoNacional } : {}),
    ...(codigoTributacaoMunicipal ? { codigoTributacaoMunicipal } : {}),
    valorServico,
    pis,
    cofins,
    ...(ibsCbs ? { ibsCbs } : {})
  };
}

function extrairValorServico(
  infNFSe: Record<string, unknown> | undefined,
  infDPS: Record<string, unknown> | undefined,
  serv: Record<string, unknown>
): number {
  const valores = localizarBloco(infNFSe, infDPS, "valores") as
    | Record<string, unknown>
    | undefined;
  const vServPrest = valores?.vServPrest as Record<string, unknown> | undefined;
  const vServ =
    asString(vServPrest?.vServ) ?? asString(valores?.vServ) ?? asString(serv.vServ);
  if (vServ === undefined) {
    throw new ParseError(
      "CAMPO_OBRIGATORIO_AUSENTE",
      "Valor do servico ausente (valores/vServPrest/vServ).",
      "valores/vServPrest/vServ"
    );
  }
  return paraNumero(vServ, "valores/vServPrest/vServ");
}

/** Encontra o nó de tributação (`valores/trib` ou `infNFSe/valores/trib`). */
function obtemTrib(
  infNFSe: Record<string, unknown> | undefined,
  infDPS: Record<string, unknown> | undefined
): Record<string, unknown> | undefined {
  const valores = localizarBloco(infNFSe, infDPS, "valores") as
    | Record<string, unknown>
    | undefined;
  const trib = valores?.trib ?? localizarBloco(infNFSe, infDPS, "trib");
  return trib && typeof trib === "object" ? (trib as Record<string, unknown>) : undefined;
}

/**
 * Retenção PIS/COFINS no grupo `gPISCOFINS` (NT 007/2026). Campos por tributo:
 * `CSTPIS`/`vBCPIS`/`pPIS`/`vPIS` e correlatos de COFINS.
 */
function extrairRetencao(
  grupo: Record<string, unknown> | undefined,
  qual: "PIS" | "COFINS"
): TributoPisCofins {
  if (!grupo) {
    return {};
  }
  const cst = asString(grupo[`CST${qual}`]) ?? asString(grupo.CST);
  const baseCalculo = paraNumeroOpcionalEstrito(
    asString(grupo[`vBC${qual}`]) ?? asString(grupo.vBC),
    `${qual}/vBC${qual}`
  );
  const aliquota = paraNumeroOpcionalEstrito(asString(grupo[`p${qual}`]), `${qual}/p${qual}`);
  const valor = paraNumeroOpcionalEstrito(asString(grupo[`v${qual}`]), `${qual}/v${qual}`);
  return {
    ...(cst ? { cst } : {}),
    ...(baseCalculo !== undefined ? { baseCalculo } : {}),
    ...(aliquota !== undefined ? { aliquota } : {}),
    ...(valor !== undefined ? { valor } : {})
  };
}

/**
 * Grupo IBS/CBS (Reforma, LC 214/2025; grupo `IBSCBS` da NT 007/2026).
 * Lê cClassTrib + CST + base + CBS (federal) + IBS (UF + Município).
 * IBS total = vIBSUF + vIBSMun quando ambos presentes.
 */
function extrairIbsCbs(trib: Record<string, unknown> | undefined): TributoIbsCbs | undefined {
  const grupo = trib?.IBSCBS as Record<string, unknown> | undefined;
  if (!grupo) {
    return undefined;
  }
  const gIbsCbs = grupo.gIBSCBS as Record<string, unknown> | undefined;
  const gCbs = (gIbsCbs?.gCBS ?? grupo.gCBS) as Record<string, unknown> | undefined;
  const gIbsUf = (gIbsCbs?.gIBSUF ?? grupo.gIBSUF) as Record<string, unknown> | undefined;
  const gIbsMun = (gIbsCbs?.gIBSMun ?? grupo.gIBSMun) as Record<string, unknown> | undefined;
  // Layout alternativo (QA 🔴-2): IBS como grupo único, sem split UF/Município.
  const gIbs = (gIbsCbs?.gIBS ?? grupo.gIBS) as Record<string, unknown> | undefined;

  const cClassTrib = asString(grupo.cClassTrib) ?? asString(gIbsCbs?.cClassTrib);
  const cst = asString(grupo.CST) ?? asString(gIbsCbs?.CST);
  // Base: gIBSCBS/vBC é o canônico; aceita vBC em gCBS/gIBSUF como fallback (🔴-2).
  const baseCalculo = paraNumeroOpcionalEstrito(
    asString(gIbsCbs?.vBC) ?? asString(grupo.vBC) ?? asString(gCbs?.vBC) ?? asString(gIbsUf?.vBC),
    "IBSCBS/vBC"
  );

  const aliquotaCbs = paraNumeroOpcionalEstrito(asString(gCbs?.pCBS), "gCBS/pCBS");
  const valorCbs = paraNumeroOpcionalEstrito(asString(gCbs?.vCBS), "gCBS/vCBS");

  // IBS: soma UF+Município (split canônico) OU lê o grupo gIBS único (fallback 🔴-2).
  const aliquotaIbsSplit = somarOpcional(
    asString(gIbsUf?.pIBSUF), asString(gIbsMun?.pIBSMun), "gIBSUF/pIBSUF", "gIBSMun/pIBSMun"
  );
  const valorIbsSplit = somarOpcional(
    asString(gIbsUf?.vIBSUF), asString(gIbsMun?.vIBSMun), "gIBSUF/vIBSUF", "gIBSMun/vIBSMun"
  );
  const aliquotaIbs = aliquotaIbsSplit ?? paraNumeroOpcionalEstrito(asString(gIbs?.pIBS), "gIBS/pIBS");
  const valorIbs = valorIbsSplit ?? paraNumeroOpcionalEstrito(asString(gIbs?.vIBS), "gIBS/vIBS");

  // QA 🔴-2: se há tributação CBS ativa mas NENHUM IBS foi extraído de nenhum
  // layout, NÃO reportar IBS-zero silencioso — flagar para revisão humana
  // (coerente com a trilha de boa-fé). No regime integral CBS e IBS são
  // co-presentes; CBS-presente-IBS-ausente é forte sinal de layout não
  // reconhecido. Validar layouts aceitos contra o XSD oficial (12/02/2026) =
  // gate do tributarista/founder.
  const temCbs = valorCbs !== undefined || aliquotaCbs !== undefined;
  const ibsIndeterminado = temCbs && aliquotaIbs === undefined && valorIbs === undefined;

  const resultado: TributoIbsCbs = {
    ...(cClassTrib ? { cClassTrib } : {}),
    ...(cst ? { cst } : {}),
    ...(baseCalculo !== undefined ? { baseCalculo } : {}),
    ...(aliquotaCbs !== undefined ? { aliquotaCbs } : {}),
    ...(valorCbs !== undefined ? { valorCbs } : {}),
    ...(aliquotaIbs !== undefined ? { aliquotaIbs } : {}),
    ...(valorIbs !== undefined ? { valorIbs } : {}),
    ...(ibsIndeterminado ? { ibsIndeterminado: true } : {})
  };
  // Só retorna se houver ao menos um campo extraído.
  return Object.keys(resultado).length > 0 ? resultado : undefined;
}

/**
 * Soma dois valores opcionais (split UF+Município); `undefined` se ambos ausentes.
 * Estrito: um subvalor presente porém ilegível lança `ParseError` (🔴-1).
 */
function somarOpcional(
  a: string | undefined,
  b: string | undefined,
  caminhoA: string,
  caminhoB: string
): number | undefined {
  const na = paraNumeroOpcionalEstrito(a, caminhoA);
  const nb = paraNumeroOpcionalEstrito(b, caminhoB);
  if (na === undefined && nb === undefined) {
    return undefined;
  }
  return (na ?? 0) + (nb ?? 0);
}
