const path = require('path');

const corePath = path.join(__dirname, 'packages/core');
const gulpConfig = {
  files: {
    js: [
      `${corePath}/main.js`,
      `${corePath}/namespace.js`,
      `${corePath}/Bootstrap.js`,
      `${corePath}/ObjectContainer.js`,
      `${corePath}/vendorLinker.js`,
      `${corePath}/!(node_modules|doc|dist|gulp|polyfill|docs|utils)/**/!(*Spec).js`
    ]
  }
};

exports.doc = require('./utils/gulp/doc')(gulpConfig);
