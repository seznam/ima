import { render } from 'preact';

import { App } from '#/App';
import { ErrorsStoreProvider } from '#/stores';

const root = document.getElementById('root');

if (root) {
  render(
    <ErrorsStoreProvider>
      <App />
    </ErrorsStoreProvider>,
    root
  );
}
