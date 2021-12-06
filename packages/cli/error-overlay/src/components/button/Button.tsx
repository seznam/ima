import { FunctionComponent, SyntheticEvent } from 'react';

type ButtonProps = {
  type?: 'submit' | 'reset' | 'button';
  bordered?: boolean;
  onClick?(event: SyntheticEvent): void;
};

const Button: FunctionComponent<ButtonProps> = ({
  type = 'button',
  bordered = false,
  onClick,
  children
}) => {
  return (
    <button
      type={type}
      onClick={event => onClick && onClick(event)}
      className={`flex items-center py-2 px-3 font-mono text-sm text-gray-600 hover:text-blue-500 active:text-blue-600 transition-all duration-100 ease-in-out active:scale-95 ${
        bordered ? 'border border-gray-600 hover:border-blue-500' : ''
      }`}>
      {children}
    </button>
  );
};

export { Button };
