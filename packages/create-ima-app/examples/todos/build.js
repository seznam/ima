let mainjs = ['./app/main.js'];

let js = ['./app/!(assets|gulp)/**/!(*Spec).{js,jsx}'];

let less = [
  './app/assets/less/app.less',
  './app/assets/bower/todomvc-common/base.css',
  './app/assets/bower/todomvc-app-css/index.css',
  './app/component/**/*.less',
  './app/page/**/*.less'
];

let languages = {
  en: ['./app/**/*EN.json']
};

let vendors = {
  common: [],

  server: [{ '@ima/core': '@ima/core/dist/ima.server.cjs.js' }],

  client: [{ '@ima/core': '@ima/core/dist/ima.client.cjs.js' }],

  test: []
};

let bundle = {
  js: [
    './build/static/js/polyfill.js',
    './build/static/js/shim.js',
    './build/static/js/vendor.client.js',
    './build/static/js/app.client.js'
  ],
  es: [
    './build/static/js/polyfill.es.js',
    './build/static/js/shim.es.js',
    './build/static/js/vendor.client.es.js',
    './build/static/js/app.client.es.js'
  ],
  css: ['./build/static/css/app.css']
};

if (
  process.env.NODE_ENV === 'dev' ||
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === undefined
) {
  vendors.common.push('@ima/plugin-websocket');
  vendors.common.push('@ima/plugin-hot-reload');
}

module.exports = {
  js,
  mainjs,
  less,
  languages,
  vendors,
  bundle
};
