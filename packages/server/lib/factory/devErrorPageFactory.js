const fs = require('fs');
const path = require('path');

const ejs = require('ejs');

module.exports = function devErrorPageFactory() {
  const template = ejs.compile(
    fs.readFileSync(
      path.join(__dirname, '../template/devErrorView.ejs'),
      'utf8'
    )
  );

  function devErrorPage({ error, req, res }) {
    return {
      error,
      content: template({
        devServerPublic: process.env.IMA_CLI_DEV_SERVER_PUBLIC_URL,
        serverError: {
          name: error.name,
          message: error.message,
          stack: error.stack.toString(),
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
