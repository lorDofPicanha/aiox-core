import type {
  Acervo,
  CompanyCapabilityProfile,
  CompanyIdentity,
  EditalRequirementsModel,
  FinancialSnapshot,
  Grounding,
  HabilitationBlockId,
  HabilitationBlockResult,
  HabilitationGap,
  HabilitationResult,
  HabilitationStatus,
  RequirementEvaluation,
} from "./noyce-model";

export interface ConsortiumOption {
  partnerLabel: string;
  partnerPorte: CompanyIdentity["porte"];
  eniacParticipacaoPct: number;
  partnerParticipacaoPct: number;
}

const DISCLAIMER =
  "Noyce organiza evidencias e lacunas para revisao humana; nao substitui analise juridica, contabil ou decisao da ENIAC.";

export function buildHabilitationResult(
  ccp: CompanyCapabilityProfile,
  erm: EditalRequirementsModel,
  consortium?: ConsortiumOption,
): HabilitationResult {
  const tecnicoProfissional = evaluateTechnicalProfessional(ccp, erm);
  const tecnicoOperacional = evaluateTechnicalOperational(ccp, erm);
  const economicoFinanceira = evaluateEconomicFinancial(ccp, erm);
  const juridicaFiscalTrabalhista = evaluateRegularity(ccp, erm);
  const blocks = [
    tecnicoProfissional,
    tecnicoOperacional,
    economicoFinanceira,
    juridicaFiscalTrabalhista,
  ];
  const lacunas = blocks.flatMap((block) => block.gaps);
  const tarefas = unique(blocks.flatMap((block) => block.tarefas));
  const verdict = buildVerdict(blocks, lacunas, tarefas);

  return {
    verdict,
    porBloco: {
      tecnico_profissional: tecnicoProfissional,
      tecnico_operacional: tecnicoOperacional,
      economico_financeira: economicoFinanceira,
      juridica_fiscal_trabalhista: juridicaFiscalTrabalhista,
    },
    lacunas,
    tarefas,
    solo: {
      verdict,
      tetoSolo: economicoFinanceira.evaluations.find((item) => item.id === "econ-pl")?.disponivel ?? null,
      patrimonioLiquido: latestFinancial(ccp.financials)?.patrimonioLiquido ?? null,
      exercicio: latestFinancial(ccp.financials)?.exercicio ?? null,
    },
    consorcio: buildConsortiumEvaluation(ccp, erm, consortium),
    disclaimer: DISCLAIMER,
  };
}

function evaluateTechnicalProfessional(
  ccp: CompanyCapabilityProfile,
  erm: EditalRequirementsModel,
): HabilitationBlockResult {
  const evaluations = erm.tecnica.profissional.map((requirement, index): RequirementEvaluation => {
    const candidates = ccp.acervo
      .filter((acervo) => acervo.tipo === "CAT_PROFISSIONAL")
      .flatMap((acervo) =>
        acervo.itens
          .filter((item) => item.servicoCanonico === requirement.servico)
          .filter((item) => requirement.qtdMin == null || item.qtd >= requirement.qtdMin)
          .map((item) => ({ acervo, qtd: item.qtd })),
      )
      .sort((a, b) => b.qtd - a.qtd);
    const linked = candidates.find(({ acervo }) => ccp.rts.find((rt) => rt.id === acervo.rtId)?.vinculo !== null);
    const candidate = linked ?? candidates[0];

    if (!candidate) {
      const gap = gapFor(
        "tecnico_profissional",
        requirement.servico,
        requirement.qtdMin ?? null,
        requirement.un,
        "INSANAVEL",
        `Sem RT habilitavel com CAT para ${requirement.servico}.`,
      );
      return evaluation({
        id: `prof-${index}`,
        requisito: requirement.servico,
        status: "NAO_ATENDE",
        gaps: [gap],
        evidencia: ["Nenhuma CAT profissional compativel localizada no CCP."],
      });
    }

    const rt = ccp.rts.find((item) => item.id === candidate.acervo.rtId);
    if (rt?.vinculo === null) {
      const task = `gerar declaracao de contratacao futura do RT ${rt.nome}`;
      const gap = gapFor(
        "tecnico_profissional",
        requirement.servico,
        null,
        requirement.un,
        "SANAVEL",
        "declaracao de contratacao futura do RT",
      );
      return evaluation({
        id: `prof-${index}`,
        requisito: requirement.servico,
        status: "ATENDE_COM_RESSALVA",
        gaps: [gap],
        tarefas: [task],
        evidencia: [`${rt.nome} cobre ${requirement.servico} via ${candidate.acervo.id}, mas esta sem vinculo formal no seed.`],
      });
    }

    return evaluation({
      id: `prof-${index}`,
      requisito: requirement.servico,
      status: "ATENDE",
      evidencia: [`${rt?.nome ?? candidate.acervo.rtId} cobre ${requirement.servico} via ${candidate.acervo.id}.`],
    });
  });

  return block("tecnico_profissional", "Tecnico-profissional", true, evaluations);
}

function evaluateTechnicalOperational(
  ccp: CompanyCapabilityProfile,
  erm: EditalRequirementsModel,
): HabilitationBlockResult {
  const evaluations = erm.tecnica.operacional.map((requirement, index): RequirementEvaluation => {
    if (requirement.qtdMin === null) {
      const gap = gapFor(
        "tecnico_operacional",
        requirement.servico,
        null,
        requirement.un,
        "SANAVEL",
        `quantitativo minimo de ${requirement.servico} nao extraido do edital`,
      );
      return evaluation({
        id: `op-${index}`,
        requisito: requirement.servico,
        status: "INDETERMINADO",
        gaps: [gap],
        tarefas: [`confirmar quantitativo minimo de ${requirement.servico}`],
        evidencia: ["qtdMin veio null no ERM; matcher nao chuta."],
      });
    }

    const capability = ccp.derived.capabilityByService[requirement.servico];
    const maxAtestados = erm.tecnica.somatorio.maxAtestados;

    // Conclave 12/Jun (Niebuhr+Justen+Norman): DOIS cenários, um veredito com delta condicional.
    // TESE (otimista): todo acervo conta — CAT profissional como proxy + corresponsável integral (art. 15 §2º como tese defensável).
    // CONSERVADOR: apenas acervo em NOME DA EMPRESA (CAO operacional / atestado do contratante) — é o que a comissão
    // pode exigir ("cadê o atestado em nome da ENIAC?"). As TAREFAS derivam do conservador.
    const sourcesTese = acervoQuantities(ccp.acervo, requirement.servico);
    const sourcesConservador = acervoQuantities(
      ccp.acervo.filter((acervo) => acervo.tipo === "CAO_OPERACIONAL"),
      requirement.servico,
    );
    const topLimit = maxAtestados ?? sourcesTese.length;
    const sumWithRules = (sources: readonly number[], fallbackMax: number | undefined) =>
      erm.tecnica.somatorio.permitido === false
        ? fallbackMax ?? topN(sources, 1)
        : topN(sources, maxAtestados ?? sources.length);
    const available = sumWithRules(sourcesTese, capability?.maxSingle);
    const availableConservador = sourcesConservador.length ? sumWithRules(sourcesConservador, undefined) : 0;

    const hasCao = sourcesConservador.length > 0;
    // Justen (Res. CONFEA 1.025/2009 + art. 67, II): CREA não emite acervo de PJ — a tarefa correta
    // é obter atestado do CONTRATANTE em nome da empresa, nunca "emitir CAO via CREA".
    const atestadoTask =
      "obter atestado de capacidade operacional emitido pelo contratante em nome da empresa (art. 67, II — CREA nao emite acervo de PJ)";
    const proxyProveniencia: Grounding = hasCao ? "grounded" : "inferred";
    const somatorioTasks =
      erm.tecnica.somatorio.permitido === null ? ["confirmar somatorio via esclarecimento"] : [];
    const somatorioEvidence =
      erm.tecnica.somatorio.permitido === false
        ? "Somatorio vedado: usado maior atestado individual."
        : `Somatorio usado com limite de ${topLimit || 0} atestado(s).`;
    const cenarioEvidence = `Tese: ${round(available)} ${requirement.un ?? ""} (inclui CAT profissional/corresponsavel). Conservador (somente acervo em nome da empresa): ${round(availableConservador)}.`;

    if (available < requirement.qtdMin) {
      const missing = round(requirement.qtdMin - available);
      const gap = gapFor(
        "tecnico_operacional",
        requirement.servico,
        missing,
        requirement.un,
        "INSANAVEL",
        `capacidade operacional ${missing} ${requirement.un ?? ""} abaixo do exigido (mesmo na tese otimista)`,
      );
      return evaluation({
        id: `op-${index}`,
        requisito: requirement.servico,
        status: "NAO_ATENDE",
        gaps: [gap],
        tarefas: hasCao ? [] : [atestadoTask],
        evidencia: [
          `Disponivel ${round(available)} ${requirement.un ?? capability?.unidade ?? ""}; exigido ${requirement.qtdMin}.`,
          cenarioEvidence,
          somatorioEvidence,
        ],
        proveniencia: proxyProveniencia,
        qtdMin: requirement.qtdMin,
        disponivel: round(available),
        disponivelConservador: round(availableConservador),
        unidade: requirement.un ?? capability?.unidade ?? null,
      });
    }

    // Tese cobre, mas o cenário conservador NÃO: nunca dar verde liso — delta condicional + tarefa prioritária.
    if (availableConservador < requirement.qtdMin) {
      const missingConservador = round(requirement.qtdMin - availableConservador);
      const gap = gapFor(
        "tecnico_operacional",
        requirement.servico,
        missingConservador,
        requirement.un,
        "SANAVEL",
        `capacidade comprovada apenas por CAT profissional/corresponsavel — se a comissao exigir atestado em nome da empresa, faltam ${missingConservador} ${requirement.un ?? ""}`,
      );
      return evaluation({
        id: `op-${index}`,
        requisito: requirement.servico,
        status: "ATENDE_COM_RESSALVA",
        gaps: [gap],
        tarefas: [atestadoTask, ...somatorioTasks],
        evidencia: [
          `Disponivel ${round(available)} ${requirement.un ?? capability?.unidade ?? ""}; exigido ${requirement.qtdMin}.`,
          cenarioEvidence,
          somatorioEvidence,
        ],
        proveniencia: "inferred",
        qtdMin: requirement.qtdMin,
        disponivel: round(available),
        disponivelConservador: round(availableConservador),
        unidade: requirement.un ?? capability?.unidade ?? null,
      });
    }

    const status: HabilitationStatus =
      erm.tecnica.somatorio.permitido === null ? "ATENDE_COM_RESSALVA" : "ATENDE";

    return evaluation({
      id: `op-${index}`,
      requisito: requirement.servico,
      status,
      tarefas: [...somatorioTasks],
      evidencia: [
        `Disponivel ${round(available)} ${requirement.un ?? capability?.unidade ?? ""}; exigido ${requirement.qtdMin}.`,
        cenarioEvidence,
        somatorioEvidence,
      ],
      proveniencia: proxyProveniencia,
      qtdMin: requirement.qtdMin,
      disponivel: round(available),
      disponivelConservador: round(availableConservador),
      unidade: requirement.un ?? capability?.unidade ?? null,
    });
  });

  return block("tecnico_operacional", "Tecnico-operacional", true, evaluations);
}

function evaluateEconomicFinancial(
  ccp: CompanyCapabilityProfile,
  erm: EditalRequirementsModel,
): HabilitationBlockResult {
  const financial = latestFinancial(ccp.financials);
  const evaluations: RequirementEvaluation[] = [];

  if (erm.economicoFinanceira.exigePL || erm.economicoFinanceira.percentualPL !== null) {
    const requiredTotal =
      erm.meta.valorEstimado !== null && erm.economicoFinanceira.percentualPL !== null
        ? round(erm.meta.valorEstimado * erm.economicoFinanceira.percentualPL)
        : null;

    if (!financial || financial.patrimonioLiquido === null || requiredTotal === null) {
      const gap = gapFor(
        "economico_financeira",
        "patrimonio_liquido",
        requiredTotal,
        "BRL",
        "SANAVEL",
        "obter PL exato do balanco (D-26.1)",
      );
      evaluations.push(
        evaluation({
          id: "econ-pl",
          requisito: "Patrimonio liquido minimo",
          status: "INDETERMINADO",
          gaps: [gap],
          tarefas: ["obter PL exato do balanco (D-26.1)"],
          evidencia: ["PL ou total necessario veio null; matcher nao chuta teto solo."],
          disponivel: null,
          unidade: "BRL",
        }),
      );
    } else {
      const tetoSolo = round(financial.patrimonioLiquido / (erm.economicoFinanceira.percentualPL ?? 1));
      const status: HabilitationStatus =
        erm.meta.valorEstimado !== null && erm.meta.valorEstimado <= tetoSolo ? "ATENDE" : "NAO_ATENDE";
      const gaps =
        status === "NAO_ATENDE"
          ? [
              gapFor(
                "economico_financeira",
                "patrimonio_liquido",
                round((requiredTotal ?? 0) - financial.patrimonioLiquido),
                "BRL",
                "INSANAVEL",
                "PL insuficiente para habilitacao solo; avaliar consorcio",
              ),
            ]
          : [];
      evaluations.push(
        evaluation({
          id: "econ-pl",
          requisito: "Patrimonio liquido minimo",
          status,
          gaps,
          tarefas: status === "NAO_ATENDE" ? ["avaliar modo consorcio"] : [],
          evidencia: [`Teto solo calculado: ${tetoSolo}; valor estimado: ${erm.meta.valorEstimado ?? "null"}.`],
          disponivel: tetoSolo,
          unidade: "BRL",
        }),
      );
    }
  }

  for (const [key, threshold] of Object.entries(erm.economicoFinanceira.indices)) {
    if (threshold === null) continue;
    const ratio = financial ? financialRatio(financial, key as "LC" | "LG" | "SG") : null;
    if (ratio === null) {
      const gap = gapFor(
        "economico_financeira",
        key,
        threshold,
        "indice",
        "SANAVEL",
        `obter totais contabeis para calcular ${key}`,
      );
      evaluations.push(
        evaluation({
          id: `econ-${key}`,
          requisito: `${key} >= ${threshold}`,
          status: "INDETERMINADO",
          gaps: [gap],
          tarefas: [`obter totais contabeis para calcular ${key}`],
          evidencia: [`Campos contabeis de ${key} incompletos; matcher nao chuta indice.`],
        }),
      );
      continue;
    }

    const status: HabilitationStatus = ratio >= threshold ? "ATENDE" : "NAO_ATENDE";
    evaluations.push(
      evaluation({
        id: `econ-${key}`,
        requisito: `${key} >= ${threshold}`,
        status,
        gaps:
          status === "NAO_ATENDE"
            ? [gapFor("economico_financeira", key, round(threshold - ratio), "indice", "INSANAVEL", `${key} abaixo do limiar`)]
            : [],
        evidencia: [`${key} calculado: ${round(ratio)}; limiar: ${threshold}.`],
      }),
    );
  }

  if (evaluations.length === 0) {
    evaluations.push(
      evaluation({
        id: "econ-nao-exigido",
        requisito: "Economico-financeira",
        status: "ATENDE",
        evidencia: ["ERM nao trouxe exigencia economico-financeira dura para este slice."],
      }),
    );
  }

  return block("economico_financeira", "Economico-financeira", true, evaluations);
}

function evaluateRegularity(ccp: CompanyCapabilityProfile, erm: EditalRequirementsModel): HabilitationBlockResult {
  const requested = [
    ...erm.juridica.declaracoes.map((label) => ({ tipo: label, label })),
    ...erm.fiscalTrabalhista.CNDs.map((label) => ({ tipo: label, label })),
    ...(erm.fiscalTrabalhista.SICAF ? [{ tipo: "SICAF", label: "SICAF" }] : []),
  ];
  const sessionDate = erm.meta.dataSessao;

  const evaluations = requested.map((request, index): RequirementEvaluation => {
    const doc = ccp.regularity.find((item) => item.tipo === request.tipo);
    const valid = doc?.status === "vigente" && isValidOn(doc.validade, sessionDate);
    if (valid) {
      return evaluation({
        id: `reg-${index}`,
        requisito: request.label,
        status: "ATENDE",
        evidencia: [`${request.label} vigente ate ${doc.validade ?? "validade nao informada"}.`],
      });
    }

    const gap = gapFor(
      "juridica_fiscal_trabalhista",
      request.tipo,
      null,
      null,
      "SANAVEL",
      `providenciar ${request.label}`,
    );
    return evaluation({
      id: `reg-${index}`,
      requisito: request.label,
      status: "PARCIAL",
      gaps: [gap],
      tarefas: [`providenciar ${request.label}`],
      evidencia: [`${request.label} ausente ou nao vigente no CCP.`],
    });
  });

  return block(
    "juridica_fiscal_trabalhista",
    "Juridica / fiscal / trabalhista",
    true,
    evaluations.length
      ? evaluations
      : [
          evaluation({
            id: "reg-nao-exigido",
            requisito: "Regularidade",
            status: "ATENDE",
            evidencia: ["ERM nao trouxe documentos juridicos/fiscais/trabalhistas especificos para este slice."],
          }),
        ],
  );
}

function buildVerdict(
  blocks: readonly HabilitationBlockResult[],
  lacunas: readonly HabilitationGap[],
  tarefas: readonly string[],
) {
  const hasInsanavelNoGo = blocks.some(
    (blockItem) =>
      blockItem.eliminatorio &&
      blockItem.status === "NAO_ATENDE" &&
      blockItem.gaps.some((gapItem) => gapItem.sanabilidade === "INSANAVEL"),
  );
  if (hasInsanavelNoGo) return "NO_GO";
  if (blocks.some((blockItem) => blockItem.status === "INDETERMINADO")) return "PENDENTE_DADO";
  if (lacunas.some((gapItem) => gapItem.sanabilidade === "SANAVEL") || tarefas.length > 0) {
    return "GO_COM_TAREFAS";
  }
  return "GO";
}

function block(
  id: HabilitationBlockId,
  label: string,
  eliminatorio: boolean,
  evaluations: RequirementEvaluation[],
): HabilitationBlockResult {
  const gaps = evaluations.flatMap((item) => item.gaps);
  const tarefas = unique(evaluations.flatMap((item) => item.tarefas));
  return {
    id,
    label,
    status: aggregateStatus(evaluations),
    eliminatorio,
    evaluations,
    gaps,
    tarefas,
  };
}

function evaluation(input: {
  id: string;
  requisito: string;
  status: HabilitationStatus;
  evidencia: string[];
  proveniencia?: Grounding;
  qtdMin?: number | null;
  disponivel?: number | null;
  unidade?: string | null;
  gaps?: HabilitationGap[];
  tarefas?: string[];
}): RequirementEvaluation {
  return {
    proveniencia: "grounded",
    gaps: [],
    tarefas: [],
    ...input,
  };
}

function aggregateStatus(evaluations: readonly RequirementEvaluation[]): HabilitationStatus {
  if (evaluations.some((item) => item.status === "NAO_ATENDE")) return "NAO_ATENDE";
  if (evaluations.some((item) => item.status === "INDETERMINADO")) return "INDETERMINADO";
  if (evaluations.some((item) => item.status === "PARCIAL")) return "PARCIAL";
  if (evaluations.some((item) => item.status === "ATENDE_COM_RESSALVA")) return "ATENDE_COM_RESSALVA";
  return "ATENDE";
}

function gapFor(
  bloco: HabilitationBlockId,
  classe: string,
  faltante: number | null,
  unidade: string | null,
  sanabilidade: "SANAVEL" | "INSANAVEL",
  descricao: string,
): HabilitationGap {
  return {
    bloco,
    classe,
    faltante: faltante === null ? null : round(faltante),
    unidade,
    sanabilidade,
    descricao,
  };
}

function acervoQuantities(acervos: readonly Acervo[], servico: string): number[] {
  return acervos
    .flatMap((acervo) => acervo.itens.filter((item) => item.servicoCanonico === servico).map((item) => item.qtd))
    .sort((a, b) => b - a);
}

function topN(values: readonly number[], n: number): number {
  return round(values.slice(0, Math.max(1, n)).reduce((sum, value) => sum + value, 0));
}

function latestFinancial(financials: readonly FinancialSnapshot[]): FinancialSnapshot | null {
  return [...financials].sort((a, b) => b.exercicio - a.exercicio)[0] ?? null;
}

function financialRatio(financial: FinancialSnapshot, key: "LC" | "LG" | "SG"): number | null {
  if (key === "LC") return divide(financial.ativoCirc, financial.passivoCirc);
  const denominator = sumNullable(financial.passivoCirc, financial.exigivelLongoPrazo);
  if (key === "LG") return divide(sumNullable(financial.ativoCirc, financial.realizavelLongoPrazo), denominator);
  return divide(financial.ativoTotal, denominator);
}

function divide(numerator: number | null, denominator: number | null): number | null {
  if (numerator === null || denominator === null || denominator === 0) return null;
  return numerator / denominator;
}

function sumNullable(a: number | null, b: number | null): number | null {
  if (a === null || b === null) return null;
  return a + b;
}

function isValidOn(validade: string | null, dataSessao: string | null): boolean {
  if (!validade || !dataSessao) return false;
  return new Date(validade).getTime() >= new Date(dataSessao).getTime();
}

function buildConsortiumEvaluation(
  ccp: CompanyCapabilityProfile,
  erm: EditalRequirementsModel,
  consortium: ConsortiumOption | undefined,
) {
  if (!consortium) return null;
  const members = [
    { label: ccp.identity.razaoSocial, porte: ccp.identity.porte, participacaoPct: consortium.eniacParticipacaoPct },
    { label: consortium.partnerLabel, porte: consortium.partnerPorte, participacaoPct: consortium.partnerParticipacaoPct },
  ];
  const allMeEpp = members.every((member) => member.porte === "ME" || member.porte === "EPP");

  return {
    enabled: true,
    aceitaPeloEdital: erm.tecnica.aceitaAcervoConsorcio,
    members,
    acrescimo30Dispensado: allMeEpp,
    vantagemMeEpp: allMeEpp,
    note: allMeEpp
      ? "Consorcio composto integralmente por ME/EPP: sinalizar vantagem pela dispensa do acrescimo de ate 30% (art. 15, par. 4)."
      : "Consorcio pode sofrer acrescimo de ate 30% conforme edital e art. 15, par. 4.",
  };
}

function unique(values: readonly string[]): string[] {
  return Array.from(new Set(values));
}

function round(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
