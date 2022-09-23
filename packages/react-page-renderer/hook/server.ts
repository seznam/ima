import * as fs from 'fs';
import path from 'path';

import { Emitter } from '@esmj/emitter';
import { processContent } from '@ima/helpers';
import { Event } from '@ima/server/lib/emitter';
import * as react from 'react';
import * as reactDOM from 'react-dom/server';

import { Settings } from '../src/types';

type RendererContext = {
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

let runner = '';

const runnerPath = path.resolve('./build/static/public/runner.js');
if (fs.existsSync(runnerPath)) {
  runner = fs.readFileSync(runnerPath, 'utf8');
}

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
    let appMarkup = reactDOM.renderToStaticMarkup(
      react.createElement(documentView, {
        ...documentViewProps,
        page,
      } as react.Attributes)
    );

    appMarkup = processContent({
      content: appMarkup,
      runner,
      settings,
      SPA: false,
    });

    (event.context as RendererContext).response.content =
      '<!doctype ima html>\n' + appMarkup;

    return event;
  });
};
