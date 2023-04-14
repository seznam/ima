import { PageContext } from '@ima/react-page-renderer';
import { Decorator } from '@storybook/react';

export const withPageContextDecorator: Decorator = (
  Story,
  { args, loaded }
) => (
  <PageContext.Provider
    value={{
      $Utils: loaded.app.oc.get('$ComponentUtils').getUtils(),
      ...(args?.context as object),
    }}
  >
    <Story />
  </PageContext.Provider>
);
