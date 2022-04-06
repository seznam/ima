import React from 'react';

import {
  DataViewContainer,
  EntryListContainer,
  SearchContainer,
} from '@/components/molecule';

import styles from './splitPane.less';

export default class SplitPane extends React.PureComponent {
  render() {
    return (
      <div className={styles.outerContainer}>
        <SearchContainer />
        <div className={styles.container}>
          <div className={styles.leftPane}>
            <EntryListContainer />
          </div>
          <div className={styles.rightPane}>
            <DataViewContainer />
          </div>
        </div>
      </div>
    );
  }
}
