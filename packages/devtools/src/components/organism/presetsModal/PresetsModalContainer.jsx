import { connect } from 'react-redux';

import { alertsActions, presetsActions } from '@/slices';

import PresetsModal from './PresetsModal';

const mapStateToProps = state => ({
  presets: state.presets.presets,
  selectedPresetId: state.presets.selectedPresetId,
});

export default connect(mapStateToProps, {
  addPreset: presetsActions.addPreset,
  selectPreset: presetsActions.selectPreset,
  alertSuccess: alertsActions.success,
})(PresetsModal);
