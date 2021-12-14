import { FunctionComponent } from 'react';
import { FrameWrapper } from 'types';

import { Button, ClosedEyeIcon, EditIcon, OpenEyeIcon } from '#/components';
import { ErrorWrapper } from '#/reducers/errorsReducer';
import { useErrorsDispatcher } from '#/stores';

type FrameHeaderProps = {
  errorId: ErrorWrapper['id'];
  frameWrapper: FrameWrapper;
};

const FrameHeader: FunctionComponent<FrameHeaderProps> = ({
  frameWrapper,
  errorId
}) => {
  const dispatch = useErrorsDispatcher();
  const { frame } = frameWrapper;
  const fileUri = frameWrapper.showOriginal
    ? `${frame.getPrettyOriginalFileUri()}:${frame.originalLineNumber}`
    : `${frame.fileName}:${frame.lineNumber}:${frame.columnNumber}`;

  return (
    <header className="flex flex-grow justify-between items-center p-3">
      <div>
        <h3 className="font-mono text-sm font-semibold leading-6">
          {frame.getFunctionName()}
        </h3>
        <h4 className="font-mono text-xs text-gray-600">{fileUri}</h4>
      </div>
      <div className="flex opacity-100 group-hover:opacity-100 transition-all duration-100 ease-in-out">
        <Button
          onClick={() =>
            dispatch({
              type: frameWrapper.showOriginal ? 'viewCompiled' : 'viewOriginal',
              payload: { errorId, frameId: frameWrapper.id }
            })
          }>
          {frameWrapper.showOriginal ? (
            <OpenEyeIcon className="w-5 h-5 text-green-500" />
          ) : (
            <ClosedEyeIcon className="w-5 h-5 text-red-500" />
          )}
        </Button>

        {/* <Button>
          <EditIcon className="w-5 h-5" />
        </Button> */}
      </div>
    </header>
  );
};

export { FrameHeader };
