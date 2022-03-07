import { FunctionComponent } from 'preact';

import { IconComponentProps } from '#/components/icon/icons';

const AlertIcon: FunctionComponent<IconComponentProps> = props => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <path d='M12 9v5' />
      <path d='M12 17.5v.5' />
      <path d='M2.232 19.016L10.35 3.052c.713-1.403 2.59-1.403 3.302 0l8.117 15.964C22.45 20.36 21.544 22 20.116 22H3.883c-1.427 0-2.334-1.64-1.65-2.984z' />
    </svg>
  );
};

export default AlertIcon;
