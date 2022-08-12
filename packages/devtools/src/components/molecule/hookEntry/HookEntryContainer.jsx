import { connect } from 'react-redux';

import {
  alertsActions,
  confirmModalActions,
  presetsActions,
  presetsSelectors,
} from '@/slices';

import HookEntry from './HookEntry';

const mapStateToProps = (state, { id }) => ({
  hook: presetsSelectors.getActiveHooks(state)[id],
});

export default connect(mapStateToProps, {
  toggleHook: presetsActions.toggleHook,
  deleteHook: presetsActions.deleteHook,
  openHook: presetsActions.openHook,
  alertSuccess: alertsActions.success,
  showConfirmModal: confirmModalActions.showConfirmModal,
})(HookEntry);
