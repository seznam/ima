
let gulp = require('gulp');
let concat = require('gulp-concat');
let del = require('del');
let nano = require('gulp-cssnano');
let plumber = require('gulp-plumber');
let uglify = require('gulp-uglify');

exports.__requiresConfig = true;

exports.default = (gulpConfig) => {
	let files = gulpConfig.files;
	let uglifyCompression = gulpConfig.uglifyCompression;

	function bundleJsApp() {
		return gulp
			.src(files.bundle.js.src)
			.pipe(plumber())
			.pipe(concat(files.bundle.js.name))
			.pipe(uglify({mangle: true, compress: uglifyCompression}))
			.pipe(plumber.stop())
			.pipe(gulp.dest(files.bundle.js.dest));
	}

	function bundleJsServer() {
		let file = files.app.dest.server + files.app.name.server;

		return gulp
			.src(file)
			.pipe(plumber())
			.pipe(uglify({
				mangle: false,
				output: {beautify: true},
				compress: uglifyCompression
			}))
			.pipe(plumber.stop())
			.pipe(gulp.dest(files.app.dest.server));
	}

	function bundleCss() {
		return gulp
			.src(files.bundle.css.src)
			.pipe(plumber())
			.pipe(concat(files.bundle.css.name))
			.pipe(nano())
			.pipe(plumber.stop())
			.pipe(gulp.dest(files.bundle.css.dest));
	}

	function bundleClean() {
		return del(files.bundle.css.src.concat(files.bundle.js.src));
	}

	return {
		'bundle:js:app': bundleJsApp,
		'bundle:js:server': bundleJsServer,
		'bundle:css': bundleCss,
		'bundle:clean': bundleClean
	};
};
