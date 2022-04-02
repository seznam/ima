const path = require('path');
global.appRoot = path.resolve(__dirname);

const imaServer = require('@ima/server');
const clientApp = imaServer.clientApp;
const urlParser = imaServer.urlParser;
const environment = imaServer.environment;
const logger = imaServer.logger;
const cache = imaServer.cache;

const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const errorToJSON = require('error-to-json').default;
const proxy = require('express-http-proxy');

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
    const cachedPage = cache.get(req);
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
        if (response.error) {
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

function errorHandler(err, req, res) {
  clientApp.errorHandler(err, req, res);
}

function staticErrorPage(err, req, res) {
  clientApp.showStaticErrorPage(err, req, res);
}

const app = express();

app
  .set('trust proxy', true)
  .use(helmet())
  .use(compression())
  .use(
    favicon(
      path.resolve(path.join(__dirname, '../build/static/public/favicon.ico'))
    )
  )
  .use(
    environment.$Server.staticFolder,
    express.static(path.resolve(path.join(__dirname, '../build/static')))
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
  .use(errorHandler)
  .use(staticErrorPage);

module.exports = {
  imaServer,
  app,
};
