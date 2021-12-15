import PrismJS from 'prismjs';
import { FunctionComponent, memo, useCallback, useState } from 'react';
import { FrameWrapper } from 'types';

import { ErrorWrapper } from '#/reducers';

import FrameHeader from './FrameHeader';

import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-javascript';
import './prismjs.css';

export type FrameProps = {
  errorId: ErrorWrapper['id'];
  frameWrapper: FrameWrapper;
};

function getPrismLanguage(
  fileUri: string
): {
  grammar: PrismJS.Grammar;
  language: PrismJS.Language;
} {
  let language: PrismJS.Language = 'javascript';

  if (fileUri.endsWith('.jsx')) {
    language = 'jsx';
  }

  return { grammar: PrismJS.languages[language], language };
}

const Frame: FunctionComponent<FrameProps> = ({ frameWrapper, errorId }) => {
  const { frame } = frameWrapper;
  const sourceFragment = frameWrapper.showOriginal
    ? frame.originalSourceFragment
    : frame.sourceFragment;
  const hasFragment =
    Array.isArray(sourceFragment) && sourceFragment.length > 0;

  const [isFragmentVisible, setIsFragmentVisible] = useState<boolean>(
    hasFragment
  );

  const handleHeaderClick = useCallback(() => {
    setIsFragmentVisible(visible => !visible);
  }, []);

  const { grammar, language } = getPrismLanguage(
    frame.originalFileName || frame.fileName
  );

  return (
    <div className="overflow-hidden mb-4 rounded-md shadow-lg text-slate-50 bg-slate-700 shadow-slate-700/50">
      <FrameHeader
        onHeaderClick={handleHeaderClick}
        frameWrapper={frameWrapper}
        isFragmentVisible={isFragmentVisible}
        hasFragment={hasFragment}
        errorId={errorId}
      />

      {isFragmentVisible && (
        <div className="overflow-y-auto py-3 text-sm leading-6 rounded-b-xl text-slate-50 bg-slate-700">
          <pre>
            <code>
              {(frameWrapper.showOriginal
                ? frame.originalSourceFragment
                : frame.sourceFragment
              )?.map(line => (
                <div
                  key={line.line}
                  className={`flex items-center border-l-4 ${
                    line.highlight
                      ? 'bg-rose-500/20 border-rose-500'
                      : 'border-transparent'
                  }`}>
                  <div className="pr-3 pl-3 mr-3 border-r-2 text-slate-400 border-slate-600/75">
                    {line.line}
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: PrismJS.highlight(line.source, grammar, language)
                    }}
                  />
                </div>
              ))}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
};

export { Frame, getPrismLanguage };
export default memo(Frame);
