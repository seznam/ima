import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  code: PropTypes.string,
  enabled: PropTypes.bool,
  opened: PropTypes.bool
});
