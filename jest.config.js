// jest.config.js
module.exports = {
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'jsx'],
    moduleDirectories: ['node_modules'],
    moduleNameMapper: {
      '\\.(css|less)$': 'identity-obj-proxy',
    },
  };
  