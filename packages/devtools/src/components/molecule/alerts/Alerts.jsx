import cn from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import { Alert } from '@/components/atom';

import styles from './alerts.module.less';

export default class Alerts extends React.PureComponent {
  static get propTypes() {
    return {
      alerts: PropTypes.object,
      removeAlert: PropTypes.func,
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
                  [styles['alert--hidden']]: hidden,
                })}
                key={id}
                {...rest}
              >
                {content}
              </Alert>
            );
          })
          .reverse()}
      </div>
    );
  }
}
