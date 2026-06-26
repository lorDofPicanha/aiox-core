// Biblioteca de templates de DECLARAÇÕES da Lei 14.133/2021 — o conjunto que um edital de obra
// costuma exigir. Cada template: texto pré-redigido com os dados da empresa + citação legal +
// um regex p/ casar o rótulo LIVRE do edital (ERM.juridica.declaracoes) com o tipo canônico.
//
// ⚠️ INVARIANTE: o MODELO ANEXO DO EDITAL prevalece sobre estes templates. Todo item gerado sai
// com aviso disso; declarações de risco saem com requerCorrecao (revisão humana obrigatória).
// Citações conferidas no conclave jurídico 12/Jun (Niebuhr/Justen) — manter rigor ao editar.

export type DeclaracaoTipo =
  | "fato_impeditivo"
  | "inexistencia_fato_superveniente"
  | "menor"
  | "elaboracao_independente"
  | "cumprimento_requisitos_habilitacao"
  | "nepotismo"
  | "reserva_pcd"
  | "nao_servidor_publico"
  | "trabalho_degradante"
  | "pleno_conhecimento_edital"
  | "me_epp"; // ME/EPP é ESPECIAL: o texto depende do porte derivado do balanço (ver noyce-review).

export interface DeclaracaoTemplate {
  tipo: DeclaracaoTipo;
  label: string;
  citacao: string;
  /** Texto pré-redigido. `empresa` = "Razão Social (CNPJ ...)". */
  texto: (empresa: string) => string;
  /** Casa o rótulo livre do edital com este tipo. Ordem de avaliação importa (específico→genérico). */
  match: RegExp;
  /** ME/EPP não é gerado por aqui (porte derivado do balanço) — fica fora do texto padrão. */
  especial?: boolean;
}

// Ordem de matching: mais específicos primeiro p/ evitar captura indevida.
export const DECLARACAO_TEMPLATES: DeclaracaoTemplate[] = [
  {
    tipo: "elaboracao_independente",
    label: "Elaboração independente de proposta",
    citacao: "Praxe consolidada (declaração de elaboração independente de proposta)",
    match: /elabora[çc][ãa]o\s+independente/i,
    texto: (e) =>
      `${e} declara, sob as penas da lei, que a proposta apresentada foi elaborada de maneira independente, que seu conteúdo não foi, no todo ou em parte, direta ou indiretamente, informado, discutido ou recebido de qualquer outro participante potencial ou de fato deste certame, e que não tentou influenciar a decisão de qualquer outro participante quanto a participar ou não desta licitação.`,
  },
  {
    tipo: "menor",
    label: "Não emprega menor (art. 7º, XXXIII, CF)",
    citacao: "Art. 7º, XXXIII, CF c/c art. 68, VI, Lei 14.133/2021",
    match: /menor|art\.?\s*7[ºo]?\b|XXXIII|trabalho\s+(noturno|insalubre|perigoso)/i,
    texto: (e) =>
      `${e} declara, para os fins do disposto no art. 7º, XXXIII, da Constituição Federal e no art. 68, VI, da Lei nº 14.133/2021, que não emprega menor de 18 anos em trabalho noturno, perigoso ou insalubre, nem menor de 16 anos em qualquer trabalho, salvo na condição de aprendiz a partir de 14 anos.`,
  },
  {
    tipo: "nepotismo",
    label: "Inexistência de nepotismo / parentesco",
    citacao: "Súmula Vinculante 13/STF c/c Decreto nº 7.203/2010",
    match: /nepotismo|parentesco|s[úu]mula\s*vinculante\s*13|7\.?203/i,
    texto: (e) =>
      `${e} declara que não possui em seu quadro societário, de direção ou de empregados cônjuge, companheiro(a) ou parente em linha reta, colateral ou por afinidade, até o terceiro grau, de agente público investido em cargo de direção, chefia ou assessoramento no órgão ou entidade contratante, em observância à Súmula Vinculante nº 13 do STF e ao Decreto nº 7.203/2010.`,
  },
  {
    tipo: "reserva_pcd",
    label: "Reserva de cargos para PCD / reabilitado",
    citacao: "Art. 63, IV, Lei 14.133/2021 c/c art. 93, Lei 8.213/1991",
    match: /(pessoa.*defici|\bPCD\b|reabilitad|reserva.*cargo|art\.?\s*93|8\.?213)/i,
    texto: (e) =>
      `${e} declara, nos termos do art. 63, IV, da Lei nº 14.133/2021, que cumpre as exigências de reserva de cargos previstas em lei para pessoa com deficiência e para reabilitado da Previdência Social, na forma do art. 93 da Lei nº 8.213/1991.`,
  },
  {
    tipo: "nao_servidor_publico",
    label: "Não possui servidor público no quadro / impedimentos",
    citacao: "Arts. 9º e 14, Lei 14.133/2021",
    match: /servidor\s+p[úu]blico|agente\s+p[úu]blico.*quadro|impedimento.*art\.?\s*9|art\.?\s*14\b/i,
    texto: (e) =>
      `${e} declara que não possui em seu quadro societário ou funcional servidor público ou dirigente do órgão ou entidade contratante, tampouco incide em qualquer das hipóteses de impedimento de contratar previstas nos arts. 9º e 14 da Lei nº 14.133/2021.`,
  },
  {
    tipo: "trabalho_degradante",
    label: "Não utiliza trabalho escravo/infantil/degradante",
    citacao: "Praxe editalícia (combate ao trabalho forçado/infantil)",
    match: /(trabalho|m[ãa]o\s+de\s+obra).*(escrav|degradante|for[çc]ad|infantil|an[áa]loga)/i,
    texto: (e) =>
      `${e} declara que não se utiliza, direta ou indiretamente, de mão de obra constituída por trabalho infantil, forçado ou em condições análogas à de escravo ou degradantes, na forma da legislação vigente.`,
  },
  {
    tipo: "cumprimento_requisitos_habilitacao",
    label: "Cumprimento dos requisitos de habilitação",
    citacao: "Art. 63, I, Lei 14.133/2021",
    match: /cumpr.*(requisitos|habilita)|pleno.*habilita|atende.*habilita|art\.?\s*63\b/i,
    texto: (e) =>
      `${e} declara, sob as penas da lei e nos termos do art. 63, I, da Lei nº 14.133/2021, que cumpre plenamente os requisitos de habilitação exigidos no edital e que sua proposta está em conformidade com as exigências do instrumento convocatório.`,
  },
  {
    tipo: "inexistencia_fato_superveniente",
    label: "Inexistência de fato superveniente impeditivo",
    citacao: "Praxe editalícia (fato superveniente)",
    match: /fato\s+superveniente/i,
    texto: (e) =>
      `${e} declara a inexistência de fato superveniente impeditivo de sua habilitação, estando ciente da obrigatoriedade de declarar ocorrências posteriores que venham a comprometê-la.`,
  },
  {
    tipo: "fato_impeditivo",
    label: "Inexistência de fato impeditivo",
    citacao: "Praxe editalícia (herdada do art. 32, §2º, Lei 8.666/93)",
    match: /fato\s+impeditivo/i,
    texto: (e) =>
      `${e} declara, sob as penas da lei, que não há fato impeditivo à sua habilitação, ciente da obrigação de declarar ocorrências posteriores.`,
  },
  {
    tipo: "pleno_conhecimento_edital",
    label: "Pleno conhecimento e concordância com o edital",
    citacao: "Praxe editalícia (pleno conhecimento das condições)",
    match: /pleno\s+conhecimento|concord[âa]ncia.*edital|conhecimento.*(edital|condi[çc][õo]es)/i,
    texto: (e) =>
      `${e} declara pleno conhecimento e concordância com os termos e condições do edital e de seus anexos, bem como das condições locais e técnicas para o cumprimento das obrigações objeto desta licitação.`,
  },
  {
    tipo: "me_epp",
    label: "Enquadramento ME/EPP",
    citacao: "LC 123/2006",
    match: /me\/epp|microempresa|pequeno\s+porte|LC\s*123|123\/2006|tratamento\s+favorecido/i,
    especial: true,
    texto: () => "", // texto vem da derivação de porte no noyce-review (não usar aqui)
  },
];

/** Mapeia o rótulo LIVRE do edital (ERM.juridica.declaracoes[]) → tipo canônico, ou null se não houver template. */
export function mapDeclaracaoLabel(editalLabel: string): DeclaracaoTipo | null {
  const t = DECLARACAO_TEMPLATES.find((tpl) => tpl.match.test(editalLabel));
  return t ? t.tipo : null;
}

export function getTemplate(tipo: DeclaracaoTipo): DeclaracaoTemplate | undefined {
  return DECLARACAO_TEMPLATES.find((t) => t.tipo === tipo);
}
