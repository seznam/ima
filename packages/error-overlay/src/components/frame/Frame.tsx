import clsx from 'clsx';
import prismjs from 'prismjs';
import { FunctionComponent } from 'react';

import { FrameHeader } from '#/components';
import { StackFrame } from '#/entities';
import { getPrismLanguage } from '#/utils';

export type FrameProps = {
  frame: StackFrame;
};

const Frame: FunctionComponent<FrameProps> = ({ frame }) => {
  const hasFragment = true;
  const showOriginal = true;
  const { grammar, language } = getPrismLanguage(
    frame.orgFileName || frame.fileName
  );

  return (
    <div className='ima-frame'>
      <FrameHeader frame={frame} />
      <div className='ima-frame__code'>
        {hasFragment ? (
          <pre>
            <code>
              {(showOriginal
                ? frame.orgSourceFragment
                : frame.sourceFragment
              )?.map(line => (
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
          <div className='flex justify-center items-center py-2'>
            <div className='flex items-center'>
              {/* <Icon icon='alert' size='xs' className='mr-2 text-rose-400' />{' '} */}
              <span className='text-xs text-slate-400'>
                Original source fragment is not available.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { Frame, getPrismLanguage };
