module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks'
  ],
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  env: {
    browser: true,
    jest: true,
    es6: true,
    node: true,
  },
  rules: {
    'prefer-destructuring': 'off',
    'import/prefer-default-export': ['off'],
    'import/no-extraneous-dependencies': ['error', { 'devDependencies': ['**/tests/**', 'scripts/**'] }],
    "react/jsx-filename-extension": [1, { "extensions": [".tsx"] }],
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "no-underscore-dangle":  ["error", { "allow": ["__CONFIG__"] }],
    "react/require-default-props": "off",
    'react/jsx-props-no-spreading': 'off',
    'import/no-extraneous-dependencies': 'off'
  },
  settings: {
    // allows service folders to create aliases for absolute imports
    'import/resolver': {
      node: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
      typescript: {
        project: 'services/*/tsconfig.json',
      },
    },
    'import/core-modules': [
      'aws-lambda',
    ],
  },
};
