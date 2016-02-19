var coreDependency = require('./ima/build.js');

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

var babelConfig = {
	vendor: {
		presets: ['es2015', 'react'],
		plugins: ['external-helpers-2']
	},
	app: {
		presets: ['es2015', 'react'],
		plugins: ['transform-es2015-modules-systemjs', 'external-helpers-2']
	},
	server: {
		presets: ['es2015'],
		plugins: ['external-helpers-2']
	}
};
var $Debug = true;

if (process.env.NODE_ENV === 'production' ||
		process.env.NODE_ENV === 'prod' ||
		process.env.NODE_ENV === 'test') {
	babelConfig.app.presets = ['es2015-loose', 'react'];
	babelConfig.app.plugins = babelConfig.app.plugins.concat(['transform-react-constant-elements', 'transform-react-inline-elements']);
	$Debug = false;
}

exports.babelConfig = babelConfig;

exports.uglifyCompression = {
	global_defs: {
		$Debug: $Debug
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
		src:['./ima/vendor.js', './app/vendor.js'],
		dest: {
			server: './build/ima/',
			client: './build/static/js/',
			tmp: './build/ima/'
		},
		watch: ['./ima/vendor.js', './app/vendor.js']
	},
	app: {
		name: {
			server: 'app.server.js',
			client: 'app.client.js'
		},
		src: [].concat(coreDependency.js, appDependency.js, coreDependency.mainjs, appDependency.mainjs),
		dest: {
			server: './build/ima/',
			client: './build/static/js/'
		},
		watch:['./ima/**/*.{js,jsx}', '!./ima/vendor.js', './app/**/*.{js,jsx}', '!./app/*.js', './app/main.js']
	},
	server: {
		cwd: '/',
		src: ['./server/*.js', './server/**/*.js'],
		base: './server/',
		dest: './build/',
		watch: ['./server/*.js', './server/**/*.js', './app/environment.js']
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
			server: './build/ima/locale/',
			client: './build/static/js/locale/'
		},
		watch: ['./app/locale/**/*.json']
	},
	shim : {
		name: 'shim.js',
		src: [
			'./ima/polyfill/collectionEnumeration.js',
			'./ima/polyfill/imaLoader.js'
		],
		dest: {
			client: './build/static/js/',
			server: './build/ima/'
		}
	},
	polyfill: {
		name: 'polyfill.js',
		src: [
			'./node_modules/babel-polyfill/dist/polyfill.min.js',
			'./node_modules/custom-event-polyfill/custom-event-polyfill.js',
			'./node_modules/ima.js-babel6-polyfill/index.js'
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
