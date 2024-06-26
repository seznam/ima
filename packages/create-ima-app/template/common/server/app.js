const path = require('path');
global.appRoot = path.resolve(__dirname);

const reactPageRendererHook = require('@ima/react-page-renderer/hook/server');
const { createIMAServer } = require('@ima/server');
const compression = require('compression');
const timeout = require('connect-timeout');
const cookieParser = require('cookie-parser');
const errorToJSON = require('error-to-json').default;
const express = require('express');
const proxy = require('express-http-proxy');
const expressStaticGzip = require('express-static-gzip');
const helmet = require('helmet');
const favicon = require('serve-favicon');

const imaServer = createIMAServer();
reactPageRendererHook(imaServer);
const { serverApp, environment, logger, cache, emitter, Event } = imaServer;

function errorToString(error) {
  const jsonError = errorToJSON(error);
  let errorString =
    jsonError && jsonError.message
      ? jsonError.message
      : 'Unknown error message';

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

emitter.on(
  Event.BeforeRequest,
  function skipIMARendering({ preventDefault, req }) {
    if (req.headers['x-moz'] && req.headers['x-moz'] === 'prefetch') {
      preventDefault();
    }
  }
);

emitter.on(
  Event.BeforeRequest,
  function checkCache({ req, context, preventDefault }) {
    const cachedPage = cache.get(req);
    if (cachedPage) {
      context.response = {
        ...context.response,
        ...{
          status: 200,
          content: cachedPage,
          cache: true,
        },
      };

      preventDefault();
    }
  }
);

emitter.on(Event.AfterResponse, function saveToCache({ req, context }) {
  const { response } = context;

  if (
    req.method === 'GET' &&
    response.status === 200 &&
    !response.SPA &&
    !response.error &&
    !response.cache
  ) {
    cache.set(req, response.content);
  }
});

function renderApp(req, res, next) {
  serverApp
    .requestHandlerMiddleware(req, res)
    .then(
      response => {
        if (response.error && environment.$Env === 'prod') {
          logger.error('Application server error', {
            error: errorToJSON(response.error),
          });
        }
      },
      error => {
        next(error);
      }
    )
    .catch(error => {
      logger.error('Cache error', { error: errorToJSON(error) });
      next(error);
    });
}

function renderError(error, req, res, next) {
  serverApp
    .errorHandlerMiddleware(error, req, res, next)
    .then(response => {
      logger.error(response.error);
    })
    .catch(next);
}

const app = express();

app
  .set('trust proxy', true)
  .use(timeout('30s'))
  .use(helmet())
  .use(
    compression({
      filter: req => req.baseUrl !== environment.$Server.staticPath,
    })
  )
  .use(
    favicon(
      path.resolve(path.join(__dirname, '../build/static/public/favicon.ico'))
    )
  )
  .use(
    environment.$Server.staticPath,
    imaServer.memStaticProxy,
    expressStaticGzip(path.resolve(path.join(__dirname, '../build')), {
      enableBrotli: true,
      index: false,
      orderPreference: ['br'],
      serveStatic: {
        maxAge: '14d',
        cacheControl: environment.$Env === 'prod',
      },
    })
  )
  .use(cookieParser())
  .use(
    environment.$Proxy.path + '/',
    proxy(environment.$Proxy.server, environment.$Proxy.options || {})
  )
  .use(renderApp)
  .use(renderError);

module.exports = {
  imaServer,
  app,
};
