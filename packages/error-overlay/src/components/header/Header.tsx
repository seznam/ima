import clsx from 'clsx';
import { FunctionComponent } from 'react';

import { Close } from '@/components';
import { ParsedError } from '@/types';

export type HeaderProps = {
  name: ParsedError['name'];
  message: ParsedError['message'];
  type: ParsedError['type'];
  onClose: () => void;
  hasCloseButton: boolean;
};

const Header: FunctionComponent<HeaderProps> = ({
  name,
  message,
  type,
  onClose,
  hasCloseButton,
}) => {
  return (
    <div className='ima-header'>
      <div className={clsx('ima-header__type', `ima-header__type--${type}`)}>
        {type ? `${type} error` : 'Error'}
      </div>
      <div className='ima-header__meta'>
        <span className='ima-header__name'>{name}: </span>
        <span className='ima-header__message'>{message}</span>
      </div>
      {hasCloseButton && <Close onClose={() => onClose()} />}
    </div>
  );
};

export default Header;
