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
import type { StoryContext, StrictArgs } from 'storybook/internal/types';

export interface ImaStorybookArgs {}

declare module 'storybook/internal/types' {
  interface Parameters {
    ima?: {
      initBindApp?: (
        ns: Namespace,
        oc: ObjectContainer,
        config: Required<BootConfig>['bind'],
        state: BindingState,
        storybookArgs: StoryContext<ReactRenderer, StrictArgs>
      ) => void;
      initRoutes?: (
        ns: Namespace,
        oc: ObjectContainer,
        routes: UnknownParameters | undefined,
        router: Router,
        storybookArgs: StoryContext<ReactRenderer, StrictArgs>
      ) => void;
      initServicesApp?: (
        ns: Namespace,
        oc: ObjectContainer,
        config: BootConfig['services'],
        storybookArgs: StoryContext<ReactRenderer, StrictArgs>
      ) => void;
      initSettings?: (
        ns: Namespace,
        oc: ObjectContainer,
        config: BootConfig['settings'],
        storybookArgs: StoryContext<ReactRenderer, StrictArgs>
      ) => AppSettings;
      $IMA?: GlobalImaObject;
      state?: PageState;
      args?: ImaStorybookArgs;
    };
  }
}
