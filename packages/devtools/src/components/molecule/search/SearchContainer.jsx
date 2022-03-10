import { actions, selectors } from 'slices/entries';
import { connect } from 'react-redux';
import Search from './Search';

const mapStateToProps = state => ({
  entriesLength: selectors.getEntriesLength(state),
  searchQuery: state.entries.searchQuery,
  showingLength: state.entries.entryIdsByQuery.length,
  hasNext: state.entries.hasNext,
  hasPrevious: state.entries.hasPrevious,
});

export default connect(mapStateToProps, {
  clearEntries: actions.clearEntries,
  setSearchQuery: actions.setSearchQuery,
  selectNext: actions.selectNext,
  selectPrevious: actions.selectPrevious,
})(Search);
