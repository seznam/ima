import cn from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './modal.less';

export default class ModalFooter extends React.PureComponent {
  static get propTypes() {
    return {
      children: PropTypes.any,
      className: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      className: '',
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
