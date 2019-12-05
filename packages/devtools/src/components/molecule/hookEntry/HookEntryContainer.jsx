import { connect } from 'react-redux';
import { actions as presetsActions, selectors } from 'slices/presets';
import { actions as confirmModalActions } from 'slices/confirmModal';
import { actions as alertsActions } from 'slices/alerts';
import HookEntry from './HookEntry';

const mapStateToProps = (state, { id }) => ({
  hook: selectors.getActiveHooks(state)[id]
});

export default connect(mapStateToProps, {
  toggleHook: presetsActions.toggleHook,
  deleteHook: presetsActions.deleteHook,
  openHook: presetsActions.openHook,
  alertSuccess: alertsActions.success,
  showConfirmModal: confirmModalActions.showConfirmModal
})(HookEntry);
