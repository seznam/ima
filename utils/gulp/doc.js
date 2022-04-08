const change = require('gulp-change');
const del = require('del');
const fs = require('fs-extra');
const gulp = require('gulp');
const jsdoc2md = require('jsdoc-to-markdown');
const map = require('map-stream');
const packageData = require('../../package.json');
const lernaData = require('../../lerna.json');
const rename = require('gulp-rename');
const merge = require('merge-stream');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const getSource = require('get-source');

const DOC_SRC = 'doc-src';
const FILENAME_REGEX = /(\/|\.jsx|\.js|\.tsx|\.ts)/g;

const dir = {
  doc: `${__dirname}/../../docs/`,
  docData: `${__dirname}/../../docs/_data/`,
  docPartials: `${__dirname}/../../docs/_partials/`,
  docTsSourcemaps: `${__dirname}/../../docs/_ts_sourcemaps/`,
  docPosts: `${__dirname}/../../docs/_posts/`,
  docSass: `${__dirname}/../../docs/_sass/`,
  docSrc: `${__dirname}/../../${DOC_SRC}/`,
  nodeModules: `${__dirname}/../../node_modules/`,
  parent: `${__dirname}/../../`,
};
const documentationPreprocessors = [
  {
    pattern:
      /\/[*][*]((?:a|[^a])*?)@(type|param|return)\s*[{]([^}]*?)([a-zA-Z0-9_., *<>|]+)\[\]([^}]*)[}]((a|[^a])*)[*]\//g,
    replace: '/**$1@$2 {$3Array<$4>$5}$6*/',
  },
  {
    pattern:
      /\/[*][*]((?:a|[^a])*?)[{]@code(?:link)? ([^}]*)[}]((a|[^a])*)[*]\//g,
    replace: '/**$1<code>$2</code>$3*/',
  },
  {
    pattern: /^\s*export\s+default\s+/gm,
    replace: '',
  },
];
let config;

module.exports = gulpConfig => {
  config = gulpConfig;

  return gulp.series(
    clear,
    preprocess,
    generate,
    bulma,
    fontAwesome,
    lunr,
    clean
  );
};

function clear() {
  fs.emptyDirSync(dir.docPosts);
  return del(dir.docSrc);
}

function compileTs() {
  const tsProject = ts.createProject(config.tsProject);
  return gulp
    .src(config.files.ts)
    .pipe(sourcemaps.init({ loadMaps: true, largeFile: true }))
    .pipe(tsProject())
    .pipe(sourcemaps.write());
}

function getFiles() {
  const tsFiles = compileTs();
  const jsFiles = gulp.src(config.files.js);
  return merge(tsFiles, jsFiles);
}

function preprocess() {
  return getFiles()
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
    .pipe(gulp.dest(dir.docSrc));
}

function generate(done) {
  const datePrefix = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const config = {
    separators: true,
    partial: [
      `${dir.docPartials}docs.hbs`,
      `${dir.docPartials}header.hbs`,
      `${dir.docPartials}main.hbs`,
    ],
  };
  const gitUrl = `${packageData.repository.url.slice(0, -4)}/blob/v${
    lernaData.version
  }/packages/core/src`;
  const lunrDocuments = [];

  fs.ensureDirSync(dir.docPosts);

  gulp
    .src([`${dir.docSrc}**/*.{js,jsx}`], {
      read: false,
    })
    .pipe(
      map((file, callback) => {
        let urlPrefix = '';
        let sourceFilename = '';
        let menuHandled = false;
        let templateData = jsdoc2md.getTemplateDataSync({ files: file.path });
        let fileSource = getSource(file.path);
        let textHandled = false;
        const docFilename = file.relative
          .replace(FILENAME_REGEX, '')
          .replace(/([a-zA-Z])(?=[A-Z])/g, '$1-')
          .toLowerCase();

        templateData = templateData.map(item => {
          if (item.meta) {
            const { lineno: compiledLineno = 0, path: compiledPath = '' } =
              item.meta;

            const resolved = fileSource.resolve({
              line: compiledLineno,
              column: 0,
            });

            // only set on first cycle - partially avoids a known bug in 'get-source' and 'source-map'
            // https://github.com/xpl/get-source/issues/9
            sourceFilename = sourceFilename
              ? sourceFilename
              : resolved.sourceFile.path.split('/').pop();

            // for files hit by above-mentioned bug, this line number might be off
            const sourceLineno = resolved.line;

            item.meta = {
              ...item.meta,
              filename: sourceFilename,
              lineno: sourceLineno,
            };

            item.imaGitUrl = `${gitUrl}${compiledPath
              .split(DOC_SRC)
              .pop()}/${sourceFilename}#L${sourceLineno}`;

            if (!menuHandled) {
              const category = compiledPath.split(`${DOC_SRC}/`);

              if (category.length > 1) {
                item.imaMenuCategory = category.pop();
              } else {
                item.imaMenuCategory = 'general';
              }

              urlPrefix = item.imaMenuCategory;
              item.imaMenuName = sourceFilename.replace(FILENAME_REGEX, '');

              menuHandled = true;
            }

            if (!textHandled) {
              let subDir = compiledPath.split(`${DOC_SRC}/`);
              if (subDir.length > 1) {
                subDir = `${subDir.pop()}/`;
              } else {
                subDir = '';
              }

              const textPath = `${
                dir.parent
              }${subDir}__docs__/${sourceFilename.replace(
                FILENAME_REGEX,
                '.md'
              )}`;

              if (fs.pathExistsSync(textPath)) {
                item.imaText = fs.readFileSync(textPath, 'utf8');

                textHandled = true;
              }
            }
          }

          const name = item.id.replace('#', '.');
          const hash =
            item.kind === 'constructor'
              ? `new_${item.name}_new`
              : item.id.replace('#', '+');
          const textValues = new Set([
            item.imaMenuCategory,
            item.memberof,
            item.name,
            name,
          ]);
          if (item.augments) {
            item.augments.forEach(augment => textValues.add(augment));
          }
          lunrDocuments.push({
            name,
            text: Array.from(textValues.values()).filter(value => !!value),
            url: `${urlPrefix}/${docFilename}#${hash}`,
          });

          return item;
        });

        const output = jsdoc2md.renderSync(
          Object.assign({}, config, { data: templateData })
        );

        fs.writeFileSync(
          `${dir.docPosts}${datePrefix}-${docFilename}.md`,
          output
        );

        callback(null, file);
      })
    )
    .on('end', () => {
      fs.ensureDirSync(dir.docData);

      const lunrFile = `${dir.docData}lunr.json`;
      fs.removeSync(lunrFile);
      fs.writeFileSync(lunrFile, JSON.stringify(lunrDocuments));

      const commonFile = `${dir.docData}common.json`;
      fs.removeSync(commonFile);
      fs.writeFileSync(
        commonFile,
        JSON.stringify({ version: lernaData.version })
      );

      done();
    });
}

function bulma(done) {
  const bulmaSassDir = `${dir.docSass}sass`;

  fs.ensureDirSync(bulmaSassDir);
  fs.emptyDirSync(bulmaSassDir);

  fs.copySync(`${dir.nodeModules}bulma/bulma.sass`, `${dir.docSass}bulma.sass`);
  fs.copySync(`${dir.nodeModules}bulma/sass`, bulmaSassDir);

  done();
}

function fontAwesome(done) {
  const fontsDir = `${dir.doc}webfonts`;

  fs.ensureDirSync(fontsDir);
  fs.emptyDirSync(fontsDir);

  fs.copySync(
    `${dir.nodeModules}@fortawesome/fontawesome-free/css/all.min.css`,
    `${dir.doc}css/all.min.css`
  );
  fs.copySync(
    `${dir.nodeModules}@fortawesome/fontawesome-free/webfonts`,
    fontsDir
  );

  done();
}

function lunr(done) {
  const jsDir = `${dir.doc}js`;

  fs.ensureDirSync(jsDir);
  fs.unlinkSync(`${jsDir}/lunr.js`);

  fs.copySync(`${dir.nodeModules}lunr/lunr.js`, `${jsDir}/lunr.js`);

  done();
}

function clean() {
  return del(dir.docSrc);
}
