import {
  objectKeepUnmock,
  setGlobalKeepUnmock,
  setGlobalMockMethod,
} from 'to-mock';
import { vi } from 'vitest';

setGlobalMockMethod(vi.fn);
setGlobalKeepUnmock(objectKeepUnmock);
