'use strict';

// Node
let cluster = require('cluster');
let path = require('path');
let os = require('os');
global.appRoot = path.resolve(__dirname);

// IMA server
let imaServer = require('@ima/server');

let clientApp = imaServer.clientApp;
let urlParser = imaServer.urlParser;
let environment = imaServer.environment;
let logger = imaServer.logger;
let cache = imaServer.cache;

// Middlewares
let favicon = require('serve-favicon');
let bodyParser = require('body-parser');
let multer = require('multer')({
  dest: path.resolve(path.join(__dirname, '/static/uploads/'))
});
let cookieParser = require('cookie-parser');
let methodOverride = require('method-override');
let compression = require('compression');
let helmet = require('helmet');
let errorToJSON = require('error-to-json');
let proxy = require('express-http-proxy');

function errorToString(error) {
  const jsonError = errorToJSON(error);
  let errorString =
    jsonError && jsonError.message ? jsonError.message : 'Uknown error message';

  try {
    errorString = JSON.stringify(jsonError);
  } catch (e) {
    logger.error(e.message);
  }

  return errorString;
}

process.on('uncaughtException', error => {
  logger.error(`Uncaught Exception:\n${errorToString(error)}`);
});

process.on('unhandledRejection', error => {
  logger.error(`Unhandled promise rejection:\n${errorToString(error)}`);
});

function renderApp(req, res, next) {
  if (req.headers['x-moz'] && req.headers['x-moz'] === 'prefetch') {
    res.status(204);
    res.send();

    return;
  }

  if (req.method === 'GET') {
    let cachedPage = cache.get(req);
    if (cachedPage) {
      res.status(200);
      res.send(cachedPage);

      return;
    }
  }

  clientApp
    .requestHandler(req, res)
    .then(
      response => {
        // logger.info('Request handled successfully', { response: { status: number, content: string, SPA: boolean=, error: Error= } });

        if (response.error) {
          logger.error('App error', {
            error: errorToJSON(response.error)
          });
        }

        if (
          req.method === 'GET' &&
          response.status === 200 &&
          !response.SPA &&
          !response.error
        ) {
          cache.set(req, response.content);
        }
      },
      error => {
        // logger.error('REJECT', { error });
        next(error);
      }
    )
    .catch(error => {
      logger.error('Cache error', { error: errorToJSON(error) });
      next(error);
    });
}

function errorHandler(err, req, res) {
  clientApp.errorHandler(err, req, res);
}

function staticErrorPage(err, req, res) {
  clientApp.showStaticErrorPage(err, req, res);
}

async function runNodeApp() {
  let express = require('express');
  let app = express();

  app.set('trust proxy', true);

  if (environment.$Env === 'dev') {
    const webpack = require('webpack');
    const chalk = require('chalk');
    const devMiddleware = require('webpack-dev-middleware');
    const hotMiddleware = require('webpack-hot-middleware');
    const { createWebpackConfig } = require('@ima/cli');

    const compiler = webpack(await createWebpackConfig(['client']));
    const isRawVerbose = process.argv.includes('--verbose=raw');

    app
      .use(
        devMiddleware(compiler, {
          index: false,
          publicPath: '/',
          ...(!isRawVerbose ? { stats: 'none' } : undefined)
        })
      )
      .use(
        hotMiddleware(compiler, {
          ...(!isRawVerbose
            ? {
                log: data => {
                  // eslint-disable-next-line no-console
                  console.log(`${chalk.bold.magenta('hmr:')} ${data}`);
                }
              }
            : undefined),
          path: '/__webpack_hmr',
          heartbeat: 10 * 1000
        })
      );
  }

  app
    .use(helmet())
    .use(compression())
    .use(favicon(path.resolve(path.join(__dirname, 'static/img/favicon.ico'))))
    .use(
      environment.$Server.staticFolder,
      express.static(path.resolve(path.join(__dirname, 'static')))
    )
    .use(bodyParser.json()) // for parsing application/json
    .use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
    .use(
      multer.fields([
        /*{ name: '<file input name>', maxCount: 1 }, ...*/
      ])
    ) // for parsing multipart/form-data
    .use(cookieParser())
    .use(methodOverride())
    .use(
      environment.$Proxy.path + '/',
      proxy(environment.$Proxy.server, environment.$Proxy.options || {})
    )
    .use(urlParser)
    .use(renderApp)
    .use(errorHandler)
    .use(staticErrorPage)
    .listen(environment.$Server.port, () => {
      // Inform cli that web server has started
      if (environment.$Env === 'dev') {
        const { IMA_CLI_RUN_SERVER_MESSAGE } = require('@ima/cli');
        process.send(IMA_CLI_RUN_SERVER_MESSAGE);
      }

      return logger.info(
        'Point your browser at http://localhost:' + environment.$Server.port
      );
    });
}

if (environment.$Env !== 'dev') {
  logger.level = 'warn';
}

if (environment.$Env === 'dev' || environment.$Server.clusters === 1) {
  runNodeApp();
} else {
  if (cluster.isMaster) {
    let cpuCount = environment.$Server.clusters || os.cpus().length;

    // Create a worker for each CPU
    for (let i = 0; i < cpuCount; i += 1) {
      cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', worker => {
      logger.warn(`Worker ${worker.id} died :(`);
      cluster.fork();
    });
  } else {
    runNodeApp();
  }
}
