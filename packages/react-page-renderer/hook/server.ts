import { Emitter } from '@esmj/emitter';
import { Event } from '@ima/server/lib/emitter';
import * as react from 'react';
import * as reactDOM from 'react-dom/server';

type RendererContext = {
  response: {
    content: string;
    documentView: react.ComponentType;
    documentViewProps: react.Attributes;
    react: typeof react;
    reactDOM: typeof reactDOM;
    status: number;
    viewAdapter?: react.ReactElement;
    spaPrefetch?: boolean;
  };
};

module.exports = function createReactRenderer({
  emitter,
}: {
  emitter: Emitter;
}) {
  emitter.prependListener(Event.BeforeError, event => {
    const context = event.context as RendererContext;

    if (context?.response?.viewAdapter) {
      delete context.response.viewAdapter;
    }
  });

  emitter.prependListener(Event.BeforeResponse, event => {
    // Skip rendering for SPA prefetch
    if ((event.context as RendererContext).response.spaPrefetch) {
      return;
    }

    const { documentView, documentViewProps, react, reactDOM, viewAdapter } = (
      event.context as RendererContext
    ).response;

    if (!viewAdapter) {
      return;
    }

    // Render current page to string
    const page = reactDOM.renderToString(viewAdapter);

    // Render document view (base HTML) to string
    const appMarkup = reactDOM.renderToStaticMarkup(
      react.createElement(documentView, {
        ...documentViewProps,
        page,
      } as react.Attributes)
    );

    (event.context as RendererContext).response.content =
      '<!doctype html>\n' + appMarkup;
  });
};
