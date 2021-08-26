module.exports = {
    preset: 'ts-jest/presets/js-with-ts',
    roots: ["<rootDir>/tst", "<rootDir>/src"],
    testEnvironment: 'node',
    moduleDirectories: ['node_modules', 'src']
  };