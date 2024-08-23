import type { Utils, createImaApp } from '@ima/core';
import { render } from '@testing-library/react';

export interface ContextValue {
  $Utils: Utils;
}

export type ImaApp = ReturnType<typeof createImaApp>;
export type ImaContextWrapper = React.FC<{ children: React.ReactNode }>;
export type ImaRenderResult = ReturnType<typeof render> & {
  app: ImaApp | null;
  contextValue: ContextValue;
};
