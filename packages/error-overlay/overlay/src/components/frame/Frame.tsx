import hljs from 'highlight.js/lib/core';
import hljsJS from 'highlight.js/lib/languages/javascript';
import { FunctionComponent } from 'react';
import { FrameWrapper } from 'types';

import { ChevronIcon } from '#/components';

import { FrameHeader } from './FrameHeader';

import 'highlight.js/styles/github-dark-dimmed.css';

hljs.registerLanguage('javascript', hljsJS);

type FrameProps = FrameWrapper;

const Frame: FunctionComponent<FrameProps> = ({
  frame,
  isVisible,
  showOriginal
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="group mb-4">
      <FrameHeader showOriginal={showOriginal} frame={frame} />

      <div className="overflow-y-auto p-3 font-mono text-xs leading-5 bg-gray-100 rounded language-javascript hljs">
        <pre>
          {(showOriginal
            ? frame.originalSourceFragment
            : frame.sourceFragment
          )?.map(line => (
            <div
              key={line.line}
              className={`flex items-center ${
                line.highlight ? 'bg-red-500 bg-opacity-25' : ''
              }`}>
              {line.highlight && (
                <span className="text-red-500">
                  <ChevronIcon
                    className="w-4 h-4"
                    style={{
                      marginLeft: '-1px'
                    }}
                  />
                </span>
              )}
              <span className="pr-2 border-r border-gray-500">
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

export { Frame };
