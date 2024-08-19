<p align="center">
  <img height="130" src="https://imajs.io/img/logo.svg">
</p>

<h1 align="center">@ima/testing-library</h1>
  <p align="center"><i>Testing library for IMA.js applications.</i>
</p>

---

## IMA Testing Library

The `@ima/testing-library` contains utilities for testing IMA.js applications. It provides integration with [Jest](https://jestjs.io), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) (RTL for short) amd [Testing Library Jest DOM](https://testing-library.com/docs/ecosystem-jest-dom).

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
const { setImaTestingLibraryServerConfig } = require('@ima/testing-library');

setImaTestingLibraryServerConfig({
  // your custom config
  applicationFolder: '/path/to/folder/containing/server/folder',
});

module.exports = {
  preset: '@ima/testing-library'
};
```

**Client Configuration**

This configuration should be evaluated in the setup files, or directly in the test files. It's config values are used to initialize the IMA.js application and provide the context for the tests.

```javascript
const { setImaTestingLibraryClientConfig, FALLBACK_APP_MAIN_PATH } = require('@ima/testing-library');

setImaTestingLibraryClientConfig({
  // your custom config
  appMainPath: FALLBACK_APP_MAIN_PATH, // There is a default app main file as part of the package, it contains only the minimal setup and it might be enough for you if you don't have any real app main file.
  imaConfigPath: 'path/to/your/ima.config.js',
});
```

## Usage

IMA Testing Library is re-exporting everything from `@testing-library/react`. It provides the default context wrapper for the `render` method. Thanks to this, the default example from the React Testing Library documentation will work out of the box. You just need to import the `render` method from the `@ima/testing-library` package.

```javascript
import { render } from '@ima/testing-library';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);

  expect(linkElement).toBeInTheDocument();
});
```

You might need to specify custom additions to the context, or mock some parts of the IMA application. You can do this by providing a custom context wrapper and using the `@ima/testing-library` specific utilities.

```javascript
import { render, getContextWrapper, getContextValue, initImaApp } from '@ima/testing-library';

test('renders learn react link with custom context wrapper', () => {
  const ContextWrapper = getContextWrapper();
  const { getByText } = render(<App />, {
    wrapper: <MyCustomWrapper><CotextWrapper /></MyCustomWrapper>,
  });
  const linkElement = getByText(/learn react/i);

  expect(linkElement).toBeInTheDocument();
});

test('renders learn react link with custom context value', () => {
  const contextValue = getContextValue();

  contextValue.$Utils.$Foo = jest.fn(() => 'bar');

  const ContextWrapper = getContextWrapper(contextValue);
  const { getByText } = render(<App />, {
    wrapper: ContextWrapper,
  });
  const linkElement = getByText(/learn react/i);

  expect(linkElement).toBeInTheDocument();
});

test('renders learn react link with custom app configuration', () => {
  const app = initImaApp();

  app.oc.get('$Utils').$Foo = jest.fn(() => 'bar');

  const contextValue = getContextValue(app);
  const ContextWrapper = getContextWrapper(contextValue);
  const { getByText } = render(<App />, {
    wrapper: ContextWrapper,
  });
  const linkElement = getByText(/learn react/i);

  expect(linkElement).toBeInTheDocument();
});
```
