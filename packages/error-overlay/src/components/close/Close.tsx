import { FunctionComponent } from 'react';

import { Icon } from '@/components';

export interface CloseProps {
  onClose: () => void;
}

const Close: FunctionComponent<CloseProps> = ({ onClose }) => {
  return (
    <button type='button' onClick={() => onClose()} className='ima-close'>
      <Icon icon='cross' size='lg' />
    </button>
  );
};

export default Close;
