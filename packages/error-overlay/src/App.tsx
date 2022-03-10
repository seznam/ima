import { FunctionComponent } from 'react';

import { CompileError, RuntimeError } from '#/components';
import {
  defaultOverlayContext,
  OverlayContext,
} from '#/components/OverlayContext';
import { useConnect } from '#/hooks';

export interface AppProps {
  publicUrl: string | null;
}

const App: FunctionComponent<AppProps> = ({ publicUrl }) => {
  const { error } = useConnect();

  if (!error) {
    return null;
  }

  return (
    <OverlayContext.Provider
      value={{ publicUrl: publicUrl ?? defaultOverlayContext.publicUrl }}
    >
      {error.type === 'compile' && <CompileError error={error} />}
      {error.type === 'runtime' && <RuntimeError error={error} />}
    </OverlayContext.Provider>
  );
};

export { App };
