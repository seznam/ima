import React from 'react';
import { connect } from 'react-redux';

import { alertsActions } from '@/slices';

import Alerts from './Alerts';

const mapStateToProps = state => ({
  alerts: state.alerts.alerts,
});

export default connect(mapStateToProps, {
  removeAlert: alertsActions.removeAlert,
})(Alerts);
