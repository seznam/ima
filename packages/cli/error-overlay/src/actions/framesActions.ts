import { StackFrame } from '#/entities';
import { FrameWrapper } from 'types';

type FramesAction =
  | {
      type: 'setFrames';
      payload: { frames: StackFrame[] };
    }
  | {
      type: 'viewOriginal';
      payload?: { id: StackFrame['id'] };
    }
  | {
      type: 'viewCompiled';
      payload?: { id: StackFrame['id'] };
    }
  | {
      type: 'showFrames';
    }
  | {
      type: 'collapseFrames';
    };

export { FramesAction };
