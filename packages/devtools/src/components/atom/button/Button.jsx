import styles from './button.less';
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

export default class Button extends React.PureComponent {
  static get propTypes() {
    return {
      children: PropTypes.any,
      color: PropTypes.oneOf(['primary', 'success']),
      className: PropTypes.string
    };
  }

  static get defaultProps() {
    return {
      className: ''
    };
  }

  render() {
    const { color, className, children, ...rest } = this.props;

    return (
      <button
        className={cn(
          styles.btn,
          { [styles[`btn--${color}`]]: color },
          className
        )}
        {...rest}>
        {children}
      </button>
    );
  }
}
