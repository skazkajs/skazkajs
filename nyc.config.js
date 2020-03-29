/* istanbul ignore file */
module.exports = {
  extension: ['.js', '.jsx'],
  require: [
    './testHelper.js',
  ],
  include: [
    'packages',
    'workspace',
  ],
  exclude: [
    'node_modules',
    'build',
    'dist',
    'testHelper.js',
    'babel.config.js',
    '**/*.test.js',
    '**/*.test.jsx',
    'packages/skazka',
    'workspace/serverless/index.js',
    'workspace/spa/dist/js/scripts.js',
  ],
  'report-dir': 'coverage',
  'check-coverage': true,
  'per-file': false,
  statements: 0,
  branches: 0,
  functions: 0,
  lines: 0,
  reporter: [
    'lcov',
    'text-summary',
    'html',
  ],
  all: true,
};
