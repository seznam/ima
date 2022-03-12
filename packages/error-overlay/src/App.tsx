import { FunctionComponent, useCallback } from 'react';

import { Overlay, CompileError, RuntimeError, Header } from '#/components';
import { useConnect } from '#/hooks';

const App: FunctionComponent = () => {
  const { error, setError } = useConnect();
  const handleClose = useCallback(() => setError(null), []);

  if (!error) {
    return null;
  }

  return (
    <Overlay type={error.type}>
      <Header
        name={error.name}
        message={error.message}
        type={error.type}
        onClose={handleClose}
      />
      {error.type === 'compile' && <CompileError error={error} />}
      {error.type === 'runtime' && <RuntimeError error={error} />}
    </Overlay>
  );
};

export { App };
