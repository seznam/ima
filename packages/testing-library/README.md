<p align="center">
  <img height="130" src="https://imajs.io/img/logo.svg">
</p>

<h1 align="center">@ima/testing-library</h1>
  <p align="center"><i>Testing library for IMA.js applications.</i>
</p>

---

## IMA Testing Library

The `@ima/testing-library` contains utilities for testing IMA.js applications. It provides integration with [Jest](https://jestjs.io), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) (RTL for short) and [Testing Library Jest DOM](https://testing-library.com/docs/ecosystem-jest-dom).

## Installation

Install the new dependencies. Note that RTL dependencies are only peer dependencies and you should specify them in your project.

```bash
npm install -D @ima/testing-library @testing-library/dom @testing-library/jest-dom @testing-library/react jest-environment-jsdom
```

Configure jest preset in your jest config file.

```json
{
  "preset": "@ima/testing-library"
}
```

Everything should start working out of the box for a typical IMA.js application. If you are trying to setup this library in a monorepo or an npm package, you might have to do some tweaks with the configuration.

### Configuration

There are 2 config functions that you can use to adjust the IMA Testing Library to your specific needs.

**Server Configuration**

In this case, you need the jest config file to be in non-json format.

This configuration should be evaluated in the jest config file. It's config values are used to initialize the JSDOM environment in which the tests are running.

```javascript
const path = require('node:path');
const { setImaTestingLibraryServerConfig } = require('@ima/testing-library/server');

setImaTestingLibraryServerConfig({
  // your custom config
  environment: 'regression', // The default environment is test.
  applicationFolder: path.resolve('./__tests__/') // The default application folder is the root of the project, but you can specify a custom one to add some test specific logic.
});

module.exports = {
  preset: '@ima/testing-library',
  // The preset automatically sets up the moduleNameMapper for the IMA.js application, but you can override it if you need to.
  moduleNameMapper: {
    '^app/main$': '<rootDir>/app/main.test.js', // You can tell jest to use a different main file for the tests
  }
};
```

See [src/server/configuration.ts](https://github.com/seznam/ima/blob/master/packages/testing-library/src/server/configuration.ts) for the full list of available options.

**Client Configuration**

This configuration should be evaluated in the setup files, or directly in the test files. It's config values are used to initialize the IMA.js application and provide the context for the tests.

```javascript
const { setImaTestingLibraryClientConfig } = require('@ima/testing-library/client');

setImaTestingLibraryClientConfig({
  // your custom config
  rootDir: '/path/to/your/project',
  integration: {
    prebootScript: () => {
      // Run project-specific setup before integration boot.
    },
  },
});
```

See [src/client/configuration.ts](https://github.com/seznam/ima/blob/master/packages/testing-library/src/client/configuration.ts) for the full list of available options.

## Integration Testing

The `./integration` sub-path boots the application mapped as `app/main` in the JSDOM created by the Jest preset. IMA page views are rendered by the application page renderer wrapped in React Testing Library's `act`, so Testing Library queries work against the page while the live router and object container remain available for client integration tests. The preset generates an SPA shell; it does not exercise SSR hydration or the application's Express middleware pipeline.

The application renderer owns its React roots. Unlike RTL's `render`, this does not register application containers in RTL's global cleanup registry: `clearImaApp` releases only the application's root and leaves unrelated RTL renders mounted.

```javascript
const {
  initImaApp,
  routeImaApp,
  clearImaApp,
} = require('@ima/testing-library/integration');
const { screen } = require('@testing-library/dom');

let app;

beforeAll(async () => {
  app = await initImaApp();
  await routeImaApp(app, '/');
});

it('renders the page', () => {
  expect(screen.getByRole('main')).toBeVisible();
});

afterAll(async () => {
  await clearImaApp(app);
});
```

Configure shared integration hooks through `setImaTestingLibraryClientConfig({ integration: { ... } })`. `initImaApp` also accepts per-call `initSettings`, `initBindApp`, `initServicesApp`, and `initRoutes` overrides. They run in addition to the application's own boot config methods, so `initRoutes` overrides can only add routes; adding a route under a name the application already uses throws. Map `^app/main$` in Jest when the application entry is not available at the default path (`app/main.js`). `initImaApp` throws when `app/main` resolves to the testing library's fallback application and no `initRoutes` override is configured.

`initImaApp` boots without navigating and without starting the router listeners. `routeImaApp(app, path)` sets the address bar and then delegates to IMA's own `routeClientApp`, which starts the listeners and routes to the current path. Setting the address bar first is required because IMA expects the browser to have navigated already - `PageNavigationHandler` deliberately ignores the first pre-manage call. Subsequent navigations can use `app.oc.get('$Router').route(path)` or interactions with the rendered page, and they update the address bar through the application's own navigation handler. When the application defines no `$IMA.fatalErrorHandler`, `routeImaApp` rejects with fatal routing errors that IMA would otherwise only log as a warning.

Import queries from `@testing-library/dom`: the `@ima/testing-library` entry point imports `app/main` when it is loaded, before `prebootScript` runs.

`$Debug` follows `$IMA.$Debug`, so a suite can opt out of the framework's debug-only code paths by setting `window.$IMA.$Debug = false` before `initImaApp`.

Configure the environment through `setImaTestingLibraryServerConfig({ environment })` in the Jest config. It defaults to `test` and takes precedence over `IMA_ENV` and `NODE_ENV`, even when `@ima/server` has already been imported.

Version 21 changes this default for existing unit tests as well as integration tests. Configure the environment previously selected through `IMA_ENV` or `NODE_ENV` explicitly when upgrading. Setting `environment: undefined` retains the legacy server environment resolution.

**Important:** always `await clearImaApp(app)` in `afterAll`/`afterEach`. It unlistens the router, awaits page-manager destruction before unmounting the page, clears the object container, and restores the wrapped timers, animation frames, `$Debug`, `console.assert`, and `window.scrollTo`. A failing step does not skip the remaining ones. It also removes listeners registered through the application's `$Window.bindEventListener`, while preserving React's document-level listeners. Directly registered native listeners must be removed by their owner during teardown. Forgetting cleanup will leak state into subsequent tests.

Only one application can be active at a time: `initImaApp` rejects until the previous application is cleared. The wrapped timers are captured when the application boots, so Jest fake timers installed by the test are wrapped rather than replaced and stay detectable by Testing Library.

## Usage

See [documentation](https://imajs.io/basic-features/testing) for more information about how to use the IMA Testing Library.
