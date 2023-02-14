import { setSettings } from '@/utils';
import uid from 'easy-uid';
import PropTypes from 'prop-types';
import React from 'react';

import { Button, Modal, ModalFooter } from '@/components/atom';
import { PresetEntryContainer } from '@/components/molecule';

import styles from './presetsModal.module.less';

export default class PresetsModal extends React.PureComponent {
  static get propTypes() {
    return {
      presets: PropTypes.object,
      selectedPresetId: PropTypes.string,
      opened: PropTypes.bool.isRequired,
      addPreset: PropTypes.func,
      selectPreset: PropTypes.func,
      alertSuccess: PropTypes.func,
      onClose: PropTypes.func.isRequired,
    };
  }

  render() {
    const { opened, onClose } = this.props;

    return (
      <Modal
        onClose={onClose}
        title={'Presets'}
        className={styles.modal}
        opened={opened}
      >
        {this._renderModalBody()}
        {this._renderModalFooter()}
      </Modal>
    );
  }

  _renderModalBody() {
    const { presets } = this.props;

    return (
      <div className={styles.body}>
        {Object.keys(presets).map(id => {
          return (
            <PresetEntryContainer
              onClick={() => this.onSelect(id)}
              key={id}
              id={id}
            />
          );
        })}
      </div>
    );
  }

  _renderModalFooter() {
    const { onClose } = this.props;

    return (
      <ModalFooter className={styles.footer}>
        <Button onClick={e => this.onSaveChanges(e)} color='success'>
          Save Preset Changes
        </Button>
        <div>
          <Button onClick={e => this.onCreatePreset(e)} color='primary'>
            Create Preset
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </ModalFooter>
    );
  }

  onCreatePreset(e) {
    e.preventDefault();
    const { addPreset } = this.props;

    addPreset(this._createPreset());
  }

  onSaveChanges(e) {
    e.preventDefault();
    const { presets, selectedPresetId, alertSuccess } = this.props;

    setSettings({
      presets,
      selectedPresetId,
    });

    alertSuccess('Changes made to the presets were saved.');
  }

  onSelect(id) {
    const { selectPreset, onClose } = this.props;

    selectPreset(id);
    onClose();
  }

  _createPreset() {
    const id = uid();

    return {
      id,
      name: `Preset - ${id.substring(0, 6)}`,
      editable: true,
      selected: false,
      hooks: {},
    };
  }
}
