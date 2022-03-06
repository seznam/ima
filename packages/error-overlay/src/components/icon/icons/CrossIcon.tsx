import { FunctionComponent } from 'preact';

import { IconComponentProps } from '#/components/icon/icons';

const CrossIcon: FunctionComponent<IconComponentProps> = props => {
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
      <path d='M20 20L4 4m16 0L4 20' />
    </svg>
  );
};

export default CrossIcon;
