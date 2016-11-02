
let gulp = require('gulp');

exports.__requiresConfig = true;

exports.default = (gulpConfig) => {
	let files = gulpConfig.files;

	function copy_appStatic() {
		return gulp
			.src([
				'./app/assets/static/**/*.*',
				'./app/assets/static/*.*'
			])
			.pipe(gulp.dest(files.server.dest + 'static/'));
	}

	function copy_environment() {
		return gulp
			.src(['./app/environment.js'])
			.pipe(gulp.dest(files.server.base + 'ima/config/'));
	}

	return {
		copy_appStatic,
		copy_environment
	};
};
