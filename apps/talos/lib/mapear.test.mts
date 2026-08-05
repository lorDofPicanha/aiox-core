/**
 * SUÍTE DO MOTOR — `node lib/mapear.test.mjs` (Node ≥ 22.18, type-stripping nativo).
 *
 * Por que `.mjs` e não `.ts`: o runner é o Node cru, sem dependência nova. Um
 * `mapear.test.ts` precisaria importar `./mapear.ts` com extensão explícita, e isso
 * exige `allowImportingTsExtensions` no `tsconfig.json` — mexer no tsconfig do app
 * está fora do escopo travado desta correção. O `.mjs` fica invisível para o
 * `tsc --noEmit` (que inclui `**\/*.ts`) e para o bundle do Next (ninguém o importa).
 *
 * Os 16 processos abaixo são cópia LITERAL de `components/CasosDeUso.tsx`. Se aquela
 * lista mudar, esta tem que mudar junto — o `.tsx` não pode ser importado aqui
 * (JSX + React) e o gate visual do founder proíbe tocá-lo agora.
 */

import { mapear, EXEMPLO, ROTULO_VEREDITO_REAL } from './mapear.ts';

/* ── harness mínimo ────────────────────────────────────────────────────────── */

let passou = 0;
let falhou = 0;
const falhas = [];

function check(nome, condicao, detalhe = '') {
  if (condicao) {
    passou++;
    console.log(`  ok   ${nome}${detalhe ? ` — ${detalhe}` : ''}`);
  } else {
    falhou++;
    falhas.push(nome);
    console.log(`  FALHA ${nome}${detalhe ? ` — ${detalhe}` : ''}`);
  }
}

function titulo(t) {
  console.log(`\n${t}\n${'─'.repeat(t.length)}`);
}

/** Uma etapa só: atalho para os testes de classificação. */
function classificar(texto) {
  const m = mapear(texto, 1);
  return m.etapas[0] ?? { categoria: '(vazio)', vereditoReal: '(vazio)', minutos: 0 };
}

const resumo = (m) =>
  `${m.etapas.length} etapa(s) [${m.etapas.map((e) => e.categoria).join(' + ')}] · ${m.horasMes} h/mês`;

/* ── B1 · fronteira de palavra ─────────────────────────────────────────────── */

titulo('B1 · radical solto casando dentro de outra palavra');

const B1 = [
  { entrada: 'geralmente faço isso', erradoAntes: 'calculo', casavaCom: 'gera' },
  { entrada: 'sobra material no fim', erradoAntes: 'presencial', casavaCom: 'obra' },
  { entrada: 'a balança pesa a carga', erradoAntes: 'transcricao', casavaCom: 'lanca' },
  { entrada: 'preciso da informação certa', erradoAntes: 'notificacao', casavaCom: 'inform' },
];

for (const caso of B1) {
  const e = classificar(caso.entrada);
  check(
    `"${caso.entrada}" não cai mais em ${caso.erradoAntes} (casava com \`${caso.casavaCom}\`)`,
    e.categoria !== caso.erradoAntes,
    `agora: ${e.categoria} · ${e.minutos} min`,
  );
}

// A contraprova: o radical continua casando quando é a palavra de verdade.
const contraprova = [
  ['o sistema gera o boleto', 'calculo'],
  ['visita a obra do cliente', 'presencial'],
  ['lança a nota no sistema', 'transcricao'],
  ['informa o financeiro', 'notificacao'],
];
for (const [entrada, esperado] of contraprova) {
  const e = classificar(entrada);
  check(`"${entrada}" ainda casa ${esperado}`, e.categoria === esperado, `veio: ${e.categoria}`);
}

/* ── B2 · 1ª pessoa vs 3ª pessoa ───────────────────────────────────────────── */

titulo('B2 · pares mínimos de conjugação (o dono descreve o PRÓPRIO processo)');

const PARES = [
  ['eu confiro a nota', 'ele confere a nota'],
  ['eu mando pro contador', 'ele manda pro contador'],
  ['eu fecho o mês', 'ele fecha o mês'],
  ['eu busco no sistema', 'ele busca no sistema'],
  ['eu salvo no drive', 'ele salva no drive'],
  ['eu copio pra planilha', 'ele copia pra planilha'],
  ['eu respondo o cliente', 'ele responde o cliente'],
  ['eu aviso o financeiro', 'ele avisa o financeiro'],
  ['eu emito a nota', 'ele emite a nota'],
  ['eu lanço no sistema', 'ele lança no sistema'],
  ['eu digito no ERP', 'ele digita no ERP'],
  ['eu organizo as fotos', 'ele organiza as fotos'],
  ['eu apuro o resultado', 'ele apura o resultado'],
  ['eu aprovo o desconto', 'ele aprova o desconto'],
  ['eu faço a proposta', 'ele faz a proposta'],
  ['eu insiro no cadastro', 'ele insere no cadastro'],
];

for (const [primeira, terceira] of PARES) {
  const a = classificar(primeira);
  const b = classificar(terceira);
  check(
    `"${primeira}" ≡ "${terceira}"`,
    a.categoria === b.categoria && a.categoria !== 'indefinida',
    `1ª: ${a.categoria}/${a.minutos}min · 3ª: ${b.categoria}/${b.minutos}min`,
  );
}

/* ── B3 · monta ────────────────────────────────────────────────────────────── */

titulo('B3 · `monta` não é mundo físico quando o objeto é papel');

for (const entrada of [
  'monta a proposta no Word',
  'Ordem de produção montada à mão',
  'montamos o orçamento à mão',
  'Documento montado a partir de um modelo',
]) {
  const e = classificar(entrada);
  check(
    `"${entrada}" sai de presencial`,
    e.categoria !== 'presencial' && e.categoria !== 'indefinida',
    `agora: ${e.categoria} · ${e.minutos} min`,
  );
}

// E o inverso continua valendo: montagem com objeto físico não vira papel.
const fisico = classificar('o time monta a estrutura no galpão');
check(
  '"monta a estrutura no galpão" não vira documento',
  fisico.categoria !== 'documento',
  `veio: ${fisico.categoria}`,
);

const entregaRelatorio = classificar('faço a entrega do relatório por e-mail');
check(
  '"faço a entrega do relatório por e-mail" → notificação (3 min), não cálculo (12 min)',
  entregaRelatorio.categoria === 'notificacao',
  `veio: ${entregaRelatorio.categoria} · ${entregaRelatorio.minutos} min`,
);

const produzRelatorio = classificar('produzimos o relatório mensal');
check(
  '"produzimos o relatório mensal" não é presencial (veto de objeto)',
  produzRelatorio.categoria !== 'presencial',
  `veio: ${produzRelatorio.categoria}`,
);

/* ── B4 · acerto aparente ──────────────────────────────────────────────────── */

titulo('B4 · sub-segmentação silenciosa — o pior resultado do sistema');

const COLAPSO =
  'o vendedor manda o pedido por email a gente ve se tem material no estoque monta a ordem de producao e o PCP programa a maquina';
const mColapso = mapear(COLAPSO, 5);
check(
  'texto de 4 etapas sem pontuação dispara aviso de sub-segmentação',
  mColapso.avisos.some((a) => a.tipo === 'subsegmentacao'),
  resumo(mColapso),
);
check(
  'o aviso aparece no trace (é o único canal que a §3 já renderiza)',
  mColapso.trace.some((p) => p.op === 'separação' && p.detalhe.includes('palavras por etapa')),
  mColapso.trace.find((p) => p.op === 'separação')?.detalhe ?? '',
);

const PLACEHOLDER =
  'chega um pedido no WhatsApp, alguém copia pra planilha,\ndepois avisa o financeiro';
const mPlaceholder = mapear(PLACEHOLDER, 5);
check(
  'o placeholder do próprio textarea agora lê 3 etapas',
  mPlaceholder.etapas.length === 3,
  resumo(mPlaceholder),
);

const VIRGULAS = 'chega um pedido no whatsapp, alguém copia pra planilha, avisa o financeiro, o vendedor confere o preço';
const mVirgulas = mapear(VIRGULAS, 5);
check('4 etapas separadas só por vírgula viram 4', mVirgulas.etapas.length === 4, resumo(mVirgulas));

const NAO_CORTA = 'confere o preço e a quantidade';
const mNaoCorta = mapear(NAO_CORTA, 5);
check(
  '"e" sem verbo do outro lado NÃO corta (não inventa etapa ilegível)',
  mNaoCorta.etapas.length === 1,
  resumo(mNaoCorta),
);

const CURTO = mapear('Agendamento por telefone que ocupa a recepção o dia inteiro', 5);
check(
  'etapa legitimamente única não dispara falso alarme',
  !CURTO.avisos.some((a) => a.tipo === 'subsegmentacao'),
  resumo(CURTO),
);

/* ── B5 · truncamento ──────────────────────────────────────────────────────── */

titulo('B5 · o teto de 12 etapas precisa falar');

const QUINZE = [
  'recebo o pedido por email',
  'confiro o estoque no sistema',
  'copio os dados pra planilha',
  'calculo o preço final',
  'monto a proposta no Word',
  'mando a proposta pro cliente',
  'aguardo e cobro o retorno',
  'aprovo o desconto',
  'emito a nota fiscal',
  'aviso o financeiro',
  'salvo o pdf no drive',
  'agendo a entrega',
  'atualizo o cronograma',
  'gero o relatório da semana',
  'arquivo tudo na pasta do cliente',
].join('\n');
const mQuinze = mapear(QUINZE, 2);
check('15 etapas escritas são detectadas', mQuinze.etapasDetectadas === 15, `detectadas: ${mQuinze.etapasDetectadas}`);
check('o mapa continua com o teto de 12', mQuinze.etapas.length === 12);
check(
  'o corte é declarado no aviso',
  mQuinze.avisos.some((a) => a.tipo === 'truncamento'),
  mQuinze.avisos.find((a) => a.tipo === 'truncamento')?.texto ?? '(nenhum)',
);
check(
  'o corte é declarado no trace',
  mQuinze.trace.some((p) => p.op === 'separação' && p.detalhe.includes('de 15')),
  mQuinze.trace.find((p) => p.op === 'separação')?.detalhe ?? '',
);

/* ── B6 · veredito próprio para "não li" ───────────────────────────────────── */

titulo('B6 · "não li" deixa de ser "parcial"');

const mNaoLida = mapear('sobra material no fim do lote xyz', 5);
const eNaoLida = mNaoLida.etapas[0];
check('vereditoReal é nao_lida', eNaoLida.vereditoReal === 'nao_lida', `veio: ${eNaoLida.vereditoReal}`);
check('categoria continua indefinida', eNaoLida.categoria === 'indefinida');
check('minutos = 0 (não inventa número)', eNaoLida.minutos === 0);
check('contador naoLidas separado de parciais', mNaoLida.naoLidas === 1 && mNaoLida.parciais === 0,
  `naoLidas: ${mNaoLida.naoLidas} · parciais: ${mNaoLida.parciais}`);
check('rótulo do veredito real existe', ROTULO_VEREDITO_REAL.nao_lida === 'não li');
check(
  'campo `veredito` segue compatível com o Record<Veredito,string> do Demo.tsx',
  ['automatizavel', 'parcial', 'humana'].includes(eNaoLida.veredito),
  `veredito(compat): ${eNaoLida.veredito}`,
);

const mMista = mapear('respondo o cliente\nsobra material no fim do lote xyz', 5);
check(
  'parcial de verdade e não-lida convivem sem se confundir',
  mMista.parciais === 1 && mMista.naoLidas === 1,
  `parciais: ${mMista.parciais} · naoLidas: ${mMista.naoLidas}`,
);

/* ── Os 16 processos da §4 (CasosDeUso.tsx) ────────────────────────────────── */

titulo('Os 16 processos de CasosDeUso.tsx (antes: 16/16 em 1 etapa · 5/16 "não li")');

const CASOS = [
  // Indústria
  'Pedido chega por e-mail ou WhatsApp e alguém redigita no ERP',
  'Ordem de produção montada à mão a partir da carteira',
  'Follow-up de entrega que depende de alguém lembrar',
  'Relatório de produção compilado na planilha toda segunda',
  // Comércio
  'Orçamento pedido no WhatsApp fora do horário e respondido no dia seguinte',
  'Estoque conferido em dois sistemas que não conversam',
  'Cliente que comprou uma vez e nunca mais foi contatado',
  'Nota emitida manualmente a cada venda',
  // Serviços
  'Agendamento por telefone que ocupa a recepção o dia inteiro',
  'Confirmação de consulta feita uma a uma na véspera',
  'Documento montado a partir de um modelo e preenchido na mão',
  'Cobrança que depende de alguém olhar a planilha de vencimentos',
  // Projeto e obra
  'Medição de campo que vira planilha, que vira relatório, que vira e-mail',
  'Fornecedor cotado por três canais diferentes sem histórico',
  'Cronograma atualizado à mão quando algo atrasa',
  'Foto de obra que alguém precisa baixar, renomear e arquivar',
];

let casosNaoLidos = 0;
let casosUmaEtapa = 0;
let casosPresencial = 0;

for (const caso of CASOS) {
  const m = mapear(caso, 5);
  if (m.naoLidas > 0) casosNaoLidos++;
  if (m.etapas.length === 1) casosUmaEtapa++;
  if (m.etapas.some((e) => e.categoria === 'presencial')) casosPresencial++;
  console.log(`  · ${caso}`);
  console.log(`      → ${resumo(m)}`);
}

check(`nenhum dos 16 volta "não li"`, casosNaoLidos === 0, `com não-lida: ${casosNaoLidos}/16`);
check(`nenhum dos 16 volta "acontece no mundo físico"`, casosPresencial === 0, `presencial: ${casosPresencial}/16`);
check(`os que têm 2+ ações são separados`, casosUmaEtapa < 16, `ainda em 1 etapa: ${casosUmaEtapa}/16 (antes: 16/16)`);

/* ── Desempate: janela do qualificador e peso de frase ─────────────────────── */

titulo('Desempate — a parte mais frágil da correção, então tem guarda');

const DESEMPATE = [
  // objeto colado no verbo qualifica; a cinco tokens de distância, não.
  ['manda a proposta pro cliente', 'resposta'],
  ['O cliente manda mensagem no WhatsApp pedindo orçamento', 'recebimento'],
  ['manda pro contador a planilha fechada', 'notificacao'],
  // frase não compra prioridade sobre o verbo que veio antes
  ['copia os dados pra planilha de leads', 'transcricao'],
  ['carrega a planilha no sistema', 'transcricao'],
  ['carrega o material no caminhão', 'presencial'],
];
for (const [entrada, esperado] of DESEMPATE) {
  const e = classificar(entrada);
  check(`"${entrada}" → ${esperado}`, e.categoria === esperado, `veio: ${e.categoria}`);
}

/* ── Regressão: o EXEMPLO do botão "usar um exemplo" ───────────────────────── */

titulo('Regressão · EXEMPLO (o único texto que o motor já lia bem)');

const mExemplo = mapear(EXEMPLO, 5);
console.log(`  ${resumo(mExemplo)}`);
for (const e of mExemplo.etapas) {
  console.log(`   ${String(e.n).padStart(2, '0')} ${e.categoria.padEnd(13)} ${e.minutos.toString().padStart(2)} min  ${e.texto}`);
}
// Mudou de 5 para 6 de propósito, e o texto do EXEMPLO não foi tocado: a frase
// "Aí confere o preço na tabela e monta a proposta no Word" são duas ações, e o
// separador por verbo passou a enxergar isso. Verificado à mão antes de mexer aqui.
check('lê 6 etapas (era 5: "confere o preço" e "monta a proposta" agora se separam)',
  mExemplo.etapas.length === 6, `veio: ${mExemplo.etapas.length}`);
check('nenhuma etapa termina no separador ("...na tabela e")',
  mExemplo.etapas.every((e) => !/\s+e$/.test(e.texto)));
check('nenhuma etapa não lida', mExemplo.naoLidas === 0, `naoLidas: ${mExemplo.naoLidas}`);
check('"monta a proposta no Word" não é mais presencial/0min',
  !mExemplo.etapas.some((e) => e.categoria === 'presencial'));
check('a conta continua de pé', mExemplo.horasMes > 0, `${mExemplo.horasMes} h/mês`);
check('sem falso alarme de sub-segmentação', !mExemplo.avisos.some((a) => a.tipo === 'subsegmentacao'));

/* ── Regra 1 e 2 do arquivo: roda no navegador, sem teatro ─────────────────── */

titulo('Regras do projeto');

check('o trace carrega tempo real medido (4 passos)', mExemplo.trace.length === 4,
  mExemplo.trace.map((p) => `${p.op} ${p.ms}ms`).join(' · '));
check('total abaixo de 5 ms (o número que a seção mostra na tela)', mExemplo.totalMs < 5,
  `${mExemplo.totalMs} ms`);
check('etapa não reconhecida vale 0 minuto',
  mapear('xablau frangaria borogodó zunzum', 5).minutosSemana === 0);

/* ── Placar ────────────────────────────────────────────────────────────────── */

console.log(`\n${'='.repeat(62)}`);
console.log(`  ${passou} passaram · ${falhou} falharam`);
if (falhou > 0) {
  console.log('\n  Falhas:');
  falhas.forEach((f) => console.log(`   · ${f}`));
}
console.log(`${'='.repeat(62)}\n`);

process.exitCode = falhou > 0 ? 1 : 0;
