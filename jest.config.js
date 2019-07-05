const ignorePatterns = ['/lib/', '/__tests__/fixtures/'];
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ignorePatterns,
  modulePathIgnorePatterns: ignorePatterns,
  coveragePathIgnorePatterns: ignorePatterns,
};
