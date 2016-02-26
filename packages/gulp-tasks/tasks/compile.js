
var gulp = require('gulp');
var babel = require('gulp-babel');
var babelify = require('babelify');
var browserify = require('browserify');
var cache = require('gulp-cached');
var change = require('gulp-change');
var concat = require('gulp-concat');
var del = require('del');
var es = require('event-stream');
var fs = require('fs');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var insert = require('gulp-insert');
var path = require('path');
var plumber = require('gulp-plumber');
var remember = require('gulp-remember');
var save = require('gulp-save');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var sweetjs = require('gulp-sweetjs');

var gulpConfig = require('../../../gulpConfig.js');
var files = gulpConfig.files;
var babelConfig = gulpConfig.babelConfig;

// build client logic app
gulp.task('Es6ToEs5:app', function () {
	var systemImports = [];
	var view = /view.js$/;

	function isView(file) {
		return !!file.relative.match(view);
	}

	function generateSystemImports() {
		return es.mapSync(function (file) {

			systemImports.push('System.import("' + file.relative.substr(0, file.relative.lastIndexOf('.')) + '")\n');

			return file;
		});
	}

	function insertSystemImports() {
		return change(function (content) {
			content = content + '\n' +
				'$IMA.Loader.initAllModules();\n' +
				'Promise.all([$IMA.Loader.import("app/main")])\n' +
				'.catch(function (error) { \n' +
				'console.error(error); \n });';

			return content;
		});
	}

	function replaceToIMALoader() {
		return change(function (content) {
			content = content.replace(/System.import/g, '$IMA.Loader.import');
			content = content.replace(/System.register/g, '$IMA.Loader.register');

			return content;
		});
	}

	return (
		gulp.src(files.app.src)
			.pipe(resolveNewPath('/'))
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(cache('Es6ToEs5:app'))
			.pipe(babel({
				moduleIds: true,
				presets: babelConfig.app.presets,
				plugins: babelConfig.app.plugins
			 }))
			.pipe(gulpif(isView, sweetjs({
				modules: [path.resolve('./node_modules/ima.js-gulp-tasks/macros/componentName.sjs')],
				readableNames: true
			}), gutil.noop()))
			.pipe(remember('Es6ToEs5:app'))
			.pipe(generateSystemImports())
			.pipe(plumber.stop())
			.pipe(concat(files.app.name.client))
			.pipe(insertSystemImports())
			.pipe(replaceToIMALoader())
			.pipe(save('Es6ToEs5:app:source'))
			.pipe(insert.wrap('(function(){\n', '\n })();\n'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(files.app.dest.client))
			.pipe(save.restore('Es6ToEs5:app:source'))
			.pipe(concat(files.app.name.server))
			.pipe(insert.wrap('module.exports = (function(){\n', '\n })\n'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(files.app.dest.server))
	);

});

// build ima
gulp.task('Es6ToEs5:ima', function () {

	function replaceToIMALoader() {
		return change(function (content) {
			content = content.replace(/System.import/g, '$IMA.Loader.import');
			content = content.replace(/System.register/g, '$IMA.Loader.register');

			return content;
		});
	}

	return (
		gulp.src(files.ima.src)
			.pipe(resolveNewPath('/node_modules'))
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(cache('Es6ToEs5:ima'))
			.pipe(babel({
				moduleIds: true,
				presets: babelConfig.ima.presets,
				plugins: babelConfig.ima.plugins
			 }))
			.pipe(remember('Es6ToEs5:ima'))
			.pipe(plumber.stop())
			.pipe(concat(files.ima.name.client))
			.pipe(replaceToIMALoader())
			.pipe(save('Es6ToEs5:ima:source'))
			.pipe(insert.wrap('(function(){\n', '\n })();\n'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(files.ima.dest.client))
			.pipe(save.restore('Es6ToEs5:ima:source'))
			.pipe(concat(files.ima.name.server))
			.pipe(insert.wrap('module.exports = (function(){\n', '\n })\n'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(files.ima.dest.server))
	);
});

// build server logic app
gulp.task('Es6ToEs5:server', function () {
	return (
		gulp
			.src(files.server.src)
			.pipe(plumber())
			.pipe(babel({
				presets: babelConfig.server.presets,
				plugins: babelConfig.server.plugins
			}))
			.pipe(plumber.stop())
			.pipe(gulp.dest(files.server.dest))
	);
});

gulp.task('Es6ToEs5:vendor', function (done) {
	var vendorModules = gulpConfig.vendorDependencies;
	var serverModules = vendorModules.common.concat(vendorModules.server);
	var clientModules = vendorModules.common.concat(vendorModules.client);

	var linkingFileHeader = `var vendorLinker = require('ima/vendorLinker.js');\n`;
	var linkingFileFooter = `module.exports = vendorLinker;\n`;

	var serverModuleLinker =
		linkingFileHeader +
		serverModules.map(generateVendorInclusion).join('') +
		linkingFileFooter;
	var clientModuleLinker =
		linkingFileHeader +
		clientModules.map(generateVendorInclusion).join('') +
		linkingFileFooter;

	var normalizedTmpPath = files.vendor.dest.tmp
			.replace(/^\.\//, '')
			.replace(/\/\.\//, '/')
			.split('/');
	for (var i = 0; i < normalizedTmpPath.length; i++) {
		var currentPath = './' + normalizedTmpPath.slice(0, i).join('/');
		try {
			fs.statSync(currentPath);
		} catch (e) {
			fs.mkdirSync(currentPath, 0o774);
		}
	}

	fs.writeFile(files.vendor.dest.tmp + files.vendor.name.server, serverModuleLinker, (error) => {
		if (error) {
			return done(error);
		}

		fs.writeFile(files.vendor.dest.tmp + files.vendor.src.client, clientModuleLinker, (error) => {
			done(error);
		});
	});

	function generateVendorInclusion(vendorModuleName) {
		return `vendorLinker.set('${vendorModuleName}', require('${vendorModuleName}'));\n`;
	}
});

gulp.task('Es6ToEs5:vendor:client', function () {
	var sourceFile = files.vendor.dest.tmp + files.vendor.src.client;
	var options ={ debug: false, insertGlobals : false, basedir: '.' };
	return (
		browserify(sourceFile, options)
			.transform(babelify.configure({
				presets: babelConfig.vendor.presets,
				plugins: babelConfig.vendor.plugins
			}))
			.bundle()
			.pipe(source(files.vendor.name.client))
			.pipe(gulp.dest(files.vendor.dest.client))
	);
});

gulp.task('Es6ToEs5:vendor:clean', function () {
	return del([
		files.vendor.dest.tmp + files.vendor.name.tmp
	]);
});

/**
 * "Fix" file path for the babel task to get better-looking module names.
 *
 * @param {string} newBase The base directory against which the file path
 *        should be matched.
 * @return {Stream<File>} Stream processor for files.
 */
function resolveNewPath(newBase) {
	return es.mapSync((file) => {
		file.cwd += newBase;
		file.base = file.cwd;
		return file;
	});
}
