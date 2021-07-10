const fs = require('fs');
const sep = require('path').sep;

const stackTrace = require('stack-trace');
const asyncEach = require('async-each');
const hljs = require('highlight.js');
const errorToJSON = require('error-to-json');

const errorView = require('../template/errorView.js');

hljs.configure({
  tabReplace: '  ',
  lineNodes: true
});

// TODO IMA@18 refactor to ejs template
module.exports = function devErrorPageFactory({ logger }) {
  function devErrorPage(err, req, res) {
    let callstack = stackTrace.parse(err);
    let fileIndex = 1;

    logger.error('The application crashed due to an uncaught exception', {
      error: errorToJSON(err)
    });

    asyncEach(
      callstack,
      (stackFrame, cb) => {
        // exclude core node modules and node modules
        if (
          !stackFrame.fileName ||
          !stackFrame.fileName.includes(sep) ||
          /node_modules/.test(stackFrame.fileName) ||
          /internal/.test(stackFrame.fileName)
        ) {
          return cb();
        }

        fs.readFile(stackFrame.fileName, 'utf-8', (err, content) => {
          if (err) {
            return cb(err);
          }

          content = hljs.highlight('javascript', content);

          // start a few lines before the error or at the beginning of
          // the file
          let start = Math.max(stackFrame.lineNumber - 11, 0);
          let lines = content.value
            .split('\n')
            .map(line => `<span class="line">${line}</span>`);
          // end a few lines after the error or the last line of the file
          let end = Math.min(stackFrame.lineNumber + 10, lines.length);
          let snippet = lines.slice(start, end);
          // array starts at 0 but lines numbers begin with 1, so we have
          // to subtract 1 to get the error line position in the array
          let errLine = stackFrame.lineNumber - start - 1;

          snippet[errLine] = snippet[errLine].replace(
            '<span class="line">',
            '<span class="line error-line">'
          );

          stackFrame.content = snippet.join('\n');
          stackFrame.errLine = errLine;
          stackFrame.startLine = start;
          stackFrame.id = 'file-' + fileIndex;

          fileIndex++;

          cb(null, stackFrame);
        });
      },
      (error, callstack) => {
        if (!Array.isArray(callstack)) {
          callstack = [];
        }

        callstack = callstack.filter(item => !!item);

        res.status(500);

        // if something bad happened while processing the stacktrace make
        // sure to return something useful
        if (error) {
          logger.error('Failed to display error page', {
            error: errorToJSON(error)
          });
          res.send(err.stack);
        } else {
          res.send(errorView(err, callstack));
        }
      }
    );
  }

  return devErrorPage;
};
