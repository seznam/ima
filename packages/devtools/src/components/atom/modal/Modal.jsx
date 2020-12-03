import styles from './modal.less';
import ReactDOM from 'react-dom';
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'clsx';

import Icon from 'components/atom/icon/Icon';

export const HIDE_ANIMATION_DURATION = 200;
export const BODY_STYLES =
  'overflow: hidden !important; position: relative !important;';

export default class Modal extends React.PureComponent {
  static get propTypes() {
    return {
      children: PropTypes.any,
      opened: PropTypes.bool.isRequired,
      title: PropTypes.string,
      onClose: PropTypes.func,
      className: PropTypes.string
    };
  }

  static get defaultProps() {
    return {
      className: ''
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  constructor(props) {
    super(props);

    this.rootNode = document.body;
    this.onKeyDown = this.onKeyDown.bind(this);

    this.state = {
      closing: false
    };
  }

  componentDidUpdate(prevProps) {
    // Add body styles when opened and remove when closed
    if (this.props.opened !== prevProps.opened) {
      if (prevProps.opened === false) {
        this._addBodyStyles();
      } else {
        this._removeBodyStyles();

        // Initiate closing animation
        this.setState({
          closing: true
        });

        setTimeout(() => {
          this.setState({
            closing: false
          });
        }, HIDE_ANIMATION_DURATION);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  render() {
    const { closing } = this.state;
    const { opened } = this.props;

    // Render null only when closed and animation finished
    if (!opened && !closing) {
      return null;
    }

    return ReactDOM.createPortal(this._renderModal(), this.rootNode);
  }

  _renderModal() {
    const { closing } = this.state;
    // eslint-disable-next-line no-unused-vars
    const { title, className, onClose, children, opened, ...rest } = this.props;

    return (
      <div className={styles.wrapper}>
        <div
          onClick={onClose}
          className={cn(styles.overlay, {
            [styles['overlay--closing']]: closing
          })}
        />
        <div
          className={cn(
            styles.modal,
            {
              [styles['modal--closing']]: closing
            },
            className
          )}
          {...rest}>
          {this._renderModalHeader()}
          {children}
        </div>
      </div>
    );
  }

  _renderModalHeader() {
    const { title, onClose } = this.props;

    return (
      <div className={styles.header}>
        <h4>{title}</h4>
        <button onClick={onClose} className={styles.closeIcon}>
          <Icon name="close" />
        </button>
      </div>
    );
  }

  onKeyDown(e) {
    // Close modal on ESC key
    if (e.keyCode === 27) {
      this.props.onClose(e);
    }
  }

  _removeBodyStyles() {
    document.body.style.cssText = '';
  }

  _addBodyStyles() {
    document.body.style.cssText = BODY_STYLES;
  }
}
