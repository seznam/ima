import {
  ComponentUtils,
  InitBindFunction,
  PageRenderer,
  Window,
} from '@ima/core';
import {
  defaultCssClasses as cssClassNameProcessor,
  PageRendererFactory,
  ServerPageRenderer,
} from '@ima/react-page-renderer';
import { ClientPageRenderer } from '@ima/react-page-renderer/renderer/ClientPageRenderer';

declare module '@ima/core' {
  interface OCAliasMap {
    $CssClasses: () => typeof cssClassNameProcessor;
    $PageRendererFactory: PageRendererFactory;
  }
}

export const initBindApp: InitBindFunction = (ns, oc) => {
  // UI components
  oc.bind('$CssClasses', function () {
    return cssClassNameProcessor;
  });

  // You can set own Component utils here
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
    ]);
  }

  oc.bind('$PageRenderer', PageRenderer);
};
