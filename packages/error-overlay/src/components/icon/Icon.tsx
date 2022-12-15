import clsx from 'clsx';
import { FunctionComponent, memo } from 'react';

import { Icons, IconType } from './icons';

export type IconProps = {
  icon: IconType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
};

const Icon: FunctionComponent<IconProps & React.SVGProps<SVGSVGElement>> = ({
  icon,
  size = 'md',
  className,
  ...restProps
}) => {
  if (!Icons[icon]) {
    return null;
  }

  const Component = Icons[icon];

  return (
    <Component
      className={clsx('ima-icon', `ima-icon--size-${size}`, className)}
      {...restProps}
    />
  );
};

export { Icon };
export default memo(Icon);
