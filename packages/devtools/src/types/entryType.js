import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.string,
  selected: PropTypes.bool,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      payload: PropTypes.object
    })
  )
});
