module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  verbose: true,
  coverageProvider: 'v8',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: ['**/*.spec.ts'],
  collectCoverageFrom: ['src/**/*.ts']
};
