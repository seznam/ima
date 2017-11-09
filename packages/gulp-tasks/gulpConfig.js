let coreDependencies = require('ima/build.js');
let path = require('path');
let sharedTasksState = require('./gulpState');
let macroTasks = require('./macroTasks.js');

let appDependencies;
try {
    appDependencies = require(path.resolve('.', 'app/build.js'));
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
            es: [],
            css: []
        }
    };
}

let babelConfig = {
    esVendor: {
        presets: ['react'],
        plugins: ['external-helpers-2']
    },

    vendor: {
        presets: ['react'],
        plugins: ['external-helpers-2']
    },

    esApp: {
        presets: ['react'],
        plugins: ['transform-es2015-modules-systemjs', 'external-helpers-2']
    },

    app: {
        presets: [],
        plugins: []
    },

    server: {
        presets: ['react'],
        plugins: ['transform-es2015-modules-commonjs']
    }
};
let $Debug = true;
let legacyCompactMode = false;

if (['production', 'prod', 'test'].includes(process.env.NODE_ENV)) {
    const esPlugins = [
        'transform-react-constant-elements',
        'transform-react-inline-elements'
    ];
    babelConfig.esApp.plugins = babelConfig.esApp.plugins.concat(esPlugins);
    babelConfig.esVendor.plugins = babelConfig.esVendor.plugins.concat(esPlugins);
    babelConfig.app.presets = ['es2017', 'es2016', ['es2015', { loose: true }]];
    babelConfig.vendor.presets = ['es2017', 'es2016', ['es2015', { loose: true }],  'react'];
    $Debug = false;
    legacyCompactMode = true;
}

if (
    ['dev', undefined].includes(process.env.NODE_ENV) &&
    (process.argv.some(arg => /^--legacy-compat-mode$/.test(arg)) ||
    Object.keys(process.env).includes('npm_config_legacy_compat_mode'))
) {
    babelConfig.app.presets = ['es2017', 'es2016', ['es2015', { loose: true }]];
    babelConfig.vendor.presets = ['es2017', 'es2016', ['es2015', { loose: true }],  'react'];
    legacyCompactMode = true;
}

exports.legacyCompactMode = legacyCompactMode;
exports.babelConfig = babelConfig;

exports.uglifyCompression = {
    global_defs: {
        $Debug: $Debug
    },
    ecma: 6,
    dead_code: true
};

exports.vendorDependencies = {
    common: coreDependencies.vendors.common.concat(appDependencies.vendors.common),
    server: coreDependencies.vendors.server.concat(appDependencies.vendors.server),
    client: coreDependencies.vendors.client.concat(appDependencies.vendors.client),
    test: coreDependencies.vendors.test.concat(appDependencies.vendors.test)
};

exports.tasks = {
    dev: macroTasks.DEFAULT_DEV_SUBTASKS,
    build: macroTasks.DEFAULT_BUILD_SUBTASKS,
    spa: macroTasks.DEFAULT_SPA_SUBTASKS
};

exports.files = {
    vendor: {
        src: {
            client: 'vendor.client.src.js'
        },
        name: {
            server: 'vendor.server.js',
            esClient: 'vendor.client.es.js',
            client: 'vendor.client.js'
        },
        dest: {
            server: './build/ima/',
            client: './build/static/js/',
            tmp: './build/ima/'
        },
        watch: ['./app/build.js', './ima/build.js']
    },
    app: {
        name: {
            server: 'app.server.js',
            client: 'app.client.js',
            esClient: 'app.client.es.js'
        },
        clearServerSide: ['production', 'prod', 'test'].includes(process.env.NODE_ENV),
        src: [].concat(appDependencies.js, appDependencies.mainjs),
        dest: {
            server: './build/ima/',
            client: './build/static/js/'
        },
        watch:['./app/**/*.{js,jsx}', './app/main.js', '!./app/environment.js']
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
            './node_modules/ima/polyfill/collectionEnumeration.js'
        ],
        dest: {
            client: './build/static/js/',
            server: './build/ima/'
        }
    },
    polyfill: {
        js: {
            name: 'polyfill.js',
            src: [
                './node_modules/babel-polyfill/dist/polyfill.min.js',
                './node_modules/custom-event-polyfill/custom-event-polyfill.js'
            ],
            dest: {
                client: './build/static/js/'
            }
        },
        es: {
            name: 'polyfill.es.js',
            src: [
                './node_modules/custom-event-polyfill/custom-event-polyfill.js'
            ],
            dest: {
                client: './build/static/js/'
            }
        },
        fetch: {
            name: 'fetch-polyfill.js',
            src: [
                './node_modules/whatwg-fetch/fetch.js'
            ],
            dest: {
                client: './build/static/js/'
            }
        }
    },
    bundle: {
        js: {
            name: 'app.bundle.min.js',
            src: appDependencies.bundle.js,
            dest: './build/static/js/'
        },
        es: {
            name: 'app.bundle.es.min.js',
            src: appDependencies.bundle.es,
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
