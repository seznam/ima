import styles from './alerts.less';
import ReactDOM from 'react-dom';
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'clsx';

import Alert from 'components/atom/alert/Alert';

export default class Alerts extends React.PureComponent {
  static get propTypes() {
    return {
      alerts: PropTypes.object,
      removeAlert: PropTypes.func
    };
  }

  constructor(props) {
    super(props);

    this.rootNode = document.body;
  }

  render() {
    const { alerts } = this.props;

    if (Object.keys(alerts).length <= 0) {
      return null;
    }

    return ReactDOM.createPortal(this._renderAlerts(), this.rootNode);
  }

  _renderAlerts() {
    const { alerts, removeAlert } = this.props;

    return (
      <div className={styles.container}>
        {Object.values(alerts)
          .map(alert => {
            const { id, content, hidden, ...rest } = alert;

            return (
              <Alert
                onClick={() => removeAlert(id)}
                className={cn(styles.alert, {
                  [styles['alert--hidden']]: hidden
                })}
                key={id}
                {...rest}>
                {content}
              </Alert>
            );
          })
          .reverse()}
      </div>
    );
  }
}
