import { getCurrentTab } from '@/utils';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import React from 'react';

import { Loader } from '@/components/atom';
import { SplitPane } from '@/components/organism';
import { Actions } from '@/constants';

import styles from './panel.module.less';

/**
 * Wait time for debounce function for adding new entries in batches. Usually we receive
 * several messages from content script in matter of few ms. So for performance we cache
 * these messages and then add them to the global state in batches.
 *
 * @type {number} Wait time in ms.
 */
const DEBOUNCE_ADD_ENTRIES = 50;

export default class Panel extends React.PureComponent {
  static get propTypes() {
    return {
      isLoading: PropTypes.bool,
      status: PropTypes.string,
      alive: PropTypes.func,
      dead: PropTypes.func,
      reload: PropTypes.func,
      unsupported: PropTypes.func,
      clearEntries: PropTypes.func,
      addEntries: PropTypes.func,
      selectNext: PropTypes.func,
      selectPrevious: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);

    this.port = null;
    this.cachedEntries = [];

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMessage = this.onMessage.bind(this);

    this._batchAddEntries = debounce(() => {
      this.props.addEntries(this.cachedEntries.slice());
      this.cachedEntries = [];
    }, DEBOUNCE_ADD_ENTRIES);
  }

  async componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);

    try {
      // Initialize connection with background script
      const { tabId } = await getCurrentTab();
      this.port = chrome.runtime.connect({
        name: `panel:${tabId.toString()}`,
      });

      // Assign listeners
      this.port.onMessage.addListener(this.onMessage);
      this.port.onDisconnect.addListener(() => {
        this.port.onMessage.removeListener(this.onMessage);
      });
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const { isLoading, status, error } = this.props;

    if (isLoading) {
      return <Loader title={status} />;
    } else if (error) {
      return <h4 className={styles.error}>{error}</h4>;
    }

    return <SplitPane />;
  }

  componentWillUnmount() {
    this.port.disconnect();
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown({ keyCode }) {
    const { selectNext, selectPrevious } = this.props;

    if (keyCode === 38) {
      selectPrevious();
    } else if (keyCode === 40) {
      selectNext();
    }
  }

  onMessage(msg) {
    const { alive, clearEntries, reload, dead, unsupported } = this.props;

    switch (msg.action) {
      case Actions.ALIVE:
        alive();
        break;

      case Actions.RELOADING:
        reload();
        clearEntries();
        break;

      case Actions.UNSUPPORTED:
        unsupported();
        break;

      case Actions.DEAD:
        dead();
        clearEntries();
        break;

      case Actions.MESSAGE:
        this.cachedEntries.push(msg);
        this._batchAddEntries();
        break;
    }
  }
}
