import { FunctionComponent } from 'react';

import { Header, Frame } from '#/components';
import { ParsedError } from '#/types';

type CompileErrorProps = {
  error: ParsedError;
};

const CompileError: FunctionComponent<CompileErrorProps> = ({ error }) => {
  console.log(error);

  return (
    <div className='ima-error-overlay__compile-error'>
      <Header name={error.name} message={error.message} type={error.type} />
      {error.frames.map(frame => (
        <Frame
          key={`${frame.fileName}${frame.line}${frame.column}`}
          frame={frame}
          type={error.type}
        />
      ))}
    </div>
  );
};

export default CompileError;
