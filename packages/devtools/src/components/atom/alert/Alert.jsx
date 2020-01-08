import styles from './alert.less';
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

export default class Alert extends React.PureComponent {
  static get propTypes() {
    return {
      type: PropTypes.oneOf(['default', 'danger', 'success', 'warning']),
      title: PropTypes.string,
      className: PropTypes.string,
      children: PropTypes.any
    };
  }

  static get defaultProps() {
    return {
      className: '',
      type: 'default',
      title: ''
    };
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { type, children, className, title, ...rest } = this.props;

    return (
      <div className={cn(styles.alert, className)} {...rest}>
        {type !== 'default' && (
          <strong className={cn(styles.title, styles[`title--${type}`])}>
            {this._getTitle()}
          </strong>
        )}
        {children}
      </div>
    );
  }

  _getTitle() {
    const { title, type } = this.props;

    if (title) {
      return title;
    }

    return type.substring(0, 1).toUpperCase() + type.substring(1) + '!';
  }
}
