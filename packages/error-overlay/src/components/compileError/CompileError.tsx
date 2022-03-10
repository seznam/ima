import { FunctionComponent } from 'react';

import { ParsedError } from '#/types';

type CompileErrorProps = {
  error: ParsedError;
};

const CompileError: FunctionComponent<CompileErrorProps> = ({ error }) => {
  return <h1>Compile error - {error.name}</h1>;
};

export { CompileError };
