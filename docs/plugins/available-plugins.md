---
title: Existing plugins
description: Plugins > List of existing plugins
---

We've already described a way to [create your own IMA.js plugins](./plugin-api.md#plugin-registration)
through a very simple interface. Now we would like to talk about [IMA.js-plugins](https://github.com/seznam/IMA.js-plugins) monorepo that already **contains variety of plugins** that covers many of the common use cases.

## IMA.js-plugins

Each plugin in [this repository](https://github.com/seznam/IMA.js-plugins) is thoroughly tested and maintained, so it always works with the most up to date IMA.js version. We, here at [Seznam.cz](https://www.seznam.cz/) use it daily in production on many of our projects, so don't worry about using them safely in the production environment.

Without further ado, let's quickly describe in this compact list **what each plugin does and when you would want to use them**:

:::note

This list is updated manually, so there can be situations where it doesn't match on 100% what is currently present in the monorepository itself.

:::


- [**plugin-analytic**](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-analytic) - Abstract analytic plugin for the IMA.js application. Serves as a base for other analytic plugins.
- [**plugin-analytic-fb-pixel**](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-analytic-fb-pixel) - Facebook Pixel analytics.
- [**plugin-analytic-google**](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-analytic-google) - UA and GA4 google analytics.
- [**plugin-halson-rest-client**](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-halson-rest-client) - HAL+JSON REST API client for IMA applications, based on [@ima/plugin-rest-client](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-rest-client).
- [**plugin-less-constants**](https://github.com/seznam/IMA.js-plugins/tree/master/packages/cli-plugin-less-constants) - Adds preprocessor which converts theme values defined in the JS file, to their LESS variable counterparts.
- [**plugin-logger**](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-logger) - A logging tool for IMA.js framework.
- [**plugin-resource-loader**](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-resource-loader) - Plugin for loading scripts and styles.
- [**plugin-rest-client**](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-rest-client) - Generic REST API client plugin.
- [**plugin-script-loader**](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-script-loader) - Plugin for loading 3rd party scripts.
- [**plugin-shared-cache**](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-shared-cache) - A utility for creating caches that are shared between requests by all IMA.js application instances within the same node.js process.
- [**plugin-managed-component**](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-managed-component) - Provides an extension to `AbstractComponent` with additional utility.
- [**plugin-select**](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-select) - Plugin to select extra props from page state to your component.
- [**plugin-self-xss**](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-self-xss) - This plugin is trying to mitigate Self-XSS security attack by sending simple message into console.
- [**plugin-style-loader**](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-style-loader) - This is the plugin for loading 3rd party styles for the IMA.js application.
- [**plugin-useragent**](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-useragent) - Parses useragent from client and server requests.
- [**plugin-xhr**](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-xhr) - Helper plugin simplifying the usage of the XMLHttpRequest API.
- [**plugin-local-storage**](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-local-storage) - `localstorage` implementation of `Storage` interface for IMA.js applications.
- [**plugin-testing-integration**](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-testing-integration) - This is a plugin for integration testing of any IMA.js based application.
- [**plugin-websocket**](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-websocket) - Allows creating socket server and connected clients can send broadcast message.
- [**plugin-merkur**](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-merkur) - For easier integrations of [merkur](https://merkur.js.org/) widget to ima application.
