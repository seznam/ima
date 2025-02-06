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
  imaConfigPath: 'path/to/your/ima.config.js',
});
```

See [src/client/configuration.ts](https://github.com/seznam/ima/blob/master/packages/testing-library/src/client/configuration.ts) for the full list of available options.

## Usage

See [documentation](https://imajs.io/basic-features/testing) for more information about how to use the IMA Testing Library.
