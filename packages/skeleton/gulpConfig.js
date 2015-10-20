
var coreDependency = require('./imajs/build.js');

var appDependency;
try {
	appDependency = require('./app/build.js');
} catch (e) {
	appDependency = {
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

exports.babelOptional = ["optimisation.react.constantElements", "optimisation.react.inlineElements"];

exports.uglifyCompression = {
	global_defs: {
		$Debug: false
	},
	dead_code: true
};

exports.files = {
	vendor: {
		name: {
			server: 'vendor.server.js',
			client: 'vendor.client.js',
			tmp: 'es5transformedVendor.js'
		},
		src:['./imajs/client/core/vendor.js', './app/vendor.js'],
		dest: {
			server: './build/imajs/',
			client: './build/static/js/',
			tmp: './build/imajs/'
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
		cwd: '/',
		src: ['./server/*.js', './server/**/*.js'],
		base: './server/',
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
			'./node_modules/gulp-babel/node_modules/babel-core/external-helpers.js',
			'./imajs/polyfill/collectionEnumeration.js',
			'./imajs/polyfill/imaLoader.js'
		],
		dest: {
			client: './build/static/js/',
			server: './build/imajs/'
		}
	},
	polyfill: {
		name: 'polyfill.js',
		src: [
			'./node_modules/custom-event-polyfill/custom-event-polyfill.js',
			'./node_modules/gulp-babel/node_modules/babel-core/browser-polyfill.js'
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
	}
};
