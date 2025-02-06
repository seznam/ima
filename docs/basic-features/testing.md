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
