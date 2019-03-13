const del = require('del');
let config;
let parentDir;

module.exports = gulpConfig => {
  config = gulpConfig;
  parentDir = config.parentDir;

  return clean;
};

function clean() {
  return del(`${parentDir}/dist`);
}
