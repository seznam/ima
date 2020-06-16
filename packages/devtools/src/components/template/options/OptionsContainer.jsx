import { actions as alertsActions } from 'slices/alerts';
import { actions as presetsActions, selectors } from 'slices/presets';
import { connect } from 'react-redux';
import Options from './Options';

const mapStateToProps = state => ({
  hookIds: selectors.getHookIds(state),
  selectedPresetId: state.presets.selectedPresetId,
  presets: state.presets.presets
});

export default connect(mapStateToProps, {
  setPresets: presetsActions.setPresets,
  addHook: presetsActions.addHook,
  alertSuccess: alertsActions.success
})(Options);
