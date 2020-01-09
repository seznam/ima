import styles from './splitPane.less';
import React from 'react';

import Search from 'components/molecule/search/SearchContainer';
import EntryList from 'components/molecule/entryList/EntryListContainer';
import DataView from 'components/molecule/dataView/DataViewContainer';

export default class SplitPane extends React.PureComponent {
  render() {
    return (
      <div className={styles.outerContainer}>
        <Search />
        <div className={styles.container}>
          <div className={styles.leftPane}>
            <EntryList />
          </div>
          <div className={styles.rightPane}>
            <DataView />
          </div>
        </div>
      </div>
    );
  }
}
