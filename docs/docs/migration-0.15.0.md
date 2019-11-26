---
layout: "docs"
---

# Upgrading to 0.15.0

---

In order to upgrade to IMA.js 0.15.0, start ba adding these new dependencies to package.json:

```json
"prop-types": "15.6.0",
"react": "16.2.0",
"react-dom": "16.2.0",
"express-http-proxy": "^1.0.7"
```

## Build

If you are overriding polyfills or shims (for example using some custom polyfills) you need to change polyfills or shims structure in gulpConfig.js . Now it has to be structure for js, es and fetch polyfills.
If you are't overriding polyfills or shims, you can skip this step.

Example:

```javascript
shim: {
  js: {
    name: 'shim.js',
    src: ['./node_modules/ima/polyfill/collectionEnumeration.js'],
    dest: {
    client: './build/static/js/'
    }
  },
  es: {
    name: 'shim.es.js',
    src: [],
    dest: {
    client: './build/static/js/',
    server: './build/ima/'
    }
  }
  

polyfill: {
  js: {
    name: 'polyfill.js',
    src: [
    './node_modules/babel-polyfill/dist/polyfill.min.js',
    './node_modules/custom-event-polyfill/custom-event-polyfill.js'
    ],
    dest: {
    client: './build/static/js/'
    }
  },
  es: {
    name: 'polyfill.es.js',
    src: ['./node_modules/custom-event-polyfill/custom-event-polyfill.js'],
    dest: {
    client: './build/static/js/'
    }
  },
  fetch: {
    name: 'fetch-polyfill.js',
    src: [
    './node_modules/core-js/client/shim.min.js',
    './node_modules/whatwg-fetch/fetch.js'
    ],
    dest: {
    client: './build/static/js/'
    }
  },
  ima: {
    name: 'ima-polyfill.js',
    src: [
    './node_modules/ima/polyfill/imaLoader.js',
    './node_modules/ima/polyfill/imaRunner.js'
    ],
    dest: {
    client: './build/static/js/'
    }
  }
  }

```

In build.js add new property 'es' to bundle object:

```javascript
es: [
  './build/static/js/polyfill.es.js',
  './build/static/js/shim.es.js',
  './build/static/js/vendor.client.es.js',
  './build/static/js/app.client.es.js'
]
```

Add to your settings.js **prod**.$Page.$Render new property esScripts like this:

```javascript
esScripts: [
  '/static/js/locale/' + config.$Language + '.js' + versionStamp,
  '/static/js/app.bundle.es.min.js' + versionStamp
]
```

Add to your settings.js **dev**.$Page.$Render new property esScripts like this:

```javascript
esScripts: [
  '/static/js/polyfill.es.js' + versionStamp,
  '/static/js/shim.es.js' + versionStamp,
  '/static/js/vendor.client.es.js' + versionStamp,
  `/static/js/locale/${config.$Language}.js${versionStamp}`,
  '/static/js/app.client.es.js' + versionStamp,
  '/static/js/hot.reload.js' + versionStamp
]
```

### Karma removed instead of that added Jest

If you are overriding gulpfile.js you need to make following changes:

- remove from gulpConfig.tasks.dev task `test:unit:karma:dev`
- remove from gulpConfig.tasks.dev and gulpConfig.tasks.build task `Es6ToEs5:vendor:client:test`
- remove from function buildExample task `Es6ToEs5:vendor:client:test`

If you are overriding gulpConfig.tasks.build in gulpConfig.js you need to add `bundle:es:app` into bundles section.

## Server

In server.js

Add at the top into import sections:

```javascript
require('ima/polyfill/imaLoader.js');
require('ima/polyfill/imaRunner.js');
```

add proxy into middlewares imports section

```javascript
let proxy = require('express-http-proxy');
```

change line

```javascript
.use(environment.$Proxy.path + '/', proxy)
```
to

```javascript
.use(environment.$Proxy.path + '/', proxy(environment.$Proxy.server))
```

## DocumentView

In DocumentView.jsx we united sync and async scripts.

- remove `getSyncScripts` function.
- update `getAsyncScripts` function to

```javascript
getAsyncScripts() {
  let scriptResources = `<script>
  function checkAsyncAwait () {
    try {
      new Function('(async () => ({}))()');
      return true;
    } catch (e) {
      return false;
    }
  }
  $IMA.Runner = $IMA.Runner || {};
  if (Object.values && checkAsyncAwait()) {
    $IMA.Runner.scripts = [
      ${this.utils.$Settings.$Page.$Render.esScripts
  .map(script => `'${script}'`)
  .join()}
      ];
  } else {
    $IMA.Runner.scripts = [
      ${this.utils.$Settings.$Page.$Render.scripts
  .map(script => `'${script}'`)
  .join()}
      ];
  }

  if (!window.fetch) {
    $IMA.Runner.scripts.unshift('${this.utils.$Settings.$Static
  .js}/fetch-polyfill.js');
  }

  $IMA.Runner.scripts.forEach(function(source) {
    var script = document.createElement('script');
    script.async = $IMA.$Env !== 'dev';
    script.onload = $IMA.Runner.load;
    script.src = source;

    document.getElementById('scripts').appendChild(script);
  });
  </script>`;

  return scriptResources;
}
```

replace

```jsx
{this.utils.$Settings.$Env === 'dev' ?
  <div id='scripts'>{this.getSyncScripts()}</div>
:
  <div id='scripts' dangerouslySetInnerHTML={
    { __html: this.getAsyncScripts() }
  }/>
}
```

with

```jsx
<div id='scripts' dangerouslySetInnerHTML={
  { __html: this.getAsyncScripts() }
}/>
```


## SPA

In `app/assets/static/html/spa.html` add ima-polyfill.

- [https://github.com/seznam/ima/tree/ima-doc-update/packages/examples/hello/assets/static/html/spa.html#L42](https://github.com/seznam/ima/tree/ima-doc-update/packages/examples/hello/assets/static/html/spa.html#L42)
- [https://github.com/seznam/ima/tree/ima-doc-update/packages/examples/hello/assets/static/html/spa.html#L47](https://github.com/seznam/ima/tree/ima-doc-update/packages/examples/hello/assets/static/html/spa.html#L47)

## Removed namespaces

If you extends some view from ns.ima.page.AbstractComponent, you need to add this import:

```javascript
import AbstractComponent from 'ima/page/AbstractComponent';
```
and use AbstractComponent instead of ns.ima.page.AbstractComponent.


If you extends some view from ns.ima.controller.AbstractController, you need to add this import:

```javascript
import AbstractController from 'ima/controller/AbstractController';
```

and use AbstractController instead of ns.ima.controller.AbstractController.



In settings.js import your DocumentView like this:

```javascript
import DocumentView from 'app/component/document/DocumentView';
```

Now you need to replace your documentView namespace with React component

so for this step replace your configuration.prod.$Page.$Render.documentView to DocumentView.

## Others

 - IMA.js is now using React 16 where is no longer supported `react-addons-perf` package in case you were using it.
 - There was added a fetchOptions property to the IMA.js' http. You can add this property into your settings.js file
to the `$Http.defaultRequestOptions` object. The property represents the second and optional parameter of the fetch method
[https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) - an options object containing
settings that you want to apply to the Fetch API [https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) request.
 - There is a breaking change in the IMA.js' router. Now there is defined an order where mandatory parameters have to be before optional parameters.
 - There are no longer available Request and Response at the client side.
