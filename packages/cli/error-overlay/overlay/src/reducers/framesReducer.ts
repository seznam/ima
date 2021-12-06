import { FramesAction } from '#/actions';
import { FrameWrapper } from 'types';

interface FramesState {
  name: string;
  message: string;
  collapsedFramesCount: number;
  showOriginal: boolean;
  frames: FrameWrapper[];
}

const framesInitialState: FramesState = {
  name: '',
  message: '',
  collapsedFramesCount: 2,
  showOriginal: true,
  frames: []
};

function getCollapsedFrames(
  frames: FrameWrapper[]
): { frames: FrameWrapper[]; collapsedFramesCount: number } {
  let collapsedFramesCount = 0;

  frames.forEach((frame, index) => {
    frame.isVisible = !frame.frame.isCollapsible() || index === 0;
    collapsedFramesCount += frame.isVisible ? 0 : 1;
  });

  return {
    frames,
    collapsedFramesCount
  };
}

function framesReducer(state: FramesState, action: FramesAction): FramesState {
  switch (action.type) {
    case 'setError': {
      const { name, message } = action.payload;

      return {
        ...state,
        name,
        message
      };
    }

    case 'setFrames': {
      const wrappedFrames = action.payload.frames.map(frame => ({
        frame,
        showOriginal: true,
        isVisible: true
      }));

      const { frames, collapsedFramesCount } = getCollapsedFrames(
        wrappedFrames
      );

      return {
        ...state,
        frames,
        collapsedFramesCount
      };
    }

    case 'viewOriginal': {
      return {
        ...state,
        showOriginal: action.payload?.id ? state.showOriginal : true,
        frames: state.frames.map(frame => ({
          ...frame,
          showOriginal: action.payload?.id
            ? frame.frame.id === action.payload?.id
              ? true
              : frame.showOriginal
            : true
        }))
      };
    }

    case 'viewCompiled': {
      return {
        ...state,
        showOriginal: action.payload?.id ? state.showOriginal : false,
        frames: state.frames.map(frame => ({
          ...frame,
          showOriginal: action.payload?.id
            ? frame.frame.id === action.payload?.id
              ? false
              : frame.showOriginal
            : false
        }))
      };
    }

    case 'showFrames': {
      return {
        ...state,
        collapsedFramesCount: 0,
        frames: state.frames.map(frame => ({
          ...frame,
          isVisible: true
        }))
      };
    }

    case 'collapseFrames': {
      const { frames, collapsedFramesCount } = getCollapsedFrames(state.frames);
      return {
        ...state,
        frames,
        collapsedFramesCount
      };
    }

    default:
      return state;
  }
}

export { FramesState, framesInitialState, framesReducer };
