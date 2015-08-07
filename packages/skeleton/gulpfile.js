var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var gls = require('gulp-live-server');
var insert = require('gulp-insert');
var browserify = require('browserify');
var gulpif = require('gulp-if');
var fs = require('fs');
var path = require('path');
var runSequence = require('run-sequence');
var shell = require('gulp-shell');
var source = require('vinyl-source-stream');
var traceur = require('gulp-traceur');
var es = require('event-stream');
var react = require('gulp-react');
var sweetjs = require('gulp-sweetjs');
var yuidoc = require('gulp-yuidoc');
var less = require('gulp-less');
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');
var karma = require('gulp-karma');
var cache = require('gulp-cached');
var	remember = require('gulp-remember');
var flo = require('fb-flo');
var through = require('through2');
var messageFormat = require('gulp-messageformat');
var save = require('gulp-save');
var change = require('gulp-change');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var eslint = require('gulp-eslint');
var gulpCommand = require('gulp-command')(gulp);

var coreDependency = require('./imajs/build.js');

try {
	var appDependency = require('./app/build.js');
}catch(e) {
	var appDependency = {
		js: [],
		languages: [],
		less: [],
		bundle: {
			js: [],
			css: []
		}
	};
	console.log(e);
}

var watchEvent = null;
var server = null;

var uglifyCompression = {
	global_defs: {
		$Debug: true
	},
	dead_code: true
};

var files = {
	vendor: {
		name: {
			server: 'vendor.server.js',
			client: 'vendor.client.js'
		},
		tmp: './build/imajs/es5transformedVendor.js',
		src:[
				'./build/imajs/es5transformedVendor.js'
		],
		dest: {
			server: './build/imajs/',
			client: './build/static/js/'
		},
		watch: ['./imajs/client/core/vendor.js', './app/vendor.js']
	},
	app: {
		name: {
			server: 'app.server.js',
			client: 'app.client.js'
		},
		src: coreDependency.js.concat(appDependency.js, coreDependency.mainjs),
		dest: {
			server: './build/imajs/',
			client: './build/static/js/'
		},
		watch:['./imajs/client/**/*.{js,jsx}', './imajs/client/main.js', '!./imajs/client/vendor.js', './app/**/*.{js,jsx}', '!./app/*.js']
	},
	server: {
		src: './server/',
		dest: './build/',
		watch: ['./server/*.js', './server/**/*.js', './app/environment.js', './imajs/server/*.js']
	},
	less: {
		cwd: '/',
		base: './app/assets/less/',
		name: './app/assets/less/app.less',
		src: appDependency.less,
		dest: './build/static/css/',
		watch: ['./app/**/*.less', '!./app/assets/bower/']
	},
	locale: {
		src: appDependency.languages,
		dest:{
			server: './build/imajs/locale/',
			client: './build/static/js/locale/'
		},
		watch: ['./app/locale/**/*.json']
	},
	shim : {
		name: 'shim.js',
		src: [
			'./node_modules/es6-shim/es6-shim.js',
			traceur.RUNTIME_PATH
		],
		dest: {
			client: './build/static/js/',
			server: './build/imajs/'
		}
	},
	polyfill: {
		name: 'polyfill.js',
		src: [
			'./node_modules/custom-event-polyfill/custom-event-polyfill.js'
		],
		dest: {
			client: './build/static/js/'
		}
	},
	bundle: {
		js: {
			name: 'app.bundle.min.js',
			src: appDependency.bundle.js,
			dest: './build/static/js/'
		},
		css: {
			name: 'app.bundle.min.css',
			src: appDependency.bundle.css,
			dest: './build/static/css/'
		}
	},
	test: {
		src: [
			'./imajs/client/test.js',
			'./build/static/js/polyfill.js',
			'./build/static/js/shim.js',
			'./build/static/js/vendor.client.js',
			'./build/static/js/locale/cs.js',
			'./build/static/js/app.client.js',
			'./app/test/**/*.js',
			'./app/test/*.js',
			'./imajs/client/test/**/*.js',
			'./imajs/client/test/*.js'
		]
	}
};

/*
* Change path for file
*/
var resolveNewPath = function(newBase){
	return es.mapSync(function (file) {
		var newBasePath = path.resolve(newBase);
		var namespaceForFile = '/' + path.relative(file.cwd + '/' + newBase, file.base) + '/';
		var newPath = newBasePath + namespaceForFile + file.relative;

		file.base = newBasePath;
		file.path = newPath;
		file.cwd = newBasePath;
		return file;
	});
};

/**
 * Patterns used to increase compatibility of YUI Doc with jsDoc tags.
 *
 * @type {{pattern: RegExp, replace: string}[]}
 */
var documentationPreprocessors = [
	{
		pattern: /\/[*][*]((?:a|[^a])*?)(?: |\t)*[*]\s*@(?:override|inheritDoc|abstract)\n((a|[^a])*)[*]\//g,
		replace: '/**$1$2*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@implements(?: (.*))?\n((a|[^a])*)[*]\//g,
		replace: '/**$1@extends $2\n$3*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@interface (.*)\n((a|[^a])*)?[*]\//g,
		replace: '/**$1@class $2\n$3*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@see (.*)\n((a|[^a])*)[*]\//g,
		replace: '/**$1\n$3*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)[{]@code(?:link)? ([^}]*)[}]((a|[^a])*)[*]\//g,
		replace: '/**$1<code>$2</code>$3*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@(type|param|return)\s*[{]([^}]*)[*]([^}]*)[}]((a|[^a])*)[*]\//g,
		replace: '/**$1@$2 {$3any$4}$5*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@(type|param|return)\s*[{]([^}]*)<([^}]*)[}]((a|[^a])*)[*]\//g,
		replace: '/**$1@$2 {$3&lt;$4}$5*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@(type|param|return)\s*[{]([^}]*)>([^}]*)[}]((a|[^a])*)[*]\//g,
		replace: '/**$1@$2 {$3&gt;$4}$5*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@(type|param|return)\s*[{]([^}]*?)([a-zA-Z0-9_.]+)\[\]([^}]*)[}]((a|[^a])*)[*]\//g,
		replace: '/**$1@$2 {$3Array<$4>$5}$6*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)(?: |\t)*[*]\s*@template\s*.*\n((a|[^a])*)[*]\//g,
		replace: '/**$1$2*/'
	}
];

// -------------------------------------PUBLIC TASKS (gulp task)
gulp.task('dev', function(callback) {
	return runSequence(
		['copy:appStatic', 'copy:imajsServer', 'copy:environment', 'shim', 'polyfill'],
		['Es6ToEs5:client', 'Es6ToEs5:server', 'Es6ToEs5:vendor'],
		['vendor:client', 'vendor:server', 'less', 'doc', 'locale'],
		'vendor:clean',
		['server'],
		['devTest', 'watch'],
		callback
	);
});

gulp
	.option('build', '-e, --env', 'Build environment')
	.task('build', function(callback) {

		if (this.flags.env === 'prod') {
			uglifyCompression.global_defs.$Debug = false;
		}
		return runSequence(
			['copy:appStatic', 'copy:imajsServer', 'copy:environment', 'shim', 'polyfill'], //copy folder public, concat shim
			['Es6ToEs5:client', 'Es6ToEs5:server', 'Es6ToEs5:vendor'], // convert app and vendor script
			['vendor:client', 'vendor:server', 'less', 'doc', 'locale'], // adjust vendors, compile less, create doc,
			['bundle:js:app', 'bundle:js:server', 'bundle:css'],
			['vendor:clean', 'bundle:clean'],// clean vendor
			callback
		);
});

gulp.task('test', function() {
	// Be sure to return the stream
	return gulp.src(files.test.src)
		.pipe(karma({
			configFile: './karma.conf.js',
			action: 'run'
		}))
		.on('error', function(err) {
			// Make sure failed tests cause gulp to exit non-zero
			throw err;
		});
});

gulp.task('doc', function() {
	return (
		gulp
			.src(files.app.src)
			.pipe(change(function (content) {
				var oldContent = null;

				while (content !== oldContent) {
					oldContent = content;
					documentationPreprocessors.forEach(function (preprocessor) {
						content = content.replace(
							preprocessor.pattern,
							preprocessor.replace
						);
					});
				}

				return content;
			}))
			.pipe(yuidoc())
			.pipe(gulp.dest('./doc'))
	);
});

gulp.task('lint', function () {
	return gulp.src(files.app.src)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

// -------------------------------------PRIVATE HELPER TASKS
gulp.task('watch', function() {

	gulp.watch(files.app.watch, ['app:build']);
	gulp.watch(files.vendor.watch, ['vendor:build']);
	gulp.watch(files.less.watch, ['less']);
	gulp.watch(files.server.watch, ['server:build']);
	gulp.watch(files.locale.watch, ['locale:build']);

	gulp.watch(['./imajs/**/*.{js,jsx}', './app/**/*.{js,jsx}', './build/static/js/locale/*.js']).on('change', function(e) {
		watchEvent = e;
		if (e.type === 'deleted') {

			if (cache.caches['Es6ToEs5:client'][e.path]) {
				delete cache.caches['Es6ToEs5:client'][e.path];
				remember.forget('Es6ToEs5:client', e.path);
			}

		}
	});

	flo('./build/static/', {
			port: 5888,
			host: 'localhost',
			glob: [
				'**/*.css'
			]
		},
		function(filepath, callback) {
			gutil.log('Reloading \' public/' + gutil.colors.cyan(filepath) + '\' with flo...');
			callback({
				resourceURL: 'static/' + filepath,
				contents: fs.readFileSync('./build/static/' + filepath).toString()
				//reload: filepath.match(/\.(js|html)$/)
			});
		});
});

gulp.task('server', function() {
	server =  gls.new('./build/server.js');
	server.start();
});

gulp.task('server:restart', function() {
	server.start();
});

gulp.task('server:reload', function(callback) {
	setTimeout(function() {
		server.notify(watchEvent);
		callback();
	}, 2000);
});

gulp.task('devTest', function() {

	return gulp.src(files.test.src)
		.pipe(karma({
			configFile: './karma.conf.js',
			action: 'watch'
		}))
		.on('error', function(err) {
			throw err;
		});
});

gulp.task('copy:appStatic', function() {
	var filesToMove = [
		'./app/assets/static/**/*.*',
		'./app/assets/static/*.*'
	];
	return (
		gulp
			.src(filesToMove)
			.pipe(gulp.dest(files.server.dest + 'static/'))
	);
});

gulp.task('copy:imajsServer', function() {
	var filesToMove = [
		'./imajs/server/**/*.*',
		'./imajs/server/*.*'
	];
	return (
		gulp
			.src(filesToMove)
			.pipe(gulp.dest(files.server.src + 'imajs/'))
	);
});


gulp.task('copy:environment', function() {
	var filesToMove = [
		'./app/environment.js'
	];
	return (
		gulp
			.src(filesToMove)
			.pipe(gulp.dest(files.server.src + 'imajs/config/'))
	);
});

gulp.task('shim', function() {
	return (
		gulp
			.src(files.shim.src)
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(insert.wrap('(function(){', '})();'))
			.pipe(concat(files.shim.name))
			.pipe(gulp.dest(files.shim.dest.client))
			.pipe(gulp.dest(files.shim.dest.server))
	);
});

gulp.task('polyfill', function() {
	return (
		gulp
			.src(files.polyfill.src)
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(insert.wrap('(function(){', '})();'))
			.pipe(concat(files.polyfill.name))
			.pipe(gulp.dest(files.shim.dest.client))
	);
});

// BUILD tasks for watch
gulp.task('server:build', function(callback) {
	return runSequence(
		['copy:imajsServer', 'copy:environment'],
		'Es6ToEs5:server',
		'server:restart',
		'server:reload',
		callback
	);
});

gulp.task('app:build', function(callback) {
	return runSequence(
		'Es6ToEs5:client',
		'server:restart',
		'server:reload',
		callback
	);
});

gulp.task('vendor:build', function(callback) {
	return runSequence(
		'Es6ToEs5:vendor',
		['vendor:client', 'vendor:server'],
		'vendor:clean',
		'server:restart',
		'server:reload',
		callback
	);
});

gulp.task('locale:build', function(callback) {
	return runSequence(
		'locale',
		'server:restart',
		'server:reload',
		callback
	);
});

// build client logic app
gulp.task('Es6ToEs5:client', function() {
	var view = /view.js$/;
	var jsx = /view.jsx$/;

	function isView(file) {
		return !!file.relative.match(view);
	}

	function isJSX(file) {
		return !!file.relative.match(jsx);
	}

	function handleError (error) {
		gutil.log(
			gutil.colors.red('Es6ToEs5:client:error'),
			error.toString()
		);

		this.emit('end');
		this.end();
	}

	return (
		gulp.src(files.app.src)
			.pipe(resolveNewPath('/'))
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(cache('Es6ToEs5:client'))
			.pipe(gulpif(isJSX, react({harmony: false, es6module: true}), gutil.noop()).on('error', handleError))
			.pipe(traceur({modules: 'inline', moduleName: true, sourceMaps: true}))
			.pipe(gulpif(isView, sweetjs({
				modules: ['./imajs/macro/react.sjs', './imajs/macro/componentName.sjs'],
				readableNames: true
			}), gutil.noop()))
			.pipe(remember('Es6ToEs5:client'))
			.pipe(plumber.stop())
			.pipe(save('Es6ToEs5:source'))
			.pipe(concat(files.app.name.client))
			.pipe(insert.wrap('(function(){\n', '\n })();\n'))
			.pipe(sourcemaps.write())
			//.pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
			//.pipe(uglify({mangle:true}))
			.pipe(gulp.dest(files.app.dest.client))
			.pipe(save.restore('Es6ToEs5:source'))
			//.pipe(gulpif(isFile, gutil.noop()))
			//.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(concat(files.app.name.server))
			.pipe(insert.wrap('module.exports = (function(){\n', '\nreturn $__imajs_47_client_47_main_46_js__; })()\n'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(files.app.dest.server))
			//.pipe(size())
	);

});

// build server logic app
gulp.task('Es6ToEs5:server', shell.task('traceur --dir ' + files.server.src + ' ' + files.server.dest + '  --modules=commonjs --source-maps=inline'));


//build vendor for server and client part
gulp.task('Es6ToEs5:vendor', shell.task('traceur --out ' + files.vendor.tmp + ' --script ' + files.vendor.watch.join(' ') + '  --modules=commonjs --source-maps=inline'));

gulp.task('vendor:client', function() {
	return (
		browserify(files.vendor.src, {debug: false, insertGlobals : false, basedir: ''})
			.external('vertx')
			.bundle()
			.pipe(source(files.vendor.name.client))
			//.pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
			.pipe(gulp.dest(files.vendor.dest.client))
	);
});

gulp.task('vendor:server', function() {
	return (
		gulp
			.src(files.vendor.src)
			.pipe(concat(files.vendor.name.server))
			//.pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
			.pipe(insert.wrap('module.exports = (function(config){', ' return vendor;})()'))
			.pipe(gulp.dest(files.vendor.dest.server))
	);
});

gulp.task('vendor:clean', function() {
	return gulp.src(files.vendor.tmp, {read: false})
		.pipe(clean());
});

gulp.task('less', function() {
	return (
		gulp.src(files.less.src)
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(concat({path: files.less.name, base: files.less.base, cwd: files.less.cwd}))
			.pipe(less({compress: true, paths: [ path.join(__dirname) ]}))
			.pipe(autoprefixer())
			.pipe(sourcemaps.write())
			.pipe(plumber.stop())
			.pipe(gulp.dest(files.less.dest))
		);
});

gulp.task('locale', function() {

	function parseLocale(language) {
		return (
			gulp.src(['./app/locale/' + language + '/*.json'])
				.pipe(plumber())
				.pipe(messageFormat({locale:language, global: 'that'}))
				.pipe(plumber.stop())
				.pipe(insert.wrap('(function(){var $IMA = {}; if (typeof window !== "undefined" && window !== null) { window.$IMA = window.$IMA || {}; $IMA = window.$IMA;} var that = $IMA || {};', ' return that.i18n;})();'))
				.pipe(gulp.dest(files.locale.dest.client))
				.pipe(insert.wrap('module.exports =', ''))
				//.pipe(insert.wrap('module.exports = function(){ return this.i18n;', '};'))
				.pipe(gulp.dest(files.locale.dest.server))
		);
	}

	var locales = files.locale.src.map(function(language) {
		return parseLocale(language);
	});

	return locales[locales.length - 1];
});

gulp.task('bundle:js:app', function() {
	return (
		gulp.src(files.bundle.js.src)
			.pipe(plumber())
			.pipe(concat(files.bundle.js.name))
			.pipe(uglify({mangle:true, compress: uglifyCompression}))
			.pipe(plumber.stop())
			.pipe(gulp.dest(files.bundle.js.dest))
	);
});

gulp.task('bundle:js:server', function() {
	var file = files.app.dest.server + files.app.name.server;

	return (
		gulp.src(file)
			.pipe(plumber())
			.pipe(uglify({mangle:false, output: {beautify: true}, compress: uglifyCompression}))
			.pipe(plumber.stop())
			.pipe(gulp.dest(files.app.dest.server))
	);
});

gulp.task('bundle:css', function() {
	return (
		gulp.src(files.bundle.css.src)
			.pipe(plumber())
			.pipe(concat(files.bundle.css.name))
			.pipe(minifyCSS())
			.pipe(plumber.stop())
			.pipe(gulp.dest(files.bundle.css.dest))
	);
});

gulp.task('bundle:clean', function() {
	return (
		gulp.src(files.bundle.css.src.concat(files.bundle.js.src), {read: false})
			.pipe(clean())
	);
});

gulp.task('app:hello', function() {
	return gulp.src('./imajs/examples/helloWorld/**/*')
		.pipe(gulp.dest('./app'));
});

gulp.task('app:feed', function() {
	return gulp.src('./imajs/examples/feed/**/*')
		.pipe(gulp.dest('./app'));
});

gulp.task('app:todos', function() {
	return gulp.src('./imajs/examples/todos/**/*')
		.pipe(gulp.dest('./app'));
});

gulp.task('app:clean', function() {
	return gulp.src(['./app/', './build/'], {read: false})
		.pipe(clean());
});

