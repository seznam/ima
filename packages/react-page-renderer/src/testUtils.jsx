import { mount } from 'enzyme';

import { PageContext } from './PageContext';

/**
 *
 * @param {Function} callback
 * @param {object} context
 * @param {object} props
 * @returns {ReactWrapper}
 */
function mountHook(callback, context = {}, props = {}) {
  const TestHookComponent = ({ __callback__ }) => {
    __callback__();
    return null;
  };

  return mount(
    <PageContext.Provider value={context}>
      <TestHookComponent __callback__={callback} {...props} />
    </PageContext.Provider>
  );
}

export { mountHook };
