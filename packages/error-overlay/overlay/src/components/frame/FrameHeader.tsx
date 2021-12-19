import clsx from 'clsx';
import { FunctionComponent } from 'react';

import { Button, Icon } from '#/components';
import { useOpenEditor } from '#/hooks';
import { ErrorWrapper, FrameWrapper } from '#/reducers/errorsReducer';
import { useErrorsDispatcher, useErrorsStore } from '#/stores';

export type FrameHeaderProps = {
  errorId: ErrorWrapper['id'];
  frameWrapper: FrameWrapper;
  hasFragment: boolean;
};

const FrameHeader: FunctionComponent<FrameHeaderProps> = ({
  frameWrapper,
  errorId,
  hasFragment
}) => {
  const dispatch = useErrorsDispatcher();
  const errorType = useErrorsStore(context => context.currentError?.type);
  const { openEditor, isLoading } = useOpenEditor();
  const { frame } = frameWrapper;
  const fileUriParts = (frameWrapper.showOriginal || errorType === 'compile'
    ? [
        frame.getPrettyOriginalFileUri(),
        frame.originalLineNumber,
        frame.originalColumnNumber
      ]
    : [frame.fileName, frame.lineNumber, frame.columnNumber]
  ).filter(Boolean);

  return (
    <div
      className={clsx(
        'flex relative justify-between items-center shadow-lg border-slate-600 shadow-slate-800/25',
        { 'border-b': !frameWrapper.isCollapsed }
      )}>
      <button
        onClick={() =>
          dispatch({
            type: frameWrapper.isCollapsed ? 'expand' : 'collapse',
            payload: { errorId, frameId: frameWrapper.id }
          })
        }
        className="flex overflow-y-auto justify-start items-center py-1 px-3 md:px-4 rounded-tl-md border-r border-b-2 transition-all hover:bg-slate-600 active:bg-slate-500 border-r-slate-600 border-b-cyan-500">
        <div className="mr-3 md:mr-4 text-slate-400/50">
          <Icon
            icon="chevron"
            className={clsx('transition-transform', {
              'rotate-90': !frameWrapper.isCollapsed
            })}
          />
        </div>
        <div
          style={{ height: '40px' }}
          className="flex flex-col justify-center items-start text-left grow-0">
          <div className="flex items-center text-xs md:text-sm leading-5 md:leading-6 whitespace-nowrap">
            {!hasFragment && (
              <Icon icon="alert" size="xs" className="mr-1 text-rose-400" />
            )}
            {errorType === 'compile'
              ? frame.getPrettyFileName()
              : frame.getFunctionName()}
          </div>
          {fileUriParts.length > 0 && (
            <div className="md:text-xs whitespace-nowrap text-[0.65rem] text-slate-400">
              {fileUriParts.join(':')}
            </div>
          )}
        </div>
      </button>

      <div className="flex px-2 md:px-4">
        {errorType !== 'compile' && (
          <Button
            className="p-1 md:p-2"
            linkStyle
            size="xs"
            color={frameWrapper.showOriginal ? 'green' : 'light'}
            onClick={() =>
              dispatch({
                type: frameWrapper.showOriginal
                  ? 'viewCompiled'
                  : 'viewOriginal',
                payload: { errorId, frameId: frameWrapper.id }
              })
            }>
            {frameWrapper.showOriginal ? (
              <Icon icon="openEye" />
            ) : (
              <Icon icon="closedEye" />
            )}
          </Button>
        )}

        <Button
          className="p-1 md:p-2"
          onClick={() => openEditor(frameWrapper)}
          disabled={!hasFragment || isLoading}
          size="xs"
          linkStyle
          color="light">
          <Icon className={clsx({ 'animate-bounce': isLoading })} icon="edit" />
        </Button>
      </div>
    </div>
  );
};

export default FrameHeader;
