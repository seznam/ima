/**
 * Created by slavek on 29.10.14.
 */
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
var jshint = require('gulp-jshint');
var jshintReporter = require('jshint-stylish');
var jscs = require('gulp-jscs');
var traceur = require('gulp-traceur');
var es = require('event-stream');
var react = require('gulp-react');
var sweetjs = require('gulp-sweetjs');
var yuidoc = require('gulp-yuidoc');
var less = require('gulp-less');
var clean = require('gulp-clean');
var sweet = require('sweet.js');
var plumber = require('gulp-plumber');
var karma = require('gulp-karma');
var cache = require('gulp-cached');
var	remember = require('gulp-remember');
var flo = require('fb-flo');
var commander = require('commander');
var through = require('through2');
var messageFormat = require('gulp-messageformat');
var save = require('gulp-save');
var size = require('gulp-filesize');
var nodemon = require('gulp-nodemon');

var coreDependency = require('./imajs/build.js');

try {
	var appDependency = require('./app/build.js');
}catch(e) {
	var appDependency = {
		js: [],
		languages: [],
		less: []
	};
	console.log(e);
}

var watchEvent = null;
var server = null;

var files = {
	vendor: {
		name: {
			server: 'vendor.server.js',
			client: 'vendor.client.js'
		},
		tmp: './.tmp/es5transformedVendor.js',
		src:[
				'./.tmp/es5transformedVendor.js'
		],
		dest: {
			server: './server/module/',
			client: './server/static/js/'
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
			server: './server/module/',
			client: './server/static/js/'
		},
		watch:['./imajs/client/**/*.{js,jsx}', './imajs/client/main.js', '!./imajs/client/vendor.js', './app/**/*.{js,jsx}', '!./app/*.js']
	},
	server: {
		src: './imajs/server/',
		dest: './server/',
		watch: ['./imajs/server/*.js', './imajs/server/**/*.js', './app/environment.js']
	},
	less: {
		name: 'app.less',
		src: appDependency.less,
		dest: './server/static/css/',
		watch: ['./app/**/*.less', '!./app/assets/bower/']
	},
	locale: {
		src: appDependency.languages,
		dest:{
			server: './server/module/locale/',
			client: './server/static/js/locale/'
		},
		watch: ['./app/locale/**/*.json']
	},
	shim : {
		name: 'shim.js',
		src: [
			'./node_modules/es5-shim/es5-shim.js',
			//'./node_modules/es5-shim/es5-shim.map',
			//'./node_modules/es6-shim/es6-shim.map',
			'./node_modules/es6-shim/es6-shim.js',
			traceur.RUNTIME_PATH
		],
		dest: {
			client: './server/static/js/',
			server: './server/module/'
		}
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


// -------------------------------------PUBLIC TASKS (gulp task)
gulp.task('dev', function(callback) {
	return runSequence(
		['static', 'shim'],
		['Es6ToEs5:client', 'Es6ToEs5:server', 'Es6ToEs5:vendor'],
		['vendor:client', 'vendor:server', 'less', 'doc', 'locale', 'environment'],
		'vendor:clean',
		['server'],
		['devTest', 'watch'],
		callback
	);
});

gulp.task('testApi', function(callback) {
	return runSequence(
		'server:apiTest',
		callback
	);
});

gulp.task('build', function(callback) {
	return runSequence(
		['static', 'shim'], //copy folder public, concat shim
		['Es6ToEs5:client', 'Es6ToEs5:server', 'Es6ToEs5:vendor'], // convert app and vendor script
		['vendor:client', 'vendor:server', 'less', 'doc', 'locale', 'environment'], // adjust vendors, compile less, create doc,
		'vendor:clean',// clean vendor
		callback
	);
});

gulp.task('test', function() {
	var testFiles = [];
	// Be sure to return the stream
	return gulp.src(testFiles)
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
			.pipe(yuidoc())
			.pipe(gulp.dest('./doc'))
	);
});

gulp.task('qa', function() {
	var qaFiles = ['./imajs/**/*.js', '!./app/assets/**/*.js'];
	qaFiles.push('!' + files.app.tmp);
	qaFiles.push('!' + files.vendor.tmp);

	return (
		gulp
			.src(qaFiles)
			.pipe(jshint())
			.pipe(jshint.reporter(jshintReporter))
			//.pipe(jscs({esnext: true}))
			//.pipe(shell('jsxhint --jsx-only imajs/client/**/*'))
	);
});



// -------------------------------------PRIVATE HELPER TASKS
gulp.task('watch', function() {

	gulp.watch(files.app.watch, ['app:build']);
	gulp.watch(files.vendor.watch, ['vendor:build']);
	gulp.watch(files.less.watch, ['less']);
	gulp.watch(files.server.watch, ['server:build']);
	gulp.watch(files.locale.watch, ['locale:build']);

	gulp.watch(['./imajs/**/*.{js,jsx}', './app/**/*.{js,jsx}', './server/static/js/locale/*.js']).on('change', function(e) {
		watchEvent = e;
		if (e.type === 'deleted') {

			if (cache.caches['Es6ToEs5:client'][e.path]) {
				delete cache.caches['Es6ToEs5:client'][e.path];
				remember.forget('Es6ToEs5:client', e.path);
			}

		}
	});

	flo('./server/static/', {
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
				contents: fs.readFileSync('./server/static/' + filepath).toString()
				//reload: filepath.match(/\.(js|html)$/)
			});
		});
});

gulp.task('server', function() {
	server =  gls.new('./server/server.js');
	server.start();
});

gulp.task('server:restart', function() {
	server.start();
});

gulp.task('server:reload', function(callback) {
	setTimeout(function() {
		server.notify(watchEvent);
		callback();
	}, 1750);
});


gulp.task('server:apiTest', function () {
	nodemon({ script: './server/apiTest.js', ext: 'js', ignore: [] })
		.on('restart', function () {
			console.log('restarted!');
		});
});

gulp.task('devTest', function() {
	var testFiles = [
		'./imajs/client/test.js',
		'./server/static/js/shim.js',
		'./server/static/js/vendor.client.js',
		'./server/static/js/locale/cs.js',
		'./server/static/js/app.client.js',
		'./app/test/**/*.js',
		'./app/test/*.js',
		'./imajs/client/core/test/**/*.js',
		'./imajs/client/core/test/*.js'
	];
	return gulp.src(testFiles)
		.pipe(karma({
			configFile: './karma.conf.js',
			action: 'watch'
		}))
		.on('error', function(err) {
			throw err;
		});
});

gulp.task('static', function() {
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

gulp.task('environment', function() {
	var filesToMove = [
		'./app/environment.js'
	];
	return (
		gulp
			.src(filesToMove)
			.pipe(gulp.dest(files.server.dest + 'config/'))
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

// BUILD tasks for watch
gulp.task('server:build', function(callback) {
	return runSequence(
		['Es6ToEs5:server', 'environment'],
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

	return (
		gulp.src(files.app.src)
			.pipe(resolveNewPath('imajs/client/'))
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(cache('Es6ToEs5:client'))
			.pipe(gulpif(isJSX, react({harmony: false, es6module: true}), gutil.noop()))
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
			.pipe(insert.wrap('module.exports = function(){\n', '\nreturn $__main_46_js__; };\n'))
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
		browserify(files.vendor.src, {debug: true, insertGlobals : true, basedir: ''})
			.external('vertx')
			.bundle()
			.pipe(source(files.vendor.name.client))
			.pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
			.pipe(gulp.dest(files.vendor.dest.client))
	);
});

gulp.task('vendor:server', function() {
	return (
		gulp
			.src(files.vendor.src)
			.pipe(concat(files.vendor.name.server))
			.pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
			.pipe(insert.wrap('module.exports = function(){', ' return vendor;};'))
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
			.pipe(concat(files.less.name))
			.pipe(less({compress: true, paths: [ path.join(__dirname) ]}))
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

gulp.task('app:hello', function() {
	return gulp.src('./imajs/examples/helloWorld/**/*')
		.pipe(gulp.dest('./app'));
});

gulp.task('app:feed', function() {
	return gulp.src('./imajs/examples/feed/**/*')
		.pipe(gulp.dest('./app'));
});

gulp.task('app:clean', function() {
	return gulp.src('./app/', {read: false})
		.pipe(clean());
});

