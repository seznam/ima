import hljs from 'highlight.js/lib/core';
import hljsJS from 'highlight.js/lib/languages/javascript';
import { FunctionComponent, memo } from 'react';
import { FrameWrapper } from 'types';

import { ChevronIcon } from '#/components';
import { ErrorWrapper } from '#/reducers';

import { FrameHeader } from './FrameHeader';

import 'highlight.js/styles/github-dark-dimmed.css';

hljs.registerLanguage('javascript', hljsJS);

type FrameProps = {
  errorId: ErrorWrapper['id'];
  frameWrapper: FrameWrapper;
};

const FrameBase: FunctionComponent<FrameProps> = ({
  frameWrapper,
  errorId
}) => {
  if (!frameWrapper) {
    return null;
  }

  return (
    <div className="group mb-4">
      <FrameHeader frameWrapper={frameWrapper} errorId={errorId} />

      <div className="overflow-y-auto p-3 font-mono text-xs leading-5 bg-gray-100 rounded language-javascript hljs">
        <pre>
          {(frameWrapper.showOriginal
            ? frameWrapper.frame.originalSourceFragment
            : frameWrapper.frame.sourceFragment
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

const Frame = memo(FrameBase);
export { Frame, FrameBase };
