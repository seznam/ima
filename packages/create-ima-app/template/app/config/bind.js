import { Cache, ComponentUtils, PageRenderer, Response, Window } from '@ima/core';
import {
  ClientPageRenderer,
  defaultCssClasses as cssClassNameProcessor,
  PageRendererFactory,
  ServerPageRenderer
} from '@ima/react-page-renderer';

//eslint-disable-next-line no-unused-vars
export default (ns, oc, config) => {
  // You can set own Component utils here

  // UI components
  oc.bind('$CssClasses', function () {
    return cssClassNameProcessor;
  });

  oc.get(ComponentUtils).register({
    $CssClasses: '$CssClasses'
  });

  oc.inject(PageRendererFactory, [ComponentUtils, '$React']);
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
      Response,
      Cache,
    ]);
  }
  oc.bind('$PageRenderer', PageRenderer);
};
