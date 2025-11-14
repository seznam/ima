const { legacyCreateProxyMiddleware } = require('http-proxy-middleware');

module.exports = function memStaticProxyMiddlewareFactory() {
  if (process.env.IMA_CLI_WATCH && !process.env.IMA_CLI_WRITE_TO_DISK) {
    return legacyCreateProxyMiddleware(
      pathname => !pathname.includes('static/js/'),
      {
        target: process.env.IMA_CLI_DEV_SERVER_PUBLIC_URL,
        logLevel: 'silent',
      }
    );
  }

  return (req, res, next) => next();
};
