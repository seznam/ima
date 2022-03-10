import { connect } from 'react-redux';
import DataView from './DataView';

const mapStateToProps = state => ({
  entry: state.entries.entries[state.entries.selectedId],
});

export default connect(mapStateToProps)(DataView);
