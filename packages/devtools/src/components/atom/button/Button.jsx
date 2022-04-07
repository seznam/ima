import cn from 'clsx';
import PropTypes from 'prop-types';

import styles from './button.less';

export default function Button({ color, className, children, ...restProps }) {
  return (
    <button
      className={cn(
        styles.btn,
        { [styles[`btn--${color}`]]: color },
        className
      )}
      {...restProps}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.any,
  color: PropTypes.oneOf(['primary', 'success']),
  className: PropTypes.string,
};
