import { StackFrame } from '#/entities';

type FramesAction =
  | {
      type: 'setError';
      payload: { name: string; message: string };
    }
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
