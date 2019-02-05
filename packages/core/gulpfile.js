const gulpConfig = {
  files: {
    js: [
      `${__dirname}/main.js`,
      `${__dirname}/namespace.js`,
      `${__dirname}/Bootstrap.js`,
      `${__dirname}/ObjectContainer.js`,
      `${__dirname}/vendorLinker.js`,
      `${__dirname}/!(node_modules|doc|dist|gulp|polyfill|docs|utils)/**/!(*Spec).js`
    ]
  },
  parentDir: __dirname
};

exports.build = require('./gulp/build')(gulpConfig);
exports.doc = require('./gulp/doc')(gulpConfig);
