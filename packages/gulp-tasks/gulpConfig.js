const autoprefixer = require('autoprefixer');
const coreDependencies = require('@ima/core/build.js');
const path = require('path');
const fs = require('fs');

const sharedTasksState = require('./gulpState');
const macroTasks = require('./macroTasks.js');

function getModuleChildPath(parentModule, childModule) {
  const paths = [
    `./node_modules/@ima/gulp-tasks/${parentModule}/node_modules/${childModule}`,
    `./node_modules/${parentModule}/node_modules/${childModule}`,
    `./node_modules/${childModule}`,
  ];

  for (let modulePath of paths) {
    if (fs.existsSync(modulePath)) {
      return modulePath;
    }
  }

  throw Error(
    `Could not find path for child module ${childModule} of parent module ${parentModule}`
  );
}

let environment;
try {
  const environmentConfig = require(path.resolve('./app/environment.js'));
  const nodeEnv =
    process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined
      ? 'dev'
      : process.env.NODE_ENV;
  environment = require('@ima/helpers').resolveEnvironmentSetting(
    environmentConfig,
    nodeEnv
  );
} catch (error) {
  // eslint-disable-next-line no-console
  console.info(error.message);
  // eslint-disable-next-line no-console
  console.info('The default environment config will be used.');

  environment = {
    $Server: {
      port: 3001,
    },
  };
}

let appDependencies;
try {
  appDependencies = require(path.resolve('.', 'app/build.js'));
} catch (error) {
  // eslint-disable-next-line no-console
  console.info(error.message);
  // eslint-disable-next-line no-console
  console.info('The default application dependencies will be used.');

  appDependencies = {
    js: [],
    languages: [],
    less: [],
    vendors: {
      common: [],
      server: [],
      client: [],
    },
    bundle: {
      js: [],
      es: [],
      css: [],
    },
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
  noParse: ['clone'],
};
const esPlugins = [
  '@babel/plugin-transform-react-constant-elements',
  '@babel/plugin-transform-react-inline-elements',
];
const baseBabelPlugins = [
  '@babel/plugin-external-helpers',
  ['@babel/plugin-transform-react-jsx', { useBuiltIns: true }],
  'babel-plugin-react-prop-types-remover',
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
            : baseBabelPlugins,
        },
      ],
      [
        'loose-envify',
        {
          NODE_ENV: process.env.NODE_ENV || 'development',
        },
      ],
      ['ima-clientify'],
    ],
    plugin: sharedTasksState.watchMode ? [['watchify']] : [],
    options: Object.assign({}, vendorOptions),
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
            '@babel/preset-react',
          ],
          plugins: baseBabelPlugins,
        },
      ],
      [
        'loose-envify',
        {
          NODE_ENV: process.env.NODE_ENV || 'development',
        },
      ],
      ['ima-clientify'],
    ],
    plugin: sharedTasksState.watchMode ? [['watchify']] : [],
    options: Object.assign({}, vendorOptions),
  },
  serverApp: {
    presets: ['@babel/preset-react'],
    plugins: ['@babel/plugin-transform-modules-systemjs'].concat(
      baseBabelPlugins
    ),
  },
  esApp: {
    presets: [],
    plugins: [
      '@babel/plugin-external-helpers',
      'babel-plugin-react-prop-types-remover',
    ],
  },
  app: {
    presets: [['@babel/preset-env', { loose: true }]],
    plugins: [
      '@babel/plugin-external-helpers',
      'babel-plugin-react-prop-types-remover',
    ],
  },
  server: {
    presets: ['@babel/preset-react'],
    plugins: [
      '@babel/plugin-transform-modules-commonjs',
      ['@babel/plugin-transform-react-jsx', { useBuiltIns: true }],
    ],
  },
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
    $Debug: $Debug,
  },
  ecma: 7,
  dead_code: true,
};

exports.liveServer = {
  port: undefined,
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
  test: coreDependencies.vendors.test.concat(appDependencies.vendors.test),
};

exports.tasks = {
  dev: macroTasks.DEFAULT_DEV_SUBTASKS,
  build: macroTasks.DEFAULT_BUILD_SUBTASKS,
  spa: macroTasks.DEFAULT_SPA_SUBTASKS,
};

exports.files = {
  vendor: {
    src: {
      client: 'vendor.client.src.js',
    },
    name: {
      server: 'vendor.server.js',
      esClient: 'vendor.client.es.js',
      client: 'vendor.client.js',
    },
    dest: {
      server: './build/ima/',
      client: './build/static/js/',
      tmp: './build/ima/',
    },
    watch: ['./app/build.js', './ima/build.js'],
  },
  app: {
    name: {
      server: 'app.server.js',
      client: 'app.client.js',
      esClient: 'app.client.es.js',
    },
    clearServerSide: isProduction,
    src: [].concat(appDependencies.js, appDependencies.mainjs),
    dest: {
      server: './build/ima/',
      client: './build/static/js/',
    },
    watch: ['./app/**/*.{js,jsx}', './app/main.js', '!./app/environment.js'],
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
      '!./server/ima/config/*.js',
    ],
  },
  less: {
    cwd: '/',
    base: './app/assets/less/',
    name: './app/assets/less/app.less',
    src: appDependencies.less,
    dest: './build/static/css/',
    watch: ['./app/**/*.less', '!./app/assets/bower/'],
    postCssPlugins: [autoprefixer()],
  },
  locale: {
    src: appDependencies.languages,
    dest: {
      server: './build/ima/locale/',
      client: './build/static/js/locale/',
    },
    watch: ['./app/**/*.json'],
  },
  shim: {
    js: {
      name: 'shim.js',
      src: ['./node_modules/@ima/core/polyfill/collectionEnumeration.js'],
      dest: {
        client: './build/static/js/',
      },
    },
    es: {
      name: 'shim.es.js',
      src: [],
      dest: {
        client: './build/static/js/',
        server: './build/ima/',
      },
    },
  },
  polyfill: {
    js: {
      name: 'polyfill.js',
      src: [
        './node_modules/@babel/polyfill/dist/polyfill.min.js',
        './node_modules/custom-event-polyfill/polyfill.js',
      ],
      dest: {
        client: './build/static/js/',
      },
    },
    es: {
      name: 'polyfill.es.js',
      src: [],
      dest: {
        client: './build/static/js/',
      },
    },
    fetch: {
      name: 'fetch-polyfill.js',
      src: [
        getModuleChildPath('@babel/polyfill', 'core-js') +
          '/client/shim.min.js',
        './node_modules/whatwg-fetch/dist/fetch.umd.js',
      ],
      dest: {
        client: './build/static/js/',
      },
    },
    ima: {
      name: 'ima-polyfill.js',
      src: [
        './node_modules/@ima/core/polyfill/imaLoader.js',
        './node_modules/@ima/core/polyfill/imaRunner.js',
      ],
      dest: {
        client: './build/static/js/',
      },
    },
  },
  bundle: {
    js: {
      name: 'app.bundle.min.js',
      src: appDependencies.bundle.js,
      dest: './build/static/js/',
    },
    es: {
      name: 'app.bundle.es.min.js',
      src: appDependencies.bundle.es,
      dest: './build/static/js/',
    },
    css: {
      name: 'app.bundle.min.css',
      src: appDependencies.bundle.css,
      dest: './build/static/css/',
    },
    postCssPlugins: [],
    cssnanoSettings: {},
  },
};

const defaultNotifyServer = {
  enable: false,
  jobRunTimeout: 200,
  server: 'localhost',
  port: 4445,
  messageJobs: {
    '(js|ejs|jsx)': ['vendor:build'],
    '(css|sass|less)': ['less:build'],
  },
};

exports.webSocketServerConfig = {
  port: 5888,
};

exports.hotReloadConfig = {
  watch: ['./build/static/css/*.css', './build/static/js/*.js'],
  options: {
    persistent: true,
  },
  socket: {},
};

exports.occupiedPorts = {
  server: environment.$Server.port,
  notifyServer: defaultNotifyServer.port,
  livereload: exports.liveServer.port || 35729,
  webSocketServer: exports.webSocketServerConfig.port,
};

exports.notifyServer = defaultNotifyServer;

exports.onTerminate = () => {
  setTimeout(() => {
    process.exit();
  });
};
