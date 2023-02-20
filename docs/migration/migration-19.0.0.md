---
title: Migration 19.0.0
description: Migration > Migration to version 19.0.0
---

# Migration from 18.x.x to 19.0.0

While IMA.js 19 is not as big of a release as previous major version, it brings some potential breaking changes to certain API and removes some deprecated functions. We have also managed to pack some additional new features.

:::info

For full list of changes, see [Github releases](https://github.com/seznam/ima/releases) page.

:::

## New features

### @ima/cli

 - Added support for **3rd party source maps** using `source-loader`, this is usefull especially in error overlay.
 - Added ability to customize open URL using `--openUrl` CLI argument or `IMA_CLI_OPEN_URL` environment variable. For more information see [--openUrl](../cli/cli.md#–openurl).
 - Added additional CLI output information when `forcedLegacy` and `writeToDisk` options are used.

<div class="text--center">

![New @ima/cli@19 features](./imacli_19_features_1.jpg)

</div>
<div class="text--center">

![New @ima/cli@19 features](./imacli_19_features_2.jpg)

</div>

### @ima/plugin-cli
 - **Added support for source-maps**, now all files transformed using `swc` (JS/TS) also produce `.map` files alongside transformed files.

### @ima/core
 - Package source files now include source map files.
 - All exports now use **named exports** (this is technically only package-wide change and does not mean nothing for the end user).
 - Added multiple new **TS types**, while also fixing existing types. Since rewriting IMA.js to typescript has been huge task, there may still be some type inconsistencies which we will try to fix in following releases to further improve TS experience in IMA.js ecosystem.
 - Added new `onRun` event to `window.$IMA.Runner`.
 - Add new methods `isClientError()` and `isRedirection()` to `GenericError`.
 - `getRouteHandlersByPath()` method on `AbstractRouter` is now public. Use this

#### Router changes
 - Added middleware execution timeout => all middlewares must execute within this defined timeframe (defaults to 30s). This can be customized using `$Router.middlewareTimeout` app settings.
 - Router middlewares now support `next` callback, which when defined, has to be called, otherwise the middleware will eventually timeout and not proceed any further. This enables some additional features, where you are able to stop route processing by not calling the `next` function if desired.
 - **Middlewares can now return object value**, which will be merged to the locals object, received as a second argument in middleware function. Middlewares wich `next` callback function can "return" additional locals by calling `next` with an argument.

```js
router.use(async (params, locals, next) => {
  next({ counter: counter++ });
});
```

 - For more information about middlewares see [middlewares section](../basic-features/routing/middlewares.md).

### @ima/react-page-renderer
 - Package source files now include source map files.
 - Fixed once hook parametr type.
 - Moved meta tags management to new PageMetaHandler, see [Seo and Meta Manager](../basic-features/seo-and-meta-manager.md) section for new updates to meta manager.
 - IMA specific React hooks have been rewritten to **TypeScript**.
 - Added package exports of multiple missing TS types and other interfaces (this provides better support for writing your applications in TS).

### @ima/error-overlay
 - Fixed an issue where invalid Error params caused circular dependency error.
 - Fixed an issue where errors, that occurred before error overlay is initialized were not reported to the error overlay.
 - Reduced number of levels that are expanded by default in error overlay error params view.

### @ima/server
 - Added new metric - **concurrent requests** to monitoring.
 - Add information about error cause in places, where we used to throw away this information.
 - Add routeName key to res.locals instead of res.$IMA, since res.$IMA should not be used anymore.
 - Added `X-Request-ID` to revival settings. Can be accessed through `$IMA.$RequestID`. This can be usefull to match same requests between client and server instances.
 - Added **XSS protection** to **host** and **protocol** in revival settings.
 - Add support for Client Errors and Redirects when serving static error pages.
 - Added option to **force app host** and **protocol**, using `$Server.host` and `$Server.protocol` settings in the `environment.js`.

## Breaking Changes

### @ima/cli
 - Bumped **browserslist targets definition** a little bit to browsers supporting `AbortController` -> Added `AbortController` to `es2018` test script to runner.ejs. This means that browsers not supporting `AbortController` will be served MPA version of IMA app. While technically not a breaking change, since it's pretty minor bump, it is something however you should be aware of.

### @ima/core
 - Removed `ExtensibleError`.
 - `StatusCode` has been renamed to `HttpStatusCode`.
 - `$Source` environment.js variable has been renamed to `$Resources`.
 - Removed deprecated package **entry points**, this includes all imports directly referencing files from `./dist/` directory. Please update your imports to the new [exports fields](https://github.com/seznam/ima/blob/master/packages/core/package.json#L39).
 - `IMA HttpAgent` now removes by default all headers from request and response which is stored in Cache. You can turn off this behavior with `keepSensitiveHeaders` option but **it is not recommended**.

#### MetaManager changes
 - Rewritten meta tag management in SPA mode, **all MetaManager managed tags are removed between pages while new page contains only those currently defined using setMetaParams function in app controller**. This should make meta tags rendering more deterministic, while fixing situations where old meta tags might be left on the page indefinitely if not cleaner properly.
 - MetaManager getters now always return object with key=value pairs of their set value. This should make settings additional meta attributes in loops much easier (for example: `getMetaProperty('og:title'); -> { property: 'property-value' });`)
 - Meta values/attributes with null/undefined values are not rendered, other values are converted to string.
 - Added new **iterator functions** to MetaManager.

```js
this.#metaManager.getMetaNamesIterator();
this.#metaManager.getMetaPropertiesIterator();
this.#metaManager.getLinksIterator();
```

 - Added ability to set **additional attributes** for meta tags/links in meta manager:

```js
this.#metaManager.setLink('lcp-image', media.url, {
  'lcp-image-imagesizes': media.sizes,
  'lcp-image-imagesrcset': media.srcSet
});
```

### @ima/react-page-renderer
 - Removed deprecated package **entry points**, this includes all imports directly referencing files from `./dist/` directory. Please update your imports to the new [exports fields](https://github.com/seznam/ima/blob/master/packages/react-page-renderer/package.json#L23).
 - `isSSR` hook has been removed, use `window.isClient()` directly from `useComponentUtils()`.
 - `useSettings` now returns `undefined`, when settings is not found when using `selector` namespace as an argument.
 - All exports are now **named exports**, you need to update import to `ClientPageRenderer` in bind.js to:

```javascript title=./app/config/bind.js
import { ClientPageRenderer } from '@ima/react-page-renderer/renderer/ClientPageRenderer';
```

 - Change order of method arguments in Component `fire` method. `target` has been moved to the first argument position.

```js
// from
this.fire('fetchDataArticles', event.target, { data: true })

// to
this.fire(event.target, 'fetchDataArticles', { data: true })
```

### @ima/dev-utils
 - Package now uses `exports` fields, instead of `./dist/*` imports. [See package.json](https://github.com/seznam/ima/blob/master/packages/dev-utils/package.json#L20).

### @ima/server
 - Update @esmj/monitor to 0.5.0 with breaking change for returns value from subscribe method where returns subscription is object with unsubscribe method.
 - Dropped support for direct `response.contentVariables` mutations, use `event.result` and return values in `CreateContentVariables` event.
 - Dropped support for `$Source`, `$RevivalSettings`, `$RevivalCache`, `$Runner`, `$Styles`, `$Scripts` content variables. These have been replaced by their lowerFirst counter-parts `resource` (now replaces `$Source`), `revivalSettings`, `revivalCache`, `runner`, `styles`, while `$Scripts` support have been dropped completely.
