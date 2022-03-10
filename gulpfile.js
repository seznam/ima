const gulpConfig = {
  files: {
    js: [`packages/core/src/**/!(*Spec).js`],
  },
};

exports.doc = require('./utils/gulp/doc')(gulpConfig);
