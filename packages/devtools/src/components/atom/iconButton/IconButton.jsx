import cn from 'clsx';
import PropTypes from 'prop-types';

import { Icon } from '@/components/atom';

import styles from './iconButton.less';

export default function IconButton({ color, className, name, ...restProps }) {
  return (
    <button
      className={`${cn(
        styles.iconBtn,
        { [styles[`iconBtn--${color}`]]: color },
        className
      )}`}
      {...restProps}
    >
      <Icon name={name} />
    </button>
  );
}

IconButton.propTypes = {
  color: PropTypes.oneOf(['danger', 'success']),
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};
