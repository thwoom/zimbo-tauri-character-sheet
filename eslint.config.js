import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const compat = new FlatCompat({
  baseDirectory: import.meta.url ? new URL('.', import.meta.url).pathname : undefined,
});

export default [
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      'coverage',
      '.next',
      '.out',
      'storybook-static',
      '.github',
    ],
  },
  js.configs.recommended,
  ...compat.config({
    env: { browser: true, es2021: true, node: true },
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
    },
    settings: { react: { version: 'detect' } },
    plugins: ['react', 'react-hooks', 'jsx-a11y', 'import'],
    extends: [
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended',
      'plugin:import/recommended',
      'eslint-config-prettier',
    ],
    overrides: [
      {
        files: ['**/*.test.js', '**/*.test.jsx', '**/*.test.ts', '**/*.test.tsx'],
        env: { jest: true },
      },
    ],
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'import/order': [
        'warn',
        { 'newlines-between': 'never', alphabetize: { order: 'asc', caseInsensitive: true } },
      ],
    },
  }),
];
