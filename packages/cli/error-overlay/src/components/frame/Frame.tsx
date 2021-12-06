import { FunctionComponent } from 'react';
import hljs from 'highlight.js/lib/core';
import hljsJS from 'highlight.js/lib/languages/javascript';
import { StackFrame } from '#/entities';
import { ChevronIcon } from '#/components';
import { FrameHeader } from './FrameHeader';

import 'highlight.js/styles/github-dark-dimmed.css';

hljs.registerLanguage('javascript', hljsJS);

interface FrameProps {
  frame: StackFrame;
}

export const Frame: FunctionComponent<FrameProps> = ({ frame }) => {
  return (
    <div className="mb-4">
      <FrameHeader
        title={frame.getFunctionName()}
        subtitle={`${frame.getPrettyOriginalFileUri()}:${
          frame.originalLineNumber
        }`}
      />

      <div className="language-javascript hljs p-3 leading-5 text-xs font-mono bg-gray-100 overflow-y-auto rounded">
        <pre>
          {frame.originalSourceFragment?.map(line => (
            <div
              key={line.line}
              className={`flex items-center ${
                line.highlight ? 'bg-red-500 bg-opacity-25' : ''
              }`}>
              {line.highlight && (
                <span className="text-red-500">
                  <ChevronIcon className="w-4 h-4" />
                </span>
              )}
              <span className="border-r pr-2 border-gray-500">
                {line.highlight ? line.line : `  ${line.line}`}
              </span>
              <div
                className="pl-2"
                dangerouslySetInnerHTML={{
                  __html: hljs.highlight(line.source, {
                    language: 'javascript'
                  }).value
                }}></div>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};
