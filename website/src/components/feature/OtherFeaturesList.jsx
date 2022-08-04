import { Check } from 'akar-icons';
import React from 'react';

import styles from './otherFeaturesList.module.css';

function OtherFeaturesList({ data }) {
  return (
    <section className={styles.container}>
      <h3>And many more...</h3>
      <div className={styles.list}>
        {data.map((text, index) => (
          <div className={styles.item} key={index}>
            <Check className={styles.icon} /> {text}
          </div>
        ))}
      </div>
    </section>
  );
}

export { OtherFeaturesList };
