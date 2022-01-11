import styles from './iconButton.less';
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'clsx';

import Icon from 'components/atom/icon/Icon';

export default class IconButton extends React.PureComponent {
  static get propTypes() {
    return {
      color: PropTypes.oneOf(['danger', 'success']),
      name: PropTypes.string.isRequired,
      className: PropTypes.string
    };
  }

  static get defaultProps() {
    return {
      className: ''
    };
  }

  render() {
    const { color, className, name, ...rest } = this.props;

    return (
      <button
        className={`${cn(
          styles.iconBtn,
          { [styles[`iconBtn--${color}`]]: color },
          className
        )}`}
        {...rest}
      >
        <Icon name={name} />
      </button>
    );
  }
}
