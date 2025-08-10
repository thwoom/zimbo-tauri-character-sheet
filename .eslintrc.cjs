/* eslint-disable no-undef */
module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  settings: { react: { version: 'detect' } },
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'eslint-config-prettier', // keep last
  ],
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'import/order': [
      'warn',
      { 'newlines-between': 'never', alphabetize: { order: 'asc', caseInsensitive: true } },
    ],
  },
};
