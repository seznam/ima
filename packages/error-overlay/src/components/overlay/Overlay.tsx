import clsx from 'clsx';
import { FunctionComponent } from 'react';

import { ParsedError } from '#/types';

export interface OverlayProps {
  type: ParsedError['type'];
  onClose: () => void;
}

const Overlay: FunctionComponent<OverlayProps> = ({
  children,
  type,
  onClose,
}) => {
  return (
    <div className='ima-overlay'>
      <div className='ima-overlay__backdrop' onClick={() => onClose()} />
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
