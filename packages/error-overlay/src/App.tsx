import { FunctionComponent, useCallback, useState } from 'react';

import {
  defaultOverlayContext,
  OverlayContext,
  Overlay,
  CompileError,
  RuntimeError,
  Header,
} from '#/components';
import { useConnect } from '#/hooks';
import { TestCompileError, TestRuntimeError } from '#/testError';

export interface AppProps {
  publicUrl: string | null;
}

const App: FunctionComponent<AppProps> = ({ publicUrl }) => {
  const data = useConnect();
  console.log(data);

  const handleClose = useCallback(() => setError(null), []);
  const [error, setError] = useState<
    typeof TestCompileError | typeof TestRuntimeError | null
  >(TestRuntimeError);

  if (!error) {
    return null;
  }

  return (
    <OverlayContext.Provider
      value={{ publicUrl: publicUrl ?? defaultOverlayContext.publicUrl }}
    >
      <Overlay type={error.type} onClose={handleClose}>
        <Header
          name={error.name}
          message={error.message}
          type={error.type}
          onClose={handleClose}
        />
        {error.type === 'compile' && <CompileError error={error} />}
        {error.type === 'runtime' && <RuntimeError error={error} />}
      </Overlay>
    </OverlayContext.Provider>
  );
};

export { App };
