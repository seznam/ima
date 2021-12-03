import 'tailwindcss/tailwind.css';
import { FunctionComponent, useEffect, useState } from 'react';
import { StackFrame, Header } from './components';
import { mapStackFramesToOriginal } from './lib/stackFrameMapper';
import { StackFrame as StackFrameLib } from './lib/StackFrame';

export const App: FunctionComponent = () => {
  const { name, message, callStack } = window.__ima_server_error;
  const [stackFrames, setStackFrames] = useState<StackFrameLib[]>([]);

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
        <StackFrame key={stackFrame.id} frame={stackFrame} />
      ))}
    </div>
  );
};
