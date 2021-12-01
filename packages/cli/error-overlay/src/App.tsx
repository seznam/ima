import 'tailwindcss/tailwind.css';
import { FunctionComponent } from 'react';
import { CodeBlock, Header } from './components';

export const App: FunctionComponent = () => {
  return (
    <div className="container mx-auto py-4">
      <Header>Runtime Error</Header>
      <CodeBlock title="./app/page/home/HomeView.jsx" />
      <CodeBlock title="./app/page/home/HomeView.jsx" />
      <CodeBlock title="./app/page/home/HomeView.jsx" />
      <CodeBlock title="./app/page/home/HomeView.jsx" />
      <CodeBlock title="./app/page/home/HomeView.jsx" />
      <CodeBlock title="./app/page/home/HomeView.jsx" />
    </div>
  );
};
