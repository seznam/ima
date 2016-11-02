
let gulp = require('gulp');
let babel = require('gulp-babel');
let babelify = require('babelify');
let browserify = require('browserify');
let cache = require('gulp-cached');
let change = require('gulp-change');
let concat = require('gulp-concat');
let del = require('del');
let es = require('event-stream');
let fs = require('fs');
let insert = require('gulp-insert');
let path = require('path');
let plumber = require('gulp-plumber');
let remember = require('gulp-remember');
let save = require('gulp-save');
let source = require('vinyl-source-stream');
let sourcemaps = require('gulp-sourcemaps');
let gulpIgnore = require('gulp-ignore');
let tap = require('gulp-tap');

let gulpConfig = require('../../../gulpConfig.js');
let files = gulpConfig.files;
let babelConfig = gulpConfig.babelConfig;

exports.Es6ToEs5_app = Es6ToEs5_app;
function Es6ToEs5_app() {
	function insertSystemImports() {
		return change((content) => {
			content = content + '\n' +
				'$IMA.Loader.initAllModules();\n' +
				'Promise.all([$IMA.Loader.import("app/main")])\n' +
				'.catch(function (error) { \n' +
				'console.error(error); \n });';

			return content;
		});
	}

	function replaceToIMALoader() {
		return change((content) => {
			content = content.replace(/System.import/g, '$IMA.Loader.import');
			content = content.replace(/System.register/g, '$IMA.Loader.register');

			return content;
		});
	}

	function excludeServerSideFile(file) {
		return (file.contents.toString().indexOf('@server-side') !== -1) &&
			files.app.clearServerSide;
	}

	return gulp
		.src(files.app.src)
		.pipe(resolveNewPath(files.app.base || '/'))
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(cache('Es6ToEs5_app'))
		.pipe(babel({
			moduleIds: true,
			presets: babelConfig.app.presets,
			plugins: babelConfig.app.plugins
		 }))
		.pipe(remember('Es6ToEs5_app'))
		.pipe(plumber.stop())
		.pipe(save('Es6ToEs5_app_source'))
		.pipe(gulpIgnore.exclude(excludeServerSideFile))
		.pipe(concat(files.app.name.client))
		.pipe(replaceToIMALoader())
		.pipe(insert.wrap('(function(){\n', '\n })();\n'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(files.app.dest.client))
		.pipe(save.restore('Es6ToEs5_app_source'))
		.pipe(concat(files.app.name.server))
		.pipe(insertSystemImports())
		.pipe(replaceToIMALoader())
		.pipe(insert.wrap('module.exports = (function(){\n', '\n })\n'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(files.app.dest.server));
}

exports.Es6ToEs5_ima = Es6ToEs5_ima;
function Es6ToEs5_ima() {
	function replaceToIMALoader() {
		return change((content) => {
			content = content.replace(/System.import/g, '$IMA.Loader.import');
			content = content.replace(/System.register/g, '$IMA.Loader.register');

			return content;
		});
	}

	function excludeServerSideFile(file) {
		return (file.contents.toString().indexOf('@server-side') !== -1) &&
			files.ima.clearServerSide;
	}

	return gulp
		.src(files.ima.src)
		.pipe(resolveNewPath(files.ima.base || '/node_modules'))
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(cache('Es6ToEs5_ima'))
		.pipe(babel({
			moduleIds: true,
			presets: babelConfig.ima.presets,
			plugins: babelConfig.ima.plugins
		 }))
		.pipe(remember('Es6ToEs5_ima'))
		.pipe(plumber.stop())
		.pipe(save('Es6ToEs5_ima_source'))
		.pipe(gulpIgnore.exclude(excludeServerSideFile))
		.pipe(concat(files.ima.name.client))
		.pipe(replaceToIMALoader())
		.pipe(insert.wrap('(function(){\n', '\n })();\n'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(files.ima.dest.client))
		.pipe(save.restore('Es6ToEs5_ima_source'))
		.pipe(concat(files.ima.name.server))
		.pipe(replaceToIMALoader())
		.pipe(insert.wrap('module.exports = (function(){\n', '\n })\n'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(files.ima.dest.server));
}

exports.Es6ToEs5_server = Es6ToEs5_server;
function Es6ToEs5_server() {
	return gulp
		.src(files.server.src)
		.pipe(plumber())
		.pipe(babel({
			presets: babelConfig.server.presets,
			plugins: babelConfig.server.plugins
		}))
		.pipe(plumber.stop())
		.pipe(gulp.dest(files.server.dest));
}

exports.Es6ToEs5_vendor = Es6ToEs5_vendor;
function Es6ToEs5_vendor(done) {
	let vendorModules = gulpConfig.vendorDependencies;
	let serverModules = vendorModules.common.concat(vendorModules.server);
	let clientModules = vendorModules.common.concat(vendorModules.client);
	let testModules = vendorModules.test || [];

	let serverModuleLinker = getModuleLinkerContent(serverModules);
	let clientModuleLinker = getModuleLinkerContent(clientModules);
	let testModuleLinker = getModuleLinkerContent(testModules);

	let normalizedTmpPath = files.vendor.dest.tmp
			.replace(/^\.\//, '')
			.replace(/\/\.\//, '/')
			.split('/');
	for (let i = 0; i < normalizedTmpPath.length; i++) {
		let currentPath = './' + normalizedTmpPath.slice(0, i).join('/');
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
			if (error || !files.vendor.src.test) {
				return done(error);
			}

			fs.writeFile(files.vendor.dest.tmp + files.vendor.src.test, testModuleLinker, (error) => {
				done(error);
			});
		});
	});

	function getModuleLinkerContent(modules) {
		let linkingFileHeader = `let vendorLinker = require('ima/vendorLinker.js');\n`;
		let linkingFileFooter = `module.exports = vendorLinker;\n`;
		let duplicity = [];

		return linkingFileHeader +
		modules
			.map((vendorModuleName) => {
				let alias = vendorModuleName;

				if (typeof vendorModuleName === 'object') {
					alias = Object.keys(vendorModuleName)[0];

					if (modules.indexOf(alias) !== -1) {
						duplicity.push(alias);
					}
				}

				return vendorModuleName;
			})
			.filter((vendorModuleName) => (
				(
					(typeof vendorModuleName === 'string') &&
					(duplicity.indexOf(vendorModuleName) === -1)
				) ||
				(typeof vendorModuleName === 'object')
			))
			.map((vendorModuleName) => {
				let alias = vendorModuleName;
				let moduleName = vendorModuleName;

				if (typeof vendorModuleName === 'object') {
					alias = Object.keys(vendorModuleName)[0];
					moduleName = vendorModuleName[alias];
				}

				return generateVendorInclusion(alias, moduleName);
			})
			.join('') +
		linkingFileFooter;
	}

	function generateVendorInclusion(alias, moduleName) {
		return `vendorLinker.set('${alias}', require('${moduleName}'));\n`;
	}
}

exports.Es6ToEs5_vendor_client = Es6ToEs5_vendor_client;
function Es6ToEs5_vendor_client() {
	let sourceFile = files.vendor.dest.tmp + files.vendor.src.client;
	let options = { debug: false, insertGlobals: false, basedir: '.' };

	return browserify(sourceFile, options)
		.transform(babelify.configure({
			presets: babelConfig.vendor.presets,
			plugins: babelConfig.vendor.plugins
		}))
		.bundle()
		.pipe(source(files.vendor.name.client))
		.pipe(gulp.dest(files.vendor.dest.client));
}

exports.Es6ToEs5_vendor_client_test = Es6ToEs5_vendor_client_test;
function Es6ToEs5_vendor_client_test() {
	if (!files.vendor.src.test) {
		return;
	}

	let sourceFiles = [
		files.vendor.dest.tmp + files.vendor.src.test,
		files.vendor.dest.tmp + files.vendor.src.client
	];
	let options = { debug: false, insertGlobals: false, basedir: '.' };

	return browserify(sourceFiles, options)
		.transform(babelify.configure({
			presets: babelConfig.vendor.presets,
			plugins: babelConfig.vendor.plugins
		}))
		.external('react/addons')
		.external('react/lib/ReactContext')
		.external('react/lib/ExecutionEnvironment')
		.bundle()
		.pipe(source(files.vendor.name.test))
		.pipe(gulp.dest(files.vendor.dest.test));
}

exports.Es6ToEs5_vendor_clean = Es6ToEs5_vendor_clean;
function Es6ToEs5_vendor_clean() {
	return del([files.vendor.dest.tmp + files.vendor.name.tmp]);
}

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
