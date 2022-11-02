const fs = require('fs');
const path = require('path');

const ejs = require('ejs');

module.exports = function devErrorPageFactory({ logger }) {
  const template = ejs.compile(
    fs.readFileSync(
      path.join(__dirname, '../template/devErrorView.ejs'),
      'utf8'
    )
  );

  function devErrorPage({ error, req, res }) {
    logger.error('The application crashed due to an uncaught exception', {
      error,
    });

    return {
      error,
      content: template({
        devServerPublic: process.env.IMA_CLI_DEV_SERVER_PUBLIC_URL,
        serverError: {
          name: error.name,
          message: error.message,
          stack: error.stack.toString(),
          params:
            error?.getParams && Object.keys(error.getParams()).length > 0
              ? JSON.stringify(error.getParams?.(), null, 2)
              : '',
        },
        req,
        res,
      }),
      static: true,
      status: 500,
    };
  }

  return devErrorPage;
};
