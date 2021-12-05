import { FunctionComponent } from 'react';
import { StackFrame } from '#/entities';

type FrameProps = {
  frame: StackFrame;
};

export const Frame: FunctionComponent<FrameProps> = ({ frame }) => {
  return (
    <div className="bg-gray-200 rounded-md mb-4">
      <header className="border-b border-gray-300 p-3 text-sm">
        <div className="font-700">{frame.functionName}</div>
        <div className="text-gray-600">
          {frame.getPrettyOriginalFileUri()}:{frame.originalLineNumber}
        </div>
      </header>
      <div className="p-3 text-xs font-mono overflow-y-auto">
        <pre>
          {frame.originalSourceFragment?.map(line => (
            <div
              key={line.line}
              className={`flex ${line.highlight ? 'bg-red-200' : ''}`}>
              <span className="text-500">{line.line} |</span>
              <div>{line.source}</div>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};
