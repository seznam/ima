import PropTypes from 'prop-types';
import { memo } from 'react';

import EntryListItemContainer from '../entryListItem/EntryListItemContainer';

import style from './entryList.module.less';

function EntryList({ entryIds }) {
  if (entryIds.length <= 0) {
    return null;
  }

  return (
    <div className={style.container}>
      <table className={style.table}>
        <tbody>
          {entryIds.map(id => {
            return <EntryListItemContainer id={id} key={id} />;
          })}
        </tbody>
      </table>
    </div>
  );
}

EntryList.propTypes = {
  entryIds: PropTypes.arrayOf(PropTypes.string),
};

export { EntryList };
export default memo(EntryList);
