import { FunctionComponent } from 'react';

interface HeaderProps {
  name: string;
  message: string;
}

export const Header: FunctionComponent<HeaderProps> = ({ name, message }) => {
  return (
    <div className="my-3">
      <h1 className="text-red-500 tracking-tight text-3xl">
        <span className="font-semibold">{name}:</span> {message}
      </h1>
    </div>
  );
};
