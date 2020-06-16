const gulp = require('gulp');
const concat = require('gulp-concat');
const gulpLess = require('gulp-less');
const path = require('path');
const plumber = require('gulp-plumber');
const postCss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

exports.__requiresConfig = true;

exports.default = (gulpConfig) => {
  let files = gulpConfig.files;

  function less() {
    function fixPipe(stream) {
      let origPipe = stream.pipe;
      stream.pipe = function (dest) {
        arguments[0] = dest.on('error', (error) => {
          let nextStreams = dest._nextStreams;
          if (nextStreams) {
            nextStreams.forEach((nextStream) =>
              nextStream.emit('error', error)
            );
          } else if (dest.listeners('error').length === 1) {
            throw error;
          }
        });
        let nextStream = fixPipe(origPipe.apply(this, arguments));
        (this._nextStreams || (this._nextStreams = [])).push(nextStream);
        return nextStream;
      };
      return stream;
    }

    return fixPipe(gulp.src(files.less.src))
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(
        concat({
          path: files.less.name,
          base: files.less.base,
          cwd: files.less.cwd
        })
      )
      .pipe(gulpLess({ paths: [path.join(__dirname)] }))
      .pipe(postCss(gulpConfig.files.less.postCssPlugins))
      .pipe(sourcemaps.write())
      .pipe(plumber.stop())
      .pipe(gulp.dest(files.less.dest));
  }

  return {
    less
  };
};
