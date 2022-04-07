import clsx from 'clsx';
import prismjs from 'prismjs';
import { FunctionComponent, useState } from 'react';

import { FrameHeader, Icon } from '@/components';
import { StackFrame } from '@/entities';
import { ParsedError } from '@/types';
import { getPrismLanguage } from '@/utils';

export type FrameProps = {
  frame: StackFrame;
  type: ParsedError['type'];
};

const Frame: FunctionComponent<FrameProps> = ({ frame, type }) => {
  const [showOriginal, setShowOriginal] = useState<boolean>(
    !!frame.orgSourceFragment
  );

  const sourceFragment = showOriginal
    ? frame.orgSourceFragment
    : frame.sourceFragment;
  const hasFragment =
    Array.isArray(sourceFragment) && sourceFragment.length > 0;

  const { grammar, language } = getPrismLanguage(
    frame.orgFileName || frame.fileName
  );

  return (
    <div className='ima-frame'>
      <FrameHeader
        frame={frame}
        isCompile={type === 'compile'}
        onToggle={() => setShowOriginal(!showOriginal)}
        showOriginal={showOriginal}
        hasFragment={hasFragment}
      />

      <div className='ima-frame__code'>
        {hasFragment ? (
          <pre>
            <code>
              {sourceFragment.map(line => (
                <div
                  key={line.line}
                  className={clsx('ima-frame__line', {
                    'ima-frame__line--highlight': line.highlight,
                  })}
                >
                  <div className='ima-frame__line-number'>{line.line}</div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: prismjs.highlight(line.source, grammar, language),
                    }}
                  />
                </div>
              ))}
            </code>
          </pre>
        ) : (
          <div className='ima-frame__error'>
            <Icon icon='alert' size='xs' className='ima-frame__error-icon' />{' '}
            Original source fragment is not available.
          </div>
        )}
      </div>
    </div>
  );
};

export default Frame;
