export default {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {},
  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/test/__mocks__/styleMock.js',
  },
};


