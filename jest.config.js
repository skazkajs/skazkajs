module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['packages/server*/*.{js,jsx,mjs}'],
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['js', 'json', 'jsx'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/',
    '/lib/',
    '/es/',
  ],
  setupFiles: ['<rootDir>/axios.config.js'],
  testEnvironment: 'node',
  bail: true,
  verbose: false,
};
