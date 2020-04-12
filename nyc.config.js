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
    'workspace/spa/files/js/scripts.js',
    '**/gulpfile.js',
    '**/babel.config.js',
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
    'text',
    'text-summary',
    'html',
  ],
  all: true,
};
