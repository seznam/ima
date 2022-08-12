import { FunctionComponent, useState } from 'react';

import { Frame } from '@/components';
import { ParsedError } from '@/types';

type RuntimeErrorProps = {
  error: ParsedError;
};

const RuntimeError: FunctionComponent<RuntimeErrorProps> = ({ error }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    error.frames.length > 1
  );

  return (
    <div className='ima-runtime-error'>
      {(isCollapsed ? [error.frames[0]] : error.frames).map(frame => (
        <Frame
          key={`${frame.fileName}${frame.line}${frame.column}`}
          frame={frame}
          type={error.type}
        />
      ))}

      {isCollapsed && (
        <div className='ima-runtime-error__expand-wrapper'>
          <button
            type='button'
            className='ima-runtime-error__expand-button'
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            Show{' '}
            <span className='ima-runtime-error__number'>
              {error.frames.length - 1}
            </span>{' '}
            hidden stack frames
          </button>
        </div>
      )}
    </div>
  );
};

export default RuntimeError;
