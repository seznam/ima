import { FunctionComponent } from 'react';

const Overlay: FunctionComponent = ({ children }) => {
  return (
    <div className='ima-overlay'>
      <div className='ima-overlay__backdrop' />
      <div className='ima-overlay__foreground'>
        <div className='ima-overlay__content'>{children}</div>
      </div>
    </div>
  );
};

export { Overlay };
