/**
 * MOTOR DE MAPEAMENTO — o que roda por trás da §3.
 *
 * Recebe o processo descrito em texto livre e devolve o mapa: etapas separadas,
 * cada uma classificada em automatizável / parcial / humana, mais a conta de horas.
 *
 * Quatro regras que moldam este arquivo:
 *
 *  1. RODA NO NAVEGADOR, DE VERDADE. Sem rede, sem chave, sem custo. A frase da seção
 *     ("isso rodou agora, no seu navegador") precisa ser literalmente verdadeira.
 *  2. SEM TEATRO. Nenhum passo tem delay artificial. O `trace` carrega o tempo real
 *     medido — que é da ordem de 1 ms. Rápido demais para parecer trabalho é melhor
 *     que fingir demora: a régua de motion do projeto proíbe animação que simula
 *     processamento inexistente.
 *  3. SEM NÚMERO INVENTADO. A estimativa de tempo é declarada, por etapa, e a
 *     frequência quem informa é o visitante. A UI mostra a premissa junto do
 *     resultado — número sem premissa visível seria exatamente o que o projeto proíbe.
 *  4. FALHA DECLARADA. Esta é nova, e vem de uma medição: o pior resultado que este
 *     motor produzia não era "não li" — era o ACERTO APARENTE. Quatro etapas escritas
 *     sem pontuação viravam uma, devolviam 0,7 h/mês e o painel exibia
 *     "✓ separação · 1 etapa identificada". Signifier de sucesso em cima de uma falha.
 *     Um motor que não sabe detectar o próprio erro não pode ser a única prova do site.
 *     Por isso agora existe `avisos`, e o `trace` diz quando leu mal.
 *
 * Para trocar por um modelo depois: mantenha a forma de `Mapa`. A §3 só conhece o tipo.
 */

/**
 * Selos que o componente da §3 já sabe desenhar.
 *
 * ⚠️ NÃO acrescente valores aqui sem abrir o gate do `.tsx`: `Demo.tsx` declara
 * `const SELO: Record<Veredito, string>` com exatamente estas três chaves. Um quarto
 * membro nesta união quebra a compilação de um arquivo que hoje não pode ser tocado.
 */
export type Veredito = 'automatizavel' | 'parcial' | 'humana';

/**
 * O veredito de verdade — inclui o quarto estado.
 *
 * "Não li" e "parcial" são coisas diferentes: parcial é uma etapa lida, entendida e
 * classificada como meio-a-meio; `nao_lida` é a máquina admitindo que não entendeu.
 * Empacotar as duas no mesmo valor é o motor mentindo sobre o próprio estado — e
 * a marcação honesta é literalmente a única coisa que este site tem para oferecer
 * no lugar do case que ele não tem.
 *
 * Por que dois campos em `Etapa` em vez de um: ver o comentário de `Etapa.veredito`.
 */
export type VereditoReal = Veredito | 'nao_lida';

export type Categoria =
  | 'recebimento'
  | 'transcricao'
  | 'notificacao'
  | 'consulta'
  | 'calculo'
  | 'arquivamento'
  | 'documento'
  | 'agendamento'
  | 'resposta'
  | 'decisao'
  | 'presencial'
  | 'indefinida';

export interface Etapa {
  n: number;
  texto: string;
  categoria: Categoria;
  /**
   * Veredito real, com `nao_lida` separado de `parcial`. É ESTE que a interface deve ler.
   */
  vereditoReal: VereditoReal;
  /**
   * Selo compatível com o `Record<Veredito, string>` que a §3 mantém hoje.
   * Etapa não lida cai em `parcial` aqui — de propósito e sob protesto: é o único valor
   * que o componente atual sabe desenhar, e trocar isso exige uma linha em `Demo.tsx`
   * (a chave `nao_lida` no mapa de selos), que está atrás do gate visual do founder.
   * Quando o gate abrir: `SELO[e.vereditoReal]` + a quarta chave, e este campo sai.
   */
  veredito: Veredito;
  /** Minutos por execução — premissa declarada, exibida na interface. */
  minutos: number;
  /** Por que caiu nesta categoria. Aparece no painel: a máquina mostra o critério. */
  motivo: string;
}

export type TipoAviso = 'subsegmentacao' | 'truncamento' | 'nao_lidas';

/**
 * O que a máquina sabe que fez mal. Existe para ser exibido, não para ficar no console:
 * erro que o sistema detecta e não conta é pior que erro que ele não detecta, porque
 * remove do visitante a chance de perceber.
 */
export interface Aviso {
  tipo: TipoAviso;
  texto: string;
}

export interface PassoTrace {
  op: string;
  detalhe: string;
  /** Tempo real medido, em milissegundos. Nunca simulado. */
  ms: number;
}

export interface Mapa {
  etapas: Etapa[];
  automatizaveis: number;
  parciais: number;
  humanas: number;
  /** Etapas que a máquina não entendeu. Não são "parciais" e não entram na conta. */
  naoLidas: number;
  /** Minutos/semana devolvidos. Parcial conta metade — supervisão continua existindo. */
  minutosSemana: number;
  horasMes: number;
  vezesPorSemana: number;
  /** Quantas etapas o texto tinha ANTES do teto de leitura. Ver `TETO_ETAPAS`. */
  etapasDetectadas: number;
  avisos: Aviso[];
  trace: PassoTrace[];
  totalMs: number;
}

/** Acima disto o mapa vira lista de compras e ninguém lê. O corte é declarado, não silencioso. */
const TETO_ETAPAS = 12;

/**
 * Palavras por etapa acima das quais é mais provável que a máquina tenha lido junto
 * o que acontece separado. Calibrado contra os 16 processos da §4 (o mais longo dá 12
 * palavras em 3 etapas) e contra o caso medido de sub-segmentação (25 palavras em 1).
 */
const PALAVRAS_POR_ETAPA_SUSPEITO = 14;

/** Remove acento e caixa — o matching precisa aguentar "orçamento" e "orcamento". */
function normalizar(s: string): string {
  return s
    .normalize('NFC')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

/**
 * Quebra em tokens preservando palavra hifenizada ("e-mail", "follow-up") — que é
 * uma palavra só na cabeça de quem escreveu, e duas para qualquer regex ingênua.
 */
const RE_TOKEN = /[a-z0-9]+(?:-[a-z0-9]+)*/g;

interface Token {
  texto: string;
  /** Posição em caracteres. O desempate entre categorias é por posição. */
  pos: number;
}

function tokenizar(plano: string): Token[] {
  const tokens: Token[] = [];
  for (const m of plano.matchAll(RE_TOKEN)) {
    tokens.push({ texto: m[0], pos: m.index });
  }
  return tokens;
}

/* ────────────────────────────────────────────────────────────────────────────
   MORFOLOGIA — por que este bloco existe.

   A versão anterior casava por `indexOf` de radical solto. Duas classes de erro
   saíram disso, as duas medidas com o texto na frente de quem escreveu:

     · sem fronteira de palavra: "geralmente" casava `gera` e devolvia cálculo/12 min;
       "sobra" casava `obra`; "balança" casava `lanca`; "informação" casava `inform`.
     · dicionário só em 3ª pessoa: o dono descreve o PRÓPRIO processo, e verbo
       português de 1ª pessoa termina em -o ("eu confiro", "eu fecho o mês", "eu salvo").
       Pior: em -ir a raiz muda junto (conferir → confiro, inserir → insiro), então
       nem um radical mais curto alcança.

   Lista de palavras não resolve nem um nem outro — some uma conjugação e o buraco
   volta. O que resolve é GERAR as formas a partir do infinitivo e casar TOKEN a
   TOKEN: a fronteira de palavra sai de graça e a conjugação inteira entra junto.
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * Só os irregulares que o dicionário abaixo realmente usa. Tabela de verbo irregular
 * cresce sozinha se deixar; aqui ela só ganha entrada quando um termo precisa.
 */
const IRREGULARES: Record<string, string[]> = {
  fazer: [
    'fazer', 'faco', 'faz', 'fazem', 'fazemos', 'fiz', 'fez', 'fizeram',
    'fazia', 'faziam', 'fazendo', 'feito', 'feita', 'feitos', 'feitas',
  ],
  // "vendo" e "vi" ficam de fora de propósito: colidem com "vender" e com ruído curto.
  ver: ['ver', 'vejo', 've', 'veem', 'vemos', 'viu', 'viram', 'visto', 'vista'],
  // subir alterna u→o na 3ª ("sobe"), que é justamente a forma usada em "sobe pro drive".
  subir: ['subir', 'subo', 'sobe', 'sobem', 'subimos', 'subi', 'subiu', 'subiram', 'subindo', 'subido'],
  pedir: [
    'pedir', 'peco', 'pede', 'pedem', 'pedimos', 'pedi', 'pediu', 'pediram',
    'pedindo', 'pedido', 'pedida', 'pedidos', 'pedidas',
  ],
};

/**
 * Na 1ª pessoa do singular dos verbos em -ir, a última vogal da raiz alterna:
 * e→i (conferir → confiro, inserir → insiro) e o→u (dormir → durmo).
 * É exatamente o buraco que fazia "eu confiro" voltar como "não li".
 */
function alternarPrimeiraPessoa(raiz: string): string {
  for (let i = raiz.length - 1; i >= 0; i--) {
    const c = raiz[i];
    if (c === 'e') return raiz.slice(0, i) + 'i' + raiz.slice(i + 1);
    if (c === 'o') return raiz.slice(0, i) + 'u' + raiz.slice(i + 1);
    if ('aiu'.includes(c)) return raiz;
  }
  return raiz;
}

/** Formas do presente, pretérito, imperfeito, gerúndio e particípio — o que se escreve. */
function conjugar(infinitivo: string): string[] {
  const inf = normalizar(infinitivo);
  const irregular = IRREGULARES[inf];
  if (irregular) return irregular;

  const raiz = inf.slice(0, -2);
  const formas = new Set<string>([inf]);
  const add = (sufixos: string[]) => sufixos.forEach((s) => formas.add(raiz + s));

  if (inf.endsWith('ar')) {
    add(['o', 'a', 'as', 'amos', 'am', 'ei', 'ou', 'aram', 'ava', 'avam',
      'ando', 'ado', 'ada', 'ados', 'adas', 'ara', 'arao']);
  } else if (inf.endsWith('er')) {
    add(['o', 'e', 'es', 'emos', 'em', 'i', 'eu', 'eram', 'ia', 'iam',
      'endo', 'ido', 'ida', 'idos', 'idas', 'era', 'erao']);
  } else {
    add(['e', 'es', 'imos', 'em', 'i', 'iu', 'iram', 'ia', 'iam',
      'indo', 'ido', 'ida', 'idos', 'idas', 'ira', 'irao']);
    formas.add(alternarPrimeiraPessoa(raiz) + 'o');
    // -zir faz a 3ª sem terminação: produzir → produz, conduzir → conduz.
    if (raiz.endsWith('z')) formas.add(raiz);
  }
  return [...formas];
}

/** Plural de substantivo, no mínimo necessário: nota/notas, ligação/ligações. */
function pluralizar(base: string): string[] {
  const formas = [base, `${base}s`];
  if (base.endsWith('ao')) formas.push(`${base.slice(0, -2)}oes`);
  return formas;
}

/* ────────────────────────────────────────────────────────────────────────────
   Dicionário de classificação.

   Os verbos vêm do jeito que dono de PME brasileiro descreve processo —
   "joga na planilha", "passa pro financeiro" — não de vocabulário de consultoria.
   Só que ele descreve o PRÓPRIO trabalho: os termos entram no infinitivo e o motor
   gera 1ª e 3ª pessoa, passado, gerúndio e particípio.

   Três espécies de termo, porque três coisas diferentes:
     · verbo    — infinitivo; casa qualquer forma conjugada
     · palavra  — substantivo; casa singular e plural
     · frase    — literal de mais de uma palavra, com fronteira nas duas pontas

   `exige` e `veto` qualificam pelo objeto, que é o que separa "monta a proposta"
   (trabalho de escritório) de "monta a peça" (chão de fábrica) sem ter que escolher
   um dos dois para sempre.
   ──────────────────────────────────────────────────────────────────────────── */

type Especie = 'verbo' | 'palavra' | 'frase';

interface Termo {
  especie: Especie;
  base: string;
  /** Só casa se um destes tokens também estiver na etapa. */
  exige?: string[];
  /** Não casa se um destes tokens estiver na etapa. */
  veto?: string[];
}

const v = (base: string, q?: { exige?: string[]; veto?: string[] }): Termo => ({
  especie: 'verbo',
  base,
  ...q,
});
const p = (base: string): Termo => ({ especie: 'palavra', base });
const f = (base: string): Termo => ({ especie: 'frase', base });

/** Destinatário: o que transforma "mandar" em aviso e não em entrega de mensagem. */
const DESTINO = ['pro', 'pros', 'pra', 'pras', 'para', 'ao', 'aos'];
/** Objeto de escritório: papel que sai de dado que já existe. */
const DOC = [
  'ordem', 'ordens', 'documento', 'documentos', 'contrato', 'contratos', 'nota', 'notas',
  'laudo', 'minuta', 'cronograma', 'ficha', 'apresentacao', 'proposta', 'orcamento',
  'planilha', 'danfe', 'boleto', 'fatura', 'recibo', 'certificado', 'pedido', 'pedidos',
];
/** Objeto comercial: o que vai para o cliente e por isso tem régua sua. */
const COMERCIAL = ['proposta', 'propostas', 'orcamento', 'orcamentos', 'cotacao', 'cotacoes'];
/** Onde o dado é digitado. */
const SISTEMA = [
  'planilha', 'planilhas', 'sistema', 'sistemas', 'erp', 'excel', 'crm', 'tabela',
  'base', 'cadastro', 'estoque', 'banco',
];
/** Para onde a informação "vira" quando alguém a redigita. */
const SAIDA = ['planilha', 'relatorio', 'email', 'e-mail', 'sistema', 'pdf', 'documento', 'arquivo'];

interface Regra {
  categoria: Categoria;
  veredito: Veredito;
  minutos: number;
  motivo: string;
  termos: Termo[];
}

/**
 * A ORDEM IMPORTA, mas só no empate exato (mesmo peso, mesma posição na frase).
 * As regras específicas vêm primeiro para que "envia a proposta pro cliente" caia em
 * resposta, e não em notificação — as duas casam `enviar` no mesmo caractere.
 */
const REGRAS: Regra[] = [
  {
    categoria: 'documento',
    veredito: 'automatizavel',
    minutos: 10,
    motivo: 'documento montado a partir de dado que já existe — modelo mais dados',
    termos: [
      // `montar` estava em `presencial`: "monta a proposta no Word" e "Ordem de produção
      // montada à mão" voltavam como "acontece no mundo físico, 0 minuto". Em fala de PME
      // montar é, na maioria das vezes, trabalho de escritório — e quando não é, é o objeto
      // que diz. Daí `exige`.
      v('montar', { exige: DOC }),
      v('elaborar'),
      v('preparar', { exige: DOC }),
      v('emitir', { exige: DOC }),
      v('imprimir', { exige: DOC }),
    ],
  },
  {
    categoria: 'resposta',
    veredito: 'parcial',
    minutos: 8,
    motivo: 'resposta ao cliente — a máquina redige, você mantém a régua',
    termos: [
      v('responder'), v('retornar'), v('atender'), v('explicar'), v('apresentar'),
      v('enviar', { exige: COMERCIAL }), v('mandar', { exige: COMERCIAL }),
      v('fazer', { exige: COMERCIAL }),
    ],
  },
  {
    categoria: 'transcricao',
    veredito: 'automatizavel',
    minutos: 6,
    motivo: 'mesmo dado sendo redigitado em outro lugar',
    termos: [
      v('digitar'), v('redigitar'), v('copiar'), v('lancar'), v('cadastrar'),
      v('preencher'), v('transcrever'), v('alimentar'), v('inserir'), v('anotar'),
      v('registrar'), v('atualizar'),
      // "cola" sem objeto é cola de marcenaria em metade dos clientes-alvo.
      v('colar', { exige: SISTEMA }),
      // subir arquivo para dentro de um sistema é dado entrando na mão, não carga física.
      v('carregar', { exige: SISTEMA }), v('importar'),
      v('jogar', { exige: SISTEMA }),
      v('passar', { exige: SISTEMA }),
      // "a medição vira planilha, que vira relatório" — o dado atravessa formatos na mão.
      v('virar', { exige: SAIDA }),
    ],
  },
  {
    categoria: 'recebimento',
    veredito: 'automatizavel',
    minutos: 2,
    motivo: 'entrada de informação — dá para capturar na origem',
    termos: [
      v('receber'), v('chegar'), v('entrar'), v('pedir'),
      f('cai no'), f('cai na'),
      p('mensagem'), p('whatsapp'), p('zap'), p('email'), p('e-mail'),
      p('formulario'), p('ligacao'), p('telefone'), p('solicitacao'), p('demanda'),
      p('contato'), p('orcamento'),
    ],
  },
  {
    categoria: 'notificacao',
    veredito: 'automatizavel',
    minutos: 3,
    motivo: 'aviso de rotina — dispara sozinho quando o gatilho acontece',
    termos: [
      v('avisar'), v('comunicar'), v('notificar'),
      // `inform` casava "informação". `informar` conjugado não casa o substantivo.
      v('informar'),
      v('encaminhar'), v('repassar'), v('chamar'), v('alertar'), v('cobrar'),
      v('lembrar'), v('contatar'), v('confirmar'), v('acompanhar'),
      // "faço a entrega do relatório por e-mail" não é caminhão — e sem o objeto de
      // papel do lado, `entregar` fica sem regra nenhuma de propósito: entrega física
      // ambígua é melhor declarada como "não li" do que chutada como escritório.
      v('entregar', { exige: SAIDA }),
      // sem destinatário, "manda mensagem" é a mensagem CHEGANDO, não um aviso saindo.
      v('mandar', { exige: DESTINO }),
      v('enviar', { exige: DESTINO }),
      v('passar', { exige: DESTINO }),
      p('cobranca'), p('confirmacao'), p('lembrete'), p('follow-up'),
    ],
  },
  {
    categoria: 'consulta',
    veredito: 'automatizavel',
    minutos: 4,
    motivo: 'consulta a dado que já existe em algum sistema',
    termos: [
      v('conferir'), v('verificar'), v('checar'), v('consultar'), v('buscar'),
      v('procurar'), v('olhar'), v('pesquisar'), v('localizar'), v('levantar'),
      v('cotar'), v('comparar'), v('rastrear'),
      v('ver', { exige: SISTEMA }),
    ],
  },
  {
    categoria: 'calculo',
    veredito: 'automatizavel',
    minutos: 12,
    motivo: 'número derivado de dado que a operação já produziu',
    termos: [
      v('calcular'), v('somar'), v('totalizar'), v('consolidar'), v('apurar'),
      v('faturar'), v('compilar'), v('conciliar'),
      // `gera` casava "geralmente"; as formas de `gerar` não casam.
      v('gerar'),
      v('fechar', { exige: ['mes', 'caixa', 'folha', 'semana', 'competencia'] }),
      p('relatorio'), p('fechamento'), p('faturamento'), p('dashboard'), p('indicador'),
      f('planilha de'),
    ],
  },
  {
    categoria: 'arquivamento',
    veredito: 'automatizavel',
    minutos: 3,
    motivo: 'organização de arquivo — regra fixa, zero julgamento',
    termos: [
      v('salvar'), v('arquivar'), v('anexar'), v('guardar'), v('organizar'),
      v('renomear'), v('baixar'), v('digitalizar'), v('escanear'),
      v('subir', { exige: ['drive', 'nuvem', 'pasta', 'servidor', 'sharepoint'] }),
      v('fazer', { exige: ['backup'] }),
      p('backup'),
    ],
  },
  {
    categoria: 'agendamento',
    veredito: 'automatizavel',
    minutos: 6,
    motivo: 'marcação de horário — a agenda recebe sozinha e confirma sozinha',
    termos: [v('agendar'), v('remarcar'), v('reagendar'), p('agendamento')],
  },
  {
    categoria: 'decisao',
    veredito: 'humana',
    minutos: 5,
    motivo: 'decisão de negócio — automatizar isso seria terceirizar critério',
    termos: [
      v('aprovar'), v('autorizar'), v('decidir'), v('definir'), v('negociar'),
      v('assinar'), v('escolher'), v('julgar'), v('liberar'), v('avaliar'),
      p('desconto'),
    ],
  },
  {
    categoria: 'presencial',
    veredito: 'humana',
    minutos: 0,
    motivo: 'acontece no mundo físico',
    termos: [
      // Esvaziado para os inequívocos. Saíram: `monta` (foi para documento), `entrega`
      // ("faço a entrega do relatório por e-mail" não é caminhão) e `obra` como
      // substantivo solto ("Foto de obra que alguém precisa baixar" é arquivamento).
      v('visitar'), v('instalar', { veto: ['sistema', 'software', 'erp', 'app', 'programa'] }),
      v('carregar', { veto: SISTEMA }),
      // `montar` volta aqui só com objeto físico do lado: é o outro lado do B3.
      v('montar', {
        exige: ['peca', 'pecas', 'estrutura', 'maquina', 'maquinas', 'equipamento',
          'movel', 'moveis', 'andaime', 'estande', 'painel', 'kit'],
      }),
      v('transportar'), v('deslocar'),
      v('produzir', { veto: SAIDA }), v('fabricar'),
      f('vai ate'), f('vai no cliente'), f('vai na obra'),
      f('medicao no local'), f('chao de fabrica'),
    ],
  },
];

const CONECTORES = [
  'depois disso', 'depois que', 'em seguida', 'na sequencia', 'por fim',
  'por ultimo', 'ai entao', 'e entao', 'entao', 'depois', 'dai', 'ai a',
  'ai o', 'ai eu', 'quando isso', 'feito isso',
];

/* ────────────────────────────────────────────────────────────────────────────
   Índice. Montado uma vez, na carga do módulo: classificar passa a ser uma busca
   por token em Map, não 150 varreduras de string por etapa. O motor precisa continuar
   custando menos de 1 ms — é o número que a seção mostra na tela.
   ──────────────────────────────────────────────────────────────────────────── */

interface Entrada {
  regra: Regra;
  termo: Termo;
  ordem: number;
}

const INDICE = new Map<string, Entrada[]>();
const FRASES: (Entrada & { re: RegExp })[] = [];
/** Todas as formas verbais conhecidas — usado também pelo separador. */
const FORMAS_VERBAIS = new Set<string>();

REGRAS.forEach((regra, ordem) => {
  for (const termo of regra.termos) {
    const entrada: Entrada = { regra, termo, ordem };
    if (termo.especie === 'frase') {
      // fronteira nas duas pontas: `obra` nunca mais casa dentro de "sobra"
      FRASES.push({ ...entrada, re: new RegExp(`(?<![a-z0-9])${termo.base}(?![a-z0-9])`) });
      continue;
    }
    const formas = termo.especie === 'verbo' ? conjugar(termo.base) : pluralizar(termo.base);
    for (const forma of formas) {
      if (termo.especie === 'verbo') FORMAS_VERBAIS.add(forma);
      const lista = INDICE.get(forma);
      if (lista) lista.push(entrada);
      else INDICE.set(forma, [entrada]);
    }
  }
});

/* ────────────────────────────────────────────────────────────────────────────
   Separação em etapas.
   ──────────────────────────────────────────────────────────────────────────── */

interface Separacao {
  etapas: string[];
  /** Quantas etapas o texto tinha antes do teto. */
  detectadas: number;
}

function temVerbo(trecho: string, maxTokens: number): boolean {
  const tokens = tokenizar(trecho);
  const ate = Math.min(tokens.length, maxTokens);
  for (let i = 0; i < ate; i++) {
    if (FORMAS_VERBAIS.has(tokens[i].texto)) return true;
  }
  return false;
}

function cortar(frag: string, pontos: number[]): string[] {
  if (pontos.length === 0) return [frag];
  const pedacos: string[] = [];
  let inicio = 0;
  for (const ponto of pontos) {
    if (ponto > inicio) pedacos.push(frag.slice(inicio, ponto));
    inicio = ponto;
  }
  pedacos.push(frag.slice(inicio));
  return pedacos;
}

/** Conectores sequenciais ("depois", "em seguida") separam etapa de etapa. */
function cortarPorConector(frag: string): string[] {
  const plano = normalizar(frag);
  if (plano.length !== frag.length) return [frag];

  const pontos = new Set<number>();
  for (const c of CONECTORES) {
    let i = plano.indexOf(c);
    while (i !== -1) {
      const antes = i === 0 || /[\s,;.]/.test(plano[i - 1]);
      const fim = i + c.length;
      const depois = fim >= plano.length || /[\s,;.]/.test(plano[fim]);
      if (antes && depois && i > 0) pontos.add(i);
      i = plano.indexOf(c, fim);
    }
  }
  return cortar(frag, [...pontos].sort((a, b) => a - b));
}

/**
 * Vírgula e "e" separando etapas — mas só quando há AÇÃO dos dois lados.
 *
 * Era a falha nº 1 do motor: quatro etapas escritas sem ponto final viravam uma, e o
 * painel comemorava. Cortar em toda vírgula, porém, cria o erro oposto — "confere o
 * preço e a quantidade" viraria duas etapas, uma delas ilegível. A régua que separa os
 * dois casos é o verbo: só corta se o lado esquerdo já tem uma ação e o lado direito
 * começa com outra (dentro dos 3 primeiros tokens, que é onde o sujeito cabe).
 */
function cortarPorVerbo(frag: string): string[] {
  const plano = normalizar(frag);
  if (plano.length !== frag.length) return [frag];

  const pedacos: string[] = [];
  const re = /,\s+|\s+e\s+/g;
  // O separador é descartado, não herdado: cortar DEPOIS do " e " deixava a etapa
  // anterior terminando em "...na tabela e", que é lixo na tela do visitante.
  let inicio = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(plano)) !== null) {
    const fimEsquerda = m.index;
    const inicioDireita = m.index + m[0].length;
    if (!temVerbo(plano.slice(inicio, fimEsquerda), Infinity)) continue;
    if (!temVerbo(plano.slice(inicioDireita), 3)) continue;
    pedacos.push(frag.slice(inicio, fimEsquerda));
    inicio = inicioDireita;
  }
  pedacos.push(frag.slice(inicio));
  return pedacos;
}

function separarEtapas(texto: string): Separacao {
  let t = texto.normalize('NFC').replace(/\r/g, '');

  // Marcadores de lista e numeração viram quebra de linha — em início de linha
  // e também no meio do parágrafo, que é como muita gente escreve ("1. isso 2) aquilo").
  t = t.replace(/^[\s]*(?:[-•*–]|\d+[.)])\s+/gm, '\n');
  t = t.replace(/(?<=\S)\s+\d{1,2}[.)]\s+/g, '\n');

  const todas = t
    .split(/\n+|(?<=[.;!?])\s+/)
    .flatMap(cortarPorConector)
    .flatMap(cortarPorVerbo)
    .map((s) => s.replace(/^[\s\-–—•*:,;]+/, '').replace(/[\s.,;:]+$/, '').trim())
    .filter((s) => s.length >= 4);

  return { etapas: todas.slice(0, TETO_ETAPAS), detectadas: todas.length };
}

/* ────────────────────────────────────────────────────────────────────────────
   Classificação.
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * Termo qualificado por objeto é mais específico que termo solto, e ganha dele.
 * Frase NÃO compra prioridade: valia 2 e fazia "copia os dados pra planilha de leads"
 * cair em cálculo (a frase `planilha de`, lá no fim) em vez de transcrição (`copia`,
 * no começo). Entre termos de mesmo peso quem decide é a posição.
 */
const PESO = { qualificado: 3, frase: 1, simples: 1 } as const;

/**
 * Distância máxima, em tokens, entre o verbo e o objeto que o qualifica.
 * Sem janela, "manda mensagem no WhatsApp pedindo orçamento" casava `mandar`+`orcamento`
 * e virava "resposta ao cliente" — sendo que quem mandou foi o cliente. O objeto que
 * qualifica um verbo anda colado nele; a cinco tokens de distância é outra oração.
 * O `veto` continua valendo na frase inteira: freio de mão é melhor amplo que preciso.
 */
const JANELA_QUALIFICADOR = 4;

interface Achado {
  regra: Regra;
  peso: number;
  pos: number;
  ordem: number;
}

function melhorAchado(a: Achado, b: Achado): Achado {
  if (a.peso !== b.peso) return a.peso > b.peso ? a : b;
  // Empate de peso resolve pelo termo que aparece primeiro: o verbo principal da frase
  // costuma vir antes dos complementos.
  if (a.pos !== b.pos) return a.pos < b.pos ? a : b;
  return a.ordem <= b.ordem ? a : b;
}

function classificar(bruto: string): Omit<Etapa, 'n' | 'texto'> {
  const plano = normalizar(bruto);
  const tokens = tokenizar(plano);
  const presentes = new Set(tokens.map((t) => t.texto));

  let melhor: Achado | null = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const entradas = INDICE.get(token.texto);
    if (!entradas) continue;
    let janela: Set<string> | null = null;
    for (const { regra, termo, ordem } of entradas) {
      if (termo.veto?.some((q) => presentes.has(q))) continue;
      if (termo.exige) {
        // const local porque `janela` é `let` capturado em closure: o narrowing se perde.
        const vizinhos = (janela ??= new Set(
          tokens
            .slice(Math.max(0, i - JANELA_QUALIFICADOR), i + JANELA_QUALIFICADOR + 1)
            .map((t) => t.texto),
        ));
        if (!termo.exige.some((q) => vizinhos.has(q))) continue;
      }
      const achado: Achado = {
        regra,
        peso: termo.exige ? PESO.qualificado : PESO.simples,
        pos: token.pos,
        ordem,
      };
      melhor = melhor ? melhorAchado(melhor, achado) : achado;
    }
  }

  for (const { regra, re, ordem } of FRASES) {
    const pos = plano.search(re);
    if (pos === -1) continue;
    const achado: Achado = { regra, peso: PESO.frase, pos, ordem };
    melhor = melhor ? melhorAchado(melhor, achado) : achado;
  }

  if (!melhor) {
    // minutos: 0 é deliberado. Não reconhecer a etapa e ainda assim somar tempo a ela
    // seria inventar número — a coisa exata que este site não faz. Entra no mapa
    // marcada como "não li", e fica de fora da conta.
    return {
      categoria: 'indefinida',
      vereditoReal: 'nao_lida',
      veredito: 'parcial',
      minutos: 0,
      motivo: 'não reconheci o verbo — isso é conversa, não chute',
    };
  }

  const { regra } = melhor;
  return {
    categoria: regra.categoria,
    vereditoReal: regra.veredito,
    veredito: regra.veredito,
    minutos: regra.minutos,
    motivo: regra.motivo,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
   O motor.
   ──────────────────────────────────────────────────────────────────────────── */

export function mapear(texto: string, vezesPorSemana: number): Mapa {
  const trace: PassoTrace[] = [];
  const avisos: Aviso[] = [];
  const t0 = performance.now();

  // O site é lido por dono de PME brasileiro. "4 automatizável(is)" é linguagem de sistema;
  // pluralizar de verdade custa três linhas e é a diferença entre parecer produto e parecer log.
  const plural = (n: number, um: string, muitos: string) => `${n} ${n === 1 ? um : muitos}`;

  const marco = (op: string, detalhe: string, desde: number) => {
    trace.push({ op, detalhe, ms: Math.round((performance.now() - desde) * 1000) / 1000 });
  };

  let t = performance.now();
  const palavras = texto.trim().split(/\s+/).filter(Boolean).length;
  marco('leitura', `${texto.trim().length} caracteres · ${palavras} palavras`, t);

  t = performance.now();
  const { etapas: brutas, detectadas } = separarEtapas(texto);
  const detalheSeparacao = [plural(brutas.length, 'etapa identificada', 'etapas identificadas')];

  // O teto cortava em silêncio: 15 escritas, 12 no mapa, e o painel anunciava 12
  // como se fossem todas. Corte não declarado é o mesmo defeito do número inventado.
  if (detectadas > brutas.length) {
    const texto = `li as ${brutas.length} primeiras de ${detectadas} — o resto entra na conversa`;
    detalheSeparacao.push(texto);
    avisos.push({
      tipo: 'truncamento',
      texto: `Você escreveu ${detectadas} etapas e eu li as ${brutas.length} primeiras. As outras ficam de fora da conta — traz na conversa.`,
    });
  }

  // Acerto aparente: texto longo que virou uma etapa só. O motor não sabe QUAL é a
  // separação certa, mas sabe que a densidade está fora do normal — e dizer isso é
  // mais honesto que devolver 0,7 h/mês com um ✓ do lado.
  const densidade = brutas.length > 0 ? palavras / brutas.length : 0;
  if (brutas.length > 0 && densidade > PALAVRAS_POR_ETAPA_SUSPEITO) {
    detalheSeparacao.push(
      `${Math.round(densidade)} palavras por etapa — provavelmente li junto o que acontece separado`,
    );
    avisos.push({
      tipo: 'subsegmentacao',
      texto:
        brutas.length === 1
          ? `Li tudo isso como uma etapa só, e são ${palavras} palavras. Se ali dentro acontecem várias coisas, escreve uma por linha que o mapa fica certo.`
          : `Deu ${Math.round(densidade)} palavras por etapa. Pode ser que eu tenha juntado etapas diferentes — uma por linha e o mapa fica certo.`,
    });
  }
  marco('separação', detalheSeparacao.join(' · '), t);

  t = performance.now();
  const etapas: Etapa[] = brutas.map((b, i) => ({ n: i + 1, texto: b, ...classificar(b) }));
  const automatizaveis = etapas.filter((e) => e.vereditoReal === 'automatizavel').length;
  const parciais = etapas.filter((e) => e.vereditoReal === 'parcial').length;
  const humanas = etapas.filter((e) => e.vereditoReal === 'humana').length;
  const naoLidas = etapas.filter((e) => e.vereditoReal === 'nao_lida').length;

  const detalheClassificacao = [
    plural(automatizaveis, 'automatizável', 'automatizáveis'),
    plural(parciais, 'parcial', 'parciais'),
    plural(humanas, 'fica com você', 'ficam com você'),
  ];
  if (naoLidas > 0) {
    detalheClassificacao.push(plural(naoLidas, 'não lida', 'não lidas'));
    avisos.push({
      tipo: 'nao_lidas',
      texto: `${naoLidas === 1 ? 'Uma etapa' : `${naoLidas} etapas`} eu não consegui ler — ficam de fora da conta, não entram como chute.`,
    });
  }
  marco('classificação', detalheClassificacao.join(' · '), t);

  t = performance.now();
  const minutosExecucao = etapas.reduce((soma, e) => {
    if (e.vereditoReal === 'automatizavel') return soma + e.minutos;
    // Parcial devolve metade: a máquina redige, alguém ainda confere.
    if (e.vereditoReal === 'parcial') return soma + e.minutos / 2;
    // Humana e não lida somam zero — a segunda porque somar seria chutar.
    return soma;
  }, 0);
  const minutosSemana = minutosExecucao * vezesPorSemana;
  const horasMes = Math.round((minutosSemana * 4.33) / 60 * 10) / 10;
  const detalheEstimativa = [`${Math.round(minutosExecucao)} min por execução`, `${vezesPorSemana}×/semana`];
  if (naoLidas > 0) detalheEstimativa.push(plural(naoLidas, 'etapa fora da conta', 'etapas fora da conta'));
  marco('estimativa', detalheEstimativa.join(' · '), t);

  return {
    etapas,
    automatizaveis,
    parciais,
    humanas,
    naoLidas,
    minutosSemana,
    horasMes,
    vezesPorSemana,
    etapasDetectadas: detectadas,
    avisos,
    trace,
    totalMs: Math.round((performance.now() - t0) * 1000) / 1000,
  };
}

export const ROTULO_VEREDITO: Record<Veredito, string> = {
  automatizavel: 'automatizável',
  parcial: 'parcial',
  humana: 'fica com você',
};

/** Rótulos do veredito real. É este mapa que a §3 deve usar quando o gate do `.tsx` abrir. */
export const ROTULO_VEREDITO_REAL: Record<VereditoReal, string> = {
  ...ROTULO_VEREDITO,
  nao_lida: 'não li',
};

export const EXEMPLO =
  'O cliente manda mensagem no WhatsApp pedindo orçamento. Alguém lê e responde perguntando o que ele precisa. Depois copia os dados pra planilha de leads. Aí confere o preço na tabela e monta a proposta no Word. Por fim avisa o vendedor que tem proposta nova.';
