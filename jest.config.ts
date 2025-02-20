module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.(spec|test).ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
