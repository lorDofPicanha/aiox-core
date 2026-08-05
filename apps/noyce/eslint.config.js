// ESLint local do app Noyce (12/Jun): o config da raiz do AIOS não tem globals de browser,
// o que quebrava o build com no-undef em window/document/Blob/IndexedDB. Para arquivos
// TypeScript, no-undef é redundante e sabidamente falho — o tsc (verde no CI deste app)
// é a fonte de verdade para identificadores; o ESLint fica com o resto das regras JS.
const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  js.configs.recommended,
  {
    ignores: ['.next/**', 'node_modules/**', 'tsconfig.tsbuildinfo'],
  },
  {
    files: ['eslint.config.js'],
    languageOptions: {
      globals: { require: 'readonly', module: 'readonly' },
    },
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
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        URL: 'readonly',
        Blob: 'readonly',
        Buffer: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        fetch: 'readonly',
        AbortController: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        structuredClone: 'readonly',
      },
    },
  },
];
