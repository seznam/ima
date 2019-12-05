import './panel.less';
import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import { getCurrentTab } from 'services/utils';
import Actions from 'constants/actions';
import SplitPane from 'components/organism/splitPane/SplitPane';
import Loader from 'components/atom/loader/Loader';

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
      clearEntries: PropTypes.func,
      addEntries: PropTypes.func,
      selectNext: PropTypes.func,
      selectPrevious: PropTypes.func
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
        name: `panel:${tabId.toString()}`
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
    const { isLoading, status } = this.props;

    if (isLoading) {
      return <Loader title={status} />;
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
    const { alive, clearEntries, reload, dead } = this.props;

    if (msg.action === Actions.ALIVE) {
      alive();
    } else if (msg.action === Actions.RELOADING) {
      reload();
      clearEntries();
    } else if (msg.action === Actions.DEAD) {
      dead();
      clearEntries();
    } else if (msg.action === Actions.MESSAGE) {
      this.cachedEntries.push(msg);
      this._batchAddEntries();
    }
  }
}
