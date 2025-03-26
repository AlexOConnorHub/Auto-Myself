// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin-ts';
import stylisticJs from '@stylistic/eslint-plugin-js';

export default tseslint.config({
  files: ['**/*.ts', '**/*.tsx'],
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
    "@stylistic/js/eol-last": ["error", "always"],
    '@stylistic/indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
  },
}
);
