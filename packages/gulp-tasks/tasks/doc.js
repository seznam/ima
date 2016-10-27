
let del = require('del');
let gulp = require('gulp');
let change = require('gulp-change');
let jsdoc = require('gulp-jsdoc3');

module.exports = (gulpConfig) => {
	let files = gulpConfig.files;
	let documentationPreprocessors;

	gulp.task(
		'doc',
		['doc:clear', 'doc:preprocess', 'doc:generate', 'doc:clean'],
		() => {}
	);

	gulp.task('doc:clean', ['doc:generate'], () =>
		del('./doc-src')
	);

	gulp.task('doc:generate', ['doc:preprocess'], (done) => {
		// Unfortunately, JSDoc invokes the callback for every file. Because of
		// this, we have to handle the done callback invokation in a little
		// bit more complicated way
		const COMPLETION_TIMEOUT = 1000; // milliseconds
		let completionTimeout = null;

		gulp.src(['README.md', './doc-src/**/*'], { read: false })
			.pipe(jsdoc({
				/*templates: {
				 default: {
				 layoutFile: './node_modules/docdash'
				 }
				 },
				 */
				opts: {
					destination: './doc'
				}
			}, () => {
				if (completionTimeout) {
					clearTimeout(completionTimeout);
				}
				completionTimeout = setTimeout(done, COMPLETION_TIMEOUT);
			}));
	});

	gulp.task('doc:preprocess', ['doc:clear'], () =>
		gulp.src(files.app.src)
			.pipe(change((content) => {
				var oldContent = null;

				while (content !== oldContent) {
					oldContent = content;
					for (let preprocessor of documentationPreprocessors) {
						let { pattern, replace } = preprocessor;
						content = content.replace(pattern, replace);
					}
				}

				return content;
			}))
			.pipe(gulp.dest('./doc-src'))
	);

	gulp.task('doc:clear', () =>
		del(['./doc-src', './doc'])
	);

	documentationPreprocessors = [
		{
			pattern: /\/[*][*]((?:a|[^a])*?)@(type|param|return)\s*[{]([^}]*?)([a-zA-Z0-9_., *<>|]+)\[\]([^}]*)[}]((a|[^a])*)[*]\//g,
			replace: '/**$1@$2 {$3Array<$4>$5}$6*/'
		},
		{
			pattern: /\/[*][*]((?:a|[^a])*?)[{]@code(?:link)? ([^}]*)[}]((a|[^a])*)[*]\//g,
			replace: '/**$1<code>$2</code>$3*/'
		},
		{
			pattern: /export default /g,
			replace: ''
		}
	];

};
