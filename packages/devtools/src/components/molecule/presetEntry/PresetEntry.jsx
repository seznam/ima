import { PresetType } from '@/utils';
import { Tooltip } from '@reach/tooltip';
import PropTypes from 'prop-types';
import React from 'react';

import { IconButton } from '@/components/atom';

import styles from './presetEntry.module.less';

export default class PresetEntry extends React.PureComponent {
  static get propTypes() {
    return {
      id: PropTypes.string.isRequired,
      preset: PresetType,
      onClick: PropTypes.func,
      renamePreset: PropTypes.func,
      copyPreset: PropTypes.func,
      deletePreset: PropTypes.func,
      alertSuccess: PropTypes.func,
      showConfirmModal: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      editable: false,
      name: props.preset.name,
    };
  }

  render() {
    const { editable: presetEditable } = this.props.preset;
    const { editable } = this.state;

    return (
      <div onClick={e => this.onClick(e)} className={styles.wrapper}>
        {editable && presetEditable ? this._renderForm() : this._renderPreset()}
      </div>
    );
  }

  _renderPreset() {
    const { name, editable, selected } = this.props.preset;

    return (
      <>
        {selected ? <strong>{name}</strong> : <span>{name}</span>}
        <div className={styles.actions}>
          <Tooltip label='Duplicate preset'>
            <span>
              <IconButton onClick={e => this.onCopy(e)} name='copy' />
            </span>
          </Tooltip>
          {editable && (
            <>
              <Tooltip label='Edit preset'>
                <span>
                  <IconButton onClick={e => this.onEdit(e)} name='edit' />
                </span>
              </Tooltip>
              <Tooltip label='Delete preset'>
                <span>
                  <IconButton onClick={e => this.onDelete(e)} name='trash' />
                </span>
              </Tooltip>
            </>
          )}
        </div>
      </>
    );
  }

  _renderForm() {
    const { name } = this.state;

    return (
      <>
        <input onChange={e => this.onChange(e)} value={name} type='text' />
        <div className={styles.actions}>
          <Tooltip label='Confirm changes'>
            <span>
              <IconButton
                onClick={e => this.onConfirm(e)}
                color='success'
                name='check'
              />
            </span>
          </Tooltip>
          <Tooltip label='Discard changes'>
            <span>
              <IconButton
                onClick={e => this.onDiscard(e)}
                color='danger'
                name='close'
              />
            </span>
          </Tooltip>
        </div>
      </>
    );
  }

  onChange({ target: { value } }) {
    this.setState({
      name: value,
    });
  }

  onClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const { onClick } = this.props;
    const { editable } = this.state;

    if (editable) {
      return;
    }

    onClick();
  }

  onConfirm(e) {
    e.preventDefault();
    e.stopPropagation();

    const { name } = this.state;
    const { renamePreset, id } = this.props;

    renamePreset({ id, name });
    this.setState({
      editable: false,
    });
  }

  onCopy(e) {
    e.preventDefault();
    e.stopPropagation();

    const { copyPreset, id } = this.props;

    copyPreset(id);
  }

  onEdit(e) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      editable: true,
    });
  }

  onDelete(e) {
    e.preventDefault();
    e.stopPropagation();

    const { name } = this.props.preset;
    const { showConfirmModal, deletePreset, id, alertSuccess } = this.props;

    showConfirmModal({
      body: (
        <p>
          Are you sure you <strong>want to delete</strong> &#x27; {name}
          &#x27; preset?
        </p>
      ),
      accept: () => {
        deletePreset(id);
        alertSuccess(`Preset '${name}' was deleted.`);
      },
    });
  }

  onDiscard(e) {
    e.preventDefault();
    e.stopPropagation();

    const { name } = this.props.preset;

    this.setState({
      name,
      editable: false,
    });
  }
}
