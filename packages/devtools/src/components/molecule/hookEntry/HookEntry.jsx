import { HookType } from '@/utils';
import { Tooltip } from '@reach/tooltip';
import Editor from '@uiw/react-textarea-code-editor';
import cn from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import { IconButton } from '@/components/atom';

import styles from './hookEntry.module.less';

export default class HookEntry extends React.PureComponent {
  static get propTypes() {
    return {
      id: PropTypes.string,
      hook: HookType,
      toggleHook: PropTypes.func,
      deleteHook: PropTypes.func,
      alertSuccess: PropTypes.func,
      openHook: PropTypes.func,
      showConfirmModal: PropTypes.func,
      editable: PropTypes.bool,
    };
  }

  static defaultProps() {
    return {
      editable: false,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      name: props.hook.name,
      description: props.hook.description,
      code: props.hook.code,
    };
  }

  render() {
    const { opened } = this.props.hook;

    return (
      <div
        className={cn(styles.container, {
          [styles['container--opened']]: opened,
        })}
      >
        {this._renderEntry()}
        {this._renderForm()}
      </div>
    );
  }

  _renderEntry() {
    const { editable } = this.props;
    const { enabled } = this.props.hook;
    const { name, description } = this.state;

    return (
      <div onClick={e => this.onOpen(e)} className={styles.infoWrapper}>
        <div className={styles.hookInfo}>
          <h4>{name}</h4>
          <p>{description}</p>
        </div>
        <div className={styles.actions}>
          {editable && (
            <>
              <Tooltip label={enabled ? 'Disable hook' : 'Enable hook'}>
                <span>
                  <IconButton
                    name='enable'
                    color={enabled ? 'success' : 'danger'}
                    onClick={e => this.onEnable(e)}
                  />
                </span>
              </Tooltip>
              <Tooltip label='Delete hook'>
                <span>
                  <IconButton name='trash' onClick={e => this.onDelete(e)} />
                </span>
              </Tooltip>
            </>
          )}
        </div>
      </div>
    );
  }

  _renderForm() {
    const { editable, hook } = this.props;
    const { name, description, code } = this.state;
    const { id, opened } = hook;

    return (
      <div
        className={cn(styles.formWrapper, {
          [styles['formWrapper--opened']]: opened,
        })}
      >
        <input
          onChange={e => this.onChange(e)}
          disabled={!editable}
          name={`name__${id}`}
          value={name}
          className={styles.input}
          type='text'
          placeholder='Name'
        />
        <input
          onChange={e => this.onChange(e)}
          disabled={!editable}
          name={`description__${id}`}
          value={description}
          className={styles.input}
          type='text'
          placeholder='Description'
        />
        <Editor
          name={`code__${id}`}
          disabled={!editable}
          language='js'
          className={cn(styles.input, styles.codeInput)}
          placeholder='// code'
          value={code}
          onChange={event => this.setState({ code: event.target.value })}
          padding={10}
          style={{
            overflow: 'auto',
          }}
        />
      </div>
    );
  }

  onChange({ target: { value, name } }) {
    this.setState({
      [name.split('__')[0]]: value,
    });
  }

  onDelete(e) {
    e.preventDefault();
    e.stopPropagation();

    const { deleteHook, hook, alertSuccess, showConfirmModal } = this.props;

    showConfirmModal({
      body: (
        <p>
          Are you sure you <strong>want to delete</strong> &#x27;{hook.name}
          &#x27; hook?
        </p>
      ),
      accept: () => {
        deleteHook(hook.id);
        alertSuccess(`'${hook.name}' hook was deleted.`);
      },
    });
  }

  onEnable(e) {
    e.preventDefault();
    e.stopPropagation();

    const { toggleHook, hook, alertSuccess } = this.props;

    toggleHook(hook.id);
    alertSuccess(
      `'${hook.name}' hook was ${hook.enabled ? 'disabled' : 'enabled'}.`
    );
  }

  onOpen(e) {
    e.preventDefault();

    const { openHook, hook } = this.props;

    openHook(hook.id);
  }
}
