import { connect } from 'react-redux';

import EntryList from './EntryList';

const mapStateToProps = state => ({
  entryIds: state.entries.entryIdsByQuery,
});

export default connect(mapStateToProps)(EntryList);
