import { Emitter } from '@esmj/emitter';
import { Event } from '@ima/server/lib/emitter';
import * as react from 'react';
import * as reactDOM from 'react-dom/server';

import { Settings } from '../src/types';

type RendererContext = {
  bootConfig: {
    settings: Settings;
  };
  response: {
    content: string;
    documentView: react.ComponentType;
    documentViewProps: react.Attributes;
    react: typeof react;
    reactDOM: typeof reactDOM;
    settings: Settings;
    status: number;
    viewAdapter: react.ReactElement;
  };
};

module.exports = function createReactRenderer({
  emitter,
}: {
  emitter: Emitter;
}) {
  emitter.prependListener(Event.Response, event => {
    const {
      documentView,
      documentViewProps,
      react,
      reactDOM,
      settings,
      viewAdapter,
    } = (event.context as RendererContext).response;

    if (!viewAdapter) {
      return event;
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

    (event.context as RendererContext).bootConfig = Object.assign(
      (event.context as RendererContext).bootConfig,
      {
        settings,
      }
    );
    (event.context as RendererContext).response.content =
      '<!doctype html>\n' + appMarkup;

    return event;
  });
};
