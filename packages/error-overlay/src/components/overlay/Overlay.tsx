import clsx from 'clsx';
import { FunctionComponent } from 'react';

import { ParsedError } from '#/types';

export interface OverlayProps {
  type: ParsedError['type'];
}

const Overlay: FunctionComponent<OverlayProps> = ({ children, type }) => {
  return (
    <div className='ima-overlay'>
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
