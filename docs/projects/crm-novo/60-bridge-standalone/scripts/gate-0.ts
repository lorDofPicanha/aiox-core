import { spawn } from 'node:child_process';

interface GateStep {
  id: string;
  command: string;
  args: string[];
}

const pnpmBin = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

const gateSteps: GateStep[] = [
  { id: 'env-smoke', command: pnpmBin, args: ['env:smoke'] },
  { id: 'google-probe', command: pnpmBin, args: ['google:probe'] },
  { id: 'live-smoke', command: pnpmBin, args: ['live:smoke'] },
  { id: 'security-smoke', command: pnpmBin, args: ['security:smoke'] },
  { id: 'typecheck', command: pnpmBin, args: ['typecheck'] },
  { id: 'build', command: pnpmBin, args: ['build'] },
];

function runStep(step: GateStep): Promise<number> {
  return new Promise((resolve, reject) => {
    console.log(`\n[gate:0] ${step.id}`);

    const child =
      process.platform === 'win32'
        ? spawn([step.command, ...step.args].join(' '), {
            shell: true,
            stdio: 'inherit',
            windowsHide: true,
          })
        : spawn(step.command, step.args, {
            shell: false,
            stdio: 'inherit',
            windowsHide: true,
          });

    child.on('error', reject);
    child.on('close', (code) => resolve(code ?? 1));
  });
}

async function main(): Promise<void> {
  for (const step of gateSteps) {
    const code = await runStep(step);

    if (code !== 0) {
      console.error(`[gate:0] failed at ${step.id} with exit code ${code}`);
      process.exitCode = code;
      return;
    }
  }

  console.log('\n[gate:0] pass');
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
