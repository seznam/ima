let autoprefixer = require('autoprefixer');
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
sharedTasksState.watchMode = process.argv.some(arg => /^dev$/.test(arg));
const isProduction = ['production', 'prod', 'test'].includes(
  process.env.NODE_ENV
);
const vendorOptions = {
  debug: false,
  insertGlobals: false,
  basedir: '.',
  cache: {},
  packageCache: {},
  noParse: ['clone']
};
const esPlugins = [
  '@babel/plugin-transform-react-constant-elements',
  '@babel/plugin-transform-react-inline-elements',
  '@babel/plugin-transform-react-remove-prop-types'
];
const baseBabelPlugins = [
  '@babel/plugin-external-helpers',
  ['@babel/plugin-transform-react-jsx', { useBuiltIns: true }]
];

let babelConfig = {
  esVendor: {
    transform: [
      [
        'babelify',
        {
          babelrc: false,
          global: true,
          presets: ['@babel/preset-react'],
          plugins: isProduction
            ? [].concat(baseBabelPlugins, esPlugins)
            : baseBabelPlugins
        }
      ],
      [
        'loose-envify',
        {
          NODE_ENV: process.env.NODE_ENV || 'development'
        }
      ],
      ['ima-clientify']
    ],
    plugin: sharedTasksState.watchMode ? [['watchify']] : [],
    options: Object.assign({}, vendorOptions)
  },
  vendor: {
    transform: [
      [
        'babelify',
        {
          babelrc: false,
          global: true,
          presets: [
            ['@babel/preset-env', { loose: true }],
            '@babel/preset-react'
          ],
          plugins: baseBabelPlugins
        }
      ],
      [
        'loose-envify',
        {
          NODE_ENV: process.env.NODE_ENV || 'development'
        }
      ],
      ['ima-clientify']
    ],
    plugin: sharedTasksState.watchMode ? [['watchify']] : [],
    options: Object.assign({}, vendorOptions)
  },
  serverApp: {
    presets: ['@babel/preset-react'],
    plugins: ['@babel/plugin-transform-es2015-modules-systemjs'].concat(
      baseBabelPlugins
    )
  },
  esApp: {
    presets: [],
    plugins: ['@babel/plugin-external-helpers']
  },
  app: {
    presets: [['@babel/preset-env', { loose: true }]],
    plugins: ['@babel/plugin-external-helpers']
  },
  server: {
    presets: ['@babel/preset-react'],
    plugins: [
      '@babel/plugin-transform-es2015-modules-commonjs',
      ['@babel/plugin-transform-react-jsx', { useBuiltIns: true }]
    ]
  }
};
let $Debug = true;
let legacyCompactMode = false;

if (isProduction) {
  babelConfig.esApp.plugins = babelConfig.esApp.plugins.concat(esPlugins);
  $Debug = false;
  legacyCompactMode = true;
}

if (
  ['dev', undefined].includes(process.env.NODE_ENV) &&
  (process.argv.some(arg => /^--legacy-compat-mode$/.test(arg)) ||
    Object.keys(process.env).includes('npm_config_legacy_compat_mode'))
) {
  legacyCompactMode = true;
}

exports.legacyCompactMode = legacyCompactMode;
exports.babelConfig = babelConfig;
exports.$Debug = $Debug;

exports.uglifyCompression = {
  global_defs: {
    $Debug: $Debug
  },
  ecma: 7,
  dead_code: true
};

exports.liveServer = {
  port: undefined
};

exports.vendorDependencies = {
  common: coreDependencies.vendors.common.concat(
    appDependencies.vendors.common
  ),
  server: coreDependencies.vendors.server.concat(
    appDependencies.vendors.server
  ),
  client: coreDependencies.vendors.client.concat(
    appDependencies.vendors.client
  ),
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
    clearServerSide: isProduction,
    src: [].concat(appDependencies.js, appDependencies.mainjs),
    dest: {
      server: './build/ima/',
      client: './build/static/js/'
    },
    watch: ['./app/**/*.{js,jsx}', './app/main.js', '!./app/environment.js']
  },
  server: {
    cwd: '/',
    src: ['./server/*.js', './server/**/*.js'],
    base: './server/',
    dest: './build/',
    watch: [
      './server/*.js',
      './server/**/*.js',
      './app/*.js',
      '!./server/ima/config/*.js'
    ]
  },
  less: {
    cwd: '/',
    base: './app/assets/less/',
    name: './app/assets/less/app.less',
    src: appDependencies.less,
    dest: './build/static/css/',
    watch: ['./app/**/*.less', '!./app/assets/bower/'],
    postCssPlugins: [autoprefixer()]
  },
  locale: {
    src: appDependencies.languages,
    dest: {
      server: './build/ima/locale/',
      client: './build/static/js/locale/'
    },
    watch: ['./app/**/*.json']
  },
  shim: {
    js: {
      name: 'shim.js',
      src: ['./node_modules/ima/polyfill/collectionEnumeration.js'],
      dest: {
        client: './build/static/js/'
      }
    },
    es: {
      name: 'shim.es.js',
      src: [],
      dest: {
        client: './build/static/js/',
        server: './build/ima/'
      }
    }
  },
  polyfill: {
    js: {
      name: 'polyfill.js',
      src: [
        './node_modules/@babel/polyfill/dist/polyfill.min.js',
        './node_modules/custom-event-polyfill/polyfill.js'
      ],
      dest: {
        client: './build/static/js/'
      }
    },
    es: {
      name: 'polyfill.es.js',
      src: [],
      dest: {
        client: './build/static/js/'
      }
    },
    fetch: {
      name: 'fetch-polyfill.js',
      src: [
        './node_modules/core-js/client/shim.min.js',
        './node_modules/whatwg-fetch/dist/fetch.umd.js'
      ],
      dest: {
        client: './build/static/js/'
      }
    },
    ima: {
      name: 'ima-polyfill.js',
      src: [
        './node_modules/ima/polyfill/imaLoader.js',
        './node_modules/ima/polyfill/imaRunner.js'
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
    },
    postCssPlugins: []
  }
};

exports.onTerminate = () => {
  setTimeout(() => {
    process.exit();
  });
};
