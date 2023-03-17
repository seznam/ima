/* eslint-disable react/jsx-no-target-blank */
import { getSettings, setSettings } from '@/utils';
import uid from 'easy-uid';
import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@/components/atom';
import { HookEntryContainer } from '@/components/molecule';
import { PresetsModalContainer } from '@/components/organism';

import styles from './options.module.less';

export default class Options extends React.PureComponent {
  static propTypes() {
    return {
      hookIds: PropTypes.arrayOf(PropTypes.number),
      selectedPresetId: PropTypes.string,
      presets: PropTypes.object,
      setPresets: PropTypes.func,
      addHook: PropTypes.func,
      alertSuccess: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      modalOpened: false,
    };
  }

  get isEditable() {
    const { presets, selectedPresetId } = this.props;

    return !!(
      presets &&
      selectedPresetId &&
      presets[selectedPresetId].editable
    );
  }

  async componentDidMount() {
    const { setPresets } = this.props;
    const { presets, selectedPresetId } = await getSettings();

    setPresets({
      presets,
      selectedPresetId,
    });
  }

  render() {
    const { modalOpened } = this.state;
    const { hookIds } = this.props;

    return (
      <div className={styles.container}>
        <PresetsModalContainer
          onClose={e => this.onModalClose(e)}
          opened={modalOpened}
        />

        <form onSubmit={e => this.onSubmit(e)} className={styles.form}>
          {this._renderHeader()}
          <div className={styles.hooksWrapper}>
            {hookIds &&
              hookIds.map(id => {
                return (
                  <HookEntryContainer
                    editable={this.isEditable}
                    id={id}
                    key={id}
                  />
                );
              })}
          </div>
          {this._renderFooter()}
        </form>
      </div>
    );
  }

  _renderHeader() {
    const { presets, selectedPresetId } = this.props;

    return (
      <div className={styles.header}>
        <div>
          <h1>Hooks settings</h1>
          <p>
            IMA.js developer tools works by wrapping certain methods in a
            proxy-like functions which sends information to the devtools prior
            to it&#x27;s execution.
          </p>
          <p>
            Since wrapping all functions in your application would produce too
            much clutter in the output, we provide default set of hooks which
            you can customize, turn on/off or completely remove to suit your
            needs.{' '}
            <a
              href='https://imajs.io/docs/devtools-introduction'
              target='_blank'
            >
              For more information about devtools, visit imajs.io
            </a>
            .
          </p>
        </div>

        <div className={styles.actionsWrapper}>
          {this.isEditable && (
            <Button onClick={e => this.onAdd(e)} color='primary'>
              Add Hook
            </Button>
          )}
          <div className={styles.loadPresetsWrapper}>
            <p>
              <span className={styles.presetsLabel}>Current preset:</span>{' '}
              {selectedPresetId && presets[selectedPresetId].name}
            </p>
            <Button onClick={e => this.onLoadPreset(e)}>
              Load or Create Preset
            </Button>
          </div>
        </div>
      </div>
    );
  }

  _renderFooter() {
    return (
      <div className={styles.footer}>
        {!this.isEditable && (
          <p className={styles.notEditable}>
            Current preset is not editable, please create new one by clicking on
            &#x27;Load or Create Preset&#x27; button.
          </p>
        )}
        <Button className={styles.saveBtn} color='success' type='submit'>
          Save Changes
        </Button>
      </div>
    );
  }

  onAdd(e) {
    e.preventDefault();
    const { addHook } = this.props;

    addHook(this._createHook());
  }

  onLoadPreset(e) {
    e.preventDefault();

    this.setState({
      modalOpened: true,
    });
  }

  onModalClose() {
    this.setState({
      modalOpened: false,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const { presets, selectedPresetId, alertSuccess } = this.props;
    const groupedData = {};
    const formData = new FormData(e.target);

    // Get changes from state
    for (let [key, value] of formData.entries()) {
      const [name, id] = key.split('__');

      if (!groupedData[id]) {
        groupedData[id] = {};
      }

      groupedData[id][name] = value;
    }

    const hooks = presets[selectedPresetId].hooks;

    // Merge with global redux state
    for (let id in hooks) {
      groupedData[id] = {
        ...hooks[id],
        ...groupedData[id],
        opened: false,
      };
    }

    // Create new presets object with new data
    const newPresets = { ...presets };
    newPresets[selectedPresetId] = {
      ...newPresets[selectedPresetId],
      ...{ hooks: groupedData },
    };

    // Save settings to storage
    setSettings({
      presets: newPresets,
      selectedPresetId,
    });

    alertSuccess('Changes were saved.');
  }

  _createHook() {
    const id = uid();
    const displayId = id.substring(0, 6);

    return {
      id,
      enabled: false,
      opened: false,
      name: `Hook - ${displayId}`,
      description: `Description for hook - ${displayId}`,
      code: '',
    };
  }
}
