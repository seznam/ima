
let gulp = require('gulp');
let jsdoc = require('gulp-jsdoc3');

module.exports = (gulpConfig) => {
	let files = gulpConfig.files;

	gulp.task('doc', (done) =>
		gulp.src(files.app.src)
			.pipe(jsdoc({
				/*templates: {
					default: {
						layoutFile: 'node_modules/docdash'
					}
				}*/
			}, done))
	);

};
