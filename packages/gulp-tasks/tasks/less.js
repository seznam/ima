
let gulp = require('gulp');
let autoprefixer = require('gulp-autoprefixer');
let concat = require('gulp-concat');
let gulpLess = require('gulp-less');
let path = require('path');
let plumber = require('gulp-plumber');
let sourcemaps = require('gulp-sourcemaps');

exports.__requiresConfig = true;

exports.default = (gulpConfig) => {
	let files = gulpConfig.files;

	function less() {
		function fixPipe(stream) {
			let origPipe = stream.pipe;
			stream.pipe = function(dest) {
				arguments[0] = dest.on('error', (error) => {
					let nextStreams = dest._nextStreams;
					if (nextStreams) {
						nextStreams.forEach(
							nextStream => nextStream.emit('error', error)
						);
					} else if (dest.listeners('error').length === 1) {
						throw error;
					}
				});
				let nextStream = fixPipe(origPipe.apply(this, arguments));
				(this._nextStreams || (this._nextStreams = [])).push(nextStream);
				return nextStream;
			};
			return stream;
		}

		return (
			fixPipe(gulp.src(files.less.src))
				.pipe(plumber())
				.pipe(sourcemaps.init())
				.pipe(concat({
					path: files.less.name,
					base: files.less.base,
					cwd: files.less.cwd
				}))
				.pipe(gulpLess({compress: true, paths: [path.join(__dirname)]}))
				.pipe(autoprefixer())
				.pipe(sourcemaps.write())
				.pipe(plumber.stop())
				.pipe(gulp.dest(files.less.dest))
		);
	}

	return {
		less
	};
};
