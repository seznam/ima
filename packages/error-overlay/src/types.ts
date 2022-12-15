import { StackFrame } from '@/entities';

export interface ParsedError {
  name: string;
  message: string;
  type?: 'compile' | 'runtime';
  frames: StackFrame[];
  params?: string | object;
}
