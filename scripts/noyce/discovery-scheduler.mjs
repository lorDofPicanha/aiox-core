#!/usr/bin/env node
// Run modes:
//   node --experimental-strip-types scripts/noyce/discovery-scheduler.mjs            # one run + log (default)
//   node --experimental-strip-types scripts/noyce/discovery-scheduler.mjs --loop     # daemon, repeats every --interval-min
//   ... --interval-min 60                                                            # loop interval (default 60)
//   ... -- --days 60 --out <path>                                                    # everything after `--` is forwarded to the build
/**
 * Hourly DISCOVERY scheduler for Noyce.
 *
 * Wraps the canonical 500 km discovery builder, which has bounded retries,
 * per-request/run timeouts, and guards that never overwrite a healthy snapshot with
 * an empty or partial run. This scheduler adds only:
 *   - timed repetition (--loop) so the snapshot stays fresh on its own, and
 *   - structured run logging (scripts/noyce/discovery-runs.log) so a degraded PNCP
 *     (the HikariPool 500s, see doc 22) is VISIBLE instead of silently leaving a
 *     stale snapshot. No silent failure.
 *
 * For production on Windows, prefer --once driven by Task Scheduler (survives reboot,
 * no babysat process): see register-discovery-task.ps1. The --loop daemon is for a
 * terminal / PM2 / container.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const BUILD = path.join(ROOT, 'apps', 'noyce', 'scripts', 'noyce', 'build-discovery-500km.mjs');
const LOG = path.join(__dirname, 'discovery-runs.log');

function parseArgs(argv) {
  const a = { loop: false, intervalMin: 60, forward: [] };
  const sepIdx = argv.indexOf('--');
  const head = sepIdx === -1 ? argv : argv.slice(0, sepIdx);
  if (sepIdx !== -1) a.forward = argv.slice(sepIdx + 1);
  for (let i = 0; i < head.length; i++) {
    if (head[i] === '--loop') a.loop = true;
    else if (head[i] === '--interval-min') a.intervalMin = Number(head[++i]);
    else if (head[i] === '--once') a.loop = false;
  }
  if (!Number.isFinite(a.intervalMin) || a.intervalMin < 1) a.intervalMin = 60;
  return a;
}

const ARGS = parseArgs(process.argv.slice(2));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function logLine(obj) {
  const line = JSON.stringify({ ts: new Date().toISOString(), ...obj });
  // Console for live view + append to the durable run log.
  console.log(line);
  try {
    fs.appendFileSync(LOG, line + '\n', 'utf8');
  } catch (e) {
    console.error(`scheduler: falha ao gravar log ${LOG}: ${e.message}`);
  }
}

// Parse the build's own summary so each run logs items/queries even on success.
function parseSummary(stdout) {
  const out = {};
  const itens = stdout.match(/(?:itens únicos:|✅\s+)(\d+)/);
  if (itens) out.items = Number(itens[1]);
  const q = stdout.match(/(?:queries ok=|"okQueries":)(\d+)(?:\s+fail=|[^\d]+"failQueries":)(\d+)/);
  if (q) { out.okQueries = Number(q[1]); out.failQueries = Number(q[2]); }
  const aborted = /ABORTADO sem escrever|snapshot 500 km não publicado/.test(stdout);
  if (aborted) out.aborted = true;
  return out;
}

function runOnce() {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn(
      process.execPath,
      ['--experimental-strip-types', BUILD, ...ARGS.forward],
      { cwd: ROOT },
    );
    let stdout = '', stderr = '';
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('close', (code) => {
      const summary = parseSummary(stdout + '\n' + stderr);
      const durationMs = Date.now() - started;
      // ok = build wrote a fresh snapshot. aborted (anti-empty guard) is a soft failure:
      // exit 1 but the previous good snapshot is intentionally preserved.
      const status = code === 0 ? 'ok' : summary.aborted ? 'preserved_stale' : 'error';
      logLine({
        event: 'discovery_run',
        status,
        exitCode: code,
        durationMs,
        ...summary,
        ...(status === 'error' && stderr ? { error: stderr.trim().split('\n').slice(-3).join(' | ') } : {}),
      });
      resolve({ code, status });
    });
    child.on('error', (e) => {
      logLine({ event: 'discovery_run', status: 'spawn_error', error: e.message });
      resolve({ code: 1, status: 'spawn_error' });
    });
  });
}

async function main() {
  logLine({ event: 'scheduler_start', mode: ARGS.loop ? 'loop' : 'once', intervalMin: ARGS.loop ? ARGS.intervalMin : undefined, forward: ARGS.forward });

  // Always run immediately.
  const result = await runOnce();

  if (!ARGS.loop) {
    if (result.code !== 0) process.exitCode = Number.isInteger(result.code) ? result.code : 1;
    return;
  }

  let stopping = false;
  const stop = (sig) => { stopping = true; logLine({ event: 'scheduler_stop', signal: sig }); process.exit(0); };
  process.on('SIGINT', () => stop('SIGINT'));
  process.on('SIGTERM', () => stop('SIGTERM'));

  // Loop on interval. setInterval would overlap if a run exceeds the interval; a
  // sleep-after-finish cadence is safer for a flaky upstream.
  while (!stopping) {
    await sleep(ARGS.intervalMin * 60 * 1000);
    if (stopping) break;
    await runOnce();
  }
}

main().catch((e) => { logLine({ event: 'scheduler_fatal', error: e.stack || e.message }); process.exitCode = 1; });
