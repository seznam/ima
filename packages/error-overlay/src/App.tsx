import { FunctionComponent } from 'react';

import {
  defaultOverlayContext,
  OverlayContext,
  Overlay,
  CompileError,
  RuntimeError,
} from '#/components';
import { useConnect } from '#/hooks';
import { TestError } from '#/testError';

export interface AppProps {
  publicUrl: string | null;
}

const App: FunctionComponent<AppProps> = ({ publicUrl }) => {
  const data = useConnect();
  const error = TestError;

  if (!error) {
    return null;
  }

  return (
    <OverlayContext.Provider
      value={{ publicUrl: publicUrl ?? defaultOverlayContext.publicUrl }}
    >
      <Overlay>
        {error.type === 'compile' && <CompileError error={error} />}
        {error.type === 'runtime' && <RuntimeError error={error} />}
      </Overlay>
    </OverlayContext.Provider>
  );
};

export { App };
