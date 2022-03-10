import clsx from 'clsx';
import { FunctionComponent, useState } from 'react';

import { Icon } from '#/components';
import { StackFrame } from '#/entities';

export type FrameHeaderProps = {
  frame: StackFrame;
  isCompile: boolean;
};

const FrameHeader: FunctionComponent<FrameHeaderProps> = ({
  frame,
  isCompile = true,
}) => {
  const [showOriginal, setShowOriginal] = useState(isCompile);
  const fileUriParts = (
    isCompile
      ? [frame.getPrettyOriginalFileUri(), frame.orgLine, frame.orgColumn]
      : [frame.fileName, frame.line, frame.column]
  ).filter(Boolean);

  return (
    <div className='ima-frame-header'>
      <div className='ima-frame-header__tab'>
        <div className='ima-frame-header__file-info'>
          <div className='ima-frame-header__method-name'>
            {isCompile ? frame.getPrettyFileName() : frame.getFunctionName()}
          </div>
          {fileUriParts.length > 0 && (
            <div className='ima-frame-header__file-uri'>
              {fileUriParts.join(':')}
            </div>
          )}
        </div>
      </div>

      <div className='flex px-2 md:px-4'>
        {!isCompile && (
          <button
            className='p-1 md:p-2'
            color={showOriginal ? 'green' : 'light'}
            onClick={() => setShowOriginal(value => !value)}
          >
            {showOriginal ? <Icon icon='openEye' /> : <Icon icon='closedEye' />}
          </button>
        )}

        <button
          className='p-1 md:p-2'
          // onClick={() => openEditor(frameWrapper)}
          // disabled={!hasFragment || isLoading}
          color='light'
        >
          {/* <Icon className={clsx({ 'animate-bounce': isLoading })} icon='edit' /> */}
          <Icon icon='edit' />
        </button>
      </div>
    </div>
  );
};

export default FrameHeader;
