module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['packages/server*/*.{js,jsx,mjs}'],
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['js', 'json', 'jsx'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/lib/',
  ],
  setupFiles: ['<rootDir>/axios.config.js'],
  coverageReporters: ['lcov', 'clover', 'text', 'text-summary'],
  testEnvironment: 'node',
  bail: true,
  verbose: false,
};
