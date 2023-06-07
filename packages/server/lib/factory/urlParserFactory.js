'use strict';

const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const { GenericError } = require('@ima/core');

module.exports = function urlParserFactory({ environment }) {
  const IMA_CONFIG_JS_PATH = path.resolve('./ima.config.js');

  function _getHost(req) {
    const forwardedHost = req.get('X-Forwarded-Host');
    let host = req.get('host');

    if (forwardedHost) {
      host = forwardedHost;
    }

    if (environment?.$Server?.host) {
      host =
        typeof environment?.$Server?.host === 'function'
          ? environment?.$Server?.host({ environment, host, req })
          : environment.$Server.host;
    }

    return host;
  }

  function _getUrlFromRequest(req) {
    return '//' + _getHost(req) + req.originalUrl.replace(/\/$/, '');
  }

  function _isHostSame(currentHost, hostExpression) {
    return currentHost === hostExpression;
  }

  function _getRootRegExp(hostExpression, rootExpression, languageParam) {
    let rootReg =
      '//' +
      hostExpression.replace(/[\\.+*?^$[\](){}/'#]/g, '\\$&') +
      rootExpression.replace('/', '/');

    if (languageParam) {
      let langCodes = ['cs', 'en'];

      if (fs.existsSync(IMA_CONFIG_JS_PATH)) {
        const imaConfig = require(IMA_CONFIG_JS_PATH);
        if (imaConfig?.languages) {
          langCodes = Object.keys(imaConfig.languages);
        }
      }

      let languagesExpr = langCodes.join('|');
      rootReg += '(/(' + languagesExpr + '))?';
    }
    rootReg += '.*$';

    return new RegExp(rootReg);
  }

  function _getProtocolFromForwardedHeader(req) {
    let forwardedHeader = req.get('Forwarded');
    let protocol = null;

    if (forwardedHeader) {
      let parts = forwardedHeader.split(';');

      for (let part of parts) {
        if (part.startsWith('proto=')) {
          protocol = part.substring(6);
          break;
        }
      }
    }

    return protocol;
  }

  function _getProtocolFromXForwardedProtoHeader(req) {
    let forwardedProtocol = req.get('X-Forwarded-Proto');
    let protocol = null;

    if (forwardedProtocol) {
      protocol = forwardedProtocol;
    }

    return protocol;
  }

  function _getProtocolFromFrontEndHttpsHeader(req) {
    let httpsHeader = req.get('Front-End-Https');
    let protocol = null;

    if (httpsHeader) {
      protocol = httpsHeader.toLowerCase() === 'on' ? 'https' : 'http';
    }

    return protocol;
  }

  function _getProtocol(req) {
    let protocol =
      _getProtocolFromForwardedHeader(req) ||
      _getProtocolFromXForwardedProtoHeader(req) ||
      _getProtocolFromFrontEndHttpsHeader(req) ||
      req.protocol;

    if (environment?.$Server?.protocol) {
      protocol =
        typeof environment?.$Server?.protocol === 'function'
          ? environment?.$Server?.protocol({ environment, protocol, req })
          : environment.$Server.protocol;
    }

    return `${protocol}:`;
  }

  function urlParser({ req, res }) {
    const parseUrlReg = /^.*\/\/([^/]*)((?:\/[^/:]+)*)?(\/:language)?$/;

    const currentProtocol = _getProtocol(req);
    const currentUrl = _getUrlFromRequest(req);

    const parsedCurrentUrl = new URL(currentProtocol + currentUrl);
    const pathname = parsedCurrentUrl.pathname.replace(/\/$/, '');

    const currentHost = parsedCurrentUrl.host;
    let currentRoot = pathname + parsedCurrentUrl.search;

    let currentLanguage = null;
    let currentLanguagePartPath = '';
    let currentPath = currentRoot || '';

    for (let expression of Object.keys(environment.$Language)) {
      let parsedDomainExpression = expression.match(parseUrlReg);

      if (!parsedDomainExpression) {
        throw new Error(
          `You have invalid language expression definition (${expression}). Set current domain "//${currentHost}" or "//*:*" to attribute $Language in environment.js.`
        );
      }

      let hostExpression =
        parsedDomainExpression[1] === '*:*'
          ? currentHost
          : parsedDomainExpression[1] || '';
      let rootExpression = parsedDomainExpression[2] || '';
      let languageInPath = parsedDomainExpression[3];

      if (_isHostSame(currentHost, hostExpression)) {
        let rootRegExp = _getRootRegExp(
          hostExpression,
          rootExpression,
          languageInPath
        );

        if (rootRegExp.test(currentUrl)) {
          currentRoot = rootExpression;

          if (languageInPath) {
            let matchedLanguage = currentUrl.match(rootRegExp);

            currentLanguagePartPath = matchedLanguage[1];
            currentLanguage = matchedLanguage[2];

            if (!currentLanguage) {
              currentLanguagePartPath = '/' + environment.$Language[expression];
              currentLanguage = environment.$Language[expression];

              throw new GenericError('Language redirect', {
                url:
                  currentProtocol +
                  '//' +
                  currentHost +
                  currentRoot +
                  currentLanguagePartPath,
                status: 302,
              });
            }
          } else {
            currentLanguage = environment.$Language[expression];
          }

          break;
        }
      }
    }

    res.locals.language = currentLanguage;
    res.locals.languagePartPath = currentLanguagePartPath;
    res.locals.host = currentHost;
    res.locals.path = currentPath;
    res.locals.protocol = currentProtocol;
    res.locals.root = currentRoot;

    if (!currentLanguage) {
      throw new Error(
        `You have undefined language. Set current domain "//${currentHost}" or "//*:*" to attribute $Language in environment.js.`
      );
    }
  }

  return { urlParser };
};
