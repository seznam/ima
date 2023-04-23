const fs = require('fs');
const path = require('path');

const ejs = require('ejs');

function loadTemplateFile(path) {
  return fs.readFileSync(path, 'utf8');
}

module.exports = function staticTemplateFactory({
  applicationFolder,
  instanceRecycler,
  createBootConfig,
  environment,
}) {
  // TODO IMA@18 doc, example
  const templateSPA = ejs.compile(
    loadTemplateFile(
      environment?.$Server?.template?.spa ??
        path.join(applicationFolder, './server/template/spa.ejs')
    )
  );
  const template500 = ejs.compile(
    loadTemplateFile(
      environment?.$Server?.template?.['500'] ??
        path.join(applicationFolder, './server/template/500.ejs')
    )
  );
  const template400 = ejs.compile(
    loadTemplateFile(
      environment?.$Server?.template?.['400'] ??
        path.join(applicationFolder, './server/template/400.ejs')
    )
  );

  function renderStaticServerErrorPage(event) {
    const error500 = {
      status: 500,
      SPA: false,
      static: true,
      page: {
        state: {},
        cache: null,
        cookie: new Map(),
        headers: {},
      },
      cache: false,
    };

    try {
      createBootConfig(event);

      const content = template500(event);

      return {
        ...error500,
        content,
        error: event.error,
      };
    } catch (error) {
      error.cause = event.error;

      return {
        ...error500,
        content: 'Internal Server Error',
        error,
      };
    }
  }

  function renderStaticClientErrorPage(event) {
    const status = 404;

    createBootConfig(event);

    const content = template400(event);

    return {
      content,
      status,
      error: event.error,
      SPA: false,
      static: true,
    };
  }

  function renderStaticSPAPage(event) {
    const status = 200;

    createBootConfig(event);

    const content = templateSPA(event);

    return {
      content,
      status,
      SPA: true,
      static: true,
    };
  }

  function renderOverloadedPage(event) {
    const requests = instanceRecycler.getConcurrentRequests() + 2;
    const error = new Error(
      `The server is overloaded with ${requests} concurrency requests.`
    );

    let page = renderStaticServerErrorPage({ ...event, error });
    page.status = 503;

    return page;
  }

  return {
    renderOverloadedPage,
    renderStaticSPAPage,
    renderStaticServerErrorPage,
    renderStaticClientErrorPage,
  };
};
