// ESLint local do app Contador (F1.5): o config da raiz do AIOS não define globals de
// browser, o que quebrava o build com no-undef em navigator/setTimeout/window dentro de
// componentes "use client". Para arquivos TypeScript, no-undef é redundante e sabidamente
// falho — o tsc (verde) é a fonte de verdade para identificadores; o ESLint cuida do resto.
// Mesmo padrão já adotado em apps/noyce/eslint.config.js.
const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  js.configs.recommended,
  {
    ignores: ['.next/**', 'node_modules/**', 'tsconfig.tsbuildinfo'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      'no-undef': 'off', // tsc cobre — browser/node globals validados pelo TypeScript
      'no-unused-vars': 'off', // idem (noUnusedLocals do tsc quando ligado)
    },
  },
];
