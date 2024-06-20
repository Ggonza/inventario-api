module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.mjs$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'json', 'mjs'],
  testMatch: ['**/test/**/*.test.(js|mjs)'],
};
