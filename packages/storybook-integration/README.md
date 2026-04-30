<p align="center">
  <img height="130" src="https://imajs.io/img/logo.svg">
</p>

<h1 align="center">@ima/storybook-integration</h1>
  <p align="center"><i>Storybook integration for IMA.js applications.</i>
</p>

---

## Getting started

### 1. Init Storybook

Run the official [Storybook](https://storybook.js.org) initializer inside your IMA.js app:

```bash
npx storybook@latest init
```

When prompted to select a framework, choose **React** and then **Vite** (`@storybook/react-vite`).

### 2. Install `@ima/storybook-integration`

```bash
npm install @ima/storybook-integration -D
```

### 3. Register the preset in `.storybook/main.js`

Add `@ima/storybook-integration/preset` to the `presets` array:

```js
presets: ['@ima/storybook-integration/preset'],
```

#### Preset options

To control language file loading or skip CLI plugins incompatible with Storybook (e.g. CSS scramblers):

```js
presets: [
  {
    name: '@ima/storybook-integration/preset',
    options: {
      language: 'cs',                     // Language for loading language files (default: first available)
      skipPlugins: ['ScrambleCssPlugin'], // CLI plugin class names to exclude from the Vite build
    },
  },
],
```

### 4. Import the preview setup in `.storybook/preview.js`

The preset automatically registers the global `withPageContext` decorator, `imaLoader`, and imports your app's `app/main` for every story. If you need to add project-wide story configuration (e.g. global args or `registerImaInitializer` calls), you can still create a `.storybook/preview.js`:

```js
import { registerImaInitializer } from '@ima/storybook-integration';

// any project-wide story configuration here
```

---

## How it works

The preset hooks into Storybook's `viteFinal` to run `@ima/cli`'s full Vite config pipeline, applying all IMA aliases, CSS config, define constants, and plugins (e.g. language virtual modules) inside Storybook. It also injects mocked `$IMA` revival settings into the page so the app boots correctly without a real server.

---

## Per-story configuration

### Overriding boot config, `$IMA` and `PageState`

Use `parameters.ima` to override boot config functions, the global `window.$IMA` object, or set page state on a per-story basis:

```js
export const Story = {
  parameters: {
    ima: {
      state: { posts: [] },   // IMA PageState
      $IMA: { $Root: '' },    // window.$IMA overrides
      initBindApp: (...args) => {},
      initRoutes: (...args) => {},
      initServicesApp: (...args) => {},
      initSettings: (...args) => {
        return {
          prod: {
            links: {
              tutorial: 'https://google.com',
            },
          },
        };
      },
    },
  },
};
```

Settings returned from `initSettings` are deeply merged with the application's own settings function.

### Overriding boot config using initializers

Because `parameters` are deeply merged across all story configurations, use `registerImaInitializer` when you need global overrides that can still be individually overridden at story level.

Initializers are called after the boot config is created but before per-story `parameters.ima` is applied. Register them in your `preview.js`/`preview.ts`:

```js
import { registerImaInitializer } from '@ima/storybook-integration';

registerImaInitializer(storybookArgs => {
  return {
    initServicesApp: (ns, oc) => {
      if (storybookArgs.parameters.ima.fireRouteEvents) {
        oc.get('$Dispatcher').fire(RouterEvents.BEFORE_HANDLE_ROUTE, {});
        oc.get('$Dispatcher').fire(RouterEvents.AFTER_HANDLE_ROUTE, {});
      }
    },
  };
}, 100); // Execution priority (higher = runs later)
```

---

## Utilities

### `isStorybook` helper

Check at runtime whether the code is running inside Storybook:

```js
import { isStorybook } from '@ima/storybook-integration/helpers';

export function Header() {
  return (
    <div>
      {isStorybook() ? (
        <div>Rendered only in storybook</div>
      ) : (
        <div>Rendered only in app</div>
      )}
    </div>
  );
}
```

> **Note:** Prefer native Storybook features like [args](https://storybook.js.org/docs/writing-stories/args) and [decorators](https://storybook.js.org/docs/writing-stories/decorators) over `isStorybook()` checks wherever possible.

### `withPageContext` decorator

The decorator is applied globally by `@ima/storybook-integration/preview`. You only need to import it explicitly in niche cases where you want to apply it to a single story manually:

```js
import { withPageContext } from '@ima/storybook-integration';

export const Story = {
  decorators: [withPageContext],
};
```

---

## TypeScript support

To enable augmented `parameters.ima` types in your stories, add the package to `compilerOptions.types` in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["@ima/storybook-integration"]
  }
}
```
