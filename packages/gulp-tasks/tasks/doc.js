let del = require('del');
let gulp = require('gulp');
let change = require('gulp-change');
let jsdoc = require('gulp-jsdoc3');
let rename = require('gulp-rename');

exports.__requiresConfig = true;

exports.default = gulpConfig => {
  let files = gulpConfig.files;
  let documentationPreprocessors;

  function docClean() {
    return del('./doc-src');
  }

  function docGenerate(done) {
    // Unfortunately, JSDoc invokes the callback for every file. Because of
    // this, we have to handle the done callback invocation in a little
    // bit more complicated way
    const COMPLETION_TIMEOUT = 1000; // milliseconds
    let completionTimeout = null;

    gulp.src(['./README.md', './doc-src/**/*.{js,jsx}'], { read: false }).pipe(
      jsdoc(
        {
          opts: {
            destination: './doc'
          },
          plugins: ['plugins/markdown']
        },
        () => {
          if (completionTimeout) {
            clearTimeout(completionTimeout);
          }
          completionTimeout = setTimeout(done, COMPLETION_TIMEOUT);
        }
      )
    );
  }

  function docPreprocess() {
    return gulp
      .src(files.app.src)
      .pipe(
        change(content => {
          let oldContent = null;

          while (content !== oldContent) {
            oldContent = content;
            for (let preprocessor of documentationPreprocessors) {
              let { pattern, replace } = preprocessor;
              content = content.replace(pattern, replace);
            }
          }

          return content;
        })
      )
      .pipe(rename(file => (file.extname = '.js')))
      .pipe(gulp.dest('./doc-src'));
  }

  function docClear() {
    return del(['./doc-src', './doc']);
  }

  documentationPreprocessors = [
    {
      pattern: /\/[*][*]((?:a|[^a])*?)@(type|param|return)\s*[{]([^}]*?)([a-zA-Z0-9_., *<>|]+)\[\]([^}]*)[}]((a|[^a])*)[*]\//g,
      replace: '/**$1@$2 {$3Array<$4>$5}$6*/'
    },
    {
      pattern: /\/[*][*]((?:a|[^a])*?)[{]@code(?:link)? ([^}]*)[}]((a|[^a])*)[*]\//g,
      replace: '/**$1<code>$2</code>$3*/'
    },
    {
      pattern: /^\s*export\s+default\s+/gm,
      replace: ''
    }
  ];

  return {
    doc: gulp.series(docClear, docPreprocess, docGenerate, docClean)
  };
};
