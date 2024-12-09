import type {
  AppSettings,
  BindingState,
  BootConfig,
  GlobalImaObject,
  Namespace,
  ObjectContainer,
  PageState,
  Router,
  UnknownParameters,
} from '@ima/core';
import type { ReactRenderer } from '@storybook/react';
import type { StoryContextForLoaders, StrictArgs } from '@storybook/types';

export interface ImaStorybookArgs {}

declare module '@storybook/types' {
  interface Parameters {
    ima?: {
      initBindApp?: (
        ns: Namespace,
        oc: ObjectContainer,
        config: Required<BootConfig>['bind'],
        state: BindingState,
        storybookArgs: StoryContextForLoaders<ReactRenderer, StrictArgs>
      ) => void;
      initRoutes?: (
        ns: Namespace,
        oc: ObjectContainer,
        routes: UnknownParameters | undefined,
        router: Router,
        storybookArgs: StoryContextForLoaders<ReactRenderer, StrictArgs>
      ) => void;
      initServicesApp?: (
        ns: Namespace,
        oc: ObjectContainer,
        config: BootConfig['services'],
        storybookArgs: StoryContextForLoaders<ReactRenderer, StrictArgs>
      ) => void;
      initSettings?: (
        ns: Namespace,
        oc: ObjectContainer,
        config: BootConfig['settings'],
        storybookArgs: StoryContextForLoaders<ReactRenderer, StrictArgs>
      ) => AppSettings;
      $IMA?: GlobalImaObject;
      state?: PageState;
      args?: ImaStorybookArgs;
    };
  }
}
