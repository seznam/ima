import { ErrorType, FrameWrapper } from 'types';

import { StackFrame } from '#/entities';
import { ErrorWrapper } from '#/reducers/errorsReducer';

type ErrorsAction =
  | {
      type: 'addError';
      payload: {
        name: string;
        message: string;
        type: ErrorType;
        frames: StackFrame[];
      };
    }
  | {
      type: 'viewOriginal';
      payload?: { errorId: ErrorWrapper['id']; frameId: FrameWrapper['id'] };
    }
  | {
      type: 'viewCompiled';
      payload?: { errorId: ErrorWrapper['id']; frameId: FrameWrapper['id'] };
    };

export { ErrorsAction };
