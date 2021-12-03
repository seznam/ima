import { FunctionComponent } from 'react';

interface HeaderProps {
  name: string;
  message: string;
}

export const Header: FunctionComponent<HeaderProps> = ({ name, message }) => {
  return (
    <div className="mb-4">
      <h1 className="text-red-500 font-bold text-2xl">{name}</h1>
      <h4 className="text-red-500 font- text-xl">{message}</h4>
    </div>
  );
};
