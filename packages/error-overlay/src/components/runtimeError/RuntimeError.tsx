import { FunctionComponent, useContext, useEffect } from 'react';
import { SourceMapConsumer } from 'source-map';

import { OverlayContext } from '#/components/OverlayContext';
import { ParsedError } from '#/types';

type RuntimeErrorProps = {
  error: ParsedError;
};

const RuntimeError: FunctionComponent<RuntimeErrorProps> = ({ error }) => {
  const { publicUrl } = useContext(OverlayContext);

  useEffect(() => {
    // Needed to enable source map parsing
    // @ts-expect-error: Not available in typings
    SourceMapConsumer.initialize({
      'lib/mappings.wasm': `${publicUrl}/__error-overlay-static/mappings.wasm`,
    });
  }, []);

  return <h1>Runtime error - {error.name}</h1>;
};

export { RuntimeError };
