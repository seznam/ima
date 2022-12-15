import { connect } from 'react-redux';

import { entriesActions } from '@/slices';

import Panel from './Panel';

const mapStateToProps = state => ({
  isLoading: state.entries.isLoading,
  error: state.entries.error,
  status: state.entries.status,
});

export default connect(mapStateToProps, {
  alive: entriesActions.alive,
  dead: entriesActions.dead,
  reload: entriesActions.reload,
  unsupported: entriesActions.unsupported,
  clearEntries: entriesActions.clearEntries,
  addEntries: entriesActions.addEntries,
  selectNext: entriesActions.selectNext,
  selectPrevious: entriesActions.selectPrevious,
})(Panel);
