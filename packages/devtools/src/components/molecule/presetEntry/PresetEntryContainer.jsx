import { connect } from 'react-redux';
import { actions as presetsActions } from 'slices/presets';
import { actions as confirmModalActions } from 'slices/confirmModal';
import { actions as alertsActions } from 'slices/alerts';
import PresetEntry from './PresetEntry';

const mapStateToProps = (state, { id }) => ({
  preset: state.presets.presets[id],
});

export default connect(mapStateToProps, {
  renamePreset: presetsActions.renamePreset,
  copyPreset: presetsActions.copyPreset,
  deletePreset: presetsActions.deletePreset,
  alertSuccess: alertsActions.success,
  showConfirmModal: confirmModalActions.showConfirmModal,
})(PresetEntry);
