import React from 'react';

import styles from './featuresSeparator.module.css';

function FeaturesSeparator({ title, Icon }) {
  return (
    <div>
      <div className={styles.separator}>
        <div className={styles.iconContainer}>
          {/* <svg
            className={styles.icon}
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            stroke='currentColor'
            strokeWidth='0'
          >
            <path d='M11.074 2.633c.32-.844 1.531-.844 1.852 0l2.07 5.734c.145.38.514.633.926.633h5.087c.94 0 1.35 1.17.611 1.743L18 14a.968.968 0 0 0-.322 1.092L19 20.695c.322.9-.72 1.673-1.508 1.119l-4.917-3.12a1 1 0 0 0-1.15 0l-4.917 3.12c-.787.554-1.83-.22-1.508-1.119l1.322-5.603A.968.968 0 0 0 6 14l-3.62-3.257C1.64 10.17 2.052 9 2.99 9h5.087a.989.989 0 0 0 .926-.633l2.07-5.734z' />
          </svg> */}
          <Icon className={styles.icon} />
        </div>
      </div>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}

export { FeaturesSeparator };
