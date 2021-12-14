import uid from 'easy-uid';
import { ErrorType, FrameWrapper } from 'types';

import { ErrorsAction } from '#/actions';

export interface ErrorWrapper {
  id: string;
  name: string;
  message: string;
  type: ErrorType;
  frames: {
    [key: string]: FrameWrapper;
  };
}

export interface ErrorsState {
  showOriginal: boolean;
  currentErrorId: ErrorWrapper['id'] | null;
  errors: {
    [key: string]: ErrorWrapper;
  };
}

const errorsInitialState: ErrorsState = {
  showOriginal: true,
  currentErrorId: null,
  errors: {}
};

function errorsReducer(state: ErrorsState, action: ErrorsAction): ErrorsState {
  switch (action.type) {
    case 'addError': {
      const { name, message, type, frames } = action.payload;
      const errorId = uid();

      return {
        ...state,
        currentErrorId: !state.currentErrorId ? errorId : state.currentErrorId,
        errors: {
          ...state.errors,
          [errorId]: {
            id: errorId,
            name,
            message,
            type,
            frames: frames.reduce<ErrorWrapper['frames']>(
              (accFrames, curFrame) => {
                const id = uid();
                accFrames[id] = {
                  id,
                  frame: curFrame,
                  showOriginal: state.showOriginal
                };

                return accFrames;
              },
              {}
            )
          }
        }
      };
    }

    case 'viewCompiled':
    case 'viewOriginal': {
      const { errorId, frameId } = action.payload || {};
      const showOriginalResult = action.type === 'viewOriginal';

      // Update specific frame
      if (errorId && frameId) {
        return {
          ...state,
          errors: {
            ...state.errors,
            [errorId]: {
              ...state.errors[errorId],
              frames: {
                ...state.errors[errorId].frames,
                [frameId]: {
                  ...state.errors[errorId].frames[frameId],
                  showOriginal: showOriginalResult
                }
              }
            }
          }
        };
      }

      // Return state if there is no change
      if (
        (action.type === 'viewOriginal' && state.showOriginal) ||
        (action.type === 'viewCompiled' && !state.showOriginal)
      ) {
        return state;
      }

      // Reset all frames and update global state
      return {
        ...state,
        showOriginal: showOriginalResult,
        errors: Object.values(state.errors).reduce<ErrorsState['errors']>(
          (accErrors, curError) => {
            const updatedFrames = Object.values(curError.frames).reduce<
              ErrorWrapper['frames']
            >((accFrames, curFrame) => {
              accFrames[curFrame.id] = {
                ...curFrame,
                showOriginal: showOriginalResult
              };

              return accFrames;
            }, {});

            // Update Error
            accErrors[curError.id] = {
              ...curError,
              frames: updatedFrames
            };

            return accErrors;
          },
          {}
        )
      };
    }

    default:
      return state;
  }
}

export { errorsInitialState, errorsReducer };
