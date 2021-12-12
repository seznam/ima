import { render } from 'react-dom';

import { App } from '#/App';
import { FramesStoreProvider } from '#/stores';

render(
  <FramesStoreProvider>
    <App />
  </FramesStoreProvider>,
  document.getElementById('root')
);
