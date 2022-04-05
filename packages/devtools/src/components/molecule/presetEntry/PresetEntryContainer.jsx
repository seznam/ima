import { connect } from 'react-redux';

import { alertsActions, confirmModalActions, presetsActions } from '@/slices';

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
