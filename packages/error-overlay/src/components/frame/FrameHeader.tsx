import clsx from 'clsx';
import { FunctionComponent } from 'react';

import { StackFrame } from '#/entities';

export type FrameHeaderProps = {
  frame: StackFrame;
};

const FrameHeader: FunctionComponent<FrameHeaderProps> = ({ frame }) => {
  const fileUriParts = (
    true
      ? [frame.getPrettyOriginalFileUri(), frame.orgLine, frame.orgColumn]
      : [frame.fileName, frame.line, frame.column]
  ).filter(Boolean);

  return (
    <div
      className='ima-frame-header'
      // className={clsx(
      //   'flex relative justify-between items-center border-slate-600 shadow-lg shadow-slate-800/25'
      // )}
    >
      <div
        className='ima-frame-header__tab'
        // className='flex overflow-y-auto justify-start items-center py-1 px-3 hover:bg-slate-600 active:bg-slate-500 rounded-tl-md border-r border-b-2 border-r-slate-600 border-b-cyan-500 transition-all md:py-2 md:px-4'
      >
        <div className='ima-frame-header__file-info'>
          <div className='ima-frame-header__method-name'>
            {/* {'currentError?.type' === 'compile'
              ? frame.getPrettyFileName()
              : frame.getFunctionName()} */}
            {frame.getPrettyFileName()}
          </div>
          {fileUriParts.length > 0 && (
            <div className='ima-frame-header__file-uri'>
              {fileUriParts.join(':')}
            </div>
          )}
        </div>
      </div>
      {/*
      <div className='flex px-2 md:px-4'>
        {currentError?.type !== 'compile' && (
          <Button
            className='p-1 md:p-2'
            linkStyle
            size='xs'
            color={frameWrapper.showOriginal ? 'green' : 'light'}
            onClick={() =>
              dispatch({
                type: frameWrapper.showOriginal
                  ? 'viewCompiled'
                  : 'viewOriginal',
                payload: { errorId, frameId: frameWrapper.id },
              })
            }
          >
            {frameWrapper.showOriginal ? (
              <Icon icon='openEye' />
            ) : (
              <Icon icon='closedEye' />
            )}
          </Button>
        )}

        <Button
          className='p-1 md:p-2'
          onClick={() => openEditor(frameWrapper)}
          disabled={!hasFragment || isLoading}
          size='xs'
          linkStyle
          color='light'
        >
          <Icon className={clsx({ 'animate-bounce': isLoading })} icon='edit' />
        </Button>
      </div> */}
    </div>
  );
};

export { FrameHeader };
