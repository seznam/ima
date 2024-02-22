---
title: TypeScript
description: Basic features > TypeScript
---

Since IMA.js v18 we provide **support for Typescript in your application code** with proper type declarations from the core packages.

To enable TypeScript in your project, first you need to add `typescript` to your app dependencies:

```bash npm2yarn
npm i -D typescript
```

## tsconfig.json

Now create `tsconfig.json` file (that may look something like this):

```json title=./tsconfig.json
{
  "compilerOptions": {
    "allowJs": true,
    "target": "ES2022",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "module": "ES2022",
    "moduleResolution": "Node16",
    "strict": true,
    "resolveJsonModule": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "outDir": "./build/ts-cache",
    "paths": {
      "app/*": [
        "app/*"
      ],
    }
  },
  "include": ["./app/**/*", "./build/tmp/types/**/*"],
  "exclude": ["./**/__tests__"]
}
```


When CLI detects existence of the `tsconfig.json` file, it automatically starts **type checking** and **compiling** files with `*.ts` and `*.tsx` extensions.

Keep in mind that the code is still compiled using [swc](https://swc.rs/), the same way JS code is. This means that certain settings in `tsconfig.json` only applies to type checking (like `target`, `moduleResolution`, etc.), but compilation uses it's own settings to match the JS code.

:::tip

You will also probably need to install additional `@types/*` type definition libs to ensure proper support, like react types:

```bash npm2yarn
npm i -D @types/react @types/react-dom
```

:::

### ima-env.d.ts
Additionally we recommend creating a new `ima-env.d.ts` file in root of your `./app` folder with following contents:

```ts title=./app/ima-env.d.ts
/// <reference types="@ima/cli/global" />
```

This adds proper types support for webpack specific imports like images and other files.

## `create-ima-app` support

You can also easily create a typescript base IMA.js application using `--typescript` cli argument when running `create-ima-app` command:

```bash npm2yarn
npx create-ima-app ~/Desktop/ima-ts --typescript
```

## Controller generic types

The `AbstractController` class follows similar principles used in React `AbstractComponent` type. There are 3 generic types you can define on the class definition itself.

```ts title=AbstractController.ts
export class AbstractController<
  S extends PageState = {},
  R extends RouteParams = {},
  SS extends S = S
> extends Controller<S, R, SS>;
```

 - `S` - Use to define shape of your controller managed state.
 - `R` - Use to define controller's route route params that are extracted to `this.params`.
 - `SS` - Defaults to `S`, however when you are using any extensions in your controller, that have their own state, you can merge those state types in this generic value, to have proper type support for `this.getState()` method (this will now include all state keys, including ones used in extensions).

```ts title=HomeController.ts
import { TestExtension, GalleryExtensionState } from './GalleryExtension';

export type HomeControllerState = {
  cards: Promise<CardData>;
  message: string;
  name: string;
};

export class HomeController extends AbstractController<
  HomeControllerState,
  { detailId?: string },
  HomeControllerState & GalleryExtensionState
>{
  static $extensions?: Dependencies<Extension<any, any>> = [GalleryExtension];

  load(): HomeControllerState {
    const cardsPromise = this.#httpAgent
      .get<CardData>('http://localhost:3001/static/static/public/cards.json')
      .then(response => response.body);

    // `state` contains all merged types from `SS` generic value.
    const state = this.getState();

    return {
      message: 'test',
      cards: cardsPromise,
      name: 'nam',
    };
  }
}
```

## Extending existing interfaces

Since you can extend certain features like `ComponentUtils` or settings from within your application or through plugins, and in order to provide type checking for these, we are using specific interfaces that you can extend using [Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) feature.

This ensures (when used correctly), that you always have correct static types when using these interfaces, even when they are extended in multiple places.

### Extending `Utils`

When using component utils, in addition to registering your classes using `ComponentUtils` helper, make sure to also extend `Utils` interface. This adds autocomplete and typechecking to `this.utils()` and `useComponentUtils` in your components.

```ts title=./app/config/bind.ts
declare module '@ima/core' {
  interface Utils {
    $CssClasses: typeof defaultCssClasses;
  }
}

export const initBindApp: InitBindFunction = (ns, oc) => {
  oc.get(ComponentUtils).register({
    $CssClasses: '$CssClasses',
  });
};
```

### Extending `ObjectContainer`

Same goes for defining string aliases in Object container. This adds proper type checking to dependencies definition and `oc.get` autocomplete.

```ts title=./app/config/bind.ts
declare module '@ima/core' {
  interface OCAliasMap {
    $CssClasses: () => typeof cssClassNameProcessor;
    $PageRendererFactory: PageRendererFactory;
    API_KEY: string;
  }
}

export const initBindApp: InitBindFunction = (ns, oc) => {
  oc.bind('$CssClasses', function () { return cssClassNameProcessor; });
  oc.bind('$PageRendererFactory', PageRendererFactory);
  oc.constant('API_KEY', '14fasdf');
};
```

### Extending `Settings`

This makes sure you don't have any missing or additional fields in your app settings. Other environments than `prod` have all fields made optional, since they are deeply merged with the `prod` settings.

:::tip

Use `?:` for settings with default values. This applies mostly to plugins.

:::

```ts title=./app/config/settings.ts
declare module '@ima/core' {
  interface Settings {
    links: Record<'documentation' | 'tutorial' | 'plugins' | 'api', string>;
  }
}

export const initSettings: InitSettingsFunction = (ns, oc, config) => {
  return {
    prod: {
      links: {
        documentation: 'https://imajs.io/docs',
        api: 'https://imajs.io/api',
      },
    }
  }
}

```

## Dictionary localization keys

When compiling app language files, we also generate dictionary keys during runtime. These are then stored in `'./build/tmp/types/dictionary.ts'` file. Don't forget to include this file in `tsconfig.json` source files array, to have correct static type checking:

```json title=./tsconfig.json
{
  "include": ["./app/**/*", "./build/tmp/types/**/*"],
}
```

:::note

When used in IMA.js plugins, you can manually extend the `DictionaryMap` interface:

```ts
declare module '@ima/core' {
  interface DictionaryMap {
    'home.intro': string;
  }
}

export {};
```

:::
