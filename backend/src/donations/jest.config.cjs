const path = require('node:path');

const rootDir = path.resolve(__dirname, '../..');

// TypeScript 6 requiere rootDir explícito para la transformación de Jest.
module.exports = {
  rootDir,
  testEnvironment: 'node',
  testRegex: 'src/donations/.*\\.spec\\.ts$',
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: { rootDir } }],
  },
  collectCoverageFrom: ['src/donations/**/*.ts', '!src/donations/**/*.spec.ts', '!src/donations/dto/*.ts', '!src/donations/donations.module.ts'],
  coverageDirectory: './coverage/donations',
};
