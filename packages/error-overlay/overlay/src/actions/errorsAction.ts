import { ErrorType } from 'types';

import { StackFrame } from '#/entities';
import { ErrorWrapper, FrameWrapper } from '#/reducers/errorsReducer';

type ErrorsAction =
  | {
      type: 'add';
      payload: {
        name: string;
        message: string;
        type: ErrorType;
        frames: StackFrame[];
      };
    }
  | {
      type: 'viewOriginal';
      payload: { errorId: ErrorWrapper['id']; frameId?: FrameWrapper['id'] };
    }
  | {
      type: 'viewCompiled';
      payload: { errorId: ErrorWrapper['id']; frameId?: FrameWrapper['id'] };
    }
  | {
      type: 'expand';
      payload: { errorId: ErrorWrapper['id']; frameId?: FrameWrapper['id'] };
    }
  | {
      type: 'collapse';
      payload: { errorId: ErrorWrapper['id']; frameId?: FrameWrapper['id'] };
    }
  | {
      type: 'previous';
    }
  | {
      type: 'next';
    };

export { ErrorsAction };
