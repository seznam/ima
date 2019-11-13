const js = [
  './node_modules/@ima/core/**/!(vendorLinker|gulpfile|build|test|*Spec).{js,jsx}',
  '!./node_modules/@ima/core/polyfill/*.js'
];

const vendors = {
  common: ['@ima/helpers', 'classnames', 'react', 'react-dom', 'memoize-one'],

  server: ['react-dom/server.js'],

  client: [],

  test: ['@ima/core/test.js', 'react-test-renderer', 'enzyme']
};

module.exports = {
  js,
  vendors
};
