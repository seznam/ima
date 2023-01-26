const path = require('path');
global.appRoot = path.resolve(__dirname);

const imaServer = require('@ima/server')();
const { serverApp, urlParser, environment, logger, cache, memStaticProxy } =
  imaServer;

require('@ima/react-page-renderer/hook/server')(imaServer);

const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const errorToJSON = require('error-to-json').default;
const proxy = require('express-http-proxy');
const expressStaticGzip = require('express-static-gzip');

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

function renderApp(req, res, next) {
  if (req.headers['x-moz'] && req.headers['x-moz'] === 'prefetch') {
    res.status(204);
    res.send();

    return;
  }

  if (req.method === 'GET') {
    const cachedPage = cache.get(req);
    if (cachedPage) {
      res.status(200);
      res.send(cachedPage);

      return;
    }
  }

  serverApp
    .requestHandlerMiddleware(req, res)
    .then(
      response => {
        if (response.error && environment.$Env === 'prod') {
          logger.error('Application server error', {
            error: errorToJSON(response.error),
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
    memStaticProxy,
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
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser())
  .use(
    environment.$Proxy.path + '/',
    proxy(environment.$Proxy.server, environment.$Proxy.options || {})
  )
  .use(urlParser)
  .use(renderApp)
  .use(renderError);

module.exports = {
  imaServer,
  app,
};
