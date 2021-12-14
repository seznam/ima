import { render } from 'react-dom';

import { App } from '#/App';
import { ErrorsStoreProvider } from '#/stores';

render(
  <ErrorsStoreProvider>
    <App />
  </ErrorsStoreProvider>,
  document.getElementById('root')
);
