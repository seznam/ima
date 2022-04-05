import PropTypes from 'prop-types';

import { EntryListItemContainer } from '@/components/molecule';

import style from './entryList.less';

export default class EntryList extends React.PureComponent {
  static get propTypes() {
    return {
      entryIds: PropTypes.arrayOf(PropTypes.string),
    };
  }

  render() {
    const { entryIds } = this.props;

    if (entryIds.length <= 0) {
      return null;
    }

    return (
      <div className={style.container}>
        <table className={style.table}>
          <tbody>
            {entryIds.map(id => {
              return <EntryListItemContainer id={id} key={id} />;
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
