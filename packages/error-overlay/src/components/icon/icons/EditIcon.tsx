import { FunctionComponent } from 'react';

const EditIcon: FunctionComponent<React.SVGProps<SVGSVGElement>> = props => {
  return (
    <svg
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <path d='m16.5 5.4 2 2.1m-.7-4-5.7 5.8a2.1 2.1 0 0 0-.6 1L11 13l2.6-.5c.5-.1.8-.3 1.1-.6l5.8-5.7a1.9 1.9 0 1 0-2.7-2.7z' />
      <path d='M19 15v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3' />
    </svg>
  );
};

export default EditIcon;
