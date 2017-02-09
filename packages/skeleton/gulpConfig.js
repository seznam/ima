let coreDependencies = require('ima/build.js');
let sharedTasksState = require('ima-gulp-tasks/gulpState.js');

let appDependencies;
try {
	appDependencies = require('./app/build.js');
} catch (error) {
	console.info(error.message);
	console.info('The default application dependencies will be used.');

	appDependencies = {
		js: [],
		languages: [],
		less: [],
		vendors: {
			common: [],
			server: [],
			client: []
		},
		bundle: {
			js: [],
			css: []
		}
	};
}

let babelConfig = {
	vendor: {
		presets: ['latest', 'react'],
		plugins: ['external-helpers-2']
	},
	app: {
		presets: ['latest', 'react'],
		plugins: ['transform-es2015-modules-systemjs', 'external-helpers-2']
	},
	ima: {
		presets: ['latest'],
		plugins: ['transform-es2015-modules-systemjs', 'external-helpers-2']
	},
	server: {
		presets: ['latest'],
		plugins: ['external-helpers-2']
	}
};
let $Debug = true;

if (['production', 'prod', 'test'].includes(process.env.NODE_ENV)) {
	babelConfig.app.presets = ['es2017', 'es2016', ['es2015', { loose: true }], 'react'];
	babelConfig.app.plugins = babelConfig.app.plugins.concat([
		'transform-react-constant-elements',
		'transform-react-inline-elements'
	]);
	babelConfig.ima.presets = ['es2017', 'es2016', ['es2015', { loose: true }]];
	$Debug = false;
}

exports.babelConfig = babelConfig;

exports.uglifyCompression = {
	global_defs: {
		$Debug: $Debug
	},
	dead_code: true
};

exports.vendorDependencies = {
	common: coreDependencies.vendors.common.concat(appDependencies.vendors.common),
	server: coreDependencies.vendors.server.concat(appDependencies.vendors.server),
	client: coreDependencies.vendors.client.concat(appDependencies.vendors.client),
	test: coreDependencies.vendors.test.concat(appDependencies.vendors.test)
};

exports.tasks = {
	dev: [
		['copy:appStatic', 'copy:environment', 'shim', 'polyfill'],
		['Es6ToEs5:app', 'Es6ToEs5:ima', 'Es6ToEs5:server', 'Es6ToEs5:vendor'],
		['less', 'doc', 'locale', 'Es6ToEs5:vendor:client', 'Es6ToEs5:vendor:client:test'],
		'server',
		['test:unit:karma:dev', 'watch']
	],
	build: [
		['copy:appStatic', 'copy:environment', 'shim', 'polyfill'],
		['Es6ToEs5:app', 'Es6ToEs5:ima', 'Es6ToEs5:server', 'Es6ToEs5:vendor'],
		['less', 'doc', 'locale', 'Es6ToEs5:vendor:client', 'Es6ToEs5:vendor:client:test'],
		['bundle:js:app', 'bundle:js:server', 'bundle:css']
	],
	spa: [
		['copy:appStatic', 'shim', 'polyfill'], // copy public folder, concat shim
		['Es6ToEs5:app', 'Es6ToEs5:ima', 'Es6ToEs5:vendor'], // compile app and vendor script
		['less', 'doc', 'locale', 'Es6ToEs5:vendor:client'], // adjust vendors, compile less, create doc
		['bundle:js:app', 'bundle:css', 'spa:compile'],
		'spa:clean'
	]
};

exports.files = {
	vendor: {
		src: {
			client: 'vendor.client.src.js',
			test: 'vendor.client.test.src.js'
		},
		name: {
			server: 'vendor.server.js',
			client: 'vendor.client.js',
			test: 'vendor.client.test.js'
		},
		dest: {
			server: './build/ima/',
			client: './build/static/js/',
			test: './build/static/js/',
			tmp: './build/ima/'
		},
		watch: ['./app/build.js', './ima/build.js']
	},
	app: {
		name: {
			server: 'app.server.js',
			client: 'app.client.js'
		},
		clearServerSide: ['production', 'prod', 'test'].includes(process.env.NODE_ENV),
		src: [].concat(appDependencies.js, appDependencies.mainjs),
		dest: {
			server: './build/ima/',
			client: './build/static/js/'
		},
		watch:['./app/**/*.{js,jsx}', './app/main.js', '!./app/environment.js']
	},
	ima: {
		name: {
			server: 'ima.server.js',
			client: 'ima.client.js'
		},
		clearServerSide: ['production', 'prod', 'test'].includes(process.env.NODE_ENV),
		src: [].concat(coreDependencies.js, coreDependencies.mainjs),
		dest: {
			server: './build/ima/',
			client: './build/static/js/'
		},
		watch:['./node_modules/ima/**/*.{js,jsx}', '!./node_modules/ima/gulpfile.js']
	},
	server: {
		cwd: '/',
		src: ['./server/*.js', './server/**/*.js'],
		base: './server/',
		dest: './build/',
		watch: ['./server/*.js', './server/**/*.js', './app/*.js', '!./server/ima/config/*.js']
	},
	less: {
		cwd: '/',
		base: './app/assets/less/',
		name: './app/assets/less/app.less',
		src: appDependencies.less,
		dest: './build/static/css/',
		watch: ['./app/**/*.less', '!./app/assets/bower/']
	},
	locale: {
		src: appDependencies.languages,
		dest:{
			server: './build/ima/locale/',
			client: './build/static/js/locale/'
		},
		watch: ['./app/**/*.json']
	},
	shim : {
		name: 'shim.js',
		src: [
			'./node_modules/ima/polyfill/collectionEnumeration.js',
			'./node_modules/ima/polyfill/imaLoader.js',
			'./node_modules/ima/polyfill/imaRunner.js'
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
			'./node_modules/custom-event-polyfill/custom-event-polyfill.js'
		],
		dest: {
			client: './build/static/js/'
		}
	},
	bundle: {
		js: {
			name: 'app.bundle.min.js',
			src: appDependencies.bundle.js,
			dest: './build/static/js/'
		},
		css: {
			name: 'app.bundle.min.css',
			src: appDependencies.bundle.css,
			dest: './build/static/css/'
		}
	}
};

exports.onTerminate = () => {
	if (sharedTasksState.karmaServer) {
		sharedTasksState.karmaServer.stop();
	}

	setTimeout(() => {
		process.exit();
	});
};
