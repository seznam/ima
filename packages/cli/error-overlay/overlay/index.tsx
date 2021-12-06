import { FramesStoreProvider } from '#/stores/framesStore';
import { render } from 'react-dom';
import { SourceMapConsumer } from 'source-map';
import { App } from './src/App';

// FIXME
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
SourceMapConsumer.initialize({
  'lib/mappings.wasm': 'https://unpkg.com/source-map@0.7.3/lib/mappings.wasm'
});

render(
  <FramesStoreProvider>
    <App />
  </FramesStoreProvider>,
  document.getElementById('root')
);
