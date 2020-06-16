import { connect } from 'react-redux';
import { actions } from 'slices/confirmModal';
import ConfirmModal from './ConfirmModal';

const mapStateToProps = (state) => {
  return {
    body: state.confirmModal.body,
    opened: state.confirmModal.opened,
    accept: state.confirmModal.accept,
    cancel: state.confirmModal.cancel
  };
};

export default connect(mapStateToProps, {
  hideConfirmModal: actions.hideConfirmModal
})(ConfirmModal);
