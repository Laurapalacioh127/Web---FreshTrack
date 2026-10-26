const path = require('node:path');

const rootDir = path.resolve(__dirname, '../..');

module.exports = {
  rootDir,
  testEnvironment: 'node',
  testRegex: 'src/recipes/.*\\.spec\\.ts$',
  moduleFileExtensions: ['js', 'json', 'ts'],

  extensionsToTreatAsEsm: ['.ts'],

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          rootDir,
          module: 'ESNext',
          moduleResolution: 'Bundler',
        },
      },
    ],
  },

  collectCoverageFrom: [
    'src/recipes/**/*.ts',
    '!src/recipes/**/*.spec.ts',
    '!src/recipes/dto/*.ts',
    '!src/recipes/recipes.module.ts',
  ],

  coverageDirectory: './coverage/recipes',
};
