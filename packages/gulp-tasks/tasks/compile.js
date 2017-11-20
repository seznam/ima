let gulp = require('gulp');
let babel = require('gulp-babel');
let browserify = require('browserify');
let watchify = require('watchify');
let cache = require('gulp-cached');
let change = require('gulp-change');
let concat = require('gulp-concat');
let del = require('del');
let es = require('event-stream');
let fs = require('fs');
let insert = require('gulp-insert');
let plumber = require('gulp-plumber');
let remember = require('gulp-remember');
let save = require('gulp-save');
let source = require('vinyl-source-stream');
let sourcemaps = require('gulp-sourcemaps');
let gulpIgnore = require('gulp-ignore');
let gutil = require('gulp-util');
let uglifyEs = require('gulp-uglify-es').default;
let buffer = require('vinyl-buffer');

let sharedTasksState = require('../gulpState');

let vendorBundle = null;
let vendorEsBundle = null;

exports.__requiresConfig = true;

exports.default = gulpConfig => {
  let files = gulpConfig.files;
  let babelConfig = gulpConfig.babelConfig;

  function Es6ToEs5App() {
    function insertSystemImports() {
      return change(content => {
        content =
          content +
          '\n' +
          '$IMA.Loader.initAllModules();\n' +
          'Promise.all([$IMA.Loader.import("app/main")])\n' +
          '.catch(function (error) { \n' +
          'console.error(error); \n });';

        return content;
      });
    }

    function replaceToIMALoader() {
      return change(content => {
        content = content.replace(/System.import/g, '$IMA.Loader.import');
        content = content.replace(/System.register/g, '$IMA.Loader.register');

        return content;
      });
    }

    function excludeServerSideFile(file) {
      return (
        file.contents.toString().indexOf('@server-side') !== -1 &&
        files.app.clearServerSide
      );
    }

    function compileToLegacyCode() {
      if (gulpConfig.legacyCompactMode) {
        return babel({
          moduleIds: true,
          presets: babelConfig.app ? babelConfig.app.presets : [],
          plugins: babelConfig.app ? babelConfig.app.plugins : []
        });
      } else {
        return gutil.noop();
      }
    }

    return gulp
      .src(files.app.src)
      .pipe(resolveNewPath(files.app.base || '/'))
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(cache('Es6ToEs5:es:app'))
      .pipe(
        babel({
          babelrc: false,
          moduleIds: true,
          presets: babelConfig.esApp.presets,
          plugins: babelConfig.esApp.plugins
        })
      )
      .pipe(remember('Es6ToEs5:es:app'))
      .pipe(plumber.stop())
      .pipe(replaceToIMALoader())
      .pipe(save('Es6ToEs5:es:app:source'))
      .pipe(gulpIgnore.exclude(excludeServerSideFile))
      .pipe(save('Es6ToEs5:es:app:client'))
      .pipe(concat(files.app.name.esClient))
      .pipe(insert.wrap('(function(){\n', '\n })();\n'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(files.app.dest.client))
      .pipe(save.restore('Es6ToEs5:es:app:client'))
      .pipe(compileToLegacyCode())
      .pipe(concat(files.app.name.client))
      .pipe(insert.wrap('(function(){\n', '\n })();\n'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(files.app.dest.client))
      .pipe(save.restore('Es6ToEs5:es:app:source'))
      .pipe(concat(files.app.name.server))
      .pipe(insertSystemImports())
      .pipe(insert.wrap('module.exports = (function(){\n', '\n })\n'))
      .pipe(gulp.dest(files.app.dest.server));
  }

  function Es6ToEs5Server() {
    return gulp
      .src(files.server.src)
      .pipe(plumber())
      .pipe(
        babel({
          babelrc: false,
          presets: babelConfig.server.presets,
          plugins: babelConfig.server.plugins
        })
      )
      .pipe(plumber.stop())
      .pipe(gulp.dest(files.server.dest));
  }

  function Es6ToEs5Vendor(done) {
    let vendorModules = gulpConfig.vendorDependencies;
    let serverModules = vendorModules.common.concat(vendorModules.server);
    let clientModules = vendorModules.common.concat(vendorModules.client);
    let testModules = vendorModules.test || [];

    let serverModuleLinker = getModuleLinkerContent(serverModules);
    let clientModuleLinker = getModuleLinkerContent(clientModules);
    let testModuleLinker = getModuleLinkerContent(testModules);

    let normalizedTmpPath = files.vendor.dest.tmp
      .replace(/^\.\//, '')
      .replace(/\/\.\//, '/')
      .split('/');
    for (let i = 0; i < normalizedTmpPath.length; i++) {
      let currentPath = './' + normalizedTmpPath.slice(0, i).join('/');
      try {
        fs.statSync(currentPath);
      } catch (e) {
        fs.mkdirSync(currentPath, 0o774);
      }
    }

    fs.writeFile(
      files.vendor.dest.tmp + files.vendor.name.server,
      serverModuleLinker,
      error => {
        if (error) {
          return done(error);
        }

        fs.writeFile(
          files.vendor.dest.tmp + files.vendor.src.client,
          clientModuleLinker,
          error => {
            if (error || !files.vendor.src.test) {
              return done(error);
            }

            fs.writeFile(
              files.vendor.dest.tmp + files.vendor.src.test,
              testModuleLinker,
              error => {
                done(error);
              }
            );
          }
        );
      }
    );

    function getModuleLinkerContent(modules) {
      let linkingFileHeader = `let vendorLinker = require('ima/vendorLinker.js').default;\n`;
      let linkingFileFooter = `module.exports = vendorLinker;\n`;
      let duplicity = [];

      return (
        linkingFileHeader +
        modules
          .map(vendorModuleName => {
            let alias = vendorModuleName;

            if (typeof vendorModuleName === 'object') {
              alias = Object.keys(vendorModuleName)[0];

              if (modules.indexOf(alias) !== -1) {
                duplicity.push(alias);
              }
            }

            return vendorModuleName;
          })
          .filter(
            vendorModuleName =>
              (typeof vendorModuleName === 'string' &&
                duplicity.indexOf(vendorModuleName) === -1) ||
              typeof vendorModuleName === 'object'
          )
          .map(vendorModuleName => {
            let alias = vendorModuleName;
            let moduleName = vendorModuleName;

            if (typeof vendorModuleName === 'object') {
              alias = Object.keys(vendorModuleName)[0];
              moduleName = vendorModuleName[alias];
            }

            return generateVendorInclusion(alias, moduleName);
          })
          .join('') +
        linkingFileFooter
      );
    }

    function generateVendorInclusion(alias, moduleName) {
      return `vendorLinker.set('${alias}', require('${moduleName}'));\n`;
    }
  }

  function Es6ToEs5VendorClient(done) {
    return gulp.series(gulp.parallel(vendorClient, esVendorClient), subDone => {
      subDone();
      done();
    })();
  }

  function vendorClient() {
    if (!gulpConfig.legacyCompactMode) {
      return Promise.resolve();
    }

    let sourceFile = files.vendor.dest.tmp + files.vendor.src.client;

    if (!vendorBundle) {
      vendorBundle = browserify(sourceFile, babelConfig.vendor.options)
        .transform('babelify', {
          babelrc: false,
          presets: babelConfig.vendor.presets,
          plugins: babelConfig.vendor.plugins
        })
        .transform('loose-envify', {
          NODE_ENV: process.env.NODE_ENV || 'development'
        })
        .transform('ima-clientify');

      if (sharedTasksState.watchMode) {
        vendorBundle.plugin([watchify]);
      }
    }

    return vendorBundle
      .bundle()
      .pipe(source(files.vendor.name.client))
      .pipe(buffer())
      .pipe(
        !gulpConfig.$Debug
          ? uglifyEs({
              compress: Object.assign({}, gulpConfig.uglifyCompression, {
                ecma: 5
              })
            })
          : gutil.noop()
      )
      .pipe(gulp.dest(files.vendor.dest.client));
  }

  function esVendorClient() {
    let sourceFile = files.vendor.dest.tmp + files.vendor.src.client;

    if (!vendorEsBundle) {
      vendorEsBundle = browserify(sourceFile, babelConfig.esVendor.options)
        .transform('babelify', {
          babelrc: false,
          presets: babelConfig.esVendor.presets,
          plugins: babelConfig.esVendor.plugins
        })
        .transform('loose-envify', {
          NODE_ENV: process.env.NODE_ENV || 'development'
        })
        .transform('ima-clientify');

      if (sharedTasksState.watchMode) {
        vendorEsBundle.plugin([watchify]);
      }
    }

    return vendorEsBundle
      .bundle()
      .pipe(source(files.vendor.name.esClient))
      .pipe(buffer())
      .pipe(
        !gulpConfig.$Debug
          ? uglifyEs({ compress: gulpConfig.uglifyCompression })
          : gutil.noop()
      )
      .pipe(gulp.dest(files.vendor.dest.client));
  }

  function Es6ToEs5VendorClean() {
    return del([files.vendor.dest.tmp + files.vendor.name.tmp]);
  }

  /**
   * "Fix" file path for the babel task to get better-looking module names.
   *
   * @param {string} newBase The base directory against which the file path
   *        should be matched.
   * @return {Stream<File>} Stream processor for files.
   */
  function resolveNewPath(newBase) {
    return es.mapSync(file => {
      file.cwd += newBase;
      file.base = file.cwd;
      return file;
    });
  }

  return {
    'Es6ToEs5:app': Es6ToEs5App,
    'Es6ToEs5:server': Es6ToEs5Server,
    'Es6ToEs5:vendor': Es6ToEs5Vendor,
    'Es6ToEs5:vendor:client': Es6ToEs5VendorClient,
    'Es6ToEs5:vendor:clean': Es6ToEs5VendorClean
  };
};
