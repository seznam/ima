const gulp = require('gulp');
const babel = require('gulp-babel');
const browserify = require('browserify');
const cache = require('gulp-cached');
const tap = require('gulp-tap');
const concat = require('gulp-concat');
const del = require('del');
const fs = require('fs');
const insert = require('gulp-insert');
const plumber = require('gulp-plumber');
const remember = require('gulp-remember');
const save = require('gulp-save');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const through2 = require('through2');
const PluginError = require('plugin-error');
const uglifyEs = require('gulp-uglify-es').default;
const buffer = require('vinyl-buffer');
const clientify = require('ima-clientify').clientify;

let vendorBundle = null;
let vendorEsBundle = null;

exports.__requiresConfig = true;

exports.default = gulpConfig => {
  let files = gulpConfig.files;
  let babelConfig = gulpConfig.babelConfig;

  function Es6ToEs5App() {
    function insertSystemImports() {
      return tap(file => {
        file.contents = Buffer.concat([
          file.contents,
          new Buffer(
            '\n' +
              '$IMA.Loader.initAllModules();\n' +
              'Promise.all([$IMA.Loader.import("app/main")])\n' +
              '.catch(function (error) { \n' +
              'console.error(error); \n });'
          ),
        ]);
      });
    }

    function replaceToIMALoader() {
      return tap(file => {
        let content = file.contents.toString();

        if (content) {
          content = content.replace(/System.import/g, '$IMA.Loader.import');
          content = content.replace(/System.register/g, '$IMA.Loader.register');

          file.contents = new Buffer(content);
        }
      });
    }

    function excludeServerSideFile() {
      return tap(file => {
        let content = file.contents.toString();

        if (content) {
          content = clientify(content, true);
          file.contents = new Buffer(content);
        }
      });
    }

    function doOnlyForLegacy(action) {
      if (gulpConfig.legacyCompactMode) {
        return action;
      } else {
        return through2.obj();
      }
    }

    function compileToEsCode() {
      if (
        babelConfig.esApp.presets.length ||
        babelConfig.esApp.plugins.length
      ) {
        return babel({
          babelrc: false,
          moduleIds: true,
          presets: babelConfig.esApp.presets,
          plugins: babelConfig.esApp.plugins,
        });
      } else {
        return through2.obj();
      }
    }

    return gulp
      .src(files.app.src)
      .pipe(resolveNewPath(files.app.base || '/'))
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(cache('Es6ToEs5:server:app'))
      .pipe(
        babel({
          babelrc: false,
          moduleIds: true,
          presets: babelConfig.serverApp.presets,
          plugins: babelConfig.serverApp.plugins,
        })
      )
      .pipe(remember('Es6ToEs5:server:app'))
      .pipe(plumber.stop())
      .pipe(replaceToIMALoader())
      .pipe(save('Es6ToEs5:es:app:source'))
      .pipe(cache('Es6ToEs5:es:app'))
      .pipe(compileToEsCode())
      .pipe(excludeServerSideFile())
      .pipe(remember('Es6ToEs5:es:app'))
      .pipe(save('Es6ToEs5:es:app:client'))
      .pipe(concat(files.app.name.esClient))
      .pipe(insert.wrap('(function(){\n', '\n })();\n'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(files.app.dest.client))
      .pipe(doOnlyForLegacy(save.restore('Es6ToEs5:es:app:client')))
      .pipe(doOnlyForLegacy(cache('Es6ToEs5:legacy:app')))
      .pipe(
        doOnlyForLegacy(
          babel({
            babelrc: false,
            moduleIds: true,
            presets: babelConfig.app ? babelConfig.app.presets : [],
            plugins: babelConfig.app ? babelConfig.app.plugins : [],
          })
        )
      )
      .pipe(doOnlyForLegacy(remember('Es6ToEs5:legacy:app')))
      .pipe(doOnlyForLegacy(concat(files.app.name.client)))
      .pipe(doOnlyForLegacy(insert.wrap('(function(){\n', '\n })();\n')))
      .pipe(doOnlyForLegacy(sourcemaps.write()))
      .pipe(doOnlyForLegacy(gulp.dest(files.app.dest.client)))
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
          plugins: babelConfig.server.plugins,
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
      let vendors = getVendors(modules);

      let linkingFileHeader = `let vendorLinker = require('${
        vendors['@ima/core'] || '@ima/core'
      }').vendorLinker;\n`;
      let linkingFileFooter = `module.exports = vendorLinker;\n`;

      return (
        linkingFileHeader +
        Object.entries(vendors)
          .map(([alias, moduleName]) =>
            generateVendorInclusion(alias, moduleName)
          )
          .join('') +
        linkingFileFooter
      );
    }

    function getVendors(modules) {
      return modules.reduce((vendors, vendorModuleName) => {
        let alias = vendorModuleName;
        let moduleName = vendorModuleName;

        if (typeof vendorModuleName === 'object') {
          alias = Object.keys(vendorModuleName)[0];
          moduleName = vendorModuleName[alias];
        }

        vendors[alias] = moduleName;

        return vendors;
      }, {});
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

  function applyToBrowserifyBundle(method, config, bundle) {
    return config[method].reduce((bundle, item) => {
      if (!item) {
        return item;
      }

      let [name, ...rest] = item;

      return bundle[method](name, ...rest);
    }, bundle);
  }

  function vendorClient() {
    if (!gulpConfig.legacyCompactMode) {
      return Promise.resolve();
    }

    let sourceFile = files.vendor.dest.tmp + files.vendor.src.client;

    if (!vendorBundle) {
      vendorBundle = browserify(sourceFile, babelConfig.vendor.options);
      vendorBundle = applyToBrowserifyBundle(
        'transform',
        babelConfig.vendor,
        vendorBundle
      );
      vendorBundle = applyToBrowserifyBundle(
        'plugin',
        babelConfig.vendor,
        vendorBundle
      );
    }

    return vendorBundle
      .bundle()
      .pipe(source(files.vendor.name.client))
      .pipe(buffer())
      .pipe(
        !gulpConfig.$Debug
          ? uglifyEs({
              compress: Object.assign({}, gulpConfig.uglifyCompression, {
                ecma: 5,
              }),
            })
          : through2.obj()
      )
      .pipe(gulp.dest(files.vendor.dest.client));
  }

  function esVendorClient() {
    let sourceFile = files.vendor.dest.tmp + files.vendor.src.client;

    if (!vendorEsBundle) {
      vendorEsBundle = browserify(sourceFile, babelConfig.esVendor.options);
      vendorEsBundle = applyToBrowserifyBundle(
        'transform',
        babelConfig.esVendor,
        vendorEsBundle
      );
      vendorEsBundle = applyToBrowserifyBundle(
        'plugin',
        babelConfig.esVendor,
        vendorEsBundle
      );
    }

    return vendorEsBundle
      .bundle()
      .on('error', function (err) {
        throw new PluginError('Es6ToEs5:vendor:client', err, {
          showStack: true,
        });
      })
      .pipe(source(files.vendor.name.esClient))
      .pipe(buffer())
      .pipe(
        !gulpConfig.$Debug
          ? uglifyEs({ compress: gulpConfig.uglifyCompression })
          : through2.obj()
      )
      .pipe(gulp.dest(files.vendor.dest.client));
  }

  function Es6ToEs5VendorClean() {
    return del([files.vendor.dest.tmp + files.vendor.name.tmp]);
  }

  /**
   * Apply method for stream.
   *
   * @param {function} transformation
   * @return {Stream<File>} Stream processor for files.
   */
  function mapSync(transformation) {
    return through2.obj(function write(chunk, _, callback) {
      let mappedData;
      try {
        mappedData = transformation(chunk);
      } catch (error) {
        callback(error);
      }
      if (mappedData !== undefined) {
        this.push(mappedData);
      }

      callback();
    });
  }

  /**
   * "Fix" file path for the babel task to get better-looking module names.
   *
   * @param {string} newBase The base directory against which the file path
   *        should be matched.
   * @return {Stream<File>} Stream processor for files.
   */
  function resolveNewPath(newBase) {
    return mapSync(file => {
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
    'Es6ToEs5:vendor:clean': Es6ToEs5VendorClean,
  };
};
