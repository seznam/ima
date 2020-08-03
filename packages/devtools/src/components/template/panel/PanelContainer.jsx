import { connect } from 'react-redux';
import { actions } from 'slices/entries';
import Panel from './Panel';

const mapStateToProps = state => ({
  isLoading: state.entries.isLoading,
  error: state.entries.error,
  status: state.entries.status
});

export default connect(
  mapStateToProps,
  {
    alive: actions.alive,
    dead: actions.dead,
    reload: actions.reload,
    unsupported: actions.unsupported,
    clearEntries: actions.clearEntries,
    addEntries: actions.addEntries,
    selectNext: actions.selectNext,
    selectPrevious: actions.selectPrevious
  }
)(Panel);
