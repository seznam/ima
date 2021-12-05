import 'tailwindcss/tailwind.css';
import { FunctionComponent, useEffect, useState } from 'react';
import { Frame, Header } from '#/components';
import { mapStackFramesToOriginal } from '#/utils';
import { StackFrame } from '#/entities';

/**
 * TODO
 *  - Handle cases with different kinds of source maps (don't parse and return original)
 *  - Create bundle with source-map wasm included
 */
export const App: FunctionComponent = () => {
  const { name, message, callStack } = window.__ima_server_error;
  const [stackFrames, setStackFrames] = useState<StackFrame[]>([]);

  useEffect(() => {
    const initStackFrames = async () => {
      setStackFrames(await mapStackFramesToOriginal(callStack));
    };

    initStackFrames();
  }, []);

  console.log(stackFrames);

  return (
    <div className="container mx-auto py-4">
      <Header name={name} message={message} />
      {stackFrames?.map(stackFrame => (
        <Frame key={stackFrame.id} frame={stackFrame} />
      ))}
    </div>
  );
};
