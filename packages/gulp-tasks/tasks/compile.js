
var gulp = require('gulp');
var babel = require('gulp-babel');
var babelify = require('babelify');
var browserify = require('browserify');
var cache = require('gulp-cached');
var change = require('gulp-change');
var concat = require('gulp-concat');
var del = require('del');
var es = require('event-stream');
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
				'Promise.all([$IMA.Loader.import("imajs/client/main")])\n' +
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
				presets: ['es2015', 'react'].concat(babelConfig.app.presets),
				plugins: ['transform-es2015-modules-systemjs', 'external-helpers-2'].concat(babelConfig.app.plugins)
			 }))
			.pipe(gulpif(isView, sweetjs({
				modules: ['./imajs/macro/componentName.sjs'],
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
			.pipe(insert.wrap('module.exports = (function(){\n', '\n })()\n'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(files.app.dest.server))
	);

});

// build server logic app
gulp.task('Es6ToEs5:server', function () {
	return (
		gulp
			.src(files.server.src)
			.pipe(plumber())
			.pipe(babel({
				presets: ['es2015'].concat(babelConfig.server.presets),
				plugins: ['external-helpers-2'].concat(babelConfig.server.plugins)
			}))
			.pipe(plumber.stop())
			.pipe(gulp.dest(files.server.dest))
	);
});

gulp.task('Es6ToEs5:vendor', function () {
	return (
		gulp
			.src(files.vendor.src)
			.pipe(plumber())
			.pipe(babel({
				presets: ['es2015', 'react'].concat(babelConfig.vendor.presets),
				plugins: ['external-helpers-2'].concat(babelConfig.vendor.plugins)}))
			.pipe(plumber.stop())
			.pipe(concat(files.vendor.name.tmp))
			.pipe(gulp.dest(files.vendor.dest.tmp))
	);
});

gulp.task('Es6ToEs5:vendor:client', function () {
	return (
		browserify(files.vendor.dest.tmp + files.vendor.name.tmp, { debug: false, insertGlobals : false, basedir: '.' })
			.transform(babelify.configure({
				presets: ['es2015', 'react'].concat(babelConfig.vendor.presets),
				plugins: ['external-helpers-2'].concat(babelConfig.vendor.plugins)
			}))
			.bundle()
			.pipe(source(files.vendor.name.client))
			.pipe(gulp.dest(files.vendor.dest.client))
	);
});

gulp.task('Es6ToEs5:vendor:server', function () {
	return (
		gulp.src(files.vendor.dest.tmp + files.vendor.name.tmp)
			.pipe(insert.wrap('module.exports = (function (config) {', ' return vendor;})()'))
			.pipe(concat(files.vendor.name.server))
			.pipe(gulp.dest(files.vendor.dest.server))
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
	return es.mapSync(function (file) {
		var newBasePath = path.resolve(newBase);
		var namespaceForFile = '/' + path.relative(file.cwd + '/' + newBase, file.base) + '/';
		var newPath = newBasePath + namespaceForFile + file.relative;

		file.base = file.cwd;
		return file;
	});
}
