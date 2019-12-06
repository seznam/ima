---
layout: "docs"
---

IMA.js brings few major breaking changes, notably in the renaming of all packages. We've tried to make this process as easy as possible
through the provided jscodeshift transform scripts. For more information read below.

## Imports
The `ima-` packages (even plugins) has been renamed to `@ima/` scoped packages and `ima` core package has been renamed to `@ima/core`. The core package is now bundled with [rollup](https://rollupjs.org/guide/en/), so you can no longer import a file from specific path (i.e. `import GenericError from 'ima/error/GenericError'`), but you can import it directly from `@ima/core` (i.e. `import { GenericError } from '@ima/core'`).

All of this can be done automatically for a whole project using following jscodeshift script.

```bash
npx jscodeshift -t node_modules/@ima/core/transform/import-v17.js --extensions jsx,js --ignore-config=.gitignore ./
```

Following packages have been renamed.
```
ima-gulp-task-loader -> @ima/gulp-task-loader
ima-gulp-tasks -> @ima/gulp-tasks
ima-helpers -> @ima/helpers
ima-server -> @ima/server
```

Following packages have been removed.
```
ima-examples
ima-skeleton
```

And as a replacement, following package has been created.
```
create-ima-app
```

Also all plugins have been renamed from `ima-plugin-*` to `@ima/plugin-*`.

## Context API
IMA.js v17 no longer uses `prop-types` in `contextTypes` of `React` components. Instead, you should use `PageContext` from `@ima/core`. Also, `prop-types` has been removed from `IMA.js` dependencies, so if you need it for some reason, make sure it is installed as a project dependency.

**Example:**

This is original IMA.js v16 code.
```js
import PropTypes from 'prop-types';

export default class MyComponent extends AbstractComponent {
  static get contextTypes() {
    return {
      $Utils: PropTypes.object,
      urlParams: PropTypes.object
    };
  }
}
```

This should be the new IMA.js v17 code.
```js
import { PageContext } from '@ima/core';

export default class MyComponent extends AbstractComponent {
  static get contextType() {
    return PageContext;
  }
}
```

All of this can be done automatically for a whole project using following jscodeshift script.

```bash
npx jscodeshift -t node_modules/@ima/core/transform/context-api-v17.js --extensions jsx,js --ignore-config=.gitignore ./
```

## Utils Registration
There is a new way of defining component utils. You can no longer define `oc.constant('$Utils', {...})` in `app/conf/bind.js`, you have to use `oc.get(ComponentUtils).register({...})` instead. Also, following component utils are predefined by default, so you don't have to define them yourself.

```js
oc.get(ComponentUtils).register({
  $CssClasses: '$CssClasses',
  $Dictionary: Dictionary,
  $Dispatcher: Dispatcher,
  $EventBus: EventBus,
  $Helper: '$Helper',
  $Http: HttpAgent,
  $PageStateManager: PageStateManager,
  $Router: Router,
  $Settings: '$Settings',
  $Window: Window
});
```

**Example:**

Following definition of utils is no longer supported.
```js
oc.constant('$Utils', {
  $MyCustomHelper: oc.get(MyCustomHelper),
  ...
});
```
And must be replaced with following.
```js
oc.get(ComponentUtils).register({
  $MyCustomHelper: MyCustomHelper,
  ...
});
```

## IMA.js bundle for client/server
IMA.js v17 comes bundled for server and client side. This means smaller bundle for clients. To benefit from this, you should update `vendors` in your `app/build.js` as following.

```js
let vendors = {
- common: ['@ima/core'],
+ common: [],

- server: [],
+ server: [{ '@ima/core': '@ima/core/dist/ima.server.cjs.js' }],

- client: [],
+ client: [{ '@ima/core': '@ima/core/dist/ima.client.cjs.js' }],

  test: []
};
```

## Language Key in Config

Config key `language` (mostly used in `app/config/*.js` boot methods) has been renamed to `$Language`. You can search whole project for `config.language` and replace it with `config.$Language`, but most likely, it will be used only in `app/config/settings.js`.

## Hot Reload

Hot Reload has been rewritten and published as ima plugin. Old hot reloading will no longer work. You should delete `app/assets/js/hot.reload.js` from your project, then install the plugin via `npm install --save @ima/plugin-websocket @ima/plugin-hot-reload` and add following lines to your `app/build.js`.

```js
// You can add this somewhere below the vendors variable initialization
if (
  process.env.NODE_ENV === 'dev' ||
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === undefined
) {
  vendors.common.push('@ima/plugin-websocket');
  vendors.common.push('@ima/plugin-hot-reload');
}
```

## IMA.js Plugins

All IMA.js plugins need to be updated to the latest version. Older versions won't work.
