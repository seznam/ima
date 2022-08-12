import { FunctionComponent } from 'react';

import { Frame } from '@/components';
import { ParsedError } from '@/types';

type CompileErrorProps = {
  error: ParsedError;
};

const CompileError: FunctionComponent<CompileErrorProps> = ({ error }) => {
  return (
    <div className='ima-compile-error'>
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
