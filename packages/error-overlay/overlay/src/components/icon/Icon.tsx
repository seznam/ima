import clsx from 'clsx';
import { FunctionComponent, memo } from 'react';

import { Icons, IconType } from './icons';

export type IconProps = {
  icon: IconType;
  size?: 'sm' | 'xs' | 'lg';
};

const Icon: FunctionComponent<IconProps & React.SVGProps<SVGSVGElement>> = ({
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
          'w-3 h-3': size === 'xs',
          'w-4 h-4': size === 'sm',
          'w-5 h-5': !size,
          'w-6 h-6': size === 'lg'
        },
        className
      )}
      {...restProps}
    />
  );
};

export { Icon };
export default memo(Icon);
