import { connect } from 'react-redux';

import { alertsActions, presetsActions, presetsSelectors } from '@/slices';

import Options from './Options';

const mapStateToProps = state => ({
  hookIds: presetsSelectors.getHookIds(state),
  selectedPresetId: state.presets.selectedPresetId,
  presets: state.presets.presets,
});

export default connect(mapStateToProps, {
  setPresets: presetsActions.setPresets,
  addHook: presetsActions.addHook,
  alertSuccess: alertsActions.success,
})(Options);
