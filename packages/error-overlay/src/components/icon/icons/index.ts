import { FunctionComponent } from 'react';

import AlertIcon from './AlertIcon';
import ChevronIcon from './ChevronIcon';
import ClosedEyeIcon from './ClosedEyeIcon';
import CrossIcon from './CrossIcon';
import EditIcon from './EditIcon';
import OpenEyeIcon from './OpenEyeIcon';

export type IconType =
  | 'chevron'
  | 'closedEye'
  | 'cross'
  | 'edit'
  | 'openEye'
  | 'alert';

export type IconComponentProps = {
  className?: string;
};

const Icons: Record<
  IconType,
  FunctionComponent<IconComponentProps>
> = Object.freeze({
  chevron: ChevronIcon,
  closedEye: ClosedEyeIcon,
  cross: CrossIcon,
  edit: EditIcon,
  openEye: OpenEyeIcon,
  alert: AlertIcon,
});

export { Icons };
