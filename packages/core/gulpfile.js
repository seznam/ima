const gulpConfig = {
  parentDir: __dirname
};

exports.build = require('./gulp/build')(gulpConfig);
exports.clean = require('./gulp/clean')(gulpConfig);
