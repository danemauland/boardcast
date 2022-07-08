const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

const moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' });

module.exports = {
  testRegex: '/tests/unit/',
  moduleNameMapper: {
    ...moduleNameMapper
  },
  transformIgnorePatterns: [
    "^.+node_modules\/(?!(filter-obj\/index\.js))"
  ],
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+filter-obj\/index\.js$': 'ts-jest',
  },
  testEnvironment: 'node',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
  ],
  coveragePathIgnorePatterns: [
    '(tests/.*.mock).(jsx?|tsx?)$',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/dist',
    '<rootDir>/.build',
    '<rootDir>/.serverless',
  ],
  setupFilesAfterEnv: [
    './tests/utils/setup/init-unit-tests.ts',
  ],
  maxConcurrency: 15
};
