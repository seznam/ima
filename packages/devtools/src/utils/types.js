import PropTypes from 'prop-types';

const PresetType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  hooks: PropTypes.object,
});

const HookType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  code: PropTypes.string,
  enabled: PropTypes.bool,
  opened: PropTypes.bool,
});

const EntryType = PropTypes.shape({
  id: PropTypes.string,
  selected: PropTypes.bool,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      payload: PropTypes.object,
    })
  ),
});

export { EntryType, HookType, PresetType };
