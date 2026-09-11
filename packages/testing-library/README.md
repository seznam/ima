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

This version requires `@ima/server` 20.1 or newer for explicit environment selection.

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

The `./integration` sub-path boots the application mapped as `app/main` in the JSDOM created by the Jest preset. IMA page views are rendered by the application page renderer wrapped in React Testing Library's `act`, so Testing Library queries work against the page while the live router and object container remain available for full integration tests.

```javascript
const {
  initImaApp,
  clearImaApp,
} = require('@ima/testing-library/integration');
const { screen } = require('@ima/testing-library');

let app;

beforeAll(async () => {
  app = await initImaApp();
  await app.oc.get('$Router').route('/');
});

it('renders the page', () => {
  expect(screen.getByRole('main')).toBeVisible();
});

afterAll(async () => {
  await clearImaApp(app);
});
```

Configure shared integration hooks through `setImaTestingLibraryClientConfig({ integration: { ... } })`. `initImaApp` also accepts per-call `initSettings`, `initBindApp`, `initServicesApp`, and `initRoutes` overrides. Map `^app/main$` in Jest when the application entry is not available at the default path.

Configure the environment through `setImaTestingLibraryServerConfig({ environment })` in the Jest config. It defaults to `test` and is passed as `environmentName` to `createIMAServer`, so it takes precedence over shell variables and earlier server imports without changing `process.env`.

**Important:** always `await clearImaApp(app)` in `afterAll`/`afterEach`. It unlistens the router, unmounts the page, destroys the page manager, clears the object container, and restores the wrapped timers, `console.assert`, `window.scrollTo`, and all AOP hooks. It also removes listeners registered through the application's `$Window.bindEventListener`, while preserving React's document-level listeners. Directly registered native listeners must be removed by their owner during teardown. Forgetting cleanup will leak state into subsequent tests.

## Usage

See [documentation](https://imajs.io/basic-features/testing) for more information about how to use the IMA Testing Library.
