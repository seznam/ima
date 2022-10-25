const defaultConfig = require('../../jest.config.base.js');

module.exports = {
  ...defaultConfig,
  testEnvironment: 'jsdom',
  snapshotSerializers: ['enzyme-to-json/serializer'],
  transform: {
    '^.+\\.jsx?$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-react', { runtime: 'automatic' }],
          ['@babel/preset-env', { targets: { node: 16 } }],
        ],
      },
    ],
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(@uiw/react-textarea-code-editor)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // webpack alias
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
};
