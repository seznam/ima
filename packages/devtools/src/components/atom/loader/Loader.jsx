import PropTypes from 'prop-types';
import React from 'react';

import styles from './loader.less';

export default class Loader extends React.PureComponent {
  static get propTypes() {
    return {
      title: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      title: null,
    };
  }

  render() {
    const { title } = this.props;

    return (
      <div className={styles.wrapper}>
        <div className={styles.loaderIcon} />
        {title && <p className={styles.title}>{title}</p>}
      </div>
    );
  }
}
