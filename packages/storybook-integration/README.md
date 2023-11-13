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

Register addon in config in `.storybook/main.js`. Optionally you can set custom language, for loading language files.

```js
const config = {
  // ...
  addons: [
    {
      name: "@ima/storybook-integration",
      options: {
        language: 'cs'
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

Add following to your `tsconfig.json`. Since we are not importing anything from this packaged, the types would not be loaded automatically without following option.

```json
{
  "compilerOptions": {
    "types": ["./node_modules/@ima/storybook-integration/dist/types.d.ts"],
  }
}
```
