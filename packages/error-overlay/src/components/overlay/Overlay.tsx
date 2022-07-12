import clsx from 'clsx';
import { FunctionComponent } from 'react';

import { ParsedError } from '@/types';

export interface OverlayProps {
  children: React.ReactNode;
  type: ParsedError['type'];
  animate?: boolean;
}

const Overlay: FunctionComponent<OverlayProps> = ({
  children,
  type,
  animate = true,
}) => {
  return (
    <div
      className={clsx('ima-overlay', {
        'ima-overlay--animate': animate,
      })}
    >
      <div className='ima-overlay__backdrop' />
      <div className='ima-overlay__foreground'>
        <div
          className={clsx(
            'ima-overlay__content',
            `ima-overlay__content--${type}`
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Overlay;
