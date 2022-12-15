import { GenericError } from '@ima/core';
import { useContext } from 'react';

import PageContext from '../PageContext';

/**
 * Provides direct access to IMA Page context.
 *
 * @example
 * const pageContext = usePageContext();
 * @returns {React.Consumer} IMA.js PageContext
 */
function usePageContext() {
  const context = useContext(PageContext);

  if (typeof context === 'undefined') {
    throw new GenericError(
      'The usePageContext hook must be used within PageContext.Provider.'
    );
  }

  return context;
}

export { usePageContext };
