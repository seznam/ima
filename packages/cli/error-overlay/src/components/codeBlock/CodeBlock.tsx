import { FunctionComponent } from 'react';

interface CodeBlockProps {
  title: string;
}

export const CodeBlock: FunctionComponent<CodeBlockProps> = ({
  title,
  children
}) => {
  return (
    <div className="bg-gray-200 rounded-md mb-4">
      <header className="border-b border-gray-300 p-3 text-sm">{title}</header>
      <div className="p-3 text-sm font-mono">
        <pre>{children}</pre>
      </div>
    </div>
  );
};
