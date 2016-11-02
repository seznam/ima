
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

	function bundle_js_app() {
		return gulp
			.src(files.bundle.js.src)
			.pipe(plumber())
			.pipe(concat(files.bundle.js.name))
			.pipe(uglify({mangle: true, compress: uglifyCompression}))
			.pipe(plumber.stop())
			.pipe(gulp.dest(files.bundle.js.dest));
	}

	function bundle_js_server() {
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

	function bundle_css() {
		return gulp
			.src(files.bundle.css.src)
			.pipe(plumber())
			.pipe(concat(files.bundle.css.name))
			.pipe(nano())
			.pipe(plumber.stop())
			.pipe(gulp.dest(files.bundle.css.dest));
	}

	function bundle_clean() {
		return del(files.bundle.css.src.concat(files.bundle.js.src));
	}

	return {
		bundle_js_app,
		bundle_js_server,
		bundle_css,
		bundle_clean
	};
};
