import PropTypes from 'prop-types';

import Icons from './icons';

export default class Icon extends React.PureComponent {
  static get propTypes() {
    return {
      name: PropTypes.string.isRequired,
    };
  }

  render() {
    const { name } = this.props;
    const Component = Icons[name];

    return <Component />;
  }
}
