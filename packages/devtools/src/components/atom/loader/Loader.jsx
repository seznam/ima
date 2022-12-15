import PropTypes from 'prop-types';

import styles from './loader.module.less';

export default function Loader({ title }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.loaderIcon} />
      {title && <p className={styles.title}>{title}</p>}
    </div>
  );
}

Loader.propTypes = {
  title: PropTypes.string,
};
