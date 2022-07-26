import React from 'react';

import styles from './separator.module.css';

function Separator({ title, Icon }) {
  return (
    <div>
      <div className={styles.separator}>
        <div className={styles.iconContainer}>
          <Icon className={styles.icon} />
        </div>
      </div>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}

export { Separator };
