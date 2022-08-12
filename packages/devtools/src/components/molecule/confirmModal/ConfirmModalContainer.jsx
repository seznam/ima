import { connect } from 'react-redux';

import { confirmModalActions } from '@/slices';

import ConfirmModal from './ConfirmModal';

const mapStateToProps = state => {
  return {
    body: state.confirmModal.body,
    opened: state.confirmModal.opened,
    accept: state.confirmModal.accept,
    cancel: state.confirmModal.cancel,
  };
};

export default connect(mapStateToProps, {
  hideConfirmModal: confirmModalActions.hideConfirmModal,
})(ConfirmModal);
