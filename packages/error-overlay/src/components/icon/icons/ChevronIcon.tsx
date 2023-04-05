import { FunctionComponent } from 'react';

const ChevronIcon: FunctionComponent<React.SVGProps<SVGSVGElement>> = props => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      stroke='currentColor'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='3'
      viewBox='0 0 24 24'
      {...props}
    >
      <path d='m15 4-8 8 8 8' />
    </svg>
  );
};

export default ChevronIcon;
