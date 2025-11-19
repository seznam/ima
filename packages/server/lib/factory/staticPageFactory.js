const fs = require('fs');
const path = require('path');

const ejs = require('ejs');

function loadTemplateFile(path) {
  return fs.readFileSync(path, 'utf8');
}

module.exports = function staticTemplateFactory({
  applicationFolder,
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
  const templateOverloaded = ejs.compile(
    loadTemplateFile(
      environment?.$Server?.template?.['overloaded'] ??
        path.join(applicationFolder, './server/template/overloaded.ejs')
    )
  );
  const template400 = ejs.compile(
    loadTemplateFile(
      environment?.$Server?.template?.['400'] ??
        path.join(applicationFolder, './server/template/400.ejs')
    )
  );

  const overloadedResponse = {
    status: 503,
    SPA: false,
    static: true,
    content: templateOverloaded(),
    error: new Error('Service Unavailable'),
    page: {
      state: {},
      cache: null,
      cookie: new Map(),
      headers: {},
    },
    cache: false,
  };

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

  /**
   * Renders the SPA prefetch page. Similar to SPA static page renderer,
   * but since the app is already booted, we do not need to re-create
   * the boot config again.
   */
  function renderStaticSPAPrefetchPage(event) {
    const content = templateSPA(event);

    return {
      content,
      static: true,
      spaPrefetch: true,
    };
  }

  function renderOverloadedPage() {
    return {
      ...overloadedResponse,
      page: {
        ...overloadedResponse.page,
      },
    };
  }

  return {
    renderOverloadedPage,
    renderStaticSPAPage,
    renderStaticSPAPrefetchPage,
    renderStaticServerErrorPage,
    renderStaticClientErrorPage,
  };
};
