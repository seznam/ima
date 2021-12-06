import 'tailwindcss/tailwind.css';
import { FunctionComponent, useEffect, useState } from 'react';
import { ChevronIcon, Frame, Header } from '#/components';
import { mapStackFramesToOriginal } from '#/utils';
import { StackFrame } from '#/entities';

/**
 * TODO
 *  - Handle cases with different kinds of source maps (don't parse and return original)
 *  - Create bundle with source-map wasm included
 *  - make context lines editable
 *  - support for build errors
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

  return (
    <div className="container mx-auto py-4">
      <Header name={name} message={message} />
      {stackFrames?.map((stackFrame, i) => (
        <>
          <Frame key={stackFrame.id} frame={stackFrame} />
          {i === 1 && (
            <div className="mt-8 mb-6 flex items-center justify-center">
              <button className="p-2 flex items-center rounded transition-all duration-100 ease-in-out font-mono text-xs border-2 border-gray-600 text-gray-600 hover:border-blue-500 hover:text-blue-500 active:scale-95 active:text-blue-600">
                <ChevronIcon className="w-4 h-4 mr-1" />
                <span>
                  Show <span className="font-black">7</span> collapsed frames
                </span>
              </button>
            </div>
          )}
        </>
      ))}
    </div>
  );
};
