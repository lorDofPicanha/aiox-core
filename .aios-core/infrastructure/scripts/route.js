#!/usr/bin/env node
/**
 * AIOS Task Router — decide o melhor destino para uma tarefa, agnóstico de CLI.
 *
 * Roda em QUALQUER host (Codex, Claude, Gemini, Cursor, Antigravity) porque depende
 * só de node + arquivos. Para cada tarefa, classifica e recomenda UM destino:
 *
 *   - codex   → delegação programática (execução, refactor, bulk)   [auto-exec]
 *   - gemini  → classificação / bulk barato (Flash)                 [auto-exec]
 *   - jarvis  → consulta de especialista (mind clones)              [auto-exec]
 *   - claude  → raciocínio profundo / alto risco → HANDOFF interativo
 *               (NUNCA claude -p: Constitution Art. VII). Você abre uma sessão
 *               Claude interativa, cola o prompt e traz o output de volta.
 *   - current → trivial: faça direto na CLI atual.
 *
 * USAGE:
 *   node .aios-core/infrastructure/scripts/route.js "sua tarefa em linguagem natural"
 *   node .aios-core/infrastructure/scripts/route.js --exec "refatore o módulo X"   # auto-roda delegate p/ alvos programáticos
 *   node .aios-core/infrastructure/scripts/route.js --json "..."                    # saída machine-readable
 *   echo "tarefa longa..." | node .aios-core/infrastructure/scripts/route.js -
 *
 * FLAGS:
 *   --exec     executa o delegate automaticamente para codex|gemini|jarvis (claude sempre é handoff)
 *   --json     imprime a recomendação como JSON
 */

'use strict';

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

// Auto-load repo .env (zero-dep) so provider keys are available without manual export.
try { require('./lib/load-env').loadEnv(); } catch { /* .env optional */ }

const DELEGATE = path.join(__dirname, 'delegate.js');
const HANDOFF_DIR = path.join(__dirname, '..', '..', 'tmp', 'route-handoff');

let TaskComplexityClassifier = null;
try {
  ({ TaskComplexityClassifier } = require('../../core/orchestration/task-complexity-classifier'));
} catch {
  TaskComplexityClassifier = null;
}

// Sinais por destino (PT + EN). Casados como substring lowercase.
const SIGNALS = {
  claude: [
    'arquitetura', 'architecture', 'design de sistema', 'trade-off', 'tradeoff',
    'decisão', 'decisao', 'estratég', 'strategy', 'revis', 'review', 'avalie', 'avaliar',
    'análise profunda', 'analise profunda', 'legal', 'contrato', 'jurídic', 'juridic',
    'threat model', 'ameaça', 'sintetiz', 'synthesize', 'racioc', 'reasoning',
    'justifique', 'compare as opções', 'compare as opcoes', 'qual a melhor', 'por que',
  ],
  jarvis: [
    'consult', 'especialista', 'opinião', 'opiniao', 'expert', 'pricing', 'preço', 'preco',
    ' ux', 'schema', 'devo usar', 'qual abordagem', 'mind clone', 'conclave', 'segunda opinião',
  ],
  gemini: [
    'classifiqu', 'classify', 'categoriz', 'triagem', 'triage', 'rotul', 'etiquet',
    'em massa', 'bulk', 'lista de', 'para cada item', 'dedup', 'extrair campos', 'planilha',
  ],
  codex: [
    'implement', 'refator', 'refactor', 'crie', 'criar', 'corrig', 'fix', 'bug', 'build',
    'compil', 'teste', 'testes', 'escrev', 'scaffold', 'migra', 'migrate', 'script',
    'endpoint', 'função', 'funcao', 'componente', 'execut', 'varredura', 'rename across',
  ],
  current: [
    'typo', 'rename ', 'format', 'lint', 'ajuste pequeno', 'one-liner',
    'pequena correção', 'pequena correcao', 'muda só', 'mude só', 'muda so', 'mude so',
  ],
};

const REASONS = {
  claude: 'Raciocínio profundo / alto risco — melhor no Claude interativo (qualidade de raciocínio; subscription inalterado). NUNCA claude -p (Art. VII).',
  jarvis: 'Pede conhecimento de especialista — roteie para os mind clones (jarvis), file-based e sem billing de LLM.',
  gemini: 'Classificação / bulk barato — Gemini Flash resolve com o menor custo.',
  codex: 'Execução / código / volume — Codex é a superfície primária programática.',
  current: 'Tarefa trivial — faça direto na CLI atual, sem delegar.',
};

function parseArgs(argv) {
  const opts = { exec: false, json: false, _positional: [] };
  for (const a of argv) {
    if (a === '--exec') opts.exec = true;
    else if (a === '--json') opts.json = true;
    else opts._positional.push(a);
  }
  return opts;
}

function readStdin() {
  try { return fs.readFileSync(0, 'utf8').trim(); } catch { return ''; }
}

function countSignals(text, list) {
  let n = 0;
  for (const kw of list) if (text.includes(kw)) n += 1;
  return n;
}

function classify(task) {
  const text = ` ${task.toLowerCase()} `;
  const scores = {
    claude: countSignals(text, SIGNALS.claude),
    jarvis: countSignals(text, SIGNALS.jarvis),
    gemini: countSignals(text, SIGNALS.gemini),
    codex: countSignals(text, SIGNALS.codex),
    current: countSignals(text, SIGNALS.current),
  };

  // Complexidade como desempate (reaproveita o classificador existente).
  let complexity = { level: 'medium', score: 0.5 };
  if (TaskComplexityClassifier) {
    try { complexity = new TaskComplexityClassifier().classify({ description: task }); } catch { /* keep default */ }
  }
  if (complexity.level === 'complex') scores.claude += 1; // alto risco tende ao Claude
  if (complexity.level === 'simple') scores.current += 1;

  // argmax; empate/zero → default por complexidade.
  let target = null;
  let best = 0;
  for (const k of ['claude', 'jarvis', 'gemini', 'codex', 'current']) {
    if (scores[k] > best) { best = scores[k]; target = k; }
  }
  if (!target) {
    target = complexity.level === 'complex' ? 'claude'
      : complexity.level === 'simple' ? 'current' : 'codex';
  }
  return { target, scores, complexity };
}

function writeHandoff(task) {
  fs.mkdirSync(HANDOFF_DIR, { recursive: true });
  const id = new Date().toISOString().replace(/[:.]/g, '-');
  const file = path.join(HANDOFF_DIR, `${id}.md`);
  const ret = path.join(HANDOFF_DIR, `${id}.output.md`);
  fs.writeFileSync(file, `# Handoff para Claude interativo\n\n## Tarefa\n${task}\n\n## Output (cole o resultado abaixo ao voltar)\n`, 'utf8');
  return { file, ret };
}

function delegateCmd(target, task) {
  if (target === 'jarvis') {
    return `node .aios-core/infrastructure/scripts/delegate.js --to jarvis "${task.replace(/"/g, '\\"')}"`;
  }
  return `node .aios-core/infrastructure/scripts/delegate.js --to ${target} "${task.replace(/"/g, '\\"')}"`;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const promptArg = opts._positional.filter((p) => p !== '-').join(' ').trim();
  const task = promptArg || readStdin();
  if (!task) {
    console.error('route: nenhuma tarefa fornecida (arg ou stdin)');
    process.exit(1);
  }

  const { target, scores, complexity } = classify(task);

  if (opts.json) {
    const out = { target, reason: REASONS[target], scores, complexity, handoff: target === 'claude' };
    if (target !== 'claude' && target !== 'current') out.command = delegateCmd(target, task);
    console.log(JSON.stringify(out, null, 2));
    process.exit(0);
  }

  const icon = { claude: '🧩', codex: '⚙️', gemini: '⚡', jarvis: '🔮', current: '✅' }[target];
  console.log(`🧭 ROTA: ${icon} ${target.toUpperCase()}  (complexidade: ${complexity.level})`);
  console.log(`   Porquê: ${REASONS[target]}`);
  console.log('   ────');

  if (target === 'claude') {
    const { file, ret } = writeHandoff(task);
    console.log('   🔀 HANDOFF (interativo — não dá pra auto-rodar sem claude -p):');
    console.log(`      1. Abra uma sessão Claude interativa (terminal/IDE).`);
    console.log(`      2. Cole o prompt salvo em: ${file}`);
    console.log(`      3. Traga o output de volta — cole em: ${ret} (ou direto na sessão atual).`);
    process.exit(0);
  }

  if (target === 'current') {
    console.log('   Faça direto aqui na CLI atual — não vale a pena delegar.');
    process.exit(0);
  }

  // programmatic targets: codex | gemini | jarvis
  const cmd = delegateCmd(target, task);
  if (opts.exec) {
    console.log(`   ▶ executando: ${cmd}\n`);
    const args = ['--to', target, task];
    const res = spawnSync('node', [DELEGATE, ...args], { stdio: 'inherit', encoding: 'utf8' });
    process.exit(res.status === null ? 1 : res.status);
  } else {
    console.log(`   ▶ rode (ou re-chame com --exec):`);
    console.log(`      ${cmd}`);
    process.exit(0);
  }
}

main();
