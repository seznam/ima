import { FunctionComponent } from 'react';

interface FrameHeaderButtonProps {
  title?: string;
}

export const FrameHeaderButton: FunctionComponent<FrameHeaderButtonProps> = ({
  children
}) => {
  return (
    <button className="p-2 text-gray-700 hover:text-blue-500 transition-all duration-100 ease-in-out transform hover:scale-110 active:scale-105 active:text-blue-600">
      {children}
    </button>
  );
};
