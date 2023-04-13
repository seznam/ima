import { PageContext } from '@ima/react-page-renderer';
import { Decorator, ReactRenderer } from '@storybook/react';
import { ProjectAnnotations } from '@storybook/types';

const withPageContextDecorator: Decorator = (Story, { loaded }) => {
  console.log('DECORATOR');
  return (
    <PageContext.Provider
      value={{ $Utils: loaded.app.oc.get('$ComponentUtils').getUtils() }}
    >
      <Story />
    </PageContext.Provider>
  );
};

console.log('preview');
const preview: ProjectAnnotations<ReactRenderer> = {
  decorators: [withPageContextDecorator],
  // globals: {
  //   [PARAM_KEY]: false,
  // },
};

export default preview;
