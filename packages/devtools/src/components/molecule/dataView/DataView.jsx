import { EntryType } from '@/utils';
import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import { JsonView } from '@/components/atom';

import styles from './dataView.module.less';

export const TAB_SIZE = 3;

export default class DataView extends React.PureComponent {
  static get propTypes() {
    return {
      entry: EntryType,
    };
  }

  static get defaultProps() {
    return {
      entry: null,
    };
  }

  get messages() {
    const { messages } = this.props.entry;

    return messages.length > 1 ? messages : messages[0];
  }

  constructor(props) {
    super(props);

    this.onKeyDown = this.onKeyDown.bind(this);

    this.state = {
      tabIndex: 0,
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  render() {
    const { tabIndex } = this.state;
    const { entry } = this.props;

    if (!entry) {
      return null;
    }

    const [args, payload] = this._getState();

    return (
      <Tabs
        selectedIndex={tabIndex}
        onSelect={tabIndex => this.setState({ tabIndex })}
      >
        <TabList>
          <Tab>Args</Tab>
          <Tab>Payload</Tab>
          <Tab>Events</Tab>
        </TabList>
        <TabPanel>
          {args ? (
            <JsonView src={args} collapse={3} />
          ) : (
            <div className={styles.info}>Event&apos;s args are empty</div>
          )}
        </TabPanel>
        <TabPanel>
          {payload ? (
            <JsonView src={payload} collapse={3} />
          ) : (
            <div className={styles.info}>Event&apos;s payload is empty</div>
          )}
        </TabPanel>
        <TabPanel>
          <JsonView src={this.messages} collapse={4} />
        </TabPanel>
      </Tabs>
    );
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown({ keyCode }) {
    const { tabIndex } = this.state;

    if (keyCode === 37 && tabIndex > 0) {
      // Arrow left
      this.setState({
        tabIndex: tabIndex - 1,
      });
    } else if (keyCode === 39 && tabIndex + 1 < TAB_SIZE) {
      // Arrow right
      this.setState({
        tabIndex: tabIndex + 1,
      });
    }
  }

  _getState() {
    const { messages } = this.props.entry;
    const { state } = messages[Math.max(messages.length - 1, 0)].payload;

    return ['args', 'payload'].map(key => {
      return state &&
        state[key] &&
        ((Array.isArray(state[key]) && state[key].length > 0) ||
          Object.keys(state[key]).length > 0)
        ? state[key]
        : null;
    });
  }
}
