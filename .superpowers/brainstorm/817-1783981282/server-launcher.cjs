const { spawn } = require('node:child_process');

const env = {
  ...process.env,
  BRAINSTORM_DIR: 'D:\\AIOS\\.superpowers\\brainstorm\\817-1783981282',
  BRAINSTORM_HOST: '127.0.0.1',
  BRAINSTORM_URL_HOST: 'localhost',
  BRAINSTORM_PORT: '54718',
};

const child = spawn(
  process.execPath,
  ['D:\\AIOS\\.agents\\skills\\brainstorming\\scripts\\server.cjs'],
  { env, stdio: 'inherit' },
);

child.on('exit', (code) => process.exit(code ?? 1));
