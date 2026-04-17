<p align="center">
  <img height="130" src="https://imajs.io/img/logo.svg">
</p>

<h1 align="center">@ima/testing-library</h1>
  <p align="center"><i>Testing library for IMA.js applications.</i>
</p>

---

## IMA Testing Library

The `@ima/testing-library` contains utilities for testing IMA.js applications. It provides integration with [Vitest](https://vitest.dev), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) (RTL for short) and [Testing Library Jest DOM](https://testing-library.com/docs/ecosystem-jest-dom).

## Installation

Install the new dependencies. Note that RTL dependencies are only peer dependencies and you should specify them in your project.

```bash
npm install -D @ima/testing-library @testing-library/dom @testing-library/jest-dom @testing-library/react vitest
```

Configure vitest in your `vitest.config.ts` file.

```typescript
import { defineImaConfig } from '@ima/testing-library/vitest';

export default defineImaConfig();
```

Everything should start working out of the box for a typical IMA.js application. If you are trying to setup this library in a monorepo or an npm package, you might have to do some tweaks with the configuration.

### Configuration

**IMA Configuration**

Pass options directly to `defineImaConfig()` in your `vitest.config.ts`. These values are used to initialize the JSDOM environment in which the tests are running.

```typescript
import path from 'node:path';
import { defineImaConfig } from '@ima/testing-library/vitest';

export default defineImaConfig({
  applicationFolder: path.resolve('./__tests__/'), // The default application folder is the root of the project, but you can specify a custom one to add some test specific logic.
});
```

See [src/vitest.ts](https://github.com/seznam/ima/blob/master/packages/testing-library/src/vitest.ts) for the full list of available `ImaConfig` options.

**Vitest Overrides**

For project-specific Vitest configuration on top of the IMA defaults, use `mergeConfig()` from `vitest/config`:

```typescript
import path from 'node:path';
import { defineConfig, mergeConfig } from 'vitest/config';
import { defineImaConfig } from '@ima/testing-library/vitest';

export default defineConfig(async () =>
  mergeConfig(await defineImaConfig({ applicationFolder: path.resolve('./__tests__/') }), {
    test: {
      // project-specific overrides
    },
    resolve: {
      alias: {
        'app/main': './app/main.test.js', // You can tell vitest to use a different main file for the tests
      },
    },
  })
);
```

**Client Configuration**

This configuration should be evaluated in the setup files, or directly in the test files. Its config values are used to initialize the IMA.js application and provide the context for the tests.

```javascript
import { setImaTestingLibraryClientConfig } from '@ima/testing-library/client';

setImaTestingLibraryClientConfig({
  // your custom config
  rootDir: process.cwd(), // The root directory of your project
});
```

See [src/client/configuration.ts](https://github.com/seznam/ima/blob/master/packages/testing-library/src/client/configuration.ts) for the full list of available options.

## Usage

See [documentation](https://imajs.io/basic-features/testing) for more information about how to use the IMA Testing Library.
