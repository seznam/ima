import { connect } from 'react-redux';
import { actions as alertsActions } from 'slices/alerts';
import Alerts from './Alerts';

const mapStateToProps = state => ({
  alerts: state.alerts.alerts
});

export default connect(mapStateToProps, {
  removeAlert: alertsActions.removeAlert
})(Alerts);
