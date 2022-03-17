import { FunctionComponent, useCallback } from 'react';

import { Overlay, CompileError, RuntimeError, Header } from '@/components';
import { useConnect } from './hooks';

export interface AppProps {
  serverError: string | null;
}

const App: FunctionComponent<AppProps> = ({ serverError }) => {
  const { error, setError } = useConnect(serverError);
  const handleClose = useCallback(() => setError(null), []);

  if (!error) {
    return null;
  }

  return (
    <Overlay type={error.type} animate={!serverError}>
      <Header
        name={error.name}
        message={error.message}
        type={error.type}
        onClose={handleClose}
        hasCloseButton={!serverError}
      />
      {error.type === 'compile' && <CompileError error={error} />}
      {error.type === 'runtime' && <RuntimeError error={error} />}
    </Overlay>
  );
};

export default App;
