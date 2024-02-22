<p align="center">
  <img height="130" src="https://imajs.io/img/logo.svg">
</p>

<h1 align="center">@ima/storybook-integration</h1>
  <p align="center"><i>Storybook integration for IMA.js applications.</i>
</p>

---

## Init Storybook

First init storybook inside your application using official [installation guide](https://storybook.js.org/docs/react/get-started/install/). **Skip babel init (installing dependencies and creating .babelrc) when asked, we replace babel with SWC.**

```bash
npx storybook@latest init
```

## Installation

```bash
npm install @ima/storybook-integration -D
```

## Usage

Register addon in config in `.storybook/main.js`. Optionally you can set custom language, for loading language files, or set CLI plugins to skip (some plugins might not work well with Storybook, such as minimizers/scramblers).

```js
const config = {
  // ...
  addons: [
    {
      name: "@ima/storybook-integration",
      options: {
        language: 'cs',
        skipPlugins: ['ScrambleCssPlugin']
      }
    }
  ],
  // ....
};

export default config;
```

### Overriding boot config, $IMA global object and `PageState`

You can easily override boot config functions, global window.$IMA and set page state using `parameters.ima`:

```js
export const Story = {
  parameters: {
    ima: {
      state: { posts: [] }, // IMA PageState
      $IMA: { $Root: '' }, // window.$IMA object
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

Where settings are deeply merged with the ones from app settings function. You can use this on per-story basis or define global overrides.

### Overriding boot config using initializers

Since `parameters` are deeply merged across storybook stories and configurations, if you want to create some global overrides and still be able to override certain things on story-basis, you can use `initializers` instead.

Initializers are functions that are called after boot config is created, but before the story boot config params. This allows you to register multiple initializers, with certain priority and make sure that all of them are called before story boot config is created.

Register your initializers in preview.ts file:

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
}, 100); // Execution priority
```

### `isStorybook` helper

You can use this helper to check if you are within storybook environment. This is useful for example when you want to render something only in storybook.

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
};
```

**This pattern should be used only as last resort**, you should use storybook native features like [args](https://storybook.js.org/docs/react/writing-stories/args) or [decorators](https://storybook.js.org/docs/react/writing-stories/decorators) when possible.

### Decorators & other utilities

The package also exports some additional utilities and decorates you can use in your stories. All are available from default export.

```js
import { withPageContext } from '@ima/storybook-integration';

export const Story = {
  decorators: [withPageContext],
};
```

- `withPageContext` - adds `pageContext` to your story. It is used already as root decorator when using `ima` storybook-integration. So this is usefull only in niche cases.

## TypeScript support

Add following to your `tsconfig.json`. Since we are not importing anything from this packaged (in default state), the types would not be loaded automatically without following option.

```json
{
  "compilerOptions": {
    "types": ["./node_modules/@ima/storybook-integration/dist/index.d.ts"],
  }
}
```
