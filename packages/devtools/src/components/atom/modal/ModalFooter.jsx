import styles from './modal.less';
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'clsx';

export default class ModalFooter extends React.PureComponent {
  static get propTypes() {
    return {
      children: PropTypes.any,
      className: PropTypes.string
    };
  }

  static get defaultProps() {
    return {
      className: ''
    };
  }

  render() {
    const { children, className, ...rest } = this.props;

    return (
      <div className={cn(styles.footer, className)} {...rest}>
        {children}
      </div>
    );
  }
}
