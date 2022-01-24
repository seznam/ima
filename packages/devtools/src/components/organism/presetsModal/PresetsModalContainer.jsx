import { connect } from 'react-redux';
import { actions as presetsActions } from 'slices/presets';
import { actions as alertsActions } from 'slices/alerts';
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
