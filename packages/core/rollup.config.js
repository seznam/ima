import includePaths from 'rollup-plugin-includepaths';

let includePathOptions = {
  include: {},
  paths: [
    'cache',
    'controller',
    'debug',
    'dictionary',
    'error',
    'event',
    'execution',
    'extension',
    'http',
    'meta',
    'page',
    'router',
    'storage',
    'window'
  ],
  external: [],
  extensions: ['.js']
};

const config = [
  {
    external: [
      'ima-helpers',
      'classnames',
      'prop-types',
      'react',
      'react-dom'

      // 'cache/Cache',
      // 'cache/CacheEntry',
      // 'cache/CacheFactory',
      // 'cache/CacheImpl',
      // 'controller/AbstractController',
      // 'controller/Controller',
      // 'controller/ControllerDecorator',
      // 'debug/DevTool',
      // 'dictionary/Dictionary',
      // 'dictionary/MessageFormatDictionary',
      // 'error/Error',
      // 'error/ExtensibleError',
      // 'error/GenericError',
      // 'event/Dispatcher',
      // 'event/DispatcherImpl',
      // 'event/EventBus',
      // 'event/EventBusImpl',
      // 'execution/AbstractExecution',
      // 'execution/Execution',
      // 'execution/SerialBatch',
      // 'extension/AbstractExtension',
      // 'extension/Extension',
      // 'http/HttpAgent',
      // 'http/HttpAgentImpl',
      // 'http/HttpProxy',
      // 'http/StatusCode',
      // 'http/UrlTransformer',
      // 'meta/MetaManager',
      // 'meta/MetaManagerImpl',
      // 'page/handler/PageHandler',
      // 'page/handler/PageHandlerRegistry',
      // 'page/handler/PageNavigationHandler',
      // 'page/manager/AbstractPageManager',
      // 'page/manager/ClientPageManager',
      // 'page/manager/PageManager',
      // 'page/manager/ServerPageManager',
      // 'page/renderer/AbstractPageRenderer',
      // 'page/renderer/BlankManagedRootView',
      // 'page/renderer/ClientPageRenderer',
      // 'page/renderer/PageRenderer',
      // 'page/renderer/PageRendererFactory',
      // 'page/renderer/ServerPageRenderer',
      // 'page/renderer/ViewAdapter',
      // 'page/state/Events',
      // 'page/state/PageStateManager',
      // 'page/state/PageStateManagerDecorator',
      // 'page/state/PageStateManagerImpl',
      // 'page/AbstractComponent',
      // 'page/AbstractDocumentView',
      // 'page/AbstractPureComponent',
      // 'page/componentHelpers',
      // 'page/context',
      // 'page/PageFactory',
      // 'router/AbstractRouter',
      // 'router/ActionTypes',
      // 'router/ClientRouter',
      // 'router/Events',
      // 'router/Request',
      // 'router/Response',
      // 'router/Route',
      // 'router/RouteFactory',
      // 'router/RouteNames',
      // 'router/Router',
      // 'router/ServerRouter',
      // 'storage/CookieStorage',
      // 'storage/SessionStorage',
      // 'storage/SessionMapStorage',
      // 'storage/Storage',
      // 'storage/WeakMapStorage',
      // 'window/Window',
      // 'window/ServerWindow',
      // 'window/ClientWindow'
    ],
    input: 'main.js',
    plugins: [includePaths(includePathOptions)],

    treeshake: {
      pureExternalModules: true
    },

    output: [
      {
        file: 'dist/bundle-cjs.js',
        format: 'cjs',
        exports: 'named'
      },
      {
        file: 'dist/bundle-esm.js',
        format: 'esm',
        exports: 'named'
      }
    ]
  }
];

export default config;
