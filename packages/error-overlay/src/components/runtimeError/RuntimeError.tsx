import { FunctionComponent } from 'react';

import { ParsedError } from '#/types';

type RuntimeErrorProps = {
  error: ParsedError;
};

const RuntimeError: FunctionComponent<RuntimeErrorProps> = ({ error }) => {
  return <h1>Runtime error - {error.name}</h1>;
};

export { RuntimeError };
