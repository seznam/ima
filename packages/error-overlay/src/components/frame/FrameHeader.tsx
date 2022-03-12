import clsx from 'clsx';
import { FunctionComponent } from 'react';

import { Icon } from '#/components';
import { StackFrame } from '#/entities';
import { useOpenEditor } from '#/hooks';

export type FrameHeaderProps = {
  frame: StackFrame;
  isCompile: boolean;
  showOriginal: boolean;
  onToggle: () => void;
};

const FrameHeader: FunctionComponent<FrameHeaderProps> = ({
  frame,
  isCompile = true,
  showOriginal,
  onToggle,
}) => {
  const { isLoading, openEditor } = useOpenEditor();
  const fileUriParts = (
    showOriginal || isCompile
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

      <div className='ima-frame-header__actions'>
        {!isCompile && (
          <button
            type='button'
            className={clsx('ima-frame-header__button', {
              'ima-frame-header__button--green': showOriginal,
            })}
            onClick={() => onToggle()}
          >
            {showOriginal ? <Icon icon='openEye' /> : <Icon icon='closedEye' />}
          </button>
        )}

        <button
          type='button'
          className={clsx('ima-frame-header__button', {
            'ima-frame-header__button--pulse': isLoading,
          })}
          onClick={() => openEditor(frame, showOriginal)}
          disabled={isLoading}
          color='light'
        >
          {/* <Icon className={clsx({ 'animate-bounce': isLoading })} icon='edit' /> */}
          <Icon size='md' icon='edit' />
        </button>
      </div>
    </div>
  );
};

export default FrameHeader;
