import type { Utils } from '@ima/core';
import { createContext } from 'react';

export interface PageContextType {
  $Utils: Utils;
}

export const PageContext = createContext<PageContextType>(
  {} as PageContextType
);
