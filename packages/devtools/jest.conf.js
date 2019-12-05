const defaultConfig = require('../../jest.conf.js');

module.exports = {
  ...defaultConfig,
  testEnvironment: 'jsdom',
  modulePaths: ['<rootDir>/node_modules/', '<rootDir>/', '<rootDir>/src/'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy'
  }
};
