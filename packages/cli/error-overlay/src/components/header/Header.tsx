import { FunctionComponent } from 'react';

export const Header: FunctionComponent = ({ children }) => {
  return (
    <div className="mb-4">
      <h1 className="text-red-500 font-bold text-2xl">{children}</h1>
    </div>
  );
};
