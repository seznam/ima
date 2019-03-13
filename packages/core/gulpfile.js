const gulpConfig = {
  parentDir: __dirname
};

exports.doc = require('./gulp/doc')(gulpConfig);
exports.build = require('./gulp/build')(gulpConfig);
exports.clean = require('./gulp/clean')(gulpConfig);
