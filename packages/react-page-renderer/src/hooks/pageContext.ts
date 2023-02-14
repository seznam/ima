import { GenericError } from '@ima/core';
import { useContext } from 'react';

import { PageContext, PageContextType } from '../PageContext';

/**
 * Provides direct access to IMA Page context.
 *
 * @example
 * const pageContext = usePageContext();
 *
 * @returns App page context.
 */
export function usePageContext(): PageContextType {
  const context = useContext<PageContextType>(PageContext);

  if (typeof context === 'undefined') {
    throw new GenericError(
      'The usePageContext hook must be used within PageContext.Provider.'
    );
  }

  return context;
}
