import { FunctionComponent, useCallback } from 'react';

import {
  defaultOverlayContext,
  OverlayContext,
  Overlay,
  CompileError,
  RuntimeError,
  Header,
} from '#/components';
import { useConnect } from '#/hooks';

export interface AppProps {
  publicUrl: string | null;
}

const App: FunctionComponent<AppProps> = ({ publicUrl }) => {
  const { error, setError } = useConnect();
  const handleClose = useCallback(() => setError(null), []);

  if (!error) {
    return null;
  }

  return (
    <OverlayContext.Provider
      value={{
        publicUrl:
          publicUrl?.replace(/\/$/, '') ?? defaultOverlayContext.publicUrl,
      }}
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
