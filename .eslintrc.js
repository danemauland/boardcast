module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  extends: [
    'airbnb-typescript',
    "plugin:react-hooks/recommended"
  ],
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  env: {
    browser: false,
    jest: true,
    es6: true,
    node: true,
  },
  rules: {
    'prefer-destructuring': 'off',
    'import/prefer-default-export': ['off'],
    'import/no-extraneous-dependencies': ['error', { 'devDependencies': ['**/tests/**', 'scripts/**'] }],
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
