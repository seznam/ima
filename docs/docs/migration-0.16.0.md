---
layout: "docs"
title: "Docs - Upgrading to 0.16.0"
---

Upgrading from version 15 should be pretty straightforward and your application should work with no to minimal changes required.

## Changes in dependencies
- **babel-eslint**: `8.2.2`&nbsp;&nbsp;→&nbsp;&nbsp;`10.0.1`
- **enzyme**: `3.7.0`&nbsp;&nbsp;→&nbsp;&nbsp;`3.8.0`
- **enzyme-adapter-react-16**: `1.1.1`&nbsp;&nbsp;→&nbsp;&nbsp;`1.7.1`
- **eslint**: `4.19.1`&nbsp;&nbsp;→&nbsp;&nbsp;`5.11.1`
- **eslint-config-prettier**: `2.9.0`&nbsp;&nbsp;→&nbsp;&nbsp;`3.3.0`
- **eslint-plugin-jasmine**: `2.9.3`&nbsp;&nbsp;→&nbsp;&nbsp;`2.10.1`
- **eslint-plugin-jest**: `21.15.0`&nbsp;&nbsp;→&nbsp;&nbsp;`22.1.2`
- **eslint-plugin-prettier**: `2.6.0`&nbsp;&nbsp;→&nbsp;&nbsp;`3.0.1`
- **eslint-plugin-react**: `7.7.0`&nbsp;&nbsp;→&nbsp;&nbsp;`7.12.0`
- **ima-gulp-tasks**: `0.15.0`&nbsp;&nbsp;→&nbsp;&nbsp;`^0.16.0`
- **jest**: `22.4.3`&nbsp;&nbsp;→&nbsp;&nbsp;`23.6.0`
- **express-http-proxy**: `1.1.0`&nbsp;&nbsp;→&nbsp;&nbsp;`1.5.0`
- **helmet**: `3.12.0`&nbsp;&nbsp;→&nbsp;&nbsp;`3.15.0`
- **ima**: `0.15.1`&nbsp;&nbsp;→&nbsp;&nbsp;`0.16.0`
- **ima-server**: `0.15.0`&nbsp;&nbsp;→&nbsp;&nbsp;`0.16.0`
- **method-override**: `2.3.10`&nbsp;&nbsp;→&nbsp;&nbsp;`3.0.0`
- **multer**: `1.3.0`&nbsp;&nbsp;→&nbsp;&nbsp;`1.4.1`
- **react**: `16.2.0`&nbsp;&nbsp;→&nbsp;&nbsp;`16.7.0`
- **react-dom**: `16.2.0`&nbsp;&nbsp;→&nbsp;&nbsp;`16.7.0`
- **enzyme-to-json**: `^3.3.5` *(new)*
- ~~**jest-serializer-enzyme**~~ *(removed)*
- ~~**react-test-renderer**~~ *(removed)*

## Migration guide
- Use of **regular expressions** in `serveSPA.blacklist`. If you've been using array of strings, you need to change the syntax to use regular expressions instead:

```diff
/* app/environment.js */
{
  ...
- blackList: ['Googlebot', 'SeznamBot'],
+ blackList: userAgent => (new RegExp('Googlebot|SeznamBot', 'g')).test(userAgent),
  ...
}
```

- Added new mandatory parameter `action` to `route()` method in **Router** of a type `{ type: string, event: Event|null, url: string|null }`, where `type` attribute can take one of these values: `const { REDIRECT, CLICK, POP_STATE, ERROR } = ActionTypes`.

```javascript
/* ima/Router/ClientRouter.js */
route(
  path,
  options = {},
  { event = null, type = ActionTypes.REDIRECT, url = null } = {}
)
```

- Http options withCredentials is set to false by default. You must check your HTTP CORS requests and you must set withCredentials to true for sending Cookie header.

- **New serializer settings in Jest**, to configure it first add path to a newly created file ``jest.setup.js`` (located in the root directory) into `setupFiles` array in ``jest.config.json``. After that add new `snapshotSerializers` field with `["enzyme-to-json/serializer"]` value, that handles module loading, which converts Enzyme wrappers into format compatible with Jest snapshots.

```diff
/* jest.config.json */
"setupFiles": [
  "ima/test.js",
  "ima/polyfill/imaLoader.js",
  "ima/polyfill/imaRunner.js",
+ "<rootDir>/jest.setup.js"
],
+ snapshotSerializers": ["enzyme-to-json/serializer"]
```

```javascript
/* jest.setup.js */
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });
```

## Other changes
- **IMA.js-helpers** - removed `throttle` and `debounce` functions. You can replace `throttle` with `throttle` method available in **UIComponentHelper** in [IMA.js-ui-atoms](https://github.com/seznam/IMA.js-ui-atoms/blob/master/src/Visibility.js#L91) package. [73843d0](https://github.com/seznam/IMA.js-helpers/commit/73843d03cd46e79b6d3bd2f03df71d74fe89466c)
- Updated to **React 16.7**, which along with new context API and other features introduced deprecation of `componentWillMount`, `componentWillReceiveProps` and `componentWillUpdate` lifecycle methods.
- Upgraded to **Babel 7** and latest **ESLint 5**, which may result on some changes specific to your application.


## New Features
- Most notable new feature is the introduction of **PageManagerHandlers** which adds the possibility to customize actions like saving and restoring scroll positions, setting browser's address bar URL etc. For more information visit the [documentation](/docs/page-manager#intervene-into-the-process).
