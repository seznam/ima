---
title: Testing
description: Basic features > Testing
---

The `@ima/testing-library` contains utilities for testing IMA.js applications. It provides integration with [Jest](https://jestjs.io), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) and [Testing Library Jest DOM](https://testing-library.com/docs/ecosystem-jest-dom). If you initialized your project via `create-ima-app`, the testing setup is already included in your project. If not, check `@ima/testing-library` README for more information about how to setup testing in your project.

## API

IMA Testing Library is re-exporting everything from `@testing-library/react`. You should always import React Testing Library functions from `@ima/testing-library` as we might add some additional functionality / wrappers in the future. As such, it provides the same API as `@testing-library/react` with some additional features.

### renderWithContext

```javascript
async function renderWithContext(
  ui: ReactElement,
  options?: RenderOptions & { contextValue?: ContextValue; app?: ImaApp }
): Promise<ReturnType<typeof render> & { app: ImaApp | null; contextValue: ContextValue; }>
```

`renderWithContext` is a wrapper around [`render` from `@testing-library/react`](https://testing-library.com/docs/react-testing-library/api#render). It sets `wrapper` option in `render` method to a real IMA.js context wrapper. It can take additional optional IMA specific options:
- `contextValue` - the result of `getContextValue`
- `app` - the result of `initImaApp` (if you provide `contextValue`, it does not make any sense to provide `app` as the `app` is only used to generate the `contextValue`)

If any of the options is not provided, it will be generated automatically.

Example usage:

```javascript
import { useLocalize } from '@ima/react-page-renderer';
import { renderWithContext } from '@ima/testing-library';

function Component({ children }) {
  const localize = useLocalize(); // Get localize function from IMA.js context

  return <div>{localize('my.translation.key')} {children}</div>;
}

test('renders component with localized string', async () => {
  const { getByText } = await renderWithContext(<Component>My Text</Component>);
  const textElement = getByText(/My Text/i);

  expect(textElement).toBeInTheDocument();
});
```

If you had used `render` from `@testing-library/react` directly, the test would have failed because the `useLocalize` hook would be missing the context. The `renderWithContext` function provides the necessary context and making it easier to test components that depend on the IMA.js context.

### getContextValue

```javascript
async function getContextValue(app?: ImaApp): Promise<ContextValue>
```

`getContextValue` is a helper function that returns the context value from the IMA.js app. It can take an optional `app` parameter, which is the result of `initImaApp`.

Example usage:

```javascript
test('renders component with custom context value', async () => {
  const contextValue = await getContextValue(); // Generate default context value

  contextValue.$Utils.$Foo = jest.fn(() => 'bar'); // Mock some part of the context

  const { getByText } = await renderWithContext(<Component>My Text</Component>, {
    contextValue, // Provide the custom context value
  });
  const textElement = getByText(/My Text/i);

  expect(textElement).toBeInTheDocument();
});
```

### initImaApp

```javascript
async function initImaApp(): Promise<ImaApp>
```

`initImaApp` is a helper function that initializes the IMA.js app.

```javascript
test('renders component with custom app configuration', async () => {
  const app = await initImaApp(); // Initialize the app

  app.oc.get('$Utils').$Foo = jest.fn(() => 'bar'); // Mock some part of the app

  const { getByText } = await renderWithContext(<Component>My Text</Component>, {
    app, // Provide the custom app
  });
  const textElement = getByText(/My Text/i);

  expect(textElement).toBeInTheDocument();
});
```

### renderHookWithContext

```javascript
async function renderHookWithContext<TResult, TProps>(
  hook: (props: TProps) => TResult,
  options?: { contextValue?: ContextValue; app?: ImaApp }
): Promise<ReturnType<typeof renderHook<TResult, TProps>> & { app: ImaApp | null; contextValue: ContextValue; }>
```

`renderHookWithContext` is a wrapper around [`renderHook` from `@testing-library/react`](https://testing-library.com/docs/react-testing-library/api#renderhook). It uses the same logic as `renderWithContext` to provide the IMA.js context. See [the `renderWithContext` section](#renderwithcontext) for more information.

## Integration testing

The `@ima/testing-library/integration` entry point boots the whole application instead of a single component. It reuses the JSDOM prepared by the Jest preset, so no additional DOM implementation is initialized. The application page renderer runs inside React Testing Library's `act` boundary and owns its roots, allowing teardown without retaining containers in RTL's global registry or unmounting unrelated renders. Testing Library queries work against the rendered page.

```javascript
import { screen } from '@testing-library/dom';
import {
  clearImaApp,
  initImaApp,
  routeImaApp,
} from '@ima/testing-library/integration';

describe('Home page', () => {
  let app;

  beforeAll(async () => {
    app = await initImaApp();

    await routeImaApp(app, '/');
  });

  afterAll(async () => {
    await clearImaApp(app);
  });

  it('renders the home page', () => {
    expect(screen.getByRole('heading', { name: 'Home' })).toBeVisible();
  });
});
```

Import queries from `@testing-library/dom` rather than `@ima/testing-library` in integration suites. The `@ima/testing-library` entry point imports `app/main` when it is loaded, before `prebootScript` runs.

`initImaApp` loads the application entry point mapped as `app/main`, so make sure `moduleNameMapper` resolves `^app/main$` when your entry point is not at the default location (`app/main.js`). When it resolves to the testing library's fallback application and no `initRoutes` override is configured, `initImaApp` throws instead of booting an application without routes. It accepts optional `initSettings`, `initBindApp`, `initServicesApp` and `initRoutes` overrides. They run in addition to the application's own boot config methods, so an `initRoutes` override can only add routes - reusing a route name the application already registered throws.

`initImaApp` boots the application without navigating and without starting the router listeners. `routeImaApp(app, path)` sets the address bar and then delegates to IMA's `routeClientApp`, which starts the listeners and routes to the current path. The address bar has to be set first because IMA expects the browser to have navigated already and `PageNavigationHandler` deliberately ignores the first pre-manage call. Later navigations, whether triggered through `app.oc.get('$Router').route(path)` or by interacting with the rendered page, update the address bar through the application's own navigation handler.

IMA only logs a warning about fatal routing errors, such as a failing error page, when the application defines no `$IMA.fatalErrorHandler`. In that case `routeImaApp` rejects with the error instead. When the application defines the handler, the error is passed to it and `routeImaApp` resolves.

The global `$Debug` follows `$IMA.$Debug`, so a suite can opt out of the framework's debug-only code paths by setting `window.$IMA.$Debug = false` before `initImaApp`.

Always `await clearImaApp(app)` when the suite finishes. It unlistens the router, destroys the page manager, unmounts the page, clears the object container, and restores the wrapped global timers, animation frames, `$Debug`, `console.assert` and `window.scrollTo`. A failing step does not skip the remaining ones, and clearing the same application again does nothing. The timers are wrapped when the application boots, so Jest fake timers installed by the test are wrapped instead of being replaced and stay detectable by Testing Library. It removes application-owned listeners registered through `$Window.bindEventListener` without removing React's document listeners. Direct native listeners must be removed by their owner during teardown. Only one application can be active at a time: `initImaApp` rejects while another application is booting or has not been cleared yet. A cleanup that is still pending is finished before the next application boots.

### Shared integration configuration

Hooks shared by all integration suites belong to the `integration` key of the client configuration.

```javascript
// jestSetup.js
import { setImaTestingLibraryClientConfig } from '@ima/testing-library/client';

setImaTestingLibraryClientConfig({
  integration: {
    prebootScript: async () => {
      // Runs before app/main is imported, use it for global mocks
    },
    extendAppObject: app => ({
      // Additional properties available on the object returned from initImaApp
    }),
  },
});
```

### Environment

The IMA environment used by tests is resolved when the JSDOM HTML template is generated, which happens before setup files run. Configure it in the Jest config through `@ima/testing-library/server`. It defaults to `test` and takes precedence over `IMA_ENV` and `NODE_ENV`, even when `@ima/server` has already been imported. While the environment is resolved, `IMA_ENV` is set to the configured name, so `server/config/environment.js` sees the same environment. The original value is restored afterwards.

This is a breaking default change in `@ima/testing-library` 21 for unit tests too. When upgrading, explicitly configure any environment previously selected through `IMA_ENV` or `NODE_ENV`, or set `environment: undefined` to retain legacy shell-based resolution.

```javascript
// jest.config.js
const { setImaTestingLibraryServerConfig } = require('@ima/testing-library/server');

setImaTestingLibraryServerConfig({
  environment: 'test',
});

module.exports = {
  preset: '@ima/testing-library',
};
```

### Migrating from `@ima/plugin-testing-integration`

- Replace imports from `@ima/plugin-testing-integration` with `@ima/testing-library/integration` and remove `@jest-environment node` docblocks; integration suites run in the JSDOM of the Jest preset.
- Replace the initial `app.oc.get('$Router').route(path)` call with `await routeImaApp(app, path)`, and await `clearImaApp(app)`.
- Move `protocol`, `host`, `environment`, `processEnvironment`, `applicationFolder`, `beforeCreateIMAServer` and `afterCreateIMAServer` to `setImaTestingLibraryServerConfig` in the Jest config. Move `rootDir` to `setImaTestingLibraryClientConfig`, and `prebootScript`, `extendAppObject` and the boot config overrides to its `integration` key.
- Map `^app/main$` in the Jest `moduleNameMapper` instead of configuring `appMainPath`. The `TestPageRenderer`, `locale`, `masterElementId` and `pageScriptEvalFn` options were removed.
- The plugin always loaded the real dictionary, while the testing library uses a fake one by default. Set `useFakeDictionary: false` in the client configuration when assertions depend on translated texts.
- The plugin replaced `window.fetch` with the Node.js implementation, but JSDOM does not provide `fetch`. Mock `$Http` in `initBindApp`, or install a `fetch` implementation in `prebootScript`.

## Extending IMA boot config methods

You can extend IMA boot config by using [IMA `pluginLoader.register`](https://imajs.io/api/classes/ima_core.PluginLoader/#register) method. Use the same approach as in IMA plugins.

You can either register a plugin loader for all tests by setting it up in a setup file.

```javascript
// jestSetup.js
import { pluginLoader } from '@ima/core';

// If you don't care, if this plugin loader is registered first, or last
pluginLoader.register('jestSetup.js', () => {
  return {
    initSettings: () => {
      return {
        prod: {
          customSetting: 'customValue'
        }
      }
    }
  };
});

// If you need to register the plugin loader after all other plugin loaders
beforeAll(() => {
  pluginLoader.register('jestSetup.js', () => {
    return {
      initSettings: () => {
        return {
          prod: {
            customSetting: 'customValue'
          }
        }
      }
    };
  });
});

// jest.config.js
module.exports = {
  // Add this line to your jest config
  setupFilesAfterEnv: ['./jestSetup.js']
};
```

Or you can register a plugin loader for a specific test file.

```javascript
// mySpec.js
import { pluginLoader } from '@ima/core';

beforeAll(() => {
  pluginLoader.register('mySpec', () => {
    return {
      initSettings: () => {
        return {
          prod: {
            customSetting: 'customValue'
          }
        }
      }
    };
  });
});

test('renders component with custom app configuration', async () => {
  const { getByText } = await renderWithContext(<Component>My Text</Component>);
  const textElement = getByText(/My Text/i);

  expect(textElement).toBeInTheDocument();
});
```

Or you can register a plugin loader for a test file, but make the boot config methods dynamic so you can change them for each test.

```javascript
// mySpec.js
import { pluginLoader } from '@ima/core';

// We create a placeholder for the plugin loader, so we can change it later
let initSettings = () => {};

beforeAll(() => {
  pluginLoader.register('mySpec', (...args) => {
    return {
      initSettings: (...args) => {
        return initSettings(...args); // Here we call our overridable function
      }
    };
  });
});

afterEach(() => {
  initSettings = () => {}; // Reset the plugin loader so it is not called for other tests
});

test('renders component with custom app configuration', async () => {
  initSettings = () => {
    return {
      prod: {
        customSetting: 'customValue'
      }
    }
  };

  const { getByText } = await renderWithContext(<Component>My Text</Component>);
  const textElement = getByText(/My Text/i);

  expect(textElement).toBeInTheDocument();
});
```

*Note, that the plugin loader register method evaluates the second argument right away, but the specific boot config methods are evaluated during `renderWithContext` (or `initImaApp` if you are using it directly).*
