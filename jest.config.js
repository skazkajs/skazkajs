module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['packages/server*/*.{js,jsx,mjs}'],
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['js', 'json', 'jsx'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/coverage/'],
  setupFiles: ['<rootDir>/axios.config.js'],
  testEnvironment: 'node',
  bail: true,
  verbose: false,
};
