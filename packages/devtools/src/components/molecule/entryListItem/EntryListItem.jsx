import { EntryType } from '@/utils';
import cn from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './entryListItem.module.less';

export default class EntryListItem extends React.PureComponent {
  static get propTypes() {
    return {
      entry: EntryType.isRequired,
      zeroId: PropTypes.string.isRequired,
      zeroTime: PropTypes.number.isRequired,
      setSelected: PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
  }

  render() {
    const { zeroTime, zeroId } = this.props;
    const { selected, id, messages } = this.props.entry;
    const { color, label, type, time, promises } =
      messages[Math.max(messages.length - 1, 0)].payload;
    const { shortLabel, event } = this._parseLabel(label);

    return (
      <tr
        onClick={this.onSelect}
        className={cn(styles.wrapper, styles[`wrapper--${color}`], {
          [styles['wrapper--selected']]: selected,
        })}
      >
        <td className={styles.label}>
          {shortLabel}
          {event && <span className={styles.event}> [{event}]</span>}
          <span className={styles.tagWrapper}>
            <span className={styles.type}>{type}</span>
          </span>
          {promises && (
            <span className={styles.tagWrapper}>
              <span
                className={cn(styles.promiseStatus, {
                  [styles['promiseStatus--pending']]: promises === 'pending',
                })}
              >
                {promises}
                {this._getPromiseTimeDiff()}
              </span>
            </span>
          )}
        </td>
        <td className={styles.timeWrapper}>
          <span className={styles.time}>
            {id === zeroId
              ? this._getTime(time)
              : this._getTimeDiff(zeroTime, time)}
          </span>
        </td>
      </tr>
    );
  }

  onSelect() {
    const { setSelected, entry } = this.props;

    setSelected(entry.id);
  }

  _getTime(t) {
    const d = new Date(t);

    return (
      this._pad(d.getHours()) +
      ':' +
      this._pad(d.getMinutes()) +
      ':' +
      this._pad(d.getSeconds()) +
      '.' +
      this._pad(Math.round(d.getMilliseconds() / 10))
    );
  }

  _getTimeDiff(t1, t2) {
    let diff = t2 - t1;

    let ms = diff % 1000;
    diff = (diff - ms) / 1000;
    let secs = diff % 60;
    diff = (diff - secs) / 60;
    let mins = diff % 60;
    let hrs = ((diff - mins) / 60) % 24;

    return (
      '+' +
      (hrs ? this._pad(hrs) + ':' : '') +
      this._pad(mins) +
      ':' +
      this._pad(secs) +
      '.' +
      this._pad(ms)
    );
  }

  _getPromiseTimeDiff() {
    const { messages } = this.props.entry;
    const lastMessage = messages[Math.max(messages.length - 1, 0)];

    if (
      lastMessage.payload.promises &&
      lastMessage.payload.promises === 'resolved'
    ) {
      return ` ${lastMessage.payload.time - messages[0].payload.time}ms`;
    }

    return '';
  }

  _pad(value) {
    return ('00' + value).slice(-2);
  }

  _parseLabel(label) {
    const parts = label.split(':');

    return {
      shortLabel: parts[0].split('/').pop(),
      event: parts[2] || '',
    };
  }
}
