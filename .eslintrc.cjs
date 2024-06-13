module.exports = {
  root: true,
  env: {
    node: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: __dirname,
      },
      node: true,
    },
  },
  plugins: ['@typescript-eslint', 'promise'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    // add under other rules
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:promise/recommended',
    'plugin:jsonc/recommended-with-jsonc',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    'jsonc/sort-keys': 'warn',

    '@typescript-eslint/method-signature-style': ['error', 'property'],

    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        pathGroups: [
          {
            pattern: '~/**',
            group: 'external',
            position: 'after',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['*.json', '*.json5'],
      parser: 'jsonc-eslint-parser',
    },
  ],
}
