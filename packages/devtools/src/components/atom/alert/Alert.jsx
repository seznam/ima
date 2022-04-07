import cn from 'clsx';
import PropTypes from 'prop-types';

import styles from './alert.less';

export default function Alert({
  type = 'default',
  className,
  title,
  children,
  ...restProps
}) {
  const alertTitle = title
    ? title
    : type.substring(0, 1).toUpperCase() + type.substring(1) + '!';

  return (
    <div className={cn(styles.alert, className)} {...restProps}>
      {type !== 'default' && (
        <strong className={cn(styles.title, styles[`title--${type}`])}>
          {alertTitle}
        </strong>
      )}
      {children}
    </div>
  );
}

Alert.propTypes = {
  type: PropTypes.oneOf(['default', 'danger', 'success', 'warning']),
  title: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.any,
};
