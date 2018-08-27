const js = [
  './node_modules/ima/**/!(vendorLinker|gulpfile|build|test|*Spec).{js,jsx}',
  '!./node_modules/ima/polyfill/*.js'
];

const mainjs = ['./node_modules/ima/main.js'];

const vendors = {
  common: [
    'ima-helpers',
    'classnames',
    'react',
    'react-dom',
    'prop-types',
    'consume-multiple-contexts'
  ],

  server: ['react-dom/server.js'],

  client: [],

  test: ['ima/test.js', 'react-test-renderer', 'enzyme']
};

module.exports = {
  js,
  mainjs,
  vendors
};
