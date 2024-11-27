import type { Utils, createImaApp } from '@ima/core';
import { render, renderHook } from '@testing-library/react';

export interface ContextValue {
  $Utils: Utils;
}

export type ImaApp = ReturnType<typeof createImaApp>;
export type ImaContextWrapper = React.FC<{ children: React.ReactNode }>;
export type ITLResultExtension = {
  app: ImaApp | null;
  contextValue: ContextValue;
};
export type ImaRenderResult = ReturnType<typeof render> & ITLResultExtension;
export type ImaRenderHookResult<TResult, TProps> = ReturnType<
  typeof renderHook<TResult, TProps>
> &
  ITLResultExtension;
