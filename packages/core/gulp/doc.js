const del = require('del');
const gulp = require('gulp');
const change = require('gulp-change');
const jsdoc = require('gulp-jsdoc3');
const rename = require('gulp-rename');
const dir = {
  parent: `${ __dirname }/../`,
  docSrc: `${ __dirname }/../doc-src/`,
  doc: `${ __dirname }/../doc`
} 
const documentationPreprocessors = [
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
let config;

module.exports = (gulpConfig) => {
  config = gulpConfig;

  return gulp.series(docClear, docPreprocess, docGenerate, docClean);
};

function docClear() {
  return del([dir.docSrc, dir.doc]);
}

function docPreprocess() {
  return gulp
    .src(config.files.js)
    .pipe(change((content) => {
      let oldContent = null;

      while (content !== oldContent) {
        oldContent = content;
        for (let preprocessor of documentationPreprocessors) {
          let { pattern, replace } = preprocessor;
          content = content.replace(pattern, replace);
        }
      }

      return content;
    }))
    .pipe(rename(file => file.extname = '.js'))
    .pipe(gulp.dest(dir.docSrc));
}

function docGenerate(done) {
  gulp
    .src(
      [`${ dir.parent }README.md`, `${ dir.docSrc }**/*.{js,jsx}`],
      { read: false }
    )
    .pipe(jsdoc({
      opts: {
        destination: dir.doc
      },
      plugins: [
        'plugins/markdown'
      ]
    }, done));
}

function docClean() {
  return del(dir.docSrc);
}
