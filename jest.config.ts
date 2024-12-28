//  integrate Jest with Next.js

const nextJest = require('next/jest') 

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  // automatically handling things like loading your next.config.js and .env files during testing.
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/__tests__/jest.setup.ts'], // setup.ts file is used to configure things like mock libraries or global settings for tests.
  // testEnvironment: 'jest-environment-jsdom', // Defines the environment in which Jest tests will run (browser-like environment suitable for testing React components.)
  testEnvironment: 'node', //  ensure Prisma runs in the correct environment during tests, it does not run in browser or browser-like environemnt
  moduleNameMapper: { // Maps module paths to specific directories, simplifying imports during testing.
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    '^@/utils/(.*)$': '<rootDir>/src/lib/utils/$1',
  },
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'] // Only match test files with ".test.ts" or ".test.js" temp excluding jest.setup.ts
}

module.exports = createJestConfig(customJestConfig)