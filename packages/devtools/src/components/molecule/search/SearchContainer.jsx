import { connect } from 'react-redux';

import { entriesActions, entriesSelectors } from '@/slices';

import Search from './Search';

const mapStateToProps = state => ({
  entriesLength: entriesSelectors.getEntriesLength(state),
  searchQuery: state.entries.searchQuery,
  showingLength: state.entries.entryIdsByQuery.length,
  hasNext: state.entries.hasNext,
  hasPrevious: state.entries.hasPrevious,
});

export default connect(mapStateToProps, {
  clearEntries: entriesActions.clearEntries,
  setSearchQuery: entriesActions.setSearchQuery,
  selectNext: entriesActions.selectNext,
  selectPrevious: entriesActions.selectPrevious,
})(Search);
