/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/tests/**/*.test.ts'],
  testTimeout: 30000,
  moduleFileExtensions: ['ts', 'js', 'json'],
};
