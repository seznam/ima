import { FunctionComponent } from 'react';
import { SourceMapConsumer } from 'source-map';

import { CompileError, RuntimeError } from '#/components';
import { useConnect } from '#/hooks';
import { getDevServerBaseUrl } from '#/utils';

// Needed to enable source map parsing
// @ts-expect-error: Not available in typings
SourceMapConsumer.initialize({
  'lib/mappings.wasm': `${getDevServerBaseUrl()}/__error-overlay-static/mappings.wasm`,
});

export interface AppProps {
  public: string | null;
}

const App: FunctionComponent<AppProps> = props => {
  const { error } = useConnect();

  console.log(props, error);

  if (!error) {
    return null;
  }

  return (
    <div>
      {error.type === 'compile' && <CompileError error={error} />}
      {error.type === 'runtime' && <RuntimeError error={error} />}
    </div>
  );
};

export { App };
