module.exports = {
    transform: {
      '^.+\\.m?[tj]sx?$': 'babel-jest',
    },
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'mjs'],
    testMatch: ['**/__tests__/**/*.mjs', '**/?(*.)+(spec|test).mjs'],
  };
  