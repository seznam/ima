import React, { FunctionComponent } from 'react';

const ClosedEyeIcon: FunctionComponent<
  React.SVGProps<SVGSVGElement>
> = props => {
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
      <path d="M6.9 17.1c-1.9-1.3-3.3-3-4.2-4a1.7 1.7 0 0 1 0-2.1C4.2 9 7.8 5 12 5a9 9 0 0 1 5.1 1.9" />
      <path d="M14.1 9.9A3 3 0 1 0 10 14M4 20 20 4M10 18.7a7.1 7.1 0 0 0 2 .3c4.2 0 7.8-4 9.3-6a1.7 1.7 0 0 0 0-2 23 23 0 0 0-1.7-2" />
    </svg>
  );
};

export default ClosedEyeIcon;
