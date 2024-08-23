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
const { setImaTestingLibraryServerConfig, FALLBACK_APPLICATION_FOLDER, FALLBACK_APP_MAIN_PATH } = require('@ima/testing-library/server');

setImaTestingLibraryServerConfig({
  // your custom config
  applicationFolder: FALLBACK_APPLICATION_FOLDER, // There is a default application folder as part of the package, it contains only the minimal setup and it might be enough for you if you don't have any real application folder with server files.
});

module.exports = {
  preset: '@ima/testing-library',
  // The preset automatically sets up the moduleNameMapper for the IMA.js application, but you can override it if you need to.
  moduleNameMapper: {
    'app/main': FALLBACK_APP_MAIN_PATH, // There is a default app main file as part of the package, it contains only the minimal setup and it might be enough for you if you don't have any real app main file.
  }
};
```

**Client Configuration**

This configuration should be evaluated in the setup files, or directly in the test files. It's config values are used to initialize the IMA.js application and provide the context for the tests.

```javascript
const { setImaTestingLibraryClientConfig, FALLBACK_APP_MAIN_PATH } = require('@ima/testing-library');

setImaTestingLibraryClientConfig({
  // your custom config
  appMainPath: FALLBACK_APP_MAIN_PATH, 
  imaConfigPath: 'path/to/your/ima.config.js',
});
```

## Usage

IMA Testing Library is re-exporting everything from `@testing-library/react`. You should always import React Testing Library functions from `@ima/testing-library` as we might add some additional functionality / wrappers in the future.

IMA Testing Library exports async function `renderWithContext`. It adds default context to the `render` function from RTL. The context is created from the IMA.js application and it contains the same values as the real application context.

```javascript
import { renderWithContext } from '@ima/testing-library';

test('renders learn react link', async () => {
  const { getByText } = await renderWithContext(<Component>My Text</Component>);
  const textElement = getByText(/My Text/i);

  expect(textElement).toBeInTheDocument();
});
```

You might need to specify custom additions to the context, or mock some parts of the IMA application. You can do this by providing a custom context wrapper and using the `@ima/testing-library` specific utilities.

```javascript
import { renderWithContext, getContextValue, initImaApp } from '@ima/testing-library';

test('renders learn react link with custom app configuration', async () => {
  const app = await initImaApp();

  app.oc.get('$Utils').$Foo = jest.fn(() => 'bar');

  const { getByText } = await renderWithContext(<Component>My Text</Component>, { app });
  const textElement = getByText(/My Text/i);

  expect(textElement).toBeInTheDocument();
});

test('renders learn react link with custom context value', async () => {
  const app = await initImaApp();
  const contextValue = await getContextValue(app);

  contextValue.$Utils.$Foo = jest.fn(() => 'bar');

  const { getByText } = await renderWithContext(<Component>My Text</Component>, { contextValue });
  const textElement = getByText(/My Text/i);

  expect(textElement).toBeInTheDocument();
});
```

### Extending IMA boot config methods

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

// If you need to register the plugin loader as the last one
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

test('renders learn react link with custom app configuration', async () => {
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

test('renders learn react link with custom app configuration', async () => {
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
