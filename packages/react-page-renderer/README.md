# @ima/react-page-renderer

Adds support for rendering pages with React for IMA@18 and higher. For legacy IMA@17 use page renderers included in core package.

## Installation

```bash npm2yarn
npm install @ima/react-page-renderer
```

## Usage

### app/config/bind.js
```javascript
import {
  defaultCssClasses as cssClassNameProcessor,
  PageRendererFactory,
  ServerPageRenderer,
} from '@ima/react-page-renderer';
import { ClientPageRenderer } from '@ima/react-page-renderer/renderer/ClientPageRenderer';

export default (ns, oc, config) => {
  oc.bind('$CssClasses', function () {
    return cssClassNameProcessor;
  });

  oc.get(ComponentUtils).register({
    $CssClasses: '$CssClasses',
  });

  oc.inject(PageRendererFactory, [ComponentUtils]);
  oc.bind('$PageRendererFactory', PageRendererFactory);

  if (oc.get(Window).isClient()) {
    oc.provide(PageRenderer, ClientPageRenderer, [
      PageRendererFactory,
      '$Helper',
      '$Dispatcher',
      '$Settings',
      Window,
    ]);
  } else {
    oc.provide(PageRenderer, ServerPageRenderer, [
      PageRendererFactory,
      '$Helper',
      '$Dispatcher',
      '$Settings',
      Cache,
    ]);
  }
  oc.bind('$PageRenderer', PageRenderer);
};
```

If your app is using legacy React@17, use legacy client page renderer instead of the default one.
```javascript
import { ClientPageRenderer } from '@ima/react-page-renderer/renderer/LegacyClientPageRenderer';
```

### app/config/settings.js
```javascript
import DocumentView from 'app/document/DocumentView';

export default (ns, oc, config) => {
  return {
    prod: {
      $Page: {
        $Render: {
          documentView: DocumentView,
          masterElementId: 'page',
        },
      },
    },
  };
};
```

### server/app.js
```javascript
// You should already have this line in your file
const imaServer = require('@ima/server')();

require('@ima/react-page-renderer/hook/server')(imaServer);
```

### Components
```javascript
import { AbstractComponent, AbstractPureComponent } from '@ima/react-page-renderer';

export default class MyComponent extends AbstractComponent {}
```
