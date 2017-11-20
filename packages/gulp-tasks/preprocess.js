let babel = require('babel-core');

module.exports = {
  process: function(src, filename) {
    if (filename.endsWith('.js') || filename.endsWith('.jsx')) {
      return babel.transform(src, {
        filename,
        presets: ['react'],
        plugins: ['transform-es2015-modules-commonjs'],
        retainLines: true
      }).code;
    }

    return src;
  }
};
