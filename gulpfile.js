const gulpConfig = {
  files: {
    js: [`packages/core/src/**/!(*Spec).js`],
    ts: [`packages/core/src/**/!(*Spec).ts*`],
  },
  tsProject: 'packages/core/tsconfig.json',
};

exports.doc = require('./utils/gulp/doc')(gulpConfig);
