import styles from './search.less';
import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import cn from 'clsx';
import Tooltip from '@reach/tooltip';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';

import Icon from 'components/atom/icon/Icon';

/**
 * Wait time for debounce function for setting search query into global state.
 * Generally we want to wait till user finishes typing query and then set it globally
 * for filtering. There's no point doing this on every new key typed.
 *
 * @type {number} Wait time in ms.
 */
const DEBOUNCE_SET_QUERY = 250;

export default class Search extends React.PureComponent {
  static get propTypes() {
    return {
      entriesLength: PropTypes.number,
      showingLength: PropTypes.number,
      searchQuery: PropTypes.string,
      hasNext: PropTypes.bool,
      hasPrevious: PropTypes.bool,
      clearEntries: PropTypes.func,
      setSearchQuery: PropTypes.func,
      selectNext: PropTypes.func,
      selectPrevious: PropTypes.func
    };
  }

  constructor(props) {
    super(props);

    this._setQuery = debounce(() => {
      const query = this._validateQuery(this.state.query);

      if (query !== null) {
        this.props.setSearchQuery(query);
        this.setState({ invalid: false });
      } else {
        this.setState({ invalid: true });
      }
    }, DEBOUNCE_SET_QUERY);

    this.state = {
      query: props.searchQuery,
      invalid: false
    };
  }

  render() {
    return (
      <div className={styles.toolbar}>
        {this._renderSearchInput()}
        <span className={styles.separator} />
        {this._renderActionButtons()}
        <span className={styles.separator} />
        {this._renderClearButton()}
        <span className={styles.separator} />
        {this._renderMenu()}
      </div>
    );
  }

  _renderSearchInput() {
    const { showingLength, entriesLength } = this.props;
    const { query, invalid } = this.state;

    return (
      <div className={styles.search}>
        <span
          className={cn(
            styles['icon'],
            styles['icon--large'],
            styles['icon--disabled']
          )}
        >
          <Icon name='search' />
        </span>
        <input
          type='text'
          value={query}
          onChange={e => this.onChange(e)}
          className={cn(styles.searchInput, {
            [styles['searchInput--invalid']]: invalid
          })}
          placeholder='Search (text or /regex/)'
        />
        <span className={styles.showing}>
          showing&nbsp;{showingLength}/{entriesLength}&nbsp;items
        </span>
      </div>
    );
  }

  _renderActionButtons() {
    const { hasNext, hasPrevious, selectNext, selectPrevious } = this.props;
    const { query } = this.state;

    return (
      <>
        <Tooltip label='Select previous item'>
          <button
            disabled={!hasPrevious}
            onClick={selectPrevious}
            className={cn(styles.btn, styles.icon)}
          >
            <Icon name='arrowUp' />
          </button>
        </Tooltip>
        <Tooltip label='Select next item'>
          <button
            disabled={!hasNext}
            onClick={selectNext}
            className={cn(styles.btn, styles.icon)}
          >
            <Icon name='arrowDown' />
          </button>
        </Tooltip>
        <Tooltip label='Clear search'>
          <button
            disabled={query.length <= 0}
            onClick={e => this.onClear(e)}
            className={cn(styles.btn, styles.icon)}
          >
            <Icon name='close' />
          </button>
        </Tooltip>
      </>
    );
  }

  _renderClearButton() {
    const { clearEntries } = this.props;

    return (
      <Tooltip label='Clear entries'>
        <button onClick={clearEntries} className={cn(styles.btn, styles.icon)}>
          <Icon name='reset' />
        </button>
      </Tooltip>
    );
  }

  _renderMenu() {
    return (
      <Menu>
        <Tooltip label='More options'>
          <MenuButton className={cn(styles.btn, styles.icon)}>
            <Icon name='more' />
          </MenuButton>
        </Tooltip>
        <MenuList>
          <MenuItem onSelect={() => chrome.runtime.openOptionsPage()}>
            <span className='menu-item__label'>Settings</span>
            <Icon name='cog' />
          </MenuItem>
        </MenuList>
      </Menu>
    );
  }

  onChange({ target: { value } }) {
    this.setState(
      {
        query: value
      },
      this._setQuery
    );
  }

  onClear(e) {
    e.preventDefault();

    this.props.setSearchQuery('');
    this.setState({
      query: ''
    });
  }

  _validateQuery(query) {
    try {
      if (query[0] !== '/') {
        return query;
      } else {
        // Ignore search if regexp is not yet complete or invalid
        if (!/\/[\s\S]+\/[\s\S]*/.test(query)) {
          return null;
        }

        // Test if regexp is correct
        // eslint-disable-next-line no-constant-condition
        if (new RegExp(query)) {
          return query;
        }
      }
    } catch (e) {
      return null;
    }
  }
}
