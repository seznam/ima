import { render } from '@ima/testing-library';

import { PageContext } from './PageContext';

/**
 *
 * @param {Function} callback
 * @param {object} context
 * @param {object} props
 * @returns {ReactWrapper}
 */
function renderHook(callback, context = {}, props = {}) {
  const TestHookComponent = ({ __callback__ }) => {
    __callback__();
    return null;
  };

  return render(
    <PageContext.Provider value={context}>
      <TestHookComponent __callback__={callback} {...props} />
    </PageContext.Provider>
  );
}

export { renderHook };
