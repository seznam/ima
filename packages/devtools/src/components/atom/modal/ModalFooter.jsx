import cn from 'clsx';
import PropTypes from 'prop-types';

import styles from './modal.less';

export default function ModalFooter({ children, className, ...restProps }) {
  return (
    <div className={cn(styles.footer, className)} {...restProps}>
      {children}
    </div>
  );
}

ModalFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
};
