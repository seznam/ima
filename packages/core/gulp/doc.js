const change = require('gulp-change');
const del = require('del');
const fs = require('fs-extra');
const gulp = require('gulp');
const jsdoc2md = require('jsdoc-to-markdown');
const map = require('map-stream');
const packageData = require(`${__dirname}/../package.json`);
const rename = require('gulp-rename');

const DOC_SRC = 'doc-src';

const dir = {
  doc: `${__dirname}/../docs/`,
  docData: `${__dirname}/../docs/_data/`,
  docPartials: `${__dirname}/../docs/_partials/`,
  docPosts: `${__dirname}/../docs/_posts/`,
  docSass: `${__dirname}/../docs/_sass/`,
  docSrc: `${__dirname}/../${DOC_SRC}/`,
  nodeModules: `${__dirname}/../node_modules/`,
  parent: `${__dirname}/../`
};
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

function preprocess() {
  return gulp
    .src(config.files.js)
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
      `${dir.docPartials}main.hbs`
    ]
  };
  const gitUrl = `${packageData.repository.url.slice(0, -4)}/tree/stable`;
  const lunrDocuments = [];

  fs.ensureDirSync(dir.docPosts);

  gulp
    .src([`${dir.docSrc}**/*.{js,jsx}`], {
      read: false
    })
    .pipe(
      map((file, callback) => {
        let urlPrefix = '';
        let menuHandled = false;
        let templateData = jsdoc2md.getTemplateDataSync({ files: file.path });
        let textHandled = false;
        const filename = file.relative
          .replace(/(\/|.jsx|.js)/g, '')
          .replace(/([a-zA-Z])(?=[A-Z])/g, '$1-')
          .toLowerCase();

        templateData = templateData.map(item => {
          if (item.meta) {
            const { filename = '', lineno = 0, path = '' } = item.meta;

            item.imaGitUrl = `${gitUrl}${path
              .split(DOC_SRC)
              .pop()}/${filename}#L${lineno}`;

            if (!menuHandled) {
              const category = path.split(`${DOC_SRC}/`);

              if (category.length > 1) {
                item.imaMenuCategory = category.pop();
              } else {
                item.imaMenuCategory = 'general';
              }

              urlPrefix = item.imaMenuCategory;
              item.imaMenuName = filename.replace(/(\/|.jsx|.js)/g, '');

              menuHandled = true;
            }

            if (!textHandled) {
              let subDir = path.split(`${DOC_SRC}/`);
              if (subDir.length > 1) {
                subDir = `${subDir.pop()}/`;
              } else {
                subDir = '';
              }

              const textPath = `${
                dir.parent
              }${subDir}__docs__/${filename.replace(/(\/|.jsx|.js)/g, '.md')}`;

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
          lunrDocuments.push({
            name,
            text: [item.memberof, item.name, name].filter(value => !!value),
            url: `${urlPrefix}/${filename}.html#${hash}`
          });

          return item;
        });

        const output = jsdoc2md.renderSync(
          Object.assign({}, config, { data: templateData })
        );

        fs.writeFileSync(`${dir.docPosts}${datePrefix}-${filename}.md`, output);

        callback(null, file);
      })
    )
    .on('end', () => {
      fs.ensureDirSync(dir.docData);
      fs.emptyDirSync(dir.docData);
      fs.writeFileSync(
        `${dir.docData}lunr.json`,
        JSON.stringify(lunrDocuments)
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
