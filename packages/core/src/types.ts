import { clone } from '@ima/helpers';

declare global {
  let $Debug: boolean;
}

export type Helpers = {
  clone: typeof clone;
};
