import PropTypes from 'prop-types';

import Icons from './icons';

export default function Icon({ name }) {
  const Component = Icons[name];

  return <Component />;
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
};
