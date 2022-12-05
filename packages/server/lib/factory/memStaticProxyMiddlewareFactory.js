const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function memStaticProxyMiddlewareFactory() {
  if (process.env.IMA_CLI_WATCH && !process.env.IMA_CLI_WRITE_TO_DISK) {
    return createProxyMiddleware(pathname => !pathname.includes('static/js/'), {
      logLevel: 'silent',
      target: process.env.IMA_CLI_DEV_SERVER_PUBLIC_URL,
    });
  }

  return (req, res, next) => next();
};
