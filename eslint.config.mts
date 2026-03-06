import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin-ts';
import stylisticJs from '@stylistic/eslint-plugin-js';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    ignores: ['**/*.js', '**/*.jsx'],
    plugins: {
      '@stylistic': stylistic,
      '@stylistic/js': stylisticJs,
    },
    extends: [
      eslint.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.stylistic,
    ],
    rules: {
      '@stylistic/js/eol-last': ['error', 'always'],
      '@stylistic/indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      '@stylistic/js/brace-style': ['error', '1tbs'],
      '@stylistic/js/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/js/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/js/comma-style': ['error', 'last'],
      '@stylistic/js/func-call-spacing': ['error', 'never'],
      '@stylistic/js/key-spacing': [
        'error',
        { beforeColon: false, afterColon: true },
      ],
      '@stylistic/js/keyword-spacing': ['error', { before: true, after: true }],
      '@stylistic/js/no-multi-spaces': ['error'],
      '@stylistic/js/no-trailing-spaces': ['error'],
      '@stylistic/js/object-curly-spacing': ['error', 'always'],
      '@stylistic/js/space-before-blocks': ['error', 'always'],
      '@stylistic/js/space-in-parens': ['error', 'never'],
      '@stylistic/js/space-infix-ops': ['error'],
      '@stylistic/js/space-unary-ops': ['error'],
    },
  },
]);
