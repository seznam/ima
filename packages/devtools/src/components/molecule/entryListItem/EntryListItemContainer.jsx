import { connect } from 'react-redux';

import { entriesActions } from '@/slices';

import EntryListItem from './EntryListItem';

const mapStateToProps = (state, { id }) => ({
  entry: state.entries.entries[id],
  zeroId: state.entries.zeroId,
  zeroTime: state.entries.zeroTime,
});

export default connect(mapStateToProps, {
  setSelected: entriesActions.setSelected,
})(EntryListItem);
