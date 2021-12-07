import { FunctionComponent } from 'react';
import { IconProps } from 'types';

const OpenEyeIcon: FunctionComponent<IconProps> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <path d="M21.3 11c.4.6.4 1.4 0 2-1.5 2-5.1 6-9.3 6-4.2 0-7.8-4-9.3-6a1.7 1.7 0 0 1 0-2C4.2 9 7.8 5 12 5c4.2 0 7.8 4 9.3 6z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
};

export { OpenEyeIcon };
