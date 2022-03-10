import clsx from 'clsx';
import { FunctionComponent } from 'react';

import { Icons, IconType } from './icons';

export type IconProps = {
  icon: IconType;
  size?: 'sm' | 'xs' | 'lg';
  className?: string;
};

const Icon: FunctionComponent<IconProps> = ({
  icon,
  size,
  className,
  ...restProps
}) => {
  if (!Icons[icon]) {
    return null;
  }

  const Component = Icons[icon];

  return (
    <Component
      className={clsx(
        {
          'w-2 h-2 md:w-3 md:h-3': size === 'xs',
          'w-3 h-3 md:w-4 md:h-4 ': size === 'sm',
          'w-4 h-4 md:w-5 md:h-5 ': !size,
          'w-5 h-5 md:w-6 md:h-6 ': size === 'lg',
        },
        className
      )}
      {...restProps}
    />
  );
};

export default Icon;
