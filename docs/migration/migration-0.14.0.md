---
title: Migration 0.14.0
description: Migration > Migration to version 0.14.0
---

In order to upgrade your project to use IMA.js 0.14.0, please follow these steps:
- Update your `gulpfile.js` to require the default configuration from the `ima-gulp-tasks` package in the gulpfile.js (see the [example configuration](https://github.com/seznam/IMA.js-skeleton/blob/master/gulpConfig.js)).
- If you are using custom `build` and `dev` tasks, remove the `Es6toEs5:ima` task from those.
- Update your own custom gulp tasks to be compatible with [gulp 4](https://github.com/gulpjs/gulp/tree/4.0)
- Remove references to the `ima.client.js` file in the `settings.js` file and the `bundle` section in the `build.js` file.
- Add the `ima` package to the `common` group in the `vendors` section in the `build.js` file.
- Update your `main.js` file, the `ima.onLoad` method [returns a promise instead of accepting a callack](https://github.com/seznam/ima/tree/master/packages/create-ima-app/examples/hello/main.js#L17).
- Update your `ima-server` installation according to the [Hello World example](https://github.com/seznam/ima/tree/master/packages/create-ima-app/examples/hello).
- Plugins can no longer use namespaces, please update your `bind.js` file if you were using namespace references to IMA plugins.
- Import the `RouteNames` constants from `ima/router/RouteNames` in your `router.js` configuration file.
- Components may now declare the `defaultProps` and `propTypes` static properties as getters.
- The `$ROUTER_CONSTANTS` alias no longer exists (import the `ima/router/RouteNames` file).
- The `$HTTP_STATUS_CODE` alias no longer exists (import the `ima/http/StatusCode` file).
- Removed the `$Promise`, `$CacheEntry`, `$PageRendererViewAdapter`, `$Route` (switched to imports internally).
- The loose mode of the [ES2015 babel preset](http://babeljs.io/docs/plugins/preset-es2015/) is no longer enabled.
- Upgrade to node.js 7 or newer (older version *might* work but are no longer supported).
- Switch to default exports in your [configuration files](https://github.com/seznam/ima/tree/master/packages/create-ima-app/examples/hello/config).
- Remove the './node_modules/ima-babel6-polyfill/index.js' reference from the polyfills list in gulpConfig.js (if overridden; this has been fixed by babel).
- Remove the `main.less` file reference in the `build.js` file (unless it exists in the project).
- Add the `$CssClasses` property to object in the `$Utils` OC alias.
