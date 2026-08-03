#!/usr/bin/env node
/**
 * GATE — verifica em disco se uma fase do WORKFLOW-SITES.md terminou de verdade.
 *
 * Existe porque a regra em prosa não segurou: o histórico deste projeto é de pular da
 * referência direto para o código. Um comando que sai com exit 1 segura; um lembrete não.
 *
 * Uso:
 *   node gate.cjs <f0|f1|f2|f3|f4|f5|f6> [--projeto <dir>]
 *   node gate.cjs todos
 *
 * Sai 0 se a fase passou, 1 se faltou artefato.
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const fase = (args[0] || '').toLowerCase();
const idxP = args.indexOf('--projeto');
const RAIZ = idxP > -1 ? args[idxP + 1] : path.resolve(__dirname, '..');

const existe = (p) => fs.existsSync(path.join(RAIZ, p));
const lista = (p) => {
  try { return fs.readdirSync(path.join(RAIZ, p)); } catch { return []; }
};
const pesoMB = (p) => {
  const dir = path.join(RAIZ, p);
  if (!fs.existsSync(dir)) return 0;
  let total = 0;
  const andar = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) andar(f);
      else total += fs.statSync(f).size;
    }
  };
  andar(dir);
  return Math.round((total / 1024 / 1024) * 100) / 100;
};

/** Cada checagem devolve {ok, msg}. Nada aqui aceita "está quase". */
const FASES = {
  f0: {
    nome: 'F0 · Rota',
    checar: () => {
      if (!existe('00-context/ROTA.md')) return { ok: false, msg: 'falta 00-context/ROTA.md' };
      const t = fs.readFileSync(path.join(RAIZ, '00-context/ROTA.md'), 'utf8');
      const temRota = /rota\s*[ab]\b/i.test(t);
      return temRota
        ? { ok: true, msg: 'rota declarada' }
        : { ok: false, msg: 'ROTA.md existe mas nao nomeia "Rota A" ou "Rota B"' };
    },
  },
  f1: {
    nome: 'F1 · Referência',
    checar: () => {
      const dirs = lista('02-references/inputs').filter((d) =>
        fs.existsSync(path.join(RAIZ, '02-references/inputs', d, 'pages')),
      );
      if (dirs.length < 5) return { ok: false, msg: `so ${dirs.length} referencias capturadas (min 5)` };
      const doc = lista('02-references').some((f) => /^REFERENCIAS.*\.md$/i.test(f));
      if (!doc) return { ok: false, msg: `${dirs.length} capturas, mas falta REFERENCIAS*.md` };
      return { ok: true, msg: `${dirs.length} referencias capturadas + dossie` };
    },
  },
  f2: {
    nome: 'F2 · Sistema visual',
    checar: () => {
      const temDesign = existe('04-tokens/DESIGN.md');
      const temTokens = existe('04-tokens/tokens.json');
      if (!temDesign || !temTokens) {
        return { ok: false, msg: `falta ${!temDesign ? '04-tokens/DESIGN.md ' : ''}${!temTokens ? '04-tokens/tokens.json' : ''}`.trim() };
      }
      // contraste precisa estar CALCULADO, com numero na folha
      const t = fs.readFileSync(path.join(RAIZ, '04-tokens/DESIGN.md'), 'utf8');
      if (!/\d+[.,]\d+\s*:\s*1/.test(t)) {
        return { ok: false, msg: 'DESIGN.md sem razao de contraste calculada (ex: "8,26:1")' };
      }
      return { ok: true, msg: 'tokens + contraste calculado' };
    },
  },
  f3: {
    nome: 'F3 · Matéria-prima',
    checar: () => {
      const mb = pesoMB('03-assets');
      if (mb < 1.5) {
        return {
          ok: false,
          msg: `03-assets tem ${mb} MB (min 1,5). Mediana dos premiados: 6 MB. Talos rejeitado tinha 0,4 MB`,
        };
      }
      return { ok: true, msg: `${mb} MB de materia-prima` };
    },
  },
  f4: {
    nome: 'F4 · Mockup aprovado',
    checar: () => {
      // Avalia SEMPRE o mockup de maior versao: 'mockup' = v1, 'mockup-v2' = v2, etc.
      // Antes o caminho era '05-build/mockup' fixo, entao o gate media o mockup REPROVADO
      // de 28/Jul enquanto o trabalho vivia em mockup-v2/. Corrigido em 02/Ago/2026.
      const versao = (d) => {
        const m = /^mockup(?:-v(\d+))?$/.exec(d);
        return m ? Number(m[1] || 1) : null;
      };
      const dirs = lista('05-build')
        .map((d) => ({ d, v: versao(d) }))
        .filter((x) => x.v !== null && fs.statSync(path.join(RAIZ, '05-build', x.d)).isDirectory())
        .sort((a, b) => b.v - a.v);

      if (!dirs.length) return { ok: false, msg: 'falta 05-build/mockup/ com as telas' };

      const alvo = dirs[0].d;
      const base = `05-build/${alvo}`;
      const paginas = lista(base).filter((f) => /\.(png|jpg|jpeg|webp|html)$/i.test(f));
      // as telas renderizadas ficam em shots/ (v1) ou shots-vN/ (demais)
      const shotsDir = dirs[0].v === 1 ? '05-build/shots' : `05-build/shots-v${dirs[0].v}`;
      const telas = lista(shotsDir).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));

      if (!paginas.length && !telas.length) {
        return { ok: false, msg: `${base}/ existe mas nao tem pagina nem tela renderizada` };
      }
      const resumo = `${alvo}/ (${paginas.length} pagina(s) + ${telas.length} tela(s))`;

      if (!existe(`${base}/APROVADO.md`)) {
        const antigos = dirs.slice(1).map((x) => x.d);
        const nota = antigos.length ? ` — versoes anteriores ignoradas: ${antigos.join(', ')}` : '';
        return { ok: false, msg: `${resumo}, mas falta ${base}/APROVADO.md com o aval do founder${nota}` };
      }
      return { ok: true, msg: `${resumo} aprovado` };
    },
  },
  f5: {
    nome: 'F5 · Build',
    checar: () => {
      // o gate real do build sao os comandos; aqui so garante que o app existe
      const apps = fs.existsSync('D:/AIOS/apps') ? fs.readdirSync('D:/AIOS/apps') : [];
      return apps.length
        ? { ok: true, msg: 'rodar tsc + build + teste sem JS manualmente' }
        : { ok: false, msg: 'nenhum app encontrado' };
    },
  },
  f6: {
    nome: 'F6 · A/B',
    checar: () => {
      const shots = lista('05-build/shots').filter((f) => /\.(png|jpg|jpeg)$/i.test(f));
      return shots.length >= 2
        ? { ok: true, msg: `${shots.length} capturas para comparar` }
        : { ok: false, msg: 'falta 05-build/shots/ com as capturas do A/B' };
    },
  },
};

const rodar = (k) => {
  const f = FASES[k];
  const r = f.checar();
  console.log(`${r.ok ? '✅' : '❌'} ${f.nome.padEnd(24)} ${r.msg}`);
  return r.ok;
};

console.log(`projeto: ${RAIZ}\n`);

if (fase === 'todos') {
  const res = Object.keys(FASES).map(rodar);
  const falhou = res.filter((x) => !x).length;
  console.log(`\n${res.length - falhou}/${res.length} fases completas`);
  process.exit(falhou ? 1 : 0);
} else if (FASES[fase]) {
  process.exit(rodar(fase) ? 0 : 1);
} else {
  console.error('uso: node gate.cjs <f0|f1|f2|f3|f4|f5|f6|todos> [--projeto <dir>]');
  process.exit(2);
}
