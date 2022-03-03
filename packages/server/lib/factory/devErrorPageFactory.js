const fs = require('fs');
const path = require('path');
const sep = path.sep;

const ejs = require('ejs');
const stackTrace = require('stack-trace');
const hljs = require('highlight.js');
const errorToJSON = require('error-to-json');

hljs.configure({
  tabReplace: '  ',
  lineNodes: true
});

module.exports = function devErrorPageFactory({ logger }) {
  const template = ejs.compile(
    fs.readFileSync(
      path.join(__dirname, '../template/devErrorPage.ejs'),
      'utf8'
    )
  );

  function devErrorPage({ error, req, res }) {
    let callstack = stackTrace.parse(error);
    let fileIndex = 1;

    logger.error('The application crashed due to an uncaught exception', {
      error: errorToJSON(error)
    });

    return Promise.all(
      callstack.map(stackFrame => {
        return new Promise((resolve, reject) => {
          // exclude core node modules and node modules
          if (
            !stackFrame.fileName ||
            !stackFrame.fileName.includes(sep) ||
            /node_modules/.test(stackFrame.fileName) ||
            /internal/.test(stackFrame.fileName)
          ) {
            return resolve();
          }

          fs.readFile(stackFrame.fileName, 'utf-8', (err, content) => {
            if (err) {
              return reject(err);
            }

            content = hljs.highlight('javascript', content);

            // start a few lines before the error or at the beginning of
            // the file
            let start = Math.max(stackFrame.lineNumber - 11, 0);
            let lines = content.value.split('\n');
            let end = Math.min(stackFrame.lineNumber + 10, lines.length);
            lines = lines.slice(start, end);
            // array starts at 0 but lines numbers begin with 1, so we have
            // to subtract 1 to get the error line position in the array
            let errorLine = stackFrame.lineNumber - start - 1;

            stackFrame.lines = lines;
            stackFrame.errorLine = errorLine;
            stackFrame.startLine = start;
            stackFrame.endLine = end;
            stackFrame.id = 'file-' + fileIndex;

            fileIndex++;

            resolve(stackFrame);
          });
        });
      })
    )
      .then(callstack => {
        callstack = callstack.filter(item => !!item);

        return {
          SPA: false,
          static: false,
          pageState: {},
          cache: false,
          error,
          content: template({
            callstack,
            error,
            req,
            res
          }),
          status: 500
        };
      })
      .catch(error => {
        logger.error('Failed to display error page', {
          error: errorToJSON(error)
        });

        return { error, content: error.stack, status: 500 };
      });
  }

  return devErrorPage;
};
